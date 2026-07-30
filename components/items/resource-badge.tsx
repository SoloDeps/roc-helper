import { slugify } from "@/lib/utils";
import Image from "next/image";
import { memo, useEffect, useState, useCallback } from "react";

interface ResourceBadgeProps {
  icon: string;
  value: string;
  alt: string;
  /**
   * Optional prefix label rendered before the icon.
   * Pass a number (3 | 5 | 10) for RP type, or any string like "Total".
   * When omitted, no prefix is shown.
   */
  rpLabel?: string | number;
}

export const ResourceBadge = memo(function ResourceBadge({
  icon,
  value,
  alt,
  rpLabel,
}: ResourceBadgeProps) {
  const [src, setSrc] = useState(icon);

  // BUGFIX: `useState(icon)` only sets the initial value on mount. If this
  // component instance gets reused by React (e.g. because a parent list
  // keys its items by array index instead of a stable resource id — see
  // RegionRewardList in campaign-details-panel.tsx / -drawer.tsx), the
  // `icon` prop can change on a re-render without `src` ever updating,
  // leaving a stale image (e.g. an "expansion" icon) displayed next to a
  // correct, freshly-updated `value` (e.g. "100" for gears). Explicitly
  // syncing `src` to the `icon` prop whenever it changes fixes this at
  // the source, regardless of how the parent keys its list.
  useEffect(() => {
    setSrc(icon);
  }, [icon]);

  const handleError = useCallback(
    () => setSrc("/images/goods/default.webp"),
    [],
  );

  return (
    <div className="flex items-center justify-between px-2 rounded-md bg-background-100 border border-alpha-200 h-9 shrink-0 gap-1.5">
      {/* Optional prefix label + icon */}
      <div className="flex items-center gap-0.5">
        {rpLabel !== undefined && (
          <span className="text-xs font-semibold shrink-0 text-muted-foreground">
            {rpLabel}
          </span>
        )}
        <Image
          src={src}
          alt={`${alt} - ${slugify(value)}`}
          className="h-[25px] w-auto select-none shrink-0"
          draggable={false}
          onError={handleError}
          width={25}
          height={25}
        />
      </div>
      <span className="text-sm font-medium tabular-nums">{value}</span>
    </div>
  );
});