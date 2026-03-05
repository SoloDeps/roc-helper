import { TechnoData } from "@/types/shared";

export const technos_HM: TechnoData[] = [
  {
    id: "hm_0",
    name: "Sandstone Foundations",
    column: 0,
    required: [],
    costs: {
      research_points: 84,
      coins: 2600000,
      food: 2800000,
      goods: [
        {
          amount: 10000,
          resource: "tertiary_ks",
        },
        {
          amount: 4350,
          resource: "primary_ks",
        },
        {
          amount: 1500,
          resource: "coffee",
        },
      ],
    },
    rewards: [
      {
        title: "Small Home",
        desc: "Unlocks the Small Home",
        img: { kind: "wiki", imageName: "Capital_Small_Home_Lv", level: 34 },
      },
      {
        title: "Rural Farm",
        desc: "Unlocks a Rural Farm upgrade",
        img: { kind: "wiki", imageName: "Capital_Rural_Farm_Lv", level: 34 },
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
    id: "hm_1",
    name: "Clearing",
    column: 1,
    required: ["hm_0"],
    costs: {
      research_points: 89,
      coins: 5100000,
      food: 2600000,
      goods: [
        {
          amount: 9850,
          resource: "primary_ks",
        },
        {
          amount: 4100,
          resource: "secondary_ks",
        },
        {
          amount: 3300,
          resource: "primary_ie",
        },
      ],
    },
    rewards: [
      {
        title: "Compact Culture Site",
        desc: "Unlocks a Compact Culture Site upgrade",
        img: {
          kind: "wiki",
          imageName: "Capital_Compact_Culture_Site_Lv",
          level: 12,
        },
      },
      {
        title: "Domestic Farm",
        desc: "Unlocks a Domestic Farm upgrade",
        img: { kind: "wiki", imageName: "Capital_Domestic_Farm_Lv", level: 34 },
      },
    ],
  },
  {
    id: "hm_2",
    name: "Infantrymen",
    column: 1,
    required: ["hm_0"],
    costs: {
      research_points: 145,
      coins: 5100000,
      food: 3200000,
      goods: [
        {
          amount: 7800,
          resource: "secondary_ks",
        },
        {
          amount: 3250,
          resource: "tertiary_ks",
        },
        {
          amount: 3250,
          resource: "primary_fa",
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
          level: 12,
        },
      },
    ],
  },
  {
    id: "hm_3",
    name: "Early Medicine",
    column: 1,
    required: ["hm_0"],
    costs: {
      research_points: 115,
      coins: 8700000,
      food: 3100000,
      goods: [
        {
          amount: 11000,
          resource: "tertiary_ks",
        },
        {
          amount: 7950,
          resource: "secondary_fa",
        },
        {
          amount: 3000,
          resource: "incense",
        },
      ],
    },
    allied: "arabia",
    rewards: [
      {
        title: "Medium Home",
        desc: "Unlocks a Medium Home upgrade",
        img: { kind: "wiki", imageName: "Arabia_Medium_Home_Lv", level: 4 },
      },
      {
        title: "Medium Home",
        desc: "Allows constructing 1 more Medium Home building in Arabia",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
      {
        title: "Arabia City Hall",
        desc: "Unlocks a Great Hall upgrade",
        img: { kind: "catalog", imgType: "museum", invert: true },
      },
    ],
  },
  {
    id: "hm_4",
    name: "Enhanced Timber Framing",
    column: 2,
    required: ["hm_1"],
    costs: {
      research_points: 56,
      coins: 2800000,
      food: 2500000,
      goods: [
        {
          amount: 14500,
          resource: "primary_fa",
        },
        {
          amount: 2500,
          resource: "primary_hm",
        },
        {
          amount: 2000,
          resource: "coffee",
        },
      ],
    },
    rewards: [
      {
        title: "Average Home",
        desc: "Unlocks a Average Home upgrade",
        img: { kind: "wiki", imageName: "Capital_Average_Home_Lv", level: 34 },
      },
    ],
  },
  {
    id: "hm_5",
    name: "Primary Good",
    column: 2,
    required: ["hm_2"],
    costs: {
      research_points: 125,
      coins: 2900000,
      food: 5600000,
      goods: [
        {
          amount: 9250,
          resource: "primary_ie",
        },
        {
          amount: 2900,
          resource: "secondary_ks",
        },
        {
          amount: 1150,
          resource: "secondary_hm",
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
    id: "hm_6",
    name: "Central Bazaars",
    column: 2,
    required: ["hm_3"],
    costs: {
      research_points: 34,
      coins: 5500000,
      food: 4000000,
      goods: [
        {
          amount: 4600,
          resource: "primary_hm",
        },
        {
          amount: 2900,
          resource: "primary_ks",
        },
        {
          amount: 2300,
          resource: "secondary_ie",
        },
      ],
    },
    allied: "arabia",
    rewards: [
      {
        title: "Merchant",
        desc: "Unlocks a Merchant upgrade",
        img: { kind: "wiki", imageName: "Arabia_Merchant_Lv", level: 4 },
      },
      {
        title: "Camel Farm",
        desc: "Allows constructing 1 more Camel Farm building in Arabia",
        img: { kind: "catalog", imgType: "camelFarm", invert: true },
      },
      {
        title: "Bazaar Upgrade",
        desc: "Increases the offered amount of Resources for all Bazaar Offers",
        img: { kind: "local", path: "/images/technos/features/icon_IncreaseBazaarLevelReward.webp" },
      },
    ],
  },
  {
    id: "hm_7",
    name: "Religious Orders",
    column: 3,
    required: ["hm_4", "hm_5"],
    costs: {
      research_points: 22,
      coins: 6200000,
      food: 5300000,
      goods: [
        {
          amount: 8450,
          resource: "secondary_ks",
        },
        {
          amount: 4700,
          resource: "primary_ie",
        },
        {
          amount: 1400,
          resource: "tertiary_hm",
        },
      ],
    },
    rewards: [
      {
        title: "Rural Farm",
        desc: "Unlocks a Rural Farm upgrade",
        img: { kind: "wiki", imageName: "Capital_Rural_Farm_Lv", level: 35 },
      },
      {
        title: "Rural Farm",
        desc: "Allows constructing 1 more Rural Farm building in your city",
        img: { kind: "catalog", imgType: "barn", invert: true },
      },
    ],
  },
  {
    id: "hm_8",
    name: "Arbalest Weapons",
    column: 3,
    required: ["hm_5"],
    costs: {
      research_points: 155,
      coins: 2100000,
      food: 1800000,
      goods: [
        {
          amount: 5800,
          resource: "secondary_hm",
        },
        {
          amount: 2400,
          resource: "tertiary_hm",
        },
        {
          amount: 3600,
          resource: "secondary_fa",
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
          level: 12,
        },
      },
    ],
  },
  {
    id: "hm_9",
    name: "Oil Lamps",
    column: 3,
    required: ["hm_6"],
    costs: {
      research_points: 125,
      coins: 2700000,
      food: 1500000,
      goods: [
        {
          amount: 6250,
          resource: "primary_hm",
        },
        {
          amount: 3900,
          resource: "tertiary_ks",
        },
        {
          amount: 3150,
          resource: "tertiary_ie",
        },
      ],
    },
    allied: "arabia",
    rewards: [
      {
        title: "Oil Lamp Crafter",
        desc: "Unlocks the Oil Lamp Crafter",
        img: { kind: "wiki", imageName: "Arabia_Oil_Lamp_Crafter" },
      },
      {
        title: "Oil Lamp",
        desc: "Unlocks the good Oil Lamp for you, so that you can produce it in Arabia",
        img: { kind: "local", path: "/images/goods-large/oil_lamp.webp" },
      },
    ],
  },
  {
    id: "hm_10",
    name: "Surgical Instruments",
    column: 3,
    required: ["hm_6"],
    costs: {
      research_points: 92,
      coins: 4800000,
      food: 2700000,
      goods: [
        {
          amount: 9200,
          resource: "primary_ks",
        },
        {
          amount: 5100,
          resource: "tertiary_ie",
        },
        {
          amount: 1550,
          resource: "secondary_hm",
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
        title: "Medium Home",
        desc: "Allows constructing 1 more Medium Home building in Arabia",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
      {
        title: "Channel",
        desc: "Allows constructing 1 more Channel building in Arabia",
        img: { kind: "catalog", imgType: "cultureSite", invert: true },
      },
    ],
  },
  {
    id: "hm_11",
    name: "Pointed Archs",
    column: 4,
    required: ["hm_7", "hm_8"],
    costs: {
      research_points: 90,
      coins: 6400000,
      food: 2600000,
      goods: [
        {
          amount: 5400,
          resource: "tertiary_hm",
        },
        {
          amount: 3350,
          resource: "secondary_ks",
        },
        {
          amount: 2700,
          resource: "primary_ie",
        },
      ],
    },
    rewards: [
      {
        title: "Small Home",
        desc: "Unlocks a Small Home upgrade",
        img: { kind: "wiki", imageName: "Capital_Small_Home_Lv", level: 35 },
      },
      {
        title: "Small Home",
        desc: "Allows constructing 1 more Small Home building in your city",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
    ],
  },
  {
    id: "hm_12",
    name: "Carpets",
    column: 4,
    required: ["hm_9"],
    costs: {
      research_points: 125,
      coins: 7800000,
      food: 5800000,
      goods: [
        {
          amount: 6050,
          resource: "secondary_hm",
        },
        {
          amount: 5050,
          resource: "primary_ie",
        },
        {
          amount: 1500,
          resource: "primary_hm",
        },
      ],
    },
    allied: "arabia",
    rewards: [
      {
        title: "Carpet Factory",
        desc: "Unlocks the Carpet Factory",
        img: { kind: "wiki", imageName: "Arabia_Carpet_Factory" },
      },
      {
        title: "Carpet",
        desc: "Unlocks the good Carpet for you, so that you can produce it in Arabia",
        img: { kind: "local", path: "/images/goods-large/carpet.webp" },
      },
      {
        title: "Medium Home",
        desc: "Allows constructing 1 more Medium Home building in Arabia",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
    ],
  },
  {
    id: "hm_13",
    name: "Bookkeeping Systems",
    column: 4,
    required: ["hm_9", "hm_10"],
    costs: {
      research_points: 99,
      coins: 6300000,
      food: 6000000,
      goods: [
        {
          amount: 18500,
          resource: "tertiary_af",
        },
        {
          amount: 6450,
          resource: "tertiary_fa",
        },
        {
          amount: 1550,
          resource: "primary_hm",
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
        title: "Bazaar Offer Slot Extension",
        desc: "Unlock 1 more Bazaar Offer Slot(s)",
        img: {
          kind: "local",
          path: "/images/technos/features/icon_IncreaseBazaarOfferSlotsReward.webp",
        },
      },
    ],
  },
  {
    id: "hm_14",
    name: "Experimental Science",
    column: 4,
    required: ["hm_10"],
    costs: {
      research_points: 105,
      coins: 2700000,
      food: 5800000,
      goods: [
        {
          amount: 5600,
          resource: "primary_hm",
        },
        {
          amount: 2400,
          resource: "secondary_hm",
        },
        {
          amount: 500,
          resource: "oil_lamp",
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
        title: "Small Well",
        desc: "Allows constructing 1 more Small Well building in Arabia",
        img: { kind: "catalog", imgType: "cultureSite", invert: true },
      },
    ],
  },
  {
    id: "hm_15",
    name: "Simple Spinning Wheels",
    column: 5,
    required: ["hm_11"],
    costs: {
      research_points: 73,
      coins: 2200000,
      food: 2000000,
      goods: [
        {
          amount: 4950,
          resource: "tertiary_hm",
        },
        {
          amount: 3100,
          resource: "primary_ks",
        },
        {
          amount: 1250,
          resource: "primary_hm",
        },
      ],
    },
    rewards: [
      {
        title: "Domestic Farm",
        desc: "Unlocks a Domestic Farm upgrade",
        img: { kind: "wiki", imageName: "Capital_Domestic_Farm_Lv", level: 35 },
      },
    ],
  },
  {
    id: "hm_16",
    name: "Non-Latin Books",
    column: 5,
    required: ["hm_11", "hm_12"],
    costs: {
      research_points: 75,
      coins: 6700000,
      food: 3300000,
      goods: [
        {
          amount: 5450,
          resource: "primary_hm",
        },
        {
          amount: 3400,
          resource: "tertiary_ks",
        },
        {
          amount: 2700,
          resource: "secondary_ie",
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
          level: 12,
        },
      },
      {
        title: "Little Culture Site",
        desc: "Allows constructing 1 more Little Culture Site building in your city",
        img: { kind: "catalog", imgType: "cultureSite", invert: true },
      },
    ],
  },
  {
    id: "hm_17",
    name: "Ornamented Vaulting",
    column: 5,
    required: ["hm_12", "hm_13"],
    costs: {
      research_points: 91,
      coins: 8200000,
      food: 3700000,
      goods: [
        {
          amount: 17500,
          resource: "secondary_af",
        },
        {
          amount: 4850,
          resource: "secondary_ie",
        },
        {
          amount: 1450,
          resource: "secondary_hm",
        },
      ],
    },
    allied: "arabia",
    rewards: [
      {
        title: "Medium Home",
        desc: "Unlocks a Medium Home upgrade",
        img: { kind: "wiki", imageName: "Arabia_Medium_Home_Lv", level: 5 },
      },
      {
        title: "Medium Home",
        desc: "Allows constructing 1 more Medium Home building in Arabia",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
      {
        title: "Bazaar Upgrade",
        desc: "Increase the offered amount of Resources for all Bazaar Offers",
        img: {
          kind: "local",
          path: "/images/technos/features/icon_IncreaseBazaarLevelReward.webp",
        },
      },
    ],
  },
  {
    id: "hm_18",
    name: "Improved Irrigation",
    column: 5,
    required: ["hm_13", "hm_14"],
    costs: {
      research_points: 86,
      coins: 3200000,
      food: 5200000,
      goods: [
        {
          amount: 5550,
          resource: "secondary_hm",
        },
        {
          amount: 3450,
          resource: "secondary_ks",
        },
        {
          amount: 2750,
          resource: "tertiary_ie",
        },
      ],
    },
    allied: "arabia",
    rewards: [
      {
        title: "Deep Well",
        desc: "Unlocks the Deep Well",
        img: { kind: "wiki", imageName: "Arabia_Deep_Well" },
      },
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
    id: "hm_19",
    name: "Cartography",
    column: 6,
    required: ["hm_15"],
    costs: {
      research_points: 91,
      coins: 6600000,
      food: 2200000,
      goods: [
        {
          amount: 7050,
          resource: "tertiary_ks",
        },
        {
          amount: 1950,
          resource: "primary_hm",
        },
        {
          amount: 1200,
          resource: "tertiary_hm",
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
          level: 12,
        },
      },
    ],
  },
  {
    id: "hm_20",
    name: "Knighthood",
    column: 6,
    required: ["hm_16"],
    costs: {
      research_points: 155,
      coins: 7400000,
      food: 3300000,
      goods: [
        {
          amount: 5450,
          resource: "tertiary_hm",
        },
        {
          amount: 4550,
          resource: "primary_ie",
        },
        {
          amount: 1350,
          resource: "secondary_hm",
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
          level: 12,
        },
      },
    ],
  },
  {
    id: "hm_21",
    name: "Romantic Poetry",
    column: 6,
    required: ["hm_17"],
    costs: {
      research_points: 97,
      coins: 4600000,
      food: 2000000,
      goods: [
        {
          amount: 5700,
          resource: "secondary_hm",
        },
        {
          amount: 3600,
          resource: "primary_ks",
        },
        {
          amount: 2850,
          resource: "tertiary_ie",
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
        title: "Bazaar Offer Slot Extension",
        desc: "Unlock 1 more Bazaar Offer Slot(s)",
        img: {
          kind: "local",
          path: "/images/technos/features/icon_IncreaseBazaarOfferSlotsReward.webp",
        },
      },
    ],
  },
  {
    id: "hm_22",
    name: "Hyperbolic Geometry",
    column: 6,
    required: ["hm_17", "hm_18"],
    costs: {
      research_points: 94,
      coins: 6600000,
      food: 3500000,
      goods: [
        {
          amount: 5950,
          resource: "primary_hm",
        },
        {
          amount: 6350,
          resource: "primary_fa",
        },
        {
          amount: 400,
          resource: "carpet",
        },
      ],
    },
    allied: "arabia",
    rewards: [
      {
        title: "Merchant",
        desc: "Unlocks a Merchant upgrade",
        img: { kind: "wiki", imageName: "Arabia_Merchant_Lv", level: 5 },
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
    id: "hm_23",
    name: "Quality Products",
    column: 7,
    required: ["hm_19", "hm_20"],
    costs: {
      research_points: 145,
      coins: 2900000,
      food: 5200000,
      goods: [
        {
          amount: 18000,
          resource: "secondary_fa",
        },
        {
          amount: 4650,
          resource: "tertiary_ks",
        },
        {
          amount: 2400,
          resource: "oil_lamp",
        },
      ],
    },
    rewards: [
      {
        title: "Rural Farm",
        desc: "Unlocks a Rural Farm upgrade",
        img: { kind: "wiki", imageName: "Capital_Rural_Farm_Lv", level: 36 },
      },
    ],
  },
  {
    id: "hm_24",
    name: "Weaving Techniques",
    column: 7,
    required: ["hm_21"],
    costs: {
      research_points: 115,
      coins: 7100000,
      food: 5100000,
      goods: [
        {
          amount: 5900,
          resource: "secondary_hm",
        },
        {
          amount: 3700,
          resource: "secondary_ks",
        },
        {
          amount: 2950,
          resource: "primary_ie",
        },
      ],
    },
    allied: "arabia",
    rewards: [
      {
        title: "Carpet Factory",
        desc: "Allows constructing 1 more Carpet Factory building in Arabia",
        img: { kind: "catalog", imgType: "workshop", invert: true },
      },
      {
        title: "Merchant",
        desc: "Allows constructing 1 more Merchant building in Arabia",
        img: { kind: "catalog", imgType: "merchant", invert: true },
      },
      {
        title: "Bazaar Offer Slot Extension",
        desc: "Unlock 1 more Bazaar Offer Slot(s)",
        img: {
          kind: "local",
          path: "/images/technos/features/icon_IncreaseBazaarOfferSlotsReward.webp",
        },
      },
    ],
  },
  {
    id: "hm_25",
    name: "Kerosine Destillation",
    column: 7,
    required: ["hm_22"],
    costs: {
      research_points: 115,
      coins: 4800000,
      food: 4500000,
      goods: [
        {
          amount: 10500,
          resource: "secondary_ie",
        },
        {
          amount: 5450,
          resource: "secondary_fa",
        },
        {
          amount: 1300,
          resource: "tertiary_hm",
        },
      ],
    },
    allied: "arabia",
    rewards: [
      {
        title: "Oil Lamp Crafter",
        desc: "Allows constructing 1 more Oil Lamp Crafter building in Arabia",
        img: { kind: "catalog", imgType: "workshop", invert: true },
      },
      {
        title: "Merchant",
        desc: "Allows constructing 1 more Merchant building in Arabia",
        img: { kind: "catalog", imgType: "merchant", invert: true },
      },
      {
        title: "small Well",
        desc: "Allows constructing 1 more small Well building in Arabia",
        img: { kind: "catalog", imgType: "cultureSite", invert: true },
      },
    ],
  },
  {
    id: "hm_26",
    name: "Billmen",
    column: 8,
    required: ["hm_23"],
    costs: {
      research_points: 150,
      coins: 7900000,
      food: 4200000,
      goods: [
        {
          amount: 5100,
          resource: "tertiary_hm",
        },
        {
          amount: 3200,
          resource: "primary_ks",
        },
        {
          amount: 2550,
          resource: "tertiary_ie",
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
          level: 12,
        },
      },
    ],
  },
  {
    id: "hm_27",
    name: "Guilds",
    column: 8,
    required: ["hm_23", "hm_24"],
    costs: {
      research_points: 115,
      coins: 6900000,
      food: 1800000,
      goods: [
        {
          amount: 7800,
          resource: "secondary_ks",
        },
        {
          amount: 4350,
          resource: "secondary_ie",
        },
        {
          amount: 1300,
          resource: "primary_hm",
        },
      ],
    },
    rewards: [
      {
        title: "Domestic Farm",
        desc: "Unlocks a Domestic Farm upgrade",
        img: { kind: "wiki", imageName: "Capital_Domestic_Farm_Lv", level: 36 },
      },
    ],
  },
  {
    id: "hm_28",
    name: "Tesselation",
    column: 8,
    required: ["hm_24", "hm_25"],
    costs: {
      research_points: 99,
      coins: 2600000,
      food: 3000000,
      goods: [
        {
          amount: 6650,
          resource: "primary_hm",
        },
        {
          amount: 2750,
          resource: "tertiary_hm",
        },
        {
          amount: 4150,
          resource: "tertiary_fa",
        },
      ],
    },
    allied: "arabia",
    rewards: [
      {
        title: "Medium Home",
        desc: "Unlocks a Medium Home upgrade",
        img: { kind: "wiki", imageName: "Arabia_Medium_Home_Lv", level: 6 },
      },
      {
        title: "Medium Home",
        desc: "Allows constructing 1 more Medium Home building in Arabia",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
      {
        title: "Channel",
        desc: "Allows constructing 1 more Channel building in Arabia",
        img: { kind: "catalog", imgType: "cultureSite", invert: true },
      },
    ],
  },
  {
    id: "hm_29",
    name: "Bridge Mills",
    column: 8,
    required: ["hm_25"],
    costs: {
      research_points: 83,
      coins: 4000000,
      food: 4400000,
      goods: [
        {
          amount: 17500,
          resource: "primary_af",
        },
        {
          amount: 3600,
          resource: "secondary_ks",
        },
        {
          amount: 2900,
          resource: "secondary_ie",
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
        title: "Small Well",
        desc: "Allows constructing 1 more Small Well building in Arabia",
        img: { kind: "catalog", imgType: "cultureSite", invert: true },
      },
      {
        title: "Deep Well",
        desc: "Allows constructing 1 more Deep Well building in Arabia",
        img: { kind: "catalog", imgType: "cultureSite", invert: true },
      },
    ],
  },
  {
    id: "hm_30",
    name: "Secondary Good",
    column: 9,
    required: ["hm_26", "hm_27"],
    costs: {
      research_points: 115,
      coins: 7500000,
      food: 2700000,
      goods: [
        {
          amount: 6800,
          resource: "secondary_hm",
        },
        {
          amount: 4250,
          resource: "tertiary_ks",
        },
        {
          amount: 1700,
          resource: "primary_hm",
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
    id: "hm_31",
    name: "Staufer Architecture",
    column: 9,
    required: ["hm_27"],
    costs: {
      research_points: 105,
      coins: 3300000,
      food: 3900000,
      goods: [
        {
          amount: 6750,
          resource: "tertiary_hm",
        },
        {
          amount: 5650,
          resource: "tertiary_ie",
        },
        {
          amount: 1700,
          resource: "secondary_hm",
        },
      ],
    },
    rewards: [
      {
        title: "Average Home",
        desc: "Unlocks a Average Home upgrade",
        img: { kind: "wiki", imageName: "Capital_Average_Home_Lv", level: 35 },
      },
      {
        title: "Average Home",
        desc: "Allows constructing 1 more Average Home building in your city",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
    ],
  },
  {
    id: "hm_32",
    name: "Banks",
    column: 9,
    required: ["hm_28", "hm_29"],
    costs: {
      research_points: 91,
      coins: 2000000,
      food: 3100000,
      goods: [
        {
          amount: 15500,
          resource: "tertiary_fa",
        },
        {
          amount: 3950,
          resource: "primary_ks",
        },
        {
          amount: 2000,
          resource: "carpet",
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
        title: "Merchant",
        desc: "Allows constructing 1 more Merchant building in Arabia",
        img: { kind: "catalog", imgType: "merchant", invert: true },
      },
      {
        title: "Bazaar Offer Slot Extension",
        desc: "Unlock 1 more Bazaar Offer Slot(s)",
        img: {
          kind: "local",
          path: "/images/technos/features/icon_IncreaseBazaarOfferSlotsReward.webp",
        },
      },
    ],
  },
  {
    id: "hm_33",
    name: "Medieval Catapults",
    column: 10,
    required: ["hm_30", "hm_31", "hm_32"],
    costs: {
      research_points: 155,
      coins: 3400000,
      food: 3400000,
      goods: [
        {
          amount: 5600,
          resource: "primary_hm",
        },
        {
          amount: 5850,
          resource: "primary_fa",
        },
        {
          amount: 1400,
          resource: "tertiary_hm",
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
          level: 12,
        },
      },
    ],
  },
  {
    id: "hm_34",
    name: "Disinfectants",
    column: 10,
    required: ["hm_31", "hm_32"],
    costs: {
      research_points: 86,
      coins: 6700000,
      food: 3700000,
      goods: [
        {
          amount: 6700,
          resource: "tertiary_hm",
        },
        {
          amount: 5600,
          resource: "secondary_ie",
        },
        {
          amount: 3350,
          resource: "primary_ie",
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
    id: "hm_35",
    name: "Combination Locks",
    column: 10,
    required: ["hm_32"],
    costs: {
      research_points: 90,
      coins: 5600000,
      food: 1700000,
      goods: [
        {
          amount: 8000,
          resource: "primary_ks",
        },
        {
          amount: 3300,
          resource: "secondary_ks",
        },
        {
          amount: 1350,
          resource: "primary_hm",
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
        title: "Medium Home",
        desc: "Allows constructing 1 more Medium Home building in Arabia",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
      {
        title: "Bazaar Upgrade",
        desc: "Increase the offered amount of Resources for all Bazaar Offers",
        img: {
          kind: "local",
          path: "/images/technos/features/icon_IncreaseBazaarLevelReward.webp",
        },
      },
    ],
  },
  {
    id: "hm_36",
    name: "Precautions",
    column: 11,
    required: ["hm_33"],
    costs: {
      research_points: 86,
      coins: 7100000,
      food: 4800000,
      goods: [
        {
          amount: 7450,
          resource: "secondary_hm",
        },
        {
          amount: 6400,
          resource: "tertiary_ie",
        },
        {
          amount: 4800,
          resource: "oil_lamp",
        },
      ],
    },
    rewards: [
      {
        title: "Small Home",
        desc: "Unlocks a Small Home upgrade",
        img: { kind: "wiki", imageName: "Capital_Small_Home_Lv", level: 36 },
      },
    ],
  },
  {
    id: "hm_37",
    name: "Tertiary Good",
    column: 11,
    required: ["hm_33"],
    costs: {
      research_points: 110,
      coins: 2700000,
      food: 3100000,
      goods: [
        {
          amount: 5100,
          resource: "tertiary_hm",
        },
        {
          amount: 3200,
          resource: "tertiary_ks",
        },
        {
          amount: 1250,
          resource: "secondary_hm",
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
  {
    id: "hm_38",
    name: "Flying Contraption",
    column: 11,
    required: ["hm_34"],
    costs: {
      research_points: 115,
      coins: 3300000,
      food: 3100000,
      goods: [
        {
          amount: 15000,
          resource: "tertiary_ie",
        },
        {
          amount: 8100,
          resource: "tertiary_fa",
        },
        {
          amount: 3700,
          resource: "carpet",
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
    id: "hm_39",
    name: "Weight-Driven Clocks",
    column: 11,
    required: ["hm_35"],
    costs: {
      research_points: 88,
      coins: 2800000,
      food: 4800000,
      goods: [
        {
          amount: 6050,
          resource: "primary_hm",
        },
        {
          amount: 2550,
          resource: "tertiary_hm",
        },
        {
          amount: 3050,
          resource: "secondary_ie",
        },
      ],
    },
    allied: "arabia",
    rewards: [
      {
        title: "Merchant",
        desc: "Unlocks a Merchant upgrade",
        img: { kind: "wiki", imageName: "Arabia_Merchant_Lv", level: 6 },
      },
      {
        title: "Medium Home",
        desc: "Allows constructing 1 more Medium Home building in Arabia",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
      {
        title: "Bazaar Offer Slot Extension",
        desc: "Unlocks 1 more Bazaar Offer Slot(s)",
        img: {
          kind: "local",
          path: "/images/technos/features/icon_IncreaseBazaarOfferSlotsReward.webp",
        },
      },
    ],
  },
  {
    id: "hm_40",
    name: "Universities",
    column: 12,
    required: ["hm_36", "hm_37", "hm_38"],
    costs: {
      research_points: 105,
      coins: 4000000,
      food: 2300000,
      goods: [
        {
          amount: 5750,
          resource: "tertiary_hm",
        },
        {
          amount: 3600,
          resource: "primary_ks",
        },
        {
          amount: 2150,
          resource: "secondary_ks",
        },
      ],
    },
    rewards: [
      {
        title: "Average Home",
        desc: "Unlocks a Average Home upgrade",
        img: { kind: "wiki", imageName: "Capital_Average_Home_Lv", level: 36 },
      },
    ],
  },
  {
    id: "hm_41",
    name: "Metabolism Theory",
    column: 12,
    required: ["hm_38", "hm_39"],
    costs: {
      research_points: 110,
      coins: 3400000,
      food: 4200000,
      goods: [
        {
          amount: 12500,
          resource: "primary_ie",
        },
        {
          amount: 3900,
          resource: "tertiary_ks",
        },
        {
          amount: 3150,
          resource: "tertiary_ie",
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
        title: "Channel",
        desc: "Allows constructing 1 more Channel building in Arabia",
        img: { kind: "catalog", imgType: "cultureSite", invert: true },
      },
    ],
  },
  {
    id: "hm_42",
    name: "Shale Oil",
    column: 12,
    required: ["hm_39"],
    costs: {
      research_points: 93,
      coins: 8500000,
      food: 5200000,
      goods: [
        {
          amount: 5650,
          resource: "secondary_hm",
        },
        {
          amount: 2350,
          resource: "primary_hm",
        },
        {
          amount: 2100,
          resource: "primary_ks",
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
    id: "hm_43",
    name: "Early Gothic Decorations",
    column: 13,
    required: ["hm_40", "hm_41", "hm_42"],
    costs: {
      research_points: 120,
      coins: 6100000,
      food: 5400000,
      goods: [
        {
          amount: 13000,
          resource: "secondary_ie",
        },
        {
          amount: 4050,
          resource: "secondary_ks",
        },
        {
          amount: 1650,
          resource: "tertiary_hm",
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
          level: 12,
        },
      },
      {
        title: "Medium Home",
        desc: "Allows constructing 2 more Medium Home buildings in Arabia",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
      {
        title: "Luxurious Home",
        desc: "Allows constructing 3 more Luxurious Home buildings in Arabia",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
    ],
  },
];
