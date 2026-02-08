"use client";

import React, { memo, useState } from "react";
import Image from "next/image";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { 
  getCatalogItem, 
  FALLBACK_IMAGE, 
  type BuildingItem 
} from "@/data/building-catalog";
import type { BuildingConfig, WizardPath } from "@/lib/stores/building-wizard-store";

/**
 * Building Preview Card
 */
interface BuildingPreviewProps {
  path: WizardPath;
}

const BuildingPreview = memo<BuildingPreviewProps>(({ path }) => {
  const category = path.categoryId ? getCatalogItem(path.categoryId) : null;
  const subcategory = path.subcategoryId ? getCatalogItem(path.subcategoryId) : null;
  const building = path.buildingId ? getCatalogItem(path.buildingId) : null;

  if (!building) return null;

  const [imageError, setImageError] = useState(false);

  return (
    <div className="flex items-center gap-3 p-3 border rounded-lg border-alpha-400 bg-background-300">
      {/* Building Image */}
      <div className="w-16 h-16 rounded-lg overflow-hidden bg-background-200 border border-alpha-400 shrink-0">
        <Image
          src={imageError ? FALLBACK_IMAGE : building.imageUrl}
          alt={building.name}
          className="w-full h-full object-contain p-1"
          onError={() => setImageError(true)}
          width={64}
          height={64}
        />
      </div>

      {/* Building Info */}
      <div className="flex-1 min-w-0">
        <h2 className="text-base font-semibold truncate">{building.name}</h2>
        <div className="flex items-center gap-2 mt-0.5 text-[10px] text-muted-foreground">
          {category && <span>{category.name}</span>}
          {subcategory && (
            <>
              <span>•</span>
              <span>{subcategory.name}</span>
            </>
          )}
          {building.metadata?.culture && (
            <>
              <span>•</span>
              <span className="capitalize">{building.metadata.culture}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
});

BuildingPreview.displayName = "BuildingPreview";

/**
 * Configuration Form
 */
interface ConfigurationFormProps {
  path: WizardPath;
  config: BuildingConfig;
  onConfigChange: (update: Partial<BuildingConfig>) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
}

export const ConfigurationForm = memo<ConfigurationFormProps>(({
  path,
  config,
  onConfigChange,
  onSubmit,
  isSubmitting = false,
}) => {
  const building = path.buildingId ? getCatalogItem(path.buildingId) : null;
  const maxLevel = building?.metadata?.maxLevel ?? 100;

  // Handle level change with validation
  // const handleLevelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = parseInt(e.target.value, 10);
  //   if (!isNaN(value) && value >= 1 && value <= maxLevel) {
  //     onConfigChange({ level: value });
  //   }
  // };

  // // Handle quantity change with validation
  // const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const value = parseInt(e.target.value, 10);
  //   if (!isNaN(value) && value >= 1 && value <= 999) {
  //     onConfigChange({ quantity: value });
  //   }
  // };

  // // Handle notes change
  // const handleNotesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
  //   onConfigChange({ notes: e.target.value });
  // };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Building Preview */}
      <BuildingPreview path={path} />

      {/* Level Input */}
      <div className="space-y-2">
        <Label htmlFor="level" className="text-sm font-medium">
          Building Level
          <span className="ml-2 text-xs text-muted-foreground font-normal">
            (max: {maxLevel})
          </span>
        </Label>
        {/* <Input
          id="level"
          type="number"
          min={1}
          max={maxLevel}
          value={config.level}
          onChange={handleLevelChange}
          className="h-9"
          required
        /> */}
      </div>

      {/* Quantity Input */}
      <div className="space-y-2">
        <Label htmlFor="quantity" className="text-sm font-medium">
          Quantity
          <span className="ml-2 text-xs text-muted-foreground font-normal">
            (how many to build)
          </span>
        </Label>
        {/* <Input
          id="quantity"
          type="number"
          min={1}
          max={999}
          value={config.quantity}
          onChange={handleQuantityChange}
          className="h-9"
          required
        /> */}
      </div>

      {/* Notes Input */}
      <div className="space-y-2">
        <Label htmlFor="notes" className="text-sm font-medium">
          Notes
          <span className="text-muted-foreground font-normal ml-2">
            (optional)
          </span>
        </Label>
        {/* <Textarea
          id="notes"
          value={config.notes ?? ""}
          onChange={handleNotesChange}
          placeholder="Add any notes or reminders..."
          className="resize-none h-20"
          maxLength={500}
        /> */}
        <p className="text-xs text-muted-foreground text-right">
          {config.notes?.length ?? 0} / 500
        </p>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        className="w-full h-9"
        disabled={isSubmitting}
      >
        <Plus className="w-4 h-4 mr-2" />
        {isSubmitting ? "Adding..." : `Add ${config.quantity > 1 ? `(${config.quantity}x)` : ""}`}
      </Button>
    </form>
  );
});

ConfigurationForm.displayName = "ConfigurationForm";
