import { BuildingData } from "@/types/shared";

export const shipyards: BuildingData = {
  id: "capital-ships-shipyards",
  name: "Shipyards",
  category: "capital",
  subcategory: "ships",
  imageName: "Shipyard_Lv",
  width: 5,
  height: 3,
  levels: [
    {
      level: 1,
      era: "EG",
      max_qty: 9,
      construction: {
        coins: 1500000,
        food: 750000,
        goods: [
          {
            amount: 2500,
            resource: "secretary_desk",
          },
          {
            amount: 2500,
            resource: "grimoire",
          },
          {
            amount: 2500,
            resource: "cinnamon",
          },
        ],
      },
    },
    {
      level: 2,
      era: "LG",
      max_qty: 13,
      construction: {
        coins: 1500000,
        food: 750000,
        goods: [
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
            resource: "lead_glass",
          },
          {
            amount: 1500,
            resource: "fine_jewelry",
          },
          {
            amount: 1500,
            resource: "ointment",
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
