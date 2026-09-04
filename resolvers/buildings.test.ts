// Non-régression de la bascule du registre des bâtiments sur l'extraction.
//
// La saisie à la main est lue depuis `HAND_ELEMENT_DATA` (data/registry-hand.ts)
// plutôt que depuis `ELEMENT_DATA_REGISTRY` : le registre est désormais produit
// par `resolvers/buildings.ts`, et la comparaison deviendrait tautologique.
import { describe, it, expect } from "vitest";
import { ELEMENT_DATA_REGISTRY } from "./buildings";
import { HAND_ELEMENT_DATA } from "@/data/registry-hand";
import { BUILDING_RAW_DATA } from "@/data/buildings/generated/buildings.generated";
import type { BuildingData, BuildingLevel, Costs } from "@/types/shared";

const CLES_MAIN = Object.keys(HAND_ELEMENT_DATA);
const CLES_EVOLVING = BUILDING_RAW_DATA.filter(
  (e) => e.buildingType === "evolving",
).map((e) => e.key);

/** Les champs que `pnpm diff:buildings` compare aujourd'hui. */
const CHAMPS_COMPARES = ["name", "levels"] as const;

/**
 * Les seuls montants de construction que le registre prend à l'extraction
 * plutôt qu'à la main : des coûts écrits en formule Lua (`dynamic_lua_long`),
 * que la main ignorait, recopiait du niveau précédent, ou relevait un niveau
 * trop bas. Les 4 montants de `capital_small_home` et `capital_average_home`
 * ont été confirmés en jeu.
 *
 * Les 3 chaînes premium et `capital_domestic_farm` n'y sont pas : la formule y
 * redonne le montant de la main, donc rien ne change.
 */
const COUTS_REPRIS_A_LEXTRACTION: Record<string, Record<number, Costs>> = {
  capital_small_home: { 40: { coins: 4_000_000, food: 8_800_000 } },
  capital_average_home: { 40: { coins: 12_000_000, food: 26_000_000 } },
  capital_rural_farm: { 40: { coins: 30_000_000, food: 12_000_000 } },
  capital_little_culture_site: { 14: { coins: 4_200_000, food: 2_400_000 } },
  capital_compact_culture_site: { 14: { coins: 6_900_000, food: 4_000_000 } },
  capital_moderate_culture_site: { 14: { coins: 14_300_000, food: 8_400_000 } },
  capital_large_culture_site: { 14: { coins: 48_000_000, food: 31_000_000 } },
};

/** La main, avec les montants ci-dessus appliqués — la référence attendue. */
function mainAvecCoutsRepris(cle: string): BuildingLevel[] {
  const repris = COUTS_REPRIS_A_LEXTRACTION[cle];
  return HAND_ELEMENT_DATA[cle].levels.map((niveau) =>
    repris?.[niveau.level] === undefined
      ? niveau
      : { ...niveau, construction: { ...niveau.construction, ...repris[niveau.level] } },
  );
}

/** Présentation projet : absente du game design, recopiée dans l'extraction. */
const CHAMPS_PRESENTATION = ["id", "category", "subcategory", "imageName"] as const;

function extraire(data: BuildingData, champs: readonly (keyof BuildingData)[]) {
  return Object.fromEntries(champs.map((c) => [c, data[c]]));
}

describe("corpus", () => {
  it("les 100 bâtiments à la main sont tous au registre, plus les 44 `evolving`", () => {
    expect(CLES_MAIN.length).toBe(100);
    expect(CLES_EVOLVING.length).toBe(44);
    expect(Object.keys(ELEMENT_DATA_REGISTRY).length).toBe(144);

    for (const cle of [...CLES_MAIN, ...CLES_EVOLVING]) {
      expect(ELEMENT_DATA_REGISTRY[cle], `clé ${cle}`).toBeDefined();
    }
  });

  it("aucune clé `evolving` n'écrase un bâtiment existant", () => {
    expect(CLES_EVOLVING.filter((cle) => cle in HAND_ELEMENT_DATA)).toEqual([]);
  });
});

describe("bascule — les champs déjà comparés par le diff sont inchangés", () => {
  it("les 100 bâtiments sont identiques sur `name` et `levels`", () => {
    const divergences: string[] = [];

    for (const cle of CLES_MAIN) {
      const attendu = { ...extraire(HAND_ELEMENT_DATA[cle], CHAMPS_COMPARES), levels: mainAvecCoutsRepris(cle) };
      const obtenu = extraire(ELEMENT_DATA_REGISTRY[cle], CHAMPS_COMPARES);
      if (JSON.stringify(attendu) !== JSON.stringify(obtenu)) divergences.push(cle);
    }

    expect(divergences).toEqual([]);
  });

  // `levels` n'est plus repris tel quel de la main : les coûts de construction
  // écrits en formule Lua viennent désormais de l'extraction. Aucun autre
  // champ d'un niveau ne bouge — ni `max_qty`, ni les `goods`, ni l'ordre.
  it("`levels` ne diverge de la main que sur les coûts repris à l'extraction", () => {
    const divergences: string[] = [];

    for (const cle of CLES_MAIN) {
      const attendu = JSON.stringify(mainAvecCoutsRepris(cle));
      const obtenu = JSON.stringify(ELEMENT_DATA_REGISTRY[cle].levels);
      if (attendu !== obtenu) divergences.push(cle);
    }

    expect(divergences).toEqual([]);
  });

  it("les 7 chaînes concernées sont les seules à bouger", () => {
    const bougent = CLES_MAIN.filter(
      (cle) =>
        JSON.stringify(HAND_ELEMENT_DATA[cle].levels) !==
        JSON.stringify(ELEMENT_DATA_REGISTRY[cle].levels),
    );
    expect(bougent.sort()).toEqual(Object.keys(COUTS_REPRIS_A_LEXTRACTION).sort());
  });

  // Vérifiés en jeu : la main les relevait un niveau trop bas.
  it("`capital_small_home` et `capital_average_home` niv. 40 suivent la formule", () => {
    for (const [cle, attendu] of [
      ["capital_small_home", { coins: 4_000_000, food: 8_800_000 }],
      ["capital_average_home", { coins: 12_000_000, food: 26_000_000 }],
    ] as const) {
      const construction = ELEMENT_DATA_REGISTRY[cle].levels.find((l) => l.level === 40)?.construction;
      expect(construction?.coins, cle).toBe(attendu.coins);
      expect(construction?.food, cle).toBe(attendu.food);
    }
  });

  for (const champ of [...CHAMPS_PRESENTATION, "name"] as const) {
    it(`≡ sur \`${champ}\` pour les 100 bâtiments`, () => {
      const divergences: string[] = [];

      for (const cle of CLES_MAIN) {
        const attendu = HAND_ELEMENT_DATA[cle][champ];
        const obtenu = ELEMENT_DATA_REGISTRY[cle][champ];
        if (JSON.stringify(attendu) !== JSON.stringify(obtenu)) {
          divergences.push(`${cle}: ${JSON.stringify(attendu)} ≠ ${JSON.stringify(obtenu)}`);
        }
      }

      expect(divergences).toEqual([]);
    });
  }

  // La main reste la colonne vertébrale de `levels` : l'extraction fournit des
  // montants, jamais des niveaux. Les 41-42 générés survivent donc à la bascule.
  it("le nombre de niveaux par bâtiment reste celui de la main", () => {
    const divergences: string[] = [];

    for (const cle of CLES_MAIN) {
      const attendu = HAND_ELEMENT_DATA[cle].levels.length;
      const obtenu = ELEMENT_DATA_REGISTRY[cle].levels.length;
      if (attendu !== obtenu) divergences.push(`${cle}: ${attendu} ≠ ${obtenu}`);
    }

    expect(divergences).toEqual([]);
  });
});

describe("bascule — les champs apportés par l'extraction", () => {
  it("les 144 bâtiments portent un `buildingType` et des dimensions", () => {
    const manquants: string[] = [];

    for (const [cle, data] of Object.entries(ELEMENT_DATA_REGISTRY)) {
      if (!data.buildingType) manquants.push(`${cle}: buildingType`);
      if (!data.width || !data.height) manquants.push(`${cle}: dimensions`);
    }

    expect(manquants).toEqual([]);
  });

  it("`buildingType` et les dimensions sortent bien de l'extraction", () => {
    const divergences: string[] = [];

    for (const entry of BUILDING_RAW_DATA) {
      const data = ELEMENT_DATA_REGISTRY[entry.key];
      const attendu = [entry.buildingType, entry.width, entry.height];
      const obtenu = [data.buildingType, data.width, data.height];
      if (JSON.stringify(attendu) !== JSON.stringify(obtenu)) {
        divergences.push(`${entry.key}: ${JSON.stringify(attendu)} ≠ ${JSON.stringify(obtenu)}`);
      }
    }

    expect(divergences).toEqual([]);
  });

  it("les 44 `evolving` entrent sans niveaux", () => {
    for (const cle of CLES_EVOLVING) {
      const data = ELEMENT_DATA_REGISTRY[cle];
      expect(data.buildingType, cle).toBe("evolving");
      expect(data.levels, cle).toEqual([]);
      expect(data.subcategory, cle).toBe("evolving");
    }
  });
});
