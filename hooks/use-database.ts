"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { getWikiDB, areaIndexToId, tradePostIndexToId } from "@/lib/db/schema";
import { getEraAbbr } from "@/lib/era-mappings";
import {
  getAllHydratedBuildings,
  getAllHydratedTechnos,
  getAllHydratedOttomanAreas,
  getAllHydratedOttomanTradePosts,
  getHydratedBuilding,
} from "@/lib/db/data-hydration";
import type { OttomanTradePostEntity } from "@/lib/db/schema";

// ============================================================================
// BUILDINGS
// ============================================================================

export function useBuildings() {
  //  useLiveQuery : se met à jour automatiquement dès que Dexie change,
  //    quelle que soit la source de l'écriture (research tree, calculator, etc.)
  return useLiveQuery(() => getAllHydratedBuildings());
}

export function useBuilding(id?: string) {
  return useLiveQuery(() => (id ? getHydratedBuilding(id) : undefined), [id]);
}

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
      await db.buildings.put({ id: buildingId, qty: quantity, hidden: 0 });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["buildings"] }),
  });
}

export function useRemoveBuilding() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const db = getWikiDB();
      await db.buildings.delete(id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["buildings"] }),
  });
}

export function useUpdateBuildingQuantity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, quantity }: { id: string; quantity: number }) => {
      const db = getWikiDB();
      await db.buildings.update(id, { qty: quantity });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["buildings"] }),
  });
}

export function useToggleBuildingHidden() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const db = getWikiDB();
      const building = await db.buildings.get(id);
      if (!building) return;
      await db.buildings.update(id, { hidden: building.hidden ? 0 : 1 });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["buildings"] }),
  });
}

// ============================================================================
// TECHNOS
// ============================================================================

export function useTechnos() {
  //  FIX : était useQuery (cache React Query non invalidé par les bulkPut
  //    directs du research tree). useLiveQuery réagit à tout write Dexie.
  return useLiveQuery(() => getAllHydratedTechnos());
}

export function useAddTechno() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ technoId }: { technoId: string }) => {
      const db = getWikiDB();
      await db.technos.put({ id: technoId, hidden: 0 });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["technos"] }),
  });
}

export function useRemoveTechnosByEra() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (era: string) => {
      const db = getWikiDB();
      const eraAbbr = getEraAbbr(era);
      const technos = await db.technos
        .where("id")
        .startsWith(`${eraAbbr}_`)
        .toArray();
      if (technos.length > 0)
        await db.technos.bulkDelete(technos.map((t) => t.id));
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["technos"] }),
  });
}

export function useToggleTechnosByEra() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (era: string) => {
      const db = getWikiDB();
      const eraAbbr = getEraAbbr(era);
      const eraTechnos = await db.technos
        .where("id")
        .startsWith(`${eraAbbr}_`)
        .toArray();
      if (eraTechnos.length === 0) return;
      const allHidden = eraTechnos.every((t) => !!t.hidden);
      await db.technos.bulkPut(
        eraTechnos.map((t) => ({ ...t, hidden: allHidden ? 0 : 1 })),
      );
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["technos"] }),
  });
}

// ============================================================================
// OTTOMAN AREAS
// ============================================================================

export function useOttomanAreas() {
  //  useLiveQuery : réactif à tout write Dexie
  return useLiveQuery(() => getAllHydratedOttomanAreas());
}

export function useAddOttomanArea() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ areaIndex }: { areaIndex: number }) => {
      const db = getWikiDB();
      await db.ottomanAreas.put({ id: areaIndexToId(areaIndex), hidden: 0 });
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["ottoman-areas"] }),
  });
}

export function useRemoveOttomanArea() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const db = getWikiDB();
      await db.ottomanAreas.delete(id);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["ottoman-areas"] }),
  });
}

export function useToggleOttomanAreaHidden() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const db = getWikiDB();
      const area = await db.ottomanAreas.get(id);
      if (!area) return;
      await db.ottomanAreas.update(id, { hidden: area.hidden ? 0 : 1 });
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["ottoman-areas"] }),
  });
}

// ============================================================================
// OTTOMAN TRADE POSTS
// ============================================================================

export function useOttomanTradePosts() {
  //  useLiveQuery : réactif à tout write Dexie
  return useLiveQuery(() => getAllHydratedOttomanTradePosts());
}

export function useAddOttomanTradePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ tradePostIndex }: { tradePostIndex: number }) => {
      const db = getWikiDB();
      await db.ottomanTradePosts.put({
        id: tradePostIndexToId(tradePostIndex),
        levels: { unlock: 0, lvl2: 0, lvl3: 0, lvl4: 0, lvl5: 0 },
        hidden: 0,
      });
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["ottoman-tradeposts"] }),
  });
}

export function useRemoveOttomanTradePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const db = getWikiDB();
      await db.ottomanTradePosts.delete(id);
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["ottoman-tradeposts"] }),
  });
}

export function useToggleOttomanTradePostHidden() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const db = getWikiDB();
      const tp = await db.ottomanTradePosts.get(id);
      if (!tp) return;
      await db.ottomanTradePosts.update(id, { hidden: tp.hidden ? 0 : 1 });
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["ottoman-tradeposts"] }),
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
      await db.ottomanTradePosts.update(id, {
        levels: { ...tp.levels, [level]: tp.levels[level] ? 0 : 1 },
      });
    },
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["ottoman-tradeposts"] }),
  });
}
