import { BuildingData } from "@/types/shared";

export const egyptGoldMine: BuildingData = {
  id: "egypt-gold-mine",
  name: "Gold Mine",
  category: "egypt",
  subcategory: "gold_mine",
  imageName: "Egypt_Gold_Mine_Lv",
  levels: [
    {
      level: 1,
      era: "ME",
      max_qty: 4,
      construction: {
        deben: 1200,
      },
    },
    {
      level: 2,
      era: "ME",
      max_qty: 4,
      upgrade: {
        deben: 9300,
        goods: [
          {
            amount: 42,
            resource: "primary_me",
          },
          {
            amount: 21,
            resource: "secondary_me",
          },
        ],
      },
    },
    {
      level: 3,
      era: "ME",
      max_qty: 4,
      upgrade: {
        deben: 26000,
        goods: [
          {
            amount: 77,
            resource: "secondary_me",
          },
          {
            amount: 38,
            resource: "tertiary_me",
          },
          {
            amount: 58,
            resource: "papyrus_scroll",
          },
          {
            amount: 58,
            resource: "ankh",
          },
        ],
      },
    },
    {
      level: 4,
      era: "CG",
      max_qty: 4,
      upgrade: {
        deben: 41000,
        goods: [
          {
            amount: 220,
            resource: "tertiary_me",
          },
          {
            amount: 115,
            resource: "papyrus_scroll",
          },
          {
            amount: 115,
            resource: "ankh",
          },
        ],
      },
    },
    {
      level: 5,
      era: "CG",
      max_qty: 4,
      upgrade: {
        deben: 53000,
        goods: [
          {
            amount: 51,
            resource: "papyrus_scroll",
          },
          {
            amount: 51,
            resource: "ankh",
          },
          {
            amount: 210,
            resource: "primary_cg",
          },
          {
            amount: 120,
            resource: "ceremonial_dress",
          },
          {
            amount: 120,
            resource: "golden_mask",
          },
        ],
      },
    },
    {
      level: 6,
      era: "CG",
      max_qty: 4,
      upgrade: {
        deben: 71000,
        goods: [
          {
            amount: 22,
            resource: "papyrus_scroll",
          },
          {
            amount: 22,
            resource: "ankh",
          },
          {
            amount: 300,
            resource: "tertiary_cg",
          },
          {
            amount: 200,
            resource: "ceremonial_dress",
          },
          {
            amount: 200,
            resource: "golden_mask",
          },
        ],
      },
    },
  ],
};

export const egyptLuxuriousGoldMine: BuildingData = {
  id: "egypt-lux-gold-mine",
  name: "Luxurious Gold Mine",
  category: "egypt",
  subcategory: "gold_mine",
  imageName: "Egypt_Luxurious_Gold_Mine_Lv",
  levels: [
    {
      level: 3,
      era: "ME",
      max_qty: 3,
      construction: {
        gems: 490,
      },
    },
    {
      level: 6,
      era: "CG",
      max_qty: 3,
      upgrade: {
        gems: 290,
      },
    },
  ],
};
