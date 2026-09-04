import { EffectIcon } from "@/components/heritage/effect-icon";
import { describeHeritageBonus } from "@/components/heritage/effect-display";
import type { ResolvedHeritageBonus } from "@/resolvers/heritage";

/**
 * Une ligne « icône + libellé + période » pour un bonus de vault.
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
 * ⚠️ Composant actuellement sans appelant dans l'app ; le paramètre est câblé
 * par cohérence avec les autres vues d'effet (`EffectCardContents`,
 * `EffectSummaryRow`) pour le jour où il sera réutilisé.
 */
export function EffectRow({
  bonus,
  selections,
  amplified = false,
}: {
  bonus: ResolvedHeritageBonus;
  selections: string[][];
  amplified?: boolean;
}) {
  const { src, overlaySrc, label, detail } = describeHeritageBonus(
    bonus,
    selections,
    amplified,
  );

  return (
    <div className="flex items-center gap-2.5 rounded-md bg-background-100 px-2.5 py-1.5">
      <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-background-200">
        <EffectIcon src={src} overlaySrc={overlaySrc} alt={label} size={15} />
      </div>
      <div className="min-w-0 leading-tight">
        <p className="truncate text-[13px] font-medium text-foreground">{label}</p>
        {detail && (
          <p className="truncate text-[11px] text-muted-foreground">{detail}</p>
        )}
      </div>
    </div>
  );
}
