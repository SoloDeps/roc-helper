"use client";

import { memo, useCallback } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ERAS } from "@/lib/catalog";
import { useAddElementStore } from "@/lib/stores/add-element-store";
import { ChevronRight } from "lucide-react";

export const PresetEraSelection = memo(() => {
  const { setPresetEra } = useAddElementStore();

  const handleSelect = useCallback(
    (eraAbbr: string) => {
      setPresetEra(eraAbbr);
      useAddElementStore.setState({ currentStep: "preset_selection" });
    },
    [setPresetEra],
  );

  return (
    <div className="space-y-2 pb-16 md:pb-0">
      {ERAS.map((era) => (
        <Button
          key={era.id}
          variant="outline"
          onClick={() => handleSelect(era.abbr)}
          className="size-full text-left flex items-center gap-3 h-16 px-3 justify-start"
        >
          {/* Left: Icon + Era Name */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Image
              src="/images/game_icons/icon_flat_research_points.webp"
              alt={era.name}
              width={40}
              height={40}
              className="size-10 object-contain opacity-60 invert-100 dark:invert-0 shrink-0"
              unoptimized
            />
            <span className="text-sm font-medium truncate">{era.name}</span>
          </div>

          {/* Right: Add Button or Check Icon */}
          <ChevronRight className="size-5 shrink-0 text-muted-foreground" />
        </Button>
      ))}
    </div>
  );
});

PresetEraSelection.displayName = "PresetEraSelection";
