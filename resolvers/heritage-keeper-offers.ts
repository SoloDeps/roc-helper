// ============================================================
// ROC Helper – Offres du Vault Keeper : combien de fois par semaine ?
//
// Répond à la question posée par la communauté (Discord, 31/08/2026) : « selon
// ma PRODUCTION hebdomadaire d'une ressource, combien de fois je peux
// l'échanger contre de la réputation avant la fin de la semaine, sachant que
// chaque échange coûte plus cher que le précédent ? »
//
// ⚠️ CE QUE CE MODULE COUVRE. Le game design porte 29 courbes de prix
// `Lua_HeritageVault_KeeperOffer_*` (`KEEPER_OFFER_FORMULAS`, dans
// `heritage.ts`), mais AUCUN catalogue ne dit quel vault propose quelle offre —
// ni combien de réputation chacune rapporte. Ce module n'essaie donc PAS de
// reconstituer un catalogue par vault : c'est un CALCULATEUR pur, à qui
// l'appelant désigne l'offre qui correspond à ce qu'il voit sur son écran.
//
// ⚠️ LES 4 EMPLACEMENTS NE SONT PAS INTERCHANGEABLES — CORRECTION DU
// 04/09/2026. L'affirmation précédente (« les 4 emplacements sont tirés au
// hasard ») était vraie de l'OFFRE, fausse de l'EMPLACEMENT. Chaque offre des
// instantanés de compte (`source/startup_*.json`) porte un champ
// `offerGroup` (1 à 4) = sa case en jeu, et sur les 25 vaults échantillonnés
// des deux comptes, 25/25 respectent le même thème par case :
//
//   1. le CAPITAL du joueur — pièces, nourriture, points de recherche, et ses
//      biens d'atelier d'ère courante (`CEGood*`) ou précédente (`PEGood*`) ;
//   2. les biens ALLIÉS (`ExoticGood_<Culture>_<n>`) ;
//   3. les PLANS de merveille et les ORBES ;
//   4. les OBJETS d'inventaire.
//
// D'où `KEEPER_SLOT_BY_CATEGORY` / `keeperOffersForSlot` : une case ne peut
// recevoir que les offres de son thème, l'UI n'a plus à proposer les 30 partout.
// Seule l'offre TIRÉE dans un thème varie d'un joueur à l'autre.
//
// ⚠️ LA RÉPUTATION PAR OFFRE VIENT DU WIKI COMMUNAUTAIRE, PAS DU GAME DESIGN.
// `Module:Heritage_Vault` (riseofcultures.wiki.gg) porte une table `offers_list`
// qui associe à chaque type d'offre un montant ET une réputation FIXE — une
// donnée que le jeu ne livre nulle part ailleurs. Elle recoupe parfaitement les
// 29 courbes trouvées (même montant au premier achat, à l'unité près :
// `RP` → 20, `Negotiation_Wildcard` → 3, `WonderBP_Rare/Legendary` → 1, cf.
// `heritage-keeper-offers.test.ts`) — une coïncidence sur autant de valeurs
// indépendantes vaudrait comme confirmation, pas comme hasard. La seule offre
// du wiki SANS courbe correspondante est `Orb` (réputation 3), et les
// instantanés de compte tranchent : `KeeperOffer_WonderOrb_3` porte un
// `amount: "-1"` EN DUR, sans `dynamicAmount`. C'est donc bien un PRIX FIXE
// d'un orbe qui ne grimpe jamais — invisible pour notre extraction, qui ne
// retient que les scripts lisant `keeperPurchaseCount`. Elle entre au
// catalogue avec `fixedCost` (voir `KeeperOffer.fixedCost`), 30ᵉ et dernière
// offre connue.
//
// ⚠️ CORRECTION SUR LE SIGNE — `CEGood1/2/3` ET `PEGood1/2/3`. Notre extraction
// les marque `direction: "receive"` (montant positif), ce qui les excluait
// auparavant du calculateur en les prenant pour un mécanisme où le JOUEUR
// reçoit l'objet. Le wiki les liste pourtant bien comme des offres où le joueur
// CÈDE des biens (« Goods: Primary/Secondary/Tertiary » et son équivalent ère
// précédente) contre +1 réputation — le signe négatif est simplement absent du
// script Lua pour ces 6 formules, un choix d'écriture, pas une donnée de sens.
// Toutes les 28 offres du catalogue sont donc traitées UNIFORMÉMENT : coût =
// valeur ABSOLUE de la formule, quel que soit son signe brut.
//
// ⚠️ RÉINITIALISATION HEBDOMADAIRE — CORRECTION DE CONVENTION, voir
// `resolvers/heritage.ts` (`KEEPER_PURCHASE_COUNT_SCOPE`). Ce module simule une
// semaine FRAÎCHE (`purchaseCount` de 0 à N) plutôt que de suivre un compteur
// persisté.
// ============================================================

import { ERAS } from "@/data/config";
import { KEEPER_OFFER_FORMULAS, keeperOfferValue } from "./heritage";
import type { EraCode } from "@/types/shared";

export type KeeperOfferCategory = "capital" | "goods" | "allied" | "blueprint" | "inventory";

/** L'emplacement du gardien, 1 à 4 — le `offerGroup` du jeu, voir l'en-tête. */
export type KeeperSlot = 1 | 2 | 3 | 4;

export const KEEPER_SLOTS: KeeperSlot[] = [1, 2, 3, 4];

/**
 * Le thème FIXE de chaque emplacement, par catégorie d'offre. Capital et Goods
 * partagent la case 1 : ce sont, des deux côtés, des ressources que produit la
 * capitale du joueur — le jeu ne les sépare pas non plus (`offerGroup: 1` porte
 * indifféremment `Coins_Static*`, `ResearchPoints_S`, `CEGood*` et `PEGood*`).
 */
export const KEEPER_SLOT_BY_CATEGORY: Record<KeeperOfferCategory, KeeperSlot> = {
  capital: 1,
  goods: 1,
  allied: 2,
  blueprint: 3,
  inventory: 4,
};

/**
 * Pour une offre `category: "goods"` RATTACHÉE À UN RANG (`primary_ba`…) : quel
 * rang, à quelle ère relative au joueur. `eraOffset: -1` désigne l'ère
 * PRÉCÉDENTE (`PEGood*`) — l'affichage résout le nom réel via le classement
 * d'ateliers du joueur, cette donnée ne fait que dire QUOI résoudre.
 */
export interface KeeperOfferRank {
  priority: "primary" | "secondary" | "tertiary";
  eraOffset: 0 | -1;
}

/**
 * Une offre du gardien : sa réputation FIXE (wiki), sa catégorie d'affichage,
 * et — pour les biens de rang — de quoi résoudre un nom et une icône réels.
 */
export interface KeeperOffer {
  /** Suffixe du script Lua, ex. `Coins_S` — identifie aussi la courbe de prix. */
  id: string;
  label: string;
  category: KeeperOfferCategory;
  /** Réputation gagnée par échange — fixe, source : wiki communautaire. */
  reputation: number;
  scalesWithPlayerAge: boolean;
  /**
   * Prix FIXE, pour la seule offre qui n'a pas de courbe (`Orb`) : son coût ne
   * dépend ni de l'ère ni du nombre d'achats déjà faits cette semaine (voir
   * l'en-tête du module). Absent partout ailleurs — c'est alors la formule Lua
   * qui fait foi, jamais une valeur en dur.
   */
  fixedCost?: number;
  /** Uniquement pour un bien de RANG (`CEGood*`/`PEGood*`). */
  rank?: KeeperOfferRank;
  /**
   * Uniquement pour les 3 Exotic Goods (`category: "allied"`) : les biens
   * ALLIÉS réels que ce palier de prix peut désigner — PAS des clés de
   * `GOOD_META_BY_KEY` (ce dictionnaire ne couvre que les biens d'atelier
   * primary/secondary/tertiary, jamais un bien allié). Ce sont des clés
   * `/images/goods/<clé>.webp` + `goodsByCivilization` (`lib/constants.ts`).
   *
   * ⚠️ TROIS PALIERS DE PRIX, PAS TROIS BIENS. Chaque offre en jeu
   * (`KeeperOffer_ExoticGood_<Culture>_<n>`) tire un bien allié précis selon
   * la civilisation ET le tirage du joueur — confirmé en confrontant deux
   * comptes (`source/startup_stable.json`, `source/startup_beta.json`) : le
   * MÊME palier de prix (`ExoticGood_1/2/3`, donc la même courbe et le même
   * `keeperPurchaseCount`) sert pour des biens différents selon la
   * civilisation (`porcelain` en Chine, `spice_treasure`/`ceramic_treasure`
   * chez les Vikings, tous au palier `ExoticGood_1`). Cette liste ne prétend
   * donc PAS être exhaustive — seulement les biens confirmés dans nos deux
   * échantillons de compte — mais couvre déjà Égypte, Chine, Maya, Arabie,
   * Ottomans et Vikings. Toutes désignées comme autant de CARTES DISTINCTES
   * dans le sélecteur, jamais fondues sous un unique libellé générique
   * (« Exotic goods II ») : le joueur reconnaît son écran par le bien, pas
   * par un numéro de palier qui ne veut rien dire en jeu.
   */
  goodCandidates?: string[];
}

/**
 * Le catalogue complet — les 29 courbes extraites, toutes retrouvées dans le
 * wiki (`Orb`, seule entrée du wiki SANS courbe, n'a pas de contrepartie ici —
 * voir l'en-tête du module). Dans l'ordre CAPITAL → GOODS → ALLIED → INVENTORY,
 * l'ordre d'affichage voulu par sections plutôt que celui, arbitraire, du game
 * design.
 */
export const KEEPER_OFFER_CATALOG: KeeperOffer[] = [
  // ─── Capital ──────────────────────────────────────────────────────────────
  { id: "Coins_S", label: "Coins (small)", category: "capital", reputation: 1, scalesWithPlayerAge: true },
  { id: "Coins_M", label: "Coins (medium)", category: "capital", reputation: 1, scalesWithPlayerAge: true },
  { id: "Food_S", label: "Food (small)", category: "capital", reputation: 1, scalesWithPlayerAge: true },
  { id: "Food_M", label: "Food (medium)", category: "capital", reputation: 1, scalesWithPlayerAge: true },
  { id: "RP", label: "Research points", category: "capital", reputation: 1, scalesWithPlayerAge: false },

  // ─── Goods ────────────────────────────────────────────────────────────────
  { id: "CEGood1", label: "Goods (primary)", category: "goods", reputation: 1, scalesWithPlayerAge: false, rank: { priority: "primary", eraOffset: 0 } },
  { id: "CEGood2", label: "Goods (secondary)", category: "goods", reputation: 1, scalesWithPlayerAge: false, rank: { priority: "secondary", eraOffset: 0 } },
  { id: "CEGood3", label: "Goods (tertiary)", category: "goods", reputation: 1, scalesWithPlayerAge: false, rank: { priority: "tertiary", eraOffset: 0 } },
  { id: "PEGood1", label: "Previous era goods (primary)", category: "goods", reputation: 1, scalesWithPlayerAge: false, rank: { priority: "primary", eraOffset: -1 } },
  { id: "PEGood2", label: "Previous era goods (secondary)", category: "goods", reputation: 1, scalesWithPlayerAge: false, rank: { priority: "secondary", eraOffset: -1 } },
  { id: "PEGood3", label: "Previous era goods (tertiary)", category: "goods", reputation: 1, scalesWithPlayerAge: false, rank: { priority: "tertiary", eraOffset: -1 } },
  // ─── Allied culture ───────────────────────────────────────────────────────
  // Trois PALIERS DE PRIX (200/250/300, `ExoticGood_1/2/3`), pas trois biens —
  // voir la doc de `goodCandidates`. `tea` couvre `medical_tea`, l'identifiant
  // brut du bien ottoman (`RESOURCE_KEY_ALIAS`, `scripts/extract/technologies.ts`) :
  // même bien affiché ailleurs dans le projet, `medical_tea` n'a pas d'icône
  // propre sous `/images/goods/`.
  { id: "ExoticGood_1", label: "Exotic goods I", category: "allied", reputation: 1, scalesWithPlayerAge: false, goodCandidates: ["porcelain", "ceramic_treasure", "spice_treasure"] },
  { id: "ExoticGood_2", label: "Exotic goods II", category: "allied", reputation: 1, scalesWithPlayerAge: false, goodCandidates: ["ankh", "golden_mask", "syrup", "incense", "oil_lamp", "calendar_stone", "ritual_dagger", "tea"] },
  { id: "ExoticGood_3", label: "Exotic goods III", category: "allied", reputation: 1, scalesWithPlayerAge: false, goodCandidates: ["papyrus_scroll", "ceremonial_dress", "silk", "stockfish"] },

  // ─── Inventory ────────────────────────────────────────────────────────────
  { id: "ConstructionUpgrade_Skip", label: "Construction skip item", category: "inventory", reputation: 1, scalesWithPlayerAge: false },
  { id: "Production_Skip", label: "Production skip item", category: "inventory", reputation: 1, scalesWithPlayerAge: false },
  { id: "HealSquad", label: "Squad healing item", category: "inventory", reputation: 1, scalesWithPlayerAge: false },
  { id: "HealAllUnits", label: "Complete healing item", category: "inventory", reputation: 1, scalesWithPlayerAge: false },
  { id: "Negotiation_Turn", label: "Negotiation turn item", category: "inventory", reputation: 1, scalesWithPlayerAge: false },
  { id: "Negotiation_Wildcard", label: "Negotiation wildcard", category: "inventory", reputation: 1, scalesWithPlayerAge: false },
  { id: "RefillBarracks_Infantry", label: "Infantry barracks refill", category: "inventory", reputation: 1, scalesWithPlayerAge: false },
  { id: "RefillBarracks_Ranged", label: "Ranged barracks refill", category: "inventory", reputation: 1, scalesWithPlayerAge: false },
  { id: "RefillBarracks_Cavalry", label: "Cavalry barracks refill", category: "inventory", reputation: 1, scalesWithPlayerAge: false },
  { id: "RefillBarracks_HeavyInfantry", label: "Heavy infantry barracks refill", category: "inventory", reputation: 1, scalesWithPlayerAge: false },
  { id: "RefillBarracks_Siege", label: "Siege barracks refill", category: "inventory", reputation: 1, scalesWithPlayerAge: false },
  { id: "RefillBarracks_All", label: "Complete barracks refill", category: "inventory", reputation: 2, scalesWithPlayerAge: false },
  { id: "AgeUpKit", label: "Age up kit", category: "inventory", reputation: 3, scalesWithPlayerAge: false },

  // ─── Blueprints & orbs ────────────────────────────────────────────────────
  // La 3ᵉ case du gardien, et elle seule (`offerGroup: 3`) : 24 des 25 vaults
  // échantillonnés y proposent un plan, le 25ᵉ un orbe. Ces trois offres
  // vivaient auparavant sous `inventory` — un classement de données qui n'avait
  // aucune conséquence tant que le sélecteur montrait tout ; il en a une
  // maintenant que chaque case ne montre que son thème.
  { id: "WonderBP_Rare", label: "Rare wonder blueprint", category: "blueprint", reputation: 4, scalesWithPlayerAge: false },
  { id: "WonderBP_Legendary", label: "Legendary wonder blueprint", category: "blueprint", reputation: 5, scalesWithPlayerAge: false },
  { id: "Orb", label: "Wonder orb", category: "blueprint", reputation: 3, scalesWithPlayerAge: false, fixedCost: 1 },
];

/** Les offres proposées par un emplacement donné, dans l'ordre du catalogue. */
export function keeperOffersForSlot(slot: KeeperSlot): KeeperOffer[] {
  return KEEPER_OFFER_CATALOG.filter((offer) => KEEPER_SLOT_BY_CATEGORY[offer.category] === slot);
}

/** L'emplacement où vit une offre, `null` si l'identifiant est inconnu. */
export function keeperOfferSlot(offerId: string): KeeperSlot | null {
  const offer = KEEPER_OFFER_CATALOG.find((candidate) => candidate.id === offerId);
  return offer === undefined ? null : KEEPER_SLOT_BY_CATEGORY[offer.category];
}

/**
 * Vérifie, en test, que chaque entrée a bien une courbe de prix extraite —
 * `Orb` exceptée, seule offre à prix fixe (voir `KeeperOffer.fixedCost`).
 */
export const KEEPER_OFFER_FORMULA_IDS = new Set(KEEPER_OFFER_FORMULAS.map((o) => o.id));

/**
 * L'ère PRÉCÉDENTE dans l'ordre du jeu — pour `PEGood*` (`eraOffset: -1`).
 * `null` en tête de liste (StoneAge n'a pas de précédente) ; ne devrait jamais
 * arriver en pratique, le Heritage Vault n'existant qu'à partir de l'ère
 * Byzantine (cf. `HERITAGE_VAULT_MIN_ERA`, `heritage-vault-view.tsx`).
 */
export function previousEra(era: EraCode): EraCode | null {
  const index = ERAS.findIndex((entry) => entry.abbr === era);
  return index <= 0 ? null : ERAS[index - 1].abbr;
}

/**
 * L'ère à utiliser pour résoudre le bien d'une offre de rang, en appliquant son
 * `eraOffset`. `null` si l'offset demande une ère antérieure à `StoneAge`.
 */
export function eraForRank(era: EraCode, rank: KeeperOfferRank): EraCode | null {
  return rank.eraOffset === 0 ? era : previousEra(era);
}

/**
 * Le coût du `purchaseCount`-ième échange, en valeur POSITIVE — ce que le
 * joueur cède, quel que soit le signe brut de la formule (voir l'en-tête du
 * module sur `CEGood`/`PEGood`).
 */
export function keeperOfferCost(
  offerId: string,
  purchaseCount: number,
  era: EraCode,
): number | null {
  // Le prix fixe prime — c'est justement le cas où AUCUNE formule n'existe
  // (`Orb`), et il ne bouge ni avec l'ère ni avec le compteur d'achats.
  const offer = KEEPER_OFFER_CATALOG.find((candidate) => candidate.id === offerId);
  if (offer?.fixedCost !== undefined) return offer.fixedCost;

  const raw = keeperOfferValue(offerId, purchaseCount, era);
  return raw === null ? null : Math.abs(raw);
}

/**
 * Le coût CUMULÉ de `count` échanges, compteur reparti de 0 — combien coûte,
 * au total, le fait d'en faire exactement `count` cette semaine. `null` si
 * l'offre ou l'ère sont inconnues, `0` pour `count <= 0`.
 */
export function cumulativeKeeperOfferCost(
  offerId: string,
  era: EraCode,
  count: number,
): number | null {
  const target = Math.max(Math.trunc(count), 0);
  let total = 0;
  for (let purchaseCount = 0; purchaseCount < target; purchaseCount += 1) {
    const cost = keeperOfferCost(offerId, purchaseCount, era);
    if (cost === null) return null;
    total += cost;
  }
  return total;
}

/** Le plan d'échanges pour UNE semaine fraîche (compteur reparti de 0). */
export interface WeeklyKeeperExchangePlan {
  offerId: string;
  /** Nombre d'échanges tenant dans le budget, compteur reparti de 0. */
  count: number;
  /** Ressource dépensée pour ces `count` échanges. */
  totalSpent: number;
  /** Ce que coûterait l'échange SUIVANT. `null` si la formule ne répond plus. */
  nextCost: number | null;
  /** Ce qu'il reste du budget une fois les `count` échanges faits. */
  remaining: number;
}

/**
 * ⚠️ GARDE-FOU DE BOUCLE, PAS UNE BORNE MÉTIER. Une courbe qui grimpe de 5 à
 * 10 % par achat rend le nombre d'échanges très vite insensible au budget (à
 * titre d'ordre de grandeur : ~37 échanges pour 2 100 PR à +5 %/achat — voir
 * le test de référence). 5 000 itérations reste très au-delà de tout budget
 * plausible ; ce n'est qu'un filet contre une formule dégénérée (ratio ≤ 1,
 * budget démesuré).
 */
const MAX_PURCHASES = 5000;

/**
 * Combien de fois `offerId` peut être échangée avant d'épuiser
 * `weeklyBudget`, compteur d'achats reparti de 0 — voir la correction de
 * convention en tête de module sur le reset hebdomadaire.
 *
 * Rend `null` si l'offre ou l'ère sont inconnues — jamais un plan à 0 échange
 * silencieux, qui se lirait comme « budget insuffisant » plutôt que « offre
 * introuvable ».
 */
export function weeklyKeeperExchangePlan(
  offerId: string,
  era: EraCode,
  weeklyBudget: number,
): WeeklyKeeperExchangePlan | null {
  const budget = Math.max(weeklyBudget, 0);
  let count = 0;
  let totalSpent = 0;

  for (let purchaseCount = 0; purchaseCount < MAX_PURCHASES; purchaseCount += 1) {
    const cost = keeperOfferCost(offerId, purchaseCount, era);
    if (cost === null) {
      return count === 0
        ? null
        : { offerId, count, totalSpent, nextCost: null, remaining: budget - totalSpent };
    }
    if (totalSpent + cost > budget) {
      return { offerId, count, totalSpent, nextCost: cost, remaining: budget - totalSpent };
    }
    totalSpent += cost;
    count += 1;
  }

  return { offerId, count, totalSpent, nextCost: null, remaining: budget - totalSpent };
}

/** Une semaine du plan projeté par `keeperExchangeForecast`. */
export interface WeeklyKeeperForecastPoint {
  /** Numéro de semaine, 1-indexé. */
  week: number;
  count: number;
  reputation: number;
  /** Ressource RÉELLEMENT cédée cette semaine pour ces `count` échanges. */
  spent: number;
  /** Ressource non dépensée cette semaine — reportée sur la suivante. */
  remaining: number;
}

export interface KeeperExchangeForecast {
  weeks: WeeklyKeeperForecastPoint[];
  totalCount: number;
  totalReputation: number;
  /** Somme des `spent` de chaque semaine — le coût total de la projection. */
  totalSpent: number;
}

/**
 * Projette `weeks` semaines d'échanges à partir d'un stock de départ et d'une
 * production JOURNALIÈRE constante — réponse à « à la fin du mois, combien de
 * réputation avec X/jour ? ». Chaque semaine reçoit `production × 7` en plus
 * du reliquat de la précédente (`remaining` roule d'une semaine à l'autre,
 * jamais perdu) ; c'est `weeklyKeeperExchangePlan` qui tourne, semaine après
 * semaine, sur ce budget qui s'accumule.
 *
 * Rend `null` pour une offre ou une ère inconnues — même convention que
 * `weeklyKeeperExchangePlan`.
 */
export function keeperExchangeForecast(
  offerId: string,
  era: EraCode,
  startingStock: number,
  dailyProduction: number,
  weeks: number,
): KeeperExchangeForecast | null {
  const offer = KEEPER_OFFER_CATALOG.find((candidate) => candidate.id === offerId);
  if (offer === undefined) return null;

  let stock = Math.max(startingStock, 0);
  const production = Math.max(dailyProduction, 0);
  const points: WeeklyKeeperForecastPoint[] = [];
  let totalCount = 0;
  let totalReputation = 0;
  let totalSpent = 0;

  for (let week = 1; week <= Math.max(Math.trunc(weeks), 0); week += 1) {
    const budget = stock + production * 7;
    const plan = weeklyKeeperExchangePlan(offerId, era, budget);
    if (plan === null) return null;
    const reputation = plan.count * offer.reputation;
    points.push({
      week,
      count: plan.count,
      reputation,
      spent: plan.totalSpent,
      remaining: plan.remaining,
    });
    totalCount += plan.count;
    totalReputation += reputation;
    totalSpent += plan.totalSpent;
    stock = plan.remaining;
  }

  return { weeks: points, totalCount, totalReputation, totalSpent };
}
