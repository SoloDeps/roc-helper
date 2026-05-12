"use client";

/**
 * PresetStatsSection
 *
 * Renders Synergy (1/3) + Boosts (2/3) above the wonder grids.
 * Always the same layout — no breakpoint conditionals.
 *
 * - Shows toggle button (always visible when wonders are present)
 * - Empty state: hides toggle, shows placeholder message
 * - Top 5 boosts shown by default with expand
 */

import { useState, useMemo } from "react";
import { Zap, TrendingUp, ChevronDown, ChevronUp, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  computeSynergies,
  getWonderBoosts,
  getBonusLabel,
  formatBonusValue,
  getBonusDescription,
} from "@/lib/wonders-utils";
import { WONDERS } from "@/data/wonders/index";
import { StatsBadge } from "@/components/wonders/stats-badge";
import type { WonderPresetEntry } from "@/data/wonders/types";

// ─── multiplySynergyBonus (local helper) ──────────────────────────────────────

function multiplySynergyBonus(bonus: string, count: number): string {
  const match = bonus.match(/^(.*?)([+-]?\d+(?:\.\d+)?)(.*)$/);
  if (!match) return `${bonus} (${count})`;
  const prefix = match[1];
  const rawValue = parseFloat(match[2]);
  const suffix = match[3];
  const multiplied = rawValue * count;
  const formatted = Number.isInteger(multiplied)
    ? String(multiplied)
    : multiplied.toFixed(1).replace(/\.0$/, "");
  const sign = rawValue >= 0 && !match[2].startsWith("-") ? "+" : "";
  return `${prefix}${sign}${formatted}${suffix} (${count})`;
}

// ─── SynergyPanel ─────────────────────────────────────────────────────────────

function SynergyPanel({ codes }: { codes: string[] }) {
  const synergies = useMemo(
    () => computeSynergies(codes).filter((s) => s.synergyActive),
    [codes],
  );

  if (synergies.length === 0) return null;

  return (
    <div className="rounded-xl border border-amber-300/60 dark:border-amber-700/40 bg-amber-50 dark:bg-amber-950/20 p-3 space-y-2 h-full">
      <div className="flex items-center gap-1.5">
        <Zap className="size-3.5 text-amber-500" aria-hidden />
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

// ─── WonderBoostsPanel ────────────────────────────────────────────────────────

const MAX_VISIBLE = 5;

interface WonderBoostRow {
  wonderCode: string;
  wonderName: string;
  boosts: { type: string; icons: [string, string | null]; value: number }[];
}

function WonderBoostsPanel({
  codes,
  entries,
  ownedMap,
}: {
  codes: string[];
  entries?: (WonderPresetEntry | null)[];
  ownedMap?: Record<string, { code: string; lvl: number }>;
}) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [expanded, setExpanded] = useState(false);

  const wonderBoosts: WonderBoostRow[] = useMemo(() => {
    return codes
      .map((code) => {
        const wonder = WONDERS[code];
        if (!wonder) return null;
        let effectiveLevel = 1;
        if (entries) {
          const entry = entries.find((e) => e?.code === code);
          if (entry) effectiveLevel = entry.level ?? ownedMap?.[code]?.lvl ?? 1;
        } else if (ownedMap?.[code]) {
          effectiveLevel = ownedMap[code].lvl;
        }
        const boosts = getWonderBoosts(wonder, effectiveLevel);
        return { wonderCode: code, wonderName: wonder.meta.name, boosts };
      })
      .filter((w): w is WonderBoostRow => w !== null && w.boosts.length > 0);
  }, [codes, entries, ownedMap]);

  if (wonderBoosts.length === 0) return null;

  const visible = expanded ? wonderBoosts : wonderBoosts.slice(0, MAX_VISIBLE);
  const hasMore = wonderBoosts.length > MAX_VISIBLE;

  const toggleCollapse = (code: string) =>
    setCollapsed((prev) => ({ ...prev, [code]: !prev[code] }));

  return (
    <div className="rounded-xl border border-sky-300/60 dark:border-sky-700/40 bg-sky-50 dark:bg-sky-950/20 p-3 space-y-2">
      <div className="flex items-center gap-1.5">
        <TrendingUp className="size-3.5 text-sky-500" aria-hidden />
        <p className="text-xs font-semibold text-sky-700 dark:text-sky-400">
          Wonder Boosts ({wonderBoosts.length})
        </p>
      </div>

      <div className="space-y-2">
        {visible.map((w) => {
          const isCollapsed = collapsed[w.wonderCode] ?? false;
          return (
            <div key={w.wonderCode} className="space-y-1">
              <button
                onClick={() => toggleCollapse(w.wonderCode)}
                aria-expanded={!isCollapsed}
                aria-controls={`boosts-${w.wonderCode}`}
                className="w-full flex items-center justify-between gap-1 text-xs font-semibold text-foreground/90 hover:text-foreground transition-colors"
              >
                <span className="truncate min-w-0">{w.wonderName}</span>
                {isCollapsed ? (
                  <ChevronDown className="size-3 shrink-0 text-muted-foreground" />
                ) : (
                  <ChevronUp className="size-3 shrink-0 text-muted-foreground" />
                )}
              </button>
              {!isCollapsed && (
                <div
                  id={`boosts-${w.wonderCode}`}
                  className="pl-2 space-y-0.5 border-l border-sky-300/50 dark:border-sky-700/40"
                >
                  {w.boosts.map((boost, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between gap-2 text-xs"
                    >
                      <span className="flex items-center gap-1 text-foreground/70 min-w-0 truncate">
                        <span className="truncate">{getBonusLabel(boost.type)}</span>
                      </span>
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

      {hasMore && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors pt-1 flex items-center justify-center gap-1"
        >
          {expanded ? (
            <>Show less <ChevronUp className="size-3" /></>
          ) : (
            <>+{wonderBoosts.length - MAX_VISIBLE} more wonders <ChevronDown className="size-3" /></>
          )}
        </button>
      )}
    </div>
  );
}

// ─── PresetStatsSection ───────────────────────────────────────────────────────

interface PresetStatsSectionProps {
  codes: string[];
  entries: (WonderPresetEntry | null)[];
  ownedMap: Record<string, { code: string; lvl: number }>;
}

export function PresetStatsSection({
  codes,
  entries,
  ownedMap,
}: PresetStatsSectionProps) {
  const [statsVisible, setStatsVisible] = useState(true);
  const hasWonders = codes.length > 0;

  return (
    <div className="space-y-3">
      {/* Toggle row */}
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Stats
        </p>
        {hasWonders ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setStatsVisible((v) => !v)}
            aria-pressed={statsVisible}
            className="h-7 px-2 gap-1.5 text-xs text-muted-foreground hover:text-foreground"
          >
            {statsVisible ? (
              <>
                <EyeOff className="size-3.5" />
                Hide
              </>
            ) : (
              <>
                <Eye className="size-3.5" />
                Show
              </>
            )}
          </Button>
        ) : null}
      </div>

      {/* Empty state */}
      {!hasWonders && (
        <p className="text-xs text-muted-foreground py-2">
          Add wonders to see stats
        </p>
      )}

      {/* Stats grid: Synergy 1/3 | Boosts 2/3 */}
      {hasWonders && statsVisible && (
        <div className="grid grid-cols-3 gap-3 items-start">
          {/* Synergy — 1/3 */}
          <div className="col-span-1">
            <SynergyPanel codes={codes} />
          </div>
          {/* Boosts — 2/3 */}
          <div className="col-span-2">
            <WonderBoostsPanel
              codes={codes}
              entries={entries}
              ownedMap={ownedMap}
            />
          </div>
        </div>
      )}
    </div>
  );
}
