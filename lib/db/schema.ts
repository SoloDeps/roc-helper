"use client";

import Dexie, { type Table } from "dexie";

export interface TechnoEntity {
  id: string; // "eg_0"
  hidden: number; // 0 | 1 — calculator uniquement (exclure du total)
  cp: number; // 0 | 1 — research tree uniquement (techno complétée)
}

export interface BuildingEntity {
  id: string;
  qty: number;
  hidden: number; // 0 | 1
}

export interface OttomanAreaEntity {
  id: string;
  hidden: number; // 0 | 1
}

export interface OttomanTradePostEntity {
  id: string;
  levels: {
    unlock: number;
    lvl2: number;
    lvl3: number;
    lvl4: number;
    lvl5: number;
    lvl6: number;
  };
  hidden: number; // 0 | 1
}

export interface CampaignEntity {
  id: string;    // e.g. "sa_2"
  hidden: number; // 0 | 1
  cp: number;     // 0 | 1
}

// ─── World Wonders ───────────────────────────────────────────────────────────

/**
 * Represents a Wonder owned by the user.
 * Keyed by Wonder short code (e.g. "SH", "LToP").
 *
 * `currentLevel` — the level the user has currently reached (0–30).
 *
 * Future fields to add for City Planner:
 *   targetLevel?: number;
 *   slotIndex?: number;   // which capital/allied slot (0–3)
 */
export interface UserWonderEntity {
  /** Wonder short code — primary key (e.g. "SH", "LToP"). */
  code: string;
  /** Current level reached by the user (0–30). 0 = owned but not levelled. */
  currentLevel: number;
}

export class RocWikiDB extends Dexie {
  buildings!: Table<BuildingEntity, string>;
  technos!: Table<TechnoEntity, string>;
  ottomanAreas!: Table<OttomanAreaEntity, string>;
  ottomanTradePosts!: Table<OttomanTradePostEntity, string>;
  campaigns!: Table<CampaignEntity, string>;
  // v5 — World Wonders
  userWonders!: Table<UserWonderEntity, string>;

  constructor() {
    super("roc_wiki_db");

    this.version(1).stores({
      buildings: "id,hidden",
      technos: "id,hidden",
      ottomanAreas: "id,hidden",
      ottomanTradePosts: "id,hidden",
    });

    this.version(2).stores({
      buildings: "id,hidden",
      technos: "id,hidden,cp",
      ottomanAreas: "id,hidden",
      ottomanTradePosts: "id,hidden",
    });

    this.version(3).stores({
      buildings: "id,hidden",
      technos: "id,hidden,cp",
      ottomanAreas: "id,hidden",
      ottomanTradePosts: "id,hidden",
    });

    this.version(4).stores({
      buildings: "id,hidden",
      technos: "id,hidden,cp",
      ottomanAreas: "id,hidden",
      ottomanTradePosts: "id,hidden",
      campaigns: "id,hidden,cp",
    });

    // v5 — add userWonders table.
    // Primary key = wonder code (e.g. "SH").
    // No data migration needed; table starts empty.
    this.version(5).stores({
      buildings: "id,hidden",
      technos: "id,hidden,cp",
      ottomanAreas: "id,hidden",
      ottomanTradePosts: "id,hidden",
      campaigns: "id,hidden,cp",
      userWonders: "code,currentLevel",
    });
  }
}

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

export async function resetWikiDB(): Promise<void> {
  if (wikiDbInstance) {
    wikiDbInstance.close();
    await wikiDbInstance.delete();
    wikiDbInstance = null;
  }
  getWikiDB();
}

export function areaIndexToId(index: number): string {
  return `oa_${index}`;
}
export function idToAreaIndex(id: string): number {
  return parseInt(id.replace("oa_", ""));
}

export function tradePostIndexToId(index: number): string {
  return `otp_${index}`;
}
export function idToTradePostIndex(id: string): number {
  return parseInt(id.replace("otp_", ""));
}
