"use client";

import { toast } from "sonner";
import { useAddElementStore } from "./add-element-store";
import { getWikiDB } from "@/lib/db/schema";
import { slugify } from "@/lib/utils";
import { ERAS } from "@/lib/catalog";
import { getTechnologiesByEra } from "@/data/technos-registry";
import { useSelectEra } from "./technology-page-store";
import { useQueryClient } from "@tanstack/react-query";

const now = () => Date.now();

// ============================================================================
// TECHNO SUBMISSION
// ============================================================================

/**
 * Hook to add a single techno (technology from an era)
 */
export function useSubmitTechno() {
  const { closeModal } = useAddElementStore();
  const selectEra = useSelectEra();
  const queryClient = useQueryClient();

  const submit = async (eraId: string) => {
    if (!eraId) {
      toast.error("No era selected");
      return;
    }

    // Get era info
    const era = ERAS.find((e) => e.id === eraId);
    if (!era) {
      toast.error("Era not found");
      return;
    }

    // Get ALL technologies for this era
    const technologies = getTechnologiesByEra(eraId);

    if (technologies.length === 0) {
      toast.error("No technologies found for this era");
      return;
    }

    const db = getWikiDB();
    const duplicates: string[] = [];
    const toAdd: Array<{ id: string; hidden: boolean; updatedAt: number }> = [];

    // Check for duplicates for each technology
    for (const technoData of technologies) {
      const existing = await db.technos.get(technoData.id);

      if (existing) {
        duplicates.push(technoData.name);
      } else {
        // Create minimal techno entity
        toAdd.push({
          id: technoData.id,
          hidden: false,
          updatedAt: now(),
        });
      }
    }

    // Show duplicate warning
    if (duplicates.length > 0) {
      const description = duplicates.map((name) => `• ${name}`).join("\n");
      toast.error("Some technologies are already in the list", {
        description,
        duration: 4000,
        style: { whiteSpace: "pre-line" },
      });
    }

    // Add all new technologies
    if (toAdd.length > 0) {
      try {
        await db.technos.bulkPut(toAdd);
        queryClient.invalidateQueries({ queryKey: ["technos"] });
        toast.success(`${era.name} technologies added`);

        // Auto-select the newly added era
        selectEra(eraId);

        closeModal();
      } catch (error) {
        console.error("❌ Failed to add technologies:", error);
        toast.error("Failed to add technologies");
      }
    } else if (duplicates.length === technologies.length) {
      // All technologies already exist
      toast.info(`All technologies from ${era.name} are already added`);
    }

    // Auto-select even if already present
    selectEra(eraId);
    closeModal();
  };

  return {
    submit,
    isLoading: false,
  };
}

// ============================================================================
// OTTOMAN AREAS SUBMISSION
// ============================================================================

/**
 * Hook to add multiple Ottoman areas
 */
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
    const toAdd: Array<{ id: string; hidden: boolean; updatedAt: number }> = [];

    // Check for duplicates
    for (const areaIndex of selectedAreas) {
      const areaId = `ottoman_area_${areaIndex}`;
      const existing = await db.ottomanAreas.get(areaId);

      if (existing) {
        duplicates.push(areaIndex);
      } else {
        toAdd.push({
          id: areaId,
          hidden: false,
          updatedAt: now(),
        });
      }
    }

    // Show duplicate warning
    if (duplicates.length > 0) {
      const description = `• Areas: ${duplicates.join(", ")}`;
      toast.error("Some areas are already in the list", {
        description,
        position: "top-center",
        duration: 3000,
        style: { whiteSpace: "pre-line" },
      });
    }

    // Add new areas
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
      // All selected areas are duplicates
      return;
    }
  };

  return {
    submit,
    isLoading: false,
  };
}

// ============================================================================
// OTTOMAN TRADE POSTS SUBMISSION
// ============================================================================

/**
 * Hook to add multiple Ottoman trade posts
 */
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
    const duplicates: string[] = [];
    const toAdd: Array<{
      id: string;
      levels: {
        unlock: boolean;
        lvl2: boolean;
        lvl3: boolean;
        lvl4: boolean;
        lvl5: boolean;
      };
      hidden: boolean;
      updatedAt: number;
    }> = [];

    // Check for duplicates
    for (const tradePostName of selectedTradePosts) {
      const tradePostId = `ottoman_tp_${slugify(tradePostName)}`;
      const existing = await db.ottomanTradePosts.get(tradePostId);

      if (existing) {
        duplicates.push(tradePostName);
      } else {
        // Default levels: all unchecked (false = show costs)
        toAdd.push({
          id: tradePostId,
          levels: {
            unlock: false,
            lvl2: false,
            lvl3: false,
            lvl4: false,
            lvl5: false,
          },
          hidden: false,
          updatedAt: now(),
        });
      }
    }

    // Show duplicate warning
    if (duplicates.length > 0) {
      const description = `• Trade posts: ${duplicates.join(", ")}`;
      toast.error("Some trade posts are already in the list", {
        description,
        position: "top-center",
        duration: 3500,
        style: { whiteSpace: "pre-line" },
      });
    }

    // Add new trade posts
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
      // All selected trade posts are duplicates
      return;
    }
  };

  return {
    submit,
    isLoading: false,
  };
}
