import { TechnoData } from "@/types/shared";

export const technos_EG: TechnoData[] = [
  {
    id: "eg_0",
    name: "Flying Buttresses",
    column: 0,
    required: [],
    costs: {
      research_points: 100,
      coins: 2900000,
      food: 3500000,
      goods: [
        {
          amount: 13500,
          resource: "tertiary_hm",
        },
        {
          amount: 5700,
          resource: "primary_hm",
        },
      ],
    },
    rewards: [
      "Harbor: New Feature",
      "Small Home: Unlocks a Small Home upgrade",
      "Shipyard: Unlocks the Shipyard",
      "Domestic Farm: Unlocks a Domestic Farm upgrade",
      "Unlock: Ottoman Empire",
      "City Hall: Unlocks a City Hall upgrade",
    ],
  },
  {
    id: "eg_1",
    name: "Carrucas",
    column: 1,
    required: ["eg_0"],
    costs: {
      research_points: 110,
      coins: 5900000,
      food: 3200000,
      goods: [
        {
          amount: 13000,
          resource: "primary_hm",
        },
        {
          amount: 5350,
          resource: "secondary_hm",
        },
        {
          amount: 4300,
          resource: "primary_ks",
        },
      ],
    },
    rewards: [
      "Compact Culture: Unlocks a Compact Culture upgrade",
      "Rural Farm: Unlocks a Rural Farm upgrade",
    ],
  },
  {
    id: "eg_2",
    name: "Deep Sea Ports",
    column: 1,
    required: ["eg_0"],
    costs: {
      research_points: 28,
      coins: 5900000,
      food: 4000000,
      goods: [
        {
          amount: 10000,
          resource: "secondary_hm",
        },
        {
          amount: 4250,
          resource: "tertiary_hm",
        },
        {
          amount: 4250,
          resource: "primary_ie",
        },
      ],
    },
    allied: "ottoman",
    rewards: [
      "10,000 Aspers: Gives you 10,000 Aspers",
      "Shipyard: Allows constructing 1 more Shipyard building in Capital City",
    ],
  },
  {
    id: "eg_3",
    name: "Primary Good",
    column: 2,
    required: ["eg_1"],
    costs: {
      research_points: 140,
      coins: 9900000,
      food: 3900000,
      goods: [
        {
          amount: 14500,
          resource: "tertiary_hm",
        },
        {
          amount: 10500,
          resource: "secondary_ie",
        },
      ],
    },
    rewards: [
      "Primary Good: Unlocks the Primary Good",
      "Primary Goods: Unlocks the good Primary Goods for you, so that you can produce it in your city",
    ],
  },
  {
    id: "eg_4",
    name: "Routiers",
    column: 2,
    required: ["eg_1"],
    costs: {
      research_points: 69,
      coins: 3200000,
      food: 3100000,
      goods: [
        {
          amount: 19000,
          resource: "primary_ie",
        },
        {
          amount: 3300,
          resource: "primary_eg",
        },
        {
          amount: 5000,
          resource: "carpet",
        },
      ],
    },
    rewards: ["Infantry Barracks: Unlocks a Infantry Barracks upgrade"],
  },
  {
    id: "eg_5",
    name: "Knot Refinement",
    column: 2,
    required: ["eg_2"],
    costs: {
      research_points: 150,
      coins: 3400000,
      food: 7000000,
      goods: [
        {
          amount: 12000,
          resource: "primary_ks",
        },
        {
          amount: 3800,
          resource: "secondary_hm",
        },
        {
          amount: 1500,
          resource: "primary_eg",
        },
      ],
    },
    allied: "ottoman",
    rewards: [
      "Common Warehouse: Allows constructing 1 more Common Warehouse building in Capital City",
    ],
  },
  {
    id: "eg_6",
    name: "Shipwright Guilds",
    column: 2,
    required: ["eg_2"],
    costs: {
      research_points: 85,
      coins: 6300000,
      food: 5000000,
      goods: [
        {
          amount: 6050,
          resource: "primary_eg",
        },
        {
          amount: 4000,
          resource: "primary_hm",
        },
        {
          amount: 3000,
          resource: "secondary_ks",
        },
      ],
    },
    allied: "ottoman",
    rewards: [
      "Seafarer House: Allows constructing 2 more Seafarer House building in Capital City",
      "Shipyard: Allows constructing 1 more Shipyard building in Capital City",
    ],
  },
  {
    id: "eg_7",
    name: "Gothic Bridge Building",
    column: 3,
    required: ["eg_3", "eg_4"],
    costs: {
      research_points: 130,
      coins: 7000000,
      food: 6600000,
      goods: [
        {
          amount: 11000,
          resource: "secondary_hm",
        },
        {
          amount: 6200,
          resource: "primary_ks",
        },
        {
          amount: 1850,
          resource: "secondary_eg",
        },
      ],
    },
    rewards: [
      "Average Home: Unlocks a Average Home upgrade",
      "Moderate Culture Site: Unlocks a Moderate Culture Site upgrade",
    ],
  },
  {
    id: "eg_8",
    name: "Navigational Charts",
    column: 3,
    required: ["eg_4", "eg_5", "eg_6"],
    costs: {
      research_points: 185,
      coins: 2400000,
      food: 2300000,
      goods: [
        {
          amount: 7600,
          resource: "secondary_eg",
        },
        {
          amount: 3200,
          resource: "tertiary_eg",
        },
        {
          amount: 4750,
          resource: "secondary_ie",
        },
      ],
    },
    allied: "ottoman",
    rewards: [
      "2 Trade Village Silver Upgrade Keys: Gives you 2 Trade Village Silver Upgrade Keys",
      "Seafarer House: Allows constructing 1 more Seafarer House building in Capital City",
      "+10000: Increase Trade Token Limit",
    ],
  },
  {
    id: "eg_9",
    name: "Dry Dock Construction",
    column: 3,
    required: ["eg_5", "eg_6"],
    costs: {
      research_points: 150,
      coins: 3100000,
      food: 1800000,
      goods: [
        {
          amount: 8200,
          resource: "primary_eg",
        },
        {
          amount: 5200,
          resource: "tertiary_hm",
        },
        {
          amount: 4100,
          resource: "tertiary_ks",
        },
      ],
    },
    allied: "ottoman",
    rewards: [
      "2 Trade Village Silver Upgrade Keys: Gives you 2 Trade Village Silver Upgrade Keys",
      "Shipyard: Allows constructing 1 more Shipyard building in Capital City",
    ],
  },
  {
    id: "eg_10",
    name: "Wharf Construction",
    column: 3,
    required: ["eg_6"],
    costs: {
      research_points: 115,
      coins: 5500000,
      food: 3400000,
      goods: [
        {
          amount: 12100,
          resource: "primary_hm",
        },
        {
          amount: 6800,
          resource: "tertiary_ks",
        },
        {
          amount: 2000,
          resource: "secondary_eg",
        },
      ],
    },
    allied: "ottoman",
    rewards: [
      "3 Trade Village Silver Upgrade Keys: Gives you 3 Trade Village Silver Upgrade Keys",
      "Common Warehouse: Allows constructing 1 more Common Warehouse building in Capital City",
    ],
  },
  {
    id: "eg_11",
    name: "Masonry Techniques",
    column: 4,
    required: ["eg_7"],
    costs: {
      research_points: 110,
      coins: 7300000,
      food: 3200000,
      goods: [
        {
          amount: 7000,
          resource: "tertiary_eg",
        },
        {
          amount: 4500,
          resource: "secondary_hm",
        },
        {
          amount: 3500,
          resource: "primary_ks",
        },
      ],
    },
    rewards: [
      "Small Home: Unlocks a Small Home upgrade",
      "Small Home: Allows constructing 1 more Small Home building in Capital City",
    ],
  },
  {
    id: "eg_12",
    name: "Crossbow Engineering",
    column: 4,
    required: ["eg_7", "eg_8"],
    costs: {
      research_points: 150,
      coins: 8800000,
      food: 7200000,
      goods: [
        {
          amount: 8000,
          resource: "secondary_eg",
        },
        {
          amount: 6600,
          resource: "primary_ks",
        },
        {
          amount: 2000,
          resource: "primary_eg",
        },
      ],
    },
    rewards: ["Ranged Barracks: Unlocks a Ranged Barracks upgrade"],
  },
  {
    id: "eg_13",
    name: "Lateen Sails",
    column: 4,
    required: ["eg_8", "eg_9"],
    costs: {
      research_points: 120,
      coins: 7200000,
      food: 7500000,
      goods: [
        {
          amount: 27000,
          resource: "tertiary_ks",
        },
        {
          amount: 5000,
          resource: "pomegranate",
        },
        {
          amount: 5000,
          resource: "wheat",
        },
      ],
    },
    allied: "ottoman",
    rewards: [
      "Seafarer House: Allows constructing 1 more Seafarer House building in Capital City",
      "Shipyard: Allows constructing 1 more Shipyard building in Capital City",
    ],
  },
  {
    id: "eg_14",
    name: "Port Warehouse Innovations",
    column: 4,
    required: ["eg_9", "eg_10"],
    costs: {
      research_points: 125,
      coins: 3100000,
      food: 7200000,
      goods: [
        {
          amount: 11000,
          resource: "primary_eg",
        },
        {
          amount: 7500,
          resource: "wheat",
        },
        {
          amount: 7500,
          resource: "pomegranate",
        },
      ],
    },
    allied: "ottoman",
    rewards: [
      "2 Trade Village Gold Upgrade Keys: Gives you 2 Trade Village Gold Upgrade Keys",
      "Common Warehouse: Allows constructing 1 more Common Warehouse building in Capital City",
    ],
  },
  {
    id: "eg_15",
    name: "Civic Self-Government",
    column: 5,
    required: ["eg_11"],
    costs: {
      research_points: 90,
      coins: 2500000,
      food: 2600000,
      goods: [
        {
          amount: 6500,
          resource: "tertiary_eg",
        },
        {
          amount: 4050,
          resource: "primary_hm",
        },
        {
          amount: 1650,
          resource: "primary_eg",
        },
      ],
    },
    rewards: [
      "Little Culture Site: Unlocks a Little Culture Site upgrade",
      "Little Culture Site: Allows constructing 1 more Little Culture Site building in Capital City",
    ],
  },
  {
    id: "eg_16",
    name: "Horse Collar Improvements",
    column: 5,
    required: ["eg_11", "eg_12", "eg_13"],
    costs: {
      research_points: 92,
      coins: 7600000,
      food: 4200000,
      goods: [
        {
          amount: 7200,
          resource: "primary_eg",
        },
        {
          amount: 4500,
          resource: "tertiary_hm",
        },
        {
          amount: 3600,
          resource: "secondary_ks",
        },
      ],
    },
    rewards: [
      "Rural Farm: Unlocks a Rural Farm upgrade",
      "Rural Farm: Allows constructing 1 more Rural Farm building in Capital City",
    ],
  },
  {
    id: "eg_17",
    name: "Cartography Innovations",
    column: 5,
    required: ["eg_12", "eg_13"],
    costs: {
      research_points: 110,
      coins: 9400000,
      food: 4700000,
      goods: [
        {
          amount: 13500,
          resource: "secondary_hm",
        },
        {
          amount: 7650,
          resource: "secondary_ks",
        },
        {
          amount: 10000,
          resource: "pomegranate",
        },
      ],
    },
    allied: "ottoman",
    rewards: [
      "2 Trade City Silver Upgrade Keys: Gives you 2 Trade City Silver Upgrade Keys",
      "Seafarer House: Allows constructing 2 more Seafarer House building in Capital City",
    ],
  },
  {
    id: "eg_18",
    name: "Hull Clinker Construction",
    column: 5,
    required: ["eg_14"],
    costs: {
      research_points: 105,
      coins: 3700000,
      food: 6500000,
      goods: [
        {
          amount: 7250,
          resource: "secondary_eg",
        },
        {
          amount: 4550,
          resource: "secondary_hm",
        },
        {
          amount: 3650,
          resource: "tertiary_ks",
        },
      ],
    },
    allied: "ottoman",
    rewards: [
      "3 Trade Village Silver Upgrade Keys: Gives you 3 Trade Village Silver Upgrade Keys",
      "Shipyard: Allows constructing 1 more Shipyard building in Capital City",
    ],
  },
  {
    id: "eg_19",
    name: "Three-Field Crop Rotation",
    column: 6,
    required: ["eg_15"],
    costs: {
      research_points: 110,
      coins: 7600000,
      food: 2700000,
      goods: [
        {
          amount: 9250,
          resource: "tertiary_hm",
        },
        {
          amount: 2550,
          resource: "primary_eg",
        },
        {
          amount: 1550,
          resource: "tertiary_eg",
        },
      ],
    },
    rewards: ["Domestic Farm: Unlocks a Domestic Farm upgrade"],
  },
  {
    id: "eg_20",
    name: "Secondary Good",
    column: 6,
    required: ["eg_15", "eg_16"],
    costs: {
      research_points: 185,
      coins: 8400000,
      food: 4100000,
      goods: [
        {
          amount: 7150,
          resource: "tertiary_eg",
        },
        {
          amount: 6000,
          resource: "primary_ks",
        },
        {
          amount: 1800,
          resource: "secondary_eg",
        },
      ],
    },
    rewards: [
      "Secondary Good: Unlocks the Secondary Good",
      "Secondary Goods: Unlocks the good Secondary Goods for you, so that you can produce it in your city",
    ],
  },
  {
    id: "eg_21",
    name: "Mercantile Code",
    column: 6,
    required: ["eg_17", "eg_18"],
    costs: {
      research_points: 120,
      coins: 5200000,
      food: 2500000,
      goods: [
        {
          amount: 7500,
          resource: "secondary_eg",
        },
        {
          amount: 4700,
          resource: "primary_hm",
        },
        {
          amount: 3750,
          resource: "tertiary_ks",
        },
      ],
    },
    allied: "ottoman",
    rewards: [
      "2 Trade City Silver Upgrade Keys: Gives you 2 Trade City Silver Upgrade Keys",
      "Ottoman Emipre Ship: Unlocks a Ottoman Emipre Ship upgrade",
    ],
  },
  {
    id: "eg_22",
    name: "Cavalrymen",
    column: 7,
    required: ["eg_19", "eg_20"],
    costs: {
      research_points: 115,
      coins: 7500000,
      food: 4300000,
      goods: [
        {
          amount: 8000,
          resource: "primary_eg",
        },
        {
          amount: 8500,
          resource: "primary_ie",
        },
        {
          amount: 15000,
          resource: "wheat",
        },
      ],
    },
    rewards: ["Cavalry Barracks: Unlocks a Cavalry Barracks upgrade"],
  },
  {
    id: "eg_23",
    name: "Maritime Schools",
    column: 7,
    required: ["eg_20", "eg_21"],
    costs: {
      research_points: 180,
      coins: 3300000,
      food: 6600000,
      goods: [
        {
          amount: 23750,
          resource: "secondary_ie",
        },
        {
          amount: 6200,
          resource: "tertiary_hm",
        },
        {
          amount: 15000,
          resource: "pomegranate",
        },
      ],
    },
    allied: "ottoman",
    rewards: [
      "2 Trade Village Gold Upgrade Keys: Gives you 2 Trade Village Gold Upgrade Keys",
      "Seafarer House: Unlocks a Seafarer House upgrade",
      "Common Warehouse: Allows constructing 1 more Common Warehouse building in Capital City",
    ],
  },
  {
    id: "eg_24",
    name: "Caravel Design",
    column: 7,
    required: ["eg_21"],
    costs: {
      research_points: 140,
      coins: 8100000,
      food: 6400000,
      goods: [
        {
          amount: 7750,
          resource: "secondary_eg",
        },
        {
          amount: 4850,
          resource: "secondary_hm",
        },
        {
          amount: 4000,
          resource: "primary_ks",
        },
      ],
    },
    allied: "ottoman",
    rewards: [
      "3 Trade Village Gold Upgrade Keys: Gives you 3 Trade Village Gold Upgrade Keys",
      "Shipyard: Allows constructing 1 more Shipyard building in Capital City",
    ],
  },
  {
    id: "eg_25",
    name: "Veterinary Science",
    column: 8,
    required: ["eg_22"],
    costs: {
      research_points: 140,
      coins: 5400000,
      food: 5600000,
      goods: [
        {
          amount: 13750,
          resource: "secondary_ks",
        },
        {
          amount: 7150,
          resource: "tertiary_ie",
        },
        {
          amount: 1750,
          resource: "tertiary_eg",
        },
      ],
    },
    rewards: [
      "Domestic Farm: Unlocks a Domestic Farm upgrade",
      "Domestic Farm: Allows constructing 1 more Domestic Farm building in Capital City",
    ],
  },
  {
    id: "eg_26",
    name: "Windmill Expansions",
    column: 8,
    required: ["eg_22"],
    costs: {
      research_points: 180,
      coins: 9000000,
      food: 5300000,
      goods: [
        {
          amount: 6700,
          resource: "tertiary_eg",
        },
        {
          amount: 4200,
          resource: "primary_hm",
        },
        {
          amount: 3350,
          resource: "tertiary_ks",
        },
      ],
    },
    rewards: ["Rural Farm: Unlocks a Rural Farm upgrade"],
  },
  {
    id: "eg_27",
    name: "Trade Guild Formations",
    column: 8,
    required: ["eg_23"],
    costs: {
      research_points: 140,
      coins: 7900000,
      food: 2200000,
      goods: [
        {
          amount: 6850,
          resource: "secondary_eg",
        },
        {
          amount: 5700,
          resource: "secondary_ks",
        },
        {
          amount: 1700,
          resource: "primary_eg",
        },
      ],
    },
    allied: "ottoman",
    rewards: [
      "2 Trade City Gold Upgrade Keys: Gives you 2 Trade City Gold Upgrade Keys",
      "Seafarer House: Allows constructing 2 more Seafarer House building in Capital City",
    ],
  },
  {
    id: "eg_28",
    name: "Stowage Planning",
    column: 8,
    required: ["eg_23", "eg_24"],
    costs: {
      research_points: 120,
      coins: 3000000,
      food: 3700000,
      goods: [
        {
          amount: 8700,
          resource: "primary_eg",
        },
        {
          amount: 3600,
          resource: "tertiary_eg",
        },
        {
          amount: 5450,
          resource: "tertiary_ie",
        },
      ],
    },
    allied: "ottoman",
    rewards: [
      "3 Trade Village Platinum Upgrade Keys: Gives you 3 Trade Village Platinum Upgrade Keys",
      "Common Warehouse: Allows constructing 1 more Common Warehouse building in Capital City",
    ],
  },
  {
    id: "eg_29",
    name: "Gargoyle Drainage Systems",
    column: 9,
    required: ["eg_25"],
    costs: {
      research_points: 100,
      coins: 4600000,
      food: 5500000,
      goods: [
        {
          amount: 13200,
          resource: "primary_hm",
        },
        {
          amount: 7550,
          resource: "secondary_ks",
        },
        {
          amount: 6000,
          resource: "confection",
        },
      ],
    },
    rewards: [
      "Average Home: Unlocks a Average Home upgrade",
      "Average Home: Allows constructing 1 more Average Home building in Capital City",
    ],
  },
  {
    id: "eg_30",
    name: "Noble Knights",
    column: 9,
    required: ["eg_26", "eg_27"],
    costs: {
      research_points: 145,
      coins: 8500000,
      food: 3300000,
      goods: [
        {
          amount: 9000,
          resource: "secondary_eg",
        },
        {
          amount: 5550,
          resource: "tertiary_hm",
        },
        {
          amount: 2200,
          resource: "primary_eg",
        },
      ],
    },
    rewards: [
      "Heavy Infantry Barracks: Unlocks a Heavy Infantry Barracks upgrade",
    ],
  },
  {
    id: "eg_31",
    name: "Pintle-And-Gudgeon Rudder",
    column: 9,
    required: ["eg_27"],
    costs: {
      research_points: 125,
      coins: 3800000,
      food: 4900000,
      goods: [
        {
          amount: 8850,
          resource: "tertiary_eg",
        },
        {
          amount: 7350,
          resource: "tertiary_ks",
        },
        {
          amount: 2200,
          resource: "secondary_eg",
        },
      ],
    },
    allied: "ottoman",
    rewards: [
      "2 Trade City Gold Upgrade Keys: Gives you 2 Trade City Gold Upgrade Keys",
      "Shipyard: Allows constructing 1 more Shipyard building in Capital City",
    ],
  },
  {
    id: "eg_32",
    name: "Tidal Calculation Tables",
    column: 9,
    required: ["eg_28"],
    costs: {
      research_points: 110,
      coins: 2300000,
      food: 3800000,
      goods: [
        {
          amount: 20100,
          resource: "tertiary_ie",
        },
        {
          amount: 5200,
          resource: "primary_hm",
        },
        {
          amount: 7500,
          resource: "syrup",
        },
      ],
    },
    allied: "ottoman",
    rewards: [
      "3 Trade Village Gold Upgrade Keys: Gives you 3 Trade Village Gold Upgrade Keys",
      "2 Trade City Platinum Upgrade Keys: Gives you 2 Trade City Platinum Upgrade Keys",
      "Seafarer House: Allows constructing 2 more Seafarer House building in Capital City",
    ],
  },
  {
    id: "eg_33",
    name: "Paper Milling Processes",
    column: 10,
    required: ["eg_29"],
    costs: {
      research_points: 190,
      coins: 3800000,
      food: 4300000,
      goods: [
        {
          amount: 7500,
          resource: "primary_eg",
        },
        {
          amount: 7600,
          resource: "primary_ie",
        },
        {
          amount: 1800,
          resource: "tertiary_eg",
        },
      ],
    },
    rewards: [
      "Moderate Culture Site: Allows constructing 1 more Moderate Culture Site building in Capital City",
    ],
  },
  {
    id: "eg_34",
    name: "Heraldry",
    column: 10,
    required: ["eg_29", "eg_30"],
    costs: {
      research_points: 105,
      coins: 7600000,
      food: 4700000,
      goods: [
        {
          amount: 8750,
          resource: "tertiary_eg",
        },
        {
          amount: 7300,
          resource: "secondary_ks",
        },
        {
          amount: 4400,
          resource: "primary_ks",
        },
      ],
    },
    rewards: ["Small Home: Unlocks a Small Home upgrade"],
  },
  {
    id: "eg_35",
    name: "Harbor Crane Systems",
    column: 10,
    required: ["eg_31", "eg_32"],
    costs: {
      research_points: 110,
      coins: 6400000,
      food: 2100000,
      goods: [
        {
          amount: 10450,
          resource: "primary_hm",
        },
        {
          amount: 4350,
          resource: "secondary_hm",
        },
        {
          amount: 1750,
          resource: "primary_eg",
        },
      ],
    },
    allied: "ottoman",
    rewards: [
      "3 Trade Village Platinum Upgrade Keys: Gives you 3 Trade Village Platinum Upgrade Keys",
      "2 Trade City Platinum Upgrade Keys: Gives you 2 Trade City Platinum Upgrade Keys",
      "Common Warehouse: Allows constructing 1 more Common Warehouse building in Capital City",
    ],
  },
  {
    id: "eg_36",
    name: "Wheeled Towers",
    column: 11,
    required: ["eg_33", "eg_34", "eg_35"],
    costs: {
      research_points: 105,
      coins: 8100000,
      food: 6000000,
      goods: [
        {
          amount: 9750,
          resource: "secondary_eg",
        },
        {
          amount: 8350,
          resource: "tertiary_ks",
        },
        {
          amount: 9000,
          resource: "syrup",
        },
      ],
    },
    rewards: ["Siege Barracks: Unlocks a Siege Barracks upgrade"],
  },
  {
    id: "eg_37",
    name: "Foreign Trade Links",
    column: 11,
    required: ["eg_34", "eg_35"],
    costs: {
      research_points: 135,
      coins: 3100000,
      food: 3900000,
      goods: [
        {
          amount: 6700,
          resource: "primary_eg",
        },
        {
          amount: 4200,
          resource: "tertiary_hm",
        },
      ],
    },
    allied: "ottoman",
    rewards: [
      "3 Trade Village Diamond Upgrade Keys: Gives you 3 Trade Village Diamond Upgrade Keys",
      "Common Warehouse: Allows constructing 1 more Common Warehouse building in Capital City",
      "Seafarer House: Allows constructing 2 more Seafarer House building in Capital City",
    ],
  },
  {
    id: "eg_38",
    name: "Anchorage Techniques",
    column: 11,
    required: ["eg_35"],
    costs: {
      research_points: 140,
      coins: 3800000,
      food: 3900000,
      goods: [
        {
          amount: 14850,
          resource: "tertiary_hm",
        },
        {
          amount: 10500,
          resource: "tertiary_ie",
        },
        {
          amount: 9000,
          resource: "confection",
        },
      ],
    },
    allied: "ottoman",
    rewards: [
      "2 Trade City Diamond Upgrade Keys: Gives you 2 Trade City Diamond Upgrade Keys",
      "4 Trade Village Platinum Upgrade Keys: Gives you 4 Trade Village Platinum Upgrade Keys",
      "Shipyard: Allows constructing 1 more Shipyard building in Capital City",
    ],
  },
  {
    id: "eg_39",
    name: "Baronial Hall Design",
    column: 12,
    required: ["eg_36"],
    costs: {
      research_points: 105,
      coins: 3100000,
      food: 6000000,
      goods: [
        {
          amount: 8000,
          resource: "secondary_eg",
        },
        {
          amount: 3300,
          resource: "tertiary_eg",
        },
        {
          amount: 4000,
          resource: "secondary_ks",
        },
      ],
    },
    rewards: ["Average Home: Unlocks a Average Home upgrade"],
  },
  {
    id: "eg_40",
    name: "Tertiary Good",
    column: 12,
    required: ["eg_36", "eg_37"],
    costs: {
      research_points: 125,
      coins: 4500000,
      food: 2800000,
      goods: [
        {
          amount: 7500,
          resource: "tertiary_eg",
        },
        {
          amount: 4750,
          resource: "tertiary_hm",
        },
        {
          amount: 3000,
          resource: "secondary_hm",
        },
      ],
    },
    rewards: [
      "Tertiary Good: Unlocks the Tertiary Good",
      "Tertiary Goods: Unlocks the good Tertiary Goods for you, so that you can produce it in your city",
    ],
  },
  {
    id: "eg_41",
    name: "Port Authority Systems",
    column: 12,
    required: ["eg_37", "eg_38"],
    costs: {
      research_points: 135,
      coins: 3900000,
      food: 5200000,
      goods: [
        {
          amount: 16500,
          resource: "primary_ks",
        },
        {
          amount: 3500,
          resource: "tertiary_eg",
        },
        {
          amount: 4100,
          resource: "tertiary_ks",
        },
      ],
    },
    allied: "ottoman",
    rewards: [
      "4 Trade Village Diamond Upgrade Keys: Gives you 4 Trade Village Diamond Upgrade Keys",
      "Common Warehouse: Allows constructing 1 more Common Warehouse building in Capital City",
      "Seafarer House: Allows constructing 2 more Seafarer House building in Capital City",
    ],
  },
  {
    id: "eg_42",
    name: "Mechanical Clock",
    column: 13,
    required: ["eg_39", "eg_40"],
    costs: {
      research_points: 115,
      coins: 9700000,
      food: 6400000,
      goods: [
        {
          amount: 7600,
          resource: "tertiary_eg",
        },
        {
          amount: 3100,
          resource: "primary_eg",
        },
        {
          amount: 2750,
          resource: "primary_hm",
        },
      ],
    },
    rewards: ["Large Culture Site: Unlocks a Large Culture Site upgrade"],
  },
  {
    id: "eg_43",
    name: "Ottoman Naval Power",
    column: 13,
    required: ["eg_40", "eg_41"],
    costs: {
      research_points: 150,
      coins: 7000000,
      food: 6800000,
      goods: [
        {
          amount: 17000,
          resource: "secondary_ks",
        },
        {
          amount: 5350,
          resource: "secondary_hm",
        },
        {
          amount: 2150,
          resource: "tertiary_eg",
        },
      ],
    },
    allied: "ottoman",
    rewards: [
      "2 Trade City Diamond Upgrade Keys: Gives you 2 Trade City Diamond Upgrade Keys",
      "3 Trade Village Diamond Upgrade Keys: Gives you 3 Trade Village Diamond Upgrade Keys",
      "Shipyard: Allows constructing 1 more Shipyard building in Capital City",
    ],
  },
];
