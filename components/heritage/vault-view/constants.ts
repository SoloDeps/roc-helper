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
  { value: "infos", label: "Overview", slug: "overview" },
  { value: "sacrifice", label: "Sacrifice", slug: "sacrifice" },
  { value: "combination", label: "Combination", slug: "combination" },
  { value: "progression", label: "Level Table", slug: "level-tab" },
  { value: "keeperOffers", label: "Keeper Offers", slug: "keeper-offers" },
] as const;

export type HeritageTab = (typeof HERITAGE_TABS)[number]["value"];

/** Onglets affichés dans la nav. */
export const VISIBLE_HERITAGE_TABS = HERITAGE_TABS;

/** Onglet par défaut quand l'URL n'en précise pas (ex. redirection depuis `/vault`). */
export const DEFAULT_HERITAGE_TAB: HeritageTab = "infos";

/**
 * `value` interne ↔ segment d'URL. Distincts du `value` (`infos`,
 * `keeperOffers`) pour garder des liens lisibles et en kebab-case
 * (`overview`, `keeper-offers`) sans renommer l'état interne partout.
 */
export function heritageTabSlug(tab: HeritageTab): string {
  return HERITAGE_TABS.find((entry) => entry.value === tab)!.slug;
}

/** Résout un segment d'URL vers son onglet, ou `null` si inconnu. */
export function getHeritageTabBySlug(slug: string): HeritageTab | null {
  return HERITAGE_TABS.find((entry) => entry.slug === slug)?.value ?? null;
}
