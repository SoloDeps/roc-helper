import { CAMPAIGN_RAW_DATA } from "@/data/campaigns/generated/campaign.generated";
import { ABBR_TO_ERA_ID } from "@/lib/era-mappings";
import type { CampaignRegion } from "@/types/campaign-types";

/**
 * Regroupe la liste plate des régions extraites par ère, en déduisant l'ère du
 * préfixe de l'identifiant (`me_3` → `minoan_era`). L'ordre d'apparition est
 * conservé : c'est celui dans lequel la page affiche les régions.
 */
export function groupCampaignsByEra(
  regions: CampaignRegion[],
): Record<string, CampaignRegion[]> {
  const byEra: Record<string, CampaignRegion[]> = {};

  for (const region of regions) {
    const eraId = ABBR_TO_ERA_ID[region.id.split("_")[0]];
    if (!eraId) continue;
    (byEra[eraId] ??= []).push(region);
  }

  return byEra;
}

const CAMPAIGN_REGISTRY = groupCampaignsByEra(CAMPAIGN_RAW_DATA);

export function getCampaignsByEra(eraId: string): CampaignRegion[] {
  return CAMPAIGN_REGISTRY[eraId] ?? [];
}

export const CAMPAIGN_ERA_IDS = Object.keys(CAMPAIGN_REGISTRY);
