/**
 * Unified building catalog configuration - WITH ALL ERAS
 * Single source of truth for all building data
 * Images inherit from parent when empty
 */

import { eras } from "@/lib/constants";

export interface BuildingItem {
  id: string;
  name: string;
  type: "category" | "subcategory" | "building";
  imageUrl: string;
  children?: string[];
  metadata?: {
    maxLevel?: number;
    culture?: string;
    tier?: "small" | "medium" | "large" | "luxurious";
  };
}

/**
 * Generate technology entries dynamically from constants.ts
 */
function generateTechnologyEntries(): Record<string, BuildingItem> {
  const entries: Record<string, BuildingItem> = {};

  eras.forEach((era) => {
    entries[era.id] = {
      id: era.id,
      name: era.name,
      type: "building",
      imageUrl: "", // Will inherit from 'technology' category
      metadata: {
        // You can add era-specific metadata here if needed
      },
    };
  });

  return entries;
}

/**
 * Normalized building catalog
 * All items at the same level - relationships via children array
 */
export const BUILDING_CATALOG: Record<string, BuildingItem> = {
  // ROOT
  root: {
    id: "root",
    name: "Root",
    type: "category",
    imageUrl: "",
    children: [
      "technology",
      "capital",
      "egypt",
      "china",
      "arabia",
      "maya_empire",
      "viking_kingdom",
      "ottoman",
    ],
  },

  // MAIN CATEGORIES
  technology: {
    id: "technology",
    name: "Technos",
    type: "category",
    imageUrl: "/game_icons/icon_flat_research_points.webp",
    // Generate children IDs from eras
    children: eras.map((era) => era.id),
  },

  capital: {
    id: "capital",
    name: "Capital",
    type: "category",
    imageUrl: "/game_icons/icon_flat_museum.webp",
    children: ["homes", "farms", "barracks", "workshops", "culture_site", "harborHouses", "ships", "warehouses"],
  },

  egypt: {
    id: "egypt",
    name: "Egypt",
    type: "category",
    imageUrl: "/city_crest/icon_city_crest_egypt.webp",
    children: ["egypt_homes", "papyrus_fields", "gold_mines", "workshops", "irrigations"],
  },

  china: {
    id: "china",
    name: "China",
    type: "category",
    imageUrl: "/city_crest/icon_city_crest_china.webp",
    children: ["china_homes", "china_farms", "china_workshops"],
  },

  arabia: {
    id: "arabia",
    name: "Arabia",
    type: "category",
    imageUrl: "/city_crest/icon_city_crest_arabia.webp",
    children: ["arabia_homes", "arabia_merchants", "arabia_camelFarm", "arabia_workshops"],
  },

  maya_empire: {
    id: "maya_empire",
    name: "Maya",
    type: "category",
    imageUrl: "/city_crest/icon_city_crest_maya.webp",
    children: ["maya_homes", "maya_farms", "maya_quarries"],
  },

  viking_kingdom: {
    id: "viking_kingdom",
    name: "Vikings",
    type: "category",
    imageUrl: "/city_crest/icon_city_crest_vikings.webp",
    children: ["viking_homes", "viking_fishing_piers", "viking_workshops"],
  },

  ottoman: {
    id: "ottoman",
    name: "Ottoman",
    type: "category",
    imageUrl: "/city_crest/icon_city_crest_ottoman.webp",
    children: ["viking_homes", "viking_fishing_piers", "viking_workshops"],
  },

  // ==================== TECHNOLOGIES (GENERATED FROM constants.ts) ====================
  ...generateTechnologyEntries(),

  // ==================== CAPITAL ====================

  // CAPITAL SUBCATEGORIES
  homes: {
    id: "homes",
    name: "Homes",
    type: "subcategory",
    imageUrl: "/game_icons/icon_flat_home.webp",
    children: ["small_home", "average_home", "luxurious_home"],
  },

  farms: {
    id: "farms",
    name: "Farms",
    type: "subcategory",
    imageUrl: "/game_icons/icon_flat_farm.webp",
    children: ["rural_farm", "domestic_farm", "luxurious_farm"],
  },

  barracks: {
    id: "barracks",
    name: "Barracks",
    type: "subcategory",
    imageUrl: "/game_icons/icon_flat_barracks.webp",
    children: ["infantry_barracks", "ranged_barracks", "cavalry_barracks", "heavy_infantry_barracks", "siege_barracks"],
  },

  workshops: {
    id: "workshops",
    name: "Workshops",
    type: "subcategory",
    imageUrl: "/game_icons/icon_flat_workshop.webp",
    children: ["artisan", "stone_mason", "tailor", "scribe"],
  },

  culture_site: {
    id: "culture_site",
    name: "Cultural Sites",
    type: "subcategory",
    imageUrl: "/game_icons/icon_flat_cultureSite.webp",
    children: [
      "little_culture_site",
      "compact_culture_site",
      "moderate_culture_site",
    ],
  },

  harborHouses: {
    id: "harborHouses",
    name: "Harbor Houses",
    type: "subcategory",
    imageUrl: "/game_icons/icon_flat_sailorHome.webp",
    children: ["seafarer_house", "luxurious_seafarer_house"],
  },

  ships: {
    id: "ships",
    name: "Ships",
    type: "subcategory",
    imageUrl: "/game_icons/icon_flat_shipyard.webp",
    children: ["shipyard"],
  },

  warehouses: {
    id: "warehouses",
    name: "Warehouses",
    type: "subcategory",
    imageUrl: "/game_icons/icon_flat_warehouse.webp",
    children: ["common_warehouse", "large_warehouse"],
  },

  // CAPITAL BUILDINGS - Homes (inherit from 'homes')
  small_home: {
    id: "small_home",
    name: "Small Home",
    type: "building",
    imageUrl: "",
    metadata: { tier: "small", maxLevel: 42 },
  },

  average_home: {
    id: "average_home",
    name: "Average Home",
    type: "building",
    imageUrl: "",
    metadata: { tier: "medium", maxLevel: 42 },
  },

  luxurious_home: {
    id: "luxurious_home",
    name: "Luxurious Home",
    type: "building",
    imageUrl: "",
    metadata: { tier: "luxurious", maxLevel: 42 },
  },

  // CAPITAL BUILDINGS - Farms (inherit from 'farms')
  rural_farm: {
    id: "rural_farm",
    name: "Rural Farm",
    type: "building",
    imageUrl: "",
    metadata: { tier: "small", maxLevel: 39 },
  },

  domestic_farm: {
    id: "domestic_farm",
    name: "Domestic Farm",
    type: "building",
    imageUrl: "",
    metadata: { tier: "medium", maxLevel: 39 },
  },

  luxurious_farm: {
    id: "luxurious_farm",
    name: "Luxurious Farm",
    type: "building",
    imageUrl: "",
    metadata: { tier: "luxurious", maxLevel: 39 },
  },

  // CAPITAL BUILDINGS - Barracks (inherit from 'barracks')
  infantry_barracks: {
    id: "infantry_barracks",
    name: "Infantry Barracks",
    type: "building",
    imageUrl: "",
    metadata: { maxLevel: 14 },
  },

  ranged_barracks: {
    id: "ranged_barracks",
    name: "Ranged Barracks",
    type: "building",
    imageUrl: "",
    metadata: { maxLevel: 14 },
  },

  cavalry_barracks: {
    id: "cavalry_barracks",
    name: "Cavalry Barracks",
    type: "building",
    imageUrl: "",
    metadata: { maxLevel: 14 },
  },

  siege_barracks: {
    id: "siege_barracks",
    name: "Siege Barracks",
    type: "building",
    imageUrl: "",
    metadata: { maxLevel: 14 },
  },

  heavy_infantry_barracks: {
    id: "heavy_infantry_barracks",
    name: "Heavy Infantry Barracks",
    type: "building",
    imageUrl: "",
    metadata: { maxLevel: 14 },
  },

  // CAPITAL BUILDINGS - Workshops (inherit from 'workshops')
  artisan: {
    id: "artisan",
    name: "Artisan",
    type: "building",
    imageUrl: "",
    metadata: { maxLevel: 5 },
  },

  stone_mason: {
    id: "stone_mason",
    name: "Stone Mason",
    type: "building",
    imageUrl: "",
    metadata: { maxLevel: 5 },
  },

  tailor: {
    id: "tailor",
    name: "Tailor",
    type: "building",
    imageUrl: "",
    metadata: { maxLevel: 5 },
  },

  scribe: {
    id: "scribe",
    name: "Scribe",
    type: "building",
    imageUrl: "",
    metadata: { maxLevel: 6 },
  },

  spice_merchant: {
    id: "spice_merchant",
    name: "Spice Merchant",
    type: "building",
    imageUrl: "",
    metadata: { maxLevel: 6 },
  },

  // CAPITAL BUILDINGS - Culture Sites (inherit from 'culture_site')
  little_culture_site: {
    id: "little_culture_site",
    name: "Little Culture Site",
    type: "building",
    imageUrl: "",
    metadata: { tier: "small", maxLevel: 39 },
  },

  compact_culture_site: {
    id: "compact_culture_site",
    name: "Compact Culture Site",
    type: "building",
    imageUrl: "",
    metadata: { tier: "medium", maxLevel: 39 },
  },

  moderate_culture_site: {
    id: "moderate_culture_site",
    name: "Moderate Culture Site",
    type: "building",
    imageUrl: "",
    metadata: { tier: "large", maxLevel: 39 },
  },

  // ==================== EGYPT ====================

  // EGYPT SUBCATEGORIES
  egypt_homes: {
    id: "egypt_homes",
    name: "Homes",
    type: "subcategory",
    imageUrl: "/game_icons/icon_flat_home.webp",
    children: [
      "egypt_small_home",
      "egypt_average_home",
      "egypt_luxurious_home",
    ],
    metadata: { culture: "egypt" },
  },

  papyrus_fields: {
    id: "papyrus_fields",
    name: "Papyrus Fields",
    type: "subcategory",
    imageUrl: "/game_icons/icon_flat_farm.webp",
    children: ["papyrus_field", "luxurious_papyrus_field"],
    metadata: { culture: "egypt" },
  },

  gold_mines: {
    id: "gold_mines",
    name: "Gold Mines",
    type: "subcategory",
    imageUrl: "/game_icons/icon_flat_workshop.webp",
    children: ["gold_mine", "luxurious_gold_mine"],
    metadata: { culture: "egypt" },
  },

  // EGYPT BUILDINGS (inherit from subcategories)
  egypt_small_home: {
    id: "egypt_small_home",
    name: "Small Home",
    type: "building",
    imageUrl: "",
    metadata: { culture: "egypt", tier: "small", maxLevel: 5 },
  },

  egypt_average_home: {
    id: "egypt_average_home",
    name: "Average Home",
    type: "building",
    imageUrl: "",
    metadata: { culture: "egypt", tier: "medium", maxLevel: 5 },
  },

  egypt_luxurious_home: {
    id: "egypt_luxurious_home",
    name: "Luxurious Home",
    type: "building",
    imageUrl: "",
    metadata: { culture: "egypt", tier: "luxurious", maxLevel: 5 },
  },

  papyrus_field: {
    id: "papyrus_field",
    name: "Papyrus Field",
    type: "building",
    imageUrl: "",
    metadata: { culture: "egypt", maxLevel: 5 },
  },

  luxurious_papyrus_field: {
    id: "luxurious_papyrus_field",
    name: "Luxurious Papyrus Field",
    type: "building",
    imageUrl: "",
    metadata: { culture: "egypt", tier: "luxurious", maxLevel: 5 },
  },

  gold_mine: {
    id: "gold_mine",
    name: "Gold Mine",
    type: "building",
    imageUrl: "",
    metadata: { culture: "egypt", maxLevel: 5 },
  },

  luxurious_gold_mine: {
    id: "luxurious_gold_mine",
    name: "Luxurious Gold Mine",
    type: "building",
    imageUrl: "",
    metadata: { culture: "egypt", tier: "luxurious", maxLevel: 5 },
  },

  // ==================== CHINA ====================

  // CHINA SUBCATEGORIES
  china_homes: {
    id: "china_homes",
    name: "Homes",
    type: "subcategory",
    imageUrl: "/game_icons/icon_flat_home.webp",
    children: [
      "china_small_home",
      "china_average_home",
      "china_luxurious_home",
    ],
    metadata: { culture: "china" },
  },

  china_farms: {
    id: "china_farms",
    name: "Farms",
    type: "subcategory",
    imageUrl: "/game_icons/icon_flat_riceFarm.webp",
    children: ["rice_farm", "luxurious_rice_farm"],
    metadata: { culture: "china" },
  },

  china_workshops: {
    id: "china_workshops",
    name: "Workshops",
    type: "subcategory",
    imageUrl: "/game_icons/icon_flat_workshop.webp",
    children: ["silk_workshop", "porcelain_workshop"],
    metadata: { culture: "china" },
  },

  // CHINA BUILDINGS (inherit from subcategories)
  china_small_home: {
    id: "china_small_home",
    name: "Small Home",
    type: "building",
    imageUrl: "",
    metadata: { culture: "china", tier: "small", maxLevel: 5 },
  },

  china_average_home: {
    id: "china_average_home",
    name: "Average Home",
    type: "building",
    imageUrl: "",
    metadata: { culture: "china", tier: "medium", maxLevel: 5 },
  },

  china_luxurious_home: {
    id: "china_luxurious_home",
    name: "Luxurious Home",
    type: "building",
    imageUrl: "",
    metadata: { culture: "china", tier: "luxurious", maxLevel: 5 },
  },

  rice_farm: {
    id: "rice_farm",
    name: "Rice Farm",
    type: "building",
    imageUrl: "",
    metadata: { culture: "china", maxLevel: 5 },
  },

  luxurious_rice_farm: {
    id: "luxurious_rice_farm",
    name: "Luxurious Rice Farm",
    type: "building",
    imageUrl: "",
    metadata: { culture: "china", tier: "luxurious", maxLevel: 5 },
  },

  silk_workshop: {
    id: "silk_workshop",
    name: "Silk Workshop",
    type: "building",
    imageUrl: "",
    metadata: { culture: "china", maxLevel: 5 },
  },

  porcelain_workshop: {
    id: "porcelain_workshop",
    name: "Porcelain Workshop",
    type: "building",
    imageUrl: "",
    metadata: { culture: "china", maxLevel: 5 },
  },

  // ==================== ARABIA ====================

  arabia_homes: {
    id: "arabia_homes",
    name: "Homes",
    type: "subcategory",
    imageUrl: "/game_icons/icon_flat_home.webp",
    children: ["arabia_medium_home", "arabia_luxurious_home"],
    metadata: { culture: "arabia" },
  },

  arabia_merchants: {
    id: "arabia_merchants",
    name: "Merchants",
    type: "subcategory",
    imageUrl: "/game_icons/icon_flat_merchant.webp",
    children: ["arabia_merchant", "arabia_luxurious_merchant"],
    metadata: { culture: "arabia" },
  },

  arabia_camelFarm: {
    id: "arabia_camelFarm",
    name: "Camel Farm",
    type: "subcategory",
    imageUrl: "/game_icons/icon_flat_camelFarm.webp",
    children: ["arabia_camelFarm", "arabia_luxurious_camelFarm"],
    metadata: { culture: "arabia" },
  },

  arabia_workshops: {
    id: "arabia_workshops",
    name: "Workshops",
    type: "subcategory",
    imageUrl: "/game_icons/icon_flat_workshop.webp",
    children: ["coffee_brewer", "incense_maker"],
    metadata: { culture: "arabia" },
  },

  arabia_medium_home: {
    id: "arabia_medium_home",
    name: "Medium Home",
    type: "building",
    imageUrl: "",
    metadata: { culture: "arabia" },
  },

  arabia_luxurious_home: {
    id: "arabia_luxurious_home",
    name: "Luxurious Home",
    type: "building",
    imageUrl: "",
    metadata: { culture: "arabia" },
  },

  arabia_merchant: {
    id: "arabia_merchant",
    name: "Merchant",
    type: "building",
    imageUrl: "",
    metadata: { culture: "arabia" },
  },

  arabia_luxurious_merchant: {
    id: "arabia_luxurious_merchant",
    name: "Luxurious Merchant",
    type: "building",
    imageUrl: "",
    metadata: { culture: "arabia" },
  },

  coffee_brewer: {
    id: "coffee_brewer",
    name: "Coffee Brewer",
    type: "building",
    imageUrl: "",
    metadata: { culture: "arabia" },
  },

  incense_maker: {
    id: "incense_maker",
    name: "Incense Maker",
    type: "building",
    imageUrl: "",
    metadata: { culture: "arabia" },
  },

  // ==================== MAYA ====================

  maya_homes: {
    id: "maya_homes",
    name: "Homes",
    type: "subcategory",
    imageUrl: "/game_icons/icon_flat_home.webp",
    children: ["maya_small_home", "maya_average_home"],
    metadata: { culture: "maya" },
  },

  maya_farms: {
    id: "maya_farms",
    name: "Farms",
    type: "subcategory",
    imageUrl: "/game_icons/icon_flat_farm.webp",
    children: ["maya_farm", "maya_luxurious_farm"],
    metadata: { culture: "maya" },
  },

  maya_quarries: {
    id: "maya_quarries",
    name: "Quarries",
    type: "subcategory",
    imageUrl: "/game_icons/icon_flat_workshop.webp",
    children: ["maya_obsidian_quarry", "maya_jade_quarry"],
    metadata: { culture: "maya" },
  },

  maya_small_home: {
    id: "maya_small_home",
    name: "Small Home",
    type: "building",
    imageUrl: "",
    metadata: { culture: "maya" },
  },

  maya_average_home: {
    id: "maya_average_home",
    name: "Average Home",
    type: "building",
    imageUrl: "",
    metadata: { culture: "maya" },
  },

  maya_farm: {
    id: "maya_farm",
    name: "Farm",
    type: "building",
    imageUrl: "",
    metadata: { culture: "maya" },
  },

  maya_luxurious_farm: {
    id: "maya_luxurious_farm",
    name: "Luxurious Farm",
    type: "building",
    imageUrl: "",
    metadata: { culture: "maya" },
  },

  maya_obsidian_quarry: {
    id: "maya_obsidian_quarry",
    name: "Obsidian Quarry",
    type: "building",
    imageUrl: "",
    metadata: { culture: "maya" },
  },

  maya_jade_quarry: {
    id: "maya_jade_quarry",
    name: "Jade Quarry",
    type: "building",
    imageUrl: "",
    metadata: { culture: "maya" },
  },

  // ==================== VIKING ====================

  viking_homes: {
    id: "viking_homes",
    name: "Homes",
    type: "subcategory",
    imageUrl: "/game_icons/icon_flat_home.webp",
    children: ["viking_worker_home", "viking_sailor_home"],
    metadata: { culture: "viking" },
  },

  viking_fishing_piers: {
    id: "viking_fishing_piers",
    name: "Fishing Piers",
    type: "subcategory",
    imageUrl: "/game_icons/icon_flat_farm.webp",
    children: ["viking_fishing_pier", "viking_luxurious_fishing_pier"],
    metadata: { culture: "viking" },
  },

  viking_workshops: {
    id: "viking_workshops",
    name: "Workshops",
    type: "subcategory",
    imageUrl: "/game_icons/icon_flat_workshop.webp",
    children: ["viking_tavern", "viking_sailor_port"],
    metadata: { culture: "viking" },
  },

  viking_worker_home: {
    id: "viking_worker_home",
    name: "Worker Home",
    type: "building",
    imageUrl: "",
    metadata: { culture: "viking" },
  },

  viking_sailor_home: {
    id: "viking_sailor_home",
    name: "Sailor Home",
    type: "building",
    imageUrl: "",
    metadata: { culture: "viking" },
  },

  viking_fishing_pier: {
    id: "viking_fishing_pier",
    name: "Fishing Pier",
    type: "building",
    imageUrl: "",
    metadata: { culture: "viking" },
  },

  viking_luxurious_fishing_pier: {
    id: "viking_luxurious_fishing_pier",
    name: "Luxurious Fishing Pier",
    type: "building",
    imageUrl: "",
    metadata: { culture: "viking" },
  },

  viking_tavern: {
    id: "viking_tavern",
    name: "Tavern",
    type: "building",
    imageUrl: "",
    metadata: { culture: "viking" },
  },

  viking_sailor_port: {
    id: "viking_sailor_port",
    name: "Sailor Port",
    type: "building",
    imageUrl: "",
    metadata: { culture: "viking" },
  },
};

/**
 * Image resolution with smart inheritance
 * OPTIMIZED: No cascade, direct lookup
 */
export const FALLBACK_IMAGE = "/game_icons/icon_flat_home.webp";

/**
 * Parent lookup cache (built once)
 */
const PARENT_CACHE = new Map<string, string>();

// Build cache on module load
for (const [parentId, item] of Object.entries(BUILDING_CATALOG)) {
  if (item.children) {
    for (const childId of item.children) {
      PARENT_CACHE.set(childId, parentId);
    }
  }
}

/**
 * Get image URL with smart inheritance - OPTIMIZED
 * Performance: O(1) lookup, no recursive search
 */
export const getImageUrl = (itemId: string): string => {
  const item = BUILDING_CATALOG[itemId];
  if (!item) return FALLBACK_IMAGE;

  // 1. Use item's own imageUrl if it's a local path
  if (item.imageUrl && item.imageUrl.startsWith("/")) {
    return item.imageUrl;
  }

  // 2. Inherit from parent (single lookup)
  const parentId = PARENT_CACHE.get(itemId);
  if (parentId) {
    const parent = BUILDING_CATALOG[parentId];
    if (parent?.imageUrl && parent.imageUrl.startsWith("/")) {
      return parent.imageUrl;
    }
  }

  // 3. Fallback
  return FALLBACK_IMAGE;
};

/**
 * Utility functions for catalog navigation
 */
export const getCatalogItem = (id: string): BuildingItem | undefined => {
  return BUILDING_CATALOG[id];
};

export const getChildren = (parentId: string): BuildingItem[] => {
  const parent = BUILDING_CATALOG[parentId];
  if (!parent?.children) return [];

  return parent.children
    .map((childId) => BUILDING_CATALOG[childId])
    .filter(Boolean);
};

export const getCategories = (): BuildingItem[] => {
  return getChildren("root");
};
