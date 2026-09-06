import { describe, it, expect } from "vitest";

import { HERITAGE_EXTRACT } from "@/data/heritage/generated/heritage.generated";
import type { EraCode } from "@/types/shared";
import { BONUS_LABELS, formatBonusValue } from "./bonus";
import { isRankGoodKey } from "./goods-keys";
import { evaluateLuaFormula } from "./lua-formula";
import {
  HERITAGE_VAULTS,
  HERITAGE_XP_PER_EVOLVING_LEVEL,
  KEEPER_AMPLIFIER_EXEMPT_TYPES,
  KEEPER_OFFER_FORMULAS,
  KEEPER_PURCHASE_COUNT_SCOPE,
  emptyOwnedHeritageVault,
  getHeritageCumulativeXp,
  getHeritageUpgradeCost,
  getHeritageVault,
  getHeritageVaultByTheme,
  computeTargetKeeperLevel,
  getKeeperReputationCost,
  heritageXpFromDonation,
  keeperAmplifierMultiplier,
  keeperOfferValue,
  resolveHeritageVault,
  resolveOwnedHeritageVault,
  computeTargetVaultLevel,
  diffVaultLevels,
  formatChancePercent,
  getEligibleEvolvingBuildings,
  getEquippedEffects,
  getSelectableEffects,
  getUnequippedUnlockedEffects,
  getUnlockedEffects,
  getUpgradeCostTiers,
  humanizeDefinitionId,
  levelsFromTokens,
  resolveChestRewardLabel,
  resolveChestRewards,
  resolveTierCost,
  tokensFromBuildingLevels,
  tokensToVaultLevel,
  type OwnedHeritageVault,
  type ResolvedChestReward,
  type ResolvedHeritageBonus,
} from "./heritage";
import {
  getEvolvingBuilding,
  resolveEvolvingBuilding,
  getConstructionCost as getEvolvingConstructionCost,
  getUpgradeCost as getEvolvingUpgradeCost,
} from "./evolving-buildings";
import { getHeritageVaultPortraitUrl } from "./heritage-portraits";

/** Le seul bonus d'un type donné sur un effet résolu. */
function pick(bonuses: ResolvedHeritageBonus[], type: string): ResolvedHeritageBonus {
  const found = bonuses.filter((b) => b.type === type);
  expect(found, type).toHaveLength(1);
  return found[0];
}

/** L'effet d'un vault résolu, par son niveau de déblocage. */
function effectAt(key: string, level: number, minLevel: number, era: EraCode = "CG") {
  const resolved = resolveHeritageVault(key, level, era)!;
  const found = resolved.effects.filter((e) => e.minLevel === minLevel);
  expect(found, `${key} @${minLevel}`).toHaveLength(1);
  return found[0];
}

// ─────────────────────────────────────────────────────────────────────────────
// Catalogue — les attendus viennent de `source/gamedesign.json`, pas de la
// sortie de l'extracteur.
// ─────────────────────────────────────────────────────────────────────────────

describe("catalogue", () => {
  it("expose les 13 vaults, tous à 60 niveaux, 8 slots et 10 effets", () => {
    expect(HERITAGE_VAULTS).toHaveLength(13);
    for (const vault of HERITAGE_VAULTS) {
      expect(vault.maxLevel, vault.key).toBe(60);
      expect(vault.slots, vault.key).toHaveLength(8);
      expect(vault.effects, vault.key).toHaveLength(10);
      expect(vault.key, vault.themeId).toMatch(/^heritage_/);
    }
  });

  it("les 8 slots sont identiques d'un vault à l'autre", () => {
    const shape = (key: string) =>
      getHeritageVault(key)!.slots.map((s) => ({
        slotIndex: s.slotIndex,
        minLevel: s.minLevel,
        group: s.group,
        premiumSeconds: s.premiumSeconds,
        unlock: s.unlock,
      }));
    const reference = shape("heritage_celtic");
    for (const vault of HERITAGE_VAULTS) {
      expect(shape(vault.key), vault.key).toEqual(reference);
    }
    // 4 slots de production, 4 de boost ; le premier est offert au niveau 1.
    expect(reference.filter((s) => s.group === "production")).toHaveLength(4);
    expect(reference.filter((s) => s.group === "boost")).toHaveLength(4);
    expect(reference[0]).toEqual({
      slotIndex: 0,
      minLevel: 1,
      group: "production",
      premiumSeconds: null,
      unlock: null,
    });
  });

  it("chaque vault a 5 effets de production et 5 de boost, aux mêmes paliers", () => {
    for (const vault of HERITAGE_VAULTS) {
      const production = vault.effects.filter((e) => e.group === "production");
      const boost = vault.effects.filter((e) => e.group === "boost");
      expect(production.map((e) => e.minLevel), vault.key).toEqual([1, 7, 14, 21, 28]);
      expect(boost.map((e) => e.minLevel), vault.key).toEqual([4, 11, 17, 24, 30]);
    }
  });

  it("identifie un vault par sa clé de registre comme par son `themeId`", () => {
    const celtic = getHeritageVault("heritage_celtic")!;
    expect(celtic.name).toBe("Forge of Flames");
    expect(celtic.buildingName).toBe("Celtic Culture");
    expect(celtic.order).toBe(1);
    expect(getHeritageVaultByTheme("heritage_vault.Heritage_Celtic")).toBe(celtic);
    expect(getHeritageVault("heritage_inexistant")).toBeNull();
    expect(getHeritageVaultByTheme("heritage_vault.Heritage_Inexistant")).toBeNull();
  });

  it("ne duplique pas les bâtiments-marqueurs : il ne garde que leur clé de chaîne", () => {
    for (const vault of HERITAGE_VAULTS) {
      expect(vault.buildingChainKey, vault.key).toMatch(/^City_Capital\|heritage/);
      // Aucun champ de bâtiment recopié.
      expect(vault, vault.key).not.toHaveProperty("levels");
      expect(vault, vault.key).not.toHaveProperty("width");
    }
  });

  it("liste les évolutifs qui alimentent chaque vault", () => {
    expect(getHeritageVault("heritage_japan")!.eligibleEvolvingBuildingIds).toEqual([
      "Building_EventJapan_Evolving_Shrine_1",
    ]);
    const total = HERITAGE_VAULTS.reduce((n, v) => n + v.eligibleEvolvingBuildingIds.length, 0);
    // Les 41 jetons portant un `HeritageContributionTraitDTO`, sur 44 évolutifs.
    expect(total).toBe(41);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Progression
// ─────────────────────────────────────────────────────────────────────────────

describe("progression du vault", () => {
  it("indexe le coût par le niveau de DÉPART", () => {
    // Lua_BuildingUpgrade_HeritageVault_LevelUpCost_1 : floor(3 × 1.10^L) + 1.
    expect(getHeritageUpgradeCost("heritage_celtic", 1)).toEqual({
      fromLevel: 1,
      toLevel: 2,
      xp: 4,
    });
    expect(getHeritageUpgradeCost("heritage_celtic", 59)?.xp).toBe(44);
    expect(getHeritageCumulativeXp("heritage_celtic", 60)).toBe(1417);
  });

  it("les trois barèmes du jeu donnent trois totaux distincts", () => {
    expect(getHeritageCumulativeXp("heritage_celtic", 60)).toBe(1417);
    expect(getHeritageCumulativeXp("heritage_ath", 60)).toBe(6070);
    expect(getHeritageCumulativeXp("heritage_polynesian", 60)).toBe(722);
    // Les 10 autres partagent le barème standard.
    const standard = HERITAGE_VAULTS.filter(
      (v) => !["heritage_ath", "heritage_polynesian"].includes(v.key),
    );
    expect(standard).toHaveLength(11);
    for (const vault of standard) {
      expect(getHeritageCumulativeXp(vault.key, 60), vault.key).toBe(1417);
    }
  });

  it("est `null` au niveau maximal — on ne quitte pas le dernier niveau", () => {
    expect(getHeritageUpgradeCost("heritage_celtic", 60)).toBeNull();
    expect(resolveHeritageVault("heritage_celtic", 60, "CG")!.upgradeCost).toBeNull();
    expect(resolveHeritageVault("heritage_celtic", 60, "CG")!.atMaxLevel).toBe(true);
  });

  it("borne un niveau hors plage plutôt que de le refuser", () => {
    expect(resolveHeritageVault("heritage_celtic", 0, "CG")!.level).toBe(1);
    expect(resolveHeritageVault("heritage_celtic", 999, "CG")!.level).toBe(60);
    expect(resolveHeritageVault("heritage_inexistant", 1, "CG")).toBeNull();
  });

  it("la réputation du gardien suit `5 × rang`, identique sur les 13", () => {
    for (const vault of HERITAGE_VAULTS) {
      expect(getKeeperReputationCost(vault.key, 1), vault.key).toBe(5);
      expect(getKeeperReputationCost(vault.key, 12), vault.key).toBe(60);
    }
    // Aucun plafond n'est déclaré : au-delà du dernier rang extrait, la formule
    // est prolongée plutôt que bornée en silence.
    expect(getKeeperReputationCost("heritage_celtic", 100)).toBe(500);
  });
});

describe("computeTargetKeeperLevel", () => {
  it("enchaîne les rangs tant que le budget les couvre — 5×niveau", () => {
    // cost(1)=5, cost(2)=10, cost(3)=15 → 30 pile pour passer du rang 1 au 4.
    const gain = computeTargetKeeperLevel("heritage_celtic", 1, 30);
    expect(gain).toEqual({ targetLevel: 4, levelsGained: 3, spent: 30, remaining: 0 });
  });

  it("garde le reliquat plutôt que de l'arrondir", () => {
    // cost(1)=5 : avec 12, un seul rang gagné et 7 de reliquat.
    const gain = computeTargetKeeperLevel("heritage_celtic", 1, 12);
    expect(gain).toEqual({ targetLevel: 2, levelsGained: 1, spent: 5, remaining: 7 });
  });

  it("ne gagne aucun rang si le budget ne couvre pas le premier palier", () => {
    const gain = computeTargetKeeperLevel("heritage_celtic", 1, 4);
    expect(gain).toEqual({ targetLevel: 1, levelsGained: 0, spent: 0, remaining: 4 });
  });

  it("rend null sur une clé inconnue", () => {
    expect(computeTargetKeeperLevel("heritage_inexistant", 1, 100)).toBeNull();
  });

  it("ignore un budget négatif — jamais un reliquat négatif", () => {
    const gain = computeTargetKeeperLevel("heritage_celtic", 1, -10);
    expect(gain).toEqual({ targetLevel: 1, levelsGained: 0, spent: 0, remaining: 0 });
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Résolution — l'ère du JOUEUR, pas une ère d'instance
// ─────────────────────────────────────────────────────────────────────────────

describe("l'ère est celle du joueur, jamais stockée sur le vault", () => {
  it("`OwnedHeritageVault` n'a pas de champ `era`", () => {
    const owned = emptyOwnedHeritageVault("heritage_vault.Heritage_Celtic");
    expect(Object.keys(owned).sort()).toEqual([
      "equipped",
      "keeperPurchases",
      "keeperReputationLevel",
      "keeperReputationPoints",
      "level",
      "themeId",
      "xpProgress",
    ]);
    expect(owned).not.toHaveProperty("era");
  });

  it("le même état résolu sous deux ères rend des biens différents", () => {
    const owned: OwnedHeritageVault = {
      ...emptyOwnedHeritageVault("heritage_vault.Heritage_Celtic"),
      level: 60,
    };
    const cg = resolveOwnedHeritageVault(owned, "CG")!;
    const lg = resolveOwnedHeritageVault(owned, "LG")!;

    const goodsAt = (era: "CG" | "LG") =>
      pick(effectAt("heritage_celtic", 60, 1, era).bonuses, "goods_output");
    // Dac_…_CEGoods_1 : la ligne RomanEmpire gouverne jusqu'à LateGothicEra
    // faute de ligne suivante — mais chaque ère GOUVERNÉE a sa propre entrée
    // (`buildPlayerAgeCurve` éclate désormais systématiquement par
    // `governedAge`), donc le bien à ère LG suit l'atelier configuré à LG, pas
    // celui de RomanEmpire figé sur la ligne déclarée.
    expect(goodsAt("CG").resources).toEqual(["primary_cg", "secondary_cg", "tertiary_cg"]);
    expect(goodsAt("LG").resources).toEqual(["primary_lg", "secondary_lg", "tertiary_lg"]);
    expect(cg.era).toBe("CG");
    expect(lg.era).toBe("LG");
  });

  it("une plage `governed` couvrant plusieurs ères ne fige plus le bien sur l'ère déclarée", () => {
    // Régression : `buildPlayerAgeCurve()` (scripts/extract/heritage.ts)
    // groupait toutes les ères d'une plage `governed` (RomanEmpire → LG, faute
    // de ligne suivante déclarée) sous UNE seule entrée dont la clé de
    // ressource était calculée une fois pour toutes avec l'ère DÉCLARÉE
    // (RomanEmpire). Changer les ateliers d'une autre ère de la plage
    // (ByzantineEra, LateGothicEra…) n'avait donc plus aucun effet — symptôme
    // observé : premier palier et cartes figés. Chaque ère gouvernée doit
    // désormais avoir sa PROPRE entrée et sa propre clé.
    const goodsAt = (era: EraCode) =>
      pick(effectAt("heritage_celtic", 60, 1, era).bonuses, "goods_output");

    const re = goodsAt("RE");
    const be = goodsAt("BE");
    const lg = goodsAt("LG");

    // Les trois ères sont dans la même plage `governed` (celle de la ligne
    // RomanEmpire, la dernière déclarée) : avant le correctif, les trois
    // auraient rendu exactement le même triplet ["primary_re", …].
    expect(re.resources).toEqual(["primary_re", "secondary_re", "tertiary_re"]);
    expect(be.resources).toEqual(["primary_be", "secondary_be", "tertiary_be"]);
    expect(lg.resources).toEqual(["primary_lg", "secondary_lg", "tertiary_lg"]);
  });

  it("un bien de rang sans décalage d'ère est TOUJOURS suffixé quand l'ère est connue", () => {
    // Régression : `toProjectResourceKey()` (scripts/extract/heritage.ts)
    // renvoyait le rang nu ("primary") pour `offset === 0`, au lieu du
    // suffixe d'ère ("primary_lg"). `isRankGoodKey()` — le garde-fou partagé
    // par tout le projet — n'accepte qu'une clé suffixée.
    const resources = pick(effectAt("heritage_celtic", 60, 1, "LG").bonuses, "goods_output")
      .resources;
    expect(resources.length).toBeGreaterThan(0);
    for (const resource of resources) {
      expect(isRankGoodKey(resource)).toBe(true);
    }
  });

  it("les biens « ère précédente » sont datés âge par âge", () => {
    // Dac_…_PEGoods_1 sous LateGothicEra : `dynamicGood.offset = -1` → EG.
    const lg = pick(effectAt("heritage_celtic", 1, 28, "LG").bonuses, "goods_output");
    expect(lg.resources).toEqual(["primary_eg", "secondary_eg", "tertiary_eg"]);
    const hm = pick(effectAt("heritage_celtic", 1, 28, "HM").bonuses, "goods_output");
    expect(hm.resources).toEqual(["primary_ks", "secondary_ks", "tertiary_ks"]);
  });

  it("`playerAgeOrder` vient du game design, pas de l'index des ères", () => {
    // AgeDefinition.order compte DawnAge = 1 : StoneAge vaut donc 2, pas 1.
    expect(HERITAGE_EXTRACT.playerAgeOrderByAge.StoneAge).toBe(2);
    expect(HERITAGE_EXTRACT.playerAgeOrderByAge.LateGothicEra).toBe(15);
    // Lua_…_CulturePoints_1 : 200 + 30L + 4L × max(0, ageOrder − 4).
    expect(pick(effectAt("heritage_celtic", 1, 17, "SA").bonuses, "culture_points").value).toBe(230);
    expect(pick(effectAt("heritage_celtic", 1, 17, "LG").bonuses, "culture_points").value).toBe(274);
    expect(pick(effectAt("heritage_celtic", 60, 17, "LG").bonuses, "culture_points").value).toBe(4640);
  });
});

describe("valeurs résolues des effets", () => {
  it("le boost de ressource est une valeur Lua directe (schéma B)", () => {
    // Lua_…_RessourceBoost_1 : 0.050 + 0.0024 × L, sans `modifier`.
    expect(pick(effectAt("heritage_celtic", 1, 4).bonuses, "coins_production").value).toBe(0.0524);
    expect(pick(effectAt("heritage_celtic", 60, 4).bonuses, "coins_production").value).toBe(0.194);
  });

  it("les points de recherche, la portée de culture et les ouvriers montent avec le niveau", () => {
    expect(pick(effectAt("heritage_celtic", 1, 14).bonuses, "research_points_output").value).toBe(1);
    expect(pick(effectAt("heritage_celtic", 60, 14).bonuses, "research_points_output").value).toBe(30);
    expect(pick(effectAt("heritage_celtic", 1, 17).bonuses, "culture_range").value).toBe(1);
    expect(pick(effectAt("heritage_celtic", 60, 17).bonuses, "culture_range").value).toBe(6);
    expect(pick(effectAt("heritage_celtic", 1, 21).bonuses, "worker_slots").value).toBe(1);
    expect(pick(effectAt("heritage_celtic", 60, 21).bonuses, "worker_slots").value).toBe(16);
  });

  it("un effet sous son palier reste résolu mais marqué verrouillé", () => {
    const effect = effectAt("heritage_celtic", 1, 30);
    expect(effect.unlocked).toBe(false);
    expect(effectAt("heritage_celtic", 30, 30).unlocked).toBe(true);
  });

  it("le contenu d'un coffre est lu par palier de niveau", () => {
    // Dac_ProductionReward_…_GrandSmithy_1_RandomRefill : paliers 1, 22, 42.
    const at1 = effectAt("heritage_celtic", 1, 7);
    const at30 = effectAt("heritage_celtic", 30, 7);
    const at60 = effectAt("heritage_celtic", 60, 7);
    expect(at1.rewards?.minLevel).toBe(1);
    expect(at30.rewards?.minLevel).toBe(22);
    expect(at60.rewards?.minLevel).toBe(42);
    // Un coffre nommé, pas un « relique » générique : le game design le nomme.
    const chest = effectAt("heritage_ath", 60, 14).rewards!;
    const relics = JSON.stringify(chest).match(/"relic\.[A-Za-z]+"/g) ?? [];
    expect(relics.length).toBeGreaterThan(0);
    expect(JSON.stringify(chest)).toContain("Strings of the Ancients");
  });

  it("ne compte comme actifs que les effets placés dans un slot atteignable", () => {
    const equipped = { Heritage_Celtic_Slot_0: "Heritage_Celtic_Effect_1" };
    const withNothing = resolveHeritageVault("heritage_celtic", 60, "CG")!;
    expect(withNothing.activeBonuses).toEqual([]);

    const withOne = resolveHeritageVault("heritage_celtic", 60, "CG", {
      equipped,
      keeperReputationLevel: 1,
      keeperReputationPoints: 0,
      xpProgress: 0,
    })!;
    expect(withOne.activeBonuses.map((b) => b.type)).toEqual(["goods_output"]);
    expect(withOne.slots.find((s) => s.id === "Heritage_Celtic_Slot_0")?.effectId).toBe(
      "Heritage_Celtic_Effect_1",
    );

    // Slot 1 exige le niveau 21 : au niveau 5 il n'est pas atteignable.
    const tooEarly = resolveHeritageVault("heritage_celtic", 5, "CG", {
      equipped: { Heritage_Celtic_Slot_1: "Heritage_Celtic_Effect_1" },
      keeperReputationLevel: 1,
      keeperReputationPoints: 0,
      xpProgress: 0,
    })!;
    expect(tooEarly.slots.find((s) => s.id === "Heritage_Celtic_Slot_1")?.reachable).toBe(false);
    expect(tooEarly.activeBonuses).toEqual([]);
  });
});

// ═════════════════════════════════════════════════════════════════════════════
// LES TROIS CONVENTIONS ASSUMÉES
//
// Chacune est une HYPOTHÈSE, pas une règle déclarée par la donnée. Ces tests
// existent pour qu'un démenti mesuré en jeu se traduise par UN changement à UN
// endroit, et que ce changement soit immédiatement visible.
// ═════════════════════════════════════════════════════════════════════════════

describe("convention (a) — `modifier` × valeur dynamique (schéma A)", () => {
  it("le bonus réel est le PRODUIT, jamais l'un des deux termes seul", () => {
    const vault = HERITAGE_EXTRACT.vaults.find((v) => v.key === "heritage_celtic")!;
    const effect = vault.effects.find((e) => e.minLevel === 11)!;
    const bonus = effect.bonuses[0];
    expect(bonus.type).toBe("heavy_infantry_damage");

    const curve = bonus.curve!;
    // Les deux termes, tels que le game design les écrit.
    expect(curve.modifier).toBe(0.01);
    expect(curve.formula).toBe("2.0 + (0.24 * #level)");
    // Dusc_Heritage_UnitAttackBoost au niveau 60 : 2.0 + 0.24 × 60 = 16.4.
    expect(curve.resolved[59]).toBe(16.4);
    // ⚠️ CONVENTION : le produit. Lire `modifier` seul donnerait 0.01 partout,
    // lire la valeur dynamique seule donnerait 16.4 (soit +1640 %).
    expect(curve.effective[59]).toBe(0.164);
    // `effective` est le produit, arrondi au 6ᵉ chiffre pour couper le bruit
    // flottant (0.01 × 16.4 = 0.16399999999999998 en IEEE 754).
    expect(curve.effective[59]).toBeCloseTo(curve.modifier! * curve.resolved[59]!, 9);
  });

  it("`modifier` vaut 0.01 sur les 32 boosts de stat du domaine", () => {
    const modifiers = HERITAGE_EXTRACT.vaults
      .flatMap((v) => v.effects)
      .filter((e) => e.componentType === "BoostUnitStatComponentDTO")
      .flatMap((e) => e.bonuses.map((b) => b.curve?.modifier));
    expect(modifiers).toHaveLength(32);
    expect(new Set(modifiers)).toEqual(new Set([0.01]));
  });

  it("la valeur reste un RATIO — `format: percent` décrit l'affichage, pas l'échelle", () => {
    const bonus = pick(effectAt("heritage_celtic", 60, 11).bonuses, "heavy_infantry_damage");
    expect(bonus.format).toBe("percent");
    expect(bonus.value).toBe(0.164);
  });
});

describe("convention (b) — cible et portée de l'amplificateur du gardien", () => {
  it("`entityLevel` du Lua est le RANG DE RÉPUTATION, pas le niveau du vault", () => {
    // Lua_HeritageVault_KeeperAmplifier_Modifier : 0.01 × (entityLevel − 1).
    expect(keeperAmplifierMultiplier(1)).toBe(0);
    expect(keeperAmplifierMultiplier(2)).toBe(0.01);
    expect(keeperAmplifierMultiplier(60)).toBe(0.59);
    // Le niveau du vault, lui, ne change pas le multiplicateur.
    const low = resolveHeritageVault("heritage_celtic", 1, "CG", {
      equipped: {},
      keeperReputationLevel: 30,
      keeperReputationPoints: 0,
      xpProgress: 0,
    })!;
    const high = resolveHeritageVault("heritage_celtic", 60, "CG", {
      equipped: {},
      keeperReputationLevel: 30,
      keeperReputationPoints: 0,
      xpProgress: 0,
    })!;
    expect(low.keeper.amplifierMultiplier).toBe(high.keeper.amplifierMultiplier);
    expect(low.keeper.amplifierMultiplier).toBe(0.29);
  });

  it("s'applique multiplicativement à toutes les productions et tous les boosts du thème", () => {
    const state = {
      equipped: {},
      keeperReputationLevel: 60,
      keeperReputationPoints: 0,
      xpProgress: 0,
    };
    const resolved = resolveHeritageVault("heritage_celtic", 60, "CG", state)!;
    for (const effect of resolved.effects) {
      for (const bonus of effect.bonuses) {
        if (bonus.value === null) continue;
        // ⚠️ CONVENTION : `value × (1 + multiplicateur)`, sur PRODUCTION et BOOST
        // indifféremment — le DTO ne déclare aucune cible. Les COMPTEURS DISCRETS
        // en sont exclus (convention (b bis)) : un ouvrier ou une case ne se
        // découpe pas en fractions.
        const expected = KEEPER_AMPLIFIER_EXEMPT_TYPES.has(bonus.type)
          ? bonus.value
          : bonus.value * 1.59;
        expect(bonus.amplified, `${effect.id}/${bonus.type}`).toBeCloseTo(expected, 9);
      }
    }
  });

  it("laisse intacts les compteurs discrets — ni ouvrier, ni case, ni tentative fractionnaire", () => {
    const state = {
      equipped: {},
      keeperReputationLevel: 16,
      keeperReputationPoints: 0,
      xpProgress: 0,
    };
    let seen = 0;
    for (const vault of HERITAGE_VAULTS) {
      const resolved = resolveHeritageVault(vault.key, vault.maxLevel, "CG", state)!;
      for (const effect of resolved.effects) {
        for (const bonus of effect.bonuses) {
          if (bonus.value === null) continue;
          if (!KEEPER_AMPLIFIER_EXEMPT_TYPES.has(bonus.type)) continue;
          seen += 1;
          expect(bonus.amplified, `${vault.key}/${bonus.type}`).toBe(bonus.value);
          expect(Number.isInteger(bonus.amplified), `${vault.key}/${bonus.type}`).toBe(true);
        }
      }
    }
    expect(seen).toBeGreaterThan(0);
  });

  it("l'affichage d'un compteur sort entier — pas « +1552.4999999999998 »", () => {
    // ⚠️ CE TEST GARDE L'INTÉGRALITÉ DU FORMATEUR PARTAGÉ, PAS LA RÈGLE DU
    // VAULT. `formatBonusValue` sert aussi aux Wonders, aux Technologies et aux
    // Bâtiments, et y arrondit AU PLUS PROCHE. L'arrondi VERS LE HAUT mesuré sur
    // l'amplificateur du gardien vit en amont, dans `describeHeritageBonus`
    // (`components/heritage/effect-display.ts`), et n'engage que le Heritage
    // Vault — ses relevés en jeu sont dans `effect-icon.test.ts`.
    expect(formatBonusValue("integer", 1350 * 1.15)).toBe("+1553");
    expect(formatBonusValue("integer", 7 * 1.15)).toBe("+8");
    expect(formatBonusValue("integer", 3 * 1.15)).toBe("+3");
    // Sans amplification, rien ne bouge.
    expect(formatBonusValue("integer", 7)).toBe("+7");
  });

  it("une SORTIE sort entière et groupée — on ne verse pas un demi-bien", () => {
    // Même partage que le test précédent : ici l'arrondi au plus proche du
    // formateur commun, pas la règle mesurée du vault.
    expect(formatBonusValue("absolute", 1050 * 1.15)).toBe("1,208");
    // Les .5 portés par la donnée elle-même (14 courbes `absolute` sur 44)
    // suivent la même règle — un pas de courbe n'est pas une livraison.
    expect(formatBonusValue("absolute", 69.5)).toBe("70");
    expect(formatBonusValue("absolute", -1234.4)).toBe("-1,234");
    // Au-delà de 100 000, `formatNumber` abrège — comme le jeu sur la piste de
    // niveaux d'un bâtiment (« 446,50 K/1D »), et comme le reste de
    // l'application. L'arrondi à l'entier reste fait AVANT l'abrègement.
    expect(formatBonusValue("absolute", 25350000)).toBe("25,35 M");
    expect(formatBonusValue("absolute", 446500)).toBe("446,50 K");
    // Le seuil : en dessous, le rendu d'avant (groupement sans abrègement).
    expect(formatBonusValue("absolute", 99999)).toBe("99,999");
    expect(formatBonusValue("absolute", 100000)).toBe("100,00 K");
  });

  it("prolonge la formule au-delà du dernier rang extrait — aucun plafond déclaré", () => {
    expect(HERITAGE_EXTRACT.keeperAmplifier!.perReputationLevel).toHaveLength(60);
    expect(keeperAmplifierMultiplier(61)).toBeCloseTo(0.6, 9);
    // Un rang absurde est borné par le bas, pas par le haut.
    expect(keeperAmplifierMultiplier(0)).toBe(0);
  });

  it("la table `modifier` du boost est un stub vide : toute la valeur est dans le Lua", () => {
    const amplifier = HERITAGE_EXTRACT.keeperAmplifier!;
    expect(amplifier.boostDefinitionId).toBe("Boost_HeritageVault_KeeperAmplifier");
    expect(amplifier.luaScript).toBe("return 0.01 * (entityLevel - 1)");
    // Porté par les 13 bâtiments-marqueurs, un par thème.
    expect(amplifier.carriedBy).toHaveLength(13);
  });
});

describe("convention (c) — un niveau d'évolutif sacrifié vaut 1 xp", () => {
  it("la constante est le seul point de vérité du taux", () => {
    expect(HERITAGE_XP_PER_EVOLVING_LEVEL).toBe(1);
    expect(heritageXpFromDonation(1)).toBe(HERITAGE_XP_PER_EVOLVING_LEVEL);
    expect(heritageXpFromDonation(30)).toBe(30 * HERITAGE_XP_PER_EVOLVING_LEVEL);
  });

  it("est cohérente avec le seul taux DÉCLARÉ : 1 jeton = 1 xp", () => {
    // C'est la symétrie qui justifie l'hypothèse : les 41 jetons éligibles
    // portent `heritageXpPerUnit: 1`. Sacrifier un évolutif de 60 niveaux coûte
    // donc, sous cette convention, exactement ce que coûtent 60 jetons.
    expect(heritageXpFromDonation(60)).toBe(60);
  });

  it("ignore les valeurs absurdes plutôt que de rendre du négatif", () => {
    expect(heritageXpFromDonation(0)).toBe(0);
    expect(heritageXpFromDonation(-5)).toBe(0);
    expect(heritageXpFromDonation(2.7)).toBe(2);
  });
});

describe("convention — portée de `keeperPurchaseCount`", () => {
  it("est tranchée explicitement : un compteur par (vault, offre)", () => {
    expect(KEEPER_PURCHASE_COUNT_SCOPE).toBe("perOfferPerVault");
    // C'est ce que l'état stocké encode : une entrée par offre, dans le vault.
    const owned = emptyOwnedHeritageVault("heritage_vault.Heritage_Celtic");
    expect(owned.keeperPurchases).toEqual({});
  });

  it("le prix suit le compteur de CETTE offre, et l'ère du joueur quand elle compte", () => {
    // Lua_…_ExoticGood_2 : floor(−250 × 1.07^count), sans playerAgeOrder.
    expect(keeperOfferValue("ExoticGood_2", 0, "CG")).toBe(-250);
    expect(keeperOfferValue("ExoticGood_2", 1, "CG")).toBe(-268);
    expect(keeperOfferValue("ExoticGood_2", 1, "LG")).toBe(-268);
    // Lua_…_Coins_S : floor(−15000 × playerAgeOrder² × 1.08^count).
    expect(keeperOfferValue("Coins_S", 0, "SA")).toBe(-60_000);
    expect(keeperOfferValue("Coins_S", 0, "LG")).toBe(-3_375_000);
    expect(keeperOfferValue("Offre_Inexistante", 0, "CG")).toBeNull();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Périmètre du gardien : les prix existent, les offres non
// ─────────────────────────────────────────────────────────────────────────────

describe("offres du gardien", () => {
  it("expose 29 courbes de prix — et AUCUN catalogue", () => {
    expect(KEEPER_OFFER_FORMULAS).toHaveLength(29);
    expect(KEEPER_OFFER_FORMULAS.filter((o) => o.direction === "give")).toHaveLength(11);
    expect(KEEPER_OFFER_FORMULAS.filter((o) => o.direction === "receive")).toHaveLength(18);
    // ⚠️ Rien dans le bundle ne dit ce qui s'échange contre quoi : le game design
    // ne le déclare nulle part. Aucun champ de ce genre ne doit apparaître ici
    // sans avoir été saisi à la main, en jeu.
    for (const offer of KEEPER_OFFER_FORMULAS) {
      expect(Object.keys(offer).sort(), offer.id).toEqual([
        "definitionId",
        "direction",
        "firstValue",
        "id",
        "luaScript",
        "scalesWithPlayerAge",
        "variables",
      ]);
      expect(offer.variables, offer.id).toContain("keeperPurchaseCount");
    }
  });

  it("toutes les formules restent dans le sous-langage de `lua-formula.ts`", () => {
    for (const offer of KEEPER_OFFER_FORMULAS) {
      const evaluate = () =>
        evaluateLuaFormula(offer.luaScript, { keeperPurchaseCount: 7, playerAgeOrder: 15 });
      expect(evaluate, offer.id).not.toThrow();
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Vocabulaire de bonus — pas de dictionnaire parallèle
// ─────────────────────────────────────────────────────────────────────────────

describe("vocabulaire de bonus", () => {
  /** Le premier bonus d'un type donné, où qu'il soit dans l'extraction. */
  function findBonus(type: string) {
    for (const vault of HERITAGE_EXTRACT.vaults) {
      for (const effect of vault.effects) {
        const bonus = effect.bonuses.find((b) => b.type === type);
        if (bonus !== undefined) return bonus;
      }
    }
    throw new Error(`aucun bonus \`${type}\` dans l'extraction`);
  }

  it("plus AUCUN écart de vocabulaire : les 12 clés sont adoptées", () => {
    expect(HERITAGE_EXTRACT.bonusGaps).toEqual([]);
  });

  it("un type PROPOSÉ n'est jamais déjà dans `BONUS_LABELS`", () => {
    for (const gap of HERITAGE_EXTRACT.bonusGaps) {
      expect(gap.proposedType in BONUS_LABELS, gap.proposedType).toBe(false);
    }
  });

  it("les 12 clés adoptées portent un libellé et le format attendu", () => {
    // ⚠️ Le format n'est PAS déclaré dans `resolvers/bonus.ts` : il vient de la
    // donnée (`BuildingBonus.format`), délibérément, pour ne pas rouvrir la
    // seconde source de vérité que les anciens `PERCENT_TYPES` / `INTEGER_TYPES`
    // constituaient. Ce test est donc le seul endroit qui fige le couple
    // (clé, format) pour ce domaine.
    const adopted: [string, string, string][] = [
      ["culture_points", "Culture Points", "integer"],
      ["culture_range", "Culture Range", "integer"],
      ["research_points_output", "Research Points", "absolute"],
      // ⚠️ « Workshop », alors que la clé est GÉNÉRIQUE — c'est délibéré, et
      // borné. Le jeu écrit « Augmente le rendement des productions de chaque
      // Atelier dans Capitale de 9,08 % » : sur le Heritage Vault, le libellé
      // nomme donc ce que le joueur lit à l'écran, pas la clé technique.
      // La borne est vérifiée juste en dessous — dans CE domaine, les 4
      // occurrences sont toutes `buildingType: "workshop"`.
      //
      // ⚠️ Elle ne tient PAS dans le domaine Bâtiments : `Beehive Runestone` et
      // `Home Runestone` (City_Vikings) portent la même clé avec les portées
      // `beehive` et `home`, et y liraient « Workshop » à tort. Le jour où ces
      // deux-là s'affichent, le libellé doit se dériver de `scope` plutôt que
      // d'être écrit en dur — `getBonusLabel` prendrait la portée en argument
      // optionnel, sans casser ses appelants.
      ["building_type_production", "Workshop Production Boost", "percent"],
      ["infantry_critical_hit_damage", "Infantry Critical Hit Damage", "percent"],
      ["heavy_infantry_critical_hit_damage", "Heavy Infantry Critical Hit Damage", "percent"],
      ["cavalry_critical_hit_damage", "Cavalry Critical Hit Damage", "percent"],
      ["siege_critical_hit_damage", "Siege Critical Hit Damage", "percent"],
      ["siege_damage", "Siege Damage", "percent"],
      ["siege_hp", "Siege Hit Points", "percent"],
      ["regeneration_cap", "Attempt Cap", "integer"],
      ["regeneration_speed", "Attempt Regeneration Speed", "percent"],
    ];
    expect(adopted).toHaveLength(12);
    for (const [type, label, format] of adopted) {
      expect(BONUS_LABELS[type], `libellé de ${type}`).toBe(label);
      expect(findBonus(type).format, `format de ${type}`).toBe(format);
    }
  });

  it("`research_points_output` est une QUANTITÉ par cycle, pas un taux", () => {
    const bonus = findBonus("research_points_output");
    expect(bonus.format).toBe("absolute");
    expect(bonus.componentType).toBe("ProductionComponentDTO");
    // Une sortie de production porte sa période ; un boost n'en a pas.
    expect(bonus.periodSeconds).toBe(86_400);
    // 1 PR/jour au niveau 1, 30 au niveau 60 : des points, pas des pourcents.
    expect(bonus.curve?.effective[0]).toBe(1);
    expect(bonus.curve?.effective[59]).toBe(30);
    // Et les trois clés voisines restent distinctes. Les libellés ont été
    // dépliés depuis (71db070, 30170cd) : la famille `*_output` porte le nom nu
    // de sa ressource (« Research Points »), là où `rp_per_day` reste un TAUX et
    // `research_point_cap` un PLAFOND. Ce que le test garde, c'est qu'aucune des
    // quatre ne se confonde avec une autre.
    expect(BONUS_LABELS.rp_per_day).toBe("RP / Day");
    expect(BONUS_LABELS.research_point_cap).toBe("Research Point Cap");
    expect(BONUS_LABELS.research_regen_boost).toBe("RP Regeneration Speed");
    expect(
      new Set([
        BONUS_LABELS.research_points_output,
        BONUS_LABELS.rp_per_day,
        BONUS_LABELS.research_point_cap,
        BONUS_LABELS.research_regen_boost,
      ]).size,
    ).toBe(4);
  });

  it("`building_type_production` porte le type dans `scope`, pas dans la clé", () => {
    const bonus = findBonus("building_type_production");
    // ⚠️ C'est le TYPE de bâtiment qui discrimine, pas la cité : les 13 vaults
    // sont tous en `City_Capital`, un scope de cité y serait constant donc muet.
    expect(bonus.scope).toEqual({ kind: "buildingType", value: "workshop" });
    // La clé ne nomme aucun type — une clé par type serait un dictionnaire à
    // rallonge. Même arbitrage que `goods_production`, qui ne nomme pas le bien.
    expect(bonus.resource).toBeNull();
    expect(Object.keys(BONUS_LABELS).filter((k) => k.startsWith("workshop_"))).toEqual([]);

    // ⚠️ CE QUI AUTORISE LE LIBELLÉ « Workshop Production Boost » À ÊTRE ÉCRIT
    // EN DUR. Il ne dit vrai que tant que CE domaine n'emploie la clé que sur
    // des ateliers. Le jour où un vault la porte sur un autre type de bâtiment,
    // c'est ici que ça casse — et c'est le libellé qu'il faudra dériver de
    // `scope`, pas cette assertion qu'il faudra assouplir.
    const scopes = new Set(
      HERITAGE_EXTRACT.vaults
        .flatMap((v) => v.effects)
        .flatMap((e) => e.bonuses)
        .filter((b) => b.type === "building_type_production")
        .map((b) => b.scope?.value),
    );
    expect([...scopes]).toEqual(["workshop"]);
  });

  it("les 5 `*_critical_hit_damage` ne doublonnent pas la famille `*_chance`", () => {
    // Deux stats DISTINCTES du jeu : `UnitStat_CriticalHitChance` (fréquence) et
    // `UnitStat_CriticalHitDamage` (dégâts du critique).
    const damageKeys = Object.keys(BONUS_LABELS).filter((k) => k.endsWith("_critical_hit_damage"));
    expect(damageKeys.sort()).toEqual([
      "cavalry_critical_hit_damage",
      "heavy_infantry_critical_hit_damage",
      "infantry_critical_hit_damage",
      "ranged_critical_hit_damage",
      "siege_critical_hit_damage",
    ]);
    // La famille « fréquence » est intacte, alias compris.
    expect(BONUS_LABELS.infantry_critical_hit_chance).toBe("Infantry Crit Chance");
    expect(BONUS_LABELS.heavy_infantry_critical_hit_chance).toBe("Heavy Inf. Crit Chance");
    expect(BONUS_LABELS.ranged_critical_hit_boost).toBe("Ranged Crit Boost");
    // Aucune clé `*_critical_hit_damage` n'est un alias : seul
    // `ranged_critical_hit_chance` en est un, et il ne figure pas au dictionnaire.
    expect(BONUS_LABELS.ranged_critical_hit_chance).toBeUndefined();
    // World Fair porte les 5 types sur la stat « dégâts », d'où l'adoption.
    const worldFair = HERITAGE_EXTRACT.vaults.find((v) => v.key === "heritage_world_fair")!;
    const types = worldFair.effects
      .flatMap((e) => e.bonuses)
      .filter((b) => b.type.endsWith("_critical_hit_damage"))
      .map((b) => b.type);
    expect(types).toHaveLength(5);
  });

  it("`regeneration_*` porte la ressource, et n'est PAS la paire Wonders `research_*`", () => {
    for (const type of ["regeneration_cap", "regeneration_speed"]) {
      const bonus = findBonus(type);
      // ⚠️ La ressource régénérée est `treasure_hunt_attempt`, pas des points de
      // recherche : réutiliser `research_point_cap` afficherait « Research Point
      // Cap » sur des tentatives de chasse au trésor.
      expect(bonus.resource, type).toBe("treasure_hunt_attempt");
    }
    // Le plafond monte de 4 à 9 tentatives sur les 60 niveaux — un compte entier.
    const cap = findBonus("regeneration_cap");
    expect(cap.format).toBe("integer");
    expect(cap.curve?.effective[0]).toBe(4);
    expect(cap.curve?.effective[59]).toBe(9);
    // Les deux clés Wonders restent intactes et distinctes de la paire générique.
    expect(BONUS_LABELS.research_point_cap).toBe("Research Point Cap");
    expect(BONUS_LABELS.research_regen_boost).toBe("RP Regeneration Speed");
    expect(BONUS_LABELS.regeneration_cap).not.toBe(BONUS_LABELS.research_point_cap);
    expect(BONUS_LABELS.regeneration_speed).not.toBe(BONUS_LABELS.research_regen_boost);
  });

  it("`siege_damage` / `siege_hp` complètent les 5 types d'unité", () => {
    for (const stat of ["damage", "hp"]) {
      const family = ["infantry", "ranged", "cavalry", "heavy_infantry", "siege"].map(
        (unit) => `${unit}_${stat}`,
      );
      for (const key of family) {
        expect(BONUS_LABELS[key], key).toBeDefined();
      }
    }
    // `army_*` reste le cas SANS `unitType`, pas un type en particulier.
    expect(BONUS_LABELS.army_damage).toBe("Army Damage");
    expect(BONUS_LABELS.army_hp).toBe("Army HP");
  });

  it("`culture_points` et `culture_range` restent deux clés distinctes", () => {
    const points = findBonus("culture_points");
    const range = findBonus("culture_range");
    expect(points.componentType).toBe("CultureComponentDTO");
    expect(range.componentType).toBe("CultureComponentDTO");
    // L'un est un nombre de points, l'autre un rayon en cases : mêmes unités
    // apparentes (`integer`), grandeurs sans rapport.
    expect(points.format).toBe("integer");
    expect(range.format).toBe("integer");
    expect(range.curve?.effective[59]).toBe(6);
    expect(points.ageCurve).not.toBeNull();
    expect(range.ageCurve).toBeNull();
  });

  it("tout type de bonus émis est soit connu, soit signalé", () => {
    const proposed = new Set(HERITAGE_EXTRACT.bonusGaps.map((g) => g.proposedType));
    for (const vault of HERITAGE_EXTRACT.vaults) {
      for (const effect of vault.effects) {
        for (const bonus of effect.bonuses) {
          const known = bonus.type in BONUS_LABELS;
          expect(known || proposed.has(bonus.type), `${vault.key}/${bonus.type}`).toBe(true);
        }
      }
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Fidélité à la source — les fixtures Lua déjà couvertes par lua-formula.test.ts
// ─────────────────────────────────────────────────────────────────────────────

describe("scripts Lua extraits", () => {
  it("reprennent mot pour mot les fixtures de `lua-formula.test.ts`", () => {
    expect(getScheme("heritage_celtic").xpPerLevel.luaScript).toBe(
      "if entityLevel < 20 then return math.floor((3 * 1.10^entityLevel) + 1) else return math.floor((3 * 1.10^20 * 1.02^(entityLevel-20)) + 1) end",
    );
    expect(getScheme("heritage_celtic").keeperReputationPerLevel.luaScript).toBe(
      "return 5 * entityLevel",
    );
    expect(
      KEEPER_OFFER_FORMULAS.find((o) => o.id === "ExoticGood_2")!.luaScript,
    ).toBe("return math.floor(-250 * 1.07^keeperPurchaseCount)");
    expect(KEEPER_OFFER_FORMULAS.find((o) => o.id === "Coins_S")!.luaScript).toBe(
      "return math.floor(-15000 * playerAgeOrder * playerAgeOrder * 1.08^keeperPurchaseCount)",
    );
  });

  it("aucun n'a d'avertissement d'extraction", () => {
    expect(HERITAGE_EXTRACT.warnings).toEqual([]);
    for (const vault of HERITAGE_EXTRACT.vaults) {
      expect(vault.warnings, vault.key).toEqual([]);
    }
  });
});

function getScheme(key: string) {
  return HERITAGE_EXTRACT.vaults.find((v) => v.key === key)!;
}

// ─────────────────────────────────────────────────────────────────────────────
// Jetons ↔ niveaux
// ─────────────────────────────────────────────────────────────────────────────

describe("paliers de montée d'un évolutif", () => {
  const celtic = getEligibleEvolvingBuildings("heritage_celtic");
  const smithy = celtic.find((b) => b.key === "evolving_grand_smithy")!;

  it("un palier par niveau quittable, jamais le dernier, plus la construction", () => {
    const building = getEvolvingBuilding(smithy.key)!;
    // maxLevel - 1 montées + 1 palier de construction (0→1).
    expect(smithy.tiers).toHaveLength(building.maxLevel);
    expect(smithy.tiers[0].fromLevel).toBe(0);
    expect(smithy.tiers[1].fromLevel).toBe(1);
    expect(smithy.tiers.at(-1)!.toLevel).toBe(building.maxLevel);
    expect(resolveTierCost(smithy.tiers, building.maxLevel)).toBeNull();
  });

  it("le palier de construction (0→1) vaut le coût du domaine évolutifs", () => {
    expect(resolveTierCost(smithy.tiers, 0)).toBe(getEvolvingConstructionCost(smithy.key));
    expect(resolveTierCost(smithy.tiers, 0)).toBeGreaterThan(0);
  });

  it("les paliers valent le barème du domaine évolutifs, sans recalcul", () => {
    for (const level of [1, 7, 30, 59]) {
      expect(resolveTierCost(smithy.tiers, level)).toBe(
        getEvolvingUpgradeCost(smithy.key, level)!.evolution_tokens,
      );
    }
  });

  it("démonter n niveaux rend la somme des paliers retirés", () => {
    const expected =
      resolveTierCost(smithy.tiers, 8)! +
      resolveTierCost(smithy.tiers, 9)! +
      resolveTierCost(smithy.tiers, 10)!;
    expect(tokensFromBuildingLevels(smithy.tiers, 11, 3)).toBe(expected);
    expect(tokensFromBuildingLevels(smithy.tiers, 11, 0)).toBe(0);
  });

  it("peut démonter jusqu'au niveau 0, jetons de construction compris", () => {
    const whole = tokensFromBuildingLevels(smithy.tiers, 11, 11);
    expect(tokensFromBuildingLevels(smithy.tiers, 11, 999)).toBe(whole);
    // Depuis le niveau 1, démonter « 5 » niveaux ne peut rendre que le seul
    // palier restant : la construction (0→1), jamais plus.
    expect(tokensFromBuildingLevels(smithy.tiers, 1, 5)).toBe(
      resolveTierCost(smithy.tiers, 0),
    );
  });

  it("`levelsFromTokens` est l'inverse exact de `tokensFromBuildingLevels`", () => {
    const tokens = tokensFromBuildingLevels(smithy.tiers, 11, 4);
    const gain = levelsFromTokens(smithy.tiers, 7, tokens);
    expect(gain.targetLevel).toBe(11);
    expect(gain.levelsGained).toBe(4);
    expect(gain.spent).toBe(tokens);
    expect(gain.remaining).toBe(0);
  });

  it("un jeton de moins ne suffit plus au dernier palier", () => {
    const tokens = tokensFromBuildingLevels(smithy.tiers, 11, 4);
    const gain = levelsFromTokens(smithy.tiers, 7, tokens - 1);
    expect(gain.targetLevel).toBe(10);
    expect(gain.remaining).toBe(tokens - 1 - gain.spent);
  });

  it("une clé inconnue rend un barème vide, pas une exception", () => {
    expect(getUpgradeCostTiers("evolving_inexistant")).toEqual([]);
  });
});

describe("progression du vault en xp", () => {
  it("`tokensToVaultLevel` est la différence des cumuls", () => {
    expect(tokensToVaultLevel("heritage_celtic", 1, 1)).toBe(0);
    expect(tokensToVaultLevel("heritage_celtic", 5, 12)).toBe(
      getHeritageCumulativeXp("heritage_celtic", 12)! -
        getHeritageCumulativeXp("heritage_celtic", 5)!,
    );
  });

  it("descendre n'a pas de prix négatif", () => {
    expect(tokensToVaultLevel("heritage_celtic", 20, 3)).toBe(0);
  });

  it("`computeTargetVaultLevel` atteint pile le niveau que `tokensToVaultLevel` chiffre", () => {
    const xp = tokensToVaultLevel("heritage_celtic", 4, 15)!;
    const result = computeTargetVaultLevel("heritage_celtic", 4, xp)!;
    expect(result.targetLevel).toBe(15);
    expect(result.levelsGained).toBe(11);
    expect(result.spent).toBe(xp);
    expect(result.remaining).toBe(0);
  });

  it("le reliquat est ce qu'il reste vers le palier suivant", () => {
    const xp = tokensToVaultLevel("heritage_celtic", 4, 15)!;
    const result = computeTargetVaultLevel("heritage_celtic", 4, xp + 3)!;
    expect(result.targetLevel).toBe(15);
    expect(result.remaining).toBe(3);
  });

  it("le niveau maximal absorbe tout le reste sans déborder", () => {
    const result = computeTargetVaultLevel("heritage_celtic", 59, 10_000_000)!;
    expect(result.targetLevel).toBe(60);
    expect(result.remaining).toBeGreaterThan(0);
  });

  it("une clé inconnue rend `null`", () => {
    expect(computeTargetVaultLevel("heritage_inexistant", 1, 10)).toBeNull();
    expect(tokensToVaultLevel("heritage_inexistant", 1, 2)).toBeNull();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Loadout
// ─────────────────────────────────────────────────────────────────────────────

describe("loadout", () => {
  /** Le vault celtique au niveau `level`, avec `equipped` tel quel. */
  function celticAt(level: number, equipped: Record<string, string> = {}) {
    return resolveHeritageVault("heritage_celtic", level, "CG", {
      equipped,
      keeperReputationLevel: 1,
      keeperReputationPoints: 0,
      xpProgress: 0,
    })!;
  }

  it("`getUnlockedEffects` suit `minLevel`, et filtre par groupe", () => {
    const vault = celticAt(11);
    const unlocked = getUnlockedEffects(vault);
    expect(unlocked.length).toBeGreaterThan(0);
    for (const effect of unlocked) expect(effect.minLevel).toBeLessThanOrEqual(11);
    expect(getUnlockedEffects(vault, "boost").every((e) => e.group === "boost")).toBe(true);
    expect(getUnlockedEffects(vault, "production").every((e) => e.group === "production")).toBe(
      true,
    );
    expect(getUnlockedEffects(celticAt(60))).toHaveLength(10);
  });

  it("un effet placé dans un slot verrouillé n'est PAS appliqué", () => {
    const vault60 = celticAt(60);
    const lateSlot = vault60.slots.find((slot) => slot.minLevel === 21)!;
    const effect = getUnlockedEffects(vault60, lateSlot.group)[0];

    const equipped = { [lateSlot.id]: effect.id };
    expect(getEquippedEffects(celticAt(60, equipped)).map((e) => e.id)).toContain(effect.id);
    // Même configuration, vault redescendu sous le niveau du slot.
    expect(getEquippedEffects(celticAt(20, equipped)).map((e) => e.id)).not.toContain(effect.id);
  });

  it("appliqués et réserve partitionnent les effets débloqués", () => {
    const vault = celticAt(60);
    const slot = vault.slots.find((s) => s.group === "production" && s.minLevel === 1)!;
    const effect = getUnlockedEffects(vault, "production")[0];
    const configured = celticAt(60, { [slot.id]: effect.id });

    const applied = getEquippedEffects(configured).map((e) => e.id);
    const idle = getUnequippedUnlockedEffects(configured).map((e) => e.id);
    expect(applied).toEqual([effect.id]);
    expect(idle).not.toContain(effect.id);
    expect(applied.length + idle.length).toBe(getUnlockedEffects(configured).length);
  });

  it("`getSelectableEffects` ne propose que le groupe du slot", () => {
    const vault = celticAt(60);
    const boostSlot = vault.slots.find((s) => s.group === "boost")!;
    const selectable = getSelectableEffects(vault, boostSlot.id);
    expect(selectable.length).toBeGreaterThan(0);
    expect(selectable.every((e) => e.group === "boost")).toBe(true);
  });

  it("un effet déjà placé ailleurs sort de la liste, celui du slot courant y reste", () => {
    const vault = celticAt(60);
    const [slotA, slotB] = vault.slots.filter((s) => s.group === "production");
    const effect = getUnlockedEffects(vault, "production")[0];
    const configured = celticAt(60, { [slotA.id]: effect.id });

    expect(getSelectableEffects(configured, slotA.id).map((e) => e.id)).toContain(effect.id);
    expect(getSelectableEffects(configured, slotB.id).map((e) => e.id)).not.toContain(effect.id);
  });

  it("un slot inconnu ou pas encore atteignable ne propose rien", () => {
    const vault = celticAt(1);
    const lateSlot = vault.slots.find((slot) => slot.minLevel === 21)!;
    expect(getSelectableEffects(vault, lateSlot.id)).toEqual([]);
    expect(getSelectableEffects(vault, "Slot_Inexistant")).toEqual([]);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Bâtiments éligibles
// ─────────────────────────────────────────────────────────────────────────────

describe("bâtiments évolutifs éligibles", () => {
  it("les 13 vaults n'exposent que des évolutifs connus du domaine Bâtiments", () => {
    for (const vault of HERITAGE_VAULTS) {
      const eligible = getEligibleEvolvingBuildings(vault.key);
      expect(eligible.length, vault.key).toBeGreaterThan(0);
      for (const building of eligible) {
        expect(getEvolvingBuilding(building.key), building.key).not.toBeNull();
        expect(building.tokenDefinitionId).toBe(`EvolutionToken|${building.buildingId}`);
        expect(building.tiers.length, building.key).toBeGreaterThan(0);
      }
    }
  });

  it("un évolutif et son vault nomment PAREIL la même stat — la boussole ATH", () => {
    // ⚠️ L'INVARIANT QUI REND LE CUMUL POSSIBLE, et qui était rompu.
    //
    // L'Épave (Treasure Wreck) et le bâtiment d'héritage ATH portent les deux
    // mêmes boosts sur la même ressource : le plafond de boussoles et leur
    // vitesse de recharge. Les deux extracteurs les étiquetaient différemment —
    // l'un lisait `resourceDefinitionId`, l'autre le supposait. Additionner les
    // deux moitiés était donc impossible : elles n'avaient pas la même clé.
    //
    // Ce test compare les deux domaines de bout en bout. Il tombe si l'un des
    // deux extracteurs redérive, ce qu'aucun test interne à un domaine ne
    // pouvait voir.
    // La comparaison porte sur la forme RÉSOLUE des deux côtés — celle que
    // l'onglet lira — et non sur l'extraction brute : c'est là que la clé de
    // regroupement se jouera.
    const signature = (bonus: { type: string; resources: string[] }) =>
      `${bonus.type}[${bonus.resources.join("+")}]`;
    const compass = (bonus: { resources: string[] }) =>
      bonus.resources.includes("treasure_hunt_attempt");

    const vault = resolveHeritageVault("heritage_ath", 60, "CG")!;
    const vaultSignatures = vault.effects
      .flatMap((effect) => effect.bonuses)
      .filter(compass)
      .map(signature)
      .sort();

    const wreck = getEligibleEvolvingBuildings("heritage_ath").find(
      (building) => building.name === "Treasure Wreck",
    )!;
    const resolvedWreck = resolveEvolvingBuilding(wreck.key, 60, "CG")!;
    const wreckSignatures = [
      ...resolvedWreck.production,
      ...resolvedWreck.culture,
      ...resolvedWreck.bonuses,
    ]
      .filter(compass)
      .map(signature)
      .sort();

    const expected = [
      "regeneration_cap[treasure_hunt_attempt]",
      "regeneration_speed[treasure_hunt_attempt]",
    ];
    expect(vaultSignatures).toEqual(expected);
    expect(wreckSignatures).toEqual(expected);
  });

  it("le vault celtique donne ses quatre bâtiments, dans l'ordre du game design", () => {
    expect(getEligibleEvolvingBuildings("heritage_celtic").map((b) => b.name)).toEqual([
      "Celtic Broch",
      "Grand Smithy",
      "Druid Grove",
      "Celtic Arch",
    ]);
  });

  it("une clé inconnue rend une liste vide", () => {
    expect(getEligibleEvolvingBuildings("heritage_inexistant")).toEqual([]);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Comparaison de niveaux
// ─────────────────────────────────────────────────────────────────────────────

describe("diffVaultLevels", () => {
  it("porte sur les effets DÉBLOQUÉS, pas sur les seuls effets équipés", () => {
    const diff = diffVaultLevels("heritage_celtic", 1, 60, "CG")!;
    const resolved = resolveHeritageVault("heritage_celtic", 60, "CG")!;
    // Aucun slot n'est équipé : `activeBonuses` est vide, `after` non.
    expect(resolved.activeBonuses).toEqual([]);
    expect(diff.after.length).toBeGreaterThan(diff.before.length);
  });

  it("un palier franchi ajoute ses bonus au côté `after`", () => {
    const diff = diffVaultLevels("heritage_celtic", 10, 11, "CG")!;
    const newTypes = diff.after
      .map((b) => b.type)
      .filter((type) => !diff.before.some((b) => b.type === type));
    expect(newTypes.length).toBeGreaterThan(0);
  });

  it("deux niveaux identiques ne changent que les valeurs, jamais la liste", () => {
    const diff = diffVaultLevels("heritage_celtic", 30, 30, "CG")!;
    expect(diff.before.map((b) => b.label)).toEqual(diff.after.map((b) => b.label));
  });

  it("une clé inconnue rend `null`", () => {
    expect(diffVaultLevels("heritage_inexistant", 1, 2, "CG")).toBeNull();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Affichage des coffres
// ─────────────────────────────────────────────────────────────────────────────

describe("affichage des coffres", () => {
  /** Le premier effet à coffre du vault celtique, résolu au niveau donné. */
  function chestAt(level: number) {
    const resolved = resolveHeritageVault("heritage_celtic", level, "CG")!;
    const effect = resolved.effects.find((e) => e.rewards !== null)!;
    return resolveChestRewards(effect.rewards, level, "CG");
  }

  it("une probabilité s'écrit sans signe, contrairement à un bonus", () => {
    expect(formatChancePercent(20)).toBe("20 %");
    expect(formatChancePercent(19.047)).toBe("19 %");
    expect(formatChancePercent(33.33)).toBe("33.3 %");
  });

  it("`humanizeDefinitionId` retire la famille et coupe le camelCase", () => {
    expect(humanizeDefinitionId("InventoryItem_RefillBarracks_Infantry")).toBe(
      "Refill Barracks Infantry",
    );
    expect(humanizeDefinitionId("relic.WarriorsCrown")).toBe("Warriors Crown");
  });

  it("le libellé loca l'emporte sur l'identifiant", () => {
    expect(
      resolveChestRewardLabel({
        kind: "relic",
        id: null,
        chance: null,
        definitionId: "relic.WarriorsCrown",
        label: "Warrior's Crown",
        amount: 1,
        requirements: [],
        replacement: null,
        curve: null,
        ageCurve: null,
        resources: [],
        children: [],
      }),
    ).toBe("Warrior's Crown");
  });

  it("les poids d'une fratrie sont ramenés à 100, conditionnées comprises", () => {
    const draw = chestAt(60)
      .flatMap(function collect(node): ResolvedChestReward[] {
        return [node, ...node.children.flatMap(collect)];
      })
      .filter((node) => node.chancePercent !== null);
    expect(draw.length).toBeGreaterThan(0);
    const total = draw.reduce((sum, node) => sum + node.chancePercent!, 0);
    expect(total).toBeCloseTo(100, 6);
    expect(draw.some((node) => node.conditional)).toBe(true);
  });

  it("un nœud hors tirage n'a pas de pourcentage — pas « 0 % »", () => {
    const roots = chestAt(60);
    expect(roots[0].chance).toBeNull();
    expect(roots[0].chancePercent).toBeNull();
  });

  it("un palier absent rend une liste vide", () => {
    expect(resolveChestRewards(null, 1, "CG")).toEqual([]);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Progression du vault en xp — suivi manuel
// ─────────────────────────────────────────────────────────────────────────────

describe("xpProgress", () => {
  it("est bornée à [0, coût du palier suivant]", () => {
    const cost = getHeritageUpgradeCost("heritage_celtic", 1)!.xp;
    const over = resolveHeritageVault("heritage_celtic", 1, "CG", {
      equipped: {},
      keeperReputationLevel: 1,
      keeperReputationPoints: 0,
      xpProgress: cost + 1000,
    })!;
    expect(over.xpProgress).toBe(cost);

    const negative = resolveHeritageVault("heritage_celtic", 1, "CG", {
      equipped: {},
      keeperReputationLevel: 1,
      keeperReputationPoints: 0,
      xpProgress: -5,
    })!;
    expect(negative.xpProgress).toBe(0);
  });

  it("vaut 0 au niveau maximal, faute de palier suivant", () => {
    const atMax = resolveHeritageVault("heritage_celtic", 60, "CG", {
      equipped: {},
      keeperReputationLevel: 1,
      keeperReputationPoints: 0,
      xpProgress: 999,
    })!;
    expect(atMax.upgradeCost).toBeNull();
    expect(atMax.xpProgress).toBe(0);
  });

  it("emptyOwnedHeritageVault part à 0", () => {
    expect(emptyOwnedHeritageVault("heritage_vault.Heritage_Celtic").xpProgress).toBe(0);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Portraits — resolvers/heritage-portraits.ts
// ─────────────────────────────────────────────────────────────────────────────

describe("portraits des vaults", () => {
  it("les 13 vaults du catalogue ont un portrait", () => {
    for (const vault of HERITAGE_VAULTS) {
      expect(getHeritageVaultPortraitUrl(vault.themeId), vault.key).not.toBeNull();
    }
  });

  it("résout par le SUFFIXE du themeId, pas le préfixe de registre", () => {
    expect(getHeritageVaultPortraitUrl("heritage_vault.Heritage_Celtic")).toBe(
      "/images/vault/characters/Questgiver_StoneAge_Aedan_fullbody.webp",
    );
    expect(getHeritageVaultPortraitUrl("heritage_vault.Heritage_MaliEmpire")).toBe(
      "/images/vault/characters/Questgiver_StoneAge_MansaMusa_fullbody.webp",
    );
  });

  it("un thème inconnu rend null, pas une image inventée", () => {
    expect(getHeritageVaultPortraitUrl("heritage_vault.Heritage_Inexistant")).toBeNull();
  });
});
