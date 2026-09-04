/**
 * L'atelier « de position » — propriétaire unique.
 *
 * Le joueur classe trois ateliers par tranche d'ères (`buildingsAbbr`). Un coût
 * ou un bâtiment peut donc désigner soit un atelier concret (`tailor`), soit la
 * POSITION que le joueur lui a donnée (`primary_workshop`). Traduire de l'un
 * vers l'autre était réécrit à quatre endroits (§6.6 du doc
 * `data-contracts.md`), et la génération de l'ID Dexie à trois.
 *
 * ⚠️ Le sens de résolution est **position → atelier**, jamais l'inverse.
 *
 * C'est le point central de ce module. `generateBuildingId`
 * (lib/stores/add-element-store.ts) redérivait la position à partir du nom
 * concret, en cherchant ce nom dans `buildingsAbbr[…].buildings` — c'est-à-dire
 * dans l'ordre DU JEU, alors que la position vient du classement DU JOUEUR. Dès
 * que le joueur reclassait ses ateliers, les trois positions se retrouvaient
 * permutées dans l'ID écrit en base :
 *
 *   classement ["Artisan", "Tailor", "Stone Mason"] :
 *     primary_workshop → artisan → capital_TERTIARY_workshop_…
 *
 * et comme l'hydratation re-résout l'ID avec le même classement, l'erreur ne
 * s'annulait pas : le joueur ajoutait son atelier primaire et voyait apparaître
 * le tertiaire. Le défaut était invisible sous le classement par défaut, seul
 * cas où l'ordre du jeu et celui du joueur coïncident.
 *
 * Ici, `buildWorkshopBuildingId` prend une POSITION en entrée. Aucune fonction
 * de ce module ne dérive une position d'un nom concret : la permutation n'est
 * pas représentable.
 */

import { buildingsAbbr, type EraAbbr } from "@/lib/constants";
import { isValidData } from "@/lib/utils";
import { getBuildingData } from "@/lib/element-data-loader";
import { WORKSHOP_MAX_QTY } from "@/data/config";
import type { BuildingData } from "@/types/shared";
import { GOOD_RANKS, type GoodRank } from "./goods-keys";

const WORKSHOP_SUFFIX = "_workshop";

/** Clé `localStorage` du classement d'ateliers du joueur. */
export const WORKSHOP_SELECTIONS_KEY = "local:buildingSelections";

export interface ResolvedWorkshop {
  /** La position demandée. */
  priority: GoodRank;
  /** Son index (0/1/2) dans un groupe de `buildingsAbbr`. */
  priorityIndex: number;
  /** L'index du groupe d'ères de `buildingsAbbr` qui couvre cette ère. */
  groupIndex: number;
  /** L'atelier retenu, en identifiant de bâtiment (`stone_mason`). */
  buildingId: string;
  /** Le nom tel que le joueur l'a enregistré (`"Stone Mason"`), ou `null`. */
  selectedName: string | null;
  /** `true` quand le joueur n'a rien classé et qu'on retombe sur l'ordre du jeu. */
  isDefault: boolean;
}

/** `"Stone Mason"` → `"stone_mason"`. */
function toBuildingId(name: string): string {
  return name.toLowerCase().replace(/\s+/g, "_");
}

/** L'elementId désigne-t-il une position plutôt qu'un atelier concret ? */
export function isPositionWorkshop(elementId: string): boolean {
  return GOOD_RANKS.some((p) => elementId === `${p}${WORKSHOP_SUFFIX}`);
}

/** L'index du groupe de `buildingsAbbr` couvrant cette ère, ou `-1`. */
export function workshopGroupIndex(era: string): number {
  const abbr = era.toUpperCase();
  return buildingsAbbr.findIndex((group) =>
    group.abbreviations.some((a) => a === abbr),
  );
}

/**
 * `primary_workshop` + `"BA"` → l'atelier que CE joueur a classé en primaire
 * pour cette tranche d'ères.
 *
 * `null` si l'elementId n'est pas une position, ou si l'ère n'appartient à
 * aucun groupe. Sans classement du joueur, on retombe sur l'ordre du jeu et
 * `isDefault` vaut `true` — les appelants s'en servent pour afficher
 * « Workshop {ÈRE} » au lieu d'un nom d'atelier auquel le joueur n'a pas
 * consenti.
 */
export function resolvePositionWorkshop(
  elementId: string,
  era: string,
  selections: string[][],
): ResolvedWorkshop | null {
  if (!isPositionWorkshop(elementId)) return null;

  const priority = elementId.slice(
    0,
    -WORKSHOP_SUFFIX.length,
  ) as GoodRank;
  const priorityIndex = GOOD_RANKS.indexOf(priority);

  const groupIndex = workshopGroupIndex(era);
  if (groupIndex < 0) return null;

  const selected = selections?.[groupIndex]?.[priorityIndex];
  if (selected) {
    return {
      priority,
      priorityIndex,
      groupIndex,
      buildingId: toBuildingId(selected),
      selectedName: selected,
      isDefault: false,
    };
  }

  const fallback = buildingsAbbr[groupIndex]?.buildings[priorityIndex];
  if (!fallback) return null;

  return {
    priority,
    priorityIndex,
    groupIndex,
    buildingId: toBuildingId(fallback),
    selectedName: null,
    isDefault: true,
  };
}

/** `"primary"` → `"Primary Workshop"` — le libellé d'accordéon / de fiche. */
export function positionWorkshopLabel(priority: GoodRank): string {
  return `${priority.charAt(0).toUpperCase()}${priority.slice(1)} Workshop`;
}

/**
 * La quantité maximale d'un atelier de position, qui dépend de l'ère ET de la
 * position — et non du bâtiment, contrairement à tous les autres.
 */
export function workshopMaxQty(
  era: string,
  priorityIndex: number,
): number | undefined {
  return WORKSHOP_MAX_QTY[era.toUpperCase() as EraAbbr]?.[priorityIndex];
}

/**
 * Les données d'un atelier de position, tous groupes d'ères confondus.
 *
 * Un atelier de position n'existe pas dans le registre : ses niveaux sont ceux
 * des trois ateliers concrets que le joueur a classés à cette position, fusionnés
 * pour couvrir toute la chronologie, avec les `max_qty` remplacés par ceux de la
 * position.
 */
export function mergePositionWorkshopData(
  elementId: string,
  selections: string[][],
  categoryId: string,
): BuildingData | null {
  if (!isPositionWorkshop(elementId)) return null;

  const priority = elementId.slice(0, -WORKSHOP_SUFFIX.length) as GoodRank;
  const priorityIndex = GOOD_RANKS.indexOf(priority);

  const allLevels: BuildingData["levels"] = [];

  for (let i = 0; i < buildingsAbbr.length; i++) {
    const selected = selections?.[i]?.[priorityIndex];
    const workshopId = toBuildingId(
      selected || buildingsAbbr[i].buildings[priorityIndex],
    );

    const data = getBuildingData(`${categoryId}_${workshopId}`);
    if (!data) continue;

    allLevels.push(
      ...data.levels.map((lvl) => ({
        ...lvl,
        max_qty: workshopMaxQty(lvl.era, priorityIndex) ?? lvl.max_qty,
      })),
    );
  }

  if (allLevels.length === 0) return null;

  return {
    id: `${categoryId}_${elementId}`,
    name: positionWorkshopLabel(priority),
    category: categoryId,
    subcategory: "workshops",
    imageName: "",
    levels: allLevels,
  };
}

// ── ID Dexie de bâtiment ─────────────────────────────────────────────────────

export interface ParsedBuildingId {
  category: string;
  elementId: string;
  type: "construction" | "upgrade";
  era: string;
  level: number;
}

/**
 * L'ID Dexie d'un bâtiment : `{category}_{elementId}_{type}_{era}_{level}`.
 *
 * L'ordre des paramètres suit celui de l'ID produit — contrairement à
 * `generateBuildingId`, dont la signature `(category, elementId, era, level,
 * type)` ne correspondait pas à sa sortie.
 */
export function buildBuildingId(
  category: string,
  elementId: string,
  type: "construction" | "upgrade",
  era: string,
  level: number,
): string {
  return `${category}_${elementId}_${type}_${era}_${level}`;
}

/**
 * L'ID d'un atelier de position. Prend la POSITION, jamais un nom d'atelier
 * concret : c'est ce qui rend l'ID stable quand le joueur reclasse ses ateliers,
 * et ce qui rend la permutation décrite en tête de fichier impossible.
 */
export function buildWorkshopBuildingId(
  category: string,
  priority: GoodRank,
  type: "construction" | "upgrade",
  era: string,
  level: number,
): string {
  return buildBuildingId(
    category,
    `${priority}${WORKSHOP_SUFFIX}`,
    type,
    era,
    level,
  );
}

/**
 * L'inverse de `buildBuildingId`. `elementId` peut contenir des `_`, d'où le
 * découpage par la fin.
 *
 * `null` si l'ID est malformé — l'appelant historique (`getHydratedBuilding`)
 * ne testait rien et retombait sur un `levels.find` infructueux, donc sur le
 * même `null`, une étape plus loin.
 */
export function parseBuildingId(id: string): ParsedBuildingId | null {
  if (typeof id !== "string") return null;

  const parts = id.split("_");
  // category + elementId + type + era + level
  if (parts.length < 5) return null;

  const level = Number(parts[parts.length - 1]);
  if (!Number.isInteger(level)) return null;

  const type = parts[parts.length - 3];
  if (type !== "construction" && type !== "upgrade") return null;

  return {
    category: parts[0],
    elementId: parts.slice(1, -3).join("_"),
    type,
    era: parts[parts.length - 2],
    level,
  };
}

// ── Lecture du classement joueur ─────────────────────────────────────────────

/** Le classement vide : un triplet par groupe d'ères. */
export function emptyWorkshopSelections(): string[][] {
  return buildingsAbbr.map(() => ["", "", ""]);
}

/**
 * LA seule lecture de `localStorage` du domaine « atelier ».
 *
 * Réservée aux appelants qui ne sont PAS des composants React —
 * `lib/db/data-hydration.ts` est une couche async appelée par `useLiveQuery`,
 * un hook y est inutilisable. Partout ailleurs, passer par
 * `useBuildingSelections()`, qui réagit aux changements ; ce module se contente
 * de garantir que les deux chemins lisent le même octet de la même façon,
 * validation `isValidData` comprise.
 */
export function readWorkshopSelections(): string[][] {
  if (typeof window === "undefined") return emptyWorkshopSelections();

  const stored = localStorage.getItem(WORKSHOP_SELECTIONS_KEY);
  if (!stored || !isValidData(stored)) return emptyWorkshopSelections();

  try {
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : emptyWorkshopSelections();
  } catch {
    return emptyWorkshopSelections();
  }
}
