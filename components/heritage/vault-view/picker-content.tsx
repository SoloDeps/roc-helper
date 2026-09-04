import { getSelectableEffects, type ResolvedHeritageVault } from "@/resolvers/heritage";
import { EffectCardContents } from "./effect-card-contents";

export function PickerContent({
  vault,
  slotId,
  selections,
  onPick,
}: {
  vault: ResolvedHeritageVault;
  slotId: string;
  selections: string[][];
  onPick: (effectId: string) => void;
}) {
  const selectable = getSelectableEffects(vault, slotId);

  if (selectable.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <p className="text-sm text-muted-foreground">No effect available.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-3 md:p-4">
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-[repeat(5,minmax(0,110px))]">
        {selectable.map((effect) => (
          <button
            key={effect.id}
            className="flex h-28 w-full cursor-pointer md:aspect-square md:h-auto flex-col items-center justify-center gap-1.5 rounded-lg border border-border bg-card p-2 shadow-sm transition-colors hover:bg-muted/50"
            onClick={() => onPick(effect.id)}
          >
            {/* `amplified` : l'amplificateur est une propriété du BÂTIMENT, pas
                du slot — la carte doit annoncer ce que l'effet vaudra une fois
                posé, sinon la valeur change en le posant. Cf. la note de
                `EffectCardContents`. */}
            <EffectCardContents effect={effect} vault={vault} selections={selections} amplified />
          </button>
        ))}
      </div>
    </div>
  );
}
