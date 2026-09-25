/**
 * Données structurées schema.org, figées dans le HTML statique.
 * `<` échappé : le contenu ne peut pas refermer la balise `<script>`.
 */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      // Contenu défini dans le code (lib/seo.ts), aucune donnée utilisateur.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
