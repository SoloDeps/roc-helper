"use client";

// ============================================================
// ROC Helper – Wonders Store
//
// Thin helpers around the Dexie `userWonders` table.
// Uses the same pattern as the rest of the app:
//   - useLiveQuery for reactive reads
//   - plain async functions for writes
// ============================================================

import { useLiveQuery } from "dexie-react-hooks";
import { getWikiDB, type UserWonderEntity } from "@/lib/db/schema";

// ─── Read hooks ──────────────────────────────────────────────────────────────

/** Returns all user-owned wonders as a map keyed by wonder code. */
export function useUserWondersMap(): Record<string, UserWonderEntity> {
  return (
    useLiveQuery(async () => {
      const db = getWikiDB();
      const rows = await db.userWonders.toArray();
      return Object.fromEntries(rows.map((r) => [r.code, r]));
    }, []) ?? {}
  );
}

/** Returns a single user wonder entry, or undefined if not owned. */
export function useUserWonder(code: string): UserWonderEntity | undefined {
  return useLiveQuery(() => getWikiDB().userWonders.get(code), [code]);
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
  currentLevel: number
): Promise<void> {
  const db = getWikiDB();
  await db.userWonders.put({ code, currentLevel });
}

/** Removes a wonder from the user's collection. */
export async function removeUserWonder(code: string): Promise<void> {
  const db = getWikiDB();
  await db.userWonders.delete(code);
}

/** Updates only the current level of an already-owned wonder. */
export async function updateWonderLevel(
  code: string,
  currentLevel: number
): Promise<void> {
  const db = getWikiDB();
  await db.userWonders.update(code, { currentLevel });
}
