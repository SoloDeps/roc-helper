// ============================================================================
// CATALOG HELPER - Adapté au nouveau système
// ============================================================================

import {
  getCategories,
  getSubcategories,
  getBuildings,
  getCatalogItem,
  getImageForItem,
  type NavigableItem,
} from "@/lib/catalog";

/**
 * Alias pour la nouvelle API - compatible avec l'ancien code
 * Retourne les enfants d'un parent (catégorie → subcategories, subcategory → buildings)
 */
export function getChildren(parentId: string): NavigableItem[] {
  // Si c'est une catégorie, retourner les subcategories ou eras
  const categories = getCategories();
  const isCategory = categories.some((cat) => cat.id === parentId);

  if (isCategory) {
    return getSubcategories(parentId);
  }

  // Sinon, chercher les buildings de cette subcategory
  for (const category of categories) {
    const subcategory = category.subcategories?.find(
      (sub) => sub.id === parentId,
    );
    if (subcategory) {
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
