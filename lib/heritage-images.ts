// ============================================================
// Images du domaine Heritage Vault.
//
// L'extraction ne porte AUCUN nom d'image pour ces bâtiments : `imageName` est
// vide sur les 44 évolutifs comme sur les 13 bâtiments-marqueurs. La seule
// entrée disponible est donc le NOM affiché, et la convention du wiki est de
// le reprendre mot pour mot, espaces en soulignés (« Grand Smithy » →
// `Grand_Smithy.png`). Les jetons suivent la même règle, suffixés `_Token`.
//
// C'est une convention de nommage, pas une donnée : une image absente rend un
// 404 que `BuildingImage` remplace par le visuel de repli. Rien n'est inventé
// au-delà de cette règle — à l'exception explicite de `WIKI_NAME_EXCEPTIONS`,
// la poignée de fichiers que le wiki ne nomme pas comme sa propre convention.
// ============================================================

import { getEvolvingBuildingByDefinitionId } from "@/resolvers/evolving-buildings";
import { getWikiImageUrl } from "@/lib/utils";

/**
 * ⚠️ LES SEULS NOMS SAISIS À LA MAIN DE CE MODULE.
 *
 * Le wiki n'est PAS cohérent sur l'apostrophe : `Baba_Yaga%27s_Hut.png` la
 * garde (percent-encodée), `Mad_Scientists_Lab.png` la supprime purement et
 * simplement. Aucune règle ne prédit lequel des deux : c'est le nom sous
 * lequel un contributeur a téléversé le fichier, pas une convention. Les 4
 * noms à apostrophe ont donc été testés un par un (HTTP 200 / 404) :
 *
 *   Mansa%27s_Treasury      200   Mansas_Treasury       404
 *   Dracula%27s_Castle      200   Draculas_Castle       404
 *   Baba_Yaga%27s_Hut       200   Baba_Yagas_Hut        404
 *   Mad_Scientist%27s_Lab   404   Mad_Scientists_Lab    200  ← l'exception
 *
 * Cette table ne liste QUE les écarts à la règle. Une entrée s'y ajoute
 * uniquement sur constat d'un 404 vérifié, jamais sur supposition.
 */
const WIKI_NAME_EXCEPTIONS: Record<string, string> = {
  "Mad Scientist's Lab": "Mad_Scientists_Lab",
};

/**
 * « Grand Smithy » → `Grand_Smithy`, « Mansa's Treasury » → `Mansa%27s_Treasury`.
 *
 * ⚠️ L'APOSTROPHE EST PERCENT-ENCODÉE. Le wiki sert ses fichiers sous
 * `Baba_Yaga%27s_Hut.png` : une apostrophe littérale dans l'URL rend un 404,
 * donc le repli de `BuildingImage` sur TOUS les bâtiments qui en portent une.
 * Le reste de la ponctuation est conservé tel quel — seule l'apostrophe pose
 * problème dans les noms rencontrés, et `WIKI_NAME_EXCEPTIONS` a le dernier
 * mot pour les fichiers téléversés hors de cette règle.
 */
function toWikiName(name: string): string {
  const trimmed = name.trim();
  const exception = WIKI_NAME_EXCEPTIONS[trimmed];
  if (exception !== undefined) return exception;
  return trimmed.replace(/\s+/g, "_").replace(/'/g, "%27");
}

/**
 * Le visuel d'un évolutif éligible, depuis son `BuildingDefinition.id`.
 * `null` quand le domaine Bâtiments ne connaît pas l'identifiant.
 */
export function getHeritageBuildingImageUrl(buildingId: string): string | null {
  const building = getEvolvingBuildingByDefinitionId(buildingId);
  if (building === null) return null;
  return getWikiImageUrl(toWikiName(building.name), false, 1);
}

/** Le visuel du JETON d'un évolutif — `<Nom>_Token` sur le wiki. */
export function getHeritageTokenImageUrl(buildingId: string): string | null {
  const building = getEvolvingBuildingByDefinitionId(buildingId);
  if (building === null) return null;
  return getWikiImageUrl(`${toWikiName(building.name)}_Token`, false, 1);
}

/**
 * Le visuel wiki d'une récompense qui n'a QUE son nom affiché — aujourd'hui
 * les personnalisations de bâtiment versées par un coffre (« Baobab Tree »,
 * `BuildingCustomization_EventMaliEmpire2022_CultureSite_Compact1`).
 *
 * ⚠️ POURQUOI LE WIKI ET PAS `/public`. Une personnalisation n'a d'asset dans
 * AUCUN dossier local — ni `goods`, ni `inventory` : `getItemIconLocal` rendait
 * un 404 puis le carré `default.webp`. Le wiki, lui, publie le fichier sous le
 * nom affiché (`Baobab_Tree.png`, HTTP 200 vérifié), exactement la convention
 * déjà appliquée aux bâtiments évolutifs — mêmes règles d'encodage et mêmes
 * exceptions, d'où la réutilisation de `toWikiName` plutôt qu'un second
 * chemin parallèle.
 */
export function getHeritageWikiImageUrlByName(name: string): string {
  return getWikiImageUrl(toWikiName(name), false, 1);
}
