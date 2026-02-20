/**
 * Mapping des ERA IDs (snake_case) vers leurs abréviations (2 lettres)
 * Utilisé pour générer les IDs de technos au format: tech_[abbr]_[index]
 */
export const ERA_ID_TO_ABBR: Record<string, string> = {
  stone_age: "sa",
  bronze_age: "ba",
  minoan_era: "me",
  classical_greece: "cg",
  early_rome: "er",
  roman_empire: "re",
  byzantine_era: "be",
  age_of_the_franks: "af",
  feudal_age: "fa",
  iberian_era: "ie",
  kingdom_of_sicily: "ks",
  high_middle_ages: "hm",
  early_gothic_era: "eg",
  late_gothic_era: "lg",
};

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
