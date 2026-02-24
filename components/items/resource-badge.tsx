import { slugify } from "@/lib/utils";
import Image from "next/image";
import { memo, useState, useEffect } from "react";

export const ResourceBadge = memo(function ResourceBadge({
  icon,
  value,
  alt,
}: {
  icon: string;
  value: string;
  alt: string;
}) {
  const [src, setSrc] = useState(icon);

  useEffect(() => {
    setSrc(icon);
  }, [icon]);

  return (
    <div className="flex items-center justify-between px-2 rounded-md bg-background-100 border border-alpha-200 h-9 shrink-0">
      <Image
        src={src}
        alt={`${alt} - ${slugify(value)}`}
        className="size-[25px] select-none"
        draggable={false}
        onError={() => setSrc("/images/goods/default.webp")}
        width={25}
        height={25}
      />
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
});
