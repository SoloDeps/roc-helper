"use client";

import { X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResourceBadge } from "@/components/items/resource-badge";
import { formatNumber, getItemIconLocal, formatDuration } from "@/lib/utils";
import type { CampaignRegion } from "@/types/campaign-types";

function getPartTypeLabel(type: string): string {
  if (type === "combat_waves") return "Combat Waves";
  if (type === "negotiation") return "Negotiation";
  return type.replace(/_/g, " ");
}

function RegionRewardList({
  rewards,
}: {
  rewards: CampaignRegion["regionRewards"];
}) {
  const commanders = rewards.filter((r) => r.resource.startsWith("commander_"));
  const others = rewards.filter((r) => !r.resource.startsWith("commander_"));

  return (
    <div className="space-y-1.5">
      {others.length > 0 && (
        <div className="grid grid-cols-2 gap-1.5">
          {others.map((reward, i) => (
            <ResourceBadge
              key={i}
              icon={getItemIconLocal(reward.resource)}
              value={formatNumber(reward.amount)}
              alt={reward.resource}
            />
          ))}
        </div>
      )}
      {commanders.length > 0 && (
        <ul className="space-y-1.5">
          {commanders.map((reward, i) => (
            <li
              key={i}
              className="flex items-center px-3 rounded-md bg-background-100 border border-alpha-200 h-9 shrink-0 text-sm font-medium"
            >
              {reward.name ?? reward.resource}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

interface CampaignDetailsPanelProps {
  region: CampaignRegion | null;
  eraId: string;
  onClose: () => void;
}

export function CampaignDetailsPanel({
  region,
  eraId: _eraId,
  onClose,
}: CampaignDetailsPanelProps) {
  if (!region) return null;

  return (
    <div className="bg-background-300 border border-border rounded-lg shadow-lg flex flex-col overflow-hidden max-h-[560px]">
      {/* Header */}
      <div className="border-b border-border bg-background-100 shrink-0">
        <div className="flex items-center justify-between h-12 px-4">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <h2 className="text-sm font-semibold truncate">{region.name}</h2>
            {region.boss && (
              <span className="shrink-0 text-xs font-bold uppercase px-1.5 py-0.5 rounded bg-red-500/20 text-red-500 dark:bg-red-900/40 dark:text-red-400 border border-red-500/30 leading-none">
                Boss
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="shrink-0 h-8 w-8"
          >
            <X className="size-4" />
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-y-auto p-3 space-y-4 min-h-[190px]">
        {/* Scout */}
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
            Scout
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            <ResourceBadge
              icon={getItemIconLocal("coins")}
              value={formatNumber(region.scout.coins)}
              alt="Scout coins"
            />
            <div className="flex items-center justify-between px-2 rounded-md bg-background-100 border border-alpha-200 h-9 shrink-0">
              <Clock className="size-[22px] text-muted-foreground" />
              <span className="text-sm font-medium">
                {formatDuration(region.scout.duration)}
              </span>
            </div>
          </div>
        </div>

        {/* Region reward */}
        {region.regionRewards.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
              Region Reward
            </p>
            <RegionRewardList rewards={region.regionRewards} />
          </div>
        )}

        {/* Parts */}
        {region.parts.length > 0 && (
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
              Parts ({region.parts.length})
            </p>
            <div className="space-y-2">
              {region.parts.map((part, i) => (
                <div
                  key={i}
                  className="border border-border rounded-md p-2.5 flex items-center gap-3"
                >
                  <ul className="flex-1 space-y-0.5">
                    {part.type.map((t, j) => (
                      <li
                        key={j}
                        className="flex items-center gap-1.5 text-[13px] font-medium capitalize"
                      >
                        <span className="size-1.5 rounded-full bg-muted-foreground/50 shrink-0" />
                        {getPartTypeLabel(t)}
                      </li>
                    ))}
                  </ul>
                  {part.rewards.length > 0 && (
                    <div className="flex flex-col flex-1 gap-1 shrink-0">
                      {part.rewards.map((reward, j) => (
                        <ResourceBadge
                          key={j}
                          icon={getItemIconLocal(reward.resource)}
                          value={formatNumber(reward.amount)}
                          alt={reward.resource}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Column position */}
        <div className="pt-2 border-t border-border mt-auto">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Column Position</span>
            <span className="font-medium">{region.column + 1}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
