import { BuildingData } from "@/types/shared";
import { generateCultureLevels } from "@/data/generateDynamicLevels";

export const moderateCultureSiteDynamic = generateCultureLevels({
  buildingId: "moderate_culture_site",
  defaultMaxQty: 6,
  construction: {
    coins: (l) => l * 2500000 - 20700000,
    food: (l) => l * 1400000 - 11200000,
  },
  upgrade: {
    coins: (l) => l * 310000 - 1420000,
    food: (l) => l * 180000 - 860000,
  },
  culture_range: 2,
  culture_bonus: (l) => l * 140 - 520,
});

export const moderateCultureSite: BuildingData = {
  id: "capital-cultural-sites-moderate",
  name: "Moderate Culture Site",
  category: "capital",
  subcategory: "cultural_sites",
  imageName: "Capital_Moderate_Culture_Site_Lv",
  width: 2,
  height: 2,
  levels: [
    {
      level: 1,
      era: "SA",
      max_qty: 2,
      culture_range: 2,
      culture_bonus: 160,
      construction: {
        coins: 20,
        food: 10,
      },
    },
    {
      level: 2,
      era: "BA",
      max_qty: 2,
      culture_range: 2,
      culture_bonus: 200,
      construction: {
        coins: 6400,
        food: 4000,
      },
      upgrade: {
        coins: 5300,
        food: 3300,
      },
    },
    {
      level: 3,
      era: "ME",
      max_qty: 3,
      culture_range: 2,
      culture_bonus: 240,
      construction: {
        coins: 38000,
        food: 24000,
      },
      upgrade: {
        coins: 26200,
        food: 16500,
      },
    },
    {
      level: 4,
      era: "CG",
      max_qty: 3,
      culture_range: 2,
      culture_bonus: 280,
      construction: {
        coins: 130000,
        food: 80000,
      },
      upgrade: {
        coins: 77000,
        food: 47000,
      },
    },
    {
      level: 5,
      era: "ER",
      max_qty: 3,
      culture_range: 2,
      culture_bonus: 320,
      construction: {
        coins: 360000,
        food: 220000,
      },
      upgrade: {
        coins: 191000,
        food: 118000,
      },
    },
    {
      level: 6,
      era: "RE",
      max_qty: 4,
      culture_range: 2,
      culture_bonus: 400,
      construction: {
        coins: 750000,
        food: 460000,
      },
      upgrade: {
        coins: 322000,
        food: 200000,
      },
    },
    {
      level: 7,
      era: "BE",
      max_qty: 4,
      culture_range: 2,
      culture_bonus: 480,
      construction: {
        coins: 1300000,
        food: 830000,
      },
      upgrade: {
        coins: 450000,
        food: 303000,
      },
    },
    {
      level: 8,
      era: "AF",
      max_qty: 4,
      culture_range: 2,
      culture_bonus: 560,
      construction: {
        coins: 2100000,
        food: 1400000,
      },
      upgrade: {
        coins: 700000,
        food: 440000,
      },
    },
    {
      level: 9,
      era: "FA",
      max_qty: 4,
      culture_range: 2,
      culture_bonus: 680,
      construction: {
        coins: 3300000,
        food: 2100000,
      },
      upgrade: {
        coins: 960000,
        food: 600000,
      },
    },
    {
      level: 10,
      era: "IE",
      max_qty: 4,
      culture_range: 2,
      culture_bonus: 800,
      construction: {
        coins: 4900000,
        food: 3100000,
      },
      upgrade: {
        coins: 1370000,
        food: 840000,
      },
    },
    {
      level: 11,
      era: "KS",
      max_qty: 5,
      culture_range: 2,
      culture_bonus: 960,
      construction: {
        coins: 6900000,
        food: 4200000,
      },
      upgrade: {
        coins: 1690000,
        food: 950000,
      },
    },
    {
      level: 12,
      era: "HM",
      max_qty: 5,
      culture_range: 2,
      culture_bonus: 1160,
      construction: {
        coins: 9300000,
        food: 5600000,
      },
      upgrade: {
        coins: 1990000,
        food: 1120000,
      },
    },
    {
      level: 13,
      era: "EG",
      max_qty: 6,
      culture_range: 2,
      culture_bonus: 1300,
      construction: {
        coins: 11800000,
        food: 7000000,
      },
      upgrade: {
        coins: 2300000,
        food: 1300000,
      },
    },

    ...moderateCultureSiteDynamic,
  ],
};