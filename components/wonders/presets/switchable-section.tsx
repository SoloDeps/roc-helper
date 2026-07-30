"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

/**
 * Container width (px) below which the narrow (tabbed) view is shown.
 * Must match the static Tailwind classes used in SwitchableSection (hardcoded at 620px).
 */
export const BUILDER_CONTAINER_BREAKPOINT = 620;

interface SwitchableSectionTab {
  value: string;
  label: string;
}

interface SwitchableSectionProps {
  wide: React.ReactNode;
  narrow: React.ReactNode;
  tabs: SwitchableSectionTab[];
  defaultValue?: string;
}

/**
 * Renders both wide and narrow views in the DOM at all times.
 * CSS container query toggles visibility — no JS state, no resize listener.
 *
 * Wide view is shown when the container is >= 620px.
 * Narrow view (tabs) is shown when the container is < 620px.
 */
export function SwitchableSection({
  wide,
  narrow,
  tabs,
  defaultValue,
}: SwitchableSectionProps) {
  return (
    <div className="@container">
      {/* Wide view — visible when container >= breakpoint */}
      {/* NOTE: keep 620px in sync with BUILDER_CONTAINER_BREAKPOINT */}
      <div className="hidden @min-[880px]:flex @max-[880px]:max-w-[620px] m-auto">
        {wide}
      </div>

      {/* Narrow view — visible when container < breakpoint */}
      {/* NOTE: keep 620px in sync with BUILDER_CONTAINER_BREAKPOINT */}
      <div className="flex @min-[880px]:hidden @max-[880px]:max-w-155 m-auto">
        <Tabs defaultValue={defaultValue ?? tabs[0]?.value} className="w-full">
          <TabsList>
            {tabs.map((t) => (
              <TabsTrigger key={t.value} value={t.value}>
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {narrow}
        </Tabs>
      </div>
    </div>
  );
}
