"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { X, EyeOff, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ResourceBadge } from "@/components/items/resource-badge";
import { cn } from "@/lib/utils";
import {
  formatNumber,
  getGoodNameFromPriorityEra,
  getItemIconLocal,
} from "@/lib/utils";
import type { HydratedTechno } from "@/lib/db/data-hydration";
import { useSelectEra } from "@/lib/stores/technology-page-store";

interface TechnoCardProps {
  era: string;
  technos: HydratedTechno[];
  userSelections: string[][];
  onRemoveAll: () => void;
  onToggleHidden: () => void;
}

export function TechnoCard({
  era,
  technos,
  userSelections,
  onRemoveAll,
  onToggleHidden,
}: TechnoCardProps) {
  const router = useRouter();
  const selectEra = useSelectEra();
  const [isHovered, setIsHovered] = useState(false);

  // ✅ Aggregate costs - ALWAYS aggregate ALL technos in the era (visible AND hidden)
  const aggregatedData = useMemo(() => {
    if (technos.length === 0) {
      return {
        totalResearch: 0,
        totalCoins: 0,
        totalFood: 0,
        goods: [] as Array<{ resource: string; amount: number }>, // ✅ Changed type to resource
        technoCount: 0,
      };
    }

    const resources: Record<string, number> = {};
    const goodsMap = new Map<string, number>();

    technos.forEach((techno) => {
      // ✅ Handle flat costs structure from registry
      Object.entries(techno.costs).forEach(([key, value]) => {
        if (key === "goods" && Array.isArray(value)) {
          // Aggregate goods
          value.forEach((good) => {
            const existing = goodsMap.get(good.resource);
            goodsMap.set(good.resource, (existing || 0) + good.amount);
          });
        } else if (typeof value === "number") {
          // Aggregate numeric resources (research_points, coins, food, etc.)
          resources[key] = (resources[key] || 0) + value;
        }
      });
    });

    return {
      totalResearch: resources.research_points || 0,
      totalCoins: resources.coins || 0,
      totalFood: resources.food || 0,
      goods: Array.from(goodsMap.entries()).map(([resource, amount]) => ({
        resource,
        amount,
      })),
      technoCount: technos.length,
    };
  }, [technos]);

  const allHidden = technos.length > 0 && technos.every((t) => t.hidden);

  // ✅ Extract eraId from era prop (era prop is already the eraId in snake_case)
  const eraId = era;

  // ✅ Handle customize click - Navigate to research tree with this era
  const handleCustomize = () => {
    if (eraId) {
      // Set this era as selected in the research tree store
      selectEra(eraId);
      // Navigate to research tree page
      router.push("/research-tree");
    }
  };

  const mainResources = useMemo(() => {
    const resources = [];

    if (aggregatedData.totalResearch > 0) {
      resources.push({
        resource: "research_points",
        value: aggregatedData.totalResearch,
        icon: getItemIconLocal("research_points"),
      });
    }

    if (aggregatedData.totalCoins > 0) {
      resources.push({
        resource: "coins",
        value: aggregatedData.totalCoins,
        icon: getItemIconLocal("coins"),
      });
    }

    if (aggregatedData.totalFood > 0) {
      resources.push({
        resource: "food",
        value: aggregatedData.totalFood,
        icon: getItemIconLocal("food"),
      });
    }

    return resources;
  }, [aggregatedData]);

  const goodsBadges = useMemo(() => {
    if (!aggregatedData.goods || aggregatedData.goods.length === 0) return null;

    return aggregatedData.goods.map((g, i) => {
      const match = g.resource.match(
        /^(Primary|Secondary|Tertiary)_([A-Z]{2})$/i,
      );
      let goodName = g.resource;

      if (match) {
        const [, priority, eraCode] = match;
        const resolvedName = getGoodNameFromPriorityEra(
          priority,
          eraCode,
          userSelections,
        );
        goodName = resolvedName || "default";
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
  }, [aggregatedData.goods, userSelections]);

  return (
    <div
      className="group relative flex gap-4 rounded-sm bg-background-300 border h-auto min-h-32"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hidden overlay */}
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

      {/* Content */}
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
                {era.replace(/_/g, " ")}
              </h3>

              <div className={allHidden ? "opacity-50" : ""}>
                <Badge
                  variant="outline"
                  className="bg-blue-200 dark:bg-blue-300 text-blue-950 border-alpha-100 border rounded-sm"
                >
                  {(() => {
                    const visibleCount = technos.filter(
                      (t) => !t.hidden,
                    ).length;
                    const totalCount = technos.length;
                    const hasHidden = visibleCount < totalCount;
                    return hasHidden
                      ? `${visibleCount}/${totalCount} technos`
                      : `${totalCount} techno${totalCount > 1 ? "s" : ""}`;
                  })()}
                </Badge>
              </div>

              {/* Hide/Show button - visible on hover (desktop) */}
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
                  title={
                    allHidden
                      ? "Include in total calculation"
                      : "Exclude from total calculation"
                  }
                >
                  {allHidden ? (
                    <Eye className="size-4" />
                  ) : (
                    <EyeOff className="size-4" />
                  )}
                  <span>{allHidden ? "Show" : "Hide"}</span>
                </Button>
              </div>

              {/* Customize button - visible on hover (desktop) */}
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
                  title="View in research tree"
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

          {/* Resources & Buttons */}
          <div className="flex flex-col md:flex-row w-full gap-2 justify-between items-stretch min-h-[70px]">
            <div
              className={cn(
                "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5 text-sm w-full content-start",
                allHidden && "opacity-60 pointer-events-none select-none",
              )}
            >
              {!mainResources.length && !goodsBadges?.length ? (
                <ResourceBadge
                  icon="/goods/default.webp"
                  value="0"
                  alt="No resources"
                />
              ) : (
                <>
                  {mainResources.map((r) => (
                    <ResourceBadge
                      key={r.resource}
                      icon={r.icon}
                      value={formatNumber(r.value)}
                      alt={r.resource}
                    />
                  ))}
                  {goodsBadges}
                </>
              )}
            </div>

            {/* Mobile: Hide + Customize buttons */}
            <div className="flex md:hidden justify-between items-end gap-2">
              <Button
                variant={allHidden ? "outline" : "ghost"}
                className={cn(
                  "rounded-sm h-[34px]",
                  !allHidden && "text-muted-foreground border-transparent",
                )}
                onClick={onToggleHidden}
                title={
                  allHidden
                    ? "Include in total calculation"
                    : "Exclude from total calculation"
                }
              >
                {allHidden ? (
                  <Eye className="size-4" />
                ) : (
                  <EyeOff className="size-4" />
                )}
                <span>{allHidden ? "Show" : "Hide"}</span>
              </Button>

              <Button
                variant="outline"
                className="rounded-sm h-[34px]"
                onClick={handleCustomize}
                title="View in research tree"
              >
                Customize
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
