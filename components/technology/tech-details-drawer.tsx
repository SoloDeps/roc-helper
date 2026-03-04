"use client";

import React, { useState } from "react";
import { X } from "lucide-react";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { ResourceBadge } from "@/components/items/resource-badge";
import {
  formatNumber,
  getGoodNameFromPriorityEra,
  getItemIconLocal,
  getCityCrestIconLocal,
} from "@/lib/utils";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { TechnoData } from "@/types/shared";
import { useBuildingSelections } from "@/hooks/use-building-selections";
import { RewardCard } from "@/components/cards/reward-card";

interface TechDetailsDrawerProps {
  tech: TechnoData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TechDetailsDrawer({
  tech,
  open,
  onOpenChange,
}: TechDetailsDrawerProps) {
  const userSelections = useBuildingSelections();
  const [tab, setTab] = useState<"costs" | "rewards">("costs");

  if (!tech) return null;

  const hasRewards = tech.rewards && tech.rewards.length > 0;

  const mainResources = Object.entries(tech.costs || {})
    .filter(([type]) => type !== "goods")
    .map(([type, value]) => ({
      resource: type,
      value,
      icon: getItemIconLocal(type),
    }));

  const goodsBadges = (() => {
    const goods = tech.costs.goods;
    if (!goods?.length) return null;

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

  return (
    <Drawer
      open={open}
      onOpenChange={(o) => {
        if (!o) setTab("costs"); // reset tab on close
        onOpenChange(o);
      }}
    >
      <DrawerContent className="h-[50vh] p-0 gap-0 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 z-10 backdrop-blur-sm border-b border-alpha-400 bg-background">
          <div className="flex items-center justify-between h-12 px-4">
            <div className="flex items-center gap-2">
              {tech.allied && (
                <Image
                  src={getCityCrestIconLocal(tech.allied)}
                  className="h-8 w-auto"
                  width={32}
                  height={32}
                  alt={tech.allied}
                />
              )}
              <h2 className="text-base font-semibold truncate flex-1 text-left">
                {tech.name}
              </h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="shrink-0"
            >
              <X className="size-5" />
              <span className="sr-only">Close</span>
            </Button>
          </div>

          {/* Tabs */}
          <div className="flex border-t border-alpha-300">
            <button
              onClick={() => setTab("costs")}
              className={cn(
                "flex-1 text-xs font-medium py-2.5 transition-colors",
                tab === "costs"
                  ? "text-foreground border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              Unlock Costs
            </button>
            <button
              onClick={() => setTab("rewards")}
              disabled={!hasRewards}
              className={cn(
                "flex-1 text-xs font-medium py-2.5 transition-colors",
                tab === "rewards"
                  ? "text-foreground border-b-2 border-primary"
                  : "text-muted-foreground hover:text-foreground",
                !hasRewards && "opacity-30 cursor-not-allowed",
              )}
            >
              Rewards
              {hasRewards && (
                <span className="ml-1 text-[10px] bg-primary/20 text-primary rounded-full px-1.5 py-0.5">
                  {tech.rewards!.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {tab === "costs" ? (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-sm w-full">
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

              <div className="pt-2 border-t border-alpha-300">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Column Position</span>
                  <span className="font-medium">{tech.column + 1}</span>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-2">
              {tech.rewards!.map((reward, i) => (
                <RewardCard
                  key={i}
                  reward={reward}
                  techId={tech.id}
                  userSelections={userSelections}
                />
              ))}
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
