"use client";

import ButtonAddFloating from "@/components/buttons/button-add-floating";
import { ButtonGroupBuilding } from "@/components/buttons/button-group-building";
import { ItemList } from "@/components/items/item-list";
import { AddElementModal } from "@/components/modals/add-element/add-element-modal";
import { TotalDrawer } from "@/components/modals/total-drawer";
import { WorkshopModal } from "@/components/modals/workshop-modal";
import { TotalGoodsDisplay } from "@/components/total-goods/total-goods-display";

export default function HomePage() {
  return (
    <div className="flex min-h-0 flex-1 container-wrapper gap-4">
      <ButtonAddFloating />

      {/* LEFT PANEL - Resource Totals (Desktop only) */}
      <aside className="sticky top-0 hidden origin-left xl:block mb-2 material-medium 2xl:w-6/11 lg:w-5/11 overflow-hidden">
        <header className="flex shrink-0 flex-col w-full transition-colors border-b bg-roc-blue">
          <div className="flex shrink-0 w-full justify-between items-center gap-3 pl-4 pr-3 sm:pl-3 sm:pr-2 h-12 sm:mx-0">
            <h2 className="text-[15px] font-semibold text-white">
              Resource Totals
            </h2>
            <div className="flex gap-2">
              <WorkshopModal />
            </div>
          </div>
        </header>
        <TotalGoodsDisplay compareMode={false} />
      </aside>

      {/* RIGHT PANEL - Buildings List */}
      <div className="relative flex min-w-0 flex-1 flex-col 2xl:w-5/11 lg:w-6/11">
        <main className="md:mx-0 material-medium relative mb-0 md:mb-2 mt-0 flex-1 grow overflow-hidden">
          <div className="@container/page-layout relative flex size-full min-h-0 flex-col">
            {/* Header with actions */}
            <header className="flex shrink-0 flex-col w-full transition-colors border-b bg-roc-blue">
              <div className="flex shrink-0 w-full justify-between items-center gap-3 px-3 h-12 sm:mx-0">
                {/* Left side - Add button (Desktop) */}
                <div className="flex gap-2">
                  <div className="max-md:hidden">
                    <AddElementModal variant="outline" />
                  </div>

                  {/* Middle - Total Drawer (Mobile) */}
                  <div className="block xl:hidden">
                    <TotalDrawer />
                  </div>
                </div>

                {/* Right side - Filters & Building actions */}
                <div className="flex items-center gap-2">
                  <ButtonGroupBuilding />
                  {/* <FiltersDrawer /> */}
                </div>
              </div>
            </header>

            {/* Main content - Items list */}
            <div className="size-full overflow-y-auto no-scrollbar flex flex-col">
              <ItemList />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
