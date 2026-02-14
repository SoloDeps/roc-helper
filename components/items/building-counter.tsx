import { MinusIcon, PlusIcon, Edit2 } from "lucide-react";
import { useState, useCallback, useRef, useEffect } from "react";
import { Button, Group, NumberField } from "react-aria-components";
import { Button as ShadcnButton } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { QtySlider } from "@/components/modals/add-element/quantity-slider";

interface BuildingCounterProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
}

/**
 * Custom hook for debounced value updates
 */
function useDebouncedCallback<T extends (...args: any[]) => void>(
  callback: T,
  delay: number,
): T {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay],
  ) as T;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
}

/**
 * Mobile Quantity Drawer with debounced slider
 */
function MobileQuantityDrawer({
  value,
  onChange,
  min = 1,
  max = 999,
  disabled = false,
}: BuildingCounterProps) {
  const [open, setOpen] = useState(false);
  const [localValue, setLocalValue] = useState(value);

  // Sync local value when prop changes (e.g., from external updates)
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Debounced callback for the actual onChange
  const debouncedOnChange = useDebouncedCallback(onChange, 300);

  const handleSliderChange = useCallback(
    (newValue: number) => {
      setLocalValue(newValue);
      debouncedOnChange(newValue);
    },
    [debouncedOnChange],
  );

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <ShadcnButton variant="outline" disabled={disabled} className="gap-3">
          <span>Quantity:</span>
          <span>{value}</span>
          <Edit2 className="size-3.5" />
        </ShadcnButton>
      </DrawerTrigger>

      <DrawerContent className="h-[35vh] p-0">
        <DrawerHeader className="border-b border-alpha-400 py-1 px-4">
          <DrawerTitle className="text-center">Adjust Quantity</DrawerTitle>
        </DrawerHeader>

        <div className="flex-1 px-2 pt-3 pb-6 flex flex-col justify-center gap-6">
          {/* Display current value - shows local value for instant feedback */}
          <div className="text-center">
            <div className="text-4xl font-bold tabular-nums">{localValue}</div>
            <div className="text-[15px] font-medium text-muted-foreground mt-1">Max: {max}</div>
          </div>

          {/* Slider with debounced updates */}
          <div className="px-2">
            <QtySlider
              value={localValue}
              min={min}
              max={max}
              onChange={handleSliderChange}
            />
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

/**
 * Desktop Counter with instant button feedback
 */
function DesktopCounter({
  value,
  onChange,
  min = 1,
  max = 999,
  disabled = false,
}: BuildingCounterProps) {
  // For buttons, we want instant feedback, no debounce
  return (
    <NumberField
      value={value}
      onChange={onChange}
      minValue={min}
      maxValue={max}
      isDisabled={disabled}
      aria-label="Building quantity"
    >
      <Group className="relative inline-flex h-9 items-center overflow-hidden whitespace-nowrap rounded-md border border-input text-sm shadow-sm">
        <Button
          slot="decrement"
          className="flex aspect-square h-[inherit] items-center justify-center border-r border-input bg-background-300 text-muted-foreground hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
        >
          <MinusIcon aria-hidden="true" size={18} />
        </Button>

        <div className="flex items-center justify-center size-9 px-2 bg-background-100 text-center font-medium tabular-nums select-none">
          {value}
        </div>

        <Button
          slot="increment"
          className="flex aspect-square h-[inherit] items-center justify-center border-l border-input bg-background-300 text-muted-foreground hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
        >
          <PlusIcon aria-hidden="true" size={18} />
        </Button>
      </Group>
    </NumberField>
  );
}

/**
 * Main BuildingCounter - Responsive
 */
export default function BuildingCounter({
  value,
  onChange,
  min = 1,
  max = 999,
  disabled = false,
}: BuildingCounterProps) {
  const isMobile = useMediaQuery("(max-width: 767px)");

  if (isMobile) {
    return (
      <MobileQuantityDrawer
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        disabled={disabled}
      />
    );
  }

  return (
    <DesktopCounter
      value={value}
      onChange={onChange}
      min={min}
      max={max}
      disabled={disabled}
    />
  );
}
