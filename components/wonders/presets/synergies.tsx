"use client";

<<<<<<< Updated upstream
import { useState, useMemo } from "react";
import { Zap, TrendingUp, ChevronDown, ChevronUp, EyeOff, Eye } from "lucide-react";
=======
import { useState, useMemo, useRef, useEffect } from "react";
import {
  Zap,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  EyeOff,
  Eye,
  ChevronsDown,
  ChevronsUp,
} from "lucide-react";
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
import type { WonderPresetEntry } from "@/data/wonders/types";
import { StatsBadge } from "@/components/wonders/stats-badge";

// ─── Synergy value multiplier ─────────────────────────────────────────────────

function multiplySynergyBonus(bonus: string, count: number): string {
  const match = bonus.match(/^(.*?)([+-]?\d+(?:\.\d+)?)(.*)$/);
  if (!match) return `${bonus} (${count})`;
=======
import type { WonderPresetEntry, MaterialType } from "@/data/wonders/types";
import { StatsBadge } from "@/components/wonders/stats-badge";

// ─── Constants ────────────────────────────────────────────────────────────────

const MAX_HEIGHT = 345;

// Material display order + labels
const MATERIAL_ORDER: MaterialType[] = [
  "arena",
  "fortress",
  "nature",
  "naval",
  "palace",
  "statue",
  "temple",
];

const MATERIAL_LABEL: Record<MaterialType, string> = {
  arena: "Arena",
  fortress: "Fortress",
  nature: "Nature",
  naval: "Naval",
  palace: "Palace",
  statue: "Statue",
  temple: "Temple",
};

// ─── Synergy value — just the base value, no count in parens ────────────────

function formatSynergyValue(bonus: string, count: number): string {
  if (count <= 1) return bonus;
  // Multiply the numeric part by count, no trailing "(N)"
  const match = bonus.match(/^(.*?)([+-]?\d+(?:\.\d+)?)(.*)$/);
  if (!match) return bonus;
>>>>>>> Stashed changes
  const prefix = match[1];
  const rawValue = parseFloat(match[2]);
  const suffix = match[3];
  const multiplied = rawValue * count;
  const formatted = Number.isInteger(multiplied)
    ? String(multiplied)
    : multiplied.toFixed(1).replace(/\.0$/, "");
  const sign = rawValue >= 0 && !match[2].startsWith("-") ? "+" : "";
<<<<<<< Updated upstream
  return `${prefix}${sign}${formatted}${suffix} (${count})`;
=======
  return `${prefix}${sign}${formatted}${suffix}`;
}

// ─── ExpandablePanel ──────────────────────────────────────────────────────────
// Wraps any content with a max-height + "Show more / Show less" toggle.
// If content fits within MAX_HEIGHT, no button is rendered.

function ExpandablePanel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [needsExpand, setNeedsExpand] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    // Use ResizeObserver so it re-checks when wonders are added/removed
    const ro = new ResizeObserver(() => {
      setNeedsExpand(el.scrollHeight > MAX_HEIGHT + 2);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div className={className}>
      <div
        ref={contentRef}
        className="overflow-hidden transition-all duration-300"
        style={{ maxHeight: needsExpand && !expanded ? MAX_HEIGHT : undefined }}
      >
        {children}
      </div>

      {needsExpand && (
        <button
          onClick={() => setExpanded((v) => !v)}
          className="w-full flex items-center justify-center gap-1 pt-2 text-[11px] font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          {expanded ? (
            <>
              <ChevronsUp className="size-3" />
              Show less
            </>
          ) : (
            <>
              <ChevronsDown className="size-3" />
              Show more
            </>
          )}
        </button>
      )}
    </div>
  );
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
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
=======
  // Build badge data from real synergy icons — group by material1
  const grouped = useMemo(() => {
    type Badge = {
      key: string;
      icons: [string, string | null];
      materialIcon: MaterialType;
      value: string;
      alt: string;
      description: string;
      material: MaterialType;
    };

    const byMaterial = new Map<MaterialType, Badge[]>();

    synergies.forEach((s) => {
      const wonder = WONDERS[s.code];
      if (!wonder) return;
      const mat = wonder.meta.material1;

      wonder.meta.synergies.forEach((syn) => {
        const value = s.synergyBonus
          ? formatSynergyValue(s.synergyBonus, s.synergyCount)
          : `×${s.synergyCount}`;
        const description = `${s.name} — ${value}, activated by ${s.synergyCount} wonder${s.synergyCount > 1 ? "s" : ""}`;

        const badge: Badge = {
          key: `${s.code}-${syn.tag}`,
          icons: syn.icons as [string, string | null],
          materialIcon: syn.tag,
          value,
          alt: s.name,
          description,
          material: mat,
        };

        const list = byMaterial.get(mat) ?? [];
        list.push(badge);
        byMaterial.set(mat, list);
      });
    });

    // Return sorted by MATERIAL_ORDER
    return MATERIAL_ORDER.filter((m) => byMaterial.has(m)).map((m) => ({
      material: m,
      badges: byMaterial.get(m)!,
    }));
  }, [synergies]);

  if (grouped.length === 0) return null;

  const totalCount = synergies.length;
>>>>>>> Stashed changes

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
          Active Synergies ({totalCount})
        </p>
      </div>

<<<<<<< Updated upstream
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
=======
      <ExpandablePanel>
        <div className="space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
            Grouped by material
          </p>
          {grouped.map(({ material, badges }) => (
            <div key={material} className="space-y-1.5">
              {/* Material group label */}
              <p className="text-xs font-semibold text-foreground/90">
                {MATERIAL_LABEL[material]}
              </p>
              {/* 2-col badge grid */}
              <div className="grid grid-cols-2 gap-1.5">
                {badges.map((b) => (
                  <StatsBadge
                    key={b.key}
                    icons={b.icons}
                    materialIcon={b.materialIcon}
                    value={b.value}
                    alt={b.alt}
                    description={b.description}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </ExpandablePanel>
>>>>>>> Stashed changes
    </div>
  );
}

// ─── Wonder Boosts Panel ──────────────────────────────────────────────────────
<<<<<<< Updated upstream
// Split into two sub-columns: capital wonders (left) | allied wonders (right)
// Each wonder section: name header + 2-col StatsBadge grid (real icons from boost.icons)
=======
>>>>>>> Stashed changes

interface WonderBoostRow {
  wonderCode: string;
  wonderName: string;
<<<<<<< Updated upstream
=======
  material: MaterialType;
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
=======
// Flat list of wonders within a slot column — no material grouping
function GroupedBoostColumn({
  wonders,
  collapsed,
  onToggle,
}: {
  wonders: WonderBoostRow[];
  collapsed: Record<string, boolean>;
  onToggle: (code: string) => void;
}) {
  if (wonders.length === 0) return null;

  return (
    <div className="space-y-2">
      {wonders.map((w) => (
        <WonderBoostSection
          key={w.wonderCode}
          w={w}
          collapsed={collapsed[w.wonderCode] ?? false}
          onToggle={() => onToggle(w.wonderCode)}
        />
      ))}
    </div>
  );
}

>>>>>>> Stashed changes
export function WonderBoostsPanel({
  codes,
  entries,
  ownedMap,
  className,
<<<<<<< Updated upstream
  // Capital codes and allied codes for the 2-column split
=======
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
          slotType: isAllied ? "allied" : "capital",
=======
          material: wonder.meta.material1,
          slotType: isAllied ? ("allied" as const) : ("capital" as const),
>>>>>>> Stashed changes
          boosts,
        };
      })
      .filter((w): w is WonderBoostRow => w !== null && w.boosts.length > 0);
  }, [codes, entries, ownedMap, alliedCodes]);

  if (wonderBoosts.length === 0) return null;

  const toggleCollapse = (code: string) =>
    setCollapsed((prev) => ({ ...prev, [code]: !prev[code] }));

<<<<<<< Updated upstream
  // Split into capital / allied groups
  const capitalBoosts = wonderBoosts.filter((w) => w.slotType === "capital");
  const alliedBoosts = wonderBoosts.filter((w) => w.slotType === "allied");
  const hasSplit = capitalCodes !== undefined && (capitalBoosts.length > 0 || alliedBoosts.length > 0);
=======
  const hasSplit =
    capitalCodes !== undefined &&
    (capitalCodes.length > 0 || (alliedCodes?.length ?? 0) > 0);

  const capitalBoosts = wonderBoosts.filter((w) => w.slotType === "capital");
  const alliedBoosts = wonderBoosts.filter((w) => w.slotType === "allied");
>>>>>>> Stashed changes

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

<<<<<<< Updated upstream
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
=======
      <ExpandablePanel>
        {hasSplit ? (
          <div className="grid grid-cols-2 gap-x-4">
            {/* Capital column */}
            <div className="space-y-1">
              {capitalBoosts.length > 0 && (
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                  Capital
                </p>
              )}
              <GroupedBoostColumn
                wonders={capitalBoosts}
                collapsed={collapsed}
                onToggle={toggleCollapse}
              />
            </div>
            {/* Allied column */}
            <div className="space-y-1">
              {alliedBoosts.length > 0 && (
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-2">
                  Allied
                </p>
              )}
              <GroupedBoostColumn
                wonders={alliedBoosts}
                collapsed={collapsed}
                onToggle={toggleCollapse}
              />
            </div>
          </div>
        ) : (
          // Single column fallback (drawer)
          <div className="space-y-3">
            {wonderBoosts.map((w) => (
>>>>>>> Stashed changes
              <WonderBoostSection
                key={w.wonderCode}
                w={w}
                collapsed={collapsed[w.wonderCode] ?? false}
                onToggle={() => toggleCollapse(w.wonderCode)}
              />
            ))}
          </div>
<<<<<<< Updated upstream
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
=======
        )}
      </ExpandablePanel>
    </div>
  );
}

// ─── StatsSection ─────────────────────────────────────────────────────────────

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

      {!hasWonders && (
        <p className="text-xs text-muted-foreground">
          Add wonders to see stats
        </p>
      )}

      {hasWonders && visible && (
        <div className="grid grid-cols-3 gap-3 items-start">
          <div className="col-span-1">
            <SynergyPanel codes={codes} />
          </div>
          <div className="col-span-2">
            <WonderBoostsPanel
              codes={codes}
              entries={entries}
              ownedMap={ownedMap}
              capitalCodes={capitalCodes}
              alliedCodes={alliedCodes}
            />
          </div>
>>>>>>> Stashed changes
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
                        ? formatSynergyValue(s.synergyBonus, s.synergyCount)
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

<<<<<<< Updated upstream
            {/* Wonder Boosts — single column in drawer */}
=======
>>>>>>> Stashed changes
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
