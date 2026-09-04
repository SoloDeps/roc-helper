"use client";

import { memo } from "react";

import { FallbackImage } from "@/components/wonders/stats-badge";
import { cn } from "@/lib/utils";

// ============================================================
// Icône principale + icône secondaire (overlay bas-droit) des effets Heritage
// Vault — source UNIQUE de ce motif.
//
// L'overlay précise SUR QUOI porte le boost (cœur = points de vie, épée =
// attaque) : une icône composite rendue sans lui est une perte d'information,
// pas un détail de style. Il n'est rendu que lorsqu'il est fourni — jamais de
// repli silencieux sur une image vide.
// ============================================================

export interface EffectIconProps {
  src: string;
  overlaySrc?: string | null;
  alt: string;
  size: number;
  overlaySize?: number;
  className?: string;
}

export const EffectIcon = memo(function EffectIcon({
  src,
  overlaySrc,
  alt,
  size,
  overlaySize,
  className,
}: EffectIconProps) {
  const resolvedOverlaySize = overlaySize ?? Math.max(10, Math.round(size * 0.65));
  // Les fichiers `icon_flat_*` sont dessinés en blanc plein : lisibles sur fond
  // sombre, invisibles en thème clair sans inversion. Les autres gardent leurs
  // couleurs dans les deux thèmes.
  const isFlatIcon = src.includes("icon_flat_");

  // ⚠️ BOÎTE CARRÉE IMPOSÉE EN CSS, pas seulement par les attributs `width`/
  // `height`. Le preflight Tailwind pose `img { height: auto }`, qui ÉCRASE
  // l'attribut `height` : une icône plus haute que large (les fioles de soin
  // d'un coffre, dessinées en 128×256) se rendait alors en `size` de large et
  // le DOUBLE de haut, débordant de sa ligne. `h-/w-` fixes + `object-contain`
  // la contiennent dans le carré sans jamais la déformer — même remède que
  // `StatsBadge` (`components/wonders/stats-badge.tsx`), qui figeait déjà sa
  // hauteur en CSS pour la même raison.
  return (
    <div
      className={cn("relative shrink-0", className)}
      style={{ width: size, height: size }}
    >
      <FallbackImage
        src={src}
        alt={alt}
        width={size}
        height={size}
        className={cn(
          "h-full w-full select-none object-contain",
          isFlatIcon && "invert-100 dark:invert-0",
        )}
      />
      {overlaySrc && (
        <div
          className="absolute -bottom-0.5 -right-1.5"
          style={{ width: resolvedOverlaySize, height: resolvedOverlaySize }}
        >
          <FallbackImage
            src={overlaySrc}
            alt=""
            ariaHidden
            width={resolvedOverlaySize}
            height={resolvedOverlaySize}
            className="h-full w-full select-none object-contain drop-shadow-sm"
          />
        </div>
      )}
    </div>
  );
});
