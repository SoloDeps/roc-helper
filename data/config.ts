import { EraCode, PostLGEra } from "@/types/shared";

interface MaxQtyByEra {
  homes: number;
  farms: number;
  workshops: number;
  shipyards: number;
}

// eracode a partir de LG et plus : exclude others era except LG
export const MAX_QTY_BY_ERA: Record<PostLGEra, MaxQtyByEra> = {
  LG: {
    homes: 31,
    farms: 13,
    workshops: 4,
    shipyards: 9,
  },
};

// Nouvelle fonction helper pour récupérer max_qty de manière safe
export function getMaxQtyForEra(era: EraCode, buildingType: keyof MaxQtyByEra): number | undefined {
  if (era in MAX_QTY_BY_ERA) {
    return MAX_QTY_BY_ERA[era as PostLGEra][buildingType];
  }
  return undefined;
}

const ERA_ORDER: EraCode[] = [
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
    throw new Error(`getEraForLevel should only be used for levels >= 40. Got: ${level}`)
  }

  const startingEraIndex = ERA_ORDER.indexOf("LG");
  const levelsPerEra = 3;
  
  const eraOffset = Math.floor((level - 40) / levelsPerEra);
  const eraIndex = startingEraIndex + eraOffset;
  
  if (eraIndex >= ERA_ORDER.length) {
    return ERA_ORDER[ERA_ORDER.length - 1] as EraCode;
  }
  
  return ERA_ORDER[eraIndex] as EraCode;
}