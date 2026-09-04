// Garde-fou de l'extraction du domaine Bâtiments
// (data/buildings/generated/buildings.generated.ts). Vérifie ce que consomme
// réellement le Calculator : clé de registre, unicité (level, era), codes
// d'ère, vocabulaire de biens, et surtout la discipline de bonus — aucune clé
// n'entre dans le dictionnaire partagé sans passer par `bonusGaps`.
//
// ⚠️ Ce test porte sur la donnée GÉNÉRÉE. La donnée saisie à la main
// (data/capital/**, data/allieds/**) reste en place et fournit les `levels` du
// registre : la comparaison entre les deux est le travail de
// `pnpm diff:buildings`, pas d'une assertion.
import { describe, it, expect } from "vitest";
import {
  BUILDING_EXTRACT,
  BUILDING_RAW_DATA,
} from "@/data/buildings/generated/buildings.generated";
import { ELEMENT_DATA_REGISTRY } from "@/data/registry";
import { HAND_ELEMENT_DATA } from "@/data/registry-hand";
import type { Good } from "@/types/shared";
import { ERAS } from "@/data/config";
import { goodsByCivilization } from "@/lib/constants";
import { BONUS_LABELS, formatBonusValue } from "@/resolvers/bonus";

const ERA_GOOD = /^(primary|secondary|tertiary)_([a-z]{2})$/;
const ERA_ABBRS: Set<string> = new Set(ERAS.map((era) => era.abbr));

describe("bâtiments — extraction", () => {
  it("192 chaînes pour 693 définitions, 144 projetées vers l'app", () => {
    expect(BUILDING_EXTRACT.buildings.length).toBe(192);
    const definitions = BUILDING_EXTRACT.buildings.reduce(
      (total, building) => total + building.levels.length,
      0,
    );
    expect(definitions).toBe(693);
    expect(BUILDING_RAW_DATA.length).toBe(144);
    expect(BUILDING_EXTRACT.buildings.filter((b) => b.scope === "app").length).toBe(100);
    expect(BUILDING_EXTRACT.buildings.filter((b) => b.scope === "evolving").length).toBe(44);
  });

  // `BuildingRawEntry` porte les dimensions par chaîne : ce serait une perte si
  // un maillon en changeait en cours de route.
  it("les dimensions sont constantes sur toute la chaîne d'upgrade", () => {
    const variables: string[] = [];
    for (const building of BUILDING_EXTRACT.buildings) {
      const dimensions = new Set(building.levels.map((l) => `${l.width}x${l.height}`));
      if (dimensions.size > 1) variables.push(building.chainKey);
    }
    expect(variables).toEqual([]);
  });

  // Une chaîne `undeclared` est un bâtiment que le jeu a livré et que ni la
  // table de présentation ni les classes hors périmètre ne connaissent : c'est
  // exactement ce que l'extracteur doit rendre visible.
  it("aucune chaîne non classée", () => {
    const undeclared = BUILDING_EXTRACT.buildings.filter((b) => b.scope === "undeclared");
    expect(undeclared.map((b) => b.chainKey)).toEqual([]);
  });

  it("chaque projection porte une clé de `ELEMENT_DATA_REGISTRY`", () => {
    for (const entry of BUILDING_RAW_DATA) {
      expect(ELEMENT_DATA_REGISTRY[entry.key], `clé ${entry.key}`).toBeDefined();
    }
    expect(new Set(BUILDING_RAW_DATA.map((e) => e.key)).size).toBe(BUILDING_RAW_DATA.length);
  });

  // docs/data-contracts.md §1.1 a) contrainte 1 : `data-hydration.ts` filtre sur
  // `l.era === era && l.level === level`. Un doublon rendrait le tri arbitraire.
  it("le couple (level, era) est unique dans chaque bâtiment", () => {
    for (const entry of BUILDING_RAW_DATA) {
      const seen = new Set<string>();
      for (const level of entry.levels) {
        const key = `${level.level}/${level.era}`;
        expect(seen.has(key), `${entry.key} — ${key} en double`).toBe(false);
        seen.add(key);
      }
    }
  });

  it("les niveaux sont croissants et les ères connues de data/config.ts", () => {
    for (const entry of BUILDING_RAW_DATA) {
      let previous = 0;
      for (const level of entry.levels) {
        expect(level.level, `${entry.key} niveau non croissant`).toBeGreaterThan(previous);
        previous = level.level;
        expect(ERA_ABBRS.has(level.era), `${entry.key} ère ${level.era}`).toBe(true);
      }
    }
  });

  // docs/data-contracts.md §1.1 a) contrainte 3 : `Good.resource` porte deux
  // conventions superposées, et rien d'autre.
  it("chaque bien de coût est un bien d'ère ou un bien connu de lib/constants.ts", () => {
    const known = new Set(Object.values(goodsByCivilization).flatMap((c) => c.goods));
    for (const entry of BUILDING_RAW_DATA) {
      for (const level of entry.levels) {
        for (const costs of [level.construction, level.upgrade]) {
          for (const good of costs?.goods ?? []) {
            const isEraGood = ERA_GOOD.test(good.resource);
            expect(
              isEraGood || known.has(good.resource),
              `${entry.key} niveau ${level.level} — bien inconnu : ${good.resource}`,
            ).toBe(true);
            if (isEraGood) {
              const abbr = ERA_GOOD.exec(good.resource)![2].toUpperCase();
              expect(ERA_ABBRS.has(abbr), `ère du bien ${good.resource}`).toBe(true);
            }
          }
        }
      }
    }
  });

  it("les coûts sont des entiers strictement positifs", () => {
    for (const entry of BUILDING_RAW_DATA) {
      for (const level of entry.levels) {
        for (const costs of [level.construction, level.upgrade]) {
          if (costs === undefined) continue;
          for (const [key, value] of Object.entries(costs)) {
            if (key === "goods") continue;
            expect(typeof value === "number" && value > 0, `${entry.key} ${key}=${value}`).toBe(true);
          }
          for (const good of costs.goods ?? []) {
            expect(good.amount, `${entry.key} ${good.resource}`).toBeGreaterThan(0);
          }
        }
      }
    }
  });

  it("`max_qty` est un entier positif quand il est présent", () => {
    for (const entry of BUILDING_RAW_DATA) {
      for (const level of entry.levels) {
        if (level.max_qty === undefined) continue;
        expect(Number.isInteger(level.max_qty), `${entry.key} niveau ${level.level}`).toBe(true);
        expect(level.max_qty, `${entry.key} niveau ${level.level}`).toBeGreaterThan(0);
      }
    }
  });
});

describe("bâtiments — vocabulaire de bonus", () => {
  const allBonuses = BUILDING_EXTRACT.buildings.flatMap((b) =>
    b.levels.flatMap((l) => l.bonuses),
  );
  const proposed = new Set(BUILDING_EXTRACT.bonusGaps.map((gap) => gap.proposedType));

  // C'est LA règle du domaine : soit la clé existe déjà dans le dictionnaire
  // partagé et elle est réutilisée telle quelle, soit elle est signalée pour
  // validation. Aucun troisième cas — pas de clé inventée en silence.
  it("chaque clé de bonus est soit dans BONUS_LABELS, soit déclarée comme écart", () => {
    for (const bonus of allBonuses) {
      const isKnown = BONUS_LABELS[bonus.type] !== undefined;
      expect(
        isKnown || proposed.has(bonus.type),
        `bonus ${bonus.type} : ni dans BONUS_LABELS, ni dans bonusGaps`,
      ).toBe(true);
    }
  });

  it("aucun type proposé n'est déjà dans BONUS_LABELS", () => {
    for (const type of proposed) {
      expect(BONUS_LABELS[type], `${type} est déjà au dictionnaire — ce n'est pas un écart`).toBeUndefined();
    }
  });

  it("chaque écart de vocabulaire porte une raison et un exemple", () => {
    for (const gap of BUILDING_EXTRACT.bonusGaps) {
      expect(gap.reason.length, gap.proposedType).toBeGreaterThan(0);
      expect(gap.gameDesignId.length, gap.proposedType).toBeGreaterThan(0);
      expect(gap.occurrences, gap.proposedType).toBeGreaterThan(0);
    }
  });

  it("`format` est une valeur que `formatBonusValue` sait rendre", () => {
    for (const bonus of allBonuses) {
      expect(["percent", "integer", "flat", "absolute"]).toContain(bonus.format);
      expect(() => formatBonusValue(bonus.format, 1)).not.toThrow();
    }
  });

  // Arbitrage tranché : une SORTIE de production n'est pas un boost. Les deux
  // familles doivent rester séparées, clé ET format.
  it("les 5 familles `*_output` sont adoptées, au format `absolute`", () => {
    // `research_points_output` est la 5ᵉ, adoptée avec le domaine Heritage Vault.
    // Elle sortait déjà de CE domaine (17 occurrences) et y était proposée ;
    // l'arbitrage l'a fait entrer au dictionnaire partagé, donc elle n'est plus
    // un écart ici non plus. Les 4 autres et leur format sont inchangés.
    const outputs = [
      "coins_output",
      "food_output",
      "goods_output",
      "allied_currency_output",
      "research_points_output",
    ];
    for (const type of outputs) {
      expect(BONUS_LABELS[type], `${type} absent de BONUS_LABELS`).toBeDefined();
      expect(proposed.has(type), `${type} ne doit plus être un écart`).toBe(false);
    }
    const produced = allBonuses.filter((b) => outputs.includes(b.type));
    expect(produced.length).toBeGreaterThan(0);
    for (const bonus of produced) {
      expect(bonus.format, `${bonus.type}`).toBe("absolute");
    }
    // Et réciproquement : `absolute` est réservé aux familles `*_output`. Une
    // famille non listée ici est une PROPOSITION — elle doit passer par
    // `bonusGaps` avant d'entrer au dictionnaire, jamais s'y glisser en silence.
    for (const bonus of allBonuses.filter((b) => b.format === "absolute")) {
      if (outputs.includes(bonus.type)) continue;
      expect(bonus.type, `${bonus.type} porte absolute`).toMatch(/_output$/);
      expect(proposed.has(bonus.type), `${bonus.type} doit être un écart déclaré`).toBe(true);
      expect(BONUS_LABELS[bonus.type], `${bonus.type} adopté sans validation`).toBeUndefined();
    }
  });

  // La clé ne nomme aucun type de bâtiment — une clé par type ferait un
  // dictionnaire à rallonge. Le discriminant vit donc dans `scope`, et c'est la
  // seule chose qui sépare ces bonus les uns des autres : les 2 runestones sont
  // toutes deux en `City_Vikings`, un scope de cité y serait identique donc muet.
  //
  // ⚠️ La 3e occurrence, `workshop`, N'EST PAS écrite `buildingType` par le game
  // design : la Hutte de Baba Yaga déclare `resourceType: "resource.good"` sur
  // la capitale, et l'extraction la range ici parce que la loca traduit
  // `Base.BuildingTypes.Good` par « Workshops ». C'est ce qui lui donne la même
  // clé — donc le même libellé, la même icône et le même cumul — qu'au bâtiment
  // d'héritage Halloween. Voir `projectResourceBoost()` dans
  // scripts/extract/buildings.ts.
  it("`building_type_production` porte le TYPE dans `scope`, pas la cité", () => {
    const typed = allBonuses.filter((b) => b.type === "building_type_production");
    expect(typed).toHaveLength(3);
    expect(typed.map((b) => b.scope).sort((a, z) => String(a?.value).localeCompare(String(z?.value)))).toEqual([
      { kind: "buildingType", value: "beehive" },
      { kind: "buildingType", value: "home" },
      { kind: "buildingType", value: "workshop" },
    ]);
    // La clé reste générique, et la ressource nulle : le game design ne nomme
    // aucune ressource sur ces composants.
    for (const bonus of typed) {
      expect(bonus.resource, bonus.componentId ?? "").toBeNull();
      expect(bonus.format).toBe("percent");
    }
    expect(Object.keys(BONUS_LABELS).filter((k) => /^(home|beehive|workshop)_production$/.test(k))).toEqual([]);
  });

  // 03-batiments.md §3.1 : deux stats de critique distinctes dans le jeu.
  it("`ranged_critical_hit_damage` est adopté sans toucher à `ranged_critical_hit_boost`", () => {
    expect(BONUS_LABELS.ranged_critical_hit_damage).toBeDefined();
    expect(BONUS_LABELS.ranged_critical_hit_boost).toBe("Ranged Crit Boost");
    expect(proposed.has("ranged_critical_hit_damage")).toBe(false);
  });

  // 03-batiments.md §1.2 : le niveau runtime des `evolving` et le rang dans la
  // chaîne d'upgrade sont deux notions distinctes, à ne jamais fusionner.
  it("les courbes de niveau ont la longueur du `maxLevel` de leur chaîne", () => {
    for (const building of BUILDING_EXTRACT.buildings) {
      const expected = building.levelUp?.maxLevel ?? 1;
      for (const level of building.levels) {
        for (const bonus of level.bonuses) {
          if (bonus.curve === null) continue;
          expect(bonus.curve.resolved.length, `${building.chainKey} ${bonus.type}`).toBe(expected);
          expect(bonus.curve.effective.length, `${building.chainKey} ${bonus.type}`).toBe(expected);
        }
      }
    }
  });

  it("les 44 `evolving` plafonnent à 60 (§1.3)", () => {
    const evolving = BUILDING_EXTRACT.buildings.filter((b) => b.buildingType === "evolving");
    expect(evolving.length).toBe(44);
    for (const building of evolving) {
      expect(building.levelUp?.maxLevel, building.chainKey).toBe(60);
      expect(building.levels.length, building.chainKey).toBe(1);
    }
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Coûts écrits en formule (`dynamicAmount` → `DynamicLuaLongDefinitionDTO`).
//
// 19 lignes de coût de CONSTRUCTION, sur 11 chaînes `City_Capital`, n'ont pas
// de montant littéral dans le game design. Elles étaient jusqu'ici perdues
// (« Coût sans montant lisible ») ; `resolvers/lua-formula.ts` les résout
// désormais, avec `entityLevel` = le `level` déclaré de la définition
// (convention calibrée, cf. `CostContext` dans scripts/extract/buildings.ts).
//
// ⚠️ Les 12 autres références `dynamic_lua_long` de coût du domaine sont les
// barèmes de montée des `evolving` (`Dac_Building_DynamicAge_*_LevelUpCosts`,
// 4 chaînes × 3 champs) : progression RUNTIME, hors `levels` de l'app.
// ─────────────────────────────────────────────────────────────────────────────

/** Les 19 montants résolus, figés. Clé : `${clé de registre}|${niveau}|${ressource}`. */
const COUTS_EN_FORMULE: Record<string, number> = {
  "capital_small_home|40|coins": 4_000_000,
  "capital_small_home|40|food": 8_800_000,
  "capital_average_home|40|coins": 12_000_000,
  "capital_average_home|40|food": 26_000_000,
  "capital_rural_farm|40|coins": 30_000_000,
  "capital_rural_farm|40|food": 12_000_000,
  "capital_domestic_farm|40|coins": 41_000_000,
  "capital_domestic_farm|40|food": 18_000_000,
  "capital_little_culture_site|14|coins": 4_200_000,
  "capital_little_culture_site|14|food": 2_400_000,
  "capital_compact_culture_site|14|coins": 6_900_000,
  "capital_compact_culture_site|14|food": 4_000_000,
  "capital_moderate_culture_site|14|coins": 14_300_000,
  "capital_moderate_culture_site|14|food": 8_400_000,
  "capital_large_culture_site|14|coins": 48_000_000,
  "capital_large_culture_site|14|food": 31_000_000,
  "capital_luxurious_home|42|gems": 1_400,
  "capital_luxurious_farm|42|gems": 1_690,
  "capital_luxurious_culture_site|14|gems": 2_010,
};

/**
 * Ce que la saisie à la main porte sur ces mêmes 19 montants, et pourquoi elle
 * en diverge. Les 19 sont arbitrés : l'extraction fait foi partout.
 *
 *  - `identique`   : la main et la formule donnent le même montant.
 *  - `copie`       : la main recopie le montant du niveau de construction
 *                    PRÉCÉDENT — un bouche-trou, pas une valeur relevée.
 *  - `corrigé`     : la main vaut exactement la formule évaluée en
 *                    `entityLevel - 1`, soit un niveau trop bas. Les 4 montants
 *                    concernés ont été relevés en jeu et confirment la formule.
 */
const COMPARAISON_MAIN: Record<string, "identique" | "copie" | "corrigé"> = {
  "capital_small_home|40|coins": "corrigé",
  "capital_small_home|40|food": "corrigé",
  "capital_average_home|40|coins": "corrigé",
  "capital_average_home|40|food": "corrigé",
  "capital_rural_farm|40|coins": "copie",
  "capital_rural_farm|40|food": "copie",
  "capital_domestic_farm|40|coins": "identique",
  "capital_domestic_farm|40|food": "identique",
  "capital_little_culture_site|14|coins": "copie",
  "capital_little_culture_site|14|food": "copie",
  "capital_compact_culture_site|14|coins": "copie",
  "capital_compact_culture_site|14|food": "copie",
  "capital_moderate_culture_site|14|coins": "copie",
  "capital_moderate_culture_site|14|food": "copie",
  "capital_large_culture_site|14|coins": "copie",
  "capital_large_culture_site|14|food": "copie",
  "capital_luxurious_home|42|gems": "identique",
  "capital_luxurious_farm|42|gems": "identique",
  "capital_luxurious_culture_site|14|gems": "identique",
};

type CleFormule = keyof typeof COUTS_EN_FORMULE;

type RessourceEnFormule = "coins" | "food" | "gems";

/** Le niveau porteur d'une formule est le DERNIER de sa chaîne dans les 11 cas. */
function niveauPorteur(cle: string) {
  const entry = BUILDING_RAW_DATA.find((e) => e.key === cle);
  return entry?.levels[entry.levels.length - 1];
}

describe("bâtiments — coûts en formule Lua", () => {
  it("les 19 lignes de coût en formule sont résolues", () => {
    const obtenu: Record<string, number> = {};
    for (const cle of Object.keys(COUTS_EN_FORMULE) as CleFormule[]) {
      const [registryKey, , resource] = cle.split("|");
      const niveau = niveauPorteur(registryKey);
      const montant = niveau?.construction?.[resource as RessourceEnFormule];
      if (montant !== undefined) obtenu[cle] = montant;
    }
    expect(obtenu).toEqual(COUTS_EN_FORMULE);
  });

  it("le niveau porteur est bien celui attendu", () => {
    for (const cle of Object.keys(COUTS_EN_FORMULE) as CleFormule[]) {
      const [registryKey, niveau] = cle.split("|");
      expect(niveauPorteur(registryKey)?.level, registryKey).toBe(Number(niveau));
    }
  });

  it("aucune formule de coût ne reste non résolue", () => {
    const restants: string[] = [];
    for (const building of BUILDING_EXTRACT.buildings) {
      for (const level of building.levels) {
        for (const warning of level.warnings) {
          if (/Coût (en formule non résolu|sans montant lisible)/.test(warning)) {
            restants.push(`${building.chainKey} — ${warning}`);
          }
        }
      }
    }
    expect(restants).toEqual([]);
  });

  // Le registre prend désormais les 19 montants à l'extraction. Ce test fige
  // l'état de la donnée à la main, qui n'a pas été réécrite — voir
  // `COMPARAISON_MAIN` pour la classe de chaque écart.
  it("la comparaison à la saisie à la main est celle constatée", () => {
    const constate: Record<string, string> = {};
    for (const cle of Object.keys(COUTS_EN_FORMULE) as CleFormule[]) {
      const [registryKey, niveau, resource] = cle.split("|");
      const cible = Number(niveau);
      const main = HAND_ELEMENT_DATA[registryKey].levels;
      const res = resource as RessourceEnFormule;
      const montantMain = main.find((l) => l.level === cible)?.construction?.[res];
      const precedent = main.filter((l) => l.construction && l.level < cible).pop()?.construction?.[res];

      constate[cle] =
        montantMain === COUTS_EN_FORMULE[cle]
          ? "identique"
          : montantMain === precedent
            ? "copie"
            : "corrigé";
    }
    expect(constate).toEqual(COMPARAISON_MAIN);
  });

  // Les 4 montants corrigés ne sont pas des valeurs quelconques : ce sont
  // EXACTEMENT les formules évaluées un niveau plus bas — l'erreur de relevé
  // que la vérification en jeu a confirmée.
  it("les 4 montants corrigés valaient la formule évaluée en `entityLevel - 1`", () => {
    const attendu: Record<string, number> = {
      "capital_small_home|40|coins": 3_900_000,
      "capital_small_home|40|food": 8_580_000,
      "capital_average_home|40|coins": 11_700_000,
      "capital_average_home|40|food": 25_350_000,
    };
    const obtenu: Record<string, number> = {};
    for (const [cle, classe] of Object.entries(COMPARAISON_MAIN)) {
      if (classe !== "corrigé") continue;
      const [registryKey, niveau, resource] = cle.split("|");
      const montant = HAND_ELEMENT_DATA[registryKey].levels.find(
        (l) => l.level === Number(niveau),
      )?.construction?.[resource as RessourceEnFormule];
      if (montant !== undefined) obtenu[cle] = montant;
    }
    expect(obtenu).toEqual(attendu);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Biens de construction écrits dans `start.costs[]` (`GoodCostDTO`).
//
// Champ FRÈRE de `start.resourceChanges[]`. Quatre définitions y rangent leurs
// 3 biens au lieu de les écrire en `DYN|<Age>_GoodN` comme le reste du domaine :
// 12 `GoodCostDTO` littéraux, seule occurrence de ce type sur un `start` de
// bâtiment. Le bien n'y est pas nommé mais désigné par `number` (rang) et
// `offset` (décalage d'âge relatif à la définition porteuse, `-1` sur les 12).
//
// ⚠️ Les 12 autres `GoodCostDTO` du game design sont de la variante DYNAMIQUE
// (`dynamicAmountId` / `dynamicOffsetId`) et vivent tous dans les
// `Dac_Building_DynamicAge_*_LevelUpCosts` — barèmes de montée runtime des
// `evolving`, jamais dans un `start`. Hors périmètre, et hors de ce test.
// ─────────────────────────────────────────────────────────────────────────────

/** Les 12 biens résolus, figés. Le rang et l'ère sortent de `offset` + `number`. */
const BIENS_DE_CONSTRUCTION: Record<string, Good[]> = {
  "capital_small_home|40": [
    { resource: "primary_eg", amount: 2_500 },
    { resource: "secondary_eg", amount: 2_500 },
    { resource: "tertiary_eg", amount: 2_500 },
  ],
  "capital_average_home|40": [
    { resource: "primary_eg", amount: 5_000 },
    { resource: "secondary_eg", amount: 5_000 },
    { resource: "tertiary_eg", amount: 5_000 },
  ],
  "capital_rural_farm|40": [
    { resource: "primary_eg", amount: 6_000 },
    { resource: "secondary_eg", amount: 6_000 },
    { resource: "tertiary_eg", amount: 6_000 },
  ],
  "capital_domestic_farm|40": [
    { resource: "primary_eg", amount: 8_000 },
    { resource: "secondary_eg", amount: 8_000 },
    { resource: "tertiary_eg", amount: 8_000 },
  ],
};

/** `[{ resource, amount }]` → `["primary_eg:2500", …]`, insensible à l'ordre des clés. */
function couples(goods: Good[] | undefined): string[] {
  return (goods ?? []).map((g) => `${g.resource}:${g.amount}`);
}

function biensExtraits(cle: string): Good[] | undefined {
  const [registryKey, niveau] = cle.split("|");
  const entry = BUILDING_RAW_DATA.find((e) => e.key === registryKey);
  return entry?.levels.find((l) => l.level === Number(niveau))?.construction?.goods;
}

describe("bâtiments — biens de construction en `costs[]`", () => {
  it("les 12 biens sont résolus, rang et ère compris", () => {
    const obtenu = Object.fromEntries(
      Object.keys(BIENS_DE_CONSTRUCTION).map((cle) => [cle, couples(biensExtraits(cle))]),
    );
    const attendu = Object.fromEntries(
      Object.entries(BIENS_DE_CONSTRUCTION).map(([cle, goods]) => [cle, couples(goods)]),
    );
    expect(obtenu).toEqual(attendu);
  });

  // Non-régression de la bascule : la main portait déjà ces 12 montants, à
  // l'identique. C'est la provenance qui change, pas la valeur.
  it("les 12 biens sont identiques à la saisie à la main", () => {
    const divergences: string[] = [];
    for (const cle of Object.keys(BIENS_DE_CONSTRUCTION)) {
      const [registryKey, niveau] = cle.split("|");
      const main = HAND_ELEMENT_DATA[registryKey].levels.find(
        (l) => l.level === Number(niveau),
      )?.construction?.goods;
      if (couples(main).join("|") !== couples(BIENS_DE_CONSTRUCTION[cle]).join("|")) {
        divergences.push(`${cle}: ${JSON.stringify(main)}`);
      }
    }
    expect(divergences).toEqual([]);
  });

  it("aucune autre chaîne ne porte de bien issu de `costs[]`", () => {
    const attendus = new Set(Object.keys(BIENS_DE_CONSTRUCTION));
    const porteurs: string[] = [];
    for (const building of BUILDING_EXTRACT.buildings) {
      for (const level of building.levels) {
        if (!level.gameDesignId.startsWith("Building_DynamicAge_")) continue;
        if ((level.construction ?? []).some((l) => l.definitionId.startsWith("DYN|"))) {
          porteurs.push(`${building.registryKey}|${level.level}`);
        }
      }
    }
    expect(new Set(porteurs)).toEqual(attendus);
  });

  it("aucun coût de `costs[]` n'est laissé non traité", () => {
    const restants: string[] = [];
    for (const building of BUILDING_EXTRACT.buildings) {
      for (const level of building.levels) {
        for (const warning of level.warnings) {
          if (/Coût (de `costs\[\]` non traité|en bien )/.test(warning)) {
            restants.push(`${building.chainKey} — ${warning}`);
          }
        }
      }
    }
    expect(restants).toEqual([]);
  });
  // ─── Ressources à jauge ────────────────────────────────────────────────────

  it("extrait les 3 ressources à jauge, avec leur régénération NUE", () => {
    // ⚠️ Ces chiffres sont de la DONNÉE DE JEU, pas un choix : le plafond et la
    // cadence qu'une ressource a sans aucun bâtiment. Ils n'existaient nulle
    // part dans le projet, et sans eux un pourcentage ne se traduit pas en
    // temps — « +83 % de régénération » ne devient « 15 min par boussole » que
    // si l'on sait que la base est de 90 min.
    expect(BUILDING_EXTRACT.regeneratingResources).toEqual([
      { id: "attack_attempt", baseMax: 5, basePeriodSeconds: 7200, amountPerUnit: 1 },
      { id: "research_points", baseMax: 10, basePeriodSeconds: 3600, amountPerUnit: 1 },
      { id: "treasure_hunt_attempt", baseMax: 4, basePeriodSeconds: 5400, amountPerUnit: 1 },
    ]);
  });

  it("n'aspire PAS les jauges du hub commercial", () => {
    // Elles portent un `TradingHubRegeneratingTraitDTO` : même famille de nom,
    // pas de plafond, tout autre mécanisme. 22 entrées sans `baseMax` noieraient
    // les 3 qui répondent vraiment à la question.
    const ids = BUILDING_EXTRACT.regeneratingResources.map((r) => r.id);
    expect(ids.filter((id) => id.startsWith("trading_"))).toEqual([]);
    for (const resource of BUILDING_EXTRACT.regeneratingResources) {
      expect(resource.baseMax, resource.id).toBeGreaterThan(0);
      expect(resource.basePeriodSeconds, resource.id).toBeGreaterThan(0);
    }
  });

  it("étiquette les boosts de régénération par leur RESSOURCE, pas par défaut", () => {
    // ⚠️ RÉGRESSION FERMÉE. `RegenerationTraitBoostDTO` porte un
    // `resourceDefinitionId` que la projection ignorait : les deux boosts du
    // Treasure Wreck — le plafond de BOUSSOLES et leur vitesse de recharge —
    // ressortaient en « Research Point Cap » et « RP Regeneration Speed », deux stats
    // qu'il ne touche pas.
    //
    // L'enjeu dépassait le libellé : le bâtiment d'héritage ATH porte les deux
    // mêmes boosts, et SON extracteur lisait la ressource. Les deux moitiés d'un
    // même bonus arrivaient sous deux clés différentes, donc ne pouvaient pas
    // se cumuler.
    const wreck = BUILDING_EXTRACT.buildings.find(
      (building) => building.chainKey === "City_Capital|evolvingTreasureWreck",
    );
    expect(wreck).toBeDefined();
    const bonuses = wreck!.levels[0].bonuses.filter((bonus) =>
      bonus.type.startsWith("regeneration_"),
    );
    expect(bonuses.map((bonus) => bonus.type).sort()).toEqual([
      "regeneration_cap",
      "regeneration_speed",
    ]);
    for (const bonus of bonuses) {
      expect(bonus.resource, bonus.type).toBe("treasure_hunt_attempt");
    }
    // Et la ressource ainsi nommée est bien l'une des 3 extraites ci-dessus :
    // c'est ce chaînage qui permettra de rendre un TEMPS de recharge.
    const known = BUILDING_EXTRACT.regeneratingResources.map((r) => r.id);
    expect(known).toContain("treasure_hunt_attempt");
  });

  it("aucun bâtiment ne porte plus les deux clés Wonders `research_*`", () => {
    // Elles restent réservées aux merveilles, qui régénèrent bien des POINTS DE
    // RECHERCHE. Le Treasure Wreck était le seul bâtiment à les porter, et à tort.
    const porteurs: string[] = [];
    for (const building of BUILDING_EXTRACT.buildings) {
      for (const level of building.levels) {
        for (const bonus of level.bonuses) {
          if (bonus.type === "research_point_cap" || bonus.type === "research_regen_boost") {
            porteurs.push(`${building.chainKey} — ${bonus.type}`);
          }
        }
      }
    }
    expect(porteurs).toEqual([]);
  });
});
