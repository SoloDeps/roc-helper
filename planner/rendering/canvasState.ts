// ─────────────────────────────────────────────────────────────────────────────
// canvasState.ts
// Agrégateur d'état canvas — ZÉRO React, ZÉRO re-render
//
// Principe : le canvas ne lit QUE depuis ce ref.
// React met à jour ce ref via syncToCanvasRef() sans provoquer de re-render
// du composant canvas.
//
// Pattern identique au latestStateRef d'isometric-city :
//   latestStateRef.current = state; (GameContext.tsx:715)
// ─────────────────────────────────────────────────────────────────────────────

import type { CityMapEntity }    from '../core/cityMapEntity';
import type { Viewport }         from './viewportManager';
import type { ExpansionGridRect } from '../core/expansionManager';
import type { FixedBuilding }    from '../data/buildingDefinitions';
import type { CityTool }         from '../state/cityPlannerStore';
import type { CityMapState }     from '../core/cityMapState';
import { buildPlayableTileSet }  from './gridRenderer';
import { createInitialViewport } from './viewportManager';

// ─────────────────────────────────────────────────────────────────────────────
// Type principal
// ─────────────────────────────────────────────────────────────────────────────

export interface CanvasRenderState {
  // ── Viewport (muté directement par le canvas, jamais par React) ────────────
  viewport: Viewport;

  // ── État de la carte (singleton hors React) ────────────────────────────────
  mapState: CityMapState;
  // Note : ghostEntity/ghostIsValid sont lus directement depuis cityCoreSingleton
  // dans draw(). Ils ne transitent PAS par csRef car ils sont mutés hors Zustand.

  // ── Sélection / interaction ────────────────────────────────────────────────
  selectedEntity: CityMapEntity | null;
  activeTool: CityTool;
  showHappiness: boolean;

  // ── Expansions (mis à jour uniquement au changement de ville/unlock) ────────
  expansionRects: ExpansionGridRect[];
  unlockedExpansions: Set<string>;
  /**
   * Set pré-calculé des clés de tuiles jouables.
   * Recalculé uniquement quand expansionRects change.
   * Évite buildPlayableTileSet() à chaque frame.
   */
  playableTileSet: Set<number> | undefined;

  // ── Bâtiments fixes (statiques par ville) ─────────────────────────────────
  fixedBuildings: FixedBuilding[];

  // ── Dirty flags ────────────────────────────────────────────────────────────
  /**
   * true → le RAF appelle draw() à la prochaine frame.
   * Positionné à true par tout changement d'état ou input.
   * Remis à false après draw().
   */
  needsRedraw: boolean;

  /**
   * true → le cache OffscreenCanvas de la grille est invalide.
   * Positionné à true sur : zoom, pan, changement de playableTileSet.
   * Remis à false après reconstruction du cache.
   */
  gridCacheDirty: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// Factory
// ─────────────────────────────────────────────────────────────────────────────

export function createCanvasRenderState(mapState: CityMapState): CanvasRenderState {
  return {
    viewport:          createInitialViewport(800, 600, 52, 52, 0.8),
    mapState,
    selectedEntity:    null,
    activeTool:        'select',
    showHappiness:     true,
    expansionRects:    [],
    unlockedExpansions: new Set(),
    playableTileSet:   undefined,
    fixedBuildings:    [],
    needsRedraw:       true,
    gridCacheDirty:    true,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Payload de sync Zustand → CanvasRenderState
// ─────────────────────────────────────────────────────────────────────────────

export interface CanvasSyncPayload {
  selectedEntity:     CityMapEntity | null;
  activeTool:         CityTool;
  showHappiness:      boolean;
  expansionRects:     ExpansionGridRect[];
  unlockedExpansions: Set<string>;
  fixedBuildings:     FixedBuilding[];
  // Note : ghost non inclus — lu directement depuis cityCoreSingleton dans draw()
}

/**
 * Met à jour le CanvasRenderState depuis les valeurs Zustand.
 * Marque needsRedraw = true si quelque chose a changé.
 * Marque gridCacheDirty = true si les expansions ont changé.
 *
 * ⚠️  Appeler uniquement depuis useEffect/subscribe — JAMAIS dans le RAF.
 */
export function syncToCanvasRef(
  ref:     CanvasRenderState,
  payload: CanvasSyncPayload,
): void {
  let changed           = false;
  let expansionsChanged = false;

  if (ref.selectedEntity !== payload.selectedEntity) {
    ref.selectedEntity = payload.selectedEntity;
    changed = true;
  }
  if (ref.activeTool !== payload.activeTool) {
    ref.activeTool = payload.activeTool;
    changed = true;
  }
  if (ref.showHappiness !== payload.showHappiness) {
    ref.showHappiness = payload.showHappiness;
    changed = true;
  }
  if (ref.fixedBuildings !== payload.fixedBuildings) {
    ref.fixedBuildings = payload.fixedBuildings;
    changed = true;
  }
  // Expansions : comparaison de référence (Zustand recrée le Set à chaque toggle)
  if (ref.expansionRects !== payload.expansionRects) {
    ref.expansionRects  = payload.expansionRects;
    ref.playableTileSet = payload.expansionRects.length > 0
      ? buildPlayableTileSet(payload.expansionRects)
      : undefined;
    expansionsChanged = true;
    changed = true;
  }
  if (ref.unlockedExpansions !== payload.unlockedExpansions) {
    ref.unlockedExpansions = payload.unlockedExpansions;
    expansionsChanged = true;
    changed = true;
  }

  if (changed)           ref.needsRedraw   = true;
  if (expansionsChanged) ref.gridCacheDirty = true;
}