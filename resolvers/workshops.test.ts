import { describe, it, expect, afterEach } from "vitest";
import {
  isPositionWorkshop,
  resolvePositionWorkshop,
  mergePositionWorkshopData,
  positionWorkshopLabel,
  workshopMaxQty,
  workshopGroupIndex,
  buildBuildingId,
  buildWorkshopBuildingId,
  parseBuildingId,
  readWorkshopSelections,
  emptyWorkshopSelections,
  WORKSHOP_SELECTIONS_KEY,
} from "./workshops";
import { GOOD_RANKS, type GoodRank } from "./goods-keys";
import { buildingsAbbr, WORKSHOP_ERAS } from "@/lib/constants";
import { getBuildingData } from "@/lib/element-data-loader";
import { WORKSHOP_MAX_QTY } from "@/data/config";
import { ELEMENT_DATA_REGISTRY } from "@/data/registry";
import type { BuildingData } from "@/types/shared";

const PRIORITIES = ["primary", "secondary", "tertiary"] as const;

// ─────────────────────────────────────────────────────────────────────────────
// Les implémentations remplacées, copiées VERBATIM — à une exception près :
// les deux qui lisaient `localStorage` reçoivent ici `selections` en paramètre.
// C'est précisément la lecture qu'on remplace ; le reste du corps est intact.
// ─────────────────────────────────────────────────────────────────────────────

// lib/db/data-hydration.ts:168 — resolveWorkshopElementId
function old_hydration(elementId: string, era: string, selections: string[][]): string {
  const WORKSHOP_SUFFIX = "_workshop";
  if (!elementId.endsWith(WORKSHOP_SUFFIX)) return elementId;

  const priority = elementId.slice(0, -WORKSHOP_SUFFIX.length) as (typeof PRIORITIES)[number];
  if (!PRIORITIES.includes(priority)) return elementId;

  const priorityIndex = PRIORITIES.indexOf(priority);
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

// lib/stores/add-element-store.ts:565 — l'IIFE de useSubmitElement
function old_submitIIFE(elementId: string, era: string, selections: string[][]): string {
  const SUFFIX = "_workshop";
  if (!elementId.endsWith(SUFFIX)) return elementId;
  const priority = elementId.slice(0, -SUFFIX.length) as (typeof PRIORITIES)[number];
  if (!PRIORITIES.includes(priority)) return elementId;
  const priorityIndex = PRIORITIES.indexOf(priority);
  const groupIndex = buildingsAbbr.findIndex((g) =>
    g.abbreviations.some((a) => a === era.toUpperCase()),
  );
  if (groupIndex < 0) return elementId;
  const selected = selections[groupIndex]?.[priorityIndex];
  if (selected) return selected.toLowerCase().replace(/\s+/g, "_");
  return buildingsAbbr[groupIndex].buildings[priorityIndex]
    .toLowerCase()
    .replace(/\s+/g, "_");
}

// components/modals/add-element/configuration-panel.tsx:47 — getPositionWorkshopData
// (le paramètre `era` était déjà inutilisé dans le corps d'origine)
function old_configurationPanel(
  elementId: string,
  _era: string,
  selections: string[][],
  categoryId: string,
): BuildingData | null {
  const SUFFIX = "_workshop";
  const priority = elementId.slice(0, -SUFFIX.length) as (typeof PRIORITIES)[number];
  const priorityIndex = PRIORITIES.indexOf(priority);

  const allLevels: BuildingData["levels"] = [];

  for (let i = 0; i < buildingsAbbr.length; i++) {
    const selected = selections[i]?.[priorityIndex];
    const workshopId = selected
      ? selected.toLowerCase().replace(/\s+/g, "_")
      : buildingsAbbr[i].buildings[priorityIndex].toLowerCase().replace(/\s+/g, "_");
    const data = getBuildingData(`${categoryId}_${workshopId}`);
    if (!data) continue;

    const levelsWithCorrectQty = data.levels.map((lvl) => ({
      ...lvl,
      max_qty: WORKSHOP_MAX_QTY[lvl.era]?.[priorityIndex] ?? lvl.max_qty,
    }));
    allLevels.push(...levelsWithCorrectQty);
  }

  if (allLevels.length === 0) return null;

  return {
    id: `${categoryId}_${elementId}`,
    name: `${priority.charAt(0).toUpperCase()}${priority.slice(1)} Workshop`,
    category: categoryId,
    subcategory: "workshops",
    imageName: "",
    levels: allLevels,
  };
}

// lib/stores/add-element-store.ts:127 — generateBuildingId (celle qui permute)
function old_generateBuildingId(
  category: string,
  elementId: string,
  era: string,
  level: number,
  type: "construction" | "upgrade",
): string {
  if (category === "capital") {
    const groupIndex = buildingsAbbr.findIndex((group) =>
      group.abbreviations.some((abbr) => abbr === era.toUpperCase()),
    );
    if (groupIndex >= 0) {
      const buildings = buildingsAbbr[groupIndex].buildings;
      const posIndex = buildings.findIndex(
        (b) => b.toLowerCase().replace(/\s+/g, "_") === elementId.toLowerCase(),
      );
      if (posIndex >= 0) {
        return `${category}_${PRIORITIES[posIndex]}_workshop_${type}_${era}_${level}`;
      }
    }
  }
  return `${category}_${elementId}_${type}_${era}_${level}`;
}

// lib/db/data-hydration.ts:207-211 — le découpage inline de l'ID
function old_parseId(id: string) {
  const parts = id.split("_");
  return {
    level: parseInt(parts[parts.length - 1]),
    era: parts[parts.length - 2],
    type: parts[parts.length - 3] as "construction" | "upgrade",
    category: parts[0],
    elementId: parts.slice(1, -3).join("_"),
  };
}

// ── Jeux de classements couverts ─────────────────────────────────────────────
const RANKINGS: Record<string, string[][]> = {
  "vide (aucun classement)": emptyWorkshopSelections(),
  "tableau vide (forme historique de data-hydration)": [],
  "par défaut, explicite": buildingsAbbr.map((g) => [...g.buildings]),
  "permuté (le cas qui révèle le défaut)": [
    ["Artisan", "Tailor", "Stone Mason"],
    ["Spice Merchant", "Scribe", "Carpenter"],
    ["Glassblower", "Jeweler", "Alchemist"],
  ],
  "partiel (un seul emplacement rempli)": [["Artisan", "", ""], [], []],
  "plus court que buildingsAbbr (localStorage tronqué)": [["Tailor", "Stone Mason", "Artisan"]],
};

const ALL_ERAS = [...new Set([...WORKSHOP_ERAS, ...buildingsAbbr.flatMap((g) => g.abbreviations)])];

// ─────────────────────────────────────────────────────────────────────────────

describe("isPositionWorkshop", () => {
  it("reconnaît les trois positions et rien d'autre", () => {
    for (const p of GOOD_RANKS) expect(isPositionWorkshop(`${p}_workshop`)).toBe(true);
    for (const id of ["tailor", "workshop", "quaternary_workshop", "primary_workshops", ""]) {
      expect(isPositionWorkshop(id)).toBe(false);
    }
  });
});

describe("resolvePositionWorkshop ≡ les deux résolutions remplacées", () => {
  it("≡ data-hydration, sur chaque position × ère × classement", () => {
    for (const [label, selections] of Object.entries(RANKINGS)) {
      for (const era of ALL_ERAS) {
        for (const p of GOOD_RANKS) {
          const elementId = `${p}_workshop`;
          const next = resolvePositionWorkshop(elementId, era, selections)?.buildingId ?? elementId;
          expect({ label, era, p, id: next }).toEqual({
            label,
            era,
            p,
            id: old_hydration(elementId, era, selections),
          });
        }
      }
    }
  });

  it("≡ l'IIFE de useSubmitElement, sur les mêmes entrées", () => {
    for (const [label, selections] of Object.entries(RANKINGS)) {
      for (const era of ALL_ERAS) {
        for (const p of GOOD_RANKS) {
          const elementId = `${p}_workshop`;
          const next = resolvePositionWorkshop(elementId, era, selections)?.buildingId ?? elementId;
          expect({ label, era, p, id: next }).toEqual({
            label,
            era,
            p,
            id: old_submitIIFE(elementId, era, selections),
          });
        }
      }
    }
  });

  it("laisse passer un bâtiment ordinaire (null → l'appelant garde son elementId)", () => {
    expect(resolvePositionWorkshop("tailor", "BA", emptyWorkshopSelections())).toBeNull();
    expect(old_hydration("tailor", "BA", emptyWorkshopSelections())).toBe("tailor");
  });

  it("rend null sur une ère hors de tout groupe", () => {
    expect(resolvePositionWorkshop("primary_workshop", "ZZ", emptyWorkshopSelections())).toBeNull();
  });

  it("distingue le classement du joueur du repli sur l'ordre du jeu", () => {
    const custom = RANKINGS["permuté (le cas qui révèle le défaut)"];
    const chosen = resolvePositionWorkshop("primary_workshop", "BA", custom);
    expect(chosen).toMatchObject({
      priority: "primary",
      priorityIndex: 0,
      groupIndex: 0,
      buildingId: "artisan",
      selectedName: "Artisan",
      isDefault: false,
    });

    const fallback = resolvePositionWorkshop("primary_workshop", "BA", emptyWorkshopSelections());
    expect(fallback).toMatchObject({ buildingId: "tailor", selectedName: null, isDefault: true });
  });

  it("un classement partiel ne vaut que pour l'emplacement rempli", () => {
    const partial = RANKINGS["partiel (un seul emplacement rempli)"];
    expect(resolvePositionWorkshop("primary_workshop", "BA", partial)?.isDefault).toBe(false);
    expect(resolvePositionWorkshop("secondary_workshop", "BA", partial)?.isDefault).toBe(true);
  });
});

describe("workshopGroupIndex", () => {
  it("place chaque ère de workshop dans un groupe, quelle que soit la casse", () => {
    for (const era of WORKSHOP_ERAS) {
      expect(workshopGroupIndex(era)).toBeGreaterThanOrEqual(0);
      expect(workshopGroupIndex(era.toLowerCase())).toBe(workshopGroupIndex(era));
    }
  });

  it("rend -1 sur une ère inconnue", () => {
    expect(workshopGroupIndex("ZZ")).toBe(-1);
  });
});

describe("mergePositionWorkshopData ≡ getPositionWorkshopData", () => {
  it("produit un BuildingData identique, sur chaque position × classement", () => {
    for (const [label, selections] of Object.entries(RANKINGS)) {
      for (const p of GOOD_RANKS) {
        const elementId = `${p}_workshop`;
        const next = mergePositionWorkshopData(elementId, selections, "capital");
        const old = old_configurationPanel(elementId, "", selections, "capital");
        expect({ label, p, data: next }).toEqual({ label, p, data: old });
      }
    }
  });

  it("couvre toutes les ères de workshop en fusionnant les trois groupes", () => {
    const data = mergePositionWorkshopData("primary_workshop", emptyWorkshopSelections(), "capital");
    const eras = new Set(data!.levels.map((l) => l.era));
    for (const era of WORKSHOP_ERAS) expect(eras.has(era)).toBe(true);
  });

  it("remplace les max_qty par ceux de la POSITION", () => {
    const data = mergePositionWorkshopData("primary_workshop", emptyWorkshopSelections(), "capital");
    for (const lvl of data!.levels) {
      const expected = workshopMaxQty(lvl.era, 0);
      if (expected !== undefined) expect(lvl.max_qty).toBe(expected);
    }
  });

  it("rend null hors position, et sur une catégorie sans atelier", () => {
    expect(mergePositionWorkshopData("tailor", emptyWorkshopSelections(), "capital")).toBeNull();
    expect(mergePositionWorkshopData("primary_workshop", emptyWorkshopSelections(), "nowhere")).toBeNull();
  });
});

describe("positionWorkshopLabel / workshopMaxQty", () => {
  it("le libellé est celui des deux copies remplacées", () => {
    expect(positionWorkshopLabel("primary")).toBe("Primary Workshop");
    expect(positionWorkshopLabel("secondary")).toBe("Secondary Workshop");
    expect(positionWorkshopLabel("tertiary")).toBe("Tertiary Workshop");
  });

  it("max_qty dépend de l'ère ET de la position", () => {
    expect(workshopMaxQty("ER", 0)).toBe(4);
    expect(workshopMaxQty("er", 0)).toBe(4);
    expect(workshopMaxQty("ER", 1)).toBe(1);
    expect(workshopMaxQty("ZZ", 0)).toBeUndefined();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// ID Dexie
// ─────────────────────────────────────────────────────────────────────────────

describe("buildBuildingId ≡ les trois gabarits d'ID remplacés", () => {
  it("≡ le template inline des presets (add-element-submission-hooks.ts:352)", () => {
    for (const [category, elementId, type, era, level] of [
      ["capital", "small_home", "upgrade", "LG", 2],
      ["arabia", "carpet_factory", "construction", "HM", 2],
      ["capital", "primary_workshop", "upgrade", "IE", 4],
    ] as const) {
      expect(buildBuildingId(category, elementId, type, era, level)).toBe(
        `${category}_${elementId}_${type}_${era}_${level}`,
      );
    }
  });

  it("≡ la branche non-workshop de generateBuildingId", () => {
    expect(buildBuildingId("capital", "small_home", "upgrade", "LG", 2)).toBe(
      old_generateBuildingId("capital", "small_home", "LG", 2, "upgrade"),
    );
    expect(buildBuildingId("arabia", "carpet_factory", "construction", "HM", 2)).toBe(
      old_generateBuildingId("arabia", "carpet_factory", "HM", 2, "construction"),
    );
  });
});

describe("buildWorkshopBuildingId — l'ID ne dépend plus du classement du joueur", () => {
  it("rend le même ID sous TOUS les classements", () => {
    for (const era of WORKSHOP_ERAS) {
      for (const p of GOOD_RANKS) {
        const ids = new Set(
          Object.values(RANKINGS).map(() =>
            buildWorkshopBuildingId("capital", p, "upgrade", era, 3),
          ),
        );
        expect(ids.size).toBe(1);
        expect([...ids][0]).toBe(`capital_${p}_workshop_upgrade_${era}_3`);
      }
    }
  });

  it("≡ generateBuildingId sous le classement par DÉFAUT — le seul cas où elle était juste", () => {
    const empty = emptyWorkshopSelections();
    for (const era of WORKSHOP_ERAS) {
      for (const p of GOOD_RANKS) {
        const concrete = old_submitIIFE(`${p}_workshop`, era, empty);
        expect(buildWorkshopBuildingId("capital", p, "construction", era, 1)).toBe(
          old_generateBuildingId("capital", concrete, era, 1, "construction"),
        );
      }
    }
  });

  it("RÉGRESSION — sous un classement personnalisé, generateBuildingId permutait les positions", () => {
    const custom = RANKINGS["permuté (le cas qui révèle le défaut)"];

    // L'ancien aller-retour position → atelier concret → position, sur "BA".
    const oldRoundTrip = Object.fromEntries(
      GOOD_RANKS.map((p) => {
        const concrete = old_submitIIFE(`${p}_workshop`, "BA", custom);
        return [p, old_generateBuildingId("capital", concrete, "BA", 1, "construction")];
      }),
    );

    // Le joueur demandait `primary`, l'ID écrit en base disait `tertiary`.
    expect(oldRoundTrip.primary).toBe("capital_tertiary_workshop_construction_BA_1");
    expect(oldRoundTrip.secondary).toBe("capital_primary_workshop_construction_BA_1");
    expect(oldRoundTrip.tertiary).toBe("capital_secondary_workshop_construction_BA_1");

    // La nouvelle fonction ne dérive jamais la position d'un nom concret.
    for (const p of GOOD_RANKS) {
      expect(buildWorkshopBuildingId("capital", p, "construction", "BA", 1)).toBe(
        `capital_${p}_workshop_construction_BA_1`,
      );
    }
  });

  it("la permutation touchait chaque groupe d'ères, pas seulement le premier", () => {
    const custom = RANKINGS["permuté (le cas qui révèle le défaut)"];
    const permuted = WORKSHOP_ERAS.filter((era) => {
      const concrete = old_submitIIFE("primary_workshop", era, custom);
      return (
        old_generateBuildingId("capital", concrete, era, 1, "upgrade") !==
        `capital_primary_workshop_upgrade_${era}_1`
      );
    });
    expect(permuted).toEqual([...WORKSHOP_ERAS]);
  });
});

describe("parseBuildingId ≡ le découpage inline de data-hydration", () => {
  it("rend les mêmes champs sur des IDs bien formés", () => {
    const ids = [
      "capital_small_home_upgrade_LG_2",
      "capital_primary_workshop_construction_BA_1",
      "arabia_carpet_factory_construction_HM_2",
      "capital_luxurious_culture_site_upgrade_EG_10",
    ];
    for (const id of ids) {
      const old = old_parseId(id);
      expect(parseBuildingId(id)).toEqual({
        category: old.category,
        elementId: old.elementId,
        type: old.type,
        era: old.era,
        level: old.level,
      });
    }
  });

  it("fait l'aller-retour avec buildBuildingId sur tout le registre", () => {
    for (const b of Object.values(ELEMENT_DATA_REGISTRY) as BuildingData[]) {
      const [category, ...rest] = b.id.split("-");
      const elementId = rest.join("_");
      if (!category || !elementId) continue;
      const id = buildBuildingId(category, elementId, "upgrade", "LG", 5);
      expect(parseBuildingId(id)).toEqual({
        category,
        elementId,
        type: "upgrade",
        era: "LG",
        level: 5,
      });
    }
  });

  it("rend null sur un ID malformé, là où l'ancien code produisait un NaN", () => {
    expect(Number.isNaN(old_parseId("capital_small_home_upgrade_LG_x").level)).toBe(true);
    expect(parseBuildingId("capital_small_home_upgrade_LG_x")).toBeNull();
    expect(parseBuildingId("trop_court")).toBeNull();
    expect(parseBuildingId("capital_small_home_demolition_LG_2")).toBeNull();
    expect(parseBuildingId("")).toBeNull();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Lecture du classement
// ─────────────────────────────────────────────────────────────────────────────

describe("readWorkshopSelections", () => {
  afterEach(() => {
    delete (globalThis as Record<string, unknown>).window;
    delete (globalThis as Record<string, unknown>).localStorage;
  });

  function stubStorage(value: string | null) {
    const store: Record<string, unknown> = {
      getItem: (k: string) => (k === WORKSHOP_SELECTIONS_KEY ? value : null),
    };
    (globalThis as Record<string, unknown>).window = { localStorage: store };
    (globalThis as Record<string, unknown>).localStorage = store;
  }

  it("rend un classement vide côté serveur (pas de window)", () => {
    expect(readWorkshopSelections()).toEqual(emptyWorkshopSelections());
  });

  it("rend le classement stocké", () => {
    stubStorage(JSON.stringify([["Artisan", "Tailor", "Stone Mason"], [], []]));
    expect(readWorkshopSelections()).toEqual([["Artisan", "Tailor", "Stone Mason"], [], []]);
  });

  it("retombe sur le classement vide : clé absente, JSON invalide, non-tableau, contenu suspect", () => {
    for (const stored of [null, "{oops", JSON.stringify({ a: 1 }), '["<script>"]']) {
      stubStorage(stored);
      expect(readWorkshopSelections()).toEqual(emptyWorkshopSelections());
    }
  });

  it("le repli `[]` de data-hydration et le repli `[['','','']]` du hook sont interchangeables", () => {
    // data-hydration rendait `[]`, le hook rend un triplet vide par groupe.
    // Les deux se consomment par `selections[g]?.[p]`, donc toujours falsy :
    // vérifié sur toutes les positions × ères, pas seulement en principe.
    for (const era of ALL_ERAS) {
      for (const p of GOOD_RANKS) {
        const viaHydration = resolvePositionWorkshop(`${p}_workshop`, era, []);
        const viaHook = resolvePositionWorkshop(`${p}_workshop`, era, emptyWorkshopSelections());
        expect(viaHydration).toEqual(viaHook);
      }
    }
  });
});

describe("cohérence interne du module", () => {
  it("GOOD_RANKS est la seule source des trois positions", () => {
    expect([...GOOD_RANKS]).toEqual([...PRIORITIES]);
    for (const g of buildingsAbbr) expect(g.buildings.length).toBe(GOOD_RANKS.length);
  });

  it("chaque atelier par défaut existe dans le registre", () => {
    for (const group of buildingsAbbr) {
      for (const name of group.buildings) {
        const id = `capital_${name.toLowerCase().replace(/\s+/g, "_")}`;
        expect(getBuildingData(id), id).not.toBeNull();
      }
    }
  });

  it("resolvePositionWorkshop rend un buildingId qui existe dans le registre", () => {
    for (const selections of Object.values(RANKINGS)) {
      for (const era of WORKSHOP_ERAS) {
        for (const p of GOOD_RANKS as readonly GoodRank[]) {
          const r = resolvePositionWorkshop(`${p}_workshop`, era, selections);
          if (!r) continue;
          expect(getBuildingData(`capital_${r.buildingId}`), r.buildingId).not.toBeNull();
        }
      }
    }
  });
});
