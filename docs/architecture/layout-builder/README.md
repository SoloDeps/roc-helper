# Layout Builder — état d'avancement

Éditeur visuel de plan de ville pour Rise of Cultures : poser des bâtiments sur
une grille, calculer bonheur / production / synergies, sauvegarder plusieurs
layouts. Cible : **desktop et mobile**, fluidité de niveau Canva, sur un export
statique GitHub Pages.

> **Ce document est le point d'entrée et le journal de bord.** Il se met à jour
> à chaque fin de phase. Quelqu'un qui reprend le sujet après plusieurs
> semaines — ou dans une autre conversation — doit pouvoir repartir d'ici seul.

| | |
|---|---|
| Branche | `feat/layout-builder` |
| Démarré | 2026-09-05 |
| Dernière mise à jour | 2026-09-05 (fin de Phase 0) |

## Documents

| Doc | Contenu |
|---|---|
| [`01-performance.md`](01-performance.md) | **La décision technique.** Choix du moteur de rendu, alternatives écartées, les 8 règles d'architecture, multi-touch, shell responsive, budgets de perf à tenir |
| [`02-data-model.md`](02-data-model.md) | **Le modèle de données.** Aires jouables, surfaces, pièges du game design, jointure avec le catalogue de bâtiments |
| [`03-historique.md`](03-historique.md) | **L'audit du prototype précédent** : ce qui a été repris, ce qui a été jeté et pourquoi |

## Avancement

| Phase | Contenu | Statut |
|---|---|---|
| **0** | Extraction des données de grille depuis le game design | ✅ **fait** — commit `9accb24` + suivant |
| **1** | `lib/layout/engine/` — camera, layers, boucle dirty, index spatial, cache de sprites. Zéro import React | ⏳ à faire |
| **2** | `usePointerGestures` — souris et multi-touch unifiés (pan, pinch, drag, long-press) | ⏳ à faire |
| **3** | Le shell — `BuilderShell` desktop + bottom sheets mobile (vaul) | ⏳ à faire |
| **4** | State — Zustand + Immer, persistance Dexie, undo/redo par patches | ⏳ à faire |
| **5** | Simulation — bonheur / production / zones de culture, sur les resolvers | ⏳ à faire |

### Phase 0 — livré

| Fichier | Rôle |
|---|---|
| `scripts/extract/city-grid.ts` | Extracteur, `pnpm extract:city-grid` |
| `data/city-grid/generated/types.ts` | Forme de l'extraction |
| `data/city-grid/generated/city-grid.generated.ts` | Module généré — **7,1 Ko gzip** |
| `resolvers/city-grid.ts` | Cartes jouables, ère plancher, index de placement |
| `data/city-grid/generated/city-grid.generated.test.ts` | 27 tests de garde-fou |

Résultat : 6 villes, **7 cartes jouables**, 832 cases (621 constructibles), 58
cases débloquées au démarrage, 8 zones de culture, 9 bâtiments fixes,
**0 point indéterminé**, et l'**ère plancher** de chaque carte (le Port
n'ouvre qu'en EG). Détail dans [`02-data-model.md`](02-data-model.md).

Aucune donnée de l'ancien prototype n'a été reprise : tout est dérivé de
`source/gamedesign.json` + `source/loca.json`.

### Vocabulaire — à ne pas confondre

Trois mots reviennent partout et deux sont homophones en français. Ils sont
fixés ici une fois pour toutes.

| Terme | Type | Sens | Exemples |
|---|---|---|---|
| **Carte** | `CityMap` | Ce que le joueur ouvre dans l'éditeur, et ce qu'un layout référence. L'unité de travail | `City_Capital\|LAND` (Capitale), `City_Capital\|HARBOR` (Port) |
| **Surface** | `SurfaceCode` | La nature du terrain d'une case, À L'INTÉRIEUR d'une carte. Décide de ce qui est posable et de la palette | `LAND`, `HARBOR`, `WATER` |
| **Ère** | `EraCode` | L'axe temporel de progression. Sans rapport avec les deux précédents | `SA`, `EG`, `LG` |

⚠️ On dit **carte**, jamais « aire » : le mot est l'homophone d'« ère » et les
deux notions se croisent en permanence (une carte a une ère plancher). La
confusion a déjà eu lieu une fois, elle a coûté un aller-retour.

## Contraintes non négociables

Elles viennent de `CLAUDE.md` et ne se rediscutent pas phase par phase.

- **Export statique** (`output: "export"`) sur GitHub Pages. Pas de serveur :
  ni middleware, ni Server Actions, ni route handler runtime, ni ISR.
- **Pas de route dynamique `[id]`** : les layouts naissent côté client dans
  Dexie, leur id n'existe pas au build. L'éditeur est **une page statique
  unique** qui lit `?id=` via `useSearchParams()`, dans un composant
  `"use client"` enveloppé de `<Suspense>` (obligatoire, même en dev).
- **pnpm**, jamais npm ni yarn.
- Tout l'état persistant vit côté client (Dexie / IndexedDB).

## Comment mettre ce dossier à jour

À la fin de chaque phase :

1. Passer la ligne de la phase à ✅ dans le tableau d'avancement, avec le
   commit.
2. Ajouter le tableau « livré » de la phase, comme pour la Phase 0.
3. Reporter dans [`01-performance.md`](01-performance.md) toute règle qui a dû
   être amendée face au réel — **en disant pourquoi**, pas en la réécrivant
   silencieusement.
4. Reporter dans [`02-data-model.md`](02-data-model.md) toute découverte sur
   les données, et croiser avec `docs/game-schema/` si elle touche le modèle
   canonique.
5. Mettre à jour la date en tête de ce fichier.
