import type { HeritageEffectGroup } from "@/data/heritage/generated/types";
import type { EraCode } from "@/types/shared";
import { bonusKey } from "@/resolvers/bonus";
import {
  KEEPER_AMPLIFIER_EXEMPT_TYPES,
  amplifyBonusValue,
  keeperAmplifierMultiplier,
  resolveHeritageVault,
  type ResolvedHeritageBonus,
  type ResolvedHeritageEffect,
  type ResolvedHeritageVault,
} from "@/resolvers/heritage";
import {
  describeCultureEffect,
  describeHeritageBonus,
} from "@/components/heritage/effect-display";

// ============================================================
// Construction de la matrice de l'onglet « Progression » : une ligne par
// niveau, une colonne par bonus.
//
// Module PUR — aucune formule, aucun rendu. Il n'assemble que ce que
// `resolvers/heritage.ts` calcule et ce que `effect-display.ts` sait écrire.
//
// ⚠️ UN SEUL AXE VARIE À LA FOIS. La grille complète ferait 60 niveaux de vault
// × 99 rangs de gardien = 5 940 lignes, illisible et coûteuse à recalculer à
// chaque frappe. On ÉPINGLE donc un axe et on déroule l'autre — les deux sens
// répondent à deux questions distinctes du joueur : « qu'est-ce que les
// prochains niveaux m'apportent, à rang de gardien constant ? » et « qu'est-ce
// que le rang de gardien m'apporte, à niveau de vault constant ? ».
//
// ⚠️ CE TABLEAU LIT TOUS LES EFFETS DÉBLOQUÉS, PAS LES SEULS ÉQUIPÉS — même
// convention que `diffVaultLevels` (onglet Sacrifice). Il répond à « qu'est-ce
// que ce niveau OUVRE », une donnée de catalogue reproductible d'un joueur à
// l'autre, et non à « qu'est-ce que MA configuration rend aujourd'hui », que
// `activeBonuses` couvre déjà ailleurs. Conséquence assumée : le vault déclare
// 10 effets pour 8 slots, une ligne du tableau n'est donc pas un total
// atteignable en jeu, c'est la valeur de chaque bonus PRIS ISOLÉMENT.
// ============================================================

/** L'axe qui VARIE — l'autre est épinglé à une valeur unique. */
export type ProgressionAxis = "vault" | "keeper";

export interface ProgressionColumn {
  /** Identité stable : `effectId#type#instance`, ou `effectId#culture`. */
  key: string;
  effectId: string;
  /** Niveau de vault auquel la colonne s'allume. */
  minLevel: number;
  group: HeritageEffectGroup;
  label: string;
  src: string;
  overlaySrc: string | null;
  /**
   * `false` sur les compteurs discrets exemptés d'amplification (convention
   * (b bis) du resolver) : ces colonnes-là restent PLATES quand le rang de
   * gardien varie, et le tableau doit pouvoir le dire plutôt que de laisser
   * croire à un bug.
   */
  keeperAmplified: boolean;
}

export interface ProgressionRow {
  key: string;
  vaultLevel: number;
  keeperLevel: number;
  /** L'amplificateur du gardien de la ligne, en points de pourcentage. */
  amplifierPercent: number;
  /** Une entrée par colonne, `null` tant que le palier n'est pas atteint. */
  values: (string | null)[];
}

export interface ProgressionMatrix {
  columns: ProgressionColumn[];
  rows: ProgressionRow[];
}

export interface ProgressionMatrixInput {
  vaultKey: string;
  era: EraCode;
  /** L'axe déroulé sur les lignes. */
  axis: ProgressionAxis;
  /** La valeur de l'axe ÉPINGLÉ : rang de gardien si `axis === "vault"`. */
  pinnedLevel: number;
  maxVaultLevel: number;
  maxKeeperLevel: number;
  selections: string[][];
}

/**
 * Le vault résolu à `level` et à rang de gardien NEUTRE (1).
 *
 * L'amplificateur est rejoué colonne par colonne (`amplifyBonusValue`) plutôt
 * que demandé au resolver : en mode « gardien », les 99 lignes partagent le
 * même niveau de vault et n'ont donc besoin que d'UNE résolution, les 98 autres
 * n'étant qu'un facteur multiplicatif. Redemander `resolveHeritageVault` par
 * ligne rejouerait 99 fois les mêmes formules Lua pour rien.
 */
function resolveAt(key: string, level: number, era: EraCode): ResolvedHeritageVault | null {
  return resolveHeritageVault(key, level, era);
}

/** Les deux bonus de culture d'un effet, s'il les porte tous les deux. */
function isCultureEffect(effect: ResolvedHeritageEffect): boolean {
  return (
    effect.bonuses.some((bonus) => bonus.type === "culture_points") &&
    effect.bonuses.some((bonus) => bonus.type === "culture_range")
  );
}

/**
 * Les colonnes du tableau, lues sur le vault RÉSOLU AU NIVEAU MAX.
 *
 * ⚠️ Au niveau max, et pas au niveau courant : les colonnes sont l'ossature du
 * tableau et ne doivent pas apparaître puis disparaître au fil des lignes. Un
 * bonus écrit en RANG de bien (`goods_output`) tire aussi son libellé et son
 * icône de la lecture (`resources`), qui n'existe qu'une fois le palier atteint
 * — les lire au niveau max garantit un en-tête complet dès la première ligne.
 *
 * Les effets sans bonus nommable (paliers à COFFRE seul) n'ont pas de colonne :
 * leur seule valeur chiffrable est « 1 coffre par collecte » à tous les niveaux
 * (cf. `describeChestEffect`), une colonne constante qui n'apprendrait rien.
 * L'onglet Infos les liste déjà (`OverviewTable`).
 */
export function buildProgressionColumns(
  vault: ResolvedHeritageVault,
  selections: string[][],
): ProgressionColumn[] {
  const columns: ProgressionColumn[] = [];
  const sorted = [...vault.effects].sort((a, b) => a.minLevel - b.minLevel);

  for (const effect of sorted) {
    if (effect.bonuses.length === 0) continue;

    // Culture : UNE colonne pour deux bonus, comme partout ailleurs dans le
    // module (`describeCultureEffect`) — « 496 (1x1) » est une seule donnée de
    // jeu, pas deux. `culture_points` est amplifié, la portée non : la colonne
    // varie donc bien avec le gardien.
    if (isCultureEffect(effect)) {
      const display = describeCultureEffect(effect.bonuses, selections, true);
      if (display !== null) {
        columns.push({
          key: `${effect.id}#culture`,
          effectId: effect.id,
          minLevel: effect.minLevel,
          group: effect.group,
          label: display.label,
          src: display.src,
          overlaySrc: display.overlaySrc,
          keeperAmplified: true,
        });
        continue;
      }
    }

    for (const bonus of effect.bonuses) {
      const display = describeHeritageBonus(bonus, selections, true);
      columns.push({
        key: `${effect.id}#${bonusKey(bonus)}`,
        effectId: effect.id,
        minLevel: effect.minLevel,
        group: effect.group,
        label: display.label,
        src: display.src,
        overlaySrc: display.overlaySrc,
        keeperAmplified: !KEEPER_AMPLIFIER_EXEMPT_TYPES.has(bonus.type),
      });
    }
  }

  return columns;
}

/** Le bonus, ré-amplifié au rang de gardien de la LIGNE. */
function reamplify(bonus: ResolvedHeritageBonus, multiplier: number): ResolvedHeritageBonus {
  return {
    ...bonus,
    amplified: amplifyBonusValue(bonus.type, bonus.value, multiplier),
  };
}

/** Les cellules d'une ligne : la valeur affichée par colonne, `null` si verrouillée. */
function rowValues(
  vault: ResolvedHeritageVault,
  columns: ProgressionColumn[],
  multiplier: number,
  selections: string[][],
): (string | null)[] {
  const effectById = new Map(vault.effects.map((effect) => [effect.id, effect]));

  return columns.map((column) => {
    const effect = effectById.get(column.effectId);
    // ⚠️ `null`, jamais « 0 » : le palier n'est pas atteint, le jeu ne dit rien
    // à ce niveau-là. Écrire un zéro ferait croire à un bonus nul.
    if (effect === undefined || !effect.unlocked) return null;

    const bonuses = effect.bonuses.map((bonus) => reamplify(bonus, multiplier));

    if (column.key.endsWith("#culture")) {
      return describeCultureEffect(bonuses, selections, true)?.value ?? null;
    }

    const bonus = bonuses.find(
      (candidate) => `${column.effectId}#${bonusKey(candidate)}` === column.key,
    );
    if (bonus === undefined) return null;
    return describeHeritageBonus(bonus, selections, true).value;
  });
}

/**
 * La matrice complète pour un vault, une ère et un axe.
 *
 * Rend `null` sur une clé de vault inconnue — même contrat que
 * `resolveHeritageVault`, dont il n'est qu'un assemblage.
 */
export function buildProgressionMatrix(
  input: ProgressionMatrixInput,
): ProgressionMatrix | null {
  const { vaultKey, era, axis, selections } = input;
  const maxVaultLevel = Math.max(Math.trunc(input.maxVaultLevel), 1);
  const maxKeeperLevel = Math.max(Math.trunc(input.maxKeeperLevel), 1);
  const pinned = Math.max(Math.trunc(input.pinnedLevel), 1);

  const skeleton = resolveAt(vaultKey, maxVaultLevel, era);
  if (skeleton === null) return null;
  const columns = buildProgressionColumns(skeleton, selections);

  if (axis === "keeper") {
    // Un seul niveau de vault : une seule résolution, puis 99 amplifications.
    const vaultLevel = Math.min(pinned, maxVaultLevel);
    const resolved = resolveAt(vaultKey, vaultLevel, era);
    if (resolved === null) return null;

    const rows = Array.from({ length: maxKeeperLevel }, (_, index) => {
      const keeperLevel = index + 1;
      const multiplier = keeperAmplifierMultiplier(keeperLevel);
      return {
        key: `k${keeperLevel}`,
        vaultLevel,
        keeperLevel,
        amplifierPercent: multiplier * 100,
        values: rowValues(resolved, columns, multiplier, selections),
      };
    });
    return { columns, rows };
  }

  // Axe « vault » : le rang de gardien est constant, son multiplicateur aussi.
  const keeperLevel = Math.min(pinned, maxKeeperLevel);
  const multiplier = keeperAmplifierMultiplier(keeperLevel);
  const rows: ProgressionRow[] = [];
  for (let vaultLevel = 1; vaultLevel <= maxVaultLevel; vaultLevel += 1) {
    const resolved = resolveAt(vaultKey, vaultLevel, era);
    if (resolved === null) continue;
    rows.push({
      key: `v${vaultLevel}`,
      vaultLevel,
      keeperLevel,
      amplifierPercent: multiplier * 100,
      values: rowValues(resolved, columns, multiplier, selections),
    });
  }
  return { columns, rows };
}

// ─── Export ──────────────────────────────────────────────────────────────────

/**
 * Le tableau en texte tabulaire.
 *
 * ⚠️ DEUX FORMATS, DEUX USAGES. Le presse-papiers reçoit du TSV : les valeurs
 * formatées contiennent déjà des virgules de milliers (« 1,800 ») et des
 * espaces, qu'un collage CSV dans un tableur éclaterait en colonnes. Le
 * téléchargement, lui, reçoit du CSV entre guillemets — le format qu'attend un
 * double-clic sur le fichier.
 */
export function toDelimitedText(
  matrix: ProgressionMatrix,
  visibleKeys: ReadonlySet<string>,
  format: "tsv" | "csv",
): string {
  // Les INDICES visibles, pas les colonnes : `row.values` est aligné sur
  // `matrix.columns`, filtrer les colonnes sans garder leur position
  // décalerait les valeurs d'une colonne masquée à la suivante.
  const visible = matrix.columns
    .map((column, index) => ({ column, index }))
    .filter(({ column }) => visibleKeys.has(column.key));
  const header = [
    "Vault level",
    "Keeper level",
    "Amplifier",
    // Le palier désambiguïse deux colonnes homonymes (« Goods » au niveau 1
    // et au niveau 28 sur le vault Celtic) — même règle qu'en en-tête.
    ...visible.map(({ column }) => `${column.label} (lvl ${column.minLevel})`),
  ];
  const lines = matrix.rows.map((row) => [
    String(row.vaultLevel),
    String(row.keeperLevel),
    `+${row.amplifierPercent.toFixed(0)}%`,
    ...visible.map(({ index }) => row.values[index] ?? ""),
  ]);

  if (format === "tsv") {
    // Une tabulation ne peut pas apparaître dans une valeur formatée : rien à
    // échapper, le collage tableur tombe juste tel quel.
    return [header, ...lines].map((row) => row.join("\t")).join("\n");
  }

  const escape = (cell: string) => `"${cell.replace(/"/g, '""')}"`;
  return [header, ...lines].map((row) => row.map(escape).join(",")).join("\n");
}
