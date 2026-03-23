// ─────────────────────────────────────────────────────────────────────────────
// expansionManager.ts
// Logique pure — état locked/unlocked des expansions par ville
//
// Système de coordonnées :
//   Raw (gamedesign.json) : y croît vers le haut (y élevé = haut de la grille jeu)
//   IDs 1-9 sont en max_x, max_y = coin TOP-RIGHT dans le jeu
//   Canvas               : y_canvas = (max_y_raw - raw_y) → flip Y
// ─────────────────────────────────────────────────────────────────────────────

import {
  CITY_GRID_DEFINITIONS,
  type CityId,
} from "../data/cityGridDefinitions";

export interface ExpansionGridRect {
  id: string;
  /** Coordonnées en tuiles, origin top-left, Y=0 en haut */
  x: number;
  y: number;
  w: number;
  h: number;
  type: "standard" | "blocker" | "connector" | "linked" | "detached_connector";
  subType?: "water" | "harbor";
}

export interface GridBounds {
  w: number;
  h: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// IDs débloqués par défaut (IDs 1-9 pour toutes les villes)
// ─────────────────────────────────────────────────────────────────────────────

export function getDefaultUnlockedExpansions(cityId: CityId): Set<string> {
  const def = CITY_GRID_DEFINITIONS[cityId];
  if (!def) return new Set();

  const standards = def.expansions
    .filter((e) => e.type === "standard" && !e.subType)
    .map((e) => {
      const m = e.id.match(/_(\d+)([a-z]?)$/);
      return { id: e.id, num: m ? parseInt(m[1]) : 9999 };
    })
    .sort((a, b) => a.num - b.num);

  return new Set(standards.slice(0, 9).map((s) => s.id));
}

// ─────────────────────────────────────────────────────────────────────────────
// Coordonnées canvas (Y flippé)
// ─────────────────────────────────────────────────────────────────────────────

export function getAllExpansionRects(cityId: CityId): ExpansionGridRect[] {
  const def = CITY_GRID_DEFINITIONS[cityId];
  if (!def) return [];

  // Exclure harbor
  const nonHarbor = def.expansions.filter((e) => e.subType !== "harbor");
  if (nonHarbor.length === 0) return [];

  const minX = Math.min(...nonHarbor.map((e) => e.x));
  const maxY = Math.max(...nonHarbor.map((e) => e.y));

  return nonHarbor.map((e) => ({
    id: e.id,
    x: e.x - minX, // normaliser X
    y: maxY - e.y, // flip Y : max_y devient y=0 (top)
    w: def.expansionSize,
    h: def.expansionSize,
    type: e.type,
    subType: e.subType,
  }));
}

export function getStandardExpansionRects(cityId: CityId): ExpansionGridRect[] {
  return getAllExpansionRects(cityId).filter(
    (e) => e.type === "standard" && !e.subType,
  );
}

export function getPlayableGridBounds(cityId: CityId): GridBounds {
  const rects = getStandardExpansionRects(cityId);
  if (rects.length === 0) return { w: 52, h: 52 };
  const maxX = Math.max(...rects.map((r) => r.x + r.w));
  const maxY = Math.max(...rects.map((r) => r.y + r.h));
  return { w: maxX, h: maxY };
}

// ─────────────────────────────────────────────────────────────────────────────
// Hit-test
// ─────────────────────────────────────────────────────────────────────────────

export function findExpansionAtCell(
  rects: ExpansionGridRect[],
  tileX: number,
  tileY: number,
): ExpansionGridRect | null {
  for (const rect of rects) {
    if (
      tileX >= rect.x &&
      tileX < rect.x + rect.w &&
      tileY >= rect.y &&
      tileY < rect.y + rect.h
    )
      return rect;
  }
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Validation placement — toutes les tuiles doivent être dans unlocked
// ─────────────────────────────────────────────────────────────────────────────

export function isRectInUnlockedArea(
  rects: ExpansionGridRect[],
  unlockedIds: Set<string>,
  tileX: number,
  tileY: number,
  tileW: number,
  tileH: number,
): boolean {
  for (let dx = 0; dx < tileW; dx++) {
    for (let dy = 0; dy < tileH; dy++) {
      const exp = findExpansionAtCell(rects, tileX + dx, tileY + dy);
      if (!exp || exp.type !== "standard" || !unlockedIds.has(exp.id))
        return false;
    }
  }
  return true;
}
