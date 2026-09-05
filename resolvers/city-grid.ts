/**
 * Grille de ville — couche de résolution du Layout Builder.
 *
 * Deux couches, comme les autres domaines :
 *
 *  1. `CITY_GRID_EXTRACT` — la projection brute du game design, générée par
 *     `pnpm extract:city-grid`. Fidèle, non indexée, non interprétée.
 *  2. `CityMap` — la vue résolue que consomme l'app : une AIRE jouable,
 *     indexée pour l'occupation et le placement en O(1).
 *
 * ⚠️ L'UNITÉ DE TRAVAIL EST LA CARTE, PAS LA VILLE — NI LA SURFACE.
 *
 * Le jeu range les 832 cases dans une grille de coordonnées UNIQUE par ville.
 * Ce n'est pas ce que le joueur manipule : la Capitale et son Port sont deux
 * lieux distincts, qu'on veut pouvoir ouvrir séparément (quelqu'un qui n'a pas
 * débloqué le Port ne doit pas le voir ; quelqu'un qui travaille son Port ne
 * doit pas être encombré par la Capitale).
 *
 * Le découpage se dérive des données, il ne se saisit pas — via
 * `expansionSubType`, puis un test de DISJONCTION SPATIALE :
 *
 *   City_Capital  LAND  x[3..51]  y[11..51]   ┐ boîtes DISJOINTES
 *                 HARBOR x[23..51] y[-25..-1] ┘ → 2 cartes
 *   City_Vikings  LAND  x[9..51]  y[12..51]   ┐ boîtes QUI SE RECOUPENT
 *                 WATER x[21..39] y[12..39]   ┘ → 1 carte, 2 terrains
 *
 * Une surface n'est donc PAS une carte. L'eau viking est du terrain entrelacé
 * dans la carte viking (0 cellule commune avec la terre, mais imbriquée
 * dedans) ; le port de la Capitale est un lieu à part. D'où :
 *
 *  - `CityMap` — ce que le joueur choisit et ce qu'un layout référence.
 *    Nommée « carte » et non « aire » : le mot est l'homophone d'« ère », qui
 *    est un axe DISTINCT et tout aussi structurant (cf. ci-dessous).
 *  - `SurfaceCode` — la nature du terrain d'une case, à l'intérieur d'une aire.
 *    C'est elle qui interdit de poser un bâtiment terrestre sur l'eau, et elle
 *    qui sélectionne la palette (cf. §"Jointure avec le catalogue" ci-dessous).
 *
 * ⚠️ SECOND AXE : L'ÈRE PLANCHER.
 *
 * Une carte n'est pas jouable à toutes les ères. Le Port de la Capitale ne
 * s'ouvre qu'en EG/LG, la carte viking en FA, l'Arabie en KS. Le plancher se
 * DÉDUIT de la palette : l'âge du plus ancien bâtiment de la surface (cf.
 * `CityGridSurface.minAge`). Aucun champ ne le déclare — c'est une déduction
 * corroborée par le jeu, pas une donnée.
 *
 * Conséquence produit : un joueur qui choisit une ère ne doit se voir proposer
 * que les cartes déjà ouvertes à cette ère — `listCityMaps({ era })`.
 *
 * ⚠️ JOINTURE AVEC LE CATALOGUE DE BÂTIMENTS.
 *
 * `BuildingDefinitionDTO.expansionSubType` emploie EXACTEMENT le même
 * vocabulaire que celui des cases : 22 bâtiments HARBOR, 12 WATER, 659 sans
 * sous-type. Le couple (ville, surface) détermine donc à la fois la grille ET
 * la palette, sans aucune table de correspondance à maintenir à la main.
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
import { ERA_BY_GAME_DESIGN_AGE, ERA_ORDER } from "@/data/config";
import type { EraCode } from "@/types/shared";
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

/**
 * `City_Capital|LAND` — identifie une aire jouable. La partie droite est la
 * surface PRIMAIRE de l'aire (LAND quand elle en a une, sinon son unique
 * surface), pas la liste de ses terrains : c'est un identifiant stable, à
 * persister dans les layouts Dexie.
 */
export type CityMapKey = `${string}|${SurfaceCode}`;

export function cityMapKey(cityId: string, primary: SurfaceCode): CityMapKey {
  return `${cityId}|${primary}`;
}

/** Rectangle en unités monde. Un bâtiment posé, une zone, une case. */
export interface WorldRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Une aire jouable résolue : ce que le joueur ouvre dans l'éditeur, prêt à
 * être rendu et à recevoir des bâtiments.
 */
export interface CityMap {
  key: CityMapKey;
  cityId: string;
  /** « Capital City », depuis la loca. */
  cityLabel: string;
  /** « Capital City » ou « Harbor » — ce qui s'affiche dans le sélecteur. */
  label: string;
  /** Surface primaire, celle qui porte la clé. */
  surface: SurfaceCode;
  /**
   * Ère à partir de laquelle cette carte est jouable — la plus ancienne de
   * ses surfaces. `null` si indéterminable.
   *
   * ⚠️ Déduit de la palette, jamais déclaré (cf. en-tête). Capitale = `SA`
   * (dès le départ), Port = `EG`, Vikings = `FA`, Arabie = `KS`.
   */
  minEra: EraCode | null;
  /**
   * Tous les terrains présents dans cette aire, primaire en tête.
   * `["LAND"]` · `["HARBOR"]` · `["LAND", "WATER"]` pour les Vikings.
   */
  surfaces: SurfaceCode[];
  expansionSize: number;
  /** Cadrage des cases CONSTRUCTIBLES de l'aire entière, en unités monde. */
  bounds: CityGridBounds;
  cols: number;
  rows: number;
  /** `true` si les cases ne pavent pas entièrement `bounds` (cf. types.ts). */
  sparse: boolean;
  /** Cases constructibles de l'aire, tous terrains confondus. */
  slots: ExpansionSlotExtract[];
  /** Sous-ensemble de `slots` débloqué au démarrage d'une nouvelle ville. */
  defaultUnlockedIds: ReadonlySet<string>;
  /** Zones de culture fixes recoupant cette aire. */
  cultureAreas: CultureAreaExtract[];
  /** Bâtiments posés d'office (Noria / Oasis) dans cette aire. */
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


/** Deux rectangles en unités monde se recoupent-ils ? Bords exclus. */
function overlaps(a: WorldRect, b: WorldRect): boolean {
  return (
    a.x < b.x + b.width &&
    b.x < a.x + a.width &&
    a.y < b.y + b.height &&
    b.y < a.y + a.height
  );
}

/**
 * Regroupe les surfaces d'une ville en AIRES, par disjonction spatiale.
 *
 * Deux surfaces dont les boîtes englobantes se recoupent décrivent le même
 * lieu (l'eau viking traverse la carte viking) et forment une seule aire ;
 * deux boîtes disjointes décrivent deux lieux (le port est au nord de la
 * Capitale, 36 unités plus haut) et forment deux aires.
 *
 * Fusion transitive : si A recoupe B et B recoupe C, les trois n'en font
 * qu'une, même si A et C ne se touchent pas. Aucune ville n'a plus de deux
 * surfaces aujourd'hui — l'algorithme n'en suppose pas moins.
 */
function groupSurfacesIntoMaps(surfaces: CityGridSurface[]): CityGridSurface[][] {
  const areas: CityGridSurface[][] = [];
  for (const surface of surfaces) {
    const touching = areas.filter((area) =>
      area.some((member) => overlaps(member.bounds, surface.bounds)),
    );
    if (touching.length === 0) {
      areas.push([surface]);
      continue;
    }
    // Fusion : le premier groupe absorbe les autres et la surface courante.
    const [first, ...rest] = touching;
    first.push(surface);
    for (const other of rest) {
      first.push(...other);
      areas.splice(areas.indexOf(other), 1);
    }
  }
  return areas;
}

/**
 * Surface primaire d'une aire : LAND si présente, sinon la seule qu'il y a.
 * C'est elle qui porte la clé de l'aire et qui décide du libellé.
 */
function primarySurface(surfaces: SurfaceCode[]): SurfaceCode {
  return surfaces.includes("LAND") ? "LAND" : surfaces[0];
}

/**
 * Libellé d'aire. Une aire terrestre porte le nom de sa ville ; une aire
 * détachée porte le nom de son terrain.
 *
 * ⚠️ Ces deux libellés sont une convention DE NOTRE PART : la loca nomme les
 * 6 villes (`Base.Cities.<id>_Name`) mais ne nomme aucune sous-zone. « Harbor »
 * est repris du préfixe des 22 bâtiments `Building_Harbor_*`.
 */
const DETACHED_MAP_LABELS: Record<Exclude<SurfaceCode, "LAND">, string> = {
  HARBOR: "Harbor",
  WATER: "Water",
};

function mapLabel(cityLabel: string, primary: SurfaceCode): string {
  return primary === "LAND" ? cityLabel : DETACHED_MAP_LABELS[primary];
}

/**
 * Ère plancher d'une carte : la plus ANCIENNE de ses surfaces — une carte est
 * jouable dès que l'un de ses terrains l'est.
 *
 * ⚠️ `ERA_ORDER` est l'ordre chronologique de l'app, pas
 * `AgeDefinition.order` qui n'est pas dense (il saute 16). Un âge du game
 * design sans ère correspondante côté app (`ComingSoon`) est ignoré, pas
 * traité comme le plus ancien.
 */
/**
 * Âges du game design ANTÉRIEURS à la première ère de l'app.
 *
 * `DawnAge` (order 1) précède `StoneAge` (order 2), première ère de `ERAS`.
 * Une carte qui plancher là est ouverte dès le début : la rabattre sur `SA`
 * est exact, alors que la laisser à `null` (« indéterminable ») serait faux.
 * C'est le cas de la Capitale.
 */
const PRE_APP_AGES: ReadonlySet<string> = new Set(["DawnAge"]);

function minEraOf(surfaces: CityGridSurface[]): EraCode | null {
  let best: EraCode | null = null;
  for (const surface of surfaces) {
    if (surface.minAge === null) continue;
    const era = PRE_APP_AGES.has(surface.minAge)
      ? ERA_ORDER[0]
      : ERA_BY_GAME_DESIGN_AGE.get(surface.minAge);
    // Âge inconnu de l'app et non antérieur (ex. `ComingSoon`) : ignoré, pas
    // traité comme le plus ancien.
    if (era === undefined) continue;
    if (best === null || ERA_ORDER.indexOf(era) < ERA_ORDER.indexOf(best)) {
      best = era;
    }
  }
  return best;
}

/**
 * Boîte englobante d'un lot de cases, en unités monde. `x`/`y` sont les
 * ORIGINES des cases : le bord max s'étend de `expansionSize`.
 */
function boundsOf(
  slots: ExpansionSlotExtract[],
  expansionSize: number,
): CityGridBounds | null {
  if (slots.length === 0) return null;
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const slot of slots) {
    if (slot.x < minX) minX = slot.x;
    if (slot.x > maxX) maxX = slot.x;
    if (slot.y < minY) minY = slot.y;
    if (slot.y > maxY) maxY = slot.y;
  }
  return {
    x: minX,
    y: minY,
    width: maxX - minX + expansionSize,
    height: maxY - minY + expansionSize,
  };
}

const MAP_CACHE = new Map<string, CityMap[]>();

/** Toutes les aires d'une ville, aire terrestre en tête. */
export function getCityMaps(cityId: string): CityMap[] {
  const cached = MAP_CACHE.get(cityId);
  if (cached) return cached;

  const city = EXTRACT_BY_CITY.get(cityId);
  if (!city) return [];

  // ⚠️ Les bâtiments fixes sont portés par des cases CONNECTOR (9/9), donc
  // absentes des cases constructibles. Les rattacher par appartenance à
  // celles-ci n'en retiendrait aucun : on passe par la surface de leur case
  // porteuse, cherchée dans la liste COMPLÈTE des cases de la ville.
  const surfaceBySlotId = new Map(city.slots.map((s) => [s.id, s.surface]));

  const areas: CityMap[] = [];
  for (const group of groupSurfacesIntoMaps(city.surfaces)) {
    const codes = group.map((g) => g.surface);
    const primary = primarySurface(codes);
    const members = new Set<SurfaceCode>(codes);

    const slots = city.slots.filter(
      (slot) => members.has(slot.surface) && isBuildableType(slot.type),
    );
    const slotIds = new Set(slots.map((s) => s.id));

    const bounds = boundsOf(slots, city.expansionSize);
    if (!bounds) continue;
    const cols = bounds.width / city.expansionSize;
    const rows = bounds.height / city.expansionSize;

    areas.push({
      key: cityMapKey(cityId, primary),
      cityId,
      cityLabel: city.cityLabel,
      label: mapLabel(city.cityLabel, primary),
      surface: primary,
      minEra: minEraOf(group),
      // Primaire en tête, le reste dans l'ordre stable de l'extraction.
      surfaces: [primary, ...codes.filter((c) => c !== primary)],
      expansionSize: city.expansionSize,
      bounds,
      cols,
      rows,
      sparse: slots.length < cols * rows,
      slots,
      defaultUnlockedIds: new Set(
        city.defaultUnlockedIds.filter((id) => slotIds.has(id)),
      ),
      cultureAreas: city.cultureAreas.filter((area) => overlaps(area, bounds)),
      fixedBuildings: city.fixedBuildings.filter((fixed) =>
        members.has(surfaceBySlotId.get(fixed.expansionId) ?? "LAND"),
      ),
    });
  }

  areas.sort((a, b) => (a.surface === "LAND" ? -1 : b.surface === "LAND" ? 1 : 0));
  MAP_CACHE.set(cityId, areas);
  return areas;
}

/**
 * Résout une aire par sa clé persistée (`City_Capital|HARBOR`).
 * `null` si la ville ou l'aire n'existe pas — Mayas n'a pas de port, et c'est
 * un cas normal, pas une erreur.
 */
export function getCityMap(key: CityMapKey): CityMap | null {
  const cityId = key.slice(0, key.lastIndexOf("|"));
  return getCityMaps(cityId).find((area) => area.key === key) ?? null;
}

/**
 * Les 7 cartes jouables, toutes villes confondues — le catalogue du sélecteur.
 *
 * Avec `era`, ne retourne que celles déjà ouvertes à cette ère : c'est ce qui
 * évite de proposer le Port à un joueur qui n'a pas atteint EG. Une carte dont
 * l'ère plancher est indéterminable (`minEra === null`) est TOUJOURS proposée
 * — mieux vaut une carte de trop qu'une carte manquante par déduction ratée.
 */
export function listCityMaps(options?: { era?: EraCode }): CityMap[] {
  const all = CITY_GRID_EXTRACT.cities.flatMap((city) => getCityMaps(city.cityId));
  const era = options?.era;
  if (era === undefined) return all;
  const ceiling = ERA_ORDER.indexOf(era);
  return all.filter(
    (map) => map.minEra === null || ERA_ORDER.indexOf(map.minEra) <= ceiling,
  );
}

/** Une carte est-elle jouable à cette ère ? */
export function isCityMapUnlocked(map: CityMap, era: EraCode): boolean {
  return map.minEra === null || ERA_ORDER.indexOf(map.minEra) <= ERA_ORDER.indexOf(era);
}

// ─── Occupation ───────────────────────────────────────────────────────────────

const CELLS_CACHE = new Map<string, ReadonlySet<number>>();

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

/** Développe des cases d'expansion en cellules 1x1. */
function expand(slots: ExpansionSlotExtract[], expansionSize: number): Set<number> {
  const cells = new Set<number>();
  for (const slot of slots) {
    for (let dx = 0; dx < expansionSize; dx++) {
      for (let dy = 0; dy < expansionSize; dy++) {
        cells.add(cellKey(slot.x + dx, slot.y + dy));
      }
    }
  }
  return cells;
}

/**
 * Les cellules 1x1 constructibles d'une aire — socle du test de placement.
 *
 * Sans `surface`, toute l'aire. Avec, uniquement ce terrain : c'est ainsi
 * qu'on interdit un bâtiment terrestre sur l'eau viking, en intersectant avec
 * la surface exigée par sa définition (`BuildingDefinitionDTO.expansionSubType`).
 *
 * Mémoïsé : la donnée est statique et le placement y accède en boucle.
 */
export function buildableCells(
  area: CityMap,
  surface?: SurfaceCode,
): ReadonlySet<number> {
  const key = surface ? `${area.key}#${surface}` : area.key;
  const cached = CELLS_CACHE.get(key);
  if (cached) return cached;

  const slots = surface
    ? area.slots.filter((slot) => slot.surface === surface)
    : area.slots;
  const cells = expand(slots, area.expansionSize);

  CELLS_CACHE.set(key, cells);
  return cells;
}

/**
 * Les cellules effectivement disponibles : celles des cases DÉBLOQUÉES.
 * `unlockedIds` est l'état du layout côté joueur, pas une donnée de jeu — d'où
 * l'absence de mémoïsation ici, contrairement à `buildableCells`.
 */
export function unlockedCells(
  area: CityMap,
  unlockedIds: ReadonlySet<string>,
): Set<number> {
  return expand(
    area.slots.filter((slot) => unlockedIds.has(slot.id)),
    area.expansionSize,
  );
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
 * ⚠️ Ne voit ni les BLOCKER ni les CONNECTOR : une cellule qui retourne `null`
 * est soit hors aire, soit sur une case non constructible — ici les deux se
 * valent, rien ne s'y pose.
 */
export function slotAt(
  area: CityMap,
  x: number,
  y: number,
): ExpansionSlotExtract | null {
  const size = area.expansionSize;
  for (const slot of area.slots) {
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

/** Points de culture offerts d'office par le décor de cette aire. */
export function fixedCulturePoints(area: CityMap): number {
  return area.cultureAreas.reduce((total, zone) => total + zone.points, 0);
}
