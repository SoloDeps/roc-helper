"use client";

// ============================================================
// ROC Helper – User Presets Database (roc_presets_db)
//
// Isolated from roc_wiki_db and roc_wonders_db so that resetting
// the Calculator or wonders data never wipes user presets.
// ============================================================

import Dexie, { type Table } from "dexie";
import type { UserPreset } from "@/data/wonders/types";

// ─── Database class ──────────────────────────────────────────────────────────

export class RocPresetsDB extends Dexie {
  userPresets!: Table<UserPreset, string>;

  constructor() {
    super("roc_presets_db");

    // v1 — initial presets table. Primary key = preset id.
    this.version(1).stores({
      userPresets: "id,createdAt",
    });
  }
}

// ─── Singleton ───────────────────────────────────────────────────────────────

let presetsDbInstance: RocPresetsDB | null = null;

export function getPresetsDB(): RocPresetsDB {
  if (typeof window === "undefined") {
    throw new Error("Database can only be accessed on client side");
  }
  if (!presetsDbInstance) {
    presetsDbInstance = new RocPresetsDB();
    presetsDbInstance.open().catch((err) => {
      console.error("Failed to open roc_presets_db:", err);
    });
  }
  return presetsDbInstance;
}

export async function resetPresetsDB(): Promise<void> {
  if (presetsDbInstance) {
    presetsDbInstance.close();
    await presetsDbInstance.delete();
    presetsDbInstance = null;
  }
  getPresetsDB();
}
