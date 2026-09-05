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
  getCityGrid,
  isBuildableType,
  listCityGrids,
  rotatedFootprint,
  slotAt,
  unlockedCells,
} from "@/resolvers/city-grid";

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

describe("grille de ville — résolution", () => {
  it("8 grilles jouables pour 6 villes", () => {
    const grids = listCityGrids();
    expect(grids.map((g) => g.key)).toEqual([
      "City_Arabia|LAND",
      "City_Capital|LAND",
      "City_Capital|HARBOR",
      "City_China|LAND",
      "City_Egypt|LAND",
      "City_Mayas|LAND",
      "City_Vikings|LAND",
      "City_Vikings|WATER",
    ]);
    expect(CITY_IDS.length).toBe(6);
  });

  // Le cas qui justifie tout le découpage par surface : traiter Capital comme
  // une grille unique donnerait 12x19 au lieu de 12x10, avec 9 rangées vides
  // entre la ville et son port.
  it("Capital est bien deux grilles disjointes, pas une de 12x19", () => {
    const land = getCityGrid("City_Capital", "LAND");
    const harbor = getCityGrid("City_Capital", "HARBOR");
    expect(land).not.toBeNull();
    expect(harbor).not.toBeNull();

    expect(land!.cols).toBe(12);
    expect(land!.rows).toBe(10);
    expect(land!.slots.length).toBe(120);
    expect(land!.sparse).toBe(false); // pavage complet
    expect(land!.bounds).toEqual({ x: 3, y: 11, width: 48, height: 40 });

    expect(harbor!.slots.length).toBe(42);
    expect(harbor!.bounds.y).toBeLessThan(0); // le port est au nord, en y négatif
    expect(harbor!.bounds.y + harbor!.bounds.height).toBeLessThan(land!.bounds.y);
  });

  it("une surface absente retourne null plutôt que de lever", () => {
    expect(getCityGrid("City_Mayas", "HARBOR")).toBeNull();
    expect(getCityGrid("City_Mayas", "WATER")).toBeNull();
    expect(getCityGrid("City_Inexistante", "LAND")).toBeNull();
    expect(getCityGrid("City_Mayas", "LAND")).not.toBeNull();
  });

  it("BLOCKER et connecteurs ne sont jamais constructibles", () => {
    expect(isBuildableType(null)).toBe(true);
    expect(isBuildableType("LINKED")).toBe(true);
    expect(isBuildableType("BLOCKER")).toBe(false);
    expect(isBuildableType("CONNECTOR")).toBe(false);
    expect(isBuildableType("DETACHED_CONNECTOR")).toBe(false);

    for (const grid of listCityGrids()) {
      for (const slot of grid.slots) {
        expect(isBuildableType(slot.type), `${grid.key} ${slot.id}`).toBe(true);
      }
    }
  });

  it("chaque case développe exactement expansionSize² cellules", () => {
    for (const grid of listCityGrids()) {
      const cells = buildableCells(grid);
      expect(cells.size, grid.key).toBe(
        grid.slots.length * grid.expansionSize * grid.expansionSize,
      );
    }
  });

  // L'encodage entier doit être injectif sur la plage réelle des coordonnées
  // (-25..51) : une collision ferait passer un placement invalide.
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
    const grid = getCityGrid("City_Capital", "LAND")!;
    const unlocked = unlockedCells(grid, grid.defaultUnlockedIds);
    // 6 cases débloquées au départ, 4x4 unités chacune.
    expect(grid.defaultUnlockedIds.size).toBe(6);
    expect(unlocked.size).toBe(6 * 16);

    const origin = grid.slots.find((s) => grid.defaultUnlockedIds.has(s.id))!;
    // Un 2x2 tient dans une case débloquée…
    expect(fitsInCells({ x: origin.x, y: origin.y, width: 2, height: 2 }, unlocked)).toBe(true);
    // …et le coin de la bounding box ne suffit pas si sa case est verrouillée.
    const locked = grid.slots.find((s) => !grid.defaultUnlockedIds.has(s.id))!;
    expect(fitsInCells({ x: locked.x, y: locked.y, width: 1, height: 1 }, unlocked)).toBe(false);
  });

  it("slotAt retrouve la case d'une cellule, et null hors grille", () => {
    const grid = getCityGrid("City_Capital", "LAND")!;
    const slot = grid.slots[0];
    expect(slotAt(grid, slot.x, slot.y)?.id).toBe(slot.id);
    expect(slotAt(grid, slot.x + grid.expansionSize - 1, slot.y)?.id).toBe(slot.id);
    expect(slotAt(grid, 9999, 9999)).toBeNull();
  });

  it("les zones de culture sont rattachées à la surface qu'elles recoupent", () => {
    const arabia = getCityGrid("City_Arabia", "LAND")!;
    expect(arabia.cultureAreas.length).toBe(6);
    expect(fixedCulturePoints(arabia)).toBe(1800);
    expect(fixedCulturePoints(getCityGrid("City_Capital", "LAND")!)).toBe(0);
  });

  it("les bâtiments fixes sont rattachés à la surface de leur case porteuse", () => {
    const arabia = getCityGrid("City_Arabia", "LAND")!;
    expect(arabia.fixedBuildings.length).toBe(9);
    for (const fixed of arabia.fixedBuildings) {
      // Ils tombent dans le cadrage de la grille, sans être sur une case
      // constructible (leur case est un CONNECTOR).
      expect(fixed.x).toBeGreaterThanOrEqual(arabia.bounds.x);
      expect(fixed.x).toBeLessThan(arabia.bounds.x + arabia.bounds.width);
      expect(fixed.y).toBeGreaterThanOrEqual(arabia.bounds.y);
      expect(fixed.y).toBeLessThan(arabia.bounds.y + arabia.bounds.height);
      expect(slotAt(arabia, fixed.x, fixed.y), fixed.buildingId).toBeNull();
    }
    // Aucune autre grille n'en hérite.
    expect(getCityGrid("City_Capital", "LAND")!.fixedBuildings).toEqual([]);
  });

  it("une rotation de 90° inverse l'emprise, 180° la laisse intacte", () => {
    expect(rotatedFootprint(3, 2, 0)).toEqual({ width: 3, height: 2 });
    expect(rotatedFootprint(3, 2, 90)).toEqual({ width: 2, height: 3 });
    expect(rotatedFootprint(3, 2, 180)).toEqual({ width: 3, height: 2 });
    expect(rotatedFootprint(3, 2, 270)).toEqual({ width: 2, height: 3 });
  });
});
