"use client";

import { useState } from "react";
import { X, EyeOff, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ResourceBadge } from "@/components/items/resource-badge";
import BuildingCounter from "@/components/items/building-counter";
import { cn } from "@/lib/utils";
import {
  getItemIconLocal,
  questsFormatNumber,
  slugify,
  getGoodNameFromPriorityEra,
} from "@/lib/utils";

interface BuildingCardProps {
  buildingId: string;
  userSelections: string[][];
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onToggleHidden: (id: string) => void;
}

export function BuildingCard({
  buildingId,
  userSelections,
  onRemove,
  onUpdateQuantity,
  onToggleHidden,
}: BuildingCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Utiliser un selector pour ne récupérer que ce building
  const building = useBuildingsStore((state) =>
    state.getBuildingById(buildingId),
  );

  if (!building) return null;

  const { id, name, image, costs, quantity, maxQty, parsed, hidden } = building;

  // Calculer les resources à afficher
  const mainResources = Object.entries(costs)
    .filter(
      (entry): entry is [string, number] =>
        entry[0] !== "goods" && typeof entry[1] === "number",
    )
    .map(([type, unitValue]) => ({
      type,
      value: unitValue * quantity,
      icon: getItemIconLocal(type),
    }));

  const goodsBadges = (() => {
    const goods = costs.goods as
      | Array<{ type: string; amount: number }>
      | undefined;
    if (!goods?.length) return null;

    const combined = goods.reduce((map, g) => {
      map.set(g.type, (map.get(g.type) || 0) + g.amount * quantity);
      return map;
    }, new Map<string, number>());

    return Array.from(combined.entries()).map(([type, amount]) => {
      const match = type.match(/^(Primary|Secondary|Tertiary)_([A-Z]{2})$/i);
      let goodName = type;

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
          key={type}
          icon={`/goods/${slugify(goodName)}.webp`}
          value={questsFormatNumber(amount)}
          alt={type}
        />
      );
    });
  })();

  const isConstruction = parsed.tableType === "construction";

  return (
    <div
      className={cn(
        "group flex justify-center rounded-sm bg-background-300 border min-h-32 pl-1 relative",
        hidden && "opacity-60",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hidden overlay */}
      {hidden && (
        <div
          className="absolute inset-0 opacity-60 pointer-events-none select-none rounded-sm"
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

      {/* Image */}
      <div className="hidden md:flex size-28 my-3 shrink-0 overflow-hidden relative">
        {imageError ? (
          <div className="size-full flex items-center justify-center bg-background-400/50">
            <Image
              src="/svg/icon_flat_home.png"
              alt={name}
              draggable={false}
              className="size-20 object-contain opacity-30 select-none invert-100 dark:invert-10"
              width={80}
              height={80}
            />
          </div>
        ) : (
          <div className="size-full flex items-center justify-center">
            <Image
              src={image}
              alt={name}
              draggable={false}
              className="size-full object-cover brightness-105 select-none"
              width={80}
              height={80}
              onError={() => setImageError(true)}
            />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex p-3 size-full relative">
        <div className="flex-1">
          {/* Header */}
          <div className="flex mb-3 justify-between">
            <div className="flex items-center gap-2">
              <h3 className="text-sm lg:text-[15px] font-medium truncate capitalize">
                {name}
              </h3>

              <Badge
                variant="outline"
                className={cn(
                  "rounded-sm border-alpha-100 border",
                  isConstruction
                    ? "bg-green-300 dark:bg-green-400 text-green-950"
                    : "bg-blue-200 dark:bg-blue-300 text-blue-950",
                )}
              >
                {isConstruction ? "Construction" : "Upgrade"}
              </Badge>

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

          {/* Resources & Counter */}
          <div className="flex gap-2 justify-between items-stretch min-h-[70px]">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-sm w-60 sm:w-80 content-start">
              {mainResources.map((r) => (
                <ResourceBadge
                  key={r.type}
                  icon={r.icon}
                  value={questsFormatNumber(r.value)}
                  alt={r.type}
                />
              ))}
              {goodsBadges}
            </div>

            <div className="flex items-end">
              <BuildingCounter
                value={quantity}
                onChange={(qty) => onUpdateQuantity(id, qty)}
                min={1}
                max={maxQty}
                disabled={hidden}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Import du store
import { useBuildingsStore } from "@/lib/stores/buildings-store";
import Image from "next/image";
