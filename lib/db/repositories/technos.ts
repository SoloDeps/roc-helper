"use client";

import { getWikiDB } from "../schema";
import type { TechnoEntity } from "../schema";

const now = () => Date.now();

/**
 * Récupère toutes les technologies
 */
export async function getTechnos(): Promise<TechnoEntity[]> {
  const db = getWikiDB();
  return await db.technos.toArray();
}

/**
 * Récupère une technologie par son ID
 */
export async function getTechno(id: string): Promise<TechnoEntity | undefined> {
  const db = getWikiDB();
  return await db.technos.get(id);
}

/**
 * Sauvegarde ou met à jour une technologie
 */
export async function saveTechno(
  techno: Omit<TechnoEntity, "updatedAt">,
): Promise<void> {
  const db = getWikiDB();
  await db.technos.put({
    ...techno,
    hidden: techno.hidden ?? false,
    updatedAt: now(),
  } as TechnoEntity);
}

/**
 * Sauvegarde plusieurs technologies en une seule transaction
 */
export async function saveTechnos(
  technos: Omit<TechnoEntity, "updatedAt">[],
): Promise<void> {
  const db = getWikiDB();
  const timestamp = now();

  await db.transaction("rw", db.technos, async () => {
    for (const techno of technos) {
      await db.technos.put({
        ...techno,
        hidden: techno.hidden ?? false,
        updatedAt: timestamp,
      } as TechnoEntity);
    }
  });
}

/**
 * Supprime une technologie par son ID
 */
export async function removeTechno(id: string): Promise<void> {
  const db = getWikiDB();
  await db.technos.delete(id);
}

/**
 * Supprime toutes les technologies
 */
export async function removeAllTechnos(): Promise<void> {
  const db = getWikiDB();
  await db.technos.clear();
}

/**
 * Bascule la visibilité de toutes les technologies d'une ère
 */
export async function toggleTechnoHidden(eraPath: string): Promise<void> {
  const db = getWikiDB();
  const technos = await db.technos
    .where("id")
    .startsWith(`techno_${eraPath}`)
    .toArray();

  if (technos.length === 0) return;

  const newHiddenState = !technos[0].hidden;
  const timestamp = now();

  await db.technos.bulkPut(
    technos.map((t) => ({
      ...t,
      hidden: newHiddenState,
      updatedAt: timestamp,
    })),
  );
}

/**
 * Récupère les technologies d'une ère spécifique
 */
export async function getTechnosByEra(
  eraPrefix: string,
): Promise<TechnoEntity[]> {
  const db = getWikiDB();
  return await db.technos
    .where("id")
    .startsWith(`techno_${eraPrefix}`)
    .toArray();
}

/**
 * Supprime toutes les technologies d'une ère (clearEraTechnos)
 */
export async function clearEraTechnos(eraPrefix: string): Promise<void> {
  const db = getWikiDB();
  const toDelete = await getTechnosByEra(eraPrefix);
  await db.technos.bulkDelete(toDelete.map((t) => t.id));
}

/**
 * Récupère les technologies visibles uniquement
 */
export async function getVisibleTechnos(): Promise<TechnoEntity[]> {
  const db = getWikiDB();
  return await db.technos.filter((techno) => !techno.hidden).toArray();
}

/**
 * Récupère les technologies cachées uniquement
 */
export async function getHiddenTechnos(): Promise<TechnoEntity[]> {
  const db = getWikiDB();
  return await db.technos.filter((techno) => techno.hidden).toArray();
}

/**
 * Compte le nombre total de technologies
 */
export async function countTechnos(): Promise<number> {
  const db = getWikiDB();
  return await db.technos.count();
}

/**
 * Compte le nombre de technologies visibles
 */
export async function countVisibleTechnos(): Promise<number> {
  const db = getWikiDB();
  return await db.technos.filter((techno) => !techno.hidden).count();
}

/**
 * Cache toutes les technologies
 */
export async function hideAllTechnos(): Promise<void> {
  const db = getWikiDB();
  const technos = await db.technos.toArray();
  const timestamp = now();

  await db.technos.bulkPut(
    technos.map((t) => ({
      ...t,
      hidden: true,
      updatedAt: timestamp,
    })),
  );
}

/**
 * Affiche toutes les technologies
 */
export async function showAllTechnos(): Promise<void> {
  const db = getWikiDB();
  const technos = await db.technos.toArray();
  const timestamp = now();

  await db.technos.bulkPut(
    technos.map((t) => ({
      ...t,
      hidden: false,
      updatedAt: timestamp,
    })),
  );
}

/**
 * Aplatit et trie les technologies (comme flattenAndSortTechnos)
 */
export async function flattenAndSortTechnos(): Promise<TechnoEntity[]> {
  const technos = await getTechnos();

  // Trier par ID (qui contient l'ère et l'ordre)
  return technos.sort((a, b) => a.id.localeCompare(b.id));
}

/**
 * Calcule le coût total d'une technologie
 */
export function calculateTechnoCost(techno: TechnoEntity): {
  [key: string]: number;
} {
  const totalCosts: { [key: string]: number } = {};

  for (const [key, value] of Object.entries(techno.costs)) {
    if (Array.isArray(value)) {
      // Si c'est un array de ressources (goods)
      for (const resource of value) {
        if (totalCosts[resource.resource]) {
          totalCosts[resource.resource] += resource.amount;
        } else {
          totalCosts[resource.resource] = resource.amount;
        }
      }
    } else if (typeof value === "number") {
      // Si c'est un nombre direct
      if (totalCosts[key]) {
        totalCosts[key] += value;
      } else {
        totalCosts[key] = value;
      }
    }
  }

  return totalCosts;
}

/**
 * Calcule le coût total de toutes les technologies visibles
 */
export async function calculateTotalTechnosCost(): Promise<{
  [key: string]: number;
}> {
  const technos = await getVisibleTechnos();
  const totalCosts: { [key: string]: number } = {};

  for (const techno of technos) {
    const technoCosts = calculateTechnoCost(techno);

    for (const [resource, amount] of Object.entries(technoCosts)) {
      if (totalCosts[resource]) {
        totalCosts[resource] += amount;
      } else {
        totalCosts[resource] = amount;
      }
    }
  }

  return totalCosts;
}

/**
 * Met à jour les coûts d'une technologie
 */
export async function updateTechnoCosts(
  id: string,
  costs: TechnoEntity["costs"],
): Promise<void> {
  const db = getWikiDB();
  await db.technos.update(id, {
    costs,
    updatedAt: now(),
  });
}

/**
 * Récupère les technologies mises à jour récemment (dernières 24h)
 */
export async function getRecentlyUpdatedTechnos(): Promise<TechnoEntity[]> {
  const db = getWikiDB();
  const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;

  return await db.technos
    .filter((techno) => techno.updatedAt > oneDayAgo)
    .toArray();
}
