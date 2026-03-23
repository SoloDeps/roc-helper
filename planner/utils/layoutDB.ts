// ─────────────────────────────────────────────────────────────────────────────
// layoutDB.ts
// CRUD Dexie pour les layouts city planner
// S'appuie sur RocWikiDB v5 (cityLayouts table)
// ─────────────────────────────────────────────────────────────────────────────

import { getWikiDB } from '@/lib/db/schema';
import type { CityId } from '@/planner/data/cityGridDefinitions';
import type { SerializedState } from '@/planner/core/cityMapState';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface CityLayout {
  /** UUID unique */
  id:           string;
  /** Nom affiché */
  name:         string;
  /** Ville concernée */
  cityId:       CityId;
  /** Ère au moment de la sauvegarde */
  era:          string;
  /** Nombre de bâtiments */
  entityCount:  number;
  /** Timestamp ms */
  createdAt:    number;
  updatedAt:    number;
  /** État sérialisé (CityMapState.serialize()) */
  data:         SerializedState;
  /** Miniature canvas base64 (optionnel) */
  thumbnail?:   string;
}

// ─────────────────────────────────────────────────────────────────────────────
// CRUD
// ─────────────────────────────────────────────────────────────────────────────

export async function saveLayout(layout: Omit<CityLayout, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): Promise<CityLayout> {
  const db = getWikiDB();
  const now = Date.now();
  const full: CityLayout = {
    ...layout,
    id:        layout.id ?? crypto.randomUUID(),
    createdAt: layout.id ? (await db.cityLayouts.get(layout.id))?.createdAt ?? now : now,
    updatedAt: now,
  };
  await db.cityLayouts.put(full);
  return full;
}

export async function loadLayout(id: string): Promise<CityLayout | null> {
  const db = getWikiDB();
  return (await db.cityLayouts.get(id)) ?? null;
}

export async function listLayouts(): Promise<CityLayout[]> {
  const db = getWikiDB();
  const all = await db.cityLayouts.toArray();
  return all.sort((a, b) => b.updatedAt - a.updatedAt);
}

export async function deleteLayout(id: string): Promise<void> {
  const db = getWikiDB();
  await db.cityLayouts.delete(id);
}

export async function updateLayoutThumbnail(id: string, thumbnail: string): Promise<void> {
  const db = getWikiDB();
  await db.cityLayouts.update(id, { thumbnail, updatedAt: Date.now() });
}

// ─────────────────────────────────────────────────────────────────────────────
// Thumbnail depuis canvas
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Génère une miniature 320×180 depuis le canvas principal.
 * À appeler au moment de la sauvegarde.
 */
export function generateThumbnail(canvas: HTMLCanvasElement): string {
  const offscreen = document.createElement('canvas');
  offscreen.width  = 320;
  offscreen.height = 180;
  const ctx = offscreen.getContext('2d')!;
  ctx.drawImage(canvas, 0, 0, 320, 180);
  return offscreen.toDataURL('image/jpeg', 0.7);
}
