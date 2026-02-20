import { BuildingData } from "@/types/shared";

export const mayaObsidianQuarry: BuildingData = {
  id: "maya-quarries-obsidian-quarry",
  name: "Obsidian Quarry",
  category: "maya",
  subcategory: "quarries",
  imageName: "Maya_Obsidian_Quarry_Lv",
  levels: [
    {
      level: 1,
      era: "BE",
      max_qty: 5,
      construction: {
        cocoa: 10000,
        goods: [
          {
            amount: 625,
            resource: "goblet",
          },
          {
            amount: 625,
            resource: "mosaic",
          },
          {
            amount: 625,
            resource: "cape",
          },
        ],
      },
    },
    {
      level: 2,
      era: "BE",
      max_qty: 5,
      upgrade: {
        cocoa: 92000,
        goods: [
          {
            amount: 430,
            resource: "primary_be",
          },
          {
            amount: 215,
            resource: "secondary_be",
          },
          {
            amount: 310,
            resource: "ancestor_mask",
          },
          {
            amount: 190,
            resource: "calendar_stone",
          },
        ],
      },
    },
    {
      level: 3,
      era: "BE",
      max_qty: 5,
      upgrade: {
        cocoa: 120000,
        goods: [
          {
            amount: 475,
            resource: "secondary_be",
          },
          {
            amount: 240,
            resource: "tertiary_be",
          },
          {
            amount: 1920,
            resource: "ancestor_mask",
          },
          {
            amount: 1180,
            resource: "calendar_stone",
          },
        ],
      },
    },
    {
      level: 4,
      era: "AF",
      max_qty: 5,
      upgrade: {
        cocoa: 180000,
        goods: [
          {
            amount: 1125,
            resource: "tertiary_be",
          },
          {
            amount: 2015,
            resource: "ancestor_mask",
          },
          {
            amount: 1235,
            resource: "calendar_stone",
          },
        ],
      },
    },
    {
      level: 5,
      era: "AF",
      max_qty: 5,
      upgrade: {
        cocoa: 240000,
        goods: [
          {
            amount: 555,
            resource: "primary_af",
          },
          {
            amount: 275,
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
      level: 6,
      era: "AF",
      max_qty: 5,
      upgrade: {
        cocoa: 310000,
        goods: [
          {
            amount: 605,
            resource: "secondary_af",
          },
          {
            amount: 305,
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

export const mayaJadeQuarry: BuildingData = {
  id: "maya-quarries-jade-quarry",
  name: "Jade Quarry",
  category: "maya",
  subcategory: "quarries",
  imageName: "Maya_Jade_Quarry_Lv",
  levels: [
    {
      level: 1,
      era: "BE",
      max_qty: 5,
      construction: {
        cocoa: 10000,
        goods: [
          {
            amount: 625,
            resource: "goblet",
          },
          {
            amount: 625,
            resource: "mosaic",
          },
          {
            amount: 625,
            resource: "cape",
          },
        ],
      },
    },
    {
      level: 2,
      era: "BE",
      max_qty: 5,
      upgrade: {
        cocoa: 92000,
        goods: [
          {
            amount: 430,
            resource: "primary_be",
          },
          {
            amount: 215,
            resource: "secondary_be",
          },
          {
            amount: 310,
            resource: "ancestor_mask",
          },
          {
            amount: 190,
            resource: "calendar_stone",
          },
        ],
      },
    },
    {
      level: 3,
      era: "BE",
      max_qty: 5,
      upgrade: {
        cocoa: 120000,
        goods: [
          {
            amount: 475,
            resource: "secondary_be",
          },
          {
            amount: 240,
            resource: "tertiary_be",
          },
          {
            amount: 1920,
            resource: "ancestor_mask",
          },
          {
            amount: 1180,
            resource: "calendar_stone",
          },
        ],
      },
    },
    {
      level: 4,
      era: "AF",
      max_qty: 5,
      upgrade: {
        cocoa: 180000,
        goods: [
          {
            amount: 1125,
            resource: "tertiary_be",
          },
          {
            amount: 2015,
            resource: "ancestor_mask",
          },
          {
            amount: 1235,
            resource: "calendar_stone",
          },
        ],
      },
    },
    {
      level: 5,
      era: "AF",
      max_qty: 5,
      upgrade: {
        cocoa: 240000,
        goods: [
          {
            amount: 555,
            resource: "primary_af",
          },
          {
            amount: 275,
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
      level: 6,
      era: "AF",
      max_qty: 5,
      upgrade: {
        cocoa: 310000,
        goods: [
          {
            amount: 605,
            resource: "secondary_af",
          },
          {
            amount: 305,
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

export const mayaLuxuriousQuarry: BuildingData = {
  id: "maya-quarries-luxurious-quarry",
  name: "Luxurious Quarry",
  category: "maya",
  subcategory: "quarries",
  imageName: "Maya_Luxurious_Quarry_Lv",
  levels: [
    {
      level: 3,
      era: "BE",
      max_qty: 2,
      construction: {
        gems: 590,
      },
    },
    {
      level: 6,
      era: "AF",
      max_qty: 2,
      upgrade: {
        gems: 450,
      },
    },
  ],
};
