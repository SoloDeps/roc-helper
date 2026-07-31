"use client";

import { useState, useEffect, useCallback } from "react";
import type { UserPreset, WonderPresetEntry } from "@/data/wonders/types";
import { WONDERS } from "@/data/wonders/index";

// ─── Storage Key ───────────────────────────────────────────────────────────────

const STORAGE_KEY = "roc-helper:user-presets";

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

// ─── Load / Save ──────────────────────────────────────────────────────────────

function loadPresets(): UserPreset[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [createEmptyPreset("Preset 1")];
    return JSON.parse(raw) as UserPreset[];
  } catch {
    return [createEmptyPreset("Preset 1")];
  }
}

function savePresets(presets: UserPreset[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(presets));
  } catch {
    // quota exceeded, ignore
  }
}

// ─── Combined state type ────────────────────────────────────────────────────────

type PresetsState = {
  presets: UserPreset[];
  activePresetId: string | null;
};

function getInitialState(): PresetsState {
  const loaded = loadPresets();
  return { presets: loaded, activePresetId: loaded[0]?.id ?? null };
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useUserPresets() {
  const [state, setState] = useState<PresetsState>(getInitialState);

  const { presets, activePresetId } = state;

  // FIX: hasHydrated — true immédiatement si on est côté client (cas SPA/CSR),
  // false côté serveur. Le useEffect le passe à true après le premier mount client,
  // ce qui couvre Next.js SSR sans provoquer de flash.
  const [hasHydrated, setHasHydrated] = useState<boolean>(
    () => typeof window !== "undefined",
  );

  // Couvre le cas SSR uniquement : si on était côté serveur (hasHydrated = false),
  // on charge les vraies données après le mount et on signale l'hydration.
  useEffect(() => {
    if (!hasHydrated) {
      const loaded = loadPresets();
      setState({ presets: loaded, activePresetId: loaded[0]?.id ?? null });
      setHasHydrated(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist on change
  useEffect(() => {
    if (presets.length > 0) savePresets(presets);
  }, [presets]);

  const activePreset =
    presets.find((p) => p.id === activePresetId) ?? presets[0] ?? null;

  // ── Mutators ──

  const addPreset = useCallback(
    (name?: string) => {
      const newP = createEmptyPreset(name ?? `Preset ${presets.length + 1}`);
      setState((prev) => ({
        presets: [...prev.presets, newP],
        activePresetId: newP.id,
      }));
      return newP;
    },
    [presets.length],
  );

  const deletePreset = useCallback(
    (id: string) => {
      setState((prev) => {
        const next = prev.presets.filter((p) => p.id !== id);
        if (next.length > 0) {
          const nextActiveId =
            prev.activePresetId === id
              ? (prev.presets.find((p) => p.id !== id)?.id ?? next[0].id)
              : prev.activePresetId;
          return { presets: next, activePresetId: nextActiveId };
        }
        const replacement = createEmptyPreset("Preset 1");
        return { presets: [replacement], activePresetId: replacement.id };
      });
    },
    [],
  );

  const renamePreset = useCallback((id: string, name: string) => {
    setState((prev) => ({
      ...prev,
      presets: prev.presets.map((p) =>
        p.id === id ? { ...p, name, updatedAt: Date.now() } : p,
      ),
    }));
  }, []);

  const setWonder = useCallback(
    (
      presetId: string,
      slotType: "capital" | "allied",
      slotIndex: number,
      entry: WonderPresetEntry | null,
    ) => {
      setState((prev) => ({
        ...prev,
        presets: prev.presets.map((p) => {
          if (p.id !== presetId) return p;
          const arr = [...p[slotType]];
          arr[slotIndex] = entry;
          return { ...p, [slotType]: arr, updatedAt: Date.now() };
        }),
      }));
    },
    [],
  );

  const clearPreset = useCallback((presetId: string) => {
    setState((prev) => ({
      ...prev,
      presets: prev.presets.map((p) =>
        p.id === presetId
          ? {
              ...p,
              capital: [null, null, null, null],
              allied: [null, null, null, null],
              updatedAt: Date.now(),
            }
          : p,
      ),
    }));
  }, []);

  // Met le level de toutes les wonders déjà présentes dans le preset à leur
  // maxLevel respectif, en une seule fois (capital + allied).
  const maxAllWonders = useCallback((presetId: string) => {
    setState((prev) => ({
      ...prev,
      presets: prev.presets.map((p) => {
        if (p.id !== presetId) return p;
        const maxOut = (arr: (WonderPresetEntry | null)[]) =>
          arr.map((entry) => {
            if (!entry) return entry;
            const wonder = WONDERS[entry.code];
            if (!wonder) return entry;
            return { ...entry, level: wonder.meta.maxLevel };
          });
        return {
          ...p,
          capital: maxOut(p.capital),
          allied: maxOut(p.allied),
          updatedAt: Date.now(),
        };
      }),
    }));
  }, []);

  const duplicatePreset = useCallback(
    (id: string) => {
      const source = presets.find((p) => p.id === id);
      if (!source) return;
      const copy: UserPreset = {
        ...source,
        id: `preset-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name: `${source.name} (copy)`,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      setState((prev) => {
        const idx = prev.presets.findIndex((p) => p.id === id);
        const next = [...prev.presets];
        next.splice(idx + 1, 0, copy);
        return { presets: next, activePresetId: copy.id };
      });
    },
    [presets],
  );

  return {
    presets,
    activePreset,
    activePresetId,
    hasHydrated,
    setActivePresetId: (id: string | null) =>
      setState((prev) => ({ ...prev, activePresetId: id })),
    addPreset,
    deletePreset,
    renamePreset,
    setWonder,
    clearPreset,
    duplicatePreset,
    maxAllWonders,
  };
}