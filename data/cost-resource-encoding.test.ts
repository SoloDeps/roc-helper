// Garde-fou d'ENCODAGE des biens de capitale dans les coûts.
//
// Un coût de la capitale s'écrit par son RANG (`primary_ba`), jamais par un bien
// concret (`alabaster_idol`). Ce test existe parce que la conversion inverse a
// déjà été faite une fois, en masse (2 445 lignes), et qu'elle est passée
// inaperçue : rien ne la contredisait.
//
// Pourquoi le rang, et pas le bien :
//
//  - `ResourceDefinitionDTO.order` (1 | 2 | 3) est un rang de TRI DE CATALOGUE.
//    Il ordonne le panneau « Produits » du jeu, il est figé dans le game design,
//    et il est IDENTIQUE sur tous les comptes.
//  - `primary` / `secondary` / `tertiary` est l'ASSIGNATION D'ATELIERS PROPRE À
//    CHAQUE COMPTE. Le jeu l'impose au démarrage de chaque compte et elle diffère
//    d'un joueur à l'autre par design — c'est ce qui rend le trading nécessaire.
//
// Les deux se ressemblent et ne se recoupent que par accident. L'assignation
// n'existe nulle part dans `source/gamedesign.json` (c'est un état de compte, pas
// un fait de catalogue) : d'où le jeton `DYN|<Age>_GoodN` côté game design, et sa
// résolution à l'affichage via le classement du joueur (`local:buildingSelections`).
// Écrire `alabaster_idol` dans un coût revient à imposer à tous les joueurs
// l'assignation du compte qui a servi à l'extraction.
//
// Trois passes : la donnée saisie à la main (au texte, pour couvrir aussi un
// fichier pas encore branché au registre), la donnée générée (par la structure,
// pour ne tester que les vrais coûts — une RÉCOMPENSE, elle, nomme légitimement un
// bien concret), et `ERA_GOODS`, qui n'écrit aucune ligne `resource:` mais
// alimente les coûts des niveaux dynamiques (`generateDynamicLevels`). C'est
// précisément par là que la conversion avait survécu à la première passe de revert.
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { describe, it, expect } from "vitest";
import { TECHNOLOGY_RAW_DATA } from "@/data/technos/generated/technologies.generated";
import { BUILDING_RAW_DATA } from "@/data/buildings/generated/buildings.generated";
import { ERAS, ERA_GOODS } from "@/data/config";
import { goodsUrlByEra } from "@/lib/constants";

const ERA_GOOD = /^(primary|secondary|tertiary)_([a-z]{2})$/;
const ERA_ABBRS: Set<string> = new Set(ERAS.map((era) => era.abbr));

/** Les 39 biens de la capitale — exactement les clés de `goodsUrlByEra`. */
const CAPITAL_GOOD_KEYS: Set<string> = new Set(
  Object.values(goodsUrlByEra).flatMap((era) =>
    Object.values(era).map((meta) => meta.key),
  ),
);

const ROOT = path.resolve(__dirname, "..");

/**
 * `data/allieds/ottoman/trade_posts.ts` : mécanique de comptoir à part, exclue du
 * périmètre. Elle n'écrit de toute façon aucun bien de capitale aujourd'hui —
 * l'exclusion est une décision de périmètre, pas un contournement.
 */
const HAND_DIRS = ["data/technos", "data/capital", "data/allieds"];
const EXCLUDED = new Set([path.join("data", "allieds", "ottoman", "trade_posts.ts")]);

function handWrittenFiles(): string[] {
  const found: string[] = [];
  const walk = (dir: string) => {
    for (const entry of readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
      const rel = path.join(dir, entry.name);
      // La donnée générée a sa propre passe, structurelle, plus bas.
      if (entry.isDirectory()) {
        if (entry.name !== "generated") walk(rel);
      } else if (entry.name.endsWith(".ts") && !entry.name.endsWith(".test.ts")) {
        if (!EXCLUDED.has(rel)) found.push(rel);
      }
    }
  };
  HAND_DIRS.forEach(walk);
  return found;
}

/** Chaque ligne `resource: "x"` d'un fichier de données à la main est un coût. */
function handWrittenResources(): { file: string; line: number; resource: string }[] {
  return handWrittenFiles().flatMap((file) =>
    readFileSync(path.join(ROOT, file), "utf8")
      .split("\n")
      .flatMap((text, index) => {
        const match = /resource: "([a-z0-9_]+)"/.exec(text);
        return match === null
          ? []
          : [{ file, line: index + 1, resource: match[1] }];
      }),
  );
}

/** `(origine, resource)` de tous les coûts de la donnée générée. */
function generatedCostResources(): { origin: string; resource: string }[] {
  const found: { origin: string; resource: string }[] = [];
  for (const entry of TECHNOLOGY_RAW_DATA) {
    for (const good of entry.costs.goods ?? []) {
      found.push({ origin: `technologie ${entry.id}`, resource: good.resource });
    }
  }
  for (const entry of BUILDING_RAW_DATA) {
    for (const level of entry.levels) {
      for (const costs of [level.construction, level.upgrade]) {
        for (const good of costs?.goods ?? []) {
          found.push({
            origin: `bâtiment ${entry.key} niveau ${level.level}`,
            resource: good.resource,
          });
        }
      }
    }
  }
  return found;
}

describe("encodage des biens de capitale dans les coûts", () => {
  // Le fichier de données existe-t-il seulement ? Un `readdirSync` sur un chemin
  // renommé rendrait un test vert qui ne teste rien.
  it("les trois dossiers de données à la main sont bien lus", () => {
    const files = handWrittenFiles();
    expect(files.length).toBeGreaterThan(50);
    for (const dir of HAND_DIRS) {
      expect(
        files.some((f) => f.startsWith(dir + path.sep)),
        `aucun fichier lu sous ${dir}`,
      ).toBe(true);
    }
    expect(files).not.toContain(path.join("data", "allieds", "ottoman", "trade_posts.ts"));
  });

  it("aucun coût saisi à la main ne nomme un bien de capitale", () => {
    const frozen = handWrittenResources()
      .filter(({ resource }) => CAPITAL_GOOD_KEYS.has(resource))
      .map(({ file, line, resource }) => `${file}:${line} — ${resource}`);
    expect(
      frozen,
      "un coût de capitale doit s'écrire `primary_xx` / `secondary_xx` / `tertiary_xx` " +
        "— le bien concret dépend de l'assignation d'ateliers du compte, pas du game design",
    ).toEqual([]);
  });

  it("aucun coût généré ne nomme un bien de capitale", () => {
    const frozen = generatedCostResources()
      .filter(({ resource }) => CAPITAL_GOOD_KEYS.has(resource))
      .map(({ origin, resource }) => `${origin} — ${resource}`);
    expect(
      frozen,
      "la projection `DYN|<Age>_GoodN` de scripts/extract/** doit rendre un rang, " +
        "pas un bien : voir `GOOD_RANK` et son commentaire",
    ).toEqual([]);
  });

  // `ERA_GOODS` n'écrit aucune ligne `resource:` : il est lu par `getGoods` dans
  // data/generateDynamicLevels.ts pour fabriquer les coûts des niveaux ≥ 40 de
  // small_home, average_home, rural_farm, domestic_farm, luxurious_* et des
  // cultural_sites. Une conversion en biens concrets y passe donc inaperçue au
  // grep, mais ressort dans `pnpm diff:buildings`.
  it("ERA_GOODS ne liste que des rangs, jamais des biens de capitale", () => {
    const frozen = Object.entries(ERA_GOODS).flatMap(([era, goods]) =>
      (goods ?? [])
        .filter((good) => !ERA_GOOD.test(good))
        .map((good) => `ERA_GOODS.${era} — ${good}`),
    );
    expect(
      frozen,
      "les niveaux dynamiques (generateDynamicLevels) produisent des COÛTS : " +
        "ils doivent porter le rang, pas le bien",
    ).toEqual([]);
  });

  // Chaque ère y porte son propre rang : `ERA_GOODS.BA` doit tenir `primary_ba`,
  // pas `primary_re`. Une permutation ici décalerait silencieusement des coûts
  // d'une ère à l'autre.
  it("chaque entrée de ERA_GOODS porte les 3 rangs de SON ère, dans l'ordre", () => {
    for (const [era, goods] of Object.entries(ERA_GOODS)) {
      expect(goods, `ERA_GOODS.${era}`).toEqual([
        `primary_${era.toLowerCase()}`,
        `secondary_${era.toLowerCase()}`,
        `tertiary_${era.toLowerCase()}`,
      ]);
    }
  });

  // Un rang mal formé (`primary_xxx`, ère inconnue) est ignoré en silence par le
  // Calculator : il ne correspond à aucun seau.
  it("tout rang écrit désigne une ère connue", () => {
    const malformed = [
      ...handWrittenResources().map(({ file, line, resource }) => ({
        origin: `${file}:${line}`,
        resource,
      })),
      ...generatedCostResources().map(({ origin, resource }) => ({ origin, resource })),
    ]
      .filter(({ resource }) => /^(primary|secondary|tertiary)_/.test(resource))
      .filter(({ resource }) => {
        const match = ERA_GOOD.exec(resource);
        return match === null || !ERA_ABBRS.has(match[2].toUpperCase());
      })
      .map(({ origin, resource }) => `${origin} — ${resource}`);
    expect(malformed).toEqual([]);
  });

  // Sans ça, les deux tests ci-dessus passeraient sur un corpus vide.
  it("les coûts en rang sont bien présents des deux côtés", () => {
    const handRanks = handWrittenResources().filter(({ resource }) =>
      ERA_GOOD.test(resource),
    );
    const generatedRanks = generatedCostResources().filter(({ resource }) =>
      ERA_GOOD.test(resource),
    );
    expect(handRanks.length).toBeGreaterThan(2000);
    expect(generatedRanks.length).toBeGreaterThan(2000);
  });
});
