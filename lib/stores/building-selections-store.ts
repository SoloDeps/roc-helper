"use client";

// ============================================================
// Store Zustand pour le classement d'ateliers primary/secondary/tertiary.
//
// ⚠️ NE REMPLACE PAS `hooks/use-building-selections.ts` : Calculator,
// Technologies, Wonders et le reste du site continuent de lire ce
// classement via ce hook (localStorage + événement `storage`), qui
// fonctionne correctement pour eux et n'est délibérément pas touché.
//
// Ce store est un SECOND canal, écrit en parallèle par
// `WorkshopModal.saveSelections`, pour les consommateurs qui ont besoin
// d'une mise à jour synchrone dans la MÊME page sans passer par un
// événement `window` — le Heritage Vault, dont la resynchronisation vue
// `storage` s'est révélée peu fiable après un chargement direct (SSR +
// hydratation), indépendamment de tout code de ce domaine. Zustand notifie
// ses abonnés directement sur l'instance du store, sans indirection par
// `window` : aucun risque d'écouteur qui survivrait à une resynchronisation
// React sans jamais retrouver l'arbre affiché.
//
// Le format stocké (un tableau de tableaux) et la clé localStorage
// (`local:buildingSelections`) restent identiques à ceux de l'ancien canal :
// les deux canaux lisent/écrivent la MÊME donnée, ils ne font que la
// propager différemment.
// ============================================================

import { create } from "zustand";
import { buildingsAbbr } from "@/lib/constants";
import { isValidData } from "@/lib/utils";

export type BuildingSelections = string[][];

const STORAGE_KEY = "local:buildingSelections";
const DEFAULT_SELECTIONS: BuildingSelections = buildingsAbbr.map(() => ["", "", ""]);

function readFromStorage(): BuildingSelections {
  if (typeof window === "undefined") return DEFAULT_SELECTIONS;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw === null || !isValidData(raw)) return DEFAULT_SELECTIONS;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_SELECTIONS;
  } catch {
    return DEFAULT_SELECTIONS;
  }
}

interface BuildingSelectionsStore {
  selections: BuildingSelections;
  setSelections: (selections: BuildingSelections) => void;
}

/**
 * ⚠️ Part sur `DEFAULT_SELECTIONS`, jamais sur `readFromStorage()` : ce
 * module se charge aussi côté serveur (composants client rendus en SSR), et
 * `localStorage` n'y existe pas. La vraie valeur n'arrive qu'au montage,
 * via `hydrateBuildingSelectionsStore` — même partition serveur/client que
 * `use-building-selections.ts`.
 */
export const useBuildingSelectionsStore = create<BuildingSelectionsStore>((set) => ({
  selections: DEFAULT_SELECTIONS,
  setSelections: (selections) => set({ selections }),
}));

/** À appeler une fois au montage d'un consommateur, côté client uniquement. */
export function hydrateBuildingSelectionsStore(): void {
  useBuildingSelectionsStore.getState().setSelections(readFromStorage());
}
