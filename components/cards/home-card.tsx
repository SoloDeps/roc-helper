import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface CardData {
  title: string;
  description: string;
  illustration: string;
  href?: string;
  locked?: boolean;
  badge?: string;
  new?: boolean;
}

const cards: CardData[] = [
  {
    title: "Calculator",
    description: "Plan buildings and track the resources you'll need",
    illustration: "/images/technos/high_middle_ages/hm_13.webp",
    href: "/calculator",
  },
  {
    title: "Campaign",
    description: "Track your campaign progress and scout regions",
    illustration: "/images/technos/iberian_era/ie_31.webp",
    href: "/campaign",
  },
  {
    title: "Heritage Vault",
    description: "Plan what to spend and track your Vault progress",
    illustration: "/images/vault/icon_heritage.webp",
    href: "/vault",
    new: true,
  },
  {
    title: "Layout Builder",
    description: "Design every city and calculate production with all your bonuses",
    illustration: "/images/technos/minoan_era/me_6.webp",
    // illustration: "/images/technos/late_gothic_era/lg_22.webp",
    href: "/layout-builder",
    // new: true,
    locked: true,
    badge: "Coming Soon",
  },
  {
    title: "Technologies",
    description: "Explore technologies and plan your research path",
    illustration: "/images/technos/kingdom_of_sicily/ks_41.webp",
    href: "/technologies",
  },
  {
    title: "Wonders",
    description: "Track your wonders progress and plan your presets",
    illustration: "/images/technos/bronze_age/ba_8.webp",
    href: "/wonders",
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
      <div className="absolute bottom-3 right-3 z-20 h-auto w-[84px] pointer-events-none">
        <Image
          src={data.illustration}
          alt=""
          width={84}
          height={84}
          className="object-contain size-full select-none"
          draggable={false}
          fetchPriority="high"
          loading="eager"
          decoding="async"
        />
      </div>

      {/* Content — left side */}
      <div className="absolute inset-y-0 left-0 z-20 p-3.5 flex flex-col justify-center md:justify-start gap-1.5 max-w-[62%]">
        {/* Icon circle + title */}
        <div className="flex items-center gap-2 md:mt-2">
          <h2 className="text-[17px] md:text-lg font-bold leading-tight text-foreground truncate">
            {data.title}
          </h2>
          {data.badge && (
            <span className="inline-flex items-center rounded-sm border border-border px-2 py-0.5 text-xs font-medium text-muted-foreground whitespace-nowrap">
              {data.badge}
            </span>
          )}
          {data.new && !data.badge && (
            <span
              className="flex size-2 rounded-full bg-blue-500 dark:bg-blue-400"
              title="New"
            ></span>
          )}
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