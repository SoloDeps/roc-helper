import { cn } from "@/lib/utils";
import {
  getEquippedEffects,
  getUnequippedUnlockedEffects,
  type ResolvedHeritageVault,
} from "@/resolvers/heritage";
import { EffectSummaryRow } from "./effect-summary-row";
import { ChestContentSection } from "./chest-content-section";

export function TotalSummary({
  vault,
  selections,
}: {
  vault: ResolvedHeritageVault;
  selections: string[][];
}) {
  const unlockedSlots = vault.slots.filter((slot) => slot.reachable).length;
  const activeEffects = getEquippedEffects(vault);
  const idleEffects = getUnequippedUnlockedEffects(vault);

  // ⚠️ REQUÊTE DE CONTENEUR, PAS DE FENÊTRE. Cette carte vit tantôt en pleine
  // largeur (mobile, un seul flux), tantôt dans la colonne gauche de la grille
  // `lg` — ~430 px à 1024 px de fenêtre. Une échelle en `sm:`/`md:` lisait la
  // FENÊTRE et passait donc à quatre colonnes dans une colonne qui n'en tient
  // que deux : « 1580 (3x3) » y était tronqué en « 1580 (3x… ». Les paliers
  // portent ici sur la place réellement disponible.
  return (
    <div className="@container rounded-xl border border-border bg-card p-4 shadow-sm">
      <p className="text-sm">
        <span className="font-semibold text-foreground">
          {unlockedSlots}/{vault.slots.length} slots unlocked
        </span>
        <span className="text-muted-foreground"> · Level {vault.level}</span>
      </p>

      {activeEffects.length > 0 && (
        <div className="mt-2.5">
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
            Applied
          </p>
          <div className="grid grid-cols-2 gap-2 @min-[420px]:grid-cols-3 @min-[580px]:grid-cols-4">
            {activeEffects.map((effect) => (
              <EffectSummaryRow
                key={effect.id}
                effect={effect}
                vault={vault}
                selections={selections}
                amplified
              />
            ))}
          </div>
        </div>
      )}

      {idleEffects.length > 0 && (
        <div
          className={cn(
            "mt-2.5",
            activeEffects.length > 0 && "border-t border-border pt-2.5",
          )}
        >
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Not applied
          </p>
          <div className="grid grid-cols-2 gap-2 @min-[420px]:grid-cols-3 @min-[580px]:grid-cols-4">
            {idleEffects.map((effect) => (
              <EffectSummaryRow
                key={effect.id}
                effect={effect}
                vault={vault}
                selections={selections}
                muted
                amplified
              />
            ))}
          </div>
        </div>
      )}

      <ChestContentSection vault={vault} selections={selections} />
    </div>
  );
}
