// ============================================================
// ROC Helper – Extraction du domaine Heritage Vault
//
// Lit `source/gamedesign.json` + `source/loca.json` et écrit
// `data/heritage/generated/heritage.generated.ts`.
//
// Le game design est la SEULE source de ce domaine : contrairement aux
// Bâtiments, aux Technologies ou à la Campagne, il n'existe AUCUNE donnée
// saisie à la main pour le Heritage Vault dans ce dépôt. Il n'y a donc rien à
// comparer, et `scripts/diff/heritage.ts` ne fait pas un diff main/extraction :
// c'est un GARDE-FOU de non-duplication et de complétude.
//
// ─── Ce que ce module ne fait PAS ─────────────────────────────────────────────
//
//  1. Il ne réextrait pas les 13 bâtiments-marqueurs `Building_Heritage_*_1`.
//     Ils sont déjà dans `BUILDING_EXTRACT` (`scope: "decoration"`,
//     `chainKey = City_Capital|heritage<Theme>`). Seule la clé de chaîne est
//     reprise, comme pont.
//  2. Il ne fabrique AUCUN catalogue d'offres du gardien. Les 29 formules
//     `Lua_HeritageVault_KeeperOffer_*` ont 0 référence entrante dans les 66 Mo :
//     le game design donne les prix et rien d'autre. Voir
//     `HeritageKeeperOfferFormula` dans les types.
//  3. Il ne recopie ni le dictionnaire de bonus (`BONUS_LABELS` est importé),
//     ni la table des ères (`ERAS` est importée), ni l'ordre des âges
//     (`AgeDefinitionDTO.order` est lu dans le game design).
//
// ─── Garde-fous ───────────────────────────────────────────────────────────────
//
// Toute forme inconnue lève une `HeritageExtractionError` et fait ÉCHOUER la
// commande : composant d'effet hors des six types connus, type de récompense ou
// de prérequis hors liste, slot à plusieurs groupes, effet à plusieurs
// composants, script Lua introuvable. Rien n'est attrapé en silence — un jour où
// le jeu livre une forme neuve, le build casse au lieu de produire une donnée
// muette.
//
// Structure des données : docs/game-schema/05-wonders-reliques-heritage.md §4
// Conventions          : docs/game-schema/00-conventions.md
//   - C3 : les int64 sont sérialisés en string
//   - C7 : une clé de loca absente est un libellé absent, pas une erreur
//   - C9 : les tables dynamiques se lisent par palier
//
// Usage : pnpm extract:heritage
// ============================================================

import fs from "node:fs";
import path from "node:path";

import { ERAS } from "../../data/config";
import type {
  BuildingAgeCurve,
  BuildingAgeCurveEntry,
  BuildingBonus,
  BuildingBonusFormat,
  BuildingBonusGap,
  BuildingBonusScope,
  BuildingCurve,
  BuildingCurveStep,
} from "../../data/buildings/generated/types";
import type {
  HeritageAmountLine,
  HeritageEffectExtract,
  HeritageEffectGroup,
  HeritageExtractBundle,
  HeritageKeeperAmplifier,
  HeritageKeeperOfferFormula,
  HeritageLevelScheme,
  HeritageRequirement,
  HeritageRequirementKind,
  HeritageRewardKind,
  HeritageRewardNode,
  HeritageRewardTier,
  HeritageSlotExtract,
  HeritageSlotUnlock,
  HeritageVaultExtract,
} from "../../data/heritage/generated/types";
import { BONUS_LABELS } from "../../resolvers/bonus";
import {
  collectLuaVariables,
  evaluateCurveFormula,
  evaluateLuaFormula,
} from "../../resolvers/lua-formula";

// ─── Échec explicite ──────────────────────────────────────────────────────────

/** Toute forme que l'extraction ne sait pas lire — jamais avalée. */
class HeritageExtractionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "HeritageExtractionError";
  }
}

function fail(message: string): never {
  throw new HeritageExtractionError(message);
}

// ─── Accès JSON typé ──────────────────────────────────────────────────────────
//
// Mêmes helpers que scripts/extract/buildings.ts : même game design, mêmes
// pièges (C3, `@type` préfixé, durées protobuf).

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

/** Nombre, en acceptant la forme string des int64 (C3). */
function asNumber(v: Json): number | null {
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

/** `type.googleapis.com/FooDTO` → `FooDTO`. */
function shortType(v: Json): string {
  const t = asString(asObject(v)["@type"]);
  return t === null ? "" : t.slice(t.lastIndexOf("/") + 1);
}

/** `"86400s"` → 86400. Les durées du game design sont des `Duration` protobuf. */
function asSeconds(v: Json): number | null {
  const s = asString(v);
  if (s === null) return null;
  const m = /^(-?\d+(?:\.\d+)?)s$/.exec(s.trim());
  return m === null ? null : Number(m[1]);
}

/** Coupe le bruit de virgule flottante des produits `modifier × valeur`. */
function round(value: number, digits = 6): number {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

// ─── Formes attendues (garde-fous) ────────────────────────────────────────────

/**
 * Les six types de composant d'effet, mesurés sur les 130 effets des 13 vaults.
 * Tout autre type fait échouer l'extraction.
 */
const KNOWN_EFFECT_COMPONENTS = new Set([
  "ProductionComponentDTO",
  "GrantWorkerComponentDTO",
  "CultureComponentDTO",
  "BoostUnitStatComponentDTO",
  "BoostResourceComponentDTO",
  "BuildingBoostComponentDTO",
]);

/** Les nœuds de l'arbre `finish.rewards`. Tout autre type fait échouer. */
const REWARD_KIND_BY_TYPE: Record<string, HeritageRewardKind> = {
  RewardDefinitionDTO: "group",
  MysteryChestRewardDTO: "mysteryChest",
  LootContainerRewardDTO: "lootContainer",
  DynamicActionChangeRewardDTO: "dynamicActionChange",
  RelicRewardDTO: "relic",
  InventoryItemRewardDTO: "inventoryItem",
  SelectionKitRewardDTO: "selectionKit",
  UnitRewardDTO: "unit",
  ResourceRewardDTO: "resource",
  BuildingCustomizationRewardDTO: "buildingCustomization",
};

const REQUIREMENT_KIND_BY_TYPE: Record<string, HeritageRequirementKind> = {
  ResearchRequirementDTO: "research",
  AgeRequirementDTO: "minAge",
  RelicNotUnlockedRequirementDTO: "relicNotUnlocked",
};

const EFFECT_GROUP_BY_ID: Record<string, HeritageEffectGroup> = {
  HeritageEffectGroupType_PRODUCTION: "production",
  HeritageEffectGroupType_BOOST: "boost",
};

// ─── Vocabulaire de bonus ─────────────────────────────────────────────────────
//
// `resolvers/bonus.ts` est le dictionnaire unique. Il est IMPORTÉ, pas recopié :
// cet extracteur est compilé par `tsconfig.scripts.json` (qui résout `@/*`) et
// lancé avec `--require ./scripts/alias-register.js`, donc il peut charger un
// module de `resolvers/` comme le fait déjà scripts/diff/buildings.ts.
//
// Ce que ce domaine rencontre sans équivalent n'est PAS ajouté au dictionnaire :
// il produit un `BuildingBonusGap` (type proposé + raison), pour validation.

const KNOWN_BONUS_TYPES = new Set(Object.keys(BONUS_LABELS));

/** Segment snake_case par `statDefinitionId` — identique à wonders / bâtiments. */
const STAT_KEY: Record<string, string> = {
  UnitStat_Damage: "damage",
  UnitStat_HitPoints: "hp",
  UnitStat_CriticalHitChance: "critical_hit_chance",
  UnitStat_CriticalHitDamage: "critical_hit_damage",
  UnitStat_HitRate: "hit_rate",
  UnitStat_MovementSpeed: "movement_speed",
};

/** Segment snake_case par `unitType` — identique à wonders / bâtiments. */
const UNIT_KEY: Record<string, string> = {
  infantry: "infantry",
  ranged: "ranged",
  cavalry: "cavalry",
  heavyInfantry: "heavy_infantry",
  bastion: "bastion",
  siege: "siege",
};

/** Alias de clé — identique à wonders / bâtiments. */
const BONUS_TYPE_ALIAS: Record<string, string> = {
  ranged_critical_hit_chance: "ranged_critical_hit_boost",
};

/**
 * `Good1` | `Good2` | `Good3` → rang de bien côté projet.
 *
 * ⚠️ Même décision, et même raison, que scripts/extract/buildings.ts : on écrit
 * le RANG, jamais le bien concret. `ResourceDefinition.order` est un tri de
 * catalogue identique pour tous ; `primary`/`secondary`/`tertiary` est
 * l'assignation d'ateliers PROPRE À CHAQUE COMPTE, absente du game design. Figer
 * un bien reviendrait à imposer à tous l'assignation du compte d'extraction.
 */
const GOOD_RANK: Record<string, string> = {
  Good1: "primary",
  Good2: "secondary",
  Good3: "tertiary",
};

const OUTPUT_TYPE_BY_RESOURCE: Record<string, string> = {
  coins: "coins_output",
  food: "food_output",
  research_points: "research_points_output",
};

// ─── Index du game design ─────────────────────────────────────────────────────

interface SourceIndex {
  byId: Map<string, JsonObject>;
  byType: Map<string, JsonObject[]>;
  loca: Map<string, string>;
  /** `AgeDefinition.id` → `order`, lu dans le game design (pas une table projet). */
  ageOrder: Map<string, number>;
  gameDesignChecksum: string | null;
  locaChecksum: string | null;
  locale: string | null;
}

function loadSource(root: string): SourceIndex {
  const gdPath = path.join(root, "source", "gamedesign.json");
  const locaPath = path.join(root, "source", "loca.json");
  for (const p of [gdPath, locaPath]) {
    if (!fs.existsSync(p)) {
      fail(`Source introuvable : ${p} (lancer la commande depuis la racine du dépôt)`);
    }
  }

  const gdRoot = asObject(JSON.parse(fs.readFileSync(gdPath, "utf8")) as Json);
  const gdEnvelope = asObject(asArray(gdRoot.content)[0]);
  const entities = asArray(gdEnvelope.content).filter(isObject);

  const byId = new Map<string, JsonObject>();
  const byType = new Map<string, JsonObject[]>();
  const ageOrder = new Map<string, number>();
  for (const entity of entities) {
    const id = asString(entity.id);
    if (id !== null && !byId.has(id)) byId.set(id, entity);
    const type = shortType(entity);
    const bucket = byType.get(type);
    if (bucket) bucket.push(entity);
    else byType.set(type, [entity]);
    if (type === "AgeDefinitionDTO" && id !== null) {
      const order = asNumber(entity.order);
      if (order !== null) ageOrder.set(id, order);
    }
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
    byId,
    byType,
    loca,
    ageOrder,
    gameDesignChecksum: asString(gdEnvelope.checksum),
    locaChecksum: asString(locaEnvelope.checksum),
    locale: asString(locaEnvelope.locale),
  };
}

/** C7 : une clé sans traduction est un libellé absent, pas une erreur. */
function translate(src: SourceIndex, key: string): string {
  return src.loca.get(key) ?? "";
}

// ─── Ères ─────────────────────────────────────────────────────────────────────
//
// `ERAS` (data/config.ts) est la source de vérité projet, et son champ
// `gameDesignAge` est déclaré là-bas comme « seul pont » avec le vocabulaire
// d'extraction. Rien n'est redéclaré ici.

const AGES = ERAS.map((era) => era.gameDesignAge);
const AGE_INDEX = new Map(AGES.map((age, i) => [age, i]));
const ABBR_BY_AGE = new Map(ERAS.map((era) => [era.gameDesignAge, era.abbr]));

/** Les âges projet gouvernés par `age`, jusqu'au palier suivant exclu (C9). */
function agesGovernedBy(age: string, nextAge: string | null): string[] {
  const from = AGE_INDEX.get(age);
  if (from === undefined) return [age];
  const to = nextAge === null ? AGES.length : (AGE_INDEX.get(nextAge) ?? AGES.length);
  return AGES.slice(from, to);
}

/**
 * `playerAgeOrder` d'un âge — `AgeDefinition.order`, lu tel quel.
 *
 * Le game design le déclare (DawnAge = 1, StoneAge = 2 … LateGothicEra = 15) :
 * aucune table à la main, et aucune dérivation depuis l'index de `ERAS`, qui
 * commence à StoneAge et donnerait un décalage de 1.
 */
function playerAgeOrder(src: SourceIndex, age: string): number {
  const order = src.ageOrder.get(age);
  if (order === undefined) fail(`Âge sans \`order\` dans le game design : ${age}`);
  return order;
}

/**
 * Identifiant de ressource du game design → clé de ressource côté projet.
 *
 * `offset` décale l'ère du bien (`-1` = ère précédente) : il n'est résolu que
 * lorsque l'âge de lecture est connu, d'où le paramètre.
 */
function toProjectResourceKey(definitionId: string, age: string | null = null): string {
  const dyn = /^DYN\|([A-Za-z]+)_(Good\d)$/.exec(definitionId);
  if (dyn !== null) {
    const abbr = ABBR_BY_AGE.get(dyn[1]);
    const rank = GOOD_RANK[dyn[2]];
    if (abbr === undefined || rank === undefined) {
      fail(`Bien d'âge non projetable : ${definitionId} — compléter ERAS / GOOD_RANK`);
    }
    return `${rank}_${abbr.toLowerCase()}`;
  }
  const ranked = /^(Good\d)(?:@(-?\d+))?$/.exec(definitionId);
  if (ranked !== null) {
    const rank = GOOD_RANK[ranked[1]];
    if (rank === undefined) fail(`Rang de bien inconnu : ${definitionId}`);
    const offset = ranked[2] === undefined ? 0 : Number(ranked[2]);
    if (age === null) return rank;
    const index = AGE_INDEX.get(age);
    if (index === undefined) return rank;
    const shifted = ERAS[index + offset];
    // Hors bornes : l'ère décalée n'existe pas (pas d'ère avant StoneAge). Le
    // rang nu est alors la seule chose vraie — on ne date pas ce qu'on ignore.
    return shifted === undefined ? rank : `${rank}_${shifted.abbr.toLowerCase()}`;
  }
  return definitionId;
}

// ─── Courbes par niveau ───────────────────────────────────────────────────────
//
// Même lecture que scripts/extract/buildings.ts, sur la même forme
// (`BuildingLevelDynamicChangeDTO` + `dynamicFormulaChangeCase`) : la table fait
// autorité sur sa plage, la formule prend le relais au-delà du dernier `when`
// (02-dynamic.md §5.1). Le résultat est un `BuildingCurve`, donc lisible tel
// quel par `resolvers/building-curves.ts`.

/** Un `then` vide n'est pas 0 : c'est « pas de bonus » → `null`. */
function payloadValue(then: Json): number | null {
  const o = asObject(then);
  for (const key of ["value", "factor", "modifier", "amount"]) {
    if (key in o) return asNumber(o[key]);
  }
  return null;
}

/** Le `mapping` d'une définition dynamique est tantôt un objet, tantôt un tableau. */
function firstMapping(definition: JsonObject): JsonObject {
  const mapping = definition.mapping;
  return Array.isArray(mapping) ? asObject(mapping[0]) : asObject(mapping);
}

/** Lecture par palier (C9) : valeur en `k` = entrée de plus grand `when` ≤ `k`. */
function resolveByStep(steps: BuildingCurveStep[], keys: number[]): (number | null)[] {
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

interface CurveSources {
  definitionId: string;
  modifier: number | null;
  levels: number;
  table: BuildingCurveStep[];
  formula: string | null;
  valueLimit: number | null;
  luaScript: string | null;
  /** Variables injectées en plus d'`entityLevel` (ex. `playerAgeOrder`). */
  luaContext?: Record<string, number>;
}

function assembleCurve(sources: CurveSources): BuildingCurve {
  const { definitionId, modifier, levels, table, formula, valueLimit, luaScript } = sources;
  const keys = Array.from({ length: levels }, (_, i) => i + 1);
  const stepped = resolveByStep(table, keys);
  const lastWhen = table.length === 0 ? null : Math.max(...table.map((s) => s.when));

  const resolved = keys.map((level, i) => {
    if (luaScript !== null) {
      return round(
        evaluateLuaFormula(luaScript, { ...(sources.luaContext ?? {}), entityLevel: level }),
      );
    }
    if (formula !== null && (lastWhen === null || level > lastWhen)) {
      return round(evaluateCurveFormula(formula, { level }));
    }
    return stepped[i];
  });
  const effective = resolved.map((v) =>
    v === null ? null : modifier === null ? round(v) : round(modifier * v),
  );

  return {
    indexedBy: "buildingLevel",
    definitionId,
    modifier,
    table,
    formula,
    valueLimit,
    luaScript,
    resolved,
    effective,
  };
}

/** Les lignes `{ when, then }` d'un mapping par niveau, `then` lu par `read`. */
function levelSteps(
  mapping: JsonObject,
  read: (then: JsonObject) => number | null,
): BuildingCurveStep[] {
  const table: BuildingCurveStep[] = [];
  for (const row of asArray(mapping.values)) {
    const when = asNumber(asObject(row).when);
    if (when === null) continue;
    table.push({ when, value: read(asObject(asObject(row).then)) });
  }
  return table;
}

function buildCurve(
  mapping: JsonObject,
  definitionId: string,
  modifier: number | null,
  levels: number,
  read: (then: JsonObject) => number | null = payloadValue,
): BuildingCurve | null {
  if (shortType(mapping) !== "BuildingLevelDynamicChangeDTO") return null;
  const table = levelSteps(mapping, read);
  const formulaCase = asObject(mapping.dynamicFormulaChangeCase);
  const formula = asString(formulaCase.formula);
  if (table.length === 0 && formula === null) return null;
  return assembleCurve({
    definitionId,
    modifier,
    levels,
    table,
    formula,
    valueLimit: asNumber(formulaCase.valueLimit),
    luaScript: null,
  });
}

function curveFromDefinition(
  src: SourceIndex,
  definitionId: string | null,
  modifier: number | null,
  levels: number,
): BuildingCurve | null {
  if (definitionId === null) return null;
  const definition = src.byId.get(definitionId);
  if (definition === undefined) fail(`Définition dynamique introuvable : ${definitionId}`);
  return buildCurve(firstMapping(definition), definitionId, modifier, levels);
}

// ─── Courbes écrites en Lua ───────────────────────────────────────────────────

function luaScriptOf(src: SourceIndex, definitionId: string): string {
  const definition = src.byId.get(definitionId);
  const script = definition === undefined ? null : asString(definition.luaScript);
  if (script === null) fail(`Script Lua introuvable : ${definitionId}`);
  return script;
}

/**
 * Un script Lua balayé sur l'axe du niveau du vault.
 *
 * ⚠️ Deux formes cohabitent sur les 6 scripts d'effet : trois ne lisent que
 * `entityLevel` (courbe simple), trois lisent AUSSI `playerAgeOrder` (courbe à
 * deux axes). La seconde n'est PAS l'axe des `evolving` : l'âge est ici l'ère
 * COURANTE du joueur, pas une ère figée sur l'instance — le bâtiment-marqueur
 * n'en a pas. D'où `indexedBy: "playerAge"`.
 */
function luaCurves(
  src: SourceIndex,
  definitionId: string,
  levels: number,
  modifier: number | null,
): { curve: BuildingCurve | null; ageCurve: BuildingAgeCurve | null } {
  const script = luaScriptOf(src, definitionId);
  const variables = collectLuaVariables(script);
  const foreign = variables.filter((v) => v !== "entityLevel" && v !== "playerAgeOrder");
  if (foreign.length > 0) {
    fail(`Script Lua d'effet hors convention : ${definitionId} lit ${foreign.join(", ")}`);
  }

  if (!variables.includes("playerAgeOrder")) {
    return {
      curve: assembleCurve({
        definitionId,
        modifier,
        levels,
        table: [],
        formula: null,
        valueLimit: null,
        luaScript: script,
      }),
      ageCurve: null,
    };
  }

  const entries: BuildingAgeCurveEntry[] = AGES.map((age) => ({
    age,
    appliesTo: [age],
    resources: [],
    curve: assembleCurve({
      definitionId,
      modifier,
      levels,
      table: [],
      formula: null,
      valueLimit: null,
      luaScript: script,
      luaContext: { playerAgeOrder: playerAgeOrder(src, age) },
    }),
  }));
  return { curve: null, ageCurve: { indexedBy: "playerAge", definitionId, entries } };
}

// ─── Axe de l'ère du joueur (`PlayerAgeDynamicChangeDTO`) ─────────────────────
//
// Les 8 DAC racines de biens du Vault sont à deux axes : l'ère du joueur, puis
// le niveau du vault. Même structure que l'axe des âges des `evolving`, autre
// DTO et autre sens (cf. `luaCurves`).

/**
 * Désignation d'une ressource dans un `ActionChangeDTO`.
 *
 * Soit un `ResourceDefinition.id` (`DYN|BronzeAge_Good1`), soit un rang nu issu
 * d'un `GoodRewardDTO` — suffixé de son `offset` quand il y en a un
 * (`Good1@-1` = rang 1 de l'ère PRÉCÉDENTE), sans quoi la distinction
 * « biens de l'ère courante » / « biens de l'ère précédente » serait perdue :
 * c'est le seul champ qui sépare `Dac_…_CEGoods_1` de `Dac_…_PEGoods_1` à
 * partir de RomanEmpire.
 */
function actionResourceDescriptors(payload: JsonObject): string[] {
  const descriptors: string[] = [];
  for (const change of asArray(payload.resourceChanges)) {
    const id = asString(asObject(change).definitionId);
    if (id !== null) descriptors.push(id);
  }
  for (const reward of asArray(payload.rewards)) {
    const object = asObject(reward);
    if (shortType(object) !== "GoodRewardDTO") continue;
    const number = asNumber(object.number);
    if (number === null) continue;
    const offset = asNumber(asObject(object.dynamicGood).offset) ?? 0;
    descriptors.push(offset === 0 ? `Good${number}` : `Good${number}@${offset}`);
  }
  return descriptors;
}

/** Montant d'une ligne d'`ActionChangeDTO` — les lignes multi-ressources sont homogènes. */
function actionAmount(then: JsonObject): number | null {
  for (const change of asArray(then.resourceChanges)) {
    const amount = asNumber(asObject(change).amount);
    if (amount !== null) return amount;
  }
  for (const reward of asArray(then.rewards)) {
    const object = asObject(reward);
    if (shortType(object) !== "GoodRewardDTO") continue;
    const amount = asNumber(object.amount);
    if (amount !== null) return amount;
  }
  return null;
}

/** Ressources d'une table par niveau, table et formule réunies. */
function levelResourceDescriptors(mapping: JsonObject): string[] {
  const descriptors = new Set<string>();
  for (const row of asArray(mapping.values)) {
    for (const d of actionResourceDescriptors(asObject(asObject(row).then))) descriptors.add(d);
  }
  for (const d of actionResourceDescriptors(asObject(mapping.dynamicFormulaChangeCase))) {
    descriptors.add(d);
  }
  return [...descriptors];
}

/**
 * Un DAC INDIRECT sur l'axe de l'ère → courbe (ère du joueur × niveau du vault).
 *
 * ⚠️ DEUX DTO, UNE SEULE FORME. `PlayerAgeDynamicChangeDTO` et
 * `BuildingAgeDynamicChangeDTO` écrivent tous deux, quand leur `then` porte un
 * `dynamicChangeDefinitionId`, la MÊME chose : une ligne par ère qui pointe une
 * FEUILLE portant sa propre table par niveau. Le second DTO connaît aussi une
 * forme DIRECTE (montant tout fait dans `then.resourceChanges`, cf.
 * `buildFixedAgeCurve`) : c'est la présence de l'indirection qui départage, pas
 * le nom du DTO. Sans ce partage, les 5 DAC indirects écrits en
 * `BuildingAgeDynamicChangeDTO` (Polynesian/Mali/Thai Food, World Fair
 * Coins/PreviousEraGoods) n'étaient reconnus par AUCUN constructeur —
 * `curve`/`ageCurve` tous deux `null`, montant et ressource perdus : le coffre
 * Drum Tower affichait « Food » sans icône ni quantité, alors que le jeu montre
 * bien un nombre.
 *
 * ⚠️ TOUJOURS ÉCLATÉ par ère gouvernée (`appliesTo` à un seul élément), qu'il
 * y ait ou non un décalage d'ère dans les descripteurs : une plage `governed`
 * couvre potentiellement PLUSIEURS ères (ex. RomanEmpire → LateGothicEra faute
 * de ligne suivante déclarée), et `toProjectResourceKey(d, age)` dépend de
 * l'ère passée en second argument même pour un rang SANS décalage (il ajoute
 * le suffixe de l'ère demandée, cf. `toProjectResourceKey`). Grouper les
 * ressources sur l'unique ère `age` de la ligne déclarée les figeait donc sur
 * l'atelier configuré à CETTE ère pour toute la plage gouvernée, quels que
 * soient les changements faits dans les ateliers des ères suivantes — bug
 * corrigé ici. La courbe, elle, reste identique quelle que soit l'ère : c'est
 * un éclatement de présentation, pas une invention de donnée.
 */
function buildPlayerAgeCurve(
  src: SourceIndex,
  definitionId: string,
  levels: number,
): BuildingAgeCurve | null {
  const definition = src.byId.get(definitionId);
  if (definition === undefined) fail(`Définition dynamique introuvable : ${definitionId}`);
  const mapping = firstMapping(definition);
  const type = shortType(mapping);
  if (type !== "PlayerAgeDynamicChangeDTO" && type !== "BuildingAgeDynamicChangeDTO") return null;

  const declared: { age: string; leafId: string }[] = [];
  for (const row of asArray(mapping.values)) {
    const age = asString(asObject(row).when);
    if (age === null) continue;
    const leafIds = asArray(asObject(asObject(row).then).dynamicChangeDefinitionId)
      .map(asString)
      .filter((id): id is string => id !== null);
    // Aucune indirection : forme DIRECTE d'un `BuildingAgeDynamicChangeDTO`,
    // qui appartient à `buildFixedAgeCurve` — on lui rend la main plutôt que
    // d'échouer. Un `PlayerAgeDynamicChangeDTO` sans feuille, lui, reste hors
    // convention : il n'a pas d'autre façon de porter son montant.
    if (leafIds.length === 0 && type === "BuildingAgeDynamicChangeDTO") return null;
    if (leafIds.length !== 1) {
      fail(`Âge ${age} à ${leafIds.length} feuilles dans ${definitionId} — forme inattendue`);
    }
    declared.push({ age, leafId: leafIds[0] });
  }
  declared.sort((a, b) => (AGE_INDEX.get(a.age) ?? 0) - (AGE_INDEX.get(b.age) ?? 0));

  const entries: BuildingAgeCurveEntry[] = [];
  for (const [index, { age, leafId }] of declared.entries()) {
    const leaf = src.byId.get(leafId);
    if (leaf === undefined) fail(`Feuille d'âge introuvable : ${leafId} (${definitionId})`);
    const leafMapping = firstMapping(leaf);
    const curve = buildCurve(leafMapping, leafId, null, levels, actionAmount);
    if (curve === null) fail(`Feuille d'âge non résolue : ${leafId} (${definitionId})`);
    const descriptors = levelResourceDescriptors(leafMapping);
    const governed = agesGovernedBy(age, declared[index + 1]?.age ?? null);

    for (const governedAge of governed) {
      entries.push({
        age: governedAge,
        appliesTo: [governedAge],
        resources: descriptors.map((d) => toProjectResourceKey(d, governedAge)),
        curve,
      });
    }
  }
  return entries.length === 0 ? null : { indexedBy: "playerAge", definitionId, entries };
}

/**
 * Un `BuildingAgeDynamicChangeDTO` → courbe (ère du joueur), SANS axe de
 * niveau.
 *
 * ⚠️ DTO DISTINCT DE `PlayerAgeDynamicChangeDTO` (`buildPlayerAgeCurve`
 * ci-dessus), pas une variante : celui-ci pointe une FEUILLE qui porte sa
 * PROPRE courbe par niveau (le lot grandit avec le niveau du vault en plus de
 * l'ère) ; `BuildingAgeDynamicChangeDTO` donne le montant TOUT FAIT dans son
 * `then.resourceChanges`, sans indirection ni formule — un lot FIXE par ère,
 * qui ne bouge jamais avec le niveau du vault. Les deux DTO existent côte à
 * côte dans le game design pour les mêmes familles de coffre (biens garantis
 * `Dac_EvoChest_Coins_*`/`Dac_EvoChest_Food_*`), d'où l'essai successif dans
 * `extractReward` plutôt qu'un choix a priori.
 *
 * ⚠️ CE QUE CE DTO REMPLACE — LE BUG QU'IL CORRIGE. Sans lui, ni
 * `buildPlayerAgeCurve` ni `buildCurve` (`BuildingLevelDynamicChangeDTO`) ne
 * reconnaissent cette forme : `curve`/`ageCurve` restaient tous deux `null`,
 * et `chestRewardAmount` (`components/heritage/effect-display.ts`) retombait
 * sur son dernier recours — le SUFFIXE du `definitionId`
 * (`Dac_EvoChest_Coins_300_S_2` → 300). Ce suffixe n'est PAS un montant, c'est
 * un code de gabarit interne (300/400/500/750 = XS/S/M/L, indépendant de
 * l'ère) : la vraie valeur à l'ère `StoneAge` de ce DAC précis est 30 000, pas
 * 300 — vérifié en jeu (capture d'écran, Mongolian Mother Tree).
 *
 * Chaque montant est un PALIER CONSTANT (`table: [{ when: 1, value }]`, pas de
 * `formula`) : `assembleCurve` le rend identique à tout niveau du vault, ce
 * qui est le point — ce DTO n'a justement pas d'axe niveau.
 */
function buildFixedAgeCurve(
  src: SourceIndex,
  definitionId: string,
  levels: number,
): BuildingAgeCurve | null {
  const definition = src.byId.get(definitionId);
  if (definition === undefined) fail(`Définition dynamique introuvable : ${definitionId}`);
  const mapping = firstMapping(definition);
  if (shortType(mapping) !== "BuildingAgeDynamicChangeDTO") return null;

  const declared: { age: string; amount: number; resources: string[] }[] = [];
  for (const row of asArray(mapping.values)) {
    const age = asString(asObject(row).when);
    if (age === null) continue;
    const then = asObject(asObject(row).then);
    const amount = actionAmount(then);
    if (amount === null) continue;
    declared.push({ age, amount, resources: actionResourceDescriptors(then) });
  }
  declared.sort((a, b) => (AGE_INDEX.get(a.age) ?? 0) - (AGE_INDEX.get(b.age) ?? 0));
  if (declared.length === 0) return null;

  const entries: BuildingAgeCurveEntry[] = [];
  for (const [index, { age, amount, resources }] of declared.entries()) {
    const governed = agesGovernedBy(age, declared[index + 1]?.age ?? null);
    const curve = assembleCurve({
      definitionId,
      modifier: null,
      levels,
      table: [{ when: 1, value: amount }],
      formula: null,
      valueLimit: null,
      luaScript: null,
    });
    for (const governedAge of governed) {
      entries.push({
        age: governedAge,
        appliesTo: [governedAge],
        resources: resources.map((d) => toProjectResourceKey(d, governedAge)),
        curve,
      });
    }
  }
  return { indexedBy: "playerAge", definitionId, entries };
}

/** Ressources versées par un DAC, quel que soit son axe. */
function producedDescriptors(src: SourceIndex, definitionId: string): string[] {
  const definition = src.byId.get(definitionId);
  if (definition === undefined) fail(`DAC de production introuvable : ${definitionId}`);
  const mapping = firstMapping(definition);
  // Même partage que `buildPlayerAgeCurve` : c'est l'INDIRECTION qui décide, pas
  // le nom du DTO — un `BuildingAgeDynamicChangeDTO` indirect ne porte aucune
  // ressource sur ses propres lignes, seulement sur ses feuilles.
  const type = shortType(mapping);
  if (type !== "PlayerAgeDynamicChangeDTO" && type !== "BuildingAgeDynamicChangeDTO") {
    return levelResourceDescriptors(mapping);
  }
  for (const row of asArray(mapping.values)) {
    const [leafId] = asArray(asObject(asObject(row).then).dynamicChangeDefinitionId)
      .map(asString)
      .filter((id): id is string => id !== null);
    const leaf = leafId === undefined ? undefined : src.byId.get(leafId);
    if (leaf !== undefined) return levelResourceDescriptors(firstMapping(leaf));
  }
  // Aucune feuille : forme DIRECTE (les ressources sont sur les lignes mêmes).
  return levelResourceDescriptors(mapping);
}

// ─── Projections de bonus ─────────────────────────────────────────────────────

interface Projection {
  type: string;
  format: BuildingBonusFormat;
  scope: BuildingBonusScope | null;
  /** Facteur appliqué à la valeur brute — 100 pour passer d'un ratio à un %. */
  scale: number;
  resource: string | null;
  /**
   * ⚠️ LA VALEUR BRUTE EST UNE DURÉE RESTANTE, PAS UN GAIN — voir
   * `invertDurationCurve`.
   */
  invertsDuration?: boolean;
}

/**
 * ⚠️ PROJECTION : « il reste 69,5 % du temps » → « +30,5 % de vitesse ».
 *
 * Strictement la même règle que dans `scripts/extract/buildings.ts`, sur le même
 * DTO et la même ressource : le bâtiment d'héritage ATH et le Treasure Wreck
 * portent les deux mêmes boosts de régénération de boussole, et doivent donc
 * arriver dans la même unité — sans quoi l'onglet Combination additionnerait un
 * gain et un reste.
 *
 * MESURÉ EN JEU sur l'Épave niveau 60 : valeur brute 0,55, le jeu affiche
 * « Accélère le temps de régénération de Tentative de 45,0 % ».
 *
 * ⚠️ POURQUOI ICI, ET PAS À L'AFFICHAGE. L'amplificateur du gardien porte sur le
 * GAIN : au rang 25, le vault niveau 30 rend 0,305 × 1,25, jamais 0,695 × 1,25.
 * Convertir après amplification donnerait un chiffre faux ; convertir plus haut
 * obligerait chaque consommateur à connaître le cas particulier.
 *
 * ⚠️ SEUL `effective` EST CONVERTI — `table`, `resolved`, `formula` et
 * `luaScript` restent la donnée du jeu mot pour mot, pour que `pnpm
 * diff:heritage` puisse toujours comparer à la source.
 */
function invertDurationCurve(curve: BuildingCurve): BuildingCurve {
  return {
    ...curve,
    effective: curve.effective.map((value) => (value === null ? null : round(1 - value))),
  };
}

/** Collecteur des types de bonus sans équivalent dans `BONUS_LABELS`. */
class GapCollector {
  private readonly gaps = new Map<string, BuildingBonusGap>();

  note(
    projection: Projection,
    context: Omit<BuildingBonusGap, "occurrences" | "proposedType" | "proposedFormat">,
  ): void {
    if (KNOWN_BONUS_TYPES.has(projection.type)) return;
    const key = `${projection.type}|${context.componentType}`;
    const existing = this.gaps.get(key);
    if (existing === undefined) {
      this.gaps.set(key, {
        ...context,
        proposedType: projection.type,
        proposedFormat: projection.format,
        occurrences: 1,
      });
      return;
    }
    existing.occurrences += 1;
  }

  list(): BuildingBonusGap[] {
    return [...this.gaps.values()].sort(
      (a, b) => b.occurrences - a.occurrences || a.proposedType.localeCompare(b.proposedType),
    );
  }
}

function projectProduction(definitionId: string, age: string | null = null): Projection {
  const resource = toProjectResourceKey(definitionId, age);
  const named = OUTPUT_TYPE_BY_RESOURCE[definitionId];
  if (named !== undefined) {
    return { type: named, format: "absolute", scope: null, scale: 1, resource };
  }
  return { type: "goods_output", format: "absolute", scope: null, scale: 1, resource };
}

/**
 * ⚠️ `unitDefinitionId` PRIME sur `unitType` pour le `scope`. Le Crocodile
 * Aztèque (`Heritage_Aztec_UnitBoost_7`/`_10`) porte `unitType: "cavalry"` (la
 * classe mécanique réelle de l'unité — confirmée par sa description en jeu)
 * MAIS aussi un `unitDefinitionId` : le bâtiment qui porte le boost ne produit
 * QUE cette unité-là, et le jeu affiche son icône, pas celle générique de la
 * cavalerie. `type` (la clé de libellé, ex. `cavalry_damage`) reste dérivé du
 * `unitType` — la classe qu'il booste reste correcte, seule l'icône diffère.
 */
function projectUnitStatBoost(
  unitType: string | null,
  statDefinitionId: string,
  unitDefinitionId: string | null,
): Projection {
  const stat = STAT_KEY[statDefinitionId];
  if (stat === undefined) fail(`Stat d'unité inconnue : ${statDefinitionId}`);
  if (unitType === null) {
    const type = `army_${stat}`;
    return {
      type: BONUS_TYPE_ALIAS[type] ?? type,
      format: "percent",
      scope: null,
      scale: 100,
      resource: null,
    };
  }
  const unit = UNIT_KEY[unitType];
  if (unit === undefined) fail(`Type d'unité inconnu : ${unitType}`);
  const type = `${unit}_${stat}`;
  return {
    type: BONUS_TYPE_ALIAS[type] ?? type,
    format: "percent",
    scope:
      unitDefinitionId === null
        ? { kind: "unitType", value: unitType }
        : { kind: "unit", value: unitDefinitionId },
    scale: 100,
    resource: null,
  };
}

/**
 * `BoostResourceComponentDTO` du Vault — règle identique aux bâtiments, à un
 * écart près : ici le composant ne porte JAMAIS de `modifier`, seulement un
 * `luaModifierDefinitionId` dont le script rend la valeur finale
 * (05-wonders-reliques-heritage.md §2.2, schéma B). `scale` vaut donc 100 pour
 * passer du ratio au pourcentage, et rien n'est multiplié par un modifier.
 */
function projectResourceBoost(
  resourceDefinitionId: string | null,
  buildingType: string | null,
  cities: string[],
): Projection {
  const cityScope: BuildingBonusScope | null =
    cities.length === 1 ? { kind: "city", value: cities[0] } : null;

  if (resourceDefinitionId === "coins") {
    return {
      type: "coins_production",
      format: "percent",
      scope: cityScope,
      scale: 100,
      resource: "coins",
    };
  }
  if (resourceDefinitionId === "food") {
    return {
      type: "food_production",
      format: "percent",
      scope: cityScope,
      scale: 100,
      resource: "food",
    };
  }
  if (resourceDefinitionId !== null) {
    fail(`Boost de ressource non projetable : ${resourceDefinitionId}`);
  }
  if (buildingType !== null) {
    // Aucune ressource nommée : le boost porte sur ce que produit un TYPE de
    // bâtiment (`workshop`).
    //
    // ⚠️ Le `scope` retenu est le TYPE DE BÂTIMENT, pas la cité, alors que le
    // composant porte les deux. C'est délibéré, et c'est ce qui rend la clé
    // `building_type_production` utilisable : elle ne nomme volontairement aucun
    // type — une clé par type serait un dictionnaire à rallonge — donc le
    // discriminant DOIT vivre dans `scope`. Garder `city` à la place perdrait la
    // seule information qui distingue ce bonus d'un autre, puisque les 13 vaults
    // sont tous en `City_Capital` : le scope y serait constant, donc muet.
    //
    // Même arbitrage que `goods_production`, qui ne nomme pas le bien non plus.
    return {
      type: "building_type_production",
      format: "percent",
      scope: { kind: "buildingType", value: buildingType },
      scale: 100,
      resource: null,
    };
  }
  return fail("Boost de ressource sans ressource ni type de bâtiment");
}

function projectBuildingBoost(
  boostType: string,
  boostTarget: Record<string, string>,
): Projection {
  const scope: BuildingBonusScope | null =
    boostTarget.buildingGroup === undefined
      ? null
      : { kind: "buildingGroup", value: boostTarget.buildingGroup };

  switch (boostType) {
    case "BoostProductionTimeComponentDTO":
      return { type: "recruitment_time_reduction", format: "percent", scope, scale: 100, resource: null };
    case "RegenerationTraitBoostDTO": {
      // ⚠️ La ressource régénérée est portée par `resource`, pas par la clé.
      //
      // C'est ce qui sépare ces deux clés de `research_point_cap` /
      // `research_regen_boost` (Wonders), qui NOMMENT les points de recherche :
      // ici la ressource est `treasure_hunt_attempt`. Sans ce champ, le bonus ne
      // dirait plus DE QUOI il relève le plafond, et rien ne le distinguerait de
      // la paire Wonders — c'est précisément la confusion que la clé générique
      // existe pour éviter. Même arbitrage que `allied_currency_output`, dont la
      // monnaie exacte vit aussi dans `resource`.
      //
      // ⚠️ `invertsDuration` sur la vitesse : la valeur brute est le temps
      // RESTANT, pas le gain (voir `invertDurationCurve`). Le plafond, lui, est
      // déjà un compte — rien à convertir.
      const regenerated = boostTarget.resourceDefinitionId ?? null;
      const isDuration = boostTarget.modifier === "RegenerationTraitBoostModifier_DURATION";
      return isDuration
        ? { type: "regeneration_speed", format: "percent", scope, scale: 100, resource: regenerated, invertsDuration: true }
        : { type: "regeneration_cap", format: "integer", scope, scale: 1, resource: regenerated };
    }
    default:
      return fail(`Type de boost non projetable : ${boostType}`);
  }
}

// ─── Effets ───────────────────────────────────────────────────────────────────

interface EffectContext {
  src: SourceIndex;
  gaps: GapCollector;
  themeId: string;
  effectId: string;
  levels: number;
  warnings: string[];
}

function bonusPusher(ctx: EffectContext, bonuses: BuildingBonus[]) {
  const instances = new Map<string, number>();
  return (
    projection: Projection,
    componentId: string | null,
    componentType: string,
    value: number | null,
    curve: BuildingCurve | null,
    ageCurve: BuildingAgeCurve | null,
    periodSeconds: number | null,
    descriptor: string,
    reason: string,
  ): void => {
    ctx.gaps.note(projection, {
      chainKey: ctx.themeId,
      gameDesignId: ctx.effectId,
      componentType,
      descriptor,
      reason,
    });
    const instance = (instances.get(projection.type) ?? 0) + 1;
    instances.set(projection.type, instance);
    bonuses.push({
      type: projection.type,
      format: projection.format,
      scope: projection.scope,
      instance,
      componentId,
      componentType,
      value: value === null ? null : round(value * projection.scale),
      curve,
      ageCurve,
      periodSeconds,
      // La ressource STATIQUE (`projection.resource`, ex. "food") ne doit
      // être effacée que si l'`ageCurve` porte elle-même une ressource PAR
      // ENTRÉE plus précise (`buildPlayerAgeCurve` — un rang Good1/Good2/Good3
      // dont le bien concret change avec l'ère). `luaCurves()`, elle, construit
      // des entrées à `resources: []` par construction (générique — réutilisée
      // pour la Culture, qui n'a pas de ressource) : dans ce cas la ressource
      // du component est CONNUE et CONSTANTE d'une ère à l'autre (`food_output`
      // reste `food` partout), et l'effacer laissait `resources` vide en aval
      // → repli sur l'icône par défaut (`bonusIcons`, effect-display.ts) pour
      // TOUT bonus `*_output` dont le montant dépend de l'ère du joueur.
      resource:
        ageCurve === null || ageCurve.entries.every((entry) => entry.resources.length === 0)
          ? projection.resource
          : null,
      // Les Wonders n'ont pas de tirage à chances (`MysteryChestRewardDTO`) —
      // ce module ne touche jamais `expectedChestValue`/`chestLeaves`, propres
      // au domaine Bâtiments (`scripts/extract/buildings.ts`). Toujours `false`.
      isChestExpectation: false,
    });
  };
}

/**
 * Le composant d'un effet → bonus.
 *
 * ⚠️ Aucune branche `default` silencieuse : un composant hors des six types
 * connus fait échouer l'extraction (`KNOWN_EFFECT_COMPONENTS`).
 */
function extractEffectBonuses(component: JsonObject, ctx: EffectContext): BuildingBonus[] {
  const bonuses: BuildingBonus[] = [];
  const push = bonusPusher(ctx, bonuses);
  const componentType = shortType(component);
  const componentId = asString(component.id);

  switch (componentType) {
    case "ProductionComponentDTO": {
      const periodSeconds = asSeconds(component.duration);

      for (const change of asArray(component.producedResources)) {
        const definitionId = asString(asObject(change).definitionId);
        if (definitionId === null) continue;
        const dynamicAmount = asString(asObject(change).dynamicAmount);
        const amount = asNumber(asObject(change).amount);
        const dynamic =
          dynamicAmount === null ? null : luaCurves(ctx.src, dynamicAmount, ctx.levels, null);
        push(
          projectProduction(definitionId),
          componentId,
          componentType,
          dynamic === null ? amount : null,
          dynamic?.curve ?? null,
          dynamic?.ageCurve ?? null,
          periodSeconds,
          `producedResources[${definitionId}]`,
          "sortie de production absolue par cycle",
        );
      }

      const producedId = asString(component.producedDynamicActionChangeDefinitionId);
      if (producedId !== null) {
        const descriptors = producedDescriptors(ctx.src, producedId);
        const ageCurve = buildPlayerAgeCurve(ctx.src, producedId, ctx.levels);
        if (ageCurve !== null) {
          // Un seul bonus portant la table complète : la ressource dépend de
          // l'ère, elle vit donc sur chaque entrée d'âge et non sur le bonus.
          push(
            projectProduction(descriptors[0] ?? "Good1"),
            componentId,
            componentType,
            null,
            null,
            ageCurve,
            periodSeconds,
            `producedDynamicActionChange[${producedId}] — ${ageCurve.entries.length} âges`,
            "production de biens indexée par l'ère du joueur puis par le niveau du vault",
          );
        } else {
          const definition = ctx.src.byId.get(producedId);
          if (definition === undefined) fail(`DAC de production introuvable : ${producedId}`);
          const curve = buildCurve(
            firstMapping(definition),
            producedId,
            null,
            ctx.levels,
            actionAmount,
          );
          if (curve === null && descriptors.length > 0) {
            fail(`Production dynamique non résolue : ${producedId}`);
          }
          for (const descriptor of descriptors) {
            push(
              projectProduction(descriptor),
              componentId,
              componentType,
              null,
              curve,
              null,
              periodSeconds,
              `producedDynamicActionChange[${producedId}] → ${descriptor}`,
              "sortie de production absolue par cycle",
            );
          }
          // `descriptors` vide : le DAC ne verse pas de ressource nommée mais un
          // ARBRE DE RÉCOMPENSE tabulé par niveau. Ce n'est pas une perte —
          // `extractRewardTiers()` le lit, et l'effet échoue s'il ne rend ni
          // bonus ni récompense.
        }
      }
      break;
    }

    case "GrantWorkerComponentDTO": {
      const curve = curveFromDefinition(
        ctx.src,
        asString(component.dynamicAmountDefinitionId),
        null,
        ctx.levels,
      );
      push(
        { type: "worker_slots", format: "integer", scope: null, scale: 1, resource: null },
        componentId,
        componentType,
        asNumber(component.amount),
        curve,
        null,
        null,
        `dynamicAmount=${asString(component.dynamicAmountDefinitionId) ?? "—"}`,
        "ouvriers accordés par le vault",
      );
      break;
    }

    case "CultureComponentDTO": {
      const pointsId = asString(component.luaPointsDefinitionId);
      if (pointsId === null) fail(`CultureComponent sans luaPointsDefinitionId : ${ctx.effectId}`);
      const points = luaCurves(ctx.src, pointsId, ctx.levels, null);
      push(
        { type: "culture_points", format: "integer", scope: null, scale: 1, resource: null },
        componentId,
        componentType,
        null,
        points.curve,
        points.ageCurve,
        null,
        `luaPoints=${pointsId}`,
        "la culture n'a aucune clé dans BONUS_LABELS",
      );

      const rangeId = asString(component.luaRangeDefinitionId);
      if (rangeId === null) fail(`CultureComponent sans luaRangeDefinitionId : ${ctx.effectId}`);
      const range = luaCurves(ctx.src, rangeId, ctx.levels, null);
      push(
        { type: "culture_range", format: "integer", scope: null, scale: 1, resource: null },
        componentId,
        componentType,
        null,
        range.curve,
        range.ageCurve,
        null,
        `luaRange=${rangeId}`,
        "la portée de culture n'a aucune clé dans BONUS_LABELS",
      );
      break;
    }

    case "BoostUnitStatComponentDTO": {
      const statDefinitionId = asString(component.statDefinitionId);
      if (statDefinitionId === null) fail(`BoostUnitStat sans stat : ${ctx.effectId}`);
      const unitType = asString(component.unitType);
      const unitDefinitionId = asString(component.unitDefinitionId);
      const projection = projectUnitStatBoost(unitType, statDefinitionId, unitDefinitionId);
      // ⚠️ CONVENTION (a) — schéma A : `modifier` (0.01 sur 32/32) est un facteur
      // d'échelle, pas le bonus. Le pourcentage réel est le PRODUIT
      // `modifier × courbe(niveau)`. Voir resolvers/bonus.ts.
      const modifier = asNumber(component.modifier);
      const curve = curveFromDefinition(
        ctx.src,
        asString(component.dynamicUnitStatChangeDefinitionId),
        modifier,
        ctx.levels,
      );
      push(
        projection,
        componentId,
        componentType,
        curve === null ? modifier : null,
        curve,
        null,
        null,
        `${unitType ?? "(toutes)"} / ${statDefinitionId}${unitDefinitionId === null ? "" : ` / ${unitDefinitionId}`}`,
        "stat d'unité sans clé existante",
      );
      break;
    }

    case "BoostResourceComponentDTO": {
      const cities = asArray(component.cities)
        .map(asString)
        .filter((c): c is string => c !== null);
      const projection = projectResourceBoost(
        asString(component.resourceDefinitionId),
        asString(component.buildingType),
        cities,
      );
      const luaModifier = asString(component.luaModifierDefinitionId);
      if (luaModifier === null) fail(`BoostResource sans luaModifier : ${ctx.effectId}`);
      const dynamic = luaCurves(ctx.src, luaModifier, ctx.levels, null);
      push(
        projection,
        componentId,
        componentType,
        null,
        dynamic.curve,
        dynamic.ageCurve,
        null,
        `rid=${asString(component.resourceDefinitionId) ?? "—"} bt=${asString(component.buildingType) ?? "—"}`,
        "boost visant un TYPE de bâtiment : aucune ressource nommée",
      );
      break;
    }

    case "BuildingBoostComponentDTO": {
      const boostDefinitionId = asString(component.boostDefinitionId);
      if (boostDefinitionId === null) fail(`BuildingBoost sans boostDefinitionId : ${ctx.effectId}`);
      const boost = ctx.src.byId.get(boostDefinitionId);
      if (boost === undefined) fail(`Boost introuvable : ${boostDefinitionId}`);
      const boostTypeObject = asObject(boost.boostType);
      const target: Record<string, string> = {};
      for (const [key, value] of Object.entries(boostTypeObject)) {
        if (key === "@type" || key === "id") continue;
        const s = asString(value);
        if (s !== null) target[key] = s;
      }
      const projection = projectBuildingBoost(shortType(boostTypeObject), target);
      const built = buildCurve(asObject(boost.modifier), boostDefinitionId, null, ctx.levels);
      if (built === null) fail(`Boost sans courbe lisible : ${boostDefinitionId}`);
      const curve = projection.invertsDuration === true ? invertDurationCurve(built) : built;
      push(
        projection,
        componentId,
        componentType,
        null,
        curve,
        null,
        null,
        `${shortType(boostTypeObject)} ${JSON.stringify(target)}`,
        "boost de bâtiment sans clé existante",
      );
      break;
    }

    default:
      return fail(
        `Composant d'effet inconnu : ${componentType} (${ctx.themeId} / ${ctx.effectId})`,
      );
  }

  return bonuses;
}

// ─── Récompenses ──────────────────────────────────────────────────────────────

function extractRequirements(baseData: JsonObject, ctx: EffectContext): HeritageRequirement[] {
  const requirements: HeritageRequirement[] = [];
  for (const raw of asArray(baseData.requirements)) {
    const requirement = asObject(raw);
    const type = shortType(requirement);
    const kind = REQUIREMENT_KIND_BY_TYPE[type];
    if (kind === undefined) {
      fail(`Prérequis de récompense inconnu : ${type} (${ctx.themeId} / ${ctx.effectId})`);
    }
    if (kind === "research") {
      requirements.push({ kind, value: asString(requirement.id) ?? "" });
      continue;
    }
    if (kind === "relicNotUnlocked") {
      requirements.push({ kind, value: asString(requirement.relicId) ?? "" });
      continue;
    }
    const min = asString(requirement.minAgeDefinition);
    const max = asString(requirement.maxAgeDefinition);
    if (min !== null) requirements.push({ kind: "minAge", value: min });
    if (max !== null) requirements.push({ kind: "maxAge", value: max });
  }
  return requirements;
}

/** Libellé loca d'une cible de récompense, par famille. `""` si absent (C7). */
function rewardLabel(src: SourceIndex, kind: HeritageRewardKind, definitionId: string): string {
  switch (kind) {
    case "relic":
      return translate(src, `Base.Relics.${definitionId.replace(/^relic\./, "")}_Name`);
    case "inventoryItem":
    case "selectionKit":
      return translate(src, `Base.InventoryItems.${definitionId}_Name`);
    case "unit":
      return translate(src, `Base.Units.${definitionId}_Name`);
    case "buildingCustomization":
      return translate(src, `Base.BuildingCustomizations.${definitionId}_Name`);
    case "resource":
      return translate(src, `Base.Resources.${definitionId.replace(/\|/g, "_")}_Name`);
    default:
      return "";
  }
}

function emptyReward(kind: HeritageRewardKind): HeritageRewardNode {
  return {
    kind,
    id: null,
    chance: null,
    definitionId: null,
    label: "",
    amount: null,
    requirements: [],
    replacement: null,
    curve: null,
    ageCurve: null,
    resources: [],
    children: [],
  };
}

/**
 * Un nœud de `finish.rewards`, récursivement.
 *
 * ⚠️ Aucun type de récompense n'est ignoré : ce que `REWARD_KIND_BY_TYPE` ne
 * connaît pas fait échouer l'extraction.
 */
function extractReward(raw: Json, chance: number | null, ctx: EffectContext): HeritageRewardNode {
  const reward = asObject(raw);
  const type = shortType(reward);
  const kind = REWARD_KIND_BY_TYPE[type];
  if (kind === undefined) {
    fail(`Type de récompense inconnu : ${type} (${ctx.themeId} / ${ctx.effectId})`);
  }

  const baseData = asObject(reward.baseData);
  const node = emptyReward(kind);
  node.id = asString(reward.id) ?? asString(baseData.id);
  node.chance = chance;
  node.requirements = extractRequirements(baseData, ctx);
  node.amount = asNumber(reward.amount);

  if (baseData.replacementReward !== undefined) {
    node.replacement = extractReward(baseData.replacementReward, null, ctx);
  }

  switch (kind) {
    case "group":
    case "lootContainer": {
      node.children = asArray(reward.rewards).map((child) => extractReward(child, null, ctx));
      break;
    }
    case "mysteryChest": {
      const chances = asArray(reward.chances).map(asNumber);
      node.children = asArray(reward.rewards).map((child, index) =>
        extractReward(child, chances[index] ?? null, ctx),
      );
      break;
    }
    case "dynamicActionChange": {
      const definitionId = asString(reward.dynamicDefinitionId);
      if (definitionId === null) fail(`Récompense DAC sans définition (${ctx.effectId})`);
      node.definitionId = definitionId;
      const ageCurve =
        buildPlayerAgeCurve(ctx.src, definitionId, ctx.levels) ??
        buildFixedAgeCurve(ctx.src, definitionId, ctx.levels);
      if (ageCurve !== null) {
        node.ageCurve = ageCurve;
      } else {
        const definition = ctx.src.byId.get(definitionId);
        if (definition === undefined) fail(`Récompense DAC introuvable : ${definitionId}`);
        node.curve = buildCurve(
          firstMapping(definition),
          definitionId,
          null,
          ctx.levels,
          actionAmount,
        );
        node.resources = producedDescriptors(ctx.src, definitionId).map((d) =>
          toProjectResourceKey(d),
        );
      }
      break;
    }
    case "relic": {
      node.definitionId = asString(reward.definition);
      break;
    }
    case "inventoryItem": {
      node.definitionId = asString(reward.definition);
      break;
    }
    case "selectionKit": {
      node.definitionId = asString(reward.selectionKit);
      break;
    }
    case "unit": {
      node.definitionId = asString(reward.unit);
      break;
    }
    case "buildingCustomization": {
      node.definitionId = asString(reward.definition);
      break;
    }
    case "resource": {
      node.definitionId = asString(reward.resource);
      break;
    }
  }

  if (node.definitionId !== null) {
    node.label = rewardLabel(ctx.src, kind, node.definitionId);
  }
  return node;
}

/**
 * Les arbres de récompense d'un composant de production, par palier de niveau.
 *
 * Deux chemins, tous deux couverts :
 *  - `finish.rewards` — le coffre est le même à tous les niveaux (6 effets) ;
 *  - un `producedDynamicActionChangeDefinitionId` dont les `values` tabulent des
 *    `rewards` au lieu de `resourceChanges` (7 effets, empruntés aux bâtiments
 *    évolutifs du même thème). Le contenu change alors AVEC LE NIVEAU, d'où un
 *    palier par `when`.
 */
function extractRewardTiers(component: JsonObject, ctx: EffectContext): HeritageRewardTier[] {
  const tiers: HeritageRewardTier[] = [];

  const finishRewards = asArray(asObject(component.finish).rewards);
  if (finishRewards.length > 0) {
    tiers.push({
      minLevel: 1,
      rewards: finishRewards.map((raw) => extractReward(raw, null, ctx)),
    });
  }

  const producedId = asString(component.producedDynamicActionChangeDefinitionId);
  if (producedId === null) return tiers;
  const definition = ctx.src.byId.get(producedId);
  if (definition === undefined) fail(`DAC de production introuvable : ${producedId}`);
  const mapping = firstMapping(definition);
  if (shortType(mapping) !== "BuildingLevelDynamicChangeDTO") return tiers;

  for (const row of asArray(mapping.values)) {
    const when = asNumber(asObject(row).when);
    const rewards = asArray(asObject(asObject(row).then).rewards).filter(
      // Un `GoodRewardDTO` est une RESSOURCE versée, pas un coffre : il est déjà
      // porté par le bonus `goods_output` via `actionResourceDescriptors()`.
      (raw) => shortType(raw) !== "GoodRewardDTO",
    );
    if (when === null || rewards.length === 0) continue;
    tiers.push({ minLevel: when, rewards: rewards.map((raw) => extractReward(raw, null, ctx)) });
  }
  return tiers.sort((a, b) => a.minLevel - b.minLevel);
}

// ─── Détail d'une production ──────────────────────────────────────────────────

/** Une ligne de montant, signe retiré et libellé loca résolu. */
function amountLine(src: SourceIndex, definitionId: string, amount: number): HeritageAmountLine {
  return {
    definitionId,
    amount: Math.abs(amount),
    label: translate(src, `Base.Resources.${definitionId.replace(/\|/g, "_")}_Name`),
  };
}

function extractStartCosts(component: JsonObject, src: SourceIndex): HeritageAmountLine[] {
  const lines: HeritageAmountLine[] = [];
  for (const raw of asArray(component.resourceChangesOnStart)) {
    const change = asObject(raw);
    const definitionId = asString(change.definitionId);
    const amount = asNumber(change.amount);
    if (definitionId === null || amount === null) continue;
    lines.push(amountLine(src, definitionId, amount));
  }
  return lines;
}

function extractProducedUnits(component: JsonObject, src: SourceIndex): HeritageAmountLine[] {
  const lines: HeritageAmountLine[] = [];
  for (const [definitionId, raw] of Object.entries(asObject(component.producedUnits))) {
    const amount = asNumber(raw);
    if (amount === null) continue;
    lines.push({
      definitionId,
      amount,
      label: translate(src, `Base.Units.${definitionId}_Name`),
    });
  }
  return lines;
}

/** `behaviours[]` — un seul type existe sur le domaine ; tout autre fait échouer. */
function extractRequiredWorkers(component: JsonObject, ctx: EffectContext): number | null {
  let workers: number | null = null;
  for (const raw of asArray(component.behaviours)) {
    const behaviour = asObject(raw);
    const type = shortType(behaviour);
    if (type !== "WorkerBehaviourDTO") {
      fail(`Comportement de production inconnu : ${type} (${ctx.effectId})`);
    }
    workers = asNumber(asObject(behaviour.requiredWorkers).amount);
  }
  return workers;
}

// ─── Slots ────────────────────────────────────────────────────────────────────

function extractSlotUnlock(unlockAction: JsonObject, slotId: string): HeritageSlotUnlock | null {
  for (const raw of asArray(unlockAction.costs)) {
    const cost = asObject(raw);
    const type = shortType(cost);
    if (type !== "InventoryItemCostDTO") {
      fail(`Coût de slot inconnu : ${type} (${slotId})`);
    }
    const definitionId = asString(cost.itemDefinitionId);
    const amount = asNumber(cost.amount);
    if (definitionId === null || amount === null) fail(`Coût de slot illisible : ${slotId}`);
    return { kind: "item", definitionId, amount: Math.abs(amount) };
  }
  for (const raw of asArray(unlockAction.resourceChanges)) {
    const change = asObject(raw);
    const definitionId = asString(change.definitionId);
    const amount = asNumber(change.amount);
    if (definitionId === null || amount === null) fail(`Coût de slot illisible : ${slotId}`);
    // Montant POSITIF, comme partout dans ce projet : le game design écrit `-290`.
    return { kind: "resource", definitionId, amount: Math.abs(amount) };
  }
  return null;
}

function extractSlot(raw: Json, themeId: string): HeritageSlotExtract {
  const slot = asObject(raw);
  const id = asString(slot.id);
  if (id === null) fail(`Slot sans id dans ${themeId}`);
  const groups = asArray(slot.allowedGroups)
    .map(asString)
    .filter((g): g is string => g !== null);
  if (groups.length !== 1) {
    fail(`Slot à ${groups.length} groupes autorisés : ${id} — forme inattendue`);
  }
  const group = EFFECT_GROUP_BY_ID[groups[0]];
  if (group === undefined) fail(`Groupe d'effet inconnu : ${groups[0]} (${id})`);
  const minLevel = asNumber(slot.minLevel);
  if (minLevel === null) fail(`Slot sans minLevel : ${id}`);

  return {
    id,
    slotIndex: asNumber(slot.slotIndex) ?? 0,
    minLevel,
    group,
    premiumSeconds: asSeconds(slot.premiumDuration),
    unlock:
      slot.unlockAction === undefined
        ? null
        : extractSlotUnlock(asObject(slot.unlockAction), id),
  };
}

// ─── Progression ──────────────────────────────────────────────────────────────

/**
 * Un barème de montée écrit en Lua.
 *
 * ⚠️ CONVENTION D'INDEX — `entityLevel` est le niveau DÉCLARÉ, donc `perLevel[i]`
 * = `f(i + 1)` = ce qu'il faut payer pour quitter le niveau `i + 1`. C'est la
 * convention déjà retenue par l'extraction Bâtiments pour les coûts de montée
 * des `evolving` ; aucune règle du game design ne la déclare, et rien ici ne
 * l'invente à nouveau — elle est reprise, pas rejouée.
 *
 * Les montants sont TRONQUÉS : le jeu ne facture pas des demi-jetons.
 */
function extractLevelScheme(
  src: SourceIndex,
  definitionId: string,
  levels: number,
): HeritageLevelScheme {
  const luaScript = luaScriptOf(src, definitionId);
  const foreign = collectLuaVariables(luaScript).filter((v) => v !== "entityLevel");
  if (foreign.length > 0) {
    fail(`Barème de montée hors convention : ${definitionId} lit ${foreign.join(", ")}`);
  }

  const perLevel: number[] = [];
  const cumulative: number[] = [];
  let total = 0;
  for (let level = 1; level < levels; level += 1) {
    const value = Math.trunc(evaluateLuaFormula(luaScript, { entityLevel: level }));
    perLevel.push(value);
    total += value;
    cumulative.push(total);
  }
  return { definitionId, luaScript, perLevel, cumulative };
}

// ─── Gardien ──────────────────────────────────────────────────────────────────

const KEEPER_AMPLIFIER_BOOST_ID = "Boost_HeritageVault_KeeperAmplifier";
const KEEPER_OFFER_PREFIX = "dynamic_lua_long.Lua_HeritageVault_KeeperOffer_";

function extractKeeperAmplifier(
  src: SourceIndex,
  levels: number,
  carriedBy: string[],
): HeritageKeeperAmplifier {
  const boost = src.byId.get(KEEPER_AMPLIFIER_BOOST_ID);
  if (boost === undefined) fail(`Amplificateur du gardien introuvable : ${KEEPER_AMPLIFIER_BOOST_ID}`);
  const luaDefinitionId = asString(asObject(boost.boostType).luaModifierDefinitionId);
  if (luaDefinitionId === null) fail("Amplificateur du gardien sans script Lua");
  const luaScript = luaScriptOf(src, luaDefinitionId);

  const perReputationLevel: number[] = [];
  for (let level = 1; level <= levels; level += 1) {
    perReputationLevel.push(round(evaluateLuaFormula(luaScript, { entityLevel: level })));
  }
  return {
    boostDefinitionId: KEEPER_AMPLIFIER_BOOST_ID,
    luaDefinitionId,
    luaScript,
    perReputationLevel,
    carriedBy,
  };
}

/**
 * Les 29 courbes de prix du gardien.
 *
 * ⚠️ Ce sont les SEULES données d'offre du game design. Aucune n'est référencée
 * par quoi que ce soit : il n'y a ni offre, ni rotation, ni tirage à extraire.
 * Ne rien générer d'autre ici.
 */
function extractKeeperOffers(src: SourceIndex): HeritageKeeperOfferFormula[] {
  const offers: HeritageKeeperOfferFormula[] = [];
  for (const definition of src.byType.get("DynamicLuaLongDefinitionDTO") ?? []) {
    const definitionId = asString(definition.id);
    if (definitionId === null || !definitionId.startsWith(KEEPER_OFFER_PREFIX)) continue;
    const luaScript = asString(definition.luaScript);
    if (luaScript === null) fail(`Offre du gardien sans script : ${definitionId}`);
    const variables = collectLuaVariables(luaScript);
    const firstValue = evaluateLuaFormula(luaScript, {
      keeperPurchaseCount: 0,
      playerAgeOrder: 1,
      entityLevel: 1,
      entityAgeOrder: 1,
    });
    offers.push({
      id: definitionId.slice(KEEPER_OFFER_PREFIX.length),
      definitionId,
      luaScript,
      variables,
      direction: firstValue < 0 ? "give" : "receive",
      firstValue,
      scalesWithPlayerAge: variables.includes("playerAgeOrder"),
    });
  }
  return offers.sort((a, b) => a.id.localeCompare(b.id));
}

// ─── Extraction ───────────────────────────────────────────────────────────────

/** `heritage_vault.Heritage_MaliEmpire` → `heritage_mali_empire`. */
function toRegistryKey(themeId: string): string {
  const suffix = themeId.replace(/^heritage_vault\.Heritage_/, "");
  const snake = suffix
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/([A-Z]+)([A-Z][a-z])/g, "$1_$2")
    .toLowerCase();
  return `heritage_${snake}`;
}

/** `EvolutionToken|Building_X` → `Building_X`. */
function evolvingBuildingIdOf(resourceId: string): string | null {
  const match = /^EvolutionToken\|(.+)$/.exec(resourceId);
  return match === null ? null : match[1];
}

export function extractHeritage(root: string): HeritageExtractBundle {
  const src = loadSource(root);
  const gaps = new GapCollector();
  const warnings: string[] = [];

  const definitions = src.byType.get("HeritageVaultDefinitionDTO") ?? [];
  if (definitions.length === 0) fail("Aucun HeritageVaultDefinitionDTO dans le game design");

  const vaults: HeritageVaultExtract[] = [];
  const carriedBy: string[] = [];

  for (const definition of definitions) {
    const themeId = asString(definition.themeId);
    if (themeId === null) fail("HeritageVaultDefinitionDTO sans themeId");
    const buildingDefinitionId = asString(definition.buildingDefinitionId);
    if (buildingDefinitionId === null) fail(`Vault sans buildingDefinitionId : ${themeId}`);
    const maxLevel = asNumber(definition.maxLevel);
    if (maxLevel === null) fail(`Vault sans maxLevel : ${themeId}`);

    const building = src.byId.get(buildingDefinitionId);
    if (building === undefined) fail(`Bâtiment-marqueur introuvable : ${buildingDefinitionId}`);
    const city = asString(asArray(building.cities)[0]);
    const group = asString(building.group);
    if (city === null || group === null) {
      fail(`Bâtiment-marqueur sans (cities[0], group) : ${buildingDefinitionId}`);
    }
    // Garde-fou d'identité : le marqueur DOIT porter le themeId du vault.
    const marker = asArray(building.components)
      .map(asObject)
      .find((c) => shortType(c) === "HeritageVaultMarkerComponentDTO");
    if (marker === undefined || asString(marker.themeId) !== themeId) {
      fail(`Marqueur absent ou divergent sur ${buildingDefinitionId} (attendu ${themeId})`);
    }
    carriedBy.push(buildingDefinitionId);

    const vaultWarnings: string[] = [];
    const themeSuffix = themeId.replace(/^heritage_vault\./, "");

    const effects: HeritageEffectExtract[] = [];
    for (const rawEffect of asArray(definition.effects)) {
      const effect = asObject(rawEffect);
      const effectId = asString(effect.id);
      if (effectId === null) fail(`Effet sans id dans ${themeId}`);
      const minLevel = asNumber(effect.minLevel);
      if (minLevel === null) fail(`Effet sans minLevel : ${effectId}`);
      const groupId = asString(effect.effectGroup);
      const effectGroup = groupId === null ? undefined : EFFECT_GROUP_BY_ID[groupId];
      if (effectGroup === undefined) {
        fail(`Groupe d'effet inconnu : ${groupId ?? "(absent)"} (${effectId})`);
      }

      const components = asArray(effect.components).map(asObject);
      if (components.length !== 1) {
        fail(`Effet à ${components.length} composants : ${effectId} — forme inattendue`);
      }
      const component = components[0];
      const componentType = shortType(component);
      if (!KNOWN_EFFECT_COMPONENTS.has(componentType)) {
        fail(`Composant d'effet inconnu : ${componentType} (${themeId} / ${effectId})`);
      }

      const ctx: EffectContext = {
        src,
        gaps,
        themeId,
        effectId,
        levels: maxLevel,
        warnings: vaultWarnings,
      };
      const bonuses = extractEffectBonuses(component, ctx);
      const rewards = extractRewardTiers(component, ctx);
      // Garde-fou : un effet dont on ne tire NI bonus NI récompense serait une
      // perte silencieuse. Le game design n'en contient aucun aujourd'hui.
      if (bonuses.length === 0 && rewards.length === 0) {
        fail(`Effet sans bonus ni récompense : ${effectId} (${componentType})`);
      }

      effects.push({
        id: effectId,
        minLevel,
        group: effectGroup,
        lockSeconds: asSeconds(effect.lockDuration),
        componentType,
        componentId: asString(component.id),
        periodSeconds: asSeconds(component.duration),
        minCollectionSeconds: asSeconds(component.minCollectionPeriod),
        earlyCollectable: component.earlyCollectable === true,
        durationCurve: curveFromDefinition(
          src,
          asString(component.dynamicDurationDefinitionId),
          null,
          maxLevel,
        ),
        productionType: asString(component.type),
        startCosts: extractStartCosts(component, src),
        producedUnits: extractProducedUnits(component, src),
        requiredWorkers: extractRequiredWorkers(component, ctx),
        bonuses,
        rewards,
        warnings: [],
      });
    }

    const eligibleResourceIds = asArray(definition.eligibleResourceIds)
      .map(asString)
      .filter((id): id is string => id !== null);

    const xpDefinitionId = asString(definition.xpPerLevelDefinitionId);
    if (xpDefinitionId === null) fail(`Vault sans xpPerLevelDefinitionId : ${themeId}`);
    const reputationDefinitionId = asString(definition.keeperReputationPointsPerLevelDefinitionId);
    if (reputationDefinitionId === null) {
      fail(`Vault sans keeperReputationPointsPerLevelDefinitionId : ${themeId}`);
    }

    vaults.push({
      key: toRegistryKey(themeId),
      themeId,
      name: translate(src, `Base.HeritageVaults.${themeSuffix}_Name`),
      description: translate(src, `Base.HeritageVaults.${themeSuffix}_Desc`),
      buildingDefinitionId,
      buildingChainKey: `${city}|${group}`,
      buildingName: translate(src, `Base.BuildingGroups.${group}_Name`),
      event: asString(definition.event),
      order: asNumber(definition.order),
      maxLevel,
      eligibleResourceIds,
      eligibleEvolvingBuildingIds: eligibleResourceIds
        .map(evolvingBuildingIdOf)
        .filter((id): id is string => id !== null),
      slots: asArray(definition.slots)
        .map((raw) => extractSlot(raw, themeId))
        .sort((a, b) => a.slotIndex - b.slotIndex),
      effects: effects.sort((a, b) => a.minLevel - b.minLevel),
      xpPerLevel: extractLevelScheme(src, xpDefinitionId, maxLevel),
      keeperReputationPerLevel: extractLevelScheme(src, reputationDefinitionId, maxLevel),
      warnings: vaultWarnings,
    });
  }

  vaults.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  const levels = vaults[0]?.maxLevel ?? 60;
  return {
    generatedFrom: {
      gameDesignChecksum: src.gameDesignChecksum,
      locaChecksum: src.locaChecksum,
      locale: src.locale,
    },
    playerAgeOrderByAge: Object.fromEntries(
      AGES.map((age) => [age, playerAgeOrder(src, age)]),
    ),
    vaults,
    keeperAmplifier: extractKeeperAmplifier(src, levels, carriedBy.sort()),
    keeperOfferFormulas: extractKeeperOffers(src),
    bonusGaps: gaps.list(),
    warnings,
  };
}

// ─── Émission ─────────────────────────────────────────────────────────────────

const HEADER = `// ============================================================
// GÉNÉRÉ AUTOMATIQUEMENT — NE PAS ÉDITER À LA MAIN.
//
// Produit par scripts/extract/heritage.ts à partir de
// source/gamedesign.json + source/loca.json.
// Régénérer avec : pnpm extract:heritage
// ============================================================
`;

function renderModule(bundle: HeritageExtractBundle): string {
  return [
    HEADER,
    `import type { HeritageExtractBundle } from "./types";`,
    ``,
    `/** Extraction complète et fidèle du domaine Heritage Vault. */`,
    `export const HERITAGE_EXTRACT: HeritageExtractBundle = ${JSON.stringify(bundle, null, 2)};`,
    ``,
  ].join("\n");
}

function main(): void {
  const root = process.cwd();
  const bundle = extractHeritage(root);

  const outDir = path.join(root, "data", "heritage", "generated");
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(path.join(outDir, "heritage.generated.ts"), renderModule(bundle), "utf8");

  let slots = 0;
  let effects = 0;
  let bonuses = 0;
  let rewardRoots = 0;
  let withRewards = 0;
  let vaultWarnings = 0;
  const componentTypes = new Map<string, number>();
  const bonusTypes = new Set<string>();
  for (const vault of bundle.vaults) {
    slots += vault.slots.length;
    vaultWarnings += vault.warnings.length;
    for (const effect of vault.effects) {
      effects += 1;
      if (effect.rewards.length > 0) withRewards += 1;
      rewardRoots += effect.rewards.reduce((n, tier) => n + tier.rewards.length, 0);
      componentTypes.set(
        effect.componentType,
        (componentTypes.get(effect.componentType) ?? 0) + 1,
      );
      for (const bonus of effect.bonuses) {
        bonuses += 1;
        bonusTypes.add(bonus.type);
      }
    }
  }
  const known = [...bonusTypes].filter((t) => KNOWN_BONUS_TYPES.has(t)).sort();
  const proposed = [...bonusTypes].filter((t) => !KNOWN_BONUS_TYPES.has(t)).sort();

  process.stdout.write(
    [
      `Vaults extraits        : ${bundle.vaults.length}`,
      `Slots                  : ${slots}`,
      `Effets                 : ${effects}`,
      `  par composant        : ${[...componentTypes.entries()]
        .sort((a, b) => b[1] - a[1])
        .map(([t, n]) => `${t.replace("ComponentDTO", "")}=${n}`)
        .join(", ")}`,
      `Bonus projetés         : ${bonuses}`,
      `  clés réutilisées     : ${known.join(", ") || "(aucune)"}`,
      `  clés PROPOSÉES       : ${proposed.join(", ") || "(aucune)"}`,
      `Coffres (racines)      : ${rewardRoots}`,
      `Effets à coffre        : ${withRewards}`,
      `Formules d'offre       : ${bundle.keeperOfferFormulas.length} (prix seuls — aucun catalogue dans le game design)`,
      `Avertissements         : ${vaultWarnings + bundle.warnings.length}`,
      ``,
    ].join("\n"),
  );
}

main();
