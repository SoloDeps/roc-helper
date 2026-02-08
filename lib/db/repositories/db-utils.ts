"use client";

import { getWikiDB } from "../schema";
import type {
  BuildingEntity,
  TechnoEntity,
  OttomanAreaEntity,
  OttomanTradePostEntity,
} from "../schema";
import { slugify } from "@/lib/utils";

const now = () => Date.now();

/**
 * Helper pour normaliser les costs (goods uniquement)
 */
function normalizeCosts(
  costs:
    | BuildingEntity["costs"]
    | TechnoEntity["costs"]
    | OttomanAreaEntity["costs"]
    | OttomanTradePostEntity["costs"],
) {
  const normalized = { ...costs };

  if (Array.isArray(normalized.goods)) {
    normalized.goods = normalized.goods.map((g) => ({
      type: slugify(g.type),
      amount: g.amount,
    }));
  }

  return normalized;
}

/**
 * Exporte toutes les données au format JSON (presets)
 */
export async function exportPresetsJSON(): Promise<void> {
  try {
    const db = getWikiDB();

    const [buildings, technos, ottomanAreas, ottomanTradePosts] =
      await Promise.all([
        db.buildings.toArray(),
        db.technos.toArray(),
        db.ottomanAreas.toArray(),
        db.ottomanTradePosts.toArray(),
      ]);

    const cleanBuildings = buildings.map(({ id, quantity, maxQty, costs }) => ({
      id,
      quantity,
      maxQty,
      costs: normalizeCosts(costs),
    }));

    const cleanTechnos = technos.map(({ id, costs }) => ({
      id,
      costs: normalizeCosts(costs),
    }));

    const cleanOttomanAreas = ottomanAreas.map(({ id, areaIndex, costs }) => ({
      id,
      areaIndex,
      costs: normalizeCosts(costs),
    }));

    const cleanOttomanTradePosts = ottomanTradePosts.map(
      ({ id, name, hidden, area, resource, levels, costs, sourceData }) => ({
        id,
        name,
        hidden,
        area,
        resource,
        levels,
        costs: normalizeCosts(costs),
        sourceData,
      }),
    );

    const json = {
      buildings: cleanBuildings,
      technos: cleanTechnos,
      ottomanAreas: cleanOttomanAreas,
      ottomanTradePosts: cleanOttomanTradePosts,
    };

    const blob = new Blob([JSON.stringify(json, null, 2)], {
      type: "application/json",
    });

    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);

    const timestamp = new Date().toISOString().slice(0, 10);
    a.download = `preset_${timestamp}.json`;

    a.click();

    URL.revokeObjectURL(a.href);

    console.log(
      `✅ Exported ${cleanBuildings.length} buildings, ${cleanTechnos.length} technos, ${cleanOttomanAreas.length} areas, ${cleanOttomanTradePosts.length} trade posts`,
    );
  } catch (error) {
    console.error("Export presets failed:", error);
    throw error;
  }
}

/**
 * Importe des données depuis un preset JSON
 */
export async function importPresetsJSON(jsonData: string): Promise<void> {
  try {
    const data = JSON.parse(jsonData);
    const db = getWikiDB();
    const timestamp = now();

    // Import buildings
    if (Array.isArray(data.buildings)) {
      await db.buildings.bulkPut(
        data.buildings.map((b: any) => ({
          ...b,
          hidden: false,
          updatedAt: timestamp,
        })),
      );
    }

    // Import technos
    if (Array.isArray(data.technos)) {
      await db.technos.bulkPut(
        data.technos.map((t: any) => ({
          ...t,
          hidden: false,
          updatedAt: timestamp,
        })),
      );
    }

    // Import ottoman areas
    if (Array.isArray(data.ottomanAreas)) {
      await db.ottomanAreas.bulkPut(
        data.ottomanAreas.map((a: any) => ({
          ...a,
          hidden: false,
          updatedAt: timestamp,
        })),
      );
    }

    // Import ottoman trade posts
    if (Array.isArray(data.ottomanTradePosts)) {
      await db.ottomanTradePosts.bulkPut(
        data.ottomanTradePosts.map((tp: any) => ({
          ...tp,
          hidden: tp.hidden ?? false,
          updatedAt: timestamp,
        })),
      );
    }

    console.log("✅ Import completed successfully");
  } catch (error) {
    console.error("Import presets failed:", error);
    throw new Error("Failed to import presets. Please check the file format.");
  }
}

/**
 * Sauvegarde en batch pour n'importe quelle table
 */
export async function saveBatch<
  T extends { updatedAt?: number; hidden?: boolean },
>(
  table: "buildings" | "technos" | "ottomanAreas" | "ottomanTradePosts",
  items: Omit<T, "updatedAt" | "hidden">[],
): Promise<T[]> {
  const db = getWikiDB();
  const timestamp = now();

  const itemsWithMeta = items.map((item) => ({
    ...item,
    hidden: false,
    updatedAt: timestamp,
  })) as T[];

  await db[table].bulkPut(itemsWithMeta as any);

  return itemsWithMeta;
}

/**
 * Efface toutes les données de la base
 */
export async function clearAllData(): Promise<void> {
  const db = getWikiDB();

  await Promise.all([
    db.buildings.clear(),
    db.technos.clear(),
    db.ottomanAreas.clear(),
    db.ottomanTradePosts.clear(),
  ]);

  console.log("✅ All data cleared");
}

/**
 * Récupère des statistiques sur toutes les données
 */
export async function getAllStats(): Promise<{
  buildings: { total: number; visible: number; hidden: number };
  technos: { total: number; visible: number; hidden: number };
  ottomanAreas: { total: number; visible: number; hidden: number };
  ottomanTradePosts: { total: number; visible: number; hidden: number };
}> {
  const db = getWikiDB();

  const [buildings, technos, ottomanAreas, ottomanTradePosts] =
    await Promise.all([
      db.buildings.toArray(),
      db.technos.toArray(),
      db.ottomanAreas.toArray(),
      db.ottomanTradePosts.toArray(),
    ]);

  return {
    buildings: {
      total: buildings.length,
      visible: buildings.filter((b) => !b.hidden).length,
      hidden: buildings.filter((b) => b.hidden).length,
    },
    technos: {
      total: technos.length,
      visible: technos.filter((t) => !t.hidden).length,
      hidden: technos.filter((t) => t.hidden).length,
    },
    ottomanAreas: {
      total: ottomanAreas.length,
      visible: ottomanAreas.filter((a) => !a.hidden).length,
      hidden: ottomanAreas.filter((a) => a.hidden).length,
    },
    ottomanTradePosts: {
      total: ottomanTradePosts.length,
      visible: ottomanTradePosts.filter((tp) => !tp.hidden).length,
      hidden: ottomanTradePosts.filter((tp) => tp.hidden).length,
    },
  };
}

/**
 * Clone toutes les données vers une nouvelle base (backup)
 */
export async function backupAllData(): Promise<string> {
  const db = getWikiDB();

  const [buildings, technos, ottomanAreas, ottomanTradePosts] =
    await Promise.all([
      db.buildings.toArray(),
      db.technos.toArray(),
      db.ottomanAreas.toArray(),
      db.ottomanTradePosts.toArray(),
    ]);

  const backup = {
    timestamp: new Date().toISOString(),
    version: 2, // DB version
    data: {
      buildings,
      technos,
      ottomanAreas,
      ottomanTradePosts,
    },
  };

  return JSON.stringify(backup, null, 2);
}

/**
 * Restaure les données depuis un backup
 */
export async function restoreFromBackup(backupJson: string): Promise<void> {
  try {
    const backup = JSON.parse(backupJson);

    if (!backup.data) {
      throw new Error("Invalid backup format");
    }

    const db = getWikiDB();

    // Clear existing data
    await clearAllData();

    // Restore data
    const timestamp = now();

    if (backup.data.buildings) {
      await db.buildings.bulkPut(
        backup.data.buildings.map((b: any) => ({
          ...b,
          updatedAt: timestamp,
        })),
      );
    }

    if (backup.data.technos) {
      await db.technos.bulkPut(
        backup.data.technos.map((t: any) => ({
          ...t,
          updatedAt: timestamp,
        })),
      );
    }

    if (backup.data.ottomanAreas) {
      await db.ottomanAreas.bulkPut(
        backup.data.ottomanAreas.map((a: any) => ({
          ...a,
          updatedAt: timestamp,
        })),
      );
    }

    if (backup.data.ottomanTradePosts) {
      await db.ottomanTradePosts.bulkPut(
        backup.data.ottomanTradePosts.map((tp: any) => ({
          ...tp,
          updatedAt: timestamp,
        })),
      );
    }

    console.log("✅ Backup restored successfully");
  } catch (error) {
    console.error("Restore from backup failed:", error);
    throw new Error("Failed to restore backup. Please check the file format.");
  }
}
