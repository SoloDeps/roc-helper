"use client";

import { useState, useMemo, useCallback } from "react";
import { useUserPresets } from "@/lib/stores/user-presets-store";
import { getPresetCodes, computeSynergies, getWonderBoosts } from "@/lib/wonders-utils";
import { WONDERS } from "@/data/wonders/index";

import {
  PresetTabSkeleton,
  PresetSlot,
  WonderPickerModal,
} from "./presets/components";
import {
  SynergyPanel,
  WonderBoostsPanel,
} from "./presets/synergies";
import { SwitchableSection } from "./presets/switchable-section";
import { PresetSwitcher } from "./presets/preset-switcher";
import { PresetActions } from "./presets/preset-actions";
import { TabsContent } from "@/components/ui/tabs";

// ─── Main Presets Tab ─────────────────────────────────────────────────────────

export interface PresetTabProps {
  ownedMap: Record<string, { code: string; lvl: number }>;
}

export function PresetTab({ ownedMap }: PresetTabProps) {
  const {
    presets,
    hasHydrated,
    activePreset,
    activePresetId,
    setActivePresetId,
    addPreset,
    deletePreset,
    renamePreset,
    setWonder,
    clearPreset,
    duplicatePreset,
    maxAllWonders,
  } = useUserPresets();

  const [pickerState, setPickerState] = useState<{
    open: boolean;
    slotType: "capital" | "allied";
    slotIndex: number;
  } | null>(null);
  const [editingName, setEditingName] = useState(false);

  const codes = useMemo(
    () => (activePreset ? getPresetCodes(activePreset) : []),
    [activePreset],
  );

  // Toutes les entries du preset (capital + allied) pour passer au WonderBoostsPanel
  const allEntries = useMemo(() => {
    if (!activePreset) return [];
    return [...activePreset.capital, ...activePreset.allied];
  }, [activePreset]);

  // Counts for inline summary near preset name
  const synergyCount = useMemo(
    () => computeSynergies(codes).filter((s) => s.synergyActive).length,
    [codes],
  );
  const boostCount = useMemo(() => {
    let total = 0;
    for (const entry of allEntries) {
      if (!entry) continue;
      const wonder = WONDERS[entry.code];
      if (!wonder) continue;
      const level = entry.level ?? ownedMap[entry.code]?.lvl ?? 1;
      if (getWonderBoosts(wonder, level).length > 0) total++;
    }
    return total;
  }, [allEntries, ownedMap]);

  // Split codes by slot type for 2-column WonderBoostsPanel
  const capitalCodes = useMemo(
    () => activePreset.capital.filter((e): e is NonNullable<typeof e> => e !== null).map((e) => e.code),
    [activePreset],
  );
  const alliedCodes = useMemo(
    () => activePreset.allied.filter((e): e is NonNullable<typeof e> => e !== null).map((e) => e.code),
    [activePreset],
  );

  const handleSelectWonder = useCallback(
    (code: string) => {
      if (!pickerState || !activePresetId) return;
      setWonder(activePresetId, pickerState.slotType, pickerState.slotIndex, {
        code,
        level: null,
      });
    },
    [pickerState, activePresetId, setWonder],
  );

  const handleLevelChange = useCallback(
    (
      slotType: "capital" | "allied",
      slotIndex: number,
      level: number | null,
    ) => {
      if (!activePresetId || !activePreset) return;
      const existing = activePreset[slotType][slotIndex];
      if (!existing) return;
      setWonder(activePresetId, slotType, slotIndex, { ...existing, level });
    },
    [activePresetId, activePreset, setWonder],
  );

  if (!hasHydrated || !activePreset) {
    return <PresetTabSkeleton />;
  }

  return (
    <div className="space-y-4 pb-8">
      <div className="@container flex items-start gap-2 w-full max-w-[1050px]">
        <div className="flex gap-2 flex-col md:flex-row">
          <PresetSwitcher
            presets={presets}
            activePresetId={activePresetId!}
            onSelect={setActivePresetId}
            onAddPreset={() => addPreset()}
          />

          {editingName ? (
            <input
              autoFocus
              value={activePreset.name}
              maxLength={30}
              onChange={(e) => renamePreset(activePreset.id, e.target.value)}
              onBlur={() => setEditingName(false)}
              onKeyDown={(e) => e.key === "Enter" && setEditingName(false)}
              className="w-full md:w-[150px] h-9 bg-muted rounded-md px-2.5 text-sm font-semibold outline-none focus:ring-1 focus:ring-ring"
            />
          ) : null}

        </div>

        {/* {(synergyCount > 0 || boostCount > 0) && (
          <span className="text-xs text-muted-foreground tabular-nums">
            {synergyCount} synergy{synergyCount !== 1 ? "s" : ""} · {boostCount} boost{boostCount !== 1 ? "s" : ""}
          </span>
        )} */}

        <div className="flex-1" />

        <PresetActions
          onRename={() => setEditingName(true)}
          onDuplicate={() => duplicatePreset(activePreset.id)}
          onMaxAll={() => maxAllWonders(activePreset.id)}
          onClear={() => clearPreset(activePreset.id)}
          onDelete={() => deletePreset(activePreset.id)}
        />
      </div>

          <div className="w-full max-w-[1050px] space-y-4">
          {/* ── Grilles Capital City + Allied Cultures ── */}
          <SwitchableSection
            tabs={[
              { value: "capital", label: "Capital city" },
              { value: "allied", label: "Allied cultures" },
            ]}
            defaultValue="capital"
            wide={
              <div className="flex gap-4 w-full">
                {/* Capital City */}
                <div className="flex-1 min-w-0 space-y-4">
                  <p className="text-[13px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Capital City
                  </p>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-6 items-start">
                    {[0, 1, 2, 3].map((idx) => {
                      const entry = activePreset.capital[idx];
                      return (
                        <PresetSlot
                          key={idx}
                          entry={entry ?? null}
                          ownedMap={ownedMap}
                          onAdd={() =>
                            setPickerState({
                              open: true,
                              slotType: "capital",
                              slotIndex: idx,
                            })
                          }
                          onRemove={() =>
                            setWonder(activePresetId!, "capital", idx, null)
                          }
                          onLevelChange={(lv) =>
                            handleLevelChange("capital", idx, lv)
                          }
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Allied Cultures */}
                <div className="flex-1 min-w-0 space-y-4">
                  <p className="text-[13px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Allied Cultures
                  </p>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-6 items-start">
                    {[0, 1, 2, 3].map((idx) => {
                      const entry = activePreset.allied[idx];
                      return (
                        <PresetSlot
                          key={idx}
                          entry={entry ?? null}
                          ownedMap={ownedMap}
                          onAdd={() =>
                            setPickerState({
                              open: true,
                              slotType: "allied",
                              slotIndex: idx,
                            })
                          }
                          onRemove={() =>
                            setWonder(activePresetId!, "allied", idx, null)
                          }
                          onLevelChange={(lv) =>
                            handleLevelChange("allied", idx, lv)
                          }
                        />
                      );
                    })}
                  </div>
                </div>
              </div>
            }
            narrow={
              <>
                <TabsContent value="capital" className="space-y-4">
                  <p className="text-[13px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Capital City
                  </p>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-6 items-start">
                    {[0, 1, 2, 3].map((idx) => {
                      const entry = activePreset.capital[idx];
                      return (
                        <PresetSlot
                          key={idx}
                          entry={entry ?? null}
                          ownedMap={ownedMap}
                          onAdd={() =>
                            setPickerState({
                              open: true,
                              slotType: "capital",
                              slotIndex: idx,
                            })
                          }
                          onRemove={() =>
                            setWonder(activePresetId!, "capital", idx, null)
                          }
                          onLevelChange={(lv) =>
                            handleLevelChange("capital", idx, lv)
                          }
                        />
                      );
                    })}
                  </div>
                </TabsContent>
                <TabsContent value="allied" className="space-y-4">
                  <p className="text-[13px] font-semibold uppercase tracking-widest text-muted-foreground">
                    Allied Cultures
                  </p>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-6 items-start">
                    {[0, 1, 2, 3].map((idx) => {
                      const entry = activePreset.allied[idx];
                      return (
                        <PresetSlot
                          key={idx}
                          entry={entry ?? null}
                          ownedMap={ownedMap}
                          onAdd={() =>
                            setPickerState({
                              open: true,
                              slotType: "allied",
                              slotIndex: idx,
                            })
                          }
                          onRemove={() =>
                            setWonder(activePresetId!, "allied", idx, null)
                          }
                          onLevelChange={(lv) =>
                            handleLevelChange("allied", idx, lv)
                          }
                        />
                      );
                    })}
                  </div>
                </TabsContent>
              </>
            }
          />
        </div>

        {/* ── Synergies + Boosts ── */}
        <div className="w-full">
          <SwitchableSection
            tabs={[
              { value: "synergies", label: "Active synergies" },
              { value: "boosts", label: "Wonder boosts" },
            ]}
            defaultValue="synergies"
            wide={
              <div className="grid grid-cols-2 md:grid-cols-3 w-full max-w-262.5 gap-3">
                <div className="md:col-span-1">
                  <SynergyPanel codes={codes} />
                </div>
                <div className="md:col-span-2">
                  <WonderBoostsPanel
                    codes={codes}
                    entries={allEntries}
                    ownedMap={ownedMap}
                    capitalCodes={capitalCodes}
                    alliedCodes={alliedCodes}
                  />
                </div>
              </div>
            }
            narrow={
              <>
                <TabsContent value="synergies">
                  <SynergyPanel codes={codes} />
                </TabsContent>
                <TabsContent value="boosts">
                  <WonderBoostsPanel
                    codes={codes}
                    entries={allEntries}
                    ownedMap={ownedMap}
                    capitalCodes={capitalCodes}
                    alliedCodes={alliedCodes}
                  />
                </TabsContent>
              </>
            }
          />
        </div>

      {/* ── Wonder picker modal ── */}
      <WonderPickerModal
        open={!!pickerState?.open}
        onClose={() => setPickerState(null)}
        onSelect={handleSelectWonder}
        excludeCodes={codes}
        slotType={pickerState?.slotType ?? "capital"}
      />
    </div>
  );
}