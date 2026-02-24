"use client";

import Image from "next/image";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { showAllEntities } from "@/lib/db/hide-show-utils";

import { Button } from "@/components/ui/button";
import { WorkshopModal } from "@/components/modals/workshop-modal";
import { AddElementModal } from "../modals/add-element/add-element-modal";
import { Eye } from "lucide-react";

interface EmptyType {
  perso: "male" | "female" | "male2";
  type: "total" | "building" | "no-data" | "all-hidden";
}

interface ContentItem {
  image: string;
  imgClass?: string;
  textClass?: string;
  text: string;
  description: string;
}

const content: Record<"male" | "female" | "male2", ContentItem> = {
  female: {
    imgClass: "h-64 left-[72px] hidden md:block",
    image: "/images/characters/female_lge.png",
    textClass: "ps-5 md:ps-40",
    text: "Glad to see you, Sire!",
    description:
      "Here, you can view and adjust the resources you need.\nFelix could use your help on the other side!",
  },
  male: {
    imgClass: "h-64 left-14 hidden md:block",
    image: "/images/characters/male_lge.png",
    textClass: "ps-5 md:ps-40",
    text: "I hope you're doing well, Chief!",
    description:
      "We should start adding new buildings to the list to better track the resources we'll need for them.",
  },
  male2: {
    imgClass: "h-56 left-28 hidden md:block",
    image: "/images/characters/male2_lge.png",
    textClass: "ps-5 md:ps-52",
    text: "What are you up to, Chief?",
    description:
      "Everything's hidden here...\nUnhide some items to see your resources!",
  },
};

export function EmptyOutline({ perso, type }: EmptyType) {
  const queryClient = useQueryClient();

  const invalidateAll = () => {
    queryClient.invalidateQueries({ refetchType: "all" });
  };

  const handleShowAll = async () => {
    try {
      await showAllEntities();
      invalidateAll();
    } catch (error) {
      console.error("Failed to show all:", error);
      toast.error("Failed to show all items");
    }
  };

  return (
    <div className="relative max-w-xl w-full h-48 border rounded-xl border-alpha-400 bg-background-300 shadow-xs">
      <div
        className={`${content[perso].textClass} relative size-full p-4 flex flex-col justify-center gap-3 text-center`}
      >
        <h3 className="text-[17px] font-semibold">{content[perso].text}</h3>
        <p className="text-[15px] text-muted-foreground whitespace-pre-line">
          {content[perso].description}
        </p>
        {type !== "no-data" && (
          <div className="pt-1">
            {type === "building" && (
              <div className="flex justify-center items-center gap-2">
                <AddElementModal variant="default" long />
              </div>
            )}
            {type === "total" && <WorkshopModal variant="default" />}
            {type === "all-hidden" && (
              <Button variant="default" size="sm" onClick={handleShowAll}>
                <Eye className="h-4 w-4" />
                Show all
              </Button>
            )}
          </div>
        )}
      </div>
      <Image
        src={content[perso].image}
        alt="img"
        className={`absolute ${content[perso].imgClass || "left-28"} bottom-0 -translate-x-1/2 w-auto pointer-events-none z-10`}
        width={280}
        height={280}
      />
    </div>
  );
}
