"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getWikiDB } from "@/lib/db/schema";
import type {
  BuildingEntity,
  TechnoEntity,
  OttomanAreaEntity,
  OttomanTradePostEntity,
} from "@/lib/db/schema";
import {
  toggleHideAllBuildings,
  toggleHideAllTechnosByEra,
  toggleHideAllOttomanAreas,
  toggleHideAllOttomanTradePosts,
} from "@/lib/db/hide-show-utils";

// ============================================================================
// QUERY KEYS
// ============================================================================

export const queryKeys = {
  buildings: ["buildings"] as const,
  technos: ["technos"] as const,
  ottomanAreas: ["ottomanAreas"] as const,
  ottomanTradePosts: ["ottomanTradePosts"] as const,
};

// ============================================================================
// BUILDINGS - Reactive Queries
// ============================================================================

/**
 * Get all buildings with live updates
 */
export function useBuildings() {
  return useLiveQuery(async () => {
    const db = getWikiDB();
    return await db.buildings.orderBy("createdAt").reverse().toArray();
  }, []);
}

/**
 * Get visible buildings only
 */
export function useVisibleBuildings() {
  return useLiveQuery(async () => {
    const db = getWikiDB();
    return await db.buildings.where("hidden").equals(0).toArray();
  }, []);
}

/**
 * Get building by ID
 */
export function useBuilding(id: string | undefined) {
  return useLiveQuery(async () => {
    if (!id) return null;
    const db = getWikiDB();
    return await db.buildings.get(id);
  }, [id]);
}

/**
 * Count total buildings
 */
export function useBuildingsCount() {
  return useLiveQuery(async () => {
    const db = getWikiDB();
    return await db.buildings.count();
  }, []);
}

// ============================================================================
// BUILDINGS - Mutations
// ============================================================================

/**
 * Add a new building
 */
export function useAddBuilding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (building: BuildingEntity) => {
      const db = getWikiDB();
      await db.buildings.add(building);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.buildings });
    },
  });
}

/**
 * Update building quantity
 */
export function useUpdateBuildingQuantity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      const db = getWikiDB();
      const building = await db.buildings.get(id);

      if (!building) {
        throw new Error("Building not found");
      }

      const clampedQuantity = Math.max(1, Math.min(building.maxQty, quantity));

      await db.buildings.update(id, {
        quantity: clampedQuantity,
        updatedAt: Date.now(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.buildings });
    },
  });
}

/**
 * Toggle building hidden state
 */
export function useToggleBuildingHidden() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const db = getWikiDB();
      const building = await db.buildings.get(id);

      if (!building) {
        throw new Error("Building not found");
      }

      await db.buildings.update(id, {
        hidden: !building.hidden,
        updatedAt: Date.now(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.buildings });
    },
  });
}

/**
 * Remove a building
 */
export function useRemoveBuilding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const db = getWikiDB();
      await db.buildings.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.buildings });
    },
  });
}

/**
 * Remove all buildings
 */
export function useRemoveAllBuildings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const db = getWikiDB();
      await db.buildings.clear();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.buildings });
    },
  });
}

// ============================================================================
// TECHNOS - Reactive Queries
// ============================================================================

/**
 * Get all technos with live updates
 */
export function useTechnos() {
  return useLiveQuery(async () => {
    const db = getWikiDB();
    return await db.technos.orderBy("era").toArray();
  }, []);
}

/**
 * Get visible technos only
 */
export function useVisibleTechnos() {
  return useLiveQuery(async () => {
    const db = getWikiDB();
    return await db.technos.where("hidden").equals(0).toArray();
  }, []);
}

/**
 * Get technos by era
 */
export function useTechnosByEra(era: string) {
  return useLiveQuery(async () => {
    const db = getWikiDB();
    return await db.technos.where("era").equals(era).toArray();
  }, [era]);
}

// ============================================================================
// TECHNOS - Mutations
// ============================================================================

/**
 * Add a new techno
 */
export function useAddTechno() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (techno: TechnoEntity) => {
      const db = getWikiDB();
      await db.technos.add(techno);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.technos });
    },
  });
}

/**
 * Toggle all technos in an era
 */
export function useToggleTechnosByEra() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (era: string) => {
      const db = getWikiDB();
      const technos = await db.technos.where("era").equals(era).toArray();

      if (technos.length === 0) return;

      const newHiddenState = !technos[0].hidden;
      const timestamp = Date.now();

      await db.technos.bulkPut(
        technos.map((t) => ({
          ...t,
          hidden: newHiddenState,
          updatedAt: timestamp,
        })),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.technos });
    },
  });
}

/**
 * Remove all technos in an era
 */
export function useRemoveTechnosByEra() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (era: string) => {
      const db = getWikiDB();
      const technos = await db.technos.where("era").equals(era).toArray();
      await db.technos.bulkDelete(technos.map((t) => t.id));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.technos });
    },
  });
}

// ============================================================================
// OTTOMAN AREAS - Reactive Queries
// ============================================================================

/**
 * Get all ottoman areas
 */
export function useOttomanAreas() {
  return useLiveQuery(async () => {
    const db = getWikiDB();
    return await db.ottomanAreas.orderBy("areaIndex").toArray();
  }, []);
}

/**
 * Get visible ottoman areas
 */
export function useVisibleOttomanAreas() {
  return useLiveQuery(async () => {
    const db = getWikiDB();
    return await db.ottomanAreas.where("hidden").equals(0).toArray();
  }, []);
}

// ============================================================================
// OTTOMAN AREAS - Mutations
// ============================================================================

/**
 * Add ottoman area
 */
export function useAddOttomanArea() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (area: OttomanAreaEntity) => {
      const db = getWikiDB();
      await db.ottomanAreas.add(area);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ottomanAreas });
    },
  });
}

/**
 * Toggle ottoman area hidden
 */
export function useToggleOttomanAreaHidden() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const db = getWikiDB();
      const area = await db.ottomanAreas.get(id);

      if (!area) throw new Error("Area not found");

      await db.ottomanAreas.update(id, {
        hidden: !area.hidden,
        updatedAt: Date.now(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ottomanAreas });
    },
  });
}

/**
 * Remove ottoman area
 */
export function useRemoveOttomanArea() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const db = getWikiDB();
      await db.ottomanAreas.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ottomanAreas });
    },
  });
}

// ============================================================================
// OTTOMAN TRADE POSTS - Reactive Queries
// ============================================================================

/**
 * Get all ottoman trade posts
 */
export function useOttomanTradePosts() {
  return useLiveQuery(async () => {
    const db = getWikiDB();
    return await db.ottomanTradePosts.orderBy("area").toArray();
  }, []);
}

/**
 * Get visible ottoman trade posts
 */
export function useVisibleOttomanTradePosts() {
  return useLiveQuery(async () => {
    const db = getWikiDB();
    return await db.ottomanTradePosts.where("hidden").equals(0).toArray();
  }, []);
}

// ============================================================================
// OTTOMAN TRADE POSTS - Mutations
// ============================================================================

/**
 * Add ottoman trade post
 */
export function useAddOttomanTradePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tradePost: OttomanTradePostEntity) => {
      const db = getWikiDB();
      await db.ottomanTradePosts.add(tradePost);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ottomanTradePosts });
    },
  });
}

/**
 * Toggle trade post hidden
 */
export function useToggleOttomanTradePostHidden() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const db = getWikiDB();
      const tradePost = await db.ottomanTradePosts.get(id);

      if (!tradePost) throw new Error("Trade post not found");

      await db.ottomanTradePosts.update(id, {
        hidden: !tradePost.hidden,
        updatedAt: Date.now(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ottomanTradePosts });
    },
  });
}

/**
 * Toggle trade post level
 */
export function useToggleOttomanTradePostLevel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      level,
    }: {
      id: string;
      level: keyof OttomanTradePostEntity["levels"];
    }) => {
      const db = getWikiDB();
      const tradePost = await db.ottomanTradePosts.get(id);

      if (!tradePost) throw new Error("Trade post not found");

      const newLevels = {
        ...tradePost.levels,
        [level]: !tradePost.levels[level],
      };

      // Recalculate costs if needed
      let newCosts = tradePost.costs;
      if (tradePost.sourceData) {
        newCosts = calculateTradePostCosts(tradePost.sourceData, newLevels);
      }

      await db.ottomanTradePosts.update(id, {
        levels: newLevels,
        costs: newCosts,
        updatedAt: Date.now(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ottomanTradePosts });
    },
  });
}

/**
 * Remove ottoman trade post
 */
export function useRemoveOttomanTradePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const db = getWikiDB();
      await db.ottomanTradePosts.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.ottomanTradePosts });
    },
  });
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function calculateTradePostCosts(
  sourceData: NonNullable<OttomanTradePostEntity["sourceData"]>,
  levels: OttomanTradePostEntity["levels"],
): OttomanTradePostEntity["costs"] {
  const resources: Record<string, number> = {};
  const goodsMap = new Map<string, number>();

  const levelMapping: Record<keyof OttomanTradePostEntity["levels"], number> = {
    unlock: 1,
    lvl2: 2,
    lvl3: 3,
    lvl4: 4,
    lvl5: 5,
  };

  Object.entries(levels).forEach(([levelKey, isEnabled]) => {
    if (!isEnabled) return;

    const levelNum =
      levelMapping[levelKey as keyof OttomanTradePostEntity["levels"]];
    const levelData = sourceData.levels?.[levelNum];

    if (!levelData || !Array.isArray(levelData)) return;

    levelData.forEach((item: { resource: string; amount: number }) => {
      const resource = item.resource.toLowerCase();
      const amount = item.amount;

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

      if (
        ottomanGoods.includes(resource) ||
        resource.match(/^(primary|secondary|tertiary)_/i)
      ) {
        goodsMap.set(resource, (goodsMap.get(resource) || 0) + amount);
      } else {
        resources[resource] = (resources[resource] || 0) + amount;
      }
    });
  });

  const goods = Array.from(goodsMap.entries()).map(([type, amount]) => ({
    type,
    amount,
  }));

  return { resources, goods };
}

/**
 * Hook to toggle hide/show all buildings in a group
 */
export function useToggleHideAllBuildings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (buildingIds: string[]) => toggleHideAllBuildings(buildingIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buildings"] });
    },
  });
}

/**
 * Hook to toggle hide/show all technos in an era
 */
export function useToggleHideAllTechnosByEra() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eraPath: string) => toggleHideAllTechnosByEra(eraPath),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["technos"] });
    },
  });
}

/**
 * Hook to toggle hide/show all Ottoman areas
 */
export function useToggleHideAllOttomanAreas() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => toggleHideAllOttomanAreas(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ottomanAreas"] });
    },
  });
}

/**
 * Hook to toggle hide/show all Ottoman trade posts
 */
export function useToggleHideAllOttomanTradePosts() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => toggleHideAllOttomanTradePosts(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ottomanTradePosts"] });
    },
  });
}
