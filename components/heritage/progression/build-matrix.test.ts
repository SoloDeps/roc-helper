import { describe, expect, it } from "vitest";

import {
  KEEPER_AMPLIFIER_EXEMPT_TYPES,
  HERITAGE_KEEPER_MAX_REPUTATION_LEVEL,
  getHeritageCumulativeXp,
  getHeritageUpgradeCost,
  getKeeperCumulativeReputation,
  getKeeperReputationCost,
  keeperAmplifierMultiplier,
  resolveHeritageVault,
} from "@/resolvers/heritage";
import { buildProgressionMatrix, toDelimitedText } from "./build-matrix";

// ============================================================
// Les invariants du tableau de progression — ceux dont la violation ferait
// mentir les chiffres, pas la mise en forme.
//
//  1. Un axe déroulé donne une ligne par niveau, l'autre reste épinglé.
//  2. Une cellule non débloquée vaut `null`, jamais « 0 ».
//  3. Le rang de gardien REJOUÉ ligne par ligne (`amplifyBonusValue`) donne le
//     même résultat qu'une résolution complète à ce rang — c'est l'optimisation
//     qui évite 99 résolutions, et la seule qui puisse diverger en silence.
//  4. Les compteurs discrets exemptés restent plats sur l'axe « gardien ».
//  5. L'export garde l'alignement valeurs/colonnes quand une colonne est masquée.
//  6. Le coût par ligne (`levelCost`/`cumulativeCost`) compte des jetons sur
//     l'axe « vault », des points de réputation sur l'axe « keeper » — jamais
//     mélangés, et toujours cohérent avec les resolvers dont il n'est qu'un
//     assemblage.
// ============================================================

const BASE = {
  vaultKey: "heritage_celtic",
  era: "LG" as const,
  maxVaultLevel: 60,
  maxKeeperLevel: HERITAGE_KEEPER_MAX_REPUTATION_LEVEL,
  selections: [] as string[][],
};

describe("`buildProgressionMatrix`", () => {
  it("déroule les 60 niveaux de vault à rang de gardien épinglé", () => {
    const matrix = buildProgressionMatrix({ ...BASE, axis: "vault", pinnedLevel: 12 })!;
    expect(matrix.rows).toHaveLength(60);
    expect(matrix.rows[0].vaultLevel).toBe(1);
    expect(matrix.rows[59].vaultLevel).toBe(60);
    expect(new Set(matrix.rows.map((row) => row.keeperLevel))).toEqual(new Set([12]));
  });

  it("déroule les rangs de gardien à niveau de vault épinglé", () => {
    const matrix = buildProgressionMatrix({ ...BASE, axis: "keeper", pinnedLevel: 30 })!;
    expect(matrix.rows).toHaveLength(HERITAGE_KEEPER_MAX_REPUTATION_LEVEL);
    expect(new Set(matrix.rows.map((row) => row.vaultLevel))).toEqual(new Set([30]));
    expect(matrix.rows[0].keeperLevel).toBe(1);
  });

  it("laisse la cellule VIDE tant que le palier n'est pas atteint — jamais « 0 »", () => {
    const matrix = buildProgressionMatrix({ ...BASE, axis: "vault", pinnedLevel: 1 })!;
    const late = matrix.columns.findIndex((column) => column.minLevel > 1);
    expect(late).toBeGreaterThanOrEqual(0);
    const column = matrix.columns[late];
    // Verrouillée avant son palier, remplie à partir de son palier.
    expect(matrix.rows[column.minLevel - 2].values[late]).toBeNull();
    expect(matrix.rows[column.minLevel - 1].values[late]).not.toBeNull();
  });

  it("rejoue l'amplificateur sans diverger d'une résolution complète au même rang", () => {
    // Le mode « keeper » ne résout le vault QU'UNE FOIS puis ré-amplifie : si
    // cette optimisation dérivait, le tableau afficherait des valeurs que le
    // reste de l'application ne produit pas.
    const matrix = buildProgressionMatrix({ ...BASE, axis: "keeper", pinnedLevel: 45 })!;
    const keeperLevel = 37;
    const row = matrix.rows.find((entry) => entry.keeperLevel === keeperLevel)!;

    const reference = buildProgressionMatrix({
      ...BASE,
      axis: "vault",
      pinnedLevel: keeperLevel,
    })!;
    const referenceRow = reference.rows.find((entry) => entry.vaultLevel === 45)!;

    expect(row.values).toEqual(referenceRow.values);
    expect(row.amplifierPercent).toBeCloseTo(keeperAmplifierMultiplier(keeperLevel) * 100, 9);
  });

  it("garde les compteurs discrets PLATS quand le rang de gardien monte", () => {
    const matrix = buildProgressionMatrix({ ...BASE, axis: "keeper", pinnedLevel: 60 })!;
    const vault = resolveHeritageVault(BASE.vaultKey, 60, BASE.era)!;
    const exemptIds = new Set(
      vault.effects
        .filter((effect) =>
          effect.bonuses.some((bonus) => KEEPER_AMPLIFIER_EXEMPT_TYPES.has(bonus.type)),
        )
        .map((effect) => effect.id),
    );
    const index = matrix.columns.findIndex(
      (column) => !column.keeperAmplified && exemptIds.has(column.effectId),
    );
    expect(index).toBeGreaterThanOrEqual(0);

    const first = matrix.rows[0].values[index];
    expect(first).not.toBeNull();
    for (const row of matrix.rows) expect(row.values[index]).toBe(first);
  });

  it("l'axe « vault » compte des jetons, cohérents avec `getHeritageUpgradeCost`/`getHeritageCumulativeXp`", () => {
    const matrix = buildProgressionMatrix({ ...BASE, axis: "vault", pinnedLevel: 12 })!;
    expect(matrix.costUnit).toBe("tokens");

    const level1 = matrix.rows[0];
    expect(level1.levelCost).toBe(0);
    expect(level1.cumulativeCost).toBe(0);

    const level5 = matrix.rows.find((row) => row.vaultLevel === 5)!;
    expect(level5.levelCost).toBe(getHeritageUpgradeCost("heritage_celtic", 4)!.xp);
    expect(level5.cumulativeCost).toBe(getHeritageCumulativeXp("heritage_celtic", 5));

    // Le cumul avance bien du montant du niveau précédent.
    for (let i = 1; i < matrix.rows.length; i += 1) {
      expect(matrix.rows[i].cumulativeCost).toBe(
        matrix.rows[i - 1].cumulativeCost + matrix.rows[i].levelCost,
      );
    }
  });

  it("l'axe « keeper » compte des points de réputation, cohérents avec `getKeeperReputationCost`/`getKeeperCumulativeReputation`", () => {
    const matrix = buildProgressionMatrix({ ...BASE, axis: "keeper", pinnedLevel: 30 })!;
    expect(matrix.costUnit).toBe("reputation");

    const rank1 = matrix.rows[0];
    expect(rank1.levelCost).toBe(0);
    expect(rank1.cumulativeCost).toBe(0);

    const rank12 = matrix.rows.find((row) => row.keeperLevel === 12)!;
    expect(rank12.levelCost).toBe(getKeeperReputationCost("heritage_celtic", 11));
    expect(rank12.cumulativeCost).toBe(getKeeperCumulativeReputation("heritage_celtic", 12));
  });

  it("tabule un palier à coffre dont toutes les branches s'accordent sur un montant — le ticket de recharge Celtic", () => {
    const matrix = buildProgressionMatrix({ ...BASE, axis: "vault", pinnedLevel: 1 })!;
    const ticket = matrix.columns.find((column) => column.minLevel === 7)!;
    expect(ticket.label).toBe("Barracks refill ticket");
    expect(ticket.keeperAmplified).toBe(false);

    const valueAt = (level: number) =>
      matrix.rows.find((row) => row.vaultLevel === level)!.values[
        matrix.columns.indexOf(ticket)
      ];
    expect(valueAt(6)).toBeNull(); // pas encore débloqué
    expect(valueAt(7)).toBe("1");
    expect(valueAt(21)).toBe("1");
    expect(valueAt(22)).toBe("2"); // la quantité grandit avec le niveau du vault
    expect(valueAt(42)).toBe("3");
  });

  it("garde une colonne pour un coffre HÉTÉROGÈNE — repli sur `1`, jamais une colonne perdue", () => {
    // Mongol, palier 21 : le tirage mélange des lots dont les montants ne
    // s'accordent pas (`chestRewardQuantity` rend `null`). Avant le fix, ça
    // faisait disparaître la colonne ENTIÈRE — le vault n'avait plus que 8/9
    // colonnes au lieu de 9/9, un bug repéré en jeu sur Mongol/Polynesian/
    // Mali/World Fair/Aztec/Halloween/Thai.
    const matrix = buildProgressionMatrix({
      ...BASE,
      vaultKey: "heritage_mongol",
      axis: "vault",
      pinnedLevel: 1,
    })!;
    const chest = matrix.columns.find((column) => column.minLevel === 21)!;
    expect(chest).toBeDefined();
    const value =
      matrix.rows.find((row) => row.vaultLevel === 21)!.values[matrix.columns.indexOf(chest)];
    // Hétérogène ⇒ repli sur le nombre de coffres ouverts, toujours 1.
    expect(value).toBe("1");
  });

  it("rend `null` sur une clé de vault inconnue", () => {
    expect(
      buildProgressionMatrix({ ...BASE, vaultKey: "nope", axis: "vault", pinnedLevel: 1 }),
    ).toBeNull();
  });
});

describe("`toDelimitedText`", () => {
  it("n'affiche que les colonnes visibles SANS décaler les valeurs", () => {
    const matrix = buildProgressionMatrix({ ...BASE, axis: "vault", pinnedLevel: 1 })!;
    // On masque la première colonne : la seconde doit rester alignée sur SES
    // valeurs, pas hériter de celles de la colonne masquée.
    const kept = matrix.columns[1];
    const text = toDelimitedText(matrix, new Set([kept.key]), "tsv");
    const lines = text.split("\n");
    expect(lines[0].split("\t")).toEqual([
      "Vault level",
      "Keeper level",
      "Amplifier",
      "Level tokens",
      "Total tokens",
      `${kept.label} (lvl ${kept.minLevel})`,
    ]);

    const lastRow = matrix.rows[matrix.rows.length - 1];
    expect(lines[lines.length - 1].split("\t")[5]).toBe(lastRow.values[1]);
  });

  it("échappe les guillemets en CSV", () => {
    const matrix = buildProgressionMatrix({ ...BASE, axis: "vault", pinnedLevel: 1 })!;
    const csv = toDelimitedText(matrix, new Set(), "csv");
    expect(csv.split("\n")[0]).toBe(
      '"Vault level","Keeper level","Amplifier","Level tokens","Total tokens"',
    );
  });

  it("omet une colonne fixe désactivée via `include` — même choix que le popover « Columns »", () => {
    const matrix = buildProgressionMatrix({ ...BASE, axis: "vault", pinnedLevel: 1 })!;
    const text = toDelimitedText(matrix, new Set(), "tsv", {
      amplifier: false,
      levelCost: false,
    });
    const header = text.split("\n")[0].split("\t");
    expect(header).toEqual(["Vault level", "Keeper level", "Total tokens"]);
    // Les valeurs suivent le même retrait — jamais de colonne fantôme.
    const firstDataRow = text.split("\n")[1].split("\t");
    expect(firstDataRow).toHaveLength(header.length);
  });
});
