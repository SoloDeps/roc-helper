"use client";

import { useState, useMemo, useRef, useEffect, type ReactNode } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, Eye, Minus, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";

import { WONDERS } from "@/data/wonders/index";
import type { UserPreset, WonderPresetEntry, MaterialType } from "@/data/wonders/types";
import { getPresetCodes, computeSynergies } from "@/resolvers/wonders";
import { formatBonusValue, getBonusLabel, bonusKey } from "@/resolvers/bonus";
import { useUserPresets } from "@/lib/stores/user-presets-store";
import { resolveIconPath } from "@/components/wonders/stats-badge";
import { formatSynergyValue, parseSynergyMagnitude, MATERIAL_LABEL } from "./presets/synergies";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ResponsiveModal } from "@/components/modals/responsive-modal";
import { WONDER_IMAGE_MAP, WONDER_IMAGE_OFFSET_PX } from "@/data/wonders/wonder-config";

// ─── Constants ────────────────────────────────────────────────────────────────

const MAX_SLOTS = 3;
const MIN_SLOTS = 2;

/** Accent per slot index — extend here if MAX_SLOTS ever grows. */
const SLOT_STYLES = [
  { label: "A", chip: "bg-sky-500 text-white", dot: "bg-sky-500" },
  { label: "B", chip: "bg-violet-500 text-white", dot: "bg-violet-500" },
  { label: "C", chip: "bg-emerald-500 text-white", dot: "bg-emerald-500" },
] as const;

/**
 * Fixed grid templates per slot count (2 or 3 columns after the label column).
 * Written as literal Tailwind classes — not built from a template string — so
 * the JIT compiler keeps them (dynamic arbitrary values get purged). The label
 * column itself widens past the @min-[640px] container breakpoint so the icon
 * + text has room; below that, only the icon fits and text hides (see IconLabelCell).
 */
const GRID_TEMPLATE: Record<number, string> = {
  2: "grid-cols-[40px_1fr_1fr] @min-[640px]:grid-cols-[210px_1fr_1fr]",
  3: "grid-cols-[40px_1fr_1fr_1fr] @min-[640px]:grid-cols-[190px_1fr_1fr_1fr]",
};

// ─── Shared types ─────────────────────────────────────────────────────────────

interface CompareSlot {
  savedPresetId?: string;
}

type CellTone = "best" | "worst" | "neutral";

interface CompareCell {
  display: string | null;
  tone: CellTone;
}

interface CompareRow {
  key: string;
  icons: [string, string | null];
  label: string;
  cells: CompareCell[];
}

interface CompareGroup {
  header: string;
  rows: CompareRow[];
}

/** Wonder + effective level for a given slot, used by the header modal. */
interface SlotWonderInfo {
  code: string;
  level: number;
}

// ─── Preset helpers ───────────────────────────────────────────────────────────

function getSlotCodes(slot: CompareSlot, savedPresets: UserPreset[]): string[] {
  if (slot.savedPresetId) {
    const p = savedPresets.find((x) => x.id === slot.savedPresetId);
    return p ? getPresetCodes(p) : [];
  }
  return [];
}

function getEffectiveLevel(
  code: string,
  slot: CompareSlot,
  savedPresets: UserPreset[],
  ownedMap: Record<string, { code: string; lvl: number }>,
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
  return ownedMap[code]?.lvl ?? 1;
}

// ─── Wonder boosts — grouped by wonder, individual boosts compared per slot ──

function buildWonderGroups(
  codesPerSlot: string[][],
  slots: CompareSlot[],
  savedPresets: UserPreset[],
  ownedMap: Record<string, { code: string; lvl: number }>,
): CompareGroup[] {
  const order: string[] = [];
  const seen = new Set<string>();
  for (const codes of codesPerSlot) {
    for (const code of codes) {
      if (!seen.has(code)) {
        seen.add(code);
        order.push(code);
      }
    }
  }

  const groups: CompareGroup[] = [];
  for (const code of order) {
    const wonder = WONDERS[code];
    if (!wonder || wonder.bonuses.length === 0) continue;

    const rows: CompareRow[] = wonder.bonuses.map((bonus) => {
      const values = slots.map((slot, i) => {
        if (!codesPerSlot[i].includes(code)) return null;
        const level = getEffectiveLevel(code, slot, savedPresets, ownedMap);
        const idx = Math.max(0, Math.min(level - 1, 29));
        return bonus.values[idx] ?? 0;
      });
      const nonNull = values.filter((v): v is number => v !== null);
      const best = nonNull.length > 1 ? Math.max(...nonNull) : null;
      const worst = nonNull.length > 1 ? Math.min(...nonNull) : null;
      const cells: CompareCell[] = values.map((v) => {
        let tone: CellTone = "neutral";
        if (v !== null && best !== null && worst !== null && best !== worst) {
          if (v === best) tone = "best";
          else if (v === worst) tone = "worst";
        }
        return { display: v === null ? null : formatBonusValue(bonus.format, v), tone };
      });
      return {
        key: `${code}-${bonusKey(bonus)}`,
        icons: bonus.icons as [string, string | null],
        label: getBonusLabel(bonus.type, bonus.instance),
        cells,
      };
    });

    groups.push({ header: wonder.meta.name, rows });
  }

  return groups;
}

// ─── Differences-only filter ──────────────────────────────────────────────────
// A row only counts as "different" when at least two slots actually have a
// value to compare, and those values aren't all identical. Rows with a single
// real value (others being empty dashes) are never a "difference".

function filterDiffOnly(groups: CompareGroup[]): CompareGroup[] {
  return groups
    .map((g) => ({
      ...g,
      rows: g.rows.filter((row) => {
        const values = row.cells.map((c) => c.display).filter((v): v is string => v !== null);
        return values.length >= 2 && new Set(values).size > 1;
      }),
    }))
    .filter((g) => g.rows.length > 0);
}



function buildSynergyGroups(codesPerSlot: string[][]): CompareGroup[] {
  const perSlot = codesPerSlot.map((codes) => {
    const active = computeSynergies(codes).filter((s) => s.synergyActive && s.synergyBonus);
    const byCode = new Map<string, { tag: MaterialType; icons: [string, string | null]; formatted: string; magnitude: number }[]>();
    for (const s of active) {
      const wonder = WONDERS[s.code];
      if (!wonder) continue;
      const formatted = formatSynergyValue(s.synergyBonus!, s.synergyCount);
      const magnitude = parseSynergyMagnitude(s.synergyBonus!, s.synergyCount);
      const entries = wonder.meta.synergies.map((syn) => ({ tag: syn.tag, icons: syn.icons, formatted, magnitude }));
      byCode.set(s.code, entries);
    }
    return byCode;
  });

  const order: { tag: MaterialType; code: string; name: string; icons: [string, string | null] }[] = [];
  const seen = new Set<string>();
  for (const byCode of perSlot) {
    for (const [code, entries] of byCode) {
      for (const e of entries) {
        const key = `${e.tag}-${code}`;
        if (!seen.has(key)) {
          seen.add(key);
          order.push({ tag: e.tag, code, name: WONDERS[code]?.meta.name ?? code, icons: e.icons });
        }
      }
    }
  }

  const groupsMap = new Map<MaterialType, CompareRow[]>();
  for (const item of order) {
    const raw = perSlot.map((byCode) => byCode.get(item.code)?.find((e) => e.tag === item.tag) ?? null);
    const magnitudes = raw.filter((r): r is NonNullable<typeof r> => r !== null).map((r) => r.magnitude);
    const max = magnitudes.length > 1 ? Math.max(...magnitudes) : null;
    const min = magnitudes.length > 1 ? Math.min(...magnitudes) : null;
    const cells: CompareCell[] = raw.map((r) => {
      if (!r) return { display: null, tone: "neutral" };
      let tone: CellTone = "neutral";
      if (max !== null && min !== null && max !== min) {
        if (r.magnitude === max) tone = "best";
        else if (r.magnitude === min) tone = "worst";
      }
      return { display: r.formatted, tone };
    });
    const row: CompareRow = { key: `${item.tag}-${item.code}`, icons: item.icons, label: item.name, cells };
    const arr = groupsMap.get(item.tag) ?? [];
    arr.push(row);
    groupsMap.set(item.tag, arr);
  }

  return Array.from(groupsMap.entries()).map(([tag, rows]) => ({ header: MATERIAL_LABEL[tag], rows }));
}

// ─── Icon + label cell ────────────────────────────────────────────────────────
// Icon + text side by side once there's room (@min-[640px]). Below that, only
// the icon shows — tap/click opens a popover with the full label (mobile only,
// in practice, since desktop and tablet always have the room).

function IconLabelCell({ icons, label }: { icons: [string, string | null]; label: string }) {
  return (
    <div className="flex items-center gap-2 py-2.5 px-2 min-w-0">
      <Popover>
        <PopoverTrigger asChild>
          <button className="relative inline-flex shrink-0 size-6 rounded @min-[640px]:pointer-events-none" aria-label={label}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={resolveIconPath(icons[0])} alt="" className="size-6 object-contain" />
            {icons[1] && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={resolveIconPath(icons[1])}
                alt=""
                className="absolute -bottom-1 -right-1 h-3.5 w-3.5 object-contain drop-shadow-sm z-10" 
              />
            )}
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto px-2.5 py-1.5 text-xs font-medium">{label}</PopoverContent>
      </Popover>
      <span className="hidden @min-[640px]:inline text-xs font-medium truncate text-foreground/80">{label}</span>
    </div>
  );
}

// ─── Slot header — clickable name, opens the slot's wonder list ─────────────
// Reuses ResponsiveModal (Dialog on desktop, Drawer on mobile). Content is
// intentionally minimal — just the wonder image and its current level, no
// name/type — laid out as two 2-col grids (capital, then allied), matching
// how the game itself groups them.
//
// Note: the thumbnails use the same offset trick as WonderCard to position
// each wonder's artwork correctly within the small crop area. The pt-2/-mt-2
// on the card allows the image to extend slightly above the card border.

function WonderThumbCard({ code, level }: SlotWonderInfo) {
  const wonder = WONDERS[code];
  const imageSrc = WONDER_IMAGE_MAP[code];
  const offsetPx = WONDER_IMAGE_OFFSET_PX[code] ?? 0;

  return (
    // Pas d'overflow-hidden sur le conteneur externe : c'est ce qui permet à
    // l'image de "dépasser" au-dessus de la carte, exactement comme dans
    // WonderCard / PresetWonderCard (pt-X / -mt-X + w-full h-auto).
    <div className="rounded-lg bg-card">
      <div className="relative w-full h-[130px] pt-5 -mt-5 overflow-hidden rounded-t-lg">
        {imageSrc && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageSrc}
            alt={wonder?.meta.name ?? code}
            draggable={false}
            className="w-full h-auto select-none"
            style={{ transform: `translateY(${offsetPx}px)` }}
          />
        )}
      </div>
      <div className="px-1.5 py-1 text-center bg-background border border-t-transparent rounded-b-lg">
        <span className="text-[13px] font-semibold tabular-nums text-muted-foreground">
          Lvl {level}
        </span>
      </div>
    </div>
  );
}

function SlotWondersList({ wonders }: { wonders: SlotWonderInfo[] }) {
  if (wonders.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-10 px-4">
        No wonders in this preset.
      </p>
    );
  }

  // Même logique de regroupement que le jeu : les 4 wonders de la capitale
  // d'abord, puis les 4 des villes alliées — mais dans une seule grille 2
  // colonnes (au lieu de deux grilles séparées en 4 colonnes).
  const capital = wonders.filter((w) => WONDERS[w.code]?.meta.slot === "Capital City");
  const allied = wonders.filter((w) => WONDERS[w.code]?.meta.slot !== "Capital City");
  const ordered = [...capital, ...allied];

  return (
    <div className="flex-1 overflow-y-auto p-5">
      <div className="grid grid-cols-2 gap-x-3 gap-y-5 max-w-[400px] mx-auto">
        {ordered.map((w) => (
          <WonderThumbCard key={w.code} code={w.code} level={w.level} />
        ))}
      </div>
    </div>
  );
}

function SlotHeaderCell({
  name,
  slotIndex,
  slotCount,
  wonders,
  isOpen,
  onOpenChange,
  onNavigate,
}: {
  name: string;
  slotIndex: number;
  slotCount: number;
  wonders: SlotWonderInfo[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate: (index: number) => void;
}) {
  const style = SLOT_STYLES[slotIndex];
  const canNavigate = slotCount > 1;

  const dot = (
    <span
      className={cn(
        "inline-flex items-center justify-center size-4 rounded-full text-[9px] font-black text-white shrink-0",
        style.dot,
      )}
    >
      {style.label}
    </span>
  );

  // Flèches précédent/suivant : on boucle sur l'ensemble des slots (2 ou 3)
  // pour passer d'un preset à l'autre sans fermer la modale.
  const goPrev = () => onNavigate(((slotIndex - 1) % slotCount + slotCount) % slotCount);
  const goNext = () => onNavigate((slotIndex + 1) % slotCount);

  return (
    <ResponsiveModal
      open={isOpen}
      onOpenChange={onOpenChange}
      trigger={
        <button
          className="group w-full h-full flex items-center justify-center gap-1.5 px-2 py-3 min-w-0 cursor-pointer hover:bg-muted/50 transition-colors"
          title="Voir les wonders de ce preset"
        >
          {dot}
          <span className="text-xs font-bold truncate text-foreground/80 group-hover:text-primary transition-colors">
            {name}
          </span>
          <Eye className="size-[18px] shrink-0 ml-1 text-muted-foreground/50 group-hover:text-primary transition-colors" />
        </button>
      }
      className="p-0 gap-0 flex flex-col overflow-hidden md:max-w-md md:h-[min(720px,85vh)] h-[80vh]"
    >
      <div className="shrink-0 flex items-center justify-between gap-2 px-4 py-3 border-b border-border">
        <div className="flex items-center gap-1 min-w-0">
          <button
            onClick={goPrev}
            disabled={!canNavigate}
            className="rounded-full size-7 shrink-0 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:pointer-events-none"
            aria-label="Preset précédent"
          >
            <ChevronLeft className="size-4" />
          </button>

          <div className="flex items-center gap-1.5 min-w-0 px-0.5">
            {dot}
            <h3 className="text-sm font-bold truncate">{name}</h3>
          </div>

          <button
            onClick={goNext}
            disabled={!canNavigate}
            className="rounded-full size-7 shrink-0 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-30 disabled:pointer-events-none"
            aria-label="Preset suivant"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>

        <button
          onClick={() => onOpenChange(false)}
          className="rounded-full size-8 shrink-0 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted"
        >
          <X className="size-4" />
          <span className="sr-only">Close</span>
        </button>
      </div>
      <SlotWondersList wonders={wonders} />
    </ResponsiveModal>
  );
}



const TONE_CLASS: Record<CellTone, string> = {
  best: "text-emerald-600 dark:text-emerald-500",
  worst: "text-red-500 dark:text-red-400",
  neutral: "text-foreground/70",
};

function ValueCell({ cell }: { cell: CompareCell }) {
  if (cell.display === null) {
    return (
      <div className="flex items-center justify-center h-full">
        <Minus className="size-3.5 text-muted-foreground/30" />
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center h-full">
      <span className={cn("tabular-nums font-semibold text-xs transition-colors", TONE_CLASS[cell.tone])}>
        {cell.display}
      </span>
    </div>
  );
}

// ─── Generic grouped comparison table ─────────────────────────────────────────
// Shared shell for both the wonder boosts table and the synergies table —
// same header, grid, group sub-headers and footer, only the data differs.

function GroupedCompareTable({
  title,
  names,
  groups,
  toolbarRight,
  emptyTitle,
  emptySubtitle,
  slotWonders,
}: {
  title: string;
  names: string[];
  groups: CompareGroup[];
  toolbarRight?: ReactNode;
  emptyTitle: string;
  emptySubtitle: string;
  slotWonders?: SlotWonderInfo[][];
}) {
  const rowCount = groups.reduce((sum, g) => sum + g.rows.length, 0);
  const gridClass = GRID_TEMPLATE[names.length] ?? GRID_TEMPLATE[2];

  // Un seul état d'ouverture partagé par toute la ligne d'en-têtes : ça permet
  // aux flèches précédent/suivant de "sauter" d'un preset à l'autre sans
  // fermer puis rouvrir la modale.
  const [activeSlot, setActiveSlot] = useState<number | null>(null);

  if (rowCount === 0) {
    return (
      <div className="-mx-2 sm:-mx-4 md:mx-0 rounded-none md:rounded-xl border-2 border-dashed border-border p-10 text-center space-y-1.5">
        <p className="text-sm font-semibold text-foreground/50">{emptyTitle}</p>
        <p className="text-xs text-muted-foreground">{emptySubtitle}</p>
      </div>
    );
  }

  return (
    <div className="@container -mx-2 sm:-mx-4 md:mx-0 rounded-none md:rounded-xl border border-border overflow-hidden shadow-sm">
      <div className="flex items-center justify-between px-3 py-2 bg-muted/60 border-b border-border">
        <span className="text-[12px] font-black uppercase tracking-widest text-muted-foreground/60">{title}</span>
        {toolbarRight}
      </div>

      <div className={cn("grid sticky top-0 z-20 bg-muted/95 backdrop-blur-sm border-b border-border", gridClass)}>
        <div className="px-3 py-3" />
        {names.map((name, i) => (
          <div key={i} className="border-l border-border">
            <SlotHeaderCell
              name={name}
              slotIndex={i}
              slotCount={names.length}
              wonders={slotWonders?.[i] ?? []}
              isOpen={activeSlot === i}
              onOpenChange={(v) => setActiveSlot(v ? i : null)}
              onNavigate={setActiveSlot}
            />
          </div>
        ))}
      </div>

      <div>
        {groups.map((group) => (
          <div key={group.header}>
            <div className="px-3 py-1.5 bg-muted/30 border-b border-border/60 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
              {group.header}
            </div>
            {group.rows.map((row) => (
              <div
                key={row.key}
                className={cn("grid group transition-colors bg-background", gridClass)}
              >
                <div className="min-w-0 border-b border-border/60">
                  <IconLabelCell icons={row.icons} label={row.label} />
                </div>
                {row.cells.map((cell, i2) => (
                  <div key={i2} className="border-l border-b border-border/60 py-2.5 px-4 min-h-[44px]">
                    <ValueCell cell={cell} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="bg-muted/50 px-4 py-2 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {rowCount} row{rowCount === 1 ? "" : "s"}
        </span>
        <span className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="inline-block size-2 rounded-full bg-emerald-500" />
            Best
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block size-2 rounded-full bg-red-500" />
            Lowest
          </span>
        </span>
      </div>
    </div>
  );
}

// ─── Preset Selector ──────────────────────────────────────────────────────────

function PresetSelector({
  slot,
  savedPresets,
  excludeIds,
  onChangeSaved,
  onRemove,
  slotIndex,
}: {
  slot: CompareSlot;
  savedPresets: UserPreset[];
  excludeIds: string[];
  onChangeSaved: (id: string) => void;
  onRemove?: () => void;
  slotIndex: number;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const style = SLOT_STYLES[slotIndex];

  const displayName = slot.savedPresetId
    ? savedPresets.find((p) => p.id === slot.savedPresetId)?.name
    : undefined;

  // On retire les presets déjà choisis dans les autres slots — on ne veut
  // pas pouvoir comparer un preset avec lui-même. Le preset actuel de CE
  // slot reste visible (pour pouvoir le voir sélectionné / le re-choisir).
  const selectableSavedPresets = useMemo(
    () => savedPresets.filter((p) => p.id === slot.savedPresetId || !excludeIds.includes(p.id)),
    [savedPresets, excludeIds, slot.savedPresetId],
  );

  // Ferme le menu au clic en dehors (ou Escape) — comportement standard d'un
  // select, pour éviter de rester "coincé" avec le menu ouvert par erreur.
  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (e: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative min-w-0">
      <div
        role="button"
        tabIndex={0}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setOpen((v) => !v);
          }
        }}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-semibold transition-all w-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400",
          open
            ? "border-amber-400/70 bg-amber-50/60 dark:bg-amber-950/20"
            : "border-border bg-card hover:border-amber-300/60",
        )}
      >
        <span
          className={cn(
            "inline-flex items-center justify-center size-5 rounded-full text-[11px] font-black shrink-0",
            style.chip,
          )}
        >
          {style.label}
        </span>
        <span className="flex-1 text-left truncate text-sm">
          {displayName ?? (
            <span className="text-muted-foreground font-normal">Choose a preset…</span>
          )}
        </span>
        {onRemove && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
            className="shrink-0 rounded-md p-0.5 text-muted-foreground hover:text-foreground hover:bg-muted"
            aria-label="Remove this preset from comparison"
          >
            <X className="size-3.5" />
          </button>
        )}
        <ChevronDown
          className={cn(
            "size-3.5 text-muted-foreground transition-transform shrink-0",
            open && "rotate-180",
          )}
        />
      </div>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1.5 z-50 rounded-xl border border-border bg-popover shadow-xl shadow-black/10 p-2 space-y-2 max-h-72 overflow-y-auto">
          {selectableSavedPresets.length > 0 && (
            <>
              <p className="px-2 pt-1 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                My presets
              </p>
              {selectableSavedPresets.map((p) => (
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

          {selectableSavedPresets.length === 0 && (
            <p className="px-2 py-3 text-xs text-muted-foreground text-center">
              {savedPresets.length === 0 ? "No presets available" : "All your presets are already selected"}
            </p>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Compare Tab ──────────────────────────────────────────────────────────────

export interface CompareTabProps {
  ownedMap: Record<string, { code: string; lvl: number }>;
}

export function CompareTab({ ownedMap }: CompareTabProps) {
  const { presets } = useUserPresets();

  const [slots, setSlots] = useState<CompareSlot[]>([{}, {}]);
  const [showBoostDiffOnly, setShowBoostDiffOnly] = useState(false);
  const [showSynergyDiffOnly, setShowSynergyDiffOnly] = useState(false);

  const updateSlot = (index: number, next: CompareSlot) =>
    setSlots((prev) => prev.map((s, i) => (i === index ? next : s)));

  const addSlot = () => setSlots((prev) => (prev.length < MAX_SLOTS ? [...prev, {}] : prev));

  const removeSlot = (index: number) =>
    setSlots((prev) => (prev.length > MIN_SLOTS ? prev.filter((_, i) => i !== index) : prev));

  const codesPerSlot = useMemo(() => slots.map((slot) => getSlotCodes(slot, presets)), [slots, presets]);

  // "Differences only" n'a de sens qu'à partir de 2 presets réellement
  // sélectionnés — sinon il n'y a rien à comparer et le filtre viderait le
  // tableau en entier (plus aucune ligne "différente").
  const selectedPresetCount = useMemo(
    () => slots.filter((s) => s.savedPresetId).length,
    [slots],
  );
  const hasEnoughPresets = selectedPresetCount >= 2;

  const names = useMemo(
    () =>
      slots.map((slot, i) => {
        if (slot.savedPresetId) {
          return presets.find((p) => p.id === slot.savedPresetId)?.name ?? `Preset ${SLOT_STYLES[i].label}`;
        }
        return `Preset ${SLOT_STYLES[i].label}`;
      }),
    [slots, presets],
  );

  const boostGroups = useMemo(
    () => buildWonderGroups(codesPerSlot, slots, presets, ownedMap),
    [codesPerSlot, slots, presets, ownedMap],
  );

  // Le filtre "Differences only" n'est activable que s'il reste au moins une
  // ligne après filtrage — sinon cocher la case viderait entièrement le
  // tableau (état "empty") alors que des données existent bel et bien.
  const hasBoostDiff = useMemo(
    () => hasEnoughPresets && filterDiffOnly(boostGroups).length > 0,
    [boostGroups, hasEnoughPresets],
  );
  const canFilterBoostDiffOnly = hasEnoughPresets && hasBoostDiff;

  const slotWonders = useMemo<SlotWonderInfo[][]>(
    () =>
      codesPerSlot.map((codes, i) =>
        codes.map((code) => ({
          code,
          level: getEffectiveLevel(code, slots[i], presets, ownedMap),
        })),
      ),
    [codesPerSlot, slots, presets, ownedMap],
  );

  const visibleBoostGroups = useMemo(
    () => (showBoostDiffOnly && canFilterBoostDiffOnly ? filterDiffOnly(boostGroups) : boostGroups),
    [boostGroups, showBoostDiffOnly, canFilterBoostDiffOnly],
  );

  const synergyGroups = useMemo(() => buildSynergyGroups(codesPerSlot), [codesPerSlot]);

  // Même chose que hasBoostDiff mais côté synergies : si aucune synergie ne
  // diffère entre les presets sélectionnés, le filtre ne doit pas être
  // activable non plus.
  const hasSynergyDiff = useMemo(
    () => hasEnoughPresets && filterDiffOnly(synergyGroups).length > 0,
    [synergyGroups, hasEnoughPresets],
  );
  const canFilterSynergyDiffOnly = hasEnoughPresets && hasSynergyDiff;

  const visibleSynergyGroups = useMemo(
    () => (showSynergyDiffOnly && canFilterSynergyDiffOnly ? filterDiffOnly(synergyGroups) : synergyGroups),
    [synergyGroups, showSynergyDiffOnly, canFilterSynergyDiffOnly],
  );

  return (
    <div className="space-y-5 pb-16">
      {/* ── Preset selectors + add button, all on one row ── */}
      <div className="flex items-center gap-2">
        <div className="flex-1 grid gap-3" style={{ gridTemplateColumns: `repeat(${slots.length}, 1fr)` }}>
          {slots.map((slot, i) => (
            <PresetSelector
              key={i}
              slot={slot}
              savedPresets={presets}
              excludeIds={slots
                .filter((_, j) => j !== i)
                .map((s) => s.savedPresetId)
                .filter((id): id is string => !!id)}
              onChangeSaved={(id) => updateSlot(i, { savedPresetId: id })}
              onRemove={slots.length > MIN_SLOTS && i === slots.length - 1 ? () => removeSlot(i) : undefined}
              slotIndex={i}
            />
          ))}
        </div>

        {slots.length < MAX_SLOTS && (
          <button
            onClick={addSlot}
            className="shrink-0 flex items-center justify-center gap-1.5 h-9 px-3 rounded-lg border border-dashed border-border text-muted-foreground hover:text-foreground hover:border-amber-300/60 transition-all"
            aria-label="Add a preset to compare"
          >
            <Plus className="size-4" />
            <span className="hidden @min-[640px]:inline text-xs font-semibold whitespace-nowrap">Add preset</span>
          </button>
        )}
      </div>

      {/* ── Wonder boosts comparison ── */}
      <GroupedCompareTable
        title="Wonder boosts"
        names={names}
        groups={visibleBoostGroups}
        emptyTitle="Select at least two presets to compare"
        emptySubtitle="Choose presets above and the wonder boosts will appear here"
        slotWonders={slotWonders}
        toolbarRight={
          <label
            className={cn(
              "flex items-center gap-1.5 text-xs font-medium select-none",
              canFilterBoostDiffOnly
                ? "text-muted-foreground cursor-pointer"
                : "text-muted-foreground/40 cursor-not-allowed",
            )}
            title={
              !hasEnoughPresets
                ? "Select at least two presets to compare differences"
                : !hasBoostDiff
                  ? "No differences between the selected presets"
                  : undefined
            }
          >
            <input
              type="checkbox"
              checked={showBoostDiffOnly && canFilterBoostDiffOnly}
              disabled={!canFilterBoostDiffOnly}
              onChange={() => setShowBoostDiffOnly((v) => !v)}
              className="size-4 rounded border-border accent-amber-500 disabled:cursor-not-allowed"
            />
            Differences only
          </label>
        }
      />

      {/* ── Active synergies comparison ── */}
      <GroupedCompareTable
        title="Active synergies"
        names={names}
        groups={visibleSynergyGroups}
        emptyTitle="No active synergies"
        emptySubtitle="Synergies activated by the wonders in each preset will appear here"
        slotWonders={slotWonders}
        toolbarRight={
          <label
            className={cn(
              "flex items-center gap-1.5 text-xs font-medium select-none",
              canFilterSynergyDiffOnly
                ? "text-muted-foreground cursor-pointer"
                : "text-muted-foreground/40 cursor-not-allowed",
            )}
            title={
              !hasEnoughPresets
                ? "Select at least two presets to compare differences"
                : !hasSynergyDiff
                  ? "No differences between the selected presets"
                  : undefined
            }
          >
            <input
              type="checkbox"
              checked={showSynergyDiffOnly && canFilterSynergyDiffOnly}
              disabled={!canFilterSynergyDiffOnly}
              onChange={() => setShowSynergyDiffOnly((v) => !v)}
              className="size-4 rounded border-border accent-amber-500 disabled:cursor-not-allowed"
            />
            Differences only
          </label>
        }
      />
    </div>
  );
}