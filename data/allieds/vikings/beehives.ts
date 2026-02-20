import { BuildingData } from "@/types/shared";

// Beehive
export const vikingBeehive: BuildingData = {
  id: "vikings-beehive",
  name: "Beehive",
  category: "vikings",
  subcategory: "beehives",
  imageName: "Vikings_Beehive_Lv",
  levels: [
    {
      level: 1,
      era: "FA",
      max_qty: 21,
      construction: {
        pennies: 2000,
        goods: [
          {
            amount: 590,
            resource: "ink",
          },
          {
            amount: 590,
            resource: "salt",
          },
          {
            amount: 590,
            resource: "cartwheel",
          },
        ],
      },
    },
    {
      level: 2,
      era: "FA",
      max_qty: 21,
      upgrade: {
        pennies: 15000,
        goods: [
          {
            amount: 985,
            resource: "primary_fa",
          },
          {
            amount: 490,
            resource: "secondary_fa",
          },
          {
            amount: 225,
            resource: "ceramic_treasure",
          },
          {
            amount: 275,
            resource: "gold_treasure",
          },
        ],
      },
    },
    {
      level: 3,
      era: "FA",
      max_qty: 21,
      upgrade: {
        pennies: 48000,
        goods: [
          {
            amount: 1065,
            resource: "secondary_fa",
          },
          {
            amount: 535,
            resource: "tertiary_fa",
          },
          {
            amount: 450,
            resource: "ceramic_treasure",
          },
          {
            amount: 550,
            resource: "gold_treasure",
          },
        ],
      },
    },
    {
      level: 4,
      era: "IE",
      max_qty: 21,
      upgrade: {
        pennies: 80000,
        goods: [
          {
            amount: 825,
            resource: "tertiary_fa",
          },
          {
            amount: 520,
            resource: "ceramic_treasure",
          },
          {
            amount: 635,
            resource: "gold_treasure",
          },
        ],
      },
    },
    {
      level: 5,
      era: "IE",
      max_qty: 21,
      upgrade: {
        pennies: 110000,
        goods: [
          {
            amount: 675,
            resource: "primary_ie",
          },
          {
            amount: 335,
            resource: "secondary_ie",
          },
          {
            amount: 340,
            resource: "spice_treasure",
          },
          {
            amount: 115,
            resource: "jewel_treasure",
          },
        ],
      },
    },
    {
      level: 6,
      era: "IE",
      max_qty: 21,
      upgrade: {
        pennies: 140000,
        goods: [
          {
            amount: 715,
            resource: "secondary_ie",
          },
          {
            amount: 360,
            resource: "tertiary_ie",
          },
          {
            amount: 675,
            resource: "spice_treasure",
          },
          {
            amount: 225,
            resource: "jewel_treasure",
          },
        ],
      },
    },
  ],
};
