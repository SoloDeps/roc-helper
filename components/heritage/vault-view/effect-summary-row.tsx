import { cn } from "@/lib/utils";
import { EffectIcon } from "@/components/heritage/effect-icon";
import {
  describeChestEffect,
  describeCultureEffect,
  describeHeritageBonus,
} from "@/components/heritage/effect-display";
import type { ResolvedHeritageEffect, ResolvedHeritageVault } from "@/resolvers/heritage";

/**
 * LE badge de stat du domaine : icône + valeur, rien d'autre.
 *
 * `StatsBadge` (wonders) n'accepte que des CLÉS d'icône, pas des chemins
 * résolus — or un bien du Heritage Vault dépend du classement d'ateliers du
 * joueur. La vignette est donc reconstruite ici, une fois, avec la même mise en
 * page.
 *
 * ⚠️ EXPORTÉ, et c'est le point : tout ce qui affiche une stat de ce domaine
 * passe par lui. `EffectSummaryRow` juste en dessous l'utilise pour un effet de
 * vault ; les cartes de l'onglet Combination l'utilisent pour un bâtiment
 * évolutif, qui n'a pas d'« effets » mais des listes de bonus. Une seconde
 * vignette ailleurs ferait diverger deux vues qui doivent se lire pareil.
 */
export function BonusBadge({
  src,
  overlaySrc,
  label,
  value,
  muted,
}: {
  src: string;
  overlaySrc: string | null;
  label: string;
  value: string;
  muted?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex h-9 shrink-0 items-center justify-between gap-1.5 rounded-md border border-alpha-200 bg-background-100 px-2",
        muted && "opacity-70",
      )}
    >
      <EffectIcon src={src} overlaySrc={overlaySrc} alt={label} size={25} />
      <span className="truncate text-sm font-medium tabular-nums">{value}</span>
    </div>
  );
}

/**
 * Les badges d'UN effet de vault.
 *
 * ⚠️ RÈGLE `amplified` — L'AMPLIFICATEUR EST UNE PROPRIÉTÉ DU BÂTIMENT, PAS DU
 * SLOT. Le rang de gardien vaut pour tout le vault : un effet débloqué rendra
 * la valeur amplifiée dès qu'il sera posé, qu'il le soit ou non aujourd'hui.
 * Toute vue qui affiche une VALEUR d'effet de ce vault passe donc `amplified`
 * (cartes de slot, sélecteur, sections « Applied » ET « Not applied »). Ce qui
 * distingue l'actif de l'inactif est le style (`muted`) et la section, jamais
 * un chiffre différent — afficher une valeur nue en réserve puis amplifiée une
 * fois posée ferait croire que poser l'effet change sa valeur.
 * Seul `overview-table.tsx` s'en passe : il n'affiche aucune valeur.
 */
export function EffectSummaryRow({
  effect,
  vault,
  selections,
  muted,
  amplified = false,
}: {
  effect: ResolvedHeritageEffect;
  vault: ResolvedHeritageVault;
  selections: string[][];
  muted?: boolean;
  amplified?: boolean;
}) {
  // Culture : un seul effet-composant, deux bonus (`culture_points` +
  // `culture_range`) — un seul badge combiné plutôt que deux, même règle que
  // `overview-table.tsx` / `effect-card-contents.tsx`.
  const culture = describeCultureEffect(effect.bonuses, selections, amplified);
  const chest =
    culture === null && effect.bonuses.length === 0
      ? describeChestEffect(effect, vault.level, vault.era, selections)
      : null;
  const entries =
    culture !== null
      ? [{ key: `${effect.id}-culture`, ...culture }]
      : chest !== null
        ? [{ key: `${effect.id}-chest`, ...chest }]
        : effect.bonuses.map((bonus) => ({
            key: `${effect.id}-${bonus.type}-${bonus.instance}`,
            ...describeHeritageBonus(bonus, selections, amplified),
          }));

  return (
    <>
      {entries.map(({ key, src, overlaySrc, label, value }) => (
        <BonusBadge
          key={key}
          src={src}
          overlaySrc={overlaySrc}
          label={label}
          value={value}
          muted={muted}
        />
      ))}
    </>
  );
}