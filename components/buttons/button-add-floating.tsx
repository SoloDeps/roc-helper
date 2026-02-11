"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useAddElementStore } from "@/lib/stores/add-element-store";

export default function ButtonAddFloating() {
  const { openModal } = useAddElementStore();
  return (
    <div className="fixed bottom-6 left-4 z-50 block md:hidden">
      <Button
        variant="default"
        className="rounded-full transition-transform active:scale-[0.95] size-14"
        onClick={() => openModal()}
      >
        <PlusIcon className="size-7" />
        <span className="sr-only">Add</span>
      </Button>
    </div>
  );
}
