import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { SiteHeader } from "@/components/header/site-header";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/sonner";

const fontSans = localFont({
  src: "../public/fonts/font-sans.woff2",
});

export const metadata: Metadata = {
  title: "RoC Helper",
  description: "Resource calculator and building planner for Rise of Cultures",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.className} antialiased`}
        suppressHydrationWarning
      >
        <Providers>
          <div className="max-h-screen-patched min-h-screen-patched flex w-full flex-col overflow-auto bg-background-200">
            <TailwindIndicator />
            <SiteHeader />
            {children}
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
