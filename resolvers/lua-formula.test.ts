import { describe, it, expect } from "vitest";
import {
  evaluateLuaFormula,
  evaluateCurveFormula,
  collectLuaVariables,
  LuaFormulaError,
} from "./lua-formula";

// ─────────────────────────────────────────────────────────────────────────────
// Les scripts sont recopiés VERBATIM du game design brut
// (`source/gamedesign.json`, `DynamicLuaLongDefinitionDTO.luaScript`).
// ─────────────────────────────────────────────────────────────────────────────

describe("evaluateLuaFormula — scripts réels du game design", () => {
  it("linéaire décalé : coût de vente d'un bâtiment", () => {
    const script = "return (entityLevel * 200000) - 4900000";
    expect(evaluateLuaFormula(script, { entityLevel: 25 })).toBe(100_000);
    expect(evaluateLuaFormula(script, { entityLevel: 1 })).toBe(-4_700_000);
  });

  it("palier cyclique : bonheur d'une ferme rurale", () => {
    const script = "return (math.ceil(entityLevel / 3) * 420) - 2940";
    expect(evaluateLuaFormula(script, { entityLevel: 1 })).toBe(-2520);
    expect(evaluateLuaFormula(script, { entityLevel: 3 })).toBe(-2520);
    expect(evaluateLuaFormula(script, { entityLevel: 4 })).toBe(-2100);
    expect(evaluateLuaFormula(script, { entityLevel: 21 })).toBe(0);
  });

  it("chaîne de `if` sans `else` : coût d'upgrade en biens", () => {
    const script =
      "if (entityLevel % 3 == 1) then return 1200 end if (entityLevel % 3 == 2) then return 1600 end return 2000";
    expect(evaluateLuaFormula(script, { entityLevel: 1 })).toBe(1200);
    expect(evaluateLuaFormula(script, { entityLevel: 2 })).toBe(1600);
    expect(evaluateLuaFormula(script, { entityLevel: 3 })).toBe(2000);
    expect(evaluateLuaFormula(script, { entityLevel: 4 })).toBe(1200);
  });

  it("géométrique négative : offre du gardien du Heritage Vault", () => {
    const script = "return math.floor(-250 * 1.07^keeperPurchaseCount)";
    expect(evaluateLuaFormula(script, { keeperPurchaseCount: 0 })).toBe(-250);
    expect(evaluateLuaFormula(script, { keeperPurchaseCount: 1 })).toBe(-268);
    expect(evaluateLuaFormula(script, { keeperPurchaseCount: 5 })).toBe(-351);
  });

  it("`if`/`else` explicite : coût d'upgrade du Heritage Vault, cassure au niveau 20", () => {
    const script =
      "if entityLevel < 20 then return math.floor((3 * 1.10^entityLevel) + 1) else return math.floor((3 * 1.10^20 * 1.02^(entityLevel-20)) + 1) end";
    expect(evaluateLuaFormula(script, { entityLevel: 0 })).toBe(4);
    expect(evaluateLuaFormula(script, { entityLevel: 19 })).toBe(Math.floor(3 * 1.1 ** 19 + 1));
    expect(evaluateLuaFormula(script, { entityLevel: 20 })).toBe(Math.floor(3 * 1.1 ** 20 + 1));
    expect(evaluateLuaFormula(script, { entityLevel: 30 })).toBe(
      Math.floor(3 * 1.1 ** 20 * 1.02 ** 10 + 1),
    );
  });

  it("puissance fractionnaire arrondie au pas de 50 : bâtiment événement évolutif", () => {
    const script = "return math.floor((4191 * entityLevel ^ 0.6) / 50 + 0.5) * 50";
    expect(evaluateLuaFormula(script, { entityLevel: 1 })).toBe(4200);
    expect(evaluateLuaFormula(script, { entityLevel: 10 })).toBe(
      Math.floor((4191 * 10 ** 0.6) / 50 + 0.5) * 50,
    );
  });

  it("bilinéaire âge × niveau : effet Food du Heritage Vault", () => {
    const script = "return math.floor(1800 * playerAgeOrder * entityLevel + 8000 * playerAgeOrder)";
    expect(evaluateLuaFormula(script, { playerAgeOrder: 1, entityLevel: 0 })).toBe(8000);
    expect(evaluateLuaFormula(script, { playerAgeOrder: 5, entityLevel: 10 })).toBe(130_000);
  });

  it("cubique : xp par niveau du Heritage Vault", () => {
    const script = "return 25 * entityLevel * (entityLevel + 1) * (entityLevel + 2) / 3";
    expect(evaluateLuaFormula(script, { entityLevel: 0 })).toBe(0);
    expect(evaluateLuaFormula(script, { entityLevel: 1 })).toBe(50);
    expect(evaluateLuaFormula(script, { entityLevel: 3 })).toBe(500);
  });

  it("géométrique pondérée par le carré de l'âge : offre Coins_S du gardien", () => {
    const script =
      "return math.floor(-15000 * playerAgeOrder * playerAgeOrder * 1.08^keeperPurchaseCount)";
    expect(evaluateLuaFormula(script, { playerAgeOrder: 1, keeperPurchaseCount: 0 })).toBe(-15_000);
    expect(evaluateLuaFormula(script, { playerAgeOrder: 3, keeperPurchaseCount: 2 })).toBe(
      Math.floor(-15000 * 9 * 1.08 ** 2),
    );
  });
});

describe("evaluateLuaFormula — sémantique Lua", () => {
  it("`^` lie plus fort que le moins unaire", () => {
    expect(evaluateLuaFormula("return -2^2", {})).toBe(-4);
  });

  it("`^` est associatif à droite", () => {
    expect(evaluateLuaFormula("return 2^3^2", {})).toBe(512);
  });

  it("`%` est le modulo plancher, pas celui de JavaScript", () => {
    expect(evaluateLuaFormula("return entityLevel % 3", { entityLevel: -1 })).toBe(2);
  });

  it("`/` est une division flottante", () => {
    expect(evaluateLuaFormula("return 7 / 2", {})).toBe(3.5);
  });

  it("`0` est vrai, contrairement à JavaScript", () => {
    expect(evaluateLuaFormula("if entityLevel % 3 then return 1 end return 0", { entityLevel: 3 })).toBe(1);
  });

  it("un `if` sans `else` non pris passe à l'instruction suivante", () => {
    const script = "if (entityLevel % 3 == 1) then return -1 end return 0";
    expect(evaluateLuaFormula(script, { entityLevel: 1 })).toBe(-1);
    expect(evaluateLuaFormula(script, { entityLevel: 2 })).toBe(0);
  });

  it("math.max accepte plusieurs arguments", () => {
    const script = "return math.floor(200 + 30*entityLevel + 4*entityLevel*math.max(0, playerAgeOrder-4))";
    expect(evaluateLuaFormula(script, { entityLevel: 10, playerAgeOrder: 2 })).toBe(500);
    expect(evaluateLuaFormula(script, { entityLevel: 10, playerAgeOrder: 6 })).toBe(580);
  });
});

describe("evaluateLuaFormula — erreurs", () => {
  it("refuse une variable absente du contexte", () => {
    expect(() => evaluateLuaFormula("return entityLevel * 2", {})).toThrow(LuaFormulaError);
  });

  it("refuse une variable inconnue du game design", () => {
    expect(() => evaluateLuaFormula("return foo * 2", { foo: 3 })).toThrow(/Variable inconnue/);
  });

  it("refuse une fonction non supportée", () => {
    expect(() => evaluateLuaFormula("return math.sqrt(4)", {})).toThrow(/non supportée/);
  });

  it("refuse un script sans `return` atteignable", () => {
    expect(() => evaluateLuaFormula("if entityLevel < 5 then return 1 end", { entityLevel: 9 })).toThrow(
      /Aucun « return » atteint/,
    );
  });

  it("refuse un script syntaxiquement incomplet", () => {
    expect(() => evaluateLuaFormula("return (1 + 2", {})).toThrow(LuaFormulaError);
    expect(() => evaluateLuaFormula("", {})).toThrow(LuaFormulaError);
  });

  it("refuse une construction Lua hors sous-langage", () => {
    expect(() => evaluateLuaFormula("local x = 1 return x", {})).toThrow(LuaFormulaError);
  });
});

describe("collectLuaVariables", () => {
  it("liste les variables réellement lues, dans l'ordre canonique", () => {
    expect(
      collectLuaVariables(
        "return math.floor(-15000 * playerAgeOrder * playerAgeOrder * 1.08^keeperPurchaseCount)",
      ),
    ).toEqual(["keeperPurchaseCount", "playerAgeOrder"]);
    expect(collectLuaVariables("return 25 * entityLevel * (entityLevel + 1) / 3")).toEqual([
      "entityLevel",
    ]);
  });

  it("inspecte aussi les branches conditionnelles", () => {
    expect(
      collectLuaVariables("if entityLevel < 20 then return entityAgeOrder else return 0 end"),
    ).toEqual(["entityLevel", "entityAgeOrder"]);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Les formules sont recopiées VERBATIM du game design brut
// (`source/gamedesign.json`, `dynamicFormulaChangeCase.formula`), espaces
// compris — l'une d'elles écrit « 25 ) ».
// ─────────────────────────────────────────────────────────────────────────────

describe("evaluateCurveFormula — formules réelles des bâtiments `evolving`", () => {
  it("points de culture : Dv_…_Aqueduct_1_CultureValues_ClassicGreece", () => {
    const formula = "(#level + 18) * 5";
    expect(evaluateCurveFormula(formula, { level: 1 })).toBe(95);
    expect(evaluateCurveFormula(formula, { level: 60 })).toBe(390);
  });

  it("portée de culture : Dv_…_Aqueduct_1_CultureRange", () => {
    const formula = "(#level / 30) + 1";
    expect(evaluateCurveFormula(formula, { level: 30 })).toBe(2);
    expect(evaluateCurveFormula(formula, { level: 60 })).toBe(3);
  });

  it("biens produits par cycle : Dac_…_Aqueduct_1_CEGoods_RomanEmpireAndLater", () => {
    const formula = "(#level * 5.5) + 69";
    expect(evaluateCurveFormula(formula, { level: 1 })).toBe(74.5);
    expect(evaluateCurveFormula(formula, { level: 60 })).toBe(399);
  });

  it("coût de montée en jetons : Dac_…_Aqueduct_1_UpgradeCosts", () => {
    const formula = "-1 * (#level / 5)";
    expect(evaluateCurveFormula(formula, { level: 5 })).toBe(-1);
    expect(evaluateCurveFormula(formula, { level: 60 })).toBe(-12);
  });

  it("moins unaire imbriqué : Dac_…_FountainOfYouth_1_UpgradeCosts", () => {
    const formula = "(-1 * (#level / 5)) - 1";
    expect(evaluateCurveFormula(formula, { level: 5 })).toBe(-2);
    expect(evaluateCurveFormula(formula, { level: 40 })).toBe(-9);
  });

  it("constante en tête : Dv_…_AztecMainTemple_1_Duration", () => {
    const formula = "14400 - (180 * #level)";
    expect(evaluateCurveFormula(formula, { level: 1 })).toBe(14_220);
    expect(evaluateCurveFormula(formula, { level: 60 })).toBe(3600);
  });

  it("parenthèses imbriquées et espace avant « ) » : Dac_…_SacredMarae_1_PreviousEraGoods_StoneAge", () => {
    const formula = "((#level + 25 ) * 5) / 3";
    expect(evaluateCurveFormula(formula, { level: 2 })).toBe(45);
    expect(evaluateCurveFormula(formula, { level: 5 })).toBe(50);
  });

  it("pente négative : Dac_…_TreasureWreck_1_UpgradeCosts", () => {
    const formula = "(-2 * #level) + 50";
    expect(evaluateCurveFormula(formula, { level: 34 })).toBe(-18);
  });

  it("soustraction finale : Dac_…_HotAirBalloon_1_TertiaryGoods_StoneAge", () => {
    const formula = "(#level * 10) - 40";
    expect(evaluateCurveFormula(formula, { level: 5 })).toBe(10);
  });
});

describe("evaluateCurveFormula — bornes du dialecte", () => {
  it("refuse un mot-clé Lua : la formule est une expression nue", () => {
    expect(() => evaluateCurveFormula("return (#level * 2)", { level: 1 })).toThrow(LuaFormulaError);
    expect(() => evaluateCurveFormula("if #level < 2 then return 1 end", { level: 1 })).toThrow(
      LuaFormulaError,
    );
  });

  it("refuse un jeton résiduel après l'expression", () => {
    expect(() => evaluateCurveFormula("(#level * 2) 3", { level: 1 })).toThrow(LuaFormulaError);
  });

  it("refuse une formule vide ou un « # » orphelin", () => {
    expect(() => evaluateCurveFormula("", { level: 1 })).toThrow(LuaFormulaError);
    expect(() => evaluateCurveFormula("#", { level: 1 })).toThrow(LuaFormulaError);
  });

  it("exige le préfixe « # » : `level` nu n'est pas une variable", () => {
    expect(() => evaluateCurveFormula("level * 2", { level: 1 })).toThrow(LuaFormulaError);
  });

  it("refuse une variable absente ou non numérique", () => {
    expect(() => evaluateCurveFormula("#level * 2", { level: Number.NaN })).toThrow(
      LuaFormulaError,
    );
  });

  it("les deux vocabulaires sont disjoints", () => {
    expect(() => evaluateCurveFormula("#entityLevel * 2", { level: 1 })).toThrow(LuaFormulaError);
    expect(() => evaluateLuaFormula("return #level", { level: 1 })).toThrow(LuaFormulaError);
    expect(() => evaluateLuaFormula("return level", { level: 1 })).toThrow(LuaFormulaError);
  });
});
