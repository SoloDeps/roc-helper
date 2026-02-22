"use client";

import { getWikiDB, areaIndexToId } from "./schema";
import {
  getTechnologiesByEra,
  TECHNOLOGY_REGISTRY,
} from "@/data/technos-registry";
import { getBuildingData } from "@/lib/element-data-loader";
import {
  getAreaData,
  getAllTradePosts,
  getTradePostByIndex,
} from "@/lib/ottoman-data-loader";
import { getEraAbbr } from "@/lib/era-mappings";
import { slugify } from "@/lib/utils";
import type { TechnoData } from "@/types/shared";

// ============================================================================
// TYPES HYDRATÉS
// ============================================================================

export interface HydratedTechno extends TechnoData {
  era: string;
  hidden: boolean;
}

export interface HydratedBuilding {
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
    goods: Array<{ resource: string; amount: number }>;
  };
  quantity: number;
  hidden: boolean;
}

export interface HydratedOttomanArea {
  id: string;
  areaIndex: number;
  costs: {
    resources: Record<string, number>;
    goods: Array<{ resource: string; amount: number }>;
  };
  hidden: boolean;
}

export interface HydratedOttomanTradePost {
  id: string;
  name: string;
  area: number;
  resource: string;
  // levels exposés en boolean aux composants (converti depuis 0|1)
  levels: {
    unlock: boolean;
    lvl2: boolean;
    lvl3: boolean;
    lvl4: boolean;
    lvl5: boolean;
  };
  costs: {
    resources: Record<string, number>;
    goods: Array<{ resource: string; amount: number }>;
  };
  sourceData?: {
    levels: { [key: number]: Array<{ resource: string; amount: number }> };
  };
  hidden: boolean;
}

// ============================================================================
// TECHNOS
// ============================================================================

export async function getHydratedTechnos(
  eraId: string,
): Promise<HydratedTechno[]> {
  const db = getWikiDB();
  const staticData = getTechnologiesByEra(eraId);
  const eraAbbr = getEraAbbr(eraId);
  const userStates = await db.technos
    .where("id")
    .startsWith(`${eraAbbr}_`)
    .toArray();
  const stateMap = new Map(userStates.map((s) => [s.id, s]));

  return staticData.map((techno) => {
    const state = stateMap.get(techno.id);
    return { ...techno, era: eraId, hidden: state ? !!state.hidden : false };
  });
}

export async function getAllHydratedTechnos(): Promise<HydratedTechno[]> {
  const db = getWikiDB();
  const userStates = await db.technos.toArray();
  const result: HydratedTechno[] = [];

  for (const state of userStates) {
    if (!state.id.match(/^([a-z]{2})_(\d+)$/)) continue;
    let techno: TechnoData | undefined;
    let foundEraId: string | undefined;

    for (const eraId of Object.keys(TECHNOLOGY_REGISTRY)) {
      techno = getTechnologiesByEra(eraId).find((t) => t.id === state.id);
      if (techno) {
        foundEraId = eraId;
        break;
      }
    }

    if (techno && foundEraId) {
      result.push({ ...techno, era: foundEraId, hidden: !!state.hidden });
    }
  }

  return result;
}

// ============================================================================
// BUILDINGS
// ============================================================================

export async function getHydratedBuilding(
  id: string,
): Promise<HydratedBuilding | null> {
  const db = getWikiDB();
  const userState = await db.buildings.get(id);
  if (!userState) return null;

  const parts = id.split("_");
  const level = parseInt(parts[parts.length - 1]);
  const era = parts[parts.length - 2];
  const type = parts[parts.length - 3] as "construction" | "upgrade";
  const category = parts[0];
  const elementId = parts.slice(1, -3).join("_");

  const buildingData = getBuildingData(`${category}_${elementId}`);
  if (!buildingData) return null;

  const levelData = buildingData.levels.find(
    (l) => l.level === level && l.era === era,
  );
  if (!levelData) return null;

  const costs = levelData[type];
  if (!costs) return null;

  const resources: Record<string, number> = {};
  const goods: Array<{ resource: string; amount: number }> = [];

  Object.entries(costs).forEach(([key, value]) => {
    if (key === "goods" && Array.isArray(value)) {
      value.forEach((g: { resource: string; amount: number }) => {
        if (g.resource)
          goods.push({ resource: slugify(g.resource), amount: g.amount });
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
    quantity: userState.qty ?? 1,
    hidden: !!userState.hidden,
  };
}

export async function getAllHydratedBuildings(): Promise<HydratedBuilding[]> {
  const db = getWikiDB();
  const userStates = await db.buildings.toArray();
  const result: HydratedBuilding[] = [];
  for (const state of userStates) {
    const hydrated = await getHydratedBuilding(state.id);
    if (hydrated) result.push(hydrated);
  }
  return result;
}

// ============================================================================
// OTTOMAN AREAS
// ============================================================================

export async function getHydratedOttomanArea(
  areaIndex: number,
): Promise<HydratedOttomanArea | null> {
  const db = getWikiDB();
  const id = areaIndexToId(areaIndex);
  const userState = await db.ottomanAreas.get(id);

  const areaData = getAreaData(areaIndex);
  if (!areaData) return null;

  const resources: Record<string, number> = {};
  const goods: Array<{ resource: string; amount: number }> = [];
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
      goods.push({ resource: slugify(resourceName), amount: item.amount });
    } else {
      resources[resourceName] = item.amount;
    }
  });

  return {
    id,
    areaIndex,
    costs: { resources, goods },
    hidden: userState ? !!userState.hidden : false,
  };
}

export async function getAllHydratedOttomanAreas(): Promise<
  HydratedOttomanArea[]
> {
  const db = getWikiDB();
  const userStates = await db.ottomanAreas.toArray();
  const result: HydratedOttomanArea[] = [];

  for (const state of userStates) {
    const match = state.id.match(/^oa_(\d+)$/);
    if (!match) continue;
    const hydrated = await getHydratedOttomanArea(parseInt(match[1]));
    if (hydrated) result.push(hydrated);
  }

  return result;
}

// ============================================================================
// OTTOMAN TRADE POSTS
// ============================================================================

function calculateTradePostCosts(
  tradePostData: {
    levels: { [key: number]: Array<{ resource: string; amount: number }> };
  },
  //  checkedLevels en boolean (déjà converti depuis 0|1 avant appel)
  checkedLevels: HydratedOttomanTradePost["levels"],
): HydratedOttomanTradePost["costs"] {
  const costs: HydratedOttomanTradePost["costs"] = { resources: {}, goods: [] };
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

  Object.entries(checkedLevels).forEach(([levelKey, isChecked]) => {
    if (isChecked) return; // niveau déjà complété → exclure du calcul
    const levelNum =
      levelMapping[levelKey as keyof HydratedOttomanTradePost["levels"]];
    const levelData = tradePostData.levels?.[levelNum];
    if (!levelData || !Array.isArray(levelData)) return;

    levelData.forEach((item) => {
      const resourceName = item.resource.toLowerCase();
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
        goodsMap.set(normalized, (goodsMap.get(normalized) || 0) + item.amount);
      } else {
        costs.resources[resourceName] =
          ((costs.resources[resourceName] as number) || 0) + item.amount;
      }
    });
  });

  costs.goods = Array.from(goodsMap.entries()).map(([resource, amount]) => ({
    resource,
    amount,
  }));
  return costs;
}

export async function getHydratedOttomanTradePost(
  id: string,
): Promise<HydratedOttomanTradePost | null> {
  const db = getWikiDB();
  const userState = await db.ottomanTradePosts.get(id);
  const match = id.match(/^otp_(\d+)$/);
  if (!match) return null;

  const allTradePosts = getAllTradePosts();
  const tradePostIndex = parseInt(match[1]);
  const tradePostData = getTradePostByIndex(tradePostIndex);
  if (!tradePostData) return null;

  //  Convertir levels 0|1 → boolean pour les composants
  const rawLevels = userState?.levels ?? {
    unlock: 0,
    lvl2: 0,
    lvl3: 0,
    lvl4: 0,
    lvl5: 0,
  };
  const levels: HydratedOttomanTradePost["levels"] = {
    unlock: !!rawLevels.unlock,
    lvl2: !!rawLevels.lvl2,
    lvl3: !!rawLevels.lvl3,
    lvl4: !!rawLevels.lvl4,
    lvl5: !!rawLevels.lvl5,
  };

  const sourceData = {
    levels: tradePostData.levels as unknown as {
      [key: number]: Array<{ resource: string; amount: number }>;
    },
  };

  return {
    id,
    name: tradePostData.name,
    area: tradePostData.area,
    resource: tradePostData.resource,
    levels,
    costs: calculateTradePostCosts(sourceData, levels),
    sourceData,
    hidden: userState ? !!userState.hidden : false,
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
    if (hydrated) result.push(hydrated);
  }

  return result;
}
