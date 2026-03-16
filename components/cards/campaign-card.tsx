"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { X, EyeOff, Eye, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ResourceBadge } from "@/components/items/resource-badge";
import { cn, formatDuration } from "@/lib/utils";
import { formatNumber, getItemIconLocal } from "@/lib/utils";
import type { CampaignEntity } from "@/lib/db/schema";
import type { CampaignRegion } from "@/types/campaign-types";
import { useSelectCampaignEra } from "@/lib/stores/campaign-page-store";
import { ERAS } from "@/lib/catalog";

interface CampaignCardProps {
  era: string;
  regions: CampaignEntity[];
  staticRegions: CampaignRegion[];
  onRemoveAll: () => void;
  onToggleHidden: () => void;
}

export function CampaignCard({
  era,
  regions,
  staticRegions,
  onRemoveAll,
  onToggleHidden,
}: CampaignCardProps) {
  const router = useRouter();
  const selectCampaignEra = useSelectCampaignEra();
  const [isHovered, setIsHovered] = useState(false);

  const allHidden = regions.length > 0 && regions.every((r) => !!r.hidden);

  // Aggregate scout costs for remaining (non-completed) regions
  const aggregated = useMemo(() => {
    const completedIds = new Set(regions.filter((r) => !!r.cp).map((r) => r.id));
    const remaining = staticRegions.filter((r) => !completedIds.has(r.id));

    const totalScoutCoins = remaining.reduce((s, r) => s + r.scout.coins, 0);
    const totalScoutDuration = remaining.reduce(
      (s, r) => s + r.scout.duration,
      0,
    );

    return {
      totalScoutCoins,
      totalScoutDuration,
      regionCount: staticRegions.length,
      remainingCount: remaining.length,
    };
  }, [regions, staticRegions]);

  const eraName =
    ERAS.find((e) => e.id === era)?.name ?? era.replace(/_/g, " ");

  const handleCustomize = () => {
    selectCampaignEra(era);
    router.push("/campaign");
  };

  return (
    <div
      className="group relative flex gap-4 rounded-sm bg-background-300 border h-auto min-h-28"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {allHidden && (
        <div
          className="absolute inset-0 pointer-events-none opacity-50 rounded-sm z-0"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              var(--gray-400) 0,
              var(--gray-400) 1px,
              transparent 0,
              transparent 50%
            )`,
            backgroundSize: "10px 10px",
          }}
        />
      )}

      <div className="flex p-3 gap-2 lg:gap-4 size-full relative">
        <div className="flex-1">
          {/* Header */}
          <div className="flex mb-3 justify-between">
            <div className="flex items-center gap-2">
              <h3
                className={cn(
                  "text-sm lg:text-[15px] font-medium truncate capitalize pl-1",
                  allHidden && "opacity-50",
                )}
              >
                {eraName}
              </h3>

              <div className={allHidden ? "opacity-50" : ""}>
                <Badge variant="outline" className="campaign-badge border rounded-sm">
                  {(() => {
                    const remaining = aggregated.remainingCount;
                    const total = aggregated.regionCount;
                    return remaining < total
                      ? `${remaining}/${total} regions`
                      : `${total} region${total > 1 ? "s" : ""}`;
                  })()}
                </Badge>
              </div>

              {/* Hide/Show button */}
              <div
                className={cn(
                  "transition-opacity duration-200 hidden md:block",
                  allHidden || isHovered
                    ? "opacity-100"
                    : "opacity-0 pointer-events-none",
                )}
              >
                <Button
                  size="sm"
                  variant={allHidden ? "outline" : "ghost"}
                  className="rounded-sm h-6 w-20"
                  onClick={onToggleHidden}
                >
                  {allHidden ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                  <span>{allHidden ? "Show" : "Hide"}</span>
                </Button>
              </div>

              {/* Customize button */}
              <div
                className={cn(
                  "transition-opacity duration-200 hidden md:block",
                  isHovered ? "opacity-100" : "opacity-0 pointer-events-none",
                )}
              >
                <Button
                  size="sm"
                  variant="ghost"
                  className="rounded-sm h-6"
                  onClick={handleCustomize}
                >
                  Customize
                </Button>
              </div>
            </div>

            <Button
              size="icon-sm"
              variant="destructive"
              className="rounded-sm size-6"
              onClick={onRemoveAll}
            >
              <X className="size-4 stroke-3" />
            </Button>
          </div>

          {/* Scout cost summary */}
          <div
            className={cn(
              "flex flex-col md:flex-row w-full gap-2 justify-between items-stretch min-h-[50px]",
              allHidden && "opacity-60 pointer-events-none select-none",
            )}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5 text-sm w-full content-start">
              <ResourceBadge
                icon={getItemIconLocal("coins")}
                value={formatNumber(aggregated.totalScoutCoins)}
                alt="Scout coins"
              />
              <div className="flex items-center justify-between px-2 rounded-md bg-background-100 border border-alpha-200 h-9 shrink-0">
                <Clock className="size-5 text-muted-foreground" />
                <span className="text-sm font-medium">{formatDuration(aggregated.totalScoutDuration)}</span>
              </div>
            </div>

            {/* Mobile buttons */}
            <div className="flex md:hidden justify-between items-end gap-2">
              <Button
                variant={allHidden ? "outline" : "ghost"}
                className={cn(
                  "rounded-sm h-[34px]",
                  !allHidden && "text-muted-foreground border-transparent",
                )}
                onClick={onToggleHidden}
              >
                {allHidden ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                <span>{allHidden ? "Show" : "Hide"}</span>
              </Button>
              <Button
                variant="outline"
                className="rounded-sm h-[34px]"
                onClick={handleCustomize}
              >
                View
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
