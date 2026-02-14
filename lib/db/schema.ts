"use client";

import Dexie, { type Table } from "dexie";

// ============================================================================
// OPTIMIZED ENTITIES - Version 2
// ============================================================================

/**
 * Building Entity - Optimized flat structure
 * Pas de `parsed` redondant, tout est direct
 */
export interface BuildingEntity {
  // Identifiants
  id: string; // Format: {category}_{elementId}_{type}_{era}_{level} (ex: capital_small_home_upgrade_LG_41)

  // Display (accès direct, pas de parsing)
  name: string; // "Small Home"
  imageName: string; // wiki image name
  imgLvl: boolean; // true if img name have _Lv (ex: Capital_Small_Home_Lv1)

  // Classification (pour filtres - remplace `parsed`)
  category: string; // "capital" | "egypt" | "china" | etc.
  subcategory: string; // "homes" | "farms" | "barracks" | etc.
  elementId: string; // "small_home"

  // Configuration du niveau
  type: "construction" | "upgrade";
  era: string; // "BA", "SA", "ME", etc.
  level: number; // 1, 2, 3...

  // Coûts UNITAIRES (pas multipliés par quantity)
  costs: {
    resources: Record<string, number>; // { coins: 100, food: 50, aspers: 20 }
    goods: Array<{
      type: string; // "bronze_bracelet" ou "Primary_BA"
      amount: number;
    }>;
  };

  // Quantité
  quantity: number; // Quantité sélectionnée par l'utilisateur
  maxQty: number; // Max autorisé pour cet era

  // État
  hidden: boolean;

  // Metadata
  createdAt: number;
  updatedAt: number;
}

/**
 * Technology Entity - Optimized
 */

export interface TechnoEntity {
  id: string; // Format: "techno_early_gothic_era_0"

  // Display
  name: string; // "Flying Buttresses"

  // Classification
  category: "technology"; // Toujours "technology"
  era: string; // Abbreviation de l'ère: "EG", "LG", "SA", etc.
  eraId: string; // ID complet: "early_gothic_era", "late_gothic_era"
  column: number; // Position dans l'arbre tech (0, 1, 2...)

  // Allied City (optionnel)
  allied?: string; // "ottoman", "egypt", etc.

  // Coûts INDIVIDUELS (pas la somme)
  costs: {
    resources: Record<string, number>; // { research_points: 100, coins: 2900000, food: 3500000 }
    goods: Array<{ type: string; amount: number }>; // [{ type: "tertiary_hm", amount: 13500 }]
  };

  // Progression (pour future page tracker)
  hidden: boolean; // true = techno complétée/cachée (n'apparaît plus dans la somme)

  // Metadata
  createdAt: number;
  updatedAt: number;
}

/**
 * Ottoman Area Entity
 */
export interface OttomanAreaEntity {
  id: string;

  // Classification
  areaIndex: number;

  // Coûts
  costs: {
    resources: Record<string, number>;
    goods: Array<{ type: string; amount: number }>;
  };

  // État
  hidden: boolean;

  // Metadata
  createdAt: number;
  updatedAt: number;
}

/**
 * Ottoman Trade Post Entity
 */
export interface OttomanTradePostEntity {
  id: string;

  // Display
  name: string;

  // Classification
  area: number;
  resource: string; // Type de ressource produite

  // Configuration des niveaux
  levels: {
    unlock: boolean;
    lvl2: boolean;
    lvl3: boolean;
    lvl4: boolean;
    lvl5: boolean;
  };

  // Coûts (calculés selon les niveaux activés)
  costs: {
    resources: Record<string, number>;
    goods: Array<{ type: string; amount: number }>;
  };

  // Données source pour recalcul
  sourceData?: {
    levels: {
      [key: number]: Array<{ resource: string; amount: number }>;
    };
  };

  // État
  hidden: boolean;

  // Metadata
  createdAt: number;
  updatedAt: number;
}

// ============================================================================
// DATABASE SCHEMA
// ============================================================================

export class RocWikiDB extends Dexie {
  buildings!: Table<BuildingEntity, string>;
  technos!: Table<TechnoEntity, string>;
  ottomanAreas!: Table<OttomanAreaEntity, string>;
  ottomanTradePosts!: Table<OttomanTradePostEntity, string>;

  constructor() {
    super("roc_wiki_db");

    // Version 1: Tables initiales
    this.version(1).stores({
      buildings: "id,createdAt,updatedAt",
      technos: "id,createdAt,updatedAt",
    });

    // Version 2: Ottoman tables
    this.version(2).stores({
      buildings: "id,createdAt,updatedAt",
      technos: "id,createdAt,updatedAt",
      ottomanAreas: "id,areaIndex,createdAt,updatedAt",
      ottomanTradePosts: "id,area,createdAt,updatedAt",
    });

    // Version 3: Index optimisés pour filtres
    this.version(3).stores({
      buildings: "id,category,subcategory,type,era,hidden,createdAt,updatedAt",
      technos: "id,category,era,hidden,createdAt,updatedAt",
      ottomanAreas: "id,areaIndex,hidden,createdAt,updatedAt",
      ottomanTradePosts: "id,area,hidden,createdAt,updatedAt",
    });
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

let wikiDbInstance: RocWikiDB | null = null;

export function getWikiDB(): RocWikiDB {
  if (typeof window === "undefined") {
    throw new Error("Database can only be accessed on client side");
  }

  if (!wikiDbInstance) {
    wikiDbInstance = new RocWikiDB();
    wikiDbInstance.open().catch((err) => {
      console.error("Failed to open roc_wiki_db:", err);
    });
  }

  return wikiDbInstance;
}

// Export legacy pour compatibilité
export const db = typeof window !== "undefined" ? getWikiDB() : null;

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Génère un ID unique et prévisible pour une entité
 * Format: {category}_{elementId}_{type}_{era}_{level}
 * Exemple: capital_small_home_upgrade_LG_41
 *
 * ✅ Cet ID permet de détecter facilement les doublons
 */
export function generateEntityId(
  category: string,
  elementId: string,
  era: string,
  level: number,
  type: "construction" | "upgrade",
): string {
  return `${category}_${elementId}_${type}_${era}_${level}`;
}

/**
 * Parse les coûts depuis le format data vers le format entity
 */
export function parseCostsToEntity(rawCosts: any): BuildingEntity["costs"] {
  const resources: Record<string, number> = {};
  const goodsArray: Array<{ type: string; amount: number }> = [];

  Object.entries(rawCosts).forEach(([key, value]) => {
    if (key === "goods" && Array.isArray(value)) {
      // Format des goods depuis les data files
      value.forEach((item: any) => {
        goodsArray.push({
          type: item.resource || item.type,
          amount: item.amount,
        });
      });
    } else if (typeof value === "number") {
      // Ressources simples
      resources[key] = value;
    }
  });

  return { resources, goods: goodsArray };
}

/**
 * Calcule les coûts totaux (resources × quantity)
 */
export function calculateTotalCosts(
  entity: BuildingEntity | TechnoEntity,
  quantity: number = 1,
): {
  resources: Record<string, number>;
  goods: Array<{ type: string; amount: number }>;
} {
  const totalResources: Record<string, number> = {};
  const totalGoods: Array<{ type: string; amount: number }> = [];

  // Resources
  Object.entries(entity.costs.resources).forEach(([type, amount]) => {
    totalResources[type] = amount * quantity;
  });

  // Goods
  entity.costs.goods.forEach((good) => {
    totalGoods.push({
      type: good.type,
      amount: good.amount * quantity,
    });
  });

  return { resources: totalResources, goods: totalGoods };
}
