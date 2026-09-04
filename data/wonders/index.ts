import type {
  Wonder,
  WonderMeta,
  WonderBonus,
  WonderSynergy,
  MaterialType,
  WonderGroup,
  WonderGroupCode,
  WonderSlot,
} from "./types";

import { WONDER_RAW_DATA as WONDER_DATA } from "./generated/wonders.generated";

// ─── Meta builder ─────────────────────────────────────────────────────────────

function resolveGroupCode(group: WonderGroup): WonderGroupCode {
  if (group === "Ancient World") return "AW";
  if (group === "Great Empires") return "GE";
  return "SM";
}

function resolveSlotLabel(slot: WonderSlot): string {
  return slot;
}

// ─── Wonder assembly ──────────────────────────────────────────────────────────

function assembleWonder(raw: (typeof WONDER_DATA)[number]): Wonder {
  const groupCode = resolveGroupCode(raw.meta.group as WonderGroup);

  // Build the synergies array directly from the raw data.
  // Each entry already carries its own icons and bonus string — no lookup needed.
  const synergies: WonderSynergy[] = (raw.meta.synergies ?? []).map((s) => ({
    tag: s.raw as MaterialType,
    icons: s.icons as [string, string | null],
    bonus: s.bonus,
  }));

  const countsAs = raw.meta.countsAs?.map((c) => ({
    tag: c.tag as MaterialType,
    multiplier: c.multiplier,
  }));

  const meta: WonderMeta = {
    code: raw.meta.code,
    name: raw.meta.name,
    group: raw.meta.group as WonderGroup,
    groupCode,
    slot: raw.meta.slot as WonderSlot,
    slotLabel: resolveSlotLabel(raw.meta.slot as WonderSlot),
    material1: raw.meta.materials[0] as MaterialType,
    material2: raw.meta.materials[1] as MaterialType,
    synergies,
    countsAs: countsAs && countsAs.length > 0 ? countsAs : undefined,
    rarity: (raw.meta.rarity ?? "Rare") as "Rare" | "Legendary",
    maxLevel: 30,
  };

  const bonuses: WonderBonus[] = raw.bonuses.map((b) => ({
    type: b.type,
    icons: b.icons as [string, string | null],
    values: b.values,
    format: b.format,
    scope: b.scope,
    instance: b.instance,
  }));

  return {
    meta,
    bonuses,
  };
}

// ─── Wonder Registry ──────────────────────────────────────────────────────────

const WONDER_DEFS: Wonder[] = WONDER_DATA.map(assembleWonder);

export const WONDERS: Record<string, Wonder> = Object.fromEntries(
  WONDER_DEFS.map((w) => [w.meta.code, w]),
);

export const WONDER_CODES: string[] = WONDER_DEFS.map((w) => w.meta.code);
