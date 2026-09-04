// Non-régression de l'étape 7 — la branche « atelier de position » de
// `getHydratedBuilding` (lib/db/data-hydration.ts).
//
// `getHydratedBuilding` est async et lit Dexie ; ce qui change ici est la partie
// PURE qui l'entoure : découper l'ID, résoudre la position vers un atelier réel,
// et en dériver le nom de fiche, le nom d'accordéon, le drapeau « non résolu »
// et la quantité max. Ce fichier isole cette dérivation et confronte l'ancienne
// version, copiée verbatim, à la nouvelle.

import { describe, it, expect } from "vitest";
import {
  resolvePositionWorkshop,
  positionWorkshopLabel,
  workshopMaxQty,
  parseBuildingId,
  buildWorkshopBuildingId,
  buildBuildingId,
  emptyWorkshopSelections,
} from "./workshops";
import { GOOD_RANKS } from "./goods-keys";
import { getBuildingData } from "@/lib/element-data-loader";
import { buildingsAbbr, WORKSHOP_ERAS, type EraAbbr } from "@/lib/constants";
import { DEFAULT_MAX_QTY, WORKSHOP_MAX_QTY } from "@/data/config";
import { ELEMENT_DATA_REGISTRY } from "@/data/registry";
import type { BuildingData } from "@/types/shared";

/** Ce que la dérivation produit, et que la carte du Calculator affiche. */
interface Derived {
  resolvedElementId: string;
  cardName: string;
  accordionName: string;
  isUnresolvedWorkshop: boolean;
  maxQty: number;
  /** `null` quand `getHydratedBuilding` aurait abandonné (retour null). */
  bailed: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// AVANT — copie verbatim de data-hydration.ts, `selections` injecté à la place
// de l'appel à `readWorkshopSelections()` (c'est la lecture qu'on factorise).
// ─────────────────────────────────────────────────────────────────────────────

const WORKSHOP_PRIORITIES = ["primary", "secondary", "tertiary"] as const;

function old_resolveWorkshopElementId(
  elementId: string,
  era: string,
  selections: string[][],
): string {
  const WORKSHOP_SUFFIX = "_workshop";
  if (!elementId.endsWith(WORKSHOP_SUFFIX)) return elementId;

  const priority = elementId.slice(
    0,
    -WORKSHOP_SUFFIX.length,
  ) as (typeof WORKSHOP_PRIORITIES)[number];
  if (!WORKSHOP_PRIORITIES.includes(priority)) return elementId;

  const priorityIndex = WORKSHOP_PRIORITIES.indexOf(priority);

  const groupIndex = buildingsAbbr.findIndex((group) =>
    group.abbreviations.some((abbr) => abbr === era.toUpperCase()),
  );
  if (groupIndex < 0) return elementId;

  const selectedBuilding = selections[groupIndex]?.[priorityIndex];

  if (!selectedBuilding) {
    const defaultBuilding = buildingsAbbr[groupIndex]?.buildings[priorityIndex];
    if (!defaultBuilding) return elementId;
    return defaultBuilding.toLowerCase().replace(/\s+/g, "_");
  }

  return selectedBuilding.toLowerCase().replace(/\s+/g, "_");
}

function old_derive(id: string, selections: string[][]): Derived | null {
  const parts = id.split("_");
  const level = parseInt(parts[parts.length - 1]);
  const era = parts[parts.length - 2];
  const type = parts[parts.length - 3] as "construction" | "upgrade";
  const category = parts[0];
  const elementId = parts.slice(1, -3).join("_");

  const resolvedElementId = old_resolveWorkshopElementId(elementId, era, selections);
  const buildingData = getBuildingData(`${category}_${resolvedElementId}`);
  if (!buildingData) return null;

  const levelData = buildingData.levels.find(
    (l) => l.level === level && l.era === era,
  );
  if (!levelData) return null;
  if (!levelData[type]) return null;

  const isPositionWorkshop = WORKSHOP_PRIORITIES.some(
    (p) => elementId === `${p}_workshop`,
  );
  let cardName = buildingData.name;
  let accordionName = buildingData.name;
  let maxQtyOverride: number | undefined;

  if (isPositionWorkshop) {
    const priority = elementId.slice(
      0,
      -"_workshop".length,
    ) as (typeof WORKSHOP_PRIORITIES)[number];
    const priorityIndex = WORKSHOP_PRIORITIES.indexOf(priority);
    maxQtyOverride = WORKSHOP_MAX_QTY[era.toUpperCase() as EraAbbr]?.[priorityIndex];
    const groupIndex = buildingsAbbr.findIndex((group) =>
      group.abbreviations.some((abbr) => abbr === era.toUpperCase()),
    );
    const selectedBuilding = selections[groupIndex]?.[priorityIndex];

    accordionName = `${priority.charAt(0).toUpperCase()}${priority.slice(1)} Workshop`;
    cardName = selectedBuilding ? selectedBuilding : `Workshop ${era}`;
  }

  const isUnresolvedWorkshop =
    isPositionWorkshop &&
    (() => {
      const priority = elementId.slice(
        0,
        -"_workshop".length,
      ) as (typeof WORKSHOP_PRIORITIES)[number];
      const priorityIndex = WORKSHOP_PRIORITIES.indexOf(priority);
      const groupIndex = buildingsAbbr.findIndex((group) =>
        group.abbreviations.some((abbr) => abbr === era.toUpperCase()),
      );
      return !selections[groupIndex]?.[priorityIndex];
    })();

  return {
    resolvedElementId,
    cardName,
    accordionName,
    isUnresolvedWorkshop,
    maxQty: maxQtyOverride ?? levelData.max_qty ?? DEFAULT_MAX_QTY,
    bailed: false,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// APRÈS — la dérivation telle qu'elle est écrite dans le fichier branché.
// UNE seule lecture du classement, et aucun recalcul à la main.
// ─────────────────────────────────────────────────────────────────────────────

function new_derive(id: string, selections: string[][]): Derived | null {
  const parsed = parseBuildingId(id);
  if (!parsed) return null;
  const { category, elementId, type, era, level } = parsed;

  const workshop = resolvePositionWorkshop(elementId, era, selections);
  const resolvedElementId = workshop ? workshop.buildingId : elementId;

  const buildingData = getBuildingData(`${category}_${resolvedElementId}`);
  if (!buildingData) return null;

  const levelData = buildingData.levels.find(
    (l) => l.level === level && l.era === era,
  );
  if (!levelData) return null;
  if (!levelData[type]) return null;

  const maxQtyOverride = workshop
    ? workshopMaxQty(era, workshop.priorityIndex)
    : undefined;

  return {
    resolvedElementId,
    cardName: workshop
      ? (workshop.selectedName ?? `Workshop ${era}`)
      : buildingData.name,
    accordionName: workshop
      ? positionWorkshopLabel(workshop.priority)
      : buildingData.name,
    isUnresolvedWorkshop: workshop ? workshop.isDefault : false,
    maxQty: maxQtyOverride ?? levelData.max_qty ?? DEFAULT_MAX_QTY,
    bailed: false,
  };
}

// ─────────────────────────────────────────────────────────────────────────────

const RANKINGS: Record<string, string[][]> = {
  "vide": emptyWorkshopSelections(),
  "tableau vide": [],
  "par défaut": buildingsAbbr.map((g) => [...g.buildings]),
  "permuté": [
    ["Artisan", "Tailor", "Stone Mason"],
    ["Spice Merchant", "Scribe", "Carpenter"],
    ["Glassblower", "Jeweler", "Alchemist"],
  ],
  "partiel": [["Artisan", "", ""], [], []],
  "tronqué": [["Tailor", "Stone Mason", "Artisan"]],
};

/** Tous les IDs d'ateliers de position réellement atteignables. */
function workshopIds(): string[] {
  const ids: string[] = [];
  for (const priority of GOOD_RANKS) {
    for (const era of WORKSHOP_ERAS) {
      // On ne garde que les (era, level, type) qui existent vraiment.
      const probe = getBuildingData(
        `capital_${buildingsAbbr[
          buildingsAbbr.findIndex((g) => g.abbreviations.some((a) => a === era))
        ]?.buildings[GOOD_RANKS.indexOf(priority)]
          ?.toLowerCase()
          .replace(/\s+/g, "_")}`,
      );
      for (const lvl of probe?.levels ?? []) {
        if (lvl.era !== era) continue;
        for (const type of ["construction", "upgrade"] as const) {
          if (!lvl[type]) continue;
          ids.push(buildWorkshopBuildingId("capital", priority, type, era, lvl.level));
        }
      }
    }
  }
  return [...new Set(ids)];
}

/** Un échantillon d'IDs de bâtiments ordinaires (non-ateliers). */
function plainIds(limit: number): string[] {
  const ids: string[] = [];
  for (const b of Object.values(ELEMENT_DATA_REGISTRY) as BuildingData[]) {
    const elementId = b.id.split("-").slice(1).join("_");
    for (const lvl of b.levels ?? []) {
      for (const type of ["construction", "upgrade"] as const) {
        if (!lvl[type]) continue;
        ids.push(buildBuildingId(b.category, elementId, type, lvl.era, lvl.level));
        if (ids.length >= limit) return ids;
      }
    }
  }
  return ids;
}

const WORKSHOP_IDS = workshopIds();
const PLAIN_IDS = plainIds(300);

describe("corpus", () => {
  it("couvre de vrais IDs d'ateliers de position", () => {
    expect(WORKSHOP_IDS.length).toBeGreaterThan(50);
    expect(WORKSHOP_IDS.some((id) => id.includes("primary_workshop"))).toBe(true);
    expect(WORKSHOP_IDS.some((id) => id.includes("tertiary_workshop"))).toBe(true);
  });

  it("les IDs d'ateliers se résolvent bien (le test ne compare pas que des null)", () => {
    const resolved = WORKSHOP_IDS.filter(
      (id) => new_derive(id, RANKINGS["par défaut"]) !== null,
    );
    expect(resolved.length).toBeGreaterThan(50);
  });
});

describe("la dérivation « atelier » ≡ l'ancienne, sur tous les IDs × classements", () => {
  it("≡ sur les ateliers de position", () => {
    for (const [label, selections] of Object.entries(RANKINGS)) {
      for (const id of WORKSHOP_IDS) {
        expect({ label, id, d: new_derive(id, selections) }).toEqual({
          label,
          id,
          d: old_derive(id, selections),
        });
      }
    }
  });

  it("≡ sur les bâtiments ordinaires", () => {
    for (const [label, selections] of Object.entries(RANKINGS)) {
      for (const id of PLAIN_IDS) {
        expect({ label, id, d: new_derive(id, selections) }).toEqual({
          label,
          id,
          d: old_derive(id, selections),
        });
      }
    }
  });

  it("≡ sur les cas limites : ère inconnue, catégorie inconnue, niveau absent", () => {
    for (const [label, selections] of Object.entries(RANKINGS)) {
      for (const id of [
        "capital_primary_workshop_upgrade_ZZ_1",
        "nowhere_primary_workshop_upgrade_LG_2",
        "capital_primary_workshop_upgrade_LG_999",
        "capital_small_home_upgrade_ZZ_2",
        "capital_inconnu_upgrade_LG_2",
      ]) {
        expect({ label, id, d: new_derive(id, selections) }).toEqual({
          label,
          id,
          d: old_derive(id, selections),
        });
      }
    }
  });
});

describe("ce que la nouvelle dérivation garantit", () => {
  const permute = RANKINGS["permuté"];

  it("l'accordéon nomme la POSITION, la fiche nomme l'atelier du joueur", () => {
    const id = buildWorkshopBuildingId("capital", "primary", "upgrade", "LG", 2);
    const d = new_derive(id, permute)!;
    expect(d).not.toBeNull();
    expect(d.accordionName).toBe("Primary Workshop");
    expect(d.cardName).toBe("Glassblower"); // primaire DU JOUEUR pour LG
    expect(d.resolvedElementId).toBe("glassblower");
    expect(d.isUnresolvedWorkshop).toBe(false);
  });

  it("sans classement, la fiche affiche « Workshop {ÈRE} » et se dit non résolue", () => {
    const id = buildWorkshopBuildingId("capital", "primary", "upgrade", "LG", 2);
    const d = new_derive(id, emptyWorkshopSelections())!;
    expect(d.cardName).toBe("Workshop LG");
    expect(d.isUnresolvedWorkshop).toBe(true);
    expect(d.accordionName).toBe("Primary Workshop");
  });

  it("la quantité max vient de la POSITION, pas du bâtiment", () => {
    for (const era of WORKSHOP_ERAS) {
      for (const priority of GOOD_RANKS) {
        const expected = workshopMaxQty(era, GOOD_RANKS.indexOf(priority));
        if (expected === undefined) continue;
        const id = WORKSHOP_IDS.find((i) =>
          i.startsWith(`capital_${priority}_workshop_`) && i.includes(`_${era}_`),
        );
        if (!id) continue;
        const d = new_derive(id, permute);
        if (!d) continue;
        expect({ era, priority, q: d.maxQty }).toEqual({ era, priority, q: expected });
      }
    }
  });

  it("un ID malformé est rejeté au découpage plutôt que plus loin", () => {
    for (const id of ["", "trop_court", "capital_x_demolition_LG_2"]) {
      expect(parseBuildingId(id)).toBeNull();
      expect(new_derive(id, permute)).toBeNull();
    }
  });
});
