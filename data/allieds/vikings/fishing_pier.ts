import { BuildingData } from "@/types/shared";

// Fishing Pier
export const vikingFishingPier: BuildingData = {
  id: "viking-fishing-pier",
  name: "Fishing Pier",
  category: "vikings",
  subcategory: "fishing_piers",
  imageName: "Viking_Fishing_Pier_Lv",
  levels: [
    {
      level: 1,
      era: "FA",
      max_qty: 11,
      construction: {
        pennies: 1500,
        goods: [
          {
            amount: 1180,
            resource: "ink",
          },
          {
            amount: 1180,
            resource: "salt",
          },
          {
            amount: 1180,
            resource: "cartwheel",
          },
        ],
      },
    },
    {
      level: 2,
      era: "FA",
      max_qty: 11,
      upgrade: {
        pennies: 20000,
        goods: [
          {
            amount: 1965,
            resource: "primary_fa",
          },
          {
            amount: 985,
            resource: "secondary_fa",
          },
          {
            amount: 525,
            resource: "ceramic_treasure",
          },
          {
            amount: 225,
            resource: "gold_treasure",
          },
        ],
      },
    },
    {
      level: 3,
      era: "FA",
      max_qty: 11,
      upgrade: {
        pennies: 76000,
        goods: [
          {
            amount: 2135,
            resource: "secondary_fa",
          },
          {
            amount: 1065,
            resource: "tertiary_fa",
          },
          {
            amount: 1050,
            resource: "ceramic_treasure",
          },
          {
            amount: 450,
            resource: "gold_treasure",
          },
        ],
      },
    },
    {
      level: 4,
      era: "IE",
      max_qty: 11,
      upgrade: {
        pennies: 130000,
        goods: [
          {
            amount: 1650,
            resource: "tertiary_fa",
          },
          {
            amount: 1210,
            resource: "ceramic_treasure",
          },
          {
            amount: 520,
            resource: "gold_treasure",
          },
        ],
      },
    },
    {
      level: 5,
      era: "IE",
      max_qty: 11,
      upgrade: {
        pennies: 170000,
        goods: [
          {
            amount: 1345,
            resource: "primary_ie",
          },
          {
            amount: 670,
            resource: "secondary_ie",
          },
          {
            amount: 525,
            resource: "spice_treasure",
          },
          {
            amount: 135,
            resource: "jewel_treasure",
          },
        ],
      },
    },
    {
      level: 6,
      era: "IE",
      max_qty: 11,
      upgrade: {
        pennies: 220000,
        goods: [
          {
            amount: 1430,
            resource: "secondary_ie",
          },
          {
            amount: 715,
            resource: "tertiary_ie",
          },
          {
            amount: 1080,
            resource: "spice_treasure",
          },
          {
            amount: 270,
            resource: "jewel_treasure",
          },
        ],
      },
    },
  ],
};

// Luxurious Fishing Pier
export const vikingLuxuriousFishingPier: BuildingData = {
  id: "viking-luxurious-fishing-pier",
  name: "Luxurious Fishing Pier",
  category: "vikings",
  subcategory: "fishing_piers",
  imageName: "Viking_Luxurious_Fishing_Pier_Lv",
  levels: [
    {
      level: 3,
      era: "FA",
      max_qty: 6,
      construction: {
        gems: 650,
      },
    },
    {
      level: 6,
      era: "IE",
      max_qty: 6,
      upgrade: {
        gems: 470,
      },
    },
  ],
};
