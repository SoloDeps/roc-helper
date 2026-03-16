export const campaign_KS = [
  {
    id: "ks_1",
    name: "Lost Oasis",
    column: 0,
    required: [],
    scout: { coins: 970000, duration: 14400 },
    regionRewards: [
      { resource: "expansion_arabia", amount: 3 },
      { resource: "wonder_orb", amount: 1 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 305000 }],
      },
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "food", amount: 185000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "coins", amount: 190000 }],
      },
      {
        type: ["negotiation"],
        rewards: [{ resource: "coins", amount: 240000 }],
      },
    ],
  },
  {
    id: "ks_2",
    name: "Dhow Ports",
    column: 1,
    required: ["ks_1"],
    scout: { coins: 1000000, duration: 14400 },
    regionRewards: [
      { resource: "expansion_arabia", amount: 2 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "dirham", amount: 9100 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 97000 }],
      },
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "dirham", amount: 12000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "coins", amount: 190000 }],
      },
      {
        type: ["negotiation"],
        rewards: [{ resource: "food", amount: 165000 }],
      },
    ],
  },
  {
    id: "ks_3",
    name: "Bedouin Lands",
    column: 1,
    required: ["ks_1"],
    scout: { coins: 1100000, duration: 14400 },
    regionRewards: [
      { resource: "expansion_arabia", amount: 1 },
      { resource: "expansion_capital", amount: 1 },
      { resource: "research_points", amount: 3 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 205000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 245000 }],
      },
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "dirham", amount: 5800 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "food", amount: 150000 }],
      },
      {
        type: ["negotiation"],
        rewards: [{ resource: "dirham", amount: 6300 }],
      },
    ],
  },
  {
    id: "ks_4",
    name: "Desert Bloom",
    column: 2,
    required: ["ks_2"],
    scout: { coins: 1100000, duration: 14400 },
    regionRewards: [
      { resource: "expansion_arabia", amount: 3 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 150000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 180000 }],
      },
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "dirham", amount: 7800 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "coins", amount: 185000 }],
      },
    ],
  },
  {
    id: "ks_5",
    name: "Wells of the Camel",
    column: 2,
    required: ["ks_3"],
    scout: { coins: 1100000, duration: 14400 },
    regionRewards: [
      { resource: "expansion_arabia", amount: 2 },
      { resource: "wonder_orb", amount: 1 },
    ],
    parts: [
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "food", amount: 140000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 96000 }],
      },
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "dirham", amount: 8900 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "coins", amount: 150000 }],
      },
      {
        type: ["negotiation"],
        rewards: [{ resource: "food", amount: 180000 }],
      },
    ],
  },
  {
    id: "ks_6",
    name: "Clay Hills",
    column: 3,
    required: ["ks_4"],
    scout: { coins: 1100000, duration: 14400 },
    regionRewards: [
      { resource: "expansion_arabia", amount: 1 },
      { resource: "research_points", amount: 3 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "dirham", amount: 9700 }],
      },
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "coins", amount: 305000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "dirham", amount: 9900 }],
      },
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "food", amount: 105000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "dirham", amount: 9200 }],
      },
    ],
  },
  {
    id: "ks_7",
    name: "Incense Road",
    column: 3,
    required: ["ks_5"],
    scout: { coins: 940000, duration: 14400 },
    regionRewards: [
      { resource: "expansion_arabia", amount: 2 },
    ],
    parts: [
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "coins", amount: 285000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 105000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "dirham", amount: 7300 }],
      },
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "coins", amount: 280000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "dirham", amount: 6900 }],
      },
    ],
  },
  {
    id: "ks_8",
    name: "Sand Seas",
    column: 4,
    required: ["ks_6", "ks_7"],
    scout: { coins: 1200000, duration: 14400 },
    regionRewards: [
      { resource: "expansion_arabia", amount: 1 },
      { resource: "expansion_capital", amount: 1 },
      { resource: "wonder_orb", amount: 2 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 115000 }],
      },
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "dirham", amount: 5800 }],
      },
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "coins", amount: 260000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 115000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "dirham", amount: 10000 }],
      },
    ],
  },
  {
    id: "ks_9",
    name: "Camel Trail",
    column: 5,
    required: ["ks_8"],
    scout: { coins: 1100000, duration: 14400 },
    regionRewards: [
      { resource: "expansion_arabia", amount: 2 },
      { resource: "research_points", amount: 5 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 275000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "dirham", amount: 9200 }],
      },
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "food", amount: 96000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "dirham", amount: 5800 }],
      },
      {
        type: ["combat_waves", "negotiation"],
        rewards: [{ resource: "coins", amount: 250000 }],
      },
    ],
  },
  {
    id: "ks_10",
    name: "Nomad's Haven",
    column: 5,
    required: ["ks_8"],
    scout: { coins: 1100000, duration: 14400 },
    regionRewards: [
      { resource: "expansion_arabia", amount: 2 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 97000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "dirham", amount: 8800 }],
      },
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "coins", amount: 155000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "dirham", amount: 8600 }],
      },
      {
        type: ["combat_waves", "negotiation"],
        rewards: [{ resource: "food", amount: 170000 }],
      },
    ],
  },
  {
    id: "ks_11",
    name: "Rugged Hills",
    column: 6,
    required: ["ks_9"],
    scout: { coins: 920000, duration: 14400 },
    regionRewards: [
      { resource: "expansion_arabia", amount: 2 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "dirham", amount: 5000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 220000 }],
      },
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "food", amount: 160000 }],
      },
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "dirham", amount: 6500 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "coins", amount: 215000 }],
      },
    ],
  },
  {
    id: "ks_12",
    name: "Sand swept Plains",
    column: 6,
    required: ["ks_10"],
    scout: { coins: 1200000, duration: 14400 },
    regionRewards: [
      { resource: "expansion_arabia", amount: 2 },
      { resource: "research_points", amount: 5 },
    ],
    parts: [
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "dirham", amount: 5600 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 180000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "dirham", amount: 8200 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 275000 }],
      },
      {
        type: ["combat_waves", "negotiation"],
        rewards: [{ resource: "food", amount: 185000 }],
      },
    ],
  },
  {
    id: "ks_13",
    name: "Stone City",
    column: 7,
    required: ["ks_11", "ks_12"],
    scout: { coins: 950000, duration: 43200 },
    boss: true,
    regionRewards: [
      { resource: "expansion_arabia", amount: 1 },
      { resource: "wonder_orb", amount: 3 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "dirham", amount: 8400 }],
      },
    ],
  },
  {
    id: "ks_14",
    name: "Storm's Edge",
    column: 8,
    required: ["ks_13"],
    scout: { coins: 1300000, duration: 14400 },
    regionRewards: [
      { resource: "expansion_arabia", amount: 1 },
      { resource: "expansion_capital", amount: 1 },
    ],
    parts: [
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "coins", amount: 290000 }],
      },
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "dirham", amount: 6400 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 190000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "dirham", amount: 5900 }],
      },
      {
        type: ["negotiation"],
        rewards: [{ resource: "coins", amount: 235000 }],
      },
    ],
  },
  {
    id: "ks_15",
    name: "Jewel of the Desert",
    column: 9,
    required: ["ks_14"],
    scout: { coins: 1000000, duration: 14400 },
    regionRewards: [
      { resource: "expansion_arabia", amount: 2 },
      { resource: "wonder_orb", amount: 1 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 94000 }],
      },
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "dirham", amount: 6700 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 280000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "dirham", amount: 8200 }],
      },
      {
        type: ["negotiation"],
        rewards: [{ resource: "food", amount: 145000 }],
      },
    ],
  },
  {
    id: "ks_16",
    name: "Salt Mountains",
    column: 9,
    required: ["ks_14"],
    scout: { coins: 970000, duration: 14400 },
    regionRewards: [
      { resource: "expansion_arabia", amount: 2 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "dirham", amount: 6500 }],
      },
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "coins", amount: 160000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 140000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "dirham", amount: 8500 }],
      },
      {
        type: ["negotiation"],
        rewards: [{ resource: "coins", amount: 240000 }],
      },
    ],
  },
  {
    id: "ks_17",
    name: "Golden Sands",
    column: 10,
    required: ["ks_15", "ks_16"],
    scout: { coins: 1300000, duration: 14400 },
    regionRewards: [
      { resource: "expansion_arabia", amount: 2 },
      { resource: "research_points", amount: 7 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "dirham", amount: 6200 }],
      },
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "food", amount: 135000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "dirham", amount: 7300 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "coins", amount: 220000 }],
      },
      {
        type: ["negotiation"],
        rewards: [{ resource: "food", amount: 160000 }],
      },
    ],
  },
  {
    id: "ks_18",
    name: "Dry Riverbed",
    column: 11,
    required: ["ks_17"],
    scout: { coins: 1100000, duration: 14400 },
    regionRewards: [
      { resource: "expansion_arabia", amount: 2 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "dirham", amount: 6500 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 215000 }],
      },
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "dirham", amount: 6500 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "food", amount: 145000 }],
      },
      {
        type: ["negotiation"],
        rewards: [{ resource: "dirham", amount: 8700 }],
      },
    ],
  },
  {
    id: "ks_19",
    name: "Mirage",
    column: 11,
    required: ["ks_17"],
    scout: { coins: 1200000, duration: 14400 },
    regionRewards: [
      { resource: "expansion_arabia", amount: 2 },
      { resource: "wonder_orb", amount: 1 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 190000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 185000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "dirham", amount: 7100 }],
      },
      {
        type: ["combat_waves", "negotiation"],
        rewards: [{ resource: "coins", amount: 165000 }],
      },
      {
        type: ["negotiation"],
        rewards: [{ resource: "dirham", amount: 7700 }],
      },
    ],
  },
  {
    id: "ks_20",
    name: "Starlit Desert",
    column: 12,
    required: ["ks_18", "ks_19"],
    scout: { coins: 1300000, duration: 14400 },
    regionRewards: [
      { resource: "expansion_arabia", amount: 2 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 140000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "dirham", amount: 9700 }],
      },
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "coins", amount: 295000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "food", amount: 140000 }],
      },
      {
        type: ["negotiation"],
        rewards: [{ resource: "coins", amount: 255000 }],
      },
    ],
  },
  {
    id: "ks_21",
    name: "Endless Dunes",
    column: 13,
    required: ["ks_20"],
    scout: { coins: 1100000, duration: 14400 },
    regionRewards: [
      { resource: "expansion_arabia", amount: 2 },
      { resource: "research_points", amount: 8 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 240000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "dirham", amount: 9200 }],
      },
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "food", amount: 105000 }],
      },
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "dirham", amount: 9000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "coins", amount: 200000 }],
      },
    ],
  },
  {
    id: "ks_22",
    name: "Scorched Land",
    column: 14,
    required: ["ks_21"],
    scout: { coins: 960000, duration: 14400 },
    regionRewards: [
      { resource: "expansion_arabia", amount: 2 },
    ],
    parts: [
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "food", amount: 160000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "dirham", amount: 8400 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 275000 }],
      },
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "dirham", amount: 8100 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "food", amount: 155000 }],
      },
    ],
  },
  {
    id: "ks_23",
    name: "Parched Lands",
    column: 14,
    required: ["ks_21"],
    scout: { coins: 1200000, duration: 14400 },
    regionRewards: [
      { resource: "expansion_arabia", amount: 1 },
      { resource: "wonder_orb", amount: 1 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "dirham", amount: 7700 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 170000 }],
      },
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "food", amount: 110000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 135000 }],
      },
      {
        type: ["combat_waves", "negotiation"],
        rewards: [{ resource: "coins", amount: 275000 }],
      },
    ],
  },
  {
    id: "ks_24",
    name: "Nomad's Crossing",
    column: 15,
    required: ["ks_22"],
    scout: { coins: 1200000, duration: 14400 },
    regionRewards: [
      { resource: "expansion_arabia", amount: 1 },
      { resource: "expansion_capital", amount: 1 },
    ],
    parts: [
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "dirham", amount: 6600 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "food", amount: 120000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "dirham", amount: 6600 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 235000 }],
      },
      {
        type: ["combat_waves", "negotiation"],
        rewards: [{ resource: "food", amount: 185000 }],
      },
    ],
  },
  {
    id: "ks_25",
    name: "Caravan's Rest",
    column: 15,
    required: ["ks_23"],
    scout: { coins: 940000, duration: 14400 },
    regionRewards: [
      { resource: "expansion_arabia", amount: 2 },
      { resource: "research_points", amount: 12 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "dirham", amount: 5500 }],
      },
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "coins", amount: 170000 }],
      },
      {
        type: ["combat"],
        rewards: [{ resource: "dirham", amount: 6700 }],
      },
      {
        type: ["combat", "negotiation"],
        rewards: [{ resource: "food", amount: 180000 }],
      },
      {
        type: ["combat_waves"],
        rewards: [{ resource: "dirham", amount: 8100 }],
      },
    ],
  },
  {
    id: "ks_26",
    name: "Lost City",
    column: 16,
    required: ["ks_24", "ks_25"],
    scout: { coins: 980000, duration: 43200 },
    boss: true,
    regionRewards: [
      { resource: "expansion_arabia", amount: 1 },
      { resource: "wonder_orb", amount: 3 },
    ],
    parts: [
      {
        type: ["combat"],
        rewards: [{ resource: "coins", amount: 155000 }],
      },
    ],
  }
];
