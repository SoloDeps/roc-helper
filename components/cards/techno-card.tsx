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
import { useMediaQuery } from "@/hooks/use-media-query";
import type { TechnoEntity } from "@/lib/db/schema";
import { getEraName } from "@/lib/element-data-loader";
import { useSelectEra } from "@/lib/stores/technology-page-store";

interface TechnoCardProps {
  era: string;
  technos: TechnoEntity[];
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
  const isMobile = useMediaQuery("(max-width: 767px)");
  const [isHovered, setIsHovered] = useState(false);

  // ✅ Aggregate costs - ALWAYS aggregate ALL technos in the era (visible AND hidden)
  const aggregatedData = useMemo(() => {
    if (technos.length === 0) {
      return {
        totalResearch: 0,
        totalCoins: 0,
        totalFood: 0,
        goods: [] as Array<{ type: string; amount: number }>,
        technoCount: 0,
      };
    }

    const resources: Record<string, number> = {};
    const goodsMap = new Map<string, number>();

    technos.forEach((techno) => {
      Object.entries(techno.costs.resources).forEach(([key, value]) => {
        resources[key] = (resources[key] || 0) + value;
      });

      techno.costs.goods.forEach((good) => {
        const existing = goodsMap.get(good.type);
        goodsMap.set(good.type, (existing || 0) + good.amount);
      });
    });

    return {
      totalResearch: resources.research_points || 0,
      totalCoins: resources.coins || 0,
      totalFood: resources.food || 0,
      goods: Array.from(goodsMap.entries()).map(([type, amount]) => ({
        type,
        amount,
      })),
      technoCount: technos.length,
    };
  }, [technos]);

  const allHidden = technos.length > 0 && technos.every((t) => t.hidden);

  // Get era display name
  const eraDisplayName = getEraName(era);

  // ✅ FIX 4: Get eraId from first techno (needed for navigation)
  const eraId = technos.length > 0 ? technos[0].eraId : null;

  // ✅ FIX 4: Handle customize click - Navigate to research tree with this era
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
        type: "research_points",
        value: aggregatedData.totalResearch,
        icon: getItemIconLocal("research_points"),
      });
    }

    if (aggregatedData.totalCoins > 0) {
      resources.push({
        type: "coins",
        value: aggregatedData.totalCoins,
        icon: getItemIconLocal("coins"),
      });
    }

    if (aggregatedData.totalFood > 0) {
      resources.push({
        type: "food",
        value: aggregatedData.totalFood,
        icon: getItemIconLocal("food"),
      });
    }

    return resources;
  }, [aggregatedData]);

  const goodsBadges = useMemo(() => {
    if (!aggregatedData.goods || aggregatedData.goods.length === 0) return null;

    return aggregatedData.goods.map((g, i) => {
      const match = g.type.match(/^(Primary|Secondary|Tertiary)_([A-Z]{2})$/i);
      let goodName = g.type;

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
          key={`${g.type}-${i}`}
          icon={getItemIconLocal(goodName)}
          value={formatNumber(g.amount)}
          alt={g.type}
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
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <h3
                className={cn(
                  "text-sm lg:text-[15px] font-medium truncate capitalize pl-1",
                  allHidden && "opacity-50",
                )}
              >
                {eraDisplayName}
              </h3>

              <div className={allHidden ? "opacity-50" : ""}>
                <Badge
                  variant="outline"
                  className="bg-blue-200 dark:bg-blue-300 text-blue-950 border-alpha-100 border rounded-sm"
                >
                  {technos.length} techno{technos.length > 1 ? "s" : ""}
                </Badge>
              </div>

              {/* Hide/Show button */}
              <div
                className={cn(
                  "transition-opacity duration-200",
                  allHidden || isHovered || isMobile
                    ? "opacity-100"
                    : "opacity-0 pointer-events-none",
                )}
              >
                <Button
                  size="sm"
                  variant={allHidden || isMobile ? "outline" : "ghost"}
                  className={cn(
                    "rounded-sm h-6 w-20",
                    isMobile &&
                      !allHidden &&
                      "text-muted-foreground border-transparent",
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
              </div>

              {/* ✅ FIX 4: Customize button - Navigate to research tree */}
              <div
                className={cn(
                  "ml-auto transition-opacity duration-200 hidden md:block",
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

          <div
            className={cn(
              "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5 text-sm w-full",
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
                    key={r.type}
                    icon={r.icon}
                    value={formatNumber(r.value)}
                    alt={r.type}
                  />
                ))}
                {goodsBadges}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
