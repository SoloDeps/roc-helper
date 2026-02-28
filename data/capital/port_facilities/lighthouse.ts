import { BuildingData } from "@/types/shared";

export const lighthouse: BuildingData = {
  id: "capital-port-facilities-lighthouse",
  name: "Lighthouse",
  category: "capital",
  subcategory: "port_facilities",
  imageName: "Lighthouse_Lv",
  width: 2,
  height: 1,
  levels: [
    {
      level: 1,
      era: "LG",
      max_qty: 5,
      construction: {
        aspers: 75000,
        goods: [
          {
            amount: 2300,
            resource: "lead_glass",
          },
          {
            amount: 2300,
            resource: "fine_jewelry",
          },
          {
            amount: 2300,
            resource: "ointment",
          },
        ],
      },
    },
  ],
};
