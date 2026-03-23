import { gridRectContains, gridRectIntersects, type GridRect } from './mapGrid';
import type { CityMapEntity } from './cityMapEntity';
import type { ExpansionGridRect } from './expansionManager';
import { isRectInUnlockedArea } from './expansionManager';

export type PlacementReason =
  | 'out_of_bounds'
  | 'expansion_locked'
  | 'collision'
  | 'max_qty_exceeded';

export interface PlacementResult { valid: boolean; reason?: PlacementReason; }

export interface PlacementContext {
  mapBounds:           GridRect;
  entities:            ReadonlyMap<number, CityMapEntity>;
  maxQtyByBuildingId:  ReadonlyMap<string, number>;
  expansionRects?:     ExpansionGridRect[];
  unlockedExpansions?: Set<string>;
}

export function validatePlacement(
  candidate: CityMapEntity,
  ctx: PlacementContext,
  ignoreEntityId?: number,
): PlacementResult {
  const bounds = candidate.bounds;

  if (!gridRectContains(ctx.mapBounds, bounds))
    return { valid: false, reason: 'out_of_bounds' };

  if (ctx.expansionRects && ctx.unlockedExpansions) {
    if (!isRectInUnlockedArea(ctx.expansionRects, ctx.unlockedExpansions, bounds.x, bounds.y, bounds.w, bounds.h))
      return { valid: false, reason: 'expansion_locked' };
  }

  for (const [id, entity] of ctx.entities) {
    if (id === ignoreEntityId) continue;
    if (gridRectIntersects(bounds, entity.bounds))
      return { valid: false, reason: 'collision' };
  }

  const max = ctx.maxQtyByBuildingId.get(candidate.buildingDataId);
  if (max !== undefined) {
    let count = 0;
    for (const [id, entity] of ctx.entities) {
      if (id === ignoreEntityId) continue;
      if (entity.buildingDataId === candidate.buildingDataId && ++count >= max)
        return { valid: false, reason: 'max_qty_exceeded' };
    }
  }

  return { valid: true };
}

export function countEntitiesByType(
  entities: ReadonlyMap<number, CityMapEntity>,
  buildingDataId: string,
): number {
  let count = 0;
  for (const entity of entities.values())
    if (entity.buildingDataId === buildingDataId) count++;
  return count;
}

export function buildPlacementContext(
  mapBounds: GridRect,
  entities: ReadonlyMap<number, CityMapEntity>,
  maxQtyByBuildingId: ReadonlyMap<string, number> = new Map(),
  expansionRects?: ExpansionGridRect[],
  unlockedExpansions?: Set<string>,
): PlacementContext {
  return { mapBounds, entities, maxQtyByBuildingId, expansionRects, unlockedExpansions };
}