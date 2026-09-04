"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { EraCode } from "@/types/shared";

// Ère affichée dans le Heritage Vault : contrairement au vault sélectionné et
// à son niveau (bac à sable de simulation — voir `useLocalStorageState`,
// clé `localStorage` par thème/vault, mais vidée par défaut à chaque nouveau
// thème), l'ère EST la progression du joueur : il ne peut pas revenir en
// arrière dans le jeu, donc une clé UNIQUE (pas par thème) qui ne se
// réinitialise jamais. Même mécanisme que `technology-page-store` /
// `campaign-page-store` : persist Zustand, donc `localStorage`.
interface HeritageVaultPageState {
  era: EraCode | null;
  setEra: (era: EraCode) => void;
}

export const useHeritageVaultPageStore = create<HeritageVaultPageState>()(
  persist(
    (set) => ({
      era: null,
      setEra: (era) => set({ era }),
    }),
    { name: "roc-heritage-vault-page" },
  ),
);

export const useHeritageVaultEra = () =>
  useHeritageVaultPageStore((state) => state.era);

export const useSetHeritageVaultEra = () =>
  useHeritageVaultPageStore((state) => state.setEra);
