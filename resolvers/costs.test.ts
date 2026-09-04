import { describe, it, expect, vi } from "vitest";
import { sumCosts, toGoodsArray, type CostEntry, type CostsLike } from "./costs";
import { TECHNOLOGY_REGISTRY } from "@/data/technos-registry";
import { ELEMENT_DATA_REGISTRY } from "@/data/registry";
import { slugify } from "@/lib/utils";
import type { BuildingData, TechnoData } from "@/types/shared";

// ─────────────────────────────────────────────────────────────────────────────
// Les CINQ implémentations remplacées, copiées VERBATIM.
// Elles ne sont ici que pour prouver que la nouvelle rend les mêmes totaux
// qu'elles sur la donnée réelle ; elles disparaissent du code de production aux
// étapes 1 à 4.
// ─────────────────────────────────────────────────────────────────────────────

// #1 lib/element-data-loader.ts:61 — calculateTotalCosts (morte)
function old_elementDataLoader(
  data: BuildingData,
  selectedLevels: number[],
  quantity: number,
  buildingType: "construction" | "upgrade",
) {
  const resources: Record<string, number> = {};
  const goodsMap = new Map<string, number>();
  if (!data?.levels) return { resources, goods: [] as { type: string; amount: number }[] };

  selectedLevels.forEach((levelNum) => {
    const levelData = data.levels.find((l) => l.level === levelNum);
    if (!levelData) return;
    const costs = levelData[buildingType];
    if (!costs) return;
    Object.entries(costs).forEach(([key, value]) => {
      if (key === "goods" && Array.isArray(value)) {
        value.forEach((g: { resource: string; amount: number }) => {
          const existing = goodsMap.get(g.resource);
          goodsMap.set(g.resource, (existing || 0) + g.amount * quantity);
        });
      } else if (typeof value === "number") {
        resources[key] = (resources[key] || 0) + value * quantity;
      }
    });
  });

  return {
    resources,
    goods: Array.from(goodsMap.entries()).map(([type, amount]) => ({ type, amount })),
  };
}

// #2 data/technos-registry.ts:56 — calculateTotalTechnoCosts (morte)
function old_technosRegistry(technos: TechnoData[]) {
  const resources: Record<string, number> = {};
  const goodsMap = new Map<string, number>();
  technos.forEach((techno) => {
    Object.entries(techno.costs).forEach(([key, value]) => {
      if (key === "goods" && Array.isArray(value)) {
        value.forEach((good) => {
          const existing = goodsMap.get(good.resource);
          goodsMap.set(good.resource, (existing || 0) + good.amount);
        });
      } else if (typeof value === "number") {
        resources[key] = (resources[key] || 0) + value;
      }
    });
  });
  return {
    resources,
    goods: Array.from(goodsMap.entries()).map(([resource, amount]) => ({ resource, amount })),
  };
}

// #3 lib/utils/calculations.ts:96 — accumulateCosts (Calculator)
function old_accumulateCosts(
  totals: { main: Record<string, number>; goods: Map<string, number> },
  rawCosts: CostsLike,
  multiplier: number,
) {
  // Seul écart avec la copie verbatim : le `Record<string, any>` d'origine est
  // typé ici, la règle ESLint du projet interdisant `any`. Le corps est intact.
  const costs = rawCosts as Record<string, unknown>;
  if (costs.resources && typeof costs.resources === "object") {
    for (const [key, value] of Object.entries(costs.resources)) {
      if (typeof value === "number") {
        totals.main[key] = (totals.main[key] ?? 0) + value * multiplier;
      }
    }
  }
  if (costs.goods && Array.isArray(costs.goods)) {
    for (const good of costs.goods as { resource?: unknown; amount?: unknown }[]) {
      if (!good.resource || typeof good.resource !== "string") continue;
      if (typeof good.amount !== "number") continue;
      const current = totals.goods.get(good.resource) ?? 0;
      totals.goods.set(good.resource, current + good.amount * multiplier);
    }
  }
  for (const [key, value] of Object.entries(costs)) {
    if (key === "resources" || key === "goods") continue;
    if (typeof value === "number") {
      totals.main[key] = (totals.main[key] ?? 0) + value * multiplier;
    }
  }
}

// #4 app/technologies/page.tsx:70 — sumCosts (panneau Stats)
function old_technologiesPage(techs: TechnoData[]) {
  const resources: Record<string, number> = {};
  const goods = new Map<string, number>();
  techs.forEach((tech) => {
    Object.entries(tech.costs || {}).forEach(([key, value]) => {
      if (key === "goods" && Array.isArray(value)) {
        value.forEach((g) => goods.set(g.resource, (goods.get(g.resource) ?? 0) + g.amount));
      } else if (typeof value === "number") {
        resources[key] = (resources[key] ?? 0) + value;
      }
    });
  });
  return { resources, goods };
}

// #5 components/cards/techno-card.tsx:52 — agrégation inline (cartes techno)
function old_technoCard(remaining: { costs: CostsLike }[]) {
  const resources: Record<string, number> = {};
  const goodsMap = new Map<string, number>();
  remaining.forEach((techno) => {
    Object.entries(techno.costs as Record<string, unknown>).forEach(([key, value]) => {
      if (key === "goods" && Array.isArray(value)) {
        (value as { resource: string; amount: number }[]).forEach((good) => {
          goodsMap.set(good.resource, (goodsMap.get(good.resource) || 0) + good.amount);
        });
      } else if (typeof value === "number") {
        resources[key] = (resources[key] || 0) + value;
      }
    });
  });
  return {
    resources,
    goods: Array.from(goodsMap.entries()).map(([resource, amount]) => ({ resource, amount })),
  };
}

// lib/db/data-hydration.ts:225-240 — la mise en forme des coûts à l'hydratation,
// qui précède #3 sur le chemin bâtiment du Calculator.
function old_hydrateLevelCosts(costs: Record<string, unknown>) {
  const resources: Record<string, number> = {};
  const goods: Array<{ resource: string; amount: number }> = [];
  Object.entries(costs).forEach(([key, value]) => {
    if (key === "goods" && Array.isArray(value)) {
      value.forEach((g: { resource: string; amount: number }) => {
        if (g.resource) goods.push({ resource: slugify(g.resource), amount: g.amount });
      });
    } else if (typeof value === "number") {
      resources[key] = value;
    }
  });
  return { resources, goods };
}

// ── Normalisation commune, pour comparer des formes de sortie différentes ────
type Norm = { main: [string, number][]; goods: [string, number][] };
const sorted = (e: [string, number][]): [string, number][] =>
  e.filter(([, v]) => v !== 0).sort((a, b) => a[0].localeCompare(b[0]));
const norm = (
  main: Record<string, number>,
  goods: Iterable<[string, number]>,
): Norm => ({ main: sorted(Object.entries(main)), goods: sorted([...goods]) });

const ALL_TECHNOS = Object.values(TECHNOLOGY_REGISTRY).flat() as TechnoData[];
const ALL_BUILDINGS = Object.values(ELEMENT_DATA_REGISTRY) as BuildingData[];

// ─────────────────────────────────────────────────────────────────────────────

describe("corpus", () => {
  it("est bien celui du dépôt, pas un échantillon", () => {
    expect(ALL_TECHNOS.length).toBeGreaterThan(400);
    expect(ALL_BUILDINGS.length).toBeGreaterThan(30);
  });

  it("la slugification des clés de biens est l'identité sur toute la donnée actuelle", () => {
    // C'est ce qui rend l'ajout du slugify non-régressif : le chemin bâtiment
    // slugifiait déjà, le chemin techno non — et sur cette donnée les deux
    // coïncident. Si cette assertion tombe un jour, c'est que l'extraction a
    // introduit une clé non slugifiée, et il faudra décider où la corriger.
    const offenders: string[] = [];
    for (const t of ALL_TECHNOS) {
      for (const g of t.costs?.goods ?? []) {
        if (slugify(g.resource) !== g.resource) offenders.push(g.resource);
      }
    }
    for (const b of ALL_BUILDINGS) {
      for (const lvl of b.levels ?? []) {
        for (const type of ["construction", "upgrade"] as const) {
          for (const g of lvl[type]?.goods ?? []) {
            if (slugify(g.resource) !== g.resource) offenders.push(g.resource);
          }
        }
      }
    }
    expect(offenders).toEqual([]);
  });
});

describe("sumCosts ≡ les 4 implémentations techno, sur les 502 technos", () => {
  const entries: CostEntry[] = ALL_TECHNOS.map((t) => ({ costs: t.costs }));
  const next = sumCosts(entries);
  const NEXT = norm(next.main, next.goods);

  it("≡ #2 data/technos-registry.ts (calculateTotalTechnoCosts)", () => {
    const o = old_technosRegistry(ALL_TECHNOS);
    expect(NEXT).toEqual(
      norm(o.resources, o.goods.map((g) => [g.resource, g.amount] as [string, number])),
    );
  });

  it("≡ #4 app/technologies/page.tsx (sumCosts local)", () => {
    const o = old_technologiesPage(ALL_TECHNOS);
    expect(NEXT).toEqual(norm(o.resources, o.goods));
  });

  it("≡ #5 components/cards/techno-card.tsx (inline)", () => {
    const o = old_technoCard(ALL_TECHNOS);
    expect(NEXT).toEqual(
      norm(o.resources, o.goods.map((g) => [g.resource, g.amount] as [string, number])),
    );
  });

  it("≡ #3 lib/utils/calculations.ts (accumulateCosts)", () => {
    const totals = { main: {} as Record<string, number>, goods: new Map<string, number>() };
    for (const t of ALL_TECHNOS) old_accumulateCosts(totals, t.costs, 1);
    expect(NEXT).toEqual(norm(totals.main, totals.goods));
  });

  it("≡ era par era, pas seulement sur le total global", () => {
    for (const [eraId, technos] of Object.entries(TECHNOLOGY_REGISTRY)) {
      const n = sumCosts((technos as TechnoData[]).map((t) => ({ costs: t.costs })));
      const o = old_technologiesPage(technos as TechnoData[]);
      expect({ eraId, ...norm(n.main, n.goods) }).toEqual({
        eraId,
        ...norm(o.resources, o.goods),
      });
    }
  });
});

describe("sumCosts ≡ le chemin bâtiment (hydratation + accumulateCosts)", () => {
  it("identique sur chaque paire bâtiment × niveau × type × quantité", () => {
    const divergences: string[] = [];
    let compared = 0;

    for (const quantity of [1, 7]) {
      for (const b of ALL_BUILDINGS) {
        for (const lvl of b.levels ?? []) {
          for (const type of ["construction", "upgrade"] as const) {
            const raw = lvl[type];
            if (!raw) continue;
            compared++;

            const hydrated = old_hydrateLevelCosts(raw as Record<string, unknown>);

            const totals = { main: {} as Record<string, number>, goods: new Map<string, number>() };
            old_accumulateCosts(totals, hydrated, quantity);
            const OLD = norm(totals.main, totals.goods);

            const n = sumCosts([{ costs: hydrated, multiplier: quantity }]);
            const NEXT = norm(n.main, n.goods);

            if (JSON.stringify(OLD) !== JSON.stringify(NEXT)) {
              divergences.push(`${b.id} lvl${lvl.level} ${lvl.era} ${type} qty=${quantity}`);
            }
          }
        }
      }
    }

    expect(compared).toBeGreaterThan(1000);
    expect(divergences).toEqual([]);
  });

  it("identique à #1 element-data-loader, coûts BRUTS non hydratés", () => {
    // #1 lisait les niveaux bruts sans passer par l'hydratation : on compare
    // sur cette entrée-là, celle qu'elle attendait.
    const divergences: string[] = [];
    for (const quantity of [1, 7]) {
      for (const b of ALL_BUILDINGS) {
        for (const lvl of b.levels ?? []) {
          for (const type of ["construction", "upgrade"] as const) {
            if (!lvl[type]) continue;
            const o = old_elementDataLoader(b, [lvl.level], quantity, type);
            const OLD = norm(o.resources, o.goods.map((g) => [g.type, g.amount] as [string, number]));
            const n = sumCosts([{ costs: lvl[type] as Record<string, unknown>, multiplier: quantity }]);
            if (JSON.stringify(OLD) !== JSON.stringify(norm(n.main, n.goods))) {
              divergences.push(`${b.id} lvl${lvl.level} ${type} qty=${quantity}`);
            }
          }
        }
      }
    }
    expect(divergences).toEqual([]);
  });
});

describe("les deux formes de coût, en une seule passe", () => {
  it("forme plate (technos, niveaux bruts)", () => {
    const t = sumCosts([{ costs: { coins: 100, food: 50, goods: [{ resource: "wool", amount: 3 }] } }]);
    expect(t.main).toEqual({ coins: 100, food: 50 });
    expect([...t.goods]).toEqual([["wool", 3]]);
  });

  it("forme imbriquée (sortie d'hydratation)", () => {
    const t = sumCosts([
      { costs: { resources: { coins: 100 }, goods: [{ resource: "wool", amount: 3 }] } },
    ]);
    expect(t.main).toEqual({ coins: 100 });
    expect([...t.goods]).toEqual([["wool", 3]]);
  });

  it("les deux formes mélangées dans un même appel s'additionnent", () => {
    const t = sumCosts([
      { costs: { coins: 100, goods: [{ resource: "wool", amount: 3 }] } },
      { costs: { resources: { coins: 40 }, goods: [{ resource: "wool", amount: 2 }] } },
    ]);
    expect(t.main).toEqual({ coins: 140 });
    expect([...t.goods]).toEqual([["wool", 5]]);
  });

  it("un coût imbriqué ne perd plus ses ressources — la régression de #1", () => {
    const nested = { resources: { coins: 100 }, goods: [{ resource: "wool", amount: 2 }] };
    // #1 rendait `{ resources: {}, goods: [{ wool, 2 }] }` : les coins disparaissaient.
    expect(sumCosts([{ costs: nested }]).main).toEqual({ coins: 100 });
  });
});

describe("le multiplicateur", () => {
  it("s'applique aux ressources ET aux biens", () => {
    const t = sumCosts([
      { costs: { coins: 10, goods: [{ resource: "wool", amount: 2 }] }, multiplier: 5 },
    ]);
    expect(t.main).toEqual({ coins: 50 });
    expect([...t.goods]).toEqual([["wool", 10]]);
  });

  it("vaut 1 par défaut", () => {
    expect(sumCosts([{ costs: { coins: 10 } }]).main).toEqual({ coins: 10 });
  });

  it("multiplicateur 0 — le coût est compté, à zéro", () => {
    const t = sumCosts([{ costs: { coins: 10 } }, { costs: { coins: 7 }, multiplier: 0 }]);
    expect(t.main).toEqual({ coins: 10 });
  });
});

describe("les entrées que la donnée actuelle n'exerce pas encore", () => {
  it("une clé de coût inédite est agrégée sans déclaration préalable", () => {
    const t = sumCosts([{ costs: { mana: 42 } }, { costs: { mana: 8 } }]);
    expect(t.main.mana).toBe(50);
  });

  it("un good sans `resource` est écarté, pas transformé en clé `undefined`", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const t = sumCosts([{ costs: { goods: [{ amount: 5 }] } }]);
    expect([...t.goods]).toEqual([]);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it("un good dont `amount` n'est pas un nombre est écarté, pas sommé en NaN", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const t = sumCosts([{ costs: { goods: [{ resource: "wool" }] } }]);
    expect([...t.goods]).toEqual([]);
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it("une `resource` vide est écartée, et non slugifiée en « default »", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const t = sumCosts([{ costs: { goods: [{ resource: "", amount: 3 }] } }]);
    expect([...t.goods]).toEqual([]);
    warn.mockRestore();
  });

  it("une `resource` non slugifiée tombe dans le même seau que sa forme slugifiée", () => {
    const t = sumCosts([
      { costs: { goods: [{ resource: "Golden Mask", amount: 3 }] } },
      { costs: { goods: [{ resource: "golden_mask", amount: 4 }] } },
    ]);
    expect([...t.goods]).toEqual([["golden_mask", 7]]);
  });

  it("un coût nul ou non-objet ne lève pas", () => {
    expect(() =>
      sumCosts([
        { costs: null as unknown as Record<string, unknown> },
        { costs: undefined as unknown as Record<string, unknown> },
      ]),
    ).not.toThrow();
  });

  it("une liste vide rend un total vide", () => {
    const t = sumCosts([]);
    expect(t.main).toEqual({});
    expect(t.goods.size).toBe(0);
  });
});

describe("toGoodsArray", () => {
  it("préserve l'ordre d'insertion, comme l'Array.from(map) remplacé", () => {
    const t = sumCosts([
      { costs: { goods: [{ resource: "wool", amount: 1 }, { resource: "planks", amount: 2 }] } },
    ]);
    expect(toGoodsArray(t.goods)).toEqual([
      { resource: "wool", amount: 1 },
      { resource: "planks", amount: 2 },
    ]);
  });

  it("rend [] sur une Map vide", () => {
    expect(toGoodsArray(new Map())).toEqual([]);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Non-régression PAR CALL SITE — étapes 1 et 2.
//
// Les blocs précédents prouvent l'équivalence des AGRÉGATIONS. Ceux-ci prouvent
// l'équivalence de ce que chaque écran en dérive réellement : la forme de sortie
// consommée par le rendu, ancienne contre nouvelle, sur le corpus réel.
// ─────────────────────────────────────────────────────────────────────────────

/** Un HydratedTechno réduit à ce que la carte lit. */
type CardTechno = { costs: TechnoData["costs"]; cp: boolean };

describe("call site — components/cards/techno-card.tsx (étape 1)", () => {
  // AVANT : le useMemo `aggregatedData`, verbatim
  function old_aggregatedData(technos: CardTechno[]) {
    const remaining = technos.filter((t) => !t.cp);

    if (remaining.length === 0) {
      return {
        totalResearch: 0,
        totalCoins: 0,
        totalFood: 0,
        goods: [] as Array<{ resource: string; amount: number }>,
        technoCount: technos.length,
        remainingCount: 0,
      };
    }

    const resources: Record<string, number> = {};
    const goodsMap = new Map<string, number>();
    remaining.forEach((techno) => {
      Object.entries(techno.costs as Record<string, unknown>).forEach(([key, value]) => {
        if (key === "goods" && Array.isArray(value)) {
          (value as { resource: string; amount: number }[]).forEach((good) => {
            goodsMap.set(good.resource, (goodsMap.get(good.resource) || 0) + good.amount);
          });
        } else if (typeof value === "number") {
          resources[key] = (resources[key] || 0) + value;
        }
      });
    });

    return {
      totalResearch: resources.research_points || 0,
      totalCoins: resources.coins || 0,
      totalFood: resources.food || 0,
      goods: Array.from(goodsMap.entries()).map(([resource, amount]) => ({ resource, amount })),
      technoCount: technos.length,
      remainingCount: remaining.length,
    };
  }

  // APRÈS : la dérivation telle qu'elle est écrite dans le composant branché.
  // Le court-circuit `remaining.length === 0` disparaît : `sumCosts([])` rend
  // déjà des totaux vides, et `remainingCount` y vaut 0 de lui-même.
  function new_aggregatedData(technos: CardTechno[]) {
    const remaining = technos.filter((t) => !t.cp);
    const totals = sumCosts(remaining.map((t) => ({ costs: t.costs })));

    return {
      totalResearch: totals.main.research_points || 0,
      totalCoins: totals.main.coins || 0,
      totalFood: totals.main.food || 0,
      goods: toGoodsArray(totals.goods),
      technoCount: technos.length,
      remainingCount: remaining.length,
    };
  }

  const asCard = (technos: TechnoData[], cp: (i: number) => boolean): CardTechno[] =>
    technos.map((t, i) => ({ costs: t.costs, cp: cp(i) }));

  it("≡ ère par ère, aucune techno complétée", () => {
    for (const [eraId, technos] of Object.entries(TECHNOLOGY_REGISTRY)) {
      const input = asCard(technos as TechnoData[], () => false);
      expect({ eraId, ...new_aggregatedData(input) }).toEqual({
        eraId,
        ...old_aggregatedData(input),
      });
    }
  });

  it("≡ ère par ère, une techno sur deux complétée", () => {
    for (const [eraId, technos] of Object.entries(TECHNOLOGY_REGISTRY)) {
      const input = asCard(technos as TechnoData[], (i) => i % 2 === 0);
      expect({ eraId, ...new_aggregatedData(input) }).toEqual({
        eraId,
        ...old_aggregatedData(input),
      });
    }
  });

  it("≡ quand TOUTES les technos sont complétées — le court-circuit retiré", () => {
    for (const [eraId, technos] of Object.entries(TECHNOLOGY_REGISTRY)) {
      const input = asCard(technos as TechnoData[], () => true);
      const next = new_aggregatedData(input);
      expect({ eraId, ...next }).toEqual({ eraId, ...old_aggregatedData(input) });
      expect(next).toMatchObject({
        totalResearch: 0,
        totalCoins: 0,
        totalFood: 0,
        goods: [],
        remainingCount: 0,
      });
    }
  });

  it("≡ sur une carte sans aucune techno", () => {
    expect(new_aggregatedData([])).toEqual(old_aggregatedData([]));
  });

  it("≡ sur le corpus entier, tous mélangés", () => {
    const input = asCard(ALL_TECHNOS, (i) => i % 3 === 0);
    expect(new_aggregatedData(input)).toEqual(old_aggregatedData(input));
  });
});

describe("call site — app/technologies/page.tsx, CostGrid (étape 2)", () => {
  // APRÈS : ce que le composant destructure une fois branché.
  function new_costGridInput(techs: TechnoData[]) {
    const { main: resources, goods } = sumCosts(techs.map((t) => ({ costs: t.costs })));
    return { resources, goods };
  }

  it("≡ le sumCosts local, ère par ère", () => {
    for (const [eraId, technos] of Object.entries(TECHNOLOGY_REGISTRY)) {
      const next = new_costGridInput(technos as TechnoData[]);
      const old = old_technologiesPage(technos as TechnoData[]);
      expect({ eraId, ...norm(next.resources, next.goods) }).toEqual({
        eraId,
        ...norm(old.resources, old.goods),
      });
    }
  });

  it("≡ sur les deux partitions de l'onglet — Selected et Remaining", () => {
    for (const [eraId, technos] of Object.entries(TECHNOLOGY_REGISTRY)) {
      const list = technos as TechnoData[];
      const partitions = {
        completed: list.filter((_, i) => i % 2 === 0),
        remaining: list.filter((_, i) => i % 2 !== 0),
      };
      for (const [name, techs] of Object.entries(partitions)) {
        const next = new_costGridInput(techs);
        const old = old_technologiesPage(techs);
        expect({ eraId, name, ...norm(next.resources, next.goods) }).toEqual({
          eraId,
          name,
          ...norm(old.resources, old.goods),
        });
      }
    }
  });

  it("`goods` reste une Map — CostGrid appelle .forEach et .size dessus", () => {
    const { goods } = new_costGridInput(ALL_TECHNOS);
    expect(goods).toBeInstanceOf(Map);
    expect(goods.size).toBeGreaterThan(0);
  });

  it("≡ sur une liste vide (onglet sans techno)", () => {
    const next = new_costGridInput([]);
    const old = old_technologiesPage([]);
    expect(norm(next.resources, next.goods)).toEqual(norm(old.resources, old.goods));
    expect(next.goods.size).toBe(0);
  });
});
