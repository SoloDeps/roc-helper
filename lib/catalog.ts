// ============================================================================
// TYPES
// ============================================================================

export type ItemType = "category" | "subcategory" | "building" | "era";
export type CatalogItem = Category | Subcategory | Building | Era;

export type ImageType = keyof typeof imagesUrl;

export interface Building {
  id: string;
  name: string;
  culture?: string;
  imgType: ImageType;
}

export interface Subcategory {
  id: string;
  name: string;
  imgType: ImageType;
  buildings: Building[];
}

export interface Category {
  id: string;
  name: string;
  imgType?: ImageType;
  invertColor?: boolean;
  subcategories?: Subcategory[];
  items?: "@eras";
}

export interface Era {
  abbr: string;
  id: string;
  name: string;
  image: string;
}

/**
 * Item affichable dans la navigation (UI)
 * → permet de mixer Subcategory et Era sans casser TS
 */
export interface NavigableItem {
  id: string;
  name: string;
  imgType?: ImageType;
  image?: string;
  invertColor?: boolean;
}

// ============================================================================
// CONSTANTS
// ============================================================================

export const FALLBACK_IMAGE = "/game_icons/icon_flat_home.webp";

export const ERAS: Era[] = [
  {
    abbr: "SA",
    id: "stone_age",
    name: "Stone Age",
    image: "/eras/1_SA_cover.webp",
  },
  {
    abbr: "BA",
    id: "bronze_age",
    name: "Bronze Age",
    image: "/eras/2_BA_cover.webp",
  },
  {
    abbr: "ME",
    id: "minoan_era",
    name: "Minoan Era",
    image: "/eras/3_ME_cover.webp",
  },
  {
    abbr: "CG",
    id: "classical_greece",
    name: "Classical Greece",
    image: "/eras/4_CG_cover.webp",
  },
  {
    abbr: "ER",
    id: "early_rome",
    name: "Early Rome",
    image: "/eras/5_ER_cover.webp",
  },
  {
    abbr: "RE",
    id: "roman_empire",
    name: "Roman Empire",
    image: "/eras/6_RE_cover.webp",
  },
  {
    abbr: "BE",
    id: "byzantine_era",
    name: "Byzantine Era",
    image: "/eras/7_BE_cover.webp",
  },
  {
    abbr: "AF",
    id: "age_of_the_franks",
    name: "Age of the Franks",
    image: "/eras/8_AoF_cover.webp",
  },
  {
    abbr: "FA",
    id: "feudal_age",
    name: "Feudal Age",
    image: "/eras/9_FA_cover.webp",
  },
  {
    abbr: "IE",
    id: "iberian_era",
    name: "Iberian Era",
    image: "/eras/10_IE_cover.webp",
  },
  {
    abbr: "KS",
    id: "kingdom_of_sicily",
    name: "Kingdom of Sicily",
    image: "/eras/11_KoS_cover.webp",
  },
  {
    abbr: "HM",
    id: "high_middle_ages",
    name: "High Middle Ages",
    image: "/eras/12_HMA_cover.webp",
  },
  {
    abbr: "EG",
    id: "early_gothic_era",
    name: "Early Gothic Era",
    image: "/eras/13_EGE_cover.webp",
  },
  {
    abbr: "LG",
    id: "late_gothic_era",
    name: "Late Gothic Era",
    image: "/eras/14_LGE_cover.webp",
  },
];

export const imagesUrl = {
  home: "/game_icons/icon_flat_home.webp",
  farm: "/game_icons/icon_flat_farm.webp",
  museum: "/game_icons/icon_flat_museum.webp",
  research: "/game_icons/icon_flat_research_points.webp",
  barracks: "/game_icons/icon_flat_barracks.webp",
  cultureSite: "/game_icons/icon_flat_cultureSite.webp",
  info: "/game_icons/icon_flat_info.webp",
  workshop: "/game_icons/icon_flat_workshop.webp",
  shipyard: "/game_icons/icon_flat_shipyard.webp",
  warehouse: "/game_icons/icon_flat_warehouse.webp",
  scout: "/game_icons/icon_flat_scout.webp",
  sailorHome: "/game_icons/icon_flat_sailorHome.webp",
  goldMine: "/game_icons/icon_flat_goldMine.webp",
  papyrusField: "/game_icons/icon_flat_papyrusField.webp",
  riceFarm: "/game_icons/icon_flat_riceFarm.webp",
  aviary: "/game_icons/icon_flat_aviary.webp",
  quarry: "/game_icons/icon_flat_quarry.webp",
  ritualSite: "/game_icons/icon_flat_ritualSite.webp",
  beehive: "/game_icons/icon_flat_beehive.webp",
  fishingPier: "/game_icons/icon_flat_fishingPier.webp",
  expeditionPier: "/game_icons/icon_flat_expeditionPier.webp",
  runestone: "/game_icons/icon_flat_runestone.webp",
  tavern: "/game_icons/icon_flat_tavern.webp",
  camelFarm: "/game_icons/icon_flat_camelFarm.webp",
  irrigation: "/game_icons/icon_flat_irrigation.webp",
  merchant: "/game_icons/icon_flat_merchant.webp",
  // crests
  china: "/city_crest/icon_city_crest_china.webp",
  arabia: "/city_crest/icon_city_crest_arabia.webp",
  egypt: "/city_crest/icon_city_crest_egypt.webp",
  maya: "/city_crest/icon_city_crest_maya.webp",
  ottoman: "/city_crest/icon_city_crest_ottoman.webp",
  vikings: "/city_crest/icon_city_crest_vikings.webp",
} as const;

// ============================================================================
// CATALOG
// ============================================================================

export const CATALOG: Category[] = [
  {
    id: "capital",
    name: "Capital",
    imgType: "museum",
    subcategories: [
      {
        id: "homes",
        name: "Homes",
        imgType: "home",
        buildings: [
          { id: "small_home", name: "Small Home", imgType: "home" },
          { id: "average_home", name: "Average Home", imgType: "home" },
          { id: "luxurious_home", name: "Luxurious Home", imgType: "home" },
        ],
      },
      {
        id: "farms",
        name: "Farms",
        imgType: "farm",
        buildings: [
          { id: "rural_farm", name: "Rural Farm", imgType: "farm" },
          { id: "domestic_farm", name: "Domestic Farm", imgType: "farm" },
          { id: "luxurious_farm", name: "Luxurious Farm", imgType: "farm" },
        ],
      },
      {
        id: "barracks",
        name: "Barracks",
        imgType: "barracks",
        buildings: [
          { id: "infantry_barracks", name: "Infantry Barracks", imgType: "barracks" },
          { id: "ranged_barracks", name: "Ranged Barracks", imgType: "barracks" },
          { id: "cavalry_barracks", name: "Cavalry Barracks", imgType: "barracks" },
          { id: "heavy_infantry_barracks", name: "Heavy Infantry Barracks", imgType: "barracks" },
          { id: "siege_barracks", name: "Siege Barracks", imgType: "barracks" },
        ],
      },
      {
        id: "workshops",
        name: "Workshops",
        imgType: "workshop",
        buildings: [
          { id: "artisan", name: "Artisan", imgType: "workshop" },
          { id: "stone_mason", name: "Stone Mason", imgType: "workshop" },
          { id: "tailor", name: "Tailor", imgType: "workshop" },
          { id: "scribe", name: "Scribe", imgType: "workshop" },
          { id: "carpenter", name: "Carpenter", imgType: "workshop" },
          { id: "spice_merchant", name: "Spice Merchant", imgType: "workshop" },
          { id: "jeweler", name: "Jeweler", imgType: "workshop" },
          { id: "alchemist", name: "Alchemist", imgType: "workshop" },
          { id: "glassblower", name: "Glassblower", imgType: "workshop" },
        ],
      },
      {
        id: "culture_site",
        name: "Cultural Sites", 
        imgType: "cultureSite",
        buildings: [
          { id: "little_culture_site", name: "Little Cultural Site", imgType: "cultureSite" },
          { id: "compact_culture_site", name: "Compact Cultural Site", imgType: "cultureSite" },
          { id: "moderate_culture_site", name: "Moderate Cultural Site", imgType: "cultureSite" },
          { id: "large_culture_site", name: "Large Cultural Site", imgType: "cultureSite" },
          { id: "luxurious_culture_site", name: "Luxurious Cultural Site", imgType: "cultureSite" },
        ],
      },
      {
        id: "harborHouses",
        name: "Harbor Houses",
        imgType: "sailorHome",
        buildings: [
          { id: "seafarer_house", name: "Seafarer House", imgType: "sailorHome" },
          { id: "luxurious_seafarer_house", name: "Luxurious Seafarer House", imgType: "sailorHome" },
        ],
      },
      {
        id: "ships",
        name: "Ships",
        imgType: "shipyard",
        buildings: [
          { id: "shipyard", name: "Shipyard", imgType: "shipyard" },
        ],
      },
      {
        id: "warehouses",
        name: "Warehouses",
        imgType: "warehouse",
        buildings: [
          { id: "common_warehouse", name: "Common Warehouse", imgType: "warehouse" },
          { id: "large_warehouse", name: "Large Warehouse", imgType: "warehouse" },
        ],
      },
    ],
  },
  {
    id: "technology",
    name: "Technology",
    imgType: "research",
    items: "@eras", // Special case: use eras instead of subcategories
  },
  {
    id: "egypt",
    name: "Egypt",
    imgType: "egypt",
    invertColor: false,
    subcategories: [
      {
        id: "homes",
        name: "Homes",
        imgType: "home",
        buildings: [
          { id: "small_home", name: "Small Home", imgType: "home" },
          { id: "average_home", name: "Average Home", imgType: "home" },
          { id: "luxurious_home", name: "Luxurious Home", imgType: "home" },
        ],
      },
      {
        id: "farms",
        name: "Farms",
        imgType: "farm",
        buildings: [
          { id: "rural_farm", name: "Rural Farm", imgType: "farm" },
          { id: "domestic_farm", name: "Domestic Farm", imgType: "farm" },
          { id: "luxurious_farm", name: "Luxurious Farm", imgType: "farm" },
        ],
      },
    ],
  },
  {
    id: "china",
    name: "China",
    imgType: "china",
    invertColor: false,
    subcategories: [
      {
        id: "homes",
        name: "Homes",
        imgType: "home",
        buildings: [
          { id: "small_home", name: "Small Home", imgType: "home" },
          { id: "average_home", name: "Average Home", imgType: "home" },
          { id: "luxurious_home", name: "Luxurious Home", imgType: "home" },
        ],
      },
      {
        id: "farms",
        name: "Farms",
        imgType: "farm",
        buildings: [
          { id: "rural_farm", name: "Rural Farm", imgType: "farm" },
          { id: "domestic_farm", name: "Domestic Farm", imgType: "farm" },
          { id: "luxurious_farm", name: "Luxurious Farm", imgType: "farm" },
        ],
      },
    ],
  },
  {
    id: "maya",
    name: "Maya",
    imgType: "maya",
    invertColor: false,
    subcategories: [
      {
        id: "homes",
        name: "Homes",
        imgType: "home",
        buildings: [
          { id: "small_home", name: "Small Home", imgType: "home" },
          { id: "average_home", name: "Average Home", imgType: "home" },
          { id: "luxurious_home", name: "Luxurious Home", imgType: "home" },
        ],
      },
      {
        id: "farms",
        name: "Farms",
        imgType: "farm",
        buildings: [
          { id: "rural_farm", name: "Rural Farm", imgType: "farm" },
          { id: "domestic_farm", name: "Domestic Farm", imgType: "farm" },
          { id: "luxurious_farm", name: "Luxurious Farm", imgType: "farm" },
        ],
      },
    ],
  },
  {
    id: "vikings",
    name: "Vikings",
    imgType: "vikings",
    invertColor: false,
    subcategories: [
      {
        id: "homes",
        name: "Homes",
        imgType: "home",
        buildings: [
          { id: "small_home", name: "Small Home", imgType: "home" },
          { id: "average_home", name: "Average Home", imgType: "home" },
          { id: "luxurious_home", name: "Luxurious Home", imgType: "home" },
        ],
      },
      {
        id: "farms",
        name: "Farms",
        imgType: "farm",
        buildings: [
          { id: "rural_farm", name: "Rural Farm", imgType: "farm" },
          { id: "domestic_farm", name: "Domestic Farm", imgType: "farm" },
          { id: "luxurious_farm", name: "Luxurious Farm", imgType: "farm" },
        ],
      },
    ],
  },
  {
    id: "arabia",
    name: "Arabia",
    imgType: "arabia",
    invertColor: false,
    subcategories: [
      {
        id: "homes",
        name: "Homes",
        imgType: "home",
        buildings: [
          { id: "small_home", name: "Small Home", imgType: "home" },
          { id: "average_home", name: "Average Home", imgType: "home" },
          { id: "luxurious_home", name: "Luxurious Home", imgType: "home" },
        ],
      },
      {
        id: "farms",
        name: "Farms",
        imgType: "farm",
        buildings: [
          { id: "rural_farm", name: "Rural Farm", imgType: "farm" },
          { id: "domestic_farm", name: "Domestic Farm", imgType: "farm" },
          { id: "luxurious_farm", name: "Luxurious Farm", imgType: "farm" },
        ],
      },
    ],
  },
  {
    id: "ottoman",
    name: "Ottoman",
    imgType: "ottoman",
    invertColor: false,
    subcategories: [
      {
        id: "homes",
        name: "Homes",
        imgType: "home",
        buildings: [
          { id: "small_home", name: "Small Home", imgType: "home" },
          { id: "average_home", name: "Average Home", imgType: "home" },
          { id: "luxurious_home", name: "Luxurious Home", imgType: "home" },
        ],
      },
      {
        id: "farms",
        name: "Farms",
        imgType: "farm",
        buildings: [
          { id: "rural_farm", name: "Rural Farm", imgType: "farm" },
          { id: "domestic_farm", name: "Domestic Farm", imgType: "farm" },
          { id: "luxurious_farm", name: "Luxurious Farm", imgType: "farm" },
        ],
      },
    ],
  },
];

// ============================================================================
// NAVIGATION
// ============================================================================

export function getCategories(): Category[] {
  return CATALOG;
}

export function getCategory(id: string): Category | undefined {
  return CATALOG.find((cat) => cat.id === id);
}

/**
 * ✅ retourne des items navigables (Subcategory OU Era)
 */
export function getSubcategories(categoryId: string): NavigableItem[] {
  const category = getCategory(categoryId);

  if (category?.items === "@eras") {
    return ERAS.map((era) => ({
      id: era.id,
      name: era.name,
      imgType: "research",
    }));
  }

  return (
    category?.subcategories?.map((sub) => ({
      id: sub.id,
      name: sub.name,
      imgType: sub.imgType,
    })) || []
  );
}

export function getBuildings(
  categoryId: string,
  subcategoryId: string,
): Building[] {
  const category = getCategory(categoryId);
  const subcategory = category?.subcategories?.find(
    (sub) => sub.id === subcategoryId,
  );
  return subcategory?.buildings || [];
}

export function getCatalogItem(id: string): CatalogItem | undefined {
  const category = getCategory(id);
  if (category) return category;

  for (const cat of CATALOG) {
    for (const sub of cat.subcategories || []) {
      if (sub.id === id) return sub;
      const building = sub.buildings.find((b) => b.id === id);
      if (building) return building;
    }
  }

  return ERAS.find((e) => e.id === id);
}

// ============================================================================
// IMAGE RESOLVER
// ============================================================================

export function getImageForItem(item: { imgType: ImageType }): string {
  return imagesUrl[item.imgType] || FALLBACK_IMAGE;
}
