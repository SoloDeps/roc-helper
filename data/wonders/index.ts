import type {
  Wonder,
  WonderMeta,
  WonderLevel,
  WonderBonus,
  MaterialType,
  WonderGroup,
  WonderGroupCode,
  WonderSlot,
} from "./types";

import { data as WONDER_DATA } from "./wonders";

// ─── Cost Tables ───────────────────────────────────────────────────────────────

const RP_COSTS_AW = [
  0, 0, 2, 4, 10, 23, 17, 22, 28, 34, 42, 47, 48, 51, 53, 55, 38, 40, 41, 42,
  44, 46, 47, 49, 51, 52, 54, 56, 57, 59, 61,
];

const RP_COSTS_GE_SM = [
  0, 0, 3, 6, 12, 27, 20, 26, 33, 40, 49, 55, 56, 59, 62, 64, 45, 47, 49, 50,
  52, 54, 56, 58, 60, 61, 64, 66, 68, 70, 72,
];

const MAT_COSTS: [number, number][] = [
  [0, 0],
  [3, 3],
  [5, 5],
  [7, 7],
  [9, 9],
  [10, 10],
  [11, 11],
  [13, 13],
  [14, 14],
  [15, 15],
  [17, 17],
  [18, 18],
  [19, 19],
  [20, 20],
  [21, 21],
  [23, 23],
  [24, 24],
  [25, 25],
  [26, 26],
  [28, 28],
  [30, 30],
  [30, 30],
  [32, 32],
  [33, 33],
  [35, 35],
  [36, 36],
  [37, 37],
  [39, 39],
  [40, 40],
  [41, 41],
  [43, 43],
];

const COIN_COSTS_AW = [
  0, 0, 500000, 700000, 1000000, 2000000, 2500000, 2500000, 3500000, 3500000,
  5000000, 500000, 1000000, 2500000, 2500000, 3500000, 5000000, 5000000, 500000,
  1000000, 2500000, 2500000, 5000000, 5000000, 1000000, 2500000, 2500000,
  5000000, 5000000, 1000000, 2500000,
];

const BLUEPRINT_LEVELS = new Set([1, 5, 10, 15, 20, 25, 30]);

// ─── Level builder ────────────────────────────────────────────────────────────

function buildLevels(groupCode: WonderGroupCode): Record<number, WonderLevel> {
  const rpTable = groupCode === "AW" ? RP_COSTS_AW : RP_COSTS_GE_SM;
  const levels: Record<number, WonderLevel> = {};
  for (let lv = 1; lv <= 30; lv++) {
    levels[lv] = {
      level: lv,
      rpCost: rpTable[lv] ?? 0,
      mat1Cost: MAT_COSTS[lv]?.[0] ?? 0,
      mat2Cost: MAT_COSTS[lv]?.[1] ?? 0,
      coinCost: COIN_COSTS_AW[lv] ?? 0,
      isBlueprint: BLUEPRINT_LEVELS.has(lv),
    };
  }
  return levels;
}

// ─── Meta builder ─────────────────────────────────────────────────────────────

function resolveGroupCode(group: WonderGroup): WonderGroupCode {
  if (group === "Ancient World") return "AW";
  if (group === "Great Empires") return "GE";
  return "SM";
}

function resolveSlotLabel(slot: WonderSlot): string {
  return slot;
}

/**
 * Maps the raw synergy tag from wonders.ts to the synergyBonus display string.
 * This is a fixed label per Wonder (not computed from level values).
 * Synergy multipliers are computed at runtime in wonders-utils.ts.
 */
const SYNERGY_BONUS_LABELS: Record<string, string> = {
  // Ancient World
  SH: "+1 RP/day",
  HG: "Food +8%",
  SoZ: "Infantry Dmg +4%",
  ToA: "Ranged Dmg +4%",
  ToM: "+100 primary goods",
  LoA: "Trade Goods +5%",
  CoR: "Donations: Gears +5%",
  CP: "+60 previous era goods",
  GS: "Cavalry Dmg +4%",
  AS: "+1 RP/day",
  // Great Empires
  C: "Heavy Inf Dmg +4%", // Colosseum
  PoA: "Infantry HP +2%",
  SF: "Ranged HP +2%",
  TA: "Heavy Inf HP +2%",
  FC: "+60 current era goods",
  GW: "+1 RP/day",
  SP: "Bastion HP +2%",
  Tikal: "Capital Goods +5%",
  CI: "Ranged Crit +1%",
  // Stories and Myths
  LToP: "RP regen ×2.5%",
  V: "All Units Dmg +1.5%",
  P: "Capital Goods +5%",
  CoB: "Cavalry Speed +10%, Bazaar +10%",
};

// ─── Wonder assembly ──────────────────────────────────────────────────────────

function assembleWonder(raw: (typeof WONDER_DATA)[number]): Wonder {
  const groupCode = resolveGroupCode(raw.meta.group as WonderGroup);

  const meta: WonderMeta = {
    code: raw.meta.code,
    name: raw.meta.name,
    group: raw.meta.group as WonderGroup,
    groupCode,
    slot: raw.meta.slot as WonderSlot,
    slotLabel: resolveSlotLabel(raw.meta.slot as WonderSlot),
    material1: raw.meta.materials[0] as MaterialType,
    material2: raw.meta.materials[1] as MaterialType,
    synergyTag: raw.meta.synergy
      ? (raw.meta.synergy.raw as MaterialType)
      : null,
    synergyBonus: raw.meta.synergy
      ? (SYNERGY_BONUS_LABELS[raw.meta.code] ?? null)
      : null,
    rarity: "Epic",
    maxLevel: 30,
  };

  const bonuses: WonderBonus[] = raw.bonuses.map((b) => ({
    type: b.type,
    icons: b.icons as [string, string | null],
    values: b.values,
  }));

  return {
    meta,
    bonuses,
    levels: buildLevels(groupCode),
  };
}

// ─── Wonder Registry ──────────────────────────────────────────────────────────

const WONDER_DEFS: Wonder[] = WONDER_DATA.map(assembleWonder);

export const WONDERS: Record<string, Wonder> = Object.fromEntries(
  WONDER_DEFS.map((w) => [w.meta.code, w]),
);

export const WONDER_CODES: string[] = WONDER_DEFS.map((w) => w.meta.code);
