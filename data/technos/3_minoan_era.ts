import { TechnoData } from "@/types/shared";

export const technos_ME: TechnoData[] = [
  {
    id: "me_0",
    name: "Township",
    column: 0,
    required: [],
    costs: {
      research_points: 6,
      coins: 69100,
      food: 51000,
      goods: [
        {
          amount: 210,
          resource: "primary_ba",
        },
        {
          amount: 90,
          resource: "secondary_ba",
        },
        {
          amount: 55,
          resource: "tertiary_ba",
        },
      ],
    },
    rewards: [
      "Small Home: Unlocks a Small Home upgrade",
      "Luxurious Home: Unlocks a Luxurious Home upgrade",
      "City Hall: Unlocks a Great Hall upgrade",
    ],
  },
  {
    id: "me_1",
    name: "Primary Workshop",
    column: 1,
    required: ["me_0"],
    costs: {
      research_points: 7,
      coins: 84000,
      food: 62100,
      goods: [
        {
          amount: 300,
          resource: "secondary_ba",
        },
        {
          amount: 130,
          resource: "tertiary_ba",
        },
      ],
    },
    rewards: [
      "Primary Workshop: Unlocks a Primary Workshop upgrade",
      "Primary Goods: Unlocks the good Primary Goods for you, so that you can produce it in your city",
      "Primary Workshop: Allows constructing 1 more Primary Workshop building in your city",
    ],
  },
  {
    id: "me_2",
    name: "Trading",
    column: 2,
    required: ["me_1"],
    costs: {
      research_points: 6,
      coins: 63400,
      food: 46800,
      goods: [
        {
          amount: 225,
          resource: "primary_ba",
        },
        {
          amount: 95,
          resource: "tertiary_ba",
        },
      ],
    },
    rewards: [
      "Trading Unlocked: New Feature",
      "Dock Workers: Increases dock worker amount",
    ],
  },
  {
    id: "me_3",
    name: "Arenas",
    column: 2,
    required: ["me_1"],
    costs: {
      research_points: 9,
      coins: 101000,
      food: 74800,
      goods: [
        {
          amount: 70,
          resource: "secondary_ba",
        },
        {
          amount: 105,
          resource: "primary_me",
        },
      ],
    },
    rewards: [
      "Player Encounters Unlocked: New Feature",
      "Infantry Barracks: Unlocks a Infantry Barracks upgrade",
    ],
  },
  {
    id: "me_4",
    name: "Oat Production",
    column: 3,
    required: ["me_2"],
    costs: {
      research_points: 6,
      coins: 66900,
      food: 49400,
      goods: [
        {
          amount: 205,
          resource: "primary_ba",
        },
        {
          amount: 50,
          resource: "tertiary_ba",
        },
        {
          amount: 55,
          resource: "secondary_me",
        },
      ],
    },
    rewards: [
      "Rural Farm: Unlocks a Rural Farm upgrade",
      "Luxurious Farm: Unlocks a Luxurious Farm upgrade",
      "Luxurious Culture Site: Unlocks a Luxurious Culture Site upgrade",
      "Average Home: Allows constructing 1 more Average Home building in your city",
    ],
  },
  {
    id: "me_5",
    name: "Shepherding",
    column: 3,
    required: ["me_2"],
    costs: {
      research_points: 7,
      coins: 84500,
      food: 62400,
      goods: [
        {
          amount: 300,
          resource: "primary_ba",
        },
        {
          amount: 85,
          resource: "tertiary_me",
        },
      ],
    },
    rewards: [
      "Domestic Farm: Unlocks a Domestic Farm upgrade",
      "Little Culture Site: Unlocks a Little Culture Site upgrade",
      "Small Home: Allows constructing 1 more Small Home building in your city",
    ],
  },
  {
    id: "me_6",
    name: "Masonry",
    column: 3,
    required: ["me_3"],
    costs: {
      research_points: 10,
      coins: 110000,
      food: 81300,
      goods: [
        {
          amount: 200,
          resource: "secondary_ba",
        },
        {
          amount: 315,
          resource: "primary_me",
        },
      ],
    },
    rewards: [
      "Average Home: Unlocks a Average Home upgrade",
      "Moderate Culture Site: Unlocks a Moderate Culture Site upgrade",
    ],
  },
  {
    id: "me_7",
    name: "Basket Weaving",
    column: 4,
    required: ["me_4"],
    costs: {
      research_points: 10,
      coins: 110000,
      food: 81600,
      goods: [
        {
          amount: 225,
          resource: "primary_me",
        },
        {
          amount: 95,
          resource: "secondary_me",
        },
        {
          amount: 55,
          resource: "tertiary_me",
        },
      ],
    },
    rewards: [
      "Small Home: Unlocks a Small Home upgrade",
      "Compact Culture Site: Unlocks a Compact Culture Site upgrade",
      "Compact Culture Site: Allows constructing 1 more Compact Culture Site building in your city",
    ],
  },
  {
    id: "me_8",
    name: "Composite Bow",
    column: 4,
    required: ["me_5", "me_6"],
    costs: {
      research_points: 9,
      coins: 102000,
      food: 75400,
      goods: [
        {
          amount: 130,
          resource: "secondary_ba",
        },
        {
          amount: 80,
          resource: "tertiary_ba",
        },
        {
          amount: 210,
          resource: "primary_me",
        },
      ],
    },
    rewards: ["Ranged Barracks: Unlocks a Ranged Barracks upgrade"],
  },
  {
    id: "me_9",
    name: "Rise of Egypt",
    column: 5,
    required: ["me_7", "me_8"],
    costs: {
      research_points: 15,
    },
    allied: "egypt",
    rewards: [
      "Unlock City: Unlocks Allied Culture Egypt",
      "Small Home: Unlocks the Small Home",
      "Luxurious Home: Unlocks the Luxurious Home",
    ],
  },
  {
    id: "me_10",
    name: "Egyptian Diplomacy",
    column: 6,
    required: ["me_9"],
    costs: {
      research_points: 5,
      goods: [
        {
          amount: 250,
          resource: "deben",
        },
      ],
    },
    allied: "egypt",
    rewards: [
      "Gold Mine: Unlocks the Gold Mine",
      "Papyrus Field: Unlocks the Papyrus Field",
      "Luxurious Gold Mine: Unlocks the Luxurious Gold Mine",
      "Luxurious Papyrus Field: Unlocks the Luxurious Papyrus Field",
    ],
  },
  {
    id: "me_11",
    name: "Ankh",
    column: 7,
    required: ["me_10"],
    costs: {
      research_points: 6,
      coins: 66000,
      food: 48800,
      goods: [
        {
          amount: 210,
          resource: "primary_me",
        },
        {
          amount: 90,
          resource: "secondary_me",
        },
      ],
    },
    allied: "egypt",
    rewards: [
      "Goldsmith: Unlocks the Goldsmith",
      "Ankh: Unlocks the good Ankh for you, so that you can produce it in your city",
    ],
  },
  {
    id: "me_12",
    name: "Papyrus Scroll",
    column: 7,
    required: ["me_10"],
    costs: {
      research_points: 5,
      coins: 110000,
      food: 81300,
      goods: [
        {
          amount: 265,
          resource: "secondary_me",
        },
        {
          amount: 115,
          resource: "tertiary_me",
        },
      ],
    },
    allied: "egypt",
    rewards: [
      "Papyrus Press: Unlocks the Papyrus Press",
      "Papyrus Scroll: Unlocks the good Papyrus Scroll for you, so that you can produce it in your city",
    ],
  },
  {
    id: "me_13",
    name: "Screws",
    column: 8,
    required: ["me_11", "me_12"],
    costs: {
      research_points: 4,
      coins: 88000,
      food: 81300,
      goods: [
        {
          amount: 290,
          resource: "primary_me",
        },
        {
          amount: 125,
          resource: "tertiary_me",
        },
      ],
    },
    rewards: [
      "Average Home: Unlocks a Average Home upgrade",
      "Moderate Culture Site: Allows constructing 1 more Moderate Culture Site building in your city",
    ],
  },
  {
    id: "me_14",
    name: "Hieroglyphs",
    column: 8,
    required: ["me_11", "me_12"],
    costs: {
      research_points: 8,
      coins: 110000,
      food: 65000,
      goods: [
        {
          amount: 210,
          resource: "secondary_ba",
        },
        {
          amount: 325,
          resource: "secondary_me",
        },
      ],
    },
    allied: "egypt",
    rewards: [
      "Average Home: Unlocks the Average Home",
      "Small Well: Unlocks the Small Well",
      "Oasis: Unlocks the Oasis",
    ],
  },
  {
    id: "me_15",
    name: "Animal Husbandry",
    column: 9,
    required: ["me_13"],
    costs: {
      research_points: 14,
      coins: 134000,
      food: 98800,
      goods: [
        {
          amount: 160,
          resource: "secondary_me",
        },
        {
          amount: 370,
          resource: "tertiary_me",
        },
      ],
    },
    rewards: [
      "Domestic Farm: Unlocks a Domestic Farm upgrade",
      "Domestic Farm: Allows constructing 1 more Domestic Farm building in your city",
    ],
  },
  {
    id: "me_16",
    name: "Millstone",
    column: 9,
    required: ["me_13"],
    costs: {
      research_points: 15,
      coins: 147000,
      food: 108000,
      goods: [
        {
          amount: 110,
          resource: "primary_ba",
        },
        {
          amount: 185,
          resource: "tertiary_ba",
        },
        {
          amount: 300,
          resource: "primary_me",
        },
      ],
    },
    rewards: [
      "Rural Farm: Unlocks a Rural Farm upgrade",
      "Rural Farm: Allows constructing 1 more Rural Farm building in your city",
    ],
  },
  {
    id: "me_17",
    name: "Joists",
    column: 9,
    required: ["me_14"],
    costs: {
      research_points: 17,
      coins: 176000,
      food: 130000,
      goods: [
        {
          amount: 420,
          resource: "primary_me",
        },
        {
          amount: 180,
          resource: "tertiary_me",
        },
        {
          amount: 50,
          resource: "papyrus_scroll",
        },
      ],
    },
    allied: "egypt",
    rewards: [
      "Small Home: Unlocks a Small Home upgrade",
      "Gold Mine: Unlocks a Gold Mine upgrade",
      "Small Home: Allows constructing 1 more Small Home building in your city",
    ],
  },
  {
    id: "me_18",
    name: "Geometry",
    column: 9,
    required: ["me_14"],
    costs: {
      research_points: 11,
      coins: 110000,
      food: 81300,
      goods: [
        {
          amount: 265,
          resource: "primary_me",
        },
        {
          amount: 115,
          resource: "tertiary_me",
        },
        {
          amount: 100,
          resource: "ankh",
        },
      ],
    },
    allied: "egypt",
    rewards: [
      "Average Home: Unlocks a Average Home upgrade",
      "Papyrus Field: Unlocks a Papyrus Field upgrade",
    ],
  },
  {
    id: "me_19",
    name: "Stables",
    column: 10,
    required: ["me_15"],
    costs: {
      research_points: 12,
      coins: 132000,
      food: 97500,
      goods: [
        {
          amount: 315,
          resource: "primary_me",
        },
        {
          amount: 135,
          resource: "secondary_me",
        },
      ],
    },
    rewards: [
      "Cavalry Barracks: Unlocks a Cavalry Barracks upgrade",
      "Small Home: Allows constructing 1 more Small Home building in your city",
    ],
  },
  {
    id: "me_20",
    name: "Preservation",
    column: 10,
    required: ["me_15", "me_16", "me_17"],
    costs: {
      research_points: 20,
      coins: 207000,
      food: 153000,
      goods: [
        {
          amount: 210,
          resource: "secondary_me",
        },
        {
          amount: 495,
          resource: "tertiary_me",
        },
        {
          amount: 250,
          resource: "papyrus_scroll",
        },
      ],
    },
    allied: "egypt",
    rewards: [
      "Average Home: Allows constructing 1 more Average Home building in your city",
      "Small Well: Allows constructing 2 more Small Well buildings in your city",
    ],
  },
  {
    id: "me_21",
    name: "Fine Papyrus",
    column: 10,
    required: ["me_17"],
    costs: {
      research_points: 16,
      coins: 176000,
      food: 130000,
      goods: [
        {
          amount: 225,
          resource: "secondary_ba",
        },
        {
          amount: 135,
          resource: "tertiary_ba",
        },
        {
          amount: 360,
          resource: "tertiary_me",
        },
      ],
    },
    allied: "egypt",
    rewards: [
      "Papyrus Field: Allows constructing 1 more Papyrus Field building in your city",
      "Papyrus Press: Allows constructing 1 more Papyrus Press building in your city",
      "Small Home: Allows constructing 2 more Small Home buildings in your city",
    ],
  },
  {
    id: "me_22",
    name: "Water Wheel",
    column: 10,
    required: ["me_18"],
    costs: {
      research_points: 14,
      coins: 186000,
      food: 137000,
      goods: [
        {
          amount: 190,
          resource: "primary_me",
        },
        {
          amount: 445,
          resource: "secondary_me",
        },
        {
          amount: 500,
          resource: "papyrus_scroll",
        },
      ],
    },
    allied: "egypt",
    rewards: ["Irrigation Station: Unlocks the Irrigation Station"],
  },
  {
    id: "me_23",
    name: "Columns",
    column: 11,
    required: ["me_19"],
    costs: {
      research_points: 15,
      coins: 167000,
      food: 124000,
      goods: [
        {
          amount: 255,
          resource: "tertiary_ba",
        },
        {
          amount: 400,
          resource: "tertiary_me",
        },
        {
          amount: 500,
          resource: "ankh",
        },
      ],
    },
    rewards: [
      "Small Home: Unlocks a Small Home upgrade",
      "Little Culture Site: Allows constructing 1 more Little Culture Site building in your city",
    ],
  },
  {
    id: "me_24",
    name: "Winch",
    column: 11,
    required: ["me_20", "me_21"],
    costs: {
      research_points: 16,
      coins: 185000,
      food: 137000,
      goods: [
        {
          amount: 150,
          resource: "primary_ba",
        },
        {
          amount: 170,
          resource: "primary_me",
        },
        {
          amount: 405,
          resource: "tertiary_me",
        },
      ],
    },
    rewards: [
      "Rural Farm: Unlocks a Rural Farm upgrade",
      "Domestic Farm: Unlocks a Domestic Farm upgrade",
    ],
  },
  {
    id: "me_25",
    name: "Extraction Methods",
    column: 11,
    required: ["me_22"],
    costs: {
      research_points: 27,
      coins: 308000,
      food: 228000,
      goods: [
        {
          amount: 660,
          resource: "primary_me",
        },
        {
          amount: 285,
          resource: "secondary_me",
        },
        {
          amount: 1000,
          resource: "ankh",
        },
      ],
    },
    allied: "egypt",
    rewards: [
      "Gold Mine: Allows constructing 1 more Gold Mine building in your city",
      "Goldsmith: Allows constructing 1 more Goldsmith building in your city",
      "Small Home: Allows constructing 1 more Small Home building in your city",
      "Average Home: Allows constructing 2 more Average Home buildings in your city",
    ],
  },
  {
    id: "me_26",
    name: "Secondary Workshop",
    column: 12,
    required: ["me_23"],
    costs: {
      research_points: 23,
      coins: 264000,
      food: 195000,
      goods: [
        {
          amount: 200,
          resource: "secondary_ba",
        },
        {
          amount: 340,
          resource: "tertiary_ba",
        },
        {
          amount: 540,
          resource: "secondary_me",
        },
      ],
    },
    rewards: [
      "Secondary Workshop: Unlocks a Secondary Workshop upgrade",
      "Secondary Goods: Unlocks the good Secondary Goods for you, so that you can produce it in your city",
    ],
  },
  {
    id: "me_27",
    name: "Administration",
    column: 12,
    required: ["me_23", "me_24"],
    costs: {
      research_points: 25,
      coins: 282000,
      food: 208000,
      goods: [
        {
          amount: 430,
          resource: "tertiary_ba",
        },
        {
          amount: 670,
          resource: "tertiary_me",
        },
        {
          amount: 700,
          resource: "papyrus_scroll",
        },
      ],
    },
    rewards: [
      "Average Home: Unlocks a Average Home upgrade",
      "Average Home: Allows constructing 1 more Average Home building in your city",
    ],
  },
  {
    id: "me_28",
    name: "Burial Rites",
    column: 12,
    required: ["me_24", "me_25"],
    costs: {
      research_points: 16,
      coins: 264000,
      food: 195000,
      goods: [
        {
          amount: 405,
          resource: "secondary_ba",
        },
        {
          amount: 630,
          resource: "secondary_me",
        },
        {
          amount: 1500,
          resource: "ankh",
        },
      ],
    },
    allied: "egypt",
    rewards: [
      "Average Home: Unlocks a Average Home upgrade",
      "Small Home: Unlocks a Small Home upgrade",
      "Irrigation Station: Allows constructing 2 more Irrigation Station buildings in your city",
    ],
  },
  {
    id: "me_29",
    name: "Geography",
    column: 12,
    required: ["me_24", "me_25"],
    costs: {
      research_points: 21,
      coins: 220000,
      food: 163000,
      goods: [
        {
          amount: 600,
          resource: "primary_me",
        },
        {
          amount: 255,
          resource: "secondary_me",
        },
        {
          amount: 1250,
          resource: "papyrus_scroll",
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
    id: "me_30",
    name: "Tertiary Workshop",
    column: 13,
    required: ["me_26", "me_27", "me_28", "me_29"],
    costs: {
      research_points: 18,
      coins: 277000,
      food: 205000,
      goods: [
        {
          amount: 475,
          resource: "secondary_me",
        },
        {
          amount: 205,
          resource: "tertiary_me",
        },
        {
          amount: 1750,
          resource: "papyrus_scroll",
        },
      ],
    },
    rewards: [
      "Tertiary Workshop: Unlocks a Tertiary Workshop upgrade",
      "Tertiary Goods: Unlocks the good Tertiary Goods for you, so that you can produce it in your city",
    ],
  },
];
