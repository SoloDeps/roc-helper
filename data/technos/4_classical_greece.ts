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
      "Small Home: Unlocks a Small Home upgrade",
      "Rural Farm: Unlocks a Rural Farm upgrade",
      "Rural Farm: Allows constructing 1 more Rural Farm building in your city",
      "City Hall: Unlocks a Great Hall upgrade",
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
      "Average Home: Unlocks a Average Home upgrade",
      "Small Home: Allows constructing 2 more Small Home buildings in your city",
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
      "Small Home: Unlocks a Small Home upgrade",
      "Average Home: Unlocks a Average Home upgrade",
      "Small Home: Allows constructing 1 more Small Home building in your city",
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
      "Domestic Farm: Unlocks a Domestic Farm upgrade",
      "Moderate Culture Site: Unlocks a Moderate Culture Site upgrade",
      "Luxurious Culture Site: Unlocks a Luxurious Culture Site upgrade",
      "Luxurious Culture Site: Allows constructing 1 more Luxurious Culture Site building in your city",
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
      "Primary Good: Unlocks a Primary Good upgrade",
      "Primary Goods: Unlocks the good Primary Goods for you, so that you can produce it in your city",
      "Primary Good: Allows constructing 1 more Primary Good building in your city",
      "Dock Workers: Increases dock worker amount",
      "Harbor: +1 Trading Slot",
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
      "Gold Mine: Unlocks a Gold Mine upgrade",
      "Gold Mine: Allows constructing 1 more Gold Mine building in your city",
      "Small Well: Allows constructing 1 more Small Well building in your city",
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
      "Papyrus Field: Unlocks a Papyrus Field upgrade",
      "Papyrus Field: Allows constructing 1 more Papyrus Field building in your city",
      "Irrigation Station: Allows constructing 1 more Irrigation Station building in your city",
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
      "Compact Culture Site: Unlocks a Compact Culture Site upgrade",
      "Compact Culture Site: Allows constructing 1 more Compact Culture Site building in your city",
      "+10000: Increased Trade Token Limit",
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
    rewards: ["Infantry Barracks: Unlocks a Infantry Barracks upgrade"],
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
      "Goldsmith: Unlocks a Goldsmith upgrade",
      "Golden Mask: Unlocks the good Golden Mask for you, so that you can produce it in your city",
      "Average Home: Allows constructing 1 more Average Home building in your city",
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
      "Papyrus Press: Unlocks a Papyrus Press upgrade",
      "Ceremonial Dress: Unlocks the good Ceremonial Dress for you, so that you can produce it in your city",
      "Small Home: Allows constructing 1 more Small Home building in your city",
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
      "Small Home: Unlocks a Small Home upgrade",
      "Average Home: Unlocks a Average Home upgrade",
      "Little Culture Site: Unlocks a Little Culture Site upgrade",
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
    rewards: ["Channel: Unlocks the Channel", "Fountain: Unlocks the Fountain"],
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
      "Rural Farm: Unlocks a Rural Farm upgrade",
      "Domestic Farm: Unlocks a Domestic Farm upgrade",
      "Domestic Farm: Allows constructing 1 more Domestic Farm building in your city",
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
    rewards: ["Ranged Barracks: Unlocks a Ranged Barracks upgrade"],
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
      "Small Home: Unlocks a Small Home upgrade",
      "Small Home: Allows constructing 1 more Small Home building in your city",
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
      "Average Home: Unlocks a Average Home upgrade",
      "Average Home: Allows constructing 1 more Average Home building in your city",
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
      "Heavy Infantry Barracks: Unlocks the Heavy Infantry Barracks",
      "Rural Farm: Allows constructing 1 more Rural Farm building in your city",
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
    rewards: ["Large Culture Site: Unlocks the Large Culture Site"],
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
      "Gold Mine: Unlocks a Gold Mine upgrade",
      "Papyrus Field: Unlocks a Papyrus Field upgrade",
      "Gold Mine: Allows constructing 1 more Gold Mine building in your city",
      "Papyrus Field: Allows constructing 1 more Papyrus Field building in your city",
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
      "Papyrus Press: Allows constructing 1 more Papyrus Press building in your city",
      "Goldsmith: Allows constructing 1 more Goldsmith building in your city",
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
      "Cavalry Barracks: Unlocks a Cavalry Barracks upgrade",
      "Average Home: Allows constructing 1 more Average Home building in your city",
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
      "Small Home: Unlocks a Small Home upgrade",
      "Average Home: Unlocks a Average Home upgrade",
      "Small Home: Allows constructing 2 more Small Home buildings in your city",
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
    rewards: ["Water Pump: Unlocks the Water Pump"],
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
      "Rural Farm: Unlocks a Rural Farm upgrade",
      "Domestic Farm: Unlocks a Domestic Farm upgrade",
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
      "Secondary Good: Unlocks a Secondary Good upgrade",
      "Secondary Goods: Unlocks the good Secondary Goods for you, so that you can produce it in your city",
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
      "Small Home: Unlocks a Small Home upgrade",
      "Average Home: Unlocks a Average Home upgrade",
      "Small Home: Allows constructing 1 more Small Home building in your city",
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
      "Tertiary Good: Unlocks a Tertiary Good upgrade",
      "Tertiary Goods: Unlocks the good Tertiary Goods for you, so that you can produce it in your city",
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
      "Gold Mine: Unlocks a Gold Mine upgrade",
      "Papyrus Field: Unlocks a Papyrus Field upgrade",
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
    rewards: ["20: Gives you 20 Gems"],
  },
];
