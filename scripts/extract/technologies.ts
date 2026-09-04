// ============================================================
// ROC Helper – Extraction du domaine Technologies
//
// Lit `source/gamedesign.json` + `source/loca.json` et écrit
// `data/technos/generated/technologies.generated.ts`.
//
// Le game design est la SEULE source de vérité sur le contenu.
// Le contenu actuel de `data/technos/*.ts` n'est jamais lu ni consulté :
// seule la FORME attendue (docs/data-contracts.md §2.1) guide la projection.
// La comparaison entre les deux est le travail de scripts/diff/technologies.ts.
//
// Structure des données : docs/game-schema/04-technologies.md
//   - §1.1 : `(age, column, order)` est une grille stricte, sans collision
//   - §2.1 : `start.resourceChanges[]` porte le coût, en amounts NÉGATIFS
//   - §2.2 : `start.requirements[].id` est une clé étrangère, pas une identité
//   - §3.1 : `baseData.id` a deux sens incompatibles selon le `@type` (T1)
// Conventions          : docs/game-schema/00-conventions.md
//   - C3 : les int64 sont sérialisés en string
//   - C7 : une clé de loca absente est un libellé absent, pas une erreur
//
// Usage : pnpm extract:technos
// ============================================================

import fs from "node:fs";
import path from "node:path";

import type {
  TechnoRawCosts,
  TechnoRawEntry,
  TechnoRawGood,
  TechnologyAgeExtract,
  TechnologyBonusExtract,
  TechnologyBonusFormat,
  TechnologyBonusScope,
  TechnologyCostLine,
  TechnologyExtract,
  TechnologyExtractBundle,
  TechnologyReward,
} from "../../data/technos/generated/types";

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

// ─── Vocabulaire de présentation (côté projet, PAS game design) ───────────────
//
// Ni l'abréviation d'ère, ni l'identifiant snake_case, ni le slug de cité
// alliée n'existent dans le game design : ce sont des conventions du projet
// (data/config.ts pour les ères, lib/catalog.ts pour les blasons). Elles sont
// déclarées ici, indexées par identifiant de game design, pour que l'ajout d'un
// âge ou d'une cité côté jeu échoue bruyamment plutôt qu'en silence.

/** `AgeDefinition.id` → `{ abbr, eraId }`, dans l'ordre chronologique de `ERAS`. */
const AGES: { age: string; abbr: string; eraId: string }[] = [
  { age: "StoneAge", abbr: "sa", eraId: "stone_age" },
  { age: "BronzeAge", abbr: "ba", eraId: "bronze_age" },
  { age: "MinoanEra", abbr: "me", eraId: "minoan_era" },
  { age: "ClassicGreece", abbr: "cg", eraId: "classical_greece" },
  { age: "EarlyRome", abbr: "er", eraId: "early_rome" },
  { age: "RomanEmpire", abbr: "re", eraId: "roman_empire" },
  { age: "ByzantineEra", abbr: "be", eraId: "byzantine_era" },
  { age: "AgeOfTheFranks", abbr: "af", eraId: "age_of_the_franks" },
  { age: "FeudalAge", abbr: "fa", eraId: "feudal_age" },
  { age: "IberianEra", abbr: "ie", eraId: "iberian_era" },
  { age: "KingdomOfSicily", abbr: "ks", eraId: "kingdom_of_sicily" },
  { age: "HighMiddleAges", abbr: "hm", eraId: "high_middle_ages" },
  { age: "EarlyGothicEra", abbr: "eg", eraId: "early_gothic_era" },
  { age: "LateGothicEra", abbr: "lg", eraId: "late_gothic_era" },
];

const AGE_INDEX = new Map(AGES.map((a, i) => [a.age, i]));

/** `CityDefinition.id` → slug de blason (`imagesUrl` dans lib/catalog.ts). */
const CITY_ALLIED_SLUG: Record<string, string> = {
  City_Capital: "",
  City_Egypt: "egypt",
  City_China: "china",
  City_Mayas: "maya",
  City_Vikings: "vikings",
  City_Arabia: "arabia",
};

/**
 * Les 44 technologies sans `cities` (T3, §1.4) forment la branche
 * commerce/maritime des deux derniers âges. Le game design ne la nomme pas :
 * aucun champ de branche, aucun marqueur. Le projet l'affiche sous le blason
 * ottoman — c'est une décision de présentation, pas une lecture des données.
 */
const TRADE_BRANCH_SLUG = "ottoman";

/**
 * `Good1` | `Good2` | `Good3` → rang de bien côté projet (§2.1 de data-contracts).
 *
 * ⚠️ NE PAS reconvertir en bien concret. Deux notions se ressemblent et ne sont
 * PAS la même chose :
 *
 *  - `ResourceDefinitionDTO.order` (1 | 2 | 3) est un rang de TRI DE CATALOGUE.
 *    Il ordonne le panneau « Produits » du jeu, il est figé dans le game design,
 *    et il est IDENTIQUE sur tous les comptes.
 *  - `primary` / `secondary` / `tertiary` est l'ASSIGNATION D'ATELIERS PROPRE À
 *    CHAQUE COMPTE. Le jeu l'impose au démarrage de chaque compte et elle diffère
 *    d'un joueur à l'autre par design — c'est précisément ce qui rend le trading
 *    nécessaire : si tout le monde produisait le même bien en premier, personne
 *    n'aurait besoin d'acheter.
 *
 * Cette assignation n'apparaît NULLE PART dans `source/gamedesign.json`. C'est un
 * état de compte, pas un fait de catalogue — d'où le préfixe `DYN|`, qui signale
 * exactement ça : une résolution différée, faite côté compte. L'app la résout à
 * l'affichage, avec le classement que CHAQUE joueur renseigne dans la popup
 * ateliers (`local:buildingSelections`).
 *
 * Figer un coût en bien concret (`alabaster_idol`) reviendrait donc à imposer à
 * tous les joueurs l'assignation du compte qui a servi à l'extraction — faux par
 * construction du jeu.
 *
 * Même décision, et même commentaire, que scripts/extract/buildings.ts.
 */
const GOOD_RANK: Record<string, string> = {
  Good1: "primary",
  Good2: "secondary",
  Good3: "tertiary",
};

/**
 * Technologies « déblocage de bien » : leur `id` porte le marqueur
 * `GOOD|DYN|<Age>_GoodN` et elles n'ont PAS de clé de loca. Le projet les
 * nomme d'après le rang du bien débloqué.
 */
const GOOD_TECHNOLOGY_NAME: Record<string, string> = {
  Good1: "Primary Good",
  Good2: "Secondary Good",
  Good3: "Tertiary Good",
};

/**
 * Libellés que la loca de `source/` rend mal, corrigés d'après ce que le jeu
 * AFFICHE RÉELLEMENT — relevé à l'écran, pas supposé.
 *
 * ⚠️ Ce dictionnaire ne « corrige » pas l'orthographe du jeu. Les six écarts de
 * lettres entre la loca et l'ancienne saisie (`Destillation`, `Pavillons`,
 * `Monastries`, `Auxilla`, `Harbour`, `Karls`) restent tels quels : ce sont les
 * chaînes que voit le joueur, et les remplacer ferait diverger l'app du jeu.
 * N'entre ici qu'un libellé dont le rendu en jeu a été constaté différent.
 *
 * `Technology_EarlyRome_PaddyFields` : la loca vaut littéralement
 * `["PaddyFields"]`, un seul élément sans espace — ce n'est donc pas une perte
 * à la lecture, le défaut est dans la source. Le jeu, lui, affiche
 * « Paddy Fields ». Seule occurrence de mots collés sur les 488 technologies
 * portant une clé de loca (vérifié par `LOST_SPACE`, ci-dessous).
 */
const TECHNOLOGY_NAME_OVERRIDE: Record<string, string> = {
  Technology_EarlyRome_PaddyFields: "Paddy Fields",
};

/**
 * Signature de mots collés : une minuscule suivie d'une majuscule à l'intérieur
 * du libellé. Un libellé qui la porte sans être déclaré dans
 * `TECHNOLOGY_NAME_OVERRIDE` est signalé — c'est ce qui rend une nouvelle
 * occurrence visible au lieu de la laisser passer en silence.
 */
const LOST_SPACE = /[a-z][A-Z]/;

/**
 * Ressources dont l'identifiant de game design diverge de la clé utilisée par
 * le projet (`goodsByCivilization` dans lib/constants.ts, qui pilote le
 * regroupement par civilisation du Calculator).
 *
 * Ce dictionnaire ne corrige rien : il traduit, et uniquement pour la
 * projection UI. `TechnologyExtract.costs` garde l'identifiant du game design.
 */
const RESOURCE_KEY_ALIAS: Record<string, string> = {
  confections: "confection",
  medical_tea: "tea",
  asper: "aspers",
};

// ─── Vocabulaire de bonus (partagé avec les Wonders) ──────────────────────────
//
// `resolvers/bonus.ts` est le dictionnaire unique des clés de bonus. Rien n'est
// redéclaré ici : cet extracteur ne produit que des clés qui y existent déjà,
// et les projections ci-dessous reprennent trait pour trait celles de
// scripts/extract/wonders.ts (`projectGrantWorker`) — même nom, même format,
// même traitement du `scope`.

/**
 * `WorkerRewardDTO` → clé de bonus, à l'identique de `projectGrantWorker()`
 * côté wonders.
 *
 * ⚠️ `scope` reste `null` alors que la récompense porte un champ `city` : la
 * cité est celle du porteur, pas une restriction du bonus, et lorsqu'elle
 * discrimine (Arabie) elle est déjà encodée dans le `type`. C'est le choix fait
 * pour `GrantWorkerComponentDTO` côté wonders ; le refaire autrement ici
 * rendrait les deux domaines incomparables.
 */
function projectWorkerReward(
  workerType: string | null,
  city: string | null,
): { type: string; icons: [string, string | null]; format: TechnologyBonusFormat; scope: TechnologyBonusScope | null } {
  if (workerType === "WorkerType_TRADING") {
    return { type: "trade_worker_slots", icons: ["trade_worker", null], format: "integer", scope: null };
  }
  if (city === "City_Arabia") {
    return { type: "arabia_worker_slots", icons: ["arabia_worker", null], format: "integer", scope: null };
  }
  return { type: "worker_slots", icons: ["capital_worker", null], format: "integer", scope: null };
}

// ─── Sens de `baseData.id` (piège T1, §3.1) ───────────────────────────────────

/** Types dont `baseData.id` est une RÉFÉRENCE vers une entité racine. */
const BASE_ID_IS_REFERENCE = new Set([
  "UnlockBuildingUpgradeRewardDTO",
  "UnlockBuildingRewardDTO",
  "UnlockGoodRewardDTO",
  "UnlockQuestlineRewardDTO",
  "UnlockAgeRewardDTO",
  "RewardDefinitionDTO",
]);

/** Types dont `baseData.id` est l'identifiant PROPRE de la récompense. */
const BASE_ID_IS_OWN = new Set([
  "InstantUpgradeRewardDTO",
  "RelicRewardDTO",
  "WorkerRewardDTO",
  "InstantExpansionConstructionUnlockedRewardDTO",
]);

/** Récompenses pointant hors périmètre (§6) — extraites, mais signalées. */
const OUT_OF_SCOPE_REWARDS = new Set([
  "UnlockQuestlineRewardDTO",
  "IncidentRewardDTO",
  "RelicRewardDTO",
  "UnlockWonderCollectionRewardDTO",
  "CommanderRewardDTO",
  "RewardDefinitionDTO",
]);

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
    // C6 : les ids sont globalement uniques — le premier gagne quand même.
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

// ─── Identité côté projet ─────────────────────────────────────────────────────

/** `Technology_IberianEra_GOOD|DYN|IberianEra_Good1` → `Good1`, sinon `null`. */
function goodMarker(technologyId: string): string | null {
  const m = /GOOD\|DYN\|[A-Za-z]+_(Good\d)$/.exec(technologyId);
  return m === null ? null : m[1];
}

/**
 * Libellé affiché.
 *
 * Les technologies de déblocage de bien n'ont pas de clé de loca : le nom vient
 * du rang du bien. Pour toutes les autres, la loca fait foi — c'est la chaîne
 * que le joueur voit, y compris quand elle contient une coquille.
 */
function displayName(
  src: SourceIndex,
  id: string,
  rawName: string,
  warnings: string[],
): string {
  const marker = goodMarker(id);
  if (marker !== null) return GOOD_TECHNOLOGY_NAME[marker] ?? rawName;

  const override = TECHNOLOGY_NAME_OVERRIDE[id];
  if (override !== undefined) return override;

  const translated = translate(src, `Base.Technologies.${id}_Name`) || rawName;
  if (LOST_SPACE.test(translated)) {
    warnings.push(
      `Libellé aux mots collés, non déclaré : ${JSON.stringify(translated)} — vérifier en jeu et compléter TECHNOLOGY_NAME_OVERRIDE`,
    );
  }
  return translated;
}

// ─── Coûts ────────────────────────────────────────────────────────────────────

/**
 * `start.resourceChanges[]` → lignes de coût.
 *
 * Le game design écrit des montants NÉGATIFS (un changement de ressource
 * appliqué au joueur). L'app raisonne en coût positif : le signe est retourné
 * ici, et un montant positif dans la source serait une anomalie signalée.
 */
function extractCosts(component: JsonObject, warnings: string[]): TechnologyCostLine[] {
  const lines: TechnologyCostLine[] = [];
  for (const raw of asArray(asObject(component.start).resourceChanges)) {
    const change = asObject(raw);
    const definitionId = require0(asString(change.definitionId), "resourceChanges[].definitionId");
    const amount = asNumber(change.amount);
    if (amount === null) {
      warnings.push(`Coût sans montant lisible : ${definitionId}`);
      continue;
    }
    if (amount > 0) {
      warnings.push(`Coût de signe positif (gain ?) : ${definitionId} = ${amount}`);
    }
    lines.push({ definitionId, amount: Math.abs(amount) });
  }
  return lines;
}

/**
 * Identifiant de ressource du game design → clé de ressource côté projet.
 *
 * `DYN|<Age>_GoodN` est un bien générique d'âge : le projet le nomme par son
 * rang et l'abréviation de l'âge (`primary_ie`). Tout le reste est un
 * identifiant concret, éventuellement renommé par `RESOURCE_KEY_ALIAS`.
 */
function toProjectResourceKey(definitionId: string): string {
  const dyn = /^DYN\|([A-Za-z]+)_(Good\d)$/.exec(definitionId);
  if (dyn !== null) {
    const age = AGES.find((a) => a.age === dyn[1]);
    const rank = GOOD_RANK[dyn[2]];
    if (age === undefined || rank === undefined) {
      throw new Error(`Bien d'âge non projetable : ${definitionId} — compléter AGES / GOOD_RANK`);
    }
    return `${rank}_${age.abbr}`;
  }
  // Un identifiant concret inconnu du dictionnaire passe tel quel : c'est le cas
  // NORMAL (la plupart des biens alliés portent déjà la clé du projet).
  return RESOURCE_KEY_ALIAS[definitionId] ?? definitionId;
}

// ─── Récompenses ──────────────────────────────────────────────────────────────

function extractRewards(component: JsonObject, warnings: string[]): TechnologyReward[] {
  const rewards: TechnologyReward[] = [];
  for (const raw of asArray(asObject(component.finish).rewards)) {
    const reward = asObject(raw);
    const type = shortType(reward);
    const baseData = asObject(reward.baseData);
    const baseId = asString(baseData.id);

    // T1 : le sens de `baseData.id` dépend du `@type` porteur. Un type inconnu
    // qui en porte un est une lacune de ce dictionnaire, pas une donnée à ranger
    // au hasard dans l'un des deux champs.
    let targetId: string | null = null;
    let ownId: string | null = null;
    if (baseId !== null) {
      if (BASE_ID_IS_REFERENCE.has(type)) targetId = baseId;
      else if (BASE_ID_IS_OWN.has(type)) ownId = baseId;
      else warnings.push(`\`baseData.id\` de sens indéterminé sur ${type} : ${baseId}`);
    }

    // T2 : `hidden` vit tantôt dans `baseData`, tantôt à la racine.
    const hidden = baseData.hidden === true || reward.hidden === true;

    const cities = asArray(reward.cities)
      .map(asString)
      .filter((c): c is string => c !== null);

    const payload: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(reward)) {
      if (key === "@type" || key === "baseData" || key === "cities" || key === "hidden") continue;
      payload[key] = value;
    }

    if (OUT_OF_SCOPE_REWARDS.has(type)) {
      warnings.push(`Récompense hors périmètre, portée verbatim : ${type}`);
    }
    // T5 : sans `type`, on ne sait pas quelle limite est relevée.
    if (type === "IncreaseLimitRewardDTO" && payload.type === undefined) {
      warnings.push("`IncreaseLimitRewardDTO` sans `type` : limite cible inconnue (T5)");
    }
    // T7 : une récompense de déblocage de fonctionnalité sans fonctionnalité.
    if (type === "UnlockFeatureRewardDTO" && payload.feature === undefined) {
      warnings.push("`UnlockFeatureRewardDTO` sans `feature` (T7)");
    }

    rewards.push({ type, targetId, ownId, hidden, cities, payload });
  }
  return rewards;
}

/**
 * Bonus permanents portés par les récompenses.
 *
 * Une seule famille de récompense relève du vocabulaire de `resolvers/bonus.ts` :
 * `WorkerRewardDTO`. Tout le reste est soit un déblocage (bâtiment, bien, âge),
 * soit une limite, soit une ressource octroyée une fois — aucune de ces choses
 * n'est un bonus au sens de `BONUS_LABELS`, et les ranger là par ressemblance
 * de nom créerait exactement le second dictionnaire que le domaine Wonders a
 * démonté.
 */
function extractBonuses(rewards: TechnologyReward[]): TechnologyBonusExtract[] {
  const bonuses: TechnologyBonusExtract[] = [];
  const seen = new Map<string, number>();
  rewards.forEach((reward, index) => {
    if (reward.type !== "WorkerRewardDTO") return;
    const amount = asNumber(reward.payload.amount as Json);
    if (amount === null) return;
    const projection = projectWorkerReward(
      asString(reward.payload.type as Json),
      asString(reward.payload.city as Json),
    );
    const instance = (seen.get(projection.type) ?? 0) + 1;
    seen.set(projection.type, instance);
    bonuses.push({
      type: projection.type,
      icons: projection.icons,
      value: amount,
      format: projection.format,
      scope: projection.scope,
      instance,
      sourceRewardIndex: index,
    });
  });
  return bonuses;
}

// ─── Extraction ───────────────────────────────────────────────────────────────

export function extractTechnologies(root: string): TechnologyExtractBundle {
  const src = loadSource(root);
  const entities = src.byType.get("TechnologyDefinitionDTO") ?? [];
  if (entities.length === 0) throw new Error("Aucune TechnologyDefinitionDTO dans le game design");

  // §1.1 : `(age, column, order)` est une grille sans collision. Le tri par
  // `(column, order)` dans l'âge donne donc un rang stable, qui EST l'index de
  // la convention d'ID du projet (`sa_0`, `sa_1`, …).
  const byAge = new Map<string, JsonObject[]>();
  for (const entity of entities) {
    const age = require0(asString(entity.age), `TechnologyDefinition.age (${asString(entity.id)})`);
    if (AGE_INDEX.get(age) === undefined) {
      throw new Error(`Âge inconnu du projet : ${age} — compléter AGES dans cet extracteur`);
    }
    const bucket = byAge.get(age);
    if (bucket) bucket.push(entity);
    else byAge.set(age, [entity]);
  }

  const codeById = new Map<string, string>();
  const ageOfId = new Map<string, string>();
  const orderedByAge = new Map<string, JsonObject[]>();
  for (const { age, abbr } of AGES) {
    const bucket = byAge.get(age);
    if (bucket === undefined) continue;
    const sorted = [...bucket].sort((a, b) => {
      const ca = asNumber(a.column) ?? 0;
      const cb = asNumber(b.column) ?? 0;
      if (ca !== cb) return ca - cb;
      return (asNumber(a.order) ?? 0) - (asNumber(b.order) ?? 0);
    });
    // La grille est censée être sans collision (§1.1) : deux technologies au même
    // (column, order) rendraient l'index — donc l'ID projet — arbitraire.
    const seen = new Set<string>();
    for (const entity of sorted) {
      const key = `${asNumber(entity.column)}/${asNumber(entity.order)}`;
      if (seen.has(key)) {
        throw new Error(`Collision (column, order) = ${key} dans ${age} : l'ID projet devient arbitraire`);
      }
      seen.add(key);
    }
    sorted.forEach((entity, index) => {
      const id = require0(asString(entity.id), "TechnologyDefinition.id");
      codeById.set(id, `${abbr}_${index}`);
      ageOfId.set(id, age);
    });
    orderedByAge.set(age, sorted);
  }

  const technologies: TechnologyExtract[] = [];
  for (const { age, abbr, eraId } of AGES) {
    for (const entity of orderedByAge.get(age) ?? []) {
      const warnings: string[] = [];
      const id = require0(asString(entity.id), "TechnologyDefinition.id");
      const rawName = require0(asString(entity.name), `TechnologyDefinition.name (${id})`);

      const components = asArray(entity.components);
      if (components.length !== 1) {
        warnings.push(`${components.length} composants au lieu de 1 (§1.2)`);
      }
      const component = asObject(components[0]);
      if (shortType(component) !== "ResearchComponentDTO") {
        warnings.push(`Composant inattendu : ${shortType(component)}`);
      }

      const column = asNumber(entity.column);
      const order = asNumber(entity.order);
      if (column === null || order === null) {
        throw new Error(`(column, order) manquant sur ${id} — la grille §1.1 est la clé d'ID`);
      }

      const cities = asArray(entity.cities)
        .map(asString)
        .filter((c): c is string => c !== null);
      let allied: string | null;
      if (cities.length === 0) {
        // T3 : absence de `cities` = branche commerce/maritime. Convention projet.
        allied = TRADE_BRANCH_SLUG;
        warnings.push("Aucune `cities` : branche commerce supposée (T3, §1.4) — non déclaré par les données");
      } else {
        if (cities.length > 1) warnings.push(`Plusieurs cités : ${cities.join(", ")}`);
        const slug = CITY_ALLIED_SLUG[cities[0]];
        if (slug === undefined) {
          throw new Error(`Cité inconnue du projet : ${cities[0]} — compléter CITY_ALLIED_SLUG`);
        }
        allied = slug === "" ? null : slug;
      }

      const requires = asArray(asObject(component.start).requirements)
        .map((r) => asString(asObject(r).id))
        .filter((r): r is string => r !== null);
      const requiresCodes: string[] = [];
      const crossAgeRequiresCodes: string[] = [];
      for (const requiredId of requires) {
        const code = codeById.get(requiredId);
        if (code === undefined) {
          warnings.push(`Prérequis non résolu : ${requiredId}`);
          continue;
        }
        requiresCodes.push(code);
        if (ageOfId.get(requiredId) !== age) crossAgeRequiresCodes.push(code);
      }

      const finishRequirements = asArray(asObject(component.finish).requirements).map((r) => ({
        type: shortType(r),
        regions: asArray(asObject(r).regions)
          .map(asString)
          .filter((x): x is string => x !== null),
      }));

      const rewards = extractRewards(component, warnings);

      technologies.push({
        id,
        code: require0(codeById.get(id) ?? null, `code projet de ${id}`),
        name: displayName(src, id, rawName, warnings),
        rawName,
        description: translate(src, `Base.Technologies.${id}_Desc`),
        age,
        eraId,
        eraAbbr: abbr,
        column,
        uiColumn: column - 1,
        order,
        cities,
        allied,
        costs: extractCosts(component, warnings),
        requires,
        requiresCodes,
        crossAgeRequiresCodes,
        rewards,
        bonuses: extractBonuses(rewards),
        finishRequirements,
        warnings,
      });
    }
  }

  const ages: TechnologyAgeExtract[] = AGES.filter((a) => byAge.has(a.age)).map((a, i) => ({
    age: a.age,
    eraId: a.eraId,
    eraAbbr: a.abbr,
    index: i + 1,
    technologyCount: (byAge.get(a.age) ?? []).length,
  }));

  return {
    generatedFrom: {
      gameDesignChecksum: src.gameDesignChecksum,
      locaChecksum: src.locaChecksum,
      locale: src.locale,
    },
    ages,
    technologies,
  };
}

// ─── Projection UI ────────────────────────────────────────────────────────────

/** Projection étroite alignée sur `TechnoData` (docs/data-contracts.md §2.1). */
export function toRawEntries(bundle: TechnologyExtractBundle): TechnoRawEntry[] {
  return bundle.technologies.map((technology) => {
    const costs: TechnoRawCosts = {};
    const goods: TechnoRawGood[] = [];
    for (const line of technology.costs) {
      if (line.definitionId === "research_points") costs.research_points = line.amount;
      else if (line.definitionId === "coins") costs.coins = line.amount;
      else if (line.definitionId === "food") costs.food = line.amount;
      else goods.push({ amount: line.amount, resource: toProjectResourceKey(line.definitionId) });
    }
    if (goods.length > 0) costs.goods = goods;

    // Contrainte §2.1-2 : l'app ne cherche les prérequis que dans l'ère
    // sélectionnée. Les arêtes inter-âges restent dans la couche fidèle.
    const crossAge = new Set(technology.crossAgeRequiresCodes);
    const required = technology.requiresCodes.filter((c) => !crossAge.has(c));

    const entry: TechnoRawEntry = {
      id: technology.code,
      name: technology.name,
      column: technology.uiColumn,
      costs,
      required,
    };
    if (technology.allied !== null) entry.allied = technology.allied;
    return entry;
  });
}

// ─── Émission ─────────────────────────────────────────────────────────────────

const HEADER = `// ============================================================
// GÉNÉRÉ AUTOMATIQUEMENT — NE PAS ÉDITER À LA MAIN.
//
// Produit par scripts/extract/technologies.ts à partir de
// source/gamedesign.json + source/loca.json.
// Régénérer avec : pnpm extract:technos
// ============================================================
`;

function renderModule(bundle: TechnologyExtractBundle, raw: TechnoRawEntry[]): string {
  return [
    HEADER,
    `import type {`,
    `  TechnologyExtractBundle,`,
    `  TechnoRawEntry,`,
    `} from "./types";`,
    ``,
    `/** Extraction complète et fidèle du domaine Technologies. */`,
    `export const TECHNOLOGY_EXTRACT: TechnologyExtractBundle = ${JSON.stringify(bundle, null, 2)};`,
    ``,
    `/** Projection étroite alignée sur \`TechnoData\` (types/shared.ts). */`,
    `export const TECHNOLOGY_RAW_DATA: TechnoRawEntry[] = ${JSON.stringify(raw, null, 2)};`,
    ``,
  ].join("\n");
}

function main(): void {
  const root = process.cwd();
  const bundle = extractTechnologies(root);
  const raw = toRawEntries(bundle);

  const outDir = path.join(root, "data", "technos", "generated");
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, "technologies.generated.ts");
  fs.writeFileSync(outFile, renderModule(bundle, raw), "utf8");

  const rewardTypes = new Set<string>();
  const bonusTypes = new Set<string>();
  let costLines = 0;
  let edges = 0;
  let crossAgeEdges = 0;
  let warningCount = 0;
  for (const technology of bundle.technologies) {
    for (const reward of technology.rewards) rewardTypes.add(reward.type);
    for (const bonus of technology.bonuses) bonusTypes.add(bonus.type);
    costLines += technology.costs.length;
    edges += technology.requiresCodes.length;
    crossAgeEdges += technology.crossAgeRequiresCodes.length;
    warningCount += technology.warnings.length;
  }

  process.stdout.write(
    [
      `Technologies extraites : ${bundle.technologies.length}`,
      `Âges portant des technos : ${bundle.ages.length}`,
      `Lignes de coût         : ${costLines}`,
      `Arêtes de prérequis    : ${edges} (dont ${crossAgeEdges} inter-âges)`,
      `Types de récompense    : ${rewardTypes.size}`,
      `Clés de bonus          : ${[...bonusTypes].sort().join(", ") || "(aucune)"}`,
      `Points indéterminés    : ${warningCount} (détail dans TECHNOLOGY_EXTRACT.technologies[].warnings)`,
      `Écrit                  : ${path.relative(root, outFile)}`,
      ``,
    ].join("\n"),
  );
}

main();
