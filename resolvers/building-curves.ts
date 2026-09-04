/**
 * Lecture des courbes de l'extraction Bâtiments.
 *
 * L'extraction ne résout jamais une courbe vers un nombre unique : elle livre la
 * table complète, sur un axe (le niveau) ou sur deux (l'âge puis le niveau).
 * C'est ce module qui l'interroge, avec l'état d'une INSTANCE.
 *
 * ⚠️ Pour un bâtiment `evolving`, l'âge est celui de l'instance — figé à
 * l'obtention, il ne monte que par jeton d'évolution. Ce n'est pas l'ère
 * courante du joueur, et rien ici ne va la chercher : l'appelant la fournit.
 *
 * Ce module ne branche rien sur `BuildingData` : il lit `BUILDING_EXTRACT`.
 */

import { BUILDING_EXTRACT } from "@/data/buildings/generated/buildings.generated";
import type {
  BuildingAgeCurve,
  BuildingBonus,
  BuildingCurve,
} from "@/data/buildings/generated/types";

/** Ce qu'une courbe rend pour un état donné. */
export interface CurveReading {
  /** `null` quand la courbe ne dit rien à ce niveau — pas « zéro ». */
  amount: number | null;
  /** Ressources concernées. Vide hors production (culture, ouvriers, boosts…). */
  resources: string[];
}

/**
 * Valeur d'une courbe à un niveau runtime.
 *
 * `effective` porte déjà le `modifier` du composant ; c'est la valeur à lire.
 */
export function resolveByLevel(curve: BuildingCurve, level: number): number | null {
  return curve.effective[level - 1] ?? null;
}

/** L'entrée d'âge qui gouverne `age`, palier d'âges déjà appliqué à l'extraction. */
export function entryForAge(curve: BuildingAgeCurve, age: string) {
  return curve.entries.find((entry) => entry.appliesTo.includes(age)) ?? null;
}

/**
 * Valeur d'une courbe à deux axes pour le couple (âge de l'instance, niveau).
 *
 * Rend `null` quand l'âge n'est gouverné par aucune entrée : une table qui
 * commence à `StoneAge` ne dit rien d'un âge antérieur, et l'extrapoler serait
 * inventer.
 */
export function resolveByAgeAndLevel(
  curve: BuildingAgeCurve,
  age: string,
  level: number,
): CurveReading | null {
  const entry = entryForAge(curve, age);
  if (entry === null) return null;
  return { amount: resolveByLevel(entry.curve, level), resources: entry.resources };
}

/** Lit un bonus quel que soit son axe, en ignorant l'âge s'il n'en a pas. */
export function resolveBonus(bonus: BuildingBonus, age: string, level: number): CurveReading | null {
  if (bonus.ageCurve !== null) {
    const reading = resolveByAgeAndLevel(bonus.ageCurve, age, level);
    if (reading === null) return null;
    return {
      amount: reading.amount,
      resources:
        reading.resources.length > 0 ? reading.resources : bonus.resource === null ? [] : [bonus.resource],
    };
  }
  if (bonus.curve !== null) {
    return {
      amount: resolveByLevel(bonus.curve, level),
      resources: bonus.resource === null ? [] : [bonus.resource],
    };
  }
  return { amount: bonus.value, resources: bonus.resource === null ? [] : [bonus.resource] };
}

/**
 * Les bonus d'un type donné sur une chaîne, dans l'ordre d'`instance`.
 *
 * Une chaîne `evolving` n'a qu'un maillon ; la fonction reste générale pour ne
 * pas dépendre de ça.
 */
export function findBonuses(chainKey: string, type: string): BuildingBonus[] {
  const chain = BUILDING_EXTRACT.buildings.find((b) => b.chainKey === chainKey);
  if (chain === undefined) return [];
  return chain.levels.flatMap((level) => level.bonuses.filter((bonus) => bonus.type === type));
}
