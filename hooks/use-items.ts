"use client";

import { useItemsStore } from "@/lib/stores/items-store";

/**
 * Custom hook pour obtenir tous les buildings
 * Utilise _version pour forcer la mise à jour quand les données changent
 */
export function useAllBuildings() {
  const version = useItemsStore((state) => state._version);
  const buildings = useItemsStore((state) => state.buildings);

  // La dépendance à version force un recalcul quand les données changent
  return Array.from(buildings.values());
}

/**
 * Custom hook pour obtenir tous les technos
 */
export function useAllTechnos() {
  const version = useItemsStore((state) => state._version);
  const technos = useItemsStore((state) => state.technos);

  return Array.from(technos.values());
}

/**
 * Custom hook pour obtenir toutes les ottoman areas
 */
export function useAllOttomanAreas() {
  const version = useItemsStore((state) => state._version);
  const areas = useItemsStore((state) => state.ottomanAreas);

  return Array.from(areas.values());
}

/**
 * Custom hook pour obtenir tous les ottoman trade posts
 */
export function useAllOttomanTradePosts() {
  const version = useItemsStore((state) => state._version);
  const tradePosts = useItemsStore((state) => state.ottomanTradePosts);

  return Array.from(tradePosts.values());
}

/**
 * Custom hook pour obtenir un building par ID
 */
export function useBuildingById(id: string) {
  return useItemsStore((state) => state.buildings.get(id));
}

/**
 * Custom hook pour obtenir toutes les actions du store
 */
export function useItemsActions() {
  const removeBuilding = useItemsStore((state) => state.removeBuilding);
  const updateBuildingQuantity = useItemsStore(
    (state) => state.updateBuildingQuantity,
  );
  const toggleBuildingHidden = useItemsStore(
    (state) => state.toggleBuildingHidden,
  );

  const removeTechno = useItemsStore((state) => state.removeTechno);
  const toggleTechnoHidden = useItemsStore((state) => state.toggleTechnoHidden);
  const clearEraTechnos = useItemsStore((state) => state.clearEraTechnos);

  const removeOttomanArea = useItemsStore((state) => state.removeOttomanArea);
  const toggleOttomanAreaHidden = useItemsStore(
    (state) => state.toggleOttomanAreaHidden,
  );

  const removeOttomanTradePost = useItemsStore(
    (state) => state.removeOttomanTradePost,
  );
  const toggleOttomanTradePostHidden = useItemsStore(
    (state) => state.toggleOttomanTradePostHidden,
  );
  const toggleOttomanTradePostLevel = useItemsStore(
    (state) => state.toggleOttomanTradePostLevel,
  );

  return {
    removeBuilding,
    updateBuildingQuantity,
    toggleBuildingHidden,
    removeTechno,
    toggleTechnoHidden,
    clearEraTechnos,
    removeOttomanArea,
    toggleOttomanAreaHidden,
    removeOttomanTradePost,
    toggleOttomanTradePostHidden,
    toggleOttomanTradePostLevel,
  };
}
