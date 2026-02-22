import Image from "next/image";
import { HomeCards } from "@/components/cards/home-card";

export default function Home() {
  return (
    <div className="flex min-h-0 flex-1 container-wrapper">
      <div className="flex flex-col items-center w-full mt-2 md:mt-14">
        <div className="flex flex-col gap-4 size-full max-w-4xl">
          <div className="relative shrink-0 h-36 md:h-44 overflow-hidden rounded-xl border shadow-xs">
            <Image
              src="/images/banners/banner1.png"
              alt=""
              width={1200}
              height={400}
              className="object-cover size-full select-none"
              draggable={false}
            />
            <div className="absolute inset-0">
              <div className="flex flex-col items-start justify-center p-4 size-full bg-gradient-to-r from-white/40 via-white/10 to-transparent">
                <h1 className="text-xl md:text-3xl font-bold text-black max-w-1/2">Welcome to RoC Helper</h1>
                <p className="text-md text-black font-semibold max-w-1/2 hidden md:block">Tools to optimize your game progress</p>
              </div>
            </div>
          </div>
          <HomeCards />
        </div>
      </div>
    </div>
  );
}
