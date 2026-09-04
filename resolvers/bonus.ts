// ============================================================
// Vocabulaire de bonus — couche présentation, sans domaine.
//
// Rien ici ne connaît les Wonders : ces fonctions ne prennent qu'un
// `type`, un `format` et une valeur. C'est le point d'entrée partagé
// prévu pour les futurs domaines (bâtiments évolutifs, capitale…).
//
// ⚠️ Ce module ne compose PAS les bonus. Additionner ou multiplier
// deux bonus (amplificateur Keeper, opérateurs +/×) demande une règle
// métier que les données ne déclarent pas
// (docs/game-schema/05-wonders-reliques-heritage.md §2.1 et §2.5).
// Hors périmètre tant que cette règle n'est pas tranchée.
//
// ─── CONVENTION (a) — schéma A : `modifier` × valeur dynamique ────────────────
//
// ⚠️ HYPOTHÈSE ASSUMÉE, PAS UNE RÈGLE DÉCLARÉE PAR LA DONNÉE.
//
// Sur un `BoostUnitStatComponentDTO`, deux champs cohabitent et doivent être
// COMBINÉS pour obtenir le bonus réel :
//
//   { modifier: 0.01, dynamicUnitStatChangeDefinitionId: "Dusc_Heritage_UnitAttackBoost" }
//   Dusc_Heritage_UnitAttackBoost  →  formule "2.0 + (0.24 * #level)"
//
// La convention retenue est le PRODUIT : `modifier × valeurDynamique(niveau)`.
// Au niveau 60 d'un Heritage Vault : 0.01 × (2.0 + 0.24 × 60) = 0.164, soit
// +16,4 % — un ordre de grandeur cohérent avec le jeu.
//
// Pourquoi c'est une hypothèse :
//   - le game design ne déclare NULLE PART que l'opérateur est une
//     multiplication ; il pose deux champs côte à côte, sans les relier ;
//   - `modifier` vaut 0.01 sur 32/32 des composants du Heritage Vault, ce qui
//     le fait ressembler à une constante d'échelle universelle — mais les
//     wonders portent aussi 0.04, 0.02, 0.1 et 0.15, donc c'en est bien un
//     paramètre par composant, pas une constante ;
//   - les deux autres lectures possibles sont réfutées par l'ordre de grandeur :
//     lire `modifier` seul donnerait +1 % constant à tous les niveaux, lire la
//     valeur dynamique seule donnerait +1640 %.
//
// Conséquence concrète : `BuildingCurve.effective` PORTE DÉJÀ ce produit
// (`modifier × resolved`, cf. scripts/extract/*.ts). C'est cette valeur qu'il
// faut lire — jamais `modifier` ni `resolved` isolément.
//
// ⚠️ Unité : `effective` reste un RATIO (0.164), pas un nombre de points de
// pourcentage. `format: "percent"` décrit la façon de l'AFFICHER, pas l'échelle
// de la valeur stockée. Convention héritée du domaine Bâtiments, conservée à
// l'identique par le Heritage Vault pour que les deux se lisent pareil.
//
// Le jour où une mesure en jeu contredit ce produit, c'est ICI qu'il faut
// trancher, et à un seul endroit : l'extraction est la seule à l'appliquer.
// ============================================================

import type { BonusFormat } from "@/data/wonders/types";
import { formatNumber } from "@/lib/utils";

export type { BonusFormat };

// ─── Bonus labels dictionary ──────────────────────────────────────────────────
//
// Maps bonus `type` → i18n-ready display label.
// Clés CANONIQUES uniquement : le rang d'un bonus répété sur un même porteur
// n'est pas dans la clé, il est passé à `getBonusLabel` via `instance`.

export const BONUS_LABELS: Record<string, string> = {
  // Production — BOOSTS, exprimés en pourcent (`format: "percent"`).
  coins_production: "Coin Boost",
  food_production: "Food Boost",
  goods_production: "Goods Boost",
  goods_quantity: "Goods Quantity",
  previous_era_goods_quantity: "Previous Era Goods Qty",
  rp_per_day: "RP / Day",
  // Boost portant sur ce que produit un TYPE de bâtiment, sans nommer de
  // ressource (`BoostResourceComponentDTO` sans `resourceDefinitionId`).
  //
  // Aucune clé existante ne convient : `coins_production` et `food_production`
  // nomment une ressource que ce composant ne nomme pas, et `goods_production`
  // affirmerait des biens là où le game design ne dit que « ce que produit un
  // atelier ». Une clé par type de bâtiment (`workshop_production`,
  // `home_production`, …) ferait un dictionnaire à rallonge pour une seule
  // notion : le TYPE est donc porté par `BuildingBonus.scope`
  // (`{ kind: "buildingType", value: "workshop" }`), pas par la clé.
  building_type_production: "Workshop Production Boost",
  // Production — SORTIES absolues par cycle (`format: "absolute"`).
  //
  // Distinctes des `*_production` ci-dessus, et ce n'est pas un détail de nom :
  // `coins_production` est un pourcentage appliqué à une production, `coins_output`
  // EST la production (1 800 pièces par 6 h sur une Small Home niveau 1). Les
  // confondre ferait rendre une quantité comme un taux.
  //
  // Introduites par le domaine Bâtiments (`ProductionComponentDTO.producedResources[]`).
  // `allied_currency_output` couvre les 7 monnaies de cité alliée d'un seul type ;
  // la monnaie exacte est portée à part par le bonus, pas par la clé — c'est le
  // même arbitrage que `goods_production`, qui ne nomme pas le bien non plus.
  coins_output: "Coins",
  food_output: "Food",
  goods_output: "Goods",
  allied_currency_output: "Allied Currency",
  // ⚠️ CINQUIÈME famille `*_output`, adoptée avec le domaine Heritage Vault.
  // Voisine de trois clés existantes, et distincte des trois : `rp_per_day` est
  // un BOOST en pourcent, `research_regen_boost` une vitesse de régénération,
  // `research_point_cap` un plafond. Ici le game design verse une QUANTITÉ par
  // cycle (`producedResources[research_points]` : 1 PR/jour au niveau 1, 30 au
  // niveau 60). Réutiliser une clé en pourcent afficherait « +30 % » pour 30 PR.
  research_points_output: "Research Points",
  research_point_cap: "Research Point Cap",
  // Culture — la première entrée du dictionnaire, tous domaines confondus.
  //
  // Le trou était ouvert depuis le domaine Bâtiments, qui propose ces deux clés
  // 135 fois sans qu'aucune n'ait jamais été adoptée : rien dans BONUS_LABELS ne
  // parlait de culture. `Costs.culture_bonus` et `Costs.culture_range` existent
  // bien dans types/shared.ts, mais ce sont des champs de COÛT, non consommés,
  // pas des clés de bonus. Le Heritage Vault, qui porte les deux sur ses 13
  // vaults, referme le trou pour les deux domaines à la fois.
  //
  // Les deux clés restent SÉPARÉES parce que le jeu porte deux champs distincts
  // (`luaPointsDefinitionId` / `luaRangeDefinitionId`, et leurs équivalents
  // dynamiques côté Bâtiments) : l'un compte des points de culture, l'autre un
  // rayon en cases. Les fusionner ferait afficher des cases comme des points.
  culture_points: "Culture Points",
  culture_range: "Culture Range",
  // Régénération d'une ressource à jauge — plafond et vitesse.
  //
  // ⚠️ NE PAS CONFONDRE avec `research_point_cap` / `research_regen_boost`
  // ci-dessus, qui NOMMENT les points de recherche. Ces deux clés-ci sont
  // GÉNÉRIQUES : la ressource régénérée vit dans `BuildingBonus.resource`, et
  // sur le Heritage Vault elle vaut `treasure_hunt_attempt` — le plafond de
  // tentatives de la chasse au trésor d'alliance (4 au niveau 1, 9 au niveau 60).
  // Réutiliser la paire Wonders étiquetterait des tentatives de chasse en
  // « RP Cap ». Même arbitrage que `allied_currency_output` : une clé, la
  // ressource portée à part.
  regeneration_cap: "Attempt Cap",
  regeneration_speed: "Attempt Regeneration Speed",
  research_regen_boost: "RP Regeneration Speed",
  chest_drop_chance: "Chest Drop Chance",
  // Workers / slots
  worker_slots: "Workers",
  trade_worker_slots: "Trade Workers",
  arabia_worker_slots: "Arabia Workers",
  compass_slots: "Compasses",
  // Combat – damage
  //
  // ⚠️ NOM D'UNITÉ EN TOUTES LETTRES, JAMAIS ABRÉGÉ : le jeu ne connaît que
  // « Heavy Infantry » (`Base.UnitTypes.heavyInfantry_Name` dans source/loca.json),
  // jamais « Heavy Inf. » — abréviation maison introduite ici sans base dans la
  // loca, source de la plainte (les libellés du Heritage Vault ne
  // correspondaient pas à ceux du jeu). Même règle pour Infantry/Ranged/
  // Cavalry/Siege, déjà en toutes lettres.
  infantry_damage: "Infantry Damage",
  ranged_damage: "Ranged Damage",
  cavalry_damage: "Cavalry Damage",
  heavy_infantry_damage: "Heavy Infantry Damage",
  // `siege` est le cinquième type d'unité du jeu ; aucun wonder n'en porte, d'où
  // son absence jusqu'ici. `army_damage` ne le couvre pas : cette clé-là est le
  // cas SANS `unitType` (toutes unités), pas un type en particulier.
  siege_damage: "Siege Damage",
  army_damage: "Army Damage",
  // Combat – HP
  //
  // ⚠️ « Hit Points » EN TOUTES LETTRES (`Base.UnitStats.HitPoints` dans la
  // loca), jamais « HP » — même abréviation maison que ci-dessus, retirée pour
  // les 5 clés que porte effectivement le Heritage Vault (`bastion_hp` et
  // `army_hp` restent hors de ce domaine, non touchées ici).
  infantry_hp: "Infantry Hit Points",
  ranged_hp: "Ranged Hit Points",
  cavalry_hp: "Cavalry Hit Points",
  heavy_infantry_hp: "Heavy Infantry Hit Points",
  bastion_hp: "Bastion HP",
  siege_hp: "Siege Hit Points",
  army_hp: "Army HP",
  // Combat – special
  infantry_critical_hit_chance: "Infantry Crit Chance",
  heavy_infantry_critical_hit_chance: "Heavy Inf. Crit Chance",
  ranged_critical_hit_boost: "Ranged Crit Boost",
  // ⚠️ Voisin de `ranged_critical_hit_boost`, PAS un doublon : le jeu porte deux
  // stats distinctes, `UnitStat_CriticalHitChance` (la fréquence, alias en
  // `ranged_critical_hit_boost`) et `UnitStat_CriticalHitDamage` (les dégâts du
  // coup critique). Introduit par le domaine Bâtiments.
  //
  // ⚠️ « Critical Hit Damage » EN TOUTES LETTRES (`Base.UnitStats.
  // CriticalHitDamage` dans la loca), jamais « Crit Damage » — pour les 5 clés
  // que porte le Heritage Vault (`ranged_critical_hit_boost`, alias de la
  // fréquence et non de la stat de dégâts, reste hors de ce domaine et non
  // touché ici).
  ranged_critical_hit_damage: "Ranged Critical Hit Damage",
  // Les QUATRE autres types d'unité sur la même stat `UnitStat_CriticalHitDamage`,
  // adoptées avec le domaine Heritage Vault (le vault World Fair la porte sur les
  // 5 types d'un coup). Même pattern que `ranged_critical_hit_damage` ci-dessus,
  // et même raison de ne PAS les confondre avec la famille `*_critical_hit_chance`
  // / `ranged_critical_hit_boost` : deux stats distinctes du jeu, la fréquence du
  // critique d'un côté, ses dégâts de l'autre. Aucune n'est un alias de l'autre —
  // seul `ranged_critical_hit_chance` est aliasé, vers `ranged_critical_hit_boost`.
  infantry_critical_hit_damage: "Infantry Critical Hit Damage",
  heavy_infantry_critical_hit_damage: "Heavy Infantry Critical Hit Damage",
  cavalry_critical_hit_damage: "Cavalry Critical Hit Damage",
  siege_critical_hit_damage: "Siege Critical Hit Damage",
  cavalry_hit_rate: "Cavalry Hit Rate",
  // ⚠️ « Recruitment Time Bonus » reprend le titre affiché en jeu pour ce
  // boost (`Base.BoostInfoPopup.RecruitmentTimeBonus` dans la loca) — le
  // Heritage Vault n'y ajoute qu'un type d'unité qui n'a pas d'équivalent
  // court en jeu, donc préfixé en toutes lettres plutôt qu'abrégé.
  recruitment_time_reduction: "Recruitment Time Bonus",
  heavy_infantry_recruitment_time_reduction: "Heavy Inf. Recruit Time ↓",
  carcassonne_recruitment_time_reduction: "Carcassonne Recruit Time ↓",
  // Economy
  donation_gears: "Donation Gears",
  trade_bonus: "Trade Bonus",
  trade_slot_cooldown_reduction: "Trade Slot Cooldown ↓",
  bazaar_offer_boost: "Bazaar Offer Boost",
};

/** `2` → `"2nd"`. Rangs au-delà de 1 seulement — voir `getBonusLabel`. */
function ordinal(n: number): string {
  if (n === 2) return "2nd";
  if (n === 3) return "3rd";
  return `${n}th`;
}

/**
 * Returns a human-readable label for a bonus type.
 * Falls back to a title-cased version of the type string.
 *
 * `instance` is the bonus's rank among those sharing the same `type` on the same
 * carrier. Rank 1 (the default) reads plain; beyond that the label is suffixed,
 * so a wonder holding two `goods_production` still reads
 * "Goods Production" / "Goods Production (2nd)" as it did when the rank was
 * baked into the key.
 */
export function getBonusLabel(type: string, instance = 1): string {
  const base =
    BONUS_LABELS[type] ??
    type.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return instance > 1 ? `${base} (${ordinal(instance)})` : base;
}

// ─── Stable identity ──────────────────────────────────────────────────────────

/**
 * Stable key for a bonus within one carrier — `type` alone is no longer unique
 * now that the rank lives outside it. Use for React keys and lookups.
 */
export function bonusKey(bonus: { type: string; instance: number }): string {
  return `${bonus.type}#${bonus.instance}`;
}

// ─── Format bonus value ───────────────────────────────────────────────────────

/**
 * Formats a numeric bonus value for display.
 * - percent  → "+18.3%"
 * - integer  → "+4"
 * - flat     → raw number (goods amounts, etc.)
 * - absolute → grouped throughput, no sign: "1,800"
 *
 * `format` comes from the data (`WonderBonus.format`), produced by the extractor
 * from the game-design shape. It is deliberately NOT derived from `type`: the
 * former `PERCENT_TYPES` / `INTEGER_TYPES` sets were a second, hand-maintained
 * source of truth, and where they disagreed with the extraction the UI silently
 * rendered the wrong unit (`donation_gears` as `+42` instead of `+42%`).
 *
 * NOTE: synergy bonuses are pre-formatted strings in `WonderSynergy.bonus`
 * and must NOT go through this function.
 */
export function formatBonusValue(format: BonusFormat, value: number): string {
  if (format === "percent") {
    // ⚠️ NOTATION DU JEU : jusqu'à DEUX décimales, virgule décimale, espace
    // avant le signe — « 10,76 % », « 7,4 % », « 8 % ». Les zéros de fin ne
    // sont pas écrits (7,40 s'affiche « 7,4 »), c'est ce que fait
    // `maximumFractionDigits` sans `minimumFractionDigits`. On rendait une
    // seule décimale et un point (« +10.8% ») : un dixième de point de
    // pourcentage perdu sur des boosts qui se cumulent.
    //
    // Le `+` reste : il distingue un GAIN de la valeur brute, et le tableau
    // avant/après comme les comparaisons de merveilles s'appuient dessus.
    const sign = value >= 0 ? "+" : "";
    const formatted = value.toLocaleString("fr-FR", { maximumFractionDigits: 2 });
    return `${sign}${formatted} %`;
  }
  if (format === "integer") {
    // ⚠️ ARRONDI OBLIGATOIRE, pas une coquetterie d'affichage. `integer` compte
    // des unités DISCRÈTES (emplacements d'ouvrier, points de culture, portée,
    // plafond de tentatives) mais la valeur reçue n'est pas toujours entière :
    // le Heritage Vault la fait passer par l'amplificateur du gardien
    // (`value × (1 + m)`), et 1350 × 1,15 vaut 1552.4999999999998 en flottant.
    // L'interpolation nue rendait littéralement « +1552.4999999999998 ».
    //
    // ⚠️ Le `toPrecision(12)` n'est pas décoratif : sans lui, `Math.round` verrait
    // 1552.4999999999998 et rendrait 1552 là où le calcul exact (1552,5) demande
    // 1553 — l'arrondi tomberait du mauvais côté à cause du bruit binaire, pas
    // d'une règle de jeu. 12 chiffres significatifs absorbent ce bruit sans
    // toucher aux valeurs réellement fractionnaires.
    return `+${Math.round(Number(value.toPrecision(12)))}`;
  }
  if (format === "absolute") {
    // Une SORTIE de production, pas un gain : aucun signe.
    //
    // ⚠️ ABRÉGÉ EN K/M/B au-delà de 100 000, par `formatNumber` — la fonction
    // de formatage déjà utilisée par le reste de l'application (Technologies,
    // Campagne, cartes de bâtiments). C'est aussi ce que fait le JEU sur la
    // piste de niveaux d'un bâtiment (« 446,50 K/1D »), là où un nombre écrit
    // en entier tient mal dans une pastille et se lit mal.
    //
    // En dessous de 100 000, `formatNumber` groupe les milliers sans abréger
    // (« 1,208 ») : le rendu d'avant est donc conservé sur toute cette plage.
    // ⚠️ ENTIER, comme `integer` ci-dessus : on ne produit pas un demi-bien.
    // Le décimal affiché venait de DEUX sources et aucune n'est une quantité
    // que le jeu sait verser :
    //   - l'amplificateur du gardien, qui multiplie une quantité entière par
    //     1,15 (1050 × 1,15 = 1207,5) ;
    //   - la donnée elle-même, dont 14 courbes `absolute` sur 44 portent des
    //     .5 (69,5 biens…) — un pas de courbe, pas une livraison.
    // La normalisation `toPrecision(12)` est là pour la même raison que dans la
    // branche `integer` : sans elle, 1207.4999999999998 tomberait sur 1207.
    return formatNumber(Math.round(Number(value.toPrecision(12))));
  }
  // flat: integer for slots/counts, otherwise one decimal
  return Number.isInteger(value) ? `${value}` : value.toFixed(1);
}
