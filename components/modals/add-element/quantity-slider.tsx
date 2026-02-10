"use client";

import { Slider } from "@/components/ui/slider";

interface QtySliderProps {
  value: number;
  min?: number;
  max: number;
  onChange: (v: number) => void;
}

export function QtySlider({ value, min = 1, max, onChange }: QtySliderProps) {
  return (
    <Slider
      value={[value]}
      onValueChange={([v]) => onChange(v)}
      min={min}
      max={max}
      step={1}
    />
  );
}
