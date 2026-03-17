"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ModeToggle } from "./mode-toggle";
import { WorkshopModal } from "../modals/workshop-modal";
import { MobileNav } from "./mobile-nav";
import { Button } from "@/components/ui/button";
import { ExternalLink, Info } from "lucide-react";
import { siteConfig } from "@/lib/config";
import { cn } from "@/lib/utils";

const leftNavLinks = [
  { href: "/calculator", label: "Calculator", external: false, icon: null },
  { href: "/campaign", label: "Campaign", external: false, icon: null },
  {
    href: "/research-tree",
    label: "Research Tree",
    external: false,
    icon: null,
  },
];

const rightNavLinks = [
  { href: "/help", label: "Help", external: false, icon: "info" },
  {
    href: "https://riseofcultures.wiki.gg/",
    label: "Wiki",
    external: true,
    icon: "external",
  },
];

function NavLink({
  href,
  label,
  external,
  active,
  icon,
}: {
  href: string;
  label: string;
  external: boolean;
  active: boolean;
  icon: string | null;
}) {
  const iconEl =
    icon === "info" ? (
      <Info className="size-4" />
    ) : icon === "external" ? (
      <ExternalLink className="size-4" />
    ) : null;

  const cls = cn(
    "text-sm font-medium transition-colors px-2",
    active
      ? "text-foreground hover:bg-transparent"
      : "text-[oklch(46%_0_0)] dark:text-[oklch(74%_0_0)] hover:bg-gray-200/70",
  );

  if (external) {
    return (
      <Button variant="ghost" size="sm" className={cls} asChild>
        <a href={href} target="_blank" rel="noopener noreferrer">
          {iconEl}
          {label}
        </a>
      </Button>
    );
  }

  return (
    <Button variant="ghost" size="sm" className={cls} asChild>
      <Link href={href}>
        {iconEl}
        {label}
      </Link>
    </Button>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header
      className={cn(
        "relative z-20 flex w-full shrink-0 items-center h-[50px] container-wrapper",
        isHome && "sticky top-0 bg-background-200",
      )}
    >
      {/* Logo */}
      <Link href="/" className="hidden md:flex items-center gap-2 shrink-0">
        <Image
          src="/images/logo.webp"
          width={24}
          height={24}
          alt="logo"
          className="shrink-0 object-cover"
        />
        <span className="hidden md:block text-sm font-semibold">
          RoC Helper
        </span>
      </Link>

      {/* Nav: left links + right links with justify-between */}
      <div className="hidden md:flex flex-1 items-center justify-between px-2.5">
        <div className="flex items-center gap-0.5">
          {leftNavLinks.map((link) => (
            <NavLink
              key={link.href}
              {...link}
              active={pathname === link.href}
            />
          ))}
        </div>
        <div className="flex items-center gap-0.5">
          {rightNavLinks.map((link) => (
            <NavLink
              key={link.href}
              {...link}
              active={pathname === link.href}
            />
          ))}
        </div>
      </div>

      {/* Mobile */}
      <div className="flex md:hidden justify-between flex-1 items-center gap-1.5 mr-1.5">
        <MobileNav items={siteConfig.navItems} />
        <WorkshopModal />
      </div>

      {/* ModeToggle */}
      <ModeToggle />
    </header>
  );
}
