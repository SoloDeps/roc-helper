import { BuildingData } from "@/types/shared";

export const mayaWorkerHome: BuildingData = {
  id: "maya-homes-worker-home",
  name: "Worker Home",
  category: "maya",
  subcategory: "homes",
  imageName: "Maya_Worker_Home_Lv",
  levels: [
    {
      level: 1,
      era: "BE",
      max_qty: 23,
      construction: {
        cocoa: 2500,
        goods: [
          {
            amount: 250,
            resource: "goblet",
          },
          {
            amount: 250,
            resource: "mosaic",
          },
          {
            amount: 250,
            resource: "cape",
          },
        ],
      },
    },
    {
      level: 2,
      era: "BE",
      max_qty: 23,
      upgrade: {
        cocoa: 12000,
        goods: [
          {
            amount: 175,
            resource: "primary_be",
          },
          {
            amount: 87,
            resource: "secondary_be",
          },
          {
            amount: 62,
            resource: "ancestor_mask",
          },
          {
            amount: 38,
            resource: "calendar_stone",
          },
        ],
      },
    },
    {
      level: 3,
      era: "BE",
      max_qty: 23,
      upgrade: {
        cocoa: 16000,
        goods: [
          {
            amount: 190,
            resource: "secondary_be",
          },
          {
            amount: 95,
            resource: "tertiary_be",
          },
          {
            amount: 385,
            resource: "ancestor_mask",
          },
          {
            amount: 235,
            resource: "calendar_stone",
          },
        ],
      },
    },
    {
      level: 4,
      era: "AF",
      max_qty: 23,
      upgrade: {
        cocoa: 23000,
        goods: [
          {
            amount: 450,
            resource: "tertiary_be",
          },
          {
            amount: 405,
            resource: "ancestor_mask",
          },
          {
            amount: 245,
            resource: "calendar_stone",
          },
        ],
      },
    },
    {
      level: 5,
      era: "AF",
      max_qty: 23,
      upgrade: {
        cocoa: 32000,
        goods: [
          {
            amount: 220,
            resource: "primary_af",
          },
          {
            amount: 110,
            resource: "secondary_af",
          },
          {
            amount: 150,
            resource: "headdress",
          },
          {
            amount: 165,
            resource: "ritual_dagger",
          },
        ],
      },
    },
    {
      level: 6,
      era: "AF",
      max_qty: 23,
      upgrade: {
        cocoa: 41000,
        goods: [
          {
            amount: 245,
            resource: "secondary_af",
          },
          {
            amount: 120,
            resource: "tertiary_af",
          },
          {
            amount: 430,
            resource: "headdress",
          },
          {
            amount: 470,
            resource: "ritual_dagger",
          },
        ],
      },
    },
  ],
};

export const mayaPriestHome: BuildingData = {
  id: "maya-homes-priest-home",
  name: "Priest Home",
  category: "maya",
  subcategory: "homes",
  imageName: "Maya_Priest_Home_Lv",
  levels: [
    {
      level: 1,
      era: "BE",
      max_qty: 13,
      construction: {
        cocoa: 5000,
        goods: [
          {
            amount: 500,
            resource: "goblet",
          },
          {
            amount: 500,
            resource: "mosaic",
          },
          {
            amount: 500,
            resource: "cape",
          },
        ],
      },
    },
    {
      level: 2,
      era: "BE",
      max_qty: 13,
      upgrade: {
        cocoa: 44000,
        goods: [
          {
            amount: 345,
            resource: "primary_be",
          },
          {
            amount: 170,
            resource: "secondary_be",
          },
          {
            amount: 250,
            resource: "ancestor_mask",
          },
          {
            amount: 150,
            resource: "calendar_stone",
          },
        ],
      },
    },
    {
      level: 3,
      era: "BE",
      max_qty: 13,
      upgrade: {
        cocoa: 58000,
        goods: [
          {
            amount: 385,
            resource: "secondary_be",
          },
          {
            amount: 190,
            resource: "tertiary_be",
          },
          {
            amount: 1540,
            resource: "ancestor_mask",
          },
          {
            amount: 940,
            resource: "calendar_stone",
          },
        ],
      },
    },
    {
      level: 4,
      era: "AF",
      max_qty: 13,
      upgrade: {
        cocoa: 83000,
        goods: [
          {
            amount: 900,
            resource: "tertiary_be",
          },
          {
            amount: 1610,
            resource: "ancestor_mask",
          },
          {
            amount: 990,
            resource: "calendar_stone",
          },
        ],
      },
    },
    {
      level: 5,
      era: "AF",
      max_qty: 13,
      upgrade: {
        cocoa: 110000,
        goods: [
          {
            amount: 445,
            resource: "primary_af",
          },
          {
            amount: 220,
            resource: "secondary_af",
          },
          {
            amount: 600,
            resource: "headdress",
          },
          {
            amount: 650,
            resource: "ritual_dagger",
          },
        ],
      },
    },
    {
      level: 6,
      era: "AF",
      max_qty: 13,
      upgrade: {
        cocoa: 150000,
        goods: [
          {
            amount: 485,
            resource: "secondary_af",
          },
          {
            amount: 240,
            resource: "tertiary_af",
          },
          {
            amount: 1725,
            resource: "headdress",
          },
          {
            amount: 1870,
            resource: "ritual_dagger",
          },
        ],
      },
    },
  ],
};

export const mayaLuxuriousHome: BuildingData = {
  id: "maya-homes-luxurious-home",
  name: "Luxurious Home",
  category: "maya",
  subcategory: "homes",
  imageName: "Maya_Luxurious_Home_Lv",
  levels: [
    {
      level: 3,
      era: "BE",
      max_qty: 5,
      construction: {
        gems: 990,
      },
    },
    {
      level: 6,
      era: "AF",
      max_qty: 5,
      upgrade: {
        gems: 410,
      },
    },
  ],
};
