import { BuildingData } from "@/types/shared";

export const pier: BuildingData = {
  id: "capital-port-facilities-pier",
  name: "Pier",
  category: "capital",
  subcategory: "port_facilities",
  imageName: "Pier_Lv",
  levels: [
    {
      level: 1,
      era: "LG",
      max_qty: 5,
      construction: {
        aspers: 50000,
        goods: [
          {
            amount: 1800,
            resource: "tertiary_eg",
          },
          {
            amount: 1800,
            resource: "primary_eg",
          },
          {
            amount: 1800,
            resource: "secondary_eg",
          },
        ],
      },
    },
  ],
};
