"use client";

import { Pencil, Trash2 } from "lucide-react";
import { useState, useCallback, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import { toast } from "sonner";
import {
  addOrUpdateUserWonder,
  removeUserWonder,
  updateWonderLevel,
} from "@/lib/stores/wonders-store";
import type { Wonder, MaterialType } from "@/data/wonders/types";

import {
  WONDER_IMAGE_MAP,
  WONDER_IMAGE_OFFSET_PX,
  MATERIAL_COLORS,
} from "@/data/wonders/wonder-config";

import { WonderDetailModal } from "@/components/wonders/wonder-detail-modal";

// ─── Debounced callback ───────────────────────────────────────────────────────

function useDebouncedCallback<T extends (...args: any[]) => void>(
  callback: T,
  delay: number,
): T {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => callback(...args), delay);
    },
    [callback, delay],
  ) as T;

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return debouncedCallback;
}

// ─── MaterialTag ──────────────────────────────────────────────────────────────

function MaterialTag({ material }: { material: MaterialType }) {
  return (
    <span
      className={cn(
        "text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-xs leading-none",
        MATERIAL_COLORS[material],
      )}
    >
      {material}
    </span>
  );
}

// ─── InlineSlider ─────────────────────────────────────────────────────────────
// Slider desktop qui adopte exactement le même look que la progress bar :
// track h-1 rounded-full bg-muted, range bg-amber-400, thumb amber positionné
// absolument. Un <input range> transparent capture les interactions.

interface InlineSliderProps {
  value: number;
  min: number;
  max: number;
  isMax: boolean;
  onChange: (v: number) => void;
}

function InlineSlider({ value, min, max, isMax, onChange }: InlineSliderProps) {
  const pct = max > min ? Math.round(((value - min) / (max - min)) * 100) : 0;

  return (
    // Zone de touch généreuse verticalement — même principe que slider.tsx
    <div className="relative flex-1 flex items-center h-5 cursor-pointer">
      {/* Track */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 rounded-full bg-muted overflow-visible">
        {/* Range rempli */}
        <div
          className={cn(
            "absolute inset-y-0 left-0 rounded-full pointer-events-none transition-[width] duration-75",
            isMax ? "bg-[#5dd700]" : "bg-amber-400",
          )}
          style={{ width: `${pct}%` }}
        />
        {/* Thumb */}
        <div
          className={cn(
            "absolute top-1/2 -translate-y-1/2 size-3.5 rounded-full border-2 border-background shadow-sm pointer-events-none transition-[left] duration-75",
            isMax ? "bg-[#5dd700]" : "bg-amber-400",
          )}
          style={{ left: `calc(${pct}% - 7px)` }}
        />
      </div>
      {/* Input transparent par-dessus pour capturer les interactions */}
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
    </div>
  );
}

// ─── Progress Row ─────────────────────────────────────────────────────────────
// - Vue : barre statique (inchangée)
// - Édition mobile  : <Slider> radix (touch-friendly, h-12)
// - Édition desktop : <InlineSlider> qui se fond dans la barre de progression

interface ProgressRowProps {
  level: number;
  maxLevel: number;
  editing: boolean;
  isMobile?: boolean;
  onSliderChange?: (value: number) => void;
}

function ProgressRow({
  level,
  maxLevel,
  editing,
  isMobile = false,
  onSliderChange,
}: ProgressRowProps) {
  const [localValue, setLocalValue] = useState(level);

  useEffect(() => {
    setLocalValue(level);
  }, [level]);

  const debouncedOnChange = useDebouncedCallback(
    (v: number) => onSliderChange?.(v),
    300,
  );

  const handleChange = useCallback(
    (v: number) => {
      setLocalValue(v);
      debouncedOnChange(v);
    },
    [debouncedOnChange],
  );

  const displayValue = editing ? localValue : level;
  const pct = maxLevel > 0 ? Math.round((displayValue / maxLevel) * 100) : 0;
  const isMax = pct === 100;

  return (
    <div className="flex items-center gap-2 h-5">
      {editing && isMobile ? (
        // Mobile : Slider radix (zone tactile h-12)
        <Slider
          value={[localValue]}
          onValueChange={([v]) => handleChange(v)}
          min={1}
          max={maxLevel}
          step={1}
          className="flex-1"
        />
      ) : editing && !isMobile ? (
        // Desktop : slider inline, même look que la progress bar
        <InlineSlider
          value={localValue}
          min={1}
          max={maxLevel}
          isMax={isMax}
          onChange={handleChange}
        />
      ) : (
        // Vue statique
        <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full bg-amber-400 transition-all duration-300",
              isMax && "bg-[#5dd700]",
            )}
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
      <span className="text-sm md:text-[12px] font-semibold tabular-nums text-muted-foreground shrink-0">
        {displayValue}/{maxLevel}
      </span>
    </div>
  );
}

// ─── Edit Controls ────────────────────────────────────────────────────────────

interface EditControlsProps {
  wonder: Wonder;
  draft: number;
  setDraft: (v: number) => void;
  onSave: () => void;
  onRemove: () => void;
  onCancel: () => void;
  onMax: () => void;
  isMobile?: boolean;
}

function EditControls({
  wonder,
  draft,
  setDraft,
  onSave,
  onRemove,
  onCancel,
  onMax,
  isMobile = false,
}: EditControlsProps) {
  return (
    <>
      <ProgressRow
        level={draft}
        maxLevel={wonder.meta.maxLevel}
        editing={true}
        isMobile={isMobile}
        onSliderChange={setDraft}
      />
      <div className="flex gap-1.5 items-center">
        <Button
          variant="ghost"
          size="icon"
          className="size-9 md:size-7 shrink-0 text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={onRemove}
          title="Remove wonder"
          aria-label="Remove wonder"
        >
          <Trash2 className="size-6 md:size-4" />
        </Button>

        <Button
          variant="outline"
          className="max-md:w-22 md:h-7 text-sm md:text-[13px] rounded-sm px-2 text-muted-foreground hover:text-amber-600 hover:bg-amber-400/10 gap-1"
          onClick={onMax}
          title={`Set to max level (${wonder.meta.maxLevel})`}
        >
          Max
        </Button>

        <div className="flex-1" />
        <Button
          variant="outline"
          className="max-md:w-22 md:h-7 text-sm md:text-xs rounded-sm px-2"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          className="max-md:w-22 md:h-7 text-sm md:text-xs rounded-sm px-2"
          onClick={onSave}
        >
          Save
        </Button>
      </div>
    </>
  );
}

// ─── Props & Component ────────────────────────────────────────────────────────

interface WonderGameCardProps {
  wonder: Wonder;
  currentLevel?: number;
}

export function WonderGameCard({ wonder, currentLevel }: WonderGameCardProps) {
  const isUnlocked = currentLevel !== undefined;
  const imageSrc = WONDER_IMAGE_MAP[wonder.meta.code];
  const offsetPx = WONDER_IMAGE_OFFSET_PX[wonder.meta.code] ?? 0;
  const isMobile = !useMediaQuery("(min-width: 768px)");

  const [editing, setEditing] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [draft, setDraft] = useState(currentLevel ?? 1);

  const displayLevel = isUnlocked ? currentLevel! : 0;
  const syncDraft = () => setDraft(currentLevel ?? 1);

  const handleUnlock = async () => {
    try {
      await addOrUpdateUserWonder(wonder.meta.code, 1);
      toast.success(`${wonder.meta.name} unlocked`);
    } catch {
      toast.error("Failed to unlock wonder");
    }
  };

  const handleSave = async () => {
    try {
      await updateWonderLevel(wonder.meta.code, draft);
      toast.success(`${wonder.meta.name} → level ${draft}`);
      setEditing(false);
      setDrawerOpen(false);
    } catch {
      toast.error("Failed to update level");
    }
  };

  const handleMax = () => setDraft(wonder.meta.maxLevel);

  const handleRemove = async () => {
    try {
      await removeUserWonder(wonder.meta.code);
      toast.success(`${wonder.meta.name} removed`);
      setEditing(false);
      setDrawerOpen(false);
    } catch {
      toast.error("Failed to remove wonder");
    }
  };

  const handleEditClick = () => {
    syncDraft();
    if (isMobile) setDrawerOpen(true);
    else setEditing(true);
  };

  const handleCancel = () => {
    setEditing(false);
    syncDraft();
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    syncDraft();
  };

  return (
    <>
      <div
        className={cn(
          "group relative flex flex-col rounded-lg bg-card transition-all md:min-w-[220px]",
        )}
      >
        {/* ── Image ── */}
        <div className="relative w-full h-[180px] md:h-[200px] shrink-0 pt-6 -mt-6 overflow-hidden">
          {imageSrc ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageSrc}
                alt={wonder.meta.name}
                onClick={() => setDetailOpen(true)}
                draggable={false}
                className={cn(
                  "w-full h-auto transition-all duration-300 group-hover:brightness-110 select-none scale-100",
                  !isUnlocked && "grayscale brightness-[0.75]",
                  "cursor-pointer hover:scale-[1.02] origin-center",
                )}
                style={{ transform: `translateY(${offsetPx}px)` }}
                title="View Wonder details"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/0 to-transparent pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 px-2 pb-2 pt-6 pointer-events-none">
                <div className="flex flex-wrap gap-1 mb-1">
                  <MaterialTag material={wonder.meta.material1} />
                  {wonder.meta.material1 !== wonder.meta.material2 && (
                    <MaterialTag material={wonder.meta.material2} />
                  )}
                </div>
                <p className="text-[13px] font-bold text-white leading-tight drop-shadow-sm line-clamp-2">
                  {wonder.meta.name}
                </p>
              </div>
            </>
          ) : (
            <div className="w-full h-full bg-muted" />
          )}
        </div>

        {/* ── Bottom: progress + bouton ── */}
        <div className="px-2.5 pt-1.5 pb-2.5 space-y-2 z-30 bg-background border border-t-transparent rounded-b-lg">
          {editing ? (
            <EditControls
              wonder={wonder}
              draft={draft}
              setDraft={setDraft}
              onSave={handleSave}
              onRemove={handleRemove}
              onCancel={handleCancel}
              onMax={handleMax}
              isMobile={false}
            />
          ) : (
            <>
              <ProgressRow
                level={displayLevel}
                maxLevel={wonder.meta.maxLevel}
                editing={false}
              />
              {isUnlocked ? (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full h-7 text-xs rounded-sm gap-1.5 select-none"
                  onClick={handleEditClick}
                >
                  <Pencil className="size-3" />
                  Edit level
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full h-7 text-xs rounded-sm select-none"
                  onClick={handleUnlock}
                >
                  Unlock
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Mobile Drawer ── */}
      <Drawer
        open={drawerOpen}
        onOpenChange={(o) => {
          if (!o) handleDrawerClose();
        }}
      >
        <DrawerContent className="px-4 pb-6 h-[35vh]">
          <DrawerHeader className="px-0 pt-4 pb-3">
            <DrawerTitle>{wonder.meta.name}</DrawerTitle>
          </DrawerHeader>
          <div className="space-y-9 pt-5">
            <EditControls
              wonder={wonder}
              draft={draft}
              setDraft={setDraft}
              onSave={handleSave}
              onRemove={handleRemove}
              onCancel={handleDrawerClose}
              onMax={handleMax}
              isMobile={true}
            />
          </div>
        </DrawerContent>
      </Drawer>

      {/* ── Detail Modal ── */}
      <WonderDetailModal
        wonder={wonder}
        currentLevel={currentLevel}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
      />
    </>
  );
}
