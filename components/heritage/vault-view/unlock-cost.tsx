import { Badge } from "@/components/ui/badge";
import { EffectIcon } from "@/components/heritage/effect-icon";
import { getInventoryItemIconLocal, getItemIconLocal, formatDuration } from "@/lib/utils";
import type { ResolvedHeritageSlot } from "@/resolvers/heritage";

/**
 * `premium` est la gemme du jeu — seul identifiant `kind: "resource"` que le
 * domaine émet pour un coût de slot.
 */
const UNLOCK_ICONS: Record<string, string> = {
  premium: getItemIconLocal("gems"),
};

/**
 * Coût d'ouverture d'un slot — même gabarit qu'une carte d'effet (icône
 * au-dessus, montant en dessous) : le jeu présente le déblocage comme un bonus.
 *
 * `premiumSeconds` n'est pas un coût mais une DURÉE de location : le slot se
 * referme au bout du délai. Les deux s'affichent ensemble quand ils coexistent.
 */
export function UnlockCost({ slot }: { slot: ResolvedHeritageSlot }) {
  const { unlock, premiumSeconds } = slot;

  if (unlock === null && premiumSeconds === null) {
    return <span className="text-[12px] font-medium text-muted-foreground">Free</span>;
  }

  return (
    <div className="flex min-w-0 flex-col items-center justify-center gap-0.5">
      {unlock && (
        <>
          <EffectIcon
            src={
              UNLOCK_ICONS[unlock.definitionId] ??
              // `kind: "item"` = un kit d'inventaire (`InventoryItem_…`),
              // jamais un bien — même dossier dédié que les récompenses de
              // coffre du même kind (`effect-display.ts`).
              (unlock.kind === "item"
                ? getInventoryItemIconLocal(unlock.definitionId)
                : getItemIconLocal(unlock.definitionId))
            }
            alt={unlock.definitionId}
            size={36}
          />
          <span className="truncate text-[13px] font-bold tabular-nums text-foreground">
            {unlock.amount}
          </span>
        </>
      )}
      {premiumSeconds !== null && (
        <Badge variant="secondary" className="mt-1 px-1 text-[10px] md:px-2 md:text-[11px]">
          {formatDuration(premiumSeconds)} premium
        </Badge>
      )}
    </div>
  );
}
