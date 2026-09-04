// Garde-fou du CHEMIN DE RÉSOLUTION des biens d'ère.
//
// C'est le mécanisme qui relie un coût à ce que le joueur possède réellement :
//
//   coût en bien concret  ──getPriorityKeyFromGoodName──▶  seau du joueur
//   seau du joueur        ──getGoodNameFromPriorityEra──▶  bien affiché
//
// Les deux sens traversent le MÊME classement joueur (`local:buildingSelections`,
// choisi librement dans components/modals/workshop-modal.tsx : primary parmi 3,
// secondary parmi les 2 restants, tertiary déduit — 6 classements possibles par
// groupe d'ères). L'invariant qui fait tenir tout l'édifice est que l'aller et le
// retour s'annulent, POUR LES 6 CLASSEMENTS. Rien ne le vérifiait jusqu'ici.
//
// Le cas qui a motivé ce fichier : `goodsUrlByEra.SA` dupliquait `BA` mot pour
// mot, et comme la résolution inverse retourne la première ère qui correspond,
// les trois biens du Bronze atterrissaient dans un seau `*_sa`.
import { existsSync } from "node:fs";
import path from "node:path";
import { describe, it, expect } from "vitest";
import {
  buildingsAbbr,
  eras,
  goodsUrlByEra,
  makePriorityKey,
  PRIORITY_TYPES,
  type EraAbbr,
  type PriorityType,
} from "@/lib/constants";
import {
  getBuildingFromLocal,
  getGoodNameFromPriorityEra,
  getPriorityKeyFromGoodName,
  hasCompleteWorkshopRanking,
  slugify,
} from "@/lib/utils";

/** Les 6 ordres possibles d'un groupe de 3 ateliers. */
function permutations<T>(items: T[]): T[][] {
  if (items.length <= 1) return [items];
  return items.flatMap((item, i) =>
    permutations([...items.slice(0, i), ...items.slice(i + 1)]).map((rest) => [
      item,
      ...rest,
    ]),
  );
}

/** Un `string[][]` complet : le même rang de permutation appliqué aux 3 groupes. */
function selectionsFor(rankIndex: number): string[][] {
  return buildingsAbbr.map((group) => permutations(group.buildings)[rankIndex]);
}

const RANKINGS = permutations([0, 1, 2]).map((_, i) => i); // 0..5
const ERAS_WITH_GOODS = eras.filter((era) => era.abbr !== "SA");

describe("référentiel goodsUrlByEra", () => {
  // Régression directe du doublon SA/BA.
  it("l'Âge de pierre n'a aucun bien", () => {
    expect(Object.keys(goodsUrlByEra.SA)).toEqual([]);
  });

  it("chaque autre ère porte les 3 ateliers de son groupe, et eux seuls", () => {
    for (const era of ERAS_WITH_GOODS) {
      const abbr = era.abbr as EraAbbr;
      const group = buildingsAbbr.find((g) =>
        g.abbreviations.some((a) => a.toUpperCase() === abbr.toUpperCase()),
      );
      expect(group, `aucun groupe d'ateliers pour ${abbr}`).toBeDefined();
      expect([...Object.keys(goodsUrlByEra[abbr])].sort(), `ère ${abbr}`).toEqual(
        group!.buildings.map((b) => slugify(b)).sort(),
      );
    }
  });

  // `getPriorityKeyFromGoodName` retourne la PREMIÈRE ère qui correspond : deux
  // ères partageant une clé de bien rendraient le résultat dépendant de l'ordre
  // de `eras`. C'est exactement ce que faisait SA.
  it("aucune clé de bien n'est partagée par deux ères", () => {
    const seen = new Map<string, string[]>();
    for (const [abbr, goods] of Object.entries(goodsUrlByEra)) {
      for (const [workshop, meta] of Object.entries(goods)) {
        seen.set(meta.key, [...(seen.get(meta.key) ?? []), `${abbr}/${workshop}`]);
      }
    }
    const duplicates = [...seen.entries()].filter(([, where]) => where.length > 1);
    expect(duplicates.map(([key, where]) => `${key}: ${where.join(", ")}`)).toEqual([]);
  });

  // La clé est l'identifiant du bien (data/**, nom de fichier d'icône) ; `name`
  // n'est qu'un libellé. Les deux divergent sur trois biens, parce que le jeu
  // lui-même porte `_Name` (singulier) et `_TechnologyName` (pluriel).
  it("chaque entrée porte une clé, et la clé n'est pas dérivable du libellé", () => {
    const divergent: string[] = [];
    for (const goods of Object.values(goodsUrlByEra)) {
      for (const meta of Object.values(goods)) {
        expect(meta.key, `libellé « ${meta.name} » sans clé`).toBeTruthy();
        if (meta.key !== slugify(meta.name)) divergent.push(`${meta.key} ≠ ${slugify(meta.name)}`);
      }
    }
    expect(divergent.sort()).toEqual([
      "elixier ≠ elixirs",
      "embellishment ≠ embellishments",
      "secretary ≠ secretary_desk",
    ]);
  });

  // Aurait attrapé le renommage d'icône s'il avait été fait à moitié.
  it("chaque clé a son fichier d'icône dans public/images/goods", () => {
    const missing: string[] = [];
    for (const goods of Object.values(goodsUrlByEra)) {
      for (const meta of Object.values(goods)) {
        const file = path.join(process.cwd(), "public", "images", "goods", `${meta.key}.webp`);
        if (!existsSync(file)) missing.push(`${meta.key}.webp`);
      }
    }
    expect(missing).toEqual([]);
  });
});

describe("getBuildingFromLocal — lecture du classement joueur", () => {
  it("chaque ère lit le bon groupe, chaque priorité le bon slot", () => {
    const selections = selectionsFor(0);
    for (const era of eras) {
      const groupIndex = buildingsAbbr.findIndex((g) =>
        g.abbreviations.some((a) => a.toUpperCase() === era.abbr.toUpperCase()),
      );
      expect(groupIndex, `ère ${era.abbr} rattachée à aucun groupe`).toBeGreaterThanOrEqual(0);
      PRIORITY_TYPES.forEach((priority, slot) => {
        expect(getBuildingFromLocal(priority, era.abbr, selections)).toBe(
          selections[groupIndex][slot],
        );
      });
    }
  });

  it("une priorité inconnue ou un slot vide ne renvoie rien d'exploitable", () => {
    const selections = selectionsFor(0);
    expect(getBuildingFromLocal("quaternary", "RE", selections)).toBeUndefined();
    expect(getBuildingFromLocal("primary", "NOPE", selections)).toBeUndefined();
    expect(getBuildingFromLocal("secondary", "RE", [["Tailor", "", ""], [], []])).toBe("");
  });
});

describe("getPriorityKeyFromGoodName — les 6 classements", () => {
  it("retrouve le slot où le joueur a rangé l'atelier producteur", () => {
    for (const rank of RANKINGS) {
      const selections = selectionsFor(rank);
      for (const era of ERAS_WITH_GOODS) {
        const abbr = era.abbr as EraAbbr;
        for (const [workshop, meta] of Object.entries(goodsUrlByEra[abbr])) {
          const expectedSlot = PRIORITY_TYPES.find(
            (priority) =>
              slugify(getBuildingFromLocal(priority, abbr, selections) ?? "") === workshop,
          );
          expect(expectedSlot, `${abbr}/${workshop} absent du classement ${rank}`).toBeDefined();
          expect(
            getPriorityKeyFromGoodName(meta.key, selections),
            `classement ${rank} — ${meta.key} (${abbr})`,
          ).toBe(makePriorityKey(expectedSlot as PriorityType, abbr));
        }
      }
    }
  });

  // L'INVARIANT central : le classement est appliqué à l'aller puis au retour,
  // donc un coût écrit en bien concret affiche le même bien quel que soit le
  // classement. C'est ce qui distingue l'encodage concret de l'encodage en rang.
  it("aller-retour : le bien affiché est toujours le bien de départ", () => {
    for (const rank of RANKINGS) {
      const selections = selectionsFor(rank);
      for (const era of ERAS_WITH_GOODS) {
        const abbr = era.abbr as EraAbbr;
        for (const meta of Object.values(goodsUrlByEra[abbr])) {
          const key = getPriorityKeyFromGoodName(meta.key, selections);
          expect(key, `${meta.key} non résolu (classement ${rank})`).not.toBeNull();
          const [priority] = key!.split("_");
          expect(
            getGoodNameFromPriorityEra(priority, abbr, selections),
            `classement ${rank} — aller-retour de ${meta.key}`,
          ).toBe(meta.key);
        }
      }
    }
  });

  it("le seau retourné change avec le classement, jamais le bien", () => {
    const cape = goodsUrlByEra.RE.tailor.key;
    const tailorFirst = [["Tailor", "Stone Mason", "Artisan"], [], []];
    const tailorLast = [["Stone Mason", "Artisan", "Tailor"], [], []];
    expect(getPriorityKeyFromGoodName(cape, tailorFirst)).toBe("primary_re");
    expect(getPriorityKeyFromGoodName(cape, tailorLast)).toBe("tertiary_re");
    expect(getGoodNameFromPriorityEra("primary", "RE", tailorFirst)).toBe("cape");
    expect(getGoodNameFromPriorityEra("tertiary", "RE", tailorLast)).toBe("cape");
  });

  // Régression du doublon : ces trois biens sont ceux du Bronze, pas de l'Âge
  // de pierre — qui n'en a aucun.
  it("les biens du Bronze tombent en `*_ba`, jamais en `*_sa`", () => {
    const selections = selectionsFor(0);
    for (const meta of Object.values(goodsUrlByEra.BA)) {
      expect(getPriorityKeyFromGoodName(meta.key, selections)).toMatch(/_ba$/);
    }
  });
});

describe("hasCompleteWorkshopRanking — garde-fou du repli d'affichage", () => {
  // Le repli sur l'ordre du jeu (GOOD_ERA_POSITION) ne doit JAMAIS cohabiter
  // avec le classement du joueur dans une même ère : avec `["Artisan","",""]`,
  // le classement place `bronze_bracelet` en primary_ba et le repli y place
  // aussi `alabaster_idol` (order 1) — les deux montants fusionnent, et le bien
  // apparaît deux fois dans le bloc d'ère. Constaté à l'écran, puis figé ici.
  it("un classement complet est reconnu, un classement partiel ne l'est pas", () => {
    const complet = [["Tailor", "Stone Mason", "Artisan"], [], []];
    const partiel = [["Artisan", "", ""], [], []];
    const vide = [["", "", ""], [], []];
    expect(hasCompleteWorkshopRanking("BA", complet)).toBe(true);
    expect(hasCompleteWorkshopRanking("RE", complet)).toBe(true);
    expect(hasCompleteWorkshopRanking("BA", partiel)).toBe(false);
    expect(hasCompleteWorkshopRanking("BA", vide)).toBe(false);
    expect(hasCompleteWorkshopRanking("BA", [])).toBe(false);
  });

  it("les 6 classements complets sont tous reconnus, sur toutes les ères", () => {
    for (const rank of RANKINGS) {
      const selections = selectionsFor(rank);
      for (const era of ERAS_WITH_GOODS) {
        expect(
          hasCompleteWorkshopRanking(era.abbr, selections),
          `classement ${rank} — ère ${era.abbr}`,
        ).toBe(true);
      }
    }
  });

  // Sous classement partiel, `getPriorityKeyFromGoodName` ne résout QUE
  // l'atelier renseigné : c'est ce résultat asymétrique qui rendait le mélange
  // dangereux.
  it("un classement partiel ne résout que l'atelier renseigné", () => {
    const partiel = [["Artisan", "", ""], [], []];
    expect(getPriorityKeyFromGoodName("bronze_bracelet", partiel)).toBe("primary_ba");
    expect(getPriorityKeyFromGoodName("alabaster_idol", partiel)).toBeNull();
    expect(getPriorityKeyFromGoodName("wool", partiel)).toBeNull();
  });
});

describe("règle d'affichage : nommer une ligne ou pas", () => {
  // Une ligne ne nomme un bien que si le joueur a nommé l'atelier QUI LE PRODUIT.
  // C'est `getPriorityKeyFromGoodName(bienPosé) !== null` qui en décide, dans
  // le Calculator comme sur la page Technologies. Sinon : caisse générique +
  // « Primary »/« Secondary »/« Tertiary ».
  const nomme = (good: string, selections: string[][]) =>
    getPriorityKeyFromGoodName(good, selections) !== null;

  it("classement vide : aucune ligne n'est nommée", () => {
    const vide = [["", "", ""], [], []];
    for (const meta of Object.values(goodsUrlByEra.BA)) {
      expect(nomme(meta.key, vide), meta.key).toBe(false);
    }
  });

  it("classement partiel : seul le bien de l'atelier nommé l'est", () => {
    const partiel = [["Artisan", "", ""], [], []];
    // L'Artisan produit le bien d'`order` 2 de chaque ère de son groupe.
    expect(nomme("bronze_bracelet", partiel)).toBe(true); // BA, artisan
    expect(nomme("iron_pendant", partiel)).toBe(true); // ME, artisan
    expect(nomme("alabaster_idol", partiel)).toBe(false); // BA, stoneMason
    expect(nomme("wool", partiel)).toBe(false); // BA, tailor
    // Et rien du groupe suivant, non renseigné.
    expect(nomme("grimoire", partiel)).toBe(false); // HM, scribe
  });

  it("classement complet : toutes les lignes sont nommées", () => {
    for (const rank of RANKINGS) {
      const selections = selectionsFor(rank);
      for (const era of ERAS_WITH_GOODS) {
        for (const meta of Object.values(goodsUrlByEra[era.abbr as EraAbbr])) {
          expect(nomme(meta.key, selections), `classement ${rank} — ${meta.key}`).toBe(true);
        }
      }
    }
  });
});

describe("getPriorityKeyFromGoodName — replis", () => {
  it("classement absent ou incomplet : `null`, pas d'erreur", () => {
    const cape = goodsUrlByEra.RE.tailor.key;
    expect(getPriorityKeyFromGoodName(cape, [])).toBeNull();
    expect(getPriorityKeyFromGoodName(cape, [["", "", ""], [], []])).toBeNull();
    // Le joueur n'a pas classé le Tailleur : le bien n'est pas perdu, il sort
    // simplement du bloc d'ère (traité par `useOtherGoods`).
    expect(getPriorityKeyFromGoodName(cape, [["Stone Mason", "", ""], [], []])).toBeNull();
  });

  it("un bien inconnu du référentiel ne résout pas", () => {
    const selections = selectionsFor(0);
    expect(getPriorityKeyFromGoodName("papyrus_scroll", selections)).toBeNull();
    expect(getPriorityKeyFromGoodName("", selections)).toBeNull();
  });

  // Ce qui circule dans `data/**` et dans la map des totaux, ce sont des CLÉS.
  // Accepter aussi le libellé rendrait `secretary` et `secretary_desk` tous deux
  // valides — soit exactement l'alias qu'on vient de supprimer.
  it("résout sur la clé, pas sur le libellé", () => {
    // Classement 0 = l'ordre de déclaration de `buildingsAbbr` :
    //   Tailor/StoneMason/Artisan · Scribe/Carpenter/SpiceMerchant · Jeweler/Alchemist/Glassblower
    // `secretary` est le bien du Carpenter, donc en 2ᵉ position ici.
    const selections = selectionsFor(0);
    expect(getPriorityKeyFromGoodName("secretary", selections)).toBe("secondary_hm");
    expect(getPriorityKeyFromGoodName("Secretary Desk", selections)).toBeNull();
    expect(getPriorityKeyFromGoodName("elixier", selections)).toBe("secondary_lg");
    expect(getPriorityKeyFromGoodName("elixirs", selections)).toBeNull();
    expect(getPriorityKeyFromGoodName("embellishment", selections)).toBe("primary_lg");
    expect(getPriorityKeyFromGoodName("embellishments", selections)).toBeNull();
  });

  // Le libellé, lui, reste celui que l'app affichait avant le renommage.
  it("le libellé affiché est préservé", () => {
    expect(goodsUrlByEra.HM.carpenter.name).toBe("Secretary Desk");
    expect(goodsUrlByEra.LG.alchemist.name).toBe("Elixirs");
    expect(goodsUrlByEra.LG.jeweler.name).toBe("Embellishments");
  });
});
