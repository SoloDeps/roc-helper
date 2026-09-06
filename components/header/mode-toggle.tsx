"use client"

import { Moon, Sun } from "lucide-react";
import * as React from "react"
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";

export function ModeToggle() {
  const { setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = React.useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark")
  }, [resolvedTheme, setTheme])

  // Avant le montage côté client, resolvedTheme n'est pas encore connu
  // (il dépend du script anti-flash exécuté après hydratation) : on rend
  // un état neutre identique au SSR pour éviter le mismatch d'hydratation.
  if (!mounted) {
    return (
      <Button size="sm" variant="outline" disabled>
        <Moon /> Dark
      </Button>
    );
  }

  return (
    <Button size="sm" variant="outline" onClick={toggleTheme}>
      {resolvedTheme === "light" ? (
        <><Sun /> Light</>
      ) : (
        <><Moon /> Dark</>
      )}
    </Button>
  );
}