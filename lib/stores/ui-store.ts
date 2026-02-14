"use client";

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export interface ViewFilters {
  tableType?: "construction" | "upgrade";
  location?: string;
  hideHidden: boolean;
  hideTechnos: boolean;
}

interface UIStore {
  // Accordions state
  accordionsState: string[];

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

  // Actions - Accordions
  // ✅ Support des callbacks ET des valeurs directes
  setAccordionsState: (
    idsOrUpdater: string[] | ((prev: string[]) => string[]),
  ) => void;
  addToAccordionsState: (ids: string[]) => void;
  removeFromAccordionsState: (ids: string[]) => void;
  expandAllAccordions: () => void;
  collapseAllAccordions: () => void;
}

const DEFAULT_FILTERS: ViewFilters = {
  tableType: undefined,
  location: undefined,
  hideHidden: false,
  hideTechnos: false,
};

export const useUIStore = create<UIStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        accordionsState: [],
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

        // Accordion actions
        // ✅ Accepte soit un tableau, soit une fonction callback
        setAccordionsState: (idsOrUpdater) => {
          if (typeof idsOrUpdater === "function") {
            set((state) => ({
              accordionsState: idsOrUpdater(state.accordionsState),
            }));
          } else {
            set({ accordionsState: idsOrUpdater });
          }
        },

        // ✅ Helper pour ajouter des IDs sans écraser
        addToAccordionsState: (ids) =>
          set((state) => ({
            accordionsState: Array.from(
              new Set([...state.accordionsState, ...ids]),
            ),
          })),

        // ✅ Helper pour retirer des IDs
        removeFromAccordionsState: (ids) =>
          set((state) => ({
            accordionsState: state.accordionsState.filter(
              (id) => !ids.includes(id),
            ),
          })),

        expandAllAccordions: () => {
          // Will be handled by ItemList to get all accordion IDs
          set({ accordionsState: ["__expand_all__"] });
        },

        collapseAllAccordions: () => {
          set({ accordionsState: [] });
        },
      }),
      {
        name: "roc-ui-storage",
        partialize: (state) => ({
          filters: state.filters,
        }),
      },
    ),
    { name: "UIStore" },
  ),
);

// Selector Hooks
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
