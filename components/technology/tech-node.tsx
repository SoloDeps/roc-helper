"use client";

import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { cn } from "@/lib/utils";

interface TechNodeData {
  name: string;
  costs: {
    research_points?: number;
    coins?: number;
    food?: number;
    goods?: Array<{ resource: string; amount: number }>;
  };
  allied?: string;
  hidden?: boolean;
  completed?: boolean; // ✅ NEW: Track completion status
}

interface TechNodeProps {
  data: TechNodeData;
  selected?: boolean;
}

export const TechNode = memo<TechNodeProps>(({ data, selected }) => {
  const { name, allied, hidden } = data;

  return (
    <div
      className={cn(
        "relative bg-card border rounded-sm p-3",
        "min-w-[180px] max-w-[200px]",
        "transition-all duration-200 cursor-pointer",
        selected && "border-primary shadow-xl scale-105",
        hidden && "opacity-40",
        !selected && !hidden && "border-border hover:border-primary/50",
      )}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-primary !border !border-background"
      />

      {/* Allied badge (top-right) */}
      {allied && (
        <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full font-medium shadow-md">
          {allied}
        </div>
      )}

      {/* Tech name */}
      <div className="font-semibold text-xs text-left leading-tight">
        {name}
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!bg-primary !border-2 !border-background"
      />

      {/* Hover hint */}
      <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
        <div className="bg-black/80 text-white text-xs px-2 py-1 rounded">
          Click for details
        </div>
      </div>
    </div>
  );
});

TechNode.displayName = "TechNode";

export const nodeTypes = {
  custom: TechNode,
};
