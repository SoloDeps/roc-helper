import { CampaignRegion } from "@/types/campaign-types";

export const campaign_EG: CampaignRegion[] = [
  {
    id: "eg_1",
    name: "Ionian Coast",
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
    id: "eg_2",
    name: "Dyrrachion Plains",
    column: 1,
    required: ["eg_1"],
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
    id: "eg_3",
    name: "New Rumelia",
    column: 2,
    required: ["eg_2"],
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
    id: "eg_4",
    name: "White River",
    column: 3,
    required: ["eg_2", "eg_3"],
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
    id: "eg_5",
    name: "Nestos River",
    column: 4,
    required: ["eg_4"],
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
    id: "eg_6",
    name: "Rila Mountains",
    column: 4,
    required: ["eg_4"],
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
    id: "eg_7",
    name: "Rhodope Mountains",
    column: 5,
    required: ["eg_5"],
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
    id: "eg_8",
    name: "Mountain",
    column: 5,
    required: ["eg_6"],
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
    id: "eg_9",
    name: "Drina River",
    column: 6,
    required: ["eg_7", "eg_8"],
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
    id: "eg_10",
    name: "Illyria",
    column: 7,
    required: ["eg_9"],
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
    id: "eg_11",
    name: "Old Thrace",
    column: 7,
    required: ["eg_9"],
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
    id: "eg_12",
    name: "Lion's Heart",
    column: 8,
    required: ["eg_10", "eg_11"],
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
    id: "eg_13",
    name: "Central Borderland",
    column: 9,
    required: ["eg_12"],
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
    id: "eg_14",
    name: "The Carpathians",
    column: 10,
    required: ["eg_13"],
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
    id: "eg_15",
    name: "Wallachia",
    column: 10,
    required: ["eg_13"],
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
    id: "eg_16",
    name: "Deliblato Sands",
    column: 11,
    required: ["eg_14", "eg_15"],
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
    id: "eg_17",
    name: "Transylvania",
    column: 12,
    required: ["eg_16"],
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
    id: "eg_18",
    name: "Lake of the East",
    column: 12,
    required: ["eg_16"],
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
    id: "eg_19",
    name: "Sunrise Lands",
    column: 13,
    required: ["eg_17", "eg_18"],
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
    id: "eg_20",
    name: "Black River",
    column: 14,
    required: ["eg_19"],
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
    id: "eg_21",
    name: "Nikaia Plateau",
    column: 14,
    required: ["eg_19"],
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
    id: "eg_22",
    name: "Karaca Hisar",
    column: 15,
    required: ["eg_20"],
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
    id: "eg_23",
    name: "Marmara River",
    column: 15,
    required: ["eg_21"],
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
    id: "eg_24",
    name: "Pilgrim's Road",
    column: 16,
    required: ["eg_22", "eg_23"],
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
    id: "eg_25",
    name: "Willow City",
    column: 17,
    required: ["eg_24"],
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
