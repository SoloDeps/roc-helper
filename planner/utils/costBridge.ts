// ─────────────────────────────────────────────────────────────────────────────
// costBridge.ts
// Pont entre CityMapEntity[] et calculateTotalCosts() de roc-helper
//
// Convention ID :
//   CityMapEntity.buildingDataId = clé courte  ('smallHome', 'ruralFarm'…)
//   Registry roc-helper          = préfixé      ('capital_small_home'…)
//   Mapping géré ici, une seule fois.
// ─────────────────────────────────────────────────────────────────────────────

import { getBuildingData } from '@/lib/element-data-loader';
import type { CityMapEntity } from '@/planner/core/cityMapEntity';
import type { EraCode } from '@/types/shared';
import type { HydratedBuilding } from '@/lib/db/data-hydration';

// ─────────────────────────────────────────────────────────────────────────────
// Mapping buildingDataId (clé courte) → registry ID (capital_*)
// ─────────────────────────────────────────────────────────────────────────────

const PLANNER_ID_TO_REGISTRY: Record<string, string> = {
  // Homes
  smallHome:             'capital_small_home',
  averageHome:           'capital_average_home',
  luxuriousHome:         'capital_luxurious_home',
  premiumHome:           'capital_seafarer_house',
  smallSailorHome:       'capital_seafarer_house',
  premiumSailorHome:     'capital_luxurious_seafarer_house',
  // Farms
  ruralFarm:             'capital_rural_farm',
  domesticFarm:          'capital_domestic_farm',
  luxuriousFarm:         'capital_luxurious_farm',
  premiumFarm:           'capital_rural_farm', // pas d'équivalent exact
  // Culture sites
  littleCulture:         'capital_little_culture_site',
  compactCulture:        'capital_compact_culture_site',
  moderateCulture:       'capital_moderate_culture_site',
  largeCulture:          'capital_large_culture_site',
  luxuriousCulture:      'capital_luxurious_culture_site',
  premiumCulture:        'capital_luxurious_culture_site',
  // Workshops
  artisan:               'capital_artisan',
  stoneMason:            'capital_stone_mason',
  tailor:                'capital_tailor',
  scribe:                'capital_scribe',
  carpenter:             'capital_carpenter',
  spiceMerchant:         'capital_spice_merchant',
  alchemist:             'capital_alchemist',
  jeweler:               'capital_jeweler',
  glassblower:           'capital_glassblower',
  // Barracks
  infantryBarracks:      'capital_infantry_barracks',
  rangedBarracks:        'capital_ranged_barracks',
  cavalryBarracks:       'capital_cavalry_barracks',
  heavyInfantryBarracks: 'capital_heavy_infantry_barracks',
  siegeBarracks:         'capital_siege_barracks',
  // Port
  normalShipyard:        'capital_shipyard',
  normalWarehouse:       'capital_common_warehouse',
  premiumWarehouse:      'capital_large_warehouse',
  lighthouse:            'capital_lighthouse',
  pier:                  'capital_pier',
  cityHall:              'capital_small_home', // pas dans registry
  market:                'capital_small_home', // pas dans registry
};

export function toRegistryId(buildingDataId: string): string | null {
  return PLANNER_ID_TO_REGISTRY[buildingDataId] ?? null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Max quantity pour un bâtiment dans une ère donnée
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Retourne la max_qty d'un bâtiment pour l'ère courante.
 * Prend le dernier niveau de l'ère (ou l'ère précédente la plus proche).
 * Retourne Infinity si pas de limite trouvée.
 */
export function getMaxQtyForBuilding(
  buildingDataId: string,
  currentEra: EraCode,
): number {
  const registryId = toRegistryId(buildingDataId);
  if (!registryId) return Infinity;

  const data = getBuildingData(registryId);
  if (!data) return Infinity;

  // Chercher le max_qty du dernier niveau de l'ère courante ou antérieure
  // Les niveaux sont ordonnés chronologiquement dans les données
  let lastMaxQty: number | undefined;

  for (const lvl of data.levels) {
    if (lvl.max_qty !== undefined) {
      lastMaxQty = lvl.max_qty;
    }
    // Arrêter dès qu'on dépasse l'ère courante
    if (lvl.era === currentEra) break;
  }

  return lastMaxQty ?? Infinity;
}

/**
 * Construit la Map<buildingDataId, maxQty> pour PlacementContext.
 * Appelé une fois par changement d'ère, résultat passé au store.
 */
export function buildMaxQtyMap(currentEra: EraCode): Map<string, number> {
  const map = new Map<string, number>();
  for (const buildingDataId of Object.keys(PLANNER_ID_TO_REGISTRY)) {
    const qty = getMaxQtyForBuilding(buildingDataId, currentEra);
    if (qty !== Infinity) {
      map.set(buildingDataId, qty);
    }
  }
  return map;
}

// ─────────────────────────────────────────────────────────────────────────────
// Conversion CityMapEntity[] → HydratedBuilding[] pour calculateTotalCosts()
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Convertit les entités placées en HydratedBuilding[] compatibles
 * avec calculateTotalCosts() existant.
 *
 * - Regroupe les entités par buildingDataId (quantity > 1)
 * - Prend le niveau correspondant à l'ère courante
 * - Type 'upgrade' (coûts d'upgrade du niveau courant)
 */
export function entitiesToHydratedBuildings(
  entities: ReadonlyMap<number, CityMapEntity>,
  currentEra: EraCode,
): HydratedBuilding[] {
  // Compter par buildingDataId
  const countByType = new Map<string, number>();
  for (const entity of entities.values()) {
    countByType.set(
      entity.buildingDataId,
      (countByType.get(entity.buildingDataId) ?? 0) + 1,
    );
  }

  const result: HydratedBuilding[] = [];

  for (const [buildingDataId, quantity] of countByType) {
    const registryId = toRegistryId(buildingDataId);
    if (!registryId) continue;

    const data = getBuildingData(registryId);
    if (!data) continue;

    // Trouver le dernier niveau disponible pour l'ère courante
    let targetLevel = data.levels[0];
    for (const lvl of data.levels) {
      targetLevel = lvl;
      if (lvl.era === currentEra) break;
    }

    if (!targetLevel) continue;

    // Construire les coûts
    const upgrade = targetLevel.upgrade ?? {};
    const resources: Record<string, number> = {};
    if (upgrade.coins)           resources['coins']           = upgrade.coins;
    if (upgrade.food)            resources['food']            = upgrade.food;
    if (upgrade.gems)            resources['gems']            = upgrade.gems;
    if (upgrade.research_points) resources['research_points'] = upgrade.research_points;

    const goods = (upgrade.goods ?? []).map(g => ({
      resource: g.resource,
      amount:   g.amount,
    }));

    result.push({
      id:                  `planner_${buildingDataId}`,
      name:                data.name,
      accordionName:       data.name,
      isUnresolvedWorkshop: false,
      imageName:           data.imageName,
      imgLvl:              true,
      category:            data.category,
      subcategory:         data.subcategory,
      elementId:           registryId,
      type:                'upgrade',
      era:                 targetLevel.era,
      level:               targetLevel.level,
      maxQty:              targetLevel.max_qty ?? 999,
      costs:               { resources, goods },
      quantity,
      hidden:              false,
    });
  }

  return result;
}
