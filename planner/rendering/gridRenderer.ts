import { TILE_SIZE } from '../core/mapGrid';
import type { Viewport, VisibleTiles } from './viewportManager';
import type { ExpansionGridRect } from '../core/expansionManager';

const GRID_LINE_COLOR = 'rgba(100, 100, 100, 0.35)';
const GRID_LINE_WIDTH = 0.5;
const TILE_BG_COLOR   = 'rgba(240, 237, 228, 0.6)';

export type TileStatus = 'playable' | 'locked' | 'blocker';
export type TileStatusMap = Map<number, TileStatus>;
export function tileKey(x: number, y: number): number { return x * 1000 + y; }

/**
 * Construit un Set des clés de tuiles qui appartiennent à une expansion standard.
 * Utilisé par drawGrid pour ne dessiner ni fond ni lignes en dehors.
 */
export function buildPlayableTileSet(
  expansionRects: ExpansionGridRect[],
): Set<number> {
  const set = new Set<number>();
  for (const rect of expansionRects) {
    if (rect.type !== 'standard') continue;
    for (let dy = 0; dy < rect.h; dy++) {
      for (let dx = 0; dx < rect.w; dx++) {
        set.add(tileKey(rect.x + dx, rect.y + dy));
      }
    }
  }
  return set;
}

/**
 * Dessine la grille : fond + lignes uniquement sur les tuiles playable.
 * Les trous et blockers = RIEN (fond transparent, pas de lignes).
 */
export function drawGrid(
  ctx: CanvasRenderingContext2D,
  vp: Viewport,
  visible: VisibleTiles,
  playableTiles?: Set<number>,
): void {
  const ts = TILE_SIZE * vp.zoom;
  ctx.save();

  // ── 1. Fond des tuiles ────────────────────────────────────────────────────
  ctx.fillStyle = TILE_BG_COLOR;
  for (let y = visible.minY; y <= visible.maxY; y++) {
    for (let x = visible.minX; x <= visible.maxX; x++) {
      // Si playableTiles fourni : ne dessiner que les tuiles qui en font partie
      if (playableTiles && !playableTiles.has(tileKey(x, y))) continue;
      ctx.fillRect(x * ts + vp.offset.x, y * ts + vp.offset.y, ts, ts);
    }
  }

  // ── 2. Lignes de grille — segment par segment, skip les zones vides ───────
  if (!playableTiles) {
    // Sans masque : lignes continues (comportement original)
    ctx.strokeStyle = GRID_LINE_COLOR;
    ctx.lineWidth   = GRID_LINE_WIDTH;
    ctx.beginPath();
    for (let x = visible.minX; x <= visible.maxX + 1; x++) {
      const sx = x * ts + vp.offset.x;
      ctx.moveTo(sx, visible.minY * ts + vp.offset.y);
      ctx.lineTo(sx, (visible.maxY + 1) * ts + vp.offset.y);
    }
    for (let y = visible.minY; y <= visible.maxY + 1; y++) {
      const sy = y * ts + vp.offset.y;
      ctx.moveTo(visible.minX * ts + vp.offset.x, sy);
      ctx.lineTo((visible.maxX + 1) * ts + vp.offset.x, sy);
    }
    ctx.stroke();
  } else {
    // Avec masque : ne dessiner les bords d'une tuile que si la tuile est playable
    ctx.strokeStyle = GRID_LINE_COLOR;
    ctx.lineWidth   = GRID_LINE_WIDTH;
    ctx.beginPath();
    for (let y = visible.minY; y <= visible.maxY; y++) {
      for (let x = visible.minX; x <= visible.maxX; x++) {
        if (!playableTiles.has(tileKey(x, y))) continue;
        const sx = x * ts + vp.offset.x;
        const sy = y * ts + vp.offset.y;
        // Bord haut si voisin du haut n'est pas playable (ou bord de grille)
        if (!playableTiles.has(tileKey(x, y - 1))) {
          ctx.moveTo(sx, sy); ctx.lineTo(sx + ts, sy);
        }
        // Bord gauche
        if (!playableTiles.has(tileKey(x - 1, y))) {
          ctx.moveTo(sx, sy); ctx.lineTo(sx, sy + ts);
        }
        // Bord bas si dernier de la colonne ou voisin pas playable
        if (!playableTiles.has(tileKey(x, y + 1))) {
          ctx.moveTo(sx, sy + ts); ctx.lineTo(sx + ts, sy + ts);
        }
        // Bord droit
        if (!playableTiles.has(tileKey(x + 1, y))) {
          ctx.moveTo(sx + ts, sy); ctx.lineTo(sx + ts, sy + ts);
        }
        // Lignes internes (entre deux tuiles playable adjacentes)
        if (playableTiles.has(tileKey(x + 1, y))) {
          ctx.moveTo(sx + ts, sy); ctx.lineTo(sx + ts, sy + ts);
        }
        if (playableTiles.has(tileKey(x, y + 1))) {
          ctx.moveTo(sx, sy + ts); ctx.lineTo(sx + ts, sy + ts);
        }
      }
    }
    ctx.stroke();
  }

  ctx.restore();
}

export function drawHoveredCell(
  ctx: CanvasRenderingContext2D,
  vp: Viewport,
  cellX: number,
  cellY: number,
): void {
  const ts = TILE_SIZE * vp.zoom;
  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
  ctx.fillRect(cellX * ts + vp.offset.x, cellY * ts + vp.offset.y, ts, ts);
  ctx.restore();
}

export function buildTileStatusMap(
  allExpansions: Array<{ id: string; x: number; y: number; type: string }>,
  unlockedIds: Set<string>,
  expansionSize: number,
): TileStatusMap {
  const map: TileStatusMap = new Map();
  for (const expansion of allExpansions) {
    const status: TileStatus =
      expansion.type === 'blocker' ? 'blocker' :
      unlockedIds.has(expansion.id) ? 'playable' : 'locked';
    for (let dy = 0; dy < expansionSize; dy++) {
      for (let dx = 0; dx < expansionSize; dx++) {
        map.set(tileKey(expansion.x + dx, expansion.y + dy), status);
      }
    }
  }
  return map;
}