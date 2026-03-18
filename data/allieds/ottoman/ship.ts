import { BuildingData } from "@/types/shared";

export const ottomanEmpireShip: BuildingData = {
  id: "ottoman-ship",
  name: "Ottoman Ship",
  category: "ottoman",
  subcategory: "ships",
  imageName: "Ottoman_Empire_Ship_Lv",
  levels: [
    {
      level: 2,
      era: "EG",
      max_qty: 1,
      upgrade: {
        aspers: 30000,
        goods: [
          {
            amount: 1500,
            resource: "primary_eg",
          },
          {
            amount: 1200,
            resource: "secondary_eg",
          },
          {
            amount: 750,
            resource: "tertiary_eg",
          },
          {
            amount: 10000,
            resource: "wheat",
          },
          {
            amount: 10000,
            resource: "pomegranate",
          },
        ],
      },
    },
    {
      level: 3,
      era: "LG",
      max_qty: 1,
      upgrade: {
        aspers: 50000,
        goods: [
          {
            amount: 2000,
            resource: "primary_eg",
          },
          {
            amount: 1500,
            resource: "secondary_eg",
          },
          {
            amount: 1200,
            resource: "tertiary_eg",
          },
          {
            amount: 10000,
            resource: "apricot",
          },
          {
            amount: 10000,
            resource: "mohair",
          },
        ],
      },
    },
    {
      level: 4,
      era: "LG",
      max_qty: 1,
      upgrade: {
        aspers: 120000,
        goods: [
          {
            amount: 1600,
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
          {
            amount: 6000,
            resource: "brocade",
          },
          {
            amount: 6000,
            resource: "tea",
          },
        ],
      },
    },
  ],
};
