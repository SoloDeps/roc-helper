import { TechnoData } from "@/types/shared";

export const technos_SA: TechnoData[] = [
  {
    id: "tech_sa_0",
    name: "Tribal Settlement",
    column: 0,
    required: [],
    costs: {
      research_points: 1,
    },
    rewards: [
      "Small Home: Unlocks the Small Home",
      "City Hall: Unlocks a Great Hall upgrade",
    ],
  },
  {
    id: "tech_sa_1",
    name: "Cultivation",
    column: 1,
    required: ["tech_sa_0"],
    costs: {
      research_points: 1,
      coins: 1,
    },
    rewards: ["Rural Farm: Unlocks a Rural Farm upgrade"],
  },
  {
    id: "tech_sa_2",
    name: "Spear Fighting",
    column: 2,
    required: ["tech_sa_1"],
    costs: {
      research_points: 2,
      coins: 15,
      food: 10,
    },
    rewards: ["Infantry Barracks: Unlocks the Infantry Barracks"],
  },
  {
    id: "tech_sa_3",
    name: "Firemaker",
    column: 3,
    required: ["tech_sa_2"],
    costs: {
      research_points: 2,
      coins: 60,
      food: 40,
    },
    rewards: [
      "Small Home: Unlocks a Small Home upgrade",
      "Small Home: Allows constructing 1 more Small Home building in your city",
    ],
  },
  {
    id: "tech_sa_4",
    name: "Cave Paintings",
    column: 4,
    required: ["tech_sa_3"],
    costs: {
      research_points: 2,
      coins: 100,
      food: 60,
    },
    rewards: [
      "Moderate Culture Site: Unlocks the Moderate Culture Site",
      "Luxurious Culture Site: Unlocks the Luxurious Culture Site",
    ],
  },
  {
    id: "tech_sa_5",
    name: "Goat Pens",
    column: 5,
    required: ["tech_sa_4"],
    costs: {
      research_points: 3,
      coins: 300,
      food: 100,
    },
    rewards: ["Domestic Farm: Unlocks the Domestic Farm"],
  },
  {
    id: "tech_sa_6",
    name: "Agriculture",
    column: 6,
    required: ["tech_sa_5"],
    costs: {
      research_points: 2,
      coins: 520,
      food: 375,
    },
    rewards: [
      "Rural Farm: Unlocks a Rural Farm upgrade",
      "Rural Farm: Allows constructing 1 more Rural Farm building in your city",
    ],
  },
  {
    id: "tech_sa_7",
    name: "Slingshots",
    column: 6,
    required: ["tech_sa_5"],
    costs: {
      research_points: 1,
      coins: 900,
      food: 650,
    },
    rewards: ["Ranged Barracks: Unlocks the Ranged Barracks"],
  },
  {
    id: "tech_sa_8",
    name: "Tribal Celebrations",
    column: 7,
    required: ["tech_sa_6", "tech_sa_7"],
    costs: {
      research_points: 5,
      coins: 1800,
      food: 1300,
    },
    rewards: [
      "Events Unlocked: New Feature",
      "Compact Culture Site: Unlocks the Compact Culture Site",
      "Small Home: Allows constructing 1 more Small Home building in your city",
    ],
  },
  {
    id: "tech_sa_9",
    name: "Herding",
    column: 8,
    required: ["tech_sa_8"],
    costs: {
      research_points: 6,
      coins: 3150,
      food: 2275,
    },
    rewards: [
      "Domestic Farm: Unlocks a Domestic Farm upgrade",
      "Domestic Farm: Allows constructing 1 more Domestic Farm building in your city",
    ],
  },
  {
    id: "tech_sa_10",
    name: "Combat Drills",
    column: 8,
    required: ["tech_sa_8"],
    costs: {
      research_points: 5,
      coins: 4950,
      food: 3575,
    },
    rewards: [
      "Infantry Barracks: Allows constructing 1 more Infantry Barracks building in your city",
    ],
  },
  {
    id: "tech_sa_11",
    name: "Baby Boom",
    column: 8,
    required: ["tech_sa_8"],
    costs: {
      research_points: 6,
      coins: 7560,
      food: 5460,
    },
    rewards: [
      "Small Home: Unlocks a Small Home upgrade",
      "Small Home: Allows constructing 1 more Small Home building in your city",
    ],
  },
  {
    id: "tech_sa_12",
    name: "The Wheel",
    column: 9,
    required: ["tech_sa_9"],
    costs: {
      research_points: 6,
      coins: 12600,
      food: 9100,
    },
    rewards: ["Rural Farm: Unlocks a Rural Farm upgrade"],
  },
  {
    id: "tech_sa_13",
    name: "Sacred Sites",
    column: 9,
    required: ["tech_sa_10"],
    costs: {
      research_points: 5,
      coins: 15300,
      food: 11050,
    },
    rewards: [
      "Daily Bonus Unlocked: New Feature",
      "Compact Culture Site: Allows constructing 2 more Compact Culture Site buildings in your city",
    ],
  },
  {
    id: "tech_sa_14",
    name: "Rural Community",
    column: 9,
    required: ["tech_sa_11"],
    costs: {
      research_points: 6,
      coins: 18000,
      food: 13000,
    },
    rewards: [
      "Small Home: Allows constructing 1 more Small Home building in your city",
    ],
  },
  {
    id: "tech_sa_15",
    name: "Domesticated Goats",
    column: 10,
    required: ["tech_sa_12", "tech_sa_13", "tech_sa_14"],
    costs: {
      research_points: 7,
      coins: 25200,
      food: 18200,
    },
    rewards: ["Domestic Farm: Unlocks a Domestic Farm upgrade"],
  },
];
