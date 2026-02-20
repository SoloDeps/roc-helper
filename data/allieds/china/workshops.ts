import { BuildingData } from "@/types/shared";

export const chinaThreadProcessor: BuildingData = {
  id: "thread_processor",
  name: "Thread Processor",
  category: "china",
  subcategory: "thread_processor",
  imageName: "China_Thread_Processor",
  levels: [
    {
      level: 1,
      era: "ER",
      max_qty: 4,
      construction: {
        wu_zhu: 2000,
        rice: 1200,
        goods: [
          {
            amount: 245,
            resource: "toga",
          },
          {
            amount: 245,
            resource: "column",
          },
          {
            amount: 245,
            resource: "silver_ring",
          },
        ],
      },
    },
  ],
};

export const chinaSilkWorkshop: BuildingData = {
  id: "china_silk_workshop",
  name: "Silk Workshop",
  category: "china",
  subcategory: "workshop",
  imageName: "China_Silk_Workshop",
  levels: [
    {
      level: 1,
      era: "ER",
      max_qty: 4,
      construction: {
        wu_zhu: 5000,
        rice: 3000,
        goods: [
          {
            amount: 300,
            resource: "toga",
          },
          {
            amount: 300,
            resource: "column",
          },
          {
            amount: 300,
            resource: "silver_ring",
          },
        ],
      },
    },
  ],
};

export const chinaClayProcessor: BuildingData = {
  id: "china_clay_processor",
  name: "Clay Processor",
  category: "china",
  subcategory: "workshop",
  imageName: "China_Clay_Processor",
  levels: [
    {
      level: 1,
      era: "RE",
      max_qty: 4,
      construction: {
        wu_zhu: 10000,
        rice: 6000,
        goods: [
          {
            amount: 675,
            resource: "secondary_er",
          },
          {
            amount: 675,
            resource: "tertiary_er",
          },
          {
            amount: 500,
            resource: "silk",
          },
        ],
      },
    },
  ],
};

export const chinaPorcelainWorkshop: BuildingData = {
  id: "china_porcelain_workshop",
  name: "Porcelain Workshop",
  category: "china",
  subcategory: "workshop",
  imageName: "China_Porcelain_Workshop",
  levels: [
    {
      level: 1,
      era: "RE",
      max_qty: 4,
      construction: {
        wu_zhu: 20000,
        rice: 14000,
        goods: [
          {
            amount: 900,
            resource: "secondary_er",
          },
          {
            amount: 900,
            resource: "tertiary_er",
          },
          {
            amount: 1000,
            resource: "silk",
          },
        ],
      },
    },
  ],
};
