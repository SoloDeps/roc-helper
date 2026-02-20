import { BuildingData } from "@/types/shared";

// Coffee Brewer
export const arabiaCoffeeBrewer: BuildingData = {
  id: "arabia-coffee-brewer",
  name: "Coffee Brewer",
  category: "arabia",
  subcategory: "workshops",
  imageName: "Arabia_Coffee_Brewer",
  levels: [
    {
      level: 2,
      era: "KS",
      max_qty: 2,
      construction: {
        dirham: 20000,
        goods: [
          {
            amount: 4180,
            resource: "wax_seal",
          },
          {
            amount: 4180,
            resource: "door",
          },
          {
            amount: 4180,
            resource: "saffron",
          },
        ],
      },
    },
  ],
};

// Incense Maker
export const arabiaIncenseMaker: BuildingData = {
  id: "arabia-incense-maker",
  name: "Incense Maker",
  category: "arabia",
  subcategory: "workshops",
  imageName: "Arabia_Incense_Maker",
  levels: [
    {
      level: 2,
      era: "KS",
      max_qty: 2,
      construction: {
        dirham: 20000,
        goods: [
          {
            amount: 4180,
            resource: "wax_seal",
          },
          {
            amount: 4180,
            resource: "door",
          },
          {
            amount: 4180,
            resource: "saffron",
          },
        ],
      },
    },
  ],
};

// Carpet Factory
export const arabiaCarpetFactory: BuildingData = {
  id: "arabia-carpet-factory",
  name: "Carpet Factory",
  category: "arabia",
  subcategory: "workshops",
  imageName: "Arabia_Carpet_Factory",
  levels: [
    {
      level: 2,
      era: "HM",
      max_qty: 2,
      construction: {
        dirham: 50000,
        goods: [
          {
            amount: 15000,
            resource: "tertiary_ks",
          },
          {
            amount: 6000,
            resource: "coffee",
          },
          {
            amount: 3500,
            resource: "incense",
          },
        ],
      },
    },
  ],
};

// Oil Lamp Crafter
export const arabiaOilLampCrafter: BuildingData = {
  id: "arabia-oil-lamp-crafter",
  name: "Oil Lamp Crafter",
  category: "arabia",
  subcategory: "workshops",
  imageName: "Arabia_Oil_Lamp_Crafter",
  levels: [
    {
      level: 2,
      era: "HM",
      max_qty: 2,
      construction: {
        dirham: 50000,
        goods: [
          {
            amount: 15000,
            resource: "secondary_ks",
          },
          {
            amount: 6000,
            resource: "coffee",
          },
          {
            amount: 3500,
            resource: "incense",
          },
        ],
      },
    },
  ],
};

// Luxurious Workshop
export const arabiaLuxuriousWorkshop: BuildingData = {
  id: "arabia-luxurious-workshop",
  name: "Luxurious Workshop",
  category: "arabia",
  subcategory: "workshops",
  imageName: "Arabia_Luxurious_Workshop_Lv",
  levels: [
    {
      level: 1,
      era: "KS",
      max_qty: 2,
      construction: {
        gems: 890,
      },
    },
    {
      level: 2,
      era: "HM",
      max_qty: 2,
      construction: {
        gems: 1600,
      },
      upgrade: {
        gems: 710,
      },
    },
  ],
};
