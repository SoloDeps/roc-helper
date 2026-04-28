import { WONDERS } from "@/data/wonders/index";
import type {
  Wonder,
  SynergyResult,
  UserPreset,
  WonderPresetEntry,
  ResolvedBonus,
} from "@/data/wonders/types";

// ─── Resolve bonus at a specific level ────────────────────────────────────────

/**
 * Returns all bonuses for a wonder resolved at the given level.
 * Each bonus value is `bonus.values[level - 1]`.
 */
export function getResolvedBonuses(
  wonder: Wonder,
  level: number,
): ResolvedBonus[] {
  if (!wonder || level <= 0 || level > 30) return [];
  return wonder.bonuses.map((b) => ({
    type: b.type,
    icons: b.icons,
    value: b.values[level - 1] ?? 0,
  }));
}

// ─── Synergy computation ──────────────────────────────────────────────────────

export interface WonderWithSynergy {
  code: string;
  name: string;
  synergyActive: boolean;
  synergyCount: number;
  synergyBonus: string | null;
  activatedBy: string[];
}

export function computeSynergies(codes: string[]): WonderWithSynergy[] {
  const wonders = codes.map((c) => WONDERS[c]).filter(Boolean);

  return wonders.map((w) => {
    const tag = w.meta.synergyTag;
    if (!tag) {
      return {
        code: w.meta.code,
        name: w.meta.name,
        synergyActive: false,
        synergyCount: 0,
        synergyBonus: null,
        activatedBy: [],
      };
    }

    const activators = wonders.filter((other) => {
      if (other.meta.code === w.meta.code) return false;
      return other.meta.material1 === tag || other.meta.material2 === tag;
    });

    return {
      code: w.meta.code,
      name: w.meta.name,
      synergyActive: activators.length > 0,
      synergyCount: activators.length,
      synergyBonus: w.meta.synergyBonus,
      activatedBy: activators.map((a) => a.meta.name),
    };
  });
}

// ─── Preset helpers ───────────────────────────────────────────────────────────

export function getPresetCodes(preset: {
  capital: (WonderPresetEntry | null)[];
  allied: (WonderPresetEntry | null)[];
}): string[] {
  return [...preset.capital, ...preset.allied]
    .filter((e): e is WonderPresetEntry => e !== null)
    .map((e) => e.code);
}

// ─── Synergy results ──────────────────────────────────────────────────────────

export function computeSynergyResults(codes: string[]): SynergyResult[] {
  return computeSynergies(codes)
    .filter((w) => w.synergyActive && w.synergyBonus)
    .map((w) => ({
      wonderCode: w.code,
      wonderName: w.name,
      synergyBonus: w.synergyBonus!,
      activatedBy: w.activatedBy,
      count: w.synergyCount,
    }));
}

// ─── Wonder Boosts ────────────────────────────────────────────────────────────

/**
 * A single resolved boost item ready for UI display.
 * The UI is responsible for mapping `type` → human label via BONUS_LABELS.
 */
export interface WonderBoostItem {
  type: string;
  icons: [string, string | null];
  value: number;
}

/**
 * Returns all bonuses for `wonder` at `level`, ready to display.
 * Does NOT include synergy bonuses (those are handled by SynergyPanel).
 */
export function getWonderBoosts(
  wonder: Wonder,
  level: number,
): WonderBoostItem[] {
  if (!wonder || level <= 0) return [];
  return getResolvedBonuses(wonder, level).map((b) => ({
    type: b.type,
    icons: b.icons,
    value: b.value,
  }));
}

// ─── Synergy display value ────────────────────────────────────────────────────

/**
 * Builds the display string for a synergy at a given activator count.
 * Uses the static `synergyBonus` label from WonderMeta.
 * e.g.  synergyBonus = "+1 RP/day", count = 3  →  "+1 RP/day ×3"
 */
export function getSynergyDisplayValue(
  wonder: Wonder,
  _level: number,
  activatorCount: number,
): string | null {
  if (!wonder || activatorCount <= 0) return null;
  const base = wonder.meta.synergyBonus;
  if (!base) return null;
  return activatorCount > 1 ? `${base} ×${activatorCount}` : base;
}

// ─── Bonus labels dictionary ──────────────────────────────────────────────────
//
// Maps bonus `type` → i18n-ready display label.
// UI components import this to render human-readable text without touching data.

export const BONUS_LABELS: Record<string, string> = {
  // Production
  coins_production: "Coin Production",
  food_production: "Food Production",
  goods_production: "Goods Production",
  goods_production_secondary: "Goods Production (2nd)",
  goods_quantity: "Goods Quantity",
  previous_era_goods: "Previous Era Goods",
  previous_era_goods_quantity: "Previous Era Goods Qty",
  research_points_per_day: "RP / Day",
  research_point_cap: "RP Cap",
  research_regen_boost: "RP Regen Speed",
  // Workers / slots
  worker_slots: "Worker Slots",
  trade_worker_slots: "Trade Worker Slots",
  arabia_worker_slots: "Arabia Worker Slots",
  compass_slots: "Compass Slots",
  // Combat – damage
  infantry_damage: "Infantry Damage",
  ranged_damage: "Ranged Damage",
  cavalry_damage: "Cavalry Damage",
  heavy_infantry_damage: "Heavy Inf. Damage",
  army_damage: "Army Damage",
  // Combat – HP
  infantry_hp: "Infantry HP",
  ranged_hp: "Ranged HP",
  cavalry_hp: "Cavalry HP",
  heavy_infantry_hp: "Heavy Inf. HP",
  bastion_hp: "Bastion HP",
  army_hp: "Army HP",
  // Combat – special
  infantry_critical_hit_chance: "Infantry Crit Chance",
  heavy_infantry_critical_hit_boost: "Heavy Inf. Crit Boost",
  heavy_infantry_critical_hit_chance: "Heavy Inf. Crit Chance",
  ranged_critical_hit_boost: "Ranged Crit Boost",
  cavalry_hit_rate: "Cavalry Hit Rate",
  heavy_infantry_recruitment_time_reduction: "Heavy Inf. Recruit Time ↓",
  recruitment_time_reduction: "Recruit Time ↓",
  // Economy
  donation_gears: "Donation Gears",
  trade_slot_cooldown_reduction: "Trade Slot Cooldown ↓",
  bazaar_offer_boost: "Bazaar Offer Boost",
  chest_drop_chance: "Chest Drop Chance",
};

/**
 * Returns a human-readable label for a bonus type.
 * Falls back to a title-cased version of the type string.
 */
export function getBonusLabel(type: string): string {
  return (
    BONUS_LABELS[type] ??
    type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

// ─── Format bonus value ───────────────────────────────────────────────────────

/**
 * Maps bonus type to its value formatting style.
 * UI uses this to decide how to render a numeric value.
 */
export type BonusFormat = "percent" | "integer" | "flat";

const PERCENT_TYPES = new Set([
  "coins_production",
  "food_production",
  "goods_production",
  "goods_production_secondary",
  "infantry_damage",
  "ranged_damage",
  "cavalry_damage",
  "heavy_infantry_damage",
  "army_damage",
  "infantry_hp",
  "ranged_hp",
  "cavalry_hp",
  "heavy_infantry_hp",
  "bastion_hp",
  "army_hp",
  "infantry_critical_hit_chance",
  "heavy_infantry_critical_hit_boost",
  "heavy_infantry_critical_hit_chance",
  "ranged_critical_hit_boost",
  "cavalry_hit_rate",
  "heavy_infantry_recruitment_time_reduction",
  "recruitment_time_reduction",
  "trade_slot_cooldown_reduction",
  "bazaar_offer_boost",
  "chest_drop_chance",
  "research_regen_boost",
]);

export function getBonusFormat(type: string): BonusFormat {
  if (PERCENT_TYPES.has(type)) return "percent";
  return "flat";
}

/**
 * Formats a numeric bonus value for display.
 * - percent → "+18.3%"
 * - flat    → raw number (worker slots, RP/day, goods amounts, etc.)
 */
export function formatBonusValue(type: string, value: number): string {
  const fmt = getBonusFormat(type);
  if (fmt === "percent") {
    const sign = value >= 0 ? "+" : "";
    const formatted = Number.isInteger(value) ? `${value}` : value.toFixed(1);
    return `${sign}${formatted}%`;
  }
  // flat: integer for slots/counts, otherwise one decimal
  return Number.isInteger(value) ? `${value}` : value.toFixed(1);
}
