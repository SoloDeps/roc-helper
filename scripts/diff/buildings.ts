// ============================================================
// ROC Helper – Diff Bâtiments : donnée saisie à la main vs extraction
//
// Compare `data/capital/**` + `data/allieds/**` (saisi à la main, via
// `HAND_ELEMENT_DATA`) à `data/buildings/generated/buildings.generated.ts`
// (produit par scripts/extract/buildings.ts), bâtiment par bâtiment, niveau par
// niveau, champ par champ.
//
// Le rapport liste CHAQUE écart individuellement : c'est ce niveau de détail
// qui a trouvé les bugs des domaines Wonders et Technologies. Les regroupements
// en fin de rapport ne remplacent pas la liste, ils la résument.
//
// ⚠️ Quatre champs ne sont PAS comparés — `id`, `category`, `subcategory`,
// `imageName`. Ils n'existent pas dans le game design : l'extracteur les
// recopie d'une table de présentation projet (`PROJECT_PRESENTATION`), donc les
// comparer reviendrait à comparer la table avec elle-même.
//
// Aucun fichier n'est modifié : ce script lit et imprime.
//
// Usage : pnpm diff:buildings            (rapport complet)
//         pnpm diff:buildings --summary  (regroupements seuls)
//         pnpm diff:buildings --json     (les écarts en JSON, pour outillage)
//         pnpm diff:buildings --key=capital_small_home  (un seul bâtiment)
// ============================================================

import { HAND_ELEMENT_DATA } from "../../data/registry-hand";
import {
  BUILDING_EXTRACT,
  BUILDING_RAW_DATA,
} from "../../data/buildings/generated/buildings.generated";
import type {
  BuildingRawCosts,
  BuildingRawEntry,
  BuildingRawLevel,
} from "../../data/buildings/generated/types";
import type { BuildingData, BuildingLevel, Costs } from "../../types/shared";

// ─── Un écart ─────────────────────────────────────────────────────────────────

interface Divergence {
  /** Clé de registre, ex. `capital_small_home`. */
  key: string;
  /** Niveau concerné, ou `—` pour un écart au niveau du bâtiment. */
  level: string;
  /** Id de game design du maillon, pour retrouver la définition dans la source. */
  gameDesignId: string;
  /** Champ comparé, ex. `construction.coins`, `upgrade.good:primary_ba`, `max_qty`. */
  field: string;
  hand: unknown;
  extracted: unknown;
  category: string;
}

// ─── Catégories ───────────────────────────────────────────────────────────────
//
// Une catégorie n'est PAS un verdict : elle regroupe des écarts de même forme
// pour que la liste reste lisible. L'hypothèse (bug à la main / bug d'extraction
// / à vérifier en jeu) se pose en la lisant, pas ici.

const CAT_BUILDING_MISSING = "bâtiment absent d'un côté";
const CAT_NAME = "libellé divergent";
const CAT_LEVEL_MISSING = "niveau absent d'un côté";
const CAT_LEVEL_BEYOND = "niveau au-delà du game design (généré)";
const CAT_LEVEL_DUPLICATE = "couple (level, era) en double à la main";
const CAT_ERA = "ère divergente";
const CAT_MAX_QTY = "max_qty divergent";
/**
 * Le game design n'accorde aucune limite à ce groupe : `WORKSHOP_MAX_QTY`
 * (data/config.ts) en est la source manuelle, et le reste — décision assumée,
 * pas une lacune d'extraction. Catégorie distincte pour que ces lignes ne se
 * lisent pas comme des écarts à corriger.
 */
const CAT_MAX_QTY_NO_SOURCE = "max_qty sans source côté game design (WORKSHOP_MAX_QTY assumé)";
const CAT_ROUNDED_100K = "coût arrondi à 0,1 M";
const CAT_COST_VALUE = "coût divergent";
const CAT_COST_MISSING = "ligne de coût absente d'un côté";
/**
 * ⚠️ Doit valoir 0 : les deux côtés écrivent le RANG (`primary_re`), jamais le
 * bien concret — cf. `GOOD_RANK` dans scripts/extract/buildings.ts. La passe
 * d'appariement reste comme GARDE-FOU : si un côté figeait un bien d'ère en bien
 * concret, elle le rattraperait ici au lieu de rapporter deux lignes de coût
 * manquantes. Un chiffre non nul signale ce genre de dérive, pas un vrai écart
 * de coût.
 */
const CAT_ERA_GOOD_RESOLVED = "bien d'ère figé en bien concret à la main";
const CAT_KIND_SWAPPED = "construction/upgrade inversés";

/**
 * La donnée saisie à la main a-t-elle la forme de la valeur affichée en jeu ?
 *
 * Au-delà du million, l'interface du jeu écrit « 5,3 M » : un coût de
 * 5 380 000 s'y lit 5 300 000. Un écart qui vérifie exactement cette règle
 * n'est pas un écart isolé, c'est la signature d'une saisie faite depuis
 * l'écran plutôt que depuis les données. Même heuristique que le diff Technos.
 */
function isGameDisplayRounding(hand: number, extracted: number): boolean {
  return extracted >= 1_000_000 && hand === Math.floor(extracted / 100_000) * 100_000;
}

/** `primary_ba` / `secondary_lg` … — un bien d'ère, résolu dynamiquement par l'app. */
const ERA_GOOD = /^(primary|secondary|tertiary)_[a-z]{2}$/;

// ─── Comparaison des coûts ────────────────────────────────────────────────────

const SCALAR_KEYS = [
  "coins",
  "food",
  "gems",
  "aspers",
  "deben",
  "wu_zhu",
  "rice",
  "cocoa",
  "pennies",
  "dirham",
  "research_points",
  "culture_range",
  "culture_bonus",
] as const;

type ScalarKey = (typeof SCALAR_KEYS)[number];

function goodsMap(costs: Costs | BuildingRawCosts | undefined): Map<string, number> {
  const map = new Map<string, number>();
  for (const good of costs?.goods ?? []) {
    // Un même bien listé deux fois se cumulerait en jeu : on somme plutôt que
    // d'écraser, pour ne pas masquer un doublon en le remplaçant.
    map.set(good.resource, (map.get(good.resource) ?? 0) + good.amount);
  }
  return map;
}

function scalarValue(costs: Costs | BuildingRawCosts | undefined, key: ScalarKey): number | undefined {
  if (costs === undefined) return undefined;
  const value = (costs as Record<string, unknown>)[key];
  return typeof value === "number" ? value : undefined;
}

interface CostContext {
  push: (field: string, hand: unknown, extracted: unknown, category: string) => void;
  /** `construction` ou `upgrade`. */
  kind: string;
}

function compareCosts(
  hand: Costs | undefined,
  extracted: BuildingRawCosts | undefined,
  ctx: CostContext,
): void {
  if (hand === undefined && extracted === undefined) return;

  for (const key of SCALAR_KEYS) {
    const h = scalarValue(hand, key);
    const e = scalarValue(extracted, key);
    if (h === e) continue;
    const field = `${ctx.kind}.${key}`;
    if (h === undefined || e === undefined) {
      ctx.push(field, h ?? null, e ?? null, CAT_COST_MISSING);
    } else if (isGameDisplayRounding(h, e)) {
      ctx.push(field, h, e, CAT_ROUNDED_100K);
    } else {
      ctx.push(field, h, e, CAT_COST_VALUE);
    }
  }

  const handGoods = goodsMap(hand);
  const extractedGoods = goodsMap(extracted);

  // Passe 1 : les biens nommés des deux côtés.
  for (const resource of [...new Set([...handGoods.keys(), ...extractedGoods.keys()])].sort()) {
    const h = handGoods.get(resource);
    const e = extractedGoods.get(resource);
    if (h === undefined || e === undefined) continue;
    handGoods.delete(resource);
    extractedGoods.delete(resource);
    if (h === e) continue;
    const field = `${ctx.kind}.good:${resource}`;
    if (isGameDisplayRounding(h, e)) ctx.push(field, h, e, CAT_ROUNDED_100K);
    else ctx.push(field, h, e, CAT_COST_VALUE);
  }

  // Passe 2 : appariement « bien d'ère ↔ bien concret ».
  //
  // Le game design écrit `DYN|<Age>_GoodN`, que l'app garde en `primary_re` et
  // résout au moment de l'affichage selon les ateliers du joueur. Là où la
  // saisie à la main a écrit le nom du bien de SES ateliers (`goblet`, `cape`…),
  // les deux côtés décrivent le même coût mais l'un est figé. Apparier par
  // montant identique évite de rapporter six lignes là où il y a une décision.
  const handOnly = [...handGoods.entries()].sort();
  const extractedOnly = [...extractedGoods.entries()].sort();
  const pairedExtracted = new Set<string>();
  for (const [resource, amount] of handOnly) {
    if (ERA_GOOD.test(resource)) continue;
    const candidates = extractedOnly.filter(
      ([r, a]) => ERA_GOOD.test(r) && a === amount && !pairedExtracted.has(r),
    );
    if (candidates.length === 0) continue;
    const match = candidates[0];
    pairedExtracted.add(match[0]);
    handGoods.delete(resource);
    extractedGoods.delete(match[0]);
    // ⚠️ Quand plusieurs biens d'ère portent le MÊME montant (fréquent : les
    // trois biens d'une ère coûtent souvent autant), l'appariement par montant
    // ne peut pas dire lequel. Le rang affiché est alors arbitraire — c'est la
    // CLASSE de l'écart qui est établie, pas la correspondance exacte.
    const ambiguous = candidates.length > 1 ? " (rang ambigu)" : "";
    ctx.push(
      `${ctx.kind}.good:${match[0]}${ambiguous}`,
      resource,
      match[0],
      CAT_ERA_GOOD_RESOLVED,
    );
  }

  // Passe 3 : ce qui reste n'est présent que d'un côté.
  for (const [resource, amount] of [...handGoods.entries()].sort()) {
    ctx.push(`${ctx.kind}.good:${resource}`, amount, null, CAT_COST_MISSING);
  }
  for (const [resource, amount] of [...extractedGoods.entries()].sort()) {
    ctx.push(`${ctx.kind}.good:${resource}`, null, amount, CAT_COST_MISSING);
  }
}

/** Un coût est-il vide au sens de l'app (aucune clé exploitable) ? */
function isEmptyCosts(costs: Costs | BuildingRawCosts | undefined): boolean {
  if (costs === undefined) return true;
  const goods = costs.goods ?? [];
  if (goods.length > 0) return false;
  return !SCALAR_KEYS.some((key) => scalarValue(costs, key) !== undefined);
}

// ─── Comparaison d'un bâtiment ────────────────────────────────────────────────

function compare(
  key: string,
  hand: BuildingData,
  extracted: BuildingRawEntry,
  gameDesignIdByLevel: Map<number, string>,
): Divergence[] {
  const out: Divergence[] = [];
  const at =
    (level: string) =>
    (field: string, h: unknown, e: unknown, category: string): void => {
      const numeric = Number(level);
      out.push({
        key,
        level,
        gameDesignId: Number.isNaN(numeric) ? "—" : (gameDesignIdByLevel.get(numeric) ?? "—"),
        field,
        hand: h,
        extracted: e,
        category,
      });
    };

  if (hand.name !== extracted.name) at("—")("name", hand.name, extracted.name, CAT_NAME);

  const handByLevel = new Map<number, BuildingLevel>();
  for (const level of hand.levels) {
    if (handByLevel.has(level.level)) {
      // docs/data-contracts.md §1.1 a) contrainte 1 : le couple (level, era)
      // doit être unique — `data-hydration.ts` filtre dessus.
      at(String(level.level))(
        "niveau",
        `${level.era} (déjà vu : ${handByLevel.get(level.level)?.era})`,
        null,
        CAT_LEVEL_DUPLICATE,
      );
    }
    handByLevel.set(level.level, level);
  }
  const extractedByLevel = new Map<number, BuildingRawLevel>(
    extracted.levels.map((level) => [level.level, level]),
  );
  const maxExtractedLevel = extracted.levels.reduce((max, l) => Math.max(max, l.level), 0);

  const levels = [...new Set([...handByLevel.keys(), ...extractedByLevel.keys()])].sort(
    (a, b) => a - b,
  );

  for (const level of levels) {
    const push = at(String(level));
    const h = handByLevel.get(level);
    const e = extractedByLevel.get(level);

    if (h === undefined) {
      push("niveau", null, `${e?.era} (extrait)`, CAT_LEVEL_MISSING);
      continue;
    }
    if (e === undefined) {
      // Au-delà du dernier niveau du game design, la saisie vient de
      // `generateDynamicLevels` : c'est une extrapolation vers des ères non
      // encore livrées, pas un écart de lecture.
      push(
        "niveau",
        `${h.era} (à la main)`,
        null,
        level > maxExtractedLevel ? CAT_LEVEL_BEYOND : CAT_LEVEL_MISSING,
      );
      continue;
    }

    if (h.era !== e.era) push("era", h.era, e.era, CAT_ERA);

    const handMaxQty = h.max_qty ?? null;
    const extractedMaxQty = e.max_qty ?? null;
    if (handMaxQty !== extractedMaxQty) {
      push(
        "max_qty",
        handMaxQty,
        extractedMaxQty,
        extractedMaxQty === null ? CAT_MAX_QTY_NO_SOURCE : CAT_MAX_QTY,
      );
    }

    // Un coût rangé sous `construction` d'un côté et `upgrade` de l'autre est un
    // écart de NATURE, pas de montant : le signaler une fois vaut mieux que de
    // rapporter deux fois toutes ses lignes.
    const swapped =
      isEmptyCosts(h.construction) !== isEmptyCosts(e.construction) &&
      isEmptyCosts(h.upgrade) !== isEmptyCosts(e.upgrade) &&
      isEmptyCosts(h.construction) === !isEmptyCosts(h.upgrade);
    if (swapped) {
      push(
        "nature du coût",
        isEmptyCosts(h.construction) ? "upgrade" : "construction",
        isEmptyCosts(e.construction) ? "upgrade" : "construction",
        CAT_KIND_SWAPPED,
      );
      continue;
    }

    compareCosts(h.construction, e.construction, { push, kind: "construction" });
    compareCosts(h.upgrade, e.upgrade, { push, kind: "upgrade" });
  }

  return out;
}

// ─── Rapport ──────────────────────────────────────────────────────────────────

function render(value: unknown): string {
  if (value === null) return "—";
  if (typeof value === "number") return value.toLocaleString("fr-FR");
  return String(value);
}

function argValue(prefix: string): string | null {
  const arg = process.argv.find((a) => a.startsWith(prefix));
  return arg === undefined ? null : arg.slice(prefix.length);
}

function main(): void {
  const summaryOnly = process.argv.includes("--summary");
  const asJson = process.argv.includes("--json");
  const only = argValue("--key=");

  const handByKey = new Map<string, BuildingData>(Object.entries(HAND_ELEMENT_DATA));
  const extractedByKey = new Map(BUILDING_RAW_DATA.map((entry) => [entry.key, entry]));

  // `gameDesignId` par (clé de registre, niveau) — pour pouvoir aller lire la
  // définition exacte dans la source depuis une ligne du rapport.
  const gameDesignIds = new Map<string, Map<number, string>>();
  for (const building of BUILDING_EXTRACT.buildings) {
    if (building.registryKey === null) continue;
    const byLevel = new Map<number, string>();
    for (const level of building.levels) {
      byLevel.set(level.level ?? level.chainIndex + 1, level.gameDesignId);
    }
    gameDesignIds.set(building.registryKey, byLevel);
  }

  const divergences: Divergence[] = [];

  for (const [key, hand] of handByKey) {
    if (only !== null && key !== only) continue;
    if (extractedByKey.has(key)) continue;
    divergences.push({
      key,
      level: "—",
      gameDesignId: "—",
      field: "bâtiment",
      hand: hand.name,
      extracted: null,
      category: CAT_BUILDING_MISSING,
    });
  }
  for (const [key, extracted] of extractedByKey) {
    if (only !== null && key !== only) continue;
    if (handByKey.has(key)) continue;
    // Les chaînes `evolving` n'ont jamais été saisies à la main : leur absence
    // de ce côté n'est pas un écart à instruire.
    if (extracted.buildingType === "evolving") continue;
    divergences.push({
      key,
      level: "—",
      gameDesignId: "—",
      field: "bâtiment",
      hand: null,
      extracted: extracted.name,
      category: CAT_BUILDING_MISSING,
    });
  }

  for (const extracted of BUILDING_RAW_DATA) {
    if (only !== null && extracted.key !== only) continue;
    const hand = handByKey.get(extracted.key);
    if (hand === undefined) continue;
    divergences.push(
      ...compare(extracted.key, hand, extracted, gameDesignIds.get(extracted.key) ?? new Map()),
    );
  }

  if (asJson) {
    process.stdout.write(`${JSON.stringify(divergences, null, 2)}\n`);
    return;
  }

  if (!summaryOnly) {
    let currentKey = "";
    let currentLevel = "";
    for (const d of divergences) {
      if (d.key !== currentKey) {
        currentKey = d.key;
        currentLevel = "";
        const extracted = extractedByKey.get(d.key);
        process.stdout.write(`\n${d.key}  ${extracted?.name ?? handByKey.get(d.key)?.name ?? ""}\n`);
      }
      if (d.level !== currentLevel) {
        currentLevel = d.level;
        process.stdout.write(`  niveau ${d.level.padEnd(4)} ${d.gameDesignId}\n`);
      }
      process.stdout.write(
        `      ${d.field.padEnd(30)} main: ${render(d.hand).padEnd(18)} extrait: ${render(d.extracted).padEnd(18)} [${d.category}]\n`,
      );
    }
  }

  const byCategory = new Map<string, number>();
  const buildingsTouched = new Set<string>();
  for (const d of divergences) {
    byCategory.set(d.category, (byCategory.get(d.category) ?? 0) + 1);
    buildingsTouched.add(d.key);
  }

  const byCategoryPerBuilding = new Map<string, Set<string>>();
  for (const d of divergences) {
    byCategoryPerBuilding.set(
      d.category,
      (byCategoryPerBuilding.get(d.category) ?? new Set()).add(d.key),
    );
  }

  process.stdout.write(
    [
      ``,
      `── Récapitulatif ──`,
      `Bâtiments comparés     : ${handByKey.size} à la main / ${extractedByKey.size} projetés`,
      `Chaînes extraites      : ${BUILDING_EXTRACT.buildings.length} (dont ${BUILDING_EXTRACT.buildings.filter((b) => b.scope !== "app").length} hors périmètre app)`,
      `Écarts                 : ${divergences.length}`,
      `Bâtiments touchés      : ${buildingsTouched.size}`,
      ``,
      ...[...byCategory.entries()]
        .sort((a, b) => b[1] - a[1])
        .map(
          ([category, count]) =>
            `  ${String(count).padStart(5)}  ${category}  (${byCategoryPerBuilding.get(category)?.size ?? 0} bâtiments)`,
        ),
      ``,
      `Vocabulaire de bonus   : ${BUILDING_EXTRACT.bonusGaps.length} type(s) sans équivalent existant`,
      ...BUILDING_EXTRACT.bonusGaps.map(
        (gap) =>
          `  ${String(gap.occurrences).padStart(5)}  ${gap.proposedType.padEnd(28)} ${gap.componentType}`,
      ),
      ``,
    ].join("\n"),
  );
}

main();
