"use client";

import { memo, useMemo } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Plus, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { ERAS } from "@/lib/catalog";
import { useSubmitTechno } from "@/lib/stores/add-element-submission-hooks";
import { useTechnos } from "@/hooks/use-database";

/**
 * Technology selection - Direct add from era list
 * Layout: [Icon] Era Name [Add Button]
 */
interface TechnologySelectionProps {}

export const TechnologySelection = memo<TechnologySelectionProps>(() => {
  const { submit, isLoading } = useSubmitTechno();
  
  // Get already added technos from DB (useLiveQuery returns data directly)
  const existingTechnos = useTechnos();
  const existingEraAbbrs = useMemo(
    () => new Set((existingTechnos || []).map((t) => t.era)),
    [existingTechnos],
  );

  // Filter out already added eras
  const availableEras = useMemo(() => {
    return ERAS.filter((era) => !existingEraAbbrs.has(era.abbr));
  }, [existingEraAbbrs]);

  if (availableEras.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Check className="size-12 text-green-500 mb-4" />
        <h3 className="text-lg font-medium mb-2">All technologies added</h3>
        <p className="text-sm text-muted-foreground">
          You&apos;ve already added all available technologies to your list.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2 pb-20 md:pb-0">
      {availableEras.map((era) => {
        const isAdded = existingEraAbbrs.has(era.abbr);

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
            {/* Left: Icon + Era Name */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Image
                src="/game_icons/icon_flat_research_points.webp"
                alt={era.name}
                width={40}
                height={40}
                className="size-10 object-contain opacity-70 invert-100 dark:invert-0 shrink-0"
                unoptimized
              />
              <span className="text-sm font-medium truncate">{era.name}</span>
            </div>

            {/* Right: Add Button or Check Icon */}
            {isAdded ? (
              <Check className="size-5 text-green-500 shrink-0" />
            ) : (
              <Plus className="size-5 shrink-0" />
            )}
          </Button>
        );
      })}
    </div>
  );
});

TechnologySelection.displayName = "TechnologySelection";