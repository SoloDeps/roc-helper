// ─────────────────────────────────────────────────────────────────────────────
// overlayRenderer.ts
// Dessin des overlays happiness sur le canvas
// Carré semi-transparent autour de chaque Cultural Site
// ─────────────────────────────────────────────────────────────────────────────

import { TILE_SIZE } from '../core/mapGrid';
import type { CityMapEntity } from '../core/cityMapEntity';
import type { Viewport } from './viewportManager';
import { getCultureSiteCoverageRect, isCultureSite } from '../core/happinessCalculator';

// ─────────────────────────────────────────────────────────────────────────────
// Couleurs
// ─────────────────────────────────────────────────────────────────────────────

const COVERAGE_FILL   = 'rgba(255, 220, 50, 0.12)';  // jaune très léger
const COVERAGE_BORDER = 'rgba(255, 200, 30, 0.55)';  // jaune border
const COVERAGE_GHOST_FILL   = 'rgba(255, 220, 50, 0.18)'; // plus visible pour ghost
const COVERAGE_GHOST_BORDER = 'rgba(255, 200, 30, 0.75)';

// ─────────────────────────────────────────────────────────────────────────────
// Overlay des Cultural Sites placés
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Dessine les zones de couverture happiness de tous les Cultural Sites placés.
 * Appelé avant drawEntities pour que les bâtiments soient par-dessus.
 */
export function drawHappinessOverlays(
  ctx: CanvasRenderingContext2D,
  vp: Viewport,
  entities: ReadonlyMap<number, CityMapEntity>,
): void {
  ctx.save();

  for (const entity of entities.values()) {
    if (!isCultureSite(entity.buildingDataId)) continue;
    drawCoverageSingle(ctx, vp, entity, false);
  }

  ctx.restore();
}

/**
 * Dessine l'overlay de couverture pour le ghost d'un Cultural Site.
 * Appelé après drawGhost pour que l'overlay soit visible avec le ghost.
 */
export function drawHappinessOverlayGhost(
  ctx: CanvasRenderingContext2D,
  vp: Viewport,
  ghost: CityMapEntity,
): void {
  if (!isCultureSite(ghost.buildingDataId)) return;
  ctx.save();
  drawCoverageSingle(ctx, vp, ghost, true);
  ctx.restore();
}

// ─────────────────────────────────────────────────────────────────────────────
// Helper interne
// ─────────────────────────────────────────────────────────────────────────────

function drawCoverageSingle(
  ctx: CanvasRenderingContext2D,
  vp: Viewport,
  entity: CityMapEntity,
  isGhost: boolean,
): void {
  const coverage = getCultureSiteCoverageRect(entity);
  if (!coverage) return;

  const ts = TILE_SIZE * vp.zoom;
  const sx = coverage.x * ts + vp.offset.x;
  const sy = coverage.y * ts + vp.offset.y;
  const sw = coverage.w * ts;
  const sh = coverage.h * ts;

  ctx.fillStyle   = isGhost ? COVERAGE_GHOST_FILL   : COVERAGE_FILL;
  ctx.strokeStyle = isGhost ? COVERAGE_GHOST_BORDER : COVERAGE_BORDER;
  ctx.lineWidth   = Math.max(1, vp.zoom * 1.5);
  // Pointillés pour distinguer de la bordure du bâtiment
  ctx.setLineDash([4 * vp.zoom, 2 * vp.zoom]);

  ctx.fillRect(sx, sy, sw, sh);
  ctx.strokeRect(sx, sy, sw, sh);

  ctx.setLineDash([]);
}
