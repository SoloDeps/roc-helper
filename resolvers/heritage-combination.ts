// ============================================================
// ROC Helper – Cumul des bonus d'un thème d'héritage
//
// Répond à UNE question : « si je pose côte à côte mon bâtiment d'héritage et
// mes bâtiments évolutifs du même thème, qu'est-ce que ça donne au total ? »
//
// Ce module ne connaît ni React, ni le Heritage Vault, ni les bâtiments
// évolutifs : il prend des LISTES DE BONUS DÉJÀ RÉSOLUS, chacune rattachée à sa
// source, et rend les lignes cumulées. `ResolvedHeritageBonus` et
// `ResolvedEvolvingBonus` satisfont tous deux `CombinableBonus` sans conversion.
//
// Trois sections, chacune ignorant les suivantes :
//
//  1. LE CUMUL — `combineBonuses`. Pure composition, aucune donnée de jeu.
//  2. LES LECTURES DÉRIVÉES — `regenerationReadouts`. Traduit un pourcentage
//     cumulé en temps (« une boussole toutes les 15 min »), ce qui demande la
//     régénération NUE de la ressource, seule dépendance de donnée du module.
//  3. L'OPTIMISEUR — `planForTarget`. La répartition de jetons la moins chère
//     pour atteindre une cible. Ne lit aucune donnée : l'appelant lui fournit
//     les barèmes de coût et de contribution sous forme de fonctions.
//
// ⚠️ CE QU'IL NE FAIT PAS : choisir QUELS bonus lui sont donnés. C'est
// l'appelant qui décide, et notamment qui n'envoie que les effets ÉQUIPÉS du
// vault — 8 emplacements pour 10 effets, le jeu ne permet jamais les 10.
// ============================================================

import { BUILDING_EXTRACT } from "@/data/buildings/generated/buildings.generated";
import type {
  BuildingBonusFormat,
  BuildingBonusScope,
} from "@/data/buildings/generated/types";

/** Les jauges du jeu et leur régénération NUE — voir la section « Lectures dérivées ». */
const REGENERATING_RESOURCES = BUILDING_EXTRACT.regeneratingResources;

/**
 * Le dénominateur commun des deux domaines.
 *
 * `amplified` est optionnel : seul le Heritage Vault l'a (rang de gardien). Un
 * bonus de bâtiment évolutif n'en porte pas, et vaut alors sa `value` nue.
 */
export interface CombinableBonus {
  type: string;
  label: string;
  /** `null` quand le game design ne dit rien à ce niveau — pas « zéro ». */
  value: number | null;
  amplified?: number | null;
  format: BuildingBonusFormat;
  scope: BuildingBonusScope | null;
  instance: number;
  resources: string[];
  periodSeconds: number | null;
  /** Espérance de tirage plutôt que montant garanti — cf. `BuildingBonus.isChestExpectation`. */
  isChestExpectation: boolean;
}

/** Un porteur de bonus dans le cumul : le vault, ou un évolutif. */
export interface CombinationSource {
  /** Identité stable dans CE cumul — la clé de carte de l'onglet fait l'affaire. */
  id: string;
  name: string;
  kind: "vault" | "evolving";
  bonuses: CombinableBonus[];
}

/**
 * Comment plusieurs porteurs composent une même stat.
 *
 * ⚠️ TROIS RÈGLES, PAS UNE. C'est le cœur du module, et chacune a sa raison —
 * les confondre produirait un total faux sans rien signaler.
 */
export type CombinationRule =
  /**
   * ADDITION — pourcentages et quantités.
   *
   * ⚠️ HYPOTHÈSE ASSUMÉE POUR LES POURCENTAGES, tranchée avec l'utilisateur et
   * NON ENCORE MESURÉE EN JEU. Deux réductions de temps peuvent aussi bien
   * s'additionner (45 % + 30,5 % = 75,5 %) que se composer multiplicativement
   * (1 − 0,55 × 0,695 = 61,8 %). Le game design ne le dit nulle part.
   *
   * L'additif est retenu pour deux raisons : c'est le modèle du tableur
   * communautaire qui a motivé cette fonctionnalité, et c'est le SEUL des deux
   * qui rende la régénération instantanée atteignable — or le jeu la propose
   * comme objectif. Une mesure qui le contredirait ne changerait que
   * `combineValues`, à un seul endroit.
   *
   * Pour les QUANTITÉS (biens par jour, points de culture, emplacements
   * d'ouvrier), l'addition n'est pas une hypothèse : deux bâtiments qui
   * produisent chacun 130 biens en produisent 260.
   */
  | "sum"
  /**
   * MAXIMUM — les plafonds.
   *
   * La loca est explicite : « Raises the regeneration cap for {0} **to** {1} » —
   * *to*, pas *by*. Le boost POSE un plafond, il ne l'incrémente pas, malgré
   * l'identifiant `…CapIncrement` du game design. Deux porteurs qui posent
   * chacun un plafond laissent donc le plus haut : Épave niveau 60 (7 boussoles)
   * et héritage niveau 60 (9) donnent 9, jamais 16.
   */
  | "max"
  /**
   * AUCUN CUMUL — les dimensions propres à un bâtiment.
   *
   * `culture_range` est un RAYON en cases autour du bâtiment qui le porte. Deux
   * bâtiments de portée 4 ne font pas une portée 8, et n'en font pas non plus
   * une de 4 : ils couvrent deux zones distinctes. Aucune opération n'a de sens,
   * donc aucune n'est faite — la ligne montre ses contributions et pas de total.
   *
   * ⚠️ C'est le seul cas connu, et il est nommé explicitement plutôt que déduit
   * d'un motif : `culture_points`, son voisin immédiat de composant, S'ADDITIONNE
   * bel et bien (c'est un total de points apporté à la ville).
   */
  | "none";

/** Les types qui ne se cumulent d'aucune façon — voir `CombinationRule`. */
const UNCOMBINABLE_TYPES: ReadonlySet<string> = new Set(["culture_range"]);

/** La règle qui s'applique à un type de bonus. */
export function combinationRuleFor(type: string): CombinationRule {
  if (UNCOMBINABLE_TYPES.has(type)) return "none";
  // Tout plafond, quel que soit son domaine : `regeneration_cap` (générique,
  // porté par sa ressource) comme `research_point_cap` (qui nomme les PR).
  if (type.endsWith("_cap")) return "max";
  return "sum";
}

/** Ce qu'un porteur apporte à une ligne. */
export interface CombinationContribution {
  sourceId: string;
  sourceName: string;
  sourceKind: CombinationSource["kind"];
  /** La valeur retenue : amplifiée si la source en a une, nue sinon. */
  value: number;
}

/** Une stat, tous porteurs confondus. */
export interface CombinationLine {
  /** Identité de la stat dans ce cumul — voir `combinationKey`. */
  key: string;
  /**
   * Un bonus représentatif, pour l'icône, le libellé et le format.
   *
   * ⚠️ Le PREMIER rencontré, pas un bonus synthétique : toutes les valeurs de la
   * ligne partagent déjà type, portée, ressources et période — c'est ce que la
   * clé garantit. Seule sa `value` ne doit pas être lue ; c'est `total` qui la
   * remplace.
   */
  sample: CombinableBonus;
  rule: CombinationRule;
  /**
   * Le cumul. `null` quand la règle est `none`, ou qu'aucun porteur n'a de
   * valeur lisible à son niveau.
   */
  total: number | null;
  /** Dans l'ordre des sources reçues. Jamais vide. */
  contributions: CombinationContribution[];
}

/**
 * L'identité d'une stat pour le cumul.
 *
 * ⚠️ CE QUI EST DANS LA CLÉ, ET POURQUOI.
 *
 *  - `type` — évidemment ; c'est lui qui a fallu réparer côté extraction pour
 *    que l'Épave et le vault ATH nomment pareil leur boost de boussole.
 *  - `scope` — deux `recruitment_time_reduction` de portées différentes
 *    (`infantryBarracks` vs `heavyInfantryBarracks`) ne se cumulent PAS, ils
 *    visent deux casernes. Le vault ATH, lui, porte le sien SANS portée : il
 *    vaut pour toutes, et reste donc une ligne à part.
 *  - `resources` — un `goods_output` de blé et un de vin sont deux quantités.
 *  - `periodSeconds` — 8 500 pièces par jour et 1 200 par 6 h ne s'additionnent
 *    pas telles quelles. Plutôt que de normaliser en silence vers une période
 *    commune (un choix que rien ne fonde aujourd'hui), on garde deux lignes.
 *
 * ⚠️ CE QUI N'Y EST PAS : `instance`. Il ne compte les répétitions QU'AU SEIN
 * d'un même porteur — deux `goods_output` sur un même vault sont bien deux
 * bonus, mais s'ils partagent tout le reste, leur somme est ce que le joueur
 * reçoit. L'inclure séparerait la 1ʳᵉ instance du vault de la 1ʳᵉ instance de
 * l'évolutif tout en les gardant chacune seule — l'inverse du but.
 */
export function combinationKey(bonus: CombinableBonus): string {
  const scope = bonus.scope === null ? "-" : `${bonus.scope.kind}:${bonus.scope.value}`;
  const resources = [...bonus.resources].sort().join("+");
  const period = bonus.periodSeconds === null ? "-" : String(bonus.periodSeconds);
  return `${bonus.type}|${scope}|${resources}|${period}`;
}

/** La valeur à retenir d'un bonus : amplifiée quand la source en a une. */
function readValue(bonus: CombinableBonus): number | null {
  return bonus.amplified ?? bonus.value;
}

/** Applique la règle à des valeurs déjà filtrées (jamais vide, jamais `null`). */
function combineValues(rule: CombinationRule, values: number[]): number | null {
  if (rule === "none") return null;
  if (rule === "max") return Math.max(...values);
  return values.reduce((total, value) => total + value, 0);
}

/**
 * Le cumul de plusieurs porteurs, une ligne par stat.
 *
 * L'ordre des lignes suit la PREMIÈRE apparition de chaque stat dans l'ordre des
 * sources reçues : l'appelant range ses sources comme il veut les lire, et le
 * tableau suit, sans tri caché à comprendre.
 *
 * Un bonus dont la valeur est `null` au niveau demandé est ignoré — le game
 * design ne dit rien à ce niveau, ce n'est pas « zéro ». Une stat dont AUCUN
 * porteur ne dit rien ne produit aucune ligne.
 */
export function combineBonuses(sources: CombinationSource[]): CombinationLine[] {
  const lines = new Map<string, CombinationLine>();

  for (const source of sources) {
    for (const bonus of source.bonuses) {
      const value = readValue(bonus);
      if (value === null) continue;

      const key = combinationKey(bonus);
      const contribution: CombinationContribution = {
        sourceId: source.id,
        sourceName: source.name,
        sourceKind: source.kind,
        value,
      };

      const existing = lines.get(key);
      if (existing === undefined) {
        lines.set(key, {
          key,
          sample: bonus,
          rule: combinationRuleFor(bonus.type),
          total: null,
          contributions: [contribution],
        });
        continue;
      }
      existing.contributions.push(contribution);
    }
  }

  // Le total est calculé APRÈS le regroupement : `max` a besoin de voir toutes
  // les contributions, et `sum` doit ajouter dans un ordre stable.
  return [...lines.values()].map((line) => ({
    ...line,
    total: combineValues(
      line.rule,
      line.contributions.map((contribution) => contribution.value),
    ),
  }));
}

/**
 * Les lignes auxquelles PLUSIEURS porteurs contribuent.
 *
 * C'est la réponse à « qu'est-ce que le cumul m'apporte VRAIMENT ? » : une stat
 * portée par un seul bâtiment n'est pas un cumul, juste un report. Sur le thème
 * ATH, ce filtre isole les six stats communes au vault et à ses deux évolutifs.
 */
export function stackedLines(lines: CombinationLine[]): CombinationLine[] {
  return lines.filter((line) => line.contributions.length > 1);
}

// ═════════════════════════════════════════════════════════════════════════════
// Lectures dérivées — d'un pourcentage à un temps
//
// « +83 % de régénération » ne dit rien au joueur. « une boussole toutes les
// 15 min, 9 en stock, jauge pleine en 2 h 17 » répond à sa question.
//
// La traduction demande la régénération NUE de la ressource — son plafond et sa
// cadence sans aucun bâtiment — qui vit dans `BUILDING_EXTRACT`. C'est la seule
// dépendance de donnée de ce module, et elle n'entre que dans cette section :
// `combineBonuses` reste utilisable sans elle.
// ═════════════════════════════════════════════════════════════════════════════

/**
 * ⚠️ CE QUE CETTE SECTION NE COUVRE PAS : les temps de recrutement.
 *
 * Le `recruitment_time_reduction` cumulé se lit bien en pourcentage, mais le
 * traduire en minutes demanderait le temps de base de CHAQUE type d'unité — une
 * donnée qu'aucune extraction du projet ne porte aujourd'hui (il faudrait
 * extraire les unités). Afficher un temps à partir d'une base inventée serait
 * pire que de n'afficher que le pourcentage.
 */
const REGENERATION_TYPES = {
  speed: "regeneration_speed",
  cap: "regeneration_cap",
} as const;

/** Ce qu'une jauge donne, une fois le cumul appliqué à sa base. */
export interface RegenerationReadout {
  /** Clé de ressource du game design, ex. `treasure_hunt_attempt`. */
  resource: string;
  /** Le plafond nu, sans aucun bâtiment. */
  baseCap: number;
  /** La cadence nue, en secondes par unité. */
  basePeriodSeconds: number;
  /** Le bonus de vitesse cumulé, en ratio. `0` si personne n'en porte. */
  speedBonus: number;
  /**
   * Le plafond effectif : le plus haut entre la base et ce que les bâtiments
   * posent — jamais leur somme, voir la règle `max` de `CombinationRule`.
   */
  cap: number;
  /** Secondes par unité, une fois le bonus appliqué. `0` quand c'est instantané. */
  secondsPerUnit: number;
  /** Le bonus atteint ou dépasse 100 % : la jauge se remplit sans attendre. */
  instant: boolean;
  /** Secondes pour remplir la jauge à partir de vide. */
  secondsToFill: number;
}

/**
 * Les jauges concernées par un cumul, et ce qu'elles donnent.
 *
 * Une ressource n'apparaît que si AU MOINS un bonus du cumul la vise : un thème
 * qui ne touche aucune jauge ne rend aucune lecture, plutôt que trois lignes
 * inertes récitant les bases du jeu.
 *
 * ⚠️ LE BONUS DE VITESSE EST BORNÉ À 100 %, PAS AU-DELÀ. Le temps ne devient pas
 * négatif : à 110 % la jauge est instantanée, exactement comme à 100 %. C'est ce
 * que fait le tableur communautaire (`IF(90*(1-total)<=0, "INSTANTANÉ", …)`), et
 * la seule lecture qui ne produise pas d'absurdité à l'écran.
 *
 * ⚠️ `instant` est porté À PART plutôt que déduit d'un `secondsPerUnit === 0` par
 * l'appelant : le zéro est une valeur légitime de durée, et l'affichage doit
 * pouvoir dire « INSTANT » sans avoir à reconnaître un cas particulier.
 */
export function regenerationReadouts(lines: CombinationLine[]): RegenerationReadout[] {
  const bases = new Map(REGENERATING_RESOURCES.map((entry) => [entry.id, entry]));
  const speeds = new Map<string, number>();
  const caps = new Map<string, number>();

  for (const line of lines) {
    const resource = line.sample.resources[0];
    if (resource === undefined || line.total === null) continue;
    if (line.sample.type === REGENERATION_TYPES.speed) speeds.set(resource, line.total);
    if (line.sample.type === REGENERATION_TYPES.cap) caps.set(resource, line.total);
  }

  const touched = [...new Set([...speeds.keys(), ...caps.keys()])];
  const readouts: RegenerationReadout[] = [];
  for (const resource of touched) {
    const base = bases.get(resource);
    // Une ressource régénérée que l'extraction ne connaît pas : on n'invente ni
    // plafond ni cadence, on n'affiche pas de temps. Le pourcentage reste
    // visible dans le tableau de cumul, lui.
    if (base === undefined) continue;

    const speedBonus = speeds.get(resource) ?? 0;
    const cap = Math.max(base.baseMax, caps.get(resource) ?? 0);
    const remaining = Math.max(0, 1 - speedBonus);
    const secondsPerUnit = base.basePeriodSeconds * remaining;
    readouts.push({
      resource,
      baseCap: base.baseMax,
      basePeriodSeconds: base.basePeriodSeconds,
      speedBonus,
      cap,
      secondsPerUnit,
      instant: remaining === 0,
      secondsToFill: secondsPerUnit * cap,
    });
  }
  return readouts;
}

// ═════════════════════════════════════════════════════════════════════════════
// Optimiseur — la répartition la moins chère pour atteindre une cible
//
// La vraie question du joueur : « il me manque combien, et où je mets mes
// jetons ? » Elle a un arbitrage réel, parce que les jetons sont une ressource
// PARTAGÉE — ceux dépensés à monter un évolutif ne nourrissent pas le vault,
// et inversement (1 jeton = 1 xp, cf. la convention (c) de `heritage.ts`).
//
// ⚠️ CE QUE L'OPTIMISEUR NE TOUCHE PAS : le rang de gardien. Il change bien la
// moitié « héritage » du total, mais il se paie en POINTS DE RÉPUTATION, pas en
// jetons. Mélanger les deux demanderait un taux de change que rien ne fonde. Le
// rang est donc tenu FIXE, tel que l'appelant l'a posé ; le joueur le fait
// varier lui-même et relance.
// ═════════════════════════════════════════════════════════════════════════════

/** Un porteur, vu par l'optimiseur : ce qu'il coûte, ce qu'il rapporte. */
export interface OptimizerSource {
  id: string;
  name: string;
  kind: CombinationSource["kind"];
  currentLevel: number;
  maxLevel: number;
  /**
   * Jetons pour aller du niveau COURANT à `level`. `0` au niveau courant,
   * `null` si le barème ne dit rien — le niveau est alors écarté du plan.
   */
  costTo: (level: number) => number | null;
  /**
   * Ce que ce porteur apporte à la stat visée, à `level`. `null` quand il n'y
   * contribue pas — compté comme 0, jamais comme un trou.
   */
  contributionAt: (level: number) => number | null;
}

/** Une montée à faire, dans un plan. */
export interface OptimizerStep {
  sourceId: string;
  sourceName: string;
  sourceKind: CombinationSource["kind"];
  fromLevel: number;
  toLevel: number;
  /** Jetons que CETTE montée coûte. */
  tokens: number;
  /** La contribution du porteur avant et après — ce que la montée achète. */
  before: number;
  after: number;
}

export interface OptimizerPlan {
  /** La cible est atteinte. Sinon le plan décrit le MAXIMUM atteignable. */
  reached: boolean;
  /** La valeur obtenue, cumulée selon la règle de la stat. */
  value: number;
  /** La valeur de départ, sans rien monter. */
  currentValue: number;
  /**
   * Total des jetons.
   *
   * ⚠️ UN TOTAL DE COMPTE, PAS DE MONNAIE UNIQUE. Les jetons d'un évolutif lui
   * sont propres — ceux de l'Épave ne montent pas la Forteresse. Seul le vault
   * les accepte tous. Le total dit donc « combien de jetons obtenir en tout »,
   * et le détail par porteur dit lesquels : c'est le détail qui est actionnable.
   */
  totalTokens: number;
  /** Uniquement les porteurs qui montent. Vide si la cible est déjà atteinte. */
  steps: OptimizerStep[];
}

/**
 * Un point de la frontière : ce que coûte une combinaison de niveaux, et ce
 * qu'elle rapporte.
 *
 * ⚠️ LE CHEMIN EST CHAÎNÉ, PAS RECOPIÉ. Ce point portait la liste complète des
 * niveaux retenus, donc une copie de tableau par candidat engendré — des
 * centaines de milliers d'allocations par plan, le premier poste de coût mesuré.
 * `previous` pointe l'indice du point dont il descend dans la frontière du
 * porteur PRÉCÉDENT ; le chemin ne se reconstruit qu'une fois, pour le gagnant.
 */
interface FrontierPoint {
  cost: number;
  gain: number;
  /** Indice dans la frontière précédente. `-1` sur le point de départ. */
  previous: number;
  /** Le niveau retenu pour CE porteur. */
  level: number;
}

/**
 * ⚠️ GARDE-FOU DE TAILLE. La frontière est élaguée par dominance à chaque
 * porteur, ce qui la garde petite en pratique (coût et gain croissent tous deux
 * avec le niveau). Ce plafond n'existe que pour qu'un thème inattendu — beaucoup
 * de porteurs, des courbes en dents de scie — ne puisse pas faire exploser le
 * calcul dans le navigateur. Il retient les points les MOINS CHERS, donc il ne
 * peut que manquer des plans coûteux, jamais le plan bon marché recherché.
 */
const MAX_FRONTIER = 4000;

/**
 * Élague les points dominés : un point plus cher qui ne rapporte pas plus n'a
 * aucun intérêt. Rend une frontière triée par coût croissant, à gain
 * strictement croissant.
 *
 * ⚠️ ET S'ARRÊTE À LA CIBLE. Un point qui l'atteint déjà rend tout point plus
 * cher inutile : le gain excédentaire ne s'échange contre rien. Comme rester au
 * niveau courant ne coûte rien aux porteurs suivants, ce point survivra jusqu'au
 * bout — le tronquer ici ne peut donc pas écarter le plan optimal. C'est cette
 * troncature qui empêche la frontière de gonfler porteur après porteur.
 */
function prune(points: FrontierPoint[], target: number): FrontierPoint[] {
  const sorted = points.sort((a, b) => a.cost - b.cost || b.gain - a.gain);
  const kept: FrontierPoint[] = [];
  let best = -Infinity;
  for (const point of sorted) {
    if (point.gain <= best) continue;
    kept.push(point);
    best = point.gain;
    if (point.gain >= target) break;
  }
  return kept.length > MAX_FRONTIER ? kept.slice(0, MAX_FRONTIER) : kept;
}

/**
 * Le PLAFOND de la stat : tous les porteurs à leur niveau maximum.
 *
 * ⚠️ CE N'EST PAS UN PLAN, ET C'EST TOUT L'INTÉRÊT. Aucune frontière, aucune
 * répartition : une seule lecture par porteur. Monter un porteur ne fait jamais
 * baisser sa contribution (les courbes du game design sont croissantes), donc
 * le maximum de chacun compose le maximum de l'ensemble — quelle que soit la
 * règle, `sum` comme `max`.
 *
 * Sert à BORNER LA CIBLE plutôt qu'à la satisfaire : au-dessus de ce plafond,
 * aucun plan n'existe et il est inutile de le chercher — c'est précisément le
 * cas qui faisait balayer les 99 rangs de gardien pour rien. L'appelant passe
 * donc le multiplicateur du rang MAXIMUM : le plafond doit tenir compte de tout
 * ce que le joueur peut encore obtenir, gardien compris.
 *
 * `null` quand la stat ne se cumule pas (`none`) ou qu'aucun porteur ne la
 * chiffre à son niveau max — il n'y a alors pas de borne à proposer.
 */
export function maxReachableValue(
  sources: OptimizerSource[],
  rule: CombinationRule,
): number | null {
  if (rule === "none" || sources.length === 0) return null;
  const values = sources
    .map((source) => source.contributionAt(source.maxLevel))
    .filter((value): value is number => value !== null);
  if (values.length === 0) return null;
  return combineValues(rule, values);
}

/**
 * Le plan le MOINS CHER qui atteint `target` sur une stat.
 *
 * ⚠️ EXACT, PAS UNE HEURISTIQUE. Un glouton « le meilleur gain par jeton
 * d'abord » se trompe ici : les barèmes ne sont pas linéaires (un palier de
 * vault coûte 10 jetons au niveau 1 et 230 au niveau 59), et un porteur peut
 * n'être rentable qu'à partir d'un certain niveau — l'effet de vault qui
 * débloque la stat visée au niveau 4, par exemple, ne rapporte rien avant. La
 * frontière de Pareto examine toutes les répartitions et n'en retient que les
 * non-dominées, ce qui donne l'optimum sans les énumérer toutes.
 *
 * `rule` doit être `sum` ou `max` — une stat `none` (la portée de culture) n'a
 * pas de cible qui ait un sens, et rend un plan « déjà atteint » à 0.
 */
export function planForTarget(
  sources: OptimizerSource[],
  rule: CombinationRule,
  target: number,
): OptimizerPlan {
  const combineTwo = (a: number, b: number) => (rule === "max" ? Math.max(a, b) : a + b);
  const contribution = (source: OptimizerSource, level: number) =>
    source.contributionAt(level) ?? 0;

  const currentValue = sources.reduce(
    (total, source) => combineTwo(total, contribution(source, source.currentLevel)),
    0,
  );

  if (rule === "none" || currentValue >= target) {
    return {
      reached: currentValue >= target,
      value: currentValue,
      currentValue,
      totalTokens: 0,
      steps: [],
    };
  }

  // Les niveaux chiffrables de chaque porteur, lus UNE fois : les mêmes options
  // resservent à chaque étape, et `contributionAt` peut coûter une résolution
  // complète de bâtiment.
  const optionsBySource = sources.map((source) => {
    const options: { cost: number; gain: number; level: number }[] = [];
    for (let level = source.currentLevel; level <= source.maxLevel; level += 1) {
      const cost = source.costTo(level);
      // Un niveau que le barème ne sait pas chiffrer n'entre pas dans un plan :
      // on ne propose pas une montée dont on ignore le prix.
      if (cost === null) continue;
      options.push({ cost, gain: contribution(source, level), level });
    }
    // Un porteur sans aucun niveau chiffrable reste à son niveau courant.
    if (options.length === 0) {
      options.push({ cost: 0, gain: contribution(source, source.currentLevel), level: source.currentLevel });
    }
    return options;
  });

  // Ce que les porteurs restants peuvent encore apporter, au mieux. Sert de
  // BORNE : un point qui n'atteindrait pas la cible même en maxant tout ce qui
  // suit ne mène nulle part, et n'a pas à être exploré.
  const bestRemaining: number[] = new Array(sources.length + 1).fill(0);
  for (let i = sources.length - 1; i >= 0; i -= 1) {
    const best = optionsBySource[i].reduce((max, option) => Math.max(max, option.gain), 0);
    bestRemaining[i] = combineTwo(best, bestRemaining[i + 1]);
  }

  // ⚠️ VISER LE PLAFOND QUAND LA CIBLE EST HORS DE PORTÉE. Le plan rendu est
  // alors « le moins cher qui va le plus loin » — même réponse qu'avant, mais
  // les bornes ci-dessus restent utilisables, au lieu de tout élaguer.
  const effectiveTarget = Math.min(target, bestRemaining[0]);
  // Les sommes de flottants (des pourcentages, le plus souvent) ne retombent pas
  // au bit près sur la cible : sans cette tolérance, une borne juste écarterait
  // le seul chemin qui atteint exactement le plafond.
  const epsilon = Math.abs(effectiveTarget) * 1e-9;

  // Une frontière par étape : c'est ce qui permet de remonter le chemin du
  // gagnant sans que chaque point ne porte sa propre copie des niveaux.
  const stages: FrontierPoint[][] = [[{ cost: 0, gain: 0, previous: -1, level: 0 }]];
  for (let i = 0; i < sources.length; i += 1) {
    const options = optionsBySource[i];
    const bound = bestRemaining[i + 1];
    const previousFrontier = stages[i];
    const next: FrontierPoint[] = [];
    for (let p = 0; p < previousFrontier.length; p += 1) {
      const point = previousFrontier[p];
      for (const option of options) {
        const gain = combineTwo(point.gain, option.gain);
        if (combineTwo(gain, bound) < effectiveTarget - epsilon) continue;
        next.push({ cost: point.cost + option.cost, gain, previous: p, level: option.level });
      }
    }
    stages.push(prune(next, effectiveTarget));
  }

  const frontier = stages[stages.length - 1];
  // La frontière est triée par coût croissant : le PREMIER point qui atteint la
  // cible est le moins cher qui l'atteigne.
  const winner =
    frontier.find((point) => point.gain >= target) ?? frontier[frontier.length - 1];

  // Le chemin du gagnant, remonté d'étape en étape (cf. `FrontierPoint`).
  const levels: number[] = new Array(sources.length).fill(-1);
  let node = winner;
  for (let i = sources.length - 1; i >= 0 && node !== undefined && node.previous >= 0; i -= 1) {
    levels[i] = node.level;
    node = stages[i][node.previous];
  }

  const steps: OptimizerStep[] = [];
  sources.forEach((source, index) => {
    const level = levels[index] === -1 ? source.currentLevel : levels[index];
    if (level === source.currentLevel) return;
    steps.push({
      sourceId: source.id,
      sourceName: source.name,
      sourceKind: source.kind,
      fromLevel: source.currentLevel,
      toLevel: level,
      tokens: source.costTo(level) ?? 0,
      before: contribution(source, source.currentLevel),
      after: contribution(source, level),
    });
  });

  return {
    reached: winner.gain >= target,
    value: winner.gain,
    currentValue,
    totalTokens: winner.cost,
    steps,
  };
}

// ─── L'arbitrage réputation / jetons ────────────────────────────────────────

/**
 * Le rang de gardien, vu par l'optimiseur.
 *
 * ⚠️ UNE SECONDE MONNAIE, PAS UN SECOND PORTEUR. Le gardien ne contribue pas à
 * la stat : il MULTIPLIE ce que le vault apporte (convention (b) de
 * `heritage.ts`). Et il se paie en points de réputation, que rien ne convertit
 * en jetons.
 *
 * D'où le refus de le mêler à `planForTarget` : additionner un coût en jetons et
 * un coût en réputation demanderait un taux de change que le jeu ne déclare pas,
 * et le total obtenu ne voudrait rien dire. Ce que le joueur peut lire, en
 * revanche, c'est l'ÉCHANGE — « en montant le gardien de 14 rangs, tu économises
 * 800 jetons » — et c'est ce que `planAcrossKeeper` rend.
 */
export interface KeeperAxis {
  currentLevel: number;
  maxLevel: number;
  /** Points de réputation pour aller du rang courant à `level`. */
  costTo: (level: number) => number;
  /** Le multiplicateur d'amplification à ce rang. */
  multiplierAt: (level: number) => number;
}

/** Un plan, et ce qu'il coûte dans les DEUX monnaies. */
export interface KeeperTradeOff {
  keeperLevel: number;
  /** Points de réputation à gagner depuis le rang courant. `0` si inchangé. */
  reputation: number;
  plan: OptimizerPlan;
}

/**
 * L'échange « réputation contre jetons », rang de gardien par rang de gardien.
 *
 * Pour chaque rang candidat, on calcule le plan en jetons le moins cher qui
 * atteint la cible — le rang change ce que le vault apporte à niveau égal, donc
 * il change le plan. On ne garde ensuite que les options NON DOMINÉES : une
 * option qui coûte plus de réputation ET plus de jetons qu'une autre n'a aucun
 * intérêt.
 *
 * Le résultat se lit comme une courbe d'échange, du rang courant vers le haut :
 * plus on monte le gardien, moins il faut de jetons. Le joueur choisit son point
 * sur la courbe — c'est à lui de savoir laquelle de ses deux ressources est la
 * plus rare, et cette question-là ne se calcule pas.
 *
 * ⚠️ `buildSources` est rappelé POUR CHAQUE RANG : c'est lui qui applique le
 * multiplicateur aux contributions du vault, via `amplifyBonusValue` — la règle
 * d'amplification n'est jamais recopiée ici.
 *
 * ⚠️ LA PREMIÈRE OPTION EST TOUJOURS LE RANG COURANT, qu'elle atteigne la cible
 * ou non — c'est le contrat sur lequel l'appelant s'appuie pour dire « ce plan
 * ne touche pas à ton gardien ». Les suivantes sont l'échange proposé.
 */
export function planAcrossKeeper(
  buildSources: (multiplier: number) => OptimizerSource[],
  rule: CombinationRule,
  target: number,
  keeper: KeeperAxis,
): KeeperTradeOff[] {
  const options: KeeperTradeOff[] = [];
  for (let level = keeper.currentLevel; level <= keeper.maxLevel; level += 1) {
    const plan = planForTarget(
      buildSources(keeper.multiplierAt(level)),
      rule,
      target,
    );
    options.push({ keeperLevel: level, reputation: keeper.costTo(level), plan });
    // Inutile de monter le gardien plus haut une fois la cible atteinte sans
    // AUCUN jeton : rien de moins cher ne peut suivre.
    if (plan.reached && plan.totalTokens === 0) break;
  }

  // ⚠️ LE RANG COURANT EST TOUJOURS EN TÊTE, ATTEINT OU NON. C'est le plan « sans
  // toucher au gardien », et l'appelant l'affiche comme tel. L'écarter parce
  // qu'il n'atteint pas la cible faisait remonter en première position le plan
  // d'un rang que le joueur N'A PAS : le panneau annonçait alors un coût en
  // jetons calculé sur un amplificateur imaginaire, sous une phrase disant
  // « This plan keeps your keeper rank as it is ».
  const kept: KeeperTradeOff[] = [options[0]];
  // Non-dominées : la réputation croît avec le rang, on ne garde donc un rang
  // que s'il fait strictement baisser les jetons — et il doit atteindre la
  // cible, sinon il n'échange rien du tout. Tant que le rang courant échoue,
  // le premier rang qui réussit est un gain quel que soit son prix en jetons.
  let cheapest = options[0].plan.reached ? options[0].plan.totalTokens : Infinity;
  for (const option of options.slice(1)) {
    if (!option.plan.reached) continue;
    if (option.plan.totalTokens >= cheapest) continue;
    kept.push(option);
    cheapest = option.plan.totalTokens;
  }
  return kept;
}
