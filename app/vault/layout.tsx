import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Heritage Vault – RoC Helper",
  description:
    "Explore the Heritage Vaults of Rise of Cultures: tier effects, slots, chests, and sacrifice simulation.",
};

export default function VaultLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
