"use client";

import Image from "next/image";
import { ScrollArea } from "@/components/ui/scroll-area";
import useFancybox from "@/hooks/us-fancy-box";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function Help() {
  const [fancyboxRef] = useFancybox({
    zoomEffect: false,
    Carousel: {
      infinite: false,
      Thumbs: false,
      Toolbar: {
        display: {
          left: [],
          middle: [],
          right: ["close"],
        },
      },
      Zoomable: {
        Panzoom: {
          clickAction: false,
        },
      },
    },
  });

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
                src="/images/banners/banner3.webp"
                alt="ROC Helper Banner"
                className="w-full h-80 object-center object-cover -mt-16 select-none"
                draggable={false}
                width={1200}
                height={400}
              />
            </div>

            <div className="prose prose-sm dark:prose-invert prose-p:text-[15px] prose-p:mb-3 max-w-none px-2 md:px-6 pt-5 pb-20 size-full flex flex-col gap-y-6">
              {/* ========================= */}
              {/* BETA WARNING */}
              {/* ========================= */}
              <section
                id="beta"
                className="p-5 rounded-lg border border-orange-400 bg-background-300/80 shadow-sm"
              >
                <h2 className="mt-0 mb-3 text-xl font-bold">⚠️ Beta Status</h2>
                <p>
                  RoC Helper is still in <strong>beta</strong>. Some features
                  may not be fully complete. If you encounter bugs or issues,
                  please report them on Discord.
                </p>
              </section>

              {/* ========================= */}
              {/* MAIN FEATURES */}
              {/* ========================= */}
              <section id="main-features" className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="mt-0 mb-0 text-xl font-bold">Main Features</h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-alpha-400 to-transparent"></div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="p-4 rounded-lg border border-alpha-300 bg-background-300/50">
                    <h3 className="mt-0 mb-2 text-base font-semibold">
                      🧭 Research Tree
                    </h3>
                    <p>
                      View the full tech tree, track unlocked technologies, and
                      calculate total costs between nodes.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg border border-alpha-300 bg-background-300/50">
                    <h3 className="mt-0 mb-2 text-base font-semibold">
                      🏭 Personal Workshops
                    </h3>
                    <p>
                      Add your own workshops to simulate production and track
                      goods output based on your configuration.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg border border-alpha-300 bg-background-300/50 sm:col-span-2">
                    <h3 className="mt-0 mb-2 text-base font-semibold">
                      🧮 Calculator
                    </h3>
                    <p>
                      Add, modify, or remove buildings and instantly see total
                      resource impact.
                    </p>
                  </div>
                </div>
              </section>

              {/* ========================= */}
              {/* PRIVACY & LEGAL */}
              {/* ========================= */}

              <section className="space-y-2">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="mt-0 mb-0 text-xl font-bold" id="privacy">
                    Privacy & Legal
                  </h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-alpha-400 to-transparent"></div>
                </div>

                <div className="space-y-3 p-5 rounded-lg border border-alpha-300 bg-background-300/50">
                  <p>
                    RoC Helper does <strong>not</strong> collect any personal
                    data. All your data stays locally in your browser and is
                    never sent to a server.
                  </p>
                  <p className="mt-2">
                    All game images, icons, and content displayed in this app
                    belong to the creators of <strong>Rise of Cultures</strong>.
                    This tool is unofficial and made for personal use,
                    educational purposes, and community support only.
                  </p>
                  <p className="mt-2">
                    By using RoC Helper, you acknowledge that the app is a
                    fan-made project and does not claim ownership of the game
                    content.
                  </p>
                </div>
              </section>

              {/* ========================= */}
              {/* FAQ */}
              {/* ========================= */}
              <section className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="mt-0 mb-0 text-xl font-bold">FAQ</h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-alpha-400 to-transparent"></div>
                </div>

                <div className="space-y-3">
                  <Accordion
                    type="multiple"
                    className="space-y-3 text-base p-4 rounded-lg border border-alpha-300 bg-background-300/50"
                  >
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="text-base font-semibold">
                        Can I lose my data?
                      </AccordionTrigger>
                      <AccordionContent className="text-base">
                        Your data is safe and will stay in the app. It can only
                        be lost if you manually clear your browser data.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-2">
                      <AccordionTrigger className="text-base font-semibold">
                        Does the app read my game data?
                      </AccordionTrigger>
                      <AccordionContent className="text-base">
                        No. RoC Helper works completely offline and never
                        accesses your game account.
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="item-3" className="border-none">
                      <AccordionTrigger className="text-base font-semibold">
                        What should I do if I find a bug?
                      </AccordionTrigger>
                      <AccordionContent className="text-base">
                        If you find a bug, report it on our Discord with details
                        and screenshots. This helps us improve the app.
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </section>

              {/* ============.workshop system ============= */}
              <section id="workshops-system" className="space-y-4">
                <div className="flex items-center gap-3 mt-5 mb-2">
                  <h2 className="mt-0 mb-0 text-2xl font-bold">
                    Workshops System
                  </h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-alpha-400 to-transparent"></div>
                </div>

                <p>
                  Each player is assigned a random combination of goods at the
                  start of the game. This combination determines which workshops
                  are considered <strong>Primary</strong>,{" "}
                  <strong>Secondary</strong>, and <strong>Tertiary</strong>.
                </p>

                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    <strong>3 Primary workshops</strong> (number depends on the
                    era)
                  </li>
                  <li>
                    <strong>1 Secondary workshop</strong>
                  </li>
                  <li>
                    <strong>1 Tertiary workshop</strong>
                  </li>
                </ul>

                <p>
                  Understanding this system is important for planning your
                  production and for interpreting data in the wiki. Because each
                  player has different primary goods, trading with others
                  becomes essential and encourages alliance cooperation.
                </p>

                <h3 className="text-lg font-semibold mt-6">
                  How to identify your Primary workshop
                </h3>

                <ul className="list-disc pl-6 space-y-1">
                  <li>
                    Open the <strong>Research Tree</strong>
                  </li>
                  <li>
                    Look at the order in which goods technologies appear in your
                    current era
                  </li>
                </ul>

                <p>
                  The <strong>first goods technology</strong> in your era
                  determines your Primary workshop.
                </p>

                {/* Bronze Age */}
                <h3 className="text-base font-semibold mt-6">
                  Example (Bronze Age)
                </h3>

                <div
                  className="flex flex-col md:flex-row gap-2"
                  ref={fancyboxRef}
                >
                  <a data-fancybox="gallery" href="/images/tutorial/pri.webp">
                    <Image
                      src="/images/tutorial/pri.webp"
                      alt="Primary workshop example"
                      className="object-cover size-full rounded-lg"
                      width={400}
                      height={400}
                    />
                  </a>

                  <a
                    data-fancybox="gallery"
                    href="/images/tutorial/sec_ter.webp"
                  >
                    <Image
                      src="/images/tutorial/sec_ter.webp"
                      alt="sec ter workshop"
                      className="object-cover size-full rounded-lg"
                      width={400}
                      height={400}
                    />
                  </a>
                </div>

                <p className="mb-2 underline">Bronze Age goods:</p>

                <ul className="space-y-2 ps-3">
                  <li className="flex items-center gap-2">
                    <Image
                      src="/goods/wool.webp"
                      alt="Wool"
                      width={20}
                      height={20}
                    />
                    <span>
                      <strong>Wool</strong> → Tailor (Primary)
                    </span>
                  </li>

                  <li className="flex items-center gap-2">
                    <Image
                      src="/goods/bronze_bracelet.webp"
                      alt="Bronze Bracelet"
                      width={20}
                      height={20}
                    />
                    <span>
                      <strong>Bronze Bracelet</strong> → Artisan (Secondary)
                    </span>
                  </li>

                  <li className="flex items-center gap-2">
                    <Image
                      src="/goods/alabaster_idol.webp"
                      alt="Alabaster Idol"
                      width={20}
                      height={20}
                    />
                    <span>
                      <strong>Alabaster Idol</strong> → Stone Mason (Tertiary)
                    </span>
                  </li>
                </ul>

                <p className="mt-4">
                  The Primary workshop may have multiple buildings. Secondary
                  and Tertiary workshops are limited to one building each.
                </p>

                <p className="mt-3">
                  When reaching the <b>Byzantine Era</b> and{" "}
                  <b>Early Gothic Era</b>, you unlock three new workshops
                  corresponding to these goods.
                </p>

                {/* Byzantine Era */}
                <h3 className="text-base font-semibold mt-5">Others Eras</h3>

                <p className="mb-2 underline">Byzantine Era goods:</p>

                <ul className="space-y-2 ps-3">
                  <li className="flex items-center gap-2">
                    <Image
                      src="/goods/parchment.webp"
                      alt="Parchment"
                      width={20}
                      height={20}
                    />
                    <span>
                      <strong>Parchment</strong> → Scribe
                    </span>
                  </li>

                  <li className="flex items-center gap-2">
                    <Image
                      src="/goods/planks.webp"
                      alt="Planks"
                      width={20}
                      height={20}
                    />
                    <span>
                      <strong>Planks</strong> → Carpenter
                    </span>
                  </li>

                  <li className="flex items-center gap-2">
                    <Image
                      src="/goods/chili.webp"
                      alt="Chili"
                      width={20}
                      height={20}
                    />
                    <span>
                      <strong>Chili</strong> → Spice Merchant
                    </span>
                  </li>
                </ul>

                <p className="mb-2 mt-4 underline">Early Gothic Era goods:</p>

                <ul className="space-y-2 ps-3">
                  <li className="flex items-center gap-2">
                    <Image
                      src="/goods/lead_glass.webp"
                      alt="Lead Glass"
                      width={20}
                      height={20}
                    />
                    <span>
                      <strong>Lead Glass</strong> → Glassblower
                    </span>
                  </li>

                  <li className="flex items-center gap-2">
                    <Image
                      src="/goods/ointment.webp"
                      alt="Ointment"
                      width={20}
                      height={20}
                    />
                    <span>
                      <strong>Ointment</strong> → Alchemist
                    </span>
                  </li>

                  <li className="flex items-center gap-2">
                    <Image
                      src="/goods/fine_jewelry.webp"
                      alt="Fine Jewelry"
                      width={20}
                      height={20}
                    />
                    <span>
                      <strong>Fine Jewelry</strong> → Jeweler
                    </span>
                  </li>
                </ul>
              </section>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
