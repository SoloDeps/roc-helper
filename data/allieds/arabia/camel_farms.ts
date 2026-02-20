import { BuildingData } from "@/types/shared";

export const arabiaCamelFarm: BuildingData = {
  id: "arabia-camel-farm",
  name: "Camel Farm",
  category: "arabia",
  subcategory: "camel_farms",
  imageName: "Arabia_Camel_Farm",
  levels: [
    {
      level: 1,
      era: "KS",
      max_qty: 10,
      construction: {
        dirham: 10000,
        goods: [
          {
            amount: 2395,
            resource: "wax_seal",
          },
          {
            amount: 2395,
            resource: "door",
          },
          {
            amount: 2395,
            resource: "saffron",
          },
        ],
      },
    },
  ],
};
