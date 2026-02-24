"use client";

import { memo } from "react";
import { Check } from "lucide-react";
import {
  cn,
  getCityCrestIconLocal,
  getGoodNameFromPriorityEra,
  getItemIconLocal,
} from "@/lib/utils";
import type { TechnoData } from "@/types/shared";
import Image from "next/image";
import { ABBR_TO_ERA_ID } from "@/lib/era-mappings";
import { useBuildingSelections } from "@/hooks/use-building-selections";

interface TechCardProps {
  tech: TechnoData;
  isCompleted: boolean;
  onToggleComplete: (techId: string) => void;
  onShowDetails: (tech: TechnoData) => void;
}

export const TechCard = memo<TechCardProps>(
  ({ tech, isCompleted, onToggleComplete, onShowDetails }) => {
    const userSelections = useBuildingSelections();

    // Derive era folder from tech id: "ba_1" -> "ba" -> "bronze_age"
    const abbr = tech.id.split("_")[0];
    const eraFolder = ABBR_TO_ERA_ID[abbr] ?? abbr;

    // Resolve Primary/Secondary/Tertiary Good → actual good name (e.g. "gold_laurel")
    const workshopMatch = tech.name.match(
      /^(Primary|Secondary|Tertiary)\s+Good$/i,
    );
    const resolvedGoodName = workshopMatch
      ? getGoodNameFromPriorityEra(
          workshopMatch[1],
          abbr.toUpperCase(),
          userSelections,
        )
      : null;

    // "gold_laurel" → "Gold Laurel"
    const formatGoodName = (raw: string) =>
      raw.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

    const displayName = resolvedGoodName
      ? formatGoodName(resolvedGoodName)
      : tech.name;
    // Large goods images will live in /images/images/goods-large/ once ready — falls back to badge icon for now
    const imgSrc = resolvedGoodName
      ? `/images/images/goods-large/${resolvedGoodName}.webp`
      : `/images/technos/${eraFolder}/${tech.id}.webp`;
    const imgFallback = resolvedGoodName
      ? getItemIconLocal(resolvedGoodName)
      : null;

    return (
      /* mt-3 laisse de la place pour l'image qui déborde vers le haut */
      <div className="mt-1.5 h-16 relative">
        {/* Image absolue qui déborde au-dessus de la card */}
        <div className="absolute -top-1.5 left-2 size-14 z-10 pointer-events-none">
          <Image
            src={imgSrc}
            alt={displayName}
            fill
            className={cn("object-contain drop-shadow-lg")}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              if (imgFallback && target.src !== imgFallback) {
                target.src = imgFallback;
              } else {
                target.style.display = "none";
              }
            }}
          />
        </div>

        {/* Card */}
        <button
          onClick={() => onShowDetails(tech)}
          className={cn(
            "size-full flex items-center rounded-lg border bg-card transition-all text-left",
            isCompleted
              ? "border-green-600/50 bg-green-600/10 dark:border-green-500/40 dark:bg-green-500/5"
              : "border-border hover:border-primary/50",
          )}
        >
          {/* Spacer pour laisser la place à l'image absolute */}
          <div className="shrink-0 w-15" />

          {/* Nom + meta */}
          <div className="flex-1 min-w-0 flex flex-col justify-center ps-4 py-2 pr-2 max-md:font-pro">
            <span
              className={cn(
                "font-semibold text-sm leading-tight truncate",
                isCompleted && "text-green-700 dark:text-green-400",
              )}
            >
              {displayName}
            </span>

            <div className="flex items-center gap-2 mt-0.5">
              {tech.costs.research_points && (
                <span className="text-[13px] font-semibold text-muted-foreground">
                  {tech.costs.research_points} RP
                </span>
              )}
            </div>
          </div>

          {/* Checkbox */}
          <div className="flex items-center gap-2.5">
            {tech.allied && (
              <Image
                src={getCityCrestIconLocal(tech.allied)}
                alt={tech.allied}
                width={40}
                height={40}
                className="object-contain h-7 w-auto"
              />
            )}
            <div
              onClick={(e) => {
                e.stopPropagation();
                onToggleComplete(tech.id);
              }}
              className={cn(
                "shrink-0 mr-2.5 size-6 rounded border-2 flex items-center justify-center transition-all",
                isCompleted
                  ? "bg-green-500 border-green-500"
                  : "border-muted-foreground/30 hover:border-green-600/70 dark:hover:border-green-400/70",
              )}
              aria-label={
                isCompleted ? "Mark as incomplete" : "Mark as completed"
              }
            >
              {isCompleted && (
                <Check className="size-[18px] text-white stroke-4" />
              )}
            </div>
          </div>
        </button>
      </div>
    );
  },
);

TechCard.displayName = "TechCard";
