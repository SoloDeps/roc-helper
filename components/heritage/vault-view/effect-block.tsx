import type { ReactNode } from "react";
import type { HeritageEffectGroup } from "@/data/heritage/generated/types";
import type { ResolvedHeritageVault } from "@/resolvers/heritage";
import { EffectCase } from "./effect-case";

/** Les slots d'un groupe, triés par niveau de déblocage. */
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
  const slots = vault.slots
    .filter((slot) => slot.group === group)
    .sort((a, b) => a.minLevel - b.minLevel);

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
          <h2 className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            {title}
          </h2>
          {titleAction}
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
