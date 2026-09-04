# Domaine : Unités (stats et types)

Types couverts : `UnitDefinitionDTO` (249), `UnitStatDefinitionDTO` (13). **262 entités, 544 Ko.**
Le système de combat (`BattlefieldDefinitionDTO`, `BattlefieldWavesDefinitionDTO`,
`CommanderDefinitionDTO`, `PlayerEncounters*`) est **hors scope** — voir §8.
Prérequis : [`00-conventions.md`](00-conventions.md), [`02-dynamic.md`](02-dynamic.md),
[`05-wonders-reliques-heritage.md`](05-wonders-reliques-heritage.md) §2.

> **§4 et §5 apportent une corroboration indépendante du point W1** (sémantique de `modifier` dans
> les composants de boost), vu cette fois depuis la cible.

---

## 1. `UnitStatDefinitionDTO` — le catalogue des 13 statistiques

Entités minimales : `id` obligatoire, tout le reste optionnel. Contenu exhaustif :

| `id` | `hidden` | `thresholds` |
|---|---|---|
| `UnitStat_HitPoints` | — | — |
| `UnitStat_MinDamage` | — | — |
| `UnitStat_MaxDamage` | — | — |
| `UnitStat_HitRate` | — | — |
| `UnitStat_CriticalHitChance` | — | — |
| `UnitStat_CriticalHitDamage` | — | — |
| `UnitStat_SquadSize` | — | — |
| `UnitStat_Range` | — | `{Short: 0.0, Medium: 6.0, Long: 8.0}` |
| `UnitStat_MovementSpeed` | — | `{Slow: 0.0, Normal: 0.4, Fast: 1.0}` |
| `UnitStat_Damage` | **true** | — |
| `UnitStat_NumOfRows` | **true** | — |
| `UnitStat_ProjectileRange` | **true** | — |
| `UnitStat_ProjectileSpeed` | **true** | — |

`thresholds` est une **map `{label: seuil}`** (protobuf `map<string,double>`), pas une liste — même
piège de typage que `producedUnits` (`03-batiments.md` §3.1). Ce sont des paliers d'affichage : la
valeur brute est convertie en libellé selon le plus grand seuil ≤ valeur.

⚠️ **Le palier `Slow` est inatteignable.** Son seuil est `0.0`, mais la plus petite
`UnitStat_MovementSpeed` observée sur les 249 unités est `0.5` — donc au-dessus du seuil `Normal`
(0.4). Aucune unité du jeu n'est « Slow ». Constaté, non expliqué.

⚠️ `hidden` n'est présent que sur 4 des 13 stats, et vaut toujours `true` — jamais `false`. L'absence
signifie donc « visible ». Convention implicite, non déclarée.

---

## 2. ⚠️ `UnitStat_Damage` — une statistique que nulle unité ne porte

**`UnitStat_Damage` n'apparaît jamais comme `statDefinitionId` d'un `UnitStatComponentDTO` d'unité.**
Les unités portent `UnitStat_MinDamage` et `UnitStat_MaxDamage`. Sur les 13 stats définies, seules
12 sont utilisées comme stat d'unité.

En revanche `UnitStat_Damage` est la **cible de boost la plus fréquente** :

| Source du boost | occ. sur `UnitStat_Damage` |
|---|---|
| `BuildingCustomizationDefinitionDTO` | 26 |
| `HeritageVaultDefinitionDTO` | 14 |
| `BattlefieldBoostsDefinitionDTO` | 14 |
| `BuildingDefinitionDTO` | 13 |
| `ReworkedWonderDefinitionDTO` | 11 |
| `UnitDefinitionDTO` (via `AuraComponentDTO.boost`) | 1 |

➡️ **`UnitStat_Damage` est une statistique agrégée virtuelle** : elle n'a pas de valeur de base,
elle n'existe que comme cible de modificateurs. **Comment un boost sur `UnitStat_Damage` se reporte
sur `MinDamage` et `MaxDamage` n'est déclaré nulle part** — ni règle, ni pondération, ni champ.

> ➡️ **Point à vérifier empiriquement.** C'est l'ambiguïté la plus lourde du domaine et elle touche
> directement le système de bonus : un boost « +X % dégâts » doit être reporté sur deux stats
> distinctes selon une règle absente des données.

Le même raisonnement vaut à moindre échelle pour `UnitStat_CriticalHitDamage` (5 boosts depuis
HeritageVault, 1 depuis un bâtiment, 1 depuis un wonder), qui est **à la fois** une stat portée par
les unités (247 occurrences, valeurs 225 à 19 800) **et** une cible de boost.

---

## 3. `UnitDefinitionDTO` — champs racine

```ts
interface UnitDefinition {
  id: string;                    // 249/249
  unitType: string;              // 249/249 — 7 valeurs, §3.1
  age: string;                   // 249/249 -> AgeDefinition.id — 14 valeurs, ⚠️ §6.1
  assetId: string;               // 249/249 — ⚠️ §6.3
  components: UnitComponent[];   // 249/249 — 6 combinaisons, §3.2
  width?: number;                // 247/249 — int32 : 2 (161), 3 (77), 1 (7), 4 (2)
  height?: number;               // 247/249 — int32 : 3 (97), 4 (75), 2 (73), 5 (2)
}
```

⚠️ Les **2 unités sans `width`/`height`** sont exactement les 2 de type `friendly`
(`Unit_EarlyGothicEra_Friendly_TradeVessel`, `Unit_KingdomOfSicily_Friendly_Camel`). Elles n'ont
qu'**une seule** statistique (`UnitStat_SquadSize`) et aucun composant de compétence. Ce sont des
unités non combattantes ; rien dans les données ne le déclare — seul `unitType = "friendly"` le
suggère.

### 3.1 `unitType` — 7 valeurs

| `unitType` | n | Compétence associée | Stats de projectile |
|---|---|---|---|
| `infantry` | 73 | — | — |
| `ranged` | 49 | — | `ProjectileSpeed` (49/49) |
| `cavalry` | 47 | `ChargeSkillComponentDTO` (44/47) | — |
| `heavyInfantry` | 36 | `HeavySkillComponentDTO` (36/36) | — |
| `siege` | 32 | `HeavySkillComponentDTO` (32/32) | `ProjectileSpeed` + `ProjectileRange` (32/32) |
| `bastion` | 10 | `HeavySkillComponentDTO` (10/10) | `ProjectileSpeed` (5/10) |
| `friendly` | 2 | — | — |

✅ Corrélations **exactes** : `ProjectileRange` n'existe que sur `siege` (32/32) ;
`ProjectileSpeed` n'existe que sur `ranged`, `siege` et `bastion` ; `ChargeSkill` n'existe que sur
`cavalry` ; `HeavySkill` couvre exactement `heavyInfantry` + `siege` + `bastion`.

⚠️ **3 unités de type `cavalry` sur 47 n'ont pas de `ChargeSkillComponentDTO`**, et **5 `bastion`
sur 10 n'ont pas de `ProjectileSpeed`**. Ce sont les seules exceptions aux corrélations ci-dessus.

⚠️ `bastion` (10 unités : `Palisades`, `Watchtower`, `MayaWall`) désigne des structures défensives
statiques plutôt que des unités mobiles. Non déclaré.

### 3.2 `components[]` — 5 variantes

| `@type` | occ. | Champs |
|---|---|---|
| `UnitStatComponentDTO` | 2 590 | §4 |
| `HeavySkillComponentDTO` | 78 | `id` seul — **marqueur, aucun paramètre** |
| `ChargeSkillComponentDTO` | 44 | `id`, `damage` (int32, 375→6 750), `speedBonus` (float, **toujours 0.7**), `dynamicUnitStatChangeDefinitionId?` (6) |
| `RelatedWonderComponentDTO` | 3 | `definitionId` → `ReworkedWonderDefinition.id` ✅ 3/3 — ⚠️ **pas de champ `id`** |
| `AuraComponentDTO` | 1 | `id`, `radius` (3.0), `boost` — §5 |

⚠️ `HeavySkillComponentDTO` est un marqueur sans paramètre : **l'effet de la compétence « lourde »
n'est pas dans les données.** `ChargeSkillComponentDTO` est au contraire entièrement paramétré
(`damage` + `speedBonus`). Asymétrie non expliquée.

Les 3 unités à `RelatedWonderComponentDTO` sont des unités octroyées par un wonder
(`CarcassonneSentinel` → `Wonder_Capital_Carcassonne`, `ImperialGuard` → `Wonder_Capital_PalaceOfAachen`,
`MayaArcher` → `Wonder_Mayas_ChichenItza`).

---

## 4. `UnitStatComponentDTO` — valeur de base et progression

```ts
interface UnitStatComponent {
  id: string;                                 // 2590/2590
  statDefinitionId: string;                   // 2590/2590 -> UnitStatDefinition.id ✅
  value?: number;                             // 2554/2590 — float
  dynamicUnitStatChangeDefinitionId?: string; //  143/2590 -> DynamicUnitStatChangeDefinition.id ✅
}
```

⚠️ **`value` et `dynamicUnitStatChangeDefinitionId` ne sont PAS exclusifs** — contrairement au motif
`amount`/`dynamicAmount` observé ailleurs (`02-dynamic.md` §3.1.1) :

| | avec `dyn` | sans `dyn` |
|---|---|---|
| **avec `value`** | **140** | 2 414 |
| **sans `value`** | 3 | **33** |

Le cas dominant des 140 est donc **valeur de base × facteur dynamique**. Le payload du mapping est
un `DynamicStateChangeDTO { factor }` (`02-dynamic.md` §3.3) — un facteur multiplicatif, ce qui rend
la lecture « base × facteur » cohérente. ⚠️ Mais, là encore, **l'opérateur n'est pas déclaré.**

### 4.1 Les 3 définitions dynamiques portées par les unités

```
Dusc_Unit_AgeProgression   PlayerAgeDynamicChangeDTO — 14 âges
  StoneAge 1.0 · BronzeAge 1.25 · MinoanEra 1.55 · ClassicGreece 1.9 · EarlyRome 2.4
  RomanEmpire 3.0 · ByzantineEra 3.75 · AgeOfTheFranks 4.65 · FeudalAge 5.81 · IberianEra 7.26
  KingdomOfSicily 9.075 · HighMiddleAges 11.0 · EarlyGothicEra 12.925 · LateGothicEra 14.5

Dusc_Unit_TreasureHunt     TreasureHuntAgeDynamicChangeDTO — valeurs IDENTIQUES aux 14 ci-dessus
Dusc_TradeVessel_SquadSize BuildingLevelDynamicChangeDTO — 2 clés : 1 → 1.0, 2 → 2.0
```

⚠️ `Dusc_Unit_AgeProgression` et `Dusc_Unit_TreasureHunt` portent **exactement les mêmes 14 valeurs**
et ne diffèrent que par le type de mapping (âge du joueur vs âge Treasure Hunt). Duplication
volontaire ou copie ; indéterminable.

Stats concernées par un facteur dynamique : `HitPoints` (37), `MinDamage` (35), `MaxDamage` (35),
`CriticalHitDamage` (35), `SquadSize` (1). **Jamais** `Range`, `HitRate`, `MovementSpeed`,
`CriticalHitChance`.

### 4.2 ✅ Les unités « à âge courant »

**38 unités portent un facteur dynamique, dont 32 ont un préfixe d'id non-âge** :
`CurrentEra` (25), `PreviousEra` (5), `CurrentAge` (2). **Ces 32 ont toutes `age = "StoneAge"`.**
L'inclusion est stricte : aucune unité à préfixe placeholder n'est dépourvue de facteur dynamique.

➡️ Lecture cohérente : ces unités ont des statistiques de base calibrées au premier âge, mises à
l'échelle par `Dusc_Unit_AgeProgression` (×1.0 à ×14.5). `age = "StoneAge"` y est un **âge de
référence, pas un âge d'appartenance**. C'est une inférence par régularité, **non déclarée**.

Les 6 autres unités à facteur dynamique ont un `age` réel et un préfixe de faction
(`Unit_Carthaginians_WarElephant_1`, `Unit_Mayas_WarLeopard_1`, `Unit_Spartans_Hoplites_1`,
`Unit_Minoan_Bullriders_1`, `Unit_MacedonianKingdom_Palisades_1`, `Unit_EarlyGothicEra_Friendly_TradeVessel`).

### 4.3 ⚠️ 33 composants de statistique entièrement vides

Ni `value` ni `dynamicUnitStatChangeDefinitionId` : le composant ne porte que son `id` et son
`statDefinitionId`. Ils se concentrent sur **6 unités**, toutes de type `bastion` :

```
Unit_CurrentAge_Factionless_Palisades          Unit_EarlyRome_MacedonianKingdom_Palisades
Unit_CurrentEra_TreasureHunt_Palisades         Unit_MacedonianKingdom_Palisades_1
Unit_AgeOfTheFranks_Carolingians_Palisades     Unit_CurrentEra_MercenaryCommander_MayaWall
```

Stats concernées : `Range`, `MinDamage`, `MaxDamage`, `CriticalHitChance`, `CriticalHitDamage`,
`HitRate` (5 unités chacune) et `MovementSpeed` (6).

Cohérent avec des structures statiques et inoffensives (une palissade ne se déplace ni n'attaque),
mais **la donnée dit « statistique déclarée sans valeur », pas « valeur nulle »**. Même motif que
W7 (`05-wonders-reliques-heritage.md` §2.3) : l'absence de champ numérique n'est pas un zéro.

### 4.4 Plages de valeurs

| Stat | n | min | max | distinctes |
|---|---|---|---|---|
| `UnitStat_SquadSize` | 249 | 1 | 16 | 9 |
| `UnitStat_HitPoints` | 247 | 417 | 650 000 | 156 |
| `UnitStat_NumOfRows` | 247 | 1 | 4 | 4 |
| `UnitStat_CriticalHitDamage` | 242 | 225 | 19 800 | 164 |
| `UnitStat_MaxDamage` | 242 | 110 | 9 900 | 151 |
| `UnitStat_MinDamage` | 242 | 80 | 8 250 | 141 |
| `UnitStat_HitRate` | 242 | 0.8 | 3 | 11 |
| `UnitStat_Range` | 242 | 1 | 10 | 9 |
| `UnitStat_CriticalHitChance` | 242 | 0.04 | 0.25 | 8 |
| `UnitStat_MovementSpeed` | 241 | 0.5 | 4 | 14 |
| `UnitStat_ProjectileSpeed` | 86 | 4.2 | 6 | 2 |
| `UnitStat_ProjectileRange` | 32 | 1 | 2 | 2 |

⚠️ **Les échelles ne sont pas homogènes.** `CriticalHitChance` est une fraction (0.04–0.25) tandis
que `CriticalHitDamage` est un entier de l'ordre du millier (225–19 800) — probablement des dégâts
absolus et non un pourcentage, malgré la symétrie des noms. Non déclaré.

---

## 5. ✅ Corroboration du point W1 — sémantique de `modifier`

`05-wonders-reliques-heritage.md` §2.1 posait que le boost effectif est
`modifier × valeurDynamique`, l'opérateur étant **inféré des ordres de grandeur**. Le domaine Unités
apporte une vérification indépendante, en comparant les `BoostUnitStatComponentDTO` **avec** et
**sans** définition dynamique :

| Source | Dynamique | Distribution de `modifier` |
|---|---|---|
| `BuildingDefinitionDTO` | avec | `0.01` (25) |
| `HeritageVaultDefinitionDTO` | avec | `0.01` (32) |
| `BattlefieldBoostsDefinitionDTO` | avec | `0.01` (28) |
| `ReworkedWonderDefinitionDTO` | avec | `0.01` (16), `0.02` (4), `0.04` (4), `0.015`, `0.1`, `0.15` |
| **`BuildingCustomizationDefinitionDTO`** | **sans** | `0.05` (44), `0.02` (5), `0.03` (3), `0.01`, `0.04`, `0.06` |
| **`AuraComponentDTO.boost`** | **sans** | `0.1` (1) |

➡️ **Sans définition dynamique, `modifier` est directement la fraction** : 0.05 = +5 %, 0.1 = +10 %.
**Avec définition dynamique, `modifier` vaut presque toujours 0.01** et la valeur dynamique porte
l'amplitude en points de pourcentage (10.0 → 10 %).

Les deux branches aboutissent à la même échelle de 1 % à 15 %, ce qui **conforte la lecture
multiplicative** de W1 : `modifier` est une fraction quand il est seul, un facteur d'échelle quand
il accompagne une table.

⚠️ **Mais aucun champ ne distingue les deux régimes** : seule la présence ou l'absence de
`dynamicUnitStatChangeDefinitionId` les sépare. Un composant à `modifier = 0.01` sans dynamique
signifierait +1 %, le même avec dynamique signifie 0.01 × table. **La corroboration renforce
l'hypothèse, elle ne la démontre pas** : les données restent muettes sur l'opérateur.

`AuraComponentDTO.boost` est par ailleurs le seul objet de boost **sans `@type`** (monomorphe) :

```json
{ "id": "…_AuraBoost", "unitType": "ranged", "statDefinitionId": "UnitStat_Damage", "modifier": 0.1 }
```

Porté par `Unit_CurrentEra_MercenaryCommander_LadyKasuga`, `radius: 3.0`. ⚠️ **Unique occurrence
d'une unité qui boost d'autres unités** — et elle cible `UnitStat_Damage`, la stat virtuelle du §2.

---

## 6. Anomalies et conventions non déclarées

### 6.1 ⚠️ Le préfixe d'id ne correspond pas au champ `age` sur 38 unités / 249

- **32** portent un préfixe placeholder (`CurrentEra`, `PreviousEra`, `CurrentAge`) et
  `age = "StoneAge"` — cf. §4.2, cohérent avec la mise à l'échelle dynamique.
- **6** portent un préfixe de faction au lieu d'un âge (`Unit_Carthaginians_…`, `Unit_Mayas_…`,
  `Unit_Spartans_…`, `Unit_Minoan_…`, `Unit_MacedonianKingdom_…`).
- ⚠️ **1 cas franchement contradictoire** : `Unit_AgeOfTheFranks_Carolingians_Palisades` porte
  `age = "EarlyRome"` alors que son id nomme `AgeOfTheFranks` — deux âges réels qui se contredisent,
  sans placeholder pour l'expliquer.

➡️ **Le champ `age` fait foi ; l'id n'est pas une source fiable d'âge.**

### 6.2 Répartition par âge

`StoneAge` 41 (dont les 32 placeholders), puis 17 à 19 unités par âge de `MinoanEra` à
`LateGothicEra`, sauf `ClassicGreece` (8) et `BronzeAge` (7). ⚠️ `DawnAge` et `ComingSoon` n'ont
aucune unité — cohérent avec les 14 âges portant du contenu (cf. `04-technologies.md` §1.1).

### 6.3 ⚠️ `assetId` pointe vers un id d'unité

Contrairement aux autres domaines où `assetId` est un identifiant client sans cible
(`_references-hors-scope.md` §5), **les 249 `assetId` d'unité sont tous des `UnitDefinition.id`
valides** — dont **224 égaux à l'id de l'unité elle-même**. Les 25 divergents réutilisent l'asset
d'une autre unité :

```
Unit_CurrentAge_Factionless_Palisades      -> asset de Unit_EarlyRome_MacedonianKingdom_Palisades
Unit_PreviousEra_TreasureHunt_DonkeyRaiders -> asset de Unit_CurrentEra_TreasureHunt_DonkeyRaiders
Unit_Carthaginians_WarElephant_1            -> asset de Unit_RomanEmpire_Carthaginians_WarElephant
```

⚠️ Un champ nommé `assetId` qui porte une clé étrangère vers une entité de game design : à typer
comme référence ici, contrairement aux `assetId` des autres domaines. Piège de nommage à ne pas
généraliser dans un sens ni dans l'autre.

### 6.4 Localisation — 120 / 249

Convention `Base.Units.<id>_Name` (cf. C7). **129 unités n'ont pas de libellé.**

La séparation est nette : les **61 unités `Player`** (jouables) sont toutes traduites, tandis que
les non traduites sont des unités adverses ou événementielles — `TreasureHunt` (19),
`Merovingians` (7), `Carolingians` (7), `GermanicTribes` (6), `DarkKnights` (6),
`MacedonianKingdom` (6), `KnightsOfRoundtable` (6)…

⚠️ La séparation n'est **pas** parfaite : certaines factions adverses sont traduites (`Mayas` 6,
`ByzantineEmpire` 6, `Spartans` 4, `Minoan` 4, `EgyptianAcolytes` 4) et un seul `bastion` sur 10
l'est. L'hypothèse « les unités ennemies ne sont pas traduites », posée en C7, est donc **infirmée
comme règle** : c'est une tendance, pas un critère.

---

## 7. Intégrité référentielle

| Référence | Résolution |
|---|---|
| `UnitStatComponent.statDefinitionId` → `UnitStatDefinition.id` | 2 590/2 590 |
| `age` → `AgeDefinition.id` | 249/249 |
| `dynamicUnitStatChangeDefinitionId` → `DynamicUnitStatChangeDefinition.id` | 149/149 |
| `RelatedWonderComponent.definitionId` → `ReworkedWonderDefinition.id` | 3/3 |
| `assetId` → `UnitDefinition.id` | 249/249 |
| `AuraComponent.boost.statDefinitionId` → `UnitStatDefinition.id` | 1/1 |

**Aucune référence cassée.** Le domaine est entièrement clos sur ses références sortantes : il ne
pointe vers rien hors scope.

---

## 8. Frontière de scope — les unités sont massivement consommées par le combat

Le domaine ne **sort** pas du périmètre, mais il y **entre** énormément. Références vers
`UnitDefinition.id` depuis l'extérieur :

```
BattlefieldDefinitionDTO.enemyUnits[].unitDefinitionId                        9 149
RegionDefinitionDTO.components[].combat.enemyUnits[].unitDefinitionId         8 250
BattlefieldWavesDefinitionDTO.battlefields[].enemyUnits[].unitDefinitionId    2 819
RegionDefinitionDTO.components[].combatWaves.…                               2 119
TaskPoolDefinitionDTO.…dynamicUnitCosts.…unitDefinitionId                     2 250
BuildingDefinitionDTO.components[].finish.rewards[].unit                         65
TradingHubDefinitionDTO.…costs[].unitDefinitionId                                64
CommanderDefinitionDTO.abilities[].effects[].unitDefinitionId                    16
QuestlineDefinitionDTO.components[].tasks[].unitDefinitionId                      3
```

**~24 700 arêtes entrantes**, dont 99 % depuis Combat et Carte du monde. Le catalogue d'unités est
donc pleinement modélisable en isolation (ce document), mais **son usage** — compositions d'armées,
vagues, rencontres — est entièrement hors scope. Aucune information sur la manière dont les stats
sont mises en jeu n'est accessible ici.

⚠️ `TradingHubDefinitionDTO` (domaine Commerce, **en scope**) référence 64 fois des unités dans ses
`costs` — à reprendre au domaine Commerce.

---

## 9. Récapitulatif des points ouverts

| # | Point | Ampleur | Statut |
|---|---|---|---|
| **U1** | `UnitStat_Damage` : cible de 79 boosts, **portée par aucune unité**. Report sur `MinDamage`/`MaxDamage` non déclaré | 79 | ⚠️ **À vérifier empiriquement** — §2 |
| ✅ W1 | Sémantique de `modifier` | — | **Corroboré** : fraction seul, facteur d'échelle avec table ; aucun champ ne distingue les régimes — §5 |
| U2 | `value` × `factor` : opérateur non déclaré (140 composants) | 140 | Cohérent avec `DynamicStateChangeDTO`, non démontré — §4 |
| U3 | 33 composants de stat sans `value` ni dynamique (6 unités `bastion`) | 33 | « Déclarée sans valeur » ≠ zéro — §4.3 |
| U4 | Préfixe d'id ≠ champ `age` sur 38 unités, dont 1 contradiction franche | 38 | `age` fait foi — §6.1 |
| U5 | `HeavySkillComponentDTO` : marqueur sans paramètre, effet absent des données | 78 | §3.2 |
| U6 | Palier `Slow` de `MovementSpeed` inatteignable (seuil 0.4, min réel 0.5) | 1 | §1 |
| U7 | `Dusc_Unit_AgeProgression` et `Dusc_Unit_TreasureHunt` : valeurs identiques, mappings différents | 2 | Duplication inexpliquée — §4.1 |
| U8 | `assetId` est une clé étrangère ici, un id client ailleurs | 249 | Piège de nommage — §6.3 |
| U9 | Échelles hétérogènes : `CriticalHitChance` fraction, `CriticalHitDamage` entier | — | §4.4 |
| U10 | 3 `cavalry` sans `ChargeSkill`, 5 `bastion` sans `ProjectileSpeed` | 8 | Exceptions aux corrélations — §3.1 |
| U11 | Hypothèse C7 « unités ennemies non traduites » | 129 | **Infirmée comme règle** : tendance seulement — §6.4 |
| U12 | `RelatedWonderComponentDTO` sans champ `id` | 3 | Non adressable — §3.2 |
| ✅ U13 | `TradingHubDefinitionDTO` référence 64 unités dans ses `costs` | 64 | **Résolu** (`07-commerce.md` §9) : une seule unité, `Unit_EarlyGothicEra_Friendly_TradeVessel`, sur 32 hubs × 2 emplacements (`ReservedUnitCostDTO` + `UnitCostDTO`). Aucune dépendance au combat |
