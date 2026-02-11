"use client";

import React, { useMemo, useState } from "react";
import { BuildingCard } from "@/components/cards/building-card";
import { TechnoCard } from "@/components/cards/techno-card";
import { AreaCard } from "@/components/cards/area-card";
import { TradePostCard } from "@/components/cards/trade-post-card";
import { EmptyOutline } from "@/components/cards/empty-card";
import { Accordion } from "@/components/ui/accordion";
import { ReusableAccordion } from "@/components/items/reusable-accordion";
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
  useRemoveOttomanArea,
  useToggleOttomanAreaHidden,
  useRemoveOttomanTradePost,
  useToggleOttomanTradePostHidden,
  useToggleOttomanTradePostLevel,
} from "@/hooks/use-database";
import { useBuildingSelections } from "@/hooks/use-building-selections";
import {
  useLastAddedElementId,
  useAddElementStore,
} from "@/lib/stores/add-element-store";
import {
  toggleHideAllBuildings,
  toggleHideAllTechnosByEra,
  toggleHideAllOttomanAreas,
  toggleHideAllOttomanTradePosts,
} from "@/lib/db/hide-show-utils";

export function ItemList() {
  const userSelections = useBuildingSelections();
  const [openAccordions, setOpenAccordions] = useState<string[]>([]);
  const lastAddedElementId = useLastAddedElementId();

  const { tableType, location, hideHidden, hideTechnos } = useFiltersStore();

  const buildingsData = useBuildings();
  const technosData = useTechnos();
  const areasData = useOttomanAreas();
  const tradePostsData = useOttomanTradePosts();

  const buildings = useMemo(() => buildingsData ?? [], [buildingsData]);
  const technos = useMemo(() => technosData ?? [], [technosData]);
  const areas = useMemo(() => areasData ?? [], [areasData]);
  const tradePosts = useMemo(() => tradePostsData ?? [], [tradePostsData]);

  const removeBuilding = useRemoveBuilding();
  const updateQuantity = useUpdateBuildingQuantity();
  const toggleHidden = useToggleBuildingHidden();
  const removeTechnosByEra = useRemoveTechnosByEra();
  const removeArea = useRemoveOttomanArea();
  const toggleAreaHidden = useToggleOttomanAreaHidden();
  const removeTradePost = useRemoveOttomanTradePost();
  const toggleTradePostHidden = useToggleOttomanTradePostHidden();
  const toggleTradePostLevel = useToggleOttomanTradePostLevel();

  // FILTER BUILDINGS
  const filteredBuildings = useMemo(() => {
    let filtered = [...buildings];
    if (tableType) filtered = filtered.filter((b) => b.type === tableType);
    if (location) filtered = filtered.filter((b) => b.category === location);
    if (hideHidden) filtered = filtered.filter((b) => !b.hidden);
    return filtered;
  }, [buildings, tableType, location, hideHidden]);

  // FILTER TECHNOS
  const filteredTechnos = useMemo(() => {
    if (hideTechnos) return [];
    if (hideHidden) return technos.filter((t) => !t.hidden);
    return technos;
  }, [technos, hideTechnos, hideHidden]);

  // FILTER OTTOMAN
  const filteredAreas = useMemo(() => {
    if (hideHidden) return areas.filter((a) => !a.hidden);
    return areas;
  }, [areas, hideHidden]);

  const filteredTradePosts = useMemo(() => {
    if (hideHidden) return tradePosts.filter((tp) => !tp.hidden);
    return tradePosts;
  }, [tradePosts, hideHidden]);

  // GROUP BUILDINGS BY ELEMENT
  const buildingsByElement = useMemo(() => {
    const groups = new Map<string, typeof filteredBuildings>();
    filteredBuildings.forEach((building) => {
      const elementId = building.elementId;
      if (!groups.has(elementId)) groups.set(elementId, []);
      groups.get(elementId)!.push(building);
    });
    groups.forEach((buildings) => {
      buildings.sort((a, b) => a.level - b.level);
    });
    return groups;
  }, [filteredBuildings]);

  // AGGREGATE TECHNOS BY ERA
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

      Object.entries(techno.costs.resources).forEach(([key, value]) => {
        if (key === "research_points") group.totalResearch += value;
        else if (key === "coins") group.totalCoins += value;
        else if (key === "food") group.totalFood += value;
      });

      techno.costs.goods.forEach((good) => {
        const existing = group.goods.find((g) => g.type === good.type);
        if (existing) existing.amount += good.amount;
        else group.goods.push({ type: good.type, amount: good.amount });
      });
    });

    return groups;
  }, [filteredTechnos]);

  // AUTO-OPEN ACCORDION WHEN NEW ELEMENT IS ADDED
  React.useEffect(() => {
    if (lastAddedElementId) {
      const accordionId = `element-${lastAddedElementId}`;
      const timeoutId = setTimeout(() => {
        setOpenAccordions((prev) =>
          prev.includes(accordionId) ? prev : [...prev, accordionId],
        );
        useAddElementStore.setState({ lastAddedElementId: null });
      }, 100);
      return () => clearTimeout(timeoutId);
    }
  }, [lastAddedElementId]);

  // CHECK IF EMPTY
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

  // ✅ RENDER - PATTERN WXT : Tout inline, pas de ReusableAccordion
  return (
    <div className="space-y-4 py-3 px-2 md:p-3">
      <Accordion
        type="multiple"
        className="space-y-2"
        value={openAccordions}
        onValueChange={setOpenAccordions}
      >
        {/* TECHNOLOGIES ACCORDION */}
        {technosByEra.size > 0 &&
          Array.from(technosByEra.entries()).map(([era, data]) => {
            const accordionId = `techno-${era}`;
            const eraTechnos = technos.filter((t) => t.era === era);
            const hiddenCount = eraTechnos.filter((t) => t.hidden).length;
            const allHidden = eraTechnos.every((t) => t.hidden);

            return (
              <ReusableAccordion
                key={accordionId}
                id={accordionId}
                title={era}
                selectedCount={data.technoCount}
                hiddenCount={hiddenCount}
                allHidden={allHidden}
                onToggleAllHidden={() => toggleHideAllTechnosByEra(era)}
              >
                <TechnoCard
                  aggregatedTechnos={data}
                  userSelections={userSelections}
                  onRemoveAll={() => removeTechnosByEra.mutate(era)}
                  onToggleHidden={() => toggleHideAllTechnosByEra(era)}
                  era={era}
                />
              </ReusableAccordion>
            );
          })}

        {/* BUILDINGS ACCORDION - GROUPED BY ELEMENT */}
        {Array.from(buildingsByElement.entries()).map(
          ([elementId, buildingsInElement]) => {
            const firstBuilding = buildingsInElement[0];
            const accordionId = `element-${elementId}`;
            const selectedCount = buildingsInElement.length;
            const hiddenCount = buildingsInElement.filter(
              (b) => b.hidden,
            ).length;
            const allHidden = buildingsInElement.every((b) => b.hidden);
            const displayName = firstBuilding.name;
            const subtitle = firstBuilding.category;
            const buildingIds = buildingsInElement.map((b) => b.id);

            return (
              <ReusableAccordion
                key={accordionId}
                id={accordionId}
                title={displayName}
                subtitle={subtitle}
                selectedCount={selectedCount}
                hiddenCount={hiddenCount}
                allHidden={allHidden}
                onToggleAllHidden={() => toggleHideAllBuildings(buildingIds)}
                inlineSubtitle
              >
                {buildingsInElement.map((building) => (
                  <BuildingCard
                    key={building.id}
                    building={building}
                    userSelections={userSelections}
                    onRemove={(id) => removeBuilding.mutate(id)}
                    onUpdateQuantity={(id, qty) =>
                      updateQuantity.mutate({ id, quantity: qty })
                    }
                    onToggleHidden={(id) => toggleHidden.mutate(id)}
                  />
                ))}
              </ReusableAccordion>
            );
          },
        )}

        {/* OTTOMAN AREAS ACCORDION */}
        {filteredAreas.length > 0 && (
          <ReusableAccordion
            id="ottoman-areas"
            title="Areas"
            subtitle="Ottoman Empire"
            selectedCount={filteredAreas.length}
            hiddenCount={areas.filter((a) => a.hidden).length}
            allHidden={areas.every((a) => a.hidden)}
            onToggleAllHidden={toggleHideAllOttomanAreas}
            inlineSubtitle
          >
            {filteredAreas.map((area) => (
              <AreaCard
                key={area.id}
                area={area}
                userSelections={userSelections}
                onRemove={(id) => removeArea.mutate(id)}
                onToggleHidden={(id) => toggleAreaHidden.mutate(id)}
              />
            ))}
          </ReusableAccordion>
        )}

        {/* OTTOMAN TRADE POSTS ACCORDION */}
        {filteredTradePosts.length > 0 && (
          <ReusableAccordion
            id="ottoman-tradeposts"
            title="Trade Posts"
            subtitle="Ottoman Empire"
            selectedCount={filteredTradePosts.length}
            hiddenCount={tradePosts.filter((tp) => tp.hidden).length}
            allHidden={tradePosts.every((tp) => tp.hidden)}
            onToggleAllHidden={toggleHideAllOttomanTradePosts}
            inlineSubtitle
          >
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
          </ReusableAccordion>
        )}
      </Accordion>
    </div>
  );
}
