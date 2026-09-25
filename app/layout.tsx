import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { SiteHeader } from "@/components/header/site-header";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/sonner";
import { JsonLd } from "@/components/seo/json-ld";
import {
  BRAND_COLOR,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL,
  absoluteUrl,
  pageMetadata,
} from "@/lib/seo";

const fontCanv = localFont({
  src: "../public/fonts/font-canv.woff2",
  variable: "--font-canv",
});

const fontPro = localFont({
  src: "../public/fonts/font-pro.woff2",
  variable: "--font-pro",
});

// Défauts du site : chaque page les surcharge via `pageMetadata` (lib/seo.ts).
export const metadata: Metadata = {
  ...pageMetadata("home"),
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} – ${SITE_TAGLINE}`,
    template: `%s | ${SITE_NAME}`,
  },
  applicationName: SITE_NAME,
  category: "games",
  robots: { index: true, follow: true },
  appleWebApp: { title: SITE_NAME },
};

export const viewport: Viewport = {
  themeColor: BRAND_COLOR,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: SITE_NAME,
      alternateName: "Rise of Cultures Helper",
      url: absoluteUrl(""),
      description: SITE_DESCRIPTION,
      inLanguage: "en",
    },
    {
      "@type": "WebApplication",
      name: SITE_NAME,
      url: absoluteUrl(""),
      description: SITE_DESCRIPTION,
      applicationCategory: "GameApplication",
      operatingSystem: "Any",
      browserRequirements: "Requires JavaScript",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      about: { "@type": "VideoGame", name: "Rise of Cultures", publisher: "InnoGames" },
    },
  ],
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
        <JsonLd data={jsonLd} />
        <Providers>
          <div id="app-scroll-container" className="max-h-screen-patched min-h-screen-patched flex w-full flex-col overflow-auto bg-background-200">
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