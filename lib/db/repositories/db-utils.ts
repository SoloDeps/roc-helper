"use client";

import { getWikiDB } from "../schema";
import type {
  BuildingEntity,
  TechnoEntity,
  OttomanAreaEntity,
  OttomanTradePostEntity,
} from "../schema";

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
    const json = {
      version: 2,
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
    a.download = `preset_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  } catch (error) {
    console.error("Export presets failed:", error);
    throw error;
  }
}

/**
 * Import — compat v1 (boolean hidden, boolean levels, "tech_eg_0", quantity)
 *       et v2 (0|1 hidden, 0|1 levels, "eg_0", qty)
 */
export async function importPresetsJSON(jsonData: string): Promise<void> {
  try {
    const data = JSON.parse(jsonData);
    const db = getWikiDB();
    const isV1 = !data.version || data.version < 2;

    if (Array.isArray(data.buildings)) {
      await db.buildings.bulkPut(
        data.buildings.map((b: BuildingEntity) => ({
          id: b.id,
          qty: b.qty ?? b.qty ?? 1,
          hidden: b.hidden ? 1 : 0,
        })),
      );
    }

    if (Array.isArray(data.technos)) {
      await db.technos.bulkPut(
        data.technos.map((t: TechnoEntity) => ({
          id: isV1 ? t.id.replace(/^tech_/, "") : t.id,
          hidden: t.hidden ? 1 : 0,
        })),
      );
    }

    if (Array.isArray(data.ottomanAreas)) {
      await db.ottomanAreas.bulkPut(
        data.ottomanAreas.map((a: OttomanAreaEntity) => ({
          id: a.id,
          hidden: a.hidden ? 1 : 0,
        })),
      );
    }

    if (Array.isArray(data.ottomanTradePosts)) {
      await db.ottomanTradePosts.bulkPut(
        data.ottomanTradePosts.map((tp: OttomanTradePostEntity) => ({
          id: tp.id,
          // ✅ Compat v1 (boolean levels) et v2 (0|1 levels)
          levels: {
            unlock: tp.levels?.unlock ? 1 : 0,
            lvl2: tp.levels?.lvl2 ? 1 : 0,
            lvl3: tp.levels?.lvl3 ? 1 : 0,
            lvl4: tp.levels?.lvl4 ? 1 : 0,
            lvl5: tp.levels?.lvl5 ? 1 : 0,
          },
          hidden: tp.hidden ? 1 : 0,
        })),
      );
    }
  } catch (error) {
    console.error("Import presets failed:", error);
    throw new Error("Failed to import presets. Please check the file format.");
  }
}

export async function clearAllData(): Promise<void> {
  const db = getWikiDB();
  await Promise.all([
    db.buildings.clear(),
    db.technos.clear(),
    db.ottomanAreas.clear(),
    db.ottomanTradePosts.clear(),
  ]);
}

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
      hidden: buildings.filter((b) => !!b.hidden).length,
    },
    technos: {
      total: technos.length,
      visible: technos.filter((t) => !t.hidden).length,
      hidden: technos.filter((t) => !!t.hidden).length,
    },
    ottomanAreas: {
      total: ottomanAreas.length,
      visible: ottomanAreas.filter((a) => !a.hidden).length,
      hidden: ottomanAreas.filter((a) => !!a.hidden).length,
    },
    ottomanTradePosts: {
      total: ottomanTradePosts.length,
      visible: ottomanTradePosts.filter((tp) => !tp.hidden).length,
      hidden: ottomanTradePosts.filter((tp) => !!tp.hidden).length,
    },
  };
}

export async function backupAllData(): Promise<string> {
  const db = getWikiDB();
  const [buildings, technos, ottomanAreas, ottomanTradePosts] =
    await Promise.all([
      db.buildings.toArray(),
      db.technos.toArray(),
      db.ottomanAreas.toArray(),
      db.ottomanTradePosts.toArray(),
    ]);
  return JSON.stringify(
    {
      timestamp: new Date().toISOString(),
      version: 2,
      data: { buildings, technos, ottomanAreas, ottomanTradePosts },
    },
    null,
    2,
  );
}

export async function restoreFromBackup(backupJson: string): Promise<void> {
  try {
    const backup = JSON.parse(backupJson);
    if (!backup.data) throw new Error("Invalid backup format");

    const db = getWikiDB();
    const isV1 = !backup.version || backup.version < 2;

    await clearAllData();

    if (backup.data.buildings) {
      await db.buildings.bulkPut(
        backup.data.buildings.map((b: BuildingEntity) => ({
          id: b.id,
          qty: b.qty ?? b.qty ?? 1,
          hidden: b.hidden ? 1 : 0,
        })),
      );
    }

    if (backup.data.technos) {
      await db.technos.bulkPut(
        backup.data.technos.map((t: TechnoEntity) => ({
          id: isV1 ? t.id.replace(/^tech_/, "") : t.id,
          hidden: t.hidden ? 1 : 0,
        })),
      );
    }

    if (backup.data.ottomanAreas) {
      await db.ottomanAreas.bulkPut(
        backup.data.ottomanAreas.map((a: OttomanAreaEntity) => ({
          id: a.id,
          hidden: a.hidden ? 1 : 0,
        })),
      );
    }

    if (backup.data.ottomanTradePosts) {
      await db.ottomanTradePosts.bulkPut(
        backup.data.ottomanTradePosts.map((tp: OttomanTradePostEntity) => ({
          id: tp.id,
          levels: {
            unlock: tp.levels?.unlock ? 1 : 0,
            lvl2: tp.levels?.lvl2 ? 1 : 0,
            lvl3: tp.levels?.lvl3 ? 1 : 0,
            lvl4: tp.levels?.lvl4 ? 1 : 0,
            lvl5: tp.levels?.lvl5 ? 1 : 0,
          },
          hidden: tp.hidden ? 1 : 0,
        })),
      );
    }
  } catch (error) {
    console.error("Restore from backup failed:", error);
    throw new Error("Failed to restore backup. Please check the file format.");
  }
}
