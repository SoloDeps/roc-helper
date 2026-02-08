/// <reference lib="webworker" />

import type {
  BuildingEntity,
  TechnoEntity,
  OttomanAreaEntity,
  OttomanTradePostEntity,
} from "../db/schema";

interface WorkerInput {
  buildings: BuildingEntity[];
  technos: TechnoEntity[];
  areas: OttomanAreaEntity[];
  tradePosts: OttomanTradePostEntity[];
}

interface ResourceTotals {
  main: Record<string, number>;
  goods: [string, number][]; // Array instead of Map for serialization
}

self.onmessage = (e: MessageEvent<WorkerInput>) => {
  const { buildings, technos, areas, tradePosts } = e.data;

  const totals: ResourceTotals = {
    main: {},
    goods: [],
  };

  const goodsMap = new Map<string, number>();

  // Process buildings
  for (const building of buildings) {
    if (building.hidden) continue;
    accumulateCosts(totals.main, goodsMap, building.costs, building.quantity);
  }

  // Process technos
  for (const techno of technos) {
    if (techno.hidden) continue;
    accumulateCosts(totals.main, goodsMap, techno.costs, 1);
  }

  // Process areas
  for (const area of areas) {
    if (area.hidden) continue;
    accumulateCosts(totals.main, goodsMap, area.costs, 1);
  }

  // Process trade posts
  for (const tp of tradePosts) {
    if (tp.hidden) continue;
    accumulateCosts(totals.main, goodsMap, tp.costs, 1);
  }

  totals.goods = Array.from(goodsMap.entries());

  self.postMessage(totals);
};

function accumulateCosts(
  main: Record<string, number>,
  goodsMap: Map<string, number>,
  costs: Record<string, number | Array<{ type: string; amount: number }>>,
  multiplier: number,
) {
  for (const [key, value] of Object.entries(costs)) {
    if (key === "goods" && Array.isArray(value)) {
      for (const good of value) {
        goodsMap.set(
          good.type,
          (goodsMap.get(good.type) ?? 0) + good.amount * multiplier,
        );
      }
    } else if (typeof value === "number") {
      main[key] = (main[key] ?? 0) + value * multiplier;
    }
  }
}
