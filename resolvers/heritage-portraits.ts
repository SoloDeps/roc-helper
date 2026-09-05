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
 *
 * `width`/`height` sont les dimensions RÉELLES du fichier (relevées au pixel
 * près via `sips -g pixelWidth -g pixelHeight`, PAS déduites du CSS). Elles
 * doivent être posées comme attributs HTML sur la balise `<img>` — voir
 * `getHeritageVaultPortraitSize` — sinon le navigateur ne connaît le ratio
 * largeur/hauteur du portrait qu'une fois l'image décodée : le temps d'un
 * changement de vault, la balise (même `src` remplacé sur le même nœud DOM)
 * retombe à une taille intrinsèque nulle/inconnue avant de sauter à sa taille
 * finale au décodage, ce qui se voit comme le portrait « repositionné » à son
 * apparition — même préchargé en cache, car décoder n'est pas la même chose
 * que peindre. Fixer `width`/`height` fige le ratio dès le premier rendu, y
 * compris pendant le chargement, donc plus aucun saut.
 */
const PORTRAIT_BY_THEME_SUFFIX: Record<
  string,
  { file: string; width: number; height: number; offset?: { x: number; y: number } }
> = {
  Heritage_Celtic: {
    file: "Questgiver_StoneAge_Aedan_fullbody.webp",
    width: 512,
    height: 512,
    offset: { x: 0, y: 0 },
  },
  Heritage_Mongol: {
    file: "Questgiver_StoneAge_GenghisKhan_fullbody.webp",
    width: 507,
    height: 507,
    offset: { x: 0, y: 0 },
  },
  Heritage_Greek: {
    file: "Questgiver_ClassicGreece_Hercules_fullbody.webp",
    width: 672,
    height: 512,
    offset: { x: -33, y: 0 },
  },
  Heritage_Persian: {
    file: "Questgiver_StoneAge_Scheherazade_fullbody.webp",
    width: 233,
    height: 512,
    offset: { x: 40, y: 0 },
  },
  Heritage_Polynesian: {
    file: "Questgiver_StoneAge_Maori_fullbody.webp",
    width: 402,
    height: 512,
    offset: { x: 20, y: 0 },
  },
  Heritage_Japan: {
    file: "Questgiver_StoneAge_Geisha_fullbody.webp",
    width: 392,
    height: 512,
    offset: { x: 20, y: 0 },
  },
  Heritage_MaliEmpire: {
    file: "Questgiver_StoneAge_MansaMusa_fullbody.webp",
    width: 380,
    height: 511,
    offset: { x: 20, y: 0 },
  },
  Heritage_WorldFair: {
    file: "Questgiver_StoneAge_NikolaTesla_fullbody.webp",
    width: 448,
    height: 489,
    offset: { x: 10, y: 0 },
  },
  Heritage_Aztec: {
    file: "Questgiver_StoneAge_Moctezuma_fullbody.webp",
    width: 512,
    height: 512,
    offset: { x: -5, y: 0 },
  },
  Heritage_Halloween: {
    file: "Questgiver_StoneAge_Dracula_fullbody.webp",
    width: 375,
    height: 512,
    offset: { x: 20, y: 0 },
  },
  Heritage_Thai: {
    file: "Questgiver_StoneAge_QueenSuriyothai_fullbody.webp",
    width: 316,
    height: 512,
    offset: { x: 20, y: 0 },
  },
  Heritage_Winter: {
    file: "Questgiver_StoneAge_Margarete_fullbody.webp",
    width: 379,
    height: 490,
    offset: { x: 16, y: 0 },
  },
  Heritage_ATH: {
    file: "Questgiver_StoneAge_PirateCaptain_fullbody.webp",
    width: 402,
    height: 512,
    offset: { x: 20, y: 0 },
  },
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

/**
 * Les dimensions intrinsèques (px) du fichier portrait — à poser en attributs
 * `width`/`height` sur la balise `<img>`, JAMAIS seulement en CSS. Voir la
 * doc de la table : c'est ce qui évite au navigateur de faire retomber la
 * balise à une taille inconnue le temps du décodage à chaque changement de
 * vault. `null` pour un thème sans entrée.
 */
export function getHeritageVaultPortraitSize(
  themeId: string,
): { width: number; height: number } | null {
  const entry = PORTRAIT_BY_THEME_SUFFIX[themeSuffix(themeId)];
  return entry === undefined ? null : { width: entry.width, height: entry.height };
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
 * URLs déjà DÉCODÉES (pas seulement téléchargées) — voir
 * `decodeHeritageVaultPortrait`. Un simple `img.src = url` ne fait que lancer
 * la requête réseau ; le décodage du bitmap (coûteux pour un WebP) reste à
 * faire au moment où la balise visible en a besoin. Ce cache évite de
 * redécoder un portrait déjà vu.
 */
const decodedPortraitUrls = new Set<string>();

/**
 * Décode un portrait en mémoire et résout une fois le bitmap PRÊT À PEINDRE
 * (pas seulement téléchargé) — `HTMLImageElement.decode()`, pas `img.src`
 * seul. Sert de porte : `VaultHeader` n'affiche un nouveau portrait qu'une
 * fois cette promesse résolue, jamais avant, pour ne jamais montrer la
 * balise visible avec un `src`/`transform` déjà à jour mais un bitmap pas
 * encore prêt (ce qui se lisait comme un décalage/saut à l'apparition — le
 * navigateur pouvant continuer d'afficher l'ANCIEN personnage, déjà repositionné
 * par le nouveau `transform`, le temps que le nouveau décode).
 *
 * Résout aussi (sans rejeter) en cas d'échec de décodage : un portrait qui ne
 * décode pas ne doit pas bloquer indéfiniment l'affichage, juste ne pas
 * bénéficier de la garantie de synchronisation. No-op résolu immédiatement
 * côté serveur.
 */
export function decodeHeritageVaultPortrait(url: string): Promise<void> {
  if (typeof window === "undefined" || decodedPortraitUrls.has(url)) {
    return Promise.resolve();
  }
  const img = new window.Image();
  img.src = url;
  return img
    .decode()
    .then(() => {
      decodedPortraitUrls.add(url);
    })
    .catch(() => {
      // Décodage impossible (format non supporté, requête annulée...) — pas
      // fatal, voir la doc ci-dessus.
    });
}

/**
 * Précharge ET décode les 13 portraits en mémoire (jamais montés dans le
 * DOM) pour que la bascule d'un vault à l'autre affiche le portrait déjà
 * prêt — sans ça, chaque changement lance une requête réseau ET un décodage,
 * et l'image (avec son `offset` déjà appliqué) apparaît après coup, ce qui se
 * lit comme un décalage. No-op côté serveur (`Image` n'existe pas hors DOM).
 */
export function preloadHeritageVaultPortraits(): void {
  if (typeof window === "undefined") return;
  for (const url of HERITAGE_VAULT_PORTRAIT_URLS) {
    void decodeHeritageVaultPortrait(url);
  }
}
