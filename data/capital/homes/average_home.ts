import { BuildingData } from "@/types/shared";
import { generateStandardLevels } from "@/data/generateDynamicLevels";

export const averageHomeDynamic = generateStandardLevels({
  buildingId: "average_home",
  defaultMaxQty: 15,
  goodsAmounts: [1200, 1600, 2000],
  constructionGoodsAmount: 5000,
  upgrade: {
    coins: (l) => l * 40000 - 730000,
    food: (l) => l * 50000 - 450000,
  },
  construction: {
    coins: (l) => l * 100000,
    food: (l) => l * 220000,
  },
  level40Upgrade: {
    goodsSource: "previous",
    goodsAmount: 1800,
    coins: 830000,
    food: 1500000,
    extraGoods: [{ amount: 6000, resource: "syrup" }],
  },
});

export const averageHome: BuildingData = {
  id: "capital-homes-average-home",
  name: "Average Home",
  category: "capital",
  subcategory: "homes",
  width: 3,
  height: 3,
  duration: 12,
  imageName: "Capital_Average_Home_Lv",
  levels: [
    {
      level: 4,
      era: "BA",
      max_qty: 2,
      construction: {
        coins: 5300,
        food: 12000,
      },
    },
    {
      level: 5,
      era: "BA",
      max_qty: 2,
      upgrade: {
        coins: 4800,
        food: 11000,
        goods: [
          {
            amount: 8,
            resource: "primary_ba",
          },
        ],
      },
    },
    {
      level: 6,
      era: "BA",
      max_qty: 2,
      upgrade: {
        coins: 7000,
        food: 16000,
        goods: [
          {
            amount: 8,
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
        coins: 31000,
        food: 72000,
        goods: [
          {
            amount: 45,
            resource: "alabaster_idol",
          },
          {
            amount: 45,
            resource: "bronze_bracelet",
          },
          {
            amount: 45,
            resource: "wool",
          },
        ],
      },
      upgrade: {
        coins: 10000,
        food: 23000,
        goods: [
          {
            amount: 12,
            resource: "alabaster_idol",
          },
          {
            amount: 12,
            resource: "bronze_bracelet",
          },
          {
            amount: 12,
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
        coins: 15000,
        food: 33000,
        goods: [
          {
            amount: 28,
            resource: "primary_me",
          },
          {
            amount: 28,
            resource: "secondary_me",
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
      level: 9,
      era: "ME",
      max_qty: 4,
      upgrade: {
        coins: 21000,
        food: 48000,
        goods: [
          {
            amount: 50,
            resource: "primary_me",
          },
          {
            amount: 50,
            resource: "tertiary_me",
          },
          {
            amount: 38,
            resource: "papyrus_scroll",
          },
          {
            amount: 38,
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
        coins: 110000,
        food: 240000,
        goods: [
          {
            amount: 670,
            resource: "secondary_me",
          },
          {
            amount: 190,
            resource: "papyrus_scroll",
          },
          {
            amount: 190,
            resource: "ankh",
          },
        ],
      },
      upgrade: {
        coins: 27000,
        food: 61000,
        goods: [
          {
            amount: 210,
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
    },
    {
      level: 11,
      era: "CG",
      max_qty: 5,
      upgrade: {
        coins: 40000,
        food: 89000,
        goods: [
          {
            amount: 100,
            resource: "primary_cg",
          },
          {
            amount: 100,
            resource: "secondary_cg",
          },
          {
            amount: 125,
            resource: "ceremonial_dress",
          },
          {
            amount: 125,
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
        coins: 54000,
        food: 120000,
        goods: [
          {
            amount: 145,
            resource: "primary_cg",
          },
          {
            amount: 145,
            resource: "tertiary_cg",
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
      level: 13,
      era: "ER",
      max_qty: 6,
      construction: {
        coins: 300000,
        food: 660000,
        goods: [
          {
            amount: 735,
            resource: "column",
          },
          {
            amount: 735,
            resource: "silver_ring",
          },
          {
            amount: 735,
            resource: "toga",
          },
        ],
      },
      upgrade: {
        coins: 64000,
        food: 140000,
        goods: [
          {
            amount: 185,
            resource: "column",
          },
          {
            amount: 185,
            resource: "silver_ring",
          },
          {
            amount: 185,
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
        coins: 76000,
        food: 170000,
        goods: [
          {
            amount: 210,
            resource: "primary_er",
          },
          {
            amount: 210,
            resource: "secondary_er",
          },
          {
            amount: 110,
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
        coins: 89000,
        food: 200000,
        goods: [
          {
            amount: 305,
            resource: "primary_er",
          },
          {
            amount: 150,
            resource: "tertiary_er",
          },
          {
            amount: 390,
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
        coins: 610000,
        food: 1400000,
        goods: [
          {
            amount: 3110,
            resource: "secondary_er",
          },
          {
            amount: 1555,
            resource: "tertiary_er",
          },
          {
            amount: 1340,
            resource: "silk",
          },
        ],
      },
      upgrade: {
        coins: 100000,
        food: 230000,
        goods: [
          {
            amount: 495,
            resource: "secondary_er",
          },
          {
            amount: 250,
            resource: "tertiary_er",
          },
          {
            amount: 505,
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
        coins: 110000,
        food: 260000,
        goods: [
          {
            amount: 195,
            resource: "silk",
          },
          {
            amount: 270,
            resource: "primary_re",
          },
          {
            amount: 270,
            resource: "secondary_re",
          },
          {
            amount: 460,
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
        coins: 120000,
        food: 290000,
        goods: [
          {
            amount: 255,
            resource: "silk",
          },
          {
            amount: 290,
            resource: "primary_re",
          },
          {
            amount: 290,
            resource: "tertiary_re",
          },
          {
            amount: 600,
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
        coins: 1100000,
        food: 2500000,
        goods: [
          {
            amount: 2595,
            resource: "mosaic",
          },
          {
            amount: 2595,
            resource: "goblet",
          },
          {
            amount: 2595,
            resource: "cape",
          },
        ],
      },
      upgrade: {
        coins: 150000,
        food: 360000,
        goods: [
          {
            amount: 310,
            resource: "mosaic",
          },
          {
            amount: 310,
            resource: "goblet",
          },
          {
            amount: 310,
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
        coins: 170000,
        food: 400000,
        goods: [
          {
            amount: 345,
            resource: "primary_be",
          },
          {
            amount: 345,
            resource: "secondary_be",
          },
          {
            amount: 310,
            resource: "ancestor_mask",
          },
          {
            amount: 190,
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
        coins: 190000,
        food: 440000,
        goods: [
          {
            amount: 285,
            resource: "primary_be",
          },
          {
            amount: 285,
            resource: "tertiary_be",
          },
          {
            amount: 1210,
            resource: "ancestor_mask",
          },
          {
            amount: 740,
            resource: "calendar_stone",
          },
        ],
      },
    },
    {
      level: 22,
      era: "AF",
      max_qty: 9,
      construction: {
        coins: 1800000,
        food: 4100000,
        goods: [
          {
            amount: 11800,
            resource: "secondary_be",
          },
          {
            amount: 3790,
            resource: "ancestor_mask",
          },
          {
            amount: 2320,
            resource: "calendar_stone",
          },
        ],
      },
      upgrade: {
        coins: 210000,
        food: 480000,
        goods: [
          {
            amount: 945,
            resource: "secondary_be",
          },
          {
            amount: 1325,
            resource: "ancestor_mask",
          },
          {
            amount: 815,
            resource: "calendar_stone",
          },
        ],
      },
    },
    {
      level: 23,
      era: "AF",
      max_qty: 9,
      upgrade: {
        coins: 230000,
        food: 530000,
        goods: [
          {
            amount: 440,
            resource: "primary_af",
          },
          {
            amount: 440,
            resource: "secondary_af",
          },
          {
            amount: 600,
            resource: "headdress",
          },
          {
            amount: 650,
            resource: "ritual_dagger",
          },
        ],
      },
    },
    {
      level: 24,
      era: "AF",
      max_qty: 9,
      upgrade: {
        coins: 260000,
        food: 580000,
        goods: [
          {
            amount: 485,
            resource: "primary_af",
          },
          {
            amount: 485,
            resource: "tertiary_af",
          },
          {
            amount: 1725,
            resource: "headdress",
          },
          {
            amount: 1870,
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
        coins: 2700000,
        food: 6200000,
        goods: [
          {
            amount: 3975,
            resource: "cartwheel",
          },
          {
            amount: 3975,
            resource: "ink",
          },
          {
            amount: 3975,
            resource: "salt",
          },
        ],
      },
      upgrade: {
        coins: 310000,
        food: 690000,
        goods: [
          {
            amount: 530,
            resource: "cartwheel",
          },
          {
            amount: 530,
            resource: "ink",
          },
          {
            amount: 530,
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
        coins: 350000,
        food: 790000,
        goods: [
          {
            amount: 575,
            resource: "primary_fa",
          },
          {
            amount: 575,
            resource: "secondary_fa",
          },
          {
            amount: 300,
            resource: "ceramic_treasure",
          },
          {
            amount: 200,
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
        coins: 380000,
        food: 850000,
        goods: [
          {
            amount: 625,
            resource: "primary_fa",
          },
          {
            amount: 625,
            resource: "tertiary_fa",
          },
          {
            amount: 600,
            resource: "ceramic_treasure",
          },
          {
            amount: 400,
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
        coins: 4100000,
        food: 9300000,
        goods: [
          {
            amount: 12000,
            resource: "secondary_fa",
          },
          {
            amount: 14250,
            resource: "ceramic_treasure",
          },
          {
            amount: 9500,
            resource: "gold_treasure",
          },
        ],
      },
      upgrade: {
        coins: 400000,
        food: 910000,
        goods: [
          {
            amount: 1500,
            resource: "secondary_fa",
          },
          {
            amount: 690,
            resource: "ceramic_treasure",
          },
          {
            amount: 460,
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
        coins: 430000,
        food: 870000,
        goods: [
          {
            amount: 600,
            resource: "primary_ie",
          },
          {
            amount: 600,
            resource: "secondary_ie",
          },
          {
            amount: 360,
            resource: "spice_treasure",
          },
          {
            amount: 90,
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
        coins: 470000,
        food: 950000,
        goods: [
          {
            amount: 650,
            resource: "primary_ie",
          },
          {
            amount: 650,
            resource: "tertiary_ie",
          },
          {
            amount: 720,
            resource: "spice_treasure",
          },
          {
            amount: 180,
            resource: "jewel_treasure",
          },
        ],
      },
    },
    {
      level: 31,
      era: "KS",
      max_qty: 12,
      construction: {
        coins: 5800000,
        food: 13000000,
        goods: [
          {
            amount: 4025,
            resource: "door",
          },
          {
            amount: 4025,
            resource: "wax_seal",
          },
          {
            amount: 4025,
            resource: "saffron",
          },
        ],
      },
      upgrade: {
        coins: 500000,
        food: 1000000,
        goods: [
          {
            amount: 680,
            resource: "door",
          },
          {
            amount: 680,
            resource: "wax_seal",
          },
          {
            amount: 680,
            resource: "saffron",
          },
        ],
      },
    },
    {
      level: 32,
      era: "KS",
      max_qty: 12,
      upgrade: {
        coins: 510000,
        food: 1000000,
        goods: [
          {
            amount: 710,
            resource: "primary_ks",
          },
          {
            amount: 710,
            resource: "secondary_ks",
          },
          {
            amount: 790,
            resource: "coffee",
          },
          {
            amount: 465,
            resource: "incense",
          },
        ],
      },
    },
    {
      level: 33,
      era: "KS",
      max_qty: 12,
      upgrade: {
        coins: 550000,
        food: 1100000,
        goods: [
          {
            amount: 740,
            resource: "primary_ks",
          },
          {
            amount: 740,
            resource: "tertiary_ks",
          },
          {
            amount: 1890,
            resource: "coffee",
          },
          {
            amount: 1110,
            resource: "incense",
          },
        ],
      },
    },
    {
      level: 34,
      era: "HM",
      max_qty: 13,
      construction: {
        coins: 7700000,
        food: 17000000,
        goods: [
          {
            amount: 12150,
            resource: "primary_ks",
          },
          {
            amount: 23000,
            resource: "coffee",
          },
          {
            amount: 13500,
            resource: "incense",
          },
        ],
      },
      upgrade: {
        coins: 590000,
        food: 1200000,
        goods: [
          {
            amount: 2300,
            resource: "tertiary_ks",
          },
          {
            amount: 2500,
            resource: "coffee",
          },
          {
            amount: 1500,
            resource: "incense",
          },
        ],
      },
    },
    {
      level: 35,
      era: "HM",
      max_qty: 13,
      upgrade: {
        coins: 630000,
        food: 1250000,
        goods: [
          {
            amount: 800,
            resource: "primary_hm",
          },
          {
            amount: 800,
            resource: "secondary_hm",
          },
          {
            amount: 1200,
            resource: "oil_lamp",
          },
          {
            amount: 750,
            resource: "carpet",
          },
        ],
      },
    },
    {
      level: 36,
      era: "HM",
      max_qty: 13,
      upgrade: {
        coins: 670000,
        food: 1300000,
        goods: [
          {
            amount: 830,
            resource: "primary_hm",
          },
          {
            amount: 830,
            resource: "tertiary_hm",
          },
          {
            amount: 2500,
            resource: "oil_lamp",
          },
          {
            amount: 1500,
            resource: "carpet",
          },
        ],
      },
    },
    {
      level: 37,
      era: "EG",
      max_qty: 14,
      construction: {
        coins: 9800000,
        food: 21000000,
        goods: [
          {
            amount: 5000,
            resource: "secretary_desk",
          },
          {
            amount: 5000,
            resource: "grimoire",
          },
          {
            amount: 5000,
            resource: "cinnamon",
          },
        ],
      },
      upgrade: {
        coins: 710000,
        food: 1350000,
        goods: [
          {
            amount: 1400,
            resource: "secretary_desk",
          },
          {
            amount: 1400,
            resource: "grimoire",
          },
          {
            amount: 1400,
            resource: "cinnamon",
          },
        ],
      },
    },
    {
      level: 38,
      era: "EG",
      max_qty: 14,
      upgrade: {
        coins: 750000,
        food: 1400000,
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
            amount: 6500,
            resource: "wheat",
          },
          {
            amount: 6500,
            resource: "pomegranate",
          },
        ],
      },
    },
    {
      level: 39,
      era: "EG",
      max_qty: 14,
      upgrade: {
        coins: 790000,
        food: 1450000,
        goods: [
          {
            amount: 1400,
            resource: "secondary_eg",
          },
          {
            amount: 1400,
            resource: "tertiary_eg",
          },
          {
            amount: 4500,
            resource: "confection",
          },
          {
            amount: 4500,
            resource: "syrup",
          },
        ],
      },
    },
    ...averageHomeDynamic,
  ],
};
