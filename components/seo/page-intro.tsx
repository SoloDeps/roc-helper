import Link from "next/link";

import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbJsonLd, type PageSeo } from "@/lib/seo";

/**
 * Titre et résumé d'une page outil, présents dans le HTML STATIQUE.
 *
 * Les pages outils ne rendent leur interface qu'après montage client : sans
 * ce bloc, moteurs de recherche et lecteurs d'écran n'ont ni `<h1>` ni texte.
 * Masqué visuellement (`sr-only`) — l'interface affiche déjà tout cela.
 */
export function PageIntro({
  page,
  details,
  links,
  breadcrumb,
}: {
  page: PageSeo;
  details?: string;
  /** Liens internes vers les sous-pages (ex. les 13 coffres). */
  links?: { href: string; label: string }[];
  /** Fil d'Ariane au-dessus de la page, accueil exclu. */
  breadcrumb: { name: string; path: string }[];
}) {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([...breadcrumb, { name: page.title, path: page.path }])} />
      <div className="sr-only">
        <h1>{page.title}</h1>
        <p>{page.description}</p>
        {details && <p>{details}</p>}
        {links && links.length > 0 && (
          <ul>
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
