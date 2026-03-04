import { TechnoData } from "@/types/shared";

export const technos_BA: TechnoData[] = [
  {
    id: "ba_0",
    name: "Village",
    column: 0,
    required: [],
    costs: {
      research_points: 2,
      coins: 24150,
      food: 14400,
    },
    rewards: [
      {
        title: "Small Home",
        desc: "Unlocks a Small Home upgrade",
        img: { kind: "wiki", imageName: "Capital_Small_Home_Lv", level: 4 },
      },
      {
        title: "Rural Farm",
        desc: "Unlocks a Rural Farm upgrade",
        img: { kind: "wiki", imageName: "Capital_Rural_Farm_Lv", level: 4 },
      },
      {
        title: "City Hall",
        desc: "Unlocks a Great Hall upgrade",
        img: { kind: "catalog", imgType: "museum", invert: true },
      },
    ],
  },
  {
    id: "ba_1",
    name: "Alliances",
    column: 1,
    required: ["ba_0"],
    costs: {
      research_points: 1,
      coins: 7500,
      food: 5000,
    },
    rewards: [
      {
        title: "Alliance Unlocked",
        desc: "New Feature",
        img: { kind: "techno", techId: "ba_1" },
      },
      {
        title: "Alliance City Unlocked",
        desc: "New Feature",
        img: { kind: "local", path: "/images/technos/features/icon_alliancecity.webp" },
      },
    ],
  },
  {
    id: "ba_2",
    name: "Chariot",
    column: 2,
    required: ["ba_1"],
    costs: {
      research_points: 4,
      coins: 28950,
      food: 17250,
    },
    rewards: [
      {
        title: "Small Home",
        desc: "Allows constructing 1 more Small Home building in your city",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
      {
        title: "Rural Farm",
        desc: "Allows constructing 1 more Rural Farm building in your city",
        img: { kind: "catalog", imgType: "barn", invert: true },
      },
    ],
  },
  {
    id: "ba_3",
    name: "Swordplay",
    column: 2,
    required: ["ba_1"],
    costs: {
      research_points: 5,
      coins: 38600,
      food: 23000,
    },
    rewards: [
      {
        title: "Infantry Barracks",
        desc: "Unlocks a Infantry Barracks upgrade",
        img: { kind: "wiki", imageName: "Capital_Infantry_Barracks_Lv", level: 2 },
      },
    ],
  },
  {
    id: "ba_4",
    name: "Feed Trough",
    column: 3,
    required: ["ba_2"],
    costs: {
      research_points: 6,
      coins: 67550,
      food: 40250,
    },
    rewards: [
      {
        title: "Domestic Farm",
        desc: "Unlocks a Domestic Farm upgrade",
        img: { kind: "wiki", imageName: "Capital_Domestic_Farm_Lv", level: 4 },
      },
      {
        title: "Small Home",
        desc: "Allows constructing 1 more Small Home building in your city",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
    ],
  },
  {
    id: "ba_5",
    name: "Sacred Groves",
    column: 3,
    required: ["ba_2"],
    costs: {
      research_points: 6,
      coins: 59800,
      food: 35600,
    },
    rewards: [
      {
        title: "Little Culture Site",
        desc: "Unlocks the Little Culture Site",
        img: { kind: "wiki", imageName: "Capital_Little_Culture_Site_Lv", level: 2 },
      },
      {
        title: "Luxurious Culture Site",
        desc: "Unlocks a Luxurious Culture Site upgrade",
        img: { kind: "wiki", imageName: "Capital_Luxurious_Culture_Site_Lv", level: 2 },
      },
    ],
  },
  {
    id: "ba_6",
    name: "Archery",
    column: 3,
    required: ["ba_3"],
    costs: {
      research_points: 3,
      coins: 44400,
      food: 26450,
    },
    rewards: [
      {
        title: "Ranged Barracks",
        desc: "Unlocks a Ranged Barracks upgrade",
        img: { kind: "wiki", imageName: "Capital_Ranged_Barracks_Lv", level: 2 },
      },
    ],
  },
  {
    id: "ba_7",
    name: "Primary Good",
    column: 4,
    required: ["ba_4", "ba_5", "ba_6"],
    costs: {
      research_points: 5,
      coins: 51250,
      food: 30550,
    },
    rewards: [
      {
        title: "Primary Good",
        desc: "Unlocks the Primary Good",
        img: { kind: "good", priority: "primary" },
      },
      {
        title: "Primary Workshop",
        desc: "Unlocks the good Primary Goods for you, so that you can produce it in your city",
        img: { kind: "catalog", imgType: "workshop", invert: true },
      },
    ],
  },
  {
    id: "ba_8",
    name: "Wonders",
    column: 5,
    required: ["ba_7"],
    costs: {
      research_points: 4,
      coins: 38600,
      food: 23000,
    },
    rewards: [
      {
        title: "Wonders Unlocked",
        desc: "New Feature",
        img: { kind: "techno", techId: "ba_8" },
      },
    ],
  },
  {
    id: "ba_9",
    name: "Social Change",
    column: 6,
    required: ["ba_8"],
    costs: {
      research_points: 6,
      coins: 59800,
      food: 35600,
      goods: [{ amount: 5, resource: "primary_ba" }],
    },
    rewards: [
      {
        title: "Museum Unlocked",
        desc: "New Feature",
        img: { kind: "local", path: "/images/technos/features/icon_museum.webp" },
      },
      {
        title: "Average Home",
        desc: "Unlocks the Average Home",
        img: { kind: "wiki", imageName: "Capital_Average_Home_Lv", level: 4 },
      },
      {
        title: "Moderate Culture Site",
        desc: "Unlocks a Moderate Culture Site upgrade",
        img: { kind: "wiki", imageName: "Capital_Moderate_Culture_Site_Lv", level: 2 },
      },
    ],
  },
  {
    id: "ba_10",
    name: "Sacred Stones",
    column: 6,
    required: ["ba_8"],
    costs: {
      research_points: 6,
      coins: 64900,
      food: 38650,
      goods: [{ amount: 10, resource: "primary_ba" }],
    },
    rewards: [
      {
        title: "Compact Culture Site",
        desc: "Unlocks a Compact Culture Site upgrade",
        img: { kind: "wiki", imageName: "Capital_Compact_Culture_Site_Lv", level: 2 },
      },
      {
        title: "Compact Culture Site",
        desc: "Allows constructing 1 more Compact Culture Site building in your city",
        img: { kind: "catalog", imgType: "cultureSite", invert: true },
      },
    ],
  },
  {
    id: "ba_11",
    name: "Barn",
    column: 6,
    required: ["ba_8"],
    costs: {
      research_points: 8,
      coins: 77200,
      food: 46000,
      goods: [{ amount: 15, resource: "primary_ba" }],
    },
    rewards: [
      {
        title: "Domestic Farm",
        desc: "Unlocks a Domestic Farm upgrade",
        img: { kind: "wiki", imageName: "Capital_Domestic_Farm_Lv", level: 5 },
      },
      {
        title: "Small Home",
        desc: "Allows constructing 1 more Small Home building in your city",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
    ],
  },
  {
    id: "ba_12",
    name: "Farm Utensils",
    column: 6,
    required: ["ba_8"],
    costs: {
      research_points: 11,
      coins: 102500,
      food: 61050,
      goods: [{ amount: 20, resource: "primary_ba" }],
    },
    rewards: [
      {
        title: "Rural Farm",
        desc: "Unlocks a Rural Farm upgrade",
        img: { kind: "wiki", imageName: "Capital_Rural_Farm_Lv", level: 5 },
      },
    ],
  },
  {
    id: "ba_13",
    name: "Treasure Hunting",
    column: 7,
    required: ["ba_9"],
    costs: {
      research_points: 11,
      coins: 77200,
      food: 46000,
      goods: [{ amount: 20, resource: "primary_ba" }],
    },
    rewards: [
      {
        title: "Treasure Hunt Unlocked",
        desc: "New Feature",
        img: { kind: "techno", techId: "ba_13" },
      },
      {
        title: "Average Home",
        desc: "Unlocks a Average Home upgrade",
        img: { kind: "wiki", imageName: "Capital_Average_Home_Lv", level: 5 },
      },
    ],
  },
  {
    id: "ba_14",
    name: "Building Knowledge",
    column: 7,
    required: ["ba_10", "ba_11"],
    costs: {
      research_points: 9,
      coins: 42700,
      food: 25450,
      goods: [{ amount: 25, resource: "primary_ba" }],
    },
    rewards: [
      {
        title: "Small Home",
        desc: "Unlocks a Small Home upgrade",
        img: { kind: "wiki", imageName: "Capital_Small_Home_Lv", level: 5 },
      },
      {
        title: "Small Home",
        desc: "Allows constructing 1 more Small Home building in your city",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
    ],
  },
  {
    id: "ba_15",
    name: "Cavalry",
    column: 7,
    required: ["ba_12"],
    costs: {
      research_points: 11,
      coins: 88800,
      food: 52900,
      goods: [{ amount: 30, resource: "primary_ba" }],
    },
    rewards: [
      {
        title: "Cavalry Barracks",
        desc: "Unlocks the Cavalry Barracks",
        img: { kind: "wiki", imageName: "Capital_Cavalry_Barracks_Lv", level: 2 },
      },
    ],
  },
  {
    id: "ba_16",
    name: "Stakes",
    column: 8,
    required: ["ba_13", "ba_14"],
    costs: {
      research_points: 11,
      coins: 116000,
      food: 69000,
      goods: [{ amount: 35, resource: "primary_ba" }],
    },
    rewards: [
      {
        title: "Small Home",
        desc: "Unlocks a Small Home upgrade",
        img: { kind: "wiki", imageName: "Capital_Small_Home_Lv", level: 6 },
      },
    ],
  },
  {
    id: "ba_17",
    name: "Secondary Good",
    column: 8,
    required: ["ba_13"],
    costs: {
      research_points: 11,
      coins: 90500,
      food: 53950,
      goods: [{ amount: 40, resource: "primary_ba" }],
    },
    rewards: [
      {
        title: "Secondary Good",
        desc: "Unlocks the Secondary Good",
        img: { kind: "good", priority: "secondary" },
      },
      {
        title: "Secondary Workshop",
        desc: "Unlocks the good Secondary Goods for you, so that you can produce it in your city",
        img: { kind: "catalog", imgType: "workshop" },
      },
    ],
  },
  {
    id: "ba_18",
    name: "Plough",
    column: 8,
    required: ["ba_13", "ba_14", "ba_15"],
    costs: {
      research_points: 10,
      coins: 96500,
      food: 57500,
      goods: [{ amount: 45, resource: "primary_ba" }],
    },
    rewards: [
      {
        title: "Rural Farm",
        desc: "Unlocks a Rural Farm upgrade",
        img: { kind: "wiki", imageName: "Capital_Rural_Farm_Lv", level: 6 },
      },
      {
        title: "Average Home",
        desc: "Allows constructing 1 more Average Home building in your city",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
    ],
  },
  {
    id: "ba_19",
    name: "Bronze Effigy",
    column: 8,
    required: ["ba_15"],
    costs: {
      research_points: 10,
      coins: 82000,
      food: 48850,
      goods: [{ amount: 50, resource: "primary_ba" }],
    },
    rewards: [
      {
        title: "Little Culture Site",
        desc: "Allows constructing 1 more Little Culture Site building in your city",
        img: { kind: "catalog", imgType: "cultureSite", invert: true },
      },
    ],
  },
  {
    id: "ba_20",
    name: "Stronger Frames",
    column: 9,
    required: ["ba_16", "ba_17"],
    costs: {
      research_points: 13,
      coins: 145000,
      food: 86500,
      goods: [
        { amount: 55, resource: "primary_ba" },
        { amount: 10, resource: "secondary_ba" },
      ],
    },
    rewards: [
      {
        title: "Average Home",
        desc: "Unlocks a Average Home upgrade",
        img: { kind: "wiki", imageName: "Capital_Average_Home_Lv", level: 6 },
      },
    ],
  },
  {
    id: "ba_21",
    name: "Tertiary Good",
    column: 9,
    required: ["ba_17"],
    costs: {
      research_points: 13,
      coins: 135000,
      food: 80500,
      goods: [
        { amount: 55, resource: "primary_ba" },
        { amount: 15, resource: "secondary_ba" },
      ],
    },
    rewards: [
      {
        title: "Tertiary Good",
        desc: "Unlocks the Tertiary Good",
        img: { kind: "good", priority: "tertiary" },
      },
      {
        title: "Tertiary Workshop",
        desc: "Unlocks the good Tertiary Goods for you, so that you can produce it in your city",
        img: { kind: "catalog", imgType: "workshop" },
      },
    ],
  },
  {
    id: "ba_22",
    name: "Small Holding",
    column: 9,
    required: ["ba_18", "ba_19"],
    costs: {
      research_points: 10,
      coins: 154500,
      food: 92000,
      goods: [{ amount: 70, resource: "primary_ba" }],
    },
    rewards: [
      {
        title: "Domestic Farm",
        desc: "Unlocks a Domestic Farm upgrade",
        img: { kind: "wiki", imageName: "Capital_Domestic_Farm_Lv", level: 6 },
      },
      {
        title: "Domestic Farm",
        desc: "Allows constructing 1 more Domestic Farm building in your city",
        img: { kind: "catalog", imgType: "barn", invert: true },
      },
    ],
  },
  {
    id: "ba_23",
    name: "Prosperity",
    column: 10,
    required: ["ba_20", "ba_21", "ba_22"],
    costs: {
      research_points: 17,
      coins: 245000,
      food: 146000,
      goods: [
        { amount: 80, resource: "primary_ba" },
        { amount: 10, resource: "secondary_ba" },
        { amount: 5, resource: "tertiary_ba" },
      ],
    },
    rewards: [
      {
        title: "Season Pass Unlocked",
        desc: "New Feature",
        img: { kind: "local", path: "/images/technos/features/icon_seasonpass.webp" },
      },
      {
        title: "Small Home",
        desc: "Allows constructing 1 more Small Home building in your city",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
    ],
  },
];
