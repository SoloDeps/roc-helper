"use client";

import { RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { resetHeritageEffectSlots } from "@/lib/stores/heritage-store";

/**
 * Collé au TITRE du bloc (« Production » / « Boost »), pas des coûts :
 * ne vide QUE les slots de ce groupe, jamais le vault en entier — voir
 * `resetHeritageEffectSlots`. Pas de confirmation : rééquiper quatre slots
 * après un clic malheureux ne pèse pas assez pour justifier un pop-up.
 */
export function ResetEffectGroupButton({
  themeId,
  groupLabel,
  slotIds,
}: {
  themeId: string;
  groupLabel: string;
  slotIds: string[];
}) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-5 text-muted-foreground hover:text-destructive"
      title={`Reset ${groupLabel} slots`}
      aria-label={`Reset ${groupLabel} slots`}
      onClick={() => resetHeritageEffectSlots(themeId, slotIds)}
    >
      <RotateCcw size={12} aria-hidden="true" />
    </Button>
  );
}
