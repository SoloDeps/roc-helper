// ─────────────────────────────────────────────────────────────────────────────
// gridRenderer.ts
// Dessin de la grille 2D — uniquement les tuiles visibles
// Dépendance : Canvas 2D API (browser uniquement)
// ─────────────────────────────────────────────────────────────────────────────

import { TILE_SIZE } from '../core/mapGrid';
import type { Viewport, VisibleTiles } from './viewportManager';

// ─────────────────────────────────────────────────────────────────────────────
// Config visuelle
// ─────────────────────────────────────────────────────────────────────────────

const GRID_LINE_COLOR  = 'rgba(100, 100, 100, 0.35)';
const GRID_LINE_WIDTH  = 0.5;

/** Couleur de fond des tuiles jouables */
const TILE_BG_COLOR    = 'rgba(240, 237, 228, 0.6)';

/** Couleur des tuiles locked (pas encore débloquées) */
const TILE_LOCKED_COLOR = 'rgba(150, 150, 150, 0.2)';

/** Couleur des tuiles blocker (hors limites) */
const TILE_BLOCKER_COLOR = 'rgba(80, 80, 80, 0.15)';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type TileStatus = 'playable' | 'locked' | 'blocker';

/**
 * Map des statuts des tuiles : (x * 1000 + y) → TileStatus
 * Construit depuis cityGridDefinitions une seule fois au chargement de la ville.
 * Undefined = tuile hors grille (pas de fond).
 */
export type TileStatusMap = Map<number, TileStatus>;

/** Clé de lookup dans TileStatusMap */
export function tileKey(x: number, y: number): number {
  // Supporte des grilles jusqu'à 1000×1000 — largement suffisant
  return x * 1000 + y;
}

// ─────────────────────────────────────────────────────────────────────────────
// Dessin de la grille
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Dessine la grille complète : fonds de tuiles + lignes.
 * Culling intégré — seules les tuiles dans `visible` sont dessinées.
 *
 * Ordre de rendu :
 *   1. Fonds des tuiles (couleur selon statut)
 *   2. Lignes de grille
 *
 * @param ctx         Contexte 2D du canvas
 * @param vp          Viewport courant
 * @param visible     Plage de tuiles visibles (depuis getVisibleTiles)
 * @param statusMap   Statut de chaque tuile (optionnel — Phase 5)
 */
export function drawGrid(
  ctx: CanvasRenderingContext2D,
  vp: Viewport,
  visible: VisibleTiles,
  statusMap?: TileStatusMap,
): void {
  const ts = TILE_SIZE * vp.zoom;

  ctx.save();

  // ── 1. Fonds des tuiles ───────────────────────────────────────────────────
  if (statusMap) {
    for (let y = visible.minY; y <= visible.maxY; y++) {
      for (let x = visible.minX; x <= visible.maxX; x++) {
        const status = statusMap.get(tileKey(x, y));
        if (!status) continue;

        const sx = x * ts + vp.offset.x;
        const sy = y * ts + vp.offset.y;

        ctx.fillStyle =
          status === 'playable' ? TILE_BG_COLOR :
          status === 'locked'   ? TILE_LOCKED_COLOR :
                                  TILE_BLOCKER_COLOR;

        ctx.fillRect(sx, sy, ts, ts);
      }
    }
  } else {
    // Sans statusMap (Phase 2) — fond uniforme pour toutes les tuiles visibles
    ctx.fillStyle = TILE_BG_COLOR;
    for (let y = visible.minY; y <= visible.maxY; y++) {
      for (let x = visible.minX; x <= visible.maxX; x++) {
        ctx.fillRect(
          x * ts + vp.offset.x,
          y * ts + vp.offset.y,
          ts,
          ts,
        );
      }
    }
  }

  // ── 2. Lignes de grille ───────────────────────────────────────────────────
  ctx.strokeStyle = GRID_LINE_COLOR;
  ctx.lineWidth   = GRID_LINE_WIDTH;
  ctx.beginPath();

  // Lignes verticales
  for (let x = visible.minX; x <= visible.maxX + 1; x++) {
    const sx = x * ts + vp.offset.x;
    const startY = visible.minY * ts + vp.offset.y;
    const endY   = (visible.maxY + 1) * ts + vp.offset.y;
    ctx.moveTo(sx, startY);
    ctx.lineTo(sx, endY);
  }

  // Lignes horizontales
  for (let y = visible.minY; y <= visible.maxY + 1; y++) {
    const sy = y * ts + vp.offset.y;
    const startX = visible.minX * ts + vp.offset.x;
    const endX   = (visible.maxX + 1) * ts + vp.offset.x;
    ctx.moveTo(startX, sy);
    ctx.lineTo(endX, sy);
  }

  ctx.stroke();
  ctx.restore();
}

// ─────────────────────────────────────────────────────────────────────────────
// Highlight de la tuile survolée
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Dessine un highlight sur la tuile sous le curseur.
 * Appelé après drawGrid, par-dessus.
 */
export function drawHoveredCell(
  ctx: CanvasRenderingContext2D,
  vp: Viewport,
  cellX: number,
  cellY: number,
): void {
  const ts = TILE_SIZE * vp.zoom;
  const sx = cellX * ts + vp.offset.x;
  const sy = cellY * ts + vp.offset.y;

  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
  ctx.fillRect(sx, sy, ts, ts);
  ctx.restore();
}

// ─────────────────────────────────────────────────────────────────────────────
// Construction du TileStatusMap depuis cityGridDefinitions (Phase 5)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Construit la TileStatusMap depuis les définitions d'expansions.
 * À appeler une fois au chargement de la ville, résultat mis en cache.
 *
 * @param allExpansions     Toutes les expansions de la ville (cityGridDefinitions)
 * @param unlockedIds       Set des IDs débloqués par le joueur (depuis City_*.json)
 * @param expansionSize     Taille d'une expansion en tuiles (3 ou 4)
 */
export function buildTileStatusMap(
  allExpansions: Array<{ id: string; x: number; y: number; type: string }>,
  unlockedIds: Set<string>,
  expansionSize: number,
): TileStatusMap {
  const map: TileStatusMap = new Map();

  for (const expansion of allExpansions) {
    const status: TileStatus =
      expansion.type === 'blocker' ? 'blocker' :
      unlockedIds.has(expansion.id) ? 'playable' :
      'locked';

    // Remplir toutes les tuiles de cette expansion
    for (let dy = 0; dy < expansionSize; dy++) {
      for (let dx = 0; dx < expansionSize; dx++) {
        map.set(tileKey(expansion.x + dx, expansion.y + dy), status);
      }
    }
  }

  return map;
}
