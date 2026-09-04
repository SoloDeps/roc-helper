// Non-régression de l'étape 3 — le TOTAL du Calculator.
//
// `lib/utils/calculations.ts` est le seul agrégateur consommé par l'écran
// Calculator (`components/total-goods/total-goods-display.tsx`). Le brancher sur
// `resolvers/costs.ts` change le chemin de calcul du chiffre le plus visible de
// l'application.
//
// Ce fichier confronte l'ANCIENNE implémentation, copiée verbatim, à la
// nouvelle, sur un jeu construit à partir de la donnée réelle et couvrant les
// cinq sources : bâtiments, technos, aires ottomanes, comptoirs, campagne.

import { describe, it, expect } from "vitest";
import { calculateTotalCosts } from "@/lib/utils/calculations";
import type { CostsLike } from "./costs";
import { TECHNOLOGY_REGISTRY } from "@/data/technos-registry";
import { ELEMENT_DATA_REGISTRY } from "@/data/registry";
import { getAvailableAreas, getAreaData, getAllTradePosts } from "@/lib/ottoman-data-loader";
import { getCampaignsByEra, CAMPAIGN_ERA_IDS } from "@/data/campaigns/campaigns-registry";
import { ERAS } from "@/lib/catalog";
import { slugify } from "@/lib/utils";
import type { CampaignEntity } from "@/lib/db/schema";
import type {
  HydratedBuilding,
  HydratedOttomanArea,
  HydratedOttomanTradePost,
  HydratedTechno,
} from "@/lib/db/data-hydration";
import type { BuildingData, TechnoData } from "@/types/shared";

// ─────────────────────────────────────────────────────────────────────────────
// L'ANCIENNE implémentation, copiée verbatim depuis lib/utils/calculations.ts
// (`calculateTotalCosts` + `accumulateCosts`). Le `Record<string, any>` d'origine
// est typé ici, la règle ESLint du projet interdisant `any` ; le corps est intact.
// ─────────────────────────────────────────────────────────────────────────────

interface OldTotals {
  main: Record<string, number>;
  goods: Map<string, number>;
  byEra: Map<string, Map<string, number>>;
  byCity: Map<string, Map<string, number>>;
}

function old_calculateTotalCosts(
  buildings: HydratedBuilding[],
  technos: HydratedTechno[],
  areas: HydratedOttomanArea[],
  tradePosts: HydratedOttomanTradePost[],
  campaignEntities?: CampaignEntity[],
): OldTotals {
  const totals: OldTotals = {
    main: {},
    goods: new Map(),
    byEra: new Map(),
    byCity: new Map(),
  };

  for (const building of buildings) {
    if (building.hidden) continue;
    old_accumulateCosts(totals, building.costs, building.quantity);
  }

  for (const techno of technos) {
    if (techno.hidden || techno.cp) continue;
    old_accumulateCosts(totals, techno.costs, 1);
  }

  for (const area of areas) {
    if (area.hidden) continue;
    old_accumulateCosts(totals, area.costs, 1);
  }

  for (const tp of tradePosts) {
    if (tp.hidden) continue;
    old_accumulateCosts(totals, tp.costs, 1);
  }

  if (campaignEntities && campaignEntities.length > 0) {
    const completedIds = new Set(
      campaignEntities.filter((r) => !!r.cp).map((r) => r.id),
    );
    const hiddenIds = new Set(
      campaignEntities.filter((r) => !!r.hidden).map((r) => r.id),
    );

    const eraIds = new Set<string>();
    campaignEntities.forEach((c) => {
      const abbr = c.id.match(/^([a-z]+)_/)?.[1];
      if (abbr) {
        const era = ERAS.find((e) => e.abbr.toLowerCase() === abbr);
        if (era) eraIds.add(era.id);
      }
    });

    eraIds.forEach((eraId) => {
      const staticRegions = getCampaignsByEra(eraId);
      for (const region of staticRegions) {
        if (completedIds.has(region.id)) continue;
        if (hiddenIds.has(region.id)) continue;
        const isAdded = campaignEntities.some((c) => c.id === region.id);
        if (!isAdded) continue;
        totals.main["coins"] = (totals.main["coins"] ?? 0) + region.scout.coins;
      }
    });
  }

  return totals;
}

function old_accumulateCosts(
  totals: OldTotals,
  rawCosts: CostsLike,
  multiplier: number,
) {
  // Le `Record<string, any>` d'origine est typé ici (règle ESLint du projet).
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

// ─────────────────────────────────────────────────────────────────────────────
// Fixtures dérivées de la donnée réelle
// ─────────────────────────────────────────────────────────────────────────────

/** Reproduit la mise en forme de `getHydratedBuilding` (data-hydration.ts). */
function hydrateCosts(raw: Record<string, unknown>) {
  const resources: Record<string, number> = {};
  const goods: Array<{ resource: string; amount: number }> = [];
  Object.entries(raw).forEach(([key, value]) => {
    if (key === "goods" && Array.isArray(value)) {
      (value as { resource: string; amount: number }[]).forEach((g) => {
        if (g.resource) goods.push({ resource: slugify(g.resource), amount: g.amount });
      });
    } else if (typeof value === "number") {
      resources[key] = value;
    }
  });
  return { resources, goods };
}

function makeBuildings(hiddenEvery: number, qty: (i: number) => number): HydratedBuilding[] {
  const out: HydratedBuilding[] = [];
  let i = 0;
  for (const b of Object.values(ELEMENT_DATA_REGISTRY) as BuildingData[]) {
    for (const lvl of b.levels ?? []) {
      for (const type of ["construction", "upgrade"] as const) {
        const raw = lvl[type];
        if (!raw) continue;
        out.push({
          id: `${b.category}_${b.id}_${type}_${lvl.era}_${lvl.level}`,
          name: b.name,
          accordionName: b.name,
          isUnresolvedWorkshop: false,
          imageName: b.imageName,
          imgLvl: false,
          category: b.category,
          subcategory: b.subcategory,
          elementId: b.id,
          type,
          era: lvl.era,
          level: lvl.level,
          maxQty: 40,
          costs: hydrateCosts(raw as Record<string, unknown>),
          quantity: qty(i),
          hidden: hiddenEvery > 0 && i % hiddenEvery === 0,
        });
        i++;
      }
    }
  }
  return out;
}

function makeTechnos(hiddenEvery: number, cpEvery: number): HydratedTechno[] {
  const out: HydratedTechno[] = [];
  let i = 0;
  for (const [eraId, technos] of Object.entries(TECHNOLOGY_REGISTRY)) {
    for (const t of technos as TechnoData[]) {
      out.push({
        ...t,
        era: eraId,
        hidden: hiddenEvery > 0 && i % hiddenEvery === 0,
        cp: cpEvery > 0 && i % cpEvery === 0,
      });
      i++;
    }
  }
  return out;
}

function makeAreas(hiddenEvery: number): HydratedOttomanArea[] {
  const out: HydratedOttomanArea[] = [];
  let i = 0;
  for (const areaIndex of getAvailableAreas()) {
    // `getAreaData` rend un `Good[]` PLAT, pas un objet indexé par niveau.
    const goods = getAreaData(areaIndex);
    if (!goods?.length) continue;
    out.push({
      id: `oa_${areaIndex}`,
      areaIndex,
      costs: {
        resources: {},
        goods: goods.map((g) => ({ resource: slugify(g.resource), amount: g.amount })),
      },
      hidden: hiddenEvery > 0 && i % hiddenEvery === 0,
    });
    i++;
  }
  return out;
}

function makeTradePosts(hiddenEvery: number): HydratedOttomanTradePost[] {
  const out: HydratedOttomanTradePost[] = [];
  let i = 0;
  for (const tp of getAllTradePosts()) {
    const allGoods = Object.values(tp.levels ?? {}).flatMap((g) =>
      Array.isArray(g) ? g : [],
    );
    out.push({
      id: `otp_${i}`,
      name: tp.name,
      area: tp.area,
      resource: tp.resource,
      levels: { unlock: true, lvl2: true, lvl3: false, lvl4: false, lvl5: false, lvl6: false },
      costs: {
        resources: { coins: 1000 * (i + 1) },
        goods: allGoods.map((g) => ({ resource: slugify(g.resource), amount: g.amount })),
      },
      hidden: hiddenEvery > 0 && i % hiddenEvery === 0,
    });
    i++;
  }
  return out;
}

function makeCampaign(cpEvery: number, hiddenEvery: number): CampaignEntity[] {
  const out: CampaignEntity[] = [];
  let i = 0;
  for (const eraId of CAMPAIGN_ERA_IDS) {
    for (const region of getCampaignsByEra(eraId)) {
      out.push({
        id: region.id,
        cp: cpEvery > 0 && i % cpEvery === 0 ? 1 : 0,
        hidden: hiddenEvery > 0 && i % hiddenEvery === 0 ? 1 : 0,
      });
      i++;
    }
  }
  return out;
}

// ── Comparaison ──────────────────────────────────────────────────────────────
const normalize = (t: { main: Record<string, number>; goods: Map<string, number> }) => ({
  main: Object.entries(t.main).sort((a, b) => a[0].localeCompare(b[0])),
  goods: [...t.goods.entries()].sort((a, b) => a[0].localeCompare(b[0])),
});

// ─────────────────────────────────────────────────────────────────────────────

describe("corpus du Calculator", () => {
  it("les cinq sources sont réellement peuplées", () => {
    expect(makeBuildings(0, () => 1).length).toBeGreaterThan(500);
    expect(makeTechnos(0, 0).length).toBeGreaterThan(400);
    expect(makeAreas(0).length).toBeGreaterThan(0);
    expect(makeTradePosts(0).length).toBeGreaterThan(0);
    expect(makeCampaign(0, 0).length).toBeGreaterThan(0);
  });
});

describe("calculateTotalCosts ≡ l'ancienne implémentation", () => {
  const SCENARIOS: Array<{
    label: string;
    b: HydratedBuilding[];
    t: HydratedTechno[];
    a: HydratedOttomanArea[];
    p: HydratedOttomanTradePost[];
    c: CampaignEntity[];
  }> = [
    {
      label: "tout visible, quantité 1",
      b: makeBuildings(0, () => 1),
      t: makeTechnos(0, 0),
      a: makeAreas(0),
      p: makeTradePosts(0),
      c: makeCampaign(0, 0),
    },
    {
      label: "quantités variables",
      b: makeBuildings(0, (i) => (i % 7) + 1),
      t: makeTechnos(0, 0),
      a: makeAreas(0),
      p: makeTradePosts(0),
      c: makeCampaign(0, 0),
    },
    {
      label: "masquages et technos complétées mêlés",
      b: makeBuildings(3, (i) => (i % 4) + 1),
      t: makeTechnos(5, 3),
      a: makeAreas(2),
      p: makeTradePosts(3),
      c: makeCampaign(4, 6),
    },
    {
      label: "tout masqué",
      b: makeBuildings(1, () => 2),
      t: makeTechnos(1, 1),
      a: makeAreas(1),
      p: makeTradePosts(1),
      c: makeCampaign(1, 1),
    },
    {
      label: "aucune source",
      b: [],
      t: [],
      a: [],
      p: [],
      c: [],
    },
  ];

  for (const s of SCENARIOS) {
    it(`≡ — ${s.label}`, () => {
      const next = calculateTotalCosts(s.b, s.t, s.a, s.p, s.c);
      const old = old_calculateTotalCosts(s.b, s.t, s.a, s.p, s.c);
      expect(normalize(next)).toEqual(normalize(old));
    });
  }

  it("≡ source par source, isolément", () => {
    const b = makeBuildings(0, (i) => (i % 3) + 1);
    const t = makeTechnos(0, 0);
    const a = makeAreas(0);
    const p = makeTradePosts(0);
    const c = makeCampaign(0, 0);
    const isolated: Array<[string, Parameters<typeof calculateTotalCosts>]> = [
      ["bâtiments seuls", [b, [], [], [], []]],
      ["technos seules", [[], t, [], [], []]],
      ["aires seules", [[], [], a, [], []]],
      ["comptoirs seuls", [[], [], [], p, []]],
      ["campagne seule", [[], [], [], [], c]],
    ];
    for (const [label, args] of isolated) {
      const next = calculateTotalCosts(...args);
      const old = old_calculateTotalCosts(...args);
      expect({ label, ...normalize(next) }).toEqual({ label, ...normalize(old) });
    }
  });

  it("≡ sans argument campagne (paramètre optionnel)", () => {
    const b = makeBuildings(0, () => 1);
    const t = makeTechnos(0, 0);
    expect(normalize(calculateTotalCosts(b, t, [], []))).toEqual(
      normalize(old_calculateTotalCosts(b, t, [], [])),
    );
  });

  it("l'ordre d'insertion de la Map `goods` est préservé", () => {
    const s = SCENARIOS[2];
    const next = calculateTotalCosts(s.b, s.t, s.a, s.p, s.c);
    const old = old_calculateTotalCosts(s.b, s.t, s.a, s.p, s.c);
    expect([...next.goods.keys()]).toEqual([...old.goods.keys()]);
  });

  it("la campagne n'ajoute que des coins, et respecte cp/hidden", () => {
    const all = makeCampaign(0, 0);
    const none = calculateTotalCosts([], [], [], [], []);
    const some = calculateTotalCosts([], [], [], [], all);
    expect(none.main.coins).toBeUndefined();
    expect(some.main.coins).toBeGreaterThan(0);
    expect(some.goods.size).toBe(0);
    expect(Object.keys(some.main)).toEqual(["coins"]);

    // Une région complétée ne compte plus.
    const allCompleted = all.map((c) => ({ ...c, cp: 1 }));
    expect(calculateTotalCosts([], [], [], [], allCompleted).main.coins).toBeUndefined();
    // Idem masquée.
    const allHidden = all.map((c) => ({ ...c, hidden: 1 }));
    expect(calculateTotalCosts([], [], [], [], allHidden).main.coins).toBeUndefined();
  });
});
