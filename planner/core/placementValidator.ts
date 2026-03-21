// ─────────────────────────────────────────────────────────────────────────────
// placementValidator.ts
// Validation du placement d'une entité : bounds, collision, max_qty
// Port de MapArea.CanBePlaced() (fof-hoh-city-planner)
// Zéro dépendance React/browser
// ─────────────────────────────────────────────────────────────────────────────

import { gridRectContains, gridRectIntersects, type GridRect } from './mapGrid';
import type { CityMapEntity } from './cityMapEntity';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type PlacementReason =
  | 'out_of_bounds'     // hors des limites de la grille
  | 'collision'         // chevauche une autre entité
  | 'max_qty_exceeded'; // quantité maximale atteinte pour ce type de bâtiment

export interface PlacementResult {
  valid: boolean;
  reason?: PlacementReason;
}

/**
 * Contexte nécessaire pour valider un placement.
 * Passé explicitement pour garder le validator pur (sans dépendance au store).
 */
export interface PlacementContext {
  /** Limites jouables de la grille (en tuiles) */
  mapBounds: GridRect;
  /** Toutes les entités actuellement placées */
  entities: ReadonlyMap<number, CityMapEntity>;
  /**
   * Quantités maximales par buildingDataId.
   * Si une clé est absente → pas de limite.
   * Alimenté par costBridge.buildMaxQtyMap() en Phase 5.
   */
  maxQtyByBuildingId: ReadonlyMap<string, number>;
}

// ─────────────────────────────────────────────────────────────────────────────
// Validator
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Valide le placement d'un candidat sur la grille.
 *
 * @param candidate       L'entité à placer (ou déplacer)
 * @param ctx             Contexte : grille, entités, limites de quantité
 * @param ignoreEntityId  ID de l'entité à ignorer lors des checks collision/qty.
 *                        Utiliser pour valider le déplacement d'une entité existante
 *                        ou pour le ghost (id=0).
 *
 * @returns PlacementResult { valid, reason? }
 *
 * Ordre des checks (du moins coûteux au plus coûteux) :
 *   1. Bounds         — O(1)
 *   2. Collision      — O(n) entités
 *   3. Max qty        — O(n) entités (seulement si max défini)
 */
export function validatePlacement(
  candidate: CityMapEntity,
  ctx: PlacementContext,
  ignoreEntityId?: number,
): PlacementResult {
  const bounds = candidate.bounds;

  // ── 1. Bounds check ───────────────────────────────────────────────────────
  if (!gridRectContains(ctx.mapBounds, bounds)) {
    return { valid: false, reason: 'out_of_bounds' };
  }

  // ── 2. Collision check ────────────────────────────────────────────────────
  for (const [id, entity] of ctx.entities) {
    if (id === ignoreEntityId) continue;
    if (gridRectIntersects(bounds, entity.bounds)) {
      return { valid: false, reason: 'collision' };
    }
  }

  // ── 3. Max quantity check ─────────────────────────────────────────────────
  const max = ctx.maxQtyByBuildingId.get(candidate.buildingDataId);
  if (max !== undefined) {
    let count = 0;
    for (const [id, entity] of ctx.entities) {
      if (id === ignoreEntityId) continue;
      if (entity.buildingDataId === candidate.buildingDataId) {
        count++;
        if (count >= max) {
          return { valid: false, reason: 'max_qty_exceeded' };
        }
      }
    }
  }

  return { valid: true };
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Retourne le nombre d'entités d'un type donné dans le state.
 * Utilisé pour afficher "X/max" dans l'UI.
 */
export function countEntitiesByType(
  entities: ReadonlyMap<number, CityMapEntity>,
  buildingDataId: string,
): number {
  let count = 0;
  for (const entity of entities.values()) {
    if (entity.buildingDataId === buildingDataId) count++;
  }
  return count;
}

/**
 * Construit un PlacementContext minimal pour les tests ou le ghost preview.
 * En production, utiliser le contexte du store avec les vraies maxQty.
 */
export function buildPlacementContext(
  mapBounds: GridRect,
  entities: ReadonlyMap<number, CityMapEntity>,
  maxQtyByBuildingId: ReadonlyMap<string, number> = new Map(),
): PlacementContext {
  return { mapBounds, entities, maxQtyByBuildingId };
}
