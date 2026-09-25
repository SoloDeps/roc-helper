import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("calculator");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
