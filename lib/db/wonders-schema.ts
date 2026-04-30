"use client";

// ============================================================
// ROC Helper – Wonders Database (roc_wonders_db)
//
// Isolated from roc_wiki_db so that resetting the Calculator
// or other sections never wipes user wonder data.
// ============================================================

import Dexie, { type Table } from "dexie";

// ─── Entities ────────────────────────────────────────────────────────────────

/**
 * Represents a Wonder owned by the user.
 * Keyed by Wonder short code (e.g. "SH", "LToP").
 *
 * `lvl` — the level the user has currently reached (0–30).
 *
 * Future fields to add for City Planner:
 *   targetLevel?: number;
 *   slotIndex?: number;   // which capital/allied slot (0–3)
 */
export interface UserWonderEntity {
  /** Wonder short code — primary key (e.g. "SH", "LToP"). */
  code: string;
  /** Current level reached by the user (0–30). 0 = owned but not levelled. */
  lvl: number;
}

// ─── Database class ──────────────────────────────────────────────────────────

export class RocWondersDB extends Dexie {
  userWonders!: Table<UserWonderEntity, string>;

  constructor() {
    super("roc_wonders_db");

    // v1 — initial wonders table.
    // Primary key = wonder code (e.g. "SH").
    this.version(1).stores({
      userWonders: "code,lvl",
    });
  }
}

// ─── Singleton ───────────────────────────────────────────────────────────────

let wondersDbInstance: RocWondersDB | null = null;

export function getWondersDB(): RocWondersDB {
  if (typeof window === "undefined") {
    throw new Error("Database can only be accessed on client side");
  }
  if (!wondersDbInstance) {
    wondersDbInstance = new RocWondersDB();
    wondersDbInstance.open().catch((err) => {
      console.error("Failed to open roc_wonders_db:", err);
    });
  }
  return wondersDbInstance;
}

export async function resetWondersDB(): Promise<void> {
  if (wondersDbInstance) {
    wondersDbInstance.close();
    await wondersDbInstance.delete();
    wondersDbInstance = null;
  }
  getWondersDB();
}
