import { PageIntro } from "@/components/seo/page-intro";
import { PAGES, pageMetadata } from "@/lib/seo";
import { pageDetails } from "@/lib/seo-details";

export const metadata = pageMetadata("technologies");

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageIntro page={PAGES.technologies} details={pageDetails("technologies")} breadcrumb={[]} />
      {children}
    </>
  );
}
