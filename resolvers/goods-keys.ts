/**
 * Le contrat « clé de bien en RANG » — `primary_ba`, `Secondary_RE`, …
 *
 * Avant ce module, ce contrat était porté par TROIS expressions régulières
 * différentes réparties sur six emplacements (§6.4 du doc `data-contracts.md`) :
 *
 *   `^(primary|secondary|tertiary)_[a-z]{2}$/i`   lib/constants.ts (isPriorityGoodKey)
 *                                                 lib/utils/calculations.ts (groupGoodsByEra)
 *                                                 app/technologies/page.tsx
 *                                                 components/cards/techno-card.tsx
 *                                                 components/technology/tech-details-panel.tsx
 *   `^(primary|secondary|tertiary)_[a-z]+$/i`     components/wonders/wonder-detail-modal.tsx
 *   `^(primary|secondary|tertiary)_/i`            lib/db/data-hydration.ts (préfixe seul)
 *
 * Trois contrats distincts, donc : « est-ce un rang ? », « décompose-le »,
 * « commence-t-il par un rang ? ». Le jour où une ère prend un code à trois
 * lettres, la variante `[a-z]+` continue de résoudre le bien et les cinq autres
 * emplacements cessent de le faire, silencieusement.
 *
 * On retient `[a-z]{2,}` : sur-ensemble strict des trois variantes, donc aucun
 * changement de verdict sur la donnée d'aujourd'hui (figé par un test qui
 * confronte les trois anciennes regex à celle-ci sur TOUTES les clés de biens
 * réellement présentes dans `data/`), et pas de rupture le jour où un code
 * d'ère s'allonge.
 */

/** Les trois emplacements d'atelier, dans l'ordre du jeu. */
export const GOOD_RANKS = ["primary", "secondary", "tertiary"] as const;

export type GoodRank = (typeof GOOD_RANKS)[number];

export interface RankGoodKey {
  /** Toujours en minuscules. */
  priority: GoodRank;
  /** Toujours en MAJUSCULES — la forme utilisée comme clé d'ère dans l'UI. */
  era: string;
}

const RANK_GOOD_KEY = /^(primary|secondary|tertiary)_([a-z]{2,})$/i;

/**
 * La clé désigne-t-elle un rang (`primary_ba`) plutôt qu'un bien concret
 * (`wool`) ?
 *
 * Remplace `isPriorityGoodKey` (lib/constants.ts).
 */
export function isRankGoodKey(key: string): boolean {
  return typeof key === "string" && RANK_GOOD_KEY.test(key);
}

/**
 * Décompose une clé de rang en `{ priority, era }`, normalisée : priorité en
 * minuscules, ère en majuscules. `null` si la clé n'est pas un rang.
 *
 * La normalisation est sans effet sur les consommateurs actuels — tous
 * repassent par `getGoodNameFromPriorityEra`, qui recase ses deux arguments —
 * mais elle évite que la casse de la donnée fuite jusqu'aux clés de `Map`.
 */
export function parseRankGoodKey(key: string): RankGoodKey | null {
  if (typeof key !== "string") return null;

  const match = key.match(RANK_GOOD_KEY);
  if (!match) return null;

  return {
    priority: match[1].toLowerCase() as GoodRank,
    era: match[2].toUpperCase(),
  };
}
