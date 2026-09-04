// ============================================================
// ROC Helper – Wonders: shape of the generated extraction
//
// Describes what `scripts/extract/wonders.ts` produces out of
// `source/gamedesign.json` + `source/loca.json`.
//
// Two layers live side by side in the generated module:
//
//  1. `WonderExtract` — the complete, faithful projection of the
//     game design. Every field the game design exposes on a wonder
//     is kept here, whether or not the app consumes it today.
//
//  2. `WonderRawEntry` — the narrow projection consumed by
//     `data/wonders/index.ts` (`assembleWonder`). This is the only layer the
//     UI sees; anything extracted but not meant for display is filtered out
//     of it (see `UI_EXCLUDED_BONUS_TYPES` in scripts/extract/wonders.ts).
//
// Reference: docs/game-schema/05-wonders-reliques-heritage.md
//            docs/game-schema/02-dynamic.md  (dynamic layer)
//            docs/game-schema/00-conventions.md §C9 (step tables)
// ============================================================

// ─── Dynamic curves ───────────────────────────────────────────────────────────

/**
 * Which context variable indexes a curve.
 * - `level`    → `BuildingLevelDynamicChangeDTO`, keys 1…30 for wonders
 * - `wonderTag`→ `WonderTagDynamicChangeDTO`, keys 0…7 (see 05-wonders §2.3)
 */
export type WonderCurveIndex = "level" | "wonderTag";

/** One `{ when, then }` row, exactly as authored. `value` is null when `then` is empty (§2.3 / W7). */
export interface WonderCurveStep {
  when: number;
  value: number | null;
}

/**
 * A dynamic curve attached to a wonder component.
 *
 * `table` keeps the source rows untouched; `resolved` applies the step rule
 * (00-conventions §C9: value at index i = row with the greatest `when` ≤ i).
 * `effective` is `modifier × resolved[i]` — the composition described in
 * 05-wonders §2.1 (schema A). Both are `null` where the game design says nothing.
 */
export interface WonderCurve {
  indexedBy: WonderCurveIndex;
  /** Material tag the curve is indexed by. `wonderTag` curves only. */
  tag: string | null;
  /** Dynamic definition id, or the boost id when the table is inlined in the boost. */
  definitionId: string;
  /** Per-component scale factor. `null` when the carrying schema has no `modifier`. */
  modifier: number | null;
  table: WonderCurveStep[];
  /** `level` curves: index 0 = level 1 … 29 = level 30. `wonderTag` curves: index 0 = 0 tags … 7. */
  resolved: (number | null)[];
  /** `modifier × resolved[i]`, or `resolved[i]` when `modifier` is null. */
  effective: (number | null)[];
}

// ─── Effects ──────────────────────────────────────────────────────────────────

/** Common to every normalized effect: the id of the component it came from. */
interface WonderEffectBase {
  /** `components[].id` in the game design. */
  componentId: string;
  /** The component's `@type`, short form. */
  componentType: string;
}

/** `WonderLevelUpComponentDTO` — upgrade duration, worker requirement, cost scheme. */
export interface WonderLevelUpEffect extends WonderEffectBase {
  kind: "levelUp";
  durationSeconds: number;
  /** Id of the shared `WonderDynamicCostDefinitionDTO` embedded in the component. */
  upgradeCostSchemeId: string;
  /** Workers locked during an upgrade, per level. Null when the component carries none (14/28). */
  requiredWorkers: WonderCurve | null;
}

/** `BoostResourceComponentDTO` — schema A (modifier × dynamic value). */
export interface WonderResourceBoostEffect extends WonderEffectBase {
  kind: "resourceBoost";
  /** Exactly one of these three narrows the target; the game design uses them exclusively. */
  resourceDefinitionId: string | null;
  resourceType: string | null;
  buildingGroup: string | null;
  /** Cities the boost applies in (`City_*`). */
  cities: string[];
  curve: WonderCurve;
}

/** `BoostUnitStatComponentDTO` — schema A. */
export interface WonderUnitStatBoostEffect extends WonderEffectBase {
  kind: "unitStatBoost";
  /** `infantry` | `ranged` | `cavalry` | `heavyInfantry` | `bastion`; null = every unit type. */
  unitType: string | null;
  statDefinitionId: string;
  curve: WonderCurve;
}

/** `BuildingBoostComponentDTO` → the `BoostDefinitionDTO` it points at. */
export interface WonderBuildingBoostEffect extends WonderEffectBase {
  kind: "buildingBoost";
  boostDefinitionId: string;
  /** `boostType.@type`, short form — what is affected (01-socle §5.1). */
  boostType: string;
  /** Remaining `boostType` fields, minus `@type`/`id`. */
  boostTarget: Record<string, string>;
  curve: WonderCurve;
}

/** `GrantWorkerComponentDTO` — extra worker slots per level. */
export interface WonderGrantWorkerEffect extends WonderEffectBase {
  kind: "grantWorker";
  /** `WorkerType_*`; null = the city's default worker. */
  workerType: string | null;
  curve: WonderCurve;
}

/** `IncreaseTagBonusComponentDTO` — carries no tag of its own (05-wonders §2.4 / W6). */
export interface WonderIncreaseTagBonusEffect extends WonderEffectBase {
  kind: "increaseTagBonus";
  amount: number;
  /** The wonder's own tags, which is all the data offers as a target. */
  assumedTags: string[];
}

/** `ConditionalBonusComponentDTO` — capped, trigger-driven bonus (05-wonders §2.6 / W8). */
export interface WonderConditionalBonusEffect extends WonderEffectBase {
  kind: "conditionalBonus";
  /** `condition.@type`, short form. The condition objects are empty in the data. */
  conditionType: string;
  fulfilledDynamicChangeDefinitionId: string;
  /** Neither period nor unit is declared anywhere. */
  cap: number;
}

/** `GrantCommanderSlotComponentDTO` — a marker, no payload. */
export interface WonderGrantCommanderSlotEffect extends WonderEffectBase {
  kind: "grantCommanderSlot";
}

/** A reward reachable from a production component, flattened out of the reward tree. */
export interface WonderRewardDescriptor {
  /** `resource` | `good` | `mysteryChest` | `dynamic` | `other` */
  kind: string;
  /** Resource id for `resource` rewards. */
  resourceDefinitionId: string | null;
  /** Good rank (1..3) for `good` rewards — a rank, not an id (02-dynamic §3.1.2). */
  goodNumber: number | null;
  /** Age offset for `good` rewards: 0 = current age, -1 = previous age. */
  goodOffset: number | null;
  /** Amount per level (index 0 = level 1), step-resolved. */
  amounts: (number | null)[] | null;
  /** For `mysteryChest`: chance of the first branch, in percent, per level. */
  firstBranchChancePercent: (number | null)[] | null;
  /**
   * True when this reward sits inside a `MysteryChestRewardDTO`, i.e. it is one
   * possible outcome rather than a guaranteed one. A chest nested in another
   * chest has a conditional probability, so its chance is not a drop chance.
   */
  insideChest: boolean;
  /** Ids traversed to reach this reward, for traceability. */
  path: string[];
}

/** `ProductionComponentDTO` on a wonder (see 03-batiments §3.1 for the shared shape). */
export interface WonderProductionEffect extends WonderEffectBase {
  kind: "production";
  auto: boolean;
  durationSeconds: number;
  minCollectionPeriodSeconds: number;
  skipPricePerMinute: number;
  /** `ProductionType_UNIT` on the three unit-producing wonders; null otherwise. */
  productionType: string | null;
  producedDynamicActionChangeDefinitionId: string | null;
  /** Rewards produced each cycle. */
  produced: WonderRewardDescriptor[];
  /** Rewards granted when a production run finishes. */
  finish: WonderRewardDescriptor[];
  /** `WonderBonusBehaviourDTO` entries — tag-triggered rewards (05-wonders §2.7 / W9). */
  tagBehaviours: {
    tag: string;
    rewards: WonderRewardDescriptor[];
  }[];
  /** Short `@type` of every other behaviour (e.g. `WorkerBehaviourDTO`). */
  otherBehaviours: string[];
}

export type WonderEffect =
  | WonderLevelUpEffect
  | WonderResourceBoostEffect
  | WonderUnitStatBoostEffect
  | WonderBuildingBoostEffect
  | WonderGrantWorkerEffect
  | WonderIncreaseTagBonusEffect
  | WonderConditionalBonusEffect
  | WonderGrantCommanderSlotEffect
  | WonderProductionEffect;

// ─── Upgrade costs ────────────────────────────────────────────────────────────

/** One purchasable crate of an upgrade (`CratesDTO.crates[]`). */
export interface WonderCrate {
  id: string;
  crateAmount: number;
  gearsAmount: number;
  isInstantHelpRequest: boolean;
  cost: {
    /**
     * Resource id. `DYN_WONDER|material_1`, `DYN_WONDER|material_2` and
     * `DYN_WONDER|blueprint` are placeholders resolved against the wonder's own
     * `firstMaterialDefinitionId` / `secondMaterialDefinitionId` / blueprint.
     */
    definitionId: string;
    amount: number;
  };
}

/** Cost of one level-up. The game design tabulates `when` 1…29, i.e. the 29 upgrades of levels 1→30. */
export interface WonderUpgradeStep {
  /** Level reached by paying this step (2…30). */
  targetLevel: number;
  crates: WonderCrate[];
}

/** One of the 8 cost scales shared by the 28 wonders (collection × city). */
export interface WonderCostScheme {
  id: string;
  steps: WonderUpgradeStep[];
}

// ─── UI-facing projection ─────────────────────────────────────────────────────

/** How a bonus value should be rendered. Mirrors `BonusFormat` in `data/wonders/types.ts`. */
export type WonderBonusFormat = "percent" | "integer" | "flat";

/**
 * What a bonus is narrowed to, when the game design narrows it.
 *
 * The projection used to dissolve this into the displayed icon (a city crest, a
 * unit glyph), which made two bonuses of the same `type` indistinguishable
 * without reading the artwork. Carried as data now; the icons are unchanged and
 * remain the display channel.
 *
 * - `city`          — `BoostResourceComponentDTO.cities[]`, e.g. `City_Arabia`
 * - `buildingGroup` — `boostType.buildingGroup`, e.g. `heavyInfantryBarracks`
 * - `unitType`      — `BoostUnitStatComponentDTO.unitType`, e.g. `heavyInfantry`
 *
 * `null` = the game design declares no narrowing (army-wide stats, production
 * rewards, worker grants).
 */
export type WonderBonusScope =
  | { kind: "city"; value: string }
  | { kind: "buildingGroup"; value: string }
  | { kind: "unitType"; value: string };

/** A level-indexed numeric bonus, plus the provenance the UI shape drops. */
export interface WonderBonusExtract {
  /**
   * Canonical snake_case key driving `BONUS_LABELS`. Never carries an ordinal
   * suffix — a wonder holding the same bonus twice is disambiguated by
   * `instance`, so summing by `type` alone is correct.
   */
  type: string;
  icons: [string, string | null];
  /** 30 values, index 0 = level 1. */
  values: number[];
  format: WonderBonusFormat;
  /** Target narrowing declared by the game design; `null` when there is none. */
  scope: WonderBonusScope | null;
  /** 1-based ordinal among the bonuses of this wonder sharing the same `type`. */
  instance: number;
  /** `componentId` of the effect this bonus was projected from. */
  sourceComponentId: string;
}

/** A tag-triggered bonus, plus its provenance. */
export interface WonderSynergyExtract {
  /** Material tag that activates it, lowercased (`MaterialType`). */
  tag: string;
  icons: [string, string | null];
  /** Pre-formatted display string, e.g. `"+5%"`, `"+1/day"`. Never goes through `formatBonusValue()`. */
  bonus: string;
  sourceComponentId: string;
}

/** Raw entry shape consumed by `assembleWonder()` in `data/wonders/index.ts`. */
export interface WonderRawEntry {
  meta: {
    code: string;
    name: string;
    group: string;
    slot: string;
    materials: [string, string];
    rarity: string;
    synergies: { raw: string; icons: [string, string | null]; bonus: string }[];
    countsAs?: { tag: string; multiplier: number }[];
  };
  bonuses: {
    /** Canonical key — no `_secondary` / `_tertiary` suffix. */
    type: string;
    icons: [string, string | null];
    values: number[];
    /** Rendering style, carried from the extraction instead of re-derived by the UI. */
    format: WonderBonusFormat;
    /** Target narrowing, or `null` when the game design declares none. */
    scope: WonderBonusScope | null;
    /** 1-based ordinal among this wonder's bonuses sharing the same `type`. */
    instance: number;
  }[];
}

// ─── The extract ──────────────────────────────────────────────────────────────

export interface WonderExtract {
  // Identity
  /** `ReworkedWonderDefinitionDTO.id`. */
  id: string;
  /** Project-side short code (`SH`, `HG`, …) — primary key of the app, not game-design data. */
  code: string;
  /** `Base.Wonders.<id>_Name`. */
  name: string;
  /** `Base.Wonders.<id>_Desc`. */
  description: string;

  // Classification
  cityDefinition: string;
  /** `Base.Cities.<cityDefinition>_Name` — matches the app's `WonderSlot` labels. */
  slot: string;
  /** Every collection referencing this wonder. Two wonders belong to two (see W14). */
  collectionIds: string[];
  /** Collection the upgrade-cost scheme assigns it to — the unambiguous one. */
  primaryCollectionId: string;
  /** Short label of `primaryCollectionId`, from `Base.WonderCollections.<id>_FormattedName`. */
  group: string;
  /** `AW` | `GE` | `SM`. */
  groupCode: string;
  /** Raw material tags (`Temple`, `Statue`, …). */
  tags: string[];
  /** Tags lowercased — the app's `MaterialType`. */
  materials: [string, string];
  blueprintMaterialDefinitionId: string;
  firstMaterialDefinitionId: string;
  secondMaterialDefinitionId: string;
  /** `Rare` | `Legendary`, from `Rarity_RARE` / `Rarity_LEGENDARY`. */
  rarity: string;
  /** `ConstantsDefinition.wonders.maximumWonderLevel` — a global constant, not a per-wonder field. */
  maxLevel: number;

  // Fields the app does not consume yet
  /** ISO timestamp; present on 14/28. */
  newUntil: string | null;
  /** `SlotType_ALLIED` on 14/28; absence is undocumented. */
  slotType: string | null;
  /** Present on 3/28. */
  freeProductionSlots: number | null;

  // Mechanics
  effects: WonderEffect[];
  /** Points into `WonderExtractBundle.costSchemes` — 8 scales shared by the 28 wonders (§3.2). */
  upgradeCostSchemeId: string;

  // Projections
  bonuses: WonderBonusExtract[];
  synergies: WonderSynergyExtract[];
  countsAs: { tag: string; multiplier: number }[];

  /** Everything the game design leaves undetermined, or that the projection dropped. */
  warnings: string[];
}

// ─── Collections & constants ──────────────────────────────────────────────────

export interface WonderCollectionExtract {
  id: string;
  /** `Base.WonderCollections.<id>_Name`. */
  name: string;
  /** Short label taken from `_FormattedName`. */
  shortName: string;
  /** Absent on `AncientWorld` (2/3 carry it). */
  order: number | null;
  wonderIds: string[];
  promotions: { id: string; order: number; promotedWonderIds: string[] }[];
}

/** `ConstantsDefinition.wonders`. */
export interface WonderConstants {
  maximumWonderLevel: number;
  gearsToWonderOrbExchangeRate: number;
  orbMultiPurchaseAmount: number;
  maximumContributionRequestsPerLevel: number;
  crateResearchPointAmounts: number[];
  promotionRuntimeSeconds: number;
  promotionDropChances: Record<string, number>;
  freeLayouts: number;
}

export interface WonderExtractBundle {
  generatedFrom: {
    gameDesignChecksum: string | null;
    locaChecksum: string | null;
    locale: string | null;
  };
  constants: WonderConstants;
  collections: WonderCollectionExtract[];
  costSchemes: WonderCostScheme[];
  wonders: WonderExtract[];
}
