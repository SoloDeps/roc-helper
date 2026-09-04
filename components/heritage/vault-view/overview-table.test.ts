import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { resolveHeritageVault } from "@/resolvers/heritage";
import { describeCultureEffect } from "@/components/heritage/effect-display";
import { OverviewTable } from "./overview-table";

// ============================================================
// Deux régressions du tableau « All tiers ».
//
//  1. La Culture (`culture_points` + `culture_range`) doit tenir sur UNE seule
//     ligne, pas deux — l'extraction, elle, reste correcte avec deux bonus
//     séparés (`resolvers/bonus.ts::BONUS_LABELS`) : la fusion est un choix
//     d'AFFICHAGE uniquement (`describeCultureEffect`).
//  2. Un effet sans bonus nommable mais avec un coffre (`rewards`) ne doit pas
//     disparaître du tableau — `heritage_japan` / `Heritage_Japan_Effect_4`
//     (minLevel 21, `bonuses: []`, `rewards` non vide) en est l'exemple réel.
//
// ⚠️ `OverviewTable` rend DEUX mises en page de la même donnée — une liste sous
// 768 px, le tableau au-dessus (l'une des deux est masquée en CSS). Les deux
// doivent porter les mêmes paliers : d'où `layout()`, qui isole l'une puis
// l'autre. Compter sur le HTML entier compterait tout en double et laisserait
// passer une régression qui ne toucherait qu'un seul des deux rendus.
// ============================================================

/** Le fragment de HTML d'une seule des deux mises en page. */
function layout(html: string, which: "list" | "table") {
  const start = html.indexOf(`data-layout="${which}"`);
  expect(start).toBeGreaterThan(-1);
  const other = html.indexOf(`data-layout="${which === "list" ? "table" : "list"}"`);
  return other > start ? html.slice(start, other) : html.slice(start);
}

describe("`describeCultureEffect`", () => {
  it("combine points et portée en une seule ligne au format « valeur (portée x portée) »", () => {
    const vault = resolveHeritageVault("heritage_celtic", 60, "CG")!;
    const effect = vault.effects.find((e) =>
      e.bonuses.some((b) => b.type === "culture_points"),
    )!;
    const display = describeCultureEffect(effect.bonuses, [])!;
    expect(display).not.toBeNull();

    const points = effect.bonuses.find((b) => b.type === "culture_points")!;
    const range = effect.bonuses.find((b) => b.type === "culture_range")!;
    // Pas de « + » : les points de culture sont un TOTAL apporté par le
    // bâtiment, pas un delta — c'est ce qu'affiche le jeu (« 496 (1x1) »).
    expect(display.value).toBe(`${points.value} (${range.value}x${range.value})`);
    // `label` NOMME l'effet, `value` porte le chiffre. Les deux ont longtemps
    // porté la même chaîne combinée, et toute vue qui attend un libellé —
    // la colonne de gauche du tableau avant/après de l'onglet Sacrifice, son
    // popover sur écran étroit — annonçait la ligne « +2040 (4x4) · (4x4) ».
    expect(display.label).toBe("Culture");
    expect(display.detail).toBeNull();
  });

  it("rend `null` quand un effet n'a qu'un des deux bonus de culture", () => {
    const onlyPoints = [
      {
        type: "culture_points",
        label: "Culture Points",
        format: "integer" as const,
        scope: null,
        instance: 1,
        value: 100,
        resources: [],
        periodSeconds: null,
      },
    ];
    expect(describeCultureEffect(onlyPoints, [])).toBeNull();
  });
});

describe("`OverviewTable`", () => {
  it("rend la Culture sur une seule ligne, avec le libellé « Culture » — pas la valeur combinée", () => {
    const vault = resolveHeritageVault("heritage_celtic", 60, "CG")!;
    const html = renderToStaticMarkup(createElement(OverviewTable, { vault, selections: [] }));

    // Ce tableau liste des paliers, pas des valeurs : contrairement aux
    // cartes/badges, la Culture s'y affiche comme texte « Culture », pas
    // comme icône + valeur combinée (`describeCultureEffect` n'est utilisé
    // ici que pour son icône).
    for (const which of ["list", "table"] as const) {
      const rows = layout(html, which).split(`alt="Culture"`).length - 1;
      expect(rows, which).toBe(1);
    }
  });

  it("garde un effet sans bonus mais avec un coffre — le palier n'est pas silencieusement perdu", () => {
    const vault = resolveHeritageVault("heritage_japan", 60, "CG")!;
    const effect = vault.effects.find((e) => e.id === "Heritage_Japan_Effect_4")!;
    expect(effect.bonuses).toHaveLength(0);
    expect(effect.rewards).not.toBeNull();

    const html = renderToStaticMarkup(createElement(OverviewTable, { vault, selections: [] }));
    expect(layout(html, "list")).toContain("Chest reward");
    expect(layout(html, "table")).toContain("Chest reward");
    // Le niveau affiché doit être celui de l'EFFET, pas un niveau générique.
    expect(layout(html, "list")).toContain(`Lv. ${effect.minLevel}<`);
    expect(layout(html, "table")).toContain(`>${effect.minLevel}<`);
  });
});