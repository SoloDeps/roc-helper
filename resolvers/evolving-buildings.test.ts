import { describe, it, expect } from "vitest";

import {
  EVOLVING_BUILDINGS,
  getEvolvingBuilding,
  getUpgradeCost,
  resolveEvolvingBuilding,
  resolveOwned,
  type OwnedEvolvingBuilding,
  type ResolvedEvolvingBonus,
} from "./evolving-buildings";

/** Le seul effet d'un type donné dans un groupe résolu. */
function pick(bonuses: ResolvedEvolvingBonus[], type: string): ResolvedEvolvingBonus {
  const found = bonuses.filter((b) => b.type === type);
  expect(found, type).toHaveLength(1);
  return found[0];
}

describe("catalogue", () => {
  it("expose les 44 bâtiments évolutifs, tous à 60 niveaux", () => {
    expect(EVOLVING_BUILDINGS).toHaveLength(44);
    for (const building of EVOLVING_BUILDINGS) {
      expect(building.maxLevel, building.key).toBe(60);
      expect(building.key, building.chainKey).toMatch(/^evolving_/);
    }
  });

  it("`starLevels` reprend les paliers d'étoiles du game design", () => {
    expect(getEvolvingBuilding("evolving_aqueduct")?.starLevels).toEqual([10, 20, 30, 40, 60]);
    // 3 des 44 sont décalés d'un niveau (03-batiments.md B9).
    expect(getEvolvingBuilding("evolving_hydra")?.starLevels).toEqual([11, 21, 31, 41, 60]);
  });

  it("une clé inconnue rend `null` plutôt que de lever", () => {
    expect(getEvolvingBuilding("evolving_inexistant")).toBeNull();
    expect(resolveEvolvingBuilding("evolving_inexistant", 1, "SA")).toBeNull();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Les attendus viennent de `source/gamedesign.json`, pas de la sortie résolue.
// ─────────────────────────────────────────────────────────────────────────────

describe("evolving_aqueduct — production, culture et bonus passif", () => {
  it("le même niveau rend des valeurs différentes selon l'ère de l'exemplaire", () => {
    const cg = resolveEvolvingBuilding("evolving_aqueduct", 1, "CG")!;
    const lg = resolveEvolvingBuilding("evolving_aqueduct", 1, "LG")!;

    // Dv_…_CultureValues_<âge>, values[when=1] : 95 en ClassicGreece.
    expect(pick(cg.culture, "culture_points").value).toBe(95);
    // …_LateGothicEra : "(#level + 18) * 15" → 285.
    expect(pick(lg.culture, "culture_points").value).toBe(285);

    // La portée, elle, ne dépend que du niveau : "(#level / 30) + 1".
    expect(pick(cg.culture, "culture_range").value).toBe(pick(lg.culture, "culture_range").value);
  });

  it("la production porte sa période et ses ressources datées", () => {
    const me = resolveEvolvingBuilding("evolving_aqueduct", 1, "ME")!;
    const production = pick(me.production, "goods_output");
    expect(production.periodSeconds).toBe(86_400);
    // Sous MinoanEra le bâtiment verse les biens de l'ère précédente.
    expect(production.resources).toEqual(["primary_me", "secondary_me", "tertiary_me"]);

    // Dac_…_CEGoods_RomanEmpireAndLater : values[when=1] = 75, en rang nu.
    const re = resolveEvolvingBuilding("evolving_aqueduct", 1, "RE")!;
    const late = pick(re.production, "goods_output");
    expect(late.value).toBe(75);
    expect(late.resources).toEqual(["primary", "secondary", "tertiary"]);
    // "(#level * 5.5) + 69" au niveau 60.
    expect(pick(resolveEvolvingBuilding("evolving_aqueduct", 60, "RE")!.production, "goods_output").value).toBe(399);
  });

  it("le bonus passif ne dépend que du niveau", () => {
    const at1 = resolveEvolvingBuilding("evolving_aqueduct", 1, "SA")!;
    const at60 = resolveEvolvingBuilding("evolving_aqueduct", 60, "LG")!;
    // Dusc_Aqueduct_InfantryAttackBoost × modifier 0.01, en pourcent.
    expect(pick(at1.bonuses, "infantry_damage").format).toBe("percent");
    expect(pick(at1.bonuses, "infantry_damage").value).toBe(0.01);
    expect(pick(at60.bonuses, "infantry_damage").value).toBe(0.0825);
  });

  it("les étoiles suivent les paliers", () => {
    expect(resolveEvolvingBuilding("evolving_aqueduct", 9, "SA")!.stars).toBe(0);
    expect(resolveEvolvingBuilding("evolving_aqueduct", 10, "SA")!.stars).toBe(1);
    expect(resolveEvolvingBuilding("evolving_aqueduct", 59, "SA")!.stars).toBe(4);
    expect(resolveEvolvingBuilding("evolving_aqueduct", 60, "SA")!.stars).toBe(5);
  });
});

describe("evolving_aztec_main_temple — culture et stat d'unité, sans production de biens", () => {
  it("résout la culture sur l'axe de l'ère", () => {
    const sa = resolveEvolvingBuilding("evolving_aztec_main_temple", 10, "SA")!;
    const hm = resolveEvolvingBuilding("evolving_aztec_main_temple", 10, "HM")!;
    const saPoints = pick(sa.culture, "culture_points").value!;
    const hmPoints = pick(hm.culture, "culture_points").value!;
    expect(hmPoints).toBeGreaterThan(saPoints);
  });

  it("porte un bonus de cavalerie et aucune sortie de biens", () => {
    const resolved = resolveEvolvingBuilding("evolving_aztec_main_temple", 30, "CG")!;
    expect(pick(resolved.bonuses, "cavalry_damage").format).toBe("percent");
    expect(resolved.production.map((b) => b.type)).toEqual([]);
  });
});

describe("evolving_dracula_castle — production et réduction de recrutement", () => {
  it("range la réduction de recrutement dans les bonus, pas dans la production", () => {
    const resolved = resolveEvolvingBuilding("evolving_dracula_castle", 20, "RE")!;
    const reduction = pick(resolved.bonuses, "recruitment_time_reduction");
    expect(reduction.periodSeconds).toBeNull();
    // Boost_…_RangedRecTimeReduction, values[when=18] = 0.065.
    expect(reduction.value).toBe(0.065);
    expect(reduction.scope).toEqual({ kind: "buildingGroup", value: "rangedBarracks" });
    expect(resolved.production.map((b) => b.type)).toEqual(["goods_output"]);
  });
});

describe("coût de montée en jetons d'évolution", () => {
  it("est indexé par le niveau de départ", () => {
    // Dac_…_Aqueduct_1_UpgradeCosts : when 1→1, 16→2, 20→3, 38→7.
    expect(getUpgradeCost("evolving_aqueduct", 1)).toEqual({
      fromLevel: 1,
      toLevel: 2,
      evolution_tokens: 1,
    });
    expect(getUpgradeCost("evolving_aqueduct", 15)?.evolution_tokens).toBe(1);
    expect(getUpgradeCost("evolving_aqueduct", 16)?.evolution_tokens).toBe(2);
    expect(getUpgradeCost("evolving_aqueduct", 38)?.evolution_tokens).toBe(7);
  });

  it("tronque la formule qui prolonge le barème", () => {
    // "-1 * (#level / 5)" au-delà du palier 38 : 11,8 au niveau 59.
    expect(getUpgradeCost("evolving_aqueduct", 59)?.evolution_tokens).toBe(11);
  });

  it("est `null` au niveau maximal — on ne quitte pas le dernier niveau", () => {
    expect(getUpgradeCost("evolving_aqueduct", 60)).toBeNull();
    const resolved = resolveEvolvingBuilding("evolving_aqueduct", 60, "CG")!;
    expect(resolved.atMaxLevel).toBe(true);
    expect(resolved.upgradeCost).toBeNull();
  });

  it("les 44 ont un barème, au niveau 1 comme au niveau 59", () => {
    for (const building of EVOLVING_BUILDINGS) {
      expect(getUpgradeCost(building.key, 1)?.evolution_tokens, building.key).toBeGreaterThan(0);
      expect(getUpgradeCost(building.key, 59)?.evolution_tokens, building.key).toBeGreaterThan(0);
    }
  });
});

describe("état possédé", () => {
  it("`resolveOwned` est le même appel au départ de l'état stocké", () => {
    const owned: OwnedEvolvingBuilding = { key: "evolving_aqueduct", level: 30, era: "CG" };
    expect(resolveOwned(owned)).toEqual(resolveEvolvingBuilding("evolving_aqueduct", 30, "CG"));
  });

  it("borne un niveau hors plage plutôt que de le refuser", () => {
    expect(resolveEvolvingBuilding("evolving_aqueduct", 0, "CG")!.level).toBe(1);
    expect(resolveEvolvingBuilding("evolving_aqueduct", 999, "CG")!.level).toBe(60);
  });
});
