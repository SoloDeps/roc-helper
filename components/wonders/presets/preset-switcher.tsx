"use client";

import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PresetSwitcherProps {
  presets: { id: string; name: string }[];
  activePresetId: string;
  onSelect: (id: string) => void;
  onAddPreset: () => void;
  atLimit?: boolean;
}

export function PresetSwitcher({
  presets,
  activePresetId,
  onSelect,
  onAddPreset,
  atLimit = false,
}: PresetSwitcherProps) {
  const index = presets.findIndex((p) => p.id === activePresetId);

  const goTo = (newIndex: number) => {
    if (newIndex < 0 || newIndex >= presets.length) return;
    onSelect(presets[newIndex].id);
  };

  return (
    <div className="flex items-center gap-1">
      <Button
        variant="outline"
        size="icon"
        className="size-9 shrink-0 disabled:pointer-events-auto disabled:cursor-not-allowed"
        disabled={index <= 0}
        onClick={() => goTo(index - 1)}
      >
        <ChevronLeft className="size-4" />
      </Button>

      <Select value={activePresetId} onValueChange={onSelect}>
        <SelectTrigger className="w-40 h-8 text-sm font-medium select-none">
          <SelectValue />
        </SelectTrigger>
        <SelectContent align="center">
          {presets.map((p) => (
            <SelectItem key={p.id} value={p.id}>
              {p.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        variant="outline"
        size="icon"
        className="size-9 shrink-0 disabled:pointer-events-auto disabled:cursor-not-allowed"
        disabled={index >= presets.length - 1}
        onClick={() => goTo(index + 1)}
      >
        <ChevronRight className="size-4" />
      </Button>

      <Tooltip>
        <TooltipTrigger asChild>
          <span className="shrink-0 ml-1">
            <Button
              variant="outline"
              className="disabled:pointer-events-auto disabled:cursor-not-allowed"
              disabled={atLimit}
              onClick={onAddPreset}
            >
              <Plus className="size-4" />
              <span className="hidden md:inline">New preset</span>
            </Button>
          </span>
        </TooltipTrigger>
        {atLimit && (
          <TooltipContent>Preset limit reached ({presets.length} max)</TooltipContent>
        )}
      </Tooltip>
    </div>
  );
}
