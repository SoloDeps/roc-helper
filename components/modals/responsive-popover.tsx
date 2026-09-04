"use client";

import * as React from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";

/**
 * Popover sur desktop, drawer sur mobile — même contenu, une seule source.
 *
 * Pendant du `ResponsiveModal`, pour les sélecteurs ancrés à un élément plutôt
 * que centrés à l'écran.
 */
interface ResponsivePopoverProps {
  trigger: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
  align?: "start" | "center" | "end";
  /** Nom accessible du tiroir mobile — cf. `ResponsiveModal`. */
  title?: string;
}

export function ResponsivePopover({
  trigger,
  open,
  onOpenChange,
  children,
  className,
  align = "center",
  title,
}: ResponsivePopoverProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>{trigger}</PopoverTrigger>
        <PopoverContent align={align} className={className}>
          {children}
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent className={className} title={title}>
        {children}
      </DrawerContent>
    </Drawer>
  );
}
