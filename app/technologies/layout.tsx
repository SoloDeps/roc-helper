import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Technologies | RoC Helper",
  description: "Plan and visualize your technology tree for Rise of Cultures",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
