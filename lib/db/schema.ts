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
  };
  hidden: number; // 0 | 1
}

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

    // Ajout du champ cp (completed) pour séparer la progression du research tree
    // du hidden du calculator. Pas de migration : cp démarre à 0 pour tous.
    this.version(2).stores({
      buildings: "id,hidden",
      technos: "id,hidden,cp",
      ottomanAreas: "id,hidden",
      ottomanTradePosts: "id,hidden",
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
