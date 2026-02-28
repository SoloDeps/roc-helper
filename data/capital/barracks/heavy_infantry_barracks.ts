import { BuildingData } from "@/types/shared";

export const heavyInfantryBarracks: BuildingData = {
  id: "capital-barracks-heavy_infantry_barracks",
  name: "Heavy Infantry Barracks",
  category: "capital",
  subcategory: "barracks",
  imageName: "Capital_Heavy_Infantry_Barracks_Lv",
  width: 5,
  height: 5,
  levels: [
    {
      level: 4,
      era: "CG",
      max_qty: 1,
      construction: {
        coins: 850000,
        food: 590000,
        goods: [
          {
            amount: 1815,
            resource: "tertiary_me",
          },
          {
            amount: 685,
            resource: "papyrus_scroll",
          },
          {
            amount: 685,
            resource: "ankh",
          },
        ],
      },
    },
    {
      level: 5,
      era: "ER",
      max_qty: 1,
      construction: {
        coins: 2300000,
        food: 1600000,
        goods: [
          {
            amount: 2020,
            resource: "column",
          },
          {
            amount: 2020,
            resource: "silver_ring",
          },
          {
            amount: 2020,
            resource: "toga",
          },
        ],
      },
      upgrade: {
        coins: 1240000,
        food: 850000,
        goods: [
          {
            amount: 1180,
            resource: "column",
          },
          {
            amount: 1180,
            resource: "silver_ring",
          },
          {
            amount: 1180,
            resource: "toga",
          },
        ],
      },
    },
    {
      level: 6,
      era: "RE",
      max_qty: 1,
      construction: {
        coins: 4900000,
        food: 3300000,
        goods: [
          {
            amount: 6425,
            resource: "primary_er",
          },
          {
            amount: 6425,
            resource: "tertiary_er",
          },
          {
            amount: 4610,
            resource: "silk",
          },
        ],
      },
      upgrade: {
        coins: 2110000,
        food: 1440000,
        goods: [
          {
            amount: 2830,
            resource: "primary_er",
          },
          {
            amount: 2830,
            resource: "tertiary_er",
          },
          {
            amount: 3530,
            resource: "silk",
          },
        ],
      },
    },
    {
      level: 7,
      era: "BE",
      max_qty: 1,
      construction: {
        coins: 8400000,
        food: 6000000,
        goods: [
          {
            amount: 7150,
            resource: "mosaic",
          },
          {
            amount: 7150,
            resource: "goblet",
          },
          {
            amount: 7150,
            resource: "cape",
          },
        ],
      },
      upgrade: {
        coins: 2980000,
        food: 2180000,
        goods: [
          {
            amount: 2385,
            resource: "mosaic",
          },
          {
            amount: 2385,
            resource: "goblet",
          },
          {
            amount: 2385,
            resource: "cape",
          },
        ],
      },
    },
    {
      level: 8,
      era: "AF",
      max_qty: 1,
      construction: {
        coins: 14000000,
        food: 9900000,
        goods: [
          {
            amount: 10900,
            resource: "planks",
          },
          {
            amount: 10900,
            resource: "parchment",
          },
          {
            amount: 10900,
            resource: "pepper",
          },
        ],
      },
      upgrade: {
        coins: 4600000,
        food: 3260000,
        goods: [
          {
            amount: 3100,
            resource: "planks",
          },
          {
            amount: 3100,
            resource: "parchment",
          },
          {
            amount: 3100,
            resource: "pepper",
          },
        ],
      },
    },
    {
      level: 9,
      era: "FA",
      max_qty: 1,
      construction: {
        coins: 21000000,
        food: 15000000,
        goods: [
          {
            amount: 10900,
            resource: "cartwheel",
          },
          {
            amount: 10900,
            resource: "ink",
          },
          {
            amount: 10900,
            resource: "salt",
          },
        ],
      },
      upgrade: {
        coins: 6200000,
        food: 4400000,
        goods: [
          {
            amount: 4005,
            resource: "cartwheel",
          },
          {
            amount: 4005,
            resource: "ink",
          },
          {
            amount: 4005,
            resource: "salt",
          },
        ],
      },
    },
    {
      level: 10,
      era: "IE",
      max_qty: 1,
      construction: {
        coins: 32000000,
        food: 22000000,
        goods: [
          {
            amount: 10950,
            resource: "barrel",
          },
          {
            amount: 10950,
            resource: "manuscript",
          },
          {
            amount: 10950,
            resource: "herbs",
          },
        ],
      },
      upgrade: {
        coins: 9000000,
        food: 6100000,
        goods: [
          {
            amount: 4680,
            resource: "barrel",
          },
          {
            amount: 4680,
            resource: "manuscript",
          },
          {
            amount: 4680,
            resource: "herbs",
          },
        ],
      },
    },
    {
      level: 11,
      era: "KS",
      max_qty: 1,
      construction: {
        coins: 45000000,
        food: 31000000,
        goods: [
          {
            amount: 10950,
            resource: "door",
          },
          {
            amount: 10950,
            resource: "wax_seal",
          },
          {
            amount: 10950,
            resource: "saffron",
          },
        ],
      },
      upgrade: {
        coins: 11000000,
        food: 6800000,
        goods: [
          {
            amount: 5330,
            resource: "door",
          },
          {
            amount: 5330,
            resource: "wax_seal",
          },
          {
            amount: 5330,
            resource: "saffron",
          },
        ],
      },
    },
    {
      level: 12,
      era: "HM",
      max_qty: 1,
      construction: {
        coins: 61000000,
        food: 40000000,
        goods: [
          {
            amount: 11000,
            resource: "wardrobe",
          },
          {
            amount: 11000,
            resource: "tome",
          },
          {
            amount: 11000,
            resource: "chili",
          },
        ],
      },
      upgrade: {
        coins: 13200000,
        food: 8100000,
        goods: [
          {
            amount: 6130,
            resource: "wardrobe",
          },
          {
            amount: 6130,
            resource: "tome",
          },
          {
            amount: 6130,
            resource: "chili",
          },
        ],
      },
    },
    {
      level: 13,
      era: "EG",
      max_qty: 1,
      construction: {
        coins: 80000000,
        food: 50000000,
        goods: [
          {
            amount: 11200,
            resource: "lead_glass",
          },
          {
            amount: 11200,
            resource: "fine_jewelry",
          },
          {
            amount: 11200,
            resource: "ointment",
          },
        ],
      },
      upgrade: {
        coins: 15500000,
        food: 10000000,
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
    },
    {
      level: 14,
      era: "LG",
      max_qty: 1,
      construction: {
        coins: 99000000,
        food: 58000000,
        goods: [
          {
            amount: 11400,
            resource: "stained_glass",
          },
          {
            amount: 11400,
            resource: "embellishments",
          },
          {
            amount: 11400,
            resource: "elixirs",
          },
        ],
      },
      upgrade: {
        coins: 17800000,
        food: 11900000,
        goods: [
          {
            amount: 9870,
            resource: "lead_glass",
          },
          {
            amount: 9870,
            resource: "fine_jewelry",
          },
          {
            amount: 9870,
            resource: "ointment",
          },
        ],
      },
    },
  ],
};
