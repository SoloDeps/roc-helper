"use client";

import * as React from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import Image from "next/image";

interface SelectOption {
  value: string;
  label: string;
  imageUrl?: string;
}

interface ResponsiveSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  label?: string;
  className?: string;
  selectClassName?: string;
  drawerBtnClassName?: string;
  disabled?: boolean;
  readOnly?: boolean;
  hideChevron?: boolean;
  rotateChevron?: boolean;
  nested?: boolean;
  drawerClassName?: string;
  // ✅ CORRIGÉ : alignItemWithTrigger utilise toujours popper en interne
  // car item-aligned casse dans les modales Radix (bug portal/focus-scope)
  alignItemWithTrigger?: boolean;
}

const DrawerSelectContent = React.memo<{
  placeholder?: string;
  options: SelectOption[];
  value: string;
  onSelect: (value: string) => void;
  onClose: () => void;
}>(({ placeholder, options, value, onSelect, onClose }) => {
  const handleSelect = (newValue: string) => {
    onSelect(newValue);
    onClose();
  };

  return (
    <div className="flex flex-col max-h-full h-full">
      <div className="sticky top-0 z-10 backdrop-blur-sm border-b border-alpha-400 bg-background shrink-0">
        <div className="flex items-center justify-center h-10 px-4">
          <h3 className="text-sm font-semibold">
            {placeholder || "Select an option"}
          </h3>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 pb-6 min-h-0">
        {options.map((option) => {
          const isSelected = option.value === value;
          return (
            <Button
              key={option.value}
              variant="ghost"
              onClick={() => handleSelect(option.value)}
              className={cn(
                "w-full justify-between h-12 px-4 mb-1 rounded-lg",
                isSelected && "bg-accent",
              )}
            >
              <div className="flex items-center gap-3">
                {option.imageUrl ? (
                  <Image
                    src={option.imageUrl}
                    alt={option.value}
                    className="size-7 brightness-110"
                    width={28}
                    height={28}
                  />
                ) : null}
                <span className="font-medium">{option.label}</span>
              </div>
              {isSelected && <Check className="size-5 text-primary" />}
            </Button>
          );
        })}
      </div>
    </div>
  );
});

DrawerSelectContent.displayName = "DrawerSelectContent";

export function ResponsiveSelect({
  value,
  onValueChange,
  options,
  placeholder = "Select an option",
  label,
  className,
  selectClassName,
  drawerBtnClassName,
  disabled = false,
  readOnly = false,
  hideChevron = false,
  rotateChevron = false,
  alignItemWithTrigger = false,
  nested = false,
  drawerClassName,
}: ResponsiveSelectProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [open, setOpen] = React.useState(false);

  const selectedOption = options.find((opt) => opt.value === value);

  const handleOpenChange = React.useCallback(
    (newOpen: boolean) => {
      if (!readOnly) {
        setOpen(newOpen);
      }
    },
    [readOnly],
  );

  if (isDesktop) {
    return (
      <div className={cn("flex flex-col space-y-2", className)}>
        {label && <label className="text-sm font-medium">{label}</label>}

        <Select
          value={value}
          onValueChange={onValueChange}
          disabled={disabled}
          onOpenChange={readOnly ? () => {} : undefined}
        >
          <SelectTrigger
            className={cn(
              "w-full font-medium text-sm",
              readOnly && "cursor-default",
              selectClassName,
            )}
            onClick={readOnly ? (e) => e.preventDefault() : undefined}
          >
            {selectedOption ? (
              <div className="flex items-center gap-2">
                {selectedOption.imageUrl && (
                  <Image
                    src={selectedOption.imageUrl}
                    alt={selectedOption.value}
                    className="size-5 brightness-110"
                    width={20}
                    height={20}
                  />
                )}
                <span>{selectedOption.label}</span>
              </div>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </SelectTrigger>

          {!readOnly && (
            <SelectContent
              // ✅ FIX CRITIQUE : on force toujours "popper" pour éviter le bug
              // Radix item-aligned + Dialog modal (portal bloqué par focus-scope).
              // On simule l'alignement visuellement via sideOffset=0 + align="start".
              position="popper"
              sideOffset={alignItemWithTrigger ? 0 : 4}
              align={alignItemWithTrigger ? "start" : "center"}
              // ✅ Contraindre la largeur pour coller au trigger quand aligné
              className={
                alignItemWithTrigger
                  ? "w-[var(--radix-select-trigger-width)] max-h-[min(var(--radix-select-content-available-height),300px)]"
                  : undefined
              }
            >
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    {option.imageUrl && (
                      <Image
                        src={option.imageUrl}
                        alt={option.value}
                        className="size-5 brightness-110"
                        width={20}
                        height={20}
                      />
                    )}
                    <span>{option.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          )}
        </Select>
      </div>
    );
  }

  // Mobile: Drawer (inchangé)
  return (
    <div className={cn("flex flex-col space-y-2", className)}>
      {label && <label className="text-sm font-medium">{label}</label>}

      <Drawer open={open} onOpenChange={handleOpenChange} nested={nested}>
        <DrawerTrigger asChild disabled={readOnly}>
          <Button
            variant="outline"
            disabled={disabled}
            className={cn(
              "w-full justify-between h-12 min-w-0",
              readOnly && "cursor-default",
              drawerBtnClassName,
            )}
            onClick={readOnly ? (e) => e.preventDefault() : undefined}
          >
            <div className="flex items-center gap-3 min-w-0">
              {selectedOption?.imageUrl ? (
                <Image
                  src={selectedOption.imageUrl}
                  alt={selectedOption.value}
                  className="size-7 shrink-0 brightness-110"
                  width={28}
                  height={28}
                />
              ) : null}
              <span className="truncate">
                {selectedOption?.label || placeholder}
              </span>
            </div>
            <div className="shrink-0">
              {!hideChevron && (
                <ChevronRight
                  className={cn(
                    "size-5 text-muted-foreground",
                    rotateChevron ? "rotate-90 -mr-2" : "",
                  )}
                />
              )}
            </div>
          </Button>
        </DrawerTrigger>

        {!readOnly && (
          <DrawerContent className={cn("max-h-[50vh] p-0", drawerClassName)}>
            <DrawerSelectContent
              placeholder={placeholder}
              options={options}
              value={value}
              onSelect={onValueChange}
              onClose={() => setOpen(false)}
            />
          </DrawerContent>
        )}
      </Drawer>
    </div>
  );
}
