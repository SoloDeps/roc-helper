// ============================================================
// ROC Helper – Diff Campaign : donnée saisie à la main vs extraction
//
// Compare `data/campaigns/*.ts` (saisi à la main, via `getCampaignsByEra`) à
// `data/campaigns/generated/campaign.generated.ts` (produit par
// scripts/extract/campaign.ts), région par région et champ par champ.
//
// Le rapport liste CHAQUE écart individuellement : c'est ce niveau de détail
// qui a trouvé les bugs des domaines Wonders et Technologies. Les regroupements
// en fin de rapport ne remplacent pas la liste, ils la résument.
//
// Aucun fichier n'est modifié : ce script lit et imprime.
//
// Usage : pnpm diff:campaign            (rapport complet)
//         pnpm diff:campaign --summary  (regroupements seuls)
//         pnpm diff:campaign --json     (les écarts en JSON, pour outillage)
// ============================================================

import { CAMPAIGN_ERA_IDS, getCampaignsByEra } from "../../data/campaigns/campaigns-registry";
import {
  CAMPAIGN_EXTRACT,
  CAMPAIGN_RAW_DATA,
} from "../../data/campaigns/generated/campaign.generated";
import type { CampaignRawRegion, CampaignRawReward } from "../../data/campaigns/generated/types";
import type { CampaignRegion } from "../../types/campaign-types";

// ─── Un écart ─────────────────────────────────────────────────────────────────

interface Divergence {
  /** Id projet, ex. `lg_4`. */
  code: string;
  /** Id de game design, pour retrouver la région dans la source. */
  gameDesignId: string;
  /** Champ comparé, ex. `column`, `part#2 reward:coins`, `required`. */
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
const CAT_SCOUT = "éclaireur divergent";
const CAT_CROSS_AGE = "prérequis inter-âge (attendu)";
const CAT_REQUIRED = "prérequis divergent";
const CAT_NAME = "libellé divergent";
const CAT_COLUMN = "colonne divergente";
const CAT_BOSS = "marque de boss divergente";
const CAT_PART_SHAPE = "structure de parties divergente";
const CAT_PART_TYPE = "mode de partie divergent";
const CAT_REWARD_VALUE = "montant de récompense divergent";
const CAT_REWARD_MISSING = "récompense absente d'un côté";
const CAT_REWARD_NAME = "libellé de récompense divergent";
const CAT_MISSING = "région absente d'un côté";

/**
 * La donnée saisie à la main a-t-elle la forme de la valeur affichée en jeu ?
 *
 * Au-delà du million, l'interface du jeu écrit « 5,3 M » : un coût de
 * 5 380 000 s'y lit 5 300 000. Un écart qui vérifie exactement cette règle
 * n'est pas un écart isolé, c'est la signature d'une saisie faite depuis
 * l'écran plutôt que depuis les données. Même fonction que scripts/diff/technologies.ts.
 */
function isGameDisplayRounding(hand: number, extracted: number): boolean {
  return extracted >= 1_000_000 && hand === Math.floor(extracted / 100_000) * 100_000;
}

// ─── Comparaison des récompenses ──────────────────────────────────────────────

/**
 * Récompenses d'un même porteur, indexées par ressource.
 *
 * Une même ressource listée deux fois se cumulerait à l'écran : on somme plutôt
 * que d'écraser, pour ne pas masquer un doublon en le remplaçant. Même choix
 * que `goodsMap()` côté Technologies.
 */
function rewardMap(rewards: CampaignRawReward[]): Map<string, { amount: number; name?: string }> {
  const map = new Map<string, { amount: number; name?: string }>();
  for (const reward of rewards) {
    const current = map.get(reward.resource);
    if (current === undefined) {
      map.set(reward.resource, { amount: reward.amount, name: reward.name });
    } else {
      current.amount += reward.amount;
      if (current.name === undefined) current.name = reward.name;
    }
  }
  return map;
}

function compareRewards(
  where: string,
  hand: CampaignRawReward[],
  extracted: CampaignRawReward[],
  push: (field: string, h: unknown, e: unknown, category: string) => void,
): void {
  const h = rewardMap(hand);
  const e = rewardMap(extracted);
  const resources = [...new Set([...h.keys(), ...e.keys()])].sort();
  for (const resource of resources) {
    const hv = h.get(resource);
    const ev = e.get(resource);
    const field = `${where}:${resource}`;
    if (hv === undefined || ev === undefined) {
      push(field, hv?.amount ?? null, ev?.amount ?? null, CAT_REWARD_MISSING);
      continue;
    }
    if (hv.amount !== ev.amount) {
      push(
        field,
        hv.amount,
        ev.amount,
        isGameDisplayRounding(hv.amount, ev.amount) ? CAT_ROUNDED_100K : CAT_REWARD_VALUE,
      );
    }
    // `name` n'est porté que par les `commander_*` (docs/data-contracts.md §3.1).
    if ((hv.name ?? null) !== (ev.name ?? null)) {
      push(`${field} (name)`, hv.name ?? null, ev.name ?? null, CAT_REWARD_NAME);
    }
  }
}

// ─── Comparaison d'une région ─────────────────────────────────────────────────

function compare(
  hand: CampaignRegion,
  extracted: CampaignRawRegion,
  gameDesignId: string,
  crossAgeRequired: string[],
): Divergence[] {
  const out: Divergence[] = [];
  const push = (field: string, h: unknown, e: unknown, category: string): void => {
    out.push({ code: hand.id, gameDesignId, field, hand: h, extracted: e, category });
  };

  if (hand.name !== extracted.name) push("name", hand.name, extracted.name, CAT_NAME);
  if (hand.column !== extracted.column) push("column", hand.column, extracted.column, CAT_COLUMN);

  const handBoss = hand.boss === true;
  const extractedBoss = extracted.boss === true;
  if (handBoss !== extractedBoss) push("boss", handBoss, extractedBoss, CAT_BOSS);

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

  for (const key of ["coins", "duration"] as const) {
    const h = hand.scout[key];
    const e = extracted.scout[key];
    if (h === e) continue;
    push(
      `scout.${key}`,
      h,
      e,
      key === "coins" && isGameDisplayRounding(h, e) ? CAT_ROUNDED_100K : CAT_SCOUT,
    );
  }

  compareRewards("regionReward", hand.regionRewards, extracted.regionRewards, push);

  if (hand.parts.length !== extracted.parts.length) {
    push("parts.length", hand.parts.length, extracted.parts.length, CAT_PART_SHAPE);
  }
  // Les parties sont comparées par POSITION : c'est leur seule identité des deux
  // côtés (la donnée à la main ne porte pas l'id de `PartComponentDTO`). Un
  // décalage d'une partie se lira donc comme une cascade d'écarts — c'est voulu,
  // il vaut mieux une cascade lisible qu'un appariement deviné.
  const partCount = Math.min(hand.parts.length, extracted.parts.length);
  for (let i = 0; i < partCount; i += 1) {
    const hp = hand.parts[i];
    const ep = extracted.parts[i];
    const handType = [...hp.type].sort().join("+");
    const extractedType = [...ep.type].sort().join("+");
    if (handType !== extractedType) {
      push(`part#${i + 1}.type`, hp.type, ep.type, CAT_PART_TYPE);
    }
    compareRewards(`part#${i + 1}`, hp.rewards, ep.rewards, push);
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

  const handById = new Map<string, CampaignRegion>();
  for (const eraId of CAMPAIGN_ERA_IDS) {
    for (const region of getCampaignsByEra(eraId)) {
      if (handById.has(region.id)) {
        process.stdout.write(`⚠️  id saisi deux fois côté main : ${region.id}\n`);
      }
      handById.set(region.id, region);
    }
  }

  const extractedById = new Map(CAMPAIGN_RAW_DATA.map((entry) => [entry.id, entry]));
  const metaByCode = new Map(CAMPAIGN_EXTRACT.regions.map((r) => [r.code, r]));

  const divergences: Divergence[] = [];

  for (const [code, hand] of handById) {
    if (extractedById.has(code)) continue;
    divergences.push({
      code,
      gameDesignId: "—",
      field: "région",
      hand: hand.name,
      extracted: null,
      category: CAT_MISSING,
    });
  }
  for (const [code, extracted] of extractedById) {
    if (handById.has(code)) continue;
    divergences.push({
      code,
      gameDesignId: metaByCode.get(code)?.id ?? "—",
      field: "région",
      hand: null,
      extracted: extracted.name,
      category: CAT_MISSING,
    });
  }

  // Ordre de lecture : celui de la carte (âge chronologique, puis rang dans
  // l'âge), c'est-à-dire l'ordre de `CAMPAIGN_RAW_DATA`.
  for (const extracted of CAMPAIGN_RAW_DATA) {
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
        `    ${d.field.padEnd(30)} main: ${render(d.hand).padEnd(24)} extrait: ${render(d.extracted).padEnd(24)} [${d.category}]\n`,
      );
    }
  }

  const byCategory = new Map<string, number>();
  const regionsTouched = new Set<string>();
  for (const d of divergences) {
    byCategory.set(d.category, (byCategory.get(d.category) ?? 0) + 1);
    regionsTouched.add(d.code);
  }

  process.stdout.write(
    [
      ``,
      `── Récapitulatif ──`,
      `Régions comparées : ${handById.size} à la main / ${extractedById.size} extraites`,
      `Écarts            : ${divergences.length}`,
      `Régions touchées  : ${regionsTouched.size}`,
      ``,
      ...[...byCategory.entries()]
        .sort((a, b) => b[1] - a[1])
        .map(([category, count]) => `  ${String(count).padStart(4)}  ${category}`),
      ``,
    ].join("\n"),
  );
}

main();
