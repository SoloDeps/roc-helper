import { BuildingData } from "@/types/shared";
import { generateLuxuryLevels } from "@/data/generateDynamicLevels";

export const luxuriousFarmDynamic = generateLuxuryLevels({
  buildingId: "luxurious_farm",
  defaultMaxQty: 8,
  upgrade: { gems: 100 },
  construction: { gems: (l) => Math.ceil(l / 3) * 100 + 290 },
});

export const luxuriousFarm: BuildingData = {
  id: "capital-luxurious-farm",
  name: "Luxurious Farm",
  category: "capital",
  subcategory: "farms",
  imageName: "Capital_Luxurious_Farm_Lv",
  levels: [
    {
      level: 3,
      era: "SA",
      max_qty: 1,
      construction: {
        gems: 390,
      },
    },
    {
      level: 6,
      era: "BA",
      max_qty: 3,
      construction: {
        gems: 490,
      },
      upgrade: {
        gems: 100,
      },
    },
    {
      level: 9,
      era: "ME",
      max_qty: 4,
      construction: {
        gems: 590,
      },
      upgrade: {
        gems: 100,
      },
    },
    {
      level: 12,
      era: "CG",
      max_qty: 4,
      construction: {
        gems: 690,
      },
      upgrade: {
        gems: 100,
      },
    },
    {
      level: 15,
      era: "ER",
      max_qty: 5,
      construction: {
        gems: 790,
      },
      upgrade: {
        gems: 100,
      },
    },
    {
      level: 18,
      era: "RE",
      max_qty: 6,
      construction: {
        gems: 890,
      },
      upgrade: {
        gems: 100,
      },
    },
    {
      level: 21,
      era: "BE",
      max_qty: 7,
      construction: {
        gems: 990,
      },
      upgrade: {
        gems: 100,
      },
    },
    {
      level: 24,
      era: "AF",
      max_qty: 7,
      construction: {
        gems: 1090,
      },
      upgrade: {
        gems: 100,
      },
    },
    {
      level: 27,
      era: "FA",
      max_qty: 7,
      construction: {
        gems: 1190,
      },
      upgrade: {
        gems: 100,
      },
    },
    {
      level: 30,
      era: "IE",
      max_qty: 8,
      construction: {
        gems: 1290,
      },
      upgrade: {
        gems: 100,
      },
    },
    {
      level: 33,
      era: "KS",
      max_qty: 8,
      construction: {
        gems: 1390,
      },
      upgrade: {
        gems: 100,
      },
    },
    {
      level: 36,
      era: "HM",
      max_qty: 8,
      construction: {
        gems: 1490,
      },
      upgrade: {
        gems: 100,
      },
    },
    {
      level: 39,
      era: "EG",
      max_qty: 8,
      construction: {
        gems: 1590,
      },
      upgrade: {
        gems: 100,
      },
    },
    ...luxuriousFarmDynamic,
  ],
};
