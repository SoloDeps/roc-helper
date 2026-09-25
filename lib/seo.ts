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

/**
 * Domaine absolu des URL de partage. Surchargeable AU BUILD (`SITE_URL=…
 * pnpm build`) pour tester les aperçus Discord/X derrière un tunnel public,
 * les crawlers n'ayant pas accès à `localhost`.
 */
export const SITE_URL = (process.env.SITE_URL ?? "https://roc-helper.com").replace(/\/$/, "");
export const SITE_NAME = "RoC Helper";
export const SITE_TAGLINE = "Rise of Cultures calculator & planner";
export const SITE_DESCRIPTION =
  "Free Rise of Cultures tools: resource calculator, tech tree planner, campaign tracker, Heritage Vault calculator and World Wonders planner. No login.";

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
  description: string;
  /** Complément rendu dans le HTML de la page (hors meta description). */
  details?: string;
  /** Visuel de la vignette de partage (chemin sous `public/`). */
  image: string;
  keywords: string[];
}

export const PAGES = {
  home: {
    path: "",
    title: SITE_TAGLINE,
    description: SITE_DESCRIPTION,
    image: "/web-app-manifest-512x512.png",
    keywords: [],
  },
  calculator: {
    path: "/calculator",
    title: "Resource Calculator",
    description:
      "Plan your Rise of Cultures buildings and see every coin, food and good you need, era by era, with your workshop setup.",
    image: "/images/technos/high_middle_ages/hm_13.webp",
    keywords: ["Rise of Cultures resource calculator", "Rise of Cultures goods", "building costs"],
  },
  campaign: {
    path: "/campaign",
    title: "Campaign Tracker",
    description:
      "Track your Rise of Cultures campaign progress era by era: regions, scout costs, rewards and what is left to do.",
    image: "/images/technos/iberian_era/ie_31.webp",
    keywords: ["Rise of Cultures campaign", "Rise of Cultures map", "scout regions"],
  },
  technologies: {
    path: "/technologies",
    title: "Technology Tree Planner",
    description:
      "Explore every Rise of Cultures technology by era, plan your research path and get the total cost in coins, food and goods.",
    image: "/images/technos/kingdom_of_sicily/ks_41.webp",
    keywords: ["Rise of Cultures technologies", "Rise of Cultures tech tree", "research planner"],
  },
  vault: {
    path: "/vault",
    title: "Heritage Vault Calculator",
    description:
      "Rise of Cultures Heritage Vault calculator for all 13 vaults: tier effects, slots, sacrifice and combination simulator, level table and keeper offers.",
    image: "/images/vault/icon_heritage.webp",
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
    description:
      "Track your Rise of Cultures World Wonders levels, compare their bonuses and build the best presets for your city.",
    image: "/images/technos/bronze_age/ba_8.webp",
    keywords: ["Rise of Cultures wonders", "World Wonders", "wonder presets"],
  },
  help: {
    path: "/help",
    title: "Help & Guides",
    description: "How to use RoC Helper: guides for the calculator, technology planner, campaign tracker and Heritage Vault.",
    image: "/images/technos/high_middle_ages/hm_16.webp",
    keywords: ["RoC Helper guide"],
  },
} satisfies Record<string, PageSeo>;

export type PageKey = keyof typeof PAGES;

/**
 * Vignette CARRÉE + carte `summary` : Discord et X affichent alors un embed
 * compact (texte à gauche, petite vignette à droite) au lieu de la grande
 * image. Carré ≥ 144 px exigé par X ; Facebook/WhatsApp/LinkedIn, qui
 * ignorent `twitter:card`, basculent eux aussi en petite vignette sous
 * 600 px de large.
 */
export const OG_IMAGE_SIZE = { width: 400, height: 400 };

export function ogImagePath(key: PageKey): string {
  return `/og/${key}.png`;
}

export function absoluteUrl(path: string): string {
  return `${SITE_URL}${path || "/"}`;
}

/**
 * Métadonnées complètes d'une page fixe (voir `PAGES`).
 * La vignette est générée au build par `app/og/[image]/route.tsx`.
 */
export function pageMetadata(key: PageKey): Metadata {
  const page: PageSeo = PAGES[key];
  return seoMetadata(page, ogImagePath(key), {
    fullTitle: key === "home" ? `${SITE_NAME} – ${page.title}` : undefined,
  });
}

/**
 * Métadonnées complètes de n'importe quelle page (fixe ou générée, ex. un
 * coffre `/vault/<slug>`), avec son image de partage `imagePath`.
 *
 * ⚠️ Next fusionne `openGraph`/`twitter` de façon SUPERFICIELLE : un segment
 * qui n'en redéfinit pas hérite tel quel de celui du layout racine (titre et
 * description de l'accueil). D'où l'objet complet ici, pour chaque page.
 */
export function seoMetadata(
  page: PageSeo,
  imagePath: string,
  { fullTitle }: { fullTitle?: string } = {},
): Metadata {
  const shareTitle = fullTitle ?? `${page.title} | ${SITE_NAME}`;
  const url = absoluteUrl(page.path);
  const image = {
    url: imagePath,
    width: OG_IMAGE_SIZE.width,
    height: OG_IMAGE_SIZE.height,
    alt: page.title,
    type: "image/png",
  };

  return {
    // Titre absolu : un layout intermédiaire au titre simple (ex. `/vault`)
    // couperait le `template` du layout racine pour ses enfants.
    title: { absolute: shareTitle },
    description: page.description,
    keywords: [...page.keywords, ...SITE_KEYWORDS],
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      locale: "en_US",
      url,
      title: shareTitle,
      description: page.description,
      images: [image],
    },
    twitter: {
      card: "summary",
      title: shareTitle,
      description: page.description,
      images: [image],
    },
  };
}

/**
 * Fil d'Ariane schema.org (`BreadcrumbList`) — Google l'affiche à la place de
 * l'URL brute dans ses résultats. L'accueil est ajouté en tête.
 */
export function breadcrumbJsonLd(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: SITE_NAME, path: "" }, ...trail].map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
