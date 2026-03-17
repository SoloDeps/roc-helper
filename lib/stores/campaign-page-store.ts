"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CampaignPageState {
  selectedEraId: string | null;
  selectEra: (eraId: string) => void;
  clearSelection: () => void;
}

export const useCampaignPageStore = create<CampaignPageState>()(
  persist(
    (set) => ({
      selectedEraId: null,
      selectEra: (eraId) => set({ selectedEraId: eraId }),
      clearSelection: () => set({ selectedEraId: null }),
    }),
    { name: "roc-campaign-page" },
  ),
);

export const useSelectedCampaignEraId = () =>
  useCampaignPageStore((state) => state.selectedEraId);

export const useSelectCampaignEra = () =>
  useCampaignPageStore((state) => state.selectEra);
