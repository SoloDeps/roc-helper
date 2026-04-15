import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "World Wonders – RoC Helper",
  description: "Manage your World Wonders, track levels, and explore presets for Rise of Cultures.",
};

export default function WondersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
