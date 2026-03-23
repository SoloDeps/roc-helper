import { TILE_SIZE } from "../core/mapGrid";
import type { Viewport } from "./viewportManager";
import type { ExpansionGridRect } from "../core/expansionManager";

const COLOR_LOCKED_FILL = "rgba(0, 0, 0, 0.18)";
const COLOR_LOCKED_BORDER = "rgba(80, 80, 80, 0.35)";

export function drawExpansions(
  ctx: CanvasRenderingContext2D,
  vp: Viewport,
  rects: ExpansionGridRect[],
  unlockedIds: Set<string>,
  canvasW: number,
  canvasH: number,
): void {
  ctx.save();
  const ts = TILE_SIZE * vp.zoom;

  for (const rect of rects) {
    const sx = rect.x * ts + vp.offset.x;
    const sy = rect.y * ts + vp.offset.y;
    const sw = rect.w * ts;
    const sh = rect.h * ts;

    if (sx + sw < 0 || sy + sh < 0 || sx > canvasW || sy > canvasH) continue;

    // Blockers et non-standard = invisibles (rien à afficher)
    if (rect.type !== "standard") continue;

    // Unlocked = transparent (grille normale visible dessous)
    if (unlockedIds.has(rect.id)) continue;

    // Locked = fond gris + cadenas
    ctx.fillStyle = COLOR_LOCKED_FILL;
    ctx.fillRect(sx, sy, sw, sh);

    ctx.strokeStyle = COLOR_LOCKED_BORDER;
    ctx.lineWidth = Math.max(1, vp.zoom * 0.8);
    ctx.setLineDash([4 * vp.zoom, 3 * vp.zoom]);
    ctx.strokeRect(sx + 1, sy + 1, sw - 2, sh - 2);
    ctx.setLineDash([]);

    if (vp.zoom >= 0.4 && sw > 20 && sh > 20) {
      drawLockIcon(ctx, sx + sw / 2, sy + sh / 2, vp.zoom);
    }
  }

  ctx.restore();
}

function drawLockIcon(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  zoom: number,
): void {
  const size = Math.max(8, Math.min(18, zoom * 14));
  const bw = size * 0.55;
  const bh = size * 0.45;
  const aw = bw * 0.6;
  const ah = size * 0.35;

  ctx.save();
  ctx.strokeStyle = "rgba(80, 80, 80, 0.7)";
  ctx.fillStyle = "rgba(80, 80, 80, 0.5)";
  ctx.lineWidth = Math.max(1, zoom * 1.2);
  ctx.lineCap = "round";

  const bx = cx - bw / 2;
  const by = cy - bh / 2 + ah * 0.3;
  const r = size * 0.08;
  ctx.beginPath();
  ctx.moveTo(bx + r, by);
  ctx.lineTo(bx + bw - r, by);
  ctx.arcTo(bx + bw, by, bx + bw, by + r, r);
  ctx.lineTo(bx + bw, by + bh - r);
  ctx.arcTo(bx + bw, by + bh, bx + bw - r, by + bh, r);
  ctx.lineTo(bx + r, by + bh);
  ctx.arcTo(bx, by + bh, bx, by + bh - r, r);
  ctx.lineTo(bx, by + r);
  ctx.arcTo(bx, by, bx + r, by, r);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, by, aw / 2, Math.PI, 0, false);
  ctx.stroke();
  ctx.restore();
}
