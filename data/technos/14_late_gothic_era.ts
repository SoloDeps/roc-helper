import { TechnoData } from "@/types/shared";

export const technos_LG: TechnoData[] = [
  {
    id: "tech_lg_0",
    name: "Flamboyant Gothic",
    column: 0,
    required: [],
    costs: {
      research_points: 120,
      coins: 3200000,
      food: 4200000,
      goods: [
        {
          amount: 15500,
          resource: "tertiary_eg",
        },
        {
          amount: 6750,
          resource: "primary_eg",
        },
      ],
    },
    rewards: [
      "Small Home: Unlocks a Small Home upgrade",
      "Rural Farm: Unlocks a Rural Farm upgrade",
      "Common Warehouse: Unlocks a Common Warehouse upgrade",
      "City Hall: Unlocks a City Hall upgrade",
      "Unlock: New Ottoman Empire Sea Map Region",
    ],
  },
  {
    id: "tech_lg_1",
    name: "Brigandine Armor",
    column: 1,
    required: ["tech_lg_0"],
    costs: {
      research_points: 130,
      coins: 6600000,
      food: 3900000,
      goods: [
        {
          amount: 15000,
          resource: "primary_eg",
        },
        {
          amount: 6350,
          resource: "secondary_eg",
        },
        {
          amount: 3800,
          resource: "primary_hm",
        },
      ],
    },
    rewards: ["Infantry Barracks: Unlocks a Infantry Barracks upgrade"],
  },
  {
    id: "tech_lg_2",
    name: "Fulling Mills",
    column: 1,
    required: ["tech_lg_0"],
    costs: {
      research_points: 32,
      coins: 6600000,
      food: 4800000,
      goods: [
        {
          amount: 12000,
          resource: "secondary_eg",
        },
        {
          amount: 5050,
          resource: "tertiary_eg",
        },
        {
          amount: 5050,
          resource: "primary_ks",
        },
      ],
    },
    rewards: ["Domestic Farm: Unlocks a Domestic Farm upgrade"],
  },
  {
    id: "tech_lg_3",
    name: "Sternpost Rudder",
    column: 1,
    required: ["tech_lg_0"],
    costs: {
      research_points: 165,
      coins: 11000000,
      food: 4700000,
      goods: [
        {
          amount: 17000,
          resource: "tertiary_eg",
        },
        {
          amount: 12500,
          resource: "secondary_ks",
        },
      ],
    },
    allied: "ottoman",
    rewards: [
      "Ottoman Empire Ship: Unlocks a Ottoman Empire Ship upgrade",
      "Shipyard: Allows constructing 1 more Shipyard building in Capital City",
    ],
  },
  {
    id: "tech_lg_4",
    name: "Rose Windows",
    column: 2,
    required: ["tech_lg_1", "tech_lg_2"],
    costs: {
      research_points: 81,
      coins: 3600000,
      food: 3800000,
      goods: [
        {
          amount: 22500,
          resource: "primary_ks",
        },
        {
          amount: 3900,
          resource: "primary_hm",
        },
        {
          amount: 5000,
          resource: "confection",
        },
      ],
    },
    rewards: [
      "Average Home: Unlocks a Average Home upgrade",
      "Compact Culture Site: Unlocks a Compact Culture Site upgrade",
    ],
  },
  {
    id: "tech_lg_5",
    name: "Primary Workshop",
    column: 2,
    required: ["tech_lg_2"],
    costs: {
      research_points: 180,
      coins: 3800000,
      food: 8400000,
      goods: [
        {
          amount: 14500,
          resource: "primary_hm",
        },
        {
          amount: 4500,
          resource: "primary_eg",
        },
        {
          amount: 1800,
          resource: "secondary_eg",
        },
      ],
    },
    rewards: [
      "Primary Workshop: Unlocks a Primary Workshop upgrade",
      "Primary Goods: Unlocks the good Primary Goods for you, so that you can produce it in your city",
    ],
  },
  {
    id: "tech_lg_6",
    name: "Capstan and Windlass",
    column: 2,
    required: ["tech_lg_3"],
    costs: {
      research_points: 100,
      coins: 7000000,
      food: 6000000,
      goods: [
        {
          amount: 7150,
          resource: "primary_eg",
        },
        {
          amount: 4450,
          resource: "tertiary_eg",
        },
        {
          amount: 3550,
          resource: "secondary_hm",
        },
      ],
    },
    allied: "ottoman",
    rewards: [
      "Seafarer House: Unlocks a Seafarer House upgrade",
      "4 Trade Village Silver Upgrade Keys: Gives you 4 Trade Village Silver Upgrade Keys",
    ],
  },
  {
    id: "tech_lg_7",
    name: "Lighthouse Design",
    column: 2,
    required: ["tech_lg_3"],
    costs: {
      research_points: 155,
      coins: 7800000,
      food: 7900000,
      goods: [
        {
          amount: 13000,
          resource: "secondary_eg",
        },
        {
          amount: 7300,
          resource: "primary_hm",
        },
        {
          amount: 2200,
          resource: "secondary_lg",
        },
      ],
    },
    allied: "ottoman",
    rewards: [
      "Lighthouse: Unlocks the Lighthouse",
      "4 Trade Village Silver Upgrade Keys: Gives you 4 Trade Village Silver Upgrade Keys",
      "Lighthouse: Allows constructing 1 more Lighthouse building in Capital City",
    ],
  },
  {
    id: "tech_lg_8",
    name: "Cranequin Crossbows",
    column: 3,
    required: ["tech_lg_4", "tech_lg_5"],
    costs: {
      research_points: 220,
      coins: 2700000,
      food: 2700000,
      goods: [
        {
          amount: 8950,
          resource: "secondary_lg",
        },
        {
          amount: 3750,
          resource: "tertiary_lg",
        },
        {
          amount: 5600,
          resource: "secondary_ks",
        },
      ],
    },
    rewards: ["Ranged Barracks: Unlocks a Ranged Barracks upgrade"],
  },
  {
    id: "tech_lg_9",
    name: "Ottoman Postal System",
    column: 3,
    required: ["tech_lg_5", "tech_lg_6", "tech_lg_7"],
    costs: {
      research_points: 180,
      coins: 3400000,
      food: 2200000,
      goods: [
        {
          amount: 9700,
          resource: "primary_lg",
        },
        {
          amount: 6050,
          resource: "tertiary_eg",
        },
        {
          amount: 4850,
          resource: "tertiary_hm",
        },
      ],
    },
    allied: "ottoman",
    rewards: [
      "Seafarer House: Allows constructing 1 more Seafarer House building in Capital City",
      "4 Trade Village Gold Upgrade Keys: Gives you 4 Trade Village Gold Upgrade Keys",
      "Lighthouse: Allows constructing 1 more Lighthouse building in Capital City",
    ],
  },
  {
    id: "tech_lg_10",
    name: "Counterweight Cranes",
    column: 3,
    required: ["tech_lg_6", "tech_lg_7"],
    costs: {
      research_points: 135,
      coins: 6200000,
      food: 4100000,
      goods: [
        {
          amount: 14500,
          resource: "primary_eg",
        },
        {
          amount: 7950,
          resource: "tertiary_hm",
        },
        {
          amount: 2400,
          resource: "secondary_lg",
        },
      ],
    },
    allied: "ottoman",
    rewards: [
      "Common Warehouse: Allows constructing 1 more Common Warehouse building in Capital City",
      "2 Trade City Silver Upgrade Keys: Gives you 2 Trade City Silver Upgrade Keys",
    ],
  },
  {
    id: "tech_lg_11",
    name: "Water-Powered Hammers",
    column: 4,
    required: ["tech_lg_8"],
    costs: {
      research_points: 130,
      coins: 8100000,
      food: 3900000,
      goods: [
        {
          amount: 8350,
          resource: "tertiary_lg",
        },
        {
          amount: 5200,
          resource: "secondary_eg",
        },
        {
          amount: 4150,
          resource: "primary_hm",
        },
      ],
    },
    rewards: [
      "10,000 Food: Gives you 10,000 Food",
      "Domestic Farm: Unlocks a Domestic Farm upgrade",
    ],
  },
  {
    id: "tech_lg_12",
    name: "Stained Glass Mastery",
    column: 4,
    required: ["tech_lg_8"],
    costs: {
      research_points: 180,
      coins: 9900000,
      food: 8600000,
      goods: [
        {
          amount: 9350,
          resource: "secondary_lg",
        },
        {
          amount: 7800,
          resource: "primary_hm",
        },
        {
          amount: 2350,
          resource: "primary_lg",
        },
      ],
    },
    rewards: [
      "10,000 Coins: Gives you 10,000 Coins",
      "Small Home: Allows constructing 1 more Small Home building in Capital City",
      "Small Home: Unlocks a Small Home upgrade",
    ],
  },
  {
    id: "tech_lg_13",
    name: "Pilotage and Sea Lanes",
    column: 4,
    required: ["tech_lg_8", "tech_lg_9", "tech_lg_10"],
    costs: {
      research_points: 145,
      coins: 8000000,
      food: 9000000,
      goods: [
        {
          amount: 32000,
          resource: "tertiary_hm",
        },
        {
          amount: 5000,
          resource: "wheat",
        },
      ],
    },
    allied: "ottoman",
    rewards: [
      "Shipyard: Allows constructing 1 more Shipyard building in Capital City",
      "4 Trade Village Gold Upgrade Keys: Gives you 4 Trade Village Gold Upgrade Keys",
    ],
  },
  {
    id: "tech_lg_14",
    name: "Carvel Planking",
    column: 4,
    required: ["tech_lg_10"],
    costs: {
      research_points: 150,
      coins: 3400000,
      food: 8600000,
      goods: [
        {
          amount: 12500,
          resource: "primary_lg",
        },
        {
          amount: 7500,
          resource: "apricot",
        },
        {
          amount: 12000,
          resource: "pomegranate",
        },
      ],
    },
    allied: "ottoman",
    rewards: [
      "Shipyard: Unlocks a Shipyard upgrade",
      "2 Trade City Silver Upgrade Keys: Gives you 2 Trade City Silver Upgrade Keys",
    ],
  },
  {
    id: "tech_lg_15",
    name: "Lance-Rest Harness",
    column: 5,
    required: ["tech_lg_11", "tech_lg_12", "tech_lg_13"],
    costs: {
      research_points: 105,
      coins: 2700000,
      food: 3100000,
      goods: [
        {
          amount: 7700,
          resource: "tertiary_lg",
        },
        {
          amount: 4800,
          resource: "primary_eg",
        },
        {
          amount: 1900,
          resource: "primary_lg",
        },
      ],
    },
    rewards: ["Cavalry Barracks: Unlocks a Cavalry Barracks upgrade"],
  },
  {
    id: "tech_lg_16",
    name: "Sounding Lead Practices",
    column: 5,
    required: ["tech_lg_13"],
    costs: {
      research_points: 110,
      coins: 8500000,
      food: 5000000,
      goods: [
        {
          amount: 8400,
          resource: "primary_lg",
        },
        {
          amount: 5250,
          resource: "tertiary_eg",
        },
        {
          amount: 4200,
          resource: "secondary_hm",
        },
      ],
    },
    allied: "ottoman",
    rewards: [
      "Lighthouse: Allows constructing 1 more Lighthouse building in Capital City",
      "4 Trade Village Platinum Upgrade Keys: Gives you 4 Trade Village Platinum Upgrade Keys",
    ],
  },
  {
    id: "tech_lg_17",
    name: "Ottoman Tax Register",
    column: 5,
    required: ["tech_lg_14"],
    costs: {
      research_points: 130,
      coins: 10000000,
      food: 5600000,
      goods: [
        {
          amount: 16000,
          resource: "primary_eg",
        },
        {
          amount: 9050,
          resource: "secondary_hm",
        },
        {
          amount: 9000,
          resource: "syrup",
        },
      ],
    },
    allied: "ottoman",
    rewards: [
      "Seafarer House: Allows constructing 1 more Seafarer House building in Capital City",
      "2 Trade City Gold Upgrade Keys: Gives you 2 Trade City Gold Upgrade Keys",
    ],
  },
  {
    id: "tech_lg_18",
    name: "Port Dues Administration",
    column: 5,
    required: ["tech_lg_14"],
    costs: {
      research_points: 125,
      coins: 4100000,
      food: 7800000,
      goods: [
        {
          amount: 8600,
          resource: "secondary_lg",
        },
        {
          amount: 5350,
          resource: "secondary_eg",
        },
        {
          amount: 4300,
          resource: "tertiary_hm",
        },
      ],
    },
    allied: "ottoman",
    rewards: [
      "Pier: Unlocks the Pier",
      "2 Trade City Gold Upgrade Keys: Gives you 2 Trade City Gold Upgrade Keys",
      "Pier: Allows constructing 1 more Pier building in Capital City",
    ],
  },
  {
    id: "tech_lg_19",
    name: "Perpendicular Tracery",
    column: 6,
    required: ["tech_lg_15"],
    costs: {
      research_points: 130,
      coins: 8500000,
      food: 3300000,
      goods: [
        {
          amount: 11000,
          resource: "tertiary_eg",
        },
        {
          amount: 3050,
          resource: "primary_lg",
        },
        {
          amount: 1800,
          resource: "tertiary_lg",
        },
      ],
    },
    rewards: ["Moderate Culture Site: Unlocks a Moderate Culture Site upgrade"],
  },
  {
    id: "tech_lg_20",
    name: "Enclosed Fields",
    column: 6,
    required: ["tech_lg_15"],
    costs: {
      research_points: 220,
      coins: 9400000,
      food: 4900000,
      goods: [
        {
          amount: 8400,
          resource: "tertiary_lg",
        },
        {
          amount: 7000,
          resource: "primary_hm",
        },
        {
          amount: 2100,
          resource: "secondary_lg",
        },
      ],
    },
    rewards: [
      "10,000 Food: Gives you 10,000 Food",
      "Rural Farm: Allows constructing 1 more Rural Farm building in Capital City",
      "Rural Farm: Unlocks a Rural Farm upgrade",
    ],
  },
  {
    id: "tech_lg_21",
    name: "Portolan Charts",
    column: 6,
    required: ["tech_lg_16", "tech_lg_17"],
    costs: {
      research_points: 140,
      coins: 5800000,
      food: 3000000,
      goods: [
        {
          amount: 8850,
          resource: "secondary_lg",
        },
        {
          amount: 5550,
          resource: "primary_eg",
        },
        {
          amount: 4450,
          resource: "tertiary_hm",
        },
      ],
    },
    allied: "ottoman",
    rewards: [
      "Lighthouse: Allows constructing 1 more Lighthouse building in Capital City",
      "4 Trade Village Platinum Upgrade Keys: Gives you 4 Trade Village Platinum Upgrade Keys",
    ],
  },
  {
    id: "tech_lg_22",
    name: "Customs Houses",
    column: 6,
    required: ["tech_lg_17", "tech_lg_18"],
    costs: {
      research_points: 135,
      coins: 8400000,
      food: 5200000,
      goods: [
        {
          amount: 9200,
          resource: "primary_lg",
        },
        {
          amount: 9850,
          resource: "primary_ks",
        },
        {
          amount: 5000,
          resource: "tea",
        },
      ],
    },
    allied: "ottoman",
    rewards: [
      "Common Warehouse: Allows constructing 1 more Common Warehouse building in Capital City",
      "2 Trade City Platinum Upgrade Keys: Gives you 2 Trade City Platinum Upgrade Keys",
      "Pier: Allows constructing 1 more Pier building in Capital City",
    ],
  },
  {
    id: "tech_lg_23",
    name: "Secondary Workshop",
    column: 7,
    required: ["tech_lg_19", "tech_lg_20"],
    costs: {
      research_points: 210,
      coins: 3700000,
      food: 7900000,
      goods: [
        {
          amount: 28000,
          resource: "secondary_ks",
        },
        {
          amount: 7200,
          resource: "tertiary_eg",
        },
        {
          amount: 5000,
          resource: "brocade",
        },
      ],
    },
    rewards: [
      "Secondary Workshop: Unlocks a Secondary Workshop upgrade",
      "Secondary Goods: Unlocks the good Secondary Goods for you, so that you can produce it in your city",
    ],
  },
  {
    id: "tech_lg_24",
    name: "Bills of Exchange",
    column: 7,
    required: ["tech_lg_20", "tech_lg_21"],
    costs: {
      research_points: 165,
      coins: 9100000,
      food: 7600000,
      goods: [
        {
          amount: 9150,
          resource: "secondary_lg",
        },
        {
          amount: 5750,
          resource: "secondary_eg",
        },
        {
          amount: 4600,
          resource: "primary_hm",
        },
      ],
    },
    allied: "ottoman",
    rewards: [
      "Seafarer House: Unlocks a Seafarer House upgrade",
      "4 Trade Village Diamond Upgrade Keys: Gives you 4 Trade Village Diamond Upgrade Keys",
    ],
  },
  {
    id: "tech_lg_25",
    name: "Double Entry Bookkeeping",
    column: 7,
    required: ["tech_lg_21", "tech_lg_22"],
    costs: {
      research_points: 170,
      coins: 6000000,
      food: 6700000,
      goods: [
        {
          amount: 16000,
          resource: "secondary_hm",
        },
        {
          amount: 8450,
          resource: "tertiary_ks",
        },
        {
          amount: 2050,
          resource: "tertiary_lg",
        },
      ],
    },
    allied: "ottoman",
    rewards: [
      "Common Warehouse: Unlocks a Common Warehouse upgrade",
      "2 Trade City Platinum Upgrade Keys: Gives you 2 Trade City Platinum Upgrade Keys",
    ],
  },
  {
    id: "tech_lg_26",
    name: "Coat of Plates",
    column: 8,
    required: ["tech_lg_23"],
    costs: {
      research_points: 215,
      coins: 10000000,
      food: 6400000,
      goods: [
        {
          amount: 7900,
          resource: "tertiary_lg",
        },
        {
          amount: 4950,
          resource: "primary_eg",
        },
        {
          amount: 3950,
          resource: "tertiary_hm",
        },
      ],
    },
    rewards: [
      "Heavy Infantry Barracks: Unlocks a Heavy Infantry Barracks upgrade",
    ],
  },
  {
    id: "tech_lg_27",
    name: "Lierne and Fan Vaults",
    column: 8,
    required: ["tech_lg_23"],
    costs: {
      research_points: 165,
      coins: 8800000,
      food: 2600000,
      goods: [
        {
          amount: 8050,
          resource: "secondary_lg",
        },
        {
          amount: 6750,
          resource: "secondary_hm",
        },
        {
          amount: 2000,
          resource: "primary_lg",
        },
      ],
    },
    rewards: [
      "10,000 Coins: Gives you 10,000 Coins",
      "Average Home: Allows constructing 1 more Average Home building in Capital City",
      "Average Home: Unlocks a Average Home upgrade",
    ],
  },
  {
    id: "tech_lg_28",
    name: "Admiralty Courts",
    column: 8,
    required: ["tech_lg_23", "tech_lg_24"],
    costs: {
      research_points: 145,
      coins: 3300000,
      food: 4500000,
      goods: [
        {
          amount: 10500,
          resource: "primary_lg",
        },
        {
          amount: 4250,
          resource: "tertiary_lg",
        },
        {
          amount: 6400,
          resource: "tertiary_ks",
        },
      ],
    },
    allied: "ottoman",
    rewards: [
      "Common Warehouse: Allows constructing 1 more Common Warehouse building in Capital City",
      "4 Trade Village Advanced Upgrade Keys: Gives you 4 Trade Village Advanced Upgrade Keys",
      "Shipyard: Allows constructing 1 more Shipyard building in Capital City",
    ],
  },
  {
    id: "tech_lg_29",
    name: "Quarantine",
    column: 8,
    required: ["tech_lg_24", "tech_lg_25"],
    costs: {
      research_points: 120,
      coins: 5200000,
      food: 6600000,
      goods: [
        {
          amount: 15500,
          resource: "primary_eg",
        },
        {
          amount: 8950,
          resource: "secondary_hm",
        },
        {
          amount: 5000,
          resource: "tea",
        },
      ],
    },
    allied: "ottoman",
    rewards: [
      "Seafarer House: Allows constructing 1 more Seafarer House building in Capital City",
      "4 Trade Village Diamond Upgrade Keys: Gives you 4 Trade Village Diamond Upgrade Keys",
      "Pier: Allows constructing 1 more Pier building in Capital City",
    ],
  },
  {
    id: "tech_lg_30",
    name: "Gelatin Sizing",
    column: 9,
    required: ["tech_lg_26", "tech_lg_27"],
    costs: {
      research_points: 170,
      coins: 9500000,
      food: 4000000,
      goods: [
        {
          amount: 10500,
          resource: "secondary_lg",
        },
        {
          amount: 6550,
          resource: "tertiary_eg",
        },
        {
          amount: 2600,
          resource: "primary_lg",
        },
      ],
    },
    rewards: [
      "10,000 Food: Gives you 10,000 Food",
      "Domestic Farm: Allows constructing 1 more Domestic Farm building in Capital City",
      "Domestic Farm: Unlocks a Domestic Farm upgrade",
    ],
  },
  {
    id: "tech_lg_31",
    name: "Covered Sewers",
    column: 9,
    required: ["tech_lg_27", "tech_lg_28"],
    costs: {
      research_points: 150,
      coins: 4200000,
      food: 5900000,
      goods: [
        {
          amount: 10500,
          resource: "tertiary_lg",
        },
        {
          amount: 8700,
          resource: "tertiary_hm",
        },
        {
          amount: 2600,
          resource: "secondary_lg",
        },
      ],
    },
    rewards: [
      "Little Culture Site: Unlocks a Little Culture Site upgrade",
      "Little Culture Site: Allows constructing 1 more Little Culture Site building in Capital City",
    ],
  },
  {
    id: "tech_lg_32",
    name: "Log Line and Sandglass",
    column: 9,
    required: ["tech_lg_28", "tech_lg_29"],
    costs: {
      research_points: 130,
      coins: 2600000,
      food: 4600000,
      goods: [
        {
          amount: 24000,
          resource: "tertiary_ks",
        },
        {
          amount: 6100,
          resource: "primary_eg",
        },
        {
          amount: 7500,
          resource: "brocade",
        },
      ],
    },
    allied: "ottoman",
    rewards: [
      "Ottoman Emipre Ship: Unlocks a Ottoman Emipre Ship upgrade",
      "2 Trade City Diamond Upgrade Keys: Gives you 2 Trade City Diamond Upgrade Keys",
      "Shipyard: Allows constructing 1 more Shipyard building in Capital City",
    ],
  },
  {
    id: "tech_lg_33",
    name: "City Watch",
    column: 10,
    required: ["tech_lg_30"],
    costs: {
      research_points: 225,
      coins: 4300000,
      food: 5100000,
      goods: [
        {
          amount: 8650,
          resource: "primary_lg",
        },
        {
          amount: 9000,
          resource: "primary_ks",
        },
        {
          amount: 2150,
          resource: "tertiary_lg",
        },
      ],
    },
    rewards: [
      "10,000 Coins: Gives you 10,000 Coins",
      "Average Home: Unlocks a Average Home upgrade",
    ],
  },
  {
    id: "tech_lg_34",
    name: "Field Artillery",
    column: 10,
    required: ["tech_lg_30", "tech_lg_31"],
    costs: {
      research_points: 125,
      coins: 8500000,
      food: 5600000,
      goods: [
        {
          amount: 10500,
          resource: "tertiary_lg",
        },
        {
          amount: 8650,
          resource: "secondary_hm",
        },
        {
          amount: 5200,
          resource: "primary_hm",
        },
      ],
    },
    rewards: ["Siege Barracks: Unlocks a Siege Barracks upgrade"],
  },
  {
    id: "tech_lg_35",
    name: "Windmill Automation",
    column: 10,
    required: ["tech_lg_30", "tech_lg_31"],
    costs: {
      research_points: 130,
      coins: 7200000,
      food: 2500000,
      goods: [
        {
          amount: 12500,
          resource: "primary_eg",
        },
        {
          amount: 5150,
          resource: "secondary_eg",
        },
        {
          amount: 2050,
          resource: "primary_lg",
        },
      ],
    },
    rewards: [
      "10,000 Food: Gives you 10,000 Food",
      "Moderate Culture Site: Allows constructing 1 more Moderate Culture Site building in Capital City",
      "Rural Farm: Unlocks a Rural Farm upgrade",
    ],
  },
  {
    id: "tech_lg_36",
    name: "Guild Halls",
    column: 10,
    required: ["tech_lg_31", "tech_lg_32"],
    costs: {
      research_points: 125,
      coins: 9100000,
      food: 7200000,
      goods: [
        {
          amount: 11500,
          resource: "secondary_lg",
        },
        {
          amount: 9850,
          resource: "tertiary_hm",
        },
        {
          amount: 9000,
          resource: "tea",
        },
      ],
    },
    allied: "ottoman",
    rewards: [
      "Lighthouse: Allows constructing 1 more Lighthouse building in Capital City",
      "4 Trade Village Advanced Upgrade Keys: Gives you 4 Trade Village Advanced Upgrade Keys",
      "Seafarer House: Allows constructing 1 more Seafarer House building in Capital City",
    ],
  },
  {
    id: "tech_lg_37",
    name: "Came Glasswork",
    column: 11,
    required: ["tech_lg_33", "tech_lg_34"],
    costs: {
      research_points: 155,
      coins: 3500000,
      food: 4700000,
      goods: [
        {
          amount: 7900,
          resource: "primary_lg",
        },
        {
          amount: 4900,
          resource: "tertiary_eg",
        },
      ],
    },
    rewards: [
      "Large Culture Site: Unlocks a Large Culture Site upgrade",
      "Primary Workshop: Allows constructing 1 more Primary Workshop building in Capital City",
    ],
  },
  {
    id: "tech_lg_38",
    name: "Hops Cultivation",
    column: 11,
    required: ["tech_lg_35", "tech_lg_36"],
    costs: {
      research_points: 165,
      coins: 4200000,
      food: 4700000,
      goods: [
        {
          amount: 17500,
          resource: "tertiary_eg",
        },
        {
          amount: 12500,
          resource: "tertiary_ks",
        },
        {
          amount: 9000,
          resource: "brocade",
        },
      ],
    },
    rewards: [
      "10,000 Coins: Gives you 10,000 Coins",
      "Small Home: Unlocks a Small Home upgrade",
    ],
  },
  {
    id: "tech_lg_39",
    name: "Letters of Credit",
    column: 11,
    required: ["tech_lg_36"],
    costs: {
      research_points: 125,
      coins: 3500000,
      food: 7200000,
      goods: [
        {
          amount: 9400,
          resource: "secondary_lg",
        },
        {
          amount: 3900,
          resource: "tertiary_lg",
        },
        {
          amount: 4700,
          resource: "secondary_hm",
        },
      ],
    },
    allied: "ottoman",
    rewards: [
      "Common Warehouse: Allows constructing 1 more Common Warehouse building in Capital City",
      "2 Trade City Advanced Upgrade Keys: Gives you 2 Trade City Advanced Upgrade Keys",
    ],
  },
  {
    id: "tech_lg_40",
    name: "Monte Di Pieta",
    column: 11,
    required: ["tech_lg_36"],
    costs: {
      research_points: 150,
      coins: 5000000,
      food: 3400000,
      goods: [
        {
          amount: 8950,
          resource: "tertiary_lg",
        },
        {
          amount: 5600,
          resource: "tertiary_eg",
        },
        {
          amount: 3350,
          resource: "secondary_eg",
        },
      ],
    },
    allied: "ottoman",
    rewards: [
      "Pier: Allows constructing 1 more Pier building in Capital City",
      "2 Trade City Diamond Upgrade Keys: Gives you 2 Trade City Diamond Upgrade Keys",
    ],
  },
  {
    id: "tech_lg_41",
    name: "Tertiary Workshop",
    column: 12,
    required: ["tech_lg_37", "tech_lg_38", "tech_lg_39"],
    costs: {
      research_points: 160,
      coins: 4300000,
      food: 6200000,
      goods: [
        {
          amount: 19500,
          resource: "primary_hm",
        },
        {
          amount: 4050,
          resource: "tertiary_lg",
        },
        {
          amount: 4850,
          resource: "tertiary_hm",
        },
      ],
    },
    rewards: [
      "Tertiary Workshop: Unlocks a Tertiary Workshop upgrade",
      "Tertiary Goods: Unlocks the good Tertiary Goods for you, so that you can produce it in your city",
    ],
  },
  {
    id: "tech_lg_42",
    name: "Treadle Looms",
    column: 12,
    required: ["tech_lg_39", "tech_lg_40"],
    costs: {
      research_points: 135,
      coins: 11000000,
      food: 7700000,
      goods: [
        {
          amount: 8750,
          resource: "tertiary_lg",
        },
        {
          amount: 3650,
          resource: "primary_lg",
        },
        {
          amount: 3300,
          resource: "primary_eg",
        },
      ],
    },
    allied: "ottoman",
    rewards: [
      "Pier: Allows constructing 1 more Pier building in Capital City",
      "2 Trade City Advanced Upgrade Keys: Gives you 2 Trade City Advanced Upgrade Keys",
    ],
  },
  {
    id: "tech_lg_43",
    name: "Ottoman Empire Consensus",
    column: 13,
    required: ["tech_lg_41", "tech_lg_42"],
    costs: {
      research_points: 175,
      coins: 7800000,
      food: 8100000,
      goods: [
        {
          amount: 20000,
          resource: "secondary_hm",
        },
        {
          amount: 6300,
          resource: "secondary_eg",
        },
        {
          amount: 2500,
          resource: "tertiary_lg",
        },
      ],
    },
    allied: "ottoman",
    rewards: [
      "1 Wonder Orb: Gives you 1 Wonder Orb",
      "100,000 Aspers: Gives you 100,000 Aspers",
    ],
  },
];
