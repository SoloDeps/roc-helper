import { CampaignRegion } from "@/types/campaign-types";

export const campaign_CG: CampaignRegion[] = [
  {
    id: "cg_1",
    name: "Borderlands",
    column: 0,
    required: [],
    scout: { coins: 17900, duration: 3900 },
    regionRewards: [
      { resource: "expansion_capital", amount: 1 },
      { resource: "research_points", amount: 2 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 10000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 5000 }],
      },
    ],
  },
  {
    id: "cg_2",
    name: "Monks Ascent",
    column: 1,
    required: ["cg_1"],
    scout: { coins: 19600, duration: 3900 },
    regionRewards: [
      { resource: "expansion_egypt", amount: 1 },
      { resource: "gears", amount: 25 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "deben", amount: 1000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 12000 }],
      },
    ],
  },
  {
    id: "cg_3",
    name: "Vulpine Tracts",
    column: 1,
    required: ["cg_1"],
    scout: { coins: 21400, duration: 3900 },
    regionRewards: [
      { resource: "expansion_capital", amount: 1 },
      { resource: "chest_puzzlepieces", amount: 1 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 5500 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 14000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 6500 }],
      },
    ],
  },
  {
    id: "cg_4",
    name: "Herders Paths",
    column: 2,
    required: ["cg_2"],
    scout: { coins: 23200, duration: 3900 },
    regionRewards: [
      { resource: "expansion_capital", amount: 1 },
      { resource: "gears", amount: 25 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 16000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 7000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 7500 }],
      },
    ],
  },
  {
    id: "cg_5",
    name: "Gods Ascent",
    column: 2,
    required: ["cg_2"],
    scout: { coins: 25000, duration: 4200 },
    regionRewards: [
      { resource: "expansion_egypt", amount: 2 },
      { resource: "research_points", amount: 2 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "deben", amount: 1500 }],
      },
    ],
  },
  {
    id: "cg_6",
    name: "Gates of Hades",
    column: 2,
    required: ["cg_3"],
    scout: { coins: 26800, duration: 4200 },
    regionRewards: [{ resource: "research_points", amount: 15 }],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 8000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 18000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 8500 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 20000 }],
      },
    ],
  },
  {
    id: "cg_7",
    name: "Frozen Hinterland",
    column: 3,
    required: ["cg_4", "cg_5", "cg_6"],
    scout: { coins: 28600, duration: 4200 },
    regionRewards: [
      { resource: "expansion_capital", amount: 1 },
      { resource: "gears", amount: 25 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 7000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 9000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 22000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 10000 }],
      },
    ],
  },
  {
    id: "cg_8",
    name: "Grizzly Wilds",
    column: 4,
    required: ["cg_7"],
    scout: { coins: 30400, duration: 4200 },
    regionRewards: [
      { resource: "expansion_egypt", amount: 1 },
      { resource: "gears", amount: 25 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "deben", amount: 2000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "deben", amount: 2500 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 11000 }],
      },
    ],
  },
  {
    id: "cg_9",
    name: "Burning Lands",
    column: 4,
    required: ["cg_7"],
    scout: { coins: 32100, duration: 4200 },
    regionRewards: [
      { resource: "expansion_capital", amount: 1 },
      { resource: "chest_puzzlepieces", amount: 1 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 24000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 12000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 26000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 13000 }],
      },
    ],
  },
  {
    id: "cg_10",
    name: "Antler Veld",
    column: 4,
    required: ["cg_7"],
    scout: { coins: 33900, duration: 4500 },
    regionRewards: [
      { resource: "expansion_egypt", amount: 1 },
      { resource: "gears", amount: 25 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 28000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 14000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 30000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 15000 }],
      },
    ],
  },
  {
    id: "cg_11",
    name: "Great Expanse",
    column: 5,
    boss: true,
    required: ["cg_8", "cg_9"],
    scout: { coins: 35700, duration: 4500 },
    regionRewards: [
      { resource: "expansion_egypt", amount: 1 },
      { resource: "commander_leonidas", amount: 1, name: "Commander Leonidas" },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 19000 }],
      },
    ],
  },
  {
    id: "cg_12",
    name: "Stormy Outback",
    column: 5,
    required: ["cg_10"],
    scout: { coins: 37500, duration: 4500 },
    regionRewards: [
      { resource: "expansion_egypt", amount: 1 },
      { resource: "expansion_capital", amount: 1 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "deben", amount: 3500 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 19500 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "deben", amount: 4500 }],
      },
    ],
  },
  {
    id: "cg_13",
    name: "Sultry Wilderness",
    column: 6,
    required: ["cg_11", "cg_12"],
    scout: { coins: 39300, duration: 4500 },
    regionRewards: [
      { resource: "expansion_egypt", amount: 2 },
      { resource: "gears", amount: 25 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 32000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 20000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 34000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "deben", amount: 2100 }],
      },
    ],
  },
  {
    id: "cg_14",
    name: "Christy's Creek",
    column: 7,
    required: ["cg_13"],
    scout: { coins: 41100, duration: 4800 },
    regionRewards: [
      { resource: "expansion_egypt", amount: 1 },
      { resource: "chest_puzzlepieces", amount: 1 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "deben", amount: 6000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 23000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 36000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 24000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "deben", amount: 7000 }],
      },
    ],
  },
  {
    id: "cg_15",
    name: "Ocean Outlook",
    column: 7,
    required: ["cg_13"],
    scout: { coins: 42900, duration: 4800 },
    regionRewards: [
      { resource: "expansion_egypt", amount: 1 },
      { resource: "expansion_capital", amount: 1 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 25000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "deben", amount: 8000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 38000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "deben", amount: 9000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 30000 }],
      },
    ],
  },
  {
    id: "cg_16",
    name: "Empires Reach",
    column: 8,
    boss: true,
    required: ["cg_14", "cg_15"],
    scout: { coins: 44600, duration: 4800 },
    regionRewards: [{ resource: "expansion_egypt", amount: 2 }],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 25000 }],
      },
    ],
  },
];
