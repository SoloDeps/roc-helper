import type { BuildingData } from "@/types/shared";
import { ELEMENT_DATA_REGISTRY } from "@/data/registry";
import { DEFAULT_MAX_QTY } from "@/data/config";
import { ERAS } from "./catalog";

// Get element data by catalog ID
// ID format: category_subcategory_building or just building (for backwards compatibility)
export function getBuildingData(elementId: string): BuildingData | null {
  // Try direct lookup first
  // console.log("elementId", elementId);
  if (ELEMENT_DATA_REGISTRY[elementId]) {
    return ELEMENT_DATA_REGISTRY[elementId];
  }

  // For backwards compatibility, try without formatting
  return null;
}

// Index de tri abbr → position chronologique, dérivé de ERAS (source unique).
// Nommé distinctement de ERA_ORDER (data/config.ts), qui est la liste ordonnée.
const ERA_INDEX_BY_ABBR = Object.fromEntries(
  ERAS.map((era, index) => [era.abbr, index]),
);

export function getAvailableEras(data: BuildingData): string[] {
  if (!data?.levels) return [];

  const eras = [...new Set(data.levels.map((l) => l.era))];

  return eras.sort((a, b) => {
    return (ERA_INDEX_BY_ABBR[a] ?? 999) - (ERA_INDEX_BY_ABBR[b] ?? 999);
  });
}

// Get full era name from abbreviation
const ERA_NAMES = Object.fromEntries(ERAS.map((era) => [era.abbr, era.name]));

export function getEraName(eraAbbr: string): string {
  return ERA_NAMES[eraAbbr] || eraAbbr;
}

// Get levels for a specific era and type
export function getLevelsForEraAndType(
  data: BuildingData,
  era: string,
  type: "construction" | "upgrade",
): Array<{ level: number; costs: any; maxQty: number }> {
  if (!data?.levels) return [];

  return data.levels
    .filter((l) => l.era === era && l[type])
    .map((l) => ({
      level: l.level,
      costs: l[type],
      maxQty: l.max_qty || DEFAULT_MAX_QTY,
    }))
    .sort((a, b) => a.level - b.level);
}

// L'agrégation de coûts vit désormais dans `resolvers/costs.ts` (`sumCosts`).
// `calculateTotalCosts` était exportée ici sans aucun importeur, et perdait
// silencieusement les ressources d'un coût imbriqué `{ resources, goods }`.

// Get max quantity for an element in a specific era
export function getMaxQuantity(data: BuildingData, era: string): number {
  if (!data?.levels) return DEFAULT_MAX_QTY;

  const eraLevels = data.levels.filter((l) => l.era === era);
  if (eraLevels.length === 0) return DEFAULT_MAX_QTY;

  // Ne conserver que les max_qty explicitement définis pour ne pas
  // polluer Math.max avec le fallback DEFAULT_MAX_QTY sur les niveaux sans max_qty.
  const defined = eraLevels
    .map((l) => l.max_qty)
    .filter((q): q is number => q !== undefined);

  return defined.length > 0 ? Math.max(...defined) : DEFAULT_MAX_QTY;
}

// Check if a level has construction data
export function hasConstructionData(data: BuildingData, era: string): boolean {
  if (!data?.levels) return false; //TODO a voir
  return data.levels.some((l) => l.era === era && l.construction);
}

// Check if a level has upgrade data
export function hasUpgradeData(data: BuildingData, era: string): boolean {
  if (!data?.levels) return false;
  return data.levels.some((l) => l.era === era && l.upgrade);
}
