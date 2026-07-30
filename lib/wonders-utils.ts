import { WONDERS } from "@/data/wonders/index";
import type {
  Wonder,
  SynergyResult,
  WonderPresetEntry,
  ResolvedBonus,
  MaterialType,
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

// ─── Tag contributions (handles countsAs multiplier) ─────────────────────────

/**
 * Returns a map of tag → weighted contribution for a single wonder.
 * If the wonder has `countsAs`, those multipliers replace the default 1
 * for the listed tags. Material tags not in `countsAs` still contribute 1.
 * Wonders without `countsAs` contribute 1 per unique material tag.
 */
export function getTagContributions(
  wonder: Wonder,
): Map<MaterialType, number> {
  const countsAs = wonder.meta.countsAs;
  const result = new Map<MaterialType, number>();

  if (countsAs && countsAs.length > 0) {
    const covered = new Set(countsAs.map((c) => c.tag));
    for (const entry of countsAs) {
      result.set(entry.tag, entry.multiplier);
    }
    if (!covered.has(wonder.meta.material1)) {
      result.set(wonder.meta.material1, 1);
    }
    if (
      wonder.meta.material2 !== wonder.meta.material1 &&
      !covered.has(wonder.meta.material2)
    ) {
      result.set(wonder.meta.material2, 1);
    }
  } else {
    result.set(wonder.meta.material1, 1);
    if (wonder.meta.material2 !== wonder.meta.material1) {
      result.set(wonder.meta.material2, 1);
    }
  }

  return result;
}

/**
 * Computes the total weighted count per material tag across all given wonder codes.
 * Used by the UI to display per-tag totals in the restructured Active Synergies panel.
 */
export function computeTagCounts(codes: string[]): Record<MaterialType, number> {
  const result: Record<string, number> = {};
  for (const code of codes) {
    const wonder = WONDERS[code];
    if (!wonder) continue;
    const contributions = getTagContributions(wonder);
    for (const [tag, weight] of contributions) {
      result[tag] = (result[tag] ?? 0) + weight;
    }
  }
  return result as Record<MaterialType, number>;
}

// ─── Synergy computation ──────────────────────────────────────────────────────

export interface WonderWithSynergy {
  code: string;
  name: string;
  synergyActive: boolean;
  /** Weighted count of activators (accounts for countsAs multipliers) */
  synergyCount: number;
  /** First synergy bonus string, kept for backwards compat — prefer synergies[] */
  synergyBonus: string | null;
  activatedBy: string[];
}

export function computeSynergies(codes: string[]): WonderWithSynergy[] {
  const wonders = codes.map((c) => WONDERS[c]).filter(Boolean);

  return wonders.map((w) => {
    // A wonder has no synergy if its synergies array is empty
    if (w.meta.synergies.length === 0) {
      return {
        code: w.meta.code,
        name: w.meta.name,
        synergyActive: false,
        synergyCount: 0,
        synergyBonus: null,
        activatedBy: [],
      };
    }

    // Collect all material tags this wonder listens to
    const tags = new Set(w.meta.synergies.map((s) => s.tag));

    let weightedCount = 0;
    const activatorNames: string[] = [];

    for (const other of wonders) {
      if (other.meta.code === w.meta.code) continue;
      const contributions = getTagContributions(other);
      let contributed = 0;
      for (const [tag, weight] of contributions) {
        if (tags.has(tag)) {
          contributed = Math.max(contributed, weight);
        }
      }
      if (contributed > 0) {
        weightedCount += contributed;
        activatorNames.push(other.meta.name);
      }
    }

    return {
      code: w.meta.code,
      name: w.meta.name,
      synergyActive: weightedCount > 0,
      synergyCount: weightedCount,
      // Keep first synergy bonus string for callers that only need one
      synergyBonus: w.meta.synergies[0]?.bonus ?? null,
      activatedBy: activatorNames,
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
 * Does NOT include synergy bonuses (those are handled by SynergyPanel / WonderHeader).
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
 * Uses the static `bonus` string from WonderSynergy (already pre-formatted).
 * e.g.  bonus = "+2%", count = 3  →  "+2% ×3"
 *
 * Pass the synergy index when a wonder has multiple synergies.
 */
export function getSynergyDisplayValue(
  wonder: Wonder,
  _level: number,
  activatorCount: number,
  synergyIndex = 0,
): string | null {
  if (!wonder || activatorCount <= 0) return null;
  const base = wonder.meta.synergies[synergyIndex]?.bonus;
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
  "carcassonne_recruitment_time_reduction",
  "recruitment_time_reduction",
  "trade_slot_cooldown_reduction",
  "bazaar_offer_boost",
  "chest_drop_chance",
  "research_regen_boost",
]);

const INTEGER_TYPES = new Set([
  "rp_per_day",
  "arabia_worker_slots",
  "compass_slots",
  "donation_gears",
  "goods_quantity",
  "previous_era_goods",
  "previous_era_goods_quantity",
  "research_point_cap",
  "trade_worker_slots",
  "worker_slots",
]);

export function getBonusFormat(type: string): BonusFormat {
  if (PERCENT_TYPES.has(type)) return "percent";
  if (INTEGER_TYPES.has(type)) return "integer";
  return "flat";
}

/**
 * Formats a numeric bonus value for display.
 * - percent → "+18.3%"
 * - integer → "+4"
 * - flat    → raw number (goods amounts, etc.)
 *
 * NOTE: synergy bonuses are pre-formatted strings in WonderSynergy.bonus
 * and must NOT go through this function.
 */
export function formatBonusValue(type: string, value: number): string {
  const fmt = getBonusFormat(type);
  if (fmt === "percent") {
    const sign = value >= 0 ? "+" : "";
    const formatted = Number.isInteger(value) ? `${value}` : value.toFixed(1);
    return `${sign}${formatted}%`;
  }
  if (fmt === "integer") {
    return `+${value}`;
  }
  // flat: integer for slots/counts, otherwise one decimal
  return Number.isInteger(value) ? `${value}` : value.toFixed(1);
}
