import { describe, expect, it } from "vitest";

import {
  KEEPER_OFFER_CATALOG,
  KEEPER_OFFER_FORMULA_IDS,
  KEEPER_SLOTS,
  cumulativeKeeperOfferCost,
  eraForRank,
  keeperExchangeForecast,
  keeperOfferCost,
  keeperOfferSlot,
  keeperOffersForSlot,
  previousEra,
  weeklyKeeperExchangePlan,
} from "./heritage-keeper-offers";

describe("KEEPER_OFFER_CATALOG", () => {
  it("couvre les 29 courbes extraites plus `Orb`, sans doublon", () => {
    expect(KEEPER_OFFER_CATALOG.length).toBe(30);
    const ids = KEEPER_OFFER_CATALOG.map((offer) => offer.id);
    expect(new Set(ids).size).toBe(30);
    // `Orb` est la seule entrée sans courbe : son prix est fixe (voir
    // l'en-tête du module), toutes les autres doivent avoir été extraites.
    for (const offer of KEEPER_OFFER_CATALOG) {
      if (offer.fixedCost !== undefined) continue;
      expect(KEEPER_OFFER_FORMULA_IDS.has(offer.id)).toBe(true);
    }
    expect(KEEPER_OFFER_CATALOG.filter((offer) => offer.fixedCost !== undefined)).toHaveLength(1);
  });

  it("répartit les offres en 5 catégories : capital, goods, allied, blueprint, inventory", () => {
    const countOf = (category: string) =>
      KEEPER_OFFER_CATALOG.filter((offer) => offer.category === category).length;
    expect(countOf("capital")).toBe(5);
    expect(countOf("goods")).toBe(6);
    expect(countOf("allied")).toBe(3);
    expect(countOf("blueprint")).toBe(3);
    expect(countOf("inventory")).toBe(13);
  });

  // Recoupement contre le montant au premier achat (`keeperPurchaseCount = 0`)
  // des courbes extraites — voir l'en-tête du module. Une coïncidence sur
  // autant de valeurs indépendantes, entre deux sources qui ne se citent pas,
  // vaudrait comme confirmation.
  it("porte une réputation fixe cohérente avec le montant extrait au premier achat", () => {
    expect(keeperOfferCost("RP", 0, "CG")).toBe(20);
    expect(KEEPER_OFFER_CATALOG.find((o) => o.id === "RP")?.reputation).toBe(1);

    expect(keeperOfferCost("Negotiation_Wildcard", 0, "CG")).toBe(3);
    expect(KEEPER_OFFER_CATALOG.find((o) => o.id === "Negotiation_Wildcard")?.reputation).toBe(1);

    expect(keeperOfferCost("WonderBP_Rare", 0, "CG")).toBe(1);
    expect(KEEPER_OFFER_CATALOG.find((o) => o.id === "WonderBP_Rare")?.reputation).toBe(4);

    expect(keeperOfferCost("WonderBP_Legendary", 0, "CG")).toBe(1);
    expect(KEEPER_OFFER_CATALOG.find((o) => o.id === "WonderBP_Legendary")?.reputation).toBe(5);

    expect(keeperOfferCost("RefillBarracks_All", 0, "CG")).toBe(1);
    expect(KEEPER_OFFER_CATALOG.find((o) => o.id === "RefillBarracks_All")?.reputation).toBe(2);
  });

  it("inclut CEGood*/PEGood* malgré leur direction `receive` dans l'extraction", () => {
    const ids = KEEPER_OFFER_CATALOG.map((offer) => offer.id);
    expect(ids).toEqual(
      expect.arrayContaining(["CEGood1", "CEGood2", "CEGood3", "PEGood1", "PEGood2", "PEGood3"]),
    );
    // Coût positif malgré une formule SANS signe négatif dans le game design.
    expect(keeperOfferCost("CEGood1", 0, "CG")).toBe(2400);
  });

  it("porte un rang pour les biens `CEGood*`/`PEGood*`, pas pour les Exotic Goods", () => {
    const ceGood1 = KEEPER_OFFER_CATALOG.find((o) => o.id === "CEGood1");
    expect(ceGood1?.rank).toEqual({ priority: "primary", eraOffset: 0 });
    const peGood2 = KEEPER_OFFER_CATALOG.find((o) => o.id === "PEGood2");
    expect(peGood2?.rank).toEqual({ priority: "secondary", eraOffset: -1 });

    const exotic = KEEPER_OFFER_CATALOG.find((o) => o.id === "ExoticGood_2");
    expect(exotic?.rank).toBeUndefined();
    expect(exotic?.goodCandidates?.length).toBeGreaterThan(0);
  });
});

describe("emplacements du gardien (`offerGroup`)", () => {
  // Le thème par case, vérifié sur les 25 vaults des instantanés de compte —
  // voir l'en-tête du module. Ce test fige la conséquence côté UI : ouvrir le
  // sélecteur depuis la case N ne doit jamais proposer l'offre d'une autre.
  it("range chaque offre du catalogue dans une case, et une seule", () => {
    const bySlot = KEEPER_SLOTS.map((slot) => keeperOffersForSlot(slot));
    expect(bySlot.reduce((sum, offers) => sum + offers.length, 0)).toBe(
      KEEPER_OFFER_CATALOG.length,
    );
    const ids = bySlot.flat().map((offer) => offer.id);
    expect(new Set(ids).size).toBe(KEEPER_OFFER_CATALOG.length);
  });

  it("suit le thème observé en jeu : capital / alliés / plans+orbes / objets", () => {
    expect(keeperOfferSlot("Coins_S")).toBe(1);
    expect(keeperOfferSlot("RP")).toBe(1);
    expect(keeperOfferSlot("CEGood1")).toBe(1);
    expect(keeperOfferSlot("PEGood3")).toBe(1);
    expect(keeperOfferSlot("ExoticGood_2")).toBe(2);
    expect(keeperOfferSlot("WonderBP_Rare")).toBe(3);
    expect(keeperOfferSlot("WonderBP_Legendary")).toBe(3);
    expect(keeperOfferSlot("Orb")).toBe(3);
    expect(keeperOfferSlot("AgeUpKit")).toBe(4);
    expect(keeperOfferSlot("RefillBarracks_All")).toBe(4);
  });

  it("rend null pour un identifiant inconnu", () => {
    expect(keeperOfferSlot("Offre_Inexistante")).toBeNull();
  });
});

describe("Orb — la seule offre à prix fixe", () => {
  // `KeeperOffer_WonderOrb_3` porte `amount: "-1"` en dur dans les instantanés
  // de compte, sans `dynamicAmount` : le prix ne bouge ni avec l'ère ni avec
  // le nombre d'achats déjà faits cette semaine.
  it("coûte 1 orbe, quels que soient l'ère et le compteur d'achats", () => {
    expect(keeperOfferCost("Orb", 0, "CG")).toBe(1);
    expect(keeperOfferCost("Orb", 12, "CG")).toBe(1);
    expect(keeperOfferCost("Orb", 0, "SA")).toBe(1);
  });

  it("se cumule linéairement, contrairement à toutes les autres", () => {
    expect(cumulativeKeeperOfferCost("Orb", "CG", 5)).toBe(5);
  });

  it("rapporte 3 réputation — la valeur du wiki", () => {
    expect(KEEPER_OFFER_CATALOG.find((offer) => offer.id === "Orb")?.reputation).toBe(3);
  });
});

describe("previousEra / eraForRank", () => {
  it("rend l'ère juste avant, dans l'ordre du jeu", () => {
    expect(previousEra("CG")).toBe("ME");
    expect(previousEra("LG")).toBe("EG");
  });

  it("rend null en tête de liste — aucune ère avant StoneAge", () => {
    expect(previousEra("SA")).toBeNull();
  });

  it("eraForRank suit l'offset : 0 garde l'ère, -1 recule d'un cran", () => {
    expect(eraForRank("CG", { priority: "primary", eraOffset: 0 })).toBe("CG");
    expect(eraForRank("CG", { priority: "primary", eraOffset: -1 })).toBe("ME");
  });
});

describe("keeperOfferCost", () => {
  it("rend une valeur positive — ce que le joueur cède", () => {
    expect(keeperOfferCost("RP", 0, "CG")).toBe(20);
    expect(keeperOfferCost("ExoticGood_2", 1, "CG")).toBe(268);
  });

  it("rend null pour une offre ou une ère inconnue", () => {
    expect(keeperOfferCost("Offre_Inexistante", 0, "CG")).toBeNull();
  });
});

describe("cumulativeKeeperOfferCost", () => {
  it("cumule les coûts de 0 à `count - 1`", () => {
    // floor(20), floor(20×1.05)=21 → 20+21 = 41 pour 2 échanges.
    expect(cumulativeKeeperOfferCost("RP", "CG", 2)).toBe(41);
  });

  it("rend 0 pour un compte nul ou négatif, jamais une erreur", () => {
    expect(cumulativeKeeperOfferCost("RP", "CG", 0)).toBe(0);
    expect(cumulativeKeeperOfferCost("RP", "CG", -3)).toBe(0);
  });

  it("rend null pour une offre inconnue", () => {
    expect(cumulativeKeeperOfferCost("Offre_Inexistante", "CG", 3)).toBeNull();
  });
});

describe("weeklyKeeperExchangePlan", () => {
  // Référence : l'exemple donné par la communauté (emporium, 31/08/2026) —
  // le premier échange de PR coûte 20, le taux est de 5 %, et 300 PR/jour
  // donne environ 36-37 échanges en une semaine. `RP` ne dépend pas de l'ère
  // (`scalesWithPlayerAge: false`), donc l'ère choisie ici est indifférente.
  it("suit l'exemple de référence de la communauté : 300 PR/jour sur une semaine", () => {
    const plan = weeklyKeeperExchangePlan("RP", "CG", 300 * 7);
    expect(plan).not.toBeNull();
    // La formule est `math.floor(-20 × 1.05^n)` : côté négatif, `floor` arrondit
    // vers -∞, donc le coût cédé (positif) est en réalité `ceil(20 × 1.05^n)`,
    // pas `floor` — un piège à ne pas reproduire ailleurs. Somme des coûts de
    // n=0 à 36 = 2 052 ; le 38e achat (n=37) coûterait 122 et dépasserait les
    // 2 100 du budget.
    expect(plan).toEqual({
      offerId: "RP",
      count: 37,
      totalSpent: 2052,
      nextCost: 122,
      remaining: 48,
    });
  });

  it("rend 0 échange, pas une erreur, quand le budget ne couvre pas le premier achat", () => {
    const plan = weeklyKeeperExchangePlan("RP", "CG", 15);
    expect(plan).toEqual({
      offerId: "RP",
      count: 0,
      totalSpent: 0,
      nextCost: 20,
      remaining: 15,
    });
  });

  it("rend null pour une offre inconnue plutôt qu'un plan à 0 échange silencieux", () => {
    expect(weeklyKeeperExchangePlan("Offre_Inexistante", "CG", 1000)).toBeNull();
  });

  it("ignore un budget négatif — jamais un plan qui dépenserait plus que 0", () => {
    const plan = weeklyKeeperExchangePlan("RP", "CG", -50);
    expect(plan?.count).toBe(0);
    expect(plan?.remaining).toBe(0);
  });

  it("suit l'ère quand l'offre en dépend (`scalesWithPlayerAge`)", () => {
    // Coins_S : floor(-15000 × playerAgeOrder² × 1.08^count). Un budget qui
    // couvre le premier achat en StoneAge (60 000) ne suffit plus en Late
    // Gothic (3 375 000) : le nombre d'échanges chute à 0, pas d'erreur.
    const stoneAge = weeklyKeeperExchangePlan("Coins_S", "SA", 60_000);
    const lateGothic = weeklyKeeperExchangePlan("Coins_S", "LG", 60_000);
    expect(stoneAge?.count).toBe(1);
    expect(lateGothic?.count).toBe(0);
  });
});

describe("keeperExchangeForecast", () => {
  // Même référence communauté que `weeklyKeeperExchangePlan` (300 PR/jour),
  // étendue sur 4 semaines : le reliquat non dépensé une semaine (`remaining`)
  // roule sur la suivante plutôt que d'être perdu, donc le budget hebdo n'est
  // pas constant (2100, 2148, 2196, 2122 — recalculé indépendamment ci-dessus).
  it("fait rouler le reliquat d'une semaine sur la suivante", () => {
    const forecast = keeperExchangeForecast("RP", "CG", 0, 300, 4);
    expect(forecast).toEqual({
      weeks: [
        { week: 1, count: 37, reputation: 37, spent: 2_052, remaining: 48 },
        { week: 2, count: 37, reputation: 37, spent: 2_052, remaining: 96 },
        { week: 3, count: 38, reputation: 38, spent: 2_174, remaining: 22 },
        { week: 4, count: 37, reputation: 37, spent: 2_052, remaining: 70 },
      ],
      totalCount: 149,
      totalReputation: 149,
      totalSpent: 8_330,
    });
  });

  it("part d'un stock existant en plus de la production", () => {
    // Un stock de départ équivaut à une première semaine plus riche : le
    // budget de la semaine 1 devient stock + 7×production, jamais la
    // production seule.
    const withStock = keeperExchangeForecast("RP", "CG", 2_100, 0, 1);
    const withoutStock = keeperExchangeForecast("RP", "CG", 0, 300, 1);
    expect(withStock?.weeks[0]).toEqual(withoutStock?.weeks[0]);
  });

  it("rend 0 semaine pour `weeks` nul ou négatif, jamais une erreur", () => {
    expect(keeperExchangeForecast("RP", "CG", 1000, 300, 0)).toEqual({
      weeks: [],
      totalCount: 0,
      totalReputation: 0,
      totalSpent: 0,
    });
    expect(keeperExchangeForecast("RP", "CG", 1000, 300, -2)?.weeks).toEqual([]);
  });

  it("rend null pour une offre inconnue", () => {
    expect(keeperExchangeForecast("Offre_Inexistante", "CG", 1000, 300, 4)).toBeNull();
  });
});
