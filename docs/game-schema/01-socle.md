# Domaine : Socle

Types couverts : `AgeDefinitionDTO`, `CityDefinitionDTO`, `ResourceDefinitionDTO`,
`ConstantsDefinitionDTO`, `BoostDefinitionDTO`.
Prérequis de lecture : [`00-conventions.md`](00-conventions.md) (encodage, int64-en-string,
dénormalisation, identifiants).

---

## 1. `AgeDefinitionDTO` — n = 16

L'âge est la principale dimension de progression du jeu. Référencé par id (string) depuis à peu
près tous les autres domaines (`age`, `when` des mappings `PlayerAgeDynamicChangeDTO`, `ageFactors[].age`…).

```ts
interface AgeDefinition {
  id: string;      // 16/16 — clé métier, ex. "BronzeAge"
  order: number;   // 16/16 — int32
}
```

Table complète :

| order | id | | order | id |
|---|---|---|---|---|
| 1 | `DawnAge` | | 9 | `AgeOfTheFranks` |
| 2 | `StoneAge` | | 10 | `FeudalAge` |
| 3 | `BronzeAge` | | 11 | `IberianEra` |
| 4 | `MinoanEra` | | 12 | `KingdomOfSicily` |
| 5 | `ClassicGreece` | | 13 | `HighMiddleAges` |
| 6 | `EarlyRome` | | 14 | `EarlyGothicEra` |
| 7 | `RomanEmpire` | | 15 | `LateGothicEra` |
| 8 | `ByzantineEra` | | 17 | `ComingSoon` |

⚠️ **`order = 16` n'existe pas.** La suite est 1…15 puis 17. `order` n'est donc pas un index dense et
ne peut pas servir d'indice de tableau. Aucune donnée n'explique le trou.

⚠️ `ComingSoon` (order 17) est un **âge sentinelle** et non un âge jouable : il n'apparaît dans aucun
domaine des `when` de mapping dynamique (qui plafonnent à 15 valeurs) et n'est porté par aucune
ressource. À traiter comme un marqueur de fin de contenu.

⚠️ Les domaines de valeurs d'âge observés ailleurs ne coïncident pas tous avec ces 16 ids :

| Contexte | Nb d'âges distincts | Manquants |
|---|---|---|
| `AgeDefinitionDTO` | 16 | — |
| `PlayerAgeDynamicChangeDTO.values[].when` | 15 | `ComingSoon` |
| `ConversionTraitDTO.ageFactors[].age` | 15 | `ComingSoon` |
| `BuildingAgeDynamicChangeDTO` / `SeasonPassAge…` / `TreasureHuntAge…` | 14 | `ComingSoon`, `DawnAge` |
| `ResourceDefinitionDTO.age` | 13 | `ComingSoon`, `DawnAge`, `StoneAge` |

Ces écarts sont cohérents avec du contenu absent, pas avec des ids inconnus : **aucune valeur d'âge
hors des 16 ids n'a été rencontrée**.

---

## 2. `CityDefinitionDTO` — n = 6

Une « cité » est un territoire jouable distinct, avec sa propre grille, sa propre monnaie et son
propre menu de construction. C'est la seconde dimension transversale majeure (après l'âge).

```ts
interface CityDefinition {
  id: string;                                   // 6/6 — "City_Capital" | "City_Egypt" | "City_China"
                                                //       | "City_Arabia" | "City_Vikings" | "City_Mayas"
  order: number;                                // 6/6 — int32, 1..6, dense
  buildMenuTypes: string[];                     // 6/6 — 32 occ., 21 valeurs distinctes
                                                //       = sous-ensemble de BuildingDefinitionDTO.type
  cityInitDefinition: CityInitDefinition;        // 6/6 — COPIE (voir C5)
  softCurrencyResourceDefinitions: ResourceDefinition[]; // 6/6 — 16 occ., COPIES (voir C5)
  components?: CityCultureAreaComponent[];       // 2/6 seulement
}
```

### 2.1 `cityInitDefinition`

Copie intégrale d'un `CityInitDefinitionDTO` racine (identité vérifiée 6/6, cf. C5).

⚠️ Il existe **24 `CityInitDefinitionDTO` racine mais seulement 6 sont référencés** par une cité.
Les 18 autres sont des variantes suffixées par âge ou par usage :
`CityInit_Capital_StoneAge`, `CityInit_Capital_BronzeAge`, … `CityInit_Capital_KingdomOfSicily_END`,
`CityInit_Capital_BronzeAge_TestBattle`, `CityInit_Capital_RomanEmpire_TestBattle`,
`CityInit_Egypt_ClassicGreece`, `CityInit_Vikings_FeudalAge`, `CityInit_Vikings_IberianEra`…

⚠️ Repris au domaine Bâtiments (cf. `03-batiments.md` §7.3), avec une correction : **la cité EST
récupérable depuis les données** — chaque `InitialGridComponentDTO.initialGridAreas[].city` la porte,
de façon homogène sur les 24 entités. En revanche **l'âge n'est lisible que dans le suffixe de l'id** :
`CityInitDefinitionDTO` n'a que 3 clés (`@type`, `id`, `components`) et aucun champ d'âge. Les 18
orphelins ne sont référencés de nulle part. S'y ajoute un décalage d'un âge systématique entre le
suffixe et les biens octroyés, avec 2 exceptions (`_END`, `_TestBattle`) — inexpliqué.

Structure (dans le socle, on ne décrit que ce qui est atteignable depuis `CityDefinitionDTO` ;
le détail complet relève du domaine Bâtiments) :

```ts
interface CityInitDefinition {
  id: string;
  components: (InitialResourceComponent | InitialGridComponent)[];  // exactement ces 2, 24/24
}
interface InitialResourceComponent {                 // @type = InitialResourceComponentDTO
  resources: { definitionId: string; amount: string }[];   // -> ResourceDefinition.id ; amount = int64-string
}
interface InitialGridComponent {                     // @type = InitialGridComponentDTO
  expansionSize: number;                             // int32, 3 ou 4
  initialGridAreas: {                                // 58 occ. sur les 6 cités
    id: string;                                      // -> ExpansionDefinition.id
    city: string;                                    // -> CityDefinition.id (redondant avec le porteur)
    x: number; y: number;                            // int32, 23..48 / 30..48
    expansionSubType?: string;                       // 2 occ. seulement, valeur unique "ExpansionSubType_WATER"
  }[];
}
```

### 2.2 `softCurrencyResourceDefinitions`

Copies intégrales de `ResourceDefinitionDTO` (identité vérifiée 16/16). Toutes ont
`resourceType = "soft_currency"`. Ce champ **n'est pas la liste des monnaies de la cité porteuse** :
chacune des 6 cités embarque une liste dont les entrées portent leur propre champ `cities[]`, et les
16 copies couvrent les 6 cités. C'est une projection redondante du sous-ensemble `soft_currency` du
catalogue de ressources.

⚠️ Le sens exact de ce champ (« monnaies visibles depuis cette cité » ? « monnaies affichées dans son
UI » ?) **n'est pas déterminable depuis les données seules**. Documenté comme copie ; non interprété.

### 2.3 `components[]` — `CityCultureAreaComponentDTO`

Présent sur **2 cités seulement** (`City_Arabia` : 6 zones, `City_Egypt` : 2 zones — 8 au total).

```ts
interface CityCultureAreaComponent {   // @type = CityCultureAreaComponentDTO
  id: string;                          // "City_Arabia_CultureArea_1" .. ; 8 valeurs distinctes
  x: number; y: number;                // int32
  width: number; height: number;       // int32
  points: number;                      // int32, 250 ou 300
}
```

⚠️ Asymétrie non expliquée : les 4 autres cités n'ont aucune zone de culture déclarée. Rien dans les
données ne dit s'il s'agit d'une absence de contenu ou d'un mécanisme réservé à ces deux cités.

---

## 3. `ResourceDefinitionDTO` — n = 326

Catalogue de tout ce qui est comptabilisable. C'est l'entité la plus référencée du jeu.

```ts
interface ResourceDefinition {
  id: string;            // 326/326 — unique
  resourceType: string;  // 326/326 — 15 valeurs, voir 3.1
  traits: Trait[];       // 326/326 — union polymorphe, voir 3.3
  cities?: string[];     // 266/326 — -> CityDefinition.id … MAIS voir ⚠️ 3.4
  age?: string;          // 115/326 — -> AgeDefinition.id (13 valeurs observées)
  order?: string;        // 74/326  — ⚠️ int64-en-STRING ici ("1".."5"), contrairement aux autres `order`
  group?: string;        // 70/326  — 32 valeurs, ex. "goldsmith", "jadeQuarry" ; corrèle avec
                         //           BuildingDefinitionDTO.group (à confirmer au domaine Bâtiments)
}
```

### 3.1 `resourceType` et optionalité réelle

L'optionalité des champs **dépend entièrement du `resourceType`**. Un schéma qui déclarerait
simplement « tous ces champs sont optionnels » perdrait l'essentiel de la structure. Mesures exactes :

| `resourceType` | n | `age` | `cities` | `order` | `group` |
|---|---|---|---|---|---|
| `good` | 106 | 106 | 67 | 67 | 67 |
| `soft_currency` | 85 | 3 | 82 | 1 | 3 |
| `evolution_token` | 44 | 0 | 44 | 0 | 0 |
| `blueprint` | 28 | 0 | 28 | 0 | 0 |
| `hub_resource` | 22 | 0 | 22 | 0 | 0 |
| `building_piece` | 19 | 6 | 19 | 0 | 0 |
| `material` | 10 | 0 | 0 | 0 | 0 |
| `alliance_resource` | 3 | 0 | 0 | 3 | 0 |
| `alliance_research_point` | 3 | 0 | 0 | 3 | 0 |
| `gacha`, `gacha_dust` | 1+1 | 0 | 0 | 0 | 0 |
| `premium` | 1 | 0 | 1 | 0 | 0 |
| `wonder_contribution` | 1 | 0 | 1 | 0 | 0 |
| `negotiation_wildcard` | 1 | 0 | 1 | 0 | 0 |
| `research_points` | 1 | 0 | 1 | 0 | 0 |

Seul `good` a `age` quasi systématique (106/106). Seul `good` porte le trio `cities`/`order`/`group`
de façon corrélée — et sur **67 des 106** seulement : les 39 restants sont les `DYN|…` (cf. 3.2).

### 3.2 Conventions d'id corrélées au type

| Motif d'id | n | `resourceType` |
|---|---|---|
| `EvolutionToken\|<buildingId>` | 44 | `evolution_token` |
| `DYN\|<Age>_GoodN` | 39 | `good` |
| `Blueprint_Wonder_<City>_<Nom>` | 28 | `blueprint` |
| `BuildingPiece\|<buildingId>` | 19 | `building_piece` |
| id nu (`coins`, `food`, `deben`, `asper`…) | 196 | tous les autres |

Le suffixe après `|` est un `BuildingDefinition.id` (à recouper au domaine Bâtiments). Les `DYN|`
sont les biens génériques par âge (`DYN|ClassicGreece_Good1`…), référencés par la couche Dynamic.

### 3.3 `traits[]` — union polymorphe (18 variantes)

Toujours présent (326/326), jamais vide. C'est là que se trouve le comportement de la ressource.

| `@type` | n | Champs |
|---|---|---|
| `NotSmallerZeroTraitDTO` | 502* | *(aucun)* — marqueur |
| `ConversionTraitDTO` | 205 | `resource: string` (→ `gears` \| `premium`, tous deux des `ResourceDefinition.id` valides) ; `ageFactors: {age: string; factor: number}[]` (3 075 occ., float 0.00035…19900) |
| `TradingTraitDTO` | 78 | `exchangeRate: number` (float, 1.0…7.5, 13 valeurs) |
| `RelatedBuildingTraitDTO` | 63 | `building: string` → `BuildingDefinition.id` |
| `HeritageContributionTraitDTO` | 41 | `heritageXpPerUnit: number` (int, toujours 1) |
| `OriginTraitDTO` | 41 | `name: string` (13 val., ex. `Event_Aztec`, `Treasure_Hunt`) ; `type: "ATH" \| "inGameEvent"` |
| `GoodBuildingTraitDTO` | 39 | `building: string` → `BuildingDefinition.id` |
| `UnlockWonderTraitDTO` | 28 | `wonderDefinitionId: string` → `ReworkedWonderDefinition.id` (28/28, bijection avec les 28 wonders) |
| `CappingTraitDTO` | 28 | `max: string` (int64-string, 14 valeurs de "99" à "20000") |
| `TradingHubRegeneratingTraitDTO` | 22 | `amountPerUnit: number` (float 40…500) ; `duration: string` (toujours `"600s"`) |
| `EventGrandPrizeTraitDTO` | 22 | *(aucun)* — marqueur |
| `IncreaseResourceCapacityAwareTraitDTO` | 8 | *(aucun)* — marqueur |
| `GameRegeneratingTraitDTO` | 3 | `amountPerUnit: number` (1.0) ; `duration: string` ; `max: string` |
| `PremiumTraitDTO` | 1 | *(aucun)* — marqueur |
| `WildcardTraitDTO` | 1 | `feature: string` (`"negotiation_wildcard"`) |
| `CronRegeneratingTraitDTO` | 1 | `cron: string` (`"@daily"`) ; `amountPerUnit: number` ; `max: string` |
| `FillDuringTreasureHuntRestPhaseTraitDTO` | 1 | *(aucun)* — marqueur |
| `DynamicLimitTraitDTO` | 1 | `definitionId: string` → `DynamicLimitDefinition.definitionId` |

\* `NotSmallerZeroTraitDTO` : 502 occurrences pour 326 ressources — le compte 502 est le total
toutes entités confondues (le trait apparaît aussi hors du catalogue de ressources) ; il est porté
par 325 des 326 ressources, la seule exception étant celle de type `premium`.

### 3.4 ⚠️ Incohérence confirmée sur `cities[]`

Le champ `cities[]` est typé comme une liste de `CityDefinition.id`, mais **41 des 266 occurrences
contiennent la valeur `trading_culture.OttomanEmpire`**, qui n'est pas une cité : c'est le
`definitionId` de l'unique `TradingCultureDefinitionDTO`.

| Valeur | occ. | Est un `CityDefinition.id` ? |
|---|---|---|
| `City_Capital` | 168 | oui |
| **`trading_culture.OttomanEmpire`** | **41** | **non** |
| `City_Arabia` | 13 | oui |
| `City_Vikings` | 12 | oui |
| `City_China` | 11 | oui |
| `City_Mayas` | 11 | oui |
| `City_Egypt` | 10 | oui |

✅ **Tranché au domaine Commerce** (`07-commerce.md` §7) : ce n'est **pas** une contamination.
Les 41 ressources concernées sont toutes, sans exception, des ressources du Commerce (22
`hub_resource`, 15 `soft_currency` ottomanes, 4 `good`), et aucune ressource non commerciale ne
porte cette valeur. `cities[]` est donc un champ de **contexte au sens élargi** — « le contexte de
jeu où la ressource existe » — dont une culture commerciale fait partie au même titre qu'une cité.

⚠️ La réserve de typage demeure : le champ mélange deux espaces de noms (`id` et `definitionId`,
cf. C6). À modéliser comme `cities: string[]` avec la contrainte d'union explicite
« `CityDefinition.id` **ou** `TradingCultureDefinition.definitionId` », jamais comme référence vers
`City` seule.

### 3.5 Intégrité référentielle

- `resourceChanges[].definitionId` → `ResourceDefinition.id` : **11 655 / 11 655 valides** (mesuré sur
  toute la couche Dynamic). Aucune référence cassée.
- Références sortantes des traits (`building`, `wonderDefinitionId`) : toutes résolues.
- Seule référence non résolue du domaine : `DynamicLimitTraitDTO.definitionId = "LimitTradingTokens"`
  — elle **est** valide, mais pointe vers un `definitionId` et non un `id`, d'où sa non-détection par
  un index naïf. Voir `02-dynamic.md` §5.

---

## 4. `ConstantsDefinitionDTO` — n = 1

Entité singleton, `id = "profile_a"`. Sac de constantes globales, plat ou groupé par un niveau
d'objet nommé. Aucune structure récursive.

⚠️ L'`id` `profile_a` suggère qu'il pourrait exister d'autres profils (`profile_b`…) dans d'autres
livraisons de game design. **Une seule instance dans ce fichier.** Ne pas modéliser comme singleton
strict : modéliser comme collection clé-valeur de cardinalité 1 ici.

### 4.1 Constantes hors scope actuel (listées pour complétude, non détaillées)

`crm.*` (3), `friends.friendsCap`, `incident.*` (5), `playerEncounters.*` (2), `playerName.*` (3, dont
un regex), `negotiationGameTurnCost`, `treasureHunt.*` (5), `seasonPass.events[]`,
`eventMultiPurchaseAmount`, `maxBattleDurationInSeconds`, `maxCommanderDeckSize`, `trading.*` (5).

### 4.2 Constantes relevant des domaines en scope

```ts
// Coûts d'accélération — forme (base, exponent), 4 paires symétriques
constructionSkipCostBase: 8.0      constructionSkipCostExponent: 0.6
upgradeSkipCostBase:      8.0      upgradeSkipCostExponent:      0.6
expansionSkipCostBase:   12.0      expansionSkipCostExponent:    0.6
scoutingSkipCostBase:    25.0      scoutingSkipCostExponent:     0.55

// Wonders
wonders.maximumWonderLevel:               30    // int32
wonders.freeLayouts:                       2
wonders.maximumContributionRequestsPerLevel: 3
wonders.orbMultiPurchaseAmount:           10
wonders.gearsToWonderOrbExchangeRate:    200
wonders.crateResearchPointAmounts:  [3, 5, 10]  // int32[]
wonders.promotionRuntime:            "172800s"  // Duration
wonders.promotionDropChances.rare:      0.5
wonders.promotionDropChances.legendary: 0.75

// HeritageVault
heritageConversionDuration:          "600s"     // Duration
heritageConversionSkipCostPerMinute:    2.0
heritageSkipCostPerMinute:              0.5

// Bâtiments / tutoriel
tutorialCollectionBuildingId:  "Building_StoneAge_Home_Small_1"   // -> BuildingDefinition.id
tutorialCollectionMinAmount:   10
buildingGroupSorting: string[]  // 71 valeurs — ordre d'affichage des `group` de bâtiments
```

✅ La contradiction apparente entre `wonders.maximumWonderLevel = 30` et le `valueLimit = 60.0` des
formules dynamiques **est levée** : ce sont bien deux « level » différents. Vérification : les 986
définitions dynamiques rattachables à un bâtiment se répartissent sans aucun mélange —
`valueLimit = 60` ↔ bâtiments `evolving` (`LevelUpComponentDTO.maxLevel = 60`),
`valueLimit = 40` ↔ `collectable` (`maxLevel = 40`). **Aucune définition à `valueLimit = 60` n'est
rattachée à un wonder.** Détail en `02-dynamic.md` §5.2.

✅ `buildingGroupSorting[]` : recoupement fait (cf. `03-batiments.md` §10). **La couverture est
partielle dans les deux sens** — 71 entrées dont seulement 70 distinctes (`premiumHome` en double),
1 entrée que plus aucun bâtiment n'utilise (`expeditionPort`), et **107 des 176 `group` réels en sont
absents** (dont les 44 `evolving*`, les 24 `collectable*`, les 13 `heritage*`, et `cityHall`).
Ce n'est donc **pas un référentiel des groupes** mais une liste d'affichage désynchronisée : ne pas
s'en servir pour valider `group`.

⚠️ La forme `(base, exponent)` des coûts d'accélération implique une formule de calcul que les
données **ne contiennent pas**. On documente les paramètres, pas la formule.

---

## 5. `BoostDefinitionDTO` — n = 50

Un boost associe **une cible d'effet** (`boostType`) à **une courbe de valeur** (`modifier`).
Les deux sont des unions polymorphes. Aucun champ optionnel au niveau racine.

```ts
interface BoostDefinition {
  id: string;         // 50/50
  boostType: BoostType;   // 50/50 — QUOI est affecté (13 variantes)
  modifier: Modifier;     // 50/50 — DE COMBIEN, indexé (2 variantes)
}
```

### 5.1 `boostType` — 13 variantes

Chaque variante porte son propre `id` (distinct de l'`id` racine : c'est en général l'`id` racine
suffixé par le nom du DTO).

| `@type` | n | Champs propres |
|---|---|---|
| `BoostProductionTimeComponentDTO` | 15 | `buildingGroup?` (11, 6 val. : `infantryBarracks`, `cavalryBarracks`, `rangedBarracks`, `heavyInfantryBarracks`, `siegeBarracks`, `palaceOfAachen`) ; `buildingType?` (2, `"barracks"`) ; `wonderDefinitionId?` (3) |
| `TradePostReplenishBoostDTO` | 8 | `hubType` (4 val. `TradingHubType_*`) ; `modifier` (`RegenerationTraitBoostModifier_DURATION` \| `…_MAX_CAP_PERCENTAGE`) |
| `TradePostTradeAmountBoostDTO` | 8 | `resourceDefinitionId` (8 val., → `ResourceDefinition.id`) |
| `RegenerationTraitBoostDTO` | 7 | `resourceDefinitionId` (`research_points` \| `treasure_hunt_attempt`) ; `modifier?` (4/7, `RegenerationTraitBoostModifier_DURATION`) |
| `BazaarOfferBoostDTO` | 2 | *(aucun hors `id`)* |
| `AcceptTradeOfferBoostDTO` | 2 | *(aucun hors `id`)* |
| `WonderContributionBoostDTO` | 2 | *(aucun hors `id`)* |
| `TradeSlotCooldownBoostDTO` | 1 | *(aucun hors `id`)* |
| `TradePostVesselBoostDTO` | 1 | *(aucun hors `id`)* |
| `TradePostTravelTimeBoostDTO` | 1 | *(aucun hors `id`)* |
| `TradePostWorkerBoostDTO` | 1 | *(aucun hors `id`)* |
| `TradePostTradeCostBoostDTO` | 1 | `resourceDefinitionId` (`asper`) |
| `BoostAmplifierComponentDTO` | 1 | `luaModifierDefinitionId` → `DynamicLuaLongDefinition.id` — ⚠️ **aucune cible déclarée** ; c'est l'amplificateur Keeper, voir `05-wonders-reliques-heritage.md` §2.5 |

⚠️ Piège de nommage confirmé (cf. `03-batiments.md` §11) : `BoostProductionTimeComponentDTO.buildingGroup`
prend la valeur `"palaceOfAachen"`, qui n'est **pas** un `BuildingDefinitionDTO.group` — zéro bâtiment
le porte, et il est absent de `buildingGroupSorting`. C'est la seule des 6 valeurs du champ dans ce
cas. Le boost porteur fournit l'information utile en parallèle, dans `wonderDefinitionId`
(`Wonder_Capital_PalaceOfAachen`). Typer `buildingGroup` en `string` **sans contrainte de clé
étrangère**.

⚠️ Deux champs `modifier` sans lien entre eux : `BoostDefinition.modifier` (la courbe, §5.2) et
`boostType.modifier` (un enum `RegenerationTraitBoostModifier_*` sur 2 variantes). Ne pas les
confondre dans le modèle.

⚠️ 7 des 13 variantes n'ont **aucun champ** en dehors de leur `id` : leur `@type` est la totalité de
l'information. Le modèle doit conserver le discriminant comme donnée, pas comme détail d'encodage.

### 5.2 `modifier` — 2 variantes, structure identique à la couche Dynamic

```ts
type Modifier = BuildingLevelModifier | WonderTagModifier;

interface BuildingLevelModifier {              // @type = BuildingLevelDynamicChangeDTO — 46/50
  values?: { when: string;                     // 46 porteurs / 467 occ. — int64-string, "0".."~60"
             then: { modifier: number } }[];   // @type = BoostDefinitionModifierDTO ; float 0.014..52.0
  dynamicFormulaChangeCase?: {                 // 12/50 — @type = DynamicFormulaFloatCaseDefinitionDTO
    formula: string;                           // 6 formules distinctes, ex. "(#level / 200) + 0.14"
    variableName: "level";
    valueLimit: 60.0;
  };
}

interface WonderTagModifier {                  // @type = WonderTagDynamicChangeDTO — 4/50
  tag: "Nature" | "Naval" | "Palace";
  values: { when: string;                      // "0".."7"
            then: { modifier: number } }[];    // float 0.05..1.0
}
```

✅ Sur `BuildingLevelModifier`, `values` et `dynamicFormulaChangeCase` **coexistent** (12 boosts ont
les deux). L'articulation est désormais établie (cf. `02-dynamic.md` §5.1) : **la table fait autorité
sur sa plage, la formule prend le relais au-delà du dernier `when`**. Sur ces 12 boosts, la
comparaison formule/table donne 83 concordances et 23 divergences — même profil qu'ailleurs.

⚠️ `values[]` se lit **par palier** (plus grande clé ≤ niveau), pas par correspondance exacte de clé :
les tables de boost ne contiennent pas une entrée par niveau. Cf. `02-dynamic.md` §4.1.

⚠️ Ces deux DTO (`BuildingLevelDynamicChangeDTO`, `WonderTagDynamicChangeDTO`) sont **exactement les
mêmes types** que ceux de la couche Dynamic, mais employés *en ligne* dans le boost au lieu d'être
référencés par id. Le modèle doit les factoriser une seule fois (voir `02-dynamic.md` §2).

---

## 6. Récapitulatif des points ouverts du Socle

| # | Point | Statut |
|---|---|---|
| S1 | `AgeDefinitionDTO.order` saute 16 | Constaté, inexpliqué |
| ⚠️ S2 | 18 `CityInitDefinitionDTO` orphelins, dont 2 `_TestBattle` | **Partiel** — cité résoluble par les données, âge seulement par l'id ; décalage −1 inexpliqué (`03-batiments.md` §7.3) |
| S3 | `CityCultureAreaComponent` sur 2 cités / 6 | Asymétrie inexpliquée |
| ✅ S4 | `ResourceDefinition.cities[]` contient `trading_culture.OttomanEmpire` (41 occ.) | **Résolu** — champ de contexte élargi, cohérence parfaite ; réserve de typage maintenue (`07-commerce.md` §7) |
| S5 | Sens de `CityDefinition.softCurrencyResourceDefinitions` | Copie documentée, sémantique non déterminable |
| ✅ S6 | `wonders.maximumWonderLevel = 30` vs `valueLimit = 60` | **Résolu** — deux « level » distincts ; 60 ↔ bâtiments `evolving`, jamais un wonder (`02-dynamic.md` §5.2) |
| ✅ S7 | `buildingGroupSorting[]` non recoupé avec `BuildingDefinition.group` | **Tranché** — couverture partielle des deux côtés ; pas un référentiel (`03-batiments.md` §10) |
| ✅ S8 | `values` + `dynamicFormulaChangeCase` coexistants sur 12 boosts | **Résolu** — table sur sa plage, formule au-delà (`02-dynamic.md` §5.1) ; lecture par palier |
| S9 | `ConstantsDefinition.id = "profile_a"` | Possible multi-profil, 1 seule instance ici |
