"use client";

import { useState } from "react";
import { Eye, EyeOff, Trash2Icon, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

// ============================================================================
// TYPES
// ============================================================================

export interface AccordionActionsDrawerProps {
  /** Display title for the drawer */
  title: string;

  /** Are all items in this accordion hidden? */
  allHidden: boolean;

  /** Handler for toggle all hidden/visible */
  onToggleAllHidden: () => void;

  /** Optional: Handler for delete all - if not provided, delete button won't show */
  onDeleteAll?: () => void;

  /** Optional: Custom delete confirmation message */
  deleteConfirmMessage?: React.ReactNode;

  /** Controlled open state */
  open: boolean;

  /** Handler for open state change */
  onOpenChange: (open: boolean) => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

/**
 * Accordion Actions Drawer (Mobile Only)
 *
 * Displays a drawer with show/hide all and optionally delete all actions
 * Used by parent component, completely separated from accordion
 *
 * This is now a controlled component that lives outside the accordion
 */
export function AccordionActionsDrawer({
  title,
  allHidden,
  onToggleAllHidden,
  onDeleteAll,
  deleteConfirmMessage,
  open,
  onOpenChange,
}: AccordionActionsDrawerProps) {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleToggleHidden = () => {
    onToggleAllHidden();
    onOpenChange(false);
  };

  const handleDeleteAll = async () => {
    if (!onDeleteAll) return;

    try {
      await onDeleteAll();
      toast.success("All items deleted successfully");
    } catch (error) {
      console.error("Failed to delete:", error);
      toast.error("Failed to delete items");
    } finally {
      setDeleteDialogOpen(false);
      onOpenChange(false);
    }
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  return (
    <>
      {/* Main Actions Drawer */}
      <Drawer open={open} onOpenChange={onOpenChange} nested>
        <DrawerContent className="max-h-[40vh]">
          <DrawerHeader className="border-b py-3 px-4">
            <div className="flex justify-between items-center">
              <DrawerTitle className="text-base">{title}</DrawerTitle>
              <DrawerClose asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </DrawerClose>
            </div>
          </DrawerHeader>

          <div className="flex flex-col p-3 gap-1">
            {/* Show/Hide All Button */}
            <Button
              variant="ghost"
              className="justify-start h-12"
              onClick={handleToggleHidden}
            >
              {allHidden ? (
                <>
                  <Eye className="size-5" />
                  Show All
                </>
              ) : (
                <>
                  <EyeOff className="size-5" />
                  Hide All
                </>
              )}
            </Button>

            {/* Delete All Button (optional) */}
            {onDeleteAll && (
              <>
                <div className="border-t my-1" />
                <Button
                  variant="ghost"
                  className="justify-start h-12 text-destructive hover:text-destructive"
                  onClick={handleDeleteClick}
                >
                  <Trash2Icon className="size-5" />
                  Delete All
                </Button>
              </>
            )}
          </div>
        </DrawerContent>
      </Drawer>

      {/* Delete Confirmation Dialog */}
      {onDeleteAll && (
        <Drawer
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          nested
        >
          <DrawerContent className="max-h-[40vh]">
            <DrawerHeader className="border-b py-3 px-4">
              <DrawerTitle className="text-base text-destructive">
                Delete All Items?
              </DrawerTitle>
            </DrawerHeader>

            <div className="p-4 space-y-4">
              <p className="text-sm text-muted-foreground">
                {deleteConfirmMessage || (
                  <>
                    This action cannot be <b>undone</b>.
                    <br />
                    This will permanently delete <b>all items</b> in this
                    section.
                  </>
                )}
              </p>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setDeleteDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={handleDeleteAll}
                >
                  Delete All
                </Button>
              </div>
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </>
  );
}
