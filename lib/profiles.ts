"use client";

// ============================================================
// ROC Helper – Profils locaux (plusieurs comptes de jeu, sans connexion)
//
// Un profil = un jeu de données complet et isolé : bases Dexie + clés
// `localStorage`. Rien ne quitte le navigateur.
//
// - Dexie : chaque base est suffixée par l'id du profil (`roc_wiki_db__p_xxx`).
//   Le profil par défaut garde les noms historiques → aucune migration pour
//   les données existantes.
// - `localStorage` : les clés sont dispersées (persist Zustand, hooks, clés
//   composées par vault…). Plutôt que de préfixer chaque appel, on ÉCHANGE :
//   au changement de profil, les clés de l'app sont mises de côté dans une
//   « réserve » du profil quitté, puis celles du profil cible sont restaurées.
//
// Un changement de profil recharge la page : singletons Dexie et stores
// Zustand persistés ne s'hydratent qu'au chargement.
// ============================================================

import Dexie from "dexie";

export interface Profile {
  id: string;
  name: string;
  createdAt: number;
}

interface ProfileRegistry {
  profiles: Profile[];
  activeId: string;
}

export const DEFAULT_PROFILE_ID = "default";
export const PROFILES_STORAGE_KEY = "roc:profiles";
const STASH_PREFIX = "roc:profile-stash:";
export const PROFILE_NAME_MAX_LENGTH = 32;
/** Nombre maximum de profils (profil par défaut inclus). */
export const MAX_PROFILES = 3;

/** Bases Dexie de l'app — toutes propres au profil. */
const DB_BASE_NAMES = [
  "roc_wiki_db",
  "roc_wonders_db",
  "roc_heritage_db",
  "roc_presets_db",
] as const;

/** Clés `localStorage` partagées par tous les profils (jamais échangées). */
const GLOBAL_KEYS = new Set([
  PROFILES_STORAGE_KEY,
  "theme", // next-themes
  "local:workshopSeen",
]);

function isProfileScopedKey(key: string): boolean {
  return !GLOBAL_KEYS.has(key) && !key.startsWith(STASH_PREFIX);
}

const DEFAULT_REGISTRY: ProfileRegistry = {
  profiles: [{ id: DEFAULT_PROFILE_ID, name: "Main", createdAt: 0 }],
  activeId: DEFAULT_PROFILE_ID,
};

// ─── Registre ────────────────────────────────────────────────────────────────

let cachedRaw: string | null | undefined;
let cachedRegistry: ProfileRegistry = DEFAULT_REGISTRY;

function parseRegistry(raw: string | null): ProfileRegistry {
  if (!raw) return DEFAULT_REGISTRY;
  try {
    const parsed = JSON.parse(raw) as ProfileRegistry;
    if (!Array.isArray(parsed.profiles) || parsed.profiles.length === 0) {
      return DEFAULT_REGISTRY;
    }
    const activeId = parsed.profiles.some((p) => p.id === parsed.activeId)
      ? parsed.activeId
      : parsed.profiles[0].id;
    return { profiles: parsed.profiles, activeId };
  } catch {
    return DEFAULT_REGISTRY;
  }
}

/** Snapshot stable (même référence tant que la valeur stockée ne change pas). */
export function readProfileRegistry(): ProfileRegistry {
  if (typeof window === "undefined") return DEFAULT_REGISTRY;
  let raw: string | null = null;
  try {
    raw = localStorage.getItem(PROFILES_STORAGE_KEY);
  } catch {
    // localStorage indisponible (navigation privée stricte) : profil par défaut.
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedRegistry = parseRegistry(raw);
  }
  return cachedRegistry;
}

export function getServerProfileRegistry(): ProfileRegistry {
  return DEFAULT_REGISTRY;
}

const listeners = new Set<() => void>();

function writeRegistry(registry: ProfileRegistry) {
  localStorage.setItem(PROFILES_STORAGE_KEY, JSON.stringify(registry));
  listeners.forEach((l) => l());
}

export function subscribeProfileRegistry(listener: () => void) {
  listeners.add(listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key === PROFILES_STORAGE_KEY) listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", onStorage);
  };
}

export function getActiveProfileId(): string {
  return readProfileRegistry().activeId;
}

/** Nom de base Dexie pour le profil actif. */
export function profileDbName(baseName: string, profileId = getActiveProfileId()) {
  return profileId === DEFAULT_PROFILE_ID
    ? baseName
    : `${baseName}__${profileId}`;
}

function sanitizeName(name: string): string {
  return name.trim().slice(0, PROFILE_NAME_MAX_LENGTH);
}

// ─── Actions ─────────────────────────────────────────────────────────────────

export function createProfile(name: string): Profile {
  const registry = readProfileRegistry();
  if (registry.profiles.length >= MAX_PROFILES) {
    throw new Error(`Profile limit reached (${MAX_PROFILES})`);
  }
  const profile: Profile = {
    id: `p_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
    name: sanitizeName(name) || `Profile ${registry.profiles.length + 1}`,
    createdAt: Date.now(),
  };
  writeRegistry({ ...registry, profiles: [...registry.profiles, profile] });
  return profile;
}

export function renameProfile(id: string, name: string) {
  const clean = sanitizeName(name);
  if (!clean) return;
  const registry = readProfileRegistry();
  writeRegistry({
    ...registry,
    profiles: registry.profiles.map((p) =>
      p.id === id ? { ...p, name: clean } : p,
    ),
  });
}

/**
 * Bascule vers `targetId` puis recharge la page.
 *
 * Ordre volontaire : la réserve du profil quitté est ÉCRITE avant toute
 * suppression — si le quota est dépassé, on lève sans avoir rien perdu.
 */
export function switchProfile(targetId: string) {
  const registry = readProfileRegistry();
  if (targetId === registry.activeId) return;
  if (!registry.profiles.some((p) => p.id === targetId)) return;

  const currentKeys: string[] = [];
  const stash: Record<string, string> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key === null || !isProfileScopedKey(key)) continue;
    currentKeys.push(key);
    stash[key] = localStorage.getItem(key) ?? "";
  }
  localStorage.setItem(STASH_PREFIX + registry.activeId, JSON.stringify(stash));

  currentKeys.forEach((key) => localStorage.removeItem(key));

  const targetStashKey = STASH_PREFIX + targetId;
  const rawTarget = localStorage.getItem(targetStashKey);
  if (rawTarget) {
    try {
      const target = JSON.parse(rawTarget) as Record<string, string>;
      Object.entries(target).forEach(([k, v]) => localStorage.setItem(k, v));
    } catch {
      // Réserve corrompue : le profil repart de zéro côté localStorage.
    }
    localStorage.removeItem(targetStashKey);
  }

  writeRegistry({ ...registry, activeId: targetId });
  window.location.reload();
}

/** Supprime définitivement un profil inactif (bases Dexie + réserve). */
export async function deleteProfile(id: string) {
  const registry = readProfileRegistry();
  if (id === registry.activeId) {
    throw new Error("Cannot delete the active profile");
  }
  writeRegistry({
    ...registry,
    profiles: registry.profiles.filter((p) => p.id !== id),
  });
  localStorage.removeItem(STASH_PREFIX + id);
  await Promise.all(
    DB_BASE_NAMES.map((base) => Dexie.delete(profileDbName(base, id))),
  );
}
