// ============================================================
// ROC Helper – Grille de ville : forme de l'extraction générée
//
// Décrit ce que `scripts/extract/city-grid.ts` produit à partir de
// `source/gamedesign.json`. Consommateur : le Layout Builder.
//
// Références : docs/game-schema/03-batiments.md §7 (expansions, CityInit)
//              docs/game-schema/01-socle.md (CityDefinitionDTO)
//              docs/game-schema/00-conventions.md §C3 (x/y/expansionSize en
//                nombre, jamais en string), §C5 (cityInitDefinition est une
//                copie intégrale, à lire comme une référence résolue)
//
// ⚠️ CE QUI STRUCTURE CE DOMAINE — `expansionSubType` partitionne la ville.
//
// Une ville n'est PAS une grille unique. `expansionSubType` sépare des
// surfaces disjointes, chacune avec sa propre bounding box :
//
//   City_Capital  →  120 cases sans subType  x[3..47]  y[11..47]   (12x10)
//                 →   42 cases HARBOR        x[23..47] y[-25..-5]  (port)
//   City_Vikings  →  116 cases sans subType + 36 cases WATER
//
// Le Layout Builder doit traiter chaque surface comme une grille à part
// entière : c'est ce que l'ancien prototype appelait un « scope » (Capital vs
// Harbor), et c'est aussi l'origine de la règle de placement terre/eau.
// D'où `CityGridSurface` plutôt qu'une bounding box unique par ville.
// ============================================================

/**
 * `expansionType` — 4 valeurs observées sur 234 des 832 expansions.
 *
 * ⚠️ 598 expansions n'ont AUCUN type (03-batiments.md §7.1). L'absence est
 * modélisée par `null`, jamais par une valeur par défaut inventée : les
 * données ne déclarent pas ce que « pas de type » signifie. C'est
 * `isBuildable()` (resolvers/city-grid.ts) qui tranche, à un seul endroit.
 */
export type ExpansionTypeCode =
  | "BLOCKER"
  | "LINKED"
  | "CONNECTOR"
  | "DETACHED_CONNECTOR";

/**
 * `expansionSubType` — surface d'une case. `LAND` est notre nom pour
 * l'ABSENCE de `expansionSubType` (678/832) : contrairement à
 * `expansionType`, l'absence est ici sémantiquement pleine (le terrain
 * ordinaire), puisque HARBOR et WATER décrivent tous deux un milieu aquatique
 * clairement délimité. C'est une convention de notre part, pas une valeur du
 * game design.
 */
export type SurfaceCode = "LAND" | "HARBOR" | "WATER";

/** Rotation d'un bâtiment posé, en degrés. */
export type BuildingRotation = 0 | 90 | 180 | 270;

/** Rectangle en unités MONDE (sous-cases), pas en cases d'expansion. */
export interface CityGridBounds {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Une case d'expansion. Occupe `expansionSize`² unités monde depuis (x, y). */
export interface ExpansionSlotExtract {
  id: string;
  /** Origine de la case, en unités monde. Peut être négative (port Capital). */
  x: number;
  y: number;
  /** `null` = les 598 expansions sans `expansionType`. */
  type: ExpansionTypeCode | null;
  surface: SurfaceCode;
  /**
   * `LinkedExpansionComponentDTO.linkedExpansionDefinitionId` — 30 liens sur
   * 26 expansions (une en porte 5). Toujours résolus vers une `Expansion.id`
   * de la MÊME ville ; l'extracteur le vérifie et signale sinon.
   */
  linkedTo: string[];
}

/**
 * Bâtiment posé d'office par le déblocage d'une case
 * (`finish.rewards[].PlaceConstructedBuildingRewardDTO`) — 9 occurrences,
 * toutes sur City_Arabia (Noria / Oasis). Ce sont les entités « fixes » du
 * Layout Builder : ni déplaçables ni supprimables. Elles proviennent des
 * données, elles ne se saisissent pas à la main.
 */
export interface FixedBuildingExtract {
  /**
   * Case dont le déblocage pose ce bâtiment. ⚠️ C'est toujours une case
   * CONNECTOR (9/9), donc NON constructible : un bâtiment fixe ne se rattache
   * pas à la grille jouable par cette case, mais par sa géométrie.
   */
  expansionId: string;
  buildingId: string;
  x: number;
  y: number;
  /**
   * ⚠️ Sérialisé en ENUM STRING (`BuildingRotationType_ROTATION_90`), pas en
   * nombre — contrairement aux autres champs géométriques du domaine (C3).
   * Normalisé ici en degrés. Absent sur 4 des 9 = 0 (omission protobuf d'une
   * valeur par défaut, pas une donnée manquante).
   *
   * À 90° et 270°, l'emprise du bâtiment a ses dimensions INVERSÉES par
   * rapport à `BuildingDefinitionDTO.width/height`.
   */
  rotation: BuildingRotation;
}

/**
 * `CityCultureAreaComponentDTO` — zone de culture FIXE de la ville, offerte
 * par le décor et indépendante des bâtiments posés. Seules Arabia (6) et
 * Egypt (2) en ont ; les 4 autres villes n'en ont aucune.
 */
export interface CultureAreaExtract {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  points: number;
}

/** Une surface disjointe d'une ville — l'unité de grille du Layout Builder. */
export interface CityGridSurface {
  surface: SurfaceCode;
  /** Cases constructibles de cette surface (cf. `isBuildable`). */
  buildableCount: number;
  /**
   * Bounding box des seules cases CONSTRUCTIBLES, en unités monde. Les
   * BLOCKER et CONNECTOR en sont exclus : les inclure étirerait le cadrage
   * caméra sur des zones où l'on ne peut rien poser.
   */
  bounds: CityGridBounds;
  /** `bounds` exprimée en cases d'expansion — sert aux assertions de forme. */
  cols: number;
  rows: number;
  /**
   * `true` si les cases constructibles ne pavent pas entièrement `bounds`
   * (`buildableCount < cols * rows`). Capital/LAND est plein (120 = 12×10),
   * le port ne l'est pas — la grille n'est donc pas toujours rectangulaire.
   */
  sparse: boolean;
  /**
   * Âge (`AgeDefinition.id`) du plus ancien bâtiment de la palette de cette
   * surface — l'ère à partir de laquelle elle devient jouable.
   *
   * ⚠️ DÉDUIT, jamais déclaré. Aucun champ du game design ne dit « le Port
   * s'ouvre à EarlyGothicEra » ; ce qui est mesuré, c'est qu'aucun des 22
   * bâtiments HARBOR n'existe avant. Corroboré par le jeu (Port accessible en
   * EG/LG, eau viking en FA/IE). `null` si la palette n'a aucun âge lisible.
   */
  minAge: string | null;
  /**
   * Taille de la palette de cette surface — les `BuildingDefinitionDTO` dont
   * `expansionSubType` correspond. LAND en concentre l'écrasante majorité.
   */
  buildingCount: number;
}

export interface CityGridExtract {
  cityId: string;
  /**
   * `Base.Cities.<id>_Name` (6/6 traduites). Repli sur `cityId` si la clé
   * disparaissait — C7 : libellé absent, pas erreur. Le repli est signalé
   * dans `warnings`.
   */
  cityLabel: string;
  /** Côté d'une case d'expansion, en unités monde. 3 ou 4 selon la ville. */
  expansionSize: number;
  slots: ExpansionSlotExtract[];
  surfaces: CityGridSurface[];
  /**
   * `InitialGridComponentDTO.initialGridAreas[]` — cases débloquées au
   * démarrage. 58/58 résolues vers une `Expansion.id` sur les 6 villes.
   */
  defaultUnlockedIds: string[];
  cultureAreas: CultureAreaExtract[];
  fixedBuildings: FixedBuildingExtract[];
  /** Constats non bloquants relevés à l'extraction. Jamais comblés. */
  warnings: string[];
}

export interface CityGridExtractBundle {
  /** `content[0].checksum` — trace la version de game design extraite. */
  checksum: string;
  /** `content[0].serverVersion`. */
  serverVersion: string;
  cities: CityGridExtract[];
  warnings: string[];
}
