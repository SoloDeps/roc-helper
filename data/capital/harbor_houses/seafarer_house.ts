import { BuildingData } from "@/types/shared";

export const seafarerHouse: BuildingData = {
  id: "capital-homes-seafarer-house",
  name: "Seafarer House",
  category: "capital",
  subcategory: "homes",
  imageName: "Seafarer_House_Lv",
  levels: [
    {
      level: 1,
      era: "EG",
      max_qty: 14,
      construction: {
        coins: 250000,
        food: 100000,
        goods: [
          {
            amount: 1000,
            resource: "secretary_desk",
          },
          {
            amount: 1000,
            resource: "grimoire",
          },
          {
            amount: 1000,
            resource: "cinnamon",
          },
        ],
      },
    },
    {
      level: 2,
      era: "EG",
      max_qty: 14,
      upgrade: {
        food: 75000,
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
            amount: 5000,
            resource: "wheat",
          },
          {
            amount: 5000,
            resource: "pomegranate",
          },
        ],
      },
    },
    {
      level: 3,
      era: "LG",
      max_qty: 18,
      construction: {
        coins: 250000,
        food: 100000,
        goods: [
          {
            amount: 3000,
            resource: "primary_eg",
          },
          {
            amount: 2500,
            resource: "secondary_eg",
          },
          {
            amount: 2500,
            resource: "tertiary_eg",
          },
        ],
      },
      upgrade: {
        food: 100000,
        goods: [
          {
            amount: 1200,
            resource: "primary_eg",
          },
          {
            amount: 1000,
            resource: "tertiary_eg",
          },
          {
            amount: 2000,
            resource: "confection",
          },
          {
            amount: 2000,
            resource: "syrup",
          },
        ],
      },
    },
    {
      level: 4,
      era: "LG",
      max_qty: 18,
      upgrade: {
        food: 150000,
        goods: [
          {
            amount: 1000,
            resource: "primary_lg",
          },
          {
            amount: 750,
            resource: "secondary_lg",
          },
          {
            amount: 750,
            resource: "tertiary_lg",
          },
          {
            amount: 2000,
            resource: "apricot",
          },
          {
            amount: 2000,
            resource: "mohair",
          },
        ],
      },
    },
  ],
};
