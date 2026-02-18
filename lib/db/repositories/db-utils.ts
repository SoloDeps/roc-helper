"use client";

import { getWikiDB } from "../schema";
import type {
  BuildingEntity,
  TechnoEntity,
  OttomanAreaEntity,
  OttomanTradePostEntity,
} from "../schema";

const now = () => Date.now();

/**
 * Exporte toutes les données au format JSON (presets)
 * Version optimisée - exporte seulement l'état utilisateur
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

    // Les données sont déjà minimales, pas besoin de nettoyage
    const json = {
      version: 1,
      buildings,
      technos,
      ottomanAreas,
      ottomanTradePosts,
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
      `✅ Exported ${buildings.length} buildings, ${technos.length} technos, ${ottomanAreas.length} areas, ${ottomanTradePosts.length} trade posts`,
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
        data.buildings.map((b: BuildingEntity) => ({
          id: b.id,
          quantity: b.quantity ?? 1,
          hidden: b.hidden ?? false,
          updatedAt: timestamp,
        })),
      );
    }

    // Import technos
    if (Array.isArray(data.technos)) {
      await db.technos.bulkPut(
        data.technos.map((t: TechnoEntity) => ({
          id: t.id,
          hidden: t.hidden ?? false,
          updatedAt: timestamp,
        })),
      );
    }

    // Import ottoman areas
    if (Array.isArray(data.ottomanAreas)) {
      await db.ottomanAreas.bulkPut(
        data.ottomanAreas.map((a: OttomanAreaEntity) => ({
          id: a.id,
          hidden: a.hidden ?? false,
          updatedAt: timestamp,
        })),
      );
    }

    // Import ottoman trade posts
    if (Array.isArray(data.ottomanTradePosts)) {
      await db.ottomanTradePosts.bulkPut(
        data.ottomanTradePosts.map((tp: OttomanTradePostEntity) => ({
          id: tp.id,
          levels: tp.levels ?? {
            unlock: false,
            lvl2: false,
            lvl3: false,
            lvl4: false,
            lvl5: false,
          },
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
 * Clone toutes les données vers un backup
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
    version: 1,
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
        backup.data.buildings.map((b: BuildingEntity) => ({
          ...b,
          updatedAt: timestamp,
        })),
      );
    }

    if (backup.data.technos) {
      await db.technos.bulkPut(
        backup.data.technos.map((t: TechnoEntity) => ({
          ...t,
          updatedAt: timestamp,
        })),
      );
    }

    if (backup.data.ottomanAreas) {
      await db.ottomanAreas.bulkPut(
        backup.data.ottomanAreas.map((a: OttomanAreaEntity) => ({
          ...a,
          updatedAt: timestamp,
        })),
      );
    }

    if (backup.data.ottomanTradePosts) {
      await db.ottomanTradePosts.bulkPut(
        backup.data.ottomanTradePosts.map((tp: OttomanTradePostEntity) => ({
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
