// ─────────────────────────────────────────────────────────────────────────────
// gameImport.ts
// Import de la vraie ville du joueur depuis l'extension web
// STUB — implémentation complète Phase 5+
// ─────────────────────────────────────────────────────────────────────────────

import type { GridPoint } from '@/planner/core/mapGrid';

// ─────────────────────────────────────────────────────────────────────────────
// Types — format brut intercepté par l'extension
// ─────────────────────────────────────────────────────────────────────────────

export interface RawGameBuilding {
  /** ID complet du jeu — ex: "Building_EarlyGothicEra_Home_Small_1" */
  gameId:       string;
  x:            number;
  /** Y négatif = zone portuaire (Harbor) */
  y:            number;
  /** Champ [18] du proto — niveau absolu */
  level:        number;
  /** Champ [9] === 1 */
  isRotated:    boolean;
  instanceUuid: string;
}

export interface RawGameExpansion {
  id:   string;
  x:    number;
  y:    number;
  type: number; // 0 | 1 | 3
}

export interface RawGameInventoryItem {
  /** camelCase du typeKey proto */
  typeKey:  string;
  quantity: number;
}

export interface RawCityData {
  cityId:    string;
  buildings: RawGameBuilding[];
  expansions: RawGameExpansion[];
  inventory: RawGameInventoryItem[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Décodage zone portuaire
// ─────────────────────────────────────────────────────────────────────────────

const HARBOR_Y_BASE = -34091302929;

export function isHarborBuilding(y: number): boolean {
  return y < 0;
}

export function decodeHarborY(y: number): number {
  return (y - HARBOR_Y_BASE) / 4;
}

// ─────────────────────────────────────────────────────────────────────────────
// Mapping gameId → buildingDataId (clé courte planner)
// Ex: "Building_EarlyGothicEra_Home_Small_1" → "smallHome"
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Convertit un ID jeu complet en clé courte du planner.
 * @throws Error si non implémenté (Phase 5+)
 */
export function gameIdToBuildingDataId(_gameId: string): string | null {
  throw new Error(
    'gameIdToBuildingDataId() not implemented — see Phase 5+ (gameImport.ts)',
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Parser principal — stub
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Parse les données brutes d'une ville (depuis City_*.json intercepté).
 * @throws Error si non implémenté (Phase 5+)
 */
export function parseRawCityJson(_raw: unknown): RawCityData {
  throw new Error(
    'parseRawCityJson() not implemented — see Phase 5+ (gameImport.ts)',
  );
}

/**
 * Retourne les IDs d'expansions débloquées par le joueur (depuis City_*.json).
 * @throws Error si non implémenté (Phase 5+)
 */
export function getUnlockedExpansionIds(_rawCity: RawCityData): Set<string> {
  throw new Error(
    'getUnlockedExpansionIds() not implemented — see Phase 5+ (gameImport.ts)',
  );
}
