"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { CityCanvas }       from "@/components/planner/CityCanvas";
import { BuildingSelector } from "@/components/planner/BuildingSelector";
import { CommandBar }       from "@/components/planner/CommandBar";
import { StatsPanel }       from "@/components/planner/StatsPanel";
import {
  useCityPlannerStore,
  useShowHappiness,
  useEntityCount,
} from "@/planner/state/cityPlannerStore";
import {
  loadLayout,
  saveLayout,
  generateThumbnail,
  type CityLayout,
} from "@/planner/utils/layoutDB";
import { CITY_CONFIG } from "@/app/(main)/city-planner/page";
import type { CityId } from "@/planner/data/cityGridDefinitions";

export default function CityPlannerEditorPage() {
  const router = useRouter();

  const [layout, setLayout]         = useState<CityLayout | null>(null);
  const [layoutName, setLayoutName] = useState("Nouveau layout");
  const [cityId, setCityId]         = useState<CityId>("City_Capital");
  const [showStats, setShowStats]   = useState(false);
  const [saving, setSaving]         = useState(false);
  const [loading, setLoading]       = useState(true);

  const stateRef        = useCityPlannerStore((s) => s.stateRef);
  const clearAll        = useCityPlannerStore((s) => s.clearAll);
  const setCurrentCity  = useCityPlannerStore((s) => s.setCurrentCity);
  const showHappiness   = useShowHappiness();
  const toggleHappiness = useCityPlannerStore((s) => s.toggleHappiness);
  const entityCount     = useEntityCount();

  const city = CITY_CONFIG.find((c) => c.id === cityId);

  // ── Chargement depuis Zustand (activeLayoutId mis par le listing) ──────────
  useEffect(() => {
    const { activeLayoutId, activeCityId } = useCityPlannerStore.getState();

    if (!activeLayoutId) {
      const resolvedCity = (activeCityId as CityId) ?? 'City_Capital';
      setCityId(resolvedCity);
      setCurrentCity(resolvedCity);
      clearAll();
      setLoading(false);
      return;
    }

    loadLayout(activeLayoutId).then((l) => {
      if (!l) { router.replace("/city-planner"); return; }
      setLayout(l);
      setLayoutName(l.name);
      setCityId(l.cityId);
      setCurrentCity(l.cityId);  // ← initialise expansions + mapBounds
      stateRef.current.mapState.loadFromSerialized(l.data);
      setLoading(false);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Sauvegarde ────────────────────────────────────────────────────────────
  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const data      = stateRef.current.mapState.serialize();
      const canvas    = document.querySelector("canvas");
      const thumbnail = canvas ? generateThumbnail(canvas) : undefined;

      const saved = await saveLayout({
        id:          layout?.id,
        name:        layoutName,
        cityId,
        era:         useCityPlannerStore.getState().currentEra,
        entityCount,
        data,
        thumbnail,
      });
      setLayout(saved);
      useCityPlannerStore.getState().setActiveLayoutId(saved.id);
    } finally {
      setSaving(false);
    }
  }, [layout, layoutName, cityId, entityCount, stateRef]);

  // Ctrl+S
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "s" || e.key === "S") && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        handleSave();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleSave]);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-sm text-muted-foreground">Chargement…</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">

      {/* ── Topbar ────────────────────────────────────────────────────── */}
      <div className="h-10 shrink-0 border-b bg-background flex items-center gap-2 px-3">

        <button
          onClick={() => router.push("/city-planner")}
          className="text-muted-foreground hover:text-foreground transition-colors text-xs flex items-center gap-1 shrink-0"
        >
          ← Retour
        </button>

        <div className="w-px h-4 bg-border mx-1 shrink-0" />

        {city && (
          <span className="text-xs flex items-center gap-1.5 shrink-0" style={{ color: city.color }}>
            <span>{city.flag}</span>
            <span className="font-medium">{city.name}</span>
          </span>
        )}

        <div className="w-px h-4 bg-border mx-1 shrink-0" />

        <input
          value={layoutName}
          onChange={(e) => setLayoutName(e.target.value)}
          onBlur={(e) => { if (!e.target.value.trim()) setLayoutName("Nouveau layout"); }}
          className="text-xs bg-transparent border-none outline-none font-medium w-44 hover:bg-accent/50 focus:bg-accent px-1.5 py-0.5 rounded transition-colors min-w-0"
        />

        <div className="ml-auto flex items-center gap-2 shrink-0">

          <button
            onClick={toggleHappiness}
            className={`flex items-center gap-1.5 px-2 py-1 text-xs rounded border transition-colors ${
              showHappiness
                ? "bg-yellow-500/15 border-yellow-500/40 text-yellow-600 dark:text-yellow-400"
                : "bg-background border-border text-muted-foreground hover:bg-accent"
            }`}
          >
            ★ Happiness
          </button>

          <button
            onClick={() => setShowStats((s) => !s)}
            className={`flex items-center gap-1 px-2 py-1 text-xs rounded border transition-colors ${
              showStats
                ? "bg-primary/10 border-primary/40 text-primary"
                : "bg-background border-border text-muted-foreground hover:bg-accent"
            }`}
          >
            📊 Stats
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-1.5 px-3 py-1 text-xs rounded bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors font-medium"
          >
            {saving ? "Sauvegarde…" : "↑ Sauvegarder"}
          </button>
        </div>
      </div>

      {/* ── Corps ────────────────────────────────────────────────────── */}
      <div className="flex flex-1 min-h-0">

        <aside className="w-64 shrink-0 border-r bg-background flex flex-col">
          <div className="flex-1 min-h-0 overflow-y-auto">
            <BuildingSelector />
          </div>
          <div className="p-2 border-t">
            <CommandBar />
          </div>
        </aside>

        <main className="flex-1 min-w-0 min-h-0 relative bg-stone-100 dark:bg-stone-900">
          <CityCanvas />
        </main>

        {showStats && (
          <aside className="w-56 shrink-0 border-l bg-background">
            <StatsPanel />
          </aside>
        )}

      </div>
    </div>
  );
}