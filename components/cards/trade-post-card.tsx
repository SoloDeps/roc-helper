"use client";

import { useState } from "react";
import { X, EyeOff, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ResourceBadge } from "@/components/items/resource-badge";
import { cn } from "@/lib/utils";
import {
  questsFormatNumber,
  slugify,
  getGoodNameFromPriorityEra,
  getItemIconLocal,
} from "@/lib/utils";
import type { OttomanTradePostEntity } from "@/lib/db/schema";
import Image from "next/image";

interface TradePostCardProps {
  tradePost: OttomanTradePostEntity;
  userSelections: string[][];
  onRemove: (id: string) => void;
  onToggleHidden: (id: string) => void;
  onToggleLevel: (
    id: string,
    level: keyof OttomanTradePostEntity["levels"],
  ) => void;
}

export function TradePostCard({
  tradePost,
  userSelections,
  onRemove,
  onToggleHidden,
  onToggleLevel,
}: TradePostCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { id, name, area, resource, levels, costs, hidden, sourceData } =
    tradePost;

  const mainResources = Object.entries(costs)
    .filter(
      (entry): entry is [string, number] =>
        entry[0] !== "goods" && typeof entry[1] === "number",
    )
    .map(([type, value]) => ({
      type,
      value,
      icon: getItemIconLocal(type),
    }));

  const goodsBadges = (() => {
    const goods = costs.goods as
      | Array<{ type: string; amount: number }>
      | undefined;

    return (
      goods?.map((g, i) => {
        const match = g.type.match(
          /^(Primary|Secondary|Tertiary)_([A-Z]{2})$/i,
        );
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
            value={questsFormatNumber(g.amount)}
            alt={g.type}
          />
        );
      }) ?? []
    );
  })();

  const resourceIcon = getItemIconLocal(resource);

  const levelButtons = (() => {
    const buttons = [
      { key: "unlock" as const, label: "Unlock" },
      { key: "lvl2" as const, label: "Lvl 2" },
      { key: "lvl3" as const, label: "Lvl 3" },
      { key: "lvl4" as const, label: "Lvl 4" },
      { key: "lvl5" as const, label: "Lvl 5" },
    ];

    const hasUnlockData = (sourceData?.levels?.[1]?.length ?? 0) > 0;

    if (!hasUnlockData) {
      return buttons.slice(1);
    }

    return buttons;
  })();

  return (
    <div
      className="group relative flex flex-col gap-2 rounded-sm bg-background-300 border min-h-32"
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

      <div className="flex p-3 pb-2 gap-2 lg:gap-4 size-full relative">
        <div className="flex-1">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <Image
                src={resourceIcon}
                alt={resource}
                className="size-6 select-none"
                draggable={false}
                onError={(e) => {
                  e.currentTarget.src = "/goods/default.webp";
                }}
                width={24}
                height={24}
              />

              <h3
                className={cn(
                  "text-sm lg:text-[15px] font-medium truncate capitalize",
                  hidden && "opacity-50",
                )}
              >
                {name}
              </h3>

              <div className={hidden ? "opacity-50" : ""}>
                <Badge
                  variant="outline"
                  className="bg-purple-200 dark:bg-purple-300 text-purple-950 border-alpha-100 border rounded-sm"
                >
                  Area {area}
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
              "grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-1.5 text-sm w-full",
              hidden && "opacity-50",
            )}
          >
            {!mainResources.length && !goodsBadges.length ? (
              <ResourceBadge
                icon="/goods/default.webp"
                value="0"
                alt="No goods"
              />
            ) : (
              <>
                {mainResources.map((r) => (
                  <ResourceBadge
                    key={r.type}
                    icon={r.icon}
                    value={questsFormatNumber(r.value)}
                    alt={r.type}
                  />
                ))}
                {goodsBadges}
              </>
            )}
          </div>
        </div>
      </div>

      <div className={cn("flex gap-2 px-3 pb-3", hidden && "opacity-50")}>
        {levelButtons.map(({ key, label }) => (
          <Label
            key={key}
            className={cn(
              "flex-1 bg-background-100 hover:bg-accent/70 transition-all flex items-center justify-center gap-2.5 rounded-sm border p-2 cursor-pointer h-8",
              levels[key] && "beta-badge border-blue-300 dark:border-blue-900",
              hidden && "cursor-not-allowed opacity-50",
            )}
          >
            <Checkbox
              checked={levels[key]}
              onCheckedChange={() => !hidden && onToggleLevel(id, key)}
              disabled={hidden}
              className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-800"
            />
            <span className="text-xs font-medium">{label}</span>
          </Label>
        ))}
      </div>
    </div>
  );
}
