"use client";

import { Pencil } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
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

// ─── Config partagée (plus de duplication) ───────────────────────────────────
import {
  WONDER_IMAGE_MAP,
  WONDER_IMAGE_OFFSET_PX,
  MATERIAL_COLORS,
} from "@/data/wonders/wonder-config";

// ─── Modal de détail ──────────────────────────────────────────────────────────
import { WonderDetailModal } from "@/components/wonders/wonder-detail-modal";

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

// ─── Progress Row ─────────────────────────────────────────────────────────────

interface ProgressRowProps {
  level: number;
  maxLevel: number;
  editing: boolean;
  onSliderChange?: (value: number) => void;
}

function ProgressRow({
  level,
  maxLevel,
  editing,
  onSliderChange,
}: ProgressRowProps) {
  const pct = maxLevel > 0 ? Math.round((level / maxLevel) * 100) : 0;

  return (
    <div className="flex items-center gap-2">
      {editing ? (
        <div className="relative flex-1 h-1 rounded-full bg-muted overflow-visible">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-amber-400 pointer-events-none transition-[width] duration-100"
            style={{ width: `${pct}%` }}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 size-4 rounded-full bg-amber-400 border-2 border-background shadow-sm pointer-events-none transition-[left] duration-100"
            style={{ left: `calc(${pct}% - 8px)` }}
          />
          <input
            type="range"
            min={1}
            max={maxLevel}
            value={level}
            onChange={(e) => onSliderChange?.(Number(e.target.value))}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>
      ) : (
        <div className="flex-1 h-1 rounded-full bg-muted overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full bg-amber-400 transition-all duration-300",
              pct === 100 && "bg-[#5dd700]",
            )}
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
      <span className="text-[11px] font-semibold tabular-nums text-muted-foreground shrink-0">
        {level}/{maxLevel}
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
}

function EditControls({
  wonder,
  draft,
  setDraft,
  onSave,
  onRemove,
  onCancel,
}: EditControlsProps) {
  return (
    <>
      <ProgressRow
        level={draft}
        maxLevel={wonder.meta.maxLevel}
        editing={true}
        onSliderChange={setDraft}
      />
      <div className="flex gap-1.5">
        <Button
          variant="ghost"
          size="sm"
          className="h-7 text-xs rounded-sm text-destructive hover:text-destructive hover:bg-destructive/10 px-2"
          onClick={onRemove}
        >
          Remove
        </Button>
        <div className="flex-1" />
        <Button
          variant="outline"
          size="sm"
          className="h-7 text-xs rounded-sm px-2"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          size="sm"
          className="h-7 text-xs rounded-sm px-2"
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
  const isMobile = !useMediaQuery("(min-width: 640px)");

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
        <div className="relative w-full h-[200px] shrink-0 pt-6 -mt-6 overflow-hidden">
          {imageSrc ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageSrc}
                alt={wonder.meta.name}
                onClick={() => setDetailOpen(true)}
                className={cn(
                  "w-full h-auto transition-all duration-300 group-hover:brightness-110",
                  !isUnlocked && "grayscale brightness-[0.75]",
                  "cursor-pointer hover:scale-[1.03] origin-center",
                )}
                style={{ transform: `translateY(${offsetPx}px)` }}
                title="Voir les détails du Wonder"
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
        <div className="px-2.5 pt-2 pb-2.5 space-y-2 z-30 bg-background border border-t-transparent rounded-b-lg">
          {editing ? (
            <EditControls
              wonder={wonder}
              draft={draft}
              setDraft={setDraft}
              onSave={handleSave}
              onRemove={handleRemove}
              onCancel={handleCancel}
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
                  className="w-full h-7 text-xs rounded-sm gap-1.5"
                  onClick={handleEditClick}
                >
                  <Pencil className="size-3" />
                  Edit level
                </Button>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full h-7 text-xs rounded-sm"
                  onClick={handleUnlock}
                >
                  Unlock
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Mobile Drawer (edit level) ── */}
      <Drawer
        open={drawerOpen}
        onOpenChange={(o) => {
          if (!o) handleDrawerClose();
        }}
      >
        <DrawerContent className="px-4 pb-6">
          <DrawerHeader className="px-0 pt-4 pb-3">
            <DrawerTitle>{wonder.meta.name}</DrawerTitle>
          </DrawerHeader>
          <div className="space-y-4">
            <EditControls
              wonder={wonder}
              draft={draft}
              setDraft={setDraft}
              onSave={handleSave}
              onRemove={handleRemove}
              onCancel={handleDrawerClose}
            />
          </div>
        </DrawerContent>
      </Drawer>

      {/* ── Detail Modal (clic image) ── */}
      <WonderDetailModal
        wonder={wonder}
        currentLevel={currentLevel}
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
      />
    </>
  );
}
