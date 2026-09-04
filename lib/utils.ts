import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  buildingsAbbr,
  eras,
  EraAbbr,
  goodsUrlByEra,
  makePriorityKey,
  PriorityType,
} from "./constants";
import { imagesUrl } from "./catalog";

export const selectorGoods: Record<string, string> = {
  default: "/images/goods/default.webp",
  tailor: "/images/goods/wool.webp",
  stone_mason: "/images/goods/alabaster_idol.webp",
  artisan: "/images/goods/bronze_bracelet.webp",
  scribe: "/images/goods/parchment.webp",
  carpenter: "/images/goods/planks.webp",
  spice_merchant: "/images/goods/pepper.webp",
  jeweler: "/images/goods/fine_jewelry.webp",
  alchemist: "/images/goods/ointment.webp",
  glassblower: "/images/goods/lead_glass.webp",
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(str: string | undefined | null): string {
  // Protection: retourner "default" si str est undefined/null
  if (!str || typeof str !== "string") {
    return "default";
  }

  return str
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^\w]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_|_$/g, "");
}

export function getBuildingFromLocal(
  priority: string,
  era: string,
  buildings: string[][],
): string | undefined {
  // Create mapping for priority levels with case-insensitive handling
  const priorityMapping = {
    primary: 0,
    secondary: 1,
    tertiary: 2,
  };

  // Convert priority to lowercase and get corresponding index
  const priorityIndex =
    priorityMapping[priority.toLowerCase() as keyof typeof priorityMapping];

  // Validate priority input
  if (priorityIndex === undefined) return undefined;

  // Find group index with flexible abbreviation matching
  const groupIndex = buildingsAbbr.findIndex((group) =>
    group.abbreviations.some(
      (abbr) => abbr.toUpperCase() === era.toUpperCase(),
    ),
  );

  // return building if valid, otherwise undefined
  // `buildings[groupIndex]` peut manquer : localStorage corrompu, ou tableau
  // plus court que `buildingsAbbr` après l'ajout d'un groupe d'ères.
  return groupIndex !== -1 ? buildings[groupIndex]?.[priorityIndex] : undefined;
}

export function isValidData(data: unknown): boolean {
  // Quick type check - reject non-string inputs
  if (typeof data !== "string") return false;

  // Define security patterns to prevent XSS and injection
  const securityPatterns = [
    /<script/i,
    /on\w+=/i,
    /javascript:/i,
    /data:/i,
    /eval\(/i,
  ];

  // Test data against security patterns
  return !securityPatterns.some((pattern) => pattern.test(data));
}

export function formatNumber(value: number): string {
  // Gérer le signe négatif
  const isNegative = value < 0;
  const absValue = Math.abs(value);

  const formatWithDecimals = (num: number) =>
    num.toLocaleString("fr-FR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  let formatted = "";

  if (absValue >= 1_000_000_000) {
    formatted = formatWithDecimals(absValue / 1_000_000_000) + " B";
  } else if (absValue >= 1_000_000) {
    formatted = formatWithDecimals(absValue / 1_000_000) + " M";
  } else if (absValue >= 100_000) {
    formatted = formatWithDecimals(absValue / 1_000) + " K";
  } else if (absValue >= 1_000) {
    formatted = absValue.toLocaleString("en-US");
  } else {
    formatted = absValue.toString();
  }

  // add negative sign if needed
  return isNegative ? `-${formatted}` : formatted;
}

export function getGoodsImg(buildingName: string) {
  const nameFormatted = slugify(buildingName);
  return selectorGoods[nameFormatted] || selectorGoods.default;
}

export function getGoodNameFromPriorityEra(
  priority: string,
  era: string,
  userSelections: string[][],
): string | null {
  const building = getBuildingFromLocal(priority, era, userSelections);
  if (!building) return null;

  const normalizedBuilding = slugify(building);
  const goodMeta =
    goodsUrlByEra[era.toUpperCase() as EraAbbr]?.[normalizedBuilding];

  // La CLÉ, pas le libellé : le retour alimente `getItemIconLocal` et sert
  // d'identifiant de bien. Les trois biens dont le libellé diverge de la clé
  // (`secretary`/"Secretary Desk", `elixier`/"Elixirs",
  // `embellishment`/"Embellishments") tomberaient sinon sur une icône absente.
  return goodMeta?.key ?? null;
}

/**
 * Résolution INVERSE de `getGoodNameFromPriorityEra` : d'une CLÉ de bien
 * (`"cape"`, `"secretary"`) vers la clé de priorité du joueur (`"tertiary_re"`).
 *
 * Compare sur `goodsUrlByEra[…].key`, jamais sur le libellé : les deux
 * divergent sur trois biens (cf. le commentaire de `goodsUrlByEra`).
 *
 * Cherche dans quel SLOT ce joueur a rangé l'atelier qui fabrique ce bien, au
 * lieu de demander ce que contient un slot donné. C'est ce qui rend un coût
 * écrit en bien concret indépendant du classement : le classement est appliqué
 * ici puis ré-appliqué à l'affichage, et les deux s'annulent.
 *
 * ⚠️ Retourne la PREMIÈRE ère qui correspond. Le contrat est donc que deux ères
 * ne partagent jamais un nom de bien — c'est vrai du jeu (un bien appartient à
 * un `age`), et `goodsUrlByEra` doit le rester : le doublon `SA`/`BA` rangeait
 * les trois biens du Bronze sous l'Âge de pierre. Un test fige cette unicité.
 *
 * `null` quand le joueur n'a pas classé l'atelier producteur — le bien reste
 * affiché, mais dans le bloc « autres biens ».
 *
 * Extrait de `useGoodToPriorityConverter` (components/total-goods/
 * total-goods-display.tsx), qui l'appelle désormais, pour que ce chemin soit
 * testable hors React.
 */
export function getPriorityKeyFromGoodName(
  goodName: string,
  userSelections: string[][],
): string | null {
  if (!userSelections || userSelections.length === 0) return null;

  const normalizedGoodName = slugify(goodName);

  for (const era of eras) {
    const abbr = era.abbr as EraAbbr;
    const goodsForEra = goodsUrlByEra[abbr];
    if (!goodsForEra) continue;

    for (const priority of ["primary", "secondary", "tertiary"] as PriorityType[]) {
      const building = getBuildingFromLocal(priority, abbr, userSelections);
      if (!building) continue;

      const normalizedBuilding = slugify(building);
      const goodMeta = goodsForEra[normalizedBuilding];

      if (goodMeta && goodMeta.key === normalizedGoodName) {
        return makePriorityKey(priority, abbr);
      }
    }
  }

  return null;
}

/**
 * Le joueur a-t-il classé les TROIS ateliers de cette ère ?
 *
 * La popup remplit les trois emplacements ou aucun (le tertiaire est déduit),
 * mais un classement laissé à mi-chemin existe : `["Artisan", "", ""]`.
 *
 * ⚠️ Garde-fou indispensable au repli sur l'ordre du jeu. Mélanger les deux
 * règles de placement dans une même ère les fait entrer en collision : avec
 * `["Artisan", "", ""]`, le classement met `bronze_bracelet` (Artisan) en
 * `primary_ba` pendant que le repli y met aussi `alabaster_idol` (order 1), et
 * les deux montants fusionnent. Une ère se range donc entièrement selon le
 * joueur, ou entièrement selon le jeu.
 */
export function hasCompleteWorkshopRanking(
  era: string,
  userSelections: string[][],
): boolean {
  return (["primary", "secondary", "tertiary"] as PriorityType[]).every(
    (priority) => Boolean(getBuildingFromLocal(priority, era, userSelections)),
  );
}

/**
 * ⚠️ LES « RESSOURCES » QUI NE SONT PAS DES BIENS.
 *
 * `getItemIconLocal` envoie toute clé vers `/images/goods/<clé>.webp` — juste
 * pour un bien, faux pour ce qui n'en est pas un et vit dans un dossier dédié.
 * Deux cas dans le projet, et aucun ne se devine depuis la clé (ni le dossier,
 * ni le préfixe `icon_` que la clé ne porte pas) :
 *  - `chest_puzzlepieces` : un COFFRE, versé par les régions de campagne
 *    (`data/campaigns/*`), rangé avec tous les autres coffres ;
 *  - `negotiation_wildcard` : un objet d'inventaire, versé par le coffre
 *    World Fair du Heritage Vault.
 *
 * Cette table ne liste QUE ces écarts — jamais une ressource que
 * `/images/goods/` sert déjà correctement.
 */
const RESOURCE_ICON_OVERRIDES: Record<string, string> = {
  chest_puzzlepieces: "/images/chests/icon_chest_puzzlepieces.webp",
  negotiation_wildcard: "/images/inventory/icon_negotiation_wildcard.webp",
};

export function getItemIconLocal(type: string): string {
  const override = RESOURCE_ICON_OVERRIDES[type];
  if (override !== undefined) return override;
  const normalized = slugify(type);
  if (normalized && normalized !== "default") {
    return `/images/goods/${normalized}.webp`;
  }
  return `/images/goods/default.webp`;
}

/**
 * Icône d'un OBJET D'INVENTAIRE (`InventoryItem_RefillBarracks_Infantry`,
 * `InventoryItem_AgeUpgradeKit_Evolving`…), dossier dédié — jamais
 * `/images/goods/`, un objet d'inventaire n'est pas un bien. Même modèle que
 * `getItemIconLocal` : slugify + repli sur `default.webp`.
 */
export function getInventoryItemIconLocal(type: string): string {
  const normalized = slugify(type);
  if (normalized && normalized !== "default") {
    return `/images/inventory/${normalized}.webp`;
  }
  return `/images/inventory/default.webp`;
}

/**
 * Icône d'une UNITÉ (`Unit_CurrentEra_AztecMainTemple_Animal_Crocodiles`…),
 * dossier dédié — jamais `/images/goods/`, conceptuellement le mauvais
 * dossier pour une unité. Même modèle que `getItemIconLocal` : slugify +
 * repli sur `default.webp`.
 */
export function getUnitIconLocal(type: string): string {
  const normalized = slugify(type);
  if (normalized && normalized !== "default") {
    return `/images/units/${normalized}.webp`;
  }
  return `/images/units/default.webp`;
}

export function getCityCrestIconLocal(type: string): string {
  const normalized = slugify(type);
  if (normalized && normalized !== "default") {
    return imagesUrl[normalized as keyof typeof imagesUrl];
  }
  return `/images/goods/default.webp`;
}

export function getWikiImageUrl(
  imageName: string,
  imgLvl: boolean,
  level: number,
  size: number = 200,
): string {
  const lvlSuffix = imgLvl ? level : "";
  return `https://riseofcultures.wiki.gg/images/thumb/${imageName}${lvlSuffix}.png/${size}px-${imageName}${lvlSuffix}.png`;
}

export function getEraBuildingLevel(level: number): 1 | 2 | 3 {
  const pos = ((level - 1) % 3) + 1;
  return pos as 1 | 2 | 3;
}

export const withBase = (path: string) =>
  process.env.NODE_ENV === "production" ? `/roc-helper${path}` : path;

// Format seconds to human-readable time
export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  if (seconds < 3600) return `${Math.round(seconds / 60)}m`;
  if (seconds < 86400) {
    const h = Math.floor(seconds / 3600);
    const m = Math.round((seconds % 3600) / 60);
    return m > 0 ? `${h}h ${m}m` : `${h}h`;
  }
  const d = Math.floor(seconds / 86400);
  const h = Math.round((seconds % 86400) / 3600);
  return h > 0 ? `${d}d ${h}h` : `${d}d`;
}
