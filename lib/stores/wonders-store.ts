"use client";

// ============================================================
// ROC Helper – Wonders Store
//
// Thin helpers around the Dexie `userWonders` table.
// Uses the same pattern as the rest of the app:
//   - useLiveQuery for reactive reads
//   - plain async functions for writes
//
// Data lives in roc_wonders_db (see wonders-schema.ts),
// isolated from roc_wiki_db so that resetting the Calculator
// never wipes wonder data.
// ============================================================

import { useLiveQuery } from "dexie-react-hooks";
import { getWondersDB, type UserWonderEntity } from "@/lib/db/wonders-schema";

// Re-export the entity type so consumers can import from a single place.
export type { UserWonderEntity };

// ─── Read hooks ──────────────────────────────────────────────────────────────

/** Returns all user-owned wonders as a map keyed by wonder code. */
export function useUserWondersMap(): Record<string, UserWonderEntity> {
  return (
    useLiveQuery(async () => {
      const db = getWondersDB();
      const rows = await db.userWonders.toArray();
      return Object.fromEntries(rows.map((r) => [r.code, r]));
    }, []) ?? {}
  );
}

/** Returns a single user wonder entry, or undefined if not owned. */
export function useUserWonder(code: string): UserWonderEntity | undefined {
  return useLiveQuery(() => getWondersDB().userWonders.get(code), [code]);
}

/** Returns true if the user owns the wonder with the given code. */
export function useIsWonderOwned(code: string): boolean {
  return useUserWonder(code) !== undefined;
}

// ─── Write helpers ───────────────────────────────────────────────────────────

/**
 * Adds a wonder to the user's collection with the given current level.
 * If already owned, updates the level.
 */
export async function addOrUpdateUserWonder(
  code: string,
  lvl: number,
): Promise<void> {
  const db = getWondersDB();
  await db.userWonders.put({ code, lvl });
}

/** Removes a wonder from the user's collection. */
export async function removeUserWonder(code: string): Promise<void> {
  const db = getWondersDB();
  await db.userWonders.delete(code);
}

/** Updates only the current level of an already-owned wonder. */
export async function updateWonderLevel(
  code: string,
  lvl: number,
): Promise<void> {
  const db = getWondersDB();
  await db.userWonders.update(code, { lvl });
}

/**
 * Unlocks all wonders at once using a bulk put.
 * Existing wonders are NOT downgraded — only unowned ones are added at `lvl`.
 * Pass `overwrite = true` to force every wonder to the given level.
 */
export async function unlockAllWonders(
  codes: string[],
  lvl = 1,
  overwrite = false,
): Promise<void> {
  const db = getWondersDB();
  if (overwrite) {
    await db.userWonders.bulkPut(codes.map((code) => ({ code, lvl })));
  } else {
    const existing = await db.userWonders.toArray();
    const existingCodes = new Set(existing.map((r) => r.code));
    const toAdd = codes
      .filter((code) => !existingCodes.has(code))
      .map((code) => ({ code, lvl }));
    if (toAdd.length > 0) await db.userWonders.bulkPut(toAdd);
  }
}

/**
 * Sets every owned wonder to its maximum level.
 * Wonders not yet owned are ignored.
 */
export async function maxAllOwnedWonders(
  ownedCodes: { code: string; maxLevel: number }[],
): Promise<void> {
  const db = getWondersDB();
  await db.userWonders.bulkPut(
    ownedCodes.map(({ code, maxLevel }) => ({ code, lvl: maxLevel })),
  );
}
