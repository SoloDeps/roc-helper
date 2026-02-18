"use client";

import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";
import { cn, getCityCrestIconLocal } from "@/lib/utils";
import Image from "next/image";

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
  completed?: boolean;
  highlighted?: boolean; // ✅ Connected to selected node
  dimmed?: boolean; // ✅ Not connected to selected node
}

interface TechNodeProps {
  data: TechNodeData;
  selected?: boolean;
}

export const TechNode = memo<TechNodeProps>(({ data, selected }) => {
  const { name, allied, hidden, highlighted, dimmed } = data;

  return (
    <div
      className={cn(
        "relative bg-card border rounded-sm p-3",
        "w-56",
        "transition-all duration-200 cursor-pointer",

        // Selected: primary color highlight
        selected && "border-primary shadow-xl scale-105 ring-2 ring-primary/40",

        // Highlighted (connected): subtle blue ring
        !selected &&
          highlighted &&
          "border-blue-400/70 ring-1 ring-blue-400/30 bg-blue-500/5",

        // Dimmed (not connected when something is selected)
        dimmed && "opacity-30",

        // Normal state
        !selected &&
          !highlighted &&
          !dimmed &&
          !hidden &&
          "border-border hover:border-primary/50",

        // Completed/hidden
        hidden && "opacity-40",
      )}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-primary !border !border-background"
      />

      {/* Allied badge (top-right) */}
      {allied && (
        <div className="absolute -top-2 -right-2">
          {/* {allied} */}
          <Image
            src={getCityCrestIconLocal(allied)}
            className="h-10 w-auto"
            width={40}
            height={40}
            alt={allied}
          />
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
    </div>
  );
});

TechNode.displayName = "TechNode";

export const nodeTypes = {
  custom: TechNode,
};
