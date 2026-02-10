"use client";

import React, { memo } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  getImageForItem,
  FALLBACK_IMAGE,
  type NavigableItem,
} from "@/lib/catalog";

/**
 * Horizontal card component (ElementCard)
 */
interface ElementCardProps {
  item: NavigableItem;
  onClick: () => void;
  priority?: boolean;
}

export const ElementCard = memo<ElementCardProps>(
  ({ item, onClick, priority = false }) => {
    // Gérer l'image pour NavigableItem (peut avoir imgType ou image)
    const imageUrl =
      item.image ||
      (item.imgType
        ? getImageForItem({ imgType: item.imgType })
        : FALLBACK_IMAGE);

    const inverted = item?.invertColor ?? true;

    return (
      <Button
        variant="outline"
        onClick={onClick}
        className="size-full text-left flex items-center gap-2 h-16 px-3"
      >
        <Image
          src={imageUrl}
          alt={item.name}
          width={48}
          height={48}
          sizes="48px"
          priority={priority}
          unoptimized
          className={`object-contain size-10 md:size-11 select-none ${
            inverted ? "opacity-70 invert-100 dark:invert-0" : ""
          }`}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (target.src !== FALLBACK_IMAGE) {
              target.src = FALLBACK_IMAGE;
            }
          }}
        />

        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm truncate">{item.name}</h3>
        </div>

        {/* <ChevronRight className="size-5 hidden md:block text-muted-foreground shrink-0" /> */}
      </Button>
    );
  },
);

ElementCard.displayName = "ElementCard";

/**
 * Grid layout for element cards
 */
interface ElementGridProps {
  items: NavigableItem[];
  onSelect: (itemId: string) => void;
  columns?: number;
  priorityCount?: number;
}

export const ElementGrid = memo<ElementGridProps>(
  ({ items, onSelect, columns = 2, priorityCount = 0 }) => {
    const gridColsClass =
      {
        1: "grid-cols-1",
        2: "grid-cols-2",
        3: "grid-cols-3",
        4: "grid-cols-4",
        5: "grid-cols-5",
        6: "grid-cols-6",
      }[columns] || "grid-cols-2";

    return (
      <div className={`grid ${gridColsClass} gap-2`}>
        {items.map((item, index) => (
          <ElementCard
            key={item.id}
            item={item}
            onClick={() => onSelect(item.id)}
            priority={index < priorityCount}
          />
        ))}
      </div>
    );
  },
);

ElementGrid.displayName = "ElementGrid";
