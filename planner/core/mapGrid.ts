// ─────────────────────────────────────────────────────────────────────────────
// mapGrid.ts
// Conversions coordonnées screen ↔ grille, snap, intersections
// Zéro dépendance React/browser — testable Vitest Node.js
// Port de MapGrid.cs (fof-hoh-city-planner)
// ─────────────────────────────────────────────────────────────────────────────

/** Taille d'une tuile en pixels (zoom=1). Exposée pour le renderer. */
export const TILE_SIZE = 64;

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

/** Position en coordonnées grille (tuiles) */
export interface GridPoint {
  x: number;
  y: number;
}

/** Position en coordonnées écran (pixels) */
export interface ScreenPoint {
  x: number;
  y: number;
}

/**
 * Rectangle en coordonnées grille.
 * x,y = coin supérieur gauche (inclus)
 * w,h = dimensions en tuiles
 */
export interface GridRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Conversions screen ↔ grille
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Convertit une position écran en position grille.
 * Tient compte du décalage (pan) et du zoom courant.
 */
export function screenToGrid(
  screen: ScreenPoint,
  offset: ScreenPoint,
  zoom: number,
): GridPoint {
  return {
    x: Math.floor((screen.x - offset.x) / (TILE_SIZE * zoom)),
    y: Math.floor((screen.y - offset.y) / (TILE_SIZE * zoom)),
  };
}

/**
 * Convertit une position grille en position écran (coin supérieur gauche de la tuile).
 */
export function gridToScreen(
  grid: GridPoint,
  offset: ScreenPoint,
  zoom: number,
): ScreenPoint {
  return {
    x: grid.x * TILE_SIZE * zoom + offset.x,
    y: grid.y * TILE_SIZE * zoom + offset.y,
  };
}

/**
 * Snappe une position écran sur la grille la plus proche.
 * Retourne le coin supérieur gauche en pixels de la tuile snappée.
 */
export function snapToGrid(
  screen: ScreenPoint,
  offset: ScreenPoint,
  zoom: number,
): ScreenPoint {
  const grid = screenToGrid(screen, offset, zoom);
  return gridToScreen(grid, offset, zoom);
}

/**
 * Taille d'une tuile en pixels pour un zoom donné.
 * Utile pour le renderer.
 */
export function tileSizeAtZoom(zoom: number): number {
  return TILE_SIZE * zoom;
}

// ─────────────────────────────────────────────────────────────────────────────
// Opérations sur les rectangles grille
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Vérifie si deux rectangles grille se chevauchent (collision).
 * Deux rectangles adjacents (qui se touchent sur un bord) ne se chevauchent PAS.
 *
 * Exemple visual :
 *   [A][A]          → pas d'overlap
 *        [B][B]
 *
 *   [A][A]          → overlap (partagent la tuile x=1)
 *      [B][B]
 */
export function gridRectIntersects(a: GridRect, b: GridRect): boolean {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

/**
 * Vérifie si `inner` est entièrement contenu dans `outer`.
 * Les bords peuvent coïncider.
 */
export function gridRectContains(outer: GridRect, inner: GridRect): boolean {
  return (
    inner.x >= outer.x &&
    inner.y >= outer.y &&
    inner.x + inner.w <= outer.x + outer.w &&
    inner.y + inner.h <= outer.y + outer.h
  );
}

/**
 * Retourne vrai si le point grille est à l'intérieur du rectangle (inclusif).
 */
export function gridRectContainsPoint(rect: GridRect, point: GridPoint): boolean {
  return (
    point.x >= rect.x &&
    point.x < rect.x + rect.w &&
    point.y >= rect.y &&
    point.y < rect.y + rect.h
  );
}

/**
 * Contraint un GridPoint pour qu'il reste dans les limites d'une grille.
 * Utilisé pour empêcher le ghost de déborder.
 *
 * @param point   Position à contraindre
 * @param size    Taille de l'entité (pour tenir compte du débordement)
 * @param bounds  Limites de la grille
 */
export function clampToGrid(
  point: GridPoint,
  size: { w: number; h: number },
  bounds: GridRect,
): GridPoint {
  return {
    x: Math.max(bounds.x, Math.min(point.x, bounds.x + bounds.w - size.w)),
    y: Math.max(bounds.y, Math.min(point.y, bounds.y + bounds.h - size.h)),
  };
}

/**
 * Compare deux GridPoints.
 */
export function gridPointEquals(a: GridPoint, b: GridPoint): boolean {
  return a.x === b.x && a.y === b.y;
}
