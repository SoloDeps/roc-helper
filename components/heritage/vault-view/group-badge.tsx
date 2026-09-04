import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { HeritageEffectGroup } from "@/data/heritage/generated/types";
import { GROUP_BADGE_CLASS, GROUP_LABELS } from "./constants";

export function GroupBadge({ group }: { group: HeritageEffectGroup }) {
  return (
    <Badge variant="outline" className={cn(GROUP_BADGE_CLASS[group], "text-[11px]")}>
      {GROUP_LABELS[group]}
    </Badge>
  );
}
