import { CampaignRegion } from "@/types/campaign-types";

export const campaign_HM: CampaignRegion[] = [
  {
    id: "hm_1",
    name: "Desert Wharf",
    column: 0,
    required: [],
    scout: { coins: 1000000, duration: 14400 },
    regionRewards: [
      { resource: "expansion_arabia", amount: 2 },
      { resource: "research_points", amount: 3 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 350000 }],
      },
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "food", amount: 220000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "dirham", amount: 10000 }],
      },
      {
        type: ["negotiation"],
        rewards: [{ resource: "coins", amount: 300000 }],
      },
    ],
  },
  {
    id: "hm_2",
    name: "City of Sabra",
    column: 1,
    required: ["hm_1"],
    scout: { coins: 1100000, duration: 14400 },
    regionRewards: [
      { resource: "expansion_arabia", amount: 1 },
      { resource: "expansion_capital", amount: 1 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "dirham", amount: 11000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 120000 }],
      },
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "dirham", amount: 14000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "coins", amount: 230000 }],
      },
      {
        type: ["negotiation"],
        rewards: [{ resource: "food", amount: 200000 }],
      },
    ],
  },
  {
    id: "hm_3",
    name: "Monolith Valley",
    column: 2,
    required: ["hm_2"],
    scout: { coins: 1100000, duration: 14400 },
    regionRewards: [
      { resource: "expansion_arabia", amount: 2 },
      { resource: "research_points", amount: 4 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 240000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 300000 }],
      },
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "dirham", amount: 7000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "food", amount: 180000 }],
      },
      {
        type: ["negotiation"],
        rewards: [{ resource: "dirham", amount: 7500 }],
      },
    ],
  },
  {
    id: "hm_4",
    name: "Desert's Edge",
    column: 2,
    required: ["hm_2"],
    scout: { coins: 1100000, duration: 14400 },
    regionRewards: [
      { resource: "expansion_arabia", amount: 1 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 180000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 215000 }],
      },
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "dirham", amount: 9500 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "coins", amount: 220000 }],
      },
    ],
  },
  {
    id: "hm_5",
    name: "Sea of Sand",
    column: 3,
    required: ["hm_3"],
    scout: { coins: 1100000, duration: 14400 },
    regionRewards: [
      { resource: "expansion_arabia", amount: 3 },
      { resource: "gears", amount: 200 },
    ],
    parts: [
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "food", amount: 170000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 115000 }],
      },
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "dirham", amount: 10000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "coins", amount: 180000 }],
      },
      {
        type: ["negotiation"],
        rewards: [{ resource: "food", amount: 215000 }],
      },
    ],
  },
  {
    id: "hm_6",
    name: "Crystal Mountains",
    column: 3,
    required: ["hm_4"],
    scout: { coins: 1100000, duration: 14400 },
    regionRewards: [
      { resource: "expansion_arabia", amount: 2 },
      { resource: "gears", amount: 200 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "dirham", amount: 11000 }],
      },
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "coins", amount: 370000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "dirham", amount: 11000 }],
      },
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "food", amount: 125000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "dirham", amount: 11000 }],
      },
    ],
  },
  {
    id: "hm_7",
    name: "Caravan Passage",
    column: 4,
    required: ["hm_5", "hm_6"],
    scout: { coins: 1100000, duration: 14400 },
    regionRewards: [
      { resource: "expansion_arabia", amount: 1 },
      { resource: "expansion_capital", amount: 1 },
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
        rewards: [{ resource: "dirham", amount: 8700 }],
      },
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "coins", amount: 335000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "dirham", amount: 8500 }],
      },
    ],
  },
  {
    id: "hm_8",
    name: "Old Tamanrasset",
    column: 5,
    required: ["hm_7"],
    scout: { coins: 1200000, duration: 14400 },
    regionRewards: [
      { resource: "expansion_arabia", amount: 2 },
      { resource: "gears", amount: 300 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 140000 }],
      },
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "dirham", amount: 7000 }],
      },
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "coins", amount: 310000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 140000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "dirham", amount: 12000 }],
      },
    ],
  },
  {
    id: "hm_9",
    name: "Bandit Cliffs",
    column: 5,
    required: ["hm_7"],
    scout: { coins: 1200000, duration: 14400 },
    regionRewards: [
      { resource: "expansion_arabia", amount: 2 },
      { resource: "research_points", amount: 5 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 330000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "dirham", amount: 11000 }],
      },
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "food", amount: 115000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "dirham", amount: 7000 }],
      },
    ],
  },
  {
    id: "hm_10",
    name: "Zerzura's Secret",
    column: 6,
    required: ["hm_8"],
    scout: { coins: 1200000, duration: 14400 },
    regionRewards: [
      { resource: "expansion_arabia", amount: 2 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 115000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "dirham", amount: 10000 }],
      },
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "coins", amount: 180000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "dirham", amount: 10000 }],
      },
      {
        type: ["combat_waves", "negotiation"],
        rewards: [{ resource: "food", amount: 100000 }],
      },
    ],
  },
  {
    id: "hm_11",
    name: "Seaside Shelter",
    column: 6,
    required: ["hm_9"],
    scout: { coins: 1200000, duration: 14400 },
    regionRewards: [
      { resource: "expansion_arabia", amount: 2 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "dirham", amount: 6000 }],
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
        rewards: [{ resource: "dirham", amount: 7800 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "coins", amount: 250000 }],
      },
    ],
  },
  {
    id: "hm_12",
    name: "Green Oasis",
    column: 7,
    required: ["hm_10"],
    scout: { coins: 1200000, duration: 14400 },
    regionRewards: [
      { resource: "expansion_arabia", amount: 2 },
      { resource: "research_points", amount: 5 },
    ],
    parts: [
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "dirham", amount: 7000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 215000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "dirham", amount: 10000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 330000 }],
      },
      {
        type: ["combat_waves", "negotiation"],
        rewards: [{ resource: "food", amount: 220000 }],
      },
    ],
  },
  {
    id: "hm_13",
    name: "Barbarossa's Gate",
    column: 7,
    required: ["hm_11"],
    scout: { coins: 1200000, duration: 14400 },
    regionRewards: [
      { resource: "expansion_arabia", amount: 2 },
      { resource: "research_points", amount: 5 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "dirham", amount: 10000 }],
      },
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "food", amount: 215000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "dirham", amount: 10000 }],
      },
      {
        type: ["combat_waves", "negotiation"],
        rewards: [{ resource: "coins", amount: 330000 }],
      },
    ],
  },
  {
    id: "hm_14",
    name: "Old Caliphate Palace",
    column: 8,
    required: ["hm_12", "hm_13"],
    scout: { coins: 1300000, duration: 43200 },
    boss: true,
    regionRewards: [
      { resource: "expansion_arabia", amount: 2 },
      { resource: "gears", amount: 300 },
      { resource: "wonder_orb", amount: 1 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 200000 }],
      },
    ],
  },
  {
    id: "hm_15",
    name: "Harbor Path",
    column: 9,
    required: ["hm_14"],
    scout: { coins: 1400000, duration: 14400 },
    regionRewards: [
      { resource: "expansion_arabia", amount: 2 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 115000 }],
      },
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "dirham", amount: 8000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 330000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "dirham", amount: 10000 }],
      },
      {
        type: ["negotiation"],
        rewards: [{ resource: "food", amount: 175000 }],
      },
    ],
  },
  {
    id: "hm_16",
    name: "Path of Good Hope",
    column: 9,
    required: ["hm_14"],
    scout: { coins: 1400000, duration: 14400 },
    regionRewards: [
      { resource: "expansion_arabia", amount: 2 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "dirham", amount: 8000 }],
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
        rewards: [{ resource: "dirham", amount: 11000 }],
      },
      {
        type: ["negotiation"],
        rewards: [{ resource: "coins", amount: 300000 }],
      },
    ],
  },
  {
    id: "hm_17",
    name: "Toppled Mountains",
    column: 10,
    required: ["hm_15", "hm_16"],
    scout: { coins: 1400000, duration: 14400 },
    regionRewards: [
      { resource: "expansion_arabia", amount: 1 },
      { resource: "expansion_capital", amount: 1 },
      { resource: "gears", amount: 400 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "dirham", amount: 7500 }],
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
        rewards: [{ resource: "dirham", amount: 11000 }],
      },
      {
        type: ["negotiation"],
        rewards: [{ resource: "coins", amount: 300000 }],
      },
    ],
  },
  {
    id: "hm_18",
    name: "Valley of Bones",
    column: 11,
    required: ["hm_17"],
    scout: { coins: 1400000, duration: 14400 },
    regionRewards: [
      { resource: "expansion_arabia", amount: 2 },
      { resource: "research_points", amount: 7 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "dirham", amount: 8500 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 250000 }],
      },
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "dirham", amount: 8000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "food", amount: 175000 }],
      },
      {
        type: ["negotiation"],
        rewards: [{ resource: "dirham", amount: 10500 }],
      },
    ],
  },
  {
    id: "hm_19",
    name: "Nugget Hills",
    column: 12,
    required: ["hm_18"],
    scout: { coins: 1400000, duration: 14400 },
    regionRewards: [
      { resource: "expansion_arabia", amount: 2 },
      { resource: "gears", amount: 300 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 230000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 220000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "dirham", amount: 8500 }],
      },
      {
        type: ["combat_waves", "negotiation"],
        rewards: [{ resource: "coins", amount: 200000 }],
      },
      {
        type: ["negotiation"],
        rewards: [{ resource: "dirham", amount: 10000 }],
      },
    ],
  },
  {
    id: "hm_20",
    name: "Diamond Valley",
    column: 12,
    required: ["hm_18"],
    scout: { coins: 1500000, duration: 14400 },
    regionRewards: [
      { resource: "expansion_arabia", amount: 2 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 170000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "dirham", amount: 12000 }],
      },
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "coins", amount: 350000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "food", amount: 170000 }],
      },
      {
        type: ["negotiation"],
        rewards: [{ resource: "dirham", amount: 10000 }],
      },
    ],
  },
  {
    id: "hm_21",
    name: "Flamingo River",
    column: 13,
    required: ["hm_20"],
    scout: { coins: 1500000, duration: 14400 },
    regionRewards: [
      { resource: "expansion_arabia", amount: 2 },
      { resource: "gears", amount: 300 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 280000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "dirham", amount: 10000 }],
      },
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "food", amount: 125000 }],
      },
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "dirham", amount: 11000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "coins", amount: 240000 }],
      },
    ],
  },
  {
    id: "hm_22",
    name: "Old Roman Castrum",
    column: 13,
    required: ["hm_19"],
    scout: { coins: 1500000, duration: 14400 },
    regionRewards: [
      { resource: "expansion_arabia", amount: 2 },
    ],
    parts: [
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "food", amount: 190000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "dirham", amount: 10000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 330000 }],
      },
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "dirham", amount: 10000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "food", amount: 186000 }],
      },
    ],
  },
  {
    id: "hm_23",
    name: "Al Wadi",
    column: 14,
    required: ["hm_21", "hm_22"],
    scout: { coins: 1500000, duration: 14400 },
    regionRewards: [
      { resource: "expansion_arabia", amount: 1 },
      { resource: "expansion_capital", amount: 1 },
      { resource: "research_points", amount: 8 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "dirham", amount: 10000 }],
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
        rewards: [{ resource: "dirham", amount: 10000 }],
      },
      {
        type: ["combat_waves", "negotiation"],
        rewards: [{ resource: "coins", amount: 330000 }],
      },
    ],
  },
  {
    id: "hm_24",
    name: "Singing Mountains",
    column: 15,
    required: ["hm_23"],
    scout: { coins: 1500000, duration: 14400 },
    regionRewards: [
      { resource: "expansion_arabia", amount: 2 },
      { resource: "research_points", amount: 10 },
    ],
    parts: [
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "dirham", amount: 8000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 140000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "dirham", amount: 10000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 280000 }],
      },
      {
        type: ["combat_waves", "negotiation"],
        rewards: [{ resource: "food", amount: 220000 }],
      },
    ],
  },
  {
    id: "hm_25",
    name: "Raqqada City",
    column: 15,
    required: ["hm_23"],
    scout: { coins: 1500000, duration: 14400 },
    regionRewards: [
      { resource: "expansion_arabia", amount: 2 },
      { resource: "research_points", amount: 10 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "dirham", amount: 7500 }],
      },
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "coins", amount: 200000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "dirham", amount: 9000 }],
      },
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "food", amount: 180000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "dirham", amount: 10000 }],
      },
    ],
  },
  {
    id: "hm_26",
    name: "Raqqada Palace",
    column: 16,
    required: ["hm_24", "hm_25"],
    scout: { coins: 1500000, duration: 43200 },
    boss: true,
    regionRewards: [
      { resource: "expansion_arabia", amount: 1 },
      { resource: "gears", amount: 400 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 250000 }],
      },
    ],
  }
];
