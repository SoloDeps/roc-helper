"use client";

import React from "react";
import { X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResourceBadge } from "@/components/items/resource-badge";
import {
  formatNumber,
  getGoodNameFromPriorityEra,
  getItemIconLocal,
} from "@/lib/utils";
import type { TechnoData } from "@/types/shared";
import { useBuildingSelections } from "@/hooks/use-building-selections";

interface TechPathPanelProps {
  fromTech: TechnoData | null; // null = mode "tous les ancêtres"
  toTech: TechnoData;
  pathTechs: TechnoData[]; // ordered by column
  onClose: () => void;
}

export function TechPathPanel({
  fromTech,
  toTech,
  pathTechs,
  onClose,
}: TechPathPanelProps) {
  const userSelections = useBuildingSelections();

  const { totalResources, totalGoods } = React.useMemo(() => {
    const resources: Record<string, number> = {};
    const goodsMap = new Map<string, number>();

    // Exclude the target tech itself from cost sum (you're trying to reach it, not count it)
    const techsToSum = pathTechs;

    techsToSum.forEach((tech) => {
      Object.entries(tech.costs || {}).forEach(([key, value]) => {
        if (key === "goods" && Array.isArray(value)) {
          value.forEach((g) => {
            goodsMap.set(
              g.resource,
              (goodsMap.get(g.resource) ?? 0) + g.amount,
            );
          });
        } else if (typeof value === "number") {
          resources[key] = (resources[key] ?? 0) + value;
        }
      });
    });

    return {
      totalResources: resources,
      totalGoods: Array.from(goodsMap.entries()).map(([resource, amount]) => ({
        resource,
        amount,
      })),
    };
  }, [pathTechs, toTech.id]);

  const goodsBadges = totalGoods.map((g, i) => {
    const match = g.resource.match(
      /^(Primary|Secondary|Tertiary)_([A-Z]{2})$/i,
    );
    let goodName = g.resource;
    if (match) {
      const [, priority, era] = match;
      goodName =
        getGoodNameFromPriorityEra(priority, era, userSelections) || "default";
    }
    return (
      <ResourceBadge
        key={`${g.resource}-${i}`}
        icon={getItemIconLocal(goodName)}
        value={formatNumber(g.amount)}
        alt={g.resource}
      />
    );
  });

  const techsToDisplay = pathTechs;
  const stepsCount = techsToDisplay.length;

  return (
    <div className="bg-background-300 border border-border rounded-lg shadow-lg flex flex-col overflow-hidden max-h-[500px]">
      {/* Header */}
      <div className="border-b border-border bg-background-100 shrink-0">
        <div className="flex items-center justify-between h-12 px-4">
          <div className="flex items-center gap-1.5 flex-1 min-w-0 text-sm font-semibold">
            {fromTech ? (
              <>
                <span className="text-orange-400 truncate max-w-[90px]">
                  {fromTech.name}
                </span>
                <ArrowRight className="size-3.5 shrink-0 text-muted-foreground" />
              </>
            ) : (
              <span className="text-xs text-muted-foreground font-normal mr-1">
                Prerequisites for
              </span>
            )}
            <span className="text-orange-400 truncate max-w-[90px]">
              {toTech.name}
            </span>
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

      <div className="overflow-y-auto p-4 space-y-4">
        {/* Total costs */}
        <div>
          <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">
            Coût total · {stepsCount} techno{stepsCount > 1 ? "s" : ""} à
            débloquer
          </p>
          {stepsCount === 0 ? (
            <p className="text-xs text-muted-foreground italic">
              No prerequisites
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-1.5">
              {Object.entries(totalResources).map(([type, value]) => (
                <ResourceBadge
                  key={type}
                  icon={getItemIconLocal(type)}
                  value={formatNumber(value)}
                  alt={type}
                />
              ))}
              {goodsBadges}
            </div>
          )}
        </div>

        {/* Steps ordered by column */}
        {stepsCount > 0 && (
          <div className="pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">
              Ordre de déblocage
            </p>
            <div className="space-y-1">
              {techsToDisplay.map((tech, index) => (
                <div
                  key={tech.id}
                  className="flex items-center gap-2 text-xs py-0.5"
                >
                  <span className="shrink-0 size-5 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-[10px]">
                    {index + 1}
                  </span>
                  <span className="truncate font-medium flex-1">
                    {tech.name}
                  </span>
                  {tech.costs.research_points && (
                    <span className="shrink-0 text-purple-400 font-semibold">
                      {tech.costs.research_points} RP
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
