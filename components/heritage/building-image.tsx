"use client";

import Image from "next/image";
import { useState } from "react";

import { FALLBACK_IMAGE } from "@/lib/catalog";

/**
 * Visuel wiki d'un bâtiment, avec repli local si l'URL est inconnue ou cassée.
 *
 * L'état est recalé pendant le rendu quand `src` change (motif « adjusting
 * state when a prop changes »), sans effet : une nouvelle image doit repartir
 * de zéro, pas hériter de l'erreur de la précédente.
 */
export function BuildingImage({ src, alt }: { src: string | null; alt: string }) {
  const [imgSrc, setImgSrc] = useState(src ?? FALLBACK_IMAGE);
  const [prevSrc, setPrevSrc] = useState(src);
  if (src !== prevSrc) {
    setPrevSrc(src);
    setImgSrc(src ?? FALLBACK_IMAGE);
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={100}
      height={100}
      className="max-h-full w-auto select-none object-contain"
      draggable={false}
      onError={() => setImgSrc(FALLBACK_IMAGE)}
    />
  );
}
