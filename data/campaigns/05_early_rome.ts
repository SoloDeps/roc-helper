import { CampaignRegion } from "@/types/campaign-types";

export const campaign_ER: CampaignRegion[] = [
  {
    id: "er_1",
    name: "Bamboo Valley",
    column: 0,
    required: [],
    scout: { coins: 41000, duration: 5100 },
    regionRewards: [
      { resource: "expansion_capital", amount: 1 },
      { resource: "research_points", amount: 2 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 34000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 22000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 38000 }],
      },
    ],
  },
  {
    id: "er_2",
    name: "Dragon Pass",
    column: 1,
    required: ["er_1"],
    scout: { coins: 45000, duration: 5100 },
    regionRewards: [
      { resource: "expansion_china", amount: 1 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "wu_zhu", amount: 500 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "rice", amount: 200 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 25000 }],
      },
    ],
  },
  {
    id: "er_3",
    name: "Flaxen Steppes",
    column: 2,
    required: ["er_2"],
    scout: { coins: 49000, duration: 5100 },
    regionRewards: [
      { resource: "expansion_china", amount: 1 },
      { resource: "gears", amount: 25 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 42000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "wu_zhu", amount: 1000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "rice", amount: 600 }],
      },
    ],
  },
  {
    id: "er_4",
    name: "Pangolin Bluff",
    column: 2,
    required: ["er_2"],
    scout: { coins: 53000, duration: 5100 },
    regionRewards: [
      { resource: "expansion_capital", amount: 1 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 28000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "wu_zhu", amount: 1500 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "rice", amount: 1000 }],
      },
    ],
  },
  {
    id: "er_5",
    name: "Yeti's Pass",
    column: 3,
    required: ["er_3", "er_4"],
    scout: { coins: 57000, duration: 5400 },
    regionRewards: [
      { resource: "expansion_china", amount: 2 },
      { resource: "research_points", amount: 2 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 46000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 31000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "wu_zhu", amount: 2000 }],
      },
    ],
  },
  {
    id: "er_6",
    name: "Phoenix Lowlands",
    column: 4,
    required: ["er_5"],
    scout: { coins: 61000, duration: 5400 },
    regionRewards: [
      { resource: "expansion_china", amount: 1 },
      { resource: "gears", amount: 25 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "rice", amount: 1400 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 50000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 34000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 54000 }],
      },
    ],
  },
  {
    id: "er_7",
    name: "Golden Rise",
    column: 4,
    required: ["er_5"],
    scout: { coins: 66000, duration: 5400 },
    regionRewards: [
      { resource: "expansion_china", amount: 1 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 37000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 40000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "wu_zhu", amount: 2500 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "rice", amount: 1800 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 58000 }],
      },
    ],
  },
  {
    id: "er_8",
    name: "Eastern Haven",
    column: 5,
    boss: true,
    required: ["er_6", "er_7"],
    scout: { coins: 70000, duration: 5400 },
    regionRewards: [
      { resource: "expansion_china", amount: 1 },
      { resource: "expansion_capital", amount: 1 },
      { resource: "research_points", amount: 2 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 62000 }],
      },
    ],
  },
  {
    id: "er_9",
    name: "Almondell",
    column: 6,
    required: ["er_8"],
    scout: { coins: 74000, duration: 5700 },
    regionRewards: [
      { resource: "expansion_china", amount: 1 },
      { resource: "gears", amount: 25 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "wu_zhu", amount: 3000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "rice", amount: 2200 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 43000 }],
      },
    ],
  },
  {
    id: "er_10",
    name: "Grey Mountains",
    column: 7,
    required: ["er_9"],
    scout: { coins: 78000, duration: 5700 },
    regionRewards: [
      { resource: "expansion_china", amount: 1 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 66000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 46000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "wu_zhu", amount: 3500 }],
      },
    ],
  },
  {
    id: "er_11",
    name: "Coyote Highlands",
    column: 8,
    required: ["er_10"],
    scout: { coins: 82000, duration: 5700 },
    regionRewards: [
      { resource: "expansion_china", amount: 1 },
      { resource: "research_points", amount: 2 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "rice", amount: 2600 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 70000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 49000 }],
      },
    ],
  },
  {
    id: "er_12",
    name: "Persepolis Place",
    column: 8,
    required: ["er_10"],
    scout: { coins: 86000, duration: 5700 },
    regionRewards: [
      { resource: "expansion_china", amount: 1 },
      { resource: "gears", amount: 25 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "wu_zhu", amount: 4000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 74000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 52000 }],
      },
    ],
  },
  {
    id: "er_13",
    name: "Blackhope Scar",
    column: 9,
    required: ["er_11", "er_12"],
    scout: { coins: 90000, duration: 6000 },
    regionRewards: [
      { resource: "expansion_china", amount: 1 },
      { resource: "expansion_capital", amount: 1 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "rice", amount: 3000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "wu_zhu", amount: 4500 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 78000 }],
      },
    ],
  },
  {
    id: "er_14",
    name: "Redclaw Harbor",
    column: 10,
    required: ["er_13"],
    scout: { coins: 94000, duration: 6000 },
    regionRewards: [
      { resource: "expansion_china", amount: 1 },
      { resource: "gears", amount: 25 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 55000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "rice", amount: 3400 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 82000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 58000 }],
      },
    ],
  },
  {
    id: "er_15",
    name: "Scald Grounds",
    column: 10,
    required: ["er_13"],
    scout: { coins: 98000, duration: 6000 },
    regionRewards: [
      { resource: "expansion_china", amount: 1 },
      { resource: "research_points", amount: 2 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 86000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "wu_zhu", amount: 5000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 61000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 90000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "rice", amount: 3800 }],
      },
    ],
  },
  {
    id: "er_16",
    name: "City of Lions",
    column: 11,
    boss: true,
    required: ["er_14", "er_15"],
    scout: { coins: 102000, duration: 6000 },
    regionRewards: [
      { resource: "expansion_china", amount: 2 },
      { resource: "commander_alexanderthegreat", amount: 1, name: "Commander Alexander The Great" },
      { resource: "gears", amount: 25 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 64000 }],
      },
    ],
  }
];
