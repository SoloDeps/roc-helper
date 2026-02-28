import { BuildingData } from "@/types/shared";

export const cavalryBarracks: BuildingData = {
  id: "capital-barracks-cavalry-barracks",
  name: "Cavalry Barracks",
  category: "capital",
  subcategory: "barracks",
  imageName: "Capital_Cavalry_Barracks_Lv",
  width: 4,
  height: 5,
  levels: [
    {
      level: 2,
      era: "BA",
      max_qty: 1,
      construction: {
        coins: 36000,
        food: 23000,
      },
    },
    {
      level: 3,
      era: "ME",
      max_qty: 1,
      construction: {
        coins: 220000,
        food: 140000,
        goods: [
          {
            amount: 105,
            resource: "alabaster_idol",
          },
          {
            amount: 105,
            resource: "bronze_bracelet",
          },
          {
            amount: 105,
            resource: "wool",
          },
        ],
      },
      upgrade: {
        coins: 152000,
        food: 96000,
        goods: [
          {
            amount: 48,
            resource: "alabaster_idol",
          },
          {
            amount: 48,
            resource: "bronze_bracelet",
          },
          {
            amount: 48,
            resource: "wool",
          },
        ],
      },
    },
    {
      level: 4,
      era: "CG",
      max_qty: 1,
      construction: {
        coins: 750000,
        food: 470000,
        goods: [
          {
            amount: 1575,
            resource: "tertiary_me",
          },
          {
            amount: 555,
            resource: "papyrus_scroll",
          },
          {
            amount: 555,
            resource: "ankh",
          },
        ],
      },
      upgrade: {
        coins: 440000,
        food: 278000,
        goods: [
          {
            amount: 1060,
            resource: "tertiary_me",
          },
          {
            amount: 370,
            resource: "papyrus_scroll",
          },
          {
            amount: 370,
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
        coins: 2000000,
        food: 1300000,
        goods: [
          {
            amount: 1760,
            resource: "column",
          },
          {
            amount: 1760,
            resource: "silver_ring",
          },
          {
            amount: 1760,
            resource: "toga",
          },
        ],
      },
      upgrade: {
        coins: 1080000,
        food: 680000,
        goods: [
          {
            amount: 1030,
            resource: "column",
          },
          {
            amount: 1030,
            resource: "silver_ring",
          },
          {
            amount: 1030,
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
        coins: 4200000,
        food: 2700000,
        goods: [
          {
            amount: 5590,
            resource: "primary_er",
          },
          {
            amount: 5590,
            resource: "tertiary_er",
          },
          {
            amount: 3710,
            resource: "silk",
          },
        ],
      },
      upgrade: {
        coins: 1830000,
        food: 1170000,
        goods: [
          {
            amount: 2460,
            resource: "primary_er",
          },
          {
            amount: 2460,
            resource: "tertiary_er",
          },
          {
            amount: 2840,
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
        coins: 7300000,
        food: 4800000,
        goods: [
          {
            amount: 6225,
            resource: "mosaic",
          },
          {
            amount: 6225,
            resource: "goblet",
          },
          {
            amount: 6225,
            resource: "cape",
          },
        ],
      },
      upgrade: {
        coins: 2550000,
        food: 1770000,
        goods: [
          {
            amount: 2075,
            resource: "mosaic",
          },
          {
            amount: 2075,
            resource: "goblet",
          },
          {
            amount: 2075,
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
        coins: 12000000,
        food: 7900000,
        goods: [
          {
            amount: 9450,
            resource: "planks",
          },
          {
            amount: 9450,
            resource: "parchment",
          },
          {
            amount: 9450,
            resource: "pepper",
          },
        ],
      },
      upgrade: {
        coins: 4000000,
        food: 2560000,
        goods: [
          {
            amount: 2700,
            resource: "planks",
          },
          {
            amount: 2700,
            resource: "parchment",
          },
          {
            amount: 2700,
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
        coins: 19000000,
        food: 12000000,
        goods: [
          {
            amount: 9475,
            resource: "cartwheel",
          },
          {
            amount: 9475,
            resource: "ink",
          },
          {
            amount: 9475,
            resource: "salt",
          },
        ],
      },
      upgrade: {
        coins: 5500000,
        food: 3400000,
        goods: [
          {
            amount: 3485,
            resource: "cartwheel",
          },
          {
            amount: 3485,
            resource: "ink",
          },
          {
            amount: 3485,
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
        coins: 28000000,
        food: 18000000,
        goods: [
          {
            amount: 9500,
            resource: "barrel",
          },
          {
            amount: 9500,
            resource: "manuscript",
          },
          {
            amount: 9500,
            resource: "herbs",
          },
        ],
      },
      upgrade: {
        coins: 7800000,
        food: 5000000,
        goods: [
          {
            amount: 4070,
            resource: "barrel",
          },
          {
            amount: 4070,
            resource: "manuscript",
          },
          {
            amount: 4070,
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
        coins: 40000000,
        food: 25000000,
        goods: [
          {
            amount: 9525,
            resource: "door",
          },
          {
            amount: 9525,
            resource: "wax_seal",
          },
          {
            amount: 9525,
            resource: "saffron",
          },
        ],
      },
      upgrade: {
        coins: 9600000,
        food: 5600000,
        goods: [
          {
            amount: 4635,
            resource: "door",
          },
          {
            amount: 4635,
            resource: "wax_seal",
          },
          {
            amount: 4635,
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
        coins: 53000000,
        food: 32000000,
        goods: [
          {
            amount: 9550,
            resource: "wardrobe",
          },
          {
            amount: 9550,
            resource: "tome",
          },
          {
            amount: 9550,
            resource: "chili",
          },
        ],
      },
      upgrade: {
        coins: 11300000,
        food: 6500000,
        goods: [
          {
            amount: 5330,
            resource: "wardrobe",
          },
          {
            amount: 5330,
            resource: "tome",
          },
          {
            amount: 5330,
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
        coins: 67000000,
        food: 40000000,
        goods: [
          {
            amount: 9700,
            resource: "lead_glass",
          },
          {
            amount: 9700,
            resource: "fine_jewelry",
          },
          {
            amount: 9700,
            resource: "ointment",
          },
        ],
      },
      upgrade: {
        coins: 13000000,
        food: 7500000,
        goods: [
          {
            amount: 7000,
            resource: "secretary_desk",
          },
          {
            amount: 7000,
            resource: "grimoire",
          },
          {
            amount: 7000,
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
        coins: 81000000,
        food: 48000000,
        goods: [
          {
            amount: 9850,
            resource: "stained_glass",
          },
          {
            amount: 9850,
            resource: "embellishments",
          },
          {
            amount: 9850,
            resource: "elixirs",
          },
        ],
      },
      upgrade: {
        coins: 14700000,
        food: 8500000,
        goods: [
          {
            amount: 8670,
            resource: "lead_glass",
          },
          {
            amount: 8670,
            resource: "fine_jewelry",
          },
          {
            amount: 8670,
            resource: "ointment",
          },
        ],
      },
    },
  ],
};
