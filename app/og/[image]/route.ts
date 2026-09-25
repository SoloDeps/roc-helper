import { renderThumbnail } from "@/lib/og/render-thumbnail";
import { PAGES, type PageKey } from "@/lib/seo";

// Vignettes de partage servies en `/og/<page>.png`, générées AU BUILD.
//
// ⚠️ Pas la convention `opengraph-image.tsx` : l'export statique l'écrit SANS
// extension (`out/vault/opengraph-image`), et GitHub Pages déduit le type MIME
// de l'extension — l'image partirait en `application/octet-stream`, que
// Discord/X ignorent. Ici, le segment porte le `.png`.
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(PAGES).map((key) => ({ image: `${key}.png` }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ image: string }> }) {
  const { image } = await params;
  return renderThumbnail(PAGES[image.replace(/\.png$/, "") as PageKey].image);
}
