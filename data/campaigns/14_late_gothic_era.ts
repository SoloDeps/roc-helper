import { CampaignRegion } from "@/types/campaign-types";

export const campaign_LG: CampaignRegion[] = [
  {
    id: "lg_1",
    name: "Bavermark",
    column: 0,
    required: [],
    scout: { coins: 1500000, duration: 16200 },
    regionRewards: [
      { resource: "expansion_capital_harbor", amount: 1 },
      { resource: "research_points", amount: 5 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "aspers", amount: 7000 }],
      },
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "aspers", amount: 8000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "aspers", amount: 9000 }],
      },
      {
        type: ["negotiation"],
        rewards: [{ resource: "aspers", amount: 10000 }],
      },
    ],
  },
  {
    id: "lg_2",
    name: "Granite Marches",
    column: 1,
    required: ["lg_1"],
    scout: { coins: 1600000, duration: 16200 },
    regionRewards: [
      { resource: "expansion_capital_harbor", amount: 1 },
      { resource: "research_points", amount: 5 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "aspers", amount: 10000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 150000 }],
      },
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "aspers", amount: 14000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "coins", amount: 250000 }],
      },
      {
        type: ["negotiation"],
        rewards: [{ resource: "aspers", amount: 14000 }],
      },
    ],
  },
  {
    id: "lg_3",
    name: "Vorarl Crownlands",
    column: 2,
    required: ["lg_2"],
    scout: { coins: 1600000, duration: 16200 },
    regionRewards: [
      { resource: "trading_culture_ottomanempire", amount: 1 },
      { resource: "research_points", amount: 5 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "aspers", amount: 15000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 300000 }],
      },
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "aspers", amount: 10000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "food", amount: 200000 }],
      },
      {
        type: ["negotiation"],
        rewards: [{ resource: "aspers", amount: 12000 }],
      },
    ],
  },
  {
    id: "lg_4",
    name: "Ironbridge Crossing",
    column: 3,
    required: ["lg_3"],
    scout: { coins: 1600000, duration: 16200 },
    regionRewards: [
      { resource: "expansion_capital", amount: 1 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 200000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 220000 }],
      },
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "aspers", amount: 12000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "aspers", amount: 12000 }],
      },
    ],
  },
  {
    id: "lg_5",
    name: "Wipptal March",
    column: 4,
    required: ["lg_4"],
    scout: { coins: 1600000, duration: 16200 },
    regionRewards: [
      { resource: "expansion_capital_harbor", amount: 1 },
      { resource: "gears", amount: 200 },
    ],
    parts: [
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "food", amount: 200000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "aspers", amount: 12000 }],
      },
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "aspers", amount: 14000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "coins", amount: 200000 }],
      },
      {
        type: ["negotiation"],
        rewards: [{ resource: "food", amount: 220000 }],
      },
    ],
  },
  {
    id: "lg_6",
    name: "Enns County",
    column: 4,
    required: ["lg_4"],
    scout: { coins: 1600000, duration: 16200 },
    regionRewards: [
      { resource: "trading_culture_ottomanempire", amount: 1 },
      { resource: "gears", amount: 200 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "aspers", amount: 12000 }],
      },
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "coins", amount: 350000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "aspers", amount: 15000 }],
      },
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "food", amount: 150000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "aspers", amount: 14000 }],
      },
    ],
  },
  {
    id: "lg_7",
    name: "Hinterwald",
    column: 5,
    required: ["lg_5"],
    scout: { coins: 1600000, duration: 16200 },
    regionRewards: [
      { resource: "expansion_capital_harbor", amount: 1 },
      { resource: "research_points", amount: 5 },
    ],
    parts: [
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "coins", amount: 340000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 125000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "aspers", amount: 12000 }],
      },
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "aspers", amount: 15000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "aspers", amount: 12000 }],
      },
    ],
  },
  {
    id: "lg_8",
    name: "Argenti Valley",
    column: 5,
    required: ["lg_6"],
    scout: { coins: 1700000, duration: 16200 },
    regionRewards: [
      { resource: "trading_culture_ottomanempire", amount: 1 },
      { resource: "research_points", amount: 5 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 140000 }],
      },
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "aspers", amount: 12000 }],
      },
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "coins", amount: 310000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "aspers", amount: 15000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "aspers", amount: 12000 }],
      },
    ],
  },
  {
    id: "lg_9",
    name: "Silverhorn Peaks",
    column: 6,
    required: ["lg_7", "lg_8"],
    scout: { coins: 1700000, duration: 16200 },
    regionRewards: [
      { resource: "expansion_capital", amount: 1 },
      { resource: "gears", amount: 300 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 330000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "aspers", amount: 11000 }],
      },
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "food", amount: 115000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "aspers", amount: 12000 }],
      },
    ],
  },
  {
    id: "lg_10",
    name: "Blackpine Reach",
    column: 7,
    required: ["lg_9"],
    scout: { coins: 1700000, duration: 16200 },
    regionRewards: [
      { resource: "expansion_capital_harbor", amount: 1 },
      { resource: "research_points", amount: 5 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 115000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "aspers", amount: 15000 }],
      },
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "coins", amount: 180000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "aspers", amount: 15000 }],
      },
      {
        type: ["combat_waves", "negotiation"],
        rewards: [{ resource: "aspers", amount: 18000 }],
      },
    ],
  },
  {
    id: "lg_11",
    name: "Swabian Downs",
    column: 7,
    required: ["lg_9"],
    scout: { coins: 1700000, duration: 16200 },
    regionRewards: [
      { resource: "trading_culture_ottomanempire", amount: 1 },
      { resource: "research_points", amount: 5 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "aspers", amount: 12000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 265000 }],
      },
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "food", amount: 185000 }],
      },
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "aspers", amount: 15000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "aspers", amount: 18000 }],
      },
    ],
  },
  {
    id: "lg_12",
    name: "Region of Aargau",
    column: 8,
    required: ["lg_10", "lg_11"],
    scout: { coins: 1700000, duration: 43200 },
    boss: true,
    regionRewards: [
      { resource: "expansion_capital_harbor", amount: 1 },
      { resource: "gears", amount: 300 },
      { resource: "wonder_orb", amount: 1 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "aspers", amount: 25000 }],
      },
    ],
  },
  {
    id: "lg_13",
    name: "Jura Heights",
    column: 9,
    required: ["lg_12"],
    scout: { coins: 1800000, duration: 16200 },
    regionRewards: [
      { resource: "trading_culture_ottomanempire", amount: 1 },
      { resource: "expansion_capital", amount: 1 },
      { resource: "gears", amount: 300 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "aspers", amount: 10000 }],
      },
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "food", amount: 215000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "aspers", amount: 10000 }],
      },
      {
        type: ["combat_waves", "negotiation"],
        rewards: [{ resource: "coins", amount: 330000 }],
      },
    ],
  },
  {
    id: "lg_14",
    name: "Falconburg",
    column: 10,
    required: ["lg_13"],
    scout: { coins: 1800000, duration: 16200 },
    regionRewards: [
      { resource: "expansion_capital_harbor", amount: 1 },
      { resource: "research_points", amount: 6 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 200000 }],
      },
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "aspers", amount: 15000 }],
      },
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "aspers", amount: 18000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 330000 }],
      },
      {
        type: ["combat_waves", "negotiation"],
        rewards: [{ resource: "aspers", amount: 20000 }],
      },
    ],
  },
  {
    id: "lg_15",
    name: "Thurwald",
    column: 10,
    required: ["lg_13"],
    scout: { coins: 1800000, duration: 16200 },
    regionRewards: [
      { resource: "trading_culture_ottomanempire", amount: 1 },
      { resource: "research_points", amount: 6 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 115000 }],
      },
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "aspers", amount: 15000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 330000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "aspers", amount: 18000 }],
      },
      {
        type: ["negotiation"],
        rewards: [{ resource: "aspers", amount: 20000 }],
      },
    ],
  },
  {
    id: "lg_16",
    name: "Wolfsroost Valley",
    column: 11,
    required: ["lg_14", "lg_15"],
    scout: { coins: 1800000, duration: 16200 },
    regionRewards: [
      { resource: "expansion_capital_harbor", amount: 1 },
      { resource: "gears", amount: 300 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "aspers", amount: 15000 }],
      },
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "coins", amount: 190000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 170000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "aspers", amount: 18000 }],
      },
      {
        type: ["negotiation"],
        rewards: [{ resource: "aspers", amount: 20000 }],
      },
    ],
  },
  {
    id: "lg_17",
    name: "Old Roman Ridge",
    column: 12,
    required: ["lg_16"],
    scout: { coins: 1900000, duration: 16200 },
    regionRewards: [
      { resource: "expansion_capital_harbor", amount: 1 },
      { resource: "research_points", amount: 7 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "aspers", amount: 18000 }],
      },
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "coins", amount: 190000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 170000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "aspers", amount: 22000 }],
      },
      {
        type: ["negotiation"],
        rewards: [{ resource: "aspers", amount: 20000 }],
      },
    ],
  },
  {
    id: "lg_18",
    name: "Bernmark",
    column: 12,
    required: ["lg_16"],
    scout: { coins: 1900000, duration: 16200 },
    regionRewards: [
      { resource: "trading_culture_ottomanempire", amount: 1 },
      { resource: "research_points", amount: 7 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "aspers", amount: 20000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 250000 }],
      },
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "aspers", amount: 20000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "food", amount: 175000 }],
      },
      {
        type: ["negotiation"],
        rewards: [{ resource: "aspers", amount: 20000 }],
      },
    ],
  },
  {
    id: "lg_19",
    name: "Lake Lucerne Shore",
    column: 13,
    required: ["lg_17", "lg_18"],
    scout: { coins: 1900000, duration: 16200 },
    regionRewards: [
      { resource: "expansion_capital", amount: 1 },
      { resource: "gears", amount: 300 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 230000 }],
      },
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "food", amount: 220000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "aspers", amount: 20000 }],
      },
      {
        type: ["combat_waves", "negotiation"],
        rewards: [{ resource: "aspers", amount: 20000 }],
      },
    ],
  },
  {
    id: "lg_20",
    name: "Sanktwalden",
    column: 14,
    required: ["lg_19"],
    scout: { coins: 1900000, duration: 16200 },
    regionRewards: [
      { resource: "expansion_capital_harbor", amount: 1 },
      { resource: "research_points", amount: 8 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 170000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "aspers", amount: 20000 }],
      },
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "coins", amount: 350000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "aspers", amount: 20000 }],
      },
      {
        type: ["negotiation"],
        rewards: [{ resource: "aspers", amount: 22000 }],
      },
    ],
  },
  {
    id: "lg_21",
    name: "Lombard Plain",
    column: 14,
    required: ["lg_19"],
    scout: { coins: 2000000, duration: 16200 },
    regionRewards: [
      { resource: "trading_culture_ottomanempire", amount: 1 },
      { resource: "research_points", amount: 8 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 280000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "aspers", amount: 22000 }],
      },
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "food", amount: 125000 }],
      },
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "aspers", amount: 22000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "aspers", amount: 22000 }],
      },
    ],
  },
  {
    id: "lg_22",
    name: "Glaren Fold",
    column: 15,
    required: ["lg_20"],
    scout: { coins: 2000000, duration: 16200 },
    regionRewards: [
      { resource: "expansion_capital_harbor", amount: 1 },
      { resource: "research_points", amount: 10 },
    ],
    parts: [
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "food", amount: 190000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "aspers", amount: 20000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 330000 }],
      },
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "aspers", amount: 22000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "aspers", amount: 22000 }],
      },
    ],
  },
  {
    id: "lg_23",
    name: "Western Crossroads",
    column: 15,
    required: ["lg_21"],
    scout: { coins: 2000000, duration: 16200 },
    regionRewards: [
      { resource: "trading_culture_ottomanempire", amount: 1 },
      { resource: "research_points", amount: 10 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "aspers", amount: 22000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 200000 }],
      },
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "food", amount: 132000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "aspers", amount: 22000 }],
      },
      {
        type: ["combat_waves", "negotiation"],
        rewards: [{ resource: "aspers", amount: 24000 }],
      },
    ],
  },
  {
    id: "lg_24",
    name: "Forcalquier",
    column: 16,
    required: ["lg_22", "lg_23"],
    scout: { coins: 2000000, duration: 16200 },
    regionRewards: [
      { resource: "expansion_capital", amount: 1 },
      { resource: "gears", amount: 300 },
    ],
    parts: [
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "aspers", amount: 25000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 140000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "aspers", amount: 30000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 280000 }],
      },
      {
        type: ["combat_waves", "negotiation"],
        rewards: [{ resource: "aspers", amount: 30000 }],
      },
    ],
  },
  {
    id: "lg_25",
    name: "Provence",
    column: 17,
    required: ["lg_24"],
    scout: { coins: 2000000, duration: 43200 },
    boss: true,
    regionRewards: [
      { resource: "trading_culture_ottomanempire", amount: 1 },
      { resource: "gears", amount: 400 },
      { resource: "wonder_orb", amount: 1 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "aspers", amount: 100000 }],
      },
    ],
  }
];
