import type { BuildingData } from "@/types/shared";
import { ELEMENT_DATA_REGISTRY } from "@/data/registry";
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

// Créer le mapping une seule fois
const ERA_ORDER = Object.fromEntries(
  ERAS.map((era, index) => [era.abbr, index]),
);

export function getAvailableEras(data: BuildingData): string[] {
  if (!data?.levels) return [];

  const eras = [...new Set(data.levels.map((l) => l.era))];

  return eras.sort((a, b) => {
    return (ERA_ORDER[a] ?? 999) - (ERA_ORDER[b] ?? 999);
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
      maxQty: l.max_qty || 40,
    }));
}

// Calculate total costs for selected levels
export function calculateTotalCosts(
  data: BuildingData,
  selectedLevels: number[],
  quantity: number,
  buildingType: "construction" | "upgrade",
): {
  resources: Record<string, number>;
  goods: Array<{ type: string; amount: number }>;
} {
  const resources: Record<string, number> = {};
  const goodsMap = new Map<string, number>();

  if (!data?.levels) {
    return { resources, goods: [] };
  }

  selectedLevels.forEach((levelNum) => {
    const levelData = data.levels.find((l) => l.level === levelNum);
    if (!levelData) return;

    const costs = levelData[buildingType];
    if (!costs) return;

    Object.entries(costs).forEach(([key, value]) => {
      if (key === "goods" && Array.isArray(value)) {
        value.forEach((g: any) => {
          const existing = goodsMap.get(g.resource);
          goodsMap.set(g.resource, (existing || 0) + g.amount * quantity);
        });
      } else if (typeof value === "number") {
        resources[key] = (resources[key] || 0) + value * quantity;
      }
    });
  });

  const goods = Array.from(goodsMap.entries()).map(([type, amount]) => ({
    type,
    amount,
  }));

  return { resources, goods };
}

// Get max quantity for an element in a specific era
export function getMaxQuantity(data: BuildingData, era: string): number {
  if (!data?.levels) return 40;

  const eraLevels = data.levels.filter((l) => l.era === era);
  if (eraLevels.length === 0) return 40;

  return Math.max(...eraLevels.map((l) => l.max_qty || 40));
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
