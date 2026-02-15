"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TechnologyPageState {
  // Selected era for the tech tree display
  selectedEraId: string | null;

  // Actions
  selectEra: (eraId: string) => void;
  clearSelection: () => void;
}

export const useTechnologyPageStore = create<TechnologyPageState>()(
  persist(
    (set) => ({
      selectedEraId: null,

      selectEra: (eraId) => set({ selectedEraId: eraId }),
      
      clearSelection: () => set({ selectedEraId: null }),
    }),
    {
      name: "roc-technology-page",
    }
  )
);

// Selector hooks
export const useSelectedEraId = () =>
  useTechnologyPageStore((state) => state.selectedEraId);

export const useSelectEra = () =>
  useTechnologyPageStore((state) => state.selectEra);

export const useClearEraSelection = () =>
  useTechnologyPageStore((state) => state.clearSelection);
