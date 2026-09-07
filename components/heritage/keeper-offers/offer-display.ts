// ============================================================
// Présentation d'une offre du Vault Keeper : icône, libellé.
//
// Couche UI pure — aucun calcul ici, voir `resolvers/heritage-keeper-offers.ts`
// pour le catalogue et les coûts. Ce module ne fait que choisir QUELLE icône
// représente une offre, avec une préférence stricte : un asset LOCAL du jeu
// d'abord (biens, objets d'inventaire déjà servis ailleurs dans le projet),
// le wiki communautaire seulement pour les objets qu'aucun asset local ne
// couvre — vérifiés un par un (HTTP 200) avant d'entrer dans la table
// `INVENTORY_ICON_WIKI` ci-dessous.
// ============================================================

import { imagesUrl } from "@/lib/catalog";
import { GOOD_META_BY_KEY, goodsByCivilization } from "@/lib/constants";
import { getGoodNameFromPriorityEra, getItemIconLocal, getWikiImageUrl } from "@/lib/utils";
import { eraForRank, type KeeperOffer } from "@/resolvers/heritage-keeper-offers";
import type { EraCode } from "@/types/shared";

/** `Coins_S`/`Coins_M` partagent l'icône « Coins », etc. — la clé du bien local. */
const CAPITAL_RESOURCE_KEY: Record<string, string> = {
  Coins_S: "coins",
  Coins_M: "coins",
  Food_S: "food",
  Food_M: "food",
  RP: "research_points",
};

/**
 * Objets d'inventaire dont l'asset EXISTE DÉJÀ localement (`public/images/
 * inventory/`), servi ailleurs dans le projet pour ces mêmes définitions de
 * jeu (recharges de caserne, kit de montée d'ère, soin d'escouade).
 */
const INVENTORY_ICON_LOCAL: Record<string, string> = {
  RefillBarracks_Infantry: "inventoryitem_refillbarracks_infantry",
  RefillBarracks_Ranged: "inventoryitem_refillbarracks_ranged",
  RefillBarracks_Cavalry: "inventoryitem_refillbarracks_cavalry",
  RefillBarracks_HeavyInfantry: "inventoryitem_refillbarracks_heavyinfantry",
  RefillBarracks_Siege: "inventoryitem_refillbarracks_siege",
  RefillBarracks_All: "inventoryitem_refillbarracks_all",
  AgeUpKit: "inventoryitem_ageupgradekit_evolving",
  HealSquad: "inventoryitem_battle_healsquad",
};

/**
 * Le reste des objets d'inventaire — aucun asset local, repli sur le wiki
 * communautaire (`riseofcultures.wiki.gg`, table `offers_list` du module
 * `Heritage_Vault`). Chaque nom a été vérifié individuellement (HTTP 200)
 * avant d'entrer ici ; `Negotiation_Wildcard` n'y figure pas, elle a déjà un
 * asset local via `RESOURCE_ICON_OVERRIDES` (`lib/utils.ts`).
 */
const INVENTORY_ICON_WIKI: Record<string, string> = {
  ConstructionUpgrade_Skip: "Construction_Skip_Item",
  Production_Skip: "Production_Skip_Item",
  HealAllUnits: "Complete_Healing_Item",
  Negotiation_Turn: "Negotiation_Turn_Item",
  WonderBP_Rare: "Blueprint",
  WonderBP_Legendary: "Blueprint_rare",
};

export interface KeeperOfferDisplay {
  src: string;
  /** Le libellé du catalogue, ou le nom du bien réel pour un rang résolu. */
  label: string;
}

/**
 * `"papyrus_scroll"` → `"Papyrus Scroll"` — le nom d'un bien ALLIÉ, jamais
 * couvert par `GOOD_META_BY_KEY` (biens d'atelier uniquement). Sans registre
 * de libellés dédié pour ces biens dans le projet, mais le précédent existe
 * déjà (`total-goods-display.tsx`, biens hors classement) : le nom EST la clé,
 * espaces et majuscules refaits — jamais le numéro de palier générique
 * (« Exotic goods II ») qui ne dit rien du bien réellement cédé.
 */
function alliedGoodName(key: string): string {
  return key
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * L'ordre d'affichage voulu des sections du sélecteur « Allied culture » —
 * l'ordre du JEU, celui dans lequel les villes alliées apparaissent au fil
 * de la progression (même ordre que `goodsByCivilization`, `lib/constants.ts`,
 * qui reflète l'ordre brut d'extraction du jeu) : Égypte, Chine, Maya,
 * Vikings, Arabie, Ottomans — pas l'ordre alphabétique ni l'ordre de demande
 * initiale.
 *
 * Clés de `goodsByCivilization` (`lib/constants.ts`) — le même regroupement
 * que le Calculator, jamais redéclaré ici.
 */
export const ALLIED_CIVILIZATION_ORDER = [
  "EGYPT",
  "CHINA",
  "MAYA EMPIRE",
  "VIKING KINGDOM",
  "ARABIA",
  "OTTOMAN EMPIRE",
] as const;

const ALLIED_CIVILIZATION_LABELS: Record<(typeof ALLIED_CIVILIZATION_ORDER)[number], string> = {
  EGYPT: "Egypt",
  CHINA: "China",
  "MAYA EMPIRE": "Maya",
  "VIKING KINGDOM": "Vikings",
  ARABIA: "Arabia",
  "OTTOMAN EMPIRE": "Ottoman",
};

/**
 * La civilisation alliée d'un bien (« papyrus_scroll » → « Egypt ») — pour
 * regrouper le sélecteur en sections, une par civilisation, plutôt qu'une
 * seule grille indifférenciée. `null` si `goodsByCivilization` ne connaît pas
 * la clé (ne devrait pas arriver pour un candidat du catalogue).
 */
export function alliedGoodCivilization(key: string): string | null {
  for (const civ of ALLIED_CIVILIZATION_ORDER) {
    if (goodsByCivilization[civ]?.goods.includes(key)) return ALLIED_CIVILIZATION_LABELS[civ];
  }
  return null;
}

/** L'ordre d'affichage des labels rendus par `alliedGoodCivilization`. */
export const ALLIED_CIVILIZATION_LABEL_ORDER = ALLIED_CIVILIZATION_ORDER.map(
  (civ) => ALLIED_CIVILIZATION_LABELS[civ],
);

/**
 * Le libellé sans son suffixe de taille — « Coins (small) » → « Coins ». Le
 * jeu ne distingue jamais deux offres du même bien par un mot, seulement par
 * le MONTANT affiché sur la carte : c'est ce montant, pas « small »/« medium »,
 * qui doit porter la distinction dans l'UI. Le libellé complet reste utile
 * ailleurs (tests, a11y) donc n'est pas modifié dans le catalogue lui-même.
 */
export function baseOfferLabel(label: string): string {
  return label.replace(/\s*\((?:small|medium|primary|secondary|tertiary|I{1,3})\)\s*$/i, "");
}

/**
 * L'icône et le libellé d'une offre, à `era` et pour le classement d'ateliers
 * `selections` du joueur — les deux seules choses dont une offre de RANG a
 * besoin pour désigner un bien réel plutôt qu'un intitulé générique.
 */
export function describeKeeperOffer(
  offer: KeeperOffer,
  era: EraCode,
  selections: string[][],
  /**
   * Le bien allié CHOISI par le joueur dans le sélecteur (une carte par
   * candidat, voir `KeeperOffer.goodCandidates`) — prime sur le premier
   * candidat du catalogue. Sans objet pour toute autre catégorie.
   */
  good?: string,
): KeeperOfferDisplay {
  if (offer.category === "capital") {
    const key = CAPITAL_RESOURCE_KEY[offer.id] ?? "default";
    return { src: getItemIconLocal(key), label: offer.label };
  }

  // Bien de RANG (`CEGood*`/`PEGood*`) : résolu au bien réel du joueur quand
  // son classement d'ateliers le permet, sinon repli générique — jamais une
  // icône inventée pour un rang non classé.
  if (offer.rank !== undefined) {
    const rankEra = eraForRank(era, offer.rank);
    const good =
      rankEra === null ? null : getGoodNameFromPriorityEra(offer.rank.priority, rankEra, selections);
    if (good === null) return { src: imagesUrl.good, label: offer.label };
    return { src: getItemIconLocal(good), label: GOOD_META_BY_KEY[good]?.name ?? offer.label };
  }

  // Allied culture (Exotic Goods) : un même palier de prix désigne des biens
  // différents selon la civilisation (voir la doc de `goodCandidates`). Le
  // bien CHOISI (une carte par candidat dans le sélecteur) prime ; sans choix,
  // le premier candidat sert de repli d'affichage — jamais présenté comme LE
  // bon pour toute civilisation. Dans les deux cas le nom réel du bien
  // s'affiche, jamais le palier générique du catalogue (« Exotic goods II »).
  if (offer.goodCandidates !== undefined) {
    const candidate = good ?? offer.goodCandidates[0];
    if (candidate === undefined) return { src: imagesUrl.good, label: offer.label };
    return { src: getItemIconLocal(candidate), label: alliedGoodName(candidate) };
  }

  // `WonderOrb` est un BIEN, pas un objet d'inventaire : son asset vit sous
  // `/images/goods/wonder_orb.webp`. La clé est explicite parce qu'elle ne se
  // dérive pas de l'identifiant — `wonderorb` ne correspond à aucun fichier.
  if (offer.id === "WonderOrb") return { src: getItemIconLocal("wonder_orb"), label: offer.label };

  const localSlug = INVENTORY_ICON_LOCAL[offer.id];
  if (localSlug !== undefined) {
    return { src: `/images/inventory/${localSlug}.webp`, label: offer.label };
  }

  const wikiName = INVENTORY_ICON_WIKI[offer.id];
  if (wikiName !== undefined) {
    return { src: getWikiImageUrl(wikiName, false, 1), label: offer.label };
  }

  // Negotiation_Wildcard seule arrive ici : son asset local est déjà déclaré
  // dans `RESOURCE_ICON_OVERRIDES` (`lib/utils.ts`), sous sa clé en minuscules.
  return { src: getItemIconLocal(offer.id.toLowerCase()), label: offer.label };
}
