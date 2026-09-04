import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import {
  HERITAGE_VAULTS,
  diffVaultLevels,
  resolveHeritageVault,
} from "@/resolvers/heritage";
import {
  EVOLVING_BUILDINGS,
  resolveEvolvingBuilding,
} from "@/resolvers/evolving-buildings";
import { bonusKey } from "@/resolvers/bonus";
import { describeHeritageBonus } from "./effect-display";
import { EffectIcon } from "./effect-icon";

// ============================================================
// Filet anti-régression de l'icône secondaire.
//
// L'overlay dit SUR QUOI porte le boost (épée = attaque, cœur = points de vie).
// Il a déjà disparu silencieusement d'un affichage à l'autre — la donnée
// existait à la source mais était jetée en route. On vérifie donc la chaîne
// entière sur un cas réel : Forge of Flames niveau 11, infanterie lourde,
// attaque.
// ============================================================

const MAIN = "/images/icons/icon_unit_heavyinfantry.webp";
const OVERLAY = "/images/icons/icon_unitstat_damage.webp";

/** Le bonus d'attaque d'infanterie lourde du vault celtique au niveau 11. */
function heavyInfantryDamage() {
  const vault = resolveHeritageVault("heritage_celtic", 11, "CG")!;
  const bonus = vault.effects
    .flatMap((effect) => effect.bonuses)
    .find((candidate) => candidate.type === "heavy_infantry_damage");
  if (bonus === undefined) throw new Error("Fixture absente : Celtic @11 heavy_infantry_damage");
  return bonus;
}

describe("chaîne de l'overlay — résolution", () => {
  it("`describeHeritageBonus` porte l'unité en principal et la stat en overlay", () => {
    const display = describeHeritageBonus(heavyInfantryDamage(), []);
    expect(display.src).toBe(MAIN);
    expect(display.overlaySrc).toBe(OVERLAY);
  });

  it("un bonus sans type d'unité n'invente aucun overlay", () => {
    const vault = resolveHeritageVault("heritage_celtic", 60, "CG")!;
    const culture = vault.effects
      .flatMap((effect) => effect.bonuses)
      .find((bonus) => bonus.type === "culture_points")!;
    expect(describeHeritageBonus(culture, []).overlaySrc).toBeNull();
  });

  it("`diffVaultLevels` transporte l'overlay jusqu'aux lignes comparées", () => {
    const { after } = diffVaultLevels("heritage_celtic", 1, 11, "CG")!;
    const line = after
      .map((bonus) => describeHeritageBonus(bonus, []))
      .find((display) => display.overlaySrc === OVERLAY);
    expect(line).toBeDefined();
    expect(line!.src).toBe(MAIN);
  });
});

describe("chaîne de l'overlay — rendu", () => {
  it("`EffectIcon` rend l'image d'overlay quand elle est fournie", () => {
    const html = renderToStaticMarkup(
      createElement(EffectIcon, {
        src: MAIN,
        overlaySrc: OVERLAY,
        alt: "Attaque",
        size: 15,
      }),
    );
    expect(html).toContain("icon_unit_heavyinfantry");
    expect(html).toContain("icon_unitstat_damage");
  });

  it("`EffectIcon` n'en rend AUCUNE sans overlay", () => {
    const html = renderToStaticMarkup(
      createElement(EffectIcon, { src: MAIN, alt: "Attaque", size: 15 }),
    );
    expect(html).toContain("icon_unit_heavyinfantry");
    expect(html).not.toContain("icon_unitstat_damage");
  });
});

describe("échelle des pourcentages", () => {
  it("un ratio de bonus est affiché en points de pourcentage", () => {
    const bonus = heavyInfantryDamage();
    // La valeur stockée est un ratio (0,03…) — l'affichage doit lire « +3 % »,
    // jamais « +0 % ».
    expect(bonus.value).toBeLessThan(1);
    const rendered = describeHeritageBonus(bonus, []).value;
    expect(rendered.startsWith("+")).toBe(true);
    // ⚠️ Virgule décimale : `formatBonusValue("percent", …)` suit la notation du
    // jeu (« +4,64 % »). `parseFloat` s'arrêterait à la virgule et lirait 4.
    const magnitude = parseFloat(rendered.slice(1).replace(",", ".").replace(" %", ""));
    expect(magnitude).toBeCloseTo(bonus.value! * 100, 1);
  });
});

// ============================================================
// Arrondi des quantités du vault — relevé en jeu, pas déduit.
//
// Vault Thaï niveau 1, premier effet de production (`goods_output`), en ne
// faisant monter QUE le rang de gardien. La valeur de base vaut 130 sur toute
// ère ≥ Byzantine, ce qui rend la série lisible : chaque rang ajoute 1,3 en
// interne, et l'affichage arrondit VERS LE HAUT. C'est ce qui produit le pas
// irrégulier +2 / +1 / +1 / +2 / +1 observé à l'écran.
//
// Ces six nombres sont des MESURES. Un test qui échoue ici ne dit pas
// « le code a changé » mais « le code ne rend plus ce que le jeu affiche ».
// ============================================================

/** Ce que le jeu affiche aux rangs de gardien 1 à 6. */
const THAI_GOODS_IN_GAME = [130, 132, 133, 134, 136, 137];

/** Le `goods_output` du premier effet du vault Thaï, à un rang de gardien donné. */
function thaiGoodsAtKeeperRank(keeperReputationLevel: number) {
  // ⚠️ Par ID D'EFFET, pas par type : le vault Thaï porte DEUX `goods_output`
  // (l'effet 1 dès le niveau 1, l'effet 4 à partir du 21), et un `find` sur le
  // seul type appuierait la mesure sur celui que l'ordre de la donnée fait
  // sortir en premier.
  const vault = resolveHeritageVault("heritage_thai", 1, "BE", {
    equipped: {},
    keeperReputationLevel,
    keeperReputationPoints: 0,
    xpProgress: 0,
  })!;
  const effect = vault.effects.find((candidate) => candidate.id === "Heritage_Thai_Effect_1");
  if (effect === undefined) throw new Error("Fixture absente : Heritage_Thai_Effect_1");
  const bonus = effect.bonuses.find((candidate) => candidate.type === "goods_output");
  if (bonus === undefined) throw new Error("Fixture absente : Thaï effet 1 goods_output");
  return bonus;
}

describe("arrondi de l'amplificateur du gardien", () => {
  it("rend les six valeurs relevées en jeu", () => {
    const rendered = THAI_GOODS_IN_GAME.map((_, index) =>
      describeHeritageBonus(thaiGoodsAtKeeperRank(index + 1), [], true).value,
    );
    expect(rendered).toEqual(THAI_GOODS_IN_GAME.map(String));
  });

  it("le rang 1 rend la valeur de base NUE — c'est ce qui établit `rang − 1`", () => {
    const bonus = thaiGoodsAtKeeperRank(1);
    expect(bonus.value).toBe(130);
    expect(bonus.amplified).toBe(130);
  });

  it("réfute l'arrondi au plus proche là où les deux règles divergent", () => {
    // Rangs 2 et 5 : les seuls des six où `Math.round` donnerait autre chose
    // (131 et 135). Le jeu dit 132 et 136.
    expect(describeHeritageBonus(thaiGoodsAtKeeperRank(2), [], true).value).toBe("132");
    expect(describeHeritageBonus(thaiGoodsAtKeeperRank(5), [], true).value).toBe("136");
  });

  it("réfute un incrément entier par rang", () => {
    // « +2 par rang » collerait aux rangs 1 et 2 puis dériverait : 134 au rang 3.
    expect(describeHeritageBonus(thaiGoodsAtKeeperRank(3), [], true).value).toBe("133");
  });

  it("garde la valeur EXACTE pour le calcul — l'arrondi est un fait d'affichage", () => {
    // Le cumul de l'onglet Combination lit `amplified`, pas la chaîne affichée :
    // arrondir en amont ferait dériver un total d'une unité par ligne ajoutée.
    expect(thaiGoodsAtKeeperRank(2).amplified).toBeCloseTo(131.3, 9);
    expect(thaiGoodsAtKeeperRank(5).amplified).toBeCloseTo(135.2, 9);
  });

  it("ne touche pas une valeur non amplifiée — elles sont déjà entières", () => {
    // Sans amplification demandée, l'affichage rend la valeur nue : la règle ne
    // peut pas gonfler un chiffre au passage.
    expect(describeHeritageBonus(thaiGoodsAtKeeperRank(6), [], false).value).toBe("130");
  });
});


// ============================================================
// Régénération : le sens du pourcentage, et son icône.
//
// Relevé en jeu sur l'Épave (Treasure Wreck) niveau 60 — capture d'écran :
//
//   [boussole + pendule]  « Accélère le temps de régénération de Tentative
//    45,0 %                 de 45,0 %. »
//
// La valeur BRUTE du game design à ce niveau est 0,55 : c'est le temps qui
// RESTE, pas le gain. L'extraction convertit désormais (`invertDurationCurve`),
// et ces tests vérifient que la conversion arrive intacte jusqu'à l'écran.
// ============================================================

describe("vitesse de régénération", () => {
  /** Le boost de recharge de boussole de l'Épave, à un niveau donné. */
  function wreckRegenSpeed(level: number) {
    const wreck = resolveEvolvingBuilding("evolving_treasure_wreck", level, "CG")!;
    const bonus = [...wreck.production, ...wreck.culture, ...wreck.bonuses].find(
      (candidate) => candidate.type === "regeneration_speed",
    );
    if (bonus === undefined) throw new Error("Fixture absente : Épave regeneration_speed");
    return bonus;
  }

  it("l'Épave niveau 60 affiche « +45 % », comme le jeu", () => {
    expect(describeHeritageBonus(wreckRegenSpeed(60), []).value).toBe("+45 %");
  });

  it("le barème entier est un GAIN, pas un reste", () => {
    // Les paliers annoncés en jeu : 2 % au départ, 45 % au bout. Le complément
    // à 100 (98 %, 55 %) serait le temps restant — l'erreur d'avant.
    expect(describeHeritageBonus(wreckRegenSpeed(1), []).value).toBe("+2 %");
    expect(describeHeritageBonus(wreckRegenSpeed(15), []).value).toBe("+10 %");
    expect(describeHeritageBonus(wreckRegenSpeed(40), []).value).toBe("+30 %");
  });

  it("le bâtiment d'héritage suit la même unité que l'évolutif", () => {
    // ⚠️ Sans ça, l'onglet Combination additionnerait un gain et un reste. Le
    // vault ATH débloque ce boost au niveau 4, à 8,4 % — le chiffre du jeu.
    const vault = resolveHeritageVault("heritage_ath", 4, "BE")!;
    const bonus = vault.effects
      .flatMap((effect) => effect.bonuses)
      .find((candidate) => candidate.type === "regeneration_speed")!;
    expect(bonus.value).toBeCloseTo(0.084, 9);
    expect(describeHeritageBonus(bonus, []).value).toBe("+8,4 %");
  });

  it("porte la pendule en overlay, sur l'icône de la ressource régénérée", () => {
    // Ce que montre la capture : la boussole en principal, la pendule par-dessus.
    const display = describeHeritageBonus(wreckRegenSpeed(60), []);
    expect(display.src).toBe("/images/goods/treasure_hunt_attempt.webp");
    expect(display.overlaySrc).toBe("/images/icons/icon_time_boost.webp");
  });

  it("le PLAFOND garde la flèche, pas la pendule — il ne raccourcit rien", () => {
    const wreck = resolveEvolvingBuilding("evolving_treasure_wreck", 60, "CG")!;
    const cap = [...wreck.production, ...wreck.culture, ...wreck.bonuses].find(
      (candidate) => candidate.type === "regeneration_cap",
    )!;
    const display = describeHeritageBonus(cap, []);
    expect(display.src).toBe("/images/goods/treasure_hunt_attempt.webp");
    expect(display.overlaySrc).toBe("/images/icons/icon_arrow_boost.webp");
  });
});


// ============================================================
// Filet anti-régression de l'icône PRINCIPALE — le repli `info`.
//
// `bonusIconsBase` se termine par `imagesUrl.info`, qui veut dire « je ne sais
// pas quoi montrer ». Ce repli est SILENCIEUX : rien ne casse, la ligne
// s'affiche, et seul un œil qui connaît le jeu remarque que l'icône est
// générique. C'est exactement ce qui est arrivé à la Hutte de Baba Yaga, arrivée
// avec l'évènement Halloween : son boost de biens est le premier du game design
// écrit `resourceType: "resource.good"` au lieu de `"good"`, il ne nomme donc
// aucun bien concret et aucune branche ne le rattrapait.
//
// Le balayage ci-dessous rend ce repli BRUYANT : toute forme de bonus qu'un
// prochain fichier game design introduirait sans qu'aucune branche ne la
// reconnaisse fait échouer ce test au lieu de passer inaperçue à l'écran.
//
// ⚠️ Si ce test échoue après une mise à jour de `source/gamedesign.json`, la
// correction n'est PAS de retirer le cas du balayage : c'est d'ajouter la
// branche qui donne son icône au bonus (`components/heritage/effect-display.ts`).
// ============================================================

/** Les ères qui bornent le domaine jouable, plus une au milieu. */
const SCANNED_ERAS = ["BE", "CG", "LG"] as const;

function unknownIconCases(): string[] {
  const cases = new Set<string>();
  const record = (carrier: string, bonus: { type: string }) => {
    const { src } = describeHeritageBonus(bonus as never, []);
    if (src === "/images/game_icons/icon_flat_info.webp") {
      cases.add(`${carrier} — ${bonus.type}`);
    }
  };

  for (const building of EVOLVING_BUILDINGS) {
    for (const era of SCANNED_ERAS) {
      for (const level of [1, 10, 30, building.maxLevel]) {
        const resolved = resolveEvolvingBuilding(building.key, level, era);
        if (resolved === null) continue;
        for (const bonus of [...resolved.production, ...resolved.culture, ...resolved.bonuses]) {
          record(building.key, bonus);
        }
      }
    }
  }

  for (const vault of HERITAGE_VAULTS) {
    for (const era of SCANNED_ERAS) {
      for (const level of [1, 20, 40, 60]) {
        const resolved = resolveHeritageVault(vault.key, level, era);
        if (resolved === null) continue;
        for (const bonus of resolved.effects.flatMap((effect) => effect.bonuses)) {
          record(vault.key, bonus);
        }
      }
    }
  }

  return [...cases].sort();
}

describe("icône principale — aucun bonus ne retombe sur `info`", () => {
  it("balaye les 44 évolutifs et les 13 vaults sans repli inconnu", () => {
    expect(unknownIconCases()).toEqual([]);
  });

  it("le boost de biens de Baba Yaga se lit comme celui du bâtiment d'héritage", () => {
    // `Base.BuildingTypes.Good` = « Workshops » dans la loca : un boost de biens
    // de la capitale et le « Workshop Production Boost » du vault visent la même
    // chose. Ils partagent donc CLÉ, libellé et icône — c'est ce qui permet à
    // l'onglet Combination de les cumuler au lieu d'aligner deux lignes
    // identiques.
    //
    // ⚠️ Établi sur la loca, PAS sur un relevé en jeu : la Hutte n'est pas encore
    // jouable. Si l'évènement dit autre chose, la bascule se fait dans
    // `projectResourceBoost()` (scripts/extract/buildings.ts), et ce test suit.
    const hut = resolveEvolvingBuilding("evolving_baba_yaga", 10, "CG")!;
    const boost = [...hut.production, ...hut.culture, ...hut.bonuses].find(
      (candidate) => candidate.type === "building_type_production",
    );
    if (boost === undefined) throw new Error("Fixture absente : Baba Yaga building_type_production");
    expect(boost.scope).toEqual({ kind: "buildingType", value: "workshop" });
    expect(boost.label).toBe("Workshop Production Boost");
    expect(describeHeritageBonus(boost, []).src).toBe(
      "/images/game_icons/icon_flat_workshop.webp",
    );
  });

  it("la Hutte et le vault Halloween tombent sous la MÊME clé de cumul", () => {
    // Le seul test qui vérifie l'unification côté cumul : `bonusKey` est ce que
    // `combineBonuses` regroupe. Deux clés distinctes rendraient deux lignes.
    const hut = resolveEvolvingBuilding("evolving_baba_yaga", 10, "CG")!;
    const hutBoost = [...hut.production, ...hut.culture, ...hut.bonuses].find(
      (candidate) => candidate.type === "building_type_production",
    )!;
    const vault = resolveHeritageVault("heritage_halloween", 60, "CG")!;
    const vaultBoost = vault.effects
      .flatMap((effect) => effect.bonuses)
      .find((candidate) => candidate.type === "building_type_production");
    if (vaultBoost === undefined) {
      throw new Error("Fixture absente : vault Halloween building_type_production");
    }
    expect(bonusKey(hutBoost)).toBe(bonusKey(vaultBoost));
  });

  it("un boost de biens HORS capitale garde l'icône générique du bien", () => {
    // La règle « biens = ateliers » s'arrête à la capitale : une cité alliée
    // produit ses biens ailleurs (mine d'or, papyrus, carrière). Sans bâtiment
    // à nommer, l'icône reste celle du bien — et surtout PAS `info`.
    const allied = {
      type: "goods_production",
      format: "percent",
      value: 0.1,
      resources: [],
      scope: { kind: "city", value: "City_China" },
      instance: 1,
    } as never;
    expect(describeHeritageBonus(allied, []).src).toBe("/images/goods/default.webp");
  });

  it("un boost de biens QUI nomme son bien garde l'icône de ce bien", () => {
    // La branche ressource passe avant : le repli générique ne peut pas écraser
    // un bien concret.
    const named = {
      type: "goods_production",
      format: "percent",
      value: 0.1,
      resources: ["mead"],
      scope: null,
      instance: 1,
    } as never;
    expect(describeHeritageBonus(named, []).src).toContain("mead");
  });
});
