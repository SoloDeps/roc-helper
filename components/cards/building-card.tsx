"use client";

import { useState } from "react";
import Image from "next/image";
import { X, EyeOff, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ResourceBadge } from "@/components/items/resource-badge";
import BuildingCounter from "@/components/items/building-counter";
import { cn, getWikiImageUrl, withBase } from "@/lib/utils";
import {
  getItemIconLocal,
  formatNumber,
  getGoodNameFromPriorityEra,
} from "@/lib/utils";
import { useBuilding } from "@/hooks/use-database";
import { useMediaQuery } from "@/hooks/use-media-query";
import type { HydratedBuilding } from "@/lib/db/data-hydration";

interface BuildingCardProps {
  buildingId?: string;
  building?: HydratedBuilding;
  userSelections: string[][];
  onRemove: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onToggleHidden: (id: string) => void;
}

export function BuildingCard({
  buildingId,
  building: buildingProp,
  userSelections,
  onRemove,
  onUpdateQuantity,
  onToggleHidden,
}: BuildingCardProps) {
  const isMobile = useMediaQuery("(max-width: 767px)");
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);

  //  Use provided building OR fetch from Dexie
  const fetchedBuilding = useBuilding(buildingProp ? undefined : buildingId);
  const building = buildingProp || fetchedBuilding;

  if (!building) return null;

  const {
    id,
    name,
    imageName,
    imgLvl,
    costs,
    quantity,
    maxQty,
    type,
    level,
    hidden,
  } = building;

  //  CALCULATE qty × costs HERE IN THE CARD (with new structure)
  const mainResources = Object.entries(costs.resources || {}).map(
    ([resourceType, unitValue]) => ({
      resource: resourceType,
      value: unitValue * quantity,
      icon: getItemIconLocal(resourceType),
    }),
  );

  const goodsBadges = (() => {
    const goods = costs.goods;
    if (!goods?.length) return null;

    return goods.map((g) => {
      const match = g.resource.match(
        /^(Primary|Secondary|Tertiary)_([A-Z]{2})$/i,
      );
      let goodName = g.resource;

      if (match) {
        const [, priority, era] = match;
        const resolvedName = getGoodNameFromPriorityEra(
          priority,
          era,
          userSelections,
        );
        goodName = resolvedName || "default";
      }

      return (
        <ResourceBadge
          key={`${g.resource}-${quantity}`}
          icon={getItemIconLocal(goodName)}
          value={formatNumber(g.amount * quantity)}
          alt={g.resource}
        />
      );
    });
  })();

  const isConstruction = type === "construction";

  return (
    <div
      className={cn(
        "group flex justify-center rounded-sm bg-background-300 border min-h-32 pl-1 relative",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Hidden overlay - z-0 pour rester en arrière-plan */}
      {hidden && (
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

      {/* Image */}
      <div className="hidden md:flex size-28 my-3 shrink-0 overflow-hidden relative">
        {imageError ? (
          <div className="size-full flex items-center justify-center bg-background-400/50">
            <Image
              src={withBase("/svg/icon_flat_home.png")}
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
              src={getWikiImageUrl(imageName, imgLvl, level)}
              alt={name}
              draggable={false}
              className="size-full object-cover brightness-105 select-none"
              width={200}
              height={200}
              priority={true}
              onError={() => setImageError(true)}
            />
          </div>
        )}
      </div>

      {/* Content - relative pour être au-dessus de l'overlay */}
      <div className="flex px-2 py-3 md:px-3 size-full relative">
        <div className="flex-1">
          {/* Header */}
          <div className="flex mb-3 justify-between">
            <div className="flex items-center gap-2">
              <h3
                className={cn(
                  "text-sm lg:text-[15px] font-medium max-sm:max-w-44 truncate capitalize",
                  hidden && "opacity-50",
                )}
              >
                {name}
                {level && <span> – Lvl {level}</span>}
              </h3>

              <div className={hidden ? "opacity-50" : ""}>
                <Badge
                  variant="outline"
                  className={cn(
                    "rounded-sm border-alpha-100 border shrink-0",
                    isConstruction ? "construction-badge" : "upgrade-badge",
                  )}
                >
                  {isConstruction ? "Construction" : "Upgrade"}
                </Badge>
              </div>

              {/* Hide/Show button - visible on hover (desktop) or always (mobile) */}
              <div
                className={cn(
                  "transition-opacity duration-200 hidden md:block",
                  hidden || isHovered
                    ? "opacity-100"
                    : "opacity-0 pointer-events-none",
                )}
              >
                <Button
                  size="sm"
                  variant={hidden ? "outline" : "ghost"}
                  className="rounded-sm h-6 w-20"
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
                  <span>{hidden ? "Show" : "Hide"}</span>
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
          <div className="flex flex-col md:flex-row w-full gap-2 justify-between items-stretch min-h-[70px]">
            <div
              className={cn(
                "grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-sm w-full content-start",
                hidden && "opacity-60 pointer-events-none select-none",
              )}
            >
              {mainResources.map((r) => (
                <ResourceBadge
                  key={r.resource}
                  icon={r.icon}
                  value={formatNumber(r.value)}
                  alt={r.resource}
                />
              ))}
              {goodsBadges}
            </div>

            {/* Desktop: Counter only */}
            <div className="hidden md:flex justify-end items-end">
              <BuildingCounter
                value={quantity}
                onChange={(qty) => onUpdateQuantity(id, qty)}
                min={1}
                max={maxQty}
                disabled={hidden}
              />
            </div>

            {/* Mobile: Hide button + Counter */}
            <div className="flex md:hidden justify-between items-end gap-2">
              <Button
                variant={hidden ? "outline" : "ghost"}
                className={cn(
                  "rounded-sm h-[34px]",
                  !hidden && "text-muted-foreground border-transparent",
                )}
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
                <span>{hidden ? "Show" : "Hide"}</span>
              </Button>

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
