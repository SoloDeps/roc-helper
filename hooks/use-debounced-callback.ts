"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * Rappel différé : chaque appel repousse le précédent, seul le dernier part.
 *
 * Le timer est nettoyé au démontage — un composant qui disparaît pendant le
 * délai ne doit pas écrire dans un état qui n'existe plus.
 */
export function useDebouncedCallback<Args extends unknown[]>(
  callback: (...args: Args) => void,
  delay: number,
): (...args: Args) => void {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return useCallback(
    (...args: Args) => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => callback(...args), delay);
    },
    [callback, delay],
  );
}
