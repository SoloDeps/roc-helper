"use client";

import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Help() {
  return (
    <div className="flex min-h-0 flex-1 container-wrapper gap-4">
      <div className="material-medium relative mb-0 md:mb-2 mt-0 flex-1 grow overflow-hidden xl:max-w-4xl">
        <header className="flex shrink-0 flex-col w-full transition-colors bg-roc-blue dark:border-b">
          <div className="flex shrink-0 w-full justify-between items-center gap-3 pl-4 pr-3 sm:pl-3 sm:pr-2 h-12 sm:mx-0">
            <h2 className="text-[15px] font-bold text-white">
              Help - RoC Helper (Beta)
            </h2>
          </div>
        </header>

        <div className="size-full bg-background-200">
          <ScrollArea className="h-full">
            <div className="h-64 overflow-hidden">
              <Image
                src="/svg/scout_banner_late_gothic_era.png"
                alt="ROC Helper Banner"
                className="w-full h-80 object-center object-cover -mt-16 select-none"
                draggable={false}
                width={1200}
                height={400}
              />
            </div>

            <div className="prose prose-sm dark:prose-invert prose-p:text-[15px] prose-p:mb-3 max-w-none px-6 pt-5 pb-20 size-full flex flex-col gap-y-4">
              {/* Page Not Finished */}
              <section className="p-5 rounded-lg border border-orange-400 bg-background-300/80 shadow-sm">
                <h2 className="mt-0 mb-3 text-xl font-bold">
                  ⚠️ Page Not Finished
                </h2>
                <p className="leading-relaxed">
                  RoC Helper is still in <strong>beta</strong>. Some features
                  may not be fully complete. If you encounter bugs or issues,
                  please report them on RoC Discord.
                </p>
              </section>

              {/* Main Features */}
              <section className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="mt-0 mb-0 text-xl font-bold">Main Features</h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-alpha-400 to-transparent"></div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="p-4 rounded-lg border border-alpha-300 bg-background-300/50">
                    <h3 className="mt-0 mb-2 text-base font-semibold">
                      🧭 Research Tree
                    </h3>
                    <p className="mb-0 text-sm leading-relaxed">
                      View the full tech tree. Check technologies you own, see
                      the costs between two techs or from the start, and track
                      spent/remaining resources.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg border border-alpha-300 bg-background-300/50">
                    <h3 className="mt-0 mb-2 text-base font-semibold">
                      🏭 Personal Workshops
                    </h3>
                    <p className="mb-0 text-sm leading-relaxed">
                      Add your own workshops to see goods production, just like
                      in your personal game. Customize and track your resources
                      easily.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg border border-alpha-300 bg-background-300/50 sm:col-span-2">
                    <h3 className="mt-0 mb-2 text-base font-semibold">
                      🧮 Calculator
                    </h3>
                    <p className="mb-0 text-sm leading-relaxed">
                      Add, modify, or remove buildings and see the total of your
                      resources instantly. Perfect for testing different
                      configurations.
                    </p>
                  </div>
                </div>
              </section>

              {/* Local Save & Privacy */}
              <section className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="mt-0 mb-0 text-xl font-bold">
                    Local Save & Privacy
                  </h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-alpha-400 to-transparent"></div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="p-4 rounded-lg border border-alpha-300 bg-background-300/50">
                    <h3 className="mt-0 mb-2 text-base font-semibold">
                      💾 Local Save
                    </h3>
                    <p className="mb-0 text-sm leading-relaxed">
                      All your data is stored locally via IndexedDB. No servers
                      or accounts are needed.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg border border-alpha-300 bg-background-300/50">
                    <h3 className="mt-0 mb-2 text-base font-semibold">
                      🛡️ Image Privacy
                    </h3>
                    <p className="mb-0 text-sm leading-relaxed">
                      No game images are collected or sent anywhere. All images
                      are used locally in the interface to ensure compliance.
                    </p>
                  </div>
                </div>
              </section>

              {/* FAQ */}
              <section className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="mt-0 mb-0 text-xl font-bold">FAQ</h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-alpha-400 to-transparent"></div>
                </div>

                <div className="space-y-3">
                  <details className="p-4 rounded-lg border border-alpha-300 bg-background-300/50 group">
                    <summary className="font-semibold cursor-pointer text-sm flex items-center gap-2">
                      <span className="text-base">▶</span>Can I lose my data?
                    </summary>
                    <p className="mt-3 mb-0 pl-6 text-sm leading-relaxed">
                      No. All data is stored locally in IndexedDB. As long as
                      you don&apos;t clear your browser cache or data, your
                      information remains saved.
                    </p>
                  </details>

                  <details className="p-4 rounded-lg border border-alpha-300 bg-background-300/50">
                    <summary className="font-semibold cursor-pointer text-sm flex items-center gap-2">
                      <span className="text-base">▶</span>Does the app read my
                      game data?
                    </summary>
                    <p className="mt-3 mb-0 pl-6 text-sm leading-relaxed">
                      No. RoC Helper does not communicate with the game. All
                      data is created and manipulated locally.
                    </p>
                  </details>

                  <details className="p-4 rounded-lg border border-alpha-300 bg-background-300/50">
                    <summary className="font-semibold cursor-pointer text-sm flex items-center gap-2">
                      <span className="text-base">▶</span>What should I do if I
                      find a bug?
                    </summary>
                    <p className="mt-3 mb-0 pl-6 text-sm leading-relaxed">
                      Since the app is in beta, please report it on Discord. Any
                      feedback helps improve RoC Helper for everyone.
                    </p>
                  </details>
                </div>
              </section>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
