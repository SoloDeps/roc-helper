"use client";

import { useState, useEffect, useCallback } from "react";
import type { UserPreset, WonderPresetEntry } from "@/data/wonders/types";

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
    if (!raw) return [createEmptyPreset("My Preset 1")];
    return JSON.parse(raw) as UserPreset[];
  } catch {
    return [createEmptyPreset("My Preset 1")];
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

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useUserPresets() {
  // FIX: On passe loadPresets comme "init function" à useState (sans les parenthèses).
  // React l'appelle une seule fois, de façon synchrone, avant le premier render.
  //
  // Avant (problème) :
  //   useState<UserPreset[]>([])  → render avec []
  //   useEffect → setPresets(loaded)  → deuxième render
  //   = 2 renders visibles : hauteur 0 puis hauteur pleine = tremblement
  //
  // Après (fix) :
  //   useState(loadPresets)  → render directement avec les vraies données
  //   = 1 seul render, zéro layout shift
  //
  // Cas SSR : loadPresets retourne [] côté serveur (typeof window === "undefined").
  // hasHydrated gère ce cas pour afficher le skeleton jusqu'au mount client.
  const [presets, setPresets] = useState<UserPreset[]>(loadPresets);

  // FIX: hasHydrated — true immédiatement si on est côté client (cas SPA/CSR),
  // false côté serveur. Le useEffect le passe à true après le premier mount client,
  // ce qui couvre Next.js SSR sans provoquer de flash.
  const [hasHydrated, setHasHydrated] = useState<boolean>(
    () => typeof window !== "undefined",
  );

  const [activePresetId, setActivePresetId] = useState<string | null>(
    () => loadPresets()[0]?.id ?? null,
  );

  // Couvre le cas SSR uniquement : si on était côté serveur (hasHydrated = false),
  // on charge les vraies données après le mount et on signale l'hydration.
  useEffect(() => {
    if (!hasHydrated) {
      const loaded = loadPresets();
      setPresets(loaded);
      setActivePresetId(loaded[0]?.id ?? null);
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
      setPresets((prev) => [...prev, newP]);
      setActivePresetId(newP.id);
      return newP;
    },
    [presets.length],
  );

  const deletePreset = useCallback(
    (id: string) => {
      setPresets((prev) => {
        const next = prev.filter((p) => p.id !== id);
        return next.length > 0 ? next : [createEmptyPreset("My Preset 1")];
      });
      setActivePresetId((prev) => {
        if (prev === id) return presets.find((p) => p.id !== id)?.id ?? null;
        return prev;
      });
    },
    [presets],
  );

  const renamePreset = useCallback((id: string, name: string) => {
    setPresets((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, name, updatedAt: Date.now() } : p,
      ),
    );
  }, []);

  const setWonder = useCallback(
    (
      presetId: string,
      slotType: "capital" | "allied",
      slotIndex: number,
      entry: WonderPresetEntry | null,
    ) => {
      setPresets((prev) =>
        prev.map((p) => {
          if (p.id !== presetId) return p;
          const arr = [...p[slotType]];
          arr[slotIndex] = entry;
          return { ...p, [slotType]: arr, updatedAt: Date.now() };
        }),
      );
    },
    [],
  );

  const clearPreset = useCallback((presetId: string) => {
    setPresets((prev) =>
      prev.map((p) =>
        p.id === presetId
          ? {
              ...p,
              capital: [null, null, null, null],
              allied: [null, null, null, null],
              updatedAt: Date.now(),
            }
          : p,
      ),
    );
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
      setPresets((prev) => {
        const idx = prev.findIndex((p) => p.id === id);
        const next = [...prev];
        next.splice(idx + 1, 0, copy);
        return next;
      });
      setActivePresetId(copy.id);
    },
    [presets],
  );

  return {
    presets,
    activePreset,
    activePresetId,
    hasHydrated, // ← nouveau : utilisé par PresetTab et CompareTab
    setActivePresetId,
    addPreset,
    deletePreset,
    renamePreset,
    setWonder,
    clearPreset,
    duplicatePreset,
  };
}
