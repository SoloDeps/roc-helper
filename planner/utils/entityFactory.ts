// ─────────────────────────────────────────────────────────────────────────────
// entityFactory.ts — Phase 4 (fix tailles)
//
// PROBLÈME CORRIGÉ :
//   BUILDING_SIZE_BY_GROUP dans buildingDefinitions.ts prend le premier level=1
//   toutes villes confondues → tailles incorrectes pour la Capital.
//   Ex: averageHome → Egypt level=1 (4×3) au lieu de Capital (3×3).
//
// SOLUTION :
//   Table CAPITAL_BUILDING_SIZES extraite depuis buildingDefinitions.ts
//   en filtrant City_Capital + niveau le plus bas. Source de vérité unique.
// ─────────────────────────────────────────────────────────────────────────────

import { CityMapEntity, type EntitySize, nextEntityId } from "../core/cityMapEntity";
import type { GridPoint } from "../core/mapGrid";

// ─────────────────────────────────────────────────────────────────────────────
// Table des tailles correctes pour la Capital (extraite de buildingDefinitions.ts)
// Généré automatiquement — ne pas éditer manuellement
// Source : gamedesign.json → City_Capital, niveau minimal
// ─────────────────────────────────────────────────────────────────────────────

const CAPITAL_BUILDING_SIZES: Record<string, EntitySize> = {
  // Homes
  smallHome: { w: 2, h: 2 },
  averageHome: { w: 3, h: 3 },
  luxuriousHome: { w: 3, h: 2 },
  premiumHome: { w: 3, h: 2 },
  smallSailorHome: { w: 2, h: 2 },
  premiumSailorHome: { w: 2, h: 2 },
  // Farms
  ruralFarm: { w: 4, h: 3 },
  domesticFarm: { w: 4, h: 4 },
  luxuriousFarm: { w: 3, h: 3 }, // gems only
  premiumFarm: { w: 3, h: 3 },
  // Culture sites
  littleCulture: { w: 1, h: 1 },
  compactCulture: { w: 2, h: 1 },
  moderateCulture: { w: 2, h: 2 },
  largeCulture: { w: 4, h: 3 },
  luxuriousCulture: { w: 3, h: 3 }, // gems only — à confirmer
  premiumCulture: { w: 3, h: 2 },
  // Workshops
  artisan: { w: 4, h: 3 },
  stoneMason: { w: 4, h: 3 },
  tailor: { w: 4, h: 3 },
  scribe: { w: 4, h: 3 },
  carpenter: { w: 4, h: 3 },
  spiceMerchant: { w: 4, h: 3 },
  alchemist: { w: 4, h: 3 },
  jeweler: { w: 4, h: 3 },
  glassblower: { w: 4, h: 3 },
  // Barracks
  infantryBarracks: { w: 4, h: 4 },
  rangedBarracks: { w: 3, h: 5 },
  cavalryBarracks: { w: 4, h: 5 },
  heavyInfantryBarracks: { w: 5, h: 5 },
  siegeBarracks: { w: 6, h: 5 },
  // Port
  normalShipyard: { w: 5, h: 3 },
  normalWarehouse: { w: 3, h: 3 },
  premiumWarehouse: { w: 3, h: 2 },
  lighthouse: { w: 3, h: 2 },
  pier: { w: 3, h: 1 },
  // City hall
  cityHall: { w: 5, h: 5 },
  // Market
  market: { w: 4, h: 4 },
};

// ─────────────────────────────────────────────────────────────────────────────
// Exports
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Retourne la taille réelle d'un bâtiment en tuiles.
 * Priorité : CAPITAL_BUILDING_SIZES → fallback 1×1.
 */
export function getBuildingSize(buildingDataId: string): EntitySize {
  return CAPITAL_BUILDING_SIZES[buildingDataId] ?? { w: 1, h: 1 };
}

export function createEntityFromBuilding(
  buildingDataId: string,
  location: GridPoint,
  isRotated = false,
): CityMapEntity {
  return new CityMapEntity(
    nextEntityId(),
    buildingDataId,
    location,
    getBuildingSize(buildingDataId),
    isRotated,
  );
}

/**
 * Ghost entity (id=0) — jamais ajouté au store.
 * Toujours passer ignoreEntityId=0 à validatePlacement.
 */
export function createGhostEntity(
  buildingDataId: string,
  location: GridPoint,
  isRotated = false,
): CityMapEntity {
  return new CityMapEntity(
    0,
    buildingDataId,
    location,
    getBuildingSize(buildingDataId),
    isRotated,
  );
}
