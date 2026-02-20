import { BuildingData } from "@/types/shared";

// Worker Home
export const vikingWorkerHome: BuildingData = {
  id: "viking-homes-worker-home",
  name: "Worker Home",
  category: "viking",
  subcategory: "homes",
  imageName: "Viking_Worker_Home_Lv",
  levels: [
    {
      level: 1,
      era: "FA",
      max_qty: 30,
      construction: {
        pennies: 1000,
        goods: [
          {
            amount: 235,
            resource: "ink",
          },
          {
            amount: 235,
            resource: "salt",
          },
          {
            amount: 235,
            resource: "cartwheel",
          },
        ],
      },
    },
    {
      level: 2,
      era: "FA",
      max_qty: 30,
      upgrade: {
        pennies: 5000,
        goods: [
          {
            amount: 395,
            resource: "primary_fa",
          },
          {
            amount: 195,
            resource: "secondary_fa",
          },
          {
            amount: 280,
            resource: "ceramic_treasure",
          },
          {
            amount: 120,
            resource: "gold_treasure",
          },
        ],
      },
    },
    {
      level: 3,
      era: "FA",
      max_qty: 30,
      upgrade: {
        pennies: 12000,
        goods: [
          {
            amount: 425,
            resource: "secondary_fa",
          },
          {
            amount: 215,
            resource: "tertiary_fa",
          },
          {
            amount: 560,
            resource: "ceramic_treasure",
          },
          {
            amount: 240,
            resource: "gold_treasure",
          },
        ],
      },
    },
    {
      level: 4,
      era: "IE",
      max_qty: 30,
      upgrade: {
        pennies: 20000,
        goods: [
          {
            amount: 330,
            resource: "tertiary_fa",
          },
          {
            amount: 645,
            resource: "ceramic_treasure",
          },
          {
            amount: 275,
            resource: "gold_treasure",
          },
        ],
      },
    },
    {
      level: 5,
      era: "IE",
      max_qty: 30,
      upgrade: {
        pennies: 27000,
        goods: [
          {
            amount: 270,
            resource: "primary_ie",
          },
          {
            amount: 135,
            resource: "secondary_ie",
          },
          {
            amount: 290,
            resource: "spice_treasure",
          },
          {
            amount: 72,
            resource: "jewel_treasure",
          },
        ],
      },
    },
    {
      level: 6,
      era: "IE",
      max_qty: 30,
      upgrade: {
        pennies: 35000,
        goods: [
          {
            amount: 285,
            resource: "secondary_ie",
          },
          {
            amount: 145,
            resource: "tertiary_ie",
          },
          {
            amount: 575,
            resource: "spice_treasure",
          },
          {
            amount: 145,
            resource: "jewel_treasure",
          },
        ],
      },
    },
  ],
};

// Sailor Home
export const vikingSailorHome: BuildingData = {
  id: "viking-homes-sailor-home",
  name: "Sailor Home",
  category: "viking",
  subcategory: "homes",
  imageName: "Viking_Sailor_Home_Lv",
  levels: [
    {
      level: 1,
      era: "FA",
      max_qty: 20,
      construction: {
        pennies: 3500,
        goods: [
          {
            amount: 470,
            resource: "ink",
          },
          {
            amount: 470,
            resource: "salt",
          },
          {
            amount: 470,
            resource: "cartwheel",
          },
        ],
      },
    },
    {
      level: 2,
      era: "FA",
      max_qty: 20,
      upgrade: {
        pennies: 15000,
        goods: [
          {
            amount: 785,
            resource: "primary_fa",
          },
          {
            amount: 395,
            resource: "secondary_fa",
          },
          {
            amount: 270,
            resource: "ceramic_treasure",
          },
          {
            amount: 330,
            resource: "gold_treasure",
          },
        ],
      },
    },
    {
      level: 3,
      era: "FA",
      max_qty: 20,
      upgrade: {
        pennies: 42000,
        goods: [
          {
            amount: 855,
            resource: "secondary_fa",
          },
          {
            amount: 425,
            resource: "tertiary_fa",
          },
          {
            amount: 540,
            resource: "ceramic_treasure",
          },
          {
            amount: 660,
            resource: "gold_treasure",
          },
        ],
      },
    },
    {
      level: 4,
      era: "IE",
      max_qty: 20,
      upgrade: {
        pennies: 70000,
        goods: [
          {
            amount: 660,
            resource: "tertiary_fa",
          },
          {
            amount: 620,
            resource: "ceramic_treasure",
          },
          {
            amount: 760,
            resource: "gold_treasure",
          },
        ],
      },
    },
    {
      level: 5,
      era: "IE",
      max_qty: 20,
      upgrade: {
        pennies: 96000,
        goods: [
          {
            amount: 535,
            resource: "primary_ie",
          },
          {
            amount: 270,
            resource: "secondary_ie",
          },
          {
            amount: 405,
            resource: "spice_treasure",
          },
          {
            amount: 135,
            resource: "jewel_treasure",
          },
        ],
      },
    },
    {
      level: 6,
      era: "IE",
      max_qty: 20,
      upgrade: {
        pennies: 120000,
        goods: [
          {
            amount: 575,
            resource: "secondary_ie",
          },
          {
            amount: 285,
            resource: "tertiary_ie",
          },
          {
            amount: 810,
            resource: "spice_treasure",
          },
          {
            amount: 270,
            resource: "jewel_treasure",
          },
        ],
      },
    },
  ],
};

// Luxurious Home
export const vikingLuxuriousHome: BuildingData = {
  id: "viking-homes-luxurious-home",
  name: "Luxurious Home",
  category: "viking",
  subcategory: "homes",
  imageName: "Viking_Luxurious_Home_Lv",
  levels: [
    {
      level: 3,
      era: "FA",
      max_qty: 10,
      construction: {
        gems: 990,
      },
    },
    {
      level: 6,
      era: "IE",
      max_qty: 10,
      upgrade: {
        gems: 450,
      },
    },
  ],
};
