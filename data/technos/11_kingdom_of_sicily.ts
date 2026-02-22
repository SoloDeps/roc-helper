import { TechnoData } from "@/types/shared";

export const technos_KS: TechnoData[] = [
  {
    id: "ks_0",
    name: "Sicilian Villetta",
    column: 0,
    required: [],
    costs: {
      research_points: 81,
      coins: 2200000,
      food: 2400000,
      goods: [
        {
          amount: 9250,
          resource: "tertiary_ie",
        },
        {
          amount: 3970,
          resource: "primary_ie",
        },
      ],
    },
    rewards: [
      "Small Home: Unlocks a Small Home upgrade",
      "Domestic Farm: Unlocks a Domestic Farm upgrade",
      "Compact Culture Site: Unlocks a Compact Culture Site upgrade",
      "Luxurious Home: Allows constructing 1 more Luxurious Home building in your city",
      "City Hall: Unlocks a Great Hall upgrade",
    ],
  },
  {
    id: "ks_1",
    name: "Vegetable Gardens",
    column: 1,
    required: ["ks_0"],
    costs: {
      research_points: 82,
      coins: 4400000,
      food: 2300000,
      goods: [
        {
          amount: 8830,
          resource: "primary_ie",
        },
        {
          amount: 3680,
          resource: "secondary_ie",
        },
        {
          amount: 2940,
          resource: "primary_fa",
        },
      ],
    },
    rewards: ["Rural Farm: Unlocks a Rural Farm upgrade"],
  },
  {
    id: "ks_2",
    name: "Primary Good",
    column: 1,
    required: ["ks_0"],
    costs: {
      research_points: 77,
      coins: 4400000,
      food: 2800000,
      goods: [
        {
          amount: 6900,
          resource: "secondary_ie",
        },
        {
          amount: 2870,
          resource: "tertiary_ie",
        },
        {
          amount: 2870,
          resource: "primary_af",
        },
      ],
    },
    rewards: [
      "Primary Good: Unlocks a Primary Good upgrade",
      "Primary Goods: Unlocks the good Primary Goods for you, so that you can produce it in your city",
      "+10000: Increased Trade Token Limit",
    ],
  },
  {
    id: "ks_3",
    name: "Rise of Arabia",
    column: 1,
    required: ["ks_0"],
    costs: {
      research_points: 105,
      coins: 7500000,
      food: 2800000,
      goods: [
        {
          amount: 9790,
          resource: "tertiary_ie",
        },
        {
          amount: 7000,
          resource: "secondary_af",
        },
      ],
    },
    allied: "arabia",
    rewards: [
      "Unlock City: Unlocks Allied Culture Arabia!",
      "Medium Home: Unlocks the Medium Home",
      "Luxurious Home: Unlocks the Luxurious Home",
    ],
  },
  {
    id: "ks_4",
    name: "Orchards",
    column: 2,
    required: ["ks_1"],
    costs: {
      research_points: 89,
      coins: 2400000,
      food: 2200000,
      goods: [
        {
          amount: 12950,
          resource: "primary_af",
        },
        {
          amount: 2220,
          resource: "primary_ks",
        },
      ],
    },
    rewards: ["Moderate Culture Site: Unlocks a Moderate Culture Site upgrade"],
  },
  {
    id: "ks_5",
    name: "Pedites",
    column: 2,
    required: ["ks_2"],
    costs: {
      research_points: 115,
      coins: 2500000,
      food: 4900000,
      goods: [
        {
          amount: 8170,
          resource: "primary_fa",
        },
        {
          amount: 2560,
          resource: "secondary_ie",
        },
        {
          amount: 1020,
          resource: "secondary_ks",
        },
      ],
    },
    rewards: ["Infantry Barracks: Unlocks a Infantry Barracks upgrade"],
  },
  {
    id: "ks_6",
    name: "Bazaar",
    column: 2,
    required: ["ks_3"],
    costs: {
      research_points: 31,
      coins: 4700000,
      food: 3500000,
      goods: [
        {
          amount: 4070,
          resource: "primary_ks",
        },
        {
          amount: 2540,
          resource: "primary_ie",
        },
        {
          amount: 2030,
          resource: "secondary_fa",
        },
      ],
    },
    allied: "arabia",
    rewards: [
      "Bazaar Unlocked: New Feature",
      "Merchant: Unlocks the Merchant",
      "Luxurious Merchant: Unlocks the Luxurious Merchant",
      "Medium Home: Allows constructing 1 more Medium Home building in your city",
    ],
  },
  {
    id: "ks_7",
    name: "Camel Husbandry",
    column: 2,
    required: ["ks_3"],
    costs: {
      research_points: 21,
      coins: 5300000,
      food: 4700000,
      goods: [
        {
          amount: 7460,
          resource: "secondary_ie",
        },
        {
          amount: 4150,
          resource: "primary_fa",
        },
        {
          amount: 1250,
          resource: "tertiary_ks",
        },
      ],
    },
    allied: "arabia",
    rewards: [
      "Camel Farm: Unlocks the Camel Farm",
      "Medium Home: Allows constructing 1 more Medium Home building in your city",
    ],
  },
  {
    id: "ks_8",
    name: "Improved Roof Tiles",
    column: 3,
    required: ["ks_4", "ks_5"],
    costs: {
      research_points: 95,
      coins: 1800000,
      food: 1600000,
      goods: [
        {
          amount: 5110,
          resource: "secondary_ks",
        },
        {
          amount: 2130,
          resource: "tertiary_ks",
        },
        {
          amount: 3190,
          resource: "secondary_af",
        },
      ],
    },
    rewards: ["Average Home: Unlocks a Average Home upgrade"],
  },
  {
    id: "ks_9",
    name: "Coffee",
    column: 3,
    required: ["ks_6"],
    costs: {
      research_points: 73,
      coins: 2300000,
      food: 1300000,
      goods: [
        {
          amount: 4820,
          resource: "primary_ks",
        },
        {
          amount: 3010,
          resource: "tertiary_ie",
        },
        {
          amount: 2410,
          resource: "tertiary_fa",
        },
      ],
    },
    allied: "arabia",
    rewards: [
      "Coffee Brewer: Unlocks the Coffee Brewer",
      "Coffee: Unlocks the good Coffee for you, so that you can produce it in your city",
      "Medium Home: Allows constructing 1 more Medium Home building in your city",
    ],
  },
  {
    id: "ks_10",
    name: "Incense",
    column: 3,
    required: ["ks_6"],
    costs: {
      research_points: 98,
      coins: 4100000,
      food: 2400000,
      goods: [
        {
          amount: 8130,
          resource: "primary_ie",
        },
        {
          amount: 4520,
          resource: "tertiary_fa",
        },
        {
          amount: 1360,
          resource: "secondary_ks",
        },
      ],
    },
    allied: "arabia",
    rewards: [
      "Incense Maker: Unlocks the Incense Maker",
      "Incense: Unlocks the good Incense for you, so that you can produce it in your city",
      "Merchant: Allows constructing 1 more Merchant building in your city",
      "Medium Home: Allows constructing 1 more Medium Home building in your city",
    ],
  },
  {
    id: "ks_11",
    name: "Basic Irrigation Network",
    column: 3,
    required: ["ks_7"],
    costs: {
      research_points: 96,
      coins: 5500000,
      food: 2300000,
      goods: [
        {
          amount: 4750,
          resource: "tertiary_ks",
        },
        {
          amount: 2970,
          resource: "secondary_ie",
        },
        {
          amount: 2380,
          resource: "primary_fa",
        },
      ],
    },
    allied: "arabia",
    rewards: [
      "Small Well: Unlocks the Small Well",
      "Luxurious Home: Allows constructing 1 more Luxurious Home building in your city",
      "Luxurious Noria: Unlocks the Luxurious Noria",
    ],
  },
  {
    id: "ks_12",
    name: "Windmill",
    column: 4,
    required: ["ks_8"],
    costs: {
      research_points: 77,
      coins: 6700000,
      food: 5100000,
      goods: [
        {
          amount: 5330,
          resource: "secondary_ks",
        },
        {
          amount: 4440,
          resource: "primary_fa",
        },
        {
          amount: 1330,
          resource: "primary_ks",
        },
      ],
    },
    rewards: [
      "Domestic Farm: Unlocks a Domestic Farm upgrade",
      "Domestic Farm: Allows constructing 1 more Domestic Farm building in your city",
    ],
  },
  {
    id: "ks_13",
    name: "Armored Crossbowmen",
    column: 4,
    required: ["ks_8"],
    costs: {
      research_points: 125,
      coins: 5400000,
      food: 5300000,
      goods: [
        {
          amount: 16400,
          resource: "tertiary_be",
        },
        {
          amount: 5690,
          resource: "tertiary_af",
        },
        {
          amount: 1370,
          resource: "tertiary_ks",
        },
      ],
    },
    rewards: ["Ranged Barracks: Unlocks a Ranged Barracks upgrade"],
  },
  {
    id: "ks_14",
    name: "Refined Tools",
    column: 4,
    required: ["ks_8"],
    costs: {
      research_points: 96,
      coins: 2300000,
      food: 5100000,
      goods: [
        {
          amount: 4920,
          resource: "primary_ks",
        },
        {
          amount: 2110,
          resource: "secondary_ks",
        },
        {
          amount: 500,
          resource: "coffee",
        },
      ],
    },
    rewards: ["Rural Farm: Unlocks a Rural Farm upgrade"],
  },
  {
    id: "ks_15",
    name: "Channels",
    column: 4,
    required: ["ks_8", "ks_9", "ks_10", "ks_11"],
    costs: {
      research_points: 110,
      coins: 1800000,
      food: 1800000,
      goods: [
        {
          amount: 4380,
          resource: "tertiary_ks",
        },
        {
          amount: 2740,
          resource: "primary_ie",
        },
        {
          amount: 1100,
          resource: "primary_ks",
        },
      ],
    },
    allied: "arabia",
    rewards: [
      "Channel: Unlocks the Channel",
      "Medium Home: Allows constructing 1 more Medium Home building in your city",
      "Luxurious Workshop: Unlocks the Luxurious Workshop",
      "Bazaar Offer Slot Extension: Unlocks 2 more Bazaar Offer Slots",
    ],
  },
  {
    id: "ks_16",
    name: "Domed Sanctuary",
    column: 5,
    required: ["ks_12", "ks_13", "ks_15"],
    costs: {
      research_points: 105,
      coins: 5800000,
      food: 2900000,
      goods: [
        {
          amount: 4800,
          resource: "primary_ks",
        },
        {
          amount: 3000,
          resource: "tertiary_ie",
        },
        {
          amount: 2400,
          resource: "secondary_fa",
        },
      ],
    },
    rewards: [
      "Small Home: Unlocks a Small Home upgrade",
      "Small Home: Allows constructing 1 more Small Home building in your city",
    ],
  },
  {
    id: "ks_17",
    name: "Polychrome Inlays",
    column: 5,
    required: ["ks_14", "ks_15"],
    costs: {
      research_points: 84,
      coins: 7100000,
      food: 3300000,
      goods: [
        {
          amount: 15450,
          resource: "secondary_be",
        },
        {
          amount: 4290,
          resource: "secondary_fa",
        },
        {
          amount: 1290,
          resource: "secondary_ks",
        },
      ],
    },
    rewards: ["Little Culture Site: Unlocks a Little Culture Site upgrade"],
  },
  {
    id: "ks_18",
    name: "Maskan House",
    column: 5,
    required: ["ks_15"],
    costs: {
      research_points: 81,
      coins: 2700000,
      food: 4600000,
      goods: [
        {
          amount: 5770,
          resource: "secondary_ks",
        },
        {
          amount: 3610,
          resource: "secondary_ie",
        },
        {
          amount: 2890,
          resource: "tertiary_fa",
        },
      ],
    },
    allied: "arabia",
    rewards: [
      "Medium Home: Unlocks a Medium Home upgrade",
      "Medium Home: Allows constructing 1 more Medium Home building in your city",
    ],
  },
  {
    id: "ks_19",
    name: "Improved Market Stands",
    column: 5,
    required: ["ks_15"],
    costs: {
      research_points: 84,
      coins: 5700000,
      food: 1900000,
      goods: [
        {
          amount: 6230,
          resource: "tertiary_ie",
        },
        {
          amount: 1730,
          resource: "primary_ks",
        },
        {
          amount: 1040,
          resource: "tertiary_ks",
        },
      ],
    },
    allied: "arabia",
    rewards: [
      "Merchant: Unlocks a Merchant upgrade",
      "Merchant: Allows constructing 1 more Merchant building in your city",
      "Small Well: Allows constructing 1 more Small Well building in your city",
      "Bazaar Upgrade: Increase the offered amount of Resources for all Bazaar Offers",
    ],
  },
  {
    id: "ks_20",
    name: "Pavilions",
    column: 6,
    required: ["ks_16", "ks_17"],
    costs: {
      research_points: 80,
      coins: 6300000,
      food: 2900000,
      goods: [
        {
          amount: 4800,
          resource: "tertiary_ks",
        },
        {
          amount: 4000,
          resource: "primary_fa",
        },
        {
          amount: 1200,
          resource: "secondary_ks",
        },
      ],
    },
    rewards: ["Average Home: Unlocks a Average Home upgrade"],
  },
  {
    id: "ks_21",
    name: "Fountain Pen",
    column: 6,
    required: ["ks_18"],
    costs: {
      research_points: 97,
      coins: 3900000,
      food: 1800000,
      goods: [
        {
          amount: 5040,
          resource: "secondary_ks",
        },
        {
          amount: 3150,
          resource: "primary_ie",
        },
        {
          amount: 2520,
          resource: "tertiary_fa",
        },
      ],
    },
    allied: "arabia",
    rewards: [
      "Merchant: Allows constructing 1 more Merchant building in your city",
      "Camel Farm: Allows constructing 1 more Camel Farm building in your city",
      "Luxurious Home: Allows constructing 2 more Luxurious Home buildings in your city",
      "Luxurious Merchant: Allows constructing 2 more Luxurious Merchant buildings in your city",
      "Bazaar Offer Slot Extension: Unlock 2 more Bazaar Offer Slots",
    ],
  },
  {
    id: "ks_22",
    name: "Hard Soap",
    column: 6,
    required: ["ks_19"],
    costs: {
      research_points: 86,
      coins: 5700000,
      food: 3100000,
      goods: [
        {
          amount: 5230,
          resource: "primary_ks",
        },
        {
          amount: 5610,
          resource: "primary_af",
        },
        {
          amount: 350,
          resource: "incense",
        },
      ],
    },
    allied: "arabia",
    rewards: [
      "Medium Home: Allows constructing 1 more Medium Home building in your city",
      "Small Well: Allows constructing 1 more Small Well building in your city",
    ],
  },
  {
    id: "ks_23",
    name: "Melites",
    column: 7,
    required: ["ks_20"],
    costs: {
      research_points: 135,
      coins: 2400000,
      food: 4600000,
      goods: [
        {
          amount: 16000,
          resource: "secondary_af",
        },
        {
          amount: 4120,
          resource: "tertiary_ie",
        },
        {
          amount: 2500,
          resource: "coffee",
        },
      ],
    },
    rewards: ["Cavalry Barracks: Unlocks a Cavalry Barracks upgrade"],
  },
  {
    id: "ks_24",
    name: "Law of Cotangents",
    column: 7,
    required: ["ks_21", "ks_22"],
    costs: {
      research_points: 105,
      coins: 6100000,
      food: 4500000,
      goods: [
        {
          amount: 5220,
          resource: "secondary_ks",
        },
        {
          amount: 3260,
          resource: "secondary_ie",
        },
        {
          amount: 2610,
          resource: "primary_fa",
        },
      ],
    },
    allied: "arabia",
    rewards: [
      "Incense Maker: Allows constructing 1 more Incense Maker building in your city",
      "Small Well: Allows constructing 1 more Small Well building in your city",
      "Luxurious Workshop: Allows constructing 1 more Luxurious Workshop building in your city",
    ],
  },
  {
    id: "ks_25",
    name: "Automatic Controls",
    column: 7,
    required: ["ks_21", "ks_22"],
    costs: {
      research_points: 105,
      coins: 4100000,
      food: 3900000,
      goods: [
        {
          amount: 9240,
          resource: "secondary_fa",
        },
        {
          amount: 4810,
          resource: "secondary_af",
        },
        {
          amount: 1160,
          resource: "tertiary_ks",
        },
      ],
    },
    allied: "arabia",
    rewards: [
      "Coffee Brewer: Allows constructing 1 more Coffee Brewer building in your city",
      "Channel: Allows constructing 1 more Channel building in your city",
      "Bazaar Offer Slot Extension: Unlocks 2 more Bazaar Offer Slots",
    ],
  },
  {
    id: "ks_26",
    name: "Improved Sails",
    column: 8,
    required: ["ks_23"],
    costs: {
      research_points: 89,
      coins: 6800000,
      food: 3700000,
      goods: [
        {
          amount: 4510,
          resource: "tertiary_ks",
        },
        {
          amount: 2820,
          resource: "primary_ie",
        },
        {
          amount: 2260,
          resource: "tertiary_fa",
        },
      ],
    },
    rewards: ["Domestic Farm: Unlocks a Domestic Farm upgrade"],
  },
  {
    id: "ks_27",
    name: "Conservation",
    column: 8,
    required: ["ks_23"],
    costs: {
      research_points: 105,
      coins: 5900000,
      food: 1500000,
      goods: [
        {
          amount: 6900,
          resource: "secondary_ie",
        },
        {
          amount: 3830,
          resource: "secondary_fa",
        },
        {
          amount: 1150,
          resource: "primary_ks",
        },
      ],
    },
    rewards: ["Rural Farm: Unlocks a Rural Farm upgrade"],
  },
  {
    id: "ks_28",
    name: "Windpump",
    column: 8,
    required: ["ks_24"],
    costs: {
      research_points: 92,
      coins: 2200000,
      food: 2600000,
      goods: [
        {
          amount: 5840,
          resource: "primary_ks",
        },
        {
          amount: 2440,
          resource: "tertiary_ks",
        },
        {
          amount: 3650,
          resource: "tertiary_af",
        },
      ],
    },
    allied: "arabia",
    rewards: [
      "Small Well: Allows constructing 1 more Small Well building in your city",
      "Channel: Allows constructing 1 more Channel building in your city",
    ],
  },
  {
    id: "ks_29",
    name: "Building Extensions",
    column: 8,
    required: ["ks_25"],
    costs: {
      research_points: 76,
      coins: 3500000,
      food: 3900000,
      goods: [
        {
          amount: 15250,
          resource: "primary_be",
        },
        {
          amount: 3180,
          resource: "secondary_ie",
        },
        {
          amount: 2540,
          resource: "secondary_fa",
        },
      ],
    },
    allied: "arabia",
    rewards: [
      "Medium Home: Unlocks a Medium Home upgrade",
      "Medium Home: Allows constructing 1 more Medium Home building in your city",
    ],
  },
  {
    id: "ks_30",
    name: "Familia Regis",
    column: 9,
    required: ["ks_26", "ks_27", "ks_28"],
    costs: {
      research_points: 140,
      coins: 6400000,
      food: 2300000,
      goods: [
        {
          amount: 5970,
          resource: "secondary_ks",
        },
        {
          amount: 3730,
          resource: "tertiary_ie",
        },
        {
          amount: 1500,
          resource: "primary_ks",
        },
      ],
    },
    rewards: [
      "Heavy Infantry Barracks: Unlocks a Heavy Infantry Barracks upgrade",
    ],
  },
  {
    id: "ks_31",
    name: "Paper Packaging",
    column: 9,
    required: ["ks_28"],
    costs: {
      research_points: 95,
      coins: 2800000,
      food: 3500000,
      goods: [
        {
          amount: 5950,
          resource: "tertiary_ks",
        },
        {
          amount: 4960,
          resource: "tertiary_fa",
        },
        {
          amount: 1490,
          resource: "secondary_ks",
        },
      ],
    },
    allied: "arabia",
    rewards: [
      "Merchant: Unlocks a Merchant upgrade",
      "Merchant: Allows constructing 1 more Merchant building in your city",
      "Bazaar Offer Slot Extension: Unlock 1 more Bazaar Offer Slot",
    ],
  },
  {
    id: "ks_32",
    name: "Market Economics",
    column: 9,
    required: ["ks_29"],
    costs: {
      research_points: 84,
      coins: 1700000,
      food: 2700000,
      goods: [
        {
          amount: 13550,
          resource: "tertiary_af",
        },
        {
          amount: 3480,
          resource: "primary_ie",
        },
        {
          amount: 1800,
          resource: "incense",
        },
      ],
    },
    allied: "arabia",
    rewards: [
      "Camel Farm: Allows constructing 1 more Camel Farm building in your city",
      "Medium Farm: Allows constructing 1 more Medium Farm building in your city",
      "Merchant: Allows constructing 1 more Merchant building in your city",
      "Bazaar Upgrade: Increases the offered amount of Resources for all Bazaar Offers",
    ],
  },
  {
    id: "ks_33",
    name: "Monasteries",
    column: 10,
    required: ["ks_30"],
    costs: {
      research_points: 95,
      coins: 2900000,
      food: 3000000,
      goods: [
        {
          amount: 4930,
          resource: "primary_ks",
        },
        {
          amount: 5140,
          resource: "primary_af",
        },
        {
          amount: 1230,
          resource: "tertiary_ks",
        },
      ],
    },
    rewards: [
      "Average Home: Unlocks a Average Home upgrade",
      "Average Home: Allows constructing 1 more Average Home building in your city",
    ],
  },
  {
    id: "ks_34",
    name: "Marble Decorations",
    column: 10,
    required: ["ks_30"],
    costs: {
      research_points: 110,
      coins: 5800000,
      food: 3300000,
      goods: [
        {
          amount: 5910,
          resource: "tertiary_ks",
        },
        {
          amount: 4920,
          resource: "secondary_fa",
        },
        {
          amount: 2960,
          resource: "primary_fa",
        },
      ],
    },
    rewards: [
      "Small Home: Unlocks a Small Home upgrade",
      "Moderate Culture Site: Allows constructing 1 more Moderate Culture Site building in your city",
      "Luxurious Culture Site: Allows constructing 1 more Luxurious Culture Site building in your city",
    ],
  },
  {
    id: "ks_35",
    name: "Sine Quadrant",
    column: 10,
    required: ["ks_31", "ks_32"],
    costs: {
      research_points: 125,
      coins: 4800000,
      food: 1500000,
      goods: [
        {
          amount: 7030,
          resource: "primary_ie",
        },
        {
          amount: 2930,
          resource: "secondary_ie",
        },
        {
          amount: 1170,
          resource: "primary_ks",
        },
      ],
    },
    allied: "arabia",
    rewards: [
      "Small Well: Allows constructing 1 more Small Well building in your city",
      "Medium Home: Allows constructing 1 more Medium Home building in your city",
    ],
  },
  {
    id: "ks_36",
    name: "Secondary Good",
    column: 11,
    required: ["ks_33", "ks_35"],
    costs: {
      research_points: 80,
      coins: 6100000,
      food: 4300000,
      goods: [
        {
          amount: 6560,
          resource: "secondary_ks",
        },
        {
          amount: 5620,
          resource: "tertiary_fa",
        },
        {
          amount: 5000,
          resource: "coffee",
        },
      ],
    },
    rewards: [
      "Secondary Good: Unlocks a Secondary Good upgrade",
      "Secondary Goods: Unlocks the good Secondary Goods for you, so that you can produce it in your city",
    ],
  },
  {
    id: "ks_37",
    name: "Piazza",
    column: 11,
    required: ["ks_34", "ks_35"],
    costs: {
      research_points: 100,
      coins: 2300000,
      food: 2700000,
      goods: [
        {
          amount: 4490,
          resource: "tertiary_ks",
        },
        {
          amount: 2810,
          resource: "tertiary_ie",
        },
        {
          amount: 1120,
          resource: "secondary_ks",
        },
      ],
    },
    rewards: ["Large Culture Site: Unlocks a Large Culture Site upgrade"],
  },
  {
    id: "ks_38",
    name: "Lusterware",
    column: 11,
    required: ["ks_35"],
    costs: {
      research_points: 105,
      coins: 2800000,
      food: 2700000,
      goods: [
        {
          amount: 13300,
          resource: "tertiary_fa",
        },
        {
          amount: 7130,
          resource: "tertiary_af",
        },
        {
          amount: 3600,
          resource: "incense",
        },
      ],
    },
    allied: "arabia",
    rewards: [
      "Channel: Allows constructing 1 more Channel building in your city",
      "Camel Farm: Allows constructing 1 more Camel Farm building in your city",
    ],
  },
  {
    id: "ks_39",
    name: "Water Clock",
    column: 11,
    required: ["ks_35"],
    costs: {
      research_points: 81,
      coins: 2300000,
      food: 4200000,
      goods: [
        {
          amount: 5350,
          resource: "primary_ks",
        },
        {
          amount: 2230,
          resource: "secondary_ks",
        },
        {
          amount: 2680,
          resource: "secondary_fa",
        },
      ],
    },
    allied: "arabia",
    rewards: [
      "Medium Home: Allows constructing 1 more Medium Home building in your city",
      "Bazaar Offer Slot Extension: Unlock 1 more Bazaar Offer Slot",
    ],
  },
  {
    id: "ks_40",
    name: "Siege Tower",
    column: 12,
    required: ["ks_36", "ks_37"],
    costs: {
      research_points: 145,
      coins: 3400000,
      food: 2000000,
      goods: [
        {
          amount: 5930,
          resource: "tertiary_ks",
        },
        {
          amount: 3820,
          resource: "primary_ie",
        },
      ],
    },
    rewards: ["Siege Barracks: Unlocks a Siege Barracks upgrade"],
  },
  {
    id: "ks_41",
    name: "Magnifying Glass",
    column: 12,
    required: ["ks_38"],
    costs: {
      research_points: 105,
      coins: 2900000,
      food: 3700000,
      goods: [
        {
          amount: 11050,
          resource: "primary_fa",
        },
        {
          amount: 3460,
          resource: "tertiary_ie",
        },
        {
          amount: 2770,
          resource: "tertiary_fa",
        },
      ],
    },
    allied: "arabia",
    rewards: [
      "Small Well: Allows constructing 1 more Small Well building in your city",
      "Bazaar Offer Slot Extension: Unlock 1 more Bazaar Offer Slot",
    ],
  },
  {
    id: "ks_42",
    name: "Astronomical Instruments",
    column: 12,
    required: ["ks_39"],
    costs: {
      research_points: 83,
      coins: 7300000,
      food: 4600000,
      goods: [
        {
          amount: 4980,
          resource: "secondary_ks",
        },
        {
          amount: 2070,
          resource: "primary_ks",
        },
        {
          amount: 1250,
          resource: "tertiary_ks",
        },
      ],
    },
    allied: "arabia",
    rewards: [
      "Merchant: Allows constructing 1 more Merchant building in your city",
    ],
  },
  {
    id: "ks_43",
    name: "Tertiary Good",
    column: 13,
    required: ["ks_40", "ks_41", "ks_42"],
    costs: {
      research_points: 115,
      coins: 5200000,
      food: 4800000,
      goods: [
        {
          amount: 13350,
          resource: "secondary_fa",
        },
        {
          amount: 4300,
          resource: "secondary_ie",
        },
      ],
    },
    rewards: [
      "Tertiary Good: Unlocks a Tertiary Good upgrade",
      "Tertiary Goods: Unlocks the good Tertiary Goods for you, so that you can produce it in your city",
    ],
  },
];
