import { BuildingData } from "@/types/shared";

export const alchemistWorkshop: BuildingData = {
  id: "capital-workshops-alchemist",
  name: "Alchemist",
  category: "capital",
  subcategory: "workshops",
  imageName: "Capital_Alchemist_Lv",
  levels: [
    {
      level: 1,
      era: "EG",
      max_qty: 3,
      construction: {
        coins: 50000000,
        food: 30000000,
        goods: [
          {
            amount: 5500,
            resource: "primary_hm",
          },
          {
            amount: 5500,
            resource: "secondary_hm",
          },
          {
            amount: 5500,
            resource: "tertiary_hm",
          },
        ],
      },
    },
    {
      level: 2,
      era: "LG",
      max_qty: 3,
      construction: {
        coins: 55000000,
        food: 35000000,
        goods: [
          {
            amount: 5500,
            resource: "tertiary_eg",
          },
          {
            amount: 5500,
            resource: "primary_eg",
          },
          {
            amount: 5500,
            resource: "secondary_eg",
          },
        ],
      },
      upgrade: {
        coins: 12000000,
        food: 7000000,
        goods: [
          {
            amount: 3000,
            resource: "tertiary_eg",
          },
          {
            amount: 3000,
            resource: "primary_eg",
          },
          {
            amount: 3000,
            resource: "secondary_eg",
          },
        ],
      },
    },
  ],
};
