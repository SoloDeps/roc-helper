// Garde-fou de l'extraction du domaine Campaign
// (data/campaigns/generated/campaign.generated.ts). Vérifie ce que consomme
// réellement la page Campaign : convention d'ID, colonnes, résolution du graphe
// de prérequis, vocabulaire de ressources, formes de récompense et de partie.
//
// ⚠️ Ce test porte sur la donnée GÉNÉRÉE. La donnée saisie à la main
// (data/campaigns/*.ts) reste en place et branchée : la comparaison entre les
// deux est le travail de `pnpm diff:campaign`, pas d'une assertion.
import fs from "node:fs";
import path from "node:path";

import { describe, it, expect } from "vitest";
import {
  CAMPAIGN_EXTRACT,
  CAMPAIGN_RAW_DATA,
} from "@/data/campaigns/generated/campaign.generated";
import { ERA_ID_TO_ABBR, ABBR_TO_ERA_ID } from "@/lib/era-mappings";
import { BONUS_LABELS } from "@/resolvers/bonus";
import { getItemIconLocal } from "@/lib/utils";

const PROJECT_ID = /^([a-z]{2})_(\d+)$/;
const PART_TYPES = new Set(["combat", "combat_waves", "negotiation"]);

describe("campaign — extraction", () => {
  it("272 régions sur 14 âges, un âge = une ère du projet", () => {
    expect(CAMPAIGN_EXTRACT.regions.length).toBe(272);
    expect(CAMPAIGN_RAW_DATA.length).toBe(272);
    expect(CAMPAIGN_EXTRACT.ages.length).toBe(14);
    for (const age of CAMPAIGN_EXTRACT.ages) {
      expect(ERA_ID_TO_ABBR[age.eraId], `ère ${age.eraId}`).toBe(age.eraAbbr);
    }
  });

  // docs/data-contracts.md §3.1 : même convention d'ID que TechnoData, mais
  // indexée à partir de 1 côté campagne (`sa_1`, pas `sa_0`).
  it("l'ID projet est `{abbr}_{index}`, séquentiel depuis 1 et sans trou", () => {
    const byAbbr = new Map<string, number[]>();
    for (const entry of CAMPAIGN_RAW_DATA) {
      const m = PROJECT_ID.exec(entry.id);
      expect(m, `id ${entry.id}`).not.toBeNull();
      const abbr = m![1];
      expect(ABBR_TO_ERA_ID[abbr], `abbr ${abbr}`).toBeDefined();
      byAbbr.set(abbr, [...(byAbbr.get(abbr) ?? []), Number(m![2])]);
    }
    expect(byAbbr.size).toBe(14);
    for (const [abbr, indexes] of byAbbr) {
      expect(
        [...indexes].sort((a, b) => a - b),
        `ère ${abbr}`,
      ).toEqual(indexes.map((_, i) => i + 1));
    }
  });

  it("colonnes 0-based, contiguës depuis 0 dans chaque ère", () => {
    const byAbbr = new Map<string, Set<number>>();
    for (const entry of CAMPAIGN_RAW_DATA) {
      const abbr = PROJECT_ID.exec(entry.id)![1];
      expect(Number.isInteger(entry.column), `colonne ${entry.id}`).toBe(true);
      expect(entry.column, `colonne ${entry.id}`).toBeGreaterThanOrEqual(0);
      byAbbr.set(abbr, (byAbbr.get(abbr) ?? new Set()).add(entry.column));
    }
    for (const [abbr, columns] of byAbbr) {
      const sorted = [...columns].sort((a, b) => a - b);
      expect(sorted[0], `ère ${abbr}`).toBe(0);
      expect(sorted, `ère ${abbr}`).toEqual(sorted.map((_, i) => i));
    }
  });

  it("chaque prérequis de la projection UI existe dans la même ère", () => {
    const byId = new Map(CAMPAIGN_RAW_DATA.map((e) => [e.id, e]));
    for (const entry of CAMPAIGN_RAW_DATA) {
      const abbr = PROJECT_ID.exec(entry.id)![1];
      for (const required of entry.required) {
        expect(byId.has(required), `${entry.id} → ${required}`).toBe(true);
        expect(PROJECT_ID.exec(required)![1], `${entry.id} → ${required}`).toBe(abbr);
      }
    }
  });

  // 13 arêtes, une par transition d'ère : la 1ʳᵉ région d'un âge exige la
  // dernière du précédent. L'app ne les affiche pas, elle ne les perd pas.
  it("les arêtes inter-âges sont isolées, pas supprimées", () => {
    const rawById = new Map(CAMPAIGN_RAW_DATA.map((e) => [e.id, e]));
    let crossAge = 0;
    for (const region of CAMPAIGN_EXTRACT.regions) {
      const raw = rawById.get(region.code)!;
      crossAge += region.crossAgeRequiresCodes.length;
      expect(
        [...raw.required, ...region.crossAgeRequiresCodes].sort(),
        `prérequis de ${region.code}`,
      ).toEqual([...region.requiresCodes].sort());
      for (const code of region.crossAgeRequiresCodes) {
        expect(raw.required, `${region.code} → ${code}`).not.toContain(code);
      }
    }
    expect(crossAge).toBe(13);
  });

  it("le graphe d'une ère est acyclique et n'a qu'une racine", () => {
    const byAbbr = new Map<string, typeof CAMPAIGN_RAW_DATA>();
    for (const entry of CAMPAIGN_RAW_DATA) {
      const abbr = PROJECT_ID.exec(entry.id)![1];
      byAbbr.set(abbr, [...(byAbbr.get(abbr) ?? []), entry]);
    }
    for (const [abbr, entries] of byAbbr) {
      expect(entries.filter((e) => e.required.length === 0).length, `racines de ${abbr}`).toBe(1);
      const required = new Map(entries.map((e) => [e.id, e.required]));
      const state = new Map<string, 0 | 1 | 2>();
      const walk = (id: string): void => {
        if (state.get(id) === 2) return;
        expect(state.get(id), `cycle autour de ${id}`).not.toBe(1);
        state.set(id, 1);
        for (const parent of required.get(id) ?? []) walk(parent);
        state.set(id, 2);
      };
      for (const entry of entries) walk(entry.id);
    }
  });

  // Seule la région initiale est gratuite ; toute autre a un éclaireur payant.
  it("l'éclaireur est un entier positif, gratuit sur la seule région initiale", () => {
    const free = CAMPAIGN_RAW_DATA.filter((e) => e.scout.coins === 0 && e.scout.duration === 0);
    expect(free.map((e) => e.id)).toEqual(["sa_1"]);
    for (const entry of CAMPAIGN_RAW_DATA) {
      expect(Number.isInteger(entry.scout.coins), `coins ${entry.id}`).toBe(true);
      expect(Number.isInteger(entry.scout.duration), `duration ${entry.id}`).toBe(true);
      expect(entry.scout.coins, `coins ${entry.id}`).toBeGreaterThanOrEqual(0);
      expect(entry.scout.duration, `duration ${entry.id}`).toBeGreaterThanOrEqual(0);
    }
    expect(CAMPAIGN_EXTRACT.regions.filter((r) => r.isInitial).map((r) => r.code)).toEqual(["sa_1"]);
    expect(CAMPAIGN_EXTRACT.regions.filter((r) => r.scout === null).map((r) => r.code)).toEqual([
      "sa_1",
    ]);
  });

  // docs/data-contracts.md §3.1 contrainte 1 : `type` est un `string[]` libre,
  // mais seules trois valeurs sont rendues autrement que par un `replace`.
  it("chaque partie déclare au moins un mode connu, sans doublon", () => {
    let parts = 0;
    for (const entry of CAMPAIGN_RAW_DATA) {
      expect(entry.parts.length, `parties de ${entry.id}`).toBeGreaterThan(0);
      for (const part of entry.parts) {
        parts += 1;
        expect(part.type.length, `modes de ${entry.id}`).toBeGreaterThan(0);
        expect(new Set(part.type).size, `modes de ${entry.id}`).toBe(part.type.length);
        for (const type of part.type) expect(PART_TYPES.has(type), `mode ${type}`).toBe(true);
      }
    }
    expect(parts).toBe(1046);
  });

  // docs/data-contracts.md §3.1 contrainte 3 : `name` n'est lu que pour les
  // `commander_*`. Le porter ailleurs serait du bruit ; l'omettre là serait un
  // libellé manquant à l'écran.
  it("`name` est porté par les `commander_*` et par eux seuls", () => {
    const rewards = CAMPAIGN_RAW_DATA.flatMap((e) => [
      ...e.regionRewards,
      ...e.parts.flatMap((p) => p.rewards),
    ]);
    const commanders = rewards.filter((r) => r.resource.startsWith("commander_"));
    expect(commanders.length).toBe(6);
    for (const reward of rewards) {
      expect(
        reward.name !== undefined,
        `name sur ${reward.resource}`,
      ).toBe(reward.resource.startsWith("commander_"));
      expect(Number.isInteger(reward.amount), `amount ${reward.resource}`).toBe(true);
      expect(reward.amount, `amount ${reward.resource}`).toBeGreaterThan(0);
    }
  });

  // Une clé sans fichier est une icône cassée à l'écran, pas une erreur de type.
  //
  // ⚠️ C'est `getItemIconLocal` qui décide du CHEMIN, pas ce test : la plupart
  // des clés résolvent bien en `/images/goods/{clé}.webp`, mais celles qui ne
  // désignent pas un bien vivent dans leur dossier (`chest_puzzlepieces` est un
  // coffre, rangé avec les autres sous `/images/chests/`). Vérifier le dossier
  // `goods` en dur reviendrait à figer une convention que la fonction n'a plus.
  it("chaque clé de ressource résout vers un fichier qui existe", () => {
    const resources = new Set(
      CAMPAIGN_RAW_DATA.flatMap((e) => [
        ...e.regionRewards,
        ...e.parts.flatMap((p) => p.rewards),
      ]).map((r) => r.resource),
    );
    for (const resource of resources) {
      // Les commandants sont rendus par leur `name`, pas par une icône.
      if (resource.startsWith("commander_")) continue;
      const file = path.join(process.cwd(), "public", getItemIconLocal(resource));
      expect(fs.existsSync(file), `icône de ${resource} (${getItemIconLocal(resource)})`).toBe(true);
    }
  });

  // Le domaine ne porte aucun modificateur permanent : voir l'en-tête de
  // data/campaigns/generated/types.ts. Ce test fige cette lecture — si un
  // `@type` de récompense apparaît qui EST un bonus, il faudra le projeter dans
  // le vocabulaire de resolvers/bonus.ts, pas inventer une clé à côté.
  it("aucune récompense ne relève du vocabulaire de bonus", () => {
    const types = new Set<string>();
    for (const region of CAMPAIGN_EXTRACT.regions) {
      for (const reward of [...region.regionRewards, ...region.parts.flatMap((p) => p.rewards)]) {
        types.add(reward.type);
        expect(reward.projection, `récompense ${reward.type} non projetée`).not.toBeNull();
      }
    }
    expect([...types].sort()).toEqual([
      "CommanderRewardDTO",
      "IncreaseExpansionRightRewardDTO",
      "IncreaseTradingCultureExpansionsRewardDTO",
      "ResourceRewardDTO",
      "RewardDefinitionDTO",
    ]);
    const resources = new Set(
      CAMPAIGN_RAW_DATA.flatMap((e) => [
        ...e.regionRewards,
        ...e.parts.flatMap((p) => p.rewards),
      ]).map((r) => r.resource),
    );
    for (const resource of resources) {
      expect(BONUS_LABELS[resource], `${resource} n'est pas un bonus`).toBeUndefined();
    }
  });

  it("l'extraction ne laisse aucun point indéterminé", () => {
    const warned = CAMPAIGN_EXTRACT.regions.filter((r) => r.warnings.length > 0);
    expect(warned.map((r) => `${r.code}: ${r.warnings.join(" | ")}`)).toEqual([]);
  });
});
