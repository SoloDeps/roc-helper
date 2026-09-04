"use client";

import { useEffect, useRef, useState } from "react";

/**
 * État persisté en `sessionStorage` : survit à un changement d'onglet et à un
 * rechargement, disparaît à la fermeture du navigateur. Volontairement PAS
 * Dexie — un bac à sable de simulation n'est pas de la progression joueur.
 *
 * La lecture n'a lieu qu'après le montage (`sessionStorage` n'existe pas au
 * rendu serveur) : le premier rendu reste sur `defaultValue`, puis la valeur
 * stockée est restaurée. À chaque changement de `key`, on repart de la valeur
 * de la NOUVELLE clé, jamais de l'état de l'ancienne.
 *
 * L'écriture est bloquée tant que la clé courante n'a pas été hydratée, sinon
 * le premier effet écraserait la valeur sauvegardée avec le défaut.
 */
export function useSessionStorageState<T>(key: string, defaultValue: T) {
  const [loadedKey, setLoadedKey] = useState<string | null>(null);
  const [value, setValue] = useState<T>(defaultValue);

  // Lu depuis la microtask sans entrer en dépendances : un défaut littéral
  // change d'identité à chaque rendu et relancerait la lecture en boucle.
  const latestDefault = useRef(defaultValue);
  useEffect(() => {
    latestDefault.current = defaultValue;
  });

  useEffect(() => {
    let cancelled = false;
    queueMicrotask(() => {
      if (cancelled) return;
      let next = latestDefault.current;
      try {
        const raw = sessionStorage.getItem(key);
        if (raw != null) next = JSON.parse(raw) as T;
      } catch {
        // sessionStorage indisponible (navigation privée stricte) — on garde
        // le défaut plutôt que de faire échouer le rendu.
      }
      setValue(next);
      setLoadedKey(key);
    });
    return () => {
      cancelled = true;
    };
  }, [key]);

  useEffect(() => {
    if (loadedKey !== key) return;
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch {
      // idem.
    }
  }, [key, loadedKey, value]);

  return [value, setValue] as const;
}
