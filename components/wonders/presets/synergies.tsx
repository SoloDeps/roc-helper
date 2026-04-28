"use client";

import { useState, useMemo } from "react";
import { Zap, TrendingUp, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

import {
  computeSynergies,
  getWonderBoosts,
  getBonusLabel,
  formatBonusValue,
} from "@/lib/wonders-utils";
import { WONDERS } from "@/data/wonders/index";
import type { WonderPresetEntry } from "@/data/wonders/types";

// ─── Icon renderer ────────────────────────────────────────────────────────────
//
// Resolves icon keys to image paths. Adjust ICON_BASE_PATH to match your asset
// structure. `overlayIcon` is rendered smaller at bottom-right when present.

const ICON_BASE_PATH = "/images/icons";

function BonusIcon({
  main,
  overlay,
  size = 20,
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
      {/* Main icon */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`${ICON_BASE_PATH}/${main}.webp`}
        alt=""
        width={size}
        height={size}
        className="object-contain"
      />
      {/* Optional overlay icon – bottom-right, smaller */}
      {overlay && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`${ICON_BASE_PATH}/${overlay}.webp`}
          alt=""
          width={Math.round(size * 0.55)}
          height={Math.round(size * 0.55)}
          className="absolute bottom-0 right-0 object-contain z-10"
        />
      )}
    </span>
  );
}

// ─── Synergy value multiplier ─────────────────────────────────────────────────
//
// Extracts the numeric part of a synergyBonus string, multiplies it by count,
// then reconstructs the string with the same unit/suffix.
//
// Examples:
//   "+1 RP/day"           × 6  →  "+6 RP/day (6)"
//   "+100 primary goods"  × 6  →  "+600 primary goods (6)"
//   "+5%"                 × 6  →  "+30% (6)"
//   "Ranged Crit +1%"     × 1  →  "Ranged Crit +1% (1)"

function multiplySynergyBonus(bonus: string, count: number): string {
  // Match an optional sign, then digits (with optional decimal), then the rest
  const match = bonus.match(/^(.*?)([+-]?\d+(?:\.\d+)?)(.*)$/);
  if (!match) return `${bonus} (${count})`;

  const prefix = match[1]; // e.g. "" or "Ranged Crit "
  const rawValue = parseFloat(match[2]);
  const suffix = match[3]; // e.g. "%" or " RP/day" or " primary goods"

  const multiplied = rawValue * count;

  // Keep decimals only if necessary
  const formatted = Number.isInteger(multiplied)
    ? String(multiplied)
    : multiplied.toFixed(1).replace(/\.0$/, "");

  // Preserve original sign for positive values
  const sign = rawValue >= 0 && !match[2].startsWith("-") ? "+" : "";

  return `${prefix}${sign}${formatted}${suffix} (${count})`;
}

// ─── Synergy Panel ────────────────────────────────────────────────────────────

export function SynergyPanel({
  codes,
  className,
}: {
  codes: string[];
  className?: string;
}) {
  const synergies = useMemo(
    () => computeSynergies(codes).filter((s) => s.synergyActive),
    [codes],
  );

  if (synergies.length === 0) return null;

  return (
    <div
      className={cn(
        "rounded-xl border border-amber-300/60 dark:border-amber-700/40 bg-amber-50 dark:bg-amber-950/20 p-3 space-y-2",
        className,
      )}
    >
      <div className="flex items-center gap-1.5">
        <Zap className="size-3.5 text-amber-500" />
        <p className="text-xs font-semibold text-amber-700 dark:text-amber-400">
          Active Synergies ({synergies.length})
        </p>
      </div>
      <div className="space-y-1">
        {synergies.map((s) => (
          <div
            key={s.code}
            className="flex items-start justify-between gap-2 text-xs"
          >
            <span className="text-foreground/80 font-medium">{s.name}</span>
            <span className="text-amber-600 dark:text-amber-400 font-semibold text-right shrink-0">
              {s.synergyBonus
                ? multiplySynergyBonus(s.synergyBonus, s.synergyCount)
                : `×${s.synergyCount}`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Wonder Boosts Panel ──────────────────────────────────────────────────────
//
// Lists all bonus types for each active wonder at its effective level.
// Labels come from getBonusLabel(type); values from formatBonusValue(type, value).
// Icons are rendered by BonusIcon using bonus.icons[0] and bonus.icons[1].

interface WonderBoostRow {
  wonderCode: string;
  wonderName: string;
  boosts: {
    type: string;
    icons: [string, string | null];
    value: number;
  }[];
}

export function WonderBoostsPanel({
  codes,
  entries,
  ownedMap,
  className,
}: {
  codes: string[];
  entries?: (WonderPresetEntry | null)[];
  ownedMap?: Record<string, { code: string; currentLevel: number }>;
  className?: string;
}) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

  const wonderBoosts: WonderBoostRow[] = useMemo(() => {
    return codes
      .map((code) => {
        const wonder = WONDERS[code];
        if (!wonder) return null;

        // Resolve effective level: preset entry → owned level → fallback 1
        let effectiveLevel = 1;
        if (entries) {
          const entry = entries.find((e) => e?.code === code);
          if (entry) {
            effectiveLevel = entry.level ?? ownedMap?.[code]?.currentLevel ?? 1;
          }
        } else if (ownedMap?.[code]) {
          effectiveLevel = ownedMap[code].currentLevel;
        }

        const boosts = getWonderBoosts(wonder, effectiveLevel);

        return {
          wonderCode: code,
          wonderName: wonder.meta.name,
          boosts,
        } satisfies WonderBoostRow;
      })
      .filter((w): w is WonderBoostRow => w !== null && w.boosts.length > 0);
  }, [codes, entries, ownedMap]);

  if (wonderBoosts.length === 0) return null;

  const toggleCollapse = (code: string) =>
    setCollapsed((prev) => ({ ...prev, [code]: !prev[code] }));

  return (
    <div
      className={cn(
        "rounded-xl border border-sky-300/60 dark:border-sky-700/40 bg-sky-50 dark:bg-sky-950/20 p-3 space-y-2",
        className,
      )}
    >
      <div className="flex items-center gap-1.5">
        <TrendingUp className="size-3.5 text-sky-500" />
        <p className="text-xs font-semibold text-sky-700 dark:text-sky-400">
          Wonder Boosts ({wonderBoosts.length})
        </p>
      </div>

      <div className="space-y-2">
        {wonderBoosts.map((w) => {
          const isCollapsed = collapsed[w.wonderCode] ?? false;
          return (
            <div key={w.wonderCode} className="space-y-1">
              {/* Header: wonder name + collapse toggle */}
              <button
                onClick={() => toggleCollapse(w.wonderCode)}
                className="w-full flex items-center justify-between gap-1 text-xs font-semibold text-foreground/90 hover:text-foreground transition-colors"
              >
                <span className="truncate">{w.wonderName}</span>
                {isCollapsed ? (
                  <ChevronDown className="size-3 shrink-0 text-muted-foreground" />
                ) : (
                  <ChevronUp className="size-3 shrink-0 text-muted-foreground" />
                )}
              </button>

              {/* Bonus rows */}
              {!isCollapsed && (
                <div className="pl-2 space-y-0.5 border-l border-sky-300/50 dark:border-sky-700/40">
                  {w.boosts.map((boost, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between gap-2 text-xs"
                    >
                      {/* Icon + label */}
                      <span className="flex items-center gap-1 text-foreground/70 min-w-0">
                        <BonusIcon
                          main={boost.icons[0]}
                          overlay={boost.icons[1]}
                          size={16}
                        />
                        <span className="truncate">
                          {getBonusLabel(boost.type)}
                        </span>
                      </span>
                      {/* Value */}
                      <span className="text-sky-600 dark:text-sky-400 font-semibold text-right shrink-0">
                        {formatBonusValue(boost.type, boost.value)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Mobile Synergies Drawer ──────────────────────────────────────────────────

export function MobileSynergyDrawer({
  codes,
  entries,
  ownedMap,
}: {
  codes: string[];
  entries?: (WonderPresetEntry | null)[];
  ownedMap?: Record<string, { code: string; currentLevel: number }>;
}) {
  const [open, setOpen] = useState(false);

  const synergies = useMemo(
    () => computeSynergies(codes).filter((s) => s.synergyActive),
    [codes],
  );

  const hasSynergies = synergies.length > 0;
  const hasBoosts = codes.length > 0;

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className={cn(
          "relative h-9 gap-1.5 shrink-0",
          hasSynergies && "border-amber-400 text-amber-600 dark:text-amber-400",
        )}
        aria-label="View synergies and boosts"
      >
        <Zap size={14} />
        <span className="text-xs font-medium">Synergies</span>
        {hasSynergies && (
          <span className="ml-0.5 inline-flex items-center justify-center size-4 rounded-full bg-amber-400 text-amber-950 text-[10px] font-bold leading-none">
            {synergies.length}
          </span>
        )}
      </Button>

      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="px-4 pb-8">
          <DrawerHeader className="px-0 pt-4 pb-4">
            <DrawerTitle className="flex items-center gap-2">
              <Zap className="size-4 text-amber-500" />
              Synergies &amp; Boosts
            </DrawerTitle>
          </DrawerHeader>

          <div className="space-y-4 overflow-y-auto">
            {/* Synergies */}
            {hasSynergies ? (
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-amber-600 dark:text-amber-400">
                  Active Synergies
                </p>
                {synergies.map((s) => (
                  <div
                    key={s.code}
                    className="flex items-start justify-between gap-4 py-2 border-b border-border last:border-0 text-sm"
                  >
                    <span className="font-medium">{s.name}</span>
                    <span className="text-amber-600 dark:text-amber-400 font-semibold shrink-0">
                      {s.synergyBonus
                        ? multiplySynergyBonus(s.synergyBonus, s.synergyCount)
                        : `×${s.synergyCount}`}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No active synergies yet. Add wonders to your preset to unlock
                synergies.
              </p>
            )}

            {/* Wonder Boosts */}
            {hasBoosts && (
              <div className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-sky-600 dark:text-sky-400">
                  Wonder Boosts
                </p>
                <WonderBoostsPanel
                  codes={codes}
                  entries={entries}
                  ownedMap={ownedMap}
                  className="border-0 bg-transparent p-0"
                />
              </div>
            )}
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
