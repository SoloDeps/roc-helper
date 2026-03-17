import { CampaignRegion } from "@/types/campaign-types";

export const campaign_AF: CampaignRegion[] = [
  {
    id: "af_1",
    name: "Edge of the World",
    column: 0,
    required: [],
    scout: { coins: 495000, duration: 7200 },
    regionRewards: [
      { resource: "expansion_mayas", amount: 3 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 155000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 95000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "cocoa", amount: 27000 }],
      },
    ],
  },
  {
    id: "af_2",
    name: "Temper Falls",
    column: 1,
    required: ["af_1"],
    scout: { coins: 580000, duration: 7200 },
    regionRewards: [
      { resource: "expansion_mayas", amount: 2 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 125000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 140000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "cocoa", amount: 23000 }],
      },
    ],
  },
  {
    id: "af_3",
    name: "Merovingian Outpost",
    column: 1,
    required: ["af_1"],
    scout: { coins: 460000, duration: 7200 },
    regionRewards: [
      { resource: "expansion_capital", amount: 1 },
      { resource: "research_points", amount: 3 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 120000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "cocoa", amount: 23500 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 100000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "coins", amount: 160000 }],
      },
    ],
  },
  {
    id: "af_4",
    name: "Reaches of Clotilde",
    column: 2,
    required: ["af_2", "af_3"],
    scout: { coins: 550000, duration: 7200 },
    regionRewards: [
      { resource: "expansion_mayas", amount: 1 },
      { resource: "gears", amount: 25 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 105000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "cocoa", amount: 27000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 150000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "coins", amount: 130000 }],
      },
    ],
  },
  {
    id: "af_5",
    name: "Nouveau Belgica",
    column: 2,
    required: ["af_2", "af_3"],
    scout: { coins: 460000, duration: 7200 },
    regionRewards: [
      { resource: "expansion_mayas", amount: 1 },
      { resource: "research_points", amount: 8 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "cocoa", amount: 28500 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 100000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "cocoa", amount: 27500 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "food", amount: 115000 }],
      },
    ],
  },
  {
    id: "af_6",
    name: "Owl Meadow",
    column: 3,
    required: ["af_4"],
    scout: { coins: 530000, duration: 7200 },
    regionRewards: [
      { resource: "expansion_mayas", amount: 1 },
      { resource: "research_points", amount: 3 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 160000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 105000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "cocoa", amount: 23500 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 160000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "coins", amount: 140000 }],
      },
    ],
  },
  {
    id: "af_7",
    name: "Echo of Aquitania",
    column: 3,
    required: ["af_5"],
    scout: { coins: 385000, duration: 9000 },
    regionRewards: [
      { resource: "expansion_mayas", amount: 1 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "cocoa", amount: 25500 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 110000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "cocoa", amount: 23000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 130000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "coins", amount: 140000 }],
      },
    ],
  },
  {
    id: "af_8",
    name: "Hlodowik Peak",
    column: 4,
    required: ["af_6", "af_7"],
    scout: { coins: 380000, duration: 9000 },
    regionRewards: [
      { resource: "expansion_mayas", amount: 2 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 115000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "cocoa", amount: 25000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 145000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 155000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "cocoa", amount: 28000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "food", amount: 120000 }],
      },
    ],
  },
  {
    id: "af_9",
    name: "Neo Thuringia",
    column: 4,
    required: ["af_6", "af_7"],
    scout: { coins: 520000, duration: 9000 },
    regionRewards: [
      { resource: "expansion_capital", amount: 1 },
      { resource: "gears", amount: 25 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "cocoa", amount: 28500 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 115000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 125000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "food", amount: 100000 }],
      },
    ],
  },
  {
    id: "af_10",
    name: "Clovis' Bastion",
    column: 5,
    boss: true,
    required: ["af_8", "af_9"],
    scout: { coins: 575000, duration: 9000 },
    regionRewards: [
      { resource: "expansion_mayas", amount: 3 },
    ],
    parts: [
      {
        type: ["combat_waves"],
        rewards: [{ resource: "cocoa", amount: 23500 }],
      },
    ],
  },
  {
    id: "af_11",
    name: "Empire's Ridge",
    column: 6,
    required: ["af_10"],
    scout: { coins: 500000, duration: 9000 },
    regionRewards: [
      { resource: "expansion_mayas", amount: 2 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 145000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 165000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "cocoa", amount: 23000 }],
      },
    ],
  },
  {
    id: "af_12",
    name: "Lake Tota",
    column: 7,
    required: ["af_11"],
    scout: { coins: 395000, duration: 9000 },
    regionRewards: [
      { resource: "expansion_mayas", amount: 1 },
      { resource: "research_points", amount: 10 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 130000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "cocoa", amount: 23500 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "food", amount: 115000 }],
      },
    ],
  },
  {
    id: "af_13",
    name: "Grand Austrasia",
    column: 7,
    required: ["af_11"],
    scout: { coins: 590000, duration: 10800 },
    regionRewards: [
      { resource: "expansion_mayas", amount: 2 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 145000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 120000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "cocoa", amount: 24000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "coins", amount: 130000 }],
      },
    ],
  },
  {
    id: "af_14",
    name: "Tolhuaca Volcano",
    column: 8,
    required: ["af_12", "af_13"],
    scout: { coins: 410000, duration: 10800 },
    regionRewards: [
      { resource: "expansion_mayas", amount: 1 },
      { resource: "research_points", amount: 3 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 135000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "cocoa", amount: 25000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 120000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "cocoa", amount: 25000 }],
      },
    ],
  },
  {
    id: "af_15",
    name: "New Paris",
    column: 8,
    required: ["af_12", "af_13"],
    scout: { coins: 580000, duration: 10800 },
    regionRewards: [
      { resource: "expansion_mayas", amount: 1 },
      { resource: "expansion_capital", amount: 1 },
      { resource: "gears", amount: 25 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 120000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 130000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 115000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "cocoa", amount: 26500 }],
      },
    ],
  },
  {
    id: "af_16",
    name: "Volcanic Passage",
    column: 9,
    required: ["af_14"],
    scout: { coins: 370000, duration: 10800 },
    regionRewards: [
      { resource: "expansion_mayas", amount: 2 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 165000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 125000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "cocoa", amount: 27000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 110000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "cocoa", amount: 23000 }],
      },
    ],
  },
  {
    id: "af_17",
    name: "Mont de Marquis",
    column: 9,
    required: ["af_15"],
    scout: { coins: 585000, duration: 10800 },
    regionRewards: [
      { resource: "expansion_mayas", amount: 1 },
      { resource: "research_points", amount: 14 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 120000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 145000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 115000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "cocoa", amount: 24000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "coins", amount: 145000 }],
      },
    ],
  },
  {
    id: "af_18",
    name: "Gascony Bay",
    column: 10,
    required: ["af_16", "af_17"],
    scout: { coins: 385000, duration: 10800 },
    regionRewards: [
      { resource: "expansion_capital", amount: 1 },
      { resource: "gears", amount: 25 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 160000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "cocoa", amount: 28500 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 125000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "cocoa", amount: 27000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 120000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "coins", amount: 165000 }],
      },
    ],
  },
  {
    id: "af_19",
    name: "Kaieteur Falls",
    column: 10,
    required: ["af_16", "af_17"],
    scout: { coins: 505000, duration: 10800 },
    regionRewards: [
      { resource: "expansion_mayas", amount: 2 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 105000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "cocoa", amount: 25500 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 165000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "coins", amount: 145000 }],
      },
    ],
  },
  {
    id: "af_20",
    name: "Charlemagne's Fort",
    column: 11,
    boss: true,
    required: ["af_18", "af_19"],
    scout: { coins: 435000, duration: 10800 },
    regionRewards: [
      { resource: "gems", amount: 50 },
    ],
    parts: [
      {
        type: ["combat_waves"],
        rewards: [{ resource: "cocoa", amount: 27500 }],
      },
    ],
  }
];
