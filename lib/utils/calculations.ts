"use client";

import type {
  BuildingEntity,
  TechnoEntity,
  OttomanAreaEntity,
  OttomanTradePostEntity,
} from "@/lib/db/schema";

export interface ResourceTotals {
  main: Record<string, number>;
  goods: Map<string, number>;
  byEra: Map<string, Map<string, number>>;
  byCity: Map<string, Map<string, number>>;
}

export function calculateTotalCosts(
  buildings: BuildingEntity[],
  technos: TechnoEntity[],
  areas: OttomanAreaEntity[],
  tradePosts: OttomanTradePostEntity[],
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
  costs: Record<string, number | Array<{ type: string; amount: number }>>,
  multiplier: number,
) {
  for (const [key, value] of Object.entries(costs)) {
    if (key === "goods" && Array.isArray(value)) {
      for (const good of value) {
        const current = totals.goods.get(good.type) ?? 0;
        totals.goods.set(good.type, current + good.amount * multiplier);
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

  goods.forEach((amount, type) => {
    const match = type.match(/^(primary|secondary|tertiary)_([a-z]{2})$/i);

    if (match) {
      const [, priority, era] = match;
      const eraKey = era.toUpperCase();

      if (!byEra.has(eraKey)) {
        byEra.set(eraKey, new Map());
      }

      byEra.get(eraKey)!.set(type, amount);
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

  goods.forEach((amount, type) => {
    if (ottomanGoods.includes(type.toLowerCase())) {
      if (!byCity.has("OTTOMAN")) {
        byCity.set("OTTOMAN", new Map());
      }
      byCity.get("OTTOMAN")!.set(type, amount);
    }
  });

  return byCity;
}
