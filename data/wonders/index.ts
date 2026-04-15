// ============================================================
// ROC Helper – World Wonders: Main Registry
//
// Assembles all Wonder records by combining:
//   - WonderMeta (from module-world-wonders.lua Wonder_Array)
//   - Per-level costs (shared-costs, goods-costs, coin-food-costs)
//   - Per-level bonuses (bonuses.ts)
//
// The exported `WONDERS` map is the single source of truth for
// the entire Wonder dataset consumed by the UI.
// ============================================================

import type {
  Wonder,
  WonderMeta,
  WonderLevel,
  MaterialCosts,
  GoodsEntry,
  CoinCosts,
  FoodCosts,
} from './types';

import {
  BLUEPRINT_COSTS,
  AW_RP_COSTS,
  GE_SM_RP_COSTS,
  getMaterialAmounts,
  AW_CAPITAL_WORKERS,
  GE_SM_CAPITAL_WORKERS,
} from './shared-costs';

import {
  AW_CAPITAL_GOODS,
  GE_CAPITAL_GOODS,
  SM_CAPITAL_GOODS,
  EGYPT_GOODS,
  CHINA_GOODS,
  MAYA_GOODS,
  VIKING_GOODS,
  ARABIA_GOODS,
} from './goods-costs';

import {
  AW_COIN_COSTS,
  AW_FOOD_COSTS,
  GE_COIN_COSTS,
  GE_FOOD_COSTS,
  SM_COIN_COSTS,
  SM_FOOD_COSTS,
  ARABIA_COIN_COSTS,
  ARABIA_FOOD_COSTS,
} from './coin-food-costs';

import {
  STONEHENGE_BONUSES,
  HANGING_GARDENS_BONUSES,
  STATUE_OF_ZEUS_BONUSES,
  TEMPLE_OF_ARTEMIS_BONUSES,
  CHEOPS_PYRAMID_BONUSES,
  GREAT_SPHINX_BONUSES,
  ABU_SIMBEL_BONUSES,
  TOMB_OF_MAUSOLUS_BONUSES,
  LIGHTHOUSE_BONUSES,
  COLOSSUS_BONUSES,
  HAGIA_SOPHIA_BONUSES,
  COLOSSEUM_BONUSES,
  PALACE_OF_AACHEN_BONUSES,
  SHERWOOD_FOREST_BONUSES,
  TERRACOTTA_ARMY_BONUSES,
  FORBIDDEN_CITY_BONUSES,
  GREAT_WALL_BONUSES,
  SAYIL_PALACE_BONUSES,
  TIKAL_BONUSES,
  CHICHEN_ITZA_BONUSES,
  CITE_DE_CARCASSONNE_BONUSES,
  LEANING_TOWER_BONUSES,
  ALHAMBRA_BONUSES,
  DRAGONSHIP_ELLIDA_BONUSES,
  VALHALLA_BONUSES,
  YGGDRASIL_BONUSES,
  PETRA_BONUSES,
  CITY_OF_BRASS_BONUSES,
} from './bonuses';

// ============================================================
// Internal assembly helper
// ============================================================

type ModuleType = 'AW' | 'GE' | 'SM';

interface AssemblyConfig {
  meta: WonderMeta;
  module: ModuleType;
  bonuses: Record<number, import('./types').BonusValue[]>;
}

function assembleWonder(cfg: AssemblyConfig): Wonder {
  const { meta, module, bonuses } = cfg;

  const rpTable      = module === 'AW' ? AW_RP_COSTS : GE_SM_RP_COSTS;
  const workersTable = module === 'AW' ? AW_CAPITAL_WORKERS : GE_SM_CAPITAL_WORKERS;

  // Select goods table based on slot
  const goodsTable: Record<number, GoodsEntry[]> =
    meta.slot === 'Egypt'         ? EGYPT_GOODS    :
    meta.slot === 'China'         ? CHINA_GOODS    :
    meta.slot === 'Maya Empire'   ? MAYA_GOODS     :
    meta.slot === 'Viking Kingdom'? VIKING_GOODS   :
    meta.slot === 'Arabia'        ? ARABIA_GOODS   :
    // Capital City – module specific
    module === 'AW'               ? AW_CAPITAL_GOODS :
    module === 'GE'               ? GE_CAPITAL_GOODS :
    /* SM */                        SM_CAPITAL_GOODS;

  // Select coin/food tables
  const coinTable: Record<number, CoinCosts> =
    meta.slot === 'Arabia'        ? ARABIA_COIN_COSTS :
    module === 'AW'               ? AW_COIN_COSTS     :
    module === 'GE'               ? GE_COIN_COSTS     :
    /* SM */                        SM_COIN_COSTS;

  const foodTable: Record<number, FoodCosts> =
    meta.slot === 'Arabia'        ? ARABIA_FOOD_COSTS :
    module === 'AW'               ? AW_FOOD_COSTS     :
    module === 'GE'               ? GE_FOOD_COSTS     :
    /* SM */                        SM_FOOD_COSTS;

  const levels: WonderLevel[] = [];

  for (let level = 0; level <= 30; level++) {
    const matAmounts = getMaterialAmounts(level);

    let materials: MaterialCosts | null = null;
    if (matAmounts) {
      materials = {
        material1: matAmounts.mat1,
        material2: matAmounts.mat2,
      };
    }

    const workers = meta.slot === 'Capital City'
      ? (workersTable[level] ?? null)
      : null;

    levels.push({
      level,
      blueprint: BLUEPRINT_COSTS[level] ?? { required: false, gears: 0 },
      rp:        rpTable[level] ?? { rp3: null, rp5: null, rp10: null },
      materials,
      goods:     goodsTable[level]  ?? [],
      coins:     coinTable[level]   ?? [],
      food:      foodTable[level]   ?? [],
      workers,
      bonuses:   level === 0 ? [] : (bonuses[level] ?? []),
    });
  }

  return { meta, levels };
}

// ============================================================
// Wonder metadata registry
// (Directly mirrors Wonder_Array in module-world-wonders.lua)
// ============================================================

const META: Record<string, WonderMeta> = {
  SH: {
    code: 'SH', name: 'Stonehenge',
    group: 'Ancient World', groupCode: 'AW',
    slot: 'Capital City', slotLabel: 'Capital City',
    material1: 'Temple', material2: 'Statue',
    synergyTag: 'Temple', synergyBonuses: ['1 RP/1d'],
    rarity: 'Rare',
  },
  HG: {
    code: 'HG', name: 'Hanging Gardens',
    group: 'Ancient World', groupCode: 'AW',
    slot: 'Capital City', slotLabel: 'Capital City',
    material1: 'Nature', material2: 'Palace',
    synergyTag: 'Palace', synergyBonuses: ['Food +8%'],
    rarity: 'Rare',
  },
  SoZ: {
    code: 'SoZ', name: 'Statue of Zeus',
    group: 'Ancient World', groupCode: 'AW',
    slot: 'Capital City', slotLabel: 'Capital City',
    material1: 'Statue', material2: 'Statue',
    synergyTag: 'Statue', synergyBonuses: ['Infantry Damage +4%'],
    rarity: 'Rare',
  },
  ToA: {
    code: 'ToA', name: 'Temple of Artemis',
    group: 'Ancient World', groupCode: 'AW',
    slot: 'Capital City', slotLabel: 'Capital City',
    material1: 'Temple', material2: 'Temple',
    synergyTag: 'Statue', synergyBonuses: ['Ranged Damage +4%'],
    rarity: 'Legendary',
  },
  CP: {
    code: 'CP', name: 'Cheops Pyramid',
    group: 'Ancient World', groupCode: 'AW',
    slot: 'Egypt', slotLabel: 'Allied: Egypt',
    material1: 'Temple', material2: 'Temple',
    synergyTag: 'Temple', synergyBonuses: ['60 of each previous era goods'],
    rarity: 'Rare',
  },
  GS: {
    code: 'GS', name: 'Great Sphinx',
    group: 'Ancient World', groupCode: 'AW',
    slot: 'Egypt', slotLabel: 'Allied: Egypt',
    material1: 'Statue', material2: 'Statue',
    synergyTag: 'Statue', synergyBonuses: ['Cavalry Damage +4%'],
    rarity: 'Rare',
  },
  AS: {
    code: 'AS', name: 'Abu Simbel',
    group: 'Ancient World', groupCode: 'AW',
    slot: 'Egypt', slotLabel: 'Allied: Egypt',
    material1: 'Palace', material2: 'Palace',
    synergyTag: 'Statue', synergyBonuses: ['1 RP/1d'],
    rarity: 'Legendary',
  },
  ToM: {
    code: 'ToM', name: 'Tomb of Mausolus',
    group: 'Ancient World', groupCode: 'AW',
    slot: 'Capital City', slotLabel: 'Capital City',
    material1: 'Temple', material2: 'Temple',
    synergyTag: 'Temple', synergyBonuses: ['100 current era primary goods'],
    rarity: 'Rare',
  },
  LoA: {
    code: 'LoA', name: 'Lighthouse of Alexandria',
    group: 'Ancient World', groupCode: 'AW',
    slot: 'Capital City', slotLabel: 'Capital City',
    material1: 'Naval', material2: 'Temple',
    synergyTag: 'Naval', synergyBonuses: ['Trade: Goods +5%'],
    rarity: 'Rare',
  },
  CoR: {
    code: 'CoR', name: 'Colossus of Rhodes',
    group: 'Ancient World', groupCode: 'AW',
    slot: 'Capital City', slotLabel: 'Capital City',
    material1: 'Naval', material2: 'Statue',
    synergyTag: 'Naval', synergyBonuses: ['Donations: Gears +5%'],
    rarity: 'Legendary',
  },
  // Great Empires
  HS: {
    code: 'HS', name: 'Hagia Sophia',
    group: 'Great Empires', groupCode: 'GE',
    slot: 'Capital City', slotLabel: 'Capital City',
    material1: 'Temple', material2: 'Temple',
    synergyTag: '', synergyBonuses: ['-'],
    rarity: 'Rare',
  },
  C: {
    code: 'C', name: 'Colosseum',
    group: 'Great Empires', groupCode: 'GE',
    slot: 'Capital City', slotLabel: 'Capital City',
    material1: 'Arena', material2: 'Fortress',
    synergyTag: 'Statue', synergyBonuses: ['Heavy Infantry Damage +4%'],
    rarity: 'Rare',
  },
  PoA: {
    code: 'PoA', name: 'Palace of Aachen',
    group: 'Great Empires', groupCode: 'GE',
    slot: 'Capital City', slotLabel: 'Capital City',
    material1: 'Palace', material2: 'Fortress',
    synergyTag: 'Fortress', synergyBonuses: ['Infantry HP +2%'],
    rarity: 'Rare',
  },
  SF: {
    code: 'SF', name: 'Sherwood Forest',
    group: 'Great Empires', groupCode: 'GE',
    slot: 'Capital City', slotLabel: 'Capital City',
    material1: 'Nature', material2: 'Fortress',
    synergyTag: 'Fortress', synergyBonuses: ['Ranged HP +2%'],
    rarity: 'Legendary',
  },
  TA: {
    code: 'TA', name: 'Terracotta Army',
    group: 'Great Empires', groupCode: 'GE',
    slot: 'China', slotLabel: 'Allied: China',
    material1: 'Statue', material2: 'Fortress',
    synergyTag: 'Fortress', synergyBonuses: ['Heavy Infantry HP +2%'],
    rarity: 'Rare',
  },
  FC: {
    code: 'FC', name: 'Forbidden City',
    group: 'Great Empires', groupCode: 'GE',
    slot: 'China', slotLabel: 'Allied: China',
    material1: 'Temple', material2: 'Palace',
    synergyTag: 'Temple', synergyBonuses: ['60 of each current era goods'],
    rarity: 'Rare',
  },
  GW: {
    code: 'GW', name: 'Great Wall',
    group: 'Great Empires', groupCode: 'GE',
    slot: 'China', slotLabel: 'Allied: China',
    material1: 'Fortress', material2: 'Fortress',
    synergyTag: 'Fortress', synergyBonuses: ['+1 RP/1d'],
    rarity: 'Legendary',
  },
  SP: {
    code: 'SP', name: 'Sayil Palace',
    group: 'Great Empires', groupCode: 'GE',
    slot: 'Maya Empire', slotLabel: 'Allied: Maya',
    material1: 'Palace', material2: 'Fortress',
    synergyTag: 'Fortress', synergyBonuses: ['Bastion HP +2%'],
    rarity: 'Rare',
  },
  T: {
    code: 'T', name: 'Tikal',
    group: 'Great Empires', groupCode: 'GE',
    slot: 'Maya Empire', slotLabel: 'Allied: Maya',
    material1: 'Arena', material2: 'Arena',
    synergyTag: 'Arena', synergyBonuses: ['Boost Capital Goods +5%'],
    rarity: 'Rare',
  },
  CI: {
    code: 'CI', name: 'Chichen Itza',
    group: 'Great Empires', groupCode: 'GE',
    slot: 'Maya Empire', slotLabel: 'Allied: Maya',
    material1: 'Temple', material2: 'Arena',
    synergyTag: 'Arena', synergyBonuses: ['Ranged Critical Hit Chance +1%'],
    rarity: 'Legendary',
  },
  // Stories and Myths
  A: {
    code: 'A', name: 'Alhambra',
    group: 'Stories and Myths', groupCode: 'SM',
    slot: 'Capital City', slotLabel: 'Capital City',
    material1: 'Nature', material2: 'Fortress',
    synergyTag: '', synergyBonuses: ['-'],
    rarity: 'Rare',
  },
  CC: {
    code: 'CC', name: 'Cité de Carcassonne',
    group: 'Stories and Myths', groupCode: 'SM',
    slot: 'Capital City', slotLabel: 'Capital City',
    material1: 'Palace', material2: 'Fortress',
    synergyTag: '', synergyBonuses: ['-'],
    rarity: 'Rare',
  },
  LToP: {
    code: 'LToP', name: 'Leaning Tower of Pisa',
    group: 'Stories and Myths', groupCode: 'SM',
    slot: 'Capital City', slotLabel: 'Capital City',
    material1: 'Nature', material2: 'Temple',
    synergyTag: 'Nature', synergyBonuses: ['Speed up RP regen 2.5%'],
    rarity: 'Legendary',
  },
  Y: {
    code: 'Y', name: 'Yggdrasil',
    group: 'Stories and Myths', groupCode: 'SM',
    slot: 'Viking Kingdom', slotLabel: 'Allied: Vikings',
    material1: 'Nature', material2: 'Statue',
    synergyTag: '', synergyBonuses: ['-'],
    rarity: 'Rare',
  },
  DE: {
    code: 'DE', name: 'Dragonship Ellida',
    group: 'Stories and Myths', groupCode: 'SM',
    slot: 'Viking Kingdom', slotLabel: 'Allied: Vikings',
    material1: 'Naval', material2: 'Naval',
    synergyTag: '', synergyBonuses: ['-'],
    rarity: 'Rare',
  },
  V: {
    code: 'V', name: 'Valhalla',
    group: 'Stories and Myths', groupCode: 'SM',
    slot: 'Viking Kingdom', slotLabel: 'Allied: Vikings',
    material1: 'Arena', material2: 'Arena',
    synergyTag: 'Palace', synergyBonuses: ['All Units Damage +1.5%'],
    rarity: 'Legendary',
  },
  P: {
    code: 'P', name: 'Petra',
    group: 'Stories and Myths', groupCode: 'SM',
    slot: 'Arabia', slotLabel: 'Allied: Arabia',
    material1: 'Temple', material2: 'Fortress',
    synergyTag: 'Temple', synergyBonuses: ['Boost Capital Goods +5%'],
    rarity: 'Rare',
  },
  CoB: {
    code: 'CoB', name: 'City of Brass',
    group: 'Stories and Myths', groupCode: 'SM',
    slot: 'Arabia', slotLabel: 'Allied: Arabia',
    material1: 'Palace', material2: 'Palace',
    synergyTag: 'Palace', synergyBonuses: ['Cavalry Movement Speed +10%', 'Boost Bazaar Offers +10%'],
    rarity: 'Legendary',
  },
};

// ============================================================
// Assemble all Wonders
// ============================================================

/** All Wonder records keyed by their short code (e.g. 'SH', 'LToP'). */
export const WONDERS: Record<string, Wonder> = {
  // Ancient World
  SH:  assembleWonder({ meta: META.SH,  module: 'AW', bonuses: STONEHENGE_BONUSES }),
  HG:  assembleWonder({ meta: META.HG,  module: 'AW', bonuses: HANGING_GARDENS_BONUSES }),
  SoZ: assembleWonder({ meta: META.SoZ, module: 'AW', bonuses: STATUE_OF_ZEUS_BONUSES }),
  ToA: assembleWonder({ meta: META.ToA, module: 'AW', bonuses: TEMPLE_OF_ARTEMIS_BONUSES }),
  CP:  assembleWonder({ meta: META.CP,  module: 'AW', bonuses: CHEOPS_PYRAMID_BONUSES }),
  GS:  assembleWonder({ meta: META.GS,  module: 'AW', bonuses: GREAT_SPHINX_BONUSES }),
  AS:  assembleWonder({ meta: META.AS,  module: 'AW', bonuses: ABU_SIMBEL_BONUSES }),
  ToM: assembleWonder({ meta: META.ToM, module: 'AW', bonuses: TOMB_OF_MAUSOLUS_BONUSES }),
  LoA: assembleWonder({ meta: META.LoA, module: 'AW', bonuses: LIGHTHOUSE_BONUSES }),
  CoR: assembleWonder({ meta: META.CoR, module: 'AW', bonuses: COLOSSUS_BONUSES }),
  // Great Empires
  HS:  assembleWonder({ meta: META.HS,  module: 'GE', bonuses: HAGIA_SOPHIA_BONUSES }),
  C:   assembleWonder({ meta: META.C,   module: 'GE', bonuses: COLOSSEUM_BONUSES }),
  PoA: assembleWonder({ meta: META.PoA, module: 'GE', bonuses: PALACE_OF_AACHEN_BONUSES }),
  SF:  assembleWonder({ meta: META.SF,  module: 'GE', bonuses: SHERWOOD_FOREST_BONUSES }),
  TA:  assembleWonder({ meta: META.TA,  module: 'GE', bonuses: TERRACOTTA_ARMY_BONUSES }),
  FC:  assembleWonder({ meta: META.FC,  module: 'GE', bonuses: FORBIDDEN_CITY_BONUSES }),
  GW:  assembleWonder({ meta: META.GW,  module: 'GE', bonuses: GREAT_WALL_BONUSES }),
  SP:  assembleWonder({ meta: META.SP,  module: 'GE', bonuses: SAYIL_PALACE_BONUSES }),
  T:   assembleWonder({ meta: META.T,   module: 'GE', bonuses: TIKAL_BONUSES }),
  CI:  assembleWonder({ meta: META.CI,  module: 'GE', bonuses: CHICHEN_ITZA_BONUSES }),
  // Stories and Myths
  A:   assembleWonder({ meta: META.A,   module: 'SM', bonuses: ALHAMBRA_BONUSES }),
  CC:  assembleWonder({ meta: META.CC,  module: 'SM', bonuses: CITE_DE_CARCASSONNE_BONUSES }),
  LToP:assembleWonder({ meta: META.LToP,module: 'SM', bonuses: LEANING_TOWER_BONUSES }),
  Y:   assembleWonder({ meta: META.Y,   module: 'SM', bonuses: YGGDRASIL_BONUSES }),
  DE:  assembleWonder({ meta: META.DE,  module: 'SM', bonuses: DRAGONSHIP_ELLIDA_BONUSES }),
  V:   assembleWonder({ meta: META.V,   module: 'SM', bonuses: VALHALLA_BONUSES }),
  P:   assembleWonder({ meta: META.P,   module: 'SM', bonuses: PETRA_BONUSES }),
  CoB: assembleWonder({ meta: META.CoB, module: 'SM', bonuses: CITY_OF_BRASS_BONUSES }),
};

/** Ordered list of all Wonder codes (preserving wiki group order). */
export const WONDER_CODES: string[] = Object.keys(WONDERS);

/** Quick lookup: get a Wonder by code. Returns undefined if not found. */
export function getWonder(code: string): Wonder | undefined {
  return WONDERS[code];
}

/** Quick lookup: get a Wonder by name (case-insensitive). */
export function getWonderByName(name: string): Wonder | undefined {
  const lower = name.toLowerCase();
  return Object.values(WONDERS).find(w => w.meta.name.toLowerCase() === lower);
}

/**
 * Returns the level data for a specific Wonder + level.
 * @param code  - Wonder short code
 * @param level - 0–30
 */
export function getWonderLevel(code: string, level: number): WonderLevel | undefined {
  return WONDERS[code]?.levels[level];
}

/**
 * Computes aggregated totals for a range of levels [fromLevel, toLevel].
 * Useful for the "condensed view" feature in the UI.
 *
 * @returns  An object with summed RP, materials, goods, coins, food amounts.
 *           Note: workers is the value at toLevel (the last required level).
 */
export function aggregateLevelRange(
  code: string,
  fromLevel: number,
  toLevel: number,
): {
  totalRP3: number; totalRP5: number; totalRP10: number;
  totalMat1: number; totalMat2: number;
  totalCoins: number; totalFood: number;
  goodsTotals: Record<string, number>;
  blueprintsRequired: number; blueprintGears: number;
  workersPeak: number | null;
} | null {
  const wonder = WONDERS[code];
  if (!wonder) return null;

  let totalRP3 = 0, totalRP5 = 0, totalRP10 = 0;
  let totalMat1 = 0, totalMat2 = 0;
  let totalCoins = 0, totalFood = 0;
  let blueprintsRequired = 0, blueprintGears = 0;
  let workersPeak: number | null = null;
  const goodsTotals: Record<string, number> = {};

  for (let lvl = fromLevel + 1; lvl <= toLevel; lvl++) {
    const row = wonder.levels[lvl];
    if (!row) continue;

    // RP
    totalRP3  += row.rp.rp3?.amount  ?? 0;
    totalRP5  += row.rp.rp5?.amount  ?? 0;
    totalRP10 += row.rp.rp10?.amount ?? 0;

    // Materials
    totalMat1 += row.materials?.material1.amount ?? 0;
    totalMat2 += row.materials?.material2.amount ?? 0;

    // Coin
    for (const coin of row.coins) totalCoins += coin.amount;

    // Food
    for (const food of row.food) totalFood += food.amount;

    // Goods
    for (const good of row.goods) {
      goodsTotals[good.iconKey] = (goodsTotals[good.iconKey] ?? 0) + good.amount;
    }

    // Blueprints
    if (row.blueprint.required) {
      blueprintsRequired++;
      blueprintGears += row.blueprint.gears;
    }

    // Workers (peak = highest required in range)
    if (row.workers !== null) {
      workersPeak = Math.max(workersPeak ?? 0, row.workers);
    }
  }

  return {
    totalRP3, totalRP5, totalRP10,
    totalMat1, totalMat2,
    totalCoins, totalFood,
    goodsTotals,
    blueprintsRequired, blueprintGears,
    workersPeak,
  };
}
