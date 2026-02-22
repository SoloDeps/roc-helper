"use client";

import { useState, useCallback, useEffect, memo, useRef } from "react";
import { Store, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResponsiveModal } from "./responsive-modal";
import { ResponsiveSelect } from "./responsive-select";
import { buildingsAbbr } from "@/lib/constants";
import { getGoodsImg } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface WorkshopModalProps {
  variant?: "default" | "outline" | "ghost";
  btnClass?: string;
}

// ============================================================================
// TYPES
// ============================================================================

type BuildingSelections = string[][];

const STORAGE_KEY = "local:buildingSelections";
const WORKSHOP_SEEN_KEY = "local:workshopSeen";
const DEFAULT_SELECTIONS = buildingsAbbr.map(() => ["", "", ""]);

// ============================================================================
// STORAGE HELPERS
// ============================================================================

function loadSelections(): BuildingSelections {
  if (typeof window === "undefined") return DEFAULT_SELECTIONS;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return DEFAULT_SELECTIONS;

    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : DEFAULT_SELECTIONS;
  } catch {
    return DEFAULT_SELECTIONS;
  }
}

function saveSelections(selections: BuildingSelections) {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selections));

    //  Defer storage event to avoid setState during render
    queueMicrotask(() => {
      window.dispatchEvent(new Event("storage"));
    });
  } catch (error) {
    console.error("Failed to save selections:", error);
  }
}

// ============================================================================
// WORKSHOP ROW COMPONENT
// ============================================================================

interface WorkshopRowProps {
  title: string;
  buildings: string[];
  index: number;
  selections: BuildingSelections;
  onUpdate: (
    index: number,
    primary: string,
    secondary: string,
    tertiary: string,
  ) => void;
}

const WorkshopRow = memo(
  ({ title, buildings, index, selections, onUpdate }: WorkshopRowProps) => {
    //  Use selections directly as source of truth for initialization
    const currentSelection = selections[index] || ["", "", ""];
    const [primary, setPrimary] = useState(currentSelection[0]);
    const [secondary, setSecondary] = useState(currentSelection[1]);
    const [tertiary, setTertiary] = useState(currentSelection[2]);

    //  Track the last values we sent via onUpdate to avoid syncing our own changes
    const lastUpdateRef = useRef({ primary, secondary, tertiary });

    //  Derive options from current state
    const secondaryOptions = primary
      ? buildings.filter((b) => b !== primary)
      : [];

    const tertiaryOptions = secondary
      ? buildings.filter((b) => b !== primary && b !== secondary)
      : [];

    const handlePrimaryChange = useCallback(
      (value: string) => {
        setPrimary(value);
        setSecondary("");
        setTertiary("");
        lastUpdateRef.current = { primary: value, secondary: "", tertiary: "" };
        onUpdate(index, value, "", "");
      },
      [index, onUpdate],
    );

    const handleSecondaryChange = useCallback(
      (value: string) => {
        setSecondary(value);

        //  Calculate tertiary synchronously based on new secondary
        const newTertiaryOptions = value
          ? buildings.filter((b) => b !== primary && b !== value)
          : [];
        const newTertiary =
          newTertiaryOptions.length > 0 ? newTertiaryOptions[0] : "";

        setTertiary(newTertiary);
        lastUpdateRef.current = {
          primary,
          secondary: value,
          tertiary: newTertiary,
        };
        onUpdate(index, primary, value, newTertiary);
      },
      [index, primary, buildings, onUpdate],
    );

    const handleReset = useCallback(() => {
      setPrimary("");
      setSecondary("");
      setTertiary("");
      lastUpdateRef.current = { primary: "", secondary: "", tertiary: "" };
      onUpdate(index, "", "", "");
    }, [index, onUpdate]);

    //  Sync with external changes only (from storage events in other tabs/components)
    useEffect(() => {
      const externalPrimary = currentSelection[0];
      const externalSecondary = currentSelection[1];
      const externalTertiary = currentSelection[2];

      // Only update if this change came from external source (not our own update)
      const isOurUpdate =
        lastUpdateRef.current.primary === externalPrimary &&
        lastUpdateRef.current.secondary === externalSecondary &&
        lastUpdateRef.current.tertiary === externalTertiary;

      if (!isOurUpdate) {
        // Schedule state updates in next render cycle to avoid cascading
        const timeoutId = setTimeout(() => {
          setPrimary(externalPrimary);
          setSecondary(externalSecondary);
          setTertiary(externalTertiary);
          lastUpdateRef.current = {
            primary: externalPrimary,
            secondary: externalSecondary,
            tertiary: externalTertiary,
          };
        }, 0);

        return () => clearTimeout(timeoutId);
      }
    }, [currentSelection]);

    const primaryOptions = buildings.map((name) => ({
      value: name,
      label: name,
      imageUrl: getGoodsImg(name),
    }));

    const secondarySelectOptions = secondaryOptions.map((name) => ({
      value: name,
      label: name,
      imageUrl: getGoodsImg(name),
    }));

    return (
      <div className="pt-0 pb-4 border-b border-alpha-400 last:border-b-0">
        {/* Title + Reset */}
        <div className="flex justify-between items-center h-8 mb-2">
          <h3 className="text-sm font-medium">{title}</h3>
          {primary && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="h-7 gap-1.5 text-muted-foreground hover:text-foreground"
            >
              <RotateCw className="size-4" />
              <span className="text-[13px]">Reset</span>
            </Button>
          )}
        </div>

        {/* Selectors */}
        <div className="grid grid-col-1 md:grid-cols-3 size-full gap-2">
          {/* Primary */}
          <ResponsiveSelect
            value={primary}
            onValueChange={handlePrimaryChange}
            options={primaryOptions}
            placeholder="Select Primary"
            drawerClassName="h-[35vh]"
            nested
          />

          {/* Secondary */}
          <ResponsiveSelect
            value={secondary}
            onValueChange={handleSecondaryChange}
            options={secondarySelectOptions}
            placeholder="Select Secondary"
            disabled={!primary}
            drawerClassName="h-[35vh]"
            nested
          />

          {/* Tertiary (display only with same design) */}
          <ResponsiveSelect
            value={tertiary}
            onValueChange={() => {}} // No-op since it's disabled
            options={tertiaryOptions.map((name) => ({
              value: name,
              label: name,
              imageUrl: getGoodsImg(name),
            }))}
            disabled={!secondary}
            placeholder="Tertiary Good"
            readOnly={true}
            hideChevron={true}
            drawerClassName="h-[35vh]"
            nested
          />
        </div>
      </div>
    );
  },
);

WorkshopRow.displayName = "WorkshopRow";

// ============================================================================
// MODAL CONTENT
// ============================================================================

const WorkshopContent = memo(() => {
  const [selections, setSelections] =
    useState<BuildingSelections>(loadSelections);

  //  Listen for storage changes (sync across tabs/components)
  useEffect(() => {
    const handleStorageChange = () => {
      setSelections(loadSelections());
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleUpdate = useCallback(
    (index: number, primary: string, secondary: string, tertiary: string) => {
      setSelections((prev) => {
        const newSelections = [...prev];
        newSelections[index] = [primary, secondary, tertiary];
        saveSelections(newSelections);
        return newSelections;
      });
    },
    [],
  );

  return (
    <div className="flex flex-col h-full max-h-full">
      {/* Header */}
      <div className="shrink-0 sticky top-0 z-10 backdrop-blur-sm border-b border-alpha-400 bg-background px-4 py-1.5 md:py-3">
        <h2 className="text-base font-semibold">Manage Workshops</h2>
        <p className="text-sm text-muted-foreground md:mt-1">
          Update your workshop selections.
        </p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto min-h-0 p-4 space-y-4">
        {buildingsAbbr.map((group, index) => (
          <WorkshopRow
            key={index}
            title={group.title}
            buildings={group.buildings}
            index={index}
            selections={selections}
            onUpdate={handleUpdate}
          />
        ))}
      </div>
    </div>
  );
});

WorkshopContent.displayName = "WorkshopContent";

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function WorkshopModal({
  variant = "outline",
  btnClass,
}: WorkshopModalProps) {
  const [open, setOpen] = useState(false);
  //  Lu une seule fois au mount via initializer lazy — pas de lecture localStorage à chaque render
  const [showPulse, setShowPulse] = useState(
    () =>
      typeof window !== "undefined" && !localStorage.getItem(WORKSHOP_SEEN_KEY),
  );

  const handleOpenChange = (val: boolean) => {
    if (val && showPulse) {
      localStorage.setItem(WORKSHOP_SEEN_KEY, "1");
      setShowPulse(false);
    }
    setOpen(val);
  };

  const trigger = (
    <Button size="sm" variant={variant} className={cn(btnClass, "relative")}>
      <Store className="size-4 mr-1" />
      Workshops
      {showPulse && (
        <span className="absolute -top-0.5 -right-0.5 flex size-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-300 opacity-80" />
          <span className="relative inline-flex size-2.5 rounded-full bg-orange-400" />
        </span>
      )}
    </Button>
  );

  return (
    <ResponsiveModal
      trigger={trigger}
      open={open}
      onOpenChange={handleOpenChange}
      className={cn(
        "p-0 gap-0 flex flex-col overflow-hidden",
        "md:h-[min(600px,50vh)] md:w-full md:max-w-[600px]",
        "h-[80vh]",
      )}
    >
      <WorkshopContent />
    </ResponsiveModal>
  );
}
