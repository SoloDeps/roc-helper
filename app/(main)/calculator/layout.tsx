// app/calculator/layout.tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calculator | RoC Helper",
  description: "Calculate resources and production costs for Rise of Cultures",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}