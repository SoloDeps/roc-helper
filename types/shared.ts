import type { ImageType } from "@/lib/catalog";

export type PreLGEra =
  | "SA"
  | "BA"
  | "ME"
  | "CG"
  | "ER"
  | "RE"
  | "BE"
  | "AF"
  | "FA"
  | "IE"
  | "KS"
  | "HM"
  | "EG";

export type PreAlliedCity =
  | "egypt"
  | "china"
  | "maya"
  | "vikings"
  | "arabia"
  | "ottoman";

export type PostLGEra = "LG"; // next eras
export type EraCode = PreLGEra | PostLGEra;

export interface Good {
  amount: number;
  resource: string;
}

export interface Costs {
  coins?: number;
  food?: number;
  gems?: number;
  goods?: Good[];
  research_points?: number; // Pour technos
  // allied
  aspers?: number;
  deben?: number;
  wu_zhu?: number;
  rice?: number;
  cocoa?: number;
  pennies?: number;
  dirham?: number;
  // culture sites
  culture_range?: number;
  culture_bonus?: number;
}

// BUILDINGS
export interface BuildingLevel {
  level: number;
  era: EraCode;
  max_qty?: number;
  upgrade?: Costs;
  construction?: Costs;
}

export interface BuildingData {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  imageName: string;
  levels: BuildingLevel[]; // TOUS les niveaux, même 40+
}

// ============================================================================
// REWARDS
// ============================================================================

/**
 * Source d'image pour un reward — discriminated union sur `kind`
 *
 * - techno   : image locale du techno tree  → /images/technos/{era}/{techId}.webp
 * - wiki     : image du wiki RoC            → getWikiImageUrl(imageName, level != null, level ?? 1)
 * - catalog  : icône plate dans imagesUrl   → imagesUrl[imgType]  (invert optionnel)
 * - local    : chemin absolu direct         → path  (invert optionnel)
 * - good     : good sélectionné par le user → getGoodNameFromPriorityEra(priority, era_du_tech, selections)
 */
export type RewardImgSource =
  | { kind: "techno"; techId: string }
  | { kind: "wiki"; imageName: string; level?: number }
  | { kind: "catalog"; imgType: ImageType; invert?: boolean }
  | { kind: "local"; path: string; invert?: boolean }
  | { kind: "good"; priority: "primary" | "secondary" | "tertiary" };

export interface Reward {
  title: string; // ex: "Small Home"
  desc: string; // ex: "Unlocks a Small Home upgrade"
  img: RewardImgSource;
}

// TECHNOS
export interface TechnoData {
  id: string;
  name: string;
  column: number;
  allied?: PreAlliedCity;
  costs: Costs;
  required?: string[]; // IDs des technos nécessaires
  rewards?: Reward[]; // Structured rewards (nouveau format)
}

// OTTOMAN - AREAS
export interface OttomanAreaData {
  [key: number]: Good[];
}

// OTTOMAN - TRADE POSTS
export type TradePostLevels = {
  [level: number]: Good[];
} & {
  1: Good[]; // unlock cost (peut être vide)
  2: Good[];
  3: Good[];
  4: Good[];
  5: Good[];
};

export interface TradePostData {
  area: number;
  name: string;
  resource: string; // "wheat", "pomegranate", etc.
  levels: TradePostLevels; // 5 niveaux min, 6 pour les non-premium
}

// ERA GOODS
/** Ressources d'une ère : [good1, good2, good3] */
export type EraGoods = [string, string, string];

/** Map era code → ses 3 goods. Centralisée dans config.ts. */
export type EraGoodsMap = Partial<Record<EraCode, EraGoods>>;

// data types
export interface EraDetail {
  /** Nom interne utilisé comme clé dans building_table.era (ex: "LateGothicEra") */
  internalName: string;
  /** Code court utilisé pour max_qty_by_era (ex: "LG") */
  code: string;
  /** Exactement 3 ressources de biens pour cette ère */
  goods: [string, string, string];
}
