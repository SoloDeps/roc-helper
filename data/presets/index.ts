import type { EraAbbr } from "@/lib/constants";

// ============================================================================
// TYPES
// ============================================================================

export interface BuildingEntry {
  kind?: "building"; // optional pour rétrocompat — absent = building
  buildingId: string;
  type: "construction" | "upgrade";
  era: EraAbbr;
  level: number;
  qty: number;
}

export interface OttomanAreaEntry {
  kind: "ottoman_area";
  areaId: string; // ex: "oa_1"
}

export interface OttomanTradePostEntry {
  kind: "ottoman_tradepost";
  tradePostId: string; // ex: "otp_0"
  hidden?: number;
}

export type PresetEntry =
  | BuildingEntry
  | OttomanAreaEntry
  | OttomanTradePostEntry;

export interface PresetSection {
  id: string;
  label: string;
  category: string;
  entries: PresetEntry[];
}

// ============================================================================
// ERA → ALLIED CITY MAPPING
// ============================================================================

export const ERA_TO_ALLIED: Partial<Record<EraAbbr, string[]>> = {
  ME: ["egypt"],
  CG: ["egypt"],
  ER: ["china"],
  RE: ["china"],
  BE: ["maya"],
  AF: ["maya"],
  FA: ["vikings"],
  IE: ["vikings"],
  KS: ["arabia"],
  HM: ["arabia"],
};

export function getAlliedCitiesForEra(era: EraAbbr): string[] {
  return ERA_TO_ALLIED[era] ?? [];
}

// ============================================================================
// SECTIONS — import par ère
// ============================================================================

import { sections_SA } from "./1_SA";
import { sections_BA } from "./2_BA";
import { sections_ME } from "./3_ME";
import { sections_CG } from "./4_CG";
import { sections_ER } from "./5_ER";
import { sections_RE } from "./6_RE";
import { sections_BE } from "./7_BE";
import { sections_AF } from "./8_AF";
import { sections_FA } from "./9_FA";
import { sections_IE } from "./10_IE";
import { sections_KS } from "./11_KS";
import { sections_HM } from "./12_HM";
import { sections_EG } from "./13_EG";
import { sections_LG } from "./14_LG";

export const PRESET_SECTIONS: PresetSection[] = [
  ...sections_SA,
  ...sections_BA,
  ...sections_ME,
  ...sections_CG,
  ...sections_ER,
  ...sections_RE,
  ...sections_BE,
  ...sections_AF,
  ...sections_FA,
  ...sections_IE,
  ...sections_KS,
  ...sections_HM,
  ...sections_EG,
  ...sections_LG,
];

// ============================================================================
// HELPERS
// ============================================================================

export function getSectionsForEraAndCategory(
  era: EraAbbr,
  category: string,
): PresetSection[] {
  return PRESET_SECTIONS.filter(
    (s) => s.id.endsWith(`_${era}`) && s.category === category,
  );
}

/**
 * Retourne toutes les entries d'une section sans filtrer par ère.
 * Les sections sont déjà ciblées par ère via getSectionsForEraAndCategory,
 * donc on prend tout — y compris les niveaux d'ères précédentes
 * (ex: entries FA dans une section vikings_homes_IE).
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function getEntriesForEra(
  section: PresetSection,
  _era: EraAbbr,
): PresetEntry[] {
  return section.entries;
}
