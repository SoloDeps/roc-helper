import { ERAS, type EraDefinition } from "@/data/config";
import type { EraCode } from "@/types/shared";

/** Une ère du jeu — alias de EraDefinition (source : data/config.ts). */
export type Era = EraDefinition;
/** Code court d'une ère, ex. "LG" — alias de EraCode (source : types/shared.ts). */
export type EraAbbr = EraCode;
export type alliedCity =
  | "egypt"
  | "china"
  | "maya_empire"
  | "viking_kingdom"
  | "arabia"
  | "ottoman_empire";

/**
 * Les 14 ères du jeu, dans l'ordre chronologique.
 * Ré-export de la source unique (data/config.ts) — ne pas redéclarer ici.
 */
export const eras: EraDefinition[] = ERAS;

// ========================================
// COULEURS - Centralisées
// ========================================

export const eraColors: Record<EraAbbr, string> = {
  SA: "191, 96, 96",
  BA: "232, 149, 47",
  ME: "93, 194, 152",
  CG: "90, 152, 189",
  ER: "104, 109, 196",
  RE: "191, 96, 96",
  BE: "232, 149, 47",
  AF: "93, 194, 152",
  FA: "90, 152, 189",
  IE: "104, 109, 196",
  KS: "191, 96, 96",
  HM: "232, 149, 47",
  EG: "93, 194, 152",
  LG: "90, 152, 189",
};

export const alliedCityColors: Record<alliedCity, string> = {
  egypt: "93, 194, 152",
  china: "104, 109, 196",
  maya_empire: "232, 149, 47",
  viking_kingdom: "90, 152, 189",
  arabia: "191, 96, 96",
  ottoman_empire: "93, 194, 152",
};

// Couleurs spéciales pour les catégories de ressources
export const RESOURCE_COLORS = {
  MAIN: "90, 152, 189",
  ITEMS: "120, 83, 21", // Purple
  OTHERS: "128, 128, 128",
  POSITIVE_DIFF: "34, 197, 94", // Green
  NEGATIVE_DIFF: "239, 68, 68", // Red
} as const;

// ========================================
// RESSOURCES PRINCIPALES
// ========================================

// Ordre d'affichage des ressources principales
export const MAIN_RESOURCE_ORDER = [
  "coins",
  "food",
  "research_points",
  "gems",
] as const;

export const buildingsAbbr = [
  {
    title: "Bronze Age ~ Roman Empire",
    buildings: ["Tailor", "Stone Mason", "Artisan"],
    abbreviations: ["SA", "BA", "ME", "CG", "ER", "RE"],
  },
  {
    title: "Byzantine Era ~ High Middle Ages",
    buildings: ["Scribe", "Carpenter", "Spice Merchant"],
    abbreviations: ["BE", "AF", "FA", "IE", "KS", "HM"],
  },
  {
    title: "Early Gothic Era ~ Late Gothic Era",
    buildings: ["Jeweler", "Alchemist", "Glassblower"],
    abbreviations: ["EG", "LG"],
  },
];

/**
 * Ères disponibles pour les workshops capital, dans l'ordre chronologique.
 */
export const WORKSHOP_ERAS: EraAbbr[] = [
  "BA",
  "ME",
  "CG",
  "ER",
  "RE",
  "BE",
  "AF",
  "FA",
  "IE",
  "KS",
  "HM",
  "EG",
  "LG",
] as const;
//   default: "/images/thumb/3/36/images/goods.png/32px-Goods.png",
//   coins: "/images/thumb/Coin.png/32px-Coin.png",
//   food: "/images/thumb/Food.png/32px-Food.png",
//   research_points: "/images/thumb/Research.png/32px-Research.png",
//   gems: "/images/thumb/Gems.png/32px-Gems.png",
//   // others
//   aspers: "/images/thumb/Asper.png/32px-Asper.png",
//   cocoa: "/images/thumb/Cocoa.png/32px-Cocoa.png",
//   deben: "/images/thumb/Deben.png/32px-Deben.png",
//   dirham: "/images/thumb/Dirham.png/32px-Dirham.png",
//   pennies: "/images/thumb/Pennies.png/32px-Pennies.png",
//   rice: "/images/thumb/Rice.png/32px-Rice.png",
//   wu_zhu: "/images/thumb/Wu_Zhu.png/32px-Wu_Zhu.png",
// } as const;

/**
 * Bien produit par chaque atelier, par ère.
 *
 * `key`  — identifiant interne du bien, celui qu'écrivent les fichiers de
 *          `data/**` et le nom du fichier d'icône. Aligné sur
 *          `ResourceDefinitionDTO.id` du game design.
 * `name` — libellé affiché. Il DIVERGE de la clé sur trois biens, parce que le
 *          jeu lui-même porte deux chaînes : `_Name` (singulier, l'objet) et
 *          `_TechnologyName` (pluriel, l'arbre de recherche). L'app affiche le
 *          pluriel pour `elixier` et `embellishment` — on le garde.
 *
 * ⚠️ Ne PAS redériver la clé depuis `name` : c'est ce que faisait le code
 * (`slugify(meta.name)`), et c'est ce qui imposait les alias `secretary_desk` /
 * `elixirs` / `embellishments`.
 */
export const goodsUrlByEra: Record<
  EraAbbr,
  Record<string, { key: string; name: string; url: string }>
> = {
  // ⚠️ L'Âge de pierre n'a AUCUN bien : le premier atelier du jeu est
  // `Building_BronzeAge_Workshop_*`, et le game design ne déclare aucune
  // `ResourceDefinitionDTO` de `resourceType: "good"` en `age: "StoneAge"`.
  //
  // Cette entrée dupliquait mot pour mot celle de BA. Comme la résolution
  // inverse (`getPriorityKeyFromGoodName`) balaye les ères dans l'ordre de
  // `eras` et retourne la PREMIÈRE correspondance, les trois biens du Bronze
  // tombaient toujours dans un seau `*_sa` — 60 lignes de coût sur
  // 10 bâtiments étaient rangées sous l'Âge de pierre.
  //
  // Laissée vide plutôt que supprimée : le type est un `Record<EraAbbr, …>`,
  // et `eras` continue de citer SA. Les deux consommateurs traversent l'objet
  // vide sans rien trouver, ce qui est le comportement voulu.
  SA: {},
  BA: {
    tailor: {
      key: "wool",
      name: "Wool",
      url: "/images/thumb/3/34/Wool.png/32px-Wool.png",
    },
    stone_mason: {
      key: "alabaster_idol",
      name: "Alabaster Idol",
      url: "/images/thumb/6/6e/Alabaster_Idol.png/32px-Alabaster_Idol.png",
    },
    artisan: {
      key: "bronze_bracelet",
      name: "Bronze Bracelet",
      url: "/images/thumb/3/3c/Bronze_Bracelet.png/32px-Bronze_Bracelet.png",
    },
  },
  ME: {
    tailor: {
      key: "linen_shirt",
      name: "Linen Shirt",
      url: "/images/thumb/8/8a/Linen_Shirt.png/32px-Linen_Shirt.png",
    },
    stone_mason: {
      key: "marble_bust",
      name: "Marble Bust",
      url: "/images/thumb/b/b1/Marble_Bust.png/32px-Marble_Bust.png",
    },
    artisan: {
      key: "iron_pendant",
      name: "Iron Pendant",
      url: "/images/thumb/6/62/Iron_Pendant.png/32px-Iron_Pendant.png",
    },
  },
  CG: {
    tailor: {
      key: "toga",
      name: "Toga",
      url: "/images/thumb/a/a3/Toga.png/32px-Toga.png",
    },
    stone_mason: {
      key: "column",
      name: "Column",
      url: "/images/thumb/5/5e/Column.png/32px-Column.png",
    },
    artisan: {
      key: "silver_ring",
      name: "Silver Ring",
      url: "/images/thumb/c/cc/Silver_Ring.png/32px-Silver_Ring.png",
    },
  },
  ER: {
    tailor: {
      key: "tunic",
      name: "Tunic",
      url: "/images/thumb/5/5b/Tunic.png/32px-Tunic.png",
    },
    stone_mason: {
      key: "stone_tablet",
      name: "Stone Tablet",
      url: "/images/thumb/0/04/Stone_Tablet.png/32px-Stone_Tablet.png",
    },
    artisan: {
      key: "gold_laurel",
      name: "Gold Laurel",
      url: "/images/thumb/e/e3/Gold_Laurel.png/32px-Gold_Laurel.png",
    },
  },
  RE: {
    tailor: {
      key: "cape",
      name: "Cape",
      url: "/images/thumb/6/6e/Cape.png/32px-Cape.png",
    },
    stone_mason: {
      key: "mosaic",
      name: "Mosaic",
      url: "/images/thumb/f/f4/Mosaic.png/32px-Mosaic.png",
    },
    artisan: {
      key: "goblet",
      name: "Goblet",
      url: "/images/thumb/b/b2/Goblet.png/32px-Goblet.png",
    },
  },
  BE: {
    scribe: {
      key: "parchment",
      name: "Parchment",
      url: "/images/thumb/4/48/Parchment.png/32px-Parchment.png",
    },
    carpenter: {
      key: "planks",
      name: "Planks",
      url: "/images/thumb/b/b9/Planks.png/32px-Planks.png",
    },
    spice_merchant: {
      key: "pepper",
      name: "Pepper",
      url: "/images/thumb/5/50/Pepper.png/32px-Pepper.png",
    },
  },
  AF: {
    scribe: {
      key: "ink",
      name: "Ink",
      url: "/images/thumb/e/e1/Ink.png/32px-Ink.png",
    },
    carpenter: {
      key: "cartwheel",
      name: "Cartwheel",
      url: "/images/thumb/c/c2/Cartwheel.png/32px-Cartwheel.png",
    },
    spice_merchant: {
      key: "salt",
      name: "Salt",
      url: "/images/thumb/7/77/Salt.png/32px-Salt.png",
    },
  },
  FA: {
    scribe: {
      key: "manuscript",
      name: "Manuscript",
      url: "/images/thumb/7/73/Manuscript.png/32px-Manuscript.png",
    },
    carpenter: {
      key: "barrel",
      name: "Barrel",
      url: "/images/thumb/a/a1/Barrel.png/32px-Barrel.png",
    },
    spice_merchant: {
      key: "herbs",
      name: "Herbs",
      url: "/images/thumb/7/79/Herbs.png/32px-Herbs.png",
    },
  },
  IE: {
    scribe: {
      key: "wax_seal",
      name: "Wax Seal",
      url: "/images/thumb/c/c1/Wax_Seal.png/32px-Wax_Seal.png",
    },
    carpenter: {
      key: "door",
      name: "Door",
      url: "/images/thumb/3/36/Door.png/32px-Door.png",
    },
    spice_merchant: {
      key: "saffron",
      name: "Saffron",
      url: "/images/thumb/8/8c/Saffron.png/32px-Saffron.png",
    },
  },
  KS: {
    scribe: {
      key: "tome",
      name: "Tome",
      url: "/images/thumb/8/8e/Tome.png/32px-Tome.png",
    },
    carpenter: {
      key: "wardrobe",
      name: "Wardrobe",
      url: "/images/thumb/1/15/Wardrobe.png/32px-Wardrobe.png",
    },
    spice_merchant: {
      key: "chili",
      name: "Chili",
      url: "/images/thumb/d/de/Chili.png/32px-Chili.png",
    },
  },
  HM: {
    scribe: {
      key: "grimoire",
      name: "Grimoire",
      url: "/images/thumb/2/2a/Grimoire.png/32px-Grimoire.png",
    },
    carpenter: {
      key: "secretary",
      name: "Secretary Desk",
      url: "/images/thumb/8/85/Secretary_Desk.png/32px-Secretary_Desk.png",
    },
    spice_merchant: {
      key: "cinnamon",
      name: "Cinnamon",
      url: "/images/thumb/1/1b/Cinnamon.png/32px-Cinnamon.png",
    },
  },
  EG: {
    jeweler: {
      key: "fine_jewelry",
      name: "Fine Jewelry",
      url: "/images/thumb/a/af/Fine_Jewelry.png/32px-Fine_Jewelry.png",
    },
    alchemist: {
      key: "ointment",
      name: "Ointment",
      url: "/images/thumb/5/5c/Ointment.png/32px-Ointment.png",
    },
    glassblower: {
      key: "lead_glass",
      name: "Lead Glass",
      url: "/images/thumb/e/e2/Lead_Glass.png/32px-Lead_Glass.png",
    },
  },
  LG: {
    jeweler: {
      key: "embellishment",
      name: "Embellishments",
      url: "/images/thumb/a/af/Embellishments.png/32px-Embellishments.png",
    },
    alchemist: {
      key: "elixier",
      name: "Elixirs",
      url: "/images/thumb/5/5c/Elixirs.png/32px-Elixirs.png",
    },
    glassblower: {
      key: "stained_glass",
      name: "Stained Glass",
      url: "/images/thumb/e/e2/Stained_Glass.png/32px-Stained_Glass.png",
    },
  },
} as const;

// ========================================
// CATÉGORISATION DES RESSOURCES
// ========================================

/**
 * Clé de bien → son entrée d'affichage (`key`, `name`, `url`).
 *
 * Dérivé de `goodsUrlByEra`, jamais redéclaré. Permet de retrouver le libellé
 * d'un bien à partir de sa seule clé, sans passer par l'atelier producteur —
 * utile quand le joueur n'a pas classé ses ateliers.
 */
export const GOOD_META_BY_KEY: Record<string, { key: string; name: string; url: string }> =
  Object.fromEntries(
    Object.values(goodsUrlByEra).flatMap((era) =>
      Object.values(era).map((meta) => [meta.key, meta]),
    ),
  );

// Priorités des goods par ère (primary, secondary, tertiary)
export const PRIORITY_TYPES = ["primary", "secondary", "tertiary"] as const;
export type PriorityType = (typeof PRIORITY_TYPES)[number];

/**
 * Créer une clé normalisée pour un good de priorité
 * Ex: makePriorityKey("primary", "CG") => "primary_cg"
 */
export function makePriorityKey(priority: PriorityType, era: EraAbbr): string {
  return `${priority}_${era.toLowerCase()}`;
}

// Le contrat « clé au format priority_era » vit désormais dans
// `resolvers/goods-keys.ts` (`isRankGoodKey` / `parseRankGoodKey`), seul
// endroit où la forme d'une clé de rang est décrite.

// Mapping des goods par civilisation pour le regroupement des other goods
export const goodsByCivilization: Record<
  string,
  { name: string; goods: string[] }
> = {
  EGYPT: {
    name: "EGYPT",
    goods: [
      "papyrus_scroll",
      "ankh",
      "golden_mask",
      "ceremonial_dress",
      "deben",
      "papyrus",
      "gold_ore",
    ],
  },
  CHINA: {
    name: "CHINA",
    goods: [
      "moth_cocoons",
      "silk_threads",
      "clay",
      "silk",
      "porcelain",
      "rice",
      "wu_zhu",
      "kaolin",
    ],
  },
  "MAYA EMPIRE": {
    name: "MAYA EMPIRE",
    goods: [
      "ancestor_mask",
      "headdress",
      "ritual_dagger",
      "calendar_stone",
      "cocoa",
      "jade",
      "obsidian",
      "feathers",
    ],
  },
  "VIKING KINGDOM": {
    name: "VIKING KINGDOM",
    goods: [
      "mead",
      "ceramic_treasure",
      "gold_treasure",
      "spice_treasure",
      "jewel_treasure",
      // ⚠️ `gem_treasure` — AJOUTÉ 07/09/2026, PAS UN REMPLACEMENT DE
      // `jewel_treasure` ICI. `source/gamedesign.json` ne porte plus aucune
      // occurrence de `jewel_treasure` (0/228 vs `gem_treasure`), ce qui
      // ressemble à un renommage en jeu — mais `jewel_treasure` reste utilisé
      // ailleurs dans ce dépôt (`data/allieds/vikings/*`, `data/capital/*`,
      // `scripts/extract/buildings.ts`) et n'a pas été audité pour ce
      // changement. Voir `resolvers/heritage-keeper-offers.ts` (doc de
      // `goodCandidates`) pour le contexte complet.
      "gem_treasure",
      "pennies",
      "stockfish",
      "fish",
      "honey",
    ],
  },
  ARABIA: {
    name: "ARABIA",
    goods: [
      "coffee",
      "oil_lamp",
      "incense",
      "carpet",
      "dirham",
      "oil",
      "cotton",
      "myrrh",
      "brass",
      "gold_dinar",
      "coffee_beans",
    ],
  },
  "OTTOMAN EMPIRE": {
    name: "OTTOMAN EMPIRE",
    goods: [
      "confection",
      "syrup",
      "wheat",
      "pomegranate",
      "apricot",
      "mohair",
      "tea",
      "brocade",
      "aspers",
    ],
  },
  ITEMS: {
    name: "ITEMS",
    goods: [
      "trade_city_diamond_upkey",
      "trade_city_platinum_upkey",
      "trade_city_gold_upkey",
      "trade_city_silver_upkey",
      "trade_city_advanced_upkey",
      "trade_village_diamond_upkey",
      "trade_village_platinum_upkey",
      "trade_village_gold_upkey",
      "trade_village_silver_upkey",
      "trade_village_advanced_upkey",
    ],
  },
};

// Helper: obtenir tous les items à exclure des main resources
export function getExcludedItems(): string[] {
  return goodsByCivilization.ITEMS.goods;
}

// Helper: vérifier si une ressource est une allied city resource
export function isAlliedCityResource(resourceType: string): boolean {
  return Object.values(goodsByCivilization).some((city) =>
    city.goods.includes(resourceType),
  );
}

export const formatColumns = [
  "coin",
  "coins",
  "pennies",
  "asper",
  "aspers",
  "cocoa",
  "wu zhu",
  "deben",
  "dirham",
  "rice",
  "food",
  "build cost",
];

export const skipColumns = [
  "level",
  "time",
  "max qty",
  "culture",
  "gallery",
  "size",
];

export const luxuriousBuilding = [
  "luxurious_home",
  "luxurious_farm",
  "luxurious_culture_site",
];

export const skipBuildingLimit = [
  "ranged_barracks",
  "siege_barracks",
  "cavalry_barracks",
  "heavy_infantry_barracks",
  "large_culture_site",
  "ottoman_empire_ship",
];

export const limitAlliedBuildingsByEra: Record<
  alliedCity,
  Record<string, Partial<Record<EraAbbr, number>>>
> = {
  egypt: {
    small_home: { ME: 8, CG: 12 },
    average_home: { ME: 4, CG: 6 },
    luxurious_home: { ME: 4, CG: 8 },
    papyrus_field: { ME: 2, CG: 4 },
    luxurious_papyrus_field: { ME: 1, CG: 3 },
    gold_mine: { ME: 2, CG: 4 },
    luxurious_gold_mine: { ME: 1, CG: 3 },
    papyrus_press: { ME: 2, CG: 3 },
    goldsmith: { ME: 2, CG: 3 },
    irrigation: { ME: 6, CG: 7 },
  },
  china: {
    small_home: { ER: 15, RE: 25 },
    average_home: { ER: 5, RE: 8 },
    luxurious_home: { ER: 5, RE: 11 },
    rice_farm: { ER: 6, RE: 12 },
    luxurious_rice_farm: { ER: 4, RE: 8 },
    workshops: { ER: 2, RE: 4 },
  },
  maya_empire: {
    worker_home: { BE: 15, AF: 23 },
    priest_home: { BE: 6, AF: 13 },
    luxurious_home: { BE: 5, AF: 5 },
    obsidian_quarry: { BE: 3, AF: 5 },
    jade_quarry: { BE: 3, AF: 5 },
    luxurious_quarry: { BE: 2, AF: 2 },
    average_aviary: { AF: 4 },
    luxurious_aviary: { AF: 1 },
    chronicler: { BE: 2, AF: 2 },
    mask_sculptor: { BE: 2, AF: 2 },
    ceremony_outfitter: { AF: 2 },
    ritual_carver: { AF: 3 },
    luxurious_workshop: { BE: 2, AF: 2 },
    ritual_sites: { BE: 7 },
  },
  viking_kingdom: {
    worker_home: { FA: 15, IE: 30 },
    sailor_home: { FA: 10, IE: 20 },
    luxurious_home: { FA: 5, IE: 10 },
    beehive: { FA: 11, IE: 21 },
    fishing_pier: { FA: 6, IE: 11 },
    luxurious_fishing_pier: { FA: 6, IE: 6 },
    tavern: { FA: 5, IE: 9 },
    expedition_pier: { FA: 3, IE: 3 },
    sailor_port: { IE: 3 },
    luxurious_sailor_port: { FA: 4, IE: 4 },
  },
  arabia: {
    medium_home: { KS: 13, HM: 26 },
    luxurious_home: { KS: 6, HM: 6 },
    merchant: { KS: 8, HM: 16 },
    luxurious_merchant: { KS: 4, HM: 4 },
    camel_farm: { KS: 5, HM: 10 },
    coffee_brewer: { KS: 2, HM: 2 },
    incense_maker: { KS: 2, HM: 2 },
    carpet_factory: { HM: 2 },
    oil_lamp_crafter: { HM: 2 },
    luxurious_workshop: { KS: 2, HM: 2 },
  },
  ottoman_empire: {},
};
