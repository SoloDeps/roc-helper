import { BuildingData } from "@/types/shared";

export const chinaSmallHome: BuildingData = {
  id: "china-homes-small-home",
  name: "Small Home",
  category: "china",
  subcategory: "homes",
  imageName: "China_Small_Home_Lv",
  levels: [
    {
      level: 1,
      era: "ER",
      max_qty: 25,
      construction: {
        wu_zhu: 80,
        rice: 100,
        goods: [
          {
            amount: 50,
            resource: "toga",
          },
          {
            amount: 50,
            resource: "column",
          },
          {
            amount: 50,
            resource: "silver_ring",
          },
        ],
      },
    },
    {
      level: 2,
      era: "ER",
      max_qty: 25,
      upgrade: {
        wu_zhu: 5600,
        rice: 3400,
        goods: [
          {
            amount: 59,
            resource: "primary_er",
          },
          {
            amount: 30,
            resource: "secondary_er",
          },
          {
            amount: 50,
            resource: "silk",
          },
        ],
      },
    },
    {
      level: 3,
      era: "ER",
      max_qty: 25,
      upgrade: {
        wu_zhu: 8300,
        rice: 5100,
        goods: [
          {
            amount: 70,
            resource: "secondary_er",
          },
          {
            amount: 35,
            resource: "tertiary_er",
          },
          {
            amount: 135,
            resource: "silk",
          },
        ],
      },
    },
    {
      level: 4,
      era: "RE",
      max_qty: 25,
      upgrade: {
        wu_zhu: 12000,
        rice: 7600,
        goods: [
          {
            amount: 45,
            resource: "secondary_er",
          },
          {
            amount: 135,
            resource: "tertiary_er",
          },
          {
            amount: 170,
            resource: "silk",
          },
        ],
      },
    },
    {
      level: 5,
      era: "RE",
      max_qty: 25,
      upgrade: {
        wu_zhu: 16000,
        rice: 12000,
        goods: [
          {
            amount: 52,
            resource: "silk",
          },
          {
            amount: 90,
            resource: "primary_re",
          },
          {
            amount: 45,
            resource: "secondary_re",
          },
          {
            amount: 125,
            resource: "porcelain",
          },
        ],
      },
    },
    {
      level: 6,
      era: "RE",
      max_qty: 25,
      upgrade: {
        wu_zhu: 24000,
        rice: 18000,
        goods: [
          {
            amount: 54,
            resource: "silk",
          },
          {
            amount: 62,
            resource: "secondary_re",
          },
          {
            amount: 93,
            resource: "tertiary_re",
          },
          {
            amount: 125,
            resource: "porcelain",
          },
        ],
      },
    },
  ],
};

export const chinaAverageHome: BuildingData = {
  id: "china-homes-average-home",
  name: "Average Home",
  category: "china",
  subcategory: "homes",
  imageName: "China_Average_Home_Lv",
  levels: [
    {
      level: 1,
      era: "ER",
      max_qty: 8,
      construction: {
        wu_zhu: 480,
        rice: 600,
        goods: [
          {
            amount: 210,
            resource: "toga",
          },
          {
            amount: 210,
            resource: "column",
          },
          {
            amount: 210,
            resource: "silver_ring",
          },
        ],
      },
    },
    {
      level: 2,
      era: "ER",
      max_qty: 8,
      upgrade: {
        wu_zhu: 20000,
        rice: 14000,
        goods: [
          {
            amount: 235,
            resource: "primary_er",
          },
          {
            amount: 120,
            resource: "secondary_er",
          },
          {
            amount: 200,
            resource: "silk",
          },
        ],
      },
    },
    {
      level: 3,
      era: "ER",
      max_qty: 8,
      upgrade: {
        wu_zhu: 30000,
        rice: 20000,
        goods: [
          {
            amount: 275,
            resource: "secondary_er",
          },
          {
            amount: 140,
            resource: "tertiary_er",
          },
          {
            amount: 540,
            resource: "silk",
          },
        ],
      },
    },
    {
      level: 4,
      era: "RE",
      max_qty: 8,
      upgrade: {
        wu_zhu: 45000,
        rice: 30000,
        goods: [
          {
            amount: 180,
            resource: "secondary_er",
          },
          {
            amount: 535,
            resource: "tertiary_er",
          },
          {
            amount: 670,
            resource: "silk",
          },
        ],
      },
    },
    {
      level: 5,
      era: "RE",
      max_qty: 8,
      upgrade: {
        wu_zhu: 57000,
        rice: 49000,
        goods: [
          {
            amount: 210,
            resource: "silk",
          },
          {
            amount: 365,
            resource: "primary_re",
          },
          {
            amount: 180,
            resource: "secondary_re",
          },
          {
            amount: 485,
            resource: "porcelain",
          },
        ],
      },
    },
    {
      level: 6,
      era: "RE",
      max_qty: 8,
      upgrade: {
        wu_zhu: 85000,
        rice: 74000,
        goods: [
          {
            amount: 215,
            resource: "silk",
          },
          {
            amount: 245,
            resource: "secondary_re",
          },
          {
            amount: 370,
            resource: "tertiary_re",
          },
          {
            amount: 495,
            resource: "porcelain",
          },
        ],
      },
    },
  ],
};

export const chinaLuxuriousHome: BuildingData = {
  id: "china-homes-luxurious-home",
  name: "Luxurious Home",
  category: "china",
  subcategory: "homes",
  imageName: "China_Luxurious_Home_Lv",
  levels: [
    {
      level: 3,
      era: "ER",
      max_qty: 11,
      construction: {
        gems: 850,
      },
    },
    {
      level: 6,
      era: "RE",
      max_qty: 11,
      upgrade: {
        gems: 390,
      },
    },
  ],
};
