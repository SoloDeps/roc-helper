# Domaine : couche Dynamic

Types couverts : `DynamicActionChangeDefinitionDTO` (1 403), `DynamicFloatValueDefinitionDTO` (372),
`DynamicLuaLongDefinitionDTO` (164), `DynamicUnitStatChangeDefinitionDTO` (55),
`DynamicUnitCostDefinitionDTO` (36), `DynamicLimitDefinitionDTO` (2). **Total : 2 032 entités, 4,2 Mo.**
Prérequis de lecture : [`00-conventions.md`](00-conventions.md).

Ce n'est pas un domaine de jeu mais un **mécanisme de paramétrage transversal** : une table
d'indirection qui exprime « telle valeur dépend de telle variable de contexte ». Les autres domaines
n'y stockent qu'un id.

---

## 1. Forme générale

Toutes les définitions dynamiques (sauf `Lua` et `Limit`) suivent le même patron à 3 étages :

```
<XxxDefinitionDTO>              ← l'entité racine, porte l'id référencé de l'extérieur
  └── mapping                   ← 1 DynamicChangeDTO : QUELLE variable indexe la valeur
        ├── values[]            ← la table : { when: <clé>, then: <payload> }
        └── dynamicFormulaChangeCase?  ← variante formule, alternative/complément à values[]
```

Le **payload de `then` est déterminé par le type de la définition racine**, sans exception :

| Définition racine | n | Payload `then` | occ. |
|---|---|---|---|
| `DynamicActionChangeDefinitionDTO` | 1 403 | `ActionChangeDTO` | 10 260 |
| `DynamicFloatValueDefinitionDTO` | 372 | `DynamicFloatValueDTO` | 3 157 |
| `DynamicUnitStatChangeDefinitionDTO` | 55 | `DynamicStateChangeDTO` | 904 |
| `DynamicUnitCostDefinitionDTO` | 36 | `UnitCostDTO` | 102 |

⚠️ **Le champ `mapping` n'a pas la même cardinalité JSON selon le type racine** :

| Type | `mapping` | Observé |
|---|---|---|
| `DynamicActionChangeDefinitionDTO` | **liste** | 1 403/1 403 ont exactement 1 élément |
| `DynamicUnitStatChangeDefinitionDTO` | **liste** | 55 définitions → 55 éléments |
| `DynamicFloatValueDefinitionDTO` | **objet** | — |
| `DynamicUnitCostDefinitionDTO` | **objet** | — |
| `DynamicLuaLongDefinitionDTO`, `DynamicLimitDefinitionDTO` | **absent** | — |

La liste de `DynamicActionChangeDefinitionDTO` n'a **jamais** plus d'un élément dans ces données. Le
schéma protobuf autorise donc `repeated` là où l'objet est unique en pratique. **Modéliser comme
liste** (c'est ce que dit le contrat), en notant que le cas > 1 n'est pas exercé.

---

## 2. `mapping` — les 9 variables d'indexation

`DynamicChangeDTO` est une union polymorphe. Le `@type` dit **quelle variable de contexte** sert de
clé ; le domaine des `when` en découle. **Tous les `when` sont des `string`**, y compris les numériques
(cf. C3).

| `@type` | Domaine de `when` | Utilisé par (n) |
|---|---|---|
| `BuildingLevelDynamicChangeDTO` | `"1"`…`"60"` — 60 clés numériques | DAC 1032, DFV 342, DUSC 35, + Boost 46 |
| `PlayerAgeDynamicChangeDTO` | 15 âges (tous sauf `ComingSoon`) | DAC 256, DUC 36, DFV 4, DUSC 1 |
| `BuildingAgeDynamicChangeDTO` | 14 âges (sans `ComingSoon` ni `DawnAge`) | DAC 85, DFV 19 |
| `SeasonPassAgeDynamicChangeDTO` | 14 âges | DAC 19 |
| `TreasureHuntAgeDynamicChangeDTO` | 14 âges | DUSC 15, DAC 4 |
| `EventIdDynamicChangeDTO` | 29 ids d'événement (`Event_Aztec`, `Event_Celts_2022`…) | DAC 7 |
| `WonderTagDynamicChangeDTO` | `"0"`…`"7"` | DFV 4, DUSC 4, + Boost 4 |
| `RelicCompletedCollectionsDynamicChangeDTO` | `"0"`…`"3"` | DFV 1 |
| `BazaarLevelDynamicChangeDTO` | `"1"`,`"2"`,`"3"`,`"5"` | DFV 1 |
| `RelicPowerDynamicChangeDTO` | *(pas de `values`)* | DFV 1 |

Champs propres au-delà de `values` / `dynamicFormulaChangeCase` :

- `SeasonPassAgeDynamicChangeDTO.event: string` — présent 19/19.
- `WonderTagDynamicChangeDTO.tag: "Nature" | "Naval" | "Palace"` — présent sur les 4+4 occurrences
  (et sur les 4 boosts, cf. `01-socle.md` §5.2).

⚠️ `BazaarLevelDynamicChangeDTO` a des `when` **`"1"`, `"2"`, `"3"`, `"5"` — le `"4"` manque.** Table
lacunaire : rien ne dit ce qui s'applique au niveau 4.

⚠️ `RelicPowerDynamicChangeDTO` (1 seule occurrence) **n'a pas de `values` du tout**, seulement un
`dynamicFormulaChangeCase`. C'est la seule variante purement formulaire. Son `variableName` est
`"power"` (et non `"level"`) et son `valueLimit` vaut `100000.0`.

⚠️ Ces types `DynamicChangeDTO` sont utilisés **à deux endroits** : référencés par id via une
définition racine (le cas normal), et **inline** dans `BoostDefinitionDTO.modifier` (50 occurrences,
cf. `01-socle.md` §5.2). Le modèle doit les définir une seule fois et les réutiliser.

---

## 3. Les 4 payloads de `then`

### 3.1 `ActionChangeDTO` — 10 260 occ.

Le payload le plus riche. Tous ses champs sont optionnels et se combinent.

```ts
interface ActionChange {                       // @type = ActionChangeDTO
  resourceChanges?: ResourceChange[];          // 7 658 — le cas dominant
  rewards?: Reward[];                          // 1 816 — ⚠️ HORS SCOPE, voir §7
  dynamicChangeDefinitionId?: string[];         //   775 — ⚠️ indirection récursive, voir §6
  costs?: Cost[];                              //    16 — union, voir 3.1.2
}
```

**3.1.1 `ResourceChange`** — objet monomorphe (pas de `@type`), 11 655 occurrences.

```ts
interface ResourceChange {
  definitionId: string;    // 11 655/11 655 — -> ResourceDefinition.id, 100 % résolus
  amount?: string;         // 10 650 — int64-en-string
  dynamicAmount?: string;  //     16 — -> DynamicLuaLongDefinition.id (exclusif avec `amount`)
}
```

`amount` et `dynamicAmount` sont mutuellement exclusifs : 10 650 + 16 = 11 666 ≈ 11 655 + 11 objets
portant les deux ou aucun — **écart de 11 non caractérisé**, à vérifier si ce champ devient critique.

**3.1.2 `costs[]`** — 16 occurrences seulement, union polymorphe à 2 variantes observées :

```ts
// @type = GoodCostDTO
{ number: 1|2|…, dynamicAmountId: string, dynamicOffsetId: string,
  dynamicGood: { number, dynamicAmountId, dynamicOffsetId } }   // -> DynamicLuaLongDefinition.id
// @type = ResourceDTO
{ definitionId: string, amount: string }
```

⚠️ `GoodCostDTO` duplique ses trois champs dans un sous-objet `dynamicGood` de structure identique.
Sur les exemples observés les valeurs sont **les mêmes des deux côtés**. Redondance non expliquée ;
ne pas supposer qu'ils peuvent diverger sans le vérifier.

⚠️ `GoodCostDTO.number` (1, 2, …) désigne un bien par **rang** et non par id — cohérent avec les
ressources `DYN|<Age>_Good1..3`. La résolution rang → ressource dépend de l'âge et **n'est pas dans
ces données**.

### 3.2 `DynamicFloatValueDTO` — 3 157 occ.

```ts
interface DynamicFloatValue {                  // @type = DynamicFloatValueDTO
  value?: number;                       // 2 862 — float
  dynamicValueDefinitionId?: string;    //   266 — -> DynamicFloatValueDefinition.id (indirection, §6)
}
```
Exclusifs : 2 862 + 266 = 3 128, soit **29 occurrences sans ni l'un ni l'autre**. Non caractérisées.

### 3.3 `DynamicStateChangeDTO` — 904 occ.

```ts
interface DynamicStateChange { factor: number }   // 887/904 portent `factor` (float)
```
⚠️ **17 occurrences sans `factor`** — objet vide. Sens indéterminé (neutre ? absence de bonus ?).

### 3.4 `UnitCostDTO` — 102 occ.

```ts
interface UnitCost {                    // @type = UnitCostDTO
  amount: string;              // 102/102 — int64-string
  unitType?: string;           // 101 — -> UnitDefinition.unitType (infantry|ranged|cavalry|heavyInfantry|siege)
  unitDefinitionId?: string;   //   1 — -> UnitDefinition.id
}
```
⚠️ Une seule occurrence sur 102 cible une unité précise plutôt qu'un type. Les deux champs sont
mutuellement exclusifs (101 + 1 = 102) : c'est un `oneof` de fait, non déclaré comme tel.

---

## 4. Lecture d'une table `values[]` — sémantique de PALIERS

**Vérifié : une table par niveau ne contient pas une clé par niveau.** Sur les 1 455 tables indexées
par `BuildingLevelDynamicChangeDTO` (DAC + DFV + DUSC + Boost) :

| Forme de la table | n | % |
|---|---|---|
| **Paliers** — clés manquantes dans l'intervalle | 607 | 42 % |
| **Une seule clé** | 640 | 44 % |
| Contiguë — une clé par niveau de `min` à `max` | 208 | 14 % |

Distribution des écarts entre clés consécutives : 1 → 2 529 fois, 2 → 2 906, 3 → 1 878, 4 → 950,
5 → 435, puis une longue traîne jusqu'à 40. L'écart 2 est **plus fréquent que l'écart 1** : la forme
tabulée dense est minoritaire.

Exemples réels :

```
Dac_Building_EventCeltic_Evolving_GrandSmithy_1_ProductionCosts_1_EarlyRome
    when = [1, 22, 42]
Dac_ProductionReward_EventMongols2023_Evolving_MongolianFeast_1_CEGoods_ClassicGreece
    when = [3, 6, 9, 13, 18, 23, 28, 33, 38]
Dv_Building_Event_Evolving_Generic_1_CultureRange
    when = [1, 20, 40, 60]          ← 4 clés pour 60 niveaux
```

### 4.1 ⚠️ Règle de lecture — palier inférieur ou égal, PAS correspondance exacte

> Pour lire la valeur applicable à un niveau `L`, il faut prendre l'entrée dont le `when` est **le
> plus grand parmi ceux ≤ L**. Une clé absente n'est **pas** une donnée manquante : elle signifie
> « identique au palier précédent ».

C'est la différence entre `table[L]` et `table[max{k ∈ clés | k ≤ L}]`. Un modèle ou un
consommateur qui ferait une correspondance exacte interpréterait 42 % des tables comme lacunaires,
et lirait « valeur absente » là où la donnée est en réalité complète et intentionnelle.

⚠️ **Cas limite : `L` inférieur à la plus petite clé.** 330 des 1 455 tables ne commencent pas au
niveau 1 (150 commencent à 2, 59 à 3, 31 à 15, 8 à 40, etc.), et 23 commencent à 0. Pour ces tables,
il n'existe **aucun palier applicable** en dessous de la première clé. Les données ne disent pas ce
qui s'applique dans cet intervalle. Non résolu — à ne pas combler par une extrapolation.

⚠️ **Anomalie ponctuelle : clés dupliquées.** Une table, et une seule, contient des `when` répétés
avec des valeurs différentes : `Dv_Building_SeasonPass_Evolving_GreatGarden_1_CultureValues_AgeOfTheFranks`
a 17 clés en double (`"3"` → 116.0 **et** 126.0, etc.). Ressemble à deux séries fusionnées par erreur.
`values[]` est donc une **liste**, pas une map : le modèle ne doit pas la typer comme un dictionnaire,
sous peine de perdre silencieusement une des deux valeurs.

---

## 5. `dynamicFormulaChangeCase` — la variante formule

1 136 occurrences. Trois variantes selon le type racine, **structurellement identiques à 2 champs près** :

| `@type` | Porteur | n | Champs |
|---|---|---|---|
| `DynamicFormulaActionChangeCaseDefinitionDTO` | DAC | 801 | `formula`, `variableName`, `valueLimit`, `resourceChanges?` (745), `rewards?` (56) |
| `DynamicFormulaValueCaseDefinitionDTO` | DFV | 311 | `formula`, `variableName`, `valueLimit` |
| `DynamicFormulaFloatCaseDefinitionDTO` | DUSC (12) + Boost (12) | 24 | `formula`, `variableName`, `valueLimit` |

```ts
interface DynamicFormulaCase {
  formula: string;         // expression arithmétique, variable préfixée par '#'
  variableName: string;    // "level" (1 135 occ.) | "power" (1 occ.)
  valueLimit: number;      // float : 60.0 (907) | 40.0 (228) | 100000.0 (1)
  resourceChanges?: { definitionId: string }[];   // DAC uniquement — SANS `amount` : la formule le fournit
  rewards?: Reward[];                             // DAC uniquement — ⚠️ hors scope, §7
}
```

⚠️ **Deux dénominateurs cohabitent dans cette section.** Les **1 136** occurrences ci-dessus comptent
tous les `dynamicFormulaChangeCase`, y compris les **12** portés par un mapping écrit **inline** dans
`BoostDefinitionDTO.modifier`. Les décomptes rapportés à une **définition dynamique racine** — dont
ceux du §5.2 — portent donc sur **1 124**. Les deux chiffres sont justes ; c'est le périmètre qui
change. (Les commentaires du bloc ci-dessus sont sur 1 136.)

Exemples réels : `"(#level * 2.8) + 74"`, `"(72000 / (1 + (0.11 * #level))) + 46000"`,
`"0.95 - (0.0085 * #level)"`, `"(#level / 20) + 1"`.

⚠️ **`formula` est une chaîne, non un arbre.** Hors schéma (cf. C8) : aucune grammaire n'est déclarée
dans les données. Elle a en revanche été **mesurée exhaustivement** — voir §5.3.

### 5.1 ✅ Articulation table / formule — RÉSOLU

**Question (ancien point D1) :** quand `values[]` et `dynamicFormulaChangeCase` coexistent (1 135
mappings), lequel prime ?

**Réponse établie par les données : la table couvre les niveaux bas, la formule prend le relais
au-delà du dernier niveau tabulé.** Trois mesures indépendantes concordent.

**(a) Le maximum tabulé ne dépasse jamais `valueLimit`.** Sur les 1 135 mappings où les deux
coexistent, sans une seule exception :

| | n |
|---|---|
| max tabulé **<** `valueLimit` | 1 121 |
| max tabulé **=** `valueLimit` | 14 |
| max tabulé **>** `valueLimit` | **0** |

**(b) La formule et la table décrivent des courbes différentes — la formule n'est pas une
redondance.** Formule évaluée sur chaque niveau tabulé, comparée à la valeur tabulée :

| Porteur | Concordance | Divergence |
|---|---|---|
| DAC | 957 | 5 274 |
| DFV | 456 | 2 046 |
| DUSC | 5 | 92 |
| Boost | 83 | 23 |

**(c) Test décisif — les deux courbes se rejoignent exactement à la jonction.** Écart relatif entre
formule et table, mesuré sur 170 séries DFV exploitables, au premier et au dernier niveau tabulé :

| Écart relatif | au **premier** niveau tabulé | au **dernier** niveau tabulé (la jonction) |
|---|---|---|
| < 0,1 % | 4 | **116** |
| < 1 % | 0 | 37 |
| < 5 % | 1 | 10 |
| < 25 % | 15 | 6 |
| ≥ 25 % | **150** | 1 |

148 séries sur 170 sont classées « diverge au début (> 5 %), converge à la jonction (< 1 %) ».
La formule est donc **calibrée pour prolonger la table à partir de son dernier point**, pas pour la
reproduire. Exemple : `Dv_Building_Collectable_CommanderTower_1_Duration` tabule 86 400 → 82 200 aux
niveaux 1→8 (valeurs rondes, −600/niveau) là où la formule
`(72000 / (1 + (0.11 * #level))) + 46000` donne 110 865 → 84 298 : franchement fausse au début,
convergente ensuite.

➡️ **Règle pour le modèle :** dans la plage tabulée, la table fait autorité (lecture par palier, §4.1).
Au-delà du dernier `when`, la formule fait autorité, jusqu'à `valueLimit`.

⚠️ **Réserve maintenue :** cette articulation est une conclusion inférée d'un faisceau de mesures
concordantes, **pas une règle déclarée dans les données**. Aucun champ n'exprime la priorité. Les 17
séries « écart partout » (ex. `Dv_Building_SeasonPass_Evolving_GreatGarden_1_CultureValues_LateGothicEra` :
table 92 vs formule 353 au niveau 1, table 860 vs formule 871 au niveau 38) restent non expliquées —
convergentes mais imparfaitement.

⚠️ **14 mappings tabulent jusqu'à `valueLimit` inclus**, rendant la formule sans plage d'application
(ex. `Dv_Building_Event_Evolving_Generic_1_CultureRange` : `when` = 1, 20, 40, 60 avec
`valueLimit` = 60). La formule y est redondante, pas contradictoire.

⚠️ `resourceChanges` dans un `DynamicFormulaCase` ne porte **que** `definitionId`, sans `amount`
(contrairement au `ResourceChange` du §3.1.1). Même nom de champ, forme différente selon le contexte :
c'est le mécanisme par lequel la formule fournit le montant.

### 5.2 ✅ Sémantique de `valueLimit` — RÉSOLU

**Question (ancien point D2) :** que signifie `valueLimit`, et pourquoi 60 alors que
`ConstantsDefinition.wonders.maximumWonderLevel` vaut 30 ?

**Réponse : `valueLimit` est la borne supérieure du domaine de la variable d'indexation** — pour
`variableName = "level"`, c'est le **niveau maximal du bâtiment concerné**. Il n'a aucun rapport avec
les wonders.

Vérification par accessibilité transitive : parcours du graphe de références depuis chaque
`BuildingDefinitionDTO` (sans traverser un autre bâtiment) vers les définitions dynamiques.
**986 des 1 124 définitions à `valueLimit` sont atteignables, et chacune l'est depuis un seul et
unique type de bâtiment — zéro mélange :**

| `valueLimit` | Définitions atteignables | Type de bâtiment | Pureté |
|---|---|---|---|
| 60.0 | 825 | `evolving` | 825 / 825 |
| 40.0 | 160 | `collectable` | 160 / 160 |
| 100000.0 | 1 | `cityHall` | 1 / 1 |

Et la correspondance est **confirmée directement par les bâtiments eux-mêmes** :

```
LevelUpComponentDTO.maxLevel = 60   sur les 44 bâtiments de type `evolving`
LevelUpComponentDTO.maxLevel = 40   sur les 17 bâtiments de type `collectable` qui en portent un
HeritageVaultDefinitionDTO.maxLevel = 60   sur les 13 vaults
```

Les 62 définitions à `valueLimit = 60` non rattachables à un bâtiment par le graphe sont toutes des
`Dac_Building_HeritageVault_*` — cohérent avec `HeritageVaultDefinitionDTO.maxLevel = 60`.

⚠️ **Piège important : `BuildingDefinitionDTO.level` vaut toujours 1 pour les `evolving`.** Le
« level » qui indexe ces tables n'est **pas** ce champ, mais le niveau d'instance runtime borné par
`LevelUpComponentDTO.maxLevel`. Deux notions distinctes portant le même nom — à ne pas confondre dans
le modèle Bâtiments.

⚠️ Le cas `valueLimit = 100000.0` est dégénéré : `Dv_Building_CityHall_CultureValues` porte un
mapping `RelicPowerDynamicChangeDTO` sans `values`, avec la formule identité `"(#power)"` et
`variableName = "power"`. Ici `valueLimit` est un plafond de saturation sur la puissance de reliques,
pas un niveau. La lecture générale « borne du domaine de la variable » couvre les trois cas ; la
lecture restreinte « niveau maximal » ne vaut que pour `variableName = "level"`.

➡️ **La contradiction apparente avec `maximumWonderLevel = 30` est levée** : aucune définition à
`valueLimit = 60` n'est rattachée à un wonder. Les deux plafonds portent sur des objets différents.

### 5.3 ✅ Grammaire de `formula` — MESURÉE ET IMPLÉMENTÉE

**Question (ancien point D4, volet `formula`) :** la grammaire n'étant pas déclarée, jusqu'où peut-on
aller sans deviner ?

Recensement exhaustif sur les **1 136** occurrences. **L'inventaire est clos, il n'y a rien d'autre :**

| | Observé |
|---|---|
| Jetons | `#level` · `#power` · `(` · `)` · `+` · `-` · `*` · `/` · nombres — 9, plus la virgule de la coquille D16 |
| Fonctions | **aucune** |
| Conditions, comparaisons, affectations | **aucune** |
| `variableName` | `"level"` 1 135 · `"power"` 1 |
| Formules distinctes | 700 |
| Formes distinctes (nombres normalisés) | 27 |

Ni `%`, ni `^`, ni virgule : la variante formule est un **sous-ensemble strict** de la
grammaire Lua du §6.1, aux trois différences mécaniques près — préfixe `#` sur la variable, pas de
`return` ni de `if` (expression nue), et un vocabulaire de variables disjoint.

C'est ce qu'implémente [`resolvers/lua-formula.ts`](../../resolvers/lua-formula.ts) : un tokenizer et
un parseur communs aux deux formats, deux entrées (`evaluateLuaFormula` / `evaluateCurveFormula`) et
deux vocabulaires étanches (`LUA_VARIABLES` / `CURVE_VARIABLES`).

**Résultat de la passe sur les données (2026-08-31)**, chaque expression évaluée aux niveaux
1, 2, 20, 40, 59 et 60 :

| Périmètre | Total | Évaluées | Échecs |
|---|---|---|---|
| `formula`, game design entier | 1 136 | **1 134** | 2 |
| `formula`, atteignables depuis les 44 `evolving` | 830 | **830** | 0 |
| `luaScript` (§6.1) | 164 | **164** | 0 |

Les 2 échecs globaux ne sont pas des trous de grammaire :

1. `"(#power)"` — `variableName = "power"`, hors du vocabulaire `CURVE_VARIABLES` volontairement
   restreint à `level`. Cas dégénéré déjà documenté au §5.2.
2. `"(86400 / (1 + (0,11 * #level))) + 40000"` — **virgule décimale**, cf. D16 ci-dessous.

⚠️ **Ce que ce résultat ne dit pas** : qu'une expression s'évalue ne prouve pas que le nombre obtenu
soit celui du jeu. Contrôle de vraisemblance sur les 160 séries `evolving` qui ont à la fois une table
et une formule, écart relatif **au dernier niveau tabulé** (la jonction prédite au §5.1) : 111 à moins
de 0,1 %, 35 à moins de 1 %, 9 à moins de 5 %, 4 à moins de 25 %, 1 au-delà. La courbe calculée
rejoint bien la table ; le résidu correspond aux séries de D14.

⚠️ La grammaire reste **mesurée, pas déclarée**. Une version ultérieure du game design peut
introduire un opérateur ou une fonction : l'évaluateur lèvera alors une erreur explicite plutôt que
de rendre un nombre faux, ce qui est le comportement voulu.

## 6. Indirections et récursivité

La couche se référence elle-même par trois chemins :

| Source | Cible | occ. |
|---|---|---|
| `ActionChangeDTO.dynamicChangeDefinitionId[]` | `DynamicActionChangeDefinition.id` | 775 |
| `DynamicFloatValueDTO.dynamicValueDefinitionId` | `DynamicFloatValueDefinition.id` | 266 |
| `ResourceChange.dynamicAmount`, `GoodCostDTO.dynamicAmountId`/`dynamicOffsetId` | `DynamicLuaLongDefinition.id` | 16 + 12 + 12 |

⚠️ `dynamicChangeDefinitionId` est une **liste** (`string[]`), pas un scalaire. Le modèle doit le
refléter même si les cas observés n'en contiennent qu'un.

⚠️ **Aucune borne de profondeur n'est déclarée** et rien n'interdit un cycle. Le modèle décrit un
graphe, pas un arbre ; toute exploitation ultérieure devra se prémunir contre les cycles.

### 6.1 `DynamicLuaLongDefinitionDTO` — n = 164

```ts
interface DynamicLuaLongDefinition {
  id: string;          // 164/164 — TOUJOURS préfixé "dynamic_lua_long." (espace `id`, pas `definitionId`)
  luaScript: string;   // 164/164
}
```

Exemple : `"return (entityLevel * 200000) - 4900000"`.

⚠️ **Hors schéma** (cf. C8) : le contexte Lua n'est **pas déclaré** dans les données. Il a en revanche
été recensé sur les 164 scripts, et l'inventaire est clos : 144 caractères au maximum, **4 variables**
(`entityLevel` 147, `keeperPurchaseCount` 29, `playerAgeOrder` 13, `entityAgeOrder` 1), **3 fonctions**
(`math.floor` 44, `math.ceil` 19, `math.max` 1), l'arithmétique `+ - * / % ^`, les comparaisons
`== <`, et au plus un bloc `if … then … else … end` (12 scripts).

Le sous-langage est donc **modélisable** : [`resolvers/lua-formula.ts`](../../resolvers/lua-formula.ts)
en est un évaluateur dédié — pas un interpréteur Lua — qui évalue les **164/164** (§5.3) et lève une
erreur explicite sur tout ce qui en sortirait. La chaîne reste opaque **au schéma** ; elle ne l'est
plus au modèle.

⚠️ Ces ids sont préfixés `dynamic_lua_long.` alors qu'ils vivent dans le champ `id` (et non
`definitionId`) — seul cas de préfixe en minuscules dans l'espace `id` pour ce domaine.

### 6.2 `DynamicLimitDefinitionDTO` — n = 2

```ts
interface DynamicLimitDefinition {
  definitionId: string;   // pas d'`id` (cf. C6)
  max: string;            // int64-en-string
}
```

Contenu exhaustif : `{LimitTradingGoods, max "400"}` et `{LimitTradingTokens, max "40000"}`.

⚠️ `LimitTradingTokens` est référencé une fois (`ResourceDefinition.traits[]:DynamicLimitTraitDTO`).
**`LimitTradingGoods` n'est référencé nulle part** dans les 12 122 entités. Sa valeur `400` coïncide
avec `ConstantsDefinition.trading.tradeOfferMaxTradeableAmount = 400` — coïncidence non confirmée par
un lien dans les données.

### 6.3 Orphelins

Hors auto-référence, **toutes les autres définitions dynamiques (2 030 sur 2 032) sont référencées au
moins une fois**. Seul orphelin : `LimitTradingGoods` ci-dessus.

---

## 7. ⚠️ Frontière de scope : `rewards[]`

`ActionChangeDTO.rewards` (1 816 occ.) et `DynamicFormulaActionChangeCaseDefinitionDTO.rewards`
(56 occ.) contiennent des arbres de récompense **appartenant au domaine Quêtes/Récompenses, hors
scope**. Ils sont modélisés ici comme un type opaque `Reward` et **non détaillés**.

Ampleur mesurée : c'est le plus gros point de contact hors scope de tout le périmètre retenu —
604 références vers `RewardDefinitionDTO`, 205 vers `CommanderDefinitionDTO`, 14 vers
`SelectionKitDefinitionDTO`, 31 vers `BoardGameEventDefinitionDTO`. Détail complet dans
[`_references-hors-scope.md`](_references-hors-scope.md).

---

## 8. Récapitulatif des points ouverts

### Résolus (vérification du 2026-08-29, hypothèses terrain confrontées aux données)

| # | Point | Conclusion |
|---|---|---|
| ✅ D1 | Priorité table / formule | **Table sur la plage tabulée, formule au-delà.** Établi par 3 mesures : max tabulé ≤ `valueLimit` (1 135/1 135), courbes distinctes (7 435 divergences vs 1 501 concordances), convergence à la jonction (116/170 à moins de 0,1 %). Inféré, non déclaré — cf. §5.1. |
| ✅ D2 | Sémantique de `valueLimit` | **Borne du domaine de la variable d'indexation.** Pour `variableName = "level"` : niveau max du bâtiment. 60 ↔ `evolving`, 40 ↔ `collectable`, sur 986 définitions rattachées sans un seul mélange, confirmé par `LevelUpComponentDTO.maxLevel`. Contradiction avec `maximumWonderLevel = 30` levée. Cf. §5.2. |
| ✅ D12 | Forme des tables par niveau | **Paliers, pas correspondance exacte.** 42 % en paliers, 44 % à clé unique, 14 % contiguës. Lecture = plus grande clé ≤ niveau. Cf. §4.1. |
| ✅ D4 | `formula` / `luaScript` : grammaire et variables non déclarées | **Mesurées et implémentées** (2026-08-31). `formula` : 9 jetons, zéro fonction, zéro condition, 27 formes. `luaScript` : 4 variables, 3 fonctions, au plus un `if`. Évaluateur commun `resolvers/lua-formula.ts` — 1 134/1 136 formules et 164/164 scripts évalués, les 2 restants étant `"(#power)"` (hors vocabulaire) et D16. Mesuré, pas déclaré. Cf. §5.3 et §6.1. |

### Ouverts

| # | Point | Ampleur | Statut |
|---|---|---|---|
| D3 | `mapping` liste vs objet selon le type racine | 6 types | Constaté, à refléter tel quel |
| D5 | 29 `DynamicFloatValueDTO` sans `value` ni `dynamicValueDefinitionId` | 29 | Non caractérisé |
| D6 | 17 `DynamicStateChangeDTO` sans `factor` | 17 | Non caractérisé |
| D7 | Écart de 11 sur l'exclusivité `amount`/`dynamicAmount` | 11 | Non caractérisé |
| D8 | `GoodCostDTO.dynamicGood` duplique le parent | 16 | Redondance inexpliquée |
| D9 | `BazaarLevelDynamicChangeDTO` : `when` "4" manquant | 1 | Table lacunaire |
| D10 | `LimitTradingGoods` jamais référencé | 1 | Orphelin |
| D11 | Récursivité sans borne ni garantie d'acyclicité | 1 081 arêtes | Structurel |
| **D13** | **330 tables ne commencent pas au niveau 1** — aucun palier applicable en dessous de la première clé | 330 | **Ouvert, ne pas extrapoler** |
| **D14** | **17 séries « écart partout »** : convergent à la jonction mais imparfaitement | 17 | Ouvert |
| **D15** | **1 table à clés `when` dupliquées** avec valeurs différentes (`Dv_…GreatGarden_1_CultureValues_AgeOfTheFranks`) | 1 | Anomalie de données ; impose de typer `values[]` en liste, pas en map |
| **D16** | **1 formule à virgule décimale** : `Dv_Building_Collectable_AirshipExhibit_1_Duration` écrit `"(86400 / (1 + (0,11 * #level))) + 40000"` | 1 | **Coquille du game design.** Ses 4 sœurs de même forme écrivent bien `0.11` / `0.1` (`BirdHouse`, `CommanderTower`, `TikiStatue`, `ArchitectsStudio`). Ne pas « réparer » en silence : la formule est inévaluable, et le bâtiment est un `collectable` — hors périmètre `evolving`. |
