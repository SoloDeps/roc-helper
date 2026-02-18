"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getWikiDB } from "@/lib/db/schema";
import { getEraAbbr } from "@/lib/era-mappings";
import {
  getAllHydratedBuildings,
  getAllHydratedTechnos,
  getAllHydratedOttomanAreas,
  getAllHydratedOttomanTradePosts,
  getHydratedBuilding,
} from "@/lib/db/data-hydration";
import type { OttomanTradePostEntity } from "@/lib/db/schema";

const now = () => Date.now();

// ============================================================================
// BUILDINGS - Queries
// ============================================================================

export function useBuildings() {
  const { data } = useQuery({
    queryKey: ["buildings"],
    queryFn: () => getAllHydratedBuildings(),
  });
  return data;
}

export function useBuilding(id?: string) {
  const { data } = useQuery({
    queryKey: ["building", id],
    queryFn: () => (id ? getHydratedBuilding(id) : null),
    enabled: !!id,
  });
  return data;
}

// ============================================================================
// BUILDINGS - Mutations
// ============================================================================

export function useAddBuilding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      buildingId,
      quantity = 1,
    }: {
      buildingId: string;
      quantity?: number;
    }) => {
      const db = getWikiDB();
      await db.buildings.put({
        id: buildingId,
        quantity,
        hidden: false,
        updatedAt: now(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buildings"] });
    },
  });
}

export function useRemoveBuilding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const db = getWikiDB();
      await db.buildings.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buildings"] });
    },
  });
}

export function useUpdateBuildingQuantity() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      const db = getWikiDB();
      await db.buildings.update(id, {
        quantity,
        updatedAt: now(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buildings"] });
    },
  });
}

export function useToggleBuildingHidden() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const db = getWikiDB();
      const building = await db.buildings.get(id);
      if (!building) return;

      await db.buildings.update(id, {
        hidden: !building.hidden,
        updatedAt: now(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buildings"] });
    },
  });
}

// ============================================================================
// TECHNOS - Queries
// ============================================================================

export function useTechnos() {
  const { data } = useQuery({
    queryKey: ["technos"],
    queryFn: () => getAllHydratedTechnos(),
  });
  return data;
}

// ============================================================================
// TECHNOS - Mutations
// ============================================================================

export function useAddTechno() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ technoId }: { technoId: string }) => {
      const db = getWikiDB();
      await db.technos.put({
        id: technoId,
        hidden: false,
        updatedAt: now(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["technos"] });
    },
  });
}

export function useRemoveTechnosByEra() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (era: string) => {
      const db = getWikiDB();

      // ✅ Convert era ID to abbreviation: "early_gothic_era" → "eg"
      const eraAbbr = getEraAbbr(era);

      // ✅ Filter by abbreviated format: tech_eg_0, tech_eg_1, etc.
      const technos = await db.technos
        .where("id")
        .startsWith(`tech_${eraAbbr}_`)
        .toArray();

      if (technos.length > 0) {
        await db.technos.bulkDelete(technos.map((t) => t.id));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["technos"] });
    },
  });
}

export function useToggleTechnosByEra() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (era: string) => {
      const db = getWikiDB();

      // ✅ Convert era ID to abbreviation: "early_gothic_era" → "eg"
      const eraAbbr = getEraAbbr(era);

      // ✅ Filter by abbreviated format: tech_eg_0, tech_eg_1, etc.
      const eraTechnos = await db.technos
        .where("id")
        .startsWith(`tech_${eraAbbr}_`)
        .toArray();

      if (eraTechnos.length === 0) return;

      const allHidden = eraTechnos.every((t) => t.hidden);
      const newHiddenState = !allHidden;

      await Promise.all(
        eraTechnos.map((t) =>
          db.technos.update(t.id, {
            hidden: newHiddenState,
            updatedAt: now(),
          }),
        ),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["technos"] });
    },
  });
}

// ============================================================================
// OTTOMAN AREAS - Queries
// ============================================================================

export function useOttomanAreas() {
  const { data } = useQuery({
    queryKey: ["ottoman-areas"],
    queryFn: () => getAllHydratedOttomanAreas(),
  });
  return data;
}

// ============================================================================
// OTTOMAN AREAS - Mutations
// ============================================================================

export function useAddOttomanArea() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ areaId }: { areaId: string }) => {
      const db = getWikiDB();
      await db.ottomanAreas.put({
        id: areaId,
        hidden: false,
        updatedAt: now(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ottoman-areas"] });
    },
  });
}

export function useRemoveOttomanArea() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const db = getWikiDB();
      await db.ottomanAreas.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ottoman-areas"] });
    },
  });
}

export function useToggleOttomanAreaHidden() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const db = getWikiDB();
      const area = await db.ottomanAreas.get(id);
      if (!area) return;

      await db.ottomanAreas.update(id, {
        hidden: !area.hidden,
        updatedAt: now(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ottoman-areas"] });
    },
  });
}

// ============================================================================
// OTTOMAN TRADE POSTS - Queries
// ============================================================================

export function useOttomanTradePosts() {
  const { data } = useQuery({
    queryKey: ["ottoman-tradeposts"],
    queryFn: () => getAllHydratedOttomanTradePosts(),
  });
  return data;
}

// ============================================================================
// OTTOMAN TRADE POSTS - Mutations
// ============================================================================

export function useAddOttomanTradePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ tradePostId }: { tradePostId: string }) => {
      const db = getWikiDB();
      await db.ottomanTradePosts.put({
        id: tradePostId,
        levels: {
          unlock: false,
          lvl2: false,
          lvl3: false,
          lvl4: false,
          lvl5: false,
        },
        hidden: false,
        updatedAt: now(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ottoman-tradeposts"] });
    },
  });
}

export function useRemoveOttomanTradePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const db = getWikiDB();
      await db.ottomanTradePosts.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ottoman-tradeposts"] });
    },
  });
}

export function useToggleOttomanTradePostHidden() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const db = getWikiDB();
      const tp = await db.ottomanTradePosts.get(id);
      if (!tp) return;

      await db.ottomanTradePosts.update(id, {
        hidden: !tp.hidden,
        updatedAt: now(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ottoman-tradeposts"] });
    },
  });
}

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
      const tp = await db.ottomanTradePosts.get(id);
      if (!tp) return;

      const updatedLevels = {
        ...tp.levels,
        [level]: !tp.levels[level],
      };

      await db.ottomanTradePosts.update(id, {
        levels: updatedLevels,
        updatedAt: now(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ottoman-tradeposts"] });
    },
  });
}
