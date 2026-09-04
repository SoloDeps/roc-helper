"use client";

import { useState, useCallback, useEffect, memo, useRef } from "react";
import { Store, RotateCw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResponsiveModal } from "./responsive-modal";
import { ResponsiveSelect } from "./responsive-select";
import { buildingsAbbr } from "@/lib/constants";
import { getGoodsImg } from "@/lib/utils";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useBuildingSelectionsStore } from "@/lib/stores/building-selections-store";

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

  // Second canal, synchrone : voir lib/stores/building-selections-store.ts.
  // N'affecte pas la ligne ci-dessus, qui reste la seule que lisent
  // Calculator/Technologies/Wonders.
  useBuildingSelectionsStore.getState().setSelections(selections);
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

interface WorkshopContentProps {
  onClose?: () => void;
}

const WorkshopContent = memo(({ onClose }: WorkshopContentProps) => {
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
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-base font-semibold">Manage Workshops</h2>
            <p className="text-sm text-muted-foreground md:mt-1">
              Update your workshop selections.{" "}
              <Link
                href="/help#workshops-system"
                className="underline font-medium text-blue-500 dark:text-cyan-400"
                onClick={() => onClose?.()}
              >
                Need help?
              </Link>
            </p>
          </div>
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full h-8 w-8 shrink-0 max-sm:-mt-1.5"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          )}
        </div>
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
  /**
   * ⚠️ LU APRÈS LE MONTAGE, JAMAIS AU PREMIER RENDU — sinon l'hydratation casse.
   *
   * L'initializer lisait `localStorage` derrière un `typeof window`. Les deux
   * rendus ne pouvaient alors PAS coïncider : côté serveur `window` n'existe
   * pas, `showPulse` valait `false` et le HTML ne portait aucune pastille ;
   * côté client la clé était absente, `showPulse` valait `true` et la pastille
   * apparaissait. React comparait deux arbres différents et jetait
   * « Hydration failed », sur TOUTE page portant ce bouton.
   *
   * Le `typeof window` ne protégeait donc de rien : il ne faisait qu'ancrer la
   * divergence. L'état part maintenant de ce que le serveur rend (`false`), et
   * l'effet — qui ne s'exécute qu'au client — l'allume si la pastille n'a jamais
   * été vue. Un rendu de plus, pas de saut visible : la pastille est une
   * incitation, pas une information qu'on attend.
   *
   * ⚠️ `queueMicrotask` — l'idiome déjà employé par `useSessionStorageState` et
   * par le garde `mounted` de `HeritageVaultView`, pour la même raison : un
   * `setState` synchrone dans un effet déclenche un rendu en cascade pendant la
   * phase de commit, ce que `react-hooks/set-state-in-effect` refuse à juste
   * titre. Différer d'une microtâche sort la mise à jour de cette phase sans
   * rien retarder de perceptible.
   *
   * Le `try/catch` suit la même règle que `useSessionStorageState` :
   * `localStorage` lève en navigation privée stricte, et un effet qui jette
   * casserait le bouton entier pour un ornement.
   */
  const [showPulse, setShowPulse] = useState(false);
  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      try {
        if (localStorage.getItem(WORKSHOP_SEEN_KEY) === null) setShowPulse(true);
      } catch {
        // Stockage indisponible : pas de pastille, le bouton reste utilisable.
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

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
      <WorkshopContent onClose={() => setOpen(false)} />
    </ResponsiveModal>
  );
}
