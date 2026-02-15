"use client";

import React from "react";
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

interface TechDetailsPanelProps {
  tech: TechnoData | null;
  onClose: () => void;
}

export function TechDetailsPanel({ tech, onClose }: TechDetailsPanelProps) {
  const userSelections = useBuildingSelections();

  if (!tech) return null;

  const mainResources = Object.entries(tech.costs || {})
    .filter(([type]) => type !== "goods")
    .map(([type, value]) => ({
      type,
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
    <div className="bg-background-300 border border-border rounded-lg shadow-lg flex flex-col overflow-hidden">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-border bg-background-100">
        <div className="flex items-center justify-between h-12 px-4">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {/* Allied badge (left) */}
            {tech.allied && (
              <Image
                src={getCityCrestIconLocal(tech.allied)}
                className="h-6 w-auto shrink-0"
                width={24}
                height={24}
                alt={tech.allied}
              />
            )}

            {/* Title (center) */}
            <h2 className="text-sm font-semibold truncate flex-1">
              {tech.name}
            </h2>
          </div>

          {/* Close button (right) */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="shrink-0 h-8 w-8"
          >
            <X className="size-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="grid grid-cols-2 gap-1.5 text-sm w-full">
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

        {/* Column info */}
        <div className="pt-2 border-t border-border">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Column Position</span>
            <span className="font-medium">{tech.column + 1}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
