import { TechnoData } from "@/types/shared";

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
      "Small Home: Unlocks a Small Home upgrade",
      "Rural Farm: Unlocks a Rural Farm upgrade",
      "Moderate Culture Site: Unlocks a Moderate Culture Site upgrade",
      "City Hall: Unlocks a Great Hall upgrade",
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
      "Infantry Barracks: Unlocks a Infantry Barracks upgrade",
      "Compact Culture Site: Unlocks a Compact Culture Site upgrade",
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
      "Unlock City: Unlocks Allied Culture Maya Empire!",
      "Worker Home: Unlocks the Worker Home",
      "Jade Quarry: Unlocks the Jade Quarry",
      "Obsidian Quarry: Unlocks the Obsidian Quarry",
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
      "Primary Good: Unlocks the Primary Good",
      "Primary Goods: Unlocks the good Primary Goods for you, so that you can produce it in your city",
      "+20000: Increased Trade Token Limit",
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
      "Small Ritual Site: Unlocks the Small Ritual Site",
      "Priest Home: Unlocks the Priest Home",
      "Luxurious Ritual Site: Unlocks the Luxurious Ritual Site",
      "Worker Home: Allows constructing 3 more Worker Home buildings in your city",
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
      "Mask Sculptor: Unlocks the Mask Sculptor",
      "Ancestor Mask: Unlocks the good Ancestor Mask for you, so that you can produce it in your city",
      "Chronicler: Unlocks the Chronicler",
      "Calendar Stone: Unlocks the good Calendar Stone for you, so that you can produce it in your city",
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
      "Average Home: Unlocks a Average Home upgrade",
      "Little Culture Site: Unlocks a Little Culture Site upgrade",
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
      "Domestic Farm: Unlocks a Domestic Farm upgrade",
      "Large Culture Site: Unlocks a Large Culture Site upgrade",
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
      "Average Ritual Site: Unlocks the Average Ritual Site",
      "Priest Home: Allows constructing 2 more Priest Home buildings in your city",
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
    rewards: ["Ranged Barracks: Unlocks a Ranged Barracks upgrade"],
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
      "Primary Good: Allows constructing 1 more Primary Good building in your city",
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
      "Priest Home: Unlocks a Priest Home upgrade",
      "Worker Home: Allows constructing 1 more Worker Home building in your city",
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
      "Jade Quarry: Allows constructing 1 more Jade Quarry building in your city",
      "Obsidian Quarry: Allows constructing 1 more Obsidian Quarry building in your city",
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
      "Small Home: Unlocks a Small Home upgrade",
      "Small Home: Allows constructing 1 more Small Home building in your city",
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
      "Worker Home: Unlocks a Worker Home upgrade",
      "Worker Home: Allows constructing 1 more Worker Home building in your city",
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
      "Rural Farm: Unlocks a Rural Farm upgrade",
      "Compact Culture Site: Allows constructing 1 more Compact Culture Site building in your city",
      "Primary Good: Allows constructing 1 more Primary Good building in your city",
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
      "Average Home: Unlocks a Average Home upgrade",
      "Average Home: Allows constructing 1 more Average Home building in your city",
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
    rewards: ["Obsidian Quarry: Unlocks a Obsidian Quarry upgrade"],
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
    rewards: ["Jade Quarry: Unlocks a Jade Quarry upgrade"],
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
    rewards: ["Siege Barracks: Unlocks a Siege Barracks upgrade"],
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
      "Small Ritual Site: Allows constructing 1 more Small Ritual Site building in your city",
      "Priest Home: Allows constructing 1 more Priest Home building in your city",
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
      "Domestic Farm: Unlocks a Domestic Farm upgrade",
      "Domestic Farm: Allows constructing 1 more Domestic Farm building in your city",
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
      "Mask Sculptor: Allows constructing 1 more Mask Sculptor building in your city",
      "Worker Home: Allows constructing 1 more Worker Home building in your city",
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
      "Chronicler: Allows constructing 1 more Chronicler building in your city",
      "Worker Home: Allows constructing 1 more Worker Home building in your city",
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
      "Small Home: Unlocks a Small Home upgrade",
      "Small Home: Allows constructing 1 more Small Home building in your city",
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
      "Average Ritual Site: Allows constructing 1 more Average Ritual Site building in your city",
      "Worker Home: Allows constructing 1 more Worker Home building in your city",
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
      "Worker Home: Unlocks a Worker Home upgrade",
      "Worker Home: Allows constructing 2 more Worker Home buildings in your city",
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
      "Little Culture Site: Allows constructing 1 more Little Culture Site building in your city",
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
    rewards: ["Cavalry Barracks: Unlocks a Cavalry Barracks upgrade"],
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
      "Priest Home: Unlocks a Priest Home upgrade",
      "Priest Home: Allows constructing 1 more Priest Home building in your city",
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
    rewards: ["Average Home: Unlocks a Average Home upgrade"],
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
    rewards: ["Rural Farm: Unlocks a Rural Farm upgrade"],
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
      "Jade Quarry: Allows constructing 1 more Jade Quarry building in your city",
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
      "Obsidian Quarry: Allows constructing 1 more Obsidian Quarry building in your city",
      "Worker Home: Allows constructing 1 more Worker Home building in your city",
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
      "Heavy Infantry Barracks: Unlocks a Heavy Infantry Barracks upgrade",
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
    rewards: ["Jade Quarry: Unlocks a Jade Quarry upgrade"],
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
    rewards: ["Obsidian Quarry: Unlocks a Obsidian Quarry upgrade"],
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
      "Secondary Good: Unlocks the Secondary Good",
      "Secondary Goods: Unlocks the good Secondary Goods for you, so that you can produce it in your city",
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
    rewards: ["Domestic Farm: Unlocks a Domestic Farm upgrade"],
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
      "Worker Home: Allows constructing 1 more Worker Home building in your city",
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
      "Average Ritual Site: Allows constructing 1 more Average Ritual Site building in your city",
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
      "Tertiary Good: Unlocks the Tertiary Good",
      "Tertiary Goods: Unlocks the good Tertiary Goods for you, so that you can produce it in your city",
    ],
  },
];
