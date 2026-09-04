# Domaine : Bâtiments

Types couverts : `BuildingDefinitionDTO` (693), `BuildingSkinDefinitionDTO` (620),
`BuildingCustomizationDefinitionDTO` (223), `CustomizationCollectionDefinitionDTO` (22),
`ExpansionDefinitionDTO` (832), `ExpansionCostsDTO` (40), `CityInitDefinitionDTO` (24),
`PremiumLayoutDefinitionDTO` (2), `ObstacleDefinitionDTO` (10 — voir §9, mal classé).
**Total : 2 466 entités, 1,9 Mo.**
Prérequis : [`00-conventions.md`](00-conventions.md), [`02-dynamic.md`](02-dynamic.md).

---

## 1. ⚠️ Le piège `level` — deux mécaniques de progression incompatibles

Reporté depuis `02-dynamic.md` §5.2. C'est le point le plus important du domaine : **`level` ne
désigne pas la même chose selon le type de bâtiment**, et deux modèles de progression coexistent.

### 1.1 Mécanique A — progression par chaîne de définitions (le cas général)

Pour la grande majorité des bâtiments, **chaque niveau est une `BuildingDefinitionDTO` distincte**.
`level` est un champ figé de la définition, et `UpgradeComponentDTO.target` pointe vers la définition
du niveau suivant.

```
Building_DawnAge_Farm_Rural_1  --target-->  …  --target-->  Building_DynamicAge_Farm_Rural_1
   (level 1)                                                    (level 40, age LateGothicEra)
```

Mesures :

- 478 bâtiments portent un `UpgradeComponentDTO` ; **les 478 `target` résolvent vers un
  `BuildingDefinition.id`** (aucune référence cassée), et le graphe est **acyclique**.
- 71 racines de chaîne. Longueurs observées : 41, 40, 40, 37, 14 (×7), 13, 11, 9 (×5), 6 (×20),
  5, 4, 3, 2 (×23).
- ⚠️ **Une chaîne traverse les âges.** `Building_FeudalAge_CultureSite_Moderate_1` (level 9) cible
  `Building_IberianEra_CultureSite_Moderate_1`. Monter de niveau change donc l'`age` du bâtiment.
  `level` et `age` ne sont pas des axes indépendants.
- Amplitudes de `level` par type : `home` et `farm` 1→42, `cityHall` 1→15, `cultureSite` et
  `barracks` 1→14, `collectable` 1→10, la plupart des autres 1→6 ou moins.

### 1.2 Mécanique B — progression runtime interne (les `evolving`)

Pour les 44 bâtiments de type `evolving`, **une seule définition couvre tous les niveaux**.

```ts
BuildingDefinitionDTO.level = 1        // ⚠️ TOUJOURS 1, sur les 44 — sans exception
LevelUpComponentDTO.maxLevel = 60      // ⚠️ le vrai plafond, sur les 44
```

Le niveau réel est un état d'instance, jamais présent dans le game design. Il n'est observable
qu'indirectement, comme **clé `when` des tables dynamiques** (`BuildingLevelDynamicChangeDTO`,
`"1"`…`"60"`).

➡️ **Règle pour le modèle :** `BuildingDefinition.level` est le rang dans la chaîne d'upgrade
(mécanique A). Le niveau runtime des `evolving` est un concept distinct, borné par
`LevelUpComponentDTO.maxLevel`, et n'a **aucune** représentation dans `BuildingDefinitionDTO`.
Les deux ne doivent jamais être fusionnés dans un même champ.

### 1.3 `LevelUpComponentDTO` — répartition exacte

| Type de bâtiment | n | `maxLevel` | `starLevels` |
|---|---|---|---|
| `evolving` | 44 | **60** (44/44) | `[10,20,30,40,60]` (41) · `[11,21,31,41,60]` (3) |
| `collectable` | 17 | **40** (17/17) | `[10,20,30,40]` (17) |
| `farm` | 3 | *absent* | *absent* |
| `home` | 3 | *absent* | *absent* |
| `cultureSite` | 5 | *absent* | *absent* |

⚠️ **11 des 72 `LevelUpComponentDTO` n'ont ni `maxLevel` ni `starLevels`** (3 `farm`, 3 `home`,
5 `cultureSite`). Ces bâtiments ont donc un composant de montée en niveau **sans plafond déclaré**.
Rien dans les données ne dit ce qui borne leur progression. Non résolu.

⚠️ 3 `evolving` ont `starLevels = [11,21,31,41,60]` au lieu de `[10,20,30,40,60]` — décalage de 1 sur
les 4 premiers paliers, le 5ᵉ restant à 60. Intentionnel ou erreur : indéterminable.

### 1.4 Autres champs de niveau

- **`level` absent sur 22 bâtiments** : `irrigation` (10), `collectable` (3), `runestone` (3),
  `ritualSite` (3), `presetIrrigation` (2), `farm` (1). Tous sans composant de niveau — sauf
  ⚠️ `Building_DawnAge_Farm_Rural_1`, qui **porte un `UpgradeComponentDTO` mais aucun `level`**,
  alors qu'il est la racine de la plus longue chaîne du jeu (41 maillons). Incohérence isolée.
- **`levelPerAge`** (12 bâtiments, `int`) : uniquement sur les `Building_DynamicAge_*`, tous
  `age = LateGothicEra`. Vaut `3` pour `home`/`farm` (dont `level` va jusqu'à 40-42) et `1` pour
  `cultureSite`/`cityHall` (`level` 14-15). ⚠️ Le nom suggère « nombre de niveaux gagnés par âge »,
  mais **rien dans les données ne le confirme** ni ne dit à quoi il s'applique. Non interprété.
- **`PinnedAgeComponentDTO`** (44 occurrences, aucun champ hors `id`) : marqueur, porté
  exclusivement par des bâtiments à `LevelUpComponentDTO`. Sémantique non déclarée.

---

## 2. `BuildingDefinitionDTO` — champs racine

```ts
interface BuildingDefinition {
  id: string;                    // 693/693
  type: string;                  // 693/693 — 28 valeurs, voir 2.1
  group: string;                 // 693/693 — 176 valeurs, voir §10 (S7)
  cities: string[];              // 693/693 — 1 seule valeur par bâtiment en pratique
  width: number; height: number; // 693/693 — int32, emprise sur la grille
  components: BuildingComponent[]; // 693/693 — union à 18 variantes, voir §3
  level?: number;                // 671/693 — voir §1
  age?: string;                  // 649/693 — ⚠️ absent sur EXACTEMENT les 44 `evolving`
  happinessEffects?: HappinessEffect[];  // 388/693 — voir 2.2
  freeProductionSlots?: number;  // 344/693 — int32
  expansionSubType?: string;     // 34/693 — HARBOR (22) | WATER (12)
  levelPerAge?: number;          // 12/693 — voir 1.4
}
```

⚠️ **`age` est absent sur exactement les 44 bâtiments `evolving`, et sur eux seuls.** Corrélation
parfaite. Cohérent avec la mécanique B (un `evolving` n'appartient pas à un âge puisqu'il traverse
toute la progression), mais **non déclaré** — c'est une régularité observée, pas une règle énoncée.

⚠️ `cities` est un tableau mais ne contient **jamais plus d'une valeur** : 508 `City_Capital`,
43 `City_Mayas`, 42 `City_Egypt`, 39 `City_Vikings`, 31 `City_Arabia`, 30 `City_China` = 693 pour
693 bâtiments. Le contrat autorise le multiple, les données ne l'exercent pas.

### 2.1 `type` — 28 valeurs

`home` (155), `farm` (95), `cultureSite` (66), `workshop` (65), `collectable` (62), `barracks` (61),
`evolving` (44), `cityHall` (25), `quarry` (14), `decoration` (13), `irrigation` (10), `merchant` (8),
`riceFarm` (8), `papyrusField` (8), `goldMine` (8), `fishingPier` (8), `harbor` (7), `beehive` (6),
`sailorHome` (6), `warehouse` (5), `aviary` (4), `runestone` (3), `ritualSite` (3), `harborBoost` (2),
`extractionPoint` (2), `presetIrrigation` (2), `shipyard` (2), `camelFarm` (1).

`CityDefinitionDTO.buildMenuTypes[]` en sélectionne 21 sur ces 28 (cf. `01-socle.md` §2).

### 2.2 `happinessEffects[]` — structure constante

Structure **identique sur les 388 bâtiments porteurs** : exactement 4 entrées, la première vide.

```json
[{}, {"happiness": 25, "effect": 0.25}, {"happiness": 50, "effect": 0.5}, {"happiness": 100, "effect": 1.0}]
```

```ts
type HappinessEffect =
  | {}                                              // 388 occ. — l'entrée d'indice 0, toujours vide
  | { happiness: number; effect: number }           // 1 146 occ. — int32 + float
  | { effect: number; luaHappinessDefinitionId: string };  // 18 occ. -> DynamicLuaLongDefinition.id
```

⚠️ L'entrée vide en position 0 suggère un tableau indexé par palier de bonheur où l'indice 0 est
« aucun effet ». **Non déclaré** : aucun champ ne porte l'indice. Le modèle doit conserver la liste
positionnelle telle quelle, entrée vide comprise.

---

## 3. `components[]` — union à 18 variantes

Les 693 bâtiments présentent **62 combinaisons distinctes** de composants. Trois sont sur tous les
bâtiments ou presque : `InitComponentDTO` (693/693), `MoveComponentDTO` (684), `SellComponentDTO` (656).

| `@type` | occ. | Champs propres (hors `id`) |
|---|---|---|
| `ProductionComponentDTO` | 1 051 | voir 3.1 |
| `UnlockableProductionSlotDTO` | 827 | `order` (int32) ; `resourceChanges[]` — ⚠️ **pas d'`id`** |
| `InitComponentDTO` | 693 | *(aucun)* — marqueur |
| `MoveComponentDTO` | 684 | *(aucun)* — marqueur |
| `SellComponentDTO` | 656 | `start` ; `forInventory?` (103, bool) ; `keepLevel?` (61, bool) |
| `UpgradeComponentDTO` | 478 | `target` → `Building.id` ; `duration` ; `autoFinish` (bool) ; `start` ; `complete` ; `workersRequired?` (419) |
| `ConstructionComponentDTO` | 415 | `duration` ; `start` ; `finish` ; `complete` ; `workersRequired?` (283) ; `dynamicDuration?` (8) |
| `GrantWorkerComponentDTO` | 214 | `amount?` (200, int32) **ou** `dynamicAmountDefinitionId?` (14) ; `type?` (22) |
| `CultureComponentDTO` | 135 | `points?` (94) / `dynamicPointsDefinitionId?` (36) / `luaPointsDefinitionId?` (5) ; `range?` (104) / `dynamicRangeDefinitionId?` (31) |
| `LevelUpComponentDTO` | 72 | voir 1.3 |
| `PinnedAgeComponentDTO` | 44 | *(aucun)* — marqueur |
| `RebuildConstructionComponentDTO` | 41 | `duration` ; `start` ; `complete` ; `workersRequired?` (36) |
| `BoostUnitStatComponentDTO` | 25 | `statDefinitionId` → `UnitStatDefinition.id` ; `unitType` ; `modifier` (float) ; `dynamicUnitStatChangeDefinitionId` ; `unitDefinitionId?` (1) |
| `BuildingBoostComponentDTO` | 20 | `boostDefinitionId` → `BoostDefinition.id` |
| `HeritageVaultMarkerComponentDTO` | 13 | `themeId` → `HeritageVaultDefinition.themeId` ✅ 13/13 — ⚠️ **pas d'`id`** |
| `IncreaseResourceCapacityComponentDTO` | 10 | `capacity` (int32) ; `resourceIds[]` → `Resource.id` — ⚠️ **pas d'`id`** |
| `BoostResourceComponentDTO` | 5 | `cities[]` ; `modifier?` (4) / `luaModifierDefinitionId?` (1) ; `resourceDefinitionId?` (1) / `resourceType?` (1) ; `buildingGroup?` (1) / `buildingType?` (2) |
| `TradingCultureSwitchComponentDTO` | 4 | `tradingCultureDefinitionId` → `TradingCultureDefinition.definitionId` |

⚠️ **3 composants n'ont pas de champ `id`** alors que les 15 autres en ont un
(`UnlockableProductionSlotDTO`, `HeritageVaultMarkerComponentDTO`,
`IncreaseResourceCapacityComponentDTO`). Ils ne sont donc pas adressables individuellement.

⚠️ `BoostResourceComponentDTO` : 5 occurrences, 8 champs, aucune combinaison majoritaire. Trop peu
de données pour établir quels champs sont exclusifs. Non caractérisé.

### 3.1 `ProductionComponentDTO` — le composant central

```ts
interface ProductionComponent {
  id: string;                    // 1051/1051
  duration: string;              // 1051/1051 — Duration
  minCollectionPeriod: string;   // 1051/1051 — Duration
  skipPricePerMinute: number;    // 1051/1051 — float
  finish: Finish;                // 1051/1051 — voir §4
  type?: string;                 //  793 — "ProductionType_WORKER" (728) | "ProductionType_UNIT" (65)
  behaviours?: Behaviour[];      //  793 — WorkerBehaviourDTO (790) | CultureBehaviourDTO (3)
  resourceChangesOnStart?: ResourceChange[];  // 407
  auto?: boolean;                //  258
  producedResources?: ResourceChange[];       // 193
  earlyCollectable?: boolean;    //  167
  producedUnits?: Record<string, number>;     //  65 — ⚠️ MAP, voir ci-dessous
  producedDynamicActionChangeDefinitionId?: string;  // 62
  costs?: UnitCost[];            //   16
  changesDynamicActionChangeDefinitionId?: string;   // 14
  dynamicDurationDefinitionId?: string;       // 10
  productionIndex?: number;      //    8 — int32
}
```

⚠️ **`producedUnits` est une map `{ "<Unit.id>": <int32> }`, pas une liste.** C'est le seul champ
map-typé du domaine. Les 65 clés résolvent toutes vers un `UnitDefinition.id`. Un modèle qui
supposerait une liste d'objets échouerait au parsing.
ℹ️ Noté structurellement, **non approfondi** : la production d'unités n'est pas gérée par le Layout
Builder. La forme map est la seule chose à retenir ici.

⚠️ `type` est absent sur 258 des 1 051 `ProductionComponentDTO`. La corrélation avec `auto`
(258 occurrences) est exacte en nombre mais **non vérifiée comme identité d'ensembles**. Signalé.

⚠️ `freeProductionSlots` (racine) vs nombre de `UnlockableProductionSlotDTO` : les combinaisons ne
suivent aucune règle simple — `(3, 3 slots, 3 productions)` ×173, mais aussi `(1, 3 slots,
1 production)` ×41, `(2, 0 slot, 1 production)` ×51, `(absent, 0 slot, 1 production)` ×211. Le lien
entre les deux notions **n'est pas déductible des données**.

---

## 4. Sous-objets partagés par les composants

`start`, `finish`, `complete` et `workersRequired` apparaissent sur plusieurs composants avec une
forme constante. **Aucun ne porte de `@type`** (objets monomorphes, cf. C2).

```ts
interface Start {            // 1 662 occ. sur les composants de bâtiment
  resourceChanges?: ResourceChange[];  // 1 566 — le coût
  requirements?: (ResearchRequirement | GoodRequirement)[];  // 747 (658 + 89)
  dynamicChangeDefinitionId?: string;  //  69 -> DynamicActionChangeDefinition.id
  costs?: GoodCost[];                  //   4
}
interface Finish {           // 1 466 occ.
  resourceChanges?: ResourceChange[];  // 666
  rewards?: Reward[];                  // 127 — ⚠️ hors scope, voir §8
}
interface WorkersRequired {  // 763 occ.
  amount: number;                      // 763/763 — int32
  requiredWorkers: { amount: number; type?: string }[];  // 763/763
  type?: string;                       //   8 — "WorkerType_SAILOR_VIKINGS"
}
type Complete = {};          // 934 occ.
```

⚠️ **`complete` est un objet vide dans les 934 occurrences, sans exception.** Aucun champ, jamais.
Le champ existe au contrat protobuf mais ne porte aucune donnée dans cette livraison. À modéliser
comme présent-et-vide, pas à supprimer ni à inventer.

⚠️ `workersRequired` porte à la fois `amount` (scalaire) et `requiredWorkers[]` (liste avec ses
propres `amount`). Redondance apparente ; leur relation n'est pas déclarée.

⚠️ `WorkerType_*` apparaît dans trois champs différents avec des domaines partiellement disjoints :
`GrantWorkerComponentDTO.type` (`SAILOR_VIKINGS` 8, `PRIEST_MAYA` 8, `SEAFARER` 6),
`workersRequired.type` (`SAILOR_VIKINGS` 8 uniquement), `requiredWorkers[].type` (8 occ.).
Un même vocabulaire, trois usages non reliés explicitement.

---

## 5. `BuildingSkinDefinitionDTO` — n = 620

```ts
interface BuildingSkinDefinition {
  id: string;                  // 620/620 — namespace "building_skin.*"
  buildingGroup: string;       // 620/620 -> Building.group  ✅ 620/620 résolus
  components: [SkinBuildingComponent] | [SkinCustomizationComponent];  // 620/620
  requirements?: Requirement[];  // 617/620 — ⚠️ 3 skins sans condition
}
```

**Deux familles disjointes**, jamais mélangées dans un même skin :

| Composant | n | Champs | Requirement associé |
|---|---|---|---|
| `SkinBuildingComponentDTO` | 397 | `id`, `age`, `assetId` | `ResearchRequirementDTO` (394) |
| `SkinCustomizationComponentDTO` | 223 | `id`, `buildingCustomizationDefinitionId` | `AchievementRequirementDTO` (223) |

### 5.1 `achievementId` — référence externe volontairement non résolue

```ts
interface AchievementRequirement {   // @type = AchievementRequirementDTO — 223 occ.
  achievementId: string;   // -> AchievementDefinitionDTO.id, namespace "achievement.*"
}
```

**Décision de scope : `AchievementDefinitionDTO` n'est pas absorbé.** `achievementId` est modélisé
comme une **référence externe opaque**, non résolue, et le reste tant que le domaine Achievements
n'entre pas en scope.

Conséquence assumée et explicite : **les conditions de déblocage des 223 skins de personnalisation
sont inconnues dans ce modèle.** On sait qu'un accomplissement les conditionne, pas lequel ni ce
qu'il demande. Ce n'est pas une donnée manquante mais une frontière de périmètre — cf.
[`_references-hors-scope.md`](_references-hors-scope.md) §3.

Les 223 `achievementId` **résolvent tous** vers un `AchievementDefinitionDTO` existant : la
référence est valide, seulement non suivie.

### 5.2 Autres requirements

- `ResearchRequirementDTO` (394) : `{ id: string }` → `Technology.id`. ✅ 394/394 résolus.
  ⚠️ Le champ s'appelle `id` et non `technologyId` — un `id` qui est une clé étrangère, pas
  l'identité de l'objet. Piège de nommage.
- `EventHasRunRequirementDTO` (14) : `{ eventId: string; year: number }` — hors scope.

---

## 6. `BuildingCustomizationDefinitionDTO` — n = 223 · `CustomizationCollectionDefinitionDTO` — n = 22

```ts
interface BuildingCustomizationDefinition {
  id: string;                 // 223/223
  buildingGroup: string;      // 223/223 -> Building.group  ✅ 223/223 résolus
  cityDefinitionId: string;   // 223/223 — ⚠️ TOUJOURS "City_Capital", aucune autre valeur
  duration: string;           // 223/223 — Duration : 864000s (203) | 604800s (18) | 432000s (1) | 172800s (1)
  order: number;              // 223/223 — int32
  components: CustomizationComponent[];  // 223/223
}
```

Composants : `OriginComponentDTO` (223/223, `{id, name, type}`), `ProductionComponentDTO` (133),
`BoostUnitStatComponentDTO` (55), `CultureBoostComponentDTO` (50, `{id, cultureBoost: float}`),
`BoostResourceComponentDTO` (48).

⚠️ `ProductionComponentDTO` réapparaît ici avec un **sous-ensemble de champs différent** de celui des
bâtiments (pas de `type`, `behaviours`, `producedUnits`, `resourceChangesOnStart`). Même DTO, deux
profils d'usage. Le modèle doit le typer une fois avec toutes les optionalités, pas deux fois.

⚠️ `OriginComponentDTO.name` contient un id d'événement (`Event_Polynesia` sur 12 occurrences) — un
champ `name` qui porte une clé étrangère. Voir `_references-hors-scope.md` §4 ; non tranché.

`CustomizationCollectionDefinitionDTO` : `{ id, customizationDefinitionIds[], components[], complete? }`.
Les ids de personnalisation **résolvent tous** (0 inconnu). `complete` absent sur 3 des 22 collections,
et contient un arbre de récompense (hors scope, §8).

---

## 7. Expansions, coûts et initialisation de ville

### 7.1 `ExpansionDefinitionDTO` — n = 832

```ts
interface ExpansionDefinition {
  id: string; city: string;     // 832/832 -> CityDefinition.id
  x: number; y: number;         // 832/832 — int32
  finish: Finish;               // 832/832
  expansionType?: string;       // 234 — BLOCKER (188) | LINKED (23) | CONNECTOR (22) | DETACHED_CONNECTOR (1)
  expansionSubType?: string;    // 154 — HARBOR (100) | WATER (54)
  components?: [LinkedExpansionComponent];  // 26 — { linkedExpansionDefinitionId } ✅ 30/30 résolus
}
```

Répartition : `City_Capital` 232, `City_Arabia` 225, `City_Vikings` 182, `City_China` 80,
`City_Mayas` 64, `City_Egypt` 49.

⚠️ **598 des 832 expansions n'ont pas d'`expansionType`.** Le champ n'a donc pas de valeur par défaut
lisible ; les 4 valeurs observées décrivent des cas particuliers. Ce que « pas de type » signifie
n'est pas dans les données.

### 7.2 `ExpansionCostsDTO` — n = 40

```ts
interface ExpansionCosts {
  id: string; city: string;     // 40/40
  components?: ConstructionComponent[];  // 38/40 — 536 composants au total
  unlockingType?: string;       // 31 — CONNECTOR (24) | PREMIUM (7)
  expansionDefinitionId?: string;  // 22 -> Expansion.id ✅ 22/22 résolus
  expansionSubType?: string;    //  3
}
```

ℹ️ **Hors besoin produit — non poursuivi.** Seules 22 des 832 expansions ont un `ExpansionCostsDTO`
qui les nomme explicitement ; les 40 entités portent 536 `ConstructionComponentDTO`, visiblement des
barèmes par rang plutôt que par expansion nommée, et le mécanisme d'appariement barème → expansion
n'est pas dans les données. **Le Layout Builder n'a pas besoin du coût de déblocage** (il lui faut le
nombre d'expansions par ville, leur position et leur type — tous présents et intègres, cf. §7.1).
Constaté et laissé en l'état, délibérément.

⚠️ 2 des 40 `ExpansionCostsDTO` n'ont aucun composant.

### 7.3 `CityInitDefinitionDTO` — n = 24, reprise de S2

Structure : `{ @type, id, components }` — **strictement 3 clés sur les 24, aucune autre.**

**Réponse à S2 : aucun champ ne relie un `CityInitDefinitionDTO` orphelin à un âge.** Vérifié
exhaustivement. Mais la question se scinde en deux :

- **La cité EST récupérable depuis les données**, sans passer par le nom : chaque
  `InitialGridComponentDTO.initialGridAreas[].city` porte la cité, de façon homogène sur les 24
  entités (`CityInit_Capital_ByzantineEra` → toutes ses zones sont `City_Capital`). Le rattachement
  à la cité n'est donc **pas** une pure convention de nommage.
- **L'âge n'est récupérable que par le suffixe de l'id.** Aucun champ ne le porte.

Confirmé aussi : les 18 orphelins **ne sont référencés de nulle part**. La seule référence existante
dans tout le fichier est `CityDefinitionDTO.cityInitDefinition.id` (6 occurrences).

⚠️ **Décalage systématique d'un âge, avec deux exceptions.** Les biens `DYN|` octroyés par un
`CityInit_Capital_<Age>` sont ceux de **l'âge précédent** :

| Entité | Âge du suffixe | Âge des biens `DYN\|` | Δ |
|---|---|---|---|
| `CityInit_Capital_MinoanEra` | MinoanEra (4) | BronzeAge (3) | −1 |
| `CityInit_Capital_ClassicGreece` | ClassicGreece (5) | MinoanEra (4) | −1 |
| `CityInit_Capital_EarlyRome` | EarlyRome (6) | ClassicGreece (5) | −1 |
| `CityInit_Capital_RomanEmpire` | RomanEmpire (7) | EarlyRome (6) | −1 |
| `CityInit_Capital_ByzantineEra` | ByzantineEra (8) | RomanEmpire (7) | −1 |
| `CityInit_Capital_AgeOfTheFranks` | AgeOfTheFranks (9) | ByzantineEra (8) | −1 |
| `CityInit_Capital_FeudalAge` | FeudalAge (10) | AgeOfTheFranks (9) | −1 |
| `CityInit_Capital_IberianEra` | IberianEra (11) | FeudalAge (10) | −1 |
| `CityInit_Capital_KingdomOfSicily` | KingdomOfSicily (12) | IberianEra (11) | −1 |
| **`CityInit_Capital_KingdomOfSicily_END`** | KingdomOfSicily (12) | KingdomOfSicily (12) | **0** |
| **`CityInit_Capital_RomanEmpire_TestBattle`** | RomanEmpire (7) | ClassicGreece (5) | **−2** |

La régularité −1 est trop systématique pour être fortuite, mais **rien dans les données ne dit si le
suffixe désigne l'âge de départ ou l'âge visé**. Les deux exceptions portent précisément les suffixes
`_END` et `_TestBattle` — cohérent avec des entités de test ou de fin de contenu, sans confirmation.

➡️ **S2 reste partiellement ouvert :** cité résoluble par les données, âge résoluble seulement par
convention de nommage, sémantique du décalage indéterminée.

### 7.4 `PremiumLayoutDefinitionDTO` — n = 2

Contenu exhaustif : `{ id: "wonder_premium_layout.first", cost: {premium, "500"} }` et
`{ id: "wonder_premium_layout.second", cost: {premium, "500"}, order: 1 }`.

⚠️ `order` présent sur `second` (valeur 1) et **absent sur `first`**. Sur 2 entités, l'optionalité
n'est pas caractérisable. ✅ Malgré le namespace `wonder_*`, ces entités ne sont référencées par
aucun wonder — **confirmé au domaine Wonders** (`05-wonders-reliques-heritage.md` §7). Le seul lien
avec les wonders est `ConstantsDefinition.wonders.freeLayouts = 2`.

---

## 8. Frontière de scope — `rewards[]`

`components[].finish.rewards[]` (127 occurrences sur les bâtiments) et
`CustomizationCollectionDefinitionDTO.complete` contiennent des arbres de récompense hors scope.
Sous-types observés : `UnitRewardDTO` (65), `RewardDefinitionDTO` (42),
`DynamicActionChangeRewardDTO` (19), `SelectionKitRewardDTO` (1).

Rappel (C5) : les 42 `RewardDefinitionDTO` embarqués sont des **copies intégrales** des entités
racine de même id — modélisés en type opaque `Reward`, rien n'est perdu.

---

## 9. ⚠️ `ObstacleDefinitionDTO` est mal classé dans ce domaine

10 entités, `{ id, width, height }`. Je l'avais placé dans Bâtiments lors du découpage initial.
**Vérification : il n'est jamais référencé depuis le domaine Bâtiments.** Ses 653 références
viennent exclusivement de types hors scope :

```
BattlefieldDefinitionDTO.obstacles[].obstacleDefinitionId              343
RegionDefinitionDTO.components[].combat.obstacles[].obstacleDefinitionId  198
BattlefieldWavesDefinitionDTO.battlefields[].obstacles[].obstacleDefinitionId  112
```

➡️ `ObstacleDefinitionDTO` relève du **Combat / Carte du monde**, tous deux hors scope. Il est
documenté ici pour mémoire ; sa présence dans ce domaine est une erreur de mon découpage initial.

---

## 10. Reprise de S7 — `buildingGroupSorting[]` vs `BuildingDefinitionDTO.group`

**Couverture partielle dans les deux sens**, et la liste contient un doublon.

| Mesure | Valeur |
|---|---|
| `buildingGroupSorting` | **71 entrées, 70 distinctes** — ⚠️ `premiumHome` y figure **deux fois** |
| `BuildingDefinitionDTO.group` | 693/693 porteurs, **176 valeurs distinctes** |
| Intersection | **69** |
| Dans le tri mais utilisé par **aucun** bâtiment | **1** : `expeditionPort` |
| Utilisé par un bâtiment mais **absent du tri** | **107** |

Les 107 absents ne sont pas un résidu marginal — ils incluent des familles entières :

- les 44 groupes `evolving*` (`evolvingDraculaCastle`, `evolvingTrojanHorse`…), 1 bâtiment chacun ;
- les 24 groupes `collectable*` (`collectableCommanderTower` 10 bâtiments, `collectableSchoolV2` 10…) ;
- les 13 groupes `heritage*` (`heritageAztec`, `heritageCeltic`…) ;
- `cityHall` (25 bâtiments), `heavyInfantryBarracks` (11), `siegeBarracks` (9), `carpenter` (6),
  `scribe` (6), `spiceMerchant` (6), `smallSailorHome` (4), `cultureShip` (4)…

⚠️ Trois des cinq familles de casernes sont dans le tri (`infantryBarracks`, `rangedBarracks`,
`cavalryBarracks`) et deux ne le sont pas (`heavyInfantryBarracks`, `siegeBarracks`). Asymétrie
inexpliquée.

➡️ **S7 tranché : `buildingGroupSorting` n'est pas un référentiel des groupes.** C'est une liste
d'affichage partielle, désynchronisée du contenu (61 % des groupes réels absents, 1 entrée morte,
1 doublon). Le modèle ne doit pas la traiter comme une énumération faisant autorité, et surtout
pas s'en servir pour valider `group`.

---

## 11. Reprise du piège `palaceOfAachen`

**Confirmé : `palaceOfAachen` n'est PAS un `BuildingDefinitionDTO.group`.** Zéro bâtiment le porte,
et il est absent de `buildingGroupSorting`. C'est la seule des 6 valeurs de
`BoostProductionTimeComponentDTO.buildingGroup` dans ce cas :

| Valeur | Est un `group` réel ? | Dans `buildingGroupSorting` ? |
|---|---|---|
| `infantryBarracks` | ✅ 14 bâtiments | ✅ |
| `rangedBarracks` | ✅ 14 bâtiments | ✅ |
| `cavalryBarracks` | ✅ 13 bâtiments | ✅ |
| `heavyInfantryBarracks` | ✅ 11 bâtiments | ❌ |
| `siegeBarracks` | ✅ 9 bâtiments | ❌ |
| **`palaceOfAachen`** | ❌ **0 bâtiment** | ❌ |

Le boost porteur est `Boost_Building_AgeOfTheFranks_Wonder_PalaceOfAachen_1_RecruitmentTimeReduction`,
et il porte **aussi** `wonderDefinitionId: "Wonder_Capital_PalaceOfAachen"` — un wonder qui existe bien.

➡️ **`buildingGroup` contient ici une valeur morte** : une forme camelCase du nom du wonder, non
résoluble. L'information utile est dans `wonderDefinitionId`, présent en parallèle. Modéliser
`BoostProductionTimeComponentDTO.buildingGroup` comme `string` **sans contrainte de clé étrangère**,
et signaler que 1 valeur sur 6 ne résout pas.

---

## 12. Intégrité référentielle du domaine

Toutes les références internes vérifiées sont **intégralement résolues** :

| Référence | Résolution |
|---|---|
| `UpgradeComponent.target` → `Building.id` | 478/478 |
| `BuildingSkin.buildingGroup` → `Building.group` | 620/620 |
| `BuildingCustomization.buildingGroup` → `Building.group` | 223/223 |
| `SkinCustomizationComponent.buildingCustomizationDefinitionId` | 223/223 |
| `CustomizationCollection.customizationDefinitionIds[]` | 22 collections, 0 inconnu |
| `ResearchRequirement.id` → `Technology.id` (skins) | 394/394 |
| `ResearchRequirement.id` → `Technology.id` (bâtiments) | 658/658 |
| `ExpansionCosts.expansionDefinitionId` → `Expansion.id` | 22/22 |
| `LinkedExpansionComponent.linkedExpansionDefinitionId` | 30/30 |
| `BuildingBoostComponent.boostDefinitionId` → `Boost.id` | 20/20 |
| `BoostUnitStatComponent.statDefinitionId` → `UnitStat.id` | 25/25 |
| `producedUnits` (clés de map) → `Unit.id` | 65/65 |
| `IncreaseResourceCapacity.resourceIds[]` → `Resource.id` | 32/32 |
| `AchievementRequirement.achievementId` → `Achievement.id` | 223/223 (valide, **non suivie** par choix) |

| `HeritageVaultMarkerComponent.themeId` → `HeritageVaultDefinition.themeId` | 13/13 |

Seule référence **non résoluble** : les `assetId` — identifiants client sans type cible
(cf. `_references-hors-scope.md` §5).

> **Correction (2026-08-29).** Une version antérieure de ce document indiquait que
> `HeritageVaultMarkerComponentDTO.themeId` ne résolvait vers rien. C'est faux : ses 13 valeurs
> (`heritage_vault.Heritage_*`) correspondent exactement aux 13 `HeritageVaultDefinition.themeId`.
> Le contrôle initial avait été fait contre l'espace `id` seulement, sans inclure l'espace
> `definitionId`/`themeId` (cf. C6).

---

## 13. Récapitulatif des points ouverts

| # | Point | Ampleur | Statut |
|---|---|---|---|
| ✅ S7 | `buildingGroupSorting` vs `group` | — | **Tranché** : liste d'affichage partielle, 107 groupes absents, 1 doublon (`premiumHome`), 1 entrée morte (`expeditionPort`). Pas un référentiel — §10 |
| ✅ — | `palaceOfAachen` | — | **Tranché** : valeur morte, 0 bâtiment ; l'info est dans `wonderDefinitionId` — §11 |
| ⚠️ S2 | `CityInitDefinitionDTO` orphelins | 18 | **Partiel** : cité résoluble par les données (`initialGridAreas[].city`), âge seulement par le nom ; décalage −1 systématique inexpliqué, 2 exceptions — §7.3 |
| ✅ — | `achievementId` | 223 | **Décision de scope** : référence externe non résolue, conditions de déblocage des skins volontairement inconnues — §5.1 |
| B1 | 11 `LevelUpComponentDTO` sans `maxLevel` ni `starLevels` | 11 | Progression sans plafond déclaré |
| B2 | `Building_DawnAge_Farm_Rural_1` : `UpgradeComponent` mais pas de `level` | 1 | Incohérence isolée, sur la racine de la plus longue chaîne |
| ℹ️ B3 | Appariement barème `ExpansionCostsDTO` → expansion | 810/832 | **Hors besoin produit, non poursuivi** — le Layout Builder n'utilise pas les coûts de déblocage ; nombre / position / type d'expansion sont complets et intègres — §7.2 |
| B4 | `complete` toujours vide | 934 | Champ au contrat, sans donnée |
| B5 | Lien `freeProductionSlots` ↔ `UnlockableProductionSlotDTO` | 693 | Aucune règle déductible |
| B6 | `levelPerAge` : sémantique | 12 | Nom suggestif, non confirmé |
| B7 | `PinnedAgeComponentDTO` : sémantique | 44 | Marqueur sans champ |
| B8 | 598 expansions sans `expansionType` | 598 | Pas de défaut lisible |
| B9 | 3 `evolving` à `starLevels` décalé de 1 | 3 | Intentionnel ou erreur |
| B10 | `workersRequired.amount` vs `requiredWorkers[].amount` | 763 | Redondance non déclarée |
| B11 | `BoostResourceComponentDTO` : exclusivités des 8 champs | 5 | Trop peu d'occurrences |
| B12 | `age` absent exactement sur les 44 `evolving` | 44 | Régularité observée, non déclarée |
| B13 | `happinessEffects[0]` toujours vide | 388 | Indice implicite, non porté par un champ |
| B14 | `ObstacleDefinitionDTO` mal classé | 10 | Relève du Combat / Carte du monde — §9 |
| ✅ B15 | `PremiumLayoutDefinitionDTO` non référencé par un wonder | 2 | **Confirmé** : aucun wonder ne le cite ; seul lien = `wonders.freeLayouts = 2` (`05-wonders-reliques-heritage.md` §7) |
