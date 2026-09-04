"use client";

import { cn, formatDuration, getItemIconLocal } from "@/lib/utils";
import { humanizeDefinitionId } from "@/resolvers/heritage";
import type { RegenerationReadout } from "@/resolvers/heritage-combination";
import { BuildingImage } from "@/components/heritage/building-image";

// ============================================================
// « +83 % de régénération » → « une boussole toutes les 15 min ».
//
// C'est la lecture que le joueur cherche, et la raison d'être du tableur
// communautaire qui a inspiré cet onglet. Elle n'apparaît que pour les jauges
// qu'un bonus du cumul vise vraiment : un thème qui n'en touche aucune n'affiche
// rien, plutôt qu'un encart récitant les bases du jeu.
// ============================================================

/**
 * Le nom d'une ressource, en capitales initiales.
 *
 * ⚠️ `humanizeDefinitionId` ne capitalise PAS : il découpe un identifiant en
 * mots et les recolle tels quels. C'est correct sur les identifiants du game
 * design, qui sont en CamelCase (`InventoryItem_AgeUpgradeKit` → « Age Upgrade
 * Kit »), mais une clé de ressource est en snake_case et ressortait en
 * « treasure hunt attempt ». La capitalisation est faite ICI plutôt que dans le
 * resolver : la changer là-bas toucherait les libellés de coffres, qui n'en ont
 * pas besoin.
 */
function resourceName(resource: string): string {
  return humanizeDefinitionId(resource)
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Une durée en clair, ou « Instant ».
 *
 * ⚠️ Le cas instantané ne se déduit PAS d'une durée nulle côté affichage —
 * `RegenerationReadout.instant` le porte explicitement. C'est l'objectif que le
 * jeu propose (bonus ≥ 100 %), il mérite son mot, pas un « 0s ».
 */
function Duration({ seconds, instant }: { seconds: number; instant: boolean }) {
  if (instant) {
    return (
      <span className="font-semibold uppercase tracking-wide text-emerald-600 dark:text-emerald-400">
        Instant
      </span>
    );
  }
  return <span className="font-semibold tabular-nums text-foreground">{formatDuration(Math.round(seconds))}</span>;
}

function ReadoutCard({ readout }: { readout: RegenerationReadout }) {
  const raised = readout.cap > readout.baseCap;
  return (
    <div className="flex items-center gap-3 px-3 py-2.5">
      {/* Icône nue, taille du badge de stat — voir `totals-table.tsx`.
          ⚠️ `BuildingImage` et pas une `<img>` nue : il replie sur une image
          locale quand le fichier n'existe pas. Les trois jauges du jeu n'ont pas
          toutes leur icône (`attack_attempt` n'en a aucune), et si une future
          donnée en amenait une ici, une image cassée serait le seul signal. */}
      <span className="flex size-6.5 shrink-0 items-center justify-center overflow-hidden">
        <BuildingImage
          src={getItemIconLocal(readout.resource)}
          alt={resourceName(readout.resource)}
        />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-medium text-foreground">
          {resourceName(readout.resource)}
        </p>
        <p className="text-[12px] text-muted-foreground">
          {/* La base est rappelée à côté du résultat : sans elle, « 15 min » ne
              dit pas si c'est bon. */}
          base {formatDuration(readout.basePeriodSeconds)} · {readout.baseCap} max
        </p>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-0.5 text-[13px] leading-tight">
        <span className="text-muted-foreground">
          1 every <Duration seconds={readout.secondsPerUnit} instant={readout.instant} />
        </span>
        <span className="text-muted-foreground">
          full in <Duration seconds={readout.secondsToFill} instant={readout.instant} />
        </span>
      </div>
      <span
        className={cn(
          "shrink-0 rounded-md border px-2 py-1 text-[13px] font-semibold tabular-nums",
          raised
            ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
            : "border-border bg-background-100 text-muted-foreground",
        )}
        title={raised ? `Raised from ${readout.baseCap}` : "Base cap"}
      >
        {readout.cap} max
      </span>
    </div>
  );
}

export function RegenerationReadouts({ readouts }: { readouts: RegenerationReadout[] }) {
  if (readouts.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="border-b border-border px-3 py-2">
        <p className="text-[12px] font-semibold uppercase tracking-widest text-muted-foreground">
          Regeneration
        </p>
      </div>
      <div className="divide-y divide-border/60">
        {readouts.map((readout) => (
          <ReadoutCard key={readout.resource} readout={readout} />
        ))}
      </div>
    </div>
  );
}
