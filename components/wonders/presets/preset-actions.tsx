"use client";

import {
  Copy,
  Pencil,
  Trash2,
  Eraser,
  MoreHorizontal,
  ArrowBigUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PresetActionsProps {
  onRename: () => void;
  onDuplicate: () => void;
  onMaxAll: () => void;
  onClear: () => void;
  onDelete: () => void;
}

export function PresetActions({
  onRename,
  onDuplicate,
  onMaxAll,
  onClear,
  onDelete,
}: PresetActionsProps) {
  return (
    <div>
      {/* Desktop : icônes + tooltip */}
      <div className="hidden @min-[640px]:flex items-center gap-1">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={onMaxAll}
            >
              <ArrowBigUp className="size-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Max all wonder levels</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={onRename}
            >
              <Pencil className="size-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Rename</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={onDuplicate}
            >
              <Copy className="size-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Duplicate</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={onClear}
            >
              <Eraser className="size-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Clear all wonders</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 text-destructive hover:text-destructive"
              onClick={onDelete}
            >
              <Trash2 className="size-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Delete preset</TooltipContent>
        </Tooltip>
      </div>

      {/* Mobile : menu "···" */}
      <div className="flex @min-[640px]:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <MoreHorizontal className="size-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onRename}>Rename</DropdownMenuItem>
            <DropdownMenuItem onClick={onDuplicate}>
              <Copy className="size-5 mr-3" /> Duplicate
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onMaxAll}>
              <ArrowBigUp className="size-5 mr-3" /> Max all wonder levels
            </DropdownMenuItem>
            <DropdownMenuItem onClick={onClear}>
              <Eraser className="size-5 mr-3" /> Clear all wonders
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={onDelete}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="size-5 mr-3" /> Delete preset
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
