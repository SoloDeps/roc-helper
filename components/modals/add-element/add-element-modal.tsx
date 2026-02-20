"use client";

import { memo, useCallback, useMemo } from "react";
import { Plus, X, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ResponsiveModal } from "../responsive-modal";
import {
  useAddElementStore,
  useCurrentStep,
  useNavigationPath,
  useElementConfig,
  useModalState,
  useIsTechnologyPath,
  useSubmitElement,
} from "@/lib/stores/add-element-store";
import {
  getChildren,
  getCategories,
  getCatalogItem,
} from "@/lib/catalog-helper";
import { ElementGrid } from "./modal-components";
import { ConfigurationPanel } from "./configuration-panel";
import { TechnologySelection } from "../technology-selection-component";
import {
  OttomanAreasSelection,
  OttomanTradePostsSelection,
} from "../ottoman-selection-components";

/**
 * Modal Header - Centré avec Back à gauche et Close à droite
 */
const ModalHeader = memo(() => {
  const currentStep = useCurrentStep();
  const path = useNavigationPath();
  const { closeModal, goBack, directTechnologyMode } = useAddElementStore();

  const isTechPath = path.categoryId === "technology";
  const showBack =
    currentStep !== "category" &&
    !(directTechnologyMode && isTechPath && currentStep === "element");

  const getHeaderTitle = useCallback(() => {
    if (currentStep === "category") {
      return "Add Element";
    }

    let currentItemId: string | null = null;

    if (currentStep === "subcategory" && path.categoryId) {
      currentItemId = path.categoryId;
    } else if (currentStep === "element" && path.subcategoryId) {
      currentItemId = path.subcategoryId;
    } else if (currentStep === "configuration" && path.elementId) {
      currentItemId = path.elementId;
    }

    if (directTechnologyMode && isTechPath && currentStep === "element") {
      return "Add New Era";
    }

    if (currentItemId) {
      const item = getCatalogItem(currentItemId);
      if (item && "name" in item) {
        return item.name;
      }
    }

    return "Add Element";
  }, [currentStep, path, directTechnologyMode, isTechPath]);

  const title = useMemo(() => getHeaderTitle(), [getHeaderTitle]);

  return (
    <div className="sticky top-0 z-10 backdrop-blur-sm border-b border-alpha-400 bg-background">
      <div className="flex items-center justify-between h-10 px-4">
        {/* Left: Back button */}
        <div className="w-20 flex justify-start">
          {showBack && (
            <Button
              variant="ghost"
              size="sm"
              onClick={goBack}
              className="gap-1 -ml-2"
            >
              <ChevronLeft className="size-6" />
              <span className="hidden md:inline">Back</span>
            </Button>
          )}
        </div>

        {/* Center: Title */}
        <div className="flex-1 text-center px-2">
          <h2 className="text-sm md:text-base font-semibold truncate">
            {title}
          </h2>
        </div>

        {/* Right: Close button */}
        <div className="w-20 flex justify-end">
          <Button
            variant="ghost"
            size="icon"
            onClick={closeModal}
            className="-mr-2"
          >
            <X className="size-[22px]" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
      </div>
    </div>
  );
});

ModalHeader.displayName = "ModalHeader";

/**
 * Step 1: Category Selection
 */
const CategoryStep = memo(() => {
  const { selectCategory } = useAddElementStore();

  const categories = useMemo(() => getCategories(), []);

  const { primary, secondary } = useMemo(() => {
    const primaryIds = new Set(["technology", "capital"]);
    return {
      primary: categories.filter((cat) => primaryIds.has(cat.id)),
      secondary: categories.filter((cat) => !primaryIds.has(cat.id)),
    };
  }, [categories]);

  return (
    <div className="space-y-2 pb-20 md:pb-0">
      {primary.length > 0 && (
        <ElementGrid
          items={primary}
          onSelect={selectCategory}
          columns={2}
          priorityCount={2}
        />
      )}

      {secondary.length > 0 && (
        <ElementGrid items={secondary} onSelect={selectCategory} columns={2} />
      )}
    </div>
  );
});

CategoryStep.displayName = "CategoryStep";

/**
 * Step 2: Subcategory Selection
 */
const SubcategoryStep = memo(() => {
  const path = useNavigationPath();
  const { selectSubcategory } = useAddElementStore();

  const subcategories = useMemo(
    () => (path.categoryId ? getChildren(path.categoryId) : []),
    [path.categoryId],
  );

  return (
    <div className="space-y-4 pb-20 md:pb-0">
      <ElementGrid
        items={subcategories}
        onSelect={selectSubcategory}
        columns={2}
      />
    </div>
  );
});

SubcategoryStep.displayName = "SubcategoryStep";

/**
 * Step 3: Element Selection
 */
const ElementStep = memo(() => {
  const path = useNavigationPath();
  const isTech = useIsTechnologyPath();
  const { selectElement } = useAddElementStore();

  const elements = useMemo(() => {
    const parentId = isTech ? path.categoryId : path.subcategoryId;
    return parentId ? getChildren(parentId) : [];
  }, [path.categoryId, path.subcategoryId, isTech]);

  // ✅ For technology path, show technologies with direct add button
  if (isTech && path.categoryId === "technology") {
    return (
      <div className="space-y-4 pb-20 md:pb-0">
        <TechnologySelection />
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-20 md:pb-0">
      <ElementGrid items={elements} onSelect={selectElement} columns={1} />
    </div>
  );
});

ElementStep.displayName = "ElementStep";

/**
 * Step 4: Configuration
 */
const ConfigurationStep = memo(() => {
  const path = useNavigationPath();
  const config = useElementConfig();
  const { updateConfig, toggleLevel, setSelectedEra, setBuildingType } =
    useAddElementStore();

  const { submit, isLoading } = useSubmitElement();

  // ✅ Don't use try-catch here - let submit handle errors silently
  const handleSubmit = useCallback(async () => {
    await submit();
  }, [submit]);

  return (
    <div className="flex-1 h-full overflow-y-auto">
      <ConfigurationPanel
        path={path}
        config={config}
        onConfigChange={updateConfig}
        onToggleLevel={toggleLevel}
        onEraChange={setSelectedEra}
        onTypeChange={setBuildingType}
        onAddElement={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
});

ConfigurationStep.displayName = "ConfigurationStep";

/**
 * Ottoman Selection Step - Multi-select for areas/tradeposts
 */
const OttomanSelectionStep = memo(() => {
  const path = useNavigationPath();

  // Determine if we're selecting areas or trade posts
  const isAreas = path.subcategoryId === "ottoman_areas";
  const isTradePosts = path.subcategoryId === "ottoman_tradeposts";

  if (isAreas) {
    return (
      <div className="h-full pb-20 md:pb-0">
        <OttomanAreasSelection />
      </div>
    );
  }

  if (isTradePosts) {
    return (
      <div className="h-full pb-20 md:pb-0">
        <OttomanTradePostsSelection />
      </div>
    );
  }

  return null;
});

OttomanSelectionStep.displayName = "OttomanSelectionStep";

/**
 * Modal content router
 */
const ModalContent = memo(() => {
  const currentStep = useCurrentStep();

  return (
    <div className="flex flex-col h-full">
      <ModalHeader />

      <div className="flex-1 overflow-y-auto p-4">
        {currentStep === "category" && <CategoryStep />}
        {currentStep === "subcategory" && <SubcategoryStep />}
        {currentStep === "element" && <ElementStep />}
        {currentStep === "ottoman_selection" && <OttomanSelectionStep />}
        {currentStep === "configuration" && <ConfigurationStep />}
      </div>
    </div>
  );
});

ModalContent.displayName = "ModalContent";

/**
 * Main Add Element Component
 */
interface AddElementModalProps {
  variant?: "default" | "outline" | "ghost";
  long?: boolean;
  hideTrigger?: boolean;
}

export function AddElementModal({
  variant = "default",
  long = false,
  hideTrigger = false,
}: AddElementModalProps) {
  const isOpen = useModalState();
  const { openModal, closeModal } = useAddElementStore();

  const trigger = hideTrigger ? (
    // Trigger invisible mais monté pour que ResponsiveModal fonctionne
    <span className="sr-only" aria-hidden />
  ) : (
    <Button size="sm" variant={variant}>
      <Plus className="h-4 w-4" />
      Add {long ? "an element" : ""}
    </Button>
  );

  return (
    <ResponsiveModal
      trigger={trigger}
      open={isOpen}
      onOpenChange={(open) => (open ? openModal() : closeModal())}
      className={cn(
        "p-0 gap-0 flex flex-col overflow-hidden",
        "md:h-[min(500px,80vh)] md:w-full md:max-w-[500px]",
        "h-[80vh]",
      )}
    >
      <ModalContent />
    </ResponsiveModal>
  );
}
