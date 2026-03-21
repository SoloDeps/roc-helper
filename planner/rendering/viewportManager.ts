// ─────────────────────────────────────────────────────────────────────────────
// viewportManager.ts
// Pan, zoom, viewport culling — 2D orthogonal (PAS isométrique)
// Zéro dépendance React/browser — testable Vitest Node.js
// ─────────────────────────────────────────────────────────────────────────────

import { TILE_SIZE } from '../core/mapGrid';

// ─────────────────────────────────────────────────────────────────────────────
// Constantes
// ─────────────────────────────────────────────────────────────────────────────

export const ZOOM_MIN = 0.3;
export const ZOOM_MAX = 3.0;
export const ZOOM_STEP_WHEEL = 0.1;  // sensibilité molette

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface Viewport {
  /** Décalage en pixels (pan) */
  offset: { x: number; y: number };
  /** Facteur de zoom courant */
  zoom: number;
}

/** Plage de tuiles visibles dans le viewport */
export interface VisibleTiles {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Viewport initial
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Crée un viewport initial centré sur la grille.
 *
 * @param canvasW   Largeur du canvas en pixels
 * @param canvasH   Hauteur du canvas en pixels
 * @param gridW     Largeur de la grille en tuiles
 * @param gridH     Hauteur de la grille en tuiles
 * @param zoom      Zoom initial (défaut 1)
 */
export function createInitialViewport(
  canvasW: number,
  canvasH: number,
  gridW: number,
  gridH: number,
  zoom = 1,
): Viewport {
  const gridPixelW = gridW * TILE_SIZE * zoom;
  const gridPixelH = gridH * TILE_SIZE * zoom;
  return {
    zoom,
    offset: {
      x: (canvasW - gridPixelW) / 2,
      y: (canvasH - gridPixelH) / 2,
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Pan
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Applique un déplacement (pan) au viewport.
 * Retourne un nouveau viewport — immuable.
 */
export function applyPan(vp: Viewport, dx: number, dy: number): Viewport {
  return {
    ...vp,
    offset: {
      x: vp.offset.x + dx,
      y: vp.offset.y + dy,
    },
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Zoom
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Applique un zoom centré sur un point pivot (ex: position de la souris).
 * Le point sous le curseur reste fixe.
 * Retourne un nouveau viewport — immuable.
 *
 * @param vp        Viewport courant
 * @param delta     Positif = zoom in, négatif = zoom out
 * @param pivotX    X du pivot en pixels canvas
 * @param pivotY    Y du pivot en pixels canvas
 */
export function applyZoom(
  vp: Viewport,
  delta: number,
  pivotX: number,
  pivotY: number,
): Viewport {
  const factor = delta > 0 ? 1 + ZOOM_STEP_WHEEL : 1 - ZOOM_STEP_WHEEL;
  const newZoom = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, vp.zoom * factor));

  // Si le zoom n'a pas changé (déjà aux limites), retourner le même viewport
  if (newZoom === vp.zoom) return vp;

  const scale = newZoom / vp.zoom;

  return {
    zoom: newZoom,
    offset: {
      x: pivotX - (pivotX - vp.offset.x) * scale,
      y: pivotY - (pivotY - vp.offset.y) * scale,
    },
  };
}

/**
 * Applique un zoom discret (boutons +/-) centré sur le milieu du canvas.
 */
export function applyZoomCentered(
  vp: Viewport,
  delta: number,
  canvasW: number,
  canvasH: number,
): Viewport {
  return applyZoom(vp, delta, canvasW / 2, canvasH / 2);
}

// ─────────────────────────────────────────────────────────────────────────────
// Viewport culling — 2D orthogonal
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Calcule la plage de tuiles visibles dans le viewport courant.
 * Inclut un padding de 1 tuile pour éviter le pop-in aux bords.
 *
 * Formule 2D pure (PAS isométrique) :
 *   minX = floor((-offset.x) / tileSize) - pad
 *   maxX = ceil((canvasW - offset.x) / tileSize) + pad
 *
 * @param vp        Viewport courant
 * @param canvasW   Largeur canvas en pixels
 * @param canvasH   Hauteur canvas en pixels
 * @param gridW     Largeur grille en tuiles (pour clamping)
 * @param gridH     Hauteur grille en tuiles (pour clamping)
 * @param padding   Tuiles supplémentaires autour du viewport (défaut 1)
 */
export function getVisibleTiles(
  vp: Viewport,
  canvasW: number,
  canvasH: number,
  gridW: number,
  gridH: number,
  padding = 1,
): VisibleTiles {
  const ts = TILE_SIZE * vp.zoom;

  const minX = Math.max(0, Math.floor(-vp.offset.x / ts) - padding);
  const minY = Math.max(0, Math.floor(-vp.offset.y / ts) - padding);
  const maxX = Math.min(gridW - 1, Math.ceil((canvasW - vp.offset.x) / ts) + padding);
  const maxY = Math.min(gridH - 1, Math.ceil((canvasH - vp.offset.y) / ts) + padding);

  return { minX, minY, maxX, maxY };
}

/**
 * Vérifie si une tuile est dans la plage visible.
 */
export function isTileVisible(tileX: number, tileY: number, visible: VisibleTiles): boolean {
  return (
    tileX >= visible.minX &&
    tileX <= visible.maxX &&
    tileY >= visible.minY &&
    tileY <= visible.maxY
  );
}

/**
 * Vérifie si un rectangle (en tuiles) est au moins partiellement visible.
 * Utilisé pour le culling des bâtiments multi-tuiles.
 */
export function isRectVisible(
  tileX: number,
  tileY: number,
  tileW: number,
  tileH: number,
  visible: VisibleTiles,
): boolean {
  return (
    tileX + tileW > visible.minX &&
    tileX <= visible.maxX &&
    tileY + tileH > visible.minY &&
    tileY <= visible.maxY
  );
}
