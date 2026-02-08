"use client";

import { getWikiDB } from "../schema";
import type { OttomanAreaEntity } from "../schema";

const now = () => Date.now();

/**
 * Récupère toutes les zones ottomanes
 */
export async function getOttomanAreas(): Promise<OttomanAreaEntity[]> {
  const db = getWikiDB();
  return await db.ottomanAreas.toArray();
}

/**
 * Récupère une zone ottomane par son ID
 */
export async function getOttomanArea(
  id: string,
): Promise<OttomanAreaEntity | undefined> {
  const db = getWikiDB();
  return await db.ottomanAreas.get(id);
}

/**
 * Sauvegarde ou met à jour une zone ottomane
 */
export async function saveOttomanArea(
  area: Omit<OttomanAreaEntity, "updatedAt">,
): Promise<void> {
  const db = getWikiDB();
  await db.ottomanAreas.put({
    ...area,
    hidden: area.hidden ?? false,
    updatedAt: now(),
  } as OttomanAreaEntity);
}

/**
 * Sauvegarde plusieurs zones en une seule transaction
 */
export async function saveOttomanAreas(
  areas: Omit<OttomanAreaEntity, "updatedAt">[],
): Promise<void> {
  const db = getWikiDB();
  const timestamp = now();

  await db.transaction("rw", db.ottomanAreas, async () => {
    for (const area of areas) {
      await db.ottomanAreas.put({
        ...area,
        hidden: area.hidden ?? false,
        updatedAt: timestamp,
      } as OttomanAreaEntity);
    }
  });
}

/**
 * Bascule la visibilité d'une zone ottomane
 */
export async function toggleOttomanAreaHidden(id: string): Promise<void> {
  const db = getWikiDB();
  const area = await db.ottomanAreas.get(id);

  if (!area) return;

  await db.ottomanAreas.update(id, {
    hidden: !area.hidden,
    updatedAt: now(),
  });
}

/**
 * Supprime une zone ottomane par son ID
 */
export async function removeOttomanArea(id: string): Promise<void> {
  const db = getWikiDB();
  await db.ottomanAreas.delete(id);
}

/**
 * Supprime toutes les zones ottomanes
 */
export async function removeAllOttomanAreas(): Promise<void> {
  const db = getWikiDB();
  await db.ottomanAreas.clear();
}

/**
 * Cache toutes les zones ottomanes
 */
export async function hideAllOttomanAreas(): Promise<void> {
  const db = getWikiDB();
  const areas = await db.ottomanAreas.toArray();
  const timestamp = now();

  await db.ottomanAreas.bulkPut(
    areas.map((a) => ({
      ...a,
      hidden: true,
      updatedAt: timestamp,
    })),
  );
}

/**
 * Affiche toutes les zones ottomanes
 */
export async function showAllOttomanAreas(): Promise<void> {
  const db = getWikiDB();
  const areas = await db.ottomanAreas.toArray();
  const timestamp = now();

  await db.ottomanAreas.bulkPut(
    areas.map((a) => ({
      ...a,
      hidden: false,
      updatedAt: timestamp,
    })),
  );
}

/**
 * Récupère les zones visibles uniquement
 */
export async function getVisibleOttomanAreas(): Promise<OttomanAreaEntity[]> {
  const db = getWikiDB();
  return await db.ottomanAreas.filter((area) => !area.hidden).toArray();
}

/**
 * Récupère les zones cachées uniquement
 */
export async function getHiddenOttomanAreas(): Promise<OttomanAreaEntity[]> {
  const db = getWikiDB();
  return await db.ottomanAreas.filter((area) => area.hidden).toArray();
}

/**
 * Récupère les zones triées par areaIndex
 */
export async function getOttomanAreasSorted(): Promise<OttomanAreaEntity[]> {
  const areas = await getOttomanAreas();
  return areas.sort((a, b) => a.areaIndex - b.areaIndex);
}

/**
 * Compte le nombre total de zones
 */
export async function countOttomanAreas(): Promise<number> {
  const db = getWikiDB();
  return await db.ottomanAreas.count();
}

/**
 * Compte le nombre de zones visibles
 */
export async function countVisibleOttomanAreas(): Promise<number> {
  const db = getWikiDB();
  return await db.ottomanAreas.filter((area) => !area.hidden).count();
}

/**
 * Met à jour les coûts d'une zone
 */
export async function updateOttomanAreaCosts(
  id: string,
  costs: OttomanAreaEntity["costs"],
): Promise<void> {
  const db = getWikiDB();
  await db.ottomanAreas.update(id, {
    costs,
    updatedAt: now(),
  });
}

/**
 * Récupère une zone par son index
 */
export async function getOttomanAreaByIndex(
  areaIndex: number,
): Promise<OttomanAreaEntity | undefined> {
  const db = getWikiDB();
  const areas = await db.ottomanAreas
    .where("areaIndex")
    .equals(areaIndex)
    .toArray();

  return areas[0];
}
