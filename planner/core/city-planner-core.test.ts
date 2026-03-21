// ─────────────────────────────────────────────────────────────────────────────
// city-planner-core.test.ts
// Tests Vitest pour toute la couche core Phase 1
// Lance avec : npx vitest run lib/city-planner/core/city-planner-core.test.ts
// ─────────────────────────────────────────────────────────────────────────────

import { describe, it, expect, beforeEach } from 'vitest';

import {
  TILE_SIZE,
  screenToGrid,
  gridToScreen,
  snapToGrid,
  gridRectIntersects,
  gridRectContains,
  gridRectContainsPoint,
  clampToGrid,
  gridPointEquals,
  type GridPoint,
  type GridRect,
} from './mapGrid';

import {
  CityMapEntity,
  nextEntityId,
  _resetEntityIdCounter,
} from './cityMapEntity';

import {
  validatePlacement,
  countEntitiesByType,
  buildPlacementContext,
} from './placementValidator';

import { CommandManager } from './commandManager';
import { CityMapState } from './cityMapState';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers de test
// ─────────────────────────────────────────────────────────────────────────────

const ZERO_OFFSET = { x: 0, y: 0 };
const ZOOM_1 = 1;

function makeEntity(
  id: number,
  x: number,
  y: number,
  w = 1,
  h = 1,
  rotated = false,
): CityMapEntity {
  return new CityMapEntity(id, 'smallHome', { x, y }, { w, h }, rotated);
}

function makeState(...entities: CityMapEntity[]): CityMapState {
  const state = new CityMapState();
  for (const e of entities) state.add(e);
  return state;
}

const DEFAULT_BOUNDS: GridRect = { x: 0, y: 0, w: 40, h: 40 };

// ─────────────────────────────────────────────────────────────────────────────
// mapGrid.ts
// ─────────────────────────────────────────────────────────────────────────────

describe('mapGrid — conversions', () => {
  it('TILE_SIZE est 64', () => {
    expect(TILE_SIZE).toBe(64);
  });

  // Propriété fondamentale : screenToGrid(gridToScreen(p)) === p
  it('screenToGrid(gridToScreen(p)) === p pour zoom=1, offset=0', () => {
    const points: GridPoint[] = [
      { x: 0, y: 0 },
      { x: 5, y: 3 },
      { x: 39, y: 39 },
      { x: 10, y: 25 },
    ];
    for (const p of points) {
      const screen = gridToScreen(p, ZERO_OFFSET, ZOOM_1);
      const back = screenToGrid(screen, ZERO_OFFSET, ZOOM_1);
      expect(back).toEqual(p);
    }
  });

  it('screenToGrid(gridToScreen(p)) === p pour zoom=2', () => {
    const zoom = 2;
    const p = { x: 7, y: 12 };
    const screen = gridToScreen(p, ZERO_OFFSET, zoom);
    const back = screenToGrid(screen, ZERO_OFFSET, zoom);
    expect(back).toEqual(p);
  });

  it('screenToGrid(gridToScreen(p)) === p avec offset non nul', () => {
    const offset = { x: 150, y: -80 };
    const zoom = 1.5;
    const p = { x: 4, y: 7 };
    const screen = gridToScreen(p, offset, zoom);
    const back = screenToGrid(screen, offset, zoom);
    expect(back).toEqual(p);
  });

  it('gridToScreen — coin supérieur gauche de la tuile (0,0) à zoom=1', () => {
    const s = gridToScreen({ x: 0, y: 0 }, ZERO_OFFSET, ZOOM_1);
    expect(s).toEqual({ x: 0, y: 0 });
  });

  it('gridToScreen — tuile (1,1) à zoom=1 sans offset', () => {
    const s = gridToScreen({ x: 1, y: 1 }, ZERO_OFFSET, ZOOM_1);
    expect(s).toEqual({ x: TILE_SIZE, y: TILE_SIZE });
  });

  it('gridToScreen — tuile (2,3) à zoom=2', () => {
    const s = gridToScreen({ x: 2, y: 3 }, ZERO_OFFSET, 2);
    expect(s).toEqual({ x: 2 * TILE_SIZE * 2, y: 3 * TILE_SIZE * 2 });
  });

  it('screenToGrid — floor correct (pixel au milieu de la tuile)', () => {
    // pixel (80, 80) avec TILE_SIZE=64, zoom=1 → tuile (1,1)
    const g = screenToGrid({ x: 80, y: 80 }, ZERO_OFFSET, ZOOM_1);
    expect(g).toEqual({ x: 1, y: 1 });
  });

  it('screenToGrid — pixel juste avant le bord reste dans la tuile courante', () => {
    // pixel (127, 127) → tuile (1,1) (pas encore 2,2)
    const g = screenToGrid({ x: 127, y: 127 }, ZERO_OFFSET, ZOOM_1);
    expect(g).toEqual({ x: 1, y: 1 });
  });

  it('snapToGrid — snapper un pixel revient sur le coin de la tuile', () => {
    const snapped = snapToGrid({ x: 100, y: 100 }, ZERO_OFFSET, ZOOM_1);
    const tileG = screenToGrid({ x: 100, y: 100 }, ZERO_OFFSET, ZOOM_1);
    const expected = gridToScreen(tileG, ZERO_OFFSET, ZOOM_1);
    expect(snapped).toEqual(expected);
  });
});

// ─────────────────────────────────────────────────────────────────────────────

describe('mapGrid — rectangles', () => {
  // gridRectIntersects
  it('deux rects qui se chevauchent → intersects=true', () => {
    const a: GridRect = { x: 0, y: 0, w: 2, h: 2 };
    const b: GridRect = { x: 1, y: 1, w: 2, h: 2 };
    expect(gridRectIntersects(a, b)).toBe(true);
  });

  it('deux rects adjacents (bord commun) → intersects=false', () => {
    const a: GridRect = { x: 0, y: 0, w: 2, h: 2 };
    const b: GridRect = { x: 2, y: 0, w: 2, h: 2 }; // bord droit de a = bord gauche de b
    expect(gridRectIntersects(a, b)).toBe(false);
  });

  it('deux rects séparés → intersects=false', () => {
    const a: GridRect = { x: 0, y: 0, w: 2, h: 2 };
    const b: GridRect = { x: 5, y: 5, w: 2, h: 2 };
    expect(gridRectIntersects(a, b)).toBe(false);
  });

  it('un rect contenu dans un autre → intersects=true', () => {
    const outer: GridRect = { x: 0, y: 0, w: 5, h: 5 };
    const inner: GridRect = { x: 1, y: 1, w: 2, h: 2 };
    expect(gridRectIntersects(outer, inner)).toBe(true);
  });

  it('intersects est symétrique', () => {
    const a: GridRect = { x: 0, y: 0, w: 3, h: 3 };
    const b: GridRect = { x: 2, y: 2, w: 3, h: 3 };
    expect(gridRectIntersects(a, b)).toBe(gridRectIntersects(b, a));
  });

  it('overlap uniquement sur Y → intersects=true', () => {
    const a: GridRect = { x: 0, y: 0, w: 2, h: 3 };
    const b: GridRect = { x: 0, y: 2, w: 2, h: 2 };
    expect(gridRectIntersects(a, b)).toBe(true);
  });

  // gridRectContains
  it('rect contenu dans outer → contains=true', () => {
    const outer: GridRect = { x: 0, y: 0, w: 10, h: 10 };
    const inner: GridRect = { x: 1, y: 1, w: 3, h: 3 };
    expect(gridRectContains(outer, inner)).toBe(true);
  });

  it('rect identique → contains=true (bords coïncident)', () => {
    const r: GridRect = { x: 0, y: 0, w: 5, h: 5 };
    expect(gridRectContains(r, r)).toBe(true);
  });

  it('rect qui déborde d un pixel → contains=false', () => {
    const outer: GridRect = { x: 0, y: 0, w: 5, h: 5 };
    const inner: GridRect = { x: 4, y: 4, w: 2, h: 2 }; // déborde de 1 en x et y
    expect(gridRectContains(outer, inner)).toBe(false);
  });

  it('rect partiellement hors outer → contains=false', () => {
    const outer: GridRect = { x: 0, y: 0, w: 10, h: 10 };
    const inner: GridRect = { x: -1, y: 0, w: 3, h: 3 };
    expect(gridRectContains(outer, inner)).toBe(false);
  });

  // gridRectContainsPoint
  it('point dans le rect → true', () => {
    const r: GridRect = { x: 2, y: 2, w: 3, h: 3 };
    expect(gridRectContainsPoint(r, { x: 3, y: 3 })).toBe(true);
  });

  it('point sur le bord droit/bas (exclusif) → false', () => {
    const r: GridRect = { x: 0, y: 0, w: 3, h: 3 };
    expect(gridRectContainsPoint(r, { x: 3, y: 0 })).toBe(false);
    expect(gridRectContainsPoint(r, { x: 0, y: 3 })).toBe(false);
  });

  it('point sur le bord gauche/haut (inclusif) → true', () => {
    const r: GridRect = { x: 2, y: 2, w: 3, h: 3 };
    expect(gridRectContainsPoint(r, { x: 2, y: 2 })).toBe(true);
  });

  // clampToGrid
  it('clampToGrid — entité dans les bounds → inchangée', () => {
    const bounds: GridRect = { x: 0, y: 0, w: 10, h: 10 };
    const result = clampToGrid({ x: 5, y: 5 }, { w: 2, h: 2 }, bounds);
    expect(result).toEqual({ x: 5, y: 5 });
  });

  it('clampToGrid — entité trop à droite → ramenée au bord', () => {
    const bounds: GridRect = { x: 0, y: 0, w: 10, h: 10 };
    const result = clampToGrid({ x: 9, y: 0 }, { w: 2, h: 1 }, bounds);
    expect(result).toEqual({ x: 8, y: 0 }); // 10 - 2 = 8
  });

  it('clampToGrid — entité hors bounds à gauche → ramenée au bord', () => {
    const bounds: GridRect = { x: 0, y: 0, w: 10, h: 10 };
    const result = clampToGrid({ x: -3, y: 0 }, { w: 2, h: 1 }, bounds);
    expect(result).toEqual({ x: 0, y: 0 });
  });

  // gridPointEquals
  it('deux points égaux → true', () => {
    expect(gridPointEquals({ x: 3, y: 7 }, { x: 3, y: 7 })).toBe(true);
  });

  it('deux points différents → false', () => {
    expect(gridPointEquals({ x: 3, y: 7 }, { x: 3, y: 8 })).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// cityMapEntity.ts
// ─────────────────────────────────────────────────────────────────────────────

describe('CityMapEntity', () => {
  beforeEach(() => {
    _resetEntityIdCounter();
  });

  it('bounds sans rotation = {x, y, w, h}', () => {
    const e = makeEntity(1, 3, 5, 2, 3);
    expect(e.bounds).toEqual({ x: 3, y: 5, w: 2, h: 3 });
  });

  it('bounds avec rotation → w et h échangés', () => {
    const e = makeEntity(1, 3, 5, 2, 3, true);
    expect(e.bounds).toEqual({ x: 3, y: 5, w: 3, h: 2 }); // w↔h
  });

  it('moveTo retourne nouvelle instance avec nouvelle position', () => {
    const e = makeEntity(1, 0, 0, 2, 2);
    const moved = e.moveTo({ x: 5, y: 7 });
    expect(moved.location).toEqual({ x: 5, y: 7 });
    expect(moved.id).toBe(e.id);
    expect(e.location).toEqual({ x: 0, y: 0 }); // original inchangé
  });

  it('rotate retourne nouvelle instance avec isRotated inversé', () => {
    const e = makeEntity(1, 0, 0, 2, 3, false);
    const rotated = e.rotate();
    expect(rotated.isRotated).toBe(true);
    expect(e.isRotated).toBe(false); // original inchangé
  });

  it('double rotate revient à l état initial', () => {
    const e = makeEntity(1, 0, 0, 2, 3, false);
    const doubled = e.rotate().rotate();
    expect(doubled.isRotated).toBe(false);
    expect(doubled.bounds).toEqual(e.bounds);
  });

  it('location retourne une copie (pas de mutation externe)', () => {
    const e = makeEntity(1, 5, 5);
    const loc = e.location;
    loc.x = 99; // mutation de la copie
    expect(e.location.x).toBe(5); // original inchangé
  });

  it('serialize → deserialize conserve toutes les propriétés', () => {
    const e = new CityMapEntity(42, 'ruralFarm', { x: 3, y: 7 }, { w: 4, h: 3 }, true);
    const serialized = e.serialize();
    const restored = CityMapEntity.deserialize(serialized);
    expect(restored.id).toBe(42);
    expect(restored.buildingDataId).toBe('ruralFarm');
    expect(restored.location).toEqual({ x: 3, y: 7 });
    expect(restored.size).toEqual({ w: 4, h: 3 });
    expect(restored.isRotated).toBe(true);
    expect(restored.bounds).toEqual(e.bounds);
  });

  it('nextEntityId incrémente', () => {
    const id1 = nextEntityId();
    const id2 = nextEntityId();
    expect(id2).toBe(id1 + 1);
  });

  it('effectiveSize tient compte de la rotation', () => {
    const e = new CityMapEntity(1, 'test', { x: 0, y: 0 }, { w: 4, h: 2 }, false);
    expect(e.effectiveSize).toEqual({ w: 4, h: 2 });
    const rotated = e.rotate();
    expect(rotated.effectiveSize).toEqual({ w: 2, h: 4 });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// placementValidator.ts
// ─────────────────────────────────────────────────────────────────────────────

describe('validatePlacement', () => {
  it('placement valide dans une grille vide', () => {
    const candidate = makeEntity(1, 5, 5, 2, 2);
    const ctx = buildPlacementContext(DEFAULT_BOUNDS, new Map());
    expect(validatePlacement(candidate, ctx).valid).toBe(true);
  });

  it('placement hors bounds → out_of_bounds', () => {
    const candidate = makeEntity(1, 39, 39, 2, 2); // déborde de 1
    const ctx = buildPlacementContext(DEFAULT_BOUNDS, new Map());
    const result = validatePlacement(candidate, ctx);
    expect(result.valid).toBe(false);
    expect(result.reason).toBe('out_of_bounds');
  });

  it('placement exactement sur le bord → valide', () => {
    // Bâtiment 2×2 en (38,38) dans une grille 40×40 → bord exact
    const candidate = makeEntity(1, 38, 38, 2, 2);
    const ctx = buildPlacementContext(DEFAULT_BOUNDS, new Map());
    expect(validatePlacement(candidate, ctx).valid).toBe(true);
  });

  it('collision avec entité existante → collision', () => {
    const existing = makeEntity(2, 5, 5, 2, 2);
    const candidate = makeEntity(1, 6, 6, 2, 2); // chevauche existing
    const state = makeState(existing);
    const ctx = buildPlacementContext(DEFAULT_BOUNDS, state.entities);
    const result = validatePlacement(candidate, ctx);
    expect(result.valid).toBe(false);
    expect(result.reason).toBe('collision');
  });

  it('entités adjacentes → pas de collision', () => {
    const existing = makeEntity(2, 0, 0, 2, 2);
    const candidate = makeEntity(1, 2, 0, 2, 2); // juste à droite
    const state = makeState(existing);
    const ctx = buildPlacementContext(DEFAULT_BOUNDS, state.entities);
    expect(validatePlacement(candidate, ctx).valid).toBe(true);
  });

  it('max_qty atteinte → max_qty_exceeded', () => {
    const existing = makeEntity(2, 0, 0);
    const candidate = makeEntity(1, 5, 5);
    const state = makeState(existing);
    const maxQty = new Map([['smallHome', 1]]); // déjà 1, limite = 1
    const ctx = buildPlacementContext(DEFAULT_BOUNDS, state.entities, maxQty);
    const result = validatePlacement(candidate, ctx);
    expect(result.valid).toBe(false);
    expect(result.reason).toBe('max_qty_exceeded');
  });

  it('max_qty non atteinte → valide', () => {
    const existing = makeEntity(2, 0, 0);
    const candidate = makeEntity(1, 5, 5);
    const state = makeState(existing);
    const maxQty = new Map([['smallHome', 5]]); // 1 sur 5
    const ctx = buildPlacementContext(DEFAULT_BOUNDS, state.entities, maxQty);
    expect(validatePlacement(candidate, ctx).valid).toBe(true);
  });

  it('ignoreEntityId exclut l entité du check collision (déplacement)', () => {
    const existing = makeEntity(2, 5, 5, 2, 2);
    // Déplacer existing vers (6,6) — crée une collision apparente avec elle-même
    const candidate = existing.moveTo({ x: 6, y: 6 });
    const state = makeState(existing);
    const ctx = buildPlacementContext(DEFAULT_BOUNDS, state.entities);
    // Sans ignoreEntityId → collision avec elle-même
    expect(validatePlacement(candidate, ctx).valid).toBe(false);
    // Avec ignoreEntityId → pas de collision
    expect(validatePlacement(candidate, ctx, existing.id).valid).toBe(true);
  });

  it('ignoreEntityId exclut aussi le check max_qty (déplacement)', () => {
    const existing = makeEntity(2, 0, 0);
    const candidate = existing.moveTo({ x: 5, y: 5 });
    const state = makeState(existing);
    const maxQty = new Map([['smallHome', 1]]); // limite = 1, déjà 1
    const ctx = buildPlacementContext(DEFAULT_BOUNDS, state.entities, maxQty);
    // Sans ignore → max_qty_exceeded
    expect(validatePlacement(candidate, ctx).valid).toBe(false);
    // Avec ignore → valide
    expect(validatePlacement(candidate, ctx, existing.id).valid).toBe(true);
  });

  it('bâtiment rotaté → bounds correctement vérifiés', () => {
    // Bâtiment 1×3 en (38,0) sans rotation → OK (38+1=39 ≤ 40)
    const e1 = makeEntity(1, 38, 0, 1, 3);
    const ctx = buildPlacementContext(DEFAULT_BOUNDS, new Map());
    expect(validatePlacement(e1, ctx).valid).toBe(true);

    // Même bâtiment rotaté → 3×1, en (38,0) → x+w = 38+3 = 41 > 40 → OOB
    const e2 = makeEntity(2, 38, 0, 1, 3, true);
    expect(validatePlacement(e2, ctx).valid).toBe(false);
    expect(validatePlacement(e2, ctx).reason).toBe('out_of_bounds');
  });
});

describe('countEntitiesByType', () => {
  it('compte correctement les entités d un type donné', () => {
    const state = makeState(
      makeEntity(1, 0, 0),               // smallHome
      makeEntity(2, 5, 5),               // smallHome
      new CityMapEntity(3, 'ruralFarm', { x: 10, y: 10 }, { w: 2, h: 2 }),
    );
    expect(countEntitiesByType(state.entities, 'smallHome')).toBe(2);
    expect(countEntitiesByType(state.entities, 'ruralFarm')).toBe(1);
    expect(countEntitiesByType(state.entities, 'unknown')).toBe(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// commandManager.ts
// ─────────────────────────────────────────────────────────────────────────────

describe('CommandManager', () => {
  let state: CityMapState;
  let cmd: CommandManager;

  beforeEach(() => {
    state = new CityMapState();
    cmd = new CommandManager();
  });

  it('execute → entité ajoutée', () => {
    const entity = makeEntity(1, 0, 0);
    cmd.execute(cmd.createPlaceCommand(state, entity));
    expect(state.has(1)).toBe(true);
  });

  it('undo → entité supprimée', () => {
    const entity = makeEntity(1, 0, 0);
    cmd.execute(cmd.createPlaceCommand(state, entity));
    cmd.undo();
    expect(state.has(1)).toBe(false);
  });

  it('redo → entité réajoutée', () => {
    const entity = makeEntity(1, 0, 0);
    cmd.execute(cmd.createPlaceCommand(state, entity));
    cmd.undo();
    cmd.redo();
    expect(state.has(1)).toBe(true);
  });

  it('execute vide le redoStack', () => {
    const e1 = makeEntity(1, 0, 0);
    const e2 = makeEntity(2, 5, 5);
    cmd.execute(cmd.createPlaceCommand(state, e1));
    cmd.undo();
    expect(cmd.canRedo).toBe(true);
    cmd.execute(cmd.createPlaceCommand(state, e2)); // nouvelle action
    expect(cmd.canRedo).toBe(false); // redo vidé
  });

  it('canUndo / canRedo mis à jour correctement', () => {
    expect(cmd.canUndo).toBe(false);
    expect(cmd.canRedo).toBe(false);

    const entity = makeEntity(1, 0, 0);
    cmd.execute(cmd.createPlaceCommand(state, entity));
    expect(cmd.canUndo).toBe(true);
    expect(cmd.canRedo).toBe(false);

    cmd.undo();
    expect(cmd.canUndo).toBe(false);
    expect(cmd.canRedo).toBe(true);

    cmd.redo();
    expect(cmd.canUndo).toBe(true);
    expect(cmd.canRedo).toBe(false);
  });

  it('undo sur stack vide → no-op', () => {
    expect(() => cmd.undo()).not.toThrow();
    expect(state.size).toBe(0);
  });

  it('redo sur stack vide → no-op', () => {
    expect(() => cmd.redo()).not.toThrow();
  });

  it('séquence place/move → undo×2 restaure l état initial', () => {
    const entity = makeEntity(1, 0, 0);
    cmd.execute(cmd.createPlaceCommand(state, entity));
    cmd.execute(cmd.createMoveCommand(state, 1, { x: 0, y: 0 }, { x: 5, y: 5 }));

    expect(state.getById(1)?.location).toEqual({ x: 5, y: 5 });
    cmd.undo(); // undo move
    expect(state.getById(1)?.location).toEqual({ x: 0, y: 0 });
    cmd.undo(); // undo place
    expect(state.has(1)).toBe(false);
  });

  it('createDeleteCommand — undo repose l entité', () => {
    const entity = makeEntity(1, 3, 3, 2, 2);
    state.add(entity);
    cmd.execute(cmd.createDeleteCommand(state, entity));
    expect(state.has(1)).toBe(false);
    cmd.undo();
    expect(state.has(1)).toBe(true);
    expect(state.getById(1)?.location).toEqual({ x: 3, y: 3 });
  });

  it('createRotateCommand — undo revient à la rotation originale', () => {
    const entity = makeEntity(1, 0, 0, 2, 3, false);
    state.add(entity);
    cmd.execute(cmd.createRotateCommand(state, entity));
    expect(state.getById(1)?.isRotated).toBe(true);
    cmd.undo();
    expect(state.getById(1)?.isRotated).toBe(false);
  });

  it('onChanged appelé après execute/undo/redo', () => {
    let calls = 0;
    cmd.onChanged = () => calls++;

    const entity = makeEntity(1, 0, 0);
    cmd.execute(cmd.createPlaceCommand(state, entity));
    expect(calls).toBe(1);
    cmd.undo();
    expect(calls).toBe(2);
    cmd.redo();
    expect(calls).toBe(3);
  });

  it('reset vide les deux stacks', () => {
    const entity = makeEntity(1, 0, 0);
    cmd.execute(cmd.createPlaceCommand(state, entity));
    cmd.undo();
    expect(cmd.canUndo).toBe(false);
    expect(cmd.canRedo).toBe(true);
    cmd.reset();
    expect(cmd.canUndo).toBe(false);
    expect(cmd.canRedo).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// cityMapState.ts
// ─────────────────────────────────────────────────────────────────────────────

describe('CityMapState', () => {
  let state: CityMapState;

  beforeEach(() => {
    state = new CityMapState();
  });

  it('add → entité présente', () => {
    state.add(makeEntity(1, 0, 0));
    expect(state.has(1)).toBe(true);
    expect(state.size).toBe(1);
  });

  it('remove → entité absente', () => {
    state.add(makeEntity(1, 0, 0));
    state.remove(1);
    expect(state.has(1)).toBe(false);
    expect(state.size).toBe(0);
  });

  it('remove id absent → no-op', () => {
    expect(() => state.remove(999)).not.toThrow();
  });

  it('move → position mise à jour', () => {
    state.add(makeEntity(1, 0, 0));
    state.move(1, { x: 7, y: 3 });
    expect(state.getById(1)?.location).toEqual({ x: 7, y: 3 });
  });

  it('move id absent → no-op', () => {
    expect(() => state.move(999, { x: 0, y: 0 })).not.toThrow();
  });

  it('replace → entité remplacée', () => {
    const e1 = makeEntity(1, 0, 0, 2, 2);
    state.add(e1);
    const e2 = e1.rotate();
    state.replace(1, e2);
    expect(state.getById(1)?.isRotated).toBe(true);
  });

  it('clear → grille vide', () => {
    state.add(makeEntity(1, 0, 0));
    state.add(makeEntity(2, 5, 5));
    state.clear();
    expect(state.size).toBe(0);
  });

  it('countByType → compte correct', () => {
    state.add(makeEntity(1, 0, 0));
    state.add(makeEntity(2, 5, 5));
    state.add(new CityMapEntity(3, 'ruralFarm', { x: 10, y: 10 }, { w: 2, h: 2 }));
    expect(state.countByType('smallHome')).toBe(2);
    expect(state.countByType('ruralFarm')).toBe(1);
  });

  it('getByType → liste correcte', () => {
    state.add(makeEntity(1, 0, 0));
    state.add(new CityMapEntity(2, 'ruralFarm', { x: 5, y: 5 }, { w: 2, h: 2 }));
    const homes = state.getByType('smallHome');
    expect(homes).toHaveLength(1);
    expect(homes[0].id).toBe(1);
  });

  it('entities est en lecture seule (ReadonlyMap)', () => {
    // TypeScript empêche .set() sur ReadonlyMap — on vérifie juste que c'est une Map
    expect(state.entities instanceof Map).toBe(true);
  });

  it('serialize → deserialize conserve toutes les entités', () => {
    state.add(makeEntity(1, 3, 4, 2, 2));
    state.add(new CityMapEntity(2, 'ruralFarm', { x: 10, y: 10 }, { w: 4, h: 3 }, true));

    const serialized = state.serialize();
    expect(serialized.version).toBe(1);
    expect(serialized.entities).toHaveLength(2);

    const restored = CityMapState.deserialize(serialized);
    expect(restored.size).toBe(2);
    expect(restored.getById(1)?.location).toEqual({ x: 3, y: 4 });
    expect(restored.getById(2)?.isRotated).toBe(true);
    expect(restored.getById(2)?.buildingDataId).toBe('ruralFarm');
  });

  it('loadFromSerialized vide l état précédent', () => {
    state.add(makeEntity(1, 0, 0));
    state.add(makeEntity(2, 5, 5));

    const newData = CityMapState.deserialize({
      version: 1,
      entities: [makeEntity(99, 20, 20).serialize()],
    });
    state.loadFromSerialized(newData.serialize());

    expect(state.size).toBe(1);
    expect(state.has(99)).toBe(true);
    expect(state.has(1)).toBe(false);
  });

  it('fromImport lance une erreur (Phase 5+)', () => {
    expect(() => CityMapState.fromImport({})).toThrow('not implemented');
  });
});
