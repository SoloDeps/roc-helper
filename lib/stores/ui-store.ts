"use client";

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

// ============================================================================
// UI STATE ONLY - Pas de données entities
// ============================================================================

/**
 * Filters appliqués à la vue overview
 */
export interface ViewFilters {
  tableType?: "construction" | "upgrade";
  location?: string;
  hideHidden: boolean;
  hideTechnos: boolean;
}

/**
 * Store UI - Gère uniquement l'état de l'interface
 */
interface UIStore {
  // Modal state
  isAddModalOpen: boolean;

  // Filters
  filters: ViewFilters;

  // Actions - Modal
  openAddModal: () => void;
  closeAddModal: () => void;

  // Actions - Filters
  setFilters: (filters: Partial<ViewFilters>) => void;
  setTableType: (type?: "construction" | "upgrade") => void;
  setLocation: (location?: string) => void;
  setHideHidden: (hide: boolean) => void;
  setHideTechnos: (hide: boolean) => void;
  resetFilters: () => void;
}

const DEFAULT_FILTERS: ViewFilters = {
  tableType: undefined,
  location: undefined,
  hideHidden: false,
  hideTechnos: false,
};

/**
 * UI Store - Zustand
 */
export const useUIStore = create<UIStore>()(
  devtools(
    persist(
      (set) => ({
        // Initial state
        isAddModalOpen: false,
        filters: DEFAULT_FILTERS,

        // Modal actions
        openAddModal: () => set({ isAddModalOpen: true }),
        closeAddModal: () => set({ isAddModalOpen: false }),

        // Filter actions
        setFilters: (newFilters) =>
          set((state) => ({
            filters: { ...state.filters, ...newFilters },
          })),

        setTableType: (tableType) =>
          set((state) => ({
            filters: { ...state.filters, tableType },
          })),

        setLocation: (location) =>
          set((state) => ({
            filters: { ...state.filters, location },
          })),

        setHideHidden: (hideHidden) =>
          set((state) => ({
            filters: { ...state.filters, hideHidden },
          })),

        setHideTechnos: (hideTechnos) =>
          set((state) => ({
            filters: { ...state.filters, hideTechnos },
          })),

        resetFilters: () => set({ filters: DEFAULT_FILTERS }),
      }),
      {
        name: "roc-ui-storage",
        partialize: (state) => ({
          filters: state.filters, // Persister uniquement les filtres
        }),
      }
    ),
    { name: "UIStore" }
  )
);

// ============================================================================
// SELECTOR HOOKS (Optimized)
// ============================================================================

export const useIsAddModalOpen = () =>
  useUIStore((state) => state.isAddModalOpen);

export const useFilters = () => useUIStore((state) => state.filters);

export const useTableTypeFilter = () =>
  useUIStore((state) => state.filters.tableType);

export const useLocationFilter = () =>
  useUIStore((state) => state.filters.location);

export const useHideHiddenFilter = () =>
  useUIStore((state) => state.filters.hideHidden);

export const useHideTechnosFilter = () =>
  useUIStore((state) => state.filters.hideTechnos);