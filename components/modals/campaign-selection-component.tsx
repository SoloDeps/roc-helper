"use client";

import { memo, useMemo } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Plus, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { ERAS } from "@/lib/catalog";
import { useCampaigns } from "@/hooks/use-database";
import { useSubmitCampaign } from "@/lib/stores/add-campaign-submission-hook";

export const CampaignSelection = memo(() => {
  const { submit, isLoading } = useSubmitCampaign();
  const existingCampaigns = useCampaigns();

  // Extract unique era IDs from saved campaign regions
  const existingEraIds = useMemo(() => {
    const eraSet = new Set<string>();
    (existingCampaigns || []).forEach((c) => {
      // e.g. "sa_2" → prefix "sa" → era "stone_age"
      const abbr = c.id.match(/^([a-z]+)_/)?.[1];
      if (abbr) {
        // find era by abbr
        const era = ERAS.find((e) => e.abbr.toLowerCase() === abbr);
        if (era) eraSet.add(era.id);
      }
    });
    return eraSet;
  }, [existingCampaigns]);

  const availableEras = useMemo(
    () => ERAS.filter((era) => !existingEraIds.has(era.id)),
    [existingEraIds],
  );

  if (availableEras.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Check className="size-12 text-green-500 mb-4" />
        <h3 className="text-lg font-medium mb-2">All campaigns added</h3>
        <p className="text-sm text-muted-foreground">
          You&apos;ve already added all available campaign eras.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2 pb-20 md:pb-0">
      {availableEras.map((era) => {
        const isAdded = existingEraIds.has(era.id);

        return (
          <Button
            key={era.id}
            variant="outline"
            onClick={() => !isAdded && submit(era.id)}
            disabled={isLoading || isAdded}
            className={cn(
              "size-full text-left flex items-center gap-3 h-16 px-3 justify-between",
              isAdded && "opacity-50 cursor-not-allowed",
            )}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Image
                src="/images/game_icons/icon_flat_barracks.webp"
                alt={era.name}
                width={40}
                height={40}
                className="size-10 object-contain opacity-60 invert-100 dark:invert-0 shrink-0"
                unoptimized
              />
              <span className="text-sm font-medium truncate">{era.name}</span>
            </div>
            {isAdded ? (
              <Check className="size-5 text-green-500 shrink-0" />
            ) : (
              <Plus className="size-5 shrink-0 text-muted-foreground" />
            )}
          </Button>
        );
      })}
    </div>
  );
});

CampaignSelection.displayName = "CampaignSelection";
