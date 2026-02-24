// #region TYPES
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
// #endregion

// ============================================================================
// CONSTANTS
// ============================================================================

export const FALLBACK_IMAGE = "/images/game_icons/icon_flat_home.webp";

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
  home: "/images/game_icons/icon_flat_home.webp",
  farm: "/images/game_icons/icon_flat_farm.webp",
  museum: "/images/game_icons/icon_flat_museum.webp",
  research: "/images/game_icons/icon_flat_research_points.webp",
  barracks: "/images/game_icons/icon_flat_barracks.webp",
  cultureSite: "/images/game_icons/icon_flat_cultureSite.webp",
  info: "/images/game_icons/icon_flat_info.webp",
  workshop: "/images/game_icons/icon_flat_workshop.webp",
  shipyard: "/images/game_icons/icon_flat_shipyard.webp",
  warehouse: "/images/game_icons/icon_flat_warehouse.webp",
  scout: "/images/game_icons/icon_flat_scout.webp",
  sailorHome: "/images/game_icons/icon_flat_sailorHome.webp",
  goldMine: "/images/game_icons/icon_flat_goldMine.webp",
  papyrusField: "/images/game_icons/icon_flat_papyrusField.webp",
  riceFarm: "/images/game_icons/icon_flat_riceFarm.webp",
  aviary: "/images/game_icons/icon_flat_aviary.webp",
  quarry: "/images/game_icons/icon_flat_quarry.webp",
  ritualSite: "/images/game_icons/icon_flat_ritualSite.webp",
  beehive: "/images/game_icons/icon_flat_beehive.webp",
  fishingPier: "/images/game_icons/icon_flat_fishingPier.webp",
  expeditionPier: "/images/game_icons/icon_flat_expeditionPier.webp",
  runestone: "/images/game_icons/icon_flat_runestone.webp",
  tavern: "/images/game_icons/icon_flat_tavern.webp",
  camelFarm: "/images/game_icons/icon_flat_camelFarm.webp",
  irrigation: "/images/game_icons/icon_flat_irrigation.webp",
  merchant: "/images/game_icons/icon_flat_merchant.webp",
  // crests
  china: "/images/city_crest/icon_city_crest_china.webp",
  arabia: "/images/city_crest/icon_city_crest_arabia.webp",
  egypt: "/images/city_crest/icon_city_crest_egypt.webp",
  maya: "/images/city_crest/icon_city_crest_maya.webp",
  ottoman: "/images/city_crest/icon_city_crest_ottoman.webp",
  vikings: "/images/city_crest/icon_city_crest_vikings.webp",
} as const;

// ============================================================================
// CATALOG
// ============================================================================

export const CATALOG: Category[] = [
  // capital
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
          {
            id: "infantry_barracks",
            name: "Infantry Barracks",
            imgType: "barracks",
          },
          {
            id: "ranged_barracks",
            name: "Ranged Barracks",
            imgType: "barracks",
          },
          {
            id: "cavalry_barracks",
            name: "Cavalry Barracks",
            imgType: "barracks",
          },
          {
            id: "heavy_infantry_barracks",
            name: "Heavy Infantry Barracks",
            imgType: "barracks",
          },
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
          {
            id: "little_culture_site",
            name: "Little Cultural Site",
            imgType: "cultureSite",
          },
          {
            id: "compact_culture_site",
            name: "Compact Cultural Site",
            imgType: "cultureSite",
          },
          {
            id: "moderate_culture_site",
            name: "Moderate Cultural Site",
            imgType: "cultureSite",
          },
          {
            id: "large_culture_site",
            name: "Large Cultural Site",
            imgType: "cultureSite",
          },
          {
            id: "luxurious_culture_site",
            name: "Luxurious Cultural Site",
            imgType: "cultureSite",
          },
        ],
      },
      {
        id: "harborHouses",
        name: "Harbor Houses",
        imgType: "sailorHome",
        buildings: [
          {
            id: "seafarer_house",
            name: "Seafarer House",
            imgType: "sailorHome",
          },
          {
            id: "luxurious_seafarer_house",
            name: "Luxurious Seafarer House",
            imgType: "sailorHome",
          },
        ],
      },
      {
        id: "ships",
        name: "Ships",
        imgType: "shipyard",
        buildings: [{ id: "shipyard", name: "Shipyard", imgType: "shipyard" }],
      },
      {
        id: "warehouses",
        name: "Warehouses",
        imgType: "warehouse",
        buildings: [
          {
            id: "common_warehouse",
            name: "Common Warehouse",
            imgType: "warehouse",
          },
          {
            id: "large_warehouse",
            name: "Large Warehouse",
            imgType: "warehouse",
          },
        ],
      },
      {
        id: "port_facilities",
        name: "Port Facilities",
        imgType: "shipyard",
        buildings: [
          {
            id: "lighthouse",
            name: "Lighthouse",
            imgType: "shipyard",
          },
          {
            id: "pier",
            name: "Pier",
            imgType: "shipyard",
          },
        ],
      },
    ],
  },
  // technos
  {
    id: "technology",
    name: "Technology",
    imgType: "research",
    items: "@eras", // Special case: use eras instead of subcategories
  },
  // egypt
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
          { id: "egypt_small_home", name: "Small Home", imgType: "home" },
          { id: "egypt_average_home", name: "Average Home", imgType: "home" },
          {
            id: "egypt_luxurious_home",
            name: "Luxurious Home",
            imgType: "home",
          },
        ],
      },
      {
        id: "papyrus_fields",
        name: "Papyrus Fields",
        imgType: "papyrusField",
        buildings: [
          {
            id: "papyrus_field",
            name: "Papyrus Field",
            imgType: "papyrusField",
          },
          {
            id: "luxurious_papyrus_field",
            name: "Luxurious Papyrus Field",
            imgType: "papyrusField",
          },
        ],
      },
      {
        id: "gold_mines",
        name: "Gold Mines",
        imgType: "goldMine",
        buildings: [
          { id: "gold_mine", name: "Gold Mine", imgType: "goldMine" },
          {
            id: "luxurious_gold_mine",
            name: "Luxurious Gold Mine",
            imgType: "goldMine",
          },
        ],
      },
      {
        id: "egypt_workshops",
        name: "Workshops",
        imgType: "workshop",
        buildings: [
          { id: "papyrus_press", name: "Papyrus Press", imgType: "workshop" },
          { id: "goldsmith", name: "Goldsmith", imgType: "workshop" },
        ],
      },
      {
        id: "irrigations",
        name: "Irrigations",
        imgType: "irrigation",
        buildings: [
          {
            id: "irrigation_station",
            name: "Irrigation Station",
            imgType: "irrigation",
          },
          { id: "small_well", name: "Small Well", imgType: "irrigation" },
          { id: "channel", name: "Channel", imgType: "irrigation" },
          { id: "water_pump", name: "Water Pump", imgType: "irrigation" },
          { id: "oasis", name: "Oasis", imgType: "irrigation" },
          { id: "fountain", name: "Fountain", imgType: "irrigation" },
        ],
      },
    ],
  },
  // china
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
          { id: "china_small_home", name: "Small Home", imgType: "home" },
          { id: "china_average_home", name: "Average Home", imgType: "home" },
          {
            id: "china_luxurious_home",
            name: "Luxurious Home",
            imgType: "home",
          },
        ],
      },
      {
        id: "rice_farms",
        name: "Rice Farms",
        imgType: "riceFarm",
        buildings: [
          { id: "rice_farm", name: "Rice Farm", imgType: "riceFarm" },
          {
            id: "luxurious_rice_farm",
            name: "Luxurious Rice Farm",
            imgType: "riceFarm",
          },
        ],
      },
      {
        id: "china_workshops",
        name: "Workshops",
        imgType: "workshop",
        buildings: [
          {
            id: "thread_processor",
            name: "Thread Processor",
            imgType: "workshop",
          },
          {
            id: "silk_workshop",
            name: "Silk Workshop",
            imgType: "workshop",
          },
          {
            id: "clay_processor",
            name: "Clay Processor",
            imgType: "workshop",
          },
          {
            id: "porcelain_workshop",
            name: "Porcelain Workshop",
            imgType: "workshop",
          },
        ],
      },
    ],
  },
  // maya
  {
    id: "maya",
    name: "Maya",
    imgType: "maya",
    invertColor: false,
    subcategories: [
      {
        id: "maya_homes",
        name: "Homes",
        imgType: "home",
        buildings: [
          { id: "worker_home", name: "Worker Home", imgType: "home" },
          { id: "priest_home", name: "Priest Home", imgType: "home" },
          {
            id: "luxurious_home",
            name: "Luxurious Home",
            imgType: "home",
          },
        ],
      },
      {
        id: "maya_quarries",
        name: "Quarries",
        imgType: "quarry",
        buildings: [
          {
            id: "obsidian_quarry",
            name: "Obsidian Quarry",
            imgType: "quarry",
          },
          { id: "jade_quarry", name: "Jade Quarry", imgType: "quarry" },
          {
            id: "luxurious_quarry",
            name: "Luxurious Quarry",
            imgType: "quarry",
          },
        ],
      },
      {
        id: "maya_aviaries",
        name: "Aviaries",
        imgType: "aviary",
        buildings: [
          {
            id: "average_aviary",
            name: "Average Aviary",
            imgType: "aviary",
          },
          {
            id: "luxurious_aviary",
            name: "Luxurious Aviary",
            imgType: "aviary",
          },
        ],
      },
      {
        id: "maya_workshops",
        name: "Workshops",
        imgType: "workshop",
        buildings: [
          { id: "chronicler", name: "Chronicler", imgType: "workshop" },
          {
            id: "mask_sculptor",
            name: "Mask Sculptor",
            imgType: "workshop",
          },
          {
            id: "ceremony_outfitter",
            name: "Ceremony Outfitter",
            imgType: "workshop",
          },
          {
            id: "ritual_carver",
            name: "Ritual Carver",
            imgType: "workshop",
          },
          {
            id: "luxurious_workshop",
            name: "Luxurious Workshop",
            imgType: "workshop",
          },
        ],
      },

      {
        id: "maya_ritual_sites",
        name: "Ritual Sites",
        imgType: "ritualSite",
        buildings: [
          {
            id: "small_ritual_site",
            name: "Small Ritual Site",
            imgType: "ritualSite",
          },
          {
            id: "average_ritual_site",
            name: "Average Ritual Site",
            imgType: "ritualSite",
          },
          {
            id: "luxurious_ritual_site",
            name: "Luxurious Ritual Site",
            imgType: "ritualSite",
          },
        ],
      },
    ],
  },
  // vikings
  {
    id: "vikings",
    name: "Vikings",
    imgType: "vikings",
    invertColor: false,
    subcategories: [
      {
        id: "vikings_homes",
        name: "Homes",
        imgType: "home",
        buildings: [
          { id: "worker_home", name: "Worker Home", imgType: "home" },
          { id: "sailor_home", name: "Sailor Home", imgType: "home" },
          {
            id: "luxurious_home",
            name: "Luxurious Home",
            imgType: "home",
          },
        ],
      },
      {
        id: "vikings_beehives",
        name: "Beehives",
        imgType: "beehive",
        buildings: [{ id: "beehive", name: "Beehive", imgType: "beehive" }],
      },
      {
        id: "vikings_fishing_piers",
        name: "Fishing Piers",
        imgType: "fishingPier",
        buildings: [
          {
            id: "fishing_pier",
            name: "Fishing Pier",
            imgType: "fishingPier",
          },
          {
            id: "luxurious_fishing_pier",
            name: "Luxurious Fishing Pier",
            imgType: "fishingPier",
          },
        ],
      },
      {
        id: "vikings_workshops",
        name: "Workshops",
        imgType: "workshop",
        buildings: [
          { id: "tavern", name: "Tavern", imgType: "workshop" },
          {
            id: "expedition_pier",
            name: "Expedition Pier",
            imgType: "workshop",
          },
          {
            id: "sailor_port",
            name: "Sailor Port",
            imgType: "workshop",
          },
          {
            id: "luxurious_sailor_port",
            name: "Luxurious Sailor Port",
            imgType: "workshop",
          },
        ],
      },
      {
        id: "vikings_runestones",
        name: "Runestones",
        imgType: "runestone",
        buildings: [
          {
            id: "home_runestone",
            name: "Home Runestone",
            imgType: "runestone",
          },
          {
            id: "beehive_runestone",
            name: "Beehive Runestone",
            imgType: "runestone",
          },
          {
            id: "tavern_runestone",
            name: "Tavern Runestone",
            imgType: "runestone",
          },
        ],
      },
    ],
  },
  // arabia
  {
    id: "arabia",
    name: "Arabia",
    imgType: "arabia",
    invertColor: false,
    subcategories: [
      {
        id: "arabia_homes",
        name: "Homes",
        imgType: "home",
        buildings: [
          { id: "medium_home", name: "Medium Home", imgType: "home" },
          {
            id: "luxurious_home",
            name: "Luxurious Home",
            imgType: "home",
          },
        ],
      },
      {
        id: "arabia_merchant",
        name: "Merchant",
        imgType: "merchant",
        buildings: [
          { id: "merchant", name: "Merchant", imgType: "merchant" },
          {
            id: "luxurious_merchant",
            name: "Luxurious Merchant",
            imgType: "merchant",
          },
        ],
      },
      {
        id: "arabia_farms",
        name: "Farms",
        imgType: "camelFarm",
        buildings: [
          { id: "camel_farm", name: "Camel Farm", imgType: "camelFarm" },
        ],
      },
      {
        id: "arabia_workshops",
        name: "Workshops",
        imgType: "workshop",
        buildings: [
          {
            id: "coffee_brewer",
            name: "Coffee Brewer",
            imgType: "workshop",
          },
          {
            id: "incense_maker",
            name: "Incense Maker",
            imgType: "workshop",
          },
          {
            id: "carpet_factory",
            name: "Carpet Factory",
            imgType: "workshop",
          },
          {
            id: "oil_lamp_crafter",
            name: "Oil Lamp Crafter",
            imgType: "workshop",
          },
          {
            id: "luxurious_workshop",
            name: "Luxurious Workshop",
            imgType: "workshop",
          },
        ],
      },
      {
        id: "arabia_irrigation",
        name: "Irrigation",
        imgType: "irrigation",
        buildings: [
          {
            id: "small_well",
            name: "Small Well",
            imgType: "irrigation",
          },
          { id: "channel", name: "Channel", imgType: "irrigation" },
          { id: "noria", name: "Noria", imgType: "irrigation" },
          { id: "oasis", name: "Oasis", imgType: "irrigation" },
          { id: "deep_well", name: "Deep Well", imgType: "irrigation" },
        ],
      },
    ],
  },
  // ottoman
  {
    id: "ottoman",
    name: "Ottoman",
    imgType: "ottoman",
    invertColor: false,
    subcategories: [
      {
        id: "ottoman_areas",
        name: "Areas",
        imgType: "scout",
        buildings: [],
      },
      {
        id: "ottoman_tradeposts",
        name: "Trade Posts",
        imgType: "shipyard",
        buildings: [],
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
 *  retourne des items navigables (Subcategory OU Era)
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
