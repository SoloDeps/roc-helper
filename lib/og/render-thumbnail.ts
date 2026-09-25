import { join } from "node:path";
import sharp from "sharp";

import { OG_IMAGE_SIZE } from "@/lib/seo";

// ============================================================
// Vignettes de partage (Open Graph / X) — générées AU BUILD par les routes
// `app/og/**`, jamais au runtime (export statique).
//
// Juste le visuel (personnage, icône d'outil), centré dans un carré à fond
// transparent : le titre et la description de l'embed portent déjà le texte.
// `sharp` convertit au passage le WebP de `public/` en PNG, format lu partout.
// ============================================================

export async function renderThumbnail(publicPath: string): Promise<Response> {
  const png = await sharp(join(process.cwd(), "public", publicPath))
    .resize(OG_IMAGE_SIZE.width, OG_IMAGE_SIZE.height, {
      fit: "contain",
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png({ palette: true, quality: 90, effort: 10 })
    .toBuffer();

  return new Response(new Uint8Array(png), { headers: { "Content-Type": "image/png" } });
}
