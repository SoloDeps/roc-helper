import { BuildingData } from "@/types/shared";

export const shipyards: BuildingData = {
  id: "capital-ships-shipyards",
  name: "Shipyard",
  category: "capital",
  subcategory: "ships",
  imageName: "Shipyard_Lv",
  levels: [
    {
      level: 1,
      era: "EG",
      max_qty: 10,
      construction: {
        coins: 1500000,
        food: 750000,
        goods: [
          {
            amount: 2500,
            resource: "primary_hm",
          },
          {
            amount: 2500,
            resource: "secondary_hm",
          },
          {
            amount: 2500,
            resource: "tertiary_hm",
          },
        ],
      },
    },
    {
      level: 2,
      era: "LG",
      max_qty: 14,
      construction: {
        goods: [
          { amount: 3000, resource: "confection" },
          { amount: 3000, resource: "syrup" },
          {
            amount: 3800,
            resource: "primary_eg",
          },
          {
            amount: 3200,
            resource: "secondary_eg",
          },
          {
            amount: 3200,
            resource: "tertiary_eg",
          },
        ],
      },
      upgrade: {
        aspers: 80000,
        goods: [
          {
            amount: 1500,
            resource: "tertiary_eg",
          },
          {
            amount: 1500,
            resource: "primary_eg",
          },
          {
            amount: 1500,
            resource: "secondary_eg",
          },
          {
            amount: 3000,
            resource: "confection",
          },
          {
            amount: 3000,
            resource: "syrup",
          },
        ],
      },
    },
  ],
};
