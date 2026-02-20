import { BuildingData } from "@/types/shared";

export const jewelerWorkshop: BuildingData = {
  id: "capital-workshops-jeweler",
  name: "Jeweler",
  category: "capital",
  subcategory: "workshops",
  imageName: "Capital_Jeweler_Lv",
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
            resource: "secretary_desk",
          },
          {
            amount: 5500,
            resource: "grimoire",
          },
          {
            amount: 5500,
            resource: "cinnamon",
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
            resource: "lead_glass",
          },
          {
            amount: 5500,
            resource: "fine_jewelry",
          },
          {
            amount: 5500,
            resource: "ointment",
          },
        ],
      },
      upgrade: {
        coins: 12000000,
        food: 7000000,
        goods: [
          {
            amount: 3000,
            resource: "lead_glass",
          },
          {
            amount: 3000,
            resource: "fine_jewelry",
          },
          {
            amount: 3000,
            resource: "ointment",
          },
        ],
      },
    },
  ],
};
