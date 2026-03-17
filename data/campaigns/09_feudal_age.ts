import { CampaignRegion } from "@/types/campaign-types";

export const campaign_FA: CampaignRegion[] = [
  {
    id: "fa_1",
    name: "Fjord of Chivalry",
    column: 0,
    required: [],
    scout: { coins: 880000, duration: 11880 },
    regionRewards: [
      { resource: "expansion_vikings", amount: 1 },
      { resource: "gears", amount: 25 },
      { resource: "research_points", amount: 7 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 170000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 160000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "coins", amount: 205000 }],
      },
    ],
  },
  {
    id: "fa_2",
    name: "Tintagel Forest",
    column: 1,
    required: ["fa_1"],
    scout: { coins: 830000, duration: 11880 },
    regionRewards: [
      { resource: "expansion_vikings", amount: 2 },
      { resource: "expansion_vikings_water", amount: 1 },
      { resource: "research_points", amount: 2 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "pennies", amount: 3200 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "pennies", amount: 4700 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "pennies", amount: 5200 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "pennies", amount: 2400 }],
      },
    ],
  },
  {
    id: "fa_3",
    name: "Knight's Glade",
    column: 1,
    required: ["fa_1"],
    scout: { coins: 770000, duration: 11880 },
    regionRewards: [
      { resource: "expansion_capital", amount: 1 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 135000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 160000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 165000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "pennies", amount: 5300 }],
      },
    ],
  },
  {
    id: "fa_4",
    name: "Uther's Resting Place",
    column: 2,
    required: ["fa_2"],
    scout: { coins: 740000, duration: 11880 },
    regionRewards: [
      { resource: "expansion_vikings", amount: 2 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "pennies", amount: 3900 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "pennies", amount: 2400 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "pennies", amount: 3000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "coins", amount: 225000 }],
      },
    ],
  },
  {
    id: "fa_5",
    name: "New-Broceliande",
    column: 2,
    required: ["fa_3"],
    scout: { coins: 690000, duration: 11880 },
    regionRewards: [
      { resource: "expansion_vikings", amount: 2 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "pennies", amount: 3300 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "pennies", amount: 3600 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 135000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "coins", amount: 250000 }],
      },
    ],
  },
  {
    id: "fa_6",
    name: "The Green Chapel",
    column: 3,
    required: ["fa_4", "fa_5"],
    scout: { coins: 880000, duration: 11880 },
    regionRewards: [
      { resource: "expansion_vikings", amount: 2 },
      { resource: "research_points", amount: 2 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "pennies", amount: 5300 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 100000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "pennies", amount: 3500 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 255000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "food", amount: 120000 }],
      },
    ],
  },
  {
    id: "fa_7",
    name: "Merlin's Rise",
    column: 4,
    required: ["fa_6"],
    scout: { coins: 750000, duration: 14400 },
    regionRewards: [
      { resource: "expansion_vikings", amount: 1 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "pennies", amount: 2100 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 195000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "pennies", amount: 3300 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 215000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "coins", amount: 145000 }],
      },
    ],
  },
  {
    id: "fa_8",
    name: "The Lady's Lake",
    column: 4,
    required: ["fa_6"],
    scout: { coins: 850000, duration: 14400 },
    regionRewards: [
      { resource: "expansion_capital", amount: 1 },
      { resource: "expansion_vikings_water", amount: 1 },
      { resource: "gears", amount: 25 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 145000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "pennies", amount: 3900 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 105000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 115000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "coins", amount: 215000 }],
      },
    ],
  },
  {
    id: "fa_9",
    name: "Round Table Hold",
    column: 5,
    required: ["fa_7"],
    scout: { coins: 770000, duration: 14400 },
    regionRewards: [
      { resource: "expansion_vikings", amount: 2 },
      { resource: "research_points", amount: 12 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "pennies", amount: 2300 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 120000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "pennies", amount: 3700 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 200000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "food", amount: 145000 }],
      },
    ],
  },
  {
    id: "fa_10",
    name: "Murky Plains",
    column: 5,
    required: ["fa_8"],
    scout: { coins: 700000, duration: 14400 },
    regionRewards: [
      { resource: "expansion_vikings", amount: 2 },
      { resource: "gears", amount: 25 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 200000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "pennies", amount: 5500 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "pennies", amount: 4900 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 115000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "pennies", amount: 4100 }],
      },
    ],
  },
  {
    id: "fa_11",
    name: "Camelot",
    column: 6,
    required: ["fa_9", "fa_10"],
    scout: { coins: 690000, duration: 43200 },
    boss: true,
    regionRewards: [
      { resource: "expansion_vikings", amount: 2 },
      { resource: "expansion_vikings_water", amount: 1 },
    ],
    parts: [
      {
        type: ["combat_waves"],
        rewards: [{ resource: "food", amount: 150000 }],
      },
    ],
  },
  {
    id: "fa_12",
    name: "Dark Lands",
    column: 7,
    required: ["fa_11"],
    scout: { coins: 700000, duration: 14400 },
    regionRewards: [
      { resource: "expansion_vikings", amount: 2 },
      { resource: "expansion_vikings_water", amount: 1 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "pennies", amount: 5400 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 205000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "food", amount: 175000 }],
      },
    ],
  },
  {
    id: "fa_13",
    name: "Deserted Stables",
    column: 8,
    required: ["fa_12"],
    scout: { coins: 860000, duration: 14400 },
    regionRewards: [
      { resource: "expansion_vikings", amount: 2 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "pennies", amount: 5400 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "pennies", amount: 5300 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 205000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "food", amount: 135000 }],
      },
    ],
  },
  {
    id: "fa_14",
    name: "Dingy Forest",
    column: 8,
    required: ["fa_12"],
    scout: { coins: 690000, duration: 14400 },
    regionRewards: [
      { resource: "expansion_capital", amount: 1 },
      { resource: "expansion_vikings", amount: 2 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 195000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "pennies", amount: 4000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 235000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "food", amount: 120000 }],
      },
    ],
  },
  {
    id: "fa_15",
    name: "Dragon Cave",
    column: 9,
    required: ["fa_13"],
    scout: { coins: 640000, duration: 14400 },
    regionRewards: [
      { resource: "expansion_vikings", amount: 2 },
      { resource: "gears", amount: 25 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "pennies", amount: 4300 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 170000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 145000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "coins", amount: 150000 }],
      },
    ],
  },
  {
    id: "fa_16",
    name: "Lancelot's Exile",
    column: 9,
    required: ["fa_14"],
    scout: { coins: 830000, duration: 14400 },
    regionRewards: [
      { resource: "expansion_vikings", amount: 2 },
      { resource: "research_points", amount: 2 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 170000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "pennies", amount: 2000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 180000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "coins", amount: 240000 }],
      },
    ],
  },
  {
    id: "fa_17",
    name: "Ruinous Remains",
    column: 10,
    required: ["fa_15", "fa_16"],
    scout: { coins: 690000, duration: 14400 },
    regionRewards: [
      { resource: "expansion_vikings", amount: 2 },
      { resource: "expansion_vikings_water", amount: 1 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "pennies", amount: 3600 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "pennies", amount: 5100 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 155000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "pennies", amount: 3800 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "pennies", amount: 5000 }],
      },
    ],
  },
  {
    id: "fa_18",
    name: "Forest of the Fae",
    column: 11,
    required: ["fa_17"],
    scout: { coins: 910000, duration: 14400 },
    regionRewards: [
      { resource: "expansion_vikings", amount: 1 },
      { resource: "expansion_vikings_water", amount: 1 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 155000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 105000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "pennies", amount: 4100 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 250000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "pennies", amount: 5200 }],
      },
    ],
  },
  {
    id: "fa_19",
    name: "Mount Gawain",
    column: 11,
    required: ["fa_17"],
    scout: { coins: 630000, duration: 14400 },
    regionRewards: [
      { resource: "expansion_capital", amount: 1 },
      { resource: "expansion_vikings", amount: 1 },
      { resource: "gears", amount: 25 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 140000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "pennies", amount: 2700 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 165000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "pennies", amount: 2400 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "food", amount: 145000 }],
      },
    ],
  },
  {
    id: "fa_20",
    name: "Blackfield",
    column: 12,
    required: ["fa_18"],
    scout: { coins: 610000, duration: 14400 },
    regionRewards: [
      { resource: "expansion_vikings", amount: 1 },
      { resource: "expansion_vikings_water", amount: 1 },
      { resource: "research_points", amount: 2 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "pennies", amount: 1900 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 225000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "pennies", amount: 4100 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 170000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "coins", amount: 235000 }],
      },
    ],
  },
  {
    id: "fa_21",
    name: "Pathway to Avalon",
    column: 12,
    required: ["fa_19"],
    scout: { coins: 1200000, duration: 14400 },
    regionRewards: [
      { resource: "expansion_vikings", amount: 3 },
      { resource: "research_points", amount: 16 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 215000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 145000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 160000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "pennies", amount: 2000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "food", amount: 110000 }],
      },
    ],
  },
  {
    id: "fa_22",
    name: "Mordred's Palace",
    column: 13,
    boss: true,
    required: ["fa_20", "fa_21"],
    scout: { coins: 680000, duration: 86400 },
    regionRewards: [
      { resource: "expansion_vikings", amount: 2 },
      { resource: "expansion_vikings_water", amount: 1 },
    ],
    parts: [
      {
        type: ["combat_waves"],
        rewards: [{ resource: "coins", amount: 180000 }],
      },
    ],
  }
];
