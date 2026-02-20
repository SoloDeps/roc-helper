import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { buildingsAbbr, EraAbbr, goodsUrlByEra } from "./constants";
import { imagesUrl } from "./catalog";

export const selectorGoods: Record<string, string> = {
  default: "/goods/default.webp",
  tailor: "/goods/wool.webp",
  stone_mason: "/goods/alabaster_idol.webp",
  artisan: "/goods/bronze_bracelet.webp",
  scribe: "/goods/parchment.webp",
  carpenter: "/goods/planks.webp",
  spice_merchant: "/goods/pepper.webp",
  jeweler: "/goods/fine_jewelry.webp",
  alchemist: "/goods/ointment.webp",
  glassblower: "/goods/lead_glass.webp",
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
  return groupIndex !== -1 ? buildings[groupIndex][priorityIndex] : undefined;
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

  return goodMeta?.name ? slugify(goodMeta.name) : null;
}

export function getItemIconLocal(type: string): string {
  const normalized = slugify(type);
  if (normalized && normalized !== "default") {
    return `/goods/${normalized}.webp`;
  }
  return `/goods/default.webp`;
}

export function getCityCrestIconLocal(type: string): string {
  const normalized = slugify(type);
  if (normalized && normalized !== "default") {
    return imagesUrl[normalized as keyof typeof imagesUrl];
  }
  return `/goods/default.webp`;
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
