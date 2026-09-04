import {
  getEquippedEffects,
  resolveChestRewards,
  type ResolvedHeritageEffect,
  type ResolvedHeritageVault,
} from "@/resolvers/heritage";
import { EffectIcon } from "@/components/heritage/effect-icon";
import { resolveIconPath } from "@/components/wonders/stats-badge";
import {
  chestRewardIcon,
  chestRewardLabel,
  chestRootLabel,
  describeCultureEffect,
  describeHeritageBonus,
  isChestReward,
} from "@/components/heritage/effect-display";
import { cn } from "@/lib/utils";
import { GroupBadge } from "./group-badge";
import { GROUP_LABELS } from "./constants";

/**
 * Tous les paliers du vault, une ligne par bonus.
 *
 * Itère sur les EFFETS, pas sur les slots : le jeu déclare 10 effets pour 8
 * slots — deux paliers n'ont pas d'emplacement dédié et disparaîtraient d'un
 * tableau indexé par slot.
 */
export function OverviewTable({
  vault,
  selections,
}: {
  vault: ResolvedHeritageVault;
  selections: string[][];
}) {
  const sorted = [...vault.effects].sort((a, b) => a.minLevel - b.minLevel);
  // Même filtre que la liste « Appliqués » : un effet placé dans un slot
  // verrouillé n'est pas actif, la pastille ne doit pas dire le contraire.
  const equippedIds = new Set(getEquippedEffects(vault).map((effect) => effect.id));

  const rowsFor = (effect: ResolvedHeritageEffect) => {
    // Culture : un seul effet-composant, deux bonus (`culture_points` +
    // `culture_range`) — une seule ligne combinée plutôt que deux. Ce tableau
    // liste des PALIERS, pas des valeurs : il n'affiche que `label`, jamais
    // `value` (cf. `describeHeritageBonus` plus bas), et `describeCultureEffect`
    // nomme déjà sa ligne « Culture ».
    const culture = describeCultureEffect(effect.bonuses, selections);
    if (culture !== null) {
      return [
        {
          key: `${effect.id}-culture`,
          src: culture.src,
          overlaySrc: culture.overlaySrc,
          label: culture.label,
        },
      ];
    }

    if (effect.bonuses.length > 0) {
      // Pas d'`amplified` ici : ce tableau liste TOUS les paliers (équipés ou
      // non), et ne rend que `label`/icône (voir la destructuration plus
      // bas) — jamais `value`. Amplifier n'aurait aucun effet visible, et
      // amplifierait à tort un palier qui n'est pas forcément actif.
      return effect.bonuses.map((bonus) => ({
        key: `${effect.id}-${bonus.type}-${bonus.instance}`,
        ...describeHeritageBonus(bonus, selections),
      }));
    }

    // Aucun bonus nommable — l'effet ne verse peut-être qu'un coffre
    // (`ProductionComponentDTO.finish.rewards`). Sans cette ligne, le palier
    // disparaîtrait purement et simplement du tableau alors que la donnée
    // existe (`effect.rewards`).
    //
    // `rewardsAtUnlock`, pas `rewards` : ce tableau liste TOUS les paliers, y
    // compris ceux que le joueur n'a pas encore atteints. `rewards` (résolu au
    // niveau COURANT du vault) vaut `null` avant que ce niveau n'ait rejoint le
    // premier sous-palier du coffre, et la ligne disparaîtrait — `rewardsAtUnlock`
    // se lit au niveau où CE palier se débloque, jamais `null` s'il porte un coffre.
    if (effect.rewardsAtUnlock !== null) {
      const [reward] = resolveChestRewards(effect.rewardsAtUnlock, effect.minLevel, vault.era);
      return [
        {
          key: `${effect.id}-chest`,
          src:
            reward === undefined
              ? resolveIconPath("chest_good")
              : chestRewardIcon(reward, selections),
          overlaySrc: null,
          // Exception : le Crocodile Aztèque (voir `isChestReward`) n'est pas
          // un coffre — son nom tient lieu de libellé, pas « Chest reward ».
          // Le Celtic (`chestRootLabel`) EST un coffre au sens du code, mais
          // pas au sens du jeu : un ticket, pas « Chest reward ».
          label:
            reward === undefined
              ? "Chest reward"
              : isChestReward(reward)
                ? chestRootLabel(reward)
                : chestRewardLabel(reward, selections),
        },
      ];
    }

    return [];
  };

  // Aplati une fois, rendu deux fois : la liste mobile et le tableau desktop
  // disent EXACTEMENT la même chose, seule leur mise en page diffère.
  const allRows = sorted.flatMap((effect) =>
    rowsFor(effect).map((row) => ({ ...row, effect })),
  );

  return (
    <>
      {/* Mobile : une liste, pas un tableau. Trois colonnes dont une de 320 px
          (« Effect ») débordaient de l'écran et coupaient les libellés longs
          (« Recruitment Time Bonus ») sans aucun moyen de les lire. Ici le
          libellé prend toute la largeur restante, le palier et le groupe se
          réduisent à ce qu'ils sont : deux repères. */}
      <ul
        data-layout="list"
        className="divide-y divide-border overflow-hidden rounded-xl border border-border md:hidden"
      >
        {allRows.map(({ key, src, overlaySrc, label, effect }) => (
          <li key={key} className="flex items-center gap-2.5 px-3 py-2.5">
            <span
              aria-hidden="true"
              className={cn(
                "size-1.5 shrink-0 rounded-full",
                effect.group === "production" ? "bg-emerald-500" : "bg-sky-500",
              )}
              title={GROUP_LABELS[effect.group]}
            />
            <EffectIcon src={src} overlaySrc={overlaySrc} alt={label} size={20} />
            <span className="min-w-0 flex-1 truncate text-[13px] font-medium capitalize text-foreground">
              {label}
            </span>
            {equippedIds.has(effect.id) && (
              <span
                className="size-1.5 shrink-0 rounded-full bg-green-500"
                title="Equipped"
              />
            )}
            <span className="shrink-0 text-[12px] font-semibold tabular-nums text-muted-foreground">
              Lv. {effect.minLevel}
            </span>
          </li>
        ))}
      </ul>

      <div
        data-layout="table"
        className="hidden overflow-hidden rounded-xl border border-border md:block"
      >
        <table className="w-full border-collapse text-[13px]">
          <thead>
            <tr className="sticky top-0 bg-background-100 text-left text-[11px] uppercase tracking-wide text-muted-foreground">
              <th className="px-3 py-2 font-medium">Type</th>
              <th className="px-3 py-2 font-medium">Level</th>
              <th className="w-80 px-3 py-2 font-medium">Effect</th>
            </tr>
          </thead>
          <tbody>
            {allRows.map(({ key, src, overlaySrc, label, effect }) => (
              <tr key={key} className="h-11 border-t border-border capitalize">
                <td className="px-3 py-2">
                  <GroupBadge group={effect.group} />
                </td>
                <td className="px-3 py-2 tabular-nums text-muted-foreground">
                  {effect.minLevel}
                </td>
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <EffectIcon src={src} overlaySrc={overlaySrc} alt={label} size={24} />
                    <span className="truncate font-medium text-muted-foreground">
                      {label}
                    </span>
                    {equippedIds.has(effect.id) && (
                      <span
                        className="ml-auto inline-block size-1.5 shrink-0 rounded-full bg-green-500"
                        title="Equipped"
                      />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
