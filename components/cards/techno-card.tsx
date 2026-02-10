"use client";

import { useState } from "react";
import { X, ExternalLink, EyeOff, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ResourceBadge } from "@/components/items/resource-badge";
import { cn } from "@/lib/utils";
import {
  formatNumber,
  slugify,
  getGoodNameFromPriorityEra,
  getItemIconLocal,
} from "@/lib/utils";
import { eras } from "@/lib/constants";

interface AggregatedTechnoData {
  totalResearch: number;
  totalCoins: number;
  totalFood: number;
  goods: Array<{ type: string; amount: number }>;
  technoCount: number;
  hidden: boolean;
}

interface TechnoCardProps {
  aggregatedTechnos: AggregatedTechnoData;
  userSelections: string[][];
  onRemoveAll: () => void;
  onToggleHidden: () => void;
  era?: string;
}

export function TechnoCard({
  aggregatedTechnos,
  userSelections,
  onRemoveAll,
  onToggleHidden,
  era,
}: TechnoCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { hidden } = aggregatedTechnos;

  const wikiUrl = (() => {
    if (!era) return "";
    const eraData = eras.find((e) => e.id === era);
    const eraName = eraData
      ? eraData.name.replace(/ /g, "_")
      : era.replace(/_/g, " ");
    return `https://riseofcultures.wiki.gg/wiki/Home_Cultures/${eraName}`;
  })();

  const mainResources = (() => {
    const resources = [];

    if (aggregatedTechnos.totalResearch > 0) {
      resources.push({
        type: "research_points",
        value: aggregatedTechnos.totalResearch,
        icon: getItemIconLocal("research_points"),
      });
    }

    if (aggregatedTechnos.totalCoins > 0) {
      resources.push({
        type: "coins",
        value: aggregatedTechnos.totalCoins,
        icon: getItemIconLocal("coins"),
      });
    }

    if (aggregatedTechnos.totalFood > 0) {
      resources.push({
        type: "food",
        value: aggregatedTechnos.totalFood,
        icon: getItemIconLocal("food"),
      });
    }

    return resources;
  })();

  const goodsBadges = (() => {
    if (!aggregatedTechnos.goods || aggregatedTechnos.goods.length === 0)
      return null;

    return aggregatedTechnos.goods.map((g, i) => {
      const match = g.type.match(/^(Primary|Secondary|Tertiary)_([A-Z]{2})$/i);
      let goodName = g.type;

      if (match) {
        const [, priority, era] = match;
        const resolvedName = getGoodNameFromPriorityEra(
          priority,
          era,
          userSelections,
        );
        if (resolvedName) goodName = resolvedName;
      }

      return (
        <ResourceBadge
          key={`${g.type}-${i}`}
          icon={`/goods/${slugify(goodName)}.webp`}
          value={formatNumber(g.amount)}
          alt={g.type}
        />
      );
    });
  })();

  return (
    <div
      className="group relative flex gap-4 rounded-sm bg-background-300 border h-auto min-h-32"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {hidden && (
        <div
          className="absolute inset-0 pointer-events-none opacity-50 rounded-sm"
          style={{
            backgroundImage: `repeating-linear-gradient(
              45deg,
              var(--gray-400) 0,
              var(--gray-400) 1px,
              transparent 0,
              transparent 50%
            )`,
            backgroundSize: "10px 10px",
            backgroundAttachment: "fixed",
          }}
        />
      )}

      <div className="flex p-3 gap-2 lg:gap-4 size-full relative">
        <div className="flex-1">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <h3
                className={cn(
                  "text-sm lg:text-[15px] font-medium truncate capitalize pl-1",
                  hidden && "opacity-50",
                )}
              >
                {era ? `${era.replace(/_/g, " ")} ` : "Era"}
              </h3>

              <div className={hidden ? "opacity-50" : ""}>
                <Badge
                  variant="outline"
                  className="bg-blue-200 dark:bg-blue-300 text-blue-950 border-alpha-100 border rounded-sm"
                >
                  {aggregatedTechnos.technoCount} techno
                  {aggregatedTechnos.technoCount > 1 ? "s" : ""}
                </Badge>
              </div>

              <div
                className={cn(
                  "transition-opacity duration-200",
                  hidden || isHovered
                    ? "opacity-100"
                    : "opacity-0 pointer-events-none",
                )}
              >
                <Button
                  size="sm"
                  variant={hidden ? "outline" : "ghost"}
                  className="rounded-sm h-6"
                  onClick={onToggleHidden}
                  title={
                    hidden
                      ? "Include in total calculation"
                      : "Exclude from total calculation"
                  }
                >
                  {hidden ? (
                    <Eye className="size-4" />
                  ) : (
                    <EyeOff className="size-4" />
                  )}
                  {hidden ? "Show" : "Hide"}
                </Button>
              </div>

              <div
                className={cn(
                  "ml-auto transition-opacity duration-200",
                  isHovered ? "opacity-100" : "opacity-0 pointer-events-none",
                )}
              >
                <Button
                  size="sm"
                  variant="ghost"
                  className="rounded-sm h-6"
                  onClick={() => window.open(wikiUrl, "_blank")}
                  title="Go to the wiki page"
                >
                  Link <ExternalLink className="size-4" />
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
              "grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-1.5 text-sm w-full",
              hidden && "opacity-50",
            )}
          >
            {mainResources.map((r) => (
              <ResourceBadge
                key={r.type}
                icon={r.icon}
                value={formatNumber(r.value)}
                alt={r.type}
              />
            ))}
            {goodsBadges}
          </div>
        </div>
      </div>
    </div>
  );
}
