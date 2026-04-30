// ─── Material Types ────────────────────────────────────────────────────────────

export type MaterialType =
  | "arena"
  | "fortress"
  | "nature"
  | "naval"
  | "palace"
  | "statue"
  | "temple";

export type WonderGroup =
  | "Ancient World"
  | "Great Empires"
  | "Stories and Myths";

export type WonderGroupCode = "AW" | "GE" | "SM";

export type WonderSlot =
  | "Capital City"
  | "Egypt"
  | "China"
  | "Maya Empire"
  | "Viking Kingdom"
  | "Arabia";

// ─── Bonus ─────────────────────────────────────────────────────────────────────

/**
 * A single bonus type defined for a Wonder.
 * - `type`   : snake_case identifier used for display mapping and logic (e.g. "infantry_damage")
 * - `icons`  : [mainIcon, overlayIcon | null] – icon keys resolved by the UI
 * - `values` : 30 numeric values, one per level (index 0 = level 1)
 */
export interface WonderBonus {
  type: string;
  icons: [string, string | null];
  values: number[];
}

// ─── Level Bonus (resolved at a specific level) ────────────────────────────────

/**
 * A bonus resolved at a specific level. Derived from WonderBonus at render time.
 * - `type`  : same as WonderBonus.type
 * - `icons` : same as WonderBonus.icons
 * - `value` : values[level - 1]
 */
export interface ResolvedBonus {
  type: string;
  icons: [string, string | null];
  value: number;
}

// ─── Synergy ───────────────────────────────────────────────────────────────────

/**
 * A single synergy entry for a Wonder.
 * A wonder can have multiple synergies (e.g. CoB has cavalry speed + bazaar).
 * - `tag`   : the MaterialType that activates this synergy
 * - `icons` : [mainIcon, overlayIcon | null] – same shape as WonderBonus.icons
 * - `bonus` : pre-formatted display string, e.g. "+2%", "×2.5%"
 *             NOT a number — never needs formatBonusValue()
 */
export interface WonderSynergy {
  tag: MaterialType;
  icons: [string, string | null];
  bonus: string;
}

// ─── Wonder Meta ───────────────────────────────────────────────────────────────

export interface WonderMeta {
  code: string;
  name: string;
  group: WonderGroup;
  groupCode: WonderGroupCode;
  slot: WonderSlot;
  slotLabel: string;
  material1: MaterialType;
  material2: MaterialType;
  /**
   * All synergy entries for this wonder.
   * Empty array = no synergy.
   * Replaces the old synergyTag / synergyBonus / synergyIcons fields.
   */
  synergies: WonderSynergy[];
  rarity: "Rare" | "Legendary";
  maxLevel: number;
}

// ─── Wonder Level ──────────────────────────────────────────────────────────────

export interface WonderLevel {
  /** Level number (1–30) */
  level: number;
  /** Research points cost to reach this level */
  rpCost: number;
  /** Material 1 cost */
  mat1Cost: number;
  /** Material 2 cost */
  mat2Cost: number;
  /** Coin cost */
  coinCost: number;
  /** Whether a blueprint is required at this level */
  isBlueprint: boolean;
}

// ─── Wonder ────────────────────────────────────────────────────────────────────

export interface Wonder {
  meta: WonderMeta;
  /**
   * Bonus definitions. Each entry covers all 30 levels via `values`.
   * Use `bonus.values[level - 1]` to get the value at a given level.
   */
  bonuses: WonderBonus[];
  /** Level-specific cost data, keyed by level number (1–30) */
  levels: Record<number, WonderLevel>;
}

// ─── Preset ────────────────────────────────────────────────────────────────────

export interface WonderPresetEntry {
  code: string;
  /** Override level for this preset slot (null = use the user's owned level) */
  level: number | null;
}

export interface WonderPreset {
  id: string;
  label: string;
  description?: string;
  /** Strategy tags for filtering */
  tags?: string[];
  wonderCodes: string[];
}

// ─── User Preset ───────────────────────────────────────────────────────────────

export interface UserPreset {
  id: string;
  name: string;
  /** Capital city slots (up to 4) */
  capital: (WonderPresetEntry | null)[];
  /** Allied culture slots (up to 4) */
  allied: (WonderPresetEntry | null)[];
  createdAt: number;
  updatedAt: number;
}

// ─── Synergy Result ────────────────────────────────────────────────────────────

export interface SynergyResult {
  wonderCode: string;
  wonderName: string;
  synergyBonus: string;
  activatedBy: string[];
  count: number;
}

// ─── Bonus Value ───────────────────────────────────────────────────────────────

/** A single resolved bonus entry at a given level. */
export interface BonusValue {
  type: string;
  label: string;
}

// ─── Goods Entry ───────────────────────────────────────────────────────────────

/** A single goods cost entry for a Wonder level. */
export interface GoodsEntry {
  iconKey: string;
  amount: number;
  gears: number;
}

// ─── Wonder Filter ─────────────────────────────────────────────────────────────

/** Filter shape used by filterWonders() in presets.ts. */
export interface WonderFilter {
  group?: WonderGroup;
  slot?: WonderSlot;
  rarity?: "Rare" | "Legendary";
  material?: MaterialType;
  /** Filter by synergy tag — matches wonders whose synergies include this MaterialType. */
  synergyTag?: MaterialType | "";
  searchQuery?: string;
}

// ─── Cost types (unchanged) ───────────────────────────────────────────────────

export type CostEntry = { amount: number; gears: number };
export type CoinCosts = CostEntry[];
export type FoodCosts = CostEntry[];

export interface BlueprintCost {
  required: boolean;
  gears: number;
}

export interface RPCostEntry {
  amount: number;
  gears: number;
}

export interface RPCosts {
  rp3: RPCostEntry | null;
  rp5: RPCostEntry | null;
  rp10: RPCostEntry | null;
}

export interface MaterialCosts {
  mat1: CostEntry;
  mat2: CostEntry;
}
