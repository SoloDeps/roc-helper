"use client";

/**
 * WonderSlotGrid
 *
 * Shared grid component for Capital City and Allied Cultures preset slots.
 * Removes the duplication between the two identical grid blocks in preset-tab.
 *
 * Usage:
 *   <WonderSlotGrid
 *     label="Capital City"
 *     slotType="capital"
 *     entries={activePreset.capital}
 *     ownedMap={ownedMap}
 *     activePresetId={activePresetId}
 *     onAdd={(idx) => openPicker("capital", idx)}
 *     onRemove={(idx) => removeWonder("capital", idx)}
 *     onLevelChange={(idx, lv) => changeLevel("capital", idx, lv)}
 *   />
 */

import { PresetSlot } from "./presets/components";
import type { WonderPresetEntry } from "@/data/wonders/types";

const SLOT_INDICES = [0, 1, 2, 3] as const;

interface WonderSlotGridProps {
  label: string;
  slotType: "capital" | "allied";
  entries: (WonderPresetEntry | null)[];
  ownedMap: Record<string, { code: string; lvl: number }>;
  activePresetId: string;
  onAdd: (index: number) => void;
  onRemove: (index: number) => void;
  onLevelChange: (index: number, level: number | null) => void;
}

export function WonderSlotGrid({
  label,
  slotType,
  entries,
  ownedMap,
  activePresetId,
  onAdd,
  onRemove,
  onLevelChange,
}: WonderSlotGridProps) {
  return (
    <div className="flex-1 min-w-0 space-y-4">
      <p className="text-[13px] font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </p>
      <div className="grid grid-cols-2 gap-x-3 gap-y-6 items-start">
        {SLOT_INDICES.map((idx) => {
          const entry = entries[idx] ?? null;
          return (
            <PresetSlot
              key={idx}
              entry={entry}
              ownedMap={ownedMap}
              onAdd={() => onAdd(idx)}
              onRemove={() => onRemove(idx)}
              onLevelChange={(lv) => onLevelChange(idx, lv)}
            />
          );
        })}
      </div>
    </div>
  );
}
