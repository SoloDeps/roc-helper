"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResourceBadge } from "@/components/items/resource-badge";
import {
  formatNumber,
  getGoodNameFromPriorityEra,
  getItemIconLocal,
  getCityCrestIconLocal,
} from "@/lib/utils";
import type { TechnoData } from "@/types/shared";
import { useBuildingSelections } from "@/hooks/use-building-selections";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { RewardCard } from "@/components/cards/reward-card";

// ============================================================================
// TechDetailsPanel
// ============================================================================

interface TechDetailsPanelProps {
  tech: TechnoData | null;
  onClose: () => void;
}

export function TechDetailsPanel({ tech, onClose }: TechDetailsPanelProps) {
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
    <div className="bg-background-300 border border-border rounded-lg shadow-lg flex flex-col overflow-hidden max-h-[500px]">
      {/* Header */}
      <div className="border-b border-border bg-background-100 shrink-0">
        <div className="flex items-center justify-between h-12 px-4">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {tech.allied && (
              <Image
                src={getCityCrestIconLocal(tech.allied)}
                className="h-6 w-auto shrink-0"
                width={24}
                height={24}
                alt={tech.allied}
                fetchPriority="high"
              />
            )}
            <h2 className="text-sm font-semibold truncate flex-1">
              {tech.name}
            </h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="shrink-0 h-8 w-8"
          >
            <X className="size-4" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex border-t border-border h-10">
          <button
            onClick={() => setTab("costs")}
            className={cn(
              "flex-1 text-[13px] font-medium border-b-2 transition-colors h-full pt-0.5",
              tab === "costs"
                ? "text-foreground border-primary"
                : "text-muted-foreground hover:text-foreground border-transparent",
            )}
          >
            Unlock Costs
          </button>
          <button
            onClick={() => setTab("rewards")}
            disabled={!hasRewards}
            className={cn(
              "flex-1 text-[13px] font-medium border-b-2 transition-colors h-full pt-0.5",
              tab === "rewards"
                ? "text-foreground border-primary"
                : "text-muted-foreground hover:text-foreground border-transparent",
              !hasRewards && "opacity-30 cursor-not-allowed",
            )}
          >
            Rewards
            {hasRewards && (
              <Badge className="ml-1 size-[18px] font-semibold rounded-full">
                {tech.rewards!.length}
              </Badge>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-y-auto p-3 space-y-4 min-h-[190px]">
        {tab === "costs" ? (
          <div className="flex-1 flex flex-col justify-between h-full">
            <div className="grid grid-cols-2 gap-1.5 text-sm size-full">
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

            <div className="pt-2 border-t border-border">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Column Position</span>
                <span className="font-medium">{tech.column + 1}</span>
              </div>
            </div>
          </div>
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
    </div>
  );
}
