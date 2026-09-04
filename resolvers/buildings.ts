import { BUILDING_RAW_DATA } from "@/data/buildings/generated/buildings.generated";
import { HAND_ELEMENT_DATA } from "@/data/registry-hand";
import type { BuildingData, BuildingLevel, Costs, Good } from "@/types/shared";

/**
 * Registre des bâtiments : saisie à la main greffée sur l'extraction.
 *
 * Répartition des rôles, décidée après le rapport de catégorisation des 158
 * écarts de `pnpm diff:buildings` :
 *
 *  - Tout ce qui n'est pas `levels` vient de l'extraction. `buildingType`,
 *    `width` et `height` n'existent nulle part à la main ; les cinq champs de
 *    présentation y sont identiques des deux côtés (test ci-contre).
 *  - Les 44 chaînes `evolving`, absentes de la saisie à la main, entrent telles
 *    que l'extraction les projette — sans niveaux : leur unique définition n'a
 *    pas d'ère et se paie en `EvolutionToken`.
 *  - `levels` reste la saisie à la main, À UNE EXCEPTION PRÈS : le coût de
 *    CONSTRUCTION (voir `mergeConstruction`). Les 19 montants écrits en formule
 *    Lua et les 12 biens de `start.costs[]` entrent tous par là, sans cas
 *    particulier.
 *
 * Restent donc hors chantier, et à la main : `max_qty` (deux méthodes de calcul
 * également valides), le coût d'UPGRADE, les niveaux 41-42 générés.
 */

/** `${clé de registre}|${niveau}` → niveau extrait correspondant. */
type ExtractIndex = Map<string, Costs | undefined>;

/** Mêmes couples (bien, montant), quel que soit l'ordre du tableau. */
function sameGoods(hand: Good[] = [], extracted: Good[] = []): boolean {
  const cle = (goods: Good[]) => goods.map((g) => `${g.resource}:${g.amount}`).sort().join("|");
  return cle(hand) === cle(extracted);
}

/**
 * Coût de construction : l'extraction fait foi sur le CONTENU, la main sur
 * l'ORDRE d'affichage.
 *
 * L'extraction apporte les montants que la donnée à la main ignorait, recopiait
 * du niveau précédent ou relevait un niveau trop bas — les 19 coûts écrits en
 * formule Lua, et les 12 biens que les 4 définitions
 * `Building_DynamicAge_{Home_Small,Home_Average,Farm_Rural,Farm_Domestic}_1`
 * rangent dans `start.costs[]` plutôt que dans `start.resourceChanges[]`.
 *
 * À contenu identique, le tableau `goods` de la main est conservé tel quel : sur
 * 41 niveaux les deux listent les mêmes biens dans un ordre différent, et cet
 * ordre est celui de l'affichage. Réordonner sans rien changer aux montants
 * serait du bruit. Un `goods` que l'extraction ne porte pas laisse également
 * celui de la main en place.
 */
function mergeConstruction(hand: Costs | undefined, extracted: Costs | undefined): Costs | undefined {
  if (extracted === undefined) return hand;
  const { goods, ...scalars } = extracted;
  return {
    ...hand,
    ...scalars,
    ...(goods === undefined || sameGoods(hand?.goods, goods) ? {} : { goods }),
  };
}

function indexExtractedConstruction(key: string): ExtractIndex {
  const index: ExtractIndex = new Map();
  const entry = BUILDING_RAW_DATA.find((e) => e.key === key);
  for (const level of entry?.levels ?? []) {
    index.set(`${key}|${level.level}`, level.construction as Costs | undefined);
  }
  return index;
}

function mergeLevels(key: string, hand: BuildingLevel[]): BuildingLevel[] {
  const extracted = indexExtractedConstruction(key);
  return hand.map((level) => {
    const construction = mergeConstruction(level.construction, extracted.get(`${key}|${level.level}`));
    return construction === undefined ? level : { ...level, construction };
  });
}

function merge(): Record<string, BuildingData> {
  const registry: Record<string, BuildingData> = {};

  for (const entry of BUILDING_RAW_DATA) {
    const hand = HAND_ELEMENT_DATA[entry.key];
    registry[entry.key] = {
      id: entry.id,
      name: entry.name,
      category: entry.category,
      subcategory: entry.subcategory,
      imageName: entry.imageName,
      buildingType: entry.buildingType,
      ...(entry.width !== null ? { width: entry.width } : {}),
      ...(entry.height !== null ? { height: entry.height } : {}),
      // `era` est un `EraCode` garanti par le garde-fou de l'extraction.
      levels: hand ? mergeLevels(entry.key, hand.levels) : (entry.levels as BuildingLevel[]),
    };
  }

  return registry;
}

export const ELEMENT_DATA_REGISTRY = merge();
