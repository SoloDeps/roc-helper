# Contrats de données — roc-helper (version production)

> **Objet** : documenter la **forme** des données (types, structures, interfaces) consommées
> par les 4 fonctionnalités Calculator, Technologies, Campaign et Wonders, afin de connaître
> le contrat que devra respecter la future donnée extraite du game design.
>
> **Ce document ne documente jamais le *contenu*** de `data/` comme référence de vérité.
> Les valeurs actuelles (coûts, niveaux, quantités) sont amenées à être remplacées ;
> seules les **signatures** comptent.
>
> **Périmètre** : version en production. Le Layout Builder est absent de ce dépôt.
> Aucun code n'a été modifié pour produire ce rapport.
>
> Date d'analyse : 2026-08-29
>
> ⚠️ **Mise à jour du 2026-08-31 — le Heritage Vault n'est plus absent.** Le domaine a été
> extrait (`scripts/extract/heritage.ts` → `data/heritage/generated/heritage.generated.ts`)
> et sa couche de résolution existe (`resolvers/heritage.ts`, état joueur dans
> `lib/db/heritage-schema.ts`). Il ne relève PAS des contrats décrits ci-dessous, et c'est
> délibéré : ce document décrit la forme de la donnée **saisie à la main** que les
> 4 fonctionnalités consomment, or **le Heritage Vault n'a aucune donnée à la main** — le
> game design en est la seule source, et il n'est branché sur aucune UI à ce jour. Sa forme
> est décrite par [`game-schema/heritage-vault-data-reference.md`](game-schema/heritage-vault-data-reference.md)
> et par `data/heritage/generated/types.ts`.

---

## 0. Cartographie du dépôt

### 0.1 Où se trouve la couche « resolvers » aujourd'hui

La cible du projet prévoit `source/` → `scripts/` → `data/` → `resolvers/`, la couche de
résolution étant « actuellement nommée `game-data/` ».

**Dans ce dépôt, il n'existe aucun dossier `game-data/`.** La couche de résolution est
répartie dans **`lib/`**, sans sous-dossier dédié. C'est elle qui joue le rôle de futur
`resolvers/`. Elle se décompose en 5 familles :

| Rôle | Fichiers |
|---|---|
| **Loaders** (data → objets typés) | `lib/element-data-loader.ts`, `lib/ottoman-data-loader.ts`, `data/registry.ts`, `data/technos-registry.ts`, `data/campaigns/campaigns-registry.ts`, `data/wonders/index.ts` |
| **Hydratation** (data statique + état utilisateur Dexie) | `lib/db/data-hydration.ts` |
| **Calcul** (agrégation de coûts) | `lib/utils/calculations.ts`, `lib/wonders-utils.ts`, agrégateurs inline dans `app/technologies/page.tsx` et `components/campaign/campaign-info-panel.tsx` |
| **Résolution graphe** (arbres techno/campagne) | `lib/path-utils.ts`, `lib/layout-graph.ts` |
| **Résolution d'affichage** (noms, icônes, formats) | `lib/utils.ts`, `lib/catalog.ts`, `lib/constants.ts`, `components/wonders/stats-badge.ts`, `data/wonders/wonder-config.ts` |

> ⚠️ Point structurant pour l'étape suivante : `lib/` contient à la fois de la **logique de
> résolution** (candidate à `resolvers/`) et des **données brutes** (`lib/constants.ts`
> contient 570 lignes de tables de jeu : goods par ère, goods par civilisation, limites de
> bâtiments des cités alliées, groupes de workshops). Voir §6.1.

### 0.2 Fichiers de types partagés

| Fichier | Contenu |
|---|---|
| `types/shared.ts` | `EraCode`, `Good`, `Costs`, `BuildingLevel`, `BuildingData`, `Reward`/`RewardImgSource`, `TechnoData`, `OttomanAreaData`, `TradePostData`, `EraGoods`/`EraGoodsMap` |
| `types/campaign-types.ts` | `CampaignReward`, `CampaignPart`, `CampaignRegion`, `CampaignRegionEntity`, `HydratedCampaignRegion` |
| `data/wonders/types.ts` | tout le domaine Wonders (`Wonder`, `WonderMeta`, `WonderBonus`, `WonderSynergy`, `WonderLevel`, `UserPreset`, tables de coûts) |
| `lib/db/schema.ts` | entités Dexie de `roc_wiki_db` (état utilisateur) |
| `lib/db/wonders-schema.ts` / `lib/db/presets-schema.ts` | entités Dexie de `roc_wonders_db` et `roc_presets_db` |

### 0.3 Types morts (déclarés, jamais consommés)

Repérés dans `types/shared.ts` — utile à savoir pour ne pas les alimenter inutilement
depuis le game design :

- `EraDetail` (`internalName` / `code` / `goods`) : déclaré, aucun importeur.
- `PreAlliedCity` : déclaré, référencé uniquement par `TechnoData.allied?` (le champ est
  bien utilisé, mais le type n'est jamais importé ailleurs).
- `Costs.culture_range` et `Costs.culture_bonus` : champs déclarés, jamais lus par un
  quelconque calcul ni composant.

---

## 1. Calculator

Pages : `app/calculator/page.tsx`
Composants racine : `components/items/item-list.tsx`, `components/total-goods/total-goods-display.tsx`

Le Calculator est **agrégateur** : il ne possède pas de domaine propre, il consomme les
4 domaines de données (Buildings, Technos, Ottoman, Campaign) et en calcule un total.

### 1.1 Fichiers `data/` et forme exposée

#### a) Bâtiments — `data/capital/**`, `data/allieds/**`

~70 fichiers, un par bâtiment. Chacun exporte une constante typée `BuildingData` :

```ts
// types/shared.ts
interface BuildingData {
  id: string;            // slug interne, ex. "capital-homes-small-home" (non utilisé comme clé)
  name: string;          // libellé UI
  category: string;      // "capital" | "harbor" | "egypt" | "china" | … (doit matcher CATALOG)
  subcategory: string;   // "homes" | "farms" | … (doit matcher CATALOG)
  imageName: string;     // base du nom d'image wiki ; suffixe "_Lv" => image par niveau
  levels: BuildingLevel[];
}

interface BuildingLevel {
  level: number;
  era: EraCode;          // "SA" | "BA" | … | "LG"
  max_qty?: number;
  upgrade?: Costs;
  construction?: Costs;
}

interface Costs {
  coins?; food?; gems?; research_points?;
  goods?: Good[];                        // { amount: number; resource: string }
  aspers?; deben?; wu_zhu?; rice?; cocoa?; pennies?; dirham?;   // monnaies alliées
  culture_range?; culture_bonus?;        // déclarés, non consommés
}
```

**Contraintes de forme à respecter** (elles sont implicites dans le code, pas validées) :

1. `levels` est une liste plate — pas de map par ère. Le filtrage se fait par
   `l.era === era && l.level === level`. Le **couple (level, era) doit être unique**
   (`data-hydration.ts:196`).
2. `Costs` est un objet **plat de nombres**, plus une clé spéciale `goods`. Tous les
   agrégateurs itèrent avec `Object.entries(costs)` et somment `typeof value === "number"`.
   **Toute nouvelle clé numérique est donc automatiquement traitée comme une ressource
   principale** ; toute clé non numérique et non `goods` est silencieusement ignorée.
3. `Good.resource` est une **chaîne libre** avec deux conventions superposées :
   - `"primary_xx" | "secondary_xx" | "tertiary_xx"` où `xx` est le code d'ère en
     minuscules → good d'ère, résolu dynamiquement selon le workshop choisi par le joueur.
     Regex de reconnaissance : `/^(primary|secondary|tertiary)_([a-z]{2})$/i`.
   - un nom de good concret (`"wheat"`, `"confection"`, `"papyrus"`…) → groupé par
     civilisation via `goodsByCivilization` dans `lib/constants.ts`.
4. `max_qty` est optionnel ; le fallback partout dans le code est **40**.

#### b) Niveaux dynamiques — `data/generateDynamicLevels.ts` + `data/config.ts`

Les niveaux ≥ 40 (au-delà de LG) ne sont pas saisis : ils sont **générés** par 3 patterns.
Ce sont des générateurs de `BuildingLevel[]`, spreadés à la fin du tableau `levels` de chaque
bâtiment (`...smallHomeDynamic`).

```ts
generateStandardLevels(config: StandardLevelConfig, startLevel = 40, maxLevel?)  // 3 niveaux/ère
generateLuxuryLevels(config: LuxuryLevelConfig, startEraIndex = 14, maxEraIndex?) // 1 niveau/ère, level = eraIndex*3
generateCultureLevels(config: CultureLevelConfig, startEraIndex = 14, maxEraIndex?) // 1 niveau/ère, level = eraIndex
```

Les configs prennent des **fonctions de coût** (`coins: (level) => number`), pas des valeurs.
Elles dépendent de `data/config.ts` :

| Export | Forme | Rôle |
|---|---|---|
| `MAX_QTY_BY_ERA` | `Record<PostLGEra, MaxQtyPerBuilding>` | max_qty par bâtiment pour les ères ≥ LG |
| `MaxQtyPerBuilding` | interface à clés fixes (`small_home`, `rural_farm`, `little_culture_site`, …) | **liste fermée** : ajouter un bâtiment dynamique impose de l'ajouter ici |
| `ERA_GOODS` | `EraGoodsMap = Partial<Record<EraCode, [string,string,string]>>` | les 3 goods de chaque ère |
| `ERA_ORDER` | `EraCode[]` | ordre chronologique, source de `getPrevEra`/`getNextEra`/`getEraForLevel` |
| `getEraForLevel(level)` | `number → EraCode` | **règle codée en dur** : `LG` + `floor((level-40)/3)` ; lève si `level < 40` |

> Contrat : le game design devra soit fournir les niveaux ≥ 40 explicitement (et ces
> générateurs deviennent inutiles), soit continuer à alimenter `StandardLevelConfig` /
> `LuxuryLevelConfig` / `CultureLevelConfig`. Les deux voies produisent le même
> `BuildingLevel[]`, donc l'interface aval est stable dans les deux cas.

#### c) Registre — `data/registry.ts`

```ts
export const ELEMENT_DATA_REGISTRY: Record<string, BuildingData>
```

**Clé = `${category}_${buildingId}`** (ex. `capital_small_home`, `egypt_gold_mine`).
C'est le **point d'entrée unique** du domaine Buildings — le seul endroit à brancher pour
remplacer la source. Il est aujourd'hui écrit à la main (≈ 250 lignes d'imports + mapping).

#### d) Ottoman — `data/allieds/ottoman/`

```ts
// areas.ts
export const areas_table: OttomanAreaData;   // { [areaIndex: number]: Good[] }

// trade_posts.ts
export const trade_post_table: TradePostData[];
interface TradePostData {
  area: number;
  name: string;
  resource: string;                 // "wheat", "pomegranate", …
  levels: TradePostLevels;          // { 1..5 obligatoires, 6 optionnel } → Good[]
}
```

`trade_posts.ts` utilise déjà des **fonctions template** (`villageLevelupEG(unlockCost)`)
pour factoriser les paliers — même logique que `generateDynamicLevels`.
`ship.ts` expose un `BuildingData` classique (entré dans `ELEMENT_DATA_REGISTRY`).

#### e) Presets Calculator — `data/presets/`

14 fichiers (un par ère) + `index.ts`. Ce sont des **listes de choses à ajouter en masse**,
pas des données de jeu.

```ts
interface PresetSection { id: string; label: string; category: string; entries: PresetEntry[] }
type PresetEntry = BuildingEntry | OttomanAreaEntry | OttomanTradePostEntry

interface BuildingEntry {
  kind?: "building"; buildingId: string;
  type: "construction" | "upgrade"; era: EraAbbr; level: number; qty: number;
}
```

`index.ts` expose aussi `ERA_TO_ALLIED: Partial<Record<EraAbbr, string[]>>`
(ère → cités alliées disponibles) et `getSectionsForEraAndCategory(era, category)`,
qui repose sur une **convention de nommage d'id** : `s.id.endsWith(`_${era}`)`.

### 1.2 Fonctions de résolution/calcul et ce qu'elles calculent

#### `lib/element-data-loader.ts`

| Fonction | Signature | Calcul |
|---|---|---|
| `getBuildingData` | `(elementId: string) => BuildingData \| null` | lookup direct dans `ELEMENT_DATA_REGISTRY` |
| `getAvailableEras` | `(data: BuildingData) => string[]` | ères distinctes de `levels`, triées selon `ERAS` (catalog) |
| `getEraName` | `(abbr: string) => string` | abbr → nom long, via `ERAS` |
| `getLevelsForEraAndType` | `(data, era, type) => {level, costs, maxQty}[]` | filtre `levels` sur `era` + présence de `construction`/`upgrade` |
| `calculateTotalCosts` | `(data, levels[], qty, type) => {resources, goods[]}` | somme des coûts × quantité |
| `getMaxQuantity` | `(data, era) => number` | max des `max_qty` définis sur l'ère, sinon 40 |
| `hasConstructionData` / `hasUpgradeData` | `(data, era) => boolean` | présence du bloc |

> Note : `calculateTotalCosts` d'`element-data-loader` retourne `goods: {type, amount}[]`
> alors que celle de `lib/utils/calculations.ts` retourne `goods: Map<string, number>`.
> Deux fonctions homonymes, deux formes de sortie (voir §6.4).

#### `lib/db/data-hydration.ts` — cœur de la couche resolvers du Calculator

Fusionne données statiques + état utilisateur Dexie. Sorties :

```ts
interface HydratedBuilding {
  id: string;                  // "capital_small_home_upgrade_LG_41"
  name: string;                // nom carte (résolu pour les workshops de position)
  accordionName: string;       // nom groupe accordéon
  isUnresolvedWorkshop: boolean;
  imageName: string; imgLvl: boolean;
  category: string; subcategory: string; elementId: string;
  type: "construction" | "upgrade";
  era: string; level: number; maxQty: number;
  costs: { resources: Record<string, number>; goods: {resource, amount}[] };
  quantity: number; hidden: boolean;
}

interface HydratedTechno extends TechnoData { era: string; hidden: boolean; cp: boolean }
interface HydratedOttomanArea { id, areaIndex, costs, hidden }
interface HydratedOttomanTradePost { id, name, area, resource, levels{unlock,lvl2..lvl6:boolean}, costs, sourceData?, hidden }
```

**Contrat d'ID critique** (`getHydratedBuilding`, ligne ~180) : l'ID Dexie est parsé par
découpage sur `_` **depuis la fin** :

```
${category}_${elementId}_${type}_${era}_${level}
   parts[0]   slice(1,-3)  [-3]   [-2]   [-1]
```

⇒ `category` ne doit **jamais** contenir de `_` ; `elementId` peut en contenir.
Toute évolution du schéma d'identifiants côté game design doit préserver cette forme.

`getHydratedBuilding` applique aussi une **normalisation `slugify()`** sur
`good.resource` — les noms de goods sont donc mis en `snake_case` minuscules avant
d'entrer dans les totaux.

#### `lib/utils/calculations.ts` — l'agrégateur du total

```ts
interface ResourceTotals {
  main:  Record<string, number>;
  goods: Map<string, number>;
  byEra: Map<string, Map<string, number>>;   // déclaré, jamais rempli par calculateTotalCosts
  byCity: Map<string, Map<string, number>>;  // idem
}

calculateTotalCosts(buildings, technos, areas, tradePosts, campaignEntities?) : ResourceTotals
groupGoodsByEra(goods, userSelections) : Map<string, Map<string, number>>
groupGoodsByCity(goods) : Map<string, Map<string, number>>
```

Règles d'exclusion, à connaître pour toute future donnée :

- Building / Area / TradePost : exclus si `hidden`.
- Techno : exclue si `hidden` **ou** `cp` (déjà complétée).
- Campaign : agrège **uniquement `region.scout.coins`**, pour les régions présentes en DB,
  non `hidden` et non `cp`. Les `regionRewards` et `parts.rewards` ne sont **jamais** comptés
  dans le total Calculator.

`accumulateCosts` accepte **deux formes de coûts** : la forme hydratée
(`{ resources: {...}, goods: [...] }`) et la forme plate historique
(`{ coins: 1, food: 2, goods: [...] }`) — les deux sont traitées dans la même passe.

`groupGoodsByCity` contient une **liste ottomane codée en dur** (`wheat`, `pomegranate`,
`confection`, `syrup`, `mohair`, `apricot`, `tea`, `brocade`) — la même liste est
redupliquée deux fois dans `data-hydration.ts` (voir §6.3).

#### `lib/utils.ts` — résolution des goods d'ère

```ts
getBuildingFromLocal(priority, era, buildings[][]) : string | undefined
getGoodNameFromPriorityEra(priority, era, userSelections) : string | null
slugify(str) : string          // fallback "default" si vide
getItemIconLocal(type) : string        // /images/goods/{slug}.webp
getWikiImageUrl(imageName, imgLvl, level, size=200) : string
formatNumber(value) : string           // K / M / B, locale fr-FR
formatDuration(seconds) : string       // s / m / h / d
```

Le mécanisme des **workshops de position** est central pour le Calculator : le joueur choisit
son workshop primaire/secondaire/tertiaire par groupe d'ères, ce choix est stocké dans
`localStorage["local:buildingSelections"]` sous la forme `string[][]`
(`[groupIndex][priorityIndex]`), et sert à résoudre `primary_workshop` → `tailor`, ainsi que
`primary_lg` → nom de good concret.

### 1.3 Interfaces UI dépendantes

| Interface | Fichier | Type de données consommé | Remonte à |
|---|---|---|---|
| `useBuildings() : HydratedBuilding[] \| undefined` | `hooks/use-database.ts` | `BuildingData` + `BuildingEntity` | `ItemList`, `TotalGoodsDisplay` |
| `useBuilding(id) : HydratedBuilding \| null` | idem | idem | `BuildingCard` |
| `useTechnos() : HydratedTechno[]` | idem | `TechnoData` + `TechnoEntity` | `ItemList`, `TotalGoodsDisplay` |
| `useOttomanAreas()` / `useOttomanTradePosts()` | idem | `OttomanAreaData` / `TradePostData` | `AreaCard`, `TradePostCard` |
| `useCampaigns() : CampaignEntity[]` | idem | entités Dexie brutes (pas de données statiques) | `ItemList`, `TotalGoodsDisplay` |
| `useBuildingSelections() : string[][]` | `hooks/use-building-selections.ts` | localStorage | tous les composants qui affichent un good d'ère |
| mutations (`useAddBuilding`, `useUpdateBuildingQuantity`, `useToggleBuildingHidden`, `useRemoveTechnosByEra`, …) | `hooks/use-database.ts` | — | `ItemList`, modales |

Props de composants :

```ts
BuildingCardProps  { buildingId?, building?: HydratedBuilding, userSelections: string[][],
                     onRemove, onUpdateQuantity, onToggleHidden }
TechnoCardProps    { era: string, technos: HydratedTechno[], userSelections, onRemoveAll, onToggleHidden }
CampaignCardProps  { era: string, regions: CampaignEntity[], staticRegions: CampaignRegion[],
                     onRemoveAll, onToggleHidden }
AreaCardProps      { area: HydratedOttomanArea, userSelections, onRemove, onToggleHidden }
TradePostCardProps { tradePost: HydratedOttomanTradePost, userSelections, onRemove,
                     onToggleHidden, onToggleLevel }
TotalGoodsDisplayProps { compareMode?: boolean }
ConfigurationPanelProps { path: NavigationPath, config: ElementConfig, onConfigChange,
                          onToggleLevel, onEraChange, onTypeChange, onAddElement?, isLoading?, nested? }
```

`ItemList` dépend en plus de la **structure de `CATALOG`** pour l'ordre d'affichage : il
précalcule `CATEGORY_ORDER`, `SUBCATEGORY_ORDER` et `ELEMENT_TO_SUBCATEGORY` à partir de
`lib/catalog.ts`. Une donnée de bâtiment dont `category`/`subcategory` ne correspond à aucune
entrée du `CATALOG` sera reléguée en fin de liste (`?? 999`) sans erreur.

`TotalGoodsDisplay` dépend de `lib/constants.ts` pour : `eras`, `goodsUrlByEra`,
`goodsByCivilization`, `MAIN_RESOURCE_ORDER`, `PRIORITY_TYPES`, `makePriorityKey`,
`isPriorityGoodKey`, `getExcludedItems`, `isAlliedCityResource`.

---

## 2. Technologies (Research Tree)

Page : `app/technologies/page.tsx`
Composants : `components/technology/*` (7 fichiers)

### 2.1 Fichiers `data/` et forme exposée

`data/technos/{1..14}_{era}.ts` — 14 fichiers, ~19 200 lignes au total.
Chacun exporte `technos_XX: TechnoData[]`.

```ts
interface TechnoData {
  id: string;             // convention STRICTE: "{abbr}_{index}", ex. "sa_0", "lg_42"
  name: string;
  column: number;         // colonne dans l'arbre (base 0)
  allied?: PreAlliedCity; // "egypt" | "china" | "maya" | "vikings" | "arabia" | "ottoman"
  costs: Costs;           // même type que les bâtiments (research_points en plus)
  required?: string[];    // IDs prérequis — définit les arêtes du DAG
  rewards?: Reward[];
}

interface Reward { title: string; desc: string; img: RewardImgSource }

type RewardImgSource =
  | { kind: "techno";  techId: string }                     // /images/technos/{eraFolder}/{techId}.webp
  | { kind: "wiki";    imageName: string; level?: number }  // getWikiImageUrl()
  | { kind: "catalog"; imgType: ImageType; invert?: boolean } // imagesUrl[imgType]
  | { kind: "local";   path: string; invert?: boolean }
  | { kind: "good";    priority: "primary" | "secondary" | "tertiary" }; // résolu selon l'ère du tech
```

**Contraintes de forme** :

1. Le format `id` est parsé par regex à **trois endroits** : `/^([a-z]{2})_(\d+)$/`
   (`data-hydration.ts`), `/^([a-z]{2})_\d+$/` (`app/technologies/page.tsx`),
   `startsWith(`${abbr}_`)` (Dexie, `hooks/use-database.ts`). Le préfixe **doit être
   exactement 2 lettres minuscules** et correspondre à `ERA_ID_TO_ABBR`.
2. `required` référence des IDs **de la même ère** (aucun code ne cherche hors de l'ère
   sélectionnée) ; un ID inconnu est silencieusement ignoré par les DFS.
3. `RewardImgSource` est une **union discriminée sur `kind`** — l'ajout d'un `kind` impose
   d'étendre le `switch` de `components/cards/reward-card.tsx`.
4. `column` sert au positionnement horizontal ; les technos partageant une colonne sont
   empilées verticalement (ordre déterminé par dagre).

### 2.2 Fonctions de résolution/calcul

#### `data/technos-registry.ts` — point d'entrée du domaine

```ts
export const TECHNOLOGY_REGISTRY: Record<string, TechnoData[]>  // clé = eraId snake_case
export function getTechnologiesByEra(eraId: string): TechnoData[]
export function getAvailableTechEras(): string[]
export function calculateTotalTechnoCosts(technos: TechnoData[]): { resources, goods[] }
```

> `calculateTotalTechnoCosts` est **exportée mais jamais importée** : chaque consommateur
> réimplémente l'agrégation (voir §6.4).

#### `lib/era-mappings.ts`

```ts
ERA_ID_TO_ABBR : Record<string, string>   // "stone_age" → "sa"
ABBR_TO_ERA_ID : Record<string, string>   // dérivé par inversion
getEraAbbr(eraId) / getEraIdFromAbbr(abbr)
```

#### `lib/path-utils.ts` — résolution de graphe (générique)

```ts
getAllAncestors(targetId, technologies: TechnoData[]) : { nodeIds: Set, edgeIds: Set }
getSubgraphBetween(fromId, toId, technologies) : { nodeIds, edgeIds, found: boolean }
getOrderedTechs(nodeIds, technologies) : TechnoData[]   // trié par column
```

Ces fonctions n'utilisent que `{ id, required?, column }` — **elles sont réutilisées telles
quelles par Campaign** via un cast `as any`.

Convention d'ID d'arête : `` `${reqId}-${nodeId}` ``.

#### `lib/layout-graph.ts` — layout ReactFlow

```ts
interface TechNode { id; name; column; required?; costs{...}; allied?; hidden? }
buildGraphData(technos: TechNode[]) : { nodes: Node[]; edges: Edge[] }
layoutGraph(nodes, edges, direction = "LR", technos?) : Node[]
layoutGraphVertical(nodes, edges, technos?) : Node[]
```

`TechNode` est une **redéclaration locale** partielle de `TechnoData` (avec `allied?: string`
au lieu du type union, et `costs` restreint à `research_points/coins/food/goods`).

#### Agrégation des coûts (inline dans la page)

`app/technologies/page.tsx` définit localement `sumCosts(techs: TechnoData[])` et
`CostGrid`, qui refont l'agrégation `Object.entries(costs)` + le tri des goods d'ère par
regex `/^(primary|secondary|tertiary)_([a-z]{2})$/i`. Même logique que `sumCosts` de
`technos-registry.ts` et que `accumulateCosts` de `calculations.ts`.

### 2.3 Interfaces UI dépendantes

| Interface | Fichier | Remonte à |
|---|---|---|
| `useSelectedEraId()` / `useSelectEra()` | `lib/stores/technology-page-store.ts` (zustand persisté `roc-technology-page`) | page, `TechnoCard`, hooks de soumission |
| `useLiveQuery(db.technos.toArray())` | page | dérive `availableEras` par regex sur les IDs |
| `useTechnos()` | `hooks/use-database.ts` | Calculator |

Props :

```ts
TechTreeDesktop  { technologies: (TechnoData & {hidden, cp})[], onOpenStats }
TechTreeMobile   { technologies: (TechnoData & {hidden, cp})[] }
TechDetailsPanelProps  { tech: TechnoData | null, onClose }
TechDetailsDrawer      { tech: TechnoData | null, ... }
TechPathPanel / TechPathDrawer { fromTech, toTech, pathTechs: TechnoData[], ... }
RewardCardProps  { reward: Reward, techId: string, userSelections: string[][] }
EraStatsButton   { technologies: TechnoData[], desktopOpen?, onDesktopOpenChange? }
```

Le champ `TechnoData.allied` est rendu comme un blason via
`getCityCrestIconLocal(allied)` → `imagesUrl[slug]` — la valeur doit donc exister comme clé
de `imagesUrl` dans `lib/catalog.ts`.

---

## 3. Campaign

Page : `app/campaign/page.tsx`
Composants : `components/campaign/*` (7 fichiers)

### 3.1 Fichiers `data/` et forme exposée

`data/campaigns/{01..14}_{era}.ts` — 14 fichiers, ~7 700 lignes.
Chacun exporte `campaign_XX: CampaignRegion[]`.

```ts
interface CampaignRegion {
  id: string;                 // "{abbr}_{n}", ex. "sa_2" — même convention que TechnoData.id
  name: string;
  column: number;
  boss?: boolean;
  required: string[];         // NON optionnel ici (contrairement à TechnoData.required?)
  scout: { coins: number; duration: number };   // duration en secondes
  regionRewards: CampaignReward[];
  parts: CampaignPart[];
}

interface CampaignPart { type: string[]; rewards: CampaignReward[] }
interface CampaignReward { resource: string; amount: number; name?: string }
```

**Contraintes de forme** :

1. `parts[].type` est un `string[]` libre. Valeurs observées dans le code de rendu :
   `"combat"`, `"combat_waves"`, `"negotiation"` (`getPartTypeLabel` dans
   `campaign-details-panel.tsx` traite `combat_waves` et `negotiation`, sinon
   `type.replace(/_/g, " ")`). **Un type inconnu ne casse rien** — il est affiché tel quel.
2. `CampaignReward.resource` porte **trois familles de conventions** :
   - ressources/goods classiques (`coins`, `food`, `research_points`, `gems`, `gears`,
     `aspers`, `deben`, `rice`, `cocoa`, `pennies`, `dirham`, `papyrus`, `gold_ore`…) ;
   - **préfixe `commander_`** → traité à part partout : rendu par `name` (libellé) et non
     par une icône+montant. C'est un **discriminant par convention de chaîne**, testé par
     `resource.startsWith("commander_")` dans 3 composants ;
   - préfixes divers non discriminés : `expansion_*`, `chest_*`, `puzzle_piece`,
     `trading_culture_*` — rendus comme des ressources normales avec
     `getItemIconLocal(resource)` (donc `/images/goods/{resource}.webp` doit exister).
3. `CampaignReward.name` n'est lu que pour les `commander_*`.
4. `scout.duration` est en **secondes** (formaté par `formatDuration`).

### 3.2 Fonctions de résolution/calcul

#### `data/campaigns/campaigns-registry.ts` — point d'entrée du domaine

```ts
const CAMPAIGN_REGISTRY: Record<string, CampaignRegion[]>   // clé = eraId snake_case (privé)
export function getCampaignsByEra(eraId: string): CampaignRegion[]
export const CAMPAIGN_ERA_IDS: string[]
```

Le fichier note lui-même en commentaire qu'il « mirrors getTechnologiesByEra() ».
Différence : le registry est **privé** ici (`const`, non exporté), alors que
`TECHNOLOGY_REGISTRY` est exporté — `data-hydration.ts` s'en sert pour itérer toutes les ères.

#### Réutilisation de la couche graphe

Campaign n'a **aucune** fonction de graphe propre : elle appelle `getAllAncestors`,
`getSubgraphBetween`, `buildGraphData`, `layoutGraph`, `layoutGraphVertical` avec des
`CampaignRegion[]` castés `as any`. Cela fonctionne parce que `CampaignRegion` et `TechnoData`
partagent structurellement `{ id, name, column, required }`.

#### Agrégation des récompenses — `components/campaign/campaign-info-panel.tsx`

Calcul entièrement **inline dans le composant** (aucune fonction dans `lib/`) :

- partition `remaining` / `completed` selon `completedIds: Set<string>` ;
- `totalCoins = Σ scout.coins` et `totalDuration = Σ scout.duration` sur `remaining` ;
- agrégation `regionRewards` + `parts[].rewards` en `Map<resource, amount>`, avec extraction
  séparée des `commander_*` dans une `Map<resource, name>` ;
- même bloc dupliqué à l'identique pour `completed` (variables `obtained*`).

Ordre d'affichage : `["research_points", "coins", "food"]` en tête, puis `expansion_*`,
puis le reste.

#### Côté Calculator

`lib/utils/calculations.ts` ne consomme que `region.scout.coins` (voir §1.2). Il refait
lui-même la résolution `id → era` par regex `/^([a-z]+)_/` + recherche dans `ERAS`.

### 3.3 Interfaces UI dépendantes

| Interface | Fichier | Remonte à |
|---|---|---|
| `useSelectedCampaignEraId()` / `useSelectCampaignEra()` | `lib/stores/campaign-page-store.ts` (zustand persisté `roc-campaign-page`) | page, `CampaignCard`, hooks de soumission |
| `useLiveQuery(db.campaigns.toArray())` | page + `campaign-tree-desktop` | dérive `availableEras` et `completedIds` |
| `useCampaigns()` | `hooks/use-database.ts` | Calculator |
| mutations `useAddCampaignRegion`, `useToggleCampaignRegionCp`, `useToggleCampaignRegionHidden`, `useRemoveCampaignRegionsByEra`, `useToggleCampaignRegionsByEra` | `hooks/use-database.ts` | arbres campagne |

Props :

```ts
CampaignTreeDesktopProps { regions: CampaignRegion[], eraId: string, externalControl?,
                           hideControls?, infoPanelOpen?, onInfoPanelOpenChange? }
CampaignTreeMobileProps  { regions: CampaignRegion[], eraId: string }
CampaignDetailsPanelProps { region: CampaignRegion | null, eraId: string, onClose }
CampaignInfoPanelProps   { regions: CampaignRegion[], completedIds: Set<string>, onClose, hideHeader? }
CampaignPathPanelProps   { fromRegion, toRegion, pathRegions: CampaignRegion[], onClose }
CampaignCardProps        { era, regions: CampaignEntity[], staticRegions: CampaignRegion[], … }
```

Le type `HydratedCampaignRegion` (déclaré dans `types/campaign-types.ts` :
`CampaignRegion & { era, hidden, cp }`) **n'est produit par aucune fonction** — contrairement
à `HydratedTechno`, Campaign n'a pas d'hydratation centralisée. Chaque composant croise
lui-même `CampaignRegion[]` et `CampaignEntity[]`.

---

## 4. Wonders

Page : `app/wonders/page.tsx`
Composants : `components/wonders/*` (7) + `components/wonders/presets/*` (5)

### 4.1 Fichiers `data/wonders/` et forme exposée

| Fichier | Exporte | Consommé ? |
|---|---|---|
| `types.ts` | tous les types du domaine | ✅ largement |
| `wonders.ts` | `data` : tableau brut non typé (28 wonders) | ✅ via `index.ts` |
| `index.ts` | `WONDERS: Record<string, Wonder>`, `WONDER_CODES: string[]` | ✅ **point d'entrée** |
| `wonder-config.ts` | images, couleurs, sélecteurs de tables, formatage | ✅ |
| `coin-food-costs.ts` | `AW/GE/SM/ARABIA_{COIN,FOOD}_COSTS` | ✅ via `wonder-config` |
| `shared-costs.ts` | `BLUEPRINT_COSTS`, `AW/GE_SM_RP_COSTS`, `getMaterialAmounts`, `*_CAPITAL_WORKERS` | ✅ via `wonder-config` |
| `goods-costs.ts` | `AW/GE/SM_CAPITAL_GOODS`, `EGYPT/CHINA/MAYA/VIKING/ARABIA_GOODS` | ✅ via `wonder-config` |
| `bonuses.ts` | 28 constantes `*_BONUSES: BonusArray` | ❌ **aucun importeur** |
| `presets.ts` | `WONDER_PRESETS`, `filterWonders` | ❌ **aucun importeur** |

#### Forme d'entrée brute — `wonders.ts`

Tableau **non typé** (`export const data = [...]`), converti par `assembleWonder()` :

```ts
{
  meta: {
    code: string;            // clé primaire partout (DB, presets, images)
    name: string;
    group: "Ancient World" | "Great Empires" | "Stories and Myths";
    slot: "Capital City" | "Egypt" | "China" | "Maya Empire" | "Viking Kingdom" | "Arabia";
    materials: [string, string];        // → material1 / material2 (MaterialType)
    rarity?: "Rare" | "Legendary";
    synergies: { raw: string; icons: [string, string|null]; bonus: string }[];
    countsAs?: { tag: string; multiplier: number }[];
  },
  bonuses: { type: string; icons: [string, string|null]; values: number[] }[]  // 30 valeurs
}
```

#### Forme de sortie — `Wonder`

```ts
interface Wonder {
  meta: WonderMeta;                     // + groupCode ("AW"|"GE"|"SM"), slotLabel, maxLevel = 30
  bonuses: WonderBonus[];               // values[level-1]
  levels: Record<number, WonderLevel>;  // ⚠️ construit mais JAMAIS lu (voir §6.5)
}

interface WonderBonus  { type: string; icons: [string, string|null]; values: number[] }
interface WonderSynergy{ tag: MaterialType; icons: [string, string|null]; bonus: string /* pré-formaté */ }
interface WonderLevel  { level; rpCost; mat1Cost; mat2Cost; coinCost; isBlueprint }
```

**Contraintes de forme** :

1. `bonuses[].values` doit contenir **30 entrées** (index 0 = niveau 1). `getResolvedBonuses`
   retourne `values[level-1] ?? 0` et refuse `level > 30`.
2. `bonuses[].type` est une **chaîne libre en snake_case** qui pilote trois dictionnaires
   dans `lib/wonders-utils.ts` : `BONUS_LABELS` (libellé), `PERCENT_TYPES` et `INTEGER_TYPES`
   (format d'affichage). Un `type` absent des trois → libellé auto-title-casé et format
   `"flat"` : **dégradation silencieuse, pas d'erreur**.
3. `icons` est un tuple `[mainIcon, overlayIcon|null]` de **clés d'icônes**, résolues par
   `resolveIconPath(key)` (`components/wonders/stats-badge.tsx`) :
   `ICON_PATH_OVERRIDES[key] ?? /images/icons/{key}.webp`, avec fallback image à l'`onError`.
4. `WonderSynergy.bonus` est une **chaîne déjà formatée** (`"+2%"`, `"+1/day"`). Elle ne doit
   **jamais** passer par `formatBonusValue()`. Elle est parsée à l'affichage par regex
   (`parseSynergyMagnitude`, `multiplySynergyBonus`) pour appliquer un multiplicateur.
5. `countsAs` surcharge le poids d'un wonder dans le comptage de tags pour l'activation des
   synergies (défaut : 1 par tag matériau distinct).
6. Les tables de coûts (`coin-food-costs`, `shared-costs`, `goods-costs`) sont indexées
   `Record<number, …>` de **0 à 30**, l'index 0 servant d'en-tête vide.
7. `goods-costs.ts` utilise les mêmes clés `primary_xx / secondary_xx / tertiary_xx` que les
   bâtiments, résolues côté UI par `resolveGoodsIcon()` dans `wonder-detail-modal.tsx`.

### 4.2 Fonctions de résolution/calcul

#### `data/wonders/index.ts`

```ts
buildLevels(groupCode) : Record<number, WonderLevel>    // à partir de tables locales au fichier
assembleWonder(raw) : Wonder
```

#### `data/wonders/wonder-config.ts` — sélecteurs de tables

```ts
getCostTables(wonder) : { coinTable, foodTable, rpTable, workerTable }
getGoodsTable(wonder) : Record<number, GoodsEntry[]>
fmtCost(n) / fmtCompact(n) / sumCostEntries(entries) / sumGoodsEntries(entries)
WONDER_IMAGE_MAP : Record<code, string>       // 28 entrées manuelles
WONDER_IMAGE_OFFSET_PX : Record<code, number> // 28 entrées manuelles
MATERIAL_COLORS : Record<MaterialType, string>
```

La sélection se fait sur `(meta.groupCode, meta.slot)` — règle : `slot === "Arabia"` prime,
puis `groupCode`, avec un cas particulier pour `SM` hors Capital City qui retombe sur les
tables `GE`.

#### `lib/wonders-utils.ts` — calculs métier

```ts
getResolvedBonuses(wonder, level) : ResolvedBonus[]
getWonderBoosts(wonder, level) : WonderBoostItem[]       // alias de forme
getTagContributions(wonder) : Map<MaterialType, number>
computeTagCounts(codes: string[]) : Record<MaterialType, number>
computeSynergies(codes: string[]) : WonderWithSynergy[]
computeSynergyResults(codes) : SynergyResult[]
getPresetCodes(preset) : string[]
getSynergyDisplayValue(wonder, _level, activatorCount, synergyIndex = 0) : string | null
BONUS_LABELS : Record<string,string> ; getBonusLabel(type) ; getBonusFormat(type) ; formatBonusValue(type, value)
```

`computeSynergies` : pour chaque wonder du set, compte les **autres** wonders dont un tag
matériau figure dans les tags écoutés par ses synergies ; poids = `max` des multiplicateurs
`countsAs` correspondants. Seul fichier du projet couvert par des tests
(`lib/wonders-utils.test.ts`, vitest).

#### `components/wonders/wonder-detail-modal.tsx` — calcul de coûts par plage

```ts
buildLevelCostData(wonder, level) : LevelCostData
computeRangeTotals(rows: LevelCostData[]) : RangeTotals
resolveGoodsIcon(iconKey, userSelections) : string
```

C'est ici — et **pas** dans `lib/` — que vit le calcul du coût total d'une plage de niveaux
de wonder (blueprints, RP3/5/10, matériaux, coins, food, goods, workers).

### 4.3 Interfaces UI dépendantes

| Interface | Fichier | Remonte à |
|---|---|---|
| `useUserWondersMap() : Record<string, {code, lvl}>` | `lib/stores/wonders-store.ts` | page wonders, tous les onglets |
| `useUserWonder(code)` / `useIsWonderOwned(code)` | idem | cartes |
| `addOrUpdateUserWonder`, `updateWonderLevel`, `removeUserWonder`, `unlockAllWonders`, `maxAllOwnedWonders` | idem | cartes, actions preset |
| `useUserPresets()` → `{ presets, activePreset, activePresetId, … }` | `lib/stores/user-presets-store.ts` | `PresetTab`, `CompareTab` |

Props :

```ts
WonderGameCardProps    { wonder: Wonder, currentLevel?: number }
WonderDetailModalProps { wonder: Wonder, currentLevel?: number, open, onClose }
WonderSlotGridProps    { label, slotType: "capital"|"allied", entries: (WonderPresetEntry|null)[],
                         ownedMap: Record<string,{code,lvl}>, activePresetId,
                         onAdd, onRemove, onLevelChange }
PresetStatsSectionProps / SynergyPanel / WonderBoostsPanel  { codes: string[], entries, … }
StatsBadge             { icons via resolveIconPath }
```

Persistance : `UserPreset` (défini dans `data/wonders/types.ts`) est **stocké tel quel**
dans Dexie (`roc_presets_db.userPresets`) — c'est donc à la fois un type de domaine et un
schéma de persistance.

---

## 5. Points d'entrée par domaine — état actuel

| Domaine | Point d'entrée | Unique ? |
|---|---|---|
| Bâtiments | `ELEMENT_DATA_REGISTRY` (`data/registry.ts`) via `getBuildingData()` | ✅ oui, mais max_qty contourné ailleurs (§6.2) |
| Technos | `TECHNOLOGY_REGISTRY` (`data/technos-registry.ts`) via `getTechnologiesByEra()` | ✅ oui |
| Campagne | `CAMPAIGN_REGISTRY` (privé) via `getCampaignsByEra()` | ✅ oui |
| Ottoman | `areas_table` + `trade_post_table` via `lib/ottoman-data-loader.ts` | ⚠️ contourné une fois (§6.6) |
| Wonders | `WONDERS` / `WONDER_CODES` (`data/wonders/index.ts`) ; coûts via `wonder-config.ts` | ✅ oui — système de coûts unique (§6.5) |
| Ères | `ERAS` (`data/config.ts`) | ✅ oui — source unique, tout le reste en dérive (§6.1) |
| Goods d'ère | ✗ deux sources (`ERA_GOODS` et `goodsUrlByEra`) (§6.1) | ❌ |
| Limites / max_qty | `data/config.ts` : `WORKSHOP_MAX_QTY`, `MAX_QTY_BY_ERA`, `DEFAULT_MAX_QTY` | ✅ oui — cascade documentée (§6.2) |

---

## 6. Constat de dispersion

> **Ceci est un constat, pas une action.** Aucun regroupement n'a été réalisé.
> Chaque point indique où se trouve la dispersion et si un regroupement *préalable* à
> l'arrivée des données extraites faciliterait l'étape suivante.

### 6.1 ✅ RÉSOLU — Les ères sont désormais définies dans un seul fichier

> **État initial du constat** : les ères étaient définies dans 4 fichiers
> (`lib/catalog.ts` → `ERAS`, `lib/constants.ts` → `eras`, `data/config.ts` → `ERA_ORDER`,
> `lib/era-mappings.ts` → `ERA_ID_TO_ABBR`), plus une 5ᵉ dérivation locale dans
> `app/technologies/page.tsx`. Les 4 sources ont été vérifiées **identiques en valeur et
> en ordre** avant consolidation (14 entrées, mêmes `id`/`name`/`image`, `ERA_GOODS`
> intégralement dérivable de l'abbr) — aucune divergence à arbitrer.

**Source canonique : `data/config.ts` → `ERAS: EraDefinition[]`.**

```ts
export interface EraDefinition {
  abbr: EraCode;   // "LG"
  id: string;      // "late_gothic_era"
  name: string;    // "Late Gothic Era"
  image: string;
}
export const ERAS: EraDefinition[] = [ /* 14 entrées, ordre chronologique */ ];
```

Choix motivé par trois points : `data/config.ts` portait déjà la **sémantique** des ères
(`ERA_ORDER`, `ERA_GOODS`, `getPrevEra`/`getNextEra`/`getEraForLevel`) ; il vit dans `data/`,
conformément à l'architecture cible où les données de jeu sont générées par `scripts/` ;
il n'a qu'une dépendance (`types/shared`), là où l'inverse était impossible —
`lib/catalog.ts` importe `data/wonders/types`, et faire de `lib/` la source aurait forcé
`data/generateDynamicLevels.ts` à dépendre de `lib/`, soit *data → resolvers* à l'envers.

Tout le reste en dérive :

| Fichier | Ce qu'il expose | Origine |
|---|---|---|
| `data/config.ts` | `ERAS`, `EraDefinition` | **source unique** |
| `data/config.ts` | `ERA_ORDER: EraCode[]` | `ERAS.map(e => e.abbr)` |
| `lib/catalog.ts` | `ERAS`, `type Era` | ré-export ; `Era = EraDefinition` |
| `lib/constants.ts` | `eras`, `type Era`, `type EraAbbr` | ré-export ; `EraAbbr = EraCode` |
| `lib/era-mappings.ts` | `ERA_ID_TO_ABBR` | `Object.fromEntries(ERAS.map(e => [e.id, e.abbr.toLowerCase()]))` |
| `lib/era-mappings.ts` | `ABBR_TO_ERA_ID` | inversion de `ERA_ID_TO_ABBR` (inchangé) |
| `lib/element-data-loader.ts` | `ERA_INDEX_BY_ABBR` (privé) | index de tri dérivé de `ERAS` — renommé pour ne plus être homonyme de `ERA_ORDER` |

La dérivation locale de `app/technologies/page.tsx` a été supprimée ; le fichier importe
`ERA_ORDER` depuis `data/config.ts`.

**Interfaces publiques inchangées** : `ERAS`, `eras`, `Era`, `EraAbbr` restent importables
depuis leurs emplacements d'origine — seule leur source interne a changé. `EraAbbr` est
désormais un alias de `EraCode` (union strictement identique). `catalog.ERAS`,
`constants.eras` et `config.ERAS` désignent maintenant **la même référence**.

**Reste à faire à l'étape suivante** : `ERA_GOODS` (`data/config.ts`) demeure un littéral
distinct. Il n'est dupliqué nulle part, mais il est intégralement dérivable de l'abbr
(`primary_{abbr}` / `secondary_{abbr}` / `tertiary_{abbr}`) — à trancher au moment où
l'extraction fournira les goods réels par ère.

### 6.2 ✅ RÉSOLU — Les quantités maximales convergent vers `data/config.ts`

> **État initial du constat** : 4 sources concurrentes (`BuildingLevel.max_qty`,
> `MAX_QTY_BY_ERA`, `WORKSHOP_MAX_QTY`, `limit*ByEra`) + le fallback littéral `40` répété
> dans `element-data-loader.ts` (×3) et `data-hydration.ts` (×1).

**`data/config.ts` est le point d'entrée unique.** La résolution est explicitement en
cascade, du plus spécifique au plus général :

| Ordre | Source | Portée | Où |
|---|---|---|---|
| 1 | `BuildingLevel.max_qty` | par bâtiment × niveau | ~70 fichiers `data/**` |
| 2 | `WORKSHOP_MAX_QTY` | workshops capital, par ère × position | `data/config.ts` (déplacé depuis `lib/constants.ts`) |
| 3 | `MAX_QTY_BY_ERA` + `MaxQtyPerBuilding` | ères ≥ LG, alimente les niveaux générés | `data/config.ts` |
| 4 | `DEFAULT_MAX_QTY = 40` | fallback, aucune valeur définie | `data/config.ts` |

Le littéral `40` a disparu du code : `element-data-loader.ts` (4 occurrences) et
`data-hydration.ts` (1) importent `DEFAULT_MAX_QTY`. Les deux consommateurs de
`WORKSHOP_MAX_QTY` (`data-hydration.ts`, `configuration-panel.tsx`) importent désormais
depuis `data/config.ts` ; `lib/constants.ts` ne l'expose plus.

**Tables `limit*ByEra` — supprimées.** `limitCapitalBuildingsByEra`,
`limitLuxuriousBuildingsByEra` et `limitAllBuildingsByEra` (leur fusion dérivée) ont été
retirées de `lib/constants.ts` : **203 lignes**, aucun consommateur. Leurs valeurs
divergeaient de la source vivante sur **7 couples (bâtiment, ère)** et n'ont volontairement
**pas** été réconciliées — elles seront remplacées par l'extraction du game design :

| Comparaison | Bâtiment / ère | `limit*ByEra` | Source vivante |
|---|---|---|---|
| vs `max_qty` (`data/capital/**`) | `common_warehouse` EG | 8 | **9** |
| | `seafarer_house` EG | 14 | **16** |
| | `common_warehouse` LG | 12 | **13** |
| | `seafarer_house` LG | 18 | **20** |
| vs `MAX_QTY_BY_ERA.LG` | `rural_farm` | 13 | **14** |
| | `domestic_farm` | 11 | **12** |
| | `moderate_culture_site` | 6 | **7** |

**Reste à faire à l'étape suivante** : `limitAlliedBuildingsByEra` (cités alliées,
`{ [buildingId]: { [era]: number } }`) subsiste dans `lib/constants.ts`, toujours sans
consommateur — hors périmètre de cette passe. L'override de `max_qty` reste par ailleurs
recalculé à la main dans `configuration-panel.tsx` (lié au mécanisme des workshops de
position, voir §6.6).

### 6.3 🟠 La liste des goods ottomans est dupliquée 3 fois

Le tableau littéral `["wheat","pomegranate","confection","syrup","mohair","apricot","tea","brocade"]`
apparaît à l'identique dans :

- `lib/utils/calculations.ts` → `groupGoodsByCity()`
- `lib/db/data-hydration.ts` → `getHydratedOttomanArea()`
- `lib/db/data-hydration.ts` → `calculateTradePostCosts()`

Une 4ᵉ liste équivalente, plus large, existe dans `goodsByCivilization["OTTOMAN EMPIRE"]`
(`lib/constants.ts`), qui inclut en plus `aspers`.

**Regroupement préalable utile ? Modérément.** C'est un cas simple, mais il illustre que
l'appartenance « good → civilisation » est décidée par des listes en dur plutôt que par une
propriété de la donnée. Si le game design porte cette information (chaque good connaît sa
cité), les 4 listes disparaissent naturellement — autant ne pas les figer davantage.

### 6.4 🟠 L'agrégation de coûts est réimplémentée 5 fois

Le même algorithme (« itérer `Object.entries(costs)`, sommer les nombres, traiter `goods`
à part ») existe en 5 exemplaires, avec des **formes de sortie différentes** :

| Implémentation | Sortie goods |
|---|---|
| `lib/element-data-loader.ts` → `calculateTotalCosts` | `{ type, amount }[]` |
| `data/technos-registry.ts` → `calculateTotalTechnoCosts` (**jamais importée**) | `{ resource, amount }[]` |
| `lib/utils/calculations.ts` → `accumulateCosts` | `Map<string, number>` |
| `app/technologies/page.tsx` → `sumCosts` (local) | `Map<string, number>` |
| `components/cards/techno-card.tsx` → agrégation inline | inline |

S'y ajoute le tri des goods d'ère par regex `/^(primary|secondary|tertiary)_([a-z]{2})$/i`,
présent dans `calculations.ts`, `technologies/page.tsx`, `tech-details-panel.tsx`,
`wonder-detail-modal.tsx` et `lib/constants.ts` (`isPriorityGoodKey`).

**Regroupement préalable utile ? Oui, modéré.** Le contrat `Costs` est déjà unique — c'est
sa *consommation* qui est dispersée. Le risque à l'étape suivante n'est pas de mal brancher
l'extraction, mais de faire diverger l'interprétation d'une nouvelle clé de coût (ajoutée par
le game design) selon les écrans. Centraliser en une fonction `sumCosts(costs[]) → { main, goods }`
avant l'extraction rendrait le comportement uniforme par construction.

### 6.5 ✅ RÉSOLU — Wonders : un seul système de coûts, via `wonder-config.ts`

> **État initial du constat** : deux systèmes de coûts coexistaient. `data/wonders/index.ts`
> construisait `Wonder.levels: Record<number, WonderLevel>` à partir de tables **locales au
> fichier** (`RP_COSTS_AW`, `RP_COSTS_GE_SM`, `MAT_COSTS`, `COIN_COSTS_AW`,
> `BLUEPRINT_LEVELS`), qu'**aucun composant ne lisait**.

**Système retenu : `data/wonders/wonder-config.ts`**, seul consommé par l'UI via
`getCostTables()` / `getGoodsTable()`, qui pointent vers `coin-food-costs.ts`,
`shared-costs.ts` et `goods-costs.ts` — des tables plus riches (gears, RP3/5/10, workers,
goods par slot).

Supprimés de `data/wonders/index.ts` (**154 → 79 lignes**) : `buildLevels()` et les cinq
tables de coûts locales. Le champ `levels` a été retiré de l'interface `Wonder`
(`data/wonders/types.ts`) — obligatoire pour compiler, le champ étant requis.

`Wonder` expose désormais exactement ce que l'UI consomme :

```ts
export interface Wonder {
  meta: WonderMeta;
  bonuses: WonderBonus[];
}
```

**Suppression vérifiée sans effet fonctionnel.** Le seul lecteur de `.levels` était
`app/wonders/page.tsx` (filtre `hideMaxed`) :
`const maxLvl = (w as any).levels?.length ?? (w as any).meta?.maxLevel;` — `.length` sur un
`Record` vaut `undefined`. Contrôlé à l'exécution sur **les 28 wonders** : aucun n'avait
`levels?.length` défini, l'expression retombait donc déjà systématiquement sur
`meta.maxLevel`. La ligne a été ramenée à `const maxLvl = w.meta.maxLevel;`, ce qui supprime
au passage deux casts `as any`.

**Hors périmètre, inchangé** : l'interface `WonderLevel` reste déclarée dans
`data/wonders/types.ts` (plus aucun producteur), et les fichiers `bonuses.ts` (495 lignes,
28 constantes `*_BONUSES`) et `presets.ts` (`WONDER_PRESETS`, `filterWonders`) restent
**sans importeur** — la page wonders réimplémente toujours le filtrage inline. À statuer à
l'étape suivante, en même temps que le branchement de l'extraction sur le domaine Wonders.

### 6.6 🟠 Résolution des workshops de position : 4 implémentations

Le mécanisme « `primary_workshop` + ère → nom du workshop réel choisi par le joueur »
est réécrit intégralement à 4 endroits, chacun relisant `localStorage["local:buildingSelections"]` :

| Fichier | Fonction |
|---|---|
| `lib/db/data-hydration.ts:158` | `resolveWorkshopElementId()` + `loadWorkshopSelectionsHydration()` |
| `lib/stores/add-element-store.ts:565` | IIFE inline dans `useSubmitElement` |
| `components/modals/add-element/configuration-panel.tsx:47` | `getPositionWorkshopData()` (fusionne les groupes + override `max_qty`) |
| `lib/utils.ts:38` | `getBuildingFromLocal()` (variante « quel bâtiment pour cette priorité/ère ») |

Le hook `useBuildingSelections()` existe pourtant et fait la lecture proprement — mais deux
de ces implémentations lisent `localStorage` en direct.

Génération de l'ID Dexie de bâtiment, également dupliquée :
- `add-element-store.ts:127` → `generateBuildingId()` (gère la substitution workshop) ;
- `add-element-submission-hooks.ts:352` → `` `${section.category}_${e.buildingId}_${e.type}_${e.era}_${e.level}` `` (**ne gère pas** la substitution — les presets écrivent donc `primary_workshop` littéralement, ce qui fonctionne parce que l'hydratation le résout à la lecture) ;
- `lib/stores/use-submit-preset.ts` (fichier mort, voir §6.7) → 3ᵉ variante, qui gère la substitution.

> ⚠️ **Défaut fonctionnel identifié à la consolidation** : `generateBuildingId` redérive la
> position à partir du **nom concret** de l'atelier, dans l'ordre du jeu et non dans le
> classement du joueur. Dès que le joueur reclasse ses ateliers, les trois positions sont
> **permutées** dans l'ID écrit en base, et l'hydratation ne rattrape pas l'erreur. Corrigé
> par `resolvers/workshops.ts` ; les entrées Dexie déjà écrites restent fausses — dette
> ouverte et tracée dans [`todo-dette-ids-workshop.md`](./todo-dette-ids-workshop.md).

**Regroupement préalable utile ? Oui.** Le concept « workshop de position » est une notion
de *jeu* (le joueur choisit 3 workshops par tranche d'ères) qui n'a aujourd'hui aucun
propriétaire : elle est répartie entre `lib/constants.ts` (`buildingsAbbr`, `WORKSHOP_MAX_QTY`,
`WORKSHOP_ERAS`, `goodsUrlByEra`), `lib/utils.ts`, la couche DB et deux composants. Le game
design fournira les workshops et leurs goods ; sans point d'entrée unique, l'extraction devra
alimenter au moins 4 tables.

### 6.7 🟡 Doublons et code mort identifiés

| Élément | Statut |
|---|---|
| `lib/stores/use-submit-preset.ts` (218 l.) | **Duplicata mort** de `useSubmitPreset` de `add-element-submission-hooks.ts`. Aucun importeur. Son en-tête dit « à ajouter dans add-element-submission-hooks.ts » — le portage a été fait, l'original n'a pas été supprimé. Il est *plus complet* que la version vivante (il gère les workshops de position). |
| `UserWonderEntity` + table `userWonders` dans `lib/db/schema.ts` (v5 de `roc_wiki_db`) | **Doublon obsolète** de `lib/db/wonders-schema.ts` (`roc_wonders_db`). Champ nommé `currentLevel` ici vs `lvl` là. Seule la version `roc_wonders_db` est utilisée. |
| `data/wonders/bonuses.ts`, `data/wonders/presets.ts` | Sans importeur (§6.5) |
| `calculateTotalTechnoCosts` (`technos-registry.ts`) | Exportée, jamais importée (§6.4) |
| `components/wonders/preset-stats-section.tsx` (270 l.) | Sans importeur ; `SynergyPanel` et `WonderBoostsPanel` y sont dupliqués depuis `components/wonders/presets/synergies.tsx` (version vivante) |
| `types/shared.ts` → `EraDetail`, `Costs.culture_range`, `Costs.culture_bonus` | Déclarés, non consommés (§0.3) |
| `types/campaign-types.ts` → `HydratedCampaignRegion` | Type déclaré, aucune fonction ne le produit (§3.3) |
| `lib/constants.ts` → `limitAlliedBuildingsByEra` (66 l.), `skipBuildingLimit`, `luxuriousBuilding`, `formatColumns`, `skipColumns` | Sans aucun importeur (vérifié). Reliquat après la suppression de `limitCapitalBuildingsByEra` / `limitLuxuriousBuildingsByEra` / `limitAllBuildingsByEra` (§6.2) |
| `lib/config.ts` → `siteConfig` | Contient encore les métadonnées shadcn/ui par défaut (name/url/description non adaptés) ; seul `navItems` est réellement utilisé |

**Regroupement préalable utile ?** Le nettoyage n'est pas un prérequis à l'extraction, mais
`use-submit-preset.ts` et `preset-stats-section.tsx` sont des **pièges à maintenance** :
un développeur qui les modifiera croira agir sur le comportement réel.

---

## 7. Synthèse — structures et logiques partagées entre fonctionnalités

### 7.1 Le triplet `{ id, name, column, required[] }` — contrat de graphe implicite

`TechnoData` et `CampaignRegion` partagent exactement cette forme, ce qui permet à Campaign
de réutiliser toute la couche graphe de Technologies :

| Fonction | Fichier | Technos | Campaign |
|---|---|---|---|
| `getAllAncestors` | `lib/path-utils.ts` | ✅ | ✅ (`as any`) |
| `getSubgraphBetween` | `lib/path-utils.ts` | ✅ | ✅ (`as any`) |
| `getOrderedTechs` | `lib/path-utils.ts` | ✅ | — |
| `buildGraphData` / `layoutGraph` / `layoutGraphVertical` | `lib/layout-graph.ts` | ✅ | ✅ (`as any`) |
| `collectAncestorIds` / `collectDescendantIds` | dupliqués dans `tech-tree-desktop.tsx` **et** `campaign-tree-desktop.tsx` | ✅ | ✅ |

Différences de signature qui empêchent aujourd'hui un typage propre :
`TechnoData.required?` est optionnel, `CampaignRegion.required` ne l'est pas ;
`TechNode` (`layout-graph.ts`) redéclare une 3ᵉ variante.

**Mutualisation possible** : un type `GraphNode { id; name; column; required: string[] }`
que `TechnoData` et `CampaignRegion` étendent, supprimant les casts `as any` et donnant
un contrat explicite aux deux domaines. Convention d'arête `` `${from}-${to}` `` déjà commune.

### 7.2 Le pattern « registry par ère » — 3 implémentations identiques

```ts
Record<eraId_snake_case, T[]>  +  getXByEra(eraId): T[]
```

- `TECHNOLOGY_REGISTRY` / `getTechnologiesByEra` (exporté)
- `CAMPAIGN_REGISTRY` / `getCampaignsByEra` (registry privé, `CAMPAIGN_ERA_IDS` exporté)
- `PRESET_SECTIONS` / `getSectionsForEraAndCategory` (variante : filtrage par suffixe d'id)

Le fichier campaigns-registry documente lui-même qu'il « mirrors » celui des technos.

**Mutualisation possible** : une fabrique `createEraRegistry<T>(map)` retournant
`{ byEra, eraIds, get }`. Utile surtout si l'extraction génère ces registries — un format
unique simplifie le générateur.

### 7.3 Le pattern « état utilisateur par ère » — Technos et Campaign sont jumeaux

| Aspect | Technos | Campaign |
|---|---|---|
| Entité Dexie | `TechnoEntity { id, hidden, cp }` | `CampaignEntity { id, hidden, cp }` — **structurellement identiques** |
| Convention d'ID | `{abbr}_{n}` | `{abbr}_{n}` |
| Store de page | `technology-page-store.ts` (`roc-technology-page`) | `campaign-page-store.ts` (`roc-campaign-page`) — **même code, noms changés** |
| Dérivation `availableEras` | regex sur IDs + `ABBR_TO_ERA_ID` | regex sur IDs + `ERAS.find(...)` — **même but, deux chemins** |
| Bouton « supprimer l'ère » | `DeleteEraButton` dans `app/technologies/page.tsx` | `DeleteEraButton` dans `app/campaign/page.tsx` — commentaire du code : « copie exacte de tech page.tsx » |
| Mutations | `useRemoveTechnosByEra`, `useToggleTechnosByEra` | `useRemoveCampaignRegionsByEra`, `useToggleCampaignRegionsByEra` — **corps identiques** |
| Arbres | `TechTreeDesktop` / `TechTreeMobile` | `CampaignTreeDesktop` / `CampaignTreeMobile` — même architecture ReactFlow + panneaux détails/chemin |

**Mutualisation possible** : c'est la duplication la plus systématique du projet. Un socle
générique « domaine à progression par ère » (entité `{id, hidden, cp}`, store de page,
hooks de mutation par ère, composant de suppression d'ère) couvrirait les deux — et
accueillerait sans effort un futur domaine du même type.

### 7.4 Le contrat `Costs` — commun à Buildings, Technos et Ottoman

Le type `Costs` de `types/shared.ts` est partagé par `BuildingLevel.upgrade/construction`,
`TechnoData.costs` et (sous forme de `Good[]`) les areas/trade posts ottomans. Wonders fait
exception : coûts en tables séparées (`CostEntry { amount, gears }`), avec une notion de
`gears` absente du reste du jeu.

La convention `primary_xx / secondary_xx / tertiary_xx` pour les goods d'ère traverse **les
quatre fonctionnalités** :

| Fonctionnalité | Où | Résolution |
|---|---|---|
| Calculator | `Good.resource` dans tous les `BuildingLevel` | `useGoodToPriorityConverter` + `goodsUrlByEra` |
| Technologies | `TechnoData.costs.goods` + `Reward{kind:"good"}` | `getGoodNameFromPriorityEra` |
| Campaign | — (pas de goods d'ère dans les récompenses) | — |
| Wonders | `GoodsEntry.iconKey` dans `goods-costs.ts` | `resolveGoodsIcon` (locale à `wonder-detail-modal.tsx`) |

**Mutualisation possible** : un unique résolveur `resolvePriorityGood(key, userSelections)`
retournant `{ name, icon }`. Aujourd'hui la regex de reconnaissance existe en 5 exemplaires
et la résolution en 3 variantes (dont une locale au modal Wonders).

### 7.5 La résolution d'icônes — trois systèmes cohabitent

| Système | Fichier | Domaines |
|---|---|---|
| `imagesUrl` + `getImageForItem` | `lib/catalog.ts` | Calculator (catalogue), Technos (rewards `kind:"catalog"`) |
| `getItemIconLocal(type)` → `/images/goods/{slug}.webp` | `lib/utils.ts` | Calculator, Technos, Campaign |
| `resolveIconPath(key)` → overrides puis `/images/icons/{key}.webp` | `components/wonders/stats-badge.tsx` | Wonders uniquement |

`resolveIconPath` **absorbe `imagesUrl` et `MATERIAL_ICONS`** dans ses overrides — c'est donc
le plus complet des trois, mais il vit dans un composant et non dans `lib/`.

**Mutualisation possible** : un résolveur d'icônes unique dans la future couche `resolvers/`,
`resolveIconPath` servant de base puisqu'il englobe déjà les autres.

### 7.6 Le pattern « données statiques + état utilisateur »

Tous les domaines suivent le même schéma conceptuel, avec **trois degrés de formalisation** :

| Domaine | Formalisation |
|---|---|
| Buildings / Technos / Ottoman | ✅ centralisée : `lib/db/data-hydration.ts` produit `Hydrated*` |
| Campaign | ⚠️ absente : `HydratedCampaignRegion` est déclaré mais jamais produit ; chaque composant croise `CampaignRegion[]` × `CampaignEntity[]` lui-même (page, `CampaignCard`, `CampaignTreeDesktop`, `calculations.ts`) |
| Wonders | ⚠️ différente : pas de type hydraté ; l'UI reçoit `Wonder` + `ownedMap: Record<code, {code, lvl}>` en parallèle |

**Mutualisation possible** : étendre `data-hydration.ts` à Campaign (et éventuellement
Wonders) donnerait un point unique où la donnée statique rencontre l'état joueur — c'est
exactement la frontière `data/` ↔ `resolvers/` visée par la refonte.

### 7.7 Bases Dexie — 3 bases distinctes

| Base | Tables | Justification (dans le code) |
|---|---|---|
| `roc_wiki_db` (v5) | `buildings`, `technos`, `ottomanAreas`, `ottomanTradePosts`, `campaigns`, ~~`userWonders`~~ | Calculator + Technos + Campaign |
| `roc_wonders_db` (v1) | `userWonders` | « isolée pour qu'un reset du Calculator n'efface pas les wonders » |
| `roc_presets_db` (v1) | `userPresets` | idem |

La table `userWonders` de `roc_wiki_db` (v5) est un résidu de la migration vers
`roc_wonders_db` (§6.7).

---

## 8. Récapitulatif — ce que la future donnée doit respecter

Contrats à ne pas casser, par ordre de criticité :

1. **Format des identifiants**
   - Bâtiment (Dexie) : `${category}_${elementId}_${type}_${era}_${level}`, `category` sans `_`.
   - Bâtiment (registry) : `${category}_${buildingId}`.
   - Techno / Région : `{abbr2}_{n}`, abbr en 2 lettres minuscules présent dans `ERA_ID_TO_ABBR`.
   - Wonder : `code` court (`"SH"`, `"LToP"`), clé de `WONDERS`, de la DB, de `WONDER_IMAGE_MAP`.
   - Ottoman : `oa_{index}` / `otp_{index}`.

2. **Forme des coûts** : objet plat de nombres + clé `goods: {amount, resource}[]`.
   Toute clé numérique nouvelle est agrégée automatiquement comme ressource principale.

3. **Conventions de chaînes porteuses de sémantique**
   - `primary|secondary|tertiary_{era2}` → good d'ère résolu dynamiquement.
   - `commander_*` → récompense de campagne rendue par `name`.
   - suffixe `_workshop` sur un `elementId` → workshop de position.
   - suffixe `_Lv` sur `imageName` → image dépendante du niveau.

4. **Unicité (level, era)** dans `BuildingData.levels`.

5. **30 valeurs** dans `WonderBonus.values` ; tables de coûts wonders indexées 0→30.

6. **Cohérence avec `CATALOG`** : `category` / `subcategory` d'un bâtiment doivent exister
   dans `lib/catalog.ts`, sinon l'ordre d'affichage se dégrade silencieusement.

7. **Existence des assets** : `getItemIconLocal` et `resolveIconPath` construisent des
   chemins depuis les valeurs de données — un `resource` ou une clé d'icône inconnue produit
   une image manquante, pas une erreur.
