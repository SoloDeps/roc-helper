import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Sortie de compilation des scripts d'extraction (scripts/extract).
    ".extract-build/**",
    // Données générées par scripts/extract — leur contrat de types
    // (data/wonders/generated/types.ts) reste lui bien vérifié.
    "data/**/generated/*.generated.ts",
  ]),
]);

export default eslintConfig;
