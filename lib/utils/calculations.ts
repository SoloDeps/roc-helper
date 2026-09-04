"use client";

import {
  HydratedBuilding,
  HydratedOttomanArea,
  HydratedOttomanTradePost,
  HydratedTechno,
} from "@/lib/db/data-hydration";
import type { CampaignEntity } from "@/lib/db/schema";
import { ERAS } from "@/lib/catalog";
import { getCampaignsByEra } from "@/data/campaigns/campaigns-registry";
import { sumCosts, type CostEntry } from "@/resolvers/costs";

/**
 * Le total du Calculator.
 *
 * L'agrégation elle-même vit dans `resolvers/costs.ts` (`sumCosts`). Ce module
 * ne fait plus que deux choses : décider **ce qui compte** (les règles de
 * masquage et de complétion, propres au Calculator) et le lui passer.
 *
 * `accumulateCosts` a été retiré : c'était l'une des cinq copies de
 * l'algorithme d'agrégation (§6.4 du doc `data-contracts.md`), et la seule à
 * valider ses entrées. C'est ce comportement-là qui a été retenu pour tous.
 */
export interface ResourceTotals {
  main: Record<string, number>;
  goods: Map<string, number>;
}

export function calculateTotalCosts(
  buildings: HydratedBuilding[],
  technos: HydratedTechno[],
  areas: HydratedOttomanArea[],
  tradePosts: HydratedOttomanTradePost[],
  campaignEntities?: CampaignEntity[],
): ResourceTotals {
  const entries: CostEntry[] = [];

  // Buildings — la quantité multiplie ressources ET biens
  for (const building of buildings) {
    if (building.hidden) continue;
    entries.push({ costs: building.costs, multiplier: building.quantity });
  }

  // Technos — exclure si hidden (masquée calculator) OU cp=true (déjà complétée)
  for (const techno of technos) {
    if (techno.hidden || techno.cp) continue;
    entries.push({ costs: techno.costs });
  }

  // Areas
  for (const area of areas) {
    if (area.hidden) continue;
    entries.push({ costs: area.costs });
  }

  // Trade Posts
  for (const tp of tradePosts) {
    if (tp.hidden) continue;
    entries.push({ costs: tp.costs });
  }

  // Campaigns — le coût d'exploration des régions ni complétées ni masquées.
  // Seule source dont le coût n'est pas un objet `Costs` : il est reconstruit
  // ici pour passer par le même chemin d'agrégation que les autres.
  for (const coins of scoutCoins(campaignEntities)) {
    entries.push({ costs: { coins } });
  }

  return sumCosts(entries);
}

/**
 * Les coûts d'exploration à compter, dans l'ordre des ères puis des régions.
 *
 * Une région ne compte que si elle est présente en base (l'utilisateur l'a
 * ajoutée), non complétée et non masquée.
 */
function scoutCoins(campaignEntities?: CampaignEntity[]): number[] {
  if (!campaignEntities || campaignEntities.length === 0) return [];

  const completedIds = new Set(
    campaignEntities.filter((r) => !!r.cp).map((r) => r.id),
  );
  const hiddenIds = new Set(
    campaignEntities.filter((r) => !!r.hidden).map((r) => r.id),
  );
  const addedIds = new Set(campaignEntities.map((r) => r.id));

  // Ères concernées, déduites du préfixe des IDs (ex: "re_3" → Roman Empire)
  const eraIds = new Set<string>();
  for (const c of campaignEntities) {
    const abbr = c.id.match(/^([a-z]+)_/)?.[1];
    if (!abbr) continue;
    const era = ERAS.find((e) => e.abbr.toLowerCase() === abbr);
    if (era) eraIds.add(era.id);
  }

  const coins: number[] = [];
  for (const eraId of eraIds) {
    for (const region of getCampaignsByEra(eraId)) {
      if (completedIds.has(region.id)) continue;
      if (hiddenIds.has(region.id)) continue;
      if (!addedIds.has(region.id)) continue;
      coins.push(region.scout.coins);
    }
  }

  return coins;
}
