import type { TechnoData } from "@/types/shared";

import { technos_SA } from "./technos/1_stone_age";
import { technos_BA } from "./technos/2_bronze_age";
import { technos_ME } from "./technos/3_minoan_era";
import { technos_CG } from "./technos/4_classical_greece";
import { technos_ER } from "./technos/5_early_rome";
import { technos_RE } from "./technos/6_roman_empire";
import { technos_BE } from "./technos/7_byzantine_era";
import { technos_AF } from "./technos/8_age_of_the_franks";
import { technos_FA } from "./technos/9_feudal_age";
import { technos_IE } from "./technos/10_iberian_era";
import { technos_KS } from "./technos/11_kingdom_of_sicily";
import { technos_HM } from "./technos/12_high_middle_ages";
import { technos_EG } from "./technos/13_early_gothic_era";
import { technos_LG } from "./technos/14_late_gothic_era";

// ============================================================================
// REGISTRY - Mapping eraId → TechnoData[]
// ============================================================================
export const TECHNOLOGY_REGISTRY: Record<string, TechnoData[]> = {
  stone_age: technos_SA,
  bronze_age: technos_BA,
  minoan_era: technos_ME,
  classical_greece: technos_CG,
  early_rome: technos_ER,
  roman_empire: technos_RE,
  byzantine_era: technos_BE,
  age_of_the_franks: technos_AF,
  feudal_age: technos_FA,
  iberian_era: technos_IE,
  kingdom_of_sicily: technos_KS,
  high_middle_ages: technos_HM,
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
  goods: Array<{ resource: string; amount: number }>;
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

  const goods = Array.from(goodsMap.entries()).map(([resource, amount]) => ({
    resource,
    amount,
  }));

  return { resources, goods };
}



