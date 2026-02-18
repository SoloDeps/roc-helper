import { TechnoData } from "@/types/shared";

export const technos_EG: TechnoData[] = [
  {
    id: "tech_eg_0",
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
    id: "tech_eg_1",
    name: "Carrucas",
    column: 1,
    required: ["tech_eg_"],
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
    id: "tech_eg_2",
    name: "Deep Sea Ports",
    column: 2,
    required: ["tech_eg_"],
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
    id: "tech_eg_3",
    name: "Primary Workshop",
    column: 3,
    required: ["tech_eg_"],
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
      "Primary Workshop: Unlocks the Primary Workshop",
      "Primary Goods: Unlocks the good Primary Goods for you, so that you can produce it in your city",
    ],
  },
  {
    id: "tech_eg_4",
    name: "Routiers",
    column: 4,
    required: ["tech_eg_"],
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
    id: "tech_eg_5",
    name: "Knot Refinement",
    column: 5,
    required: ["tech_eg_"],
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
    id: "tech_eg_6",
    name: "Shipwright Guilds",
    column: 6,
    required: ["tech_eg_"],
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
    id: "tech_eg_7",
    name: "Gothic Bridge Building",
    column: 7,
    required: ["tech_eg_"],
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
    id: "tech_eg_8",
    name: "Navigational Charts",
    column: 8,
    required: ["tech_eg_"],
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
    id: "tech_eg_9",
    name: "Dry Dock Construction",
    column: 9,
    required: ["tech_eg_"],
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
    id: "tech_eg_10",
    name: "Wharf Construction",
    column: 10,
    required: ["tech_eg_"],
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
    id: "tech_eg_11",
    name: "Masonry Techniques",
    column: 11,
    required: ["tech_eg_"],
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
    id: "tech_eg_12",
    name: "Crossbow Engineering",
    column: 12,
    required: ["tech_eg_"],
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
    id: "tech_eg_13",
    name: "Lateen Sails",
    column: 13,
    required: ["tech_eg_"],
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
    id: "tech_eg_14",
    name: "Port Warehouse Innovations",
    column: 14,
    required: ["tech_eg_"],
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
    id: "tech_eg_15",
    name: "Civic Self-Government",
    column: 15,
    required: ["tech_eg_"],
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
    id: "tech_eg_16",
    name: "Horse Collar Improvements",
    column: 16,
    required: ["tech_eg_"],
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
    id: "tech_eg_17",
    name: "Cartography Innovations",
    column: 17,
    required: ["tech_eg_"],
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
    id: "tech_eg_18",
    name: "Hull Clinker Construction",
    column: 18,
    required: ["tech_eg_"],
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
    id: "tech_eg_19",
    name: "Three-Field Crop Rotation",
    column: 19,
    required: ["tech_eg_"],
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
    id: "tech_eg_20",
    name: "Secondary Workshop",
    column: 20,
    required: ["tech_eg_"],
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
      "Secondary Workshop: Unlocks the Secondary Workshop",
      "Secondary Goods: Unlocks the good Secondary Goods for you, so that you can produce it in your city",
    ],
  },
  {
    id: "tech_eg_21",
    name: "Mercantile Code",
    column: 21,
    required: ["tech_eg_"],
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
    id: "tech_eg_22",
    name: "Cavalrymen",
    column: 22,
    required: ["tech_eg_"],
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
    id: "tech_eg_23",
    name: "Maritime Schools",
    column: 23,
    required: ["tech_eg_"],
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
    id: "tech_eg_24",
    name: "Caravel Design",
    column: 24,
    required: ["tech_eg_"],
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
    id: "tech_eg_25",
    name: "Veterinary Science",
    column: 25,
    required: ["tech_eg_"],
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
    id: "tech_eg_26",
    name: "Windmill Expansions",
    column: 26,
    required: ["tech_eg_"],
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
    id: "tech_eg_27",
    name: "Trade Guild Formations",
    column: 27,
    required: ["tech_eg_"],
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
    id: "tech_eg_28",
    name: "Stowage Planning",
    column: 28,
    required: ["tech_eg_"],
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
    id: "tech_eg_29",
    name: "Gargoyle Drainage Systems",
    column: 29,
    required: ["tech_eg_"],
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
    id: "tech_eg_30",
    name: "Noble Knights",
    column: 30,
    required: ["tech_eg_"],
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
    id: "tech_eg_31",
    name: "Pintle-And-Gudgeon Rudder",
    column: 31,
    required: ["tech_eg_"],
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
    id: "tech_eg_32",
    name: "Tidal Calculation Tables",
    column: 32,
    required: ["tech_eg_"],
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
    id: "tech_eg_33",
    name: "Paper Milling Processes",
    column: 33,
    required: ["tech_eg_"],
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
    id: "tech_eg_34",
    name: "Heraldry",
    column: 34,
    required: ["tech_eg_"],
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
    id: "tech_eg_35",
    name: "Harbor Crane Systems",
    column: 35,
    required: ["tech_eg_"],
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
    id: "tech_eg_36",
    name: "Wheeled Towers",
    column: 36,
    required: ["tech_eg_"],
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
    id: "tech_eg_37",
    name: "Foreign Trade Links",
    column: 37,
    required: ["tech_eg_"],
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
    id: "tech_eg_38",
    name: "Anchorage Techniques",
    column: 38,
    required: ["tech_eg_"],
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
    id: "tech_eg_39",
    name: "Baronial Hall Design",
    column: 39,
    required: ["tech_eg_"],
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
    id: "tech_eg_40",
    name: "Tertiary Workshop",
    column: 40,
    required: ["tech_eg_"],
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
      "Tertiary Workshop: Unlocks the Tertiary Workshop",
      "Tertiary Goods: Unlocks the good Tertiary Goods for you, so that you can produce it in your city",
    ],
  },
  {
    id: "tech_eg_41",
    name: "Port Authority Systems",
    column: 41,
    required: ["tech_eg_"],
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
    id: "tech_eg_42",
    name: "Mechanical Clock",
    column: 42,
    required: ["tech_eg_"],
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
    id: "tech_eg_43",
    name: "Ottoman Naval Power",
    column: 43,
    required: ["tech_eg_"],
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
