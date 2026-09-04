import { BuildingData } from "@/types/shared";

// Tavern
export const vikingTavern: BuildingData = {
  id: "viking-tavern",
  name: "Tavern",
  category: "viking",
  subcategory: "tavern",
  imageName: "Viking_Tavern_Lv",
  levels: [
    {
      level: 1,
      era: "FA",
      max_qty: 5,
      construction: {
        pennies: 4000,
        goods: [
          {
            amount: 885,
            resource: "secondary_af",
          },
          {
            amount: 885,
            resource: "tertiary_af",
          },
          {
            amount: 885,
            resource: "primary_af",
          },
        ],
      },
    },
    {
      level: 2,
      era: "IE",
      max_qty: 9,
      upgrade: {
        pennies: 182000,
        goods: [
          {
            amount: 2720,
            resource: "secondary_af",
          },
          {
            amount: 2720,
            resource: "tertiary_af",
          },
          {
            amount: 2720,
            resource: "primary_af",
          },
        ],
      },
    },
  ],
};

// Expedition Pier
export const vikingExpeditionPier: BuildingData = {
  id: "viking-expedition-pier",
  name: "Expedition Pier",
  category: "viking",
  subcategory: "expedition-pier",
  imageName: "Viking_Expedition_Pier",
  levels: [
    {
      level: 1,
      era: "FA",
      max_qty: 3,
      construction: {
        pennies: 7500,
        goods: [
          {
            amount: 1770,
            resource: "secondary_af",
          },
          {
            amount: 1770,
            resource: "tertiary_af",
          },
          {
            amount: 1770,
            resource: "primary_af",
          },
        ],
      },
    },
  ],
};

// Sailor Port
export const vikingSailorPort: BuildingData = {
  id: "viking-sailor-port",
  name: "Sailor Port",
  category: "viking",
  subcategory: "sailor-port",
  imageName: "Viking_Sailor_Port",
  levels: [
    {
      level: 1,
      era: "IE",
      max_qty: 3,
      construction: {
        pennies: 50000,
        goods: [
          {
            amount: 2250,
            resource: "tertiary_fa",
          },
        ],
      },
    },
  ],
};

// Luxurious Sailor Port
export const vikingLuxuriousSailorPort: BuildingData = {
  id: "viking-luxurious-sailor-port",
  name: "Luxurious Sailor Port",
  category: "viking",
  subcategory: "luxurious-sailor-port",
  imageName: "Viking_Luxurious_Sailor_Port_Lv",
  levels: [
    {
      level: 1,
      era: "FA",
      max_qty: 2,
      construction: {
        gems: 890,
      },
    },
    {
      level: 2,
      era: "IE",
      max_qty: 4,
      construction: {
        gems: 1600,
      },
      upgrade: {
        gems: 710,
      },
    },
  ],
};
