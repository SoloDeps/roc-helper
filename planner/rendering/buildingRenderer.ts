// ─────────────────────────────────────────────────────────────────────────────
// buildingRenderer.ts
// Dessin des entités placées et du ghost preview
// Phase 3 : placeholders colorés (rectangles)
// Phase 5+ : sprites depuis buildingDefinitions
// ─────────────────────────────────────────────────────────────────────────────

import { TILE_SIZE } from '../core/mapGrid';
import type { CityMapEntity } from '../core/cityMapEntity';
import type { Viewport } from './viewportManager';
import type { VisibleTiles } from './viewportManager';
import { isRectVisible } from './viewportManager';

// ─────────────────────────────────────────────────────────────────────────────
// Palette de couleurs par type de bâtiment (Phase 3 — placeholders)
// Phase 5+ : remplacé par les sprites
// ─────────────────────────────────────────────────────────────────────────────

const BUILDING_COLORS: Record<string, string> = {
  smallHome:         '#7C9E6E',
  averageHome:       '#5E8B5A',
  luxuriousHome:     '#3D6B3A',
  ruralFarm:         '#C4A84F',
  domesticFarm:      '#B09040',
  luxuriousFarm:     '#8C7030',
  littleCulture:     '#8B7CC8',
  compactCulture:    '#7A6CB8',
  moderateCulture:   '#6958A8',
  largeCulture:      '#584898',
  luxuriousCulture:  '#473888',
  premiumCulture:    '#362888',
  smallHome_allied:  '#6E9E8E',
  // Fallback pour tout bâtiment non listé
  _default:          '#5B8FB9',
};

function getBuildingColor(buildingDataId: string): string {
  return BUILDING_COLORS[buildingDataId] ?? BUILDING_COLORS._default;
}

// ─────────────────────────────────────────────────────────────────────────────
// Dessin des bâtiments placés
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Dessine toutes les entités placées visibles dans le viewport.
 * Culling intégré via isRectVisible().
 */
export function drawEntities(
  ctx: CanvasRenderingContext2D,
  vp: Viewport,
  entities: ReadonlyMap<number, CityMapEntity>,
  visible: VisibleTiles,
): void {
  const ts = TILE_SIZE * vp.zoom;

  ctx.save();

  for (const entity of entities.values()) {
    const b = entity.bounds;

    // Culling — ignorer les entités hors viewport
    if (!isRectVisible(b.x, b.y, b.w, b.h, visible)) continue;

    const sx = b.x * ts + vp.offset.x;
    const sy = b.y * ts + vp.offset.y;
    const sw = b.w * ts;
    const sh = b.h * ts;

    const color = getBuildingColor(entity.buildingDataId);

    // Fond du bâtiment
    ctx.fillStyle = color;
    ctx.fillRect(sx + 1, sy + 1, sw - 2, sh - 2);

    // Bordure
    ctx.strokeStyle = darken(color, 0.25);
    ctx.lineWidth   = Math.max(1, vp.zoom);
    ctx.strokeRect(sx + 1, sy + 1, sw - 2, sh - 2);

    // Label (visible seulement à partir d'un certain zoom)
    if (vp.zoom >= 0.6 && sw > 24) {
      drawEntityLabel(ctx, entity.buildingDataId, sx, sy, sw, sh, color);
    }
  }

  ctx.restore();
}

// ─────────────────────────────────────────────────────────────────────────────
// Dessin du ghost
// ─────────────────────────────────────────────────────────────────────────────

const GHOST_COLOR_VALID   = 'rgba(76, 175, 80, 0.5)';   // vert
const GHOST_COLOR_INVALID = 'rgba(244, 67, 54, 0.5)';   // rouge
const GHOST_BORDER_VALID  = 'rgba(56, 142, 60, 0.85)';
const GHOST_BORDER_INVALID= 'rgba(211, 47, 47, 0.85)';

/**
 * Dessine le ghost preview (bâtiment en cours de placement).
 * Vert si le placement est valide, rouge sinon.
 *
 * ⚠️ ghost.id === 0 — ne jamais passer au validator sans ignoreEntityId=0
 */
export function drawGhost(
  ctx: CanvasRenderingContext2D,
  vp: Viewport,
  ghost: CityMapEntity,
  isValid: boolean,
): void {
  const ts = TILE_SIZE * vp.zoom;
  const b  = ghost.bounds;

  const sx = b.x * ts + vp.offset.x;
  const sy = b.y * ts + vp.offset.y;
  const sw = b.w * ts;
  const sh = b.h * ts;

  ctx.save();

  ctx.fillStyle   = isValid ? GHOST_COLOR_VALID : GHOST_COLOR_INVALID;
  ctx.strokeStyle = isValid ? GHOST_BORDER_VALID : GHOST_BORDER_INVALID;
  ctx.lineWidth   = Math.max(1.5, vp.zoom * 1.5);

  ctx.fillRect(sx + 1, sy + 1, sw - 2, sh - 2);
  ctx.strokeRect(sx + 1, sy + 1, sw - 2, sh - 2);

  ctx.restore();
}

// ─────────────────────────────────────────────────────────────────────────────
// Highlight de sélection (Phase 6)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Dessine un contour de sélection autour d'une entité.
 */
export function drawSelectionOutline(
  ctx: CanvasRenderingContext2D,
  vp: Viewport,
  entity: CityMapEntity,
): void {
  const ts = TILE_SIZE * vp.zoom;
  const b  = entity.bounds;

  const sx = b.x * ts + vp.offset.x;
  const sy = b.y * ts + vp.offset.y;
  const sw = b.w * ts;
  const sh = b.h * ts;

  ctx.save();
  ctx.strokeStyle = '#FFD700';
  ctx.lineWidth   = Math.max(2, vp.zoom * 2);
  ctx.setLineDash([4, 2]);
  ctx.strokeRect(sx, sy, sw, sh);
  ctx.setLineDash([]);
  ctx.restore();
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers internes
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Dessine le label d'un bâtiment centré dans son rectangle.
 */
function drawEntityLabel(
  ctx: CanvasRenderingContext2D,
  buildingDataId: string,
  sx: number,
  sy: number,
  sw: number,
  sh: number,
  bgColor: string,
): void {
  // Nom court lisible (ex: 'smallHome' → 'Small Home')
  const label = buildingDataId
    .replace(/([A-Z])/g, ' $1')
    .trim()
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  const fontSize = Math.min(11, sw / label.length * 1.6);
  if (fontSize < 7) return;

  ctx.font         = `${fontSize}px sans-serif`;
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle    = lighten(bgColor, 0.8);
  ctx.fillText(label, sx + sw / 2, sy + sh / 2, sw - 4);
}

/**
 * Assombrit une couleur hex d'un facteur (0-1).
 */
function darken(hex: string, factor: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const d = (v: number) => Math.max(0, Math.round(v * (1 - factor)));
  return `rgb(${d(r)}, ${d(g)}, ${d(b)})`;
}

/**
 * Éclaircit une couleur hex vers le blanc d'un facteur (0-1).
 */
function lighten(hex: string, factor: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const l = (v: number) => Math.min(255, Math.round(v + (255 - v) * factor));
  return `rgb(${l(r)}, ${l(g)}, ${l(b)})`;
}
