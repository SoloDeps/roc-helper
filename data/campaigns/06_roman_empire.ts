import { CampaignRegion } from "@/types/campaign-types";

export const campaign_RE: CampaignRegion[] = [
  {
    id: "re_1",
    name: "Nova Babylon",
    column: 0,
    required: [],
    scout: { coins: 85000, duration: 6300 },
    regionRewards: [
      { resource: "expansion_china", amount: 2 },
      { resource: "research_points", amount: 2 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 70000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 40000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "wu_zhu", amount: 4000 }],
      },
    ],
  },
  {
    id: "re_2",
    name: "Challenger Hills",
    column: 1,
    required: ["re_1"],
    scout: { coins: 93000, duration: 6300 },
    regionRewards: [
      { resource: "expansion_china", amount: 2 },
      { resource: "gears", amount: 25 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "rice", amount: 2500 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 75000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 44000 }],
      },
    ],
  },
  {
    id: "re_3",
    name: "Snowcat Sierra",
    column: 2,
    required: ["re_2"],
    scout: { coins: 102000, duration: 6300 },
    regionRewards: [
      { resource: "expansion_china", amount: 1 },
      { resource: "expansion_capital", amount: 1 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 80000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "wu_zhu", amount: 6000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "rice", amount: 4000 }],
      },
    ],
  },
  {
    id: "re_4",
    name: "Azure Seascape",
    column: 2,
    required: ["re_2"],
    scout: { coins: 110000, duration: 6300 },
    regionRewards: [
      { resource: "expansion_china", amount: 1 },
      { resource: "gears", amount: 25 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 48000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "wu_zhu", amount: 8000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "rice", amount: 5500 }],
      },
    ],
  },
  {
    id: "re_5",
    name: "Calder Outlook",
    column: 3,
    required: ["re_3", "re_4"],
    scout: { coins: 119000, duration: 6600 },
    regionRewards: [
      { resource: "expansion_china", amount: 1 },
      { resource: "expansion_capital", amount: 1 },
      { resource: "research_points", amount: 2 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 85000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 52000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "wu_zhu", amount: 10000 }],
      },
    ],
  },
  {
    id: "re_6",
    name: "Umbral Plateau",
    column: 4,
    required: ["re_5"],
    scout: { coins: 127000, duration: 6600 },
    regionRewards: [
      { resource: "expansion_china", amount: 1 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "rice", amount: 7000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 90000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 56000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 95000 }],
      },
    ],
  },
  {
    id: "re_7",
    name: "Archaic Fields",
    column: 4,
    required: ["re_5"],
    scout: { coins: 136000, duration: 6600 },
    regionRewards: [
      { resource: "expansion_capital", amount: 1 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 60000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 64000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "wu_zhu", amount: 12000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "rice", amount: 8500 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 100000 }],
      },
    ],
  },
  {
    id: "re_8",
    name: "Riders Repose",
    column: 5,
    boss: true,
    required: ["re_6", "re_7"],
    scout: { coins: 144000, duration: 6600 },
    regionRewards: [
      { resource: "expansion_china", amount: 2 },
      { resource: "commander_hannibal", amount: 1, name: "Commander Hannibal" },
      { resource: "gears", amount: 25 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 105000 }],
      },
    ],
  },
  {
    id: "re_9",
    name: "Sunderclaw",
    column: 6,
    required: ["re_8"],
    scout: { coins: 152000, duration: 6900 },
    regionRewards: [
      { resource: "expansion_china", amount: 2 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "wu_zhu", amount: 14000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "rice", amount: 10000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 68000 }],
      },
    ],
  },
  {
    id: "re_10",
    name: "Red Kite Plains",
    column: 7,
    required: ["re_9"],
    scout: { coins: 161000, duration: 6900 },
    regionRewards: [
      { resource: "expansion_china", amount: 1 },
      { resource: "research_points", amount: 2 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 110000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 72000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "wu_zhu", amount: 16000 }],
      },
    ],
  },
  {
    id: "re_11",
    name: "Ice Capped Peaks",
    column: 8,
    required: ["re_10"],
    scout: { coins: 170000, duration: 6900 },
    regionRewards: [
      { resource: "expansion_china", amount: 2 },
      { resource: "gears", amount: 25 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "rice", amount: 11500 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 115000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 76000 }],
      },
    ],
  },
  {
    id: "re_12",
    name: "Sargasso Straits",
    column: 8,
    required: ["re_10"],
    scout: { coins: 178000, duration: 6900 },
    regionRewards: [
      { resource: "expansion_china", amount: 1 },
      { resource: "expansion_capital", amount: 1 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "wu_zhu", amount: 18000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 120000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 80000 }],
      },
    ],
  },
  {
    id: "re_13",
    name: "Yellowbeak Hills",
    column: 9,
    required: ["re_11", "re_12"],
    scout: { coins: 187000, duration: 7200 },
    regionRewards: [
      { resource: "expansion_china", amount: 1 },
      { resource: "gears", amount: 25 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "rice", amount: 13000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "wu_zhu", amount: 20000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 125000 }],
      },
    ],
  },
  {
    id: "re_14",
    name: "Rangers Repose",
    column: 10,
    required: ["re_13"],
    scout: { coins: 195000, duration: 7200 },
    regionRewards: [
      { resource: "expansion_china", amount: 1 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 84000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "rice", amount: 14500 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 130000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 88000 }],
      },
    ],
  },
  {
    id: "re_15",
    name: "Great Forest Rim",
    column: 10,
    required: ["re_13"],
    scout: { coins: 204000, duration: 7200 },
    regionRewards: [
      { resource: "expansion_china", amount: 1 },
      { resource: "research_points", amount: 2 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 135000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "wu_zhu", amount: 22000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 92000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 140000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "rice", amount: 16000 }],
      },
    ],
  },
  {
    id: "re_16",
    name: "Secret Fortress",
    column: 11,
    boss: true,
    required: ["re_14", "re_15"],
    scout: { coins: 212000, duration: 7200 },
    regionRewards: [
      { resource: "expansion_china", amount: 2 },
      { resource: "gears", amount: 25 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 96000 }],
      },
    ],
  }
];
