/**
 * Bâtiments évolutifs — catalogue, état possédé, et résolution des deux.
 *
 * Trois couches, séparées comme le domaine Wonders les sépare déjà :
 *
 *  1. `EvolvingBuilding` — le CATALOGUE. Donnée de jeu, identique pour tous,
 *     dérivée de `BUILDING_EXTRACT`. Équivalent de `Wonder`.
 *  2. `OwnedEvolvingBuilding` — l'ÉTAT du joueur. Trois champs, rien de plus :
 *     ce qu'une table Dexie stocke. Équivalent de `UserWonderEntity`.
 *  3. `ResolvedEvolvingBuilding` — le croisement des deux à un instant donné.
 *     Équivalent de `ResolvedBonus`, calculé au rendu, jamais persisté.
 *
 * ⚠️ Ce qui distingue ce domaine des Wonders, c'est le SECOND axe. Un wonder se
 * résout au niveau seul ; un évolutif se résout au couple (ère, niveau), et son
 * ère est figée à l'obtention. Elle ne suit ni l'ère du joueur, ni le niveau du
 * bâtiment, ni l'ère des autres évolutifs possédés — deux exemplaires du même
 * bâtiment chez deux joueurs peuvent produire des ressources différentes au même
 * niveau. D'où `era` dans l'état possédé, et non déduite.
 *
 * Ce module ne touche ni `BuildingData` ni `ELEMENT_DATA_REGISTRY` : le
 * catalogue du Calculator et l'état d'un évolutif sont deux choses distinctes.
 */

import { GAME_DESIGN_AGE_BY_ERA } from "@/data/config";
import { BUILDING_EXTRACT } from "@/data/buildings/generated/buildings.generated";
import type {
  BuildingBonus,
  BuildingBonusFormat,
  BuildingBonusScope,
  BuildingChainKey,
} from "@/data/buildings/generated/types";
import type { EraCode } from "@/types/shared";

import { getBonusLabel } from "./bonus";
import { resolveBonus, resolveByLevel } from "./building-curves";

// ─── Catalogue ────────────────────────────────────────────────────────────────

export interface EvolvingBuilding {
  /** Clé de registre, ex. `evolving_aqueduct`. Identifiant public du domaine. */
  key: string;
  chainKey: BuildingChainKey;
  name: string;
  imageName: string;
  width: number | null;
  height: number | null;
  maxLevel: number;
  /** Niveaux auxquels une étoile est gagnée, ex. `[10, 20, 30, 40, 60]`. */
  starLevels: number[];
}

/**
 * ⚠️ REPLI SUR UN NOM DE GROUPE QUI PORTE LE LIBELLÉ DU JETON.
 *
 * Le nom d'une chaîne vient de `Base.BuildingGroups.<group>_Name`. Pour
 * `evolvingAztecGardenBath`, la loca du jeu y a mis le libellé du JETON —
 * « 'Aztec Garden Bath' Evolution Token » — au lieu du nom du bâtiment
 * (`Base.Buildings.…_1_Name` dit bien « Aztec Garden Bath »). C'est une
 * anomalie de la donnée amont, pas de l'extraction : 1 cas sur les 44.
 *
 * La forme est reconnaissable et régulière — c'est exactement le patron que
 * la loca applique à TOUS les jetons (« 'Madrasa' Evolution Token ») — donc
 * on la défait par règle, sans saisir aucun nom à la main. Corrigé ICI, à
 * l'entrée du domaine, pour que le libellé affiché ET les URLs d'image
 * (`lib/heritage-images.ts`, qui dérive le fichier wiki du nom) partent du
 * même nom propre.
 */
const TOKEN_LABEL = /^'(.+)' Evolution Token$/;

function buildingName(name: string): string {
  return TOKEN_LABEL.exec(name)?.[1] ?? name;
}

/** Les 44 bâtiments évolutifs, dans l'ordre de l'extraction. */
export const EVOLVING_BUILDINGS: EvolvingBuilding[] = BUILDING_EXTRACT.buildings
  .filter((chain) => chain.buildingType === "evolving")
  .map((chain) => ({
    key: chain.registryKey ?? chain.chainKey,
    chainKey: chain.chainKey,
    name: buildingName(chain.name),
    imageName: chain.imageName ?? "",
    width: chain.levels[0]?.width ?? null,
    height: chain.levels[0]?.height ?? null,
    maxLevel: chain.levelUp?.maxLevel ?? 1,
    starLevels: chain.levelUp?.starLevels ?? [],
  }));

const BY_KEY = new Map(EVOLVING_BUILDINGS.map((building) => [building.key, building]));

export function getEvolvingBuilding(key: string): EvolvingBuilding | null {
  return BY_KEY.get(key) ?? null;
}

// ─── État possédé ─────────────────────────────────────────────────────────────

/**
 * Un exemplaire possédé. Un joueur en a 0 ou 1 par bâtiment : `key` suffit comme
 * clé primaire, il n'y a pas d'identifiant d'instance à inventer.
 */
export interface OwnedEvolvingBuilding {
  key: string;
  /** 1 … `maxLevel`. */
  level: number;
  /** Ère FIGÉE de cet exemplaire, pas celle du joueur. */
  era: EraCode;
}

// ─── Résolution ───────────────────────────────────────────────────────────────

/** Un effet résolu au couple (ère, niveau) — prêt pour `formatBonusValue`. */
export interface ResolvedEvolvingBonus {
  type: string;
  label: string;
  /** `null` quand le game design ne dit rien à ce niveau — pas « zéro ». */
  value: number | null;
  format: BuildingBonusFormat;
  scope: BuildingBonusScope | null;
  instance: number;
  /** Ressources produites, en clé projet. Vide hors production. */
  resources: string[];
  /** Période du cycle de production en secondes. `null` hors production. */
  periodSeconds: number | null;
}

/**
 * Coût pour passer au niveau suivant.
 *
 * Les clés reprennent la convention de `Costs` (types/shared.ts) pour qu'un
 * futur `Costs.evolution_tokens` absorbe cet objet sans transformation. Les 44
 * ne se paient qu'en jetons, propres à chaque bâtiment.
 */
export interface EvolvingUpgradeCost {
  fromLevel: number;
  toLevel: number;
  evolution_tokens: number;
}

export interface ResolvedEvolvingBuilding extends EvolvingBuilding {
  level: number;
  era: EraCode;
  /** Étoiles atteintes au niveau courant. */
  stars: number;
  atMaxLevel: boolean;
  /** `null` au niveau maximal : on ne quitte pas le dernier niveau. */
  upgradeCost: EvolvingUpgradeCost | null;
  /** Sorties par cycle (`ProductionComponentDTO`). */
  production: ResolvedEvolvingBonus[];
  /** Points et portée de culture. */
  culture: ResolvedEvolvingBonus[];
  /** Tout le reste : stats d'unité, ouvriers, boosts de bâtiment. */
  bonuses: ResolvedEvolvingBonus[];
}

type EvolvingBonusGroup = "production" | "culture" | "bonuses";

/**
 * Le composant porteur classe l'effet, pas son `type` : c'est lui qui distingue
 * une SORTIE de production d'un boost de production, deux grandeurs que la
 * clé de bonus ne sépare pas toujours (`goods_output` vs `goods_production`).
 */
function groupOf(bonus: BuildingBonus): EvolvingBonusGroup {
  if (bonus.componentType === "ProductionComponentDTO") return "production";
  if (bonus.componentType === "CultureComponentDTO") return "culture";
  return "bonuses";
}

function chainOf(key: string) {
  const building = BY_KEY.get(key);
  if (building === undefined) return null;
  return BUILDING_EXTRACT.buildings.find((c) => c.chainKey === building.chainKey) ?? null;
}

function resolveOne(bonus: BuildingBonus, age: string, level: number): ResolvedEvolvingBonus {
  const reading = resolveBonus(bonus, age, level);
  return {
    type: bonus.type,
    label: getBonusLabel(bonus.type, bonus.instance),
    value: reading?.amount ?? null,
    format: bonus.format,
    scope: bonus.scope,
    instance: bonus.instance,
    resources: reading?.resources ?? [],
    periodSeconds: bonus.periodSeconds,
  };
}

/**
 * Coût en jetons pour quitter `level`.
 *
 * ⚠️ Le barème est indexé par le niveau de DÉPART. Au-delà du dernier palier
 * tabulé, la formule prend le relais (02-dynamic.md §5.1) et peut rendre un
 * nombre fractionnaire : il est tronqué, comme tous les coûts en formule de ce
 * projet (`resolveDynamicAmount`). Le jeu ne facture pas des demi-jetons.
 */
export function getUpgradeCost(key: string, level: number): EvolvingUpgradeCost | null {
  const building = BY_KEY.get(key);
  const chain = chainOf(key);
  if (building === undefined || chain === null || level >= building.maxLevel) return null;

  const curve = chain.levelUp?.upgradeCost ?? null;
  const amount = curve === null ? null : resolveByLevel(curve, level);
  if (amount === null) return null;

  return { fromLevel: level, toLevel: level + 1, evolution_tokens: Math.trunc(amount) };
}

/**
 * Jetons facturés pour CONSTRUIRE le bâtiment, c'est-à-dire obtenir son
 * niveau 1 — distinct de `getUpgradeCost`, qui ne facture que les montées
 * ultérieures. `ConstructionComponentDTO.start` du premier maillon, sur les
 * 44 bâtiments évolutifs, ne porte jamais qu'une seule ligne : le jeton
 * propre au bâtiment (vérifié à l'extraction, aucune exception).
 *
 * `null` sur une clé inconnue ou un premier maillon sans coût déclaré.
 */
export function getConstructionCost(key: string): number | null {
  const chain = chainOf(key);
  const line = chain?.levels[0]?.construction?.[0] ?? null;
  return line === null ? null : Math.trunc(line.amount);
}

/**
 * Tout ce qu'un exemplaire rend à un couple (ère, niveau) donné.
 *
 * Rend `null` si la clé est inconnue. Le niveau est borné à `[1, maxLevel]`
 * plutôt que refusé : une valeur hors bornes vient d'un état utilisateur, pas
 * d'une erreur de programmation.
 */
export function resolveEvolvingBuilding(
  key: string,
  level: number,
  era: EraCode,
): ResolvedEvolvingBuilding | null {
  const building = BY_KEY.get(key);
  const chain = chainOf(key);
  if (building === undefined || chain === null) return null;

  const clamped = Math.min(Math.max(Math.trunc(level), 1), building.maxLevel);
  const age = GAME_DESIGN_AGE_BY_ERA.get(era);
  if (age === undefined) return null;

  const groups: Record<EvolvingBonusGroup, ResolvedEvolvingBonus[]> = {
    production: [],
    culture: [],
    bonuses: [],
  };
  for (const bonus of chain.levels.flatMap((l) => l.bonuses)) {
    groups[groupOf(bonus)].push(resolveOne(bonus, age, clamped));
  }

  return {
    ...building,
    level: clamped,
    era,
    stars: building.starLevels.filter((star) => star <= clamped).length,
    atMaxLevel: clamped >= building.maxLevel,
    upgradeCost: getUpgradeCost(key, clamped),
    ...groups,
  };
}

/** Même chose au départ de l'état stocké. */
export function resolveOwned(owned: OwnedEvolvingBuilding): ResolvedEvolvingBuilding | null {
  return resolveEvolvingBuilding(owned.key, owned.level, owned.era);
}

// ─── Index par identifiant de game design ─────────────────────────────────────

/**
 * `BuildingDefinition.id` d'un maillon → le bâtiment évolutif de sa chaîne.
 *
 * Les domaines qui référencent un évolutif ne le font pas par `key` : le
 * Heritage Vault, par exemple, ne connaît que des
 * `Building_EventCeltic_Evolving_GrandSmithy_1`. Cet index est le pont, et il
 * vit ici plutôt que chez l'appelant pour que `BUILDING_EXTRACT` ne fuite pas
 * hors du domaine Bâtiments.
 */
const BY_DEFINITION_ID = new Map<string, EvolvingBuilding>(
  BUILDING_EXTRACT.buildings
    .filter((chain) => chain.buildingType === "evolving")
    .flatMap((chain) => {
      const building = BY_KEY.get(chain.registryKey ?? chain.chainKey);
      if (building === undefined) return [];
      return chain.levels.map((level) => [level.gameDesignId, building] as const);
    }),
);

export function getEvolvingBuildingByDefinitionId(
  definitionId: string,
): EvolvingBuilding | null {
  return BY_DEFINITION_ID.get(definitionId) ?? null;
}
