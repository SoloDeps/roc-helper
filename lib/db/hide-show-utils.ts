"use client";

import { getWikiDB } from "@/lib/db/schema";
import { getEraAbbr } from "@/lib/era-mappings";

// ============================================================================
// BUILDINGS — hidden: 0|1
// ============================================================================

export async function hideAllBuildings(buildingIds: string[]): Promise<void> {
  const db = getWikiDB();
  const buildings = await db.buildings.bulkGet(buildingIds);
  const updates = buildings
    .filter((b) => b && !b.hidden)
    .map((b) => ({ ...b!, hidden: 1 as number }));
  if (updates.length > 0) await db.buildings.bulkPut(updates);
}

export async function showAllBuildings(buildingIds: string[]): Promise<void> {
  const db = getWikiDB();
  const buildings = await db.buildings.bulkGet(buildingIds);
  const updates = buildings
    .filter((b) => b)
    .map((b) => ({ ...b!, hidden: 0 as number }));
  if (updates.length > 0) await db.buildings.bulkPut(updates);
}

export async function toggleHideAllBuildings(
  buildingIds: string[],
): Promise<void> {
  const db = getWikiDB();
  const buildings = await db.buildings.bulkGet(buildingIds);
  const allHidden = buildings.every((b) => !!b?.hidden);
  if (allHidden) await showAllBuildings(buildingIds);
  else await hideAllBuildings(buildingIds);
}

// ============================================================================
// TECHNOS — hidden: 0|1
// ============================================================================

export async function hideAllTechnosByEra(eraId: string): Promise<void> {
  const db = getWikiDB();
  const eraAbbr = getEraAbbr(eraId);
  const technos = await db.technos
    .where("id")
    .startsWith(`${eraAbbr}_`)
    .toArray();
  const updates = technos
    .filter((t) => !t.hidden)
    .map((t) => ({ ...t, hidden: 1 as number }));
  if (updates.length > 0) await db.technos.bulkPut(updates);
}

export async function showAllTechnosByEra(eraId: string): Promise<void> {
  const db = getWikiDB();
  const eraAbbr = getEraAbbr(eraId);
  const technos = await db.technos
    .where("id")
    .startsWith(`${eraAbbr}_`)
    .toArray();
  const updates = technos.map((t) => ({ ...t, hidden: 0 as number }));
  if (updates.length > 0) await db.technos.bulkPut(updates);
}

export async function toggleHideAllTechnosByEra(eraId: string): Promise<void> {
  const db = getWikiDB();
  const eraAbbr = getEraAbbr(eraId);
  const technos = await db.technos
    .where("id")
    .startsWith(`${eraAbbr}_`)
    .toArray();
  const allHidden = technos.every((t) => !!t.hidden);
  if (allHidden) await showAllTechnosByEra(eraId);
  else await hideAllTechnosByEra(eraId);
}

// ============================================================================
// OTTOMAN AREAS — hidden: 0|1
// ============================================================================

export async function hideAllOttomanAreas(): Promise<void> {
  const db = getWikiDB();
  const areas = await db.ottomanAreas.toArray();
  const updates = areas
    .filter((a) => !a.hidden)
    .map((a) => ({ ...a, hidden: 1 as number }));
  if (updates.length > 0) await db.ottomanAreas.bulkPut(updates);
}

export async function showAllOttomanAreas(): Promise<void> {
  const db = getWikiDB();
  const areas = await db.ottomanAreas.toArray();
  const updates = areas.map((a) => ({ ...a, hidden: 0 as number }));
  if (updates.length > 0) await db.ottomanAreas.bulkPut(updates);
}

export async function toggleHideAllOttomanAreas(): Promise<void> {
  const db = getWikiDB();
  const areas = await db.ottomanAreas.toArray();
  const allHidden = areas.every((a) => !!a.hidden);
  if (allHidden) await showAllOttomanAreas();
  else await hideAllOttomanAreas();
}

// ============================================================================
// OTTOMAN TRADE POSTS — hidden: 0|1
// ============================================================================

export async function hideAllOttomanTradePosts(): Promise<void> {
  const db = getWikiDB();
  const tradePosts = await db.ottomanTradePosts.toArray();
  const updates = tradePosts
    .filter((tp) => !tp.hidden)
    .map((tp) => ({ ...tp, hidden: 1 as number }));
  if (updates.length > 0) await db.ottomanTradePosts.bulkPut(updates);
}

export async function showAllOttomanTradePosts(): Promise<void> {
  const db = getWikiDB();
  const tradePosts = await db.ottomanTradePosts.toArray();
  const updates = tradePosts.map((tp) => ({ ...tp, hidden: 0 as number }));
  if (updates.length > 0) await db.ottomanTradePosts.bulkPut(updates);
}

export async function toggleHideAllOttomanTradePosts(): Promise<void> {
  const db = getWikiDB();
  const tradePosts = await db.ottomanTradePosts.toArray();
  const allHidden = tradePosts.every((tp) => !!tp.hidden);
  if (allHidden) await showAllOttomanTradePosts();
  else await hideAllOttomanTradePosts();
}

// ============================================================================
// GLOBAL
// ============================================================================

export async function hideAllEntities(): Promise<void> {
  const db = getWikiDB();
  const [buildings, technos, areas, tradePosts] = await Promise.all([
    db.buildings.toArray(),
    db.technos.toArray(),
    db.ottomanAreas.toArray(),
    db.ottomanTradePosts.toArray(),
  ]);

  await Promise.all(
    [
      buildings.filter((b) => !b.hidden).length > 0 &&
        db.buildings.bulkPut(
          buildings
            .filter((b) => !b.hidden)
            .map((b) => ({ ...b, hidden: 1 as number })),
        ),
      technos.filter((t) => !t.hidden).length > 0 &&
        db.technos.bulkPut(
          technos
            .filter((t) => !t.hidden)
            .map((t) => ({ ...t, hidden: 1 as number })),
        ),
      areas.filter((a) => !a.hidden).length > 0 &&
        db.ottomanAreas.bulkPut(
          areas
            .filter((a) => !a.hidden)
            .map((a) => ({ ...a, hidden: 1 as number })),
        ),
      tradePosts.filter((tp) => !tp.hidden).length > 0 &&
        db.ottomanTradePosts.bulkPut(
          tradePosts
            .filter((tp) => !tp.hidden)
            .map((tp) => ({ ...tp, hidden: 1 as number })),
        ),
    ].filter(Boolean),
  );
}

export async function showAllEntities(): Promise<void> {
  const db = getWikiDB();
  const [buildings, technos, areas, tradePosts] = await Promise.all([
    db.buildings.toArray(),
    db.technos.toArray(),
    db.ottomanAreas.toArray(),
    db.ottomanTradePosts.toArray(),
  ]);

  await Promise.all([
    db.buildings.bulkPut(buildings.map((b) => ({ ...b, hidden: 0 as number }))),
    db.technos.bulkPut(technos.map((t) => ({ ...t, hidden: 0 as number }))),
    db.ottomanAreas.bulkPut(areas.map((a) => ({ ...a, hidden: 0 as number }))),
    db.ottomanTradePosts.bulkPut(
      tradePosts.map((tp) => ({ ...tp, hidden: 0 as number })),
    ),
  ]);
}
