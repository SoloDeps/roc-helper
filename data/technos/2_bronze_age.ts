import { TechnoData } from "@/types/shared";

export const technos_BA: TechnoData[] = [
  {
    id: "tech_ba_0",
    name: "Village",
    column: 0,
    required: [],
    costs: {
      research_points: 2,
      coins: 24150,
      food: 14400,
    },
    rewards: [
      "Small Home: Unlocks a Small Home upgrade",
      "Rural Farm: Unlocks a Rural Farm upgrade",
      "City Hall: Unlocks a Great Hall upgrade",
    ],
  },
  {
    id: "tech_ba_1",
    name: "Alliances",
    column: 1,
    required: ["tech_ba_0"],
    costs: {
      research_points: 1,
      coins: 7500,
      food: 5000,
    },
    rewards: [
      "Alliance Unlocked: New Feature",
      "Alliance City Unlocked: New Feature",
    ],
  },
  {
    id: "tech_ba_2",
    name: "Chariot",
    column: 2,
    required: ["tech_ba_1"],
    costs: {
      research_points: 4,
      coins: 28950,
      food: 17250,
    },
    rewards: [
      "Small Home: Allows constructing 1 more Small Home building in your city",
      "Rural Farm: Allows constructing 1 more Rural Farm building in your city",
    ],
  },
  {
    id: "tech_ba_3",
    name: "Swordplay",
    column: 2,
    required: ["tech_ba_1"],
    costs: {
      research_points: 5,
      coins: 38600,
      food: 23000,
    },
    rewards: ["Infantry Barracks: Unlocks a Infantry Barracks upgrade"],
  },
  {
    id: "tech_ba_4",
    name: "Feed Trough",
    column: 3,
    required: ["tech_ba_2"],
    costs: {
      research_points: 6,
      coins: 67550,
      food: 40250,
    },
    rewards: [
      "Domestic Farm: Unlocks a Domestic Farm upgrade",
      "Small Home: Allows constructing 1 more Small Home building in your city",
    ],
  },
  {
    id: "tech_ba_5",
    name: "Sacred Groves",
    column: 3,
    required: ["tech_ba_2"],
    costs: {
      research_points: 6,
      coins: 59800,
      food: 35600,
    },
    rewards: [
      "Little Culture Site: Unlocks the Little Culture Site",
      "Luxurious Culture Site: Unlocks a Luxurious Culture Site upgrade",
    ],
  },
  {
    id: "tech_ba_6",
    name: "Archery",
    column: 3,
    required: ["tech_ba_3"],
    costs: {
      research_points: 3,
      coins: 44400,
      food: 26450,
    },
    rewards: ["Ranged Barracks: Unlocks a Ranged Barracks upgrade"],
  },
  {
    id: "tech_ba_7",
    name: "Primary Workshop",
    column: 4,
    required: ["tech_ba_4", "tech_ba_5", "tech_ba_6"],
    costs: {
      research_points: 5,
      coins: 51250,
      food: 30550,
    },
    rewards: [
      "Primary Workshop: Unlocks the Primary Workshop",
      "Primary Goods: Unlocks the good Primary Goods for you, so that you can produce it in your city",
    ],
  },
  {
    id: "tech_ba_8",
    name: "Wonders",
    column: 5,
    required: ["tech_ba_7"],
    costs: {
      research_points: 4,
      coins: 38600,
      food: 23000,
    },
    rewards: ["Wonders Unlocked: New Feature"],
  },
  {
    id: "tech_ba_9",
    name: "Social Change",
    column: 6,
    required: ["tech_ba_8"],
    costs: {
      research_points: 6,
      coins: 59800,
      food: 35600,
      goods: [
        {
          amount: 5,
          resource: "primary_ba",
        },
      ],
    },
    rewards: [
      "Average Home: Unlocks the Average Home",
      "Moderate Culture Site: Unlocks a Moderate Culture Site upgrade",
    ],
  },
  {
    id: "tech_ba_10",
    name: "Sacred Stones",
    column: 6,
    required: ["tech_ba_8"],
    costs: {
      research_points: 6,
      coins: 64900,
      food: 38650,
      goods: [
        {
          amount: 10,
          resource: "primary_ba",
        },
      ],
    },
    rewards: [
      "Compact Culture Site: Unlocks a Compact Culture Site upgrade",
      "Compact Culture Site: Allows constructing 1 more Compact Culture Site building in your city",
    ],
  },
  {
    id: "tech_ba_11",
    name: "Barn",
    column: 6,
    required: ["tech_ba_8"],
    costs: {
      research_points: 8,
      coins: 77200,
      food: 46000,
      goods: [
        {
          amount: 15,
          resource: "primary_ba",
        },
      ],
    },
    rewards: [
      "Domestic Farm: Unlocks a Domestic Farm upgrade",
      "Small Home: Allows constructing 1 more Small Home building in your city",
    ],
  },
  {
    id: "tech_ba_12",
    name: "Farm Utensils",
    column: 6,
    required: ["tech_ba_8"],
    costs: {
      research_points: 11,
      coins: 102500,
      food: 61050,
      goods: [
        {
          amount: 20,
          resource: "primary_ba",
        },
      ],
    },
    rewards: ["Rural Farm: Unlocks a Rural Farm upgrade"],
  },
  {
    id: "tech_ba_13",
    name: "Treasure Hunting",
    column: 7,
    required: ["tech_ba_9"],
    costs: {
      research_points: 11,
      coins: 77200,
      food: 46000,
      goods: [
        {
          amount: 20,
          resource: "primary_ba",
        },
      ],
    },
    rewards: [
      "Treasure Hunt Unlocked: New Feature",
      "Average Home: Unlocks a Average Home upgrade",
    ],
  },
  {
    id: "tech_ba_14",
    name: "Building Knowledge",
    column: 7,
    required: ["tech_ba_10", "tech_ba_11"],
    costs: {
      research_points: 9,
      coins: 42700,
      food: 25450,
      goods: [
        {
          amount: 25,
          resource: "primary_ba",
        },
      ],
    },
    rewards: [
      "Small Home: Unlocks a Small Home upgrade",
      "Small Home: Allows constructing 1 more Small Home building in your city",
    ],
  },
  {
    id: "tech_ba_15",
    name: "Cavalry",
    column: 7,
    required: ["tech_ba_12"],
    costs: {
      research_points: 11,
      coins: 88800,
      food: 52900,
      goods: [
        {
          amount: 30,
          resource: "primary_ba",
        },
      ],
    },
    rewards: ["Cavalry Barracks: Unlocks the Cavalry Barracks"],
  },
  {
    id: "tech_ba_16",
    name: "Stakes",
    column: 8,
    required: ["tech_ba_13", "tech_ba_14"],
    costs: {
      research_points: 11,
      coins: 116000,
      food: 69000,
      goods: [
        {
          amount: 35,
          resource: "primary_ba",
        },
      ],
    },
    rewards: ["Small Home: Unlocks a Small Home upgrade"],
  },
  {
    id: "tech_ba_17",
    name: "Secondary Workshop",
    column: 8,
    required: ["tech_ba_13"],
    costs: {
      research_points: 11,
      coins: 90500,
      food: 53950,
      goods: [
        {
          amount: 40,
          resource: "primary_ba",
        },
      ],
    },
    rewards: [
      "Secondary Workshop: Unlocks the Secondary Workshop",
      "Secondary Goods: Unlocks the good Secondary Goods for you, so that you can produce it in your city",
    ],
  },
  {
    id: "tech_ba_18",
    name: "Plough",
    column: 8,
    required: ["tech_ba_13", "tech_ba_14", "tech_ba_15"],
    costs: {
      research_points: 10,
      coins: 96500,
      food: 57500,
      goods: [
        {
          amount: 45,
          resource: "primary_ba",
        },
      ],
    },
    rewards: [
      "Rural Farm: Unlocks a Rural Farm upgrade",
      "Average Home: Allows constructing 1 more Average Home building in your city",
    ],
  },
  {
    id: "tech_ba_19",
    name: "Bronze Effigy",
    column: 8,
    required: ["tech_ba_15"],
    costs: {
      research_points: 10,
      coins: 82000,
      food: 48850,
      goods: [
        {
          amount: 50,
          resource: "primary_ba",
        },
      ],
    },
    rewards: [
      "Little Culture Site: Allows constructing 1 more Little Culture Site building in your city",
    ],
  },
  {
    id: "tech_ba_20",
    name: "Stronger Frames",
    column: 9,
    required: ["tech_ba_16", "tech_ba_17"],
    costs: {
      research_points: 13,
      coins: 145000,
      food: 86500,
      goods: [
        {
          amount: 55,
          resource: "primary_ba",
        },
        {
          amount: 10,
          resource: "secondary_ba",
        },
      ],
    },
    rewards: ["Average Home: Unlocks a Average Home upgrade"],
  },
  {
    id: "tech_ba_21",
    name: "Tertiary Workshop",
    column: 9,
    required: ["tech_ba_17"],
    costs: {
      research_points: 13,
      coins: 135000,
      food: 80500,
      goods: [
        {
          amount: 55,
          resource: "primary_ba",
        },
        {
          amount: 15,
          resource: "secondary_ba",
        },
      ],
    },
    rewards: [
      "Tertiary Workshop: Unlocks the Tertiary Workshop",
      "Tertiary Goods: Unlocks the good Tertiary Goods for you, so that you can produce it in your city",
    ],
  },
  {
    id: "tech_ba_22",
    name: "Small Holding",
    column: 9,
    required: ["tech_ba_18", "tech_ba_19"],
    costs: {
      research_points: 10,
      coins: 154500,
      food: 92000,
      goods: [
        {
          amount: 70,
          resource: "primary_ba",
        },
      ],
    },
    rewards: [
      "Domestic Farm: Unlocks a Domestic Farm upgrade",
      "Domestic Farm: Allows constructing 1 more Domestic Farm building in your city",
    ],
  },
  {
    id: "tech_ba_23",
    name: "Prosperity",
    column: 10,
    required: ["tech_ba_20", "tech_ba_21", "tech_ba_22"],
    costs: {
      research_points: 17,
      coins: 245000,
      food: 146000,
      goods: [
        {
          amount: 80,
          resource: "primary_ba",
        },
        {
          amount: 10,
          resource: "secondary_ba",
        },
        {
          amount: 5,
          resource: "tertiary_ba",
        },
      ],
    },
    rewards: [
      "Season Pass Unlocked: New Feature",
      "Small Home: Allows constructing 1 more Small Home building in your city",
    ],
  },
];
