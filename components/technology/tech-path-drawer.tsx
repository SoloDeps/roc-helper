"use client";

import React from "react";
import { ArrowRight } from "lucide-react";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { ResourceBadge } from "@/components/items/resource-badge";
import {
  formatNumber,
  getGoodNameFromPriorityEra,
  getItemIconLocal,
} from "@/lib/utils";
import type { TechnoData } from "@/types/shared";
import { useBuildingSelections } from "@/hooks/use-building-selections";

interface TechPathDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fromTech: TechnoData | null; // null = ancestors mode
  toTech: TechnoData | null;
  pathTechs: TechnoData[];
}

export function TechPathDrawer({
  open,
  onOpenChange,
  fromTech,
  toTech,
  pathTechs,
}: TechPathDrawerProps) {
  const userSelections = useBuildingSelections();

  const { totalResources, totalGoods } = React.useMemo(() => {
    const resources: Record<string, number> = {};
    const goodsMap = new Map<string, number>();
    // Exclude target from cost sum
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
  }, [pathTechs, toTech?.id]);

  const goodsBadges = totalGoods.map((g, i) => {
    const match = g.resource.match(
      /^(Primary|Secondary|Tertiary)_([A-Z]{2})$/i,
    );
    let goodName = g.resource;
    if (match) {
      const [, p, e] = match;
      goodName = getGoodNameFromPriorityEra(p, e, userSelections) || "default";
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

  if (!toTech) return null;

  const techsToDisplay = pathTechs;
  const stepsCount = techsToDisplay.length;

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="p-0 gap-0 flex flex-col overflow-hidden max-h-[85vh]">
        {/* Header */}
        <div className="sticky top-0 z-10 backdrop-blur-sm border-b border-alpha-400 bg-background">
          <div className="flex items-center justify-center h-12 px-4 gap-2">
            {fromTech ? (
              <>
                <span className="text-sm font-semibold text-orange-400 truncate max-w-[120px]">
                  {fromTech.name}
                </span>
                <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
                <span className="text-sm font-semibold text-orange-400 truncate max-w-[120px]">
                  {toTech.name}
                </span>
              </>
            ) : (
              <>
                <span className="text-sm text-muted-foreground">
                  Prerequisites for
                </span>
                <span className="text-sm font-semibold text-orange-400 truncate max-w-[150px]">
                  {toTech.name}
                </span>
              </>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-5">
          {/* Total costs */}
          <div>
            <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wide">
              Total cost · {stepsCount} tech{stepsCount > 1 ? "s" : ""} to
              unlock
            </p>
            {stepsCount === 0 ? (
              <p className="text-xs text-muted-foreground italic">
                No prerequisites
              </p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
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

          {/* Steps */}
          {stepsCount > 0 && (
            <div className="border-t border-alpha-300 pt-4">
              <p className="text-xs text-muted-foreground mb-3 font-medium uppercase tracking-wide">
                Unlock order
              </p>
              <div className="space-y-2">
                {techsToDisplay.map((tech, index) => (
                  <div
                    key={tech.id}
                    className="flex items-center gap-3 p-2.5 rounded-lg border border-border bg-card"
                  >
                    <span className="shrink-0 size-6 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-[11px]">
                      {index + 1}
                    </span>
                    <span className="flex-1 text-sm font-medium truncate">
                      {tech.name}
                    </span>
                    {tech.costs.research_points && (
                      <div className="shrink-0 flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-400">
                        <span className="text-xs font-semibold">
                          {tech.costs.research_points}
                        </span>
                        <span className="text-[10px] opacity-70">RP</span>
                      </div>
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
