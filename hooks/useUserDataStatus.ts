import { useEffect, useState } from "react";
import { watchUserResources, type UserResource } from "@/lib/roc/rocApi";

export interface UserDataStatus {
  hasRealData: boolean;
  loading: boolean;
  totalNonZeroResources: number;
  totalNonZeroKits: number;
}

/**
 * Hook pour détecter si l'utilisateur a des données réelles (montants > 0)
 * S'abonne aux changements en temps réel via watchUserResources
 */
export function useUserDataStatus(): UserDataStatus {
  const [status, setStatus] = useState<UserDataStatus>({
    hasRealData: false,
    loading: true,
    totalNonZeroResources: 0,
    totalNonZeroKits: 0,
  });

  useEffect(() => {
    // S'abonner aux changements de ressources en temps réel
    const unwatch = watchUserResources((resources: UserResource[]) => {
      // Compter les ressources non-zéro (hors selection_kits)
      const nonZeroResources = resources.filter(
        (r) => r.type !== "selection_kit" && r.amount > 0,
      );

      // Compter les selection kits non-zéro
      const nonZeroKits = resources.filter(
        (r) => r.type === "selection_kit" && r.amount > 0,
      );

      const hasRealData = nonZeroResources.length > 0 || nonZeroKits.length > 0;

      setStatus({
        hasRealData,
        loading: false,
        totalNonZeroResources: nonZeroResources.length,
        totalNonZeroKits: nonZeroKits.length,
      });

      console.log("[useUserDataStatus] Status updated:", {
        hasRealData,
        nonZeroResources: nonZeroResources.length,
        nonZeroKits: nonZeroKits.length,
      });
    });

    // Cleanup - watchUserResources retourne une fonction de cleanup
    return () => {
      unwatch();
    };
  }, []);

  return status;
}
