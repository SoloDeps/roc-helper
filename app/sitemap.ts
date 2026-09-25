import type { MetadataRoute } from "next";

import { PAGES, absoluteUrl } from "@/lib/seo";

// Généré au build (export statique) : `out/sitemap.xml`.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return Object.values(PAGES).map((page) => ({
    url: absoluteUrl(page.path),
    changeFrequency: "weekly",
    priority: page.path === "" ? 1 : 0.8,
  }));
}
