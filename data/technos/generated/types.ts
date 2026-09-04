// ============================================================
// ROC Helper – Technologies : forme de l'extraction générée
//
// Décrit ce que `scripts/extract/technologies.ts` produit à partir de
// `source/gamedesign.json` + `source/loca.json`.
//
// Deux couches cohabitent dans le module généré, comme pour les Wonders :
//
//  1. `TechnologyExtract` — la projection complète et fidèle du game
//     design. Tout ce que le game design porte sur une technologie est
//     conservé, que l'app le consomme aujourd'hui ou non.
//
//  2. `TechnoRawEntry` — la projection étroite, alignée sur `TechnoData`
//     (`types/shared.ts`, contrat décrit en docs/data-contracts.md §2.1).
//     C'est la seule couche que l'UI verra le jour de la bascule.
//
// Référence : docs/game-schema/04-technologies.md
//             docs/game-schema/00-conventions.md §C3 (int64 en string)
//             docs/data-contracts.md §2.1 (contrat de forme côté app)
// ============================================================

// ─── Coûts ────────────────────────────────────────────────────────────────────

/**
 * Une ligne de `start.resourceChanges[]`, telle qu'écrite par le game design.
 *
 * `amount` est rendu POSITIF ici : le game design l'écrit négatif (c'est un
 * changement de ressource appliqué au joueur), l'app raisonne en coût.
 * `definitionId` n'est pas traduit — `DYN|IberianEra_Good1` reste tel quel ;
 * la traduction vers le vocabulaire du projet (`primary_ie`) n'a lieu que dans
 * `TechnoRawEntry`.
 */
export interface TechnologyCostLine {
  definitionId: string;
  amount: number;
}

// ─── Récompenses ──────────────────────────────────────────────────────────────

/**
 * Une récompense de `finish.rewards[]`, normalisée.
 *
 * 28 `@type` distincts se partagent 1 260 récompenses (04-technologies §3.2).
 * Les typer un par un n'apporterait rien tant que l'app n'en consomme aucun :
 * la forme retenue garde le `@type` court, extrait les deux champs partagés
 * dont le sens est ambigu, et laisse le reste verbatim dans `payload`.
 *
 * ⚠️ Piège T1 (§3.1) : `baseData.id` désigne TANTÔT la cible débloquée
 * (`UnlockBuildingUpgradeRewardDTO` → `Building.id`), TANTÔT l'identité propre
 * de la récompense (`InstantUpgradeRewardDTO` → id synthétique). Le sens dépend
 * du `@type` porteur, donc il est tranché à l'extraction et porté par deux
 * champs distincts plutôt que par un seul champ au sens variable.
 *
 * ⚠️ Piège T2 (§3.1) : `hidden` vit tantôt dans `baseData`, tantôt à la racine
 * de la récompense. Les deux emplacements sont fusionnés ici.
 */
export interface TechnologyReward {
  /** `@type` en forme courte, ex. `IncreaseBuildingLimitRewardDTO`. */
  type: string;
  /** `baseData.id` quand c'est une RÉFÉRENCE vers une entité racine ; `null` sinon. */
  targetId: string | null;
  /** `baseData.id` quand c'est l'identifiant PROPRE de la récompense ; `null` sinon. */
  ownId: string | null;
  /** `baseData.hidden` ou `hidden` à la racine, fusionnés. */
  hidden: boolean;
  /** `cities[]` de la récompense — souvent plus précis que celui de la technologie (T3). */
  cities: string[];
  /** Champs propres au `@type`, verbatim, moins `@type` / `baseData` / `cities`. */
  payload: Record<string, unknown>;
}

// ─── Bonus ────────────────────────────────────────────────────────────────────

/**
 * Rendu d'une valeur de bonus. Même union que `WonderBonusFormat`
 * (data/wonders/generated/types.ts) et que `BonusFormat` côté app : le format
 * est porté par la donnée, jamais redérivé du `type`.
 */
export type TechnologyBonusFormat = "percent" | "integer" | "flat";

/**
 * Restriction de cible déclarée par le game design. Même union que
 * `WonderBonusScope` — un même `kind` doit vouloir dire la même chose des deux
 * côtés.
 */
export type TechnologyBonusScope =
  | { kind: "city"; value: string }
  | { kind: "buildingGroup"; value: string }
  | { kind: "unitType"; value: string };

/**
 * Un bonus permanent accordé par une technologie.
 *
 * ⚠️ Contrairement aux wonders, une technologie ne monte pas en niveau : le
 * bonus est un scalaire, pas une courbe de 30 valeurs. D'où `value` et non
 * `values[]`.
 *
 * Le vocabulaire (`type`, `format`, `scope`) est celui de `resolvers/bonus.ts`,
 * partagé avec les Wonders. Aucun dictionnaire n'est recréé ici : une clé
 * produite par cet extracteur doit exister dans `BONUS_LABELS`.
 */
export interface TechnologyBonusExtract {
  /** Clé canonique snake_case pilotant `BONUS_LABELS` (resolvers/bonus.ts). */
  type: string;
  icons: [string, string | null];
  value: number;
  format: TechnologyBonusFormat;
  /** Restriction déclarée par le game design ; `null` quand il n'y en a pas. */
  scope: TechnologyBonusScope | null;
  /** Rang 1-based parmi les bonus de MÊME `type` portés par cette technologie. */
  instance: number;
  /** Index dans `TechnologyExtract.rewards[]` de la récompense d'origine. */
  sourceRewardIndex: number;
}

// ─── L'extraction ─────────────────────────────────────────────────────────────

export interface TechnologyExtract {
  // Identité
  /** `TechnologyDefinitionDTO.id`. Seule clé fiable — `name` est en doublon (T6). */
  id: string;
  /**
   * Identifiant côté projet, `{abbr}_{index}` (ex. `sa_0`).
   * ⚠️ Ce n'est PAS une donnée du game design : c'est la convention d'ID de
   * l'app (docs/data-contracts.md §2.1), reconstruite ici pour que la donnée
   * générée soit comparable à la donnée saisie à la main. `index` est le rang
   * de la technologie dans son âge, trié par `(column, order)`.
   */
  code: string;
  /** `Base.Technologies.<id>_Name`. Repli sur `TechnologyDefinitionDTO.name` si absent. */
  name: string;
  /** `TechnologyDefinitionDTO.name` — PascalCase, non affichable. */
  rawName: string;
  /** `Base.Technologies.<id>_Desc`. Vide quand la clé n'existe pas (C7). */
  description: string;

  // Position
  /** `AgeDefinition.id`, ex. `IberianEra`. */
  age: string;
  /** Identifiant d'ère côté projet, ex. `iberian_era` — clé de `TECHNOLOGY_REGISTRY`. */
  eraId: string;
  /** Abréviation 2 lettres minuscules, ex. `ie` — préfixe de `code`. */
  eraAbbr: string;
  /** `column` du game design, 1..15. */
  column: number;
  /** `column - 1` : l'app compte les colonnes à partir de 0 (§2.1). */
  uiColumn: number;
  /** `order` du game design, 1..4 — rang vertical dans la colonne. */
  order: number;

  // Rattachement
  /** `cities[]`. Vide sur 44 technologies (T3). */
  cities: string[];
  /**
   * Cité alliée côté projet (`egypt` | `china` | `maya` | `vikings` | `arabia`
   * | `ottoman`), ou `null` pour la capitale.
   *
   * ⚠️ `ottoman` ne vient PAS des données : c'est la convention du projet pour
   * les 44 technologies sans `cities` (branche commerce/maritime, T3). Aucun
   * champ ne la déclare — voir 04-technologies.md §1.4.
   */
  allied: string | null;

  // Coûts et prérequis
  costs: TechnologyCostLine[];
  /** `start.requirements[].id` — des `Technology.id`, pas des identités (§2.2). */
  requires: string[];
  /** Les mêmes, traduits en `code`. */
  requiresCodes: string[];
  /**
   * Sous-ensemble de `requiresCodes` pointant vers un AUTRE âge.
   * 15 arêtes sur 745 (§2.2). L'app ne les affiche pas — elle ne cherche les
   * prérequis que dans l'ère sélectionnée — d'où leur isolement ici.
   */
  crossAgeRequiresCodes: string[];

  // Effets
  rewards: TechnologyReward[];
  bonuses: TechnologyBonusExtract[];
  /** `finish.requirements[]` — n'existe que sur les 5 technologies « Rise of X » (§5). */
  finishRequirements: { type: string; regions: string[] }[];

  /** Ce que le game design laisse indéterminé, ou ce que la projection a laissé tomber. */
  warnings: string[];
}

// ─── Projection UI ────────────────────────────────────────────────────────────

/** `{ amount, resource }` — l'ordre des clés de `Good` dans types/shared.ts. */
export interface TechnoRawGood {
  amount: number;
  resource: string;
}

/** Sous-ensemble de `Costs` (types/shared.ts) qu'une technologie peut porter. */
export interface TechnoRawCosts {
  research_points?: number;
  coins?: number;
  food?: number;
  goods?: TechnoRawGood[];
}

/**
 * Projection étroite, alignée sur `TechnoData` (types/shared.ts).
 *
 * ⚠️ `rewards` est absent volontairement : le game design ne porte ni `title`,
 * ni `desc`, ni `img` — ce sont trois champs de présentation inventés par le
 * projet (docs/data-contracts.md §2.1). Tant qu'une table de correspondance
 * `récompense → visuel` n'existe pas, `data/technos/*.ts` reste la source des
 * récompenses affichées ; l'extraction fidèle les porte dans
 * `TechnologyExtract.rewards`.
 *
 * ⚠️ `required` ne contient que les prérequis DU MÊME ÂGE, ce qui est le
 * contrat actuel de l'app (§2.1, contrainte 2). Les 15 arêtes inter-âges sont
 * dans `TechnologyExtract.crossAgeRequiresCodes`.
 */
export interface TechnoRawEntry {
  id: string;
  name: string;
  column: number;
  allied?: string;
  costs: TechnoRawCosts;
  required: string[];
}

// ─── Le bundle ────────────────────────────────────────────────────────────────

/** Un âge portant des technologies. 14 sur les 16 âges du jeu (§1.1). */
export interface TechnologyAgeExtract {
  age: string;
  eraId: string;
  eraAbbr: string;
  /** Rang chronologique, 1-based — l'ordre de `ERAS` dans data/config.ts. */
  index: number;
  technologyCount: number;
}

export interface TechnologyExtractBundle {
  generatedFrom: {
    gameDesignChecksum: string | null;
    locaChecksum: string | null;
    locale: string | null;
  };
  ages: TechnologyAgeExtract[];
  technologies: TechnologyExtract[];
}
