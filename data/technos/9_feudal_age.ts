import { TechnoData } from "@/types/shared";

export const technos_FA: TechnoData[] = [
  {
    id: "fa_0",
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
      {
        title: "Small Home",
        desc: "Unlocks a Small Home upgrade",
        img: { kind: "wiki", imageName: "Capital_Small_Home_Lv", level: 25 },
      },
      {
        title: "Rural Farm",
        desc: "Unlocks a Rural Farm upgrade",
        img: { kind: "wiki", imageName: "Capital_Rural_Farm_Lv", level: 25 },
      },
      {
        title: "City Hall",
        desc: "Unlocks a Great Hall upgrade",
        img: { kind: "catalog", imgType: "museum", invert: true },
      },
    ],
  },
  {
    id: "fa_1",
    name: "Axemen",
    column: 1,
    required: ["fa_0"],
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
      {
        title: "Infantry Barracks",
        desc: "Unlocks a Infantry Barracks upgrade",
        img: {
          kind: "wiki",
          imageName: "Capital_Infantry_Barracks_Lv",
          level: 9,
        },
      },
      {
        title: "Moderate Culture Site",
        desc: "Unlocks a Moderate Culture Site upgrade",
        img: {
          kind: "wiki",
          imageName: "Capital_Moderate_Culture_Site_Lv",
          level: 9,
        },
      },
    ],
  },
  {
    id: "fa_2",
    name: "Rise of the Vikings",
    column: 1,
    required: ["fa_0"],
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
      {
        title: "Unlock City",
        desc: "Unlocks Allied Culture Viking Kingdom!",
        img: { kind: "catalog", imgType: "vikings" },
      },
      {
        title: "Worker Home",
        desc: "Unlocks the Worker Home",
        img: { kind: "wiki", imageName: "Viking_Worker_Home_Lv", level: 1 },
      },
      {
        title: "Beehive",
        desc: "Unlocks the Beehive",
        img: { kind: "wiki", imageName: "Viking_Beehive_Lv", level: 1 },
      },
    ],
  },
  {
    id: "fa_3",
    name: "Myths and Legends",
    column: 2,
    required: ["fa_1"],
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
      {
        title: "Average Home",
        desc: "Unlocks a Average Home upgrade",
        img: { kind: "wiki", imageName: "Capital_Average_Home_Lv", level: 25 },
      },
      {
        title: "Compact Culture Site",
        desc: "Unlocks a Compact Culture Site upgrade",
        img: {
          kind: "wiki",
          imageName: "Capital_Compact_Culture_Site_Lv",
          level: 9,
        },
      },
    ],
  },
  {
    id: "fa_4",
    name: "Primary Good",
    column: 2,
    required: ["fa_1"],
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
        desc: "Increase Trade Token Limit",
        img: {
          kind: "local",
          path: "/images/technos/features/icon_limittradingtokens.webp",
        },
      },
    ],
  },
  {
    id: "fa_5",
    name: "Seafaring",
    column: 2,
    required: ["fa_2"],
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
      {
        title: "Sailor's Home",
        desc: "Unlocks the Sailor's Home",
        img: { kind: "wiki", imageName: "Viking_Sailor_Home_Lv", level: 1 },
      },
      {
        title: "Fishing Pier",
        desc: "Unlocks the Fishing Pier",
        img: { kind: "wiki", imageName: "Viking_Fishing_Pier_Lv", level: 1 },
      },
      {
        title: "Luxurious Home",
        desc: "Unlocks the Premium Home",
        img: { kind: "wiki", imageName: "Viking_Luxurious_Home_Lv", level: 3 },
      },
      {
        title: "Luxurious Fishing Pier",
        desc: "Unlocks the Luxurious Fishing Pier",
        img: {
          kind: "wiki",
          imageName: "Viking_Luxurious_Fishing_Pier_Lv",
          level: 3,
        },
      },
    ],
  },
  {
    id: "fa_6",
    name: "Domestic Sheep",
    column: 3,
    required: ["fa_3", "fa_4"],
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
      {
        title: "Domestic Farm",
        desc: "Unlocks a Domestic Farm upgrade",
        img: { kind: "wiki", imageName: "Capital_Domestic_Farm_Lv", level: 25 },
      },
      {
        title: "Little Culture Site",
        desc: "Unlocks a Little Culture Site upgrade",
        img: {
          kind: "wiki",
          imageName: "Capital_Little_Culture_Site_Lv",
          level: 9,
        },
      },
    ],
  },
  {
    id: "fa_7",
    name: "Repurposed Ruins",
    column: 3,
    required: ["fa_4"],
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
      {
        title: "Small Home",
        desc: "Unlocks a Small Home upgrade",
        img: { kind: "wiki", imageName: "Capital_Small_Home_Lv", level: 26 },
      },
      {
        title: "Large Culture Site",
        desc: "Unlocks a Large Culture Site upgrade",
        img: {
          kind: "wiki",
          imageName: "Capital_Large_Culture_Site_Lv",
          level: 9,
        },
      },
    ],
  },
  {
    id: "fa_8",
    name: "Mead Brewery",
    column: 3,
    required: ["fa_5"],
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
      {
        title: "Tavern",
        desc: "Unlocks the Tavern",
        img: { kind: "wiki", imageName: "Viking_Tavern_Lv", level: 1 },
      },
      {
        title: "Mead",
        desc: "Unlocks the good Mead for you, so that you can produce it in Viking Kingdom",
        img: { kind: "local", path: "/images/goods-large/mead.webp" },
      },
      {
        title: "Tavern Runestone",
        desc: "Unlocks the Tavern Runestone",
        img: { kind: "wiki", imageName: "Viking_Tavern_Runestone" },
      },
      {
        title: "Worker Home",
        desc: "Allows constructing 2 more Worker Home buildings in Viking Kingdom",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
      {
        title: "Sailor's Home",
        desc: "Allows constructing 1 more Sailor's Home building in Viking Kingdom",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
    ],
  },
  {
    id: "fa_9",
    name: "Longbowmen",
    column: 4,
    required: ["fa_6", "fa_7", "fa_8"],
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
    rewards: [
      {
        title: "Ranged Barracks",
        desc: "Unlocks a Ranged Barracks upgrade",
        img: {
          kind: "wiki",
          imageName: "Capital_Ranged_Barracks_Lv",
          level: 9,
        },
      },
    ],
  },
  {
    id: "fa_10",
    name: "Plundering Raids",
    column: 4,
    required: ["fa_8"],
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
      {
        title: "Expedition Pier",
        desc: "Unlocks the Expedition Pier",
        img: { kind: "wiki", imageName: "Viking_Expedition_Pier" },
      },
      {
        title: "Ceramic Treasure",
        desc: "Unlocks the good Ceramic Treasure for you, so that you can produce it in Viking Kingdom",
        img: {
          kind: "local",
          path: "/images/goods-large/ceramic_treasure.webp",
        },
      },
      {
        title: "Gold Treasure",
        desc: "Unlocks the good Gold Treasure for you, so that you can produce it in Viking Kingdom",
        img: { kind: "local", path: "/images/goods-large/gold_treasure.webp" },
      },
      {
        title: "Luxurious Sailing Port",
        desc: "Unlocks the Luxurious Sailing Port",
        img: {
          kind: "wiki",
          imageName: "Viking_Luxurious_Sailor_Port_Lv",
          level: 1,
        },
      },
      {
        title: "Sailor's Home",
        desc: "Allows constructing 2 more Sailor's Home buildings in Viking Kingdom",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
    ],
  },
  {
    id: "fa_11",
    name: "Tafl Games",
    column: 4,
    required: ["fa_8"],
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
      {
        title: "Worker Home",
        desc: "Allows constructing 2 more Worker Home buildings in Viking Kingdom",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
      {
        title: "Fishing Pier",
        desc: "Allows constructing 1 more Fishing Pier building in Viking Kingdom",
        img: { kind: "catalog", imgType: "fishingPier", invert: true },
      },
      {
        title: "Beehive",
        desc: "Allows constructing 1 more Beehive building in Viking Kingdom",
        img: { kind: "catalog", imgType: "beehive", invert: true },
      },
    ],
  },
  {
    id: "fa_12",
    name: "Open Field System",
    column: 5,
    required: ["fa_9"],
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
    rewards: [
      {
        title: "Rural Farm",
        desc: "Unlocks a Rural Farm upgrade",
        img: { kind: "wiki", imageName: "Capital_Rural_Farm_Lv", level: 26 },
      },
    ],
  },
  {
    id: "fa_13",
    name: "Peaked Roofs",
    column: 5,
    required: ["fa_9"],
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
    rewards: [
      {
        title: "Average Home",
        desc: "Unlocks a Average Home upgrade",
        img: { kind: "wiki", imageName: "Capital_Average_Home_Lv", level: 26 },
      },
    ],
  },
  {
    id: "fa_14",
    name: "Thralls and Jarls",
    column: 5,
    required: ["fa_10", "fa_11"],
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
      {
        title: "Worker Home",
        desc: "Unlocks a Worker Home upgrade",
        img: { kind: "wiki", imageName: "Viking_Worker_Home_Lv", level: 2 },
      },
      {
        title: "Worker Home",
        desc: "Allows constructing 1 more Worker Home building in Viking Kingdom",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
      {
        title: "Beehive",
        desc: "Allows constructing 2 more Beehive buildings in Viking Kingdom",
        img: { kind: "catalog", imgType: "beehive", invert: true },
      },
    ],
  },
  {
    id: "fa_15",
    name: "Jarldom",
    column: 5,
    required: ["fa_10", "fa_11"],
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
      {
        title: "Sailor's Home",
        desc: "Unlocks a Sailor's Home upgrade",
        img: { kind: "wiki", imageName: "Viking_Sailor_Home_Lv", level: 2 },
      },
      {
        title: "Worker Home",
        desc: "Allows constructing 1 more Worker Home building in Viking Kingdom",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
      {
        title: "Tavern",
        desc: "Allows constructing 1 more Tavern building in Viking Kingdom",
        img: { kind: "catalog", imgType: "workshop", invert: true },
      },
    ],
  },
  {
    id: "fa_16",
    name: "Knights",
    column: 6,
    required: ["fa_12", "fa_13", "fa_14", "fa_15"],
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
    rewards: [
      {
        title: "Cavalry Barracks",
        desc: "Unlocks a Cavalry Barracks upgrade",
        img: {
          kind: "wiki",
          imageName: "Capital_Cavalry_Barracks_Lv",
          level: 9,
        },
      },
    ],
  },
  {
    id: "fa_17",
    name: "Beekeeping",
    column: 6,
    required: ["fa_14", "fa_15"],
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
    rewards: [
      {
        title: "Beehive",
        desc: "Unlocks a Beehive upgrade",
        img: { kind: "wiki", imageName: "Viking_Beehive_Lv", level: 2 },
      },
    ],
  },
  {
    id: "fa_18",
    name: "Tar Ovens",
    column: 6,
    required: ["fa_14", "fa_15"],
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
      {
        title: "Sailor's Home",
        desc: "Allows constructing 1 more Sailor's Home building in Viking Kingdom",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
      {
        title: "Fishing Pier",
        desc: "Allows constructing 1 more Fishing Pier building in Viking Kingdom",
        img: { kind: "catalog", imgType: "fishingPier", invert: true },
      },
    ],
  },
  {
    id: "fa_19",
    name: "Manorialism",
    column: 7,
    required: ["fa_16", "fa_17"],
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
      {
        title: "Domestic Farm",
        desc: "Allows constructing 1 more Domestic Farm building in your city",
        img: { kind: "catalog", imgType: "barn", invert: true },
      },
      {
        title: "Small Home",
        desc: "Allows constructing 1 more Small Home building in your city",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
    ],
  },
  {
    id: "fa_20",
    name: "Fishing Nets",
    column: 7,
    required: ["fa_17", "fa_18"],
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
      {
        title: "Fishing Pier",
        desc: "Unlocks a Fishing Pier upgrade",
        img: { kind: "wiki", imageName: "Viking_Fishing_Pier_Lv", level: 2 },
      },
      {
        title: "Expedition Pier",
        desc: "Allows constructing 1 more Expedition Pier building in Viking Kingdom",
        img: { kind: "catalog", imgType: "workshop", invert: true },
      },
      {
        title: "Tavern",
        desc: "Allows constructing 1 more Tavern building in Viking Kingdom",
        img: { kind: "catalog", imgType: "workshop", invert: true },
      },
    ],
  },
  {
    id: "fa_21",
    name: "Trebuchets",
    column: 8,
    required: ["fa_19"],
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
    rewards: [
      {
        title: "Siege Barracks",
        desc: "Unlocks a Siege Barracks upgrade",
        img: { kind: "wiki", imageName: "Capital_Siege_Barracks_Lv", level: 9 },
      },
    ],
  },
  {
    id: "fa_22",
    name: "Pictograms",
    column: 8,
    required: ["fa_20"],
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
      {
        title: "Sailor's Home",
        desc: "Allows constructing 2 more Sailor's Home buildings in Viking Kingdom",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
      {
        title: "Worker Home",
        desc: "Allows constructing 2 more Worker Home buildings in Viking Kingdom",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
      {
        title: "Beehive",
        desc: "Allows constructing 1 more Beehive building in Viking Kingdom",
        img: { kind: "catalog", imgType: "beehive", invert: true },
      },
    ],
  },
  {
    id: "fa_23",
    name: "Timber Framing",
    column: 9,
    required: ["fa_21", "fa_22"],
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
    rewards: [
      {
        title: "Small Home",
        desc: "Unlocks a Small Home upgrade",
        img: { kind: "wiki", imageName: "Capital_Small_Home_Lv", level: 27 },
      },
    ],
  },
  {
    id: "fa_24",
    name: "Sheep Herds",
    column: 9,
    required: ["fa_21", "fa_22"],
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
    rewards: [
      {
        title: "Domestic Farm",
        desc: "Unlocks a Domestic Farm upgrade",
        img: { kind: "wiki", imageName: "Capital_Domestic_Farm_Lv", level: 26 },
      },
    ],
  },
  {
    id: "fa_25",
    name: "Burial Sites",
    column: 9,
    required: ["fa_22"],
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
      {
        title: "Worker Home",
        desc: "Unlocks a Worker Home upgrade",
        img: { kind: "wiki", imageName: "Viking_Worker_Home_Lv", level: 3 },
      },
      {
        title: "Worker Home",
        desc: "Allows constructing 2 more Worker Home buildings in Viking Kingdom",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
      {
        title: "Beehive",
        desc: "Allows constructing 1 more Beehive building in Viking Kingdom",
        img: { kind: "catalog", imgType: "beehive", invert: true },
      },
    ],
  },
  {
    id: "fa_26",
    name: "Sagas",
    column: 9,
    required: ["fa_22"],
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
      {
        title: "Sailor's Home",
        desc: "Unlocks a Sailor's Home upgrade",
        img: { kind: "wiki", imageName: "Viking_Sailor_Home_Lv", level: 3 },
      },
      {
        title: "Sailor's Home",
        desc: "Allows constructing 1 more Sailor's Home building in Viking Kingdom",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
      {
        title: "Expedition Pier",
        desc: "Allows constructing 1 more Expedition Pier building in Viking Kingdom",
        img: { kind: "catalog", imgType: "workshop", invert: true },
      },
      {
        title: "Tavern",
        desc: "Allows constructing 1 more Tavern building in Viking Kingdom",
        img: { kind: "catalog", imgType: "workshop", invert: true },
      },
    ],
  },
  {
    id: "fa_27",
    name: "Ridge and Furrow",
    column: 10,
    required: ["fa_23", "fa_24"],
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
    rewards: [
      {
        title: "Rural Farm",
        desc: "Unlocks a Rural Farm upgrade",
        img: { kind: "wiki", imageName: "Capital_Rural_Farm_Lv", level: 27 },
      },
    ],
  },
  {
    id: "fa_28",
    name: "Castle",
    column: 10,
    required: ["fa_23", "fa_24"],
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
      {
        title: "Average Home",
        desc: "Unlocks a Average Home upgrade",
        img: { kind: "wiki", imageName: "Capital_Average_Home_Lv", level: 27 },
      },
      {
        title: "Average Home",
        desc: "Allows constructing 1 more Average Home building in your city",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
    ],
  },
  {
    id: "fa_29",
    name: "Runic Writing",
    column: 10,
    required: ["fa_25", "fa_26"],
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
      {
        title: "Fishing Pier",
        desc: "Allows constructing 1 more Fishing Pier building in Viking Kingdom",
        img: { kind: "catalog", imgType: "fishingPier", invert: true },
      },
      {
        title: "Beehive",
        desc: "Allows constructing 1 more Beehive building in Viking Kingdom",
        img: { kind: "catalog", imgType: "beehive", invert: true },
      },
    ],
  },
  {
    id: "fa_30",
    name: "Kings Guard",
    column: 11,
    required: ["fa_27", "fa_28"],
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
      {
        title: "Heavy Infantry Barracks",
        desc: "Unlocks a Heavy Infantry Barracks upgrade",
        img: {
          kind: "wiki",
          imageName: "Capital_Heavy_Infantry_Barracks_Lv",
          level: 9,
        },
      },
    ],
  },
  {
    id: "fa_31",
    name: "Improved Beekeeping",
    column: 11,
    required: ["fa_29"],
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
      {
        title: "Beehive",
        desc: "Unlocks a Beehive upgrade",
        img: { kind: "wiki", imageName: "Viking_Beehive_Lv", level: 3 },
      },
      {
        title: "Beehive",
        desc: "Allows constructing 2 more Beehive buildings in Viking Kingdom",
        img: { kind: "catalog", imgType: "beehive", invert: true },
      },
    ],
  },
  {
    id: "fa_32",
    name: "Faering Mastery",
    column: 11,
    required: ["fa_29"],
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
      {
        title: "Fishing Pier",
        desc: "Unlocks a Fishing Pier upgrade",
        img: { kind: "wiki", imageName: "Viking_Fishing_Pier_Lv", level: 3 },
      },
      {
        title: "Sailor's Home",
        desc: "Allows constructing 1 more Sailor's Home building in Viking Kingdom",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
      {
        title: "Fishing Pier",
        desc: "Allows constructing 1 more Fishing Pier building in Viking Kingdom",
        img: { kind: "catalog", imgType: "fishingPier", invert: true },
      },
    ],
  },
  {
    id: "fa_33",
    name: "Secondary Good",
    column: 12,
    required: ["fa_30"],
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
    id: "fa_34",
    name: "Tertiary Good",
    column: 12,
    required: ["fa_30"],
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
    id: "fa_35",
    name: "Skaldic Poetry",
    column: 12,
    required: ["fa_31", "fa_32"],
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
      {
        title: "Worker Home",
        desc: "Allows constructing 2 more Worker Home buildings in Viking Kingdom",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
      {
        title: "Tavern",
        desc: "Allows constructing 1 more Tavern building in Viking Kingdom",
        img: { kind: "catalog", imgType: "workshop", invert: true },
      },
      {
        title: "Beehive",
        desc: "Allows constructing 1 more Beehive building in Viking Kingdom",
        img: { kind: "catalog", imgType: "beehive", invert: true },
      },
    ],
  },
  {
    id: "fa_36",
    name: "Funeral at Sea",
    column: 12,
    required: ["fa_31", "fa_32"],
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
      {
        title: "Sailor's Home",
        desc: "Allows constructing 1 more Sailor's Home building in Viking Kingdom",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
      {
        title: "Fishing Pier",
        desc: "Allows constructing 1 more Fishing Pier building in Viking Kingdom",
        img: { kind: "catalog", imgType: "fishingPier", invert: true },
      },
    ],
  },
  {
    id: "fa_37",
    name: "Transhumance",
    column: 13,
    required: ["fa_33", "fa_34"],
    costs: {
      research_points: 81,
      coins: 410000,
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
    rewards: [
      {
        title: "Domestic Farm",
        desc: "Unlocks a Domestic Farm upgrade",
        img: { kind: "wiki", imageName: "Capital_Domestic_Farm_Lv", level: 27 },
      },
    ],
  },
  {
    id: "fa_38",
    name: "Healing Mead",
    column: 13,
    required: ["fa_35", "fa_36"],
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
      {
        title: "Worker Home",
        desc: "Allows constructing 1 more Worker Home building in Viking Kingdom",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
    ],
  },
];
