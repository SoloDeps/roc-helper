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
            resource: "primary_ba",
          },
          {
            amount: 92,
            resource: "secondary_ba",
          },
          {
            amount: 92,
            resource: "tertiary_ba",
          },
        ],
      },
      upgrade: {
        coins: 139000,
        food: 83000,
        goods: [
          {
            amount: 44,
            resource: "primary_ba",
          },
          {
            amount: 44,
            resource: "secondary_ba",
          },
          {
            amount: 44,
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
            resource: "primary_cg",
          },
          {
            amount: 1610,
            resource: "secondary_cg",
          },
          {
            amount: 1610,
            resource: "tertiary_cg",
          },
        ],
      },
      upgrade: {
        coins: 980000,
        food: 590000,
        goods: [
          {
            amount: 940,
            resource: "primary_cg",
          },
          {
            amount: 940,
            resource: "secondary_cg",
          },
          {
            amount: 940,
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
            resource: "primary_re",
          },
          {
            amount: 5700,
            resource: "secondary_re",
          },
          {
            amount: 5700,
            resource: "tertiary_re",
          },
        ],
      },
      upgrade: {
        coins: 2350000,
        food: 1520000,
        goods: [
          {
            amount: 1905,
            resource: "primary_re",
          },
          {
            amount: 1905,
            resource: "secondary_re",
          },
          {
            amount: 1905,
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
        coins: 11000000,
        food: 6800000,
        goods: [
          {
            amount: 8650,
            resource: "primary_be",
          },
          {
            amount: 8650,
            resource: "secondary_be",
          },
          {
            amount: 8650,
            resource: "tertiary_be",
          },
        ],
      },
      upgrade: {
        coins: 3600000,
        food: 2190000,
        goods: [
          {
            amount: 2470,
            resource: "primary_be",
          },
          {
            amount: 2470,
            resource: "secondary_be",
          },
          {
            amount: 2470,
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
        coins: 17000000,
        food: 10000000,
        goods: [
          {
            amount: 8675,
            resource: "primary_af",
          },
          {
            amount: 8675,
            resource: "secondary_af",
          },
          {
            amount: 8675,
            resource: "tertiary_af",
          },
        ],
      },
      upgrade: {
        coins: 5000000,
        food: 3050000,
        goods: [
          {
            amount: 3195,
            resource: "primary_af",
          },
          {
            amount: 3195,
            resource: "secondary_af",
          },
          {
            amount: 3195,
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
        coins: 26000000,
        food: 15000000,
        goods: [
          {
            amount: 8700,
            resource: "primary_fa",
          },
          {
            amount: 8700,
            resource: "secondary_fa",
          },
          {
            amount: 8700,
            resource: "tertiary_fa",
          },
        ],
      },
      upgrade: {
        coins: 7100000,
        food: 4200000,
        goods: [
          {
            amount: 3735,
            resource: "primary_fa",
          },
          {
            amount: 3735,
            resource: "secondary_fa",
          },
          {
            amount: 3735,
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
        coins: 36000000,
        food: 21000000,
        goods: [
          {
            amount: 8725,
            resource: "primary_ie",
          },
          {
            amount: 8725,
            resource: "secondary_ie",
          },
          {
            amount: 8725,
            resource: "tertiary_ie",
          },
        ],
      },
      upgrade: {
        coins: 8700000,
        food: 4800000,
        goods: [
          {
            amount: 4245,
            resource: "primary_ie",
          },
          {
            amount: 4245,
            resource: "secondary_ie",
          },
          {
            amount: 4245,
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
        coins: 48000000,
        food: 28000000,
        goods: [
          {
            amount: 8750,
            resource: "primary_ks",
          },
          {
            amount: 8750,
            resource: "secondary_ks",
          },
          {
            amount: 8750,
            resource: "tertiary_ks",
          },
        ],
      },
      upgrade: {
        coins: 10300000,
        food: 5600000,
        goods: [
          {
            amount: 4885,
            resource: "primary_ks",
          },
          {
            amount: 4885,
            resource: "secondary_ks",
          },
          {
            amount: 4885,
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
        coins: 60000000,
        food: 36000000,
        goods: [
          {
            amount: 8875,
            resource: "tertiary_eg",
          },
          {
            amount: 8875,
            resource: "primary_eg",
          },
          {
            amount: 8875,
            resource: "secondary_eg",
          },
        ],
      },
      upgrade: {
        coins: 12000000,
        food: 6200000,
        goods: [
          {
            amount: 6000,
            resource: "primary_hm",
          },
          {
            amount: 6000,
            resource: "secondary_hm",
          },
          {
            amount: 6000,
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
        coins: 72000000,
        food: 44000000,
        goods: [
          {
            amount: 9000,
            resource: "tertiary_lg",
          },
          {
            amount: 9000,
            resource: "primary_lg",
          },
          {
            amount: 9000,
            resource: "secondary_lg",
          },
        ],
      },
      upgrade: {
        coins: 13700000,
        food: 6800000,
        goods: [
          {
            amount: 7115,
            resource: "tertiary_eg",
          },
          {
            amount: 7115,
            resource: "primary_eg",
          },
          {
            amount: 7115,
            resource: "secondary_eg",
          },
        ],
      },
    },
  ],
};
