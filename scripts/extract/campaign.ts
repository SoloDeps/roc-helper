// ============================================================
// ROC Helper – Extraction du domaine Campaign
//
// Lit `source/gamedesign.json` + `source/loca.json` et écrit
// `data/campaigns/generated/campaign.generated.ts`.
//
// Le game design est la SEULE source de vérité sur le contenu.
// Le contenu actuel de `data/campaigns/*.ts` n'est jamais lu ni consulté :
// seule la FORME attendue (docs/data-contracts.md §3.1) guide la projection.
// La comparaison entre les deux est le travail de scripts/diff/campaign.ts.
//
// Structure des données (relevée dans la source, aucun doc de schéma
// n'existe encore pour ce domaine — voir docs/game-schema/) :
//   - `RegionDefinitionDTO` : 272 entités, 3 familles de composants
//       · `ScoutComponentDTO`   (0 ou 1) — coût et durée de l'éclaireur, prérequis
//       · `RegionComponentDTO`  (1)      — la prime de prise de région
//       · `PartComponentDTO`    (1 à 6)  — les affrontements et leurs primes
//   - `age` rattache la région à une ère ; `continent` NON (un continent porte
//     jusqu'à deux âges : Panganea = StoneAge + BronzeAge).
//   - Conventions : docs/game-schema/00-conventions.md
//       · C3 : les int64 sont sérialisés en string (`amount: "-910000"`)
//       · C7 : une clé de loca absente est un libellé absent, pas une erreur
//
// Usage : pnpm extract:campaign
// ============================================================

import fs from "node:fs";
import path from "node:path";

import type {
  CampaignAgeExtract,
  CampaignExtractBundle,
  CampaignPartExtract,
  CampaignPartType,
  CampaignRawPart,
  CampaignRawRegion,
  CampaignRawReward,
  CampaignRegionExtract,
  CampaignRewardExtract,
  CampaignRewardProjection,
} from "../../data/campaigns/generated/types";

// ─── Accès JSON typé ──────────────────────────────────────────────────────────
//
// Mêmes primitives que scripts/extract/technologies.ts. Elles y sont locales au
// script : les recopier garde chaque extracteur exécutable seul, ce qui est la
// convention déjà en place ici.

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

function requireNumber(v: number | undefined, what: string): number {
  if (v === undefined) throw new Error(`Valeur obligatoire absente : ${what}`);
  return v;
}

/** `type.googleapis.com/FooDTO` → `FooDTO`. */
function shortType(v: Json): string {
  const t = asString(asObject(v)["@type"]);
  return t === null ? "" : t.slice(t.lastIndexOf("/") + 1);
}

// ─── Vocabulaire de présentation (côté projet, PAS game design) ───────────────

/**
 * `RegionDefinition.age` → `{ abbr, eraId }`, dans l'ordre chronologique de
 * `ERAS`. Même table que scripts/extract/technologies.ts, aux mêmes valeurs :
 * un âge doit porter la même abréviation dans les deux domaines, sans quoi
 * `sa_9` ne désignerait pas la même ère selon la page.
 */
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

/**
 * `IncreaseExpansionRightRewardDTO.city` → clé de ressource du projet.
 *
 * ⚠️ Ce dictionnaire n'est PAS `CITY_ALLIED_SLUG` de l'extracteur Technologies,
 * et la différence est réelle : là-bas `City_Mayas` donne le slug de blason
 * `maya`, ici il donne la ressource `expansion_mayas`. Ce sont deux
 * vocabulaires d'icônes distincts (`images/city_crest/` contre
 * `images/goods/`), et les aligner casserait l'un des deux.
 */
const EXPANSION_RESOURCE: Record<string, string> = {
  City_Capital: "expansion_capital",
  City_Egypt: "expansion_egypt",
  City_China: "expansion_china",
  City_Mayas: "expansion_mayas",
  City_Vikings: "expansion_vikings",
  City_Arabia: "expansion_arabia",
};

/** `IncreaseExpansionRightRewardDTO.subType` → suffixe de la clé de ressource. */
const EXPANSION_SUBTYPE_SUFFIX: Record<string, string> = {
  ExpansionSubType_HARBOR: "_harbor",
  ExpansionSubType_WATER: "_water",
};

/**
 * Ressources dont l'identifiant de game design diverge de la clé du projet.
 *
 * La clé du projet est celle d'un fichier d'icône
 * (`public/images/goods/{resource}.webp`, lu par `getItemIconLocal`), pas un
 * identifiant de jeu — d'où les écarts.
 *
 * `asper` → `aspers` est le même alias que dans scripts/extract/technologies.ts
 * (`RESOURCE_KEY_ALIAS`). Les deux tables restent locales à leur script, comme
 * les primitives JSON : ce sont deux exécutables autonomes, et le domaine
 * Campaign n'a que faire de `confections` / `medical_tea`.
 */
const RESOURCE_KEY_ALIAS: Record<string, string> = {
  asper: "aspers",
  premium: "gems",
};

/**
 * `RewardDefinitionDTO.id` → clé de ressource du projet.
 *
 * Une `RewardDefinitionDTO` est une récompense COMPOSITE : elle emballe un
 * coffre mystère dont le contenu dépend de l'âge du joueur. L'app n'a pas de
 * vocabulaire pour ça — elle affiche une icône de coffre. La table réduit donc
 * la composition à une seule clé, ce qui est une perte assumée : le détail
 * reste dans `payload`.
 */
const COMPOSITE_REWARD_RESOURCE: Record<string, string> = {
  Reward_AllAge_CollectorBuildings_1: "chest_puzzlepieces",
};

/**
 * `trading_culture.OttomanEmpire` → `trading_culture_ottomanempire`.
 * La règle est mécanique (minuscules, point → underscore), mais elle n'a qu'un
 * seul cas connu : la garder en fonction plutôt qu'en table évite d'avoir à
 * déclarer une entrée le jour où une deuxième culture apparaît.
 */
function tradingCultureResource(definitionId: string): string {
  return definitionId.replace(/\./g, "_").toLowerCase();
}

/**
 * Libellés que la loca de `source/` rend mal, corrigés d'après ce que le jeu
 * est réputé AFFICHER.
 *
 * ⚠️ Ce dictionnaire ne « corrige » pas l'orthographe du jeu. Les coquilles de
 * lettres (`Cavernous Outcop` sur `me_3`, `Singing Mointains` sur `hm_24`)
 * restent telles quelles : ce sont les chaînes que voit le joueur, et les
 * remplacer ferait diverger l'app du jeu. N'entrent ici que des MOTS COLLÉS,
 * c'est-à-dire une perte d'espace à la sérialisation de la loca.
 *
 * `Continent_FrozenFjord_Region_104` (`fa_4`) : la loca vaut
 * `"Uther's Restingplace"`, la saisie à la main `"Uther's Resting Place"`.
 *
 * ⚠️ DÉCISION PAR DÉFAUT, NON VÉRIFIÉE EN JEU — la progression de campagne
 * n'est pas rejouable, le relevé à l'écran est donc hors d'atteinte. Elle
 * s'appuie sur le précédent `Technology_EarlyRome_PaddyFields`
 * (TECHNOLOGY_NAME_OVERRIDE, scripts/extract/technologies.ts), où exactement la
 * même soudure s'est révélée être un défaut de la loca et non un libellé du
 * jeu : là-bas le relevé à l'écran a tranché en faveur de l'espace. Si un
 * joueur signale un jour « Restingplace » à l'écran, c'est cette entrée qu'il
 * faut retirer — et rien d'autre.
 *
 * ⚠️ Aucun garde-fou automatique ne couvre ce cas. Le `LOST_SPACE` de
 * l'extracteur Technologies détecte `[a-z][A-Z]` ; ici la soudure est en
 * minuscules (`Resting` + `place`), et la distinguer d'un mot composé
 * légitime demanderait un dictionnaire. Ce tableau EST le registre.
 */
const REGION_NAME_OVERRIDE: Record<string, string> = {
  "Continent_FrozenFjord_Region_104": "Uther's Resting Place",
};

/**
 * Libellé affiché.
 *
 * La loca fait foi — c'est la chaîne que le joueur voit, y compris quand elle
 * contient une coquille — sauf pour les entrées de `REGION_NAME_OVERRIDE`.
 */
function displayName(src: SourceIndex, id: string, rawName: string): string {
  const override = REGION_NAME_OVERRIDE[id];
  if (override !== undefined) return override;
  return translate(src, `Base.Regions.${id}_Name`) || rawName;
}

/**
 * `BuildingPiece|Building_BronzeAge_Collectable_School_1` → `puzzle_piece`.
 *
 * Le préfixe `BuildingPiece|` marque une pièce de puzzle de bâtiment
 * collectionnable. L'app les affiche toutes sous la même icône générique : le
 * bâtiment visé est perdu par la projection, il reste dans `payload.resource`.
 */
const BUILDING_PIECE_PREFIX = "BuildingPiece|";
const BUILDING_PIECE_RESOURCE = "puzzle_piece";

/**
 * `Commander_QueenXochitl_1` → `queenxochitl`.
 * Le suffixe `_1` est un rang d'évolution du commandant, pas une identité :
 * l'app ne connaît que le commandant.
 */
function commanderSlug(commanderId: string): string | null {
  const m = /^Commander_([A-Za-z]+?)(?:_\d+)?$/.exec(commanderId);
  return m === null ? null : m[1].toLowerCase();
}

/** `Commander_QueenXochitl_1` → `QueenXochitl`, la clé de loca. */
function commanderLocaKey(commanderId: string): string | null {
  const m = /^Commander_([A-Za-z]+?)(?:_\d+)?$/.exec(commanderId);
  return m === null ? null : m[1];
}

// ─── Index du game design ─────────────────────────────────────────────────────

interface SourceIndex {
  loca: Map<string, string>;
  regions: JsonObject[];
  continents: Map<string, JsonObject>;
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

  const regions: JsonObject[] = [];
  const continents = new Map<string, JsonObject>();
  for (const entity of entities) {
    const type = shortType(entity);
    if (type === "RegionDefinitionDTO") regions.push(entity);
    else if (type === "ContinentDefinitionDTO") {
      const id = asString(entity.id);
      if (id !== null) continents.set(id, entity);
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
    loca,
    regions,
    continents,
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

/** `Continent_Panganea_Region_11` → `11`. */
function regionNumber(regionId: string): number {
  const m = /_Region_(\d+)$/.exec(regionId);
  if (m === null) {
    throw new Error(
      `Id de région hors convention : ${regionId} — le numéro final est la clé de tri qui produit \`sa_9\``,
    );
  }
  return Number(m[1]);
}

/**
 * `"15300s"` → `15300`.
 *
 * Le seul suffixe observé sur les 271 éclaireurs est `s`. Un autre suffixe
 * (`m`, `h`) donnerait une durée fausse d'un facteur 60 sans rien casser :
 * d'où le rejet explicite plutôt qu'un `parseInt` permissif.
 */
function parseDurationSeconds(raw: string): number {
  const m = /^(\d+)s$/.exec(raw);
  if (m === null) {
    throw new Error(`Durée d'éclaireur non reconnue : ${JSON.stringify(raw)} — format attendu \`<n>s\``);
  }
  return Number(m[1]);
}

// ─── Récompenses ──────────────────────────────────────────────────────────────

/**
 * Récompense du game design → ressource du vocabulaire du projet.
 *
 * Cinq `@type` convergent vers la même forme `{ resource, amount, name? }` :
 *
 *  - `ResourceRewardDTO`                        → la ressource, aliasée si besoin
 *  - `IncreaseExpansionRightRewardDTO`          → `expansion_<cité>[_<sous-type>]`
 *  - `IncreaseTradingCultureExpansionsRewardDTO`→ `trading_culture_<culture>`
 *  - `CommanderRewardDTO`                       → `commander_<slug>`, avec libellé
 *  - `RewardDefinitionDTO`                      → clé de coffre, contenu perdu
 *
 * `null` en retour = `@type` non projetable. La récompense reste alors dans la
 * couche fidèle, et l'appelant lève un avertissement : il vaut mieux une région
 * signalée qu'une récompense rangée au hasard dans le vocabulaire d'icônes.
 */
function projectReward(
  src: SourceIndex,
  type: string,
  reward: JsonObject,
  warnings: string[],
): CampaignRewardProjection | null {
  if (type === "ResourceRewardDTO") {
    const resource = asString(reward.resource);
    const amount = asNumber(reward.amount);
    if (resource === null || amount === null) {
      warnings.push(`\`ResourceRewardDTO\` sans \`resource\`/\`amount\` lisible`);
      return null;
    }
    if (resource.startsWith(BUILDING_PIECE_PREFIX)) {
      return { resource: BUILDING_PIECE_RESOURCE, amount, name: null };
    }
    return { resource: RESOURCE_KEY_ALIAS[resource] ?? resource, amount, name: null };
  }

  if (type === "IncreaseExpansionRightRewardDTO") {
    const city = asString(reward.city);
    const amount = asNumber(reward.regular);
    if (city === null || amount === null) {
      warnings.push("`IncreaseExpansionRightRewardDTO` sans `city`/`regular` lisible");
      return null;
    }
    const base = EXPANSION_RESOURCE[city];
    if (base === undefined) {
      throw new Error(`Cité inconnue du projet : ${city} — compléter EXPANSION_RESOURCE`);
    }
    const subType = asString(reward.subType);
    let suffix = "";
    if (subType !== null) {
      const known = EXPANSION_SUBTYPE_SUFFIX[subType];
      if (known === undefined) {
        throw new Error(`Sous-type d'expansion inconnu : ${subType} — compléter EXPANSION_SUBTYPE_SUFFIX`);
      }
      suffix = known;
    }
    return { resource: `${base}${suffix}`, amount, name: null };
  }

  if (type === "IncreaseTradingCultureExpansionsRewardDTO") {
    const definitionId = asString(reward.tradingCultureDefinitionId);
    const amount = asNumber(reward.amount);
    if (definitionId === null || amount === null) {
      warnings.push("`IncreaseTradingCultureExpansionsRewardDTO` incomplète");
      return null;
    }
    return { resource: tradingCultureResource(definitionId), amount, name: null };
  }

  if (type === "CommanderRewardDTO") {
    const commander = asString(reward.commander);
    if (commander === null) {
      warnings.push("`CommanderRewardDTO` sans `commander`");
      return null;
    }
    const slug = commanderSlug(commander);
    const locaKey = commanderLocaKey(commander);
    if (slug === null || locaKey === null) {
      warnings.push(`Identifiant de commandant hors convention : ${commander}`);
      return null;
    }
    // Le libellé affiché par l'app préfixe le nom du commandant par
    // « Commander » — c'est une chaîne du projet, pas une clé de loca : aucune
    // entrée de `source/loca.json` ne porte la forme composée.
    const displayName = translate(src, `Base.Commanders.${locaKey}_Name`);
    if (displayName === "") {
      warnings.push(`Commandant sans libellé de loca : ${commander} (C7)`);
    }
    return {
      resource: `commander_${slug}`,
      amount: 1,
      name: `Commander ${displayName || locaKey}`,
    };
  }

  if (type === "RewardDefinitionDTO") {
    const id = asString(reward.id);
    const resource = id === null ? undefined : COMPOSITE_REWARD_RESOURCE[id];
    if (resource === undefined) {
      warnings.push(
        `Récompense composite non projetable : ${id ?? "(sans id)"} — compléter COMPOSITE_REWARD_RESOURCE`,
      );
      return null;
    }
    // Le montant n'est pas déclaré : une `RewardDefinitionDTO` emballe un
    // coffre, elle ne compte rien. L'app en affiche un.
    return { resource, amount: 1, name: null };
  }

  warnings.push(`Type de récompense non projetable : ${type}`);
  return null;
}

function extractRewards(src: SourceIndex, container: JsonObject, warnings: string[]): CampaignRewardExtract[] {
  const out: CampaignRewardExtract[] = [];
  for (const raw of asArray(asObject(container.finish).rewards)) {
    const reward = asObject(raw);
    const type = shortType(reward);

    const payload: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(reward)) {
      if (key === "@type" || key === "baseData") continue;
      payload[key] = value;
    }

    out.push({
      type,
      ownId: asString(asObject(reward.baseData).id),
      payload,
      projection: projectReward(src, type, reward, warnings),
    });
  }
  return out;
}

// ─── Parties ──────────────────────────────────────────────────────────────────

/**
 * Modes de jeu d'une partie.
 *
 * Le game design ne les NOMME pas : il pose ou non un bloc `combat`,
 * `combatWaves`, `negotiationGame`. Les trois noms rendus ici sont ceux que
 * l'app attend dans `CampaignPart.type` (docs/data-contracts.md §3.1).
 * L'ordre est fixé — `combat` avant `negotiation` — pour que deux parties de
 * mêmes modes produisent le même tableau.
 */
function partTypes(component: JsonObject): CampaignPartType[] {
  const types: CampaignPartType[] = [];
  if (isObject(component.combat)) types.push("combat");
  if (isObject(component.combatWaves)) types.push("combat_waves");
  if (isObject(component.negotiationGame)) types.push("negotiation");
  return types;
}

function extractParts(src: SourceIndex, region: JsonObject, warnings: string[]): CampaignPartExtract[] {
  const parts: CampaignPartExtract[] = [];
  let index = 0;
  for (const raw of asArray(region.components)) {
    const component = asObject(raw);
    if (shortType(component) !== "PartComponentDTO") continue;
    index += 1;

    const types = partTypes(component);
    if (types.length === 0) {
      warnings.push(`Partie sans mode de jeu : ${asString(component.id) ?? `#${index}`}`);
    }

    const combat = asObject(component.combat);
    const combatWaves = asObject(component.combatWaves);
    const negotiation = asObject(component.negotiationGame);

    parts.push({
      id: require0(asString(component.id), "PartComponentDTO.id"),
      index,
      types,
      combatId: asString(combat.id),
      combatWavesId: asString(combatWaves.id),
      negotiationGameId: asString(negotiation.id),
      sceneId: asString(combat.sceneId),
      enemyUnitCount: asArray(combat.enemyUnits).length,
      waveCount: asArray(combatWaves.battlefields).length,
      negotiationTurns: asNumber(negotiation.turns),
      rewards: extractRewards(src, component, warnings),
    });
  }
  return parts;
}

// ─── Colonne ──────────────────────────────────────────────────────────────────

/**
 * Profondeur de chaque région dans le graphe de prérequis de SON âge.
 *
 * Règle : 0 pour une racine, sinon `1 + max(profondeur des prérequis)`.
 * La variante « plus court chemin » est fausse — elle place 44 des 272 régions
 * dans la mauvaise colonne. Le graphe est acyclique ; un cycle est détecté ici
 * plutôt que de faire déborder la pile.
 */
function computeColumns(requiresByCode: Map<string, string[]>): Map<string, number> {
  const depth = new Map<string, number>();
  const visiting = new Set<string>();

  const walk = (code: string): number => {
    const known = depth.get(code);
    if (known !== undefined) return known;
    if (visiting.has(code)) {
      throw new Error(`Cycle de prérequis autour de ${code} : la colonne n'est pas définissable`);
    }
    visiting.add(code);
    const parents = requiresByCode.get(code) ?? [];
    const value = parents.length === 0 ? 0 : 1 + Math.max(...parents.map(walk));
    visiting.delete(code);
    depth.set(code, value);
    return value;
  };

  for (const code of requiresByCode.keys()) walk(code);
  return depth;
}

// ─── Extraction ───────────────────────────────────────────────────────────────

export function extractCampaign(root: string): CampaignExtractBundle {
  const src = loadSource(root);
  if (src.regions.length === 0) throw new Error("Aucune RegionDefinitionDTO dans le game design");

  // 1. Rattachement à un âge, puis tri par le numéro terminant l'`id` :
  //    ce rang 1-based EST le suffixe de l'identifiant projet (`sa_9`).
  const byAge = new Map<string, JsonObject[]>();
  for (const region of src.regions) {
    const age = require0(asString(region.age), `RegionDefinition.age (${asString(region.id)})`);
    if (AGE_INDEX.get(age) === undefined) {
      throw new Error(`Âge inconnu du projet : ${age} — compléter AGES dans cet extracteur`);
    }
    const bucket = byAge.get(age);
    if (bucket) bucket.push(region);
    else byAge.set(age, [region]);
  }

  const codeById = new Map<string, string>();
  const ageOfId = new Map<string, string>();
  const indexById = new Map<string, number>();
  const orderedByAge = new Map<string, JsonObject[]>();
  for (const { age, abbr } of AGES) {
    const bucket = byAge.get(age);
    if (bucket === undefined) continue;
    const sorted = [...bucket].sort((a, b) => {
      const na = regionNumber(require0(asString(a.id), "RegionDefinition.id"));
      const nb = regionNumber(require0(asString(b.id), "RegionDefinition.id"));
      return na - nb;
    });
    // Deux régions au même numéro rendraient le rang — donc l'ID projet —
    // arbitraire. Le numéro est unique par continent, pas globalement.
    const seen = new Set<number>();
    for (const region of sorted) {
      const n = regionNumber(require0(asString(region.id), "RegionDefinition.id"));
      if (seen.has(n)) {
        throw new Error(`Numéro de région ${n} en double dans ${age} : l'ID projet devient arbitraire`);
      }
      seen.add(n);
    }
    sorted.forEach((region, i) => {
      const id = require0(asString(region.id), "RegionDefinition.id");
      codeById.set(id, `${abbr}_${i + 1}`);
      ageOfId.set(id, age);
      indexById.set(id, i + 1);
    });
    orderedByAge.set(age, sorted);
  }

  // 2. Marque `boss` du projet. Rien dans le game design ne la déclare — ni
  //    champ sur la région, ni unité distinguée dans le champ de bataille —
  //    elle est donc DÉRIVÉE de deux traits qui coïncident :
  //
  //      a. la région est la dernière de son `leader` (numéro le plus élevé) ;
  //      b. elle ne porte qu'UNE partie, là où les régions ordinaires du même
  //         meneur en portent 2 à 6 — l'affrontement décisif est unique.
  //
  //    Pris séparément, chaque trait rate la cible : « dernière du meneur »
  //    seul désigne 29 régions, « une seule partie » seul en désigne 31 ;
  //    leur intersection en désigne 28 — les 27 marquées à la main, plus `sa_5`.
  //
  //    ⚠️ `sa_5` (Sabertooth Ford) a été marqué à la main PAR DÉFAUT sur la foi
  //    de cette règle, sans vérification en jeu : la progression de campagne
  //    n'est pas rejouable. La règle est à 27/27 sur tout le reste, et `sa_5`
  //    est le seul point où elle a jamais divergé de la saisie. Si un joueur
  //    signale un jour que Sabertooth Ford n'est pas un boss, c'est ici que la
  //    règle est à revoir — pas dans la donnée.
  //    Voir le champ `boss` de data/campaigns/generated/types.ts.
  const lastRegionOfLeader = new Map<string, string>();
  for (const region of src.regions) {
    const leader = asString(region.leader);
    const id = asString(region.id);
    if (leader === null || id === null) continue;
    const current = lastRegionOfLeader.get(leader);
    if (current === undefined || regionNumber(id) > regionNumber(current)) {
      lastRegionOfLeader.set(leader, id);
    }
  }
  const partCountById = new Map<string, number>();
  for (const region of src.regions) {
    const id = asString(region.id);
    if (id === null) continue;
    partCountById.set(
      id,
      asArray(region.components).filter((c) => shortType(c) === "PartComponentDTO").length,
    );
  }
  const bossIds = new Set(
    [...lastRegionOfLeader.values()].filter((id) => partCountById.get(id) === 1),
  );

  // 3. Prérequis, puis colonnes — la colonne dépend du graphe complet de l'âge,
  //    elle ne peut donc pas se calculer région par région.
  const requiresById = new Map<string, string[]>();
  for (const region of src.regions) {
    const id = require0(asString(region.id), "RegionDefinition.id");
    const requires: string[] = [];
    for (const raw of asArray(region.components)) {
      const component = asObject(raw);
      if (shortType(component) !== "ScoutComponentDTO") continue;
      for (const req of asArray(asObject(component.start).requirements)) {
        for (const target of asArray(asObject(req).regions)) {
          const targetId = asString(target);
          // Le game design répète un prérequis sur au moins une région
          // (`Continent_Panganea_Region_11` exige deux fois la même) : dédoublonné
          // ici, sinon l'arête apparaîtrait deux fois dans le graphe.
          if (targetId !== null && !requires.includes(targetId)) requires.push(targetId);
        }
      }
    }
    requiresById.set(id, requires);
  }

  const columnByCode = new Map<string, number>();
  for (const { age } of AGES) {
    const bucket = orderedByAge.get(age);
    if (bucket === undefined) continue;
    const sameAge = new Map<string, string[]>();
    for (const region of bucket) {
      const id = require0(asString(region.id), "RegionDefinition.id");
      sameAge.set(
        require0(codeById.get(id) ?? null, `code projet de ${id}`),
        (requiresById.get(id) ?? [])
          .filter((target) => ageOfId.get(target) === age)
          .map((target) => require0(codeById.get(target) ?? null, `code projet de ${target}`)),
      );
    }
    for (const [code, depth] of computeColumns(sameAge)) columnByCode.set(code, depth);
  }

  // 4. Projection région par région.
  const regions: CampaignRegionExtract[] = [];
  for (const { age, abbr, eraId } of AGES) {
    for (const region of orderedByAge.get(age) ?? []) {
      const warnings: string[] = [];
      const id = require0(asString(region.id), "RegionDefinition.id");
      const code = require0(codeById.get(id) ?? null, `code projet de ${id}`);
      const rawName = require0(asString(region.name), `RegionDefinition.name (${id})`);

      const scoutComponents = asArray(region.components)
        .map(asObject)
        .filter((c) => shortType(c) === "ScoutComponentDTO");
      const regionComponents = asArray(region.components)
        .map(asObject)
        .filter((c) => shortType(c) === "RegionComponentDTO");

      if (scoutComponents.length > 1) {
        warnings.push(`${scoutComponents.length} ScoutComponentDTO au lieu de 0 ou 1`);
      }
      if (regionComponents.length !== 1) {
        warnings.push(`${regionComponents.length} RegionComponentDTO au lieu de 1`);
      }

      let scout: CampaignRegionExtract["scout"] = null;
      if (scoutComponents.length > 0) {
        const component = scoutComponents[0];
        const rawDuration = require0(asString(component.duration), `ScoutComponent.duration (${id})`);
        const changes = asArray(asObject(component.start).resourceChanges).map(asObject);
        const coinLines = changes.filter((c) => asString(c.definitionId) === "coins");
        if (changes.length !== coinLines.length) {
          warnings.push(
            `Éclaireur payé autrement qu'en pièces : ${changes
              .map((c) => asString(c.definitionId) ?? "?")
              .join(", ")}`,
          );
        }
        let coins = 0;
        for (const line of coinLines) {
          const amount = asNumber(line.amount);
          if (amount === null) {
            warnings.push("Coût d'éclaireur sans montant lisible");
            continue;
          }
          // Le game design écrit un changement de ressource NÉGATIF ; l'app
          // raisonne en coût positif. Un montant positif serait une anomalie.
          if (amount > 0) warnings.push(`Coût d'éclaireur de signe positif (gain ?) : ${amount}`);
          coins += Math.abs(amount);
        }
        scout = { coins, duration: parseDurationSeconds(rawDuration), rawDuration };
      } else if (region.isInitial !== true) {
        // La région de départ est acquise d'office : elle n'a pas d'éclaireur.
        // Toute AUTRE région sans éclaireur serait inatteignable.
        warnings.push("Aucun ScoutComponentDTO sur une région non initiale : région inatteignable ?");
      }

      const requires = requiresById.get(id) ?? [];
      const requiresCodes: string[] = [];
      const crossAgeRequiresCodes: string[] = [];
      for (const target of requires) {
        const targetCode = codeById.get(target);
        if (targetCode === undefined) {
          warnings.push(`Prérequis non résolu : ${target}`);
          continue;
        }
        requiresCodes.push(targetCode);
        if (ageOfId.get(target) !== age) crossAgeRequiresCodes.push(targetCode);
      }

      regions.push({
        id,
        code,
        name: displayName(src, id, rawName),
        rawName,
        discoveredText: translate(src, `Base.Regions.${id}_Discovered`),
        acquiredText: translate(src, `Base.Regions.${id}_Acquired`),
        age,
        eraId,
        eraAbbr: abbr,
        index: requireNumber(indexById.get(id), `index de ${id}`),
        continent: require0(asString(region.continent), `RegionDefinition.continent (${id})`),
        regionNumber: regionNumber(id),
        column: columnByCode.get(code) ?? 0,
        faction: require0(asString(region.faction), `RegionDefinition.faction (${id})`),
        leader: require0(asString(region.leader), `RegionDefinition.leader (${id})`),
        isInitial: region.isInitial === true,
        boss: bossIds.has(id),
        scout,
        requires,
        requiresCodes,
        crossAgeRequiresCodes,
        regionRewards:
          regionComponents.length > 0 ? extractRewards(src, regionComponents[0], warnings) : [],
        parts: extractParts(src, region, warnings),
        warnings,
      });
    }
  }

  const ages: CampaignAgeExtract[] = AGES.filter((a) => byAge.has(a.age)).map((a, i) => ({
    age: a.age,
    eraId: a.eraId,
    eraAbbr: a.abbr,
    index: i + 1,
    regionCount: (byAge.get(a.age) ?? []).length,
    continents: [
      ...new Set(
        (byAge.get(a.age) ?? [])
          .map((r) => asString(r.continent))
          .filter((c): c is string => c !== null),
      ),
    ],
  }));

  return {
    generatedFrom: {
      gameDesignChecksum: src.gameDesignChecksum,
      locaChecksum: src.locaChecksum,
      locale: src.locale,
    },
    ages,
    regions,
  };
}

// ─── Projection UI ────────────────────────────────────────────────────────────

function toRawRewards(rewards: CampaignRewardExtract[]): CampaignRawReward[] {
  const out: CampaignRawReward[] = [];
  for (const reward of rewards) {
    const p = reward.projection;
    if (p === null) continue;
    const entry: CampaignRawReward = { resource: p.resource, amount: p.amount };
    if (p.name !== null) entry.name = p.name;
    out.push(entry);
  }
  return out;
}

/** Projection étroite alignée sur `CampaignRegion` (docs/data-contracts.md §3.1). */
export function toRawRegions(bundle: CampaignExtractBundle): CampaignRawRegion[] {
  return bundle.regions.map((region) => {
    // Contrainte §3.1 : l'app ne cherche les prérequis que dans l'ère
    // sélectionnée. Les arêtes inter-âges restent dans la couche fidèle.
    const crossAge = new Set(region.crossAgeRequiresCodes);
    const required = region.requiresCodes.filter((c) => !crossAge.has(c));

    const parts: CampaignRawPart[] = region.parts.map((part) => ({
      type: [...part.types],
      rewards: toRawRewards(part.rewards),
    }));

    const entry: CampaignRawRegion = {
      id: region.code,
      name: region.name,
      column: region.column,
      required,
      // La région initiale n'a pas d'éclaireur ; l'app y attend un coût nul.
      scout: region.scout === null
        ? { coins: 0, duration: 0 }
        : { coins: region.scout.coins, duration: region.scout.duration },
      regionRewards: toRawRewards(region.regionRewards),
      parts,
    };
    if (region.boss) entry.boss = true;
    return entry;
  });
}

// ─── Émission ─────────────────────────────────────────────────────────────────

const HEADER = `// ============================================================
// GÉNÉRÉ AUTOMATIQUEMENT — NE PAS ÉDITER À LA MAIN.
//
// Produit par scripts/extract/campaign.ts à partir de
// source/gamedesign.json + source/loca.json.
// Régénérer avec : pnpm extract:campaign
// ============================================================
`;

function renderModule(bundle: CampaignExtractBundle, raw: CampaignRawRegion[]): string {
  return [
    HEADER,
    `import type {`,
    `  CampaignExtractBundle,`,
    `  CampaignRawRegion,`,
    `} from "./types";`,
    ``,
    `/** Extraction complète et fidèle du domaine Campaign. */`,
    `export const CAMPAIGN_EXTRACT: CampaignExtractBundle = ${JSON.stringify(bundle, null, 2)};`,
    ``,
    `/** Projection étroite alignée sur \`CampaignRegion\` (types/campaign-types.ts). */`,
    `export const CAMPAIGN_RAW_DATA: CampaignRawRegion[] = ${JSON.stringify(raw, null, 2)};`,
    ``,
  ].join("\n");
}

function main(): void {
  const root = process.cwd();
  const bundle = extractCampaign(root);
  const raw = toRawRegions(bundle);

  const outDir = path.join(root, "data", "campaigns", "generated");
  fs.mkdirSync(outDir, { recursive: true });
  const outFile = path.join(outDir, "campaign.generated.ts");
  fs.writeFileSync(outFile, renderModule(bundle, raw), "utf8");

  const rewardTypes = new Set<string>();
  const resources = new Set<string>();
  let parts = 0;
  let rewards = 0;
  let unprojected = 0;
  let edges = 0;
  let crossAgeEdges = 0;
  let bosses = 0;
  let warningCount = 0;
  for (const region of bundle.regions) {
    const all = [...region.regionRewards, ...region.parts.flatMap((p) => p.rewards)];
    for (const reward of all) {
      rewardTypes.add(reward.type);
      rewards += 1;
      if (reward.projection === null) unprojected += 1;
      else resources.add(reward.projection.resource);
    }
    parts += region.parts.length;
    edges += region.requiresCodes.length;
    crossAgeEdges += region.crossAgeRequiresCodes.length;
    if (region.boss) bosses += 1;
    warningCount += region.warnings.length;
  }

  process.stdout.write(
    [
      `Régions extraites      : ${bundle.regions.length}`,
      `Âges portant des régions : ${bundle.ages.length}`,
      `Parties                : ${parts}`,
      `Récompenses            : ${rewards} (dont ${unprojected} non projetées)`,
      `Types de récompense    : ${[...rewardTypes].sort().join(", ")}`,
      `Clés de ressource      : ${resources.size}`,
      `Arêtes de prérequis    : ${edges} (dont ${crossAgeEdges} inter-âges)`,
      `Régions de boss        : ${bosses}`,
      `Points indéterminés    : ${warningCount} (détail dans CAMPAIGN_EXTRACT.regions[].warnings)`,
      `Écrit                  : ${path.relative(root, outFile)}`,
      ``,
    ].join("\n"),
  );
}

main();
