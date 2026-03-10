"use client";

import { memo, useMemo, useCallback } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ERAS } from "@/lib/catalog";
import { useAddElementStore } from "@/lib/stores/add-element-store";
import { useSubmitPreset } from "@/lib/stores/add-element-submission-hooks";
import {
  ERA_TO_ALLIED,
  getSectionsForEraAndCategory,
  type PresetSection,
} from "@/data/presets";
import type { EraAbbr } from "@/lib/constants";

// ============================================================================
// CHECK ROW — même style que ottoman trade posts
// ============================================================================

interface CheckRowProps {
  label: string;
  checked: boolean;
  onToggle: () => void;
}

const CheckRow = memo<CheckRowProps>(({ label, checked, onToggle }) => (
  <div
    className={cn(
      "flex items-center gap-3 p-3 rounded-sm border cursor-pointer transition-all",
      "hover:bg-accent/70",
      checked
        ? "bg-primary/10 border-primary"
        : "bg-background-100 border-alpha-300",
    )}
    onClick={onToggle}
  >
    <Checkbox
      checked={checked}
      onCheckedChange={onToggle}
      className="data-[state=checked]:border-primary data-[state=checked]:bg-primary [&_svg]:stroke-3"
    />
    <span className="text-sm font-medium">{label}</span>
  </div>
));
CheckRow.displayName = "CheckRow";

// ============================================================================
// SECTION GROUP
// ============================================================================

interface SectionGroupProps {
  title: string;
  sections: PresetSection[];
  checkedIds: Set<string>;
  onToggle: (sectionId: string) => void;
}

const SectionGroup = memo<SectionGroupProps>(
  ({ title, sections, checkedIds, onToggle }) => {
    if (sections.length === 0) return null;
    return (
      <div className="space-y-2">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <div className="grid grid-cols-1 gap-2">
          {sections.map((section) => (
            <CheckRow
              key={section.id}
              label={section.label}
              checked={checkedIds.has(section.id)}
              onToggle={() => onToggle(section.id)}
            />
          ))}
        </div>
      </div>
    );
  },
);
SectionGroup.displayName = "SectionGroup";

// ============================================================================
// CITY LABELS
// ============================================================================

const CITY_LABEL: Record<string, string> = {
  egypt: "Egypt",
  china: "China",
  maya: "Maya",
  vikings: "Vikings",
  arabia: "Arabia",
};

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export const PresetBuilder = memo(() => {
  const { presetSelection, togglePresetSection, togglePresetTechnos } =
    useAddElementStore();

  const { submit, isLoading } = useSubmitPreset();

  const era = presetSelection.era as EraAbbr;
  const eraName = ERAS.find((e) => e.abbr === era)?.name ?? era;

  const capitalSections = useMemo(
    () => getSectionsForEraAndCategory(era, "capital"),
    [era],
  );

  const alliedCities = useMemo(() => ERA_TO_ALLIED[era] ?? [], [era]);

  const alliedSectionsMap = useMemo(() => {
    const map: Record<string, PresetSection[]> = {};
    for (const city of alliedCities) {
      map[city] = getSectionsForEraAndCategory(era, city);
    }
    return map;
  }, [alliedCities, era]);

  const ottomanSections = useMemo(
    () => getSectionsForEraAndCategory(era, "ottoman"),
    [era],
  );

  const totalAvailable = useMemo(() => {
    let n = 1 + capitalSections.length + ottomanSections.length;
    for (const city of alliedCities) {
      n += alliedSectionsMap[city]?.length ?? 0;
    }
    return n;
  }, [capitalSections, alliedCities, alliedSectionsMap, ottomanSections]);

  const selectedCount = useMemo(
    () =>
      (presetSelection.technos ? 1 : 0) + presetSelection.selectedSections.size,
    [presetSelection],
  );

  const isAllSelected = selectedCount === totalAvailable;

  const handleSelectAll = useCallback(() => {
    if (isAllSelected) {
      useAddElementStore.setState((state) => ({
        presetSelection: {
          ...state.presetSelection,
          technos: false,
          selectedSections: new Set(),
        },
      }));
    } else {
      const allIds = new Set<string>();
      capitalSections.forEach((s) => allIds.add(s.id));
      for (const city of alliedCities) {
        alliedSectionsMap[city]?.forEach((s) => allIds.add(s.id));
      }
      ottomanSections.forEach((s) => allIds.add(s.id));
      useAddElementStore.setState((state) => ({
        presetSelection: {
          ...state.presetSelection,
          technos: true,
          selectedSections: allIds,
        },
      }));
    }
  }, [
    isAllSelected,
    capitalSections,
    alliedCities,
    alliedSectionsMap,
    ottomanSections,
  ]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between bg-background z-10 py-2 border-b border-alpha-300 -mx-4 -mt-4 px-4">
        <p className="text-sm text-muted-foreground">
          {selectedCount} / {totalAvailable} selected
        </p>
        <Button
          size="sm"
          variant="ghost"
          onClick={handleSelectAll}
          className="h-7 text-sm"
        >
          {isAllSelected ? "Deselect all" : "Select all"}
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto pb-24 md:pb-4 pt-3">
        <div className="space-y-4 pb-4">
          {/* Technologies */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">
              Researchs
            </h3>
            <div className="grid grid-cols-1 gap-2">
              <CheckRow
                label="Technologies"
                checked={presetSelection.technos}
                onToggle={togglePresetTechnos}
              />
            </div>
          </div>

          {/* Capital */}
          <SectionGroup
            title="Capital"
            sections={capitalSections}
            checkedIds={presetSelection.selectedSections}
            onToggle={togglePresetSection}
          />

          {/* Allied cities */}
          {alliedCities.map((city) => (
            <SectionGroup
              key={city}
              title={CITY_LABEL[city] ?? city}
              sections={alliedSectionsMap[city] ?? []}
              checkedIds={presetSelection.selectedSections}
              onToggle={togglePresetSection}
            />
          ))}

          {/* Ottoman */}
          <SectionGroup
            title="Ottoman"
            sections={ottomanSections}
            checkedIds={presetSelection.selectedSections}
            onToggle={togglePresetSection}
          />
        </div>
      </div>

      {/* Floating Add Button — même pattern ottoman */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t md:relative md:border-t-0 md:p-0 md:mt-4">
        <Button
          size="lg"
          variant="default"
          className="w-full text-base"
          disabled={selectedCount === 0 || isLoading}
          onClick={submit}
        >
          {isLoading ? (
            <>
              <Loader2 className="size-4 mr-2 animate-spin" />
              Adding...
            </>
          ) : (
            `Add ${selectedCount > 0 ? selectedCount + " " : ""}preset${selectedCount !== 1 ? "s" : ""}`
          )}
        </Button>
      </div>
    </div>
  );
});
PresetBuilder.displayName = "PresetBuilder";
