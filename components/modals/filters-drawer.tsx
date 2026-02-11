"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { buttonVariants } from "@/components/ui/button";
import { useFiltersStore } from "@/lib/stores/filters-store";
import { useBuildings } from "@/hooks/use-database";
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

  // Extract unique values
  const { availableTypes, availableLocations } = useMemo(() => {
    const types = Array.from(
      new Set(buildings.map((b) => b.type).filter(Boolean)),
    ) as ("construction" | "upgrade")[];

    const locations = Array.from(
      new Set(buildings.map((b) => b.category).filter(Boolean)),
    );

    return {
      availableTypes: types,
      availableLocations: locations,
    };
  }, [buildings]);

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

  // Filter content (shared between desktop and mobile)
  const FilterContent = () => (
    <>
      <div className="w-full flex flex-col md:flex-row p-3 gap-6">
        {/* Left section */}
        <div className="flex-1 space-y-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium">Building Type</h4>
            <div className="flex gap-2">
              {types.map((type) => (
                <Button
                  key={type}
                  variant={tableType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() =>
                    filters.setTableType(
                      type === "all"
                        ? undefined
                        : (type as "construction" | "upgrade"),
                    )
                  }
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

          <div className="space-y-2">
            <h4 className="text-sm font-medium">City</h4>
            <div className="flex flex-wrap gap-2">
              {locations.map((loc) => (
                <Button
                  key={loc}
                  variant={location === loc ? "default" : "outline"}
                  size="sm"
                  onClick={() =>
                    filters.setLocation(loc === "all" ? undefined : loc)
                  }
                >
                  {loc === "all" ? "All" : loc}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Right section */}
        <div className="md:w-56 space-y-4 md:border-l md:pl-5">
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
                  size: "sm",
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
                  size: "sm",
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
                  size: "sm",
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
                  size: "sm",
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
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="flex gap-1.5 items-center py-2 px-3 border-t">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {tableType !== "all" && (
            <Badge variant="secondary" className="rounded-md h-6">
              {tableType === "construction" ? "Construction" : "Upgrade"}
            </Badge>
          )}
          {location !== "all" && (
            <Badge variant="secondary" className="rounded-md h-6">
              {location}
            </Badge>
          )}
          {filters.hideHidden && (
            <Badge variant="secondary" className="rounded-md h-6">
              Hide Hidden
            </Badge>
          )}
          {filters.hideTechnos && (
            <Badge variant="secondary" className="rounded-md h-6">
              Hide Technos
            </Badge>
          )}
          <Button variant="ghost" size="sm" onClick={() => filters.reset()}>
            Clear
          </Button>
        </div>
      )}
    </>
  );

  return (
    <Drawer direction={isDesktop ? "right" : "bottom"}>
      <DrawerTrigger asChild>
        <Button size="sm" variant="outline" className="flex items-center gap-2">
          <Filter className="size-4" />
          Filters
          {activeFiltersCount > 0 && (
            <Badge variant="default" className="h-5 px-1.5 text-xs">
              {activeFiltersCount}
            </Badge>
          )}
        </Button>
      </DrawerTrigger>

      <DrawerContent
        className={
          isDesktop
            ? "w-full max-w-md h-full"
            : "max-h-[85vh]"
        }
      >
        <DrawerHeader className="flex flex-row items-center justify-between border-b pb-4">
          <DrawerTitle>Filters</DrawerTitle>
          <DrawerClose asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </DrawerClose>
        </DrawerHeader>

        <div className="overflow-y-auto flex-1">
          <FilterContent />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
