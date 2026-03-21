"use client";

import {
  useCityPlannerStore,
  useCanUndo,
  useCanRedo,
} from "@/planner/state/cityPlannerStore";

export function CommandBar() {
  const canUndo = useCanUndo();
  const canRedo = useCanRedo();
  const undo = useCityPlannerStore((s) => s.undo);
  const redo = useCityPlannerStore((s) => s.redo);
  const clearAll = useCityPlannerStore((s) => s.clearAll);

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={undo}
        disabled={!canUndo}
        className="flex-1 py-1.5 text-xs rounded border bg-background hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        ↩ Undo
      </button>
      <button
        onClick={redo}
        disabled={!canRedo}
        className="flex-1 py-1.5 text-xs rounded border bg-background hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        ↪ Redo
      </button>
      <button
        onClick={() => {
          if (confirm("Vider la grille ?")) clearAll();
        }}
        className="py-1.5 px-2 text-xs rounded border bg-background hover:bg-destructive hover:text-destructive-foreground transition-colors"
      >
        ✕
      </button>
    </div>
  );
}
