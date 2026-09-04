// ============================================================
// ROC Helper – Heritage Vault : forme de l'extraction générée
//
// Décrit ce que `scripts/extract/heritage.ts` produit à partir de
// `source/gamedesign.json` + `source/loca.json`.
//
// Le game design est la SEULE source de ce domaine : aucune donnée saisie à la
// main n'existe pour le Heritage Vault dans ce dépôt. Tout ce qui suit est
// dérivé du brut, à une exception près, isolée et documentée — le CATALOGUE des
// offres du gardien, qui n'existe nulle part dans le game design (voir
// `HeritageKeeperOfferFormula`).
//
// ─── Ce que le domaine ne duplique PAS ────────────────────────────────────────
//
// Les 13 bâtiments-marqueurs `Building_Heritage_*_1` sont DÉJÀ extraits par le
// domaine Bâtiments, sous `scope: "decoration"` et `chainKey`
// `City_Capital|heritage<Theme>`. Ce module n'en refait ni la forme, ni les
// coûts, ni les bonus : il n'en garde que la clé de chaîne
// (`HeritageVaultExtract.buildingChainKey`), comme pont. `scripts/diff/heritage.ts`
// vérifie ce non-recouvrement à chaque build.
//
// ─── Vocabulaire de bonus ─────────────────────────────────────────────────────
//
// Les effets sont projetés en `BuildingBonus` (data/buildings/generated/types.ts),
// exactement la même structure que les bonus des bâtiments — donc lisibles par
// `resolvers/building-curves.ts` sans adaptateur, et étiquetables par
// `resolvers/bonus.ts` sans dictionnaire parallèle. L'extracteur importe
// `BONUS_LABELS` directement plutôt que d'en recopier les clés.
//
// Références : docs/game-schema/05-wonders-reliques-heritage.md §4
//              docs/game-schema/02-dynamic.md §5.1 (table/formule), §5.2 (valueLimit)
//              docs/game-schema/00-conventions.md §C3 (int64 en string), §C9 (paliers)
// ============================================================

import type {
  BuildingAgeCurve,
  BuildingBonus,
  BuildingBonusGap,
  BuildingCurve,
} from "../../buildings/generated/types";

export type { BuildingAgeCurve, BuildingBonus, BuildingBonusGap, BuildingCurve };

// ─── Identité ─────────────────────────────────────────────────────────────────
//
// ⚠️ `HeritageVaultDefinitionDTO` N'A PAS de champ `id` (13/13). Son identité est
// `themeId`, doublée d'une correspondance 1:1 avec `buildingDefinitionId`.

/** `heritage_vault.Heritage_Celtic` — l'identité du game design. */
export type HeritageThemeId = string;

/** `heritage_celtic` — clé de registre côté projet, dérivée du `themeId`. */
export type HeritageKey = string;

/** `HeritageEffectGroupType_PRODUCTION` / `_BOOST`, en vocabulaire projet. */
export type HeritageEffectGroup = "production" | "boost";

// ─── Slots ────────────────────────────────────────────────────────────────────

/**
 * Ce qu'il faut payer pour ouvrir un slot.
 *
 * `item` = `InventoryItemCostDTO` (kits d'âge), `resource` = `resourceChanges`
 * (gemmes). Montant POSITIF : le game design écrit `-290`, on garde la dépense.
 */
export interface HeritageSlotUnlock {
  kind: "item" | "resource";
  definitionId: string;
  amount: number;
}

export interface HeritageSlotExtract {
  id: string;
  /** `slotIndex`, absent = 0 dans le game design. */
  slotIndex: number;
  /** Niveau de vault requis pour que le slot devienne ouvrable. */
  minLevel: number;
  /**
   * Groupe autorisé. `allowedGroups` est un tableau, mais il ne contient qu'une
   * seule valeur sur les 104 slots — l'extraction signale toute exception.
   */
  group: HeritageEffectGroup;
  /**
   * `premiumDuration` en secondes : le slot se referme au bout de ce délai.
   * `null` = déblocage définitif.
   */
  premiumSeconds: number | null;
  unlock: HeritageSlotUnlock | null;
}

// ─── Récompenses (arbre des coffres) ──────────────────────────────────────────

export type HeritageRewardKind =
  | "group"
  | "mysteryChest"
  | "lootContainer"
  | "dynamicActionChange"
  | "relic"
  | "inventoryItem"
  | "selectionKit"
  | "unit"
  | "resource"
  | "buildingCustomization";

export type HeritageRequirementKind =
  | "research"
  | "minAge"
  | "maxAge"
  | "relicNotUnlocked";

export interface HeritageRequirement {
  kind: HeritageRequirementKind;
  value: string;
}

/**
 * Un nœud de l'arbre `ProductionComponentDTO.finish.rewards`.
 *
 * ⚠️ `chance` est le poids BRUT écrit dans `MysteryChestRewardDTO.chances[]`, pas
 * une probabilité. Les poids ne somment pas à 100 (`[33,33,33,3,3]` = 105) parce
 * que les entrées conditionnées par `requirements` sont retirées du tirage quand
 * elles ne s'appliquent pas : la renormalisation est faite par le jeu, à
 * l'exécution, et n'est PAS reproduite ici.
 */
export interface HeritageRewardNode {
  kind: HeritageRewardKind;
  /** `id` ou `baseData.id`, quand le game design en donne un. */
  id: string | null;
  /** Poids de tirage au sein du parent. `null` hors tirage aléatoire. */
  chance: number | null;
  /** Relique, item, kit, unité, ressource, ou id de DAC — selon `kind`. */
  definitionId: string | null;
  /** Libellé loca de `definitionId`, `""` quand la clé n'existe pas (C7). */
  label: string;
  amount: number | null;
  requirements: HeritageRequirement[];
  /** `baseData.replacementReward` — le repli quand `requirements` ne passe pas. */
  replacement: HeritageRewardNode | null;
  /** Pour `dynamicActionChange` : le montant versé, indexé par niveau. */
  curve: BuildingCurve | null;
  /** Idem, quand l'ère du joueur ouvre un second axe. */
  ageCurve: BuildingAgeCurve | null;
  /** Ressources versées, en clé projet. Vide hors `dynamicActionChange`. */
  resources: string[];
  children: HeritageRewardNode[];
}

/**
 * Un arbre de récompense et le palier de niveau à partir duquel il s'applique.
 *
 * Deux chemins mènent ici, et les deux sont indexés par le niveau du vault :
 *  - `ProductionComponentDTO.finish.rewards` — un seul palier, `minLevel: 1` ;
 *  - `producedDynamicActionChangeDefinitionId` pointant un DAC dont les `values`
 *    tabulent un arbre de récompense au lieu de ressources (7 effets). Le
 *    contenu du coffre CHANGE alors avec le niveau, d'où un palier par `when`.
 * Lecture par palier (C9) : le tier applicable est celui de plus grand
 * `minLevel` ≤ niveau courant.
 */
export interface HeritageRewardTier {
  minLevel: number;
  rewards: HeritageRewardNode[];
}

/** Une ligne de coût ou de production d'unité. Montant POSITIF. */
export interface HeritageAmountLine {
  definitionId: string;
  amount: number;
  /** Libellé loca, `""` si absent (C7). */
  label: string;
}

// ─── Effets ───────────────────────────────────────────────────────────────────

/**
 * Un des 10 effets d'un vault.
 *
 * Chaque effet porte EXACTEMENT un composant (130/130) parmi six types. Le
 * composant est projeté en `bonuses` quand il porte une valeur nommable, et en
 * `rewards` quand il verse un coffre — un `ProductionComponentDTO` peut faire
 * les deux, aucun autre type ne fait ni l'un ni l'autre.
 */
export interface HeritageEffectExtract {
  id: string;
  /** Niveau de vault à partir duquel l'effet devient plaçable. */
  minLevel: number;
  group: HeritageEffectGroup;
  /** `lockDuration` — cooldown avant de pouvoir changer l'effet d'un slot. */
  lockSeconds: number | null;
  /** `@type` du composant porteur, forme courte. */
  componentType: string;
  componentId: string | null;
  /** `ProductionComponentDTO.duration` en secondes. `null` hors production. */
  periodSeconds: number | null;
  minCollectionSeconds: number | null;
  earlyCollectable: boolean;
  /** `dynamicDurationDefinitionId` résolu : la durée raccourcit avec le niveau. */
  durationCurve: BuildingCurve | null;
  /** `ProductionComponentDTO.type`, ex. `ProductionType_UNIT`. `null` sinon. */
  productionType: string | null;
  /** `resourceChangesOnStart` — ce que la production coûte à lancer. */
  startCosts: HeritageAmountLine[];
  /** `producedUnits` — 1 seul effet du domaine en produit. */
  producedUnits: HeritageAmountLine[];
  /** `behaviours[].requiredWorkers.amount`. */
  requiredWorkers: number | null;
  bonuses: BuildingBonus[];
  rewards: HeritageRewardTier[];
  warnings: string[];
}

// ─── Progression ──────────────────────────────────────────────────────────────

/**
 * Un barème de montée, résolu depuis un `DynamicLuaLongDefinitionDTO`.
 *
 * ⚠️ CONVENTION D'INDEX — `perLevel[i]` est ce qu'il faut payer pour QUITTER le
 * niveau `i + 1`, c'est-à-dire `f(entityLevel = i + 1)`. C'est la convention
 * `entityLevel` = « le niveau déclaré » déjà retenue par l'extraction Bâtiments
 * (`BuildingLevelUpExtract.upgradeCost`), et non une lecture propre à ce
 * domaine. Le tableau a donc `maxLevel - 1` entrées : on ne quitte pas le
 * dernier niveau.
 */
export interface HeritageLevelScheme {
  definitionId: string;
  luaScript: string;
  /** Longueur `levels - 1`. Montants entiers, tronqués comme tout coût. */
  perLevel: number[];
  /** `cumulative[i]` = somme de `perLevel[0..i]` — le total depuis le niveau 1. */
  cumulative: number[];
}

// ─── Gardien ──────────────────────────────────────────────────────────────────

/**
 * `Boost_HeritageVault_KeeperAmplifier`, porté par les 13 `Building_Heritage_*_1`.
 *
 * ⚠️ Sa table `modifier` est un stub vide (une seule entrée `when: "0"` au `then`
 * sans valeur) : la lire par le chemin normal des boosts donne ZÉRO. Toute la
 * valeur est dans le script Lua. C'est pour ça que ce champ est extrait à part
 * et pas comme un bonus ordinaire.
 */
export interface HeritageKeeperAmplifier {
  boostDefinitionId: string;
  luaDefinitionId: string;
  luaScript: string;
  /**
   * `perReputationLevel[i]` = multiplicateur additionnel au rang `i + 1`.
   *
   * ⚠️ Le game design ne déclare AUCUN plafond de rang de gardien. La longueur
   * de ce tableau vaut `HERITAGE_MAX_LEVEL` par cohérence avec le vault, ce qui
   * est une borne d'extraction, pas une règle du jeu — voir
   * `resolvers/heritage.ts`, convention (b).
   */
  perReputationLevel: number[];
  /** Les `BuildingDefinition.id` qui référencent ce boost. */
  carriedBy: string[];
}

/**
 * Le PRIX d'une offre du gardien, et rien d'autre.
 *
 * ⚠️ POINT CENTRAL DU DOMAINE — le game design contient 29 formules de prix
 * `Lua_HeritageVault_KeeperOffer_*` et **zéro offre**. Chacune de ces 29
 * définitions a exactement 0 référence entrante dans les 66 Mo : aucun
 * `ShopOfferGroupDefinitionDTO`, aucun `SelectionKitDefinitionDTO`, aucun DTO
 * quelconque ne dit quelle ressource s'échange contre quelle autre, combien
 * d'offres sont proposées à la fois, ni comment elles tournent (la loca dit
 * « Offers refresh every week », le game design ne le dit pas).
 *
 * Le CATALOGUE des offres n'est donc PAS extractible : c'est de la saisie
 * manuelle en jeu, offre par offre. Rien ici ne doit être généré pour en tenir
 * lieu. Ce type ne porte que ce que la donnée dit vraiment — la courbe de prix.
 */
export interface HeritageKeeperOfferFormula {
  /** Suffixe du script, ex. `Coins_S`. */
  id: string;
  definitionId: string;
  luaScript: string;
  /** Variables réellement lues (`collectLuaVariables`). */
  variables: string[];
  /**
   * Signe du montant : `give` quand le joueur cède (montant négatif dans le
   * game design), `receive` quand il encaisse.
   */
  direction: "give" | "receive";
  /** Valeur au tout premier achat — `keeperPurchaseCount = 0`, `playerAgeOrder = 1`. */
  firstValue: number;
  /** `true` quand le prix est pondéré par `playerAgeOrder`. */
  scalesWithPlayerAge: boolean;
}

// ─── Un vault ─────────────────────────────────────────────────────────────────

export interface HeritageVaultExtract {
  key: HeritageKey;
  themeId: HeritageThemeId;
  /** `Base.HeritageVaults.<Theme>_Name`, ex. « Forge of Flames ». */
  name: string;
  description: string;
  /**
   * Le bâtiment-marqueur. NON dupliqué : sa forme, ses coûts et son bonus
   * d'amplificateur vivent dans `BUILDING_EXTRACT`.
   */
  buildingDefinitionId: string;
  /** `City_Capital|heritageCeltic` — la chaîne correspondante de `BUILDING_EXTRACT`. */
  buildingChainKey: string;
  /** `Base.BuildingGroups.<group>_Name`, ex. « Celtic Culture ». Distinct de `name`. */
  buildingName: string;
  /** `Event_Celtic`, `Treasure_Hunt`… — pas de DTO cible, c'est une étiquette. */
  event: string | null;
  /** Ordre d'affichage déclaré. ⚠️ Saute 13 et 14 sur les 13 vaults livrés. */
  order: number | null;
  maxLevel: number;
  /** `EvolutionToken|Building_…` — ce qui alimente le vault. */
  eligibleResourceIds: string[];
  /** Les `BuildingDefinition.id` évolutifs correspondants, dérivés des jetons. */
  eligibleEvolvingBuildingIds: string[];
  slots: HeritageSlotExtract[];
  effects: HeritageEffectExtract[];
  xpPerLevel: HeritageLevelScheme;
  keeperReputationPerLevel: HeritageLevelScheme;
  warnings: string[];
}

// ─── Le bundle ────────────────────────────────────────────────────────────────

export interface HeritageExtractBundle {
  generatedFrom: {
    gameDesignChecksum: string | null;
    locaChecksum: string | null;
    locale: string | null;
  };
  /**
   * `AgeDefinition.id` → `AgeDefinition.order`, recopié du game design.
   *
   * C'est le `playerAgeOrder` des scripts Lua. Il est extrait plutôt que dérivé
   * de l'index de `ERAS` : le game design compte `DawnAge` comme ordre 1, donc
   * `StoneAge` vaut 2 et non 1 — une dérivation par index se tromperait de 1
   * sur toutes les productions de pièces, de vivres et de culture.
   */
  playerAgeOrderByAge: Record<string, number>;
  vaults: HeritageVaultExtract[];
  keeperAmplifier: HeritageKeeperAmplifier | null;
  /** Les 29 courbes de prix, sans le catalogue qui n'existe pas. */
  keeperOfferFormulas: HeritageKeeperOfferFormula[];
  /** Types de bonus rencontrés sans équivalent dans `BONUS_LABELS`. */
  bonusGaps: BuildingBonusGap[];
  warnings: string[];
}
