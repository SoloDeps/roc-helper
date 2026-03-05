import { TechnoData } from "@/types/shared";

export const technos_SA: TechnoData[] = [
  {
    id: "sa_0",
    name: "Tribal Settlement",
    column: 0,
    required: [],
    costs: {
      research_points: 1,
    },
    rewards: [
      {
        title: "Small Home",
        desc: "Unlocks the Small Home",
        img: { kind: "wiki", imageName: "Capital_Small_Home_Lv", level: 1 },
      },
      {
        title: "City Hall",
        desc: "Unlocks a Great Hall upgrade",
        img: { kind: "catalog", imgType: "museum", invert: true },
      },
    ],
  },
  {
    id: "sa_1",
    name: "Cultivation",
    column: 1,
    required: ["sa_0"],
    costs: {
      research_points: 1,
      coins: 1,
    },
    rewards: [
      {
        title: "Rural Farm",
        desc: "Unlocks a Rural Farm upgrade",
        img: { kind: "wiki", imageName: "Capital_Rural_Farm_Lv", level: 1 },
      },
    ],
  },
  {
    id: "sa_2",
    name: "Spear Fighting",
    column: 2,
    required: ["sa_1"],
    costs: {
      research_points: 2,
      coins: 15,
      food: 10,
    },
    rewards: [
      {
        title: "Infantry Barracks",
        desc: "Unlocks the Infantry Barracks",
        img: { kind: "wiki", imageName: "Capital_Infantry_Barracks_Lv", level: 1 },
      },
    ],
  },
  {
    id: "sa_3",
    name: "Firemaker",
    column: 3,
    required: ["sa_2"],
    costs: {
      research_points: 2,
      coins: 60,
      food: 40,
    },
    rewards: [
      {
        title: "Small Home",
        desc: "Unlocks a Small Home upgrade",
        img: { kind: "wiki", imageName: "Capital_Small_Home_Lv", level: 2 },
      },
      {
        title: "Small Home",
        desc: "Allows constructing 1 more Small Home building in your city",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
    ],
  },
  {
    id: "sa_4",
    name: "Cave Paintings",
    column: 4,
    required: ["sa_3"],
    costs: {
      research_points: 2,
      coins: 100,
      food: 60,
    },
    rewards: [
      {
        title: "Moderate Culture Site",
        desc: "Unlocks the Moderate Culture Site",
        img: { kind: "wiki", imageName: "Capital_Moderate_Culture_Site_Lv", level: 1 },
      },
      {
        title: "Luxurious Culture Site",
        desc: "Unlocks the Luxurious Culture Site",
        img: { kind: "wiki", imageName: "Capital_Luxurious_Culture_Site_Lv", level: 1 },
      },
    ],
  },
  {
    id: "sa_5",
    name: "Goat Pens",
    column: 5,
    required: ["sa_4"],
    costs: {
      research_points: 3,
      coins: 300,
      food: 100,
    },
    rewards: [
      {
        title: "Domestic Farm",
        desc: "Unlocks the Domestic Farm",
        img: { kind: "wiki", imageName: "Capital_Domestic_Farm_Lv", level: 1 },
      },
    ],
  },
  {
    id: "sa_6",
    name: "Agriculture",
    column: 6,
    required: ["sa_5"],
    costs: {
      research_points: 2,
      coins: 520,
      food: 375,
    },
    rewards: [
      {
        title: "Rural Farm",
        desc: "Unlocks a Rural Farm upgrade",
        img: { kind: "wiki", imageName: "Capital_Rural_Farm_Lv", level: 2 },
      },
      {
        title: "Rural Farm",
        desc: "Allows constructing 1 more Rural Farm building in your city",
        img: { kind: "catalog", imgType: "barn", invert: true },
      },
    ],
  },
  {
    id: "sa_7",
    name: "Slingshots",
    column: 6,
    required: ["sa_5"],
    costs: {
      research_points: 1,
      coins: 900,
      food: 650,
    },
    rewards: [
      {
        title: "Ranged Barracks",
        desc: "Unlocks the Ranged Barracks",
        img: { kind: "wiki", imageName: "Capital_Ranged_Barracks_Lv", level: 1 },
      },
    ],
  },
  {
    id: "sa_8",
    name: "Tribal Celebrations",
    column: 7,
    required: ["sa_6", "sa_7"],
    costs: {
      research_points: 5,
      coins: 1800,
      food: 1300,
    },
    rewards: [
      {
        title: "Events Unlocked",
        desc: "New Feature",
        img: { kind: "local", path: "/images/technos/features/icon_events.webp" },
      },
      {
        title: "Compact Culture Site",
        desc: "Unlocks the Compact Culture Site",
        img: { kind: "wiki", imageName: "Capital_Compact_Culture_Site_Lv", level: 1 },
      },
      {
        title: "Small Home",
        desc: "Allows constructing 1 more Small Home building in your city",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
    ],
  },
  {
    id: "sa_9",
    name: "Herding",
    column: 8,
    required: ["sa_8"],
    costs: {
      research_points: 6,
      coins: 3150,
      food: 2275,
    },
    rewards: [
      {
        title: "Domestic Farm",
        desc: "Unlocks a Domestic Farm upgrade",
        img: { kind: "wiki", imageName: "Capital_Domestic_Farm_Lv", level: 2 },
      },
      {
        title: "Domestic Farm",
        desc: "Allows constructing 1 more Domestic Farm building in your city",
        img: { kind: "catalog", imgType: "barn", invert: true },
      },
    ],
  },
  {
    id: "sa_10",
    name: "Combat Drills",
    column: 8,
    required: ["sa_8"],
    costs: {
      research_points: 5,
      coins: 4950,
      food: 3575,
    },
    rewards: [
      {
        title: "Infantry Barracks",
        desc: "Allows constructing 1 more Infantry Barracks building in your city",
        img: { kind: "catalog", imgType: "barracks", invert: true },
      },
    ],
  },
  {
    id: "sa_11",
    name: "Baby Boom",
    column: 8,
    required: ["sa_8"],
    costs: {
      research_points: 6,
      coins: 7560,
      food: 5460,
    },
    rewards: [
      {
        title: "Small Home",
        desc: "Unlocks a Small Home upgrade",
        img: { kind: "wiki", imageName: "Capital_Small_Home_Lv", level: 3 },
      },
      {
        title: "Small Home",
        desc: "Allows constructing 1 more Small Home building in your city",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
    ],
  },
  {
    id: "sa_12",
    name: "The Wheel",
    column: 9,
    required: ["sa_9"],
    costs: {
      research_points: 6,
      coins: 12600,
      food: 9100,
    },
    rewards: [
      {
        title: "Rural Farm",
        desc: "Unlocks a Rural Farm upgrade",
        img: { kind: "wiki", imageName: "Capital_Rural_Farm_Lv", level: 3 },
      },
    ],
  },
  {
    id: "sa_13",
    name: "Sacred Sites",
    column: 9,
    required: ["sa_10"],
    costs: {
      research_points: 5,
      coins: 15300,
      food: 11050,
    },
    rewards: [
      {
        title: "Daily Bonus Unlocked",
        desc: "New Feature",
        img: { kind: "local", path: "/images/technos/features/icon_dailybonus.webp" },
      },
      {
        title: "Compact Culture Site",
        desc: "Allows constructing 2 more Compact Culture Site buildings in your city",
        img: { kind: "catalog", imgType: "cultureSite", invert: true },
      },
    ],
  },
  {
    id: "sa_14",
    name: "Rural Community",
    column: 9,
    required: ["sa_11"],
    costs: {
      research_points: 6,
      coins: 18000,
      food: 13000,
    },
    rewards: [
      {
        title: "Small Home",
        desc: "Allows constructing 1 more Small Home building in your city",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
    ],
  },
  {
    id: "sa_15",
    name: "Domesticated Goats",
    column: 10,
    required: ["sa_12", "sa_13", "sa_14"],
    costs: {
      research_points: 7,
      coins: 25200,
      food: 18200,
    },
    rewards: [
      {
        title: "Domestic Farm",
        desc: "Unlocks a Domestic Farm upgrade",
        img: { kind: "wiki", imageName: "Capital_Domestic_Farm_Lv", level: 3 },
      },
    ],
  },
];
