"use client";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Trash2 } from "lucide-react";
import Image from "next/image";

export default function Help() {
  return (
    <div className="flex min-h-0 flex-1 container-wrapper gap-4">
      <div className="sticky top-0 origin-left mb-2 md:material-medium w-full xl:max-w-4xl overflow-hidden mx-auto">
        <header className="flex shrink-0 flex-col w-full transition-colors bg-roc-blue">
          <div className="flex shrink-0 w-full justify-between items-center gap-3 pl-4 pr-3 sm:pl-3 sm:pr-2 h-12 sm:mx-0">
            <h2 className="text-[15px] font-bold text-white">Help Page</h2>
            <div className="flex gap-1.5">
              <Button
                variant="outline"
                size="sm"
                className="w-[120px]"
                onClick={() => {}}
                disabled={false}
              >
                <Trash2 /> Delete Data
              </Button>
            </div>
          </div>
        </header>
        <div className="size-full bg-background-200">
          <ScrollArea className="h-full">
            <div className="h-64 overflow-hidden">
              <Image
                src="/svg/scout_banner_late_gothic_era.png"
                alt=""
                className="w-full h-80 object-center object-cover -mt-16 select-none"
                draggable={false}
                width={1200}
                height={400}
              />
            </div>

            <div className="prose prose-sm dark:prose-invert prose-p:text-[15px] prose-p:mb-3 max-w-none px-6 pt-5 pb-20 size-full flex flex-col gap-y-4">
              {/* Introduction */}
              <section className="p-5 rounded-lg border border-alpha-400 bg-background-300 shadow-sm">
                <h2 className="mt-0 mb-3 text-xl font-bold">
                  About This Extension
                </h2>
                <p className="leading-relaxed">
                  This browser extension is an interactive companion for{" "}
                  <strong>the Rise of Cultures Wiki</strong>. Its main purpose
                  is to transform static wiki tables into dynamic, real-time
                  calculation tools directly within your browser.
                </p>
                <p className="leading-relaxed mb-0">
                  By default, the extension operates entirely using data from
                  the RoC Wiki and does not require any connection to the game.
                  Player data extraction is completely optional and used
                  exclusively for comparison purposes.
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
                      📊 Goods Overview
                    </h3>
                    <p className="mb-0 text-sm leading-relaxed">
                      Display a comprehensive overview of all goods based on
                      your selected era. Totals update instantly when you modify
                      values or multipliers.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg border border-alpha-300 bg-background-300/50">
                    <h3 className="mt-0 mb-2 text-base font-semibold">
                      🏗️ Building Management
                    </h3>
                    <p className="mb-0 text-sm leading-relaxed">
                      Add or remove buildings using data from the RoC Wiki.
                      Adjust calculations without navigating between multiple
                      wiki pages.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg border border-alpha-300 bg-background-300/50">
                    <h3 className="mt-0 mb-2 text-base font-semibold">
                      ⚙️ Era-Based Presets
                    </h3>
                    <p className="mb-0 text-sm leading-relaxed">
                      Presets for each era automatically adjust available goods,
                      production values, and limits to keep your calculations
                      accurate and consistent.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg border border-alpha-300 bg-background-300/50">
                    <h3 className="mt-0 mb-2 text-base font-semibold">
                      🕌 Ottoman Buildings
                    </h3>
                    <p className="mb-0 text-sm leading-relaxed">
                      Ottoman buildings are optional and not included by
                      default. Add them manually via the{" "}
                      <strong>Add Item</strong> menu when needed.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg border border-alpha-300 bg-background-300/50 sm:col-span-2">
                    <h3 className="mt-0 mb-2 text-base font-semibold">
                      📅 Event Quests by Era
                    </h3>
                    <p className="mb-0 text-sm leading-relaxed">
                      Event quests are filtered based on your selected era,
                      ensuring only relevant requirements and values are
                      displayed.
                    </p>
                  </div>
                </div>
              </section>

              {/* Wiki-Based Calculations */}
              <section className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="mt-0 mb-0 text-xl font-bold">
                    Wiki-Based Calculations
                  </h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-alpha-400 to-transparent"></div>
                </div>

                <div className="space-y-3">
                  <div className="p-4 rounded-lg border border-alpha-300 bg-background-300/50">
                    <h3 className="mt-0 mb-2 text-base font-semibold">
                      Interactive Wiki Tables
                    </h3>
                    <p className="mb-0 text-sm leading-relaxed">
                      Static tables from the RoC Wiki are transformed into
                      interactive calculation rows. Edit values directly instead
                      of working with read-only text.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg border border-alpha-300 bg-background-300/50">
                    <h3 className="mt-0 mb-2 text-base font-semibold">
                      Live Multipliers & Totals
                    </h3>
                    <p className="mb-0 text-sm leading-relaxed">
                      Adjust multipliers at any time and watch all totals update
                      immediately. Perfect for planning and testing different
                      scenarios.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg border border-alpha-300 bg-background-300/50">
                    <h3 className="mt-0 mb-2 text-base font-semibold">
                      Centralized Overview
                    </h3>
                    <p className="mb-0 text-sm leading-relaxed">
                      All saved calculation rows are consolidated on a single
                      page within the extension, eliminating the need to browse
                      multiple wiki pages.
                    </p>
                  </div>
                </div>
              </section>

              {/* Optional Player Data */}
              <section className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="mt-0 mb-0 text-xl font-bold">
                    Optional Player Data
                  </h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-alpha-400 to-transparent"></div>
                </div>

                <div className="p-4 rounded-lg border-l-4 border-l-blue-500 bg-background-300/80">
                  <p className="mb-3 text-sm leading-relaxed">
                    <strong>
                      Player data extraction is completely optional.
                    </strong>{" "}
                    The extension works fully using only data from the RoC Wiki.
                    Extracting player data provides additional comparison
                    capabilities but is not required for core functionality.
                  </p>

                  <ul className="space-y-2 mb-0">
                    <li className="text-sm leading-relaxed">
                      <strong>Manual Extraction:</strong> Extract your game data
                      through the extension popup when desired
                    </li>
                    <li className="text-sm leading-relaxed">
                      <strong>Comparison Only:</strong> Extracted data is used
                      solely to compare with wiki values; wiki-based
                      calculations remain the primary reference
                    </li>
                    <li className="text-sm leading-relaxed">
                      <strong>No Automatic Updates:</strong> Player data must be
                      manually re-extracted if in-game values change
                    </li>
                  </ul>
                </div>
              </section>

              {/* Data Storage */}
              <section className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="mt-0 mb-0 text-xl font-bold">
                    Data Storage & Privacy
                  </h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-alpha-400 to-transparent"></div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="p-4 rounded-lg border border-alpha-300 bg-background-300/50">
                    <h3 className="mt-0 mb-2 text-base font-semibold">
                      💾 Automatic Saving
                    </h3>
                    <p className="mb-0 text-sm leading-relaxed">
                      All calculations and settings are automatically saved. No
                      manual save action required.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg border border-alpha-300 bg-background-300/50">
                    <h3 className="mt-0 mb-2 text-base font-semibold">
                      🔒 Local Storage Only
                    </h3>
                    <p className="mb-0 text-sm leading-relaxed">
                      All data is stored locally in your browser. Nothing is
                      uploaded or shared externally.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg border border-alpha-300 bg-background-300/50">
                    <h3 className="mt-0 mb-2 text-base font-semibold">
                      🛡️ Privacy First
                    </h3>
                    <p className="mb-0 text-sm leading-relaxed">
                      No personal, account, or payment information is ever
                      accessed or stored.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg border border-alpha-300 bg-background-300/50">
                    <h3 className="mt-0 mb-2 text-base font-semibold">
                      📖 Client-Side Only
                    </h3>
                    <p className="mb-0 text-sm leading-relaxed">
                      The extension operates entirely on your device. No server
                      communication.
                    </p>
                  </div>
                </div>
              </section>

              {/* How It Works */}
              <section className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="mt-0 mb-0 text-xl font-bold">How It Works</h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-alpha-400 to-transparent"></div>
                </div>

                <div className="space-y-3">
                  <div className="p-4 rounded-lg border border-alpha-300 bg-background-300/50">
                    <h3 className="mt-0 mb-2 text-base font-semibold">
                      Wiki Data Integration
                    </h3>
                    <p className="mb-0 text-sm leading-relaxed">
                      The extension reads and processes data directly from the
                      RoC Wiki, transforming static tables into interactive
                      calculation tools.
                    </p>
                  </div>

                  <div className="p-4 rounded-lg border border-alpha-300 bg-background-300/50">
                    <h3 className="mt-0 mb-2 text-base font-semibold">
                      Passive Data Reading
                    </h3>
                    <p className="mb-0 text-sm leading-relaxed">
                      When player data extraction is enabled, the extension
                      reads data passively from the game environment without
                      modifying game behavior or communication.
                    </p>
                  </div>
                </div>
              </section>

              {/* FAQ */}
              <section className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="mt-0 mb-0 text-xl font-bold">
                    Frequently Asked Questions
                  </h2>
                  <div className="flex-1 h-px bg-gradient-to-r from-alpha-400 to-transparent"></div>
                </div>

                <div className="space-y-3">
                  <details className="p-4 rounded-lg border border-alpha-300 bg-background-300/50 group">
                    <summary className="font-semibold cursor-pointer text-sm list-none flex items-center gap-2">
                      <span className="text-base">▶</span>
                      <span>
                        Do I need to extract game data to use this extension?
                      </span>
                    </summary>
                    <p className="mt-3 mb-0 pl-6 text-sm leading-relaxed">
                      No. All main features work perfectly using only data from
                      the RoC Wiki. Player data extraction is entirely optional.
                    </p>
                  </details>

                  <details className="p-4 rounded-lg border border-alpha-300 bg-background-300/50">
                    <summary className="font-semibold cursor-pointer text-sm list-none flex items-center gap-2">
                      <span className="text-base">▶</span>
                      <span>Does this extension modify the game?</span>
                    </summary>
                    <p className="mt-3 mb-0 pl-6 text-sm leading-relaxed">
                      No. The extension does not modify game files, gameplay
                      mechanics, or server communication. It only reads publicly
                      available data from the RoC Wiki and optionally from your
                      game session.
                    </p>
                  </details>

                  <details className="p-4 rounded-lg border border-alpha-300 bg-background-300/50">
                    <summary className="font-semibold cursor-pointer text-sm list-none flex items-center gap-2">
                      <span className="text-base">▶</span>
                      <span>Why are some values missing or outdated?</span>
                    </summary>
                    <p className="mt-3 mb-0 pl-6 text-sm leading-relaxed">
                      This usually means the required data hasn't been loaded
                      from the RoC Wiki yet, or if using player data comparison,
                      that your game data needs to be re-extracted after recent
                      changes.
                    </p>
                  </details>

                  <details className="p-4 rounded-lg border border-alpha-300 bg-background-300/50">
                    <summary className="font-semibold cursor-pointer text-sm list-none flex items-center gap-2">
                      <span className="text-base">▶</span>
                      <span>How do I install this extension?</span>
                    </summary>
                    <div className="mt-3 mb-0 pl-6 space-y-2">
                      <p className="text-sm leading-relaxed mb-2">
                        <strong>From Extension Store:</strong> Install from your
                        browser's official extension store. Once installed, it's
                        immediately ready to use with RoC Wiki data.
                      </p>
                      <p className="text-sm leading-relaxed mb-0">
                        <strong>Manual Installation:</strong> Download the
                        source files, enable developer mode in your browser, and
                        load the extension folder manually.
                      </p>
                    </div>
                  </details>

                  <details className="p-4 rounded-lg border border-alpha-300 bg-background-300/50">
                    <summary className="font-semibold cursor-pointer text-sm list-none flex items-center gap-2">
                      <span className="text-base">▶</span>
                      <span>Is my data safe and private?</span>
                    </summary>
                    <p className="mt-3 mb-0 pl-6 text-sm leading-relaxed">
                      Yes. All data is stored locally in your browser and never
                      transmitted to external servers. The extension operates
                      entirely client-side and doesn't access any personal,
                      account, or payment information.
                    </p>
                  </details>
                </div>
              </section>

              {/* Support */}
              <section className="p-5 rounded-lg border border-alpha-400 bg-background-300 shadow-sm">
                <h2 className="mt-0 mb-3 text-xl font-bold">
                  Support & Feedback
                </h2>
                <p className="leading-relaxed mb-0">
                  Encountered an issue or have a suggestion? Your feedback helps
                  improve this extension for everyone. Feel free to share your
                  thoughts and experiences.
                </p>
              </section>
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
