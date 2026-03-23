'use client';

import { create } from 'zustand';
import { CityMapState }           from '@/planner/core/cityMapState';
import { CommandManager }         from '@/planner/core/commandManager';
import { validatePlacement, buildPlacementContext } from '@/planner/core/placementValidator';
import { clampToGrid, gridRectContainsPoint }       from '@/planner/core/mapGrid';
import type { GridPoint, GridRect }                 from '@/planner/core/mapGrid';
import type { CityMapEntity }                       from '@/planner/core/cityMapEntity';
import { createEntityFromBuilding, createGhostEntity, getBuildingSize } from '@/planner/utils/entityFactory';
import {
  getDefaultUnlockedExpansions,
  getAllExpansionRects,
  getPlayableGridBounds,
  findExpansionAtCell,
  type ExpansionGridRect,
} from '@/planner/core/expansionManager';
import { buildMaxQtyMap }         from '@/planner/utils/costBridge';
import { SpatialEntityIndex }     from '@/planner/core/spatialEntityIndex';
import type { EraCode }           from '@/types/shared';
import type { CityId }            from '@/planner/data/cityGridDefinitions';
import { FIXED_BUILDINGS, type FixedBuilding } from '@/planner/data/buildingDefinitions';

export type CityTool = 'select' | 'place' | 'delete' | 'move';

export interface CityPlannerCoreState {
  mapState:       CityMapState;
  ghostEntity:    CityMapEntity | null;
  hoveredCell:    GridPoint | null;
  ghostIsValid:   boolean;
  draggingEntity: CityMapEntity | null;
  dragOrigin:     GridPoint | null;
}

// ── Singletons hors React ────────────────────────────────────────────────────

const _mapState    = new CityMapState();
const _commandMgr  = new CommandManager();
const _coreState: CityPlannerCoreState = {
  mapState: _mapState, ghostEntity: null, hoveredCell: null,
  ghostIsValid: false, draggingEntity: null, dragOrigin: null,
};

/**
 * Singleton CityMapState exposé pour CityCanvas.
 * Permet d'initialiser canvasState sans lire un ref pendant le render
 * (interdit par React 19).
 */
export { _mapState as cityMapStateSingleton };

/**
 * Singleton _coreState exposé pour CityCanvas.
 * draw() lit ghostEntity/ghostIsValid depuis ici directement car ces
 * champs sont mutés hors Zustand set() et ne déclenchent pas le subscribe.
 */
export { _coreState as cityCoreSingleton };

let _mapBounds: GridRect           = { x: 0, y: 0, w: 52, h: 52 };
let _lastCanvasCell: GridPoint | null = null;
let _maxQtyMap: Map<string, number>   = buildMaxQtyMap('LG');
let _expansionRects: ExpansionGridRect[]  = getAllExpansionRects('City_Capital');
let _unlockedExpansions: Set<string>      = getDefaultUnlockedExpansions('City_Capital');
let _permanentlyUnlocked: Set<string>     = getDefaultUnlockedExpansions('City_Capital');

// ── Index spatial ────────────────────────────────────────────────────────────
// Remplace les parcours O(n) par des lookups O(1)

const _spatialIndex = new SpatialEntityIndex(52);

// ─────────────────────────────────────────────────────────────────────────────

function _buildCtx(expansionRects: ExpansionGridRect[], unlockedExpansions: Set<string>) {
  return buildPlacementContext(
    _mapBounds,
    _mapState.entities,
    _maxQtyMap,
    expansionRects,
    unlockedExpansions,
  );
}

export function setMapBounds(b: GridRect) { _mapBounds = b; }

// Remplacé par _spatialIndex.findAt() — gardé pour rétro-compatibilité interne
function findEntityAt(cell: GridPoint): CityMapEntity | undefined {
  return _spatialIndex.findAt(cell);
}

function updateGhost(id: string | null, cell: GridPoint | null, rotated: boolean): void {
  if (!id || !cell) { _coreState.ghostEntity = null; _coreState.ghostIsValid = false; return; }
  const size = getBuildingSize(id);
  const eff  = rotated ? { w: size.h, h: size.w } : size;
  const loc  = clampToGrid(cell, eff, _mapBounds);
  const ghost = createGhostEntity(id, loc, rotated);

  // Validation : utilise hasCollision via le contexte (qui itère encore sur entities)
  // Optimisation possible phase 2 : passer _spatialIndex directement à validatePlacement
  const res   = validatePlacement(ghost, _buildCtx(_expansionRects, _unlockedExpansions), 0);
  _coreState.ghostEntity  = ghost;
  _coreState.ghostIsValid = res.valid;
}

// ─────────────────────────────────────────────────────────────────────────────
// Store interface
// ─────────────────────────────────────────────────────────────────────────────

interface CityPlannerStore {
  stateRef:           { current: CityPlannerCoreState };
  selectedBuildingId: string | null;
  activeTool:         CityTool;
  canUndo:            boolean;
  canRedo:            boolean;
  entityCount:        number;
  ghostRotated:       boolean;
  selectedEntity:     CityMapEntity | null;
  isDraggingEntity:   boolean;
  currentEra:         EraCode;
  showHappiness:      boolean;
  activeLayoutId:     string | null;
  activeCityId:       string | null;
  currentCityId:      CityId;
  unlockedExpansions: Set<string>;
  expansionRects:     ExpansionGridRect[];
  fixedBuildings:     FixedBuilding[];

  selectBuilding:       (id: string | null) => void;
  setTool:              (tool: CityTool) => void;
  setEra:               (era: EraCode) => void;
  toggleHappiness:      () => void;
  updateHover:          (cell: GridPoint | null) => void;
  placeAtCell:          (loc: GridPoint) => void;
  deleteAtCell:         (loc: GridPoint) => void;
  deleteEntity:         (id: number) => void;
  selectEntityAt:       (cell: GridPoint) => void;
  deselectEntity:       () => void;
  startDrag:            (cell: GridPoint) => boolean;
  updateDrag:           (cell: GridPoint) => void;
  endDrag:              () => void;
  toggleGhostRotation:  () => void;
  rotateSelectedEntity: () => void;
  rotateDraggingEntity: () => void;
  setActiveLayoutId:    (id: string | null) => void;
  setActiveCityId:      (id: string | null) => void;
  setCurrentCity:       (cityId: CityId) => void;
  toggleExpansion:      (expansionId: string) => void;
  undo:                 () => void;
  redo:                 () => void;
  clearAll:             () => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// Store
// ─────────────────────────────────────────────────────────────────────────────

export const useCityPlannerStore = create<CityPlannerStore>((set, get) => {
  _commandMgr.onChanged = () => set({
    canUndo:     _commandMgr.canUndo,
    canRedo:     _commandMgr.canRedo,
    entityCount: _mapState.size,
  });

  return {
    stateRef:           { current: _coreState },
    selectedBuildingId: null,
    activeTool:         'select',
    canUndo:            false,
    canRedo:            false,
    entityCount:        0,
    ghostRotated:       false,
    selectedEntity:     null,
    isDraggingEntity:   false,
    currentEra:         'LG' as EraCode,
    showHappiness:      true,
    activeLayoutId:     null,
    activeCityId:       null,
    currentCityId:      'City_Capital' as CityId,
    unlockedExpansions: getDefaultUnlockedExpansions('City_Capital'),
    expansionRects:     getAllExpansionRects('City_Capital'),
    fixedBuildings:     FIXED_BUILDINGS['City_Capital'] ?? [],

    // ── selectBuilding ──────────────────────────────────────────────────────
    selectBuilding: (id) => {
      set({ selectedBuildingId: id, activeTool: id ? 'place' : 'select', ghostRotated: false, selectedEntity: null });
      const cell = _coreState.hoveredCell ?? _coreState.ghostEntity?.location ?? null;
      updateGhost(id, cell, false);
    },

    // ── setTool ─────────────────────────────────────────────────────────────
    setTool: (tool) => {
      set({ activeTool: tool, selectedEntity: null });
      if (tool !== 'place') { _coreState.ghostEntity = null; _coreState.ghostIsValid = false; }
    },

    // ── setEra ──────────────────────────────────────────────────────────────
    setEra: (era) => {
      _maxQtyMap = buildMaxQtyMap(era);
      set({ currentEra: era });
    },

    // ── toggleHappiness ─────────────────────────────────────────────────────
    toggleHappiness: () => set(s => ({ showHappiness: !s.showHappiness })),

    // ── navigation ──────────────────────────────────────────────────────────
    setActiveLayoutId: (id) => set({ activeLayoutId: id }),
    setActiveCityId:   (id) => set({ activeCityId: id }),

    // ── setCurrentCity ──────────────────────────────────────────────────────
    setCurrentCity: (cityId) => {
      const rects    = getAllExpansionRects(cityId);
      const unlocked = getDefaultUnlockedExpansions(cityId);
      const bounds   = getPlayableGridBounds(cityId);
      _mapBounds           = { x: 0, y: 0, w: bounds.w, h: bounds.h };
      _expansionRects      = rects;
      _unlockedExpansions  = new Set(unlocked);
      _permanentlyUnlocked = new Set(unlocked);
      // Reconstruire l'index spatial pour la nouvelle taille de grille
      _spatialIndex.rebuild(_mapState.entities);
      set({
        currentCityId:      cityId,
        unlockedExpansions: new Set(unlocked),
        expansionRects:     rects,
        fixedBuildings:     FIXED_BUILDINGS[cityId] ?? [],
      });
    },

    // ── toggleExpansion ─────────────────────────────────────────────────────
    toggleExpansion: (expansionId) => {
      if (_permanentlyUnlocked.has(expansionId)) return;
      const next = new Set(_unlockedExpansions);
      if (next.has(expansionId)) next.delete(expansionId);
      else next.add(expansionId);
      _unlockedExpansions = next;
      set({ unlockedExpansions: next });
    },

    // ── updateHover ─────────────────────────────────────────────────────────
    updateHover: (cell) => {
      if (_coreState.draggingEntity) return;
      _coreState.hoveredCell = cell;
      if (cell) _lastCanvasCell = cell;
      const { selectedBuildingId, activeTool, ghostRotated } = get();
      if (activeTool === 'place' && selectedBuildingId) updateGhost(selectedBuildingId, cell, ghostRotated);
    },

    // ── placeAtCell ─────────────────────────────────────────────────────────
    placeAtCell: (loc) => {
      const { selectedBuildingId, activeTool, ghostRotated } = get();
      if (activeTool !== 'place' || !selectedBuildingId) return;
      const placeLoc = _coreState.ghostEntity?.location ?? loc;
      const entity   = createEntityFromBuilding(selectedBuildingId, placeLoc, ghostRotated);
      const res      = validatePlacement(entity, _buildCtx(_expansionRects, _unlockedExpansions));
      if (!res.valid) return;
      _commandMgr.execute({
        execute: () => { _mapState.add(entity); _spatialIndex.add(entity); },
        undo:    () => { _mapState.remove(entity.id); _spatialIndex.remove(entity.id); },
      });
    },

    // ── deleteAtCell ────────────────────────────────────────────────────────
    deleteAtCell: (loc) => {
      if (get().activeTool !== 'delete') return;
      // O(1) via index spatial
      const entity = _spatialIndex.findAt(loc);
      if (entity) {
        _commandMgr.execute({
          execute: () => { _mapState.remove(entity.id); _spatialIndex.remove(entity.id); },
          undo:    () => { _mapState.add(entity); _spatialIndex.add(entity); },
        });
      }
    },

    // ── deleteEntity ────────────────────────────────────────────────────────
    deleteEntity: (id) => {
      const entity = _mapState.getById(id);
      if (entity) {
        _commandMgr.execute({
          execute: () => { _mapState.remove(entity.id); _spatialIndex.remove(entity.id); },
          undo:    () => { _mapState.add(entity); _spatialIndex.add(entity); },
        });
      }
    },

    // ── selectEntityAt ──────────────────────────────────────────────────────
    selectEntityAt: (cell) => {
      if (get().activeTool !== 'select') return;
      // O(1) via index spatial
      set({ selectedEntity: _spatialIndex.findAt(cell) ?? null });
    },

    // ── deselectEntity ──────────────────────────────────────────────────────
    deselectEntity: () => set({ selectedEntity: null }),

    // ── startDrag ───────────────────────────────────────────────────────────
    startDrag: (cell) => {
      const tool = get().activeTool;
      if (tool !== 'move' && tool !== 'select') return false;
      // O(1) via index spatial
      const entity = _spatialIndex.findAt(cell);
      if (!entity) return false;
      // Retirer de la carte ET de l'index pendant le drag
      _mapState.remove(entity.id);
      _spatialIndex.remove(entity.id);
      _coreState.draggingEntity = entity;
      _coreState.dragOrigin     = entity.location;
      _coreState.ghostEntity    = entity;
      _coreState.ghostIsValid   = true;
      set({ isDraggingEntity: true });
      return true;
    },

    // ── updateDrag ──────────────────────────────────────────────────────────
    updateDrag: (cell) => {
      const { draggingEntity } = _coreState;
      if (!draggingEntity) return;
      const loc   = clampToGrid(cell, draggingEntity.effectiveSize, _mapBounds);
      const moved = draggingEntity.moveTo(loc);
      const res   = validatePlacement(moved, _buildCtx(_expansionRects, _unlockedExpansions));
      _coreState.draggingEntity = moved;
      _coreState.ghostEntity    = moved;
      _coreState.ghostIsValid   = res.valid;
    },

    // ── endDrag ─────────────────────────────────────────────────────────────
    endDrag: () => {
      const { draggingEntity, dragOrigin } = _coreState;
      if (!draggingEntity || !dragOrigin) return;
      const res   = validatePlacement(draggingEntity, _buildCtx(_expansionRects, _unlockedExpansions));
      const final = res.valid ? draggingEntity : draggingEntity.moveTo(dragOrigin);
      // Remettre dans la carte ET dans l'index
      _mapState.add(final);
      _spatialIndex.add(final);
      if (res.valid && (final.location.x !== dragOrigin.x || final.location.y !== dragOrigin.y)) {
        const { id } = final;
        const from = dragOrigin, to = final.location;
        _commandMgr.execute({
          execute: () => { _mapState.move(id, to);   _spatialIndex.update(final.moveTo(to)); },
          undo:    () => { _mapState.move(id, from);  _spatialIndex.update(final.moveTo(from)); },
        });
      }
      _coreState.draggingEntity = null;
      _coreState.dragOrigin     = null;
      _coreState.ghostEntity    = null;
      _coreState.ghostIsValid   = false;
      const wasSelected = get().selectedEntity?.id === final.id;
      set({ isDraggingEntity: false, ...(wasSelected ? { selectedEntity: final } : {}) });
    },

    // ── rotateSelectedEntity ────────────────────────────────────────────────
    rotateSelectedEntity: () => {
      const { selectedEntity } = get();
      if (!selectedEntity) return;
      const rotated = selectedEntity.rotate();
      const res = validatePlacement(
        rotated,
        _buildCtx(_expansionRects, _unlockedExpansions),
        selectedEntity.id,
      );
      if (!res.valid) return;
      _commandMgr.execute({
        execute: () => { _mapState.replace(selectedEntity.id, rotated); _spatialIndex.update(rotated); },
        undo:    () => { _mapState.replace(selectedEntity.id, selectedEntity); _spatialIndex.update(selectedEntity); },
      });
      set({ selectedEntity: rotated });
    },

    // ── rotateDraggingEntity ────────────────────────────────────────────────
    rotateDraggingEntity: () => {
      const { draggingEntity } = _coreState;
      if (!draggingEntity) return;
      const rotated = draggingEntity.rotate();
      const loc     = clampToGrid(rotated.location, rotated.effectiveSize, _mapBounds);
      const moved   = rotated.moveTo(loc);
      const res     = validatePlacement(moved, _buildCtx(_expansionRects, _unlockedExpansions));
      _coreState.draggingEntity = moved;
      _coreState.ghostEntity    = moved;
      _coreState.ghostIsValid   = res.valid;
    },

    // ── toggleGhostRotation ─────────────────────────────────────────────────
    toggleGhostRotation: () => {
      const { selectedBuildingId, activeTool } = get();
      if (activeTool !== 'place' || !selectedBuildingId) return;
      const r = !get().ghostRotated;
      set({ ghostRotated: r });
      const cell = _coreState.hoveredCell
        ?? _coreState.ghostEntity?.location
        ?? _lastCanvasCell
        ?? null;
      if (cell) updateGhost(selectedBuildingId, cell, r);
    },

    // ── undo / redo ─────────────────────────────────────────────────────────
    undo: () => {
      _commandMgr.undo();
      // Reconstruire l'index après undo (commandes custom gèrent le spatial,
      // mais undo/redo inverse les opérations — rebuild est le plus sûr)
      _spatialIndex.rebuild(_mapState.entities);
    },

    redo: () => {
      _commandMgr.redo();
      _spatialIndex.rebuild(_mapState.entities);
    },

    // ── clearAll ────────────────────────────────────────────────────────────
    clearAll: () => {
      _mapState.clear();
      _commandMgr.reset();
      _spatialIndex.rebuild(_mapState.entities); // vide l'index
      Object.assign(_coreState, {
        ghostEntity: null, hoveredCell: null,
        draggingEntity: null, dragOrigin: null,
      });
      set({
        canUndo: false, canRedo: false, entityCount: 0,
        ghostRotated: false, selectedEntity: null, isDraggingEntity: false,
      });
    },
  };
});

// ─────────────────────────────────────────────────────────────────────────────
// Selectors
// ─────────────────────────────────────────────────────────────────────────────

export const useSelectedBuilding   = () => useCityPlannerStore(s => s.selectedBuildingId);
export const useActiveTool         = () => useCityPlannerStore(s => s.activeTool);
export const useCanUndo            = () => useCityPlannerStore(s => s.canUndo);
export const useCanRedo            = () => useCityPlannerStore(s => s.canRedo);
export const useEntityCount        = () => useCityPlannerStore(s => s.entityCount);
export const useCoreStateRef       = () => useCityPlannerStore(s => s.stateRef);
export const useGhostRotated       = () => useCityPlannerStore(s => s.ghostRotated);
export const useSelectedEntity     = () => useCityPlannerStore(s => s.selectedEntity);
export const useIsDraggingEntity   = () => useCityPlannerStore(s => s.isDraggingEntity);
export const useCurrentEra         = () => useCityPlannerStore(s => s.currentEra);
export const useShowHappiness      = () => useCityPlannerStore(s => s.showHappiness);
export const useCurrentCityId      = () => useCityPlannerStore(s => s.currentCityId);
export const useExpansionRects     = () => useCityPlannerStore(s => s.expansionRects);
export const useUnlockedExpansions = () => useCityPlannerStore(s => s.unlockedExpansions);
export const useFixedBuildings     = () => useCityPlannerStore(s => s.fixedBuildings);