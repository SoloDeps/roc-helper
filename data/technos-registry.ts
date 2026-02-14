import type { TechnoData } from "@/types/shared";

/**
 * Technology Registry - Toutes les technologies par ère
 * 
 * Structure:
 * - Chaque ère a une liste de TechnoData[]
 * - Quand on ajoute une ère, TOUTES les technos sont ajoutées individuellement en DB
 * - La card affiche la SOMME des technos non-hidden
 * - Future page "Technology Tracker" : permet de cocher/décocher individuellement
 */

// ============================================================================
// STONE AGE (SA)
// ============================================================================
export const technos_SA: TechnoData[] = [
  {
    id: "techno_stone_age_0",
    name: "Wheel",
    column: 0,
    costs: {
      research_points: 20,
      coins: 200,
      food: 150,
    },
  },
  {
    id: "techno_stone_age_1",
    name: "Pictographs",
    column: 1,
    costs: {
      research_points: 20,
      coins: 250,
      food: 200,
    },
  },
  {
    id: "techno_stone_age_2",
    name: "Smelting",
    column: 1,
    costs: {
      research_points: 30,
      coins: 350,
      food: 250,
    },
  },
  {
    id: "techno_stone_age_3",
    name: "Pottery",
    column: 2,
    costs: {
      research_points: 50,
      coins: 400,
      food: 200,
    },
  },
];

// ============================================================================
// BRONZE AGE (BA)
// ============================================================================
export const technos_BA: TechnoData[] = [
  {
    id: "techno_bronze_age_0",
    name: "Alphabet",
    column: 0,
    costs: {
      research_points: 80,
      coins: 1200,
      food: 800,
      goods: [
        { resource: "wool", amount: 50 },
        { resource: "alabaster_idol", amount: 50 },
      ],
    },
  },
  {
    id: "techno_bronze_age_1",
    name: "Arithmetic",
    column: 1,
    costs: {
      research_points: 100,
      coins: 1500,
      food: 1000,
      goods: [
        { resource: "bronze_bracelet", amount: 50 },
        { resource: "wool", amount: 50 },
      ],
    },
  },
  {
    id: "techno_bronze_age_2",
    name: "Irrigation",
    column: 1,
    costs: {
      research_points: 120,
      coins: 2000,
      food: 1200,
      goods: [
        { resource: "alabaster_idol", amount: 50 },
        { resource: "bronze_bracelet", amount: 50 },
      ],
    },
  },
  {
    id: "techno_bronze_age_3",
    name: "Geometry",
    column: 2,
    costs: {
      research_points: 180,
      coins: 2500,
      food: 1800,
      goods: [
        { resource: "wool", amount: 50 },
        { resource: "alabaster_idol", amount: 50 },
        { resource: "bronze_bracelet", amount: 50 },
      ],
    },
  },
];

// ============================================================================
// EARLY GOTHIC ERA (EG)
// ============================================================================
export const technos_EG: TechnoData[] = [
  {
    id: "techno_early_gothic_era_0",
    name: "Flying Buttresses",
    column: 0,
    costs: {
      research_points: 100,
      coins: 2900000,
      food: 3500000,
      goods: [
        { resource: "tertiary_hm", amount: 13500 },
        { resource: "primary_hm", amount: 5700 },
      ],
    },
  },
  {
    id: "techno_early_gothic_era_1",
    name: "Carrucas",
    column: 1,
    costs: {
      research_points: 110,
      coins: 5900000,
      food: 3200000,
      goods: [
        { resource: "primary_hm", amount: 13000 },
        { resource: "secondary_hm", amount: 5350 },
        { resource: "primary_ks", amount: 4300 },
      ],
    },
  },
  {
    id: "techno_early_gothic_era_2",
    name: "Deep Sea Ports",
    allied: "ottoman",
    column: 1,
    costs: {
      research_points: 28,
      coins: 5900000,
      food: 4000000,
      goods: [
        { resource: "secondary_hm", amount: 10000 },
        { resource: "tertiary_hm", amount: 4250 },
        { resource: "primary_ie", amount: 4250 },
      ],
    },
  },
];

// ============================================================================
// LATE GOTHIC ERA (LG)
// ============================================================================
export const technos_LG: TechnoData[] = [
  {
    id: "techno_late_gothic_era_0",
    name: "Printing Press",
    column: 0,
    costs: {
      research_points: 120,
      coins: 4200000,
      food: 5000000,
      goods: [
        { resource: "stained_glass", amount: 18000 },
        { resource: "embellishments", amount: 7500 },
      ],
    },
  },
  {
    id: "techno_late_gothic_era_1",
    name: "Astronomy",
    column: 1,
    costs: {
      research_points: 130,
      coins: 8500000,
      food: 4500000,
      goods: [
        { resource: "embellishments", amount: 18000 },
        { resource: "elixirs", amount: 7500 },
        { resource: "stained_glass", amount: 6000 },
      ],
    },
  },
  {
    id: "techno_late_gothic_era_2",
    name: "Compass",
    column: 1,
    costs: {
      research_points: 35,
      coins: 8500000,
      food: 5700000,
      goods: [
        { resource: "elixirs", amount: 14000 },
        { resource: "stained_glass", amount: 6000 },
        { resource: "embellishments", amount: 6000 },
      ],
    },
  },
];

// ============================================================================
// REGISTRY - Mapping eraId → TechnoData[]
// ============================================================================
export const TECHNOLOGY_REGISTRY: Record<string, TechnoData[]> = {
  stone_age: technos_SA,
  bronze_age: technos_BA,
  // ... ajouter toutes les autres ères
  early_gothic_era: technos_EG,
  late_gothic_era: technos_LG,
};

/**
 * Get all technologies for a specific era
 */
export function getTechnologiesByEra(eraId: string): TechnoData[] {
  return TECHNOLOGY_REGISTRY[eraId] || [];
}

/**
 * Get all available eras that have technologies
 */
export function getAvailableTechEras(): string[] {
  return Object.keys(TECHNOLOGY_REGISTRY);
}

/**
 * Calculate total costs for an array of technologies
 * Used for displaying the aggregated card
 */
export function calculateTotalTechnoCosts(technos: TechnoData[]): {
  resources: Record<string, number>;
  goods: Array<{ type: string; amount: number }>;
} {
  const resources: Record<string, number> = {};
  const goodsMap = new Map<string, number>();

  technos.forEach((techno) => {
    // Aggregate resources
    Object.entries(techno.costs).forEach(([key, value]) => {
      if (key === "goods" && Array.isArray(value)) {
        // Aggregate goods
        value.forEach((good) => {
          const existing = goodsMap.get(good.resource);
          goodsMap.set(good.resource, (existing || 0) + good.amount);
        });
      } else if (typeof value === "number") {
        // Aggregate numeric resources
        resources[key] = (resources[key] || 0) + value;
      }
    });
  });

  const goods = Array.from(goodsMap.entries()).map(([type, amount]) => ({
    type,
    amount,
  }));

  return { resources, goods };
}