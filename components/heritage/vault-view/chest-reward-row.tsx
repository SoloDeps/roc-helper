import { formatChancePercent, type ResolvedChestReward } from "@/resolvers/heritage";
import { formatNumber } from "@/lib/utils";
import { EffectIcon } from "@/components/heritage/effect-icon";
import {
  chestRewardAmount,
  chestRewardIcon,
  chestRewardLabel,
} from "@/components/heritage/effect-display";

/**
 * Une ligne de récompense de coffre — PREMIÈRE COUCHE UNIQUEMENT, comme le
 * popup « Coffre » du jeu : icône + montant éventuel + libellé + probabilité,
 * rien de plus. `reward.children` reste entièrement résolu par
 * `resolvers/heritage.ts` (rien n'est perdu côté donnée — `chestRewardAmount`
 * s'en sert pour ramener un montant homogène à la surface) ; c'est le RENDU
 * qui s'arrête ici. Déplier chaque sous-tirage mélangeait paliers imbriqués
 * et récompenses garanties dans une liste illisible, loin de ce que montre le
 * jeu.
 */
export function ChestRewardRow({
  reward,
  selections,
}: {
  reward: ResolvedChestReward;
  selections: string[][];
}) {
  const amount = chestRewardAmount(reward);
  const label = chestRewardLabel(reward, selections);
  // La quantité d'abord, TOUJOURS — comme le popup « CHEST » du jeu, qui
  // affiche « 1 » même pour une pièce de puzzle unique, jamais un « ×N » en
  // petit à la suite du nom. Un seul format pour toute récompense, plus de
  // distinction bien/item : `amount` est déjà `null` pour ce qui n'a
  // justement pas de quantité (cf. `chestRewardAmount`).
  //
  // Même formatage que partout ailleurs (`formatNumber`) : abrégé en K/M
  // au-delà de 100 000, groupé en dessous. Un lot de coffre garanti dépasse le
  // million — écrit en entier, il chassait le nom de la récompense hors de la
  // ligne. Remplace un groupement des milliers fait à la main ici.
  const groupedAmount = amount === null ? null : formatNumber(Math.round(amount));
  const text = groupedAmount === null ? label : `${groupedAmount} ${label}`;
  return (
    <div className="flex h-9 shrink-0 items-center justify-between gap-1.5 rounded-md border border-alpha-200 bg-background-100 px-2">
      <div className="flex min-w-0 items-center gap-1.5">
        <EffectIcon
          src={chestRewardIcon(reward, selections)}
          alt={label}
          size={25}
        />
        <span className="truncate text-sm font-medium capitalize">{text}</span>
      </div>
      {reward.chancePercent !== null && (
        <span className="shrink-0 text-sm font-medium tabular-nums">
          {formatChancePercent(reward.chancePercent)}
        </span>
      )}
    </div>
  );
}
