"use client";

import React, { memo, useCallback } from "react";
import { Plus, ArrowLeft, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ResponsiveModal } from "./responsive-modal";
import { 
  useBuildingWizard, 
  useWizardStep, 
  useWizardPath, 
  useWizardConfig,
  useWizardIsOpen,
} from "@/lib/stores/building-wizard-store";
import { 
  getCatalogItem, 
  getChildren, 
  getCategories,
} from "@/data/building-catalog";
import { 
  BuildingGrid, 
  StepHeader, 
  Breadcrumb 
} from "./wizard-components";
import { ConfigurationForm } from "./configuration-step";

/**
 * Modal Header Component
 */
const WizardHeader = memo(() => {
  const currentStep = useWizardStep();
  const path = useWizardPath();
  const { closeWizard } = useBuildingWizard();

  // Build breadcrumb trail
  const trail = React.useMemo(() => {
    const items = [];
    if (path.categoryId) {
      const cat = getCatalogItem(path.categoryId);
      if (cat) items.push({ id: cat.id, name: cat.name });
    }
    if (path.subcategoryId) {
      const sub = getCatalogItem(path.subcategoryId);
      if (sub) items.push({ id: sub.id, name: sub.name });
    }
    if (path.buildingId) {
      const bld = getCatalogItem(path.buildingId);
      if (bld) items.push({ id: bld.id, name: bld.name });
    }
    return items;
  }, [path]);

  return (
    <div className="sticky top-0 z-10 bg-background-300/95 backdrop-blur-sm border-b border-alpha-400 px-4 py-3 flex items-center justify-between">
      {currentStep === "category" ? (
        <h2 className="text-base font-semibold">Add Building</h2>
      ) : (
        <Breadcrumb trail={trail} />
      )}
      
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={closeWizard}
        className="shrink-0"
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </Button>
    </div>
  );
});

WizardHeader.displayName = "WizardHeader";

/**
 * Step 1: Category Selection
 */
const CategoryStep = memo(() => {
  const { selectCategory } = useBuildingWizard();
  
  const categories = React.useMemo(() => getCategories(), []);
  
  // Separate primary and secondary categories
  const { primary, secondary } = React.useMemo(() => {
    const primaryIds = new Set(["technology", "capital"]);
    return {
      primary: categories.filter(cat => primaryIds.has(cat.id)),
      secondary: categories.filter(cat => !primaryIds.has(cat.id)),
    };
  }, [categories]);

  return (
    <div className="space-y-4">
      <StepHeader
        title="Select a Category"
        description="Choose the main category for your building"
      />

      {/* Primary Categories (Technology + Capital) */}
      {primary.length > 0 && (
        <BuildingGrid
          items={primary}
          onSelect={selectCategory}
          columns="2"
          priorityCount={2}
        />
      )}

      {/* Secondary Categories (Cultures) */}
      {secondary.length > 0 && (
        <BuildingGrid
          items={secondary}
          onSelect={selectCategory}
          columns="3"
        />
      )}
    </div>
  );
});

CategoryStep.displayName = "CategoryStep";

/**
 * Step 2: Subcategory Selection
 */
const SubcategoryStep = memo(() => {
  const path = useWizardPath();
  const { selectSubcategory } = useBuildingWizard();

  const subcategories = React.useMemo(
    () => path.categoryId ? getChildren(path.categoryId) : [],
    [path.categoryId]
  );

  return (
    <div className="space-y-4">
      <StepHeader
        title="Select a Type"
        description="Choose the building type"
      />
      
      <BuildingGrid
        items={subcategories}
        onSelect={selectSubcategory}
        columns="3"
      />
    </div>
  );
});

SubcategoryStep.displayName = "SubcategoryStep";

/**
 * Step 3: Building Selection
 */
const BuildingStep = memo(() => {
  const path = useWizardPath();
  const { selectBuilding } = useBuildingWizard();

  const buildings = React.useMemo(
    () => path.subcategoryId ? getChildren(path.subcategoryId) : [],
    [path.subcategoryId]
  );

  return (
    <div className="space-y-4">
      <StepHeader
        title="Select a Building"
        description="Choose the specific building"
      />
      
      <BuildingGrid
        items={buildings}
        onSelect={selectBuilding}
        columns="3"
      />
    </div>
  );
});

BuildingStep.displayName = "BuildingStep";

/**
 * Step 4: Configuration
 */
const ConfigurationStep = memo(() => {
  const path = useWizardPath();
  const config = useWizardConfig();
  const { updateConfig, submitBuilding } = useBuildingWizard();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = useCallback(async () => {
    setIsSubmitting(true);
    try {
      await submitBuilding();
    } catch (error) {
      console.error("Failed to submit:", error);
    } finally {
      setIsSubmitting(false);
    }
  }, [submitBuilding]);

  return (
    <ConfigurationForm
      path={path}
      config={config}
      onConfigChange={updateConfig}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
    />
  );
});

ConfigurationStep.displayName = "ConfigurationStep";

/**
 * Modal Footer with Back Button
 */
const WizardFooter = memo(() => {
  const currentStep = useWizardStep();
  const { goBack } = useBuildingWizard();

  if (currentStep === "category") return null;

  return (
    <div className="sticky bottom-0 z-10 bg-background-300/95 backdrop-blur-sm border-t border-alpha-400 px-4 py-3 pb-safe">
      <Button
        variant="ghost"
        size="sm"
        onClick={goBack}
        className="gap-2 h-9"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Button>
    </div>
  );
});

WizardFooter.displayName = "WizardFooter";

/**
 * Main Modal Content
 */
const WizardContent = memo(() => {
  const currentStep = useWizardStep();

  return (
    <div className="flex flex-col h-full">
      <WizardHeader />
      
      <div className="flex-1 overflow-y-auto p-4">
        {/* Render only the active step */}
        {currentStep === "category" && <CategoryStep />}
        {currentStep === "subcategory" && <SubcategoryStep />}
        {currentStep === "building" && <BuildingStep />}
        {currentStep === "configuration" && <ConfigurationStep />}
      </div>
      
      <WizardFooter />
    </div>
  );
});

WizardContent.displayName = "WizardContent";

/**
 * Main Building Wizard Component
 */
interface BuildingWizardProps {
  variant?: "default" | "outline" | "ghost";
}

export function BuildingWizard({ variant = "default" }: BuildingWizardProps) {
  const isOpen = useWizardIsOpen();
  const { openWizard, closeWizard } = useBuildingWizard();

  const trigger = (
    <Button size="sm" variant={variant}>
      <Plus className="h-4 w-4 mr-1" />
      Add
    </Button>
  );

  return (
    <ResponsiveModal
      trigger={trigger}
      open={isOpen}
      onOpenChange={(open) => open ? openWizard() : closeWizard()}
      className={cn(
        "p-0 gap-0 flex flex-col overflow-hidden",
        // Desktop
        "md:h-[70vh] md:w-full md:max-w-[950px]",
        // Mobile
        "h-[85vh]"
      )}
    >
      <WizardContent />
    </ResponsiveModal>
  );
}
