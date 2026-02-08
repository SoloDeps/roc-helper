"use client";

import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist, createJSONStorage } from "zustand/middleware";
import type { BuildingEntity } from "@/lib/db/schema";

interface BuildingsState {
  buildings: Map<string, BuildingEntity>;

  // Actions
  addBuilding: (building: BuildingEntity) => void;
  addBuildings: (buildings: BuildingEntity[]) => void;
  removeBuilding: (id: string) => void;
  removeAllBuildings: () => void;
  updateQuantity: (id: string, quantity: number) => void;
  toggleHidden: (id: string) => void;

  // Getters (computed)
  getVisibleBuildings: () => BuildingEntity[];
  getBuildingById: (id: string) => BuildingEntity | undefined;
  getTotalCount: () => number;
  getVisibleCount: () => number;
}

export const useBuildingsStore = create<BuildingsState>()(
  persist(
    immer((set, get) => ({
      buildings: new Map(),

      addBuilding: (building) =>
        set((state) => {
          state.buildings.set(building.id, {
            ...building,
            hidden: building.hidden ?? false,
            updatedAt: Date.now(),
          });
        }),

      addBuildings: (buildings) =>
        set((state) => {
          buildings.forEach((building) => {
            state.buildings.set(building.id, {
              ...building,
              hidden: building.hidden ?? false,
              updatedAt: Date.now(),
            });
          });
        }),

      removeBuilding: (id) =>
        set((state) => {
          state.buildings.delete(id);
        }),

      removeAllBuildings: () =>
        set((state) => {
          state.buildings.clear();
        }),

      updateQuantity: (id, quantity) =>
        set((state) => {
          const building = state.buildings.get(id);
          if (building) {
            const clampedQuantity = Math.max(
              1,
              Math.min(building.maxQty ?? 40, quantity),
            );
            building.quantity = clampedQuantity;
            building.updatedAt = Date.now();
          }
        }),

      toggleHidden: (id) =>
        set((state) => {
          const building = state.buildings.get(id);
          if (building) {
            building.hidden = !building.hidden;
            building.updatedAt = Date.now();
          }
        }),

      // Computed values
      getVisibleBuildings: () => {
        const { buildings } = get();
        return Array.from(buildings.values()).filter((b) => !b.hidden);
      },

      getBuildingById: (id) => {
        return get().buildings.get(id);
      },

      getTotalCount: () => {
        return get().buildings.size;
      },

      getVisibleCount: () => {
        return get().getVisibleBuildings().length;
      },
    })),
    {
      name: "buildings-storage",
      storage: createJSONStorage(() => localStorage),
      // Convertir Map en Array pour la sérialisation
      partialize: (state) => ({
        buildings: Array.from(state.buildings.entries()),
      }),
      // Reconvertir Array en Map lors de la désérialisation
      merge: (persistedState: any, currentState) => {
        const buildings = new Map(persistedState?.buildings || []);
        return { ...currentState, buildings };
      },
    },
  ),
);
