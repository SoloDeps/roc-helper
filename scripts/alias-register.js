// ============================================================
// ROC Helper – Résolution de l'alias `@/*` pour les scripts Node.
//
// `tsconfig.scripts.json` déclare `paths: { "@/*": ["./*"] }`, mais `tsc`
// n'INSTRUMENTE PAS les `require` émis : `@/data/...` reste tel quel dans
// `.extract-build/**` et Node ne sait pas le résoudre.
//
// Les diffs Technologies et Campaign n'en souffraient pas — leurs registres
// n'utilisent `@/` que pour des imports de TYPE, effacés à la compilation.
// `data/registry.ts` (Bâtiments), lui, importe ~70 modules de VALEUR en `@/`.
//
// D'où ce préchargement, à passer en `node --require ./scripts/alias-register.js`.
// Zéro dépendance : on réécrit le préfixe avant la résolution normale.
// ============================================================

// Préchargé par `node --require`, donc chargé AVANT tout module ES : ce fichier
// doit rester du CommonJS pur, `require` compris.
/* eslint-disable @typescript-eslint/no-require-imports */
const path = require("node:path");
const Module = require("node:module");

// `.extract-build/` reproduit l'arborescence du dépôt : `@/data/x` compilé y
// devient `.extract-build/data/x`. La racine de l'alias est donc le dossier de
// sortie, pas la racine du dépôt.
const OUT_ROOT = path.join(__dirname, "..", ".extract-build");

const resolveFilename = Module._resolveFilename;
Module._resolveFilename = function (request, ...rest) {
  if (typeof request === "string" && request.startsWith("@/")) {
    return resolveFilename.call(this, path.join(OUT_ROOT, request.slice(2)), ...rest);
  }
  return resolveFilename.call(this, request, ...rest);
};
