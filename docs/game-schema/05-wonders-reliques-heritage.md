# Domaine : Wonders / Reliques / HeritageVault

Types couverts : `ReworkedWonderDefinitionDTO` (28), `WonderDynamicCostDefinitionDTO` (8),
`WonderCollectionDefinitionDTO` (3), `RelicDefinitionDTO` (45), `RelicCollectionDefinitionDTO` (8),
`HeritageVaultDefinitionDTO` (13). **105 entités, 2,1 Mo.**
Prérequis : [`00-conventions.md`](00-conventions.md), [`02-dynamic.md`](02-dynamic.md),
[`01-socle.md`](01-socle.md) §5 (Boosts).

> **§2 est la section à lire en priorité** : elle décrit les mécaniques de composition de boosts et
> signale les endroits où un modèle plausible peut diverger des données.

---

## 1. Vue d'ensemble

Trois sous-systèmes distincts, reliés seulement par le fait qu'ils produisent des boosts :

| Sous-système | Entités | Niveau max | Source du plafond |
|---|---|---|---|
| Wonders | 28 + 8 coûts + 3 collections | **30** | `ConstantsDefinition.wonders.maximumWonderLevel` |
| HeritageVault | 13 | **60** | `HeritageVaultDefinition.maxLevel` (13/13) |
| Reliques | 45 + 8 collections | — | pas de niveau |

✅ **Cohérence confirmée par recoupement.** Les 8 définitions dynamiques indexées par niveau et
attachées à un wonder ont **exactement 30 clés, `when` de 1 à 30** — ce qui coïncide avec
`maximumWonderLevel = 30`. Les `WonderDynamicCostDefinitionDTO` en ont **29** (les 29 montées de
niveau de 1 à 30). C'est la confirmation définitive que le `valueLimit = 60` des tables dynamiques
ne concerne pas les wonders (cf. `02-dynamic.md` §5.2) : les tables de wonder ne portent aucun
`valueLimit` et s'arrêtent naturellement à 30.

---

## 2. ⚠️ Mécaniques de composition de boosts

C'est le point sensible du domaine. **Trois schémas différents coexistent**, portés parfois par le
même DTO, et aucun n'est déclaré explicitement dans les données.

### 2.1 Schéma A — `modifier` × valeur dynamique (wonders)

Sur les wonders, `BoostResourceComponentDTO` et `BoostUnitStatComponentDTO` portent **deux champs
qui doivent être combinés** :

```ts
{
  modifier: 0.01,                                       // float
  dynamicModifiedFloatDefinitionId: "Dv_Wonder_Generic_ResourceBoost_1"
}
```

Courbe complète de `Dv_Wonder_Generic_ResourceBoost_1` (30 clés, niveaux 1→30) :

```
niveau  1   2   3    4    5    6    7    8   …  15   …  20   …  30
valeur 10  13  15  16.5   18 19.5 20.5   22   …  28   …  31   … 36.5
```

⚠️ **Ni `modifier` seul ni la valeur dynamique seule n'est le boost effectif.** `modifier = 0.01`
n'est pas un bonus de 1 % : c'est un **facteur d'échelle** qui convertit la valeur dynamique
(exprimée en points de pourcentage) en fraction. Le produit donne 10 % au niveau 1 → 36,5 % au
niveau 30.

> ➡️ **Point à vérifier empiriquement.** Une implémentation qui lirait `modifier` comme le bonus
> donnerait 1 % constant ; une qui lirait la valeur dynamique donnerait 1000 %. Seul le produit
> `modifier × dynamicValue(niveau)` est cohérent avec l'échelle attendue. **Les données ne déclarent
> nulle part que l'opérateur est une multiplication** — c'est une inférence à partir des ordres de
> grandeur. Si votre modèle Heritage validé empiriquement utilise un autre opérateur, c'est ici
> qu'il faut trancher.

Distribution de `modifier` sur les wonders : `0.01` (16), `0.04` (4), `0.02` (4), `0.1` (1),
`0.15` (1), `0.015` (1). ⚠️ Les valeurs ≠ 0.01 empêchent de traiter `modifier` comme une constante
d'échelle universelle : c'est bien un paramètre par composant.

Exemples de couples observés :

| Wonder | `modifier` | Stat / ressource | Valeur dyn. au niveau 1 | Produit |
|---|---|---|---|---|
| `Wonder_Capital_Stonehenge` | 0.01 | `coins` | 10.0 | 10 % |
| `Wonder_Capital_Alhambra` | 0.01 | `UnitStat_CriticalHitChance` | 40.0 | 40 % |
| `Wonder_Capital_Carcassonne` | 0.01 | `UnitStat_CriticalHitChance` | 30.0 | 30 % |
| `Wonder_Vikings_DragonshipEllida` | 0.01 | `UnitStat_HitPoints` | 2.5 | 2,5 % |
| `Wonder_Arabia_CityOfBrass` | 0.1 | `UnitStat_MovementSpeed` | 1.0 (par tag) | 10 % |

### 2.2 Schéma B — Lua direct (HeritageVault, ressources)

Sur le HeritageVault, `BoostResourceComponentDTO` **n'a pas de champ `modifier` du tout**. Il porte
`luaModifierDefinitionId`, et le script renvoie **la valeur finale** :

```lua
-- dynamic_lua_long.Lua_BuildingEffect_HeritageVault_RessourceBoost_1
return 0.050 + 0.0024 * entityLevel
```

Soit 5,24 % au niveau 1 → 19,4 % au niveau 60. Pas de multiplication, pas de table.

⚠️ **Même DTO, deux schémas mutuellement exclusifs selon le porteur :**

| Porteur | Champs de `BoostResourceComponentDTO` | Schéma |
|---|---|---|
| Wonder (12 occ.) | `modifier` + `dynamicModifiedFloatDefinitionId` | A — produit |
| HeritageVault (12 occ.) | `luaModifierDefinitionId`, **pas de `modifier`** | B — valeur directe |

⚠️ **Et l'exclusivité n'est pas propre au porteur mais au composant** : sur le HeritageVault,
`BoostUnitStatComponentDTO` porte bien `modifier = 0.01` (32/32) avec un
`dynamicUnitStatChangeDefinitionId` — donc **schéma A**. Le vault utilise donc le schéma B pour ses
boosts de ressources et le schéma A pour ses boosts de stats d'unité, simultanément.

### 2.3 Schéma C — comptage par tag (`WonderTagDynamicChangeDTO`)

12 définitions dynamiques et boosts sont indexés non par un niveau mais par un **tag de wonder**.
`when` va de 0 à 7 dans **tous les cas**, quel que soit le tag.

```
Boost_WonderMaterial_Palace_BazaarOfferBoost   tag=Palace   when 0→7  modifier 0.1 → 0.7
Boost_WonderMaterial_Naval_TradeBoost          tag=Naval    when 0→7  modifier 0.05 → 0.35
Dusc_WonderMaterial_Fortress_MilitaryBoost     tag=Fortress when 0→7
Dv_WonderMaterial_Temple_GoodsBoost            tag=Temple   when 0→7
```

⚠️ **`when` n'est pas le nombre de wonders portant le tag.** Répartition réelle des tags sur les
28 wonders : `Temple` 10, `Fortress` 9, `Palace` 7, `Statue` 6, `Nature` 5, `Arena` 4, `Naval` 3.
Or **toutes** les tables vont de 0 à 7 : `Naval` n'a que 3 wonders mais sa table monte à 7, et
`Temple` en a 10 mais sa table s'arrête à 7.

Le préfixe `WonderMaterial_` de 9 des 12 définitions suggère que la variable comptée est un
**matériau de wonder**, pas un wonder. **Rien dans les données ne le déclare.** C'est la principale
ambiguïté de composition du domaine.

> ➡️ **Point à vérifier empiriquement.** Si votre modèle compte des wonders possédés par tag, il
> divergera au-delà de 7 pour `Temple` et `Fortress`, et n'atteindra jamais 7 pour `Naval`.

⚠️ `when = "0"` a un `then` **vide** (aucun champ `modifier`/`factor`), pas une valeur 0.0.
46 payloads vides sur 4 061 dans `Dv`/`Dusc`, 26 sur 499 dans `Boost.modifier`. Un parseur qui
attend un champ numérique doit traiter l'absence comme « pas de bonus », pas comme une erreur.
C'est l'explication des anomalies D6 signalées en `02-dynamic.md`.

### 2.4 `IncreaseTagBonusComponentDTO` — un compteur, sans cible déclarée

```ts
{ id: string; amount: number }   // 2 occurrences, amount = 1 dans les deux cas
```

| Wonder | `tags` | `amount` |
|---|---|---|
| `Wonder_Vikings_DragonshipEllida` | `["Naval"]` | 1 |
| `Wonder_Vikings_Yggdrasil` | `["Nature", "Statue"]` | 1 |

⚠️ **Le composant ne porte aucun champ de tag.** Pour `DragonshipEllida` le tag est déductible (un
seul), mais **`Yggdrasil` en a deux et rien ne dit lequel est incrémenté** — ou si les deux le sont.
Non résoluble depuis les données.

### 2.5 ⚠️ L'amplificateur Keeper — magnitude connue, portée inconnue

```json
{
  "id": "Boost_HeritageVault_KeeperAmplifier",
  "boostType": {
    "@type": "type.googleapis.com/BoostAmplifierComponentDTO",
    "luaModifierDefinitionId": "dynamic_lua_long.Lua_HeritageVault_KeeperAmplifier_Modifier"
  },
  "modifier": {
    "@type": "type.googleapis.com/BuildingLevelDynamicChangeDTO",
    "values": [{ "when": "0", "then": { "@type": "…/BoostDefinitionModifierDTO" } }]
  }
}
```

```lua
-- Lua_HeritageVault_KeeperAmplifier_Modifier
return 0.01 * (entityLevel - 1)
```

**Magnitude : +1 % par niveau au-dessus de 1.** Niveau 1 → 0. Niveau 60 (`maxLevel`) → **0.59**.

Trois observations à confronter à votre modèle empirique :

1. ⚠️ **Le champ `modifier` du boost est un stub dégénéré.** Il ne contient qu'une seule entrée,
   `when: "0"`, dont le `then` est un `BoostDefinitionModifierDTO` **vide**. Une implémentation qui
   lit la table `modifier` — le chemin normal pour tous les autres boosts — obtient **zéro**.
   Toute la valeur est dans le Lua. C'est le seul boost du jeu construit ainsi.
2. ⚠️ **`BoostAmplifierComponentDTO` ne déclare aucune cible.** Ses seuls champs sont `id` et
   `luaModifierDefinitionId`. Contrairement à `BoostProductionTimeComponentDTO` (`buildingGroup`,
   `buildingType`, `wonderDefinitionId`) ou `BoostResourceComponentDTO` (`cities`,
   `resourceDefinitionId`, `resourceType`, `buildingGroup`), **rien ne dit ce qui est amplifié.**
3. ⚠️ **Aucun opérateur de composition n'est déclaré.** Que l'amplificateur soit multiplicatif sur
   d'autres boosts, additif, ou restreint à un sous-ensemble : **les données sont muettes**.

**Rattachement confirmé :** `Boost_HeritageVault_KeeperAmplifier` est référencé par
`BuildingBoostComponentDTO.boostDefinitionId` sur **les 13 bâtiments `Building_Heritage_*_1`**,
un par vault — donc présent sur tous les vaults sans exception.

⚠️ `entityLevel` dans le Lua désigne le niveau du bâtiment porteur, borné à 60 par
`HeritageVaultDefinition.maxLevel`. **Ce n'est pas déclaré non plus** — c'est une inférence par
cohérence avec les autres scripts `Lua_BuildingEffect_HeritageVault_*` qui utilisent la même
variable.

> ➡️ **C'est le point où le modèle « sonne » le plus incertain.** Les données donnent la courbe
> (`0.01 × (level − 1)`) et le rattachement (les 13 vaults), mais ni la portée ni l'opérateur.
> Toute composition « toggle Wonders × Keeper » repose donc sur une convention externe aux données,
> pas sur une règle qu'on pourrait en extraire.

### 2.6 `ConditionalBonusComponentDTO` — bonus plafonné par déclencheur

3 occurrences, toutes de forme identique :

```ts
{ id: string; cap: 5; condition: Condition; fulfilled: { dynamicChangeDefinitionId: string } }
```

| Wonder | `condition` (`@type`) | `fulfilled.dynamicChangeDefinitionId` |
|---|---|---|
| `Wonder_Capital_Mausoleum` | `QuestCompleteConditionDTO` | `Dac_Mausoleum_RP_Mix_Chest` |
| `Wonder_Capital_HagiaSophia` | `NegotiationCompleteConditionDTO` | `Dac_HagiaSophia_RP_Mix_Chest` |
| `Wonder_Capital_SherwoodForest` | `BattleWonConditionDTO` | `Dac_SherwoodForest_RP_Mix_Chest` |

⚠️ Les trois `condition` sont des objets **vides** (`@type` seul, aucun champ). ⚠️ `cap = 5` : ni
période ni unité déclarée — 5 fois par jour ? par niveau ? Indéterminable.

### 2.7 `WonderBonusBehaviourDTO` — bonus déclenché par tag

6 occurrences, sur `ProductionComponentDTO.behaviours[]` :

```ts
{ tag: string; rewards: Reward[] }
```

| Wonder | `tag` | Récompense |
|---|---|---|
| `Wonder_Capital_Stonehenge` | Temple | `research_points` ×1 |
| `Wonder_Egypt_AbuSimbel` | Statue | `research_points` ×1 |
| `Wonder_China_GreatWall` | Fortress | `research_points` ×1 |
| `Wonder_Capital_Mausoleum` | Temple | coffre `Dac_Mausoleum_TypeBonus_Good1_CurrentAge` |
| `Wonder_China_ForbiddenCity` | Temple | coffre, 3 biens `…_CurrentAge` |
| `Wonder_Egypt_CheopsPyramid` | Temple | coffre, 3 biens `…_PreviousAge` |

⚠️ **`CheopsPyramid` utilise `PreviousAge` là où `ForbiddenCity` et `Mausoleum` utilisent
`CurrentAge`** — même mécanique, âge de référence différent. Lisible uniquement dans le nom de la
définition dynamique, jamais dans un champ.

⚠️ Le `tag` porté ici (`Temple`, `Statue`, `Fortress`) est toujours l'un des tags du wonder porteur,
mais **le sens du déclenchement n'est pas déclaré** : bonus versé quand un autre wonder du même tag
est amélioré ? à la production ? Indéterminable.

---

## 3. `ReworkedWonderDefinitionDTO` — n = 28

```ts
interface ReworkedWonderDefinition {
  id: string;                            // 28/28
  cityDefinition: string;                // 28/28 -> City.id (Capital 14, Vikings/Mayas/China/Egypt 3, Arabia 2)
  tags: string[];                        // 28/28 — 1 tag (12) ou 2 tags (16)
  rarity: string;                        // 28/28 — Rarity_RARE (19) | Rarity_LEGENDARY (9)
  components: WonderComponent[];         // 28/28 — 17 combinaisons distinctes
  blueprintMaterialDefinitionId: string; // 28/28 -> Resource.id
  firstMaterialDefinitionId: string;     // 28/28 -> Resource.id
  secondMaterialDefinitionId: string;    // 28/28 -> Resource.id
  newUntil?: string;                     // 14/28 — timestamp ISO
  slotType?: string;                     // 14/28 — "SlotType_ALLIED" uniquement
  freeProductionSlots?: number;          // 3/28 — int32, 1 ou 2
}
```

⚠️ `newUntil` : 7 dates distinctes pour 14 wonders, exactement **2 wonders par date** — les wonders
sortent par paires. Une date est **2025-11-06**, postérieure à la livraison des données.

⚠️ `slotType` n'a qu'une seule valeur (`SlotType_ALLIED`) sur 14 des 28 wonders. Ce que signifie son
absence sur les 14 autres n'est pas dans les données.

### 3.1 Composants — 9 variantes

| `@type` | occ. | Champs |
|---|---|---|
| `WonderLevelUpComponentDTO` | 28 | `duration` (`3600s`), `dynamicCosts`, `requiredWorkers?` (14) |
| `BoostUnitStatComponentDTO` | 27 | `statDefinitionId`, `modifier`, `dynamicUnitStatChangeDefinitionId`, `unitType?` (23) |
| `ProductionComponentDTO` | 17 | cf. `03-batiments.md` §3.1 ; `behaviours` = `WonderBonusBehaviourDTO` (6) ou `WorkerBehaviourDTO` (3) |
| `BuildingBoostComponentDTO` | 14 | `boostDefinitionId` -> `Boost.id` |
| `BoostResourceComponentDTO` | 12 | schéma A, §2.1 |
| `GrantWorkerComponentDTO` | 6 | `dynamicAmountDefinitionId`, `type?` (1) |
| `ConditionalBonusComponentDTO` | 3 | §2.6 |
| `IncreaseTagBonusComponentDTO` | 2 | §2.4 |
| `GrantCommanderSlotComponentDTO` | 1 | `id` seul — marqueur |

⚠️ `WonderLevelUpComponentDTO` n'a **pas** de `maxLevel`, contrairement à `LevelUpComponentDTO` des
bâtiments (`03-batiments.md` §1.3). Le plafond vient de `ConstantsDefinition` — une constante
globale, pas une donnée d'entité.

### 3.2 `dynamicCosts` — objet embarqué, pas une référence

`WonderLevelUpComponentDTO.dynamicCosts` contient **un `WonderDynamicCostDefinitionDTO` complet**
(avec son `id` et son `mapping`), pas un id. Payload `CratesDTO` :

```ts
{ crates: { id: string; crateAmount: number; gearsAmount: number;
            isInstantHelpRequest: boolean; cost: { definitionId, amount } }[] }
```

29 niveaux tabulés (montées 1→30). Les 8 `WonderDynamicCostDefinitionDTO` racine sont partagés par
collection × cité (`Dac_Wonder_AncientWorld_Capital_UpgradeCosts`, etc.) : **8 barèmes pour
28 wonders**.

---

## 4. `HeritageVaultDefinitionDTO` — n = 13

Un vault par thème événementiel. **Aucun champ `id`** (cf. C6) — identifié de fait par `themeId`.

```ts
interface HeritageVaultDefinition {
  themeId: string;              // 13/13 — "heritage_vault.Heritage_*", 13 valeurs uniques
  event: string;                // 13/13 — "Event_*" | "Treasure_Hunt" — ⚠️ hors scope
  buildingDefinitionId: string; // 13/13 -> Building_Heritage_*_1  ✅ 13/13
  maxLevel: number;             // 13/13 — TOUJOURS 60
  order: number;                // 13/13 — int32, 13 valeurs distinctes (1..15, avec trous)
  effects: Effect[];            // 13/13 — exactement 10 par vault, 130 au total
  slots: Slot[];                // 13/13 — exactement 8 par vault, 104 au total
  eligibleResourceIds: string[];// 13/13
  xpPerLevelDefinitionId: string;                    // 13/13 -> Lua
  keeperReputationPointsPerLevelDefinitionId: string;// 13/13 -> Lua
}
```

⚠️ `order` va de 1 à 15 pour 13 vaults : **deux valeurs manquent**. Séquence non dense.

### 4.1 Système effets / slots — la composition structurelle

```ts
interface Effect {   // 130 — structure parfaitement régulière
  id: string; components: Component[];
  minLevel: number;        // 1, 4, 7, 11, 14, 17, 21, 24, 28, 30 — 13 effets par palier
  effectGroup: string;     // PRODUCTION (65) | BOOST (65) — exactement 5 de chaque par vault
  lockDuration: string;    // TOUJOURS "64800s" (18 h)
}
interface Slot {     // 104
  id: string;
  minLevel: number;        // 1, 4, 7, 11, 14, 17, 21, 24 — 13 slots par palier
  allowedGroups: string[]; // [PRODUCTION] (52) | [BOOST] (52) — toujours un seul groupe
  slotIndex?: number;      // 91/104 — 1..7 ; ⚠️ ABSENT sur 13 slots (un par vault)
  unlockAction?: {...};    // 65/104
  premiumDuration?: string;// 39/104 — toujours "1209600s" (14 j)
}
```

**10 effets pour 8 slots** : le joueur choisit lesquels équiper. C'est le mécanisme de composition
structurelle du vault — quels bonus sont actifs dépend du slotting, pas seulement du niveau.

⚠️ **13 slots (un par vault) n'ont pas de `slotIndex`** — probablement le slot initial d'index 0
(les indices présents vont de 1 à 7), mais **rien ne le déclare**. Un modèle qui indexe par
`slotIndex` perdra ce slot.

⚠️ Les paliers `minLevel` des effets (10 valeurs jusqu'à 30) et des slots (8 valeurs jusqu'à 24) ne
coïncident pas, alors que `maxLevel` vaut 60 : **aucun effet ni slot ne se débloque au-delà du
niveau 30**, soit la moitié de la progression. Constaté, non expliqué.

`unlockAction.costs[]` : `InventoryItemCostDTO { itemDefinitionId, amount }` →
`InventoryItemDefinitionDTO.definitionId` (valeur unique `InventoryItem_AgeUpgradeKit_Evolving`).
**Seule référence sortante réelle du domaine**, vers un type retiré du Socle par décision de scope
(cf. `_references-hors-scope.md` §5). Coût d'absorption négligeable (14 entités) si on veut fermer.

### 4.2 Composants des effets

`ProductionComponentDTO` (57), `BoostUnitStatComponentDTO` (32), `BoostResourceComponentDTO` (12),
`CultureComponentDTO` (12), `BuildingBoostComponentDTO` (9), `GrantWorkerComponentDTO` (8).

⚠️ `CultureComponentDTO` porte ici `luaPointsDefinitionId` **et** `luaRangeDefinitionId` (12/12),
alors que sur les bâtiments il porte `points`/`range` ou leurs variantes `dynamic*`
(`03-batiments.md` §3). ⚠️ `luaRangeDefinitionId` **n'existe nulle part ailleurs** dans les données.

Les 9 `BuildingBoostComponentDTO` pointent vers les boosts `Boost_HeritageVault_1_*`
(réduction de temps de recrutement par type d'unité, régénération de tentatives Treasure Hunt) —
**distincts de l'amplificateur Keeper**, qui est attaché au bâtiment et non à un effet (§2.5).

### 4.3 Formules Lua du vault

```lua
Lua_HeritageVault_XpPerLevel                 return 25 * entityLevel * (entityLevel+1) * (entityLevel+2) / 3
Lua_HeritageVault_KeeperReputation_LevelUpCost  return 5 * entityLevel
Lua_BuildingUpgrade_HeritageVault_LevelUpCost_1
    if entityLevel < 20 then return floor((3 * 1.10^entityLevel) + 1)
    else return floor((3 * 1.10^20 * 1.02^(entityLevel-20)) + 1) end
Lua_BuildingEffect_HeritageVault_CulturePoints_1
    return floor(200 + 30*entityLevel + 4*entityLevel*max(0, playerAgeOrder-4))
Lua_BuildingEffect_HeritageVault_Coins_1     return floor(3200*playerAgeOrder*entityLevel + 12000*playerAgeOrder)
Lua_BuildingEffect_HeritageVault_RessourceBoost_1  return 0.050 + 0.0024 * entityLevel
Lua_BuildingEffect_HeritageVault_CultureLevel_1    return floor((entityLevel / 12) + 1)
Lua_BuildingEffect_HeritageVault_RP_1              return ceil(entityLevel / 2)
```

⚠️ **Les coûts de montée changent de régime au niveau 20** (`1.10^n` puis `1.02^(n−20)`) — une
rupture de pente qu'aucune table ne rend visible. Variante ATH : `9 * 1.11^n` puis `1.03`,
variante Polynesia : `1.5 * 1.10^n` puis `1.02`.

⚠️ Deux variables de contexte apparaissent dans ces scripts : `entityLevel` et `playerAgeOrder`
(l'`order` de `AgeDefinitionDTO`). Une troisième, `keeperPurchaseCount`, n'apparaît que dans les
24 scripts `Lua_HeritageVault_KeeperOffer_*` (offres du Keeper, forme
`base × taux^keeperPurchaseCount`, taux de 1.05 à 1.10). **La liste des variables disponibles n'est
déclarée nulle part** (cf. C8).

---

## 5. Reliques

```ts
interface RelicDefinition {  // 45
  id: string; power: number;      // 45/45 — int32 : 10 (24), 25 (13), 50 (8)
  rarity?: string;                // 21/45 — RARE (13) | LEGENDARY (8)
}
interface RelicCollectionDefinition {  // 8
  id: string;                     // namespace "relic_collection.*"
  relicDefinitionIds: string[];   // ✅ 45/45 résolus — partition exacte des 45 reliques
}
```

✅ **`rarity` et `power` sont en correspondance stricte** : `power = 10` ⇒ pas de `rarity` (24 cas),
`power = 25` ⇒ `RARE` (13), `power = 50` ⇒ `LEGENDARY` (8). L'absence de `rarity` est donc
équivalente à une rareté commune implicite — régularité parfaite mais **non déclarée**.

Collections : `Maya`, `Arabia`, `China`, `Egypt`, `Vikings`, `LegendsOfTroy` (5 reliques chacune),
`Pirates` (7), `FoundationsOfCivilization` (8).

**Consommation des reliques** — deux mappings dynamiques, tous deux sur le City Hall :

```
Dv_Building_CityHall_CultureRange   RelicCompletedCollectionsDynamicChangeDTO
                                    when 0→1.0, 1→2.0, 2→3.0, 3→4.0
Dv_Building_CityHall_CultureValues  RelicPowerDynamicChangeDTO
                                    formule "(#power)", valueLimit 100000, AUCUNE table
```

⚠️ `RelicCompletedCollectionsDynamicChangeDTO` ne tabule que **0 à 3 collections complétées**, alors
qu'il y en a **8**. Au-delà de 3, la règle de palier (C9) fige la valeur à 4.0 — mais rien ne
confirme que c'est l'intention plutôt qu'une table incomplète.

⚠️ `RelicPowerDynamicChangeDTO` est le seul mapping du jeu **sans `values`**, avec la formule
identité `(#power)`. Le total de puissance possible est 24×10 + 13×25 + 8×50 = **965**, très
loin du `valueLimit = 100000`.

---

## 6. `WonderCollectionDefinitionDTO` — n = 3

```ts
{ id: string; wonderIds: string[];  // 10 chacune → 30 ≠ 28 wonders, voir ⚠️
  promotions: { id, order, promotedWonderIds: string[] }[];
  buyChest: {...};                  // arbre de récompense — hors scope
  order?: number }                  // 2/3 — ⚠️ absent sur AncientWorld
```

Collections : `AncientWorld`, `StoriesAndMyths`, `GreatEmpires` — 10 `wonderIds` chacune.

⚠️ **3 × 10 = 30 références pour 28 `ReworkedWonderDefinitionDTO`.** Soit des doublons entre
collections, soit des références vers des wonders absents des données. À vérifier si le domaine
devient critique — non poursuivi ici.

⚠️ `order` absent sur `AncientWorld` alors que `StoriesAndMyths` = 2 et `GreatEmpires` = 1.
Sur 3 entités, l'optionalité n'est pas caractérisable.

`promotions[].promotedWonderIds` : groupes de 3 wonders, `order` 1..n — mécanisme de rotation, dont
la périodicité vient de `ConstantsDefinition.wonders.promotionRuntime = "172800s"` (48 h) et les
probabilités de `promotionDropChances` (`rare` 0.5, `legendary` 0.75).

---

## 7. Récapitulatif des points ouverts

### Composition de boosts — à confronter au modèle empirique

| # | Point | Statut |
|---|---|---|
| **W1** | Schéma A : `modifier` × valeur dynamique. **L'opérateur (multiplication) est inféré des ordres de grandeur, non déclaré.** | ⚠️ **Corroboré** par le domaine Unités (`06-unites-stats.md` §5) : sans table, `modifier` est directement la fraction (0.05 = +5 %) ; avec table il vaut 0.01 et la table porte les points de %. Les deux branches donnent la même échelle 1–15 %. **Renforcé, toujours pas démontré** — §2.1 |
| **W2** | Amplificateur Keeper : magnitude `0.01 × (level − 1)` connue, **portée et opérateur de composition absents des données** | ⚠️ **Le plus incertain** — §2.5 |
| **W3** | `BoostAmplifierComponentDTO.modifier` est un stub vide : lire la table donne 0, toute la valeur est dans le Lua | ⚠️ **Piège d'implémentation** — §2.5 |
| **W4** | `WonderTagDynamicChangeDTO.when` va de 0 à 7 pour tous les tags, sans lien avec le nombre de wonders portant le tag (3 à 10) | ⚠️ **À valider** — §2.3 |
| **W5** | Schémas A et B coexistent sur le même DTO selon le porteur **et** selon le composant au sein d'un même porteur | ⚠️ §2.2 |
| **W6** | `IncreaseTagBonusComponentDTO` sans champ de tag ; ambigu sur `Yggdrasil` (2 tags) | Non résoluble — §2.4 |
| **W7** | `when = "0"` → `then` vide, pas 0.0 (46 + 26 payloads) | Piège de parsing — §2.3 |

### Autres

| # | Point | Statut |
|---|---|---|
| ✅ — | Niveau max wonder = 30, confirmé par recoupement tables ↔ constante | Résolu — §1 |
| ✅ B15 | `PremiumLayoutDefinitionDTO` (`03-batiments.md` §7.4) | **Confirmé non référencé** : aucun wonder ne le cite, malgré le namespace `wonder_premium_layout.*`. Seul lien = `ConstantsDefinition.wonders.freeLayouts = 2` |
| W8 | `ConditionalBonusComponentDTO.cap = 5` : ni période ni unité ; `condition` = objets vides | Indéterminable — §2.6 |
| W9 | `WonderBonusBehaviourDTO` : sens du déclenchement non déclaré ; `CurrentAge` vs `PreviousAge` lisible seulement dans le nom | §2.7 |
| W10 | 13 slots de vault sans `slotIndex` (un par vault) | Index 0 implicite probable, non déclaré — §4.1 |
| W11 | Aucun effet ni slot au-delà du niveau 30, alors que `maxLevel = 60` | Constaté, inexpliqué — §4.1 |
| W12 | Coûts de montée du vault : rupture de régime au niveau 20, invisible hors du Lua | §4.3 |
| W13 | `RelicCompletedCollections` tabule 0..3 pour 8 collections | Table possiblement incomplète — §5 |
| W14 | 30 `wonderIds` dans les 3 collections pour 28 wonders | Doublons ou références absentes — §6 |
| W15 | `luaRangeDefinitionId` n'existe que sur le HeritageVault | §4.2 |
| W16 | `WonderLevelUpComponentDTO` sans `maxLevel` (contrairement aux bâtiments) | Plafond en constante globale — §3.1 |
| W17 | `HeritageVault.slots[].unlockAction.costs[].itemDefinitionId` → `InventoryItemDefinitionDTO` | Seule référence sortante ; absorption à 14 entités si on veut fermer — §4.1 |
