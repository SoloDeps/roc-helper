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
      "Small Home: Unlocks the Small Home",
      "Rural Farm: Unlocks a Rural Farm upgrade",
      "Luxurious Home: Allows constructing 1 more Luxurious Home building in your city",
      "City Hall: Unlocks a Great Hall upgrade",
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
      "Compact Culture Site: Unlocks a Compact Culture Site upgrade",
      "Domestic Farm: Unlocks a Domestic Farm upgrade",
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
    rewards: ["Infantry Barracks: Unlocks a Infantry Barracks upgrade"],
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
      "Medium Home: Unlocks a Medium Home upgrade",
      "Medium Home: Allows constructing 1 more Medium Home building in your city",
      "City Hall: Unlocks a Great Hall upgrade",
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
    rewards: ["Average Home: Unlocks a Average Home upgrade"],
  },
  {
    id: "hm_5",
    name: "Primary Workshop",
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
      "Primary Workshop: Unlocks a Primary Workshop upgrade",
      "Primary Goods: Unlocks the good Primary Goods for you, so that you can produce it in your city",
      "+10000: Increased Trade Token Limit",
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
      "Merchant: Unlocks a Merchant upgrade",
      "Camel Farm: Allows constructing 1 more Camel Farm building in your city",
      "Bazaar Upgrade: Increases the offered amount of Resources for all Bazaar Offers",
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
      "Rural Farm: Unlocks a Rural Farm upgrade",
      "Rural Farm: Allows constructing 1 more Rural Farm building in your city",
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
    rewards: ["Ranged Barracks: Unlocks a Ranged Barracks upgrade"],
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
      "Oil Lamp Crafter: Unlocks the Oil Lamp Crafter",
      "Oil Lamp: Unlocks the good Oil Lamp for you, so that you can produce it in your city",
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
      "Merchant: Allows constructing 1 more Merchant building in your city",
      "Medium Home: Allows constructing 1 more Medium Home building in your city",
      "Channel: Allows constructing 1 more Channel building in your city",
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
      "Small Home: Unlocks a Small Home upgrade",
      "Small Home: Allows constructing 1 more Small Home building in your city",
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
      "Carpet Factory: Unlocks the Carpet Factory",
      "Carpet: Unlocks the good Carpet for you, so that you can produce it in your city",
      "Medium Home: Allows constructing 1 more Medium Home building in your city",
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
      "Merchant: Allows constructing 1 more Merchant building in your city",
      "Bazaar Offer Slot Extension: Unlock 1 more Bazaar Offer Slot(s)",
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
      "Camel Farm: Allows constructing 1 more Camel Farm building in your city",
      "Medium Home: Allows constructing 1 more Medium Home building in your city",
      "Small Well: Allows constructing 1 more Small Well building in your city",
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
    rewards: ["Domestic Farm: Unlocks a Domestic Farm upgrade"],
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
      "Little Culture Site: Unlocks a Little Culture Site upgrade",
      "Little Culture Site: Allows constructing 1 more Little Culture Site building in your city",
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
      "Medium Home: Unlocks a Medium Home upgrade",
      "Medium Home: Allows constructing 1 more Medium Home building in your city",
      "Bazaar Upgrade: Increase the offered amount of Resources for all Bazaar Offers",
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
      "Deep Well: Unlocks the Deep Well",
      "Small Well: Allows constructing 1 more Small Well building in your city",
      "Channel: Allows constructing 1 more Channel building in your city",
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
    rewards: ["Moderate Culture Site: Unlocks a Moderate Culture Site upgrade"],
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
    rewards: ["Cavalry Barracks: Unlocks a Cavalry Barracks upgrade"],
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
      "Camel Farm: Allows constructing 1 more Camel Farm building in your city",
      "Medium Home: Allows constructing 1 more Medium Home building in your city",
      "Bazaar Offer Slot Extension: Unlock 1 more Bazaar Offer Slot(s)",
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
      "Merchant: Unlocks a Merchant upgrade",
      "Merchant: Allows constructing 1 more Merchant building in your city",
      "Medium Home: Allows constructing 1 more Medium Home building in your city",
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
    rewards: ["Rural Farm: Unlocks a Rural Farm upgrade"],
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
      "Carpet Factory: Allows constructing 1 more Carpet Factory building in your city",
      "Merchant: Allows constructing 1 more Merchant building in your city",
      "Bazaar Offer Slot Extension: Unlock 1 more Bazaar Offer Slot(s)",
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
      "Oil Lamp Crafter: Allows constructing 1 more Oil Lamp Crafter building in your city",
      "Merchant: Allows constructing 1 more Merchant building in your city",
      "small Well: Allows constructing 1 more small Well building in your city",
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
      "Heavy Infantry Barracks: Unlocks a Heavy Infantry Barracks upgrade",
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
    rewards: ["Domestic Farm: Unlocks a Domestic Farm upgrade"],
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
      "Medium Home: Unlocks a Medium Home upgrade",
      "Medium Home: Allows constructing 1 more Medium Home building in your city",
      "Channel: Allows constructing 1 more Channel building in your city",
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
      "Camel Farm: Allows constructing 1 more Camel Farm building in your city",
      "Small Well: Allows constructing 1 more Small Well building in your city",
      "Deep Well: Allows constructing 1 more Deep Well building in your city",
    ],
  },
  {
    id: "hm_30",
    name: "Secondary Workshop",
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
      "Secondary Workshop: Unlocks a Secondary Workshop upgrade",
      "Secondary Goods: Unlocks the good Secondary Goods for you, so that you can produce it in your city",
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
      "Average Home: Unlocks a Average Home upgrade",
      "Average Home: Allows constructing 1 more Average Home building in your city",
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
      "Medium Home: Allows constructing 1 more Medium Home building in your city",
      "Merchant: Allows constructing 1 more Merchant building in your city",
      "Bazaar Offer Slot Extension: Unlock 1 more Bazaar Offer Slot(s)",
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
    rewards: ["Siege Barracks: Unlocks a Siege Barracks upgrade"],
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
      "Camel Farm: Allows constructing 1 more Camel Farm building in your city",
      "Small Well: Allows constructing 1 more Small Well building in your city",
      "Channel: Allows constructing 1 more Channel building in your city",
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
      "Merchant: Allows constructing 1 more Merchant building in your city",
      "Medium Home: Allows constructing 1 more Medium Home building in your city",
      "Bazaar Upgrade: Increase the offered amount of Resources for all Bazaar Offers",
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
    rewards: ["Small Home: Unlocks a Small Home upgrade"],
  },
  {
    id: "hm_37",
    name: "Tertiary Workshop",
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
      "Tertiary Workshop: Unlocks a Tertiary Workshop upgrade",
      "Tertiary Goods: Unlocks the good Tertiary Goods for you, so that you can produce it in your city",
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
      "Medium Home: Allows constructing 1 more Medium Home building in your city",
      "Small Well: Allows constructing 1 more Small Well building in your city",
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
      "Merchant: Unlocks a Merchant upgrade",
      "Medium Home: Allows constructing 1 more Medium Home building in your city",
      "Bazaar Offer Slot Extension: Unlocks 1 more Bazaar Offer Slot(s)",
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
    rewards: ["Average Home: Unlocks a Average Home upgrade"],
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
      "Merchant: Allows constructing 1 more Merchant building in your city",
      "Channel: Allows constructing 1 more Channel building in your city",
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
      "Medium Home: Allows constructing 1 more Medium Home building in your city",
      "Small Well: Allows constructing 1 more Small Well building in your city",
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
      "Large Culture Site: Unlocks a Large Culture Site upgrade",
      "Medium Home: Allows constructing 2 more Medium Home buildings in your city",
      "Luxurious Home: Allows constructing 3 more Luxurious Home buildings in your city",
    ],
  },
];
