import { CampaignRegion } from "@/types/campaign-types";

export const campaign_IE: CampaignRegion[] = [
  {
    id: "ie_1",
    name: "Icy Hills",
    column: 0,
    required: [],
    scout: { coins: 980000, duration: 13500 },
    regionRewards: [
      { resource: "expansion_vikings", amount: 3 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 155000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 92000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "coins", amount: 160000 }],
      },
    ],
  },
  {
    id: "ie_2",
    name: "Remains of Gladsheim",
    column: 1,
    required: ["ie_1"],
    scout: { coins: 870000, duration: 13500 },
    regionRewards: [
      { resource: "expansion_vikings", amount: 2 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "pennies", amount: 16000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "pennies", amount: 16500 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "pennies", amount: 17000 }],
      },
    ],
  },
  {
    id: "ie_3",
    name: "Helheim Chasm",
    column: 1,
    required: ["ie_1"],
    scout: { coins: 1110000, duration: 13500 },
    regionRewards: [
      { resource: "expansion_vikings", amount: 2 },
      { resource: "expansion_capital", amount: 1 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "pennies", amount: 17500 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 96000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 165000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "food", amount: 99500 }],
      },
    ],
  },
  {
    id: "ie_4",
    name: "Thorstadt",
    column: 2,
    required: ["ie_2"],
    scout: { coins: 870000, duration: 13500 },
    regionRewards: [
      { resource: "expansion_vikings_water", amount: 2 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "pennies", amount: 18000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "pennies", amount: 18500 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "pennies", amount: 19000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "pennies", amount: 19500 }],
      },
    ],
  },
  {
    id: "ie_5",
    name: "Path to Jotunheim",
    column: 2,
    required: ["ie_3"],
    scout: { coins: 880000, duration: 13500 },
    regionRewards: [
      { resource: "expansion_vikings", amount: 1 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 170000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "pennies", amount: 20000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "pennies", amount: 20500 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "food", amount: 105000 }],
      },
    ],
  },
  {
    id: "ie_6",
    name: "Fólkvangr Fields",
    column: 3,
    required: ["ie_4", "ie_5"],
    scout: { coins: 1060000, duration: 13500 },
    regionRewards: [
      { resource: "expansion_capital", amount: 1 },
      { resource: "expansion_vikings", amount: 1 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 180000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "pennies", amount: 21000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 105000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "pennies", amount: 21500 }],
      },
    ],
  },
  {
    id: "ie_7",
    name: "Hvergelmir Springs",
    column: 3,
    required: ["ie_4", "ie_5"],
    scout: { coins: 1020000, duration: 15300 },
    regionRewards: [
      { resource: "expansion_vikings", amount: 2 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 185000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 110000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "pennies", amount: 22000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "coins", amount: 190000 }],
      },
    ],
  },
  {
    id: "ie_8",
    name: "Valley of the Giants",
    column: 4,
    required: ["ie_6", "ie_7"],
    scout: { coins: 990000, duration: 15300 },
    regionRewards: [
      { resource: "expansion_vikings", amount: 3 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "pennies", amount: 22500 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 200000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 205000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 115000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "pennies", amount: 23000 }],
      },
    ],
  },
  {
    id: "ie_9",
    name: "Snowy Peaks",
    column: 5,
    required: ["ie_8"],
    scout: { coins: 910000, duration: 15300 },
    regionRewards: [
      { resource: "expansion_vikings", amount: 2 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 115000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 120000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 210000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "pennies", amount: 23500 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "food", amount: 125000 }],
      },
    ],
  },
  {
    id: "ie_10",
    name: "Idavoll Forest",
    column: 5,
    required: ["ie_8"],
    scout: { coins: 980000, duration: 15300 },
    regionRewards: [
      { resource: "expansion_vikings_water", amount: 1 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "pennies", amount: 23500 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 215000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 130000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 225000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "pennies", amount: 24000 }],
      },
    ],
  },
  {
    id: "ie_11",
    name: "Barri Grove",
    column: 6,
    required: ["ie_9"],
    scout: { coins: 870000, duration: 15300 },
    regionRewards: [
      { resource: "expansion_vikings_water", amount: 2 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "pennies", amount: 24500 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 130000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "pennies", amount: 25000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 135000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "pennies", amount: 25500 }],
      },
    ],
  },
  {
    id: "ie_12",
    name: "Shore of Nastrond",
    column: 6,
    required: ["ie_10"],
    scout: { coins: 1060000, duration: 15300 },
    regionRewards: [
      { resource: "expansion_vikings", amount: 3 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 230000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 140000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "pennies", amount: 26000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "pennies", amount: 26500 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "coins", amount: 235000 }],
      },
    ],
  },
  {
    id: "ie_13",
    name: "Castillo de Vivar",
    column: 7,
    boss: true,
    required: ["ie_11", "ie_12"],
    scout: { coins: 950000, duration: 43200 },
    regionRewards: [
      { resource: "expansion_vikings", amount: 2 },
    ],
    parts: [
      {
        type: ["combat_waves"],
        rewards: [{ resource: "food", amount: 140000 }],
      },
    ],
  },
  {
    id: "ie_14",
    name: "Cold Advance",
    column: 8,
    required: ["ie_13"],
    scout: { coins: 1030000, duration: 15300 },
    regionRewards: [
      { resource: "expansion_vikings", amount: 2 },
      { resource: "expansion_capital", amount: 1 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 240000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "pennies", amount: 27000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "coins", amount: 250000 }],
      },
    ],
  },
  {
    id: "ie_15",
    name: "Valgrind Gate",
    column: 9,
    required: ["ie_14"],
    scout: { coins: 1020000, duration: 15300 },
    regionRewards: [
      { resource: "expansion_vikings", amount: 2 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 145000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "pennies", amount: 27500 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "food", amount: 150000 }],
      },
    ],
  },
  {
    id: "ie_16",
    name: "Amsvartnir Pass",
    column: 9,
    required: ["ie_14"],
    scout: { coins: 890000, duration: 15300 },
    regionRewards: [
      { resource: "expansion_vikings", amount: 2 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 155000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 255000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 260000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "pennies", amount: 28000 }],
      },
    ],
  },
  {
    id: "ie_17",
    name: "Byrgir Chasm",
    column: 10,
    required: ["ie_15"],
    scout: { coins: 1110000, duration: 15300 },
    regionRewards: [
      { resource: "expansion_vikings", amount: 2 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 155000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 265000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "pennies", amount: 28500 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "pennies", amount: 29000 }],
      },
    ],
  },
  {
    id: "ie_18",
    name: "Frozen Plains",
    column: 10,
    required: ["ie_15", "ie_16"],
    scout: { coins: 950000, duration: 15300 },
    regionRewards: [
      { resource: "expansion_vikings", amount: 2 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 160000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "pennies", amount: 29500 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "pennies", amount: 30000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "coins", amount: 275000 }],
      },
    ],
  },
  {
    id: "ie_19",
    name: "Lyngvi Lake",
    column: 11,
    required: ["ie_17", "ie_18"],
    scout: { coins: 950000, duration: 15300 },
    regionRewards: [
      { resource: "expansion_vikings_water", amount: 1 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 165000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "pennies", amount: 30500 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 280000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "pennies", amount: 31000 }],
      },
    ],
  },
  {
    id: "ie_20",
    name: "Utgard Hills",
    column: 12,
    required: ["ie_19"],
    scout: { coins: 910000, duration: 15300 },
    regionRewards: [
      { resource: "expansion_vikings_water", amount: 1 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 165000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "pennies", amount: 31500 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 285000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "pennies", amount: 32000 }],
      },
    ],
  },
  {
    id: "ie_21",
    name: "Fields of Svartalfheim",
    column: 12,
    required: ["ie_19"],
    scout: { coins: 970000, duration: 15300 },
    regionRewards: [
      { resource: "expansion_vikings", amount: 2 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 170000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "pennies", amount: 32500 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 295000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "pennies", amount: 33000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "food", amount: 175000 }],
      },
    ],
  },
  {
    id: "ie_22",
    name: "City of Vingolf",
    column: 13,
    required: ["ie_20"],
    scout: { coins: 910000, duration: 15300 },
    regionRewards: [
      { resource: "expansion_vikings", amount: 2 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 300000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 305000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 180000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 180000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "pennies", amount: 33500 }],
      },
    ],
  },
  {
    id: "ie_23",
    name: "Vanaheim",
    column: 13,
    required: ["ie_21"],
    scout: { coins: 940000, duration: 15300 },
    regionRewards: [
      { resource: "expansion_vikings", amount: 2 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 185000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 310000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 190000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "pennies", amount: 34000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "coins", amount: 320000 }],
      },
    ],
  },
  {
    id: "ie_24",
    name: "Gioll River",
    column: 14,
    required: ["ie_22", "ie_23"],
    scout: { coins: 880000, duration: 15300 },
    regionRewards: [
      { resource: "expansion_vikings_water", amount: 1 },
      { resource: "expansion_capital", amount: 1 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 190000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "pennies", amount: 34500 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 325000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 195000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "pennies", amount: 35000 }],
      },
    ],
  },
  {
    id: "ie_25",
    name: "Plains of Helheim",
    column: 14,
    required: ["ie_22", "ie_23"],
    scout: { coins: 1080000, duration: 15300 },
    regionRewards: [
      { resource: "expansion_vikings", amount: 2 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 330000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 200000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "pennies", amount: 35500 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 335000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "food", amount: 205000 }],
      },
    ],
  },
  {
    id: "ie_26",
    name: "Gladsheim",
    column: 15,
    boss: true,
    required: ["ie_24", "ie_25"],
    scout: { coins: 1120000, duration: 43200 },
    regionRewards: [
      { resource: "gears", amount: 100 },
    ],
    parts: [
      {
        type: ["combat_waves"],
        rewards: [{ resource: "pennies", amount: 36000 }],
      },
    ],
  }
];
