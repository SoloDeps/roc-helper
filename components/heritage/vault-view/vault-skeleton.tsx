import { LoaderCircle } from "lucide-react";

export function HeritageVaultSkeleton() {
  return (
    <div className="container-wrapper flex min-h-0 flex-1 items-center justify-center">
      <LoaderCircle className="size-7 animate-spin text-muted-foreground" />
    </div>
  );
}
