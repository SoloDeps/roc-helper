import { EraCode, EraGoodsMap, PostLGEra } from "@/types/shared";

// ─────────────────────────────────────────────────────────────────────────────
// ÈRES — SOURCE DE VÉRITÉ UNIQUE
//
// Toute définition d'ère du projet dérive de ce tableau :
//   - lib/catalog.ts    → ré-exporte `ERAS` (et le type `Era`)
//   - lib/constants.ts  → ré-exporte `eras` (et les types `Era` / `EraAbbr`)
//   - lib/era-mappings.ts → dérive ERA_ID_TO_ABBR / ABBR_TO_ERA_ID
//   - ERA_ORDER ci-dessous → dérivé de l'ordre de ce tableau
//
// L'ordre du tableau EST l'ordre chronologique du jeu : il pilote
// getPrevEra / getNextEra / getEraForLevel. Ajouter une nouvelle ère =
// ajouter une entrée ici (+ son bloc dans ERA_GOODS et MAX_QTY_BY_ERA).
// ─────────────────────────────────────────────────────────────────────────────

export interface EraDefinition {
  /** Code court, ex. "LG" — clé utilisée par max_qty_by_era et les IDs de goods */
  abbr: EraCode;
  /** Identifiant snake_case, ex. "late_gothic_era" — clé des registries par ère */
  id: string;
  /**
   * `AgeDefinition.id` du game design, ex. "LateGothicEra".
   *
   * Seul pont entre le vocabulaire d'ère du projet et celui de l'extraction
   * (`BuildingAgeCurveEntry.appliesTo`, `BuildingLevelExtract.age`). Déclaré ici
   * pour la même raison que le reste : ne pas le redéclarer ailleurs.
   */
  gameDesignAge: string;
  /** Libellé affiché, ex. "Late Gothic Era" */
  name: string;
  /** Visuel de couverture */
  image: string;
}

export const ERAS: EraDefinition[] = [
  {
    abbr: "SA",
    gameDesignAge: "StoneAge",
    id: "stone_age",
    name: "Stone Age",
    image: "/eras/1_SA_cover.webp",
  },
  {
    abbr: "BA",
    gameDesignAge: "BronzeAge",
    id: "bronze_age",
    name: "Bronze Age",
    image: "/eras/2_BA_cover.webp",
  },
  {
    abbr: "ME",
    gameDesignAge: "MinoanEra",
    id: "minoan_era",
    name: "Minoan Era",
    image: "/eras/3_ME_cover.webp",
  },
  {
    abbr: "CG",
    gameDesignAge: "ClassicGreece",
    id: "classical_greece",
    name: "Classical Greece",
    image: "/eras/4_CG_cover.webp",
  },
  {
    abbr: "ER",
    gameDesignAge: "EarlyRome",
    id: "early_rome",
    name: "Early Rome",
    image: "/eras/5_ER_cover.webp",
  },
  {
    abbr: "RE",
    gameDesignAge: "RomanEmpire",
    id: "roman_empire",
    name: "Roman Empire",
    image: "/eras/6_RE_cover.webp",
  },
  {
    abbr: "BE",
    gameDesignAge: "ByzantineEra",
    id: "byzantine_era",
    name: "Byzantine Era",
    image: "/eras/7_BE_cover.webp",
  },
  {
    abbr: "AF",
    gameDesignAge: "AgeOfTheFranks",
    id: "age_of_the_franks",
    name: "Age of the Franks",
    image: "/eras/8_AoF_cover.webp",
  },
  {
    abbr: "FA",
    gameDesignAge: "FeudalAge",
    id: "feudal_age",
    name: "Feudal Age",
    image: "/eras/9_FA_cover.webp",
  },
  {
    abbr: "IE",
    gameDesignAge: "IberianEra",
    id: "iberian_era",
    name: "Iberian Era",
    image: "/eras/10_IE_cover.webp",
  },
  {
    abbr: "KS",
    gameDesignAge: "KingdomOfSicily",
    id: "kingdom_of_sicily",
    name: "Kingdom of Sicily",
    image: "/eras/11_KoS_cover.webp",
  },
  {
    abbr: "HM",
    gameDesignAge: "HighMiddleAges",
    id: "high_middle_ages",
    name: "High Middle Ages",
    image: "/eras/12_HMA_cover.webp",
  },
  {
    abbr: "EG",
    gameDesignAge: "EarlyGothicEra",
    id: "early_gothic_era",
    name: "Early Gothic Era",
    image: "/eras/13_EGE_cover.webp",
  },
  {
    abbr: "LG",
    gameDesignAge: "LateGothicEra",
    id: "late_gothic_era",
    name: "Late Gothic Era",
    image: "/eras/14_LGE_cover.webp",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// MAX QTY PAR BÂTIMENT ET PAR ÈRE — SOURCE DE VÉRITÉ UNIQUE
//
// Trois niveaux de résolution, du plus spécifique au plus général :
//   1. BuildingLevel.max_qty        — porté par le niveau lui-même (data/**)
//   2. WORKSHOP_MAX_QTY             — workshops capital, par ère × position
//   3. MAX_QTY_BY_ERA               — ères >= LG, alimente les niveaux générés
//   4. DEFAULT_MAX_QTY              — fallback si aucune valeur n'est définie
//
// Ne pas redéclarer de table de quantités ailleurs : tout consommateur
// (element-data-loader, data-hydration, configuration-panel) part d'ici.
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Quantité maximale retenue quand aucune valeur n'est définie pour un
 * bâtiment/ère. Remplace le littéral 40 qui était répété dans
 * element-data-loader.ts et data-hydration.ts.
 */
export const DEFAULT_MAX_QTY = 40;

/**
 * Max quantity par ère pour chaque position de workshop capital.
 *
 * ⚠️ SOURCE MANUELLE ASSUMÉE, et elle le reste. L'extraction du domaine
 * Bâtiments (scripts/extract/buildings.ts) reconstitue `max_qty` en cumulant les
 * `IncreaseBuildingLimitRewardDTO` des technologies — mais le game design n'en
 * accorde AUCUN aux ateliers de la capitale (ni à `harbor_large_warehouse`,
 * `harbor_luxurious_seafarer_house`, `ottoman_empire_ship`). Le jeu ne déclare
 * pas leur plafond ; ces valeurs sont relevées à l'écran.
 *
 * Ce n'est donc pas un écart d'extraction à combler : cette table est la source,
 * et `pnpm diff:buildings` la range sous « max_qty sans source côté game design ».
 *
 * Format : { era: [primary, secondary, tertiary] }
 * Tous les workshops d'un même groupe ont les mêmes max_qty.
 *
 * Groupe 0 (BA→RE) : Tailor / Stone Mason / Artisan
 * Groupe 1 (BE→HM) : Scribe / Carpenter / Spice Merchant
 * Groupe 2 (EG→LG) : Jeweler / Alchemist / Glassblower
 */
export const WORKSHOP_MAX_QTY: Partial<
  Record<EraCode, [number, number, number]>
> = {
  // Groupe 0 — max_qty identique pour les 3 workshops
  BA: [1, 1, 1],
  ME: [2, 1, 1],
  CG: [3, 1, 1],
  ER: [4, 1, 1],
  RE: [4, 1, 1],
  // Groupe 1
  BE: [3, 1, 1],
  AF: [4, 1, 1],
  FA: [4, 1, 1],
  IE: [4, 1, 1],
  KS: [4, 1, 1],
  HM: [4, 1, 1],
  // Groupe 2
  EG: [3, 1, 1],
  LG: [4, 1, 1],
} as const;

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
    rural_farm: 14,
    domestic_farm: 12,
    luxurious_farm: 8,
    little_culture_site: 10,
    compact_culture_site: 9,
    moderate_culture_site: 7,
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

/**
 * Les 3 emplacements de bien de chaque ère, par RANG — jamais par bien concret.
 *
 * Alimente les niveaux dynamiques (`generateDynamicLevels`), donc des COÛTS : la
 * même règle que partout ailleurs s'applique, et le garde-fou
 * data/cost-resource-encoding.test.ts la vérifie ici aussi.
 *
 * ⚠️ NE PAS repasser en biens concrets. Deux notions se ressemblent :
 * `ResourceDefinitionDTO.order` (1 | 2 | 3) est un rang de TRI DE CATALOGUE, figé
 * dans le game design et identique sur tous les comptes ; `primary` / `secondary`
 * / `tertiary` est l'ASSIGNATION D'ATELIERS PROPRE À CHAQUE COMPTE, imposée par le
 * jeu au démarrage et différente d'un joueur à l'autre par design — c'est ce qui
 * rend le trading nécessaire. Cette assignation n'existe nulle part dans le game
 * design : elle vit dans `local:buildingSelections` et se résout à l'affichage.
 * Écrire `alabaster_idol` ici imposerait à tous les joueurs l'assignation d'un
 * seul compte.
 *
 * SA est absent : l'Âge de pierre n'a aucun bien (le premier atelier du jeu est
 * `Building_BronzeAge_Workshop_*`). `getGoods` lèvera si on le lui demande,
 * ce qui est le comportement voulu.
 */
export const ERA_GOODS: EraGoodsMap = {
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

/**
 * Clé de bien → son ère et sa position dans `ERA_GOODS` (0, 1, 2).
 *
 * Dérivé de `ERA_GOODS`, jamais redéclaré. Repli d'affichage : quand
 * `getPriorityKeyFromGoodName` ne peut rien dire, il évite qu'un bien perde son
 * regroupement par ère.
 *
 * ⚠️ `ERA_GOODS` étant en RANGS, ce repli est aujourd'hui l'identité pour les
 * biens de la capitale (`primary_ba` → `primary_ba`) et ne s'applique à aucun
 * autre bien. Il ne sert donc plus à rien tant que les coûts restent en rangs —
 * il est conservé tel quel parce que components/total-goods/total-goods-display.tsx
 * et app/technologies/page.tsx le consomment, et que ces deux fichiers ne sont
 * pas dans le périmètre de ce revert.
 */
export const GOOD_ERA_POSITION: Record<string, { era: EraCode; index: 0 | 1 | 2 }> =
  Object.fromEntries(
    Object.entries(ERA_GOODS).flatMap(([era, goods]) =>
      (goods ?? []).map((good, index) => [
        good,
        { era: era as EraCode, index: index as 0 | 1 | 2 },
      ]),
    ),
  );

// ─────────────────────────────────────────────────────────────────────────────
// ERA ORDER + HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/** Ordre chronologique des ères — dérivé de ERAS, ne pas redéclarer ailleurs. */
export const ERA_ORDER: EraCode[] = ERAS.map((era) => era.abbr);

/** `EraCode` → `AgeDefinition.id` du game design. */
export const GAME_DESIGN_AGE_BY_ERA = new Map<EraCode, string>(
  ERAS.map((era) => [era.abbr, era.gameDesignAge]),
);

/** `AgeDefinition.id` du game design → `EraCode`. */
export const ERA_BY_GAME_DESIGN_AGE = new Map<string, EraCode>(
  ERAS.map((era) => [era.gameDesignAge, era.abbr]),
);

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
