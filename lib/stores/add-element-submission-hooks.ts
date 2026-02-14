"use client";

import { toast } from "sonner";
import { useAddElementStore } from "./add-element-store";
import {
  useAddTechno,
  useAddOttomanArea,
  useAddOttomanTradePost,
} from "@/hooks/use-database";
import { getWikiDB } from "@/lib/db/schema";
import type {
  TechnoEntity,
  OttomanAreaEntity,
  OttomanTradePostEntity,
} from "@/lib/db/schema";
import { getAreaData, getTradePostByName } from "@/lib/ottoman-data-loader";
import { slugify } from "@/lib/utils";
import { ERAS } from "@/lib/catalog";
import { getTechnologiesByEra } from "@/data/technos-registry";

// ============================================================================
// TECHNO SUBMISSION
// ============================================================================

/**
 * Hook to add a single techno (technology from an era)
 */
export function useSubmitTechno() {
  const { closeModal } = useAddElementStore();
  const addTechno = useAddTechno();

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

    // ✅ Get ALL technologies for this era
    const technologies = getTechnologiesByEra(eraId);

    if (technologies.length === 0) {
      toast.error("No technologies found for this era");
      return;
    }

    const db = getWikiDB();
    const duplicates: string[] = [];
    const toAdd: TechnoEntity[] = [];

    // ✅ Check for duplicates for each technology
    for (const technoData of technologies) {
      const existing = await db.technos.get(technoData.id);

      if (existing) {
        duplicates.push(technoData.name);
      } else {
        // ✅ Parse costs to entity format
        const resources: Record<string, number> = {};
        const goods: Array<{ type: string; amount: number }> = [];

        Object.entries(technoData.costs).forEach(([key, value]) => {
          if (key === "goods" && Array.isArray(value)) {
            value.forEach((good) => {
              goods.push({
                type: slugify(good.resource),
                amount: good.amount,
              });
            });
          } else if (typeof value === "number") {
            resources[key] = value;
          }
        });

        // ✅ Create individual techno entity
        const techno: TechnoEntity = {
          id: technoData.id,
          name: technoData.name,
          category: "technology",
          era: era.abbr, // "EG", "LG", etc.
          eraId: eraId, // "early_gothic_era"
          column: technoData.column,
          allied: technoData.allied,
          costs: { resources, goods },
          hidden: false, // ✅ Par défaut non-caché
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        toAdd.push(techno);
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

    // ✅ Add all new technologies
    if (toAdd.length > 0) {
      try {
        await Promise.all(toAdd.map((techno) => addTechno.mutateAsync(techno)));
        toast.success(`${era.name} technologies added`);

        closeModal();
      } catch (error) {
        console.error("❌ Failed to add technologies:", error);
        toast.error("Failed to add technologies");
      }
    } else if (duplicates.length === technologies.length) {
      // All technologies already exist
      toast.info(`All technologies from ${era.name} are already added`);
    }
  };

  return {
    submit,
    isLoading: addTechno.isPending,
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
  const addArea = useAddOttomanArea();

  const submit = async () => {
    const selectedAreas = Array.from(ottomanSelection.selectedAreas);

    if (selectedAreas.length === 0) {
      toast.error("No areas selected");
      return;
    }

    const db = getWikiDB();
    const duplicates: number[] = [];
    const toAdd: OttomanAreaEntity[] = [];

    // Check for duplicates
    for (const areaIndex of selectedAreas) {
      const areaId = `ottoman_area_${areaIndex}`;
      const existing = await db.ottomanAreas.get(areaId);

      if (existing) {
        duplicates.push(areaIndex);
      } else {
        // Get area data
        const areaData = getAreaData(areaIndex);
        if (!areaData) continue;

        // Parse costs
        const resources: Record<string, number> = {};
        const goods: Array<{ type: string; amount: number }> = [];

        areaData.forEach((item) => {
          const resource = item.resource.toLowerCase();
          if (
            [
              "wheat",
              "pomegranate",
              "confection",
              "syrup",
              "mohair",
              "apricot",
              "tea",
              "brocade",
            ].includes(resource)
          ) {
            goods.push({
              type: slugify(resource),
              amount: item.amount,
            });
          } else {
            resources[resource] = item.amount;
          }
        });

        const area: OttomanAreaEntity = {
          id: areaId,
          areaIndex,
          costs: { resources, goods },
          hidden: false,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        toAdd.push(area);
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
        await Promise.all(toAdd.map((area) => addArea.mutateAsync(area)));
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
    isLoading: addArea.isPending,
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
  const addTradePost = useAddOttomanTradePost();

  const submit = async () => {
    const selectedTradePosts = Array.from(ottomanSelection.selectedTradePosts);

    if (selectedTradePosts.length === 0) {
      toast.error("No trade posts selected");
      return;
    }

    const db = getWikiDB();
    const duplicates: string[] = [];
    const toAdd: OttomanTradePostEntity[] = [];

    // Check for duplicates
    for (const tradePostName of selectedTradePosts) {
      const tradePostId = `ottoman_tp_${slugify(tradePostName)}`;
      const existing = await db.ottomanTradePosts.get(tradePostId);

      if (existing) {
        duplicates.push(tradePostName);
      } else {
        // Get trade post data
        const tradePostData = getTradePostByName(tradePostName);
        if (!tradePostData) continue;

        // Default levels: all unchecked (false = show costs)
        const levels = {
          unlock: false,
          lvl2: false,
          lvl3: false,
          lvl4: false,
          lvl5: false,
        };

        // ✅ Calculate costs using the same logic as ottoman-trade-posts.ts
        const resources: Record<string, number> = {};
        const goodsMap = new Map<string, number>();

        const ottomanGoods = [
          "wheat",
          "pomegranate",
          "confection",
          "syrup",
          "mohair",
          "apricot",
          "tea",
          "brocade",
        ];

        // Process all levels (1-5) since all checkboxes are unchecked
        [1, 2, 3, 4, 5].forEach((levelNum) => {
          const levelData = (
            tradePostData.levels as unknown as {
              [key: number]: Array<{ resource: string; amount: number }>;
            }
          )[levelNum];
          if (!levelData || !Array.isArray(levelData)) return;

          levelData.forEach((item: { resource: string; amount: number }) => {
            const resource = item.resource.toLowerCase();
            const amount = item.amount;

            let normalizedResource = resource;
            if (
              resource.includes("_eg") ||
              resource.includes("lategothicera")
            ) {
              normalizedResource = slugify(resource);
            }

            if (
              ottomanGoods.includes(resource) ||
              normalizedResource.match(/^(primary|secondary|tertiary)_/i)
            ) {
              const normalized = slugify(resource);
              goodsMap.set(
                normalized,
                (goodsMap.get(normalized) || 0) + amount,
              );
            } else {
              resources[resource] =
                ((resources[resource] as number) || 0) + amount;
            }
          });
        });

        const goods = Array.from(goodsMap.entries()).map(([type, amount]) => ({
          type,
          amount,
        }));

        const tradePost: OttomanTradePostEntity = {
          id: tradePostId,
          name: tradePostData.name,
          area: tradePostData.area,
          resource: tradePostData.resource,
          levels,
          costs: { resources, goods },
          sourceData: {
            levels: tradePostData.levels as unknown as {
              [key: number]: Array<{ resource: string; amount: number }>;
            },
          },
          hidden: false,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        toAdd.push(tradePost);
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
        await Promise.all(toAdd.map((tp) => addTradePost.mutateAsync(tp)));
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
    isLoading: addTradePost.isPending,
  };
}
