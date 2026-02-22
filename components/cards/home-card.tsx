import Image from "next/image";
import Link from "next/link";
import { cn, withBase } from "@/lib/utils";

interface CardData {
  title: string;
  description: string;
  icon: string;
  illustration: string;
  href?: string;
  locked?: boolean;
  badge?: string;
}

const cards: CardData[] = [
  {
    title: "Calculator",
    description: "Plan buildings and track the resources you'll need",
    icon: "/game_icons/icon_flat_research_points.webp",
    illustration: "/images/technos/high_middle_ages/hm_13.webp",
    href: "/calculator",
  },
  {
    title: "Research Tree",
    description: "Explore technologies and plan your research path",
    icon: "/game_icons/icon_flat_research_points.webp",
    illustration: "/images/technos/kingdom_of_sicily/ks_41.webp",
    href: "/research-tree",
  },
  {
    title: "Help",
    description: "Learn how to use RoC Helper and explore its features",
    icon: "/game_icons/icon_flat_research_points.webp",
    illustration: "/images/technos/high_middle_ages/hm_16.webp",
    href: "/help",
  },
  {
    title: "Coming Soon",
    description: "Something is taking shape in the shadows...",
    icon: "/game_icons/icon_flat_scout.webp",
    illustration: "/images/technos/minoan_era/me_6.webp",
    locked: true,
    badge: "Coming Soon",
  },
];

function HomeCard({ data }: { data: CardData }) {
  const card = (
    <div
      className={cn(
        "relative w-full h-28 md:h-36 rounded-lg overflow-hidden select-none",
        "bg-card border border-border",
        "shadow-sm",
        !data.locked &&
          "cursor-pointer hover:shadow-md hover:border-border/80 transition-all duration-200",
        data.locked && "cursor-default opacity-60",
      )}
    >
      {/* Soft radial fade on right to blend illustration into bg */}
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-card/80 to-transparent z-10 pointer-events-none" />

      {/* Illustration — right side, overflows bottom */}
      <div className="absolute bottom-0 right-2 z-20 size-24 pointer-events-none">
        <Image
          src={withBase(data.illustration)}
          alt=""
          fill
          className="object-cover select-none"
          draggable={false}
        />
      </div>

      {/* Content — left side */}
      <div className="absolute inset-y-0 left-0 z-20 p-3.5 flex flex-col justify-center md:justify-start gap-1.5 max-w-[62%]">
        {/* Icon circle + title */}
        <div className="flex items-center gap-2 md:mt-2">
          <h3 className="text-[17px] md:text-lg font-bold leading-tight text-foreground truncate">
            {data.title}
          </h3>
        </div>

        {/* Description */}
        <p className="text-[15px] leading-snug text-muted-foreground font-medium pl-0.5 line-clamp-2">
          {data.description}
        </p>
      </div>
    </div>
  );

  if (!data.locked && data.href) {
    return <Link href={data.href}>{card}</Link>;
  }

  return card;
}

export function HomeCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 w-full pb-5">
      {cards.map((card) => (
        <HomeCard key={card.title} data={card} />
      ))}
    </div>
  );
}
