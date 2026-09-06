"use client";

import { Minus } from "lucide-react";

import { EffectIcon } from "@/components/heritage/effect-icon";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

// ============================================================
// Tableau avant / après, partagé par le vault et les bâtiments de l'onglet
// Sacrifice.
//
// L'appariement se fait sur une CLÉ fournie par l'appelant, pas sur l'index ni
// sur le libellé : les deux côtés n'ont pas le même nombre de lignes dès qu'un
// palier ouvre ou ferme un bonus, et deux bonus d'un même vault peuvent porter
// le même libellé (deux « Goods Output » sur deux effets distincts).
// ============================================================

export interface BonusLike {
  /** Identité stable des deux côtés de la comparaison. */
  key: string;
  src: string;
  overlaySrc?: string | null;
  label: string;
  value: string;
  detail?: string | null;
}

export interface BeforeAfterRow extends Omit<BonusLike, "value"> {
  before?: string;
  after?: string;
  tone: "up" | "down" | "new" | "lost" | "neutral";
}

/**
 * Le premier nombre d'une valeur formatée, ramené à sa grandeur RÉELLE.
 *
 * `+1 460` et `1,460` doivent se comparer à `480` : sans nettoyage des
 * séparateurs, `parseFloat` s'arrête au premier et lit `1`, ce qui inverse le
 * sens de la variation.
 *
 * ⚠️ LE SUFFIXE K/M/B DÉCIDE DU RÔLE DE LA VIRGULE. `formatNumber`
 * (`lib/utils.ts`) abrège au-delà de 100 000 en notation française
 * (« 100,00 K ») et groupe les milliers à l'anglaise en dessous (« 99,999 ») :
 * la même virgule est décimale dans un cas, séparateur de milliers dans
 * l'autre, et seul le suffixe les distingue. Sans ce traitement, « 99,999 »
 * (99 999) se comparait à « 100,00 K » (100 000) comme 99999 contre 10000 —
 * la flèche de variation partait dans le mauvais sens au passage du palier.
 */
const MAGNITUDE_UNITS: Record<string, number> = { K: 1e3, M: 1e6, B: 1e9 };

/**
 * ⚠️ SANS SUFFIXE, LE NOMBRE DE CHIFFRES APRÈS LA VIRGULE TRANCHE AUSSI.
 * `describeHeritageBonus` (`CHEST_EXPECTED_VALUE_TYPES`) affiche l'espérance
 * d'un coffre en `toLocaleString("fr-FR", …)` — virgule DÉCIMALE, jamais
 * groupée par milliers, et sans suffixe : « 2,6 », « 2,35 ». Traitées comme le
 * reste (virgule = séparateur de milliers), elles devenaient 26 et 235 — une
 * baisse de 2,6 à 2,35 ressortait « up » (235 > 26), verte au lieu de rouge.
 * Un groupement de milliers, lui, aligne TOUJOURS 3 chiffres par groupe
 * (« 99,999 », « 1,234,567 ») : la virgule est décimale quand le dernier
 * groupe n'en compte pas 3, séparateur de milliers sinon — la seule règle qui
 * distingue les deux sans jamais se tromper sur les valeurs vues ici.
 */
function parseNumericMagnitude(formatted: string): number {
  const match = formatted.match(/([+-]?\d[\d\s ,]*(?:\.\d+)?)\s*([KMB])?/);
  if (!match) return 0;
  const unit = match[2] === undefined ? 1 : MAGNITUDE_UNITS[match[2]];
  if (unit !== 1) {
    const digits = match[1].replace(/[\s ]/g, "").replace(",", ".");
    return parseFloat(digits) * unit;
  }
  const raw = match[1].replace(/[\s ]/g, "");
  const lastComma = raw.lastIndexOf(",");
  if (lastComma === -1) return parseFloat(raw);
  const isThousandsGroup = raw.length - lastComma - 1 === 3;
  const digits = isThousandsGroup
    ? raw.replace(/,/g, "")
    : `${raw.slice(0, lastComma).replace(/,/g, "")}.${raw.slice(lastComma + 1)}`;
  return parseFloat(digits);
}

export function buildBeforeAfterRows(
  before: BonusLike[],
  after: BonusLike[],
): BeforeAfterRow[] {
  const afterByKey = new Map(after.map((bonus) => [bonus.key, bonus]));

  const base = ({ key, src, overlaySrc, label, detail }: BonusLike) => ({
    key,
    src,
    overlaySrc,
    label,
    detail,
  });

  const rows: BeforeAfterRow[] = before.map((bonus) => {
    const counterpart = afterByKey.get(bonus.key);
    if (counterpart === undefined) {
      return { ...base(bonus), before: bonus.value, tone: "lost" as const };
    }
    if (bonus.value === counterpart.value) {
      return {
        ...base(bonus),
        before: bonus.value,
        after: counterpart.value,
        tone: "neutral" as const,
      };
    }
    return {
      ...base(bonus),
      before: bonus.value,
      after: counterpart.value,
      tone:
        parseNumericMagnitude(counterpart.value) > parseNumericMagnitude(bonus.value)
          ? ("up" as const)
          : ("down" as const),
    };
  });

  const added: BeforeAfterRow[] = after
    .filter((bonus) => !before.some((other) => other.key === bonus.key))
    .map((bonus) => ({ ...base(bonus), after: bonus.value, tone: "new" as const }));

  return [...rows, ...added];
}

// ─── Composant ───────────────────────────────────────────────────────────────

/**
 * ⚠️ LA VALEUR SUIT LA TAILLE DU LIBELLÉ, elle ne la fixe plus.
 *
 * La valeur était figée à 12 px pendant que le libellé variait avec `compact` :
 * dans le tableau du vault (non compact, 14 px), la légende de gauche écrasait
 * les chiffres qu'elle annonce. Les deux partagent maintenant la même taille,
 * dans les deux modes.
 */
function CellValue({
  value,
  colorClass,
  fontSize,
}: {
  value?: string;
  colorClass?: string;
  fontSize: string;
}) {
  if (value === undefined) {
    return <Minus size={14} className="mx-auto text-muted-foreground/30" />;
  }
  return (
    <span className={cn("font-semibold tabular-nums", fontSize, colorClass)}>
      {value}
    </span>
  );
}

function afterColor(tone: BeforeAfterRow["tone"]) {
  if (tone === "up" || tone === "new") return "text-emerald-600 dark:text-emerald-500";
  if (tone === "down") return "text-red-500 dark:text-red-400";
  return "text-foreground/70";
}

/**
 * Le ton de la ligne « Level » elle-même, sur le même barème que les lignes de
 * bonus (`buildBeforeAfterRows`) — dans l'onglet Sacrifice, le niveau après
 * baisse presque toujours : sans couleur, cette ligne restait neutre pendant
 * que chaque bonus qu'elle explique ressortait en rouge, la seule ligne du
 * tableau à ne pas dire visuellement qu'on perd quelque chose.
 *
 * `parseNumericMagnitude` fait déjà ce travail pour les valeurs de bonus — un
 * texte comme « Lv. 5 » ou « Lv. 12 (+3/20) » lui suffit, le niveau est
 * toujours le premier nombre de la chaîne.
 */
function levelTone(before: string, after: string): BeforeAfterRow["tone"] {
  const from = parseNumericMagnitude(before);
  const to = parseNumericMagnitude(after);
  if (to === from) return "neutral";
  return to > from ? "up" : "down";
}

export function BeforeAfterTable({
  rows,
  emptyLabel,
  compact,
  levelRow,
  levelLabel = "Level",
}: {
  rows: BeforeAfterRow[];
  emptyLabel?: string;
  compact?: boolean;
  levelRow?: { before: string; after: string };
  levelLabel?: string;
}) {
  if (rows.length === 0) {
    return (
      <p className="py-3 text-center text-sm text-muted-foreground">
        {emptyLabel ?? "—"}
      </p>
    );
  }

  // 13 px hors mode compact, pas les 14 px de `text-sm` : le tableau du vault
  // avait une légende sensiblement plus grosse que celle des bâtiments
  // évolutifs (12 px) alors que les deux listent la même chose. 13/12 les
  // rapproche sans effacer la hiérarchie entre le tableau principal et les
  // cartes.
  const fontSize = compact ? "text-xs" : "text-[13px]";
  const rowPy = compact ? "py-2" : "py-2.5";
  const iconSize = compact ? 18 : 24;

  return (
    <div className="@container overflow-hidden rounded-xl border border-border">
      <div className="grid grid-cols-[1fr_72px_72px] @min-[380px]:grid-cols-[1fr_84px_84px] @min-[480px]:grid-cols-[1fr_140px_140px] py-0.5">
        <div className="px-3 py-2" />
        <div className="text-center text-xs font-black uppercase tracking-widest text-muted-foreground/75">
          Before
        </div>
        <div className="text-center text-xs font-black uppercase tracking-widest text-muted-foreground/75">
          After
        </div>
      </div>

      {levelRow && (
        <div className="grid grid-cols-[1fr_72px_72px] @min-[380px]:grid-cols-[1fr_84px_84px] @min-[480px]:grid-cols-[1fr_140px_140px] items-center border-t border-border/60 bg-muted/20 py-2">
          <div className="min-w-0 px-3">
            <span className={cn("font-semibold text-muted-foreground", fontSize)}>
              {levelLabel}
            </span>
          </div>
          <div className={cn("text-center font-semibold tabular-nums text-muted-foreground", fontSize)}>
            {levelRow.before}
          </div>
          <div
            className={cn(
              "text-center font-semibold tabular-nums",
              fontSize,
              afterColor(levelTone(levelRow.before, levelRow.after)),
            )}
          >
            {levelRow.after}
          </div>
        </div>
      )}

      {rows.map((row) => (
        <div
          key={row.key}
          className={cn(
            "grid grid-cols-[1fr_72px_72px] @min-[380px]:grid-cols-[1fr_84px_84px] @min-[480px]:grid-cols-[1fr_140px_140px] items-center border-t border-border/60",
            rowPy,
          )}
        >
          <div className="flex min-w-0 items-center gap-2 px-3">
            {/* Sur écran étroit le libellé est masqué : l'icône devient le seul
                repère, d'où le popover qui le restitue au clic. */}
            <Popover>
              <PopoverTrigger asChild>
                <button
                  className="relative inline-flex shrink-0 rounded @min-[640px]:pointer-events-none"
                  aria-label={row.label}
                >
                  <EffectIcon
                    src={row.src}
                    overlaySrc={row.overlaySrc}
                    alt={row.label}
                    size={iconSize}
                  />
                </button>
              </PopoverTrigger>
              <PopoverContent className="w-auto px-2.5 py-1.5 text-xs font-medium">
                {row.label}
                {row.detail ? ` · ${row.detail}` : ""}
              </PopoverContent>
            </Popover>
            {/* Le libellé réapparaît dès 300 px de CARTE (et non 640) : depuis
                que les colonnes avant/après tombent à 72 px sur conteneur
                étroit, il reste ~130 px pour lui. Tronqué, il vaut mieux
                qu'une icône muette — le popover reste actif jusqu'à 640 px
                pour le texte complet. */}
            <span
              className={cn(
                "hidden truncate font-medium text-muted-foreground @min-[300px]:inline",
                fontSize,
              )}
            >
              {row.label}
              {row.detail ? ` · ${row.detail}` : ""}
            </span>
            {row.tone === "new" && (
              <span className="shrink-0 rounded bg-emerald-500/15 px-1 py-px text-[10px] font-semibold uppercase text-emerald-700 dark:text-emerald-400">
                New
              </span>
            )}
            {row.tone === "lost" && (
              <span className="shrink-0 rounded bg-red-500/15 px-1 py-px text-[10px] font-semibold uppercase text-red-600 dark:text-red-400">
                Lost
              </span>
            )}
          </div>

          <div className="text-center">
            <CellValue
              value={row.before}
              fontSize={fontSize}
              colorClass={
                row.tone === "lost"
                  ? "text-red-500 dark:text-red-400"
                  : "text-muted-foreground"
              }
            />
          </div>
          <div className="text-center">
            <CellValue
              value={row.after}
              fontSize={fontSize}
              colorClass={afterColor(row.tone)}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
