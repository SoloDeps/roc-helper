import { BuildingData } from "@/types/shared";

export const arabiaSmallWell: BuildingData = {
  id: "arabia-irrigation-small-well",
  name: "Small Well",
  category: "arabia",
  subcategory: "irrigation",
  imageName: "Arabia_Small_Well",
  levels: [
    {
      level: 1,
      era: "KS",
      max_qty: 15,
      construction: {
        dirham: 15000,
        goods: [
          {
            amount: 1840,
            resource: "primary_ie",
          },
          {
            amount: 1840,
            resource: "secondary_ie",
          },
          {
            amount: 1840,
            resource: "tertiary_ie",
          },
        ],
      },
    },
  ],
};

export const arabiaChannel: BuildingData = {
  id: "arabia-channel",
  name: "Channel",
  category: "arabia",
  subcategory: "irrigation",
  imageName: "Arabia_Channel",
  levels: [
    {
      level: 1,
      era: "KS",
      max_qty: 10,
      construction: {
        dirham: 35000,
        goods: [
          {
            amount: 2300,
            resource: "primary_ie",
          },
          {
            amount: 2300,
            resource: "secondary_ie",
          },
          {
            amount: 2300,
            resource: "tertiary_ie",
          },
        ],
      },
    },
  ],
};

export const arabiaDeepWeel: BuildingData = {
  id: "arabia-deep-weel",
  name: "Deep Well",
  category: "arabia",
  subcategory: "irrigation",
  imageName: "Arabia_Deep_Well",
  levels: [
    {
      level: 1,
      era: "HM",
      max_qty: 2,
      construction: {
        dirham: 45000,
        goods: [
          {
            amount: 2785,
            resource: "secondary_ks",
          },
          {
            amount: 2785,
            resource: "primary_ks",
          },
          {
            amount: 2785,
            resource: "tertiary_ks",
          },
        ],
      },
    },
  ],
};

export const arabiaLuxuriousNoria: BuildingData = {
  id: "arabia-luxurious-noria",
  name: "Luxurious Noria",
  category: "arabia",
  subcategory: "irrigation",
  imageName: "Arabia_Luxurious_Noria",
  levels: [
    {
      level: 1,
      era: "KS",
      max_qty: 4,
      construction: {
        gems: 590,
      },
    },
  ],
};