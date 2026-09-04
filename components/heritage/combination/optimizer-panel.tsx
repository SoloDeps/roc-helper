"use client";

import { useState } from "react";
import { ArrowRight, Zap } from "lucide-react";

import { cn, formatNumber } from "@/lib/utils";
import { describeHeritageBonus } from "@/components/heritage/effect-display";
import { EffectIcon } from "@/components/heritage/effect-icon";
import { ResponsiveSelect, SELECT_TEN_OPTIONS } from "@/components/modals/responsive-select";
import BuildingCounter from "@/components/items/building-counter";
import type {
  CombinationLine,
  KeeperAxis,
  KeeperTradeOff,
  OptimizerPlan,
  OptimizerSource,
} from "@/resolvers/heritage-combination";
import { maxReachableValue, planAcrossKeeper } from "@/resolvers/heritage-combination";

// ============================================================
// « Il me manque combien, et où je mets mes jetons ? »
//
// Le seul endroit de l'onglet où les jetons deviennent une ressource PARTAGÉE :
// ceux dépensés à monter un évolutif ne nourrissent pas le vault. C'est ce qui
// fait de la question un arbitrage plutôt qu'une addition.
//
// ⚠️ DEUX MONNAIES, DEUX TOTAUX, AUCUN TAUX DE CHANGE. Le gardien ne contribue
// pas à la stat : il MULTIPLIE ce que le vault apporte. Le monter permet donc
// d'atteindre la même cible avec un vault moins haut — donc MOINS DE JETONS —
// mais il se paie en réputation, que rien ne convertit en jetons.
//
// Le panneau ne choisit donc pas à la place du joueur : il affiche le plan sans
// toucher au gardien, puis la COURBE D'ÉCHANGE — « +2 345 réputation, et il ne
// te reste que 1 255 jetons ». Laquelle de ses deux ressources est la plus rare,
// lui seul le sait, et ça ne se calcule pas.
// ============================================================

/**
 * ⚠️ L'ÉCHELLE DE SAISIE SUIT LE FORMAT, comme l'affichage. Un pourcentage se
 * tape en points (« 100 » pour 100 %) alors qu'il est stocké en ratio (1). Sans
 * cette conversion, viser la régénération instantanée demanderait de taper
 * « 1 » sous un champ marqué « % ».
 */
function toStored(format: string, typed: number): number {
  return format === "percent" ? typed / 100 : typed;
}

/** L'inverse : une valeur stockée, ramenée à l'échelle du champ de saisie. */
function toTyped(format: string, stored: number): number {
  return format === "percent" ? stored * 100 : stored;
}

/**
 * Plafond du champ cible. Large plutôt que serré : rien dans le jeu ne borne
 * un pourcentage cumulé aussi strictement qu'une quantité, et la stat choisie
 * peut changer d'une frappe à l'autre — un plafond commun, généreux, évite de
 * devoir en déduire un par format.
 */
const TARGET_MAX = 999_999_999;

/** La valeur d'une ligne, formatée dans l'unité de sa stat. */
function formatFor(line: CombinationLine, value: number, selections: string[][]): string {
  return describeHeritageBonus(
    { ...line.sample, value, amplified: value },
    selections,
  ).value;
}

function PlanView({
  plan,
  line,
  selections,
}: {
  plan: OptimizerPlan;
  line: CombinationLine;
  selections: string[][];
}) {
  if (plan.steps.length === 0) {
    return (
      <p className="rounded-md bg-emerald-500/10 px-2.5 py-2 text-[13px] font-medium text-emerald-700 dark:text-emerald-400">
        {plan.reached
          ? "Target already reached with the current setup."
          : "Nothing left to raise — every building is already at max."}
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[12px] font-semibold uppercase tracking-widest text-muted-foreground">
          {plan.reached ? "Cheapest plan" : "Best reachable"}
        </p>
        <span className="rounded-md border border-primary/30 bg-primary/10 px-2 py-0.5 text-[13px] font-semibold tabular-nums text-primary">
          {formatNumber(plan.totalTokens)} tokens
        </span>
      </div>

      <ul className="flex flex-col gap-1">
        {plan.steps.map((step) => (
          <li
            key={step.sourceId}
            className="flex items-center gap-2 rounded-md bg-background-100 px-2.5 py-1.5"
          >
            <span
              className={cn(
                "size-1.5 shrink-0 rounded-full",
                step.sourceKind === "vault" ? "bg-primary" : "bg-muted-foreground/40",
              )}
              aria-hidden="true"
            />
            <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-foreground">
              {step.sourceName}
            </span>
            <span className="flex shrink-0 items-center gap-1 text-[12px] tabular-nums text-muted-foreground">
              Lv. {step.fromLevel}
              <ArrowRight size={10} aria-hidden="true" />
              <span className="font-semibold text-foreground">Lv. {step.toLevel}</span>
            </span>
            <span className="shrink-0 text-[12px] font-semibold tabular-nums text-primary">
              +{formatNumber(step.tokens)}
            </span>
          </li>
        ))}
      </ul>

      <p className="flex items-center justify-between gap-2 text-[13px]">
        <span className="text-muted-foreground">Result</span>
        <span className="flex items-center gap-1.5 tabular-nums">
          <span className="text-muted-foreground">
            {formatFor(line, plan.currentValue, selections)}
          </span>
          <ArrowRight size={10} aria-hidden="true" className="text-muted-foreground" />
          <span
            className={cn(
              "font-semibold",
              plan.reached ? "text-emerald-600 dark:text-emerald-400" : "text-foreground",
            )}
          >
            {formatFor(line, plan.value, selections)}
          </span>
        </span>
      </p>

      {/* ⚠️ Le total est un COMPTE, pas une monnaie unique : les jetons d'un
          évolutif lui sont propres, seul le vault les accepte tous. Le dire ici
          évite de lire « 1 974 jetons » comme une cagnotte interchangeable. */}
      <p className="text-[11px] leading-snug text-muted-foreground">
        Evolving levels need that building&apos;s own tokens; the vault accepts any
        eligible token. This plan keeps your keeper rank as it is.
      </p>
    </div>
  );
}

/**
 * La courbe d'échange : ce que coûterait la même cible en misant sur le gardien.
 *
 * ⚠️ LES DEUX COLONNES NE S'ADDITIONNENT PAS. La réputation et les jetons sont
 * deux ressources distinctes, et la ligne dit « ceci CONTRE cela », pas « ceci
 * plus cela ». D'où le « ↔ » plutôt qu'un total, et l'économie de jetons
 * affichée en regard : c'est elle que le joueur achète.
 */
function KeeperTradeOffs({
  offers,
  currentLevel,
}: {
  offers: KeeperTradeOff[];
  currentLevel: number;
}) {
  if (offers.length === 0) return null;

  return (
    <div className="flex flex-col gap-1.5 border-t border-border pt-2.5">
      <p className="text-[12px] font-semibold uppercase tracking-widest text-muted-foreground">
        Or lean on the keeper
      </p>
      <p className="text-[12px] leading-snug text-muted-foreground">
        Raising the keeper multiplies what the vault contributes, so the same target
        needs a lower vault level — fewer tokens, paid in reputation instead.
      </p>
      {/* ⚠️ HAUTEUR BORNÉE, PAS DE TRONCATURE. La courbe compte facilement une
          quinzaine de points, et les dérouler tous pousserait le reste de la
          colonne hors de l'écran. Mais en couper arbitrairement retirerait
          peut-être justement le palier qui intéresse le joueur : on scrolle. */}
      <ul className="flex max-h-52 flex-col gap-1 overflow-y-auto">
        {offers.map((offer) => (
          <li
            key={offer.keeperLevel}
            className="flex items-center gap-2 rounded-md bg-background-100 px-2.5 py-1.5 text-[12px]"
          >
            <span className="shrink-0 font-medium text-foreground">
              Keeper Lv. {offer.keeperLevel}
            </span>
            <span className="shrink-0 tabular-nums text-muted-foreground">
              +{formatNumber(offer.reputation)} rep
            </span>
            <span aria-hidden="true" className="shrink-0 text-muted-foreground">
              ↔
            </span>
            <span className="flex-1 tabular-nums text-muted-foreground">
              {formatNumber(offer.plan.totalTokens)} tokens
            </span>
          </li>
        ))}
      </ul>
      <p className="text-[11px] leading-snug text-muted-foreground">
        Reputation counted from your current keeper Lv. {currentLevel}. Reputation and
        tokens are separate resources — the rows trade one for the other, they don&apos;t add up.
      </p>
    </div>
  );
}

export function OptimizerPanel({
  lines,
  buildSources,
  keeper,
  selections,
}: {
  lines: CombinationLine[];
  /**
   * Les porteurs vus par l'optimiseur, pour la stat demandée — currifié sur le
   * multiplicateur du gardien, que l'arbitrage fait varier.
   */
  buildSources: (line: CombinationLine) => (multiplier: number) => OptimizerSource[];
  keeper: KeeperAxis;
  selections: string[][];
}) {
  // Une stat incumulable (la portée de culture) n'a pas de cible qui ait un sens.
  const targetable = lines.filter((line) => line.rule !== "none");
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [target, setTarget] = useState(0);
  // Distingue « rien tapé » de « 0 tapé » — le compteur n'a pas d'état vide,
  // contrairement à l'ancien champ texte.
  const [touched, setTouched] = useState(false);

  if (targetable.length === 0) return null;

  // La stat choisie peut disparaître quand la configuration change (un bâtiment
  // retiré, un effet dépose) : on retombe sur la première plutôt que de rendre
  // un panneau vide.
  const line =
    targetable.find((candidate) => candidate.key === selectedKey) ?? targetable[0];
  const display = describeHeritageBonus(line.sample, selections);
  const isPercent = line.sample.format === "percent";

  // ⚠️ LE PLAFOND BORNE LA SAISIE, ET C'EST AUSSI CE QUI PROTÈGE LE CALCUL.
  // Tous les porteurs au niveau max, gardien au rang max : au-dessus, aucun plan
  // n'existe. Sans cette borne, le champ montait à 999 999 999 — un curseur
  // inutilisable au doigt sur téléphone — ET une cible hors de portée faisait
  // balayer les 99 rangs de gardien pour ne rien trouver, le pire cas de coût.
  // Une seule lecture par porteur ici, pas de frontière (cf. `maxReachableValue`).
  const ceiling = maxReachableValue(
    buildSources(line)(keeper.multiplierAt(keeper.maxLevel)),
    line.rule,
  );
  // ⚠️ ARRONDI VERS LE BAS. Le plafond du champ doit rester ATTEIGNABLE : à
  // `Math.ceil`, la valeur maximale du compteur dépassait le plafond réel d'une
  // fraction et le panneau répondait « hors de portée » à son propre maximum.
  const typedCeiling =
    ceiling === null
      ? TARGET_MAX
      : Math.min(TARGET_MAX, Math.max(1, Math.floor(toTyped(line.sample.format, ceiling))));

  const hasTarget = touched && target > 0;
  const outOfReach = hasTarget && ceiling !== null && toStored(line.sample.format, target) > ceiling;
  // La première option est TOUJOURS le rang de gardien courant : c'est le plan
  // « sans rien changer d'autre », et les suivantes sont l'échange proposé.
  const options: KeeperTradeOff[] =
    hasTarget && !outOfReach
      ? planAcrossKeeper(
          buildSources(line),
          line.rule,
          toStored(line.sample.format, target),
          keeper,
        )
      : [];
  const plan: OptimizerPlan | null = options[0]?.plan ?? null;
  const tradeOffs = options.slice(1);

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
      <div className="border-b border-border px-3 py-2">
        <p className="text-[12px] font-semibold uppercase tracking-widest text-muted-foreground">
          Reach a target
        </p>
      </div>

      <div className="flex flex-col gap-3 p-3">
        <div className="flex flex-wrap items-end gap-3">
          {/* ⚠️ LARGEUR FIXÉE À LA MOITIÉ DU PANNEAU. Le select s'étirait sur
              tout l'espace laissé par le champ cible, alors que ses libellés
              tiennent largement dans deux fois moins — au détriment du champ
              cible, écrasé sur le côté. */}
          <div className="flex w-1/2 min-w-0 flex-col gap-1">
            <span className="text-[12px] font-medium uppercase tracking-wide text-muted-foreground">
              Stat
            </span>
            <ResponsiveSelect
              contentClassName={SELECT_TEN_OPTIONS}
              value={line.key}
              onValueChange={setSelectedKey}
              options={targetable.map((candidate) => ({
                value: candidate.key,
                label: describeHeritageBonus(candidate.sample, selections).label,
              }))}
              placeholder="Stat"
              className="w-full"
              selectClassName="h-8 rounded-lg"
              drawerBtnClassName="h-8"
            />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[12px] font-medium uppercase tracking-wide text-muted-foreground">
              Target
            </span>
            <div className="flex items-center gap-1.5">
              <BuildingCounter
                value={target}
                onChange={(value) => {
                  setTarget(value);
                  setTouched(true);
                }}
                min={0}
                max={typedCeiling}
                allowTypedInput
                ariaLabel={`Target ${display.label}`}
              />
              {isPercent && <span className="text-[13px] text-muted-foreground">%</span>}
              {/* ⚠️ Le raccourci n'apparaît que sur un POURCENTAGE : « 100 » n'a
                  de sens comme objectif que sur une stat qui plafonne à 100 % —
                  la régénération instantanée, exactement ce que le jeu propose
                  comme but. Sur une quantité, 100 biens ne veut rien dire. */}
              {isPercent && (
                <button
                  onClick={() => {
                    setTarget(100);
                    setTouched(true);
                  }}
                  title="Target 100% — instant regeneration"
                  className="flex h-9 shrink-0 cursor-pointer items-center gap-1 rounded-lg border border-border px-2 text-[12px] font-medium text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground"
                >
                  <Zap size={11} aria-hidden="true" />
                  100%
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-md bg-background-100 px-2.5 py-1.5">
          {/* Icône nue, taille du badge de stat — voir `totals-table.tsx`. */}
          <EffectIcon src={display.src} overlaySrc={display.overlaySrc} alt={display.label} size={25} />
          <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-foreground">
            {display.label}
          </span>
          <span className="shrink-0 text-[13px] font-semibold tabular-nums text-foreground">
            {line.total === null ? "—" : formatFor(line, line.total, selections)}
          </span>
        </div>

        {/* ⚠️ DIRE LE PLAFOND PLUTÔT QUE DE CALCULER DANS LE VIDE. Une cible
            au-dessus n'a pas de plan — pas même un plan cher : aucun. Le panneau
            l'annonce et nomme la valeur atteignable, au lieu de rendre un « best
            reachable » qui se lit comme une réponse à la question posée. */}
        {outOfReach ? (
          <p className="rounded-md bg-amber-500/10 px-2.5 py-2 text-[13px] font-medium text-amber-700 dark:text-amber-400">
            Out of reach — even with every building at max level and the keeper at Lv.{" "}
            {keeper.maxLevel}, this setup tops out at{" "}
            {ceiling === null ? "—" : formatFor(line, ceiling, selections)}.
          </p>
        ) : plan === null ? (
          <p className="text-[13px] text-muted-foreground">
            Enter a target to see the cheapest way to get there.
          </p>
        ) : (
          <>
            <PlanView plan={plan} line={line} selections={selections} />
            <KeeperTradeOffs offers={tradeOffs} currentLevel={keeper.currentLevel} />
          </>
        )}
      </div>
    </div>
  );
}
