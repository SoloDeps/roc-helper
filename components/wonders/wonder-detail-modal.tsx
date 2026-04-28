"use client";

/**
 * WonderDetailModal — v3
 * ──────────────────────
 * – max-w-5xl / h-[min(820px,90vh)]
 * – Tous les coûts utilisent ResourceBadge (même design que building-card / techno-card)
 * – Goods décomposés par iconKey avec leur vraie image
 * – Icônes custom via /images/icons/* avec fallback /images/goods/default.webp
 */

import { useMemo, useState, memo, useEffect } from "react";
import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
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
import { imagesUrl } from "@/lib/catalog";

// ─── Icon resolution ───────────────────────────────────────────────────────────

const RESOURCE_ICONS: Record<string, string> = {
  coin: "/images/goods/coins.webp",
  food: "/images/goods/food.webp",
  // blueprint: "/images/icons/blueprint.webp",
  rp: "/images/goods/research_points.webp",
  worker: "/images/game_icons/icon_workers_capital.webp",
};

const MATERIAL_ICONS: Record<MaterialType, string> = {
  Arena: "/images/wonders/material/arena.webp",
  Fortress: "/images/wonders/material/fortress.webp",
  Nature: "/images/wonders/material/nature.webp",
  Naval: "/images/wonders/material/naval.webp",
  Palace: "/images/wonders/material/palace.webp",
  Statue: "/images/wonders/material/statue.webp",
  Temple: "/images/wonders/material/temple.webp",
};

function getResourceIconSrc(type: string): string {
  if (type.startsWith("material:")) {
    const mat = type.slice(9) as MaterialType;
    return MATERIAL_ICONS[mat] ?? "/images/goods/default.webp";
  }
  return RESOURCE_ICONS[type] ?? "/images/goods/default.webp";
}

// ─── ResourceBadge — identique à building-card / techno-card ─────────────────

// const ResourceBadge = memo(function ResourceBadge({
//   icon,
//   value,
//   alt,
// }: {
//   icon: string;
//   value: string;
//   alt: string;
// }) {
//   const [src, setSrc] = useState(icon);
//   useEffect(() => {
//     setSrc(icon);
//   }, [icon]);

//   return (
//     <div className="flex items-center justify-between gap-2 px-2 rounded-md bg-background-100 border border-alpha-200 h-9 shrink-0 min-w-0">
//       <Image
//         src={src}
//         alt={alt}
//         className="h-[22px] w-auto select-none shrink-0"
//         draggable={false}
//         onError={() => setSrc("/images/goods/default.webp")}
//         width={22}
//         height={22}
//       />
//       <span className="text-sm font-medium truncate">{value}</span>
//     </div>
//   );
// });

// ─── MaterialTag ───────────────────────────────────────────────────────────────

function MaterialTag({ material }: { material: MaterialType }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-sm leading-none",
        MATERIAL_COLORS[material],
      )}
    >
      {material}
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
  bonuses: { label: string }[];
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
  const lvDat = wonder.levels[level];

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
    bonuses: lvDat?.bonuses ?? [],
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

// ─── Goods resolution (mirrors building-card.tsx logic) ──────────────────────

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
  mat1Label,
  mat2Label,
  userSelections,
  wonderName,
}: {
  row: LevelCostData;
  mat1Label: MaterialType;
  mat2Label: MaterialType;
  userSelections: string[][];
  wonderName: string;
}) {
  const hasAnyCost =
    row.blueprintRequired ||
    row.rp3 != null ||
    row.rp5 != null ||
    row.rp10 != null ||
    row.mat1Amount > 0 ||
    row.mat2Amount > 0 ||
    row.coinTotal > 0 ||
    row.foodTotal > 0 ||
    row.goodsEntries.length > 0 ||
    row.workers != null;

  return (
    <div className="rounded-sm bg-background-300 border px-3 py-2.5 space-y-2">
      {/* Header niveau */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-sm font-semibold text-foreground min-w-18 bg-red-500">
          Level {row.level}
        </span>
        {row.workers != null && (
          <ResourceBadge
            icon={RESOURCE_ICONS.worker}
            value={String(row.workers)}
            alt="Workers"
          />
        )}
        {row.blueprintRequired && (
          <ResourceBadge
            icon={`/images/wonders/bp/${wonderName.toLowerCase().replace(/\s+/g, '')}.webp`}
            value={String(1)}
            alt="Blueprint"
          />
        )}
      </div>

      {/* Grille des coûts */}
      {hasAnyCost && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1.5">
          {row.rp3 != null && (
            <ResourceBadge
              icon={RESOURCE_ICONS.rp}
              value={`${row.rp3 * 3} (3RP)`}
              alt="3RP"
            />
          )}
          {row.rp5 != null && (
            <ResourceBadge
              icon={RESOURCE_ICONS.rp}
              value={`${row.rp5 * 5} (5RP)`}
              alt="5RP"
            />
          )}
          {row.rp10 != null && (
            <ResourceBadge
              icon={RESOURCE_ICONS.rp}
              value={`${row.rp10 * 10} (10RP)`}
              alt="10RP"
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

      {/* Bonus du niveau */}
      {/* {row.bonuses.length > 0 && (
        <ul className="space-y-0.5 pt-1.5 border-t border-alpha-100">
          {row.bonuses.map((b, i) => (
            <li key={i} className="flex items-start gap-1.5 text-xs">
              <span className="text-amber-500 shrink-0 mt-0.5">▸</span>
              <span className="text-foreground/80">{b.label}</span>
            </li>
          ))}
        </ul>
      )} */}
    </div>
  );
}

// ─── Contenu principal ────────────────────────────────────────────────────────

interface WonderDetailContentProps {
  wonder: Wonder;
  currentLevel?: number;
}

function WonderDetailContent({
  wonder,
  currentLevel,
}: WonderDetailContentProps) {
  const userSelections = useBuildingSelections();
  const imageSrc = WONDER_IMAGE_MAP[wonder.meta.code];
  const offsetPx = WONDER_IMAGE_OFFSET_PX[wonder.meta.code] ?? 0;
  const maxLevel = wonder.meta.maxLevel;
  const mat1 = wonder.meta.material1;
  const mat2 = wonder.meta.material2;

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

  const bonusesGained = useMemo(() => {
    const seen = new Set<string>();
    const list: string[] = [];
    for (const row of costRows)
      for (const b of row.bonuses)
        if (!seen.has(b.label)) {
          seen.add(b.label);
          list.push(b.label);
        }
    return list;
  }, [costRows]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* ── Header ── */}
      <div className="flex gap-4 p-4 pb-3 shrink-0">
        <div className="w-[150px] h-[108px] shrink-0 rounded-md overflow-hidden relative">
          {imageSrc ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageSrc}
              alt={wonder.meta.name}
              className="w-full h-auto"
              style={{ transform: `translateY(${offsetPx * 0.55}px)` }}
            />
          ) : (
            <div className="w-full h-full bg-background-400" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
        </div>

        <div className="flex flex-col justify-between min-w-0 flex-1">
          <div>
            <p className="text-base font-bold leading-tight">
              {wonder.meta.name}
            </p>
            <p className="text-sm text-muted-foreground mt-0.5">
              {wonder.meta.group} · {wonder.meta.slot} · {wonder.meta.rarity}
            </p>
            <div className="flex flex-wrap gap-1.5 mt-2">
              <MaterialTag material={mat1} />
              {mat1 !== mat2 && <MaterialTag material={mat2} />}
            </div>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-0.5 mt-1">
            {wonder.meta.synergyBonus && (
              <p className="text-xs text-amber-500 dark:text-amber-400 font-medium">
                ⚡ {wonder.meta.synergyBonus}
              </p>
            )}
            {currentLevel !== undefined && (
              <p className="text-xs text-muted-foreground">
                Current level:{" "}
                <span className="font-semibold text-foreground">
                  {currentLevel}
                </span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Sélecteur plage + toggle ── */}
      <div className="px-4 pb-3 shrink-0 border-b border-border">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm text-muted-foreground">From</span>
          <select
            value={fromLevel}
            onChange={(e) => handleFromChange(Number(e.target.value))}
            className="h-8 rounded-sm border border-input bg-background px-2 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-ring"
          >
            {Array.from({ length: maxLevel - 1 }, (_, i) => i + 1).map((lv) => (
              <option key={lv} value={lv}>
                {lv}
              </option>
            ))}
          </select>

          <span className="text-sm text-muted-foreground">to</span>
          <select
            value={toLevel}
            onChange={(e) => handleToChange(Number(e.target.value))}
            className="h-8 rounded-sm border border-input bg-background px-2 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-ring"
          >
            {Array.from({ length: maxLevel - 1 }, (_, i) => i + 2).map((lv) => (
              <option key={lv} value={lv}>
                {lv}
              </option>
            ))}
          </select>

          <span className="text-xs text-muted-foreground ml-1">
            {levelsInRange.length} level{levelsInRange.length !== 1 ? "s" : ""}
          </span>

          <div className="flex rounded-sm border border-border overflow-hidden ml-auto">
            {(["list", "global"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={cn(
                  "px-3 py-1.5 text-xs font-medium transition-colors",
                  viewMode === mode
                    ? "bg-primary text-primary-foreground"
                    : "bg-background text-muted-foreground hover:bg-muted",
                )}
              >
                {mode === "list" ? "Per Level" : "Summary"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Corps scrollable ── */}
      <div className="flex-1 overflow-y-auto min-h-0 p-4 space-y-3 bg-background-200">
        {viewMode === "global" ? (
          <>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Total resources — levels {fromLevel} → {toLevel}
            </p>

            {levelsInRange.length === 0 ? (
              <p className="text-sm text-muted-foreground italic">
                Select a valid range.
              </p>
            ) : (
              <div className="space-y-3">
                {/* Grille ressources — même pattern que building / techno card */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5">
                  {totals.rp3Total > 0 && (
                    <ResourceBadge
                      icon={RESOURCE_ICONS.rp}
                      value={`${formatNumber(totals.rp3Total)} (3RP)`}
                      alt="3RP"
                    />
                  )}
                  {totals.rp5Total > 0 && (
                    <ResourceBadge
                      icon={RESOURCE_ICONS.rp}
                      value={`${formatNumber(totals.rp5Total)} (5RP)`}
                      alt="RP ×5"
                    />
                  )}
                  {totals.rp10Total > 0 && (
                    <ResourceBadge
                      icon={RESOURCE_ICONS.rp}
                      value={`${formatNumber(totals.rp10Total)} (10RP)`}
                      alt="10RP"
                    />
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
                  {totals.blueprints > 0 && (
                    <ResourceBadge
                      icon={`/images/wonders/bp/${wonder.meta.name.toLowerCase().replace(/\s+/g, '')}.webp`}
                      value={formatNumber(totals.blueprints)}
                      alt="Blueprints"
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

                {/* Total RP highlight */}
                {totals.rpAllTotal > 0 && (
                  <div className="rounded-sm bg-background-300 border border-alpha-200 px-3 py-2 flex items-center justify-between">
                    <span className="text-xs text-muted-foreground font-medium">
                      Total Research Points
                    </span>
                    <span className="text-sm font-bold tabular-nums text-primary">
                      {totals.rpAllTotal.toLocaleString("fr-FR")} RP
                    </span>
                  </div>
                )}
              </div>
            )}

            {bonusesGained.length > 0 && (
              <div className="mt-1">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                  Bonuses unlocked
                </p>
                <ul className="space-y-1">
                  {bonusesGained.map((b, i) => (
                    <li key={i} className="flex items-start gap-1.5 text-sm">
                      <span className="text-amber-500 mt-0.5 shrink-0">▸</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        ) : (
          <>
            {levelsInRange.length === 0 ? (
              <p className="text-sm text-muted-foreground italic text-center py-6">
                Select a valid range to see details.
              </p>
            ) : (
              <div className="space-y-2 bg-background-200">
                {costRows.map((row) => (
                  <LevelCostRow
                    key={row.level}
                    row={row}
                    mat1Label={mat1}
                    mat2Label={mat2}
                    userSelections={userSelections}
                    wonderName={wonder.meta.name}
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

// ─── Composant public ─────────────────────────────────────────────────────────

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
          className="p-0 gap-0 overflow-hidden md:max-w-5xl md:h-[min(820px,90vh)] flex flex-col"
        >
          <WonderDetailContent wonder={wonder} currentLevel={currentLevel} />
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
      <DrawerContent className="h-[92vh] p-0 flex flex-col">
        <WonderDetailContent wonder={wonder} currentLevel={currentLevel} />
      </DrawerContent>
    </Drawer>
  );
}
