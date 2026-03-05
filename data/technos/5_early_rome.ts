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
      {
        title: "Small Home",
        desc: "Unlocks a Small Home upgrade",
        img: { kind: "wiki", imageName: "Capital_Small_Home_Lv", level: 13 },
      },
      {
        title: "Luxurious Home",
        desc: "Unlocks a Luxurious Home upgrade",
        img: {
          kind: "wiki",
          imageName: "Capital_Luxurious_Home_Lv",
          level: 15,
        },
      },
      {
        title: "Rural Farm",
        desc: "Unlocks a Rural Farm upgrade",
        img: { kind: "wiki", imageName: "Capital_Rural_Farm_Lv", level: 13 },
      },
      {
        title: "Luxurious Farm",
        desc: "Unlocks a Luxurious Farm upgrade",
        img: {
          kind: "wiki",
          imageName: "Capital_Luxurious_Farm_Lv",
          level: 15,
        },
      },
      {
        title: "City Hall",
        desc: "Unlocks a Great Hall upgrade",
        img: { kind: "catalog", imgType: "museum", invert: true },
      },
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
      {
        title: "Infantry Barracks",
        desc: "Unlocks a Infantry Barracks upgrade",
        img: {
          kind: "wiki",
          imageName: "Capital_Infantry_Barracks_Lv",
          level: 5,
        },
      },
      {
        title: "Small Home",
        desc: "Allows constructing 1 more Small Home building in your city",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
      {
        title: "Compact Culture Site",
        desc: "Unlocks a Compact Culture Site upgrade",
        img: {
          kind: "wiki",
          imageName: "Capital_Compact_Culture_Site_Lv",
          level: 5,
        },
      },
      {
        title: "Luxurious Culture Site",
        desc: "Unlocks a Luxurious Culture Site upgrade",
        img: {
          kind: "wiki",
          imageName: "Capital_Luxurious_Culture_Site_Lv",
          level: 5,
        },
      },
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
      {
        title: "Unlock City",
        desc: "Unlocks Allied Culture China",
        img: { kind: "catalog", imgType: "china" },
      },
      {
        title: "Small Home",
        desc: "Unlocks the Small Home",
        img: { kind: "wiki", imageName: "China_Small_Home_Lv", level: 1 },
      },
      {
        title: "Luxurious Home",
        desc: "Unlocks the Luxurious Home",
        img: { kind: "wiki", imageName: "China_Luxurious_Home_Lv", level: 3 },
      },
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
    rewards: [
      {
        title: "Domestic Farm",
        desc: "Unlocks a Domestic Farm upgrade",
        img: { kind: "wiki", imageName: "Capital_Domestic_Farm_Lv", level: 13 },
      },
    ],
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
      {
        title: "Average Home",
        desc: "Unlocks a Average Home upgrade",
        img: { kind: "wiki", imageName: "Capital_Average_Home_Lv", level: 13 },
      },
      {
        title: "Moderate Culture Site",
        desc: "Unlocks a Moderate Culture Site upgrade",
        img: {
          kind: "wiki",
          imageName: "Capital_Moderate_Culture_Site_Lv",
          level: 5,
        },
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
    id: "er_5",
    name: "Primary Good",
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
      {
        title: "Primary Good",
        desc: "Unlocks a Primary Good upgrade",
        img: { kind: "good", priority: "primary" },
      },
      {
        title: "Primary Workshop",
        desc: "Unlocks the good Primary Goods for you, so that you can produce it in your city",
        img: { kind: "catalog", imgType: "workshop", invert: true },
      },
      {
        title: "+1 Primary Workshop",
        desc: "Allows constructing 1 more Primary Workshop building in your city",
        img: { kind: "catalog", imgType: "workshop", invert: true },
      },
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
      {
        title: "Rice Farm",
        desc: "Unlocks the Rice Farm",
        img: { kind: "wiki", imageName: "China_Rice_Farm_Lv", level: 1 },
      },
      {
        title: "Luxurious Rice Farm",
        desc: "Unlocks the Luxurious Rice Farm",
        img: {
          kind: "wiki",
          imageName: "China_Luxurious_Rice_Farm_Lv",
          level: 3,
        },
      },
      {
        title: "Average Home",
        desc: "Unlocks the Average Home",
        img: { kind: "wiki", imageName: "China_Average_Home_Lv", level: 1 },
      },
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
      {
        title: "Small Home",
        desc: "Unlocks a Small Home upgrade",
        img: { kind: "wiki", imageName: "Capital_Small_Home_Lv", level: 14 },
      },
      {
        title: "Rural Farm",
        desc: "Unlocks a Rural Farm upgrade",
        img: { kind: "wiki", imageName: "Capital_Rural_Farm_Lv", level: 14 },
      },
      {
        title: "Rural Farm",
        desc: "Allows constructing 1 more Rural Farm building in your city",
        img: { kind: "catalog", imgType: "barn", invert: true },
      },
      {
        title: "+100",
        desc: "Tradeable Goods per Offer",
        img: {
          kind: "local",
          path: "/images/technos/features/icon_limittradinggoods.webp",
        },
      },
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
      {
        title: "Thread Processor",
        desc: "Unlocks the Thread Processor",
        img: { kind: "wiki", imageName: "China_Thread_Processor" },
      },
      {
        title: "Silk Threads",
        desc: "Unlocks the good Silk Threads for you, so that you can produce it in China",
        img: { kind: "local", path: "/images/goods-large/silk_threads.webp" },
      },
      {
        title: "Small Home",
        desc: "Allows constructing 2 more Small Home buildings in China",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
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
      {
        title: "Little Culture Site",
        desc: "Unlocks a Little Culture Site upgrade",
        img: {
          kind: "wiki",
          imageName: "Capital_Little_Culture_Site_Lv",
          level: 5,
        },
      },
      {
        title: "Little Culture Site",
        desc: "Allows constructing 1 more Little Culture Site building in your city",
        img: { kind: "catalog", imgType: "cultureSite", invert: true },
      },
      {
        title: "Compact Culture Site",
        desc: "Allows constructing 1 more Compact Culture Site building in your city",
        img: { kind: "catalog", imgType: "cultureSite", invert: true },
      },
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
      {
        title: "Ranged Barracks",
        desc: "Unlocks a Ranged Barracks upgrade",
        img: {
          kind: "wiki",
          imageName: "Capital_Ranged_Barracks_Lv",
          level: 5,
        },
      },
      {
        title: "Average Home",
        desc: "Allows constructing 1 more Average Home building in your city",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
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
      {
        title: "Silk Workshop",
        desc: "Unlocks the Silk Workshop",
        img: { kind: "wiki", imageName: "China_Silk_Workshop" },
      },
      {
        title: "Silk",
        desc: "Unlocks the good Silk for you, so that you can produce it in China",
        img: { kind: "local", path: "/images/goods-large/silk.webp" },
      },
      {
        title: "+1 Thread Processor",
        desc: "Allows constructing 1 more Thread Processor building in China",
        img: { kind: "catalog", imgType: "workshop", invert: true },
      },
      {
        title: "+2 Small Home",
        desc: "Allows constructing 2 more Small Home buildings in China",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
      {
        title: "+1 Average Home",
        desc: "Allows constructing 1 more Average Home building in China",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
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
      {
        title: "Average Home",
        desc: "Unlocks a Average Home upgrade",
        img: { kind: "wiki", imageName: "Capital_Average_Home_Lv", level: 14 },
      },
      {
        title: "Domestic Farm",
        desc: "Unlocks a Domestic Farm upgrade",
        img: { kind: "wiki", imageName: "Capital_Domestic_Farm_Lv", level: 14 },
      },
      {
        title: "Domestic Farm",
        desc: "Allows constructing 1 more Domestic Farm building in your city",
        img: { kind: "catalog", imgType: "barn", invert: true },
      },
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
      {
        title: "Rice Farm",
        desc: "Unlocks a Rice Farm upgrade",
        img: { kind: "wiki", imageName: "China_Rice_Farm_Lv", level: 2 },
      },
      {
        title: "Rice Farm",
        desc: "Allows constructing 2 more Rice Farm buildings in China",
        img: { kind: "catalog", imgType: "riceFarm", invert: true },
      },
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
      {
        title: "Small Home",
        desc: "Unlocks a Small Home upgrade",
        img: { kind: "wiki", imageName: "China_Small_Home_Lv", level: 2 },
      },
      {
        title: "Small Home",
        desc: "Allows constructing 3 more Small Home buildings in your city",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
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
    rewards: [
      {
        title: "Cavalry Barracks",
        desc: "Unlocks a Cavalry Barracks upgrade",
        img: {
          kind: "wiki",
          imageName: "Capital_Cavalry_Barracks_Lv",
          level: 5,
        },
      },
    ],
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
      {
        title: "Average Home",
        desc: "Unlocks a Average Home upgrade",
        img: { kind: "wiki", imageName: "China_Average_Home_Lv", level: 2 },
      },
      {
        title: "Average Home",
        desc: "Allows constructing 1 more Average Home building in China",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
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
      {
        title: "Small Home",
        desc: "Unlocks a Small Home upgrade",
        img: { kind: "wiki", imageName: "Capital_Small_Home_Lv", level: 15 },
      },
      {
        title: "Rural Farm",
        desc: "Unlocks a Rural Farm upgrade",
        img: { kind: "wiki", imageName: "Capital_Rural_Farm_Lv", level: 15 },
      },
      {
        title: "Small Home",
        desc: "Allows constructing 1 more Small Home building in your city",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
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
      {
        title: "Small Home",
        desc: "Unlocks a Small Home upgrade",
        img: { kind: "wiki", imageName: "China_Small_Home_Lv", level: 3 },
      },
      {
        title: "Small Home",
        desc: "Allows constructing 3 more Small Home buildings in China",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
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
      {
        title: "Rice Farm",
        desc: "Unlocks a Rice Farm upgrade",
        img: { kind: "wiki", imageName: "China_Rice_Farm_Lv", level: 3 },
      },
      {
        title: "Rice Farm",
        desc: "Allows constructing 2 more Rice Farm buildings in China",
        img: { kind: "catalog", imgType: "riceFarm", invert: true },
      },
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
      {
        title: "Thread Processor",
        desc: "Allows constructing 1 more Thread Processor building in your city",
        img: { kind: "catalog", imgType: "workshop", invert: true },
      },
      {
        title: "Silk Workshop",
        desc: "Allows constructing 1 more Silk Workshop building in your city",
        img: { kind: "catalog", imgType: "workshop", invert: true },
      },
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
      {
        title: "Average Home",
        desc: "Unlocks a Average Home upgrade",
        img: { kind: "wiki", imageName: "Capital_Average_Home_Lv", level: 15 },
      },
      {
        title: "Domestic Farm",
        desc: "Unlocks a Domestic Farm upgrade",
        img: { kind: "wiki", imageName: "Capital_Domestic_Farm_Lv", level: 15 },
      },
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
      {
        title: "Heavy Infantry Barracks",
        desc: "Unlocks a Heavy Infantry Barracks upgrade",
        img: {
          kind: "wiki",
          imageName: "Capital_Heavy_Infantry_Barracks_Lv",
          level: 5,
        },
      },
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
      {
        title: "Average Home",
        desc: "Unlocks a Average Home upgrade",
        img: { kind: "wiki", imageName: "China_Average_Home_Lv", level: 3 },
      },
      {
        title: "Average Home",
        desc: "Allows constructing 1 more Average Home building in China",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
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
    rewards: [
      {
        title: "Large Culture Site",
        desc: "Unlocks a Large Culture Site upgrade",
        img: {
          kind: "wiki",
          imageName: "Capital_Large_Culture_Site_Lv",
          level: 5,
        },
      },
    ],
  },
  {
    id: "er_25",
    name: "Secondary Good",
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
      {
        title: "Secondary Good",
        desc: "Unlocks a Secondary Good upgrade",
        img: { kind: "good", priority: "secondary" },
      },
      {
        title: "Secondary Workshop",
        desc: "Unlocks the Secondary workshop for you, so that you can produce it in your city",
        img: { kind: "catalog", imgType: "workshop", invert: true },
      },
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
      {
        title: "Thread Processor",
        desc: "Allows constructing 1 more Thread Processor building in your city",
        img: { kind: "catalog", imgType: "workshop", invert: true },
      },
      {
        title: "Small Home",
        desc: "Allows constructing 2 more Small Home buildings in your city",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
      {
        title: "Average Home",
        desc: "Allows constructing 1 more Average Home building in your city",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
    ],
  },
  {
    id: "er_27",
    name: "Tertiary Good",
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
      {
        title: "Tertiary Good",
        desc: "Unlocks a Tertiary Good upgrade",
        img: { kind: "good", priority: "tertiary" },
      },
      {
        title: "Tertiary Workshop",
        desc: "Unlocks the Tertiary workshop for you, so that you can produce it in your city",
        img: { kind: "catalog", imgType: "workshop", invert: true },
      },
    ],
  },
];
