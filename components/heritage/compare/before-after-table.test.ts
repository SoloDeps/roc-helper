import { describe, expect, it } from "vitest";

import { buildBeforeAfterRows, type BonusLike } from "./before-after-table";

function bonus(label: string, value: string): BonusLike {
  return { key: label, src: "/images/goods/default.webp", label, value };
}

describe("buildBeforeAfterRows — lecture des séparateurs de milliers", () => {
  it("480 → 1 460 monte (espace insécable comme séparateur)", () => {
    const rows = buildBeforeAfterRows([bonus("ATK", "480")], [bonus("ATK", "1 460")]);
    expect(rows).toHaveLength(1);
    expect(rows[0].tone).toBe("up");
    expect(rows[0].before).toBe("480");
    expect(rows[0].after).toBe("1 460");
  });

  it("1,460 → 2,920 monte (virgule, format de `formatBonusValue`)", () => {
    const rows = buildBeforeAfterRows([bonus("HP", "1,460")], [bonus("HP", "2,920")]);
    expect(rows[0].tone).toBe("up");
  });

  // `formatBonusValue("absolute", …)` abrège au-delà de 100 000 : la virgule y
  // devient DÉCIMALE (« 100,00 K ») alors qu'elle sépare les milliers en
  // dessous (« 99,999 »). Le sens de la variation ne doit pas dépendre de ce
  // changement de notation.
  it("99,999 → 100,00 K monte (passage du seuil d'abrègement)", () => {
    const rows = buildBeforeAfterRows([bonus("Food", "99,999")], [bonus("Food", "100,00 K")]);
    expect(rows[0].tone).toBe("up");
  });

  it("446,50 K → 1,20 M monte, et l'inverse descend", () => {
    expect(
      buildBeforeAfterRows([bonus("Food", "446,50 K")], [bonus("Food", "1,20 M")])[0].tone,
    ).toBe("up");
    expect(
      buildBeforeAfterRows([bonus("Food", "1,20 M")], [bonus("Food", "446,50 K")])[0].tone,
    ).toBe("down");
  });

  it("1 460 → 480 descend", () => {
    const rows = buildBeforeAfterRows([bonus("DEF", "1 460")], [bonus("DEF", "480")]);
    expect(rows[0].tone).toBe("down");
  });

  it("lit un pourcentage signé", () => {
    const rows = buildBeforeAfterRows(
      [bonus("Crit", "+6.0%")],
      [bonus("Crit", "+8.0%")],
    );
    expect(rows[0].tone).toBe("up");
  });

  it("deux valeurs identiques restent neutres", () => {
    const rows = buildBeforeAfterRows([bonus("SPD", "100")], [bonus("SPD", "100")]);
    expect(rows[0].tone).toBe("neutral");
  });

  it("un bonus présent seulement après est « nouveau »", () => {
    const rows = buildBeforeAfterRows([], [bonus("Lifesteal", "+5%")]);
    expect(rows).toHaveLength(1);
    expect(rows[0].tone).toBe("new");
    expect(rows[0].before).toBeUndefined();
  });

  it("deux bonus de même libellé restent DEUX lignes distinctes", () => {
    const rows = buildBeforeAfterRows(
      [
        { ...bonus("Goods Output", "330"), key: "effect_1#goods_output#1" },
        { ...bonus("Goods Output", "120"), key: "effect_2#goods_output#1" },
      ],
      [
        { ...bonus("Goods Output", "440"), key: "effect_1#goods_output#1" },
        { ...bonus("Goods Output", "120"), key: "effect_2#goods_output#1" },
      ],
    );
    expect(rows).toHaveLength(2);
    expect(rows.map((row) => row.tone)).toEqual(["up", "neutral"]);
    expect(new Set(rows.map((row) => row.key)).size).toBe(2);
  });

  it("un bonus présent seulement avant est « perdu »", () => {
    const rows = buildBeforeAfterRows([bonus("Dodge", "+10%")], []);
    expect(rows).toHaveLength(1);
    expect(rows[0].tone).toBe("lost");
    expect(rows[0].after).toBeUndefined();
  });
});
