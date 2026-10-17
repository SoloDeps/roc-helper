"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { WorkshopModal } from "../modals/workshop-modal";
import { MobileNav } from "./mobile-nav";
import { Button } from "@/components/ui/button";
import { ExternalLink, Heart, Info } from "lucide-react";
import { SUPPORT_URL, siteConfig } from "@/lib/config";
import { ProfileMenu } from "./profile-menu";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const leftNavLinks = [
  { href: "/calculator", label: "Calculator", external: false, icon: null },
  { href: "/campaign", label: "Campaign", external: false, icon: null },
  {
    href: "/technologies",
    label: "Technologies",
    external: false,
    icon: null,
  },
  { href: "/vault", label: "Vault", external: false, icon: null },
  { href: "/wonders", label: "Wonders", external: false, icon: null },
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

function SupportButton() {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="support-btn text-rose-600 hover:bg-rose-500/10 hover:text-rose-600 dark:text-rose-400 dark:hover:bg-rose-500/10 dark:hover:text-rose-400"
      asChild
    >
      <a href={SUPPORT_URL} target="_blank" rel="noopener noreferrer">
        <span className="relative inline-flex">
          <Heart className="support-heart size-4" />
          {/* Petits cœurs qui s'envolent au survol */}
          <Heart aria-hidden className="support-float support-float-1" />
          <Heart aria-hidden className="support-float support-float-2" />
          <Heart aria-hidden className="support-float support-float-3" />
        </span>
        Support
      </a>
    </Button>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const isWonders = pathname === "/wonders";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!isWonders) return;

    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      setScrolled(false); // reset au cleanup, pas dans le body
    };
  }, [isWonders]);

  return (
    <header
      className={cn(
        "relative z-50 flex w-full shrink-0 items-center h-[50px] container-wrapper",
        "sticky top-0 bg-background-200",
        "transition-[box-shadow,border-color] duration-200",
        isWonders && scrolled && "border-b shadow-sm",
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
      <div className="hidden md:flex flex-1 items-center justify-between pl-2.5">
        <div className="flex items-center gap-0.5">
          {leftNavLinks.map((link) => (
            <NavLink
              key={link.href}
              {...link}
              active={pathname === link.href || pathname.startsWith(`${link.href}/`)}
            />
          ))}
        </div>
        <div className="flex items-center gap-1.5">
          <SupportButton />
          <ProfileMenu />
        </div>
      </div>

      {/* Mobile : Support vit dans le menu (voir MobileNav) */}
      <div className="flex md:hidden flex-1 items-center gap-1.5">
        <MobileNav items={siteConfig.navItems} supportHref={SUPPORT_URL} />
        {/* Workshops + profil collés à droite */}
        <div className="ml-auto flex items-center gap-1.5">
          <WorkshopModal />
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}
