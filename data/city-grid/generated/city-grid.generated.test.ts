// Garde-fou de l'extraction du domaine Grille de ville
// (data/city-grid/generated/city-grid.generated.ts) et de sa couche de
// résolution (resolvers/city-grid.ts).
//
// Ce que ces tests protègent : les invariants de FORME sur lesquels le Layout
// Builder s'appuie sans les revérifier au runtime — pavage, alignement,
// intégrité référentielle, partition par surface. Une régression du game
// design amont doit échouer ici, pas au premier drag dans l'éditeur.
import { describe, it, expect } from "vitest";
import { CITY_GRID_EXTRACT } from "@/data/city-grid/generated/city-grid.generated";
import {
  buildableCells,
  cellKey,
  CITY_IDS,
  fitsInCells,
  fixedCulturePoints,
  getCityMap,
  getCityMaps,
  isCityMapUnlocked,
  isBuildableType,
  listCityMaps,
  rotatedFootprint,
  slotAt,
  unlockedCells,
} from "@/resolvers/city-grid";
import type { CityMap } from "@/resolvers/city-grid";

describe("grille de ville — extraction", () => {
  it("6 villes, 832 cases, 0 point indéterminé", () => {
    expect(CITY_GRID_EXTRACT.cities.length).toBe(6);
    const slots = CITY_GRID_EXTRACT.cities.reduce((t, c) => t + c.slots.length, 0);
    expect(slots).toBe(832);
    expect(CITY_GRID_EXTRACT.warnings).toEqual([]);
    for (const city of CITY_GRID_EXTRACT.cities) {
      expect(city.warnings).toEqual([]);
    }
  });

  // Le pas de grille est une constante de ville : le supposer global (4)
  // décalerait toute la grille d'Arabia et des Vikings, qui sont en 3.
  it("expansionSize vaut 3 ou 4 selon la ville", () => {
    const sizes = Object.fromEntries(
      CITY_GRID_EXTRACT.cities.map((c) => [c.cityId, c.expansionSize]),
    );
    expect(sizes).toEqual({
      City_Arabia: 3,
      City_Capital: 4,
      City_China: 4,
      City_Egypt: 4,
      City_Mayas: 4,
      City_Vikings: 3,
    });
  });

  // Les 4 valeurs de 03-batiments.md §7.1, plus l'ABSENCE (598). Une 5e
  // valeur apparue en amont doit être vue ici, pas absorbée.
  it("le vocabulaire des types d'expansion est clos", () => {
    const counts = new Map<string, number>();
    for (const city of CITY_GRID_EXTRACT.cities) {
      for (const slot of city.slots) {
        const key = slot.type ?? "(aucun)";
        counts.set(key, (counts.get(key) ?? 0) + 1);
      }
    }
    expect(Object.fromEntries(counts)).toEqual({
      "(aucun)": 598,
      BLOCKER: 188,
      LINKED: 23,
      CONNECTOR: 22,
      DETACHED_CONNECTOR: 1,
    });
  });

  it("les cases débloquées au démarrage résolvent toutes vers une case connue", () => {
    let total = 0;
    for (const city of CITY_GRID_EXTRACT.cities) {
      const ids = new Set(city.slots.map((s) => s.id));
      for (const id of city.defaultUnlockedIds) {
        expect(ids.has(id), `${city.cityId} : ${id}`).toBe(true);
      }
      total += city.defaultUnlockedIds.length;
    }
    expect(total).toBe(58);
  });

  it("les liens LINKED restent dans la ville porteuse", () => {
    let links = 0;
    for (const city of CITY_GRID_EXTRACT.cities) {
      const ids = new Set(city.slots.map((s) => s.id));
      for (const slot of city.slots) {
        for (const target of slot.linkedTo) {
          expect(ids.has(target), `${slot.id} -> ${target}`).toBe(true);
          links += 1;
        }
      }
    }
    expect(links).toBe(30);
  });

  // Toutes les origines d'une ville partagent un résidu unique modulo le pas :
  // c'est ce qui garantit qu'une case couvre exactement expansionSize² cellules
  // sans chevaucher sa voisine.
  it("toutes les origines sont alignées sur le pas de la ville", () => {
    for (const city of CITY_GRID_EXTRACT.cities) {
      const size = city.expansionSize;
      const residues = new Set(
        city.slots.flatMap((s) => [
          ((s.x % size) + size) % size,
          ((s.y % size) + size) % size,
        ]),
      );
      expect(residues.size, city.cityId).toBe(1);
    }
  });

  // Régression : `rotation` est un enum string, pas un nombre. Un parseur
  // numérique le ramènerait à 0 sur les 5 bâtiments pivotés, qui seraient
  // alors posés avec leurs dimensions dans le mauvais sens.
  it("les 9 bâtiments fixes sont en Arabia, dont 5 pivotés à 90°", () => {
    const fixed = CITY_GRID_EXTRACT.cities.flatMap((c) =>
      c.fixedBuildings.map((f) => ({ city: c.cityId, ...f })),
    );
    expect(fixed.length).toBe(9);
    expect(new Set(fixed.map((f) => f.city))).toEqual(new Set(["City_Arabia"]));
    expect(fixed.filter((f) => f.rotation === 90).length).toBe(5);
    expect(fixed.filter((f) => f.rotation === 0).length).toBe(4);
  });

  // Régression : ces cases sont CONNECTOR, donc jamais dans `CityGrid.slots`.
  // Un rattachement par appartenance aux cases constructibles en perdrait 9/9.
  it("les bâtiments fixes sont portés par des cases CONNECTOR", () => {
    for (const city of CITY_GRID_EXTRACT.cities) {
      const byId = new Map(city.slots.map((s) => [s.id, s]));
      for (const fixed of city.fixedBuildings) {
        expect(byId.get(fixed.expansionId)?.type, fixed.expansionId).toBe("CONNECTOR");
      }
    }
  });

  it("les 8 zones de culture fixes n'existent qu'en Arabia et Egypt", () => {
    const byCity = Object.fromEntries(
      CITY_GRID_EXTRACT.cities
        .filter((c) => c.cultureAreas.length > 0)
        .map((c) => [c.cityId, c.cultureAreas.length]),
    );
    expect(byCity).toEqual({ City_Arabia: 6, City_Egypt: 2 });
  });
});

describe("grille de ville — cartes jouables", () => {
  // Le cœur du découpage : une surface n'est pas une carte. Le port en est
  // une (boîte disjointe de la Capitale) ; l'eau viking non (boîte imbriquée
  // dans la carte viking).
  it("7 cartes pour 6 villes — le port est séparé, l'eau viking non", () => {
    const areas = listCityMaps();
    expect(areas.map((a) => `${a.key} (${a.label})`)).toEqual([
      "City_Arabia|LAND (Arabia)",
      "City_Capital|LAND (Capital City)",
      "City_Capital|HARBOR (Harbor)",
      "City_China|LAND (China)",
      "City_Egypt|LAND (Egypt)",
      "City_Mayas|LAND (Maya Empire)",
      "City_Vikings|LAND (Viking Kingdom)",
    ]);
    expect(CITY_IDS.length).toBe(6);
    // L'eau viking est un TERRAIN de la carte viking, pas une carte.
    const vikings = getCityMap("City_Vikings|LAND")!;
    expect(vikings.surfaces).toEqual(["LAND", "WATER"]);
    expect(getCityMap("City_Vikings|WATER")).toBeNull();
  });

  // Régression du besoin produit : ouvrir la Capitale ne doit jamais faire
  // apparaître le Port, et inversement.
  it("Capitale et Port sont deux cartes étanches", () => {
    const land = getCityMap("City_Capital|LAND")!;
    const harbor = getCityMap("City_Capital|HARBOR")!;

    expect(land.cols).toBe(12);
    expect(land.rows).toBe(10);
    expect(land.slots.length).toBe(120);
    expect(land.sparse).toBe(false); // pavage complet
    expect(land.surfaces).toEqual(["LAND"]);

    expect(harbor.slots.length).toBe(42);
    expect(harbor.surfaces).toEqual(["HARBOR"]);

    // Aucune case, aucune cellule en commun.
    const landIds = new Set(land.slots.map((s) => s.id));
    expect(harbor.slots.some((s) => landIds.has(s.id))).toBe(false);
    const landCells = buildableCells(land);
    expect([...buildableCells(harbor)].some((c) => landCells.has(c))).toBe(false);

    // Et deux cadrages disjoints : le port est au nord, en y négatif.
    expect(harbor.bounds.y).toBeLessThan(0);
    expect(harbor.bounds.y + harbor.bounds.height).toBeLessThanOrEqual(land.bounds.y);
  });

  it("les deux cartes de Capital partitionnent exactement ses cases constructibles", () => {
    const areas = getCityMaps("City_Capital");
    expect(areas.length).toBe(2);
    const total = areas.reduce((t, a) => t + a.slots.length, 0);
    expect(total).toBe(162); // 120 terrestres + 42 portuaires
  });

  it("une carte inexistante retourne null plutôt que de lever", () => {
    expect(getCityMap("City_Mayas|HARBOR")).toBeNull();
    expect(getCityMap("City_Inexistante|LAND")).toBeNull();
    expect(getCityMaps("City_Inexistante")).toEqual([]);
    expect(getCityMap("City_Mayas|LAND")).not.toBeNull();
  });

  it("la carte terrestre passe toujours en premier", () => {
    for (const cityId of CITY_IDS) {
      const areas = getCityMaps(cityId);
      expect(areas[0].surface, cityId).toBe("LAND");
    }
  });

  it("BLOCKER et connecteurs ne sont jamais constructibles", () => {
    expect(isBuildableType(null)).toBe(true);
    expect(isBuildableType("LINKED")).toBe(true);
    expect(isBuildableType("BLOCKER")).toBe(false);
    expect(isBuildableType("CONNECTOR")).toBe(false);
    expect(isBuildableType("DETACHED_CONNECTOR")).toBe(false);

    for (const area of listCityMaps()) {
      for (const slot of area.slots) {
        expect(isBuildableType(slot.type), `${area.key} ${slot.id}`).toBe(true);
      }
    }
  });

  it("chaque case développe exactement expansionSize² cellules", () => {
    for (const area of listCityMaps()) {
      expect(buildableCells(area).size, area.key).toBe(
        area.slots.length * area.expansionSize * area.expansionSize,
      );
    }
  });

  // C'est ce filtrage par terrain qui interdira un bâtiment terrestre sur
  // l'eau : les deux jeux de cellules d'une même carte sont disjoints.
  it("les cellules se filtrent par terrain à l'intérieur d'une carte", () => {
    const vikings = getCityMap("City_Vikings|LAND")!;
    const land = buildableCells(vikings, "LAND");
    const water = buildableCells(vikings, "WATER");
    expect(land.size).toBe(116 * 9);
    expect(water.size).toBe(36 * 9);
    expect([...water].some((c) => land.has(c))).toBe(false);
    expect(land.size + water.size).toBe(buildableCells(vikings).size);
  });

  it("cellKey est injectif sur la plage de coordonnées réelle", () => {
    const seen = new Set<number>();
    for (let x = -32; x <= 64; x++) {
      for (let y = -32; y <= 64; y++) {
        const key = cellKey(x, y);
        expect(seen.has(key)).toBe(false);
        seen.add(key);
      }
    }
  });

  it("le placement suit le terrain débloqué, pas la bounding box", () => {
    const area = getCityMap("City_Capital|LAND")!;
    const unlocked = unlockedCells(area, area.defaultUnlockedIds);
    expect(area.defaultUnlockedIds.size).toBe(6);
    expect(unlocked.size).toBe(6 * 16);

    const origin = area.slots.find((s) => area.defaultUnlockedIds.has(s.id))!;
    expect(fitsInCells({ x: origin.x, y: origin.y, width: 2, height: 2 }, unlocked)).toBe(true);
    const locked = area.slots.find((s) => !area.defaultUnlockedIds.has(s.id))!;
    expect(fitsInCells({ x: locked.x, y: locked.y, width: 1, height: 1 }, unlocked)).toBe(false);
  });

  it("slotAt retrouve la case d'une cellule, et null hors carte", () => {
    const area = getCityMap("City_Capital|LAND")!;
    const slot = area.slots[0];
    expect(slotAt(area, slot.x, slot.y)?.id).toBe(slot.id);
    expect(slotAt(area, slot.x + area.expansionSize - 1, slot.y)?.id).toBe(slot.id);
    expect(slotAt(area, 9999, 9999)).toBeNull();
  });

  it("les zones de culture sont rattachées à la carte qu'elles recoupent", () => {
    const arabia = getCityMap("City_Arabia|LAND")!;
    expect(arabia.cultureAreas.length).toBe(6);
    expect(fixedCulturePoints(arabia)).toBe(1800);
    expect(fixedCulturePoints(getCityMap("City_Capital|LAND")!)).toBe(0);
    expect(fixedCulturePoints(getCityMap("City_Capital|HARBOR")!)).toBe(0);
  });

  it("les bâtiments fixes sont rattachés à la carte de leur case porteuse", () => {
    const arabia: CityMap = getCityMap("City_Arabia|LAND")!;
    expect(arabia.fixedBuildings.length).toBe(9);
    for (const fixed of arabia.fixedBuildings) {
      expect(fixed.x).toBeGreaterThanOrEqual(arabia.bounds.x);
      expect(fixed.x).toBeLessThan(arabia.bounds.x + arabia.bounds.width);
      expect(fixed.y).toBeGreaterThanOrEqual(arabia.bounds.y);
      expect(fixed.y).toBeLessThan(arabia.bounds.y + arabia.bounds.height);
      // Leur case est un CONNECTOR : invisible depuis les cases constructibles.
      expect(slotAt(arabia, fixed.x, fixed.y), fixed.buildingId).toBeNull();
    }
    expect(getCityMap("City_Capital|LAND")!.fixedBuildings).toEqual([]);
  });

  // Besoin produit : un joueur qui n'a pas atteint EG ne doit pas se voir
  // proposer le Port. Le plancher est DÉDUIT de la palette, pas codé en dur.
  it("le Port n'est jouable qu'à partir de EG", () => {
    const harbor = getCityMap("City_Capital|HARBOR")!;
    expect(harbor.minEra).toBe("EG");
    expect(isCityMapUnlocked(harbor, "HM")).toBe(false);
    expect(isCityMapUnlocked(harbor, "EG")).toBe(true);
    expect(isCityMapUnlocked(harbor, "LG")).toBe(true);

    // La Capitale, elle, est jouable dès la première ère.
    const capital = getCityMap("City_Capital|LAND")!;
    expect(capital.minEra).toBe("SA");
    expect(isCityMapUnlocked(capital, "SA")).toBe(true);
  });

  it("l'ère plancher de chaque carte", () => {
    expect(
      Object.fromEntries(listCityMaps().map((m) => [m.key, m.minEra])),
    ).toEqual({
      "City_Arabia|LAND": "KS",
      "City_Capital|LAND": "SA",
      "City_Capital|HARBOR": "EG",
      "City_China|LAND": "ER",
      "City_Egypt|LAND": "ME",
      "City_Mayas|LAND": "BE",
      "City_Vikings|LAND": "FA",
    });
  });

  it("le catalogue se filtre par ère, sans jamais perdre la Capitale", () => {
    expect(listCityMaps({ era: "SA" }).map((m) => m.key)).toEqual([
      "City_Capital|LAND",
    ]);
    // À HM, tout est ouvert sauf le Port (EG) et l'Arabie (KS)… non : KS < HM.
    const hm = listCityMaps({ era: "HM" }).map((m) => m.key);
    expect(hm).toContain("City_Arabia|LAND");
    expect(hm).not.toContain("City_Capital|HARBOR");
    // À EG, le Port apparaît.
    expect(listCityMaps({ era: "EG" }).map((m) => m.key)).toContain(
      "City_Capital|HARBOR",
    );
    // Sans filtre, les 7.
    expect(listCityMaps().length).toBe(7);
  });

  // L'eau viking s'ouvre en même temps que sa carte : elle ne crée pas de
  // plancher distinct, contrairement au Port.
  it("l'eau viking ne décale pas l'ère de sa carte", () => {
    const vikings = getCityMap("City_Vikings|LAND")!;
    expect(vikings.minEra).toBe("FA");
    expect(vikings.surfaces).toEqual(["LAND", "WATER"]);
  });

  it("une rotation de 90° inverse l'emprise, 180° la laisse intacte", () => {
    expect(rotatedFootprint(3, 2, 0)).toEqual({ width: 3, height: 2 });
    expect(rotatedFootprint(3, 2, 90)).toEqual({ width: 2, height: 3 });
    expect(rotatedFootprint(3, 2, 180)).toEqual({ width: 3, height: 2 });
    expect(rotatedFootprint(3, 2, 270)).toEqual({ width: 2, height: 3 });
  });
});
