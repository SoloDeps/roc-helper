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
            resource: "primary_re",
          },
          {
            amount: 1000,
            resource: "secondary_re",
          },
          {
            amount: 1000,
            resource: "tertiary_re",
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
            resource: "primary_be",
          },
          {
            amount: 4720,
            resource: "secondary_be",
          },
          {
            amount: 4720,
            resource: "tertiary_be",
          },
        ],
      },
      upgrade: {
        coins: 3600000,
        food: 2100000,
        goods: [
          {
            amount: 1350,
            resource: "primary_be",
          },
          {
            amount: 1350,
            resource: "secondary_be",
          },
          {
            amount: 1350,
            resource: "tertiary_be",
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
            resource: "primary_af",
          },
          {
            amount: 4750,
            resource: "secondary_af",
          },
          {
            amount: 4750,
            resource: "tertiary_af",
          },
        ],
      },
      upgrade: {
        coins: 5000000,
        food: 2870000,
        goods: [
          {
            amount: 1740,
            resource: "primary_af",
          },
          {
            amount: 1740,
            resource: "secondary_af",
          },
          {
            amount: 1740,
            resource: "tertiary_af",
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
            resource: "primary_fa",
          },
          {
            amount: 4800,
            resource: "secondary_fa",
          },
          {
            amount: 4800,
            resource: "tertiary_fa",
          },
        ],
      },
      upgrade: {
        coins: 7100000,
        food: 4100000,
        goods: [
          {
            amount: 2035,
            resource: "primary_fa",
          },
          {
            amount: 2035,
            resource: "secondary_fa",
          },
          {
            amount: 2035,
            resource: "tertiary_fa",
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
            resource: "primary_ie",
          },
          {
            amount: 4850,
            resource: "secondary_ie",
          },
          {
            amount: 4850,
            resource: "tertiary_ie",
          },
        ],
      },
      upgrade: {
        coins: 8700000,
        food: 4500000,
        goods: [
          {
            amount: 2315,
            resource: "primary_ie",
          },
          {
            amount: 2315,
            resource: "secondary_ie",
          },
          {
            amount: 2315,
            resource: "tertiary_ie",
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
            resource: "primary_ks",
          },
          {
            amount: 4900,
            resource: "secondary_ks",
          },
          {
            amount: 4900,
            resource: "tertiary_ks",
          },
        ],
      },
      upgrade: {
        coins: 10300000,
        food: 5400000,
        goods: [
          {
            amount: 2665,
            resource: "primary_ks",
          },
          {
            amount: 2665,
            resource: "secondary_ks",
          },
          {
            amount: 2665,
            resource: "tertiary_ks",
          },
        ],
      },
    },
  ],
};
