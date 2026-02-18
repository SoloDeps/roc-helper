import { TechnoData } from "@/types/shared";

export const technos_IE: TechnoData[] = [
  {
    id: "tech_ie_0",
    name: "Castillos",
    column: 0,
    required: [],
    costs: {
      research_points: 81,
      coins: 5300000,
      food: 1200000,
      goods: [
        {
          amount: 3950,
          resource: "primary_af",
        },
        {
          amount: 6910,
          resource: "primary_fa",
        },
      ],
    },
    rewards: [
      "Small Home: Unlocks a Small Home upgrade",
      "Rural Farm: Unlocks a Rural Farm upgrade",
      "Moderate Culture Site: Unlocks a Moderate Culture Site upgrade",
      "Luxurious Home: Allows constructing 1 more Luxurious Home building in your city",
      "City Hall: Unlocks a Great Hall upgrade",
    ],
  },
  {
    id: "tech_ie_1",
    name: "Primary Workshop",
    column: 1,
    required: ["tech_ie_"],
    costs: {
      research_points: 100,
      coins: 6800000,
      food: 1100000,
      goods: [
        {
          amount: 7700,
          resource: "tertiary_re",
        },
        {
          amount: 8980,
          resource: "tertiary_fa",
        },
      ],
    },
    rewards: [
      "Primary Workshop: Unlocks a Primary Workshop upgrade",
      "Primary Goods: Unlocks the good Primary Goods for you, so that you can produce it in your city",
      "Little Culture Site: Unlocks a Little Culture Site upgrade",
      "+10000: Increase Trade Token Limit",
    ],
  },
  {
    id: "tech_ie_2",
    name: "Almogavars",
    column: 2,
    required: ["tech_ie_"],
    costs: {
      research_points: 115,
      coins: 5600000,
      food: 2500000,
      goods: [
        {
          amount: 4320,
          resource: "secondary_be",
        },
        {
          amount: 2080,
          resource: "primary_af",
        },
        {
          amount: 6220,
          resource: "secondary_fa",
        },
      ],
    },
    rewards: ["Infantry Barracks: Unlocks a Infantry Barracks upgrade"],
  },
  {
    id: "tech_ie_3",
    name: "Glacier Mastery",
    column: 3,
    required: ["tech_ie_"],
    costs: {
      research_points: 71,
      coins: 1900000,
      food: 1200000,
      goods: [
        {
          amount: 11350,
          resource: "tertiary_be",
        },
        {
          amount: 3790,
          resource: "secondary_af",
        },
        {
          amount: 1710,
          resource: "tertiary_fa",
        },
      ],
    },
    allied: "vikings",
    rewards: [
      "Worker Home: Unlocks a Worker Home upgrade",
      "Beehive: Unlocks a Beehive upgrade",
      "Worker Home: Allows constructing 4 more Worker Home buildings in your city",
      "Beehive: Allows constructing 1 more Beehive building in your city",
      "City Hall: Unlocks a Great Hall upgrade",
      "Luxurious Home: Allows constructing 5 more Luxurious Home buildings in your city",
    ],
  },
  {
    id: "tech_ie_4",
    name: "Masia",
    column: 4,
    required: ["tech_ie_"],
    costs: {
      research_points: 57,
      coins: 5400000,
      food: 1500000,
      goods: [
        {
          amount: 2000,
          resource: "secondary_fa",
        },
        {
          amount: 5330,
          resource: "primary_ie",
        },
        {
          amount: 2220,
          resource: "secondary_ie",
        },
      ],
    },
    rewards: [
      "Average Home: Unlocks a Average Home upgrade",
      "Compact Culture Site: Unlocks a Compact Culture Site upgrade",
    ],
  },
  {
    id: "tech_ie_5",
    name: "Drift Nets",
    column: 5,
    required: ["tech_ie_"],
    costs: {
      research_points: 77,
      coins: 2100000,
      food: 2400000,
      goods: [
        {
          amount: 4690,
          resource: "primary_re",
        },
        {
          amount: 1880,
          resource: "tertiary_af",
        },
        {
          amount: 3750,
          resource: "tertiary_ie",
        },
      ],
    },
    allied: "vikings",
    rewards: [
      "Sailor's Home: Unlocks a Sailor's Home upgrade",
      "Fishing Pier: Unlocks a Fishing Pier upgrade",
      "Sailor's Home: Allows constructing 2 more Sailor's Home buildings in your city",
      "Fishing Pier: Allows constructing 1 more Fishing Pier building in your city",
      "Luxurious Fishing Pier: Allows constructing 3 more Luxurious Fishing Pier buildings in your city",
    ],
  },
  {
    id: "tech_ie_6",
    name: "Mead Halls",
    column: 6,
    required: ["tech_ie_"],
    costs: {
      research_points: 105,
      coins: 7200000,
      food: 4099999.9999999995,
      goods: [
        {
          amount: 4440,
          resource: "tertiary_af",
        },
        {
          amount: 8000,
          resource: "primary_fa",
        },
        {
          amount: 1330,
          resource: "primary_ie",
        },
      ],
    },
    allied: "vikings",
    rewards: [
      "Tavern: Unlocks a Tavern upgrade",
      "Stockfish: Unlocks the good Stockfish for you, so that you can produce it in your city",
      "Tavern: Allows constructing 1 more Tavern building in your city",
      "Tavern Runestone: Allows constructing 3 more Tavern Runestone buildings in your city",
    ],
  },
  {
    id: "tech_ie_7",
    name: "Domesticated Donkeys",
    column: 7,
    required: ["tech_ie_"],
    costs: {
      research_points: 90,
      coins: 2400000,
      food: 4200000,
      goods: [
        {
          amount: 11350,
          resource: "secondary_be",
        },
        {
          amount: 4730,
          resource: "tertiary_be",
        },
        {
          amount: 1140,
          resource: "tertiary_ie",
        },
      ],
    },
    rewards: ["Domestic Farm: Unlocks a Domestic Farm upgrade"],
  },
  {
    id: "tech_ie_8",
    name: "Patios",
    column: 8,
    required: ["tech_ie_"],
    costs: {
      research_points: 88,
      coins: 3200000,
      food: 4099999.9999999995,
      goods: [
        {
          amount: 6170,
          resource: "secondary_re",
        },
        {
          amount: 2470,
          resource: "primary_af",
        },
        {
          amount: 7410,
          resource: "tertiary_fa",
        },
      ],
    },
    rewards: ["Large Culture Site: Unlocks a Large Culture Site upgrade"],
  },
  {
    id: "tech_ie_9",
    name: "Dragon Boats",
    column: 9,
    required: ["tech_ie_"],
    costs: {
      research_points: 135,
      coins: 3300000,
      food: 1400000,
      goods: [
        {
          amount: 7700,
          resource: "secondary_fa",
        },
        {
          amount: 2140,
          resource: "primary_ie",
        },
        {
          amount: 1290,
          resource: "secondary_ie",
        },
      ],
    },
    allied: "vikings",
    rewards: [
      "Sailor Port: Unlocks the Sailor Port",
      "Spice Treasure: Unlocks the good Spice Treasure for you, so that you can produce it in your city",
      "Jewel Treasure: Unlocks the good Jewel Treasure for you, so that you can produce it in your city",
      "Luxurious Sailing Port: Allows constructing 2 more Luxurious Sailing Port buildings in your city",
    ],
  },
  {
    id: "tech_ie_10",
    name: "Crossbowmen",
    column: 10,
    required: ["tech_ie_"],
    costs: {
      research_points: 120,
      coins: 3800000,
      food: 2100000,
      goods: [
        {
          amount: 4280,
          resource: "primary_af",
        },
        {
          amount: 2570,
          resource: "tertiary_af",
        },
        {
          amount: 5130,
          resource: "secondary_ie",
        },
      ],
    },
    rewards: ["Ranged Barracks: Unlocks a Ranged Barracks upgrade"],
  },
  {
    id: "tech_ie_11",
    name: "Tattoos",
    column: 11,
    required: ["tech_ie_"],
    costs: {
      research_points: 88,
      coins: 2200000,
      food: 4000000,
      goods: [
        {
          amount: 5920,
          resource: "tertiary_fa",
        },
        {
          amount: 990,
          resource: "secondary_ie",
        },
        {
          amount: 1650,
          resource: "tertiary_ie",
        },
      ],
    },
    allied: "vikings",
    rewards: [
      "Worker Home: Unlocks a Worker Home upgrade",
      "Worker Home: Allows constructing 3 more Worker Home buildings in your city",
      "Home Runestone: Allows constructing 3 more Home Runestone buildings in your city",
    ],
  },
  {
    id: "tech_ie_12",
    name: "Superior Beekeeping",
    column: 12,
    required: ["tech_ie_"],
    costs: {
      research_points: 67,
      coins: 5300000,
      food: 2800000,
      goods: [
        {
          amount: 4940,
          resource: "tertiary_re",
        },
        {
          amount: 1980,
          resource: "secondary_af",
        },
        {
          amount: 5920,
          resource: "primary_fa",
        },
      ],
    },
    allied: "vikings",
    rewards: [
      "Beehive: Unlocks a Beehive upgrade",
      "Beehive: Allows constructing 3 more Beehive buildings in your city",
      "Beehive Runestone: Allows constructing 3 more Beehive Runestone buildings in your city",
    ],
  },
  {
    id: "tech_ie_13",
    name: "Orange Plantation",
    column: 13,
    required: ["tech_ie_"],
    costs: {
      research_points: 89,
      coins: 6800000,
      food: 2500000,
      goods: [
        {
          amount: 3130,
          resource: "tertiary_af",
        },
        {
          amount: 3750,
          resource: "primary_ie",
        },
        {
          amount: 940,
          resource: "tertiary_ie",
        },
      ],
    },
    rewards: [
      "Rural Farm: Unlocks a Rural Farm upgrade",
      "Rural Farm: Allows constructing 1 more Rural Farm building in your city",
      "Luxurious Farm: Allows constructing 1 more Luxurious Farm building in your city",
    ],
  },
  {
    id: "tech_ie_14",
    name: "Eyeglasses",
    column: 14,
    required: ["tech_ie_"],
    costs: {
      research_points: 63,
      coins: 3500000,
      food: 2300000,
      goods: [
        {
          amount: 1330,
          resource: "primary_ie",
        },
        {
          amount: 2220,
          resource: "secondary_ie",
        },
        {
          amount: 5330,
          resource: "tertiary_ie",
        },
      ],
    },
    rewards: [
      "Small Home: Unlocks a Small Home upgrade",
      "Small Home: Allows constructing 1 more Small Home building in your city",
    ],
  },
  {
    id: "tech_ie_15",
    name: "Tavern Brawls",
    column: 15,
    required: ["tech_ie_"],
    costs: {
      research_points: 92,
      coins: 5700000,
      food: 2800000,
      goods: [
        {
          amount: 7160,
          resource: "primary_re",
        },
        {
          amount: 14300,
          resource: "primary_be",
        },
        {
          amount: 1430,
          resource: "secondary_ie",
        },
      ],
    },
    allied: "vikings",
    rewards: [
      "Sailor's Home: Unlocks a Sailor's Home upgrade",
      "Sailor's Home: Allows constructing 3 more Sailor's Home buildings in your city",
      "Tavern: Allows constructing 1 more Tavern building in your city",
    ],
  },
  {
    id: "tech_ie_16",
    name: "Improved Fishing",
    column: 16,
    required: ["tech_ie_"],
    costs: {
      research_points: 82,
      coins: 4200000,
      food: 4200000,
      goods: [
        {
          amount: 3460,
          resource: "secondary_af",
        },
        {
          amount: 6220,
          resource: "secondary_fa",
        },
        {
          amount: 1040,
          resource: "tertiary_ie",
        },
      ],
    },
    allied: "vikings",
    rewards: [
      "Fishing Pier: Unlocks a Fishing Pier upgrade",
      "Fishing Pier: Allows constructing 1 more Fishing Pier building in your city",
    ],
  },
  {
    id: "tech_ie_17",
    name: "Jinete",
    column: 17,
    required: ["tech_ie_"],
    costs: {
      research_points: 125,
      coins: 4700000,
      food: 2300000,
      goods: [
        {
          amount: 2080,
          resource: "primary_af",
        },
        {
          amount: 1730,
          resource: "primary_ie",
        },
        {
          amount: 4150,
          resource: "secondary_ie",
        },
      ],
    },
    rewards: ["Cavalry Barracks: Unlocks a Cavalry Barracks upgrade"],
  },
  {
    id: "tech_ie_18",
    name: "Sun Compass",
    column: 18,
    required: ["tech_ie_"],
    costs: {
      research_points: 80,
      coins: 5100000,
      food: 1400000,
      goods: [
        {
          amount: 2470,
          resource: "secondary_af",
        },
        {
          amount: 4120,
          resource: "tertiary_af",
        },
        {
          amount: 4940,
          resource: "tertiary_ie",
        },
      ],
    },
    allied: "vikings",
    rewards: [
      "Sailor Port: Allows constructing 1 more Sailor Port building in your city",
    ],
  },
  {
    id: "tech_ie_19",
    name: "Long-Distance Seafaring",
    column: 19,
    required: ["tech_ie_"],
    costs: {
      research_points: 110,
      coins: 1900000,
      food: 2400000,
      goods: [
        {
          amount: 2670,
          resource: "tertiary_af",
        },
        {
          amount: 5330,
          resource: "primary_ie",
        },
        {
          amount: 2220,
          resource: "tertiary_ie",
        },
      ],
    },
    allied: "vikings",
    rewards: [
      "Sailor's Home: Allows constructing 2 more Sailor's Home buildings in your city",
      "Fishing Pier: Allows constructing 1 more Fishing Pier building in your city",
    ],
  },
  {
    id: "tech_ie_20",
    name: "Horseshoe Arches",
    column: 20,
    required: ["tech_ie_"],
    costs: {
      research_points: 92,
      coins: 4200000,
      food: 2800000,
      goods: [
        {
          amount: 5180,
          resource: "primary_re",
        },
        {
          amount: 6220,
          resource: "tertiary_fa",
        },
        {
          amount: 1040,
          resource: "secondary_ie",
        },
      ],
    },
    rewards: ["Average Home: Unlocks a Average Home upgrade"],
  },
  {
    id: "tech_ie_21",
    name: "Félag Partnerships",
    column: 21,
    required: ["tech_ie_"],
    costs: {
      research_points: 78,
      coins: 3200000,
      food: 1600000,
      goods: [
        {
          amount: 4120,
          resource: "primary_af",
        },
        {
          amount: 7410,
          resource: "primary_fa",
        },
        {
          amount: 1240,
          resource: "tertiary_ie",
        },
      ],
    },
    allied: "vikings",
    rewards: [
      "Worker Home: Allows constructing 2 more Worker Home buildings in your city",
      "Beehive: Allows constructing 2 more Beehive buildings in your city",
    ],
  },
  {
    id: "tech_ie_22",
    name: "Donkey Herds",
    column: 22,
    required: ["tech_ie_"],
    costs: {
      research_points: 92,
      coins: 5600000,
      food: 2800000,
      goods: [
        {
          amount: 2350,
          resource: "primary_fa",
        },
        {
          amount: 3750,
          resource: "secondary_ie",
        },
        {
          amount: 940,
          resource: "tertiary_ie",
        },
      ],
    },
    rewards: ["Domestic Farm: Unlocks a Domestic Farm upgrade"],
  },
  {
    id: "tech_ie_23",
    name: "Toledo Steel",
    column: 23,
    required: ["tech_ie_"],
    costs: {
      research_points: 75,
      coins: 2500000,
      food: 3800000,
      goods: [
        {
          amount: 5680,
          resource: "secondary_re",
        },
        {
          amount: 11350,
          resource: "tertiary_be",
        },
        {
          amount: 2270,
          resource: "secondary_af",
        },
      ],
    },
    rewards: ["Small Home: Unlocks a Small Home upgrade"],
  },
  {
    id: "tech_ie_24",
    name: "Norse Hamlets",
    column: 24,
    required: ["tech_ie_"],
    costs: {
      research_points: 92,
      coins: 4400000,
      food: 1100000,
      goods: [
        {
          amount: 3090,
          resource: "tertiary_fa",
        },
        {
          amount: 1240,
          resource: "secondary_ie",
        },
        {
          amount: 4940,
          resource: "tertiary_ie",
        },
      ],
    },
    allied: "vikings",
    rewards: [
      "Worker Home: Unlocks a Worker Home upgrade",
      "Worker Home: Allows constructing 2 more Worker Home buildings in your city",
    ],
  },
  {
    id: "tech_ie_25",
    name: "Beekeeping Mastery",
    column: 25,
    required: ["tech_ie_"],
    costs: {
      research_points: 57,
      coins: 2300000,
      food: 3700000,
      goods: [
        {
          amount: 4440,
          resource: "tertiary_af",
        },
        {
          amount: 5330,
          resource: "primary_ie",
        },
        {
          amount: 1330,
          resource: "secondary_ie",
        },
      ],
    },
    allied: "vikings",
    rewards: [
      "Beehive: Unlocks a Beehive upgrade",
      "Beehive: Allows constructing 2 more Beehive buildings in your city",
    ],
  },
  {
    id: "tech_ie_26",
    name: "Advanced Trebuchet",
    column: 26,
    required: ["tech_ie_"],
    costs: {
      research_points: 130,
      coins: 2800000,
      food: 1700000,
      goods: [
        {
          amount: 3460,
          resource: "secondary_af",
        },
        {
          amount: 1040,
          resource: "primary_ie",
        },
        {
          amount: 4150,
          resource: "secondary_ie",
        },
      ],
    },
    rewards: ["Siege Barracks: Unlocks a Siege Barracks upgrade"],
  },
  {
    id: "tech_ie_27",
    name: "Mead Mastery",
    column: 27,
    required: ["tech_ie_"],
    costs: {
      research_points: 99,
      coins: 5800000,
      food: 4099999.9999999995,
      goods: [
        {
          amount: 2080,
          resource: "primary_af",
        },
        {
          amount: 1730,
          resource: "primary_ie",
        },
        {
          amount: 4150,
          resource: "tertiary_ie",
        },
      ],
    },
    allied: "vikings",
    rewards: [
      "Tavern: Allows constructing 2 more Tavern buildings in your city",
    ],
  },
  {
    id: "tech_ie_28",
    name: "Viking Homesteads",
    column: 28,
    required: ["tech_ie_"],
    costs: {
      research_points: 77,
      coins: 1700000,
      food: 3700000,
      goods: [
        {
          amount: 4770,
          resource: "primary_af",
        },
        {
          amount: 1430,
          resource: "primary_ie",
        },
        {
          amount: 5730,
          resource: "secondary_ie",
        },
      ],
    },
    allied: "vikings",
    rewards: [
      "Sailor's Home: Unlocks a Sailor's Home upgrade",
      "Sailor's Home: Allows constructing 1 more Sailor's Home building in your city",
    ],
  },
  {
    id: "tech_ie_29",
    name: "Distillation",
    column: 29,
    required: ["tech_ie_"],
    costs: {
      research_points: 84,
      coins: 4800000,
      food: 2200000,
      goods: [
        {
          amount: 2840,
          resource: "primary_fa",
        },
        {
          amount: 6810,
          resource: "secondary_fa",
        },
        {
          amount: 1710,
          resource: "tertiary_fa",
        },
      ],
    },
    rewards: ["Average Home: Unlocks a Average Home upgrade"],
  },
  {
    id: "tech_ie_30",
    name: "Botany",
    column: 30,
    required: ["tech_ie_"],
    costs: {
      research_points: 69,
      coins: 5800000,
      food: 2600000,
      goods: [
        {
          amount: 6420,
          resource: "primary_re",
        },
        {
          amount: 2570,
          resource: "tertiary_af",
        },
        {
          amount: 5130,
          resource: "primary_ie",
        },
      ],
    },
    rewards: [
      "Rural Farm: Unlocks a Rural Farm upgrade",
      "Average Home: Allows constructing 1 more Average Home building in your city",
    ],
  },
  {
    id: "tech_ie_31",
    name: "Magnetic Compass",
    column: 31,
    required: ["tech_ie_"],
    costs: {
      research_points: 105,
      coins: 2900000,
      food: 4000000,
      goods: [
        {
          amount: 3090,
          resource: "secondary_fa",
        },
        {
          amount: 1240,
          resource: "secondary_ie",
        },
        {
          amount: 4940,
          resource: "tertiary_ie",
        },
      ],
    },
    allied: "vikings",
    rewards: [
      "Sailor Port: Allows constructing 1 more Sailor Port building in your city",
    ],
  },
  {
    id: "tech_ie_32",
    name: "Fishing Mastery",
    column: 32,
    required: ["tech_ie_"],
    costs: {
      research_points: 94,
      coins: 1700000,
      food: 1200000,
      goods: [
        {
          amount: 13800,
          resource: "secondary_be",
        },
        {
          amount: 4610,
          resource: "tertiary_af",
        },
        {
          amount: 1380,
          resource: "tertiary_ie",
        },
      ],
    },
    allied: "vikings",
    rewards: [
      "Fishing Pier: Unlocks a Fishing Pier upgrade",
      "Fishing Pier: Allows constructing 1 more Fishing Pier building in your city",
    ],
  },
  {
    id: "tech_ie_33",
    name: "Order of Calatrava",
    column: 33,
    required: ["tech_ie_"],
    costs: {
      research_points: 135,
      coins: 3000000,
      food: 4400000,
      goods: [
        {
          amount: 1780,
          resource: "secondary_fa",
        },
        {
          amount: 4740,
          resource: "secondary_ie",
        },
        {
          amount: 1980,
          resource: "tertiary_ie",
        },
      ],
    },
    rewards: [
      "Heavy Infantry Barracks: Unlocks a Heavy Infantry Barracks upgrade",
    ],
  },
  {
    id: "tech_ie_34",
    name: "Glima Fighting",
    column: 34,
    required: ["tech_ie_"],
    costs: {
      research_points: 67,
      coins: 2200000,
      food: 3600000,
      goods: [
        {
          amount: 1410,
          resource: "primary_fa",
        },
        {
          amount: 2350,
          resource: "secondary_fa",
        },
        {
          amount: 3750,
          resource: "tertiary_ie",
        },
      ],
    },
    allied: "vikings",
    rewards: [
      "Worker Home: Allows constructing 2 more Worker Home buildings in your city",
      "Sailor's Home: Allows constructing 1 more Sailor's Home building in your city",
    ],
  },
  {
    id: "tech_ie_35",
    name: "Perfected Honey",
    column: 35,
    required: ["tech_ie_"],
    costs: {
      research_points: 91,
      coins: 6000000,
      food: 1200000,
      goods: [
        {
          amount: 6660,
          resource: "tertiary_re",
        },
        {
          amount: 2670,
          resource: "secondary_af",
        },
        {
          amount: 8000,
          resource: "tertiary_fa",
        },
      ],
    },
    allied: "vikings",
    rewards: [
      "Beehive: Allows constructing 2 more Beehive buildings in your city",
    ],
  },
  {
    id: "tech_ie_36",
    name: "Secondary Workshop",
    column: 36,
    required: ["tech_ie_"],
    costs: {
      research_points: 100,
      coins: 4600000,
      food: 1600000,
      goods: [
        {
          amount: 11350,
          resource: "primary_be",
        },
        {
          amount: 3790,
          resource: "primary_af",
        },
        {
          amount: 1140,
          resource: "primary_ie",
        },
      ],
    },
    rewards: [
      "Secondary Workshop: Unlocks a Secondary Workshop upgrade",
      "Secondary Goods: Unlocks the good Secondary Goods for you, so that you can produce it in your city",
    ],
  },
  {
    id: "tech_ie_37",
    name: "Donkey Farms",
    column: 37,
    required: ["tech_ie_"],
    costs: {
      research_points: 105,
      coins: 6100000,
      food: 3600000,
      goods: [
        {
          amount: 4440,
          resource: "secondary_af",
        },
        {
          amount: 8000,
          resource: "primary_fa",
        },
        {
          amount: 1330,
          resource: "secondary_ie",
        },
      ],
    },
    rewards: ["Domestic Farm: Unlocks a Domestic Farm upgrade"],
  },
  {
    id: "tech_ie_38",
    name: "Fjord Dominion",
    column: 38,
    required: ["tech_ie_"],
    costs: {
      research_points: 77,
      coins: 3900000,
      food: 3000000,
      goods: [
        {
          amount: 4740,
          resource: "primary_ie",
        },
        {
          amount: 1980,
          resource: "secondary_ie",
        },
        {
          amount: 1190,
          resource: "tertiary_ie",
        },
      ],
    },
    allied: "vikings",
    rewards: [
      "Worker Home: Allows constructing 2 more Worker Home buildings in your city",
      "Sailor's Home: Allows constructing 1 more Sailor's Home building in your city",
    ],
  },
  {
    id: "tech_ie_39",
    name: "Harbor Economics",
    column: 39,
    required: ["tech_ie_"],
    costs: {
      research_points: 90,
      coins: 4200000,
      food: 1700000,
      goods: [
        {
          amount: 1630,
          resource: "primary_fa",
        },
        {
          amount: 2720,
          resource: "tertiary_fa",
        },
        {
          amount: 4350,
          resource: "primary_ie",
        },
      ],
    },
    allied: "vikings",
    rewards: [
      "Fishing Pier: Allows constructing 1 more Fishing Pier building in your city",
    ],
  },
  {
    id: "tech_ie_40",
    name: "Tertiary Workshop",
    column: 40,
    required: ["tech_ie_"],
    costs: {
      research_points: 82,
      coins: 6200000,
      food: 1300000,
      goods: [
        {
          amount: 4440,
          resource: "secondary_af",
        },
        {
          amount: 8000,
          resource: "secondary_fa",
        },
        {
          amount: 1330,
          resource: "tertiary_ie",
        },
      ],
    },
    rewards: [
      "Tertiary Workshop: Unlocks a Tertiary Workshop upgrade",
      "Tertiary Goods: Unlocks the good Tertiary Goods for you, so that you can produce it in your city",
    ],
  },
  {
    id: "tech_ie_41",
    name: "Viking Consensus",
    column: 41,
    required: ["tech_ie_"],
    costs: {
      research_points: 100,
      coins: 4900000,
      food: 3100000,
      goods: [
        {
          amount: 5430,
          resource: "secondary_re",
        },
        {
          amount: 1090,
          resource: "primary_ie",
        },
        {
          amount: 4350,
          resource: "secondary_ie",
        },
      ],
    },
    allied: "vikings",
    rewards: ["1: Gives you 1 Wonder Orb"],
  },
];
