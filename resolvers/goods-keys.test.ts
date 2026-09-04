import { describe, it, expect } from "vitest";
import { isRankGoodKey, parseRankGoodKey, GOOD_RANKS } from "./goods-keys";
import { TECHNOLOGY_REGISTRY } from "@/data/technos-registry";
import { ELEMENT_DATA_REGISTRY } from "@/data/registry";
import * as WONDER_GOODS from "@/data/wonders/goods-costs";
import { getAllTradePosts, getAvailableAreas, getAreaData } from "@/lib/ottoman-data-loader";
import { getGoodNameFromPriorityEra, getItemIconLocal } from "@/lib/utils";
import { buildingsAbbr } from "@/lib/constants";
import type { BuildingData, TechnoData } from "@/types/shared";

// ── Les trois regex REMPLACÉES, copiées verbatim ─────────────────────────────
// lib/constants.ts:415 · lib/utils/calculations.ts:159 · app/technologies/page.tsx:235
// components/cards/techno-card.tsx:132 · components/technology/tech-details-panel.tsx:52
const OLD_STRICT_2 = /^(primary|secondary|tertiary)_[a-z]{2}$/i;
// components/wonders/wonder-detail-modal.tsx:315
const OLD_ANY_LEN = /^(primary|secondary|tertiary)_([a-z]+)$/i;
// lib/db/data-hydration.ts:429
const OLD_PREFIX = /^(primary|secondary|tertiary)_/i;

// ── Corpus : TOUTES les clés de biens réellement présentes dans data/ ────────
function realGoodKeys(): string[] {
  const keys = new Set<string>();

  for (const technos of Object.values(TECHNOLOGY_REGISTRY)) {
    for (const t of technos as TechnoData[]) {
      for (const g of t.costs?.goods ?? []) keys.add(g.resource);
    }
  }

  for (const b of Object.values(ELEMENT_DATA_REGISTRY) as BuildingData[]) {
    for (const lvl of b.levels ?? []) {
      for (const type of ["construction", "upgrade"] as const) {
        for (const g of lvl[type]?.goods ?? []) keys.add(g.resource);
      }
    }
  }

  for (const table of Object.values(WONDER_GOODS)) {
    if (!table || typeof table !== "object") continue;
    for (const entries of Object.values(table as Record<number, { iconKey: string }[]>)) {
      if (Array.isArray(entries)) for (const e of entries) keys.add(e.iconKey);
    }
  }

  // `getAreaData` rend un `Good[]` PLAT, pas un objet indexé par niveau.
  for (const areaIndex of getAvailableAreas()) {
    for (const g of getAreaData(areaIndex) ?? []) keys.add(g.resource);
  }

  for (const tp of getAllTradePosts()) {
    for (const goods of Object.values(tp.levels ?? {})) {
      if (Array.isArray(goods)) for (const g of goods) keys.add(g.resource);
    }
  }

  return [...keys];
}

const KEYS = realGoodKeys();

describe("corpus", () => {
  it("couvre technos, bâtiments, wonders et ottoman", () => {
    // Garde-fou : si le corpus se vide, les tests d'équivalence ne prouvent plus rien.
    expect(KEYS.length).toBeGreaterThan(50);
    expect(KEYS.some((k) => OLD_STRICT_2.test(k))).toBe(true); // des rangs
    expect(KEYS.some((k) => !OLD_STRICT_2.test(k))).toBe(true); // des biens concrets
  });
});

describe("isRankGoodKey ≡ les trois regex remplacées, sur la donnée réelle", () => {
  it("même verdict que `[a-z]{2}` sur chaque clé du corpus", () => {
    const divergences = KEYS.filter(
      (k) => isRankGoodKey(k) !== OLD_STRICT_2.test(k),
    );
    expect(divergences).toEqual([]);
  });

  it("même verdict que `[a-z]+` sur chaque clé du corpus", () => {
    const divergences = KEYS.filter(
      (k) => isRankGoodKey(k) !== OLD_ANY_LEN.test(k),
    );
    expect(divergences).toEqual([]);
  });

  it("même verdict que le test de préfixe sur chaque clé du corpus", () => {
    const divergences = KEYS.filter(
      (k) => isRankGoodKey(k) !== OLD_PREFIX.test(k),
    );
    expect(divergences).toEqual([]);
  });
});

describe("parseRankGoodKey ≡ l'extraction [priority, era] remplacée", () => {
  it("rend les mêmes couples que `match[1]` / `match[2]`, normalisés", () => {
    for (const key of KEYS) {
      const old = key.match(OLD_ANY_LEN);
      const parsed = parseRankGoodKey(key);

      if (!old) {
        expect(parsed).toBeNull();
        continue;
      }
      expect(parsed).toEqual({
        priority: old[1].toLowerCase(),
        era: old[2].toUpperCase(),
      });
    }
  });

  it("normalise la casse d'entrée", () => {
    expect(parseRankGoodKey("Primary_BA")).toEqual({ priority: "primary", era: "BA" });
    expect(parseRankGoodKey("SECONDARY_re")).toEqual({ priority: "secondary", era: "RE" });
  });

  it("rejette ce qui n'est pas un rang", () => {
    for (const key of ["wool", "coins", "", "primary_", "quaternary_ba", "primary_b"]) {
      expect(parseRankGoodKey(key)).toBeNull();
      expect(isRankGoodKey(key)).toBe(false);
    }
  });

  it("tolère une entrée non-string sans lever", () => {
    expect(isRankGoodKey(undefined as unknown as string)).toBe(false);
    expect(parseRankGoodKey(null as unknown as string)).toBeNull();
  });
});

describe("l'élargissement à `[a-z]{2,}` — la seule différence assumée", () => {
  it("un code d'ère à 3 lettres serait perdu par `[a-z]{2}`, pas par le nouveau", () => {
    const futureKey = "primary_abc";
    expect(OLD_STRICT_2.test(futureKey)).toBe(false); // 5 emplacements sur 6
    expect(OLD_ANY_LEN.test(futureKey)).toBe(true); //  wonder-detail-modal
    expect(isRankGoodKey(futureKey)).toBe(true);
    // Aucune clé du corpus actuel n'est concernée — vérifié plus haut.
  });
});

describe("GOOD_RANKS", () => {
  it("est l'ordre du jeu, et la seule liste des trois rangs", () => {
    expect(GOOD_RANKS).toEqual(["primary", "secondary", "tertiary"]);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Non-régression PAR CALL SITE — étape 5.
//
// `parseRankGoodKey` normalise la casse (priorité en minuscules, ère en
// MAJUSCULES) là où les anciens sites transmettaient `match[1]` / `match[2]`
// bruts. C'est le seul changement observable de cette étape : tout dépend de
// l'insensibilité à la casse de `getGoodNameFromPriorityEra`, qui est vérifiée
// ici plutôt que supposée.
// ─────────────────────────────────────────────────────────────────────────────

const RANK_KEYS = KEYS.filter((k) => OLD_ANY_LEN.test(k));

const RANKINGS: Record<string, string[][]> = {
  "aucun classement": [],
  "par défaut": buildingsAbbr.map((g) => [...g.buildings]),
  permuté: [
    ["Artisan", "Tailor", "Stone Mason"],
    ["Spice Merchant", "Scribe", "Carpenter"],
    ["Glassblower", "Jeweler", "Alchemist"],
  ],
  partiel: [["Artisan", "", ""], [], []],
};

describe("call site — la résolution du nom de bien (étape 5)", () => {
  it("le corpus contient bien des clés de rang à résoudre", () => {
    expect(RANK_KEYS.length).toBeGreaterThan(20);
  });

  it("≡ `match[1]`/`match[2]` bruts, sur chaque clé de rang × chaque classement", () => {
    for (const [label, selections] of Object.entries(RANKINGS)) {
      for (const key of RANK_KEYS) {
        const m = key.match(OLD_ANY_LEN)!;
        const old = getGoodNameFromPriorityEra(m[1], m[2], selections);
        const parsed = parseRankGoodKey(key)!;
        const next = getGoodNameFromPriorityEra(parsed.priority, parsed.era, selections);
        expect({ label, key, name: next }).toEqual({ label, key, name: old });
      }
    }
  });

  it("≡ y compris sur la variante `[A-Z]{2}` des 9 composants", () => {
    const OLD_UPPER = /^(Primary|Secondary|Tertiary)_([A-Z]{2})$/i;
    for (const [label, selections] of Object.entries(RANKINGS)) {
      for (const key of RANK_KEYS) {
        const m = key.match(OLD_UPPER);
        const parsed = parseRankGoodKey(key);
        // même verdict de reconnaissance…
        expect(Boolean(m)).toBe(Boolean(parsed));
        if (!m || !parsed) continue;
        // …et même nom résolu
        expect({ label, key, n: getGoodNameFromPriorityEra(parsed.priority, parsed.era, selections) })
          .toEqual({ label, key, n: getGoodNameFromPriorityEra(m[1], m[2], selections) });
      }
    }
  });

  it("≡ le repli complet des 9 composants : rang non résolu → « default », bien concret → clé brute", () => {
    // Reproduit le bloc dupliqué à l'identique dans les 9 fichiers.
    const old_goodName = (resource: string, selections: string[][]) => {
      const match = resource.match(/^(Primary|Secondary|Tertiary)_([A-Z]{2})$/i);
      let goodName = resource;
      if (match) {
        const [, priority, era] = match;
        goodName = getGoodNameFromPriorityEra(priority, era, selections) || "default";
      }
      return goodName;
    };
    const new_goodName = (resource: string, selections: string[][]) => {
      const parsed = parseRankGoodKey(resource);
      return parsed
        ? getGoodNameFromPriorityEra(parsed.priority, parsed.era, selections) || "default"
        : resource;
    };

    for (const [label, selections] of Object.entries(RANKINGS)) {
      for (const key of KEYS) {
        expect({ label, key, n: new_goodName(key, selections) }).toEqual({
          label,
          key,
          n: old_goodName(key, selections),
        });
      }
    }
  });

  it("≡ le `resolveGoodsIcon` de wonder-detail-modal, qui majusculait déjà l'ère", () => {
    const old_icon = (iconKey: string, selections: string[][]) => {
      const m = iconKey.match(/^(primary|secondary|tertiary)_([a-z]+)$/i);
      if (m) {
        const resolved = getGoodNameFromPriorityEra(m[1], m[2].toUpperCase(), selections);
        return getItemIconLocal(resolved || "default");
      }
      return getItemIconLocal(iconKey);
    };
    const new_icon = (iconKey: string, selections: string[][]) => {
      const parsed = parseRankGoodKey(iconKey);
      if (!parsed) return getItemIconLocal(iconKey);
      const resolved = getGoodNameFromPriorityEra(parsed.priority, parsed.era, selections);
      return getItemIconLocal(resolved || "default");
    };

    for (const selections of Object.values(RANKINGS)) {
      for (const key of KEYS) {
        expect(new_icon(key, selections)).toBe(old_icon(key, selections));
      }
    }
  });
});

describe("call site — lib/db/data-hydration.ts, classement bien vs ressource (étape 5)", () => {
  it("≡ le test de préfixe, sur toutes les ressources ottomanes réelles", () => {
    const ottoman = new Set<string>();
    for (const areaIndex of getAvailableAreas()) {
      for (const g of getAreaData(areaIndex) ?? []) ottoman.add(g.resource);
    }
    for (const tp of getAllTradePosts()) {
      for (const goods of Object.values(tp.levels ?? {})) {
        if (Array.isArray(goods)) for (const g of goods) ottoman.add(g.resource);
      }
    }

    expect(ottoman.size).toBeGreaterThan(10);
    // Il DOIT y avoir des clés de rang, sinon le test ne prouve rien.
    expect([...ottoman].some((r) => OLD_PREFIX.test(r.toLowerCase()))).toBe(true);

    const divergences = [...ottoman].filter((resource) => {
      const normalized = resource.toLowerCase();
      return OLD_PREFIX.test(normalized) !== isRankGoodKey(normalized);
    });
    expect(divergences).toEqual([]);
  });
});
