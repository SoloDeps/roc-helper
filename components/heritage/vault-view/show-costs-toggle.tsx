import { Switch } from "@/components/ui/switch";

export function ShowCostsToggle({
  checked,
  onCheckedChange,
}: {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex shrink-0 items-center gap-2">
      <Switch
        id="show-costs"
        checked={checked}
        onCheckedChange={onCheckedChange}
        aria-label="Show costs"
      />
      <label
        htmlFor="show-costs"
        className="cursor-pointer select-none text-[11px] font-semibold uppercase tracking-widest text-muted-foreground"
      >
        Costs
      </label>
    </div>
  );
}
