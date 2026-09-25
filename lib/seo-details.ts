import { ERAS } from "@/data/config";
import { CAMPAIGN_ERA_IDS, getCampaignsByEra } from "@/data/campaigns/campaigns-registry";
import { TECHNOLOGY_REGISTRY } from "@/data/technos-registry";
import { WONDERS } from "@/data/wonders/index";
import { HERITAGE_VAULTS } from "@/resolvers/heritage";
import type { PageKey } from "@/lib/seo";

// ============================================================
// Texte indexable des pages outils — rendu dans le HTML statique.
//
// Ces pages ne rendent leur contenu qu'une fois le JS exécuté : sans ce texte,
// Google n'y voit que le menu (une vingtaine de mots). Les chiffres et les noms
// sont CALCULÉS depuis les données extraites, jamais recopiés : ils suivent
// chaque mise à jour du jeu sans retouche.
// ============================================================

const ERA_RANGE = `from ${ERAS[0].name} to ${ERAS[ERAS.length - 1].name}`;

function plural(count: number, singular: string, pluralForm = `${singular}s`): string {
  return `${count} ${count > 1 ? pluralForm : singular}`;
}

function listNames(names: string[]): string {
  return names.length > 1 ? `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}` : names.join("");
}

export function pageDetails(key: PageKey): string | undefined {
  switch (key) {
    case "calculator":
      return (
        `Add the buildings you plan to build or upgrade in Rise of Cultures and instantly see the total ` +
        `coins, food and goods required, across all ${plural(ERAS.length, "era")} ${ERA_RANGE}. ` +
        "Add your own workshops to simulate production and track goods output based on your setup."
      );
    case "campaign": {
      const regions = CAMPAIGN_ERA_IDS.reduce((total, era) => total + getCampaignsByEra(era).length, 0);
      return (
        `Every Rise of Cultures campaign region: ${plural(regions, "region")} across ` +
        `${plural(CAMPAIGN_ERA_IDS.length, "era")} ${ERA_RANGE}. ` +
        "Mark scouted regions, check scout costs and rewards, and see what is left in each era."
      );
    }
    case "technologies": {
      const count = Object.values(TECHNOLOGY_REGISTRY).reduce((total, technos) => total + technos.length, 0);
      return (
        `The full Rise of Cultures research tree: ${plural(count, "technology", "technologies")} ` +
        `across ${plural(Object.keys(TECHNOLOGY_REGISTRY).length, "era")} ${ERA_RANGE}. ` +
        "Track unlocked technologies and calculate the total cost between any two nodes."
      );
    }
    case "wonders": {
      const names = Object.values(WONDERS).map((wonder) => wonder.meta.name);
      return (
        `All ${plural(names.length, "World Wonder")} of Rise of Cultures: ${listNames(names)}. ` +
        "Track their levels, compare their bonuses and build presets for your city."
      );
    }
    case "vault":
      return (
        `Pick one of the ${plural(HERITAGE_VAULTS.length, "Heritage Vault")}: ` +
        `${listNames(HERITAGE_VAULTS.map((vault) => `${vault.name} (${vault.buildingName})`))}.`
      );
    default:
      return undefined;
  }
}
