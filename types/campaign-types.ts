// types/campaign-types.ts

export interface CampaignReward {
  resource: string;
  amount: number;
  name?: string;
}

export interface CampaignPart {
  type: string[]; // ["combat"] | ["combat_waves"] | ["negotiation"] | etc.
  rewards: CampaignReward[];
}

export interface CampaignRegion {
  id: string;
  name: string;
  column: number;
  boss?: boolean;
  required: string[];
  scout: {
    coins: number;
    duration: number; // seconds
  };
  regionRewards: CampaignReward[];
  parts: CampaignPart[];
}

// DB entity stored in Dexie
export interface CampaignRegionEntity {
  id: string;    // e.g. "sa_2"
  hidden: number; // 0 | 1 — exclude from total
  cp: number;     // 0 | 1 — completed
}

// Hydrated with static data + DB state
export interface HydratedCampaignRegion extends CampaignRegion {
  era: string;      // e.g. "stone_age"
  hidden: boolean;
  cp: boolean;
}
