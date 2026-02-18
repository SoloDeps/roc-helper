"use client";

import Dexie, { type Table } from "dexie";

// ============================================================================
// OPTIMIZED ENTITIES - Version Finale (sans migration)
// ============================================================================

/**
 * TechnoEntity - Stocke UNIQUEMENT l'état utilisateur
 * Les données statiques restent dans technos-registry.ts
 */
export interface TechnoEntity {
  id: string; // "tech_eg_0" (nouveau format court)
  hidden: boolean; // Seule donnée qui change !
  updatedAt?: number; // Optionnel pour sync/debug
}

/**
 * BuildingEntity - État utilisateur minimal
 */
export interface BuildingEntity {
  id: string; // "capital_small_home_upgrade_LG_41"
  quantity: number; // Quantité sélectionnée
  hidden: boolean; // Visible/caché
  updatedAt?: number;
}

/**
 * OttomanAreaEntity - État minimal
 */
export interface OttomanAreaEntity {
  id: string; // "ottoman_area_1"
  hidden: boolean;
  updatedAt?: number;
}

/**
 * OttomanTradePostEntity - Niveaux + état
 */
export interface OttomanTradePostEntity {
  id: string; // "ottoman_tp_wheat_trader"
  levels: {
    unlock: boolean;
    lvl2: boolean;
    lvl3: boolean;
    lvl4: boolean;
    lvl5: boolean;
  };
  hidden: boolean;
  updatedAt?: number;
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

    // Version 1: Schéma optimisé minimal (clean start)
    this.version(1).stores({
      buildings: "id,hidden,updatedAt",
      technos: "id,hidden,updatedAt",
      ottomanAreas: "id,hidden,updatedAt",
      ottomanTradePosts: "id,hidden,updatedAt",
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

export const db = typeof window !== "undefined" ? getWikiDB() : null;
