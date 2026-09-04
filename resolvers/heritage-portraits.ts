/**
 * Portraits des Heritage Vaults — correspondance visuelle, pas du domaine.
 *
 * ⚠️ Le game design ne porte AUCUN nom d'asset pour ces personnages (comme les
 * bâtiments-marqueurs, cf. `lib/heritage-images.ts`) : c'est une table figée,
 * établie à la main contre le contenu réel de `public/images/vault/characters/`.
 *
 * Indexée par le SUFFIXE du `themeId` (`Heritage_Celtic`, pas
 * `heritage_vault.Heritage_Celtic`) : c'est ce suffixe, stable depuis l'ancien
 * projet, qui identifie visuellement chaque thème — le préfixe
 * `heritage_vault.` est un détail d'espace de noms du game design, sans valeur
 * de correspondance. Aucune liste de noms n'est redéclarée ici : la table ne
 * fait que pointer vers un fichier, `HERITAGE_VAULTS` reste l'unique source du
 * reste (nom, thème, bâtiment).
 *
 * `offset` est un réglage PUREMENT visuel, indépendant du fichier : les 13
 * portraits sont déjà rognés au plus près du personnage (aucune marge
 * transparente à couper, vérifié pixel par pixel), mais leur ratio largeur/
 * hauteur varie du simple au triple (233×512 à 672×512) — la carte les affiche
 * tous dans le MÊME gabarit (`h-25 md:h-32`, `object-contain`), donc un
 * personnage à la pose asymétrique (bras tendu, cape) peut sembler décalé une
 * fois calé dans ce gabarit commun. `{ x, y }` (en px, positif = droite/bas)
 * corrige ce cas au cas par cas ; `{ x: 0, y: 0 }` — le défaut — ne change
 * rien. À ajuster à l'œil dans l'app, jamais deviné.
 */
const PORTRAIT_BY_THEME_SUFFIX: Record<
  string,
  { file: string; offset?: { x: number; y: number } }
> = {
  Heritage_Celtic: { file: "Questgiver_StoneAge_Aedan_fullbody.webp", offset: { x: 0, y: 0 } },
  Heritage_Mongol: { file: "Questgiver_StoneAge_GenghisKhan_fullbody.webp", offset: { x: 0, y: 0 } },
  Heritage_Greek: { file: "Questgiver_ClassicGreece_Hercules_fullbody.webp", offset: { x: -33, y: 0 } },
  Heritage_Persian: { file: "Questgiver_StoneAge_Scheherazade_fullbody.webp", offset: { x: 40, y: 0 } },
  Heritage_Polynesian: { file: "Questgiver_StoneAge_Maori_fullbody.webp", offset: { x: 20, y: 0 } },
  Heritage_Japan: { file: "Questgiver_StoneAge_Geisha_fullbody.webp", offset: { x: 20, y: 0 } },
  Heritage_MaliEmpire: { file: "Questgiver_StoneAge_MansaMusa_fullbody.webp", offset: { x: 20, y: 0 } },
  Heritage_WorldFair: { file: "Questgiver_StoneAge_NikolaTesla_fullbody.webp", offset: { x: 10, y: 0 } },
  Heritage_Aztec: { file: "Questgiver_StoneAge_Moctezuma_fullbody.webp", offset: { x: -5, y: 0 } },
  Heritage_Halloween: { file: "Questgiver_StoneAge_Dracula_fullbody.webp", offset: { x: 20, y: 0 } },
  Heritage_Thai: { file: "Questgiver_StoneAge_QueenSuriyothai_fullbody.webp", offset: { x: 20, y: 0 } },
  Heritage_Winter: { file: "Questgiver_StoneAge_Margarete_fullbody.webp", offset: { x: 16, y: 0 } },
  Heritage_ATH: { file: "Questgiver_StoneAge_PirateCaptain_fullbody.webp", offset: { x: 20, y: 0 } },
};

/** `heritage_vault.Heritage_Celtic` → le suffixe qui indexe la table ci-dessus. */
function themeSuffix(themeId: string): string {
  return themeId.split(".").pop() ?? themeId;
}

/**
 * Le portrait full-body du personnage associé à un vault, `null` si le thème
 * n'a pas (encore) d'entrée — un futur vault ne casse pas le rendu, il perd
 * juste son portrait.
 */
export function getHeritageVaultPortraitUrl(themeId: string): string | null {
  const entry = PORTRAIT_BY_THEME_SUFFIX[themeSuffix(themeId)];
  return entry === undefined ? null : `/images/vault/characters/${entry.file}`;
}

/**
 * Le réglage fin de placement du portrait — voir la doc de la table.
 * `{ x: 0, y: 0 }` pour un thème sans entrée ou sans `offset` déclaré : jamais
 * de décalage par défaut.
 */
export function getHeritageVaultPortraitOffset(themeId: string): { x: number; y: number } {
  const entry = PORTRAIT_BY_THEME_SUFFIX[themeSuffix(themeId)];
  return entry?.offset ?? { x: 0, y: 0 };
}

/** Image générique du gardien — une seule pour les 13 vaults, pas de variante. */
export const HERITAGE_KEEPER_IMAGE_URL = "/images/vault/keeper.webp";

/**
 * Les URLs de tous les portraits déclarés, pour préchargement — voir
 * `preloadHeritageVaultPortraits`. Ordre sans importance.
 */
export const HERITAGE_VAULT_PORTRAIT_URLS: readonly string[] = Object.values(
  PORTRAIT_BY_THEME_SUFFIX,
).map((entry) => `/images/vault/characters/${entry.file}`);

/**
 * Précharge les 13 portraits en mémoire (`new Image()`, jamais montés dans le
 * DOM) pour que la bascule d'un vault à l'autre affiche le portrait déjà
 * décodé — sans ce préchargement, chaque changement lance une requête réseau
 * et l'image (avec son `offset` déjà appliqué) apparaît après coup, ce qui se
 * lit comme un décalage. No-op côté serveur (`Image` n'existe pas hors DOM).
 */
export function preloadHeritageVaultPortraits(): void {
  if (typeof window === "undefined") return;
  for (const url of HERITAGE_VAULT_PORTRAIT_URLS) {
    const img = new window.Image();
    img.src = url;
  }
}
