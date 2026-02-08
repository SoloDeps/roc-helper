import { useEffect, useState, useMemo } from "react";
import { getAllResources, type UserResource } from "@/lib/roc/rocApi";
import { questsFormatNumber } from "@/lib/shadcn-utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "../ui/badge";

export const UserItemsDisplay = () => {
  const [selectionKits, setSelectionKits] = useState<UserResource[]>([]);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const resources = await getAllResources();
        if (mounted) {
          // Filtrer les selection kits avec amount > 0
          const kits = resources.filter(
            (r) => r.type === "selection_kit" && r.amount > 0,
          );
          setSelectionKits(kits);

          console.log("Selection kits loaded:", kits.length);
        }
      } catch (error) {
        console.error("Error loading items:", error);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  // Calculer le total des RP des kits
  const totalKitsRP = useMemo(() => {
    return selectionKits.reduce((sum, kit) => {
      return sum + kit.amount * (kit.prs || 0);
    }, 0);
  }, [selectionKits]);

  return (
    <ScrollArea className="size-full overflow-y-auto bg-background-200">
      <div className="p-4 pb-16 max-w-[870px] mx-auto">
        <div className="space-y-4">
          {/* Total RP Card - Horizontale */}
          <div className="grid grid-cols-1 lg:grid-cols-8 gap-3">
            <div className="col-span-4 lg:col-start-3">
              <div className="rounded-lg border bg-background-300 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="size-12 rounded-lg bg-blue-500/20 flex items-center justify-center">
                      <img
                        src="/goods/research_points.webp"
                        alt="Research Points"
                        className="size-8"
                        onError={(e) => {
                          e.currentTarget.src = "/goods/default.webp";
                        }}
                      />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold">
                        Total Research Points
                      </h3>
                      <p className="text-xs text-muted-foreground font-bold">
                        From {selectionKits.length} selection kit
                        {selectionKits.length > 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-500">
                      {questsFormatNumber(totalKitsRP)}
                    </div>
                    <div className="text-xs text-muted-foreground">RP</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Selection Kits Grid - Style jeu */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {selectionKits.map((kit, index) => {
              const kitName = kit.id
                .replace(/allianceincident_/gi, "")
                .replace(/research_/gi, "")
                .replace(/_/g, " ")
                .replace(/(\d+) (\d+)/g, "$1-$2");
              const totalRP = kit.amount * (kit.prs || 0);

              return (
                <div
                  key={index}
                  className="relative rounded-lg bg-background-300 border border-alpha-400 p-3 shadow-xs overflow-hidden"
                >
                  {/* Quantity badge top-left */}
                  <Badge
                    variant="outline"
                    className="rounded-sm font-semibold text-[13px] h-6 w-auto bg-background-100"
                  >
                    ×{kit.amount}
                  </Badge>

                  {/* Card content */}
                  <div className="flex flex-col items-center gap-2">
                    <img
                      src={`/inventory/icon_${kit.id}.webp`}
                      alt={kitName}
                      className="w-[72px] h-auto"
                      onError={(e) => {
                        e.currentTarget.src = "/goods/default.webp";
                      }}
                    />

                    {/* Kit name */}
                    <h4 className="text-[13px] font-bold text-center capitalize min-h-8">
                      {kitName}
                    </h4>

                    {/* Stats */}
                    <div className="w-full flex flex-col divide-y gap-1 pt-1 text-[13px]">
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground font-semibold">
                          Per kit:
                        </span>
                        <span className="font-semibold">{kit.prs} RP</span>
                      </div>
                      <div className="flex items-center justify-between ">
                        <span className="text-muted-foreground font-semibold">
                          Total:
                        </span>
                        <span className="font-bold">
                          {questsFormatNumber(totalRP)} RP
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};
