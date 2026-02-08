"use client";

import { create } from "zustand";

interface FiltersState {
  tableType?: "construction" | "upgrade";
  location?: string;
  hideHidden: boolean;
  hideTechnos: boolean;

  setTableType: (type?: "construction" | "upgrade") => void;
  setLocation: (location?: string) => void;
  setHideHidden: (hide: boolean) => void;
  setHideTechnos: (hide: boolean) => void;
  setFilters: (
    filters: Partial<
      Omit<
        FiltersState,
        | "setTableType"
        | "setLocation"
        | "setHideHidden"
        | "setHideTechnos"
        | "setFilters"
        | "reset"
      >
    >,
  ) => void;
  reset: () => void;
}

export const useFiltersStore = create<FiltersState>((set) => ({
  tableType: undefined,
  location: undefined,
  hideHidden: false,
  hideTechnos: false,

  setTableType: (tableType) => set({ tableType }),
  setLocation: (location) => set({ location }),
  setHideHidden: (hideHidden) => set({ hideHidden }),
  setHideTechnos: (hideTechnos) => set({ hideTechnos }),
  setFilters: (filters) => set(filters),
  reset: () =>
    set({
      tableType: undefined,
      location: undefined,
      hideHidden: false,
      hideTechnos: false,
    }),
}));
