import { TechnoData } from "@/types/shared";

export const technos_CG: TechnoData[] = [
  {
    id: "cg_0",
    name: "Agora",
    column: 0,
    required: [],
    costs: {
      research_points: 13,
      coins: 148000,
      food: 102000,
      goods: [
        {
          amount: 605,
          resource: "primary_me",
        },
        {
          amount: 250,
          resource: "secondary_me",
        },
        {
          amount: 150,
          resource: "tertiary_me",
        },
      ],
    },
    rewards: [
      {
        title: "Small Home",
        desc: "Unlocks a Small Home upgrade",
        img: { kind: "wiki", imageName: "Capital_Small_Home_Lv", level: 10 },
      },
      {
        title: "Rural Farm",
        desc: "Unlocks a Rural Farm upgrade",
        img: { kind: "wiki", imageName: "Capital_Rural_Farm_Lv", level: 10 },
      },
      {
        title: "Rural Farm",
        desc: "Allows constructing 1 more Rural Farm building in your city",
        img: { kind: "catalog", imgType: "barn", invert: true },
      },
      {
        title: "City Hall",
        desc: "Unlocks a Great Hall upgrade",
        img: { kind: "catalog", imgType: "museum", invert: true },
      },
    ],
  },
  {
    id: "cg_1",
    name: "Carpentry",
    column: 1,
    required: ["cg_0"],
    costs: {
      research_points: 16,
      coins: 178000,
      food: 122000,
      goods: [
        {
          amount: 250,
          resource: "tertiary_ba",
        },
        {
          amount: 755,
          resource: "primary_me",
        },
        {
          amount: 315,
          resource: "tertiary_me",
        },
      ],
    },
    rewards: [
      {
        title: "Average Home",
        desc: "Unlocks a Average Home upgrade",
        img: { kind: "wiki", imageName: "Capital_Average_Home_Lv", level: 10 },
      },
      {
        title: "Small Home",
        desc: "Allows constructing 2 more Small Home buildings in your city",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
    ],
  },
  {
    id: "cg_2",
    name: "Cultural Exchange",
    column: 1,
    required: ["cg_0"],
    costs: {
      research_points: 13,
      coins: 148000,
      food: 102000,
      goods: [
        {
          amount: 300,
          resource: "secondary_ba",
        },
        {
          amount: 905,
          resource: "primary_me",
        },
        {
          amount: 375,
          resource: "secondary_me",
        },
      ],
    },
    allied: "egypt",
    rewards: [
      {
        title: "Small Home",
        desc: "Unlocks a Small Home upgrade",
        img: { kind: "wiki", imageName: "Egypt_Small_Home_Lv", level: 4 },
      },
      {
        title: "Average Home",
        desc: "Unlocks a Average Home upgrade",
        img: { kind: "wiki", imageName: "Egypt_Average_Home_Lv", level: 4 },
      },
      {
        title: "Small Home",
        desc: "Allows constructing 1 more Small Home building in your city",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
    ],
  },
  {
    id: "cg_3",
    name: "Domestic Pigs",
    column: 2,
    required: ["cg_1"],
    costs: {
      research_points: 14,
      coins: 163000,
      food: 112000,
      goods: [
        {
          amount: 585,
          resource: "tertiary_ba",
        },
        {
          amount: 265,
          resource: "primary_me",
        },
        {
          amount: 1055,
          resource: "tertiary_me",
        },
      ],
    },
    rewards: [
      {
        title: "Domestic Farm",
        desc: "Unlocks a Domestic Farm upgrade",
        img: { kind: "wiki", imageName: "Capital_Domestic_Farm_Lv", level: 10 },
      },
      {
        title: "Moderate Culture Site",
        desc: "Unlocks a Moderate Culture Site upgrade",
        img: {
          kind: "wiki",
          imageName: "Capital_Moderate_Culture_Site_Lv",
          level: 4,
        },
      },
      {
        title: "Luxurious Culture Site",
        desc: "Unlocks a Luxurious Culture Site upgrade",
        img: {
          kind: "wiki",
          imageName: "Capital_Luxurious_Culture_Site_Lv",
          level: 4,
        },
      },
      {
        title: "+1 Luxurious Culture Site",
        desc: "Allows constructing 1 more Luxurious Culture Site building in your city",
        img: { kind: "catalog", imgType: "cultureSite", invert: true },
      },
    ],
  },
  {
    id: "cg_4",
    name: "Primary Good",
    column: 2,
    required: ["cg_1"],
    costs: {
      research_points: 17,
      coins: 192000,
      food: 132000,
      goods: [
        {
          amount: 450,
          resource: "primary_me",
        },
        {
          amount: 1055,
          resource: "secondary_me",
        },
      ],
    },
    rewards: [
      {
        title: "Primary Workshop",
        desc: "Unlocks the good Primary Goods for you, so that you can produce it in your city",
        img: { kind: "catalog", imgType: "workshop", invert: true },
      },
      {
        title: "Primary Good",
        desc: "Unlocks a Primary Good upgrade",
        img: { kind: "good", priority: "primary" },
      },
      {
        title: "+1 Primary Workshop",
        desc: "Allows constructing 1 more Primary Good building in your city",
        img: { kind: "catalog", imgType: "workshop", invert: true },
      },
      {
        title: "Dock Workers",
        desc: "Increases dock worker amount",
        img: {
          kind: "local",
          path: "/images/technos/features/icon_workers_trading.webp",
        },
      },
      {
        title: "Harbor",
        desc: "+1 Trading Slot",
        img: {
          kind: "local",
          path: "/images/technos/features/icon_reward_trade_slot.webp",
        },
      },
    ],
  },
  {
    id: "cg_5",
    name: "Alloys",
    column: 2,
    required: ["cg_2"],
    costs: {
      research_points: 17,
      coins: 192000,
      food: 132000,
      goods: [
        {
          amount: 400,
          resource: "secondary_ba",
        },
        {
          amount: 725,
          resource: "primary_me",
        },
        {
          amount: 180,
          resource: "secondary_me",
        },
      ],
    },
    allied: "egypt",
    rewards: [
      {
        title: "Gold Mine",
        desc: "Unlocks a Gold Mine upgrade",
        img: { kind: "wiki", imageName: "Egypt_Gold_Mine_Lv", level: 4 },
      },
      {
        title: "Gold Mine",
        desc: "Allows constructing 1 more Gold Mine building in Egypt",
        img: { kind: "catalog", imgType: "barn", invert: true },
      },
      {
        title: "Small Well",
        desc: "Allows constructing 1 more Small Well building in Egypt",
        img: { kind: "catalog", imgType: "barn", invert: true },
      },
    ],
  },
  {
    id: "cg_6",
    name: "Storage",
    column: 2,
    required: ["cg_2"],
    costs: {
      research_points: 13,
      coins: 148000,
      food: 102000,
      goods: [
        {
          amount: 545,
          resource: "primary_me",
        },
        {
          amount: 1265,
          resource: "secondary_me",
        },
      ],
    },
    allied: "egypt",
    rewards: [
      {
        title: "Papyrus Field",
        desc: "Unlocks a Papyrus Field upgrade",
        img: { kind: "wiki", imageName: "Egypt_Papyrus_Field_Lv", level: 4 },
      },
      {
        title: "Papyrus Field",
        desc: "Allows constructing 1 more Papyrus Field building in your city",
        img: { kind: "catalog", imgType: "goldMine", invert: true },
      },
      {
        title: "Irrigation Station",
        desc: "Allows constructing 1 more Irrigation Station building in your city",
        img: { kind: "catalog", imgType: "cultureSite", invert: true },
      },
    ],
  },
  {
    id: "cg_7",
    name: "Education",
    column: 3,
    required: ["cg_3"],
    costs: {
      research_points: 13,
      coins: 148000,
      food: 102000,
      goods: [
        {
          amount: 100,
          resource: "primary_ba",
        },
        {
          amount: 125,
          resource: "primary_me",
        },
        {
          amount: 200,
          resource: "secondary_cg",
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
          level: 4,
        },
      },
      {
        title: "Compact Culture Site",
        desc: "Allows constructing 1 more Compact Culture Site building in your city",
        img: { kind: "catalog", imgType: "cultureSite", invert: true },
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
    id: "cg_8",
    name: "Psiloi",
    column: 3,
    required: ["cg_4"],
    costs: {
      research_points: 17,
      coins: 192000,
      food: 132000,
      goods: [
        {
          amount: 300,
          resource: "secondary_ba",
        },
        {
          amount: 375,
          resource: "secondary_me",
        },
        {
          amount: 605,
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
          level: 4,
        },
      },
    ],
  },
  {
    id: "cg_9",
    name: "Golden Mask",
    column: 3,
    required: ["cg_5"],
    costs: {
      research_points: 20,
      coins: 229000,
      food: 157000,
      goods: [
        {
          amount: 625,
          resource: "tertiary_ba",
        },
        {
          amount: 780,
          resource: "tertiary_me",
        },
        {
          amount: 1245,
          resource: "primary_cg",
        },
      ],
    },
    allied: "egypt",
    rewards: [
      {
        title: "Goldsmith",
        desc: "Unlocks a Goldsmith upgrade",
        img: { kind: "wiki", imageName: "Egypt_Goldsmith_Lv", level: 2 },
      },
      {
        title: "Golden Mask",
        desc: "Unlocks the good Golden Mask for you, so that you can produce it in Egypt",
        img: { kind: "techno", techId: "cg_9" },
      },
      {
        title: "Average Home",
        desc: "Allows constructing 1 more Average Home building in Egypt",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
    ],
  },
  {
    id: "cg_10",
    name: "Ceremonial Dress",
    column: 3,
    required: ["cg_6"],
    costs: {
      research_points: 18,
      coins: 207000,
      food: 142000,
      goods: [
        {
          amount: 940,
          resource: "primary_ba",
        },
        {
          amount: 565,
          resource: "secondary_ba",
        },
        {
          amount: 1125,
          resource: "primary_cg",
        },
      ],
    },
    allied: "egypt",
    rewards: [
      {
        title: "Papyrus Press",
        desc: "Unlocks a Papyrus Press upgrade",
        img: { kind: "wiki", imageName: "Egypt_Papyrus_Press_Lv", level: 2 },
      },
      {
        title: "Ceremonial Dress",
        desc: "Unlocks the good Ceremonial Dress for you, so that you can produce it in Egypt",
        img: { kind: "techno", techId: "cg_10" },
      },
      {
        title: "Small Home",
        desc: "Allows constructing 1 more Small Home building in Egypt",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
    ],
  },
  {
    id: "cg_11",
    name: "Philosophy",
    column: 4,
    required: ["cg_7", "cg_8"],
    costs: {
      research_points: 18,
      coins: 207000,
      food: 142000,
      goods: [
        {
          amount: 705,
          resource: "primary_cg",
        },
        {
          amount: 1640,
          resource: "tertiary_cg",
        },
      ],
    },
    rewards: [
      {
        title: "Small Home",
        desc: "Unlocks a Small Home upgrade",
        img: { kind: "wiki", imageName: "Capital_Small_Home_Lv", level: 11 },
      },
      {
        title: "Average Home",
        desc: "Unlocks a Average Home upgrade",
        img: { kind: "wiki", imageName: "Capital_Average_Home_Lv", level: 11 },
      },
      {
        title: "Little Culture Site",
        desc: "Unlocks a Little Culture Site upgrade",
        img: {
          kind: "wiki",
          imageName: "Capital_Little_Culture_Site_Lv",
          level: 4,
        },
      },
    ],
  },
  {
    id: "cg_12",
    name: "Channel",
    column: 4,
    required: ["cg_9", "cg_10"],
    costs: {
      research_points: 20,
      coins: 229000,
      food: 157000,
      goods: [
        {
          amount: 805,
          resource: "tertiary_ba",
        },
        {
          amount: 1005,
          resource: "secondary_me",
        },
        {
          amount: 1610,
          resource: "secondary_cg",
        },
      ],
    },
    allied: "egypt",
    rewards: [
      {
        title: "Channel",
        desc: "Unlocks the Channel",
        img: { kind: "wiki", imageName: "Egypt_Channel" },
      },
      {
        title: "Fountain",
        desc: "Unlocks the Channel",
        img: { kind: "wiki", imageName: "Egypt_Fountain" },
      },
    ],
  },
  {
    id: "cg_13",
    name: "Crop Rotation",
    column: 5,
    required: ["cg_11", "cg_12"],
    costs: {
      research_points: 18,
      coins: 207000,
      food: 142000,
      goods: [
        {
          amount: 1125,
          resource: "primary_cg",
        },
        {
          amount: 470,
          resource: "secondary_cg",
        },
        {
          amount: 280,
          resource: "tertiary_cg",
        },
      ],
    },
    rewards: [
      {
        title: "Rural Farm",
        desc: "Unlocks a Rural Farm upgrade",
        img: { kind: "wiki", imageName: "Capital_Rural_Farm_Lv", level: 11 },
      },
      {
        title: "Domestic Farm",
        desc: "Unlocks a Domestic Farm upgrade",
        img: { kind: "wiki", imageName: "Capital_Domestic_Farm_Lv", level: 11 },
      },
      {
        title: "Domestic Farm",
        desc: "Allows constructing 1 more Domestic Farm building in your city",
        img: { kind: "catalog", imgType: "barn", invert: true },
      },
    ],
  },
  {
    id: "cg_14",
    name: "Toxotai",
    column: 5,
    required: ["cg_11", "cg_12"],
    costs: {
      research_points: 26,
      coins: 296000,
      food: 203000,
      goods: [
        {
          amount: 635,
          resource: "secondary_me",
        },
        {
          amount: 1690,
          resource: "secondary_cg",
        },
        {
          amount: 705,
          resource: "tertiary_cg",
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
          level: 4,
        },
      },
    ],
  },
  {
    id: "cg_15",
    name: "Astrology",
    column: 5,
    required: ["cg_11", "cg_12"],
    costs: {
      research_points: 21,
      coins: 237000,
      food: 163000,
      goods: [
        {
          amount: 965,
          resource: "tertiary_me",
        },
        {
          amount: 2000,
          resource: "golden_mask",
        },
        {
          amount: 1500,
          resource: "tertiary_cg",
        },
      ],
    },
    allied: "egypt",
    rewards: [
      {
        title: "Small Home",
        desc: "Unlocks a Small Home upgrade",
        img: { kind: "wiki", imageName: "Egypt_Small_Home_Lv", level: 5 },
      },
      {
        title: "Small Home",
        desc: "Allows constructing 1 more Small Home building in Egypt",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
    ],
  },
  {
    id: "cg_16",
    name: "Astronomy",
    column: 5,
    required: ["cg_11", "cg_12"],
    costs: {
      research_points: 18,
      coins: 207000,
      food: 142000,
      goods: [
        {
          amount: 420,
          resource: "primary_me",
        },
        {
          amount: 470,
          resource: "primary_cg",
        },
        {
          amount: 1125,
          resource: "secondary_cg",
        },
      ],
    },
    allied: "egypt",
    rewards: [
      {
        title: "Average Home",
        desc: "Unlocks a Average Home upgrade",
        img: { kind: "wiki", imageName: "Egypt_Average_Home_Lv", level: 5 },
      },
      {
        title: "Average Home",
        desc: "Allows constructing 1 more Average Home building in Egypt",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
    ],
  },
  {
    id: "cg_17",
    name: "Hoplites",
    column: 6,
    required: ["cg_13", "cg_14"],
    costs: {
      research_points: 21,
      coins: 237000,
      food: 163000,
      goods: [
        {
          amount: 1055,
          resource: "secondary_me",
        },
        {
          amount: 1640,
          resource: "tertiary_cg",
        },
      ],
    },
    rewards: [
      {
        title: "Heavy Infantry Barracks",
        desc: "Unlocks the Heavy Infantry Barracks",
        img: {
          kind: "wiki",
          imageName: "Capital_Heavy_Infantry_Barracks_Lv",
          level: 4,
        },
      },
      {
        title: "Rural Farm",
        desc: "Allows constructing 1 more Rural Farm building in your city",
        img: { kind: "catalog", imgType: "barn", invert: true },
      },
    ],
  },
  {
    id: "cg_18",
    name: "Temples",
    column: 6,
    required: ["cg_14"],
    costs: {
      research_points: 20,
      coins: 229000,
      food: 157000,
      goods: [
        {
          amount: 1205,
          resource: "tertiary_ba",
        },
        {
          amount: 2410,
          resource: "primary_cg",
        },
        {
          amount: 1005,
          resource: "secondary_cg",
        },
      ],
    },
    rewards: [
      {
        title: "Large Culture Site",
        desc: "Unlocks the Large Culture Site",
        img: {
          kind: "wiki",
          imageName: "Capital_Large_Culture_Site_Lv",
          level: 4,
        },
      },
    ],
  },
  {
    id: "cg_19",
    name: "Library",
    column: 6,
    required: ["cg_15"],
    costs: {
      research_points: 20,
      coins: 222000,
      food: 152000,
      goods: [
        {
          amount: 905,
          resource: "secondary_me",
        },
        {
          amount: 2000,
          resource: "ceremonial_dress",
        },
        {
          amount: 1405,
          resource: "secondary_cg",
        },
      ],
    },
    allied: "egypt",
    rewards: [
      {
        title: "Gold Mine",
        desc: "Unlocks a Gold Mine upgrade",
        img: { kind: "wiki", imageName: "Egypt_Gold_Mine_Lv", level: 5 },
      },
      {
        title: "Papyrus Field",
        desc: "Unlocks a Papyrus Field upgrade",
        img: { kind: "wiki", imageName: "Egypt_Papyrus_Field_Lv", level: 5 },
      },
      {
        title: "Gold Mine",
        desc: "Allows constructing 1 more Gold Mine building in Egypt",
        img: { kind: "catalog", imgType: "goldMine", invert: true },
      },
      {
        title: "Papyrus Field",
        desc: "Allows constructing 1 more Papyrus Field building in Egypt",
        img: { kind: "catalog", imgType: "papyrusField", invert: true },
      },
    ],
  },
  {
    id: "cg_20",
    name: "Mummification",
    column: 6,
    required: ["cg_16"],
    costs: {
      research_points: 26,
      coins: 296000,
      food: 203000,
      goods: [
        {
          amount: 605,
          resource: "primary_me",
        },
        {
          amount: 670,
          resource: "primary_cg",
        },
        {
          amount: 1610,
          resource: "secondary_cg",
        },
      ],
    },
    allied: "egypt",
    rewards: [
      {
        title: "Papyrus Press",
        desc: "Allows constructing 1 more Papyrus Press building in your city",
        img: { kind: "catalog", imgType: "workshop", invert: true },
      },
      {
        title: "Goldsmith",
        desc: "Allows constructing 1 more Goldsmith building in your city",
        img: { kind: "catalog", imgType: "workshop", invert: true },
      },
    ],
  },
  {
    id: "cg_21",
    name: "Cataphract",
    column: 7,
    required: ["cg_17"],
    costs: {
      research_points: 42,
      coins: 481000,
      food: 330000,
      goods: [
        {
          amount: 1175,
          resource: "primary_cg",
        },
        {
          amount: 705,
          resource: "secondary_cg",
        },
        {
          amount: 2815,
          resource: "tertiary_cg",
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
          level: 4,
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
    id: "cg_22",
    name: "Concrete",
    column: 7,
    required: ["cg_18"],
    costs: {
      research_points: 25,
      coins: 281000,
      food: 193000,
      goods: [
        {
          amount: 765,
          resource: "secondary_ba",
        },
        {
          amount: 955,
          resource: "tertiary_me",
        },
        {
          amount: 1530,
          resource: "primary_cg",
        },
      ],
    },
    rewards: [
      {
        title: "Small Home",
        desc: "Unlocks a Small Home upgrade",
        img: { kind: "wiki", imageName: "Capital_Small_Home_Lv", level: 12 },
      },
      {
        title: "Average Home",
        desc: "Unlocks a Average Home upgrade",
        img: { kind: "wiki", imageName: "Capital_Average_Home_Lv", level: 12 },
      },
      {
        title: "Small Home",
        desc: "Allows constructing 2 more Small Home buildings in your city",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
    ],
  },
  {
    id: "cg_23",
    name: "Water Pump",
    column: 7,
    required: ["cg_18", "cg_19", "cg_20"],
    costs: {
      research_points: 20,
      coins: 222000,
      food: 152000,
      goods: [
        {
          amount: 5000,
          resource: "golden_mask",
        },
        {
          amount: 1405,
          resource: "secondary_cg",
        },
        {
          amount: 605,
          resource: "tertiary_cg",
        },
      ],
    },
    allied: "egypt",
    rewards: [
      {
        title: "Water Pump",
        desc: "Unlocks the Water Pump",
        img: { kind: "wiki", imageName: "Egypt_Water_Pump" },
      },
    ],
  },
  {
    id: "cg_24",
    name: "Math",
    column: 8,
    required: ["cg_21", "cg_22"],
    costs: {
      research_points: 29,
      coins: 326000,
      food: 224000,
      goods: [
        {
          amount: 755,
          resource: "primary_me",
        },
        {
          amount: 840,
          resource: "primary_cg",
        },
        {
          amount: 2010,
          resource: "tertiary_cg",
        },
      ],
    },
    rewards: [
      {
        title: "Rural Farm",
        desc: "Unlocks a Rural Farm upgrade",
        img: { kind: "wiki", imageName: "Capital_Rural_Farm_Lv", level: 12 },
      },
      {
        title: "Domestic Farm",
        desc: "Unlocks a Domestic Farm upgrade",
        img: { kind: "wiki", imageName: "Capital_Domestic_Farm_Lv", level: 12 },
      },
    ],
  },
  {
    id: "cg_25",
    name: "Secondary Good",
    column: 8,
    required: ["cg_22"],
    costs: {
      research_points: 26,
      coins: 296000,
      food: 203000,
      goods: [
        {
          amount: 400,
          resource: "primary_cg",
        },
        {
          amount: 1610,
          resource: "secondary_cg",
        },
        {
          amount: 670,
          resource: "tertiary_cg",
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
        desc: "Unlocks the Secondary Workshop for you, so that you can produce Secondary Goods in your city",
        img: { kind: "catalog", imgType: "workshop", invert: true },
      },
    ],
  },
  {
    id: "cg_26",
    name: "Make Up",
    column: 8,
    required: ["cg_23"],
    costs: {
      research_points: 24,
      coins: 274000,
      food: 188000,
      goods: [
        {
          amount: 905,
          resource: "tertiary_me",
        },
        {
          amount: 2410,
          resource: "primary_cg",
        },
        {
          amount: 1005,
          resource: "tertiary_cg",
        },
      ],
    },
    allied: "egypt",
    rewards: [
      {
        title: "Small Home",
        desc: "Unlocks a Small Home upgrade",
        img: { kind: "wiki", imageName: "Egypt_Small_Home_Lv", level: 6 },
      },
      {
        title: "Average Home",
        desc: "Unlocks a Average Home upgrade",
        img: { kind: "wiki", imageName: "Egypt_Average_Home_Lv", level: 6 },
      },
      {
        title: "Small Home",
        desc: "Allows constructing 1 more Small Home building in Egypt",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
    ],
  },
  {
    id: "cg_27",
    name: "Tertiary Good",
    column: 9,
    required: ["cg_24", "cg_25"],
    costs: {
      research_points: 27,
      coins: 311000,
      food: 213000,
      goods: [
        {
          amount: 1265,
          resource: "primary_me",
        },
        {
          amount: 5000,
          resource: "ceremonial_dress",
        },
        {
          amount: 1970,
          resource: "secondary_cg",
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
        desc: "Unlocks the Tertiary Workshop for you, so that you can produce Tertiary Goods in your city",
        img: { kind: "catalog", imgType: "workshop", invert: true },
      },
    ],
  },
  {
    id: "cg_28",
    name: "Scaffolding",
    column: 9,
    required: ["cg_26"],
    costs: {
      research_points: 52,
      coins: 592000,
      food: 406000,
      goods: [
        {
          amount: 1610,
          resource: "tertiary_ba",
        },
        {
          amount: 1340,
          resource: "primary_cg",
        },
        {
          amount: 3215,
          resource: "tertiary_cg",
        },
      ],
    },
    allied: "egypt",
    rewards: [
      {
        title: "Gold Mine",
        desc: "Unlocks a Gold Mine upgrade",
        img: { kind: "wiki", imageName: "Egypt_Gold_Mine_Lv", level: 6 },
      },
      {
        title: "Papyrus Field",
        desc: "Unlocks a Papyrus Field upgrade",
        img: { kind: "wiki", imageName: "Egypt_Papyrus_Field_Lv", level: 6 },
      },
    ],
  },
  {
    id: "cg_29",
    name: "Egyptian Consensus",
    column: 10,
    required: ["cg_27", "cg_28"],
    costs: {
      research_points: 27,
      coins: 303000,
      food: 208000,
      goods: [
        {
          amount: 620,
          resource: "secondary_me",
        },
        {
          amount: 1650,
          resource: "secondary_cg",
        },
        {
          amount: 685,
          resource: "tertiary_cg",
        },
      ],
    },
    allied: "egypt",
    rewards: [
      {
        title: "20 Gems",
        desc: "Gives you 20 Gems",
        img: {
          kind: "local",
          path: "/images/goods-large/gem.webp",
        },
      },
    ],
  },
];
