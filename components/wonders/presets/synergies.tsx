"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import {
  Zap,
  TrendingUp,
  ChevronsDown,
  ChevronsUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

import {
  computeSynergies,
  computeTagCounts,
  getWonderBoosts,
} from "@/resolvers/wonders";
import type { WonderBoostItem } from "@/resolvers/wonders";
import { getBonusLabel, formatBonusValue, bonusKey } from "@/resolvers/bonus";
import { WONDERS } from "@/data/wonders/index";
import type { WonderPresetEntry, MaterialType } from "@/data/wonders/types";
import { resolveIconPath } from "@/components/wonders/stats-badge";

// ─── Constants ────────────────────────────────────────────────────────────────

const MAX_HEIGHT = 345;

// ─── Synergy value — just the base value, no count in parens ────────────────

/**
 * Parses the numeric magnitude out of a pre-formatted synergy bonus string
 * (e.g. "+2%" → 2), multiplied by the activator count. Used both to render
 * the display string and to compare synergy strength across presets.
 */
export function parseSynergyMagnitude(bonus: string, count: number): number {
  const match = bonus.match(/^(.*?)([+-]?\d+(?:\.\d+)?)(.*)$/);
  if (!match) return 0;
  return parseFloat(match[2]) * Math.max(count, 1);
}

export function formatSynergyValue(bonus: string, count: number): string {
  if (count <= 1) return bonus;
  // Multiply the numeric part by count, no trailing "(N)"
  const match = bonus.match(/^(.*?)([+-]?\d+(?:\.\d+)?)(.*)$/);
  if (!match) return bonus;
  const prefix = match[1];
  const rawValue = parseFloat(match[2]);
  const suffix = match[3];
  const multiplied = parseSynergyMagnitude(bonus, count);
  const formatted = Number.isInteger(multiplied)
    ? String(multiplied)
    : multiplied.toFixed(1).replace(/\.0$/, "");
  const sign =
    prefix && !/^[+-]$/.test(prefix)
      ? ""
      : rawValue >= 0 && !match[2].startsWith("-")
        ? "+"
        : "";
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
}

// ─── Material Labels ──────────────────────────────────────────────────────────

export const MATERIAL_LABEL: Record<MaterialType, string> = {
  naval: "Naval",
  temple: "Temple",
  palace: "Palace",
  statue: "Statue",
  nature: "Nature",
  arena: "Arena",
  fortress: "Fortress",
};

// ─── Tag-grouped section ──────────────────────────────────────────────────────

function ActiveTagSection({
  tag,
  entries,
  weightedTotal,
}: {
  tag: MaterialType;
  entries: {
    wonderName: string;
    wonderCode: string;
    icons: [string, string | null];
    bonus: string;
  }[];
  weightedTotal: number;
}) {
  return (
    <div className="space-y-1">
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {MATERIAL_LABEL[tag]} ({weightedTotal})
      </p>
      {entries.map((e, i) => (
        <div
          key={`${e.wonderCode}-${i}`}
          className="flex items-center justify-between gap-2 px-2 py-1.5 rounded-md border border-border bg-background h-9"
        >
          <div className="flex items-center gap-2 min-w-0 shrink-0">
            <div className="relative shrink-0 size-6">
              <img
                src={resolveIconPath(e.icons[0])}
                alt={tag}
                className="size-6 object-contain"
              />
              {e.icons[1] && (
                <img
                  src={resolveIconPath(e.icons[1])}
                  alt=""
                  className="absolute -bottom-1 -right-1 h-3.5 w-3.5 object-contain drop-shadow-sm"
                />
              )}
            </div>
            <span className="text-xs font-medium truncate">
              {e.wonderName}
            </span>
          </div>
          <span className="text-xs font-semibold tabular-nums shrink-0">
            {e.bonus}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Synergy Panel ────────────────────────────────────────────────────────────
// Full-width rows: icon in bordered frame, name + description, value right-aligned.

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

  const tagCounts = useMemo(() => computeTagCounts(codes), [codes]);

  const totalCount = synergies.length;

  const synergiesByTag = useMemo(() => {
    const grouped = new Map<
      MaterialType,
      { wonderName: string; wonderCode: string; icons: [string, string | null]; bonus: string }[]
    >();
    for (const s of synergies) {
      const wonder = WONDERS[s.code];
      if (!wonder) continue;
      const bonus = s.synergyBonus
        ? formatSynergyValue(s.synergyBonus, s.synergyCount)
        : `×${s.synergyCount}`;
      for (const syn of wonder.meta.synergies) {
        let group = grouped.get(syn.tag);
        if (!group) {
          group = [];
          grouped.set(syn.tag, group);
        }
        // Un même wonder peut avoir plusieurs définitions de synergie pour le
        // même tag (data-driven) — on évite de le lister deux fois dans la
        // même section, ce qui causait des clés React dupliquées.
        if (group.some((entry) => entry.wonderCode === s.code)) continue;
        group.push({
          wonderName: s.name,
          wonderCode: s.code,
          icons: syn.icons,
          bonus,
        });
      }
    }
    return [...grouped.entries()].sort((a, b) => b[1].length - a[1].length);
  }, [synergies]);

  if (totalCount === 0) {
    return (
      <div
        className={cn(
          "rounded-xl border border-border bg-card p-3 space-y-2 min-h-[90px]",
          className,
        )}
      >
        <div className="flex items-center gap-1.5">
          <Zap className="size-3.5 text-muted-foreground" />
          <p className="text-xs font-semibold text-foreground">
            Active Synergies
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          {codes.length === 0
            ? "Add wonders to your preset to see active synergies here."
            : "No active synergies yet with the selected wonders."}
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-3 space-y-2 min-h-[90px]",
        className,
      )}
    >
      <div className="flex items-center gap-1.5">
        <Zap className="size-3.5 text-muted-foreground" />
        <p className="text-xs font-semibold text-foreground">
          Active Synergies ({totalCount})
        </p>
      </div>

      <div className="space-y-3">
        {synergiesByTag.map(([tag, entries]) => (
          <ActiveTagSection
            key={tag}
            tag={tag}
            entries={entries}
            weightedTotal={tagCounts[tag] ?? entries.length}
          />
        ))}
      </div>
    </div>
  );
}

// ─── Wonder Boosts Panel ──────────────────────────────────────────────────────

interface WonderBoostRow {
  wonderCode: string;
  wonderName: string;
  material: MaterialType;
  slotType: "capital" | "allied";
  boosts: WonderBoostItem[];
}

function WonderBoostSection({ w }: { w: WonderBoostRow }) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-semibold text-foreground/90 truncate">
        {w.wonderName}
      </p>
      <div className="space-y-1 pl-1">
        {w.boosts.map((boost) => (
          <div
            key={bonusKey(boost)}
            className="flex items-center justify-between gap-2 px-2 py-1.5 rounded-md border border-border bg-background h-9"
          >
            <div className="flex items-center gap-2 min-w-0 shrink-0">
              <div className="relative shrink-0 size-6">
                <img
                  src={resolveIconPath(boost.icons[0])}
                  alt={getBonusLabel(boost.type, boost.instance)}
                  className="size-6 object-contain"
                />
                {boost.icons[1] && (
                  <img
                    src={resolveIconPath(boost.icons[1])}
                    alt=""
                    className="absolute -bottom-1 -right-1 h-3.5 w-3.5 object-contain drop-shadow-sm"
                  />
                )}
              </div>
              <span className="text-xs font-medium truncate">
                {getBonusLabel(boost.type, boost.instance)}
              </span>
            </div>
            <span className="text-xs font-semibold tabular-nums shrink-0">
              {formatBonusValue(boost.format, boost.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function GroupedBoostColumn({ wonders }: { wonders: WonderBoostRow[] }) {
  if (wonders.length === 0) return null;

  return (
    <div className="space-y-2">
      {wonders.map((w) => (
        <WonderBoostSection key={w.wonderCode} w={w} />
      ))}
    </div>
  );
}

export function WonderBoostsPanel({
  codes,
  entries,
  ownedMap,
  className,
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
          material: wonder.meta.material1,
          slotType: isAllied ? ("allied" as const) : ("capital" as const),
          boosts,
        };
      })
      .filter((w): w is WonderBoostRow => w !== null && w.boosts.length > 0);
  }, [codes, entries, ownedMap, alliedCodes]);

  // On considère qu'on est en "mode split" (colonnes Capital / Allied) dès lors
  // que l'appelant a fourni ces deux listes — même vides — plutôt que de se
  // baser sur la présence de boosts, pour que les deux colonnes restent
  // toujours visibles (avec leur propre état vide) une fois le composant
  // branché en mode split.
  const hasSplit = capitalCodes !== undefined && alliedCodes !== undefined;

  const capitalBoosts = wonderBoosts.filter((w) => w.slotType === "capital");
  const alliedBoosts = wonderBoosts.filter((w) => w.slotType === "allied");

  if (!hasSplit && wonderBoosts.length === 0) {
    return (
      <div
        className={cn(
          "rounded-xl border border-dashed border-border bg-card p-3 space-y-2",
          className,
        )}
      >
        <div className="flex items-center gap-1.5">
          <TrendingUp className="size-3.5 text-muted-foreground" />
          <p className="text-xs font-semibold text-foreground">
            Wonder Boosts
          </p>
        </div>
        <p className="text-xs text-muted-foreground">
          Add wonders to your preset to see their boosts here.
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-3 space-y-2",
        className,
      )}
    >
      <div className="flex items-center gap-1.5">
        <TrendingUp className="size-3.5 text-muted-foreground" />
        <p className="text-xs font-semibold text-foreground">
          {wonderBoosts.length > 0
            ? `Wonder Boosts (${wonderBoosts.length})`
            : "Wonder Boosts"}
        </p>
      </div>

      {hasSplit ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
              Capital
            </p>
            {capitalBoosts.length > 0 ? (
              <GroupedBoostColumn wonders={capitalBoosts} />
            ) : (
              <p className="text-xs text-muted-foreground">
                {(capitalCodes?.length ?? 0) > 0
                  ? "No boosts from these wonders."
                  : "No wonder added yet."}
              </p>
            )}
          </div>
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
              Allied
            </p>
            {alliedBoosts.length > 0 ? (
              <GroupedBoostColumn wonders={alliedBoosts} />
            ) : (
              <p className="text-xs text-muted-foreground">
                {(alliedCodes?.length ?? 0) > 0
                  ? "No boosts from these wonders."
                  : "No wonder added yet."}
              </p>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {wonderBoosts.map((w) => (
            <WonderBoostSection key={w.wonderCode} w={w} />
          ))}
        </div>
      )}
    </div>
  );
}