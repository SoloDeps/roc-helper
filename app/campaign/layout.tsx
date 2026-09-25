import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("campaign");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
