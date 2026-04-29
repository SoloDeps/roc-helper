import Image from "next/image";
import { memo, useState, useCallback } from "react";
import type { MaterialType } from "@/data/wonders/types";

// ─── Icon path resolution ─────────────────────────────────────────────────────
//
// Icons live in different folders depending on type.
// Priority: ICON_PATH_OVERRIDES (exact match) → /images/icons/<key>.webp
//
// Add entries to ICON_PATH_OVERRIDES for any icon that does NOT live under
// /images/icons/ so the resolver can find it without touching the file tree.

const ICON_PATH_OVERRIDES: Record<string, string> = {
  // goods / economy
  coin: "/images/goods/coins.webp",
  food: "/images/goods/food.webp",
  research: "/images/goods/research_points.webp",
  goods: "/images/goods/goods.webp",
  goods_chest: "/images/goods/goods_chest.webp",
  mead: "/images/goods/mead.webp",
  // game_icons — workers, slots, etc.
  worker: "/images/game_icons/icon_workers_capital.webp",
  trade_worker: "/images/game_icons/icon_trade_worker.webp",
  arabia_worker: "/images/game_icons/icon_arabia_worker.webp",
  compass: "/images/game_icons/icon_compass.webp",
  gears: "/images/game_icons/icon_gears.webp",
  mystery_chest: "/images/game_icons/icon_mystery_chest.webp",
  trade_slot_cooldown_boost: "/images/game_icons/icon_trade_slot_cooldown.webp",
  bazaar_boost: "/images/game_icons/icon_bazaar_boost.webp",
  // slot crests (used as main icon with "goods" overlay)
  egypt_crest: "/images/wonders/crests/egypt.webp",
  maya_crest: "/images/wonders/crests/maya.webp",
  arabia_crest: "/images/wonders/crests/arabia.webp",
  // synergy — lightning bolt icon shown next to the material tag
  // Update this path to wherever your synergy icon lives in /public
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

// ─── Material icons (for synergy badge) ──────────────────────────────────────

const MATERIAL_ICONS: Record<MaterialType, string> = {
  Arena: "/images/wonders/material/arena.webp",
  Fortress: "/images/wonders/material/fortress.webp",
  Nature: "/images/wonders/material/nature.webp",
  Naval: "/images/wonders/material/naval.webp",
  Palace: "/images/wonders/material/palace.webp",
  Statue: "/images/wonders/material/statue.webp",
  Temple: "/images/wonders/material/temple.webp",
};

// ─── Fallback-aware image ─────────────────────────────────────────────────────
//
// Owns its own error state so it can swap to FALLBACK_SRC on load failure.
// Initial src comes from a lazy useState initializer — no useEffect needed,
// so there are no cascading renders (avoids the ESLint
// "Calling setState synchronously within an effect" warning).

interface FallbackImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  ariaHidden?: boolean;
}

const FallbackImage = memo(function FallbackImage({
  src,
  alt,
  width,
  height,
  className,
  ariaHidden,
}: FallbackImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
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
            width={16}
            height={16}
            className="size-[25px] select-none opacity-80"
          />
        )}

        {/* Main icon with optional overlay */}
        <div className="relative size-[25px] shrink-0">
          <FallbackImage
            src={resolveIconPath(mainKey)}
            alt={alt}
            width={25}
            height={25}
            className="size-[25px] select-none"
          />
          {overlayKey && (
            <FallbackImage
              src={resolveIconPath(overlayKey)}
              alt=""
              ariaHidden
              width={14}
              height={14}
              className="absolute -bottom-0.5 -right-1 h-[14px] w-auto select-none drop-shadow-sm"
            />
          )}
        </div>
      </div>

      {/* Value */}
      <span className="text-sm font-medium tabular-nums">{value}</span>
    </div>
  );
});
