import { BuildingData } from "@/types/shared";

export const rangedBarracks: BuildingData = {
  id: "capital-barracks-ranged-barracks",
  name: "Ranged Barracks",
  category: "capital",
  subcategory: "barracks",
  imageName: "Capital_Ranged_Barracks_Lv",
  levels: [
    {
      level: 1,
      era: "SA",
      max_qty: 1,
      construction: {
        coins: 1000,
        food: 500,
      },
    },
    {
      level: 2,
      era: "BA",
      max_qty: 1,
      construction: {
        coins: 33000,
        food: 20000,
      },
      upgrade: {
        coins: 27000,
        food: 16400,
      },
    },
    {
      level: 3,
      era: "ME",
      max_qty: 1,
      construction: {
        coins: 200000,
        food: 120000,
        goods: [
          {
            amount: 92,
            resource: "alabaster_idol",
          },
          {
            amount: 92,
            resource: "bronze_bracelet",
          },
          {
            amount: 92,
            resource: "wool",
          },
        ],
      },
      upgrade: {
        coins: 139000,
        food: 83000,
        goods: [
          {
            amount: 44,
            resource: "alabaster_idol",
          },
          {
            amount: 44,
            resource: "bronze_bracelet",
          },
          {
            amount: 44,
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
        coins: 670000,
        food: 400000,
        goods: [
          {
            amount: 1450,
            resource: "tertiary_me",
          },
          {
            amount: 515,
            resource: "papyrus_scroll",
          },
          {
            amount: 515,
            resource: "ankh",
          },
        ],
      },
      upgrade: {
        coins: 393000,
        food: 236000,
        goods: [
          {
            amount: 975,
            resource: "tertiary_me",
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
    },
    {
      level: 5,
      era: "ER",
      max_qty: 1,
      construction: {
        coins: 1800000,
        food: 1100000,
        goods: [
          {
            amount: 1610,
            resource: "column",
          },
          {
            amount: 1610,
            resource: "silver_ring",
          },
          {
            amount: 1610,
            resource: "toga",
          },
        ],
      },
      upgrade: {
        coins: 980000,
        food: 590000,
        goods: [
          {
            amount: 940,
            resource: "column",
          },
          {
            amount: 940,
            resource: "silver_ring",
          },
          {
            amount: 940,
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
        coins: 3900000,
        food: 2300000,
        goods: [
          {
            amount: 5120,
            resource: "primary_er",
          },
          {
            amount: 5120,
            resource: "tertiary_er",
          },
          {
            amount: 3355,
            resource: "silk",
          },
        ],
      },
      upgrade: {
        coins: 1680000,
        food: 1000000,
        goods: [
          {
            amount: 2255,
            resource: "primary_er",
          },
          {
            amount: 2255,
            resource: "tertiary_er",
          },
          {
            amount: 2605,
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
        coins: 6700000,
        food: 4100000,
        goods: [
          {
            amount: 5700,
            resource: "mosaic",
          },
          {
            amount: 5700,
            resource: "goblet",
          },
          {
            amount: 5700,
            resource: "cape",
          },
        ],
      },
      upgrade: {
        coins: 2350000,
        food: 1520000,
        goods: [
          {
            amount: 1905,
            resource: "mosaic",
          },
          {
            amount: 1905,
            resource: "goblet",
          },
          {
            amount: 1905,
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
        coins: 11000000,
        food: 6800000,
        goods: [
          {
            amount: 8650,
            resource: "planks",
          },
          {
            amount: 8650,
            resource: "parchment",
          },
          {
            amount: 8650,
            resource: "pepper",
          },
        ],
      },
      upgrade: {
        coins: 3600000,
        food: 2190000,
        goods: [
          {
            amount: 2470,
            resource: "planks",
          },
          {
            amount: 2470,
            resource: "parchment",
          },
          {
            amount: 2470,
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
        coins: 17000000,
        food: 10000000,
        goods: [
          {
            amount: 8675,
            resource: "cartwheel",
          },
          {
            amount: 8675,
            resource: "ink",
          },
          {
            amount: 8675,
            resource: "salt",
          },
        ],
      },
      upgrade: {
        coins: 5000000,
        food: 3050000,
        goods: [
          {
            amount: 3195,
            resource: "cartwheel",
          },
          {
            amount: 3195,
            resource: "ink",
          },
          {
            amount: 3195,
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
        coins: 26000000,
        food: 15000000,
        goods: [
          {
            amount: 8700,
            resource: "barrel",
          },
          {
            amount: 8700,
            resource: "manuscript",
          },
          {
            amount: 8700,
            resource: "herbs",
          },
        ],
      },
      upgrade: {
        coins: 7100000,
        food: 4200000,
        goods: [
          {
            amount: 3735,
            resource: "barrel",
          },
          {
            amount: 3735,
            resource: "manuscript",
          },
          {
            amount: 3735,
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
        coins: 36000000,
        food: 21000000,
        goods: [
          {
            amount: 8725,
            resource: "door",
          },
          {
            amount: 8725,
            resource: "wax_seal",
          },
          {
            amount: 8725,
            resource: "saffron",
          },
        ],
      },
      upgrade: {
        coins: 8700000,
        food: 4800000,
        goods: [
          {
            amount: 4245,
            resource: "door",
          },
          {
            amount: 4245,
            resource: "wax_seal",
          },
          {
            amount: 4245,
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
        coins: 48000000,
        food: 28000000,
        goods: [
          {
            amount: 8750,
            resource: "wardrobe",
          },
          {
            amount: 8750,
            resource: "tome",
          },
          {
            amount: 8750,
            resource: "chili",
          },
        ],
      },
      upgrade: {
        coins: 10300000,
        food: 5600000,
        goods: [
          {
            amount: 4885,
            resource: "wardrobe",
          },
          {
            amount: 4885,
            resource: "tome",
          },
          {
            amount: 4885,
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
        coins: 60000000,
        food: 36000000,
        goods: [
          {
            amount: 8875,
            resource: "lead_glass",
          },
          {
            amount: 8875,
            resource: "fine_jewelry",
          },
          {
            amount: 8875,
            resource: "ointment",
          },
        ],
      },
      upgrade: {
        coins: 12000000,
        food: 6200000,
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
    },
    {
      level: 14,
      era: "LG",
      max_qty: 1,
      construction: {
        coins: 72000000,
        food: 44000000,
        goods: [
          {
            amount: 9000,
            resource: "stained_glass",
          },
          {
            amount: 9000,
            resource: "embellishments",
          },
          {
            amount: 9000,
            resource: "elixirs",
          },
        ],
      },
      upgrade: {
        coins: 13700000,
        food: 6800000,
        goods: [
          {
            amount: 7115,
            resource: "lead_glass",
          },
          {
            amount: 7115,
            resource: "fine_jewelry",
          },
          {
            amount: 7115,
            resource: "ointment",
          },
        ],
      },
    },
  ],
};
