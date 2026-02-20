import { BuildingData } from "@/types/shared";
import { generateCultureLevels } from "@/data/generateDynamicLevels";

export const littleCultureSiteDynamic = generateCultureLevels({
  buildingId: "little_culture_site",
  defaultMaxQty: 10,
  construction: {
    coins: (l) => l * 800000 - 7000000,
    food: (l) => l * 500000 - 4600000,
  },
  upgrade: {
    coins: (l) => l * 100000 - 550000,
    food: (l) => l * 44000 - 178000,
  },
});

export const littleCultureSite: BuildingData = {
  id: "capital-cultural-sites-little",
  name: "Little Culture Site",
  category: "capital",
  subcategory: "cultural_sites",
  imageName: "Capital_Little_Culture_Site_Lv",
  levels: [
    {
      level: 2,
      era: "BA",
      max_qty: 3,
      construction: {
        coins: 1800,
        food: 1100,
      },
    },
    {
      level: 3,
      era: "ME",
      max_qty: 4,
      construction: {
        coins: 11000,
        food: 6700,
      },
      upgrade: {
        coins: 7300,
        food: 4700,
      },
    },
    {
      level: 4,
      era: "CG",
      max_qty: 4,
      construction: {
        coins: 36000,
        food: 22000,
      },
      upgrade: {
        coins: 21100,
        food: 13100,
      },
    },
    {
      level: 5,
      era: "ER",
      max_qty: 5,
      construction: {
        coins: 98000,
        food: 61000,
      },
      upgrade: {
        coins: 52000,
        food: 32300,
      },
    },
    {
      level: 6,
      era: "RE",
      max_qty: 6,
      construction: {
        coins: 210000,
        food: 130000,
      },
      upgrade: {
        coins: 89000,
        food: 56000,
      },
    },
    {
      level: 7,
      era: "BE",
      max_qty: 7,
      construction: {
        coins: 360000,
        food: 230000,
      },
      upgrade: {
        coins: 125000,
        food: 84000,
      },
    },
    {
      level: 8,
      era: "AF",
      max_qty: 7,
      construction: {
        coins: 590000,
        food: 380000,
      },
      upgrade: {
        coins: 193000,
        food: 122000,
      },
    },
    {
      level: 9,
      era: "FA",
      max_qty: 7,
      construction: {
        coins: 900000,
        food: 580000,
      },
      upgrade: {
        coins: 263000,
        food: 167000,
      },
    },
    {
      level: 10,
      era: "IE",
      max_qty: 7,
      construction: {
        coins: 1400000,
        food: 860000,
      },
      upgrade: {
        coins: 380000,
        food: 236000,
      },
    },
    {
      level: 11,
      era: "KS",
      max_qty: 7,
      construction: {
        coins: 1900000,
        food: 1200000,
      },
      upgrade: {
        coins: 470000,
        food: 262000,
      },
    },
    {
      level: 12,
      era: "HM",
      max_qty: 8,
      construction: {
        coins: 2600000,
        food: 1500000,
      },
      upgrade: {
        coins: 550000,
        food: 306000,
      },
    },
    {
      level: 13,
      era: "EG",
      max_qty: 9,
      construction: {
        coins: 3400000,
        food: 1900000,
      },
      upgrade: {
        coins: 650000,
        food: 350000,
      },
    },

    ...littleCultureSiteDynamic,
  ],
};
