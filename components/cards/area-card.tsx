"use client";

import { useState } from "react";
import { X, EyeOff, Eye } from "lucide-react";
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
import type { OttomanAreaEntity } from "@/lib/db/schema";
import Image from "next/image";

interface AreaCardProps {
  area: OttomanAreaEntity;
  userSelections: string[][];
  onRemove: (id: string) => void;
  onToggleHidden: (id: string) => void;
}

export function AreaCard({
  area,
  userSelections,
  onRemove,
  onToggleHidden,
}: AreaCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { id, areaIndex, costs, hidden } = area;

  // ✅ Use new structure: costs.resources
  const mainResources = Object.entries(costs.resources || {}).map(
    ([type, value]) => ({
      type,
      value,
      icon: getItemIconLocal(type),
    }),
  );

  // ✅ Use new structure: costs.goods
  const goodsBadges = (() => {
    const goods = costs.goods;
    if (!goods?.length) return null;

    return goods.map((g, i) => {
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
      className={cn(
        "group flex items-center justify-center rounded-sm bg-background-300 border min-h-32 pl-1 relative",
      )}
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

      <div className="hidden md:flex size-28 shrink-0 overflow-hidden relative">
        <div className="size-full flex items-center justify-center bg-background-400/50">
          <Image
            src="/svg/icon_flat_scout.png"
            alt="Map"
            draggable={false}
            className="size-20 object-contain opacity-30 select-none invert-100 dark:invert-10"
            width={80}
            height={80}
          />
        </div>
      </div>

      <div className="flex p-3 size-full relative self-start">
        <div className="flex-1 h-full">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <h3
                className={cn(
                  "text-sm lg:text-[15px] font-medium truncate capitalize pl-1",
                  hidden && "opacity-50",
                )}
              >
                Area {areaIndex}
              </h3>

              <div className={hidden ? "opacity-50" : ""}>
                <Badge
                  variant="outline"
                  className="bg-green-200 dark:bg-green-300 text-green-950 border-alpha-100 border rounded-sm"
                >
                  Area
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
                  onClick={() => onToggleHidden(id)}
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
                  <span className="hidden md:inline-block">
                    {hidden ? "Show" : "Hide"}
                  </span>
                </Button>
              </div>
            </div>

            <Button
              size="icon-sm"
              variant="destructive"
              className="rounded-sm size-6"
              onClick={() => onRemove(id)}
            >
              <X className="size-4 stroke-3" />
            </Button>
          </div>

          <div
            className={cn(
              "grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-sm w-60 sm:w-80",
              hidden && "opacity-60 pointer-events-none select-none",
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
