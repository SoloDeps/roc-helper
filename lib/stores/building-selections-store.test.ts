import { describe, expect, it, beforeEach } from "vitest";
import {
  useBuildingSelectionsStore,
  hydrateBuildingSelectionsStore,
} from "./building-selections-store";

// ─────────────────────────────────────────────────────────────────────────────
// Environnement Node de vitest.config.ts : pas de `window`, donc les chemins
// `typeof window === "undefined"` du module (défaut serveur) sont ce que ces
// tests exercent réellement. Le canal de propagation Zustand — la raison
// d'être de ce store — est, lui, indépendant de `window` et testable partout.
// ─────────────────────────────────────────────────────────────────────────────

describe("building-selections-store", () => {
  beforeEach(() => {
    useBuildingSelectionsStore.setState({ selections: [] });
  });

  it("propage une écriture à TOUS les abonnés, sans passer par window", () => {
    let received: string[][] | null = null;
    const unsubscribe = useBuildingSelectionsStore.subscribe((state) => {
      received = state.selections;
    });

    const next = [["Tailor", "", ""]];
    useBuildingSelectionsStore.getState().setSelections(next);

    expect(received).toEqual(next);
    unsubscribe();
  });

  it("`getState()` reflète toujours la dernière écriture, sans délai", () => {
    useBuildingSelectionsStore.getState().setSelections([["Artisan", "", ""]]);
    expect(useBuildingSelectionsStore.getState().selections).toEqual([
      ["Artisan", "", ""],
    ]);
  });

  it("`hydrateBuildingSelectionsStore` rend le défaut hors navigateur, pas une exception", () => {
    expect(() => hydrateBuildingSelectionsStore()).not.toThrow();
    expect(Array.isArray(useBuildingSelectionsStore.getState().selections)).toBe(true);
  });
});
