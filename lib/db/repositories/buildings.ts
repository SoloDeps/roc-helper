"use client";

import { getWikiDB } from "../schema";
import type { BuildingEntity } from "../schema";

const now = () => Date.now();

/**
 * Récupère tous les bâtiments
 */
export async function getBuildings(): Promise<BuildingEntity[]> {
  const db = getWikiDB();
  return await db.buildings.toArray();
}

/**
 * Récupère un bâtiment par son ID
 */
export async function getBuilding(
  id: string,
): Promise<BuildingEntity | undefined> {
  const db = getWikiDB();
  return await db.buildings.get(id);
}

/**
 * Sauvegarde ou met à jour un bâtiment
 */
export async function saveBuilding(
  building: Omit<BuildingEntity, "updatedAt">,
): Promise<void> {
  const db = getWikiDB();
  await db.buildings.put({
    ...building,
    hidden: building.hidden ?? false,
    updatedAt: now(),
  } as BuildingEntity);
}

/**
 * Sauvegarde plusieurs bâtiments en une seule transaction
 */
export async function saveBuildings(
  buildings: Omit<BuildingEntity, "updatedAt">[],
): Promise<void> {
  const db = getWikiDB();
  const timestamp = now();

  await db.transaction("rw", db.buildings, async () => {
    for (const building of buildings) {
      await db.buildings.put({
        ...building,
        hidden: building.hidden ?? false,
        updatedAt: timestamp,
      } as BuildingEntity);
    }
  });
}

/**
 * Met à jour la quantité d'un bâtiment
 */
export async function updateBuildingQuantity(
  id: string,
  newQuantity: number,
): Promise<void> {
  const db = getWikiDB();
  const building = await db.buildings.get(id);

  if (!building) return;

  const clampedQuantity = Math.max(
    1,
    Math.min(building.maxQty ?? 40, newQuantity),
  );

  await db.buildings.update(id, {
    quantity: clampedQuantity,
    updatedAt: now(),
  });
}

/**
 * Bascule la visibilité d'un bâtiment (hidden/visible)
 */
export async function toggleBuildingHidden(id: string): Promise<void> {
  const db = getWikiDB();
  const building = await db.buildings.get(id);

  if (!building) return;

  await db.buildings.update(id, {
    hidden: !building.hidden,
    updatedAt: now(),
  });
}

/**
 * Supprime un bâtiment par son ID
 */
export async function removeBuilding(id: string): Promise<void> {
  const db = getWikiDB();
  await db.buildings.delete(id);
}

/**
 * Supprime tous les bâtiments
 */
export async function removeAllBuildings(): Promise<void> {
  const db = getWikiDB();
  await db.buildings.clear();
}

/**
 * Récupère les bâtiments visibles uniquement
 */
export async function getVisibleBuildings(): Promise<BuildingEntity[]> {
  const db = getWikiDB();
  return await db.buildings.filter((building) => !building.hidden).toArray();
}

/**
 * Récupère les bâtiments cachés uniquement
 */
export async function getHiddenBuildings(): Promise<BuildingEntity[]> {
  const db = getWikiDB();
  return await db.buildings.filter((building) => building.hidden).toArray();
}

/**
 * Compte le nombre total de bâtiments
 */
export async function countBuildings(): Promise<number> {
  const db = getWikiDB();
  return await db.buildings.count();
}

/**
 * Compte le nombre de bâtiments visibles
 */
export async function countVisibleBuildings(): Promise<number> {
  const db = getWikiDB();
  return await db.buildings.filter((building) => !building.hidden).count();
}

/**
 * Cache tous les bâtiments
 */
export async function hideAllBuildings(): Promise<void> {
  const db = getWikiDB();
  const buildings = await db.buildings.toArray();
  const timestamp = now();

  await db.buildings.bulkPut(
    buildings.map((b) => ({
      ...b,
      hidden: true,
      updatedAt: timestamp,
    })),
  );
}

/**
 * Affiche tous les bâtiments
 */
export async function showAllBuildings(): Promise<void> {
  const db = getWikiDB();
  const buildings = await db.buildings.toArray();
  const timestamp = now();

  await db.buildings.bulkPut(
    buildings.map((b) => ({
      ...b,
      hidden: false,
      updatedAt: timestamp,
    })),
  );
}

/**
 * Recherche des bâtiments par ID (recherche partielle)
 */
export async function searchBuildingsById(
  searchTerm: string,
): Promise<BuildingEntity[]> {
  const db = getWikiDB();
  const allBuildings = await db.buildings.toArray();

  const lowerSearchTerm = searchTerm.toLowerCase();

  return allBuildings.filter((building) =>
    building.id.toLowerCase().includes(lowerSearchTerm),
  );
}

/**
 * Met à jour les coûts d'un bâtiment
 */
export async function updateBuildingCosts(
  id: string,
  costs: BuildingEntity["costs"],
): Promise<void> {
  const db = getWikiDB();
  await db.buildings.update(id, {
    costs,
    updatedAt: now(),
  });
}

/**
 * Récupère les bâtiments mis à jour récemment (dernières 24h)
 */
export async function getRecentlyUpdatedBuildings(): Promise<BuildingEntity[]> {
  const db = getWikiDB();
  const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;

  return await db.buildings
    .filter((building) => building.updatedAt > oneDayAgo)
    .toArray();
}
