# CLAUDE.md — roc-helper

Contexte projet pour Claude Code. Lire avant toute modification touchant au front, au build, ou aux dépendances.

## Stack & contraintes

- Next.js 16.x, App Router, **export statique** (`next build` + `output: 'export'`) — déployé sur **GitHub Pages**.
- Aucun serveur Next.js en prod : pas de Node runtime, pas d'Edge runtime.
- **Interdits** dans ce projet (incompatibles avec l'export statique / GitHub Pages) :
  - `middleware.ts` / `proxy.ts`
  - Server Actions (`"use server"`)
  - Route Handlers dynamiques nécessitant un serveur (API routes servies au runtime)
  - `next/image` en mode optimisation serveur (utiliser `unoptimized: true` ou une alternative statique)
  - Toute feature qui suppose un serveur (ISR à la demande, revalidation runtime, ...)
- React 19.2, Tailwind 4, Zustand, Dexie (IndexedDB côté client), TanStack Query/Virtual, @xyflow/react.
- Le state et les données persistantes vivent côté client (Dexie/IndexedDB) — pas de backend.

## Conventions à jour à respecter

- Toujours vérifier les conventions actuelles sur https://nextjs.org/docs (App Router) avant de proposer un pattern — ne pas se fier à des habitudes Pages Router ou Next 13/14.
- Privilégier Server Components par défaut, `"use client"` seulement quand nécessaire (hooks, state, interactivité) — même si le résultat final est exporté statiquement.
- Toute nouvelle dépendance ou pattern doit rester compatible `next build` en mode export (pas de fonctionnalité runtime-only).
- Suivre les règles ESLint du projet (`eslint-config-next`) sans les désactiver sauf justification explicite.

## Build & scripts

- Gestionnaire de paquets : **pnpm** (pas npm/yarn) — utiliser `pnpm install`, `pnpm add`, etc.
- `pnpm build` doit produire un export statique fonctionnel dans `out/`.
- `pnpm start` sert `out/` via `serve` — ne pas confondre avec un serveur Next.js classique.
- Les scripts `extract:*` / `diff:*` sont des outils de build-time (Node), indépendants du runtime Next.js — ne pas les traiter comme faisant partie de l'app.

## Layout Builder

Chantier en cours sur la branche `feat/layout-builder`. **Lire
[`docs/architecture/layout-builder/README.md`](docs/architecture/layout-builder/README.md)
avant toute tâche** touchant `lib/layout/`, `components/layout-builder/`,
`resolvers/city-grid.ts`, `data/city-grid/` ou `scripts/extract/city-grid.ts`.

Ce dossier porte l'état d'avancement (quelle phase, quoi ensuite), les
décisions de performance et le modèle de données. Il se met à jour **à chaque
fin de phase** — la procédure est en bas de son README.

Trois termes à ne pas confondre : **carte** (`CityMap`, l'unité de travail —
Capitale et Port sont deux cartes), **surface** (`SurfaceCode`, le terrain
d'une case) et **ère** (`EraCode`). On dit « carte », jamais « aire » :
homophone d'« ère ».

## Quand un doute existe

Si une fonctionnalité Next.js semble intéressante mais dépend d'un serveur (voir liste des interdits ci-dessus), le signaler explicitement plutôt que de l'implémenter silencieusement.
