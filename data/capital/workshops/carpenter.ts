import { BuildingData } from "@/types/shared";

export const carpenterWorkshop: BuildingData = {
  id: "capital-workshops-carpenter",
  name: "Carpenter",
  category: "capital",
  subcategory: "workshops",
  imageName: "Capital_Carpenter_Lv",
  levels: [
    {
      level: 1,
      era: "BE",
      max_qty: 4,
      construction: {
        coins: 6700000,
        food: 3900000,
        goods: [
          {
            amount: 1000,
            resource: "mosaic",
          },
          {
            amount: 1000,
            resource: "goblet",
          },
          {
            amount: 1000,
            resource: "cape",
          },
        ],
      },
    },
    {
      level: 2,
      era: "AF",
      max_qty: 4,
      construction: {
        coins: 11000000,
        food: 6400000,
        goods: [
          {
            amount: 4720,
            resource: "planks",
          },
          {
            amount: 4720,
            resource: "parchment",
          },
          {
            amount: 4720,
            resource: "pepper",
          },
        ],
      },
      upgrade: {
        coins: 3600000,
        food: 2100000,
        goods: [
          {
            amount: 1350,
            resource: "planks",
          },
          {
            amount: 1350,
            resource: "parchment",
          },
          {
            amount: 1350,
            resource: "pepper",
          },
        ],
      },
    },
    {
      level: 3,
      era: "FA",
      max_qty: 4,
      construction: {
        coins: 17000000,
        food: 9900000,
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
        coins: 5000000,
        food: 2870000,
        goods: [
          {
            amount: 1740,
            resource: "cartwheel",
          },
          {
            amount: 1740,
            resource: "ink",
          },
          {
            amount: 1740,
            resource: "salt",
          },
        ],
      },
    },
    {
      level: 4,
      era: "IE",
      max_qty: 4,
      construction: {
        coins: 26000000,
        food: 15000000,
        goods: [
          {
            amount: 4800,
            resource: "barrel",
          },
          {
            amount: 4800,
            resource: "manuscript",
          },
          {
            amount: 4800,
            resource: "herbs",
          },
        ],
      },
      upgrade: {
        coins: 7100000,
        food: 4100000,
        goods: [
          {
            amount: 2035,
            resource: "barrel",
          },
          {
            amount: 2035,
            resource: "manuscript",
          },
          {
            amount: 2035,
            resource: "herbs",
          },
        ],
      },
    },
    {
      level: 5,
      era: "KS",
      max_qty: 4,
      construction: {
        coins: 36000000,
        food: 20000000,
        goods: [
          {
            amount: 4850,
            resource: "door",
          },
          {
            amount: 4850,
            resource: "wax_seal",
          },
          {
            amount: 4850,
            resource: "saffron",
          },
        ],
      },
      upgrade: {
        coins: 8700000,
        food: 4500000,
        goods: [
          {
            amount: 2315,
            resource: "door",
          },
          {
            amount: 2315,
            resource: "wax_seal",
          },
          {
            amount: 2315,
            resource: "saffron",
          },
        ],
      },
    },
    {
      level: 6,
      era: "HM",
      max_qty: 4,
      construction: {
        coins: 48000000,
        food: 27000000,
        goods: [
          {
            amount: 4900,
            resource: "wardrobe",
          },
          {
            amount: 4900,
            resource: "tome",
          },
          {
            amount: 4900,
            resource: "chili",
          },
        ],
      },
      upgrade: {
        coins: 10300000,
        food: 5400000,
        goods: [
          {
            amount: 2665,
            resource: "wardrobe",
          },
          {
            amount: 2665,
            resource: "tome",
          },
          {
            amount: 2665,
            resource: "chili",
          },
        ],
      },
    },
  ],
};
