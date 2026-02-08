"use client";

import {
  useState,
  useCallback,
  useEffect,
  useDeferredValue,
  useMemo,
} from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter } from "lucide-react";
import BuildingFilters from "../items/panel-filters";
import {
  useBuildingFilters,
  type BuildingFilters as BuildingFiltersType,
} from "@/hooks/use-building-filters";
import { watchBuildings, watchTechnos } from "@/lib/overview/storage";

interface ButtonFilterProps {
  onFiltersChange: (filters: BuildingFiltersType) => void;
  initialFilters?: BuildingFiltersType;
}

export function ButtonFilter({
  onFiltersChange,
  initialFilters = {},
}: ButtonFilterProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<BuildingFiltersType>(initialFilters);
  const [availableLocations, setAvailableLocations] = useState<string[]>([]);
  const [availableTypes, setAvailableTypes] = useState<
    ("construction" | "upgrade")[]
  >([]);

  const deferredFilters = useDeferredValue(filters);
  const { getAvailableData } = useBuildingFilters();

  const handleFilterChange = useCallback(
    (newFilters: BuildingFiltersType) => {
      setFilters(newFilters);
      onFiltersChange(newFilters);
    },
    [onFiltersChange],
  );

  // ✅ Watcher en temps réel pour buildings et technos
  useEffect(() => {
    const unsubscribeBuildings = watchBuildings((buildings) => {
      const availableData = getAvailableData({ buildings }, deferredFilters);
      setAvailableLocations(availableData.locations);
      setAvailableTypes(availableData.types);
    });

    const unsubscribeTechnos = watchTechnos((technos) => {
      // Si on a des technos, on peut aussi extraire leurs locations
      // pour les afficher dans les filtres si nécessaire
    });

    return () => {
      unsubscribeBuildings();
      unsubscribeTechnos();
    };
  }, [getAvailableData, deferredFilters]);

  // ✅ Compteur de filtres actifs INCLUANT hideHidden et hideTechnos
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (deferredFilters.tableType) count++;
    if (deferredFilters.location) count++;
    if (deferredFilters.hideHidden) count++;
    if (deferredFilters.hideTechnos) count++;
    return count;
  }, [deferredFilters]);

  return {
    button: (
      <Button
        size="sm"
        variant="outline"
        onClick={() => setShowFilters(!showFilters)}
        className="flex items-center gap-2"
      >
        <Filter className="size-4" />
        Filters
        {activeFiltersCount > 0 && (
          <Badge variant="default" className="h-5 px-1.5 text-xs">
            {activeFiltersCount}
          </Badge>
        )}
      </Button>
    ),
    panel: showFilters ? (
      <div className="border-b border-alpha-200">
        <BuildingFilters
          onFilterChange={handleFilterChange}
          availableLocations={availableLocations}
          availableTypes={availableTypes}
          currentFilters={deferredFilters}
        />
      </div>
    ) : null,
  };
}
