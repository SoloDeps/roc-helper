import { slugify } from "@/lib/utils";
import Image from "next/image";
import { memo, useState, useCallback } from "react";

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
