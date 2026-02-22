"use client";

import { useState, useMemo } from "react";
import { X, EyeOff, Eye, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ResourceBadge } from "@/components/items/resource-badge";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { cn, withBase } from "@/lib/utils";
import {
  formatNumber,
  getGoodNameFromPriorityEra,
  getItemIconLocal,
} from "@/lib/utils";
import type { HydratedOttomanTradePost } from "@/lib/db/data-hydration";
import Image from "next/image";

interface TradePostCardProps {
  tradePost: HydratedOttomanTradePost;
  userSelections: string[][];
  onRemove: (id: string) => void;
  onToggleHidden: (id: string) => void;
  onToggleLevel: (
    id: string,
    level: keyof HydratedOttomanTradePost["levels"],
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
  const [drawerOpen, setDrawerOpen] = useState(false);

  const { id, name, area, resource, levels, costs, hidden, sourceData } =
    tradePost;

  //  Use new structure: costs.resources
  const mainResources = Object.entries(costs.resources || {}).map(
    ([resource, value]) => ({
      resource,
      value,
      icon: getItemIconLocal(resource),
    }),
  );

  //  Use new structure: costs.goods
  const goodsBadges = (() => {
    const goods = costs.goods;
    if (!goods?.length) return [];

    return goods.map((g, i) => {
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
          key={`${g.resource}-${i}`}
          icon={getItemIconLocal(goodName)}
          value={formatNumber(g.amount)}
          alt={g.resource}
        />
      );
    });
  })();

  const resourceIcon = getItemIconLocal(resource);

  const levelButtons = useMemo(() => {
    const buttons = [
      { key: "unlock" as const, label: "Unlock", number: 1 },
      { key: "lvl2" as const, label: "Lvl 2", number: 2 },
      { key: "lvl3" as const, label: "Lvl 3", number: 3 },
      { key: "lvl4" as const, label: "Lvl 4", number: 4 },
      { key: "lvl5" as const, label: "Lvl 5", number: 5 },
    ];

    const hasUnlockData = (sourceData?.levels?.[1]?.length ?? 0) > 0;

    if (!hasUnlockData) {
      return buttons.slice(1);
    }

    return buttons;
  }, [sourceData]);

  // Calculate selected levels for mobile button display
  const selectedLevels = useMemo(() => {
    return levelButtons
      .filter(({ key }) => levels[key])
      .map(({ number }) => number)
      .join(", ");
  }, [levelButtons, levels]);

  const hasSelectedLevels = levelButtons.some(({ key }) => levels[key]);

  return (
    <div
      className="group relative flex flex-col gap-2 rounded-sm bg-background-300 border min-h-32"
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

      {/* Content - relative pour être au-dessus de l'overlay */}
      <div className="flex p-3 pb-2 gap-2 lg:gap-4 size-full relative">
        <div className="flex-1">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <Image
                src={withBase(resourceIcon)}
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

              {/* Hide/Show button - visible on hover (desktop) or always (mobile) - DESKTOP ONLY */}
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

          <div
            className={cn(
              "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1.5 text-sm w-full",
              hidden && "opacity-60 pointer-events-none select-none",
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
        </div>
      </div>

      {/* DESKTOP: Level buttons inline */}
      <div
        className={cn("hidden md:flex gap-2 px-3 pb-3", hidden && "opacity-50")}
      >
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

      {/* MOBILE: Hide button + Drawer button */}
      <div className="flex justify-between items-center md:hidden gap-2 px-3 pb-3">
        {/* Hide/Show button */}
        <Button
          variant="outline"
          className={cn(!hidden && "text-muted-foreground border-transparent")}
          onClick={() => onToggleHidden(id)}
          title={
            hidden
              ? "Include in total calculation"
              : "Exclude from total calculation"
          }
        >
          {hidden ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
          <span>{hidden ? "Show" : "Hide"}</span>
        </Button>

        {/* Levels Drawer Trigger */}
        <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
          <DrawerTrigger asChild>
            <Button
              variant="outline"
              disabled={hidden}
              className="gap-2.5 justify-between"
            >
              <span className="truncate">
                {hasSelectedLevels ? "Selected Lvl:" : "Select levels"}
              </span>
              <span>{selectedLevels}</span>
              <Edit2 className="size-3.5 shrink-0" />
            </Button>
          </DrawerTrigger>

          <DrawerContent className="h-[50vh] p-0">
            <DrawerHeader className="border-b border-alpha-400 py-1.5 px-4 text-left!">
              <div className="flex justify-between items-start">
                <div className="flex flex-col text-left">
                  <DrawerTitle className="text-base">Select Levels</DrawerTitle>
                  <p className="text-[13px] text-muted-foreground">
                    Check boxes to mark as completed or hidden
                  </p>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setDrawerOpen(false)}
                  className="rounded-full"
                >
                  <X className="size-5" />
                  <span className="sr-only">Close</span>
                </Button>
              </div>
            </DrawerHeader>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-2">
                {levelButtons.map(({ key, label }) => {
                  const isSelected = levels[key];

                  return (
                    <div
                      key={key}
                      className={cn(
                        "flex items-center gap-3 p-3 rounded-sm border cursor-pointer transition-all",
                        "hover:bg-accent/70 bg-background-100 border-alpha-300",
                      )}
                      onClick={() => onToggleLevel(id, key)}
                    >
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => onToggleLevel(id, key)}
                        className="data-[state=checked]:border-blue-600 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white dark:data-[state=checked]:border-blue-700 dark:data-[state=checked]:bg-blue-800"
                      />
                      <span className="text-sm font-medium">{label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
}
