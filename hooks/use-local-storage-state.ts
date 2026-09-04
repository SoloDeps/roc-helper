"use client";

import { useEffect, useRef, useState } from "react";

/**
 * État persisté en `localStorage` : survit à un changement d'onglet, à un
 * rechargement, ET à la fermeture du navigateur. Volontairement PAS Dexie —
 * ces panneaux sont des bacs à sable de simulation (quelques valeurs par
 * thème/vault : niveaux, cases, compteurs), pas de la progression joueur, et
 * n'ont pas besoin d'IndexedDB pour ça. `localStorage` est synchrone et
 * largement dans son budget (quota ~5 Mo, ces clés pèsent quelques Ko).
 *
 * La lecture n'a lieu qu'après le montage (`localStorage` n'existe pas au
 * rendu serveur) : le premier rendu reste sur `defaultValue`, puis la valeur
 * stockée est restaurée. À chaque changement de `key`, on repart de la valeur
 * de la NOUVELLE clé, jamais de l'état de l'ancienne.
 *
 * L'écriture est bloquée tant que la clé courante n'a pas été hydratée, sinon
 * le premier effet écraserait la valeur sauvegardée avec le défaut.
 */
export function useLocalStorageState<T>(key: string, defaultValue: T) {
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
        const raw = localStorage.getItem(key);
        if (raw != null) next = JSON.parse(raw) as T;
      } catch {
        // localStorage indisponible (navigation privée stricte) ou valeur
        // corrompue — on garde le défaut plutôt que de faire échouer le rendu.
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
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // idem.
    }
  }, [key, loadedKey, value]);

  return [value, setValue] as const;
}
