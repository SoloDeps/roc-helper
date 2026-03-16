import { CampaignRegion } from "@/types/campaign-types";

export const campaign_SA: CampaignRegion[] = [
  {
    id: "sa_1",
    name: "Verdant Shore",
    column: 0,
    required: [],
    scout: { coins: 0, duration: 0 },
    regionRewards: [
      { resource: "expansion_capital", amount: 1 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 150 }],
      },
    ],
  },
  {
    id: "sa_2",
    name: "Razorback Plains",
    column: 1,
    required: ["sa_1"],
    scout: { coins: 10, duration: 10 },
    regionRewards: [
      { resource: "expansion_capital", amount: 1 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 200 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 150 }],
      },
    ],
  },
  {
    id: "sa_3",
    name: "Howling Lands",
    column: 2,
    required: ["sa_2"],
    scout: { coins: 30, duration: 60 },
    regionRewards: [
      { resource: "expansion_capital", amount: 2 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 180 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 500 }],
      },
    ],
  },
  {
    id: "sa_4",
    name: "Wulver's Rapids",
    column: 3,
    required: ["sa_3"],
    scout: { coins: 80, duration: 120 },
    regionRewards: [
      { resource: "expansion_capital", amount: 2 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 200 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 1000 }],
      },
    ],
  },
  {
    id: "sa_5",
    name: "Sabertooth Ford",
    column: 4,
    required: ["sa_4"],
    scout: { coins: 250, duration: 600 },
    regionRewards: [
      { resource: "expansion_capital", amount: 1 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 500 }],
      },
    ],
  },
  {
    id: "sa_6",
    name: "Rolling Meadows",
    column: 5,
    required: ["sa_5"],
    scout: { coins: 430, duration: 900 },
    regionRewards: [
      { resource: "coins", amount: 750 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 550 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 1500 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 650 }],
      },
    ],
  },
  {
    id: "sa_7",
    name: "Grassy Pastures",
    column: 6,
    required: ["sa_6"],
    scout: { coins: 1000, duration: 1200 },
    regionRewards: [
      { resource: "research_points", amount: 1 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 2000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 700 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 2500 }],
      },
    ],
  },
  {
    id: "sa_8",
    name: "The Foothills",
    column: 7,
    required: ["sa_7"],
    scout: { coins: 2000, duration: 1500 },
    regionRewards: [
      { resource: "food", amount: 1000 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 750 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 3500 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 800 }],
      },
    ],
  },
  {
    id: "sa_9",
    name: "Grok's Domain",
    column: 8,
    boss: true,
    required: ["sa_8"],
    scout: { coins: 3000, duration: 1800 },
    regionRewards: [
      { resource: "expansion_capital", amount: 1 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 850 }],
      },
    ],
  }
];
