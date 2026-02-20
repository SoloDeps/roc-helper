import { BuildingData } from "@/types/shared";

export const arabiaMerchant: BuildingData = {
  id: "arabia-merchant",
  name: "Merchant",
  category: "arabia",
  subcategory: "merchant",
  imageName: "Arabia_Merchant_Lv",
  levels: [
    {
      level: 1,
      era: "KS",
      max_qty: 16,
      construction: {
        dirham: 7500,
        goods: [
          {
            amount: 1795,
            resource: "wax_seal",
          },
          {
            amount: 1795,
            resource: "door",
          },
          {
            amount: 1795,
            resource: "saffron",
          },
        ],
      },
    },
    {
      level: 2,
      era: "KS",
      max_qty: 16,
      upgrade: {
        dirham: 30000,
        goods: [
          {
            amount: 2245,
            resource: "primary_ks",
          },
          {
            amount: 2245,
            resource: "secondary_ks",
          },
          {
            amount: 1620,
            resource: "coffee",
          },
          {
            amount: 955,
            resource: "incense",
          },
        ],
      },
    },
    {
      level: 3,
      era: "KS",
      max_qty: 16,
      upgrade: {
        dirham: 61000,
        goods: [
          {
            amount: 2395,
            resource: "primary_ks",
          },
          {
            amount: 2395,
            resource: "tertiary_ks",
          },
          {
            amount: 4325,
            resource: "coffee",
          },
          {
            amount: 2540,
            resource: "incense",
          },
        ],
      },
    },
    {
      level: 4,
      era: "HM",
      max_qty: 16,
      upgrade: {
        dirham: 120000,
        goods: [
          {
            amount: 7600,
            resource: "secondary_ks",
          },
          {
            amount: 5000,
            resource: "coffee",
          },
          {
            amount: 3000,
            resource: "incense",
          },
        ],
      },
    },
    {
      level: 5,
      era: "HM",
      max_qty: 16,
      upgrade: {
        dirham: 160000,
        goods: [
          {
            amount: 2700,
            resource: "primary_hm",
          },
          {
            amount: 2700,
            resource: "secondary_hm",
          },
          {
            amount: 500,
            resource: "oil_lamp",
          },
          {
            amount: 300,
            resource: "carpet",
          },
        ],
      },
    },
    {
      level: 6,
      era: "HM",
      max_qty: 16,
      upgrade: {
        dirham: 200000,
        goods: [
          {
            amount: 2900,
            resource: "primary_hm",
          },
          {
            amount: 2900,
            resource: "tertiary_hm",
          },
          {
            amount: 1000,
            resource: "oil_lamp",
          },
          {
            amount: 570,
            resource: "carpet",
          },
        ],
      },
    },
  ],
};

export const arabiaLuxuriousMerchant: BuildingData = {
  id: "arabia-luxurious-merchant",
  name: "Luxurious Merchant",
  category: "arabia",
  subcategory: "merchant",
  imageName: "Arabia_Luxurious_Merchant_Lv",
  levels: [
    {
      level: 3,
      era: "KS",
      max_qty: 4,
      construction: {
        gems: 690,
      },
    },
    {
      level: 6,
      era: "HM",
      max_qty: 4,
      upgrade: {
        gems: 490,
      },
    },
  ],
};
