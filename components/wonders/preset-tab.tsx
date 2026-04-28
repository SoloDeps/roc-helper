"use client";

import { useState, useMemo, useCallback } from "react";
import { Plus, Copy, Trash2, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useUserPresets } from "@/lib/stores/user-presets-store";
import { getPresetCodes } from "@/lib/wonders-utils";

import {
  PresetTabSkeleton,
  PresetSlot,
  WonderPickerModal,
} from "./presets/components";
import {
  SynergyPanel,
  WonderBoostsPanel,
  MobileSynergyDrawer,
} from "./presets/synergies";

// ─── Main Presets Tab ─────────────────────────────────────────────────────────

export interface PresetTabProps {
  ownedMap: Record<string, { code: string; currentLevel: number }>;
}

export function PresetTab({ ownedMap }: PresetTabProps) {
  const {
    presets,
    hasHydrated,
    activePreset,
    activePresetId,
    setActivePresetId,
    addPreset,
    deletePreset,
    renamePreset,
    setWonder,
    clearPreset,
    duplicatePreset,
  } = useUserPresets();

  const [pickerState, setPickerState] = useState<{
    open: boolean;
    slotType: "capital" | "allied";
    slotIndex: number;
  } | null>(null);
  const [editingName, setEditingName] = useState(false);

  const codes = useMemo(
    () => (activePreset ? getPresetCodes(activePreset) : []),
    [activePreset],
  );

  // Toutes les entries du preset (capital + allied) pour passer au WonderBoostsPanel
  const allEntries = useMemo(() => {
    if (!activePreset) return [];
    return [...activePreset.capital, ...activePreset.allied];
  }, [activePreset]);

  const handleSelectWonder = useCallback(
    (code: string) => {
      if (!pickerState || !activePresetId) return;
      setWonder(activePresetId, pickerState.slotType, pickerState.slotIndex, {
        code,
        level: null,
      });
    },
    [pickerState, activePresetId, setWonder],
  );

  const handleLevelChange = useCallback(
    (
      slotType: "capital" | "allied",
      slotIndex: number,
      level: number | null,
    ) => {
      if (!activePresetId || !activePreset) return;
      const existing = activePreset[slotType][slotIndex];
      if (!existing) return;
      setWonder(activePresetId, slotType, slotIndex, { ...existing, level });
    },
    [activePresetId, activePreset, setWonder],
  );

  if (!hasHydrated || !activePreset) {
    return <PresetTabSkeleton />;
  }

  return (
    <div className="space-y-4">
      {/* ── Selector de presets ── */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-0.5">
        {presets.map((p) => (
          <button
            key={p.id}
            onClick={() => setActivePresetId(p.id)}
            className={cn(
              "shrink-0 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
              p.id === activePresetId
                ? "bg-amber-400 text-amber-950 border-amber-400"
                : "bg-card border-border text-muted-foreground hover:border-foreground/30",
            )}
          >
            {p.name}
          </button>
        ))}
        <button
          onClick={() => addPreset()}
          className="shrink-0 px-3 py-1.5 rounded-lg text-xs border border-dashed border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-all flex items-center gap-1"
        >
          <Plus className="size-3" /> New
        </button>
      </div>

      {/* ── Header mobile : label + bouton drawer synergies ── */}
      <div className="flex items-center justify-between gap-3 md:hidden">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Preset slots
        </p>
        {/* On passe entries et ownedMap pour que le drawer affiche aussi les boosts */}
        <MobileSynergyDrawer
          codes={codes}
          entries={allEntries}
          ownedMap={ownedMap}
        />
      </div>

      <div className="flex flex-col xl:flex-row gap-4 items-start">
        {/* ── Zone principale Capital + Allies ── */}
        <div className="flex-1 min-w-0 max-w-[1050px] space-y-4">
          {/* ── Preset header : nom + bouton ... poussé à droite ── */}
          <div className="flex items-center gap-2">
            {editingName ? (
              <input
                autoFocus
                value={activePreset.name}
                maxLength={30}
                onChange={(e) => renamePreset(activePreset.id, e.target.value)}
                onBlur={() => setEditingName(false)}
                onKeyDown={(e) => e.key === "Enter" && setEditingName(false)}
                className="w-64 h-8 bg-muted rounded-md px-2.5 text-sm font-semibold outline-none focus:ring-1 focus:ring-ring"
              />
            ) : (
              <button
                onClick={() => setEditingName(true)}
                className="text-left text-sm font-semibold hover:text-primary transition-colors h-8"
              >
                {activePreset.name}
              </button>
            )}

            {/* flex-1 pousse le menu ··· tout à droite */}
            <div className="flex-1" />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setEditingName(true)}>
                  Rename
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => duplicatePreset(activePreset.id)}
                >
                  <Copy className="size-3.5 mr-2" /> Duplicate
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => clearPreset(activePreset.id)}>
                  Clear all wonders
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => deletePreset(activePreset.id)}
                  className="text-destructive focus:text-destructive"
                >
                  <Trash2 className="size-3.5 mr-2" /> Delete preset
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* ── Synergies + Boosts inline : md → xl uniquement ── */}
          <div className="hidden md:flex xl:hidden flex-col gap-3">
            <SynergyPanel codes={codes} />
            <WonderBoostsPanel
              codes={codes}
              entries={allEntries}
              ownedMap={ownedMap}
            />
          </div>

          {/* ── Grilles Capital City + Allied Cultures ── */}
          {/*
            FIX hauteur empty slot :
            On ajoute `items-start` sur la grille pour que chaque cellule
            ne s'étire plus automatiquement. La PresetWonderCard définit sa propre
            hauteur, et l'EmptySlotCard utilise h-full + min-h pour s'adapter
            à sa cellule sans imposer une hauteur fixe à la ligne.

            Alternative : `grid-rows-[auto]` est le comportement par défaut,
            mais `items-start` empêche le stretch implicite entre colonnes
            de la même rangée. Si vous voulez que les slots vides s'alignent
            avec les wonder cards de la même rangée (même ligne de grille),
            retirez `items-start` et gardez uniquement h-full sur EmptySlotCard.
          */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Capital City */}
            <div className="flex-1 min-w-0 space-y-4">
              <p className="text-[13px] font-semibold uppercase tracking-widest text-muted-foreground">
                Capital City
              </p>
              <div className="grid grid-cols-2 gap-x-3 gap-y-6 items-start">
                {[0, 1, 2, 3].map((idx) => {
                  const entry = activePreset.capital[idx];
                  return (
                    <PresetSlot
                      key={idx}
                      entry={entry ?? null}
                      ownedMap={ownedMap}
                      onAdd={() =>
                        setPickerState({
                          open: true,
                          slotType: "capital",
                          slotIndex: idx,
                        })
                      }
                      onRemove={() =>
                        setWonder(activePresetId!, "capital", idx, null)
                      }
                      onLevelChange={(lv) =>
                        handleLevelChange("capital", idx, lv)
                      }
                    />
                  );
                })}
              </div>
            </div>

            {/* Allied Cultures */}
            <div className="flex-1 min-w-0 space-y-4">
              <p className="text-[13px] font-semibold uppercase tracking-widest text-muted-foreground">
                Allied Cultures
              </p>
              <div className="grid grid-cols-2 gap-x-3 gap-y-6 items-start">
                {[0, 1, 2, 3].map((idx) => {
                  const entry = activePreset.allied[idx];
                  return (
                    <PresetSlot
                      key={idx}
                      entry={entry ?? null}
                      ownedMap={ownedMap}
                      onAdd={() =>
                        setPickerState({
                          open: true,
                          slotType: "allied",
                          slotIndex: idx,
                        })
                      }
                      onRemove={() =>
                        setWonder(activePresetId!, "allied", idx, null)
                      }
                      onLevelChange={(lv) =>
                        handleLevelChange("allied", idx, lv)
                      }
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── Colonne synergies + boosts droite : xl+ uniquement ── */}
        <div className="hidden xl:flex flex-col gap-3 w-[280px] shrink-0">
          <SynergyPanel codes={codes} />
          <WonderBoostsPanel
            codes={codes}
            entries={allEntries}
            ownedMap={ownedMap}
          />
        </div>
      </div>

      {/* ── Wonder picker modal ── */}
      <WonderPickerModal
        open={!!pickerState?.open}
        onClose={() => setPickerState(null)}
        onSelect={handleSelectWonder}
        excludeCodes={codes}
        slotType={pickerState?.slotType ?? "capital"}
      />
    </div>
  );
}
