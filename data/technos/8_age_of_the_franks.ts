import { TechnoData } from "@/types/shared";

export const technos_AF: TechnoData[] = [
  {
    id: "tech_af_0",
    name: "Regnum Francorum",
    column: 0,
    required: [],
    costs: {
      research_points: 52,
      coins: 806000,
      food: 645000,
      goods: [
        {
          amount: 1500,
          resource: "tertiary_er",
        },
        {
          amount: 2020,
          resource: "secondary_be",
        },
        {
          amount: 4850,
          resource: "tertiary_be",
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
    id: "tech_af_1",
    name: "Skirmishers",
    column: 1,
    required: ["tech_af_"],
    costs: {
      research_points: 39,
      coins: 760000,
      food: 603000,
      goods: [
        {
          amount: 4650,
          resource: "primary_cg",
        },
        {
          amount: 1860,
          resource: "primary_re",
        },
        {
          amount: 5580,
          resource: "primary_be",
        },
      ],
    },
    rewards: [
      "Infantry Barracks: Unlocks a Infantry Barracks upgrade",
      "Compact Culture Site: Unlocks a Compact Culture Site upgrade",
    ],
  },
  {
    id: "tech_af_2",
    name: "Primary Workshop",
    column: 2,
    required: ["tech_af_"],
    costs: {
      research_points: 52,
      coins: 713000,
      food: 942000,
      goods: [
        {
          amount: 7530,
          resource: "secondary_re",
        },
        {
          amount: 2360,
          resource: "primary_be",
        },
        {
          amount: 1410,
          resource: "tertiary_be",
        },
      ],
    },
    rewards: [
      "Primary Workshop: Unlocks a Primary Workshop upgrade",
      "Primary Goods: Unlocks the good Primary Goods for you, so that you can produce it in your city",
      "+10000: Increased Trade Token Limit",
    ],
  },
  {
    id: "tech_af_3",
    name: "Birdkeeping",
    column: 3,
    required: ["tech_af_"],
    costs: {
      research_points: 45,
      coins: 563000,
      food: 1000000,
      goods: [
        {
          amount: 3350,
          resource: "secondary_er",
        },
        {
          amount: 1210,
          resource: "secondary_be",
        },
        {
          amount: 4830,
          resource: "tertiary_be",
        },
      ],
    },
    allied: "maya",
    rewards: [
      "Average Aviary: Unlocks the Average Aviary",
      "Worker Home: Unlocks a Worker Home upgrade",
      "Luxurious Aviary: Unlocks the Luxurious Aviary",
    ],
  },
  {
    id: "tech_af_4",
    name: "Villers",
    column: 4,
    required: ["tech_af_"],
    costs: {
      research_points: 32,
      coins: 1500000,
      food: 495000,
      goods: [
        {
          amount: 3950,
          resource: "primary_re",
        },
        {
          amount: 4610,
          resource: "primary_af",
        },
      ],
    },
    rewards: [
      "Average Home: Unlocks a Average Home upgrade",
      "Domestic Farm: Unlocks a Domestic Farm upgrade",
    ],
  },
  {
    id: "tech_af_5",
    name: "Headdress Craft",
    column: 5,
    required: ["tech_af_"],
    costs: {
      research_points: 60,
      coins: 1500000,
      food: 777000,
      goods: [
        {
          amount: 4560,
          resource: "secondary_cg",
        },
        {
          amount: 5470,
          resource: "primary_be",
        },
        {
          amount: 1370,
          resource: "tertiary_be",
        },
      ],
    },
    allied: "maya",
    rewards: [
      "Ceremony Outfitter: Unlocks the Ceremony Outfitter",
      "Headdress: Unlocks the good Headdress for you, so that you can produce it in your city",
      "Worker Home: Allows constructing 1 more Worker Home building in your city",
    ],
  },
  {
    id: "tech_af_6",
    name: "Astral Rituals",
    column: 6,
    required: ["tech_af_"],
    costs: {
      research_points: 67,
      coins: 2100000,
      food: 1800000,
      goods: [
        {
          amount: 3940,
          resource: "tertiary_er",
        },
        {
          amount: 7560,
          resource: "tertiary_re",
        },
        {
          amount: 950,
          resource: "primary_af",
        },
      ],
    },
    allied: "maya",
    rewards: [
      "Priest Home: Unlocks a Priest Home upgrade",
      "Priest Home: Allows constructing 1 more Priest Home building in your city",
      "Small Ritual Site: Allows constructing 2 more Small Ritual Site buildings in your city",
    ],
  },
  {
    id: "tech_af_7",
    name: "Aristocracy",
    column: 7,
    required: ["tech_af_"],
    costs: {
      research_points: 55,
      coins: 1100000,
      food: 1600000,
      goods: [
        {
          amount: 2260,
          resource: "primary_be",
        },
        {
          amount: 5260,
          resource: "secondary_be",
        },
      ],
    },
    rewards: [
      "Little Culture Site: Unlocks a Little Culture Site upgrade",
      "Large Culture Site: Unlocks a Large Culture Site upgrade",
    ],
  },
  {
    id: "tech_af_8",
    name: "Franc Axe Throwers",
    column: 8,
    required: ["tech_af_"],
    costs: {
      research_points: 57,
      coins: 1700000,
      food: 1100000,
      goods: [
        {
          amount: 2510,
          resource: "primary_re",
        },
        {
          amount: 1130,
          resource: "primary_be",
        },
        {
          amount: 3010,
          resource: "primary_af",
        },
      ],
    },
    rewards: ["Ranged Barracks: Unlocks a Ranged Barracks upgrade"],
  },
  {
    id: "tech_af_9",
    name: "Ritual Daggers",
    column: 9,
    required: ["tech_af_"],
    costs: {
      research_points: 61,
      coins: 1400000,
      food: 1600000,
      goods: [
        {
          amount: 1990,
          resource: "secondary_be",
        },
        {
          amount: 3180,
          resource: "secondary_af",
        },
        {
          amount: 800,
          resource: "tertiary_af",
        },
      ],
    },
    allied: "maya",
    rewards: [
      "Ritual Carver: Unlocks the Ritual Carver",
      "Ritual Dagger: Unlocks the good Ritual Dagger for you, so that you can produce it in your city",
    ],
  },
  {
    id: "tech_af_10",
    name: "Lingua Franca",
    column: 10,
    required: ["tech_af_"],
    costs: {
      research_points: 49,
      coins: 1000000,
      food: 791000,
      goods: [
        {
          amount: 3930,
          resource: "tertiary_cg",
        },
        {
          amount: 4720,
          resource: "secondary_be",
        },
        {
          amount: 1180,
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
    id: "tech_af_11",
    name: "Advanced Jade Mining",
    column: 11,
    required: ["tech_af_"],
    costs: {
      research_points: 54,
      coins: 1000000,
      food: 542000,
      goods: [
        {
          amount: 2230,
          resource: "secondary_be",
        },
        {
          amount: 890,
          resource: "secondary_af",
        },
        {
          amount: 3570,
          resource: "tertiary_af",
        },
      ],
    },
    allied: "maya",
    rewards: [
      "Jade Quarry: Unlocks a Jade Quarry upgrade",
      "Jade Quarry: Allows constructing 1 more Jade Quarry building in your city",
    ],
  },
  {
    id: "tech_af_12",
    name: "Advanced Obsidian Mining",
    column: 12,
    required: ["tech_af_"],
    costs: {
      research_points: 57,
      coins: 1600000,
      food: 735000,
      goods: [
        {
          amount: 3170,
          resource: "tertiary_re",
        },
        {
          amount: 5700,
          resource: "secondary_be",
        },
        {
          amount: 950,
          resource: "primary_af",
        },
      ],
    },
    allied: "maya",
    rewards: [
      "Obsidian Quarry: Unlocks a Obsidian Quarry upgrade",
      "Obsidian Quarry: Allows constructing 1 more Obsidian Quarry building in your city",
    ],
  },
  {
    id: "tech_af_13",
    name: "Spades",
    column: 13,
    required: ["tech_af_"],
    costs: {
      research_points: 50,
      coins: 1300000,
      food: 1500000,
      goods: [
        {
          amount: 1320,
          resource: "secondary_be",
        },
        {
          amount: 5260,
          resource: "tertiary_be",
        },
        {
          amount: 1460,
          resource: "primary_af",
        },
      ],
    },
    rewards: ["Rural Farm: Unlocks a Rural Farm upgrade"],
  },
  {
    id: "tech_af_14",
    name: "Aviculture",
    column: 14,
    required: ["tech_af_"],
    costs: {
      research_points: 70,
      coins: 1300000,
      food: 1400000,
      goods: [
        {
          amount: 6350,
          resource: "primary_re",
        },
        {
          amount: 1190,
          resource: "primary_be",
        },
        {
          amount: 1320,
          resource: "tertiary_af",
        },
      ],
    },
    allied: "maya",
    rewards: [
      "Average Aviary: Unlocks a Average Aviary upgrade",
      "Average Aviary: Allows constructing 2 more Average Aviary buildings in your city",
    ],
  },
  {
    id: "tech_af_15",
    name: "Perfected Headdresses",
    column: 15,
    required: ["tech_af_"],
    costs: {
      research_points: 52,
      coins: 1400000,
      food: 1100000,
      goods: [
        {
          amount: 1000,
          resource: "headdress",
        },
        {
          amount: 4480,
          resource: "primary_af",
        },
        {
          amount: 1920,
          resource: "secondary_af",
        },
      ],
    },
    allied: "maya",
    rewards: [
      "Ceremony Outfitter: Allows constructing 1 more Ceremony Outfitter building in your city",
    ],
  },
  {
    id: "tech_af_16",
    name: "Production Boom",
    column: 16,
    required: ["tech_af_"],
    costs: {
      research_points: 48,
      coins: 1400000,
      food: 1000000,
      goods: [
        {
          amount: 2300,
          resource: "primary_be",
        },
        {
          amount: 920,
          resource: "primary_af",
        },
        {
          amount: 3680,
          resource: "tertiary_af",
        },
      ],
    },
    rewards: [
      "Primary Workshop: Allows constructing 1 more Primary Workshop building in your city",
    ],
  },
  {
    id: "tech_af_17",
    name: "Caballarii",
    column: 17,
    required: ["tech_af_"],
    costs: {
      research_points: 71,
      coins: 974000,
      food: 575000,
      goods: [
        {
          amount: 6220,
          resource: "primary_be",
        },
        {
          amount: 1560,
          resource: "secondary_be",
        },
        {
          amount: 1730,
          resource: "primary_af",
        },
      ],
    },
    rewards: ["Cavalry Barracks: Unlocks a Cavalry Barracks upgrade"],
  },
  {
    id: "tech_af_18",
    name: "Maya Glyphs",
    column: 18,
    required: ["tech_af_"],
    costs: {
      research_points: 64,
      coins: 592000,
      food: 735000,
      goods: [
        {
          amount: 1810,
          resource: "primary_be",
        },
        {
          amount: 2890,
          resource: "primary_af",
        },
        {
          amount: 720,
          resource: "secondary_af",
        },
      ],
    },
    allied: "maya",
    rewards: [
      "Worker Home: Unlocks a Worker Home upgrade",
      "Worker Home: Allows constructing 2 more Worker Home buildings in your city",
      "Average Ritual Site: Allows constructing 1 more Average Ritual Site building in your city",
    ],
  },
  {
    id: "tech_af_19",
    name: "Priest Schooling",
    column: 19,
    required: ["tech_af_"],
    costs: {
      research_points: 68,
      coins: 742000,
      food: 1300000,
      goods: [
        {
          amount: 1190,
          resource: "tertiary_be",
        },
        {
          amount: 1320,
          resource: "secondary_af",
        },
        {
          amount: 3160,
          resource: "tertiary_af",
        },
      ],
    },
    allied: "maya",
    rewards: [
      "Priest Home: Unlocks a Priest Home upgrade",
      "Priest Home: Allows constructing 2 more Priest Home buildings in your city",
    ],
  },
  {
    id: "tech_af_20",
    name: "Advanced Fodder",
    column: 20,
    required: ["tech_af_"],
    costs: {
      research_points: 58,
      coins: 1500000,
      food: 617000,
      goods: [
        {
          amount: 4510,
          resource: "secondary_be",
        },
        {
          amount: 750,
          resource: "primary_af",
        },
        {
          amount: 1250,
          resource: "tertiary_af",
        },
      ],
    },
    rewards: ["Domestic Farm: Unlocks a Domestic Farm upgrade"],
  },
  {
    id: "tech_af_21",
    name: "Pottery Wheel",
    column: 21,
    required: ["tech_af_"],
    costs: {
      research_points: 69,
      coins: 870000,
      food: 1700000,
      goods: [
        {
          amount: 2850,
          resource: "secondary_be",
        },
        {
          amount: 4560,
          resource: "secondary_af",
        },
        {
          amount: 1140,
          resource: "tertiary_af",
        },
      ],
    },
    rewards: ["Average Home: Unlocks a Average Home upgrade"],
  },
  {
    id: "tech_af_22",
    name: "Sustainable Mining",
    column: 22,
    required: ["tech_af_"],
    costs: {
      research_points: 54,
      coins: 2100000,
      food: 509000,
      goods: [
        {
          amount: 2030,
          resource: "secondary_be",
        },
        {
          amount: 810,
          resource: "primary_af",
        },
        {
          amount: 3250,
          resource: "tertiary_af",
        },
      ],
    },
    allied: "maya",
    rewards: [
      "Jade Quarry: Unlocks a Jade Quarry upgrade",
      "Obsidian Quarry: Unlocks a Obsidian Quarry upgrade",
    ],
  },
  {
    id: "tech_af_23",
    name: "Improved Daggers",
    column: 23,
    required: ["tech_af_"],
    costs: {
      research_points: 68,
      coins: 1700000,
      food: 1000000,
      goods: [
        {
          amount: 1410,
          resource: "secondary_be",
        },
        {
          amount: 5650,
          resource: "tertiary_be",
        },
        {
          amount: 1570,
          resource: "primary_af",
        },
      ],
    },
    allied: "maya",
    rewards: [
      "Ritual Carver: Allows constructing 1 more Ritual Carver building in your city",
    ],
  },
  {
    id: "tech_af_24",
    name: "Halberds",
    column: 24,
    required: ["tech_af_"],
    costs: {
      research_points: 56,
      coins: 853000,
      food: 1100000,
      goods: [
        {
          amount: 3420,
          resource: "primary_af",
        },
        {
          amount: 860,
          resource: "secondary_af",
        },
        {
          amount: 1430,
          resource: "tertiary_af",
        },
      ],
    },
    rewards: [
      "Heavy Infantry Barracks: Unlocks a Heavy Infantry Barracks upgrade",
    ],
  },
  {
    id: "tech_af_25",
    name: "Sacred Shrines",
    column: 25,
    required: ["tech_af_"],
    costs: {
      research_points: 50,
      coins: 1100000,
      food: 1500000,
      goods: [
        {
          amount: 2650,
          resource: "primary_re",
        },
        {
          amount: 1190,
          resource: "primary_be",
        },
        {
          amount: 3180,
          resource: "secondary_af",
        },
      ],
    },
    rewards: [
      "Small Ritual Site: Allows constructing 1 more Small Ritual Site building in your city",
      "Average Ritual Site: Allows constructing 1 more Average Ritual Site building in your city",
    ],
  },
  {
    id: "tech_af_26",
    name: "Population Growth",
    column: 26,
    required: ["tech_af_"],
    costs: {
      research_points: 56,
      coins: 1800000,
      food: 1700000,
      goods: [
        {
          amount: 2990,
          resource: "secondary_er",
        },
        {
          amount: 2870,
          resource: "secondary_af",
        },
        {
          amount: 720,
          resource: "tertiary_af",
        },
      ],
    },
    allied: "maya",
    rewards: [
      "Worker Home: Allows constructing 2 more Worker Home buildings in your city",
      "Priest Home: Allows constructing 1 more Priest Home building in your city",
    ],
  },
  {
    id: "tech_af_27",
    name: "Patrimony",
    column: 27,
    required: ["tech_af_"],
    costs: {
      research_points: 56,
      coins: 1500000,
      food: 1100000,
      goods: [
        {
          amount: 6240,
          resource: "secondary_be",
        },
        {
          amount: 1740,
          resource: "primary_af",
        },
        {
          amount: 1040,
          resource: "tertiary_af",
        },
      ],
    },
    rewards: ["Small Home: Unlocks a Small Home upgrade"],
  },
  {
    id: "tech_af_28",
    name: "Scythes",
    column: 28,
    required: ["tech_af_"],
    costs: {
      research_points: 57,
      coins: 690000,
      food: 1200000,
      goods: [
        {
          amount: 1290,
          resource: "tertiary_be",
        },
        {
          amount: 3430,
          resource: "secondary_af",
        },
        {
          amount: 1430,
          resource: "tertiary_af",
        },
      ],
    },
    rewards: [
      "Rural Farm: Unlocks a Rural Farm upgrade",
      "Rural Farm: Allows constructing 1 more Rural Farm building in your city",
    ],
  },
  {
    id: "tech_af_29",
    name: "Feather Mastery",
    column: 29,
    required: ["tech_af_"],
    costs: {
      research_points: 64,
      coins: 1100000,
      food: 603000,
      goods: [
        {
          amount: 800,
          resource: "ritual_dagger",
        },
        {
          amount: 2010,
          resource: "secondary_af",
        },
        {
          amount: 4700,
          resource: "tertiary_af",
        },
      ],
    },
    allied: "maya",
    rewards: [
      "Average Aviary: Unlocks a Average Aviary upgrade",
      "Average Aviary: Allows constructing 1 more Average Aviary building in your city",
    ],
  },
  {
    id: "tech_af_30",
    name: "Dagger Perfection",
    column: 30,
    required: ["tech_af_"],
    costs: {
      research_points: 70,
      coins: 1300000,
      food: 1500000,
      goods: [
        {
          amount: 5470,
          resource: "primary_be",
        },
        {
          amount: 910,
          resource: "primary_af",
        },
        {
          amount: 1520,
          resource: "tertiary_af",
        },
      ],
    },
    allied: "maya",
    rewards: [
      "Ritual Carver: Allows constructing 1 more Ritual Carver building in your city",
    ],
  },
  {
    id: "tech_af_31",
    name: "Goat Herds",
    column: 31,
    required: ["tech_af_"],
    costs: {
      research_points: 65,
      coins: 2300000,
      food: 100000,
      goods: [
        {
          amount: 2500,
          resource: "headdress",
        },
        {
          amount: 2050,
          resource: "secondary_af",
        },
        {
          amount: 4780,
          resource: "tertiary_af",
        },
      ],
    },
    rewards: ["Domestic Farm: Unlocks a Domestic Farm upgrade"],
  },
  {
    id: "tech_af_32",
    name: "Divine Ascension",
    column: 32,
    required: ["tech_af_"],
    costs: {
      research_points: 77,
      coins: 1100000,
      food: 1200000,
      goods: [
        {
          amount: 1280,
          resource: "primary_be",
        },
        {
          amount: 2130,
          resource: "tertiary_be",
        },
        {
          amount: 3400,
          resource: "primary_af",
        },
      ],
    },
    allied: "maya",
    rewards: [
      "Priest Home: Unlocks a Priest Home upgrade",
      "Priest Home: Allows constructing 2 more Priest Home buildings in your city",
    ],
  },
  {
    id: "tech_af_33",
    name: "Ritual Mastery",
    column: 33,
    required: ["tech_af_"],
    costs: {
      research_points: 65,
      coins: 696000,
      food: 1100000,
      goods: [
        {
          amount: 5740,
          resource: "secondary_re",
        },
        {
          amount: 1800,
          resource: "tertiary_be",
        },
        {
          amount: 720,
          resource: "secondary_af",
        },
      ],
    },
    allied: "maya",
    rewards: [
      "Small Ritual Site: Allows constructing 1 more Small Ritual Site building in your city",
    ],
  },
  {
    id: "tech_af_34",
    name: "Carolingian Catapult",
    column: 34,
    required: ["tech_af_"],
    costs: {
      research_points: 69,
      coins: 1600000,
      food: 787000,
      goods: [
        {
          amount: 3150,
          resource: "secondary_re",
        },
        {
          amount: 1420,
          resource: "secondary_be",
        },
        {
          amount: 3780,
          resource: "secondary_af",
        },
      ],
    },
    rewards: ["Siege Barracks: Unlocks a Siege Barracks upgrade"],
  },
  {
    id: "tech_af_35",
    name: "Leges Salica",
    column: 35,
    required: ["tech_af_"],
    costs: {
      research_points: 68,
      coins: 1200000,
      food: 1300000,
      goods: [
        {
          amount: 6920,
          resource: "tertiary_re",
        },
        {
          amount: 870,
          resource: "primary_af",
        },
        {
          amount: 1440,
          resource: "tertiary_af",
        },
      ],
    },
    rewards: [
      "Average Home: Unlocks a Average Home upgrade",
      "Average Home: Allows constructing 1 more Average Home building in your city",
    ],
  },
  {
    id: "tech_af_36",
    name: "Xocolatl Virtuoso",
    column: 36,
    required: ["tech_af_"],
    costs: {
      research_points: 58,
      coins: 1300000,
      food: 1600000,
      goods: [
        {
          amount: 5220,
          resource: "tertiary_be",
        },
        {
          amount: 1450,
          resource: "primary_af",
        },
        {
          amount: 870,
          resource: "tertiary_af",
        },
      ],
    },
    allied: "maya",
    rewards: [
      "Worker Home: Unlocks a Worker Home upgrade",
      "Worker Home: Allows constructing 3 more Worker Home buildings in your city",
    ],
  },
  {
    id: "tech_af_37",
    name: "Secondary Workshop",
    column: 37,
    required: ["tech_af_"],
    costs: {
      research_points: 58,
      coins: 1500000,
      food: 881000,
      goods: [
        {
          amount: 3180,
          resource: "primary_er",
        },
        {
          amount: 3050,
          resource: "secondary_af",
        },
        {
          amount: 770,
          resource: "tertiary_af",
        },
      ],
    },
    rewards: [
      "Secondary Workshop: Unlocks a Secondary Workshop upgrade",
      "Secondary Goods: Unlocks the good Secondary Goods for you, so that you can produce it in your city",
    ],
  },
  {
    id: "tech_af_38",
    name: "Jade Mastery",
    column: 38,
    required: ["tech_af_"],
    costs: {
      research_points: 48,
      coins: 1700000,
      food: 843000,
      goods: [
        {
          amount: 2580,
          resource: "primary_be",
        },
        {
          amount: 4130,
          resource: "primary_af",
        },
        {
          amount: 1030,
          resource: "secondary_af",
        },
      ],
    },
    allied: "maya",
    rewards: [
      "Jade Quarry: Unlocks a Jade Quarry upgrade",
      "Jade Quarry: Allows constructing 1 more Jade Quarry building in your city",
    ],
  },
  {
    id: "tech_af_39",
    name: "Obsidian Mastery",
    column: 39,
    required: ["tech_af_"],
    costs: {
      research_points: 77,
      coins: 840000,
      food: 1200000,
      goods: [
        {
          amount: 1110,
          resource: "tertiary_be",
        },
        {
          amount: 2940,
          resource: "secondary_af",
        },
        {
          amount: 1230,
          resource: "tertiary_af",
        },
      ],
    },
    allied: "maya",
    rewards: [
      "Obsidian Quarry: Unlocks a Obsidian Quarry upgrade",
      "Obsidian Quarry: Allows constructing 1 more Obsidian Quarry building in your city",
    ],
  },
  {
    id: "tech_af_40",
    name: "Tertiary Workshop",
    column: 40,
    required: ["tech_af_"],
    costs: {
      research_points: 60,
      coins: 1700000,
      food: 848000,
      goods: [
        {
          amount: 910,
          resource: "primary_af",
        },
        {
          amount: 1520,
          resource: "secondary_af",
        },
        {
          amount: 3650,
          resource: "tertiary_af",
        },
      ],
    },
    rewards: [
      "Tertiary Workshop: Unlocks a Tertiary Workshop upgrade",
      "Tertiary Goods: Unlocks the good Tertiary Goods for you, so that you can produce it in your city",
    ],
  },
  {
    id: "tech_af_41",
    name: "Astral Alignment",
    column: 41,
    required: ["tech_af_"],
    costs: {
      research_points: 63,
      coins: 2000000,
      food: 838000,
      goods: [
        {
          amount: 2400,
          resource: "ritual_dagger",
        },
        {
          amount: 4020,
          resource: "primary_af",
        },
        {
          amount: 1730,
          resource: "secondary_af",
        },
      ],
    },
    allied: "maya",
    rewards: [
      "Priest Home: Allows constructing 1 more Priest Home building in your city",
      "Average Ritual Site: Allows constructing 1 more Average Ritual Site building in your city",
    ],
  },
  {
    id: "tech_af_42",
    name: "Mayan Consensus",
    column: 42,
    required: ["tech_af_"],
    costs: {
      research_points: 105,
      coins: 2100000,
      food: 1200000,
      goods: [
        {
          amount: 1600,
          resource: "primary_af",
        },
        {
          amount: 960,
          resource: "secondary_af",
        },
        {
          amount: 3830,
          resource: "tertiary_af",
        },
      ],
    },
    allied: "maya",
    rewards: ["1: Gives you 1 Wonder Orb"],
  },
];
