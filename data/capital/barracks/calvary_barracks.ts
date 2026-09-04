import { BuildingData } from "@/types/shared";

export const cavalryBarracks: BuildingData = {
  id: "capital-barracks-cavalry-barracks",
  name: "Cavalry Barracks",
  category: "capital",
  subcategory: "barracks",
  imageName: "Capital_Cavalry_Barracks_Lv",
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
            resource: "primary_ba",
          },
          {
            amount: 105,
            resource: "secondary_ba",
          },
          {
            amount: 105,
            resource: "tertiary_ba",
          },
        ],
      },
      upgrade: {
        coins: 152000,
        food: 96000,
        goods: [
          {
            amount: 48,
            resource: "primary_ba",
          },
          {
            amount: 48,
            resource: "secondary_ba",
          },
          {
            amount: 48,
            resource: "tertiary_ba",
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
            resource: "primary_cg",
          },
          {
            amount: 1760,
            resource: "secondary_cg",
          },
          {
            amount: 1760,
            resource: "tertiary_cg",
          },
        ],
      },
      upgrade: {
        coins: 1080000,
        food: 680000,
        goods: [
          {
            amount: 1030,
            resource: "primary_cg",
          },
          {
            amount: 1030,
            resource: "secondary_cg",
          },
          {
            amount: 1030,
            resource: "tertiary_cg",
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
            resource: "primary_re",
          },
          {
            amount: 6225,
            resource: "secondary_re",
          },
          {
            amount: 6225,
            resource: "tertiary_re",
          },
        ],
      },
      upgrade: {
        coins: 2550000,
        food: 1770000,
        goods: [
          {
            amount: 2075,
            resource: "primary_re",
          },
          {
            amount: 2075,
            resource: "secondary_re",
          },
          {
            amount: 2075,
            resource: "tertiary_re",
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
            resource: "primary_be",
          },
          {
            amount: 9450,
            resource: "secondary_be",
          },
          {
            amount: 9450,
            resource: "tertiary_be",
          },
        ],
      },
      upgrade: {
        coins: 4000000,
        food: 2560000,
        goods: [
          {
            amount: 2700,
            resource: "primary_be",
          },
          {
            amount: 2700,
            resource: "secondary_be",
          },
          {
            amount: 2700,
            resource: "tertiary_be",
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
            resource: "primary_af",
          },
          {
            amount: 9475,
            resource: "secondary_af",
          },
          {
            amount: 9475,
            resource: "tertiary_af",
          },
        ],
      },
      upgrade: {
        coins: 5500000,
        food: 3400000,
        goods: [
          {
            amount: 3485,
            resource: "primary_af",
          },
          {
            amount: 3485,
            resource: "secondary_af",
          },
          {
            amount: 3485,
            resource: "tertiary_af",
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
            resource: "primary_fa",
          },
          {
            amount: 9500,
            resource: "secondary_fa",
          },
          {
            amount: 9500,
            resource: "tertiary_fa",
          },
        ],
      },
      upgrade: {
        coins: 7800000,
        food: 5000000,
        goods: [
          {
            amount: 4070,
            resource: "primary_fa",
          },
          {
            amount: 4070,
            resource: "secondary_fa",
          },
          {
            amount: 4070,
            resource: "tertiary_fa",
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
            resource: "primary_ie",
          },
          {
            amount: 9525,
            resource: "secondary_ie",
          },
          {
            amount: 9525,
            resource: "tertiary_ie",
          },
        ],
      },
      upgrade: {
        coins: 9600000,
        food: 5600000,
        goods: [
          {
            amount: 4635,
            resource: "primary_ie",
          },
          {
            amount: 4635,
            resource: "secondary_ie",
          },
          {
            amount: 4635,
            resource: "tertiary_ie",
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
            resource: "primary_ks",
          },
          {
            amount: 9550,
            resource: "secondary_ks",
          },
          {
            amount: 9550,
            resource: "tertiary_ks",
          },
        ],
      },
      upgrade: {
        coins: 11300000,
        food: 6500000,
        goods: [
          {
            amount: 5330,
            resource: "primary_ks",
          },
          {
            amount: 5330,
            resource: "secondary_ks",
          },
          {
            amount: 5330,
            resource: "tertiary_ks",
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
            resource: "tertiary_eg",
          },
          {
            amount: 9700,
            resource: "primary_eg",
          },
          {
            amount: 9700,
            resource: "secondary_eg",
          },
        ],
      },
      upgrade: {
        coins: 13000000,
        food: 7500000,
        goods: [
          {
            amount: 7000,
            resource: "primary_hm",
          },
          {
            amount: 7000,
            resource: "secondary_hm",
          },
          {
            amount: 7000,
            resource: "tertiary_hm",
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
            resource: "tertiary_lg",
          },
          {
            amount: 9850,
            resource: "primary_lg",
          },
          {
            amount: 9850,
            resource: "secondary_lg",
          },
        ],
      },
      upgrade: {
        coins: 14700000,
        food: 8500000,
        goods: [
          {
            amount: 8670,
            resource: "tertiary_eg",
          },
          {
            amount: 8670,
            resource: "primary_eg",
          },
          {
            amount: 8670,
            resource: "secondary_eg",
          },
        ],
      },
    },
  ],
};
