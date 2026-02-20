import { EraCode, EraGoodsMap, PostLGEra } from "@/types/shared";

// ─────────────────────────────────────────────────────────────────────────────
// MAX QTY PAR BÂTIMENT ET PAR ÈRE
// Ajouter un bloc par nouvelle ère. Chaque bâtiment a sa propre valeur.
// ─────────────────────────────────────────────────────────────────────────────

export interface MaxQtyPerBuilding {
  // homes
  small_home: number;
  average_home: number;
  luxurious_home: number;
  // farms
  rural_farm: number;
  domestic_farm: number;
  luxurious_farm: number;
  // culture sites
  little_culture_site: number;
  compact_culture_site: number;
  moderate_culture_site: number;
  large_culture_site: number;
  luxurious_culture_site: number;
  // workshops (à compléter)
  // shipyards  (à compléter)
}

export type BuildingId = keyof MaxQtyPerBuilding;

export const MAX_QTY_BY_ERA: Record<PostLGEra, MaxQtyPerBuilding> = {
  LG: {
    small_home: 31,
    average_home: 15,
    luxurious_home: 12,
    rural_farm: 13,
    domestic_farm: 11,
    luxurious_farm: 8,
    little_culture_site: 10,
    compact_culture_site: 9,
    moderate_culture_site: 6,
    large_culture_site: 1,
    luxurious_culture_site: 8,
  },
  // next era here
};

/**
 * Retourne la max_qty pour un bâtiment dans une ère donnée.
 * Retourne undefined si l'ère n'est pas encore dans la map
 * (fallback sur defaultMaxQty dans generateDynamicLevels).
 */
export function getMaxQtyForBuilding(
  era: EraCode,
  buildingId: BuildingId,
): number | undefined {
  if (era in MAX_QTY_BY_ERA) {
    return MAX_QTY_BY_ERA[era as PostLGEra][buildingId];
  }
  return undefined;
}

// ─────────────────────────────────────────────────────────────────────────────
// ERA GOODS
// ─────────────────────────────────────────────────────────────────────────────

export const ERA_GOODS: EraGoodsMap = {
  SA: ["primary_sa", "secondary_sa", "tertiary_sa"],
  BA: ["primary_ba", "secondary_ba", "tertiary_ba"],
  ME: ["primary_me", "secondary_me", "tertiary_me"],
  CG: ["primary_cg", "secondary_cg", "tertiary_cg"],
  ER: ["primary_er", "secondary_er", "tertiary_er"],
  RE: ["primary_re", "secondary_re", "tertiary_re"],
  BE: ["primary_be", "secondary_be", "tertiary_be"],
  AF: ["primary_af", "secondary_af", "tertiary_af"],
  FA: ["primary_fa", "secondary_fa", "tertiary_fa"],
  IE: ["primary_ie", "secondary_ie", "tertiary_ie"],
  KS: ["primary_ks", "secondary_ks", "tertiary_ks"],
  HM: ["primary_hm", "secondary_hm", "tertiary_hm"],
  EG: ["primary_eg", "secondary_eg", "tertiary_eg"],
  LG: ["primary_lg", "secondary_lg", "tertiary_lg"],
  // Ajouter les prochaines ères ici
};

// ─────────────────────────────────────────────────────────────────────────────
// ERA ORDER + HELPERS
// ─────────────────────────────────────────────────────────────────────────────

export const ERA_ORDER: EraCode[] = [
  "SA",
  "BA",
  "ME",
  "CG",
  "ER",
  "RE",
  "BE",
  "AF",
  "FA",
  "IE",
  "KS",
  "HM",
  "EG",
  "LG",
];

export function getPrevEra(era: EraCode): EraCode {
  const i = ERA_ORDER.indexOf(era);
  return i > 0 ? ERA_ORDER[i - 1] : era;
}

export function getNextEra(era: EraCode): EraCode {
  const i = ERA_ORDER.indexOf(era);
  return i < ERA_ORDER.length - 1 ? ERA_ORDER[i + 1] : era;
}

export function getEraForLevel(level: number): EraCode {
  if (level < 40) {
    throw new Error(
      `getEraForLevel should only be used for levels >= 40. Got: ${level}`,
    );
  }
  const startingEraIndex = ERA_ORDER.indexOf("LG");
  const eraOffset = Math.floor((level - 40) / 3);
  const eraIndex = startingEraIndex + eraOffset;
  return eraIndex >= ERA_ORDER.length
    ? ERA_ORDER[ERA_ORDER.length - 1]
    : ERA_ORDER[eraIndex];
}
