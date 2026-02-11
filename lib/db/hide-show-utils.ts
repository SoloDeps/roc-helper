"use client";

import { getWikiDB } from "@/lib/db/schema";

const now = () => Date.now();

// ============================================================================
// HIDE/SHOW ALL UTILITIES - FIXED VERSION
// ============================================================================

/**
 * Hide all buildings in a group
 * ✅ FIXED: Keep already hidden items hidden, hide visible ones
 */
export async function hideAllBuildings(buildingIds: string[]): Promise<void> {
  const db = getWikiDB();
  const timestamp = now();

  // Get current state of all buildings
  const buildings = await db.buildings.bulkGet(buildingIds);

  // Update only the visible ones to hidden
  const updates = buildings
    .filter((b) => b && !b.hidden)
    .map((b) => ({
      ...b!,
      hidden: true,
      updatedAt: timestamp,
    }));

  if (updates.length > 0) {
    await db.buildings.bulkPut(updates);
  }
}

/**
 * Show all buildings in a group
 * ✅ Sets all buildings to visible
 */
export async function showAllBuildings(buildingIds: string[]): Promise<void> {
  const db = getWikiDB();
  const timestamp = now();

  // Get current state of all buildings
  const buildings = await db.buildings.bulkGet(buildingIds);

  // Update all to visible
  const updates = buildings
    .filter((b) => b)
    .map((b) => ({
      ...b!,
      hidden: false,
      updatedAt: timestamp,
    }));

  if (updates.length > 0) {
    await db.buildings.bulkPut(updates);
  }
}

/**
 * Hide all technos in an era
 * ✅ FIXED: Keep already hidden items hidden, hide visible ones
 */
export async function hideAllTechnosByEra(eraPath: string): Promise<void> {
  const db = getWikiDB();
  const timestamp = now();

  const technos = await db.technos
    .where("id")
    .startsWith(`techno_${eraPath}`)
    .toArray();

  // Update only visible ones
  const updates = technos
    .filter((t) => !t.hidden)
    .map((t) => ({
      ...t,
      hidden: true,
      updatedAt: timestamp,
    }));

  if (updates.length > 0) {
    await db.technos.bulkPut(updates);
  }
}

/**
 * Show all technos in an era
 */
export async function showAllTechnosByEra(eraPath: string): Promise<void> {
  const db = getWikiDB();
  const timestamp = now();

  const technos = await db.technos
    .where("id")
    .startsWith(`techno_${eraPath}`)
    .toArray();

  const updates = technos.map((t) => ({
    ...t,
    hidden: false,
    updatedAt: timestamp,
  }));

  if (updates.length > 0) {
    await db.technos.bulkPut(updates);
  }
}

/**
 * Hide all Ottoman areas
 * ✅ FIXED: Keep already hidden items hidden, hide visible ones
 */
export async function hideAllOttomanAreas(): Promise<void> {
  const db = getWikiDB();
  const timestamp = now();

  const areas = await db.ottomanAreas.toArray();

  const updates = areas
    .filter((a) => !a.hidden)
    .map((a) => ({
      ...a,
      hidden: true,
      updatedAt: timestamp,
    }));

  if (updates.length > 0) {
    await db.ottomanAreas.bulkPut(updates);
  }
}

/**
 * Show all Ottoman areas
 */
export async function showAllOttomanAreas(): Promise<void> {
  const db = getWikiDB();
  const timestamp = now();

  const areas = await db.ottomanAreas.toArray();

  const updates = areas.map((a) => ({
    ...a,
    hidden: false,
    updatedAt: timestamp,
  }));

  if (updates.length > 0) {
    await db.ottomanAreas.bulkPut(updates);
  }
}

/**
 * Hide all Ottoman trade posts
 * ✅ FIXED: Keep already hidden items hidden, hide visible ones
 */
export async function hideAllOttomanTradePosts(): Promise<void> {
  const db = getWikiDB();
  const timestamp = now();

  const tradePosts = await db.ottomanTradePosts.toArray();

  const updates = tradePosts
    .filter((tp) => !tp.hidden)
    .map((tp) => ({
      ...tp,
      hidden: true,
      updatedAt: timestamp,
    }));

  if (updates.length > 0) {
    await db.ottomanTradePosts.bulkPut(updates);
  }
}

/**
 * Show all Ottoman trade posts
 */
export async function showAllOttomanTradePosts(): Promise<void> {
  const db = getWikiDB();
  const timestamp = now();

  const tradePosts = await db.ottomanTradePosts.toArray();

  const updates = tradePosts.map((tp) => ({
    ...tp,
    hidden: false,
    updatedAt: timestamp,
  }));

  if (updates.length > 0) {
    await db.ottomanTradePosts.bulkPut(updates);
  }
}

/**
 * Toggle hide/show for a group of buildings
 * If all are hidden → show all
 * If any are visible → hide all visible (keep hidden ones hidden)
 */
export async function toggleHideAllBuildings(
  buildingIds: string[],
): Promise<void> {
  const db = getWikiDB();

  // Check current state
  const buildings = await db.buildings.bulkGet(buildingIds);
  const allHidden = buildings.every((b) => b?.hidden);

  if (allHidden) {
    await showAllBuildings(buildingIds);
  } else {
    await hideAllBuildings(buildingIds);
  }
}

/**
 * Toggle hide/show for technos in an era
 */
export async function toggleHideAllTechnosByEra(
  eraPath: string,
): Promise<void> {
  const db = getWikiDB();

  const technos = await db.technos
    .where("id")
    .startsWith(`techno_${eraPath}`)
    .toArray();

  const allHidden = technos.every((t) => t.hidden);

  if (allHidden) {
    await showAllTechnosByEra(eraPath);
  } else {
    await hideAllTechnosByEra(eraPath);
  }
}

/**
 * Toggle hide/show for all Ottoman areas
 */
export async function toggleHideAllOttomanAreas(): Promise<void> {
  const db = getWikiDB();

  const areas = await db.ottomanAreas.toArray();
  const allHidden = areas.every((a) => a.hidden);

  if (allHidden) {
    await showAllOttomanAreas();
  } else {
    await hideAllOttomanAreas();
  }
}

/**
 * Toggle hide/show for all Ottoman trade posts
 */
export async function toggleHideAllOttomanTradePosts(): Promise<void> {
  const db = getWikiDB();

  const tradePosts = await db.ottomanTradePosts.toArray();
  const allHidden = tradePosts.every((tp) => tp.hidden);

  if (allHidden) {
    await showAllOttomanTradePosts();
  } else {
    await hideAllOttomanTradePosts();
  }
}
