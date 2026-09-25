import type { MetadataRoute } from "next";

import { PAGES, absoluteUrl } from "@/lib/seo";
import { vaultPath } from "@/lib/seo-vault";
import { HERITAGE_VAULTS } from "@/resolvers/heritage";

// Généré au build (export statique) : `out/sitemap.xml`.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    ...Object.values(PAGES).map((page) => ({
      url: absoluteUrl(page.path),
      changeFrequency: "weekly" as const,
      priority: page.path === "" ? 1 : 0.8,
    })),
    ...HERITAGE_VAULTS.map((vault) => ({
      url: absoluteUrl(vaultPath(vault)),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
