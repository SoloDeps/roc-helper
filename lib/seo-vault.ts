import {
  getEligibleEvolvingBuildings,
  heritageVaultSlug,
  type HeritageVault,
} from "@/resolvers/heritage";
import { getHeritageVaultPortraitUrl } from "@/resolvers/heritage-portraits";
import { PAGES, type PageSeo } from "@/lib/seo";

// ============================================================
// SEO des pages `/vault/<slug>` — une par Heritage Vault, générées au build.
//
// Tout est dérivé du catalogue extrait (`HERITAGE_VAULTS`) : nom, bâtiment,
// niveau max, slots, évolutifs éligibles. Aucun texte saisi à la main par
// coffre — un nouveau vault extrait obtient sa page et son aperçu tout seul.
// ============================================================

export function vaultPath(vault: HeritageVault): string {
  return `/vault/${heritageVaultSlug(vault.key)}`;
}

export function vaultOgImagePath(vault: HeritageVault): string {
  return `/og/vault/${heritageVaultSlug(vault.key)}.png`;
}

export function vaultPageSeo(vault: HeritageVault): PageSeo {
  const buildings = getEligibleEvolvingBuildings(vault.key).map((building) => building.name);

  return {
    path: vaultPath(vault),
    title: `${vault.buildingName} Heritage Vault`,
    // ≤ ~155 caractères (coupure Google) : les évolutifs éligibles vont dans
    // `details` et les mots-clés, pas ici.
    description:
      `Rise of Cultures ${vault.name} Heritage Vault calculator: ` +
      `effects up to level ${vault.maxLevel}, ${vault.slots.length} slots, sacrifice simulator, keeper offers.`,
    details:
      buildings.length > 0
        ? `Eligible evolving buildings for the ${vault.buildingName} Heritage Vault: ${buildings.join(", ")}.`
        : undefined,
    image: getHeritageVaultPortraitUrl(vault.themeId) ?? PAGES.vault.image,
    keywords: [
      `${vault.name} Heritage Vault`,
      `${vault.buildingName} Heritage Vault`,
      ...buildings,
      ...PAGES.vault.keywords,
    ],
  };
}
