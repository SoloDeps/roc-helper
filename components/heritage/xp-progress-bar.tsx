"use client";

import { useEffect, useState } from "react";

import { Slider } from "@/components/ui/slider";
import { InlineSlider } from "@/components/ui/inline-slider";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useDebouncedCallback } from "@/hooks/use-debounced-callback";

/**
 * Barre de progression d'xp — partagée entre la carte du vault, la carte du
 * gardien et l'onglet Sacrifice.
 *
 * `InlineSlider` sur desktop (même gabarit visuel que la piste, épouse la
 * ligne du header), `Slider` (Radix, zone tactile plus généreuse) en dessous
 * de 768px — bascule identique à celle du reste du projet
 * (`use-media-query`), pas une media query CSS : la valeur pilote aussi
 * `isMax`, qui dépend de JS, pas seulement de la mise en page.
 *
 * La valeur locale suit le curseur au doigt, la remontée est différée : sans
 * ça, chaque pixel déclencherait une écriture Dexie et une résolution complète
 * du vault.
 */
export function XpProgressBar({
  value,
  max,
  onValueChange,
}: {
  value: number;
  max: number;
  onValueChange: (value: number) => void;
}) {
  const isMobile = !useMediaQuery("(min-width: 768px)");
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const debouncedOnChange = useDebouncedCallback(onValueChange, 300);

  const handleChange = (next: number) => {
    setLocalValue(next);
    debouncedOnChange(next);
  };

  const isFull = max > 0 && localValue >= max;

  return (
    <div className="flex h-5 items-center gap-2">
      {isMobile ? (
        <Slider
          value={[Math.min(localValue, max)]}
          onValueChange={([next]) => handleChange(next)}
          min={0}
          max={Math.max(max, 1)}
          step={1}
          className="flex-1"
        />
      ) : (
        <InlineSlider
          value={Math.min(localValue, max)}
          min={0}
          max={Math.max(max, 1)}
          isMax={isFull}
          onChange={handleChange}
        />
      )}
      <span className="shrink-0 text-xs font-semibold tabular-nums text-muted-foreground">
        {localValue}/{max}
      </span>
    </div>
  );
}
