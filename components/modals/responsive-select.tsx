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
  // SelectValue,
} from "@/components/ui/select";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import Image from "next/image";

/**
 * Option type for the responsive select
 */
interface SelectOption {
  value: string;
  label: string;
  imageUrl?: string;
}

/**
 * ResponsiveSelect Props
 */
interface ResponsiveSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  label?: string;
  className?: string;
  disabled?: boolean;
  readOnly?: boolean; // If true, shows normal appearance but prevents opening
  hideChevron?: boolean; // If true, hides the chevron icon
  nested?: boolean; // Si true, s'ouvre en drawer nested (au-dessus d'un autre drawer)
  drawerClassName?: string;
}

/**
 * Mobile Drawer Content
 */
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
      {/* Header */}
      <div className="sticky top-0 z-10 backdrop-blur-sm border-b border-alpha-400 bg-background shrink-0">
        <div className="flex items-center justify-center h-10 px-4">
          <h3 className="text-sm font-semibold">
            {placeholder || "Select an option"}
          </h3>
        </div>
      </div>

      {/* Options List */}
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

/**
 * Responsive Select Component
 * - Desktop: Normal Select dropdown
 * - Mobile: Button that opens a Drawer
 */
export function ResponsiveSelect({
  value,
  onValueChange,
  options,
  placeholder = "Select an option",
  label,
  className,
  disabled = false,
  readOnly = false,
  hideChevron = false,
  nested = false,
  drawerClassName,
}: ResponsiveSelectProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [open, setOpen] = React.useState(false);

  const selectedOption = options.find((opt) => opt.value === value);

  // ✅ Prevent opening if readOnly
  const handleOpenChange = React.useCallback(
    (newOpen: boolean) => {
      if (!readOnly) {
        setOpen(newOpen);
      }
    },
    [readOnly],
  );

  // Desktop: Regular Select
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
            <SelectContent position="popper">
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

  // Mobile: Drawer
  return (
    <div className={cn("flex flex-col space-y-2", className)}>
      {label && <label className="text-sm font-medium">{label}</label>}

      <Drawer open={open} onOpenChange={handleOpenChange} nested={nested}>
        <DrawerTrigger asChild disabled={readOnly}>
          <Button
            variant="outline"
            disabled={disabled}
            className={cn(
              "w-full justify-between h-12",
              readOnly && "cursor-default",
            )}
            onClick={readOnly ? (e) => e.preventDefault() : undefined}
          >
            <div className="flex items-center gap-3">
              {selectedOption?.imageUrl ? (
                <Image
                  src={selectedOption.imageUrl}
                  alt={selectedOption.value}
                  className="size-7 brightness-110"
                  width={28}
                  height={28}
                />
              ) : null}
              <span>{selectedOption?.label || placeholder}</span>
            </div>
            <div>
              {!hideChevron && (
                <ChevronRight className="size-5 text-muted-foreground" />
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
