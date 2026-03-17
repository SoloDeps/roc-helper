"use client";

import React from "react";
import { X, ArrowRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResourceBadge } from "@/components/items/resource-badge";
import { formatNumber, getItemIconLocal, formatDuration } from "@/lib/utils";
import type { CampaignRegion } from "@/types/campaign-types";

interface CampaignPathPanelProps {
  fromRegion: CampaignRegion | null;
  toRegion: CampaignRegion;
  pathRegions: CampaignRegion[];
  onClose: () => void;
}

export function CampaignPathPanel({ fromRegion, toRegion, pathRegions, onClose }: CampaignPathPanelProps) {
  const stepsCount = pathRegions.length;

  const { totalCoins, totalDuration } = React.useMemo(() => {
    let coins = 0;
    let duration = 0;
    pathRegions.forEach((r) => {
      coins += r.scout?.coins ?? 0;
      duration += r.scout?.duration ?? 0;
    });
    return { totalCoins: coins, totalDuration: duration };
  }, [pathRegions]);

  return (
    <div className="bg-background-300 border border-border rounded-lg shadow-lg flex flex-col overflow-hidden max-h-[500px]">
      {/* Header */}
      <div className="border-b border-border bg-background-100 shrink-0">
        <div className="flex items-center justify-between h-12 px-4">
          <div className="flex items-center gap-1.5 flex-1 min-w-0 text-sm font-semibold">
            {fromRegion ? (
              <>
                <span className="text-orange-400 truncate max-w-[90px]">{fromRegion.name}</span>
                <ArrowRight className="size-3.5 shrink-0 text-muted-foreground" />
              </>
            ) : (
              <span className="text-xs text-muted-foreground font-normal mr-1">Prerequisites for</span>
            )}
            <span className="text-orange-400 truncate max-w-[90px]">{toRegion.name}</span>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0 h-8 w-8">
            <X className="size-4" />
          </Button>
        </div>
      </div>

      <div className="overflow-y-auto p-4 space-y-4">
        {/* Total scout cost */}
        <div>
          <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">
            Total scout cost · {stepsCount} region{stepsCount !== 1 ? "s" : ""}
          </p>
          {stepsCount === 0 ? (
            <p className="text-xs text-muted-foreground italic">No prerequisites</p>
          ) : (
            <div className="grid grid-cols-2 gap-1.5">
              <ResourceBadge icon={getItemIconLocal("coins")} value={formatNumber(totalCoins)} alt="coins" />
              <div className="flex items-center justify-between px-2 rounded-md bg-background-100 border border-alpha-200 h-9">
                <Clock className="size-[22px] text-muted-foreground" />
                <span className="text-sm font-medium">{formatDuration(totalDuration)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Ordered steps */}
        {stepsCount > 0 && (
          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">Scout order</p>
            <div className="space-y-1">
              {pathRegions.map((region, index) => (
                <div key={region.id} className="flex items-center gap-2 text-xs py-0.5">
                  <span className="shrink-0 size-5 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-[10px]">
                    {index + 1}
                  </span>
                  <span className="truncate font-medium flex-1">{region.name}</span>
                  {region.scout && (
                    <span className="shrink-0 text-muted-foreground font-semibold">
                      {formatNumber(region.scout.coins)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
