import { useState } from "react";
import { Sigma, X } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";
import { TotalGoodsDisplay } from "@/components/total-goods/total-goods-display";

interface TotalDrawerProps {
  compareMode?: boolean;
  onToggleCompare?: (enabled: boolean) => void;
}

export function TotalDrawer({
  compareMode = false,
}: TotalDrawerProps) {
  const [open, setOpen] = useState(false);
  const isXL = useMediaQuery("(min-width: 1280px)");

  if (isXL) return null;

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button size="sm" variant="outline" className="cursor-pointer">
          <Sigma className="size-[18px]" />
          View Total
        </Button>
      </DrawerTrigger>

      <DrawerContent className="bg-background-200 h-[95vh] flex flex-col">
        {/* Header sticky */}
        <DrawerHeader className="border-b border-alpha-400 py-3 px-4 shrink-0">
          <div className="w-full max-w-[870px] mx-auto">
            <div className="flex justify-between items-center h-5">
              <DrawerTitle className="text-left text-base">
                Total Resources
              </DrawerTitle>

              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
                className="rounded-full"
              >
                <X className="size-5" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
          </div>
        </DrawerHeader>

        {/* Content area - utilise le même composant TotalGoodsDisplay */}
        <div className="flex-1 overflow-hidden">
          <TotalGoodsDisplay compareMode={compareMode} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
