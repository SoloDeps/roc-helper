/**
 * Grille de ville — couche de résolution du Layout Builder.
 *
 * Deux couches, comme les autres domaines :
 *
 *  1. `CITY_GRID_EXTRACT` — la projection brute du game design, générée par
 *     `pnpm extract:city-grid`. Fidèle, non indexée, non interprétée.
 *  2. `CityGrid` — la vue résolue que consomme l'app : une SURFACE d'une ville,
 *     indexée pour l'occupation et le placement en O(1).
 *
 * ⚠️ L'UNITÉ DE TRAVAIL EST LA SURFACE, PAS LA VILLE.
 *
 * `expansionSubType` partitionne une ville en grilles disjointes (cf.
 * data/city-grid/generated/types.ts). Capital = une grille terrestre 12x10
 * PLUS un port de 42 cases situé 36 unités plus au nord. Les traiter comme une
 * seule grille produirait une bounding box de 12x19 dont la moitié est vide.
 * Un layout du Layout Builder porte donc un `CityGridKey` — `City_Capital|LAND`
 * — et non un simple `cityId`.
 *
 * ⚠️ DEUX SYSTÈMES DE COORDONNÉES, jamais mélangés.
 *
 *  - MONDE (`x`, `y`) : l'unité du game design, celle des bâtiments
 *    (`BuildingDefinitionDTO.width/height`) et des zones de culture. C'est
 *    l'unité de TOUT ce module.
 *  - CASE D'EXPANSION : un bloc de `expansionSize`² unités monde (3 ou 4 selon
 *    la ville) — l'unité de déblocage, jamais celle du placement.
 *
 * Ce module ne connaît ni canvas, ni caméra, ni React : la conversion vers
 * l'écran (et l'inversion de l'axe Y) appartient à la couche de rendu.
 */

import { CITY_GRID_EXTRACT } from "@/data/city-grid/generated/city-grid.generated";
import type {
  BuildingRotation,
  CityGridBounds,
  CityGridExtract,
  CityGridSurface,
  CultureAreaExtract,
  ExpansionSlotExtract,
  ExpansionTypeCode,
  FixedBuildingExtract,
  SurfaceCode,
} from "@/data/city-grid/generated/types";

export type { SurfaceCode, CityGridBounds, BuildingRotation };

/** `City_Capital|LAND` — identifie une grille jouable. */
export type CityGridKey = `${string}|${SurfaceCode}`;

export function cityGridKey(cityId: string, surface: SurfaceCode): CityGridKey {
  return `${cityId}|${surface}`;
}

/** Rectangle en unités monde. Un bâtiment posé, une zone, une case. */
export interface WorldRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Une grille jouable résolue : une surface d'une ville, prête à être rendue et
 * à recevoir des bâtiments.
 */
export interface CityGrid {
  key: CityGridKey;
  cityId: string;
  surface: SurfaceCode;
  expansionSize: number;
  /** Cadrage des cases CONSTRUCTIBLES de cette surface, en unités monde. */
  bounds: CityGridBounds;
  cols: number;
  rows: number;
  /** `true` si les cases ne pavent pas entièrement `bounds` (cf. types.ts). */
  sparse: boolean;
  /** Cases constructibles de cette surface uniquement. */
  slots: ExpansionSlotExtract[];
  /** Sous-ensemble de `slots` débloqué au démarrage d'une nouvelle ville. */
  defaultUnlockedIds: ReadonlySet<string>;
  /** Zones de culture fixes recoupant cette surface. */
  cultureAreas: CultureAreaExtract[];
  /** Bâtiments posés d'office (Noria / Oasis) sur cette surface. */
  fixedBuildings: FixedBuildingExtract[];
}

// ─── Constructibilité ─────────────────────────────────────────────────────────
//
// Même prédicat que `scripts/extract/city-grid.ts`, redéclaré plutôt
// qu'importé : l'app ne doit pas dépendre d'un module de `scripts/**`, qui est
// compilé sous un autre tsconfig et pour Node. La règle est courte et son
// unique test de non-régression est dans city-grid.generated.test.ts.

/** BLOCKER et les connecteurs ne reçoivent jamais de bâtiment. */
export function isBuildableType(type: ExpansionTypeCode | null): boolean {
  return type === null || type === "LINKED";
}

// ─── Index ────────────────────────────────────────────────────────────────────

const EXTRACT_BY_CITY = new Map<string, CityGridExtract>(
  CITY_GRID_EXTRACT.cities.map((city) => [city.cityId, city]),
);

/** Ids de ville présents dans le game design, ordre stable. */
export const CITY_IDS: readonly string[] = CITY_GRID_EXTRACT.cities.map((c) => c.cityId);

function surfaceOf(city: CityGridExtract, surface: SurfaceCode): CityGridSurface | null {
  return city.surfaces.find((s) => s.surface === surface) ?? null;
}

/** Deux rectangles en unités monde se recoupent-ils ? Bords exclus. */
function overlaps(a: WorldRect, b: WorldRect): boolean {
  return (
    a.x < b.x + b.width &&
    b.x < a.x + a.width &&
    a.y < b.y + b.height &&
    b.y < a.y + a.height
  );
}

const GRID_CACHE = new Map<CityGridKey, CityGrid>();

/**
 * Résout une grille jouable. Mémoïsé : la donnée est statique, et
 * `buildableCells()` en dépend à chaque test de placement.
 *
 * Retourne `null` si la ville n'existe pas ou n'a pas cette surface — Mayas
 * n'a ni port ni eau, et c'est un cas normal, pas une erreur.
 */
export function getCityGrid(cityId: string, surface: SurfaceCode): CityGrid | null {
  const key = cityGridKey(cityId, surface);
  const cached = GRID_CACHE.get(key);
  if (cached) return cached;

  const city = EXTRACT_BY_CITY.get(cityId);
  if (!city) return null;
  const meta = surfaceOf(city, surface);
  if (!meta) return null;

  const slots = city.slots.filter(
    (slot) => slot.surface === surface && isBuildableType(slot.type),
  );

  // ⚠️ Les bâtiments fixes sont portés par des cases CONNECTOR (9/9), donc
  // absentes de `slots`. Les rattacher par appartenance à `slots` n'en
  // retiendrait aucun. On passe par la surface de leur case porteuse, cherchée
  // dans la liste COMPLÈTE des cases de la ville.
  const surfaceBySlotId = new Map(city.slots.map((s) => [s.id, s.surface]));
  const slotIds = new Set(slots.map((s) => s.id));

  const grid: CityGrid = {
    key,
    cityId,
    surface,
    expansionSize: city.expansionSize,
    bounds: meta.bounds,
    cols: meta.cols,
    rows: meta.rows,
    sparse: meta.sparse,
    slots,
    defaultUnlockedIds: new Set(
      city.defaultUnlockedIds.filter((id) => slotIds.has(id)),
    ),
    cultureAreas: city.cultureAreas.filter((area) => overlaps(area, meta.bounds)),
    fixedBuildings: city.fixedBuildings.filter(
      (fixed) => surfaceBySlotId.get(fixed.expansionId) === surface,
    ),
  };

  GRID_CACHE.set(key, grid);
  return grid;
}

/** Toutes les grilles jouables, toutes villes et surfaces confondues (8). */
export function listCityGrids(): CityGrid[] {
  const grids: CityGrid[] = [];
  for (const city of CITY_GRID_EXTRACT.cities) {
    for (const meta of city.surfaces) {
      const grid = getCityGrid(city.cityId, meta.surface);
      if (grid) grids.push(grid);
    }
  }
  return grids;
}

// ─── Occupation ───────────────────────────────────────────────────────────────

const CELLS_CACHE = new Map<CityGridKey, ReadonlySet<number>>();

/**
 * Encode une cellule 1x1 en unités monde sur un seul entier, pour indexer un
 * `Set<number>` plutôt qu'un `Set<string>` : pas d'allocation de chaîne dans
 * la boucle chaude du placement, et une comparaison entière.
 *
 * Les coordonnées vont de -25 à +51 ; le décalage de 128 les ramène dans
 * [0, 256[ et garde le produit très en deçà de 2^31.
 */
export function cellKey(x: number, y: number): number {
  return ((x + 128) << 9) | (y + 128);
}

/**
 * Les cellules 1x1 de la grille, développées depuis les cases d'expansion.
 * Mémoïsé par grille : c'est le socle du test de placement.
 */
export function buildableCells(grid: CityGrid): ReadonlySet<number> {
  const cached = CELLS_CACHE.get(grid.key);
  if (cached) return cached;

  const cells = new Set<number>();
  for (const slot of grid.slots) {
    for (let dx = 0; dx < grid.expansionSize; dx++) {
      for (let dy = 0; dy < grid.expansionSize; dy++) {
        cells.add(cellKey(slot.x + dx, slot.y + dy));
      }
    }
  }

  CELLS_CACHE.set(grid.key, cells);
  return cells;
}

/**
 * Les cellules effectivement disponibles : celles des cases DÉBLOQUÉES.
 * `unlockedIds` est l'état du layout côté joueur, pas une donnée de jeu — d'où
 * l'absence de mémoïsation ici, contrairement à `buildableCells`.
 */
export function unlockedCells(
  grid: CityGrid,
  unlockedIds: ReadonlySet<string>,
): Set<number> {
  const cells = new Set<number>();
  for (const slot of grid.slots) {
    if (!unlockedIds.has(slot.id)) continue;
    for (let dx = 0; dx < grid.expansionSize; dx++) {
      for (let dy = 0; dy < grid.expansionSize; dy++) {
        cells.add(cellKey(slot.x + dx, slot.y + dy));
      }
    }
  }
  return cells;
}

/**
 * Un rectangle tient-il entièrement dans l'ensemble de cellules fourni ?
 *
 * Ne teste QUE le terrain : la collision avec les bâtiments déjà posés
 * appartient à la couche simulation (Phase 5), qui compose les deux.
 */
export function fitsInCells(rect: WorldRect, cells: ReadonlySet<number>): boolean {
  for (let dx = 0; dx < rect.width; dx++) {
    for (let dy = 0; dy < rect.height; dy++) {
      if (!cells.has(cellKey(rect.x + dx, rect.y + dy))) return false;
    }
  }
  return true;
}

/**
 * La case d'expansion CONSTRUCTIBLE contenant une cellule monde, ou `null`.
 *
 * ⚠️ Ne voit pas les BLOCKER ni les CONNECTOR : une cellule qui retourne
 * `null` est soit hors grille, soit sur une case non constructible — ici les
 * deux se valent, rien ne s'y pose.
 */
export function slotAt(grid: CityGrid, x: number, y: number): ExpansionSlotExtract | null {
  const size = grid.expansionSize;
  for (const slot of grid.slots) {
    if (x >= slot.x && x < slot.x + size && y >= slot.y && y < slot.y + size) {
      return slot;
    }
  }
  return null;
}

/**
 * Emprise réelle d'un bâtiment, rotation appliquée. À 90° et 270° les
 * dimensions déclarées par `BuildingDefinitionDTO` sont inversées — les 5
 * Noria/Oasis d'Arabia posées à 90° en dépendent.
 */
export function rotatedFootprint(
  width: number,
  height: number,
  rotation: BuildingRotation,
): { width: number; height: number } {
  return rotation === 90 || rotation === 270
    ? { width: height, height: width }
    : { width, height };
}

/** Points de culture offerts d'office par le décor de cette grille. */
export function fixedCulturePoints(grid: CityGrid): number {
  return grid.cultureAreas.reduce((total, area) => total + area.points, 0);
}
