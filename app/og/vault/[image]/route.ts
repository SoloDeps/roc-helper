import { renderThumbnail } from "@/lib/og/render-thumbnail";
import { vaultPageSeo } from "@/lib/seo-vault";
import { HERITAGE_VAULTS, getHeritageVaultBySlug, heritageVaultSlug } from "@/resolvers/heritage";

// Vignette de partage de chaque coffre (portrait du personnage) : `/og/vault/<slug>.png`, générée AU BUILD.
// Même raison que `app/og/[image]/route.tsx` pour le `.png` dans le segment.
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return HERITAGE_VAULTS.map((vault) => ({ image: `${heritageVaultSlug(vault.key)}.png` }));
}

export async function GET(_request: Request, { params }: { params: Promise<{ image: string }> }) {
  const { image } = await params;
  const vault = getHeritageVaultBySlug(image.replace(/\.png$/, ""));
  if (vault === null) return new Response("Not found", { status: 404 });
  return renderThumbnail(vaultPageSeo(vault).image);
}
