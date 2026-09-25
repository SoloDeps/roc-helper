import { HeritageVaultView } from "@/components/heritage/heritage-vault-view";
import { PageIntro } from "@/components/seo/page-intro";
import { PAGES } from "@/lib/seo";
import { pageDetails } from "@/lib/seo-details";
import { vaultPath } from "@/lib/seo-vault";
import { HERITAGE_VAULTS } from "@/resolvers/heritage";

export default function VaultPage() {
  return (
    <>
      {/* Liens vers les 13 pages coffre : le sélecteur de la vue n'existe
          qu'après montage client, invisible pour les crawlers. */}
      <PageIntro
        page={PAGES.vault}
        details={pageDetails("vault")}
        links={HERITAGE_VAULTS.map((vault) => ({
          href: vaultPath(vault),
          label: `${vault.buildingName} Heritage Vault – ${vault.name}`,
        }))}
        breadcrumb={[]}
      />
      <HeritageVaultView />
    </>
  );
}
