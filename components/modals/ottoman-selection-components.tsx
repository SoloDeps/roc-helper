"use client";

import { memo, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, MapPin, Store } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  useAddElementStore,
  useOttomanSelection,
} from "@/lib/stores/add-element-store";
import {
  useSubmitOttomanAreas,
  useSubmitOttomanTradePosts,
} from "@/lib/stores/add-element-submission-hooks";
import {
  getAvailableAreas,
  getAllTradePosts,
  hasAreaData,
} from "@/lib/ottoman-data-loader";
import { trade_post_table } from "@/data/allieds/ottoman";
import { useOttomanAreas, useOttomanTradePosts } from "@/hooks/use-database";

// ============================================================================
// OTTOMAN AREAS SELECTION
// ============================================================================

interface OttomanAreasSelectionProps {
  onSubmit?: () => void;
}

export const OttomanAreasSelection = memo<OttomanAreasSelectionProps>(
  ({ onSubmit }) => {
    const { toggleOttomanArea } = useAddElementStore();
    const { selectedAreas } = useOttomanSelection();
    const { submit, isLoading } = useSubmitOttomanAreas();

    // Get already added areas from DB (useLiveQuery returns data directly)
    const existingAreas = useOttomanAreas();
    const existingAreaIndices = useMemo(
      () => new Set((existingAreas || []).map((a) => a.areaIndex)),
      [existingAreas],
    );

    // Get available areas (filter out already added ones)
    const availableAreas = useMemo(() => {
      const all = getAvailableAreas();
      return all.filter(
        (idx) => !existingAreaIndices.has(idx) && hasAreaData(idx),
      );
    }, [existingAreaIndices]);

    const handleSubmit = useCallback(async () => {
      await submit();
      onSubmit?.();
    }, [submit, onSubmit]);

    const allSelected =
      availableAreas.length > 0 &&
      availableAreas.every((idx) => selectedAreas.has(idx));

    const handleSelectAll = useCallback(() => {
      if (allSelected) {
        availableAreas.forEach((idx) => {
          if (selectedAreas.has(idx)) toggleOttomanArea(idx);
        });
      } else {
        availableAreas.forEach((idx) => {
          if (!selectedAreas.has(idx)) toggleOttomanArea(idx);
        });
      }
    }, [allSelected, availableAreas, selectedAreas, toggleOttomanArea]);

    const hasSelection = selectedAreas.size > 0;

    if (availableAreas.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <MapPin className="size-12 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">
            All areas have been added
          </h3>
          <p className="text-sm text-muted-foreground">
            You&apos;ve already added all available Ottoman areas to your list.
          </p>
        </div>
      );
    }

    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto pb-24 md:pb-4">
          <div className="space-y-2 pb-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                {selectedAreas.size} / {availableAreas.length} selected
              </p>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleSelectAll}
                className="h-7 text-sm"
              >
                {allSelected ? "Deselect all" : "Select all"}
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {availableAreas.map((areaIndex) => {
                const isSelected = selectedAreas.has(areaIndex);
                const areaNames = trade_post_table
                  .filter((tp) => tp.area === areaIndex)
                  .map((tp) => tp.name.replace(/ (Village|City)$/, ""))
                  .join(", ");

                return (
                  <div
                    key={areaIndex}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-sm border cursor-pointer transition-all",
                      "hover:bg-accent/70",
                      isSelected
                        ? "bg-primary/10 border-primary"
                        : "bg-background-100 border-alpha-300",
                    )}
                    onClick={() => toggleOttomanArea(areaIndex)}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleOttomanArea(areaIndex)}
                      className={cn(
                        "data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-white",
                      )}
                    />
                    <MapPin className="size-4 text-muted-foreground shrink-0" />
                    <div className="flex flex-col leading-tight">
                      <span className="text-sm font-medium">
                        Area {areaIndex}
                      </span>
                      {areaNames && (
                        <span className="text-[13px] font-medium text-muted-foreground">
                          {areaNames}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Floating Add Button */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t md:relative md:border-t-0 md:p-0 md:mt-4">
          <Button
            size="lg"
            variant="default"
            onClick={handleSubmit}
            disabled={!hasSelection || isLoading}
            className="w-full text-base"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 mr-2 animate-spin" />
                Adding...
              </>
            ) : (
              `Add ${selectedAreas.size} ${selectedAreas.size === 1 ? "area" : "areas"}`
            )}
          </Button>
        </div>
      </div>
    );
  },
);

OttomanAreasSelection.displayName = "OttomanAreasSelection";

// ============================================================================
// OTTOMAN TRADE POSTS SELECTION
// ============================================================================

interface OttomanTradePostsSelectionProps {
  onSubmit?: () => void;
}

export const OttomanTradePostsSelection = memo<OttomanTradePostsSelectionProps>(
  ({ onSubmit }) => {
    const { toggleOttomanTradePost } = useAddElementStore();
    const { selectedTradePosts } = useOttomanSelection();
    const { submit, isLoading } = useSubmitOttomanTradePosts();

    // Get already added trade posts from DB (useLiveQuery returns data directly)
    const existingTradePosts = useOttomanTradePosts();
    const existingNames = useMemo(
      () => new Set((existingTradePosts || []).map((tp) => tp.name)),
      [existingTradePosts],
    );

    // Get available trade posts (filter out already added ones)
    const availableTradePosts = useMemo(() => {
      const all = getAllTradePosts();
      return all.filter((tp) => !existingNames.has(tp.name));
    }, [existingNames]);

    // Group trade posts by area
    const tradePostsByArea = useMemo(() => {
      const groups = new Map<number, typeof availableTradePosts>();
      availableTradePosts.forEach((tp) => {
        if (!groups.has(tp.area)) {
          groups.set(tp.area, []);
        }
        groups.get(tp.area)!.push(tp);
      });
      return Array.from(groups.entries()).sort((a, b) => a[0] - b[0]);
    }, [availableTradePosts]);

    const handleSubmit = useCallback(async () => {
      await submit();
      onSubmit?.();
    }, [submit, onSubmit]);

    const allSelected =
      availableTradePosts.length > 0 &&
      availableTradePosts.every((tp) => selectedTradePosts.has(tp.name));

    const handleSelectAll = useCallback(() => {
      if (allSelected) {
        availableTradePosts.forEach((tp) => {
          if (selectedTradePosts.has(tp.name)) toggleOttomanTradePost(tp.name);
        });
      } else {
        availableTradePosts.forEach((tp) => {
          if (!selectedTradePosts.has(tp.name)) toggleOttomanTradePost(tp.name);
        });
      }
    }, [
      allSelected,
      availableTradePosts,
      selectedTradePosts,
      toggleOttomanTradePost,
    ]);

    const hasSelection = selectedTradePosts.size > 0;

    if (availableTradePosts.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Store className="size-12 text-muted-foreground mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">
            All trade posts have been added
          </h3>
          <p className="text-sm text-muted-foreground">
            You&apos;ve already added all available Ottoman trade posts to your
            list.
          </p>
        </div>
      );
    }

    return (
      <div className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto pb-24 md:pb-4">
          <div className="space-y-4 pb-4">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-muted-foreground">
                {selectedTradePosts.size} / {availableTradePosts.length}{" "}
                selected
              </p>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleSelectAll}
                className="h-7 text-sm"
              >
                {allSelected ? "Deselect all" : "Select all"}
              </Button>
            </div>

            {tradePostsByArea.map(([areaIndex, tradePosts]) => (
              <div key={areaIndex} className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <MapPin className="size-4" />
                  Area {areaIndex}
                </h3>

                <div className="grid grid-cols-1 gap-2 pl-6">
                  {tradePosts.map((tradePost) => {
                    const isSelected = selectedTradePosts.has(tradePost.name);

                    return (
                      <div
                        key={tradePost.name}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-sm border cursor-pointer transition-all",
                          "hover:bg-accent/70",
                          isSelected
                            ? "bg-primary/10 border-primary"
                            : "bg-background-100 border-alpha-300",
                        )}
                        onClick={() => toggleOttomanTradePost(tradePost.name)}
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() =>
                            toggleOttomanTradePost(tradePost.name)
                          }
                          className={cn(
                            "data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-white",
                          )}
                        />
                        <Store className="size-4 text-muted-foreground shrink-0" />
                        <div className="flex-1 min-w-0">
                          <span className="text-sm font-medium">
                            {tradePost.name}
                          </span>
                          <span className="text-[13px] font-medium text-muted-foreground ml-2">
                            ({tradePost.resource})
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating Add Button */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t md:relative md:border-t-0 md:p-0 md:mt-4">
          <Button
            size="lg"
            variant="default"
            onClick={handleSubmit}
            disabled={!hasSelection || isLoading}
            className="w-full text-base"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 mr-2 animate-spin" />
                Adding...
              </>
            ) : (
              `Add ${selectedTradePosts.size} ${selectedTradePosts.size === 1 ? "trade post" : "trade posts"}`
            )}
          </Button>
        </div>
      </div>
    );
  },
);

OttomanTradePostsSelection.displayName = "OttomanTradePostsSelection";
