// ============================================================
// ROC Helper – Extraction du domaine Bâtiments
//
// Lit `source/gamedesign.json` + `source/loca.json` et écrit
// `data/buildings/generated/buildings.generated.ts`.
//
// Le game design est la SEULE source de vérité sur le contenu. Le contenu
// actuel de `data/capital/**` et `data/allieds/**` n'est jamais lu ni consulté :
// seule la FORME attendue (docs/data-contracts.md §1.1 a) guide la projection.
// La comparaison entre les deux est le travail de scripts/diff/buildings.ts.
//
// Structure des données : docs/game-schema/03-batiments.md
//   - §1.1 : un niveau = une `BuildingDefinitionDTO`, reliées par
//            `UpgradeComponentDTO.target`. Un « bâtiment » de l'app est donc
//            une CHAÎNE, identifiée par `(cities[0], group)`.
//   - §1.2 : les `evolving` ont une progression runtime interne, hors chaîne.
//   - §1.4 : `level` absent sur 22 définitions, dont la racine de la plus
//            longue chaîne (`Building_DawnAge_Farm_Rural_1`).
//   - §2   : `age` absent exactement sur les 44 `evolving`.
//   - §3.1 : `ProductionComponentDTO`, le composant central.
// Conventions          : docs/game-schema/00-conventions.md
//   - C3 : les int64 sont sérialisés en string
//   - C7 : une clé de loca absente est un libellé absent, pas une erreur
//   - C9 : les tables dynamiques se lisent par palier
//
// Usage : pnpm extract:buildings
// ============================================================

import fs from "node:fs";
import path from "node:path";

import type {
  BuildingAgeCurve,
  BuildingAgeCurveEntry,
  BuildingBonus,
  BuildingBonusFormat,
  BuildingBonusGap,
  BuildingBonusScope,
  BuildingChainExtract,
  BuildingCostLine,
  BuildingCurve,
  BuildingCurveStep,
  BuildingExtractBundle,
  BuildingLevelExtract,
  BuildingLevelUpExtract,
  BuildingRawCosts,
  BuildingRawEntry,
  BuildingRawGood,
  BuildingRawLevel,
  BuildingScope,
  RegeneratingResourceExtract,
} from "../../data/buildings/generated/types";
import {
  collectLuaVariables,
  evaluateCurveFormula,
  evaluateLuaFormula,
} from "../../resolvers/lua-formula";

// ─── Accès JSON typé ──────────────────────────────────────────────────────────

type Json = unknown;
type JsonObject = { [key: string]: Json };

function isObject(v: Json): v is JsonObject {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function asObject(v: Json): JsonObject {
  return isObject(v) ? v : {};
}

function asArray(v: Json): Json[] {
  return Array.isArray(v) ? v : [];
}

function asString(v: Json): string | null {
  return typeof v === "string" ? v : null;
}

/** Nombre, en acceptant la forme string des int64 (C3). */
function asNumber(v: Json): number | null {
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function require0(v: string | null, what: string): string {
  if (v === null) throw new Error(`Champ obligatoire absent : ${what}`);
  return v;
}

/** `type.googleapis.com/FooDTO` → `FooDTO`. */
function shortType(v: Json): string {
  const t = asString(asObject(v)["@type"]);
  return t === null ? "" : t.slice(t.lastIndexOf("/") + 1);
}

/** `"86400s"` → 86400. Les durées du game design sont des `Duration` protobuf. */
function asSeconds(v: Json): number | null {
  const s = asString(v);
  if (s === null) return null;
  const m = /^(-?\d+(?:\.\d+)?)s$/.exec(s.trim());
  return m === null ? null : Number(m[1]);
}

/** Coupe le bruit de virgule flottante des produits `modifier × valeur`. */
function round(value: number, digits = 6): number {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

// ─── Vocabulaire de présentation (côté projet, PAS game design) ───────────────

/**
 * `AgeDefinition.id` → abréviation d'ère du projet, dans l'ordre de `ERAS`
 * (data/config.ts). Repris tel quel de scripts/extract/technologies.ts.
 */
const AGES: { age: string; abbr: string }[] = [
  { age: "StoneAge", abbr: "SA" },
  { age: "BronzeAge", abbr: "BA" },
  { age: "MinoanEra", abbr: "ME" },
  { age: "ClassicGreece", abbr: "CG" },
  { age: "EarlyRome", abbr: "ER" },
  { age: "RomanEmpire", abbr: "RE" },
  { age: "ByzantineEra", abbr: "BE" },
  { age: "AgeOfTheFranks", abbr: "AF" },
  { age: "FeudalAge", abbr: "FA" },
  { age: "IberianEra", abbr: "IE" },
  { age: "KingdomOfSicily", abbr: "KS" },
  { age: "HighMiddleAges", abbr: "HM" },
  { age: "EarlyGothicEra", abbr: "EG" },
  { age: "LateGothicEra", abbr: "LG" },
];

const AGE_INDEX = new Map(AGES.map((a, i) => [a.age, i]));
const ABBR_BY_AGE = new Map(AGES.map((a) => [a.age, a.abbr]));

/**
 * `DawnAge` n'est PAS une ère du projet : c'est l'âge tutoriel, porté par deux
 * racines de chaîne (`Building_DawnAge_Farm_Rural_1`, `Building_DawnAge_City_CityHall_1`).
 * Le projet n'a pas de code pour lui et l'app ne l'affiche nulle part — la
 * chaîne commence à `StoneAge`. Ces maillons sont extraits (leur coût d'upgrade
 * est celui du niveau 1) mais restent hors de la projection UI.
 */
const PREGAME_AGE = "DawnAge";

/**
 * `Good1` | `Good2` | `Good3` → rang de bien côté projet (§2.1 de data-contracts).
 *
 * ⚠️ NE PAS reconvertir en bien concret. Deux notions se ressemblent et ne sont
 * PAS la même chose :
 *
 *  - `ResourceDefinitionDTO.order` (1 | 2 | 3) est un rang de TRI DE CATALOGUE.
 *    Il ordonne le panneau « Produits » du jeu, il est figé dans le game design,
 *    et il est IDENTIQUE sur tous les comptes.
 *  - `primary` / `secondary` / `tertiary` est l'ASSIGNATION D'ATELIERS PROPRE À
 *    CHAQUE COMPTE. Le jeu l'impose au démarrage de chaque compte et elle diffère
 *    d'un joueur à l'autre par design — c'est précisément ce qui rend le trading
 *    nécessaire : si tout le monde produisait le même bien en premier, personne
 *    n'aurait besoin d'acheter.
 *
 * Cette assignation n'apparaît NULLE PART dans `source/gamedesign.json`. C'est un
 * état de compte, pas un fait de catalogue — d'où le préfixe `DYN|`, qui signale
 * exactement ça : une résolution différée, faite côté compte. L'app la résout à
 * l'affichage, avec le classement que CHAQUE joueur renseigne dans la popup
 * ateliers (`local:buildingSelections`).
 *
 * Figer un coût en bien concret (`alabaster_idol`) reviendrait donc à imposer à
 * tous les joueurs l'assignation du compte qui a servi à l'extraction — faux par
 * construction du jeu.
 *
 * Le game design n'écrit d'ailleurs JAMAIS un bien de la capitale par son nom
 * dans un coût : il passe systématiquement par le jeton `DYN|`. Le seul endroit
 * où un bien concret apparaît, ce sont les récompenses — qui, elles, ne passent
 * pas par cette projection.
 *
 * Même décision, et même commentaire, que scripts/extract/technologies.ts.
 */
const GOOD_RANK: Record<string, string> = {
  Good1: "primary",
  Good2: "secondary",
  Good3: "tertiary",
};

/**
 * Ressources dont l'identifiant de game design diverge de la clé du projet.
 * Repris tel quel de scripts/extract/technologies.ts — un seul dictionnaire de
 * traduction pour les deux domaines.
 */
const RESOURCE_KEY_ALIAS: Record<string, string> = {
  confections: "confection",
  medical_tea: "tea",
  asper: "aspers",
  // ⚠️ Ajout propre à ce domaine : le game design écrit `gem_treasure`, le
  // projet `jewel_treasure` (lib/constants.ts, `goodsByCivilization`). Les trois
  // autres trésors (`gold_`, `spice_`, `ceramic_`) portent le même nom des deux
  // côtés. Cet alias manque à scripts/extract/technologies.ts — à vérifier là-bas
  // si une technologie coûte ce bien.
  gem_treasure: "jewel_treasure",
};

/**
 * Ressources qui deviennent une clé NUMÉRIQUE de `Costs` (types/shared.ts)
 * plutôt qu'une entrée de `goods[]`. `premium` est la gemme du jeu.
 * Tout ce qui n'est pas listé ici part dans `goods[]` — c'est la règle de
 * docs/data-contracts.md §1.1 a) contrainte 2.
 */
type ScalarCostKey = Exclude<keyof BuildingRawCosts, "goods">;

const COST_SCALAR_KEY: Record<string, ScalarCostKey> = {
  coins: "coins",
  food: "food",
  premium: "gems",
  asper: "aspers",
  deben: "deben",
  wu_zhu: "wu_zhu",
  rice: "rice",
  cocoa: "cocoa",
  pennies: "pennies",
  dirham: "dirham",
};

/**
 * Classes de chaînes délibérément hors périmètre de l'app, par `BuildingDefinition.type`.
 *
 * Ce n'est pas un filtre de commodité : une chaîne qui n'entre dans aucune de
 * ces classes ET n'a pas de clé de registre est signalée (`scope: "undeclared"`),
 * pour qu'un bâtiment nouvellement livré par le jeu se voie au lieu de
 * disparaître.
 */
const OUT_OF_SCOPE_BY_TYPE: Record<string, BuildingScope> = {
  cityHall: "cityHall",
  collectable: "collectable",
  evolving: "evolving",
  decoration: "decoration",
  extractionPoint: "extractionPoint",
  presetIrrigation: "presetIrrigation",
};

/** Idem, par groupe : l'infrastructure de port n'est pas un bâtiment plaçable. */
const OUT_OF_SCOPE_BY_GROUP: Record<string, BuildingScope> = {
  harborConnection: "harborInfrastructure",
  harbormaster: "harborInfrastructure",
  market: "harborInfrastructure",
  noriaIrrigation: "presetIrrigation",
  oasisIrrigation: "presetIrrigation",
};

/**
 * Présentation projet d'une chaîne : clé de registre, slug, catégorie,
 * sous-catégorie, base de nom d'image wiki.
 *
 * ⚠️ AUCUN de ces cinq champs n'existe dans le game design. Ce sont des
 * conventions de `lib/catalog.ts` et de `ELEMENT_DATA_REGISTRY` — la catégorie
 * `harbor` regroupe par exemple des bâtiments dont la cité est `City_Capital`,
 * et `imageName` est une base de nom de fichier du wiki RoC.
 *
 * Conséquence assumée : le diff ne compare PAS ces champs, il n'y aurait rien à
 * comparer. Seuls `name` et `levels` sortent réellement de la source.
 *
 * La table fait aussi office de périmètre : une chaîne absente d'ici et non
 * classée hors périmètre est signalée.
 */
interface Presentation {
  registryKey: string;
  id: string;
  category: string;
  subcategory: string;
  imageName: string;
}

const PROJECT_PRESENTATION: Record<string, Presentation> = {
  "City_Capital|smallHome": { registryKey: "capital_small_home", id: "capital-homes-small-home", category: "capital", subcategory: "homes", imageName: "Capital_Small_Home_Lv" },
  "City_Capital|averageHome": { registryKey: "capital_average_home", id: "capital-homes-average-home", category: "capital", subcategory: "homes", imageName: "Capital_Average_Home_Lv" },
  "City_Capital|premiumHome": { registryKey: "capital_luxurious_home", id: "capital-homes-luxurious-home", category: "capital", subcategory: "homes", imageName: "Capital_Luxurious_Home_Lv" },
  "City_Capital|ruralFarm": { registryKey: "capital_rural_farm", id: "capital-farms-rural-farm", category: "capital", subcategory: "farms", imageName: "Capital_Rural_Farm_Lv" },
  "City_Capital|domesticFarm": { registryKey: "capital_domestic_farm", id: "capital-domestic-farm", category: "capital", subcategory: "farms", imageName: "Capital_Domestic_Farm_Lv" },
  "City_Capital|premiumFarm": { registryKey: "capital_luxurious_farm", id: "capital-luxurious-farm", category: "capital", subcategory: "farms", imageName: "Capital_Luxurious_Farm_Lv" },
  "City_Capital|littleCulture": { registryKey: "capital_little_culture_site", id: "capital-cultural-sites-little", category: "capital", subcategory: "cultural_sites", imageName: "Capital_Little_Culture_Site_Lv" },
  "City_Capital|compactCulture": { registryKey: "capital_compact_culture_site", id: "capital-cultural-sites-compact", category: "capital", subcategory: "cultural_sites", imageName: "Capital_Compact_Culture_Site_Lv" },
  "City_Capital|moderateCulture": { registryKey: "capital_moderate_culture_site", id: "capital-cultural-sites-moderate", category: "capital", subcategory: "cultural_sites", imageName: "Capital_Moderate_Culture_Site_Lv" },
  "City_Capital|largeCulture": { registryKey: "capital_large_culture_site", id: "capital-cultural-sites-large", category: "capital", subcategory: "cultural_sites", imageName: "Capital_Large_Culture_Site_Lv" },
  "City_Capital|premiumCulture": { registryKey: "capital_luxurious_culture_site", id: "capital-cultural-sites-luxurious", category: "capital", subcategory: "cultural_sites", imageName: "Capital_Luxurious_Culture_Site_Lv" },
  "City_Capital|infantryBarracks": { registryKey: "capital_infantry_barracks", id: "capital-infantry-barracks", category: "capital", subcategory: "barracks", imageName: "Capital_Infantry_Barracks_Lv" },
  "City_Capital|rangedBarracks": { registryKey: "capital_ranged_barracks", id: "capital-barracks-ranged-barracks", category: "capital", subcategory: "barracks", imageName: "Capital_Ranged_Barracks_Lv" },
  "City_Capital|cavalryBarracks": { registryKey: "capital_cavalry_barracks", id: "capital-barracks-cavalry-barracks", category: "capital", subcategory: "barracks", imageName: "Capital_Cavalry_Barracks_Lv" },
  "City_Capital|heavyInfantryBarracks": { registryKey: "capital_heavy_infantry_barracks", id: "capital-barracks-heavy_infantry_barracks", category: "capital", subcategory: "barracks", imageName: "Capital_Heavy_Infantry_Barracks_Lv" },
  "City_Capital|siegeBarracks": { registryKey: "capital_siege_barracks", id: "capital-siege-barracks", category: "capital", subcategory: "barracks", imageName: "Capital_Siege_Barracks_Lv" },
  "City_Capital|artisan": { registryKey: "capital_artisan", id: "capital-workshops-artisan", category: "capital", subcategory: "workshops", imageName: "Capital_Artisan_Lv" },
  "City_Capital|tailor": { registryKey: "capital_tailor", id: "capital-workshops-tailor", category: "capital", subcategory: "workshops", imageName: "Capital_Tailor_Lv" },
  "City_Capital|stoneMason": { registryKey: "capital_stone_mason", id: "capital-workshops-stone-mason", category: "capital", subcategory: "workshops", imageName: "Capital_Stone_Mason_Lv" },
  "City_Capital|scribe": { registryKey: "capital_scribe", id: "capital-workshops-scribe", category: "capital", subcategory: "workshops", imageName: "Capital_Scribe_Lv" },
  "City_Capital|carpenter": { registryKey: "capital_carpenter", id: "capital-workshops-carpenter", category: "capital", subcategory: "workshops", imageName: "Capital_Carpenter_Lv" },
  "City_Capital|spiceMerchant": { registryKey: "capital_spice_merchant", id: "capital-workshops-spice-merchant", category: "capital", subcategory: "workshops", imageName: "Capital_Spice_Merchant_Lv" },
  "City_Capital|alchemist": { registryKey: "capital_alchemist", id: "capital-workshops-alchemist", category: "capital", subcategory: "workshops", imageName: "Capital_Alchemist_Lv" },
  "City_Capital|jeweler": { registryKey: "capital_jeweler", id: "capital-workshops-jeweler", category: "capital", subcategory: "workshops", imageName: "Capital_Jeweler_Lv" },
  "City_Capital|glassblower": { registryKey: "capital_glassblower", id: "capital-workshops-glassblower", category: "capital", subcategory: "workshops", imageName: "Capital_Glassblower_Lv" },
  "City_Capital|smallSailorHome": { registryKey: "harbor_seafarer_house", id: "capital-homes-seafarer-house", category: "capital", subcategory: "homes", imageName: "Seafarer_House_Lv" },
  "City_Capital|premiumSailorHome": { registryKey: "harbor_luxurious_seafarer_house", id: "capital-homes-luxurious-seafarer-house", category: "capital", subcategory: "homes", imageName: "Luxurious_Seafarer_House_Lv" },
  "City_Capital|pier": { registryKey: "harbor_pier", id: "capital-port-facilities-pier", category: "capital", subcategory: "port_facilities", imageName: "Pier_Lv" },
  "City_Capital|lighthouse": { registryKey: "harbor_lighthouse", id: "capital-port-facilities-lighthouse", category: "capital", subcategory: "port_facilities", imageName: "Lighthouse_Lv" },
  "City_Capital|normalShipyard": { registryKey: "harbor_shipyard", id: "capital-ships-shipyards", category: "capital", subcategory: "ships", imageName: "Shipyard_Lv" },
  "City_Capital|normalWarehouse": { registryKey: "harbor_common_warehouse", id: "capital-warehouses-common-warehouse", category: "capital", subcategory: "warehouses", imageName: "Common_Warehouse_Lv" },
  "City_Capital|premiumWarehouse": { registryKey: "harbor_large_warehouse", id: "capital-warehouses-large-warehouse", category: "capital", subcategory: "warehouses", imageName: "Large_Warehouse_Lv" },
  "City_Capital|cultureShip": { registryKey: "ottoman_empire_ship", id: "ottoman-ship", category: "ottoman", subcategory: "ships", imageName: "Ottoman_Empire_Ship_Lv" },
  "City_Egypt|smallHome": { registryKey: "egypt_small_home", id: "egypt-homes-small-home", category: "egypt", subcategory: "homes", imageName: "Egypt_Small_Home_Lv" },
  "City_Egypt|averageHome": { registryKey: "egypt_average_home", id: "egypt-homes-average-home", category: "egypt", subcategory: "homes", imageName: "Egypt_Average_Home_Lv" },
  "City_Egypt|premiumHome": { registryKey: "egypt_luxurious_home", id: "egypt-homes-luxurious-home", category: "egypt", subcategory: "homes", imageName: "Egypt_Luxurious_Home_Lv" },
  "City_Egypt|averageGoldMine": { registryKey: "egypt_gold_mine", id: "egypt-gold-mine", category: "egypt", subcategory: "gold_mine", imageName: "Egypt_Gold_Mine_Lv" },
  "City_Egypt|premiumGoldMine": { registryKey: "egypt_luxurious_gold_mine", id: "egypt-lux-gold-mine", category: "egypt", subcategory: "gold_mine", imageName: "Egypt_Luxurious_Gold_Mine_Lv" },
  "City_Egypt|averagePapyrusField": { registryKey: "egypt_papyrus_field", id: "egypt-papyrus-field", category: "egypt", subcategory: "papyrus_field", imageName: "Egypt_Papyrus_Field_Lv" },
  "City_Egypt|premiumPapyrusField": { registryKey: "egypt_luxurious_papyrus_field", id: "egypt-luxurious-papyrus-field", category: "egypt", subcategory: "papyrus_field", imageName: "Egypt_Luxurious_Papyrus_Field_Lv" },
  "City_Egypt|goldsmith": { registryKey: "egypt_goldsmith", id: "egypt-goldsmith", category: "egypt", subcategory: "goldsmith", imageName: "Egypt_Goldsmith_Lv" },
  "City_Egypt|papyrusPress": { registryKey: "egypt_papyrus_press", id: "egypt-papyrus-press", category: "egypt", subcategory: "papyrus_press", imageName: "Egypt_Papyrus_Press_Lv" },
  "City_Egypt|irrigationStation": { registryKey: "egypt_irrigation_station", id: "egypt-irrigation-station", category: "egypt", subcategory: "irrigation", imageName: "Egypt_Irrigation_Station" },
  "City_Egypt|smallWell": { registryKey: "egypt_small_well", id: "egypt-irrigation-small-well", category: "egypt", subcategory: "irrigation", imageName: "Egypt_Small_Well" },
  "City_Egypt|channel": { registryKey: "egypt_channel", id: "egypt-irrigation-channel", category: "egypt", subcategory: "irrigation", imageName: "Egypt_Channel" },
  "City_Egypt|waterPump": { registryKey: "egypt_water_pump", id: "egypt-irrigation-channel", category: "egypt", subcategory: "irrigation", imageName: "Egypt_Water_Pump" },
  "City_Egypt|oasis": { registryKey: "egypt_oasis", id: "egypt-irrigation-oasis", category: "egypt", subcategory: "irrigation", imageName: "Egypt_Oasis" },
  "City_Egypt|fountain": { registryKey: "egypt_fountain", id: "egypt-irrigation-fountain", category: "egypt", subcategory: "irrigation", imageName: "Egypt_Fountain" },
  "City_China|smallHome": { registryKey: "china_small_home", id: "china-homes-small-home", category: "china", subcategory: "homes", imageName: "China_Small_Home_Lv" },
  "City_China|averageHome": { registryKey: "china_average_home", id: "china-homes-average-home", category: "china", subcategory: "homes", imageName: "China_Average_Home_Lv" },
  "City_China|premiumHome": { registryKey: "china_luxurious_home", id: "china-homes-luxurious-home", category: "china", subcategory: "homes", imageName: "China_Luxurious_Home_Lv" },
  "City_China|averageRiceFarm": { registryKey: "china_rice_farm", id: "china-rice-farm", category: "china", subcategory: "rice_farms", imageName: "China_Rice_Farm_Lv" },
  "City_China|premiumRiceFarm": { registryKey: "china_luxurious_rice_farm", id: "china-luxurious-rice-farm", category: "china", subcategory: "rice_farms", imageName: "China_Luxurious_Rice_Farm_Lv" },
  "City_China|clayProcessor": { registryKey: "china_clay_processor", id: "china_clay_processor", category: "china", subcategory: "workshop", imageName: "China_Clay_Processor" },
  "City_China|porcelainWorkshop": { registryKey: "china_porcelain_workshop", id: "china_porcelain_workshop", category: "china", subcategory: "workshop", imageName: "China_Porcelain_Workshop" },
  "City_China|silkWorkshop": { registryKey: "china_silk_workshop", id: "china_silk_workshop", category: "china", subcategory: "workshop", imageName: "China_Silk_Workshop" },
  "City_China|threadProcessor": { registryKey: "china_thread_processor", id: "thread_processor", category: "china", subcategory: "thread_processor", imageName: "China_Thread_Processor" },
  "City_Mayas|workerHome": { registryKey: "maya_worker_home", id: "maya-homes-worker-home", category: "maya", subcategory: "homes", imageName: "Maya_Worker_Home_Lv" },
  "City_Mayas|priestHome": { registryKey: "maya_priest_home", id: "maya-homes-priest-home", category: "maya", subcategory: "homes", imageName: "Maya_Priest_Home_Lv" },
  "City_Mayas|premiumHome": { registryKey: "maya_luxurious_home", id: "maya-homes-luxurious-home", category: "maya", subcategory: "homes", imageName: "Maya_Luxurious_Home_Lv" },
  "City_Mayas|averageAviary": { registryKey: "maya_average_aviary", id: "maya-average-aviary", category: "maya", subcategory: "aviary", imageName: "Maya_Average_Aviary_Lv" },
  "City_Mayas|premiumAviary": { registryKey: "maya_luxurious_aviary", id: "maya-luxurious-aviary", category: "maya", subcategory: "aviary", imageName: "Maya_Luxurious_Aviary" },
  "City_Mayas|jadeQuarry": { registryKey: "maya_jade_quarry", id: "maya-quarries-jade-quarry", category: "maya", subcategory: "quarries", imageName: "Maya_Jade_Quarry_Lv" },
  "City_Mayas|premiumQuarry": { registryKey: "maya_luxurious_quarry", id: "maya-quarries-luxurious-quarry", category: "maya", subcategory: "quarries", imageName: "Maya_Luxurious_Quarry_Lv" },
  "City_Mayas|obsidianQuarry": { registryKey: "maya_obsidian_quarry", id: "maya-quarries-obsidian-quarry", category: "maya", subcategory: "quarries", imageName: "Maya_Obsidian_Quarry_Lv" },
  "City_Mayas|smallRitualSite": { registryKey: "maya_small_ritual_site", id: "maya-ritual-sites-small-ritual-site", category: "maya", subcategory: "ritual_sites", imageName: "Maya_Small_Ritual_Site" },
  "City_Mayas|averageRitualSite": { registryKey: "maya_average_ritual_site", id: "maya-ritual-sites-average-ritual-site", category: "maya", subcategory: "ritual_sites", imageName: "Maya_Average_Ritual_Site" },
  "City_Mayas|premiumRitualSite": { registryKey: "maya_luxurious_ritual_site", id: "maya-ritual-sites-luxurious-ritual-site", category: "maya", subcategory: "ritual_sites", imageName: "Maya_Luxurious_Ritual_Site" },
  "City_Mayas|chronicler": { registryKey: "maya_chronicler", id: "chronicler", category: "maya", subcategory: "workshops", imageName: "Maya_Chronicler" },
  "City_Mayas|maskSculptor": { registryKey: "maya_mask_sculptor", id: "mask_sculptor", category: "maya", subcategory: "workshops", imageName: "Maya_Mask_Sculptor" },
  "City_Mayas|ceremonyOutfitter": { registryKey: "maya_ceremony_outfitter", id: "ceremony_outfitter", category: "maya", subcategory: "workshops", imageName: "Maya_Ceremony_Outfitter" },
  "City_Mayas|ritualCarver": { registryKey: "maya_ritual_carver", id: "ritual_carver", category: "maya", subcategory: "workshops", imageName: "Maya_Ritual_Carver" },
  "City_Mayas|premiumWorkshop": { registryKey: "maya_luxurious_workshop", id: "luxurious_workshop", category: "maya", subcategory: "workshops", imageName: "Maya_Luxurious_Workshop_Lv" },
  "City_Vikings|workerHome": { registryKey: "vikings_worker_home", id: "viking-homes-worker-home", category: "viking", subcategory: "homes", imageName: "Viking_Worker_Home_Lv" },
  "City_Vikings|sailorHome": { registryKey: "vikings_sailor_home", id: "viking-homes-sailor-home", category: "viking", subcategory: "homes", imageName: "Viking_Sailor_Home_Lv" },
  "City_Vikings|premiumHome": { registryKey: "vikings_luxurious_home", id: "viking-homes-luxurious-home", category: "viking", subcategory: "homes", imageName: "Viking_Luxurious_Home_Lv" },
  "City_Vikings|homeRunestone": { registryKey: "vikings_home_runestone", id: "viking-home-runestone", category: "viking", subcategory: "home-runestone", imageName: "Viking_Home_Runestone" },
  "City_Vikings|beehiveRunestone": { registryKey: "vikings_beehive_runestone", id: "viking-beehive-runestone", category: "viking", subcategory: "beehive-runestone", imageName: "Viking_Beehive_Runestone" },
  "City_Vikings|tavernRunestone": { registryKey: "vikings_tavern_runestone", id: "viking-tavern-runestone", category: "viking", subcategory: "tavern-runestone", imageName: "Viking_Tavern_Runestone" },
  "City_Vikings|expeditionPier": { registryKey: "vikings_expedition_pier", id: "viking-expedition-pier", category: "viking", subcategory: "expedition-pier", imageName: "Viking_Expedition_Pier" },
  "City_Vikings|sailorPort": { registryKey: "vikings_sailor_port", id: "viking-sailor-port", category: "viking", subcategory: "sailor-port", imageName: "Viking_Sailor_Port" },
  "City_Vikings|premiumSailorPort": { registryKey: "vikings_luxurious_sailor_port", id: "viking-luxurious-sailor-port", category: "viking", subcategory: "luxurious-sailor-port", imageName: "Viking_Luxurious_Sailor_Port_Lv" },
  "City_Vikings|tavern": { registryKey: "vikings_tavern", id: "viking-tavern", category: "viking", subcategory: "tavern", imageName: "Viking_Tavern_Lv" },
  "City_Vikings|averageBeehive": { registryKey: "vikings_beehive", id: "vikings-beehive", category: "vikings", subcategory: "beehives", imageName: "Viking_Beehive_Lv" },
  "City_Vikings|averagePier": { registryKey: "vikings_fishing_pier", id: "viking-fishing-pier", category: "vikings", subcategory: "fishing_piers", imageName: "Viking_Fishing_Pier_Lv" },
  "City_Vikings|premiumPier": { registryKey: "vikings_luxurious_fishing_pier", id: "viking-luxurious-fishing-pier", category: "vikings", subcategory: "fishing_piers", imageName: "Viking_Luxurious_Fishing_Pier_Lv" },
  "City_Arabia|mediumHome": { registryKey: "arabia_medium_home", id: "arabia-homes-medium-home", category: "arabia", subcategory: "homes", imageName: "Arabia_Medium_Home_Lv" },
  "City_Arabia|premiumHome": { registryKey: "arabia_luxurious_home", id: "arabia-homes-luxurious-home", category: "arabia", subcategory: "homes", imageName: "Arabia_Luxurious_Home_Lv" },
  "City_Arabia|averageCamelFarm": { registryKey: "arabia_camel_farm", id: "arabia-camel-farm", category: "arabia", subcategory: "camel_farms", imageName: "Arabia_Camel_Farm" },
  "City_Arabia|mediumIrrigation": { registryKey: "arabia_channel", id: "arabia-channel", category: "arabia", subcategory: "irrigation", imageName: "Arabia_Channel" },
  "City_Arabia|smallIrrigation": { registryKey: "arabia_small_well", id: "arabia-irrigation-small-well", category: "arabia", subcategory: "irrigation", imageName: "Arabia_Small_Well" },
  "City_Arabia|largeIrrigation": { registryKey: "arabia_deep_weel", id: "arabia-deep-weel", category: "arabia", subcategory: "irrigation", imageName: "Arabia_Deep_Well" },
  "City_Arabia|premiumIrrigation": { registryKey: "arabia_luxurious_noria", id: "arabia-luxurious-noria", category: "arabia", subcategory: "irrigation", imageName: "Arabia_Luxurious_Noria" },
  "City_Arabia|averageMerchant": { registryKey: "arabia_merchant", id: "arabia-merchant", category: "arabia", subcategory: "merchant", imageName: "Arabia_Merchant_Lv" },
  "City_Arabia|premiumMerchant": { registryKey: "arabia_luxurious_merchant", id: "arabia-luxurious-merchant", category: "arabia", subcategory: "merchant", imageName: "Arabia_Luxurious_Merchant_Lv" },
  "City_Arabia|carpetFactory": { registryKey: "arabia_carpet_factory", id: "arabia-carpet-factory", category: "arabia", subcategory: "workshops", imageName: "Arabia_Carpet_Factory" },
  "City_Arabia|coffeeBrewer": { registryKey: "arabia_coffee_brewer", id: "arabia-coffee-brewer", category: "arabia", subcategory: "workshops", imageName: "Arabia_Coffee_Brewer" },
  "City_Arabia|incenseMaker": { registryKey: "arabia_incense_maker", id: "arabia-incense-maker", category: "arabia", subcategory: "workshops", imageName: "Arabia_Incense_Maker" },
  "City_Arabia|premiumWorkshop": { registryKey: "arabia_luxurious_workshop", id: "arabia-luxurious-workshop", category: "arabia", subcategory: "workshops", imageName: "Arabia_Luxurious_Workshop_Lv" },
  "City_Arabia|oilLampCrafter": { registryKey: "arabia_oil_lamp_crafter", id: "arabia-oil-lamp-crafter", category: "arabia", subcategory: "workshops", imageName: "Arabia_Oil_Lamp_Crafter" },
};

// ─── Vocabulaire de bonus (partagé avec Wonders et Technologies) ──────────────
//
// `resolvers/bonus.ts` est le dictionnaire unique des clés de bonus. Rien n'est
// redéclaré ici. Les projections ci-dessous reprennent trait pour trait celles
// de scripts/extract/wonders.ts (`projectResourceBoost`, `projectUnitStatBoost`,
// `projectBuildingBoost`, `projectGrantWorker`) : même nom, même format, même
// traitement du `scope`.
//
// Ce que ce domaine apporte de NEUF n'est PAS ajouté au dictionnaire : chaque
// cas sans équivalent produit un `BuildingBonusGap` (type proposé + raison),
// pour validation avant adoption. Voir `KNOWN_BONUS_TYPES` ci-dessous.

/**
 * Clés de `BONUS_LABELS` (resolvers/bonus.ts), recopiées ici parce que
 * l'extracteur tourne hors bundler et ne peut pas importer un module `@/`.
 *
 * ⚠️ Cette liste ne DÉFINIT rien : elle sert uniquement à décider si un type
 * projeté est déjà connu ou doit être signalé. Le test généré vérifie qu'elle
 * n'a pas divergé du dictionnaire réel.
 */
const KNOWN_BONUS_TYPES = new Set([
  "coins_production",
  "food_production",
  "goods_production",
  // Sorties de production absolues — adoptées après arbitrage : `*_production`
  // est un boost en pourcent, `*_output` EST la quantité produite par cycle.
  "coins_output",
  "food_output",
  "goods_output",
  "allied_currency_output",
  // 5ᵉ famille `*_output`, adoptée avec le domaine Heritage Vault : une QUANTITÉ
  // de points de recherche par cycle, distincte de `rp_per_day` (un boost en
  // pourcent) et de `research_point_cap` (un plafond).
  "research_points_output",
  "goods_quantity",
  "previous_era_goods_quantity",
  "rp_per_day",
  // Adoptées avec le domaine Heritage Vault. Les 2 occurrences vikings de ce
  // domaine (`buildingType` = home / beehive) cessent donc d'être proposées.
  "building_type_production",
  "research_point_cap",
  "research_regen_boost",
  // Culture — le trou que ce domaine proposait 135 fois est refermé par
  // l'adoption faite avec le Heritage Vault.
  "culture_points",
  "culture_range",
  // Plafond et vitesse de régénération d'une ressource à jauge, ressource portée
  // par `BuildingBonus.resource`. À ne pas confondre avec les deux clés
  // ci-dessus, qui nomment les points de recherche.
  "regeneration_cap",
  "regeneration_speed",
  "chest_drop_chance",
  "worker_slots",
  "trade_worker_slots",
  "arabia_worker_slots",
  "compass_slots",
  "infantry_damage",
  "ranged_damage",
  "cavalry_damage",
  "heavy_infantry_damage",
  "siege_damage",
  "army_damage",
  "infantry_hp",
  "ranged_hp",
  "cavalry_hp",
  "heavy_infantry_hp",
  "bastion_hp",
  "siege_hp",
  "army_hp",
  "infantry_critical_hit_chance",
  "heavy_infantry_critical_hit_chance",
  "ranged_critical_hit_boost",
  // Distinct de `ranged_critical_hit_boost` (fréquence du critique) : ici les
  // DÉGÂTS du critique, `UnitStat_CriticalHitDamage`. Deux stats du jeu, deux clés.
  "ranged_critical_hit_damage",
  // Les 4 autres types d'unité sur `UnitStat_CriticalHitDamage`, adoptés avec le
  // Heritage Vault (World Fair les porte tous les cinq).
  "infantry_critical_hit_damage",
  "heavy_infantry_critical_hit_damage",
  "cavalry_critical_hit_damage",
  "siege_critical_hit_damage",
  "cavalry_hit_rate",
  "recruitment_time_reduction",
  "heavy_infantry_recruitment_time_reduction",
  "carcassonne_recruitment_time_reduction",
  "donation_gears",
  "trade_bonus",
  "trade_slot_cooldown_reduction",
  "bazaar_offer_boost",
]);

/** Segment snake_case par `statDefinitionId` — identique à wonders. */
const STAT_KEY: Record<string, string> = {
  UnitStat_Damage: "damage",
  UnitStat_HitPoints: "hp",
  UnitStat_CriticalHitChance: "critical_hit_chance",
  UnitStat_HitRate: "hit_rate",
  UnitStat_MovementSpeed: "movement_speed",
  // Absent de wonders (aucun wonder ne porte ce stat), mais la clé produite
  // — `ranged_critical_hit_damage` — est désormais au dictionnaire partagé.
  UnitStat_CriticalHitDamage: "critical_hit_damage",
};

/** Segment snake_case par `unitType` — identique à wonders, plus `siege`. */
const UNIT_KEY: Record<string, string> = {
  infantry: "infantry",
  ranged: "ranged",
  cavalry: "cavalry",
  heavyInfantry: "heavy_infantry",
  bastion: "bastion",
  // ⚠️ Absent de wonders. Voir `bonusGaps`.
  siege: "siege",
};

/** Alias de clé — identique à wonders. */
const BONUS_TYPE_ALIAS: Record<string, string> = {
  ranged_critical_hit_chance: "ranged_critical_hit_boost",
};

/** Cités dont le `GrantWorkerComponentDTO` par défaut a une clé propre (wonders). */
const ARABIA_CITY = "City_Arabia";

/**
 * Ouvriers spécialisés que le vocabulaire ne nomme pas encore. Le nom proposé
 * suit la forme existante (`trade_worker_slots`, `arabia_worker_slots`).
 */
const WORKER_TYPE_PROPOSAL: Record<string, string> = {
  WorkerType_SAILOR_VIKINGS: "vikings_sailor_slots",
  WorkerType_PRIEST_MAYA: "maya_priest_slots",
  WorkerType_SEAFARER: "seafarer_slots",
};

/**
 * Familles de production absolue. `producedResources[]` donne un MONTANT par
 * cycle, pas un pourcentage : ce n'est pas la même grandeur que
 * `coins_production` (un boost en %), et réutiliser la clé changerait l'unité
 * affichée. D'où des noms distincts, désormais au dictionnaire partagé.
 */
const OUTPUT_TYPE_BY_RESOURCE: Record<string, string> = {
  coins: "coins_output",
  food: "food_output",
  research_points: "research_points_output",
};

/** Monnaies de cité alliée : une seule famille proposée, la ressource est portée à part. */
const ALLIED_CURRENCIES = new Set([
  "asper",
  "deben",
  "wu_zhu",
  "rice",
  "cocoa",
  "pennies",
  "dirham",
]);

// ─── Index du game design ─────────────────────────────────────────────────────

interface SourceIndex {
  byId: Map<string, JsonObject>;
  byType: Map<string, JsonObject[]>;
  loca: Map<string, string>;
  gameDesignChecksum: string | null;
  locaChecksum: string | null;
  locale: string | null;
}

function loadSource(root: string): SourceIndex {
  const gdPath = path.join(root, "source", "gamedesign.json");
  const locaPath = path.join(root, "source", "loca.json");
  for (const p of [gdPath, locaPath]) {
    if (!fs.existsSync(p)) {
      throw new Error(`Source introuvable : ${p} (lancer la commande depuis la racine du dépôt)`);
    }
  }

  const gdRoot = asObject(JSON.parse(fs.readFileSync(gdPath, "utf8")) as Json);
  const gdEnvelope = asObject(asArray(gdRoot.content)[0]);
  const entities = asArray(gdEnvelope.content).filter(isObject);

  const byId = new Map<string, JsonObject>();
  const byType = new Map<string, JsonObject[]>();
  for (const entity of entities) {
    const id = asString(entity.id);
    if (id !== null && !byId.has(id)) byId.set(id, entity);
    const type = shortType(entity);
    const bucket = byType.get(type);
    if (bucket) bucket.push(entity);
    else byType.set(type, [entity]);
  }

  const locaRoot = asObject(JSON.parse(fs.readFileSync(locaPath, "utf8")) as Json);
  const locaEnvelope = asObject(asArray(locaRoot.content)[0]);
  const loca = new Map<string, string>();
  for (const entry of asArray(locaEnvelope.translations)) {
    const key = asString(asObject(entry).key);
    const value = asString(asArray(asObject(entry).values)[0]);
    if (key !== null && value !== null) loca.set(key, value);
  }

  return {
    byId,
    byType,
    loca,
    gameDesignChecksum: asString(gdEnvelope.checksum),
    locaChecksum: asString(locaEnvelope.checksum),
    locale: asString(locaEnvelope.locale),
  };
}

/** C7 : une clé sans traduction est un libellé absent, pas une erreur. */
function translate(src: SourceIndex, key: string): string {
  return src.loca.get(key) ?? "";
}

// ─── Limites de construction ──────────────────────────────────────────────────
//
// `max_qty` n'est PAS un champ de bâtiment. Il se reconstitue en cumulant les
// `IncreaseBuildingLimitRewardDTO` accordés par les technologies, âge après âge :
// la limite d'un groupe à l'ère E est la somme des `amount` de toutes les
// technologies d'âge ≤ E. Vérifié sur `City_Capital|smallHome`, dont le cumul
// donne 7 / 12 / 14 / 18 … / 31, exactement les paliers attendus.
//
// C'est la seule source de limites du game design : les 499 récompenses de ce
// type sont toutes portées par une `TechnologyDefinitionDTO`, aucune autre
// entité n'en émet. `CityInitDefinitionDTO` n'y contribue pas non plus — il ne
// pose que des expansions et des ressources de départ, jamais de bâtiment.
//
// ⚠️ DÉCISION ASSUMÉE — 46 niveaux n'ont AUCUNE limite dans le game design :
// les 9 ateliers de la capitale, `harbor_large_warehouse`,
// `harbor_luxurious_seafarer_house` et `ottoman_empire_ship`. Ce n'est pas une
// lacune d'extraction à combler : le jeu ne déclare pas de plafond pour eux.
// `WORKSHOP_MAX_QTY` (data/config.ts) reste la SOURCE MANUELLE PARALLÈLE de ces
// quantités, relevée en jeu. `maxQty` vaut donc `null` ici, et la projection
// n'écrit pas de `max_qty` — l'app retombe sur sa résolution habituelle
// (`WORKSHOP_MAX_QTY`, puis `DEFAULT_MAX_QTY`). Ne pas inventer de valeur.

/** `${city}|${group}` → limite cumulée, indexée par rang d'âge. */
type LimitIndex = Map<string, number[]>;

function buildLimitIndex(src: SourceIndex, warnings: string[]): LimitIndex {
  const perAge = new Map<string, number[]>();
  for (const technology of src.byType.get("TechnologyDefinitionDTO") ?? []) {
    const age = asString(technology.age);
    const ageIndex = age === null ? undefined : AGE_INDEX.get(age);
    if (ageIndex === undefined) {
      warnings.push(`Technologie d'âge inconnu, limites ignorées : ${asString(technology.id)}`);
      continue;
    }
    for (const component of asArray(technology.components)) {
      for (const raw of asArray(asObject(asObject(component).finish).rewards)) {
        const reward = asObject(raw);
        if (shortType(reward) !== "IncreaseBuildingLimitRewardDTO") continue;
        const cities = asArray(reward.cities)
          .map(asString)
          .filter((c): c is string => c !== null);
        if (cities.length === 0) {
          warnings.push(`Limite sans cité sur ${asString(technology.id)} — non rattachable`);
          continue;
        }
        for (const limit of asArray(reward.limitsByGroup)) {
          const group = asString(asObject(limit).group);
          const amount = asNumber(asObject(limit).amount);
          if (group === null || amount === null) continue;
          for (const city of cities) {
            const key = `${city}|${group}`;
            const row = perAge.get(key) ?? new Array<number>(AGES.length).fill(0);
            row[ageIndex] += amount;
            perAge.set(key, row);
          }
        }
      }
    }
  }

  const cumulative: LimitIndex = new Map();
  for (const [key, row] of perAge) {
    let running = 0;
    cumulative.set(
      key,
      row.map((delta) => {
        running += delta;
        return running;
      }),
    );
  }
  return cumulative;
}

// ─── Courbes dynamiques (niveau runtime des `evolving`) ───────────────────────

/** Un `then` vide n'est pas 0 : c'est « pas de bonus » → `null`. */
function payloadValue(then: Json): number | null {
  const o = asObject(then);
  for (const key of ["value", "factor", "modifier", "amount"]) {
    if (key in o) return asNumber(o[key]);
  }
  return null;
}

/** Le `mapping` d'une définition dynamique est tantôt un objet, tantôt un tableau. */
function firstMapping(definition: JsonObject): JsonObject {
  const mapping = definition.mapping;
  return Array.isArray(mapping) ? asObject(mapping[0]) : asObject(mapping);
}

/** Lecture par palier (C9) : valeur en `k` = entrée de plus grand `when` ≤ `k`. */
function resolveByStep(steps: BuildingCurveStep[], keys: number[]): (number | null)[] {
  const sorted = [...steps].sort((a, b) => a.when - b.when);
  return keys.map((key) => {
    let current: number | null = null;
    let found = false;
    for (const step of sorted) {
      if (step.when > key) break;
      current = step.value;
      found = true;
    }
    return found ? current : null;
  });
}

/**
 * Assemble une courbe par niveau à partir de ses trois sources possibles.
 *
 * Articulation table / formule : la table fait autorité sur sa plage, la formule
 * prend le relais au-delà du dernier `when` (02-dynamic.md §5.1). En dessous du
 * premier `when`, aucun palier n'est applicable — `null`, pas d'extrapolation (D13).
 */
function assembleCurve(
  definitionId: string,
  modifier: number | null,
  maxLevel: number,
  table: BuildingCurveStep[],
  formula: string | null,
  valueLimit: number | null,
  luaScript: string | null,
  flooredFormula = false,
): BuildingCurve {
  const keys = Array.from({ length: maxLevel }, (_, i) => i + 1);
  const stepped = resolveByStep(table, keys);
  const lastWhen = table.length === 0 ? null : Math.max(...table.map((s) => s.when));

  const resolved = keys.map((level, i) => {
    if (luaScript !== null) return round(evaluateLuaFormula(luaScript, { entityLevel: level }));
    if (formula !== null && (lastWhen === null || level > lastWhen)) {
      return round(evaluateCurveFormula(formula, { level }));
    }
    return stepped[i];
  });
  const effective = resolved.map((v, i) => {
    if (v === null) return null;
    const scaled = modifier === null ? v : modifier * v;
    // ⚠️ AU-DELÀ DU DERNIER PALIER TABULÉ, LA FORMULE LIVRE UNE QUANTITÉ
    // RÉELLE, PAS UNE ESPÉRANCE — voir `flooredFormula` sur `buildCurve`. Sur
    // l'`effective` (APRÈS `modifier`), pas sur `resolved` : le barème de
    // montée porte `modifier: -1` (la formule écrit un coût négatif, `resolved`
    // en garde le signe brut), et flooer AVANT ce signe inverserait le sens —
    // `Math.floor(-11.8) × -1` rend 12, jamais les 11 tronqués attendus.
    //
    // ⚠️ NETTOYER AVANT DE FLOORER. `8.2 - 3.2` vaut `4.999999999999999` en
    // flottant IEEE 754 — `Math.floor` de cette valeur BRUTE rend 4 au lieu de
    // 5 pile sur les niveaux de transition (41, 46, 51…), l'inverse de ce que
    // `round()` corrige d'ordinaire pour l'affichage.
    const isFormulaContinuation =
      formula !== null && (lastWhen === null || keys[i] > lastWhen);
    const cleaned = round(scaled);
    return flooredFormula && isFormulaContinuation ? Math.floor(cleaned) : cleaned;
  });

  return {
    indexedBy: "buildingLevel",
    definitionId,
    modifier,
    table,
    formula,
    valueLimit,
    luaScript,
    resolved,
    effective,
  };
}

/** Les lignes `{ when, then }` d'un mapping par niveau, `then` lu par `read`. */
function levelSteps(mapping: JsonObject, read: (then: JsonObject) => number | null): BuildingCurveStep[] {
  const table: BuildingCurveStep[] = [];
  for (const row of asArray(mapping.values)) {
    const when = asNumber(asObject(row).when);
    if (when === null) continue;
    table.push({ when, value: read(asObject(asObject(row).then)) });
  }
  return table;
}

/**
 * Construit une courbe indexée par le niveau runtime du bâtiment.
 *
 * Seul `BuildingLevelDynamicChangeDTO` est traité ici ; l'axe des âges passe par
 * `buildAgeCurve()`.
 *
 * ⚠️ `read === actionAmount` FAIT FLOORER LA FORMULE DE CONTINUATION.
 * `actionAmount` lit une quantité RÉELLEMENT LIVRÉE (`ActionChangeDTO` —
 * production, coût de montée) : au-delà du dernier palier tabulé, sa formule
 * n'a pas de raison de rendre un entier (`(#level / 5) - 3.2` vaut 5,2 au
 * niveau 42), mais le jeu ne livre jamais une fraction d'unité — vérifié en
 * jeu sur le Celtic Broch, dont le wiki (riseofcultures.wiki.gg) documente un
 * PALIER PAR TRANCHE DE 5 NIVEAUX (41-45 → 5 PR, 46-50 → 6, 51-55 → 7,
 * 56-60 → 8), exactement `Math.floor` de la formule brute — jamais les
 * 5,0/5,2/5,4… continus qu'elle rendrait sans ce plancher. Les PALIERS TABULÉS
 * eux-mêmes (`table`, en dessous du dernier `when`) ne passent PAS par cette
 * formule et gardent leur décimale : un coffre à tirage (`expectedChestValue`)
 * rend une ESPÉRANCE statistique, jamais une livraison unique — la seule
 * chose que la Q42-là ne délivre jamais en une fois, contrairement à la
 * quantité fixe post-palier.
 */
function buildCurve(
  mapping: JsonObject,
  definitionId: string,
  modifier: number | null,
  maxLevel: number,
  read: (then: JsonObject) => number | null = payloadValue,
): BuildingCurve | null {
  if (shortType(mapping) !== "BuildingLevelDynamicChangeDTO") return null;

  const table = levelSteps(mapping, read);
  const formulaCase = asObject(mapping.dynamicFormulaChangeCase);
  const formula = asString(formulaCase.formula);
  if (table.length === 0 && formula === null) return null;

  return assembleCurve(
    definitionId,
    modifier,
    maxLevel,
    table,
    formula,
    asNumber(formulaCase.valueLimit),
    null,
    read === actionAmount,
  );
}

/**
 * Un script Lua dont `entityLevel` est la seule variable — les autres n'ont pas
 * de convention établie ici, et sont signalées plutôt qu'inventées.
 */
function levelOnlyLuaScript(
  src: SourceIndex,
  definitionId: string,
  warnings: string[],
): string | null {
  const definition = src.byId.get(definitionId);
  const script = definition === undefined ? null : asString(definition.luaScript);
  if (script === null) {
    warnings.push(`Script Lua introuvable : ${definitionId}`);
    return null;
  }
  const foreign = collectLuaVariables(script).filter((name) => name !== "entityLevel");
  if (foreign.length > 0) {
    warnings.push(`Script Lua non résolu : ${definitionId} lit ${foreign.join(", ")}`);
    return null;
  }
  return script;
}

/** Courbe d'un script Lua balayé sur l'axe du niveau RUNTIME (`evolving` seuls). */
function luaCurve(
  src: SourceIndex,
  definitionId: string,
  maxLevel: number,
  warnings: string[],
): BuildingCurve | null {
  const script = levelOnlyLuaScript(src, definitionId, warnings);
  if (script === null) return null;
  return assembleCurve(definitionId, null, maxLevel, [], null, null, script);
}

/**
 * Valeur d'un script Lua pour UN niveau — le cas des chaînes sans niveau
 * runtime, où `entityLevel` est le niveau déclaré du maillon (même convention
 * que `resolveDynamicAmount()` côté coûts).
 */
function luaValueAt(
  src: SourceIndex,
  definitionId: string,
  entityLevel: number | null,
  warnings: string[],
): number | null {
  const script = levelOnlyLuaScript(src, definitionId, warnings);
  if (script === null) return null;
  if (entityLevel === null) {
    warnings.push(`Script Lua non résolu : ${definitionId} — niveau du maillon inconnu`);
    return null;
  }
  return round(evaluateLuaFormula(script, { entityLevel }));
}

/**
 * Un montant écrit en Lua : courbe quand un axe de niveau runtime existe,
 * valeur unique sinon.
 */
function luaAmount(
  ctx: BonusContext,
  definitionId: string,
): { value: number | null; curve: BuildingCurve | null } {
  if (ctx.curveLength > 1) {
    return { value: null, curve: luaCurve(ctx.src, definitionId, ctx.curveLength, ctx.warnings) };
  }
  return {
    value: luaValueAt(ctx.src, definitionId, ctx.entityLevel, ctx.warnings),
    curve: null,
  };
}

function curveFromDefinition(
  src: SourceIndex,
  definitionId: string | null,
  modifier: number | null,
  maxLevel: number,
): BuildingCurve | null {
  if (definitionId === null) return null;
  const definition = src.byId.get(definitionId);
  if (definition === undefined) return null;
  return buildCurve(firstMapping(definition), definitionId, modifier, maxLevel);
}

// ─── Axe des âges (production et culture des `evolving`) ─────────────────────
//
// 02-dynamic.md §2 : un `BuildingAgeDynamicChangeDTO` ne porte pas de valeur, il
// renvoie vers une table PAR NIVEAU, une par âge. L'âge d'un `evolving` étant
// propre à chaque instance, l'extraction garde les deux axes et ne résout jamais
// vers un nombre unique.

/**
 * Une feuille de tirage pondérée : `weight` est déjà la probabilité ABSOLUE
 * (pas le poids brut du game design) de tomber sur `amount` unités de
 * `resource` — le produit des chances de chaque conteneur traversé pour
 * l'atteindre. Voir `chestLeaves`.
 */
interface ChestLeaf {
  resource: string;
  amount: number;
  weight: number;
}

/**
 * Descend un nœud de récompense (`then.rewards[]`, éventuellement encore
 * emballé dans un `RewardDefinitionDTO`) jusqu'à ses feuilles `ResourceRewardDTO`,
 * en pondérant chacune par les `chances` de tout `MysteryChestRewardDTO`
 * traversé en chemin.
 *
 * `null` dès que la donnée sort de ce cas simple : un `chances`/`rewards` de
 * longueur différente ou une chance manquante (donnée incohérente), ou tout
 * type de feuille qui n'est PAS un `ResourceRewardDTO` (relique, ticket, kit
 * d'inventaire, pièce de bâtiment…) — un lot de ce genre n'a pas de
 * « montant » à faire remonter en espérance, et rester `null` laisse
 * `actionAmount`/`actionResourceDescriptors` hors de ce cas, exactement comme
 * avant cette fonction (§7/§8 de `03-batiments.md`, toujours hors scope pour
 * eux).
 */
function chestLeaves(node: JsonObject, weight: number): ChestLeaf[] | null {
  const type = shortType(node);
  if (type === "RewardDefinitionDTO") {
    const children = asArray(node.rewards).map(asObject);
    if (children.length !== 1) return null;
    return chestLeaves(children[0], weight);
  }
  if (type === "ResourceRewardDTO") {
    const resource = asString(node.resource);
    const amount = asNumber(node.amount);
    return resource === null || amount === null ? null : [{ resource, amount, weight }];
  }
  if (type === "MysteryChestRewardDTO") {
    const children = asArray(node.rewards).map(asObject);
    const chances = asArray(node.chances).map(asNumber);
    if (children.length === 0 || children.length !== chances.length) return null;
    const total = chances.reduce((sum: number, c) => sum + (c ?? 0), 0);
    if (total <= 0) return null;
    const leaves: ChestLeaf[] = [];
    for (const [i, child] of children.entries()) {
      const chance = chances[i];
      if (chance === null) return null;
      const sub = chestLeaves(child, weight * (chance / total));
      if (sub === null) return null;
      leaves.push(...sub);
    }
    return leaves;
  }
  return null;
}

/**
 * La ressource UNIQUE versée par un tirage pondéré (`then.rewards[]`), quand
 * tout le tirage ne verse que cette ressource — plusieurs ressources
 * mélangées (ou un tirage hors scope, cf. `chestLeaves`) rendent `null`, la
 * clé de la ressource sinon.
 */
function chestResource(then: JsonObject): string | null {
  for (const raw of asArray(then.rewards)) {
    const leaves = chestLeaves(asObject(raw), 1);
    if (leaves === null || leaves.length === 0) continue;
    const resources = new Set(leaves.map((leaf) => leaf.resource));
    if (resources.size === 1) return [...resources][0];
  }
  return null;
}

/**
 * ⚠️ VALEUR ATTENDUE D'UN TIRAGE — CONVENTION DU WIKI, PAS UNE LIVRAISON RÉELLE.
 *
 * En dessous d'un certain niveau, plusieurs `evolving` ne versent pas un
 * montant de points de recherche fixe mais un COFFRE (`RewardDefinitionDTO` →
 * `MysteryChestRewardDTO`) qui tire au sort entre plusieurs montants —
 * `Dac_..._CelticBroch_1_RP_Chest`, palier 4 : 80 % de chances de 1 PR, 20 %
 * de 2 PR. Le jeu ne verse donc JAMAIS 1,2 PR en une fois ; c'est la moyenne
 * pondérée sur un grand nombre de tirages, exactement la présentation que le
 * wiki (riseofcultures.wiki.gg) donne pour ces mêmes paliers — vérifié
 * palier par palier contre les poids ci-dessus (1,2 / 1,4 / 1,6 / 1,8 / 2,0 /
 * 2,2 / 2,35 / 2,6 / 2,9 / 2,95 / 3,2 / 3,6 pour le Celtic Broch, paliers 4 à
 * 40, chacun recalculé depuis `source/gamedesign.json` plutôt que recopié).
 *
 * `CHEST_EXPECTED_VALUE_TYPES` (`components/heritage/effect-display.ts`)
 * affiche déjà ce genre de décimale sans l'arrondir à l'entier pour
 * `research_points_output` — cette fonction n'a donc qu'à rendre la bonne
 * valeur, l'affichage suit sans changement.
 *
 * `null` (tirage hors scope, ressources mélangées) laisse `actionAmount`
 * rendre `null` comme avant — la table continue de n'être qu'un « arbre de
 * récompense » pour ce palier, faute de mieux.
 */
function expectedChestValue(then: JsonObject): number | null {
  for (const raw of asArray(then.rewards)) {
    const leaves = chestLeaves(asObject(raw), 1);
    if (leaves === null || leaves.length === 0) continue;
    if (new Set(leaves.map((leaf) => leaf.resource)).size !== 1) continue;
    return round(leaves.reduce((sum, leaf) => sum + leaf.amount * leaf.weight, 0));
  }
  return null;
}

/**
 * Désignation d'une ressource dans un `ActionChangeDTO` : soit un
 * `ResourceDefinition.id`, soit `Good1|Good2|Good3` pour un `GoodRewardDTO`, qui
 * nomme un RANG sans dater le bien, soit la ressource UNIQUE d'un tirage
 * pondéré (`chestResource` — cf. `expectedChestValue`).
 */
function actionResourceDescriptors(payload: JsonObject): string[] {
  const descriptors: string[] = [];
  for (const change of asArray(payload.resourceChanges)) {
    const id = asString(asObject(change).definitionId);
    if (id !== null) descriptors.push(id);
  }
  for (const reward of asArray(payload.rewards)) {
    const object = asObject(reward);
    if (shortType(object) !== "GoodRewardDTO") continue;
    const number = asNumber(object.number);
    if (number !== null) descriptors.push(`Good${number}`);
  }
  const chest = chestResource(payload);
  if (chest !== null) descriptors.push(chest);
  return descriptors;
}

/**
 * Montant d'une ligne d'`ActionChangeDTO`.
 *
 * Une ligne peut lister plusieurs ressources ; leurs montants sont alors
 * identiques (vérifié sur les 874 lignes multi-ressources des `evolving`, zéro
 * hétérogène). Un seul nombre suffit donc à décrire la ligne.
 *
 * En dernier recours, la valeur ATTENDUE d'un tirage pondéré — voir
 * `expectedChestValue`.
 */
function actionAmount(then: JsonObject): number | null {
  for (const change of asArray(then.resourceChanges)) {
    const amount = asNumber(asObject(change).amount);
    if (amount !== null) return amount;
  }
  for (const reward of asArray(then.rewards)) {
    const object = asObject(reward);
    if (shortType(object) !== "GoodRewardDTO") continue;
    const amount = asNumber(object.amount);
    if (amount !== null) return amount;
  }
  return expectedChestValue(then);
}

/**
 * Ressources d'une table par niveau, table et formule réunies.
 *
 * ⚠️ Les deux ne coïncident pas toujours : 7 tables ne tabulent qu'un arbre de
 * récompense (hors scope, §7) alors que leur formule verse des `research_points`
 * au-delà du dernier palier.
 */
function levelResourceDescriptors(mapping: JsonObject): string[] {
  const descriptors = new Set<string>();
  for (const row of asArray(mapping.values)) {
    for (const d of actionResourceDescriptors(asObject(asObject(row).then))) descriptors.add(d);
  }
  for (const d of actionResourceDescriptors(asObject(mapping.dynamicFormulaChangeCase))) {
    descriptors.add(d);
  }
  return [...descriptors];
}

/** Comment lire un `then` d'âge et les feuilles qu'il désigne. */
interface AgeAxisReader {
  leafIds: (then: JsonObject) => string[];
  value: (then: JsonObject) => number | null;
  resources: (mapping: JsonObject) => string[];
}

const ACTION_AXIS: AgeAxisReader = {
  leafIds: (then) =>
    asArray(then.dynamicChangeDefinitionId)
      .map(asString)
      .filter((id): id is string => id !== null),
  value: actionAmount,
  resources: levelResourceDescriptors,
};

const VALUE_AXIS: AgeAxisReader = {
  leafIds: (then) => {
    const id = asString(then.dynamicValueDefinitionId);
    return id === null ? [] : [id];
  },
  value: payloadValue,
  resources: () => [],
};

/** Les âges projet gouvernés par `age`, jusqu'au palier suivant exclu (C9). */
function agesGovernedBy(age: string, nextAge: string | null): string[] {
  const from = AGE_INDEX.get(age);
  if (from === undefined) return [age];
  const to = nextAge === null ? AGES.length : (AGE_INDEX.get(nextAge) ?? AGES.length);
  return AGES.slice(from, to).map((a) => a.age);
}

function buildAgeCurve(
  src: SourceIndex,
  definitionId: string,
  maxLevel: number,
  reader: AgeAxisReader,
  warnings: string[],
): BuildingAgeCurve | null {
  const definition = src.byId.get(definitionId);
  if (definition === undefined) {
    warnings.push(`Définition dynamique introuvable : ${definitionId}`);
    return null;
  }
  const mapping = firstMapping(definition);
  if (shortType(mapping) !== "BuildingAgeDynamicChangeDTO") return null;

  const declared: { age: string; leafId: string }[] = [];
  for (const row of asArray(mapping.values)) {
    const age = asString(asObject(row).when);
    if (age === null) continue;
    const leafIds = reader.leafIds(asObject(asObject(row).then));
    if (leafIds.length === 0) {
      warnings.push(`Âge ${age} sans feuille dans ${definitionId}`);
      continue;
    }
    if (leafIds.length > 1) {
      warnings.push(`Âge ${age} à ${leafIds.length} feuilles dans ${definitionId} — 1ʳᵉ retenue`);
    }
    declared.push({ age, leafId: leafIds[0] });
  }
  declared.sort((a, b) => (AGE_INDEX.get(a.age) ?? 0) - (AGE_INDEX.get(b.age) ?? 0));

  const entries: BuildingAgeCurveEntry[] = [];
  for (const [index, { age, leafId }] of declared.entries()) {
    const leaf = src.byId.get(leafId);
    if (leaf === undefined) {
      warnings.push(`Feuille d'âge introuvable : ${leafId} (${definitionId})`);
      continue;
    }
    const leafMapping = firstMapping(leaf);
    const curve = buildCurve(leafMapping, leafId, null, maxLevel, reader.value);
    if (curve === null) continue;
    entries.push({
      age,
      appliesTo: agesGovernedBy(age, declared[index + 1]?.age ?? null),
      resources: reader.resources(leafMapping).map((d) => projectProducedResource(d).key),
      curve,
    });
  }
  return entries.length === 0 ? null : { indexedBy: "buildingAge", definitionId, entries };
}

/**
 * Ressources versées par un `producedDynamicActionChangeDefinitionId`, quel que
 * soit son axe. Les feuilles d'un même DAC versent toutes la même famille
 * (vérifié sur les 62 des `evolving`) : la première suffit à typer le bonus.
 *
 * Un tableau vide signifie « rien de nommé » : la table ne tabule qu'un arbre de
 * récompense, hors scope (02-dynamic.md §7).
 */
function producedDescriptors(src: SourceIndex, definitionId: string): string[] {
  const definition = src.byId.get(definitionId);
  if (definition === undefined) return [];
  const mapping = firstMapping(definition);
  if (shortType(mapping) !== "BuildingAgeDynamicChangeDTO") {
    return levelResourceDescriptors(mapping);
  }
  for (const row of asArray(mapping.values)) {
    const [leafId] = ACTION_AXIS.leafIds(asObject(asObject(row).then));
    const leaf = leafId === undefined ? undefined : src.byId.get(leafId);
    if (leaf !== undefined) return levelResourceDescriptors(firstMapping(leaf));
  }
  return [];
}

// ─── Projection des bonus ─────────────────────────────────────────────────────

interface Projection {
  type: string;
  format: BuildingBonusFormat;
  scope: BuildingBonusScope | null;
  /** Facteur appliqué à la valeur brute — 100 pour passer d'un ratio à un %. */
  scale: number;
  resource: string | null;
  /**
   * ⚠️ LA VALEUR BRUTE EST UNE DURÉE RESTANTE, PAS UN GAIN — voir
   * `invertDurationCurve`.
   */
  invertsDuration?: boolean;
}

/**
 * ⚠️ PROJECTION : « il reste 55 % du temps » → « +45 % de vitesse ».
 *
 * MESURÉ EN JEU, pas déduit. Le Treasure Wreck au niveau 60 porte la valeur
 * brute 0,55, et le jeu affiche « Accélère le temps de régénération de Tentative
 * de 45,0 % ». La loca le confirme sur la forme
 * (`Base.WondersReworkUpgradePanel.RegenerationTimeBoostBonusDescription` :
 * « Speeds up regeneration time for {0} by {1} »), et le barème entier s'aligne :
 * 0,98 au niveau 1 → 2 %, exactement ce que le jeu annonce.
 *
 * ⚠️ POURQUOI ICI, ET PAS À L'AFFICHAGE. La valeur passe par l'amplificateur du
 * gardien AVANT d'être affichée, et l'amplification porte sur le GAIN : au rang
 * 25, le vault ATH niveau 30 rend 0,305 × 1,25, jamais 0,695 × 1,25. Convertir
 * en aval de l'amplification donnerait un chiffre faux ; convertir en amont
 * obligerait chaque consommateur — resolver, affichage, futur cumul de l'onglet
 * Combination — à connaître le cas particulier et à ne pas l'oublier. Une seule
 * conversion, dans la seule couche qui projette déjà (`effective` porte déjà
 * `modifier × resolved`, cf. la convention (a) de `resolvers/bonus.ts`).
 *
 * ⚠️ SEUL `effective` EST CONVERTI. `table`, `resolved`, `formula` et `luaScript`
 * restent la donnée du jeu, mot pour mot : c'est ce qui permet à `pnpm
 * diff:buildings` de comparer à la source, et `effective` est déjà documenté
 * comme LA valeur à lire.
 *
 * Après conversion, `regeneration_speed` se lit comme `recruitment_time_reduction`,
 * qui porte déjà un gain dans le game design — les deux familles de « réduction
 * de temps » cessent d'être stockées à l'envers l'une de l'autre.
 */
function invertDurationCurve(curve: BuildingCurve | null): BuildingCurve | null {
  if (curve === null) return null;
  return {
    ...curve,
    effective: curve.effective.map((value) => (value === null ? null : round(1 - value))),
  };
}

/**
 * Collecteur des types de bonus sans équivalent, agrégés PAR TYPE PROPOSÉ.
 *
 * L'agrégat porte sur `(proposedType, componentType)` et non sur le descripteur :
 * `goods_output` sur 60 ressources différentes est UNE décision de vocabulaire,
 * pas 60. Les descripteurs distincts sont conservés en échantillon, bornés, pour
 * que la décision se prenne sur pièces sans noyer la liste.
 */
class GapCollector {
  private readonly gaps = new Map<string, BuildingBonusGap>();
  private readonly samples = new Map<string, Set<string>>();

  /** Nombre de descripteurs distincts gardés par proposition. */
  private static readonly SAMPLE_LIMIT = 6;

  add(gap: Omit<BuildingBonusGap, "occurrences">): void {
    const key = `${gap.proposedType}|${gap.componentType}`;
    const existing = this.gaps.get(key);
    const seen = this.samples.get(key) ?? new Set<string>();
    this.samples.set(key, seen);
    if (existing === undefined) {
      this.gaps.set(key, { ...gap, occurrences: 1 });
      seen.add(gap.descriptor);
      return;
    }
    existing.occurrences += 1;
    if (!seen.has(gap.descriptor)) {
      seen.add(gap.descriptor);
      if (seen.size <= GapCollector.SAMPLE_LIMIT) {
        existing.descriptor = `${existing.descriptor} · ${gap.descriptor}`;
      } else if (seen.size === GapCollector.SAMPLE_LIMIT + 1) {
        existing.descriptor = `${existing.descriptor} · …`;
      }
    }
  }

  /** Un type déjà connu n'est jamais signalé, même si le chemin y mène pour la 1ʳᵉ fois. */
  note(projection: Projection, context: Omit<BuildingBonusGap, "occurrences" | "proposedType" | "proposedFormat">): void {
    if (KNOWN_BONUS_TYPES.has(projection.type)) return;
    this.add({ ...context, proposedType: projection.type, proposedFormat: projection.format });
  }

  list(): BuildingBonusGap[] {
    return [...this.gaps.values()].sort(
      (a, b) => b.occurrences - a.occurrences || a.proposedType.localeCompare(b.proposedType),
    );
  }
}

/**
 * Identifiant de ressource du game design → clé de ressource côté projet.
 * Repris tel quel de scripts/extract/technologies.ts.
 */
function toProjectResourceKey(definitionId: string): string {
  const dyn = /^DYN\|([A-Za-z]+)_(Good\d)$/.exec(definitionId);
  if (dyn !== null) {
    const abbr = ABBR_BY_AGE.get(dyn[1]);
    const rank = GOOD_RANK[dyn[2]];
    if (abbr === undefined || rank === undefined) {
      throw new Error(`Bien d'âge non projetable : ${definitionId} — compléter AGES / GOOD_RANK`);
    }
    return `${rank}_${abbr.toLowerCase()}`;
  }
  return RESOURCE_KEY_ALIAS[definitionId] ?? definitionId;
}

/**
 * `producedResources[]` → projection.
 *
 * `coins_production` et consorts sont des boosts en POURCENT
 * (`format: "percent"`, `scale: 100`) ; ici le game design donne un montant
 * ABSOLU par cycle. Arbitrage tranché : famille de clés distincte (`*_output`)
 * et format distinct (`absolute`), tous deux ajoutés au vocabulaire partagé de
 * `resolvers/bonus.ts`. Ce ne sont plus des propositions — d'où l'absence
 * d'entrée dans `bonusGaps`.
 *
 * `allied_currency_output` couvre les 7 monnaies de cité alliée d'une seule
 * clé : la monnaie exacte vit dans `BuildingBonus.resource`, pas dans le `type`.
 * Même arbitrage que `goods_production`, qui ne nomme pas le bien non plus.
 */
function projectProduction(definitionId: string): Projection {
  const resource = toProjectResourceKey(definitionId);
  const named = OUTPUT_TYPE_BY_RESOURCE[definitionId];
  if (named !== undefined) {
    return { type: named, format: "absolute", scope: null, scale: 1, resource };
  }
  if (ALLIED_CURRENCIES.has(definitionId)) {
    return { type: "allied_currency_output", format: "absolute", scope: null, scale: 1, resource };
  }
  return { type: "goods_output", format: "absolute", scope: null, scale: 1, resource };
}

/**
 * Un descripteur d'`actionResourceDescriptors()` → clé projet + projection.
 *
 * `Good1|2|3` vient d'un `GoodRewardDTO` : le game design ne date pas le bien,
 * la clé reste donc un RANG nu (`primary`) là où un `DYN|<Age>_GoodN` donne un
 * rang daté (`primary_cg`).
 */
function projectProducedResource(descriptor: string): { key: string; projection: Projection } {
  const rank = GOOD_RANK[descriptor];
  if (rank !== undefined) {
    return {
      key: rank,
      projection: { type: "goods_output", format: "absolute", scope: null, scale: 1, resource: rank },
    };
  }
  const projection = projectProduction(descriptor);
  return { key: projection.resource ?? descriptor, projection };
}

/**
 * `GrantWorkerComponentDTO` → clé de bonus, à l'identique de `projectGrantWorker()`
 * côté wonders et de `projectWorkerReward()` côté technologies.
 *
 * `scope` reste `null` : la cité est celle du porteur, pas une restriction du
 * bonus, et lorsqu'elle discrimine (Arabie) elle est déjà encodée dans le `type`.
 */
function projectGrantWorker(workerType: string | null, city: string): Projection {
  if (workerType === "WorkerType_TRADING") {
    return { type: "trade_worker_slots", format: "integer", scope: null, scale: 1, resource: null };
  }
  const proposal = workerType === null ? undefined : WORKER_TYPE_PROPOSAL[workerType];
  if (proposal !== undefined) {
    return { type: proposal, format: "integer", scope: null, scale: 1, resource: null };
  }
  if (city === ARABIA_CITY) {
    return { type: "arabia_worker_slots", format: "integer", scope: null, scale: 1, resource: null };
  }
  return { type: "worker_slots", format: "integer", scope: null, scale: 1, resource: null };
}

/**
 * `BoostUnitStatComponentDTO` → clé de bonus, règle identique à
 * `projectUnitStatBoost()` côté wonders : `${unit}_${stat}`, `army_${stat}` sans
 * `unitType`, alias appliqué ensuite.
 */
/**
 * ⚠️ `unitDefinitionId` PRIME sur `unitType` pour le `scope` — même règle que
 * `projectUnitStatBoost()` côté heritage, sur les mêmes 2 boosts (Crocodile
 * Aztèque : `unitType: "cavalry"` la classe mécanique réelle, mais un
 * `unitDefinitionId` précis puisque le bâtiment ne produit QUE cette unité).
 */
function projectUnitStatBoost(
  unitType: string | null,
  statDefinitionId: string,
  unitDefinitionId: string | null,
): Projection | null {
  const stat = STAT_KEY[statDefinitionId];
  if (stat === undefined) return null;
  if (unitType === null) {
    const type = `army_${stat}`;
    return {
      type: BONUS_TYPE_ALIAS[type] ?? type,
      format: "percent",
      scope: null,
      scale: 100,
      resource: null,
    };
  }
  const unit = UNIT_KEY[unitType];
  if (unit === undefined) return null;
  const type = `${unit}_${stat}`;
  return {
    type: BONUS_TYPE_ALIAS[type] ?? type,
    format: "percent",
    scope:
      unitDefinitionId === null
        ? { kind: "unitType", value: unitType }
        : { kind: "unit", value: unitDefinitionId },
    scale: 100,
    resource: null,
  };
}

/**
 * `BoostResourceComponentDTO` → clé de bonus, règle identique à
 * `projectResourceBoost()` côté wonders.
 *
 * ⚠️ Deux écarts de forme avec les wonders, tous deux propres à ce domaine :
 *  - `resourceType` vaut ici `"resource.good"` là où les wonders écrivent
 *    `"good"` ; le préfixe est retiré avant comparaison (C6 : deux espaces de
 *    nommage cohabitent dans le game design).
 *  - `buildingType` (2 occurrences, vikings) n'existe pas côté wonders : il ne
 *    nomme aucune ressource, donc aucune clé existante ne s'applique.
 */
function projectResourceBoost(
  resourceDefinitionId: string | null,
  resourceType: string | null,
  buildingGroup: string | null,
  buildingType: string | null,
  cities: string[],
): Projection | null {
  const scope: BuildingBonusScope | null =
    cities.length === 1
      ? { kind: "city", value: cities[0] }
      : buildingGroup !== null
        ? { kind: "buildingGroup", value: buildingGroup }
        : buildingType !== null
          ? { kind: "buildingType", value: buildingType }
          : null;

  if (resourceDefinitionId === "coins") {
    return { type: "coins_production", format: "percent", scope, scale: 100, resource: "coins" };
  }
  if (resourceDefinitionId === "food") {
    return { type: "food_production", format: "percent", scope, scale: 100, resource: "food" };
  }
  if (resourceDefinitionId === "research_points") {
    return { type: "research_regen_boost", format: "percent", scope, scale: 100, resource: "research_points" };
  }

  const normalizedType = resourceType === null ? null : resourceType.replace(/^resource\./, "");
  if (normalizedType === "good") {
    // ⚠️ DANS LA CAPITALE, UN BOOST DE BIENS *EST* LE « WORKSHOP PRODUCTION
    // BOOST » — la même clé que le bâtiment d'héritage, pas une clé voisine.
    //
    // Le game design écrit cette cible de DEUX façons, sans jamais dire qu'elles
    // se valent :
    //   - `buildingType: "workshop"`  → les 4 effets du Heritage Vault ;
    //   - `resourceType: "good"`      → la Hutte de Baba Yaga (Halloween), seule
    //     de tout le fichier à l'écrire `"resource.good"` (C6 : deux espaces de
    //     nommage cohabitent, d'où la normalisation ci-dessus).
    //
    // C'est la LOCA qui relie les deux, et elle est explicite :
    // `Base.BuildingTypes.Good` se traduit « Workshops » (son voisin
    // `Base.BuildingTypes.Food` dit « Farms »). Le jeu range donc un boost de
    // biens sous les ateliers, et l'écran affiche le même libellé pour les deux
    // porteurs.
    //
    // Conséquence VOULUE : les deux tombent sous la même clé, donc sous le même
    // `bonusKey`, donc l'onglet Combination les CUMULE. Les garder séparés
    // afficherait deux lignes identiques que rien n'additionnerait.
    //
    // ⚠️ RESTREINT À LA CAPITALE, et c'est le point qui empêche cette règle de
    // déborder. Une cité alliée produit ses biens dans des bâtiments qui ne sont
    // pas des `workshop` (mine d'or, papyrus, carrière…) : y affirmer « ateliers »
    // serait faux. Aucun cas de ce genre dans ce domaine aujourd'hui — les
    // boosts de biens hors capitale sont tous des merveilles (Petra, Tikal,
    // Cheops), extraites par scripts/extract/wonders.ts que ceci ne touche pas —
    // mais s'il en arrive un, il garde `goods_production` ci-dessous.
    //
    // ⚠️ HYPOTHÈSE À REVOIR À LA SORTIE DE L'ÉVÈNEMENT (Halloween). Baba Yaga
    // n'est pas encore jouable : cette équivalence est établie sur la loca, pas
    // sur un relevé en jeu. Si l'écran dit autre chose, c'est ICI qu'on
    // rebascule, et à un seul endroit.
    if (cities.length === 1 && cities[0] === "City_Capital") {
      return {
        type: "building_type_production",
        format: "percent",
        scope: { kind: "buildingType", value: "workshop" },
        scale: 100,
        resource: null,
      };
    }
    return { type: "goods_production", format: "percent", scope, scale: 100, resource: null };
  }
  if (buildingGroup === "tavern") {
    // Identique aux wonders : la taverne viking produit l'hydromel.
    return { type: "goods_production", format: "percent", scope, scale: 100, resource: "mead" };
  }
  if (buildingType !== null) {
    // Aucune ressource nommée : le boost porte sur ce que produit un TYPE de
    // bâtiment. Clé adoptée dans `resolvers/bonus.ts` avec le domaine Heritage.
    //
    // ⚠️ Le `scope` retenu est le TYPE DE BÂTIMENT, pas la cité, alors que le
    // composant porte les deux — c'est la SEULE branche de cette fonction qui
    // ignore `scope` calculé plus haut, et c'est délibéré.
    //
    // `building_type_production` ne nomme volontairement aucun type : une clé
    // par type (`home_production`, `beehive_production`, `workshop_production`…)
    // ferait un dictionnaire à rallonge pour une seule notion. Le discriminant
    // DOIT donc vivre dans `scope`. Garder `city` à la place perdrait la seule
    // information qui distingue ces bonus entre eux : les 2 occurrences de ce
    // domaine sont toutes deux en `City_Vikings` (`home` et `beehive`), leur
    // scope de cité serait identique, donc muet.
    //
    // Même arbitrage, même correction et même commentaire que
    // `projectResourceBoost()` dans scripts/extract/heritage.ts, dont les 4
    // occurrences sont toutes en `City_Capital` / `workshop`.
    return {
      type: "building_type_production",
      format: "percent",
      scope: { kind: "buildingType", value: buildingType },
      scale: 100,
      resource: null,
    };
  }
  return null;
}

/**
 * `BuildingBoostComponentDTO` → la `BoostDefinitionDTO` visée, projetée avec le
 * même `switch` que `projectBuildingBoost()` côté wonders.
 */
function projectBuildingBoost(
  boostType: string,
  boostTarget: Record<string, string>,
): Projection | null {
  const scope: BuildingBonusScope | null =
    boostTarget.buildingGroup === undefined
      ? null
      : { kind: "buildingGroup", value: boostTarget.buildingGroup };

  switch (boostType) {
    case "TradeSlotCooldownBoostDTO":
      return { type: "trade_slot_cooldown_reduction", format: "percent", scope, scale: 100, resource: null };
    case "BazaarOfferBoostDTO":
      return { type: "bazaar_offer_boost", format: "percent", scope, scale: 100, resource: null };
    case "AcceptTradeOfferBoostDTO":
      return { type: "trade_bonus", format: "percent", scope, scale: 100, resource: null };
    case "WonderContributionBoostDTO":
      return { type: "donation_gears", format: "percent", scope, scale: 100, resource: null };
    case "RegenerationTraitBoostDTO": {
      // ⚠️ LA RESSOURCE RÉGÉNÉRÉE DÉCIDE DE LA CLÉ — elle n'est pas toujours des
      // points de recherche.
      //
      // Ce DTO porte un `resourceDefinitionId` que cette branche IGNORAIT,
      // renvoyant les deux clés Wonders quoi qu'il arrive. Historiquement c'était
      // sans conséquence : seules les merveilles portaient ce boost, et toujours
      // sur `research_points`. Le Treasure Wreck l'a apporté au domaine Bâtiments
      // sur `treasure_hunt_attempt` — la BOUSSOLE de la chasse au trésor
      // d'alliance — et ses deux bonus se lisaient donc « RP Regeneration Speed » et
      // « Research Point Cap », deux stats qu'il ne touche pas.
      //
      // La conséquence n'était pas que cosmétique : le bâtiment d'héritage ATH
      // porte EXACTEMENT les deux mêmes boosts (mêmes suffixes de définition,
      // `…_ATHAttemptRegenerationBoost` et `…_ATHAttemptCapIncrement`, même
      // ressource), mais son extracteur, lui, lit la ressource. Les deux moitiés
      // d'un même bonus arrivaient donc sous deux clés différentes et ne
      // pouvaient plus se reconnaître — ni se cumuler.
      //
      // La règle appliquée ici est celle de `scripts/extract/heritage.ts` :
      // `research_*` NOMME les points de recherche, `regeneration_*` est
      // générique et porte sa ressource dans `resource`. Recensement complet du
      // game design : 7 `RegenerationTraitBoostDTO`, 4 sur `treasure_hunt_attempt`
      // (le Wreck et le vault) et 3 sur `research_points` (des merveilles). Ces
      // 3 dernières gardent donc trait pour trait la clé qu'elles avaient.
      const regenerated = boostTarget.resourceDefinitionId ?? null;
      const isDuration = boostTarget.modifier === "RegenerationTraitBoostModifier_DURATION";
      //
      // ⚠️ `invertsDuration` sur les DEUX clés de vitesse : la valeur brute est
      // le temps RESTANT, pas le gain (voir `invertDurationCurve`). Le plafond,
      // lui, est déjà un compte — rien à convertir.
      if (regenerated === null || regenerated === "research_points") {
        return isDuration
          ? { type: "research_regen_boost", format: "percent", scope, scale: 100, resource: null, invertsDuration: true }
          : { type: "research_point_cap", format: "integer", scope, scale: 1, resource: null };
      }
      return isDuration
        ? { type: "regeneration_speed", format: "percent", scope, scale: 100, resource: regenerated, invertsDuration: true }
        : { type: "regeneration_cap", format: "integer", scope, scale: 1, resource: regenerated };
    }
    case "BoostProductionTimeComponentDTO":
      return { type: "recruitment_time_reduction", format: "percent", scope, scale: 100, resource: null };
    case "BoostAmplifierComponentDTO":
      // Amplificateur de boost : il multiplie d'AUTRES bonus au lieu d'en porter
      // un. `resolvers/bonus.ts` déclare explicitement la composition hors
      // périmètre tant que la règle métier n'est pas tranchée.
      return { type: "boost_amplifier", format: "percent", scope, scale: 100, resource: null };
    default:
      return null;
  }
}

// ─── Extraction des bonus d'un maillon ────────────────────────────────────────

interface BonusContext {
  src: SourceIndex;
  gaps: GapCollector;
  chainKey: string;
  city: string;
  gameDesignId: string;
  /**
   * Plafond de niveau runtime, pour dimensionner les courbes. Vaut 1 quand la
   * chaîne n'a pas de `LevelUpComponentDTO` : il n'y a alors PAS d'axe de niveau
   * à balayer, et un montant dynamique se résout en une valeur unique.
   */
  curveLength: number;
  /** `BuildingDefinition.level` du maillon — l'`entityLevel` des scripts Lua. */
  entityLevel: number | null;
  warnings: string[];
}

function extractBonuses(definition: JsonObject, ctx: BonusContext): BuildingBonus[] {
  const bonuses: BuildingBonus[] = [];
  const instances = new Map<string, number>();

  const push = (
    projection: Projection,
    componentId: string | null,
    componentType: string,
    rawValue: number | null,
    curve: BuildingCurve | null,
    periodSeconds: number | null,
    descriptor: string,
    reason: string,
    ageCurve: BuildingAgeCurve | null = null,
  ): void => {
    ctx.gaps.note(projection, {
      chainKey: ctx.chainKey,
      gameDesignId: ctx.gameDesignId,
      componentType,
      descriptor,
      reason,
    });
    const instance = (instances.get(projection.type) ?? 0) + 1;
    instances.set(projection.type, instance);
    bonuses.push({
      type: projection.type,
      format: projection.format,
      scope: projection.scope,
      instance,
      componentId,
      componentType,
      value: rawValue === null ? null : round(rawValue * projection.scale),
      curve,
      ageCurve,
      periodSeconds,
      resource: ageCurve === null ? projection.resource : null,
    });
  };

  const PRODUCTION_REASON =
    "production dynamique d'un `evolving` : montant par cycle indexé par âge puis par niveau";

  /**
   * `producedDynamicActionChangeDefinitionId` → bonus.
   *
   * Axe âge : UN bonus portant la table complète (âge × niveau), la ressource
   * vivant sur chaque entrée d'âge puisqu'elle en dépend. Axe niveau : un bonus
   * par ressource, comme partout ailleurs dans ce module.
   */
  const pushProduced = (
    producedId: string,
    componentId: string | null,
    periodSeconds: number | null,
  ): void => {
    const componentType = "ProductionComponentDTO";
    const descriptors = producedDescriptors(ctx.src, producedId);
    if (descriptors.length === 0) return;

    const ageCurve = buildAgeCurve(ctx.src, producedId, ctx.curveLength, ACTION_AXIS, ctx.warnings);
    if (ageCurve !== null) {
      push(
        projectProducedResource(descriptors[0]).projection,
        componentId,
        componentType,
        null,
        null,
        periodSeconds,
        `producedDynamicActionChange[${producedId}] — ${ageCurve.entries.length} âges`,
        PRODUCTION_REASON,
        ageCurve,
      );
      return;
    }

    const definition = ctx.src.byId.get(producedId);
    const curve =
      definition === undefined
        ? null
        : buildCurve(firstMapping(definition), producedId, null, ctx.curveLength, actionAmount);
    if (curve === null) {
      ctx.warnings.push(`Production dynamique non résolue : ${producedId}`);
      return;
    }
    for (const descriptor of descriptors) {
      const { projection } = projectProducedResource(descriptor);
      push(
        projection,
        componentId,
        componentType,
        null,
        curve,
        periodSeconds,
        `producedDynamicActionChange[${producedId}] → ${descriptor}`,
        PRODUCTION_REASON,
      );
    }
  };

  for (const raw of asArray(definition.components)) {
    const component = asObject(raw);
    const componentType = shortType(component);
    const componentId = asString(component.id);

    switch (componentType) {
      case "ProductionComponentDTO": {
        const periodSeconds = asSeconds(component.duration);
        for (const change of asArray(component.producedResources)) {
          const definitionId = asString(asObject(change).definitionId);
          const amount = asNumber(asObject(change).amount);
          if (definitionId === null) continue;
          const dynamicAmount = asString(asObject(change).dynamicAmount);
          const dynamic =
            dynamicAmount === null ? null : luaAmount(ctx, dynamicAmount);
          const projection = projectProduction(definitionId);
          push(
            projection,
            componentId,
            componentType,
            dynamic === null ? amount : dynamic.value,
            dynamic === null ? null : dynamic.curve,
            periodSeconds,
            `producedResources[${definitionId}]`,
            "production à montant absolu par cycle (clé adoptée : plus jamais signalée)",
          );
        }
        // `finish.resourceChanges[]` : production « manuelle » d'un slot de
        // travail (§3.1). Même grandeur que `producedResources`, autre chemin.
        for (const change of asArray(asObject(component.finish).resourceChanges)) {
          const definitionId = asString(asObject(change).definitionId);
          const amount = asNumber(asObject(change).amount);
          if (definitionId === null || amount === null || amount <= 0) continue;
          const projection = projectProduction(definitionId);
          push(
            projection,
            componentId,
            componentType,
            amount,
            null,
            periodSeconds,
            `finish.resourceChanges[${definitionId}]`,
            "production à montant absolu par cycle (clé adoptée : plus jamais signalée)",
          );
        }
        const producedId = asString(component.producedDynamicActionChangeDefinitionId);
        if (producedId !== null) pushProduced(producedId, componentId, periodSeconds);
        break;
      }

      case "GrantWorkerComponentDTO": {
        const projection = projectGrantWorker(asString(component.type), ctx.city);
        const amount = asNumber(component.amount);
        const curve = curveFromDefinition(
          ctx.src,
          asString(component.dynamicAmountDefinitionId),
          null,
          ctx.curveLength,
        );
        push(
          projection,
          componentId,
          componentType,
          amount,
          curve,
          null,
          `type=${asString(component.type) ?? "(défaut)"} city=${ctx.city}`,
          "ouvrier spécialisé sans clé existante — `worker_slots` / `trade_worker_slots` / `arabia_worker_slots` ne le couvrent pas",
        );
        break;
      }

      case "CultureComponentDTO": {
        const points = asNumber(component.points);
        const pointsId = asString(component.dynamicPointsDefinitionId);
        const pointsAgeCurve =
          pointsId === null
            ? null
            : buildAgeCurve(ctx.src, pointsId, ctx.curveLength, VALUE_AXIS, ctx.warnings);
        push(
          { type: "culture_points", format: "integer", scope: null, scale: 1, resource: null },
          componentId,
          componentType,
          points,
          pointsAgeCurve !== null
            ? null
            : curveFromDefinition(ctx.src, pointsId, null, ctx.curveLength),
          null,
          "CultureComponent.points",
          "la culture n'a aucune clé dans BONUS_LABELS ; `Costs.culture_bonus` existe côté app mais n'est pas consommé",
          pointsAgeCurve,
        );
        const range = asNumber(component.range);
        const rangeCurve = curveFromDefinition(
          ctx.src,
          asString(component.dynamicRangeDefinitionId),
          null,
          ctx.curveLength,
        );
        push(
          { type: "culture_range", format: "integer", scope: null, scale: 1, resource: null },
          componentId,
          componentType,
          range,
          rangeCurve,
          null,
          "CultureComponent.range",
          "la portée de culture n'a aucune clé dans BONUS_LABELS ; `Costs.culture_range` existe côté app mais n'est pas consommé",
        );
        if (asString(component.luaPointsDefinitionId) !== null) {
          ctx.warnings.push(
            `Points de culture définis en Lua : ${asString(component.luaPointsDefinitionId)} — non résolu`,
          );
        }
        break;
      }

      case "BoostUnitStatComponentDTO": {
        const unitType = asString(component.unitType);
        const statDefinitionId = asString(component.statDefinitionId);
        if (statDefinitionId === null) break;
        const unitDefinitionId = asString(component.unitDefinitionId);
        const projection = projectUnitStatBoost(unitType, statDefinitionId, unitDefinitionId);
        if (projection === null) {
          ctx.warnings.push(`Stat d'unité non projetable : ${unitType ?? "(toutes)"} / ${statDefinitionId}`);
          break;
        }
        const modifier = asNumber(component.modifier);
        const curve = curveFromDefinition(
          ctx.src,
          asString(component.dynamicUnitStatChangeDefinitionId),
          modifier,
          ctx.curveLength,
        );
        push(
          projection,
          componentId,
          componentType,
          curve === null ? modifier : null,
          curve,
          null,
          `${unitType ?? "(toutes)"} / ${statDefinitionId}`,
          unitType !== null && UNIT_KEY[unitType] !== undefined && !KNOWN_BONUS_TYPES.has(projection.type)
            ? "type d'unité ou stat absent du vocabulaire des Wonders — même règle de nommage, clé nouvelle"
            : "stat d'unité sans clé existante",
        );
        break;
      }

      case "BuildingBoostComponentDTO": {
        const boostDefinitionId = asString(component.boostDefinitionId);
        if (boostDefinitionId === null) break;
        const boost = ctx.src.byId.get(boostDefinitionId);
        if (boost === undefined) {
          ctx.warnings.push(`Boost non résolu : ${boostDefinitionId}`);
          break;
        }
        const boostTypeObject = asObject(boost.boostType);
        const boostType = shortType(boostTypeObject);
        const target: Record<string, string> = {};
        for (const [key, value] of Object.entries(boostTypeObject)) {
          if (key === "@type" || key === "id") continue;
          const s = asString(value);
          if (s !== null) target[key] = s;
        }
        const projection = projectBuildingBoost(boostType, target);
        if (projection === null) {
          ctx.warnings.push(`Type de boost non projetable : ${boostType} (${boostDefinitionId})`);
          break;
        }
        const modifierMapping = asObject(boost.modifier);
        const built = buildCurve(modifierMapping, boostDefinitionId, null, ctx.curveLength);
        const curve =
          projection.invertsDuration === true ? invertDurationCurve(built) : built;
        push(
          projection,
          componentId,
          componentType,
          null,
          curve,
          null,
          `${boostType} ${JSON.stringify(target)}`,
          "amplificateur de boost — resolvers/bonus.ts déclare la composition de bonus hors périmètre",
        );
        break;
      }

      case "BoostResourceComponentDTO": {
        const cities = asArray(component.cities)
          .map(asString)
          .filter((c): c is string => c !== null);
        const projection = projectResourceBoost(
          asString(component.resourceDefinitionId),
          asString(component.resourceType),
          asString(component.buildingGroup),
          asString(component.buildingType),
          cities,
        );
        if (projection === null) {
          ctx.warnings.push(`Boost de ressource non projetable : ${JSON.stringify(component)}`);
          break;
        }
        const modifier = asNumber(component.modifier);
        const luaModifier = asString(component.luaModifierDefinitionId);
        const dynamicModifier = luaModifier === null ? null : luaAmount(ctx, luaModifier);
        push(
          projection,
          componentId,
          componentType,
          dynamicModifier === null ? modifier : dynamicModifier.value,
          dynamicModifier === null ? null : dynamicModifier.curve,
          null,
          `rid=${asString(component.resourceDefinitionId) ?? "—"} rt=${asString(component.resourceType) ?? "—"} bg=${asString(component.buildingGroup) ?? "—"} bt=${asString(component.buildingType) ?? "—"}`,
          "boost visant un TYPE de bâtiment : aucune ressource nommée, donc aucune clé `*_production` applicable",
        );
        break;
      }

      case "IncreaseResourceCapacityComponentDTO": {
        const capacity = asNumber(component.capacity);
        for (const resourceId of asArray(component.resourceIds)) {
          const id = asString(resourceId);
          if (id === null) continue;
          push(
            {
              type: "goods_capacity",
              format: "integer",
              scope: null,
              scale: 1,
              resource: toProjectResourceKey(id),
            },
            null,
            componentType,
            capacity,
            null,
            null,
            `capacity+${capacity ?? "?"} sur ${id}`,
            "plafond de stockage d'un bien : notion absente du dictionnaire (ni production, ni quantité octroyée)",
          );
        }
        break;
      }

      default:
        break;
    }
  }

  return bonuses;
}

// ─── Coûts ────────────────────────────────────────────────────────────────────

/**
 * Contexte d'évaluation des coûts écrits en formule (`dynamicAmount`).
 *
 * 19 lignes de coût de construction, sur 11 chaînes `City_Capital`, ne portent
 * pas de `amount` littéral mais un `dynamicAmount` pointant une
 * `DynamicLuaLongDefinitionDTO` (02-dynamic.md §6.1). Le game design ne déclare
 * PAS ce que valent les variables de ces scripts ; la convention retenue ici est
 * calibrée sur la donnée elle-même :
 *
 *   `entityLevel` = le `level` DÉCLARÉ de la définition porteuse.
 *
 * Vérifiée de deux façons indépendantes :
 *
 *  - Les formules de `premiumCulture`, `premiumHome` et `premiumFarm`
 *    reproduisent EXACTEMENT les 4 à 5 montants littéraux des niveaux
 *    précédents de leur propre chaîne quand on leur passe le `level` de ces
 *    niveaux (1530/1650/1770/1890 pour `premiumCulture`, etc.). Les quatre
 *    sites de culture non premium les reproduisent aux niveaux 12 et 13.
 *  - Les formules de vente (`SellComponentDTO`), portées par les MÊMES
 *    définitions et adossées à une courbe littérale niveau par niveau,
 *    redonnent au `level` N-1 le montant littéral du niveau N-1
 *    (`smallHome` : `25000 * 39 - 575000 = 400000`, la valeur écrite au
 *    niveau 39). Le montant du niveau N est donc l'évaluation en N.
 *
 * `playerAgeOrder` est fourni comme rang 1-based de l'âge de la définition.
 * ⚠️ Aucune des 19 formules ne l'utilise : cette convention-là n'est PAS
 * calibrée, et toute ligne qui s'en sert est signalée dans les `warnings`.
 */
interface CostContext {
  src: SourceIndex;
  entityLevel: number | null;
  playerAgeOrder: number | null;
  /** Rang de l'âge de la définition dans `AGES` — origine des `offset` de `costs[]`. */
  ageIndex: number | null;
  warnings: string[];
  what: string;
}

/** `dynamicAmount` → montant, ou `null` si la formule n'est pas évaluable ici. */
function resolveDynamicAmount(definitionId: string, ctx: CostContext): number | null {
  const signal = (raison: string): null => {
    ctx.warnings.push(`Coût en formule non résolu (${ctx.what}) : ${definitionId} — ${raison}`);
    return null;
  };

  const script = asString(asObject(ctx.src.byId.get(definitionId)).luaScript);
  if (script === null) return signal("script Lua introuvable");

  const variables: Record<string, number> = {};
  try {
    for (const name of collectLuaVariables(script)) {
      const value = name === "entityLevel" ? ctx.entityLevel : ctx.playerAgeOrder;
      if (name !== "entityLevel" && name !== "playerAgeOrder") {
        return signal(`variable \`${name}\` sans convention établie`);
      }
      if (value === null) return signal(`\`${name}\` indisponible sur cette définition`);
      if (name === "playerAgeOrder") {
        ctx.warnings.push(
          `Coût en formule utilisant \`playerAgeOrder\` (${ctx.what}) : ${definitionId} — ` +
            "convention non calibrée, valeur à vérifier",
        );
      }
      variables[name] = value;
    }
    const value = evaluateLuaFormula(script, variables);
    if (!Number.isInteger(value)) {
      ctx.warnings.push(
        `Coût en formule non entier (${ctx.what}) : ${definitionId} = ${value} — tronqué`,
      );
    }
    return Math.trunc(value);
  } catch (error) {
    return signal(error instanceof Error ? error.message : String(error));
  }
}

/**
 * `start.costs[]` → lignes de coût en biens.
 *
 * Champ FRÈRE de `resourceChanges[]`, pas imbriqué dedans. Les 4 définitions
 * `Building_DynamicAge_{Home_Small,Home_Average,Farm_Rural,Farm_Domestic}_1`
 * y écrivent leurs 3 biens de construction au lieu de les mettre dans
 * `resourceChanges[]` comme le fait le reste du domaine — 12 `GoodCostDTO`
 * littéraux, seule occurrence de ce type sur un `start` de bâtiment.
 *
 * Le bien n'est pas nommé, il est DÉSIGNÉ : `number` donne le rang (1 primary,
 * 2 secondary, 3 tertiary) et `offset` le décalage d'âge relatif à l'âge de la
 * définition porteuse (`-1` sur les 12, soit l'ère précédente). On reconstruit
 * l'identifiant `DYN|<Age>_Good<N>` que le reste du domaine écrit en clair,
 * plutôt que d'ouvrir un second chemin de résolution : `toProjectResourceKey`
 * fait le reste.
 *
 * ⚠️ Deux inversions par rapport à `resourceChanges[]` : ici les montants sont
 * POSITIFS, et `amount` est un int64-en-string (C3). Ils ressortent donc au même
 * signe que les autres lignes, sans passer par la normalisation du négatif.
 *
 * ⚠️ La variante DYNAMIQUE de `GoodCostDTO` (`dynamicAmountId` /
 * `dynamicOffsetId`) est hors périmètre : ses 12 occurrences vivent toutes dans
 * les `Dac_Building_DynamicAge_*_LevelUpCosts`, barèmes de montée runtime des
 * `evolving`, jamais dans un `start` de bâtiment. Une ligne de cette forme qui
 * apparaîtrait ici serait signalée, pas devinée.
 */
function extractGoodCosts(start: JsonObject, ctx: CostContext): BuildingCostLine[] {
  const lines: BuildingCostLine[] = [];
  for (const raw of asArray(start.costs)) {
    const cost = asObject(raw);
    if (shortType(cost) !== "GoodCostDTO") {
      ctx.warnings.push(`Coût de \`costs[]\` non traité (${ctx.what}) : ${shortType(cost)}`);
      continue;
    }

    const amount = asNumber(cost.amount);
    const offset = asNumber(cost.offset);
    const number = asNumber(cost.number);
    if (amount === null || offset === null || number === null) {
      ctx.warnings.push(
        `Coût en bien écrit en formule (${ctx.what}) : rang ${cost.number} — variante dynamique, non résolue`,
      );
      continue;
    }
    if (ctx.ageIndex === null) {
      ctx.warnings.push(`Coût en bien sans âge de référence (${ctx.what}) : rang ${number}`);
      continue;
    }

    const age = AGES[ctx.ageIndex + offset];
    if (age === undefined) {
      ctx.warnings.push(
        `Coût en bien hors des âges connus (${ctx.what}) : rang ${number}, décalage ${offset}`,
      );
      continue;
    }
    lines.push({ definitionId: `DYN|${age.age}_Good${number}`, amount });
  }
  return lines;
}

/**
 * `start.resourceChanges[]` → lignes de coût.
 *
 * Le game design écrit des montants NÉGATIFS (un changement de ressource
 * appliqué au joueur). L'app raisonne en coût positif : le signe est retourné
 * ici, et un montant positif serait une anomalie signalée.
 *
 * Un `amount` littéral prime ; à défaut, `dynamicAmount` est évalué (cf.
 * `CostContext`). Une formule non évaluable laisse la ligne de côté avec un
 * avertissement, comme un montant illisible.
 *
 * Les biens écrits dans `start.costs[]` sont ajoutés ensuite, cf.
 * `extractGoodCosts`.
 */
function extractCosts(start: JsonObject, ctx: CostContext): BuildingCostLine[] {
  const lines: BuildingCostLine[] = [];
  for (const raw of asArray(start.resourceChanges)) {
    const change = asObject(raw);
    const definitionId = asString(change.definitionId);
    if (definitionId === null) continue;

    const dynamicAmount = asString(change.dynamicAmount);
    const amount =
      asNumber(change.amount) ??
      (dynamicAmount === null ? null : resolveDynamicAmount(dynamicAmount, ctx));

    if (amount === null) {
      if (dynamicAmount === null) {
        ctx.warnings.push(`Coût sans montant lisible (${ctx.what}) : ${definitionId}`);
      }
      continue;
    }
    if (amount > 0) {
      ctx.warnings.push(`Coût de signe positif (gain ?) sur ${ctx.what} : ${definitionId} = ${amount}`);
    }
    lines.push({ definitionId, amount: Math.abs(amount) });
  }
  return [...lines, ...extractGoodCosts(start, ctx)];
}

/** `ResearchRequirementDTO.id` des prérequis d'un `start`. */
function researchRequirements(start: JsonObject): string[] {
  const out: string[] = [];
  for (const raw of asArray(start.requirements)) {
    const requirement = asObject(raw);
    if (shortType(requirement) !== "ResearchRequirementDTO") continue;
    const id = asString(requirement.id);
    if (id !== null) out.push(id);
  }
  return out;
}

function findComponent(definition: JsonObject, type: string): JsonObject | null {
  for (const raw of asArray(definition.components)) {
    if (shortType(raw) === type) return asObject(raw);
  }
  return null;
}

// ─── Chaînes ──────────────────────────────────────────────────────────────────

/**
 * Ordonne les maillons d'une chaîne.
 *
 * L'ordre de référence est celui des `UpgradeComponentDTO.target` : c'est le
 * seul qui survive aux 22 définitions sans `level` (§1.4). `level` sert ensuite
 * de contrôle — un désaccord entre les deux est signalé, jamais arbitré en
 * silence.
 */
function orderChain(members: JsonObject[], warnings: string[]): JsonObject[] {
  const byId = new Map<string, JsonObject>();
  for (const member of members) {
    const id = asString(member.id);
    if (id !== null) byId.set(id, member);
  }

  const targeted = new Set<string>();
  for (const member of members) {
    const upgrade = findComponent(member, "UpgradeComponentDTO");
    const target = upgrade === null ? null : asString(upgrade.target);
    // Une cible hors de la chaîne (autre groupe) n'entre pas dans l'ordre local.
    if (target !== null && byId.has(target)) targeted.add(target);
  }

  const roots = members.filter((m) => {
    const id = asString(m.id);
    return id !== null && !targeted.has(id);
  });

  if (roots.length !== 1) {
    warnings.push(`${roots.length} racines de chaîne au lieu de 1 — ordre replié sur \`level\``);
    return [...members].sort((a, b) => (asNumber(a.level) ?? 0) - (asNumber(b.level) ?? 0));
  }

  const ordered: JsonObject[] = [];
  const seen = new Set<string>();
  let current: JsonObject | undefined = roots[0];
  while (current !== undefined) {
    const id = asString(current.id);
    if (id === null || seen.has(id)) break;
    seen.add(id);
    ordered.push(current);
    const upgrade = findComponent(current, "UpgradeComponentDTO");
    const target = upgrade === null ? null : asString(upgrade.target);
    current = target === null ? undefined : byId.get(target);
  }

  if (ordered.length !== members.length) {
    // Des maillons non atteints depuis la racine : la chaîne est éclatée.
    warnings.push(
      `${members.length - ordered.length} maillon(s) hors de la chaîne suivie depuis la racine — ajoutés par \`level\``,
    );
    const rest = members
      .filter((m) => !seen.has(asString(m.id) ?? ""))
      .sort((a, b) => (asNumber(a.level) ?? 0) - (asNumber(b.level) ?? 0));
    ordered.push(...rest);
  }
  return ordered;
}

function classifyScope(buildingType: string, group: string, hasPresentation: boolean): BuildingScope {
  if (hasPresentation) return "app";
  return OUT_OF_SCOPE_BY_GROUP[group] ?? OUT_OF_SCOPE_BY_TYPE[buildingType] ?? "undeclared";
}

// ─── Extraction ───────────────────────────────────────────────────────────────

export function extractBuildings(root: string): BuildingExtractBundle {
  const src = loadSource(root);
  const definitions = src.byType.get("BuildingDefinitionDTO") ?? [];
  if (definitions.length === 0) throw new Error("Aucune BuildingDefinitionDTO dans le game design");

  const globalWarnings: string[] = [];
  const limits = buildLimitIndex(src, globalWarnings);
  const gaps = new GapCollector();

  // Regroupement en chaînes. `cities` est un tableau mais ne porte jamais plus
  // d'une valeur (§2) : un pluriel serait une rupture de contrat, signalée.
  const chains = new Map<string, JsonObject[]>();
  for (const definition of definitions) {
    const cities = asArray(definition.cities)
      .map(asString)
      .filter((c): c is string => c !== null);
    const group = asString(definition.group);
    const id = asString(definition.id);
    if (group === null || cities.length === 0) {
      globalWarnings.push(`Bâtiment sans \`group\` ou sans \`cities\` : ${id ?? "(sans id)"}`);
      continue;
    }
    if (cities.length > 1) {
      globalWarnings.push(`Bâtiment multi-cités (§2 dit que ça n'arrive pas) : ${id} — ${cities.join(", ")}`);
    }
    const key = `${cities[0]}|${group}`;
    const bucket = chains.get(key);
    if (bucket) bucket.push(definition);
    else chains.set(key, [definition]);
  }

  const buildings: BuildingChainExtract[] = [];

  for (const [chainKey, members] of [...chains.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    const warnings: string[] = [];
    const [city, group] = chainKey.split("|");
    const ordered = orderChain(members, warnings);
    const rootDefinition = ordered[0];
    const rootId = require0(asString(rootDefinition.id), "BuildingDefinition.id");
    const buildingType = require0(asString(rootDefinition.type), `BuildingDefinition.type (${rootId})`);

    const presentation = PROJECT_PRESENTATION[chainKey];
    const scope = classifyScope(buildingType, group, presentation !== undefined);
    if (scope === "undeclared") {
      warnings.push(
        "Chaîne ni projetée ni classée hors périmètre — compléter PROJECT_PRESENTATION ou OUT_OF_SCOPE_BY_*",
      );
    }

    const groupName = translate(src, `Base.BuildingGroups.${group}_Name`);
    const rootName = translate(src, `Base.Buildings.${rootId}_Name`);
    if (groupName === "") {
      warnings.push(`Pas de libellé de groupe (\`Base.BuildingGroups.${group}_Name\`) — repli sur le maillon racine`);
    }

    // §1.3 : le plafond de niveau runtime vit sur `LevelUpComponentDTO`, jamais
    // sur la définition. 11 composants n'en déclarent aucun (point ouvert B1).
    const levelUpComponent = findComponent(rootDefinition, "LevelUpComponentDTO");
    let levelUp: BuildingLevelUpExtract | null = null;
    if (levelUpComponent !== null) {
      const maxLevel = asNumber(levelUpComponent.maxLevel);
      if (maxLevel === null) {
        warnings.push("`LevelUpComponentDTO` sans `maxLevel` ni plafond déclaré (point ouvert B1)");
      }
      levelUp = {
        componentId: asString(levelUpComponent.id) ?? "",
        maxLevel,
        starLevels: asArray(levelUpComponent.starLevels)
          .map(asNumber)
          .filter((n): n is number => n !== null),
        upgradeCostSchemeId: asString(asObject(levelUpComponent.start).dynamicChangeDefinitionId),
        upgradeCost: null,
      };
      if (levelUp.starLevels !== null && levelUp.starLevels.length === 0) levelUp.starLevels = null;
    }
    const curveLength = levelUp?.maxLevel ?? 1;
    if (levelUp !== null && levelUp.upgradeCostSchemeId !== null) {
      const scheme = src.byId.get(levelUp.upgradeCostSchemeId);
      const cost =
        scheme === undefined
          ? null
          : buildCurve(
              firstMapping(scheme),
              levelUp.upgradeCostSchemeId,
              -1,
              curveLength,
              actionAmount,
            );
      if (cost === null) {
        warnings.push(`Barème de montée non résolu : ${levelUp.upgradeCostSchemeId}`);
      }
      levelUp.upgradeCost = cost;
    }

    const limitRow = limits.get(chainKey) ?? null;

    const levels: BuildingLevelExtract[] = [];
    ordered.forEach((definition, chainIndex) => {
      const levelWarnings: string[] = [];
      const gameDesignId = require0(asString(definition.id), "BuildingDefinition.id");
      const level = asNumber(definition.level);
      const age = asString(definition.age);

      if (level === null) {
        levelWarnings.push("Pas de `level` (§1.4) — l'ordre vient de la chaîne d'upgrade");
      }
      if (age === null && buildingType !== "evolving") {
        levelWarnings.push("Pas d'`age` alors que le bâtiment n'est pas `evolving` (§2 dit l'inverse)");
      }

      let eraAbbr: string | null = null;
      if (age !== null && age !== PREGAME_AGE) {
        eraAbbr = ABBR_BY_AGE.get(age) ?? null;
        if (eraAbbr === null) {
          throw new Error(`Âge inconnu du projet : ${age} (${gameDesignId}) — compléter AGES`);
        }
      }

      const ageIndex = age === null ? undefined : AGE_INDEX.get(age);
      const maxQty =
        limitRow !== null && ageIndex !== undefined ? (limitRow[ageIndex] ?? null) : null;

      const construction = findComponent(definition, "ConstructionComponentDTO");
      const previous = chainIndex === 0 ? null : ordered[chainIndex - 1];
      const previousUpgrade = previous === null ? null : findComponent(previous, "UpgradeComponentDTO");

      const unlockedBy = [
        ...(construction === null ? [] : researchRequirements(asObject(construction.start))),
        ...(previousUpgrade === null ? [] : researchRequirements(asObject(previousUpgrade.start))),
      ];

      const costContext = {
        src,
        entityLevel: level,
        playerAgeOrder: ageIndex === undefined ? null : ageIndex + 1,
        ageIndex: ageIndex ?? null,
        warnings: levelWarnings,
      };

      const bonuses = extractBonuses(definition, {
        src,
        gaps,
        chainKey,
        city,
        gameDesignId,
        curveLength,
        entityLevel: level,
        warnings: levelWarnings,
      });

      levels.push({
        gameDesignId,
        level,
        chainIndex,
        age,
        eraAbbr,
        maxQty,
        width: asNumber(definition.width),
        height: asNumber(definition.height),
        freeProductionSlots: asNumber(definition.freeProductionSlots),
        construction:
          construction === null
            ? null
            : extractCosts(asObject(construction.start), {
                ...costContext,
                what: `construction ${gameDesignId}`,
              }),
        upgrade:
          previousUpgrade === null
            ? null
            : extractCosts(asObject(previousUpgrade.start), {
                ...costContext,
                what: `upgrade → ${gameDesignId}`,
              }),
        upgradeFromId: previousUpgrade === null ? null : (asString(previous?.id) ?? null),
        unlockedBy: [...new Set(unlockedBy)],
        bonuses,
        warnings: levelWarnings,
      });
    });

    // Les `evolving` n'ont pas d'entrée dans `PROJECT_PRESENTATION` : leur
    // présentation est dérivée du groupe. La dériver ICI plutôt qu'au seul
    // moment de `toRawEntries()` évite qu'une même chaîne porte une clé de
    // registre dans une couche et `null` dans l'autre.
    const chainPresentation =
      scope === "evolving" ? evolvingPresentation(group) : (presentation ?? null);

    buildings.push({
      chainKey,
      city,
      group,
      buildingType,
      name: groupName || rootName,
      rootName,
      scope,
      registryKey: chainPresentation?.registryKey ?? null,
      id: chainPresentation?.id ?? null,
      category: chainPresentation?.category ?? null,
      subcategory: chainPresentation?.subcategory ?? null,
      imageName: chainPresentation?.imageName ?? null,
      levelUp,
      levels,
      warnings,
    });
  }

  // Une entrée de la table de présentation qui ne rencontre aucune chaîne est
  // un bâtiment retiré du jeu — ou une faute de frappe. Les deux méritent d'être
  // vues.
  const seenKeys = new Set(buildings.map((b) => b.chainKey));
  for (const key of Object.keys(PROJECT_PRESENTATION)) {
    if (!seenKeys.has(key)) {
      globalWarnings.push(`PROJECT_PRESENTATION cite une chaîne absente du game design : ${key}`);
    }
  }
  if (globalWarnings.length > 0 && buildings.length > 0) {
    buildings[0].warnings.push(...globalWarnings.map((w) => `[global] ${w}`));
  }

  return {
    generatedFrom: {
      gameDesignChecksum: src.gameDesignChecksum,
      locaChecksum: src.locaChecksum,
      locale: src.locale,
    },
    buildings,
    bonusGaps: gaps.list(),
    regeneratingResources: extractRegeneratingResources(src),
  };
}

/**
 * Les ressources à jauge et leur régénération NUE — voir
 * `RegeneratingResourceExtract` pour le choix de bundle.
 *
 * ⚠️ `GameRegeneratingTraitDTO` SEULEMENT. Les jauges du hub commercial portent
 * un `TradingHubRegeneratingTraitDTO` : même famille de nom, mais sans plafond,
 * et rechargées par un tout autre mécanisme. Les mêler donnerait 25 entrées dont
 * 22 sans `baseMax`, et personne ne saurait plus lesquelles sont comparables.
 *
 * Trié par `id` pour que le fichier généré ne bouge pas au gré de l'ordre de
 * parcours du game design — un diff de régénération doit signaler un changement
 * de JEU, pas un changement d'ordre.
 */
function extractRegeneratingResources(src: SourceIndex): RegeneratingResourceExtract[] {
  const found: RegeneratingResourceExtract[] = [];
  for (const resource of src.byType.get("ResourceDefinitionDTO") ?? []) {
    const id = asString(resource.id);
    if (id === null) continue;
    for (const trait of asArray(resource.traits)) {
      if (shortType(trait) !== "GameRegeneratingTraitDTO") continue;
      const object = asObject(trait);
      const baseMax = asNumber(object.max);
      const basePeriodSeconds = asSeconds(object.duration);
      const amountPerUnit = asNumber(object.amountPerUnit);
      // Une entrée incomplète est IGNORÉE plutôt que complétée par un défaut :
      // un plafond ou une cadence inventés se propageraient en un temps de
      // recharge faux, que rien à l'écran ne signalerait comme tel.
      if (baseMax === null || basePeriodSeconds === null || amountPerUnit === null) continue;
      found.push({ id, baseMax, basePeriodSeconds, amountPerUnit });
    }
  }
  return found.sort((a, b) => a.id.localeCompare(b.id));
}

// ─── Projection UI ────────────────────────────────────────────────────────────

/** Une ligne de coût → sa place dans `Costs` (scalaire nommé ou entrée de `goods[]`). */
function toRawCosts(lines: BuildingCostLine[]): BuildingRawCosts | undefined {
  const costs: BuildingRawCosts = {};
  const goods: BuildingRawGood[] = [];
  for (const line of lines) {
    const scalar = COST_SCALAR_KEY[line.definitionId];
    if (scalar !== undefined) {
      costs[scalar] = (costs[scalar] ?? 0) + line.amount;
      continue;
    }
    goods.push({ amount: line.amount, resource: toProjectResourceKey(line.definitionId) });
  }
  if (goods.length > 0) costs.goods = goods;
  return Object.keys(costs).length === 0 ? undefined : costs;
}

/**
 * Présentation projet d'une chaîne `evolving`, dérivée du groupe.
 *
 * Ces 44 chaînes n'ont pas de ligne dans `PROJECT_PRESENTATION` : le projet ne
 * leur a jamais donné de clé, et `lib/catalog.ts` ne les affiche pas. La clé est
 * donc dérivée du groupe (`evolvingAncientLibrary` → `evolving_ancient_library`),
 * et `imageName` reste vide plutôt qu'inventé.
 */
function evolvingPresentation(group: string): Presentation {
  const slug = group
    .replace(/^evolving/, "")
    .replace(/(?<!^)(?=[A-Z])/g, "_")
    .toLowerCase()
    .replace(/^_/, "");
  return {
    registryKey: `evolving_${slug}`,
    id: `capital-evolving-${slug.replace(/_/g, "-")}`,
    category: "capital",
    subcategory: "evolving",
    imageName: "",
  };
}

/**
 * Projection étroite alignée sur `BuildingData` (docs/data-contracts.md §1.1 a).
 *
 * Sont projetées les chaînes de périmètre app et les chaînes `evolving`. Les
 * maillons `DawnAge` en sont exclus : l'app n'a pas d'ère pour eux, et leur coût
 * d'upgrade est déjà porté par le niveau 1 (règle du décalage, cf.
 * `BuildingLevelExtract.upgrade`).
 *
 * ⚠️ Une chaîne `evolving` sort avec `levels: []` : son unique définition n'a pas
 * d'`age` (donc pas d'ère, champ obligatoire de `BuildingLevel`) et se paie en
 * `EvolutionToken`, qui n'est pas une ressource de `Costs`. Sa progression est
 * une courbe runtime, conservée dans `BUILDING_EXTRACT.levelUp`.
 */
export function toRawEntries(bundle: BuildingExtractBundle): BuildingRawEntry[] {
  const entries: BuildingRawEntry[] = [];
  for (const building of bundle.buildings) {
    const isEvolving = building.scope === "evolving";
    if (!isEvolving && (building.scope !== "app" || building.registryKey === null)) continue;
    const presentation = {
      registryKey: building.registryKey as string,
      id: building.id ?? "",
      category: building.category ?? "",
      subcategory: building.subcategory ?? "",
      imageName: building.imageName ?? "",
    };

    const levels: BuildingRawLevel[] = [];
    for (const level of isEvolving ? [] : building.levels) {
      if (level.eraAbbr === null) continue;
      const projected = level.level ?? level.chainIndex + 1;
      const raw: BuildingRawLevel = { level: projected, era: level.eraAbbr };
      if (level.maxQty !== null) raw.max_qty = level.maxQty;
      const construction = level.construction === null ? undefined : toRawCosts(level.construction);
      if (construction !== undefined) raw.construction = construction;
      const upgrade = level.upgrade === null ? undefined : toRawCosts(level.upgrade);
      if (upgrade !== undefined) raw.upgrade = upgrade;
      levels.push(raw);
    }

    const [first] = building.levels;
    entries.push({
      key: presentation.registryKey,
      id: presentation.id,
      name: building.name,
      category: presentation.category,
      subcategory: presentation.subcategory,
      imageName: presentation.imageName,
      buildingType: building.buildingType,
      width: first?.width ?? null,
      height: first?.height ?? null,
      levels,
    });
  }
  return entries;
}

// ─── Émission ─────────────────────────────────────────────────────────────────

const HEADER = `// ============================================================
// GÉNÉRÉ AUTOMATIQUEMENT — NE PAS ÉDITER À LA MAIN.
//
// Produit par scripts/extract/buildings.ts à partir de
// source/gamedesign.json + source/loca.json.
// Régénérer avec : pnpm extract:buildings
// ============================================================
`;

function renderModule(bundle: BuildingExtractBundle, raw: BuildingRawEntry[]): string {
  return [
    HEADER,
    `import type {`,
    `  BuildingExtractBundle,`,
    `  BuildingRawEntry,`,
    `} from "./types";`,
    ``,
    `/** Extraction complète et fidèle du domaine Bâtiments. */`,
    `export const BUILDING_EXTRACT: BuildingExtractBundle = ${JSON.stringify(bundle, null, 2)};`,
    ``,
    `/** Projection étroite alignée sur \`BuildingData\` (types/shared.ts). */`,
    `export const BUILDING_RAW_DATA: BuildingRawEntry[] = ${JSON.stringify(raw, null, 2)};`,
    ``,
  ].join("\n");
}

function main(): void {
  const root = process.cwd();
  const bundle = extractBuildings(root);
  const raw = toRawEntries(bundle);

  const outDir = path.join(root, "data", "buildings", "generated");
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, "buildings.generated.ts");
  fs.writeFileSync(outFile, renderModule(bundle, raw), "utf8");

  const byScope = new Map<string, number>();
  const bonusTypes = new Set<string>();
  let definitions = 0;
  let costLines = 0;
  let bonusCount = 0;
  let warningCount = 0;
  for (const building of bundle.buildings) {
    byScope.set(building.scope, (byScope.get(building.scope) ?? 0) + 1);
    warningCount += building.warnings.length;
    for (const level of building.levels) {
      definitions += 1;
      costLines += (level.construction?.length ?? 0) + (level.upgrade?.length ?? 0);
      warningCount += level.warnings.length;
      for (const bonus of level.bonuses) {
        bonusTypes.add(bonus.type);
        bonusCount += 1;
      }
    }
  }
  const known = [...bonusTypes].filter((t) => KNOWN_BONUS_TYPES.has(t)).sort();
  const proposed = [...bonusTypes].filter((t) => !KNOWN_BONUS_TYPES.has(t)).sort();

  process.stdout.write(
    [
      `Chaînes extraites      : ${bundle.buildings.length} (${definitions} définitions)`,
      `  dont périmètre app   : ${byScope.get("app") ?? 0}`,
      `  hors périmètre       : ${[...byScope.entries()]
        .filter(([s]) => s !== "app")
        .sort((a, b) => b[1] - a[1])
        .map(([s, n]) => `${s}=${n}`)
        .join(", ")}`,
      `Projetées vers l'app   : ${raw.length}`,
      `Lignes de coût         : ${costLines}`,
      `Bonus projetés         : ${bonusCount}`,
      `  clés réutilisées     : ${known.join(", ") || "(aucune)"}`,
      `  clés PROPOSÉES       : ${proposed.join(", ") || "(aucune)"}`,
      `Écarts de vocabulaire  : ${bundle.bonusGaps.length} (détail dans BUILDING_EXTRACT.bonusGaps)`,
      `Points indéterminés    : ${warningCount} (détail dans les champs \`warnings\`)`,
      `Écrit                  : ${path.relative(root, outFile)}`,
      ``,
    ].join("\n"),
  );
}

main();
