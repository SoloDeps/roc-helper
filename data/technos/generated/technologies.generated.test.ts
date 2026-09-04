// Garde-fou de l'extraction du domaine Technologies
// (data/technos/generated/technologies.generated.ts). Vérifie ce que consomme
// réellement la page Research Tree : convention d'ID, colonnes, blasons de
// cité, résolution du graphe de prérequis, vocabulaire de biens et de bonus.
//
// ⚠️ Ce test porte sur la donnée GÉNÉRÉE. La donnée saisie à la main
// (data/technos/*.ts) reste en place et branchée : la comparaison entre les
// deux est le travail de `pnpm diff:technos`, pas d'une assertion.
import { describe, it, expect } from "vitest";
import {
  TECHNOLOGY_EXTRACT,
  TECHNOLOGY_RAW_DATA,
} from "@/data/technos/generated/technologies.generated";
import { ERA_ID_TO_ABBR, ABBR_TO_ERA_ID } from "@/lib/era-mappings";
import { imagesUrl } from "@/lib/catalog";
import { goodsByCivilization } from "@/lib/constants";
import { BONUS_LABELS, formatBonusValue } from "@/resolvers/bonus";

const ERA_GOOD = /^(primary|secondary|tertiary)_([a-z]{2})$/;
const PROJECT_ID = /^([a-z]{2})_(\d+)$/;

describe("technologies — extraction", () => {
  it("502 technologies sur 14 âges, un âge = une ère du projet", () => {
    expect(TECHNOLOGY_EXTRACT.technologies.length).toBe(502);
    expect(TECHNOLOGY_RAW_DATA.length).toBe(502);
    expect(TECHNOLOGY_EXTRACT.ages.length).toBe(14);
    for (const age of TECHNOLOGY_EXTRACT.ages) {
      expect(ERA_ID_TO_ABBR[age.eraId], `ère ${age.eraId}`).toBe(age.eraAbbr);
    }
  });

  // docs/data-contracts.md §2.1 contrainte 1 : trois regex parsent cet ID.
  it("l'ID projet est `{abbr}_{index}`, séquentiel et sans trou dans l'ère", () => {
    const byAbbr = new Map<string, number[]>();
    for (const entry of TECHNOLOGY_RAW_DATA) {
      const m = PROJECT_ID.exec(entry.id);
      expect(m, `id ${entry.id}`).not.toBeNull();
      const abbr = m![1];
      expect(ABBR_TO_ERA_ID[abbr], `abbr ${abbr}`).toBeDefined();
      byAbbr.set(abbr, [...(byAbbr.get(abbr) ?? []), Number(m![2])]);
    }
    for (const [abbr, indexes] of byAbbr) {
      expect(
        [...indexes].sort((a, b) => a - b),
        `ère ${abbr}`,
      ).toEqual(indexes.map((_, i) => i));
    }
  });

  it("colonnes dans la plage d'affichage : 0-based, contiguës depuis 0", () => {
    const byAbbr = new Map<string, Set<number>>();
    for (const entry of TECHNOLOGY_RAW_DATA) {
      const abbr = PROJECT_ID.exec(entry.id)![1];
      expect(Number.isInteger(entry.column), `colonne ${entry.id}`).toBe(true);
      expect(entry.column, `colonne ${entry.id}`).toBeGreaterThanOrEqual(0);
      byAbbr.set(abbr, (byAbbr.get(abbr) ?? new Set()).add(entry.column));
    }
    for (const [abbr, columns] of byAbbr) {
      const sorted = [...columns].sort((a, b) => a - b);
      expect(sorted[0], `ère ${abbr}`).toBe(0);
      expect(sorted[sorted.length - 1], `ère ${abbr}`).toBe(sorted.length - 1);
    }
  });

  it("`allied` est toujours une clé de blason connue de lib/catalog.ts", () => {
    for (const entry of TECHNOLOGY_RAW_DATA) {
      if (entry.allied === undefined) continue;
      expect(imagesUrl[entry.allied as keyof typeof imagesUrl], `blason ${entry.id}`).toBeDefined();
    }
  });

  // docs/data-contracts.md §2.1 contrainte 2 : les DFS de lib/path-utils.ts ne
  // cherchent les prérequis que dans l'ère affichée — un ID hors ère est
  // silencieusement ignoré, donc invisible.
  it("chaque prérequis de la projection UI existe dans la même ère", () => {
    const idsByAbbr = new Map<string, Set<string>>();
    for (const entry of TECHNOLOGY_RAW_DATA) {
      const abbr = PROJECT_ID.exec(entry.id)![1];
      idsByAbbr.set(abbr, (idsByAbbr.get(abbr) ?? new Set()).add(entry.id));
    }
    for (const entry of TECHNOLOGY_RAW_DATA) {
      const abbr = PROJECT_ID.exec(entry.id)![1];
      for (const required of entry.required) {
        expect(idsByAbbr.get(abbr)!.has(required), `${entry.id} ← ${required}`).toBe(true);
      }
    }
  });

  // §2.2 : 745 arêtes, dont 15 franchissent exactement un âge. Ces 15 sont
  // écartées de la projection UI, pas perdues.
  it("les arêtes inter-âges sont isolées, pas supprimées", () => {
    const crossAge = TECHNOLOGY_EXTRACT.technologies.flatMap((t) => t.crossAgeRequiresCodes);
    expect(crossAge.length).toBe(15);
    const edges = TECHNOLOGY_EXTRACT.technologies.reduce((n, t) => n + t.requiresCodes.length, 0);
    expect(edges).toBe(745);
    const uiEdges = TECHNOLOGY_RAW_DATA.reduce((n, e) => n + e.required.length, 0);
    expect(uiEdges).toBe(edges - crossAge.length);
  });

  it("le graphe complet est acyclique et n'a qu'une racine", () => {
    const requires = new Map(
      TECHNOLOGY_EXTRACT.technologies.map((t) => [t.id, t.requires]),
    );
    const roots = [...requires].filter(([, r]) => r.length === 0);
    expect(roots.map(([id]) => id)).toEqual(["Technology_StoneAge_TribalSettlement"]);

    const state = new Map<string, 0 | 1 | 2>();
    const visit = (id: string): void => {
      if (state.get(id) === 2) return;
      expect(state.get(id), `cycle sur ${id}`).not.toBe(1);
      state.set(id, 1);
      for (const parent of requires.get(id) ?? []) visit(parent);
      state.set(id, 2);
    };
    for (const id of requires.keys()) visit(id);
  });

  it("tout coût est un entier positif, et research_points est sur les 502", () => {
    for (const entry of TECHNOLOGY_RAW_DATA) {
      expect(entry.costs.research_points, `rp ${entry.id}`).toBeGreaterThan(0);
      for (const value of [entry.costs.coins, entry.costs.food]) {
        if (value === undefined) continue;
        expect(Number.isInteger(value) && value > 0, `coût ${entry.id}`).toBe(true);
      }
      for (const good of entry.costs.goods ?? []) {
        expect(Number.isInteger(good.amount) && good.amount > 0, `bien ${entry.id}`).toBe(true);
      }
    }
  });

  // §2.1 contrainte 3 : `Good.resource` porte deux conventions superposées —
  // bien d'ère résolu dynamiquement, ou bien concret groupé par civilisation.
  // Une clé hors des deux serait silencieusement ignorée par le Calculator.
  it("chaque bien de coût relève d'une des deux conventions de `Good.resource`", () => {
    const known = new Set(Object.values(goodsByCivilization).flatMap((c) => c.goods));
    const unknown = new Set<string>();
    for (const entry of TECHNOLOGY_RAW_DATA) {
      for (const good of entry.costs.goods ?? []) {
        if (ERA_GOOD.test(good.resource)) {
          expect(ABBR_TO_ERA_ID[ERA_GOOD.exec(good.resource)![2]], good.resource).toBeDefined();
        } else if (!known.has(good.resource)) {
          unknown.add(good.resource);
        }
      }
    }
    expect([...unknown].sort()).toEqual([]);
  });

  // Point 3 du cahier des charges : le vocabulaire de bonus est celui de
  // resolvers/bonus.ts, partagé avec les Wonders — aucun dictionnaire parallèle.
  it("chaque clé de bonus extraite est déclarée dans BONUS_LABELS", () => {
    const types = new Set<string>();
    for (const technology of TECHNOLOGY_EXTRACT.technologies) {
      for (const bonus of technology.bonuses) {
        types.add(bonus.type);
        expect(["percent", "integer", "flat"], bonus.type).toContain(bonus.format);
        expect(bonus.instance, bonus.type).toBeGreaterThanOrEqual(1);
        expect(BONUS_LABELS[bonus.type], `label ${bonus.type}`).toBeDefined();
      }
    }
    // Les technologies ne portent qu'une famille de bonus : les places de
    // travailleur commercial (2 occurrences, §3.2). Tout le reste est un
    // déblocage, une limite ou une ressource octroyée une fois.
    expect([...types].sort()).toEqual(["trade_worker_slots"]);
    const bonus = TECHNOLOGY_EXTRACT.technologies.flatMap((t) => t.bonuses)[0];
    expect(formatBonusValue(bonus.format, bonus.value)).toBe(`+${bonus.value}`);
  });

  it("le sens de `baseData.id` est tranché : jamais les deux à la fois", () => {
    for (const technology of TECHNOLOGY_EXTRACT.technologies) {
      for (const reward of technology.rewards) {
        expect(
          reward.targetId === null || reward.ownId === null,
          `${technology.code}/${reward.type}`,
        ).toBe(true);
      }
    }
  });
});
