import { describe, expect, it } from "vitest";

import {
  KEEPER_AMPLIFIER_EXEMPT_TYPES,
  HERITAGE_KEEPER_MAX_REPUTATION_LEVEL,
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
      `${kept.label} (lvl ${kept.minLevel})`,
    ]);

    const lastRow = matrix.rows[matrix.rows.length - 1];
    expect(lines[lines.length - 1].split("\t")[3]).toBe(lastRow.values[1]);
  });

  it("échappe les guillemets en CSV", () => {
    const matrix = buildProgressionMatrix({ ...BASE, axis: "vault", pinnedLevel: 1 })!;
    const csv = toDelimitedText(matrix, new Set(), "csv");
    expect(csv.split("\n")[0]).toBe('"Vault level","Keeper level","Amplifier"');
  });
});
