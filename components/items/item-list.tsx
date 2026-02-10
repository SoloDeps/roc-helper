"use client";

import { useMemo, useEffect, useState } from "react";
import { BuildingCard } from "@/components/cards/building-card";
import { TechnoCard } from "@/components/cards/techno-card";
import { AreaCard } from "@/components/cards/area-card";
import { TradePostCard } from "@/components/cards/trade-post-card";
import { EmptyOutline } from "@/components/cards/empty-card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useFiltersStore } from "@/lib/stores/filters-store";
import {
  useBuildings,
  useTechnos,
  useOttomanAreas,
  useOttomanTradePosts,
  useRemoveBuilding,
  useUpdateBuildingQuantity,
  useToggleBuildingHidden,
  useRemoveTechnosByEra,
  useToggleTechnosByEra,
  useRemoveOttomanArea,
  useToggleOttomanAreaHidden,
  useRemoveOttomanTradePost,
  useToggleOttomanTradePostHidden,
  useToggleOttomanTradePostLevel,
} from "@/hooks/use-database";
import { useBuildingSelections } from "@/hooks/useBuildingSelections";
import {
  useLastAddedElementId,
  useAddElementStore,
} from "@/lib/stores/add-element-store";

export function ItemList() {
  const userSelections = useBuildingSelections();

  // ✅ Track which accordions are open
  const [openAccordions, setOpenAccordions] = useState<string[]>([]);

  // ✅ Get last added element ID
  const lastAddedElementId = useLastAddedElementId();

  // Filters
  const filters = useFiltersStore();

  // Data from Dexie
  const buildings = useBuildings() ?? [];
  const technos = useTechnos() ?? [];
  const areas = useOttomanAreas() ?? [];
  const tradePosts = useOttomanTradePosts() ?? [];

  // Mutations
  const removeBuilding = useRemoveBuilding();
  const updateQuantity = useUpdateBuildingQuantity();
  const toggleHidden = useToggleBuildingHidden();

  const removeTechnosByEra = useRemoveTechnosByEra();
  const toggleTechnosByEra = useToggleTechnosByEra();

  const removeArea = useRemoveOttomanArea();
  const toggleAreaHidden = useToggleOttomanAreaHidden();

  const removeTradePost = useRemoveOttomanTradePost();
  const toggleTradePostHidden = useToggleOttomanTradePostHidden();
  const toggleTradePostLevel = useToggleOttomanTradePostLevel();

  // ========================================================================
  // FILTER BUILDINGS
  // ========================================================================
  const filteredBuildings = useMemo(() => {
    let filtered = [...buildings];

    // Filter by type (construction/upgrade)
    if (filters.tableType) {
      filtered = filtered.filter((b) => b.type === filters.tableType);
    }

    // Filter by location (category)
    if (filters.location) {
      filtered = filtered.filter((b) => b.category === filters.location);
    }

    // Filter hidden cards
    if (filters.hideHidden) {
      filtered = filtered.filter((b) => !b.hidden);
    }

    return filtered;
  }, [buildings, filters]);

  // ========================================================================
  // FILTER TECHNOS
  // ========================================================================
  const filteredTechnos = useMemo(() => {
    if (filters.hideTechnos) return [];
    if (filters.hideHidden) {
      return technos.filter((t) => !t.hidden);
    }
    return technos;
  }, [technos, filters.hideTechnos, filters.hideHidden]);

  // ========================================================================
  // FILTER OTTOMAN
  // ========================================================================
  const filteredAreas = useMemo(() => {
    if (filters.hideHidden) {
      return areas.filter((a) => !a.hidden);
    }
    return areas;
  }, [areas, filters.hideHidden]);

  const filteredTradePosts = useMemo(() => {
    if (filters.hideHidden) {
      return tradePosts.filter((tp) => !tp.hidden);
    }
    return tradePosts;
  }, [tradePosts, filters.hideHidden]);

  // ========================================================================
  // ✅ GROUP BUILDINGS BY ELEMENT ONLY (NO ERA GROUPING)
  // ========================================================================
  const buildingsByElement = useMemo(() => {
    const groups = new Map<string, typeof filteredBuildings>();

    filteredBuildings.forEach((building) => {
      const elementId = building.elementId;

      if (!groups.has(elementId)) {
        groups.set(elementId, []);
      }

      groups.get(elementId)!.push(building);
    });

    // Sort each element's buildings by level (ascending)
    groups.forEach((buildings) => {
      buildings.sort((a, b) => a.level - b.level);
    });

    return groups;
  }, [filteredBuildings]);

  // ========================================================================
  // AGGREGATE TECHNOS BY ERA
  // ========================================================================
  const technosByEra = useMemo(() => {
    const groups = new Map<
      string,
      {
        totalResearch: number;
        totalCoins: number;
        totalFood: number;
        goods: Array<{ type: string; amount: number }>;
        technoCount: number;
        hidden: boolean;
      }
    >();

    filteredTechnos.forEach((techno) => {
      if (!groups.has(techno.era)) {
        groups.set(techno.era, {
          totalResearch: 0,
          totalCoins: 0,
          totalFood: 0,
          goods: [],
          technoCount: 0,
          hidden: techno.hidden,
        });
      }

      const group = groups.get(techno.era)!;
      group.technoCount++;

      // Aggregate resources
      Object.entries(techno.costs.resources).forEach(([key, value]) => {
        if (key === "research_points") {
          group.totalResearch += value;
        } else if (key === "coins") {
          group.totalCoins += value;
        } else if (key === "food") {
          group.totalFood += value;
        }
      });

      // Aggregate goods
      techno.costs.goods.forEach((good) => {
        const existing = group.goods.find((g) => g.type === good.type);
        if (existing) {
          existing.amount += good.amount;
        } else {
          group.goods.push({ type: good.type, amount: good.amount });
        }
      });
    });

    return groups;
  }, [filteredTechnos]);

  // ========================================================================
  // ✅ AUTO-OPEN ACCORDION WHEN NEW ELEMENT IS ADDED
  // ========================================================================
  useEffect(() => {
    if (lastAddedElementId) {
      const accordionId = `element-${lastAddedElementId}`;

      // If no accordions are open, open only the newly added one
      // Otherwise add it to the existing open ones
      if (openAccordions.length === 0) {
        setOpenAccordions([accordionId]);
      } else {
        setOpenAccordions((prev) =>
          prev.includes(accordionId) ? prev : [...prev, accordionId],
        );
      }

      // Reset the lastAddedElementId after handling
      useAddElementStore.setState({ lastAddedElementId: null });
    }
  }, [lastAddedElementId, openAccordions.length]);

  // ========================================================================
  // CHECK IF EMPTY
  // ========================================================================
  const hasAnyData =
    buildingsByElement.size > 0 ||
    technosByEra.size > 0 ||
    filteredAreas.length > 0 ||
    filteredTradePosts.length > 0;

  if (!hasAnyData) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <EmptyOutline perso="male" type="building" />
      </div>
    );
  }

  // ========================================================================
  // RENDER
  // ========================================================================
  return (
    <div className="space-y-4 p-3">
      {/* TECHNOLOGIES */}
      {technosByEra.size > 0 && (
        <Accordion type="multiple" className="space-y-2">
          {Array.from(technosByEra.entries()).map(([era, data]) => (
            <AccordionItem
              key={era}
              value={era}
              className="border rounded-lg bg-background-200"
            >
              <AccordionTrigger className="px-4 hover:no-underline">
                <div className="flex items-center gap-3">
                  <span className="font-semibold">{era}</span>
                  <span className="text-sm text-muted-foreground">
                    {data.technoCount} technologie(s)
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-4 pt-2">
                <TechnoCard
                  aggregatedTechnos={data}
                  userSelections={userSelections}
                  onRemoveAll={() => removeTechnosByEra.mutate(era)}
                  onToggleHidden={() => toggleTechnosByEra.mutate(era)}
                  era={era}
                />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}

      {/* BUILDINGS - GROUPED BY ELEMENT (NO ERA) */}
      {buildingsByElement.size > 0 && (
        <Accordion
          type="multiple"
          className="space-y-2"
          value={openAccordions}
          onValueChange={setOpenAccordions}
        >
          {Array.from(buildingsByElement.entries()).map(
            ([elementId, buildingsInElement]) => {
              const firstBuilding = buildingsInElement[0];
              const accordionId = `element-${elementId}`;

              // Count selected buildings for this element
              const selectedCount = buildingsInElement.length;

              return (
                <AccordionItem
                  key={accordionId}
                  value={accordionId}
                  className="border rounded-lg bg-background-200"
                >
                  <AccordionTrigger className="hover:no-underline [&>svg]:-order-1 justify-start gap-3 px-4 text-sm">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{firstBuilding.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {selectedCount} selected
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-4 pb-4 pt-2 space-y-2">
                    {buildingsInElement.map((building) => (
                      <BuildingCard
                        key={building.id}
                        buildingId={building.id}
                        userSelections={userSelections}
                        onRemove={(id) => removeBuilding.mutate(id)}
                        onUpdateQuantity={(id, qty) =>
                          updateQuantity.mutate({ id, quantity: qty })
                        }
                        onToggleHidden={(id) => toggleHidden.mutate(id)}
                      />
                    ))}
                  </AccordionContent>
                </AccordionItem>
              );
            },
          )}
        </Accordion>
      )}

      {/* OTTOMAN AREAS */}
      {filteredAreas.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold px-2">Ottoman Areas</h3>
          {filteredAreas.map((area) => (
            <AreaCard
              key={area.id}
              area={area}
              userSelections={userSelections}
              onRemove={(id) => removeArea.mutate(id)}
              onToggleHidden={(id) => toggleAreaHidden.mutate(id)}
            />
          ))}
        </div>
      )}

      {/* OTTOMAN TRADE POSTS */}
      {filteredTradePosts.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold px-2">Ottoman Trade Posts</h3>
          {filteredTradePosts.map((tp) => (
            <TradePostCard
              key={tp.id}
              tradePost={tp}
              userSelections={userSelections}
              onRemove={(id) => removeTradePost.mutate(id)}
              onToggleHidden={(id) => toggleTradePostHidden.mutate(id)}
              onToggleLevel={(id, level) =>
                toggleTradePostLevel.mutate({ id, level })
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
