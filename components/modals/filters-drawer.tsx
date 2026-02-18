"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { buttonVariants } from "@/components/ui/button";
import { useFiltersStore } from "@/lib/stores/filters-store";
import {
  useBuildings,
  useOttomanAreas,
  useOttomanTradePosts,
} from "@/hooks/use-database";
import { useId, useMemo } from "react";
import { Filter, X } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";

export function FiltersDrawer() {
  const hideHiddenId = useId();
  const hideTechnosId = useId();
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Store
  const filters = useFiltersStore();
  const buildings = useBuildings() ?? [];
  const areas = useOttomanAreas() ?? [];
  const tradePosts = useOttomanTradePosts() ?? [];

  // Extract unique values
  const { availableTypes, availableLocations } = useMemo(() => {
    const types = Array.from(
      new Set(buildings.map((b) => b.resource).filter(Boolean)),
    ) as ("construction" | "upgrade")[];

    const locations = Array.from(
      new Set(buildings.map((b) => b.category).filter(Boolean)),
    );

    // Add "ottoman" if there are areas or trade posts
    if (
      (areas.length > 0 || tradePosts.length > 0) &&
      !locations.includes("ottoman")
    ) {
      locations.push("ottoman");
    }

    return {
      availableTypes: types,
      availableLocations: locations,
    };
  }, [buildings, areas, tradePosts]);

  const locations = ["all", ...availableLocations];
  const types = ["all", ...availableTypes];

  const tableType = filters.tableType || "all";
  const location = filters.location || "all";

  const hasActiveFilters =
    tableType !== "all" ||
    location !== "all" ||
    filters.hideHidden ||
    filters.hideTechnos;

  // Count active filters
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (tableType !== "all") count++;
    if (location !== "all") count++;
    if (filters.hideHidden) count++;
    if (filters.hideTechnos) count++;
    return count;
  }, [tableType, location, filters.hideHidden, filters.hideTechnos]);

  // Active filters component
  const ActiveFilters = ({ className = "" }: { className?: string }) => {
    if (!hasActiveFilters) return null;

    const badgeSize = isDesktop ? "sm" : "default";

    return (
      <div className={`flex flex-col gap-2 ${className}`}>
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          <Button
            variant="ghost"
            size={isDesktop ? "sm" : "default"}
            onClick={() => filters.reset()}
          >
            Clear all
          </Button>
        </div>
        <div className="flex gap-2 overflow-x-auto snap-x snap-mandatory md:flex-wrap md:overflow-visible">
          {tableType !== "all" && (
            <Badge
              variant="secondary"
              className={`rounded-md flex items-center gap-1.5 shrink-0 snap-start capitalize ${
                badgeSize === "sm" ? "h-6 px-2 text-xs" : "h-7 px-2"
              }`}
            >
              {tableType === "construction" ? "Construction" : "Upgrade"}
              <button
                onClick={() => filters.setTableType(undefined)}
                className="hover:bg-muted rounded-sm p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {location !== "all" && (
            <Badge
              variant="secondary"
              className={`rounded-md flex items-center gap-1.5 shrink-0 snap-start capitalize ${
                badgeSize === "sm" ? "h-6 px-2 text-xs" : "h-7 px-2"
              }`}
            >
              {location}
              <button
                onClick={() => filters.setLocation(undefined)}
                className="hover:bg-muted rounded-sm p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.hideHidden && (
            <Badge
              variant="secondary"
              className={`rounded-md flex items-center gap-1.5 shrink-0 snap-start ${
                badgeSize === "sm" ? "h-6 px-2 text-xs" : "h-7 px-2"
              }`}
            >
              Hide Hidden
              <button
                onClick={() => filters.setHideHidden(false)}
                className="hover:bg-muted rounded-sm p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
          {filters.hideTechnos && (
            <Badge
              variant="secondary"
              className={`rounded-md flex items-center gap-1.5 shrink-0 snap-start ${
                badgeSize === "sm" ? "h-6 px-2 text-xs" : "h-7 px-2"
              }`}
            >
              Hide Technos
              <button
                onClick={() => filters.setHideTechnos(false)}
                className="hover:bg-muted rounded-sm p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          )}
        </div>
      </div>
    );
  };

  // Filter content (vertical layout)
  const FilterContent = () => {
    const buttonSize = isDesktop ? "sm" : "default";

    return (
      <>
        {/* Active Filters - Top on mobile/drawer, bottom on desktop */}
        {!isDesktop && hasActiveFilters && (
          <div className="p-4 border-b">
            <ActiveFilters />
          </div>
        )}

        <div className="w-full flex flex-col px-4 pt-4 pb-10 md:py-4 gap-6">
          {/* Building Type */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Building Type</h4>
            <div className="flex gap-2">
              {types.map((type) => (
                <Button
                  key={type}
                  variant={tableType === type ? "default" : "outline"}
                  size={buttonSize}
                  onClick={() =>
                    filters.setTableType(
                      type === "all"
                        ? undefined
                        : (type as "construction" | "upgrade"),
                    )
                  }
                  className="capitalize"
                >
                  {type === "all"
                    ? "All"
                    : type === "construction"
                      ? "Construction"
                      : "Upgrade"}
                </Button>
              ))}
            </div>
          </div>

          {/* City */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">City</h4>
            <div className="flex flex-wrap gap-2">
              {locations.map((loc) => (
                <Button
                  key={loc}
                  variant={location === loc ? "default" : "outline"}
                  size={buttonSize}
                  onClick={() =>
                    filters.setLocation(loc === "all" ? undefined : loc)
                  }
                  className="capitalize"
                >
                  {loc === "all" ? "All" : loc}
                </Button>
              ))}
            </div>
          </div>

          {/* Hide "hidden" cards */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">
              Hide &quot;hidden&quot; cards
            </h4>
            <RadioGroup
              value={filters.hideHidden.toString()}
              onValueChange={(value) => filters.setHideHidden(value === "true")}
              className="flex gap-2"
            >
              <label
                className={buttonVariants({
                  variant: !filters.hideHidden ? "default" : "outline",
                  size: buttonSize,
                })}
              >
                <RadioGroupItem
                  id={`${hideHiddenId}-off`}
                  value="false"
                  className="sr-only after:absolute after:inset-0"
                />
                <span className="text-sm font-medium">Off</span>
              </label>

              <label
                className={buttonVariants({
                  variant: filters.hideHidden ? "default" : "outline",
                  size: buttonSize,
                })}
              >
                <RadioGroupItem
                  id={`${hideHiddenId}-on`}
                  value="true"
                  className="sr-only after:absolute after:inset-0"
                />
                <span className="text-sm font-medium">On</span>
              </label>
            </RadioGroup>
          </div>

          {/* Hide "Technologies" */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium">
              Hide &quot;Technologies&quot;
            </h4>
            <RadioGroup
              value={filters.hideTechnos.toString()}
              onValueChange={(value) =>
                filters.setHideTechnos(value === "true")
              }
              className="flex gap-2"
            >
              <label
                className={buttonVariants({
                  variant: !filters.hideTechnos ? "default" : "outline",
                  size: buttonSize,
                })}
              >
                <RadioGroupItem
                  id={`${hideTechnosId}-off`}
                  value="false"
                  className="sr-only after:absolute after:inset-0"
                />
                <span className="text-sm font-medium">Off</span>
              </label>

              <label
                className={buttonVariants({
                  variant: filters.hideTechnos ? "default" : "outline",
                  size: buttonSize,
                })}
              >
                <RadioGroupItem
                  id={`${hideTechnosId}-on`}
                  value="true"
                  className="sr-only after:absolute after:inset-0"
                />
                <span className="text-sm font-medium">On</span>
              </label>
            </RadioGroup>
          </div>
        </div>

        {/* Active Filters - Bottom on desktop */}
        {isDesktop && hasActiveFilters && (
          <div className="p-4 border-t mt-auto">
            <ActiveFilters />
          </div>
        )}
      </>
    );
  };

  return (
    <Drawer direction={isDesktop ? "right" : "bottom"}>
      <DrawerTrigger asChild>
        <Button size="sm" variant="outline" className="flex items-center gap-2">
          <Filter className="size-4" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge variant="default" className="size-5 px-1 text-[13px]">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </DrawerTrigger>

      <DrawerContent
        className={isDesktop ? "w-full max-w-md h-full" : "max-h-[85vh]"}
      >
        {/* Header compact comme total-drawer */}
        <DrawerHeader className="border-b py-3 px-4 shrink-0">
          <div className="w-full max-w-[870px] mx-auto">
            <div className="flex justify-between items-center h-5">
              <DrawerTitle className="text-left text-base">Filters</DrawerTitle>
              <DrawerClose asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </DrawerClose>
            </div>
          </div>
        </DrawerHeader>

        <div className="overflow-y-auto flex-1 flex flex-col">
          <FilterContent />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
