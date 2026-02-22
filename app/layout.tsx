import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { SiteHeader } from "@/components/header/site-header";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/sonner";

const fontCanv = localFont({
  src: "../public/fonts/font-canv.woff2",
  variable: "--font-canv",
});

const fontPro = localFont({
  src: "../public/fonts/font-pro.woff2",
  variable: "--font-pro",
});

export const metadata: Metadata = {
  title: "RoC Helper",
  description: "Resource calculator and research tree planner for Rise of Cultures",
  openGraph: {
    title: "RoC Helper",
    description: "Resource calculator and research tree planner for Rise of Cultures",
    url: "https://roc-helper.com",
    images: [{ url: "https://roc-helper.com/icon1.png" }],
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "RoC Helper",
    description: "Resource calculator and research tree planner for Rise of Cultures",
    images: ["https://roc-helper.com/icon1.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontPro.variable} ${fontCanv.variable} antialiased`}
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
