import { BuildingData, BuildingLevel } from "@/types/shared";
import { getEraForLevel, getMaxQtyForEra, getPrevEra } from "@/data/config";

function generateDynamicLevels(
  startLevel: 40,
  maxLevel: number = 43,
): BuildingLevel[] {
  const levels: BuildingLevel[] = [];

  for (let level = startLevel; level <= maxLevel; level++) {
    const era = getEraForLevel(level);
    const prevEra = getPrevEra(era);

    const upgrade =
      level === 40
        ? {
            duration: 24600,
            workers: 1,
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
            duration: (level + 2) * 600,
            workers: 1,
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

export const smallHome: BuildingData = {
  id: "capital-homes-small-home",
  name: "Small Home",
  category: "capital",
  subcategory: "homes",
  image: "/buildings/small-home.webp",
  levels: [
    {
      level: 1,
      era: "SA",
      max_qty: 7,
      construction: {
        food: 1,
      },
    },
    {
      level: 2,
      era: "SA",
      max_qty: 7,
      upgrade: {
        coins: 10,
        food: 30,
      },
    },
    {
      level: 3,
      era: "SA",
      max_qty: 7,
      upgrade: {
        coins: 400,
        food: 800,
      },
    },
    {
      level: 4,
      era: "BA",
      max_qty: 12,
      construction: {
        coins: 1800,
        food: 4000,
      },
      upgrade: {
        coins: 1100,
        food: 2500,
      },
    },
    {
      level: 5,
      era: "BA",
      max_qty: 12,
      upgrade: {
        coins: 1800,
        food: 4200,
        goods: [
          {
            amount: 3,
            resource: "primary_ba",
          },
        ],
      },
    },
    {
      level: 6,
      era: "BA",
      max_qty: 12,
      upgrade: {
        coins: 2600,
        food: 6100,
        goods: [
          {
            amount: 3,
            resource: "primary_ba",
          },
        ],
      },
    },
    {
      level: 7,
      era: "ME",
      max_qty: 14,
      construction: {
        coins: 12000,
        food: 27000,
        goods: [
          {
            amount: 17,
            resource: "alabaster_idol",
          },
          {
            amount: 17,
            resource: "bronze_bracelet",
          },
          {
            amount: 17,
            resource: "wool",
          },
        ],
      },
      upgrade: {
        coins: 3900,
        food: 9000,
        goods: [
          {
            amount: 5,
            resource: "alabaster_idol",
          },
          {
            amount: 5,
            resource: "bronze_bracelet",
          },
          {
            amount: 5,
            resource: "wool",
          },
        ],
      },
    },
    {
      level: 8,
      era: "ME",
      max_qty: 14,
      upgrade: {
        coins: 5600,
        food: 13000,
        goods: [
          {
            amount: 11,
            resource: "primary_me",
          },
          {
            amount: 11,
            resource: "secondary_me",
          },
        ],
      },
    },
    {
      level: 9,
      era: "ME",
      max_qty: 14,
      upgrade: {
        coins: 8000,
        food: 19000,
        goods: [
          {
            amount: 20,
            resource: "primary_me",
          },
          {
            amount: 20,
            resource: "tertiary_me",
          },
          {
            amount: 15,
            resource: "papyrus_scroll",
          },
          {
            amount: 15,
            resource: "ankh",
          },
        ],
      },
    },
    {
      level: 10,
      era: "CG",
      max_qty: 18,
      construction: {
        coins: 40000,
        food: 94000,
        goods: [
          {
            amount: 265,
            resource: "secondary_me",
          },
          {
            amount: 75,
            resource: "papyrus_scroll",
          },
          {
            amount: 75,
            resource: "ankh",
          },
        ],
      },
      upgrade: {
        coins: 10000,
        food: 24000,
        goods: [
          {
            amount: 84,
            resource: "secondary_me",
          },
          {
            amount: 30,
            resource: "papyrus_scroll",
          },
          {
            amount: 30,
            resource: "ankh",
          },
        ],
      },
    },
    {
      level: 11,
      era: "CG",
      max_qty: 18,
      upgrade: {
        coins: 15000,
        food: 35000,
        goods: [
          {
            amount: 40,
            resource: "primary_cg",
          },
          {
            amount: 40,
            resource: "secondary_cg",
          },
          {
            amount: 50,
            resource: "ceremonial_dress",
          },
          {
            amount: 50,
            resource: "golden_mask",
          },
        ],
      },
    },
    {
      level: 12,
      era: "CG",
      max_qty: 18,
      upgrade: {
        coins: 20000,
        food: 47000,
        goods: [
          {
            amount: 58,
            resource: "primary_cg",
          },
          {
            amount: 58,
            resource: "tertiary_cg",
          },
          {
            amount: 60,
            resource: "ceremonial_dress",
          },
          {
            amount: 60,
            resource: "golden_mask",
          },
        ],
      },
    },
    {
      level: 13,
      era: "ER",
      max_qty: 20,
      construction: {
        coins: 110000,
        food: 260000,
        goods: [
          {
            amount: 295,
            resource: "column",
          },
          {
            amount: 295,
            resource: "silver_ring",
          },
          {
            amount: 295,
            resource: "toga",
          },
        ],
      },
      upgrade: {
        coins: 24000,
        food: 56000,
        goods: [
          {
            amount: 75,
            resource: "column",
          },
          {
            amount: 75,
            resource: "silver_ring",
          },
          {
            amount: 75,
            resource: "toga",
          },
        ],
      },
    },
    {
      level: 14,
      era: "ER",
      max_qty: 20,
      upgrade: {
        coins: 29000,
        food: 67000,
        goods: [
          {
            amount: 82,
            resource: "primary_er",
          },
          {
            amount: 82,
            resource: "secondary_er",
          },
          {
            amount: 50,
            resource: "silk",
          },
        ],
      },
    },
    {
      level: 15,
      era: "ER",
      max_qty: 20,
      upgrade: {
        coins: 33000,
        food: 78000,
        goods: [
          {
            amount: 90,
            resource: "primary_er",
          },
          {
            amount: 90,
            resource: "tertiary_er",
          },
          {
            amount: 155,
            resource: "silk",
          },
        ],
      },
    },
    {
      level: 16,
      era: "RE",
      max_qty: 22,
      construction: {
        coins: 230000,
        food: 540000,
        goods: [
          {
            amount: 935,
            resource: "secondary_er",
          },
          {
            amount: 935,
            resource: "tertiary_er",
          },
          {
            amount: 545,
            resource: "silk",
          },
        ],
      },
      upgrade: {
        coins: 38000,
        food: 89000,
        goods: [
          {
            amount: 150,
            resource: "secondary_er",
          },
          {
            amount: 150,
            resource: "tertiary_er",
          },
          {
            amount: 200,
            resource: "silk",
          },
        ],
      },
    },
    {
      level: 17,
      era: "RE",
      max_qty: 22,
      upgrade: {
        coins: 41000,
        food: 100000,
        goods: [
          {
            amount: 80,
            resource: "silk",
          },
          {
            amount: 110,
            resource: "primary_re",
          },
          {
            amount: 110,
            resource: "secondary_re",
          },
          {
            amount: 185,
            resource: "porcelain",
          },
        ],
      },
    },
    {
      level: 18,
      era: "RE",
      max_qty: 22,
      upgrade: {
        coins: 44000,
        food: 110000,
        goods: [
          {
            amount: 100,
            resource: "silk",
          },
          {
            amount: 115,
            resource: "primary_re",
          },
          {
            amount: 115,
            resource: "tertiary_re",
          },
          {
            amount: 240,
            resource: "porcelain",
          },
        ],
      },
    },
    {
      level: 19,
      era: "BE",
      max_qty: 24,
      construction: {
        coins: 400000,
        food: 960000,
        goods: [
          {
            amount: 1035,
            resource: "mosaic",
          },
          {
            amount: 1035,
            resource: "goblet",
          },
          {
            amount: 1035,
            resource: "cape",
          },
        ],
      },
      upgrade: {
        coins: 56000,
        food: 140000,
        goods: [
          {
            amount: 125,
            resource: "mosaic",
          },
          {
            amount: 125,
            resource: "goblet",
          },
          {
            amount: 125,
            resource: "cape",
          },
        ],
      },
    },
    {
      level: 20,
      era: "BE",
      max_qty: 24,
      upgrade: {
        coins: 66000,
        food: 150000,
        goods: [
          {
            amount: 140,
            resource: "primary_be",
          },
          {
            amount: 140,
            resource: "secondary_be",
          },
          {
            amount: 125,
            resource: "ancestor_mask",
          },
          {
            amount: 76,
            resource: "calendar_stone",
          },
        ],
      },
    },
    {
      level: 21,
      era: "BE",
      max_qty: 24,
      upgrade: {
        coins: 72000,
        food: 170000,
        goods: [
          {
            amount: 115,
            resource: "primary_be",
          },
          {
            amount: 115,
            resource: "tertiary_be",
          },
          {
            amount: 485,
            resource: "ancestor_mask",
          },
          {
            amount: 295,
            resource: "calendar_stone",
          },
        ],
      },
    },
    {
      level: 22,
      era: "AF",
      max_qty: 25,
      construction: {
        coins: 660000,
        food: 1600000,
        goods: [
          {
            amount: 4725,
            resource: "secondary_be",
          },
          {
            amount: 1515,
            resource: "ancestor_mask",
          },
          {
            amount: 925,
            resource: "calendar_stone",
          },
        ],
      },
      upgrade: {
        coins: 80000,
        food: 190000,
        goods: [
          {
            amount: 375,
            resource: "secondary_be",
          },
          {
            amount: 530,
            resource: "ancestor_mask",
          },
          {
            amount: 325,
            resource: "calendar_stone",
          },
        ],
      },
    },
    {
      level: 23,
      era: "AF",
      max_qty: 25,
      upgrade: {
        coins: 87000,
        food: 210000,
        goods: [
          {
            amount: 175,
            resource: "primary_af",
          },
          {
            amount: 175,
            resource: "secondary_af",
          },
          {
            amount: 240,
            resource: "headdress",
          },
          {
            amount: 260,
            resource: "ritual_dagger",
          },
        ],
      },
    },
    {
      level: 24,
      era: "AF",
      max_qty: 25,
      upgrade: {
        coins: 96000,
        food: 230000,
        goods: [
          {
            amount: 195,
            resource: "primary_af",
          },
          {
            amount: 195,
            resource: "tertiary_af",
          },
          {
            amount: 690,
            resource: "headdress",
          },
          {
            amount: 750,
            resource: "ritual_dagger",
          },
        ],
      },
    },
    {
      level: 25,
      era: "FA",
      max_qty: 26,
      construction: {
        coins: 1000000,
        food: 2400000,
        goods: [
          {
            amount: 1600,
            resource: "cartwheel",
          },
          {
            amount: 1600,
            resource: "ink",
          },
          {
            amount: 1600,
            resource: "salt",
          },
        ],
      },
      upgrade: {
        coins: 120000,
        food: 270000,
        goods: [
          {
            amount: 210,
            resource: "cartwheel",
          },
          {
            amount: 210,
            resource: "ink",
          },
          {
            amount: 210,
            resource: "salt",
          },
        ],
      },
    },
    {
      level: 26,
      era: "FA",
      max_qty: 26,
      upgrade: {
        coins: 130000,
        food: 310000,
        goods: [
          {
            amount: 230,
            resource: "primary_fa",
          },
          {
            amount: 230,
            resource: "secondary_fa",
          },
          {
            amount: 120,
            resource: "ceramic_treasure",
          },
          {
            amount: 80,
            resource: "gold_treasure",
          },
        ],
      },
    },
    {
      level: 27,
      era: "FA",
      max_qty: 26,
      upgrade: {
        coins: 140000,
        food: 330000,
        goods: [
          {
            amount: 250,
            resource: "primary_fa",
          },
          {
            amount: 250,
            resource: "tertiary_fa",
          },
          {
            amount: 240,
            resource: "ceramic_treasure",
          },
          {
            amount: 160,
            resource: "gold_treasure",
          },
        ],
      },
    },
    {
      level: 28,
      era: "IE",
      max_qty: 27,
      construction: {
        coins: 1500000,
        food: 3600000,
        goods: [
          {
            amount: 4875,
            resource: "secondary_fa",
          },
          {
            amount: 5695,
            resource: "ceramic_treasure",
          },
          {
            amount: 3795,
            resource: "gold_treasure",
          },
        ],
      },
      upgrade: {
        coins: 150000,
        food: 350000,
        goods: [
          {
            amount: 600,
            resource: "secondary_fa",
          },
          {
            amount: 275,
            resource: "ceramic_treasure",
          },
          {
            amount: 185,
            resource: "gold_treasure",
          },
        ],
      },
    },
    {
      level: 29,
      era: "IE",
      max_qty: 27,
      upgrade: {
        coins: 160000,
        food: 340000,
        goods: [
          {
            amount: 240,
            resource: "primary_ie",
          },
          {
            amount: 240,
            resource: "secondary_ie",
          },
          {
            amount: 145,
            resource: "spice_treasure",
          },
          {
            amount: 36,
            resource: "jewel_treasure",
          },
        ],
      },
    },
    {
      level: 30,
      era: "IE",
      max_qty: 27,
      upgrade: {
        coins: 180000,
        food: 370000,
        goods: [
          {
            amount: 260,
            resource: "primary_ie",
          },
          {
            amount: 260,
            resource: "tertiary_ie",
          },
          {
            amount: 290,
            resource: "spice_treasure",
          },
          {
            amount: 72,
            resource: "jewel_treasure",
          },
        ],
      },
    },
    {
      level: 31,
      era: "KS",
      max_qty: 28,
      construction: {
        coins: 2200000,
        food: 4900000,
        goods: [
          {
            amount: 1650,
            resource: "door",
          },
          {
            amount: 1650,
            resource: "wax_seal",
          },
          {
            amount: 1650,
            resource: "saffron",
          },
        ],
      },
      upgrade: {
        coins: 190000,
        food: 390000,
        goods: [
          {
            amount: 275,
            resource: "door",
          },
          {
            amount: 275,
            resource: "wax_seal",
          },
          {
            amount: 275,
            resource: "saffron",
          },
        ],
      },
    },
    {
      level: 32,
      era: "KS",
      max_qty: 28,
      upgrade: {
        coins: 190000,
        food: 400000,
        goods: [
          {
            amount: 285,
            resource: "primary_ks",
          },
          {
            amount: 285,
            resource: "secondary_ks",
          },
          {
            amount: 315,
            resource: "coffee",
          },
          {
            amount: 185,
            resource: "incense",
          },
        ],
      },
    },
    {
      level: 33,
      era: "KS",
      max_qty: 28,
      upgrade: {
        coins: 210000,
        food: 430000,
        goods: [
          {
            amount: 295,
            resource: "primary_ks",
          },
          {
            amount: 295,
            resource: "tertiary_ks",
          },
          {
            amount: 755,
            resource: "coffee",
          },
          {
            amount: 445,
            resource: "incense",
          },
        ],
      },
    },
    {
      level: 34,
      era: "HM",
      max_qty: 29,
      construction: {
        coins: 2900000,
        food: 6500000,
        goods: [
          {
            amount: 5000,
            resource: "secondary_ks",
          },
          {
            amount: 9200,
            resource: "coffee",
          },
          {
            amount: 5400,
            resource: "incense",
          },
        ],
      },
      upgrade: {
        coins: 220000,
        food: 460000,
        goods: [
          {
            amount: 925,
            resource: "secondary_ks",
          },
          {
            amount: 1000,
            resource: "coffee",
          },
          {
            amount: 600,
            resource: "incense",
          },
        ],
      },
    },
    {
      level: 35,
      era: "HM",
      max_qty: 29,
      upgrade: {
        coins: 240000,
        food: 490000,
        goods: [
          {
            amount: 320,
            resource: "primary_hm",
          },
          {
            amount: 320,
            resource: "secondary_hm",
          },
          {
            amount: 800,
            resource: "oil_lamp",
          },
          {
            amount: 400,
            resource: "carpet",
          },
        ],
      },
    },
    {
      level: 36,
      era: "HM",
      max_qty: 29,
      upgrade: {
        coins: 250000,
        food: 520000,
        goods: [
          {
            amount: 335,
            resource: "primary_hm",
          },
          {
            amount: 335,
            resource: "tertiary_hm",
          },
          {
            amount: 1200,
            resource: "oil_lamp",
          },
          {
            amount: 500,
            resource: "carpet",
          },
        ],
      },
    },
    {
      level: 37,
      era: "EG",
      max_qty: 30,
      construction: {
        coins: 3500000,
        food: 8200000,
        goods: [
          {
            amount: 2500,
            resource: "secretary_desk",
          },
          {
            amount: 2500,
            resource: "grimoire",
          },
          {
            amount: 2500,
            resource: "cinnamon",
          },
        ],
      },
      upgrade: {
        coins: 275000,
        food: 550000,
        goods: [
          {
            amount: 700,
            resource: "secretary_desk",
          },
          {
            amount: 700,
            resource: "grimoire",
          },
          {
            amount: 700,
            resource: "cinnamon",
          },
        ],
      },
    },
    {
      level: 38,
      era: "EG",
      max_qty: 30,
      upgrade: {
        coins: 290000,
        food: 580000,
        goods: [
          {
            amount: 500,
            resource: "primary_eg",
          },
          {
            amount: 500,
            resource: "tertiary_eg",
          },
          {
            amount: 3500,
            resource: "wheat",
          },
          {
            amount: 3500,
            resource: "pomegranate",
          },
        ],
      },
    },
    {
      level: 39,
      era: "EG",
      max_qty: 30,
      upgrade: {
        coins: 305000,
        food: 610000,
        goods: [
          {
            amount: 800,
            resource: "secondary_eg",
          },
          {
            amount: 800,
            resource: "tertiary_eg",
          },
          {
            amount: 1500,
            resource: "confection",
          },
          {
            amount: 1500,
            resource: "syrup",
          },
        ],
      },
    },

    ...generateDynamicLevels(40, 43),
  ],
};
