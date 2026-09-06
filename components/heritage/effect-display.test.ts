import { describe, expect, it } from "vitest";

import {
  resolveChestRewards,
  resolveHeritageVault,
  type ResolvedChestReward,
} from "@/resolvers/heritage";
import { chestRewardQuantity, describeChestEffect } from "./effect-display";

/** Une branche minimale de tirage, pour construire un arbre synthétique. */
function leaf(overrides: Partial<ResolvedChestReward>): ResolvedChestReward {
  return {
    kind: "inventoryItem",
    id: null,
    definitionId: null,
    label: "",
    amount: null,
    chance: null,
    chancePercent: null,
    conditional: false,
    resources: [],
    children: [],
    ...overrides,
  };
}

// ============================================================
// Le ticket de recharge de caserne du vault Celtic (`Heritage_Celtic_Effect_2`,
// palier 7) : un coffre qui tire au sort le TYPE de troupe (5 branches à 20 %
// chacune), mais dont la QUANTITÉ versée est la même sur toutes les
// branches à un niveau donné — 1 au palier, 2 à partir du niveau 22, 3 à
// partir du niveau 42 (vérifié en jeu par capture). C'est cette quantité que
// `chestRewardQuantity`/`describeChestEffect` doivent remonter, jamais le
// nombre de tickets ouverts (toujours 1) ni une moyenne pondérée sur les
// types de troupe (qui n'ont aucun sens à moyenner entre eux).
// ============================================================

function barracksTicketEffect(vaultLevel: number) {
  const vault = resolveHeritageVault("heritage_celtic", vaultLevel, "LG")!;
  const effect = vault.effects.find((candidate) => candidate.minLevel === 7)!;
  if (effect.bonuses.length !== 0) {
    throw new Error("Fixture absente : Celtic palier 7 attendu sans bonus nommable");
  }
  return effect;
}

describe("`chestRewardQuantity`", () => {
  it("s'accorde sur la quantité commune à toutes les branches, quel que soit le niveau", () => {
    for (const [level, expected] of [
      [7, 1],
      [21, 1],
      [22, 2],
      [41, 2],
      [42, 3],
      [60, 3],
    ] as const) {
      const effect = barracksTicketEffect(level);
      const [reward] = resolveChestRewards(effect.rewards, level, "LG");
      expect(chestRewardQuantity(reward), `niveau ${level}`).toBe(expected);
    }
  });

  it("rend `null` — jamais une moyenne — quand les branches diffèrent réellement", () => {
    const heterogeneous = leaf({
      kind: "group",
      children: [
        leaf({ chance: 50, chancePercent: 50, amount: 2 }),
        leaf({ chance: 50, chancePercent: 50, amount: 5 }),
      ],
    });
    expect(chestRewardQuantity(heterogeneous)).toBeNull();
  });
});

describe("`describeChestEffect`", () => {
  it("affiche la quantité versée par le ticket, pas le nombre de tickets ouverts", () => {
    const vault7 = resolveHeritageVault("heritage_celtic", 7, "LG")!;
    const effect7 = vault7.effects.find((candidate) => candidate.minLevel === 7)!;
    const display7 = describeChestEffect(effect7, 7, "LG", [])!;
    expect(display7.label).toBe("Barracks refill ticket");
    expect(display7.value).toBe("1");

    const vault22 = resolveHeritageVault("heritage_celtic", 22, "LG")!;
    const effect22 = vault22.effects.find((candidate) => candidate.minLevel === 7)!;
    expect(describeChestEffect(effect22, 22, "LG", [])!.value).toBe("2");
  });
});
