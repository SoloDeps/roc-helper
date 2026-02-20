import { BuildingData } from "@/types/shared";
import { generateStandardLevels } from "@/data/generateDynamicLevels";

export const domesticFarmDynamic = generateStandardLevels({
  buildingId: "domestic_farm",
  defaultMaxQty: 11,
  goodsAmounts: [1500, 2000, 2800],
  constructionGoodsAmount: 8000,
  upgrade: {
    coins: (l) => l * 150000 - 2750000,
    food: (l) => l * 70000 - 1510000,
  },
  construction: {
    coins: (l) => l * 6000000 - 199000000,
    food: (l) => l * 3000000 - 102000000,
  },
});

export const domesticFarm: BuildingData = {
  id: "capital-domestic-farm",
  name: "Domestic Farm",
  category: "capital",
  subcategory: "farms",
  imageName: "Capital_Domestic_Farm_Lv",
  levels: [
    {
      level: 1,
      era: "SA",
      max_qty: 2,
      construction: {
        coins: 40,
        food: 10,
      },
    },
    {
      level: 2,
      era: "SA",
      max_qty: 2,
      upgrade: {
        coins: 1800,
        food: 800,
      },
    },
    {
      level: 3,
      era: "SA",
      max_qty: 2,
      upgrade: {
        coins: 3600,
        food: 1600,
      },
    },
    {
      level: 4,
      era: "BA",
      max_qty: 3,
      construction: {
        coins: 20000,
        food: 8500,
      },
      upgrade: {
        coins: 11000,
        food: 4700,
      },
    },
    {
      level: 5,
      era: "BA",
      max_qty: 3,
      upgrade: {
        coins: 18000,
        food: 7800,
        goods: [
          {
            amount: 13,
            resource: "primary_ba",
          },
        ],
      },
    },
    {
      level: 6,
      era: "BA",
      max_qty: 3,
      upgrade: {
        coins: 26000,
        food: 11000,
        goods: [
          {
            amount: 13,
            resource: "primary_ba",
          },
        ],
      },
    },
    {
      level: 7,
      era: "ME",
      max_qty: 4,
      construction: {
        coins: 120000,
        food: 51000,
        goods: [
          {
            amount: 72,
            resource: "alabaster_idol",
          },
          {
            amount: 72,
            resource: "bronze_bracelet",
          },
          {
            amount: 72,
            resource: "wool",
          },
        ],
      },
      upgrade: {
        coins: 39000,
        food: 17000,
        goods: [
          {
            amount: 21,
            resource: "alabaster_idol",
          },
          {
            amount: 21,
            resource: "bronze_bracelet",
          },
          {
            amount: 21,
            resource: "wool",
          },
        ],
      },
    },
    {
      level: 8,
      era: "ME",
      max_qty: 4,
      upgrade: {
        coins: 56000,
        food: 24000,
        goods: [
          {
            amount: 47,
            resource: "primary_me",
          },
          {
            amount: 47,
            resource: "secondary_me",
          },
          {
            amount: 27,
            resource: "papyrus_scroll",
          },
          {
            amount: 27,
            resource: "ankh",
          },
        ],
      },
    },
    {
      level: 9,
      era: "ME",
      max_qty: 4,
      upgrade: {
        coins: 80000,
        food: 35000,
        goods: [
          {
            amount: 85,
            resource: "primary_me",
          },
          {
            amount: 85,
            resource: "tertiary_me",
          },
          {
            amount: 68,
            resource: "papyrus_scroll",
          },
          {
            amount: 68,
            resource: "ankh",
          },
        ],
      },
    },
    {
      level: 10,
      era: "CG",
      max_qty: 5,
      construction: {
        coins: 400000,
        food: 180000,
        goods: [
          {
            amount: 1125,
            resource: "secondary_me",
          },
          {
            amount: 345,
            resource: "papyrus_scroll",
          },
          {
            amount: 345,
            resource: "ankh",
          },
        ],
      },
      upgrade: {
        coins: 100000,
        food: 44000,
        goods: [
          {
            amount: 360,
            resource: "secondary_me",
          },
          {
            amount: 135,
            resource: "papyrus_scroll",
          },
          {
            amount: 135,
            resource: "ankh",
          },
        ],
      },
    },
    {
      level: 11,
      era: "CG",
      max_qty: 5,
      upgrade: {
        coins: 150000,
        food: 64000,
        goods: [
          {
            amount: 170,
            resource: "primary_cg",
          },
          {
            amount: 170,
            resource: "secondary_cg",
          },
          {
            amount: 225,
            resource: "ceremonial_dress",
          },
          {
            amount: 225,
            resource: "golden_mask",
          },
        ],
      },
    },
    {
      level: 12,
      era: "CG",
      max_qty: 5,
      upgrade: {
        coins: 200000,
        food: 87000,
        goods: [
          {
            amount: 245,
            resource: "primary_cg",
          },
          {
            amount: 245,
            resource: "tertiary_cg",
          },
          {
            amount: 270,
            resource: "ceremonial_dress",
          },
          {
            amount: 270,
            resource: "golden_mask",
          },
        ],
      },
    },
    {
      level: 13,
      era: "ER",
      max_qty: 6,
      construction: {
        coins: 1100000,
        food: 480000,
        goods: [
          {
            amount: 1250,
            resource: "column",
          },
          {
            amount: 1250,
            resource: "silver_ring",
          },
          {
            amount: 1250,
            resource: "toga",
          },
        ],
      },
      upgrade: {
        coins: 240000,
        food: 100000,
        goods: [
          {
            amount: 315,
            resource: "column",
          },
          {
            amount: 315,
            resource: "silver_ring",
          },
          {
            amount: 315,
            resource: "toga",
          },
        ],
      },
    },
    {
      level: 14,
      era: "ER",
      max_qty: 6,
      upgrade: {
        coins: 290000,
        food: 120000,
        goods: [
          {
            amount: 355,
            resource: "primary_er",
          },
          {
            amount: 355,
            resource: "secondary_er",
          },
          {
            amount: 200,
            resource: "silk",
          },
        ],
      },
    },
    {
      level: 15,
      era: "ER",
      max_qty: 6,
      upgrade: {
        coins: 330000,
        food: 140000,
        goods: [
          {
            amount: 515,
            resource: "primary_er",
          },
          {
            amount: 260,
            resource: "tertiary_er",
          },
          {
            amount: 700,
            resource: "silk",
          },
        ],
      },
    },
    {
      level: 16,
      era: "RE",
      max_qty: 7,
      construction: {
        coins: 2300000,
        food: 990000,
        goods: [
          {
            amount: 5290,
            resource: "secondary_er",
          },
          {
            amount: 2645,
            resource: "tertiary_er",
          },
          {
            amount: 2410,
            resource: "silk",
          },
        ],
      },
      upgrade: {
        coins: 380000,
        food: 170000,
        goods: [
          {
            amount: 845,
            resource: "secondary_er",
          },
          {
            amount: 425,
            resource: "tertiary_er",
          },
          {
            amount: 910,
            resource: "silk",
          },
        ],
      },
    },
    {
      level: 17,
      era: "RE",
      max_qty: 7,
      upgrade: {
        coins: 410000,
        food: 190000,
        goods: [
          {
            amount: 355,
            resource: "silk",
          },
          {
            amount: 460,
            resource: "primary_re",
          },
          {
            amount: 460,
            resource: "secondary_re",
          },
          {
            amount: 825,
            resource: "porcelain",
          },
        ],
      },
    },
    {
      level: 18,
      era: "RE",
      max_qty: 7,
      upgrade: {
        coins: 440000,
        food: 210000,
        goods: [
          {
            amount: 460,
            resource: "silk",
          },
          {
            amount: 490,
            resource: "primary_re",
          },
          {
            amount: 490,
            resource: "tertiary_re",
          },
          {
            amount: 1075,
            resource: "porcelain",
          },
        ],
      },
    },
    {
      level: 19,
      era: "BE",
      max_qty: 8,
      construction: {
        coins: 4000000,
        food: 1800000,
        goods: [
          {
            amount: 4405,
            resource: "mosaic",
          },
          {
            amount: 4405,
            resource: "goblet",
          },
          {
            amount: 4405,
            resource: "cape",
          },
        ],
      },
      upgrade: {
        coins: 560000,
        food: 260000,
        goods: [
          {
            amount: 520,
            resource: "mosaic",
          },
          {
            amount: 520,
            resource: "goblet",
          },
          {
            amount: 520,
            resource: "cape",
          },
        ],
      },
    },
    {
      level: 20,
      era: "BE",
      max_qty: 8,
      upgrade: {
        coins: 660000,
        food: 290000,
        goods: [
          {
            amount: 585,
            resource: "primary_be",
          },
          {
            amount: 585,
            resource: "secondary_be",
          },
          {
            amount: 560,
            resource: "ancestor_mask",
          },
          {
            amount: 340,
            resource: "calendar_stone",
          },
        ],
      },
    },
    {
      level: 21,
      era: "BE",
      max_qty: 8,
      upgrade: {
        coins: 720000,
        food: 320000,
        goods: [
          {
            amount: 485,
            resource: "primary_be",
          },
          {
            amount: 485,
            resource: "tertiary_be",
          },
          {
            amount: 2175,
            resource: "ancestor_mask",
          },
          {
            amount: 1335,
            resource: "calendar_stone",
          },
        ],
      },
    },
    {
      level: 22,
      era: "AF",
      max_qty: 8,
      construction: {
        coins: 6600000,
        food: 2900000,
        goods: [
          {
            amount: 20100,
            resource: "secondary_be",
          },
          {
            amount: 6820,
            resource: "ancestor_mask",
          },
          {
            amount: 4180,
            resource: "calendar_stone",
          },
        ],
      },
      upgrade: {
        coins: 800000,
        food: 350000,
        goods: [
          {
            amount: 1610,
            resource: "secondary_be",
          },
          {
            amount: 2385,
            resource: "ancestor_mask",
          },
          {
            amount: 1465,
            resource: "calendar_stone",
          },
        ],
      },
    },
    {
      level: 23,
      era: "AF",
      max_qty: 8,
      upgrade: {
        coins: 870000,
        food: 380000,
        goods: [
          {
            amount: 750,
            resource: "primary_af",
          },
          {
            amount: 750,
            resource: "secondary_af",
          },
          {
            amount: 1080,
            resource: "headdress",
          },
          {
            amount: 1170,
            resource: "ritual_dagger",
          },
        ],
      },
    },
    {
      level: 24,
      era: "AF",
      max_qty: 8,
      upgrade: {
        coins: 960000,
        food: 420000,
        goods: [
          {
            amount: 820,
            resource: "primary_af",
          },
          {
            amount: 820,
            resource: "tertiary_af",
          },
          {
            amount: 3105,
            resource: "headdress",
          },
          {
            amount: 3365,
            resource: "ritual_dagger",
          },
        ],
      },
    },
    {
      level: 25,
      era: "FA",
      max_qty: 9,
      construction: {
        coins: 10000000,
        food: 4500000,
        goods: [
          {
            amount: 6725,
            resource: "cartwheel",
          },
          {
            amount: 6725,
            resource: "ink",
          },
          {
            amount: 6725,
            resource: "salt",
          },
        ],
      },
      upgrade: {
        coins: 1200000,
        food: 500000,
        goods: [
          {
            amount: 900,
            resource: "cartwheel",
          },
          {
            amount: 900,
            resource: "ink",
          },
          {
            amount: 900,
            resource: "salt",
          },
        ],
      },
    },
    {
      level: 26,
      era: "FA",
      max_qty: 9,
      upgrade: {
        coins: 1300000,
        food: 570000,
        goods: [
          {
            amount: 975,
            resource: "primary_fa",
          },
          {
            amount: 975,
            resource: "secondary_fa",
          },
          {
            amount: 540,
            resource: "ceramic_treasure",
          },
          {
            amount: 360,
            resource: "gold_treasure",
          },
        ],
      },
    },
    {
      level: 28,
      era: "IE",
      max_qty: 9,
      construction: {
        coins: 15000000,
        food: 6700000,
        goods: [
          {
            amount: 20250,
            resource: "secondary_fa",
          },
          {
            amount: 25600,
            resource: "ceramic_treasure",
          },
          {
            amount: 17100,
            resource: "gold_treasure",
          },
        ],
      },
      upgrade: {
        coins: 1500000,
        food: 660000,
        goods: [
          {
            amount: 2550,
            resource: "secondary_fa",
          },
          {
            amount: 1240,
            resource: "ceramic_treasure",
          },
          {
            amount: 830,
            resource: "gold_treasure",
          },
        ],
      },
    },
    {
      level: 29,
      era: "IE",
      max_qty: 9,
      upgrade: {
        coins: 1600000,
        food: 630000,
        goods: [
          {
            amount: 1020,
            resource: "primary_ie",
          },
          {
            amount: 1020,
            resource: "secondary_ie",
          },
          {
            amount: 650,
            resource: "spice_treasure",
          },
          {
            amount: 160,
            resource: "jewel_treasure",
          },
        ],
      },
    },
    {
      level: 30,
      era: "IE",
      max_qty: 9,
      upgrade: {
        coins: 1800000,
        food: 690000,
        goods: [
          {
            amount: 1105,
            resource: "primary_ie",
          },
          {
            amount: 1105,
            resource: "tertiary_ie",
          },
          {
            amount: 1295,
            resource: "spice_treasure",
          },
          {
            amount: 325,
            resource: "jewel_treasure",
          },
        ],
      },
    },
    {
      level: 31,
      era: "KS",
      max_qty: 10,
      construction: {
        coins: 22000000,
        food: 9200000,
        goods: [
          {
            amount: 6775,
            resource: "door",
          },
          {
            amount: 6775,
            resource: "wax_seal",
          },
          {
            amount: 6775,
            resource: "saffron",
          },
        ],
      },
      upgrade: {
        coins: 1900000,
        food: 730000,
        goods: [
          {
            amount: 1155,
            resource: "door",
          },
          {
            amount: 1155,
            resource: "wax_seal",
          },
          {
            amount: 1155,
            resource: "saffron",
          },
        ],
      },
    },
    {
      level: 32,
      era: "KS",
      max_qty: 10,
      upgrade: {
        coins: 1900000,
        food: 750000,
        goods: [
          {
            amount: 1210,
            resource: "primary_ks",
          },
          {
            amount: 1210,
            resource: "secondary_ks",
          },
          {
            amount: 1420,
            resource: "coffee",
          },
          {
            amount: 835,
            resource: "incense",
          },
        ],
      },
    },
    {
      level: 33,
      era: "KS",
      max_qty: 10,
      upgrade: {
        coins: 2100000,
        food: 800000,
        goods: [
          {
            amount: 1260,
            resource: "primary_ks",
          },
          {
            amount: 1260,
            resource: "tertiary_ks",
          },
          {
            amount: 3400,
            resource: "coffee",
          },
          {
            amount: 2000,
            resource: "incense",
          },
        ],
      },
    },
    {
      level: 34,
      era: "HM",
      max_qty: 10,
      construction: {
        coins: 29000000,
        food: 12000000,
        goods: [
          {
            amount: 20000,
            resource: "secondary_ks",
          },
          {
            amount: 41400,
            resource: "coffee",
          },
          {
            amount: 24300,
            resource: "incense",
          },
        ],
      },
      upgrade: {
        coins: 2200000,
        food: 860000,
        goods: [
          {
            amount: 3900,
            resource: "secondary_ks",
          },
          {
            amount: 4500,
            resource: "coffee",
          },
          {
            amount: 2700,
            resource: "incense",
          },
        ],
      },
    },
    {
      level: 35,
      era: "HM",
      max_qty: 10,
      upgrade: {
        coins: 2400000,
        food: 920000,
        goods: [
          {
            amount: 1360,
            resource: "primary_hm",
          },
          {
            amount: 1360,
            resource: "secondary_hm",
          },
          {
            amount: 2300,
            resource: "oil_lamp",
          },
          {
            amount: 1300,
            resource: "carpet",
          },
        ],
      },
    },
    {
      level: 36,
      era: "HM",
      max_qty: 10,
      upgrade: {
        coins: 2500000,
        food: 970000,
        goods: [
          {
            amount: 1410,
            resource: "primary_hm",
          },
          {
            amount: 1410,
            resource: "tertiary_hm",
          },
          {
            amount: 4500,
            resource: "oil_lamp",
          },
          {
            amount: 2600,
            resource: "carpet",
          },
        ],
      },
    },
    {
      level: 37,
      era: "EG",
      max_qty: 11,
      construction: {
        coins: 35000000,
        food: 15000000,
        goods: [
          {
            amount: 8000,
            resource: "secretary_desk",
          },
          {
            amount: 8000,
            resource: "grimoire",
          },
          {
            amount: 8000,
            resource: "cinnamon",
          },
        ],
      },
      upgrade: {
        coins: 2650000,
        food: 1020000,
        goods: [
          {
            amount: 2000,
            resource: "secretary_desk",
          },
          {
            amount: 2000,
            resource: "grimoire",
          },
          {
            amount: 2000,
            resource: "cinnamon",
          },
        ],
      },
    },
    {
      level: 38,
      era: "EG",
      max_qty: 11,
      upgrade: {
        coins: 2800000,
        food: 1080000,
        goods: [
          {
            amount: 1500,
            resource: "primary_eg",
          },
          {
            amount: 1500,
            resource: "tertiary_eg",
          },
          {
            amount: 10000,
            resource: "wheat",
          },
          {
            amount: 10000,
            resource: "pomegranate",
          },
        ],
      },
    },
    {
      level: 39,
      era: "EG",
      max_qty: 11,
      upgrade: {
        coins: 2950000,
        food: 1150000,
        goods: [
          {
            amount: 2000,
            resource: "secondary_eg",
          },
          {
            amount: 2000,
            resource: "tertiary_eg",
          },
          {
            amount: 7500,
            resource: "confection",
          },
          {
            amount: 7500,
            resource: "syrup",
          },
        ],
      },
    },
    ...domesticFarmDynamic.filter((l) => l.level !== 40),
    {
      level: 40,
      era: "LG",
      max_qty: 11,
      construction: {
        coins: 41000000, // 40 * 6_000_000 - 199_000_000
        food: 18000000, // 40 * 3_000_000 - 102_000_000
        goods: [
          { amount: 8000, resource: "primary_eg" },
          { amount: 8000, resource: "secondary_eg" },
          { amount: 8000, resource: "tertiary_eg" },
        ],
      },
      upgrade: {
        coins: 3100000,
        food: 1220000,
        goods: [
          { amount: 3000, resource: "primary_eg" },
          { amount: 3000, resource: "secondary_eg" },
          { amount: 2800, resource: "tertiary_eg" }, // asymétrie : good3 = 2800
          { amount: 12000, resource: "pomegranate" },
        ],
      },
    },
  ],
};
