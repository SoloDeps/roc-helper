import { BuildingData } from "@/types/shared";
import { generateCultureLevels } from "@/data/generateDynamicLevels";

export const largeCultureSiteDynamic = generateCultureLevels({
  buildingId: "large_culture_site",
  defaultMaxQty: 1,
  construction: {
    coins: (l) => l * 8000000 - 64000000,
    food: (l) => l * 6000000 - 53000000,
  },
  upgrade: {
    coins: (l) => l * 1200000 - 6400000,
    food: (l) => l * 600000 - 2900000,
  },
});

export const largeCultureSite: BuildingData = {
  id: "capital-cultural-sites-large",
  name: "Large Culture Site",
  category: "capital",
  subcategory: "cultural_sites",
  imageName: "Capital_Large_Culture_Site_Lv",
  levels: [
    {
      level: 4,
      era: "CG",
      max_qty: 1,
      construction: {
        coins: 440000,
        food: 270000,
      },
    },
    {
      level: 5,
      era: "ER",
      max_qty: 1,
      construction: {
        coins: 1200000,
        food: 740000,
      },
      upgrade: {
        coins: 650000,
        food: 389000,
      },
    },
    {
      level: 6,
      era: "RE",
      max_qty: 1,
      construction: {
        coins: 2500000,
        food: 1500000,
      },
      upgrade: {
        coins: 1100000,
        food: 660000,
      },
    },
    {
      level: 7,
      era: "BE",
      max_qty: 1,
      construction: {
        coins: 4400000,
        food: 2700000,
      },
      upgrade: {
        coins: 1550000,
        food: 1010000,
      },
    },
    {
      level: 8,
      era: "AF",
      max_qty: 1,
      construction: {
        coins: 7300000,
        food: 4500000,
      },
      upgrade: {
        coins: 2390000,
        food: 1470000,
      },
    },
    {
      level: 9,
      era: "FA",
      max_qty: 1,
      construction: {
        coins: 11000000,
        food: 6900000,
      },
      upgrade: {
        coins: 3360000,
        food: 2010000,
      },
    },
    {
      level: 10,
      era: "IE",
      max_qty: 1,
      construction: {
        coins: 17000000,
        food: 10000000,
      },
      upgrade: {
        coins: 4700000,
        food: 2820000,
      },
    },
    {
      level: 11,
      era: "KS",
      max_qty: 1,
      construction: {
        coins: 24000000,
        food: 14000000,
      },
      upgrade: {
        coins: 5800000,
        food: 3170000,
      },
    },
    {
      level: 12,
      era: "HM",
      max_qty: 1,
      construction: {
        coins: 32000000,
        food: 19000000,
      },
      upgrade: {
        coins: 6800000,
        food: 3700000,
      },
    },
    {
      level: 13,
      era: "EG",
      max_qty: 1,
      construction: {
        coins: 40000000,
        food: 25000000,
      },
      upgrade: {
        coins: 8000000,
        food: 4300000,
      },
    },

    ...largeCultureSiteDynamic,
  ],
};
