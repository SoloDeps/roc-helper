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
      {
        title: "Small Home",
        desc: "Unlocks a Small Home upgrade",
        img: { kind: "wiki", imageName: "Capital_Small_Home_Lv", level: 31 },
      },
      {
        title: "Domestic Farm",
        desc: "Unlocks a Domestic Farm upgrade",
        img: { kind: "wiki", imageName: "Capital_Domestic_Farm_Lv", level: 31 },
      },
      {
        title: "Compact Culture Site",
        desc: "Unlocks a Compact Culture Site upgrade",
        img: {
          kind: "wiki",
          imageName: "Capital_Compact_Culture_Site_Lv",
          level: 11,
        },
      },
      {
        title: "Luxurious Home",
        desc: "Allows constructing 1 more Luxurious Home building in your city",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
      {
        title: "City Hall",
        desc: "Unlocks a Great Hall upgrade",
        img: { kind: "catalog", imgType: "museum", invert: true },
      },
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
    rewards: [
      {
        title: "Rural Farm",
        desc: "Unlocks a Rural Farm upgrade",
        img: { kind: "wiki", imageName: "Capital_Rural_Farm_Lv", level: 31 },
      },
    ],
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
      {
        title: "Primary Workshop",
        desc: "Unlocks a Primary Workshop upgrade",
        img: { kind: "catalog", imgType: "workshop", invert: true },
      },
      {
        title: "Primary Goods",
        desc: "Unlocks the good Primary Goods for you, so that you can produce it in your city",
        img: { kind: "good", priority: "primary" },
      },
      {
        title: "+10000",
        desc: "Increased Trade Token Limit",
        img: {
          kind: "local",
          path: "/images/technos/features/icon_limittradingtokens.webp",
        },
      },
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
      {
        title: "Unlock City",
        desc: "Unlocks Allied Culture Arabia!",
        img: { kind: "catalog", imgType: "arabia" },
      },
      {
        title: "Medium Home",
        desc: "Unlocks the Medium Home",
        img: { kind: "wiki", imageName: "Arabia_Medium_Home_Lv", level: 1 },
      },
      {
        title: "Luxurious Home",
        desc: "Unlocks the Luxurious Home",
        img: { kind: "wiki", imageName: "Arabia_Luxurious_Home_Lv", level: 3 },
      },
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
    rewards: [
      {
        title: "Moderate Culture Site",
        desc: "Unlocks a Moderate Culture Site upgrade",
        img: {
          kind: "wiki",
          imageName: "Capital_Moderate_Culture_Site_Lv",
          level: 11,
        },
      },
    ],
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
    rewards: [
      {
        title: "Infantry Barracks",
        desc: "Unlocks a Infantry Barracks upgrade",
        img: {
          kind: "wiki",
          imageName: "Capital_Infantry_Barracks_Lv",
          level: 11,
        },
      },
    ],
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
      {
        title: "Bazaar Unlocked",
        desc: "New Feature",
        img: {
          kind: "local",
          path: "/images/technos/features/icon_bazaar.webp",
        },
      },
      {
        title: "Merchant",
        desc: "Unlocks the Merchant",
        img: { kind: "wiki", imageName: "Arabia_Merchant_Lv", level: 1 },
      },
      {
        title: "Luxurious Merchant",
        desc: "Unlocks the Luxurious Merchant",
        img: {
          kind: "wiki",
          imageName: "Arabia_Luxurious_Merchant_Lv",
          level: 3,
        },
      },
      {
        title: "Medium Home",
        desc: "Allows constructing 1 more Medium Home building in Arabia",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
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
      {
        title: "Camel Farm",
        desc: "Unlocks the Camel Farm",
        img: { kind: "wiki", imageName: "Arabia_Camel_Farm" },
      },
      {
        title: "Medium Home",
        desc: "Allows constructing 1 more Medium Home building in Arabia",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
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
    rewards: [
      {
        title: "Average Home",
        desc: "Unlocks a Average Home upgrade",
        img: { kind: "wiki", imageName: "Capital_Average_Home_Lv", level: 31 },
      },
    ],
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
      {
        title: "Coffee Brewer",
        desc: "Unlocks the Coffee Brewer",
        img: { kind: "wiki", imageName: "Arabia_Coffee_Brewer" },
      },
      {
        title: "Coffee",
        desc: "Unlocks the good Coffee for you, so that you can produce it in Arabia",
        img: { kind: "local", path: "/images/goods-large/coffee.webp" },
      },
      {
        title: "Medium Home",
        desc: "Allows constructing 1 more Medium Home building in Arabia",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
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
      {
        title: "Incense Maker",
        desc: "Unlocks the Incense Maker",
        img: { kind: "wiki", imageName: "Arabia_Incense_Maker" },
      },
      {
        title: "Incense",
        desc: "Unlocks the good Incense for you, so that you can produce it in Arabia",
        img: { kind: "local", path: "/images/goods-large/incense.webp" },
      },
      {
        title: "Merchant",
        desc: "Allows constructing 1 more Merchant building in Arabia",
        img: { kind: "catalog", imgType: "merchant", invert: true },
      },
      {
        title: "Medium Home",
        desc: "Allows constructing 1 more Medium Home building in Arabia",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
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
      {
        title: "Small Well",
        desc: "Unlocks the Small Well",
        img: { kind: "wiki", imageName: "Arabia_Small_Well" },
      },
      {
        title: "Luxurious Home",
        desc: "Allows constructing 1 more Luxurious Home building in Arabia",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
      {
        title: "Luxurious Noria",
        desc: "Unlocks the Luxurious Noria",
        img: { kind: "wiki", imageName: "Arabia_Luxurious_Noria" },
      },
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
      {
        title: "Domestic Farm",
        desc: "Unlocks a Domestic Farm upgrade",
        img: { kind: "wiki", imageName: "Capital_Domestic_Farm_Lv", level: 32 },
      },
      {
        title: "Domestic Farm",
        desc: "Allows constructing 1 more Domestic Farm building in your city",
        img: { kind: "catalog", imgType: "barn", invert: true },
      },
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
    rewards: [
      {
        title: "Ranged Barracks",
        desc: "Unlocks a Ranged Barracks upgrade",
        img: {
          kind: "wiki",
          imageName: "Capital_Ranged_Barracks_Lv",
          level: 11,
        },
      },
    ],
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
    rewards: [
      {
        title: "Rural Farm",
        desc: "Unlocks a Rural Farm upgrade",
        img: { kind: "wiki", imageName: "Capital_Rural_Farm_Lv", level: 32 },
      },
    ],
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
      {
        title: "Channel",
        desc: "Unlocks the Channel",
        img: { kind: "wiki", imageName: "Arabia_Channel" },
      },
      {
        title: "Medium Home",
        desc: "Allows constructing 1 more Medium Home building in Arabia",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
      {
        title: "Luxurious Workshop",
        desc: "Unlocks the Luxurious Workshop",
        img: {
          kind: "wiki",
          imageName: "Arabia_Luxurious_Workshop_Lv",
          level: 1,
        },
      },
      {
        title: "Bazaar Offer Slot Extension",
        desc: "Unlocks 2 more Bazaar Offer Slots",
        img: {
          kind: "local",
          path: "/images/technos/features/icon_IncreaseBazaarOfferSlotsReward.webp",
        },
      },
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
      {
        title: "Small Home",
        desc: "Unlocks a Small Home upgrade",
        img: { kind: "wiki", imageName: "Capital_Small_Home_Lv", level: 32 },
      },
      {
        title: "Small Home",
        desc: "Allows constructing 1 more Small Home building in your city",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
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
    rewards: [
      {
        title: "Little Culture Site",
        desc: "Unlocks a Little Culture Site upgrade",
        img: {
          kind: "wiki",
          imageName: "Capital_Little_Culture_Site_Lv",
          level: 11,
        },
      },
    ],
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
      {
        title: "Medium Home",
        desc: "Unlocks a Medium Home upgrade",
        img: { kind: "wiki", imageName: "Arabia_Medium_Home_Lv", level: 2 },
      },
      {
        title: "Medium Home",
        desc: "Allows constructing 1 more Medium Home building in Arabia",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
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
      {
        title: "Merchant",
        desc: "Unlocks a Merchant upgrade",
        img: { kind: "wiki", imageName: "Arabia_Merchant_Lv", level: 2 },
      },
      {
        title: "Merchant",
        desc: "Allows constructing 1 more Merchant building in Arabia",
        img: { kind: "catalog", imgType: "merchant", invert: true },
      },
      {
        title: "Small Well",
        desc: "Allows constructing 1 more Small Well building in Arabia",
        img: { kind: "catalog", imgType: "cultureSite", invert: true },
      },
      {
        title: "Bazaar Upgrade",
        desc: "Increase the offered amount of Resources for all Bazaar Offers",
        img: { kind: "local", path: "/images/technos/features/icon_IncreaseBazaarLevelReward.webp" },
      },
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
    rewards: [
      {
        title: "Average Home",
        desc: "Unlocks a Average Home upgrade",
        img: { kind: "wiki", imageName: "Capital_Average_Home_Lv", level: 32 },
      },
    ],
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
      {
        title: "Merchant",
        desc: "Allows constructing 1 more Merchant building in Arabia",
        img: { kind: "catalog", imgType: "merchant", invert: true },
      },
      {
        title: "Camel Farm",
        desc: "Allows constructing 1 more Camel Farm building in Arabia",
        img: { kind: "catalog", imgType: "camelFarm", invert: true },
      },
      {
        title: "Luxurious Home",
        desc: "Allows constructing 2 more Luxurious Home buildings in Arabia",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
      {
        title: "Luxurious Merchant",
        desc: "Allows constructing 2 more Luxurious Merchant buildings in Arabia",
        img: { kind: "catalog", imgType: "merchant", invert: true },
      },
      {
        title: "Bazaar Offer Slot Extension",
        desc: "Unlock 2 more Bazaar Offer Slots",
        img: {
          kind: "local",
          path: "/images/technos/features/icon_IncreaseBazaarOfferSlotsReward.webp",
        },
      },
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
      {
        title: "Medium Home",
        desc: "Allows constructing 1 more Medium Home building in Arabia",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
      {
        title: "Small Well",
        desc: "Allows constructing 1 more Small Well building in Arabia",
        img: { kind: "catalog", imgType: "cultureSite", invert: true },
      },
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
    rewards: [
      {
        title: "Cavalry Barracks",
        desc: "Unlocks a Cavalry Barracks upgrade",
        img: {
          kind: "wiki",
          imageName: "Capital_Cavalry_Barracks_Lv",
          level: 11,
        },
      },
    ],
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
      {
        title: "Incense Maker",
        desc: "Allows constructing 1 more Incense Maker building in Arabia",
        img: { kind: "catalog", imgType: "workshop", invert: true },
      },
      {
        title: "Small Well",
        desc: "Allows constructing 1 more Small Well building in Arabia",
        img: { kind: "catalog", imgType: "cultureSite", invert: true },
      },
      {
        title: "Luxurious Workshop",
        desc: "Allows constructing 1 more Luxurious Workshop building in Arabia",
        img: { kind: "catalog", imgType: "workshop", invert: true },
      },
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
      {
        title: "Coffee Brewer",
        desc: "Allows constructing 1 more Coffee Brewer building in Arabia",
        img: { kind: "catalog", imgType: "workshop", invert: true },
      },
      {
        title: "Channel",
        desc: "Allows constructing 1 more Channel building in Arabia",
        img: { kind: "catalog", imgType: "cultureSite", invert: true },
      },
      {
        title: "Bazaar Offer Slot Extension",
        desc: "Unlocks 2 more Bazaar Offer Slots",
        img: { kind: "local", path: "/images/technos/features/icon_IncreaseBazaarOfferSlotsReward.webp" },
      },
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
    rewards: [
      {
        title: "Domestic Farm",
        desc: "Unlocks a Domestic Farm upgrade",
        img: { kind: "wiki", imageName: "Capital_Domestic_Farm_Lv", level: 33 },
      },
    ],
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
    rewards: [
      {
        title: "Rural Farm",
        desc: "Unlocks a Rural Farm upgrade",
        img: { kind: "wiki", imageName: "Capital_Rural_Farm_Lv", level: 33 },
      },
    ],
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
      {
        title: "Small Well",
        desc: "Allows constructing 1 more Small Well building in Arabia",
        img: { kind: "catalog", imgType: "cultureSite", invert: true },
      },
      {
        title: "Channel",
        desc: "Allows constructing 1 more Channel building in Arabia",
        img: { kind: "catalog", imgType: "cultureSite", invert: true },
      },
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
      {
        title: "Medium Home",
        desc: "Unlocks a Medium Home upgrade",
        img: { kind: "wiki", imageName: "Arabia_Medium_Home_Lv", level: 3 },
      },
      {
        title: "Medium Home",
        desc: "Allows constructing 1 more Medium Home building in Arabia",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
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
      {
        title: "Heavy Infantry Barracks",
        desc: "Unlocks a Heavy Infantry Barracks upgrade",
        img: {
          kind: "wiki",
          imageName: "Capital_Heavy_Infantry_Barracks_Lv",
          level: 11,
        },
      },
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
      {
        title: "Merchant",
        desc: "Unlocks a Merchant upgrade",
        img: { kind: "wiki", imageName: "Arabia_Merchant_Lv", level: 3 },
      },
      {
        title: "Merchant",
        desc: "Allows constructing 1 more Merchant building in Arabia",
        img: { kind: "catalog", imgType: "merchant", invert: true },
      },
      {
        title: "Bazaar Offer Slot Extension",
        desc: "Unlock 1 more Bazaar Offer Slot",
        img: {
          kind: "local",
          path: "/images/technos/features/icon_IncreaseBazaarOfferSlotsReward.webp",
        },
      },
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
      {
        title: "Camel Farm",
        desc: "Allows constructing 1 more Camel Farm building in Arabia",
        img: { kind: "catalog", imgType: "camelFarm", invert: true },
      },
      {
        title: "Medium Home",
        desc: "Allows constructing 1 more Medium Home building in Arabia",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
      {
        title: "Merchant",
        desc: "Allows constructing 1 more Merchant building in Arabia",
        img: { kind: "catalog", imgType: "merchant", invert: true },
      },
      {
        title: "Bazaar Upgrade",
        desc: "Increases the offered amount of Resources for all Bazaar Offers",
        img: { kind: "local", path: "/images/technos/features/icon_IncreaseBazaarLevelReward.webp" },
      },
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
      {
        title: "Average Home",
        desc: "Unlocks a Average Home upgrade",
        img: { kind: "wiki", imageName: "Capital_Average_Home_Lv", level: 33 },
      },
      {
        title: "Average Home",
        desc: "Allows constructing 1 more Average Home building in your city",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
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
      {
        title: "Small Home",
        desc: "Unlocks a Small Home upgrade",
        img: { kind: "wiki", imageName: "Capital_Small_Home_Lv", level: 33 },
      },
      {
        title: "Moderate Culture Site",
        desc: "Allows constructing 1 more Moderate Culture Site building in your city",
        img: { kind: "catalog", imgType: "cultureSite", invert: true },
      },
      {
        title: "Luxurious Culture Site",
        desc: "Allows constructing 1 more Luxurious Culture Site building in your city",
        img: { kind: "catalog", imgType: "cultureSite", invert: true },
      },
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
      {
        title: "Small Well",
        desc: "Allows constructing 1 more Small Well building in Arabia",
        img: { kind: "catalog", imgType: "cultureSite", invert: true },
      },
      {
        title: "Medium Home",
        desc: "Allows constructing 1 more Medium Home building in Arabia",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
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
      {
        title: "Secondary Workshop",
        desc: "Unlocks a Secondary Workshop upgrade",
        img: { kind: "catalog", imgType: "workshop", invert: true },
      },
      {
        title: "Secondary Goods",
        desc: "Unlocks the good Secondary Goods for you, so that you can produce it in your city",
        img: { kind: "good", priority: "secondary" },
      },
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
    rewards: [
      {
        title: "Large Culture Site",
        desc: "Unlocks a Large Culture Site upgrade",
        img: {
          kind: "wiki",
          imageName: "Capital_Large_Culture_Site_Lv",
          level: 11,
        },
      },
    ],
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
      {
        title: "Channel",
        desc: "Allows constructing 1 more Channel building in Arabia",
        img: { kind: "catalog", imgType: "cultureSite", invert: true },
      },
      {
        title: "Camel Farm",
        desc: "Allows constructing 1 more Camel Farm building in Arabia",
        img: { kind: "catalog", imgType: "camelFarm", invert: true },
      },
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
      {
        title: "Medium Home",
        desc: "Allows constructing 1 more Medium Home building in Arabia",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
      {
        title: "Bazaar Offer Slot Extension",
        desc: "Unlock 1 more Bazaar Offer Slot",
        img: {
          kind: "local",
          path: "/images/technos/features/icon_IncreaseBazaarOfferSlotsReward.webp",
        },
      },
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
    rewards: [
      {
        title: "Siege Barracks",
        desc: "Unlocks a Siege Barracks upgrade",
        img: {
          kind: "wiki",
          imageName: "Capital_Siege_Barracks_Lv",
          level: 11,
        },
      },
    ],
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
      {
        title: "Small Well",
        desc: "Allows constructing 1 more Small Well building in Arabia",
        img: { kind: "catalog", imgType: "cultureSite", invert: true },
      },
      {
        title: "Bazaar Offer Slot Extension",
        desc: "Unlock 1 more Bazaar Offer Slot",
        img: {
          kind: "local",
          path: "/images/technos/features/icon_IncreaseBazaarOfferSlotsReward.webp",
        },
      },
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
      {
        title: "Merchant",
        desc: "Allows constructing 1 more Merchant building in Arabia",
        img: { kind: "catalog", imgType: "merchant", invert: true },
      },
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
      {
        title: "Tertiary Workshop",
        desc: "Unlocks a Tertiary Workshop upgrade",
        img: { kind: "catalog", imgType: "workshop", invert: true },
      },
      {
        title: "Tertiary Goods",
        desc: "Unlocks the good Tertiary Goods for you, so that you can produce it in your city",
        img: { kind: "good", priority: "tertiary" },
      },
    ],
  },
];
