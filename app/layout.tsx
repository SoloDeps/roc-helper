import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter } from "next/font/google";
import "./globals.css";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { SiteHeader } from "@/components/site-header";
import { ThemeProvider } from "@/components/theme-provider";
import { Providers } from "./providers";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

const fontSans = localFont({
  src: "../public/fonts/font-sans.woff2",
});

export const metadata: Metadata = {
  title: "RoC Wiki Goods Calculator",
  description: "Resource calculator and building planner for Rise of Cultures",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${fontSans.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {/* ✅ Wrap everything in Providers for React Query */}
          <Providers>
            <div className="max-h-screen-patched min-h-screen-patched flex w-full flex-col overflow-auto bg-background-200">
              <TailwindIndicator />
              <SiteHeader />
              {children}
            </div>
            <Toaster />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
