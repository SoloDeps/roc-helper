"use client";

import { toast } from "sonner";
import { useAddElementStore } from "./add-element-store";
import {
  getWikiDB,
  techIdToDbId,
  areaIndexToId,
  tradePostIndexToId,
} from "@/lib/db/schema";
import { ERAS } from "@/lib/catalog";
import { getTechnologiesByEra } from "@/data/technos-registry";
import { getAllTradePosts } from "@/lib/ottoman-data-loader";
import { useSelectEra } from "./technology-page-store";
import { useQueryClient } from "@tanstack/react-query";

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
    const toAdd: Array<{ id: string; hidden: number }> = [];

    for (const technoData of technologies) {
      const dbId = techIdToDbId(technoData.id);
      const existing = await db.technos.get(dbId);
      if (existing) {
        duplicates.push(technoData.name);
      } else {
        toAdd.push({ id: dbId, hidden: 0 });
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
          levels: { unlock: 0, lvl2: 0, lvl3: 0, lvl4: 0, lvl5: 0 },
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
