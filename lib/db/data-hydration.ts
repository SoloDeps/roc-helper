"use client";

import { getWikiDB, areaIndexToId } from "./schema";
import {
  getTechnologiesByEra,
  TECHNOLOGY_REGISTRY,
} from "@/data/technos-registry";
import { getBuildingData } from "@/lib/element-data-loader";
import {
  getAreaData,
  getTradePostByIndex,
} from "@/lib/ottoman-data-loader";
import { getEraAbbr } from "@/lib/era-mappings";
import { slugify } from "@/lib/utils";
import { buildingsAbbr } from "@/lib/constants";
import type { TechnoData } from "@/types/shared";

// ============================================================================
// TYPES HYDRATÉS
// ============================================================================

export interface HydratedTechno extends TechnoData {
  era: string;
  hidden: boolean; // calculator — exclure du total
  cp: boolean; // research tree — techno complétée
}

export interface HydratedBuilding {
  id: string;
  name: string;
  accordionName: string;
  /** true si c'est un workshop à position sans sélection du joueur */
  isUnresolvedWorkshop: boolean;
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
  levels: {
    unlock: boolean;
    lvl2: boolean;
    lvl3: boolean;
    lvl4: boolean;
    lvl5: boolean;
    lvl6: boolean;
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
    return {
      ...techno,
      era: eraId,
      hidden: state ? !!state.hidden : false,
      cp: state ? !!state.cp : false,
    };
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
      result.push({
        ...techno,
        era: foundEraId,
        hidden: !!state.hidden,
        cp: !!state.cp,
      });
    }
  }

  return result;
}

// ============================================================================
// BUILDINGS
// ============================================================================

// ── Workshop position resolution ──────────────────────────────────────────
// Les IDs de workshops basés sur la position ont la forme :
// `capital_primary_workshop_construction_BA_1`
// On doit les résoudre vers le workshop réel sélectionné par le joueur.

const WORKSHOP_STORAGE_KEY = "local:buildingSelections";
const WORKSHOP_PRIORITIES = ["primary", "secondary", "tertiary"] as const;

function loadWorkshopSelectionsHydration(): string[][] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(WORKSHOP_STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Si l'elementId est `primary_workshop`, `secondary_workshop` ou `tertiary_workshop`,
 * résout vers le vrai buildingId sélectionné par le joueur pour cette ère.
 * Ex: "primary_workshop" + era "BA" → "tailor" (si le joueur a choisi Tailor en primary)
 * Sinon retourne l'elementId tel quel.
 */
function resolveWorkshopElementId(elementId: string, era: string): string {
  const WORKSHOP_SUFFIX = "_workshop";
  if (!elementId.endsWith(WORKSHOP_SUFFIX)) return elementId;

  const priority = elementId.slice(
    0,
    -WORKSHOP_SUFFIX.length,
  ) as (typeof WORKSHOP_PRIORITIES)[number];
  if (!WORKSHOP_PRIORITIES.includes(priority)) return elementId;

  const priorityIndex = WORKSHOP_PRIORITIES.indexOf(priority);

  // Trouver le groupe d'ères correspondant
  const groupIndex = buildingsAbbr.findIndex((group) =>
    group.abbreviations.some((abbr) => abbr === era.toUpperCase()),
  );
  if (groupIndex < 0) return elementId;

  const selections = loadWorkshopSelectionsHydration();
  const selectedBuilding = selections[groupIndex]?.[priorityIndex];

  if (!selectedBuilding) {
    // Pas de sélection → utilise le workshop par défaut pour les données
    // mais affiche "Workshop {ERA}" comme nom
    const defaultBuilding = buildingsAbbr[groupIndex]?.buildings[priorityIndex];
    if (!defaultBuilding) return elementId;
    return defaultBuilding.toLowerCase().replace(/\s+/g, "_");
  }

  return selectedBuilding.toLowerCase().replace(/\s+/g, "_");
}

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

  // Résoudre vers le vrai workshop pour récupérer les données/coûts
  const resolvedElementId = resolveWorkshopElementId(elementId, era);
  const buildingData = getBuildingData(`${category}_${resolvedElementId}`);
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

  // Noms pour les workshops à position
  const isPositionWorkshop = WORKSHOP_PRIORITIES.some(
    (p) => elementId === `${p}_workshop`,
  );
  let cardName = buildingData.name;
  let accordionName = buildingData.name;

  if (isPositionWorkshop) {
    const priority = elementId.slice(
      0,
      -"_workshop".length,
    ) as (typeof WORKSHOP_PRIORITIES)[number];
    const priorityIndex = WORKSHOP_PRIORITIES.indexOf(priority);
    const groupIndex = buildingsAbbr.findIndex((group) =>
      group.abbreviations.some((abbr) => abbr === era.toUpperCase()),
    );
    const selections = loadWorkshopSelectionsHydration();
    const selectedBuilding = selections[groupIndex]?.[priorityIndex];

    // Accordion : toujours "Primary Workshop" / "Secondary Workshop" / "Tertiary Workshop"
    accordionName = `${priority.charAt(0).toUpperCase()}${priority.slice(1)} Workshop`;

    // Card : nom du workshop sélectionné, ou "Workshop {ERA}" si pas de sélection
    cardName = selectedBuilding ? selectedBuilding : `Workshop ${era}`;
  }

  const isUnresolvedWorkshop =
    isPositionWorkshop &&
    (() => {
      const priority = elementId.slice(
        0,
        -"_workshop".length,
      ) as (typeof WORKSHOP_PRIORITIES)[number];
      const priorityIndex = WORKSHOP_PRIORITIES.indexOf(priority);
      const groupIndex = buildingsAbbr.findIndex((group) =>
        group.abbreviations.some((abbr) => abbr === era.toUpperCase()),
      );
      const selections = loadWorkshopSelectionsHydration();
      return !selections[groupIndex]?.[priorityIndex];
    })();

  return {
    id,
    name: cardName,
    accordionName,
    isUnresolvedWorkshop,
    imageName: buildingData.imageName || resolvedElementId,
    imgLvl: buildingData.imageName?.includes("_Lv") ?? false,
    category,
    subcategory: buildingData.subcategory || "unknown",
    elementId: resolvedElementId,
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
      lvl6: 6,
    };

  Object.entries(checkedLevels).forEach(([levelKey, isChecked]) => {
    if (isChecked) return;
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

  const tradePostIndex = parseInt(match[1]);
  const tradePostData = getTradePostByIndex(tradePostIndex);
  if (!tradePostData) return null;

  const rawLevels = userState?.levels ?? {
    unlock: 0,
    lvl2: 0,
    lvl3: 0,
    lvl4: 0,
    lvl5: 0,
    lvl6: 0,
  };
  const levels: HydratedOttomanTradePost["levels"] = {
    unlock: !!rawLevels.unlock,
    lvl2: !!rawLevels.lvl2,
    lvl3: !!rawLevels.lvl3,
    lvl4: !!rawLevels.lvl4,
    lvl5: !!rawLevels.lvl5,
    lvl6: !!rawLevels.lvl6,
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
