"use client";

/**
 * WonderDetailModal — v7
 * ──────────────────────
 * Changes vs v6:
 * - Bonus display: show delta gained AT the level (+X%) instead of cumulative total
 * - Layout: mobile = bonus between level header and resources; desktop = bonus pills inline next to "Level N"
 * - Blueprint badge moved into the resources cost grid (first position) instead of the level header
 * - Workers display commented out (pending decision)
 * - ViewToggle: icon-only on mobile, icon + text on desktop
 */

import { useMemo, useState, memo, useCallback } from "react";
import { Check, X, List, BarChart2 } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn, formatNumber } from "@/lib/utils";
import type { Wonder, MaterialType } from "@/data/wonders/types";

import {
  WONDER_IMAGE_MAP,
  WONDER_IMAGE_OFFSET_PX,
  MATERIAL_COLORS,
  getCostTables,
  getGoodsTable,
  fmtCost,
  fmtCompact,
  sumCostEntries,
  BLUEPRINT_COSTS,
  getMaterialAmounts,
} from "@/data/wonders/wonder-config";
import { getItemIconLocal, getGoodNameFromPriorityEra } from "@/lib/utils";
import { useBuildingSelections } from "@/hooks/use-building-selections";
import { ResourceBadge } from "../items/resource-badge";
import { StatsBadge } from "./stats-badge";
import { getBonusLabel, formatBonusValue } from "@/lib/wonders-utils";
import { ResponsiveSelect } from "../modals/responsive-select";
import { Badge } from "../ui/badge";
import { MATERIAL_ICONS } from "@/lib/catalog";

// ─── Icon resolution ───────────────────────────────────────────────────────────

const RESOURCE_ICONS: Record<string, string> = {
  coin: "/images/goods/coins.webp",
  food: "/images/goods/food.webp",
  rp: "/images/goods/research_points.webp",
  worker: "/images/game_icons/icon_workers_capital.webp",
};

function getResourceIconSrc(type: string): string {
  if (type.startsWith("material:")) {
    const mat = type.slice(9) as MaterialType;
    return MATERIAL_ICONS[mat] ?? "/images/goods/default.webp";
  }
  return RESOURCE_ICONS[type] ?? "/images/goods/default.webp";
}

// ─── MaterialTag ───────────────────────────────────────────────────────────────

function MaterialTag({ material }: { material: MaterialType }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "font-bold rounded-sm border-alpha-100 border shrink-0 uppercase tracking-wide px-1.5 text-[11px] leading-[20px] h-5 py-0",
        MATERIAL_COLORS[material],
      )}
    >
      {material}
    </Badge>
  );
}

// ─── Bonus icon (mini) ────────────────────────────────────────────────────────

const ICON_BASE_PATH = "/images/icons";

function BonusIcon({
  main,
  overlay,
  size = 16,
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
          width={Math.round(size * 0.55)}
          height={Math.round(size * 0.55)}
          className="absolute bottom-0 right-0 object-contain z-10"
        />
      )}
    </span>
  );
}

// ─── Types internes ────────────────────────────────────────────────────────────

interface LevelCostData {
  level: number;
  blueprintRequired: boolean;
  rp3: number | null;
  rp5: number | null;
  rp10: number | null;
  mat1Amount: number;
  mat2Amount: number;
  coinTotal: number;
  foodTotal: number;
  goodsEntries: { iconKey: string; amount: number }[];
  workers: number | null;
}

interface RangeTotals {
  blueprints: number;
  rp3Total: number;
  rp5Total: number;
  rp10Total: number;
  rpAllTotal: number;
  mat1Total: number;
  mat2Total: number;
  coinTotal: number;
  foodTotal: number;
  goodsByKey: Map<string, number>;
}

interface BonusDelta {
  type: string;
  icons: [string, string | null];
  baseValue: number;
  finalValue: number;
  perLevel: { level: number; value: number }[];
}

// ─── Builders ─────────────────────────────────────────────────────────────────

function buildLevelCostData(wonder: Wonder, level: number): LevelCostData {
  const { coinTable, foodTable, rpTable, workerTable } = getCostTables(wonder);
  const goodsTable = getGoodsTable(wonder);

  const bp = BLUEPRINT_COSTS[level];
  const rp = rpTable[level];
  const mat = getMaterialAmounts(level);
  const coins = coinTable[level] ?? [];
  const food = foodTable[level] ?? [];
  const goods = goodsTable[level] ?? [];
  const wk = workerTable[level] ?? null;

  const goodsMap = new Map<string, number>();
  for (const g of goods) {
    goodsMap.set(g.iconKey, (goodsMap.get(g.iconKey) ?? 0) + g.amount);
  }

  return {
    level,
    blueprintRequired: bp?.required ?? false,
    rp3: rp?.rp3 ? rp.rp3.amount : null,
    rp5: rp?.rp5 ? rp.rp5.amount : null,
    rp10: rp?.rp10 ? rp.rp10.amount : null,
    mat1Amount: mat?.mat1.amount ?? 0,
    mat2Amount: mat?.mat2.amount ?? 0,
    coinTotal: sumCostEntries(coins),
    foodTotal: sumCostEntries(food),
    goodsEntries: Array.from(goodsMap.entries()).map(([iconKey, amount]) => ({
      iconKey,
      amount,
    })),
    workers: wk,
  };
}

function computeRangeTotals(rows: LevelCostData[]): RangeTotals {
  let blueprints = 0,
    rp3Total = 0,
    rp5Total = 0,
    rp10Total = 0;
  let mat1Total = 0,
    mat2Total = 0,
    coinTotal = 0,
    foodTotal = 0;
  const goodsByKey = new Map<string, number>();

  for (const row of rows) {
    if (row.blueprintRequired) blueprints++;
    if (row.rp3 != null) rp3Total += row.rp3 * 3;
    if (row.rp5 != null) rp5Total += row.rp5 * 5;
    if (row.rp10 != null) rp10Total += row.rp10 * 10;
    mat1Total += row.mat1Amount;
    mat2Total += row.mat2Amount;
    coinTotal += row.coinTotal;
    foodTotal += row.foodTotal;
    for (const { iconKey, amount } of row.goodsEntries) {
      goodsByKey.set(iconKey, (goodsByKey.get(iconKey) ?? 0) + amount);
    }
  }

  return {
    blueprints,
    rp3Total,
    rp5Total,
    rp10Total,
    rpAllTotal: rp3Total + rp5Total + rp10Total,
    mat1Total,
    mat2Total,
    coinTotal,
    foodTotal,
    goodsByKey,
  };
}

function computeBonusDeltas(
  wonder: Wonder,
  fromLevel: number,
  toLevel: number,
): BonusDelta[] {
  if (toLevel <= fromLevel) return [];

  return wonder.bonuses.map((bonus) => {
    const baseValue = bonus.values[Math.max(fromLevel - 1, 0)] ?? 0;
    const finalValue = bonus.values[toLevel - 1] ?? 0;
    const perLevel: { level: number; value: number }[] = [];

    for (let lv = fromLevel + 1; lv <= toLevel; lv++) {
      const val = bonus.values[lv - 1] ?? 0;
      perLevel.push({ level: lv, value: val });
    }

    return {
      type: bonus.type,
      icons: bonus.icons as [string, string | null],
      baseValue,
      finalValue,
      perLevel,
    };
  });
}

function getActiveBonusDeltas(deltas: BonusDelta[]): BonusDelta[] {
  return deltas.filter((d) => d.finalValue !== d.baseValue);
}

function getBonusGainsAtLevel(
  wonder: Wonder,
  level: number,
): { type: string; icons: [string, string | null]; delta: number }[] {
  if (level <= 1) {
    return wonder.bonuses
      .map((b) => ({
        type: b.type,
        icons: b.icons as [string, string | null],
        delta: b.values[0] ?? 0,
      }))
      .filter((b) => b.delta !== 0);
  }

  const prev = level - 2;
  const curr = level - 1;

  return wonder.bonuses
    .map((b) => ({
      type: b.type,
      icons: b.icons as [string, string | null],
      prevVal: b.values[prev] ?? 0,
      currVal: b.values[curr] ?? 0,
    }))
    .filter((b) => b.currVal !== b.prevVal)
    .map(({ type, icons, prevVal, currVal }) => ({
      type,
      icons,
      // delta = bonus gained at this specific level (e.g. +1.5%, not +13.5% cumulative)
      delta: currVal - prevVal,
    }));
}

// ─── Goods resolution ────────────────────────────────────────────────────────

function resolveGoodsIcon(iconKey: string, userSelections: string[][]): string {
  const m = iconKey.match(/^(primary|secondary|tertiary)_([a-z]+)$/i);
  if (m) {
    const resolvedName = getGoodNameFromPriorityEra(
      m[1],
      m[2].toUpperCase(),
      userSelections,
    );
    return getItemIconLocal(resolvedName || "default");
  }
  return getItemIconLocal(iconKey);
}

// ─── LevelCostRow ─────────────────────────────────────────────────────────────

function LevelCostRow({
  row,
  wonder,
  mat1Label,
  mat2Label,
  userSelections,
  wonderName,
  isCapitalCity,
}: {
  row: LevelCostData;
  wonder: Wonder;
  mat1Label: MaterialType;
  mat2Label: MaterialType;
  userSelections: string[][];
  wonderName: string;
  /** Workers are only shown for Capital City wonders */
  isCapitalCity: boolean;
}) {
  // Blueprint is now displayed inside the resources grid (first position)
  const hasAnyCost =
    row.blueprintRequired ||
    row.rp3 != null ||
    row.rp5 != null ||
    row.rp10 != null ||
    row.mat1Amount > 0 ||
    row.mat2Amount > 0 ||
    row.coinTotal > 0 ||
    row.foodTotal > 0 ||
    row.goodsEntries.length > 0;
  // Workers display is temporarily disabled — uncomment isCapitalCity && row.workers != null
  // when the feature is ready
  // const showWorkers = isCapitalCity && row.workers != null;

  const bonusGains = useMemo(
    () => getBonusGainsAtLevel(wonder, row.level),
    [wonder, row.level],
  );

  return (
    <div className="rounded-sm bg-background-300 border px-3 py-2.5 space-y-2">
      {/* ── Stats + Resources unified grid ──
          Mobile  : "Level N" spans full width (col-span-3); StatsBadges wrap below it,
                    each taking one column — same grid as resources.
          Desktop : "Level N" in col 1, StatsBadges fill cols 2-4+, resources continue
                    in the same grid right after.
      ── */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 pb-1.5 border-b">
        {/* Level label — full width on mobile, single cell on desktop */}
        <div className="col-span-3 sm:col-span-1 flex items-center">
          <span className="text-sm font-semibold text-foreground leading-5">
            Level {row.level} &nbsp;
            <span className="italic text-muted-foreground">
              ({row.level - 1} &#x2192; {row.level})
            </span>
          </span>
        </div>

        {/* Workers badge — temporarily commented out
        {showWorkers && (
          <ResourceBadge
            icon={RESOURCE_ICONS.worker}
            value={String(row.workers)}
            alt="Workers"
          />
        )} */}

        {/* StatsBadges — same grid columns as resources */}
        {bonusGains.map((b, i) => (
          <StatsBadge
            key={i}
            icons={b.icons}
            value={`${formatBonusValue(b.type, b.delta)}`}
            alt={getBonusLabel(b.type)}
          />
        ))}
      </div>

      {/* ── Resources grid (blueprint first, then RP, mats, coins, food, goods) ── */}
      {hasAnyCost && (
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
          {/* Blueprint — always first if present */}
          {row.blueprintRequired && (
            <ResourceBadge
              icon={`/images/wonders/bp/${wonderName.toLowerCase().replace(/\s+/g, "")}.webp`}
              value={String(1)}
              alt="Blueprint"
            />
          )}
          {row.rp3 != null && (
            <ResourceBadge
              icon={RESOURCE_ICONS.rp}
              value={String(row.rp3 * 3)}
              alt="3RP"
              rpLabel={3}
            />
          )}
          {row.rp5 != null && (
            <ResourceBadge
              icon={RESOURCE_ICONS.rp}
              value={String(row.rp5 * 5)}
              alt="5RP"
              rpLabel={5}
            />
          )}
          {row.rp10 != null && (
            <ResourceBadge
              icon={RESOURCE_ICONS.rp}
              value={String(row.rp10 * 10)}
              alt="10RP"
              rpLabel={10}
            />
          )}
          {row.mat1Amount > 0 && mat1Label !== mat2Label && (
            <ResourceBadge
              icon={getResourceIconSrc(`material:${mat1Label}`)}
              value={formatNumber(row.mat1Amount)}
              alt={mat1Label}
            />
          )}
          {row.mat2Amount > 0 && mat1Label !== mat2Label && (
            <ResourceBadge
              icon={getResourceIconSrc(`material:${mat2Label}`)}
              value={formatNumber(row.mat2Amount)}
              alt={mat2Label}
            />
          )}
          {mat1Label === mat2Label && row.mat1Amount + row.mat2Amount > 0 && (
            <ResourceBadge
              icon={getResourceIconSrc(`material:${mat1Label}`)}
              value={formatNumber(row.mat1Amount + row.mat2Amount)}
              alt={mat1Label}
            />
          )}
          {row.coinTotal > 0 && (
            <ResourceBadge
              icon={RESOURCE_ICONS.coin}
              value={fmtCost(row.coinTotal)}
              alt="Coins"
            />
          )}
          {row.foodTotal > 0 && (
            <ResourceBadge
              icon={RESOURCE_ICONS.food}
              value={fmtCost(row.foodTotal)}
              alt="Food"
            />
          )}
          {row.goodsEntries.map(({ iconKey, amount }) => (
            <ResourceBadge
              key={iconKey}
              icon={resolveGoodsIcon(iconKey, userSelections)}
              value={formatNumber(amount)}
              alt={iconKey}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Bonus summary card ───────────────────────────────────────────────────────

function BonusSummaryCard({
  wonder,
  fromLevel,
  toLevel,
}: {
  wonder: Wonder;
  fromLevel: number;
  toLevel: number;
}) {
  const deltas = useMemo(
    () => getActiveBonusDeltas(computeBonusDeltas(wonder, fromLevel, toLevel)),
    [wonder, fromLevel, toLevel],
  );

  if (deltas.length === 0) return null;

  return (
    <div className="py-1.5 space-y-2">
      <p className="text-[13px] font-semibold uppercase tracking-wide text-amber-600 dark:text-amber-400">
        Bonuses gained — lv {fromLevel} → {toLevel}
      </p>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
        {deltas.map((delta) => {
          const gained = delta.finalValue - delta.baseValue;
          const formatted = formatBonusValue(delta.type, gained);

          return (
            <StatsBadge
              key={delta.type}
              icons={delta.icons}
              value={formatted}
              alt={getBonusLabel(delta.type)}
            />
          );
        })}
      </div>
    </div>
  );
}

// ─── LevelSelect ──────────────────────────────────────────────────────────────

interface LevelSelectProps {
  value: number;
  onChange: (value: number) => void;
  levels: number[];
  placeholder?: string;
}

const LevelDrawerContent = memo(function LevelDrawerContent({
  placeholder,
  levels,
  value,
  onSelect,
  onClose,
}: {
  placeholder?: string;
  levels: number[];
  value: number;
  onSelect: (v: number) => void;
  onClose: () => void;
}) {
  const handleSelect = useCallback(
    (lv: number) => {
      onSelect(lv);
      onClose();
    },
    [onSelect, onClose],
  );

  return (
    <div className="flex flex-col max-h-full h-full">
      <div className="sticky top-0 z-10 backdrop-blur-sm border-b border-alpha-400 bg-background shrink-0">
        <div className="flex items-center justify-center h-10 px-4">
          <h3 className="text-xs font-semibold">
            {placeholder ?? "Select level"}
          </h3>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-2 pb-6 min-h-0">
        {levels.map((lv) => {
          const isSelected = lv === value;
          return (
            <Button
              key={lv}
              variant="ghost"
              onClick={() => handleSelect(lv)}
              className={cn(
                "w-full justify-between h-10 px-4 mb-1 rounded-lg",
                isSelected && "bg-accent",
              )}
            >
              <span className="text-xs w- font-medium">Level {lv}</span>
              {isSelected && <Check className="size-3.5 text-primary" />}
            </Button>
          );
        })}
      </div>
    </div>
  );
});

function LevelSelect({
  value,
  onChange,
  levels,
  placeholder,
}: LevelSelectProps) {
  return (
    <ResponsiveSelect
      value={value.toString()}
      onValueChange={(v) => onChange(Number(v))}
      options={levels.map((lv) => ({
        value: lv.toString(),
        label: lv.toString(),
      }))}
      placeholder={placeholder}
      selectClassName="w-[72px] h-8!"
      drawerBtnClassName="h-8!"
      drawerClassName="h-[60vh]"
      rotateChevron
      alignItemWithTrigger
    />
  );
}

// ─── View mode toggle ─────────────────────────────────────────────────────────

const VIEW_MODES = [
  { mode: "list", label: "Per Level", Icon: List },
  { mode: "global", label: "Summary", Icon: BarChart2 },
] as const;

function ViewToggle({
  value,
  onChange,
}: {
  value: "list" | "global";
  onChange: (v: "list" | "global") => void;
}) {
  return (
    <div className="flex rounded-sm border border-border overflow-hidden">
      {VIEW_MODES.map(({ mode, label, Icon }) => (
        <button
          key={mode}
          onClick={() => onChange(mode)}
          aria-label={label}
          title={label}
          className={cn(
            "flex items-center gap-1.5 px-2.5 py-1.5 h-8 text-[13px] font-semibold transition-colors",
            value === mode
              ? "bg-primary text-primary-foreground"
              : "bg-background text-muted-foreground hover:bg-muted",
          )}
        >
          {/* Icon always visible */}
          <Icon className="inline md:hidden size-[18px] stroke-3 shrink-0" />
          {/* Label hidden on mobile, shown on sm+ */}
          <span className="hidden sm:inline whitespace-nowrap">{label}</span>
        </button>
      ))}
    </div>
  );
}

// ─── Header ──────────────────────────────────────────────────────────────────

function WonderHeader({
  wonder,
  currentLevel,
  mat1,
  mat2,
  imageSrc,
  offsetPx,
  onClose,
}: {
  wonder: Wonder;
  currentLevel?: number;
  mat1: MaterialType;
  mat2: MaterialType;
  imageSrc: string | undefined;
  offsetPx: number;
  onClose: () => void;
}) {
  return (
    <div className="grid grid-cols-4 gap-3 p-3 pb-2.5 shrink-0 relative">
      {/* Thumbnail — fixed, compact */}
      <div className="hidden md:block w-full h-28 shrink-0 rounded-md overflow-hidden relative bg-background-400">
        {imageSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageSrc}
            alt={wonder.meta.name}
            className="w-full h-auto"
            style={{ transform: `translateY(${offsetPx * 0.45}px)` }}
          />
        ) : null}
      </div>

      {/* Metadata */}
      <div className="col-span-4 sm:col-span-3 flex flex-col justify-start gap-1 min-w-0 flex-1">
        {/* Name + current level badge */}
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-base font-bold leading-tight truncate">
            {wonder.meta.name}
          </span>
          {currentLevel !== undefined && (
            <span className="text-sm font-medium text-muted-foreground bg-muted px-1.5 rounded-sm whitespace-nowrap shrink-0">
              Lv {currentLevel}
            </span>
          )}
        </div>

        {/* Group · slot · rarity */}
        <p className="text-[13.5px] font-medium text-muted-foreground leading-tight">
          {wonder.meta.group} · {wonder.meta.slot} · {wonder.meta.rarity}
        </p>

        {/* Tags row: material tags + synergy */}
        <div className="flex items-center flex-wrap gap-1 mt-0.5">
          <MaterialTag material={mat1} />
          {mat1 !== mat2 && <MaterialTag material={mat2} />}
        </div>

        {/* Bonus badges at current level — grid so they align with resources */}
        {currentLevel !== undefined && currentLevel > 0 && (
          <div className="grid grid-cols-3 gap-1 mt-0.5">
            {wonder.bonuses.map((b, i) => {
              const val = b.values[currentLevel - 1] ?? 0;
              if (val === 0) return null;
              return (
                <StatsBadge
                  key={i}
                  icons={b.icons as [string, string | null]}
                  value={formatBonusValue(b.type, val)}
                  alt={getBonusLabel(b.type)}
                />
              );
            })}

            {wonder.meta.synergies.map((syn, i) => (
              <StatsBadge
                key={i}
                icons={syn.icons}
                materialIcon={syn.tag}
                value={syn.bonus}
                alt={`Synergy: ${syn.bonus}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Close button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="rounded-full h-8 w-8 shrink-0 self-start absolute top-2 right-3"
        aria-label="Close"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}

// ─── Toolbar (range + toggle) ─────────────────────────────────────────────────

function RangeToolbar({
  fromLevel,
  toLevel,
  maxLevel,
  levelsCount,
  viewMode,
  onFromChange,
  onToChange,
  onViewModeChange,
}: {
  fromLevel: number;
  toLevel: number;
  maxLevel: number;
  levelsCount: number;
  viewMode: "list" | "global";
  onFromChange: (v: number) => void;
  onToChange: (v: number) => void;
  onViewModeChange: (v: "list" | "global") => void;
}) {
  return (
    <div className="px-3 py-2.5 shrink-0 border-t border-b border-border bg-background-100">
      <div className="flex items-center gap-2 flex-wrap">
        {/* Range controls */}
        <div className="flex items-center gap-2 flex-1 min-w-0 ">
          <span className="text-sm text-muted-foreground font-medium whitespace-nowrap">
            From
          </span>
          <LevelSelect
            value={fromLevel}
            onChange={onFromChange}
            levels={Array.from({ length: maxLevel - 1 }, (_, i) => i + 1)}
            placeholder="Start"
          />
          <span className="text-sm text-muted-foreground font-medium whitespace-nowrap">
            to
          </span>
          <LevelSelect
            value={toLevel}
            onChange={onToChange}
            levels={Array.from({ length: maxLevel - 1 }, (_, i) => i + 2)}
            placeholder="End"
          />

          {/* Level count pill */}
          <span className="text-[13px] font-medium text-muted-foreground bg-muted px-1.5 py-1 rounded-sm tabular-nums whitespace-nowrap">
            {levelsCount} lvl{levelsCount !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Spacer + toggle */}
        <div className="ml-auto shrink-0">
          <ViewToggle value={viewMode} onChange={onViewModeChange} />
        </div>
      </div>
    </div>
  );
}

// ─── Main content ─────────────────────────────────────────────────────────────

interface WonderDetailContentProps {
  wonder: Wonder;
  currentLevel?: number;
  onClose: () => void;
}

function WonderDetailContent({
  wonder,
  currentLevel,
  onClose,
}: WonderDetailContentProps) {
  const userSelections = useBuildingSelections();
  const imageSrc = WONDER_IMAGE_MAP[wonder.meta.code];
  const offsetPx = WONDER_IMAGE_OFFSET_PX[wonder.meta.code] ?? 0;
  const maxLevel = wonder.meta.maxLevel;
  const mat1 = wonder.meta.material1;
  const mat2 = wonder.meta.material2;

  /** Workers are only relevant for Capital City wonders */
  const isCapitalCity = wonder.meta.slot === "Capital City";

  const [fromLevel, setFromLevel] = useState<number>(currentLevel ?? 1);
  const [toLevel, setToLevel] = useState<number>(maxLevel);
  const [viewMode, setViewMode] = useState<"list" | "global">("list");

  const handleFromChange = (v: number) => {
    setFromLevel(v);
    if (v >= toLevel) setToLevel(Math.min(v + 1, maxLevel));
  };
  const handleToChange = (v: number) => {
    setToLevel(v);
    if (v <= fromLevel) setFromLevel(Math.max(v - 1, 1));
  };

  const levelsInRange = useMemo(() => {
    const arr: number[] = [];
    for (let lv = fromLevel + 1; lv <= toLevel; lv++) arr.push(lv);
    return arr;
  }, [fromLevel, toLevel]);

  const costRows = useMemo(
    () => levelsInRange.map((lv) => buildLevelCostData(wonder, lv)),
    [levelsInRange, wonder],
  );

  const totals = useMemo(() => computeRangeTotals(costRows), [costRows]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* ── Compact header ── */}
      <WonderHeader
        wonder={wonder}
        currentLevel={currentLevel}
        mat1={mat1}
        mat2={mat2}
        imageSrc={imageSrc}
        offsetPx={offsetPx}
        onClose={onClose}
      />

      {/* ── Range toolbar ── */}
      <RangeToolbar
        fromLevel={fromLevel}
        toLevel={toLevel}
        maxLevel={maxLevel}
        levelsCount={levelsInRange.length}
        viewMode={viewMode}
        onFromChange={handleFromChange}
        onToChange={handleToChange}
        onViewModeChange={setViewMode}
      />

      {/* ── Scrollable body ── */}
      <div className="flex-1 overflow-y-auto min-h-0 p-3 space-y-2.5 bg-background-200">
        {/* ══ SUMMARY VIEW ══ */}
        {viewMode === "global" ? (
          <div className="rounded-sm bg-background-300 border px-3 py-2.5 space-y-3">
            <p className="text-[13px] font-semibold uppercase tracking-wide text-muted-foreground">
              Total resources — levels {fromLevel} → {toLevel}
            </p>

            {levelsInRange.length === 0 ? (
              <p className="text-xs text-muted-foreground italic">
                Select a valid range.
              </p>
            ) : (
              <div className="space-y-3">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5">
                  {totals.rp3Total > 0 && (
                    <ResourceBadge
                      icon={RESOURCE_ICONS.rp}
                      value={formatNumber(totals.rp3Total)}
                      alt="3RP"
                      rpLabel={3}
                    />
                  )}
                  {totals.rp5Total > 0 && (
                    <ResourceBadge
                      icon={RESOURCE_ICONS.rp}
                      value={formatNumber(totals.rp5Total)}
                      alt="5RP"
                      rpLabel={5}
                    />
                  )}
                  {totals.rp10Total > 0 && (
                    <ResourceBadge
                      icon={RESOURCE_ICONS.rp}
                      value={formatNumber(totals.rp10Total)}
                      alt="10RP"
                      rpLabel={10}
                    />
                  )}
                  {totals.blueprints > 0 && (
                    <ResourceBadge
                      icon={`/images/wonders/bp/${wonder.meta.name.toLowerCase().replace(/\s+/g, "")}.webp`}
                      value={formatNumber(totals.blueprints)}
                      alt="Blueprints"
                    />
                  )}
                  {mat1 !== mat2 ? (
                    <>
                      {totals.mat1Total > 0 && (
                        <ResourceBadge
                          icon={getResourceIconSrc(`material:${mat1}`)}
                          value={formatNumber(totals.mat1Total)}
                          alt={mat1}
                        />
                      )}
                      {totals.mat2Total > 0 && (
                        <ResourceBadge
                          icon={getResourceIconSrc(`material:${mat2}`)}
                          value={formatNumber(totals.mat2Total)}
                          alt={mat2}
                        />
                      )}
                    </>
                  ) : (
                    totals.mat1Total + totals.mat2Total > 0 && (
                      <ResourceBadge
                        icon={getResourceIconSrc(`material:${mat1}`)}
                        value={formatNumber(
                          totals.mat1Total + totals.mat2Total,
                        )}
                        alt={mat1}
                      />
                    )
                  )}
                  {totals.coinTotal > 0 && (
                    <ResourceBadge
                      icon={RESOURCE_ICONS.coin}
                      value={fmtCompact(totals.coinTotal)}
                      alt="Coins"
                    />
                  )}
                  {totals.foodTotal > 0 && (
                    <ResourceBadge
                      icon={RESOURCE_ICONS.food}
                      value={fmtCompact(totals.foodTotal)}
                      alt="Food"
                    />
                  )}
                  {Array.from(totals.goodsByKey.entries()).map(
                    ([iconKey, amount]) => (
                      <ResourceBadge
                        key={iconKey}
                        icon={resolveGoodsIcon(iconKey, userSelections)}
                        value={formatNumber(amount)}
                        alt={iconKey}
                      />
                    ),
                  )}
                </div>

                <div className="border-t pt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5">
                  {totals.rpAllTotal > 0 && (
                    <ResourceBadge
                      icon={RESOURCE_ICONS.rp}
                      value={`${formatNumber(totals.rpAllTotal)}`}
                      alt="Total RP"
                      rpLabel="Total"
                    />
                  )}
                </div>

                <BonusSummaryCard
                  wonder={wonder}
                  fromLevel={fromLevel}
                  toLevel={toLevel}
                />
              </div>
            )}
          </div>
        ) : (
          /* ══ PER LEVEL VIEW ══ */
          <>
            {levelsInRange.length === 0 ? (
              <p className="text-xs text-muted-foreground italic text-center py-6">
                Select a valid range to see details.
              </p>
            ) : (
              <div className="space-y-2.5">
                {costRows.map((row) => (
                  <LevelCostRow
                    key={row.level}
                    row={row}
                    wonder={wonder}
                    mat1Label={mat1}
                    mat2Label={mat2}
                    userSelections={userSelections}
                    wonderName={wonder.meta.name}
                    isCapitalCity={isCapitalCity}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─── Public component ─────────────────────────────────────────────────────────

interface WonderDetailModalProps {
  wonder: Wonder;
  currentLevel?: number;
  open: boolean;
  onClose: () => void;
}

export function WonderDetailModal({
  wonder,
  currentLevel,
  open,
  onClose,
}: WonderDetailModalProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog
        open={open}
        onOpenChange={(o) => {
          if (!o) onClose();
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="p-0 gap-0 overflow-hidden md:max-w-3xl md:h-[min(720px,90vh)] flex flex-col"
        >
          <WonderDetailContent
            wonder={wonder}
            currentLevel={currentLevel}
            onClose={onClose}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer
      open={open}
      onOpenChange={(o) => {
        if (!o) onClose();
      }}
    >
      <DrawerContent className="h-[90vh] p-0 flex flex-col">
        <WonderDetailContent
          wonder={wonder}
          currentLevel={currentLevel}
          onClose={onClose}
        />
      </DrawerContent>
    </Drawer>
  );
}
