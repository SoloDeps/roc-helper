import { BuildingData } from "@/types/shared";

export const mayaAverageAviary: BuildingData = {
  id: "maya-average-aviary",
  name: "Average Aviary",
  category: "maya",
  subcategory: "aviary",
  imageName: "Maya_Average_Aviary_Lv",
  levels: [
    {
      level: 1,
      era: "AF",
      max_qty: 4,
      construction: {
        cocoa: 75000,
        goods: [
          {
            amount: 3450,
            resource: "tertiary_be",
          },
          {
            amount: 2170,
            resource: "ancestor_mask",
          },
          {
            amount: 1330,
            resource: "calendar_stone",
          },
        ],
      },
    },
    {
      level: 2,
      era: "AF",
      max_qty: 4,
      upgrade: {
        cocoa: 34000,
        goods: [
          {
            amount: 775,
            resource: "primary_af",
          },
          {
            amount: 385,
            resource: "secondary_af",
          },
          {
            amount: 750,
            resource: "headdress",
          },
          {
            amount: 815,
            resource: "ritual_dagger",
          },
        ],
      },
    },
    {
      level: 3,
      era: "AF",
      max_qty: 4,
      upgrade: {
        cocoa: 45000,
        goods: [
          {
            amount: 845,
            resource: "secondary_af",
          },
          {
            amount: 425,
            resource: "tertiary_af",
          },
          {
            amount: 2155,
            resource: "headdress",
          },
          {
            amount: 2335,
            resource: "ritual_dagger",
          },
        ],
      },
    },
  ],
};

export const mayaLuxuriousAviary: BuildingData = {
  id: "maya-luxurious-aviary",
  name: "Luxurious Aviary",
  category: "maya",
  subcategory: "aviary",
  imageName: "Maya_Luxurious_Aviary",
  levels: [
    {
      level: 1,
      era: "AF",
      max_qty: 1,
      construction: {
        gems: 750,
      },
    },
  ],
};
