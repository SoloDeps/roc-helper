"use client";

import { ReactNode, memo } from "react";
import { Archive, Eye, EyeOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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

  /** Content to display inside accordion */
  children: ReactNode;

  /** Optional: Custom className for accordion item */
  className?: string;

  /** Optional: Show subtitle inline on desktop only */
  inlineSubtitle?: boolean;
}

// ============================================================================
// 🎯 OPTIMISATION : Mémoïser le composant
// ============================================================================

/**
 * Reusable Accordion Component
 *
 * Utilisé pour Buildings, Technos, Areas, et Trade Posts
 * Fournit une interface cohérente avec hide/show all, badges, etc.
 *
 * ✅ Mémoïsé pour éviter les re-renders inutiles
 */
export const ReusableAccordion = memo(function ReusableAccordion({
  id,
  title,
  subtitle,
  selectedCount,
  hiddenCount,
  allHidden,
  onToggleAllHidden,
  children,
  className,
  inlineSubtitle = false,
}: ReusableAccordionProps) {
  return (
    <AccordionItem
      value={id}
      className={cn(
        "rounded-md border bg-background-200 py-1 border-alpha-300 group",
        className,
      )}
    >
      <AccordionTrigger className="hover:no-underline [&>svg]:-order-1 justify-start gap-3 p-2 md:px-4 text-sm h-14 md:h-12">
        <div className="flex justify-between items-center w-full">
          {/* LEFT SIDE: Title & Subtitle */}
          <div className="flex flex-col md:flex-row capitalize">
            <span>{title}</span>
            {subtitle && (
              <>
                {inlineSubtitle && (
                  <span className="hidden md:inline">&nbsp;—&nbsp;</span>
                )}
                <span
                  className={cn(
                    inlineSubtitle
                      ? "max-md:text-muted-foreground max-md:text-xs max-md:font-normal"
                      : "text-muted-foreground text-xs font-normal",
                  )}
                >
                  {subtitle}
                </span>
              </>
            )}
          </div>

          {/* RIGHT SIDE: Actions & Badges */}
          <div className="flex gap-1.5 items-center shrink-0">
            {/* Hide/Show All Button */}
            <div
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "h-7 md:opacity-0 group-hover:md:opacity-100 transition-opacity",
              )}
              onClick={(e) => {
                e.stopPropagation();
                onToggleAllHidden();
              }}
            >
              {allHidden ? (
                <Eye className="size-4 max-md:hidden" />
              ) : (
                <EyeOff className="size-4 max-md:hidden" />
              )}
              <span>{allHidden ? "Show all" : "Hide all"}</span>
            </div>

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
                className="flex gap-1.5 bg-background-300 rounded-sm max-md:w-[60px] h-6 md:h-7 px-2 text-sm border-alpha-400"
              >
                <Archive className="size-[18px]! text-muted-foreground md:hidden" />
                {selectedCount}
                <span className="hidden md:inline-block">selected</span>
              </Badge>
            </div>
          </div>
        </div>
      </AccordionTrigger>

      {/* 🎯 OPTIMISATION : Wrapper div pour éviter layout shift */}
      <AccordionContent>
        <div className="px-2 md:px-4 pb-4 pt-3 space-y-2 2xl:ps-10">
          {children}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
});
