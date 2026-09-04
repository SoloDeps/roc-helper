"use client";

import { useState } from "react";
import { ChevronDown, Layers } from "lucide-react";

import { cn } from "@/lib/utils";
import { EffectIcon } from "@/components/heritage/effect-icon";
import { describeHeritageBonus } from "@/components/heritage/effect-display";
import type { CombinationLine } from "@/resolvers/heritage-combination";

// ============================================================
// La colonne de droite : une ligne par stat, dépliable sur son détail.
//
// ⚠️ CE QUI EST MIS EN AVANT. Une ligne à laquelle PLUSIEURS bâtiments
// contribuent est la seule qui soit vraiment un cumul — le reste est un simple
// report. Elle porte donc un repère visible, et c'est ce que le joueur vient
// chercher : « qu'est-ce que le fait de les avoir TOUS LES DEUX m'apporte ? »
// ============================================================

/**
 * La valeur affichée d'une ligne, dans l'unité de son format.
 *
 * ⚠️ Passe par `describeHeritageBonus` plutôt que de formater à la main : c'est
 * lui qui porte l'échelle des pourcentages (×100), l'arrondi mesuré des
 * quantités, et le choix d'icône. Le total remplace la valeur du bonus
 * représentatif — d'où le `sample` réécrit plutôt qu'un second formateur.
 */
function describeTotal(line: CombinationLine, selections: string[][]) {
  return describeHeritageBonus(
    { ...line.sample, value: line.total, amplified: line.total },
    selections,
  );
}

/**
 * Le détail d'une ligne empilée, en tableau — même charpente que
 * `BeforeAfterTable` (onglet Sacrifice) : un en-tête en petites capitales, une
 * colonne « Building » et une colonne valeur, plutôt qu'une simple liste. Une
 * ligne à un seul porteur n'a rien à détailler : `TotalRow` ne rend ce
 * composant que pour `line.contributions.length > 1`.
 */
function ContributionsTable({
  line,
  selections,
}: {
  line: CombinationLine;
  selections: string[][];
}) {
  return (
    <div className="mx-2 mb-1.5 overflow-hidden rounded-lg border border-border/60">
      <div className="grid grid-cols-[1fr_110px] bg-muted/20 py-1">
        <div className="px-3 text-[11px] font-black uppercase tracking-widest text-muted-foreground/75">
          Building
        </div>
        <div className="text-center text-[11px] font-black uppercase tracking-widest text-muted-foreground/75">
          Value
        </div>
      </div>
      {line.contributions.map((contribution) => {
        const display = describeHeritageBonus(
          { ...line.sample, value: contribution.value, amplified: contribution.value },
          selections,
        );
        return (
          <div
            key={contribution.sourceId}
            className="grid grid-cols-[1fr_110px] items-center border-t border-border/60 py-1.5"
          >
            <div className="flex min-w-0 items-center gap-1.5 px-3">
              <span
                className={cn(
                  "size-1.5 shrink-0 rounded-full",
                  contribution.sourceKind === "vault" ? "bg-primary" : "bg-muted-foreground/40",
                )}
                aria-hidden="true"
              />
              <span className="truncate text-[12px] text-foreground">
                {contribution.sourceName}
              </span>
            </div>
            <span className="text-center text-[12px] font-semibold tabular-nums text-foreground">
              {display.value}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function TotalRow({
  line,
  selections,
}: {
  line: CombinationLine;
  selections: string[][];
}) {
  const [open, setOpen] = useState(false);
  const display = describeTotal(line, selections);
  const stacked = line.contributions.length > 1;

  return (
    <li className={cn("border-b border-border/60 last:border-b-0", stacked && "bg-primary/[0.04]")}>
      <button
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full cursor-pointer items-center gap-3 px-2 py-1.5 text-left transition-colors hover:bg-muted/40"
      >
        {/* ⚠️ ICÔNE NUE, à la taille du badge de stat (25). Une pastille ronde
            autour n'ajoutait aucune information, rétrécissait l'icône de
            moitié, et serrait l'overlay — qui déborde volontairement de la
            boîte (`-right-1.5`) pour rester lisible. On veut reconnaître la
            stat d'un coup d'œil, pas décorer. */}
        <EffectIcon src={display.src} overlaySrc={display.overlaySrc} alt={display.label} size={25} />
        <span className="min-w-0 flex-1 leading-tight">
          <span className="flex items-center gap-1.5">
            <span className="truncate text-[13px] font-medium text-foreground">
              {display.label}
            </span>
            {stacked && (
              <span
                className="flex shrink-0 items-center gap-0.5 rounded border border-primary/30 bg-primary/10 px-1 text-[11px] font-semibold text-primary"
                title={`${line.contributions.length} buildings stack here`}
              >
                <Layers size={9} aria-hidden="true" />
                {line.contributions.length}
              </span>
            )}
          </span>
          {display.detail !== null && (
            <span className="block truncate text-[12px] text-muted-foreground">
              {display.detail}
            </span>
          )}
        </span>
        <span className="shrink-0 text-[13px] font-semibold tabular-nums text-foreground">
          {/* ⚠️ Une portée de culture n'a pas de total (deux bâtiments couvrent
              deux zones) : on le DIT, plutôt que d'afficher « — » comme si la
              donnée manquait. */}
          {line.rule === "none" ? (
            <span className="text-[12px] font-medium text-muted-foreground">per building</span>
          ) : (
            display.value
          )}
        </span>
        <ChevronDown
          size={13}
          aria-hidden="true"
          className={cn(
            "shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
      {open && <ContributionsTable line={line} selections={selections} />}
    </li>
  );
}

export function TotalsTable({
  lines,
  selections,
}: {
  lines: CombinationLine[];
  selections: string[][];
}) {
  if (lines.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
        <p className="text-sm text-muted-foreground">
          Equip an effect or add an evolving building — the combined total shows up here.
        </p>
      </div>
    );
  }

  const stacked = lines.filter((line) => line.contributions.length > 1).length;

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="flex items-center justify-between gap-2 border-b border-border px-3 py-2">
        <p className="text-[12px] font-semibold uppercase tracking-widest text-muted-foreground">
          Combined total
        </p>
        {stacked > 0 && (
          <span className="flex items-center gap-1 rounded border border-primary/30 bg-primary/10 px-1.5 py-0.5 text-[11px] font-semibold text-primary">
            <Layers size={9} aria-hidden="true" />
            {stacked} stacked
          </span>
        )}
      </div>
      <ul>
        {lines.map((line) => (
          <TotalRow key={line.key} line={line} selections={selections} />
        ))}
      </ul>
    </div>
  );
}
