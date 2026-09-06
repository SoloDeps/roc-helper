/**
 * Heritage Vault — catalogue, état joueur, et résolution des deux.
 *
 * Trois couches, comme les domaines Wonders et Bâtiments évolutifs :
 *
 *  1. `HeritageVault` — le CATALOGUE. Donnée de jeu, identique pour tous,
 *     dérivée de `HERITAGE_EXTRACT`.
 *  2. `OwnedHeritageVault` — l'ÉTAT du joueur : ce qu'une table Dexie stocke.
 *  3. `ResolvedHeritageVault` — le croisement des deux, calculé au rendu,
 *     jamais persisté.
 *
 * ⚠️ CE QUI DISTINGUE CE DOMAINE DES BÂTIMENTS ÉVOLUTIFS — l'ère.
 *
 * Un évolutif porte une ère FIGÉE à l'obtention (`OwnedEvolvingBuilding.era`).
 * Un vault n'en a pas : son bâtiment-marqueur est déclaré `age: "StoneAge"`,
 * `level: 1` sur les 13, et ses tables à deux axes sont des
 * `PlayerAgeDynamicChangeDTO` — l'ère COURANTE du joueur, lue au runtime. D'où
 * l'absence délibérée de champ `era` dans `OwnedHeritageVault` : le stocker
 * figerait une valeur que le jeu recalcule à chaque montée d'ère.
 *
 * Ce module ne touche ni `BuildingData`, ni `ELEMENT_DATA_REGISTRY`, ni
 * `BUILDING_EXTRACT` : les 13 bâtiments-marqueurs restent la propriété du
 * domaine Bâtiments (`scope: "decoration"`), et seule leur `chainKey` est
 * reprise ici comme pont.
 */

import { HERITAGE_EXTRACT } from "@/data/heritage/generated/heritage.generated";
import type {
  HeritageEffectExtract,
  HeritageEffectGroup,
  HeritageKeeperOfferFormula,
  HeritageLevelScheme,
  HeritageRequirement,
  HeritageRewardKind,
  HeritageRewardNode,
  HeritageRewardTier,
  HeritageSlotExtract,
  HeritageVaultExtract,
} from "@/data/heritage/generated/types";
import type {
  BuildingBonus,
  BuildingBonusFormat,
  BuildingBonusScope,
} from "@/data/buildings/generated/types";
import { GAME_DESIGN_AGE_BY_ERA } from "@/data/config";
import { evaluateLuaFormula } from "@/resolvers/lua-formula";
import type { EraCode } from "@/types/shared";

import { bonusKey, getBonusLabel } from "./bonus";
import { resolveBonus, resolveByAgeAndLevel, resolveByLevel } from "./building-curves";
import {
  getConstructionCost as getEvolvingConstructionCost,
  getEvolvingBuilding,
  getEvolvingBuildingByDefinitionId,
  getUpgradeCost as getEvolvingUpgradeCost,
} from "./evolving-buildings";

// ═════════════════════════════════════════════════════════════════════════════
// CONVENTIONS ASSUMÉES
//
// Trois règles que le game design NE DÉCLARE PAS et que ce module tranche
// explicitement. Chacune tient en une constante ou une fonction unique, pour
// qu'un démenti mesuré en jeu ne demande de corriger qu'UN endroit.
// La convention (a) — l'opérateur `modifier × courbe` du schéma A — vit dans
// `resolvers/bonus.ts`, parce qu'elle s'applique aussi aux autres domaines.
// ═════════════════════════════════════════════════════════════════════════════

/**
 * ⚠️ CONVENTION (b) — CIBLE ET PORTÉE DE L'AMPLIFICATEUR DU GARDIEN.
 *
 * DÉDUCTION DOCUMENTÉE, PAS UNE DONNÉE CONFIRMÉE PAR LE DTO.
 *
 * `Boost_HeritageVault_KeeperAmplifier` est un `BoostAmplifierComponentDTO`
 * porté par les 13 `Building_Heritage_*_1`. Son script vaut
 * `0.01 * (entityLevel - 1)`. Le DTO **ne déclare aucune cible** et sa table
 * `modifier` est un stub vide (une entrée `when: "0"` au `then` sans valeur) :
 * le lire par le chemin normal des boosts rend zéro.
 *
 * Deux choses sont donc décidées ici, et elles viennent de la LOCA, pas du DTO :
 *
 *  1. `entityLevel` est le RANG DE RÉPUTATION du gardien, pas le niveau du vault.
 *     `Base.HeritageVault.Keeper.InfoTooltip` : « Every {0} points raises your
 *     reputation level by 1, and each level adds +1% to this heritage building's
 *     production and boosts. »
 *  2. La cible est « toutes les productions et tous les boosts du bâtiment
 *     heritage DU MÊME THÈME », et la composition est MULTIPLICATIVE — même
 *     source, plus `Base.HeritageVault.Keeper.BuildingOutputBoost`
 *     (« +{0}% Building output »).
 *
 * ✅ CONFIRMÉ EN JEU pour le point 1. Vault Thaï niveau 1, en ne faisant monter
 * que le rang de gardien : le rang 1 rend la valeur de base NUE (130), les rangs
 * 2 à 6 rendent 132 / 133 / 134 / 136 / 137. Le rang 1 sans effet établit
 * `0,01 × (rang − 1)` plutôt que `0,01 × rang`, et le reste de la série recoupe
 * le taux de 1 % à ]0,77 % ; 1,03 %]. La règle d'ARRONDI qui va avec — vers le
 * haut, à l'affichage seulement — est documentée et testée du côté présentation
 * (`components/heritage/effect-display.ts`, `effect-icon.test.ts`) : ce module
 * garde la valeur exacte, pour que les cumuls ne dérivent pas.
 *
 * Ce qui reste inconnu : rien ne dit si l'amplification s'applique avant ou
 * après d'autres boosts globaux du joueur. Ce module l'applique au seul bonus du
 * vault, et n'en compose aucun autre.
 *
 * ⚠️ Le game design ne déclare AUCUN plafond de rang de gardien. Le tableau
 * extrait s'arrête à `maxLevel` (60) par cohérence avec le vault ; au-delà, la
 * formule est prolongée ici plutôt que bornée en silence.
 */
export function keeperAmplifierMultiplier(reputationLevel: number): number {
  const amplifier = HERITAGE_EXTRACT.keeperAmplifier;
  if (amplifier === null) return 0;
  const level = Math.max(Math.trunc(reputationLevel), 1);
  const tabulated = amplifier.perReputationLevel[level - 1];
  if (tabulated !== undefined) return tabulated;
  return evaluateLuaFormula(amplifier.luaScript, { entityLevel: level });
}

/**
 * ⚠️ CONVENTION (b bis) — CE QUE L'AMPLIFICATEUR NE TOUCHE PAS.
 *
 * L'amplificateur est un POURCENTAGE. Appliqué à une grandeur continue
 * (production, boost) il rend une grandeur continue ; appliqué à un COMPTEUR
 * DISCRET il rend une valeur que le jeu ne sait pas représenter — 7 emplacements
 * d'ouvrier × 1,15 = 8,05 ouvriers, une portée de culture de 3 cases × 1,15 =
 * 3,45 cases, 4 tentatives de chasse × 1,15 = 4,6 tentatives.
 *
 * La loca ne promet l'amplification que sur « this heritage building's
 * production and boosts » (`Base.HeritageVault.Keeper.InfoTooltip`) : un
 * emplacement, un rayon et un plafond de tentatives ne sont ni l'un ni l'autre,
 * ce sont des CAPACITÉS. Et le game design ne déclare AUCUNE règle d'arrondi qui
 * permettrait d'en tirer un entier — inventer « arrondi au supérieur » offrirait
 * un ouvrier gratuit dès le rang 8, « à l'inférieur » n'aurait jamais d'effet.
 *
 * On n'amplifie donc pas ces trois-là. `culture_points`, lui, était supposé
 * RESTER amplifié — hypothèse écartée, voir ⚠️ ci-dessous.
 *
 * Le jour où une mesure en jeu montre un compteur discret amplifié, c'est cette
 * seule liste qu'il faut corriger — la règle d'arrondi mesurée avec.
 *
 * ⚠️ CONFIRMÉ EN JEU — `culture_points` N'EST PAS AMPLIFIÉ, CONTRAIREMENT À
 * L'HYPOTHÈSE CI-DESSUS. Vault ATH niveau 30, Gardien rang 6 (« +5% to
 * production and boosts » affiché sur la carte du Gardien) : la popup
 * « Améliorations au niveau 30 » du jeu affiche un bonus culturel de 2 420,
 * exactement la valeur BRUTE de la formule (`200 + 30×niveau +
 * 4×niveau×max(0, âge−4)` à Late Gothic Era = 2 420), sans les +5% attendus
 * (2 541). Les trois autres bonus du même niveau (régénération de tentative,
 * PV d'infanterie, réduction du temps de recrutement) montrent eux un écart
 * de quelques dixièmes de point cohérent avec un simple arrondi d'affichage
 * autour de la valeur amplifiée — seule la Culture diffère de la totalité des
 * +5%, signe qu'elle n'est pas concernée par l'amplificateur.
 *
 * `CultureComponentDTO` est un troisième type de composant, distinct de
 * `ProductionComponentDTO` et `BuildingBoostComponentDTO` que la loca vise
 * (« production and boosts ») — cette mesure confirme que ce troisième type
 * en est exclu, malgré `culture_points` qui a l'air d'une production continue
 * comme une autre.
 */
export const KEEPER_AMPLIFIER_EXEMPT_TYPES: ReadonlySet<string> = new Set([
  "worker_slots",
  "culture_range",
  "regeneration_cap",
  "culture_points",
]);

/**
 * La valeur d'un bonus une fois l'amplificateur du gardien appliqué.
 *
 * ⚠️ LE SEUL ENDROIT QUI APPLIQUE LES CONVENTIONS (b) ET (b bis). Composition
 * multiplicative avec le rang de gardien, SAUF sur les compteurs discrets, qui
 * rendent leur valeur nue — jamais `null` pour autant, pour que l'affichage
 * n'ait pas à distinguer.
 *
 * Exporté parce que l'amplificateur doit pouvoir être REJOUÉ à un autre rang que
 * celui du vault résolu : l'optimiseur de l'onglet Combination fait varier le
 * rang pour chiffrer l'arbitrage « réputation contre jetons », et il doit le
 * faire par cette fonction plutôt qu'en recopiant la règle.
 */
export function amplifyBonusValue(
  type: string,
  value: number | null,
  multiplier: number,
): number | null {
  if (value === null) return null;
  const applied = KEEPER_AMPLIFIER_EXEMPT_TYPES.has(type) ? 0 : multiplier;
  return value * (1 + applied);
}

/**
 * ⚠️ CONVENTION (c) — TAUX DE CONVERSION D'UN BÂTIMENT ÉVOLUTIF SACRIFIÉ.
 *
 * HYPOTHÈSE 1:1, NON CONFIRMÉE PAR LA DONNÉE.
 *
 * Sacrifier un bâtiment évolutif entier verse de l'xp au vault de son thème
 * (`Base.HeritageVault.DonateBuildingConfirmDescription` : « Donating {0} will
 * grant {1} XP to this theme »), et `ConstantsDefinition` porte bien la durée de
 * conversion (`heritageConversionDuration: "600s"`). **Mais aucun champ du game
 * design ne donne le taux niveau-de-bâtiment → xp.**
 *
 * La valeur retenue est 1, par symétrie avec le seul taux qui, lui, EST déclaré :
 * les 41 `EvolutionToken|…` éligibles portent tous un
 * `HeritageContributionTraitDTO` avec `heritageXpPerUnit: 1` (41/41). Un jeton =
 * 1 xp ; on suppose donc un niveau d'évolutif = 1 xp.
 *
 * C'est une hypothèse, pas une mesure. Le jour où le jeu la contredit, seule
 * cette constante change.
 */
export const HERITAGE_XP_PER_EVOLVING_LEVEL = 1;

/** Xp versée par le sacrifice d'un évolutif de `levels` niveaux — convention (c). */
export function heritageXpFromDonation(levels: number): number {
  return Math.max(Math.trunc(levels), 0) * HERITAGE_XP_PER_EVOLVING_LEVEL;
}

/**
 * ⚠️ CONVENTION — PORTÉE DE `keeperPurchaseCount`.
 *
 * INCONNUE DE MODÈLE, TRANCHÉE PAR CONVENTION EXPLICITE.
 *
 * Les 29 formules de prix du gardien lisent `keeperPurchaseCount`, et cette
 * variable n'apparaît NULLE PART ailleurs dans les 66 Mo du game design : rien
 * ne dit si le compteur est global au joueur, par vault, par offre.
 *
 * Convention retenue pour le SCOPE : **un compteur par (vault, offre)**. La
 * loca donne à chaque héritage son propre gardien et son propre classement
 * (`Base.HeritageVault.Tutorial.KeeperRanking`) — rien ne suggère un compteur
 * partagé entre vaults ou entre offres d'un même vault.
 *
 * C'est ce que `OwnedHeritageVault.keeperPurchases` encode : une entrée par
 * offre, dans l'état du vault.
 *
 * ⚠️ CORRECTION — LE COMPTEUR SE REMET À ZÉRO CHAQUE SEMAINE, CONTRAIREMENT À
 * CE QUE CETTE CONVENTION AFFIRMAIT AUPARAVANT (« jamais remis à zéro », faute
 * de donnée pour trancher). Deux captures d'écran en jeu affichent « Offers
 * refresh every week » avec un compte à rebours, et le calcul d'un joueur de
 * la communauté (300 PR/jour, +5 %/achat, ~37 échanges en une semaine) ne
 * fonctionne QUE si le compteur repart de 0 à chaque semaine — un compteur qui
 * ne reset jamais rendrait ces offres exponentiellement plus chères en
 * quelques semaines, ce qu'aucun témoignage ne rapporte. Cette preuve en jeu
 * l'emporte sur l'absence de donnée qui avait motivé l'hypothèse initiale.
 *
 * Rien dans `OwnedHeritageVault.keeperPurchases` (Dexie) n'implémente ce reset
 * aujourd'hui — le champ n'est d'ailleurs lu par AUCUNE UI pour l'instant. Le
 * calculateur d'offres du gardien (`heritage-keeper-offers.ts`) contourne la
 * question : il simule une semaine fraîche à chaque appel plutôt que de
 * suivre un compteur persisté.
 */
export const KEEPER_PURCHASE_COUNT_SCOPE = "perOfferPerVault" as const;

// ═════════════════════════════════════════════════════════════════════════════
// Catalogue
// ═════════════════════════════════════════════════════════════════════════════

export interface HeritageVault {
  /** Clé de registre, ex. `heritage_celtic`. Identifiant public du domaine. */
  key: string;
  /** Identité du game design, ex. `heritage_vault.Heritage_Celtic`. */
  themeId: string;
  /** Nom du thème, ex. « Forge of Flames ». */
  name: string;
  description: string;
  /** Nom du bâtiment-marqueur, ex. « Celtic Culture ». Distinct de `name`. */
  buildingName: string;
  /** Chaîne correspondante de `BUILDING_EXTRACT` — pont, pas duplication. */
  buildingChainKey: string;
  event: string | null;
  order: number | null;
  maxLevel: number;
  slots: HeritageSlotExtract[];
  effects: HeritageEffectExtract[];
  /** Les évolutifs dont les jetons alimentent ce vault. */
  eligibleEvolvingBuildingIds: string[];
}

function toVault(extract: HeritageVaultExtract): HeritageVault {
  return {
    key: extract.key,
    themeId: extract.themeId,
    name: extract.name,
    description: extract.description,
    buildingName: extract.buildingName,
    buildingChainKey: extract.buildingChainKey,
    event: extract.event,
    order: extract.order,
    maxLevel: extract.maxLevel,
    slots: extract.slots,
    effects: extract.effects,
    eligibleEvolvingBuildingIds: extract.eligibleEvolvingBuildingIds,
  };
}

/** Les 13 Heritage Vaults, dans l'ordre déclaré par le game design. */
export const HERITAGE_VAULTS: HeritageVault[] = HERITAGE_EXTRACT.vaults.map(toVault);

const EXTRACT_BY_KEY = new Map(HERITAGE_EXTRACT.vaults.map((v) => [v.key, v]));
const BY_KEY = new Map(HERITAGE_VAULTS.map((v) => [v.key, v]));
const BY_THEME = new Map(HERITAGE_VAULTS.map((v) => [v.themeId, v]));

export function getHeritageVault(key: string): HeritageVault | null {
  return BY_KEY.get(key) ?? null;
}

export function getHeritageVaultByTheme(themeId: string): HeritageVault | null {
  return BY_THEME.get(themeId) ?? null;
}

/**
 * Segment d'URL d'un vault, ex. `heritage_ath` → `ath`. Le préfixe est commun
 * aux 13 clés (voir `HERITAGE_EXTRACT`) et n'apporte rien à l'URL — l'enlever
 * donne des liens courts (`/vault/ath/progression`) plutôt que redondants
 * (`/vault/heritage_ath/progression`).
 */
export function heritageVaultSlug(key: string): string {
  return key.replace(/^heritage_/, "");
}

/** Résout un segment d'URL vers son vault, ou `null` si inconnu. */
export function getHeritageVaultBySlug(slug: string): HeritageVault | null {
  return HERITAGE_VAULTS.find((vault) => heritageVaultSlug(vault.key) === slug) ?? null;
}

/** Les 29 courbes de prix du gardien. ⚠️ Les OFFRES, elles, n'existent pas. */
export const KEEPER_OFFER_FORMULAS: HeritageKeeperOfferFormula[] =
  HERITAGE_EXTRACT.keeperOfferFormulas;

const OFFER_BY_ID = new Map(KEEPER_OFFER_FORMULAS.map((o) => [o.id, o]));

// ═════════════════════════════════════════════════════════════════════════════
// État possédé
// ═════════════════════════════════════════════════════════════════════════════

/**
 * Un vault possédé.
 *
 * ⚠️ PAS de champ `era` — voir l'en-tête du module. L'ère pertinente est celle
 * du joueur au moment du rendu, passée en argument à `resolveHeritageVault`.
 */
export interface OwnedHeritageVault {
  /** Clé primaire — l'identité du game design, pas la clé de registre. */
  themeId: string;
  /** 1 … `maxLevel`. */
  level: number;
  /** Rang de réputation du gardien de CE thème. 1 = rang de départ. */
  keeperReputationLevel: number;
  /** Points accumulés vers le rang suivant. */
  keeperReputationPoints: number;
  /**
   * Xp accumulée vers le PROCHAIN niveau du vault. Suivi manuel — le jeu ne
   * verse pas cette xp via une API lisible, le joueur la reporte lui-même
   * (même statut que `keeperReputationPoints`). Distinct de la simulation de
   * l'onglet Sacrifice, qui est éphémère et ne touche jamais cet état.
   */
  xpProgress: number;
  /** `slotId` → `effectId`. Un slot vide n'a pas d'entrée. */
  equipped: Record<string, string>;
  /** `offerId` → nombre d'achats. Portée : voir `KEEPER_PURCHASE_COUNT_SCOPE`. */
  keeperPurchases: Record<string, number>;
}

/** Un état vierge, pour un vault qu'on vient de débloquer. */
export function emptyOwnedHeritageVault(themeId: string): OwnedHeritageVault {
  return {
    themeId,
    level: 1,
    keeperReputationLevel: 1,
    keeperReputationPoints: 0,
    xpProgress: 0,
    equipped: {},
    keeperPurchases: {},
  };
}

// ═════════════════════════════════════════════════════════════════════════════
// Progression
// ═════════════════════════════════════════════════════════════════════════════

/**
 * Coût pour passer d'un niveau au suivant.
 *
 * ⚠️ Indexé par le niveau de DÉPART (`entityLevel` = le niveau déclaré), comme
 * les barèmes de montée des bâtiments évolutifs. Rend `null` au niveau maximal :
 * on ne quitte pas le dernier niveau.
 */
export interface HeritageUpgradeCost {
  fromLevel: number;
  toLevel: number;
  /** Xp, c'est-à-dire des jetons d'évolution (1 jeton = 1 xp, 41/41). */
  xp: number;
}

function readScheme(scheme: HeritageLevelScheme, fromLevel: number): number | null {
  return scheme.perLevel[fromLevel - 1] ?? null;
}

export function getHeritageUpgradeCost(key: string, level: number): HeritageUpgradeCost | null {
  const extract = EXTRACT_BY_KEY.get(key);
  if (extract === undefined) return null;
  const from = Math.trunc(level);
  if (from < 1 || from >= extract.maxLevel) return null;
  const xp = readScheme(extract.xpPerLevel, from);
  return xp === null ? null : { fromLevel: from, toLevel: from + 1, xp };
}

/** Xp cumulée pour amener un vault du niveau 1 à `level`. */
export function getHeritageCumulativeXp(key: string, level: number): number | null {
  const extract = EXTRACT_BY_KEY.get(key);
  if (extract === undefined) return null;
  const target = Math.trunc(level);
  if (target <= 1) return 0;
  return extract.xpPerLevel.cumulative[Math.min(target, extract.maxLevel) - 2] ?? null;
}

/**
 * Points de réputation pour passer du rang `reputationLevel` au suivant.
 *
 * Le barème (`5 × entityLevel`) est identique sur les 13 vaults. Au-delà du
 * dernier rang extrait, la formule est prolongée — le game design ne déclare
 * aucun plafond (convention (b)).
 */
export function getKeeperReputationCost(key: string, reputationLevel: number): number | null {
  const extract = EXTRACT_BY_KEY.get(key);
  if (extract === undefined) return null;
  const from = Math.max(Math.trunc(reputationLevel), 1);
  const tabulated = readScheme(extract.keeperReputationPerLevel, from);
  if (tabulated !== null) return tabulated;
  return Math.trunc(
    evaluateLuaFormula(extract.keeperReputationPerLevel.luaScript, { entityLevel: from }),
  );
}

/**
 * Rang de gardien observable en jeu. Distinct de `vault.maxLevel` (60), qui ne
 * borne que le niveau du vault : le barème de réputation extrait s'arrête
 * aussi à 60, mais `keeperAmplifierMultiplier`/`getKeeperReputationCost`
 * prolongent la formule Lua au-delà — le rang du gardien monte réellement
 * jusqu'à 99. Bornage d'AFFICHAGE seulement (sélecteurs de niveau) : le calcul
 * lui-même (`computeTargetKeeperLevel`) ne s'arrête jamais dessus.
 */
export const HERITAGE_KEEPER_MAX_REPUTATION_LEVEL = 99;

/**
 * ⚠️ GARDE-FOU D'ITÉRATIONS, PAS UN PLAFOND DE RANG. `vault.maxLevel` borne le
 * NIVEAU du vault (60), pas le rang du gardien : la formule Lua se prolonge
 * au-delà (voir `getKeeperReputationCost`) et le rang observable en jeu monte
 * jusqu'à 99 (`HERITAGE_KEEPER_MAX_REPUTATION_LEVEL` ci-dessus, propre à
 * l'affichage). La boucle ci-dessous s'arrête donc seulement quand le budget
 * est épuisé ; ce plafond ne protège que contre une formule dégénérée (coût
 * nul ou décroissant), jamais atteint en pratique.
 */
const MAX_KEEPER_LEVEL_ITERATIONS = 500;

/**
 * Le rang de gardien atteint en encaissant `points` depuis `fromLevel` — même
 * mécanique de report que `computeTargetVaultLevel`, appliquée au barème de
 * réputation du gardien plutôt qu'à l'xp du vault. `points` est la position
 * ABSOLUE sur la barre (comme `xpProgress`), pas un delta : elle peut dépasser
 * le palier courant, auquel cas la boucle enchaîne les rangs.
 */
export function computeTargetKeeperLevel(
  key: string,
  fromLevel: number,
  points: number,
): HeritageLevelGain | null {
  if (EXTRACT_BY_KEY.get(key) === undefined) return null;

  const start = Math.max(Math.trunc(fromLevel), 1);
  let level = start;
  let budget = Math.max(Math.trunc(points), 0);
  let spent = 0;
  for (let i = 0; i < MAX_KEEPER_LEVEL_ITERATIONS; i += 1) {
    const cost = getKeeperReputationCost(key, level);
    if (cost === null || cost > budget) break;
    budget -= cost;
    spent += cost;
    level += 1;
  }
  return { targetLevel: level, levelsGained: level - start, spent, remaining: budget };
}

/**
 * Prix d'une offre du gardien au `purchaseCount`-ième achat.
 *
 * ⚠️ Ne dit RIEN de ce qui s'échange : le game design ne porte que la courbe de
 * prix. Signe négatif = ce que le joueur donne (cf. `direction`).
 */
export function keeperOfferValue(
  offerId: string,
  purchaseCount: number,
  era: EraCode,
): number | null {
  const offer = OFFER_BY_ID.get(offerId);
  if (offer === undefined) return null;
  const age = GAME_DESIGN_AGE_BY_ERA.get(era);
  if (age === undefined) return null;
  return evaluateLuaFormula(offer.luaScript, {
    keeperPurchaseCount: Math.max(Math.trunc(purchaseCount), 0),
    playerAgeOrder: HERITAGE_EXTRACT.playerAgeOrderByAge[age] ?? 0,
  });
}

// ═════════════════════════════════════════════════════════════════════════════
// Résolution
// ═════════════════════════════════════════════════════════════════════════════

/** Un effet résolu au couple (ère du joueur, niveau du vault). */
export interface ResolvedHeritageBonus {
  type: string;
  label: string;
  /** `null` quand le game design ne dit rien à ce niveau — pas « zéro ». */
  value: number | null;
  /**
   * `value` amplifiée par le rang de gardien — convention (b).
   * Rapport multiplicatif : `value × (1 + multiplicateur)`.
   *
   * ⚠️ Égale à `value` sur les types de `KEEPER_AMPLIFIER_EXEMPT_TYPES`
   * (compteurs discrets, convention (b bis)) — jamais `null` pour autant.
   */
  amplified: number | null;
  format: BuildingBonusFormat;
  scope: BuildingBonusScope | null;
  instance: number;
  /** Ressources produites, en clé projet. Vide hors production. */
  resources: string[];
  periodSeconds: number | null;
}

export interface ResolvedHeritageEffect {
  id: string;
  minLevel: number;
  group: HeritageEffectGroup;
  /** Le niveau du vault atteint `minLevel`. */
  unlocked: boolean;
  /** Slot dans lequel l'effet est placé, `null` s'il ne l'est pas. */
  equippedInSlotId: string | null;
  lockSeconds: number | null;
  periodSeconds: number | null;
  bonuses: ResolvedHeritageBonus[];
  /** L'arbre de coffre applicable au niveau courant, `null` hors coffre. */
  rewards: HeritageRewardTier | null;
  /**
   * L'arbre de coffre au niveau où CE PALIER se débloque (`effect.minLevel`),
   * pas au niveau courant du joueur.
   *
   * ⚠️ Sans lui, un tableau qui liste TOUS les paliers (`OverviewTable`) perd
   * les lignes des paliers non encore atteints : `rewards` vaut `null` tant que
   * `clamped < minLevel du premier sous-palier du coffre`, et la ligne
   * disparaît silencieusement du tableau au lieu de prévisualiser le coffre.
   */
  rewardsAtUnlock: HeritageRewardTier | null;
}

export interface ResolvedHeritageSlot extends HeritageSlotExtract {
  /** Le niveau du vault atteint `minLevel` — le slot devient ouvrable. */
  reachable: boolean;
  /** Un effet y est placé. */
  effectId: string | null;
}

export interface ResolvedHeritageKeeper {
  reputationLevel: number;
  reputationPoints: number;
  /** Points requis pour le rang suivant. */
  pointsToNextLevel: number | null;
  /** Convention (b) : +0,59 au rang 60, à composer multiplicativement. */
  amplifierMultiplier: number;
}

/**
 * ⚠️ `slots` et `effects` sont REMPLACÉS, pas étendus : ils portent ici l'état
 * résolu (déblocage, effet placé, valeurs au niveau courant) et non la donnée de
 * catalogue. D'où l'`Omit` — un `extends` nu ferait mentir le type.
 */
export interface ResolvedHeritageVault extends Omit<HeritageVault, "slots" | "effects"> {
  level: number;
  era: EraCode;
  atMaxLevel: boolean;
  upgradeCost: HeritageUpgradeCost | null;
  /** `xpProgress` borné à `[0, upgradeCost.xp]` — jamais négatif ni au-delà du palier. */
  xpProgress: number;
  slots: ResolvedHeritageSlot[];
  effects: ResolvedHeritageEffect[];
  keeper: ResolvedHeritageKeeper;
  /** Les bonus des effets EFFECTIVEMENT placés dans un slot atteignable. */
  activeBonuses: ResolvedHeritageBonus[];
}

/** Le palier de coffre applicable à `level` — lecture par palier (C9). */
function tierAt(tiers: HeritageRewardTier[], level: number): HeritageRewardTier | null {
  let current: HeritageRewardTier | null = null;
  for (const tier of [...tiers].sort((a, b) => a.minLevel - b.minLevel)) {
    if (tier.minLevel > level) break;
    current = tier;
  }
  return current;
}

function resolveOne(
  bonus: BuildingBonus,
  age: string,
  level: number,
  multiplier: number,
): ResolvedHeritageBonus {
  const reading = resolveBonus(bonus, age, level);
  const value = reading?.amount ?? null;
  return {
    type: bonus.type,
    label: getBonusLabel(bonus.type, bonus.instance),
    value,
    amplified: amplifyBonusValue(bonus.type, value, multiplier),
    format: bonus.format,
    scope: bonus.scope,
    instance: bonus.instance,
    resources: reading?.resources ?? [],
    periodSeconds: bonus.periodSeconds,
  };
}

/**
 * Tout ce qu'un vault rend pour un état donné.
 *
 * Rend `null` si la clé est inconnue. `level` et le rang de gardien sont BORNÉS
 * plutôt que refusés : une valeur hors plage vient d'un état utilisateur, pas
 * d'une erreur de programmation.
 *
 * ⚠️ `era` est l'ère COURANTE du joueur, jamais une ère stockée sur le vault.
 */
export function resolveHeritageVault(
  key: string,
  level: number,
  era: EraCode,
  state: Pick<
    OwnedHeritageVault,
    "equipped" | "keeperReputationLevel" | "keeperReputationPoints" | "xpProgress"
  > = {
    equipped: {},
    keeperReputationLevel: 1,
    keeperReputationPoints: 0,
    xpProgress: 0,
  },
): ResolvedHeritageVault | null {
  const vault = BY_KEY.get(key);
  if (vault === undefined) return null;
  const age = GAME_DESIGN_AGE_BY_ERA.get(era);
  if (age === undefined) return null;

  const clamped = Math.min(Math.max(Math.trunc(level), 1), vault.maxLevel);
  const reputationLevel = Math.max(Math.trunc(state.keeperReputationLevel), 1);
  const multiplier = keeperAmplifierMultiplier(reputationLevel);

  const slotByEffect = new Map<string, string>();
  for (const [slotId, effectId] of Object.entries(state.equipped)) {
    slotByEffect.set(effectId, slotId);
  }
  const reachableSlots = new Set(
    vault.slots.filter((slot) => slot.minLevel <= clamped).map((slot) => slot.id),
  );

  const effects: ResolvedHeritageEffect[] = vault.effects.map((effect) => {
    const slotId = slotByEffect.get(effect.id) ?? null;
    return {
      id: effect.id,
      minLevel: effect.minLevel,
      group: effect.group,
      unlocked: effect.minLevel <= clamped,
      equippedInSlotId: slotId,
      lockSeconds: effect.lockSeconds,
      periodSeconds: effect.periodSeconds,
      bonuses: effect.bonuses.map((bonus) => resolveOne(bonus, age, clamped, multiplier)),
      rewards: tierAt(effect.rewards, clamped),
      rewardsAtUnlock: tierAt(effect.rewards, effect.minLevel),
    };
  });

  const activeBonuses = effects
    .filter(
      (effect) =>
        effect.unlocked &&
        effect.equippedInSlotId !== null &&
        reachableSlots.has(effect.equippedInSlotId),
    )
    .flatMap((effect) => effect.bonuses);

  const upgradeCost = getHeritageUpgradeCost(key, clamped);

  return {
    ...vault,
    level: clamped,
    era,
    atMaxLevel: clamped >= vault.maxLevel,
    upgradeCost,
    xpProgress: Math.min(
      Math.max(Math.trunc(state.xpProgress), 0),
      upgradeCost?.xp ?? 0,
    ),
    slots: vault.slots.map((slot) => ({
      ...slot,
      reachable: slot.minLevel <= clamped,
      effectId: state.equipped[slot.id] ?? null,
    })),
    effects,
    keeper: {
      reputationLevel,
      reputationPoints: Math.max(Math.trunc(state.keeperReputationPoints), 0),
      pointsToNextLevel: getKeeperReputationCost(key, reputationLevel),
      amplifierMultiplier: multiplier,
    },
    activeBonuses,
  };
}

/** Même chose au départ de l'état stocké. L'ère reste celle du JOUEUR. */
export function resolveOwnedHeritageVault(
  owned: OwnedHeritageVault,
  era: EraCode,
): ResolvedHeritageVault | null {
  const vault = BY_THEME.get(owned.themeId);
  if (vault === undefined) return null;
  return resolveHeritageVault(vault.key, owned.level, era, owned);
}

// ═════════════════════════════════════════════════════════════════════════════
// Jetons ↔ niveaux
//
// Deux barèmes distincts se rencontrent ici, et les confondre ferait mentir
// tous les chiffres de l'onglet Sacrifice :
//
//  - celui d'un ÉVOLUTIF, en `EvolutionToken` propres au bâtiment
//    (`getUpgradeCost` du domaine évolutifs) — ce qu'un niveau a coûté, donc ce
//    que le démonter rend ;
//  - celui du VAULT, en xp (`getHeritageUpgradeCost`) — ce qu'un niveau de vault
//    demande.
//
// Le pont entre les deux est déjà tranché : 1 jeton = 1 xp (`heritageXpPerUnit`
// vaut 1 sur les 41 jetons éligibles). Rien n'est réouvert ici.
// ═════════════════════════════════════════════════════════════════════════════

/** Un palier de montée d'évolutif : ce qu'il faut pour quitter `fromLevel`. */
export interface HeritageTokenTier {
  fromLevel: number;
  toLevel: number;
  tokens: number;
}

/**
 * Tous les paliers de montée d'un évolutif, du niveau 0 (sa CONSTRUCTION) à
 * `maxLevel - 1`.
 *
 * ⚠️ LE PALIER 0→1 EST LA CONSTRUCTION, PAS UNE MONTÉE. `getConstructionCost`
 * facture le jeton dépensé pour obtenir le bâtiment — un coût réel, mais que
 * le domaine évolutifs (`getUpgradeCost`) ne connaît pas, puisqu'il n'indexe
 * que les montées. Il rejoint les autres paliers ici pour qu'un démontage
 * intégral (`tokensFromBuildingLevels` jusqu'à 0) restitue le VRAI total
 * dépensé, construction comprise — pas seulement les montées.
 *
 * Rend un tableau vide sur une clé inconnue — l'appelant affiche « aucun
 * palier », il n'a pas à distinguer l'inconnu du sans-palier.
 */
export function getUpgradeCostTiers(evolvingKey: string): HeritageTokenTier[] {
  const building = getEvolvingBuilding(evolvingKey);
  if (building === null) return [];
  const tiers: HeritageTokenTier[] = [];
  const construction = getEvolvingConstructionCost(evolvingKey);
  if (construction !== null) {
    tiers.push({ fromLevel: 0, toLevel: 1, tokens: construction });
  }
  for (let level = 1; level < building.maxLevel; level += 1) {
    const cost = getEvolvingUpgradeCost(evolvingKey, level);
    if (cost === null) continue;
    tiers.push({
      fromLevel: cost.fromLevel,
      toLevel: cost.toLevel,
      tokens: cost.evolution_tokens,
    });
  }
  return tiers;
}

/** Le coût pour QUITTER `level`. `null` hors barème (dernier niveau compris). */
export function resolveTierCost(tiers: HeritageTokenTier[], level: number): number | null {
  return tiers.find((tier) => tier.fromLevel === Math.trunc(level))?.tokens ?? null;
}

/**
 * Jetons rendus en démontant `levelsRemoved` niveaux depuis `currentLevel`.
 *
 * ⚠️ CONVENTION — REMBOURSEMENT INTÉGRAL, PAS UNE DONNÉE DÉCLARÉE.
 *
 * Le game design ne dit nulle part ce qu'un niveau démonté restitue ; il ne
 * déclare que le PRIX de la montée. Le taux retenu est 1:1 avec ce prix — le
 * niveau `L` rend ce qu'il a coûté de quitter `L - 1`. C'est la seule lecture
 * qui rende le sacrifice neutre à la remontée, et elle tient en cette fonction.
 *
 * `levelsRemoved` est borné à `currentLevel` : le démontage peut aller jusqu'au
 * niveau 0, c'est-à-dire jusqu'à la construction elle-même — `tiers` porte ce
 * palier 0→1 depuis `getUpgradeCostTiers`. Un démontage total rend donc le
 * TOTAL de jetons jamais dépensés sur ce bâtiment, construction comprise, pas
 * seulement ses montées.
 */
export function tokensFromBuildingLevels(
  tiers: HeritageTokenTier[],
  currentLevel: number,
  levelsRemoved: number,
): number {
  const from = Math.max(Math.trunc(currentLevel), 0);
  const removed = Math.min(Math.max(Math.trunc(levelsRemoved), 0), from);
  let total = 0;
  for (let level = from - removed; level < from; level += 1) {
    total += resolveTierCost(tiers, level) ?? 0;
  }
  return total;
}

/** Ce qu'une remontée en jetons donne : niveaux gagnés et reliquat. */
export interface HeritageLevelGain {
  targetLevel: number;
  levelsGained: number;
  spent: number;
  remaining: number;
}

/**
 * Niveaux qu'on peut REMONTER sur un évolutif avec `tokens`, depuis
 * `currentLevel`. Inverse de `tokensFromBuildingLevels`, et borné au dernier
 * palier connu — au-delà, le barème ne dit plus rien.
 */
export function levelsFromTokens(
  tiers: HeritageTokenTier[],
  currentLevel: number,
  tokens: number,
): HeritageLevelGain {
  let level = Math.max(Math.trunc(currentLevel), 1);
  let budget = Math.max(Math.trunc(tokens), 0);
  let spent = 0;
  for (;;) {
    const cost = resolveTierCost(tiers, level);
    if (cost === null || cost > budget) break;
    budget -= cost;
    spent += cost;
    level += 1;
  }
  return {
    targetLevel: level,
    levelsGained: level - Math.max(Math.trunc(currentLevel), 1),
    spent,
    remaining: budget,
  };
}

/**
 * Xp à verser pour amener un vault de `fromLevel` à `toLevel`.
 *
 * Rend `null` sur une clé inconnue ou un barème muet, `0` quand `toLevel` n'est
 * pas au-dessus de `fromLevel` — descendre un vault n'a pas de prix négatif.
 */
export function tokensToVaultLevel(
  key: string,
  fromLevel: number,
  toLevel: number,
): number | null {
  const from = getHeritageCumulativeXp(key, fromLevel);
  const to = getHeritageCumulativeXp(key, toLevel);
  if (from === null || to === null) return null;
  return Math.max(to - from, 0);
}

/**
 * Le niveau qu'un vault atteint en encaissant `xp` depuis `fromLevel`.
 *
 * `remaining` est le reliquat vers le palier suivant, pas une perte : c'est ce
 * que la barre de progression affiche après le sacrifice. Au niveau maximal il
 * n'y a plus de palier, et tout le reliquat reste tel quel.
 */
export function computeTargetVaultLevel(
  key: string,
  fromLevel: number,
  xp: number,
): HeritageLevelGain | null {
  const vault = getHeritageVault(key);
  if (vault === null) return null;

  const start = Math.min(Math.max(Math.trunc(fromLevel), 1), vault.maxLevel);
  let level = start;
  let budget = Math.max(Math.trunc(xp), 0);
  let spent = 0;
  for (;;) {
    const cost = getHeritageUpgradeCost(key, level);
    if (cost === null || cost.xp > budget) break;
    budget -= cost.xp;
    spent += cost.xp;
    level += 1;
  }
  return { targetLevel: level, levelsGained: level - start, spent, remaining: budget };
}

// ═════════════════════════════════════════════════════════════════════════════
// Loadout — quels effets sont plaçables, placés, ou en réserve
//
// Ces quatre listes se dérivent TOUTES de `ResolvedHeritageVault` : `unlocked`
// et `equippedInSlotId` y sont déjà calculés, et `activeBonuses` applique déjà
// la règle « slot atteignable ». Rien ici ne relit l'état brut du joueur.
// ═════════════════════════════════════════════════════════════════════════════

/** Les effets débloqués au niveau courant, filtrés par groupe si demandé. */
export function getUnlockedEffects(
  vault: ResolvedHeritageVault,
  group?: HeritageEffectGroup,
): ResolvedHeritageEffect[] {
  return vault.effects.filter(
    (effect) => effect.unlocked && (group === undefined || effect.group === group),
  );
}

/**
 * Les effets EFFECTIVEMENT appliqués : débloqués ET placés dans un slot lui-même
 * atteignable. Un effet placé dans un slot verrouillé ne compte pas — c'est la
 * même règle que `activeBonuses`.
 */
export function getEquippedEffects(vault: ResolvedHeritageVault): ResolvedHeritageEffect[] {
  const reachable = new Set(
    vault.slots.filter((slot) => slot.reachable).map((slot) => slot.id),
  );
  return vault.effects.filter(
    (effect) =>
      effect.unlocked &&
      effect.equippedInSlotId !== null &&
      reachable.has(effect.equippedInSlotId),
  );
}

/** Les effets débloqués qui ne sont appliqués nulle part — la réserve. */
export function getUnequippedUnlockedEffects(
  vault: ResolvedHeritageVault,
): ResolvedHeritageEffect[] {
  const equipped = new Set(getEquippedEffects(vault).map((effect) => effect.id));
  return getUnlockedEffects(vault).filter((effect) => !equipped.has(effect.id));
}

/**
 * Les effets proposables pour `slotId` : ceux de son groupe, débloqués, et pas
 * déjà placés dans un AUTRE slot. L'effet du slot courant reste dans la liste —
 * rouvrir le sélecteur doit montrer ce qui y est déjà.
 *
 * Rend un tableau vide quand le slot est inconnu ou pas encore atteignable.
 */
export function getSelectableEffects(
  vault: ResolvedHeritageVault,
  slotId: string,
): ResolvedHeritageEffect[] {
  const slot = vault.slots.find((candidate) => candidate.id === slotId);
  if (slot === undefined || !slot.reachable) return [];
  return getUnlockedEffects(vault, slot.group).filter(
    (effect) => effect.equippedInSlotId === null || effect.equippedInSlotId === slotId,
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// Bâtiments évolutifs éligibles
// ═════════════════════════════════════════════════════════════════════════════

/** Un évolutif dont les jetons alimentent un vault, avec son barème de montée. */
export interface HeritageEligibleBuilding {
  /** `BuildingDefinition.id` racine — l'identité que porte le vault. */
  buildingId: string;
  /** Clé du domaine évolutifs, ex. `evolving_grand_smithy`. */
  key: string;
  name: string;
  maxLevel: number;
  /** `EvolutionToken|Building_…` — le jeton, pas le bâtiment. */
  tokenDefinitionId: string;
  tiers: HeritageTokenTier[];
}

/**
 * Les évolutifs éligibles d'un vault, croisés avec le domaine Bâtiments.
 *
 * Un identifiant que le domaine évolutifs ne connaît pas est IGNORÉ plutôt que
 * rendu à moitié : la liste ne contient que des bâtiments dont le barème est
 * lisible, sinon le total de jetons serait faux sans le dire.
 */
export function getEligibleEvolvingBuildings(key: string): HeritageEligibleBuilding[] {
  const extract = EXTRACT_BY_KEY.get(key);
  if (extract === undefined) return [];
  const tokenByBuilding = new Map(
    extract.eligibleResourceIds.map((id) => [id.split("|")[1] ?? id, id]),
  );
  return extract.eligibleEvolvingBuildingIds.flatMap((buildingId) => {
    const building = getEvolvingBuildingByDefinitionId(buildingId);
    if (building === null) return [];
    return [
      {
        buildingId,
        key: building.key,
        name: building.name,
        maxLevel: building.maxLevel,
        tokenDefinitionId:
          tokenByBuilding.get(buildingId) ?? `EvolutionToken|${buildingId}`,
        tiers: getUpgradeCostTiers(building.key),
      },
    ];
  });
}

// ═════════════════════════════════════════════════════════════════════════════
// Comparaison de deux niveaux d'un même vault
// ═════════════════════════════════════════════════════════════════════════════

/**
 * Un bonus rattaché à son effet porteur.
 *
 * ⚠️ L'effet fait PARTIE de l'identité. `instance` ne compte les répétitions
 * qu'au sein d'un même porteur : deux effets d'un même vault portent chacun un
 * `goods_output` d'instance 1, et donc le même libellé. Apparier un avant/après
 * sur le seul libellé les confondrait.
 */
export interface HeritageVaultBonusLine extends ResolvedHeritageBonus {
  effectId: string;
  /** Identité stable au sein du vault — clé de rendu et d'appariement. */
  key: string;
}

/**
 * Les bonus d'un vault à deux niveaux, pour un avant/après.
 *
 * ⚠️ Porte sur TOUS les effets débloqués, PAS sur les seuls effets équipés. Le
 * comparateur répond à « qu'est-ce que ce niveau ouvre », pas à « qu'est-ce que
 * ma configuration rend aujourd'hui » — un effet débloqué mais laissé en
 * réserve reste un gain du palier. `activeBonuses` répond à l'autre question.
 */
export function diffVaultLevels(
  key: string,
  beforeLevel: number,
  afterLevel: number,
  era: EraCode,
): { before: HeritageVaultBonusLine[]; after: HeritageVaultBonusLine[] } | null {
  const before = resolveHeritageVault(key, beforeLevel, era);
  const after = resolveHeritageVault(key, afterLevel, era);
  if (before === null || after === null) return null;
  const bonusesOf = (vault: ResolvedHeritageVault) =>
    getUnlockedEffects(vault).flatMap((effect) =>
      effect.bonuses.map((bonus) => ({
        ...bonus,
        effectId: effect.id,
        key: `${effect.id}#${bonusKey(bonus)}`,
      })),
    );
  return { before: bonusesOf(before), after: bonusesOf(after) };
}

// ═════════════════════════════════════════════════════════════════════════════
// Affichage — ce que `resolvers/bonus.ts` ne couvre pas
//
// `getBonusLabel` et `formatBonusValue` restent le point d'entrée du formatage
// des BONUS : rien n'est redéclaré ici pour eux. Ne manquaient que deux choses,
// toutes deux propres aux COFFRES, que le vocabulaire de bonus ne connaît pas.
// ═════════════════════════════════════════════════════════════════════════════

/**
 * Une probabilité, pas un gain : ni signe, ni `+`.
 *
 * `formatBonusValue("percent", …)` préfixe un `+`, ce qui est juste pour un
 * boost et faux pour une chance de tirage — d'où cette seconde fonction plutôt
 * qu'un drapeau sur la première.
 */
export function formatChancePercent(percent: number): string {
  const rounded = Math.round(percent * 10) / 10;
  return `${Number.isInteger(rounded) ? rounded : rounded.toFixed(1)} %`;
}

/**
 * `InventoryItem_RefillBarracks_Infantry` → « Refill Barracks Infantry ».
 *
 * Repli d'affichage quand la loca ne dit rien (`label: ""`, cf. C7). Le préfixe
 * de famille est retiré : il nomme le type du DTO, pas la récompense.
 */
export function humanizeDefinitionId(definitionId: string): string {
  const withoutNamespace = definitionId.split(/[.|]/).pop() ?? definitionId;
  const words = withoutNamespace
    .replace(/^(InventoryItem|SelectionKit|Unit|Relic|Building|Reward)_/, "")
    .split(/[_\s]+/)
    .flatMap((part) => part.split(/(?<=[a-z0-9])(?=[A-Z])/))
    .filter((part) => part.length > 0);
  return words.join(" ");
}

/**
 * Repli d'affichage pour une ressource FIXE (jamais un rang de bien, qui
 * dépend du classement du joueur — cf. `resolveRankGood` côté UI). Un
 * `dynamicActionChange` qui verse `coins`/`food` n'a jamais de `label` loca
 * (C7) : sans ce repli, `resolveChestRewardLabel` humaniserait son PROPRE id
 * technique (`Dac_EvoChest_Coins_300_S_2` → « Dac Evo Chest Coins 300 S 2 »)
 * au lieu du nom de ce qu'il verse — jamais un texte qu'on retrouve en jeu.
 */
const FIXED_RESOURCE_LABELS: Record<string, string> = {
  coins: "Coins",
  food: "Food",
  research_points: "Research Points",
};

/**
 * ⚠️ REPLI SUR UN NOM, PAS UN CHAMP TYPÉ — même limite que `chestRewardAmount`
 * (`components/heritage/effect-display.ts`) pour le montant. Certains
 * `dynamicActionChange` de l'extraction (Mali Empire, Polynesian, Thai) n'ont
 * VRAIMENT aucune ressource résolvable : ni `curve`/`ageCurve` (donc jamais de
 * `resources` résolues), ni la moindre table dans le game design — leur
 * ressource n'existe QUE dans le suffixe de leur `definitionId`
 * (`Dac_Reward_EventPolynesia_Evolving_DrumTower_1_Food`…). Sans ce dernier
 * recours, ils humaniseraient leur PROPRE id technique en label au lieu du nom
 * de ce qu'ils versent.
 *
 * N'intervient qu'en dernier recours (cf. `resolveChestRewardLabel`) : la
 * ressource RÉSOLUE (`resources`, via `ageCurve`/`curve`) est TOUJOURS
 * préférée quand elle existe — `Dac_EvoChest_Coins_300_S_2` verse bien des
 * `coins`, mais ne finit jamais en `_Coins` : deviner sur le suffixe seul
 * l'aurait manqué.
 *
 * Ne couvre PAS `..._PreviousEraGoods` / `..._PEGood{1,2,3}` / `..._Good{1,2,3}`
 * (World Fair, ATH) : ceux-là versent un BIEN dépendant du classement du
 * joueur, une résolution qui a besoin de `selections` — hors de portée d'un
 * resolver qui ne les reçoit pas. Ils restent humanisés, comme avant.
 */
const DAC_SUFFIX_RESOURCE: [pattern: RegExp, resource: string][] = [
  [/_Food$/, "food"],
  [/_Coins$/, "coins"],
];

/**
 * La ressource FIXE d'un nœud — la ressource RÉSOLUE d'abord (`resources`, qui
 * vient de `reading` côté appelant quand `ageCurve`/`curve` existe), le
 * suffixe de son id en tout dernier recours.
 */
function fixedResourceOf(node: HeritageRewardNode, resources: string[]): string | null {
  if (resources.length === 1) return resources[0];
  if (node.kind !== "dynamicActionChange" || node.definitionId === null) return null;
  const definitionId = node.definitionId;
  const match = DAC_SUFFIX_RESOURCE.find(([pattern]) => pattern.test(definitionId));
  return match?.[1] ?? null;
}

/**
 * ⚠️ UN CONTENEUR (`group`/`mysteryChest`/`lootContainer`) N'A JAMAIS DE
 * LABEL LOCA — 100 % des coffres extraits, vérifié dans `chestRewardIcon`
 * (`components/heritage/effect-display.ts`). D'ordinaire ça ne se voit jamais
 * : `unwrap()` (`chest-content-section.tsx`) déballe tout conteneur avant
 * affichage. Mais un coffre RÉUTILISÉ comme UNE branche du tirage d'un autre
 * (le ticket de recharge de caserne posé tel quel dans Mali Empire Effect_5
 * et dans le Joker Aztec/Halloween) survit au déballage — c'est une entrée
 * parmi plusieurs à ce niveau, jamais l'unique. Sans ce repli, il humaniserait
 * son propre id (« All Age Random Refill Barracks 1 »), jamais un texte du
 * jeu. `lootContainer` reste distingué (« Bundle ») : un lot GARANTI n'a rien
 * d'un tirage, contrairement au `mysteryChest`.
 */
function containerLabel(node: HeritageRewardNode): string {
  if (node.kind === "lootContainer") return "Bundle";
  if (node.kind === "group") {
    const [only] = node.children;
    return only === undefined ? "Mystery reward" : containerLabel(only);
  }
  return "Mystery reward";
}

const CONTAINER_KINDS = new Set<HeritageRewardKind>(["group", "mysteryChest", "lootContainer"]);

/**
 * Le libellé d'une récompense de coffre : la loca d'abord, l'identifiant
 * ensuite. `resources` par défaut à `node.resources` (le champ statique de
 * l'extraction) — l'appelant qui a RÉSOLU une ressource par `ageCurve`/`curve`
 * (`resolveChestRewards`) passe cette valeur-là à la place : c'est elle qui
 * doit décider du libellé, jamais le champ statique quand les deux existent
 * et divergent.
 */
export function resolveChestRewardLabel(
  node: HeritageRewardNode,
  resources: string[] = node.resources,
): string {
  if (node.label !== "") return node.label;
  if (CONTAINER_KINDS.has(node.kind)) return containerLabel(node);
  const resource = fixedResourceOf(node, resources);
  const fixed = resource === null ? undefined : FIXED_RESOURCE_LABELS[resource];
  if (fixed !== undefined) return fixed;
  if (node.definitionId !== null) return humanizeDefinitionId(node.definitionId);
  return node.id === null ? node.kind : humanizeDefinitionId(node.id);
}

/** Une récompense de coffre résolue au niveau courant, prête à afficher. */
export interface ResolvedChestReward {
  kind: HeritageRewardKind;
  /** `HeritageRewardNode.id` — jamais un `definitionId` (voir ci-dessous), mais
   * le seul identifiant STABLE d'un nœud conteneur (`group`/`mysteryChest`/
   * `lootContainer`, dont `definitionId` vaut toujours `null`). Sert de clé à
   * la correspondance icône par coffre côté UI (`chestRewardIcon`). */
  id: string | null;
  definitionId: string | null;
  label: string;
  /** Quantité versée. `null` quand le game design n'en déclare pas. */
  amount: number | null;
  /** Poids BRUT du tirage, tel qu'écrit dans le game design. `null` hors tirage. */
  chance: number | null;
  /** Poids ramené à 100 sur la fratrie. `null` hors tirage — voir ci-dessous. */
  chancePercent: number | null;
  /** L'entrée est conditionnée : retirée du tirage quand la condition ne passe pas. */
  conditional: boolean;
  /** Ressources versées, en clé projet. Vide hors `dynamicActionChange`. */
  resources: string[];
  children: ResolvedChestReward[];
}

/**
 * L'arbre d'un coffre, résolu au couple (ère, niveau).
 *
 * ⚠️ CONVENTION — RENORMALISATION DES POIDS DE TIRAGE.
 *
 * `HeritageRewardNode.chance` est un POIDS brut, et les poids d'une fratrie ne
 * somment pas à 100 (`[33,33,33,3,3]` = 105) : les entrées à `requirements`
 * sortent du tirage quand elles ne s'appliquent pas, et le jeu renormalise à
 * l'exécution. L'extraction ne le fait délibérément pas.
 *
 * Ce module renormalise sur la fratrie ENTIÈRE, conditionnées comprises : rien
 * ici ne sait quelles conditions du joueur passent. Les entrées concernées sont
 * marquées `conditional` pour que l'affichage puisse le dire — leur pourcentage
 * est un plancher, pas la chance réelle d'un joueur qui n'y a pas droit.
 *
 * Les pourcentages d'un ENFANT sont conditionnels à l'obtention de son parent,
 * jamais combinés avec lui.
 *
 * ⚠️ LES RELIQUES SONT RETIRÉES DU TIRAGE AFFICHÉ, PAS SEULEMENT MASQUÉES.
 *
 * Un tirage de coffre qui verse une relique (Celtic, ATH) la porte toujours
 * en `requirements: [relicNotUnlocked]` : un bonus de RATTRAPAGE tant que le
 * joueur n'a pas encore cette relique précise, jamais une entrée que le jeu
 * met en avant dans l'aperçu « CHEST » (vérifié en jeu : la fenêtre ne liste
 * QUE les biens, jamais les reliques). Les garder ferait deux choses fausses
 * à la fois : les montrer dans une liste censée refléter l'aperçu du jeu, et
 * diluer le pourcentage des biens visibles (3 biens + 2 reliques à 31,4/2,9 %
 * au lieu de 3 biens à 33,29 % chacun, l'écran réel).
 *
 * D'où l'exclusion AVANT le calcul de `total` — pas un filtre après coup sur
 * la liste déjà renormalisée, qui laisserait le poids des reliques diluer les
 * pourcentages des biens restants.
 *
 * ⚠️ `minAge`/`maxAge` SONT ÉVALUÉS, PAS SEULEMENT SIGNALÉS.
 *
 * Contrairement à `research`/`relicNotUnlocked` (l'état du joueur, hors de
 * portée d'un resolver qui ne le reçoit pas), une contrainte d'ÂGE se compare
 * à l'ère demandée — ce module LA REÇOIT (`era`). Deux cas, jamais un simple
 * badge « conditionnel » :
 *  - la contrainte ÉCHOUE (ex. `maxAge: StoneAge` reçu pour un joueur en
 *    Renaissance tardive, cf. Japan `CollectorBuildings` — une valeur de
 *    RATTRAPAGE tant qu'aucune pièce de collection n'existe encore) → l'entrée
 *    sort du tirage, comme une relique : elle ne peut tout simplement pas
 *    tomber à cette ère, la garder visible ferait miroiter un lot qu'aucun
 *    joueur à cette ère n'obtiendra jamais ;
 *  - la contrainte RÉUSSIT (ex. `minAge: BronzeAge` pour un joueur en
 *    Renaissance tardive) → elle a forcément lieu, `conditional` ne la compte
 *    plus : rien d'autre qu'une contrainte d'âge satisfaite ne justifierait de
 *    montrer « CONDITIONNEL » sur un lot garanti à cette ère.
 */
function ageRequirementSatisfied(requirement: HeritageRequirement, age: string): boolean | null {
  if (requirement.kind !== "minAge" && requirement.kind !== "maxAge") return null;
  const current = HERITAGE_EXTRACT.playerAgeOrderByAge[age];
  const target = HERITAGE_EXTRACT.playerAgeOrderByAge[requirement.value];
  if (current === undefined || target === undefined) return null;
  return requirement.kind === "minAge" ? current >= target : current <= target;
}

export function resolveChestRewards(
  tier: HeritageRewardTier | null,
  level: number,
  era: EraCode,
): ResolvedChestReward[] {
  if (tier === null) return [];
  const age = GAME_DESIGN_AGE_BY_ERA.get(era);
  if (age === undefined) return [];

  const resolveNodes = (allNodes: HeritageRewardNode[]): ResolvedChestReward[] => {
    const nodes = allNodes.filter(
      (node) =>
        node.kind !== "relic" &&
        !node.requirements.some((r) => ageRequirementSatisfied(r, age) === false),
    );
    const total = nodes.reduce((sum, node) => sum + (node.chance ?? 0), 0);
    return nodes.map((node) => {
      const reading =
        node.ageCurve !== null
          ? resolveByAgeAndLevel(node.ageCurve, age, level)
          : node.curve !== null
            ? { amount: resolveByLevel(node.curve, level), resources: node.resources }
            : null;
      const resources = reading?.resources ?? node.resources;
      return {
        kind: node.kind,
        id: node.id,
        definitionId: node.definitionId,
        label: resolveChestRewardLabel(node, resources),
        amount: reading?.amount ?? node.amount,
        chance: node.chance,
        chancePercent:
          node.chance === null || total === 0 ? null : (node.chance / total) * 100,
        // Toute contrainte d'âge survivante ici est forcément satisfaite (les
        // ratées sont sorties du tirage ci-dessus) : elle ne compte plus.
        conditional: node.requirements.some((r) => ageRequirementSatisfied(r, age) !== true),
        resources,
        children: resolveNodes(node.children),
      };
    });
  };

  return resolveNodes(tier.rewards);
}
