"use client";

import { memo, useMemo, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Check, Loader2, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getBuildingData,
  getAvailableEras,
  getLevelsForEraAndType,
  getMaxQuantity,
  hasConstructionData,
  hasUpgradeData,
} from "@/lib/element-data-loader";
import type {
  ElementConfig,
  NavigationPath,
} from "@/lib/stores/add-element-store";
import { useDuplicateErrors } from "@/lib/stores/add-element-store";
import { Button } from "@/components/ui/button";
import { ResponsiveSelect } from "@/components/modals/responsive-select";
import { QtySlider } from "./quantity-slider";
import { ERAS } from "@/lib/catalog";
import { Alert, AlertDescription } from "@/components/ui/alert";

/**
 * Era selector - Now using ResponsiveSelect
 */
interface EraSelectorProps {
  selectedEra: string;
  onEraChange: (era: string) => void;
  nested?: boolean;
}

const EraSelector = memo<EraSelectorProps>(
  ({ selectedEra, onEraChange, nested = false }) => {
    if (ERAS.length <= 1) return null;

    const options = ERAS.map((era) => ({
      value: era.abbr,
      label: era.name,
    }));

    return (
      <ResponsiveSelect
        label="Era"
        value={selectedEra}
        onValueChange={onEraChange}
        options={options}
        placeholder="Select an era"
        drawerClassName="h-[60vh]"
        nested={nested}
      />
    );
  },
);

EraSelector.displayName = "EraSelector";

/**
 * Building type selector
 */
interface TypeSelectorProps {
  selectedType: "construction" | "upgrade";
  onTypeChange: (type: "construction" | "upgrade") => void;
  hasConstruction: boolean;
  hasUpgrade: boolean;
}

const TypeSelector = memo<TypeSelectorProps>(
  ({ selectedType, onTypeChange, hasConstruction, hasUpgrade }) => {
    if (!hasConstruction && !hasUpgrade) return null;

    return (
      <div className="space-y-2">
        <Label className="text-sm font-medium">Type</Label>
        <div className="grid grid-cols-2 gap-2">
          <Button
            size="lg"
            variant="outline"
            onClick={() => onTypeChange("construction")}
            disabled={!hasConstruction}
            className={cn(
              selectedType === "construction" && hasConstruction
                ? "border-2 bg-green-500 dark:bg-green-700/20 text-white border-green-600 shadow-lg"
                : "border bg-background-100 hover:bg-accent border-alpha-300",
            )}
          >
            Construction
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={() => onTypeChange("upgrade")}
            disabled={!hasUpgrade}
            className={cn(
              selectedType === "upgrade" && hasUpgrade
                ? "border-2 bg-blue-500 dark:bg-blue-700/20 text-white border-blue-600 shadow-lg"
                : "border bg-background-100 hover:bg-accent border-alpha-300",
            )}
          >
            Upgrade
          </Button>
        </div>
      </div>
    );
  },
);

TypeSelector.displayName = "TypeSelector";

/**
 * Level checkboxes simplified - horizontal layout
 */
interface LevelCheckboxesProps {
  buildingType: "construction" | "upgrade";
  availableLevels: Array<{ level: number }>;
  selectedLevels: number[];
  onToggleLevel: (level: number) => void;
}

const LevelCheckboxes = memo<LevelCheckboxesProps>(
  ({ buildingType, availableLevels, selectedLevels, onToggleLevel }) => {
    if (availableLevels.length === 0) {
      return (
        <div className="text-sm text-muted-foreground text-center py-6 border border-dashed rounded-lg">
          No levels available for this type
        </div>
      );
    }

    return (
      <div className="space-y-2.5 mt-5">
        <Label className="text-sm font-medium capitalize">
          Available {buildingType} Levels
        </Label>

        <div className="grid grid-cols-3 gap-2">
          {availableLevels.map(({ level }) => {
            const isSelected = selectedLevels.includes(level);

            return (
              <Button
                size="lg"
                key={level}
                variant="outline"
                onClick={() => onToggleLevel(level)}
                className={cn(
                  "flex items-center gap-3 rounded-sm border px-3 py-2.5",
                  isSelected
                    ? "border-2 border-primary bg-primary/10 shadow-md"
                    : "border-alpha-300 bg-background-100 hover:border-alpha-400",
                )}
              >
                <div
                  className={cn(
                    "size-4 rounded border-2 flex items-center justify-center transition-colors shrink-0",
                    isSelected ? "border-primary bg-primary" : "bg-background",
                  )}
                >
                  {isSelected && (
                    <Check className="size-3 stroke-4 text-primary-foreground" />
                  )}
                </div>
                <span className="text-sm font-medium">Lvl {level}</span>
              </Button>
            );
          })}
        </div>
      </div>
    );
  },
);

LevelCheckboxes.displayName = "LevelCheckboxes";

/**
 * Main configuration panel
 */
interface ConfigurationPanelProps {
  path: NavigationPath;
  config: ElementConfig;
  onConfigChange: (update: Partial<ElementConfig>) => void;
  onToggleLevel: (level: number) => void;
  onEraChange: (era: string) => void;
  onTypeChange: (type: "construction" | "upgrade") => void;
  onAddElement?: () => void;
  isLoading?: boolean;
  nested?: boolean;
}

export const ConfigurationPanel = memo<ConfigurationPanelProps>(
  ({
    path,
    config,
    onConfigChange,
    onToggleLevel,
    onEraChange,
    onTypeChange,
    onAddElement,
    isLoading = false,
    nested = true,
  }) => {
    // ✅ Get duplicate errors array from store
    const duplicateErrors = useDuplicateErrors();

    const elementData = useMemo(
      () => (path.elementId ? getBuildingData(path.elementId) : null),
      [path.elementId],
    );

    const availableEras = useMemo(
      () => (elementData ? getAvailableEras(elementData) : []),
      [elementData],
    );

    // Initialize era if not set
    useEffect(() => {
      if (availableEras.length > 0 && !config.selectedEra) {
        onEraChange(availableEras[availableEras.length - 1]);
      }
    }, [availableEras, config.selectedEra, onEraChange]);

    const availableLevels = useMemo(() => {
      if (!elementData || !config.selectedEra) return [];
      return getLevelsForEraAndType(
        elementData,
        config.selectedEra,
        config.buildingType,
      );
    }, [elementData, config.selectedEra, config.buildingType]);

    const { hasConstruction: hasConstr, hasUpgrade: hasUpgr } = useMemo(() => {
      if (!elementData || !config.selectedEra) {
        return { hasConstruction: false, hasUpgrade: false };
      }

      return {
        hasConstruction: hasConstructionData(elementData, config.selectedEra),
        hasUpgrade: hasUpgradeData(elementData, config.selectedEra),
      };
    }, [elementData, config.selectedEra]);

    // Auto-switch type if needed
    useEffect(() => {
      if (config.buildingType === "construction" && !hasConstr && hasUpgr) {
        onTypeChange("upgrade");
      } else if (config.buildingType === "upgrade" && !hasUpgr && hasConstr) {
        onTypeChange("construction");
      }
    }, [config.buildingType, hasConstr, hasUpgr, onTypeChange]);

    const maxQty = useMemo(() => {
      if (!elementData || !config.selectedEra) return 40;
      return getMaxQuantity(elementData, config.selectedEra);
    }, [elementData, config.selectedEra]);

    // Auto-adjust quantity if exceeds new maxQty
    useEffect(() => {
      if (config.quantity > maxQty) {
        onConfigChange({ quantity: maxQty });
      }
    }, [maxQty, config.quantity, onConfigChange]);

    const selectedLevelNums = config.selectedLevels
      .filter((l) => l.selected)
      .map((l) => l.level);

    if (!elementData) {
      return (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Element data not found</p>
        </div>
      );
    }

    return (
      <div className="flex flex-col justify-between size-full">
        <div className="space-y-4">
          <EraSelector
            selectedEra={config.selectedEra}
            onEraChange={onEraChange}
            nested={nested}
          />

          <TypeSelector
            selectedType={config.buildingType}
            onTypeChange={onTypeChange}
            hasConstruction={hasConstr}
            hasUpgrade={hasUpgr}
          />

          <LevelCheckboxes
            buildingType={config.buildingType}
            availableLevels={availableLevels}
            selectedLevels={selectedLevelNums}
            onToggleLevel={onToggleLevel}
          />

          <div className="flex flex-col gap- pt-3">
            <Label className="text-[15px] font-medium">
              Quantity
              <span className="ml-1 text-sm text-muted-foreground font-normal">
                (Max: {maxQty})
              </span>
            </Label>
            <div className="flex justify-between items-center gap-4">
              <QtySlider
                value={config.quantity}
                min={1}
                max={maxQty}
                onChange={(qty) => onConfigChange({ quantity: qty })}
              />

              {/* Numeric value on the right (Canva-like) */}
              <div className="flex items-center size-12 justify-center border bg-background-300 rounded-lg font-medium">
                {config.quantity}
              </div>
            </div>
          </div>
        </div>

        {/* ✅ Duplicate Errors Alert with bulleted list */}
        {duplicateErrors.length > 0 && (
          <Alert variant="destructive" className="my-4">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="font-medium mb-1">
                Elements already in the list:
              </div>
              <ul className="list-disc list-inside space-y-0.5">
                {duplicateErrors.map((error, index) => (
                  <li key={index} className="text-sm">
                    {error}
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        {onAddElement && (
          <div className="pb-8 md:pb-0 mt-5 flex justify-end">
            <Button
              size="lg"
              variant="default"
              onClick={onAddElement}
              className="text-base w-full"
              disabled={selectedLevelNums.length === 0 || isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add to the list"
              )}
            </Button>
          </div>
        )}
      </div>
    );
  },
);

ConfigurationPanel.displayName = "ConfigurationPanel";
