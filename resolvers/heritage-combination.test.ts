import { describe, expect, it } from "vitest";

import {
  combinationKey,
  combinationRuleFor,
  combineBonuses,
  planAcrossKeeper,
  planForTarget,
  regenerationReadouts,
  stackedLines,
  type OptimizerSource,
  type CombinableBonus,
  type CombinationSource,
} from "./heritage-combination";
import {
  amplifyBonusValue,
  getEquippedEffects,
  getKeeperReputationCost,
  getUpgradeCostTiers,
  keeperAmplifierMultiplier,
  resolveHeritageVault,
  tokensFromBuildingLevels,
  tokensToVaultLevel,
} from "./heritage";
import { resolveEvolvingBuilding } from "./evolving-buildings";

// ============================================================
// Le cumul d'un thème d'héritage.
//
// Deux moitiés : des cas construits à la main pour les règles de composition,
// puis le cas RÉEL du thème ATH — l'Épave, la Forteresse Pirate et le bâtiment
// d'héritage — qui est la raison d'être de tout le module.
// ============================================================

/** Un bonus minimal, pour éprouver une règle sans dépendre de la donnée. */
function bonus(overrides: Partial<CombinableBonus> & { type: string }): CombinableBonus {
  return {
    label: overrides.type,
    value: 0,
    format: "percent",
    scope: null,
    instance: 1,
    resources: [],
    periodSeconds: null,
    ...overrides,
  };
}

function source(
  id: string,
  bonuses: CombinableBonus[],
  kind: CombinationSource["kind"] = "evolving",
): CombinationSource {
  return { id, name: id, kind, bonuses };
}

describe("règles de composition", () => {
  it("additionne les pourcentages et les quantités", () => {
    expect(combinationRuleFor("regeneration_speed")).toBe("sum");
    expect(combinationRuleFor("goods_output")).toBe("sum");
    expect(combinationRuleFor("culture_points")).toBe("sum");
    expect(combinationRuleFor("worker_slots")).toBe("sum");
  });

  it("prend le MAXIMUM des plafonds, quel que soit leur domaine", () => {
    // La loca dit « Raises the regeneration cap … **to** {1} » : le boost POSE
    // le plafond, il ne l'incrémente pas.
    expect(combinationRuleFor("regeneration_cap")).toBe("max");
    expect(combinationRuleFor("research_point_cap")).toBe("max");
  });

  it("ne cumule PAS une portée de culture — deux zones ne font pas une zone double", () => {
    expect(combinationRuleFor("culture_range")).toBe("none");
    // ⚠️ Son voisin immédiat de composant, lui, s'additionne : c'est un total de
    // points apporté à la ville, pas une géométrie.
    expect(combinationRuleFor("culture_points")).toBe("sum");
  });

  it("additionne bien, prend bien le max, et ne totalise pas l'incumulable", () => {
    const lines = combineBonuses([
      source("a", [
        bonus({ type: "regeneration_speed", value: 0.45 }),
        bonus({ type: "regeneration_cap", value: 7, format: "integer" }),
        bonus({ type: "culture_range", value: 4, format: "integer" }),
      ]),
      source("b", [
        bonus({ type: "regeneration_speed", value: 0.305 }),
        bonus({ type: "regeneration_cap", value: 9, format: "integer" }),
        bonus({ type: "culture_range", value: 4, format: "integer" }),
      ]),
    ]);
    const total = (type: string) => lines.find((l) => l.sample.type === type)!.total;
    expect(total("regeneration_speed")).toBeCloseTo(0.755, 9);
    expect(total("regeneration_cap")).toBe(9);
    expect(total("culture_range")).toBeNull();
  });
});

describe("identité d'une stat", () => {
  it("sépare deux portées différentes — deux casernes ne se cumulent pas", () => {
    const infantry = bonus({
      type: "recruitment_time_reduction",
      value: 0.2,
      scope: { kind: "buildingGroup", value: "infantryBarracks" },
    });
    const heavy = bonus({
      type: "recruitment_time_reduction",
      value: 0.3,
      scope: { kind: "buildingGroup", value: "heavyInfantryBarracks" },
    });
    // Et le bonus SANS portée du vault ATH, qui vaut pour toutes les casernes,
    // reste une troisième ligne : le cumuler avec l'une des deux affirmerait
    // qu'il ne vaut que pour celle-là.
    const all = bonus({ type: "recruitment_time_reduction", value: 0.248 });
    expect(new Set([infantry, heavy, all].map(combinationKey)).size).toBe(3);
  });

  it("sépare deux périodes — 8 500/jour et 1 200/6 h ne s'additionnent pas", () => {
    const perDay = bonus({ type: "coins_output", value: 8500, periodSeconds: 86_400 });
    const perSixHours = bonus({ type: "coins_output", value: 1200, periodSeconds: 21_600 });
    expect(combinationKey(perDay)).not.toBe(combinationKey(perSixHours));
  });

  it("sépare deux ressources, mais IGNORE l'ordre où elles sont écrites", () => {
    const wheat = bonus({ type: "goods_output", value: 10, resources: ["primary_ba"] });
    const wine = bonus({ type: "goods_output", value: 10, resources: ["secondary_ba"] });
    expect(combinationKey(wheat)).not.toBe(combinationKey(wine));

    const ordered = bonus({ type: "goods_output", resources: ["a", "b"] });
    const shuffled = bonus({ type: "goods_output", resources: ["b", "a"] });
    expect(combinationKey(ordered)).toBe(combinationKey(shuffled));
  });

  it("IGNORE `instance` — deux répétitions d'une même stat se somment", () => {
    // ⚠️ `instance` ne compte les répétitions qu'au sein d'UN porteur. L'inclure
    // séparerait la 1ʳᵉ instance du vault de la 1ʳᵉ de l'évolutif tout en
    // laissant chacune seule — exactement l'inverse du but.
    const lines = combineBonuses([
      source("a", [
        bonus({ type: "goods_output", value: 100, format: "absolute", instance: 1 }),
        bonus({ type: "goods_output", value: 50, format: "absolute", instance: 2 }),
      ]),
    ]);
    expect(lines).toHaveLength(1);
    expect(lines[0].total).toBe(150);
  });
});

describe("valeurs manquantes et amplification", () => {
  it("ignore un niveau où le game design ne dit rien — ce n'est pas « zéro »", () => {
    const lines = combineBonuses([
      source("a", [bonus({ type: "regeneration_speed", value: null })]),
      source("b", [bonus({ type: "regeneration_speed", value: 0.3 })]),
    ]);
    expect(lines).toHaveLength(1);
    expect(lines[0].total).toBeCloseTo(0.3, 9);
    expect(lines[0].contributions.map((c) => c.sourceId)).toEqual(["b"]);
  });

  it("ne produit AUCUNE ligne pour une stat que personne ne porte à ce niveau", () => {
    expect(combineBonuses([source("a", [bonus({ type: "siege_hp", value: null })])])).toEqual([]);
  });

  it("retient la valeur AMPLIFIÉE quand la source en a une", () => {
    // Le rang de gardien n'existe que côté vault ; un évolutif n'en a pas et
    // vaut sa valeur nue. Les deux se cumulent bien sous la même clé.
    const lines = combineBonuses([
      source("vault", [bonus({ type: "regeneration_speed", value: 0.305, amplified: 0.38125 })], "vault"),
      source("wreck", [bonus({ type: "regeneration_speed", value: 0.45 })]),
    ]);
    expect(lines[0].total).toBeCloseTo(0.83125, 9);
    expect(lines[0].contributions.map((c) => c.value)).toEqual([0.38125, 0.45]);
  });
});

describe("le thème ATH, en donnée réelle", () => {
  /**
   * Le cumul du thème ATH tel que l'onglet le montrera : le vault avec SES
   * EFFETS ÉQUIPÉS seulement, puis ses deux évolutifs.
   *
   * ⚠️ Les 8 emplacements pour 10 effets sont la raison d'être de ce détour :
   * compter les 10 gonflerait le total d'un tiers et décrirait une configuration
   * que le jeu ne permet pas.
   */
  function athSources(vaultLevel: number, wreckLevel: number, fortressLevel: number) {
    const equipped: Record<string, string> = {
      Heritage_ATH_Slot_4: "Heritage_ATH_Effect_6", // vitesse de régénération
      Heritage_ATH_Slot_5: "Heritage_ATH_Effect_8", // plafond de boussoles
    };
    const vault = resolveHeritageVault("heritage_ath", vaultLevel, "BE", {
      equipped,
      keeperReputationLevel: 1,
      keeperReputationPoints: 0,
      xpProgress: 0,
    })!;
    const wreck = resolveEvolvingBuilding("evolving_treasure_wreck", wreckLevel, "BE")!;
    const fortress = resolveEvolvingBuilding("evolving_pirate_fortress", fortressLevel, "BE")!;
    const flatten = (building: typeof wreck) => [
      ...building.production,
      ...building.culture,
      ...building.bonuses,
    ];
    return [
      {
        id: "vault",
        name: "The X marks the Spot",
        kind: "vault" as const,
        bonuses: getEquippedEffects(vault).flatMap((effect) => effect.bonuses),
      },
      { id: "wreck", name: "Treasure Wreck", kind: "evolving" as const, bonuses: flatten(wreck) },
      {
        id: "fortress",
        name: "Pirate Fortress",
        kind: "evolving" as const,
        bonuses: flatten(fortress),
      },
    ];
  }

  it("cumule la vitesse de recharge de boussole du vault et de l'Épave", () => {
    // ⚠️ LE CAS QUI A MOTIVÉ TOUT ÇA. Épave 60 = 45 %, vault 30 = 30,5 % : deux
    // moitiés du même bonus, qui portaient encore récemment deux clés
    // différentes et ne pouvaient donc pas se rencontrer.
    const lines = combineBonuses(athSources(30, 60, 60));
    const speed = lines.find((line) => line.sample.type === "regeneration_speed")!;
    expect(speed.contributions.map((c) => c.sourceId)).toEqual(["vault", "wreck"]);
    expect(speed.contributions.map((c) => Number(c.value.toFixed(4)))).toEqual([0.305, 0.45]);
    expect(speed.total).toBeCloseTo(0.755, 9);
  });

  it("garde le plafond de boussoles le plus haut, sans l'additionner", () => {
    // Épave 60 pose 7, vault 60 pose 9. La somme (16) serait absurde.
    const lines = combineBonuses(athSources(60, 60, 60));
    const cap = lines.find((line) => line.sample.type === "regeneration_cap")!;
    expect(cap.rule).toBe("max");
    expect(cap.contributions.map((c) => c.value).sort((a, b) => a - b)).toEqual([7, 9]);
    expect(cap.total).toBe(9);
  });

  it("n'invente pas de cumul : la Forteresse porte SEULE le temps de recrutement", () => {
    // Le vault ATH en porte un lui aussi, mais il est sur l'effet 10 — non
    // équipé dans cette configuration. Il ne doit donc pas compter.
    const lines = combineBonuses(athSources(60, 60, 60));
    const recruit = lines.find((l) => l.sample.type === "recruitment_time_reduction")!;
    expect(recruit.contributions.map((c) => c.sourceId)).toEqual(["fortress"]);
  });

  it("`stackedLines` isole ce que le cumul apporte vraiment", () => {
    const lines = combineBonuses(athSources(30, 60, 60));
    const stacked = stackedLines(lines);
    expect(stacked.length).toBeGreaterThan(0);
    for (const line of stacked) {
      expect(line.contributions.length, line.key).toBeGreaterThan(1);
    }
    // La vitesse de régénération en fait partie ; le temps de recrutement non,
    // un seul bâtiment le porte dans cette configuration.
    const types = stacked.map((line) => line.sample.type);
    expect(types).toContain("regeneration_speed");
    expect(types).not.toContain("recruitment_time_reduction");
  });

  it("le rang de gardien amplifie la moitié « héritage », et elle seule", () => {
    const withKeeper = resolveHeritageVault("heritage_ath", 30, "BE", {
      equipped: { Heritage_ATH_Slot_4: "Heritage_ATH_Effect_6" },
      keeperReputationLevel: 26, // +25 % : `0,01 × (rang − 1)`
      keeperReputationPoints: 0,
      xpProgress: 0,
    })!;
    const wreck = resolveEvolvingBuilding("evolving_treasure_wreck", 60, "BE")!;
    const lines = combineBonuses([
      {
        id: "vault",
        name: "vault",
        kind: "vault",
        bonuses: getEquippedEffects(withKeeper).flatMap((effect) => effect.bonuses),
      },
      { id: "wreck", name: "wreck", kind: "evolving", bonuses: wreck.bonuses },
    ]);
    const speed = lines.find((line) => line.sample.type === "regeneration_speed")!;
    // 0,305 × 1,25 = 0,38125 côté vault, 0,45 nu côté Épave.
    expect(speed.contributions[0].value).toBeCloseTo(0.38125, 9);
    expect(speed.contributions[1].value).toBeCloseTo(0.45, 9);
    expect(speed.total).toBeCloseTo(0.83125, 9);
  });
});


// ============================================================
// Lectures dérivées : d'un pourcentage à un temps.
//
// La base de la boussole est de la donnée de jeu : plafond 4, une toutes les
// 5 400 s (90 min). Ces tests rejouent le calculateur communautaire, dont c'est
// la raison d'être — et le cas limite qu'il vise, la recharge instantanée.
// ============================================================

describe("lectures dérivées d'une jauge", () => {
  /** Un cumul minimal visant la boussole. */
  function compassLines(speed: number | null, cap: number | null) {
    const bonuses: CombinableBonus[] = [];
    if (speed !== null) {
      bonuses.push(
        bonus({ type: "regeneration_speed", value: speed, resources: ["treasure_hunt_attempt"] }),
      );
    }
    if (cap !== null) {
      bonuses.push(
        bonus({
          type: "regeneration_cap",
          value: cap,
          format: "integer",
          resources: ["treasure_hunt_attempt"],
        }),
      );
    }
    return combineBonuses([source("a", bonuses)]);
  }

  it("traduit le cumul en minutes, sur la base nue du jeu", () => {
    // 90 min × (1 − 83,125 %) = 15,1875 min — la case du tableur.
    const [compass] = regenerationReadouts(compassLines(0.83125, null));
    expect(compass.basePeriodSeconds).toBe(5400);
    expect(compass.baseCap).toBe(4);
    expect(compass.secondsPerUnit / 60).toBeCloseTo(15.1875, 6);
    expect(compass.instant).toBe(false);
  });

  it("relève le plafond au plus haut, jamais à la somme", () => {
    const [compass] = regenerationReadouts(compassLines(0, 9));
    expect(compass.cap).toBe(9);
    // Et un plafond plus bas que la base ne la fait pas descendre.
    expect(regenerationReadouts(compassLines(0, 2))[0].cap).toBe(4);
  });

  it("compte le temps de remplissage sur le plafond EFFECTIF", () => {
    const [compass] = regenerationReadouts(compassLines(0.5, 9));
    expect(compass.secondsPerUnit).toBe(2700);
    expect(compass.secondsToFill).toBe(2700 * 9);
  });

  it("devient INSTANTANÉ à 100 %, et ne va jamais en négatif au-delà", () => {
    const exact = regenerationReadouts(compassLines(1, null))[0];
    expect(exact.instant).toBe(true);
    expect(exact.secondsPerUnit).toBe(0);
    expect(exact.secondsToFill).toBe(0);
    // 110 % ne rend pas un temps négatif : la jauge est pleine, pas remontée.
    const beyond = regenerationReadouts(compassLines(1.1, null))[0];
    expect(beyond.instant).toBe(true);
    expect(beyond.secondsPerUnit).toBe(0);
  });

  it("un plafond seul suffit à produire une lecture, sans bonus de vitesse", () => {
    const [compass] = regenerationReadouts(compassLines(null, 7));
    expect(compass.speedBonus).toBe(0);
    expect(compass.secondsPerUnit).toBe(5400);
    expect(compass.cap).toBe(7);
  });

  it("ne rend AUCUNE lecture pour un cumul qui ne touche aucune jauge", () => {
    const lines = combineBonuses([
      source("a", [bonus({ type: "culture_points", value: 230, format: "integer" })]),
    ]);
    expect(regenerationReadouts(lines)).toEqual([]);
  });

  it("n'invente ni plafond ni cadence pour une ressource inconnue", () => {
    // ⚠️ Le pourcentage reste visible dans le tableau de cumul ; c'est le TEMPS
    // qu'on refuse d'afficher, faute de base à laquelle l'appliquer.
    const lines = combineBonuses([
      source("a", [
        bonus({ type: "regeneration_speed", value: 0.5, resources: ["ressource_inconnue"] }),
      ]),
    ]);
    expect(regenerationReadouts(lines)).toEqual([]);
  });

  it("bout en bout : le thème ATH rend le temps par boussole du tableur", () => {
    // Épave 60 (45 %) + héritage 30 amplifié au rang 26 (38,125 %) = 83,125 %,
    // et le plafond monte à 7 côté Épave, 6 côté héritage → 7.
    const withKeeper = resolveHeritageVault("heritage_ath", 30, "BE", {
      equipped: {
        Heritage_ATH_Slot_4: "Heritage_ATH_Effect_6",
        Heritage_ATH_Slot_5: "Heritage_ATH_Effect_8",
      },
      keeperReputationLevel: 26,
      keeperReputationPoints: 0,
      xpProgress: 0,
    })!;
    const wreck = resolveEvolvingBuilding("evolving_treasure_wreck", 60, "BE")!;
    const lines = combineBonuses([
      {
        id: "vault",
        name: "vault",
        kind: "vault",
        bonuses: getEquippedEffects(withKeeper).flatMap((effect) => effect.bonuses),
      },
      { id: "wreck", name: "wreck", kind: "evolving", bonuses: wreck.bonuses },
    ]);
    const [compass] = regenerationReadouts(lines);
    expect(compass.resource).toBe("treasure_hunt_attempt");
    expect(compass.speedBonus).toBeCloseTo(0.83125, 9);
    expect(compass.secondsPerUnit / 60).toBeCloseTo(15.1875, 6);
    expect(compass.cap).toBe(7);
    expect(compass.secondsToFill / 60).toBeCloseTo(106.3125, 6);
  });
});


// ============================================================
// L'optimiseur.
//
// La question du joueur : « il me manque combien, et où je mets mes jetons ? »
// Le cas de référence est celui du tableur communautaire — atteindre la
// régénération instantanée sur le thème ATH — dont la réponse est connue :
// depuis un vault niveau 30 avec l'Épave au maximum et un gardien à +25 %, il
// faut monter le vault au niveau 46, soit 1 974 jetons.
// ============================================================

/** Un porteur artificiel : gain et coût linéaires, pour éprouver l'arbitrage. */
function linearSource(
  id: string,
  options: { currentLevel?: number; maxLevel: number; costPerLevel: number; gainPerLevel: number },
): OptimizerSource {
  const current = options.currentLevel ?? 1;
  return {
    id,
    name: id,
    kind: "evolving",
    currentLevel: current,
    maxLevel: options.maxLevel,
    costTo: (level) => (level - current) * options.costPerLevel,
    contributionAt: (level) => level * options.gainPerLevel,
  };
}

describe("optimiseur", () => {
  it("ne propose rien quand la cible est déjà atteinte", () => {
    const plan = planForTarget(
      [linearSource("a", { currentLevel: 10, maxLevel: 20, costPerLevel: 5, gainPerLevel: 1 })],
      "sum",
      10,
    );
    expect(plan.reached).toBe(true);
    expect(plan.steps).toEqual([]);
    expect(plan.totalTokens).toBe(0);
  });

  it("met les jetons sur le porteur le plus RENTABLE, pas le moins cher", () => {
    // `cher` coûte 10 par niveau mais rapporte 5 ; `radin` coûte 1 et rapporte
    // 0,1. Pour 10 points, `cher` demande 20 jetons, `radin` en demanderait 100.
    const plan = planForTarget(
      [
        linearSource("radin", { maxLevel: 200, costPerLevel: 1, gainPerLevel: 0.1 }),
        linearSource("cher", { maxLevel: 60, costPerLevel: 10, gainPerLevel: 5 }),
      ],
      "sum",
      10,
    );
    expect(plan.reached).toBe(true);
    expect(plan.steps.map((step) => step.sourceId)).toEqual(["cher"]);
  });

  it("trouve encore le porteur qui ne paie qu'à un niveau TARDIF", () => {
    // Le cas pour lequel la frontière existe, et celui que l'élagage par borne
    // pourrait casser : `dormeur` ne rapporte RIEN avant son dernier niveau,
    // où il devient de loin le moins cher. Un parcours qui écarterait ses
    // premiers niveaux — ou qui s'arrêterait au premier point « suffisant » de
    // `régulier` — passerait à côté du plan optimal.
    const dormeur: OptimizerSource = {
      id: "dormeur",
      name: "dormeur",
      kind: "evolving",
      currentLevel: 1,
      maxLevel: 10,
      costTo: (level) => (level - 1) * 2,
      contributionAt: (level) => (level === 10 ? 100 : 0),
    };
    const regulier = linearSource("régulier", {
      maxLevel: 200,
      costPerLevel: 5,
      gainPerLevel: 1,
    });

    const plan = planForTarget([dormeur, regulier], "sum", 100);

    expect(plan.reached).toBe(true);
    // 18 jetons par `dormeur`, contre 495 en montant `régulier` jusqu'à 100.
    expect(plan.totalTokens).toBe(18);
    expect(plan.steps.map((step) => step.sourceId)).toEqual(["dormeur"]);
    expect(plan.steps[0].toLevel).toBe(10);
  });

  it("répartit entre deux porteurs quand aucun ne suffit seul", () => {
    const plan = planForTarget(
      [
        linearSource("a", { maxLevel: 5, costPerLevel: 1, gainPerLevel: 1 }),
        linearSource("b", { maxLevel: 5, costPerLevel: 1, gainPerLevel: 1 }),
      ],
      "sum",
      9,
    );
    expect(plan.reached).toBe(true);
    expect(plan.steps).toHaveLength(2);
    expect(plan.value).toBeGreaterThanOrEqual(9);
  });

  it("décrit le MAXIMUM atteignable quand la cible est hors de portée", () => {
    const plan = planForTarget(
      [linearSource("a", { maxLevel: 5, costPerLevel: 1, gainPerLevel: 1 })],
      "sum",
      999,
    );
    expect(plan.reached).toBe(false);
    // ⚠️ Pas un plan vide : dire « impossible » sans dire jusqu'où on va serait
    // moins utile que de montrer le plafond.
    expect(plan.value).toBe(5);
    expect(plan.steps[0].toLevel).toBe(5);
  });

  it("sur une règle `max`, un seul porteur suffit — il n'y a rien à répartir", () => {
    const plan = planForTarget(
      [
        linearSource("a", { maxLevel: 10, costPerLevel: 1, gainPerLevel: 1 }),
        linearSource("b", { maxLevel: 10, costPerLevel: 5, gainPerLevel: 1 }),
      ],
      "max",
      7,
    );
    expect(plan.reached).toBe(true);
    expect(plan.steps.map((step) => step.sourceId)).toEqual(["a"]);
  });

  it("une stat incumulable n'a pas de cible qui ait un sens", () => {
    const plan = planForTarget(
      [linearSource("a", { maxLevel: 10, costPerLevel: 1, gainPerLevel: 1 })],
      "none",
      5,
    );
    expect(plan.steps).toEqual([]);
    expect(plan.totalTokens).toBe(0);
  });

  it("écarte un niveau que le barème ne sait pas chiffrer", () => {
    // ⚠️ On ne propose pas une montée dont on ignore le prix : le plan s'arrête
    // au dernier niveau chiffré.
    const plan = planForTarget(
      [
        {
          id: "a",
          name: "a",
          kind: "evolving",
          currentLevel: 1,
          maxLevel: 10,
          costTo: (level) => (level > 4 ? null : level - 1),
          contributionAt: (level) => level,
        },
      ],
      "sum",
      10,
    );
    expect(plan.reached).toBe(false);
    expect(plan.value).toBe(4);
  });

  it("retrouve la réponse du tableur : vault 30 → 46, 1 974 jetons", () => {
    // ⚠️ LE CAS DE RÉFÉRENCE. Épave au niveau 60 (45 %, déjà au maximum) et
    // gardien au rang 26 (+25 %) : la régénération instantanée demande que le
    // vault apporte les 55 % manquants, ce qu'il fait au niveau 46.
    const equipped = { Heritage_ATH_Slot_4: "Heritage_ATH_Effect_6" };
    const vaultContribution = (level: number) => {
      const resolved = resolveHeritageVault("heritage_ath", level, "BE", {
        equipped,
        keeperReputationLevel: 26,
        keeperReputationPoints: 0,
        xpProgress: 0,
      })!;
      const bonus = getEquippedEffects(resolved)
        .flatMap((effect) => effect.bonuses)
        .find((candidate) => candidate.type === "regeneration_speed");
      return bonus?.amplified ?? null;
    };
    const wreckContribution = (level: number) => {
      const resolved = resolveEvolvingBuilding("evolving_treasure_wreck", level, "BE")!;
      return (
        resolved.bonuses.find((bonus) => bonus.type === "regeneration_speed")?.value ?? null
      );
    };

    const plan = planForTarget(
      [
        {
          id: "vault",
          name: "Vault",
          kind: "vault",
          currentLevel: 30,
          maxLevel: 60,
          costTo: (level) => tokensToVaultLevel("heritage_ath", 30, level),
          contributionAt: vaultContribution,
        },
        {
          id: "wreck",
          name: "Treasure Wreck",
          kind: "evolving",
          currentLevel: 60,
          maxLevel: 60,
          costTo: (level) => (level === 60 ? 0 : null),
          contributionAt: wreckContribution,
        },
      ],
      "sum",
      1,
    );

    expect(plan.reached).toBe(true);
    expect(plan.steps).toHaveLength(1);
    expect(plan.steps[0].sourceId).toBe("vault");
    expect(plan.steps[0].toLevel).toBe(46);
    expect(plan.totalTokens).toBe(1974);
    expect(plan.value).toBeGreaterThanOrEqual(1);
  });

  it("arbitre vraiment entre monter l'Épave et nourrir le vault", () => {
    // Les deux partent bas : l'optimiseur doit peser un barème contre l'autre,
    // et non se rabattre sur un seul porteur par défaut.
    const equipped = { Heritage_ATH_Slot_4: "Heritage_ATH_Effect_6" };
    const plan = planForTarget(
      [
        {
          id: "vault",
          name: "Vault",
          kind: "vault",
          currentLevel: 1,
          maxLevel: 60,
          costTo: (level) => tokensToVaultLevel("heritage_ath", 1, level),
          contributionAt: (level) => {
            const resolved = resolveHeritageVault("heritage_ath", level, "BE", {
              equipped,
              keeperReputationLevel: 1,
              keeperReputationPoints: 0,
              xpProgress: 0,
            })!;
            return (
              getEquippedEffects(resolved)
                .flatMap((effect) => effect.bonuses)
                .find((bonus) => bonus.type === "regeneration_speed")?.amplified ?? null
            );
          },
        },
        {
          id: "wreck",
          name: "Treasure Wreck",
          kind: "evolving",
          currentLevel: 1,
          maxLevel: 60,
          costTo: (level) =>
            tokensFromBuildingLevels(
              getUpgradeCostTiers("evolving_treasure_wreck"),
              level,
              level - 1,
            ),
          contributionAt: (level) =>
            resolveEvolvingBuilding("evolving_treasure_wreck", level, "BE")!.bonuses.find(
              (bonus) => bonus.type === "regeneration_speed",
            )?.value ?? null,
        },
      ],
      "sum",
      0.5,
    );

    expect(plan.reached).toBe(true);
    // Le plan retenu est le moins cher : aucun autre couple de niveaux
    // atteignant 50 % ne coûte moins.
    expect(plan.totalTokens).toBeGreaterThan(0);
    expect(plan.value).toBeGreaterThanOrEqual(0.5);
    for (const step of plan.steps) {
      expect(step.after, step.sourceId).toBeGreaterThan(step.before);
    }
  });
});


// ============================================================
// L'arbitrage réputation contre jetons.
//
// Le gardien ne contribue pas à la stat : il MULTIPLIE ce que le vault apporte.
// Monter le gardien permet donc d'atteindre la même cible avec un vault MOINS
// haut — donc moins de jetons. Mais il se paie en réputation, une monnaie que
// rien ne convertit en jetons : les deux totaux restent séparés, et c'est au
// joueur de choisir son point sur la courbe.
// ============================================================

describe("arbitrage réputation / jetons", () => {
  /** Les porteurs ATH pour la vitesse de régénération, à un multiplicateur donné. */
  function athRegenSources(vaultLevel: number, wreckLevel: number) {
    return (multiplier: number): OptimizerSource[] => [
      {
        id: "vault",
        name: "Vault",
        kind: "vault",
        currentLevel: vaultLevel,
        maxLevel: 60,
        costTo: (level) => tokensToVaultLevel("heritage_ath", vaultLevel, level),
        contributionAt: (level) => {
          const resolved = resolveHeritageVault("heritage_ath", level, "BE", {
            equipped: { Heritage_ATH_Slot_4: "Heritage_ATH_Effect_6" },
            keeperReputationLevel: 1,
            keeperReputationPoints: 0,
            xpProgress: 0,
          })!;
          const bonus = getEquippedEffects(resolved)
            .flatMap((effect) => effect.bonuses)
            .find((candidate) => candidate.type === "regeneration_speed");
          // ⚠️ Amplification REJOUÉE par la fonction du domaine, jamais recopiée :
          // c'est elle qui connaît les types exemptés.
          return amplifyBonusValue("regeneration_speed", bonus?.value ?? null, multiplier);
        },
      },
      {
        id: "wreck",
        name: "Treasure Wreck",
        kind: "evolving",
        currentLevel: wreckLevel,
        maxLevel: 60,
        costTo: (level) =>
          tokensFromBuildingLevels(
            getUpgradeCostTiers("evolving_treasure_wreck"),
            level,
            level - wreckLevel,
          ),
        contributionAt: (level) =>
          resolveEvolvingBuilding("evolving_treasure_wreck", level, "BE")!.bonuses.find(
            (candidate) => candidate.type === "regeneration_speed",
          )?.value ?? null,
      },
    ];
  }

  /** L'axe gardien, depuis un rang courant, jusqu'au rang 99. */
  function keeperAxis(currentLevel: number) {
    return {
      currentLevel,
      maxLevel: 99,
      costTo: (level: number) => {
        let total = 0;
        for (let rank = currentLevel; rank < level; rank += 1) {
          total += getKeeperReputationCost("heritage_ath", rank) ?? 0;
        }
        return total;
      },
      multiplierAt: keeperAmplifierMultiplier,
    };
  }

  it("la première option ne touche pas au gardien", () => {
    const options = planAcrossKeeper(
      athRegenSources(30, 60),
      "sum",
      1,
      keeperAxis(26),
    );
    expect(options[0].keeperLevel).toBe(26);
    expect(options[0].reputation).toBe(0);
    // Le plan sans gardien est celui du tableur : 1 974 jetons.
    expect(options[0].plan.totalTokens).toBe(1974);
  });

  it("monter le gardien fait BAISSER les jetons — c'est tout l'intérêt", () => {
    const options = planAcrossKeeper(athRegenSources(30, 60), "sum", 1, keeperAxis(26));
    expect(options.length).toBeGreaterThan(1);
    for (let i = 1; i < options.length; i += 1) {
      // Chaque option retenue coûte plus de réputation ET moins de jetons que la
      // précédente : c'est la définition d'un échange, et le tri de la courbe.
      expect(options[i].reputation).toBeGreaterThan(options[i - 1].reputation);
      expect(options[i].plan.totalTokens).toBeLessThan(options[i - 1].plan.totalTokens);
    }
  });

  it("va jusqu'au rang où plus AUCUN jeton n'est nécessaire", () => {
    const options = planAcrossKeeper(athRegenSources(30, 60), "sum", 1, keeperAxis(26));
    const last = options[options.length - 1];
    expect(last.plan.totalTokens).toBe(0);
    expect(last.plan.steps).toEqual([]);
    // Vault 30 seul (30,5 %) + Épave 60 (45 %) atteint 100 % dès que
    // l'amplificateur porte les 30,5 % à 55 %, soit `1 + m ≥ 1,8033` → rang 82.
    expect(last.keeperLevel).toBe(82);
    expect(last.reputation).toBeGreaterThan(0);
  });

  it("n'offre que des options NON DOMINÉES", () => {
    const options = planAcrossKeeper(athRegenSources(30, 60), "sum", 1, keeperAxis(26));
    for (const option of options) {
      expect(option.plan.reached, `rang ${option.keeperLevel}`).toBe(true);
      const better = options.filter(
        (other) =>
          other.reputation <= option.reputation &&
          other.plan.totalTokens <= option.plan.totalTokens &&
          other.keeperLevel !== option.keeperLevel,
      );
      expect(better, `rang ${option.keeperLevel} est dominé`).toEqual([]);
    }
  });

  it("garde le rang courant en tête MÊME s'il n'atteint pas la cible", () => {
    // Le cœur du contrat : l'appelant affiche `options[0]` sous « ce plan ne
    // touche pas à ton gardien ». Une cible que le rang 1 n'atteint pas, mais
    // qu'un rang plus haut atteint, faisait auparavant remonter ce rang-là en
    // première position — le panneau chiffrait alors un plan sur un
    // amplificateur que le joueur n'a pas.
    // 101 % est le plafond du rang 1 (vault 60 + Épave 60), 155,9 % celui du
    // rang 99 : 120 % ne s'atteint donc QUE par le gardien.
    const target = 1.2;
    const options = planAcrossKeeper(athRegenSources(30, 60), "sum", target, keeperAxis(1));

    expect(options[0].keeperLevel).toBe(1);
    expect(options[0].reputation).toBe(0);
    // Le rang courant échoue — et c'est justement ce qu'il faut pouvoir dire.
    expect(options[0].plan.reached).toBe(false);
    expect(
      planForTarget(
        athRegenSources(30, 60)(keeperAmplifierMultiplier(1)),
        "sum",
        target,
      ).reached,
    ).toBe(false);
    // Les options suivantes, elles, atteignent toutes la cible.
    for (const option of options.slice(1)) {
      expect(option.plan.reached, `rang ${option.keeperLevel}`).toBe(true);
      expect(option.keeperLevel).toBeGreaterThan(1);
    }
  });

  it("rend au moins le rang courant quand la cible reste hors de portée", () => {
    // Une cible absurde : aucun rang ne l'atteint, mais on doit quand même dire
    // jusqu'où on va plutôt que de rendre une liste vide.
    const options = planAcrossKeeper(athRegenSources(1, 1), "sum", 99, keeperAxis(1));
    expect(options).toHaveLength(1);
    expect(options[0].keeperLevel).toBe(1);
    expect(options[0].plan.reached).toBe(false);
  });
});
