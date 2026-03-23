// ─────────────────────────────────────────────────────────────────────────────
// spatialEntityIndex.ts
// Index spatial des entités — lookups O(1) au lieu d'O(n)
//
// Adapté de isometric-city → lib/performanceUtils.ts → SpatialGrid<T>
// Adapté pour la grille 2D orthogonale (pas isométrique).
//
// Utilisation dans cityPlannerStore.ts :
//   const _spatialIndex = new SpatialEntityIndex(52);
//   _spatialIndex.add(entity);      // après _mapState.add()
//   _spatialIndex.remove(id);       // avant _mapState.remove()
//   _spatialIndex.findAt(cell);     // remplace findEntityAt() O(n)
//   _spatialIndex.hasCollision(bounds, ignoreId);  // remplace le for...of O(n)
// ─────────────────────────────────────────────────────────────────────────────

import type { CityMapEntity }    from '../core/cityMapEntity';
import type { GridPoint, GridRect } from '../core/mapGrid';
import { gridRectIntersects }    from '../core/mapGrid';

/** Taille d'une cellule en tuiles. 4 = cellule de 4×4 tuiles. */
const CELL_SIZE = 4;

export class SpatialEntityIndex {
  /** cellKey → Set<entityId> */
  private cells    = new Map<number, Set<number>>();
  /** entityId → CityMapEntity */
  private entities = new Map<number, CityMapEntity>();
  private gridWidth: number;

  constructor(gridSize: number) {
    this.gridWidth = Math.ceil(gridSize / CELL_SIZE);
  }

  // ─── Clé de cellule ────────────────────────────────────────────────────────

  private cellKey(tileX: number, tileY: number): number {
    return Math.floor(tileY / CELL_SIZE) * this.gridWidth +
           Math.floor(tileX / CELL_SIZE);
  }

  // ─── Reconstruction complète (undo/redo/loadLayout) ────────────────────────

  rebuild(entities: ReadonlyMap<number, CityMapEntity>): void {
    this.cells.clear();
    this.entities.clear();
    for (const entity of entities.values()) {
      this._insert(entity);
    }
  }

  // ─── Mutations incrémentales ───────────────────────────────────────────────

  /** Appeler APRÈS _mapState.add() */
  add(entity: CityMapEntity): void {
    this._insert(entity);
  }

  /** Appeler AVANT _mapState.remove() */
  remove(id: number): void {
    const entity = this.entities.get(id);
    if (entity) this._delete(entity);
  }

  /** Appeler après un déplacement (drag) */
  update(newEntity: CityMapEntity): void {
    this.remove(newEntity.id);
    this._insert(newEntity);
  }

  // ─── Queries ───────────────────────────────────────────────────────────────

  /**
   * Trouve la première entité contenant le point.
   * Remplace findEntityAt() O(n).
   */
  findAt(point: GridPoint): CityMapEntity | undefined {
    const key  = this.cellKey(point.x, point.y);
    const cell = this.cells.get(key);
    if (!cell) return undefined;

    for (const id of cell) {
      const entity = this.entities.get(id);
      if (!entity) continue;
      const b = entity.bounds;
      if (
        point.x >= b.x && point.x < b.x + b.w &&
        point.y >= b.y && point.y < b.y + b.h
      ) return entity;
    }
    return undefined;
  }

  /**
   * Vérifie s'il y a une collision dans le rect donné.
   * Remplace le for...of O(n) dans validatePlacement.
   */
  hasCollision(rect: GridRect, ignoreId?: number): boolean {
    const startCX = Math.floor(rect.x / CELL_SIZE);
    const startCY = Math.floor(rect.y / CELL_SIZE);
    const endCX   = Math.floor((rect.x + rect.w - 1) / CELL_SIZE);
    const endCY   = Math.floor((rect.y + rect.h - 1) / CELL_SIZE);
    const seen    = new Set<number>();

    for (let cy = startCY; cy <= endCY; cy++) {
      for (let cx = startCX; cx <= endCX; cx++) {
        const cell = this.cells.get(cy * this.gridWidth + cx);
        if (!cell) continue;
        for (const id of cell) {
          if (seen.has(id)) continue;
          seen.add(id);
          if (id === ignoreId) continue;
          const entity = this.entities.get(id);
          if (entity && gridRectIntersects(rect, entity.bounds)) return true;
        }
      }
    }
    return false;
  }

  /**
   * Retourne toutes les entités intersectant un rect.
   * Utile pour des queries étendues (ex: happiness coverage).
   */
  getInRect(rect: GridRect, ignoreId?: number): CityMapEntity[] {
    const startCX = Math.floor(rect.x / CELL_SIZE);
    const startCY = Math.floor(rect.y / CELL_SIZE);
    const endCX   = Math.floor((rect.x + rect.w - 1) / CELL_SIZE);
    const endCY   = Math.floor((rect.y + rect.h - 1) / CELL_SIZE);
    const seen    = new Set<number>();
    const result: CityMapEntity[] = [];

    for (let cy = startCY; cy <= endCY; cy++) {
      for (let cx = startCX; cx <= endCX; cx++) {
        const cell = this.cells.get(cy * this.gridWidth + cx);
        if (!cell) continue;
        for (const id of cell) {
          if (seen.has(id)) continue;
          seen.add(id);
          if (id === ignoreId) continue;
          const entity = this.entities.get(id);
          if (entity && gridRectIntersects(rect, entity.bounds)) {
            result.push(entity);
          }
        }
      }
    }
    return result;
  }

  // ─── Helpers privés ────────────────────────────────────────────────────────

  private _insert(entity: CityMapEntity): void {
    this.entities.set(entity.id, entity);
    const b       = entity.bounds;
    const startCX = Math.floor(b.x / CELL_SIZE);
    const startCY = Math.floor(b.y / CELL_SIZE);
    const endCX   = Math.floor((b.x + b.w - 1) / CELL_SIZE);
    const endCY   = Math.floor((b.y + b.h - 1) / CELL_SIZE);

    for (let cy = startCY; cy <= endCY; cy++) {
      for (let cx = startCX; cx <= endCX; cx++) {
        const key  = cy * this.gridWidth + cx;
        let   cell = this.cells.get(key);
        if (!cell) { cell = new Set(); this.cells.set(key, cell); }
        cell.add(entity.id);
      }
    }
  }

  private _delete(entity: CityMapEntity): void {
    this.entities.delete(entity.id);
    const b       = entity.bounds;
    const startCX = Math.floor(b.x / CELL_SIZE);
    const startCY = Math.floor(b.y / CELL_SIZE);
    const endCX   = Math.floor((b.x + b.w - 1) / CELL_SIZE);
    const endCY   = Math.floor((b.y + b.h - 1) / CELL_SIZE);

    for (let cy = startCY; cy <= endCY; cy++) {
      for (let cx = startCX; cx <= endCX; cx++) {
        this.cells.get(cy * this.gridWidth + cx)?.delete(entity.id);
      }
    }
  }
}
