// ============================================================
// ROC Helper – Garde-fou Heritage Vault
//
// ⚠️ Ce script n'est PAS un diff main/extraction, contrairement à ses voisins
// (`technologies.ts`, `campaign.ts`, `buildings.ts`). Il n'y a rien à comparer :
// AUCUNE donnée saisie à la main n'existe pour le Heritage Vault dans ce dépôt,
// et le game design en est la seule source. Ce qu'il vérifie, c'est autre chose,
// et c'est ce que l'extraction ne peut pas vérifier seule :
//
//  A. NON-DUPLICATION — les 13 bâtiments-marqueurs `Building_Heritage_*_1` sont
//     déjà extraits par le domaine Bâtiments (`scope: "decoration"`). Le domaine
//     Heritage ne doit en porter que la clé de chaîne, jamais une seconde copie
//     de leur forme, de leurs coûts ou de leurs bonus.
//
//  B. COMPLÉTUDE — tout ce que la source déclare est dans l'extraction. Les
//     comptes sont recomptés sur `source/gamedesign.json`, indépendamment de
//     l'extracteur : un `continue` ou un `?? []` qui avalerait une entrée se
//     verrait ici.
//
//  C. FORMES INCONNUES — l'extracteur lève sur un composant, une récompense ou
//     un prérequis hors liste. Ce script re-parcourt la source pour vérifier que
//     ces listes couvrent bien TOUT ce qu'elle contient, y compris les branches
//     que l'extraction ne traverse pas.
//
// Aucun fichier n'est modifié : ce script lit et imprime. Il sort en code 1 dès
// qu'une vérification échoue — c'est un garde-fou de build, pas un rapport.
//
// Usage : pnpm diff:heritage
//         pnpm diff:heritage --json
// ============================================================

import fs from "node:fs";
import path from "node:path";

import { BUILDING_EXTRACT, BUILDING_RAW_DATA } from "../../data/buildings/generated/buildings.generated";
import { HERITAGE_EXTRACT } from "../../data/heritage/generated/heritage.generated";
import type { HeritageRewardNode } from "../../data/heritage/generated/types";
import { BONUS_LABELS } from "../../resolvers/bonus";
import { evaluateLuaFormula } from "../../resolvers/lua-formula";

// ─── Accès JSON ───────────────────────────────────────────────────────────────

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
function shortType(v: Json): string {
  const t = asString(asObject(v)["@type"]);
  return t === null ? "" : t.slice(t.lastIndexOf("/") + 1);
}

/** Tous les descendants d'un nœud JSON, le nœud compris. */
function* walk(node: Json): Generator<JsonObject> {
  if (Array.isArray(node)) {
    for (const child of node) yield* walk(child);
    return;
  }
  if (!isObject(node)) return;
  yield node;
  for (const value of Object.values(node)) yield* walk(value);
}

// ─── Un manquement ────────────────────────────────────────────────────────────

interface Breach {
  /** Ce qui est vérifié : `A. non-duplication`, `B. complétude`, `C. formes`. */
  check: string;
  subject: string;
  expected: unknown;
  actual: unknown;
}

const breaches: Breach[] = [];

function expect(check: string, subject: string, actual: unknown, expected: unknown): void {
  if (JSON.stringify(actual) === JSON.stringify(expected)) return;
  breaches.push({ check, subject, expected, actual });
}

// ─── Source ───────────────────────────────────────────────────────────────────

function loadVaultDefinitions(root: string): JsonObject[] {
  const gdPath = path.join(root, "source", "gamedesign.json");
  if (!fs.existsSync(gdPath)) {
    throw new Error(`Source introuvable : ${gdPath} (lancer depuis la racine du dépôt)`);
  }
  const gdRoot = asObject(JSON.parse(fs.readFileSync(gdPath, "utf8")) as Json);
  const entities = asArray(asObject(asArray(gdRoot.content)[0]).content);
  return entities
    .filter(isObject)
    .filter((e) => shortType(e) === "HeritageVaultDefinitionDTO");
}

// ─── A. Non-duplication avec le domaine Bâtiments ─────────────────────────────

const CHECK_DUP = "A. non-duplication";

function checkNoDuplication(): void {
  const decorationChains = BUILDING_EXTRACT.buildings.filter((c) => c.scope === "decoration");
  const decorationKeys = new Set(decorationChains.map((c) => c.chainKey));

  expect(
    CHECK_DUP,
    "chaînes `scope: decoration` dans BUILDING_EXTRACT",
    decorationChains.length,
    HERITAGE_EXTRACT.vaults.length,
  );

  // Chaque vault pointe une chaîne existante, et une seule.
  const seen = new Set<string>();
  for (const vault of HERITAGE_EXTRACT.vaults) {
    if (!decorationKeys.has(vault.buildingChainKey)) {
      breaches.push({
        check: CHECK_DUP,
        subject: `${vault.key} — chainKey absente de BUILDING_EXTRACT`,
        expected: "une chaîne `scope: decoration`",
        actual: vault.buildingChainKey,
      });
    }
    if (seen.has(vault.buildingChainKey)) {
      breaches.push({
        check: CHECK_DUP,
        subject: `${vault.key} — chainKey partagée avec un autre vault`,
        expected: "1:1",
        actual: vault.buildingChainKey,
      });
    }
    seen.add(vault.buildingChainKey);

    // Le bâtiment déclaré doit bien être le maillon de cette chaîne, pas une copie.
    const chain = BUILDING_EXTRACT.buildings.find((c) => c.chainKey === vault.buildingChainKey);
    const ids = chain?.levels.map((l) => l.gameDesignId) ?? [];
    if (!ids.includes(vault.buildingDefinitionId)) {
      breaches.push({
        check: CHECK_DUP,
        subject: `${vault.key} — buildingDefinitionId hors de sa chaîne`,
        expected: ids,
        actual: vault.buildingDefinitionId,
      });
    }
  }

  // Le catalogue applicatif ne doit pas s'être mis à porter des marqueurs.
  const heritageInRaw = BUILDING_RAW_DATA.filter((e) => /heritage/i.test(e.key));
  expect(CHECK_DUP, "entrées heritage dans BUILDING_RAW_DATA", heritageInRaw.length, 0);

  // Et l'extraction Heritage ne doit porter aucune donnée de bâtiment.
  const forbidden = ["levels", "construction", "upgrade", "width", "height", "maxQty"];
  for (const vault of HERITAGE_EXTRACT.vaults) {
    const present = forbidden.filter((field) => field in (vault as unknown as JsonObject));
    if (present.length > 0) {
      breaches.push({
        check: CHECK_DUP,
        subject: `${vault.key} — champs de bâtiment recopiés`,
        expected: [],
        actual: present,
      });
    }
  }
}

// ─── B. Complétude vis-à-vis de la source ─────────────────────────────────────

const CHECK_FULL = "B. complétude";

function countRewardNodes(nodes: HeritageRewardNode[]): number {
  return nodes.reduce(
    (n, node) =>
      n + 1 + countRewardNodes(node.children) + (node.replacement === null ? 0 : 1),
    0,
  );
}

function checkCompleteness(definitions: JsonObject[]): void {
  expect(CHECK_FULL, "vaults", HERITAGE_EXTRACT.vaults.length, definitions.length);

  const byTheme = new Map(HERITAGE_EXTRACT.vaults.map((v) => [v.themeId, v]));
  for (const definition of definitions) {
    const themeId = asString(definition.themeId) ?? "(sans themeId)";
    const vault = byTheme.get(themeId);
    if (vault === undefined) {
      breaches.push({
        check: CHECK_FULL,
        subject: `${themeId} — vault absent de l'extraction`,
        expected: "extrait",
        actual: "absent",
      });
      continue;
    }
    expect(CHECK_FULL, `${vault.key} — slots`, vault.slots.length, asArray(definition.slots).length);
    expect(
      CHECK_FULL,
      `${vault.key} — effets`,
      vault.effects.length,
      asArray(definition.effects).length,
    );
    expect(
      CHECK_FULL,
      `${vault.key} — ressources éligibles`,
      vault.eligibleResourceIds.length,
      asArray(definition.eligibleResourceIds).length,
    );

    // Chaque effet rend quelque chose : un bonus, ou un coffre. Ni l'un ni
    // l'autre serait une perte silencieuse.
    for (const effect of vault.effects) {
      if (effect.bonuses.length === 0 && effect.rewards.length === 0) {
        breaches.push({
          check: CHECK_FULL,
          subject: `${vault.key} / ${effect.id} — effet sans bonus ni récompense`,
          expected: "≥ 1 bonus ou ≥ 1 coffre",
          actual: 0,
        });
      }
    }

    // Les récompenses déclarées dans `finish.rewards` sont toutes extraites.
    let sourceFinishRoots = 0;
    for (const rawEffect of asArray(definition.effects)) {
      for (const component of asArray(asObject(rawEffect).components)) {
        sourceFinishRoots += asArray(asObject(asObject(component).finish).rewards).length;
      }
    }
    const extractedTier1 = vault.effects
      .flatMap((e) => e.rewards.filter((t) => t.minLevel === 1))
      .reduce((n, t) => n + t.rewards.length, 0);
    if (extractedTier1 < sourceFinishRoots) {
      breaches.push({
        check: CHECK_FULL,
        subject: `${vault.key} — racines de finish.rewards perdues`,
        expected: sourceFinishRoots,
        actual: extractedTier1,
      });
    }

    expect(
      CHECK_FULL,
      `${vault.key} — barème xp (${vault.maxLevel} niveaux)`,
      vault.xpPerLevel.perLevel.length,
      vault.maxLevel - 1,
    );
    expect(
      CHECK_FULL,
      `${vault.key} — barème réputation`,
      vault.keeperReputationPerLevel.perLevel.length,
      vault.maxLevel - 1,
    );
    expect(CHECK_FULL, `${vault.key} — avertissements`, vault.warnings, []);
  }

  expect(CHECK_FULL, "avertissements globaux", HERITAGE_EXTRACT.warnings, []);
  expect(
    CHECK_FULL,
    "amplificateur du gardien",
    HERITAGE_EXTRACT.keeperAmplifier === null ? "absent" : "présent",
    "présent",
  );
  expect(
    CHECK_FULL,
    "bâtiments portant l'amplificateur",
    HERITAGE_EXTRACT.keeperAmplifier?.carriedBy.length ?? 0,
    HERITAGE_EXTRACT.vaults.length,
  );

  // Les nœuds de coffre extraits doivent être non vides là où un coffre existe.
  for (const vault of HERITAGE_EXTRACT.vaults) {
    for (const effect of vault.effects) {
      for (const tier of effect.rewards) {
        if (countRewardNodes(tier.rewards) === 0) {
          breaches.push({
            check: CHECK_FULL,
            subject: `${vault.key} / ${effect.id} — palier de coffre vide`,
            expected: "≥ 1 nœud",
            actual: 0,
          });
        }
      }
    }
  }
}

// ─── C. Formes inconnues restées dans la source ───────────────────────────────

const CHECK_SHAPES = "C. formes";

/**
 * Les listes blanches de `scripts/extract/heritage.ts`, recopiées ici EXPRÈS.
 *
 * L'extracteur lève sur ce qu'il rencontre ; ce script, lui, parcourt TOUT le
 * sous-arbre des 13 définitions, y compris les branches que l'extraction ne
 * traverse pas. Deux listes identiques qui divergeraient se verraient donc en
 * `C. formes`, et non par un silence.
 */
const KNOWN_COMPONENTS = new Set([
  "ProductionComponentDTO",
  "GrantWorkerComponentDTO",
  "CultureComponentDTO",
  "BoostUnitStatComponentDTO",
  "BoostResourceComponentDTO",
  "BuildingBoostComponentDTO",
]);

const KNOWN_REWARDS = new Set([
  "RewardDefinitionDTO",
  "MysteryChestRewardDTO",
  "LootContainerRewardDTO",
  "DynamicActionChangeRewardDTO",
  "RelicRewardDTO",
  "InventoryItemRewardDTO",
  "SelectionKitRewardDTO",
  "UnitRewardDTO",
  "ResourceRewardDTO",
  "BuildingCustomizationRewardDTO",
  // Une ressource versée, pas un coffre : portée par le bonus `goods_output`.
  "GoodRewardDTO",
]);

const KNOWN_REQUIREMENTS = new Set([
  "ResearchRequirementDTO",
  "AgeRequirementDTO",
  "RelicNotUnlockedRequirementDTO",
]);

function checkShapes(definitions: JsonObject[]): void {
  const unknownComponents = new Map<string, string>();
  const unknownRewards = new Map<string, string>();
  const unknownRequirements = new Map<string, string>();

  for (const definition of definitions) {
    const themeId = asString(definition.themeId) ?? "?";

    for (const rawEffect of asArray(definition.effects)) {
      const effect = asObject(rawEffect);
      const effectId = asString(effect.id) ?? "?";
      const components = asArray(effect.components);
      if (components.length !== 1) {
        breaches.push({
          check: CHECK_SHAPES,
          subject: `${themeId} / ${effectId} — nombre de composants`,
          expected: 1,
          actual: components.length,
        });
      }
      for (const component of components) {
        const type = shortType(component);
        if (!KNOWN_COMPONENTS.has(type)) unknownComponents.set(type, `${themeId} / ${effectId}`);
      }

      // Tout le sous-arbre de l'effet, récompenses comprises.
      for (const node of walk(rawEffect)) {
        const type = shortType(node);
        if (type.endsWith("RewardDTO") && !KNOWN_REWARDS.has(type)) {
          unknownRewards.set(type, `${themeId} / ${effectId}`);
        }
        if (type.endsWith("RequirementDTO") && !KNOWN_REQUIREMENTS.has(type)) {
          unknownRequirements.set(type, `${themeId} / ${effectId}`);
        }
      }
    }

    for (const rawSlot of asArray(definition.slots)) {
      const slot = asObject(rawSlot);
      const groups = asArray(slot.allowedGroups);
      if (groups.length !== 1) {
        breaches.push({
          check: CHECK_SHAPES,
          subject: `${themeId} / ${asString(slot.id) ?? "?"} — groupes autorisés`,
          expected: 1,
          actual: groups.length,
        });
      }
      for (const cost of asArray(asObject(slot.unlockAction).costs)) {
        const type = shortType(cost);
        if (type !== "InventoryItemCostDTO") {
          breaches.push({
            check: CHECK_SHAPES,
            subject: `${themeId} / ${asString(slot.id) ?? "?"} — coût de slot`,
            expected: "InventoryItemCostDTO",
            actual: type,
          });
        }
      }
    }
  }

  for (const [type, where] of unknownComponents) {
    breaches.push({ check: CHECK_SHAPES, subject: `composant d'effet inconnu (${where})`, expected: [...KNOWN_COMPONENTS], actual: type });
  }
  for (const [type, where] of unknownRewards) {
    breaches.push({ check: CHECK_SHAPES, subject: `type de récompense inconnu (${where})`, expected: [...KNOWN_REWARDS], actual: type });
  }
  for (const [type, where] of unknownRequirements) {
    breaches.push({ check: CHECK_SHAPES, subject: `prérequis inconnu (${where})`, expected: [...KNOWN_REQUIREMENTS], actual: type });
  }
}

// ─── D. Formules du gardien ───────────────────────────────────────────────────

const CHECK_KEEPER = "D. gardien";

function checkKeeperFormulas(): void {
  // Les 29 prix doivent tous s'évaluer — aucun n'a le droit de lever au runtime.
  for (const offer of HERITAGE_EXTRACT.keeperOfferFormulas) {
    try {
      evaluateLuaFormula(offer.luaScript, { keeperPurchaseCount: 12, playerAgeOrder: 15 });
    } catch (error) {
      breaches.push({
        check: CHECK_KEEPER,
        subject: `${offer.id} — script non évaluable`,
        expected: "un nombre",
        actual: error instanceof Error ? error.message : String(error),
      });
    }
  }

  // ⚠️ Rappel de périmètre : aucune offre n'est déclarée dans le game design.
  // Si un jour un catalogue apparaît, ce compte cesse d'être 0 et il faudra
  // rouvrir la question plutôt que continuer à saisir à la main.
  const referenced = HERITAGE_EXTRACT.keeperOfferFormulas.filter((o) => o.variables.length === 0);
  expect(CHECK_KEEPER, "formules de prix sans variable (suspect)", referenced.length, 0);
}

// ─── Rapport ──────────────────────────────────────────────────────────────────

function render(value: unknown): string {
  if (typeof value === "string") return value;
  return JSON.stringify(value);
}

function main(): void {
  const root = process.cwd();
  const definitions = loadVaultDefinitions(root);

  checkNoDuplication();
  checkCompleteness(definitions);
  checkShapes(definitions);
  checkKeeperFormulas();

  if (process.argv.includes("--json")) {
    process.stdout.write(`${JSON.stringify(breaches, null, 2)}\n`);
    process.exit(breaches.length === 0 ? 0 : 1);
  }

  const lines: string[] = [];
  lines.push("Garde-fou Heritage Vault");
  lines.push("─".repeat(72));
  lines.push(`Vaults           : ${HERITAGE_EXTRACT.vaults.length}`);
  lines.push(
    `Slots / effets   : ${HERITAGE_EXTRACT.vaults.reduce((n, v) => n + v.slots.length, 0)} / ${HERITAGE_EXTRACT.vaults.reduce((n, v) => n + v.effects.length, 0)}`,
  );
  lines.push(
    `Coffres          : ${HERITAGE_EXTRACT.vaults.reduce((n, v) => n + v.effects.reduce((m, e) => m + e.rewards.length, 0), 0)} paliers`,
  );
  lines.push(`Prix du gardien  : ${HERITAGE_EXTRACT.keeperOfferFormulas.length} formules, 0 offre déclarée`);
  lines.push("");

  const gaps = HERITAGE_EXTRACT.bonusGaps;
  lines.push(`Clés de bonus PROPOSÉES (absentes de BONUS_LABELS) : ${gaps.length}`);
  for (const gap of gaps) {
    lines.push(
      `  ${String(gap.occurrences).padStart(3)} × ${gap.proposedType.padEnd(36)} ${gap.componentType.replace("ComponentDTO", "")}`,
    );
  }
  // Un type proposé qui serait DÉJÀ au dictionnaire signalerait une divergence
  // entre l'extraction et `resolvers/bonus.ts`.
  for (const gap of gaps) {
    if (gap.proposedType in BONUS_LABELS) {
      breaches.push({
        check: "E. vocabulaire",
        subject: `${gap.proposedType} — proposé alors qu'il est déjà au dictionnaire`,
        expected: "absent de BONUS_LABELS",
        actual: "présent",
      });
    }
  }
  lines.push("");

  if (breaches.length === 0) {
    lines.push("✅ Aucun manquement.");
    process.stdout.write(`${lines.join("\n")}\n`);
    return;
  }

  lines.push(`❌ ${breaches.length} manquement(s) :`);
  lines.push("");
  for (const breach of breaches) {
    lines.push(`  [${breach.check}] ${breach.subject}`);
    lines.push(`      attendu : ${render(breach.expected)}`);
    lines.push(`      obtenu  : ${render(breach.actual)}`);
  }
  process.stdout.write(`${lines.join("\n")}\n`);
  process.exit(1);
}

main();
