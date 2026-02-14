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
    ...generateDynamicLevels(40, 42),
  ],
};
