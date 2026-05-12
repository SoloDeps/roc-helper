import Image from "next/image";
import { HomeCards } from "@/components/cards/home-card";

export default function Home() {
  return (
    <div className="flex min-h-0 flex-1 container-wrapper">
      <div className="flex flex-col items-center w-full mt-2 md:mt-14">
        <div className="flex flex-col gap-4 size-full max-w-4xl">
          <div className="relative shrink-0 h-36 md:h-44 overflow-hidden rounded-xl border shadow-xs">
            <Image
              src="/images/banners/banner3.webp"
              alt=""
              width={900}
              height={200}
              className="object-cover size-full max-sm:object-[75%_center] select-none"
              draggable={false}
              fetchPriority="high"
              loading="eager"
              decoding="async"
            />
            <div className="absolute inset-0">
              <div className="flex flex-col items-start justify-center p-4 size-full bg-gradient-to-r from-white/40 via-white/10 to-transparent">
                <div className="flex flex-col items-start justify-center max-w-2/3 max-lg:-mx-5 p-4 size-full">
                  <div className="bg-black/45 backdrop-blur-sm rounded-lg px-3 py-2">
                    <h1 className="text-xl md:text-3xl font-bold text-white">
                      Welcome to RoC Helper
                    </h1>
                    <p className="text-md text-white font-semibold hidden md:block">
                      Tools to optimize your game progress
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <HomeCards />
        </div>
      </div>
    </div>
  );
}
