"use client";

import { Download } from "lucide-react";

import { cn } from "@/lib/utils";
import { getHeritageVaultPortraitUrl } from "@/resolvers/heritage-portraits";
import {
  HERITAGE_KEEPER_MAX_REPUTATION_LEVEL,
  keeperAmplifierMultiplier,
  type ResolvedHeritageVault,
} from "@/resolvers/heritage";
import { BuildingImage } from "@/components/heritage/building-image";
import { EffectBlock } from "@/components/heritage/vault-view/effect-block";
import { ResponsiveSelect, SELECT_TEN_OPTIONS } from "@/components/modals/responsive-select";
import { VaultCardStats } from "./card-stats";

// ============================================================
// Le bâtiment d'héritage dans l'onglet Combination.
//
// Il prend la place qu'occupe l'inventaire de jetons dans l'onglet Sacrifice :
// en tête de colonne gauche, repliable, au-dessus des cartes d'évolutifs. Il
// n'est PAS une carte comme les autres — on ne peut ni le retirer ni le
// remplacer, il n'y en a qu'un par thème.
//
// ⚠️ SEULS LES EFFETS ÉQUIPÉS COMPTENT, et c'est la raison d'être de ce
// panneau : le vault a 8 emplacements pour 10 effets, il ne peut donc JAMAIS
// tout porter. Poser les effets à la main est le seul moyen d'imiter le jeu ;
// additionner les 10 décrirait une configuration qui n'existe pas.
//
// ⚠️ VIDE PAR DÉFAUT — bac à sable. L'onglet ne présume rien de la progression
// réelle : le joueur compose ce qu'il veut essayer. Le bouton d'import remet en
// un clic la configuration de l'onglet Infos (niveau, rang de gardien, effets),
// pour partir de son état réel quand c'est ça qu'il veut.
// ============================================================

function levelOptions(maxLevel: number) {
  return Array.from({ length: maxLevel }, (_, i) => ({
    value: String(i + 1),
    label: `Lv. ${i + 1}`,
  }));
}

/**
 * L'aperçu rendu à la PLACE du panneau quand il est replié.
 *
 * Replier ne doit pas faire disparaître de vue ce qui compte déjà dans le
 * total — même règle que les pastilles de jetons de l'onglet Sacrifice.
 */
function VaultBadge({
  vault,
  equippedCount,
}: {
  vault: ResolvedHeritageVault;
  equippedCount: number;
}) {
  return (
    <div className="mt-2 flex h-9 w-fit items-center gap-2 rounded-md border border-alpha-200 bg-background-100 px-1.5">
      <span className="flex size-7 shrink-0 items-center justify-center overflow-hidden">
        <BuildingImage src={getHeritageVaultPortraitUrl(vault.themeId)} alt={vault.name} />
      </span>
      <span className="text-[13px] font-semibold tabular-nums">Lv. {vault.level}</span>
      <span className="text-[12px] text-muted-foreground">
        Keeper {vault.keeper.reputationLevel}
      </span>
      <span
        className={cn(
          "rounded border px-1 text-[12px] font-semibold tabular-nums",
          equippedCount > 0
            ? "border-primary/30 bg-primary/10 text-primary"
            : "border-border text-muted-foreground",
        )}
      >
        {equippedCount}/{vault.slots.length}
      </span>
    </div>
  );
}

export function VaultPanel({
  vault,
  selections,
  open,
  onOpenChange,
  onLevelChange,
  onKeeperChange,
  equip,
  unequip,
  onImport,
  importLabel,
  equippedCount,
}: {
  /** Le vault résolu sur l'état LOCAL de l'onglet, pas sur la progression Dexie. */
  vault: ResolvedHeritageVault;
  selections: string[][];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onLevelChange: (level: number) => void;
  onKeeperChange: (level: number) => void;
  equip: (slotId: string, effectId: string) => void;
  unequip: (slotId: string) => void;
  onImport: () => void;
  importLabel: string;
  equippedCount: number;
}) {
  return (
    <div>
      <div className="flex w-full items-center gap-2">
        <p className="text-[12px] font-semibold uppercase tracking-widest text-muted-foreground">
          Heritage building
        </p>
        {/* Le compteur vit à CÔTÉ DU TITRE : il compte dans le total que le
            panneau soit ouvert ou replié, et posé à l'intérieur il changerait de
            place à chaque bascule. Même arbitrage que le total de jetons. */}
        {equippedCount > 0 && (
          <span className="shrink-0 rounded-md border border-border bg-background-100 px-2 py-0.5 text-[12px] font-semibold tabular-nums text-muted-foreground">
            {equippedCount} effect{equippedCount !== 1 ? "s" : ""}
          </span>
        )}
        <div className="flex-1" />
        <button
          onClick={() => onOpenChange(!open)}
          className="shrink-0 cursor-pointer rounded-md border border-border px-2 py-1 text-[12px] font-medium text-muted-foreground transition-colors hover:bg-muted/40"
        >
          {open ? "Hide panel" : "Show panel"}
        </button>
      </div>

      {/* ⚠️ REPLIER CACHE LES RÉGLAGES, PAS LE RÉSULTAT. Ce qui prend de la
          place, ce sont les huit emplacements et les sélecteurs ; ce qu'on
          consulte en permanence, ce sont les stats. Le panneau replié garde donc
          les DEUX choses qui comptent dans le total — l'identité du vault sur une
          seule ligne, et ses badges — pour qu'on puisse dérouler les cartes
          d'évolutifs sans perdre de vue ce que l'héritage apporte. */}
      {!open && (
        <div className="flex flex-col gap-3">
          <VaultBadge vault={vault} equippedCount={equippedCount} />
          <VaultCardStats vault={vault} selections={selections} />
        </div>
      )}

      {open && (
        <div className="mt-2 flex flex-col gap-3 rounded-xl border border-border bg-card p-3 shadow-sm">
          <div className="relative min-h-24">
            <div className="absolute left-0 top-0 flex size-16 items-center justify-center overflow-hidden rounded-lg bg-muted/30 md:inset-y-0 md:size-auto md:w-25">
              <BuildingImage
                src={getHeritageVaultPortraitUrl(vault.themeId)}
                alt={vault.name}
              />
            </div>
            <div className="flex h-full flex-col justify-between gap-2 pl-19 md:pl-28">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {vault.name}
                  </p>
                  <p className="truncate text-[12px] text-muted-foreground">
                    Keeper amplifier: +
                    {(keeperAmplifierMultiplier(vault.keeper.reputationLevel) * 100).toFixed(0)}%
                  </p>
                </div>
                <button
                  onClick={onImport}
                  title={importLabel}
                  className="flex shrink-0 cursor-pointer items-center gap-1 rounded-lg border border-border px-2 py-1.5 text-[12px] font-medium text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground"
                >
                  <Download size={12} aria-hidden="true" />
                  <span className="hidden sm:inline">Import from Infos</span>
                </button>
              </div>

              <div className="flex flex-wrap items-end gap-x-3 gap-y-2">
                <div className="flex flex-col gap-1">
                  <span className="text-[12px] font-medium uppercase tracking-wide text-muted-foreground">
                    Vault level
                  </span>
                  <ResponsiveSelect
                    contentClassName={SELECT_TEN_OPTIONS}
                    value={String(vault.level)}
                    onValueChange={(value) => onLevelChange(Number(value))}
                    options={levelOptions(vault.maxLevel)}
                    placeholder="Vault level"
                    className="w-28"
                    selectClassName="h-9 rounded-lg"
                    drawerBtnClassName="h-9"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[12px] font-medium uppercase tracking-wide text-muted-foreground">
                    Keeper level
                  </span>
                  <ResponsiveSelect
                    contentClassName={SELECT_TEN_OPTIONS}
                    value={String(vault.keeper.reputationLevel)}
                    onValueChange={(value) => onKeeperChange(Number(value))}
                    options={Array.from({ length: HERITAGE_KEEPER_MAX_REPUTATION_LEVEL }, (_, i) => ({
                      value: String(i + 1),
                      label: `Lv. ${i + 1}`,
                    }))}
                    placeholder="Keeper level"
                    className="w-28"
                    selectClassName="h-9 rounded-lg"
                    drawerBtnClassName="h-9"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Les mêmes emplacements que l'onglet Infos, aux mêmes règles de
              déblocage — `EffectBlock` reçoit déjà `equip`/`unequip` en props,
              on lui passe l'état LOCAL au lieu de l'écriture Dexie. Rien à
              dupliquer, et le comportement reste celui du jeu. */}
          <EffectBlock
            title="Production"
            group="production"
            vault={vault}
            selections={selections}
            showCosts={false}
            equip={equip}
            unequip={unequip}
          />
          <EffectBlock
            title="Boost"
            group="boost"
            vault={vault}
            selections={selections}
            showCosts={false}
            equip={equip}
            unequip={unequip}
          />

          {/* Le récapitulatif vient APRÈS les emplacements : ce sont eux qui le
              déterminent, et la lecture suit le geste — je pose mes effets, je
              vois ce qu'ils donnent. */}
          <VaultCardStats vault={vault} selections={selections} />
        </div>
      )}
    </div>
  );
}
