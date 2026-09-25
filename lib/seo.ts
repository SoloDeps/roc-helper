import type { Metadata } from "next";

// ============================================================
// SEO — source unique des titres, descriptions et visuels de chaque page.
//
// Consommé par les `metadata` des layouts, les `opengraph-image.tsx` (images
// de partage générées AU BUILD) et `app/sitemap.ts`. Rien ici ne dépend d'un
// serveur : tout est figé dans le HTML de l'export statique.
//
// ⚠️ Les crawlers (Discord, X, Facebook, Google) ne lisent QUE le HTML servi,
// sans exécuter le JS : la query string (`/vault?b=ath`) ne change rien à ce
// qu'ils voient. Seul le chemin compte.
// ============================================================

export const SITE_URL = "https://roc-helper.com";
export const SITE_NAME = "RoC Helper";
export const SITE_TAGLINE = "Rise of Cultures calculator & planner";
export const SITE_DESCRIPTION =
  "Free Rise of Cultures tools: resource calculator, technology tree planner, campaign tracker, Heritage Vault calculator and World Wonders planner. No account, no login.";

export const BRAND_COLOR = "#307498";

export const SITE_KEYWORDS = [
  "Rise of Cultures",
  "RoC",
  "RoC Helper",
  "Rise of Cultures calculator",
  "Rise of Cultures planner",
  "Rise of Cultures tools",
  "InnoGames",
];

export interface PageSeo {
  /** Chemin canonique, sans slash final (`""` pour l'accueil). */
  path: string;
  /** Titre court, complété par le template `%s | RoC Helper`. */
  title: string;
  /** Titre affiché en gros sur l'image de partage. */
  headline: string;
  description: string;
  /**
   * Visuel(s) mis en avant sur l'image de partage (chemins sous `public/`).
   * Plusieurs = grille 2×2 (accueil : un visuel par outil).
   */
  illustrations: string[];
  keywords: string[];
}

export const PAGES = {
  home: {
    path: "",
    title: SITE_TAGLINE,
    headline: "Tools to optimize your Rise of Cultures progress",
    description: SITE_DESCRIPTION,
    illustrations: [
      "/images/technos/high_middle_ages/hm_13.webp",
      "/images/vault/icon_heritage.webp",
      "/images/technos/kingdom_of_sicily/ks_41.webp",
      "/images/technos/bronze_age/ba_8.webp",
    ],
    keywords: [],
  },
  calculator: {
    path: "/calculator",
    title: "Resource Calculator",
    headline: "Resource Calculator",
    description:
      "Plan your Rise of Cultures buildings and see every coin, food and good you need, era by era, with your workshop setup.",
    illustrations: ["/images/technos/high_middle_ages/hm_13.webp"],
    keywords: ["Rise of Cultures resource calculator", "Rise of Cultures goods", "building costs"],
  },
  campaign: {
    path: "/campaign",
    title: "Campaign Tracker",
    headline: "Campaign Tracker",
    description:
      "Track your Rise of Cultures campaign progress era by era: regions, scouting and conquest costs, and what is left to do.",
    illustrations: ["/images/technos/iberian_era/ie_31.webp"],
    keywords: ["Rise of Cultures campaign", "Rise of Cultures map", "scout regions"],
  },
  technologies: {
    path: "/technologies",
    title: "Technology Tree Planner",
    headline: "Technology Tree Planner",
    description:
      "Explore every Rise of Cultures technology by era, plan your research path and get the total cost in coins, food and goods.",
    illustrations: ["/images/technos/kingdom_of_sicily/ks_41.webp"],
    keywords: ["Rise of Cultures technologies", "Rise of Cultures tech tree", "research planner"],
  },
  vault: {
    path: "/vault",
    title: "Heritage Vault Calculator",
    headline: "Heritage Vault Calculator",
    description:
      "Rise of Cultures Heritage Vault calculator for all 13 vaults: tier effects, slots, sacrifice and combination simulator, level table and keeper offers.",
    illustrations: ["/images/vault/keeper.webp"],
    keywords: [
      "Rise of Cultures Heritage Vault",
      "Heritage Vault calculator",
      "evolving buildings",
      "evolution tokens",
      "keeper offers",
    ],
  },
  wonders: {
    path: "/wonders",
    title: "World Wonders Planner",
    headline: "World Wonders Planner",
    description:
      "Track your Rise of Cultures World Wonders levels, compare their bonuses and build the best presets for your city.",
    illustrations: ["/images/technos/bronze_age/ba_8.webp"],
    keywords: ["Rise of Cultures wonders", "World Wonders", "wonder presets"],
  },
  help: {
    path: "/help",
    title: "Help & Guides",
    headline: "Help & Guides",
    description: "How to use RoC Helper: guides for the calculator, technology planner, campaign tracker and Heritage Vault.",
    illustrations: ["/images/vault/icon_heritage.webp"],
    keywords: ["RoC Helper guide"],
  },
} satisfies Record<string, PageSeo>;

export type PageKey = keyof typeof PAGES;

export const OG_IMAGE_SIZE = { width: 1200, height: 630 };

export function ogImagePath(key: PageKey): string {
  return `/og/${key}.png`;
}

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path || "/"}`;
}

/**
 * Métadonnées complètes d'une page.
 *
 * ⚠️ Next fusionne `openGraph`/`twitter` de façon SUPERFICIELLE : un segment
 * qui n'en redéfinit pas hérite tel quel de celui du layout racine (titre et
 * description de l'accueil). D'où l'objet complet ici, pour chaque page.
 * L'image est générée au build par `app/og/[image]/route.tsx`.
 */
export function pageMetadata(key: PageKey): Metadata {
  const page: PageSeo = PAGES[key];
  const fullTitle = key === "home" ? `${SITE_NAME} – ${page.title}` : `${page.title} | ${SITE_NAME}`;
  const url = absoluteUrl(page.path);
  const image = {
    url: ogImagePath(key),
    width: OG_IMAGE_SIZE.width,
    height: OG_IMAGE_SIZE.height,
    alt: `${page.headline} – ${SITE_NAME}`,
    type: "image/png",
  };

  return {
    title: key === "home" ? { absolute: fullTitle } : page.title,
    description: page.description,
    keywords: [...page.keywords, ...SITE_KEYWORDS],
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "en_US",
      url,
      title: fullTitle,
      description: page.description,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: page.description,
      images: [image],
    },
  };
}
