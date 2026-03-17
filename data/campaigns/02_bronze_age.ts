import { CampaignRegion } from "@/types/campaign-types";

export const campaign_BA: CampaignRegion[] = [
  {
    id: "ba_1",
    name: "Ravens Valley",
    column: 0,
    required: [],
    scout: { coins: 3400, duration: 2100 },
    regionRewards: [
      { resource: "research_points", amount: 1 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 1100 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 1100 }],
      },
    ],
  },
  {
    id: "ba_2",
    name: "Verdant Ridge",
    column: 1,
    required: ["ba_1"],
    scout: { coins: 4100, duration: 2100 },
    regionRewards: [
      { resource: "expansion_capital", amount: 1 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 1800 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 2700 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 2100 }],
      },
    ],
  },
  {
    id: "ba_3",
    name: "Spearstone Canyon",
    column: 2,
    required: ["ba_2"],
    boss: true,
    scout: { coins: 4900, duration: 2100 },
    regionRewards: [
      { resource: "commander_inanna", amount: 1, name: "Commander Inanna" },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 3200 }],
      },
    ],
  },
  {
    id: "ba_4",
    name: "Rumbling Plateau",
    column: 3,
    required: ["ba_3"],
    scout: { coins: 5900, duration: 2400 },
    regionRewards: [
      { resource: "expansion_capital", amount: 1 },
      { resource: "puzzle_piece", amount: 5 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 2400 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 2800 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 2700 }],
      },
    ],
  },
  {
    id: "ba_5",
    name: "Fang-Toothed Crags",
    column: 3,
    required: ["ba_3"],
    scout: { coins: 7100, duration: 2400 },
    regionRewards: [
      { resource: "research_points", amount: 1 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 3200 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 2300 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 3500 }],
      },
    ],
  },
  {
    id: "ba_6",
    name: "Howling Dunes",
    column: 4,
    required: ["ba_4", "ba_5"],
    scout: { coins: 8200, duration: 2400 },
    regionRewards: [
      { resource: "expansion_capital", amount: 1 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 2600 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 3800 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 2900 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 2900 }],
      },
    ],
  },
  {
    id: "ba_7",
    name: "Riverbed Outlook",
    column: 5,
    required: ["ba_6"],
    scout: { coins: 9800, duration: 2400 },
    regionRewards: [
      { resource: "research_points", amount: 1 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 3600 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 3200 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 3900 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 3900 }],
      },
    ],
  },
  {
    id: "ba_8",
    name: "Fields of the Sun",
    column: 5,
    required: ["ba_6"],
    scout: { coins: 11000, duration: 2700 },
    regionRewards: [
      { resource: "expansion_capital", amount: 1 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 2900 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 4200 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 3100 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 3100 }],
      },
    ],
  },
  {
    id: "ba_9",
    name: "Ancient Outpost",
    column: 6,
    boss: true,
    required: ["ba_7", "ba_8"],
    scout: { coins: 14000, duration: 2700 },
    regionRewards: [
      { resource: "research_points", amount: 2 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 4500 }],
      },
    ],
  },
  {
    id: "ba_10",
    name: "Sacred Frontier",
    column: 7,
    required: ["ba_9"],
    scout: { coins: 16000, duration: 2700 },
    regionRewards: [
      { resource: "expansion_capital", amount: 1 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 5100 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 3800 }],
      },
    ],
  },
  {
    id: "ba_11",
    name: "Northern Coast",
    column: 8,
    required: ["ba_10"],
    scout: { coins: 16000, duration: 2700 },
    regionRewards: [
      { resource: "expansion_capital", amount: 1 },
      { resource: "research_points", amount: 2 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 5400 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 4000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 5700 }],
      },
    ],
  }
];
