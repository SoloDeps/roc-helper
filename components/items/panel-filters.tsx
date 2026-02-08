"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { buttonVariants } from "@/components/ui/button";
import { useFiltersStore } from "@/lib/stores/filters-store";
import { useBuildingsStore } from "@/lib/stores/buildings-store";
import { useId } from "react";

export function PanelFilters() {
  const hideHiddenId = useId();
  const hideTechnosId = useId();

  // Store
  const filters = useFiltersStore();
  const allBuildings = useBuildingsStore((state) =>
    Array.from(state.buildings.values()),
  );

  // Extract unique values
  const availableTypes = Array.from(
    new Set(allBuildings.map((b) => b.parsed?.tableType).filter(Boolean)),
  ) as ("construction" | "upgrade")[];

  const availableLocations = Array.from(
    new Set(allBuildings.map((b) => b.parsed?.location).filter(Boolean)),
  );

  const locations = ["all", ...availableLocations];
  const types = ["all", ...availableTypes];

  const tableType = filters.tableType || "all";
  const location = filters.location || "all";

  const hasActiveFilters =
    tableType !== "all" ||
    location !== "all" ||
    filters.hideHidden ||
    filters.hideTechnos;

  return (
    <div>
      <div className="w-full flex p-3 gap-6">
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
        <div className="w-56 space-y-4 border-l pl-5">
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
    </div>
  );
}
