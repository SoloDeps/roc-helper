import { TechnoData } from "@/types/shared";

export const technos_FA: TechnoData[] = [
  {
    id: "tech_fa_0",
    name: "Feudalism",
    column: 0,
    required: [],
    costs: {
      research_points: 62,
      coins: 1200000,
      food: 1000000,
      goods: [
        {
          amount: 3680,
          resource: "primary_be",
        },
        {
          amount: 6620,
          resource: "primary_af",
        },
        {
          amount: 1660,
          resource: "tertiary_af",
        },
      ],
    },
    rewards: [
      "Small Home: Unlocks a Small Home upgrade",
      "Rural Farm: Unlocks a Rural Farm upgrade",
      "City Hall: Unlocks a Great Hall upgrade",
    ],
  },
  {
    id: "tech_fa_1",
    name: "Axemen",
    column: 1,
    required: ["tech_fa_"],
    costs: {
      research_points: 97,
      coins: 3400000,
      food: 2500000,
      goods: [
        {
          amount: 2590,
          resource: "primary_re",
        },
        {
          amount: 2590,
          resource: "primary_af",
        },
        {
          amount: 6210,
          resource: "secondary_af",
        },
      ],
    },
    rewards: [
      "Infantry Barracks: Unlocks a Infantry Barracks upgrade",
      "Moderate Culture Site: Unlocks a Moderate Culture Site upgrade",
    ],
  },
  {
    id: "tech_fa_2",
    name: "Rise of the Vikings",
    column: 2,
    required: ["tech_fa_"],
    costs: {
      research_points: 88,
      coins: 4800000,
      food: 1800000,
      goods: [
        {
          amount: 2670,
          resource: "primary_be",
        },
        {
          amount: 4450,
          resource: "secondary_be",
        },
        {
          amount: 8010,
          resource: "tertiary_af",
        },
      ],
    },
    allied: "vikings",
    rewards: [
      "Unlock City: Unlocks Allied Culture Viking Kingdom!",
      "Worker Home: Unlocks the Worker Home",
      "Beehive: Unlocks the Beehive",
    ],
  },
  {
    id: "tech_fa_3",
    name: "Myths and Legends",
    column: 3,
    required: ["tech_fa_"],
    costs: {
      research_points: 73,
      coins: 1400000,
      food: 1200000,
      goods: [
        {
          amount: 9800,
          resource: "secondary_be",
        },
        {
          amount: 1840,
          resource: "primary_af",
        },
        {
          amount: 3070,
          resource: "secondary_af",
        },
      ],
    },
    rewards: [
      "Average Home: Unlocks a Average Home upgrade",
      "Compact Culture Site: Unlocks a Compact Culture Site upgrade",
    ],
  },
  {
    id: "tech_fa_4",
    name: "Primary Workshop",
    column: 4,
    required: ["tech_fa_"],
    costs: {
      research_points: 85,
      coins: 5100000,
      food: 969000,
      goods: [
        {
          amount: 2820,
          resource: "primary_er",
        },
        {
          amount: 5640,
          resource: "primary_af",
        },
        {
          amount: 2350,
          resource: "tertiary_af",
        },
      ],
    },
    rewards: [
      "Primary Workshop: Unlocks a Primary Workshop upgrade",
      "Primary Goods: Unlocks the good Primary Goods for you, so that you can produce it in your city",
      "+10000: Increase Trade Token Limit",
    ],
  },
  {
    id: "tech_fa_5",
    name: "Seafaring",
    column: 5,
    required: ["tech_fa_"],
    costs: {
      research_points: 11,
      coins: 1700000,
      food: 1600000,
      goods: [
        {
          amount: 1520,
          resource: "primary_be",
        },
        {
          amount: 910,
          resource: "secondary_be",
        },
        {
          amount: 2730,
          resource: "secondary_af",
        },
      ],
    },
    allied: "vikings",
    rewards: [
      "Sailor's Home: Unlocks the Sailor's Home",
      "Fishing Pier: Unlocks the Fishing Pier",
      "Luxurious Home: Unlocks the Premium Home",
      "Luxurious Fishing Pier: Unlocks the Luxurious Fishing Pier",
    ],
  },
  {
    id: "tech_fa_6",
    name: "Domestic Sheep",
    column: 6,
    required: ["tech_fa_"],
    costs: {
      research_points: 61,
      coins: 1300000,
      food: 1300000,
      goods: [
        {
          amount: 1840,
          resource: "secondary_af",
        },
        {
          amount: 4900,
          resource: "primary_fa",
        },
        {
          amount: 2040,
          resource: "tertiary_fa",
        },
      ],
    },
    rewards: [
      "Domestic Farm: Unlocks a Domestic Farm upgrade",
      "Little Culture Site: Unlocks a Little Culture Site upgrade",
    ],
  },
  {
    id: "tech_fa_7",
    name: "Repurposed Ruins",
    column: 7,
    required: ["tech_fa_"],
    costs: {
      research_points: 65,
      coins: 3700000,
      food: 1800000,
      goods: [
        {
          amount: 9760,
          resource: "secondary_re",
        },
        {
          amount: 1950,
          resource: "primary_be",
        },
        {
          amount: 1630,
          resource: "primary_fa",
        },
      ],
    },
    rewards: [
      "Small Home: Unlocks a Small Home upgrade",
      "Large Culture Site: Unlocks a Large Culture Site upgrade",
    ],
  },
  {
    id: "tech_fa_8",
    name: "Mead Brewery",
    column: 8,
    required: ["tech_fa_"],
    costs: {
      research_points: 16,
      coins: 3900000,
      food: 777000,
      goods: [
        {
          amount: 2840,
          resource: "primary_re",
        },
        {
          amount: 1020,
          resource: "tertiary_af",
        },
        {
          amount: 2730,
          resource: "primary_fa",
        },
      ],
    },
    allied: "vikings",
    rewards: [
      "Tavern: Unlocks the Tavern",
      "Mead: Unlocks the good Mead for you, so that you can produce it in your city",
      "Tavern Runestone: Unlocks the Tavern Runestone",
      "Worker Home: Allows constructing 2 more Worker Home buildings in your city",
      "Sailor's Home: Allows constructing 1 more Sailor's Home building in your city",
    ],
  },
  {
    id: "tech_fa_9",
    name: "Longbowmen",
    column: 9,
    required: ["tech_fa_"],
    costs: {
      research_points: 105,
      coins: 3000000,
      food: 2900000,
      goods: [
        {
          amount: 2440,
          resource: "tertiary_be",
        },
        {
          amount: 7330,
          resource: "primary_af",
        },
        {
          amount: 2040,
          resource: "secondary_fa",
        },
      ],
    },
    rewards: ["Ranged Barracks: Unlocks a Ranged Barracks upgrade"],
  },
  {
    id: "tech_fa_10",
    name: "Plundering Raids",
    column: 10,
    required: ["tech_fa_"],
    costs: {
      research_points: 22,
      coins: 1700000,
      food: 1600000,
      goods: [
        {
          amount: 2840,
          resource: "tertiary_re",
        },
        {
          amount: 680,
          resource: "primary_fa",
        },
        {
          amount: 2730,
          resource: "secondary_fa",
        },
      ],
    },
    allied: "vikings",
    rewards: [
      "Expedition Pier: Unlocks the Expedition Pier",
      "Ceramic Treasure: Unlocks the good Ceramic Treasure for you, so that you can produce it in your city",
      "Gold Treasure: Unlocks the good Gold Treasure for you, so that you can produce it in your city",
      "Luxurious Sailing Port: Unlocks the Luxurious Sailing Port",
      "Sailor's Home: Allows constructing 2 more Sailor's Home buildings in your city",
    ],
  },
  {
    id: "tech_fa_11",
    name: "Tafl Games",
    column: 11,
    required: ["tech_fa_"],
    costs: {
      research_points: 110,
      coins: 1700000,
      food: 2200000,
      goods: [
        {
          amount: 5300,
          resource: "secondary_be",
        },
        {
          amount: 2380,
          resource: "primary_af",
        },
        {
          amount: 6360,
          resource: "primary_fa",
        },
      ],
    },
    allied: "vikings",
    rewards: [
      "Worker Home: Allows constructing 2 more Worker Home buildings in your city",
      "Fishing Pier: Allows constructing 1 more Fishing Pier building in your city",
      "Beehive: Allows constructing 1 more Beehive building in your city",
    ],
  },
  {
    id: "tech_fa_12",
    name: "Open Field System",
    column: 12,
    required: ["tech_fa_"],
    costs: {
      research_points: 74,
      coins: 1500000,
      food: 2900000,
      goods: [
        {
          amount: 2450,
          resource: "secondary_be",
        },
        {
          amount: 7350,
          resource: "tertiary_af",
        },
        {
          amount: 2040,
          resource: "tertiary_fa",
        },
      ],
    },
    rewards: ["Rural Farm: Unlocks a Rural Farm upgrade"],
  },
  {
    id: "tech_fa_13",
    name: "Peaked Roofs",
    column: 13,
    required: ["tech_fa_"],
    costs: {
      research_points: 61,
      coins: 2400000,
      food: 2600000,
      goods: [
        {
          amount: 1640,
          resource: "secondary_af",
        },
        {
          amount: 1820,
          resource: "secondary_fa",
        },
        {
          amount: 4360,
          resource: "tertiary_fa",
        },
      ],
    },
    rewards: ["Average Home: Unlocks a Average Home upgrade"],
  },
  {
    id: "tech_fa_14",
    name: "Thralls and Jarls",
    column: 14,
    required: ["tech_fa_"],
    costs: {
      research_points: 84,
      coins: 3600000,
      food: 1900000,
      goods: [
        {
          amount: 3030,
          resource: "primary_be",
        },
        {
          amount: 1820,
          resource: "tertiary_be",
        },
        {
          amount: 3630,
          resource: "secondary_fa",
        },
      ],
    },
    allied: "vikings",
    rewards: [
      "Worker Home: Unlocks a Worker Home upgrade",
      "Worker Home: Allows constructing 1 more Worker Home building in your city",
      "Beehive: Allows constructing 2 more Beehive buildings in your city",
    ],
  },
  {
    id: "tech_fa_15",
    name: "Jarldom",
    column: 15,
    required: ["tech_fa_"],
    costs: {
      research_points: 89,
      coins: 2300000,
      food: 1400000,
      goods: [
        {
          amount: 3530,
          resource: "secondary_er",
        },
        {
          amount: 4900,
          resource: "secondary_re",
        },
        {
          amount: 7050,
          resource: "primary_af",
        },
      ],
    },
    allied: "vikings",
    rewards: [
      "Sailor's Home: Unlocks a Sailor's Home upgrade",
      "Worker Home: Allows constructing 1 more Worker Home building in your city",
      "Tavern: Allows constructing 1 more Tavern building in your city",
    ],
  },
  {
    id: "tech_fa_16",
    name: "Knights",
    column: 16,
    required: ["tech_fa_"],
    costs: {
      research_points: 120,
      coins: 5200000,
      food: 851000,
      goods: [
        {
          amount: 2210,
          resource: "primary_af",
        },
        {
          amount: 3690,
          resource: "tertiary_af",
        },
        {
          amount: 5900,
          resource: "primary_fa",
        },
      ],
    },
    rewards: ["Cavalry Barracks: Unlocks a Cavalry Barracks upgrade"],
  },
  {
    id: "tech_fa_17",
    name: "Beekeeping",
    column: 17,
    required: ["tech_fa_"],
    costs: {
      research_points: 62,
      coins: 1300000,
      food: 1300000,
      goods: [
        {
          amount: 5660,
          resource: "primary_re",
        },
        {
          amount: 2720,
          resource: "tertiary_be",
        },
        {
          amount: 5430,
          resource: "tertiary_fa",
        },
      ],
    },
    allied: "vikings",
    rewards: ["Beehive: Unlocks a Beehive upgrade"],
  },
  {
    id: "tech_fa_18",
    name: "Tar Ovens",
    column: 18,
    required: ["tech_fa_"],
    costs: {
      research_points: 75,
      coins: 2900000,
      food: 1200000,
      goods: [
        {
          amount: 8670,
          resource: "secondary_af",
        },
        {
          amount: 2480,
          resource: "secondary_fa",
        },
        {
          amount: 250,
          resource: "ceramic_treasure",
        },
      ],
    },
    allied: "vikings",
    rewards: [
      "Sailor's Home: Allows constructing 1 more Sailor's Home building in your city",
      "Fishing Pier: Allows constructing 1 more Fishing Pier building in your city",
    ],
  },
  {
    id: "tech_fa_19",
    name: "Manorialism",
    column: 19,
    required: ["tech_fa_"],
    costs: {
      research_points: 62,
      coins: 2500000,
      food: 2500000,
      goods: [
        {
          amount: 2260,
          resource: "secondary_be",
        },
        {
          amount: 1890,
          resource: "primary_fa",
        },
        {
          amount: 4520,
          resource: "secondary_fa",
        },
      ],
    },
    rewards: [
      "Domestic Farm: Allows constructing 1 more Domestic Farm building in your city",
      "Small Home: Allows constructing 1 more Small Home building in your city",
    ],
  },
  {
    id: "tech_fa_20",
    name: "Fishing Nets",
    column: 20,
    required: ["tech_fa_"],
    costs: {
      research_points: 64,
      coins: 4800000,
      food: 1000000,
      goods: [
        {
          amount: 3610,
          resource: "primary_er",
        },
        {
          amount: 4010,
          resource: "tertiary_be",
        },
        {
          amount: 4810,
          resource: "tertiary_fa",
        },
      ],
    },
    allied: "vikings",
    rewards: [
      "Fishing Pier: Unlocks a Fishing Pier upgrade",
      "Expedition Pier: Allows constructing 1 more Expedition Pier building in your city",
      "Tavern: Allows constructing 1 more Tavern building in your city",
    ],
  },
  {
    id: "tech_fa_21",
    name: "Trebuchets",
    column: 21,
    required: ["tech_fa_"],
    costs: {
      research_points: 125,
      coins: 2400000,
      food: 3300000,
      goods: [
        {
          amount: 6620,
          resource: "tertiary_re",
        },
        {
          amount: 2380,
          resource: "secondary_af",
        },
        {
          amount: 6360,
          resource: "primary_fa",
        },
      ],
    },
    rewards: ["Siege Barracks: Unlocks a Siege Barracks upgrade"],
  },
  {
    id: "tech_fa_22",
    name: "Pictograms",
    column: 22,
    required: ["tech_fa_"],
    costs: {
      research_points: 65,
      coins: 3600000,
      food: 1500000,
      goods: [
        {
          amount: 2600,
          resource: "tertiary_be",
        },
        {
          amount: 2170,
          resource: "primary_fa",
        },
        {
          amount: 5190,
          resource: "tertiary_fa",
        },
      ],
    },
    allied: "vikings",
    rewards: [
      "Sailor's Home: Allows constructing 2 more Sailor's Home buildings in your city",
      "Worker Home: Allows constructing 2 more Worker Home buildings in your city",
      "Beehive: Allows constructing 1 more Beehive building in your city",
    ],
  },
  {
    id: "tech_fa_23",
    name: "Timber Framing",
    column: 23,
    required: ["tech_fa_"],
    costs: {
      research_points: 71,
      coins: 3900000,
      food: 1300000,
      goods: [
        {
          amount: 1870,
          resource: "primary_fa",
        },
        {
          amount: 4360,
          resource: "tertiary_fa",
        },
        {
          amount: 200,
          resource: "gold_treasure",
        },
      ],
    },
    rewards: ["Small Home: Unlocks a Small Home upgrade"],
  },
  {
    id: "tech_fa_24",
    name: "Sheep Herds",
    column: 24,
    required: ["tech_fa_"],
    costs: {
      research_points: 59,
      coins: 1300000,
      food: 1600000,
      goods: [
        {
          amount: 2340,
          resource: "primary_be",
        },
        {
          amount: 2930,
          resource: "secondary_af",
        },
        {
          amount: 4690,
          resource: "primary_fa",
        },
      ],
    },
    rewards: ["Domestic Farm: Unlocks a Domestic Farm upgrade"],
  },
  {
    id: "tech_fa_25",
    name: "Burial Sites",
    column: 25,
    required: ["tech_fa_"],
    costs: {
      research_points: 65,
      coins: 5100000,
      food: 2000000,
      goods: [
        {
          amount: 3440,
          resource: "secondary_be",
        },
        {
          amount: 1550,
          resource: "tertiary_af",
        },
        {
          amount: 4120,
          resource: "secondary_fa",
        },
      ],
    },
    allied: "vikings",
    rewards: [
      "Worker Home: Unlocks a Worker Home upgrade",
      "Worker Home: Allows constructing 2 more Worker Home buildings in your city",
      "Beehive: Allows constructing 1 more Beehive building in your city",
    ],
  },
  {
    id: "tech_fa_26",
    name: "Sagas",
    column: 26,
    required: ["tech_fa_"],
    costs: {
      research_points: 80,
      coins: 4000000,
      food: 2400000,
      goods: [
        {
          amount: 4180,
          resource: "secondary_er",
        },
        {
          amount: 8360,
          resource: "secondary_af",
        },
        {
          amount: 2320,
          resource: "tertiary_fa",
        },
      ],
    },
    allied: "vikings",
    rewards: [
      "Sailor's Home: Unlocks a Sailor's Home upgrade",
      "Sailor's Home: Allows constructing 1 more Sailor's Home building in your city",
      "Expedition Pier: Allows constructing 1 more Expedition Pier building in your city",
      "Tavern: Allows constructing 1 more Tavern building in your city",
    ],
  },
  {
    id: "tech_fa_27",
    name: "Ridge and Furrow",
    column: 27,
    required: ["tech_fa_"],
    costs: {
      research_points: 74,
      coins: 3200000,
      food: 2900000,
      goods: [
        {
          amount: 10600,
          resource: "primary_be",
        },
        {
          amount: 2270,
          resource: "secondary_fa",
        },
        {
          amount: 500,
          resource: "ceramic_treasure",
        },
      ],
    },
    rewards: ["Rural Farm: Unlocks a Rural Farm upgrade"],
  },
  {
    id: "tech_fa_28",
    name: "Castle",
    column: 28,
    required: ["tech_fa_"],
    costs: {
      research_points: 96,
      coins: 3400000,
      food: 1100000,
      goods: [
        {
          amount: 4330,
          resource: "tertiary_re",
        },
        {
          amount: 1560,
          resource: "primary_af",
        },
        {
          amount: 4160,
          resource: "primary_fa",
        },
      ],
    },
    rewards: [
      "Average Home: Unlocks a Average Home upgrade",
      "Average Home: Allows constructing 1 more Average Home building in your city",
    ],
  },
  {
    id: "tech_fa_29",
    name: "Runic Writing",
    column: 29,
    required: ["tech_fa_"],
    costs: {
      research_points: 68,
      coins: 1400000,
      food: 2900000,
      goods: [
        {
          amount: 2260,
          resource: "primary_fa",
        },
        {
          amount: 5280,
          resource: "tertiary_fa",
        },
        {
          amount: 400,
          resource: "gold_treasure",
        },
      ],
    },
    allied: "vikings",
    rewards: [
      "Fishing Pier: Allows constructing 1 more Fishing Pier building in your city",
      "Beehive: Allows constructing 1 more Beehive building in your city",
    ],
  },
  {
    id: "tech_fa_30",
    name: "Kings Guard",
    column: 30,
    required: ["tech_fa_"],
    costs: {
      research_points: 140,
      coins: 1600000,
      food: 3300000,
      goods: [
        {
          amount: 3090,
          resource: "secondary_be",
        },
        {
          amount: 5150,
          resource: "tertiary_be",
        },
        {
          amount: 6170,
          resource: "secondary_fa",
        },
      ],
    },
    rewards: [
      "Heavy Infantry Barracks: Unlocks a Heavy Infantry Barracks upgrade",
    ],
  },
  {
    id: "tech_fa_31",
    name: "Improved Beekeeping",
    column: 31,
    required: ["tech_fa_"],
    costs: {
      research_points: 65,
      coins: 1500000,
      food: 2200000,
      goods: [
        {
          amount: 8280,
          resource: "tertiary_er",
        },
        {
          amount: 6440,
          resource: "tertiary_fa",
        },
        {
          amount: 1000,
          resource: "ceramic_treasure",
        },
      ],
    },
    allied: "vikings",
    rewards: [
      "Beehive: Unlocks a Beehive upgrade",
      "Beehive: Allows constructing 2 more Beehive buildings in your city",
    ],
  },
  {
    id: "tech_fa_32",
    name: "Faering Mastery",
    column: 32,
    required: ["tech_fa_"],
    costs: {
      research_points: 88,
      coins: 4300000,
      food: 1500000,
      goods: [
        {
          amount: 12150,
          resource: "tertiary_be",
        },
        {
          amount: 2610,
          resource: "secondary_fa",
        },
        {
          amount: 800,
          resource: "gold_treasure",
        },
      ],
    },
    allied: "vikings",
    rewards: [
      "Fishing Pier: Unlocks a Fishing Pier upgrade",
      "Sailor's Home: Allows constructing 1 more Sailor's Home building in your city",
      "Fishing Pier: Allows constructing 1 more Fishing Pier building in your city",
    ],
  },
  {
    id: "tech_fa_33",
    name: "Secondary Workshop",
    column: 33,
    required: ["tech_fa_"],
    costs: {
      research_points: 74,
      coins: 3500000,
      food: 1400000,
      goods: [
        {
          amount: 3720,
          resource: "primary_be",
        },
        {
          amount: 1680,
          resource: "secondary_af",
        },
        {
          amount: 4470,
          resource: "primary_fa",
        },
      ],
    },
    rewards: [
      "Secondary Workshop: Unlocks a Secondary Workshop upgrade",
      "Secondary Goods: Unlocks the good Secondary Goods for you, so that you can produce it in your city",
    ],
  },
  {
    id: "tech_fa_34",
    name: "Tertiary Workshop",
    column: 34,
    required: ["tech_fa_"],
    costs: {
      research_points: 68,
      coins: 2900000,
      food: 2600000,
      goods: [
        {
          amount: 2330,
          resource: "tertiary_be",
        },
        {
          amount: 2920,
          resource: "tertiary_af",
        },
        {
          amount: 4670,
          resource: "primary_fa",
        },
      ],
    },
    rewards: [
      "Tertiary Workshop: Unlocks a Tertiary Workshop upgrade",
      "Tertiary Goods: Unlocks the good Tertiary Goods for you, so that you can produce it in your city",
    ],
  },
  {
    id: "tech_fa_35",
    name: "Skaldic Poetry",
    column: 35,
    required: ["tech_fa_"],
    costs: {
      research_points: 75,
      coins: 5100000,
      food: 873000,
      goods: [
        {
          amount: 4360,
          resource: "secondary_be",
        },
        {
          amount: 1960,
          resource: "tertiary_af",
        },
        {
          amount: 5230,
          resource: "secondary_fa",
        },
      ],
    },
    allied: "vikings",
    rewards: [
      "Worker Home: Allows constructing 2 more Worker Home buildings in your city",
      "Tavern: Allows constructing 1 more Tavern building in your city",
      "Beehive: Allows constructing 1 more Beehive building in your city",
    ],
  },
  {
    id: "tech_fa_36",
    name: "Funeral at Sea",
    column: 36,
    required: ["tech_fa_"],
    costs: {
      research_points: 83,
      coins: 1300000,
      food: 2200000,
      goods: [
        {
          amount: 7970,
          resource: "tertiary_af",
        },
        {
          amount: 2280,
          resource: "tertiary_fa",
        },
        {
          amount: 1500,
          resource: "ceramic_treasure",
        },
      ],
    },
    allied: "vikings",
    rewards: [
      "Sailor's Home: Allows constructing 1 more Sailor's Home building in your city",
      "Fishing Pier: Allows constructing 1 more Fishing Pier building in your city",
    ],
  },
  {
    id: "tech_fa_37",
    name: "Transhumance",
    column: 37,
    required: ["tech_fa_"],
    costs: {
      research_points: 81,
      coins: 4099999.9999999995,
      food: 910000,
      goods: [
        {
          amount: 3600,
          resource: "primary_af",
        },
        {
          amount: 5590,
          resource: "tertiary_fa",
        },
        {
          amount: 1200,
          resource: "gold_treasure",
        },
      ],
    },
    rewards: ["Domestic Farm: Unlocks a Domestic Farm upgrade"],
  },
  {
    id: "tech_fa_38",
    name: "Healing Mead",
    column: 38,
    required: ["tech_fa_"],
    costs: {
      research_points: 91,
      coins: 5100000,
      food: 3000000,
      goods: [
        {
          amount: 8380,
          resource: "secondary_fa",
        },
        {
          amount: 2000,
          resource: "ceramic_treasure",
        },
        {
          amount: 1600,
          resource: "gold_treasure",
        },
      ],
    },
    allied: "vikings",
    rewards: [
      "Worker Home: Allows constructing 1 more Worker Home building in your city",
    ],
  },
];
