import { TechnoData } from "@/types/shared";
import path from "path";

export const technos_BE: TechnoData[] = [
  {
    id: "be_0",
    name: "Byzantium",
    column: 0,
    required: [],
    costs: {
      research_points: 26,
      coins: 451000,
      food: 410000,
      goods: [
        {
          amount: 940,
          resource: "primary_cg",
        },
        {
          amount: 1250,
          resource: "primary_er",
        },
        {
          amount: 2260,
          resource: "primary_re",
        },
      ],
    },
    rewards: [
      {
        title: "Small Home",
        desc: "Unlocks a Small Home upgrade",
        img: { kind: "wiki", imageName: "Capital_Small_Home_Lv", level: 19 },
      },
      {
        title: "Rural Farm",
        desc: "Unlocks a Rural Farm upgrade",
        img: { kind: "wiki", imageName: "Capital_Rural_Farm_Lv", level: 19 },
      },
      {
        title: "Moderate Culture Site",
        desc: "Unlocks a Moderate Culture Site upgrade",
        img: {
          kind: "wiki",
          imageName: "Capital_Moderate_Culture_Site_Lv",
          level: 7,
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
    id: "be_1",
    name: "Bucellarii",
    column: 1,
    required: ["be_0"],
    costs: {
      research_points: 21,
      coins: 364000,
      food: 330000,
      goods: [
        {
          amount: 910,
          resource: "secondary_me",
        },
        {
          amount: 1260,
          resource: "secondary_cg",
        },
        {
          amount: 1820,
          resource: "secondary_re",
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
          level: 7,
        },
      },
      {
        title: "Compact Culture Site",
        desc: "Unlocks a Compact Culture Site upgrade",
        img: {
          kind: "wiki",
          imageName: "Capital_Compact_Culture_Site_Lv",
          level: 7,
        },
      },
    ],
  },
  {
    id: "be_2",
    name: "Rise of the Mayas",
    column: 1,
    required: ["be_0"],
    costs: {
      research_points: 18,
      coins: 303000,
      food: 275000,
      goods: [
        {
          amount: 630,
          resource: "tertiary_cg",
        },
        {
          amount: 840,
          resource: "primary_er",
        },
        {
          amount: 1510,
          resource: "primary_re",
        },
      ],
    },
    allied: "maya",
    rewards: [
      {
        title: "Unlock City",
        desc: "Unlocks Allied Culture Maya Empire!",
        img: { kind: "catalog", imgType: "maya" },
      },
      {
        title: "Worker Home",
        desc: "Unlocks the Worker Home",
        img: { kind: "wiki", imageName: "Maya_Worker_Home_Lv", level: 1 },
      },
      {
        title: "Jade Quarry",
        desc: "Unlocks the Jade Quarry",
        img: { kind: "wiki", imageName: "Maya_Jade_Quarry_Lv", level: 1 },
      },
      {
        title: "Obsidian Quarry",
        desc: "Unlocks the Obsidian Quarry",
        img: {
          kind: "wiki",
          imageName: "Maya_Obsidian_Quarry_Lv",
          level: 1,
        },
      },
    ],
  },
  {
    id: "be_3",
    name: "Primary Good",
    column: 2,
    required: ["be_1"],
    costs: {
      research_points: 33,
      coins: 561000,
      food: 509000,
      goods: [
        {
          amount: 1400,
          resource: "primary_me",
        },
        {
          amount: 3730,
          resource: "tertiary_er",
        },
        {
          amount: 1170,
          resource: "primary_re",
        },
      ],
    },
    rewards: [
      {
        title: "Primary Workshop",
        desc: "Unlocks the Primary Workshop",
        img: { kind: "catalog", imgType: "workshop", invert: true },
      },
      {
        title: "Primary Goods",
        desc: "Unlocks the good Primary Goods for you, so that you can produce it in your city",
        img: { kind: "good", priority: "primary" },
      },
      {
        title: "+20000",
        desc: "Increased Trade Token Limit",
        img: {
          kind: "local",
          path: "/images/technos/features/icon_limittradingtokens.webp",
        },
      },
    ],
  },
  {
    id: "be_4",
    name: "Ritual Sites",
    column: 2,
    required: ["be_2"],
    costs: {
      research_points: 17,
      coins: 288000,
      food: 261000,
      goods: [
        {
          amount: 720,
          resource: "tertiary_me",
        },
        {
          amount: 800,
          resource: "secondary_er",
        },
        {
          amount: 1440,
          resource: "tertiary_re",
        },
      ],
    },
    allied: "maya",
    rewards: [
      {
        title: "Small Ritual Site",
        desc: "Unlocks the Small Ritual Site",
        img: {
          kind: "wiki",
          imageName: "Maya_Small_Ritual_Site",
        },
      },
      {
        title: "Priest Home",
        desc: "Unlocks the Priest Home",
        img: { kind: "wiki", imageName: "Maya_Priest_Home_Lv", level: 1 },
      },
      {
        title: "Luxurious Ritual Site",
        desc: "Unlocks the Luxurious Ritual Site",
        img: {
          kind: "wiki",
          imageName: "Maya_Luxurious_Ritual_Site",
        },
      },
      {
        title: "Worker Home",
        desc: "Allows constructing 3 more Worker Home buildings in Maya Empire",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
    ],
  },
  {
    id: "be_5",
    name: "Stone Carving",
    column: 2,
    required: ["be_2"],
    costs: {
      research_points: 20,
      coins: 333000,
      food: 303000,
      goods: [
        {
          amount: 2220,
          resource: "secondary_er",
        },
        {
          amount: 420,
          resource: "secondary_re",
        },
        {
          amount: 700,
          resource: "tertiary_re",
        },
      ],
    },
    allied: "maya",
    rewards: [
      {
        title: "Mask Sculptor",
        desc: "Unlocks the Mask Sculptor",
        img: { kind: "catalog", imgType: "workshop", invert: true },
      },
      {
        title: "Ancestor Mask",
        desc: "Unlocks the good Ancestor Mask for you, so that you can produce it in Maya Empire",
        img: { kind: "local", path: "/images/goods-large/ancestor_mask.webp" },
      },
      {
        title: "Chronicler",
        desc: "Unlocks the Chronicler",
        img: { kind: "catalog", imgType: "workshop", invert: true },
      },
      {
        title: "Calendar Stone",
        desc: "Unlocks the good Calendar Stone for you, so that you can produce it in Maya Empire",
        img: { kind: "local", path: "/images/goods-large/calendar_stone.webp" },
      },
    ],
  },
  {
    id: "be_6",
    name: "Pendentive Dome",
    column: 3,
    required: ["be_3"],
    costs: {
      research_points: 36,
      coins: 606000,
      food: 550000,
      goods: [
        {
          amount: 1260,
          resource: "tertiary_cg",
        },
        {
          amount: 3030,
          resource: "secondary_re",
        },
        {
          amount: 150,
          resource: "primary_be",
        },
      ],
    },
    rewards: [
      {
        title: "Average Home",
        desc: "Unlocks a Average Home upgrade",
        img: { kind: "wiki", imageName: "Capital_Average_Home_Lv", level: 19 },
      },
      {
        title: "Little Culture Site",
        desc: "Unlocks a Little Culture Site upgrade",
        img: {
          kind: "wiki",
          imageName: "Capital_Little_Culture_Site_Lv",
          level: 7,
        },
      },
    ],
  },
  {
    id: "be_7",
    name: "Forquier",
    column: 3,
    required: ["be_3"],
    costs: {
      research_points: 40,
      coins: 682000,
      food: 619000,
      goods: [
        {
          amount: 850,
          resource: "secondary_re",
        },
        {
          amount: 3400,
          resource: "tertiary_re",
        },
        {
          amount: 300,
          resource: "primary_be",
        },
      ],
    },
    rewards: [
      {
        title: "Domestic Farm",
        desc: "Unlocks a Domestic Farm upgrade",
        img: { kind: "wiki", imageName: "Capital_Domestic_Farm_Lv", level: 19 },
      },
      {
        title: "Large Culture Site",
        desc: "Unlocks a Large Culture Site upgrade",
        img: {
          kind: "wiki",
          imageName: "Capital_Large_Culture_Site_Lv",
          level: 7,
        },
      },
    ],
  },
  {
    id: "be_8",
    name: "Sacrificial Offerings",
    column: 3,
    required: ["be_4", "be_5"],
    costs: {
      research_points: 31,
      coins: 530000,
      food: 481000,
      goods: [
        {
          amount: 3090,
          resource: "secondary_re",
        },
        {
          amount: 310,
          resource: "primary_be",
        },
        {
          amount: 250,
          resource: "ancestor_mask",
        },
      ],
    },
    allied: "maya",
    rewards: [
      {
        title: "Average Ritual Site",
        desc: "Unlocks the Average Ritual Site",
        img: {
          kind: "wiki",
          imageName: "Maya_Average_Ritual_Site",
        },
      },
      {
        title: "Priest Home",
        desc: "Allows constructing 2 more Priest Home buildings in Maya Empire",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
    ],
  },
  {
    id: "be_9",
    name: "Saracen Archers",
    column: 4,
    required: ["be_6"],
    costs: {
      research_points: 40,
      coins: 682000,
      food: 619000,
      goods: [
        {
          amount: 1140,
          resource: "secondary_er",
        },
        {
          amount: 3400,
          resource: "tertiary_re",
        },
        {
          amount: 380,
          resource: "secondary_be",
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
          level: 7,
        },
      },
    ],
  },
  {
    id: "be_10",
    name: "Architekton",
    column: 4,
    required: ["be_7"],
    costs: {
      research_points: 25,
      coins: 432000,
      food: 392000,
      goods: [
        {
          amount: 720,
          resource: "primary_er",
        },
        {
          amount: 2160,
          resource: "primary_re",
        },
        {
          amount: 240,
          resource: "tertiary_be",
        },
      ],
    },
    rewards: [
      {
        title: "Primary Workshop",
        desc: "Allows constructing 1 more Primary Workshop building in your city",
        img: { kind: "catalog", imgType: "workshop", invert: true },
      },
    ],
  },
  {
    id: "be_11",
    name: "Shamanism",
    column: 4,
    required: ["be_8"],
    costs: {
      research_points: 23,
      coins: 394000,
      food: 358000,
      goods: [
        {
          amount: 820,
          resource: "secondary_re",
        },
        {
          amount: 330,
          resource: "secondary_be",
        },
        {
          amount: 600,
          resource: "tertiary_be",
        },
      ],
    },
    allied: "maya",
    rewards: [
      {
        title: "Priest Home",
        desc: "Unlocks a Priest Home upgrade",
        img: { kind: "wiki", imageName: "Maya_Priest_Home_Lv", level: 2 },
      },
      {
        title: "Worker Home",
        desc: "Allows constructing 1 more Worker Home building in Maya Empire",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
    ],
  },
  {
    id: "be_12",
    name: "Etched Landmarks",
    column: 4,
    required: ["be_8"],
    costs: {
      research_points: 25,
      coins: 424000,
      food: 385000,
      goods: [
        {
          amount: 880,
          resource: "primary_re",
        },
        {
          amount: 680,
          resource: "secondary_be",
        },
        {
          amount: 360,
          resource: "tertiary_be",
        },
      ],
    },
    allied: "maya",
    rewards: [
      {
        title: "Jade Quarry",
        desc: "Allows constructing 1 more Jade Quarry building in Maya Empire",
        img: { kind: "catalog", imgType: "quarry", invert: true },
      },
      {
        title: "Obsidian Quarry",
        desc: "Allows constructing 1 more Obsidian Quarry building in Maya Empire",
        img: { kind: "catalog", imgType: "quarry", invert: true },
      },
    ],
  },
  {
    id: "be_13",
    name: "Theodosian Walls",
    column: 5,
    required: ["be_9", "be_10"],
    costs: {
      research_points: 33,
      coins: 561000,
      food: 509000,
      goods: [
        {
          amount: 1170,
          resource: "tertiary_cg",
        },
        {
          amount: 1560,
          resource: "secondary_er",
        },
        {
          amount: 900,
          resource: "tertiary_be",
        },
      ],
    },
    rewards: [
      {
        title: "Small Home",
        desc: "Unlocks a Small Home upgrade",
        img: { kind: "wiki", imageName: "Capital_Small_Home_Lv", level: 20 },
      },
      {
        title: "Small Home",
        desc: "Allows constructing 1 more Small Home building in your city",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
    ],
  },
  {
    id: "be_14",
    name: "Xocolatl",
    column: 5,
    required: ["be_11", "be_12"],
    costs: {
      research_points: 39,
      coins: 667000,
      food: 605000,
      goods: [
        {
          amount: 1110,
          resource: "primary_er",
        },
        {
          amount: 3330,
          resource: "secondary_re",
        },
        {
          amount: 930,
          resource: "tertiary_be",
        },
      ],
    },
    allied: "maya",
    rewards: [
      {
        title: "Worker Home",
        desc: "Unlocks a Worker Home upgrade",
        img: { kind: "wiki", imageName: "Maya_Worker_Home_Lv", level: 2 },
      },
      {
        title: "Worker Home",
        desc: "Allows constructing 1 more Worker Home building in Maya Empire",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
    ],
  },
  {
    id: "be_15",
    name: "Polyculture",
    column: 6,
    required: ["be_13"],
    costs: {
      research_points: 23,
      coins: 394000,
      food: 358000,
      goods: [
        {
          amount: 660,
          resource: "secondary_er",
        },
        {
          amount: 550,
          resource: "primary_be",
        },
        {
          amount: 800,
          resource: "tertiary_be",
        },
      ],
    },
    rewards: [
      {
        title: "Rural Farm",
        desc: "Unlocks a Rural Farm upgrade",
        img: { kind: "wiki", imageName: "Capital_Rural_Farm_Lv", level: 20 },
      },
      {
        title: "Compact Culture Site",
        desc: "Allows constructing 1 more Compact Culture Site building in your city",
        img: { kind: "catalog", imgType: "cultureSite", invert: true },
      },
      {
        title: "Primary Workshop",
        desc: "Allows constructing 1 more Primary Workshop building in your city",
        img: { kind: "catalog", imgType: "workshop", invert: true },
      },
    ],
  },
  {
    id: "be_16",
    name: "Crossgroined Vault",
    column: 6,
    required: ["be_13", "be_14"],
    costs: {
      research_points: 30,
      coins: 515000,
      food: 468000,
      goods: [
        {
          amount: 1200,
          resource: "primary_be",
        },
        {
          amount: 860,
          resource: "secondary_be",
        },
        {
          amount: 750,
          resource: "calendar_stone",
        },
      ],
    },
    rewards: [
      {
        title: "Average Home",
        desc: "Unlocks a Average Home upgrade",
        img: { kind: "wiki", imageName: "Capital_Average_Home_Lv", level: 20 },
      },
      {
        title: "Average Home",
        desc: "Allows constructing 1 more Average Home building in your city",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
    ],
  },
  {
    id: "be_17",
    name: "Obsidian Prospecting",
    column: 6,
    required: ["be_13", "be_14"],
    costs: {
      research_points: 34,
      coins: 576000,
      food: 523000,
      goods: [
        {
          amount: 1200,
          resource: "primary_re",
        },
        {
          amount: 480,
          resource: "primary_be",
        },
        {
          amount: 1150,
          resource: "secondary_be",
        },
      ],
    },
    allied: "maya",
    rewards: [
      {
        title: "Obsidian Quarry",
        desc: "Unlocks a Obsidian Quarry upgrade",
        img: {
          kind: "wiki",
          imageName: "Maya_Obsidian_Quarry_Lv",
          level: 2,
        },
      },
    ],
  },
  {
    id: "be_18",
    name: "Jade Prospecting",
    column: 6,
    required: ["be_13", "be_14"],
    costs: {
      research_points: 28,
      coins: 485000,
      food: 440000,
      goods: [
        {
          amount: 810,
          resource: "primary_er",
        },
        {
          amount: 2420,
          resource: "primary_re",
        },
        {
          amount: 670,
          resource: "tertiary_be",
        },
      ],
    },
    allied: "maya",
    rewards: [
      {
        title: "Jade Quarry",
        desc: "Unlocks a Jade Quarry upgrade",
        img: { kind: "wiki", imageName: "Maya_Jade_Quarry_Lv", level: 2 },
      },
    ],
  },
  {
    id: "be_19",
    name: "Catapult",
    column: 7,
    required: ["be_15", "be_16"],
    costs: {
      research_points: 53,
      coins: 909000,
      food: 825000,
      goods: [
        {
          amount: 1510,
          resource: "secondary_be",
        },
        {
          amount: 2000,
          resource: "tertiary_be",
        },
        {
          amount: 750,
          resource: "ancestor_mask",
        },
      ],
    },
    rewards: [
      {
        title: "Siege Barracks",
        desc: "Unlocks a Siege Barracks upgrade",
        img: { kind: "wiki", imageName: "Capital_Siege_Barracks_Lv", level: 7 },
      },
    ],
  },
  {
    id: "be_20",
    name: "Divining",
    column: 7,
    required: ["be_17", "be_18"],
    costs: {
      research_points: 33,
      coins: 568000,
      food: 516000,
      goods: [
        {
          amount: 950,
          resource: "primary_er",
        },
        {
          amount: 1300,
          resource: "secondary_be",
        },
        {
          amount: 790,
          resource: "tertiary_be",
        },
      ],
    },
    allied: "maya",
    rewards: [
      {
        title: "Small Ritual Site",
        desc: "Allows constructing 1 more Small Ritual Site building in Maya Empire",
        img: { kind: "catalog", imgType: "ritualSite", invert: true },
      },
      {
        title: "Priest Home",
        desc: "Allows constructing 1 more Priest Home building in Maya Empire",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
    ],
  },
  {
    id: "be_21",
    name: "Wheeled Plough",
    column: 8,
    required: ["be_19"],
    costs: {
      research_points: 39,
      coins: 670000,
      food: 608000,
      goods: [
        {
          amount: 1400,
          resource: "secondary_cg",
        },
        {
          amount: 1400,
          resource: "secondary_re",
        },
        {
          amount: 1500,
          resource: "primary_be",
        },
      ],
    },
    rewards: [
      {
        title: "Domestic Farm",
        desc: "Unlocks a Domestic Farm upgrade",
        img: { kind: "wiki", imageName: "Capital_Domestic_Farm_Lv", level: 20 },
      },
      {
        title: "Domestic Farm",
        desc: "Allows constructing 1 more Domestic Farm building in your city",
        img: { kind: "catalog", imgType: "barn", invert: true },
      },
    ],
  },
  {
    id: "be_22",
    name: "Spiritual Ancestry",
    column: 8,
    required: ["be_20"],
    costs: {
      research_points: 35,
      coins: 595000,
      food: 540000,
      goods: [
        {
          amount: 1240,
          resource: "tertiary_re",
        },
        {
          amount: 500,
          resource: "secondary_be",
        },
        {
          amount: 1400,
          resource: "tertiary_be",
        },
      ],
    },
    allied: "maya",
    rewards: [
      {
        title: "Mask Sculptor",
        desc: "Allows constructing 1 more Mask Sculptor building in Maya Empire",
        img: { kind: "catalog", imgType: "workshop", invert: true },
      },
      {
        title: "Worker Home",
        desc: "Allows constructing 1 more Worker Home building in Maya Empire",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
    ],
  },
  {
    id: "be_23",
    name: "Precise Chronicle",
    column: 8,
    required: ["be_20"],
    costs: {
      research_points: 37,
      coins: 636000,
      food: 578000,
      goods: [
        {
          amount: 1060,
          resource: "secondary_er",
        },
        {
          amount: 3180,
          resource: "primary_re",
        },
        {
          amount: 880,
          resource: "primary_be",
        },
      ],
    },
    allied: "maya",
    rewards: [
      {
        title: "Chronicler",
        desc: "Allows constructing 1 more Chronicler building in Maya Empire",
        img: { kind: "catalog", imgType: "workshop", invert: true },
      },
      {
        title: "Worker Home",
        desc: "Allows constructing 1 more Worker Home building in Maya Empire",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
    ],
  },
  {
    id: "be_24",
    name: "Mortar",
    column: 9,
    required: ["be_21"],
    costs: {
      research_points: 55,
      coins: 945000,
      food: 858000,
      goods: [
        {
          amount: 1570,
          resource: "primary_er",
        },
        {
          amount: 3150,
          resource: "primary_be",
        },
        {
          amount: 1310,
          resource: "secondary_be",
        },
      ],
    },
    rewards: [
      {
        title: "Small Home",
        desc: "Unlocks a Small Home upgrade",
        img: { kind: "wiki", imageName: "Capital_Small_Home_Lv", level: 21 },
      },
      {
        title: "Small Home",
        desc: "Allows constructing 1 more Small Home building in your city",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
    ],
  },
  {
    id: "be_25",
    name: "Solar Rituals",
    column: 9,
    required: ["be_22"],
    costs: {
      research_points: 41,
      coins: 708000,
      food: 643000,
      goods: [
        {
          amount: 1970,
          resource: "tertiary_er",
        },
        {
          amount: 590,
          resource: "primary_be",
        },
        {
          amount: 2360,
          resource: "tertiary_be",
        },
      ],
    },
    allied: "maya",
    rewards: [
      {
        title: "Average Ritual Site",
        desc: "Allows constructing 1 more Average Ritual Site building in Maya Empire",
        img: { kind: "catalog", imgType: "ritualSite", invert: true },
      },
      {
        title: "Worker Home",
        desc: "Allows constructing 1 more Worker Home building in Maya Empire",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
    ],
  },
  {
    id: "be_26",
    name: "Chocolate Making",
    column: 9,
    required: ["be_23"],
    costs: {
      research_points: 49,
      coins: 833000,
      food: 756000,
      goods: [
        {
          amount: 1740,
          resource: "primary_re",
        },
        {
          amount: 2770,
          resource: "secondary_be",
        },
        {
          amount: 700,
          resource: "tertiary_be",
        },
      ],
    },
    allied: "maya",
    rewards: [
      {
        title: "Worker Home",
        desc: "Unlocks a Worker Home upgrade",
        img: { kind: "wiki", imageName: "Maya_Worker_Home_Lv", level: 3 },
      },
      {
        title: "Worker Home",
        desc: "Allows constructing 2 more Worker Home buildings in Maya Empire",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
    ],
  },
  {
    id: "be_27",
    name: "Gregorian Calendar",
    column: 10,
    required: ["be_24", "be_25", "be_26"],
    costs: {
      research_points: 39,
      coins: 667000,
      food: 605000,
      goods: [
        {
          amount: 1110,
          resource: "secondary_er",
        },
        {
          amount: 3330,
          resource: "primary_re",
        },
        {
          amount: 930,
          resource: "tertiary_be",
        },
      ],
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
    id: "be_28",
    name: "Trapezites",
    column: 10,
    required: ["be_24", "be_25", "be_26"],
    costs: {
      research_points: 61,
      coins: 1000000,
      food: 949000,
      goods: [
        {
          amount: 1740,
          resource: "tertiary_er",
        },
        {
          amount: 1450,
          resource: "secondary_be",
        },
        {
          amount: 3480,
          resource: "tertiary_be",
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
          level: 7,
        },
      },
    ],
  },
  {
    id: "be_29",
    name: "Nature Spirits",
    column: 10,
    required: ["be_24", "be_25", "be_26"],
    costs: {
      research_points: 55,
      coins: 947000,
      food: 859000,
      goods: [
        {
          amount: 5510,
          resource: "secondary_re",
        },
        {
          amount: 1580,
          resource: "primary_be",
        },
        {
          amount: 1250,
          resource: "calendar_stone",
        },
      ],
    },
    allied: "maya",
    rewards: [
      {
        title: "Priest Home",
        desc: "Unlocks a Priest Home upgrade",
        img: { kind: "wiki", imageName: "Maya_Priest_Home_Lv", level: 3 },
      },
      {
        title: "Priest Home",
        desc: "Allows constructing 1 more Priest Home building in Maya Empire",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
    ],
  },
  {
    id: "be_30",
    name: "Domical Vault",
    column: 11,
    required: ["be_27"],
    costs: {
      research_points: 51,
      coins: 864000,
      food: 784000,
      goods: [
        {
          amount: 1800,
          resource: "primary_cg",
        },
        {
          amount: 1800,
          resource: "secondary_re",
        },
        {
          amount: 2880,
          resource: "primary_be",
        },
      ],
    },
    rewards: [
      {
        title: "Average Home",
        desc: "Unlocks a Average Home upgrade",
        img: { kind: "wiki", imageName: "Capital_Average_Home_Lv", level: 21 },
      },
    ],
  },
  {
    id: "be_31",
    name: "Tillage",
    column: 11,
    required: ["be_28"],
    costs: {
      research_points: 60,
      coins: 1000000,
      food: 928000,
      goods: [
        {
          amount: 2130,
          resource: "tertiary_re",
        },
        {
          amount: 850,
          resource: "secondary_be",
        },
        {
          amount: 3400,
          resource: "tertiary_be",
        },
      ],
    },
    rewards: [
      {
        title: "Rural Farm",
        desc: "Unlocks a Rural Farm upgrade",
        img: { kind: "wiki", imageName: "Capital_Rural_Farm_Lv", level: 21 },
      },
    ],
  },
  {
    id: "be_32",
    name: "Jade Deposits",
    column: 11,
    required: ["be_29"],
    costs: {
      research_points: 54,
      coins: 924000,
      food: 839000,
      goods: [
        {
          amount: 1540,
          resource: "secondary_er",
        },
        {
          amount: 4610,
          resource: "secondary_re",
        },
        {
          amount: 1280,
          resource: "tertiary_be",
        },
      ],
    },
    allied: "maya",
    rewards: [
      {
        title: "Jade Quarry",
        desc: "Allows constructing 1 more Jade Quarry building in Maya Empire",
        img: { kind: "catalog", imgType: "quarry", invert: true },
      },
    ],
  },
  {
    id: "be_33",
    name: "Obsidian Deposits",
    column: 11,
    required: ["be_29"],
    costs: {
      research_points: 55,
      coins: 939000,
      food: 853000,
      goods: [
        {
          amount: 1560,
          resource: "tertiary_er",
        },
        {
          amount: 3130,
          resource: "primary_be",
        },
        {
          amount: 1300,
          resource: "secondary_be",
        },
      ],
    },
    allied: "maya",
    rewards: [
      {
        title: "Obsidian Quarry",
        desc: "Allows constructing 1 more Obsidian Quarry building in Maya Empire",
        img: { kind: "catalog", imgType: "quarry", invert: true },
      },
      {
        title: "Worker Home",
        desc: "Allows constructing 1 more Worker Home building in Maya Empire",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
    ],
  },
  {
    id: "be_34",
    name: "Jovians",
    column: 12,
    required: ["be_30", "be_31"],
    costs: {
      research_points: 71,
      coins: 1200000,
      food: 1100000,
      goods: [
        {
          amount: 2020,
          resource: "primary_er",
        },
        {
          amount: 6050,
          resource: "tertiary_re",
        },
        {
          amount: 1680,
          resource: "primary_be",
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
          level: 7,
        },
      },
    ],
  },
  {
    id: "be_35",
    name: "Better Jade Extraction",
    column: 12,
    required: ["be_32"],
    costs: {
      research_points: 61,
      coins: 1000000,
      food: 938000,
      goods: [
        {
          amount: 2150,
          resource: "primary_re",
        },
        {
          amount: 860,
          resource: "secondary_be",
        },
        {
          amount: 3440,
          resource: "tertiary_be",
        },
      ],
    },
    allied: "maya",
    rewards: [
      {
        title: "Jade Quarry",
        desc: "Unlocks a Jade Quarry upgrade",
        img: { kind: "wiki", imageName: "Maya_Jade_Quarry_Lv", level: 3 },
      },
    ],
  },
  {
    id: "be_36",
    name: "Better Obsidian Extraction",
    column: 12,
    required: ["be_33"],
    costs: {
      research_points: 67,
      coins: 1100000,
      food: 1000000,
      goods: [
        {
          amount: 6620,
          resource: "primary_re",
        },
        {
          amount: 1890,
          resource: "tertiary_be",
        },
        {
          amount: 1500,
          resource: "ancestor_mask",
        },
      ],
    },
    allied: "maya",
    rewards: [
      {
        title: "Obsidian Quarry",
        desc: "Unlocks a Obsidian Quarry upgrade",
        img: {
          kind: "wiki",
          imageName: "Maya_Obsidian_Quarry_Lv",
          level: 3,
        },
      },
    ],
  },
  {
    id: "be_37",
    name: "Secondary Good",
    column: 13,
    required: ["be_34"],
    costs: {
      research_points: 59,
      coins: 1000000,
      food: 921000,
      goods: [
        {
          amount: 2110,
          resource: "secondary_re",
        },
        {
          amount: 5070,
          resource: "tertiary_re",
        },
        {
          amount: 850,
          resource: "primary_be",
        },
      ],
    },
    rewards: [
      {
        title: "Secondary Workshop",
        desc: "Unlocks the Secondary Workshop",
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
    id: "be_38",
    name: "Water Cistern",
    column: 13,
    required: ["be_34"],
    costs: {
      research_points: 60,
      coins: 1000000,
      food: 925000,
      goods: [
        {
          amount: 1700,
          resource: "secondary_er",
        },
        {
          amount: 1410,
          resource: "primary_be",
        },
        {
          amount: 3390,
          resource: "secondary_be",
        },
      ],
    },
    rewards: [
      {
        title: "Domestic Farm",
        desc: "Unlocks a Domestic Farm upgrade",
        img: { kind: "wiki", imageName: "Capital_Domestic_Farm_Lv", level: 21 },
      },
    ],
  },
  {
    id: "be_39",
    name: "State Laws",
    column: 13,
    required: ["be_35"],
    costs: {
      research_points: 65,
      coins: 1100000,
      food: 1000000,
      goods: [
        {
          amount: 2320,
          resource: "tertiary_re",
        },
        {
          amount: 3710,
          resource: "primary_be",
        },
        {
          amount: 930,
          resource: "secondary_be",
        },
      ],
    },
    allied: "maya",
    rewards: [
      {
        title: "Worker Home",
        desc: "Allows constructing 1 more Worker Home building in Maya Empire",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
    ],
  },
  {
    id: "be_40",
    name: "Curative Rituals",
    column: 13,
    required: ["be_36"],
    costs: {
      research_points: 60,
      coins: 1000000,
      food: 935000,
      goods: [
        {
          amount: 1720,
          resource: "tertiary_er",
        },
        {
          amount: 5140,
          resource: "tertiary_re",
        },
        {
          amount: 1430,
          resource: "secondary_be",
        },
      ],
    },
    allied: "maya",
    rewards: [
      {
        title: "Average Ritual Site",
        desc: "Allows constructing 1 more Average Ritual Site building in Maya Empire",
        img: { kind: "catalog", imgType: "ritualSite", invert: true },
      },
    ],
  },
  {
    id: "be_41",
    name: "Tertiary Good",
    column: 14,
    required: ["be_37", "be_38", "be_39", "be_40"],
    costs: {
      research_points: 72,
      coins: 1200000,
      food: 1100000,
      goods: [
        {
          amount: 2060,
          resource: "primary_be",
        },
        {
          amount: 4790,
          resource: "secondary_be",
        },
      ],
    },
    rewards: [
      {
        title: "Tertiary Workshop",
        desc: "Unlocks the Tertiary Workshop",
        img: { kind: "catalog", imgType: "workshop", invert: true },
      },
      {
        title: "Tertiary Goods",
        desc: "Unlocks the good Tertiary Goods for you, so that you can produce it in your city",
        img: { kind: "good", priority: "tertiary" },
      },
    ],
  },
];
