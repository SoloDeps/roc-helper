"use client";

import React, { memo } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { FALLBACK_IMAGE, type BuildingItem } from "@/data/building-catalog";

/**
 * Optimized Building Card Component
 * Memoized to prevent unnecessary re-renders
 */
interface BuildingCardProps {
  item: BuildingItem;
  onClick: () => void;
  priority?: boolean;
}

export const BuildingCard = memo<BuildingCardProps>(
  ({ item, onClick, priority = false }) => {
    const [imageError, setImageError] = React.useState(false);

    return (
      <button
        onClick={onClick}
        className={cn(
          "group relative overflow-hidden rounded-lg border border-alpha-400",
          "bg-background-300 shadow-xs transition-all duration-200",
          "hover:shadow-md hover:border-alpha-500 active:scale-[0.98]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        )}
      >
        {/* Image Container */}
        <div className="aspect-[3/2] relative overflow-hidden bg-background-200">
          <Image
            src={imageError ? FALLBACK_IMAGE : item.imageUrl}
            alt={item.name}
            className="size-full object-contain p-1.5 transition-transform duration-200 group-hover:scale-105"
            onError={() => setImageError(true)}
            width={300}
            height={200}
            priority={priority}
            sizes="(max-width: 768px) 33vw, 25vw"
          />
        </div>

        {/* Title */}
        <div className="p-2.5 text-center border-t border-alpha-400">
          <h3 className="font-medium text-sm line-clamp-1">{item.name}</h3>
          {item.metadata?.tier && (
            <p className="text-xs text-muted-foreground mt-0.5 capitalize">
              {item.metadata.tier}
            </p>
          )}
        </div>
      </button>
    );
  }
);

BuildingCard.displayName = "BuildingCard";

/**
 * Grid Layout for Building Cards
 * Responsive grid with proper spacing
 */
interface BuildingGridProps {
  items: BuildingItem[];
  onSelect: (itemId: string) => void;
  columns?: "2" | "3" | "4";
  priorityCount?: number;
}

export const BuildingGrid = memo<BuildingGridProps>(
  ({ items, onSelect, columns = "3", priorityCount = 0 }) => {
    const gridClass = {
      "2": "grid-cols-2",
      "3": "grid-cols-3 md:grid-cols-4",
      "4": "grid-cols-3 md:grid-cols-4",
    }[columns];

    return (
      <div className={cn("grid gap-2.5", gridClass)}>
        {items.map((item, index) => (
          <BuildingCard
            key={item.id}
            item={item}
            onClick={() => onSelect(item.id)}
            priority={index < priorityCount}
          />
        ))}
      </div>
    );
  }
);

BuildingGrid.displayName = "BuildingGrid";

/**
 * Step Header with Title and Description
 */
interface StepHeaderProps {
  title: string;
  description: string;
}

export const StepHeader = memo<StepHeaderProps>(({ title, description }) => (
  <div className="mb-4">
    <h2 className="text-base font-semibold mb-0.5">{title}</h2>
    <p className="text-xs text-muted-foreground">{description}</p>
  </div>
));

StepHeader.displayName = "StepHeader";

/**
 * Breadcrumb Trail
 */
interface BreadcrumbProps {
  trail: Array<{ id: string; name: string }>;
  onClick?: (id: string, index: number) => void;
}

export const Breadcrumb = memo<BreadcrumbProps>(({ trail, onClick }) => {
  if (trail.length === 0) return null;

  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground overflow-x-auto">
      {trail.map((item, index) => (
        <React.Fragment key={item.id}>
          {index > 0 && <span className="shrink-0">›</span>}
          <button
            onClick={() => onClick?.(item.id, index)}
            className={cn(
              "shrink-0 hover:text-foreground transition-colors",
              index === trail.length - 1 && "text-foreground font-medium"
            )}
          >
            {item.name}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
});

Breadcrumb.displayName = "Breadcrumb";
