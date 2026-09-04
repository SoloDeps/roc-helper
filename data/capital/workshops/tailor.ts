import { BuildingData } from "@/types/shared";

export const tailorWorkshop: BuildingData = {
  id: "capital-workshops-tailor",
  name: "Tailor",
  category: "capital",
  subcategory: "workshops",
  imageName: "Capital_Tailor_Lv",
  levels: [
    {
      level: 1,
      era: "BA",
      max_qty: 1,
      construction: {
        coins: 32000,
        food: 18000,
      },
    },
    {
      level: 2,
      era: "ME",
      max_qty: 2,
      construction: {
        coins: 200000,
        food: 110000,
        goods: [
          {
            amount: 52,
            resource: "primary_ba",
          },
          {
            amount: 52,
            resource: "secondary_ba",
          },
          {
            amount: 52,
            resource: "tertiary_ba",
          },
        ],
      },
      upgrade: {
        coins: 139000,
        food: 79000,
        goods: [
          {
            amount: 24,
            resource: "primary_ba",
          },
          {
            amount: 24,
            resource: "secondary_ba",
          },
          {
            amount: 24,
            resource: "tertiary_ba",
          },
        ],
      },
    },
    {
      level: 3,
      era: "CG",
      max_qty: 3,
      construction: {
        coins: 670000,
        food: 380000,
        goods: [
          {
            amount: 795,
            resource: "tertiary_me",
          },
          {
            amount: 230,
            resource: "papyrus_scroll",
          },
          {
            amount: 230,
            resource: "ankh",
          },
        ],
      },
      upgrade: {
        coins: 393000,
        food: 226000,
        goods: [
          {
            amount: 535,
            resource: "tertiary_me",
          },
          {
            amount: 155,
            resource: "papyrus_scroll",
          },
          {
            amount: 155,
            resource: "ankh",
          },
        ],
      },
    },
    {
      level: 4,
      era: "ER",
      max_qty: 4,
      construction: {
        coins: 1800000,
        food: 1100000,
        goods: [
          {
            amount: 880,
            resource: "primary_cg",
          },
          {
            amount: 880,
            resource: "secondary_cg",
          },
          {
            amount: 880,
            resource: "tertiary_cg",
          },
        ],
      },
      upgrade: {
        coins: 980000,
        food: 560000,
        goods: [
          {
            amount: 515,
            resource: "primary_cg",
          },
          {
            amount: 515,
            resource: "secondary_cg",
          },
          {
            amount: 515,
            resource: "tertiary_cg",
          },
        ],
      },
    },
    {
      level: 5,
      era: "RE",
      max_qty: 4,
      construction: {
        coins: 3900000,
        food: 2200000,
        goods: [
          {
            amount: 1500,
            resource: "primary_er",
          },
          {
            amount: 1500,
            resource: "secondary_er",
          },
          {
            amount: 1645,
            resource: "silk",
          },
        ],
      },
      upgrade: {
        coins: 1680000,
        food: 950000,
        goods: [
          {
            amount: 1225,
            resource: "primary_er",
          },
          {
            amount: 1225,
            resource: "secondary_er",
          },
          {
            amount: 1220,
            resource: "silk",
          },
        ],
      },
    },
  ],
};
