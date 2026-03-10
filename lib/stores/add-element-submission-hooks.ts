"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useAddElementStore } from "./add-element-store";
import { getWikiDB, areaIndexToId, tradePostIndexToId } from "@/lib/db/schema";
import { ERAS } from "@/lib/catalog";
import { getTechnologiesByEra } from "@/data/technos-registry";
import { getAllTradePosts } from "@/lib/ottoman-data-loader";
import { useSelectEra } from "./technology-page-store";
import { useQueryClient } from "@tanstack/react-query";
import { PRESET_SECTIONS, getEntriesForEra } from "@/data/presets";
import type {
  BuildingEntry,
  OttomanAreaEntry,
  OttomanTradePostEntry,
} from "@/data/presets";
import type { EraAbbr } from "@/lib/constants";

// ============================================================================
// TECHNO SUBMISSION
// ============================================================================

export function useSubmitTechno() {
  const { closeModal } = useAddElementStore();
  const selectEra = useSelectEra();
  const queryClient = useQueryClient();

  const submit = async (eraId: string) => {
    if (!eraId) {
      toast.error("No era selected");
      return;
    }

    const era = ERAS.find((e) => e.id === eraId);
    if (!era) {
      toast.error("Era not found");
      return;
    }

    const technologies = getTechnologiesByEra(eraId);
    if (technologies.length === 0) {
      toast.error("No technologies found for this era");
      return;
    }

    const db = getWikiDB();
    const duplicates: string[] = [];
    const toAdd: Array<{ id: string; hidden: number; cp: number }> = [];

    for (const technoData of technologies) {
      const dbId = technoData.id;
      const existing = await db.technos.get(dbId);
      if (existing) {
        duplicates.push(technoData.name);
      } else {
        toAdd.push({ id: dbId, hidden: 0, cp: 0 });
      }
    }

    if (duplicates.length > 0) {
      const description = duplicates.map((name) => `• ${name}`).join("\n");
      toast.error("Some technologies are already in the list", {
        description,
        duration: 4000,
        style: { whiteSpace: "pre-line" },
      });
    }

    if (toAdd.length > 0) {
      try {
        await db.technos.bulkPut(toAdd);
        queryClient.invalidateQueries({ queryKey: ["technos"] });
        toast.success(`${era.name} technologies added`);
        selectEra(eraId);
        closeModal();
      } catch (error) {
        console.error("❌ Failed to add technologies:", error);
        toast.error("Failed to add technologies");
      }
    } else if (duplicates.length === technologies.length) {
      toast.info(`All technologies from ${era.name} are already added`);
    }

    selectEra(eraId);
    closeModal();
  };

  return { submit, isLoading: false };
}

// ============================================================================
// OTTOMAN AREAS SUBMISSION
// ============================================================================

export function useSubmitOttomanAreas() {
  const { ottomanSelection, closeModal, clearOttomanSelection } =
    useAddElementStore();
  const queryClient = useQueryClient();

  const submit = async () => {
    const selectedAreas = Array.from(ottomanSelection.selectedAreas);
    if (selectedAreas.length === 0) {
      toast.error("No areas selected");
      return;
    }

    const db = getWikiDB();
    const duplicates: number[] = [];
    const toAdd: Array<{ id: string; hidden: number }> = [];

    for (const areaIndex of selectedAreas) {
      const areaId = areaIndexToId(areaIndex);
      const existing = await db.ottomanAreas.get(areaId);
      if (existing) {
        duplicates.push(areaIndex);
      } else {
        toAdd.push({ id: areaId, hidden: 0 });
      }
    }

    if (duplicates.length > 0) {
      toast.error("Some areas are already in the list", {
        description: `• Areas: ${duplicates.join(", ")}`,
        position: "top-center",
        duration: 3000,
        style: { whiteSpace: "pre-line" },
      });
    }

    if (toAdd.length > 0) {
      try {
        await db.ottomanAreas.bulkPut(toAdd);
        queryClient.invalidateQueries({ queryKey: ["ottoman-areas"] });
        toast.success(`${toAdd.length} areas added successfully`);
        clearOttomanSelection();
        closeModal();
      } catch (error) {
        console.error("❌ Failed to add areas:", error);
        toast.error("Failed to add areas");
      }
    } else if (duplicates.length === selectedAreas.length) {
      return;
    }
  };

  return { submit, isLoading: false };
}

// ============================================================================
// OTTOMAN TRADE POSTS SUBMISSION
// ============================================================================

export function useSubmitOttomanTradePosts() {
  const { ottomanSelection, closeModal, clearOttomanSelection } =
    useAddElementStore();
  const queryClient = useQueryClient();

  const submit = async () => {
    const selectedTradePosts = Array.from(ottomanSelection.selectedTradePosts);
    if (selectedTradePosts.length === 0) {
      toast.error("No trade posts selected");
      return;
    }

    const db = getWikiDB();
    const allTradePosts = getAllTradePosts();
    const duplicates: string[] = [];
    const toAdd: Array<{
      id: string;
      levels: {
        unlock: number;
        lvl2: number;
        lvl3: number;
        lvl4: number;
        lvl5: number;
        lvl6: number;
      };
      hidden: number;
    }> = [];

    for (const tradePostName of selectedTradePosts) {
      const tradePostIndex = allTradePosts.findIndex(
        (tp) => tp.name === tradePostName,
      );
      if (tradePostIndex === -1) continue;
      const tradePostId = tradePostIndexToId(tradePostIndex);
      const existing = await db.ottomanTradePosts.get(tradePostId);
      if (existing) {
        duplicates.push(tradePostName);
      } else {
        toAdd.push({
          id: tradePostId,
          levels: { unlock: 0, lvl2: 0, lvl3: 0, lvl4: 0, lvl5: 0, lvl6: 0 },
          hidden: 0,
        });
      }
    }

    if (duplicates.length > 0) {
      toast.error("Some trade posts are already in the list", {
        description: `• Trade posts: ${duplicates.join(", ")}`,
        position: "top-center",
        duration: 3500,
        style: { whiteSpace: "pre-line" },
      });
    }

    if (toAdd.length > 0) {
      try {
        await db.ottomanTradePosts.bulkPut(toAdd);
        queryClient.invalidateQueries({ queryKey: ["ottoman-tradeposts"] });
        toast.success(`${toAdd.length} trade posts added successfully`);
        clearOttomanSelection();
        closeModal();
      } catch (error) {
        console.error("❌ Failed to add trade posts:", error);
        toast.error("Failed to add trade posts");
      }
    } else if (duplicates.length === selectedTradePosts.length) {
      return;
    }
  };

  return { submit, isLoading: false };
}

// ============================================================================
// PRESET SUBMISSION
// ============================================================================

export function useSubmitPreset() {
  const [isLoading, setIsLoading] = useState(false);
  const { presetSelection, closeModal } = useAddElementStore();
  const queryClient = useQueryClient();
  const selectEra = useSelectEra();

  const submit = async () => {
    setIsLoading(true);
    const db = getWikiDB();
    const era = presetSelection.era as EraAbbr;
    const eraObj = ERAS.find((e) => e.abbr === era);
    const eraId = eraObj?.id;

    let technosAdded = 0;
    let buildingsAdded = 0;
    let ottomanAreasAdded = 0;
    let ottomanTradePostsAdded = 0;
    let duplicatesSkipped = 0;

    try {
      // ── 1. TECHNOS ──────────────────────────────────────────────────────
      if (presetSelection.technos && eraId) {
        const technologies = getTechnologiesByEra(eraId);
        const toAdd: Array<{ id: string; hidden: number; cp: number }> = [];

        for (const techno of technologies) {
          const existing = await db.technos.get(techno.id);
          if (!existing) toAdd.push({ id: techno.id, hidden: 0, cp: 0 });
          else duplicatesSkipped++;
        }

        if (toAdd.length > 0) {
          await db.technos.bulkPut(toAdd);
          technosAdded = toAdd.length;
          queryClient.invalidateQueries({ queryKey: ["technos"] });
          selectEra(eraId);
        }
      }

      // ── 2. BUILDINGS / OTTOMAN AREAS / OTTOMAN TRADE POSTS ──────────────
      if (presetSelection.selectedSections.size > 0) {
        const buildingsToAdd: Array<{
          id: string;
          qty: number;
          hidden: number;
        }> = [];
        const areasToAdd: Array<{ id: string; hidden: number }> = [];
        const tradePostsToAdd: Array<{
          id: string;
          levels: {
            unlock: number;
            lvl2: number;
            lvl3: number;
            lvl4: number;
            lvl5: number;
            lvl6: number;
          };
          hidden: number;
        }> = [];

        for (const sectionId of presetSelection.selectedSections) {
          const section = PRESET_SECTIONS.find((s) => s.id === sectionId);
          if (!section) continue;

          const entries = getEntriesForEra(section, era);

          for (const entry of entries) {
            // ── Ottoman Area ─────────────────────────────────────────────
            if (entry.kind === "ottoman_area") {
              const e = entry as OttomanAreaEntry;
              const existing = await db.ottomanAreas.get(e.areaId);
              if (!existing) areasToAdd.push({ id: e.areaId, hidden: 0 });
              else duplicatesSkipped++;

              // ── Ottoman Trade Post ────────────────────────────────────────
            } else if (entry.kind === "ottoman_tradepost") {
              const e = entry as OttomanTradePostEntry;
              const existing = await db.ottomanTradePosts.get(e.tradePostId);
              if (!existing) {
                tradePostsToAdd.push({
                  id: e.tradePostId,
                  levels: {
                    unlock: 0,
                    lvl2: 0,
                    lvl3: 0,
                    lvl4: 0,
                    lvl5: 0,
                    lvl6: 0,
                  },
                  hidden: 0,
                });
              } else {
                duplicatesSkipped++;
              }

              // ── Building (default) ────────────────────────────────────────
            } else {
              const e = entry as BuildingEntry;
              // Format: {category}_{buildingId}_{type}_{era}_{level}
              const buildingId = `${section.category}_${e.buildingId}_${e.type}_${e.era}_${e.level}`;
              const existing = await db.buildings.get(buildingId);
              if (!existing) {
                buildingsToAdd.push({ id: buildingId, qty: e.qty, hidden: 0 });
              } else {
                duplicatesSkipped++;
              }
            }
          }
        }

        if (buildingsToAdd.length > 0) {
          await db.buildings.bulkPut(buildingsToAdd);
          buildingsAdded = buildingsToAdd.length;
          queryClient.invalidateQueries({ queryKey: ["buildings"] });
        }

        if (areasToAdd.length > 0) {
          await db.ottomanAreas.bulkPut(areasToAdd);
          ottomanAreasAdded = areasToAdd.length;
          queryClient.invalidateQueries({ queryKey: ["ottoman-areas"] });
        }

        if (tradePostsToAdd.length > 0) {
          await db.ottomanTradePosts.bulkPut(tradePostsToAdd);
          ottomanTradePostsAdded = tradePostsToAdd.length;
          queryClient.invalidateQueries({ queryKey: ["ottoman-tradeposts"] });
        }
      }

      // ── 3. FEEDBACK ─────────────────────────────────────────────────────
      const totalAdded =
        technosAdded +
        buildingsAdded +
        ottomanAreasAdded +
        ottomanTradePostsAdded;
      if (totalAdded > 0) {
        const parts: string[] = [];
        if (technosAdded > 0) parts.push(`${technosAdded} technologies`);
        if (buildingsAdded > 0) parts.push(`${buildingsAdded} buildings`);
        if (ottomanAreasAdded > 0) parts.push(`${ottomanAreasAdded} areas`);
        if (ottomanTradePostsAdded > 0)
          parts.push(`${ottomanTradePostsAdded} trade posts`);

        toast.success(`${parts.join(" and ")} added`, {
          description:
            duplicatesSkipped > 0
              ? `${duplicatesSkipped} duplicates skipped`
              : undefined,
        });

        // Reset la sélection preset
        useAddElementStore.setState((state) => ({
          presetSelection: {
            ...state.presetSelection,
            technos: false,
            selectedSections: new Set(),
          },
        }));

        closeModal();
      } else if (duplicatesSkipped > 0) {
        toast.info("Everything already in the list", {
          description: `${duplicatesSkipped} items were already added`,
        });
      } else {
        toast.warning("Nothing to add", {
          description:
            "No data found for this era. Check preset-data.ts entries.",
        });
      }
    } catch (error) {
      console.error("❌ Failed to submit preset:", error);
      toast.error("Failed to add preset");
    } finally {
      setIsLoading(false);
    }
  };

  return { submit, isLoading };
}
