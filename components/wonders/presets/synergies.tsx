"use client";

import { useState, useMemo } from "react";
import { Zap, TrendingUp, ChevronDown, ChevronUp, EyeOff, Eye } from "lucide-react";
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
  getBonusDescription,
} from "@/lib/wonders-utils";
import { WONDERS } from "@/data/wonders/index";
import type { WonderPresetEntry } from "@/data/wonders/types";
import { StatsBadge } from "@/components/wonders/stats-badge";

// ─── Synergy value multiplier ─────────────────────────────────────────────────

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

// ─── Synergy Panel ────────────────────────────────────────────────────────────
// Uses StatsBadge with the real icons from wonder.meta.synergies[i].icons
// and materialIcon from syn.tag — exactly like WonderDetailModal does.

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

  // Collect full synergy data (icons + tag) from the actual wonder meta
  const synergyBadges = useMemo(() => {
    return synergies.flatMap((s) => {
      const wonder = WONDERS[s.code];
      if (!wonder) return [];
      return wonder.meta.synergies.map((syn) => ({
        key: `${s.code}-${syn.tag}`,
        icons: syn.icons,
        materialIcon: syn.tag,
        value: s.synergyBonus
          ? multiplySynergyBonus(s.synergyBonus, s.synergyCount)
          : `×${s.synergyCount}`,
        alt: s.name,
        description: `${s.name}: ${s.synergyBonus ? multiplySynergyBonus(s.synergyBonus, s.synergyCount) : `×${s.synergyCount}`} — activated by ${s.synergyCount} wonder${s.synergyCount > 1 ? "s" : ""}`,
      }));
    });
  }, [synergies]);

  if (synergyBadges.length === 0) return null;

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

      {/* 2-column grid — same as WonderDetailModal */}
      <div className="grid grid-cols-2 gap-1.5">
        {synergyBadges.map((b) => (
          <StatsBadge
            key={b.key}
            icons={b.icons as [string, string | null]}
            materialIcon={b.materialIcon}
            value={b.value}
            alt={b.alt}
            description={b.description}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Wonder Boosts Panel ──────────────────────────────────────────────────────
// Split into two sub-columns: capital wonders (left) | allied wonders (right)
// Each wonder section: name header + 2-col StatsBadge grid (real icons from boost.icons)

interface WonderBoostRow {
  wonderCode: string;
  wonderName: string;
  slotType: "capital" | "allied";
  boosts: {
    type: string;
    icons: [string, string | null];
    value: number;
  }[];
}

function WonderBoostSection({
  w,
  collapsed,
  onToggle,
}: {
  w: WonderBoostRow;
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="space-y-1.5">
      <button
        onClick={onToggle}
        aria-expanded={!collapsed}
        className="w-full flex items-center justify-between gap-1 text-xs font-semibold text-foreground/90 hover:text-foreground transition-colors"
      >
        <span className="truncate min-w-0">{w.wonderName}</span>
        {collapsed ? (
          <ChevronDown className="size-3 shrink-0 text-muted-foreground" />
        ) : (
          <ChevronUp className="size-3 shrink-0 text-muted-foreground" />
        )}
      </button>

      {!collapsed && (
        <div className="grid grid-cols-2 gap-1.5 pl-1">
          {w.boosts.map((boost, i) => (
            <StatsBadge
              key={i}
              icons={boost.icons}
              value={formatBonusValue(boost.type, boost.value)}
              alt={getBonusLabel(boost.type)}
              description={getBonusDescription(boost.type, boost.value)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function WonderBoostsPanel({
  codes,
  entries,
  ownedMap,
  className,
  // Capital codes and allied codes for the 2-column split
  capitalCodes,
  alliedCodes,
}: {
  codes: string[];
  entries?: (WonderPresetEntry | null)[];
  ownedMap?: Record<string, { code: string; lvl: number }>;
  className?: string;
  capitalCodes?: string[];
  alliedCodes?: string[];
}) {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});

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
        const isAllied = alliedCodes?.includes(code) ?? false;

        return {
          wonderCode: code,
          wonderName: wonder.meta.name,
          slotType: isAllied ? "allied" : "capital",
          boosts,
        } satisfies WonderBoostRow;
      })
      .filter((w): w is WonderBoostRow => w !== null && w.boosts.length > 0);
  }, [codes, entries, ownedMap, alliedCodes]);

  if (wonderBoosts.length === 0) return null;

  const toggleCollapse = (code: string) =>
    setCollapsed((prev) => ({ ...prev, [code]: !prev[code] }));

  // Split into capital / allied groups
  const capitalBoosts = wonderBoosts.filter((w) => w.slotType === "capital");
  const alliedBoosts = wonderBoosts.filter((w) => w.slotType === "allied");
  const hasSplit = capitalCodes !== undefined && (capitalBoosts.length > 0 || alliedBoosts.length > 0);

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

      {hasSplit ? (
        // Two-column split: capital | allied
        <div className="grid grid-cols-2 gap-x-4 gap-y-0">
          {/* Capital column */}
          <div className="space-y-3">
            {capitalBoosts.length > 0 && (
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Capital
              </p>
            )}
            {capitalBoosts.map((w) => (
              <WonderBoostSection
                key={w.wonderCode}
                w={w}
                collapsed={collapsed[w.wonderCode] ?? false}
                onToggle={() => toggleCollapse(w.wonderCode)}
              />
            ))}
          </div>
          {/* Allied column */}
          <div className="space-y-3">
            {alliedBoosts.length > 0 && (
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                Allied
              </p>
            )}
            {alliedBoosts.map((w) => (
              <WonderBoostSection
                key={w.wonderCode}
                w={w}
                collapsed={collapsed[w.wonderCode] ?? false}
                onToggle={() => toggleCollapse(w.wonderCode)}
              />
            ))}
          </div>
        </div>
      ) : (
        // Single column (no split info — fallback, used in MobileSynergyDrawer)
        <div className="space-y-3">
          {wonderBoosts.map((w) => (
            <WonderBoostSection
              key={w.wonderCode}
              w={w}
              collapsed={collapsed[w.wonderCode] ?? false}
              onToggle={() => toggleCollapse(w.wonderCode)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── StatsSection ─────────────────────────────────────────────────────────────
// The top stats bar with 1/3 synergy + 2/3 boosts grid and Hide toggle.
// Replaces the old "hidden md:flex xl:hidden" + "hidden xl:flex" duplication.

export function StatsSection({
  codes,
  entries,
  ownedMap,
  capitalCodes,
  alliedCodes,
  className,
}: {
  codes: string[];
  entries?: (WonderPresetEntry | null)[];
  ownedMap?: Record<string, { code: string; lvl: number }>;
  capitalCodes?: string[];
  alliedCodes?: string[];
  className?: string;
}) {
  const [visible, setVisible] = useState(true);
  const hasWonders = codes.length > 0;

  return (
    <div className={cn("space-y-2", className)}>
      {/* Header row with Hide toggle */}
      <div className="flex items-center justify-between gap-2">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Stats
        </p>
        {hasWonders && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setVisible((v) => !v)}
            aria-pressed={visible}
            className="h-6 px-2 gap-1 text-[11px] text-muted-foreground hover:text-foreground"
          >
            {visible ? (
              <>
                <EyeOff className="size-3" />
                Hide
              </>
            ) : (
              <>
                <Eye className="size-3" />
                Show
              </>
            )}
          </Button>
        )}
      </div>

      {/* Empty state */}
      {!hasWonders && (
        <p className="text-xs text-muted-foreground">
          Add wonders to see stats
        </p>
      )}

      {/* 1/3 + 2/3 grid */}
      {hasWonders && visible && (
        <div className="grid grid-cols-3 gap-3 items-start">
          {/* Synergy — 1 col */}
          <div className="col-span-1">
            <SynergyPanel codes={codes} />
          </div>
          {/* Boosts — 2 cols */}
          <div className="col-span-2">
            <WonderBoostsPanel
              codes={codes}
              entries={entries}
              ownedMap={ownedMap}
              capitalCodes={capitalCodes}
              alliedCodes={alliedCodes}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Mobile Synergies Drawer — UNCHANGED ─────────────────────────────────────

export function MobileSynergyDrawer({
  codes,
  entries,
  ownedMap,
}: {
  codes: string[];
  entries?: (WonderPresetEntry | null)[];
  ownedMap?: Record<string, { code: string; lvl: number }>;
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

            {/* Wonder Boosts — single column in drawer */}
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
