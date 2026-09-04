"use client";

import { cn } from "@/lib/utils";
import { EffectIcon } from "@/components/heritage/effect-icon";
import {
  describeChestEffect,
  describeCultureEffect,
  describeHeritageBonus,
} from "@/components/heritage/effect-display";
import type { ResolvedHeritageEffect, ResolvedHeritageVault } from "@/resolvers/heritage";

/**
 * Une carte affiche icône + valeur — champ commun aux deux chemins de rendu
 * (bonus générique, ou effet de culture combiné) plus bas.
 */
function CardEntry({
  src,
  overlaySrc,
  label,
  value,
  isPrimary,
}: {
  src: string;
  overlaySrc: string | null;
  label: string;
  value: string;
  isPrimary: boolean;
}) {
  return (
    <div className="flex min-w-0 flex-col items-center justify-center gap-0.5">
      <EffectIcon
        src={src}
        overlaySrc={overlaySrc}
        alt={label}
        size={isPrimary ? 36 : 22}
      />
      <span
        className={cn(
          "truncate font-bold tabular-nums text-foreground",
          isPrimary ? "text-[13px]" : "text-[11px]",
        )}
      >
        {value}
      </span>
    </div>
  );
}


/**
 * Contenu d'une carte d'effet (icônes + valeurs) — partagé entre la carte d'un
 * slot équipé et les cartes du sélecteur. Le premier bonus est le principal :
 * il porte la grande icône, les suivants sont réduits.
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
export function EffectCardContents({
  effect,
  vault,
  selections,
  amplified = false,
}: {
  effect: ResolvedHeritageEffect;
  vault: ResolvedHeritageVault;
  selections: string[][];
  amplified?: boolean;
}) {
  // Culture : un seul effet-composant, deux bonus (`culture_points` +
  // `culture_range`) — une seule carte combinée plutôt que deux.
  const culture = describeCultureEffect(effect.bonuses, selections, amplified);
  if (culture !== null) {
    return (
      <CardEntry
        src={culture.src}
        overlaySrc={culture.overlaySrc}
        label={culture.label}
        value={culture.value}
        isPrimary
      />
    );
  }

  // Aucun bonus nommable — l'effet ne verse peut-être qu'un coffre (cf.
  // `describeChestEffect`). Sans ce repli la carte reste vide : aucune icône,
  // aucun texte, sur un bouton qui reste pourtant cliquable.
  if (effect.bonuses.length === 0) {
    const chest = describeChestEffect(effect, vault.level, vault.era, selections);
    if (chest !== null) {
      return (
        <CardEntry
          src={chest.src}
          overlaySrc={chest.overlaySrc}
          label={chest.label}
          value={chest.value}
          isPrimary
        />
      );
    }
  }

  return (
    <>
      {effect.bonuses.map((bonus, i) => {
        const { src, overlaySrc, label, value } = describeHeritageBonus(
          bonus,
          selections,
          amplified,
        );
        return (
          <CardEntry
            key={`${bonus.type}-${bonus.instance}`}
            src={src}
            overlaySrc={overlaySrc}
            label={label}
            value={value}
            isPrimary={i === 0}
          />
        );
      })}
    </>
  );
}
