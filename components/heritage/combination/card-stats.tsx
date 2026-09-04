"use client";

import type { ReactNode } from "react";

import {
  describeCultureEffect,
  describeHeritageBonus,
} from "@/components/heritage/effect-display";
import {
  BonusBadge,
  EffectSummaryRow,
} from "@/components/heritage/vault-view/effect-summary-row";
import { bonusKey } from "@/resolvers/bonus";
import { getEquippedEffects, type ResolvedHeritageVault } from "@/resolvers/heritage";
import type { ResolvedEvolvingBuilding } from "@/resolvers/evolving-buildings";

// ============================================================
// Les stats d'UN porteur, sous sa carte.
//
// ⚠️ AUCUNE VIGNETTE N'EST REDÉFINIE ICI. Le badge est celui du panneau Infos
// (`BonusBadge` / `EffectSummaryRow`) : les deux onglets doivent se lire à
// l'identique, et le seul moyen de le garantir est qu'ils partagent le
// composant. Ce fichier ne fait que RASSEMBLER les bonus d'un porteur et les
// poser dans la même grille que `TotalSummary`.
//
// ⚠️ À NE PAS CONFONDRE AVEC LE TABLEAU DE DROITE : celui-ci ne cumule rien, il
// dit ce qu'un seul bâtiment porte — pour qu'on voie d'où sort chaque
// contribution du total sans avoir à déplier une ligne.
// ============================================================

/** La grille de `TotalSummary`, reprise telle quelle. */
function StatsSection({ children, empty }: { children: ReactNode; empty: string | null }) {
  // Même raison que `TotalSummary` : ces cartes passent en colonne à partir de
  // `lg`, la largeur de FENÊTRE ne dit rien de la place qu'elles ont.
  return (
    <div className="@container flex flex-col gap-1.5">
      <p className="text-[12px] font-semibold uppercase tracking-widest text-muted-foreground">
        Bonus
      </p>
      {empty !== null ? (
        <p className="rounded-md bg-background-100 px-2.5 py-2 text-[13px] text-muted-foreground">
          {empty}
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-2 @min-[420px]:grid-cols-3 @min-[580px]:grid-cols-4">{children}</div>
      )}
    </div>
  );
}

/**
 * Ce que le bâtiment d'héritage porte — SES EFFETS ÉQUIPÉS SEULEMENT.
 *
 * ⚠️ La même règle que le cumul : 8 emplacements pour 10 effets, le jeu ne
 * permet jamais les 10. Lister les effets débloqués mais non posés ferait mentir
 * la carte, et le total de droite ne s'y retrouverait pas.
 *
 * `amplified` partout : le rang de gardien est une propriété du BÂTIMENT, pas du
 * slot — c'est la règle posée dans `EffectSummaryRow`.
 */
export function VaultCardStats({
  vault,
  selections,
}: {
  vault: ResolvedHeritageVault;
  selections: string[][];
}) {
  const effects = getEquippedEffects(vault);
  return (
    <StatsSection
      empty={
        effects.length === 0
          ? "Equip an effect above to see what the vault contributes."
          : null
      }
    >
      {effects.map((effect) => (
        <EffectSummaryRow
          key={effect.id}
          effect={effect}
          vault={vault}
          selections={selections}
          amplified
        />
      ))}
    </StatsSection>
  );
}

/**
 * Ce qu'un bâtiment évolutif porte au niveau et à l'ère choisis.
 *
 * ⚠️ Il n'a pas d'« effets » au sens du vault, mais trois listes de bonus :
 * `EffectSummaryRow` ne s'applique donc pas, et c'est `BonusBadge` qui est
 * réutilisé directement — même vignette, un cran plus bas.
 *
 * ⚠️ `culture_points` et `culture_range` sont recombinés en UN badge
 * (« 496 (4x4) »), comme partout ailleurs. Le regroupement porte sur
 * `resolved.culture`, qui isole DÉJÀ la paire d'un même composant : l'appliquer
 * à une liste aplatie marierait les points d'un effet à la portée d'un autre.
 */
export function EvolvingCardStats({
  resolved,
  selections,
}: {
  resolved: ResolvedEvolvingBuilding;
  selections: string[][];
}) {
  const describe = (bonuses: ResolvedEvolvingBuilding["bonuses"], group: string) => {
    // ⚠️ FILTRÉ SUR `value`, PAS SUR LA CHAÎNE « — ». Un bonus que le game
    // design ne chiffre pas à ce niveau n'a rien à montrer : dans une LIGNE
    // nommée (l'onglet Sacrifice) le tiret dit « cette stat existe, pas
    // encore » ; dans un badge sans libellé il ne dit plus rien du tout, et
    // l'Épave au niveau 1 en alignait deux. Le test porte sur la donnée pour
    // ne pas dépendre du formatage.
    const carried = bonuses.filter((bonus) => bonus.value !== null);
    const culture = describeCultureEffect(carried, selections);
    if (culture !== null) return [{ key: `${group}#culture`, ...culture }];
    return carried.map((bonus) => ({
      key: `${group}#${bonusKey(bonus)}`,
      ...describeHeritageBonus(bonus, selections),
    }));
  };

  const entries = [
    ...describe(resolved.production, "production"),
    ...describe(resolved.culture, "culture"),
    ...describe(resolved.bonuses, "bonus"),
  ];

  return (
    <StatsSection empty={entries.length === 0 ? "No bonus at this level yet." : null}>
      {entries.map(({ key, src, overlaySrc, label, value }) => (
        <BonusBadge key={key} src={src} overlaySrc={overlaySrc} label={label} value={value} />
      ))}
    </StatsSection>
  );
}
