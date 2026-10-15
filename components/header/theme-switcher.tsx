"use client";

import * as React from "react";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";

const themes = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

const subscribe = () => () => {};

export function ThemeSwitcher({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  // Le thème stocké n'est connu que côté client : rien n'est surligné avant.
  const mounted = React.useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const current = mounted ? theme : undefined;

  return (
    <fieldset
      className={cn(
        "bg-background flex w-fit items-center gap-1 rounded-lg border p-0.5",
        className,
      )}
    >
      <legend className="sr-only">Select a display theme</legend>
      {themes.map(({ value, label, icon: Icon }) => (
        <label
          key={value}
          className={cn(
            "text-muted-foreground hover:text-foreground has-focus-visible:ring-ring/50 grid h-5 w-6 cursor-pointer place-items-center rounded-md transition-colors has-focus-visible:ring-2",
            current === value && "bg-muted text-foreground",
          )}
        >
          <input
            type="radio"
            name="theme"
            value={value}
            checked={current === value}
            onChange={() => setTheme(value)}
            className="sr-only"
          />
          <span className="sr-only">{label}</span>
          <Icon className="size-3.5" aria-hidden />
        </label>
      ))}
    </fieldset>
  );
}
