import { BuildingData } from "@/types/shared";

export const mayaSmallRitualSite: BuildingData = {
  id: "maya-ritual-sites-small-ritual-site",
  name: "Small Ritual Site",
  category: "maya",
  subcategory: "ritual_sites",
  imageName: "Maya_Small_Ritual_Site",
  levels: [
    {
      level: 1,
      era: "BE",
      max_qty: 7,
      construction: {
        cocoa: 15000,
        goods: [
          {
            amount: 225,
            resource: "cape",
          },
          {
            amount: 225,
            resource: "mosaic",
          },
          {
            amount: 225,
            resource: "goblet",
          },
        ],
      },
    },
  ],
};

export const mayaAverageRitualSite: BuildingData = {
  id: "maya-ritual-sites-average-ritual-site",
  name: "Average Ritual Site",
  category: "maya",
  subcategory: "ritual_sites",
  imageName: "Maya_Average_Ritual_Site",
  levels: [
    {
      level: 1,
      era: "BE",
      max_qty: 7,
      construction: {
        cocoa: 30000,
        goods: [
          {
            amount: 350,
            resource: "cape",
          },
          {
            amount: 350,
            resource: "mosaic",
          },
          {
            amount: 350,
            resource: "goblet",
          },
        ],
      },
    },
  ],
};

export const mayaLuxuriousRitualSite: BuildingData = {
  id: "maya-ritual-sites-luxurious-ritual-site",
  name: "Luxurious Ritual Site",
  category: "maya",
  subcategory: "ritual_sites",
  imageName: "Maya_Luxurious_Ritual_Site",
  levels: [
    {
      level: 1,
      era: "BE",
      max_qty: 3,
      construction: {
        gems: 890,
      },
    },
  ],
};
