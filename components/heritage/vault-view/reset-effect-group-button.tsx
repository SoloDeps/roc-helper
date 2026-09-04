"use client";

import { useState } from "react";
import { RotateCcw } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { resetHeritageEffectSlots } from "@/lib/stores/heritage-store";

/**
 * Posé à côté du TITRE du bloc (« Production » / « Boost »), pas des coûts :
 * ne vide QUE les slots de ce groupe, jamais le vault en entier — voir
 * `resetHeritageEffectSlots`. Même motif de confirmation que la remise à zéro
 * globale du wiki (`ButtonGroupBuilding`), réduit à l'échelle d'un groupe.
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
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="size-5 text-muted-foreground hover:text-destructive"
        title={`Reset ${groupLabel} slots`}
        aria-label={`Reset ${groupLabel} slots`}
        onClick={() => setOpen(true)}
      >
        <RotateCcw size={12} aria-hidden="true" />
      </Button>
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
              <RotateCcw aria-hidden="true" />
            </AlertDialogMedia>
            <AlertDialogTitle>Reset {groupLabel} slots?</AlertDialogTitle>
            <AlertDialogDescription>
              This will unequip every effect from the {groupLabel} slots. Level,
              XP, keeper progress, and the other group are not affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => resetHeritageEffectSlots(themeId, slotIds)}
            >
              Reset
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
