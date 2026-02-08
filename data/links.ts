export interface Item {
  name: string;
  imageName?: string; // Nouveau : nom pour l'image du wiki
  children?: string[];
}

export const links: Record<string, Item> = {
  // Racine
  root: {
    children: [
      "technology",
      "capital",
      "egypt",
      "china",
      "arabia",
      "maya_empire",
      "viking_kingdom",
    ],
    name: "Root",
  },

  // #region Capital
  capital: {
    children: [
      "homes",
      "farms",
      "barracks",
      "workshops",
      "culture_site",
      "harbor_houses",
      "ships",
      "warehouses",
    ],
    name: "Capital",
    imageName: "Capital_Icon", // Icône de catégorie
  },

  // Homes
  homes: {
    children: ["small_home", "average_home", "luxurious_home"],
    name: "Homes",
    imageName: "Capital_Average_Home_Lv42",
  },
  small_home: {
    name: "Small Home",
    imageName: "Capital_Small_Home_Lv42",
  },
  average_home: {
    name: "Average Home",
    imageName: "Capital_Average_Home_Lv42",
  },
  luxurious_home: {
    name: "Luxurious Home",
    imageName: "Capital_Luxurious_Home_Lv42",
  },

  // Farms
  farms: {
    children: ["rural_farm", "domestic_farm", "luxurious_farm"],
    name: "Farms",
    imageName: "Farms_Icon",
  },
  rural_farm: {
    name: "Rural Farm",
    imageName: "Capital_Rural_Farm_Lv39",
  },
  domestic_farm: {
    name: "Domestic Farm",
    imageName: "Capital_Domestic_Farm_Lv39",
  },
  luxurious_farm: {
    name: "Luxurious Farm",
    imageName: "Capital_Luxurious_Farm_Lv39",
  },

  // Barracks
  barracks: {
    children: [
      "infantry_barracks",
      "ranged_barracks",
      "cavalry_barracks",
      "heavy_infantry_barracks",
      "siege_barracks",
    ],
    name: "Barracks",
    imageName: "Barracks_Icon",
  },
  infantry_barracks: {
    name: "Infantry Barracks",
    imageName: "Capital_Infantry_Barracks_Lv14",
  },
  ranged_barracks: {
    name: "Ranged Barracks",
    imageName: "Capital_Ranged_Barracks_Lv14",
  },
  cavalry_barracks: {
    name: "Cavalry Barracks",
    imageName: "Capital_Cavalry_Barracks_Lv14",
  },
  heavy_infantry_barracks: {
    name: "Heavy Infantry Barracks",
    imageName: "Capital_Heavy_Infantry_Barracks_Lv14",
  },
  siege_barracks: {
    name: "Siege Barracks",
    imageName: "Capital_Siege_Barracks_Lv14",
  },

  // Workshops
  workshops: {
    children: [
      "artisan",
      "stone_mason",
      "tailor",
      "scribe",
      "spice_merchant",
      "carpenter",
      "jeweler",
      "alchemist",
      "glassblower",
    ],
    name: "Workshops",
    imageName: "Workshops_Icon",
  },
  artisan: {
    name: "Artisan",
    imageName: "Capital_Artisan_Lv5",
  },
  stone_mason: {
    name: "Stone Mason",
    imageName: "Capital_Stone_Mason_Lv5",
  },
  tailor: {
    name: "Tailor",
    imageName: "Capital_Tailor_Lv5",
  },
  scribe: {
    name: "Scribe",
    imageName: "Capital_Scribe_Lv6",
  },
  spice_merchant: {
    name: "Spice Merchant",
    imageName: "Capital_Spice_Merchant_Lv6",
  },
  carpenter: {
    name: "Carpenter",
    imageName: "Capital_Carpenter_Lv6",
  },
  jeweler: {
    name: "Jeweler",
    imageName: "Capital_Jeweler_Lv2",
  },
  alchemist: {
    name: "Alchemist",
    imageName: "Capital_Alchemist_Lv2",
  },
  glassblower: {
    name: "Glassblower",
    imageName: "Capital_Glassblower_Lv2",
  },

  // Culture Sites
  culture_site: {
    children: [
      "little_culture_site",
      "compact_culture_site",
      "moderate_culture_site",
      "large_culture_site",
      "luxurious_culture_site",
    ],
    name: "Culture Sites",
    imageName: "Culture_Sites_Icon",
  },
  little_culture_site: {
    name: "Little Culture Site",
    imageName: "Capital_Little_Culture_Site_Lv39",
  },
  compact_culture_site: {
    name: "Compact Culture Site",
    imageName: "Capital_Compact_Culture_Site_Lv39",
  },
  moderate_culture_site: {
    name: "Moderate Culture Site",
    imageName: "Capital_Moderate_Culture_Site_Lv39",
  },
  large_culture_site: {
    name: "Large Culture Site",
    imageName: "Capital_Large_Culture_Site_Lv39",
  },
  luxurious_culture_site: {
    name: "Luxurious Culture Site",
    imageName: "Capital_Luxurious_Culture_Site_Lv39",
  },

  // Harbor Houses
  harbor_houses: {
    children: ["seafarer_house", "luxurious_seafarer_house"],
    name: "Harbor Houses",
    imageName: "Harbor_Houses_Icon",
  },
  seafarer_house: {
    name: "Seafarer House",
    imageName: "Capital_Seafarer_House_Lv39",
  },
  luxurious_seafarer_house: {
    name: "Luxurious Seafarer House",
    imageName: "Capital_Luxurious_Seafarer_House_Lv39",
  },

  // Ships
  ships: {
    children: ["shipyard"],
    name: "Ships",
    imageName: "Ships_Icon",
  },
  shipyard: {
    name: "Shipyard",
    imageName: "Capital_Shipyard",
  },

  // Warehouses
  warehouses: {
    children: ["common_warehouse", "large_warehouse"],
    name: "Warehouses",
    imageName: "Warehouses_Icon",
  },
  common_warehouse: {
    name: "Common Warehouse",
    imageName: "Capital_Common_Warehouse_Lv39",
  },
  large_warehouse: {
    name: "Large Warehouse",
    imageName: "Capital_Large_Warehouse_Lv39",
  },
  // #endregion

  // #region Egypt
  egypt: {
    children: [
      "egypt_homes",
      "papyrus_fields",
      "gold_mines",
      "egypt_workshops",
    ],
    name: "Egypt",
    imageName: "Egypt_Icon",
  },

  egypt_homes: {
    children: [
      "egypt_small_home",
      "egypt_average_home",
      "egypt_luxurious_home",
    ],
    name: "Homes",
    imageName: "Egypt_Homes_Icon",
  },
  egypt_small_home: {
    name: "Small Home",
    imageName: "Egypt_Small_Home_Lv5",
  },
  egypt_average_home: {
    name: "Average Home",
    imageName: "Egypt_Average_Home_Lv5",
  },
  egypt_luxurious_home: {
    name: "Luxurious Home",
    imageName: "Egypt_Luxurious_Home_Lv5",
  },

  papyrus_fields: {
    children: ["papyrus_field", "luxurious_papyrus_field"],
    name: "Papyrus Fields",
    imageName: "Egypt_Papyrus_Fields_Icon",
  },
  papyrus_field: {
    name: "Papyrus Field",
    imageName: "Egypt_Papyrus_Field_Lv5",
  },
  luxurious_papyrus_field: {
    name: "Luxurious Papyrus Field",
    imageName: "Egypt_Luxurious_Papyrus_Field_Lv5",
  },

  gold_mines: {
    children: ["gold_mine", "luxurious_gold_mine"],
    name: "Gold Mines",
    imageName: "Egypt_Gold_Mines_Icon",
  },
  gold_mine: {
    name: "Gold Mine",
    imageName: "Egypt_Gold_Mine_Lv5",
  },
  luxurious_gold_mine: {
    name: "Luxurious Gold Mine",
    imageName: "Egypt_Luxurious_Gold_Mine_Lv5",
  },

  egypt_workshops: {
    children: ["papyrus_press", "goldsmith"],
    name: "Workshops",
    imageName: "Egypt_Workshops_Icon",
  },
  papyrus_press: {
    name: "Papyrus Press",
    imageName: "Egypt_Papyrus_Press_Lv5",
  },
  goldsmith: {
    name: "Goldsmith",
    imageName: "Egypt_Goldsmith_Lv5",
  },
  // #endregion

  // #region China
  china: {
    children: ["china_homes", "china_farms", "china_workshops"],
    name: "China",
    imageName: "China_Icon",
  },

  china_homes: {
    children: [
      "china_small_home",
      "china_average_home",
      "china_luxurious_home",
    ],
    name: "Homes",
    imageName: "China_Homes_Icon",
  },
  china_small_home: {
    name: "Small Home",
    imageName: "China_Small_Home_Lv5",
  },
  china_average_home: {
    name: "Average Home",
    imageName: "China_Average_Home_Lv5",
  },
  china_luxurious_home: {
    name: "Luxurious Home",
    imageName: "China_Luxurious_Home_Lv5",
  },

  china_farms: {
    children: ["rice_farm", "luxurious_rice_farm"],
    name: "Farms",
    imageName: "China_Farms_Icon",
  },
  rice_farm: {
    name: "Rice Farm",
    imageName: "China_Rice_Farm_Lv5",
  },
  luxurious_rice_farm: {
    name: "Luxurious Rice Farm",
    imageName: "China_Luxurious_Rice_Farm_Lv5",
  },

  china_workshops: {
    children: ["silk_workshop", "porcelain_workshop"],
    name: "Workshops",
    imageName: "China_Workshops_Icon",
  },
  silk_workshop: {
    name: "Silk Workshop",
    imageName: "China_Silk_Workshop_Lv5",
  },
  porcelain_workshop: {
    name: "Porcelain Workshop",
    imageName: "China_Porcelain_Workshop_Lv5",
  },
  // #endregion

  // #region Arabia
  arabia: {
    children: [
      "arabia_homes",
      "arabia_camel_farm",
      "arabia_workshops",
      "arabia_merchants",
    ],
    name: "Arabia",
    imageName: "Arabia_Icon",
  },

  arabia_homes: {
    children: ["arabia_medium_home", "arabia_luxurious_home"],
    name: "Homes",
    imageName: "Arabia_Homes_Icon",
  },
  arabia_medium_home: {
    name: "Medium Home",
    imageName: "Arabia_Medium_Home_Lv5",
  },
  arabia_luxurious_home: {
    name: "Luxurious Home",
    imageName: "Arabia_Luxurious_Home_Lv5",
  },

  arabia_merchants: {
    children: ["arabia_merchant", "arabia_luxurious_merchant"],
    name: "Merchants",
    imageName: "Arabia_Merchants_Icon",
  },
  arabia_merchant: {
    name: "Merchant",
    imageName: "Arabia_Merchant_Lv5",
  },
  arabia_luxurious_merchant: {
    name: "Luxurious Merchant",
    imageName: "Arabia_Luxurious_Merchant_Lv5",
  },

  arabia_camel_farm: {
    name: "Camel Farm",
    imageName: "Arabia_Camel_Farm_Lv5",
  },

  arabia_workshops: {
    children: [
      "coffee_brewer",
      "incense_maker",
      "carpet_factory",
      "oil_lamp_crafter",
      "luxurious_workshop",
    ],
    name: "Workshops",
    imageName: "Arabia_Workshops_Icon",
  },
  coffee_brewer: {
    name: "Coffee Brewer",
    imageName: "Arabia_Coffee_Brewer_Lv5",
  },
  incense_maker: {
    name: "Incense Maker",
    imageName: "Arabia_Incense_Maker_Lv5",
  },
  carpet_factory: {
    name: "Carpet Factory",
    imageName: "Arabia_Carpet_Factory_Lv5",
  },
  oil_lamp_crafter: {
    name: "Oil Lamp Crafter",
    imageName: "Arabia_Oil_Lamp_Crafter_Lv5",
  },
  luxurious_workshop: {
    name: "Luxurious Workshop",
    imageName: "Arabia_Luxurious_Workshop_Lv5",
  },
  // #endregion

  // #region Maya Empire
  maya_empire: {
    children: [
      "maya_homes",
      "maya_farms",
      "maya_quarries",
      "maya_aviaries",
      "maya_workshops",
      "maya_ritual_sites",
    ],
    name: "Maya Empire",
    imageName: "Maya_Icon",
  },

  maya_homes: {
    children: ["maya_small_home", "maya_average_home", "maya_luxurious_home"],
    name: "Homes",
    imageName: "Maya_Homes_Icon",
  },
  maya_small_home: {
    name: "Small Home",
    imageName: "Maya_Small_Home_Lv5",
  },
  maya_average_home: {
    name: "Average Home",
    imageName: "Maya_Average_Home_Lv5",
  },
  maya_luxurious_home: {
    name: "Luxurious Home",
    imageName: "Maya_Luxurious_Home_Lv5",
  },

  maya_farms: {
    children: ["maya_farm", "maya_luxurious_farm"],
    name: "Farms",
    imageName: "Maya_Farms_Icon",
  },
  maya_farm: {
    name: "Farm",
    imageName: "Maya_Farm_Lv5",
  },
  maya_luxurious_farm: {
    name: "Luxurious Farm",
    imageName: "Maya_Luxurious_Farm_Lv5",
  },

  maya_quarries: {
    children: [
      "maya_obsidian_quarry",
      "maya_jade_quarry",
      "maya_luxurious_quarry",
    ],
    name: "Quarries",
    imageName: "Maya_Quarries_Icon",
  },
  maya_obsidian_quarry: {
    name: "Obsidian Quarry",
    imageName: "Maya_Obsidian_Quarry_Lv5",
  },
  maya_jade_quarry: {
    name: "Jade Quarry",
    imageName: "Maya_Jade_Quarry_Lv5",
  },
  maya_luxurious_quarry: {
    name: "Luxurious Quarry",
    imageName: "Maya_Luxurious_Quarry_Lv5",
  },

  maya_aviaries: {
    name: "Aviaries",
    children: ["maya_average_aviary", "maya_luxurious_aviary"],
    imageName: "Maya_Aviaries_Icon",
  },
  maya_average_aviary: {
    name: "Average Aviary",
    imageName: "Maya_Average_Aviary_Lv5",
  },
  maya_luxurious_aviary: {
    name: "Luxurious Aviary",
    imageName: "Maya_Luxurious_Aviary_Lv5",
  },

  maya_workshops: {
    children: [
      "maya_chronicler",
      "maya_mask_sculptor",
      "maya_ceremony_outfitter",
      "maya_ritual_carver",
      "maya_luxurious_workshop",
    ],
    name: "Workshops",
    imageName: "Maya_Workshops_Icon",
  },
  maya_chronicler: {
    name: "Chronicler",
    imageName: "Maya_Chronicler_Lv5",
  },
  maya_mask_sculptor: {
    name: "Mask Sculptor",
    imageName: "Maya_Mask_Sculptor_Lv5",
  },
  maya_ceremony_outfitter: {
    name: "Ceremony Outfitter",
    imageName: "Maya_Ceremony_Outfitter_Lv5",
  },
  maya_ritual_carver: {
    name: "Ritual Carver",
    imageName: "Maya_Ritual_Carver_Lv5",
  },
  maya_luxurious_workshop: {
    name: "Luxurious Workshop",
    imageName: "Maya_Luxurious_Workshop_Lv5",
  },

  maya_ritual_sites: {
    name: "Ritual Sites",
    imageName: "Maya_Ritual_Sites_Icon",
  },
  // #endregion

  // #region Viking Kingdom
  viking_kingdom: {
    name: "Viking Kingdom",
    children: [
      "viking_homes",
      "viking_fishing_piers",
      "viking_workshops",
      "viking_beehive",
    ],
    imageName: "Viking_Icon",
  },

  viking_homes: {
    name: "Homes",
    children: [
      "viking_worker_home",
      "viking_sailor_home",
      "viking_luxurious_home",
    ],
    imageName: "Viking_Homes_Icon",
  },
  viking_worker_home: {
    name: "Worker Home",
    imageName: "Viking_Worker_Home",
  },
  viking_sailor_home: {
    name: "Sailor Home",
    imageName: "Viking_Sailor_Home",
  },
  viking_luxurious_home: {
    name: "Luxurious Home",
    imageName: "Viking_Luxurious_Home",
  },

  viking_beehive: {
    name: "Beehive",
    imageName: "Viking_Beehive",
  },

  viking_fishing_piers: {
    name: "Fishing Piers",
    children: ["viking_fishing_pier", "viking_luxurious_fishing_pier"],
    imageName: "Viking_Fishing_Piers_Icon",
  },
  viking_fishing_pier: {
    name: "Fishing Pier",
    imageName: "Viking_Fishing_Pier",
  },
  viking_luxurious_fishing_pier: {
    name: "Luxurious Fishing Pier",
    imageName: "Viking_Luxurious_Fishing_Pier",
  },

  viking_workshops: {
    name: "Workshops",
    children: [
      "viking_tavern",
      "viking_expedition_pier",
      "viking_sailor_port",
      "viking_luxurious_sailor_port",
    ],
    imageName: "Viking_Workshops_Icon",
  },
  viking_tavern: {
    name: "Tavern",
    imageName: "Viking_Tavern",
  },
  viking_expedition_pier: {
    name: "Expedition Pier",
    imageName: "Viking_Expedition_Pier",
  },
  viking_sailor_port: {
    name: "Sailor Port",
    imageName: "Viking_Sailor_Port",
  },
  viking_luxurious_sailor_port: {
    name: "Luxurious Sailor Port",
    imageName: "Viking_Luxurious_Sailor_Port",
  },
  // #endregion

  // #region Technologies
  technology: {
    children: [
      "stone_age",
      "bronze_age",
      "minoan_era",
      "classical_greece",
      "early_rome",
      "roman_empire",
      "byzantine_era",
      "age_of_the_franks",
      "feudal_age",
      "iberian_era",
      "kingdom_of_sicily",
      "high_middle_ages",
      "early_gothic_era",
    ],
    name: "Technologies",
    imageName: "Technology_Icon",
  },

  stone_age: {
    name: "Stone Age",
    imageName: "Stone_Age_Icon",
  },
  bronze_age: {
    name: "Bronze Age",
    imageName: "Bronze_Age_Icon",
  },
  minoan_era: {
    name: "Minoan Era",
    imageName: "Minoan_Era_Icon",
  },
  classical_greece: {
    name: "Classical Greece",
    imageName: "Classical_Greece_Icon",
  },
  early_rome: {
    name: "Early Rome",
    imageName: "Early_Rome_Icon",
  },
  roman_empire: {
    name: "Roman Empire",
    imageName: "Roman_Empire_Icon",
  },
  byzantine_era: {
    name: "Byzantine Era",
    imageName: "Byzantine_Era_Icon",
  },
  age_of_the_franks: {
    name: "Age of the Franks",
    imageName: "Age_of_the_Franks_Icon",
  },
  feudal_age: {
    name: "Feudal Age",
    imageName: "Feudal_Age_Icon",
  },
  iberian_era: {
    name: "Iberian Era",
    imageName: "Iberian_Era_Icon",
  },
  kingdom_of_sicily: {
    name: "Kingdom of Sicily",
    imageName: "Kingdom_of_Sicily_Icon",
  },
  high_middle_ages: {
    name: "High Middle Ages",
    imageName: "High_Middle_Ages_Icon",
  },
  early_gothic_era: {
    name: "Early Gothic",
    imageName: "Early_Gothic_Era_Icon",
  },
  // #endregion
};
