"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import {
  Check,
  CircleUserRound,
  ExternalLink,
  Info,
  Pencil,
  Plus,
  Settings2,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { ThemeSwitcher } from "./theme-switcher";
import {
  MAX_PROFILES,
  PROFILES_STORAGE_KEY,
  PROFILE_NAME_MAX_LENGTH,
  createProfile,
  deleteProfile,
  getServerProfileRegistry,
  readProfileRegistry,
  renameProfile,
  subscribeProfileRegistry,
  switchProfile,
  type Profile,
} from "@/lib/profiles";

function useProfileRegistry() {
  return useSyncExternalStore(
    subscribeProfileRegistry,
    readProfileRegistry,
    getServerProfileRegistry,
  );
}

function trySwitch(id: string) {
  try {
    switchProfile(id);
  } catch (err) {
    console.error("Profile switch failed:", err);
    toast.error("Could not switch profile (browser storage full?)");
  }
}

export function ProfileMenu({ className }: { className?: string }) {
  const { profiles, activeId } = useProfileRegistry();
  const active = profiles.find((p) => p.id === activeId) ?? profiles[0];
  const [dialog, setDialog] = useState<"create" | "manage" | null>(null);

  // Un autre onglet a changé de profil : ses clés localStorage ne sont plus
  // les nôtres — on recharge pour ne pas écrire dans le mauvais profil.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key !== PROFILES_STORAGE_KEY) return;
      if (readProfileRegistry().activeId !== activeId) {
        window.location.reload();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [activeId]);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn("max-w-[90px]", className)}
            aria-label={`Profile: ${active.name}`}
          >
            <CircleUserRound />
            <span className="min-w-0 truncate">{active.name}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="text-muted-foreground text-xs">
            Profiles
          </DropdownMenuLabel>
          {profiles.map((p) => (
            <DropdownMenuItem
              key={p.id}
              onSelect={() => trySwitch(p.id)}
              className="gap-2"
            >
              <Check
                className={cn("size-4", p.id !== activeId && "invisible")}
              />
              <span className="truncate">{p.name}</span>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            disabled={profiles.length >= MAX_PROFILES}
            onSelect={() => setDialog("create")}
          >
            <Plus /> New profile
            <span className="bg-muted text-foreground ml-auto rounded-sm px-2 py-0.5 text-sm font-semibold tabular-nums">
              {profiles.length}/{MAX_PROFILES}
            </span>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setDialog("manage")}>
            <Settings2 /> Manage profiles
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/help">
              <Info /> Help
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <a
              href="https://riseofcultures.wiki.gg/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink /> Wiki
            </a>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <div className="flex items-center justify-between px-2 py-1.5 text-sm">
            <span>Theme</span>
            <ThemeSwitcher />
          </div>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog
        open={dialog === "create"}
        onOpenChange={(o) => !o && setDialog(null)}
      >
        <DialogContent title="New profile">
          {dialog === "create" && (
            <CreateProfileForm count={profiles.length} />
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={dialog === "manage"}
        onOpenChange={(o) => !o && setDialog(null)}
      >
        <DialogContent title="Manage profiles">
          <ManageProfiles profiles={profiles} activeId={activeId} />
        </DialogContent>
      </Dialog>
    </>
  );
}

const inputCls =
  "border-input dark:bg-input/30 h-9 w-full min-w-0 rounded-md border bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]";

function CreateProfileForm({ count }: { count: number }) {
  const [name, setName] = useState("");

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(e) => {
        e.preventDefault();
        try {
          const profile = createProfile(name || `Profile ${count + 1}`);
          trySwitch(profile.id);
        } catch {
          toast.error(`You can have up to ${MAX_PROFILES} profiles`);
        }
      }}
    >
      <div className="flex flex-col gap-1">
        <p className="font-semibold">New profile</p>
        <p className="text-muted-foreground">
          Each profile keeps its own buildings, technologies, campaign, wonders
          and vaults. Everything stays in this browser.
        </p>
      </div>
      <input
        autoFocus
        className={inputCls}
        placeholder={`Profile ${count + 1}`}
        maxLength={PROFILE_NAME_MAX_LENGTH}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <Button type="submit">Create and switch</Button>
    </form>
  );
}

function ManageProfiles({
  profiles,
  activeId,
}: {
  profiles: Profile[];
  activeId: string;
}) {
  const [newId, setNewId] = useState<string | null>(null);
  const emptySlots = Math.max(0, MAX_PROFILES - profiles.length);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <p className="font-semibold">
          Manage profiles
          <span className="bg-muted text-foreground ml-2 rounded-sm px-2 py-0.5 text-sm font-semibold tabular-nums">
            {profiles.length}/{MAX_PROFILES}
          </span>
        </p>
        <p className="text-muted-foreground">
          The active profile can&apos;t be deleted — switch to another one
          first.
        </p>
      </div>
      <ul className="flex flex-col gap-2">
        {profiles.map((p) => (
          <ProfileRow
            key={p.id}
            profile={p}
            isActive={p.id === activeId}
            startEditing={p.id === newId}
          />
        ))}
        {Array.from({ length: emptySlots }, (_, i) => (
          <li key={`empty-${i}`}>
            <button
              type="button"
              className="text-muted-foreground hover:bg-accent hover:text-accent-foreground flex h-11 w-full items-center justify-center gap-2 rounded-md border border-dashed px-3 text-sm transition-colors"
              onClick={() => {
                try {
                  setNewId(createProfile(`Profile ${profiles.length + 1}`).id);
                } catch {
                  toast.error(`You can have up to ${MAX_PROFILES} profiles`);
                }
              }}
            >
              <Plus className="size-4" /> Create profile
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function ProfileRow({
  profile,
  isActive,
  startEditing = false,
}: {
  profile: Profile;
  isActive: boolean;
  startEditing?: boolean;
}) {
  const [editing, setEditing] = useState(startEditing);
  const [name, setName] = useState(profile.name);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const cancelled = useRef(false);

  if (editing) {
    return (
      <li className="focus-within:border-ring focus-within:ring-ring/50 flex h-11 items-center rounded-md border px-3 focus-within:ring-[3px]">
        {/* Entrée ou perte de focus = sauvegarde ; Échap = annule. */}
        <input
          autoFocus
          className="h-full w-full min-w-0 bg-transparent text-sm outline-none"
          aria-label={`Name of ${profile.name}`}
          maxLength={PROFILE_NAME_MAX_LENGTH}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onFocus={(e) => e.currentTarget.select()}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              e.currentTarget.blur();
            } else if (e.key === "Escape") {
              // Évite que Radix ferme la modale
              e.stopPropagation();
              cancelled.current = true;
              e.currentTarget.blur();
            }
          }}
          onBlur={() => {
            if (!cancelled.current && name.trim() !== profile.name) {
              renameProfile(profile.id, name);
            }
            cancelled.current = false;
            setEditing(false);
          }}
        />
      </li>
    );
  }

  return (
    <li className="flex h-11 items-center gap-2 rounded-md border px-3">
      <span className="flex-1 truncate">
        {profile.name}
        {isActive && (
          <span className="text-muted-foreground ml-2 text-xs">(active)</span>
        )}
      </span>
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={`Rename ${profile.name}`}
        onClick={() => {
          setName(profile.name);
          setEditing(true);
        }}
      >
        <Pencil />
      </Button>
      {!isActive &&
        (confirmDelete ? (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => {
              deleteProfile(profile.id).catch((err) => {
                console.error("Profile deletion failed:", err);
                toast.error("Could not delete profile data");
              });
            }}
            onBlur={() => setConfirmDelete(false)}
          >
            Delete?
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Delete ${profile.name}`}
            onClick={() => setConfirmDelete(true)}
          >
            <Trash2 />
          </Button>
        ))}
    </li>
  );
}
