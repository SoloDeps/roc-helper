import {
  BuildingLevel,
  BuildingProduction,
  BuildingHappiness,
  Costs,
  EraCode,
  EraGoodsMap,
  EraGoods,
} from "@/types/shared";
import {
  ERA_ORDER,
  ERA_GOODS,
  BuildingId,
  getEraForLevel,
  getMaxQtyForBuilding,
  getPrevEra,
} from "@/data/config";

// ─────────────────────────────────────────────────────────────────────────────
// Helpers internes
// ─────────────────────────────────────────────────────────────────────────────

function eraBuildingLevel(level: number): 1 | 2 | 3 {
  return (((level - 1) % 3) + 1) as 1 | 2 | 3;
}

function getGoods(era: EraCode, eraGoodsMap?: EraGoodsMap): EraGoods {
  const goods = eraGoodsMap?.[era] ?? ERA_GOODS[era];
  if (!goods)
    throw new Error(
      `[generateDynamicLevels] Goods manquants pour l'ere "${era}"`,
    );
  return goods;
}

// ─────────────────────────────────────────────────────────────────────────────
// Pattern A — 3 niveaux par ère
// small_home, average_home, rural_farm, domestic_farm…
// ─────────────────────────────────────────────────────────────────────────────

export interface StandardLevelConfig {
  buildingId: BuildingId;
  defaultMaxQty: number;
  goodsAmounts: [number, number, number];
  constructionGoodsAmount: number;
  upgrade: {
    coins: (level: number) => number;
    food: (level: number) => number;
  };
  construction: {
    coins: (level: number) => number;
    food: (level: number) => number;
  };
  level40Upgrade?: {
    coins: number;
    food: number;
    goodsSource: "previous" | "current";
    goodsAmount: number;
    extraGoods: { amount: number; resource: string }[];
  };
  eraGoodsMap?: EraGoodsMap;
  // Formules de production + bonheur pour les niveaux dynamiques (40+)
  productionFormula?: {
    coins?: (level: number) => number;
    workers?: number | ((level: number) => number);
    food?: (level: number) => number;
    goods?: (level: number) => number;
  };
  happinessFormula?: {
    h1: (level: number) => number;
    h2: (level: number) => number;
    h3: (level: number) => number;
  };
}

export function generateStandardLevels(
  config: StandardLevelConfig,
  startLevel: number = 40,
  maxLevel?: number,
): BuildingLevel[] {
  const computedMax = maxLevel ?? ERA_ORDER.length * 3;
  const levels: BuildingLevel[] = [];

  for (let level = startLevel; level <= computedMax; level++) {
    const eraPos = eraBuildingLevel(level);
    const currentEra = getEraForLevel(level);
    const previousEra = getPrevEra(currentEra);
    const goodsEra = eraPos === 1 ? previousEra : currentEra;
    const goodsAmount = config.goodsAmounts[eraPos - 1];

    // ── Upgrade ──────────────────────────────────────────────────────────────
    let upgrade: Costs;

    if (level === 40 && config.level40Upgrade) {
      const l40 = config.level40Upgrade;
      const sourceEra =
        l40.goodsSource === "previous" ? previousEra : currentEra;
      const [g1, g2, g3] = getGoods(sourceEra, config.eraGoodsMap);
      upgrade = {
        coins: l40.coins,
        food: l40.food,
        goods: [
          { amount: l40.goodsAmount, resource: g1 },
          { amount: l40.goodsAmount, resource: g2 },
          { amount: l40.goodsAmount, resource: g3 },
          ...l40.extraGoods,
        ],
      };
    } else {
      const [g1, g2, g3] = getGoods(goodsEra, config.eraGoodsMap);
      upgrade = {
        coins: config.upgrade.coins(level),
        food: config.upgrade.food(level),
        goods: [
          { amount: goodsAmount, resource: g1 },
          { amount: goodsAmount, resource: g2 },
          { amount: goodsAmount, resource: g3 },
        ],
      };
    }

    // ── Construction + max_qty (eraPos === 1 uniquement) ─────────────────────
    let construction: Costs | undefined;
    let max_qty: number | undefined;

    if (eraPos === 1) {
      const [g1, g2, g3] = getGoods(previousEra, config.eraGoodsMap);
      max_qty =
        getMaxQtyForBuilding(currentEra, config.buildingId) ??
        config.defaultMaxQty;
      construction = {
        coins: config.construction.coins(level),
        food: config.construction.food(level),
        goods: [
          { amount: config.constructionGoodsAmount, resource: g1 },
          { amount: config.constructionGoodsAmount, resource: g2 },
          { amount: config.constructionGoodsAmount, resource: g3 },
        ],
      };
    }

    // ── Production ───────────────────────────────────────────────────────────
    let production: BuildingProduction | undefined;
    if (config.productionFormula) {
      const pf = config.productionFormula;
      production = {
        ...(pf.coins !== undefined && { coins: pf.coins(level) }),
        ...(pf.workers !== undefined && {
          workers:
            typeof pf.workers === "function" ? pf.workers(level) : pf.workers,
        }),
        ...(pf.food !== undefined && { food: pf.food(level) }),
        ...(pf.goods !== undefined && { goods: pf.goods(level) }),
      };
    }

    // ── Happiness ─────────────────────────────────────────────────────────────
    let happiness: BuildingHappiness | undefined;
    if (config.happinessFormula) {
      const hf = config.happinessFormula;
      happiness = {
        h1: hf.h1(level),
        h2: hf.h2(level),
        h3: hf.h3(level),
      };
    }

    levels.push({
      level,
      era: currentEra,
      ...(max_qty !== undefined && { max_qty }),
      ...(production !== undefined && { production }),
      ...(happiness !== undefined && { happiness }),
      upgrade,
      ...(construction !== undefined && { construction }),
    });
  }

  return levels;
}

// ─────────────────────────────────────────────────────────────────────────────
// Pattern B — 1 niveau par ère, level = eraIndex × 3, gems only
// luxurious_home, luxurious_farm…
// ─────────────────────────────────────────────────────────────────────────────

export interface LuxuryLevelConfig {
  buildingId: BuildingId;
  defaultMaxQty: number;
  upgrade: { gems: number };
  construction: { gems: (level: number) => number };
}

export function generateLuxuryLevels(
  config: LuxuryLevelConfig,
  startEraIndex: number = 14,
  maxEraIndex?: number,
): BuildingLevel[] {
  const computedMax = maxEraIndex ?? ERA_ORDER.length;
  const levels: BuildingLevel[] = [];

  for (let eraIndex = startEraIndex; eraIndex <= computedMax; eraIndex++) {
    const level = eraIndex * 3;
    const currentEra = ERA_ORDER[eraIndex - 1];
    if (!currentEra) continue;

    const max_qty =
      getMaxQtyForBuilding(currentEra, config.buildingId) ??
      config.defaultMaxQty;

    levels.push({
      level,
      era: currentEra,
      max_qty,
      upgrade: { gems: config.upgrade.gems },
      construction: { gems: config.construction.gems(level) },
    });
  }

  return levels;
}

// ─────────────────────────────────────────────────────────────────────────────
// Pattern C — 1 niveau par ère, level = era_index (pas ×3)
// little/compact/moderate/large/luxurious culture site
// ─────────────────────────────────────────────────────────────────────────────

export interface CultureLevelConfig {
  buildingId: BuildingId;
  defaultMaxQty: number;
  construction: {
    coins?: (level: number) => number;
    food?: (level: number) => number;
    gems?: (level: number) => number;
  };
  upgrade: {
    coins?: (level: number) => number;
    food?: (level: number) => number;
    gems?: number;
  };
  culture_range?: number; // fixe pour tous les niveaux
  culture_bonus?: (level: number) => number; // formule par niveau
}

export function generateCultureLevels(
  config: CultureLevelConfig,
  startEraIndex: number = 14,
  maxEraIndex?: number,
): BuildingLevel[] {
  const computedMax = maxEraIndex ?? ERA_ORDER.length;
  const levels: BuildingLevel[] = [];

  for (let eraIndex = startEraIndex; eraIndex <= computedMax; eraIndex++) {
    const level = eraIndex;
    const currentEra = ERA_ORDER[eraIndex - 1];
    if (!currentEra) continue;

    const max_qty =
      getMaxQtyForBuilding(currentEra, config.buildingId) ??
      config.defaultMaxQty;

    const construction: Costs = {
      ...(config.construction.coins !== undefined && {
        coins: config.construction.coins(level),
      }),
      ...(config.construction.food !== undefined && {
        food: config.construction.food(level),
      }),
      ...(config.construction.gems !== undefined && {
        gems: config.construction.gems(level),
      }),
    };

    const upgrade: Costs = {
      ...(config.upgrade.coins !== undefined && {
        coins: config.upgrade.coins(level),
      }),
      ...(config.upgrade.food !== undefined && {
        food: config.upgrade.food(level),
      }),
      ...(config.upgrade.gems !== undefined && { gems: config.upgrade.gems }),
    };

    levels.push({
      level,
      era: currentEra,
      max_qty,
      ...(config.culture_range !== undefined && {
        culture_range: config.culture_range,
      }),
      ...(config.culture_bonus !== undefined && {
        culture_bonus: config.culture_bonus(level),
      }),
      construction,
      upgrade,
    });
  }

  return levels;
}
