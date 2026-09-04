"use client";

import { useState } from "react";
import { Lock, Plus, X } from "lucide-react";

import { ResponsivePopover } from "@/components/modals/responsive-popover";
import type { ResolvedHeritageSlot, ResolvedHeritageVault } from "@/resolvers/heritage";
import { UnlockCost } from "./unlock-cost";
import { EffectCardContents } from "./effect-card-contents";
import { PickerContent } from "./picker-content";

export function EffectCase({
  slot,
  vault,
  selections,
  showCosts,
  equip,
  unequip,
}: {
  slot: ResolvedHeritageSlot;
  vault: ResolvedHeritageVault;
  selections: string[][];
  showCosts: boolean;
  equip: (slotId: string, effectId: string) => void;
  unequip: (slotId: string) => void;
}) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const equippedEffect =
    slot.effectId === null
      ? undefined
      : vault.effects.find((effect) => effect.id === slot.effectId);

  const lockedCost = (
    <>
      <UnlockCost slot={slot} />
      <span className="text-[11px] font-medium text-muted-foreground">
        Lv. {slot.minLevel}
      </span>
    </>
  );

  // Slot verrouillé : jamais interactif. En mode coûts il montre quand même son
  // prix d'ouverture, c'est l'intérêt du mode.
  if (!slot.reachable) {
    return showCosts ? (
      <div className="flex h-28 w-full sm:h-32 md:h-36 flex-col items-center justify-center gap-1 rounded-lg border border-border bg-card p-2 shadow-sm">
        {lockedCost}
      </div>
    ) : (
      <div className="flex h-28 w-full sm:h-32 md:h-36 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border/70 bg-muted/30 text-muted-foreground">
        <Lock size={18} aria-hidden="true" />
        <span className="text-[11px] font-medium">Lv. {slot.minLevel}</span>
      </div>
    );
  }

  const picker = (
    <>
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-border px-3 py-2">
        <h3 className="text-xs font-bold">Select an effect</h3>
        <button
          type="button"
          aria-label="Close"
          onClick={() => setPickerOpen(false)}
          className="cursor-pointer text-[13px] text-muted-foreground hover:text-foreground"
        >
          ✕
        </button>
      </div>
      <PickerContent
        vault={vault}
        slotId={slot.id}
        selections={selections}
        onPick={(effectId) => {
          equip(slot.id, effectId);
          setPickerOpen(false);
        }}
      />
    </>
  );

  const trigger = equippedEffect ? (
    <button className="flex h-28 w-full sm:h-32 md:h-36 cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border border-border bg-card p-2 shadow-sm transition-colors hover:bg-muted/50">
      {showCosts ? (
        lockedCost
      ) : (
        // `amplified` partout où une valeur de ce vault s'affiche — cf. la
        // règle en tête d'`EffectCardContents`.
        <EffectCardContents effect={equippedEffect} vault={vault} selections={selections} amplified />
      )}
    </button>
  ) : (
    <button className="flex h-28 w-full sm:h-32 md:h-36 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground">
      {showCosts ? (
        lockedCost
      ) : (
        <>
          <Plus className="size-4" aria-hidden="true" />
          <span className="text-[11px] font-medium">Add</span>
        </>
      )}
    </button>
  );

  return (
    <div className="group/case relative">
      <ResponsivePopover
        title="Select an effect"
        trigger={trigger}
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        align="start"
        className="flex flex-col p-0 md:max-h-[min(420px,70vh)] md:w-auto"
      >
        {picker}
      </ResponsivePopover>

      {equippedEffect && (
        <button
          onClick={(event) => {
            event.stopPropagation();
            unequip(slot.id);
          }}
          className="absolute right-1 top-1 z-10 flex size-5 cursor-pointer items-center justify-center rounded-full bg-black/60 text-white/80 transition-opacity hover:bg-black/80 hover:text-white md:opacity-0 md:group-hover/case:opacity-100"
          title="Remove"
        >
          <X className="size-3" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
