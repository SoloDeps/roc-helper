import { CampaignRegion } from "@/types/campaign-types";

export const campaign_BE: CampaignRegion[] = [
  {
    id: "be_1",
    name: "Jungle Landing",
    column: 0,
    required: [],
    scout: { coins: 255000, duration: 7200 },
    regionRewards: [
      { resource: "expansion_mayas", amount: 3 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 76000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 57000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 78000 }],
      },
    ],
  },
  {
    id: "be_2",
    name: "Tecuani Bay",
    column: 1,
    required: ["be_1"],
    scout: { coins: 265000, duration: 7200 },
    regionRewards: [
      { resource: "expansion_mayas", amount: 2 },
      { resource: "research_points", amount: 2 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 58500 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "cocoa", amount: 4000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 80000 }],
      },
    ],
  },
  {
    id: "be_3",
    name: "Zotol Beach",
    column: 1,
    required: ["be_1"],
    scout: { coins: 280000, duration: 7200 },
    regionRewards: [
      { resource: "expansion_mayas", amount: 2 },
      { resource: "expansion_capital", amount: 1 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 60000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 82000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 61000 }],
      },
    ],
  },
  {
    id: "be_4",
    name: "Tecolotl Vale",
    column: 2,
    required: ["be_2", "be_3"],
    scout: { coins: 295000, duration: 7200 },
    regionRewards: [
      { resource: "expansion_mayas", amount: 2 },
      { resource: "gears", amount: 25 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "cocoa", amount: 4850 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 84000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 62500 }],
      },
    ],
  },
  {
    id: "be_5",
    name: "Cochotl Swamp",
    column: 2,
    required: ["be_2", "be_3"],
    scout: { coins: 305000, duration: 7200 },
    regionRewards: [
      { resource: "expansion_mayas", amount: 3 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 85500 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 64000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "cocoa", amount: 5650 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 87500 }],
      },
    ],
  },
  {
    id: "be_6",
    name: "Volcanic Ridge",
    column: 3,
    required: ["be_4"],
    scout: { coins: 320000, duration: 7200 },
    regionRewards: [
      { resource: "expansion_mayas", amount: 1 },
      { resource: "research_points", amount: 2 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 65500 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 89500 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 67000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "cocoa", amount: 6450 }],
      },
    ],
  },
  {
    id: "be_7",
    name: "Quetzalcoatl Ascend",
    column: 3,
    required: ["be_5"],
    scout: { coins: 330000, duration: 7200 },
    regionRewards: [
      { resource: "expansion_mayas", amount: 1 },
      { resource: "expansion_capital", amount: 1 },
      { resource: "research_points", amount: 10 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 91500 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 68500 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 93500 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 69500 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "cocoa", amount: 7250 }],
      },
    ],
  },
  {
    id: "be_8",
    name: "Toponi Mountain",
    column: 4,
    required: ["be_6", "be_7"],
    scout: { coins: 345000, duration: 7200 },
    regionRewards: [
      { resource: "expansion_mayas", amount: 1 },
      { resource: "gears", amount: 25 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 95000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 71000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 97000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 72500 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "cocoa", amount: 8050 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 99000 }],
      },
    ],
  },
  {
    id: "be_9",
    name: "Toltec Outpost",
    column: 5,
    boss: true,
    required: ["be_8"],
    scout: { coins: 355000, duration: 7200 },
    regionRewards: [
      { resource: "expansion_mayas", amount: 3 },
      { resource: "commander_queenxochitl", amount: 1, name: "Commander Queen Xochitl" },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 74000 }],
      },
    ],
  },
  {
    id: "be_10",
    name: "Byzantian Camp",
    column: 6,
    required: ["be_9"],
    scout: { coins: 370000, duration: 7200 },
    regionRewards: [
      { resource: "expansion_mayas", amount: 1 },
      { resource: "expansion_capital", amount: 1 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 100000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 75500 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "cocoa", amount: 8850 }],
      },
    ],
  },
  {
    id: "be_11",
    name: "Axolotl Basin",
    column: 7,
    required: ["be_10"],
    scout: { coins: 380000, duration: 7200 },
    regionRewards: [
      { resource: "gears", amount: 25 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 105000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 77000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 105000 }],
      },
    ],
  },
  {
    id: "be_12",
    name: "Tecuixin River",
    column: 7,
    required: ["be_10"],
    scout: { coins: 395000, duration: 7200 },
    regionRewards: [
      { resource: "expansion_mayas", amount: 1 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 78500 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "cocoa", amount: 9650 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 105000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 79500 }],
      },
    ],
  },
  {
    id: "be_13",
    name: "Ozomahtli Field",
    column: 8,
    required: ["be_11", "be_12"],
    scout: { coins: 405000, duration: 7200 },
    regionRewards: [
      { resource: "expansion_mayas", amount: 1 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 110000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 81000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "cocoa", amount: 10500 }],
      },
    ],
  },
  {
    id: "be_14",
    name: "Miztontli Jungle",
    column: 8,
    required: ["be_11", "be_12"],
    scout: { coins: 420000, duration: 7200 },
    regionRewards: [
      { resource: "expansion_capital", amount: 1 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 110000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 82500 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 110000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 84000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "cocoa", amount: 11500 }],
      },
    ],
  },
  {
    id: "be_15",
    name: "Tlacatecolotl Cavern",
    column: 9,
    required: ["be_13"],
    scout: { coins: 435000, duration: 7200 },
    regionRewards: [
      { resource: "research_points", amount: 2 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 115000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 85500 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 115000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 87000 }],
      },
    ],
  },
  {
    id: "be_16",
    name: "Yaotiacahuan Woods",
    column: 9,
    required: ["be_14"],
    scout: { coins: 445000, duration: 7200 },
    regionRewards: [
      { resource: "expansion_mayas", amount: 1 },
      { resource: "gears", amount: 25 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "cocoa", amount: 12000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 120000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 88000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 120000 }],
      },
    ],
  },
  {
    id: "be_17",
    name: "Jungle Ruins",
    column: 10,
    required: ["be_15", "be_16"],
    scout: { coins: 460000, duration: 7200 },
    regionRewards: [
      { resource: "research_points", amount: 3 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 89500 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "cocoa", amount: 13000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 120000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 91000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 125000 }],
      },
    ],
  },
  {
    id: "be_18",
    name: "Constantine's Retreat",
    column: 11,
    boss: true,
    required: ["be_17"],
    scout: { coins: 470000, duration: 7200 },
    regionRewards: [
      { resource: "gears", amount: 25 },
      { resource: "research_points", amount: 20 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "cocoa", amount: 13500 }],
      },
    ],
  }
];
