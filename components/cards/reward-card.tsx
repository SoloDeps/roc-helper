"use client";

import { useState } from "react";
import {
  getGoodNameFromPriorityEra,
  getItemIconLocal,
  getWikiImageUrl,
} from "@/lib/utils";
import { imagesUrl } from "@/lib/catalog";
import type { Reward, RewardImgSource } from "@/types/shared";
import { ABBR_TO_ERA_ID } from "@/lib/era-mappings";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface RewardCardProps {
  reward: Reward;
  techId: string; // pour résoudre era dans kind:"good"
  userSelections: string[][];
}

function resolveRewardImage(
  img: RewardImgSource,
  techId: string,
  userSelections: string[][],
): { src: string; invert: boolean } {
  switch (img.kind) {
    case "techno": {
      const abbr = img.techId.split("_")[0];
      const eraFolder = ABBR_TO_ERA_ID[abbr] ?? abbr;
      return {
        src: `/images/technos/${eraFolder}/${img.techId}.webp`,
        invert: false,
      };
    }
    case "wiki": {
      const hasLevel = img.level !== undefined;
      return {
        src: getWikiImageUrl(img.imageName, hasLevel, img.level ?? 1),
        invert: false,
      };
    }
    case "catalog": {
      return {
        src: imagesUrl[img.imgType] ?? "/images/goods/default.webp",
        invert: img.invert ?? false,
      };
    }
    case "local": {
      return {
        src: img.path,
        invert: img.invert ?? false,
      };
    }
    case "good": {
      const era = techId.split("_")[0]; // "ba_7" → "ba"
      const goodName =
        getGoodNameFromPriorityEra(img.priority, era, userSelections) ??
        "default";
      return {
        src: `/images/goods-large/${goodName}.webp`,
        invert: false,
      };
    }
  }
}

export function RewardCard({
  reward,
  techId,
  userSelections,
}: RewardCardProps) {
  const { src, invert } = resolveRewardImage(
    reward.img,
    techId,
    userSelections,
  );
  const [imgError, setImgError] = useState(false);

  const isWiki = reward.img.kind === "wiki";
  const isNewFeature = reward.desc === "New Feature";

  return (
    <div
      className={cn(
        "flex items-center gap-0 rounded-lg border overflow-hidden",
        isNewFeature
          ? "border-blue-500/40 bg-blue-500/10"
          : "border-border bg-card",
      )}
    >
      {/* Image — wiki: pleine / flat icons: fond grisé + icône centrée */}
      <div className="shrink-0 h-20 w-22 relative overflow-hidden">
        {isWiki ? (
          /* Style building-card : image pleine */
          !imgError ? (
            <Image
              src={src}
              alt={reward.title}
              fill
              className="object-cover object-center brightness-105 ml-1"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="size-full bg-background-400/50" />
          )
        ) : (
          /* Style area-card : fond grisé + icône plate centrée */
          <div className="size-full flex items-center pl-2 justify-center bg-background-400/50">
            {!imgError ? (
              <Image
                src={src}
                alt={reward.title}
                width={40}
                height={40}
                className={cn(
                  "size-14 object-contain select-none",
                  invert
                    ? "opacity-40 invert-100 dark:invert-10 dark:opacity-70"
                    : "",
                )}
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="size-11 opacity-20 bg-muted rounded" />
            )}
          </div>
        )}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0 px-2.5 py-2">
        <p
          className={cn(
            "text-[13px] font-semibold truncate",
            isNewFeature ? "text-blue-400" : "text-foreground",
          )}
        >
          {reward.title}
        </p>
        <p className="text-xs text-muted-foreground leading-snug line-clamp-2">
          {reward.desc}
        </p>
      </div>
    </div>
  );
}
