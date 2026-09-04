// ============================================================
// ROC Helper – Bâtiments : forme de l'extraction générée
//
// Décrit ce que `scripts/extract/buildings.ts` produit à partir de
// `source/gamedesign.json` + `source/loca.json`.
//
// Deux couches cohabitent dans le module généré, comme pour les Wonders :
//
//  1. `BuildingChainExtract` — projection complète et fidèle. Tout ce que le
//     game design expose sur un bâtiment y est conservé, qu'il soit consommé
//     ou non par l'app aujourd'hui (production, boosts, culture, ouvriers…).
//
//  2. `BuildingRawEntry` — projection étroite alignée sur `BuildingData`
//     (types/shared.ts), c'est-à-dire ce que `ELEMENT_DATA_REGISTRY` expose
//     au Calculator. Les bonus n'y figurent pas : `BuildingData` n'a pas de
//     champ pour eux.
//
// Références : docs/game-schema/03-batiments.md
//              docs/game-schema/02-dynamic.md
//              docs/game-schema/00-conventions.md §C3 (int64 en string), §C9 (paliers)
//              docs/data-contracts.md §1.1 a) (forme attendue côté app)
// ============================================================

// ─── Unité d'identité : la CHAÎNE, pas la définition ──────────────────────────
//
// 03-batiments.md §1.1 : chaque niveau d'un bâtiment est une
// `BuildingDefinitionDTO` distincte, reliée à la suivante par
// `UpgradeComponentDTO.target`. Un « bâtiment » au sens de l'app
// (`BuildingData`) est donc une CHAÎNE de définitions, identifiée par le couple
// `(cities[0], group)` — le seul couple stable d'un bout à l'autre de la chaîne,
// puisque `age` change en cours de route (§1.1) et que `id` change à chaque
// maillon.

/** `City_Capital|smallHome` — clé de chaîne, `${city}|${group}`. */
export type BuildingChainKey = string;

// ─── Vocabulaire de bonus (partagé) ───────────────────────────────────────────
//
// Mêmes noms, mêmes formats que `resolvers/bonus.ts`. Aucun dictionnaire
// parallèle : `BuildingBonus.type` est une clé de `BONUS_LABELS`, ou bien elle
// est signalée dans `BuildingExtractBundle.bonusGaps` en attente de validation.

/**
 * Identique à `BonusFormat` (data/wonders/types.ts).
 *
 * ⚠️ `absolute` est le membre que ce domaine a fait entrer dans l'union : une
 * SORTIE de production par cycle, pas un modificateur. Wonders et Technologies
 * n'en produisent pas et gardent des mirroirs plus étroits.
 */
export type BuildingBonusFormat = "percent" | "integer" | "flat" | "absolute";

/**
 * Restriction de cible d'un bonus.
 *
 * `city` / `buildingGroup` / `unitType` reprennent trait pour trait les trois
 * variantes de `WonderBonusScope`. `buildingType` est la seule ajoutée par ce
 * domaine : `BoostResourceComponentDTO.buildingType` (2 occurrences, vikings)
 * n'a pas d'équivalent côté Wonders.
 *
 * `unit` — 3 occurrences, toutes les 3 le Crocodile Aztèque (`Boost4_Building_
 * EventAztec_Evolving_AztecMainTemple_1`, `Heritage_Aztec_UnitBoost_7`,
 * `Heritage_Aztec_UnitBoost_10`) : le DTO source porte un `unitType` générique
 * ("cavalry", la classe mécanique réelle — confirmé par la description en jeu
 * de l'unité) MAIS aussi un `unitDefinitionId` précis, le bâtiment qui porte le
 * boost ne produisant QUE cette unité-là. Le jeu affiche alors l'icône du
 * Crocodile, pas celle, générique, de la cavalerie — `value` porte ce
 * `unitDefinitionId`, jamais un `unitType`.
 */
export type BuildingBonusScope =
  | { kind: "city"; value: string }
  | { kind: "buildingGroup"; value: string }
  | { kind: "buildingType"; value: string }
  | { kind: "unitType"; value: string }
  | { kind: "unit"; value: string };

/** Une ligne `{ when, then }` de table dynamique, telle qu'écrite. */
export interface BuildingCurveStep {
  when: number;
  /** `null` quand le `then` est vide — « pas de bonus », pas « zéro ». */
  value: number | null;
}

/**
 * Courbe indexée par le niveau RUNTIME d'un bâtiment `evolving` (§1.2).
 *
 * ⚠️ Cet index n'a rien à voir avec `BuildingLevelExtract.level`, qui est le
 * rang dans la chaîne d'upgrade (mécanique A). Les deux ne sont jamais fusionnés
 * — c'est la règle explicite de 03-batiments.md §1.2.
 */
export interface BuildingCurve {
  indexedBy: "buildingLevel";
  definitionId: string;
  /** Facteur d'échelle porté par le composant. `null` si le schéma n'en a pas. */
  modifier: number | null;
  table: BuildingCurveStep[];
  /** `dynamicFormulaChangeCase.formula` — prolonge la table (02-dynamic.md §5.1). */
  formula: string | null;
  valueLimit: number | null;
  /**
   * `DynamicLuaLongDefinitionDTO.luaScript`, quand la valeur n'est pas tabulée
   * du tout mais calculée (2 cas : `evolvingAztecGardenBath`, `evolvingBabaYaga`).
   * `table` est alors vide et `resolved` vient du script.
   */
  luaScript: string | null;
  /**
   * Index 0 = niveau 1 … index `maxLevel - 1` = `maxLevel`.
   *
   * Table par palier (C9) sur sa plage, **formule au-delà du dernier `when`**
   * (02-dynamic.md §5.1). En dessous du premier `when` : `null`, aucun palier
   * applicable — D13, ne pas extrapoler.
   */
  resolved: (number | null)[];
  /** `modifier × resolved[i]`, ou `resolved[i]` si `modifier` est `null`. */
  effective: (number | null)[];
}

/**
 * Un âge déclaré, et la courbe par niveau qui en dépend.
 *
 * Deux DTO produisent cette forme, et l'axe n'a PAS le même sens dans les deux :
 *  - `BuildingAgeDynamicChangeDTO` (bâtiments `evolving`) — l'âge est celui de
 *    l'INSTANCE, figé à l'obtention ;
 *  - `PlayerAgeDynamicChangeDTO` (Heritage Vault) — l'âge est l'ère COURANTE du
 *    joueur, lue au runtime.
 * `BuildingAgeCurve.indexedBy` les distingue ; la lecture, elle, est identique
 * (`resolvers/building-curves.ts`), d'où la structure commune.
 */
export interface BuildingAgeCurveEntry {
  /** L'âge tel qu'écrit en `when`. */
  age: string;
  /**
   * Tous les âges projet que cette entrée gouverne, palier d'âges déjà appliqué
   * (C9 sur l'ordre des âges) : un lecteur n'a donc pas à connaître cet ordre.
   * Couvre les tables qui s'arrêtent à `RomanEmpire` comme les 3 qui sautent
   * `BronzeAge`.
   */
  appliesTo: string[];
  /**
   * Ressources en clé projet auxquelles le montant s'applique à cet âge.
   * ⚠️ Varie d'un âge à l'autre : les productions « biens de l'ère précédente »
   * versent `primary_ba` sous l'âge `MinoanEra`. Rang seul (`primary`) quand le
   * game design ne date pas le bien (`GoodRewardDTO.number`).
   */
  resources: string[];
  curve: BuildingCurve;
}

/**
 * Courbe à DEUX entrées : l'âge, puis le niveau runtime.
 *
 * ⚠️ L'âge d'un `evolving` est propre à CHAQUE INSTANCE — figé à l'obtention,
 * il ne monte que par jeton d'évolution. Ce n'est donc pas l'ère courante du
 * joueur, et l'extraction ne résout surtout pas vers une valeur unique : elle
 * livre la table complète, que le consommateur interroge avec le couple
 * (âge, niveau) de l'instance qu'il a sous la main.
 */
export interface BuildingAgeCurve {
  /**
   * Ce que le PREMIER axe indexe.
   *
   * `buildingAge` — l'âge figé de l'instance (`BuildingAgeDynamicChangeDTO`,
   * seule valeur produite par l'extraction Bâtiments).
   * `playerAge` — l'ère courante du joueur (`PlayerAgeDynamicChangeDTO`),
   * produite par l'extraction Heritage Vault, dont le bâtiment-marqueur n'a pas
   * d'âge d'instance. Membre AJOUTÉ, rien de retiré : `resolveByAgeAndLevel()`
   * ne lit pas ce champ et se comporte à l'identique sur les deux.
   */
  indexedBy: "buildingAge" | "playerAge";
  definitionId: string;
  entries: BuildingAgeCurveEntry[];
}

/**
 * Un bonus porté par un niveau de bâtiment.
 *
 * `value` et `curve` s'excluent en pratique : une valeur figée d'un côté, une
 * table par niveau runtime de l'autre. Les deux peuvent être `null` quand le
 * game design ne donne qu'une référence dynamique non résolue — le bonus est
 * alors conservé pour ce qu'il déclare, sans montant inventé.
 */
export interface BuildingBonus {
  /** Clé canonique de `BONUS_LABELS` (resolvers/bonus.ts). */
  type: string;
  format: BuildingBonusFormat;
  scope: BuildingBonusScope | null;
  /** Rang parmi les bonus de même `type` sur le même niveau — cf. `bonusKey()`. */
  instance: number;
  /** `components[].id`, ou `null` pour les 3 composants qui n'en portent pas (§3). */
  componentId: string | null;
  /** `@type` du composant porteur, forme courte. */
  componentType: string;
  value: number | null;
  curve: BuildingCurve | null;
  /**
   * Renseignée à la place de `curve` quand la valeur dépend de l'âge figé de
   * l'instance autant que de son niveau. `resource` vaut alors `null` : la
   * ressource vit sur chaque entrée d'âge, puisqu'elle change avec lui.
   */
  ageCurve: BuildingAgeCurve | null;
  /**
   * Période de production en secondes (`ProductionComponentDTO.duration`).
   * `null` pour tout ce qui n'est pas une production.
   */
  periodSeconds: number | null;
  /** Ressource concernée, en clé projet (`primary_ba`, `coins`…). `null` sinon. */
  resource: string | null;
}

/**
 * Une source de bonus que le vocabulaire partagé ne sait pas nommer.
 *
 * Rien n'est ajouté à `BONUS_LABELS` sur la seule foi de l'extraction : ce que
 * l'extracteur rencontre sans équivalent existant atterrit ici, avec le nom
 * qu'il PROPOSE, pour validation avant adoption.
 */
export interface BuildingBonusGap {
  chainKey: BuildingChainKey;
  /** Un exemple de définition portant le cas, pour aller le lire dans la source. */
  gameDesignId: string;
  componentType: string;
  /** Ce que le game design déclare, en clair. */
  descriptor: string;
  /** Nom proposé, PAS encore dans `BONUS_LABELS`. */
  proposedType: string;
  proposedFormat: BuildingBonusFormat;
  /** Pourquoi aucune clé existante ne convient. */
  reason: string;
  /** Nombre d'occurrences agrégées sous cette même proposition. */
  occurrences: number;
}

// ─── Coûts ────────────────────────────────────────────────────────────────────

/** Une ligne de coût, montant POSITIF (le game design écrit des négatifs). */
export interface BuildingCostLine {
  /** Identifiant de game design (`coins`, `premium`, `DYN|BronzeAge_Good1`…). */
  definitionId: string;
  amount: number;
}

// ─── Un maillon de chaîne ─────────────────────────────────────────────────────

export interface BuildingLevelExtract {
  /** `BuildingDefinition.id`. */
  gameDesignId: string;
  /**
   * `BuildingDefinition.level`. `null` sur les 22 définitions qui n'en portent
   * pas (§1.4) ; `chainIndex` prend alors le relais pour l'ordre.
   */
  level: number | null;
  /** Rang dans la chaîne, 0-based, obtenu en suivant les `target`. */
  chainIndex: number;
  age: string | null;
  /** Code d'ère projet (`SA`…`LG`). `null` pour `DawnAge` et les `evolving`. */
  eraAbbr: string | null;
  /**
   * Limite de construction pour ce groupe à cette ère — somme cumulée des
   * `IncreaseBuildingLimitRewardDTO` des technologies jusqu'à l'âge inclus.
   * `null` quand aucune technologie n'en accorde.
   */
  maxQty: number | null;
  width: number | null;
  height: number | null;
  freeProductionSlots: number | null;
  /** Coût de `ConstructionComponentDTO.start` de CE maillon. */
  construction: BuildingCostLine[] | null;
  /**
   * Coût pour ARRIVER à ce maillon, c'est-à-dire le
   * `UpgradeComponentDTO.start` du maillon PRÉCÉDENT.
   *
   * ⚠️ Décalage volontaire : le game design attache le coût au niveau de
   * départ, `BuildingData` l'attache au niveau d'arrivée (vérifié sur
   * `Building_StoneAge_Home_Small_1`, dont l'upgrade à 10 pièces / 30 vivres
   * est le `upgrade` du niveau 2 côté app).
   */
  upgrade: BuildingCostLine[] | null;
  /** Le maillon dont provient `upgrade`. */
  upgradeFromId: string | null;
  /** `ResearchRequirementDTO.id` des `start.requirements` (construction + upgrade). */
  unlockedBy: string[];
  bonuses: BuildingBonus[];
  warnings: string[];
}

/** `LevelUpComponentDTO` — progression runtime interne des `evolving` (§1.2 / §1.3). */
export interface BuildingLevelUpExtract {
  componentId: string;
  /** `null` sur les 11 composants sans plafond déclaré (point ouvert B1). */
  maxLevel: number | null;
  starLevels: number[] | null;
  /** `start.dynamicChangeDefinitionId` — barème de coût de montée. */
  upgradeCostSchemeId: string | null;
  /**
   * Le barème ci-dessus résolu : montant à payer POUR QUITTER le niveau `i + 1`,
   * en `EvolutionToken` propre au bâtiment (seule monnaie de montée des 44).
   *
   * ⚠️ Montants POSITIFS, comme `BuildingCostLine` — le game design écrit des
   * négatifs, `modifier` vaut donc `-1`. L'index `maxLevel - 1` n'a pas de sens :
   * on ne quitte pas le dernier niveau.
   */
  upgradeCost: BuildingCurve | null;
}

// ─── Une chaîne ───────────────────────────────────────────────────────────────

/**
 * Pourquoi une chaîne n'est pas projetée vers `BuildingData`.
 *
 * `app` = projetée. Les autres valeurs sont des classes déclarées : une chaîne
 * qui n'entre dans aucune d'elles ET n'a pas de clé de registre produit un
 * avertissement, plutôt que de disparaître en silence.
 */
export type BuildingScope =
  | "app"
  | "cityHall"
  | "collectable"
  | "evolving"
  | "decoration"
  | "harborInfrastructure"
  | "extractionPoint"
  | "presetIrrigation"
  | "undeclared";

export interface BuildingChainExtract {
  chainKey: BuildingChainKey;
  city: string;
  group: string;
  /** `BuildingDefinition.type` — 28 valeurs (§2.1). */
  buildingType: string;
  /** Libellé de `Base.BuildingGroups.<group>_Name`, ou du maillon racine à défaut. */
  name: string;
  /** Libellé du maillon racine (`Base.Buildings.<id>_Name`) — diverge parfois du groupe. */
  rootName: string;
  scope: BuildingScope;
  /** Clé de `ELEMENT_DATA_REGISTRY`, `null` hors périmètre app. */
  registryKey: string | null;
  /** Champs de présentation projet — voir `PROJECT_PRESENTATION` dans l'extracteur. */
  id: string | null;
  category: string | null;
  subcategory: string | null;
  imageName: string | null;
  levelUp: BuildingLevelUpExtract | null;
  levels: BuildingLevelExtract[];
  warnings: string[];
}

// ─── Projection étroite (`BuildingData`) ──────────────────────────────────────

export interface BuildingRawGood {
  amount: number;
  resource: string;
}

/**
 * Miroir de `Costs` (types/shared.ts), restreint aux clés qu'un bâtiment peut
 * porter. `research_points` n'y figure pas : aucun coût de bâtiment n'en porte.
 */
export interface BuildingRawCosts {
  coins?: number;
  food?: number;
  gems?: number;
  aspers?: number;
  deben?: number;
  wu_zhu?: number;
  rice?: number;
  cocoa?: number;
  pennies?: number;
  dirham?: number;
  goods?: BuildingRawGood[];
}

export interface BuildingRawLevel {
  level: number;
  era: string;
  max_qty?: number;
  construction?: BuildingRawCosts;
  upgrade?: BuildingRawCosts;
}

/** Aligné sur `BuildingData` (types/shared.ts), plus la clé de registre. */
export interface BuildingRawEntry {
  /** Clé de `ELEMENT_DATA_REGISTRY` (`capital_small_home`). */
  key: string;
  id: string;
  name: string;
  category: string;
  subcategory: string;
  imageName: string;
  /** `BuildingChainExtract.buildingType`, repris tel quel. */
  buildingType: string;
  /** Empreinte au sol de la chaîne — identique sur les 693 définitions d'une même chaîne. */
  width: number | null;
  height: number | null;
  levels: BuildingRawLevel[];
}

// ─── Ressources à jauge ───────────────────────────────────────────────────────

/**
 * La régénération DE BASE d'une ressource à jauge — le plafond et la cadence
 * qu'elle a sans aucun bâtiment.
 *
 * ⚠️ POURQUOI CE BUNDLE ET PAS UN AUTRE. Ce n'est pas une donnée de bâtiment :
 * elle vit sur `ResourceDefinitionDTO`. Mais elle n'a de sens qu'avec les boosts
 * qui la modifient (`regeneration_cap` / `regeneration_speed`), et ceux-là sont
 * portés par des bâtiments — le Treasure Wreck — et par les bâtiments d'héritage,
 * dont le domaine dépend déjà de ce bundle par `resolvers/building-curves`.
 * L'isoler dans une extraction à lui seul pour trois lignes coûterait un script,
 * un fichier généré, une commande et un diff, sans lever d'ambiguïté.
 *
 * ⚠️ SANS ELLE, UN POURCENTAGE NE SE TRADUIT PAS EN TEMPS. « +83 % de
 * régénération » ne devient « 15 min par boussole » que si l'on sait que la base
 * est de 90 min — et cette base n'existait NULLE PART dans le projet.
 *
 * Trois ressources la portent (`GameRegeneratingTraitDTO`) : la boussole de la
 * chasse au trésor, les points de recherche, et les tentatives d'attaque. Les
 * jauges du hub commercial en sont exclues : leur trait est un
 * `TradingHubRegeneratingTraitDTO`, sans plafond, qui ne répond pas à la même
 * question.
 */
export interface RegeneratingResourceExtract {
  /** Clé de ressource du game design, ex. `treasure_hunt_attempt`. */
  id: string;
  /** Plafond nu, avant tout boost `regeneration_cap`. */
  baseMax: number;
  /** Secondes pour régénérer `amountPerUnit`, avant tout boost de vitesse. */
  basePeriodSeconds: number;
  /** Quantité rendue à chaque période — 1 sur les trois ressources connues. */
  amountPerUnit: number;
}

// ─── Le bundle ────────────────────────────────────────────────────────────────

export interface BuildingExtractBundle {
  generatedFrom: {
    gameDesignChecksum: string | null;
    locaChecksum: string | null;
    locale: string | null;
  };
  buildings: BuildingChainExtract[];
  /** Types de bonus rencontrés sans équivalent dans `BONUS_LABELS`. */
  bonusGaps: BuildingBonusGap[];
  /** Voir `RegeneratingResourceExtract` — la base que les boosts modifient. */
  regeneratingResources: RegeneratingResourceExtract[];
}
