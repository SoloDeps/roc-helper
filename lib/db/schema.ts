"use client";

import Dexie, { type Table } from "dexie";

// ============================================================================
// OPTIMIZED ENTITIES — hidden: 0|1 partout, levels: 0|1, qty pour buildings
// ============================================================================

export interface TechnoEntity {
  id: string; // "eg_0"
  hidden: number; // 0 | 1
}

export interface BuildingEntity {
  id: string;
  qty: number; // ex-quantity
  hidden: number; // 0 | 1
}

export interface OttomanAreaEntity {
  id: string; // "oa_{index}" ex: "oa_1"
  hidden: number; // 0 | 1
}

export interface OttomanTradePostEntity {
  id: string; // "otp_{index}" ex: "otp_5"
  levels: {
    unlock: number; // 0 | 1
    lvl2: number; // 0 | 1
    lvl3: number; // 0 | 1
    lvl4: number; // 0 | 1
    lvl5: number; // 0 | 1
  };
  hidden: number; // 0 | 1
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

    this.version(1).stores({
      buildings: "id,hidden",
      technos: "id,hidden",
      ottomanAreas: "id,hidden",
      ottomanTradePosts: "id,hidden",
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

// ============================================================================
// HELPERS — Conversion id techno
// ============================================================================

/** "oa_1" helpers */
export function areaIndexToId(index: number): string {
  return `oa_${index}`;
}
export function idToAreaIndex(id: string): number {
  return parseInt(id.replace("oa_", ""));
}

/** "otp_5" helpers */
export function tradePostIndexToId(index: number): string {
  return `otp_${index}`;
}
export function idToTradePostIndex(id: string): number {
  return parseInt(id.replace("otp_", ""));
}