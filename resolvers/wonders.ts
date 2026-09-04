import { WONDERS } from "@/data/wonders/index";
import type {
  Wonder,
  SynergyResult,
  WonderPresetEntry,
  ResolvedBonus,
  MaterialType,
  BonusFormat,
  BonusScope,
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
    format: b.format,
    scope: b.scope,
    instance: b.instance,
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
 * The UI maps `type` (+ `instance`) → human label via `getBonusLabel`, and
 * renders `value` through `formatBonusValue(format, value)` — both in
 * `resolvers/bonus.ts`.
 */
export interface WonderBoostItem {
  type: string;
  icons: [string, string | null];
  value: number;
  format: BonusFormat;
  scope: BonusScope | null;
  instance: number;
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
    format: b.format,
    scope: b.scope,
    instance: b.instance,
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
