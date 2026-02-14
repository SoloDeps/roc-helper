import type { BuildingData } from "@/types/shared";

// Import element data files
// capital
import { smallHome } from "@/data/capital/homes/small_home";
import { averageHome } from "@/data/capital/homes/average_home";
import { luxuriousHome } from "@/data/capital/homes/luxurious_home";
import { ruralFarm } from "@/data/capital/farms/rural_farm";
import { domesticFarm } from "@/data/capital/farms/domestic_farm";
import { luxuriousFarm } from "@/data/capital/farms/luxurious_farm";
// egypt
import { egyptSmallHome, egyptAverageHome, egyptLuxuriousHome } from "@/data/egypt/homes";

/**
 * Element data registry
 * Maps catalog IDs to their data
 */
export const ELEMENT_DATA_REGISTRY: Record<string, BuildingData> = {
  // capital - format: category_building
  capital_small_home: smallHome,
  capital_average_home: averageHome,
  capital_luxurious_home: luxuriousHome,
  capital_rural_farm: ruralFarm,
  capital_domestic_farm: domesticFarm,
  capital_luxurious_farm: luxuriousFarm,
  // egypt
  egypt_small_home: egyptSmallHome,
  egypt_average_home: egyptAverageHome,
  egypt_luxurious_home: egyptLuxuriousHome,
};
