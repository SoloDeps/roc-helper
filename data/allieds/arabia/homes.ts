import { BuildingData } from "@/types/shared";

export const arabiaMediumHome: BuildingData = {
  id: "arabia-homes-medium-home",
  name: "Medium Home",
  category: "arabia",
  subcategory: "homes",
  imageName: "Arabia_Medium_Home_Lv",
  levels: [
    {
      level: 1,
      era: "KS",
      max_qty: 26,
      construction: {
        dirham: 2500,
        goods: [
          {
            amount: 840,
            resource: "wax_seal",
          },
          {
            amount: 840,
            resource: "door",
          },
          {
            amount: 840,
            resource: "saffron",
          },
        ],
      },
    },
    {
      level: 2,
      era: "KS",
      max_qty: 26,
      upgrade: {
        dirham: 13000,
        goods: [
          {
            amount: 1050,
            resource: "primary_ks",
          },
          {
            amount: 1050,
            resource: "secondary_ks",
          },
          {
            amount: 755,
            resource: "coffee",
          },
          {
            amount: 445,
            resource: "incense",
          },
        ],
      },
    },
    {
      level: 3,
      era: "KS",
      max_qty: 26,
      upgrade: {
        dirham: 25000,
        goods: [
          {
            amount: 1120,
            resource: "primary_ks",
          },
          {
            amount: 1120,
            resource: "tertiary_ks",
          },
          {
            amount: 2020,
            resource: "coffee",
          },
          {
            amount: 1185,
            resource: "incense",
          },
        ],
      },
    },
    {
      level: 4,
      era: "HM",
      max_qty: 26,
      upgrade: {
        dirham: 50000,
        goods: [
          {
            amount: 3500,
            resource: "secondary_ks",
          },
          {
            amount: 2500,
            resource: "coffee",
          },
          {
            amount: 1500,
            resource: "incense",
          },
        ],
      },
    },
    {
      level: 5,
      era: "HM",
      max_qty: 26,
      upgrade: {
        dirham: 65000,
        goods: [
          {
            amount: 1270,
            resource: "primary_hm",
          },
          {
            amount: 1270,
            resource: "secondary_hm",
          },
          {
            amount: 250,
            resource: "oil_lamp",
          },
          {
            amount: 150,
            resource: "carpet",
          },
        ],
      },
    },
    {
      level: 6,
      era: "HM",
      max_qty: 26,
      upgrade: {
        dirham: 82000,
        goods: [
          {
            amount: 1350,
            resource: "primary_hm",
          },
          {
            amount: 1350,
            resource: "tertiary_hm",
          },
          {
            amount: 450,
            resource: "oil_lamp",
          },
          {
            amount: 260,
            resource: "carpet",
          },
        ],
      },
    },
  ],
};

export const arabiaLuxuriousHome: BuildingData = {
  id: "arabia-homes-luxurious-home",
  name: "Luxurious Home",
  category: "arabia",
  subcategory: "homes",
  imageName: "Arabia_Luxurious_Home_Lv",
  levels: [
    {
      level: 3,
      era: "KS",
      max_qty: 6,
      construction: {
        gems: 790,
      },
    },
    {
      level: 6,
      era: "HM",
      max_qty: 6,
      upgrade: {
        gems: 410,
      },
    },
  ],
};
