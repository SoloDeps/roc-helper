import { BuildingData } from "@/types/shared";

export const infantryBarracks: BuildingData = {
  id: "capital-infantry-barracks",
  name: "Infantry Barracks",
  category: "capital",
  subcategory: "barracks",
  imageName: "Capital_Infantry_Barracks_Lv",
  width: 4,
  height: 4,
  levels: [
    {
      level: 1,
      era: "SA",
      max_qty: 2,
      construction: {
        coins: 39,
        food: 23,
      },
    },
    {
      level: 2,
      era: "BA",
      max_qty: 2,
      construction: {
        coins: 25000,
        food: 16000,
      },
      upgrade: {
        coins: 21200,
        food: 12900,
      },
    },
    {
      level: 3,
      era: "ME",
      max_qty: 2,
      construction: {
        coins: 160000,
        food: 95000,
        goods: [
          {
            amount: 85,
            resource: "alabaster_idol",
          },
          {
            amount: 85,
            resource: "bronze_bracelet",
          },
          {
            amount: 85,
            resource: "wool",
          },
        ],
      },
      upgrade: {
        coins: 111000,
        food: 66000,
        goods: [
          {
            amount: 40,
            resource: "alabaster_idol",
          },
          {
            amount: 40,
            resource: "bronze_bracelet",
          },
          {
            amount: 40,
            resource: "wool",
          },
        ],
      },
    },
    {
      level: 4,
      era: "CG",
      max_qty: 2,
      construction: {
        coins: 550000,
        food: 320000,
        goods: [
          {
            amount: 1320,
            resource: "tertiary_me",
          },
          {
            amount: 455,
            resource: "papyrus_scroll",
          },
          {
            amount: 455,
            resource: "ankh",
          },
        ],
      },
      upgrade: {
        coins: 324000,
        food: 190000,
        goods: [
          {
            amount: 885,
            resource: "tertiary_me",
          },
          {
            amount: 305,
            resource: "papyrus_scroll",
          },
          {
            amount: 305,
            resource: "ankh",
          },
        ],
      },
    },
    {
      level: 5,
      era: "ER",
      max_qty: 2,
      construction: {
        coins: 1500000,
        food: 890000,
        goods: [
          {
            amount: 1465,
            resource: "column",
          },
          {
            amount: 1465,
            resource: "silver_ring",
          },
          {
            amount: 1465,
            resource: "toga",
          },
        ],
      },
      upgrade: {
        coins: 790000,
        food: 470000,
        goods: [
          {
            amount: 855,
            resource: "column",
          },
          {
            amount: 855,
            resource: "silver_ring",
          },
          {
            amount: 855,
            resource: "toga",
          },
        ],
      },
    },
    {
      level: 6,
      era: "RE",
      max_qty: 2,
      construction: {
        coins: 3100000,
        food: 1900000,
        goods: [
          {
            amount: 4660,
            resource: "primary_er",
          },
          {
            amount: 4660,
            resource: "tertiary_er",
          },
          {
            amount: 3060,
            resource: "silk",
          },
        ],
      },
      upgrade: {
        coins: 1330000,
        food: 810000,
        goods: [
          {
            amount: 2050,
            resource: "primary_er",
          },
          {
            amount: 2050,
            resource: "tertiary_er",
          },
          {
            amount: 2350,
            resource: "silk",
          },
        ],
      },
    },
    {
      level: 7,
      era: "BE",
      max_qty: 2,
      construction: {
        coins: 5300000,
        food: 3300000,
        goods: [
          {
            amount: 5175,
            resource: "mosaic",
          },
          {
            amount: 5175,
            resource: "goblet",
          },
          {
            amount: 5175,
            resource: "cape",
          },
        ],
      },
      upgrade: {
        coins: 1870000,
        food: 1210000,
        goods: [
          {
            amount: 1730,
            resource: "mosaic",
          },
          {
            amount: 1730,
            resource: "goblet",
          },
          {
            amount: 1730,
            resource: "cape",
          },
        ],
      },
    },
    {
      level: 8,
      era: "AF",
      max_qty: 2,
      construction: {
        coins: 8900000,
        food: 5400000,
        goods: [
          {
            amount: 7875,
            resource: "planks",
          },
          {
            amount: 7875,
            resource: "parchment",
          },
          {
            amount: 7875,
            resource: "pepper",
          },
        ],
      },
      upgrade: {
        coins: 2930000,
        food: 1750000,
        goods: [
          {
            amount: 2250,
            resource: "planks",
          },
          {
            amount: 2250,
            resource: "parchment",
          },
          {
            amount: 2250,
            resource: "pepper",
          },
        ],
      },
    },
    {
      level: 9,
      era: "FA",
      max_qty: 2,
      construction: {
        coins: 14000000,
        food: 8300000,
        goods: [
          {
            amount: 7900,
            resource: "cartwheel",
          },
          {
            amount: 7900,
            resource: "ink",
          },
          {
            amount: 7900,
            resource: "salt",
          },
        ],
      },
      upgrade: {
        coins: 4000000,
        food: 2400000,
        goods: [
          {
            amount: 2900,
            resource: "cartwheel",
          },
          {
            amount: 2900,
            resource: "ink",
          },
          {
            amount: 2900,
            resource: "salt",
          },
        ],
      },
    },
    {
      level: 10,
      era: "IE",
      max_qty: 2,
      construction: {
        coins: 20000000,
        food: 12000000,
        goods: [
          {
            amount: 7925,
            resource: "barrel",
          },
          {
            amount: 7925,
            resource: "manuscript",
          },
          {
            amount: 7925,
            resource: "herbs",
          },
        ],
      },
      upgrade: {
        coins: 5700000,
        food: 3400000,
        goods: [
          {
            amount: 3395,
            resource: "barrel",
          },
          {
            amount: 3395,
            resource: "manuscript",
          },
          {
            amount: 3395,
            resource: "herbs",
          },
        ],
      },
    },
    {
      level: 11,
      era: "KS",
      max_qty: 2,
      construction: {
        coins: 29000000,
        food: 17000000,
        goods: [
          {
            amount: 7950,
            resource: "door",
          },
          {
            amount: 7950,
            resource: "wax_seal",
          },
          {
            amount: 7950,
            resource: "saffron",
          },
        ],
      },
      upgrade: {
        coins: 7100000,
        food: 3800000,
        goods: [
          {
            amount: 3860,
            resource: "door",
          },
          {
            amount: 3860,
            resource: "wax_seal",
          },
          {
            amount: 3860,
            resource: "saffron",
          },
        ],
      },
    },
    {
      level: 12,
      era: "HM",
      max_qty: 2,
      construction: {
        coins: 39000000,
        food: 22000000,
        goods: [
          {
            amount: 7975,
            resource: "wardrobe",
          },
          {
            amount: 7975,
            resource: "tome",
          },
          {
            amount: 7975,
            resource: "chili",
          },
        ],
      },
      upgrade: {
        coins: 8300000,
        food: 4500000,
        goods: [
          {
            amount: 4440,
            resource: "wardrobe",
          },
          {
            amount: 4440,
            resource: "tome",
          },
          {
            amount: 4440,
            resource: "chili",
          },
        ],
      },
    },
    {
      level: 13,
      era: "EG",
      max_qty: 2,
      construction: {
        coins: 50000000,
        food: 28000000,
        goods: [
          {
            amount: 8100,
            resource: "lead_glass",
          },
          {
            amount: 8100,
            resource: "fine_jewelry",
          },
          {
            amount: 8100,
            resource: "ointment",
          },
        ],
      },
      upgrade: {
        coins: 9500000,
        food: 5200000,
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
    },
    {
      level: 14,
      era: "LG",
      max_qty: 2,
      construction: {
        coins: 61000000,
        food: 34000000,
        goods: [
          {
            amount: 8225,
            resource: "stained_glass",
          },
          {
            amount: 8225,
            resource: "embellishments",
          },
          {
            amount: 8225,
            resource: "elixirs",
          },
        ],
      },
      upgrade: {
        coins: 10700000,
        food: 5900000,
        goods: [
          {
            amount: 5560,
            resource: "lead_glass",
          },
          {
            amount: 5560,
            resource: "fine_jewelry",
          },
          {
            amount: 5560,
            resource: "ointment",
          },
        ],
      },
    },
  ],
};
