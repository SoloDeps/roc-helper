import Link from "next/link";
import Image from "next/image";
import { ModeToggle } from "./mode-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Info } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="relative z-20 flex w-full shrink-0 items-center justify-between h-[50px] container-wrapper">
      <div className="flex items-center gap-2">
        <Link href="/" className="flex items-center gap-2 ">
          <Image
            src="/icon/24.png"
            width={24}
            height={24}
            alt="logo"
            className="shrink-0"
          />
          <span className="hidden md:block text-sm font-semibold">
            RoC Wiki Goods
          </span>
        </Link>
        <Badge className="h-6 rounded-sm beta-badge">Beta</Badge>

        <Button variant="outline" size="sm" asChild>
          <Link href="/user-data">
            <span>My Game Data</span>
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild>
          <Link href="/calculator">
            <span>Calculator</span>
          </Link>
        </Button>
      </div>
      <nav className="flex items-center gap-1.5">
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

        <ModeToggle />
      </nav>
    </header>
  );
}
