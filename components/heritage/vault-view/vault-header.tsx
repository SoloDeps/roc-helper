"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { ChevronLeft, ChevronRight, LayoutGrid } from "lucide-react";

import { cn } from "@/lib/utils";
import type { EraCode } from "@/types/shared";
import {
  keeperAmplifierMultiplier,
  type ResolvedHeritageVault,
} from "@/resolvers/heritage";
import {
  HERITAGE_KEEPER_IMAGE_URL,
  decodeHeritageVaultPortrait,
  getHeritageVaultPortraitOffset,
  getHeritageVaultPortraitSize,
  getHeritageVaultPortraitUrl,
} from "@/resolvers/heritage-portraits";
import { ResponsiveModal } from "@/components/modals/responsive-modal";
import {
  ResponsiveSelect,
  SELECT_TEN_OPTIONS,
} from "@/components/modals/responsive-select";
import { WorkshopModal } from "@/components/modals/workshop-modal";
import { Button } from "@/components/ui/button";
import { XpProgressBar } from "@/components/heritage/xp-progress-bar";
import { heritageEventLabel } from "@/components/heritage/effect-display";

// ============================================================
// En-tête de la page /vault.
//
// ⚠️ LA CARTE HERITAGE NE CHANGE JAMAIS DE FORME. Portrait en absolu à gauche,
// identité en haut, sélecteurs à sa droite, barre d'xp en bas — c'est le
// gabarit de bureau, et il descend tel quel jusqu'au téléphone.
//
// Ce qui change avec la largeur, c'est le GARDIEN, et lui seul :
//  · à partir de `lg`, sa carte est posée à côté (deux colonnes) ;
//  · en dessous, cette carte disparaît et se réduit à une bande collée sous la
//    carte Heritage, qui n'en fait plus qu'une. La bande ouvre un tiroir avec
//    le rang, les points de réputation et les ateliers — c'est un réglage
//    qu'on ouvre, pas une donnée qu'on lit en permanence.
//
// La bascule est en CSS (`lg:hidden` / `hidden lg:block`) et non en
// `useMediaQuery` : les deux formes existent dans le DOM, donc rien ne
// clignote au montage. Le coût est nul, l'image du gardien étant la même URL
// dans les deux cas.
//
// ⚠️ LE PORTRAIT EST ANCRÉ À LA SECTION D'IDENTITÉ, PAS À LA CARTE. Sans cette
// section intermédiaire `relative`, son conteneur de positionnement serait la
// carte entière et il se collerait au bas de celle-ci — c'est-à-dire
// PAR-DESSUS la bande du gardien.
//
// Et il ne se pose au sol qu'à partir de `lg` : là, il déborde volontairement
// du haut de la carte, c'est le geste du design de bureau. En dessous, la
// section est plus haute que lui (la bande la prolonge, les sélecteurs passent
// parfois à la ligne) et un portrait collé en bas laissait un vide au-dessus
// de sa tête. Il y est donc CENTRÉ verticalement, toujours à gauche du texte.
//
// Sous `lg`, portrait et titres sont VOLONTAIREMENT plus petits qu'avant —
// alignés sur le format compact du panneau Heritage building de l'onglet
// Combination (`components/heritage/combination/vault-panel.tsx`), qui sert
// de référence visuelle sur mobile.
//
// ⚠️ LE `offset` PAR THÈME (`getHeritageVaultPortraitOffset`) NE S'APPLIQUE
// QU'À PARTIR DE `lg`. Ces corrections en px sont calées à l'œil sur le
// portrait `h-32` du bureau ; appliquées telles quelles au portrait `h-16`
// (deux fois plus petit) sous `lg`, elles décalaient le portrait bien au-delà
// de ce qu'il fallait. D'où les variables CSS `--portrait-offset-*` pour ne
// brancher le `transform` que dans la classe `lg:`.
//
// Deux cotes sont calées sur la mesure, pas à vue :
//  · le retrait de portrait (`pl-*`) suit la largeur réelle de l'image —
//    64 px à `h-16` posée à `left-3`, soit 76 px de bord à bord, ~128 px à
//    `h-32` — d'où `pl-19` puis `pl-40`, au même palier `lg` que l'image et
//    que la bascule d'ancrage.
//  · `min-h-20` (mobile) / `min-h-30` (`lg`) sont des hauteurs PLANCHER,
//    jamais un plafond. En hauteur fixe, la barre d'xp sortait de la carte
//    dès que les sélecteurs passaient à la ligne, et atterrissait sur la
//    barre d'onglets dont elle interceptait les clics.
// ============================================================

interface VaultHeaderProps {
  vault: ResolvedHeritageVault;
  era: EraCode;
  eraOptions: { value: string; label: string }[];
  keeperMaxLevel: number;
  xpToNext: number;
  onEraChange: (era: EraCode) => void;
  onLevelChange: (level: number) => void;
  onXpChange: (value: number) => void;
  onKeeperLevelChange: (level: number) => void;
  onKeeperPointsChange: (value: number) => void;
  onShiftVault: (delta: number) => void;
  onOpenSwitch: () => void;
}

function amplifierPercent(reputationLevel: number) {
  return (keeperAmplifierMultiplier(reputationLevel) * 100).toFixed(0);
}

export function VaultHeader({
  vault,
  era,
  eraOptions,
  keeperMaxLevel,
  xpToNext,
  onEraChange,
  onLevelChange,
  onXpChange,
  onKeeperLevelChange,
  onKeeperPointsChange,
  onShiftVault,
  onOpenSwitch,
}: VaultHeaderProps) {
  const [keeperOpen, setKeeperOpen] = useState(false);

  // ⚠️ LE PORTRAIT AFFICHÉ SUIT `displayedThemeId`, PAS `vault.themeId`
  // DIRECTEMENT. `src` et `transform` (l'offset) sont déjà posés en un seul
  // commit React (vérifié) — le décalage venait d'ailleurs : le navigateur
  // décode le nouveau bitmap de façon asynchrone (`decoding="async"`) et peut
  // continuer d'afficher l'ANCIEN personnage pendant ce temps, déjà repositionné
  // par le NOUVEAU `transform` — ce qui se lit comme un saut. En ne basculant
  // `displayedThemeId` qu'une fois `decodeHeritageVaultPortrait` résolu, l'ancien
  // portrait ET son offset restent affichés ENSEMBLE jusqu'à ce que le nouveau
  // soit prêt à peindre, puis les deux changent d'un coup.
  const [displayedThemeId, setDisplayedThemeId] = useState(vault.themeId);
  useEffect(() => {
    if (vault.themeId === displayedThemeId) return;
    let cancelled = false;
    const url = getHeritageVaultPortraitUrl(vault.themeId);
    const ready = url ? decodeHeritageVaultPortrait(url) : Promise.resolve();
    ready.then(() => {
      if (!cancelled) setDisplayedThemeId(vault.themeId);
    });
    return () => {
      cancelled = true;
    };
  }, [vault.themeId, displayedThemeId]);

  const portraitUrl = getHeritageVaultPortraitUrl(displayedThemeId);
  const portraitOffset = getHeritageVaultPortraitOffset(displayedThemeId);
  const portraitSize = getHeritageVaultPortraitSize(displayedThemeId);

  return (
    <header className="mb-4 grid grid-cols-1 gap-3 lg:mb-5 lg:grid-cols-2">
      {/* ─── Carte Heritage (+ bande Gardien sous lg) ─────────────────── */}
      <div className="rounded-xl border border-border bg-card shadow-sm">
        {/* Section d'identité — c'est ELLE qui ancre le portrait.
            Boîte (h × w) volontairement plus large que nécessaire pour les
            13 portraits actuels — voir `resolvers/heritage-portraits.ts` —
            donc `object-contain` ne les recadre pas ; elle ne sert QUE de
            garde-fou si un futur portrait est proportionnellement plus
            large (ex. `Hercules`, 672×512, le plus large des 13). */}
        <div className="relative min-h-20 lg:min-h-30">
          {portraitUrl && (
            <button
              type="button"
              onClick={onOpenSwitch}
              aria-label={`Change heritage (currently ${vault.name})`}
              className="absolute left-3 top-1/2 z-0 -translate-y-1/2 cursor-pointer appearance-none border-0 bg-transparent p-0 lg:bottom-0 lg:left-4 lg:top-auto lg:translate-y-0"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={portraitUrl}
                alt={vault.name}
                // ⚠️ `width`/`height` FIXES (les dimensions réelles du
                // fichier, pas une taille d'affichage) : sans elles, changer
                // de vault fait retomber la balise à une taille intrinsèque
                // inconnue le temps du décodage — même en cache — et le
                // portrait semble « sauter » à son apparition. Le CSS
                // (`h-16`/`lg:h-32`) reste seul maître de la taille affichée.
                width={portraitSize?.width}
                height={portraitSize?.height}
                draggable={false}
                loading="eager"
                decoding="async"
                className="pointer-events-none h-16 w-auto max-w-none select-none object-contain object-bottom-left lg:h-32 lg:[transform:translate(var(--portrait-offset-x),var(--portrait-offset-y))]"
                style={
                  {
                    "--portrait-offset-x": `${portraitOffset.x}px`,
                    "--portrait-offset-y": `${portraitOffset.y}px`,
                  } as CSSProperties
                }
              />
            </button>
          )}
          <div
            className={cn(
              "relative z-10 flex h-full flex-col justify-between gap-1 p-3 py-2",
              portraitUrl && "pl-19 lg:pl-40",
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <button
                type="button"
                onClick={onOpenSwitch}
                aria-label={`Change heritage (currently ${vault.name})`}
                className="min-w-0 cursor-pointer appearance-none border-0 bg-transparent p-0 text-left"
              >
                <h1 className="truncate text-sm font-bold leading-tight text-foreground hover:underline lg:text-lg">
                  {vault.name}
                </h1>
                <p className="truncate text-[12px] font-medium text-muted-foreground lg:text-sm">
                  {heritageEventLabel(vault)}
                </p>
              </button>
              <div className="flex shrink-0 items-center gap-1">
                <Button
                  variant="outline"
                  size="icon"
                  className="size-8 rounded-lg"
                  aria-label="Previous heritage"
                  onClick={() => onShiftVault(-1)}
                >
                  <ChevronLeft size={14} aria-hidden="true" />
                </Button>
                {/* Bouton explicite entre les deux flèches — clic sur le nom
                    seul (`onOpenSwitch`, ci-dessus) n'était pas identifié
                    comme ouvrant une modale par une partie des joueurs. */}
                <Button
                  variant="outline"
                  size="icon"
                  className="size-8 rounded-lg"
                  aria-label={`Browse all heritages (currently ${vault.name})`}
                  onClick={onOpenSwitch}
                >
                  <LayoutGrid size={14} aria-hidden="true" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="size-8 rounded-lg"
                  aria-label="Next heritage"
                  onClick={() => onShiftVault(1)}
                >
                  <ChevronRight size={14} aria-hidden="true" />
                </Button>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 py-1">
              <ResponsiveSelect
                contentClassName={SELECT_TEN_OPTIONS}
                value={era}
                onValueChange={(value) => onEraChange(value as EraCode)}
                options={eraOptions}
                placeholder="Era"
                className="h-8! w-40 max-w-full"
                selectClassName="h-8! rounded-lg"
                drawerBtnClassName="h-8! rounded-lg"
              />
              <ResponsiveSelect
                contentClassName={SELECT_TEN_OPTIONS}
                value={String(vault.level)}
                onValueChange={(value) => onLevelChange(Number(value))}
                options={Array.from({ length: vault.maxLevel }, (_, i) => ({
                  value: String(i + 1),
                  label: `Level ${i + 1}`,
                }))}
                placeholder="Level"
                className="h-8! w-32 max-w-full"
                selectClassName="h-8! rounded-lg"
                drawerBtnClassName="h-8! rounded-lg"
              />
            </div>

            {vault.atMaxLevel ? (
              <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Max level
              </span>
            ) : (
              <XpProgressBar
                // Clé sur le niveau : un passage de palier ramène souvent
                // `xpProgress` à 0, LA MÊME valeur que le point de départ —
                // l'effet interne de la barre (déclenché sur changement de
                // `value`) ne verrait alors AUCUN changement et garderait
                // l'ancienne position optimiste du curseur. Remonter le
                // composant au changement de niveau réinitialise proprement.
                key={vault.level}
                value={vault.xpProgress}
                max={xpToNext}
                onValueChange={onXpChange}
              />
            )}
          </div>
        </div>

        {/* Bande Gardien — la carte Gardien réduite à une ligne, collée sous
            la carte Heritage tant qu'il n'y a pas deux colonnes.
            `rounded-b-xl` : la carte n'a pas d'`overflow-hidden` (il
            couperait le portrait qui dépasse du haut), donc la bande arrondit
            ses propres coins. */}
        <button
          type="button"
          onClick={() => setKeeperOpen(true)}
          className="flex w-full cursor-pointer items-center gap-3 rounded-b-xl border-t border-border bg-background-100 pl-6 pr-4 py-2.5 text-left transition-colors hover:bg-muted/50 active:bg-muted/60 lg:hidden"
        >
          <span className="flex size-12 shrink-0 items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={HERITAGE_KEEPER_IMAGE_URL}
              alt=""
              aria-hidden="true"
              draggable={false}
              loading="eager"
              decoding="async"
              className="pointer-events-none h-12 w-auto max-w-none select-none object-contain"
            />
          </span>
          <span className="min-w-0 flex-1 pl-1">
            <span className="block text-[13px] font-semibold leading-tight text-foreground">
              Keeper · Lv. {vault.keeper.reputationLevel}
            </span>
            <span className="block truncate text-[12px] text-muted-foreground">
              +{amplifierPercent(vault.keeper.reputationLevel)}% production &amp; boosts
            </span>
          </span>
          <ChevronRight
            size={16}
            className="shrink-0 text-muted-foreground"
            aria-hidden="true"
          />
        </button>
      </div>

      {/* ─── Carte Gardien, seulement quand il y a deux colonnes ──────── */}
      <div className="relative hidden min-h-30 rounded-xl border border-border bg-card shadow-sm lg:block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={HERITAGE_KEEPER_IMAGE_URL}
          alt="Keeper"
          draggable={false}
          loading="eager"
          decoding="async"
          className="pointer-events-none absolute bottom-0 left-9 z-0 h-32 w-auto max-w-none select-none"
        />
        <div className="relative z-10 flex h-full flex-col justify-between gap-1 p-3 py-2 pl-40">
          <div>
            <h2 className="truncate text-lg font-bold leading-tight text-foreground">
              Keeper
            </h2>
            <p className="truncate text-sm font-medium text-muted-foreground">
              Amplifier: +{amplifierPercent(vault.keeper.reputationLevel)}% to production
              and boosts
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 py-1">
            <ResponsiveSelect
              contentClassName={SELECT_TEN_OPTIONS}
              value={String(vault.keeper.reputationLevel)}
              onValueChange={(value) => onKeeperLevelChange(Number(value))}
              options={Array.from({ length: keeperMaxLevel }, (_, i) => ({
                value: String(i + 1),
                label: `Level ${i + 1}`,
              }))}
              placeholder="Keeper level"
              className="w-32 max-w-full"
              selectClassName="h-8! rounded-lg"
              drawerBtnClassName="h-8! rounded-lg"
            />
            <WorkshopModal variant="outline" btnClass="h-8" />
          </div>
          {vault.keeper.pointsToNextLevel !== null && (
            <XpProgressBar
              value={vault.keeper.reputationPoints}
              max={vault.keeper.pointsToNextLevel}
              onValueChange={onKeeperPointsChange}
            />
          )}
        </div>
      </div>

      {/* Tiroir du Gardien — ouvert par la bande, donc jamais atteignable à
          partir de `lg` où la carte dit déjà tout. */}
      <ResponsiveModal
        title="Keeper"
        trigger={<span className="hidden" aria-hidden="true" />}
        open={keeperOpen}
        onOpenChange={setKeeperOpen}
        className="gap-0 p-0"
      >
        <div className="flex items-center justify-between gap-2 border-b border-border px-4 py-3">
          <h3 className="text-sm font-bold">Keeper</h3>
          <button
            type="button"
            aria-label="Close"
            onClick={() => setKeeperOpen(false)}
            className="cursor-pointer text-[14px] text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>
        </div>
        <div className="flex flex-col gap-4 p-4 pb-8">
          <p className="text-[13px] text-muted-foreground">
            Amplifier: +{amplifierPercent(vault.keeper.reputationLevel)}% to production and
            boosts
          </p>

          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
              Reputation level
            </span>
            <ResponsiveSelect
              contentClassName={SELECT_TEN_OPTIONS}
              value={String(vault.keeper.reputationLevel)}
              onValueChange={(value) => onKeeperLevelChange(Number(value))}
              options={Array.from({ length: keeperMaxLevel }, (_, i) => ({
                value: String(i + 1),
                label: `Level ${i + 1}`,
              }))}
              placeholder="Keeper level"
              className="w-full"
              selectClassName="h-11! rounded-lg"
              drawerBtnClassName="h-11! rounded-lg"
              nested
            />
          </div>

          {vault.keeper.pointsToNextLevel !== null && (
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                Reputation points
              </span>
              <XpProgressBar
                value={vault.keeper.reputationPoints}
                max={vault.keeper.pointsToNextLevel}
                onValueChange={onKeeperPointsChange}
              />
            </div>
          )}

          <WorkshopModal variant="outline" btnClass="h-11 w-full" />
        </div>
      </ResponsiveModal>
    </header>
  );
}
