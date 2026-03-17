import { CampaignRegion } from "@/types/campaign-types";

export const campaign_ME: CampaignRegion[] = [
  {
    id: "me_1",
    name: "White Dunes",
    column: 0,
    required: [],
    scout: { coins: 8000, duration: 2700 },
    regionRewards: [
      { resource: "expansion_capital", amount: 1 },
      { resource: "research_points", amount: 2 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 5300 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 4000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 5900 }],
      },
    ],
  },
  {
    id: "me_2",
    name: "Deerhide Flats",
    column: 1,
    required: ["me_1"],
    scout: { coins: 8800, duration: 2700 },
    regionRewards: [
      { resource: "chest_puzzlepieces", amount: 1 },
      { resource: "research_points", amount: 5 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 4400 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 6500 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 4800 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 5200 }],
      },
    ],
  },
  {
    id: "me_3",
    name: "Cavernous Outcrop",
    column: 1,
    required: ["me_1"],
    scout: { coins: 9600, duration: 3000 },
    regionRewards: [
      { resource: "expansion_capital", amount: 1 },
      { resource: "gears", amount: 25 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 7000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 5600 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 7500 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 5900 }],
      },
    ],
  },
  {
    id: "me_4",
    name: "Forgotten Wilds",
    column: 2,
    required: ["me_2"],
    scout: { coins: 10400, duration: 3000 },
    regionRewards: [{ resource: "gears", amount: 25 }],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 8300 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 6400 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 8300 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 6800 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 9000 }],
      },
    ],
  },
  {
    id: "me_5",
    name: "Crab Claw Sands",
    column: 2,
    required: ["me_3"],
    scout: { coins: 11300, duration: 3000 },
    regionRewards: [
      { resource: "expansion_capital", amount: 1 },
      { resource: "chest_puzzlepieces", amount: 1 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 9800 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 7100 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 11000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 7500 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 11000 }],
      },
    ],
  },
  {
    id: "me_6",
    name: "Palace of Nobles",
    column: 3,
    boss: true,
    required: ["me_4", "me_5"],
    scout: { coins: 12100, duration: 3000 },
    regionRewards: [
      { resource: "expansion_capital", amount: 1 },
      { resource: "commander_kingminos", amount: 1, name: "Commander King Minos" },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 8300 }],
      },
    ],
  },
  {
    id: "me_7",
    name: "Valley of the Gods",
    column: 4,
    required: ["me_6"],
    scout: { coins: 12900, duration: 3000 },
    regionRewards: [
      { resource: "expansion_egypt", amount: 2 },
      { resource: "research_points", amount: 2 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 800 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "papyrus", amount: 200 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "gold_ore", amount: 200 }],
      },
    ],
  },
  {
    id: "me_8",
    name: "The Dustbowl",
    column: 5,
    required: ["me_7"],
    scout: { coins: 13700, duration: 3300 },
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
        rewards: [{ resource: "papyrus", amount: 300 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "gold_ore", amount: 200 }],
      },
    ],
  },
  {
    id: "me_9",
    name: "Eagle Point",
    column: 6,
    required: ["me_8"],
    scout: { coins: 14500, duration: 3300 },
    regionRewards: [{ resource: "expansion_egypt", amount: 2 }],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "deben", amount: 2700 }],
      },
    ],
  },
  {
    id: "me_10",
    name: "Western Desert",
    column: 6,
    required: ["me_8"],
    scout: { coins: 15300, duration: 3300 },
    regionRewards: [
      { resource: "expansion_egypt", amount: 1 },
      { resource: "gears", amount: 25 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "deben", amount: 3400 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 11000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 8300 }],
      },
    ],
  },
  {
    id: "me_11",
    name: "Bitter Lake",
    column: 7,
    required: ["me_9"],
    scout: { coins: 16100, duration: 3300 },
    regionRewards: [
      { resource: "expansion_capital", amount: 1 },
      { resource: "gears", amount: 25 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "deben", amount: 4200 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "papyrus", amount: 400 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "gold_ore", amount: 300 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 12000 }],
      },
    ],
  },
  {
    id: "me_12",
    name: "Bogs of Noth",
    column: 7,
    required: ["me_9", "me_10"],
    scout: { coins: 16900, duration: 3300 },
    regionRewards: [
      { resource: "expansion_egypt", amount: 1 },
      { resource: "chest_puzzlepieces", amount: 1 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "deben", amount: 5000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 12000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 8300 }],
      },
    ],
  },
  {
    id: "me_13",
    name: "Dewfall Springs",
    column: 7,
    required: ["me_10"],
    scout: { coins: 17700, duration: 3600 },
    regionRewards: [{ resource: "expansion_egypt", amount: 1 }],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "deben", amount: 5700 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "papyrus", amount: 500 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "gold_ore", amount: 400 }],
      },
    ],
  },
  {
    id: "me_14",
    name: "Jackals Ridge",
    column: 8,
    required: ["me_11", "me_12"],
    scout: { coins: 18500, duration: 3600 },
    regionRewards: [
      { resource: "expansion_egypt", amount: 1 },
      { resource: "research_points", amount: 12 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "deben", amount: 6500 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 13000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 9000 }],
      },
    ],
  },
  {
    id: "me_15",
    name: "Jungle Creek",
    column: 8,
    required: ["me_12", "me_13"],
    scout: { coins: 19300, duration: 3600 },
    regionRewards: [
      { resource: "expansion_egypt", amount: 1 },
      { resource: "expansion_capital", amount: 1 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "deben", amount: 7100 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "papyrus", amount: 600 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "gold_ore", amount: 400 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 14000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 9000 }],
      },
    ],
  },
  {
    id: "me_16",
    name: "Silent Delta",
    column: 9,
    boss: true,
    required: ["me_14", "me_15"],
    scout: { coins: 20100, duration: 3600 },
    regionRewards: [
      { resource: "expansion_egypt", amount: 2 },
      { resource: "gears", amount: 25 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "deben", amount: 7900 }],
      },
    ],
  },
];
