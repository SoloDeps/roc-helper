import { BuildingData } from "@/types/shared";

export const infantryBarracks: BuildingData = {
  id: "capital-infantry-barracks",
  name: "Infantry Barracks",
  category: "capital",
  subcategory: "barracks",
  imageName: "Capital_Infantry_Barracks_Lv",
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
            resource: "primary_ba",
          },
          {
            amount: 85,
            resource: "secondary_ba",
          },
          {
            amount: 85,
            resource: "tertiary_ba",
          },
        ],
      },
      upgrade: {
        coins: 111000,
        food: 66000,
        goods: [
          {
            amount: 40,
            resource: "primary_ba",
          },
          {
            amount: 40,
            resource: "secondary_ba",
          },
          {
            amount: 40,
            resource: "tertiary_ba",
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
            resource: "primary_cg",
          },
          {
            amount: 1465,
            resource: "secondary_cg",
          },
          {
            amount: 1465,
            resource: "tertiary_cg",
          },
        ],
      },
      upgrade: {
        coins: 790000,
        food: 470000,
        goods: [
          {
            amount: 855,
            resource: "primary_cg",
          },
          {
            amount: 855,
            resource: "secondary_cg",
          },
          {
            amount: 855,
            resource: "tertiary_cg",
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
            resource: "primary_re",
          },
          {
            amount: 5175,
            resource: "secondary_re",
          },
          {
            amount: 5175,
            resource: "tertiary_re",
          },
        ],
      },
      upgrade: {
        coins: 1870000,
        food: 1210000,
        goods: [
          {
            amount: 1730,
            resource: "primary_re",
          },
          {
            amount: 1730,
            resource: "secondary_re",
          },
          {
            amount: 1730,
            resource: "tertiary_re",
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
            resource: "primary_be",
          },
          {
            amount: 7875,
            resource: "secondary_be",
          },
          {
            amount: 7875,
            resource: "tertiary_be",
          },
        ],
      },
      upgrade: {
        coins: 2930000,
        food: 1750000,
        goods: [
          {
            amount: 2250,
            resource: "primary_be",
          },
          {
            amount: 2250,
            resource: "secondary_be",
          },
          {
            amount: 2250,
            resource: "tertiary_be",
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
            resource: "primary_af",
          },
          {
            amount: 7900,
            resource: "secondary_af",
          },
          {
            amount: 7900,
            resource: "tertiary_af",
          },
        ],
      },
      upgrade: {
        coins: 4000000,
        food: 2400000,
        goods: [
          {
            amount: 2900,
            resource: "primary_af",
          },
          {
            amount: 2900,
            resource: "secondary_af",
          },
          {
            amount: 2900,
            resource: "tertiary_af",
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
            resource: "primary_fa",
          },
          {
            amount: 7925,
            resource: "secondary_fa",
          },
          {
            amount: 7925,
            resource: "tertiary_fa",
          },
        ],
      },
      upgrade: {
        coins: 5700000,
        food: 3400000,
        goods: [
          {
            amount: 3395,
            resource: "primary_fa",
          },
          {
            amount: 3395,
            resource: "secondary_fa",
          },
          {
            amount: 3395,
            resource: "tertiary_fa",
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
            resource: "primary_ie",
          },
          {
            amount: 7950,
            resource: "secondary_ie",
          },
          {
            amount: 7950,
            resource: "tertiary_ie",
          },
        ],
      },
      upgrade: {
        coins: 7100000,
        food: 3800000,
        goods: [
          {
            amount: 3860,
            resource: "primary_ie",
          },
          {
            amount: 3860,
            resource: "secondary_ie",
          },
          {
            amount: 3860,
            resource: "tertiary_ie",
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
            resource: "primary_ks",
          },
          {
            amount: 7975,
            resource: "secondary_ks",
          },
          {
            amount: 7975,
            resource: "tertiary_ks",
          },
        ],
      },
      upgrade: {
        coins: 8300000,
        food: 4500000,
        goods: [
          {
            amount: 4440,
            resource: "primary_ks",
          },
          {
            amount: 4440,
            resource: "secondary_ks",
          },
          {
            amount: 4440,
            resource: "tertiary_ks",
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
            resource: "tertiary_eg",
          },
          {
            amount: 8100,
            resource: "primary_eg",
          },
          {
            amount: 8100,
            resource: "secondary_eg",
          },
        ],
      },
      upgrade: {
        coins: 9500000,
        food: 5200000,
        goods: [
          {
            amount: 5000,
            resource: "primary_hm",
          },
          {
            amount: 5000,
            resource: "secondary_hm",
          },
          {
            amount: 5000,
            resource: "tertiary_hm",
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
            resource: "tertiary_lg",
          },
          {
            amount: 8225,
            resource: "primary_lg",
          },
          {
            amount: 8225,
            resource: "secondary_lg",
          },
        ],
      },
      upgrade: {
        coins: 10700000,
        food: 5900000,
        goods: [
          {
            amount: 5560,
            resource: "tertiary_eg",
          },
          {
            amount: 5560,
            resource: "primary_eg",
          },
          {
            amount: 5560,
            resource: "secondary_eg",
          },
        ],
      },
    },
  ],
};
