import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Help | RoC Helper",
  description: "Documentation and guides for using RoC Helper",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
