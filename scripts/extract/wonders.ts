// ============================================================
// ROC Helper – Extraction du domaine Wonders
//
// Lit `source/gamedesign.json` + `source/loca.json` et écrit
// `data/wonders/generated/wonders.generated.ts`.
//
// Le game design est la SEULE source de vérité sur le contenu.
// Le contenu actuel de `data/` n'est jamais lu ni consulté : seule
// la FORME attendue (docs/data-contracts.md §4.1) guide la projection.
//
// Structure des données : docs/game-schema/05-wonders-reliques-heritage.md
//   - §2.1 schéma A : boost effectif = `modifier` × valeur dynamique
//   - §2.3 tables indexées par tag de wonder (`when` 0→7)
//   - §2.4 / §2.6 / §2.7 : points laissés indéterminés par les données
// Couche dynamique     : docs/game-schema/02-dynamic.md
// Conventions          : docs/game-schema/00-conventions.md
//   - C3 : les int64 sont sérialisés en string
//   - C4 : les durées sont des chaînes suffixées `s`
//   - C9 : toute table `values[]` se lit par PALIER, pas par clé exacte
//
// Usage : pnpm extract:wonders
// ============================================================

import fs from "node:fs";
import path from "node:path";

import type {
  WonderBonusExtract,
  WonderBonusFormat,
  WonderBonusScope,
  WonderCollectionExtract,
  WonderConstants,
  WonderCostScheme,
  WonderCrate,
  WonderCurve,
  WonderCurveIndex,
  WonderCurveStep,
  WonderEffect,
  WonderExtract,
  WonderExtractBundle,
  WonderRawEntry,
  WonderRewardDescriptor,
  WonderSynergyExtract,
  WonderUpgradeStep,
} from "../../data/wonders/generated/types";

// ─── Accès JSON typé ──────────────────────────────────────────────────────────

type Json = unknown;
type JsonObject = { [key: string]: Json };

function isObject(v: Json): v is JsonObject {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

/** Objet ou `{}` — évite d'avoir à tester chaque champ optionnel. */
function asObject(v: Json): JsonObject {
  return isObject(v) ? v : {};
}

/** Tableau ou `[]`. */
function asArray(v: Json): Json[] {
  return Array.isArray(v) ? v : [];
}

function asString(v: Json): string | null {
  return typeof v === "string" ? v : null;
}

/** Nombre, en acceptant la forme string des int64 (C3). */
function asNumber(v: Json): number | null {
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function require0(v: string | null, what: string): string {
  if (v === null) throw new Error(`Champ obligatoire absent : ${what}`);
  return v;
}

/** `type.googleapis.com/FooDTO` → `FooDTO`. */
function shortType(v: Json): string {
  const t = asString(asObject(v)["@type"]);
  return t === null ? "" : t.slice(t.lastIndexOf("/") + 1);
}

/** Durée protobuf `"3600s"` → 3600 (C4). */
function durationSeconds(v: Json): number | null {
  const s = asString(v);
  if (s === null) return asNumber(v);
  return asNumber(s.endsWith("s") ? s.slice(0, -1) : s);
}

/** Coupe les artefacts de virgule flottante nés des produits `modifier` × valeur. */
function round(v: number, digits = 6): number {
  return Number.parseFloat(v.toFixed(digits));
}

// ─── Vocabulaire de présentation (côté projet, PAS game design) ───────────────
//
// Le game design ne porte ni code court, ni clé d'icône : ce sont des
// conventions du projet (clé primaire en base, presets, images, et clés
// résolues par `resolveIconPath()` dans components/wonders/stats-badge.tsx).
// Elles sont donc déclarées ici, indexées par id de game design, pour que
// l'ajout d'un wonder côté jeu échoue bruyamment plutôt qu'en silence.

const WONDER_CODE_BY_ID: Record<string, string> = {
  Wonder_Capital_Stonehenge: "SH",
  Wonder_Capital_HangingGardens: "HG",
  Wonder_Capital_StatueOfZeus: "SoZ",
  Wonder_Capital_TempleOfArtemis: "ToA",
  Wonder_Capital_Mausoleum: "ToM",
  Wonder_Capital_Lighthouse: "LoA",
  Wonder_Capital_Colossus: "CoR",
  Wonder_Egypt_CheopsPyramid: "CP",
  Wonder_Egypt_GreatSphinx: "GS",
  Wonder_Egypt_AbuSimbel: "AS",
  Wonder_Capital_HagiaSophia: "HS",
  Wonder_Capital_Colosseum: "C",
  Wonder_Capital_PalaceOfAachen: "PoA",
  Wonder_Capital_SherwoodForest: "SF",
  Wonder_China_TerracottaArmy: "TA",
  Wonder_China_ForbiddenCity: "FC",
  Wonder_China_GreatWall: "GW",
  Wonder_Mayas_SayilPalace: "SP",
  Wonder_Mayas_Tikal: "T",
  Wonder_Mayas_ChichenItza: "CI",
  Wonder_Capital_Alhambra: "A",
  Wonder_Capital_Carcassonne: "CC",
  Wonder_Capital_TowerOfPisa: "LToP",
  Wonder_Vikings_Yggdrasil: "Y",
  Wonder_Vikings_DragonshipEllida: "DE",
  Wonder_Vikings_Valhalla: "V",
  Wonder_Arabia_Petra: "P",
  Wonder_Arabia_CityOfBrass: "CoB",
};

/** Icône d'unité par `unitType` du game design. */
const UNIT_ICON: Record<string, string> = {
  infantry: "icon_unit_infantry",
  ranged: "icon_unit_ranged",
  cavalry: "icon_unit_cavalry",
  heavyInfantry: "icon_unit_heavyinfantry",
  bastion: "icon_unit_bastion",
};

/** Icône de stat par `statDefinitionId`. */
const STAT_ICON: Record<string, string> = {
  UnitStat_Damage: "icon_unitstat_damage",
  UnitStat_HitPoints: "icon_unitstat_hitpoints",
  UnitStat_CriticalHitChance: "icon_unitstat_criticalhitchance",
  UnitStat_HitRate: "icon_unitstat_hitrate",
  UnitStat_MovementSpeed: "icon_unitstat_movementspeed",
};

/** Segment snake_case par `statDefinitionId`. */
const STAT_KEY: Record<string, string> = {
  UnitStat_Damage: "damage",
  UnitStat_HitPoints: "hp",
  UnitStat_CriticalHitChance: "critical_hit_chance",
  UnitStat_HitRate: "hit_rate",
  UnitStat_MovementSpeed: "movement_speed",
};

/**
 * Clés de bonus dont le nom systématique diverge de celui que le projet utilise
 * réellement comme clé de lookup dans `BONUS_LABELS` (resolvers/bonus.ts).
 * Le dictionnaire fait foi pour le LIBELLÉ seul : une clé absente y dégrade
 * silencieusement le libellé en title-case. Le format, lui, n'est plus dérivé
 * du nom — il est porté en donnée par `WonderBonusExtract.format`, donc un
 * renommage ne peut plus changer l'unité affichée.
 *
 * Cas connu : les trois wonders portant `UnitStat_CriticalHitChance` donnent
 * `infantry_critical_hit_chance`, `heavy_infantry_critical_hit_chance` et
 * `ranged_critical_hit_chance` ; les deux premiers existent dans le dictionnaire,
 * le troisième y est nommé `ranged_critical_hit_boost`.
 */
const BONUS_TYPE_ALIAS: Record<string, string> = {
  ranged_critical_hit_chance: "ranged_critical_hit_boost",
};

/** Segment snake_case par `unitType`. Absence de `unitType` = toutes les unités. */
const UNIT_KEY: Record<string, string> = {
  infantry: "infantry",
  ranged: "ranged",
  cavalry: "cavalry",
  heavyInfantry: "heavy_infantry",
  bastion: "bastion",
};

/**
 * Icône propre à quelques boosts de temps de recrutement : le game design ne
 * désigne l'unité recrutée que par `buildingGroup`/`wonderDefinitionId`, et le
 * projet a une icône dédiée par wonder concerné.
 */
const BOOST_ICON_OVERRIDE: Record<string, [string, string | null]> = {
  Boost_Wonder_Carcassonne_1_RecruitmentTimeReduction: ["icon_unit_carcassonne", "icon_time_boost"],
  Boost_Wonder_Carcassonne_2_HeavyRecruitmentTimeReduction: ["icon_unit_heavyinfantry", "icon_time_boost"],
  Boost_Wonder_ChichenItza_1_RecruitmentTimeReduction: ["icon_unit_maya_archer", "icon_time_boost"],
  Boost_Building_AgeOfTheFranks_Wonder_PalaceOfAachen_1_RecruitmentTimeReduction: ["icon_unit_aachen", "icon_time_boost"],
};

/** Même logique côté clé de bonus. */
const BOOST_TYPE_OVERRIDE: Record<string, string> = {
  Boost_Wonder_Carcassonne_1_RecruitmentTimeReduction: "carcassonne_recruitment_time_reduction",
  Boost_Wonder_Carcassonne_2_HeavyRecruitmentTimeReduction: "heavy_infantry_recruitment_time_reduction",
};

const MAX_TAG_COUNT = 7; // `when` des `WonderTagDynamicChangeDTO` va de 0 à 7 (§2.3)

// ─── Index du game design ─────────────────────────────────────────────────────

interface SourceIndex {
  entities: JsonObject[];
  byId: Map<string, JsonObject>;
  byType: Map<string, JsonObject[]>;
  loca: Map<string, string>;
  gameDesignChecksum: string | null;
  locaChecksum: string | null;
  locale: string | null;
}

function loadSource(root: string): SourceIndex {
  const gdPath = path.join(root, "source", "gamedesign.json");
  const locaPath = path.join(root, "source", "loca.json");
  for (const p of [gdPath, locaPath]) {
    if (!fs.existsSync(p)) {
      throw new Error(`Source introuvable : ${p} (lancer la commande depuis la racine du dépôt)`);
    }
  }

  const gdRoot = asObject(JSON.parse(fs.readFileSync(gdPath, "utf8")) as Json);
  const gdEnvelope = asObject(asArray(gdRoot.content)[0]);
  const entities = asArray(gdEnvelope.content).filter(isObject);

  const byId = new Map<string, JsonObject>();
  const byType = new Map<string, JsonObject[]>();
  for (const entity of entities) {
    const id = asString(entity.id);
    // C6 : les 11 970 ids sont globalement uniques — le premier gagne quand même.
    if (id !== null && !byId.has(id)) byId.set(id, entity);
    const type = shortType(entity);
    const bucket = byType.get(type);
    if (bucket) bucket.push(entity);
    else byType.set(type, [entity]);
  }

  const locaRoot = asObject(JSON.parse(fs.readFileSync(locaPath, "utf8")) as Json);
  const locaEnvelope = asObject(asArray(locaRoot.content)[0]);
  const loca = new Map<string, string>();
  for (const entry of asArray(locaEnvelope.translations)) {
    const key = asString(asObject(entry).key);
    const value = asString(asArray(asObject(entry).values)[0]);
    if (key !== null && value !== null) loca.set(key, value);
  }

  return {
    entities,
    byId,
    byType,
    loca,
    gameDesignChecksum: asString(gdEnvelope.checksum),
    locaChecksum: asString(locaEnvelope.checksum),
    locale: asString(locaEnvelope.locale),
  };
}

/** C7 : une clé sans traduction est un libellé absent, pas une erreur. */
function translate(src: SourceIndex, key: string): string {
  return src.loca.get(key) ?? "";
}

/** `<size=34px>Wonders from</size><br>Stories and Myths` → `Stories and Myths`. */
function shortCollectionLabel(formatted: string, fallback: string): string {
  if (formatted === "") return fallback;
  const lastLine = formatted.split("<br>").pop() ?? formatted;
  const stripped = lastLine.replace(/<[^>]*>/g, "").trim();
  return stripped === "" ? fallback : stripped;
}

// ─── Lecture des tables dynamiques ────────────────────────────────────────────

/** `mapping` est tantôt un objet, tantôt une liste d'un seul élément (02-dynamic §1). */
function firstMapping(definition: Json): JsonObject {
  const mapping = asObject(definition).mapping;
  return Array.isArray(mapping) ? asObject(mapping[0]) : asObject(mapping);
}

/**
 * Extrait la valeur numérique d'un payload `then`.
 * Un `then` vide n'est pas 0 : c'est « pas de bonus » (§2.3 / W7) → `null`.
 */
function payloadValue(then: Json): number | null {
  const o = asObject(then);
  for (const key of ["value", "factor", "modifier"]) {
    if (key in o) return asNumber(o[key]);
  }
  return null;
}

function mappingIndex(mapping: JsonObject): WonderCurveIndex | null {
  switch (shortType(mapping)) {
    case "BuildingLevelDynamicChangeDTO":
      return "level";
    case "WonderTagDynamicChangeDTO":
      return "wonderTag";
    default:
      return null;
  }
}

/**
 * Lecture par palier (C9) : valeur applicable à la clé `k` = l'entrée dont le
 * `when` est le plus grand parmi ceux ≤ `k`. En dessous de la plus petite clé,
 * les données ne disent rien → `null`, jamais d'extrapolation.
 */
function resolveByStep(steps: WonderCurveStep[], keys: number[]): (number | null)[] {
  const sorted = [...steps].sort((a, b) => a.when - b.when);
  return keys.map((key) => {
    let current: number | null = null;
    let found = false;
    for (const step of sorted) {
      if (step.when > key) break;
      current = step.value;
      found = true;
    }
    return found ? current : null;
  });
}

/**
 * Construit une courbe à partir d'un `mapping` (référencé ou inline) et du
 * `modifier` porté par le composant. Le produit `modifier × valeur` est la
 * composition du schéma A (§2.1) ; l'opérateur n'est pas déclaré dans les
 * données, il est inféré des ordres de grandeur.
 */
function buildCurve(
  mapping: JsonObject,
  definitionId: string,
  modifier: number | null,
  maxLevel: number,
): WonderCurve | null {
  const indexedBy = mappingIndex(mapping);
  if (indexedBy === null) return null;

  const table: WonderCurveStep[] = [];
  for (const row of asArray(mapping.values)) {
    const when = asNumber(asObject(row).when);
    if (when === null) continue;
    table.push({ when, value: payloadValue(asObject(row).then) });
  }

  const keys =
    indexedBy === "level"
      ? Array.from({ length: maxLevel }, (_, i) => i + 1)
      : Array.from({ length: MAX_TAG_COUNT + 1 }, (_, i) => i);

  const resolved = resolveByStep(table, keys);
  const effective = resolved.map((v) =>
    v === null ? null : modifier === null ? round(v) : round(modifier * v),
  );

  return {
    indexedBy,
    tag: asString(mapping.tag),
    definitionId,
    modifier,
    table,
    resolved,
    effective,
  };
}

/** Courbe d'une définition dynamique référencée par id. */
function curveFromDefinition(
  src: SourceIndex,
  definitionId: string | null,
  modifier: number | null,
  maxLevel: number,
): WonderCurve | null {
  if (definitionId === null) return null;
  const definition = src.byId.get(definitionId);
  if (definition === undefined) return null;
  return buildCurve(firstMapping(definition), definitionId, modifier, maxLevel);
}

// ─── Arbres de récompense ─────────────────────────────────────────────────────

interface LeafAccumulator {
  order: string[];
  byKey: Map<string, WonderRewardDescriptor>;
}

/** Nombre de branches par coffre mystère, indexé par clé de feuille. */
const branchCounts = new Map<string, number>();

/** Nombre de branches d'un descripteur de coffre, une fois les feuilles résolues. */
const chestBranchCount = new WeakMap<WonderRewardDescriptor, number>();

function attachBranchCounts(acc: LeafAccumulator): void {
  for (const key of acc.order) {
    const count = branchCounts.get(key);
    const descriptor = acc.byKey.get(key);
    if (count !== undefined && descriptor !== undefined) {
      chestBranchCount.set(descriptor, count);
    }
  }
}

function newAccumulator(): LeafAccumulator {
  return { order: [], byKey: new Map() };
}

function leaf(
  acc: LeafAccumulator,
  key: string,
  levelIndex: number,
  levels: number,
  make: () => WonderRewardDescriptor,
  amount: number | null,
  chancePercent: number | null,
): void {
  let descriptor = acc.byKey.get(key);
  if (descriptor === undefined) {
    descriptor = make();
    descriptor.amounts = amount === null ? null : new Array<number | null>(levels).fill(null);
    descriptor.firstBranchChancePercent =
      chancePercent === null ? null : new Array<number | null>(levels).fill(null);
    acc.byKey.set(key, descriptor);
    acc.order.push(key);
  }
  if (amount !== null) {
    if (descriptor.amounts === null) descriptor.amounts = new Array<number | null>(levels).fill(null);
    descriptor.amounts[levelIndex] = amount;
  }
  if (chancePercent !== null) {
    if (descriptor.firstBranchChancePercent === null) {
      descriptor.firstBranchChancePercent = new Array<number | null>(levels).fill(null);
    }
    descriptor.firstBranchChancePercent[levelIndex] = chancePercent;
  }
}

/**
 * Parcourt un nœud de récompense pour un niveau donné et accumule les feuilles
 * numériques. `MysteryChestRewardDTO` n'est pas traversé : ses branches sont des
 * alternatives, seule la table `chances` est exploitable comme courbe.
 *
 * ⚠️ Les feuilles sont identifiées par leur POSITION dans l'arbre (`pos`), pas par
 * les ids rencontrés : ceux-ci changent d'un niveau à l'autre
 * (`Reward_..._Chest_1`, `_2`, …) et casseraient le rattachement des 30 valeurs
 * d'une même courbe.
 */
function walkRewards(
  src: SourceIndex,
  node: Json,
  levelIndex: number,
  levels: number,
  level: number,
  acc: LeafAccumulator,
  trail: string[],
  seen: Set<string>,
  pos: string,
  insideChest: boolean,
): void {
  if (Array.isArray(node)) {
    node.forEach((child, index) => {
      walkRewards(src, child, levelIndex, levels, level, acc, trail, seen, `${pos}[${index}]`, insideChest);
    });
    return;
  }
  if (!isObject(node)) return;

  const type = shortType(node);
  const nodeId = asString(node.id) ?? asString(asObject(node.baseData).id);
  const path0 = nodeId === null ? trail : [...trail, nodeId];

  switch (type) {
    case "ResourceRewardDTO": {
      const resource = asString(node.resource);
      if (resource === null) break;
      leaf(
        acc,
        `resource:${resource}@${pos}`,
        levelIndex,
        levels,
        () => ({
          kind: "resource",
          resourceDefinitionId: resource,
          goodNumber: null,
          goodOffset: null,
          amounts: null,
          firstBranchChancePercent: null,
          insideChest,
          path: path0,
        }),
        asNumber(node.amount),
        null,
      );
      return;
    }
    case "GoodRewardDTO": {
      // `number` est un RANG de bien (1..3), pas un id ; `offset` -1 = âge précédent.
      const number = asNumber(node.number) ?? 0;
      const offset = asNumber(node.offset) ?? 0;
      leaf(
        acc,
        `good:${offset}:${number}@${pos}`,
        levelIndex,
        levels,
        () => ({
          kind: "good",
          resourceDefinitionId: null,
          goodNumber: number,
          goodOffset: offset,
          amounts: null,
          firstBranchChancePercent: null,
          insideChest,
          path: path0,
        }),
        asNumber(node.amount),
        null,
      );
      return;
    }
    case "MysteryChestRewardDTO": {
      const chances = asArray(node.chances)
        .map(asNumber)
        .filter((n): n is number => n !== null);
      const total = chances.reduce((sum, n) => sum + n, 0);
      branchCounts.set(`mysteryChest@${pos}`, chances.length);
      leaf(
        acc,
        `mysteryChest@${pos}`,
        levelIndex,
        levels,
        () => ({
          kind: "mysteryChest",
          resourceDefinitionId: null,
          goodNumber: null,
          goodOffset: null,
          amounts: null,
          firstBranchChancePercent: null,
          insideChest,
          path: path0,
        }),
        null,
        total > 0 && chances.length > 0 ? round((chances[0] / total) * 100) : null,
      );
      // On descend quand même dans les branches : leur montant est une courbe
      // par niveau parfaitement déterministe (seul le tirage est aléatoire).
      // C'est par là que passent les biens de Hagia Sophia, p. ex.
      break;
    }
    case "DynamicActionChangeRewardDTO": {
      const target = asString(node.dynamicDefinitionId);
      if (target !== null) {
        walkDynamicAction(src, target, levelIndex, levels, level, acc, path0, seen, `${pos}.dac`, insideChest);
      }
      return;
    }
    default:
      break;
  }

  // `ActionChangeDTO` et conteneurs (`RewardDefinitionDTO`, `LootContainerRewardDTO`…)
  asArray(node.resourceChanges).forEach((change, index) => {
    const o = asObject(change);
    const definitionId = asString(o.definitionId);
    if (definitionId === null) return;
    leaf(
      acc,
      `resource:${definitionId}@${pos}.changes[${index}]`,
      levelIndex,
      levels,
      () => ({
        kind: "resource",
        resourceDefinitionId: definitionId,
        goodNumber: null,
        goodOffset: null,
        amounts: null,
        firstBranchChancePercent: null,
        insideChest,
        path: path0,
      }),
      asNumber(o.amount),
      null,
    );
  });
  asArray(node.dynamicChangeDefinitionId).forEach((nested, index) => {
    const target = asString(nested);
    if (target === null) return;
    walkDynamicAction(src, target, levelIndex, levels, level, acc, path0, seen, `${pos}.dyn[${index}]`, insideChest);
  });
  if ("rewards" in node) {
    // Tout ce qui pend sous un coffre mystère est un tirage, pas un acquis.
    walkRewards(
      src,
      node.rewards,
      levelIndex,
      levels,
      level,
      acc,
      path0,
      seen,
      `${pos}.rewards`,
      insideChest || type === "MysteryChestRewardDTO",
    );
  }
}

/** Entre dans une `DynamicActionChangeDefinitionDTO` au niveau courant. */
function walkDynamicAction(
  src: SourceIndex,
  definitionId: string,
  levelIndex: number,
  levels: number,
  level: number,
  acc: LeafAccumulator,
  trail: string[],
  seen: Set<string>,
  pos: string,
  insideChest: boolean,
): void {
  if (seen.has(definitionId)) return;
  const definition = src.byId.get(definitionId);
  if (definition === undefined) {
    leaf(
      acc,
      `unresolved@${pos}`,
      levelIndex,
      levels,
      () => ({
        kind: "unresolved",
        resourceDefinitionId: definitionId,
        goodNumber: null,
        goodOffset: null,
        amounts: null,
        firstBranchChancePercent: null,
        insideChest,
        path: [...trail, definitionId],
      }),
      null,
      null,
    );
    return;
  }

  const mapping = firstMapping(definition);
  const rows = asArray(mapping.values)
    .map((row) => ({ when: asNumber(asObject(row).when), then: asObject(row).then }))
    .filter((row): row is { when: number; then: Json } => row.when !== null)
    .sort((a, b) => a.when - b.when);

  // Palier applicable au niveau courant (C9).
  let payload: Json = null;
  let found = false;
  for (const row of rows) {
    if (row.when > level) break;
    payload = row.then;
    found = true;
  }
  if (!found) return;

  const next = new Set(seen);
  next.add(definitionId);
  walkRewards(src, payload, levelIndex, levels, level, acc, [...trail, definitionId], next, pos, insideChest);
}

/** Déroule un arbre de récompense sur les 30 niveaux et renvoie ses feuilles. */
function describeRewards(src: SourceIndex, node: Json, maxLevel: number): WonderRewardDescriptor[] {
  const acc = newAccumulator();
  for (let level = 1; level <= maxLevel; level += 1) {
    walkRewards(src, node, level - 1, maxLevel, level, acc, [], new Set(), "", false);
  }
  attachBranchCounts(acc);
  return acc.order.map((key) => {
    const descriptor = acc.byKey.get(key);
    if (descriptor === undefined) throw new Error(`Feuille perdue : ${key}`);
    return descriptor;
  });
}

function describeProduced(
  src: SourceIndex,
  definitionId: string | null,
  maxLevel: number,
): WonderRewardDescriptor[] {
  if (definitionId === null) return [];
  const acc = newAccumulator();
  for (let level = 1; level <= maxLevel; level += 1) {
    walkDynamicAction(src, definitionId, level - 1, maxLevel, level, acc, [], new Set(), "", false);
  }
  attachBranchCounts(acc);
  return acc.order.map((key) => {
    const descriptor = acc.byKey.get(key);
    if (descriptor === undefined) throw new Error(`Feuille perdue : ${key}`);
    return descriptor;
  });
}

// ─── Coûts de montée ──────────────────────────────────────────────────────────

/**
 * `WonderLevelUpComponentDTO.dynamicCosts` embarque une
 * `WonderDynamicCostDefinitionDTO` complète (§3.2), tabulée sur 29 clés :
 * `when = N` est la montée du niveau N vers N+1.
 */
function readCostScheme(dynamicCosts: JsonObject): WonderCostScheme {
  const id = require0(asString(dynamicCosts.id), "dynamicCosts.id");
  const steps: WonderUpgradeStep[] = [];

  const rows = asArray(firstMapping(dynamicCosts).values)
    .map((row) => ({ when: asNumber(asObject(row).when), then: asObject(row).then }))
    .filter((row): row is { when: number; then: Json } => row.when !== null)
    .sort((a, b) => a.when - b.when);

  for (const row of rows) {
    const crates: WonderCrate[] = [];
    for (const rawCrate of asArray(asObject(row.then).crates)) {
      const crate = asObject(rawCrate);
      const cost = asObject(crate.cost);
      crates.push({
        id: require0(asString(crate.id), "crate.id"),
        crateAmount: asNumber(crate.crateAmount) ?? 0,
        gearsAmount: asNumber(crate.gearsAmount) ?? 0,
        isInstantHelpRequest: crate.isInstantHelpRequest === true,
        cost: {
          definitionId: require0(asString(cost.definitionId), "crate.cost.definitionId"),
          amount: asNumber(cost.amount) ?? 0,
        },
      });
    }
    steps.push({ targetLevel: row.when + 1, crates });
  }

  return { id, steps };
}

// ─── Projection vers la forme UI ──────────────────────────────────────────────

interface Projection {
  type: string;
  icons: [string, string | null];
  format: WonderBonusFormat;
  /**
   * Cible du bonus, quand le game design la restreint. Portée en donnée à côté
   * de l'icône, qui reste le canal d'affichage : jusqu'ici la restriction ne
   * vivait QUE dans l'icône (écusson de cité, glyphe d'unité), ce qui rendait
   * deux bonus de même `type` indistinguables sans lire l'image.
   */
  scope: WonderBonusScope | null;
  /** Facteur appliqué à la valeur effective (100 pour convertir une fraction en %). */
  scale: number;
  /**
   * `complement` : la valeur tabulée est un MULTIPLICATEUR de durée, le bonus est
   * ce qu'elle retranche (`1 − v`). Cas de
   * `RegenerationTraitBoostModifier_DURATION` : la table va de 0,9 à 0,6 quand le
   * niveau monte, et la table par tag part de 1,0 à 0 wonder — une valeur qui
   * DÉCROÎT avec le niveau et vaut 1 quand rien n'est actif ne peut être lue
   * autrement. Non déclaré dans les données.
   */
  transform?: "complement";
}

/** Applique la transformation d'une projection à une valeur effective. */
function applyTransform(value: number, projection: Projection): number {
  return projection.transform === "complement" ? 1 - value : value;
}

/**
 * Écusson de cité, en surcouche des icônes de biens : le game design dit quelle
 * cité est boostée via `BoostResourceComponentDTO.cities`, et le projet a un
 * crest par cité (`imagesUrl` dans lib/catalog.ts). La capitale n'en a pas.
 */
const CITY_CREST_ICON: Record<string, string> = {
  City_Egypt: "egypt",
  City_China: "china",
  City_Mayas: "maya",
  City_Vikings: "vikings",
  City_Arabia: "arabia",
};

/**
 * Cible d'un `BoostResourceComponentDTO`.
 *
 * `cities[]` est présent sur les 12 occurrences et c'est la dimension qui
 * DISCRIMINE réellement : Petra et Tikal portent chacun deux boosts de biens,
 * l'un sur leur cité alliée, l'autre sur la capitale (c'est ce que le suffixe
 * `_secondary` masquait). `buildingGroup` ne sert de repli que pour la taverne
 * viking, seule occurrence du champ, et son unique cité est déjà connue.
 */
function resourceBoostScope(
  buildingGroup: string | null,
  cities: string[],
): WonderBonusScope | null {
  if (cities.length === 1) return { kind: "city", value: cities[0] };
  if (buildingGroup !== null) return { kind: "buildingGroup", value: buildingGroup };
  return null;
}

/** Boost de ressource → clé de bonus et icône (data-contracts §4.1). */
function projectResourceBoost(
  resourceDefinitionId: string | null,
  resourceType: string | null,
  buildingGroup: string | null,
  cities: string[],
): Projection | null {
  const scope = resourceBoostScope(buildingGroup, cities);
  if (resourceDefinitionId === "coins") {
    return { type: "coins_production", icons: ["coin", null], format: "percent", scope, scale: 100 };
  }
  if (resourceDefinitionId === "food") {
    return { type: "food_production", icons: ["food", null], format: "percent", scope, scale: 100 };
  }
  if (resourceDefinitionId === "research_points") {
    return { type: "research_regen_boost", icons: ["research", null], format: "percent", scope, scale: 100 };
  }
  if (resourceType === "good") {
    // Les biens sont ceux d'une cité précise : on la nomme par son écusson.
    const crest = cities.length === 1 ? (CITY_CREST_ICON[cities[0]] ?? null) : null;
    return { type: "goods_production", icons: ["good", crest], format: "percent", scope, scale: 100 };
  }
  if (buildingGroup === "tavern") {
    // Le seul groupe de bâtiment ciblé ; la taverne produit l'hydromel viking.
    return { type: "goods_production", icons: ["mead", null], format: "percent", scope, scale: 100 };
  }
  return null;
}

function projectUnitStatBoost(unitType: string | null, statDefinitionId: string): Projection | null {
  const stat = STAT_KEY[statDefinitionId];
  if (stat === undefined) return null;
  const statIcon = STAT_ICON[statDefinitionId] ?? "icon_arrow_boost";
  if (unitType === null) {
    // Pas d'`unitType` = toutes les unités : le projet dit « army », et il n'y a
    // donc aucune restriction à porter.
    const type = `army_${stat}`;
    return {
      type: BONUS_TYPE_ALIAS[type] ?? type,
      icons: [statIcon, null],
      format: "percent",
      scope: null,
      scale: 100,
    };
  }
  const unit = UNIT_KEY[unitType];
  if (unit === undefined) return null;
  const type = `${unit}_${stat}`;
  return {
    type: BONUS_TYPE_ALIAS[type] ?? type,
    icons: [UNIT_ICON[unitType] ?? statIcon, statIcon],
    format: "percent",
    scope: { kind: "unitType", value: unitType },
    scale: 100,
  };
}

function projectBuildingBoost(
  boostDefinitionId: string,
  boostType: string,
  boostTarget: Record<string, string>,
): Projection | null {
  const iconOverride = BOOST_ICON_OVERRIDE[boostDefinitionId];
  const typeOverride = BOOST_TYPE_OVERRIDE[boostDefinitionId];
  // Seul `buildingGroup` restreint la cible ici. `wonderDefinitionId` désigne le
  // porteur, pas la cible, et `resourceDefinitionId` est déjà porté par le `type`
  // (`research_point_cap` / `research_regen_boost`).
  const scope: WonderBonusScope | null =
    boostTarget.buildingGroup === undefined
      ? null
      : { kind: "buildingGroup", value: boostTarget.buildingGroup };

  switch (boostType) {
    case "TradeSlotCooldownBoostDTO":
      return {
        type: typeOverride ?? "trade_slot_cooldown_reduction",
        icons: iconOverride ?? ["trade_slot_cooldown_boost", null],
        format: "percent",
        scope,
        scale: 100,
      };
    case "BazaarOfferBoostDTO":
      return {
        type: typeOverride ?? "bazaar_offer_boost",
        icons: iconOverride ?? ["bazaar_boost", null],
        format: "percent",
        scope,
        scale: 100,
      };
    case "AcceptTradeOfferBoostDTO":
      return {
        type: typeOverride ?? "trade_bonus",
        icons: iconOverride ?? ["icon_trading", null],
        format: "percent",
        scope,
        scale: 100,
      };
    case "WonderContributionBoostDTO":
      return {
        type: typeOverride ?? "donation_gears",
        icons: iconOverride ?? ["gears", "icon_arrow_boost"],
        format: "percent",
        scope,
        scale: 100,
      };
    case "RegenerationTraitBoostDTO": {
      // Sans `modifier`, le boost relève le plafond (valeurs entières) ;
      // avec `RegenerationTraitBoostModifier_DURATION`, il accélère la régénération.
      const isDuration = boostTarget.modifier === "RegenerationTraitBoostModifier_DURATION";
      return isDuration
        ? {
            type: typeOverride ?? "research_regen_boost",
            icons: iconOverride ?? ["research", "icon_time_boost"],
            format: "percent",
            scope,
            scale: 100,
            transform: "complement",
          }
        : {
            type: typeOverride ?? "research_point_cap",
            icons: iconOverride ?? ["research", "icon_arrow_boost"],
            format: "integer",
            scope,
            scale: 1,
          };
    }
    case "BoostProductionTimeComponentDTO":
      return {
        type: typeOverride ?? "recruitment_time_reduction",
        icons: iconOverride ?? ["icon_time_boost", null],
        format: "percent",
        scope,
        scale: 100,
      };
    default:
      return null;
  }
}

/**
 * `GrantWorkerComponentDTO` ne déclare aucune cible : la cité est celle du wonder
 * porteur, pas une restriction du bonus, et elle est déjà encodée dans le `type`
 * (`arabia_worker_slots`). `scope` reste donc `null` ici — voir le rapport de
 * chantier, c'est un non-changement délibéré.
 */
function projectGrantWorker(workerType: string | null, cityDefinition: string): Projection {
  if (workerType === "WorkerType_TRADING") {
    return { type: "trade_worker_slots", icons: ["trade_worker", null], format: "integer", scope: null, scale: 1 };
  }
  if (cityDefinition === "City_Arabia") {
    return { type: "arabia_worker_slots", icons: ["arabia_worker", null], format: "integer", scope: null, scale: 1 };
  }
  return { type: "worker_slots", icons: ["capital_worker", null], format: "integer", scope: null, scale: 1 };
}

/** Les récompenses de production ne portent aucune restriction de cible : `scope: null`. */
function projectReward(descriptor: WonderRewardDescriptor): Projection | null {
  if (descriptor.kind === "resource") {
    if (descriptor.resourceDefinitionId === "research_points") {
      return { type: "rp_per_day", icons: ["research", null], format: "integer", scope: null, scale: 1 };
    }
    if (descriptor.resourceDefinitionId === "treasure_hunt_attempt") {
      return { type: "compass_slots", icons: ["icon_compass", null], format: "integer", scope: null, scale: 1 };
    }
    return null;
  }
  if (descriptor.kind === "good") {
    return descriptor.goodOffset === -1
      ? {
          type: "previous_era_goods_quantity",
          icons: ["icon_previous_goods", null],
          format: "integer",
          scope: null,
          scale: 1,
        }
      : { type: "goods_quantity", icons: ["chest_good", null], format: "integer", scope: null, scale: 1 };
  }
  if (descriptor.kind === "mysteryChest") {
    // La chance d'un coffre imbriqué dans un autre est conditionnelle : elle ne
    // se lit pas comme un taux de drop. On garde le coffre dans `effects`.
    if (descriptor.insideChest) return null;
    return {
      type: "chest_drop_chance",
      icons: ["mystery_chest", null],
      format: "percent",
      scope: null,
      scale: 1, // `firstBranchChancePercent` est déjà en pourcent
    };
  }
  return null;
}

/** Rend une magnitude de synergie sous la forme pré-formatée attendue par l'UI. */
function formatMagnitude(value: number): string {
  const rounded = round(value, 3);
  const text = Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1).replace(/\.0$/, "");
  return rounded >= 0 ? `+${text}` : text;
}

// ─── Extraction d'un wonder ───────────────────────────────────────────────────

interface WonderContext {
  src: SourceIndex;
  maxLevel: number;
  collectionsByWonderId: Map<string, string[]>;
  collectionLabels: Map<string, { short: string; code: string }>;
}

function collectionCodeOf(collectionId: string): string {
  if (collectionId === "AncientWorld") return "AW";
  if (collectionId === "GreatEmpires") return "GE";
  if (collectionId === "StoriesAndMyths") return "SM";
  return collectionId;
}

/**
 * `Dac_Wonder_<Collection>_<City>_UpgradeCosts` → `<Collection>`.
 * C'est le seul rattachement collection→wonder non ambigu : deux wonders
 * appartiennent à deux collections (W14), mais chacun n'a qu'un barème.
 */
function collectionFromCostScheme(schemeId: string): string | null {
  const match = /^Dac_Wonder_([A-Za-z]+)_[A-Za-z]+_UpgradeCosts$/.exec(schemeId);
  return match === null ? null : match[1];
}

function extractWonder(ctx: WonderContext, entity: JsonObject): {
  wonder: WonderExtract;
  costScheme: WonderCostScheme;
} {
  const { src, maxLevel } = ctx;
  const id = require0(asString(entity.id), "ReworkedWonderDefinition.id");
  const warnings: string[] = [];

  const code = WONDER_CODE_BY_ID[id];
  if (code === undefined) {
    throw new Error(
      `Aucun code projet pour le wonder « ${id} ». ` +
        `Ajouter une entrée à WONDER_CODE_BY_ID (scripts/extract/wonders.ts).`,
    );
  }

  const cityDefinition = require0(asString(entity.cityDefinition), `${id}.cityDefinition`);
  const tags = asArray(entity.tags)
    .map(asString)
    .filter((t): t is string => t !== null);

  const effects: WonderEffect[] = [];
  const bonuses: WonderBonusExtract[] = [];
  const synergies: WonderSynergyExtract[] = [];
  const countsAs: { tag: string; multiplier: number }[] = [];
  let costScheme: WonderCostScheme | null = null;

  /**
   * Ajoute un bonus sous sa clé CANONIQUE.
   *
   * La clé portait jusqu'ici un suffixe de dédoublonnage (`_secondary`,
   * `_tertiary`, …) quand un wonder répétait le même bonus — mais
   * `goods_production_secondary` n'est pas un bonus distinct, c'est « le 2e
   * `goods_production` de ce wonder ». Sommer par `type` ratait donc la moitié
   * des valeurs. Le rang part maintenant dans `instance`, séparément, et le
   * `type` reste sommable tel quel.
   */
  function pushBonus(
    projection: Projection,
    values: (number | null)[],
    componentId: string,
    label: string,
  ): void {
    const missing = values.findIndex((v) => v === null);
    if (missing !== -1) {
      warnings.push(
        `${label} : aucune valeur au niveau ${missing + 1} (table démarrant au-delà) — bonus non projeté.`,
      );
      return;
    }
    const numeric = (values as number[]).map((v) =>
      round(applyTransform(v, projection) * projection.scale),
    );
    // Le game design décrit certains effets en plusieurs exemplaires portant la
    // même courbe (les 3 rangs de biens d'un coffre, p. ex.). Un doublon exact
    // n'ajoute rien : on le laisse tomber plutôt que de lui donner un rang.
    // Le test de doublon porte sur (type, valeurs), comme avant — le `type` est
    // désormais canonique, donc la comparaison est exacte au lieu d'un préfixe.
    if (
      bonuses.some(
        (b) =>
          b.type === projection.type &&
          b.values.length === numeric.length &&
          b.values.every((v, i) => v === numeric[i]),
      )
    ) {
      return;
    }
    bonuses.push({
      type: projection.type,
      icons: projection.icons,
      values: numeric,
      format: projection.format,
      scope: projection.scope,
      instance: bonuses.filter((b) => b.type === projection.type).length + 1,
      sourceComponentId: componentId,
    });
  }

  function pushSynergy(
    curve: WonderCurve,
    projection: Projection,
    componentId: string,
    label: string,
  ): void {
    const perTag = curve.effective[1];
    if (perTag === null) {
      warnings.push(`${label} : table de tag sans valeur à 1 tag — synergie non projetée.`);
      return;
    }
    const tag = curve.tag;
    if (tag === null) {
      warnings.push(`${label} : table indexée par tag sans champ \`tag\` — synergie non projetée.`);
      return;
    }
    const magnitude = formatMagnitude(applyTransform(perTag, projection) * projection.scale);
    synergies.push({
      tag: tag.toLowerCase(),
      icons: projection.icons,
      bonus: projection.format === "percent" ? `${magnitude}%` : magnitude,
      sourceComponentId: componentId,
    });
  }

  for (const rawComponent of asArray(entity.components)) {
    const component = asObject(rawComponent);
    const componentType = shortType(component);
    const componentId = asString(component.id) ?? `${id}:${componentType}`;

    switch (componentType) {
      case "WonderLevelUpComponentDTO": {
        const dynamicCosts = asObject(component.dynamicCosts);
        costScheme = readCostScheme(dynamicCosts);
        const requiredWorkersId = asString(asObject(component.requiredWorkers).dynamicValueDefinitionId);
        effects.push({
          kind: "levelUp",
          componentId,
          componentType,
          durationSeconds: durationSeconds(component.duration) ?? 0,
          upgradeCostSchemeId: costScheme.id,
          requiredWorkers: curveFromDefinition(src, requiredWorkersId, null, maxLevel),
        });
        break;
      }

      case "BoostResourceComponentDTO": {
        const resourceDefinitionId = asString(component.resourceDefinitionId);
        const resourceType = asString(component.resourceType);
        const buildingGroup = asString(component.buildingGroup);
        const modifier = asNumber(component.modifier);
        const curve = curveFromDefinition(
          src,
          asString(component.dynamicModifiedFloatDefinitionId),
          modifier,
          maxLevel,
        );
        if (curve === null) {
          warnings.push(`${componentId} : définition dynamique introuvable — effet ignoré.`);
          break;
        }
        effects.push({
          kind: "resourceBoost",
          componentId,
          componentType,
          resourceDefinitionId,
          resourceType,
          buildingGroup,
          cities: asArray(component.cities)
            .map(asString)
            .filter((c): c is string => c !== null),
          curve,
        });
        const projection = projectResourceBoost(
          resourceDefinitionId,
          resourceType,
          buildingGroup,
          asArray(component.cities)
            .map(asString)
            .filter((c): c is string => c !== null),
        );
        if (projection === null) {
          warnings.push(`${componentId} : cible de boost de ressource non reconnue — non projetée.`);
        } else if (curve.indexedBy === "level") {
          pushBonus(projection, curve.effective, componentId, componentId);
        } else {
          pushSynergy(curve, projection, componentId, componentId);
        }
        break;
      }

      case "BoostUnitStatComponentDTO": {
        const unitType = asString(component.unitType);
        const statDefinitionId = require0(
          asString(component.statDefinitionId),
          `${componentId}.statDefinitionId`,
        );
        const curve = curveFromDefinition(
          src,
          asString(component.dynamicUnitStatChangeDefinitionId),
          asNumber(component.modifier),
          maxLevel,
        );
        if (curve === null) {
          warnings.push(`${componentId} : définition dynamique introuvable — effet ignoré.`);
          break;
        }
        effects.push({
          kind: "unitStatBoost",
          componentId,
          componentType,
          unitType,
          statDefinitionId,
          curve,
        });
        const projection = projectUnitStatBoost(unitType, statDefinitionId);
        if (projection === null) {
          warnings.push(`${componentId} : stat « ${statDefinitionId} » non projetée.`);
        } else if (curve.indexedBy === "level") {
          pushBonus(projection, curve.effective, componentId, componentId);
        } else {
          pushSynergy(curve, projection, componentId, componentId);
        }
        break;
      }

      case "BuildingBoostComponentDTO": {
        const boostDefinitionId = require0(
          asString(component.boostDefinitionId),
          `${componentId}.boostDefinitionId`,
        );
        const boost = src.byId.get(boostDefinitionId);
        if (boost === undefined) {
          warnings.push(`${componentId} : boost « ${boostDefinitionId} » introuvable — effet ignoré.`);
          break;
        }
        const boostTypeNode = asObject(boost.boostType);
        const boostType = shortType(boostTypeNode);
        const boostTarget: Record<string, string> = {};
        for (const [key, value] of Object.entries(boostTypeNode)) {
          if (key === "@type" || key === "id") continue;
          const text = asString(value);
          if (text !== null) boostTarget[key] = text;
        }
        // La table du boost est inline dans `modifier` (01-socle §5.2), pas référencée.
        const curve = buildCurve(asObject(boost.modifier), boostDefinitionId, null, maxLevel);
        if (curve === null) {
          warnings.push(`${componentId} : table de boost non indexée — effet ignoré.`);
          break;
        }
        effects.push({
          kind: "buildingBoost",
          componentId,
          componentType,
          boostDefinitionId,
          boostType,
          boostTarget,
          curve,
        });
        const projection = projectBuildingBoost(boostDefinitionId, boostType, boostTarget);
        if (projection === null) {
          warnings.push(`${componentId} : boostType « ${boostType} » non projeté.`);
        } else if (curve.indexedBy === "level") {
          pushBonus(projection, curve.effective, componentId, componentId);
        } else {
          pushSynergy(curve, projection, componentId, componentId);
        }
        break;
      }

      case "GrantWorkerComponentDTO": {
        const workerType = asString(component.type);
        const curve = curveFromDefinition(
          src,
          asString(component.dynamicAmountDefinitionId),
          null,
          maxLevel,
        );
        if (curve === null) {
          warnings.push(`${componentId} : définition dynamique introuvable — effet ignoré.`);
          break;
        }
        effects.push({ kind: "grantWorker", componentId, componentType, workerType, curve });
        pushBonus(projectGrantWorker(workerType, cityDefinition), curve.effective, componentId, componentId);
        break;
      }

      case "IncreaseTagBonusComponentDTO": {
        const amount = asNumber(component.amount) ?? 0;
        effects.push({
          kind: "increaseTagBonus",
          componentId,
          componentType,
          amount,
          assumedTags: tags,
        });
        for (const tag of tags) {
          countsAs.push({ tag: tag.toLowerCase(), multiplier: 1 + amount });
        }
        if (tags.length > 1) {
          warnings.push(
            `${componentId} : IncreaseTagBonusComponentDTO ne porte aucun tag (§2.4 / W6) ; ` +
              `appliqué aux ${tags.length} tags du wonder (${tags.join(", ")}) faute de mieux.`,
          );
        }
        break;
      }

      case "ConditionalBonusComponentDTO": {
        effects.push({
          kind: "conditionalBonus",
          componentId,
          componentType,
          conditionType: shortType(component.condition),
          fulfilledDynamicChangeDefinitionId:
            asString(asObject(component.fulfilled).dynamicChangeDefinitionId) ?? "",
          cap: asNumber(component.cap) ?? 0,
        });
        warnings.push(
          `${componentId} : ConditionalBonusComponentDTO — condition vide et \`cap\` sans unité ` +
            `ni période (§2.6 / W8) ; conservé dans effects, non projeté en bonus.`,
        );
        break;
      }

      case "GrantCommanderSlotComponentDTO": {
        effects.push({ kind: "grantCommanderSlot", componentId, componentType });
        break;
      }

      case "ProductionComponentDTO": {
        const producedId = asString(component.producedDynamicActionChangeDefinitionId);
        const produced = describeProduced(src, producedId, maxLevel);
        const finish = describeRewards(src, asObject(component.finish).rewards, maxLevel);

        const tagBehaviours: { tag: string; rewards: WonderRewardDescriptor[] }[] = [];
        const otherBehaviours: string[] = [];
        for (const rawBehaviour of asArray(component.behaviours)) {
          const behaviour = asObject(rawBehaviour);
          if (shortType(behaviour) === "WonderBonusBehaviourDTO") {
            const tag = asString(behaviour.tag);
            if (tag === null) {
              otherBehaviours.push("WonderBonusBehaviourDTO(sans tag)");
              continue;
            }
            tagBehaviours.push({ tag, rewards: describeRewards(src, behaviour.rewards, maxLevel) });
          } else {
            otherBehaviours.push(shortType(behaviour));
          }
        }

        const durationS = durationSeconds(component.duration) ?? 0;
        effects.push({
          kind: "production",
          componentId,
          componentType,
          auto: component.auto === true,
          durationSeconds: durationS,
          minCollectionPeriodSeconds: durationSeconds(component.minCollectionPeriod) ?? 0,
          skipPricePerMinute: asNumber(component.skipPricePerMinute) ?? 0,
          productionType: asString(component.type),
          producedDynamicActionChangeDefinitionId: producedId,
          produced,
          finish,
          tagBehaviours,
          otherBehaviours,
        });

        // Bonus : toute récompense de production dont la courbe est indexée par
        // niveau, qu'elle soit versée au cycle (`produced`) ou à la collecte
        // (`finish`). Les biens des wonders de type Temple passent par `finish`.
        for (const descriptor of [...produced, ...finish]) {
          const projection = projectReward(descriptor);
          const values =
            descriptor.kind === "mysteryChest"
              ? descriptor.firstBranchChancePercent
              : descriptor.amounts;
          if (projection === null || values === null) {
            warnings.push(
              `${componentId} : récompense « ${descriptor.kind}` +
                `${descriptor.resourceDefinitionId === null ? "" : `:${descriptor.resourceDefinitionId}`} » ` +
                `non projetable en courbe — conservée dans effects.`,
            );
            continue;
          }
          if (descriptor.kind === "mysteryChest") {
            // `chances[]` est une distribution ; rien ne désigne la branche
            // « à obtenir ». Au-delà de deux branches, lire la première est
            // une convention, pas une lecture des données.
            const branches = chestBranchCount.get(descriptor) ?? 0;
            if (branches > 2) {
              warnings.push(
                `${componentId} : coffre à ${branches} branches — \`chest_drop_chance\` ` +
                  `retient la chance de la 1re branche, la donnée ne dit pas laquelle est la récompense visée.`,
              );
            }
          }
          pushBonus(projection, values, componentId, componentId);
        }

        // Synergies : `WonderBonusBehaviourDTO` verse une récompense liée à un tag (§2.7 / W9).
        for (const behaviour of tagBehaviours) {
          const descriptor = behaviour.rewards.find((r) => r.amounts !== null);
          if (descriptor === undefined || descriptor.amounts === null) {
            warnings.push(
              `${componentId} : WonderBonusBehaviour(${behaviour.tag}) sans montant lisible — non projeté.`,
            );
            continue;
          }
          const first = descriptor.amounts[0];
          if (first === null) continue;
          const perDay = durationS === 86400;
          const magnitude = formatMagnitude(first);
          const icons: [string, string | null] =
            descriptor.kind === "good"
              ? descriptor.goodOffset === -1
                ? ["icon_previous_goods", null]
                : ["chest_good", null]
              : descriptor.resourceDefinitionId === "research_points"
                ? ["research", null]
                : ["chest_good", null];
          synergies.push({
            tag: behaviour.tag.toLowerCase(),
            icons,
            bonus:
              descriptor.kind === "resource" && perDay ? `${magnitude}/day` : magnitude,
            sourceComponentId: componentId,
          });
        }
        break;
      }

      default:
        warnings.push(`${componentId} : composant « ${componentType} » non modélisé.`);
        break;
    }
  }

  if (costScheme === null) {
    throw new Error(`${id} : aucun WonderLevelUpComponentDTO, barème de coûts introuvable.`);
  }

  const collectionIds = ctx.collectionsByWonderId.get(id) ?? [];
  const primaryCollectionId = collectionFromCostScheme(costScheme.id);
  if (primaryCollectionId === null) {
    throw new Error(`${id} : barème « ${costScheme.id} » hors convention de nommage.`);
  }
  if (collectionIds.length > 1) {
    warnings.push(
      `Référencé par ${collectionIds.length} collections (${collectionIds.join(", ")}) — ` +
        `W14 ; collection retenue : ${primaryCollectionId} (celle du barème de coûts).`,
    );
  }

  const labels = ctx.collectionLabels.get(primaryCollectionId);
  const rarity = asString(entity.rarity) === "Rarity_LEGENDARY" ? "Legendary" : "Rare";

  const firstMaterial = require0(
    asString(entity.firstMaterialDefinitionId),
    `${id}.firstMaterialDefinitionId`,
  );
  const secondMaterial = require0(
    asString(entity.secondMaterialDefinitionId),
    `${id}.secondMaterialDefinitionId`,
  );

  const wonder: WonderExtract = {
    id,
    code,
    name: translate(src, `Base.Wonders.${id}_Name`),
    description: translate(src, `Base.Wonders.${id}_Desc`),

    cityDefinition,
    slot: translate(src, `Base.Cities.${cityDefinition}_Name`),
    collectionIds,
    primaryCollectionId,
    group: labels?.short ?? primaryCollectionId,
    groupCode: labels?.code ?? collectionCodeOf(primaryCollectionId),
    tags,
    materials: [
      firstMaterial.replace(/^material_/, ""),
      secondMaterial.replace(/^material_/, ""),
    ],
    blueprintMaterialDefinitionId: require0(
      asString(entity.blueprintMaterialDefinitionId),
      `${id}.blueprintMaterialDefinitionId`,
    ),
    firstMaterialDefinitionId: firstMaterial,
    secondMaterialDefinitionId: secondMaterial,
    rarity,
    maxLevel,

    newUntil: asString(entity.newUntil),
    slotType: asString(entity.slotType),
    freeProductionSlots: asNumber(entity.freeProductionSlots),

    effects,
    upgradeCostSchemeId: costScheme.id,

    bonuses,
    synergies,
    countsAs,

    warnings,
  };

  if (wonder.name === "") {
    warnings.push(`Libellé absent pour Base.Wonders.${id}_Name (C7).`);
  }

  return { wonder, costScheme };
}

// ─── Bundle complet ───────────────────────────────────────────────────────────

export function extractWonders(root: string): WonderExtractBundle {
  const src = loadSource(root);

  const constantsEntity = (src.byType.get("ConstantsDefinitionDTO") ?? [])[0];
  const wonderConstants = asObject(asObject(constantsEntity).wonders);
  const maxLevel = asNumber(wonderConstants.maximumWonderLevel);
  if (maxLevel === null) {
    throw new Error("ConstantsDefinition.wonders.maximumWonderLevel introuvable.");
  }

  const promotionDropChances: Record<string, number> = {};
  for (const [key, value] of Object.entries(asObject(wonderConstants.promotionDropChances))) {
    const n = asNumber(value);
    if (n !== null) promotionDropChances[key] = n;
  }

  const constants: WonderConstants = {
    maximumWonderLevel: maxLevel,
    gearsToWonderOrbExchangeRate: asNumber(wonderConstants.gearsToWonderOrbExchangeRate) ?? 0,
    orbMultiPurchaseAmount: asNumber(wonderConstants.orbMultiPurchaseAmount) ?? 0,
    maximumContributionRequestsPerLevel:
      asNumber(wonderConstants.maximumContributionRequestsPerLevel) ?? 0,
    crateResearchPointAmounts: asArray(wonderConstants.crateResearchPointAmounts)
      .map(asNumber)
      .filter((n): n is number => n !== null),
    promotionRuntimeSeconds: durationSeconds(wonderConstants.promotionRuntime) ?? 0,
    promotionDropChances,
    freeLayouts: asNumber(wonderConstants.freeLayouts) ?? 0,
  };

  // Collections
  const collections: WonderCollectionExtract[] = [];
  const collectionsByWonderId = new Map<string, string[]>();
  const collectionLabels = new Map<string, { short: string; code: string }>();

  for (const entity of src.byType.get("WonderCollectionDefinitionDTO") ?? []) {
    const id = require0(asString(entity.id), "WonderCollectionDefinition.id");
    const wonderIds = asArray(entity.wonderIds)
      .map(asString)
      .filter((w): w is string => w !== null);
    for (const wonderId of wonderIds) {
      const bucket = collectionsByWonderId.get(wonderId);
      if (bucket) bucket.push(id);
      else collectionsByWonderId.set(wonderId, [id]);
    }
    const short = shortCollectionLabel(
      translate(src, `Base.WonderCollections.${id}_FormattedName`),
      id,
    );
    collectionLabels.set(id, { short, code: collectionCodeOf(id) });
    collections.push({
      id,
      name: translate(src, `Base.WonderCollections.${id}_Name`),
      shortName: short,
      order: asNumber(entity.order),
      wonderIds,
      promotions: asArray(entity.promotions).map((rawPromotion) => {
        const promotion = asObject(rawPromotion);
        return {
          id: asString(promotion.id) ?? "",
          order: asNumber(promotion.order) ?? 0,
          promotedWonderIds: asArray(promotion.promotedWonderIds)
            .map(asString)
            .filter((w): w is string => w !== null),
        };
      }),
    });
  }
  collections.sort((a, b) => a.id.localeCompare(b.id));

  // Wonders
  const ctx: WonderContext = { src, maxLevel, collectionsByWonderId, collectionLabels };
  const wonders: WonderExtract[] = [];
  const costSchemes = new Map<string, WonderCostScheme>();

  for (const entity of src.byType.get("ReworkedWonderDefinitionDTO") ?? []) {
    const { wonder, costScheme } = extractWonder(ctx, entity);
    wonders.push(wonder);
    if (!costSchemes.has(costScheme.id)) costSchemes.set(costScheme.id, costScheme);
  }
  wonders.sort((a, b) => a.id.localeCompare(b.id));

  return {
    generatedFrom: {
      gameDesignChecksum: src.gameDesignChecksum,
      locaChecksum: src.locaChecksum,
      locale: src.locale,
    },
    constants,
    collections,
    costSchemes: [...costSchemes.values()].sort((a, b) => a.id.localeCompare(b.id)),
    wonders,
  };
}

/**
 * Clés de bonus extraites mais NON affichées.
 *
 * `chest_drop_chance` : `MysteryChestRewardDTO.chances[]` est une distribution
 * sur les branches du coffre, et rien dans les données ne désigne la branche
 * « à obtenir ». Sur les 4 coffres à commandant (2 branches) lire la première
 * donne 20 %→46,5 %, mais sur Hagia Sophia (7 branches) ou Yggdrasil le choix
 * est arbitraire. Tant que la valeur réelle n'est pas relevée en jeu, la donnée
 * reste dans `WONDER_EXTRACT` (et dans `effects[].produced[].firstBranchChancePercent`)
 * mais ne descend pas jusqu'à l'UI.
 */
const UI_EXCLUDED_BONUS_TYPES = new Set(["chest_drop_chance"]);

/** Projection étroite consommée par `assembleWonder()` (data/wonders/index.ts). */
export function toRawEntries(bundle: WonderExtractBundle): WonderRawEntry[] {
  return bundle.wonders.map((wonder) => {
    const entry: WonderRawEntry = {
      meta: {
        code: wonder.code,
        name: wonder.name,
        group: wonder.group,
        slot: wonder.slot,
        materials: wonder.materials,
        rarity: wonder.rarity,
        synergies: wonder.synergies.map((s) => ({ raw: s.tag, icons: s.icons, bonus: s.bonus })),
      },
      bonuses: wonder.bonuses
        .filter((b) => !UI_EXCLUDED_BONUS_TYPES.has(b.type))
        .map((b) => ({
          type: b.type,
          icons: b.icons,
          values: b.values,
          format: b.format,
          scope: b.scope,
          instance: b.instance,
        })),
    };
    if (wonder.countsAs.length > 0) entry.meta.countsAs = wonder.countsAs;
    return entry;
  });
}

// ─── Émission ─────────────────────────────────────────────────────────────────

const HEADER = `// ============================================================
// GÉNÉRÉ AUTOMATIQUEMENT — NE PAS ÉDITER À LA MAIN.
//
// Produit par scripts/extract/wonders.ts à partir de
// source/gamedesign.json + source/loca.json.
// Régénérer avec : pnpm extract:wonders
// ============================================================
`;

function renderModule(bundle: WonderExtractBundle, raw: WonderRawEntry[]): string {
  return [
    HEADER,
    `import type {`,
    `  WonderExtractBundle,`,
    `  WonderRawEntry,`,
    `} from "./types";`,
    ``,
    `/** Extraction complète et fidèle du domaine Wonders. */`,
    `export const WONDER_EXTRACT: WonderExtractBundle = ${JSON.stringify(bundle, null, 2)};`,
    ``,
    `/** Projection étroite consommée par assembleWonder() (data/wonders/index.ts). */`,
    `export const WONDER_RAW_DATA: WonderRawEntry[] = ${JSON.stringify(raw, null, 2)};`,
    ``,
  ].join("\n");
}

function main(): void {
  const root = process.cwd();
  const bundle = extractWonders(root);
  const raw = toRawEntries(bundle);

  const outDir = path.join(root, "data", "wonders", "generated");
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, "wonders.generated.ts");
  fs.writeFileSync(outFile, renderModule(bundle, raw), "utf8");

  // Rapport : le maintien du vocabulaire de bonus est manuel, il doit être visible.
  const bonusTypes = new Set<string>();
  const hiddenTypes = new Set<string>();
  const synergyTags = new Set<string>();
  let warningCount = 0;
  for (const wonder of bundle.wonders) {
    for (const bonus of wonder.bonuses) {
      if (UI_EXCLUDED_BONUS_TYPES.has(bonus.type)) hiddenTypes.add(bonus.type);
      else bonusTypes.add(bonus.type);
    }
    for (const synergy of wonder.synergies) synergyTags.add(synergy.tag);
    warningCount += wonder.warnings.length;
  }

  process.stdout.write(
    [
      `Wonders extraits      : ${bundle.wonders.length}`,
      `Collections           : ${bundle.collections.length}`,
      `Barèmes de coûts      : ${bundle.costSchemes.length}`,
      `Niveau max (constante): ${bundle.constants.maximumWonderLevel}`,
      `Clés de bonus         : ${[...bonusTypes].sort().join(", ")}`,
      `Extraites non affichées: ${[...hiddenTypes].sort().join(", ") || "(aucune)"}`,
      `Tags de synergie      : ${[...synergyTags].sort().join(", ")}`,
      `Points indéterminés   : ${warningCount} (détail dans WONDER_EXTRACT[].warnings)`,
      `Écrit                 : ${path.relative(root, outFile)}`,
      ``,
    ].join("\n"),
  );
}

main();
