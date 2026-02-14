"use client";

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { getCatalogItem } from "@/lib/catalog";
import { getBuildingData } from "@/lib/element-data-loader";
import { generateEntityId, parseCostsToEntity } from "@/lib/db/schema";
import type { BuildingEntity } from "@/lib/db/schema";
import { useAddBuilding } from "@/hooks/use-database";
import { getWikiDB } from "@/lib/db/schema";
import { toast } from "sonner";

// ============================================================================
// TYPES
// ============================================================================

export type FlowStep =
  | "category"
  | "subcategory"
  | "element"
  | "configuration"
  | "ottoman_selection"; // New: Multi-selection for areas/tradeposts

export interface NavigationPath {
  categoryId?: string;
  subcategoryId?: string;
  elementId?: string;
}

// Ottoman-specific selection state
export interface OttomanSelection {
  selectedAreas: Set<number>; // Area indices (1-18)
  selectedTradePosts: Set<string>; // Trade post names
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
  // UI State
  isOpen: boolean;
  currentStep: FlowStep;

  // Navigation
  path: NavigationPath;

  // Configuration
  config: ElementConfig;

  // Ottoman Selection State
  ottomanSelection: OttomanSelection;

  // Breadcrumb
  breadcrumbTrail: Array<{ id: string; name: string; step: FlowStep }>;

  // Track last added element ID for opening accordion
  lastAddedElementId: string | null;

  // Last used era for default selection
  lastUsedEra: string;

  // Actions - Modal
  openModal: () => void;
  closeModal: () => void;
  resetFlow: () => void;

  // Actions - Navigation
  selectCategory: (categoryId: string) => void;
  selectSubcategory: (subcategoryId: string) => void;
  selectElement: (elementId: string) => void;
  goBack: () => void;
  navigateToBreadcrumb: (stepIndex: number) => void;

  // Actions - Configuration
  updateConfig: (config: Partial<ElementConfig>) => void;
  toggleLevel: (level: number) => void;
  setSelectedEra: (era: string) => void;
  setBuildingType: (type: "construction" | "upgrade") => void;

  // Actions - Ottoman Selection
  toggleOttomanArea: (areaIndex: number) => void;
  toggleOttomanTradePost: (tradePostName: string) => void;
  clearOttomanSelection: () => void;

  // Helpers
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
// STORE IMPLEMENTATION
// ============================================================================

export const useAddElementStore = create<AddElementState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        isOpen: false,
        currentStep: "category",
        path: {},
        config: DEFAULT_CONFIG,
        ottomanSelection: {
          selectedAreas: new Set(),
          selectedTradePosts: new Set(),
        },
        breadcrumbTrail: [],
        lastAddedElementId: null,
        lastUsedEra: "LG", // Default to Late Gothic Era

        // UI actions
        openModal: () => set({ isOpen: true }),

        closeModal: () => {
          set({ isOpen: false });
          setTimeout(() => get().resetFlow(), 300);
        },

        resetFlow: () => {
          set({
            currentStep: "category",
            path: {},
            config: DEFAULT_CONFIG,
            ottomanSelection: {
              selectedAreas: new Set(),
              selectedTradePosts: new Set(),
            },
            breadcrumbTrail: [],
          });
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
          const isOttoman = categoryId === "ottoman";

          set({
            path: { categoryId },
            // Pour Technology, aller directement à "element" (liste des eras)
            // Pour Ottoman, aller à "subcategory" (areas/tradeposts)
            // Pour les autres, aller à "subcategory" (sous-catégories normales)
            currentStep: isTech ? "element" : "subcategory",
          });

          get().updateBreadcrumbTrail();
        },

        selectSubcategory: (subcategoryId) => {
          const { path } = get();
          const isOttoman = path.categoryId === "ottoman";

          // For Ottoman areas/tradeposts, go directly to selection step
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

            switch (state.currentStep) {
              case "subcategory":
                return {
                  currentStep: "category",
                  path: {},
                };

              case "element":
                // Si on est dans technology, revenir à category
                // Sinon revenir à subcategory
                if (isTech) {
                  return {
                    currentStep: "category",
                    path: {},
                  };
                }
                return {
                  currentStep: "subcategory",
                  path: { categoryId: state.path.categoryId },
                };

              case "ottoman_selection":
                // Clear selection when going back
                return {
                  currentStep: "subcategory",
                  path: { categoryId: state.path.categoryId },
                  ottomanSelection: {
                    selectedAreas: new Set(),
                    selectedTradePosts: new Set(),
                  },
                };

              case "configuration":
                if (isTech) {
                  return {
                    currentStep: "element",
                    path: { categoryId: state.path.categoryId },
                  };
                }
                return {
                  currentStep: "element",
                  path: {
                    categoryId: state.path.categoryId,
                    subcategoryId: state.path.subcategoryId,
                  },
                };

              default:
                return state;
            }
          });
          get().updateBreadcrumbTrail();
        },

        navigateToBreadcrumb: (stepIndex) => {
          set((state) => {
            const isTech = state.path.categoryId === "technology";

            if (stepIndex === 0) {
              return {
                currentStep: isTech ? "element" : "subcategory",
                path: { categoryId: state.path.categoryId },
              };
            }

            if (stepIndex === 1 && !isTech) {
              return {
                currentStep: "element",
                path: {
                  categoryId: state.path.categoryId,
                  subcategoryId: state.path.subcategoryId,
                },
              };
            }

            return state;
          });
          get().updateBreadcrumbTrail();
        },

        updateBreadcrumbTrail: () => {
          const { path } = get();
          const items: Array<{ id: string; name: string; step: FlowStep }> = [];

          if (path.categoryId) {
            const cat = getCatalogItem(path.categoryId);
            if (cat && "name" in cat) {
              items.push({
                id: cat.id,
                name: cat.name,
                step: "category",
              });
            }
          }

          if (path.subcategoryId) {
            const sub = getCatalogItem(path.subcategoryId);
            if (sub && "name" in sub) {
              items.push({
                id: sub.id,
                name: sub.name,
                step: "subcategory",
              });
            }
          }

          if (path.elementId) {
            const elem = getCatalogItem(path.elementId);
            if (elem && "name" in elem) {
              items.push({
                id: elem.id,
                name: elem.name,
                step: "element",
              });
            }
          }

          set({ breadcrumbTrail: items });
        },

        // Configuration actions
        updateConfig: (configUpdate) =>
          set((state) => ({
            config: { ...state.config, ...configUpdate },
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
            lastUsedEra: era, // Persist the selected era
          })),

        setBuildingType: (type) =>
          set((state) => ({
            config: { ...state.config, buildingType: type, selectedLevels: [] },
          })),
      }),
      {
        name: "add-element-storage",
        partialize: (state) => ({
          lastUsedEra: state.lastUsedEra, // Only persist lastUsedEra
        }),
      },
    ),
    { name: "AddElementStore" },
  ),
);

// ============================================================================
// HOOK FOR SUBMISSION
// ============================================================================

/**
 * Hook to submit configured elements with duplicate detection
 */
export function useSubmitElement() {
  const { path, config, closeModal } = useAddElementStore();
  const addBuilding = useAddBuilding();

  const submit = async () => {
    if (!path.elementId || !path.categoryId) {
      throw new Error("Invalid path: missing category or element");
    }

    // Get element data
    const id = `${path.categoryId}_${path.elementId}`;
    const elementData = getBuildingData(id);
    if (!elementData) {
      throw new Error("Element data not found");
    }

    // Get catalog item for display info
    const catalogItem = getCatalogItem(path.elementId);
    if (!catalogItem || !("name" in catalogItem)) {
      throw new Error("Catalog item not found");
    }

    // Filter selected levels
    const selectedLevels = config.selectedLevels.filter((l) => l.selected);
    if (selectedLevels.length === 0) {
      throw new Error("No levels selected");
    }

    // CHECK FOR DUPLICATES BEFORE INSERTING
    const db = getWikiDB();
    const duplicateItems: string[] = [];

    for (const levelConfig of selectedLevels) {
      const id = generateEntityId(
        path.categoryId!,
        path.elementId!,
        config.selectedEra,
        levelConfig.level,
        config.buildingType,
      );

      const existing = await db.buildings.get(id);
      if (existing) {
        // Format: "Small Home Lvl 7 Construction"
        const typeLabel =
          config.buildingType.charAt(0).toUpperCase() +
          config.buildingType.slice(1);
        duplicateItems.push(
          `${catalogItem.name} Lvl ${levelConfig.level} ${typeLabel}`,
        );
      }
    }

    if (duplicateItems.length > 0) {
      // Show toast error with list of duplicates (each item on new line)
      const description = duplicateItems.map((item) => `• ${item}`).join("\n");
      toast.error("Elements already in the list", {
        description: description,
        position: "top-center",
        duration: 3500,
        style: {
          whiteSpace: "pre-line",
        },
      });
      return; // Don't proceed with insertion
    }

    try {
      // Track the first element ID for accordion opening
      let firstElementId: string | null = null;

      // Create one entity per selected level
      const promises = selectedLevels.map(async (levelConfig) => {
        // Find level data
        const levelData = elementData.levels.find(
          (l) => l.level === levelConfig.level,
        );

        if (!levelData) {
          console.warn(`Level ${levelConfig.level} not found, skipping`);
          return;
        }

        // Get costs for the type (construction or upgrade)
        const rawCosts = levelData[config.buildingType];
        if (!rawCosts) {
          console.warn(
            `No ${config.buildingType} costs for level ${levelConfig.level}, skipping`,
          );
          return;
        }

        // Parse costs to entity format
        const costs = parseCostsToEntity(rawCosts);

        // Generate entity ID
        const id = generateEntityId(
          path.categoryId!,
          path.elementId!,
          config.selectedEra,
          levelConfig.level,
          config.buildingType,
        );

        // Store first ID with format: category_elementId (matches groupKey in item-list)
        if (!firstElementId) {
          firstElementId = `${path.categoryId}_${path.elementId}`;
        }

        // Build entity
        const entity: BuildingEntity = {
          id,
          name: catalogItem.name,
          imageName: elementData.imageName,
          imgLvl: elementData.imageName.includes("_Lv") || false,
          category: path.categoryId!,
          subcategory: path.subcategoryId || path.categoryId!,
          elementId: path.elementId!,
          type: config.buildingType,
          era: config.selectedEra,
          level: levelConfig.level,
          costs,
          quantity: config.quantity,
          maxQty: levelData.max_qty || 40,
          hidden: false,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        // Add to database
        await addBuilding.mutateAsync(entity);
      });

      // Wait for all inserts
      await Promise.all(promises);

      // console.log(`${selectedLevels.length} building(s) added to database`);

      // Build list of added items for success toast
      // const addedItems = selectedLevels.map((levelConfig) => {
      //   const typeLabel =
      //     config.buildingType.charAt(0).toUpperCase() +
      //     config.buildingType.slice(1);
      //   return `${catalogItem.name} Lvl ${levelConfig.level} ${typeLabel}`;
      // });

      // Show success toast with list of added elements
      toast.success(
        `${selectedLevels.length} ${catalogItem.name} added successfully`,
      );

      // const successDescription = addedItems
      //   .map((item) => `• ${item}`)
      //   .join("\n");
      // toast.success("Elements added successfully", {
      //   description: successDescription,
      //   duration: 3500,
      //   style: {
      //     whiteSpace: "pre-line",
      //   },
      // });

      // Set the last added element ID for accordion opening
      useAddElementStore.setState({ lastAddedElementId: firstElementId });

      // Close modal
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
