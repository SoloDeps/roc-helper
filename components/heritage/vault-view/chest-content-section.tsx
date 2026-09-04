import {
  getUnlockedEffects,
  resolveChestRewards,
  type ResolvedChestReward,
  type ResolvedHeritageVault,
} from "@/resolvers/heritage";
import { EffectIcon } from "@/components/heritage/effect-icon";
import { chestRewardIcon } from "@/components/heritage/effect-display";
import { ChestRewardRow } from "./chest-reward-row";

const CONTAINER_KINDS = new Set(["group", "mysteryChest", "lootContainer"]);

/**
 * Un effet n'a un « coffre » à montrer que si sa donnée en emballe un : au
 * moins une racine de `tier.rewards[]` (AVANT tout déballage) est un DTO
 * conteneur (`group`/`mysteryChest`/`lootContainer`). Sans ça, c'est une
 * récompense directe et garantie (ex. `ProductionType_UNIT` d'un effet
 * Aztec qui produit des crocodiles) — jamais posée dans un coffre, donc
 * jamais dans « Chest content ».
 *
 * Vérifié sur toute l'extraction : un palier de récompense est soit 100%
 * conteneur (64/65), soit 100% récompense nue (1/65, le crocodile) — aucun
 * ne mélange les deux, donc ce test au premier niveau suffit.
 */
function isChestShaped(rewards: ResolvedChestReward[]): boolean {
  return rewards.some((node) => CONTAINER_KINDS.has(node.kind));
}

/**
 * Les nœuds `group` / `mysteryChest` en tête d'arbre ne portent ni tirage ni
 * récompense : ils emballent le coffre. Les afficher ajouterait deux niveaux
 * d'indentation vides, donc on descend jusqu'au premier niveau qui tire.
 */
function unwrap(rewards: ResolvedChestReward[]): ResolvedChestReward[] {
  if (rewards.length !== 1) return rewards;
  const [only] = rewards;
  if (only.chancePercent !== null || only.children.length === 0) return rewards;
  return unwrap(only.children);
}

/**
 * Le contenu de tous les coffres débloqués au niveau courant.
 *
 * Indépendant de l'équipement : dès qu'un palier donnant un coffre est atteint,
 * ses tirages restent visibles et suivent le sélecteur de niveau.
 */
export function ChestContentSection({
  vault,
  selections,
}: {
  vault: ResolvedHeritageVault;
  selections: string[][];
}) {
  const chests = getUnlockedEffects(vault).flatMap((effect) => {
    const raw = resolveChestRewards(effect.rewards, vault.level, vault.era);
    if (!isChestShaped(raw)) return [];
    const rewards = unwrap(raw);
    // L'icône vient du conteneur RACINE (`raw`), avant `unwrap` : c'est lui qui
    // porte la famille du coffre (cf. `CHEST_ICON_BY_FAMILY`). Prise après
    // déballage, elle rendrait l'icône du premier LOT, pas celle du coffre.
    const icon = chestRewardIcon(raw[0], selections);
    return rewards.length === 0 ? [] : [{ id: effect.id, icon, rewards }];
  });

  if (chests.length === 0) return null;

  return (
    <>
      <hr className="my-2.5 border-border" />
      <div>
        <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
          Chest content
        </p>
        {/*
          ⚠️ UN CADRE PAR COFFRE, PAS UN SIMPLE ÉCART.
          Un vault peut débloquer DEUX coffres (Mali : RP+personnalisation et
          nourriture+recharge). Empilés en une seule colonne, leurs lignes se
          lisaient comme un unique tirage — et les probabilités de deux coffres
          distincts s'additionnaient à l'œil bien au-delà de 100 %. Chaque
          coffre a donc sa boîte, avec son icône en tête : c'est elle qui dit à
          QUEL coffre appartiennent les lignes en dessous.
        */}
        <div className="flex flex-col gap-2.5">
          {chests.map((chest, index) => (
            <div
              key={chest.id}
              className="flex flex-col gap-1.5 rounded-lg border border-border bg-background-200 p-2"
            >
              <div className="flex items-center gap-1.5">
                <EffectIcon src={chest.icon} alt="" size={18} />
                <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {chests.length > 1 ? `Chest ${index + 1}` : "Chest"}
                </span>
              </div>
              {chest.rewards.map((reward, i) => (
                <ChestRewardRow
                  key={`${reward.definitionId ?? reward.kind}-${i}`}
                  reward={reward}
                  selections={selections}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
