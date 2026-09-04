# Domaine : Commerce (Trading Culture)

Types couverts : `TradingHubDefinitionDTO` (32), `TradingCultureExpansionDefinitionDTO` (19),
`TradingCultureHubEnhancementDefinitionDTO` (16), `TradingCultureDefinitionDTO` (1),
`TradeRelationshipLevelDefinitionDTO` (3), `TradePremiumSlotDefinitionDTO` (2).
**73 entités, 90 Ko.** Dernier domaine du périmètre.
Prérequis : [`00-conventions.md`](00-conventions.md), [`01-socle.md`](01-socle.md).

---

## 1. Vue d'ensemble

Le Commerce est un **sous-système autonome**, structuré en quatre niveaux emboîtés :

```
TradingCultureDefinitionDTO          1   « trading_culture.OttomanEmpire »
  └── parts (TradingCulturePartComponentDTO)   2   partIndex 1 (11 expansions) · 2 (8)
        └── TradingCultureExpansionDefinitionDTO  19   « trading_expansion.TradingExpansion_Ottoman_0..18 »
              └── TradingHubDefinitionDTO         32   « trading_hub.TradePost_Ottoman_NN_<Bien> »
                    └── enhancements                16   « trading_hub_enhancement.HubEnhancement_* »
```

⚠️ **Une seule culture commerciale existe** (`OttomanEmpire`, `order: 1`). Le modèle est
structurellement multi-culture (`tradingCultureDefinitionId` partout, `order` sur la culture) mais
les données n'en exercent qu'une. Ne pas modéliser comme singleton.

⚠️ **Aucun type de ce domaine n'a de champ `id`** sauf `TradeRelationshipLevelDefinitionDTO` et
`TradePremiumSlotDefinitionDTO`. Les quatre autres sont identifiés par `definitionId`, dans un
espace de noms préfixé et **disjoint de l'espace `id`** (cf. C6).

---

## 2. `TradingCultureDefinitionDTO` — n = 1

```ts
interface TradingCultureDefinition {
  definitionId: string;            // "trading_culture.OttomanEmpire"
  order: number;                   // 1
  initialExpansionAmount: number;  // 1
  expansions: string[];            // 19 -> TradingCultureExpansion.definitionId ✅ 19/19
  resourceDefinitionIds: string[]; // 3 : asper, wheat, pomegranate -> Resource.id ✅
  components: TradingCulturePartComponent[];  // 2
}
interface TradingCulturePartComponent {
  id: string; partIndex: number;              // 1 | 2
  expansionDefinitionIds: string[];           // 11 (part 1) + 8 (part 2) = 19 ✅
  softCurrencyDefinitionIds: string[];        // part 1 : asper, wheat, pomegranate
                                              // part 2 : apricot, mohair
  initial?: boolean;                          // true sur part 1 uniquement
}
```

✅ Les deux parts partitionnent exactement les 19 expansions (11 + 8), et `expansions[]` à la racine
les liste toutes. Aucune redondance contradictoire.

⚠️ **`resourceDefinitionIds` (3) ≠ union des `softCurrencyDefinitionIds` (5).** La racine ne liste
que les monnaies de la part 1 ; `apricot` et `mohair`, monnaies de la part 2, en sont absentes.
Le sens de `resourceDefinitionIds` au niveau culture n'est donc pas « toutes les monnaies » — il
n'est pas déterminable depuis les données.

---

## 3. `TradingCultureExpansionDefinitionDTO` — n = 19

```ts
interface TradingCultureExpansion {
  definitionId: string;              // 19/19 — "trading_expansion.TradingExpansion_Ottoman_0..18"
  tradingCultureDefinitionId: string;// 19/19 ✅
  partIndex: number;                 // 19/19 — 1 (11) | 2 (8)
  tradingHubs: string[];             // 19/19 -> TradingHub.definitionId ✅ 32/32
  components?: [ExpeditionComponent];// 17/19
  order?: number;                    // 17/19 — int32, 1..10
  requiredExpansions?: string[];     // 17/19 -> TradingCultureExpansion.definitionId ✅ 26/26
  initial?: boolean;                 // 2/19 — true
}
interface ExpeditionComponent {
  id: string;
  duration: number;   // ⚠️ int32 de SECONDES, pas une Duration protobuf — voir §3.1
  start: { resourceChanges: ResourceChange[] };
}
```

⚠️ **Les 2 expansions sans `components`/`order`/`requiredExpansions` sont exactement celles portant
`initial: true`** — une par part (`_11` pour la part 2, une autre pour la part 1). Cohérent avec des
expansions offertes au départ, donc sans expédition ni prérequis. Régularité observée, non déclarée.

⚠️ `order` va de 1 à 10 avec des doublons entre parts (1..7 apparaissent deux fois, 8..10 une fois) :
**`order` est relatif à la part, pas global.** Aucun champ ne le dit ; c'est déductible du seul
comptage.

### 3.1 ⚠️ `duration` en `int` de secondes, contrairement à C4

`ExpeditionComponentDTO.duration` et `UnlockTradingHubComponentDTO.duration` sont des **entiers**
(7 200, 10 800, 14 400, 18 000, 21 600, 25 200), alors que les `duration` de tous les autres
domaines sont des `Duration` protobuf sérialisées en chaîne suffixée `s` (`"21600s"`).

**Les deux formes coexistent dans le même type racine** : `TradingHubDefinitionDTO` porte
`ProductionComponentDTO.duration = "21600s"` (string) **et** `UnlockTradingHubComponentDTO.duration = 18000`
(int). Piège de parsing confirmé — c'est l'illustration la plus nette de la réserve posée en C4.

---

## 4. `TradingHubDefinitionDTO` — n = 32

```ts
interface TradingHubDefinition {
  definitionId: string;                // 32/32 — "trading_hub.TradePost_Ottoman_NN_<Bien>"
  hubType: string;                     // 32/32 — 8 valeurs, §4.1
  group: string;                       // 32/32 — "village" (22) | "city" (10) — ⚠️ §4.2
  order: number;                       // 32/32 — int32, 1..18
  ageDefinitionId: string;             // 32/32 — EarlyGothicEra (18) | LateGothicEra (14)
  expansionDefinitionId: string;       // 32/32 -> TradingCultureExpansion.definitionId — ⚠️ §4.3
  enhancementSlotsDefinitionId: string;// 32/32 -> DynamicFloatValue.id ✅ — §4.4
  freeProductionSlots: number;         // 32/32 — TOUJOURS 2
  components: HubComponent[];          // 32/32 — 2 combinaisons seulement
  isPremium?: boolean;                 // 6/32 — true
}
```

Composants — deux profils, 16 hubs chacun :

| `@type` | occ. | Champs |
|---|---|---|
| `LevelUpComponentDTO` | 32 | `maxLevel` **6** (32/32), `starLevels` `[1,2,3,4,5,6]` (32/32), `duration`, `start` |
| `ProductionComponentDTO` | 32 | `type: ProductionType_WORKER`, `costs: ReservedUnitCostDTO[]`, `changesDynamicActionChangeDefinitionId`, `behaviours: WorkerBehaviourDTO[]`, `duration` (2 700s → 36 000s) |
| `TradingHubResourceComponentDTO` | 32 | `id`, `resourceDefinitionId` — ⚠️ §4.5 |
| `UnlockableProductionSlotDTO` | 64 | `order`, `resourceChanges[]` — 2 par hub |
| `UnlockTradingHubComponentDTO` | 16 | `id`, `start`, `duration?` (10/16) — §4.6 |

✅ **`LevelUpComponentDTO` porte ici `maxLevel` et `starLevels`**, contrairement aux 11 occurrences
sans plafond du domaine Bâtiments (`03-batiments.md` §1.3 / B1). `starLevels = [1,2,3,4,5,6]` est
dense — chaque niveau est une « étoile », contrairement aux `[10,20,30,40,60]` des bâtiments
évolutifs.

### 4.1 `hubType` — 8 valeurs

`POMEGRANATE` (6), `WHEAT` (6), `APRICOT` (5), `MOHAIR` (5), `SYRUP` (3), `CONFECTIONS` (3),
`MEDICALTEA` (2), `BROCADE` (2).

✅ Domaine parfaitement clos : les 8 valeurs déclarées par les hubs sont exactement les 8 valeurs
acceptées par `TradingCultureHubEnhancementDefinitionDTO.allowedHubTypes` et par
`TradePostReplenishBoostDTO.hubType` (`01-socle.md` §5.1).

### 4.2 ⚠️ `group` : `"village"` / `"city"` ne sont PAS des `Building.group`

Vérifié : ni `village` ni `city` n'appartient aux 176 valeurs de `BuildingDefinitionDTO.group`.
C'est un **champ homonyme dans un espace de valeurs distinct** — la taille du comptoir, pas une
famille de bâtiments. Ne pas y appliquer la contrainte de clé étrangère du domaine Bâtiments.

Cohérent avec les ressources `trading_upgrade_village_*` et `trading_upgrade_city_*` (§6).

### 4.3 ✅ `expansionDefinitionId` — piège de nommage confirmé

**32/32 résolvent vers `TradingCultureExpansionDefinitionDTO.definitionId`, et 0/32 vers
`ExpansionDefinitionDTO.id`** (les 832 expansions de ville du domaine Bâtiments). Le champ ne
désigne pas une case de grille mais une région commerciale. Confirmation définitive du faux positif
signalé en `_references-hors-scope.md` §5.

### 4.4 `enhancementSlotsDefinitionId`

Les 32 hubs pointent vers **une seule** `DynamicFloatValueDefinitionDTO`,
`Dv_TradingHub_EnhancementSlots_Default` :

```
niveau     1     2   3   (4)   5   6
slots   (vide)   1   2   (2)   3   4
```

⚠️ Deux pièges déjà catalogués se cumulent ici : la clé `"4"` est **absente** (règle de palier C9 →
2 slots au niveau 4) et le `then` du niveau 1 est **vide**, pas 0.0 (motif W7 /
`06-unites-stats.md` §4.3).

### 4.5 ⚠️ `TradingHubResourceComponentDTO.resourceDefinitionId` mélange deux types de ressource

Les 32 références résolvent toutes, mais vers **deux `resourceType` différents** :

- **22 hubs** → une ressource `hub_resource` (`trading_pomegranate_1..6`, `trading_wheat_1..6`,
  `trading_apricot_1..5`, `trading_mohair_1..5`) — une ressource distincte par hub ;
- **10 hubs** → une ressource `good` partagée (`syrup` ×3, `confections` ×3, `medical_tea` ×2,
  `brocade` ×2).

Les 22 `hub_resource` correspondent exactement aux 4 `hubType` les plus fréquents (POMEGRANATE,
WHEAT, APRICOT, MOHAIR) — ceux qui portent aussi les `TradePostReplenishBoostDTO`. Les 4 autres
`hubType` produisent un bien classique. **Asymétrie non déclarée.**

### 4.6 `UnlockTradingHubComponentDTO` — 16 hubs sur 32

⚠️ 16 hubs sont déblocables contre ressources (`asper` −35 000, `pomegranate` −15 000…), 16 ne le
sont pas. Parmi les 16 déblocables, **6 sont `isPremium: true` et 10 n'ont pas ce champ** ; le
champ `duration` est présent sur exactement ces 10 et absent sur les 6 premium. Corrélation
parfaite, non déclarée : les hubs premium se débloquent sans délai.

---

## 5. `TradingCultureHubEnhancementDefinitionDTO` — n = 16

```ts
interface HubEnhancement {
  definitionId: string;        // "trading_hub_enhancement.HubEnhancement_*"
  allowedHubTypes: string[];   // 16/16
  components: [ConstructionComponent, ...BuildingBoostComponent[]];  // 16 + 20
}
```

| `allowedHubTypes` | Enhancements |
|---|---|
| **les 8 types** (générique) | 4 : `Accomodations`, `Housing`, `Lighthouse`, `Marina` |
| 1 seul type (spécialisé) | 12 : `PomegranateOrchard`, `WheatFarm`, `ApricotOrchard`, `SyrupPress`, `Bakery`, `Apothecary`… |

Les 20 `BuildingBoostComponentDTO` pointent vers les boosts `Boost_HubEnhancement_*`
(`01-socle.md` §5.1) : `TradePostReplenishBoostDTO`, `TradePostTradeAmountBoostDTO`,
`TradePostTradeCostBoostDTO`, `TradePostTravelTimeBoostDTO`, `TradePostVesselBoostDTO`,
`TradePostWorkerBoostDTO`. ✅ 20/20 résolus.

⚠️ 4 enhancements portent **2** `BuildingBoostComponentDTO`, les 12 autres un seul — ce sont
exactement les 4 génériques. Régularité observée.

---

## 6. Types terminaux

```ts
// TradeRelationshipLevelDefinitionDTO — n = 3, contenu exhaustif
{ id: "TradeRelationship_Level_1", level: 1, minTrades: 10,  discountPercent: 5  }
{ id: "TradeRelationship_Level_2", level: 2, minTrades: 40,  discountPercent: 10 }
{ id: "TradeRelationship_Level_3", level: 3, minTrades: 100, discountPercent: 15 }

// TradePremiumSlotDefinitionDTO — n = 2, contenu exhaustif
{ id: "TradePremiumSlot_1", order: 1, resourceChanges: [{ definitionId: "premium", amount: "-190" }] }
{ id: "TradePremiumSlot_2", order: 2, resourceChanges: [{ definitionId: "premium", amount: "-490" }] }
```

⚠️ `discountPercent` est un **entier de pourcentage** (5, 10, 15), alors que tous les modificateurs
des autres domaines sont des fractions (`0.05`). Troisième convention d'échelle rencontrée après
celles du §5 de `06-unites-stats.md`. ⚠️ `minTrades` : le compteur d'échanges qu'il référence
n'existe nulle part dans les données.

Ces deux types ne sont référencés par **aucune** autre entité : ils sont consommés par le client
via leur seule existence.

---

## 7. ✅ S4 résolu — `ResourceDefinition.cities[]` et `trading_culture.OttomanEmpire`

Rappel (`01-socle.md` §3.4) : 41 des 266 occurrences de `cities[]` contiennent
`trading_culture.OttomanEmpire`, qui n'est pas un `CityDefinition.id`.

**Les 41 ressources concernées sont toutes, sans exception, des ressources du Commerce :**

| `resourceType` | n | Contenu |
|---|---|---|
| `hub_resource` | 22 | `trading_pomegranate_1..6`, `trading_wheat_1..6`, `trading_apricot_1..5`, `trading_mohair_1..5` |
| `soft_currency` | 15 | `asper`, `wheat`, `pomegranate`, `apricot`, `mohair` + les 10 `trading_upgrade_{village,city}_{silver,gold,platinum,diamond,advanced}` |
| `good` | 4 | `syrup`, `confections`, `medical_tea`, `brocade` |

➡️ **Ce n'est pas une contamination : c'est un champ de contexte au sens élargi.** `cities[]`
désigne « le contexte de jeu où la ressource existe », et une culture commerciale est un tel
contexte au même titre qu'une cité. La cohérence est parfaite — aucune ressource non commerciale ne
porte cette valeur, et aucune ressource commerciale ne porte une vraie cité.

⚠️ **La réserve de modélisation demeure** : le champ mélange deux espaces de noms
(`CityDefinition.id` et `TradingCultureDefinition.definitionId`, cf. C6). À typer
`cities: string[]` avec une contrainte d'union explicite, jamais comme référence vers `City` seule.

⚠️ Sous-anomalie : `TradingCulture.resourceDefinitionIds` n'en liste que **3** (`asper`, `wheat`,
`pomegranate`) sur les 41. Il n'y a donc **aucun chemin dans les données** pour retrouver les
41 ressources d'une culture autrement qu'en filtrant sur `cities[]`. Pour une seconde culture
commerciale, ce filtre serait la seule voie.

---

## 8. ✅ T3 résolu — les 44 technologies sans `cities`

Rappel (`04-technologies.md` §1.4) : 22 technologies `EarlyGothicEra` + 22 `LateGothicEra` n'ont pas
de champ `cities`, formant une troisième branche là où les autres âges n'en ont que deux.

**C'est bien la branche Commerce / maritime — confirmé par trois mesures :**

1. **Leurs récompenses de limite de bâtiment ciblent exclusivement des groupes maritimes :**
   `normalShipyard` (13), `normalWarehouse` (12), `smallSailorHome` (12), `lighthouse` (5),
   `pier` (5). Aucun autre groupe.
2. **Leurs récompenses de ressource sont les monnaies d'amélioration de comptoir :**
   `trading_upgrade_village_{gold,silver,diamond,platinum,advanced}` et
   `trading_upgrade_city_{…}` (44 occurrences), plus `asper` (2). Ces ressources ne sont octroyées
   par aucune autre technologie.
3. **La branche est refermée sur elle-même :** 59 des 72 prérequis pointent vers une technologie de
   la branche.

⚠️ **Mais l'hypothèse « branche Commerce = les 44 sans `cities` » est trop simple :**

- Seules **12 des 44** portent une récompense explicitement commerciale
  (`UnlockTradingCultureHubEnhancementRewardDTO`). Les 32 autres relèvent du **port** (chantier
  naval, entrepôt, phare, appontement), pas de la culture commerciale.
- **3 technologies AVEC `cities: ["City_Capital"]` portent pourtant des récompenses commerciales** —
  et ce sont les plus structurantes : `Technology_EarlyGothicEra_FlyingButtresses`
  (`UnlockTradingCultureRewardDTO` — c'est elle qui **ouvre la culture ottomane**),
  `Technology_LateGothicEra_FlamboyantGothic` (`UnlockTradingCulturePartRewardDTO` — la part 2),
  et `Technology_ClassicGreece_GOOD|DYN|ClassicGreece_Good1` (slots d'échange).

⚠️ **Contradiction interne confirmée** : les 44 technologies n'ont pas de `cities`, mais
**57 de leurs récompenses portent `cities: ["City_Capital"]`** — la totalité de celles qui ont ce
champ. La branche opère donc sur la capitale ; l'absence de `cities` au niveau de la technologie
est une **véritable incohérence de données**, pas un marqueur de branche.

➡️ **T3 tranché : branche maritime/commerce confirmée fonctionnellement, mais `cities` absent est
une incohérence et non un discriminant.** Un modèle ne peut pas utiliser l'absence de `cities` pour
identifier la branche.

---

## 9. ✅ U13 résolu — les 64 unités référencées par les hubs

Rappel (`06-unites-stats.md` §8) : `TradingHubDefinitionDTO` référence 64 fois une unité.

**Une seule unité est concernée : `Unit_EarlyGothicEra_Friendly_TradeVessel`** (`unitType: friendly`,
l'une des 2 unités sans `width`/`height` et à statistique unique `SquadSize` — §3 du doc Unités).
Les 64 références sont 32 hubs × 2 emplacements :

```ts
// ProductionComponentDTO.costs[]
{ "@type": "ReservedUnitCostDTO", unitDefinitionId, amount: "4" }
// ProductionComponentDTO.finish.costs[]
{ "@type": "UnitCostDTO", unitDefinitionId, amount: "4", useReserve: true }
```

⚠️ **Deux DTO différents pour la même donnée**, dans deux emplacements du même composant.
`ReservedUnitCostDTO` et `UnitCostDTO` portent les mêmes `unitDefinitionId` et `amount` ; seul
`useReserve: true` distingue le second. Redondance ou double comptabilisation (réservation puis
consommation) : **indéterminable**.

⚠️ `UnitCostDTO` apparaît ici avec un champ `useReserve` **jamais observé ailleurs** — il porte
`unitType`/`amount` dans la couche Dynamic (`02-dynamic.md` §3.4). Même DTO, deux profils.

➡️ Le domaine Commerce ne consomme donc les unités que par ce seul vaisseau marchand. **Aucune
dépendance au système de combat.**

---

## 10. Intégrité référentielle

| Référence | Résolution |
|---|---|
| `TradingHub.expansionDefinitionId` → `TradingCultureExpansion.definitionId` | 32/32 |
| `TradingHub.enhancementSlotsDefinitionId` → `DynamicFloatValue.id` | 32/32 |
| `TradingHubResourceComponent.resourceDefinitionId` → `Resource.id` | 32/32 |
| `TradingCultureExpansion.tradingHubs[]` → `TradingHub.definitionId` | 32/32 |
| `TradingCultureExpansion.requiredExpansions[]` → `TradingCultureExpansion.definitionId` | 26/26 |
| `TradingCultureExpansion.tradingCultureDefinitionId` → `TradingCulture.definitionId` | 19/19 |
| `TradingCulture.expansions[]` → `TradingCultureExpansion.definitionId` | 19/19 |
| `TradingCulturePart.expansionDefinitionIds[]` → idem | 19/19 |
| `TradingCulture.resourceDefinitionIds[]` → `Resource.id` | 3/3 |
| `HubEnhancement.…boostDefinitionId` → `Boost.id` | 20/20 |
| `…costs[].unitDefinitionId` → `Unit.id` | 64/64 |

**Aucune référence cassée.** Le domaine ne pointe vers **aucune entité hors scope** : c'est, avec
les Unités, le domaine le mieux refermé du périmètre.

Références entrantes : `BuildingDefinitionDTO.components[].tradingCultureDefinitionId` (4,
`TradingCultureSwitchComponentDTO`), `ResourceDefinition.cities[]` (41, §7),
`TechnologyDefinitionDTO` (18 récompenses commerciales, §8),
`ResourceDefinition.traits[]:DynamicLimitTraitDTO` (1).

---

## 11. Récapitulatif des points ouverts

| # | Point | Ampleur | Statut |
|---|---|---|---|
| ✅ S4 | `ResourceDefinition.cities[]` contient `trading_culture.OttomanEmpire` | 41 | **Résolu** : champ de contexte au sens élargi, cohérence parfaite. Réserve de typage maintenue (union de 2 espaces de noms) — §7 |
| ✅ T3 | 44 technologies sans `cities` | 44 | **Résolu** : branche maritime/commerce confirmée par les récompenses, mais l'absence de `cities` est une **incohérence**, pas un discriminant ; 3 technologies *avec* `cities` portent les récompenses commerciales structurantes — §8 |
| ✅ U13 | 64 unités référencées par les hubs | 64 | **Résolu** : une seule unité (`TradeVessel`), 32 hubs × 2 emplacements. Aucune dépendance au combat — §9 |
| ✅ — | `expansionDefinitionId` ≠ `ExpansionDefinitionDTO` | 32 | **Confirmé** : 32/32 vers `TradingCultureExpansion`, 0/32 vers les expansions de ville — §4.3 |
| C1 | `duration` en `int` de secondes ici, en `Duration` string ailleurs — **les deux dans le même type racine** | 33 | Piège de parsing — §3.1 |
| C2 | `ReservedUnitCostDTO` et `UnitCostDTO` portent la même donnée dans deux emplacements | 64 | Redondance ou réservation/consommation, indéterminable — §9 |
| C3 | `TradingHub.group` (`village`/`city`) n'est pas un `Building.group` | 32 | Homonyme dans un espace distinct — §4.2 |
| C4 | `TradingCulture.resourceDefinitionIds` (3) ≠ union des `softCurrencyDefinitionIds` (5) ≠ 41 ressources de la culture | 3 | Aucun chemin de données pour lister les ressources d'une culture — §2, §7 |
| C5 | `discountPercent` en entier de pourcentage, contre des fractions partout ailleurs | 3 | Troisième convention d'échelle — §6 |
| C6 | `minTrades` référence un compteur absent des données | 3 | §6 |
| C7 | `TradingHubResourceComponent` : 22 hubs → `hub_resource` dédiée, 10 → `good` partagé | 32 | Asymétrie non déclarée — §4.5 |
| C8 | `order` des expansions est relatif à la part, jamais déclaré comme tel | 17 | §3 |
| C9 | Modèle multi-culture, une seule culture instanciée | 1 | Ne pas modéliser en singleton — §1 |
