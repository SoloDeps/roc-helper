import { BuildingData } from "@/types/shared";

export const heavyInfantryBarracks: BuildingData = {
  id: "capital-barracks-heavy_infantry_barracks",
  name: "Heavy Infantry Barracks",
  category: "capital",
  subcategory: "barracks",
  imageName: "Capital_Heavy_Infantry_Barracks_Lv",
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
            resource: "primary_cg",
          },
          {
            amount: 2020,
            resource: "secondary_cg",
          },
          {
            amount: 2020,
            resource: "tertiary_cg",
          },
        ],
      },
      upgrade: {
        coins: 1240000,
        food: 850000,
        goods: [
          {
            amount: 1180,
            resource: "primary_cg",
          },
          {
            amount: 1180,
            resource: "secondary_cg",
          },
          {
            amount: 1180,
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
            resource: "primary_re",
          },
          {
            amount: 7150,
            resource: "secondary_re",
          },
          {
            amount: 7150,
            resource: "tertiary_re",
          },
        ],
      },
      upgrade: {
        coins: 2980000,
        food: 2180000,
        goods: [
          {
            amount: 2385,
            resource: "primary_re",
          },
          {
            amount: 2385,
            resource: "secondary_re",
          },
          {
            amount: 2385,
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
        coins: 14000000,
        food: 9900000,
        goods: [
          {
            amount: 10900,
            resource: "primary_be",
          },
          {
            amount: 10900,
            resource: "secondary_be",
          },
          {
            amount: 10900,
            resource: "tertiary_be",
          },
        ],
      },
      upgrade: {
        coins: 4600000,
        food: 3260000,
        goods: [
          {
            amount: 3100,
            resource: "primary_be",
          },
          {
            amount: 3100,
            resource: "secondary_be",
          },
          {
            amount: 3100,
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
        coins: 21000000,
        food: 15000000,
        goods: [
          {
            amount: 10900,
            resource: "primary_af",
          },
          {
            amount: 10900,
            resource: "secondary_af",
          },
          {
            amount: 10900,
            resource: "tertiary_af",
          },
        ],
      },
      upgrade: {
        coins: 6200000,
        food: 4400000,
        goods: [
          {
            amount: 4005,
            resource: "primary_af",
          },
          {
            amount: 4005,
            resource: "secondary_af",
          },
          {
            amount: 4005,
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
        coins: 32000000,
        food: 22000000,
        goods: [
          {
            amount: 10950,
            resource: "primary_fa",
          },
          {
            amount: 10950,
            resource: "secondary_fa",
          },
          {
            amount: 10950,
            resource: "tertiary_fa",
          },
        ],
      },
      upgrade: {
        coins: 9000000,
        food: 6100000,
        goods: [
          {
            amount: 4680,
            resource: "primary_fa",
          },
          {
            amount: 4680,
            resource: "secondary_fa",
          },
          {
            amount: 4680,
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
        coins: 45000000,
        food: 31000000,
        goods: [
          {
            amount: 10950,
            resource: "primary_ie",
          },
          {
            amount: 10950,
            resource: "secondary_ie",
          },
          {
            amount: 10950,
            resource: "tertiary_ie",
          },
        ],
      },
      upgrade: {
        coins: 11000000,
        food: 6800000,
        goods: [
          {
            amount: 5330,
            resource: "primary_ie",
          },
          {
            amount: 5330,
            resource: "secondary_ie",
          },
          {
            amount: 5330,
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
        coins: 61000000,
        food: 40000000,
        goods: [
          {
            amount: 11000,
            resource: "primary_ks",
          },
          {
            amount: 11000,
            resource: "secondary_ks",
          },
          {
            amount: 11000,
            resource: "tertiary_ks",
          },
        ],
      },
      upgrade: {
        coins: 13200000,
        food: 8100000,
        goods: [
          {
            amount: 6130,
            resource: "primary_ks",
          },
          {
            amount: 6130,
            resource: "secondary_ks",
          },
          {
            amount: 6130,
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
        coins: 80000000,
        food: 49000000,
        goods: [
          {
            amount: 11200,
            resource: "tertiary_eg",
          },
          {
            amount: 11200,
            resource: "primary_eg",
          },
          {
            amount: 11200,
            resource: "secondary_eg",
          },
        ],
      },
      upgrade: {
        coins: 15500000,
        food: 10000000,
        goods: [
          {
            amount: 8000,
            resource: "primary_hm",
          },
          {
            amount: 8000,
            resource: "secondary_hm",
          },
          {
            amount: 8000,
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
        coins: 99000000,
        food: 58000000,
        goods: [
          {
            amount: 11400,
            resource: "tertiary_lg",
          },
          {
            amount: 11400,
            resource: "primary_lg",
          },
          {
            amount: 11400,
            resource: "secondary_lg",
          },
        ],
      },
      upgrade: {
        coins: 17800000,
        food: 11900000,
        goods: [
          {
            amount: 9870,
            resource: "tertiary_eg",
          },
          {
            amount: 9870,
            resource: "primary_eg",
          },
          {
            amount: 9870,
            resource: "secondary_eg",
          },
        ],
      },
    },
  ],
};
