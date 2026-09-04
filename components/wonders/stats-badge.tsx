import Image from "next/image";
import { memo, useState, useCallback } from "react";
import type { MaterialType } from "@/data/wonders/types";
import { imagesUrl, MATERIAL_ICONS } from "@/lib/catalog";

// ─── Icon path resolution ─────────────────────────────────────────────────────
//
// Icons live in different folders depending on type.
// Priority: ICON_PATH_OVERRIDES (exact match) → /images/icons/<key>.webp
//
// Add entries to ICON_PATH_OVERRIDES for any icon that does NOT live under
// /images/icons/ so the resolver can find it without touching the file tree.

const ICON_PATH_OVERRIDES: Record<string, string> = {
  ...imagesUrl,
  ...MATERIAL_ICONS,
  // goods
  coin: "/images/goods/coins.webp",
  food: "/images/goods/food.webp",
  research: "/images/goods/research_points.webp",
  mead: "/images/goods/mead.webp",
  // chests — tous les visuels de coffre vivent sous /images/chests/, quel que
  // soit le domaine qui les affiche (merveilles, campagne, Heritage Vault).
  chest_good: "/images/chests/icon_chest_good.webp",
  mystery_chest: "/images/chests/icon_mystery_chest_gold.webp",
  // game_icons
  capital_worker: "/images/game_icons/icon_workers_capital.webp",
  arabia_worker: "/images/icons/icon_workers_city_arabia.webp",
  // trade
  icon_trading: "/images/technos/features/icon_trading.webp",
  trade_worker: "/images/icons/icon_workers_trading.webp",
  trade_slot_cooldown_boost: "/images/icons/icon_tradeslot_cooldown_boost.webp",
  gears: "/images/goods/gears.webp",
  compass: "/images/game_icons/icon_compass.webp",
  bazaar_boost: "/images/icons/icon_bazaar_boost.webp",
  // synergy
  synergy: "/images/game_icons/icon_synergy.webp",
};

/**
 * Resolves an icon key to its full image path.
 *
 * Resolution order:
 * 1. Exact match in ICON_PATH_OVERRIDES
 * 2. /images/icons/<key>.webp  (stat icons, unit icons, boost overlays…)
 *
 * If neither loads, the <Image> onError handler falls back to FALLBACK_SRC.
 */
export function resolveIconPath(key: string): string {
  return ICON_PATH_OVERRIDES[key] ?? `/images/icons/${key}.webp`;
}

const FALLBACK_SRC = "/images/goods/default.webp";

// ─── Fallback-aware image ─────────────────────────────────────────────────────
//
// Owns its own error state so it can swap to FALLBACK_SRC on load failure.
// `prevSrc` recalcule `imgSrc` PENDANT le rendu quand `src` change — motif
// « adjusting state when a prop changes », pas un effet : un composant qui
// vit assez longtemps pour voir `src` changer (une icône dont l'identité
// dépend d'un choix du joueur, ex. le classement d'ateliers du Heritage
// Vault) doit reprendre l'erreur à zéro plutôt que de garder l'ancienne
// image ou un état d'erreur qui ne correspond plus à la nouvelle URL.
// Un `useState(src)` seul le figeait au premier montage : correct tant que
// `src` ne changeait jamais pour une même instance, faux dès qu'il change.

export interface FallbackImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  ariaHidden?: boolean;
}

export const FallbackImage = memo(function FallbackImage({
  src,
  alt,
  width,
  height,
  className,
  ariaHidden,
}: FallbackImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [prevSrc, setPrevSrc] = useState(src);
  if (src !== prevSrc) {
    setPrevSrc(src);
    setImgSrc(src);
  }
  const handleError = useCallback(() => setImgSrc(FALLBACK_SRC), []);

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      draggable={false}
      onError={handleError}
      {...(ariaHidden ? { "aria-hidden": true } : {})}
    />
  );
});

// ─── StatsBadge ───────────────────────────────────────────────────────────────

interface StatsBadgeProps {
  /**
   * Tuple from WonderBonus.icons: [mainIcon, overlayIcon | null].
   * - mainIcon   : icon key, resolved via resolveIconPath()
   * - overlayIcon: when present, rendered as a small badge bottom-right (14 px)
   */
  icons: [string, string | null];
  /** Pre-formatted value string, e.g. "+18.3%", "4", "300" */
  value: string;
  /** Accessible label for the badge (bonus type label is a good default) */
  alt: string;
  /**
   * Optional material type shown as a small leading icon on the far left.
   * Use this for synergy badges so the trigger material is immediately visible.
   * Layout: [material icon] [main icon + overlay] ··· [value]
   */
  materialIcon?: MaterialType;
}

export const StatsBadge = memo(function StatsBadge({
  icons,
  value,
  alt,
  materialIcon,
}: StatsBadgeProps) {
  const [mainKey, overlayKey] = icons;

  return (
    <div className="flex items-center justify-between px-2 rounded-md bg-background-100 border border-alpha-200 h-9 shrink-0 gap-1.5">
      {/* Left side: optional material icon + main icon with overlay */}
      <div className="flex items-center gap-1 shrink-0">
        {/* Material icon — only for synergy badges */}
        {materialIcon && (
          <FallbackImage
            src={MATERIAL_ICONS[materialIcon]}
            alt={materialIcon}
            width={25}
            height={25}
            className="h-[25px] w-auto select-none shrink-0"
          />
        )}

        {/* Main icon with optional overlay */}
        <div className="relative shrink-0">
          <FallbackImage
            src={resolveIconPath(mainKey)}
            alt={alt}
            width={25}
            height={25}
            className="h-[25px] w-auto select-none shrink-0"
          />
          {overlayKey && (
            <FallbackImage
              src={resolveIconPath(overlayKey)}
              alt=""
              ariaHidden
              width={15}
              height={15}
              className="absolute -bottom-0.5 -right-1 h-[15px] w-auto select-none drop-shadow-sm"
            />
          )}
        </div>
      </div>

      {/* Value */}
      <span className="text-sm font-medium tabular-nums">{value}</span>
    </div>
  );
});
