# Layout Builder — audit du prototype précédent

Un premier Layout Builder avait été construit sur l'ancienne fondation du
projet, avant la refonte autour de `source/gamedesign.json`. Il vivait sur la
branche `feat/layout-builder`, **supprimée le 2026-09-05** (103 commits), et
n'existe plus que comme copie de fichiers hors git.

Ce document existe pour que rien de ce qui a été appris ne se reperde, et pour
qu'on ne refasse pas les mêmes erreurs par oubli.

## 1. Ce qui était bon

- La séparation `lib/layout/{render,simulation,state,db}` avec la règle
  **« zéro import react/zustand dans `render/` »**. C'est la bonne frontière,
  elle est reprise telle quelle.
- Canvas 2D natif, immediate mode, pas de boucle rAF permanente.
- `camera.ts` (176 lignes) : fonctions pures `worldToScreen` / `screenToWorld`
  / `pan` / `zoomAt`, inversion de l'axe Y isolée à la **seule** frontière
  monde → écran. **Le seul fichier à reprendre presque tel quel** (Phase 1).
- `placement.ts` pur et testé.
- La décision « pas de route dynamique `[cityId]` → `editor?id=` + Suspense » :
  obligatoire en export statique, toujours valide.
- Le document de décisions produit (palette en liste plate, pose auto sur la
  première case libre, undo/redo par patches Immer, switch de layout dans le
  header façon Canva) : ces arbitrages restent bons et sont à rejouer.

## 2. Ce qui cassait la performance — à ne pas reproduire

| # | Problème | Où |
|---|---|---|
| 1 | **La caméra vivait dans un `useState` React.** Chaque `pointermove` re-rendait un composant de 1 297 lignes (~30 hooks) puis un `useEffect` à **17 dépendances**. Tueur de framerate n°1 sur mobile | `LayoutCanvas.tsx:172` |
| 2 | **Zéro multi-touch.** Aucune `Map<pointerId>` : pas de pinch-to-zoom, zoom uniquement à la molette. Inutilisable au doigt | `LayoutCanvas.tsx:697-1042` |
| 3 | **Pas de coalescing rAF** : un `pointermove` → un rendu synchrone, plus souvent que l'écran ne rafraîchit | idem |
| 4 | **Une seule couche.** Le `layers.ts` prévu par le doc n'a jamais été écrit : chaque frame redessinait les 100+ cases avec un `beginPath()/stroke()` de sous-grille chacune | `grid.ts` |
| 5 | **`getComputedStyle` à chaque frame** (`readLayoutColors()`) : style-recalc synchrone par trame de pan | effet de rendu |
| 6 | **Hit-test linéaire** : `entities.find()` et `slots.find()` à chaque `pointermove` | `LayoutCanvas.tsx` |
| 7 | Monolithe : input + state + catalogue + images + rendu dans un seul fichier de 1 297 lignes | idem |
| 8 | Shell strictement desktop (`grid-cols-[auto_1fr_auto]`, aside 280 px fixe) | `BuilderShell.tsx` |

Les correctifs sont les règles R1–R8 de [`01-performance.md`](01-performance.md).

## 3. Les données : tout jeté

`data/layout-builder/` pesait **4,4 Mo** de données largement saisies ou
dérivées à la main. Elles ont été intégralement abandonnées : le nouveau
`source/gamedesign.json` contient tout, et mieux.

| Ancien | Remplacé par |
|---|---|
| `expansions.ts` (généré par un script sur l'ancienne source) | `ExpansionDefinitionDTO` (832) |
| `fixed-entities.ts` (saisi à la main) | `finish.rewards[].PlaceConstructedBuildingRewardDTO` (9) |
| `culture-areas.ts` | `CityCultureAreaComponentDTO` (8) |
| `gamedesign_distilled.ts` | `BuildingDefinitionDTO.width/height` |
| Notion de « scope » (Capital vs Harbor), saisie | Dérivée : `expansionSubType` + disjonction spatiale |

Résultat : **7,1 Ko gzip** contre 4,4 Mo, et zéro donnée à maintenir à la main.

## 4. Terminologie — un aller-retour à ne pas refaire

Le concept de carte jouable a d'abord été nommé **« aire »** (`CityArea`).
Mauvais choix : homophone d'**« ère »**, alors que les deux notions se croisent
en permanence (une carte a une ère plancher). La confusion a coûté un
aller-retour complet. Le terme retenu est **« carte »** / `CityMap`.

## 5. Références visuelles

- **Canva** — le chrome applicatif : rail d'icônes fixe, panneau large,
  sélecteur de nom de fichier dans le header, dock de zoom en bas, toolbar
  contextuelle flottante. Sur mobile : bottom sheets, pas de panneaux latéraux
  rétrécis.
- **[isometric-city](https://github.com/amilich/isometric-city)** — Next.js 16 +
  Canvas natif, aucun moteur de jeu. Corrobore le choix du moteur. Sa
  difficulté (tri en profondeur isométrique) n'existe pas chez nous : on est en
  grille orthogonale 2D.
- **City planner du wiki Heroes of History** — référence de comportement canvas
  citée par l'ancien doc.
