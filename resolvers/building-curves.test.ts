import { describe, it, expect } from "vitest";

import { BUILDING_EXTRACT } from "@/data/buildings/generated/buildings.generated";

import { findBonuses, resolveByAgeAndLevel, resolveByLevel, resolveBonus } from "./building-curves";

const EVOLVING = BUILDING_EXTRACT.buildings.filter((b) => b.buildingType === "evolving");

/** Le seul bonus d'un type donné sur une chaîne — les cas testés n'en ont qu'un. */
function only(group: string, type: string) {
  const bonuses = findBonuses(`City_Capital|${group}`, type);
  expect(bonuses, `${group} / ${type}`).toHaveLength(1);
  return bonuses[0];
}

// ─────────────────────────────────────────────────────────────────────────────
// Les attendus sont relevés à la main dans `source/gamedesign.json`, pas repris
// de la sortie de l'extraction.
// ─────────────────────────────────────────────────────────────────────────────

describe("axe âge × niveau — points de culture", () => {
  const bonus = only("evolvingAqueduct", "culture_points");

  it("lit la table de l'âge demandé, pas celle de l'ère du joueur", () => {
    const curve = bonus.ageCurve!;
    // Dv_…_Aqueduct_1_CultureValues_ClassicGreece : values[when=1] = 95.
    expect(resolveByAgeAndLevel(curve, "ClassicGreece", 1)?.amount).toBe(95);
    // …_StoneAge : formule "(#level + 18) * 2" → 38 au niveau 1.
    expect(resolveByAgeAndLevel(curve, "StoneAge", 1)?.amount).toBe(38);
    // …_LateGothicEra : "(#level + 18) * 15" → 285.
    expect(resolveByAgeAndLevel(curve, "LateGothicEra", 1)?.amount).toBe(285);
  });

  it("prolonge par la formule au-delà du dernier palier tabulé", () => {
    // Table à une seule ligne (when=1) ; "(#level + 18) * 5" au-delà.
    expect(resolveByAgeAndLevel(bonus.ageCurve!, "ClassicGreece", 60)?.amount).toBe(390);
    expect(resolveByAgeAndLevel(bonus.ageCurve!, "ClassicGreece", 30)?.amount).toBe(240);
  });

  it("couvre les 14 âges du projet, un par un", () => {
    const covered = bonus.ageCurve!.entries.flatMap((e) => e.appliesTo);
    expect(covered).toHaveLength(14);
    expect(new Set(covered).size).toBe(14);
  });
});

describe("axe âge × niveau — production de biens", () => {
  const bonus = only("evolvingAqueduct", "goods_output");

  it("le montant et la RESSOURCE changent avec l'âge", () => {
    // Dac_…_CEGoods_RomanEmpireAndLater : values[when=1] = 75, en rang nu.
    expect(resolveByAgeAndLevel(bonus.ageCurve!, "RomanEmpire", 1)).toEqual({
      amount: 75,
      resources: ["primary", "secondary", "tertiary"],
    });
    // Sous MinoanEra le game design verse les biens de l'ère PRÉCÉDENTE.
    expect(resolveByAgeAndLevel(bonus.ageCurve!, "MinoanEra", 1)?.resources).toEqual([
      "primary_me",
      "secondary_me",
      "tertiary_me",
    ]);
    expect(resolveByAgeAndLevel(bonus.ageCurve!, "StoneAge", 1)?.resources).toEqual([
      "primary_ba",
      "secondary_ba",
      "tertiary_ba",
    ]);
  });

  it("le dernier âge tabulé gouverne tous les suivants", () => {
    // La table s'arrête à RomanEmpire (`…_RomanEmpireAndLater`).
    const entry = bonus.ageCurve!.entries.at(-1)!;
    expect(entry.age).toBe("RomanEmpire");
    expect(entry.appliesTo).toHaveLength(9);
    // "(#level * 5.5) + 69" au niveau 60.
    expect(resolveByAgeAndLevel(bonus.ageCurve!, "LateGothicEra", 60)?.amount).toBe(399);
    expect(resolveByAgeAndLevel(bonus.ageCurve!, "RomanEmpire", 60)?.amount).toBe(399);
  });

  it("la période de production reste le cycle de 24 h", () => {
    expect(bonus.periodSeconds).toBe(86_400);
  });
});

describe("axe âge × niveau — table qui saute un âge", () => {
  const bonus = only("evolvingHydra", "goods_output");

  it("`BronzeAge` retombe sur le palier `StoneAge`", () => {
    // Dac_…_Hydra_1_Goods ne liste pas BronzeAge (§4.1, palier sur l'ordre des âges).
    expect(bonus.ageCurve!.entries[0].appliesTo).toEqual(["StoneAge", "BronzeAge"]);
    expect(resolveByAgeAndLevel(bonus.ageCurve!, "BronzeAge", 30)?.amount).toBe(
      resolveByAgeAndLevel(bonus.ageCurve!, "StoneAge", 30)?.amount,
    );
  });

  it("rend `null` sous le premier palier plutôt que d'extrapoler (D13)", () => {
    // …_Goods_StoneAge commence à when=3.
    expect(resolveByAgeAndLevel(bonus.ageCurve!, "StoneAge", 1)?.amount).toBeNull();
    expect(resolveByAgeAndLevel(bonus.ageCurve!, "StoneAge", 3)?.amount).toBe(12);
    // Dernier palier tabulé 40 → 55, puis "(#level * 1.15) + 9".
    expect(resolveByAgeAndLevel(bonus.ageCurve!, "StoneAge", 40)?.amount).toBe(55);
    expect(resolveByAgeAndLevel(bonus.ageCurve!, "StoneAge", 60)?.amount).toBe(78);
  });

  it("rend `null` pour un âge qu'aucune entrée ne gouverne", () => {
    expect(resolveByAgeAndLevel(bonus.ageCurve!, "DawnAge", 10)).toBeNull();
  });
});

describe("valeurs calculées en Lua — mêmes fonctions de lecture", () => {
  it("la nourriture d'`evolvingAztecGardenBath` vient d'un script", () => {
    const bonus = only("evolvingAztecGardenBath", "food_output");
    expect(bonus.ageCurve).toBeNull();
    expect(bonus.curve!.luaScript).toBe(
      "return math.floor((4191 * entityLevel ^ 0.6) / 50 + 0.5) * 50",
    );
    expect(resolveByLevel(bonus.curve!, 1)).toBe(4200);
    expect(resolveByLevel(bonus.curve!, 10)).toBe(16_700);
    expect(resolveByLevel(bonus.curve!, 60)).toBe(48_900);
    expect(resolveBonus(bonus, "ClassicGreece", 1)).toEqual({
      amount: 4200,
      resources: ["food"],
    });
  });

  it("le boost de biens d'`evolvingBabaYaga` vient d'un script", () => {
    // ⚠️ Clé `building_type_production`, pas `goods_production` : dans la
    // capitale, un boost de biens EST le « Workshop Production Boost » du
    // bâtiment d'héritage (`Base.BuildingTypes.Good` = « Workshops » dans la
    // loca). Voir `projectResourceBoost()` dans scripts/extract/buildings.ts.
    const bonus = only("evolvingBabaYaga", "building_type_production");
    expect(bonus.curve!.luaScript).toBe("return 0.030 + 0.0022 * entityLevel");
    expect(resolveByLevel(bonus.curve!, 1)).toBe(0.0322);
    expect(resolveByLevel(bonus.curve!, 60)).toBe(0.162);
  });
});

describe("axe niveau seul — production sans dimension d'âge", () => {
  const bonus = only("evolvingElysianField", "research_points_output");

  it("la formule verse des points là où la table ne tabule qu'un coffre", () => {
    expect(bonus.ageCurve).toBeNull();
    // …_RP_Chest : 16 lignes sans ressource nommée (arbre de récompense, §7),
    // puis "(#level / 6) - 1.7" au-delà du palier 38.
    expect(resolveByLevel(bonus.curve!, 10)).toBeNull();
    expect(resolveByLevel(bonus.curve!, 60)).toBe(8.3);
    expect(bonus.resource).toBe("research_points");
  });
});

describe("non-régression sur les 44 `evolving`", () => {
  it("plus aucun avertissement", () => {
    const warnings = EVOLVING.flatMap((c) => [...c.warnings, ...c.levels.flatMap((l) => l.warnings)]);
    expect(warnings).toEqual([]);
  });

  it("toute production dynamique et tout point de culture porte une courbe", () => {
    const unresolved = EVOLVING.flatMap((chain) =>
      chain.levels
        .flatMap((l) => l.bonuses)
        .filter(
          (b) =>
            (b.componentType === "ProductionComponentDTO" || b.type === "culture_points") &&
            b.curve === null &&
            b.ageCurve === null &&
            b.value === null,
        )
        .map((b) => `${chain.group} / ${b.type}`),
    );
    expect(unresolved).toEqual([]);
  });

  it("un bonus à courbe d'âge ne porte pas de ressource unique", () => {
    for (const chain of EVOLVING) {
      for (const bonus of chain.levels.flatMap((l) => l.bonuses)) {
        if (bonus.ageCurve === null) continue;
        expect(bonus.resource, chain.group).toBeNull();
        expect(bonus.curve, chain.group).toBeNull();
      }
    }
  });
});
