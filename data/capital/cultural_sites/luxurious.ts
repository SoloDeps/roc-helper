import { BuildingData } from "@/types/shared";
import { generateCultureLevels } from "@/data/generateDynamicLevels";

export const luxuriousCultureSiteDynamic = generateCultureLevels({
  buildingId: "luxurious_culture_site",
  defaultMaxQty: 8,
  construction: {
    gems: (l) => l * 120 + 330,
  },
  upgrade: {
    gems: 120,
  },
});

export const luxuriousCultureSite: BuildingData = {
  id: "capital-cultural-sites-luxurious",
  name: "Luxurious Culture Site",
  category: "capital",
  subcategory: "cultural_sites",
  imageName: "Capital_Luxurious_Culture_Site_Lv",
  levels: [
    {
      level: 1,
      era: "SA",
      max_qty: 2,
      construction: {
        gems: 450,
      },
    },
    {
      level: 2,
      era: "BA",
      max_qty: 2,
      construction: {
        gems: 570,
      },
      upgrade: {
        gems: 120,
      },
    },
    {
      level: 3,
      era: "ME",
      max_qty: 3,
      construction: {
        gems: 690,
      },
      upgrade: {
        gems: 120,
      },
    },
    {
      level: 4,
      era: "CG",
      max_qty: 4,
      construction: {
        gems: 810,
      },
      upgrade: {
        gems: 120,
      },
    },
    {
      level: 5,
      era: "ER",
      max_qty: 5,
      construction: {
        gems: 930,
      },
      upgrade: {
        gems: 120,
      },
    },
    {
      level: 6,
      era: "RE",
      max_qty: 6,
      construction: {
        gems: 1050,
      },
      upgrade: {
        gems: 120,
      },
    },
    {
      level: 7,
      era: "BE",
      max_qty: 6,
      construction: {
        gems: 1170,
      },
      upgrade: {
        gems: 120,
      },
    },
    {
      level: 8,
      era: "AF",
      max_qty: 7,
      construction: {
        gems: 1290,
      },
      upgrade: {
        gems: 120,
      },
    },
    {
      level: 9,
      era: "FA",
      max_qty: 7,
      construction: {
        gems: 1410,
      },
      upgrade: {
        gems: 120,
      },
    },
    {
      level: 10,
      era: "IE",
      max_qty: 7,
      construction: {
        gems: 1530,
      },
      upgrade: {
        gems: 120,
      },
    },
    {
      level: 11,
      era: "KS",
      max_qty: 8,
      construction: {
        gems: 1650,
      },
      upgrade: {
        gems: 120,
      },
    },
    {
      level: 12,
      era: "HM",
      max_qty: 8,
      construction: {
        gems: 1770,
      },
      upgrade: {
        gems: 120,
      },
    },
    {
      level: 13,
      era: "EG",
      max_qty: 8,
      construction: {
        gems: 1890,
      },
      upgrade: {
        gems: 120,
      },
    },

    ...luxuriousCultureSiteDynamic,
  ],
};
