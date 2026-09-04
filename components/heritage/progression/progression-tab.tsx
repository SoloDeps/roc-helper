"use client";

import { useMemo, useRef, useState } from "react";
import { Check, Columns3, Copy, Download, Info } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  HERITAGE_KEEPER_MAX_REPUTATION_LEVEL,
  type ResolvedHeritageVault,
} from "@/resolvers/heritage";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  ResponsiveSelect,
  SELECT_TEN_OPTIONS,
} from "@/components/modals/responsive-select";
import { EffectIcon } from "@/components/heritage/effect-icon";
import {
  buildProgressionMatrix,
  toDelimitedText,
  type ProgressionAxis,
} from "./build-matrix";

// ============================================================
// Onglet « Progression » : le tableau, façon tableur, de ce que chaque niveau
// rend.
//
// Ce fichier n'affiche que — toute la construction vit dans `build-matrix.ts`,
// et toutes les valeurs viennent de `resolvers/heritage.ts`.
//
// ⚠️ UN AXE ÉPINGLÉ, L'AUTRE DÉROULÉ (voir l'en-tête de `build-matrix.ts`) :
// « Vault levels » fige le rang de gardien et déroule les 60 niveaux du
// bâtiment, « Keeper ranks » fait l'inverse. L'ÈRE, elle, n'est jamais un axe :
// elle reste celle sélectionnée en tête de page, parce que c'est une donnée du
// joueur et non un choix d'affichage.
// ============================================================

/**
 * Segments d'axe. `label` dit ce qui VARIE (les lignes), `pinLabel` ce qui est
 * épinglé — l'inverse se lit mal une fois le tableau sous les yeux.
 */
const AXIS_OPTIONS: { value: ProgressionAxis; label: string; pinLabel: string }[] = [
  { value: "vault", label: "Vault levels", pinLabel: "Keeper level" },
  { value: "keeper", label: "Keeper ranks", pinLabel: "Vault level" },
];

function downloadCsv(filename: string, content: string) {
  // Export statique, aucun serveur : le fichier est fabriqué et relâché dans
  // l'onglet même (cf. CLAUDE.md — rien ici ne suppose un runtime Node).
  const blob = new Blob([`﻿${content}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function ProgressionTab({
  vault,
  selections,
}: {
  vault: ResolvedHeritageVault;
  selections: string[][];
}) {
  const [axis, setAxis] = useState<ProgressionAxis>("vault");
  const [pinnedKeeper, setPinnedKeeper] = useState(vault.keeper.reputationLevel);
  const [pinnedVault, setPinnedVault] = useState(vault.level);
  const [hidden, setHidden] = useState<ReadonlySet<string>>(() => new Set());
  const [copied, setCopied] = useState(false);
  const [copyFailed, setCopyFailed] = useState(false);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Les colonnes changent entièrement d'un vault à l'autre : un filtre hérité
  // du vault précédent masquerait des colonnes que l'utilisateur n'a jamais
  // décochées. Motif « adjusting state when a prop changes », comme la vue
  // parente — pas d'effet ni de re-rendu supplémentaire.
  const [filteredVaultKey, setFilteredVaultKey] = useState(vault.key);
  if (filteredVaultKey !== vault.key) {
    setFilteredVaultKey(vault.key);
    setHidden(new Set());
  }

  const matrix = useMemo(
    () =>
      buildProgressionMatrix({
        vaultKey: vault.key,
        era: vault.era,
        axis,
        pinnedLevel: axis === "vault" ? pinnedKeeper : pinnedVault,
        maxVaultLevel: vault.maxLevel,
        maxKeeperLevel: HERITAGE_KEEPER_MAX_REPUTATION_LEVEL,
        selections,
      }),
    [vault.key, vault.era, vault.maxLevel, axis, pinnedKeeper, pinnedVault, selections],
  );

  if (matrix === null) {
    return <p className="text-sm text-muted-foreground">Heritage not found.</p>;
  }

  const visibleKeys = new Set(
    matrix.columns.filter((column) => !hidden.has(column.key)).map((column) => column.key),
  );
  const visible = matrix.columns
    .map((column, index) => ({ column, index }))
    .filter(({ column }) => visibleKeys.has(column.key));

  // Une colonne exemptée n'est signalée que là où l'exemption SE VOIT : sur
  // l'axe « gardien », où elle reste plate pendant que ses voisines montent.
  const hasExempt = axis === "keeper" && visible.some(({ column }) => !column.keeperAmplified);

  const toggleColumn = (key: string) => {
    setHidden((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const copy = async () => {
    // ⚠️ `writeText` REJETTE quand le navigateur refuse le presse-papiers
    // (permission bloquée, page non focalisée, contexte non sécurisé). Sans
    // ce filet, l'échec remonte en rejet non capturé et le bouton reste muet :
    // on retombe simplement sur le téléchargement CSV, qui, lui, marche
    // partout.
    try {
      await navigator.clipboard.writeText(toDelimitedText(matrix, visibleKeys, "tsv"));
    } catch {
      setCopyFailed(true);
      return;
    }
    setCopyFailed(false);
    setCopied(true);
    if (copyTimer.current !== null) clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopied(false), 1600);
  };

  const download = () => {
    const suffix = axis === "vault" ? `keeper-${pinnedKeeper}` : `level-${pinnedVault}`;
    downloadCsv(
      `${vault.key}-${suffix}-${vault.era}.csv`,
      toDelimitedText(matrix, visibleKeys, "csv"),
    );
  };

  const pinned = AXIS_OPTIONS.find((option) => option.value === axis)!;
  const pinnedOptions =
    axis === "vault"
      ? Array.from({ length: HERITAGE_KEEPER_MAX_REPUTATION_LEVEL }, (_, i) => ({
          value: String(i + 1),
          label: `Keeper ${i + 1}`,
        }))
      : Array.from({ length: vault.maxLevel }, (_, i) => ({
          value: String(i + 1),
          label: `Level ${i + 1}`,
        }));

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {/* Segments d'axe — deux boutons plutôt qu'un select : le choix est
            binaire et doit rester visible sans ouvrir de menu. */}
        <div className="inline-flex rounded-lg border border-border p-0.5">
          {AXIS_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setAxis(option.value)}
              className={cn(
                "cursor-pointer rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors",
                axis === option.value
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[12px] text-muted-foreground">{pinned.pinLabel}</span>
          <ResponsiveSelect
            contentClassName={SELECT_TEN_OPTIONS}
            value={String(axis === "vault" ? pinnedKeeper : pinnedVault)}
            onValueChange={(value) =>
              axis === "vault"
                ? setPinnedKeeper(Number(value))
                : setPinnedVault(Number(value))
            }
            options={pinnedOptions}
            placeholder={pinned.pinLabel}
            className="h-8! w-32"
            selectClassName="h-8! rounded-lg"
            drawerBtnClassName="h-8!"
          />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="h-8 gap-1.5 text-[12px]">
                <Columns3 size={14} aria-hidden="true" />
                Columns ({visible.length}/{matrix.columns.length})
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-64 p-2">
              <div className="mb-2 flex items-center justify-between gap-2 px-1">
                <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Columns
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setHidden(
                      hidden.size === 0
                        ? new Set(matrix.columns.map((column) => column.key))
                        : new Set(),
                    )
                  }
                  className="cursor-pointer text-[11px] text-muted-foreground hover:text-foreground"
                >
                  {hidden.size === 0 ? "None" : "All"}
                </button>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {matrix.columns.map((column) => (
                  <label
                    key={column.key}
                    className="flex cursor-pointer items-center gap-2 rounded-md px-1 py-1.5 hover:bg-muted/60"
                  >
                    <Checkbox
                      checked={!hidden.has(column.key)}
                      onCheckedChange={() => toggleColumn(column.key)}
                    />
                    <EffectIcon
                      src={column.src}
                      overlaySrc={column.overlaySrc}
                      alt={column.label}
                      size={18}
                    />
                    <span className="min-w-0 flex-1 truncate text-[12px]">
                      {column.label}
                    </span>
                    <span className="shrink-0 text-[10px] tabular-nums text-muted-foreground">
                      lvl {column.minLevel}
                    </span>
                  </label>
                ))}
              </div>
            </PopoverContent>
          </Popover>

          <Button
            variant="outline"
            className="h-8 gap-1.5 text-[12px]"
            onClick={copy}
            title={copyFailed ? "Clipboard blocked by the browser — use CSV" : undefined}
          >
            {copied ? (
              <Check size={14} aria-hidden="true" className="text-emerald-500" />
            ) : (
              <Copy size={14} aria-hidden="true" />
            )}
            {copied ? "Copied" : copyFailed ? "Blocked" : "Copy"}
          </Button>
          <Button variant="outline" className="h-8 gap-1.5 text-[12px]" onClick={download}>
            <Download size={14} aria-hidden="true" />
            CSV
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-1.5">
        <p className="text-[13px] text-muted-foreground">
          What each level unlocks, amplified by the keeper. Empty cells: not unlocked yet.
        </p>
        <Popover>
          <PopoverTrigger asChild>
            <button
              type="button"
              aria-label="More details about this table"
              className="cursor-pointer rounded-full p-0.5 text-muted-foreground hover:text-foreground"
            >
              <Info size={14} aria-hidden="true" />
            </button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-72 p-3 text-[12px] text-muted-foreground">
            This isn&apos;t a reachable total: the vault declares 10 effects for 8 slots, so
            not every column can be equipped at once.
            {hasExempt && " Columns marked * are exempt from the keeper amplifier."}
          </PopoverContent>
        </Popover>
      </div>

      {/* `divide-x` sur chaque ligne trace un vrai quadrillage — sans ça la
          colonne épinglée (level/keeper) et l'« Amplifier » se distinguaient
          mal des colonnes de bonus, surtout une fois leur libellé passé sur
          plusieurs lignes. */}
      <div className="max-h-[70vh] overflow-auto rounded-xl border border-border">
        <table className="w-full border-collapse text-sm">
          <thead className="sticky top-0 z-20 bg-card">
            <tr className="divide-x divide-border border-b border-border">
              <th className="sticky left-0 z-30 bg-card px-3 py-2 text-left font-semibold">
                {axis === "vault" ? "Vault level" : "Keeper level"}
              </th>
              {axis === "keeper" && (
                <th className="whitespace-nowrap px-3 py-2 text-right font-semibold">
                  Amplifier
                </th>
              )}
              {visible.map(({ column }) => (
                <th
                  key={column.key}
                  className="max-w-[140px] px-3 py-1.5 text-right font-semibold"
                  title={`${column.label} — unlocks at level ${column.minLevel}`}
                >
                  <div className="flex items-start justify-end gap-1">
                    <EffectIcon
                      src={column.src}
                      overlaySrc={column.overlaySrc}
                      alt={column.label}
                      size={20}
                    />
                    {/* `line-clamp-2`, pas trois : un libellé qui monte à
                        trois lignes (« Heavy Infantry Damage ») épaississait
                        l'en-tête plus que les autres colonnes. `hyphens-auto`
                        (+ `lang`, requis pour que le navigateur choisisse le
                        bon dictionnaire de coupure) laisse le mot couper avec
                        un vrai tiret plutôt que de le trancher net
                        (« Embellishme/nts ») — `break-words` reste le filet
                        pour un mot qu'aucune coupure lexicale ne raccourcit.
                        `flex-1` + `text-right` sur les deux lignes : sans
                        largeur explicite, le palier (« lvl X »), plus court
                        que le libellé, se retrouvait aligné à gauche au lieu
                        de suivre le bord droit de la colonne. */}
                    <span className="min-w-0 flex-1">
                      <span
                        lang="en"
                        className="line-clamp-2 break-words text-right leading-tight [hyphens:auto]"
                      >
                        {column.label}
                        {axis === "keeper" && !column.keeperAmplified && (
                          <span className="text-muted-foreground"> *</span>
                        )}
                      </span>
                      {/* ⚠️ LE PALIER FAIT PARTIE DU NOM DE COLONNE, il n'est
                          pas décoratif : un même vault porte deux paliers de
                          « Goods » (la production au niveau 1, le boost au
                          niveau 28), et deux colonnes homonymes côte à côte
                          sont indiscernables. Même raison dans l'export. */}
                      <span className="block whitespace-nowrap text-right text-[11px] font-normal tabular-nums text-muted-foreground">
                        lvl {column.minLevel}
                      </span>
                    </span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matrix.rows.map((row) => (
              <tr
                key={row.key}
                className="divide-x divide-border border-b border-border/60 last:border-0 hover:bg-muted/40"
              >
                <th
                  scope="row"
                  className="sticky left-0 z-10 bg-card px-3 py-1.5 text-left font-semibold tabular-nums"
                >
                  {axis === "vault" ? row.vaultLevel : row.keeperLevel}
                </th>
                {axis === "keeper" && (
                  <td className="px-3 py-1.5 text-right tabular-nums text-muted-foreground">
                    +{row.amplifierPercent.toFixed(0)}%
                  </td>
                )}
                {visible.map(({ column, index }) => (
                  <td
                    key={column.key}
                    className="whitespace-nowrap px-3 py-1.5 text-right tabular-nums"
                  >
                    {row.values[index] ?? (
                      <span className="text-muted-foreground/30">—</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
