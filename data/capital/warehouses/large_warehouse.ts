import { BuildingData } from "@/types/shared";

export const largeWarehouse: BuildingData = {
  id: "capital-warehouses-large-warehouse",
  name: "Large Warehouse",
  category: "capital",
  subcategory: "warehouses",
  imageName: "Large_Warehouse_Lv",
  levels: [
    {
      level: 1,
      era: "EG",
      max_qty: 2,
      construction: {
        gems: 590,
      },
    },
    {
      level: 3,
      era: "LG",
      max_qty: 2,
      construction: {
        gems: 1200,
      },
      upgrade: {
        gems: 610,
      },
    },
  ],
};
