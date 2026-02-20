"use client";

import { getWikiDB, techIdToDbId, dbIdToTechId } from "../schema";
import type { TechnoEntity } from "../schema";

/**
 * Récupère toutes les technologies
 */
export async function getTechnos(): Promise<TechnoEntity[]> {
  const db = getWikiDB();
  return await db.technos.toArray();
}

/**
 * Récupère une technologie par son ID complet (ex: "tech_eg_0")
 */
export async function getTechno(id: string): Promise<TechnoEntity | undefined> {
  const db = getWikiDB();
  return await db.technos.get(techIdToDbId(id));
}

/**
 * Sauvegarde ou met à jour une technologie
 */
export async function saveTechno(techno: TechnoEntity): Promise<void> {
  const db = getWikiDB();
  await db.technos.put({
    id: techIdToDbId(techno.id),
    hidden: techno.hidden ? 1 : 0,
  });
}

/**
 * Supprime une technologie par son ID complet (ex: "tech_eg_0")
 */
export async function removeTechno(id: string): Promise<void> {
  const db = getWikiDB();
  await db.technos.delete(techIdToDbId(id));
}

/**
 * Supprime toutes les technologies
 */
export async function removeAllTechnos(): Promise<void> {
  const db = getWikiDB();
  await db.technos.clear();
}

/**
 * Récupère les technologies d'une ère spécifique
 * eraAbbr: "eg", "lg", "sa", etc.
 */
export async function getTechnosByEra(
  eraAbbr: string,
): Promise<TechnoEntity[]> {
  const db = getWikiDB();
  return await db.technos.where("id").startsWith(`${eraAbbr}_`).toArray();
}

/**
 * Supprime toutes les technologies d'une ère
 */
export async function clearEraTechnos(eraAbbr: string): Promise<void> {
  const db = getWikiDB();
  const toDelete = await getTechnosByEra(eraAbbr);
  await db.technos.bulkDelete(toDelete.map((t) => t.id));
}

/**
 * Récupère les technologies visibles uniquement
 */
export async function getVisibleTechnos(): Promise<TechnoEntity[]> {
  const db = getWikiDB();
  return await db.technos.filter((t) => !t.hidden).toArray();
}

/**
 * Compte le nombre total de technologies
 */
export async function countTechnos(): Promise<number> {
  const db = getWikiDB();
  return await db.technos.count();
}

/**
 * Cache toutes les technologies
 */
export async function hideAllTechnos(): Promise<void> {
  const db = getWikiDB();
  const technos = await db.technos.toArray();
  await db.technos.bulkPut(technos.map((t) => ({ ...t, hidden: 1 as number })));
}

/**
 * Affiche toutes les technologies
 */
export async function showAllTechnos(): Promise<void> {
  const db = getWikiDB();
  const technos = await db.technos.toArray();
  await db.technos.bulkPut(technos.map((t) => ({ ...t, hidden: 0 as number })));
}

/**
 * Aplatit et trie les technologies
 */
export async function flattenAndSortTechnos(): Promise<TechnoEntity[]> {
  const technos = await getTechnos();
  return technos.sort((a, b) => a.id.localeCompare(b.id));
}
