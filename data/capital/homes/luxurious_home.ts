import { BuildingData, BuildingLevel } from "@/types/shared";
import { getEraForLevel, getMaxQtyForEra, getPrevEra } from "@/data/config";

function generateDynamicLevels(
  startLevel: 40,
  maxLevel: number = 42,
): BuildingLevel[] {
  const levels: BuildingLevel[] = [];

  for (let level = startLevel; level <= maxLevel; level++) {
    const era = getEraForLevel(level);
    const prevEra = getPrevEra(era);

    const upgrade =
      level === 40
        ? {
            coins: 320000,
            food: 640000,
            goods: [
              { amount: 1500, resource: "primary_eg" }, // EarlyGothicEra_Good1
              { amount: 1500, resource: "secondary_eg" }, // EarlyGothicEra_Good2
              { amount: 1500, resource: "tertiary_eg" }, // EarlyGothicEra_Good3
              { amount: 3000, resource: "confection" },
            ],
          }
        : {
            coins: level * 15000 - 265000,
            food: level * 30000 - 530000,
            goods: [
              { amount: 600, resource: `primary_${prevEra}` },
              { amount: 600, resource: `secondary_${prevEra}` },
              { amount: 600, resource: `tertiary_${prevEra}` },
            ],
          };

    levels.push({
      level,
      era,
      max_qty: getMaxQtyForEra(era, "homes") ?? 31,
      upgrade,

      ...(level % 3 === 1 && {
        construction: {
          coins: level * 100000,
          food: level * 220000,
          goods: [
            { amount: 2500, resource: `primary_${prevEra}` },
            { amount: 2500, resource: `secondary_${prevEra}` },
            { amount: 2500, resource: `tertiary_${prevEra}` },
          ],
        },
      }),
    });
  }

  return levels;
}

export const luxuriousHome: BuildingData = {
  id: "capital-homes-luxurious-home",
  name: "Luxurious Home",
  category: "capital",
  subcategory: "homes",
  imageName: "Capital_Luxurious_Home_Lv",
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
    ...generateDynamicLevels(40, 42),
  ],
};
