"use client";

// ============================================================
// ROC Helper – Heritage Vault Store
//
// Helpers minces autour de la table Dexie `userHeritageVaults` (roc_heritage_db),
// même motif que le store Wonders : `useLiveQuery` en lecture, fonctions async
// en écriture.
//
// ⚠️ Une ligne n'existe qu'à partir de la première modification. Tant que le
// joueur n'a rien touché, la lecture rend l'état vierge de
// `emptyOwnedHeritageVault` plutôt qu'`undefined` — l'UI n'a pas à distinguer
// « pas encore joué » de « niveau 1 ».
// ============================================================

import { useLiveQuery } from "dexie-react-hooks";
import { useMemo } from "react";

import {
  getHeritageDB,
  type UserHeritageVaultEntity,
} from "@/lib/db/heritage-schema";
import { emptyOwnedHeritageVault } from "@/resolvers/heritage";

export type { UserHeritageVaultEntity };

/** L'état stocké d'un vault, ou l'état vierge s'il n'a jamais été touché. */
/**
 * L'état joueur d'un vault. `null` tant que la ligne de CE thème n'est pas lue.
 *
 * ⚠️ LE RÉSULTAT PORTE SON `themeId`, et l'appelant vérifie qu'il correspond.
 * `useLiveQuery` garde le résultat PRÉCÉDENT le temps que la requête du
 * nouveau `themeId` se résolve : au changement de vault, le composant recevait
 * donc le niveau du vault QUITTÉ (« The Khan's Games » au niveau 47 du Celtic)
 * pendant une frame ou deux, puis le vrai. Toutes les valeurs dérivées —
 * production, boosts, coffres, barre d'XP — étaient calculées deux fois, à deux
 * niveaux différents : c'est ce qui faisait « sauter » les nombres à chaque
 * changement de vault. Indistinguable d'un `undefined` sans ce marqueur, car
 * une ligne absente rend elle aussi `undefined`.
 *
 * ⚠️ LA FUSION EST MÉMOÏSÉE SUR `result` — ex-crash en prod (« Too many
 * re-renders », React #301). Sans `useMemo`, ce spread construisait un objet
 * NEUF à CHAQUE rendu, identique en valeur mais jamais `===` au précédent.
 * `HeritageVaultContent` (`heritage-vault-view.tsx`) compare pourtant `shown.
 * owned` par référence pour geler l'affichage le temps qu'un changement de
 * vault se résolve : un objet qui change d'identité à chaque rendu sans
 * changer de valeur y redéclenchait un `setShown` à CHAQUE rendu — boucle de
 * rendu infinie dès qu'un rendu suivant survenait pour une autre raison (ex.
 * `hydrateBuildingSelectionsStore`). `useLiveQuery` garde `result` stable tant
 * que Dexie n'a rien réémis (cf. `dexie-react-hooks`) : le mémoïser dessus
 * suffit à casser la boucle.
 */
export function useUserHeritageVault(themeId: string): UserHeritageVaultEntity | null {
  const result = useLiveQuery(
    async () => ({ themeId, row: await getHeritageDB().userHeritageVaults.get(themeId) }),
    [themeId],
  );
  // Fusion sur le défaut, pas un simple `??` : une ligne écrite avant l'ajout
  // d'un champ (ex. `xpProgress`) existe déjà en base sans lui — Dexie la rend
  // telle quelle, sans migration puisque le champ n'est pas indexé.
  const merged = useMemo(
    () => (result === undefined ? null : { ...emptyOwnedHeritageVault(themeId), ...result.row }),
    [themeId, result],
  );
  if (result === undefined || result.themeId !== themeId) return null;
  return merged;
}

/** Écrit les champs donnés, en créant la ligne au besoin. */
export async function updateUserHeritageVault(
  themeId: string,
  updates: Partial<Omit<UserHeritageVaultEntity, "themeId">>,
): Promise<void> {
  const db = getHeritageDB();
  const current = await db.userHeritageVaults.get(themeId);
  await db.userHeritageVaults.put({
    ...(current ?? emptyOwnedHeritageVault(themeId)),
    ...updates,
    themeId,
  });
}

/**
 * Place un effet dans un slot.
 *
 * L'effet est d'abord retiré de tout AUTRE slot : le jeu n'autorise pas le même
 * effet à deux endroits, et laisser le doublon compterait son bonus deux fois.
 */
export async function equipHeritageEffect(
  themeId: string,
  slotId: string,
  effectId: string,
): Promise<void> {
  const db = getHeritageDB();
  const current = await db.userHeritageVaults.get(themeId);
  const equipped = Object.fromEntries(
    Object.entries(current?.equipped ?? {}).filter(([, id]) => id !== effectId),
  );
  await updateUserHeritageVault(themeId, {
    equipped: { ...equipped, [slotId]: effectId },
  });
}

/** Vide un slot. */
export async function unequipHeritageEffect(
  themeId: string,
  slotId: string,
): Promise<void> {
  const db = getHeritageDB();
  const current = await db.userHeritageVaults.get(themeId);
  if (current === undefined) return;
  const equipped = Object.fromEntries(
    Object.entries(current.equipped).filter(([id]) => id !== slotId),
  );
  await updateUserHeritageVault(themeId, { equipped });
}

/**
 * Vide tous les slots donnés d'un coup — un groupe entier (Production OU
 * Boost), jamais le vault en entier : niveau, xp, gardien et achats restent
 * intacts, seuls les effets équipés dans CES slots sont retirés.
 */
export async function resetHeritageEffectSlots(
  themeId: string,
  slotIds: string[],
): Promise<void> {
  const db = getHeritageDB();
  const current = await db.userHeritageVaults.get(themeId);
  if (current === undefined) return;
  const slotIdSet = new Set(slotIds);
  const equipped = Object.fromEntries(
    Object.entries(current.equipped).filter(([slotId]) => !slotIdSet.has(slotId)),
  );
  await updateUserHeritageVault(themeId, { equipped });
}
