# Layout Builder — décision technique et budget de performance

Objectif : une fluidité de niveau Canva, **sur mobile comme sur desktop**, en
export statique GitHub Pages, sans budget d'infrastructure.

Ce document porte les décisions et leur *pourquoi*. Il se relit avant chaque
phase et se **corrige** quand le réel contredit une règle — en disant pourquoi,
jamais par réécriture silencieuse.

## 1. Moteur de rendu : Canvas 2D natif

**Décidé. Pas de bibliothèque de rendu.**

Le calcul qui tranche : la plus grande carte fait 15×15 cases d'expansion, soit
~2 000 cellules 1×1, plus quelques centaines de bâtiments. On est **deux ordres
de grandeur** sous le seuil où WebGL commence à payer (~50 000 quads).

| Option | Verdict |
|---|---|
| **Canvas 2D natif** | ✅ **retenu** |
| DOM / CSS transforms | ~1 000 nœuds → layout thrash sur mobile |
| SVG | pire que le DOM : parsing + résolution de style par nœud |
| Konva | retained mode node-based → pression GC, abstraction inutile ici |
| react-konva / r3f | remet React dans la boucle de rendu = le bug à corriger |
| Pixi / WebGL | +300–400 Ko gzip, batterie mobile, `webglcontextlost` à gérer sur iOS Safari dès que l'onglet passe en arrière-plan |

Référence externe : [isometric-city](https://github.com/amilich/isometric-city)
(Next.js 16 + Canvas natif, aucun moteur de jeu) arrive à la même conclusion,
avec une contrainte *supérieure* à la nôtre (tri en profondeur isométrique, que
notre grille orthogonale n'a pas).

> Ce qui distingue les applications de référence, ce n'est jamais la
> bibliothèque — c'est la discipline sur la boucle de rendu. Canvas 2D bien
> architecturé bat Pixi mal utilisé, largement.

## 2. Les 8 règles d'architecture

Elles sont la vraie substance de la décision. Une régression sur l'une d'elles
est un bug de performance, pas un détail de style.

### R1 — React ne rend jamais le canvas

Frontière stricte : React monte le `<canvas>` une fois et **ne re-rend plus
pendant les interactions**. Caméra, drag, hover, lasso vivent dans des `useRef`
ou un store mutable hors React. React ne réagit qu'aux changements
*sémantiques* (sélection, ajout/suppression d'entité) pour l'Inspector et la
palette.

**Zéro `setState` dans `onPointerMove`.** Règle non négociable.

### R2 — Un seul rAF, piloté par dirty-flag

`engine.markDirty()` pose un booléen ; une boucle rAF unique, démarrée
seulement quand dirty, rend **au plus une fois par frame**. Ça borne le coût
quel que soit le débit d'événements du navigateur (120–240/s sur écran haute
fréquence). Compléter avec `event.getCoalescedEvents()` pour lisser un drag
sans multiplier les rendus.

### R3 — Deux couches (le gain n°1)

Un `OffscreenCanvas` (repli : `document.createElement("canvas")`) porte la
grille, les expansions et les zones de culture fixes. Il n'est redessiné que
quand **zoom / taille / cases débloquées** changent. Le pan devient un seul
`drawImage(staticLayer, dx, dy)`.

Le layer dynamique (entités, sélection, ghost de drag, lasso) est le seul
repeint à 60 fps.

→ On passe de ~1 000 `stroke()` par frame à **un `drawImage`**.

### R4 — Culling + index spatial

Bounds visibles calculées une fois par frame. Une grille de hachage
`Map<cellKey, entityId[]>` (cellule = 8 unités monde) sert au culling, au
hit-test O(1) et au test de placement. Sans elle, le lasso est quadratique.

L'encodage entier des cellules existe déjà : `cellKey(x, y)` dans
`resolvers/city-grid.ts` — un `Set<number>`, pas un `Set<string>`, pour ne pas
allouer de chaîne dans la boucle chaude.

### R5 — DPR clampé à 2

`Math.min(devicePixelRatio, 2)`. Un iPhone en DPR 3 pousse 2,25× plus de pixels
qu'en DPR 2 pour une différence **invisible** sur une grille de rectangles.
C'est le levier mobile le moins cher du lot.

### R6 — Sprites pré-rasterisés

Jamais de `drawImage` d'un PNG 512px dans une case de 40px à chaque frame. À la
première utilisation : rasterisation hors-écran au bucket le plus proche
(32 / 64 / 128), cache par `buildingId|level|bucket`, décodage via
`createImageBitmap()` (hors thread principal).

### R7 — Zéro `getComputedStyle` dans la boucle

Couleurs du thème lues une fois au mount et à chaque changement de thème,
stockées dans un objet mutable. Les lire par frame force un style-recalc
synchrone à chaque trame de pan.

### R8 — La simulation hors du chemin de rendu

Bonheur / production / culture en debounce. Si le calcul dépasse ~5 ms, dans un
Web Worker (compatible export statique : c'est un fichier servi).

## 3. Multi-touch

Un module unique `usePointerGestures`, souris et doigt confondus, avec
`Map<pointerId, Point>`.

| Geste | Comportement |
|---|---|
| 1 doigt sur du vide | pan |
| 1 doigt sur une entité | drag — seuil 8 px + délai ~120 ms pour le distinguer d'un pan démarré sur un bâtiment |
| 2 doigts | pinch-zoom **et** pan simultanés : on garde fixe le point monde sous le centroïde. Même formule que `zoomAt`, avec le centroïde comme point écran et `distance / prevDistance` comme facteur |
| long-press ~450 ms (tolérance 10 px) | menu contextuel supprimer / dupliquer / pivoter — remplace le clic droit |

- `touch-action: none` sur le canvas **et** `overscroll-behavior: contain` sur
  le conteneur, sinon pull-to-refresh iOS/Android en plein drag.
- **Rubber-band** aux bornes de zoom plutôt qu'un clamp dur : c'est ce qui
  donne la sensation « native ».

## 4. Shell responsive

Canva sur mobile ne *rétrécit* pas son layout desktop, il le **réorganise**.

| | Desktop (≥ 768 px) | Mobile |
|---|---|---|
| Chrome | header + rail d'icônes gauche + panneau large + canvas + inspector droite | canvas plein écran + barre d'outils basse |
| Rail | colonne fixe | rangée d'onglets horizontale |
| Palette / Inspector | panneaux latéraux | **bottom sheets** (`vaul`) avec snap points ~30 % / ~90 % |

À reprendre de Canva : rail d'icônes fixe, sélecteur de nom de fichier dans le
header, dock de zoom en bas, toolbar contextuelle flottante au-dessus de la
sélection.

**Un seul moteur canvas, deux chromes.** Ne jamais dupliquer le moteur.

Le projet a déjà le pattern : `useMediaQuery("(min-width: 768px)")` +
composants `-desktop` / `-mobile` (`app/technologies/page.tsx`), et `vaul` est
installé et utilisé (`components/technology/tech-path-drawer.tsx`).

⚠️ **Piège à corriger dans le builder** : `hooks/use-media-query.ts` démarre à
`false`, donc en export statique le premier paint est toujours « mobile ». Pour
l'éditeur, initialiser à `null` et ne pas monter le chrome tant que ce n'est
pas résolu — sinon on paye un montage/démontage complet du shell à chaque
chargement desktop. Le canvas, lui, peut monter tout de suite.

## 5. Contraintes GitHub Pages — et ce qu'elles n'empêchent pas

Tout est client-side, donc rien ne bloque.

- Persistance : **Dexie**, base séparée de `lib/db/` existante.
- Éditeur : page statique unique + `?id=` via `useSearchParams()` dans un
  `"use client"` sous `<Suspense>`.
- Vignettes : `canvas.toBlob()` + stockage du `Blob` dans Dexie — **pas**
  `toDataURL()`, dont le base64 gonfle IndexedDB de 33 %.
- Partage : encodage varint de l'état + `CompressionStream("deflate-raw")`
  (natif, zéro dépendance) → base64url dans le **hash** `#`. Le hash n'est
  jamais envoyé au serveur : idéal pour Pages.

## 6. Budget de performance

Mesurable, pas déclaratif. À vérifier à la fin de chaque phase qui touche au
rendu.

| Cible | Seuil | Comment le vérifier |
|---|---|---|
| JS par frame (mobile) | **< 8 ms** | Performance panel, throttling 4× CPU |
| INP | **< 200 ms** | Lighthouse / Web Vitals |
| Bundle de la route builder | **< 150 Ko gzip** hors data | `import()` dynamique de la palette et du catalogue, jamais d'import statique des images |
| Re-renders React pendant pan/pinch | **0** | React DevTools Profiler, « Highlight updates » |

Le dernier est le test qui valide toute l'architecture : si quelque chose
clignote pendant un pan, R1 est violée.

État actuel : données de grille à **7,1 Ko gzip** — le budget n'est pas menacé.
