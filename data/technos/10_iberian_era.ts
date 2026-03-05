import { TechnoData } from "@/types/shared";

export const technos_IE: TechnoData[] = [
  {
    id: "ie_0",
    name: "Castillos",
    column: 0,
    required: [],
    costs: {
      research_points: 81,
      coins: 5300000,
      food: 1200000,
      goods: [
        {
          amount: 3950,
          resource: "primary_af",
        },
        {
          amount: 6910,
          resource: "primary_fa",
        },
      ],
    },
    rewards: [
      {
        title: "Small Home",
        desc: "Unlocks a Small Home upgrade",
        img: { kind: "wiki", imageName: "Capital_Small_Home_Lv", level: 28 },
      },
      {
        title: "Rural Farm",
        desc: "Unlocks a Rural Farm upgrade",
        img: { kind: "wiki", imageName: "Capital_Rural_Farm_Lv", level: 28 },
      },
      {
        title: "Moderate Culture Site",
        desc: "Unlocks a Moderate Culture Site upgrade",
        img: {
          kind: "wiki",
          imageName: "Capital_Moderate_Culture_Site_Lv",
          level: 10,
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
    id: "ie_1",
    name: "Primary Good",
    column: 1,
    required: ["ie_0"],
    costs: {
      research_points: 100,
      coins: 6800000,
      food: 1100000,
      goods: [
        {
          amount: 7700,
          resource: "tertiary_re",
        },
        {
          amount: 8980,
          resource: "tertiary_fa",
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
        title: "Little Culture Site",
        desc: "Unlocks a Little Culture Site upgrade",
        img: {
          kind: "wiki",
          imageName: "Capital_Little_Culture_Site_Lv",
          level: 10,
        },
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
    id: "ie_2",
    name: "Almogavars",
    column: 1,
    required: ["ie_0"],
    costs: {
      research_points: 115,
      coins: 5600000,
      food: 2500000,
      goods: [
        {
          amount: 4320,
          resource: "secondary_be",
        },
        {
          amount: 2080,
          resource: "primary_af",
        },
        {
          amount: 6220,
          resource: "secondary_fa",
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
          level: 10,
        },
      },
    ],
  },
  {
    id: "ie_3",
    name: "Glacier Mastery",
    column: 1,
    required: ["ie_0"],
    costs: {
      research_points: 71,
      coins: 1900000,
      food: 1200000,
      goods: [
        {
          amount: 11350,
          resource: "tertiary_be",
        },
        {
          amount: 3790,
          resource: "secondary_af",
        },
        {
          amount: 1710,
          resource: "tertiary_fa",
        },
      ],
    },
    allied: "vikings",
    rewards: [
      {
        title: "Worker Home",
        desc: "Unlocks a Worker Home upgrade",
        img: { kind: "wiki", imageName: "Viking_Worker_Home_Lv", level: 4 },
      },
      {
        title: "Beehive",
        desc: "Unlocks a Beehive upgrade",
        img: { kind: "wiki", imageName: "Viking_Beehive_Lv", level: 4 },
      },
      {
        title: "Worker Home",
        desc: "Allows constructing 4 more Worker Home buildings in Viking Kingdom",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
      {
        title: "Beehive",
        desc: "Allows constructing 1 more Beehive building in Viking Kingdom",
        img: { kind: "catalog", imgType: "beehive", invert: true },
      },
      {
        title: "Viking City Hall",
        desc: "Unlocks a Great Hall upgrade",
        img: { kind: "catalog", imgType: "museum", invert: true },
      },
      {
        title: "Luxurious Home",
        desc: "Allows constructing 5 more Luxurious Home buildings in Viking Kingdom",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
    ],
  },
  {
    id: "ie_4",
    name: "Masia",
    column: 2,
    required: ["ie_1", "ie_2"],
    costs: {
      research_points: 57,
      coins: 5400000,
      food: 1500000,
      goods: [
        {
          amount: 2000,
          resource: "secondary_fa",
        },
        {
          amount: 5330,
          resource: "primary_ie",
        },
        {
          amount: 2220,
          resource: "secondary_ie",
        },
      ],
    },
    rewards: [
      {
        title: "Average Home",
        desc: "Unlocks a Average Home upgrade",
        img: { kind: "wiki", imageName: "Capital_Average_Home_Lv", level: 28 },
      },
      {
        title: "Compact Culture Site",
        desc: "Unlocks a Compact Culture Site upgrade",
        img: {
          kind: "wiki",
          imageName: "Capital_Compact_Culture_Site_Lv",
          level: 10,
        },
      },
    ],
  },
  {
    id: "ie_5",
    name: "Drift Nets",
    column: 2,
    required: ["ie_3"],
    costs: {
      research_points: 77,
      coins: 2100000,
      food: 2400000,
      goods: [
        {
          amount: 4690,
          resource: "primary_re",
        },
        {
          amount: 1880,
          resource: "tertiary_af",
        },
        {
          amount: 3750,
          resource: "tertiary_ie",
        },
      ],
    },
    allied: "vikings",
    rewards: [
      {
        title: "Sailor's Home",
        desc: "Unlocks a Sailor's Home upgrade",
        img: { kind: "wiki", imageName: "Viking_Sailor_Home_Lv", level: 4 },
      },
      {
        title: "Fishing Pier",
        desc: "Unlocks a Fishing Pier upgrade",
        img: { kind: "wiki", imageName: "Viking_Fishing_Pier_Lv", level: 4 },
      },
      {
        title: "Sailor's Home",
        desc: "Allows constructing 2 more Sailor's Home buildings in Viking Kingdom",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
      {
        title: "Fishing Pier",
        desc: "Allows constructing 1 more Fishing Pier building in Viking Kingdom",
        img: { kind: "catalog", imgType: "fishingPier", invert: true },
      },
      {
        title: "Luxurious Fishing Pier",
        desc: "Allows constructing 3 more Luxurious Fishing Pier buildings in Viking Kingdom",
        img: { kind: "catalog", imgType: "fishingPier", invert: true },
      },
    ],
  },
  {
    id: "ie_6",
    name: "Mead Halls",
    column: 2,
    required: ["ie_3"],
    costs: {
      research_points: 105,
      coins: 7200000,
      food: 4100000,
      goods: [
        {
          amount: 4440,
          resource: "tertiary_af",
        },
        {
          amount: 8000,
          resource: "primary_fa",
        },
        {
          amount: 1330,
          resource: "primary_ie",
        },
      ],
    },
    allied: "vikings",
    rewards: [
      {
        title: "Tavern",
        desc: "Unlocks a Tavern upgrade",
        img: { kind: "wiki", imageName: "Viking_Tavern_Lv", level: 2 },
      },
      {
        title: "Stockfish",
        desc: "Unlocks the good Stockfish for you, so that you can produce it in Viking Kingdom",
        img: { kind: "local", path: "/images/goods-large/stockfish.webp" },
      },
      {
        title: "Tavern",
        desc: "Allows constructing 1 more Tavern building in Viking Kingdom",
        img: { kind: "catalog", imgType: "workshop", invert: true },
      },
      {
        title: "Tavern Runestone",
        desc: "Allows constructing 3 more Tavern Runestone buildings in Viking Kingdom",
        img: { kind: "catalog", imgType: "runestone", invert: true },
      },
    ],
  },
  {
    id: "ie_7",
    name: "Domesticated Donkeys",
    column: 3,
    required: ["ie_4"],
    costs: {
      research_points: 90,
      coins: 2400000,
      food: 4200000,
      goods: [
        {
          amount: 11350,
          resource: "secondary_be",
        },
        {
          amount: 4730,
          resource: "tertiary_be",
        },
        {
          amount: 1140,
          resource: "tertiary_ie",
        },
      ],
    },
    rewards: [
      {
        title: "Domestic Farm",
        desc: "Unlocks a Domestic Farm upgrade",
        img: { kind: "wiki", imageName: "Capital_Domestic_Farm_Lv", level: 28 },
      },
    ],
  },
  {
    id: "ie_8",
    name: "Patios",
    column: 3,
    required: ["ie_4"],
    costs: {
      research_points: 88,
      coins: 3200000,
      food: 4100000,
      goods: [
        {
          amount: 6170,
          resource: "secondary_re",
        },
        {
          amount: 2470,
          resource: "primary_af",
        },
        {
          amount: 7410,
          resource: "tertiary_fa",
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
          level: 10,
        },
      },
    ],
  },
  {
    id: "ie_9",
    name: "Dragon Boats",
    column: 3,
    required: ["ie_5", "ie_6"],
    costs: {
      research_points: 135,
      coins: 3300000,
      food: 1400000,
      goods: [
        {
          amount: 7700,
          resource: "secondary_fa",
        },
        {
          amount: 2140,
          resource: "primary_ie",
        },
        {
          amount: 1290,
          resource: "secondary_ie",
        },
      ],
    },
    allied: "vikings",
    rewards: [
      {
        title: "Sailor Port",
        desc: "Unlocks the Sailor Port",
        img: { kind: "wiki", imageName: "Viking_Sailor_Port" },
      },
      {
        title: "Spice Treasure",
        desc: "Unlocks the good Spice Treasure for you, so that you can produce it in Viking Kingdom",
        img: { kind: "local", path: "/images/goods-large/spice_treasure.webp" },
      },
      {
        title: "Jewel Treasure",
        desc: "Unlocks the good Jewel Treasure for you, so that you can produce it in Viking Kingdom",
        img: { kind: "local", path: "/images/goods-large/gem_treasure.webp" },
      },
      {
        title: "Luxurious Sailing Port",
        desc: "Allows constructing 2 more Luxurious Sailing Port buildings in Viking Kingdom",
        img: { kind: "catalog", imgType: "workshop", invert: true },
      },
    ],
  },
  {
    id: "ie_10",
    name: "Crossbowmen",
    column: 4,
    required: ["ie_7", "ie_8"],
    costs: {
      research_points: 120,
      coins: 3800000,
      food: 2100000,
      goods: [
        {
          amount: 4280,
          resource: "primary_af",
        },
        {
          amount: 2570,
          resource: "tertiary_af",
        },
        {
          amount: 5130,
          resource: "secondary_ie",
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
          level: 10,
        },
      },
    ],
  },
  {
    id: "ie_11",
    name: "Tattoos",
    column: 4,
    required: ["ie_9"],
    costs: {
      research_points: 88,
      coins: 2200000,
      food: 4000000,
      goods: [
        {
          amount: 5920,
          resource: "tertiary_fa",
        },
        {
          amount: 990,
          resource: "secondary_ie",
        },
        {
          amount: 1650,
          resource: "tertiary_ie",
        },
      ],
    },
    allied: "vikings",
    rewards: [
      {
        title: "Worker Home",
        desc: "Unlocks a Worker Home upgrade",
        img: { kind: "wiki", imageName: "Viking_Worker_Home_Lv", level: 5 },
      },
      {
        title: "Worker Home",
        desc: "Allows constructing 3 more Worker Home buildings in Viking Kingdom",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
      {
        title: "Home Runestone",
        desc: "Allows constructing 3 more Home Runestone buildings in Viking Kingdom",
        img: { kind: "catalog", imgType: "runestone", invert: true },
      },
    ],
  },
  {
    id: "ie_12",
    name: "Superior Beekeeping",
    column: 4,
    required: ["ie_9"],
    costs: {
      research_points: 67,
      coins: 5300000,
      food: 2800000,
      goods: [
        {
          amount: 4940,
          resource: "tertiary_re",
        },
        {
          amount: 1980,
          resource: "secondary_af",
        },
        {
          amount: 5920,
          resource: "primary_fa",
        },
      ],
    },
    allied: "vikings",
    rewards: [
      {
        title: "Beehive",
        desc: "Unlocks a Beehive upgrade",
        img: { kind: "wiki", imageName: "Viking_Beehive_Lv", level: 5 },
      },
      {
        title: "Beehive",
        desc: "Allows constructing 3 more Beehive buildings in Viking Kingdom",
        img: { kind: "catalog", imgType: "beehive", invert: true },
      },
      {
        title: "Beehive Runestone",
        desc: "Allows constructing 3 more Beehive Runestone buildings in Viking Kingdom",
        img: { kind: "catalog", imgType: "runestone", invert: true },
      },
    ],
  },
  {
    id: "ie_13",
    name: "Orange Plantation",
    column: 5,
    required: ["ie_10"],
    costs: {
      research_points: 89,
      coins: 6800000,
      food: 2500000,
      goods: [
        {
          amount: 3130,
          resource: "tertiary_af",
        },
        {
          amount: 3750,
          resource: "primary_ie",
        },
        {
          amount: 940,
          resource: "tertiary_ie",
        },
      ],
    },
    rewards: [
      {
        title: "Rural Farm",
        desc: "Unlocks a Rural Farm upgrade",
        img: { kind: "wiki", imageName: "Capital_Rural_Farm_Lv", level: 29 },
      },
      {
        title: "Rural Farm",
        desc: "Allows constructing 1 more Rural Farm building in your city",
        img: { kind: "catalog", imgType: "barn", invert: true },
      },
      {
        title: "Luxurious Farm",
        desc: "Allows constructing 1 more Luxurious Farm building in your city",
        img: { kind: "catalog", imgType: "barn", invert: true },
      },
    ],
  },
  {
    id: "ie_14",
    name: "Eyeglasses",
    column: 5,
    required: ["ie_10"],
    costs: {
      research_points: 63,
      coins: 3500000,
      food: 2300000,
      goods: [
        {
          amount: 1330,
          resource: "primary_ie",
        },
        {
          amount: 2220,
          resource: "secondary_ie",
        },
        {
          amount: 5330,
          resource: "tertiary_ie",
        },
      ],
    },
    rewards: [
      {
        title: "Small Home",
        desc: "Unlocks a Small Home upgrade",
        img: { kind: "wiki", imageName: "Capital_Small_Home_Lv", level: 29 },
      },
      {
        title: "Small Home",
        desc: "Allows constructing 1 more Small Home building in your city",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
    ],
  },
  {
    id: "ie_15",
    name: "Tavern Brawls",
    column: 5,
    required: ["ie_11", "ie_12"],
    costs: {
      research_points: 92,
      coins: 5700000,
      food: 2800000,
      goods: [
        {
          amount: 7160,
          resource: "primary_re",
        },
        {
          amount: 14300,
          resource: "primary_be",
        },
        {
          amount: 1430,
          resource: "secondary_ie",
        },
      ],
    },
    allied: "vikings",
    rewards: [
      {
        title: "Sailor's Home",
        desc: "Unlocks a Sailor's Home upgrade",
        img: { kind: "wiki", imageName: "Viking_Sailor_Home_Lv", level: 5 },
      },
      {
        title: "Sailor's Home",
        desc: "Allows constructing 3 more Sailor's Home buildings in Viking Kingdom",
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
    id: "ie_16",
    name: "Improved Fishing",
    column: 5,
    required: ["ie_11", "ie_12"],
    costs: {
      research_points: 82,
      coins: 4200000,
      food: 4200000,
      goods: [
        {
          amount: 3460,
          resource: "secondary_af",
        },
        {
          amount: 6220,
          resource: "secondary_fa",
        },
        {
          amount: 1040,
          resource: "tertiary_ie",
        },
      ],
    },
    allied: "vikings",
    rewards: [
      {
        title: "Fishing Pier",
        desc: "Unlocks a Fishing Pier upgrade",
        img: { kind: "wiki", imageName: "Viking_Fishing_Pier_Lv", level: 5 },
      },
      {
        title: "Fishing Pier",
        desc: "Allows constructing 1 more Fishing Pier building in Viking Kingdom",
        img: { kind: "catalog", imgType: "fishingPier", invert: true },
      },
    ],
  },
  {
    id: "ie_17",
    name: "Jinete",
    column: 6,
    required: ["ie_13", "ie_14"],
    costs: {
      research_points: 125,
      coins: 4700000,
      food: 2300000,
      goods: [
        {
          amount: 2080,
          resource: "primary_af",
        },
        {
          amount: 1730,
          resource: "primary_ie",
        },
        {
          amount: 4150,
          resource: "secondary_ie",
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
          level: 10,
        },
      },
    ],
  },
  {
    id: "ie_18",
    name: "Sun Compass",
    column: 6,
    required: ["ie_15", "ie_16"],
    costs: {
      research_points: 80,
      coins: 5100000,
      food: 1400000,
      goods: [
        {
          amount: 2470,
          resource: "secondary_af",
        },
        {
          amount: 4120,
          resource: "tertiary_af",
        },
        {
          amount: 4940,
          resource: "tertiary_ie",
        },
      ],
    },
    allied: "vikings",
    rewards: [
      {
        title: "Sailor Port",
        desc: "Allows constructing 1 more Sailor Port building in Viking Kingdom",
        img: { kind: "catalog", imgType: "workshop", invert: true },
      },
    ],
  },
  {
    id: "ie_19",
    name: "Long-Distance Seafaring",
    column: 6,
    required: ["ie_15", "ie_16"],
    costs: {
      research_points: 110,
      coins: 1900000,
      food: 2400000,
      goods: [
        {
          amount: 2670,
          resource: "tertiary_af",
        },
        {
          amount: 5330,
          resource: "primary_ie",
        },
        {
          amount: 2220,
          resource: "tertiary_ie",
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
        title: "Fishing Pier",
        desc: "Allows constructing 1 more Fishing Pier building in Viking Kingdom",
        img: { kind: "catalog", imgType: "fishingPier", invert: true },
      },
    ],
  },
  {
    id: "ie_20",
    name: "Horseshoe Arches",
    column: 7,
    required: ["ie_17"],
    costs: {
      research_points: 92,
      coins: 4200000,
      food: 2800000,
      goods: [
        {
          amount: 5180,
          resource: "primary_re",
        },
        {
          amount: 6220,
          resource: "tertiary_fa",
        },
        {
          amount: 1040,
          resource: "secondary_ie",
        },
      ],
    },
    rewards: [
      {
        title: "Average Home",
        desc: "Unlocks a Average Home upgrade",
        img: { kind: "wiki", imageName: "Capital_Average_Home_Lv", level: 29 },
      },
    ],
  },
  {
    id: "ie_21",
    name: "Félag Partnerships",
    column: 7,
    required: ["ie_18", "ie_19"],
    costs: {
      research_points: 78,
      coins: 3200000,
      food: 1600000,
      goods: [
        {
          amount: 4120,
          resource: "primary_af",
        },
        {
          amount: 7410,
          resource: "primary_fa",
        },
        {
          amount: 1240,
          resource: "tertiary_ie",
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
        title: "Beehive",
        desc: "Allows constructing 2 more Beehive buildings in Viking Kingdom",
        img: { kind: "catalog", imgType: "beehive", invert: true },
      },
    ],
  },
  {
    id: "ie_22",
    name: "Donkey Herds",
    column: 8,
    required: ["ie_20", "ie_21"],
    costs: {
      research_points: 92,
      coins: 5600000,
      food: 2800000,
      goods: [
        {
          amount: 2350,
          resource: "primary_fa",
        },
        {
          amount: 3750,
          resource: "secondary_ie",
        },
        {
          amount: 940,
          resource: "tertiary_ie",
        },
      ],
    },
    rewards: [
      {
        title: "Domestic Farm",
        desc: "Unlocks a Domestic Farm upgrade",
        img: { kind: "wiki", imageName: "Capital_Domestic_Farm_Lv", level: 29 },
      },
    ],
  },
  {
    id: "ie_23",
    name: "Toledo Steel",
    column: 8,
    required: ["ie_20"],
    costs: {
      research_points: 75,
      coins: 2500000,
      food: 3800000,
      goods: [
        {
          amount: 5680,
          resource: "secondary_re",
        },
        {
          amount: 11350,
          resource: "tertiary_be",
        },
        {
          amount: 2270,
          resource: "secondary_af",
        },
      ],
    },
    rewards: [
      {
        title: "Small Home",
        desc: "Unlocks a Small Home upgrade",
        img: { kind: "wiki", imageName: "Capital_Small_Home_Lv", level: 30 },
      },
    ],
  },
  {
    id: "ie_24",
    name: "Norse Hamlets",
    column: 8,
    required: ["ie_20", "ie_21"],
    costs: {
      research_points: 92,
      coins: 4400000,
      food: 1100000,
      goods: [
        {
          amount: 3090,
          resource: "tertiary_fa",
        },
        {
          amount: 1240,
          resource: "secondary_ie",
        },
        {
          amount: 4940,
          resource: "tertiary_ie",
        },
      ],
    },
    allied: "vikings",
    rewards: [
      {
        title: "Worker Home",
        desc: "Unlocks a Worker Home upgrade",
        img: { kind: "wiki", imageName: "Viking_Worker_Home_Lv", level: 6 },
      },
      {
        title: "Worker Home",
        desc: "Allows constructing 2 more Worker Home buildings in Viking Kingdom",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
    ],
  },
  {
    id: "ie_25",
    name: "Beekeeping Mastery",
    column: 8,
    required: ["ie_21"],
    costs: {
      research_points: 57,
      coins: 2300000,
      food: 3700000,
      goods: [
        {
          amount: 4440,
          resource: "tertiary_af",
        },
        {
          amount: 5330,
          resource: "primary_ie",
        },
        {
          amount: 1330,
          resource: "secondary_ie",
        },
      ],
    },
    allied: "vikings",
    rewards: [
      {
        title: "Beehive",
        desc: "Unlocks a Beehive upgrade",
        img: { kind: "wiki", imageName: "Viking_Beehive_Lv", level: 6 },
      },
      {
        title: "Beehive",
        desc: "Allows constructing 2 more Beehive buildings in Viking Kingdom",
        img: { kind: "catalog", imgType: "beehive", invert: true },
      },
    ],
  },
  {
    id: "ie_26",
    name: "Advanced Trebuchet",
    column: 9,
    required: ["ie_22", "ie_23"],
    costs: {
      research_points: 130,
      coins: 2800000,
      food: 1700000,
      goods: [
        {
          amount: 3460,
          resource: "secondary_af",
        },
        {
          amount: 1040,
          resource: "primary_ie",
        },
        {
          amount: 4150,
          resource: "secondary_ie",
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
          level: 10,
        },
      },
    ],
  },
  {
    id: "ie_27",
    name: "Mead Mastery",
    column: 9,
    required: ["ie_24", "ie_25"],
    costs: {
      research_points: 99,
      coins: 5800000,
      food: 4100000,
      goods: [
        {
          amount: 2080,
          resource: "primary_af",
        },
        {
          amount: 1730,
          resource: "primary_ie",
        },
        {
          amount: 4150,
          resource: "tertiary_ie",
        },
      ],
    },
    allied: "vikings",
    rewards: [
      {
        title: "Tavern",
        desc: "Allows constructing 2 more Tavern buildings in Viking Kingdom",
        img: { kind: "catalog", imgType: "workshop", invert: true },
      },
    ],
  },
  {
    id: "ie_28",
    name: "Viking Homesteads",
    column: 9,
    required: ["ie_24", "ie_25"],
    costs: {
      research_points: 77,
      coins: 1700000,
      food: 3700000,
      goods: [
        {
          amount: 4770,
          resource: "primary_af",
        },
        {
          amount: 1430,
          resource: "primary_ie",
        },
        {
          amount: 5730,
          resource: "secondary_ie",
        },
      ],
    },
    allied: "vikings",
    rewards: [
      {
        title: "Sailor's Home",
        desc: "Unlocks a Sailor's Home upgrade",
        img: { kind: "wiki", imageName: "Viking_Sailor_Home_Lv", level: 6 },
      },
      {
        title: "Sailor's Home",
        desc: "Allows constructing 1 more Sailor's Home building in Viking Kingdom",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
    ],
  },
  {
    id: "ie_29",
    name: "Distillation",
    column: 10,
    required: ["ie_26"],
    costs: {
      research_points: 84,
      coins: 4800000,
      food: 2200000,
      goods: [
        {
          amount: 2840,
          resource: "primary_fa",
        },
        {
          amount: 6810,
          resource: "secondary_fa",
        },
        {
          amount: 1710,
          resource: "tertiary_fa",
        },
      ],
    },
    rewards: [
      {
        title: "Average Home",
        desc: "Unlocks a Average Home upgrade",
        img: { kind: "wiki", imageName: "Capital_Average_Home_Lv", level: 30 },
      },
    ],
  },
  {
    id: "ie_30",
    name: "Botany",
    column: 10,
    required: ["ie_26"],
    costs: {
      research_points: 69,
      coins: 5800000,
      food: 2600000,
      goods: [
        {
          amount: 6420,
          resource: "primary_re",
        },
        {
          amount: 2570,
          resource: "tertiary_af",
        },
        {
          amount: 5130,
          resource: "primary_ie",
        },
      ],
    },
    rewards: [
      {
        title: "Rural Farm",
        desc: "Unlocks a Rural Farm upgrade",
        img: { kind: "wiki", imageName: "Capital_Rural_Farm_Lv", level: 30 },
      },
      {
        title: "Average Home",
        desc: "Allows constructing 1 more Average Home building in your city",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
    ],
  },
  {
    id: "ie_31",
    name: "Magnetic Compass",
    column: 10,
    required: ["ie_27"],
    costs: {
      research_points: 105,
      coins: 2900000,
      food: 4000000,
      goods: [
        {
          amount: 3090,
          resource: "secondary_fa",
        },
        {
          amount: 1240,
          resource: "secondary_ie",
        },
        {
          amount: 4940,
          resource: "tertiary_ie",
        },
      ],
    },
    allied: "vikings",
    rewards: [
      {
        title: "Sailor Port",
        desc: "Allows constructing 1 more Sailor Port building in Viking Kingdom",
        img: { kind: "catalog", imgType: "workshop", invert: true },
      },
    ],
  },
  {
    id: "ie_32",
    name: "Fishing Mastery",
    column: 10,
    required: ["ie_28"],
    costs: {
      research_points: 94,
      coins: 1700000,
      food: 1200000,
      goods: [
        {
          amount: 13800,
          resource: "secondary_be",
        },
        {
          amount: 4610,
          resource: "tertiary_af",
        },
        {
          amount: 1380,
          resource: "tertiary_ie",
        },
      ],
    },
    allied: "vikings",
    rewards: [
      {
        title: "Fishing Pier",
        desc: "Unlocks a Fishing Pier upgrade",
        img: { kind: "wiki", imageName: "Viking_Fishing_Pier_Lv", level: 6 },
      },
      {
        title: "Fishing Pier",
        desc: "Allows constructing 1 more Fishing Pier building in Viking Kingdom",
        img: { kind: "catalog", imgType: "fishingPier", invert: true },
      },
    ],
  },
  {
    id: "ie_33",
    name: "Order of Calatrava",
    column: 11,
    required: ["ie_29", "ie_30", "ie_31"],
    costs: {
      research_points: 135,
      coins: 3000000,
      food: 4400000,
      goods: [
        {
          amount: 1780,
          resource: "secondary_fa",
        },
        {
          amount: 4740,
          resource: "secondary_ie",
        },
        {
          amount: 1980,
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
          level: 10,
        },
      },
    ],
  },
  {
    id: "ie_34",
    name: "Glima Fighting",
    column: 11,
    required: ["ie_31", "ie_32"],
    costs: {
      research_points: 67,
      coins: 2200000,
      food: 3600000,
      goods: [
        {
          amount: 1410,
          resource: "primary_fa",
        },
        {
          amount: 2350,
          resource: "secondary_fa",
        },
        {
          amount: 3750,
          resource: "tertiary_ie",
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
        title: "Sailor's Home",
        desc: "Allows constructing 1 more Sailor's Home building in Viking Kingdom",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
    ],
  },
  {
    id: "ie_35",
    name: "Perfected Honey",
    column: 11,
    required: ["ie_31", "ie_32"],
    costs: {
      research_points: 91,
      coins: 6000000,
      food: 1200000,
      goods: [
        {
          amount: 6660,
          resource: "tertiary_re",
        },
        {
          amount: 2670,
          resource: "secondary_af",
        },
        {
          amount: 8000,
          resource: "tertiary_fa",
        },
      ],
    },
    allied: "vikings",
    rewards: [
      {
        title: "Beehive",
        desc: "Allows constructing 2 more Beehive buildings in Viking Kingdom",
        img: { kind: "catalog", imgType: "beehive", invert: true },
      },
    ],
  },
  {
    id: "ie_36",
    name: "Secondary Good",
    column: 12,
    required: ["ie_33"],
    costs: {
      research_points: 100,
      coins: 4600000,
      food: 1600000,
      goods: [
        {
          amount: 11350,
          resource: "primary_be",
        },
        {
          amount: 3790,
          resource: "primary_af",
        },
        {
          amount: 1140,
          resource: "primary_ie",
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
        desc: "Unlocks the good Secondary Goods for you, so that you can produce it in Viking Kingdom",
        img: { kind: "good", priority: "secondary" },
      },
    ],
  },
  {
    id: "ie_37",
    name: "Donkey Farms",
    column: 12,
    required: ["ie_33"],
    costs: {
      research_points: 105,
      coins: 6100000,
      food: 3600000,
      goods: [
        {
          amount: 4440,
          resource: "secondary_af",
        },
        {
          amount: 8000,
          resource: "primary_fa",
        },
        {
          amount: 1330,
          resource: "secondary_ie",
        },
      ],
    },
    rewards: [
      {
        title: "Domestic Farm",
        desc: "Unlocks a Domestic Farm upgrade",
        img: { kind: "wiki", imageName: "Capital_Domestic_Farm_Lv", level: 30 },
      },
    ],
  },
  {
    id: "ie_38",
    name: "Fjord Dominion",
    column: 12,
    required: ["ie_34", "ie_35"],
    costs: {
      research_points: 77,
      coins: 3900000,
      food: 3000000,
      goods: [
        {
          amount: 4740,
          resource: "primary_ie",
        },
        {
          amount: 1980,
          resource: "secondary_ie",
        },
        {
          amount: 1190,
          resource: "tertiary_ie",
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
        title: "Sailor's Home",
        desc: "Allows constructing 1 more Sailor's Home building in Viking Kingdom",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
    ],
  },
  {
    id: "ie_39",
    name: "Harbor Economics",
    column: 12,
    required: ["ie_34", "ie_35"],
    costs: {
      research_points: 90,
      coins: 4200000,
      food: 1700000,
      goods: [
        {
          amount: 1630,
          resource: "primary_fa",
        },
        {
          amount: 2720,
          resource: "tertiary_fa",
        },
        {
          amount: 4350,
          resource: "primary_ie",
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
    ],
  },
  {
    id: "ie_40",
    name: "Tertiary Good",
    column: 13,
    required: ["ie_36", "ie_37", "ie_38", "ie_39"],
    costs: {
      research_points: 82,
      coins: 6200000,
      food: 1300000,
      goods: [
        {
          amount: 4440,
          resource: "secondary_af",
        },
        {
          amount: 8000,
          resource: "secondary_fa",
        },
        {
          amount: 1330,
          resource: "tertiary_ie",
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
    id: "ie_41",
    name: "Viking Consensus",
    column: 14,
    required: ["ie_40"],
    costs: {
      research_points: 100,
      coins: 4900000,
      food: 3100000,
      goods: [
        {
          amount: 5430,
          resource: "secondary_re",
        },
        {
          amount: 1090,
          resource: "primary_ie",
        },
        {
          amount: 4350,
          resource: "secondary_ie",
        },
      ],
    },
    allied: "vikings",
    rewards: [
      {
        title: "1 Wonder Orb",
        desc: "Gives you 1 Wonder Orb",
        img: {
          kind: "local",
          path: "/images/technos/features/icon_wonder_orb.webp",
        },
      },
    ],
  },
];
