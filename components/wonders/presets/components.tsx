"use client";

import { useState, useMemo } from "react";
import { Plus, X, Pencil } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";

import { WONDERS, WONDER_CODES } from "@/data/wonders/index";
import type { WonderPresetEntry } from "@/data/wonders/types";
import {
  WONDER_IMAGE_MAP,
  WONDER_IMAGE_OFFSET_PX,
  MATERIAL_COLORS,
} from "@/data/wonders/wonder-config";

// ─── Skeleton placeholder ─────────────────────────────────────────────────────

export function PresetTabSkeleton() {
  return (
    <div className="space-y-4 min-h-[520px] animate-pulse">
      <div className="flex gap-2 pb-0.5">
        {[80, 96, 72].map((w, i) => (
          <div
            key={i}
            className="h-8 rounded-lg bg-muted"
            style={{ width: w }}
          />
        ))}
        <div className="h-8 w-16 rounded-lg bg-muted" />
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 h-5 rounded bg-muted" />
        <div className="size-7 rounded bg-muted" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        {[0, 1].map((col) => (
          <div key={col} className="space-y-2">
            <div className="h-3 w-20 rounded bg-muted" />
            <div className="grid grid-cols-2 gap-2">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="aspect-[3/4] rounded-lg bg-muted w-full"
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Empty Slot Card ──────────────────────────────────────────────────────────
// FIX : on supprime la hauteur fixe h-[266px] codée en dur.
// Le slot utilise désormais h-full + min-h pour s'étirer à la hauteur
// de sa cellule de grille (définie par la PresetWonderCard voisine),
// sans jamais imposer sa propre hauteur aux autres cellules.

interface EmptySlotCardProps {
  onAdd: () => void;
}

export function EmptySlotCard({ onAdd }: EmptySlotCardProps) {
  return (
    <button
      onClick={onAdd}
      // h-full : s'adapte à la hauteur de la cellule grille (dictée par la wonder card voisine)
      // min-h-[200px] : hauteur minimale quand toute la ligne est vide
      className="group flex items-center justify-center w-full h-full min-h-[200px] rounded-lg border-2 border-dashed border-border hover:border-primary/40 transition-colors text-muted-foreground hover:text-foreground"
    >
      <span className="flex items-center gap-1.5 text-xs font-medium">
        <Plus className="size-3.5" />
        Add wonder
      </span>
    </button>
  );
}

// ─── Wonder Picker Content ────────────────────────────────────────────────────

export function WonderPickerContent({
  onSelect,
  excludeCodes,
  slotType,
}: {
  onSelect: (code: string) => void;
  excludeCodes: string[];
  slotType: "capital" | "allied";
}) {
  const filtered = useMemo(() => {
    return WONDER_CODES.map((c) => WONDERS[c]).filter((w) => {
      if (excludeCodes.includes(w.meta.code)) return false;
      if (slotType === "capital") return w.meta.slot === "Capital City";
      return w.meta.slot !== "Capital City";
    });
  }, [excludeCodes, slotType]);

  if (filtered.length === 0) {
    return (
      <p className="text-sm text-muted-foreground text-center py-12 px-4">
        No wonders available.
      </p>
    );
  }

  return (
    <div className="overflow-y-auto h-full px-4 pb-6 pt-6">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-3 gap-y-5">
        {filtered.map((w) => {
          const imageSrc = WONDER_IMAGE_MAP[w.meta.code];
          const offsetPx = WONDER_IMAGE_OFFSET_PX[w.meta.code] ?? 0;

          return (
            <button
              key={w.meta.code}
              onClick={() => onSelect(w.meta.code)}
              className="group relative flex flex-col rounded-lg bg-card hover:ring-2 hover:ring-amber-400/70 hover:shadow-md transition-all text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-400"
            >
              <div className="relative w-full h-[180px] shrink-0 pt-6 -mt-6 overflow-hidden rounded-lg">
                {imageSrc ? (
                  <>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imageSrc}
                      alt={w.meta.name}
                      className="w-full h-auto transition-all duration-300 group-hover:brightness-110"
                      style={{ transform: `translateY(${offsetPx}px)` }}
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/0 to-transparent pointer-events-none" />
                    <div className="absolute bottom-0 left-0 right-0 px-2 pb-2 pt-4 pointer-events-none">
                      <div className="flex flex-wrap gap-1 mb-1">
                        <span
                          className={cn(
                            "text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-xs leading-none",
                            MATERIAL_COLORS[w.meta.material1],
                          )}
                        >
                          {w.meta.material1}
                        </span>
                        {w.meta.material1 !== w.meta.material2 && (
                          <span
                            className={cn(
                              "text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-xs leading-none",
                              MATERIAL_COLORS[w.meta.material2],
                            )}
                          >
                            {w.meta.material2}
                          </span>
                        )}
                      </div>
                      <p className="text-[13px] font-bold text-white leading-tight drop-shadow-sm line-clamp-2">
                        {w.meta.name}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full bg-muted rounded-lg" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Wonder Picker Modal ──────────────────────────────────────────────────────

export function WonderPickerModal({
  open,
  onClose,
  onSelect,
  excludeCodes,
  slotType,
}: {
  open: boolean;
  onClose: () => void;
  onSelect: (code: string) => void;
  excludeCodes: string[];
  slotType: "capital" | "allied";
}) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const title =
    slotType === "capital"
      ? "Select a Capital Wonder"
      : "Select an Allied Wonder";

  const content = (
    <WonderPickerContent
      onSelect={(code) => {
        onSelect(code);
        onClose();
      }}
      excludeCodes={excludeCodes}
      slotType={slotType}
    />
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
        <DialogContent className="max-w-[750px]! w-full h-[80vh] flex flex-col p-0 gap-0 overflow-hidden">
          <DialogHeader className="px-6 pt-5 pb-3 shrink-0 border-b border-border">
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <div className="flex-1 overflow-hidden">{content}</div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={(v) => !v && onClose()}>
      <DrawerContent className="h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
        <DrawerHeader className="px-4 pt-4 pb-3 shrink-0 border-b border-border">
          <DrawerTitle>{title}</DrawerTitle>
        </DrawerHeader>
        <div className="flex-1 overflow-hidden">{content}</div>
      </DrawerContent>
    </Drawer>
  );
}

// ─── Preset Wonder Card ───────────────────────────────────────────────────────

interface PresetWonderCardProps {
  entry: WonderPresetEntry;
  ownedLevel?: number;
  onLevelChange: (level: number | null) => void;
  onRemove: () => void;
  onReplace: () => void;
}

export function PresetWonderCard({
  entry,
  ownedLevel,
  onLevelChange,
  onRemove,
  onReplace,
}: PresetWonderCardProps) {
  const wonder = WONDERS[entry.code];
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<number | null>(entry.level);

  if (!wonder) return null;

  const imageSrc = WONDER_IMAGE_MAP[wonder.meta.code];
  const offsetPx = WONDER_IMAGE_OFFSET_PX[wonder.meta.code] ?? 0;
  const effectiveLevel = entry.level ?? ownedLevel ?? 1;
  const maxLevel = wonder.meta.maxLevel;
  const pct = maxLevel > 0 ? Math.round((effectiveLevel / maxLevel) * 100) : 0;

  const draftLevel = draft ?? ownedLevel ?? 1;
  const draftPct = maxLevel > 0 ? Math.round((draftLevel / maxLevel) * 100) : 0;

  const handleEditOpen = () => {
    setDraft(entry.level);
    setEditing(true);
  };
  const handleCancel = () => {
    setDraft(entry.level);
    setEditing(false);
  };
  const handleDone = () => {
    onLevelChange(draft);
    setEditing(false);
  };

  return (
    <div className="group relative flex flex-col rounded-lg bg-card">
      {/* ── Zone image ── */}
      <div className="relative w-full h-[200px] shrink-0 pt-6 -mt-6 overflow-hidden">
        {imageSrc ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageSrc}
              alt={wonder.meta.name}
              className="w-full h-auto group-hover:brightness-110"
              style={{ transform: `translateY(${offsetPx}px)` }}
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/0 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 right-0 px-2 pb-2 pt-6 pointer-events-none">
              <div className="flex flex-wrap gap-1 mb-1">
                <span
                  className={cn(
                    "text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-xs leading-none",
                    MATERIAL_COLORS[wonder.meta.material1],
                  )}
                >
                  {wonder.meta.material1}
                </span>
                {wonder.meta.material1 !== wonder.meta.material2 && (
                  <span
                    className={cn(
                      "text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-xs leading-none",
                      MATERIAL_COLORS[wonder.meta.material2],
                    )}
                  >
                    {wonder.meta.material2}
                  </span>
                )}
              </div>
              <p className="text-[13px] font-bold text-white leading-tight drop-shadow-sm line-clamp-2">
                {wonder.meta.name}
              </p>
            </div>
            <button
              onClick={onRemove}
              className="absolute top-7 right-1.5 size-5 rounded-full bg-black/60 flex items-center justify-center text-white/80 hover:text-white hover:bg-black/80 z-10"
              title="Remove from preset"
            >
              <X className="size-3" />
            </button>
          </>
        ) : (
          <div className="w-full h-full bg-muted" />
        )}
      </div>

      {/* ── Zone basse ── */}
      <div className="px-2.5 pt-2 pb-2.5 space-y-2 z-30 bg-background border border-t-transparent rounded-b-lg">
        {editing ? (
          <>
            <div className="flex items-center gap-2">
              <div className="relative flex-1 h-1 rounded-full bg-muted overflow-visible">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-amber-400 pointer-events-none"
                  style={{ width: `${draftPct}%` }}
                />
                <div
                  className="absolute top-1/2 -translate-y-1/2 size-4 rounded-full bg-amber-400 border-2 border-background shadow-sm pointer-events-none"
                  style={{ left: `calc(${draftPct}% - 8px)` }}
                />
                <input
                  type="range"
                  min={1}
                  max={maxLevel}
                  value={draftLevel}
                  onChange={(e) => setDraft(Number(e.target.value))}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </div>
              <span className="text-[11px] font-semibold tabular-nums text-muted-foreground shrink-0">
                {draftLevel}/{maxLevel}
              </span>
            </div>
            <div className="flex gap-1.5">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs rounded-sm px-2 text-amber-600 hover:text-amber-600 hover:bg-amber-400/10"
                onClick={() => setDraft(maxLevel)}
              >
                Max
              </Button>
              {ownedLevel !== undefined && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs rounded-sm px-2 text-muted-foreground hover:text-foreground"
                  onClick={() => setDraft(null)}
                  title={`Revenir au level Wonders Tab (${ownedLevel})`}
                >
                  Auto
                </Button>
              )}
              <div className="flex-1" />
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs rounded-sm px-2"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                size="sm"
                className="h-7 text-xs rounded-sm px-2"
                onClick={handleDone}
              >
                Done
              </Button>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
                <div
                  className={cn(
                    "h-full rounded-full bg-amber-400",
                    pct === 100 && "bg-[#5dd700]",
                  )}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-[12px] font-semibold tabular-nums text-muted-foreground shrink-0">
                {effectiveLevel}/{maxLevel}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="w-full h-7 text-xs rounded-sm gap-1.5"
              onClick={handleEditOpen}
            >
              <Pencil className="size-3" />
              Edit level
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Preset Slot ──────────────────────────────────────────────────────────────
// FIX : on enveloppe chaque slot dans un div avec contents pour que la grille
// CSS pilote la hauteur, et le slot vide reçoit h-full pour s'adapter.

interface PresetSlotProps {
  entry: WonderPresetEntry | null;
  ownedMap: Record<string, { code: string; lvl: number }>;
  onAdd: () => void;
  onRemove: () => void;
  onLevelChange: (level: number | null) => void;
}

export function PresetSlot({
  entry,
  ownedMap,
  onAdd,
  onRemove,
  onLevelChange,
}: PresetSlotProps) {
  if (!entry || !WONDERS[entry.code]) {
    return <EmptySlotCard onAdd={onAdd} />;
  }

  return (
    <PresetWonderCard
      entry={entry}
      ownedLevel={ownedMap[entry.code]?.lvl}
      onLevelChange={onLevelChange}
      onRemove={onRemove}
      onReplace={onAdd}
    />
  );
}
