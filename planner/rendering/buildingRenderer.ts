// ─────────────────────────────────────────────────────────────────────────────
// buildingRenderer.ts
// Dessin des bâtiments placés, du ghost de placement et de la sélection,
// ainsi que des bâtiments fixes prédéfinis (Moth Glade, Kaolin Quarry…)
// ─────────────────────────────────────────────────────────────────────────────

import { TILE_SIZE } from "../core/mapGrid";
import type { Viewport, VisibleTiles } from "./viewportManager";
import type { FixedBuilding } from "../data/buildingDefinitions";
import type { CityMapEntity } from "../core/cityMapEntity";

// ─────────────────────────────────────────────────────────────────────────────
// Palette bâtiments placés
// ─────────────────────────────────────────────────────────────────────────────

const ENTITY_FILL = "rgba(180, 160, 120, 0.85)";
const ENTITY_STROKE = "rgba(100, 80, 50, 0.9)";
const GHOST_VALID_FILL = "rgba(100, 180, 100, 0.45)";
const GHOST_INVALID_FILL = "rgba(200, 60, 60, 0.45)";
const GHOST_VALID_STROKE = "rgba(60, 140, 60, 0.8)";
const GHOST_INVALID_STROKE = "rgba(180, 40, 40, 0.8)";
const SELECTION_STROKE = "rgba(60, 140, 220, 0.95)";

// ─────────────────────────────────────────────────────────────────────────────
// drawEntities — dessine toutes les entités placées sur la grille
// ─────────────────────────────────────────────────────────────────────────────

export function drawEntities(
  ctx: CanvasRenderingContext2D,
  vp: Viewport,
  entities: ReadonlyMap<number, CityMapEntity>,
  visible: VisibleTiles,
): void {
  if (entities.size === 0) return;
  ctx.save();

  const ts = TILE_SIZE * vp.zoom;

  for (const entity of entities.values()) {
    const b = entity.bounds;
    // Culling : skip si le rect est entièrement hors de la zone visible
    if (
      b.x + b.w <= visible.minX ||
      b.x > visible.maxX ||
      b.y + b.h <= visible.minY ||
      b.y > visible.maxY
    )
      continue;

    const sx = b.x * ts + vp.offset.x;
    const sy = b.y * ts + vp.offset.y;
    const sw = b.w * ts;
    const sh = b.h * ts;

    ctx.fillStyle = ENTITY_FILL;
    ctx.fillRect(sx + 1, sy + 1, sw - 2, sh - 2);

    ctx.strokeStyle = ENTITY_STROKE;
    ctx.lineWidth = Math.max(1, vp.zoom * 1.2);
    ctx.setLineDash([]);
    ctx.strokeRect(sx + 1, sy + 1, sw - 2, sh - 2);

    if (vp.zoom >= 0.4 && sw > 20 && sh > 12) {
      const label = entity.buildingDataId;
      const fontSize = Math.max(8, Math.min(11, sw * 0.2));
      ctx.font = `500 ${fontSize}px sans-serif`;
      ctx.fillStyle = "rgba(0,0,0,0.7)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(label, sx + sw / 2, sy + sh / 2, sw - 6);
    }
  }

  ctx.restore();
}

// ─────────────────────────────────────────────────────────────────────────────
// drawGhost — dessine l'aperçu de placement (valide ou invalide)
// ─────────────────────────────────────────────────────────────────────────────

export function drawGhost(
  ctx: CanvasRenderingContext2D,
  vp: Viewport,
  ghost: CityMapEntity,
  isValid: boolean,
): void {
  ctx.save();

  const ts = TILE_SIZE * vp.zoom;
  const b = ghost.bounds;
  const sx = b.x * ts + vp.offset.x;
  const sy = b.y * ts + vp.offset.y;
  const sw = b.w * ts;
  const sh = b.h * ts;

  ctx.fillStyle = isValid ? GHOST_VALID_FILL : GHOST_INVALID_FILL;
  ctx.strokeStyle = isValid ? GHOST_VALID_STROKE : GHOST_INVALID_STROKE;
  ctx.lineWidth = Math.max(1, vp.zoom * 1.5);
  ctx.setLineDash([]);

  ctx.fillRect(sx + 1, sy + 1, sw - 2, sh - 2);
  ctx.strokeRect(sx + 1, sy + 1, sw - 2, sh - 2);

  ctx.restore();
}

// ─────────────────────────────────────────────────────────────────────────────
// drawSelectionOutline — contour bleu autour de l'entité sélectionnée
// ─────────────────────────────────────────────────────────────────────────────

export function drawSelectionOutline(
  ctx: CanvasRenderingContext2D,
  vp: Viewport,
  entity: CityMapEntity,
): void {
  ctx.save();

  const ts = TILE_SIZE * vp.zoom;
  const b = entity.bounds;
  const sx = b.x * ts + vp.offset.x;
  const sy = b.y * ts + vp.offset.y;
  const sw = b.w * ts;
  const sh = b.h * ts;

  const gap = Math.max(2, vp.zoom * 2);
  ctx.strokeStyle = SELECTION_STROKE;
  ctx.lineWidth = Math.max(1.5, vp.zoom * 2);
  ctx.setLineDash([5 * vp.zoom, 3 * vp.zoom]);
  ctx.strokeRect(sx - gap, sy - gap, sw + gap * 2, sh + gap * 2);
  ctx.setLineDash([]);

  ctx.restore();
}

// ─────────────────────────────────────────────────────────────────────────────
// Palette — gris neutre pour les bâtiments fixes (non-constructibles)
// Bridges = gris, extractionPoints = vert pâle, irrigation = bleu pâle, etc.
// ─────────────────────────────────────────────────────────────────────────────

const FIXED_BUILDING_COLORS: Record<string, string> = {
  // China
  mothGlade: "#A8C5A0",
  kaolinQuarry: "#A8C5A0",
  // Arabia
  largeIrrigation: "#7BAEC8",
  mediumIrrigation: "#7BAEC8",
  smallIrrigation: "#7BAEC8",
  // Egypt
  irrigationStation: "#7BAEC8",
  channel: "#7BAEC8",
  smallWell: "#7BAEC8",
  waterPump: "#7BAEC8",
  averagePapyrusField: "#A8C5A0",
  averageGoldMine: "#C8B86A",
  // Mayas
  jadeQuarry: "#A8C5A0",
  obsidianQuarry: "#8A9BA8",
  averageAviary: "#C8A87A",
  // Vikings
  averageBeehive: "#C8B86A",
  averagePier: "#9AABB8",
  // Fallback
  _default: "#A8A8A8",
};

function getColor(group: string): string {
  return FIXED_BUILDING_COLORS[group] ?? FIXED_BUILDING_COLORS._default;
}

function darken(hex: string, amount: number): string {
  const n = parseInt(hex.replace("#", ""), 16);
  const r = Math.max(0, (n >> 16) - Math.round(255 * amount));
  const g = Math.max(0, ((n >> 8) & 0xff) - Math.round(255 * amount));
  const b = Math.max(0, (n & 0xff) - Math.round(255 * amount));
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

/** Humanise un group camelCase → "Moth Glade" */
function humanizeName(group: string): string {
  return (
    group
      .replace(/^average|^small|^medium|^large/, "")
      .replace(/([A-Z])/g, " $1")
      .trim() || group
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Rendu
// ─────────────────────────────────────────────────────────────────────────────

export function drawFixedBuildings(
  ctx: CanvasRenderingContext2D,
  vp: Viewport,
  buildings: FixedBuilding[],
  canvasW: number,
  canvasH: number,
): void {
  if (buildings.length === 0) return;
  ctx.save();

  const ts = TILE_SIZE * vp.zoom;

  for (const b of buildings) {
    const sx = b.x * ts + vp.offset.x;
    const sy = b.y * ts + vp.offset.y;
    const sw = b.w * ts;
    const sh = b.h * ts;

    // Culling
    if (sx + sw < 0 || sy + sh < 0 || sx > canvasW || sy > canvasH) continue;

    const color = getColor(b.group);

    // Fond
    ctx.fillStyle = color;
    ctx.fillRect(sx + 1, sy + 1, sw - 2, sh - 2);

    // Bordure
    ctx.strokeStyle = darken(color, 0.2);
    ctx.lineWidth = Math.max(1, vp.zoom);
    ctx.setLineDash([]);
    ctx.strokeRect(sx + 1, sy + 1, sw - 2, sh - 2);

    // Nom
    if (vp.zoom >= 0.45 && sw > 20 && sh > 12) {
      const name = humanizeName(b.group);
      const fontSize = Math.max(8, Math.min(11, sw * 0.2));
      ctx.font = `500 ${fontSize}px sans-serif`;
      ctx.fillStyle = "rgba(0,0,0,0.65)";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Tronquer si trop long
      ctx.fillText(name, sx + sw / 2, sy + sh / 2, sw - 6);
    }
  }

  ctx.restore();
}
