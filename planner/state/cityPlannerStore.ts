"use client";

import { create } from "zustand";
import { CityMapState } from "@/planner/core/cityMapState";
import { CommandManager } from "@/planner/core/commandManager";
import {
  validatePlacement,
  buildPlacementContext,
} from "@/planner/core/placementValidator";
import { clampToGrid, gridRectContainsPoint } from "@/planner/core/mapGrid";
import type { GridPoint, GridRect } from "@/planner/core/mapGrid";
import type { CityMapEntity } from "@/planner/core/cityMapEntity";
import {
  createEntityFromBuilding,
  createGhostEntity,
  getBuildingSize,
} from "@/planner/utils/entityFactory";

export type CityTool = "select" | "place" | "delete" | "move";

export interface CityPlannerCoreState {
  mapState: CityMapState;
  ghostEntity: CityMapEntity | null;
  hoveredCell: GridPoint | null;
  ghostIsValid: boolean;
  draggingEntity: CityMapEntity | null;
  dragOrigin: GridPoint | null;
}

// ── Singletons hors React ────────────────────────────────────────────────────
const _mapState = new CityMapState();
const _commandMgr = new CommandManager();
const _coreState: CityPlannerCoreState = {
  mapState: _mapState,
  ghostEntity: null,
  hoveredCell: null,
  ghostIsValid: false,
  draggingEntity: null,
  dragOrigin: null,
};
let _mapBounds: GridRect = { x: 0, y: 0, w: 52, h: 52 };
/** Dernière cellule connue sur le canvas — persist même quand la souris quitte le canvas */
let _lastCanvasCell: GridPoint | null = null;
export function setMapBounds(b: GridRect) {
  _mapBounds = b;
}

function findEntityAt(cell: GridPoint): CityMapEntity | undefined {
  for (const entity of _mapState.entities.values()) {
    if (gridRectContainsPoint(entity.bounds, cell)) return entity;
  }
}

function updateGhost(
  id: string | null,
  cell: GridPoint | null,
  rotated: boolean,
): void {
  if (!id || !cell) {
    _coreState.ghostEntity = null;
    _coreState.ghostIsValid = false;
    return;
  }
  const size = getBuildingSize(id);
  const eff = rotated ? { w: size.h, h: size.w } : size;
  const loc = clampToGrid(cell, eff, _mapBounds);
  const ghost = createGhostEntity(id, loc, rotated);
  const res = validatePlacement(
    ghost,
    buildPlacementContext(_mapBounds, _mapState.entities),
    0,
  );
  _coreState.ghostEntity = ghost;
  _coreState.ghostIsValid = res.valid;
}

interface CityPlannerStore {
  stateRef: { current: CityPlannerCoreState };
  selectedBuildingId: string | null;
  activeTool: CityTool;
  canUndo: boolean;
  canRedo: boolean;
  entityCount: number;
  ghostRotated: boolean;
  selectedEntity: CityMapEntity | null;
  /** true pendant un drag d'entité — safe à lire dans le render */
  isDraggingEntity: boolean;

  selectBuilding: (id: string | null) => void;
  setTool: (tool: CityTool) => void;
  updateHover: (cell: GridPoint | null) => void;
  placeAtCell: (loc: GridPoint) => void;
  deleteAtCell: (loc: GridPoint) => void;
  deleteEntity: (id: number) => void;
  selectEntityAt: (cell: GridPoint) => void;
  deselectEntity: () => void;
  startDrag: (cell: GridPoint) => boolean;
  updateDrag: (cell: GridPoint) => void;
  endDrag: () => void;
  toggleGhostRotation: () => void;
  rotateSelectedEntity: () => void;
  /** Rotation de l'entité pendant un drag (touche R) */
  rotateDraggingEntity: () => void;
  undo: () => void;
  redo: () => void;
  clearAll: () => void;
}

export const useCityPlannerStore = create<CityPlannerStore>((set, get) => {
  _commandMgr.onChanged = () =>
    set({
      canUndo: _commandMgr.canUndo,
      canRedo: _commandMgr.canRedo,
      entityCount: _mapState.size,
    });

  return {
    stateRef: { current: _coreState },
    selectedBuildingId: null,
    activeTool: "select",
    canUndo: false,
    canRedo: false,
    entityCount: 0,
    ghostRotated: false,
    selectedEntity: null,
    isDraggingEntity: false,

    selectBuilding: (id) => {
      // Désélectionner l'entité sur la grille quand on choisit un nouveau bâtiment
      set({
        selectedBuildingId: id,
        activeTool: id ? "place" : "select",
        ghostRotated: false,
        selectedEntity: null,
      });
      const cell =
        _coreState.hoveredCell ?? _coreState.ghostEntity?.location ?? null;
      updateGhost(id, cell, false);
    },

    setTool: (tool) => {
      set({ activeTool: tool, selectedEntity: null });
      if (tool !== "place") {
        _coreState.ghostEntity = null;
        _coreState.ghostIsValid = false;
      }
    },

    updateHover: (cell) => {
      if (_coreState.draggingEntity) return;
      _coreState.hoveredCell = cell;
      if (cell) _lastCanvasCell = cell; // mémoriser la dernière position valide
      const { selectedBuildingId, activeTool, ghostRotated } = get();
      if (activeTool === "place" && selectedBuildingId)
        updateGhost(selectedBuildingId, cell, ghostRotated);
    },

    placeAtCell: (loc) => {
      const { selectedBuildingId, activeTool, ghostRotated } = get();
      if (activeTool !== "place" || !selectedBuildingId) return;
      const placeLoc = _coreState.ghostEntity?.location ?? loc;
      const entity = createEntityFromBuilding(
        selectedBuildingId,
        placeLoc,
        ghostRotated,
      );
      const res = validatePlacement(
        entity,
        buildPlacementContext(_mapBounds, _mapState.entities),
      );
      if (!res.valid) return;
      _commandMgr.execute(_commandMgr.createPlaceCommand(_mapState, entity));
    },

    deleteAtCell: (loc) => {
      if (get().activeTool !== "delete") return;
      const entity = findEntityAt(loc);
      if (entity)
        _commandMgr.execute(_commandMgr.createDeleteCommand(_mapState, entity));
    },

    deleteEntity: (id) => {
      const entity = _mapState.getById(id);
      if (entity)
        _commandMgr.execute(_commandMgr.createDeleteCommand(_mapState, entity));
    },

    selectEntityAt: (cell) => {
      if (get().activeTool !== "select") return;
      set({ selectedEntity: findEntityAt(cell) ?? null });
    },

    deselectEntity: () => set({ selectedEntity: null }),

    startDrag: (cell) => {
      const tool = get().activeTool;
      if (tool !== "move" && tool !== "select") return false;
      const entity = findEntityAt(cell);
      if (!entity) return false;
      _mapState.remove(entity.id);
      _coreState.draggingEntity = entity;
      _coreState.dragOrigin = entity.location;
      _coreState.ghostEntity = entity;
      _coreState.ghostIsValid = true;
      set({ isDraggingEntity: true });
      return true;
    },

    updateDrag: (cell) => {
      const { draggingEntity } = _coreState;
      if (!draggingEntity) return;
      const loc = clampToGrid(cell, draggingEntity.effectiveSize, _mapBounds);
      const moved = draggingEntity.moveTo(loc);
      const res = validatePlacement(
        moved,
        buildPlacementContext(_mapBounds, _mapState.entities),
      );
      _coreState.draggingEntity = moved;
      _coreState.ghostEntity = moved;
      _coreState.ghostIsValid = res.valid;
    },

    endDrag: () => {
      const { draggingEntity, dragOrigin } = _coreState;
      if (!draggingEntity || !dragOrigin) return;
      const res = validatePlacement(
        draggingEntity,
        buildPlacementContext(_mapBounds, _mapState.entities),
      );
      const final = res.valid
        ? draggingEntity
        : draggingEntity.moveTo(dragOrigin);
      _mapState.add(final);
      if (
        res.valid &&
        (final.location.x !== dragOrigin.x || final.location.y !== dragOrigin.y)
      ) {
        const { id } = final;
        const from = dragOrigin,
          to = final.location;
        _commandMgr.execute({
          execute: () => _mapState.move(id, to),
          undo: () => _mapState.move(id, from),
        });
      }
      _coreState.draggingEntity = null;
      _coreState.dragOrigin = null;
      _coreState.ghostEntity = null;
      _coreState.ghostIsValid = false;
      const wasSelected = get().selectedEntity?.id === final.id;
      set({
        isDraggingEntity: false,
        ...(wasSelected ? { selectedEntity: final } : {}),
      });
    },

    rotateSelectedEntity: () => {
      const { selectedEntity } = get();
      if (!selectedEntity) return;
      const rotated = selectedEntity.rotate();
      // Valider la nouvelle position avec la rotation
      const res = validatePlacement(
        rotated,
        buildPlacementContext(_mapBounds, _mapState.entities),
        selectedEntity.id, // ignorer l'entité elle-même
      );
      if (!res.valid) return;
      _commandMgr.execute(
        _commandMgr.createRotateCommand(_mapState, selectedEntity),
      );
      set({ selectedEntity: rotated });
    },

    rotateDraggingEntity: () => {
      const { draggingEntity } = _coreState;
      if (!draggingEntity) return;
      const rotated = draggingEntity.rotate();
      // Reclamper à la position actuelle avec la nouvelle taille
      const loc = clampToGrid(
        rotated.location,
        rotated.effectiveSize,
        _mapBounds,
      );
      const moved = rotated.moveTo(loc);
      const res = validatePlacement(
        moved,
        buildPlacementContext(_mapBounds, _mapState.entities),
      );
      _coreState.draggingEntity = moved;
      _coreState.ghostEntity = moved;
      _coreState.ghostIsValid = res.valid;
    },

    toggleGhostRotation: () => {
      const { selectedBuildingId, activeTool } = get();
      if (activeTool !== "place" || !selectedBuildingId) return;
      const r = !get().ghostRotated;
      set({ ghostRotated: r });
      // Priorité : cellule survolée > dernier ghost > dernière position connue sur le canvas
      const cell =
        _coreState.hoveredCell ??
        _coreState.ghostEntity?.location ??
        _lastCanvasCell ??
        null;
      if (cell) updateGhost(selectedBuildingId, cell, r);
    },

    undo: () => _commandMgr.undo(),
    redo: () => _commandMgr.redo(),

    clearAll: () => {
      _mapState.clear();
      _commandMgr.reset();
      Object.assign(_coreState, {
        ghostEntity: null,
        hoveredCell: null,
        draggingEntity: null,
        dragOrigin: null,
      });
      set({
        canUndo: false,
        canRedo: false,
        entityCount: 0,
        ghostRotated: false,
        selectedEntity: null,
        isDraggingEntity: false,
      });
    },
  };
});

export const useSelectedBuilding = () =>
  useCityPlannerStore((s) => s.selectedBuildingId);
export const useActiveTool = () => useCityPlannerStore((s) => s.activeTool);
export const useCanUndo = () => useCityPlannerStore((s) => s.canUndo);
export const useCanRedo = () => useCityPlannerStore((s) => s.canRedo);
export const useEntityCount = () => useCityPlannerStore((s) => s.entityCount);
export const useCoreStateRef = () => useCityPlannerStore((s) => s.stateRef);
export const useGhostRotated = () => useCityPlannerStore((s) => s.ghostRotated);
export const useSelectedEntity = () =>
  useCityPlannerStore((s) => s.selectedEntity);
export const useIsDraggingEntity = () =>
  useCityPlannerStore((s) => s.isDraggingEntity);
