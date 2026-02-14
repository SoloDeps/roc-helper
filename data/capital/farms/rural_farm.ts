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

export const ruralFarm: BuildingData = {
  id: "capital-farms-rural-farm",
  name: "Rural Farm",
  category: "capital",
  subcategory: "farms",
  imageName: "Capital_Rural_Farm_Lv",
  levels: [
    {
      level: 1,
      era: "SA",
      max_qty: 3,
      construction: {
        coins: 5,
      },
    },
    {
      level: 2,
      era: "SA",
      max_qty: 3,
      upgrade: {
        coins: 750,
        food: 320,
      },
    },
    {
      level: 3,
      era: "SA",
      max_qty: 3,
      upgrade: {
        coins: 2500,
        food: 1100,
      },
    },
    {
      level: 4,
      era: "BA",
      max_qty: 4,
      construction: {
        coins: 13000,
        food: 5500,
      },
      upgrade: {
        coins: 7600,
        food: 3200,
      },
    },
    {
      level: 5,
      era: "BA",
      max_qty: 4,
      upgrade: {
        coins: 13000,
        food: 5400,
        goods: [
          {
            amount: 9,
            resource: "primary_ba",
          },
        ],
      },
    },
    {
      level: 6,
      era: "BA",
      max_qty: 4,
      upgrade: {
        coins: 18000,
        food: 7800,
        goods: [
          {
            amount: 9,
            resource: "primary_ba",
          },
        ],
      },
    },
    {
      level: 7,
      era: "ME",
      max_qty: 5,
      construction: {
        coins: 83000,
        food: 36000,
        goods: [
          {
            amount: 52,
            resource: "alabaster_idol",
          },
          {
            amount: 52,
            resource: "bronze_bracelet",
          },
          {
            amount: 52,
            resource: "wool",
          },
        ],
      },
      upgrade: {
        coins: 27000,
        food: 12000,
        goods: [
          {
            amount: 15,
            resource: "alabaster_idol",
          },
          {
            amount: 15,
            resource: "bronze_bracelet",
          },
          {
            amount: 15,
            resource: "wool",
          },
        ],
      },
    },
    {
      level: 8,
      era: "ME",
      max_qty: 5,
      upgrade: {
        coins: 39000,
        food: 17000,
        goods: [
          {
            amount: 33,
            resource: "primary_me",
          },
          {
            amount: 33,
            resource: "secondary_me",
          },
          {
            amount: 18,
            resource: "papyrus_scroll",
          },
          {
            amount: 18,
            resource: "ankh",
          },
        ],
      },
    },
    {
      level: 9,
      era: "ME",
      max_qty: 5,
      upgrade: {
        coins: 56000,
        food: 24000,
        goods: [
          {
            amount: 60,
            resource: "primary_me",
          },
          {
            amount: 60,
            resource: "tertiary_me",
          },
          {
            amount: 45,
            resource: "papyrus_scroll",
          },
          {
            amount: 45,
            resource: "ankh",
          },
        ],
      },
    },
    {
      level: 10,
      era: "CG",
      max_qty: 7,
      construction: {
        coins: 280000,
        food: 120000,
        goods: [
          {
            amount: 795,
            resource: "secondary_me",
          },
          {
            amount: 230,
            resource: "papyrus_scroll",
          },
          {
            amount: 230,
            resource: "ankh",
          },
        ],
      },
      upgrade: {
        coins: 71000,
        food: 30000,
        goods: [
          {
            amount: 255,
            resource: "secondary_me",
          },
          {
            amount: 90,
            resource: "papyrus_scroll",
          },
          {
            amount: 90,
            resource: "ankh",
          },
        ],
      },
    },
    {
      level: 11,
      era: "CG",
      max_qty: 7,
      upgrade: {
        coins: 100000,
        food: 45000,
        goods: [
          {
            amount: 120,
            resource: "primary_cg",
          },
          {
            amount: 120,
            resource: "secondary_cg",
          },
          {
            amount: 150,
            resource: "ceremonial_dress",
          },
          {
            amount: 150,
            resource: "golden_mask",
          },
        ],
      },
    },
    {
      level: 12,
      era: "CG",
      max_qty: 7,
      upgrade: {
        coins: 140000,
        food: 60000,
        goods: [
          {
            amount: 170,
            resource: "primary_cg",
          },
          {
            amount: 170,
            resource: "tertiary_cg",
          },
          {
            amount: 180,
            resource: "ceremonial_dress",
          },
          {
            amount: 180,
            resource: "golden_mask",
          },
        ],
      },
    },
    {
      level: 13,
      era: "ER",
      max_qty: 8,
      construction: {
        coins: 770000,
        food: 330000,
        goods: [
          {
            amount: 880,
            resource: "column",
          },
          {
            amount: 880,
            resource: "silver_ring",
          },
          {
            amount: 880,
            resource: "toga",
          },
        ],
      },
      upgrade: {
        coins: 170000,
        food: 72000,
        goods: [
          {
            amount: 225,
            resource: "column",
          },
          {
            amount: 225,
            resource: "silver_ring",
          },
          {
            amount: 225,
            resource: "toga",
          },
        ],
      },
    },
    {
      level: 14,
      era: "ER",
      max_qty: 8,
      upgrade: {
        coins: 200000,
        food: 86000,
        goods: [
          {
            amount: 250,
            resource: "primary_er",
          },
          {
            amount: 250,
            resource: "secondary_er",
          },
          {
            amount: 150,
            resource: "silk",
          },
        ],
      },
    },
    {
      level: 15,
      era: "ER",
      max_qty: 8,
      upgrade: {
        coins: 230000,
        food: 100000,
        goods: [
          {
            amount: 365,
            resource: "primary_er",
          },
          {
            amount: 180,
            resource: "tertiary_er",
          },
          {
            amount: 465,
            resource: "silk",
          },
        ],
      },
    },
    {
      level: 16,
      era: "RE",
      max_qty: 9,
      construction: {
        coins: 1600000,
        food: 690000,
        goods: [
          {
            amount: 3720,
            resource: "secondary_er",
          },
          {
            amount: 1860,
            resource: "tertiary_er",
          },
          {
            amount: 1645,
            resource: "silk",
          },
        ],
      },
      upgrade: {
        coins: 270000,
        food: 110000,
        goods: [
          {
            amount: 595,
            resource: "secondary_er",
          },
          {
            amount: 300,
            resource: "tertiary_er",
          },
          {
            amount: 605,
            resource: "silk",
          },
        ],
      },
    },
    {
      level: 17,
      era: "RE",
      max_qty: 9,
      upgrade: {
        coins: 290000,
        food: 130000,
        goods: [
          {
            amount: 235,
            resource: "silk",
          },
          {
            amount: 325,
            resource: "primary_re",
          },
          {
            amount: 325,
            resource: "secondary_re",
          },
          {
            amount: 555,
            resource: "porcelain",
          },
        ],
      },
    },
    {
      level: 18,
      era: "RE",
      max_qty: 9,
      upgrade: {
        coins: 310000,
        food: 150000,
        goods: [
          {
            amount: 310,
            resource: "silk",
          },
          {
            amount: 345,
            resource: "primary_re",
          },
          {
            amount: 345,
            resource: "tertiary_re",
          },
          {
            amount: 720,
            resource: "porcelain",
          },
        ],
      },
    },
    {
      level: 19,
      era: "BE",
      max_qty: 9,
      construction: {
        coins: 2800000,
        food: 1200000,
        goods: [
          {
            amount: 3105,
            resource: "mosaic",
          },
          {
            amount: 3105,
            resource: "goblet",
          },
          {
            amount: 3105,
            resource: "cape",
          },
        ],
      },
      upgrade: {
        coins: 390000,
        food: 180000,
        goods: [
          {
            amount: 370,
            resource: "mosaic",
          },
          {
            amount: 370,
            resource: "goblet",
          },
          {
            amount: 370,
            resource: "cape",
          },
        ],
      },
    },
    {
      level: 20,
      era: "BE",
      max_qty: 9,
      upgrade: {
        coins: 460000,
        food: 200000,
        goods: [
          {
            amount: 410,
            resource: "primary_be",
          },
          {
            amount: 410,
            resource: "secondary_be",
          },
          {
            amount: 370,
            resource: "ancestor_mask",
          },
          {
            amount: 230,
            resource: "calendar_stone",
          },
        ],
      },
    },
    {
      level: 21,
      era: "BE",
      max_qty: 9,
      upgrade: {
        coins: 510000,
        food: 220000,
        goods: [
          {
            amount: 345,
            resource: "primary_be",
          },
          {
            amount: 345,
            resource: "tertiary_be",
          },
          {
            amount: 1450,
            resource: "ancestor_mask",
          },
          {
            amount: 890,
            resource: "calendar_stone",
          },
        ],
      },
    },
    {
      level: 22,
      era: "AF",
      max_qty: 10,
      construction: {
        coins: 4600000,
        food: 2000000,
        goods: [
          {
            amount: 14150,
            resource: "secondary_be",
          },
          {
            amount: 4540,
            resource: "ancestor_mask",
          },
          {
            amount: 2785,
            resource: "calendar_stone",
          },
        ],
      },
      upgrade: {
        coins: 560000,
        food: 240000,
        goods: [
          {
            amount: 1135,
            resource: "secondary_be",
          },
          {
            amount: 1590,
            resource: "ancestor_mask",
          },
          {
            amount: 975,
            resource: "calendar_stone",
          },
        ],
      },
    },
    {
      level: 23,
      era: "AF",
      max_qty: 10,
      upgrade: {
        coins: 610000,
        food: 260000,
        goods: [
          {
            amount: 530,
            resource: "primary_af",
          },
          {
            amount: 530,
            resource: "secondary_af",
          },
          {
            amount: 720,
            resource: "headdress",
          },
          {
            amount: 780,
            resource: "ritual_dagger",
          },
        ],
      },
    },
    {
      level: 24,
      era: "AF",
      max_qty: 10,
      upgrade: {
        coins: 670000,
        food: 290000,
        goods: [
          {
            amount: 580,
            resource: "primary_af",
          },
          {
            amount: 580,
            resource: "tertiary_af",
          },
          {
            amount: 2070,
            resource: "headdress",
          },
          {
            amount: 2245,
            resource: "ritual_dagger",
          },
        ],
      },
    },
    {
      level: 25,
      era: "FA",
      max_qty: 10,
      construction: {
        coins: 7100000,
        food: 3100000,
        goods: [
          {
            amount: 4750,
            resource: "cartwheel",
          },
          {
            amount: 4750,
            resource: "ink",
          },
          {
            amount: 4750,
            resource: "salt",
          },
        ],
      },
      upgrade: {
        coins: 810000,
        food: 350000,
        goods: [
          {
            amount: 635,
            resource: "cartwheel",
          },
          {
            amount: 635,
            resource: "ink",
          },
          {
            amount: 635,
            resource: "salt",
          },
        ],
      },
    },
    {
      level: 26,
      era: "FA",
      max_qty: 10,
      upgrade: {
        coins: 920000,
        food: 390000,
        goods: [
          {
            amount: 690,
            resource: "primary_fa",
          },
          {
            amount: 690,
            resource: "secondary_fa",
          },
          {
            amount: 360,
            resource: "ceramic_treasure",
          },
          {
            amount: 240,
            resource: "gold_treasure",
          },
        ],
      },
    },
    {
      level: 27,
      era: "FA",
      max_qty: 10,
      upgrade: {
        coins: 990000,
        food: 420000,
        goods: [
          {
            amount: 750,
            resource: "primary_fa",
          },
          {
            amount: 750,
            resource: "tertiary_fa",
          },
          {
            amount: 720,
            resource: "ceramic_treasure",
          },
          {
            amount: 480,
            resource: "gold_treasure",
          },
        ],
      },
    },
    {
      level: 28,
      era: "IE",
      max_qty: 11,
      construction: {
        coins: 11000000,
        food: 4600000,
        goods: [
          {
            amount: 14350,
            resource: "secondary_fa",
          },
          {
            amount: 17050,
            resource: "ceramic_treasure",
          },
          {
            amount: 11400,
            resource: "gold_treasure",
          },
        ],
      },
      upgrade: {
        coins: 1100000,
        food: 450000,
        goods: [
          {
            amount: 1800,
            resource: "secondary_fa",
          },
          {
            amount: 830,
            resource: "ceramic_treasure",
          },
          {
            amount: 550,
            resource: "gold_treasure",
          },
        ],
      },
    },
    {
      level: 29,
      era: "IE",
      max_qty: 11,
      upgrade: {
        coins: 1100000,
        food: 440000,
        goods: [
          {
            amount: 720,
            resource: "primary_ie",
          },
          {
            amount: 720,
            resource: "secondary_ie",
          },
          {
            amount: 430,
            resource: "spice_treasure",
          },
          {
            amount: 110,
            resource: "jewel_treasure",
          },
        ],
      },
    },
    {
      level: 30,
      era: "IE",
      max_qty: 11,
      upgrade: {
        coins: 1200000,
        food: 480000,
        goods: [
          {
            amount: 780,
            resource: "primary_ie",
          },
          {
            amount: 780,
            resource: "tertiary_ie",
          },
          {
            amount: 865,
            resource: "spice_treasure",
          },
          {
            amount: 215,
            resource: "jewel_treasure",
          },
        ],
      },
    },
    {
      level: 31,
      era: "KS",
      max_qty: 11,
      construction: {
        coins: 15000000,
        food: 6300000,
        goods: [
          {
            amount: 4800,
            resource: "door",
          },
          {
            amount: 4800,
            resource: "wax_seal",
          },
          {
            amount: 4800,
            resource: "saffron",
          },
        ],
      },
      upgrade: {
        coins: 1300000,
        food: 500000,
        goods: [
          {
            amount: 815,
            resource: "door",
          },
          {
            amount: 815,
            resource: "wax_seal",
          },
          {
            amount: 815,
            resource: "saffron",
          },
        ],
      },
    },
    {
      level: 32,
      era: "KS",
      max_qty: 11,
      upgrade: {
        coins: 1300000,
        food: 520000,
        goods: [
          {
            amount: 855,
            resource: "primary_ks",
          },
          {
            amount: 855,
            resource: "secondary_ks",
          },
          {
            amount: 945,
            resource: "coffee",
          },
          {
            amount: 555,
            resource: "incense",
          },
        ],
      },
    },
    {
      level: 33,
      era: "KS",
      max_qty: 11,
      upgrade: {
        coins: 1400000,
        food: 560000,
        goods: [
          {
            amount: 890,
            resource: "primary_ks",
          },
          {
            amount: 890,
            resource: "tertiary_ks",
          },
          {
            amount: 2270,
            resource: "coffee",
          },
          {
            amount: 1330,
            resource: "incense",
          },
        ],
      },
    },
    {
      level: 34,
      era: "HM",
      max_qty: 12,
      construction: {
        coins: 20000000,
        food: 8300000,
        goods: [
          {
            amount: 14500,
            resource: "tertiary_ks",
          },
          {
            amount: 27600,
            resource: "coffee",
          },
          {
            amount: 16200,
            resource: "incense",
          },
        ],
      },
      upgrade: {
        coins: 1500000,
        food: 600000,
        goods: [
          {
            amount: 2775,
            resource: "primary_ks",
          },
          {
            amount: 3000,
            resource: "coffee",
          },
          {
            amount: 1775,
            resource: "incense",
          },
        ],
      },
    },
    {
      level: 35,
      era: "HM",
      max_qty: 12,
      upgrade: {
        coins: 1600000,
        food: 630000,
        goods: [
          {
            amount: 960,
            resource: "primary_hm",
          },
          {
            amount: 960,
            resource: "secondary_hm",
          },
          {
            amount: 1500,
            resource: "oil_lamp",
          },
          {
            amount: 800,
            resource: "carpet",
          },
        ],
      },
    },
    {
      level: 36,
      era: "HM",
      max_qty: 12,
      upgrade: {
        coins: 1700000,
        food: 670000,
        goods: [
          {
            amount: 995,
            resource: "primary_hm",
          },
          {
            amount: 995,
            resource: "tertiary_hm",
          },
          {
            amount: 3000,
            resource: "oil_lamp",
          },
          {
            amount: 1775,
            resource: "carpet",
          },
        ],
      },
    },
    {
      level: 37,
      era: "EG",
      max_qty: 13,
      construction: {
        coins: 25000000,
        food: 10000000,
        goods: [
          {
            amount: 6000,
            resource: "secretary_desk",
          },
          {
            amount: 6000,
            resource: "grimoire",
          },
          {
            amount: 6000,
            resource: "cinnamon",
          },
        ],
      },
      upgrade: {
        coins: 1850000,
        food: 720000,
        goods: [
          {
            amount: 1200,
            resource: "secretary_desk",
          },
          {
            amount: 1200,
            resource: "grimoire",
          },
          {
            amount: 1200,
            resource: "cinnamon",
          },
        ],
      },
    },
    {
      level: 38,
      era: "EG",
      max_qty: 13,
      upgrade: {
        coins: 2000000,
        food: 780000,
        goods: [
          {
            amount: 1000,
            resource: "primary_eg",
          },
          {
            amount: 1000,
            resource: "tertiary_eg",
          },
          {
            amount: 8500,
            resource: "wheat",
          },
          {
            amount: 8500,
            resource: "pomegranate",
          },
        ],
      },
    },
    {
      level: 39,
      era: "EG",
      max_qty: 13,
      upgrade: {
        coins: 2150000,
        food: 850000,
        goods: [
          {
            amount: 1800,
            resource: "secondary_eg",
          },
          {
            amount: 1800,
            resource: "tertiary_eg",
          },
          {
            amount: 6000,
            resource: "confection",
          },
          {
            amount: 6000,
            resource: "syrup",
          },
        ],
      },
    },
    {
      level: 40,
      era: "LG",
      max_qty: 13,
      construction: {
        coins: 30000000,
        food: 12000000,
        goods: [
          {
            amount: 6000,
            resource: "lead_glass",
          },
          {
            amount: 6000,
            resource: "fine_jewelry",
          },
          {
            amount: 6000,
            resource: "ointment",
          },
        ],
      },
    },
    ...generateDynamicLevels(40, 42),
  ],
};
