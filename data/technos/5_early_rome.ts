import { TechnoData } from "@/types/shared";

export const technos_ER: TechnoData[] = [
  {
    id: "er_0",
    name: "Municipium",
    column: 0,
    required: [],
    costs: {
      research_points: 26,
      coins: 352000,
      food: 249000,
      goods: [
        {
          amount: 1405,
          resource: "primary_ba",
        },
        {
          amount: 1875,
          resource: "primary_me",
        },
        {
          amount: 3375,
          resource: "primary_cg",
        },
      ],
    },
    rewards: [
      "Small Home: Unlocks a Small Home upgrade",
      "Luxurious Home: Unlocks a Luxurious Home upgrade",
      "Rural Farm: Unlocks a Rural Farm upgrade",
      "Luxurious Farm: Unlocks a Luxurious Farm upgrade",
      "City Hall: Unlocks a Great Hall upgrade",
    ],
  },
  {
    id: "er_1",
    name: "Hastati",
    column: 1,
    required: ["er_0"],
    costs: {
      research_points: 22,
      coins: 298000,
      food: 211000,
      goods: [
        {
          amount: 955,
          resource: "primary_me",
        },
        {
          amount: 1590,
          resource: "secondary_me",
        },
        {
          amount: 2860,
          resource: "tertiary_cg",
        },
      ],
    },
    rewards: [
      "Infantry Barracks: Unlocks a Infantry Barracks upgrade",
      "Small Home: Allows constructing 1 more Small Home building in your city",
      "Compact Culture Site: Unlocks a Compact Culture Site upgrade",
      "Luxurious Culture Site: Unlocks a Luxurious Culture Site upgrade",
    ],
  },
  {
    id: "er_2",
    name: "Rise of China",
    column: 1,
    required: ["er_0"],
    costs: {
      research_points: 37,
      coins: 498000,
      food: 352000,
      goods: [
        {
          amount: 3185,
          resource: "tertiary_me",
        },
        {
          amount: 5575,
          resource: "secondary_cg",
        },
      ],
    },
    allied: "china",
    rewards: [
      "Unlock City: Unlocks Allied Culture China",
      "Small Home: Unlocks the Small Home",
      "Luxurious Home: Unlocks the Luxurious Home",
    ],
  },
  {
    id: "er_3",
    name: "Rear Livestock",
    column: 2,
    required: ["er_1", "er_2"],
    costs: {
      research_points: 42,
      coins: 562000,
      food: 398000,
      goods: [
        {
          amount: 2250,
          resource: "primary_cg",
        },
        {
          amount: 1350,
          resource: "secondary_cg",
        },
        {
          amount: 5400,
          resource: "tertiary_cg",
        },
      ],
    },
    rewards: ["Domestic Farm: Unlocks a Domestic Farm upgrade"],
  },
  {
    id: "er_4",
    name: "Insulae",
    column: 2,
    required: ["er_1", "er_2"],
    costs: {
      research_points: 41,
      coins: 548000,
      food: 388000,
      goods: [
        {
          amount: 7020,
          resource: "primary_me",
        },
        {
          amount: 2195,
          resource: "secondary_cg",
        },
        {
          amount: 1315,
          resource: "tertiary_cg",
        },
      ],
    },
    rewards: [
      "Average Home: Unlocks a Average Home upgrade",
      "Moderate Culture Site: Unlocks a Moderate Culture Site upgrade",
      "+10000: Increased Trade Token Limit",
    ],
  },
  {
    id: "er_5",
    name: "Primary Workshop",
    column: 2,
    required: ["er_1", "er_2"],
    costs: {
      research_points: 30,
      coins: 402000,
      food: 285000,
      goods: [
        {
          amount: 3215,
          resource: "secondary_ba",
        },
        {
          amount: 4505,
          resource: "secondary_cg",
        },
      ],
    },
    rewards: [
      "Primary Workshop: Unlocks a Primary Workshop upgrade",
      "Primary Goods: Unlocks the good Primary Goods for you, so that you can produce it in your city",
      "Primary Workshop: Allows constructing 1 more Primary Workshop building in your city",
    ],
  },
  {
    id: "er_6",
    name: "Ink and Brush",
    column: 2,
    required: ["er_2"],
    costs: {
      research_points: 25,
      coins: 337000,
      food: 239000,
      goods: [
        {
          amount: 2250,
          resource: "tertiary_ba",
        },
        {
          amount: 810,
          resource: "primary_cg",
        },
        {
          amount: 3240,
          resource: "tertiary_cg",
        },
      ],
    },
    allied: "china",
    rewards: [
      "Rice Farm: Unlocks the Rice Farm",
      "Luxurious Rice Farm: Unlocks the Luxurious Rice Farm",
      "Average Home: Unlocks the Average Home",
    ],
  },
  {
    id: "er_7",
    name: "Marketplaces",
    column: 3,
    required: ["er_3", "er_4", "er_5"],
    costs: {
      research_points: 31,
      coins: 408000,
      food: 289000,
      goods: [
        {
          amount: 1305,
          resource: "tertiary_me",
        },
        {
          amount: 3915,
          resource: "primary_cg",
        },
        {
          amount: 1630,
          resource: "secondary_cg",
        },
      ],
    },
    rewards: [
      "Small Home: Unlocks a Small Home upgrade",
      "Rural Farm: Unlocks a Rural Farm upgrade",
      "Rural Farm: Allows constructing 1 more Rural Farm building in your city",
      "+100: Tradeable Goods per Offer",
    ],
  },
  {
    id: "er_8",
    name: "Sericulture",
    column: 3,
    required: ["er_6"],
    costs: {
      research_points: 24,
      coins: 321000,
      food: 227000,
      goods: [
        {
          amount: 1285,
          resource: "primary_cg",
        },
        {
          amount: 2050,
          resource: "primary_er",
        },
        {
          amount: 515,
          resource: "tertiary_er",
        },
      ],
    },
    allied: "china",
    rewards: [
      "Thread Processor: Unlocks the Thread Processor",
      "Silk Threads: Unlocks the good Silk Threads for you, so that you can produce it in your city",
      "Small Home: Allows constructing 2 more Small Home buildings in your city",
    ],
  },
  {
    id: "er_9",
    name: "Marks of History",
    column: 4,
    required: ["er_7"],
    costs: {
      research_points: 38,
      coins: 501000,
      food: 354000,
      goods: [
        {
          amount: 1600,
          resource: "primary_er",
        },
        {
          amount: 3740,
          resource: "secondary_er",
        },
      ],
    },
    rewards: [
      "Little Culture Site: Unlocks a Little Culture Site upgrade",
      "Little Culture Site: Allows constructing 1 more Little Culture Site building in your city",
      "Compact Culture Site: Allows constructing 1 more Compact Culture Site building in your city",
    ],
  },
  {
    id: "er_10",
    name: "Velites",
    column: 4,
    required: ["er_7"],
    costs: {
      research_points: 26,
      coins: 352000,
      food: 249000,
      goods: [
        {
          amount: 845,
          resource: "tertiary_cg",
        },
        {
          amount: 2250,
          resource: "primary_er",
        },
        {
          amount: 940,
          resource: "tertiary_er",
        },
      ],
    },
    rewards: [
      "Ranged Barracks: Unlocks a Ranged Barracks upgrade",
      "Average Home: Allows constructing 1 more Average Home building in your city",
    ],
  },
  {
    id: "er_11",
    name: "Silk Manufacture",
    column: 4,
    required: ["er_8"],
    costs: {
      research_points: 45,
      coins: 602000,
      food: 426000,
      goods: [
        {
          amount: 1445,
          resource: "secondary_cg",
        },
        {
          amount: 2405,
          resource: "tertiary_cg",
        },
        {
          amount: 3850,
          resource: "primary_er",
        },
      ],
    },
    allied: "china",
    rewards: [
      "Silk Workshop: Unlocks the Silk Workshop",
      "Silk: Unlocks the good Silk for you, so that you can produce it in your city",
      "Thread Processor: Allows constructing 1 more Thread Processor building in your city",
      "Small Home: Allows constructing 2 more Small Home buildings in your city",
      "Average Home: Allows constructing 1 more Average Home building in your city",
    ],
  },
  {
    id: "er_12",
    name: "Tributum Capitis",
    column: 5,
    required: ["er_9", "er_10"],
    costs: {
      research_points: 46,
      coins: 610000,
      food: 432000,
      goods: [
        {
          amount: 1955,
          resource: "secondary_er",
        },
        {
          amount: 4555,
          resource: "tertiary_er",
        },
      ],
    },
    rewards: [
      "Average Home: Unlocks a Average Home upgrade",
      "Domestic Farm: Unlocks a Domestic Farm upgrade",
      "Domestic Farm: Allows constructing 1 more Domestic Farm building in your city",
    ],
  },
  {
    id: "er_13",
    name: "Paddy Fields",
    column: 5,
    required: ["er_11"],
    costs: {
      research_points: 41,
      coins: 546000,
      food: 386000,
      goods: [
        {
          amount: 2620,
          resource: "primary_cg",
        },
        {
          amount: 4075,
          resource: "primary_er",
        },
        {
          amount: 500,
          resource: "silk",
        },
      ],
    },
    allied: "china",
    rewards: [
      "Rice Farm: Unlocks a Rice Farm upgrade",
      "Rice Farm: Allows constructing 2 more Rice Farm buildings in your city",
    ],
  },
  {
    id: "er_14",
    name: "Rammed Earth Houses",
    column: 5,
    required: ["er_11"],
    costs: {
      research_points: 45,
      coins: 599000,
      food: 424000,
      goods: [
        {
          amount: 1440,
          resource: "secondary_cg",
        },
        {
          amount: 3835,
          resource: "primary_er",
        },
        {
          amount: 1600,
          resource: "secondary_er",
        },
      ],
    },
    allied: "china",
    rewards: [
      "Small Home: Unlocks a Small Home upgrade",
      "Small Home: Allows constructing 3 more Small Home buildings in your city",
    ],
  },
  {
    id: "er_15",
    name: "Auxilia Riders",
    column: 6,
    required: ["er_12", "er_13"],
    costs: {
      research_points: 30,
      coins: 405000,
      food: 287000,
      goods: [
        {
          amount: 2700,
          resource: "primary_ba",
        },
        {
          amount: 2590,
          resource: "secondary_er",
        },
        {
          amount: 650,
          resource: "tertiary_er",
        },
      ],
    },
    rewards: ["Cavalry Barracks: Unlocks a Cavalry Barracks upgrade"],
  },
  {
    id: "er_16",
    name: "Calligraphy",
    column: 6,
    required: ["er_13", "er_14"],
    costs: {
      research_points: 34,
      coins: 447000,
      food: 316000,
      goods: [
        {
          amount: 1430,
          resource: "primary_er",
        },
        {
          amount: 3340,
          resource: "secondary_er",
        },
        {
          amount: 1000,
          resource: "silk",
        },
      ],
    },
    allied: "china",
    rewards: [
      "Average Home: Unlocks a Average Home upgrade",
      "Average Home: Allows constructing 1 more Average Home building in your city",
    ],
  },
  {
    id: "er_17",
    name: "Roman Providence",
    column: 7,
    required: ["er_15"],
    costs: {
      research_points: 42,
      coins: 562000,
      food: 398000,
      goods: [
        {
          amount: 900,
          resource: "primary_er",
        },
        {
          amount: 1500,
          resource: "secondary_er",
        },
        {
          amount: 3600,
          resource: "tertiary_er",
        },
      ],
    },
    rewards: [
      "Small Home: Unlocks a Small Home upgrade",
      "Rural Farm: Unlocks a Rural Farm upgrade",
      "Small Home: Allows constructing 1 more Small Home building in your city",
    ],
  },
  {
    id: "er_18",
    name: "Baked Bricks",
    column: 7,
    required: ["er_16"],
    costs: {
      research_points: 30,
      coins: 396000,
      food: 281000,
      goods: [
        {
          amount: 2540,
          resource: "secondary_me",
        },
        {
          amount: 2960,
          resource: "secondary_er",
        },
        {
          amount: 2500,
          resource: "silk",
        },
      ],
    },
    allied: "china",
    rewards: [
      "Small Home: Unlocks a Small Home upgrade",
      "Small Home: Allows constructing 3 more Small Home buildings in your city",
    ],
  },
  {
    id: "er_19",
    name: "Enhanced Paddy Fields",
    column: 7,
    required: ["er_16"],
    costs: {
      research_points: 48,
      coins: 636000,
      food: 450000,
      goods: [
        {
          amount: 3390,
          resource: "tertiary_me",
        },
        {
          amount: 4070,
          resource: "primary_er",
        },
        {
          amount: 1015,
          resource: "tertiary_er",
        },
      ],
    },
    allied: "china",
    rewards: [
      "Rice Farm: Unlocks a Rice Farm upgrade",
      "Rice Farm: Allows constructing 2 more Rice Farm buildings in your city",
    ],
  },
  {
    id: "er_20",
    name: "Refined Silk",
    column: 7,
    required: ["er_16"],
    costs: {
      research_points: 35,
      coins: 470000,
      food: 332000,
      goods: [
        {
          amount: 1125,
          resource: "primary_cg",
        },
        {
          amount: 1255,
          resource: "secondary_er",
        },
        {
          amount: 3005,
          resource: "tertiary_er",
        },
      ],
    },
    allied: "china",
    rewards: [
      "Thread Processor: Allows constructing 1 more Thread Processor building in your city",
      "Silk Workshop: Allows constructing 1 more Silk Workshop building in your city",
    ],
  },
  {
    id: "er_21",
    name: "Domus",
    column: 8,
    required: ["er_17"],
    costs: {
      research_points: 48,
      coins: 636000,
      food: 450000,
      goods: [
        {
          amount: 4745,
          resource: "secondary_er",
        },
        {
          amount: 2035,
          resource: "tertiary_er",
        },
        {
          amount: 4000,
          resource: "silk",
        },
      ],
    },
    rewards: [
      "Average Home: Unlocks a Average Home upgrade",
      "Domestic Farm: Unlocks a Domestic Farm upgrade",
    ],
  },
  {
    id: "er_22",
    name: "Triarii",
    column: 8,
    required: ["er_17"],
    costs: {
      research_points: 37,
      coins: 486000,
      food: 344000,
      goods: [
        {
          amount: 1170,
          resource: "tertiary_cg",
        },
        {
          amount: 1300,
          resource: "secondary_er",
        },
        {
          amount: 3115,
          resource: "tertiary_er",
        },
      ],
    },
    rewards: [
      "Heavy Infantry Barracks: Unlocks a Heavy Infantry Barracks upgrade",
    ],
  },
  {
    id: "er_23",
    name: "Dynastic Law",
    column: 8,
    required: ["er_18", "er_19", "er_20"],
    costs: {
      research_points: 47,
      coins: 633000,
      food: 448000,
      goods: [
        {
          amount: 3375,
          resource: "secondary_me",
        },
        {
          amount: 4050,
          resource: "primary_er",
        },
        {
          amount: 1015,
          resource: "secondary_er",
        },
      ],
    },
    allied: "china",
    rewards: [
      "Average Home: Unlocks a Average Home upgrade",
      "Average Home: Allows constructing 1 more Average Home building in your city",
    ],
  },
  {
    id: "er_24",
    name: "Watchtowers",
    column: 9,
    required: ["er_21"],
    costs: {
      research_points: 58,
      coins: 773000,
      food: 547000,
      goods: [
        {
          amount: 3715,
          resource: "primary_cg",
        },
        {
          amount: 5775,
          resource: "tertiary_er",
        },
      ],
    },
    rewards: ["Large Culture Site: Unlocks a Large Culture Site upgrade"],
  },
  {
    id: "er_25",
    name: "Secondary Workshop",
    column: 9,
    required: ["er_22"],
    costs: {
      research_points: 42,
      coins: 562000,
      food: 398000,
      goods: [
        {
          amount: 4200,
          resource: "primary_er",
        },
        {
          amount: 1800,
          resource: "tertiary_er",
        },
        {
          amount: 6000,
          resource: "silk",
        },
      ],
    },
    rewards: [
      "Secondary Workshop: Unlocks a Secondary Workshop upgrade",
      "Secondary Goods: Unlocks the good Secondary Goods for you, so that you can produce it in your city",
    ],
  },
  {
    id: "er_26",
    name: "Silk Mastery",
    column: 9,
    required: ["er_23"],
    costs: {
      research_points: 44,
      coins: 591000,
      food: 418000,
      goods: [
        {
          amount: 2365,
          resource: "secondary_cg",
        },
        {
          amount: 1420,
          resource: "tertiary_cg",
        },
        {
          amount: 3780,
          resource: "tertiary_er",
        },
      ],
    },
    allied: "china",
    rewards: [
      "Thread Processor: Allows constructing 1 more Thread Processor building in your city",
      "Small Home: Allows constructing 2 more Small Home buildings in your city",
      "Average Home: Allows constructing 1 more Average Home building in your city",
    ],
  },
  {
    id: "er_27",
    name: "Tertiary Workshop",
    column: 10,
    required: ["er_24", "er_25", "er_26"],
    costs: {
      research_points: 40,
      coins: 534000,
      food: 378000,
      goods: [
        {
          amount: 1710,
          resource: "primary_er",
        },
        {
          amount: 3990,
          resource: "secondary_er",
        },
        {
          amount: 8000,
          resource: "silk",
        },
      ],
    },
    rewards: [
      "Tertiary Workshop: Unlocks a Tertiary Workshop upgrade",
      "Tertiary Goods: Unlocks the good Tertiary Goods for you, so that you can produce it in your city",
    ],
  },
];
