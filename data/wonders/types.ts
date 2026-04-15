// ============================================================
// ROC Helper – World Wonders: Type Definitions
// Converted from Lua wiki modules (Module:World Wonders, etc.)
// ============================================================

// --------------- Material types ---------------

/**
 * The seven material categories used to level up Wonders.
 * Corresponds to the Material1/Material2 fields in Module:World Wonders.
 */
export type MaterialType =
  | 'Arena'
  | 'Fortress'
  | 'Nature'
  | 'Naval'
  | 'Palace'
  | 'Statue'
  | 'Temple';

// --------------- Wonder groups / slots ---------------

/** The three Wonder group names as they appear on the wiki. */
export type WonderGroup = 'Ancient World' | 'Great Empires' | 'Stories and Myths';

/**
 * Where the Wonder is placed in the player's city.
 *
 * - `Capital City` → standard capital slot (Coin/Food costs from main tables)
 * - `Egypt` / `China` / `Maya Empire` / `Viking Kingdom` / `Arabia` → allied-culture slots
 *   (they use culture-specific goods costs instead)
 */
export type WonderSlot =
  | 'Capital City'
  | 'Egypt'
  | 'China'
  | 'Maya Empire'
  | 'Viking Kingdom'
  | 'Arabia';

/** Blueprint rarity tier. */
export type WonderRarity = 'Rare' | 'Legendary';

// --------------- Synergy tags ---------------

/**
 * Synergy tag type.  A Wonder may have zero or one synergy tag.
 * An empty string means "no synergy".
 */
export type SynergyTag = MaterialType | '';

// --------------- Per-level cost / bonus data ---------------

/**
 * Describes one contribution slot in a level-up cost:
 *   - `amount`  → how many of the item are needed
 *   - `gears`   → how many gears the *donor* receives for that contribution
 *                 (shown in parentheses on the wiki table)
 */
export interface CostEntry {
  amount: number;
  /** Gears awarded to the donor; 0 when not applicable. */
  gears: number;
}

/**
 * Research Point contribution tiers.
 * Each tier requires a minimum RP pool to unlock:
 *  - `rp3`  → available from 3 RP
 *  - `rp5`  → available from 5 RP
 *  - `rp10` → available from 10 RP
 */
export interface RPCosts {
  rp3: CostEntry | null;
  rp5: CostEntry | null;
  rp10: CostEntry | null;
}

/**
 * Material contribution for a single level.
 * A level requires contributions of `material1` and `material2` (same type
 * possible, e.g. "Temple + Temple").
 */
export interface MaterialCosts {
  material1: CostEntry;
  material2: CostEntry;
}

/**
 * Goods required for a specific level.
 * The shape varies by slot:
 *  - Capital City       → up to 3 generic era-goods slots
 *  - Allied cultures    → up to 4 culture-specific goods slots
 *
 * Each entry is `{ iconKey, amount, gears }`.
 */
export interface GoodsEntry {
  /** Icon key as used in the game / wiki (e.g. "Papyrus Scroll", "Silk Thread1"). */
  iconKey: string;
  amount: number;
  gears: number;
}

/**
 * Coin cost entries for a level (up to 3 stacks of different values).
 * Empty when the level has no coin requirement (level 1).
 */
export type CoinCosts = CostEntry[];

/**
 * Food cost entries for a level (up to 3 stacks of different values).
 * Empty when the level has no food requirement (level 1).
 */
export type FoodCosts = CostEntry[];

/**
 * Blueprint requirement for a level.
 * Only levels 1, 5, 10, 15, 20, 25, 30 require a blueprint.
 * gears = cost in gears to purchase the blueprint (200 for levels 5+).
 */
export interface BlueprintCost {
  required: boolean;
  /** 0 for level 1 (free / given), 200 for subsequent blueprint levels. */
  gears: number;
}

/**
 * Workers required to start a level-up (Capital City slot only).
 * Null for allied-slot Wonders.
 */
export type WorkersRequired = number | null;

/**
 * A single bonus granted by the Wonder at a specific level.
 *
 * `type` describes the nature of the bonus for programmatic use;
 * `label` is the human-readable display value (mirrors wiki display).
 *
 * Examples:
 *   { type: 'coin_production', label: '10.0%' }
 *   { type: 'rp_cap', label: '15' }
 *   { type: 'worker', label: '+1' }
 */
export interface BonusValue {
  /**
   * Semantic bonus type key (snake_case).
   * Used for filtering and comparison features.
   */
  type: string;
  /** Human-readable display value, e.g. "28.5%", "+2", "54m". */
  label: string;
}

/**
 * Full per-level data for one Wonder.
 *
 * `level` runs 0→30 following the Lua convention:
 *  - level 0  = header row (names/icons only, no costs)
 *  - level 1  = first upgrade (0→1)
 *  - level 30 = max upgrade (29→30)
 */
export interface WonderLevel {
  /** 0 = header, 1–30 = actual level. */
  level: number;

  // --- Costs ---
  blueprint: BlueprintCost;
  rp: RPCosts;
  materials: MaterialCosts | null;      // null for level 0 header
  goods: GoodsEntry[];                  // empty for level 0 and level 1
  coins: CoinCosts;                     // empty for level 0 and level 1
  food: FoodCosts;                      // empty for level 0 and level 1
  workers: WorkersRequired;             // null = non-capital slot or header

  // --- Bonuses ---
  /** Indexed 0-based; most Wonders have 1–2 bonuses, Petra has 3. */
  bonuses: BonusValue[];
}

// --------------- Wonder metadata ---------------

/**
 * Static metadata for a single Wonder.
 * Mirrors the Wonder_Array entries in Module:World Wonders (Lua).
 */
export interface WonderMeta {
  /** Short code used internally (e.g. "SH", "LToP"). */
  code: string;

  /** Full display name (e.g. "Leaning Tower of Pisa"). */
  name: string;

  group: WonderGroup;
  /** Short group code for compact display ("AW" | "GE" | "SM"). */
  groupCode: 'AW' | 'GE' | 'SM';

  slot: WonderSlot;
  /** Compact slot label for tables (e.g. "Capital City", "Allied: Egypt"). */
  slotLabel: string;

  material1: MaterialType;
  material2: MaterialType;

  /** Synergy tag; empty string when the Wonder has no synergy. */
  synergyTag: SynergyTag;
  /** Human-readable synergy bonus descriptions. */
  synergyBonuses: string[];

  rarity: WonderRarity;
}

// --------------- Full Wonder record ---------------

/**
 * Complete Wonder data: metadata + all 31 level rows (0–30).
 * This is the primary type consumed by the UI components.
 */
export interface Wonder {
  meta: WonderMeta;
  /** Array of 31 entries indexed by level (index 0 = header, index 1–30 = levels). */
  levels: WonderLevel[];
}

// --------------- Preset / filter helpers ---------------

/**
 * A named preset grouping Wonders by strategic role.
 * Presets are computed from Wonder metadata and bonus types.
 *
 * Kept separate from Wonder data so presets can be updated independently.
 */
export interface WonderPreset {
  id: string;
  label: string;
  /** Wonder codes included in this preset. */
  wonderCodes: string[];
}

/**
 * Filter state for the Wonder list page.
 * All fields are optional; absent fields are treated as "no filter".
 */
export interface WonderFilter {
  group?: WonderGroup;
  slot?: WonderSlot;
  material?: MaterialType;
  rarity?: WonderRarity;
  synergyTag?: SynergyTag;
  searchQuery?: string;
}
