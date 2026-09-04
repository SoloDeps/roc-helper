"use client";

import * as React from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";

/**
 * Responsive modal that automatically switches between Dialog (desktop) and Drawer (mobile)
 * Single source of truth for modal content
 */
interface ResponsiveModalProps {
  trigger: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
  /**
   * Nom accessible de la boîte — le titre visible, mot pour mot.
   *
   * Sans lui, Dialog comme Drawer retombent sur un nom générique (« Dialog »,
   * « Drawer Content ») : toutes les modales de l'app s'annoncent alors pareil.
   */
  title?: string;
}

export function ResponsiveModal({
  trigger,
  open,
  onOpenChange,
  children,
  className,
  title,
}: ResponsiveModalProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // Desktop: Dialog
  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent
          className={className}
          showCloseButton={false}
          title={title}
        >
          {children}
        </DialogContent>
      </Dialog>
    );
  }

  // Mobile: Drawer
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent className={className} title={title}>
        {children}
      </DrawerContent>
    </Drawer>
  );
}
