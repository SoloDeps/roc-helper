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
 * How a bonus value is rendered. Carried as DATA on every bonus, straight from
 * the extraction — never re-derived from a hand-maintained dictionary. That
 * double source is what let `donation_gears` render as `+42` instead of `+42%`.
 *
 * - `percent`  → a rate applied to something else: `+18.3%`
 * - `integer`  → a whole-number gain: `+4`
 * - `flat`     → a raw quantity granted (goods amounts, slot counts): `12`
 * - `absolute` → a production OUTPUT per cycle, not a modifier of one. Buildings
 *   introduce it: `ProductionComponentDTO.producedResources[]` gives an amount
 *   (1 800 coins per 6 h), where `coins_production` & co. are percent boosts.
 *   Reusing `percent` there would render a quantity as a rate; reusing `flat`
 *   would lose the fact that the number is a throughput, and drop the thousands
 *   grouping these values need to stay readable.
 *
 * Wonders and Technologies never produce `absolute` — their local mirrors of
 * this union (`WonderBonusFormat`, `TechnologyBonusFormat`) stay narrower on
 * purpose, and remain assignable to this one.
 */
export type BonusFormat = "percent" | "integer" | "flat" | "absolute";

/**
 * What a bonus is narrowed to, when the game design narrows it.
 * `null` = no declared narrowing (army-wide stats, production rewards, worker grants).
 *
 * This used to live only inside the displayed icon (a city crest, a unit glyph),
 * so two `goods_production` on two different cities were the same `type` and
 * indistinguishable without reading the artwork. `icons` still carries the
 * display; `scope` carries the meaning.
 */
export type BonusScope =
  | { kind: "city"; value: string }
  | { kind: "buildingGroup"; value: string }
  | { kind: "unitType"; value: string };

/**
 * A single bonus defined for a Wonder.
 * - `type`     : CANONICAL snake_case identifier (e.g. "infantry_damage"). Never
 *                carries an ordinal suffix, so summing by `type` alone is correct.
 * - `icons`    : [mainIcon, overlayIcon | null] – icon keys resolved by the UI
 * - `values`   : 30 numeric values, one per level (index 0 = level 1)
 * - `format`   : rendering style, from the extraction
 * - `scope`    : declared target narrowing, or null
 * - `instance` : 1-based rank among this wonder's bonuses sharing the same `type`
 */
export interface WonderBonus {
  type: string;
  icons: [string, string | null];
  values: number[];
  format: BonusFormat;
  scope: BonusScope | null;
  instance: number;
}

// ─── Level Bonus (resolved at a specific level) ────────────────────────────────

/**
 * A bonus resolved at a specific level. Derived from WonderBonus at render time.
 * Carries `format` / `scope` / `instance` through unchanged — the UI formats
 * from `format`, never from `type`.
 */
export interface ResolvedBonus {
  type: string;
  icons: [string, string | null];
  value: number;
  format: BonusFormat;
  scope: BonusScope | null;
  instance: number;
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
  /**
   * Optional multiplier override for how this wonder counts toward material tag totals.
   * e.g. `[{ tag: "naval", multiplier: 2 }]` means this wonder counts as 2 Naval
   * instead of 1 when computing per-tag counts for synergy activation.
   * Each tag not listed contributes its default of 1.
   */
  countsAs?: { tag: MaterialType; multiplier: number }[];
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

/** Filter shape for the wonders list. Currently no consumer — the wonders page filters inline. */
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
