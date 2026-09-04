import type { HeritageEffectGroup } from "@/data/heritage/generated/types";

export const GROUP_LABELS: Record<HeritageEffectGroup, string> = {
  production: "Production",
  boost: "Boost",
};

export const GROUP_BADGE_CLASS: Record<HeritageEffectGroup, string> = {
  production:
    "bg-emerald-500/10 text-emerald-700 border-emerald-500/30 dark:text-emerald-400",
  boost: "bg-sky-500/10 text-sky-700 border-sky-500/30 dark:text-sky-400",
};

/**
 * Onglets de la page. `layoutId` du soulignement propre à cette page pour ne
 * pas entrer en conflit avec une autre barre d'onglets montée en même temps.
 */
export const HERITAGE_TABS = [
  { value: "infos", label: "Overview" },
  { value: "sacrifice", label: "Sacrifice" },
  { value: "combination", label: "Combination" },
  { value: "progression", label: "Level Table" },
  { value: "keeperOffers", label: "Keeper Offers" },
] as const;

export type HeritageTab = (typeof HERITAGE_TABS)[number]["value"];

/** Onglets affichés dans la nav. */
export const VISIBLE_HERITAGE_TABS = HERITAGE_TABS;
