export interface CategoryMeta {
  imgUrl: string; // Nom pour générer l'URL du wiki
  label?: string; // Label custom si différent du nom
}

// Helper pour générer l'URL complète
export function getWikiImageUrl(imageName: string, size: number = 400): string {
  return `https://riseofcultures.wiki.gg/images/thumb/${imageName}.png/${size}px-${imageName}.png`;
}

// Métadonnées pour les catégories principales
export const CATEGORY_META: Record<string, CategoryMeta> = {
  technology: {
    imgUrl: "/game_icons/icon_flat_research_points.webp",
  },
  capital: {
    imgUrl: "/game_icons/icon_flat_museum.webp", 
  },
  egypt: {
    imgUrl: "/city_crest/icon_city_crest_egypt.webp",
  },
  china: {
    imgUrl: "/city_crest/icon_city_crest_china.webp",
  },
  arabia: {
    imgUrl: "/city_crest/icon_city_crest_arabia.webp",
  },
  maya_empire: {
    imgUrl: "/city_crest/icon_city_crest_maya.webp",
  },
  viking_kingdom: {
    imgUrl: "/city_crest/icon_city_crest_vikings.webp",
  },
};

// Métadonnées pour les sous-catégories
export const SUBCATEGORY_META: Record<string, CategoryMeta> = {
  homes: {
    imgUrl: "/game_icons/icon_flat_home.webp",
  },
  farms: {
    imgUrl: "/game_icons/icon_flat_farm.webp",
  },
  barracks: {
    imgUrl: "/game_icons/icon_flat_barracks.webp",
  },
  workshops: {
    imgUrl: "/game_icons/icon_flat_workshop.webp",
  },
  culture_site: {
    imgUrl: "/game_icons/icon_flat_cultureSite.webp",
  },
  harbor_houses: {
    imgUrl: "/game_icons/icon_flat_sailorHome.webp",
  },
  ships: {
    imgUrl: "/game_icons/icon_flat_shipyard.webp",
  },
  warehouses: {
    imgUrl: "/game_icons/icon_flat_warehouse.webp",
  },
};

// Métadonnées pour les buildings spécifiques
export const BUILDING_META: Record<string, CategoryMeta> = {
  // Capital - Homes
  small_home: {
    imgUrl: "Capital_Small_Home_Lv42",
  },
  average_home: {
    imgUrl: "Capital_Average_Home_Lv42",
  },
  luxurious_home: {
    imgUrl: "Capital_Luxurious_Home_Lv42",
  },

  // Capital - Farms
  rural_farm: {
    imgUrl: "Capital_Rural_Farm_Lv42",
  },
  domestic_farm: {
    imgUrl: "Capital_Domestic_Farm_Lv42",
  },
  luxurious_farm: {
    imgUrl: "Capital_Luxurious_Farm_Lv42",
  },

  // Egypt - Homes
  egypt_small_home: {
    imgUrl: "Egypt_Small_Home_Lv5",
  },
  egypt_average_home: {
    imgUrl: "Egypt_Average_Home_Lv5",
  },
  egypt_luxurious_home: {
    imgUrl: "Egypt_Luxurious_Home_Lv5",
  },

  // China - Homes
  china_small_home: {
    imgUrl: "China_Small_Home_Lv5",
  },
  china_average_home: {
    imgUrl: "China_Average_Home_Lv5",
  },
  china_luxurious_home: {
    imgUrl: "China_Luxurious_Home_Lv5",
  },

  // Viking
  viking_sailor_port: {
    imgUrl: "Viking_Sailor_Port",
  },

  // Ajoute les autres buildings ici...
  // Le pattern est généralement: {Culture}_{Building_Name}_Lv{Level}
};

// Fallback si l'image n'existe pas
export const FALLBACK_IMAGE = "/game_icons/icon_flat_home.webp";