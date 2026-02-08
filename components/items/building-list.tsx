"use client";

import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useBuildingsStore } from "@/lib/stores/buildings-store";
import { useFiltersStore } from "@/lib/stores/filters-store";
import { BuildingCard } from "@/components/cards/building-card";
import { EmptyOutline } from "@/components/cards/empty-card";

interface BuildingListProps {
  userSelections: string[][];
}

export function BuildingsList({ userSelections }: BuildingListProps) {
  const parentRef = useRef<HTMLDivElement>(null);

  // Store selectors
  const allBuildings = useBuildingsStore((state) =>
    Array.from(state.buildings.values()),
  );
  const removeBuilding = useBuildingsStore((state) => state.removeBuilding);
  const updateQuantity = useBuildingsStore((state) => state.updateQuantity);
  const toggleHidden = useBuildingsStore((state) => state.toggleHidden);

  // Filters
  const filters = useFiltersStore();

  // Filtrer les buildings
  const filteredBuildings = allBuildings.filter((building) => {
    if (filters.hideHidden && building.hidden) return false;
    if (filters.tableType && building.parsed?.tableType !== filters.tableType)
      return false;
    if (filters.location && building.parsed?.location !== filters.location)
      return false;
    return true;
  });

  // Virtualizer
  const virtualizer = useVirtualizer({
    count: filteredBuildings.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 128,
    overscan: 5,
  });

  if (filteredBuildings.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <EmptyOutline perso="male" type="building" />
      </div>
    );
  }

  return (
    <div ref={parentRef} className="h-full overflow-auto">
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: "100%",
          position: "relative",
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => {
          const building = filteredBuildings[virtualItem.index];

          return (
            <div
              key={building.id}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: `${virtualItem.size}px`,
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <BuildingCard
                buildingId={building.id}
                userSelections={userSelections}
                onRemove={removeBuilding}
                onUpdateQuantity={updateQuantity}
                onToggleHidden={toggleHidden}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
