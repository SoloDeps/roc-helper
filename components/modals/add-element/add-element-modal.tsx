"use client";

import { memo, useCallback, useMemo } from "react";
import { Plus, X, ChevronLeft, Zap } from "lucide-react";
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
import { useIsCampaignPath } from "@/lib/stores/add-element-store";
import {
  getChildren,
  getCategories,
  getCatalogItem,
} from "@/lib/catalog-helper";
import { ERAS } from "@/lib/catalog";
import { ElementGrid } from "./modal-components";
import { ConfigurationPanel } from "./configuration-panel";
import { TechnologySelection } from "../technology-selection-component";
import { CampaignSelection } from "../campaign-selection-component";
import {
  OttomanAreasSelection,
  OttomanTradePostsSelection,
} from "../ottoman-selection-components";
import { PresetEraSelection } from "./preset-era-selection";
import { PresetBuilder } from "./preset-builder";
import Image from "next/image";
import { useBuildingSelections } from "@/hooks/use-building-selections";
import { buildingsAbbr } from "@/lib/constants";

/**
 * Modal Header
 */
const ModalHeader = memo(() => {
  const currentStep = useCurrentStep();
  const path = useNavigationPath();
  const { closeModal, goBack, directTechnologyMode, presetSelection } =
    useAddElementStore();

  const isTechPath = path.categoryId === "technology";
  const isCampaignPath = path.categoryId === "campaign";
  const showBack =
    currentStep !== "category" &&
    !(directTechnologyMode && isTechPath && currentStep === "element") &&
    !(isCampaignPath && currentStep === "element");

  const getHeaderTitle = useCallback(() => {
    if (currentStep === "preset_era") return "Quick Preset";
    if (currentStep === "preset_selection") {
      const eraObj = ERAS.find((e) => e.abbr === presetSelection.era);
      return eraObj?.name ?? "Quick Preset";
    }
    if (currentStep === "category") return "Add Element";

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

    if (currentStep === "element" && path.categoryId === "campaign") {
      return "Add Campaign Era";
    }

    if (currentItemId) {
      const item = getCatalogItem(currentItemId);
      if (item && "name" in item) return item.name;
    }

    return "Add Element";
  }, [currentStep, path, directTechnologyMode, isTechPath, presetSelection]);

  const title = useMemo(() => getHeaderTitle(), [getHeaderTitle]);

  return (
    <div className="sticky top-0 z-10 backdrop-blur-sm border-b border-alpha-400 bg-background">
      <div className="flex items-center justify-between h-10 px-4">
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

        <div className="flex-1 text-center px-2">
          <h2 className="text-sm md:text-base font-semibold truncate">
            {title}
          </h2>
        </div>

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

  const { topRow, secondary } = useMemo(() => {
    const topRowIds = new Set(["capital", "harbor", "campaign", "technology"]);
    return {
      // campaign: categories.filter((cat) => cat.id === "campaign"),
      topRow: categories.filter((cat) => topRowIds.has(cat.id)),
      secondary: categories.filter((cat) => !topRowIds.has(cat.id)),
    };
  }, [categories]);

  const handleQuickPreset = useCallback(() => {
    useAddElementStore.setState({ currentStep: "preset_era" });
  }, []);

  return (
    <div className="space-y-2 pb-20 md:pb-0">
      {/* Quick Preset button */}
      <div className="pb-1">
        <Button
          variant="outline"
          className="size-full text-left flex items-center gap-2 h-[70px] px-3 w-full justify-start"
          onClick={handleQuickPreset}
        >
          <Image
            src="/images/game_icons/icon_thunder.webp"
            alt="Quick Preset"
            width={48}
            height={48}
            sizes="48px"
            unoptimized
            className="object-contain size-10 md:w-11 select-none shrink-0"
          />

          <div className="text-left flex-1 min-w-0">
            <p className="font-medium text-sm truncate">Quick Preset</p>
            <p className="text-[13px] text-muted-foreground">
              Add multiple categories at once
            </p>
          </div>
        </Button>

        <div className="relative flex items-center gap-2 mt-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground shrink-0 px-1">
            OR
          </span>
          <div className="flex-1 h-px bg-border" />
        </div>
      </div>

      {/* Capital + Technology — col-2 on same row */}
      {topRow.length > 0 && (
        <ElementGrid
          items={topRow}
          onSelect={selectCategory}
          columns={2}
          priorityCount={2}
        />
      )}

      <div className="relative flex items-center gap-2 my-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground shrink-0 px-1">
            ALLIED CITIES
          </span>
          <div className="flex-1 h-px bg-border" />
        </div>

      {/* Other secondary categories */}
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
const WORKSHOP_POSITIONS = [
  { id: "primary_workshop", name: "Primary Workshop", posIndex: 0 },
  { id: "secondary_workshop", name: "Secondary Workshop", posIndex: 1 },
  { id: "tertiary_workshop", name: "Tertiary Workshop", posIndex: 2 },
] as const;

const WorkshopPositionStep = memo(() => {
  const { selectElement } = useAddElementStore();
  const selections = useBuildingSelections();

  return (
    <div className="space-y-2 pb-20 md:pb-0">
      {WORKSHOP_POSITIONS.map(({ id, name, posIndex }) => {
        // Trouver le nom du workshop sélectionné par le joueur si dispo
        // On ne connaît pas encore l'ère ici, donc on affiche juste le nom
        // de la position avec une note si configuré
        const anyGroupSelected = buildingsAbbr.some(
          (group) => !!selections[buildingsAbbr.indexOf(group)]?.[posIndex],
        );

        return (
          <Button
            key={id}
            variant="outline"
            onClick={() => selectElement(id)}
            className="w-full text-left flex items-center gap-3 h-16 px-3"
          >
            <Image
              src="/images/game_icons/icon_flat_workshop.webp"
              alt={name}
              width={44}
              height={44}
              className="object-contain opacity-60 invert-100 dark:invert-0 select-none"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm">{name}</h3>
              {anyGroupSelected && (
                <p className="text-xs text-muted-foreground truncate">
                  Configured in Workshops settings
                </p>
              )}
            </div>
          </Button>
        );
      })}
    </div>
  );
});
WorkshopPositionStep.displayName = "WorkshopPositionStep";

const ElementStep = memo(() => {
  const path = useNavigationPath();
  const isTech = useIsTechnologyPath();
  const isCampaign = useIsCampaignPath();
  const { selectElement } = useAddElementStore();

  // Intercepter capital > workshops → afficher Primary/Secondary/Tertiary
  const isCapitalWorkshops =
    path.categoryId === "capital" && path.subcategoryId === "workshops";

  const elements = useMemo(() => {
    const parentId =
      isTech || isCampaign ? path.categoryId : path.subcategoryId;
    return parentId ? getChildren(parentId) : [];
  }, [path.categoryId, path.subcategoryId, isTech, isCampaign]);

  if (isTech && path.categoryId === "technology") {
    return (
      <div className="space-y-4 pb-20 md:pb-0">
        <TechnologySelection />
      </div>
    );
  }

  if (isCampaign && path.categoryId === "campaign") {
    return (
      <div className="space-y-4 pb-20 md:pb-0">
        <CampaignSelection />
      </div>
    );
  }

  if (isCapitalWorkshops) {
    return <WorkshopPositionStep />;
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
 * Ottoman Selection Step
 */
const OttomanSelectionStep = memo(() => {
  const path = useNavigationPath();
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
        {currentStep === "preset_era" && <PresetEraSelection />}
        {currentStep === "preset_selection" && <PresetBuilder />}
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
