"use client";

import { ReactNode, memo } from "react";
import { Eye, EyeOff, Trash2, Info, Ellipsis } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// ============================================================================
// TYPES
// ============================================================================

export interface ReusableAccordionProps {
  /** Unique ID for accordion item */
  id: string;

  /** Display title */
  title: string;

  /** Optional subtitle (e.g., "Capital", "Ottoman Empire") */
  subtitle?: string;

  /** Number of items selected */
  selectedCount: number;

  /** Number of items hidden */
  hiddenCount: number;

  /** Are all items in this accordion hidden? */
  allHidden: boolean;

  /** Handler for toggle all hidden/visible */
  onToggleAllHidden: () => void;

  /** Optional: Handler for delete all - if not provided, delete button won't show */
  onDeleteAll?: () => void;

  /** Optional: Custom delete confirmation message */
  deleteConfirmMessage?: React.ReactNode;

  /** Content to display inside accordion */
  children: ReactNode;

  /** Optional: Custom className for accordion item */
  className?: string;

  /** Optional: Show subtitle inline on desktop only */
  inlineSubtitle?: boolean;

  /** Optional: Help text to show in tooltip (desktop) or drawer subtitle (mobile) */
  helpText?: string;

  /** Mobile: Handler to open actions drawer */
  onOpenMobileActions?: () => void;
}

// ============================================================================
// 🎯 OPTIMISATION : Mémoïser le composant
// ============================================================================

/**
 * Reusable Accordion Component
 *
 * Utilisé pour Buildings, Technos, Areas, et Trade Posts
 * Fournit une interface cohérente avec hide/show all, delete all (optionnel), badges, etc.
 *
 * Mémoïsé pour éviter les re-renders inutiles
 * Desktop: Boutons avec tooltips positionnés de manière absolue
 * Mobile: Bouton qui ouvre un drawer géré par le parent
 */
export const ReusableAccordion = memo(function ReusableAccordion({
  id,
  title,
  subtitle,
  selectedCount,
  hiddenCount,
  allHidden,
  onToggleAllHidden,
  onDeleteAll,
  deleteConfirmMessage,
  children,
  className,
  inlineSubtitle = false,
  helpText,
  onOpenMobileActions,
}: ReusableAccordionProps) {
  return (
    <AccordionItem
      value={id}
      className={cn(
        "rounded-md border bg-background-200 py-1 border-alpha-300 group relative",
        className,
      )}
    >
      <AccordionTrigger className="hover:no-underline [&>svg]:-order-1 justify-start gap-3 p-2 md:px-4 text-sm h-14 md:h-12">
        <div className="flex justify-between items-center w-full gap-2">
          {/* LEFT SIDE: Title & Subtitle */}
          <div className="flex flex-col md:flex-row capitalize items-start md:items-center gap-1 md:gap-0">
            {subtitle && (
              <>
                <span
                  className={cn(
                    inlineSubtitle
                      ? "max-md:text-muted-foreground max-md:text-xs max-md:font-normal"
                      : "text-muted-foreground text-xs font-normal",
                  )}
                >
                  {subtitle}
                </span>
                {inlineSubtitle && (
                  <span className="hidden md:inline">&nbsp;—&nbsp;</span>
                )}
              </>
            )}
            <div className="flex items-center gap-2">
              {title}
              {/* Info Icon - Desktop only, appears on hover */}
              <div className="hidden md:flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                {helpText && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className={cn(
                          "h-7",
                          buttonVariants({
                            variant: "ghost",
                            size: "sm",
                          }),
                        )}
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                        }}
                      >
                        <Info className="hidden md:block size-[18px] opacity-0 group-hover:opacity-100 transition-opacity cursor-help" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent
                      className="px-3 py-2 text-[13px] max-w-[250px]"
                      side="bottom"
                    >
                      {helpText}
                    </TooltipContent>
                  </Tooltip>
                )}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className={cn(
                        "h-7 px-2",
                        buttonVariants({
                          variant: "ghost",
                          size: "sm",
                        }),
                      )}
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleAllHidden();
                      }}
                    >
                      {allHidden ? (
                        <Eye className="size-4" />
                      ) : (
                        <EyeOff className="size-4" />
                      )}
                      <span className="sr-only">
                        {allHidden ? "Show all" : "Hide all"}
                      </span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent
                    className="px-2 py-0.5 text-[13px]"
                    side="bottom"
                  >
                    {allHidden ? "Show all" : "Hide all"}
                  </TooltipContent>
                </Tooltip>

                {onDeleteAll && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className={cn(
                          "h-7 px-2 text-destructive hover:text-destructive!",
                          buttonVariants({
                            variant: "ghost",
                            size: "sm",
                          }),
                        )}
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteAll();
                        }}
                      >
                        <Trash2 className="size-4" />
                        <span className="sr-only">Delete all</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent
                      className="px-2 py-0.5 text-[13px]"
                      side="bottom"
                    >
                      Delete all
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Actions + Badges */}
          <div className="flex gap-1.5 items-center shrink-0">
            {/* Badges Container */}
            <div className="flex flex-col md:flex-row gap-1.5 items-center">
              {/* Hidden Badge */}
              {hiddenCount > 0 && (
                <Badge
                  variant="outline"
                  className="flex gap-1.5 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-sm max-md:w-[60px] h-6 md:h-7 px-2 text-sm border-orange-300 dark:border-orange-700"
                >
                  <EyeOff className="size-[18px]! md:hidden" />
                  {hiddenCount}
                  <span className="hidden md:inline-block">hidden</span>
                </Badge>
              )}

              {/* Selected Badge */}
              <Badge
                variant="outline"
                className="hidden md:flex gap-1.5 bg-background-300 rounded-sm h-7 px-2 text-sm border-alpha-400"
              >
                {selectedCount} <span>added</span>
              </Badge>
            </div>

            {/* MOBILE ACTIONS - Simple Button */}
            {onOpenMobileActions && (
              <div
                className={cn(
                  buttonVariants({
                    variant: "ghost",
                    size: "sm",
                  }),
                  "h-7 w-14 flex items-center justify-center md:hidden",
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenMobileActions();
                }}
              >
                <Ellipsis className="size-6 text-muted-foreground" />
              </div>
            )}
          </div>
        </div>
      </AccordionTrigger>

      {/* 🎯 OPTIMISATION : Wrapper div pour éviter layout shift */}
      <AccordionContent className="pb-0">
        <div className="px-2 md:px-4 pb-4 pt-3 space-y-2 2xl:ps-10">
          {children}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
});
