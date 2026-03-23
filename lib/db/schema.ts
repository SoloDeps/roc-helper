"use client";

import Dexie, { type Table } from "dexie";
import type { CityLayout } from "@/planner/utils/layoutDB";

export interface TechnoEntity {
  id: string;
  hidden: number;
  cp: number;
}

export interface BuildingEntity {
  id: string;
  qty: number;
  hidden: number;
}

export interface OttomanAreaEntity {
  id: string;
  hidden: number;
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
  hidden: number;
}

export interface CampaignEntity {
  id: string;
  hidden: number;
  cp: number;
}

export class RocWikiDB extends Dexie {
  buildings!: Table<BuildingEntity, string>;
  technos!: Table<TechnoEntity, string>;
  ottomanAreas!: Table<OttomanAreaEntity, string>;
  ottomanTradePosts!: Table<OttomanTradePostEntity, string>;
  campaigns!: Table<CampaignEntity, string>;
  /** Phase 8 — city planner layouts */
  cityLayouts!: Table<CityLayout, string>;

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

    // v5 — city planner layouts
    this.version(5).stores({
      buildings: "id,hidden",
      technos: "id,hidden,cp",
      ottomanAreas: "id,hidden",
      ottomanTradePosts: "id,hidden",
      campaigns: "id,hidden,cp",
      cityLayouts: "id,cityId,updatedAt",
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
