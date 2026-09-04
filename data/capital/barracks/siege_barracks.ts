import { BuildingData } from "@/types/shared";

export const siegeBarracks: BuildingData = {
  id: "capital-siege-barracks",
  name: "Siege Barracks",
  category: "capital",
  subcategory: "barracks",
  imageName: "Capital_Siege_Barracks_Lv",
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
            resource: "primary_re",
          },
          {
            amount: 8925,
            resource: "secondary_re",
          },
          {
            amount: 8925,
            resource: "tertiary_re",
          },
        ],
      },
      upgrade: {
        coins: 3700000,
        food: 2760000,
        goods: [
          {
            amount: 2980,
            resource: "primary_re",
          },
          {
            amount: 2980,
            resource: "secondary_re",
          },
          {
            amount: 2980,
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
        coins: 17000000,
        food: 12000000,
        goods: [
          {
            amount: 13600,
            resource: "primary_be",
          },
          {
            amount: 13600,
            resource: "secondary_be",
          },
          {
            amount: 13600,
            resource: "tertiary_be",
          },
        ],
      },
      upgrade: {
        coins: 5700000,
        food: 4000000,
        goods: [
          {
            amount: 3880,
            resource: "primary_be",
          },
          {
            amount: 3880,
            resource: "secondary_be",
          },
          {
            amount: 3880,
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
        coins: 27000000,
        food: 19000000,
        goods: [
          {
            amount: 13650,
            resource: "primary_af",
          },
          {
            amount: 13650,
            resource: "secondary_af",
          },
          {
            amount: 13650,
            resource: "tertiary_af",
          },
        ],
      },
      upgrade: {
        coins: 7800000,
        food: 5500000,
        goods: [
          {
            amount: 5005,
            resource: "primary_af",
          },
          {
            amount: 5005,
            resource: "secondary_af",
          },
          {
            amount: 5005,
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
        coins: 40000000,
        food: 28000000,
        goods: [
          {
            amount: 13650,
            resource: "primary_fa",
          },
          {
            amount: 13650,
            resource: "secondary_fa",
          },
          {
            amount: 13650,
            resource: "tertiary_fa",
          },
        ],
      },
      upgrade: {
        coins: 11100000,
        food: 7700000,
        goods: [
          {
            amount: 5855,
            resource: "primary_fa",
          },
          {
            amount: 5855,
            resource: "secondary_fa",
          },
          {
            amount: 5855,
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
        coins: 56000000,
        food: 38000000,
        goods: [
          {
            amount: 13700,
            resource: "primary_ie",
          },
          {
            amount: 13700,
            resource: "secondary_ie",
          },
          {
            amount: 13700,
            resource: "tertiary_ie",
          },
        ],
      },
      upgrade: {
        coins: 13700000,
        food: 8500000,
        goods: [
          {
            amount: 6660,
            resource: "primary_ie",
          },
          {
            amount: 6660,
            resource: "secondary_ie",
          },
          {
            amount: 6660,
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
        coins: 76000000,
        food: 50000000,
        goods: [
          {
            amount: 13700,
            resource: "primary_ks",
          },
          {
            amount: 13700,
            resource: "secondary_ks",
          },
          {
            amount: 13700,
            resource: "tertiary_ks",
          },
        ],
      },
      upgrade: {
        coins: 16200000,
        food: 10100000,
        goods: [
          {
            amount: 7660,
            resource: "primary_ks",
          },
          {
            amount: 7660,
            resource: "secondary_ks",
          },
          {
            amount: 7660,
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
        coins: 100000000,
        food: 64000000,
        goods: [
          {
            amount: 14000,
            resource: "tertiary_eg",
          },
          {
            amount: 14000,
            resource: "primary_eg",
          },
          {
            amount: 14000,
            resource: "secondary_eg",
          },
        ],
      },
      upgrade: {
        coins: 18800000,
        food: 11800000,
        goods: [
          {
            amount: 10000,
            resource: "primary_hm",
          },
          {
            amount: 10000,
            resource: "secondary_hm",
          },
          {
            amount: 10000,
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
        coins: 124000000,
        food: 78000000,
        goods: [
          {
            amount: 14300,
            resource: "tertiary_lg",
          },
          {
            amount: 14300,
            resource: "primary_lg",
          },
          {
            amount: 14300,
            resource: "secondary_lg",
          },
        ],
      },
      upgrade: {
        coins: 21400000,
        food: 13500000,
        goods: [
          {
            amount: 12340,
            resource: "tertiary_eg",
          },
          {
            amount: 12340,
            resource: "primary_eg",
          },
          {
            amount: 12340,
            resource: "secondary_eg",
          },
        ],
      },
    },
  ],
};
