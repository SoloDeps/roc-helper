"use client";

import { cn } from "@/lib/utils";

// ============================================================
// InlineSlider — extrait de wonder-card.tsx (implémentation
// inchangée) pour être partagé avec heritage-vault-view.tsx, cf.
// docs/heritage-loadout-fix-prompt.md point 4.
//
// Slider desktop qui adopte exactement le même look que la progress
// bar : track h-1 rounded-full bg-muted, range bg-amber-400 (vert
// quand max), thumb amber positionné absolument. Un <input range>
// transparent capture les interactions.
// ============================================================

interface InlineSliderProps {
  value: number;
  min: number;
  max: number;
  isMax: boolean;
  onChange: (v: number) => void;
}

export function InlineSlider({
  value,
  min,
  max,
  isMax,
  onChange,
}: InlineSliderProps) {
  const pct = max > min ? Math.round(((value - min) / (max - min)) * 100) : 0;

  return (
    // Zone de touch généreuse verticalement — même principe que slider.tsx
    <div className="relative flex-1 flex items-center h-5 cursor-pointer">
      {/* Track */}
      <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-1 rounded-full bg-muted overflow-visible">
        {/* Range rempli */}
        <div
          className={cn(
            "absolute inset-y-0 left-0 rounded-full pointer-events-none transition-[width] duration-75",
            isMax ? "bg-[#5dd700]" : "bg-amber-400",
          )}
          style={{ width: `${pct}%` }}
        />
        {/* Thumb */}
        <div
          className={cn(
            "absolute top-1/2 -translate-y-1/2 size-3.5 rounded-full border-2 border-background shadow-sm pointer-events-none transition-[left] duration-75",
            isMax ? "bg-[#5dd700]" : "bg-amber-400",
          )}
          style={{ left: `calc(${pct}% - 7px)` }}
        />
      </div>
      {/* Input transparent par-dessus pour capturer les interactions */}
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
    </div>
  );
}
