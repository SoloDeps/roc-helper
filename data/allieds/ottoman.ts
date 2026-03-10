import { OttomanAreaData, TradePostData } from "@/types/shared";

// ─────────────────────────────────────────────────────────────────────────────
// LEVELUP TEMPLATES — single source of truth
// Modifier uniquement ici pour répercuter les changements sur tous les trades posts
// ─────────────────────────────────────────────────────────────────────────────

type LevelCost = { amount: number; resource: string };
// Doit être compatible avec TradePostLevels (1–5 obligatoires + index signature)
type LevelupLevels = { [level: number]: LevelCost[] } & {
  1: LevelCost[];
  2: LevelCost[];
  3: LevelCost[];
  4: LevelCost[];
  5: LevelCost[];
};

/** Village EarlyGothic standard (levels 2→6) */
function villageLevelupEG(unlockCost: LevelCost[] = []): LevelupLevels {
  return {
    1: unlockCost,
    2: [
      { amount: 10000, resource: "aspers" },
      { amount: 300, resource: "primary_eg" },
      { amount: 1, resource: "trade_village_silver_upkey" },
    ],
    3: [
      { amount: 10000, resource: "aspers" },
      { amount: 300, resource: "primary_eg" },
      { amount: 1, resource: "trade_village_gold_upkey" },
    ],
    4: [
      { amount: 10000, resource: "aspers" },
      { amount: 300, resource: "primary_eg" },
      { amount: 1, resource: "trade_village_platinum_upkey" },
    ],
    5: [
      { amount: 10000, resource: "aspers" },
      { amount: 300, resource: "primary_eg" },
      { amount: 1, resource: "trade_village_diamond_upkey" },
    ],
    6: [
      { amount: 50000, resource: "aspers" },
      { amount: 1000, resource: "primary_eg" },
      { amount: 1, resource: "trade_village_advanced_upkey" },
    ],
  };
}

/** Village LateGothic standard (levels 2→6) */
function villageLevelupLG(unlockCost: LevelCost[] = []): LevelupLevels {
  return {
    1: unlockCost,
    2: [
      { amount: 40000, resource: "aspers" },
      { amount: 500, resource: "primary_lg" },
      { amount: 1, resource: "trade_village_silver_upkey" },
    ],
    3: [
      { amount: 45000, resource: "aspers" },
      { amount: 600, resource: "primary_lg" },
      { amount: 1, resource: "trade_village_gold_upkey" },
    ],
    4: [
      { amount: 50000, resource: "aspers" },
      { amount: 700, resource: "primary_lg" },
      { amount: 1, resource: "trade_village_platinum_upkey" },
    ],
    5: [
      { amount: 55000, resource: "aspers" },
      { amount: 850, resource: "primary_lg" },
      { amount: 1, resource: "trade_village_diamond_upkey" },
    ],
    6: [
      { amount: 60000, resource: "aspers" },
      { amount: 1000, resource: "primary_lg" },
      { amount: 1, resource: "trade_village_advanced_upkey" },
    ],
  };
}

/** Village Premium gems (levels 1→5, pas de level 6 dans le Lua) */
function villageLevelupPremium(unlockCost: LevelCost[] = []): LevelupLevels {
  return {
    1: unlockCost,
    2: [{ amount: 490, resource: "gems" }],
    3: [{ amount: 590, resource: "gems" }],
    4: [{ amount: 690, resource: "gems" }],
    5: [{ amount: 790, resource: "gems" }],
  };
}

/** City EarlyGothic standard (levels 2→6) */
function cityLevelupEG(unlockCost: LevelCost[] = []): LevelupLevels {
  return {
    1: unlockCost,
    2: [
      { amount: 50000, resource: "aspers" },
      { amount: 500, resource: "secondary_eg" },
      { amount: 500, resource: "tertiary_eg" },
      { amount: 1, resource: "trade_city_silver_upkey" },
    ],
    3: [
      { amount: 50000, resource: "aspers" },
      { amount: 500, resource: "secondary_eg" },
      { amount: 500, resource: "tertiary_eg" },
      { amount: 1, resource: "trade_city_gold_upkey" },
    ],
    4: [
      { amount: 50000, resource: "aspers" },
      { amount: 500, resource: "secondary_eg" },
      { amount: 500, resource: "tertiary_eg" },
      { amount: 1, resource: "trade_city_platinum_upkey" },
    ],
    5: [
      { amount: 50000, resource: "aspers" },
      { amount: 500, resource: "secondary_eg" },
      { amount: 500, resource: "tertiary_eg" },
      { amount: 1, resource: "trade_city_diamond_upkey" },
    ],
    6: [
      { amount: 100000, resource: "aspers" },
      { amount: 1000, resource: "secondary_eg" },
      { amount: 500, resource: "tertiary_eg" },
      { amount: 1, resource: "trade_city_advanced_upkey" },
    ],
  };
}

/** City LateGothic standard (levels 2→6) */
function cityLevelupLG(unlockCost: LevelCost[] = []): LevelupLevels {
  return {
    1: unlockCost,
    2: [
      { amount: 100000, resource: "aspers" },
      { amount: 500, resource: "secondary_lg" },
      { amount: 500, resource: "tertiary_lg" },
      { amount: 1, resource: "trade_city_silver_upkey" },
    ],
    3: [
      { amount: 105000, resource: "aspers" },
      { amount: 600, resource: "secondary_lg" },
      { amount: 600, resource: "tertiary_lg" },
      { amount: 1, resource: "trade_city_gold_upkey" },
    ],
    4: [
      { amount: 110000, resource: "aspers" },
      { amount: 700, resource: "secondary_lg" },
      { amount: 700, resource: "tertiary_lg" },
      { amount: 1, resource: "trade_city_platinum_upkey" },
    ],
    5: [
      { amount: 115000, resource: "aspers" },
      { amount: 850, resource: "secondary_lg" },
      { amount: 850, resource: "tertiary_lg" },
      { amount: 1, resource: "trade_city_diamond_upkey" },
    ],
    6: [
      { amount: 125000, resource: "aspers" },
      { amount: 1000, resource: "secondary_lg" },
      { amount: 1000, resource: "tertiary_lg" },
      { amount: 1, resource: "trade_city_advanced_upkey" },
    ],
  };
}

/** City Premium gems (levels 1→5) */
function cityLevelupPremium(unlockCost: LevelCost[] = []): LevelupLevels {
  return {
    1: unlockCost,
    2: [{ amount: 590, resource: "gems" }],
    3: [{ amount: 690, resource: "gems" }],
    4: [{ amount: 790, resource: "gems" }],
    5: [{ amount: 890, resource: "gems" }],
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// AREAS TABLE
// ─────────────────────────────────────────────────────────────────────────────

export const areas_table: OttomanAreaData = {
  1: [
    { amount: 50000, resource: "aspers" },
    { amount: 5000, resource: "wheat" },
    { amount: 5000, resource: "pomegranate" },
  ],
  2: [
    { amount: 75000, resource: "aspers" },
    { amount: 15000, resource: "wheat" },
    { amount: 15000, resource: "pomegranate" },
  ],
  3: [
    { amount: 90000, resource: "aspers" },
    { amount: 15000, resource: "wheat" },
    { amount: 15000, resource: "pomegranate" },
  ],
  4: [
    { amount: 160000, resource: "aspers" },
    { amount: 20000, resource: "wheat" },
    { amount: 20000, resource: "pomegranate" },
  ],
  5: [
    { amount: 250000, resource: "aspers" },
    { amount: 20000, resource: "pomegranate" },
    { amount: 6000, resource: "confection" },
  ],
  6: [
    { amount: 300000, resource: "aspers" },
    { amount: 20000, resource: "wheat" },
    { amount: 6000, resource: "syrup" },
  ],
  7: [
    { amount: 350000, resource: "aspers" },
    { amount: 7500, resource: "confection" },
    { amount: 7500, resource: "syrup" },
  ],
  8: [
    { amount: 400000, resource: "aspers" },
    { amount: 9000, resource: "confection" },
    { amount: 9000, resource: "syrup" },
  ],
  9: [
    { amount: 450000, resource: "aspers" },
    { amount: 10000, resource: "confection" },
    { amount: 10000, resource: "syrup" },
  ],
  10: [
    { amount: 500000, resource: "aspers" },
    { amount: 10000, resource: "confection" },
    { amount: 10000, resource: "syrup" },
  ],
  11: [],
  12: [
    { amount: 100000, resource: "aspers" },
    { amount: 20000, resource: "wheat" },
    { amount: 20000, resource: "pomegranate" },
  ],
  13: [
    { amount: 250000, resource: "aspers" },
    { amount: 10000, resource: "confection" },
    { amount: 10000, resource: "syrup" },
  ],
  14: [
    { amount: 250000, resource: "aspers" },
    { amount: 10000, resource: "confection" },
    { amount: 10000, resource: "syrup" },
  ],
  15: [
    { amount: 400000, resource: "aspers" },
    { amount: 10000, resource: "mohair" },
    { amount: 10000, resource: "apricot" },
  ],
  16: [
    { amount: 750000, resource: "aspers" },
    { amount: 15000, resource: "mohair" },
    { amount: 15000, resource: "apricot" },
  ],
  17: [
    { amount: 1000000, resource: "aspers" },
    { amount: 20000, resource: "mohair" },
    { amount: 6000, resource: "tea" },
  ],
  18: [
    { amount: 1000000, resource: "aspers" },
    { amount: 20000, resource: "apricot" },
    { amount: 6000, resource: "brocade" },
  ],
};

// ─────────────────────────────────────────────────────────────────────────────
// TRADE POSTS TABLE
// ─────────────────────────────────────────────────────────────────────────────

export const trade_post_table: TradePostData[] = [
  // ── AREA 0 ────────────────────────────────────────────────────────────────
  {
    area: 0,
    name: "Cunda Village",
    resource: "wheat",
    levels: villageLevelupEG(),
  },
  {
    area: 0,
    name: "Urla Village",
    resource: "pomegranate",
    levels: villageLevelupEG([{ amount: 5000, resource: "aspers" }]),
  },

  // ── AREA 1 ────────────────────────────────────────────────────────────────
  {
    area: 1,
    name: "Kalkan Village",
    resource: "wheat",
    levels: villageLevelupEG([
      { amount: 25000, resource: "aspers" },
      { amount: 10000, resource: "pomegranate" },
    ]),
  },
  {
    area: 1,
    name: "Bozcaada Village",
    resource: "pomegranate",
    levels: villageLevelupEG(),
  },

  // ── AREA 2 ────────────────────────────────────────────────────────────────
  {
    area: 2,
    name: "Karatas Village",
    resource: "wheat",
    levels: villageLevelupPremium([{ amount: 390, resource: "gems" }]),
  },
  {
    area: 2,
    name: "Sultaniye Village",
    resource: "pomegranate",
    levels: villageLevelupEG(),
  },

  // ── AREA 3 ────────────────────────────────────────────────────────────────
  {
    area: 3,
    name: "Aenos Village",
    resource: "pomegranate",
    levels: villageLevelupPremium([{ amount: 390, resource: "gems" }]),
  },
  {
    area: 3,
    name: "Hadrianopolis City",
    resource: "syrup",
    levels: cityLevelupEG([
      { amount: 35000, resource: "aspers" },
      { amount: 15000, resource: "pomegranate" },
    ]),
  },

  // ── AREA 4 ────────────────────────────────────────────────────────────────
  {
    area: 4,
    name: "Cesme City",
    resource: "confection",
    levels: cityLevelupEG([
      { amount: 10000, resource: "aspers" },
      { amount: 10000, resource: "wheat" },
    ]),
  },

  // ── AREA 5 ────────────────────────────────────────────────────────────────
  {
    area: 5,
    name: "Tarsus City",
    resource: "syrup",
    levels: cityLevelupEG(),
  },

  // ── AREA 6 ────────────────────────────────────────────────────────────────
  {
    area: 6,
    name: "Amasra City",
    resource: "confection",
    levels: cityLevelupPremium([{ amount: 490, resource: "gems" }]),
  },
  {
    area: 6,
    name: "Kavala Village",
    resource: "pomegranate",
    levels: villageLevelupEG([
      { amount: 25000, resource: "aspers" },
      { amount: 5000, resource: "syrup" },
    ]),
  },

  // ── AREA 7 ────────────────────────────────────────────────────────────────
  {
    area: 7,
    name: "Babakale Village",
    resource: "wheat",
    levels: villageLevelupEG(),
  },

  // ── AREA 8 ────────────────────────────────────────────────────────────────
  {
    area: 8,
    name: "Marmara Village",
    resource: "pomegranate",
    levels: villageLevelupEG(),
  },

  // ── AREA 9 ────────────────────────────────────────────────────────────────
  {
    area: 9,
    name: "Smyrna City",
    resource: "syrup",
    levels: cityLevelupPremium([{ amount: 490, resource: "gems" }]),
  },
  {
    area: 9,
    name: "Zalifra Village",
    resource: "wheat",
    levels: villageLevelupEG(),
  },

  // ── AREA 10 ───────────────────────────────────────────────────────────────
  {
    area: 10,
    name: "Susarmia Village",
    resource: "wheat",
    levels: villageLevelupEG(),
  },
  {
    area: 10,
    name: "Bursa City",
    resource: "confection",
    levels: cityLevelupEG([
      { amount: 20000, resource: "aspers" },
      { amount: 15000, resource: "wheat" },
    ]),
  },

  // ── AREA 11 (LGE) ─────────────────────────────────────────────────────────
  {
    area: 11,
    name: "Mut Village",
    resource: "apricot",
    levels: villageLevelupLG(),
  },
  {
    area: 11,
    name: "Bala Village",
    resource: "mohair",
    levels: villageLevelupLG(),
  },

  // ── AREA 12 ───────────────────────────────────────────────────────────────
  {
    area: 12,
    name: "Nallihan Village",
    resource: "mohair",
    levels: villageLevelupPremium([{ amount: 490, resource: "gems" }]),
  },
  {
    area: 12,
    name: "Battalgazi Village",
    resource: "apricot",
    levels: villageLevelupLG(),
  },

  // ── AREA 13 ───────────────────────────────────────────────────────────────
  {
    area: 13,
    name: "Malatya Village",
    resource: "apricot",
    levels: villageLevelupPremium([{ amount: 490, resource: "gems" }]),
  },
  {
    area: 13,
    name: "Hereke City",
    resource: "brocade",
    levels: cityLevelupLG([
      { amount: 50000, resource: "aspers" },
      { amount: 30000, resource: "wheat" },
    ]),
  },

  // ── AREA 14 ───────────────────────────────────────────────────────────────
  {
    area: 14,
    name: "Bor Village",
    resource: "mohair",
    levels: villageLevelupLG(),
  },
  {
    area: 14,
    name: "Cayeli City",
    resource: "tea",
    levels: cityLevelupLG([
      { amount: 50000, resource: "aspers" },
      { amount: 30000, resource: "pomegranate" },
    ]),
  },

  // ── AREA 15 ───────────────────────────────────────────────────────────────
  {
    area: 15,
    name: "Kalecik Village",
    resource: "mohair",
    levels: villageLevelupLG(),
  },

  // ── AREA 16 ───────────────────────────────────────────────────────────────
  {
    area: 16,
    name: "Kahta Village",
    resource: "apricot",
    levels: villageLevelupLG(),
  },
  {
    area: 16,
    name: "Angora Village",
    resource: "mohair",
    levels: villageLevelupLG([
      { amount: 50000, resource: "aspers" },
      { amount: 12000, resource: "syrup" },
    ]),
  },

  // ── AREA 17 ───────────────────────────────────────────────────────────────
  {
    area: 17,
    name: "Darende Village",
    resource: "apricot",
    levels: villageLevelupLG([
      { amount: 50000, resource: "aspers" },
      { amount: 12000, resource: "confection" },
    ]),
  },
  {
    area: 17,
    name: "Manisa City",
    resource: "brocade",
    levels: cityLevelupLG(),
  },

  // ── AREA 18 ───────────────────────────────────────────────────────────────
  {
    area: 18,
    name: "Rize City",
    resource: "tea",
    levels: cityLevelupLG([
      { amount: 50000, resource: "aspers" },
      { amount: 30000, resource: "pomegranate" },
    ]),
  },
];
