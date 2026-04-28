"use client";

import { useState, useMemo } from "react";
import { ChevronDown, Zap, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import { WONDERS } from "@/data/wonders/index";
import { WONDER_PRESETS } from "@/data/wonders/presets";
import type {
  UserPreset,
  WonderPresetEntry,
  WonderBonus,
} from "@/data/wonders/types";
import {
  computeSynergies,
  getPresetCodes,
  formatBonusValue,
} from "@/lib/wonders-utils";
import { useUserPresets } from "@/lib/stores/user-presets-store";

// ─── Constants ────────────────────────────────────────────────────────────────

const ICON_BASE_PATH = "/images/icons";

// ─── Types ────────────────────────────────────────────────────────────────────

interface CompareSlot {
  savedPresetId?: string;
  libraryPresetId?: string;
}

/** Aggregated bonus value across all wonders in a preset */
interface AggregatedBonus {
  type: string;
  icons: [string, string | null];
  total: number;
}

/** One row in the comparison table */
interface BonusRow {
  type: string;
  icons: [string, string | null];
  valueA: number | null;
  valueB: number | null;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getSlotCodes(
  slot: CompareSlot,
  savedPresets: UserPreset[],
  ownedMap: Record<string, { code: string; currentLevel: number }>,
): string[] {
  if (slot.savedPresetId) {
    const p = savedPresets.find((x) => x.id === slot.savedPresetId);
    return p ? getPresetCodes(p) : [];
  }
  if (slot.libraryPresetId) {
    const p = WONDER_PRESETS.find((x) => x.id === slot.libraryPresetId);
    return p?.wonderCodes ?? [];
  }
  return [];
}

function getEffectiveLevel(
  code: string,
  slot: CompareSlot,
  savedPresets: UserPreset[],
  ownedMap: Record<string, { code: string; currentLevel: number }>,
): number {
  if (slot.savedPresetId) {
    const preset = savedPresets.find((x) => x.id === slot.savedPresetId);
    if (preset) {
      const entry = [...preset.capital, ...preset.allied].find(
        (e): e is WonderPresetEntry => e?.code === code,
      );
      if (entry?.level != null) return entry.level;
    }
  }
  return ownedMap[code]?.currentLevel ?? 1;
}

/**
 * Aggregates all bonus values across all wonders in a preset.
 * Returns a map: bonusType → { total, icons }
 */
function aggregateBonuses(
  codes: string[],
  slot: CompareSlot,
  savedPresets: UserPreset[],
  ownedMap: Record<string, { code: string; currentLevel: number }>,
): Map<string, AggregatedBonus> {
  const map = new Map<string, AggregatedBonus>();

  for (const code of codes) {
    const wonder = WONDERS[code];
    if (!wonder) continue;
    const level = getEffectiveLevel(code, slot, savedPresets, ownedMap);
    const idx = Math.max(0, Math.min(level - 1, 29));

    for (const bonus of wonder.bonuses) {
      const value = bonus.values[idx] ?? 0;
      const existing = map.get(bonus.type);
      if (existing) {
        existing.total += value;
      } else {
        map.set(bonus.type, {
          type: bonus.type,
          icons: bonus.icons as [string, string | null],
          total: value,
        });
      }
    }
  }

  return map;
}

/**
 * Builds the unified list of rows from both presets (union of bonus types).
 * Preserves insertion order: A's types first, then B's extras.
 */
function buildRows(
  mapA: Map<string, AggregatedBonus>,
  mapB: Map<string, AggregatedBonus>,
): BonusRow[] {
  const allTypes = new Set([...mapA.keys(), ...mapB.keys()]);
  return Array.from(allTypes).map((type) => {
    const a = mapA.get(type);
    const b = mapB.get(type);
    return {
      type,
      icons: (a ?? b)!.icons,
      valueA: a?.total ?? null,
      valueB: b?.total ?? null,
    };
  });
}

// ─── Icon component ───────────────────────────────────────────────────────────

function BonusIcon({
  main,
  overlay,
  size = 22,
}: {
  main: string;
  overlay: string | null;
  size?: number;
}) {
  return (
    <span
      className="relative inline-flex shrink-0"
      style={{ width: size, height: size }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${ICON_BASE_PATH}/${main}.webp`}
        alt=""
        width={size}
        height={size}
        className="object-contain"
      />
      {overlay && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`${ICON_BASE_PATH}/${overlay}.webp`}
          alt=""
          width={Math.round(size * 0.52)}
          height={Math.round(size * 0.52)}
          className="absolute bottom-0 right-0 object-contain z-10"
        />
      )}
    </span>
  );
}

// ─── Preset Selector ──────────────────────────────────────────────────────────

function PresetSelector({
  slot,
  savedPresets,
  onChangeSaved,
  onChangeLibrary,
  label,
  accentClass,
}: {
  slot: CompareSlot;
  savedPresets: UserPreset[];
  onChangeSaved: (id: string) => void;
  onChangeLibrary: (id: string) => void;
  label: "A" | "B";
  accentClass: string;
}) {
  const [open, setOpen] = useState(false);

  const displayName = slot.savedPresetId
    ? savedPresets.find((p) => p.id === slot.savedPresetId)?.name
    : slot.libraryPresetId
      ? WONDER_PRESETS.find((p) => p.id === slot.libraryPresetId)?.label
      : undefined;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-semibold transition-all w-full",
          open
            ? "border-amber-400/70 bg-amber-50/60 dark:bg-amber-950/20"
            : "border-border bg-card hover:border-amber-300/60",
        )}
      >
        <span
          className={cn(
            "inline-flex items-center justify-center size-5 rounded-full text-[10px] font-black shrink-0",
            accentClass,
          )}
        >
          {label}
        </span>
        <span className="flex-1 text-left truncate text-sm">
          {displayName ?? (
            <span className="text-muted-foreground font-normal">
              Choose a preset…
            </span>
          )}
        </span>
        <ChevronDown
          className={cn(
            "size-3.5 text-muted-foreground transition-transform shrink-0",
            open && "rotate-180",
          )}
        />
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1.5 z-50 rounded-xl border border-border bg-popover shadow-xl shadow-black/10 p-2 space-y-2 max-h-72 overflow-y-auto">
          {savedPresets.length > 0 && (
            <>
              <p className="px-2 pt-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                My presets
              </p>
              {savedPresets.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    onChangeSaved(p.id);
                    setOpen(false);
                  }}
                  className={cn(
                    "w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all",
                    slot.savedPresetId === p.id
                      ? "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300"
                      : "hover:bg-muted text-foreground",
                  )}
                >
                  {p.name}
                </button>
              ))}
            </>
          )}

          {WONDER_PRESETS.length > 0 && (
            <>
              <p className="px-2 pt-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Strategy library
              </p>
              {WONDER_PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    onChangeLibrary(p.id);
                    setOpen(false);
                  }}
                  className={cn(
                    "w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all",
                    slot.libraryPresetId === p.id
                      ? "bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300"
                      : "hover:bg-muted text-foreground",
                  )}
                >
                  {p.label}
                </button>
              ))}
            </>
          )}

          {savedPresets.length === 0 && WONDER_PRESETS.length === 0 && (
            <p className="px-2 py-3 text-xs text-muted-foreground text-center">
              No presets available
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Value Cell ───────────────────────────────────────────────────────────────

function ValueCell({
  value,
  type,
  compare,
  side,
}: {
  value: number | null;
  type: string;
  compare: number | null;
  side: "A" | "B";
}) {
  if (value === null) {
    return (
      <div className="flex items-center justify-center h-full">
        <Minus className="size-3.5 text-muted-foreground/30" />
      </div>
    );
  }

  const formatted = formatBonusValue(type, value);

  // Determine advantage
  const isHigher = compare === null || value > compare;
  const isEqual = compare !== null && value === compare;
  const isLower = compare !== null && value < compare;

  return (
    <div className="flex items-center justify-center h-full">
      <span
        className={cn(
          "tabular-nums font-semibold text-xs transition-colors",
          isHigher &&
            compare !== null &&
            "text-emerald-600 dark:text-emerald-700",
          isEqual && "text-foreground/70",
          isLower && "text-red-500",
        )}
      >
        {formatted}
      </span>
    </div>
  );
}

// ─── Synergy Badges ───────────────────────────────────────────────────────────

function SynergyBadges({ codes }: { codes: string[] }) {
  const active = useMemo(
    () => computeSynergies(codes).filter((s) => s.synergyActive),
    [codes],
  );

  if (active.length === 0) {
    return (
      <p className="text-[10px] text-muted-foreground/50 text-center py-1">
        No synergies
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-1">
      {active.map((s) => (
        <div
          key={s.code}
          className="flex items-center justify-between gap-2 text-[10px] leading-none"
        >
          <span className="text-foreground/60 truncate">{s.name}</span>
          <span className="font-bold text-amber-600 dark:text-amber-400 shrink-0">
            ×{s.synergyCount}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Comparison Table ─────────────────────────────────────────────────────────

function ComparisonTable({
  rows,
  nameA,
  nameB,
}: {
  rows: BonusRow[];
  nameA: string;
  nameB: string;
}) {
  if (rows.length === 0) {
    return (
      <div className="rounded-xl border-2 border-dashed border-border p-12 text-center space-y-2">
        <p className="text-sm font-semibold text-foreground/50">
          Select two presets to compare
        </p>
        <p className="text-xs text-muted-foreground">
          Choose presets above and the bonus breakdown will appear here
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border overflow-hidden shadow-sm">
      {/* Sticky header */}
      <div className="grid grid-cols-[44px_1fr_1fr] sticky top-0 z-20 bg-muted/95 backdrop-blur-sm border-b border-border">
        {/* Bonus column header */}
        <div className="px-3 py-3 flex items-center justify-center">
          <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60">
            Bonus
          </span>
        </div>

        {/* Preset A header */}
        <div className="px-4 py-3 border-l border-border flex items-center justify-center">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center justify-center size-4 rounded-full bg-sky-500 text-[9px] font-black text-white shrink-0">
              A
            </span>
            <span className="text-xs font-bold truncate text-foreground/80 max-w-[100px]">
              {nameA}
            </span>
          </div>
        </div>

        {/* Preset B header */}
        <div className="px-4 py-3 border-l border-border flex items-center justify-center">
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center justify-center size-4 rounded-full bg-violet-500 text-[9px] font-black text-white shrink-0">
              B
            </span>
            <span className="text-xs font-bold truncate text-foreground/80 max-w-[100px]">
              {nameB}
            </span>
          </div>
        </div>
      </div>

      {/* Rows */}
      <div className="divide-y divide-border/50">
        {rows.map((row, i) => (
          <div
            key={row.type}
            className={cn(
              "grid grid-cols-[44px_1fr_1fr] group transition-colors",
              i % 2 === 0
                ? "bg-background hover:bg-muted/40"
                : "bg-muted/20 hover:bg-muted/50",
            )}
          >
            {/* Icon cell */}
            <div className="flex items-center justify-center py-2.5 px-2">
              <BonusIcon main={row.icons[0]} overlay={row.icons[1]} size={22} />
            </div>

            {/* Value A */}
            <div className="border-l border-border/60 py-2.5 px-4 min-h-[44px]">
              <ValueCell
                value={row.valueA}
                type={row.type}
                compare={row.valueB}
                side="A"
              />
            </div>

            {/* Value B */}
            <div className="border-l border-border/60 py-2.5 px-4 min-h-[44px]">
              <ValueCell
                value={row.valueB}
                type={row.type}
                compare={row.valueA}
                side="B"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Footer: row count */}
      <div className="border-t border-border bg-muted/50 px-4 py-2 flex items-center justify-between">
        <span className="text-[10px] text-muted-foreground">
          {rows.length} bonus {rows.length === 1 ? "type" : "types"}
        </span>
        <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="inline-block size-2 rounded-full bg-emerald-500" />
            Higher
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block size-2 rounded-full bg-muted-foreground/30" />
            Lower
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Compare Tab ──────────────────────────────────────────────────────────────

export interface CompareTabProps {
  ownedMap: Record<string, { code: string; currentLevel: number }>;
}

export function CompareTab({ ownedMap }: CompareTabProps) {
  const { presets } = useUserPresets();

  const [slotA, setSlotA] = useState<CompareSlot>({});
  const [slotB, setSlotB] = useState<CompareSlot>({});

  // Codes
  const codesA = useMemo(
    () => getSlotCodes(slotA, presets, ownedMap),
    [slotA, presets, ownedMap],
  );
  const codesB = useMemo(
    () => getSlotCodes(slotB, presets, ownedMap),
    [slotB, presets, ownedMap],
  );

  // Aggregated bonuses
  const mapA = useMemo(
    () => aggregateBonuses(codesA, slotA, presets, ownedMap),
    [codesA, slotA, presets, ownedMap],
  );
  const mapB = useMemo(
    () => aggregateBonuses(codesB, slotB, presets, ownedMap),
    [codesB, slotB, presets, ownedMap],
  );

  // Unified rows
  const rows = useMemo(() => buildRows(mapA, mapB), [mapA, mapB]);

  // Display names
  const nameA = slotA.savedPresetId
    ? (presets.find((p) => p.id === slotA.savedPresetId)?.name ?? "Preset A")
    : slotA.libraryPresetId
      ? (WONDER_PRESETS.find((p) => p.id === slotA.libraryPresetId)?.label ??
        "Preset A")
      : "Preset A";

  const nameB = slotB.savedPresetId
    ? (presets.find((p) => p.id === slotB.savedPresetId)?.name ?? "Preset B")
    : slotB.libraryPresetId
      ? (WONDER_PRESETS.find((p) => p.id === slotB.libraryPresetId)?.label ??
        "Preset B")
      : "Preset B";

  return (
    <div className="space-y-5">
      {/* ── Preset selectors ── */}
      <div className="grid grid-cols-2 gap-3">
        <PresetSelector
          slot={slotA}
          savedPresets={presets}
          onChangeSaved={(id) => setSlotA({ savedPresetId: id })}
          onChangeLibrary={(id) => setSlotA({ libraryPresetId: id })}
          label="A"
          accentClass="bg-sky-500 text-white"
        />
        <PresetSelector
          slot={slotB}
          savedPresets={presets}
          onChangeSaved={(id) => setSlotB({ savedPresetId: id })}
          onChangeLibrary={(id) => setSlotB({ libraryPresetId: id })}
          label="B"
          accentClass="bg-violet-500 text-white"
        />
      </div>

      {/* ── Synergy summary row ── */}
      {(codesA.length > 0 || codesB.length > 0) && (
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg border border-amber-200/60 dark:border-amber-800/40 bg-amber-50/50 dark:bg-amber-950/10 p-2.5 space-y-1.5">
            <div className="flex items-center gap-1">
              <Zap className="size-3 text-amber-500" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
                Synergies A
              </p>
            </div>
            <SynergyBadges codes={codesA} />
          </div>
          <div className="rounded-lg border border-violet-200/60 dark:border-violet-800/40 bg-violet-50/50 dark:bg-violet-950/10 p-2.5 space-y-1.5">
            <div className="flex items-center gap-1">
              <Zap className="size-3 text-violet-500" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400">
                Synergies B
              </p>
            </div>
            <SynergyBadges codes={codesB} />
          </div>
        </div>
      )}

      {/* ── Comparison table ── */}
      <ComparisonTable rows={rows} nameA={nameA} nameB={nameB} />
    </div>
  );
}
