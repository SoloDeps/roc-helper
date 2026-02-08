/**
 * Unified building catalog configuration
 * Single source of truth for all building data
 */

export interface BuildingItem {
  id: string;
  name: string;
  type: 'category' | 'subcategory' | 'building';
  imageUrl: string;
  children?: string[];
  metadata?: {
    maxLevel?: number;
    culture?: string;
    tier?: 'small' | 'medium' | 'large' | 'luxurious';
  };
}

/**
 * Normalized building catalog
 * All items at the same level - relationships via children array
 */
export const BUILDING_CATALOG: Record<string, BuildingItem> = {
  // ROOT
  root: {
    id: 'root',
    name: 'Root',
    type: 'category',
    imageUrl: '',
    children: ['technology', 'capital', 'egypt', 'china', 'arabia', 'maya_empire', 'viking_kingdom'],
  },

  // MAIN CATEGORIES
  technology: {
    id: 'technology',
    name: 'Technologies',
    type: 'category',
    imageUrl: '/game_icons/icon_flat_research_points.webp',
    children: ['stone_age', 'bronze_age', 'minoan_era', 'classical_greece'],
  },

  capital: {
    id: 'capital',
    name: 'Capital',
    type: 'category',
    imageUrl: '/game_icons/icon_flat_museum.webp',
    children: ['homes', 'farms', 'barracks', 'workshops', 'culture_site'],
  },

  egypt: {
    id: 'egypt',
    name: 'Egypt',
    type: 'category',
    imageUrl: '/city_crest/icon_city_crest_egypt.webp',
    children: ['egypt_homes', 'papyrus_fields', 'gold_mines'],
  },

  china: {
    id: 'china',
    name: 'China',
    type: 'category',
    imageUrl: '/city_crest/icon_city_crest_china.webp',
    children: ['china_homes', 'china_farms', 'china_workshops'],
  },

  arabia: {
    id: 'arabia',
    name: 'Arabia',
    type: 'category',
    imageUrl: '/city_crest/icon_city_crest_arabia.webp',
    children: ['arabia_homes', 'arabia_merchants', 'arabia_workshops'],
  },

  maya_empire: {
    id: 'maya_empire',
    name: 'Maya Empire',
    type: 'category',
    imageUrl: '/city_crest/icon_city_crest_maya.webp',
    children: ['maya_homes', 'maya_farms', 'maya_quarries'],
  },

  viking_kingdom: {
    id: 'viking_kingdom',
    name: 'Viking Kingdom',
    type: 'category',
    imageUrl: '/city_crest/icon_city_crest_vikings.webp',
    children: ['viking_homes', 'viking_fishing_piers', 'viking_workshops'],
  },

  // CAPITAL SUBCATEGORIES
  homes: {
    id: 'homes',
    name: 'Homes',
    type: 'subcategory',
    imageUrl: '/game_icons/icon_flat_home.webp',
    children: ['small_home', 'average_home', 'luxurious_home'],
  },

  farms: {
    id: 'farms',
    name: 'Farms',
    type: 'subcategory',
    imageUrl: '/game_icons/icon_flat_farm.webp',
    children: ['rural_farm', 'domestic_farm', 'luxurious_farm'],
  },

  barracks: {
    id: 'barracks',
    name: 'Barracks',
    type: 'subcategory',
    imageUrl: '/game_icons/icon_flat_barracks.webp',
    children: ['infantry_barracks', 'ranged_barracks', 'cavalry_barracks'],
  },

  workshops: {
    id: 'workshops',
    name: 'Workshops',
    type: 'subcategory',
    imageUrl: '/game_icons/icon_flat_workshop.webp',
    children: ['artisan', 'stone_mason', 'tailor', 'scribe'],
  },

  culture_site: {
    id: 'culture_site',
    name: 'Culture Sites',
    type: 'subcategory',
    imageUrl: '/game_icons/icon_flat_cultureSite.webp',
    children: ['little_culture_site', 'compact_culture_site', 'moderate_culture_site'],
  },

  // CAPITAL BUILDINGS - Homes
  small_home: {
    id: 'small_home',
    name: 'Small Home',
    type: 'building',
    imageUrl: 'https://riseofcultures.wiki.gg/images/thumb/Capital_Small_Home_Lv42.png/400px-Capital_Small_Home_Lv42.png',
    metadata: { tier: 'small', maxLevel: 42 },
  },

  average_home: {
    id: 'average_home',
    name: 'Average Home',
    type: 'building',
    imageUrl: 'https://riseofcultures.wiki.gg/images/thumb/Capital_Average_Home_Lv42.png/400px-Capital_Average_Home_Lv42.png',
    metadata: { tier: 'medium', maxLevel: 42 },
  },

  luxurious_home: {
    id: 'luxurious_home',
    name: 'Luxurious Home',
    type: 'building',
    imageUrl: 'https://riseofcultures.wiki.gg/images/thumb/Capital_Luxurious_Home_Lv42.png/400px-Capital_Luxurious_Home_Lv42.png',
    metadata: { tier: 'luxurious', maxLevel: 42 },
  },

  // CAPITAL BUILDINGS - Farms
  rural_farm: {
    id: 'rural_farm',
    name: 'Rural Farm',
    type: 'building',
    imageUrl: 'https://riseofcultures.wiki.gg/images/thumb/Capital_Rural_Farm_Lv39.png/400px-Capital_Rural_Farm_Lv39.png',
    metadata: { tier: 'small', maxLevel: 39 },
  },

  domestic_farm: {
    id: 'domestic_farm',
    name: 'Domestic Farm',
    type: 'building',
    imageUrl: 'https://riseofcultures.wiki.gg/images/thumb/Capital_Domestic_Farm_Lv39.png/400px-Capital_Domestic_Farm_Lv39.png',
    metadata: { tier: 'medium', maxLevel: 39 },
  },

  luxurious_farm: {
    id: 'luxurious_farm',
    name: 'Luxurious Farm',
    type: 'building',
    imageUrl: 'https://riseofcultures.wiki.gg/images/thumb/Capital_Luxurious_Farm_Lv39.png/400px-Capital_Luxurious_Farm_Lv39.png',
    metadata: { tier: 'luxurious', maxLevel: 39 },
  },

  // CAPITAL BUILDINGS - Barracks
  infantry_barracks: {
    id: 'infantry_barracks',
    name: 'Infantry Barracks',
    type: 'building',
    imageUrl: 'https://riseofcultures.wiki.gg/images/thumb/Capital_Infantry_Barracks_Lv14.png/400px-Capital_Infantry_Barracks_Lv14.png',
    metadata: { maxLevel: 14 },
  },

  ranged_barracks: {
    id: 'ranged_barracks',
    name: 'Ranged Barracks',
    type: 'building',
    imageUrl: 'https://riseofcultures.wiki.gg/images/thumb/Capital_Ranged_Barracks_Lv14.png/400px-Capital_Ranged_Barracks_Lv14.png',
    metadata: { maxLevel: 14 },
  },

  cavalry_barracks: {
    id: 'cavalry_barracks',
    name: 'Cavalry Barracks',
    type: 'building',
    imageUrl: 'https://riseofcultures.wiki.gg/images/thumb/Capital_Cavalry_Barracks_Lv14.png/400px-Capital_Cavalry_Barracks_Lv14.png',
    metadata: { maxLevel: 14 },
  },

  // CAPITAL BUILDINGS - Workshops
  artisan: {
    id: 'artisan',
    name: 'Artisan',
    type: 'building',
    imageUrl: 'https://riseofcultures.wiki.gg/images/thumb/Capital_Artisan_Lv5.png/400px-Capital_Artisan_Lv5.png',
    metadata: { maxLevel: 5 },
  },

  stone_mason: {
    id: 'stone_mason',
    name: 'Stone Mason',
    type: 'building',
    imageUrl: 'https://riseofcultures.wiki.gg/images/thumb/Capital_Stone_Mason_Lv5.png/400px-Capital_Stone_Mason_Lv5.png',
    metadata: { maxLevel: 5 },
  },

  tailor: {
    id: 'tailor',
    name: 'Tailor',
    type: 'building',
    imageUrl: 'https://riseofcultures.wiki.gg/images/thumb/Capital_Tailor_Lv5.png/400px-Capital_Tailor_Lv5.png',
    metadata: { maxLevel: 5 },
  },

  scribe: {
    id: 'scribe',
    name: 'Scribe',
    type: 'building',
    imageUrl: 'https://riseofcultures.wiki.gg/images/thumb/Capital_Scribe_Lv6.png/400px-Capital_Scribe_Lv6.png',
    metadata: { maxLevel: 6 },
  },

  // CAPITAL BUILDINGS - Culture Sites
  little_culture_site: {
    id: 'little_culture_site',
    name: 'Little Culture Site',
    type: 'building',
    imageUrl: 'https://riseofcultures.wiki.gg/images/thumb/Capital_Little_Culture_Site_Lv39.png/400px-Capital_Little_Culture_Site_Lv39.png',
    metadata: { tier: 'small', maxLevel: 39 },
  },

  compact_culture_site: {
    id: 'compact_culture_site',
    name: 'Compact Culture Site',
    type: 'building',
    imageUrl: 'https://riseofcultures.wiki.gg/images/thumb/Capital_Compact_Culture_Site_Lv39.png/400px-Capital_Compact_Culture_Site_Lv39.png',
    metadata: { tier: 'medium', maxLevel: 39 },
  },

  moderate_culture_site: {
    id: 'moderate_culture_site',
    name: 'Moderate Culture Site',
    type: 'building',
    imageUrl: 'https://riseofcultures.wiki.gg/images/thumb/Capital_Moderate_Culture_Site_Lv39.png/400px-Capital_Moderate_Culture_Site_Lv39.png',
    metadata: { tier: 'large', maxLevel: 39 },
  },

  // EGYPT SUBCATEGORIES
  egypt_homes: {
    id: 'egypt_homes',
    name: 'Homes',
    type: 'subcategory',
    imageUrl: '/game_icons/icon_flat_home.webp',
    children: ['egypt_small_home', 'egypt_average_home', 'egypt_luxurious_home'],
    metadata: { culture: 'egypt' },
  },

  papyrus_fields: {
    id: 'papyrus_fields',
    name: 'Papyrus Fields',
    type: 'subcategory',
    imageUrl: '/game_icons/icon_flat_farm.webp',
    children: ['papyrus_field', 'luxurious_papyrus_field'],
    metadata: { culture: 'egypt' },
  },

  gold_mines: {
    id: 'gold_mines',
    name: 'Gold Mines',
    type: 'subcategory',
    imageUrl: '/game_icons/icon_flat_workshop.webp',
    children: ['gold_mine', 'luxurious_gold_mine'],
    metadata: { culture: 'egypt' },
  },

  // EGYPT BUILDINGS
  egypt_small_home: {
    id: 'egypt_small_home',
    name: 'Small Home',
    type: 'building',
    imageUrl: 'https://riseofcultures.wiki.gg/images/thumb/Egypt_Small_Home_Lv5.png/400px-Egypt_Small_Home_Lv5.png',
    metadata: { culture: 'egypt', tier: 'small', maxLevel: 5 },
  },

  egypt_average_home: {
    id: 'egypt_average_home',
    name: 'Average Home',
    type: 'building',
    imageUrl: 'https://riseofcultures.wiki.gg/images/thumb/Egypt_Average_Home_Lv5.png/400px-Egypt_Average_Home_Lv5.png',
    metadata: { culture: 'egypt', tier: 'medium', maxLevel: 5 },
  },

  egypt_luxurious_home: {
    id: 'egypt_luxurious_home',
    name: 'Luxurious Home',
    type: 'building',
    imageUrl: 'https://riseofcultures.wiki.gg/images/thumb/Egypt_Luxurious_Home_Lv5.png/400px-Egypt_Luxurious_Home_Lv5.png',
    metadata: { culture: 'egypt', tier: 'luxurious', maxLevel: 5 },
  },

  papyrus_field: {
    id: 'papyrus_field',
    name: 'Papyrus Field',
    type: 'building',
    imageUrl: 'https://riseofcultures.wiki.gg/images/thumb/Egypt_Papyrus_Field_Lv5.png/400px-Egypt_Papyrus_Field_Lv5.png',
    metadata: { culture: 'egypt', maxLevel: 5 },
  },

  luxurious_papyrus_field: {
    id: 'luxurious_papyrus_field',
    name: 'Luxurious Papyrus Field',
    type: 'building',
    imageUrl: 'https://riseofcultures.wiki.gg/images/thumb/Egypt_Luxurious_Papyrus_Field_Lv5.png/400px-Egypt_Luxurious_Papyrus_Field_Lv5.png',
    metadata: { culture: 'egypt', tier: 'luxurious', maxLevel: 5 },
  },

  gold_mine: {
    id: 'gold_mine',
    name: 'Gold Mine',
    type: 'building',
    imageUrl: 'https://riseofcultures.wiki.gg/images/thumb/Egypt_Gold_Mine_Lv5.png/400px-Egypt_Gold_Mine_Lv5.png',
    metadata: { culture: 'egypt', maxLevel: 5 },
  },

  luxurious_gold_mine: {
    id: 'luxurious_gold_mine',
    name: 'Luxurious Gold Mine',
    type: 'building',
    imageUrl: 'https://riseofcultures.wiki.gg/images/thumb/Egypt_Luxurious_Gold_Mine_Lv5.png/400px-Egypt_Luxurious_Gold_Mine_Lv5.png',
    metadata: { culture: 'egypt', tier: 'luxurious', maxLevel: 5 },
  },

  // CHINA SUBCATEGORIES
  china_homes: {
    id: 'china_homes',
    name: 'Homes',
    type: 'subcategory',
    imageUrl: '/game_icons/icon_flat_home.webp',
    children: ['china_small_home', 'china_average_home', 'china_luxurious_home'],
    metadata: { culture: 'china' },
  },

  china_farms: {
    id: 'china_farms',
    name: 'Farms',
    type: 'subcategory',
    imageUrl: '/game_icons/icon_flat_farm.webp',
    children: ['rice_farm', 'luxurious_rice_farm'],
    metadata: { culture: 'china' },
  },

  china_workshops: {
    id: 'china_workshops',
    name: 'Workshops',
    type: 'subcategory',
    imageUrl: '/game_icons/icon_flat_workshop.webp',
    children: ['silk_workshop', 'porcelain_workshop'],
    metadata: { culture: 'china' },
  },

  // CHINA BUILDINGS
  china_small_home: {
    id: 'china_small_home',
    name: 'Small Home',
    type: 'building',
    imageUrl: 'https://riseofcultures.wiki.gg/images/thumb/China_Small_Home_Lv5.png/400px-China_Small_Home_Lv5.png',
    metadata: { culture: 'china', tier: 'small', maxLevel: 5 },
  },

  china_average_home: {
    id: 'china_average_home',
    name: 'Average Home',
    type: 'building',
    imageUrl: 'https://riseofcultures.wiki.gg/images/thumb/China_Average_Home_Lv5.png/400px-China_Average_Home_Lv5.png',
    metadata: { culture: 'china', tier: 'medium', maxLevel: 5 },
  },

  china_luxurious_home: {
    id: 'china_luxurious_home',
    name: 'Luxurious Home',
    type: 'building',
    imageUrl: 'https://riseofcultures.wiki.gg/images/thumb/China_Luxurious_Home_Lv5.png/400px-China_Luxurious_Home_Lv5.png',
    metadata: { culture: 'china', tier: 'luxurious', maxLevel: 5 },
  },

  rice_farm: {
    id: 'rice_farm',
    name: 'Rice Farm',
    type: 'building',
    imageUrl: 'https://riseofcultures.wiki.gg/images/thumb/China_Rice_Farm_Lv5.png/400px-China_Rice_Farm_Lv5.png',
    metadata: { culture: 'china', maxLevel: 5 },
  },

  luxurious_rice_farm: {
    id: 'luxurious_rice_farm',
    name: 'Luxurious Rice Farm',
    type: 'building',
    imageUrl: 'https://riseofcultures.wiki.gg/images/thumb/China_Luxurious_Rice_Farm_Lv5.png/400px-China_Luxurious_Rice_Farm_Lv5.png',
    metadata: { culture: 'china', tier: 'luxurious', maxLevel: 5 },
  },

  silk_workshop: {
    id: 'silk_workshop',
    name: 'Silk Workshop',
    type: 'building',
    imageUrl: 'https://riseofcultures.wiki.gg/images/thumb/China_Silk_Workshop_Lv5.png/400px-China_Silk_Workshop_Lv5.png',
    metadata: { culture: 'china', maxLevel: 5 },
  },

  porcelain_workshop: {
    id: 'porcelain_workshop',
    name: 'Porcelain Workshop',
    type: 'building',
    imageUrl: 'https://riseofcultures.wiki.gg/images/thumb/China_Porcelain_Workshop_Lv5.png/400px-China_Porcelain_Workshop_Lv5.png',
    metadata: { culture: 'china', maxLevel: 5 },
  },

  // Add more cultures following the same pattern...
  // (Arabia, Maya, Viking, Technologies)

  // TECHNOLOGIES
  stone_age: {
    id: 'stone_age',
    name: 'Stone Age',
    type: 'building',
    imageUrl: '/game_icons/icon_flat_research_points.webp',
  },

  bronze_age: {
    id: 'bronze_age',
    name: 'Bronze Age',
    type: 'building',
    imageUrl: '/game_icons/icon_flat_research_points.webp',
  },

  minoan_era: {
    id: 'minoan_era',
    name: 'Minoan Era',
    type: 'building',
    imageUrl: '/game_icons/icon_flat_research_points.webp',
  },

  classical_greece: {
    id: 'classical_greece',
    name: 'Classical Greece',
    type: 'building',
    imageUrl: '/game_icons/icon_flat_research_points.webp',
  },

  // ARABIA SUBCATEGORIES
  arabia_homes: {
    id: 'arabia_homes',
    name: 'Homes',
    type: 'subcategory',
    imageUrl: '/game_icons/icon_flat_home.webp',
    children: ['arabia_medium_home', 'arabia_luxurious_home'],
    metadata: { culture: 'arabia' },
  },

  arabia_merchants: {
    id: 'arabia_merchants',
    name: 'Merchants',
    type: 'subcategory',
    imageUrl: '/game_icons/icon_flat_workshop.webp',
    children: ['arabia_merchant', 'arabia_luxurious_merchant'],
    metadata: { culture: 'arabia' },
  },

  arabia_workshops: {
    id: 'arabia_workshops',
    name: 'Workshops',
    type: 'subcategory',
    imageUrl: '/game_icons/icon_flat_workshop.webp',
    children: ['coffee_brewer', 'incense_maker'],
    metadata: { culture: 'arabia' },
  },

  // MAYA SUBCATEGORIES
  maya_homes: {
    id: 'maya_homes',
    name: 'Homes',
    type: 'subcategory',
    imageUrl: '/game_icons/icon_flat_home.webp',
    children: ['maya_small_home', 'maya_average_home'],
    metadata: { culture: 'maya' },
  },

  maya_farms: {
    id: 'maya_farms',
    name: 'Farms',
    type: 'subcategory',
    imageUrl: '/game_icons/icon_flat_farm.webp',
    children: ['maya_farm', 'maya_luxurious_farm'],
    metadata: { culture: 'maya' },
  },

  maya_quarries: {
    id: 'maya_quarries',
    name: 'Quarries',
    type: 'subcategory',
    imageUrl: '/game_icons/icon_flat_workshop.webp',
    children: ['maya_obsidian_quarry', 'maya_jade_quarry'],
    metadata: { culture: 'maya' },
  },

  // VIKING SUBCATEGORIES
  viking_homes: {
    id: 'viking_homes',
    name: 'Homes',
    type: 'subcategory',
    imageUrl: '/game_icons/icon_flat_home.webp',
    children: ['viking_worker_home', 'viking_sailor_home'],
    metadata: { culture: 'viking' },
  },

  viking_fishing_piers: {
    id: 'viking_fishing_piers',
    name: 'Fishing Piers',
    type: 'subcategory',
    imageUrl: '/game_icons/icon_flat_farm.webp',
    children: ['viking_fishing_pier', 'viking_luxurious_fishing_pier'],
    metadata: { culture: 'viking' },
  },

  viking_workshops: {
    id: 'viking_workshops',
    name: 'Workshops',
    type: 'subcategory',
    imageUrl: '/game_icons/icon_flat_workshop.webp',
    children: ['viking_tavern', 'viking_sailor_port'],
    metadata: { culture: 'viking' },
  },

  // Placeholder buildings (add full data as needed)
  arabia_medium_home: {
    id: 'arabia_medium_home',
    name: 'Medium Home',
    type: 'building',
    imageUrl: '/game_icons/icon_flat_home.webp',
    metadata: { culture: 'arabia' },
  },
  
  arabia_luxurious_home: {
    id: 'arabia_luxurious_home',
    name: 'Luxurious Home',
    type: 'building',
    imageUrl: '/game_icons/icon_flat_home.webp',
    metadata: { culture: 'arabia' },
  },

  arabia_merchant: {
    id: 'arabia_merchant',
    name: 'Merchant',
    type: 'building',
    imageUrl: '/game_icons/icon_flat_workshop.webp',
    metadata: { culture: 'arabia' },
  },

  arabia_luxurious_merchant: {
    id: 'arabia_luxurious_merchant',
    name: 'Luxurious Merchant',
    type: 'building',
    imageUrl: '/game_icons/icon_flat_workshop.webp',
    metadata: { culture: 'arabia' },
  },

  coffee_brewer: {
    id: 'coffee_brewer',
    name: 'Coffee Brewer',
    type: 'building',
    imageUrl: '/game_icons/icon_flat_workshop.webp',
    metadata: { culture: 'arabia' },
  },

  incense_maker: {
    id: 'incense_maker',
    name: 'Incense Maker',
    type: 'building',
    imageUrl: '/game_icons/icon_flat_workshop.webp',
    metadata: { culture: 'arabia' },
  },

  maya_small_home: {
    id: 'maya_small_home',
    name: 'Small Home',
    type: 'building',
    imageUrl: '/game_icons/icon_flat_home.webp',
    metadata: { culture: 'maya' },
  },

  maya_average_home: {
    id: 'maya_average_home',
    name: 'Average Home',
    type: 'building',
    imageUrl: '/game_icons/icon_flat_home.webp',
    metadata: { culture: 'maya' },
  },

  maya_farm: {
    id: 'maya_farm',
    name: 'Farm',
    type: 'building',
    imageUrl: '/game_icons/icon_flat_farm.webp',
    metadata: { culture: 'maya' },
  },

  maya_luxurious_farm: {
    id: 'maya_luxurious_farm',
    name: 'Luxurious Farm',
    type: 'building',
    imageUrl: '/game_icons/icon_flat_farm.webp',
    metadata: { culture: 'maya' },
  },

  maya_obsidian_quarry: {
    id: 'maya_obsidian_quarry',
    name: 'Obsidian Quarry',
    type: 'building',
    imageUrl: '/game_icons/icon_flat_workshop.webp',
    metadata: { culture: 'maya' },
  },

  maya_jade_quarry: {
    id: 'maya_jade_quarry',
    name: 'Jade Quarry',
    type: 'building',
    imageUrl: '/game_icons/icon_flat_workshop.webp',
    metadata: { culture: 'maya' },
  },

  viking_worker_home: {
    id: 'viking_worker_home',
    name: 'Worker Home',
    type: 'building',
    imageUrl: '/game_icons/icon_flat_home.webp',
    metadata: { culture: 'viking' },
  },

  viking_sailor_home: {
    id: 'viking_sailor_home',
    name: 'Sailor Home',
    type: 'building',
    imageUrl: '/game_icons/icon_flat_home.webp',
    metadata: { culture: 'viking' },
  },

  viking_fishing_pier: {
    id: 'viking_fishing_pier',
    name: 'Fishing Pier',
    type: 'building',
    imageUrl: '/game_icons/icon_flat_farm.webp',
    metadata: { culture: 'viking' },
  },

  viking_luxurious_fishing_pier: {
    id: 'viking_luxurious_fishing_pier',
    name: 'Luxurious Fishing Pier',
    type: 'building',
    imageUrl: '/game_icons/icon_flat_farm.webp',
    metadata: { culture: 'viking' },
  },

  viking_tavern: {
    id: 'viking_tavern',
    name: 'Tavern',
    type: 'building',
    imageUrl: '/game_icons/icon_flat_workshop.webp',
    metadata: { culture: 'viking' },
  },

  viking_sailor_port: {
    id: 'viking_sailor_port',
    name: 'Sailor Port',
    type: 'building',
    imageUrl: '/game_icons/icon_flat_workshop.webp',
    metadata: { culture: 'viking' },
  },
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
    .map(childId => BUILDING_CATALOG[childId])
    .filter(Boolean);
};

export const getCategories = (): BuildingItem[] => {
  return getChildren('root');
};

export const FALLBACK_IMAGE = '/game_icons/icon_flat_home.webp';
