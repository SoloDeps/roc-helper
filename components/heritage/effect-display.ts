// ============================================================
// Présentation d'un bonus de Heritage Vault : icône, libellé, valeur.
//
// Couche UI pure — aucune formule ici. Le libellé vient de `getBonusLabel`, le
// formatage de `formatBonusValue`, la valeur de `ResolvedHeritageBonus` : ce
// module ne fait que CHOISIR l'icône et assembler la chaîne affichée.
//
// ⚠️ ÉCHELLE DES POURCENTAGES. `ResolvedHeritageBonus.value` est un RATIO
// (0,194), convention du domaine Bâtiments reprise à l'identique par le
// Heritage Vault. `formatBonusValue("percent", …)` attend des POINTS de
// pourcentage. La conversion ×100 vit ici, au seul endroit qui affiche — la
// faire dans le resolver changerait l'unité stockée pour tous les domaines.
// ============================================================

import { resolveIconPath } from "@/components/wonders/stats-badge";
import { ERAS } from "@/data/config";
import { imagesUrl } from "@/lib/catalog";
import { GOOD_META_BY_KEY } from "@/lib/constants";
import { getHeritageWikiImageUrlByName } from "@/lib/heritage-images";
import {
  formatDuration,
  getGoodNameFromPriorityEra,
  getInventoryItemIconLocal,
  getItemIconLocal,
  getUnitIconLocal,
} from "@/lib/utils";
import { formatBonusValue } from "@/resolvers/bonus";
import {
  resolveChestRewards,
  type ResolvedChestReward,
  type ResolvedHeritageBonus,
  type ResolvedHeritageEffect,
} from "@/resolvers/heritage";
import type { EraCode } from "@/types/shared";

/**
 * Ce que l'affichage a besoin de savoir d'un bonus.
 *
 * `amplified` est propre au Heritage Vault (rang de gardien) : un bonus de
 * bâtiment évolutif n'en a pas, et c'est le seul écart entre les deux formes.
 */
export type DisplayableBonus = Omit<ResolvedHeritageBonus, "amplified"> & {
  amplified?: number | null;
};

export interface HeritageBonusDisplay {
  src: string;
  /** Icône secondaire, coin bas-droit. Précise SUR QUOI porte le boost. */
  overlaySrc: string | null;
  label: string;
  /** Valeur formatée, prête à afficher. « — » quand le jeu ne dit rien. */
  value: string;
  /** Période du cycle de production, ex. « / 1d ». `null` hors production. */
  detail: string | null;
}

const UNIT_ICONS: Record<string, string> = {
  infantry: "icon_unit_infantry",
  heavyInfantry: "icon_unit_heavyinfantry",
  ranged: "icon_unit_ranged",
  cavalry: "icon_unit_cavalry",
  siege: "icon_unit_siege",
};

/** Le suffixe du `type` nomme la stat visée — c'est lui qui choisit l'overlay. */
const STAT_OVERLAYS: [suffix: string, iconKey: string][] = [
  ["_critical_hit_damage", "icon_unitstat_criticalhitdamage"],
  ["_critical_hit_chance", "icon_unitstat_criticalhitchance"],
  ["_critical_hit_boost", "icon_unitstat_criticalhitchance"],
  ["_hit_rate", "icon_unitstat_hitrate"],
  ["_damage", "icon_unitstat_damage"],
  ["_hp", "icon_unitstat_hitpoints"],
  ["_cap", "icon_arrow_boost"],
];

/**
 * `primary_ba`, `tertiary_cg`… — un RANG de bien, pas un bien. Le suffixe
 * d'ère est OPTIONNEL : les bâtiments évolutifs dont une même courbe couvre
 * plusieurs ères d'un coup (« RomanEmpireAndLater » du Celtic Broch, par ex.)
 * écrivent le rang NU (`secondary`), sans dire laquelle — c'est l'ère de
 * l'INSTANCE (`contextEra`, ci-dessous) qui tranche alors, pas la ressource.
 */
const GOOD_RANK = /^(primary|secondary|tertiary)(?:_([a-z]{2}))?$/;

/**
 * Le bien concret désigné par un RANG (`primary_ba`, ou `primary` NU), résolu
 * depuis le classement d'ateliers du joueur. `null` pour une ressource qui
 * n'est pas un rang, ou pour un rang que le joueur n'a pas classé.
 *
 * ⚠️ `contextEra` NE SERT QUE POUR LES RANGS NUS. Un rang déjà suffixé
 * (`secondary_cg`) garde SA propre ère : c'est celle du palier de courbe où le
 * game design l'a écrite, pas celle de l'instance qui l'affiche — un bâtiment
 * dont la courbe date de l'ère Classique reste sur ses biens Classiques même
 * consulté en ère Gothique tardive.
 */
function resolveRankGood(
  resource: string,
  selections: string[][],
  contextEra?: EraCode | null,
): string | null {
  const rank = GOOD_RANK.exec(resource);
  if (rank === null) return null;
  const era = rank[2] ?? contextEra?.toLowerCase();
  if (era === undefined || era === null) return null;
  return getGoodNameFromPriorityEra(rank[1], era, selections);
}

/** Le repli quand un tirage porte des biens sans pouvoir en nommer un seul. */
const GOODS_LABEL = "Goods";

/**
 * L'ÈRE des rangs d'un bonus, quand ils en désignent tous la même.
 *
 * ⚠️ SANS ELLE, DEUX PALIERS DISTINCTS SONT INDISCERNABLES. Le vault celte porte
 * deux productions de biens : l'une sur les rangs byzantins, l'autre sur les
 * rangs romains. Tant que le joueur n'a pas classé ses ateliers, les deux
 * rendent la même icône générique, le même libellé « Goods » et — à certains
 * niveaux — la même valeur : deux cartes rigoureusement identiques dans les
 * emplacements, deux lignes identiques dans le tableau des paliers et dans le
 * cumul, deux entrées identiques dans le sélecteur de stat de l'optimiseur.
 *
 * L'ère est ce qui les sépare, et c'est la seule chose qu'on puisse affirmer
 * sans le classement d'ateliers. `null` dès qu'il n'y a rien à ajouter : aucun
 * rang, plusieurs ères mêlées, ou un rang déjà résolu en bien nommé — dans ce
 * dernier cas c'est le NOM DU BIEN qui distingue, et « Fine Jewelry · BE »
 * n'apprendrait rien de plus.
 */
/** « Goods » + « BE » → « Goods · BE ». Le libellé nu quand il n'y a rien à ajouter. */
function qualifyWithEra(label: string, era: string | null): string {
  return era === null ? label : `${label} · ${era}`;
}

function rankEraLabel(resources: string[], contextEra?: EraCode | null): string | null {
  const eras = new Set<string>();
  for (const resource of resources) {
    const rank = GOOD_RANK.exec(resource);
    if (rank === null) return null;
    const era = rank[2] ?? contextEra?.toLowerCase();
    if (era === undefined || era === null) return null;
    eras.add(era.toUpperCase());
  }
  if (eras.size !== 1) return null;
  const [abbr] = [...eras];
  // Une ère que le catalogue ne connaît pas ne se nomme pas : mieux vaut le
  // libellé nu qu'un sigle inventé.
  return ERAS.some((era) => era.abbr === abbr) ? abbr : null;
}

/**
 * `coins`, `food`, `research_points` ont déjà leur fichier sous
 * `/images/goods/` : seuls les RANGS demandent le classement d'ateliers du
 * joueur pour désigner un bien concret.
 *
 * Un rang que le joueur n'a pas classé retombe sur l'icône générique de bien —
 * `/images/goods/primary_cg.webp` n'existe pas et ne doit pas être demandé.
 */
function resourceIcon(resource: string, good: string | null): string {
  if (GOOD_RANK.test(resource)) return good === null ? imagesUrl.good : getItemIconLocal(good);
  return getItemIconLocal(resource);
}

/**
 * Les overlays de repli : l'icône principale dit SUR QUOI porte le bonus (la
 * boussole, les points de recherche), l'overlay dit CE QU'IL LUI FAIT.
 *
 * `_cap` relève un plafond → la flèche. Les `_cap` de l'extraction sont tous
 * `scope: null`, donc `STAT_OVERLAYS` ne les atteint jamais (il ne joue que dans
 * la branche `unitType`) : sans ce repli, ils ressortent en icône `info` nue.
 *
 * Une vitesse de régénération raccourcit un TEMPS → la pendule, la même que
 * `recruitment_time_reduction`, qui raccourcit un temps lui aussi. C'est ce que
 * le jeu affiche : une boussole surchargée d'une pendule sur la ligne
 * « Accélère le temps de régénération de Tentative de 45,0 % ».
 */
const FALLBACK_OVERLAYS: [matches: (type: string) => boolean, iconKey: string][] = [
  [(type) => type.endsWith("_cap"), "icon_arrow_boost"],
  [
    (type) => type === "regeneration_speed" || type === "research_regen_boost",
    "icon_time_boost",
  ],
];

/**
 * `bonusIconsBase` + les overlays de repli ci-dessus.
 *
 * Ne s'applique que si aucune branche plus spécifique n'a déjà posé un
 * overlay — jamais d'écrasement.
 */
function bonusIcons(
  bonus: DisplayableBonus,
  selections: string[][],
  contextEra?: EraCode | null,
): { src: string; overlaySrc: string | null; good: string | null } {
  const base = bonusIconsBase(bonus, selections, contextEra);
  if (base.overlaySrc !== null) return base;
  const fallback = FALLBACK_OVERLAYS.find(([matches]) => matches(bonus.type));
  if (fallback === undefined) return base;
  return { ...base, overlaySrc: resolveIconPath(fallback[1]) };
}

function bonusIconsBase(
  bonus: DisplayableBonus,
  selections: string[][],
  contextEra?: EraCode | null,
): { src: string; overlaySrc: string | null; good: string | null } {
  const scope = bonus.scope;

  // ⚠️ `unit` avant `unitType` : le Crocodile Aztèque porte les deux (`scope`
  // le distingue précisément pour ça, voir `BuildingBonusScope`) — sa propre
  // icône prime sur celle, générique, de sa classe mécanique (cavalerie).
  if (scope?.kind === "unit") {
    const stat = STAT_OVERLAYS.find(([suffix]) => bonus.type.endsWith(suffix));
    return {
      src: getUnitIconLocal(scope.value),
      overlaySrc: stat === undefined ? null : resolveIconPath(stat[1]),
      good: null,
    };
  }
  if (scope?.kind === "unitType") {
    const unit = UNIT_ICONS[scope.value];
    const stat = STAT_OVERLAYS.find(([suffix]) => bonus.type.endsWith(suffix));
    if (unit !== undefined) {
      return {
        src: resolveIconPath(unit),
        overlaySrc: stat === undefined ? null : resolveIconPath(stat[1]),
        good: null,
      };
    }
  }
  if (bonus.type === "recruitment_time_reduction") {
    return { src: resolveIconPath("icon_unit_general"), overlaySrc: resolveIconPath("icon_time_boost"), good: null };
  }
  if (bonus.type.startsWith("culture_")) {
    return { src: imagesUrl.cultureBoost, overlaySrc: null, good: null };
  }
  if (bonus.type === "worker_slots") {
    return { src: resolveIconPath("capital_worker"), overlaySrc: null, good: null };
  }
  if (scope?.kind === "buildingType" && scope.value in imagesUrl) {
    return {
      src: imagesUrl[scope.value as keyof typeof imagesUrl],
      overlaySrc: null,
      good: null,
    };
  }

  // if (scope?.kind === "buildingType" && scope.value in imagesUrl) {
  //   return {
  //     src: imagesUrl[scope.value as keyof typeof imagesUrl],
  //     overlaySrc: null,
  //     // overlaySrc: resolveIconPath("icon_arrow_boost"),
  //     good: null,
  //   };
  // }

  const resource = bonus.resources[0];
  if (resource !== undefined) {
    const good = resolveRankGood(resource, selections, contextEra);
    return { src: resourceIcon(resource, good), overlaySrc: null, good };
  }

  // ⚠️ APRÈS la branche ressource, jamais avant : un `goods_production` QUI
  // nomme son bien (l'hydromel de la taverne viking) garde l'icône de ce bien.
  // Ne reste ici que le boost de biens qui n'en nomme AUCUN.
  //
  // Ce cas ne concerne PLUS la capitale : `scripts/extract/buildings.ts` y
  // projette désormais un boost de biens en `building_type_production` /
  // `workshop` — la loca du jeu traduit `Base.BuildingTypes.Good` par
  // « Workshops » — et la branche `buildingType` ci-dessus lui donne l'icône de
  // l'atelier, la même qu'au bâtiment d'héritage. C'est ce qui a sorti la Hutte
  // de Baba Yaga du repli `info`.
  //
  // Il reste donc le boost de biens HORS capitale, où « ateliers » serait faux
  // (une cité alliée produit ses biens en mine d'or, papyrus, carrière…). Sans
  // bâtiment à nommer, l'icône générique du bien est ce qu'on peut affirmer —
  // et c'est déjà ce que fait le domaine Wonders, qui écrit `icons: ["good", …]`
  // pour exactement ce composant.
  if (bonus.type === "goods_production") {
    return { src: imagesUrl.good, overlaySrc: null, good: null };
  }

  return { src: imagesUrl.info, overlaySrc: null, good: null };
}

/**
 * ⚠️ RÈGLE MESURÉE — UNE QUANTITÉ DE VAULT S'AFFICHE ARRONDIE VERS LE HAUT.
 *
 * Ce n'est PAS une convention de repli comme (a)/(b)/(c) : c'est un relevé en
 * jeu. Vault Thaï niveau 1, premier effet de production (`goods_output`, base
 * 130 sur toute ère ≥ Byzantine), en ne faisant monter QUE le rang de gardien :
 *
 *   rang            1       2       3       4       5       6
 *   valeur exacte   130,0   131,3   132,6   133,9   135,2   136,5
 *   lu en jeu       130     132     133     134     136     137
 *
 * Trois règles candidates, une seule survit :
 *   - arrondi au plus proche → réfuté par le rang 2 (131,3 rendrait 131) et le
 *     rang 5 (135,2 rendrait 135) ;
 *   - incrément entier par rang → réfuté par le rang 3 (rendrait 134) ;
 *   - arrondi VERS LE HAUT → passe les six relevés.
 *
 * Le taux, lui, est recoupé par la même mesure : en cherchant le `k` de
 * `130 × (1 + k × (rang − 1))` compatible avec les rangs 2, 3 et 4, `Math.round`
 * et `Math.floor` rendent un intervalle VIDE ; `Math.ceil` en laisse un seul,
 * ]0,77 % ; 1,03 %], qui ne contient que le 1 % du script Lua. Le rang 1 rendant
 * la valeur de base NUE, c'est aussi ce qui établit `0,01 × (rang − 1)` — et non
 * `0,01 × rang` — pour la convention (b) du resolver.
 *
 * ⚠️ FAIT D'AFFICHAGE, PAS DE CALCUL. `ResolvedHeritageBonus.amplified` garde la
 * valeur EXACTE (131,3) : c'est elle que lit toute arithmétique — cumul de
 * plusieurs porteurs, comparaison avant/après. Arrondir en amont ferait dériver
 * un total d'une unité par ligne additionnée.
 *
 * ⚠️ PORTÉE : le Heritage Vault SEULEMENT, d'où l'arrondi ici plutôt que dans
 * `formatBonusValue`. Ce formateur est partagé avec les Wonders, les
 * Technologies et les Bâtiments, où rien n'a été mesuré et où l'imposer
 * affirmerait une valeur sans l'avoir vue en jeu. Seule exception connue :
 * `research_points_output`, dont l'extraction (`scripts/extract/buildings.ts`,
 * `flooredFormula`) arrondit déjà VERS LE BAS au-delà du dernier palier
 * tabulé — voir `CHEST_EXPECTED_VALUE_TYPES` ci-dessous.
 *
 * Aucun effet de bord sur les valeurs non amplifiées : les 24 360 valeurs
 * `absolute`/`integer` des 13 vaults sont ENTIÈRES sur les 8 ères jouables
 * (Byzantine → Gothique tardive), l'amplificateur est leur seule source de
 * décimales.
 */
function displayQuantity(value: number): number {
  // ⚠️ `toPrecision(12)` AVANT `ceil`, et plus indispensable encore qu'avec un
  // arrondi au plus proche : le bruit binaire ne coûte un demi-point que dans un
  // sens, mais il coûte une unité ENTIÈRE ici. 1553,0000000000002 — un entier
  // exact passé par une multiplication flottante — monterait à 1554.
  return Math.ceil(Number(value.toPrecision(12)));
}

/**
 * L'échelle d'affichage d'une valeur, selon son format.
 *
 * `percent` passe du RATIO stocké (0,194) aux POINTS qu'attend
 * `formatBonusValue` (19,4) — voir l'en-tête du module. `integer` et `absolute`
 * comptent des unités et suivent la règle mesurée ci-dessus. `flat` ne compte
 * rien de discret et reste tel quel.
 */
function scaleForDisplay(format: DisplayableBonus["format"], raw: number): number {
  if (format === "percent") return raw * 100;
  if (format === "integer" || format === "absolute") return displayQuantity(raw);
  return raw;
}

/**
 * Types dont la courbe peut rendre une VALEUR ATTENDUE de coffre, pas
 * toujours une livraison entière — `research_points_output` en tête.
 *
 * En dessous d'un certain niveau, plusieurs `evolving` ne versent pas un
 * montant fixe de points de recherche mais un COFFRE qui tire au sort entre
 * plusieurs montants (Celtic Broch, palier 4 : 80 % de chances de 1 PR, 20 %
 * de 2 PR) : `resolveEvolvingBuilding` y rend directement l'ESPÉRANCE du
 * tirage (`scripts/extract/buildings.ts`, `expectedChestValue`) — 1,2 dans cet
 * exemple, jamais livré en un coup, mais la moyenne sur beaucoup de tirages.
 * C'est la présentation du wiki (riseofcultures.wiki.gg) pour ces mêmes
 * paliers, vérifiée palier par palier contre `source/gamedesign.json`.
 *
 * Au-delà de ce palier, le coffre se transforme en un montant RÉEL et FIXE :
 * l'extraction (`flooredFormula`) arrondit alors déjà vers le bas — la valeur
 * qui arrive ici est une quantité entière (5, 6, 7…), jamais une décimale.
 * `Math.ceil`/`Math.round` (`displayQuantity`, format `absolute`) n'ont donc
 * plus rien à corriger à ce stade ; ce cas reste néanmoins hors de leur
 * chemin, pour ne jamais dépendre de leur convention (mesurée pour le seul
 * Heritage Vault, cf. sa doc) sur un domaine où elle n'a pas été vérifiée.
 *
 * Rien à amplifier ici : ces bâtiments n'ont pas de gardien, `raw` reste
 * `bonus.value` quel que soit `amplified`.
 */
const CHEST_EXPECTED_VALUE_TYPES = new Set(["research_points_output"]);

/**
 * Ce qu'une carte d'effet affiche pour un bonus.
 *
 * `amplified` demande la valeur amplifiée par le rang de gardien (convention
 * (b) du resolver) plutôt que la valeur nue.
 *
 * `contextEra` ne sert qu'aux RANGS NUS d'un bâtiment évolutif (`secondary`
 * sans suffixe, cf. `GOOD_RANK`) : sans elle un tel rang ne peut pas se
 * résoudre en bien concret et retombe sur l'icône générique — c'est
 * l'appelant qui la connaît (l'ère choisie sur la carte), jamais le bonus
 * lui-même. Sans effet sur le Heritage Vault, dont tous les rangs sont déjà
 * suffixés à l'extraction.
 */
export function describeHeritageBonus(
  bonus: DisplayableBonus,
  selections: string[][],
  amplified = false,
  contextEra?: EraCode | null,
): HeritageBonusDisplay {
  const raw = amplified ? (bonus.amplified ?? bonus.value) : bonus.value;
  const { src, overlaySrc, good } = bonusIcons(bonus, selections, contextEra);
  // ⚠️ Rang non résolu : l'ère qualifie le libellé, sans quoi deux paliers de
  // biens du même vault sont indiscernables (cf. `rankEraLabel`).
  const label =
    good === null
      ? qualifyWithEra(bonus.label, rankEraLabel(bonus.resources, contextEra))
      : (GOOD_META_BY_KEY[good]?.name ?? good);
  const detail =
    bonus.periodSeconds === null ? null : `/ ${formatDuration(bonus.periodSeconds)}`;

  if (CHEST_EXPECTED_VALUE_TYPES.has(bonus.type)) {
    return {
      src,
      overlaySrc,
      label,
      value: raw === null ? "—" : raw.toLocaleString("fr-FR", { maximumFractionDigits: 2 }),
      detail,
    };
  }

  const scaled = raw === null ? null : scaleForDisplay(bonus.format, raw);
  return {
    src,
    overlaySrc,
    // ⚠️ `resolveRankGood` rend une CLÉ (`fine_jewelry`), pas un libellé : sans
    // `GOOD_META_BY_KEY`, un bonus écrit en RANG de bien s'affiche avec la clé
    // technique soulignée (« fine_jewelry » dans la liste des paliers) au lieu
    // du nom du bien (« Fine Jewelry »). Même dernier pas que
    // `chestRewardLabel`, qui le faisait déjà de son côté.
    label,
    value: scaled === null ? "—" : formatBonusValue(bonus.format, scaled),
    detail,
  };
}

/**
 * `culture_points` et `culture_range` : UNE ligne combinée, pas deux.
 *
 * L'extraction (`scripts/extract/heritage.ts`, cas `CultureComponentDTO`)
 * projette délibérément deux `BuildingBonus` distincts — c'est correct, ce
 * sont deux données séparées (`BONUS_LABELS`). Mais affichées bonus-par-bonus,
 * elles produisent deux lignes/cartes pour un seul effet de culture. Ce
 * module les recombine ICI, à l'affichage uniquement : `null` quand l'un des
 * deux manque (effet hors norme), pour retomber sur le rendu générique.
 *
 * La portée n'est PAS passée par `formatBonusValue` : son "+1" convient à un
 * gain, pas à une dimension ("+1x+1" n'a aucun sens pour une portée).
 */
export function describeCultureEffect(
  bonuses: DisplayableBonus[],
  selections: string[][],
  amplified = false,
): HeritageBonusDisplay | null {
  const points = bonuses.find((bonus) => bonus.type === "culture_points");
  const range = bonuses.find((bonus) => bonus.type === "culture_range");
  if (points === undefined || range === undefined) return null;

  const pointsDisplay = describeHeritageBonus(points, selections, amplified);
  const pointsRaw = amplified ? (points.amplified ?? points.value) : points.value;
  const rangeRaw = amplified ? (range.amplified ?? range.value) : range.value;
  // ⚠️ ARRONDI — ni les points ni la portée ne passent par `formatBonusValue`
  // (voir juste en dessous pour les points ; le « + » n'a de toute façon aucun
  // sens sur une dimension), mais les deux comptent des unités DISCRÈTES :
  // jamais « 3.4499999999999997 ». Même règle mesurée que le reste du vault,
  // d'où `displayQuantity` plutôt qu'un arrondi maison — les points de culture
  // sont amplifiés par le gardien (la portée, elle, en est exemptée et reste
  // entière de toute façon).
  const quantity = (raw: number | null) =>
    raw === null ? "—" : `${displayQuantity(raw)}`;
  const rangeLabel = quantity(rangeRaw);
  // ⚠️ PAS DE « + » SUR LA CULTURE. Le jeu écrit « 496 (1x1) » : le nombre de
  // points de culture est un TOTAL apporté par le bâtiment, pas un delta à
  // ajouter à un compteur — contrairement aux boosts, où le signe porte du
  // sens. D'où l'arrondi refait ici plutôt que la valeur de
  // `describeHeritageBonus`, qui passe par `formatBonusValue("integer", …)` et
  // préfixe le signe.
  const combined = `${quantity(pointsRaw)} (${rangeLabel}x${rangeLabel})`;

  // ⚠️ `label` NOMME l'effet, `value` le CHIFFRE. Les deux portaient la même
  // chaîne combinée : partout où un libellé est attendu — la colonne de gauche
  // du tableau avant/après, son popover sur écran étroit — la ligne s'annonçait
  // « +2040 (4x4) · (4x4) », le chiffre répété en guise de nom. La portée reste
  // dans `value`, où elle qualifie le gain ; `detail` la répéterait une
  // troisième fois, d'où `null` (il ne porte une période que pour une
  // production, cf. `describeHeritageBonus`).
  return {
    src: pointsDisplay.src,
    overlaySrc: pointsDisplay.overlaySrc,
    label: "Culture",
    value: combined,
    detail: null,
  };
}

/**
 * Un effet SANS bonus nommable — il ne verse qu'un coffre
 * (`ProductionComponentDTO.finish.rewards`, cf. `HeritageEffectExtract`).
 * `describeHeritageBonus` ne sait lire que `bonuses[]` : sans ce repli, une
 * telle carte (sélecteur d'effet, slot équipé, résumé Appliqué/Non appliqué)
 * s'affiche entièrement VIDE — aucune icône, aucun texte — alors que la
 * donnée existe bel et bien (`effect.rewards`). Même repli que
 * `overview-table.tsx`, qui l'utilise déjà pour sa ligne « Chest reward ».
 *
 * `effect.rewards` est déjà le PALIER au niveau courant du vault (résolu par
 * `resolveHeritageVault`) : `vaultLevel` ne sert plus qu'à `resolveChestRewards`
 * pour lire les courbes de montant de ses feuilles, jamais à re-choisir un
 * palier.
 */
export function describeChestEffect(
  effect: ResolvedHeritageEffect,
  vaultLevel: number,
  era: EraCode,
  selections: string[][],
): HeritageBonusDisplay | null {
  if (effect.rewards === null) return null;
  const [reward] = resolveChestRewards(effect.rewards, vaultLevel, era);
  // ⚠️ SEULE EXCEPTION SUR 65 RACINES — le Crocodile Aztèque (`Heritage_
  // Aztec_Effect_1`) n'emballe rien : sa racine est directement `kind:
  // "unit"`, pas un `group`/`mysteryChest`/`lootContainer`. Ce n'est PAS un
  // coffre — le jeu affiche le nom de l'unité débloquée ("Aztec Crocodile"),
  // jamais « Chest reward » ni un compte de coffres.
  if (reward !== undefined && !isChestReward(reward)) {
    const label = chestRewardLabel(reward, selections);
    return {
      src: chestRewardIcon(reward, selections),
      overlaySrc: null,
      label,
      value: label,
      detail: null,
    };
  }
  return {
    src: reward === undefined ? resolveIconPath("chest_good") : chestRewardIcon(reward, selections),
    overlaySrc: null,
    // « Chest reward » pour 9 des 10 coffres Heritage — le Celtic est un
    // TICKET, pas un coffre (cf. `chestRootLabel`/`TICKET_LABEL_BY_FAMILY`).
    label: reward === undefined ? "Chest reward" : chestRootLabel(reward),
    // Le nombre de COFFRES/TICKETS versés, pas un montant à l'intérieur —
    // chaque palier n'a jamais qu'UNE seule racine de tirage (vérifié sur les
    // 65 paliers à coffre de l'extraction, aucune exception) : un par
    // collecte, toujours.
    value: "1",
    detail: null,
  };
}

/**
 * ⚠️ ICÔNE DE COFFRE — PAR ID DE FAMILLE, PAS PAR FORME DEVINÉE.
 *
 * Ancienne approche abandonnée : classer un conteneur (`group`/`mysteryChest`/
 * `lootContainer`) dans une des 4 « familles » génériques déduites de sa forme
 * (tirage pondéré, lot garanti, biens d'ère précédente/courante), puis pointer
 * vers un fichier `/images/chests/chest_<famille>.webp`. Les captures fournies
 * par l'utilisateur montrent que le jeu a en réalité **un visuel par coffre
 * précis** (10 coffres Heritage, ~8 visuels distincts) — parfois partagé entre
 * deux effets qui tirent la même chose (Aztec/Halloween), parfois identique
 * pour deux paliers d'un même effet qui ne se distinguent QUE par leur DTO
 * (ATH : PEGoods et CEGoods rendent tous deux le coffre « ? » générique en
 * jeu). Une forme ne suffit donc pas à deviner le bon fichier : on associe
 * chaque coffre à son icône par la FAMILLE de son id (`HeritageRewardNode.id`,
 * les `_<N>_Id` numérotant les paliers successifs d'un même effet retirés).
 *
 * Confiance par entrée : ✅ relevée en jeu par l'utilisateur, 🟡 déduite du nom
 * du fichier faute de relevé. Une entrée ✅ ne se change que sur un nouveau
 * relevé, jamais sur un raisonnement de nommage.
 *
 * ⚠️ UNE FAMILLE = UNE ICÔNE, PARTOUT. Un même coffre réemployé à deux endroits
 * (`Reward_AllAge_CollectorBuildings` est le coffre du vault Japan ET une ligne
 * du tirage Thai) n'a qu'un visuel : la table est indexée par l'IDENTITÉ du
 * coffre, pas par l'endroit où il apparaît. Deux visuels pour une même famille
 * demanderaient de passer le contexte (vault, effet) jusqu'ici — décision prise
 * de ne pas le faire tant qu'aucun coffre n'en a besoin.
 */
const CHEST_ICON_BY_FAMILY: Record<string, string> = {
  // Celtic — RandomRefillBarracks. ✅ un TICKET, pas un coffre — d'où
  // /images/inventory/, pas /images/chests/.
  Reward_AllAge_RandomRefillBarracks: "/images/inventory/icon_inventoryitem_randomrefill_reward.webp",
  // Mongol — MongolianFeast (pièces + nourriture garanties). ✅
  Reward_Evo_MongolianFeast_Coins_Food: "/images/chests/icon_chest_coins_food.webp",
  // Mali Empire — Madrasa RP + personnalisation. ✅
  Reward_Evo_Madrasa_RP_and_Customization_Chest: "/images/chests/icon_chest_rp_customization.webp",
  // Mali Empire — Madrasa nourriture + recharge de caserne. 🟡 nom de fichier.
  Reward_Evo_Madrasa_Food_and_BarracksRefill_Chest: "/images/chests/icon_chest_food_refillbarracks.webp",
  // World Fair — Exhibition. ✅ le coffre « joker », pas le coffre « biens de
  // l'ère précédente » que son contenu laissait supposer.
  Reward_Evo_Exhibition_Negotiation_PEGoods_Coins_Chest: "/images/chests/icon_chest_joker_goods.webp",
  // Aztec + Halloween — même coffre réemployé tel quel. ✅ le générique « ? ».
  Reward_HeritageVault_Goods_RandomRefill_SelectionRefill_Chest: "/images/chests/icon_mystery_chest.webp",
  // Le lot de biens GARANTI posé dans ce coffre Aztec/Halloween — une ligne du
  // tirage, pas le coffre lui-même. ✅
  Reward_Dac_Reference_Evo_GoodsEach_300_S: "/images/chests/icon_chest_good2_1.webp",
  // Thai — ShrineOfReflection nourriture + pièce de puzzle. ✅
  Reward_Evo_ShrineOfReflection_Food_and_PuzzlePiece_Chest: "/images/chests/icon_chest_food_puzzlepieces.webp",
  // ATH — biens d'ère précédente ET courante, même visuel aux deux paliers. ✅
  Reward_HeritageVault_RandomPEGoods: "/images/chests/icon_chest_good.webp",
  Reward_HeritageVault_RandomCEGoods: "/images/chests/icon_chest_good.webp",
  // Polynesian — DrumTower (soin + biens secondaires + nourriture). 🟡 pari :
  // aucun relevé reçu, coffre doré choisi par élimination des visuels restants.
  Reward_Evo_DrumTower_Heal_SecGoods_Food_Chest: "/images/chests/icon_mystery_chest_gold.webp",
  // CollectorBuildings — le coffre de PIÈCES de collection. ✅ Vaut pour ses
  // deux emplois : le coffre du vault Japan, et la ligne « pièces » du tirage
  // Thai (cf. la note « une famille = une icône » ci-dessus).
  Reward_AllAge_CollectorBuildings: "/images/chests/icon_chest_puzzlepieces.webp",
};

/**
 * L'icône d'une récompense NOMMÉE par son `definitionId`, quand ce n'est ni un
 * conteneur (`CHEST_ICON_BY_FAMILY`) ni une ressource qui a son propre visuel.
 *
 * Le seul cas à ce jour : le lot « biens de l'ère précédente » du coffre World
 * Fair. Sa donnée porte les TROIS rangs de biens de l'ère (`primary_hm`…), donc
 * l'icône générique de bien par la règle multi-rangs — mais le jeu y montre un
 * coffre « ? ». Une exception relevée en jeu, pas une règle déductible.
 */
const CHEST_ICON_BY_DEFINITION: Record<string, string> = {
  Dac_Reward_Event_WorldFair_Evolving_Exhibition_1_PreviousEraGoods:
    "/images/chests/icon_mystery_chest.webp",
};

/**
 * ⚠️ UNE PIÈCE DE BÂTIMENT N'EST PAS UN BIEN.
 *
 * `BuildingPiece|Building_BronzeAge_Collectable_School_1` sort avec
 * `kind: "resource"` mais `resources` VIDE : il ne tombe donc pas dans la
 * branche `resourceIcon` et finissait sur `getItemIconLocal`, c'est-à-dire
 * `/images/goods/<slug>.webp` — un fichier qui n'existe pour aucune des 6
 * pièces (Japan et Thai), donc `default.webp` pour toutes. Le jeu, lui,
 * n'a qu'UN visuel de pièce de puzzle, quel que soit le bâtiment
 * collectionnable visé : le préfixe suffit à le choisir, sans table.
 */
/** Les trois `kind` qui EMBALLENT un tirage, jamais une récompense en propre. */
const CONTAINER_KINDS = new Set(["group", "mysteryChest", "lootContainer"]);

/**
 * `false` pour la SEULE exception sur les 65 racines de récompense de
 * l'extraction : le Crocodile Aztèque (`Heritage_Aztec_Effect_1`), dont la
 * racine est directement `kind: "unit"` — pas un coffre à ouvrir. Les
 * affichages qui étiquettent un palier « Chest reward » (`describeChestEffect`,
 * `OverviewTable`) doivent véhiculer ce cas, plutôt que de dupliquer
 * `CONTAINER_KINDS`.
 */
export function isChestReward(reward: ResolvedChestReward): boolean {
  return CONTAINER_KINDS.has(reward.kind);
}

const BUILDING_PIECE_PREFIX = "BuildingPiece|";
const PUZZLE_PIECE_ICON = "/images/inventory/icon_puzzle_piece.webp";

/** `..._3_Id`, `..._Id`, `..._3` — le numéro de réemploi d'un même coffre,
 * retiré pour retomber sur la famille (`CHEST_ICON_BY_FAMILY`), commune à tous
 * ses emplois. Le `_Id` seul ne suffisait pas : le nœud EXTÉRIEUR d'un coffre
 * ne le porte pas (`Reward_AllAge_CollectorBuildings_1`), et c'est parfois lui
 * qui identifie le coffre — voir `containerFamilies`. */
const CONTAINER_TIER_SUFFIX = /(_\d+)?(_Id)?$/;

/**
 * Descend les `group` purement emballants (jamais de sens visuel propre en
 * jeu, cf. `CHEST_ICON_BY_FAMILY`) jusqu'au vrai conteneur — `mysteryChest`
 * ou `lootContainer`, le seul dont l'`id` porte la famille du coffre.
 */
function actualContainer(reward: ResolvedChestReward): ResolvedChestReward {
  if (reward.kind !== "group") return reward;
  const [only] = reward.children;
  return only === undefined ? reward : actualContainer(only);
}

/**
 * Les familles candidates d'un conteneur, dans l'ordre où les essayer.
 *
 * Le nœud LUI-MÊME d'abord : un lot garanti posé dans un coffre
 * (`Reward_Dac_Reference_Evo_GoodsEach_300_S`, Aztec/Halloween) porte son
 * identité sur le `group` extérieur, et descendre mène à un DAC dont l'id ne
 * nomme plus rien. Le conteneur descendu ensuite : c'est lui qui porte
 * l'identité quand le `group` extérieur n'est qu'un emballage numéroté
 * (`Reward_AllAge_CollectorBuildings_1` → son `mysteryChest`).
 */
function containerFamilies(reward: ResolvedChestReward): string[] {
  const ids = [reward.id, actualContainer(reward).id];
  return ids.flatMap((id) => (id === null ? [] : [id.replace(CONTAINER_TIER_SUFFIX, "")]));
}

/**
 * ⚠️ LE COFFRE CELTIC N'EST PAS UN COFFRE — C'EST UN TICKET.
 *
 * `Reward_AllAge_RandomRefillBarracks` (Celtic, palier 3 de la Grand Smithy)
 * ne s'ouvre pas une fois comme les 9 autres `CONTAINER_KINDS` du jeu : c'est
 * un objet d'inventaire (« ticket de recharge de caserne ») qui, une fois
 * utilisé, verse LUI-MÊME un ticket de recharge aléatoire (infanterie,
 * cavalerie…) — cf. `resolvers/heritage.ts` (commentaire sur
 * `containerLabel`) et l'icône dédiée dans `CHEST_ICON_BY_FAMILY` ci-dessus,
 * déjà routée vers `/images/inventory/` plutôt que `/images/chests/`. Le
 * libellé générique « Chest reward » (`describeChestEffect`, `OverviewTable`)
 * induisait donc en erreur sur CE SEUL palier : ni un coffre à ouvrir, ni la
 * relique qu'un joueur pourrait en attendre.
 */
const TICKET_LABEL_BY_FAMILY: Record<string, string> = {
  Reward_AllAge_RandomRefillBarracks: "Barracks refill ticket",
};

/**
 * Le libellé « Chest reward », sauf pour le ticket Celtic qui a le sien —
 * voir `TICKET_LABEL_BY_FAMILY`. Partagé par `describeChestEffect` et
 * `OverviewTable`, les deux affichages qui étiquettent un palier à coffre.
 */
export function chestRootLabel(reward: ResolvedChestReward): string {
  for (const family of containerFamilies(reward)) {
    const label = TICKET_LABEL_BY_FAMILY[family];
    if (label !== undefined) return label;
  }
  return "Chest reward";
}

/**
 * L'icône d'une récompense de coffre.
 *
 * Le game design donne un `definitionId` par famille (relique, item, kit,
 * ressource, UNITÉ) sans jamais nommer d'asset : seules les ressources connues
 * ont une icône sûre. Pour la plupart du reste (relique, kit d'inventaire,
 * pièce de bâtiment…), `getItemIconLocal(definitionId)` retombe sur le MÊME
 * slug que `unlock-cost.tsx` — `/images/goods/{slug}.webp` — pour peu que le
 * fichier existe ; sinon `getItemIconLocal` renvoie déjà `default.webp`.
 *
 * ⚠️ `kind: "unit"`, `kind: "inventoryItem"` et `kind: "selectionKit"` sont
 * trois cas à part : une unité (ex.
 * `Unit_CurrentEra_AztecMainTemple_Animal_Crocodiles`), un objet d'inventaire
 * (ex. `InventoryItem_RefillBarracks_Infantry`) ou un kit de sélection (ex.
 * `Selection_Kit_RefillBarracks_1`) n'ont JAMAIS d'asset sous `/images/goods/`
 * — c'est conceptuellement le mauvais dossier, pas un fichier manquant — d'où
 * le routage dédié vers `getUnitIconLocal` / `getInventoryItemIconLocal` (les
 * deux dernières partagent le même dossier `/images/inventory/`, un kit de
 * sélection étant visuellement un objet comme un autre).
 *
 * Les nœuds qui EMBALLENT un tirage (`group`, `mysteryChest`, `lootContainer`)
 * passent par `CHEST_ICON_BY_FAMILY` — voir sa doc pour la correspondance et
 * son niveau de confiance par coffre.
 */
export function chestRewardIcon(
  reward: ResolvedChestReward,
  selections: string[][],
): string {
  if (reward.definitionId !== null) {
    const named = CHEST_ICON_BY_DEFINITION[reward.definitionId];
    if (named !== undefined) return named;
  }
  const resource = reward.resources[0];
  if (resource !== undefined) {
    // Plusieurs rangs sur un même nœud = un bien TIRÉ parmi eux (World Fair) :
    // l'icône du premier désignerait un gagnant que la donnée ne désigne pas.
    if (reward.resources.length > 1 && reward.resources.every((r) => GOOD_RANK.test(r))) {
      return imagesUrl.good;
    }
    return resourceIcon(resource, resolveRankGood(resource, selections));
  }
  if (reward.definitionId?.startsWith(BUILDING_PIECE_PREFIX)) return PUZZLE_PIECE_ICON;
  // Une personnalisation de bâtiment n'a d'asset dans aucun dossier local : son
  // visuel vient du wiki, par son nom affiché (cf.
  // `getHeritageWikiImageUrlByName`). `reward.label` et non `definitionId` :
  // c'est le nom que le wiki utilise comme nom de fichier.
  if (reward.kind === "buildingCustomization" && reward.label !== "") {
    return getHeritageWikiImageUrlByName(reward.label);
  }
  if (CONTAINER_KINDS.has(reward.kind)) {
    const icon = containerFamilies(reward)
      .map((family) => CHEST_ICON_BY_FAMILY[family])
      .find((found) => found !== undefined);
    return icon ?? resolveIconPath("chest_good");
  }
  if (reward.kind === "unit" && reward.definitionId !== null) {
    return getUnitIconLocal(reward.definitionId);
  }
  if (
    (reward.kind === "inventoryItem" || reward.kind === "selectionKit") &&
    reward.definitionId !== null
  ) {
    return getInventoryItemIconLocal(reward.definitionId);
  }
  if (reward.definitionId !== null) return getItemIconLocal(reward.definitionId);
  return resolveIconPath("chest_good");
}

/**
 * ⚠️ « BUNDLE » NE VEUT RIEN DIRE À L'ÉCRAN.
 *
 * Le lot garanti du coffre Aztec/Halloween (`Reward_Dac_Reference_Evo_GoodsEach_300_S`)
 * est un `lootContainer` de trois `dynamicActionChange` : 150 du bien primaire,
 * 150 du secondaire, 150 du tertiaire — tous versés, aucun tirage. Le conteneur
 * n'a pas de label loca, d'où le repli générique « Bundle » de
 * `resolveChestRewardLabel` : la ligne s'affichait « 150 Bundle », un mot qui
 * ne dit ni ce qu'on reçoit, ni que le 150 vaut POUR CHAQUE bien.
 *
 * ⚠️ La donnée est COMPLÈTE ici : le popup « CHEST » vide observé en jeu est un
 * défaut du jeu, pas une lacune de l'extraction. Rien n'est deviné ni comblé.
 *
 * Les rangs vivent sur les FEUILLES, pas sur le conteneur (`resources` y est
 * vide) : c'est la seule différence avec le tirage de biens du coffre World
 * Fair, qui les porte sur son propre nœud. Une fois remontés, les deux suivent
 * exactement la même règle d'affichage (`goodRankNames`).
 */
function bundledGoodRanks(reward: ResolvedChestReward): string[] | null {
  if (!CONTAINER_KINDS.has(reward.kind)) return null;
  const leaves: ResolvedChestReward[] = [];
  const collect = (node: ResolvedChestReward) => {
    if (node.children.length === 0) leaves.push(node);
    else node.children.forEach(collect);
  };
  collect(reward);
  if (leaves.length === 0) return null;
  const ranks = leaves.flatMap((leaf) => leaf.resources);
  const allRanks =
    leaves.every((leaf) => leaf.resources.length > 0) && ranks.every((r) => GOOD_RANK.test(r));
  return allRanks ? ranks : null;
}

/**
 * Les noms des biens désignés par des RANGS, prêts à afficher.
 *
 * `null` dès qu'un seul rang n'est pas classé par le joueur : une liste
 * partielle (« Wool / ? / ? ») dirait moins que le générique « Goods », et rien
 * ne justifie de nommer un des biens plutôt que les autres.
 */
function goodRankNames(ranks: string[], selections: string[][]): string[] | null {
  const names = ranks.map((rank) => {
    const good = resolveRankGood(rank, selections);
    return good === null ? null : (GOOD_META_BY_KEY[good]?.name ?? good);
  });
  return names.some((name) => name === null) ? null : [...new Set(names as string[])];
}

/**
 * Le libellé affiché d'une récompense de coffre : le nom du BIEN concret pour
 * un rang de bien (`primary_ba`…) plutôt que la clé technique du DTO qui le
 * verse — le même repli que `chestRewardIcon` (`resolveRankGood`), mais pour
 * le TEXTE plutôt que l'icône.
 *
 * ⚠️ PLUSIEURS RANGS SUR UN SEUL NŒUD, ET DES RANGS NON CLASSÉS.
 * Le coffre World Fair verse UN bien tiré parmi les TROIS de l'ère précédente :
 * son nœud porte `["primary_hm", "secondary_hm", "tertiary_hm"]`, pas un rang
 * unique. Lire `resources[0]` nommait donc un seul des trois tirages. Et tant
 * que le joueur n'a pas classé ses ateliers de CETTE ère, aucun rang ne se
 * résout : `reward.label` est alors l'id technique humanisé du DAC (« Dac
 * Reward Event World Fair Evolving Exhibition 1 Previous Era Goods », et pour
 * ATH « Dac Building Heritage Vault PEGood1 1 »), jamais un texte du jeu.
 * D'où « Goods » comme repli — ce que le coffre verse vraiment, avec l'icône
 * générique de bien que `chestRewardIcon` pose déjà dans le même cas.
 *
 * ⚠️ `resolveRankGood` renvoie une CLÉ (`embellishment`), pas un libellé
 * (cf. sa doc dans `lib/utils.ts`) : `GOOD_META_BY_KEY` fait le dernier pas.
 * Sans lui, un coffre « biens de l'ère précédente/courante » (World Fair,
 * ATH) afficherait `resolveChestRewardLabel`'s repli — l'id technique du DAC
 * humanisé (« Dac Building Heritage Vault PEGood1 1 »), jamais le nom du bien
 * qu'il verse vraiment.
 *
 * `null` (rang que le joueur n'a pas classé) retombe sur le label déjà résolu
 * par le domaine — le même repli que partout ailleurs dans ce fichier pour un
 * rang non classé (cf. `resourceIcon`).
 */
export function chestRewardLabel(reward: ResolvedChestReward, selections: string[][]): string {
  const bundled = bundledGoodRanks(reward);
  if (bundled !== null) return goodRankNames(bundled, selections)?.join(" / ") ?? GOODS_LABEL;
  if (reward.resources.length === 0) return reward.label;
  if (!reward.resources.every((resource) => GOOD_RANK.test(resource))) {
    const good = resolveRankGood(reward.resources[0], selections);
    return good === null ? reward.label : (GOOD_META_BY_KEY[good]?.name ?? reward.label);
  }
  return goodRankNames(reward.resources, selections)?.join(" / ") ?? GOODS_LABEL;
}

/**
 * ⚠️ REPLI SUR UN NOM, PAS UN CHAMP TYPÉ.
 *
 * Certains `dynamicActionChange` (`Dac_EvoChest_Coins_300_S_2`,
 * `Dac_Reward_Evo_GoodsEach_300_S_Part1`…) portent `curve: null` ET
 * `ageCurve: null` — le montant n'est résolu NULLE PART dans la donnée, il
 * n'existe QUE dans le nom du `definitionId` (le suffixe `_<nombre>_<taille>`,
 * ex. `_300_S`, `_25_XXXS`, `_750_L`). Motif vérifié sur les 32
 * `dynamicActionChange` de l'extraction : 19/32 le portent (familles
 * `Dac_EvoChest_*` et `Dac_Reward_Evo_GoodsEach_*`), les 13 autres ne
 * matchent jamais (`Dac_Building_HeritageVault_(PE)?Good…`, DAC d'événement)
 * — ceux-là ont un `ageCurve` résolu, donc n'ont pas besoin de ce repli.
 * N'est utilisé qu'en dernier recours, jamais si `reward.amount` existe déjà.
 */
const DAC_SUFFIX_AMOUNT = /_(\d+)_(?:XXXS|XXS|XS|S|M|L)(?:_|$)/;

function leafAmount(reward: ResolvedChestReward): number | null {
  if (reward.amount !== null) return reward.amount;
  if (reward.kind !== "dynamicActionChange" || reward.definitionId === null) return null;
  const match = DAC_SUFFIX_AMOUNT.exec(reward.definitionId);
  return match ? Number(match[1]) : null;
}

/**
 * Le montant d'une récompense de coffre, à afficher à côté de son icône.
 *
 * Une feuille (`children` vide) rend son propre montant — le cas courant
 * (kit, rafraîchissement de caserne…). Un nœud qui EMBALLE quelque chose
 * (un « biens garantis » comme `Dac_Reward_Evo_GoodsEach_300_S`, une
 * `mysteryChest` de biens comme `Reward_HeritageVault_RandomCEGoods_*`) ne
 * rend un montant que si TOUTES ses feuilles porteuses de `resources`
 * s'accordent sur la MÊME valeur — jamais approximé, et `null` pour un pool
 * hétérogène (items + reliques) qui n'a pas de montant commun à afficher.
 *
 * Descend dans `.children` — la donnée du resolver, pas le rendu : la ligne
 * de coffre (`ChestRewardRow`) ne montre plus que la première couche depuis
 * que les enfants ne sont plus dépliés visuellement, mais ce calcul a besoin
 * de voir plus loin pour ramener CE montant-là à la surface.
 */
export function chestRewardAmount(reward: ResolvedChestReward): number | null {
  if (reward.children.length === 0) return leafAmount(reward);

  const leaves: ResolvedChestReward[] = [];
  const collect = (node: ResolvedChestReward) => {
    if (node.children.length === 0) {
      if (node.resources.length > 0) leaves.push(node);
      return;
    }
    node.children.forEach(collect);
  };
  reward.children.forEach(collect);

  if (leaves.length === 0) return null;
  const [first, ...rest] = leaves.map(leafAmount);
  return first === null || rest.some((amount) => amount !== first) ? null : first;
}

// ─── Sous-titre de carte ────────────────────────────────────────────────────

/**
 * Sous-titre affiché sous le nom du thème (ex. sous « Forge of Flames ») :
 * l'ÉVÉNEMENT qui a introduit ce Heritage, pas `buildingName` (« Celtic
 * Culture ») — un libellé produit par l'extraction pour la fiche bâtiment,
 * pas pensé comme sous-titre de carte.
 *
 * `event` est un identifiant technique (`Event_Celtic`, `Event_MaliEmpire`…),
 * mis en mots puis suffixé « Event ». Une seule exception : le vault ATH ne
 * porte PAS un `Event_*` mais `Treasure_Hunt` (son XP vient de la chasse au
 * trésor d'alliance, pas d'un événement saisonnier) — son sous-titre reste le
 * sigle « ATH » sous lequel les joueurs le connaissent, jamais un « Treasure
 * Hunt Event » qui n'existe nulle part en jeu.
 */
export function heritageEventLabel(vault: { key: string; event: string | null }): string {
  if (vault.key === "heritage_ath") return "ATH";
  if (vault.event === null) return "";

  const words = vault.event
    .replace(/^Event_/, "")
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2");
  return `${words} Event`;
}
