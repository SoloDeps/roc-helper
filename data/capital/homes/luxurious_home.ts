import { BuildingData } from "@/types/shared";
import { generateLuxuryLevels } from "@/data/generateDynamicLevels";

export const luxuriousHomeDynamic = generateLuxuryLevels({
  buildingId: "luxurious_home",
  defaultMaxQty: 12,
  upgrade: { gems: 50 },
  construction: { gems: (l) => Math.ceil(l / 3) * 50 + 700 },
});

export const luxuriousHome: BuildingData = {
  id: "capital-homes-luxurious-home",
  name: "Luxurious Home",
  category: "capital",
  subcategory: "homes",
  imageName: "Capital_Luxurious_Home_Lv",
  width: 3,
  height: 2,
  levels: [
    {
      level: 3,
      era: "SA",
      max_qty: 2,
      construction: {
        gems: 750,
      },
    },
    {
      level: 6,
      era: "BA",
      max_qty: 4,
      construction: {
        gems: 800,
      },
      upgrade: {
        gems: 50,
      },
    },
    {
      level: 9,
      era: "ME",
      max_qty: 5,
      construction: {
        gems: 850,
      },
      upgrade: {
        gems: 50,
      },
    },
    {
      level: 12,
      era: "CG",
      max_qty: 6,
      construction: {
        gems: 900,
      },
      upgrade: {
        gems: 50,
      },
    },
    {
      level: 15,
      era: "ER",
      max_qty: 7,
      construction: {
        gems: 950,
      },
      upgrade: {
        gems: 50,
      },
    },
    {
      level: 18,
      era: "RE",
      max_qty: 8,
      construction: {
        gems: 1000,
      },
      upgrade: {
        gems: 50,
      },
    },
    {
      level: 21,
      era: "BE",
      max_qty: 9,
      construction: {
        gems: 1050,
      },
      upgrade: {
        gems: 50,
      },
    },
    {
      level: 24,
      era: "AF",
      max_qty: 9,
      construction: {
        gems: 1100,
      },
      upgrade: {
        gems: 50,
      },
    },
    {
      level: 27,
      era: "FA",
      max_qty: 9,
      construction: {
        gems: 1150,
      },
      upgrade: {
        gems: 50,
      },
    },
    {
      level: 30,
      era: "IE",
      max_qty: 10,
      construction: {
        gems: 1200,
      },
      upgrade: {
        gems: 50,
      },
    },
    {
      level: 33,
      era: "KS",
      max_qty: 11,
      construction: {
        gems: 1250,
      },
      upgrade: {
        gems: 50,
      },
    },
    {
      level: 36,
      era: "HM",
      max_qty: 12,
      construction: {
        gems: 1300,
      },
      upgrade: {
        gems: 50,
      },
    },
    {
      level: 39,
      era: "EG",
      max_qty: 12,
      construction: {
        gems: 1350,
      },
      upgrade: {
        gems: 50,
      },
    },
    ...luxuriousHomeDynamic,
  ],
};
