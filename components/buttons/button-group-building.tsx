"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  ListChevronsDownUp,
  ListChevronsUpDown,
  EyeOff,
  Eye,
  X,
  Trash2Icon,
  Settings2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useUIStore } from "@/lib/stores/ui-store";
import { resetWikiDB } from "@/lib/db/schema";
import { hideAllEntities, showAllEntities } from "@/lib/db/hide-show-utils";
import { ButtonGroup } from "../ui/button-group";

export function ButtonGroupBuilding() {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const queryClient = useQueryClient();

  const invalidateAll = () => {
    queryClient.invalidateQueries({ refetchType: "all" });
  };

  const { expandAllAccordions, collapseAllAccordions } = useUIStore();

  const handleCollapseAll = () => {
    collapseAllAccordions();
  };

  const handleExpandAll = () => {
    expandAllAccordions();
  };

  const handleHideAll = async () => {
    try {
      await hideAllEntities();
      invalidateAll();
    } catch (error) {
      console.error("Failed to hide all:", error);
      toast.error("Failed to hide all items");
    }
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

  const handleDeleteAll = async () => {
    try {
      await resetWikiDB();
      invalidateAll();
      toast.success("All data deleted successfully");
    } catch (error) {
      console.error("Failed to delete all data:", error);
      toast.error("Failed to delete all data");
    } finally {
      setDeleteDialogOpen(false);
      setDrawerOpen(false);
    }
  };

  // Desktop: Button Group with Tooltips
  if (isDesktop) {
    return (
      <>
        <ButtonGroup>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={handleCollapseAll}
                className="rounded-none rounded-l-sm shadow-none focus-visible:z-10"
              >
                <ListChevronsDownUp className="size-[18px]" />
                <span className="sr-only">Collapse All</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent className="px-2 py-1 text-xs" side="bottom">
              Collapse All
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={handleExpandAll}
                className="rounded-none shadow-none focus-visible:z-10"
              >
                <ListChevronsUpDown className="size-[18px]" />
                <span className="sr-only">Expand All</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent className="px-2 py-1 text-xs" side="bottom">
              Expand All
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={handleHideAll}
                className="rounded-none shadow-none focus-visible:z-10"
              >
                <EyeOff className="size-[18px]" />
                <span className="sr-only">Hide All</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent className="px-2 py-1 text-xs" side="bottom">
              Hide All
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={handleShowAll}
                className="rounded-none shadow-none focus-visible:z-10"
              >
                <Eye className="size-[18px]" />
                <span className="sr-only">Show All</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent className="px-2 py-1 text-xs" side="bottom">
              Show All
            </TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setDeleteDialogOpen(true)}
                className="rounded-none rounded-r-sm shadow-none focus-visible:z-10 text-destructive hover:text-destructive"
              >
                <Trash2Icon className="size-[18px]" />
                <span className="sr-only">Delete All</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent className="px-2 py-1 text-xs" side="bottom">
              Delete All
            </TooltipContent>
          </Tooltip>
        </ButtonGroup>

        {/* Desktop Delete Confirmation */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent size="sm">
            <AlertDialogHeader>
              <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
                <Trash2Icon />
              </AlertDialogMedia>
              <AlertDialogTitle>Delete all data?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete all buildings, technologies, areas,
                and trade posts.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                onClick={handleDeleteAll}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </>
    );
  }

  // Mobile: Drawer with proper nested animation
  return (
    <>
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen} nested>
        <DrawerTrigger asChild>
          <Button size="sm" variant="outline">
            <Settings2 />
            Actions
          </Button>
        </DrawerTrigger>

        <DrawerContent className="max-h-[60vh]">
          <DrawerHeader className="border-b py-3 px-4">
            <div className="flex justify-between items-center">
              <DrawerTitle className="text-base">Actions</DrawerTitle>
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
            <Button
              variant="ghost"
              className="justify-start h-12"
              onClick={() => {
                handleCollapseAll();
                setDrawerOpen(false);
              }}
            >
              <ListChevronsDownUp className="size-5" />
              Collapse All
            </Button>

            <Button
              variant="ghost"
              className="justify-start h-12"
              onClick={() => {
                handleExpandAll();
                setDrawerOpen(false);
              }}
            >
              <ListChevronsUpDown className="size-5" />
              Expand All
            </Button>

            <Button
              variant="ghost"
              className="justify-start h-12"
              onClick={() => {
                handleHideAll();
                setDrawerOpen(false);
              }}
            >
              <EyeOff className="size-5" />
              Hide All
            </Button>

            <Button
              variant="ghost"
              className="justify-start h-12"
              onClick={() => {
                handleShowAll();
                setDrawerOpen(false);
              }}
            >
              <Eye className="size-5" />
              Show All
            </Button>

            <div className="border-t my-1" />

            <Button
              variant="ghost"
              className="justify-start h-12 text-destructive hover:text-destructive"
              onClick={() => setDeleteDialogOpen(true)}
            >
              <Trash2Icon className="size-5" />
              Delete All
            </Button>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Mobile Delete Confirmation - Nested */}
      <Drawer open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen} nested>
        <DrawerContent className="max-h-[40vh]">
          <DrawerHeader className="border-b py-3 px-4">
            <DrawerTitle className="text-base text-destructive">
              Delete All Data?
            </DrawerTitle>
          </DrawerHeader>

          <div className="p-4 space-y-4">
            <p className="text-sm text-muted-foreground">
              This action cannot be <b>undone</b>.<br />
              This will permanently delete{" "}
              <b>all buildings, technologies, areas, and trade posts</b>.
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
    </>
  );
}
