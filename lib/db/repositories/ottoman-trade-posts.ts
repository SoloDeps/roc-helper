"use client";

import { getWikiDB } from "../schema";
import type { OttomanTradePostEntity } from "../schema";
import { slugify } from "@/lib/utils";

const now = () => Date.now();

/**
 * Récupère tous les postes de commerce
 */
export async function getOttomanTradePosts(): Promise<
  OttomanTradePostEntity[]
> {
  const db = getWikiDB();
  return await db.ottomanTradePosts.toArray();
}

/**
 * Récupère un poste de commerce par son ID
 */
export async function getOttomanTradePost(
  id: string,
): Promise<OttomanTradePostEntity | undefined> {
  const db = getWikiDB();
  return await db.ottomanTradePosts.get(id);
}

/**
 * Sauvegarde ou met à jour un poste de commerce
 */
export async function saveOttomanTradePost(
  tradePost: Omit<OttomanTradePostEntity, "updatedAt">,
): Promise<void> {
  const db = getWikiDB();
  await db.ottomanTradePosts.put({
    ...tradePost,
    hidden: tradePost.hidden ?? false,
    updatedAt: now(),
  } as OttomanTradePostEntity);
}

/**
 * Sauvegarde plusieurs postes de commerce en une seule transaction
 */
export async function saveOttomanTradePosts(
  tradePosts: Omit<OttomanTradePostEntity, "updatedAt">[],
): Promise<void> {
  const db = getWikiDB();
  const timestamp = now();

  await db.transaction("rw", db.ottomanTradePosts, async () => {
    for (const tradePost of tradePosts) {
      await db.ottomanTradePosts.put({
        ...tradePost,
        hidden: tradePost.hidden ?? false,
        updatedAt: timestamp,
      } as OttomanTradePostEntity);
    }
  });
}

/**
 * Bascule la visibilité d'un poste de commerce
 */
export async function toggleOttomanTradePostHidden(id: string): Promise<void> {
  const db = getWikiDB();
  const tradePost = await db.ottomanTradePosts.get(id);

  if (!tradePost) return;

  await db.ottomanTradePosts.update(id, {
    hidden: !tradePost.hidden,
    updatedAt: now(),
  });
}

/**
 * Bascule un niveau de poste de commerce et recalcule les coûts
 */
export async function toggleOttomanTradePostLevel(
  id: string,
  level: keyof OttomanTradePostEntity["levels"],
): Promise<void> {
  const db = getWikiDB();
  const tradePost = await db.ottomanTradePosts.get(id);

  if (!tradePost) return;

  // Basculer le niveau
  const updatedLevels = {
    ...tradePost.levels,
    [level]: !tradePost.levels[level],
  };

  // Recalculer les coûts si sourceData existe
  let updatedCosts = tradePost.costs;
  if (tradePost.sourceData) {
    updatedCosts = calculateTradePostCosts(tradePost.sourceData, updatedLevels);
  }

  await db.ottomanTradePosts.update(id, {
    levels: updatedLevels,
    costs: updatedCosts,
    updatedAt: now(),
  });
}

/**
 * Supprime un poste de commerce par son ID
 */
export async function removeOttomanTradePost(id: string): Promise<void> {
  const db = getWikiDB();
  await db.ottomanTradePosts.delete(id);
}

/**
 * Supprime tous les postes de commerce
 */
export async function removeAllOttomanTradePosts(): Promise<void> {
  const db = getWikiDB();
  await db.ottomanTradePosts.clear();
}

/**
 * Cache tous les postes de commerce
 */
export async function hideAllOttomanTradePosts(): Promise<void> {
  const db = getWikiDB();
  const tradePosts = await db.ottomanTradePosts.toArray();
  const timestamp = now();

  await db.ottomanTradePosts.bulkPut(
    tradePosts.map((t) => ({
      ...t,
      hidden: true,
      updatedAt: timestamp,
    })),
  );
}

/**
 * Affiche tous les postes de commerce
 */
export async function showAllOttomanTradePosts(): Promise<void> {
  const db = getWikiDB();
  const tradePosts = await db.ottomanTradePosts.toArray();
  const timestamp = now();

  await db.ottomanTradePosts.bulkPut(
    tradePosts.map((t) => ({
      ...t,
      hidden: false,
      updatedAt: timestamp,
    })),
  );
}

/**
 * Récupère les postes de commerce visibles uniquement
 */
export async function getVisibleOttomanTradePosts(): Promise<
  OttomanTradePostEntity[]
> {
  const db = getWikiDB();
  return await db.ottomanTradePosts.filter((tp) => !tp.hidden).toArray();
}

/**
 * Récupère les postes de commerce cachés uniquement
 */
export async function getHiddenOttomanTradePosts(): Promise<
  OttomanTradePostEntity[]
> {
  const db = getWikiDB();
  return await db.ottomanTradePosts.filter((tp) => tp.hidden).toArray();
}

/**
 * Récupère les postes de commerce triés par zone (area)
 */
export async function getOttomanTradePostsSorted(): Promise<
  OttomanTradePostEntity[]
> {
  const tradePosts = await getOttomanTradePosts();
  return tradePosts.sort((a, b) => a.area - b.area);
}

/**
 * Récupère les postes de commerce d'une zone spécifique
 */
export async function getOttomanTradePostsByArea(
  area: number,
): Promise<OttomanTradePostEntity[]> {
  const db = getWikiDB();
  return await db.ottomanTradePosts.where("area").equals(area).toArray();
}

/**
 * Compte le nombre total de postes de commerce
 */
export async function countOttomanTradePosts(): Promise<number> {
  const db = getWikiDB();
  return await db.ottomanTradePosts.count();
}

/**
 * Compte le nombre de postes de commerce visibles
 */
export async function countVisibleOttomanTradePosts(): Promise<number> {
  const db = getWikiDB();
  return await db.ottomanTradePosts.filter((tp) => !tp.hidden).count();
}

/**
 * Helper: Calcule les coûts d'un poste de commerce basé sur les niveaux NON cochés
 * LOGIQUE INVERSÉE: On affiche TOUS les coûts par défaut, et on retire ceux qui sont cochés (hidden)
 */
function calculateTradePostCosts(
  tradePostData: NonNullable<OttomanTradePostEntity["sourceData"]>,
  checkedLevels: OttomanTradePostEntity["levels"],
): OttomanTradePostEntity["costs"] {
  const costs: OttomanTradePostEntity["costs"] = {
    resources: {},
    goods: [],
  };
  const goodsMap = new Map<string, number>();

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

  const levelMapping: Record<keyof OttomanTradePostEntity["levels"], number> = {
    unlock: 1,
    lvl2: 2,
    lvl3: 3,
    lvl4: 4,
    lvl5: 5,
  };

  // ✅ LOGIQUE INVERSÉE: On traite les niveaux qui ne sont PAS cochés
  Object.entries(checkedLevels).forEach(([levelKey, isChecked]) => {
    // Si le niveau est coché, on le SKIP (on ne l'affiche pas)
    if (isChecked) return;

    const levelNum =
      levelMapping[levelKey as keyof OttomanTradePostEntity["levels"]];
    const levelData = tradePostData.levels?.[levelNum];

    if (!levelData || !Array.isArray(levelData)) return;

    levelData.forEach((item: { resource: string; amount: number }) => {
      const resource = item.resource.toLowerCase();
      const amount = item.amount;

      let normalizedResource = resource;
      if (resource.includes("_eg") || resource.includes("lategothicera")) {
        normalizedResource = slugify(resource);
      }

      if (
        ottomanGoods.includes(resource) ||
        normalizedResource.match(/^(primary|secondary|tertiary)_/i)
      ) {
        const normalized = slugify(resource);
        goodsMap.set(normalized, (goodsMap.get(normalized) || 0) + amount);
      } else {
        costs.resources[resource] =
          ((costs.resources[resource] as number) || 0) + amount;
      }
    });
  });

  costs.goods = Array.from(goodsMap.entries()).map(([type, amount]) => ({
    type,
    amount,
  }));

  return costs;
}

/**
 * Recalcule les coûts de tous les postes de commerce
 * Utile après une modification des données source
 */
export async function recalculateAllTradePostsCosts(): Promise<void> {
  const db = getWikiDB();
  const tradePosts = await db.ottomanTradePosts.toArray();
  const timestamp = now();

  const updated = tradePosts.map((tp) => {
    if (!tp.sourceData) return tp;

    return {
      ...tp,
      costs: calculateTradePostCosts(tp.sourceData, tp.levels),
      updatedAt: timestamp,
    };
  });

  await db.ottomanTradePosts.bulkPut(updated);
}

/**
 * Coche tous les niveaux d'un poste de commerce (cache tous les coûts)
 */
export async function enableAllLevels(id: string): Promise<void> {
  const db = getWikiDB();
  const tradePost = await db.ottomanTradePosts.get(id);

  if (!tradePost) return;

  const allChecked: OttomanTradePostEntity["levels"] = {
    unlock: true,
    lvl2: true,
    lvl3: true,
    lvl4: true,
    lvl5: true,
  };

  let updatedCosts = tradePost.costs;
  if (tradePost.sourceData) {
    updatedCosts = calculateTradePostCosts(tradePost.sourceData, allChecked);
  }

  await db.ottomanTradePosts.update(id, {
    levels: allChecked,
    costs: updatedCosts,
    updatedAt: now(),
  });
}

/**
 * Décoche tous les niveaux sauf unlock (affiche tous les coûts sauf unlock)
 */
export async function resetToUnlockOnly(id: string): Promise<void> {
  const db = getWikiDB();
  const tradePost = await db.ottomanTradePosts.get(id);

  if (!tradePost) return;

  const onlyUnlockChecked: OttomanTradePostEntity["levels"] = {
    unlock: true,
    lvl2: false,
    lvl3: false,
    lvl4: false,
    lvl5: false,
  };

  let updatedCosts = tradePost.costs;
  if (tradePost.sourceData) {
    updatedCosts = calculateTradePostCosts(
      tradePost.sourceData,
      onlyUnlockChecked,
    );
  }

  await db.ottomanTradePosts.update(id, {
    levels: onlyUnlockChecked,
    costs: updatedCosts,
    updatedAt: now(),
  });
}
