"use client";

import { useEffect, useRef } from "react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils";
import { VISIBLE_HERITAGE_TABS, type HeritageTab } from "./constants";

// ============================================================
// Barre d'onglets de la page /vault.
//
// Collante sous l'en-tête du site (50 px) : sur mobile, la page défile
// longtemps et perdre la navigation en haut de page oblige à remonter à chaque
// changement d'onglet.
//
// Elle déborde horizontalement sur écran étroit — cinq onglets ne tiennent pas
// dans 375 px. Deux détails règlent ce qui rendait le débordement pénible :
// l'onglet actif est ramené dans le champ à chaque changement (sinon
// « Level Table », dernier de la liste, restait invisible après sa propre
// sélection), et un dégradé à droite signale qu'il reste des onglets à
// atteindre plutôt que de les couper net.
//
// ⚠️ VRAIS ONGLETS, PAS CINQ BOUTONS. Sans `tablist`/`tab`/`tabpanel`, un
// lecteur d'écran annonce cinq boutons quelconques : ni « onglet 2 sur 5 », ni
// lequel est sélectionné, ni le lien avec le panneau affiché.
//
// Et le motif ARIA se prend en ENTIER ou pas du tout : une barre qui s'annonce
// comme des onglets se pilote aux flèches, un seul onglet est atteignable à la
// tabulation (`tabIndex` glissant), et Tab saute de la barre au contenu. Poser
// les rôles sans le clavier remplacerait une gêne par une promesse non tenue.
// ============================================================

/** L'`id` du bouton d'un onglet — cible d'`aria-labelledby` côté panneau. */
export function heritageTabId(tab: HeritageTab) {
  return `heritage-tab-${tab}`;
}

/** L'`id` du panneau d'un onglet — cible d'`aria-controls` côté bouton. */
export function heritageTabPanelId(tab: HeritageTab) {
  return `heritage-panel-${tab}`;
}

export function VaultTabs({
  activeTab,
  onTabChange,
}: {
  activeTab: HeritageTab;
  onTabChange: (tab: HeritageTab) => void;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeTab]);

  /**
   * Flèches, Origine et Fin — la navigation attendue d'une barre d'onglets.
   *
   * Elle SÉLECTIONNE en se déplaçant (`activation automatique`), le motif
   * recommandé quand changer d'onglet ne coûte rien : ici tout est déjà en
   * mémoire, il n'y a aucune requête à déclencher. Le focus suit la sélection
   * parce que le bouton visé devient le seul de la barre à être atteignable.
   */
  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const offset =
      event.key === "ArrowRight" ? 1 : event.key === "ArrowLeft" ? -1 : 0;
    let next: HeritageTab | null = null;
    if (offset !== 0) {
      const index = VISIBLE_HERITAGE_TABS.findIndex((tab) => tab.value === activeTab);
      const count = VISIBLE_HERITAGE_TABS.length;
      next = VISIBLE_HERITAGE_TABS[(index + offset + count) % count].value;
    } else if (event.key === "Home") {
      next = VISIBLE_HERITAGE_TABS[0].value;
    } else if (event.key === "End") {
      next = VISIBLE_HERITAGE_TABS[VISIBLE_HERITAGE_TABS.length - 1].value;
    }
    if (next === null) return;
    event.preventDefault();
    onTabChange(next);
    // Le `tabIndex` glissant n'est appliqué qu'au rendu suivant : on redonne le
    // focus après, sinon il resterait sur un bouton devenu inatteignable.
    requestAnimationFrame(() => activeRef.current?.focus());
  };

  return (
    <div className="sticky top-[50px] z-30 -mx-2 mb-4 bg-background-200 sm:-mx-4 lg:relative lg:top-auto lg:z-auto lg:mx-0 lg:mb-6 lg:bg-transparent">
      <div className="relative">
        <nav
          ref={scrollerRef}
          role="tablist"
          aria-label="Heritage vault sections"
          onKeyDown={onKeyDown}
          className="no-scrollbar flex overflow-x-auto border-b border-border px-2 sm:px-4 lg:px-0"
        >
          {VISIBLE_HERITAGE_TABS.map((tab) => (
            <button
              key={tab.value}
              ref={tab.value === activeTab ? activeRef : undefined}
              type="button"
              role="tab"
              id={heritageTabId(tab.value)}
              aria-controls={heritageTabPanelId(tab.value)}
              aria-selected={activeTab === tab.value}
              // Un seul onglet dans l'ordre de tabulation : Tab entre dans la
              // barre, puis en sort vers le contenu — ce sont les flèches qui
              // circulent entre les onglets.
              tabIndex={activeTab === tab.value ? 0 : -1}
              onClick={() => onTabChange(tab.value)}
              className={cn(
                "relative shrink-0 cursor-pointer whitespace-nowrap px-3.5 py-3 text-sm font-medium transition-colors duration-150 lg:px-4 lg:py-2.5",
                activeTab === tab.value
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {tab.label}
              {activeTab === tab.value && (
                <motion.div
                  layoutId="heritage-tab-underline"
                  className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-primary"
                  transition={{ type: "spring", stiffness: 400, damping: 40 }}
                />
              )}
            </button>
          ))}
        </nav>
        {/* Voile de bord — purement décoratif, ne doit jamais avaler un clic. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background-200 to-transparent lg:hidden"
        />
      </div>
    </div>
  );
}
