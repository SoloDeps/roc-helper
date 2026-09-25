import { JsonLd } from "@/components/seo/json-ld";
import { PAGES, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { HELP_FAQ } from "./faq";

export const metadata = pageMetadata("help");

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: HELP_FAQ.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: { "@type": "Answer", text: item.answer },
  })),
};

// Pas de `PageIntro` : la page d'aide est déjà rendue en entier dans le HTML
// statique, avec son propre `<h1>`.
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: PAGES.help.title, path: PAGES.help.path }])} />
      <JsonLd data={faqJsonLd} />
      {children}
    </>
  );
}
