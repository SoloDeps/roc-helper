// ============================================================
// ROC Helper – World Wonders: Shared Level Cost Tables
//
// These tables are IDENTICAL across all Wonders and all three
// module files (Ancient World, Great Empires, Stories and Myths).
// They are defined once here and imported by each Wonder dataset.
//
// Source: the Blueprint[], RP3[], RP5[], RP10[], Material[],
//         Capital_Worker[] arrays shared across all Lua modules.
// ============================================================

import type { BlueprintCost, RPCosts, MaterialCosts, CostEntry } from './types';

// --------------- Blueprint costs (levels 1–30) ---------------
// Blueprint required at levels: 1, 5, 10, 15, 20, 25, 30.
// Level 1 → 1 blueprint, no gears cost.
// Levels 5/10/15/20/25/30 → 1 blueprint costing 200 gears.

export const BLUEPRINT_COSTS: Record<number, BlueprintCost> = {
  0:  { required: false, gears: 0 },   // header
  1:  { required: true,  gears: 0 },   // first blueprint, gifted
  2:  { required: false, gears: 0 },
  3:  { required: false, gears: 0 },
  4:  { required: false, gears: 0 },
  5:  { required: true,  gears: 200 },
  6:  { required: false, gears: 0 },
  7:  { required: false, gears: 0 },
  8:  { required: false, gears: 0 },
  9:  { required: false, gears: 0 },
  10: { required: true,  gears: 200 },
  11: { required: false, gears: 0 },
  12: { required: false, gears: 0 },
  13: { required: false, gears: 0 },
  14: { required: false, gears: 0 },
  15: { required: true,  gears: 200 },
  16: { required: false, gears: 0 },
  17: { required: false, gears: 0 },
  18: { required: false, gears: 0 },
  19: { required: false, gears: 0 },
  20: { required: true,  gears: 200 },
  21: { required: false, gears: 0 },
  22: { required: false, gears: 0 },
  23: { required: false, gears: 0 },
  24: { required: false, gears: 0 },
  25: { required: true,  gears: 200 },
  26: { required: false, gears: 0 },
  27: { required: false, gears: 0 },
  28: { required: false, gears: 0 },
  29: { required: false, gears: 0 },
  30: { required: true,  gears: 200 },
};

// --------------- RP costs – Ancient World module ---------------
// Source: RP3[], RP5[], RP10[] in module-ancient-world.lua

export const AW_RP_COSTS: Record<number, RPCosts> = {
  0:  { rp3: null,                      rp5: null,                      rp10: null },
  1:  { rp3: null,                      rp5: null,                      rp10: null },
  2:  { rp3: { amount: 2,  gears: 15 }, rp5: null,                      rp10: null },
  3:  { rp3: { amount: 4,  gears: 15 }, rp5: null,                      rp10: null },
  4:  { rp3: { amount: 10, gears: 15 }, rp5: null,                      rp10: null },
  5:  { rp3: { amount: 23, gears: 15 }, rp5: null,                      rp10: null },
  6:  { rp3: { amount: 17, gears: 15 }, rp5: { amount: 10, gears: 20 }, rp10: null },
  7:  { rp3: { amount: 22, gears: 15 }, rp5: { amount: 13, gears: 20 }, rp10: null },
  8:  { rp3: { amount: 28, gears: 15 }, rp5: { amount: 17, gears: 20 }, rp10: null },
  9:  { rp3: { amount: 34, gears: 15 }, rp5: { amount: 21, gears: 20 }, rp10: null },
  10: { rp3: { amount: 42, gears: 15 }, rp5: { amount: 25, gears: 20 }, rp10: null },
  11: { rp3: { amount: 47, gears: 15 }, rp5: { amount: 28, gears: 20 }, rp10: null },
  12: { rp3: { amount: 48, gears: 15 }, rp5: { amount: 29, gears: 20 }, rp10: null },
  13: { rp3: { amount: 51, gears: 15 }, rp5: { amount: 31, gears: 20 }, rp10: null },
  14: { rp3: { amount: 53, gears: 15 }, rp5: { amount: 32, gears: 20 }, rp10: null },
  15: { rp3: { amount: 55, gears: 15 }, rp5: { amount: 33, gears: 20 }, rp10: null },
  16: { rp3: { amount: 38, gears: 15 }, rp5: { amount: 23, gears: 20 }, rp10: { amount: 11, gears: 35 } },
  17: { rp3: { amount: 40, gears: 15 }, rp5: { amount: 24, gears: 20 }, rp10: { amount: 12, gears: 35 } },
  18: { rp3: { amount: 41, gears: 15 }, rp5: { amount: 24, gears: 20 }, rp10: { amount: 12, gears: 35 } },
  19: { rp3: { amount: 42, gears: 15 }, rp5: { amount: 25, gears: 20 }, rp10: { amount: 13, gears: 35 } },
  20: { rp3: { amount: 44, gears: 15 }, rp5: { amount: 26, gears: 20 }, rp10: { amount: 13, gears: 35 } },
  21: { rp3: { amount: 46, gears: 15 }, rp5: { amount: 27, gears: 20 }, rp10: { amount: 14, gears: 35 } },
  22: { rp3: { amount: 47, gears: 15 }, rp5: { amount: 28, gears: 20 }, rp10: { amount: 14, gears: 35 } },
  23: { rp3: { amount: 49, gears: 15 }, rp5: { amount: 29, gears: 20 }, rp10: { amount: 15, gears: 35 } },
  24: { rp3: { amount: 51, gears: 15 }, rp5: { amount: 30, gears: 20 }, rp10: { amount: 15, gears: 35 } },
  25: { rp3: { amount: 52, gears: 15 }, rp5: { amount: 31, gears: 20 }, rp10: { amount: 16, gears: 35 } },
  26: { rp3: { amount: 54, gears: 15 }, rp5: { amount: 32, gears: 20 }, rp10: { amount: 16, gears: 35 } },
  27: { rp3: { amount: 55, gears: 15 }, rp5: { amount: 33, gears: 20 }, rp10: { amount: 17, gears: 35 } },
  28: { rp3: { amount: 57, gears: 15 }, rp5: { amount: 34, gears: 20 }, rp10: { amount: 17, gears: 35 } },
  29: { rp3: { amount: 58, gears: 15 }, rp5: { amount: 35, gears: 20 }, rp10: { amount: 17, gears: 35 } },
  30: { rp3: { amount: 61, gears: 15 }, rp5: { amount: 36, gears: 20 }, rp10: { amount: 18, gears: 35 } },
};

// --------------- RP costs – Great Empires / Stories and Myths ---------------
// Source: RP3[], RP5[], RP10[] in module-great-empires.lua
// (identical in module-stories-and-myths.lua)

export const GE_SM_RP_COSTS: Record<number, RPCosts> = {
  0:  { rp3: null,                      rp5: null,                      rp10: null },
  1:  { rp3: null,                      rp5: null,                      rp10: null },
  2:  { rp3: { amount: 3,  gears: 15 }, rp5: { amount: 3,  gears: 20 }, rp10: null },
  3:  { rp3: { amount: 5,  gears: 15 }, rp5: { amount: 3,  gears: 20 }, rp10: { amount: 1,  gears: 35 } },
  4:  { rp3: { amount: 6,  gears: 15 }, rp5: { amount: 4,  gears: 20 }, rp10: { amount: 2,  gears: 35 } },
  5:  { rp3: { amount: 7,  gears: 15 }, rp5: { amount: 5,  gears: 20 }, rp10: { amount: 3,  gears: 35 } },
  6:  { rp3: { amount: 9,  gears: 15 }, rp5: { amount: 7,  gears: 20 }, rp10: { amount: 4,  gears: 35 } },
  7:  { rp3: { amount: 11, gears: 15 }, rp5: { amount: 9,  gears: 20 }, rp10: { amount: 6,  gears: 35 } },
  8:  { rp3: { amount: 13, gears: 15 }, rp5: { amount: 11, gears: 20 }, rp10: { amount: 8,  gears: 35 } },
  9:  { rp3: { amount: 16, gears: 15 }, rp5: { amount: 14, gears: 20 }, rp10: { amount: 10, gears: 35 } },
  10: { rp3: { amount: 20, gears: 15 }, rp5: { amount: 17, gears: 20 }, rp10: { amount: 12, gears: 35 } },
  11: { rp3: { amount: 22, gears: 15 }, rp5: { amount: 19, gears: 20 }, rp10: { amount: 14, gears: 35 } },
  12: { rp3: { amount: 23, gears: 15 }, rp5: { amount: 20, gears: 20 }, rp10: { amount: 15, gears: 35 } },
  13: { rp3: { amount: 24, gears: 15 }, rp5: { amount: 21, gears: 20 }, rp10: { amount: 16, gears: 35 } },
  14: { rp3: { amount: 25, gears: 15 }, rp5: { amount: 22, gears: 20 }, rp10: { amount: 17, gears: 35 } },
  15: { rp3: { amount: 26, gears: 15 }, rp5: { amount: 23, gears: 20 }, rp10: { amount: 18, gears: 35 } },
  16: { rp3: { amount: 27, gears: 15 }, rp5: { amount: 24, gears: 20 }, rp10: { amount: 19, gears: 35 } },
  17: { rp3: { amount: 28, gears: 15 }, rp5: { amount: 25, gears: 20 }, rp10: { amount: 20, gears: 35 } },
  18: { rp3: { amount: 29, gears: 15 }, rp5: { amount: 26, gears: 20 }, rp10: { amount: 21, gears: 35 } },
  19: { rp3: { amount: 30, gears: 15 }, rp5: { amount: 27, gears: 20 }, rp10: { amount: 22, gears: 35 } },
  20: { rp3: { amount: 31, gears: 15 }, rp5: { amount: 28, gears: 20 }, rp10: { amount: 23, gears: 35 } },
  21: { rp3: { amount: 32, gears: 15 }, rp5: { amount: 29, gears: 20 }, rp10: { amount: 24, gears: 35 } },
  22: { rp3: { amount: 33, gears: 15 }, rp5: { amount: 30, gears: 20 }, rp10: { amount: 25, gears: 35 } },
  23: { rp3: { amount: 34, gears: 15 }, rp5: { amount: 31, gears: 20 }, rp10: { amount: 26, gears: 35 } },
  24: { rp3: { amount: 35, gears: 15 }, rp5: { amount: 32, gears: 20 }, rp10: { amount: 27, gears: 35 } },
  25: { rp3: { amount: 36, gears: 15 }, rp5: { amount: 33, gears: 20 }, rp10: { amount: 28, gears: 35 } },
  26: { rp3: { amount: 37, gears: 15 }, rp5: { amount: 34, gears: 20 }, rp10: { amount: 29, gears: 35 } },
  27: { rp3: { amount: 38, gears: 15 }, rp5: { amount: 35, gears: 20 }, rp10: { amount: 30, gears: 35 } },
  28: { rp3: { amount: 39, gears: 15 }, rp5: { amount: 36, gears: 20 }, rp10: { amount: 31, gears: 35 } },
  29: { rp3: { amount: 40, gears: 15 }, rp5: { amount: 37, gears: 20 }, rp10: { amount: 32, gears: 35 } },
  30: { rp3: { amount: 41, gears: 15 }, rp5: { amount: 38, gears: 20 }, rp10: { amount: 33, gears: 35 } },
};

// --------------- Material costs (shared across all modules) ---------------
// Material1/Material2 amounts and gear values are identical for ALL Wonders
// regardless of which materials they use.
// Source: Material[] array – identical in all three Lua modules.

/**
 * Returns the MaterialCosts for a given level.
 * The material amounts/gears are universal; the caller substitutes
 * the actual material types (material1 / material2) from WonderMeta.
 *
 * At level 0 (header) and level 1 (no material required) → returns null.
 */
export function getMaterialAmounts(level: number): { mat1: CostEntry; mat2: CostEntry } | null {
  if (level <= 1) return null;

  // Lookup table: [mat1_amount, mat1_gears, mat2_amount, mat2_gears]
  const MAT: Record<number, [number, number, number, number]> = {
    2:  [1, 25, 1, 25],
    3:  [1, 25, 1, 25],
    4:  [1, 25, 1, 25],
    5:  [1, 25, 2, 50],
    6:  [2, 50, 1, 25],
    7:  [1, 25, 2, 50],
    8:  [2, 50, 2, 50],
    9:  [2, 50, 2, 50],
    10: [2, 50, 2, 50],
    11: [2, 50, 2, 50],
    12: [2, 50, 2, 50],
    13: [2, 50, 3, 75],
    14: [3, 75, 2, 50],
    15: [2, 50, 3, 75],
    16: [3, 75, 2, 50],
    17: [2, 50, 3, 75],
    18: [3, 75, 3, 75],
    19: [3, 75, 3, 75],
    20: [3, 75, 3, 75],
    21: [3, 75, 3, 75],
    22: [3, 75, 3, 75],
    23: [3, 75, 4, 100],
    24: [4, 100, 3, 75],
    25: [3, 75, 4, 100],
    26: [4, 100, 3, 75],
    27: [3, 75, 4, 100],
    28: [4, 100, 4, 100],
    29: [4, 100, 4, 100],
    30: [4, 100, 4, 100],
  };

  const row = MAT[level];
  if (!row) return null;
  return {
    mat1: { amount: row[0], gears: row[1] },
    mat2: { amount: row[2], gears: row[3] },
  };
}

// --------------- Capital City workers (Ancient World module) ---------------
// Source: Capital_Worker[] in module-ancient-world.lua
// Scales from 5 workers at levels 2–11, then +1 every 2 levels thereafter.

export const AW_CAPITAL_WORKERS: Record<number, number | null> = {
  0: null, 1: null,   // header / no cost
  2: 5,  3: 5,  4: 5,  5: 5,  6: 5,  7: 5,  8: 5,  9: 5,  10: 5, 11: 5,
  12: 6, 13: 6, 14: 7, 15: 7, 16: 8, 17: 8, 18: 9, 19: 9, 20: 10,
  21: 10, 22: 11, 23: 11, 24: 12, 25: 12, 26: 13, 27: 13, 28: 14, 29: 14, 30: 15,
};

// --------------- Capital City workers (Great Empires / Stories and Myths) ---------------
// Source: Capital_Worker[] in module-great-empires.lua / module-stories-and-myths.lua
// Starts at 10 instead of 5.

export const GE_SM_CAPITAL_WORKERS: Record<number, number | null> = {
  0: null, 1: null,
  2: 10, 3: 10, 4: 10, 5: 10, 6: 10, 7: 10, 8: 10, 9: 10, 10: 10, 11: 10,
  12: 12, 13: 12, 14: 14, 15: 14, 16: 16, 17: 16, 18: 18, 19: 18, 20: 20,
  21: 20, 22: 22, 23: 22, 24: 24, 25: 24, 26: 26, 27: 26, 28: 28, 29: 28, 30: 30,
};
