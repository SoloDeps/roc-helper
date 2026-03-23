// ─────────────────────────────────────────────────────────────────────────────
// happinessCalculator.ts
// Logique pure — calcul happiness, ranges, bonus production
// Port de CityStatsProcessor.cs + ProductionStatsProcessor.cs (fof-hoh)
// Zéro dépendance React/browser
// ─────────────────────────────────────────────────────────────────────────────

import type { CityMapEntity } from './cityMapEntity';
import type { GridRect } from './mapGrid';

// ─────────────────────────────────────────────────────────────────────────────
// Données statiques des Cultural Sites
// Source : gamedesign.json → CultureComponentDTO
// ─────────────────────────────────────────────────────────────────────────────

export interface CultureSiteData {
  /** Happiness points fournis par le site */
  points: number;
  /** Range en tuiles dans chaque direction */
  range: number;
}

/** Map buildingDataId → données du site culturel */
export const CULTURE_SITE_DATA: Record<string, CultureSiteData> = {
  littleCulture:   { points: 70,   range: 1 },
  compactCulture:  { points: 300,  range: 1 },
  moderateCulture: { points: 1300, range: 2 },
  premiumCulture:  { points: 1440, range: 2 },
  largeCulture:    { points: 2140, range: 3 },
  luxuriousCulture:{ points: 2000, range: 3 }, // estimation
};

/** Retourne true si le bâtiment est un Cultural Site */
export function isCultureSite(buildingDataId: string): boolean {
  return buildingDataId in CULTURE_SITE_DATA;
}

// ─────────────────────────────────────────────────────────────────────────────
// Happiness effects par bâtiment consommateur
// Source : gamedesign.json → happinessEffects
// Format : [{}, {happiness: N, effect: 0.25}, {happiness: N, effect: 0.5}, {happiness: N, effect: 1.0}]
// ─────────────────────────────────────────────────────────────────────────────

export interface HappinessThreshold {
  /** Happiness requis pour atteindre ce bonus */
  required: number;
  /** Bonus de production (0.25 = +25%, 0.5 = +50%, 1.0 = +100%) */
  effect: number;
}

/**
 * Seuils happiness pour les bâtiments productifs.
 * Valeurs du niveau max LG (Late Gothic Era) — le plus commun.
 */
export const HAPPINESS_THRESHOLDS: Record<string, HappinessThreshold[]> = {
  // Homes (consomment happiness, produisent des workers/coins)
  smallHome:       [{ required: 860,  effect: 0.25 }, { required: 1720, effect: 0.5 }, { required: 3440, effect: 1.0 }],
  averageHome:     [{ required: 860,  effect: 0.25 }, { required: 1720, effect: 0.5 }, { required: 3440, effect: 1.0 }],
  luxuriousHome:   [{ required: 860,  effect: 0.25 }, { required: 1720, effect: 0.5 }, { required: 3440, effect: 1.0 }],
  // Farms
  ruralFarm:       [{ required: 860,  effect: 0.25 }, { required: 1720, effect: 0.5 }, { required: 3440, effect: 1.0 }],
  domesticFarm:    [{ required: 860,  effect: 0.25 }, { required: 1720, effect: 0.5 }, { required: 3440, effect: 1.0 }],
  // Workshops
  artisan:         [{ required: 860,  effect: 0.25 }, { required: 1720, effect: 0.5 }, { required: 3440, effect: 1.0 }],
  carpenter:       [{ required: 860,  effect: 0.25 }, { required: 1720, effect: 0.5 }, { required: 3440, effect: 1.0 }],
  tailor:          [{ required: 860,  effect: 0.25 }, { required: 1720, effect: 0.5 }, { required: 3440, effect: 1.0 }],
  scribe:          [{ required: 860,  effect: 0.25 }, { required: 1720, effect: 0.5 }, { required: 3440, effect: 1.0 }],
  stoneMason:      [{ required: 860,  effect: 0.25 }, { required: 1720, effect: 0.5 }, { required: 3440, effect: 1.0 }],
  spiceMerchant:   [{ required: 860,  effect: 0.25 }, { required: 1720, effect: 0.5 }, { required: 3440, effect: 1.0 }],
  alchemist:       [{ required: 860,  effect: 0.25 }, { required: 1720, effect: 0.5 }, { required: 3440, effect: 1.0 }],
  jeweler:         [{ required: 860,  effect: 0.25 }, { required: 1720, effect: 0.5 }, { required: 3440, effect: 1.0 }],
  glassblower:     [{ required: 860,  effect: 0.25 }, { required: 1720, effect: 0.5 }, { required: 3440, effect: 1.0 }],
};

/** Retourne true si le bâtiment consomme du happiness */
export function isHappinessConsumer(buildingDataId: string): boolean {
  return buildingDataId in HAPPINESS_THRESHOLDS;
}

// ─────────────────────────────────────────────────────────────────────────────
// Calcul de la zone de couverture d'un Cultural Site
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Retourne le rectangle de couverture happiness d'un Cultural Site.
 * Le carré s'étend de `range` tuiles dans chaque direction autour du bâtiment.
 *
 * Port de CityMapEntity.UpdateBounds() avec OverflowRange (fof-hoh) :
 *   OverflowBounds = Rectangle(x - range, y - range, w + range*2, h + range*2)
 */
export function getCultureSiteCoverageRect(entity: CityMapEntity): GridRect | null {
  const data = CULTURE_SITE_DATA[entity.buildingDataId];
  if (!data) return null;

  const b = entity.bounds;
  const r = data.range;
  return {
    x: b.x - r,
    y: b.y - r,
    w: b.w + r * 2,
    h: b.h + r * 2,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Calcul happiness reçu par un bâtiment
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Vérifie si un bâtiment consommateur est dans la zone de couverture
 * d'un Cultural Site (intersection bounds consumer ∩ coverageRect).
 *
 * Port de MapArea + CityStatsProcessor (fof-hoh).
 */
function isInCoverage(consumerBounds: GridRect, coverageRect: GridRect): boolean {
  return (
    consumerBounds.x < coverageRect.x + coverageRect.w &&
    consumerBounds.x + consumerBounds.w > coverageRect.x &&
    consumerBounds.y < coverageRect.y + coverageRect.h &&
    consumerBounds.y + consumerBounds.h > coverageRect.y
  );
}

/**
 * Calcule le happiness total reçu par une entité consommatrice.
 * Somme les points de tous les Cultural Sites dont la zone couvre le bâtiment.
 */
export function calculateReceivedHappiness(
  consumer: CityMapEntity,
  allEntities: ReadonlyMap<number, CityMapEntity>,
): number {
  let total = 0;
  const cb = consumer.bounds;

  for (const entity of allEntities.values()) {
    if (entity.id === consumer.id) continue;
    const coverage = getCultureSiteCoverageRect(entity);
    if (!coverage) continue;
    if (isInCoverage(cb, coverage)) {
      total += CULTURE_SITE_DATA[entity.buildingDataId].points;
    }
  }

  return total;
}

// ─────────────────────────────────────────────────────────────────────────────
// Calcul bonus de production
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Retourne le bonus de production (0 à 1.0) pour un happiness reçu donné.
 *
 * Port de ProductionStatsProcessor.UpdateProduction() (fof-hoh) :
 *   factor = Min(1, ConsumedHappiness / BuffDetails.Value) * BuffDetails.Factor
 *
 * Ici on utilise les seuils discrets du jeu plutôt que la formule continue.
 */
export function getProductionBonus(
  buildingDataId: string,
  receivedHappiness: number,
): number {
  const thresholds = HAPPINESS_THRESHOLDS[buildingDataId];
  if (!thresholds || thresholds.length === 0) return 0;

  let bonus = 0;
  for (const t of thresholds) {
    if (receivedHappiness >= t.required) {
      bonus = t.effect;
    }
  }
  return bonus; // 0, 0.25, 0.5, ou 1.0
}

// ─────────────────────────────────────────────────────────────────────────────
// Stats globales de la ville
// ─────────────────────────────────────────────────────────────────────────────

export interface BuildingHappinessStats {
  entityId:          number;
  buildingDataId:    string;
  receivedHappiness: number;
  productionBonus:   number; // 0 → 1.0
  /** Happiness requis pour le prochain seuil (null si déjà au max) */
  nextThreshold:     number | null;
}

export interface CityHappinessStats {
  /** Total happiness disponible (tous les cultural sites) */
  totalAvailable: number;
  /** Stats par bâtiment consommateur */
  consumers:      BuildingHappinessStats[];
  /** Nombre de bâtiments avec bonus 0% */
  countNoBonus:   number;
  /** Nombre de bâtiments avec bonus +25% */
  count25:        number;
  /** Nombre de bâtiments avec bonus +50% */
  count50:        number;
  /** Nombre de bâtiments avec bonus +100% */
  count100:       number;
}

/**
 * Calcule les stats happiness complètes de la ville en une passe.
 * Port de CityStatsProcessor.Update() (fof-hoh).
 */
export function calculateCityHappinessStats(
  entities: ReadonlyMap<number, CityMapEntity>,
): CityHappinessStats {
  // Happiness total disponible
  let totalAvailable = 0;
  for (const entity of entities.values()) {
    const data = CULTURE_SITE_DATA[entity.buildingDataId];
    if (data) totalAvailable += data.points;
  }

  // Stats par consommateur
  const consumers: BuildingHappinessStats[] = [];
  let countNoBonus = 0, count25 = 0, count50 = 0, count100 = 0;

  for (const entity of entities.values()) {
    if (!isHappinessConsumer(entity.buildingDataId)) continue;

    const received = calculateReceivedHappiness(entity, entities);
    const bonus    = getProductionBonus(entity.buildingDataId, received);

    // Prochain seuil
    const thresholds = HAPPINESS_THRESHOLDS[entity.buildingDataId] ?? [];
    const next = thresholds.find(t => t.required > received);
    const nextThreshold = next?.required ?? null;

    consumers.push({
      entityId:          entity.id,
      buildingDataId:    entity.buildingDataId,
      receivedHappiness: received,
      productionBonus:   bonus,
      nextThreshold,
    });

    if (bonus === 0)   countNoBonus++;
    else if (bonus <= 0.25) count25++;
    else if (bonus <= 0.5)  count50++;
    else                    count100++;
  }

  return { totalAvailable, consumers, countNoBonus, count25, count50, count100 };
}
