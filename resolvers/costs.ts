/**
 * L'agrégation de coûts — fonction unique.
 *
 * Avant ce module, le même algorithme (« itérer les entrées, sommer les
 * nombres, traiter `goods` à part ») existait en cinq exemplaires (§6.4 du doc
 * `data-contracts.md`), dont trois vivants :
 *
 *   lib/utils/calculations.ts     `accumulateCosts`  → Map        (Calculator)
 *   app/technologies/page.tsx     `sumCosts`         → Map        (panneau Stats)
 *   components/cards/techno-card  inline             → tableau    (cartes techno)
 *
 * et deux morts, sans aucun importeur : `calculateTotalCosts`
 * (lib/element-data-loader.ts) et `calculateTotalTechnoCosts`
 * (data/technos-registry.ts).
 *
 * Sur la donnée d'aujourd'hui les cinq étaient équivalentes — vérifié par
 * exécution sur les 502 technos et 1560 paires (bâtiment × niveau × type ×
 * quantité). Elles divergeaient uniquement sur des entrées que la donnée
 * actuelle n'exerce pas, c'est-à-dire précisément sur ce que l'extraction est
 * susceptible d'introduire :
 *
 *   - good sans `resource`, ou dont `amount` n'est pas un nombre : trois
 *     implémentations produisaient une clé `undefined` ou un montant `NaN`,
 *     une seule les écartait ;
 *   - `resource` non slugifiée (`"Golden Mask"`) : le chemin bâtiment
 *     slugifiait à l'hydratation, le chemin techno non — deux seaux distincts
 *     pour un seul bien ;
 *   - coût imbriqué `{ resources, goods }` donné au chemin plat : les
 *     ressources étaient perdues sans un mot.
 *
 * Ce module retient partout le comportement le plus strict, et accepte les deux
 * formes de coût en une seule passe.
 */

import { slugify } from "@/lib/utils";
import type { Costs } from "@/types/shared";

/**
 * Un coût, dans l'une ou l'autre des deux formes qui coexistent :
 *
 *   plate      `{ coins: 100, goods: [{ resource, amount }] }`  — `Costs`
 *              (technos, niveaux de bâtiment bruts)
 *   imbriquée  `{ resources: { coins: 100 }, goods: [...] }`    — sortie de
 *              l'hydratation (`HydratedBuilding`, ottoman areas, trade posts)
 *
 * `Costs` figure explicitement dans l'union : c'est une `interface`, donc elle
 * ne reçoit pas de signature d'index implicite et n'est pas assignable à
 * `Record<string, unknown>` — contrairement aux types littéraux de
 * l'hydratation, qui le sont.
 */
export type CostsLike = Costs | Record<string, unknown>;

export interface CostEntry {
  costs: CostsLike;
  /** Quantité. Multiplie les ressources ET les goods. Défaut : 1. */
  multiplier?: number;
}

export interface CostTotals {
  /** Ressources non-goods (coins, food, research_points, …). Clés brutes. */
  main: Record<string, number>;
  /** Biens, par clé slugifiée. */
  goods: Map<string, number>;
}

interface RawGood {
  resource?: unknown;
  amount?: unknown;
}

/**
 * Somme une liste de coûts hétérogènes en un total unique.
 *
 * Les clés de `main` sont laissées brutes : n'importe quelle clé numérique
 * inédite venue du game design est agrégée sans avoir à être déclarée nulle
 * part — c'était déjà vrai des cinq implémentations, et c'est conservé.
 *
 * Les clés de `goods` sont slugifiées, pour qu'un même bien ne puisse pas
 * tomber dans deux seaux selon l'écran qui l'agrège.
 */
export function sumCosts(entries: CostEntry[]): CostTotals {
  const totals: CostTotals = { main: {}, goods: new Map() };

  for (const entry of entries) {
    accumulate(totals, entry.costs, entry.multiplier ?? 1);
  }

  return totals;
}

function accumulate(
  totals: CostTotals,
  costs: CostsLike,
  multiplier: number,
): void {
  if (!costs || typeof costs !== "object") return;

  // Unique élargissement de type du module : les deux formes se lisent par clé,
  // et c'est exactement ce que l'union `CostsLike` ne permet pas d'exprimer.
  const bag = costs as Record<string, unknown>;

  // Forme imbriquée — `costs.resources`
  const nested = bag.resources;
  if (nested && typeof nested === "object") {
    for (const [key, value] of Object.entries(nested)) {
      if (typeof value === "number") {
        totals.main[key] = (totals.main[key] ?? 0) + value * multiplier;
      }
    }
  }

  // `costs.goods` — commun aux deux formes
  if (Array.isArray(bag.goods)) {
    for (const good of bag.goods as RawGood[]) {
      addGood(totals, good, multiplier);
    }
  }

  // Forme plate — toute autre clé numérique de premier niveau
  for (const [key, value] of Object.entries(bag)) {
    if (key === "resources" || key === "goods") continue; // déjà traités
    if (typeof value === "number") {
      totals.main[key] = (totals.main[key] ?? 0) + value * multiplier;
    }
  }
}

function addGood(
  totals: CostTotals,
  good: RawGood,
  multiplier: number,
): void {
  // La validation précède la slugification : `slugify("")` vaut `"default"`,
  // une resource vide deviendrait donc un bien nommé « default » au lieu
  // d'être écartée.
  if (!good || typeof good.resource !== "string" || !good.resource) {
    console.warn("⚠️ Invalid good detected in costs:", good);
    return;
  }

  if (typeof good.amount !== "number") {
    console.warn("⚠️ Invalid amount in good:", good);
    return;
  }

  const key = slugify(good.resource);
  totals.goods.set(key, (totals.goods.get(key) ?? 0) + good.amount * multiplier);
}

/**
 * Adaptateur pour les consommateurs qui affichent les biens en liste plutôt
 * qu'en `Map` (les cartes techno). L'ordre est celui d'insertion, comme
 * l'`Array.from(map.entries())` qu'il remplace.
 */
export function toGoodsArray(
  goods: Map<string, number>,
): Array<{ resource: string; amount: number }> {
  return Array.from(goods.entries()).map(([resource, amount]) => ({
    resource,
    amount,
  }));
}
