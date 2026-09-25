import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { HeritageVaultView } from "@/components/heritage/heritage-vault-view";
import { PageIntro } from "@/components/seo/page-intro";
import { PAGES, seoMetadata } from "@/lib/seo";
import { vaultOgImagePath, vaultPageSeo } from "@/lib/seo-vault";
import { HERITAGE_VAULTS, getHeritageVaultBySlug, heritageVaultSlug } from "@/resolvers/heritage";

// Une page statique par Heritage Vault (`/vault/ath`, `/vault/celtic`…), pour
// que chaque lien partagé ait SON titre, SA description et SON image : les
// crawlers ne lisent pas la query string. La vue est la même que `/vault` ;
// elle lit le coffre dans le chemin (voir `readVaultKeyFromLocation`).
export const dynamicParams = false;

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return HERITAGE_VAULTS.map((vault) => ({ slug: heritageVaultSlug(vault.key) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const vault = getHeritageVaultBySlug((await params).slug);
  if (vault === null) return {};
  return seoMetadata(vaultPageSeo(vault), vaultOgImagePath(vault));
}

export default async function VaultBySlugPage({ params }: Props) {
  const vault = getHeritageVaultBySlug((await params).slug);
  if (vault === null) notFound();
  const seo = vaultPageSeo(vault);

  return (
    <>
      <PageIntro
        page={seo}
        details={seo.details}
        breadcrumb={[{ name: PAGES.vault.title, path: PAGES.vault.path }]}
      />
      <HeritageVaultView />
    </>
  );
}
