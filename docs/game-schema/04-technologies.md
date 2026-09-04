# Domaine : Technologies

Type couvert : `TechnologyDefinitionDTO` (502, 590 Ko).
`CrateCostDefinitionDTO` (392) était rattaché à ce domaine dans le découpage initial — **c'est une
erreur, voir §7**. Le domaine se réduit donc à un seul type racine.
Prérequis : [`00-conventions.md`](00-conventions.md), [`03-batiments.md`](03-batiments.md).

---

## 1. `TechnologyDefinitionDTO` — champs racine

```ts
interface TechnologyDefinition {
  id: string;              // 502/502 — unique
  name: string;            // 502/502 — 501 valeurs distinctes (⚠️ un doublon, §1.3)
  age: string;             // 502/502 -> AgeDefinition.id — 14 valeurs
  column: number;          // 502/502 — int32, 1..15
  order: number;           // 502/502 — int32, 1..4
  components: [ResearchComponent];  // 502/502 — TOUJOURS exactement 1
  cities?: string[];       // 458/502 -> CityDefinition.id — ⚠️ 44 absents, §1.4
}
```

Le domaine est structurellement le plus simple du périmètre : un seul type de composant, une seule
occurrence par technologie, aucune imbrication profonde hors les récompenses.

### 1.1 `(age, column, order)` — une grille stricte

**Les 502 technologies occupent 502 positions `(age, column, order)` distinctes — zéro collision.**
`column` (1..15) et `order` (1..4) forment donc les coordonnées d'une grille d'affichage par âge,
et le triplet est une clé alternative valide.

Répartition de `order` : 1 (184), 2 (144), 3 (120), 4 (54) — décroissante, cohérente avec des
colonnes de hauteur variable plutôt qu'une grille pleine.

⚠️ `ComingSoon` et `DawnAge` n'apparaissent pas dans `age` : 14 âges sur 16 portent des technologies
(cf. `01-socle.md` §1). Volume par âge : 44 pour `HighMiddleAges`, `LateGothicEra`, `EarlyGothicEra`
et `KingdomOfSicily` ; 16 pour `StoneAge`, le plus pauvre.

### 1.2 `components` — `ResearchComponentDTO`

```ts
interface ResearchComponent {   // @type = ResearchComponentDTO — 502/502, toujours 1 seul
  id: string;
  start: { resourceChanges: ResourceChange[]; requirements?: ResearchRequirement[] };
  finish: { rewards: Reward[]; requirements?: RegionAcquiredRequirement[] };
}
```

`start` = ce que la recherche coûte et exige. `finish` = ce qu'elle débloque.
⚠️ Contrairement aux composants de bâtiment (`03-batiments.md` §4), il n'y a **pas** de champ
`complete` ici. Le trio `start`/`finish`/`complete` n'est donc pas un motif universel.

### 1.3 ⚠️ `name` en doublon

`TimberFraming` est porté par **deux** technologies : `Technology_FeudalAge_TimberFraming` et
`Technology_HighMiddleAges_TimberFraming`. `name` n'est donc **pas une clé** — seul `id` l'est.
Rien ne dit s'il s'agit d'une reprise volontaire du même nom à deux âges ou d'une erreur.

### 1.4 ⚠️ 44 technologies sans `cities`

Réparties exactement : 22 en `EarlyGothicEra`, 22 en `LateGothicEra`. Toutes les autres technologies
portent une cité unique.

La structure d'ensemble est très régulière — **chaque âge a une branche `City_Capital` et au plus une
branche de cité secondaire** :

| Âge | Capital | Cité secondaire | Sans `cities` |
|---|---|---|---|
| StoneAge, BronzeAge | 16, 24 | — | — |
| MinoanEra, ClassicGreece | 18, 16 | Egypt 13, 14 | — |
| EarlyRome, RomanEmpire | 16, 18 | China 12, 13 | — |
| ByzantineEra, AgeOfTheFranks | 21, 20 | Mayas 21, 23 | — |
| FeudalAge, IberianEra | 20, 20 | Vikings 19, 22 | — |
| HighMiddleAges, KingdomOfSicily | 22, 22 | Arabia 22, 22 | — |
| **EarlyGothicEra, LateGothicEra** | 22, 22 | — | **22, 22** |

Les 44 sans `cities` forment donc une **troisième branche** aux deux derniers âges. Leurs noms
(`LettersOfCredit`, `ForeignTradeLinks`, `HarborCraneSystems`, `WharfConstruction`, `CustomsHouses`,
`OttomanPostalSystem`) et leurs récompenses (`UnlockTradingCultureHubEnhancementRewardDTO`)
convergent vers la branche Commerce.

⚠️ **Mais rien dans les données ne le déclare** : il n'y a ni champ de branche, ni marqueur. Et
l'absence de `cities` est contredite en pratique — **57 de leurs récompenses portent elles-mêmes un
champ `cities`**, contre 60 qui n'en portent pas. La cité est donc connue au niveau des effets mais
pas au niveau de la technologie. Incohérence signalée, non résolue. À reprendre au domaine Commerce.

---

## 2. `start` — coût et prérequis

### 2.1 `resourceChanges[]` — le coût de recherche

Présent sur les 502 technologies. Objet monomorphe `{ definitionId, amount }` (`amount` en
int64-string, cf. C3). **2 860 lignes, dont 2 860 résolvent vers un `ResourceDefinition.id`** — aucune
référence cassée.

Structure du coût très stable :

| Nb de lignes de coût | Technologies |
|---|---|
| 6 | 422 |
| 5 | 41 |
| 3 | 23 |
| 4 | 12 |
| 1 ou 2 | 4 |

Ressources dominantes : `research_points` (502 — sur **toutes**), `coins` (499), `food` (498), puis
les biens génériques par âge `DYN|<Age>_Good1..3`. Le cas majoritaire à 6 lignes est donc
« points de recherche + pièces + nourriture + 3 biens de l'âge ».

### 2.2 `requirements[]` — l'arbre technologique

```ts
interface ResearchRequirement { id: string }   // -> TechnologyDefinition.id
```

⚠️ Le champ s'appelle `id` et non `technologyId` : **c'est une clé étrangère, pas l'identité de
l'objet**. Même piège que sur les skins (`03-batiments.md` §5.2).

Mesures du graphe :

- **745 arêtes, 745/745 résolues.** Aucun prérequis cassé.
- **Acyclique** (vérifié par parcours en profondeur).
- Une seule racine : `Technology_StoneAge_TribalSettlement` est la seule technologie sans prérequis.
- Nombre de prérequis : 1 (301 technos), 2 (160), 3 (36), 4 (4), 0 (1).
- ⚠️ **730 arêtes relient deux technologies du même âge, 15 franchissent exactement un âge.** Aucune
  arête ne saute plus d'un âge, et aucune ne remonte. La progression est strictement monotone.

---

## 3. `finish` — ce que la technologie débloque

C'est le cœur informationnel du domaine : **28 types de récompense distincts**, formant
1 260 récompenses réparties sur 61 combinaisons observées.

⚠️ Contrairement au domaine Bâtiments, ces récompenses ne sont **presque jamais** des arbres
`RewardDefinitionDTO` opaques : **1 seule occurrence sur 1 260**. Ce sont des DTO typés spécifiques,
directement exploitables et **entièrement dans le périmètre**.

### 3.1 ⚠️ `baseData` — enveloppe partagée au sens ambigu

1 227 des 1 260 récompenses portent un objet `baseData` de forme constante :

```ts
interface RewardBaseData {
  id?: string;        // 604 occ.
  hidden?: boolean;   // 216 occ. — toujours `true` quand présent, jamais `false`
}
```

**`baseData.id` a deux significations incompatibles selon le type de récompense** — c'est le piège
principal du domaine :

| Sens de `baseData.id` | Types concernés | occ. |
|---|---|---|
| **Référence vers la cible débloquée** | `UnlockBuildingUpgradeRewardDTO` (395 → `Building.id`), `UnlockBuildingRewardDTO` (67 → `Building.id`), `UnlockGoodRewardDTO` (61 → `Resource.id`), `UnlockQuestlineRewardDTO` (43 → `Questline.id`), `UnlockAgeRewardDTO` (14 → `Age.id`), `RewardDefinitionDTO` (1) | **581** |
| **Identifiant propre de la récompense** | `InstantUpgradeRewardDTO` (17), `RelicRewardDTO` (3), `WorkerRewardDTO` (2), `InstantExpansionConstructionUnlockedRewardDTO` (1) | **23** |

Les 23 du second groupe ne résolvent vers aucune entité racine — et c'est normal : leurs valeurs sont
des ids synthétiques suivant la convention `<TechnologyId>_<TypeDeRecompense>_1`
(ex. `Technology_BronzeAge_Village_TransitionReward_1`,
`Research_Technology_AgeOfTheFranks_MayanConsensus_RelicReward1`).

➡️ **Un modèle ne peut pas typer `baseData.id` comme une référence.** La résolution dépend du `@type`
de la récompense porteuse. Modéliser `baseData` comme enveloppe générique, et porter le sens de `id`
dans chaque variante.

⚠️ **33 récompenses n'ont aucun `baseData`** : `IncidentRewardDTO` (13), `IncreaseLimitRewardDTO` (11),
`IncreaseWonderSlotsRewardDTO` (4), `UnlockWonderCollectionRewardDTO` (3), `CommanderRewardDTO` (1),
`IncreaseTradingSlotRewardDTO` (1). Ces types portent `hidden` directement à leur racine au lieu de
le mettre dans `baseData` — **deux emplacements pour le même champ**, selon le type.

### 3.2 Les 28 types de récompense

Ordonnés par volume. `→` indique la cible et son taux de résolution.

| `@type` | n | Champs propres | Cible |
|---|---|---|---|
| `IncreaseBuildingLimitRewardDTO` | 499 | `cities[]`, `limitsByGroup[]` | §3.3 |
| `UnlockBuildingUpgradeRewardDTO` | 395 | `cities[]` | `baseData.id` → `Building.id` ✅ 395/395 |
| `UnlockBuildingRewardDTO` | 67 | `cities[]` | `baseData.id` → `Building.id` ✅ 67/67 |
| `UnlockGoodRewardDTO` | 61 | `cities[]`, `age` | `baseData.id` → `Resource.id` ✅ 61/61 |
| `ResourceRewardDTO` | 58 | `resource`, `amount` (int32) | `Resource.id` |
| `UnlockQuestlineRewardDTO` | 43 | — | `baseData.id` → `Questline.id` ✅ 43/43 — ⚠️ hors scope |
| `InstantUpgradeRewardDTO` | 17 | `cities[]`, `sourceGroup`, `target`, `duration`, `start`, `complete` | `target` → `Building.id` |
| `UnlockTradingCultureHubEnhancementRewardDTO` | 16 | `enhancementDefinitionId` | domaine Commerce |
| `UnlockFeatureRewardDTO` | 15 | `feature?` (14/15) | §3.4 |
| `UnlockAgeRewardDTO` | 14 | — | `baseData.id` → `Age.id` ✅ 14/14 |
| `IncidentRewardDTO` | 13 | `incident`, `city`, `amount`, `hidden` | ⚠️ hors scope (§6) |
| `IncreaseBazaarOfferSlotsRewardDTO` | 11 | `cities[]`, `amount` | — |
| `IncreaseLimitRewardDTO` | 11 | `maxIncrease` (int64-string), `type?` (1/11) | §3.5 |
| `IncreaseBuildingMaxLevelRewardDTO` | 8 | `group`, `newMaxLevel` (int32) | §3.6 |
| `UnlockCityRewardDTO` | 5 | `city` | `City.id` |
| `IncreaseBazaarLevelRewardDTO` | 5 | `cities[]`, `amount` | — |
| `IncreaseWonderSlotsRewardDTO` | 4 | `amount`, `hidden`, `slotType?` (3/4) | domaine Wonders |
| `RelicRewardDTO` | 3 | `definition`, `amount` | domaine Wonders |
| `UnlockWonderCollectionRewardDTO` | 3 | `wonderCollectionDefinition`, `hidden` | domaine Wonders |
| `IncreaseExpansionRightRewardDTO` | 3 | `city`, `premium` (int32), `subType?` (2/3) | §3.7 |
| `WorkerRewardDTO` | 2 | `city`, `type`, `amount` | — |
| `CommanderRewardDTO` | 1 | `commander`, `hidden` | ⚠️ hors scope |
| `InstantExpansionConstructionUnlockedRewardDTO` | 1 | `city`, `constructionComponentId` | §3.7 |
| `UnlockTradingCultureRewardDTO` | 1 | `tradingCultureDefinitionId` | domaine Commerce |
| `UnlockTradingCulturePartRewardDTO` | 1 | `tradingCultureDefinitionId`, `partIndex` | domaine Commerce |
| `IncreaseTradingSlotRewardDTO` | 1 | `amount` | — |
| `IncreaseAvailablePremiumTradeSlotsRewardDTO` | 1 | `amount` | — |
| `RewardDefinitionDTO` | 1 | `id`, `hidden`, `rewards[]` | ⚠️ hors scope (arbre opaque) |

### 3.3 `IncreaseBuildingLimitRewardDTO` — le type dominant

499 occurrences, présent dans la majorité des combinaisons. C'est le mécanisme qui autorise à poser
davantage de bâtiments d'une famille donnée.

```ts
interface IncreaseBuildingLimitReward {
  baseData: RewardBaseData;
  cities: string[];              // 499/499
  limitsByGroup: LimitEntry[];   // 499/499 — 499 entrées au total
}
type LimitEntry =
  | { group: string; amount: number }      // 481 — group -> Building.group ✅ 481/481 résolus
  | { resource: string; amount: number };  //  18 — resource -> Resource.id (tous des DYN|<Age>_GoodN)
```

⚠️ **Le champ s'appelle `limitsByGroup` mais 18 de ses entrées sont clés par `resource`, pas par
`group`.** Les deux formes sont mutuellement exclusives (481 + 18 = 499). Le nom du champ est donc
trompeur pour 3,6 % des entrées ; toutes les entrées `resource` visent des biens génériques par âge
et `City_Capital`.

✅ Les 481 `group` résolvent tous vers un `BuildingDefinitionDTO.group` — **contrairement à
`buildingGroupSorting` (cf. `03-batiments.md` §10), c'est bien une référence fiable.**

### 3.4 `UnlockFeatureRewardDTO.feature`

14 valeurs distinctes, chacune une seule fois : `PLAYER_ENCOUNTERS`, `MUSEUM`, `DAILY_BONUS`,
`WONDERS`, `HERITAGE_VAULT`, `ALLIANCE`, `ALLIANCE_CITY`, `SEASON_PASS`, `HARBOR`, `BAZAAR`,
`DAILY_OFFERS`, `TREASURE_HUNT`, `EVENTS`, `IN_APP_BROWSER_PAYMENT` (préfixe
`UnlockableFeatureConstant_`).

⚠️ **Une 15ᵉ occurrence n'a pas de champ `feature`** — récompense de déblocage de fonctionnalité sans
fonctionnalité nommée. Anomalie isolée, sens indéterminé.

### 3.5 `IncreaseLimitRewardDTO`

11 occurrences : dix `{ maxIncrease: "10000" }` ou `"20000"` sans `type`, et **une seule** avec
`type: "LimitType_LIMIT_TRADING_GOODS"` et `maxIncrease: "100"`.

⚠️ Sans `type`, on ne sait pas quelle limite est augmentée. 10 des 11 récompenses sont donc
**inexploitables en l'état**. `LimitType_LIMIT_TRADING_GOODS` fait écho à
`DynamicLimitDefinitionDTO.definitionId = "LimitTradingGoods"` (cf. `02-dynamic.md` §6.2, l'entité
orpheline) mais la casse diffère et **aucun lien n'est déclaré**.

### 3.6 `IncreaseBuildingMaxLevelRewardDTO` — lien avec le piège `level`

8 occurrences, toutes sur 4 groupes de la cité capitale, portant `newMaxLevel` à 41 puis 42 :

```
domesticFarm → 41 puis 42     ruralFarm  → 41 puis 42
smallHome    → 41 puis 42     averageHome → 41 puis 42
```

Cohérent avec la mécanique A décrite en `03-batiments.md` §1.1 (`home` et `farm` vont jusqu'à
`level` 42). ⚠️ Mais le plafond est ici relevé **par `group`**, alors que la chaîne d'upgrade est
définie **par `id`** via `UpgradeComponentDTO.target`. Deux axes différents pour la même notion de
niveau maximal ; leur articulation n'est pas déclarée.

### 3.7 Récompenses liées aux expansions

Pertinentes pour le Layout Builder, mais **très peu nombreuses** :

```json
{"city": "City_Vikings", "premium": 6}
{"city": "City_Capital", "premium": 3, "subType": "ExpansionSubType_HARBOR"}
{"city": "City_Capital", "premium": 2, "subType": "ExpansionSubType_HARBOR"}
```

⚠️ `IncreaseExpansionRightRewardDTO` n'a que 3 occurrences, et son champ `premium` est un **int32**,
pas un booléen — le nombre de droits d'expansion premium accordés. `subType` absent sur 1 des 3.

✅ `InstantExpansionConstructionUnlockedRewardDTO` (1 occurrence, sur
`Technology_IberianEra_GlacierMastery`) porte
`constructionComponentId: "Connector_Vikings_ConstructionGrid1"`, qui **résout** vers le
`ConstructionComponentDTO.id` embarqué dans `ExpansionCostsDTO(ExpansionCost_Vikings_Connector).components[]`.

⚠️ C'est une référence vers un **id de composant imbriqué**, pas vers une entité racine — le seul cas
du périmètre. Et le lien est **réciproque** : ce même composant porte
`start.requirements[]:ResearchRequirementDTO.id = "Technology_IberianEra_GlacierMastery"`, soit un
aller-retour entre les deux domaines.

> **Correction (2026-08-29).** Une version antérieure de ce document donnait pour ce champ la valeur
> `Technology_IberianEra_GlacierMastery_CitySpaceRestriction_Unlock_1` et le déclarait non résolu.
> C'était une confusion : cette valeur est le `baseData.id` de la récompense (un identifiant propre,
> cf. §3.1), pas son `constructionComponentId`.

➡️ **Les 502 technologies ne portent que 4 récompenses touchant aux droits d'expansion.** Le nombre
d'expansions disponibles par ville n'est donc **pas** principalement gouverné par l'arbre
technologique. Constat utile pour le Layout Builder : la source de vérité est ailleurs
(`ExpansionDefinitionDTO`, 832 entités, cf. `03-batiments.md` §7.1).

---

## 4. Intégrité référentielle

| Référence | Résolution |
|---|---|
| `age` → `AgeDefinition.id` | 502/502 |
| `cities[]` → `CityDefinition.id` | 458/458 |
| `start.resourceChanges[].definitionId` → `Resource.id` | 2 860/2 860 |
| `start.requirements[].id` → `Technology.id` | 745/745 |
| `UnlockBuildingUpgradeReward.baseData.id` → `Building.id` | 395/395 |
| `UnlockBuildingReward.baseData.id` → `Building.id` | 67/67 |
| `UnlockGoodReward.baseData.id` → `Resource.id` | 61/61 |
| `UnlockQuestlineReward.baseData.id` → `Questline.id` | 43/43 |
| `UnlockAgeReward.baseData.id` → `Age.id` | 14/14 |
| `limitsByGroup[].group` → `Building.group` | 481/481 |

| `InstantExpansionConstructionUnlockedReward.constructionComponentId` → `ConstructionComponent.id` | 1/1 |

**Aucune référence cassée dans tout le domaine — sans exception.** Les seuls `baseData.id` non
résolus (23) sont des identifiants propres, pas des références (§3.1).

---

## 5. Reprise des points signalés au découpage

**Les 5 technologies « Rise of X ».** Confirmé : `finish.requirements[]` n'existe que sur ces 5
technologies, avec un unique type `RegionAcquiredRequirementDTO { regions: string[] }` pointant vers
`RegionDefinitionDTO` — **hors scope**.

```
Technology_MinoanEra_RiseOfEgypt        -> Continent_DesertDelta_Region_106
Technology_ByzantineEra_RiseOfTheMayas  -> Continent_VolcanicJungle_Region_101
Technology_KingdomOfSicily_RiseOfArabia -> Continent_DahnaDesert_Region_101
(+ 2 autres)
```

⚠️ Ces technologies portent aussi `UnlockCityRewardDTO` : **ce sont elles qui débloquent les cités
secondaires.** Leur condition de déblocage reste donc inconnue dans ce modèle — trou fonctionnel
assumé, pas une donnée manquante. Impact pour le Layout Builder : on sait *quelle* technologie ouvre
une cité, pas *ce qu'elle exige*.

**Les 13 technologies accordant un incident.** Confirmé : `IncidentRewardDTO`
`{ incident, city, amount, hidden }`, 13 occurrences, `incident` → `IncidentDefinitionDTO` (hors
scope). Sans effet sur le Layout Builder.

---

## 6. Frontière de scope

Récompenses pointant hors périmètre, toutes de faible volume :
`UnlockQuestlineRewardDTO` (43), `IncidentRewardDTO` (13), `RelicRewardDTO` (3),
`UnlockWonderCollectionRewardDTO` (3), `CommanderRewardDTO` (1), `RewardDefinitionDTO` (1),
plus les 5 `RegionAcquiredRequirementDTO` (§5). Total : **69 sur 1 265 éléments**, soit 5,5 %.

C'est le domaine le mieux refermé du périmètre après le Socle.

---

## 7. ⚠️ `CrateCostDefinitionDTO` n'appartient pas à ce domaine

392 entités, `{ id, crates[] }` avec `crates[] = { id, numberOfCrates: int32, costPerCrate: ResourceDTO }`
(1 469 entrées). Je l'avais rattaché aux Technologies lors du découpage initial.

**Vérification : aucune `TechnologyDefinitionDTO` ne le référence.** Ses 588 références viennent
exclusivement du domaine Alliance, hors scope :

```
AllianceTechnologyDefinitionDTO.crateCostDefinitionId                              196
AllianceQuarterDefinitionDTO.components[].dynamicData.values[].then.crateCostDefinitionId   196
AllianceQuarterLevelUpDefinitionDTO.dynamicData.values[].then.crateCostDefinitionId         196
```

Ses identifiants le confirment : namespace `crate_cost.quarterUpgrade_*`.

➡️ **`CrateCostDefinitionDTO` relève du domaine Alliance.** Documenté ici pour mémoire ; son
rattachement aux Technologies était une erreur de mon découpage initial — la deuxième après
`ObstacleDefinitionDTO` (`03-batiments.md` §9). Le périmètre en scope passe de 6 231 à
**5 829 entités** (−392 ici, −10 pour les obstacles).

---

## 8. Récapitulatif des points ouverts

| # | Point | Ampleur | Statut |
|---|---|---|---|
| ✅ — | 5 technologies « Rise of X » → région hors scope | 5 | **Confirmé** : trou assumé ; ce sont elles qui ouvrent les cités secondaires — §5 |
| ✅ — | 13 technologies accordant un incident | 13 | **Confirmé** : hors scope, sans impact — §5 |
| T1 | `baseData.id` : référence **ou** identifiant propre selon le `@type` porteur | 604 | **Piège de modélisation majeur** — §3.1 |
| T2 | `hidden` porté tantôt dans `baseData`, tantôt à la racine du reward | 216 + 33 | Deux emplacements pour un même champ |
| ✅ T3 | 44 technologies sans `cities`, mais 57 de leurs récompenses en portent | 44 | **Résolu** (`07-commerce.md` §8) : branche maritime/commerce confirmée par les récompenses (groupes `normalShipyard`/`lighthouse`/`pier`, ressources `trading_upgrade_*`), mais l'absence de `cities` est une **incohérence**, pas un discriminant — 3 technologies *avec* `cities` portent les récompenses commerciales structurantes |
| T4 | `limitsByGroup[]` contient 18 entrées clées par `resource` | 18 | Nom de champ trompeur |
| T5 | 10 des 11 `IncreaseLimitRewardDTO` sans `type` | 10 | **Inexploitables** : limite cible inconnue — §3.5 |
| T6 | `name` en doublon (`TimberFraming`) | 2 | `name` n'est pas une clé |
| T7 | 1 `UnlockFeatureRewardDTO` sans `feature` | 1 | Anomalie isolée |
| T8 | `IncreaseBuildingMaxLevelRewardDTO` par `group` vs chaîne d'upgrade par `id` | 8 | Deux axes pour la même notion — §3.6 |
| ✅ T9 | `InstantExpansionConstructionUnlockedRewardDTO.constructionComponentId` | 1 | **Constat erroné, retiré** : la référence résout vers un id de composant imbriqué (`ExpansionCostsDTO`), et le lien est réciproque — §3.7 |
| T10 | `ResearchComponentDTO` sans `complete` (contrairement aux bâtiments) | 502 | Le motif start/finish/complete n'est pas universel |
| ⚠️ T11 | `CrateCostDefinitionDTO` mal classé | 392 | Relève d'Alliance, hors scope — §7 |
