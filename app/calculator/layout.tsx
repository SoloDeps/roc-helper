import { PageIntro } from "@/components/seo/page-intro";
import { PAGES, pageMetadata } from "@/lib/seo";
import { pageDetails } from "@/lib/seo-details";

export const metadata = pageMetadata("calculator");

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageIntro page={PAGES.calculator} details={pageDetails("calculator")} breadcrumb={[]} />
      {children}
    </>
  );
}
