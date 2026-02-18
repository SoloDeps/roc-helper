"use client";

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { getCatalogItem } from "@/lib/catalog";
import { getBuildingData } from "@/lib/element-data-loader";
import { getWikiDB } from "@/lib/db/schema";
import { useAddBuilding } from "@/hooks/use-database";
import { slugify } from "@/lib/utils";
import { toast } from "sonner";

// ============================================================================
// TYPES
// ============================================================================

export type FlowStep =
  | "category"
  | "subcategory"
  | "element"
  | "configuration"
  | "ottoman_selection";

export interface NavigationPath {
  categoryId?: string;
  subcategoryId?: string;
  elementId?: string;
}

export interface OttomanSelection {
  selectedAreas: Set<number>;
  selectedTradePosts: Set<string>;
}

export interface LevelConfig {
  level: number;
  type: "construction" | "upgrade";
  selected: boolean;
  era: string;
}

export interface ElementConfig {
  selectedLevels: LevelConfig[];
  quantity: number;
  selectedEra: string;
  buildingType: "construction" | "upgrade";
}

// ============================================================================
// STORE STATE
// ============================================================================

interface AddElementState {
  isOpen: boolean;
  currentStep: FlowStep;
  directTechnologyMode: boolean;
  path: NavigationPath;
  config: ElementConfig;
  ottomanSelection: OttomanSelection;
  breadcrumbTrail: Array<{ id: string; name: string; step: FlowStep }>;
  lastAddedElementId: string | null;
  lastUsedEra: string;

  openModal: () => void;
  closeModal: () => void;
  resetFlow: () => void;
  setDirectTechnologyMode: (enabled: boolean) => void;

  selectCategory: (categoryId: string) => void;
  selectSubcategory: (subcategoryId: string) => void;
  selectElement: (elementId: string) => void;
  goBack: () => void;
  navigateToBreadcrumb: (stepIndex: number) => void;

  updateConfig: (config: Partial<ElementConfig>) => void;
  toggleLevel: (level: number) => void;
  setSelectedEra: (era: string) => void;
  setBuildingType: (type: "construction" | "upgrade") => void;

  toggleOttomanArea: (areaIndex: number) => void;
  toggleOttomanTradePost: (tradePostName: string) => void;
  clearOttomanSelection: () => void;

  isTechnologyPath: () => boolean;
  isOttomanPath: () => boolean;
  updateBreadcrumbTrail: () => void;
}

const DEFAULT_CONFIG: ElementConfig = {
  selectedLevels: [],
  quantity: 1,
  selectedEra: "",
  buildingType: "upgrade",
};

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Génère un ID unique pour une entité building
 * Format: {category}_{elementId}_{type}_{era}_{level}
 */
function generateBuildingId(
  category: string,
  elementId: string,
  era: string,
  level: number,
  type: "construction" | "upgrade",
): string {
  return `${category}_${elementId}_${type}_${era}_${level}`;
}

/**
 * Parse les coûts depuis le format data vers le format entity
 */
function parseBuildingCosts(rawCosts: any): {
  resources: Record<string, number>;
  goods: Array<{ type: string; amount: number }>;
} {
  const resources: Record<string, number> = {};
  const goods: Array<{ type: string; amount: number }> = [];

  Object.entries(rawCosts).forEach(([key, value]) => {
    if (key === "goods" && Array.isArray(value)) {
      value.forEach((item: any) => {
        goods.push({
          type: slugify(item.resource || item.resource),
          amount: item.amount,
        });
      });
    } else if (typeof value === "number") {
      resources[key] = value;
    }
  });

  return { resources, goods };
}

// ============================================================================
// STORE IMPLEMENTATION
// ============================================================================

export const useAddElementStore = create<AddElementState>()(
  devtools(
    persist(
      (set, get) => ({
        isOpen: false,
        currentStep: "category",
        directTechnologyMode: false,
        path: {},
        config: DEFAULT_CONFIG,
        ottomanSelection: {
          selectedAreas: new Set(),
          selectedTradePosts: new Set(),
        },
        breadcrumbTrail: [],
        lastAddedElementId: null,
        lastUsedEra: "LG",

        openModal: () => set({ isOpen: true }),

        closeModal: () => {
          set({ isOpen: false });
          setTimeout(() => get().resetFlow(), 300);
        },

        resetFlow: () => {
          set({
            currentStep: "category",
            directTechnologyMode: false,
            path: {},
            config: DEFAULT_CONFIG,
            ottomanSelection: {
              selectedAreas: new Set(),
              selectedTradePosts: new Set(),
            },
            breadcrumbTrail: [],
          });
        },

        setDirectTechnologyMode: (enabled) => {
          set({ directTechnologyMode: enabled });
        },

        isTechnologyPath: () => {
          const { path } = get();
          return path.categoryId === "technology";
        },

        isOttomanPath: () => {
          const { path } = get();
          return path.categoryId === "ottoman";
        },

        selectCategory: (categoryId) => {
          const isTech = categoryId === "technology";

          set({
            path: { categoryId },
            currentStep: isTech ? "element" : "subcategory",
          });

          get().updateBreadcrumbTrail();
        },

        selectSubcategory: (subcategoryId) => {
          const { path } = get();
          const isOttoman = path.categoryId === "ottoman";

          if (
            isOttoman &&
            (subcategoryId === "ottoman_areas" ||
              subcategoryId === "ottoman_tradeposts")
          ) {
            set((state) => ({
              path: { ...state.path, subcategoryId },
              currentStep: "ottoman_selection",
            }));
          } else {
            set((state) => ({
              path: { ...state.path, subcategoryId },
              currentStep: "element",
            }));
          }
          get().updateBreadcrumbTrail();
        },

        selectElement: (elementId) => {
          set((state) => ({
            path: { ...state.path, elementId },
            currentStep: "configuration",
          }));
          get().updateBreadcrumbTrail();
        },

        toggleOttomanArea: (areaIndex) => {
          set((state) => {
            const newSelectedAreas = new Set(
              state.ottomanSelection.selectedAreas,
            );
            if (newSelectedAreas.has(areaIndex)) {
              newSelectedAreas.delete(areaIndex);
            } else {
              newSelectedAreas.add(areaIndex);
            }
            return {
              ottomanSelection: {
                ...state.ottomanSelection,
                selectedAreas: newSelectedAreas,
              },
            };
          });
        },

        toggleOttomanTradePost: (tradePostName) => {
          set((state) => {
            const newSelectedTradePosts = new Set(
              state.ottomanSelection.selectedTradePosts,
            );
            if (newSelectedTradePosts.has(tradePostName)) {
              newSelectedTradePosts.delete(tradePostName);
            } else {
              newSelectedTradePosts.add(tradePostName);
            }
            return {
              ottomanSelection: {
                ...state.ottomanSelection,
                selectedTradePosts: newSelectedTradePosts,
              },
            };
          });
        },

        clearOttomanSelection: () => {
          set({
            ottomanSelection: {
              selectedAreas: new Set(),
              selectedTradePosts: new Set(),
            },
          });
        },

        goBack: () => {
          set((state) => {
            const isTech = state.path.categoryId === "technology";
            const isOttoman = state.path.categoryId === "ottoman";

            if (state.currentStep === "configuration") {
              return {
                currentStep: "element",
                path: { ...state.path, elementId: undefined },
              };
            }

            if (state.currentStep === "ottoman_selection") {
              return {
                currentStep: "subcategory",
                path: { ...state.path, subcategoryId: undefined },
              };
            }

            if (state.currentStep === "element") {
              if (isTech) {
                return {
                  currentStep: "category",
                  path: { categoryId: undefined },
                };
              }
              return {
                currentStep: "subcategory",
                path: { ...state.path, subcategoryId: undefined },
              };
            }

            if (state.currentStep === "subcategory") {
              return {
                currentStep: "category",
                path: { categoryId: undefined },
              };
            }

            return state;
          });

          setTimeout(() => get().updateBreadcrumbTrail(), 0);
        },

        navigateToBreadcrumb: (stepIndex) => {
          const { breadcrumbTrail } = get();
          if (stepIndex >= breadcrumbTrail.length) return;

          const targetBreadcrumb = breadcrumbTrail[stepIndex];
          const targetStep = targetBreadcrumb.step;

          set((state) => {
            const newPath: NavigationPath = {};

            if (
              targetStep === "category" ||
              targetStep === "subcategory" ||
              targetStep === "element" ||
              targetStep === "configuration"
            ) {
              breadcrumbTrail.slice(0, stepIndex + 1).forEach((crumb) => {
                if (crumb.step === "category") {
                  newPath.categoryId = crumb.id;
                } else if (crumb.step === "subcategory") {
                  newPath.subcategoryId = crumb.id;
                } else if (crumb.step === "element") {
                  newPath.elementId = crumb.id;
                }
              });
            }

            return {
              currentStep: targetStep,
              path: newPath,
            };
          });

          setTimeout(() => get().updateBreadcrumbTrail(), 0);
        },

        updateBreadcrumbTrail: () => {
          set((state) => {
            const trail: Array<{ id: string; name: string; step: FlowStep }> =
              [];

            if (state.path.categoryId) {
              const item = getCatalogItem(state.path.categoryId);
              if (item && "name" in item) {
                trail.push({
                  id: state.path.categoryId,
                  name: item.name,
                  step: "category",
                });
              }
            }

            if (state.path.subcategoryId) {
              const item = getCatalogItem(state.path.subcategoryId);
              if (item && "name" in item) {
                trail.push({
                  id: state.path.subcategoryId,
                  name: item.name,
                  step: "subcategory",
                });
              }
            }

            if (state.path.elementId) {
              const item = getCatalogItem(state.path.elementId);
              if (item && "name" in item) {
                trail.push({
                  id: state.path.elementId,
                  name: item.name,
                  step: "element",
                });
              }
            }

            return { breadcrumbTrail: trail };
          });
        },

        updateConfig: (newConfig) =>
          set((state) => ({
            config: { ...state.config, ...newConfig },
          })),

        toggleLevel: (level) =>
          set((state) => {
            const levels = [...state.config.selectedLevels];
            const index = levels.findIndex((l) => l.level === level);

            if (index >= 0) {
              levels[index] = {
                ...levels[index],
                selected: !levels[index].selected,
              };
            } else {
              levels.push({
                level,
                type: state.config.buildingType,
                era: state.config.selectedEra,
                selected: true,
              });
            }

            return {
              config: {
                ...state.config,
                selectedLevels: levels,
              },
            };
          }),

        setSelectedEra: (era) =>
          set((state) => ({
            config: { ...state.config, selectedEra: era, selectedLevels: [] },
            lastUsedEra: era,
          })),

        setBuildingType: (type) =>
          set((state) => ({
            config: { ...state.config, buildingType: type, selectedLevels: [] },
          })),
      }),
      {
        name: "add-element-storage",
        partialize: (state) => ({
          lastUsedEra: state.lastUsedEra,
        }),
      },
    ),
    { name: "AddElementStore" },
  ),
);

// ============================================================================
// HOOK FOR SUBMISSION
// ============================================================================

export function useSubmitElement() {
  const { path, config, closeModal } = useAddElementStore();
  const addBuilding = useAddBuilding();

  const submit = async () => {
    if (!path.elementId || !path.categoryId) {
      throw new Error("Invalid path: missing category or element");
    }

    const id = `${path.categoryId}_${path.elementId}`;
    const elementData = getBuildingData(id);
    if (!elementData) {
      throw new Error("Element data not found");
    }

    const catalogItem = getCatalogItem(path.elementId);
    if (!catalogItem || !("name" in catalogItem)) {
      throw new Error("Catalog item not found");
    }

    const selectedLevels = config.selectedLevels.filter((l) => l.selected);
    if (selectedLevels.length === 0) {
      throw new Error("No levels selected");
    }

    // Check for duplicates
    const db = getWikiDB();
    const duplicateItems: string[] = [];

    for (const levelConfig of selectedLevels) {
      const buildingId = generateBuildingId(
        path.categoryId!,
        path.elementId!,
        config.selectedEra,
        levelConfig.level,
        config.buildingType,
      );

      const existing = await db.buildings.get(buildingId);
      if (existing) {
        const typeLabel =
          config.buildingType.charAt(0).toUpperCase() +
          config.buildingType.slice(1);
        duplicateItems.push(
          `${catalogItem.name} Lvl ${levelConfig.level} ${typeLabel}`,
        );
      }
    }

    if (duplicateItems.length > 0) {
      const description = duplicateItems.map((item) => `• ${item}`).join("\n");
      toast.error("Elements already in the list", {
        description: description,
        position: "top-center",
        duration: 3500,
        style: {
          whiteSpace: "pre-line",
        },
      });
      return;
    }

    try {
      let firstElementId: string | null = null;

      const promises = selectedLevels.map(async (levelConfig) => {
        const levelData = elementData.levels.find(
          (l) => l.level === levelConfig.level,
        );

        if (!levelData) {
          console.warn(`Level ${levelConfig.level} not found, skipping`);
          return;
        }

        const rawCosts = levelData[config.buildingType];
        if (!rawCosts) {
          console.warn(
            `No ${config.buildingType} costs for level ${levelConfig.level}, skipping`,
          );
          return;
        }

        // Generate building ID
        const buildingId = generateBuildingId(
          path.categoryId!,
          path.elementId!,
          config.selectedEra,
          levelConfig.level,
          config.buildingType,
        );

        if (!firstElementId) {
          firstElementId = `${path.categoryId}_${path.elementId}`;
        }

        // Add to database with minimal data
        await addBuilding.mutateAsync({
          buildingId,
          quantity: config.quantity,
        });
      });

      await Promise.all(promises);

      toast.success(
        `${selectedLevels.length} ${catalogItem.name} added successfully`,
      );

      useAddElementStore.setState({ lastAddedElementId: firstElementId });

      closeModal();
    } catch (error) {
      console.error("❌ Failed to submit elements:", error);
      throw error;
    }
  };

  return {
    submit,
    isLoading: addBuilding.isPending,
    error: addBuilding.error,
  };
}

// ============================================================================
// SELECTOR HOOKS
// ============================================================================

export const useCurrentStep = () =>
  useAddElementStore((state) => state.currentStep);

export const useNavigationPath = () =>
  useAddElementStore((state) => state.path);

export const useElementConfig = () =>
  useAddElementStore((state) => state.config);

export const useModalState = () => useAddElementStore((state) => state.isOpen);

export const useIsTechnologyPath = () =>
  useAddElementStore((state) => state.isTechnologyPath());

export const useIsOttomanPath = () =>
  useAddElementStore((state) => state.isOttomanPath());

export const useOttomanSelection = () =>
  useAddElementStore((state) => state.ottomanSelection);

export const useBreadcrumbTrail = () =>
  useAddElementStore((state) => state.breadcrumbTrail);

export const useLastUsedEra = () =>
  useAddElementStore((state) => state.lastUsedEra);
