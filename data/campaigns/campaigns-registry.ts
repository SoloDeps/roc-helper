// data/campaigns/campaigns-registry.ts
// Mirrors getTechnologiesByEra() from technos-registry.ts

import { CampaignRegion } from "@/types/campaign-types";
import { campaign_SA } from "./01_stone_age";
import { campaign_BA } from "./02_bronze_age";
import { campaign_ME } from "./03_minoan_era";
import { campaign_CG } from "./04_classic_greece";
import { campaign_ER } from "./05_early_rome";
import { campaign_RE } from "./06_roman_empire";
import { campaign_BE } from "./07_byzantine_era";
import { campaign_AF } from "./08_age_of_the_franks";
import { campaign_FA } from "./09_feudal_age";
import { campaign_IE } from "./10_iberian_era";
import { campaign_KS } from "./11_kingdom_of_sicily";
import { campaign_HM } from "./12_high_middle_ages";
import { campaign_EG } from "./13_early_gothic_era";
import { campaign_LG } from "./14_late_gothic_era";

const CAMPAIGN_REGISTRY: Record<string, CampaignRegion[]> = {
  stone_age:           campaign_SA as CampaignRegion[],
  bronze_age:          campaign_BA as CampaignRegion[],
  minoan_era:          campaign_ME as CampaignRegion[],
  classical_greece:      campaign_CG as CampaignRegion[],
  early_rome:          campaign_ER as CampaignRegion[],
  roman_empire:        campaign_RE as CampaignRegion[],
  byzantine_era:       campaign_BE as CampaignRegion[],
  age_of_the_franks:   campaign_AF as CampaignRegion[],
  feudal_age:          campaign_FA as CampaignRegion[],
  iberian_era:         campaign_IE as CampaignRegion[],
  kingdom_of_sicily:   campaign_KS as CampaignRegion[],
  high_middle_ages:    campaign_HM as CampaignRegion[],
  early_gothic_era:    campaign_EG as CampaignRegion[],
  late_gothic_era:     campaign_LG as CampaignRegion[],
};

export function getCampaignsByEra(eraId: string): CampaignRegion[] {
  return CAMPAIGN_REGISTRY[eraId] ?? [];
}

/** All era IDs that have campaign data */
export const CAMPAIGN_ERA_IDS = Object.keys(CAMPAIGN_REGISTRY);
