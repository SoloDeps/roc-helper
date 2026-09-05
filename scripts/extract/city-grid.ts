// ============================================================
// ROC Helper – Extraction du domaine Grille de ville
//
// Lit `source/gamedesign.json` + `source/loca.json` et écrit
// `data/city-grid/generated/city-grid.generated.ts`.
//
// Le game design est la SEULE source de vérité. Aucune donnée de l'ancien
// prototype de layout builder n'est lue, importée ni consultée : ce module
// reconstruit la grille depuis les DTO bruts.
//
// Structure des données : docs/game-schema/03-batiments.md §7
//   - §7.1 : `ExpansionDefinitionDTO` — 832 cases, 598 sans `expansionType`
//   - §7.3 : `CityInitDefinitionDTO` — les cases débloquées au démarrage
//   - §7.2 : `ExpansionCostsDTO` — DÉLIBÉRÉMENT ignoré (hors besoin produit,
//            cf. point B3 : le Layout Builder n'utilise pas les coûts)
//   - §2   : `BuildingDefinitionDTO.expansionSubType` — MÊME vocabulaire que
//            celui des cases. C'est la jointure qui donne, par surface, la
//            palette de bâtiments et donc l'ÈRE PLANCHER de la surface.
// Conventions          : docs/game-schema/00-conventions.md
//   - C2 : pas de `@type` sur les objets imbriqués monomorphes
//          (`initialGridAreas[]` n'en a pas — normal, ce n'est pas une anomalie)
//   - C3 : `x`, `y`, `width`, `height`, `points`, `expansionSize` sont des
//          NOMBRES, pas des int64 en string
//   - C5 : `cityInitDefinition` est une copie intégrale — lue comme une
//          référence résolue, sans aller chercher l'entité racine
//   - C7 : libellé via `Base.Cities.<City.id>_Name` ; une clé absente est un
//          libellé absent, pas une erreur
//
// Usage : pnpm extract:city-grid
// ============================================================

import fs from "node:fs";
import path from "node:path";

import type {
  BuildingRotation,
  CityGridBounds,
  CityGridExtract,
  CityGridExtractBundle,
  CityGridSurface,
  CultureAreaExtract,
  ExpansionSlotExtract,
  ExpansionTypeCode,
  FixedBuildingExtract,
  SurfaceCode,
} from "../../data/city-grid/generated/types";

// ─── Accès JSON typé ──────────────────────────────────────────────────────────

type Json = unknown;
type JsonObject = { [key: string]: Json };

function isObject(v: Json): v is JsonObject {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function asObject(v: Json): JsonObject {
  return isObject(v) ? v : {};
}

function asArray(v: Json): Json[] {
  return Array.isArray(v) ? v : [];
}

function asString(v: Json): string | null {
  return typeof v === "string" ? v : null;
}

/** C3 : ces champs sont des int32/float JSON. Une string ici serait un signal. */
function asNumber(v: Json): number | null {
  return typeof v === "number" && Number.isFinite(v) ? v : null;
}

/** Nom court d'un `@type` (`type.googleapis.com/Foo` → `Foo`), cf. C2. */
function typeName(v: Json): string {
  return (asString(asObject(v)["@type"]) ?? "").split("/").pop() ?? "";
}

function requireNumber(v: Json, what: string): number {
  const n = asNumber(v);
  if (n === null) throw new Error(`${what} : nombre attendu, reçu ${JSON.stringify(v)}`);
  return n;
}

function requireString(v: Json, what: string): string {
  const s = asString(v);
  if (s === null) throw new Error(`${what} : chaîne attendue, reçu ${JSON.stringify(v)}`);
  return s;
}

// ─── Enums ────────────────────────────────────────────────────────────────────

const EXPANSION_TYPES: ReadonlySet<string> = new Set<ExpansionTypeCode>([
  "BLOCKER",
  "LINKED",
  "CONNECTOR",
  "DETACHED_CONNECTOR",
]);

const SURFACES: ReadonlySet<string> = new Set<SurfaceCode>(["HARBOR", "WATER"]);

const ROTATIONS: ReadonlyMap<string, BuildingRotation> = new Map([
  ["ROTATION_0", 0],
  ["ROTATION_90", 90],
  ["ROTATION_180", 180],
  ["ROTATION_270", 270],
]);

/**
 * `BuildingRotationType_ROTATION_90` → `90`.
 *
 * ⚠️ Contre-exemple de C3 : ce champ géométrique est un ENUM STRING, là où
 * `x`, `y`, `width` et `height` sont des nombres. Le lire avec un parseur
 * numérique le ramènerait silencieusement à 0 et ferait poser 5 des 9
 * bâtiments fixes d'Arabia dans le mauvais sens.
 */
function parseRotation(v: Json, what: string): BuildingRotation {
  const raw = asString(v);
  // Absence = 0 : omission protobuf d'une valeur par défaut.
  if (raw === null) {
    if (v !== undefined) throw new Error(`${what} : rotation non textuelle ${JSON.stringify(v)}`);
    return 0;
  }
  const rotation = ROTATIONS.get(raw.replace(/^BuildingRotationType_/, ""));
  if (rotation === undefined) throw new Error(`${what} : rotation inconnue « ${raw} »`);
  return rotation;
}

/**
 * `ExpansionType_BLOCKER` → `BLOCKER`. Retourne `null` pour l'ABSENCE (598
 * cases) et lève sur une valeur inconnue : une 5e valeur apparue dans une
 * future version du game design doit casser l'extraction, pas être avalée.
 */
function parseExpansionType(v: Json, what: string): ExpansionTypeCode | null {
  const raw = asString(v);
  if (raw === null) return null;
  const code = raw.replace(/^ExpansionType_/, "");
  if (!EXPANSION_TYPES.has(code)) {
    throw new Error(`${what} : expansionType inconnu « ${raw} »`);
  }
  return code as ExpansionTypeCode;
}

/** `ExpansionSubType_HARBOR` → `HARBOR`. Absence → `LAND` (convention). */
function parseSurface(v: Json, what: string): SurfaceCode {
  const raw = asString(v);
  if (raw === null) return "LAND";
  const code = raw.replace(/^ExpansionSubType_/, "");
  if (!SURFACES.has(code)) {
    throw new Error(`${what} : expansionSubType inconnu « ${raw} »`);
  }
  return code as SurfaceCode;
}

// ─── Règle de constructibilité ────────────────────────────────────────────────
//
// UN SEUL endroit décide de ce qui est constructible, ici et dans
// `resolvers/city-grid.ts` (même prédicat, réexporté côté app).
//
// BLOCKER (188) = zone morte, CONNECTOR / DETACHED_CONNECTOR (23) = ponts et
// raccords : aucun des trois ne reçoit de bâtiment. Restent l'absence de type
// (598) et LINKED (23), qui portent la surface réellement jouable.

export function isBuildableType(type: ExpansionTypeCode | null): boolean {
  return type === null || type === "LINKED";
}

// ─── Extraction ───────────────────────────────────────────────────────────────

interface RawCity {
  id: string;
  definition: JsonObject;
}

/** `Base.Cities.City_Capital_Name` → « Capital City ». C7. */
function readLoca(root: string): Map<string, string> {
  const file = path.join(root, "source", "loca.json");
  const parsed = JSON.parse(fs.readFileSync(file, "utf8")) as Json;
  const envelope = asObject(asArray(asObject(parsed)["content"])[0]);
  const labels = new Map<string, string>();
  for (const entry of asArray(envelope["translations"])) {
    const e = asObject(entry);
    const key = asString(e["key"]);
    const value = asString(asArray(e["values"])[0]);
    if (key !== null && value !== null) labels.set(key, value);
  }
  return labels;
}

function readGameDesign(root: string): {
  entities: Json[];
  checksum: string;
  serverVersion: string;
} {
  const file = path.join(root, "source", "gamedesign.json");
  const parsed = JSON.parse(fs.readFileSync(file, "utf8")) as Json;
  const envelope = asObject(asArray(asObject(parsed)["content"])[0]);
  return {
    entities: asArray(envelope["content"]),
    checksum: asString(envelope["checksum"]) ?? "",
    serverVersion: asString(envelope["serverVersion"]) ?? "",
  };
}

/** Bounding box en unités monde des cases fournies. `null` si aucune. */
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
  // `x`/`y` sont les ORIGINES des cases : le bord max s'étend de expansionSize.
  return {
    x: minX,
    y: minY,
    width: maxX - minX + expansionSize,
    height: maxY - minY + expansionSize,
  };
}

function extractCulture(city: JsonObject): CultureAreaExtract[] {
  const areas: CultureAreaExtract[] = [];
  for (const component of asArray(city["components"])) {
    if (typeName(component) !== "CityCultureAreaComponentDTO") continue;
    const c = asObject(component);
    const id = requireString(c["id"], "CityCultureArea.id");
    areas.push({
      id,
      x: requireNumber(c["x"], `${id}.x`),
      y: requireNumber(c["y"], `${id}.y`),
      width: requireNumber(c["width"], `${id}.width`),
      height: requireNumber(c["height"], `${id}.height`),
      points: requireNumber(c["points"], `${id}.points`),
    });
  }
  return areas;
}

/**
 * C5 : `cityInitDefinition` est une copie intégrale de l'entité racine — on la
 * lit sur place plutôt que de résoudre l'id, ce qui évite de dépendre des 18
 * `CityInitDefinitionDTO` orphelins (§7.3).
 */
function extractInitialGrid(city: JsonObject): {
  expansionSize: number;
  unlockedIds: string[];
} {
  const init = asObject(city["cityInitDefinition"]);
  for (const component of asArray(init["components"])) {
    if (typeName(component) !== "InitialGridComponentDTO") continue;
    const c = asObject(component);
    return {
      expansionSize: requireNumber(c["expansionSize"], "InitialGrid.expansionSize"),
      // C2 : les éléments de `initialGridAreas[]` n'ont pas de `@type`.
      unlockedIds: asArray(c["initialGridAreas"]).map((area, i) =>
        requireString(asObject(area)["id"], `initialGridAreas[${i}].id`),
      ),
    };
  }
  throw new Error(`${asString(city["id"])} : aucun InitialGridComponentDTO`);
}

function extractSlot(entity: JsonObject): {
  slot: ExpansionSlotExtract;
  fixed: FixedBuildingExtract | null;
} {
  const id = requireString(entity["id"], "Expansion.id");

  const linkedTo: string[] = [];
  for (const component of asArray(entity["components"])) {
    if (typeName(component) !== "LinkedExpansionComponentDTO") continue;
    const linked = asString(asObject(component)["linkedExpansionDefinitionId"]);
    if (linked !== null) linkedTo.push(linked);
  }

  // `finish.rewards[]` : 9 cases posent un bâtiment d'office au déblocage
  // (Noria / Oasis d'Arabia). Ce sont les entités fixes du Layout Builder.
  let fixed: FixedBuildingExtract | null = null;
  for (const reward of asArray(asObject(entity["finish"])["rewards"])) {
    if (typeName(reward) !== "PlaceConstructedBuildingRewardDTO") continue;
    const r = asObject(reward);
    fixed = {
      expansionId: id,
      buildingId: requireString(r["buildingDefinitionId"], `${id}.buildingDefinitionId`),
      x: requireNumber(r["x"], `${id}.reward.x`),
      y: requireNumber(r["y"], `${id}.reward.y`),
      rotation: parseRotation(r["rotation"], `${id}.reward.rotation`),
    };
  }

  return {
    slot: {
      id,
      x: requireNumber(entity["x"], `${id}.x`),
      y: requireNumber(entity["y"], `${id}.y`),
      type: parseExpansionType(entity["expansionType"], id),
      surface: parseSurface(entity["expansionSubType"], id),
      linkedTo,
    },
    fixed,
  };
}

/**
 * Plancher d'ère et volume de palette par (ville, surface).
 *
 * `BuildingDefinitionDTO.expansionSubType` emploie le MÊME vocabulaire que
 * celui des cases : 22 bâtiments HARBOR, 12 WATER, 659 sans sous-type. La
 * jointure (ville, surface) donne donc la palette exacte d'une surface, et
 * l'âge le plus ancien de cette palette est l'ère à partir de laquelle la
 * surface devient jouable.
 *
 * ⚠️ Déduction, pas déclaration : aucun champ ne dit « le Port s'ouvre à
 * EarlyGothicEra ». Ce qui est mesuré, c'est qu'AUCUN bâtiment portuaire
 * n'existe avant cet âge. Le résultat est corroboré par le jeu (le Port
 * s'ouvre en EG/LG), et c'est cette corroboration qui autorise à s'en servir
 * comme d'un plancher.
 */
function indexPalettes(
  entities: Json[],
): Map<string, { minAge: string | null; buildingCount: number }> {
  // AgeDefinitionDTO.order : `order` est un int32 ici (C3/P2) et n'est PAS
  // dense — il saute 16 (00-conventions.md §6). On s'en sert pour comparer,
  // jamais comme index.
  const ageOrder = new Map<string, number>();
  for (const entity of entities) {
    if (typeName(entity) !== "AgeDefinitionDTO") continue;
    const e = asObject(entity);
    const id = asString(e["id"]);
    const order = asNumber(e["order"]);
    if (id !== null && order !== null) ageOrder.set(id, order);
  }

  const palettes = new Map<string, { minAge: string | null; buildingCount: number }>();
  for (const entity of entities) {
    if (typeName(entity) !== "BuildingDefinitionDTO") continue;
    const e = asObject(entity);
    const surface = parseSurface(e["expansionSubType"], `${asString(e["id"])}.expansionSubType`);
    const age = asString(e["age"]);
    // `cities[]` porte une seule ville sur les 693 (mesuré) ; on indexe
    // néanmoins toutes ses entrées plutôt que de supposer la cardinalité.
    for (const city of asArray(e["cities"])) {
      const cityId = asString(city);
      if (cityId === null) continue;
      const key = `${cityId}|${surface}`;
      const current = palettes.get(key) ?? { minAge: null, buildingCount: 0 };
      current.buildingCount += 1;
      if (age !== null) {
        const previous = current.minAge;
        if (
          previous === null ||
          (ageOrder.get(age) ?? Infinity) < (ageOrder.get(previous) ?? Infinity)
        ) {
          current.minAge = age;
        }
      }
      palettes.set(key, current);
    }
  }
  return palettes;
}

export function extractCityGrid(root: string): CityGridExtractBundle {
  const { entities, checksum, serverVersion } = readGameDesign(root);
  const loca = readLoca(root);
  const palettes = indexPalettes(entities);

  const cities: RawCity[] = [];
  const expansionsByCity = new Map<string, JsonObject[]>();

  for (const entity of entities) {
    const type = typeName(entity);
    const e = asObject(entity);
    if (type === "CityDefinitionDTO") {
      cities.push({ id: requireString(e["id"], "City.id"), definition: e });
    } else if (type === "ExpansionDefinitionDTO") {
      const city = requireString(e["city"], `${asString(e["id"])}.city`);
      const list = expansionsByCity.get(city);
      if (list) list.push(e);
      else expansionsByCity.set(city, [e]);
    }
  }

  const warnings: string[] = [];
  const extracted: CityGridExtract[] = [];

  for (const city of cities.sort((a, b) => a.id.localeCompare(b.id))) {
    const cityWarnings: string[] = [];
    const { expansionSize, unlockedIds } = extractInitialGrid(city.definition);
    const raw = expansionsByCity.get(city.id) ?? [];

    const slots: ExpansionSlotExtract[] = [];
    const fixedBuildings: FixedBuildingExtract[] = [];
    for (const entity of raw) {
      const { slot, fixed } = extractSlot(entity);
      slots.push(slot);
      if (fixed) fixedBuildings.push(fixed);
    }
    slots.sort((a, b) => a.id.localeCompare(b.id));

    const byId = new Map(slots.map((s) => [s.id, s]));

    // Intégrité 1 — les cases débloquées au démarrage existent bien.
    for (const id of unlockedIds) {
      if (!byId.has(id)) {
        cityWarnings.push(`initialGridAreas : « ${id} » ne résout vers aucune expansion`);
      }
    }

    // Intégrité 2 — les liens LINKED restent dans la même ville.
    for (const slot of slots) {
      for (const target of slot.linkedTo) {
        if (!byId.has(target)) {
          cityWarnings.push(`${slot.id} : lien « ${target} » hors de la ville`);
        }
      }
    }

    // Intégrité 3 — l'alignement de la grille. Toutes les origines d'une ville
    // partagent le même résidu modulo `expansionSize` (0 pour les villes en 3,
    // 3 pour celles en 4) : un résidu isolé signalerait une case décalée, donc
    // une grille non pavable.
    const residues = new Set(
      slots.flatMap((s) => [
        ((s.x % expansionSize) + expansionSize) % expansionSize,
        ((s.y % expansionSize) + expansionSize) % expansionSize,
      ]),
    );
    if (residues.size > 1) {
      cityWarnings.push(
        `alignement : ${residues.size} résidus distincts modulo ${expansionSize} (${[...residues].sort().join(", ")})`,
      );
    }

    // Intégrité 4 — deux cases ne peuvent pas occuper la même origine.
    const seen = new Set<string>();
    for (const slot of slots) {
      const key = `${slot.x}|${slot.y}`;
      if (seen.has(key)) cityWarnings.push(`${slot.id} : origine (${key}) en doublon`);
      seen.add(key);
    }

    // Surfaces : une grille par `expansionSubType`, cadrée sur les seules
    // cases constructibles.
    const surfaces: CityGridSurface[] = [];
    for (const surface of ["LAND", "HARBOR", "WATER"] as const) {
      const buildable = slots.filter(
        (s) => s.surface === surface && isBuildableType(s.type),
      );
      if (buildable.length === 0) continue;
      const bounds = boundsOf(buildable, expansionSize);
      if (!bounds) continue;
      const cols = bounds.width / expansionSize;
      const rows = bounds.height / expansionSize;
      const palette = palettes.get(`${city.id}|${surface}`);
      if (!palette || palette.buildingCount === 0) {
        cityWarnings.push(`surface ${surface} : aucun bâtiment dans le catalogue`);
      }
      surfaces.push({
        surface,
        buildableCount: buildable.length,
        bounds,
        cols,
        rows,
        sparse: buildable.length < cols * rows,
        minAge: palette?.minAge ?? null,
        buildingCount: palette?.buildingCount ?? 0,
      });
    }

    const label = loca.get(`Base.Cities.${city.id}_Name`);
    if (label === undefined) {
      cityWarnings.push(`libellé absent : Base.Cities.${city.id}_Name`);
    }

    extracted.push({
      cityId: city.id,
      cityLabel: label ?? city.id,
      expansionSize,
      slots,
      surfaces,
      defaultUnlockedIds: [...unlockedIds].sort(),
      cultureAreas: extractCulture(city.definition),
      fixedBuildings: fixedBuildings.sort((a, b) =>
        a.expansionId.localeCompare(b.expansionId),
      ),
      warnings: cityWarnings,
    });

    warnings.push(...cityWarnings.map((w) => `${city.id} : ${w}`));
  }

  // Aucune expansion ne doit référencer une ville inexistante.
  const known = new Set(cities.map((c) => c.id));
  for (const cityId of expansionsByCity.keys()) {
    if (!known.has(cityId)) {
      warnings.push(`expansions rattachées à une ville inconnue : ${cityId}`);
    }
  }

  return { checksum, serverVersion, cities: extracted, warnings };
}

// ─── Rendu du module ──────────────────────────────────────────────────────────

function renderModule(bundle: CityGridExtractBundle): string {
  return [
    `// ⚠️ FICHIER GÉNÉRÉ — ne pas éditer à la main.`,
    `// Source : source/gamedesign.json (${bundle.serverVersion})`,
    `// Régénérer : pnpm extract:city-grid`,
    ``,
    `import type { CityGridExtractBundle } from "./types";`,
    ``,
    `export const CITY_GRID_EXTRACT: CityGridExtractBundle = ${JSON.stringify(bundle, null, 2)};`,
    ``,
  ].join("\n");
}

function main(): void {
  const root = process.cwd();
  const bundle = extractCityGrid(root);

  const outDir = path.join(root, "data", "city-grid", "generated");
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, "city-grid.generated.ts");
  fs.writeFileSync(outFile, renderModule(bundle), "utf8");

  const lines = [`Villes extraites       : ${bundle.cities.length}`];
  let slots = 0;
  let buildable = 0;
  for (const city of bundle.cities) {
    slots += city.slots.length;
    const surfaces = city.surfaces
      .map(
        (s) =>
          `${s.surface} ${s.cols}x${s.rows}=${s.buildableCount}${s.sparse ? "*" : ""} dès ${s.minAge ?? "?"} (${s.buildingCount} bât.)`,
      )
      .join(", ");
    buildable += city.surfaces.reduce((t, s) => t + s.buildableCount, 0);
    lines.push(
      `  ${city.cityId.padEnd(14)} pas=${city.expansionSize} cases=${String(city.slots.length).padStart(3)} | ${surfaces}`,
    );
  }
  lines.push(
    `Cases totales          : ${slots} (dont ${buildable} constructibles)`,
    `Zones de culture       : ${bundle.cities.reduce((t, c) => t + c.cultureAreas.length, 0)}`,
    `Bâtiments fixes        : ${bundle.cities.reduce((t, c) => t + c.fixedBuildings.length, 0)}`,
    `Points indéterminés    : ${bundle.warnings.length}${bundle.warnings.length ? ` → ${bundle.warnings.join(" ; ")}` : ""}`,
    `  (* = surface non pavante : les cases ne remplissent pas la bounding box)`,
    `Écrit                  : ${path.relative(root, outFile)}`,
    ``,
  );
  process.stdout.write(lines.join("\n"));
}

if (require.main === module) main();
