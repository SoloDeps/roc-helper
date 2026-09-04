import { ERAS } from "@/data/config";

/**
 * Mapping des ERA IDs (snake_case) vers leurs abréviations (2 lettres minuscules)
 * Utilisé pour générer les IDs de technos au format: [abbr]_[index]
 *
 * Dérivé de ERAS (data/config.ts) — ne pas redéclarer la liste des ères ici.
 */
export const ERA_ID_TO_ABBR: Record<string, string> = Object.fromEntries(
  ERAS.map((era) => [era.id, era.abbr.toLowerCase()]),
);

/**
 * Mapping inverse: ABBR vers ERA_ID
 */
export const ABBR_TO_ERA_ID: Record<string, string> = Object.fromEntries(
  Object.entries(ERA_ID_TO_ABBR).map(([id, abbr]) => [abbr, id])
);

/**
 * Helper: Obtenir l'abréviation d'une ère
 */
export function getEraAbbr(eraId: string): string {
  return ERA_ID_TO_ABBR[eraId] || eraId;
}

/**
 * Helper: Obtenir l'ID complet d'une ère depuis son abréviation
 */
export function getEraIdFromAbbr(abbr: string): string {
  return ABBR_TO_ERA_ID[abbr.toLowerCase()] || abbr;
}
