"use client";

import Image from "next/image";
import { memo, useState, useCallback, useEffect } from "react";
import type { MaterialType } from "@/data/wonders/types";
import { imagesUrl, MATERIAL_ICONS } from "@/lib/catalog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// ─── Icon path resolution ─────────────────────────────────────────────────────

const ICON_PATH_OVERRIDES: Record<string, string> = {
  ...imagesUrl,
  ...MATERIAL_ICONS,
  coin: "/images/goods/coins.webp",
  food: "/images/goods/food.webp",
  research: "/images/goods/research_points.webp",
  mead: "/images/goods/mead.webp",
  chest_good: "/images/icons/icon_chest_good.webp",
  mystery_chest: "/images/icons/icon_mystery_chest_gold.webp",
  capital_worker: "/images/game_icons/icon_workers_capital.webp",
  arabia_worker: "/images/icons/icon_workers_city_arabia.webp",
  icon_trading: "/images/technos/features/icon_trading.webp",
  trade_worker: "/images/icons/icon_workers_trading.webp",
  trade_slot_cooldown_boost: "/images/icons/icon_tradeslot_cooldown_boost.webp",
  gears: "/images/goods/gears.webp",
  compass: "/images/game_icons/icon_compass.webp",
  bazaar_boost: "/images/icons/icon_bazaar_boost.webp",
  synergy: "/images/game_icons/icon_synergy.webp",
};

export function resolveIconPath(key: string): string {
  return ICON_PATH_OVERRIDES[key] ?? `/images/icons/${key}.webp`;
}

const FALLBACK_SRC = "/images/goods/default.webp";

// ─── Client-only touch detection hook ────────────────────────────────────────
// Runs only on the client (useEffect) to avoid SSR hydration mismatches.

function useIsTouch(): boolean {
  const [isTouch, setIsTouch] = useState(false);
  useEffect(() => {
    setIsTouch(
      typeof window !== "undefined" &&
        window.matchMedia("(hover: none) and (pointer: coarse)").matches,
    );
  }, []);
  return isTouch;
}

// ─── Fallback-aware image ─────────────────────────────────────────────────────

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
  /** Tuple from WonderBonus.icons: [mainIcon, overlayIcon | null] */
  icons: [string, string | null];
  /** Pre-formatted value string, e.g. "+18.3%", "4", "300" */
  value: string;
  /** Accessible label for the badge */
  alt: string;
  /** Human-readable description shown in tooltip (desktop) or popover (touch) */
  description?: string;
  /** Optional material type shown as a small leading icon */
  materialIcon?: MaterialType;
}

export const StatsBadge = memo(function StatsBadge({
  icons,
  value,
  alt,
  description,
  materialIcon,
}: StatsBadgeProps) {
  const [mainKey, overlayKey] = icons;
  const isTouch = useIsTouch();
  const [popoverOpen, setPopoverOpen] = useState(false);

  const badgeInner = (
    <div
      className="flex items-center justify-between px-2 rounded-md bg-background-100 border border-alpha-200 h-9 shrink-0 gap-1.5 cursor-default select-none"
      role={description ? "button" : undefined}
      tabIndex={description ? 0 : undefined}
      aria-label={description ? (description ?? alt) : alt}
      onKeyDown={
        description && isTouch
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setPopoverOpen((v) => !v);
              }
            }
          : undefined
      }
    >
      <div className="flex items-center gap-1 shrink-0">
        {materialIcon && (
          <FallbackImage
            src={MATERIAL_ICONS[materialIcon]}
            alt={materialIcon}
            width={25}
            height={25}
            className="h-[25px] w-auto select-none shrink-0"
          />
        )}
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
      <span className="text-sm font-medium tabular-nums">{value}</span>
    </div>
  );

  if (!description) return badgeInner;

  if (isTouch) {
    return (
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        <PopoverTrigger asChild>
          <div onClick={() => setPopoverOpen((v) => !v)}>{badgeInner}</div>
        </PopoverTrigger>
        <PopoverContent side="top" className="text-xs max-w-[200px] py-1.5 px-2.5">
          {description}
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>{badgeInner}</TooltipTrigger>
        <TooltipContent side="top" className="text-xs max-w-[200px]">
          {description}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});
