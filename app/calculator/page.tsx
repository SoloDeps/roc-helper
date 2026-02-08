'use client'

import { ButtonGroupBuilding } from "@/components/buttons/button-group-building"
import { ButtonGroupTotal } from "@/components/buttons/button-group-total"
import { AddModal } from "@/components/modals/add-modal"
import { BuildingWizard } from "@/components/modals/building-wizard/building-wizard"

// import { useState, useDeferredValue, useRef } from 'react'
// import { WorkshopModal } from '@/components/modals/workshop-modal'
// import { PresetListModal } from '@/components/modals/preset-list-modal'
// import { CompareButton } from '@/components/buttons/compare-button'
// // import { BuildingList, type BuildingListRef } from '@/components/items/building-list'
// import { TotalGoodsDisplay } from '@/components/total-goods/total-goods-display'
// import { ButtonFilter } from '@/components/buttons/button-filter'
// import { ButtonGroupBuilding } from '@/components/buttons/button-group-building'
// import { ButtonGroupTotal } from '@/components/buttons/button-group-total'
// import { useBuildingFilters } from '@/hooks/use-building-filters'
// import { getBuildings, removeBuilding } from '@/lib/db/repositories/buildings'
// import { removeAllTechnos } from '@/lib/db/repositories/technos'

export default function HomePage() {
  // const { filters, updateFilters, activeCount } = useBuildingFilters()
  // const [compareMode, setCompareMode] = useState(false)
  // const deferredFilters = useDeferredValue(filters)
  // const buildingListRef = useRef<BuildingListRef>(null)

  // // ✅ Pas besoin de useCallback avec React Compiler
  // const handleFiltersChange = (newFilters: typeof filters) => {
  //   updateFilters(newFilters)
  // }

  // const filterComponents = ButtonFilter({
  //   onFiltersChange: handleFiltersChange,
  // })

  // const handleToggleFilters = () => filterComponents.button.props.onClick()

  // const handleExpandAll = () => buildingListRef.current?.expandAll()

  // const handleCollapseAll = () => buildingListRef.current?.collapseAll?.()

  // const handleDeleteAll = async () => {
  //   try {
  //     const data = await getBuildings()
  //     await Promise.all(data.map(b => removeBuilding(b.id)))
  //     // await removeAllTechnos()
  //   } catch (error) {
  //     console.error('Error deleting all:', error)
  //     alert('An error occurred. Please try again.')
  //   }
  // }

  return (
    <div className="flex min-h-0 flex-1 container-wrapper gap-4">
      <aside className="sticky top-0 hidden origin-left xl:block mb-2 material-medium 2xl:w-6/11 lg:w-5/11 overflow-hidden">
        <header className="flex shrink-0 flex-col w-full transition-colors border-b bg-roc-blue">
          <div className="flex shrink-0 w-full justify-between items-center gap-3 pl-4 pr-3 sm:pl-3 sm:pr-2 h-12 sm:mx-0">
            <h2 className="text-[15px] font-semibold text-white">
              Resource Totals
            </h2>
            <div className="flex gap-2">
              {/* <CompareButton enabled={compareMode} onToggle={setCompareMode} />
              <WorkshopModal />
              <PresetListModal /> */}
            </div>
          </div>
        </header>
        {/* <TotalGoodsDisplay compareMode={compareMode} /> */}
      </aside>

      <div className="relative flex min-w-0 flex-1 flex-col 2xl:w-5/11 lg:w-6/11">
        <main className="material-medium relative mb-2 mt-0 flex-1 grow overflow-hidden">
          <div className="@container/page-layout relative flex size-full min-h-0 flex-col">
            <header className="flex shrink-0 flex-col w-full transition-colors border-b bg-roc-blue">
              <div className="flex shrink-0 w-full justify-between items-center gap-3 px-3 h-12 sm:mx-0">
                {/* <div className="max-xl:hidden">
                </div> */}
                {/* <AddModal variant="outline" /> */}
                <BuildingWizard variant="outline" />
                <div className="block xl:hidden">
                  {/* <ButtonGroupTotal /> */}
                </div>

                <div className="flex items-center gap-2">
                  <ButtonGroupBuilding />
                </div>
              </div>
            </header>

            {/* {filterComponents.panel} */}

            <div className="size-full overflow-y-auto no-scrollbar flex flex-col">
              {/* <BuildingList ref={buildingListRef} filters={deferredFilters} /> */}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}