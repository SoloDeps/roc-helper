"use client";

// ============================================================================
// useSubmitPreset — à ajouter dans add-element-submission-hooks.ts
//
// Logique :
//  1. Pour chaque section cochée → récupère les entries filtrées par era
//  2. Génère l'ID : `${category}_${buildingId}_${type}_${era}_${level}`
//     Pour les workshops : `${category}_${priority}_workshop_${type}_${era}_${level}`
//  3. Skip les doublons (existe déjà en DB)
//  4. bulkPut tout en une fois
//  5. Si technos cochées → réutilise la logique de useSubmitTechno
// ============================================================================

import { useState } from "react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useAddElementStore } from "./add-element-store";
import { getWikiDB } from "@/lib/db/schema";
import { ERAS } from "@/lib/catalog";
import { getTechnologiesByEra } from "@/data/technos-registry";
import { PRESET_SECTIONS, getEntriesForEra } from "@/data/presets";
import { buildingsAbbr, type EraAbbr } from "@/lib/constants";
import { useSelectEra } from "./technology-page-store";

// ============================================================================
// WORKSHOP HELPERS
// ============================================================================

const PRIORITIES = ["primary", "secondary", "tertiary"] as const;
type Priority = (typeof PRIORITIES)[number];

/**
 * Pour un era donné, retourne l'index du groupe de workshops correspondant.
 * Ex: "BA" → 0 (groupe "Bronze Age ~ Roman Empire")
 */
function getWorkshopGroupIndex(era: EraAbbr): number {
  return buildingsAbbr.findIndex((group) =>
    group.abbreviations.some((abbr) => abbr === era),
  );
}

/**
 * Pour un buildingId hardcodé dans un preset (ex: "artisan", "scribe"),
 * retourne sa position (primary/secondary/tertiary) dans son groupe.
 * Ex: "artisan" dans groupe 0 → "primary" si l'ordre est [Tailor, Stone Mason, Artisan]
 * On se base sur l'ordre dans buildingsAbbr.buildings.
 */
function getBuildingPositionInGroup(
  buildingId: string,
  groupIndex: number,
): Priority | null {
  if (groupIndex < 0 || groupIndex >= buildingsAbbr.length) return null;
  const buildings = buildingsAbbr[groupIndex].buildings;
  // Normalise : "stone_mason" → "Stone Mason", "spice_merchant" → "Spice Merchant"
  const normalize = (s: string) =>
    s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const idx = buildings.findIndex(
    (b) =>
      b.toLowerCase() === normalize(buildingId).toLowerCase() ||
      b.toLowerCase().replace(/\s+/g, "_") === buildingId.toLowerCase(),
  );
  return idx >= 0 ? PRIORITIES[idx] : null;
}

/**
 * Vérifie si une section est une section workshops capitale.
 */
function isCapitalWorkshopSection(sectionId: string): boolean {
  return sectionId.startsWith("capital_workshops_");
}

// Helper : eraAbbr → eraId (ex: "LG" → "late_gothic_era")
function eraAbbrToId(abbr: string): string | undefined {
  return ERAS.find((e) => e.abbr === abbr)?.id;
}

export function useSubmitPreset() {
  const [isLoading, setIsLoading] = useState(false);
  const { presetSelection, closeModal } = useAddElementStore();
  const queryClient = useQueryClient();
  const selectEra = useSelectEra();

  const submit = async () => {
    setIsLoading(true);
    const db = getWikiDB();
    const era = presetSelection.era as EraAbbr;
    const eraId = eraAbbrToId(era);

    let technosAdded = 0;
    let buildingsAdded = 0;
    let duplicatesSkipped = 0;

    try {
      // ────────────────────────────────────────────
      // 1. TECHNOS
      // ────────────────────────────────────────────
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
          if (eraId) selectEra(eraId);
        }
      }

      // ────────────────────────────────────────────
      // 2. BUILDINGS (sections cochées)
      // ────────────────────────────────────────────
      if (presetSelection.selectedSections.size > 0) {
        const toAdd: Array<{ id: string; qty: number; hidden: number }> = [];

        for (const sectionId of presetSelection.selectedSections) {
          const section = PRESET_SECTIONS.find((s) => s.id === sectionId);
          if (!section) continue;

          const entries = getEntriesForEra(section, era);
          const isWorkshopSection = isCapitalWorkshopSection(sectionId);

          for (const entry of entries) {
            // Skip ottoman entries — only buildings here
            if (
              entry.kind === "ottoman_area" ||
              entry.kind === "ottoman_tradepost"
            )
              continue;

            let buildingId: string;

            if (isWorkshopSection) {
              // ── Workshops : ID basé sur la position (primary/secondary/tertiary)
              // au lieu du nom hardcodé, pour rester stable quand le joueur
              // change ses sélections dans le workshop modal.
              const groupIndex = getWorkshopGroupIndex(entry.era);
              const position = getBuildingPositionInGroup(
                entry.buildingId,
                groupIndex,
              );

              if (!position) {
                // Fallback : buildingId concret si on ne trouve pas la position
                buildingId = `${section.category}_${entry.buildingId}_${entry.type}_${entry.era}_${entry.level}`;
              } else {
                // ID stable basé sur la position
                buildingId = `${section.category}_${position}_workshop_${entry.type}_${entry.era}_${entry.level}`;
              }
            } else {
              // Format ID standard : `{category}_{buildingId}_{type}_{era}_{level}`
              buildingId = `${section.category}_${entry.buildingId}_${entry.type}_${entry.era}_${entry.level}`;
            }

            const existing = await db.buildings.get(buildingId);
            if (!existing) {
              toAdd.push({ id: buildingId, qty: entry.qty, hidden: 0 });
            } else {
              duplicatesSkipped++;
            }
          }
        }

        if (toAdd.length > 0) {
          await db.buildings.bulkPut(toAdd);
          buildingsAdded = toAdd.length;
          queryClient.invalidateQueries({ queryKey: ["buildings"] });
        }
      }

      // ────────────────────────────────────────────
      // 3. FEEDBACK
      // ────────────────────────────────────────────
      if (technosAdded > 0 || buildingsAdded > 0) {
        const parts: string[] = [];
        if (technosAdded > 0) parts.push(`${technosAdded} technologies`);
        if (buildingsAdded > 0) parts.push(`${buildingsAdded} buildings`);
        toast.success(`${parts.join(" and ")} added`, {
          description:
            duplicatesSkipped > 0
              ? `${duplicatesSkipped} duplicates skipped`
              : undefined,
        });
        // Reset selection + fermer
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
            "No data found for this era. Check that presets contains entries for this era.",
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
