// ============================================================================
// CATALOG HELPER - Adapté au nouveau système avec support Ottoman & Technology
// ============================================================================

import {
  getCategories,
  getSubcategories,
  getBuildings,
  getCatalogItem,
  getImageForItem,
  ERAS,
  type NavigableItem,
} from "@/lib/catalog";

/**
 * Construire l'ID complet d'un building au format: category_subcategory_building
 * Utilisé pour mapper les buildings du catalogue aux données dans registry.ts
 */
export function buildFullBuildingId(
  categoryId: string,
  buildingId: string,
): string {
  return `${categoryId}_${buildingId}`;
}

/**
 * Alias pour la nouvelle API - compatible avec l'ancien code
 * Retourne les enfants d'un parent (catégorie → subcategories, subcategory → buildings, technology → eras)
 */
export function getChildren(parentId: string): NavigableItem[] {
  // Si c'est une catégorie, retourner les subcategories ou eras
  const categories = getCategories();
  const category = categories.find((cat) => cat.id === parentId);

  if (category) {
    // ✅ Cas spécial : Technology retourne les eras
    // if (category.items === "@eras") {
    //   return ERAS.map((era) => ({
    //     id: era.id,
    //     name: era.name,
    //     imgType: "research",
    //   }));
    // }

    // Retourner les subcategories normales
    return getSubcategories(parentId);
  }

  // Sinon, chercher les buildings de cette subcategory
  for (const cat of categories) {
    const subcategory = cat.subcategories?.find((sub) => sub.id === parentId);
    if (subcategory) {
      // ✅ Pour Ottoman, les subcategories n'ont pas de buildings à afficher
      // (areas et tradeposts sont gérés différemment via ottoman_selection step)
      if (cat.id === "ottoman") {
        return [];
      }

      return subcategory.buildings;
    }
  }

  return [];
}

/**
 * Export des fonctions principales
 */
export {
  getCategories,
  getSubcategories,
  getBuildings,
  getCatalogItem,
  getImageForItem,
};
