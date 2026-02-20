"use client";

import {
  HydratedBuilding,
  HydratedOttomanArea,
  HydratedOttomanTradePost,
  HydratedTechno,
} from "@/lib/db/data-hydration";

export interface ResourceTotals {
  main: Record<string, number>;
  goods: Map<string, number>;
  byEra: Map<string, Map<string, number>>;
  byCity: Map<string, Map<string, number>>;
}

export function calculateTotalCosts(
  buildings: HydratedBuilding[],
  technos: HydratedTechno[],
  areas: HydratedOttomanArea[],
  tradePosts: HydratedOttomanTradePost[],
): ResourceTotals {
  const totals: ResourceTotals = {
    main: {},
    goods: new Map(),
    byEra: new Map(),
    byCity: new Map(),
  };

  // Buildings
  for (const building of buildings) {
    if (building.hidden) continue;
    accumulateCosts(totals, building.costs, building.quantity);
  }

  // Technos
  for (const techno of technos) {
    if (techno.hidden) continue;
    accumulateCosts(totals, techno.costs, 1);
  }

  // Areas
  for (const area of areas) {
    if (area.hidden) continue;
    accumulateCosts(totals, area.costs, 1);
  }

  // Trade Posts
  for (const tp of tradePosts) {
    if (tp.hidden) continue;
    accumulateCosts(totals, tp.costs, 1);
  }

  return totals;
}

function accumulateCosts(
  totals: ResourceTotals,
  costs: Record<string, any>,
  multiplier: number,
) {
  // Traiter costs.resources (coins, food, etc.)
  if (costs.resources && typeof costs.resources === "object") {
    for (const [key, value] of Object.entries(costs.resources)) {
      if (typeof value === "number") {
        totals.main[key] = (totals.main[key] ?? 0) + value * multiplier;
      }
    }
  }

  // ✅ Traiter costs.goods avec format { resource: "...", amount: ... }
  if (costs.goods && Array.isArray(costs.goods)) {
    for (const good of costs.goods) {
      // ✅ Protection: vérifier que resource existe
      if (!good.resource || typeof good.resource !== "string") {
        console.warn("⚠️ Invalid good detected in costs:", good);
        continue;
      }

      if (typeof good.amount !== "number") {
        console.warn("⚠️ Invalid amount in good:", good);
        continue;
      }

      const current = totals.goods.get(good.resource) ?? 0;
      totals.goods.set(good.resource, current + good.amount * multiplier);
    }
  }

  // Fallback: traiter les anciennes structures plates
  for (const [key, value] of Object.entries(costs)) {
    if (key === "resources" || key === "goods") continue; // Déjà traités ci-dessus

    if (key === "goods" && Array.isArray(value)) {
      for (const good of value) {
        if (!good.resource || typeof good.resource !== "string") continue;

        const current = totals.goods.get(good.resource) ?? 0;
        totals.goods.set(good.resource, current + good.amount * multiplier);
      }
    } else if (typeof value === "number") {
      totals.main[key] = (totals.main[key] ?? 0) + value * multiplier;
    }
  }
}

export function groupGoodsByEra(
  goods: Map<string, number>,
  userSelections: string[][],
): Map<string, Map<string, number>> {
  const byEra = new Map<string, Map<string, number>>();

  goods.forEach((amount, resource) => {
    // ✅ Protection: vérifier que resource est valide
    if (!resource || typeof resource !== "string") {
      console.warn("⚠️ Invalid good resource in grouping:", resource);
      return;
    }

    const match = resource.match(/^(primary|secondary|tertiary)_([a-z]{2})$/i);

    if (match) {
      const [, priority, era] = match;
      const eraKey = era.toUpperCase();

      if (!byEra.has(eraKey)) {
        byEra.set(eraKey, new Map());
      }

      byEra.get(eraKey)!.set(resource, amount);
    }
  });

  return byEra;
}

export function groupGoodsByCity(
  goods: Map<string, number>,
): Map<string, Map<string, number>> {
  const byCity = new Map<string, Map<string, number>>();

  const ottomanGoods = [
    "wheat",
    "pomegranate",
    "confection",
    "syrup",
    "mohair",
    "apricot",
    "tea",
    "brocade",
  ];

  goods.forEach((amount, resource) => {
    // ✅ Protection: vérifier que resource est valide
    if (!resource || typeof resource !== "string") {
      console.warn("⚠️ Invalid good resource in city grouping:", resource);
      return;
    }

    if (ottomanGoods.includes(resource.toLowerCase())) {
      if (!byCity.has("OTTOMAN")) {
        byCity.set("OTTOMAN", new Map());
      }
      byCity.get("OTTOMAN")!.set(resource, amount);
    }
  });

  return byCity;
}
