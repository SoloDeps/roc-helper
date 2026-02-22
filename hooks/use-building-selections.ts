import { useEffect, useState } from "react";
import { buildingsAbbr } from "@/lib/constants";
import { isValidData } from "@/lib/utils";

type BuildingSelections = string[][];

const KEY = "local:buildingSelections";
const DEFAULT = buildingsAbbr.map(() => ["", "", ""]);

function parse(raw: string): BuildingSelections | null {
  if (!isValidData(raw)) return null;
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function loadFromStorage(): BuildingSelections {
  if (typeof window === "undefined") return DEFAULT;

  const stored = localStorage.getItem(KEY);
  if (!stored) return DEFAULT;

  const parsed = parse(stored);
  return parsed || DEFAULT;
}

/**
 *  Hook that syncs with localStorage and listens for changes
 */
export function useBuildingSelections() {
  const [selections, setSelections] =
    useState<BuildingSelections>(loadFromStorage);

  useEffect(() => {
    //  Listen for storage events (sync across tabs/components)
    const handleStorageChange = () => {
      //  Use queueMicrotask to defer setState and avoid render conflicts
      queueMicrotask(() => {
        setSelections(loadFromStorage());
      });
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return selections;
}
