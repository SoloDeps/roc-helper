// ============================================================
// ROC Helper – Diff Technologies : donnée saisie à la main vs extraction
//
// Compare `data/technos/*.ts` (saisi à la main, via TECHNOLOGY_REGISTRY) à
// `data/technos/generated/technologies.generated.ts` (produit par
// scripts/extract/technologies.ts), technologie par technologie et champ par
// champ.
//
// Le rapport liste CHAQUE écart individuellement : c'est ce niveau de détail
// qui a trouvé les bugs du domaine Wonders. Les regroupements en fin de rapport
// ne remplacent pas la liste, ils la résument.
//
// Aucun fichier n'est modifié : ce script lit et imprime.
//
// Usage : pnpm diff:technos            (rapport complet)
//         pnpm diff:technos --summary  (regroupements seuls)
//         pnpm diff:technos --json     (les écarts en JSON, pour outillage)
// ============================================================

import { TECHNOLOGY_REGISTRY } from "../../data/technos-registry";
import {
  TECHNOLOGY_EXTRACT,
  TECHNOLOGY_RAW_DATA,
} from "../../data/technos/generated/technologies.generated";
import type { TechnoRawEntry } from "../../data/technos/generated/types";
import type { TechnoData } from "../../types/shared";

// ─── Un écart ─────────────────────────────────────────────────────────────────

interface Divergence {
  /** Id projet, ex. `af_39`. */
  code: string;
  /** Id de game design, pour retrouver la technologie dans la source. */
  gameDesignId: string;
  /** Champ comparé, ex. `coins`, `good:secondary_af`, `required`. */
  field: string;
  /** Valeur de la donnée saisie à la main. */
  hand: unknown;
  /** Valeur de l'extraction. */
  extracted: unknown;
  /** Regroupement, pour le résumé. */
  category: string;
}

// ─── Catégories ───────────────────────────────────────────────────────────────
//
// Une catégorie n'est PAS un verdict : elle regroupe des écarts de même forme
// pour que la liste reste lisible. L'hypothèse (bug à la main / bug d'extraction
// / à vérifier en jeu) se pose en la lisant, pas ici.

const CAT_ROUNDED_100K = "coût arrondi à 0,1 M";
const CAT_COST_VALUE = "coût divergent";
const CAT_COST_MISSING = "ligne de coût absente d'un côté";
const CAT_CROSS_AGE = "prérequis inter-âge (attendu)";
const CAT_REQUIRED = "prérequis divergent";
const CAT_NAME = "libellé divergent";
const CAT_COLUMN = "colonne divergente";
const CAT_ALLIED = "cité divergente";
const CAT_MISSING = "technologie absente d'un côté";

/**
 * La donnée saisie à la main a-t-elle la forme de la valeur affichée en jeu ?
 *
 * Au-delet du million, l'interface du jeu écrit « 5,3 M » : un coût de
 * 5 380 000 s'y lit 5 300 000. Un écart qui vérifie exactement cette règle
 * n'est pas un écart isolé, c'est la signature d'une saisie faite depuis
 * l'écran plutôt que depuis les données.
 */
function isGameDisplayRounding(hand: number, extracted: number): boolean {
  return extracted >= 1_000_000 && hand === Math.floor(extracted / 100_000) * 100_000;
}

// ─── Comparaison ──────────────────────────────────────────────────────────────

function goodsMap(costs: { goods?: { amount: number; resource: string }[] }): Map<string, number> {
  const map = new Map<string, number>();
  for (const good of costs.goods ?? []) {
    // Un même bien listé deux fois se cumulerait en jeu : on somme plutôt que
    // d'écraser, pour ne pas masquer un doublon en le remplaçant.
    map.set(good.resource, (map.get(good.resource) ?? 0) + good.amount);
  }
  return map;
}

function compare(
  hand: TechnoData,
  extracted: TechnoRawEntry,
  gameDesignId: string,
  crossAgeRequired: string[],
): Divergence[] {
  const out: Divergence[] = [];
  const push = (field: string, h: unknown, e: unknown, category: string): void => {
    out.push({ code: hand.id, gameDesignId, field, hand: h, extracted: e, category });
  };

  if (hand.name !== extracted.name) push("name", hand.name, extracted.name, CAT_NAME);
  if (hand.column !== extracted.column) push("column", hand.column, extracted.column, CAT_COLUMN);

  const handAllied = hand.allied ?? null;
  const extractedAllied = extracted.allied ?? null;
  if (handAllied !== extractedAllied) push("allied", handAllied, extractedAllied, CAT_ALLIED);

  // Prérequis : les arêtes inter-âges sont volontairement absentes de la
  // projection UI (l'app ne cherche que dans l'ère affichée). Elles sont
  // rapportées à part pour qu'elles ne se confondent pas avec un vrai écart.
  const handRequired = [...(hand.required ?? [])].sort();
  const extractedRequired = [...extracted.required].sort();
  if (handRequired.join(",") !== extractedRequired.join(",")) {
    push("required", handRequired, extractedRequired, CAT_REQUIRED);
  }
  if (crossAgeRequired.length > 0) {
    push("required (inter-âge)", hand.required ?? [], crossAgeRequired, CAT_CROSS_AGE);
  }

  for (const key of ["research_points", "coins", "food"] as const) {
    const h = hand.costs[key];
    const e = extracted.costs[key];
    if (h === e) continue;
    if (h === undefined || e === undefined) {
      push(key, h ?? null, e ?? null, CAT_COST_MISSING);
    } else if (isGameDisplayRounding(h, e)) {
      push(key, h, e, CAT_ROUNDED_100K);
    } else {
      push(key, h, e, CAT_COST_VALUE);
    }
  }

  const handGoods = goodsMap(hand.costs);
  const extractedGoods = goodsMap(extracted.costs);
  const resources = [...new Set([...handGoods.keys(), ...extractedGoods.keys()])].sort();
  for (const resource of resources) {
    const h = handGoods.get(resource);
    const e = extractedGoods.get(resource);
    if (h === e) continue;
    if (h === undefined || e === undefined) {
      push(`good:${resource}`, h ?? null, e ?? null, CAT_COST_MISSING);
    } else if (isGameDisplayRounding(h, e)) {
      push(`good:${resource}`, h, e, CAT_ROUNDED_100K);
    } else {
      push(`good:${resource}`, h, e, CAT_COST_VALUE);
    }
  }

  return out;
}

// ─── Rapport ──────────────────────────────────────────────────────────────────

function render(value: unknown): string {
  if (value === null) return "—";
  if (Array.isArray(value)) return value.length === 0 ? "[]" : `[${value.join(", ")}]`;
  if (typeof value === "number") return value.toLocaleString("fr-FR");
  return String(value);
}

function main(): void {
  const summaryOnly = process.argv.includes("--summary");
  const asJson = process.argv.includes("--json");

  const handById = new Map<string, TechnoData>();
  for (const technologies of Object.values(TECHNOLOGY_REGISTRY)) {
    for (const technology of technologies) {
      if (handById.has(technology.id)) {
        process.stdout.write(`⚠️  id saisi deux fois côté main : ${technology.id}\n`);
      }
      handById.set(technology.id, technology);
    }
  }

  const extractedById = new Map(TECHNOLOGY_RAW_DATA.map((entry) => [entry.id, entry]));
  const metaByCode = new Map(TECHNOLOGY_EXTRACT.technologies.map((t) => [t.code, t]));

  const divergences: Divergence[] = [];

  for (const [code, hand] of handById) {
    const extracted = extractedById.get(code);
    if (extracted === undefined) {
      divergences.push({
        code,
        gameDesignId: "—",
        field: "technologie",
        hand: hand.name,
        extracted: null,
        category: CAT_MISSING,
      });
    }
  }
  for (const [code, extracted] of extractedById) {
    if (handById.has(code)) continue;
    divergences.push({
      code,
      gameDesignId: metaByCode.get(code)?.id ?? "—",
      field: "technologie",
      hand: null,
      extracted: extracted.name,
      category: CAT_MISSING,
    });
  }

  // Ordre de lecture : celui de l'arbre (âge chronologique, puis colonne),
  // c'est-à-dire l'ordre de `TECHNOLOGY_RAW_DATA`.
  for (const extracted of TECHNOLOGY_RAW_DATA) {
    const hand = handById.get(extracted.id);
    if (hand === undefined) continue;
    const meta = metaByCode.get(extracted.id);
    divergences.push(
      ...compare(hand, extracted, meta?.id ?? "—", meta?.crossAgeRequiresCodes ?? []),
    );
  }

  if (asJson) {
    process.stdout.write(`${JSON.stringify(divergences, null, 2)}\n`);
    return;
  }

  if (!summaryOnly) {
    let current = "";
    for (const d of divergences) {
      if (d.code !== current) {
        current = d.code;
        const meta = metaByCode.get(d.code);
        process.stdout.write(`\n${d.code}  ${meta?.name ?? ""}  (${d.gameDesignId})\n`);
      }
      process.stdout.write(
        `    ${d.field.padEnd(24)} main: ${render(d.hand).padEnd(22)} extrait: ${render(d.extracted).padEnd(22)} [${d.category}]\n`,
      );
    }
  }

  const byCategory = new Map<string, number>();
  const technologiesTouched = new Set<string>();
  for (const d of divergences) {
    byCategory.set(d.category, (byCategory.get(d.category) ?? 0) + 1);
    technologiesTouched.add(d.code);
  }

  process.stdout.write(
    [
      ``,
      `── Récapitulatif ──`,
      `Technologies comparées : ${handById.size} à la main / ${extractedById.size} extraites`,
      `Écarts                 : ${divergences.length}`,
      `Technologies touchées  : ${technologiesTouched.size}`,
      ``,
      ...[...byCategory.entries()]
        .sort((a, b) => b[1] - a[1])
        .map(([category, count]) => `  ${String(count).padStart(4)}  ${category}`),
      ``,
    ].join("\n"),
  );
}

main();
