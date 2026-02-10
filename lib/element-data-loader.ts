/**
 * Element Data Loader
 * 
 * Professional data loading interface for game elements
 */

import type { BuildingData } from "@/types/shared";

// Import element data files
import { smallHome } from "@/data/capitale/small_homes";
// import { averageHome } from "@/data/capitale/average_homes";
// import { luxuriousHome } from "@/data/capitale/luxurious_homes";
// ... import other data files

/**
 * Element data registry
 * Maps catalog IDs to their data
 */
const ELEMENT_DATA_REGISTRY: Record<string, BuildingData> = {
  'small_home': smallHome,
  // 'average_home': averageHome,
  // 'luxurious_home': luxuriousHome,
  // Add more mappings here
};

/**
 * Get element data by catalog ID
 */
export function getBuildingData(elementId: string): BuildingData | null {
  return ELEMENT_DATA_REGISTRY[elementId] || null;
}

/**
 * Extract available eras from element data
 */
export function getAvailableEras(data: BuildingData): string[] {
  if (!data?.levels) return [];
  const eras = [...new Set(data.levels.map(l => l.era))];
  return eras.sort((a, b) => {
    // Custom era sorting logic
    const eraOrder: Record<string, number> = {
      'SA': 1, 'BA': 2, 'ME': 3, 'CG': 4, 'ER': 5,
      'RE': 6, 'FA': 7, 'IE': 8, 'KS': 9, 'HM': 10, 'EG': 11
    };
    return (eraOrder[a] || 999) - (eraOrder[b] || 999);
  });
}

/**
 * Get full era name from abbreviation
 */
export function getEraName(eraAbbr: string): string {
  const eraNames: Record<string, string> = {
    'SA': 'Stone Age',
    'BA': 'Bronze Age',
    'ME': 'Minoan Era',
    'CG': 'Classic Greece',
    'ER': 'Early Rome',
    'RE': 'Roman Empire',
    'FA': 'Feudal Age',
    'IE': 'Iberian Era',
    'KS': 'Kingdom of Sicily',
    'HM': 'House of Medici',
    'EG': 'Early Gothic',
  };
  return eraNames[eraAbbr] || eraAbbr;
}

/**
 * Get levels for a specific era and type
 */
export function getLevelsForEraAndType(
  data: BuildingData,
  era: string,
  type: 'construction' | 'upgrade'
): Array<{ level: number; costs: any; maxQty: number }> {
  if (!data?.levels) return [];
  
  return data.levels
    .filter(l => l.era === era && l[type])
    .map(l => ({
      level: l.level,
      costs: l[type],
      maxQty: l.max_qty || 40,
    }));
}

/**
 * Calculate total costs for selected levels
 */
export function calculateTotalCosts(
  data: BuildingData,
  selectedLevels: number[],
  quantity: number,
  buildingType: 'construction' | 'upgrade'
): {
  resources: Record<string, number>;
  goods: Array<{ type: string; amount: number }>;
} {
  const resources: Record<string, number> = {};
  const goodsMap = new Map<string, number>();
  
  if (!data?.levels) {
    return { resources, goods: [] };
  }
  
  selectedLevels.forEach(levelNum => {
    const levelData = data.levels.find(l => l.level === levelNum);
    if (!levelData) return;
    
    const costs = levelData[buildingType];
    if (!costs) return;
    
    Object.entries(costs).forEach(([key, value]) => {
      if (key === 'goods' && Array.isArray(value)) {
        value.forEach((g: any) => {
          const existing = goodsMap.get(g.resource);
          goodsMap.set(
            g.resource,
            (existing || 0) + (g.amount * quantity)
          );
        });
      } else if (typeof value === 'number') {
        resources[key] = (resources[key] || 0) + (value * quantity);
      }
    });
  });
  
  const goods = Array.from(goodsMap.entries()).map(([type, amount]) => ({
    type,
    amount,
  }));
  
  return { resources, goods };
}

/**
 * Get max quantity for an element in a specific era
 */
export function getMaxQuantity(data: BuildingData, era: string): number {
  if (!data?.levels) return 40;
  
  const eraLevels = data.levels.filter(l => l.era === era);
  if (eraLevels.length === 0) return 40;
  
  return Math.max(...eraLevels.map(l => l.max_qty || 40));
}

/**
 * Check if a level has construction data
 */
export function hasConstructionData(data: BuildingData, era: string): boolean {
  if (!data?.levels) return false;
  return data.levels.some(l => l.era === era && l.construction);
}

/**
 * Check if a level has upgrade data
 */
export function hasUpgradeData(data: BuildingData, era: string): boolean {
  if (!data?.levels) return false;
  return data.levels.some(l => l.era === era && l.upgrade);
}
