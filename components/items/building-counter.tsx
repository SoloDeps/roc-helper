import { MinusIcon, PlusIcon, Edit2 } from "lucide-react";
import { useState, useCallback, useRef, useEffect } from "react";
import { Button, Group, NumberField } from "react-aria-components";
import { Button as ShadcnButton } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { QtySlider } from "@/components/modals/add-element/quantity-slider";

interface BuildingCounterProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
  /**
   * Remplace la zone d'affichage centrale — un `<div>` en lecture seule — par
   * un vrai `<input>` : les +/- restent, mais la valeur devient tapable
   * directement. Réservé aux compteurs dont la valeur peut devenir trop
   * grande pour cliquer dessus à coups de +/- (ex. un nombre d'échanges sur
   * plusieurs semaines). `false` par défaut : ne change aucun appel existant.
   */
  allowTypedInput?: boolean;
  /** Libellé accessible du champ. `"Building quantity"` par défaut. */
  ariaLabel?: string;
  /**
   * Texte COURT affiché sur le bouton du tiroir mobile — `ariaLabel` reste le
   * nom accessible du champ (annoncé aux lecteurs d'écran, repris dans le
   * titre du tiroir), mais un `ariaLabel` descriptif (« Research points
   * exchanges ») déborde une fois posé en VISIBLE sur un bouton étroit, en
   * pleine largeur au milieu d'une grille de 4 cartes. `"Quantity"` par
   * défaut — même mot générique que le compteur non tapable, le contexte
   * (l'icône et le nom au-dessus, dans la carte) suffit à savoir de quoi il
   * s'agit sans le répéter ici.
   */
  triggerLabel?: string;
}

/**
 * Custom hook for debounced value updates
 */
function useDebouncedCallback<T extends (...args: any[]) => void>(
  callback: T,
  delay: number,
): T {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const debouncedCallback = useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay],
  ) as T;

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
}

/**
 * Mobile Quantity Drawer with debounced slider
 *
 * ⚠️ `allowTypedInput` VAUT ICI AUSSI. Un compteur dont la valeur peut devenir
 * grande (la cible de l'optimiseur d'héritage) est INSAISISSABLE au curseur
 * seul : sa course couvre toute la plage, donc un pixel vaut des milliers
 * d'unités. Le clavier devient alors le moyen principal, et le curseur l'appoint
 * — l'inverse du compteur de bâtiments, qui va de 1 à quelques dizaines.
 *
 * Le libellé du tiroir suit `ariaLabel` : « Adjust Quantity » sur un compteur de
 * bâtiments, « Target Goods » sur une cible — le tiroir doit dire ce qu'on règle.
 */
function MobileQuantityDrawer({
  value,
  onChange,
  min = 1,
  max = 999,
  disabled = false,
  allowTypedInput = false,
  ariaLabel = "Building quantity",
  triggerLabel = "Quantity",
}: BuildingCounterProps) {
  const [open, setOpen] = useState(false);
  const [localValue, setLocalValue] = useState(value);
  // Le texte tapé vit à part du nombre : un champ vidé pour être retapé n'est
  // pas « 0 », et le retranscrire en nombre à chaque frappe empêcherait
  // d'effacer le premier chiffre.
  const [typed, setTyped] = useState<string | null>(null);

  // Sync local value when prop changes (e.g., from external updates)
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Debounced callback for the actual onChange
  const debouncedOnChange = useDebouncedCallback(onChange, 300);

  const handleSliderChange = useCallback(
    (newValue: number) => {
      setLocalValue(newValue);
      setTyped(null);
      debouncedOnChange(newValue);
    },
    [debouncedOnChange],
  );

  // ⚠️ LA FRAPPE N'EST PAS DIFFÉRÉE, le curseur si. Deux gestes, deux régimes :
  // un curseur qu'on traîne émet des dizaines de valeurs dont une seule compte,
  // une frappe en émet une et elle compte. Reporter la seconde faisait répondre
  // la page à un nombre que l'écran n'affichait plus (cf. `TypedCounter`).
  const handleTyped = useCallback(
    (raw: string) => {
      const digits = raw.replace(/[^0-9]/g, "");
      if (digits === "") {
        setTyped("");
        return;
      }
      const next = Math.min(Math.max(Number(digits), min), max);
      setTyped(String(next));
      setLocalValue(next);
      onChange(next);
    },
    [onChange, min, max],
  );

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <ShadcnButton
          variant="outline"
          disabled={disabled}
          aria-label={allowTypedInput ? ariaLabel : undefined}
          className="gap-3"
        >
          <span className="truncate">{allowTypedInput ? triggerLabel : "Quantity:"}</span>
          <span className="tabular-nums">{value}</span>
          <Edit2 className="size-3.5" />
        </ShadcnButton>
      </DrawerTrigger>

      <DrawerContent className="h-[35vh] p-0">
        <DrawerHeader className="border-b border-alpha-400 py-1 px-4">
          <DrawerTitle className="text-center">
            {allowTypedInput ? ariaLabel : "Adjust Quantity"}
          </DrawerTitle>
        </DrawerHeader>

        <div className="flex-1 px-2 pt-3 pb-6 flex flex-col justify-center gap-6">
          {/* Display current value - shows local value for instant feedback */}
          <div className="text-center">
            {allowTypedInput ? (
              <input
                // `inputMode` et non `type="number"` : le clavier numérique du
                // téléphone sans les flèches ni le défilement à la molette.
                inputMode="numeric"
                pattern="[0-9]*"
                autoComplete="off"
                aria-label={ariaLabel}
                value={typed ?? String(localValue)}
                onChange={(event) => handleTyped(event.target.value)}
                onBlur={() => setTyped(null)}
                className="mx-auto block w-full max-w-56 rounded-lg border border-input bg-background-100 px-3 py-2 text-center text-4xl font-bold tabular-nums outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            ) : (
              <div className="text-4xl font-bold tabular-nums">{localValue}</div>
            )}
            <div className="text-[15px] font-medium text-muted-foreground mt-1">
              Max: {max}
            </div>
          </div>

          {/* Slider with debounced updates, flanked by +/- for oversized fingers
              that can't land precisely on the slider thumb — a one-step nudge
              that doesn't require the keyboard either. */}
          <div className="flex items-center gap-3 px-2">
            <ShadcnButton
              type="button"
              variant="outline"
              size="icon"
              aria-label={`Decrease ${ariaLabel}`}
              disabled={disabled || localValue <= min}
              onClick={() => handleSliderChange(Math.max(localValue - 1, min))}
              className="shrink-0"
            >
              <MinusIcon aria-hidden="true" className="size-4" />
            </ShadcnButton>

            <div className="flex-1">
              <QtySlider
                value={localValue}
                min={min}
                max={max}
                onChange={handleSliderChange}
              />
            </div>

            <ShadcnButton
              type="button"
              variant="outline"
              size="icon"
              aria-label={`Increase ${ariaLabel}`}
              disabled={disabled || localValue >= max}
              onClick={() => handleSliderChange(Math.min(localValue + 1, max))}
              className="shrink-0"
            >
              <PlusIcon aria-hidden="true" className="size-4" />
            </ShadcnButton>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

/**
 * Répétition en maintenant le bouton +/- enfoncé — ce que `NumberField`
 * (react-aria) offre déjà nativement à `DesktopCounter`, mais que
 * `TypedCounter` n'a jamais eu : ses boutons sont de simples `<button
 * onClick>`, qui ne tirent qu'une fois par clic. Sur un compteur qui va
 * jusqu'à plusieurs milliers (le nombre d'échanges du gardien, entre autres),
 * cliquer un par un est hors de question — d'où ce hook, spécifique à ce
 * compteur.
 *
 * `onStep` est lu depuis une ref à CHAQUE tick plutôt que capturé une fois :
 * l'intervalle est démarré au premier `pointerdown` et vit plusieurs
 * rendus, sans quoi il rejouerait indéfiniment la même valeur de départ au
 * lieu d'avancer d'un cran par tick.
 */
const HOLD_REPEAT_DELAY_MS = 400;
const HOLD_REPEAT_INTERVAL_MS = 70;

function useHoldRepeat(onStep: () => void, disabled: boolean) {
  const stepRef = useRef(onStep);
  useEffect(() => {
    stepRef.current = onStep;
  }, [onStep]);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  /** Vrai dès que la répétition a tiré au moins une fois — pour éviter que le
   *  `click` natif émis au relâchement du bouton n'ajoute un pas de trop
   *  après une série déjà avancée par l'intervalle. */
  const repeatedRef = useRef(false);

  const stop = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (intervalRef.current) clearInterval(intervalRef.current);
    timeoutRef.current = null;
    intervalRef.current = null;
  }, []);

  const start = useCallback(() => {
    if (disabled) return;
    stop();
    repeatedRef.current = false;
    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        repeatedRef.current = true;
        stepRef.current();
      }, HOLD_REPEAT_INTERVAL_MS);
    }, HOLD_REPEAT_DELAY_MS);
  }, [disabled, stop]);

  useEffect(() => stop, [stop]);

  return {
    onPointerDown: start,
    onPointerUp: stop,
    onPointerLeave: stop,
    onPointerCancel: stop,
    /** À appeler en tête du handler `onClick` : avale le clic de relâchement
     *  qui suit une répétition déjà avancée, laisse passer un simple clic. */
    consumeTrailingClick: () => {
      const wasRepeating = repeatedRef.current;
      repeatedRef.current = false;
      return wasRepeating;
    },
  };
}

/** Les trois classes du groupe +/-, partagées par les deux compteurs desktop. */
const GROUP_CLASS =
  "relative inline-flex h-9 items-center overflow-hidden whitespace-nowrap rounded-md border border-input text-sm shadow-sm";
const STEP_CLASS =
  "flex aspect-square h-[inherit] items-center justify-center bg-background-300 text-muted-foreground hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 transition-colors";
const FIELD_CLASS =
  "h-[inherit] w-16 border-0 bg-background-100 text-center font-medium tabular-nums outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none";

/**
 * Le compteur TAPABLE du desktop.
 *
 * ⚠️ POURQUOI IL NE PASSE PAS PAR `NumberField`, ET POURQUOI IL N'EST PAS
 * DIFFÉRÉ. Le champ react-aria ne remonte sa valeur qu'au FLOU ou à Entrée ;
 * ajouté aux 300 ms de report, l'écran affichait une valeur et le reste de la
 * page répondait encore à la précédente — sans rien qui le signale. Sur
 * l'optimiseur d'héritage, ça allait jusqu'à afficher « cible déjà atteinte »
 * sous une cible que la configuration n'atteignait pas.
 *
 * La valeur part donc à CHAQUE frappe. C'est tenable parce que ce qui la
 * consomme est redevenu rapide (~26 ms) : différer protégeait un calcul qui
 * coûtait une seconde, il n'existe plus.
 *
 * Le texte tapé vit à part du nombre : un champ vidé pour être retapé n'est pas
 * « 0 ». Et une saisie au-dessus du plafond est RÉÉCRITE plutôt que seulement
 * bornée en silence — sans quoi le champ afficherait 9 000 pendant que la page
 * répond pour 1 425, exactement la divergence qu'on vient de supprimer.
 */
function TypedCounter({
  value,
  onChange,
  min = 0,
  max = 999,
  disabled = false,
  ariaLabel = "Building quantity",
}: BuildingCounterProps) {
  const [typed, setTyped] = useState<string | null>(null);
  const clamp = useCallback(
    (raw: number) => Math.min(Math.max(raw, min), max),
    [min, max],
  );

  const commit = useCallback(
    (next: number) => {
      setTyped(null);
      onChange(clamp(next));
    },
    [clamp, onChange],
  );

  // `value` change à chaque pas, donc chaque rendu recrée ces deux callbacks —
  // c'est voulu : `useHoldRepeat` relit `onStep` à chaque tick via une ref, si
  // bien que l'intervalle avance toujours depuis la DERNIÈRE valeur commitée,
  // jamais depuis celle du `pointerdown` initial.
  const decrementHold = useHoldRepeat(() => commit(value - 1), disabled || value <= min);
  const incrementHold = useHoldRepeat(() => commit(value + 1), disabled || value >= max);

  return (
    <div className={GROUP_CLASS}>
      <button
        type="button"
        aria-label={`Decrease ${ariaLabel}`}
        disabled={disabled || value <= min}
        onPointerDown={decrementHold.onPointerDown}
        onPointerUp={decrementHold.onPointerUp}
        onPointerLeave={decrementHold.onPointerLeave}
        onPointerCancel={decrementHold.onPointerCancel}
        onClick={() => {
          if (decrementHold.consumeTrailingClick()) return;
          commit(value - 1);
        }}
        className={`${STEP_CLASS} border-r border-input`}
      >
        <MinusIcon aria-hidden="true" size={18} />
      </button>

      <input
        // `inputMode` plutôt que `type="number"` : pas de flèches natives, pas
        // de défilement à la molette qui change la valeur par accident.
        inputMode="numeric"
        pattern="[0-9]*"
        autoComplete="off"
        aria-label={ariaLabel}
        disabled={disabled}
        value={typed ?? String(value)}
        onChange={(event) => {
          const digits = event.target.value.replace(/[^0-9]/g, "");
          if (digits === "") {
            setTyped("");
            return;
          }
          const next = clamp(Number(digits));
          setTyped(String(next));
          onChange(next);
        }}
        onBlur={() => setTyped(null)}
        className={FIELD_CLASS}
      />

      <button
        type="button"
        aria-label={`Increase ${ariaLabel}`}
        disabled={disabled || value >= max}
        onPointerDown={incrementHold.onPointerDown}
        onPointerUp={incrementHold.onPointerUp}
        onPointerLeave={incrementHold.onPointerLeave}
        onPointerCancel={incrementHold.onPointerCancel}
        onClick={() => {
          if (incrementHold.consumeTrailingClick()) return;
          commit(value + 1);
        }}
        className={`${STEP_CLASS} border-l border-input`}
      >
        <PlusIcon aria-hidden="true" size={18} />
      </button>
    </div>
  );
}

/**
 * Desktop Counter with debounced updates
 */
function DesktopCounter({
  value,
  onChange,
  min = 1,
  max = 999,
  disabled = false,
  ariaLabel = "Building quantity",
}: BuildingCounterProps) {
  const [localValue, setLocalValue] = useState(value);

  // Sync local value when prop changes (e.g., from external updates)
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const debouncedOnChange = useDebouncedCallback(onChange, 300);

  const handleChange = useCallback(
    (newValue: number) => {
      setLocalValue(newValue);
      debouncedOnChange(newValue);
    },
    [debouncedOnChange],
  );

  return (
    <NumberField
      value={localValue}
      onChange={handleChange}
      minValue={min}
      maxValue={max}
      isDisabled={disabled}
      aria-label={ariaLabel}
    >
      <Group className="relative inline-flex h-9 items-center overflow-hidden whitespace-nowrap rounded-md border border-input text-sm shadow-sm">
        <Button
          slot="decrement"
          className="flex aspect-square h-[inherit] items-center justify-center border-r border-input bg-background-300 text-muted-foreground hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
        >
          <MinusIcon aria-hidden="true" size={18} />
        </Button>

        <div className="flex items-center justify-center size-9 px-2 bg-background-100 text-center font-medium tabular-nums select-none">
          {localValue}
        </div>

        <Button
          slot="increment"
          className="flex aspect-square h-[inherit] items-center justify-center border-l border-input bg-background-300 text-muted-foreground hover:bg-accent hover:text-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
        >
          <PlusIcon aria-hidden="true" size={18} />
        </Button>
      </Group>
    </NumberField>
  );
}

/**
 * Main BuildingCounter - Responsive
 */
export default function BuildingCounter({
  value,
  onChange,
  min = 1,
  max = 999,
  disabled = false,
  allowTypedInput = false,
  ariaLabel,
  triggerLabel,
}: BuildingCounterProps) {
  const isMobile = useMediaQuery("(max-width: 767px)");

  if (isMobile) {
    return (
      <MobileQuantityDrawer
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        disabled={disabled}
        allowTypedInput={allowTypedInput}
        ariaLabel={ariaLabel}
        triggerLabel={triggerLabel}
      />
    );
  }

  // Tapable : un compteur à part, qui remonte la valeur à chaque frappe plutôt
  // qu'au flou (cf. `TypedCounter`). Les compteurs de bâtiments, eux, gardent
  // le champ react-aria et son report — on n'y tape pas, on y clique.
  if (allowTypedInput) {
    return (
      <TypedCounter
        value={value}
        onChange={onChange}
        min={min}
        max={max}
        disabled={disabled}
        ariaLabel={ariaLabel}
      />
    );
  }

  return (
    <DesktopCounter
      value={value}
      onChange={onChange}
      min={min}
      max={max}
      disabled={disabled}
      ariaLabel={ariaLabel}
    />
  );
}
