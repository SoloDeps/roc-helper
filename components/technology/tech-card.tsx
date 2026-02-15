"use client";

import { useState, memo } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { TechnoData } from "@/types/shared";

interface TechCardProps {
  tech: TechnoData;
  isCompleted: boolean;
  onToggleComplete: (techId: string) => void;
  onShowDetails: (tech: TechnoData) => void;
}

export const TechCard = memo<TechCardProps>(
  ({ tech, isCompleted, onToggleComplete, onShowDetails }) => {
    return (
      <div
        className={cn(
          "flex items-center gap-3 p-3 rounded-lg border bg-card transition-all",
          isCompleted && "opacity-60",
          "hover:border-primary/50",
        )}
      >
        {/* Left: Checkbox */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleComplete(tech.id);
          }}
          className={cn(
            "shrink-0 size-5 rounded border-2 flex items-center justify-center transition-all",
            isCompleted
              ? "bg-primary border-primary"
              : "border-muted-foreground/30 hover:border-primary/50",
          )}
          aria-label={isCompleted ? "Mark as incomplete" : "Mark as completed"}
        >
          {isCompleted && (
            <Check className="size-3 text-primary-foreground stroke-2" />
          )}
        </button>

        {/* Center: Title + RP (clickable) */}
        <button
          onClick={() => onShowDetails(tech)}
          className="flex-1 text-left flex items-center justify-between gap-3 min-w-0"
        >
          <span
            className={cn(
              "font-medium text-sm truncate",
              isCompleted && "line-through",
            )}
          >
            {tech.name}
          </span>

          {/* Research Points badge */}
          {tech.costs.research_points && (
            <div className="shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <span className="text-xs font-semibold">
                {tech.costs.research_points}
              </span>
              <span className="text-[10px] opacity-70">RP</span>
            </div>
          )}
        </button>

        {/* Allied badge (optional) */}
        {tech.allied && (
          <div className="shrink-0 text-xs bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-md">
            {tech.allied}
          </div>
        )}
      </div>
    );
  },
);

TechCard.displayName = "TechCard";
