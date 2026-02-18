"use client";

import { getWikiDB } from "@/lib/db/schema";
import { getEraAbbr } from "@/lib/era-mappings";

// ============================================================================
// DELETE UTILITIES - Pour les accordions
// ============================================================================

/**
 * Delete all buildings in a group
 */
export async function deleteAllBuildings(buildingIds: string[]): Promise<void> {
  const db = getWikiDB();
  await db.buildings.bulkDelete(buildingIds);
}

/**
 * Delete all technos in an era
 * ✅ Adapté au nouveau format: tech_eg_0
 */
export async function deleteAllTechnosByEra(eraId: string): Promise<void> {
  const db = getWikiDB();
  const eraAbbr = getEraAbbr(eraId); // "early_gothic_era" → "eg"

  const technos = await db.technos
    .where("id")
    .startsWith(`tech_${eraAbbr}_`)
    .toArray();

  if (technos.length > 0) {
    await db.technos.bulkDelete(technos.map((t) => t.id));
  }
}

/**
 * Delete all Ottoman areas
 */
export async function deleteAllOttomanAreas(): Promise<void> {
  const db = getWikiDB();
  await db.ottomanAreas.clear();
}

/**
 * Delete all Ottoman trade posts
 */
export async function deleteAllOttomanTradePosts(): Promise<void> {
  const db = getWikiDB();
  await db.ottomanTradePosts.clear();
}

/**
 * Delete all technologies (all eras combined)
 */
export async function deleteAllTechnologies(): Promise<void> {
  const db = getWikiDB();
  await db.technos.clear();
}
