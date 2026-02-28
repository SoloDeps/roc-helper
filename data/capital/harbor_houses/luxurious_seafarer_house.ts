import { BuildingData } from "@/types/shared";

export const luxuriousSeafarerHouse: BuildingData = {
  id: "capital-homes-luxurious-seafarer-house",
  name: "Luxurious Seafarer House",
  category: "capital",
  subcategory: "homes",
  imageName: "Luxurious_Seafarer_House_Lv",
  width: 2,
  height: 2,
  levels: [
    {
      level: 1,
      era: "EG",
      max_qty: 2,
      construction: {
        gems: 790,
      },
    },
    {
      level: 3,
      era: "LG",
      max_qty: 2,
      construction: {
        gems: 1500,
      },
      upgrade: {
        gems: 710,
      },
    },
  ],
};
