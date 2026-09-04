import { BuildingData } from "@/types/shared";

export const commonWarehouse: BuildingData = {
  id: "capital-warehouses-common-warehouse",
  name: "Common Warehouse",
  category: "capital",
  subcategory: "warehouses",
  imageName: "Common_Warehouse_Lv",
  levels: [
    {
      level: 1,
      era: "EG",
      max_qty: 9,
      construction: {
        coins: 750000,
        food: 250000,
        goods: [
          {
            amount: 1500,
            resource: "primary_hm",
          },
          {
            amount: 1500,
            resource: "secondary_hm",
          },
          {
            amount: 1500,
            resource: "tertiary_hm",
          },
        ],
      },
    },
    {
      level: 2,
      era: "LG",
      max_qty: 13,
      construction: {
        coins: 1000000,
        aspers: 30000,
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
        ],
      },
      upgrade: {
        aspers: 30000,
        goods: [
          {
            amount: 1000,
            resource: "primary_eg",
          },
          {
            amount: 750,
            resource: "secondary_eg",
          },
          {
            amount: 750,
            resource: "tertiary_eg",
          },
        ],
      },
    },
    {
      level: 3,
      era: "LG",
      max_qty: 13,
      upgrade: {
        aspers: 60000,
        goods: [
          {
            amount: 1500,
            resource: "primary_lg",
          },
          {
            amount: 1000,
            resource: "secondary_lg",
          },
          {
            amount: 1000,
            resource: "tertiary_lg",
          },
        ],
      },
    },
  ],
};
