import { BuildingData } from "@/types/shared";

export const siegeBarracks: BuildingData = {
  id: "capital-siege-barracks",
  name: "Siege Barracks",
  category: "capital",
  subcategory: "barracks",
  imageName: "Capital_Siege_Barracks_Lv",
  width: 5,
  height: 6,
  levels: [
    {
      level: 6,
      era: "RE",
      max_qty: 1,
      construction: {
        coins: 6100000,
        food: 4100000,
        goods: [
          {
            amount: 8025,
            resource: "primary_er",
          },
          {
            amount: 8025,
            resource: "tertiary_er",
          },
          {
            amount: 5740,
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
        coins: 11000000,
        food: 7500000,
        goods: [
          {
            amount: 8925,
            resource: "mosaic",
          },
          {
            amount: 8925,
            resource: "goblet",
          },
          {
            amount: 8925,
            resource: "cape",
          },
        ],
      },
      upgrade: {
        coins: 3700000,
        food: 2760000,
        goods: [
          {
            amount: 2980,
            resource: "mosaic",
          },
          {
            amount: 2980,
            resource: "goblet",
          },
          {
            amount: 2980,
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
        coins: 17000000,
        food: 12000000,
        goods: [
          {
            amount: 13600,
            resource: "planks",
          },
          {
            amount: 13600,
            resource: "parchment",
          },
          {
            amount: 13600,
            resource: "pepper",
          },
        ],
      },
      upgrade: {
        coins: 5700000,
        food: 4000000,
        goods: [
          {
            amount: 3880,
            resource: "planks",
          },
          {
            amount: 3880,
            resource: "parchment",
          },
          {
            amount: 3880,
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
        coins: 27000000,
        food: 19000000,
        goods: [
          {
            amount: 13650,
            resource: "cartwheel",
          },
          {
            amount: 13650,
            resource: "ink",
          },
          {
            amount: 13650,
            resource: "salt",
          },
        ],
      },
      upgrade: {
        coins: 7800000,
        food: 5500000,
        goods: [
          {
            amount: 5005,
            resource: "cartwheel",
          },
          {
            amount: 5005,
            resource: "ink",
          },
          {
            amount: 5005,
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
        coins: 40000000,
        food: 28000000,
        goods: [
          {
            amount: 13650,
            resource: "barrel",
          },
          {
            amount: 13650,
            resource: "manuscript",
          },
          {
            amount: 13650,
            resource: "herbs",
          },
        ],
      },
      upgrade: {
        coins: 11100000,
        food: 7700000,
        goods: [
          {
            amount: 5855,
            resource: "barrel",
          },
          {
            amount: 5855,
            resource: "manuscript",
          },
          {
            amount: 5855,
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
        coins: 56000000,
        food: 38000000,
        goods: [
          {
            amount: 13700,
            resource: "door",
          },
          {
            amount: 13700,
            resource: "wax_seal",
          },
          {
            amount: 13700,
            resource: "saffron",
          },
        ],
      },
      upgrade: {
        coins: 13700000,
        food: 8500000,
        goods: [
          {
            amount: 6660,
            resource: "door",
          },
          {
            amount: 6660,
            resource: "wax_seal",
          },
          {
            amount: 6660,
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
        coins: 76000000,
        food: 50000000,
        goods: [
          {
            amount: 13700,
            resource: "wardrobe",
          },
          {
            amount: 13700,
            resource: "tome",
          },
          {
            amount: 13700,
            resource: "chili",
          },
        ],
      },
      upgrade: {
        coins: 16200000,
        food: 10100000,
        goods: [
          {
            amount: 7660,
            resource: "wardrobe",
          },
          {
            amount: 7660,
            resource: "tome",
          },
          {
            amount: 7660,
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
        coins: 100000000,
        food: 64000000,
        goods: [
          {
            amount: 14000,
            resource: "lead_glass",
          },
          {
            amount: 14000,
            resource: "fine_jewelry",
          },
          {
            amount: 14000,
            resource: "ointment",
          },
        ],
      },
      upgrade: {
        coins: 18800000,
        food: 11800000,
        goods: [
          {
            amount: 10000,
            resource: "secretary_desk",
          },
          {
            amount: 10000,
            resource: "grimoire",
          },
          {
            amount: 10000,
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
        coins: 124000000,
        food: 78000000,
        goods: [
          {
            amount: 14300,
            resource: "stained_glass",
          },
          {
            amount: 14300,
            resource: "embellishments",
          },
          {
            amount: 14300,
            resource: "elixirs",
          },
        ],
      },
      upgrade: {
        coins: 21400000,
        food: 13500000,
        goods: [
          {
            amount: 12340,
            resource: "lead_glass",
          },
          {
            amount: 12340,
            resource: "fine_jewelry",
          },
          {
            amount: 12340,
            resource: "ointment",
          },
        ],
      },
    },
  ],
};
