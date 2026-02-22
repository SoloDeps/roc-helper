"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ModeToggle } from "./mode-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Info } from "lucide-react";
import { WorkshopModal } from "../modals/workshop-modal";
import { MobileNav } from "./mobile-nav";
import { siteConfig } from "@/lib/config";

export function SiteHeader() {
  const pathname = usePathname();
  return (
    <header className="relative z-20 flex w-full shrink-0 items-center justify-between h-[50px] container-wrapper">
      <div className="flex items-center gap-2">
        <MobileNav items={siteConfig.navItems} />
        <Link href="/" className="hidden md:flex items-center gap-2 ">
          <Image
            src="/icon/48.png"
            width={24}
            height={24}
            alt="logo"
            className="shrink-0 object-cover"
          />
          <span className="hidden md:block text-sm font-semibold">
            RoC Helper
          </span>
        </Link>

        {pathname !== "/calculator" && (
          <Button
            variant="outline"
            size="sm"
            className="hidden md:flex"
            asChild
          >
            <Link href="/calculator">
              <span>Calculator</span>
            </Link>
          </Button>
        )}
        {pathname !== "/research-tree" && (
          <Button
            variant="outline"
            size="sm"
            className="hidden md:flex"
            asChild
          >
            <Link href="/research-tree">
              <span>Research Tree</span>
            </Link>
          </Button>
        )}
      </div>

      <div className="flex items-center gap-1.5">
        <ModeToggle />

        <div className="hidden md:flex items-center gap-1.5">
          <Button variant="outline" size="sm" asChild>
            <Link href="/help">
              <span className="inline-block">
                <Info />
              </span>
              <span className="hidden md:inline-block">Help</span>
            </Link>
          </Button>

          <Button variant="outline" size="sm" asChild>
            <a
              href="https://riseofcultures.wiki.gg/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink />
              <span className="hidden md:inline-block">Wiki</span>
            </a>
          </Button>
        </div>

        <div className="flex md:hidden">
          <WorkshopModal />
        </div>
      </div>
    </header>
  );
}
