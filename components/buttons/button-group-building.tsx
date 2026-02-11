"use client";

import { useState } from "react";
import {
  ChevronDownIcon,
  ListCollapseIcon,
  ListTreeIcon,
  TrashIcon,
  Filter,
  EyeOff,
  Eye,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Badge } from "@/components/ui/badge";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import { AddModal } from "@/components/modals/add-modal";
// import { AddBuildingSheet } from "../add-building-sheet";
// import {
//   hideAllBuildings,
//   showAllBuildings,
//   hideAllTechnos,
//   showAllTechnos,
//   removeAllBuildings,
//   removeAllTechnos,
//   hideAllOttomanAreas,
//   showAllOttomanAreas,
//   hideAllOttomanTradePosts,
//   showAllOttomanTradePosts,
//   removeAllOttomanAreas,
//   removeAllOttomanTradePosts,
// } from "@/lib/overview/storage";

export function ButtonGroupBuilding() {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // const handleDeleteAll = async () => {
  //   try {
  //     // Delete all data including Ottoman
  //     await Promise.all([
  //       removeAllBuildings(),
  //       removeAllTechnos(),
  //       removeAllOttomanAreas(),
  //       removeAllOttomanTradePosts(),
  //     ]);

  //     console.log(
  //       "✅ All data deleted: buildings, technos, areas, and trade posts",
  //     );
  //     onDeleteAll?.();
  //   } catch (error) {
  //     console.error("Failed to delete all data:", error);
  //   } finally {
  //     setDropdownOpen(false);
  //   }
  // };

  // const handleHideAll = async () => {
  //   try {
  //     await Promise.all([
  //       hideAllBuildings(),
  //       hideAllTechnos(),
  //       hideAllOttomanAreas(),
  //       hideAllOttomanTradePosts(),
  //     ]);
  //     console.log("✅ All data hidden");
  //   } catch (error) {
  //     console.error("Failed to hide all data:", error);
  //   } finally {
  //     setDropdownOpen(false);
  //   }
  // };

  // const handleShowAll = async () => {
  //   try {
  //     await Promise.all([
  //       showAllBuildings(),
  //       showAllTechnos(),
  //       showAllOttomanAreas(),
  //       showAllOttomanTradePosts(),
  //     ]);
  //     console.log("✅ All data shown");
  //   } catch (error) {
  //     console.error("Failed to show all data:", error);
  //   } finally {
  //     setDropdownOpen(false);
  //   }
  // };

  return (
    <>
      {/* <ButtonGroup className="block xl:hidden">
        <AddModal variant="outline" />
      </ButtonGroup> */}

      <ButtonGroup className="hidden md:block">
        <Button variant="outline" size="sm">
          Collapse All
        </Button>
        <Button variant="outline" size="sm">
          Expand All
        </Button>
      </ButtonGroup>

      <ButtonGroup className="hidden xl:block">
        <Button variant="outline" size="sm">
          Hide All
        </Button>
        <Button variant="outline" size="sm">
          Show All
        </Button>
      </ButtonGroup>

      <ButtonGroup>
        <Button variant="outline" size="sm">
          <Filter className="size-4" />
          Filters
        </Button>

        <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="pl-2!">
              <ChevronDownIcon />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="rounded-sm">
            <DropdownMenuGroup>
              <DropdownMenuItem className="lg:hidden">
                <ListCollapseIcon />
                Collapse All
              </DropdownMenuItem>

              <DropdownMenuItem className="lg:hidden">
                <ListTreeIcon />
                Expand All
              </DropdownMenuItem>

              <DropdownMenuItem className="lg:hidden">
                <EyeOff />
                Hide All
              </DropdownMenuItem>

              <DropdownMenuItem className="lg:hidden">
                <Eye />
                Show All
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="lg:hidden" />

            <DropdownMenuGroup>
              {/* <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    variant="destructive"
                    onSelect={(e) => e.preventDefault()}
                  >
                    <TrashIcon />
                    Delete All
                  </DropdownMenuItem>
                </AlertDialogTrigger>

                <AlertDialogContent className="bg-background-100">
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="dark:text-neutral-400">
                      This action cannot be <b>undone</b>.<br />
                      This will permanently{" "}
                      <b>
                        delete all buildings, technologies, areas, and trade
                        posts
                      </b>
                      .
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteAll}>
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog> */}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </ButtonGroup>
    </>
  );
}
