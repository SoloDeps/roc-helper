import type { ReactNode } from "react";
import { Info } from "lucide-react";
import type { HeritageEffectGroup } from "@/data/heritage/generated/types";
import type { ResolvedHeritageSlot, ResolvedHeritageVault } from "@/resolvers/heritage";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { EffectCase } from "./effect-case";

/** Gratuit < kit d'évolution (badges) < gemmes — l'ordre de colonnes du jeu. */
function unlockRank(slot: ResolvedHeritageSlot): number {
  if (slot.unlock === null) return 0;
  if (slot.unlock.kind === "item") return 1;
  return 2;
}

/** Les slots d'un groupe, triés par type de coût puis par ordre du jeu. */
export function EffectBlock({
  title,
  group,
  vault,
  selections,
  showCosts,
  equip,
  unequip,
  titleAction,
  action,
}: {
  title: string;
  group: HeritageEffectGroup;
  vault: ResolvedHeritageVault;
  selections: string[][];
  showCosts: boolean;
  equip: (slotId: string, effectId: string) => void;
  unequip: (slotId: string) => void;
  /** Collé au titre, à gauche — le reset du groupe, distinct de `action`. */
  titleAction?: ReactNode;
  action?: ReactNode;
}) {
  // Le jeu ordonne les slots par TYPE de coût, pas par niveau : gratuit
  // d'abord, puis kits d'évolution (badges), puis gemmes en dernier — même
  // quand un slot à kit se déverrouille à un niveau plus élevé qu'un slot à
  // gemmes. `slotIndex` (l'ordre de définition côté jeu) respecte déjà cette
  // hiérarchie, donc il sert de repère stable à égalité de rang.
  const slots = vault.slots
    .filter((slot) => slot.group === group)
    .sort((a, b) => unlockRank(a) - unlockRank(b) || a.slotIndex - b.slotIndex);
  const hasPremiumSlot = slots.some((slot) => slot.premiumSeconds !== null);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <h2 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            {title}
          </h2>
          {titleAction}
          {hasPremiumSlot && (
            <Popover>
              <PopoverTrigger asChild>
                <button
                  type="button"
                  aria-label="About premium slots"
                  className="cursor-pointer rounded-full p-0.5 text-muted-foreground/90 hover:text-foreground"
                >
                  <Info size={14} aria-hidden="true" />
                </button>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-72 p-3 text-xs text-muted-foreground">
                Slots in <span className="font-semibold text-emerald-600 dark:text-emerald-400">green</span> are
                premium: unlocking them costs gems or evolution kits, and only lasts 14 days before they close
                again.
              </PopoverContent>
            </Popover>
          )}
        </div>
        {action}
      </div>
      {/* Même échelle que les grilles de badges du projet (cartes de zone, de
          techno, de bâtiment) : deux colonnes sur téléphone, quatre dès 640 px
          où un groupe redevient une rangée comme en jeu. Ce qui change avec la
          largeur, c'est la HAUTEUR de tuile — les 144 px fixes d'origine
          donnaient deux rangées de vignettes géantes pour trois cadenas. */}
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {slots.map((slot) => (
          <EffectCase
            key={slot.id}
            slot={slot}
            vault={vault}
            selections={selections}
            showCosts={showCosts}
            equip={equip}
            unequip={unequip}
          />
        ))}
      </div>
    </div>
  );
}
