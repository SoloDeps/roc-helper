"use client";

import { useState } from "react";

export interface BuildingFilters {
  tableType?: string;
  location?: string;
  hideHidden?: boolean;
  hideTechnos?: boolean;
}

export function useBuildingFilters() {
  const [filters, setFilters] = useState<BuildingFilters>({});

  // ✅ Pas de useCallback grâce à React Compiler
  const updateFilters = (newFilters: Partial<BuildingFilters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters({});
  };

  const activeCount =
    (filters.tableType ? 1 : 0) +
    (filters.location ? 1 : 0) +
    (filters.hideHidden ? 1 : 0) +
    (filters.hideTechnos ? 1 : 0);

  return {
    filters,
    updateFilters,
    resetFilters,
    activeCount,
  };
}
