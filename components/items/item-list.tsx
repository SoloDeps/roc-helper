"use client";

import React, { useMemo, useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { BuildingCard } from "@/components/cards/building-card";
import { TechnoCard } from "@/components/cards/techno-card";
import { AreaCard } from "@/components/cards/area-card";
import { TradePostCard } from "@/components/cards/trade-post-card";
import { EmptyOutline } from "@/components/cards/empty-card";
import { Accordion } from "@/components/ui/accordion";
import { ReusableAccordion } from "@/components/items/reusable-accordion";
import { AccordionActionsDrawer } from "@/components/modals/accordion-actions-drawer";
import { ItemListSkeleton } from "@/components/loading-skeletons";
import { useFiltersStore } from "@/lib/stores/filters-store";
import { useUIStore } from "@/lib/stores/ui-store";
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
import { useBuildingSelections } from "@/hooks/use-building-selections";
import {
  toggleHideAllBuildings,
  toggleHideAllOttomanAreas,
  toggleHideAllOttomanTradePosts,
} from "@/lib/db/hide-show-utils";
import {
  deleteAllBuildings,
  deleteAllTechnologies,
  deleteAllOttomanAreas,
  deleteAllOttomanTradePosts,
} from "@/lib/db/delete-utils";
import { ERA_ORDER } from "@/data/config";
import { ERA_ID_TO_ABBR } from "@/lib/era-mappings";
import { EraCode } from "@/types/shared";
import { CATALOG } from "@/lib/catalog";
// import type { TechnoEntity } from "@/lib/db/schema";
import type { HydratedTechno } from "@/lib/db/data-hydration";

// ============================================================================
// CATALOG ORDER MAPS
// Precompute sort keys from CATALOG for O(1) lookup
// ============================================================================

/**
 * Maps `category` (e.g. "capital", "egypt") → its index in CATALOG
 */
const CATEGORY_ORDER = new Map<string, number>(
  CATALOG.map((cat, i) => [cat.id, i]),
);

/**
 * Maps `${categoryId}__${subcategoryId}` → subcategory index within its category
 * Used to order buildings by their subcategory (homes before farms, etc.)
 */
const SUBCATEGORY_ORDER = new Map<string, number>();
CATALOG.forEach((cat) => {
  (cat.subcategories ?? []).forEach((sub, j) => {
    SUBCATEGORY_ORDER.set(`${cat.id}__${sub.id}`, j);
  });
});

/**
 * Maps `elementId` → subcategory name (e.g. "capital_small_home" → "homes")
 * Allows grouping accordions by their subcategory section header.
 */
const ELEMENT_TO_SUBCATEGORY = new Map<
  string,
  { catId: string; subName: string }
>();
CATALOG.forEach((cat) => {
  (cat.subcategories ?? []).forEach((sub) => {
    sub.buildings.forEach((b) => {
      // elementId in DB is stored as `${catId}_${buildingId}`, e.g. "capital_small_home"
      ELEMENT_TO_SUBCATEGORY.set(`${cat.id}_${b.id}`, {
        catId: cat.id,
        subName: sub.name,
      });
    });
  });
});

// ============================================================================
// SECTION HEADER COMPONENT
// ============================================================================

interface SectionHeaderProps {
  label: string;
}

function SectionHeader({ label }: SectionHeaderProps) {
  return (
    <div className="flex items-center gap-2 pt-4.5 first:pt-0.5">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </span>
      {/* <div className="flex-1 h-px bg-border" /> */}
    </div>
  );
}

// ============================================================================
// ITEM LIST
// ============================================================================

export function ItemList() {
  const queryClient = useQueryClient();
  const userSelections = useBuildingSelections();

  // Use UI Store for accordion state
  const { accordionsState, setAccordionsState, addToAccordionsState } =
    useUIStore();

  // const { location, hideHidden, hideTechnos } = useFiltersStore();
  const { tableType, location, hideHidden, hideTechnos } = useFiltersStore();

  // État pour gérer les drawers mobiles
  const [activeDrawer, setActiveDrawer] = useState<string | null>(null);

  // États de chargement individuels
  const buildingsData = useBuildings();
  const technosData = useTechnos();
  const areasData = useOttomanAreas();
  const tradePostsData = useOttomanTradePosts();

  //  Détection du chargement initial
  const isInitialLoading =
    buildingsData === undefined ||
    technosData === undefined ||
    areasData === undefined ||
    tradePostsData === undefined;

  const buildings = useMemo(() => buildingsData ?? [], [buildingsData]);
  const technos = useMemo(() => technosData ?? [], [technosData]);
  const areas = useMemo(() => areasData ?? [], [areasData]);
  const tradePosts = useMemo(() => tradePostsData ?? [], [tradePostsData]);

  //  Track previous counts to detect new items
  const previousCountsRef = useRef<Map<string, number>>(new Map());

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
    let filtered = [...areas];
    if (location && location !== "ottoman") {
      filtered = [];
    }
    if (hideHidden) filtered = filtered.filter((a) => !a.hidden);
    return filtered;
  }, [areas, location, hideHidden]);

  const filteredTradePosts = useMemo(() => {
    let filtered = [...tradePosts];
    if (location && location !== "ottoman") {
      filtered = [];
    }
    if (hideHidden) filtered = filtered.filter((tp) => !tp.hidden);
    return filtered;
  }, [tradePosts, location, hideHidden]);

  // GROUP BUILDINGS BY CATEGORY + ELEMENT
  const buildingsByElement = useMemo(() => {
    const groups = new Map<string, typeof filteredBuildings>();
    filteredBuildings.forEach((building) => {
      const groupKey = `${building.category}_${building.elementId}`;
      if (!groups.has(groupKey)) groups.set(groupKey, []);
      groups.get(groupKey)!.push(building);
    });
    groups.forEach((buildings) => {
      buildings.sort((a, b) => a.level - b.level);
    });
    return groups;
  }, [filteredBuildings]);

  // GROUP TECHNOS BY ERA
  const technosByEra = useMemo(() => {
    const groups = new Map<string, HydratedTechno[]>();
    technos.forEach((techno) => {
      if (!groups.has(techno.era)) {
        groups.set(techno.era, []);
      }
      groups.get(techno.era)!.push(techno);
    });
    return groups;
  }, [technos]);

  // ============================================================================
  // SORTED + GROUPED BUILDINGS
  // Produces an ordered list of { sectionHeader?, accordionEntries[] } groups
  // so we can render section labels between accordion clusters.
  // ============================================================================

  type AccordionEntry = {
    groupKey: string;
    buildingsInElement: typeof filteredBuildings;
  };

  type SectionGroup = {
    /** e.g. "Capital — Homes", "Egypt — Workshops" */
    header: string;
    entries: AccordionEntry[];
  };

  const sectionGroups = useMemo<SectionGroup[]>(() => {
    // Sort all entries by (categoryOrder, subcategoryOrder, buildingName)
    const sorted = Array.from(buildingsByElement.entries()).sort(
      ([, bA], [, bB]) => {
        const a = bA[0];
        const b = bB[0];

        const catOrderA = CATEGORY_ORDER.get(a.category) ?? 999;
        const catOrderB = CATEGORY_ORDER.get(b.category) ?? 999;
        if (catOrderA !== catOrderB) return catOrderA - catOrderB;

        // Within same category, sort by subcategory order from CATALOG
        const subA = ELEMENT_TO_SUBCATEGORY.get(`${a.category}_${a.elementId}`);
        const subB = ELEMENT_TO_SUBCATEGORY.get(`${b.category}_${b.elementId}`);
        const subKeyA = subA
          ? `${a.category}__${CATALOG.find((c) => c.id === a.category)?.subcategories?.find((s) => s.name === subA.subName)?.id ?? ""}`
          : "";
        const subKeyB = subB
          ? `${b.category}__${CATALOG.find((c) => c.id === b.category)?.subcategories?.find((s) => s.name === subB.subName)?.id ?? ""}`
          : "";
        const subOrderA = SUBCATEGORY_ORDER.get(subKeyA) ?? 999;
        const subOrderB = SUBCATEGORY_ORDER.get(subKeyB) ?? 999;
        if (subOrderA !== subOrderB) return subOrderA - subOrderB;

        return a.name.localeCompare(b.name);
      },
    );

    // Bucket into sections
    const sections: SectionGroup[] = [];
    let lastHeader = "";

    sorted.forEach(([groupKey, buildingsInElement]) => {
      const first = buildingsInElement[0];
      const subInfo = ELEMENT_TO_SUBCATEGORY.get(
        `${first.category}_${first.elementId}`,
      );

      // Capitalise category label
      const catLabel =
        CATALOG.find((c) => c.id === first.category)?.name ?? first.category;
      const subLabel = subInfo?.subName ?? "";
      const header = subLabel ? `${catLabel} — ${subLabel}` : catLabel;

      if (header !== lastHeader) {
        sections.push({ header, entries: [] });
        lastHeader = header;
      }

      sections[sections.length - 1].entries.push({
        groupKey,
        buildingsInElement,
      });
    });

    return sections;
  }, [buildingsByElement]);

  // Get all accordion IDs
  const allAccordionIds = useMemo(() => {
    const ids: string[] = [];

    if (technosByEra.size > 0 && !hideTechnos) {
      ids.push("all-technologies");
    }

    buildingsByElement.forEach((_, groupKey) => {
      ids.push(`element-${groupKey}`);
    });

    if (filteredAreas.length > 0) {
      ids.push("ottoman-areas");
    }

    if (filteredTradePosts.length > 0) {
      ids.push("ottoman-tradeposts");
    }

    return ids;
  }, [
    technosByEra,
    hideTechnos,
    buildingsByElement,
    filteredAreas,
    filteredTradePosts,
  ]);

  //  Handle expand all trigger
  useEffect(() => {
    if (accordionsState.includes("__expand_all__")) {
      setAccordionsState(allAccordionIds);
    }
  }, [accordionsState, allAccordionIds, setAccordionsState]);

  //  AUTO-EXPAND: Detect new items and expand their accordions
  useEffect(() => {
    const currentCounts = new Map<string, number>();

    // Count technologies
    if (technosByEra.size > 0 && !hideTechnos) {
      currentCounts.set("all-technologies", technosByEra.size);
    }

    // Count buildings by element
    buildingsByElement.forEach((buildingsInElement, groupKey) => {
      const accordionId = `element-${groupKey}`;
      currentCounts.set(accordionId, buildingsInElement.length);
    });

    // Count ottoman areas
    if (filteredAreas.length > 0) {
      currentCounts.set("ottoman-areas", areas.length);
    }

    // Count ottoman trade posts
    if (filteredTradePosts.length > 0) {
      currentCounts.set("ottoman-tradeposts", tradePosts.length);
    }

    // Detect which accordions have new items
    const accordionsToExpand: string[] = [];
    currentCounts.forEach((count, id) => {
      const prevCount = previousCountsRef.current.get(id) || 0;
      if (count > prevCount) {
        accordionsToExpand.push(id);
      }
    });

    //  Expand accordions with new items using the helper
    if (accordionsToExpand.length > 0) {
      addToAccordionsState(accordionsToExpand);
    }

    // Update ref for next comparison
    previousCountsRef.current = currentCounts;
  }, [
    technos.length,
    technosByEra,
    hideTechnos,
    buildingsByElement,
    filteredAreas.length,
    areas.length,
    filteredTradePosts.length,
    tradePosts.length,
    addToAccordionsState,
  ]);

  //  Vérifier s'il y a des données à afficher
  const hasAnyData = useMemo(() => {
    return (
      buildings.length > 0 ||
      technos.length > 0 ||
      areas.length > 0 ||
      tradePosts.length > 0
    );
  }, [buildings.length, technos.length, areas.length, tradePosts.length]);

  // Drawer data memoization
  const drawerData = useMemo(() => {
    const data: Record<string, any> = {};

    // Technologies drawer
    if (technosByEra.size > 0 && !hideTechnos) {
      data["all-technologies"] = {
        title: "Technologies",
        allHidden: technos.length > 0 && technos.every((t) => t.hidden),
        onToggleAllHidden: () => {
          Array.from(technosByEra.keys()).forEach((era) => {
            toggleTechnosByEra.mutate(era);
          });
        },
        onDeleteAll: async () => {
          await deleteAllTechnologies();
          queryClient.invalidateQueries({
            queryKey: ["technos"],
            refetchType: "all",
          });
        },
        deleteConfirmMessage: (
          <>
            This action cannot be <b>undone</b>.
            <br />
            This will permanently delete <b>all technologies</b> from all eras.
          </>
        ),
      };
    }

    // Buildings drawers
    buildingsByElement.forEach((buildingsInElement, groupKey) => {
      const accordionId = `element-${groupKey}`;
      const firstBuilding = buildingsInElement[0];
      const buildingIds = buildingsInElement.map((b) => b.id);

      data[accordionId] = {
        title: `${firstBuilding.category} — ${firstBuilding.name}`,
        allHidden: buildingsInElement.every((b) => b.hidden),
        onToggleAllHidden: async () => {
          await toggleHideAllBuildings(buildingIds);
          queryClient.invalidateQueries({
            queryKey: ["buildings"],
            refetchType: "all",
          });
        },
        onDeleteAll: async () => {
          await deleteAllBuildings(buildingIds);
          queryClient.invalidateQueries({
            queryKey: ["buildings"],
            refetchType: "all",
          });
        },
        deleteConfirmMessage: (
          <>
            This action cannot be <b>undone</b>.
            <br />
            This will permanently delete <b>all {firstBuilding.name}</b>{" "}
            buildings.
          </>
        ),
      };
    });

    // Ottoman areas drawer
    if (filteredAreas.length > 0) {
      data["ottoman-areas"] = {
        title: "Areas",
        allHidden: areas.every((a) => a.hidden),
        onToggleAllHidden: async () => {
          await toggleHideAllOttomanAreas();
          queryClient.invalidateQueries({
            queryKey: ["ottoman-areas"],
            refetchType: "all",
          });
        },
        onDeleteAll: async () => {
          await deleteAllOttomanAreas();
          queryClient.invalidateQueries({
            queryKey: ["ottoman-areas"],
            refetchType: "all",
          });
        },
        deleteConfirmMessage: (
          <>
            This action cannot be <b>undone</b>.
            <br />
            This will permanently delete <b>all Ottoman areas</b>.
          </>
        ),
      };
    }

    // Ottoman trade posts drawer
    if (filteredTradePosts.length > 0) {
      data["ottoman-tradeposts"] = {
        title: "Trade Posts",
        allHidden: tradePosts.every((tp) => tp.hidden),
        onToggleAllHidden: async () => {
          await toggleHideAllOttomanTradePosts();
          queryClient.invalidateQueries({
            queryKey: ["ottoman-tradeposts"],
            refetchType: "all",
          });
        },
        onDeleteAll: async () => {
          await deleteAllOttomanTradePosts();
          queryClient.invalidateQueries({
            queryKey: ["ottoman-tradeposts"],
            refetchType: "all",
          });
        },
        deleteConfirmMessage: (
          <>
            This action cannot be <b>undone</b>.
            <br />
            This will permanently delete <b>all Ottoman trade posts</b>.
          </>
        ),
      };
    }

    return data;
  }, [
    queryClient,
    technosByEra,
    hideTechnos,
    technos,
    buildingsByElement,
    filteredAreas,
    areas,
    filteredTradePosts,
    tradePosts,
    toggleTechnosByEra,
  ]);

  // Afficher le skeleton pendant le chargement initial
  if (isInitialLoading) {
    return <ItemListSkeleton />;
  }

  // Afficher l'empty state seulement après le chargement
  if (!hasAnyData) {
    return (
      <div className="p-3 size-full bg-background-200 flex items-center justify-center">
        <EmptyOutline perso="male" type="building" />
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4 py-3 px-2 pb-28 md:p-3">
        <Accordion
          type="multiple"
          className="space-y-2"
          value={accordionsState}
          onValueChange={setAccordionsState}
        >
          {/* TECHNOLOGIES ACCORDION */}
          {technosByEra.size > 0 && !hideTechnos && (
            <>
              <SectionHeader label="Research Tree" />
              <ReusableAccordion
                id="all-technologies"
                title="Technologies"
                selectedCount={technosByEra.size}
                hiddenCount={
                  Array.from(technosByEra.values()).filter((eraTechnos) =>
                    eraTechnos.every((t) => t.hidden),
                  ).length
                }
                allHidden={technos.length > 0 && technos.every((t) => t.hidden)}
                onToggleAllHidden={() => {
                  Array.from(technosByEra.keys()).forEach((era) => {
                    toggleTechnosByEra.mutate(era);
                  });
                }}
                onDeleteAll={async () => {
                  await deleteAllTechnologies();
                  queryClient.invalidateQueries({
                    queryKey: ["technos"],
                    refetchType: "all",
                  });
                }}
                deleteConfirmMessage={
                  <>
                    This action cannot be <b>undone</b>.
                    <br />
                    This will permanently delete <b>all technologies</b> from
                    all eras.
                  </>
                }
                onOpenMobileActions={() => setActiveDrawer("all-technologies")}
              >
                <div className="space-y-3">
                  {Array.from(technosByEra.entries())
                    .sort(([eraIdA], [eraIdB]) => {
                      const abbrA = ERA_ID_TO_ABBR[
                        eraIdA
                      ]?.toUpperCase() as EraCode;
                      const abbrB = ERA_ID_TO_ABBR[
                        eraIdB
                      ]?.toUpperCase() as EraCode;

                      return (
                        ERA_ORDER.indexOf(abbrA) - ERA_ORDER.indexOf(abbrB)
                      );
                    })
                    .map(([era, eraTechnos]) => {
                      return (
                        <TechnoCard
                          key={era}
                          era={era}
                          technos={eraTechnos}
                          userSelections={userSelections}
                          onRemoveAll={() => removeTechnosByEra.mutate(era)}
                          onToggleHidden={() => toggleTechnosByEra.mutate(era)}
                        />
                      );
                    })}
                </div>
              </ReusableAccordion>
            </>
          )}

          {/* BUILDINGS ACCORDIONS — grouped by category > subcategory */}
          {sectionGroups.map((section) => (
            <React.Fragment key={section.header}>
              <SectionHeader label={section.header} />
              {section.entries.map(({ groupKey, buildingsInElement }) => {
                const firstBuilding = buildingsInElement[0];
                const accordionId = `element-${groupKey}`;
                const selectedCount = buildingsInElement.length;
                const hiddenCount = buildingsInElement.filter(
                  (b) => b.hidden,
                ).length;
                const allHidden = buildingsInElement.every((b) => b.hidden);
                const displayName = firstBuilding.name;
                const buildingIds = buildingsInElement.map((b) => b.id);

                return (
                  <ReusableAccordion
                    key={accordionId}
                    id={accordionId}
                    title={displayName}
                    selectedCount={selectedCount}
                    hiddenCount={hiddenCount}
                    allHidden={allHidden}
                    onToggleAllHidden={async () => {
                      await toggleHideAllBuildings(buildingIds);
                      queryClient.invalidateQueries({
                        queryKey: ["buildings"],
                        refetchType: "all",
                      });
                    }}
                    onDeleteAll={async () => {
                      await deleteAllBuildings(buildingIds);
                      queryClient.invalidateQueries({
                        queryKey: ["buildings"],
                        refetchType: "all",
                      });
                    }}
                    deleteConfirmMessage={
                      <>
                        This action cannot be <b>undone</b>.
                        <br />
                        This will permanently delete <b>
                          all {displayName}
                        </b>{" "}
                        buildings.
                      </>
                    }
                    onOpenMobileActions={() => setActiveDrawer(accordionId)}
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
              })}
            </React.Fragment>
          ))}

          {/* OTTOMAN SECTION — single header for both areas and trade posts */}
          {(filteredAreas.length > 0 || filteredTradePosts.length > 0) && (
            <SectionHeader label="Ottoman Empire" />
          )}

          {/* OTTOMAN AREAS ACCORDION */}
          {filteredAreas.length > 0 && (
            <>
              <ReusableAccordion
                id="ottoman-areas"
                title="Areas"
                selectedCount={filteredAreas.length}
                hiddenCount={areas.filter((a) => a.hidden).length}
                allHidden={areas.every((a) => a.hidden)}
                onToggleAllHidden={async () => {
                  await toggleHideAllOttomanAreas();
                  queryClient.invalidateQueries({
                    queryKey: ["ottoman-areas"],
                    refetchType: "all",
                  });
                }}
                onDeleteAll={async () => {
                  await deleteAllOttomanAreas();
                  queryClient.invalidateQueries({
                    queryKey: ["ottoman-areas"],
                    refetchType: "all",
                  });
                }}
                deleteConfirmMessage={
                  <>
                    This action cannot be <b>undone</b>.
                    <br />
                    This will permanently delete <b>all Ottoman areas</b>.
                  </>
                }
                inlineSubtitle
                onOpenMobileActions={() => setActiveDrawer("ottoman-areas")}
              >
                {[...filteredAreas]
                  .sort((a, b) => a.areaIndex - b.areaIndex)
                  .map((area) => (
                    <AreaCard
                      key={area.id}
                      area={area}
                      userSelections={userSelections}
                      onRemove={(id) => removeArea.mutate(id)}
                      onToggleHidden={(id) => toggleAreaHidden.mutate(id)}
                    />
                  ))}
              </ReusableAccordion>
            </>
          )}

          {/* OTTOMAN TRADE POSTS ACCORDION */}
          {filteredTradePosts.length > 0 && (
            <>
              <ReusableAccordion
                id="ottoman-tradeposts"
                title="Trade Posts"
                selectedCount={filteredTradePosts.length}
                hiddenCount={tradePosts.filter((tp) => tp.hidden).length}
                allHidden={tradePosts.every((tp) => tp.hidden)}
                onToggleAllHidden={async () => {
                  await toggleHideAllOttomanTradePosts();
                  queryClient.invalidateQueries({
                    queryKey: ["ottoman-tradeposts"],
                    refetchType: "all",
                  });
                }}
                onDeleteAll={async () => {
                  await deleteAllOttomanTradePosts();
                  queryClient.invalidateQueries({
                    queryKey: ["ottoman-tradeposts"],
                    refetchType: "all",
                  });
                }}
                deleteConfirmMessage={
                  <>
                    This action cannot be <b>undone</b>.
                    <br />
                    This will permanently delete <b>all Ottoman trade posts</b>.
                  </>
                }
                helpText="Check the level checkboxes on cards to mark as completed or hidden"
                inlineSubtitle
                onOpenMobileActions={() =>
                  setActiveDrawer("ottoman-tradeposts")
                }
              >
                {[...filteredTradePosts]
                  .sort((a, b) => a.area - b.area)
                  .map((tp) => (
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
            </>
          )}
        </Accordion>
      </div>

      {/* DRAWERS - Complètement séparés des accordions */}
      {Object.entries(drawerData).map(([id, data]) => (
        <AccordionActionsDrawer
          key={`drawer-${id}`}
          title={data.title}
          allHidden={data.allHidden}
          onToggleAllHidden={data.onToggleAllHidden}
          onDeleteAll={data.onDeleteAll}
          deleteConfirmMessage={data.deleteConfirmMessage}
          open={activeDrawer === id}
          onOpenChange={(open) => {
            if (!open) {
              setActiveDrawer(null);
            }
          }}
        />
      ))}
    </>
  );
}
