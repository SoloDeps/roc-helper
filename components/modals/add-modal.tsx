"use client";

import { useState } from "react";
import { Plus, ArrowLeft } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";
import { links } from "@/data/links";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { BuildingData } from "@/types/shared";
import {
  getWikiImageUrl,
  CATEGORY_META,
  SUBCATEGORY_META,
  BUILDING_META,
  FALLBACK_IMAGE,
} from "@/data/building-metadata";
import Image from "next/image";

type Step = "category" | "subcategory" | "building" | "configuration";

interface NavigationState {
  category?: string;
  subcategory?: string;
  building?: string;
}

interface BuildingConfig {
  level: number;
  quantity: number;
  notes?: string;
}

const BUILDING_DATA_MAP: Record<string, BuildingData> = {};

// Helper pour résoudre l'URL d'image
function resolveImageUrl(imageKey: string): string {
  if (BUILDING_META[imageKey]?.imgUrl) {
    return getWikiImageUrl(BUILDING_META[imageKey].imgUrl);
  }

  if (SUBCATEGORY_META[imageKey]?.imgUrl) {
    return SUBCATEGORY_META[imageKey].imgUrl;
  }

  if (CATEGORY_META[imageKey]?.imgUrl) {
    return CATEGORY_META[imageKey].imgUrl;
  }

  return FALLBACK_IMAGE;
}

// Handler stable pour les erreurs d'image
const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  e.currentTarget.src = FALLBACK_IMAGE;
};

// Composant Card optimisé
function BuildingCard({
  title,
  imageKey,
  subtitle,
  onClick,
  priority = false,
}: {
  title: string;
  imageKey: string;
  subtitle?: string;
  onClick: () => void;
  priority?: boolean;
}) {
  const imageUrl = resolveImageUrl(imageKey);

  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative overflow-hidden rounded-lg border border-alpha-400",
        "bg-background-300 shadow-xs transition-all duration-200",
        "hover:shadow-md hover:border-alpha-500 active:scale-[0.98]",
      )}
    >
      <div className="aspect-[3/2] relative overflow-hidden bg-background-200">
        <Image
          src={imageUrl}
          alt={title}
          className="size-full object-contain p-1.5 transition-transform duration-200 group-hover:scale-105"
          onError={handleImageError}
          width={300}
          height={200}
          priority={priority}
          sizes="(max-width: 768px) 33vw, 25vw"
        />
      </div>

      <div className="p-2.5 text-center border-t border-alpha-400">
        <h3 className="font-medium text-sm line-clamp-1">{title}</h3>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
            {subtitle}
          </p>
        )}
      </div>
    </button>
  );
}

// Composant de configuration
function ConfigurationStep({
  navigation,
  config,
  onSave,
}: {
  navigation: NavigationState;
  config: BuildingConfig;
  onSave: () => void;
}) {
  const selectedBuildingData = navigation.building
    ? BUILDING_DATA_MAP[navigation.building] || null
    : null;

  const currentLevelData = selectedBuildingData?.levels?.find(
    (lvl) => lvl.level === config.level,
  );

  const maxLevel = selectedBuildingData
    ? Math.max(...selectedBuildingData.levels.map((lvl) => lvl.level))
    : 100;

  const buildingName = navigation.building
    ? links[navigation.building].name
    : "";

  const buildingImageUrl = (() => {
    if (!navigation.building) return FALLBACK_IMAGE;
    const imageName = BUILDING_META[navigation.building]?.imgUrl;
    return imageName ? getWikiImageUrl(imageName) : FALLBACK_IMAGE;
  })();

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 p-3 border rounded-lg border-alpha-400 bg-background-300">
        <div className="w-16 h-16 rounded-lg overflow-hidden bg-background-200 border border-alpha-400 shrink-0">
          <Image
            src={buildingImageUrl}
            alt={buildingName}
            className="w-full h-full object-contain p-1"
            onError={handleImageError}
            width={64}
            height={64}
          />
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="text-base font-semibold truncate">{buildingName}</h2>
          <div className="flex items-center gap-2 mt-0.5 text-[10px] text-muted-foreground">
            <span>
              {navigation.category && links[navigation.category].name}
            </span>
            <span>•</span>
            <span>
              {navigation.subcategory && links[navigation.subcategory].name}
            </span>
            {currentLevelData && (
              <>
                <span>•</span>
                <span>{currentLevelData.era}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="level" className="text-sm font-medium">
            Building Level
            {currentLevelData && (
              <span className="ml-2 text-xs text-muted-foreground">
                ({currentLevelData.era})
              </span>
            )}
          </Label>
          <p className="text-xs text-muted-foreground">Max level: {maxLevel}</p>

          {currentLevelData?.upgrade && (
            <div className="mt-2 p-2.5 bg-background-200 rounded-lg border border-alpha-400 space-y-1">
              <p className="text-xs font-medium">Upgrade costs:</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {currentLevelData.upgrade.coins && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Coins</span>
                    <span className="font-medium">
                      {currentLevelData.upgrade.coins.toLocaleString()}
                    </span>
                  </div>
                )}
                {currentLevelData.upgrade.food && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Food</span>
                    <span className="font-medium">
                      {currentLevelData.upgrade.food.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="quantity" className="text-sm font-medium">
            Quantity
            {currentLevelData?.max_qty && (
              <span className="ml-2 text-xs text-muted-foreground">
                (max recommended: {currentLevelData.max_qty})
              </span>
            )}
          </Label>
        </div>

        <div className="space-y-2">
          <Label htmlFor="notes" className="text-sm font-medium">
            Notes{" "}
            <span className="text-muted-foreground font-normal">
              (optional)
            </span>
          </Label>
        </div>
      </div>

      <Button onClick={onSave} className="w-full h-9">
        <Plus className="w-4 h-4 mr-2" />
        Add {config.quantity > 1 && `(${config.quantity}x)`}
      </Button>
    </div>
  );
}

// Composant Header
function ModalHeader({
  navigation,
  currentStep,
  onClose,
}: {
  navigation: NavigationState;
  currentStep: Step;
  onClose: () => void;
}) {
  const trail = [];
  if (navigation.category) trail.push(links[navigation.category].name);
  if (navigation.subcategory) trail.push(links[navigation.subcategory].name);
  if (navigation.building) trail.push(links[navigation.building].name);

  return (
    <div className="sticky top-0 z-10 bg-background-300/95 backdrop-blur-sm border-b border-alpha-400 px-4 py-3 flex items-center justify-between">
      {currentStep === "category" ? (
        <h2 className="text-base font-semibold">Add Item</h2>
      ) : (
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground overflow-x-auto flex-1 mr-3">
          {trail.map((crumb, index) => (
            <span key={index} className="flex items-center gap-1.5 shrink-0">
              {index > 0 && <span className="text-alpha-500">/</span>}
              <span
                className={
                  index === trail.length - 1
                    ? "text-foreground font-medium"
                    : ""
                }
              >
                {crumb}
              </span>
            </span>
          ))}
        </div>
      )}

      <button
        onClick={onClose}
        className="shrink-0 h-6 w-6 rounded-md hover:bg-background-200 flex items-center justify-center transition-colors"
        aria-label="Close"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  );
}

export function AddModal({
  variant = "outline",
}: {
  variant?: "default" | "outline" | "ghost";
}) {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<Step>("category");
  const [navigation, setNavigation] = useState<NavigationState>({});
  const [config, setConfig] = useState<BuildingConfig>({
    level: 1,
    quantity: 1,
  });

  const isDesktop = useMediaQuery("(min-width: 768px)");

  const resetModal = () => {
    setCurrentStep("category");
    setNavigation({});
    setConfig({ level: 1, quantity: 1 });
  };

  const handleCategorySelect = (categoryKey: string) => {
    setNavigation({ category: categoryKey });
    setCurrentStep("subcategory");
  };

  const handleSubcategorySelect = (subcategoryKey: string) => {
    const subcategoryItem = links[subcategoryKey];

    if (subcategoryItem.children && subcategoryItem.children.length > 0) {
      setNavigation({ ...navigation, subcategory: subcategoryKey });
      setCurrentStep("building");
    } else {
      setNavigation({ ...navigation, building: subcategoryKey });
      setCurrentStep("configuration");
    }
  };

  const handleBuildingSelect = (buildingKey: string) => {
    setNavigation({ ...navigation, building: buildingKey });
    setCurrentStep("configuration");
  };

  const handleBack = () => {
    switch (currentStep) {
      case "subcategory":
        setCurrentStep("category");
        setNavigation({});
        break;
      case "building":
        setCurrentStep("subcategory");
        setNavigation({ category: navigation.category });
        break;
      case "configuration":
        const subcategoryItem = navigation.subcategory
          ? links[navigation.subcategory]
          : null;
        if (subcategoryItem?.children && subcategoryItem.children.length > 0) {
          setCurrentStep("building");
          setNavigation({
            category: navigation.category,
            subcategory: navigation.subcategory,
          });
        } else {
          setCurrentStep("subcategory");
          setNavigation({ category: navigation.category });
        }
        break;
    }
  };

  const handleSave = async () => {
    const selectedBuildingData = navigation.building
      ? BUILDING_DATA_MAP[navigation.building] || null
      : null;

    const currentLevelData = selectedBuildingData?.levels?.find(
      (lvl) => lvl.level === config.level,
    );

    const buildingData = {
      category: navigation.category,
      subcategory: navigation.subcategory,
      building: navigation.building,
      buildingId: selectedBuildingData?.id,
      level: config.level,
      quantity: config.quantity,
      notes: config.notes,
      levelData: currentLevelData,
      timestamp: new Date().toISOString(),
    };

    console.log("Saving to DB:", buildingData);
    setOpen(false);
    resetModal();
  };

  // Données pour les catégories - calculées UNE SEULE FOIS
  const rootItem = links.root;
  const availableCategories =
    rootItem.children?.map((key) => ({
      key,
      item: links[key],
    })) || [];

  // Séparation des catégories principales et secondaires
  const primaryCategories = availableCategories.filter(({ key }) =>
    ["technology", "capital"].includes(key),
  );
  const secondaryCategories = availableCategories.filter(
    ({ key }) => !["technology", "capital"].includes(key),
  );

  // Sous-catégories
  const categoryItem = navigation.category ? links[navigation.category] : null;
  const availableSubcategories =
    categoryItem?.children?.map((key) => ({
      key,
      item: links[key],
    })) || [];

  // Buildings
  const subcategoryItem = navigation.subcategory
    ? links[navigation.subcategory]
    : null;
  const availableBuildings =
    subcategoryItem?.children?.map((key) => ({
      key,
      item: links[key],
    })) || [];

  // ✅ TOUS LES STEPS SONT RENDUS, mais seul celui actif est visible
  const modalContent = (
    <div className="flex flex-col h-full">
      {/* Header avec titre ou breadcrumb + close */}
      <ModalHeader
        navigation={navigation}
        currentStep={currentStep}
        onClose={() => {
          setOpen(false);
          resetModal();
        }}
      />

      {/* Contenu scrollable - TOUS LES STEPS EN DOM */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* STEP 1: Categories */}
        <div className={cn(currentStep === "category" ? "block" : "hidden")}>
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-semibold mb-0.5">
                Select a Category
              </h2>
              <p className="text-xs text-muted-foreground">
                Choose the main category for your building
              </p>
            </div>

            {/* Catégories principales (Technology + Capital) */}
            <div className="grid grid-cols-2 gap-2.5">
              {primaryCategories.map(({ key, item }) => (
                <BuildingCard
                  key={key}
                  title={item.name}
                  imageKey={key}
                  onClick={() => handleCategorySelect(key)}
                  priority={true}
                />
              ))}
            </div>

            {/* Catégories secondaires (Cultures) */}
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2.5">
              {secondaryCategories.map(({ key, item }) => (
                <BuildingCard
                  key={key}
                  title={item.name}
                  imageKey={key}
                  onClick={() => handleCategorySelect(key)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* STEP 2: Subcategories */}
        <div className={cn(currentStep === "subcategory" ? "block" : "hidden")}>
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-semibold mb-0.5">Select a Type</h2>
              <p className="text-xs text-muted-foreground">
                Choose the building type
              </p>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2.5">
              {availableSubcategories.map(({ key, item }) => (
                <BuildingCard
                  key={key}
                  title={item.name}
                  imageKey={key}
                  onClick={() => handleSubcategorySelect(key)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* STEP 3: Buildings */}
        <div className={cn(currentStep === "building" ? "block" : "hidden")}>
          <div className="space-y-4">
            <div>
              <h2 className="text-base font-semibold mb-0.5">
                Select a Building
              </h2>
              <p className="text-xs text-muted-foreground">
                Choose the specific building
              </p>
            </div>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-2.5">
              {availableBuildings.map(({ key, item }) => (
                <BuildingCard
                  key={key}
                  title={item.name}
                  imageKey={key}
                  onClick={() => handleBuildingSelect(key)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* STEP 4: Configuration */}
        <div
          className={cn(currentStep === "configuration" ? "block" : "hidden")}
        >
          <ConfigurationStep
            navigation={navigation}
            config={config}
            onSave={handleSave}
          />
        </div>
      </div>

      {/* Footer avec bouton Back */}
      {currentStep !== "category" && (
        <div className="sticky bottom-0 z-10 bg-background-300/95 backdrop-blur-sm border-t border-alpha-400 px-4 py-3 pb-safe">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="gap-2 h-9 w-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
        </div>
      )}
    </div>
  );

  if (isDesktop) {
    return (
      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (!isOpen) resetModal();
        }}
      >
        <DialogTrigger asChild>
          <Button size="sm" variant={variant}>
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </DialogTrigger>

        <DialogContent className="p-0 h-[70vh] w-full max-w-[950px] overflow-hidden gap-0 flex flex-col">
          {modalContent}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen);
        if (!isOpen) resetModal();
      }}
    >
      <DrawerTrigger asChild>
        <Button size="sm" variant={variant}>
          <Plus className="h-4 w-4 mr-1" />
          Add
        </Button>
      </DrawerTrigger>

      <DrawerContent className="h-[85vh] flex flex-col">
        {modalContent}
      </DrawerContent>
    </Drawer>
  );
}
