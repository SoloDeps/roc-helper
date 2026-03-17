"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useAddElementStore } from "./add-element-store";
import { getWikiDB } from "@/lib/db/schema";
import { ERAS } from "@/lib/catalog";
import { getCampaignsByEra } from "@/data/campaigns/campaigns-registry";
import { useSelectCampaignEra } from "./campaign-page-store";
import { useQueryClient } from "@tanstack/react-query";

export function useSubmitCampaign() {
  const { closeModal } = useAddElementStore();
  const selectCampaignEra = useSelectCampaignEra();
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (eraId: string) => {
    if (!eraId) {
      toast.error("No era selected");
      return;
    }

    const era = ERAS.find((e) => e.id === eraId);
    if (!era) {
      toast.error("Era not found");
      return;
    }

    const regions = getCampaignsByEra(eraId);
    if (regions.length === 0) {
      toast.error("No campaign data found for this era");
      return;
    }

    setIsLoading(true);
    try {
      const db = getWikiDB();

      const toAdd = regions.map((r) => ({ id: r.id, hidden: 0, cp: 0 }));
      await db.campaigns.bulkPut(toAdd);

      queryClient.invalidateQueries({ queryKey: ["campaigns"] });

      selectCampaignEra(eraId);

      toast.success(`${era.name} campaign added (${regions.length} regions)`);
      closeModal();
    } catch (err) {
      console.error("Failed to add campaign era:", err);
      toast.error("Failed to add campaign era");
    } finally {
      setIsLoading(false);
    }
  };

  return { submit, isLoading };
}
