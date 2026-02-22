"use client";

import React from "react";
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
import type { TechnoData } from "@/types/shared";
import { useBuildingSelections } from "@/hooks/use-building-selections";
import Image from "next/image";

interface TechDetailsModalProps {
  tech: TechnoData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function TechDetailsModal({
  tech,
  open,
  onOpenChange,
}: TechDetailsModalProps) {
  const userSelections = useBuildingSelections();

  if (!tech) return null;

  const mainResources = Object.entries(tech.costs || {})
    .filter(([type]) => type !== "goods")
    .map(([type, value]) => ({
      resource: type, //  Changed from 'type' to 'resource' for consistency
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
        //  Use resolved name if found, otherwise fallback to "default"
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
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="p-0 gap-0 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 z-10 backdrop-blur-sm border-b border-alpha-400 bg-background">
          <div className="flex items-center justify-between h-12 px-4">
            <div className="flex items-center gap-2">
              {/* Allied badge (left) */}
              {tech.allied && (
                <Image
                  src={getCityCrestIconLocal(tech.allied)}
                  className="h-8 w-auto"
                  width={32}
                  height={32}
                  alt={tech.allied}
                />
              )}

              {/* Title (center) */}
              <h2 className="text-base font-semibold truncate flex-1 text-left">
                {tech.name}
              </h2>
            </div>

            {/* Close button (right) */}
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
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
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

          {/* Column info */}
          <div className="pt-2 border-t border-alpha-300">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Column Position</span>
              <span className="font-medium">{tech.column + 1}</span>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
