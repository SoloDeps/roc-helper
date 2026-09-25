import { PageIntro } from "@/components/seo/page-intro";
import { PAGES, pageMetadata } from "@/lib/seo";
import { pageDetails } from "@/lib/seo-details";

export const metadata = pageMetadata("campaign");

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PageIntro page={PAGES.campaign} details={pageDetails("campaign")} breadcrumb={[]} />
      {children}
    </>
  );
}
