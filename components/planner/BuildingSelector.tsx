"use client";

import {
  useCityPlannerStore,
  useSelectedBuilding,
  useActiveTool,
  useEntityCount,
  useGhostRotated,
  useSelectedEntity,
} from "@/planner/state/cityPlannerStore";

const BUILDINGS_TEST = [
  { id: "smallHome", name: "Small Home", color: "#7C9E6E", size: "2×2" },
  { id: "averageHome", name: "Average Home", color: "#5E8B5A", size: "3×3" },
  {
    id: "luxuriousHome",
    name: "Luxurious Home",
    color: "#3D6B3A",
    size: "3×3",
  },
  { id: "ruralFarm", name: "Rural Farm", color: "#C4A84F", size: "4×3" },
  { id: "domesticFarm", name: "Domestic Farm", color: "#B09040", size: "4×4" },
  {
    id: "compactCulture",
    name: "Compact Culture",
    color: "#7A6CB8",
    size: "2×1",
  },
  {
    id: "moderateCulture",
    name: "Moderate Culture",
    color: "#6958A8",
    size: "2×2",
  },
  { id: "largeCulture", name: "Large Culture", color: "#584898", size: "4×3" },
];

export function BuildingSelector() {
  const selectedId = useSelectedBuilding();
  const activeTool = useActiveTool();
  const entityCount = useEntityCount();
  const ghostRotated = useGhostRotated();
  const selectedEntity = useSelectedEntity(); // lu depuis Zustand, pas depuis une ref
  const selectBuilding = useCityPlannerStore((s) => s.selectBuilding);
  const setTool = useCityPlannerStore((s) => s.setTool);
  const toggleRotation = useCityPlannerStore((s) => s.toggleGhostRotation);
  const deleteEntity = useCityPlannerStore((s) => s.deleteEntity);
  const deselectEntity = useCityPlannerStore((s) => s.deselectEntity);
  const rotateSelected = useCityPlannerStore((s) => s.rotateSelectedEntity);

  return (
    <div className="p-3 flex flex-col gap-3">
      <p className="text-xs text-muted-foreground">
        {entityCount} bâtiment{entityCount !== 1 ? "s" : ""} placé
        {entityCount !== 1 ? "s" : ""}
      </p>

      {/* Outils */}
      <div className="flex gap-1 flex-wrap">
        {(["select", "place", "delete", "move"] as const).map((tool) => (
          <button
            key={tool}
            onClick={() => {
              setTool(tool);
              if (tool !== "place") selectBuilding(null);
            }}
            className={`flex-1 py-1 text-xs rounded border capitalize transition-colors ${
              activeTool === tool
                ? "bg-primary text-primary-foreground border-primary"
                : "bg-background hover:bg-accent border-border"
            }`}
          >
            {tool}
          </button>
        ))}
      </div>

      {/* Entité sélectionnée — données lues depuis Zustand directement */}
      {activeTool === "select" && selectedEntity && (
        <div className="rounded border border-primary bg-accent p-2 flex flex-col gap-2">
          <p className="text-xs font-medium text-primary">Sélectionné</p>
          <p className="text-sm font-medium">{selectedEntity.buildingDataId}</p>
          <p className="text-xs text-muted-foreground">
            ({selectedEntity.location.x}, {selectedEntity.location.y}) —{" "}
            {selectedEntity.bounds.w}×{selectedEntity.bounds.h} tuiles
          </p>
          <div className="flex gap-1">
            <button
              onClick={rotateSelected}
              className="flex-1 py-1 text-xs rounded border hover:bg-accent transition-colors"
            >
              ↻ Rotation
            </button>
            <button
              onClick={() => {
                deleteEntity(selectedEntity.id);
                deselectEntity();
              }}
              className="flex-1 py-1 text-xs rounded border border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors"
            >
              Supprimer
            </button>
            <button
              onClick={deselectEntity}
              className="px-2 py-1 text-xs rounded border hover:bg-accent transition-colors"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Hint move */}
      {activeTool === "move" && (
        <p className="text-xs text-muted-foreground rounded border p-2">
          Clique-glisse un bâtiment pour le déplacer
        </p>
      )}

      {/* Rotation */}
      {activeTool === "place" && selectedId && (
        <div className="flex items-center gap-2">
          <button
            onClick={toggleRotation}
            className={`flex-1 py-1 text-xs rounded border transition-colors ${
              ghostRotated
                ? "bg-accent border-primary text-primary"
                : "bg-background border-border hover:bg-accent"
            }`}
          >
            ↻ Rotation {ghostRotated ? "ON" : "OFF"}
          </button>
          <span className="text-xs text-muted-foreground">touche R</span>
        </div>
      )}

      <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider pt-1">
        Bâtiments
      </div>

      <div className="flex flex-col gap-1">
        {BUILDINGS_TEST.map((b) => {
          const isSelected = selectedId === b.id;
          return (
            <button
              key={b.id}
              onClick={() => selectBuilding(isSelected ? null : b.id)}
              className={`flex items-center gap-2 w-full px-2 py-2 rounded text-sm text-left transition-colors ${
                isSelected
                  ? "bg-accent border border-primary"
                  : "hover:bg-accent border border-transparent"
              }`}
            >
              <span
                className="w-4 h-4 rounded shrink-0"
                style={{ backgroundColor: b.color }}
              />
              <span className="flex-1 truncate">{b.name}</span>
              <span className="text-xs text-muted-foreground shrink-0">
                {b.size}
              </span>
              {isSelected && (
                <span className="text-xs text-muted-foreground">✓</span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
