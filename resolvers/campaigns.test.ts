import { describe, it, expect } from "vitest";
import {
  getCampaignsByEra as getFromExtract,
  groupCampaignsByEra,
  CAMPAIGN_ERA_IDS as ERA_IDS_EXTRACT,
} from "./campaigns";
import { CAMPAIGN_RAW_DATA } from "@/data/campaigns/generated/campaign.generated";
import { campaign_SA } from "@/data/campaigns/01_stone_age";
import { campaign_BA } from "@/data/campaigns/02_bronze_age";
import { campaign_ME } from "@/data/campaigns/03_minoan_era";
import { campaign_CG } from "@/data/campaigns/04_classic_greece";
import { campaign_ER } from "@/data/campaigns/05_early_rome";
import { campaign_RE } from "@/data/campaigns/06_roman_empire";
import { campaign_BE } from "@/data/campaigns/07_byzantine_era";
import { campaign_AF } from "@/data/campaigns/08_age_of_the_franks";
import { campaign_FA } from "@/data/campaigns/09_feudal_age";
import { campaign_IE } from "@/data/campaigns/10_iberian_era";
import { campaign_KS } from "@/data/campaigns/11_kingdom_of_sicily";
import { campaign_HM } from "@/data/campaigns/12_high_middle_ages";
import { campaign_EG } from "@/data/campaigns/13_early_gothic_era";
import { campaign_LG } from "@/data/campaigns/14_late_gothic_era";
import type { CampaignRegion } from "@/types/campaign-types";

/**
 * La saisie à la main, lue depuis les 14 fichiers d'ère plutôt que depuis
 * `campaigns-registry` : le registre bascule sur l'extraction à l'étape
 * suivante, et la comparaison deviendrait tautologique.
 */
const SAISIE_A_LA_MAIN: Record<string, CampaignRegion[]> = {
  stone_age: campaign_SA as CampaignRegion[],
  bronze_age: campaign_BA as CampaignRegion[],
  minoan_era: campaign_ME as CampaignRegion[],
  classical_greece: campaign_CG as CampaignRegion[],
  early_rome: campaign_ER as CampaignRegion[],
  roman_empire: campaign_RE as CampaignRegion[],
  byzantine_era: campaign_BE as CampaignRegion[],
  age_of_the_franks: campaign_AF as CampaignRegion[],
  feudal_age: campaign_FA as CampaignRegion[],
  iberian_era: campaign_IE as CampaignRegion[],
  kingdom_of_sicily: campaign_KS as CampaignRegion[],
  high_middle_ages: campaign_HM as CampaignRegion[],
  early_gothic_era: campaign_EG as CampaignRegion[],
  late_gothic_era: campaign_LG as CampaignRegion[],
};

const ERA_IDS_HAND = Object.keys(SAISIE_A_LA_MAIN);
const getFromHand = (eraId: string): CampaignRegion[] =>
  SAISIE_A_LA_MAIN[eraId] ?? [];

/**
 * Deux régions portent une faute de frappe dans le jeu, que la saisie à la main
 * avait corrigée. Le jeu fait foi : c'est son texte qui doit s'afficher.
 */
const LIBELLES_CORRIGES_A_LA_MAIN: Record<string, string> = {
  me_3: "Cavernous Outcrop",
  hm_24: "Singing Mountains",
};

const CHAMPS = [
  "id",
  "name",
  "column",
  "boss",
  "required",
  "scout",
  "regionRewards",
  "parts",
] as const;

function extraire(region: CampaignRegion) {
  return Object.fromEntries(CHAMPS.map((c) => [c, region[c]]));
}

describe("corpus", () => {
  it("les deux sources couvrent les mêmes ères et les mêmes régions", () => {
    expect(ERA_IDS_EXTRACT).toEqual(ERA_IDS_HAND);

    const total = ERA_IDS_HAND.reduce(
      (n, eraId) => n + getFromHand(eraId).length,
      0,
    );
    expect(total).toBe(272);
    expect(CAMPAIGN_RAW_DATA.length).toBe(272);
  });

  it("chaque ère a le même nombre de régions, dans le même ordre", () => {
    for (const eraId of ERA_IDS_HAND) {
      expect({
        eraId,
        ids: getFromExtract(eraId).map((r) => r.id),
      }).toEqual({
        eraId,
        ids: getFromHand(eraId).map((r) => r.id),
      });
    }
  });
});

describe("getCampaignsByEra — extraction ≡ saisie à la main, champ par champ", () => {
  it("les 272 régions sont identiques sur les 8 champs, hors libellés corrigés", () => {
    const divergences: string[] = [];

    for (const eraId of ERA_IDS_HAND) {
      const main = getFromHand(eraId);
      const extrait = getFromExtract(eraId);

      for (let i = 0; i < main.length; i++) {
        const attendu = extraire(main[i]);
        const obtenu = extraire(extrait[i]);

        // Le jeu fait foi sur le libellé : on aligne l'attendu sur son texte.
        if (main[i].id in LIBELLES_CORRIGES_A_LA_MAIN) {
          attendu.name = extrait[i].name;
        }

        if (JSON.stringify(attendu) !== JSON.stringify(obtenu)) {
          divergences.push(`${main[i].id} — attendu ${JSON.stringify(attendu)} / obtenu ${JSON.stringify(obtenu)}`);
        }
      }
    }

    expect(divergences).toEqual([]);
  });

  for (const champ of CHAMPS) {
    it(`≡ sur \`${champ}\` pour les 272 régions`, () => {
      const divergences: string[] = [];

      for (const eraId of ERA_IDS_HAND) {
        const main = getFromHand(eraId);
        const extrait = getFromExtract(eraId);

        for (let i = 0; i < main.length; i++) {
          if (champ === "name" && main[i].id in LIBELLES_CORRIGES_A_LA_MAIN) continue;
          if (JSON.stringify(main[i][champ]) !== JSON.stringify(extrait[i][champ])) {
            divergences.push(
              `${main[i].id}: ${JSON.stringify(main[i][champ])} ≠ ${JSON.stringify(extrait[i][champ])}`,
            );
          }
        }
      }

      expect(divergences).toEqual([]);
    });
  }
});

describe("les libellés du jeu remplacent les corrections manuelles", () => {
  it("les 2 régions concernées portent bien le texte du jeu", () => {
    const parId = new Map(
      ERA_IDS_EXTRACT.flatMap((eraId) =>
        getFromExtract(eraId).map((r) => [r.id, r] as const),
      ),
    );

    expect(parId.get("me_3")!.name).toBe("Cavernous Outcop");
    expect(parId.get("hm_24")!.name).toBe("Singing Mointains");
  });

  it("aucune autre région ne change de libellé", () => {
    const changes: string[] = [];
    for (const eraId of ERA_IDS_HAND) {
      const main = getFromHand(eraId);
      const extrait = getFromExtract(eraId);
      for (let i = 0; i < main.length; i++) {
        if (main[i].name !== extrait[i].name) changes.push(main[i].id);
      }
    }
    expect(changes.sort()).toEqual(Object.keys(LIBELLES_CORRIGES_A_LA_MAIN).sort());
  });
});

describe("prérequis inter-âge — comportement actuel conservé", () => {
  it("aucun `required` ne pointe hors de son ère, des deux côtés", () => {
    const hors: string[] = [];

    for (const eraId of ERA_IDS_HAND) {
      for (const source of [getFromHand(eraId), getFromExtract(eraId)]) {
        for (const region of source) {
          const abbr = region.id.split("_")[0];
          for (const requis of region.required) {
            if (requis.split("_")[0] !== abbr) hors.push(`${region.id} → ${requis}`);
          }
        }
      }
    }

    expect(hors).toEqual([]);
  });

  it("chaque `required` désigne une région existante de la même ère", () => {
    const orphelins: string[] = [];

    for (const eraId of ERA_IDS_EXTRACT) {
      const regions = getFromExtract(eraId);
      const ids = new Set(regions.map((r) => r.id));
      for (const region of regions) {
        for (const requis of region.required) {
          if (!ids.has(requis)) orphelins.push(`${region.id} → ${requis}`);
        }
      }
    }

    expect(orphelins).toEqual([]);
  });
});

describe("groupCampaignsByEra", () => {
  it("répartit sans perte et conserve l'ordre d'entrée", () => {
    const groupes = groupCampaignsByEra(CAMPAIGN_RAW_DATA);
    const total = Object.values(groupes).reduce((n, g) => n + g.length, 0);
    expect(total).toBe(CAMPAIGN_RAW_DATA.length);
    expect(Object.keys(groupes)).toEqual(ERA_IDS_HAND);

    const aplati = ERA_IDS_HAND.flatMap((eraId) => groupes[eraId].map((r) => r.id));
    expect(aplati).toEqual(CAMPAIGN_RAW_DATA.map((r) => r.id));
  });

  it("ignore une région dont le préfixe ne désigne aucune ère", () => {
    const groupes = groupCampaignsByEra([
      { id: "zz_1", name: "x", column: 0, required: [], scout: { coins: 0, duration: 0 }, regionRewards: [], parts: [] },
    ]);
    expect(groupes).toEqual({});
  });

  it("rend un tableau vide pour une ère inconnue", () => {
    expect(getFromExtract("pas_une_ere")).toEqual([]);
  });
});
