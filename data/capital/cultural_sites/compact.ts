import { BuildingData } from "@/types/shared";
import { generateCultureLevels } from "@/data/generateDynamicLevels";

export const compactCultureSiteDynamic = generateCultureLevels({
  buildingId: "compact_culture_site",
  defaultMaxQty: 9,
  construction: {
    coins: (l) => l * 1200000 - 9900000,
    food: (l) => l * 700000 - 5800000,
  },
  upgrade: {
    coins: (l) => l * 140000 - 580000,
    food: (l) => l * 80000 - 360000,
  },
});

export const compactCultureSite: BuildingData = {
  id: "capital-cultural-sites-compact",
  name: "Compact Culture Site",
  category: "capital",
  subcategory: "cultural_sites",
  imageName: "Capital_Compact_Culture_Site_Lv",
  width: 2,
  height: 1,
  levels: [
    {
      level: 1,
      era: "SA",
      max_qty: 4,
      construction: {
        coins: 300,
        food: 200,
      },
    },
    {
      level: 2,
      era: "BA",
      max_qty: 5,
      construction: {
        coins: 3100,
        food: 1800,
      },
      upgrade: {
        coins: 2600,
        food: 1500,
      },
    },
    {
      level: 3,
      era: "ME",
      max_qty: 6,
      construction: {
        coins: 19000,
        food: 11000,
      },
      upgrade: {
        coins: 12900,
        food: 7700,
      },
    },
    {
      level: 4,
      era: "CG",
      max_qty: 7,
      construction: {
        coins: 63000,
        food: 38000,
      },
      upgrade: {
        coins: 36700,
        food: 22100,
      },
    },
    {
      level: 5,
      era: "ER",
      max_qty: 8,
      construction: {
        coins: 170000,
        food: 100000,
      },
      upgrade: {
        coins: 91000,
        food: 55000,
      },
    },
    {
      level: 6,
      era: "RE",
      max_qty: 8,
      construction: {
        coins: 360000,
        food: 220000,
      },
      upgrade: {
        coins: 155000,
        food: 94000,
      },
    },
    {
      level: 7,
      era: "BE",
      max_qty: 9,
      construction: {
        coins: 620000,
        food: 390000,
      },
      upgrade: {
        coins: 220000,
        food: 141000,
      },
    },
    {
      level: 8,
      era: "AF",
      max_qty: 9,
      construction: {
        coins: 1000000,
        food: 630000,
      },
      upgrade: {
        coins: 330000,
        food: 205000,
      },
    },
    {
      level: 9,
      era: "FA",
      max_qty: 9,
      construction: {
        coins: 1600000,
        food: 970000,
      },
      upgrade: {
        coins: 470000,
        food: 283000,
      },
    },
    {
      level: 10,
      era: "IE",
      max_qty: 9,
      construction: {
        coins: 2400000,
        food: 1400000,
      },
      upgrade: {
        coins: 660000,
        food: 390000,
      },
    },
    {
      level: 11,
      era: "KS",
      max_qty: 9,
      construction: {
        coins: 3400000,
        food: 2000000,
      },
      upgrade: {
        coins: 820000,
        food: 450000,
      },
    },
    {
      level: 12,
      era: "HM",
      max_qty: 9,
      construction: {
        coins: 4500000,
        food: 2600000,
      },
      upgrade: {
        coins: 960000,
        food: 520000,
      },
    },
    {
      level: 13,
      era: "EG",
      max_qty: 9,
      construction: {
        coins: 5700000,
        food: 3300000,
      },
      upgrade: {
        coins: 1100000,
        food: 600000,
      },
    },

    ...compactCultureSiteDynamic,
  ],
};
