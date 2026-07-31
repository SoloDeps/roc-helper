"use client";

// ============================================================
// ROC Helper – User Presets Store
//
// Thin helpers around the Dexie `userPresets` table.
// Uses the same pattern as the rest of the app (see wonders-store.ts):
//   - useLiveQuery for reactive reads
//   - plain async functions for writes
//
// Data lives in roc_presets_db (see presets-schema.ts).
// ============================================================

import { useState, useCallback, useEffect } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import type { UserPreset, WonderPresetEntry } from "@/data/wonders/types";
import { WONDERS } from "@/data/wonders/index";
import { getPresetsDB } from "@/lib/db/presets-schema";

// Nombre max de presets par utilisateur (limite UX, pas une contrainte de stockage)
export const MAX_PRESETS = 12;

// ─── Default empty preset factory ─────────────────────────────────────────────

export function createEmptyPreset(name = "New Preset"): UserPreset {
  return {
    id: `preset-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name,
    capital: [null, null, null, null],
    allied: [null, null, null, null],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

const maxOutSlots = (
  arr: (WonderPresetEntry | null)[],
): (WonderPresetEntry | null)[] =>
  arr.map((entry) => {
    if (!entry) return entry;
    const wonder = WONDERS[entry.code];
    if (!wonder) return entry;
    return { ...entry, level: wonder.meta.maxLevel };
  });

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useUserPresets() {
  const db = getPresetsDB();

  // Réactif : n'importe quel composant (preset-tab, compare-tab, futur layout
  // builder...) voit les mêmes données à jour, sans passer par un contexte.
  const presetsQuery = useLiveQuery(
    () => db.userPresets.orderBy("createdAt").toArray(),
    [],
  );

  const hasHydrated = presetsQuery !== undefined;
  const presets = presetsQuery ?? [];

  const [activePresetId, setActivePresetId] = useState<string | null>(null);

  // Crée un preset par défaut pour un nouvel utilisateur, une fois la DB chargée.
  useEffect(() => {
    if (hasHydrated && presets.length === 0) {
      db.userPresets.add(createEmptyPreset("Preset 1"));
    }
  }, [hasHydrated, presets.length, db]);

  // Sélectionne le premier preset dès qu'aucun n'est actif.
  useEffect(() => {
    if (!activePresetId && presets.length > 0) {
      setActivePresetId(presets[0].id);
    }
  }, [activePresetId, presets]);

  const activePreset =
    presets.find((p) => p.id === activePresetId) ?? presets[0] ?? null;

  // ── Mutators ──

  const addPreset = useCallback(
    async (name?: string) => {
      const count = await db.userPresets.count();
      if (count >= MAX_PRESETS) return null;
      const newP = createEmptyPreset(name ?? `Preset ${count + 1}`);
      await db.userPresets.add(newP);
      setActivePresetId(newP.id);
      return newP;
    },
    [db],
  );

  const deletePreset = useCallback(
    async (id: string) => {
      await db.userPresets.delete(id);
      if (activePresetId !== id) return;
      const remaining = presets.filter((p) => p.id !== id);
      if (remaining.length > 0) {
        setActivePresetId(remaining[0].id);
        return;
      }
      const replacement = createEmptyPreset("Preset 1");
      await db.userPresets.add(replacement);
      setActivePresetId(replacement.id);
    },
    [db, activePresetId, presets],
  );

  const renamePreset = useCallback(
    async (id: string, name: string) => {
      await db.userPresets.update(id, { name, updatedAt: Date.now() });
    },
    [db],
  );

  const setWonder = useCallback(
    async (
      presetId: string,
      slotType: "capital" | "allied",
      slotIndex: number,
      entry: WonderPresetEntry | null,
    ) => {
      const preset = await db.userPresets.get(presetId);
      if (!preset) return;
      const arr = [...preset[slotType]];
      arr[slotIndex] = entry;

      const changes: Partial<UserPreset> = { updatedAt: Date.now() };
      if (slotType === "capital") {
        changes.capital = arr;
      } else {
        changes.allied = arr;
      }

      await db.userPresets.update(presetId, changes);
    },
    [db],
  );

  const clearPreset = useCallback(
    async (presetId: string) => {
      await db.userPresets.update(presetId, {
        capital: [null, null, null, null],
        allied: [null, null, null, null],
        updatedAt: Date.now(),
      });
    },
    [db],
  );

  // Met le level de toutes les wonders déjà présentes dans le preset à leur
  // maxLevel respectif, en une seule fois (capital + allied).
  const maxAllWonders = useCallback(
    async (presetId: string) => {
      const preset = await db.userPresets.get(presetId);
      if (!preset) return;
      await db.userPresets.update(presetId, {
        capital: maxOutSlots(preset.capital),
        allied: maxOutSlots(preset.allied),
        updatedAt: Date.now(),
      });
    },
    [db],
  );

  const duplicatePreset = useCallback(
    async (id: string) => {
      const count = await db.userPresets.count();
      if (count >= MAX_PRESETS) return;
      const source = await db.userPresets.get(id);
      if (!source) return;
      const copy: UserPreset = {
        ...source,
        id: `preset-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: `${source.name} (copy)`,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      await db.userPresets.add(copy);
      setActivePresetId(copy.id);
    },
    [db],
  );

  return {
    presets,
    activePreset,
    activePresetId,
    hasHydrated,
    setActivePresetId,
    addPreset,
    deletePreset,
    renamePreset,
    setWonder,
    clearPreset,
    duplicatePreset,
    maxAllWonders,
  };
}