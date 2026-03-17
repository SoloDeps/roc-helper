"use client";

import React from "react";
import { ArrowRight, Clock } from "lucide-react";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { ResourceBadge } from "@/components/items/resource-badge";
import { formatNumber, getItemIconLocal, formatDuration } from "@/lib/utils";
import type { CampaignRegion } from "@/types/campaign-types";

interface CampaignPathDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fromRegion: CampaignRegion | null; // null = ancestors mode
  toRegion: CampaignRegion | null;
  pathRegions: CampaignRegion[];
}

export function CampaignPathDrawer({
  open,
  onOpenChange,
  fromRegion,
  toRegion,
  pathRegions,
}: CampaignPathDrawerProps) {
  const { totalCoins, totalDuration } = React.useMemo(() => {
    let coins = 0;
    let duration = 0;
    pathRegions.forEach((r) => {
      coins += r.scout?.coins ?? 0;
      duration += r.scout?.duration ?? 0;
    });
    return { totalCoins: coins, totalDuration: duration };
  }, [pathRegions]);

  const stepsCount = pathRegions.length;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="p-0 gap-0 flex flex-col overflow-hidden max-h-[85vh]">
        {/* Header */}
        <div className="sticky top-0 z-10 backdrop-blur-sm border-b border-alpha-400 bg-background">
          <div className="flex items-center justify-center h-12 px-4 gap-2">
            {toRegion && (
              fromRegion ? (
                <>
                  <span className="text-sm font-semibold text-orange-400 truncate max-w-[120px]">
                    {fromRegion.name}
                  </span>
                  <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
                  <span className="text-sm font-semibold text-orange-400 truncate max-w-[120px]">
                    {toRegion.name}
                  </span>
                </>
              ) : (
                <>
                  <span className="text-sm text-muted-foreground">
                    Prerequisites for
                  </span>
                  <span className="text-sm font-semibold text-orange-400 truncate max-w-[150px]">
                    {toRegion.name}
                  </span>
                </>
              )
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-5 bg-background-200">
          {/* Total scout cost */}
          <div>
            <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">
              Total scout cost · {stepsCount} region{stepsCount !== 1 ? "s" : ""}
            </p>
            {stepsCount === 0 ? (
              <p className="text-xs text-muted-foreground italic">No prerequisites</p>
            ) : (
              <div className="grid grid-cols-2 gap-1.5">
                <ResourceBadge
                  icon={getItemIconLocal("coins")}
                  value={formatNumber(totalCoins)}
                  alt="coins"
                />
                <div className="flex items-center justify-between px-2 rounded-md bg-background-100 border border-alpha-200 h-9">
                  <Clock className="size-[22px] text-muted-foreground" />
                  <span className="text-sm font-medium">{formatDuration(totalDuration)}</span>
                </div>
              </div>
            )}
          </div>

          {/* Scout order */}
          {stepsCount > 0 && (
            <div className="border-t border-alpha-300 pt-4">
              <p className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wide">
                Scout order
              </p>
              <div className="space-y-2">
                {pathRegions.map((region, index) => (
                  <div
                    key={region.id}
                    className="flex items-center gap-3 p-2.5 rounded-lg border border-border bg-card"
                  >
                    <span className="shrink-0 size-6 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-[11px]">
                      {index + 1}
                    </span>
                    <span className="flex-1 text-sm font-medium truncate">
                      {region.name}
                    </span>
                    {region.scout && (
                      <span className="shrink-0 text-xs font-semibold text-muted-foreground">
                        {formatNumber(region.scout.coins)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
