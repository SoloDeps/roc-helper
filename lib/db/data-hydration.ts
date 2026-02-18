"use client";

import { getWikiDB } from "./schema";
import {
  getTechnologiesByEra,
  TECHNOLOGY_REGISTRY,
} from "@/data/technos-registry";
import { getBuildingData } from "@/lib/element-data-loader";
import { getAreaData, getAllTradePosts } from "@/lib/ottoman-data-loader";
import { slugify } from "@/lib/utils";
import type { TechnoData, BuildingData } from "@/types/shared";

// ============================================================================
// TYPES HYDRATÉS (avec données complètes)
// ============================================================================

export interface HydratedTechno extends TechnoData {
  era: string; // ✅ Add era for grouping by era in item-list
  hidden: boolean;
  updatedAt?: number;
}

export interface HydratedBuilding {
  // Données statiques
  id: string;
  name: string;
  imageName: string;
  imgLvl: boolean;
  category: string;
  subcategory: string;
  elementId: string;
  type: "construction" | "upgrade";
  era: string;
  level: number;
  maxQty: number;
  costs: {
    resources: Record<string, number>;
    goods: Array<{ resource: string; amount: number }>; // ✅ resource
  };

  // État utilisateur
  quantity: number;
  hidden: boolean;
  updatedAt?: number;
}

export interface HydratedOttomanArea {
  id: string;
  areaIndex: number;
  costs: {
    resources: Record<string, number>;
    goods: Array<{ resource: string; amount: number }>; // ✅ resource
  };
  hidden: boolean;
  updatedAt?: number;
}

export interface HydratedOttomanTradePost {
  id: string;
  name: string;
  area: number;
  resource: string;
  levels: {
    unlock: boolean;
    lvl2: boolean;
    lvl3: boolean;
    lvl4: boolean;
    lvl5: boolean;
  };
  costs: {
    resources: Record<string, number>;
    goods: Array<{ resource: string; amount: number }>; // ✅ resource
  };
  sourceData?: {
    levels: {
      [key: number]: Array<{ resource: string; amount: number }>;
    };
  };
  hidden: boolean;
  updatedAt?: number;
}

// ============================================================================
// TECHNOS - Hydratation
// ============================================================================

/**
 * Récupère les technos d'une ère avec données complètes
 * Fusion : registry (statique) + DB (état utilisateur)
 */
export async function getHydratedTechnos(
  eraId: string,
): Promise<HydratedTechno[]> {
  const db = getWikiDB();
  const staticData = getTechnologiesByEra(eraId);

  // ✅ NOUVEAU FORMAT: tech_eg_0 (au lieu de techno_early_gothic_era_0)
  // Récupérer états utilisateur avec le nouveau préfixe
  const userStates = await db.technos.where("id").startsWith(`tech_`).toArray();

  // Filtrer pour cette ère uniquement (les IDs matchent maintenant tech_[eraAbbr]_[index])
  const eraAbbr = eraId
    .split("_")
    .map((w) => w[0])
    .join(""); // early_gothic_era → eg
  const filteredStates = userStates.filter((s) => {
    const match = s.id.match(/^tech_([a-z]{2})_\d+$/);
    return match && match[1] === eraAbbr;
  });

  const stateMap = new Map(filteredStates.map((s) => [s.id, s]));

  // Hydratation
  return staticData.map((techno) => ({
    ...techno,
    era: eraId, // ✅ Include era for grouping
    hidden: stateMap.get(techno.id)?.hidden ?? false,
    updatedAt: stateMap.get(techno.id)?.updatedAt,
  }));
}

/**
 * Récupère toutes les technos hydratées (tous les états utilisateur)
 */
export async function getAllHydratedTechnos(): Promise<HydratedTechno[]> {
  const db = getWikiDB();
  const userStates = await db.technos.toArray();

  const result: HydratedTechno[] = [];

  for (const state of userStates) {
    // ✅ NOUVEAU FORMAT: tech_eg_0
    // Extraire l'abréviation de l'ère depuis l'ID
    const match = state.id.match(/^tech_([a-z]{2})_\d+$/);
    if (!match) continue;

    const eraAbbr = match[1]; // "eg", "lg", etc.

    // Trouver l'eraId complet depuis l'abréviation
    // On doit parcourir le registry pour trouver quelle ère a cette techno
    const allEraIds = Object.keys(TECHNOLOGY_REGISTRY);
    let techno: TechnoData | undefined;
    let foundEraId: string | undefined;

    for (const eraId of allEraIds) {
      const staticData = getTechnologiesByEra(eraId);
      techno = staticData.find((t) => t.id === state.id);
      if (techno) {
        foundEraId = eraId; // ✅ Capture the eraId
        break;
      }
    }

    if (techno && foundEraId) {
      result.push({
        ...techno,
        era: foundEraId, // ✅ Include era
        hidden: state.hidden,
        updatedAt: state.updatedAt,
      });
    }
  }

  return result;
}

// ============================================================================
// BUILDINGS - Hydratation
// ============================================================================

/**
 * Récupère un building avec données complètes
 */
export async function getHydratedBuilding(
  id: string,
): Promise<HydratedBuilding | null> {
  const db = getWikiDB();
  const userState = await db.buildings.get(id);

  if (!userState) return null;

  // Parser l'ID pour extraire les infos
  const parts = id.split("_");
  // Format: {category}_{elementId}_{type}_{era}_{level}

  const level = parseInt(parts[parts.length - 1]);
  const era = parts[parts.length - 2];
  const type = parts[parts.length - 3] as "construction" | "upgrade";
  const category = parts[0];

  // Reconstruire elementId
  const elementId = parts.slice(1, -3).join("_");

  // Récupérer données statiques
  const buildingData = getBuildingData(`${category}_${elementId}`);
  if (!buildingData) return null;

  const levelData = buildingData.levels.find(
    (l) => l.level === level && l.era === era,
  );
  if (!levelData) return null;

  const costs = levelData[type];
  if (!costs) return null;

  // Parser costs
  const resources: Record<string, number> = {};
  const goods: Array<{ resource: string; amount: number }> = []; // ✅ resource

  Object.entries(costs).forEach(([key, value]) => {
    if (key === "goods" && Array.isArray(value)) {
      value.forEach((g: { resource: string; amount: number }) => {
        const resourceName = g.resource;
        if (resourceName) {
          goods.push({
            resource: slugify(resourceName), // ✅ resource
            amount: g.amount,
          });
        }
      });
    } else if (typeof value === "number") {
      resources[key] = value;
    }
  });

  return {
    id,
    name: buildingData.name,
    imageName: buildingData.imageName || elementId,
    imgLvl: buildingData.imageName?.includes("_Lv") ?? false,
    category,
    subcategory: buildingData.subcategory || "unknown",
    elementId,
    type,
    era,
    level,
    maxQty: levelData.max_qty || 40,
    costs: { resources, goods },
    quantity: userState.quantity,
    hidden: userState.hidden,
    updatedAt: userState.updatedAt,
  };
}

/**
 * Récupère tous les buildings hydratés
 */
export async function getAllHydratedBuildings(): Promise<HydratedBuilding[]> {
  const db = getWikiDB();
  const userStates = await db.buildings.toArray();

  const result: HydratedBuilding[] = [];

  for (const state of userStates) {
    const hydrated = await getHydratedBuilding(state.id);
    if (hydrated) {
      result.push(hydrated);
    }
  }

  return result;
}

// ============================================================================
// OTTOMAN AREAS - Hydratation
// ============================================================================

export async function getHydratedOttomanArea(
  areaIndex: number,
): Promise<HydratedOttomanArea | null> {
  const db = getWikiDB();
  const id = `ottoman_area_${areaIndex}`;
  const userState = await db.ottomanAreas.get(id);

  const areaData = getAreaData(areaIndex);
  if (!areaData) return null;

  // Parser costs
  const resources: Record<string, number> = {};
  const goods: Array<{ resource: string; amount: number }> = []; // ✅ resource

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

  areaData.forEach((item) => {
    const resourceName = item.resource.toLowerCase();
    if (ottomanGoods.includes(resourceName)) {
      goods.push({ resource: slugify(resourceName), amount: item.amount }); // ✅ resource
    } else {
      resources[resourceName] = item.amount;
    }
  });

  return {
    id,
    areaIndex,
    costs: { resources, goods },
    hidden: userState?.hidden ?? false,
    updatedAt: userState?.updatedAt,
  };
}

export async function getAllHydratedOttomanAreas(): Promise<
  HydratedOttomanArea[]
> {
  const db = getWikiDB();
  const userStates = await db.ottomanAreas.toArray();

  const result: HydratedOttomanArea[] = [];

  for (const state of userStates) {
    const match = state.id.match(/^ottoman_area_(\d+)$/);
    if (!match) continue;

    const areaIndex = parseInt(match[1]);
    const hydrated = await getHydratedOttomanArea(areaIndex);

    if (hydrated) {
      result.push(hydrated);
    }
  }

  return result;
}

// ============================================================================
// OTTOMAN TRADE POSTS - Hydratation
// ============================================================================

/**
 * Helper: Calcule les coûts d'un poste de commerce basé sur les niveaux NON cochés
 */
function calculateTradePostCosts(
  tradePostData: {
    levels: { [key: number]: Array<{ resource: string; amount: number }> };
  },
  checkedLevels: HydratedOttomanTradePost["levels"],
): HydratedOttomanTradePost["costs"] {
  const costs: HydratedOttomanTradePost["costs"] = {
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

  const levelMapping: Record<keyof HydratedOttomanTradePost["levels"], number> =
    {
      unlock: 1,
      lvl2: 2,
      lvl3: 3,
      lvl4: 4,
      lvl5: 5,
    };

  // LOGIQUE INVERSÉE: On traite les niveaux qui ne sont PAS cochés
  Object.entries(checkedLevels).forEach(([levelKey, isChecked]) => {
    if (isChecked) return;

    const levelNum =
      levelMapping[levelKey as keyof HydratedOttomanTradePost["levels"]];
    const levelData = tradePostData.levels?.[levelNum];

    if (!levelData || !Array.isArray(levelData)) return;

    levelData.forEach((item: { resource: string; amount: number }) => {
      const resourceName = item.resource.toLowerCase();
      const amount = item.amount;

      let normalizedResource = resourceName;
      if (
        resourceName.includes("_eg") ||
        resourceName.includes("lategothicera")
      ) {
        normalizedResource = slugify(resourceName);
      }

      if (
        ottomanGoods.includes(resourceName) ||
        normalizedResource.match(/^(primary|secondary|tertiary)_/i)
      ) {
        const normalized = slugify(resourceName);
        goodsMap.set(normalized, (goodsMap.get(normalized) || 0) + amount);
      } else {
        costs.resources[resourceName] =
          ((costs.resources[resourceName] as number) || 0) + amount;
      }
    });
  });

  costs.goods = Array.from(goodsMap.entries()).map(([resource, amount]) => ({
    resource, // ✅ resource
    amount,
  }));

  return costs;
}

export async function getHydratedOttomanTradePost(
  id: string,
): Promise<HydratedOttomanTradePost | null> {
  const db = getWikiDB();
  const userState = await db.ottomanTradePosts.get(id);

  // Extraire le nom du trade post depuis l'ID
  const match = id.match(/^ottoman_tp_(.+)$/);
  if (!match) return null;

  const nameSlug = match[1];

  // Récupérer les données statiques
  const allTradePosts = getAllTradePosts();
  const tradePostData = allTradePosts.find(
    (tp) => slugify(tp.name) === nameSlug,
  );

  if (!tradePostData) return null;

  // Default levels: all unchecked (false = show costs)
  const levels = userState?.levels ?? {
    unlock: false,
    lvl2: false,
    lvl3: false,
    lvl4: false,
    lvl5: false,
  };

  const sourceData = {
    levels: tradePostData.levels as unknown as {
      [key: number]: Array<{ resource: string; amount: number }>;
    },
  };

  const costs = calculateTradePostCosts(sourceData, levels);

  return {
    id,
    name: tradePostData.name,
    area: tradePostData.area,
    resource: tradePostData.resource,
    levels,
    costs,
    sourceData,
    hidden: userState?.hidden ?? false,
    updatedAt: userState?.updatedAt,
  };
}

export async function getAllHydratedOttomanTradePosts(): Promise<
  HydratedOttomanTradePost[]
> {
  const db = getWikiDB();
  const userStates = await db.ottomanTradePosts.toArray();

  const result: HydratedOttomanTradePost[] = [];

  for (const state of userStates) {
    const hydrated = await getHydratedOttomanTradePost(state.id);
    if (hydrated) {
      result.push(hydrated);
    }
  }

  return result;
}
