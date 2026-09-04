// ============================================================
// ROC Helper – Campaign : forme de l'extraction générée
//
// Décrit ce que `scripts/extract/campaign.ts` produit à partir de
// `source/gamedesign.json` + `source/loca.json`.
//
// Deux couches cohabitent dans le module généré, comme pour les Wonders et les
// Technologies :
//
//  1. `CampaignRegionExtract` — la projection complète et fidèle du game
//     design. Tout ce que le game design porte sur une région est conservé,
//     que l'app le consomme aujourd'hui ou non (faction, meneur, continent,
//     champs de bataille, tours de négociation…).
//
//  2. `CampaignRawRegion` — la projection étroite, alignée sur `CampaignRegion`
//     (`types/campaign-types.ts`, contrat décrit en docs/data-contracts.md §3.1).
//     C'est la seule couche que l'UI verra le jour de la bascule.
//
// Référence : docs/data-contracts.md §3 (contrat de forme côté app)
//             docs/game-schema/00-conventions.md §C3 (int64 en string)
//
// ⚠️ Le domaine Campaign ne porte AUCUN bonus au sens de `resolvers/bonus.ts`.
// Les cinq `@type` de récompense qu'il utilise (`IncreaseExpansionRightRewardDTO`,
// `ResourceRewardDTO`, `IncreaseTradingCultureExpansionsRewardDTO`,
// `CommanderRewardDTO`, `RewardDefinitionDTO`) sont des octrois ponctuels —
// des droits d'expansion, des ressources, un commandant — pas des modificateurs
// permanents. Aucun ne relève de `BONUS_LABELS`, et aucun champ `bonuses`
// n'existe donc ici. Y ranger les expansions par ressemblance de nom recréerait
// exactement le second dictionnaire que le domaine Wonders a démonté.
// ============================================================

// ─── Récompenses ──────────────────────────────────────────────────────────────

/**
 * Projection d'une récompense vers le vocabulaire de ressources du projet.
 *
 * Ce vocabulaire n'est PAS celui du game design : c'est celui des icônes
 * (`public/images/goods/{resource}.webp`, lu par `getItemIconLocal`). Cinq
 * familles de récompense y convergent — voir `projectReward()` dans
 * scripts/extract/campaign.ts.
 *
 * `name` n'est renseigné que pour les `commander_*`, seule famille que l'UI
 * rend par un libellé plutôt que par une icône + un montant
 * (docs/data-contracts.md §3.1, contrainte 3).
 */
export interface CampaignRewardProjection {
  resource: string;
  amount: number;
  name: string | null;
}

/**
 * Une récompense de `finish.rewards[]`, normalisée.
 *
 * La forme reprend celle de `TechnologyReward` : `@type` court, champs propres
 * verbatim dans `payload`, plus la projection vers le vocabulaire du projet.
 *
 * ⚠️ La projection est calculée ICI et non dans la couche étroite, parce
 * qu'elle a besoin de la loca (le libellé d'un commandant) et que la loca n'est
 * lisible qu'à l'extraction. `projection` vaut `null` quand le `@type` n'est
 * pas projetable — la récompense reste alors visible dans `payload`, et un
 * avertissement est levé sur la région.
 */
export interface CampaignRewardExtract {
  /** `@type` en forme courte, ex. `IncreaseExpansionRightRewardDTO`. */
  type: string;
  /** `baseData.id` quand la récompense en porte un ; `null` sinon. */
  ownId: string | null;
  /** Champs propres au `@type`, verbatim, moins `@type` et `baseData`. */
  payload: Record<string, unknown>;
  /** Vue « ressource du projet » de cette récompense ; `null` si non projetable. */
  projection: CampaignRewardProjection | null;
}

// ─── Parties ──────────────────────────────────────────────────────────────────

/**
 * Mode de jeu d'une partie, dans le vocabulaire du projet
 * (`CampaignPart.type`, docs/data-contracts.md §3.1, contrainte 1).
 *
 * Une partie peut en porter plusieurs : 149 des 1 046 parties déclarent à la
 * fois un affrontement et une négociation.
 */
export type CampaignPartType = "combat" | "combat_waves" | "negotiation";

/** Une `PartComponentDTO`. */
export interface CampaignPartExtract {
  /** `PartComponentDTO.id`, ex. `Continent_Panganea_Region_1_Part_1`. */
  id: string;
  /** Rang 1-based de la partie dans la région, dans l'ordre des `components`. */
  index: number;
  /**
   * Modes déclarés, dans l'ordre canonique `combat` → `combat_waves` →
   * `negotiation`. Dérivé de la présence des blocs `combat` / `combatWaves` /
   * `negotiationGame`, aucun champ ne le nomme.
   */
  types: CampaignPartType[];
  /** `combat.id` — un `BattlefieldDefinitionDTO`. `null` sans bloc `combat`. */
  combatId: string | null;
  /** `combatWaves.id` — un `BattlefieldWavesDefinitionDTO`. */
  combatWavesId: string | null;
  /** `negotiationGame.id` — un `NegotiationGameDefinitionDTO`. */
  negotiationGameId: string | null;
  /** `combat.sceneId` — décor du champ de bataille. */
  sceneId: string | null;
  /** Nombre d'escouades ennemies de `combat.enemyUnits[]`. */
  enemyUnitCount: number;
  /** Nombre de champs de bataille de `combatWaves.battlefields[]`. */
  waveCount: number;
  /** `negotiationGame.turns`. */
  negotiationTurns: number | null;
  rewards: CampaignRewardExtract[];
}

// ─── L'extraction ─────────────────────────────────────────────────────────────

export interface CampaignRegionExtract {
  // Identité
  /** `RegionDefinitionDTO.id`, ex. `Continent_Panganea_Region_11`. */
  id: string;
  /**
   * Identifiant côté projet, `{abbr}_{index}` (ex. `sa_9`).
   * ⚠️ Ce n'est PAS une donnée du game design : c'est la convention d'ID de
   * l'app (docs/data-contracts.md §3.1), reconstruite ici pour que la donnée
   * générée soit comparable à la donnée saisie à la main. `index` est le rang
   * 1-based de la région dans son âge, trié par le numéro qui termine son `id`.
   */
  code: string;
  /** `Base.Regions.<id>_Name`. Repli sur `RegionDefinitionDTO.name` si absent. */
  name: string;
  /** `RegionDefinitionDTO.name` — `Region20`, un numéro interne, non affichable. */
  rawName: string;
  /** `Base.Regions.<id>_Discovered` — réplique du meneur à la découverte. */
  discoveredText: string;
  /** `Base.Regions.<id>_Acquired` — réplique du meneur à la prise. */
  acquiredText: string;

  // Position
  /** `RegionDefinitionDTO.age`, ex. `IberianEra`. */
  age: string;
  /** Identifiant d'ère côté projet, ex. `iberian_era` — clé de `CAMPAIGN_REGISTRY`. */
  eraId: string;
  /** Abréviation 2 lettres minuscules, ex. `ie` — préfixe de `code`. */
  eraAbbr: string;
  /** Rang 1-based dans l'âge — le suffixe de `code`. */
  index: number;
  /** `RegionDefinitionDTO.continent`. Un continent couvre 1 ou 2 âges. */
  continent: string;
  /** Numéro terminant l'`id` de la région — la clé de tri dans le continent. */
  regionNumber: number;
  /**
   * Profondeur dans le graphe de prérequis DU MÊME ÂGE : 0 pour une racine,
   * sinon 1 + le maximum des profondeurs des prérequis (PLUS LONG chemin).
   *
   * ⚠️ Le game design ne porte pas de colonne pour les régions — contrairement
   * aux technologies, qui ont un champ `column`. Elle est calculée ici, et la
   * règle « plus long chemin » n'est pas un choix arbitraire : c'est la seule
   * des deux (plus long / plus court) qui reproduise les 272 colonnes saisies
   * à la main.
   */
  column: number;

  // Rattachement narratif
  /** `RegionDefinitionDTO.faction`, ex. `Faction_StoneAge_SkullSmasherTribe`. */
  faction: string;
  /** `RegionDefinitionDTO.leader`, ex. `FactionLeader_StoneAge_Grok`. */
  leader: string;
  /** `RegionDefinitionDTO.isInitial` — vrai sur la seule région de départ. */
  isInitial: boolean;
  /**
   * Région d'affrontement final d'un meneur.
   *
   * ⚠️ Aucun champ du game design ne déclare un « boss » : ni marqueur sur la
   * région, ni unité distinguée dans le champ de bataille. La valeur est
   * DÉRIVÉE de deux traits conjoints — dernière région du `leader` ET une seule
   * `PartComponentDTO`. Chacun pris seul rate la cible (29 et 31 régions
   * respectivement) ; leur intersection en donne 28. La règle a d'abord
   * reproduit 27 des 28 marques posées à la main ; la 28ᵉ (`sa_5`) a été
   * ajoutée à la main PAR DÉFAUT sur la foi de la règle, faute de pouvoir
   * rejouer la campagne pour vérifier — voir scripts/extract/campaign.ts.
   */
  boss: boolean;

  // Éclaireur
  /**
   * `ScoutComponentDTO`. `null` sur la région initiale, qui n'en porte pas :
   * elle est acquise d'office. L'app y écrit `{ coins: 0, duration: 0 }`.
   */
  scout: {
    /** `start.resourceChanges[]` en `coins`, rendu POSITIF (le jeu l'écrit négatif). */
    coins: number;
    /** `duration` converti en secondes. */
    duration: number;
    /** `duration` verbatim, ex. `"15300s"`. */
    rawDuration: string;
  } | null;

  // Prérequis
  /** `ScoutComponent.start.requirements[].regions[]` — des `Region.id`. Dédoublonné. */
  requires: string[];
  /** Les mêmes, traduits en `code`. */
  requiresCodes: string[];
  /**
   * Sous-ensemble de `requiresCodes` pointant vers un AUTRE âge : 13 arêtes,
   * une par transition d'ère (la 1ʳᵉ région d'un âge exige la dernière du
   * précédent). L'app ne les affiche pas — elle ne cherche les prérequis que
   * dans l'ère sélectionnée — d'où leur isolement ici.
   */
  crossAgeRequiresCodes: string[];

  // Effets
  /** `RegionComponentDTO.finish.rewards[]` — la prime de prise de région. */
  regionRewards: CampaignRewardExtract[];
  /** `PartComponentDTO[]`, dans l'ordre des `components`. */
  parts: CampaignPartExtract[];

  /** Ce que le game design laisse indéterminé, ou ce que la projection a laissé tomber. */
  warnings: string[];
}

// ─── Projection UI ────────────────────────────────────────────────────────────

/** `CampaignReward` de types/campaign-types.ts. `name` n'existe que sur `commander_*`. */
export interface CampaignRawReward {
  resource: string;
  amount: number;
  name?: string;
}

/** `CampaignPart` de types/campaign-types.ts. */
export interface CampaignRawPart {
  type: string[];
  rewards: CampaignRawReward[];
}

/**
 * Projection étroite, alignée sur `CampaignRegion` (types/campaign-types.ts).
 *
 * ⚠️ `required` ne contient que les prérequis DU MÊME ÂGE, ce qui est le
 * contrat actuel de l'app. Les 13 arêtes inter-âges sont dans
 * `CampaignRegionExtract.crossAgeRequiresCodes`.
 *
 * ⚠️ `boss` est omis plutôt que mis à `false`, comme dans la donnée saisie à la
 * main où le champ est optionnel et n'apparaît que sur les régions de boss.
 */
export interface CampaignRawRegion {
  id: string;
  name: string;
  column: number;
  boss?: boolean;
  required: string[];
  scout: { coins: number; duration: number };
  regionRewards: CampaignRawReward[];
  parts: CampaignRawPart[];
}

// ─── Le bundle ────────────────────────────────────────────────────────────────

/** Un âge portant des régions. Les 14 âges jouables. */
export interface CampaignAgeExtract {
  age: string;
  eraId: string;
  eraAbbr: string;
  /** Rang chronologique, 1-based — l'ordre de `ERAS` dans data/config.ts. */
  index: number;
  regionCount: number;
  /** Continents traversés par cet âge. Un âge tient sur un seul continent. */
  continents: string[];
}

export interface CampaignExtractBundle {
  generatedFrom: {
    gameDesignChecksum: string | null;
    locaChecksum: string | null;
    locale: string | null;
  };
  ages: CampaignAgeExtract[];
  regions: CampaignRegionExtract[];
}
