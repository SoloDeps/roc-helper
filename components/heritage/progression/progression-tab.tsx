"use client";

import { useMemo, useRef, useState, type ReactNode } from "react";
import { Check, Columns3, Copy, Download, Info } from "lucide-react";

import { cn, formatNumber } from "@/lib/utils";
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

/**
 * Clés stables des trois colonnes « fixes » (Amplifier, coût par ligne, coût
 * cumulé) dans le même `Set` que les clés des colonnes de bonus — aucun
 * risque de collision, une clé de bonus s'écrit toujours `effectId#…`. Ce
 * sont les SEULES, avec la colonne épinglée (niveau/rang, jamais masquable),
 * à ne pas venir de `matrix.columns`.
 */
const AMPLIFIER_KEY = "amplifier";
const LEVEL_COST_KEY = "levelCost";
const TOTAL_COST_KEY = "totalCost";

/**
 * ⚠️ TOUJOURS DEUX LIGNES, MÊME UN SEUL MOT — jamais un texte qui s'étale sur
 * une seule ligne pendant que ses voisines wrappent sur deux : SA colonne
 * grandirait alors bien plus que les autres et écraserait tout le reste
 * (« Level tokens » avant ce composant, contre des libellés de bonus
 * compressés à côté). On ne compte donc pas sur le wrap naturel, qui ne casse
 * qu'une fois la largeur dépassée — on coupe TOUJOURS après le premier mot,
 * pour que toute cellule d'en-tête réserve exactement la même hauteur, quel
 * que soit le nombre de mots du libellé. La seconde ligne reste réservée
 * (espace insécable) même vide, pour ne jamais raboter la hauteur de la
 * ligne d'un seul mot par rapport à ses voisines à deux mots.
 */
function HeaderLabel({ text, suffix }: { text: string; suffix?: ReactNode }) {
  const [first, ...rest] = text.split(" ");
  const second = rest.join(" ");
  return (
    <span lang="en" className="block text-right leading-tight [hyphens:auto]">
      <span className="block truncate break-words">{first}</span>
      <span className="block truncate break-words">
        {second === "" ? " " : second}
        {suffix}
      </span>
    </span>
  );
}

/**
 * L'en-tête d'une colonne — la même cellule pour le niveau épinglé,
 * l'amplificateur, les coûts et chaque bonus, pour que rien ne se démarque
 * des autres par sa largeur ou sa hauteur.
 *
 * ⚠️ `items-start` ICI, PAS SEULEMENT SUR LES COLONNES DE BONUS. Un `<th>`
 * de table a `vertical-align: middle` par défaut : les trois premiers
 * en-têtes (niveau, jetons) n'avaient pas le layout flex des colonnes de
 * bonus et se retrouvaient donc centrés verticalement dans une ligne aussi
 * haute que ces dernières (icône + 2 lignes + « lvl X ») pendant que le
 * reste collait en haut — un décalage visible d'une colonne à l'autre. Une
 * grille CSS (`display: grid` sur le parent, `contents` sur chaque « ligne »)
 * remplace la table : chaque cellule est un `div` ordinaire, sans ce défaut
 * de layout — `items-start` suffit alors à aligner TOUT en haut, uniformément.
 */
function HeaderCell({
  children,
  pinned,
  divider = true,
  title,
}: {
  children: ReactNode;
  pinned?: boolean;
  divider?: boolean;
  title?: string;
}) {
  return (
    <div
      title={title}
      className={cn(
        "sticky top-0 z-20 flex items-start justify-end gap-2 border-b border-border bg-card px-3 py-2 text-right text-sm font-semibold",
        divider && "border-l border-border",
        pinned && "left-0 z-30 max-w-[72px] px-2",
      )}
    >
      {children}
    </div>
  );
}

/** Une cellule de donnée — `pinned` la fige à gauche (colonne niveau/rang). */
function BodyCell({
  children,
  pinned,
  divider = true,
  isLastRow,
}: {
  children: ReactNode;
  pinned?: boolean;
  divider?: boolean;
  isLastRow: boolean;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-end px-3 py-1.5 text-right text-sm tabular-nums group-hover:bg-muted/40",
        divider && "border-l border-border",
        !isLastRow && "border-b border-border/60",
        pinned && "sticky left-0 z-10 max-w-[72px] bg-card px-2 font-semibold",
      )}
    >
      {children}
    </div>
  );
}

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

  // Les 3 colonnes « fixes » masquables — Amplifier n'existe que sur l'axe
  // « gardien » (rien à en faire disparaître sur l'axe « vault », il n'y a
  // même pas de colonne à cet endroit). Même `hidden` que les colonnes de
  // bonus : tout se coche depuis le même popover « Columns ».
  const extraColumns = [
    ...(axis === "keeper" ? [{ key: AMPLIFIER_KEY, label: "Amplifier" }] : []),
    { key: LEVEL_COST_KEY, label: axis === "vault" ? "Level tokens" : "Level reputation" },
    { key: TOTAL_COST_KEY, label: axis === "vault" ? "Total tokens" : "Total reputation" },
  ];
  const showAmplifier = axis === "keeper" && !hidden.has(AMPLIFIER_KEY);
  const showLevelCost = !hidden.has(LEVEL_COST_KEY);
  const showTotalCost = !hidden.has(TOTAL_COST_KEY);

  // Toutes les clés masquables, colonnes fixes ET colonnes de bonus — sert au
  // ratio du bouton « Columns » et au bascule « All »/« None » du popover.
  // La colonne épinglée (niveau/rang) n'y figure jamais : elle ne stext-[12px] text-muted-foregrounde masque
  // pas.
  const toggleableKeys = [
    ...extraColumns.map((column) => column.key),
    ...matrix.columns.map((column) => column.key),
  ];
  const toggleableVisibleCount = toggleableKeys.filter((key) => !hidden.has(key)).length;

  // Le compte EXACT de colonnes rendues, dans le même ordre que le JSX plus
  // bas — sert à générer `gridTemplateColumns` (colonne épinglée à 72px, le
  // reste réparti à parts égales).
  const totalColumns =
    1 + (showAmplifier ? 1 : 0) + (showLevelCost ? 1 : 0) + (showTotalCost ? 1 : 0) + visible.length;

  const toggleColumn = (key: string) => {
    setHidden((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  // Mêmes 3 colonnes fixes que l'écran, dans l'export — sans ça, en décocher
  // une dans le popover « Columns » la ferait quand même réapparaître au
  // copier-coller/CSV.
  const includeInExport = {
    amplifier: showAmplifier,
    levelCost: showLevelCost,
    totalCost: showTotalCost,
  };

  const copy = async () => {
    // ⚠️ `writeText` REJETTE quand le navigateur refuse le presse-papiers
    // (permission bloquée, page non focalisée, contexte non sécurisé). Sans
    // ce filet, l'échec remonte en rejet non capturé et le bouton reste muet :
    // on retombe simplement sur le téléchargement CSV, qui, lui, marche
    // partout.
    try {
      await navigator.clipboard.writeText(
        toDelimitedText(matrix, visibleKeys, "tsv", includeInExport),
      );
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
      toDelimitedText(matrix, visibleKeys, "csv", includeInExport),
    );
  };

  const pinned = AXIS_OPTIONS.find((option) => option.value === axis)!;
  const pinnedOptions =
    axis === "vault"
      ? Array.from({ length: HERITAGE_KEEPER_MAX_REPUTATION_LEVEL }, (_, i) => ({
          value: String(i + 1),
          label: `Level ${i + 1}`,
        }))
      : Array.from({ length: vault.maxLevel }, (_, i) => ({
          value: String(i + 1),
          label: `Level ${i + 1}`,
        }));

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {/* Segments d'axe — deux boutons plutôt qu'un select : le choix est
            binaire et doit rester visible sans ouvrir de menu.
            ⚠️ PAS DE BLEU — un pastille blanche (`bg-background shadow-sm`),
            pas `bg-primary` : sur un fond déjà gris (`bg-background-200` de la
            page), la sélection active se lit très bien par le simple contraste
            blanc/gris, sans avoir besoin d'une couleur d'accent qui jure avec
            les boutons voisins (Columns/Copy/CSV, tous blancs eux aussi). */}
        <div className="inline-flex rounded-lg border border-border p-0.5">
          {AXIS_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setAxis(option.value)}
              className={cn(
                "cursor-pointer rounded-md px-3 py-1.5 text-[13px] font-medium transition-colors",
                axis === option.value
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[13px] text-muted-foreground ml-2 font-medium">{pinned.pinLabel}</span>
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
            selectClassName="h-8! rounded-lg bg-background"
            drawerBtnClassName="h-8!"
          />
          {/* ⚠️ ICÔNE SEULE, PLUS DE PHRASE EN DESSOUS — l'icône suffit à dire
              qu'il y a plus à lire, et reste compacte sur mobile (une phrase
              complète y retombe à la ligne et pousse le tableau plus bas).
              Collée au select : c'est CE choix (Vault levels/Keeper ranks +
              niveau épinglé) que le popover explique. */}
          <Popover>
            <PopoverTrigger asChild>
              <button
                type="button"
                aria-label="More details about this table"
                className="cursor-pointer rounded-full p-0.5 text-muted-foreground/90 hover:text-foreground"
              >
                <Info size={18} aria-hidden="true" />
              </button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-80 p-3 text-sm text-muted-foreground">
              What each level unlocks, amplified by the keeper. Empty cells: not unlocked yet.
              This isn&apos;t a reachable total: the vault declares 10 effects for 8 slots, so
              not every column can be equipped at once.
              {hasExempt && " Columns marked * are exempt from the keeper amplifier."}
            </PopoverContent>
          </Popover>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="h-8 gap-1.5 text-[12px]">
                <Columns3 size={14} aria-hidden="true" />
                Columns ({toggleableVisibleCount}/{toggleableKeys.length})
              </Button>
            </PopoverTrigger>
            {/* `w-72`, pas `w-64` — les libellés à `text-sm` (montés depuis
                `text-[12px]`, quasi illisibles) ont besoin d'un peu plus de
                place pour ne pas tronquer au premier mot venu. */}
            <PopoverContent align="end" className="w-72 p-2">
              <div className="mb-2 flex items-center justify-between gap-2 px-1">
                <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Columns
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setHidden(hidden.size === 0 ? new Set(toggleableKeys) : new Set())
                  }
                  className="cursor-pointer text-xs text-muted-foreground hover:text-foreground"
                >
                  {hidden.size === 0 ? "None" : "All"}
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {/* Les colonnes fixes (Amplifier, coûts) d'abord — ce sont
                    celles qu'on vient de rajouter, elles doivent sauter aux
                    yeux avant la longue liste des bonus. */}
                {extraColumns.map((column) => (
                  <label
                    key={column.key}
                    className="flex cursor-pointer items-center gap-2 rounded-md px-1 py-1.5 hover:bg-muted/60"
                  >
                    <Checkbox
                      checked={!hidden.has(column.key)}
                      onCheckedChange={() => toggleColumn(column.key)}
                    />
                    <span className="min-w-0 flex-1 truncate text-sm">{column.label}</span>
                  </label>
                ))}
                <hr className="my-1.5 border-border" />
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
                    <span className="min-w-0 flex-1 truncate text-sm">{column.label}</span>
                    <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
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

      {/* ⚠️ GRILLE CSS, PAS UNE `<table>` — deux raisons, les deux vécues :
          1. Un `<th>`/`<td>` a `vertical-align: middle` par défaut ; seules
             les colonnes de bonus (mises en page en `flex`) échappaient à ce
             centrage, les trois premières colonnes (niveau, jetons) s'y
             retrouvaient prises, désalignées du reste (cf. `HeaderCell`).
          2. `table-layout: auto` redistribue l'espace EN TROP (conteneur plus
             large que le contenu naturel des colonnes) au navigateur — sur du
             HTML pur, il le donne presque tout aux dernières colonnes, qui
             s'étalaient alors bien plus large que les autres avec un grand
             vide dedans. Une grille avec `minmax(max-content, 1fr)` par
             colonne répartit cet espace en trop À PARTS ÉGALES entre TOUTES
             les colonnes, jamais en dessous du contenu (donc jamais tassée)
             — le tableau remplit alors vraiment toute la largeur disponible,
             sans qu'aucune colonne ne se démarque.
          `contents` sur chaque « ligne » : le `div` ne prend aucune boîte à
          lui (pas de grille imbriquée), seuls ses enfants participent à la
          grille du parent — mais `:hover` continue de s'appliquer sur lui
          d'après la position du curseur sur ses enfants, d'où
          `group`/`group-hover:` sur les cellules pour l'effet de survol. */}
      <div className="w-full max-h-[70vh] overflow-auto rounded-xl border border-border">
        <div
          className="grid"
          style={{
            gridTemplateColumns: `72px repeat(${totalColumns - 1}, minmax(max-content, 1fr))`,
          }}
        >
          <div className="contents">
            {/* 72px max : c'est un simple numéro de niveau/rang, il n'a
                jamais besoin de plus et fige la largeur de la colonne
                épinglée quel que soit l'axe. `px-2`, pas `px-3` comme les
                autres en-têtes : à 72px, le padding par défaut coupait déjà
                « Keeper » en « Keep… ». */}
            <HeaderCell pinned divider={false}>
              <HeaderLabel text={axis === "vault" ? "Vault level" : "Keeper level"} />
            </HeaderCell>
            {showAmplifier && (
              <HeaderCell>
                <HeaderLabel text="Amplifier" />
              </HeaderCell>
            )}
            {showLevelCost && (
              <HeaderCell>
                <HeaderLabel text={axis === "vault" ? "Level tokens" : "Level reputation"} />
              </HeaderCell>
            )}
            {showTotalCost && (
              <HeaderCell>
                <HeaderLabel text={axis === "vault" ? "Total tokens" : "Total reputation"} />
              </HeaderCell>
            )}
            {visible.map(({ column }) => (
              <HeaderCell
                key={column.key}
                title={`${column.label} — unlocks at level ${column.minLevel}`}
              >
                <EffectIcon
                  src={column.src}
                  overlaySrc={column.overlaySrc}
                  alt={column.label}
                  size={20}
                />
                {/* `flex-1` + `text-right` sur les deux lignes : sans largeur
                    explicite, le palier (« lvl X »), plus court que le
                    libellé, se retrouvait aligné à gauche au lieu de suivre
                    le bord droit de la colonne. */}
                <span className="min-w-0 flex-1">
                  <HeaderLabel
                    text={column.label}
                    suffix={
                      axis === "keeper" && !column.keeperAmplified ? (
                        <span className="text-muted-foreground"> *</span>
                      ) : null
                    }
                  />
                  {/* ⚠️ LE PALIER FAIT PARTIE DU NOM DE COLONNE, il n'est pas
                      décoratif : un même vault porte deux paliers de
                      « Goods » (la production au niveau 1, le boost au
                      niveau 28), et deux colonnes homonymes côte à côte sont
                      indiscernables. Même raison dans l'export. */}
                  <span className="block whitespace-nowrap text-right text-[11px] font-normal tabular-nums text-muted-foreground">
                    lvl {column.minLevel}
                  </span>
                </span>
              </HeaderCell>
            ))}
          </div>
          {matrix.rows.map((row, rowIndex) => {
            const isLastRow = rowIndex === matrix.rows.length - 1;
            return (
              <div key={row.key} className="group contents">
                <BodyCell pinned divider={false} isLastRow={isLastRow}>
                  {axis === "vault" ? row.vaultLevel : row.keeperLevel}
                </BodyCell>
                {showAmplifier && (
                  <BodyCell isLastRow={isLastRow}>
                    <span className="text-muted-foreground">
                      +{row.amplifierPercent.toFixed(0)}%
                    </span>
                  </BodyCell>
                )}
                {showLevelCost && (
                  <BodyCell isLastRow={isLastRow}>
                    <span className="text-muted-foreground">{formatNumber(row.levelCost)}</span>
                  </BodyCell>
                )}
                {showTotalCost && (
                  <BodyCell isLastRow={isLastRow}>
                    <span className="text-muted-foreground">
                      {formatNumber(row.cumulativeCost)}
                    </span>
                  </BodyCell>
                )}
                {visible.map(({ column, index }) => (
                  <BodyCell key={column.key} isLastRow={isLastRow}>
                    {row.values[index] ?? (
                      <span className="text-muted-foreground/30">—</span>
                    )}
                  </BodyCell>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
