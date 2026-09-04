// Garde-fou de la bascule de data/wonders/index.ts sur les données générées
// (data/wonders/generated/wonders.generated.ts). Vérifie ce que consomment
// réellement les composants Wonders : clés d'images, sélecteurs de tables de
// coûts, couleurs de matériaux, vocabulaire de bonus.
import { describe, it, expect } from "vitest";
import { WONDERS, WONDER_CODES } from "@/data/wonders/index";
import { getCostTables, getGoodsTable, WONDER_IMAGE_MAP, WONDER_IMAGE_OFFSET_PX, MATERIAL_COLORS } from "@/data/wonders/wonder-config";
import {
  getResolvedBonuses,
  computeSynergies,
  computeTagCounts,
} from "@/resolvers/wonders";
import { BONUS_LABELS, getBonusLabel, formatBonusValue } from "@/resolvers/bonus";

describe("wiring", () => {
  it("28 wonders, every code has image + offset + cost tables", () => {
    expect(WONDER_CODES.length).toBe(28);
    for (const code of WONDER_CODES) {
      const w = WONDERS[code];
      expect(WONDER_IMAGE_MAP[code], `image ${code}`).toBeDefined();
      expect(WONDER_IMAGE_OFFSET_PX[code], `offset ${code}`).toBeDefined();
      expect(MATERIAL_COLORS[w.meta.material1], `mat1 ${code}`).toBeDefined();
      expect(MATERIAL_COLORS[w.meta.material2], `mat2 ${code}`).toBeDefined();
      const t = getCostTables(w);
      expect(t.coinTable[30], `coin ${code}`).toBeDefined();
      expect(t.foodTable[30], `food ${code}`).toBeDefined();
      expect(t.rpTable[30], `rp ${code}`).toBeDefined();
      expect(t.workerTable[30], `worker ${code}`).toBeDefined();
      expect(getGoodsTable(w)[30], `goods ${code}`).toBeDefined();
      expect(w.meta.maxLevel).toBe(30);
      expect(["Rare", "Legendary"]).toContain(w.meta.rarity);
      for (const b of w.bonuses) {
        expect(b.values.length, `${code}/${b.type}`).toBe(30);
        expect(b.values.every((v) => typeof v === "number" && Number.isFinite(v))).toBe(true);
      }
    }
  });

  // Remplace l'ancien test « label + format dictionaries » : le volet format est
  // devenu sans objet — `getBonusFormat` / `PERCENT_TYPES` / `INTEGER_TYPES` ont
  // disparu, le format est porté en donnée sur chaque bonus. Le volet libellé
  // survit, et sa liste de trous tolérés est passée de 2 à 0 (les deux clés
  // orphelines, `rp_per_day` et `carcassonne_recruitment_time_reduction`, sont
  // désormais déclarées dans BONUS_LABELS).
  it("every generated bonus type has a declared label — no fallback title-case", () => {
    const noLabel = new Set<string>();
    for (const code of WONDER_CODES)
      for (const b of WONDERS[code].bonuses) {
        if (!(b.type in BONUS_LABELS)) noLabel.add(b.type);
      }
    expect([...noLabel].sort()).toEqual([]);
  });

  it("format is carried as data, never re-derived from the type", () => {
    for (const code of WONDER_CODES)
      for (const b of WONDERS[code].bonuses) {
        expect(["percent", "integer", "flat"], `${code}/${b.type}`).toContain(b.format);
      }
    // Le cas qui a motivé la promotion : l'extraction dit `percent`
    // (WonderContributionBoostDTO, scale 100), l'ancien INTEGER_TYPES disait
    // `integer` → l'UI affichait « +42 » au lieu de « +42 % ».
    const gears = WONDERS["CoR"].bonuses.find((b) => b.type === "donation_gears");
    expect(gears?.format).toBe("percent");
    // Notation du jeu : espace avant le signe, virgule décimale au besoin.
    expect(formatBonusValue(gears!.format, gears!.values[29])).toBe("+42 %");
  });

  it("bonus types are canonical and summable — rank lives in `instance`", () => {
    for (const code of WONDER_CODES) {
      const byType = new Map<string, number[]>();
      for (const b of WONDERS[code].bonuses) {
        expect(b.type, `${code}/${b.type}`).not.toMatch(/_(secondary|tertiary|quaternary)$/);
        expect(b.instance, `${code}/${b.type}`).toBeGreaterThanOrEqual(1);
        byType.set(b.type, [...(byType.get(b.type) ?? []), b.instance]);
      }
      // Les rangs d'un même type sont 1..n, sans trou ni doublon.
      for (const [type, ranks] of byType) {
        expect([...ranks].sort((a, b) => a - b), `${code}/${type}`).toEqual(
          ranks.map((_, i) => i + 1),
        );
      }
    }
    // Petra porte deux boosts de biens : cité alliée puis capitale. C'est ce que
    // `goods_production_secondary` masquait.
    const petra = WONDERS["P"].bonuses.filter((b) => b.type === "goods_production");
    expect(petra.map((b) => b.instance)).toEqual([1, 2]);
    // ⚠️ « Boost », pas « Production » : `goods_production` est un POURCENTAGE
    // appliqué à une production, pas la production elle-même — c'est
    // `goods_output` qui la porte, sous le nom nu « Goods ». Le renommage de
    // 30170cd rend la distinction visible à l'écran ; ce qui est vérifié ici
    // n'est pas le mot mais le SUFFIXE DE RANG, qui vit dans `instance`.
    expect(getBonusLabel(petra[0].type, petra[0].instance)).toBe("Goods Boost");
    expect(getBonusLabel(petra[1].type, petra[1].instance)).toBe("Goods Boost (2nd)");
  });

  it("scope carries the narrowing that used to live only in the icon", () => {
    const petra = WONDERS["P"].bonuses.filter((b) => b.type === "goods_production");
    expect(petra[0].scope).toEqual({ kind: "city", value: "City_Arabia" });
    expect(petra[1].scope).toEqual({ kind: "city", value: "City_Capital" });
    // L'icône reste le canal d'affichage, inchangée.
    expect(petra[0].icons).toEqual(["good", "arabia"]);

    for (const code of WONDER_CODES)
      for (const b of WONDERS[code].bonuses) {
        if (b.scope === null) continue;
        expect(["city", "buildingGroup", "unitType"], `${code}/${b.type}`).toContain(
          b.scope.kind,
        );
        expect(b.scope.value.length, `${code}/${b.type}`).toBeGreaterThan(0);
      }
  });

  it("W14 — Hanging Gardens & Lighthouse land in Ancient World", () => {
    expect(WONDERS["HG"].meta.group).toBe("Ancient World");
    expect(WONDERS["HG"].meta.groupCode).toBe("AW");
    expect(WONDERS["LoA"].meta.group).toBe("Ancient World");
    expect(WONDERS["LoA"].meta.groupCode).toBe("AW");
    expect(getCostTables(WONDERS["HG"]).coinTable[2]).toEqual([{ amount: 2500, gears: 2 }]);
  });

  it("synergy panel still computes over the full 28-wonder set", () => {
    expect(getResolvedBonuses(WONDERS["HG"], 31)).toEqual([]);
    const all = computeSynergies(WONDER_CODES);
    expect(all.length).toBe(28);
    expect(all.filter((s) => s.synergyActive).length).toBeGreaterThan(0);
    const counts = computeTagCounts(WONDER_CODES);
    expect(Object.keys(counts).length).toBe(7);
  });
});
