import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Research Tree | RoC Helper",
  description: "Plan and visualize your research tree for Rise of Cultures",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
