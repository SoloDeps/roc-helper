import { BuildingData } from "@/types/shared";

export const chinaRiceFarm: BuildingData = {
  id: "china-rice-farm",
  name: "Rice Farm",
  category: "china",
  subcategory: "rice_farms",
  imageName: "China_Rice_Farm_Lv",
  levels: [
    {
      level: 1,
      era: "ER",
      max_qty: 12,
      construction: {
        wu_zhu: 1000,
        rice: 800,
        goods: [
          {
            amount: 260,
            resource: "toga",
          },
          {
            amount: 260,
            resource: "column",
          },
          {
            amount: 260,
            resource: "silver_ring",
          },
        ],
      },
    },
    {
      level: 2,
      era: "ER",
      max_qty: 12,
      upgrade: {
        wu_zhu: 42000,
        rice: 17000,
        goods: [
          {
            amount: 295,
            resource: "primary_er",
          },
          {
            amount: 150,
            resource: "secondary_er",
          },
          {
            amount: 250,
            resource: "silk",
          },
        ],
      },
    },
    {
      level: 3,
      era: "ER",
      max_qty: 12,
      upgrade: {
        wu_zhu: 63000,
        rice: 26000,
        goods: [
          {
            amount: 345,
            resource: "secondary_er",
          },
          {
            amount: 170,
            resource: "tertiary_er",
          },
          {
            amount: 675,
            resource: "silk",
          },
        ],
      },
    },
    {
      level: 4,
      era: "RE",
      max_qty: 12,
      upgrade: {
        wu_zhu: 94000,
        rice: 38000,
        goods: [
          {
            amount: 225,
            resource: "secondary_er",
          },
          {
            amount: 670,
            resource: "tertiary_er",
          },
          {
            amount: 840,
            resource: "silk",
          },
        ],
      },
    },
    {
      level: 5,
      era: "RE",
      max_qty: 12,
      upgrade: {
        wu_zhu: 120000,
        rice: 62000,
        goods: [
          {
            amount: 260,
            resource: "silk",
          },
          {
            amount: 455,
            resource: "primary_re",
          },
          {
            amount: 225,
            resource: "secondary_re",
          },
          {
            amount: 610,
            resource: "porcelain",
          },
        ],
      },
    },
    {
      level: 6,
      era: "RE",
      max_qty: 12,
      upgrade: {
        wu_zhu: 180000,
        rice: 93000,
        goods: [
          {
            amount: 265,
            resource: "silk",
          },
          {
            amount: 310,
            resource: "secondary_re",
          },
          {
            amount: 460,
            resource: "tertiary_re",
          },
          {
            amount: 625,
            resource: "porcelain",
          },
        ],
      },
    },
  ],
};

export const chinaLuxuriousRiceFarm: BuildingData = {
  id: "china-luxurious-rice-farm",
  name: "Luxurious Rice Farm",
  category: "china",
  subcategory: "rice_farms",
  imageName: "China_Luxurious_Rice_Farm_Lv",
  levels: [
    {
      level: 3,
      era: "ER",
      max_qty: 8,
      construction: {
        gems: 590,
      },
    },
    {
      level: 6,
      era: "RE",
      max_qty: 8,
      upgrade: {
        gems: 390,
      },
    },
  ],
};
