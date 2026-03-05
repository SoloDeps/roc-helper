import { TechnoData } from "@/types/shared";

export const technos_LG: TechnoData[] = [
  {
    id: "lg_0",
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
      {
        title: "Small Home",
        desc: "Unlocks a Small Home upgrade",
        img: { kind: "wiki", imageName: "Capital_Small_Home_Lv", level: 40 },
      },
      {
        title: "Rural Farm",
        desc: "Unlocks a Rural Farm upgrade",
        img: { kind: "wiki", imageName: "Capital_Rural_Farm_Lv", level: 40 },
      },
      {
        title: "Common Warehouse",
        desc: "Unlocks a Common Warehouse upgrade",
        img: { kind: "wiki", imageName: "Common_Warehouse_Lv", level: 2 },
      },
      {
        title: "City Hall",
        desc: "Unlocks a City Hall upgrade",
        img: { kind: "catalog", imgType: "museum", invert: true },
      },
      {
        title: "Unlock",
        desc: "New Ottoman Empire Sea Map Region",
        img: { kind: "catalog", imgType: "ottoman" },
      }
    ],
  },
  {
    id: "lg_1",
    name: "Brigandine Armor",
    column: 1,
    required: ["lg_0"],
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
    rewards: [
      {
        title: "Infantry Barracks",
        desc: "Unlocks a Infantry Barracks upgrade",
        img: { kind: "wiki", imageName: "Capital_Infantry_Barracks_Lv", level: 14 },
      }
    ],
  },
  {
    id: "lg_2",
    name: "Fulling Mills",
    column: 1,
    required: ["lg_0"],
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
    rewards: [
      {
        title: "Domestic Farm",
        desc: "Unlocks a Domestic Farm upgrade",
        img: { kind: "wiki", imageName: "Capital_Domestic_Farm_Lv", level: 40 },
      }
    ],
  },
  {
    id: "lg_3",
    name: "Sternpost Rudder",
    column: 1,
    required: ["lg_0"],
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
      {
        title: "Ottoman Empire Ship",
        desc: "Unlocks a Ottoman Empire Ship upgrade",
        img: { kind: "wiki", imageName: "Ottoman_Empire_Ship_Lv", level: 3 },
      },
      {
        title: "Shipyard",
        desc: "Allows constructing 1 more Shipyard building in Capital City",
        img: { kind: "catalog", imgType: "shipyard", invert: true },
      }
    ],
  },
  {
    id: "lg_4",
    name: "Rose Windows",
    column: 2,
    required: ["lg_1", "lg_2"],
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
      {
        title: "Average Home",
        desc: "Unlocks a Average Home upgrade",
        img: { kind: "wiki", imageName: "Capital_Average_Home_Lv", level: 40 },
      },
      {
        title: "Compact Culture Site",
        desc: "Unlocks a Compact Culture Site upgrade",
        img: { kind: "wiki", imageName: "Capital_Compact_Culture_Site_Lv", level: 14 },
      }
    ],
  },
  {
    id: "lg_5",
    name: "Primary Good",
    column: 2,
    required: ["lg_2"],
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
      {
        title: "Primary Good",
        desc: "Unlocks a Primary Good upgrade",
        img: { kind: "good", priority: "primary" },
      },
      {
        title: "Primary Workshop",
        desc: "Unlocks the Primary workshop building",
        img: { kind: "catalog", imgType: "workshop", invert: true },
      }
    ],
  },
  {
    id: "lg_6",
    name: "Capstan and Windlass",
    column: 2,
    required: ["lg_3"],
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
      {
        title: "Seafarer House",
        desc: "Unlocks a Seafarer House upgrade",
        img: { kind: "wiki", imageName: "Seafarer_House_Lv", level: 3 },
      },
      {
        title: "4 Trade Village Silver Upgrade Keys",
        desc: "Gives you 4 Trade Village Silver Upgrade Keys",
        img: { kind: "local", path: "/images/goods/trade_village_silver_upkey.webp" },
      }
    ],
  },
  {
    id: "lg_7",
    name: "Lighthouse Design",
    column: 2,
    required: ["lg_3"],
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
      {
        title: "Lighthouse",
        desc: "Unlocks the Lighthouse",
        img: { kind: "wiki", imageName: "Lighthouse_Lv", level: 1 },
      },
      {
        title: "4 Trade Village Silver Upgrade Keys",
        desc: "Gives you 4 Trade Village Silver Upgrade Keys",
        img: { kind: "local", path: "/images/goods/trade_village_silver_upkey.webp" },
      },
      {
        title: "Lighthouse",
        desc: "Allows constructing 1 more Lighthouse building in Capital City",
        img: { kind: "catalog", imgType: "shipyard", invert: true },
      }
    ],
  },
  {
    id: "lg_8",
    name: "Cranequin Crossbows",
    column: 3,
    required: ["lg_4", "lg_5"],
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
    rewards: [
      {
        title: "Ranged Barracks",
        desc: "Unlocks a Ranged Barracks upgrade",
        img: { kind: "wiki", imageName: "Capital_Ranged_Barracks_Lv", level: 14 },
      }
    ],
  },
  {
    id: "lg_9",
    name: "Ottoman Postal System",
    column: 3,
    required: ["lg_5", "lg_6", "lg_7"],
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
      {
        title: "Seafarer House",
        desc: "Allows constructing 1 more Seafarer House building in Capital City",
        img: { kind: "catalog", imgType: "sailorHome", invert: true },
      },
      {
        title: "4 Trade Village Gold Upgrade Keys",
        desc: "Gives you 4 Trade Village Gold Upgrade Keys",
        img: { kind: "local", path: "/images/goods/trade_village_gold_upkey.webp" },
      },
      {
        title: "Lighthouse",
        desc: "Allows constructing 1 more Lighthouse building in Capital City",
        img: { kind: "catalog", imgType: "shipyard", invert: true },
      }
    ],
  },
  {
    id: "lg_10",
    name: "Counterweight Cranes",
    column: 3,
    required: ["lg_6", "lg_7"],
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
      {
        title: "Common Warehouse",
        desc: "Allows constructing 1 more Common Warehouse building in Capital City",
        img: { kind: "catalog", imgType: "warehouse", invert: true },
      },
      {
        title: "2 Trade City Silver Upgrade Keys",
        desc: "Gives you 2 Trade City Silver Upgrade Keys",
        img: { kind: "local", path: "/images/goods/trade_city_silver_upkey.webp" },
      }
    ],
  },
  {
    id: "lg_11",
    name: "Water-Powered Hammers",
    column: 4,
    required: ["lg_8"],
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
      {
        title: "15,000 Aspers",
        desc: "Gives you 15,000 Aspers",
        img: { kind: "local", path: "/images/goods-large/asper.webp" },
      },
      {
        title: "Domestic Farm",
        desc: "Unlocks a Domestic Farm upgrade",
        img: { kind: "wiki", imageName: "Capital_Domestic_Farm_Lv", level: 41 },
      }
    ],
  },
  {
    id: "lg_12",
    name: "Stained Glass Mastery",
    column: 4,
    required: ["lg_8"],
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
      {
        title: "15,000 Aspers",
        desc: "Gives you 15,000 Aspers",
        img: { kind: "local", path: "/images/goods-large/asper.webp" },
      },
      {
        title: "Small Home",
        desc: "Allows constructing 1 more Small Home building in Capital City",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
      {
        title: "Small Home",
        desc: "Unlocks a Small Home upgrade",
        img: { kind: "wiki", imageName: "Capital_Small_Home_Lv", level: 41 },
      }
    ],
  },
  {
    id: "lg_13",
    name: "Pilotage and Sea Lanes",
    column: 4,
    required: ["lg_8", "lg_9", "lg_10"],
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
      {
        title: "Shipyard",
        desc: "Allows constructing 1 more Shipyard building in Capital City",
        img: { kind: "catalog", imgType: "shipyard", invert: true },
      },
      {
        title: "4 Trade Village Gold Upgrade Keys",
        desc: "Gives you 4 Trade Village Gold Upgrade Keys",
        img: { kind: "local", path: "/images/goods/trade_village_gold_upkey.webp" },
      }
    ],
  },
  {
    id: "lg_14",
    name: "Carvel Planking",
    column: 4,
    required: ["lg_10"],
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
      {
        title: "Shipyard",
        desc: "Unlocks a Shipyard upgrade",
        img: { kind: "wiki", imageName: "Shipyard_Lv", level: 2 },
      },
      {
        title: "2 Trade City Silver Upgrade Keys",
        desc: "Gives you 2 Trade City Silver Upgrade Keys",
        img: { kind: "local", path: "/images/goods/trade_city_silver_upkey.webp" },
      }
    ],
  },
  {
    id: "lg_15",
    name: "Lance-Rest Harness",
    column: 5,
    required: ["lg_11", "lg_12", "lg_13"],
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
    rewards: [
      {
        title: "Cavalry Barracks",
        desc: "Unlocks a Cavalry Barracks upgrade",
        img: { kind: "wiki", imageName: "Capital_Cavalry_Barracks_Lv", level: 14 },
      }
    ],
  },
  {
    id: "lg_16",
    name: "Sounding Lead Practices",
    column: 5,
    required: ["lg_13"],
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
      {
        title: "Lighthouse",
        desc: "Allows constructing 1 more Lighthouse building in Capital City",
        img: { kind: "catalog", imgType: "shipyard", invert: true },
      },
      {
        title: "4 Trade Village Platinum Upgrade Keys",
        desc: "Gives you 4 Trade Village Platinum Upgrade Keys",
        img: { kind: "local", path: "/images/goods/trade_village_platinum_upkey.webp" },
      }
    ],
  },
  {
    id: "lg_17",
    name: "Ottoman Tax Register",
    column: 5,
    required: ["lg_14"],
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
      {
        title: "Seafarer House",
        desc: "Allows constructing 1 more Seafarer House building in Capital City",
        img: { kind: "catalog", imgType: "sailorHome", invert: true },
      },
      {
        title: "2 Trade City Gold Upgrade Keys",
        desc: "Gives you 2 Trade City Gold Upgrade Keys",
        img: { kind: "local", path: "/images/goods/trade_city_gold_upkey.webp" },
      }
    ],
  },
  {
    id: "lg_18",
    name: "Port Dues Administration",
    column: 5,
    required: ["lg_14"],
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
      {
        title: "Pier",
        desc: "Unlocks the Pier",
        img: { kind: "wiki", imageName: "Pier_Lv", level: 1 },
      },
      {
        title: "2 Trade City Gold Upgrade Keys",
        desc: "Gives you 2 Trade City Gold Upgrade Keys",
        img: { kind: "local", path: "/images/goods/trade_city_gold_upkey.webp" },
      },
      {
        title: "Pier",
        desc: "Allows constructing 1 more Pier building in Capital City",
        img: { kind: "catalog", imgType: "shipyard", invert: true },
      }
    ],
  },
  {
    id: "lg_19",
    name: "Perpendicular Tracery",
    column: 6,
    required: ["lg_15"],
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
    rewards: [
      {
        title: "Moderate Culture Site",
        desc: "Unlocks a Moderate Culture Site upgrade",
        img: { kind: "wiki", imageName: "Capital_Moderate_Culture_Site_Lv", level: 14 },
      }
    ],
  },
  {
    id: "lg_20",
    name: "Enclosed Fields",
    column: 6,
    required: ["lg_15"],
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
      {
        title: "Rural Farm",
        desc: "Allows constructing 1 more Rural Farm building in Capital City",
        img: { kind: "catalog", imgType: "barn", invert: true },
      },
      {
        title: "Rural Farm",
        desc: "Unlocks a Rural Farm upgrade",
        img: { kind: "wiki", imageName: "Capital_Rural_Farm_Lv", level: 41 },
      }
    ],
  },
  {
    id: "lg_21",
    name: "Portolan Charts",
    column: 6,
    required: ["lg_16", "lg_17"],
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
      {
        title: "Lighthouse",
        desc: "Allows constructing 1 more Lighthouse building in Capital City",
        img: { kind: "catalog", imgType: "shipyard", invert: true },
      },
      {
        title: "4 Trade Village Platinum Upgrade Keys",
        desc: "Gives you 4 Trade Village Platinum Upgrade Keys",
        img: { kind: "local", path: "/images/goods/trade_village_platinum_upkey.webp" },
      }
    ],
  },
  {
    id: "lg_22",
    name: "Customs Houses",
    column: 6,
    required: ["lg_17", "lg_18"],
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
      {
        title: "Common Warehouse",
        desc: "Allows constructing 1 more Common Warehouse building in Capital City",
        img: { kind: "catalog", imgType: "warehouse", invert: true },
      },
      {
        title: "2 Trade City Platinum Upgrade Keys",
        desc: "Gives you 2 Trade City Platinum Upgrade Keys",
        img: { kind: "local", path: "/images/goods/trade_city_platinum_upkey.webp" },
      },
      {
        title: "Pier",
        desc: "Allows constructing 1 more Pier building in Capital City",
        img: { kind: "catalog", imgType: "shipyard", invert: true },
      }
    ],
  },
  {
    id: "lg_23",
    name: "Secondary Good",
    column: 7,
    required: ["lg_19", "lg_20"],
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
      {
        title: "Secondary Good",
        desc: "Unlocks a Secondary Good upgrade",
        img: { kind: "good", priority: "secondary" },
      },
      {
        title: "Secondary Workshop",
        desc: "Unlocks the Secondary workshop building",
        img: { kind: "catalog", imgType: "workshop", invert: true },
      }
    ],
  },
  {
    id: "lg_24",
    name: "Bills of Exchange",
    column: 7,
    required: ["lg_20", "lg_21"],
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
      {
        title: "Seafarer House",
        desc: "Unlocks a Seafarer House upgrade",
        img: { kind: "wiki", imageName: "Seafarer_House_Lv", level: 4 },
      },
      {
        title: "4 Trade Village Diamond Upgrade Keys",
        desc: "Gives you 4 Trade Village Diamond Upgrade Keys",
        img: { kind: "local", path: "/images/goods/trade_village_diamond_upkey.webp" },
      }
    ],
  },
  {
    id: "lg_25",
    name: "Double Entry Bookkeeping",
    column: 7,
    required: ["lg_21", "lg_22"],
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
      {
        title: "Common Warehouse",
        desc: "Unlocks a Common Warehouse upgrade",
        img: { kind: "wiki", imageName: "Common_Warehouse_Lv", level: 3 },
      },
      {
        title: "2 Trade City Platinum Upgrade Keys",
        desc: "Gives you 2 Trade City Platinum Upgrade Keys",
        img: { kind: "local", path: "/images/goods/trade_city_platinum_upkey.webp" },
      }
    ],
  },
  {
    id: "lg_26",
    name: "Coat of Plates",
    column: 8,
    required: ["lg_23"],
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
      {
        title: "Heavy Infantry Barracks",
        desc: "Unlocks a Heavy Infantry Barracks upgrade",
        img: { kind: "wiki", imageName: "Capital_Heavy_Infantry_Barracks_Lv", level: 14 },
      }
    ],
  },
  {
    id: "lg_27",
    name: "Lierne and Fan Vaults",
    column: 8,
    required: ["lg_23"],
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
      {
        title: "Average Home",
        desc: "Allows constructing 1 more Average Home building in Capital City",
        img: { kind: "catalog", imgType: "home", invert: true },
      },
      {
        title: "Average Home",
        desc: "Unlocks a Average Home upgrade",
        img: { kind: "wiki", imageName: "Capital_Average_Home_Lv", level: 41 },
      }
    ],
  },
  {
    id: "lg_28",
    name: "Admiralty Courts",
    column: 8,
    required: ["lg_23", "lg_24"],
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
      {
        title: "Common Warehouse",
        desc: "Allows constructing 1 more Common Warehouse building in Capital City",
        img: { kind: "catalog", imgType: "warehouse", invert: true },
      },
      {
        title: "4 Trade Village Advanced Upgrade Keys",
        desc: "Gives you 4 Trade Village Advanced Upgrade Keys",
        img: { kind: "local", path: "/images/goods/trade_village_advanced_upkey.webp" },
      },
      {
        title: "Shipyard",
        desc: "Allows constructing 1 more Shipyard building in Capital City",
        img: { kind: "catalog", imgType: "shipyard", invert: true },
      }
    ],
  },
  {
    id: "lg_29",
    name: "Quarantine",
    column: 8,
    required: ["lg_24", "lg_25"],
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
      {
        title: "Seafarer House",
        desc: "Allows constructing 1 more Seafarer House building in Capital City",
        img: { kind: "catalog", imgType: "sailorHome", invert: true },
      },
      {
        title: "4 Trade Village Diamond Upgrade Keys",
        desc: "Gives you 4 Trade Village Diamond Upgrade Keys",
        img: { kind: "local", path: "/images/goods/trade_village_diamond_upkey.webp" },
      },
      {
        title: "Pier",
        desc: "Allows constructing 1 more Pier building in Capital City",
        img: { kind: "catalog", imgType: "shipyard", invert: true },
      }
    ],
  },
  {
    id: "lg_30",
    name: "Gelatin Sizing",
    column: 9,
    required: ["lg_26", "lg_27"],
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
      {
        title: "Domestic Farm",
        desc: "Allows constructing 1 more Domestic Farm building in Capital City",
        img: { kind: "catalog", imgType: "barn", invert: true },
      },
      {
        title: "Domestic Farm",
        desc: "Unlocks a Domestic Farm upgrade",
        img: { kind: "wiki", imageName: "Capital_Domestic_Farm_Lv", level: 42 },
      }
    ],
  },
  {
    id: "lg_31",
    name: "Covered Sewers",
    column: 9,
    required: ["lg_27", "lg_28"],
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
      {
        title: "Little Culture Site",
        desc: "Unlocks a Little Culture Site upgrade",
        img: { kind: "wiki", imageName: "Capital_Little_Culture_Site_Lv", level: 14 },
      },
      {
        title: "Little Culture Site",
        desc: "Allows constructing 1 more Little Culture Site building in Capital City",
        img: { kind: "catalog", imgType: "cultureSite", invert: true },
      }
    ],
  },
  {
    id: "lg_32",
    name: "Log Line and Sandglass",
    column: 9,
    required: ["lg_28", "lg_29"],
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
      {
        title: "Ottoman Empire Ship",
        desc: "Unlocks a Ottoman Empire Ship upgrade",
        img: { kind: "wiki", imageName: "Ottoman_Empire_Ship_Lv", level: 4 },
      },
      {
        title: "2 Trade City Diamond Upgrade Keys",
        desc: "Gives you 2 Trade City Diamond Upgrade Keys",
        img: { kind: "local", path: "/images/goods/trade_city_diamond_upkey.webp" },
      },
      {
        title: "Shipyard",
        desc: "Allows constructing 1 more Shipyard building in Capital City",
        img: { kind: "catalog", imgType: "shipyard", invert: true },
      }
    ],
  },
  {
    id: "lg_33",
    name: "City Watch",
    column: 10,
    required: ["lg_30"],
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
      {
        title: "25,000 Aspers",
        desc: "Gives you 25,000 Aspers",
        img: { kind: "local", path: "/images/goods-large/asper.webp" },
      },
      {
        title: "Average Home",
        desc: "Unlocks a Average Home upgrade",
        img: { kind: "wiki", imageName: "Capital_Average_Home_Lv", level: 42 },
      }
    ],
  },
  {
    id: "lg_34",
    name: "Field Artillery",
    column: 10,
    required: ["lg_30", "lg_31"],
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
    rewards: [
      {
        title: "Siege Barracks",
        desc: "Unlocks a Siege Barracks upgrade",
        img: { kind: "wiki", imageName: "Capital_Siege_Barracks_Lv", level: 14 },
      }
    ],
  },
  {
    id: "lg_35",
    name: "Windmill Automation",
    column: 10,
    required: ["lg_30", "lg_31"],
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
      {
        title: "Moderate Culture Site",
        desc: "Allows constructing 1 more Moderate Culture Site building in Capital City",
        img: { kind: "catalog", imgType: "cultureSite", invert: true },
      },
      {
        title: "Rural Farm",
        desc: "Unlocks a Rural Farm upgrade",
        img: { kind: "wiki", imageName: "Capital_Rural_Farm_Lv", level: 42 },
      }
    ],
  },
  {
    id: "lg_36",
    name: "Guild Halls",
    column: 10,
    required: ["lg_31", "lg_32"],
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
      {
        title: "Lighthouse",
        desc: "Allows constructing 1 more Lighthouse building in Capital City",
        img: { kind: "catalog", imgType: "shipyard", invert: true },
      },
      {
        title: "4 Trade Village Advanced Upgrade Keys",
        desc: "Gives you 4 Trade Village Advanced Upgrade Keys",
        img: { kind: "local", path: "/images/goods/trade_village_advanced_upkey.webp" },
      },
      {
        title: "Seafarer House",
        desc: "Allows constructing 1 more Seafarer House building in Capital City",
        img: { kind: "catalog", imgType: "sailorHome", invert: true },
      }
    ],
  },
  {
    id: "lg_37",
    name: "Came Glasswork",
    column: 11,
    required: ["lg_33", "lg_34"],
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
      {
        title: "Large Culture Site",
        desc: "Unlocks a Large Culture Site upgrade",
        img: { kind: "wiki", imageName: "Capital_Large_Culture_Site_Lv", level: 14 },
      },
      {
        title: "Primary Workshop",
        desc: "Allows constructing 1 more Primary Workshop buildings in Capital City",
        img: { kind: "catalog", imgType: "workshop", invert: true },
      }
    ],
  },
  {
    id: "lg_38",
    name: "Hops Cultivation",
    column: 11,
    required: ["lg_35", "lg_36"],
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
      {
        title: "25,000 Aspers",
        desc: "Gives you 25,000 Aspers",
        img: { kind: "local", path: "/images/goods-large/asper.webp" },
      },
      {
        title: "Small Home",
        desc: "Unlocks a Small Home upgrade",
        img: { kind: "wiki", imageName: "Capital_Small_Home_Lv", level: 42 },
      }
    ],
  },
  {
    id: "lg_39",
    name: "Letters of Credit",
    column: 11,
    required: ["lg_36"],
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
      {
        title: "Common Warehouse",
        desc: "Allows constructing 1 more Common Warehouse building in Capital City",
        img: { kind: "catalog", imgType: "warehouse", invert: true },
      },
      {
        title: "4 Trade City Advanced Upgrade Keys",
        desc: "Gives you 4 Trade City Advanced Upgrade Keys",
        img: { kind: "local", path: "/images/goods/trade_city_advanced_upkey.webp" },
      },
      {
        title: "4 Trade Village Advanced Upgrade Keys",
        desc: "Gives you 4 Trade City Advanced Upgrade Keys",
        img: { kind: "local", path: "/images/goods/trade_village_advanced_upkey.webp" },
      }
    ],
  },
  {
    id: "lg_40",
    name: "Monte Di Pieta",
    column: 11,
    required: ["lg_36"],
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
      {
        title: "Pier",
        desc: "Allows constructing 1 more Pier building in Capital City",
        img: { kind: "catalog", imgType: "shipyard", invert: true },
      },
      {
        title: "2 Trade City Diamond Upgrade Keys",
        desc: "Gives you 2 Trade City Diamond Upgrade Keys",
        img: { kind: "local", path: "/images/goods/trade_city_diamond_upkey.webp" },
      },
      {
        title: "4 Trade Village Advanced Upgrade Keys",
        desc: "Gives you 4 Trade Village Advanced Upgrade Keys",
        img: { kind: "local", path: "/images/goods/trade_village_advanced_upkey.webp" },
      }
    ],
  },
  {
    id: "lg_41",
    name: "Tertiary Good",
    column: 12,
    required: ["lg_37", "lg_38", "lg_39"],
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
      {
        title: "Tertiary Good",
        desc: "Unlocks a Tertiary Good upgrade",
        img: { kind: "good", priority: "tertiary" },
      },
      {
        title: "Tertiary Workshop",
        desc: "Unlocks the Tertiary workshop building",
        img: { kind: "catalog", imgType: "workshop", invert: true },
      }
    ],
  },
  {
    id: "lg_42",
    name: "Treadle Looms",
    column: 12,
    required: ["lg_39", "lg_40"],
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
      {
        title: "Pier",
        desc: "Allows constructing 1 more Pier building in Capital City",
        img: { kind: "catalog", imgType: "shipyard", invert: true },
      },
      {
        title: "2 Trade City Advanced Upgrade Keys",
        desc: "Gives you 2 Trade City Advanced Upgrade Keys",
        img: { kind: "local", path: "/images/goods/trade_city_advanced_upkey.webp" },
      }
    ],
  },
  {
    id: "lg_43",
    name: "Ottoman Empire Consensus",
    column: 13,
    required: ["lg_41", "lg_42"],
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
      {
        title: "1 Wonder Orb",
        desc: "Gives you 1 Wonder Orb",
        img: { kind: "local", path: "/images/technos/features/icon_wonder_orb.webp" },
      },
      {
        title: "100,000 Aspers",
        desc: "Gives you 100,000 Aspers",
        img: { kind: "local", path: "/images/goods-large/asper.webp" },
      }
    ],
  },
];
