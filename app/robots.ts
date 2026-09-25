import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/seo";

// Généré au build (export statique) : `out/robots.txt`.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: absoluteUrl("/sitemap.xml"),
  };
}
