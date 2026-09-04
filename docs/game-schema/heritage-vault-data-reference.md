# Référence de données — Heritage Vault

Type racine : `HeritageVaultDefinitionDTO` (13). Entités rattachées :
`DynamicLuaLongDefinitionDTO` (44), `DynamicActionChangeDefinitionDTO` (56),
`BoostDefinitionDTO` (9), `DynamicFloatValueDefinitionDTO` (2),
`DynamicUnitStatChangeDefinitionDTO` (2), `BuildingDefinitionDTO` (13, propriété du
domaine Bâtiments). **Loca : 98 clés `Base.HeritageVault.*` + 26 clés `Base.HeritageVaults.*` = 124.**

Prérequis : [`00-conventions.md`](00-conventions.md), [`02-dynamic.md`](02-dynamic.md) §5
(articulation table/formule), [`01-socle.md`](01-socle.md) §5 (Boosts).
Complément : [`05-wonders-reliques-heritage.md`](05-wonders-reliques-heritage.md) §2 (mécaniques de
composition de boosts) et §4 (première description du DTO racine).

> **Rôle de ce document.** Décrire ce qui est effectivement dans `gamedesign.json` pour ce
> domaine, structure par structure, avec les comptes réels. Ce qui n'y est pas est signalé
> comme absent, jamais comblé. Les trois hypothèses assumées par le code sont marquées
> ⚠️ CONVENTION et renvoient à l'endroit unique qui les porte.
>
> Mesuré sur `gamedesign.json` checksum `T3rQfllrrK7Q_c3f7a67c84112e8d27c89ebccd70b9e9`
> et `loca.json` checksum `MktHieEX38ba`, locale `en_DK`.
>
> Extraction : `scripts/extract/heritage.ts` → `data/heritage/generated/heritage.generated.ts`.
> Garde-fou : `scripts/diff/heritage.ts` (`pnpm diff:heritage`).
> Résolution : `resolvers/heritage.ts`. État joueur : `lib/db/heritage-schema.ts`.

---

## 1. Vue d'ensemble

| | valeur |
|---|---|
| Vaults | **13** |
| Niveau max | **60** (13/13, `HeritageVaultDefinition.maxLevel`) |
| Slots | **8 par vault** — 104, tous identiques d'un vault à l'autre |
| Effets | **10 par vault** — 130, un composant chacun |
| Ressources éligibles | 41 jetons d'évolution, sur 44 évolutifs |
| Formules Lua | 44 définitions, 81 références entrantes |
| Formules de prix du gardien | 29 — **0 offre déclarée** |

### 1.1 Identité — pas de champ `id`

⚠️ `HeritageVaultDefinitionDTO` **n'a pas de champ `id`** (13/13). Son identité est `themeId`,
doublée d'une correspondance 1:1 avec `buildingDefinitionId`.

```ts
interface HeritageVaultDefinition {
  themeId: string;                                    // 13/13, "heritage_vault.Heritage_*"
  buildingDefinitionId: string;                       // 13/13 -> Building_Heritage_*_1
  event: string;                                      // 13/13, étiquette sans DTO cible
  order: number;                                      // 13/13
  maxLevel: number;                                   // 13/13, toujours 60
  slots: Slot[];                                      // 13/13, toujours 8
  effects: Effect[];                                  // 13/13, toujours 10
  eligibleResourceIds: string[];                      // 1 à 5
  xpPerLevelDefinitionId: string;                     // -> DynamicLuaLongDefinition.id
  keeperReputationPointsPerLevelDefinitionId: string;  // -> DynamicLuaLongDefinition.id
}
```

### 1.2 Les 13 vaults

| themeId (abrégé) | `order` | `event` | nom (`Base.HeritageVaults.*_Name`) | bâtiment (`Base.BuildingGroups.*_Name`) | rés. élig. | barème xp |
|---|---:|---|---|---|---:|---|
| Celtic | 1 | `Event_Celtic` | Forge of Flames | Celtic Culture | 4 | standard |
| Mongol | 2 | `Event_Mongols` | The Khan's Games | Mongolian Culture | 4 | standard |
| Greek | 3 | `Event_Greek` | Echoes of Olympus | Ancient Greek Culture | 5 | standard |
| Persian | 4 | `Event_Persian` | Gardens of Shiraz | Persian Culture | 4 | standard |
| Polynesian | 5 | `Event_Polynesia` | Stars and Tides | Polynesian Culture | 2 | **Polynesia** |
| Japan | 6 | `Event_Japan` | Beneath the Sakura | Japanese Culture | **1** | standard |
| MaliEmpire | 7 | `Event_MaliEmpire` | Mansa's Treasure | Culture of the Mali Empire | 4 | standard |
| WorldFair | 8 | `Event_WorldFair` | Exposition of the World | World Fair Tradition | 3 | standard |
| Aztec | 9 | `Event_Aztec` | Heart of the Sun | Aztec Culture | 2 | standard |
| Halloween | 10 | `Event_Halloween` | Night of Spirits | Halloween Tradition | 4 | standard |
| Thai | 11 | `Event_Thai` | Festival of Lights | Thai Culture | 2 | standard |
| Winter | 12 | `Event_Winter` | Hearth of Winter | Winter Tradition | 4 | standard |
| ATH | **15** | `Treasure_Hunt` | The X marks the Spot | Pirate Tradition | 2 | **ATH** |

⚠️ Le libellé du bâtiment n'est pas systématiquement « … Culture » : 4 thèmes sur 13 disent
« Tradition » (`WorldFair`, `Halloween`, `Winter`, `ATH`), et l'ATH s'appelle « Pirate Tradition »,
sans rapport lexical avec `Treasure_Hunt`.

⚠️ **`order` saute 13 et 14.** Douze valeurs consécutives puis 15 pour l'ATH. Deux emplacements sans
entité correspondante ; sens indéterminé.

⚠️ **Trois libellés distincts par thème, à ne pas confondre :**

| clé loca | exemple Celtic | ce que c'est |
|---|---|---|
| `Base.HeritageVaults.Heritage_Celtic_Name` | « Forge of Flames » | le nom du thème |
| `Base.HeritageVault.celtic_Name` | « Celtic Heritage » | un second libellé du thème (10 thèmes sur 13 seulement — `ath`, `japan`, `worldfair` absents) |
| `Base.BuildingGroups.heritageCeltic_Name` | « Celtic Culture » | le nom du bâtiment-marqueur |

---

## 2. Le bâtiment-marqueur — `Building_Heritage_*_1` (n = 13)

**Propriété du domaine Bâtiments**, où il est déjà extrait sous `scope: "decoration"` et
`chainKey` `City_Capital|heritage<Theme>`. Le domaine Heritage n'en garde que la clé de chaîne.

```json
{
  "@type": "type.googleapis.com/BuildingDefinitionDTO",
  "id": "Building_Heritage_Celtic_1",
  "type": "decoration", "width": 3, "height": 3,
  "age": "StoneAge", "group": "heritageCeltic", "level": 1,
  "cities": ["City_Capital"],
  "components": [
    { "@type": "…/BuildingBoostComponentDTO",
      "boostDefinitionId": "Boost_HeritageVault_KeeperAmplifier" },
    { "@type": "…/InitComponentDTO" },
    { "@type": "…/ConstructionComponentDTO", "duration": "0s" },
    { "@type": "…/MoveComponentDTO" },
    { "@type": "…/SellComponentDTO" },
    { "@type": "…/HeritageVaultMarkerComponentDTO",
      "themeId": "heritage_vault.Heritage_Celtic" }
  ]
}
```

- Les **13 seuls bâtiments `type: "decoration"`** du game design sont ces 13 marqueurs : le type est
  un synonyme exact du domaine.
- Composants : 6 types, identiques sur les 13 (13 × chacun).
- ⚠️ **Aucun `LevelUpComponentDTO`.** Le bâtiment est figé au niveau 1. Le niveau 1→60 n'est pas un
  niveau de bâtiment, c'est un niveau de **thème**, porté par `HeritageVaultDefinition.maxLevel`.
- ⚠️ **`age: "StoneAge"` sur les 13** — pas une ère d'instance. Un vault n'a pas d'âge figé
  (cf. §5.3).
- `HeritageVaultMarkerComponentDTO` : 13 occurrences, un seul champ (`themeId`), correspondance 13/13
  avec `HeritageVaultDefinition.themeId`. Seul pont déclaré bâtiment → vault.
- La taille 3×3 est celle du marqueur nu. `Base.HeritageVault.Tutorial.Appearance` indique que
  l'apparence se choisit parmi les évolutifs du thème et que **chaque apparence a sa propre taille** :
  cette table d'apparences **n'est pas dans le game design** (0 `BuildingSkinDefinitionDTO` rattaché).

---

## 3. Slots — 104, strictement identiques sur les 13 vaults

Vérifié champ à champ : `minLevel`, `allowedGroups`, `premiumDuration` et `unlockAction` sont
rigoureusement les mêmes. Seul l'`id` (`Heritage_<Theme>_Slot_<n>`) varie.

| `slotIndex` | `minLevel` | `allowedGroups` | `unlockAction` | `premiumDuration` |
|---:|---:|---|---|---|
| 0 | 1 | PRODUCTION | — (offert) | — |
| 3 | 7 | PRODUCTION | `resourceChanges: premium −290` | `1209600s` (14 j) |
| 2 | 14 | PRODUCTION | `InventoryItemCostDTO` × 2 `AgeUpgradeKit_Evolving` | — |
| 1 | 21 | PRODUCTION | — (offert) | — |
| 4 | 4 | BOOST | — (offert) | — |
| 7 | 11 | BOOST | `resourceChanges: premium −290` | `1209600s` |
| 5 | 17 | BOOST | `InventoryItemCostDTO` × 2 `AgeUpgradeKit_Evolving` | — |
| 6 | 24 | BOOST | `InventoryItemCostDTO` × 1 `AgeUpgradeKit_Evolving` | `1209600s` |

Notes de forme :
- `slotIndex` est **absent** sur le slot 0 (C4 : absent ≠ 0 en général, mais ici la position dans le
  tableau et `allowedGroups` le lèvent sans ambiguïté).
- `allowedGroups` est un tableau, mais il ne contient **jamais qu'une seule valeur** (104/104).
- Deux seuls types de coût : `InventoryItemCostDTO` et `resourceChanges`. Aucun autre.
- ⚠️ **Le slot 6 est le seul payé en kit ET temporaire** (14 jours). Les trois autres kits achètent un
  slot définitif, les deux gemmes achètent 14 jours. Incohérence apparente de la donnée, pas une
  lecture ambiguë : `premiumDuration` est bien présent aux côtés d'un `unlockAction.costs` en item.

---

## 4. Effets — 130, un composant chacun

`components` a **exactement une entrée** sur les 130 effets. `lockDuration` vaut `64800s` (18 h) sur
les 130 — c'est le cooldown de changement d'effet (`Base.HeritageVault.CooldownRemaining`).

### 4.1 Répartition

| | PRODUCTION | BOOST |
|---|---:|---:|
| effets par vault | 5 | 5 |
| `minLevel` | 1, 7, 14, 21, 28 | 4, 11, 17, 24, 30 |

Distribution identique sur les 13 vaults, sans exception. **5 effets pour 4 slots dans chaque
groupe** : il y a toujours exactement un effet de trop — c'est le choix de build.

⚠️ **Aucun slot au-delà du niveau 24, aucun effet au-delà du niveau 30, alors que `maxLevel = 60`.**
La moitié haute de la progression n'ouvre rien ; elle ne fait que grossir les valeurs déjà
débloquées. (Reporté au §6 du README comme incohérence constatée.)

### 4.2 Les six types de composant

| `@type` | n | ce qu'il porte | clé de bonus produite |
|---|---:|---|---|
| `ProductionComponentDTO` | 57 | `producedResources` (Lua), `producedDynamicActionChangeDefinitionId`, `finish.rewards`, `producedUnits` | `coins_output`, `food_output`, `research_points_output`, `goods_output` |
| `BoostUnitStatComponentDTO` | 32 | `modifier` (0.01, 32/32) + `dynamicUnitStatChangeDefinitionId` | `<unit>_damage`, `<unit>_hp`, `<unit>_critical_hit_damage` |
| `CultureComponentDTO` | 12 | `luaPointsDefinitionId` + `luaRangeDefinitionId` | `culture_points`, `culture_range` |
| `BoostResourceComponentDTO` | 12 | `luaModifierDefinitionId`, **jamais de `modifier`** | `coins_production`, `food_production`, `building_type_production` |
| `BuildingBoostComponentDTO` | 9 | `boostDefinitionId` → `Boost_HeritageVault_1_*` | `recruitment_time_reduction`, `regeneration_cap`, `regeneration_speed` |
| `GrantWorkerComponentDTO` | 8 | `dynamicAmountDefinitionId` | `worker_slots` |

Champs optionnels rencontrés :
`BoostUnitStatComponentDTO.unitDefinitionId` (1 occurrence, Aztec) ;
`BoostResourceComponentDTO.buildingType` (4, `workshop`) mutuellement exclusif de
`resourceDefinitionId` (8) ;
`ProductionComponentDTO.type` (1, `ProductionType_UNIT`), `.earlyCollectable` (9),
`.dynamicDurationDefinitionId` (3), `.behaviours` (1), `.producedUnits` (1),
`.resourceChangesOnStart` (1).

### 4.3 Durées de production

| `duration` / `minCollectionPeriod` | n | note |
|---|---:|---|
| `86400s` / `86400s` | 42 | cycle journalier strict |
| `86400s` / `14400s` + `earlyCollectable: true` | 9 | **exactement** les 9 productions directes coins/food |
| `28800s` / `28800s` | 2 | |
| `0s` / `0s` | 4 | coffres et production d'unités |

### 4.4 Les deux schémas de composition, dans le même vault

Le Vault utilise **simultanément** les deux schémas décrits en
[`05-wonders-reliques-heritage.md`](05-wonders-reliques-heritage.md) §2 :

```lua
-- Schéma B (valeur directe) — BoostResourceComponentDTO, PAS de champ `modifier`
dynamic_lua_long.Lua_BuildingEffect_HeritageVault_RessourceBoost_1
  return 0.050 + 0.0024 * entityLevel        -- 5,24 % (niv 1) → 19,40 % (niv 60)
```

```
Schéma A (produit) — BoostUnitStatComponentDTO, modifier 0.01 sur 32/32
  Dusc_Heritage_UnitAttackBoost   formula "2.0 + (0.24 * #level)"   valueLimit 60
  Dusc_Heritage_UnitHPBoost       formula "2.5 + (0.29 * #level)"   valueLimit 60
  → 0.01 × (2.0 + 0.24 × 60) = 0.164, soit +16,4 % au niveau 60
```

⚠️ **CONVENTION (a)** — que l'opérateur du schéma A soit une multiplication n'est **déclaré nulle
part**. Inféré par ordre de grandeur (les deux autres lectures donnent +1 % constant ou +1640 %).
Porté par le commentaire d'en-tête de [`resolvers/bonus.ts`](../../resolvers/bonus.ts), appliqué à
l'extraction seule (`BuildingCurve.effective = modifier × resolved`).

⚠️ **Unité** : `effective` est un **ratio** (0.164), pas des points de pourcentage.
`format: "percent"` décrit l'affichage, pas l'échelle de la valeur stockée.

### 4.5 Les 9 boosts `Boost_HeritageVault_1_*`

| id | `boostType` | courbe |
|---|---|---|
| `_AllRecTimeReduction` | `BoostProductionTimeComponentDTO` | table `when 1 → 0.015` + `"0.020 + (0.0047 * #level)"` |
| `_InfantryRecTimeReduction` | idem, `buildingGroup: infantryBarracks` | idem |
| `_HeavyRecTimeReduction` | idem, `heavyInfantryBarracks` | idem |
| `_RangedRecTimeReduction` | idem, `rangedBarracks` | idem |
| `_CavalryRecTimeReduction` | idem, `cavalryBarracks` | idem |
| `_SiegeRecTimeReduction` | idem, `siegeBarracks` | idem |
| `_ATHAttemptRegenerationBoost` | `RegenerationTraitBoostDTO`, `treasure_hunt_attempt`, `modifier: …_DURATION` | — |
| `_ATHAttemptCapIncrement` | `RegenerationTraitBoostDTO`, `treasure_hunt_attempt` | **table pure, sans formule** : `when` 1, 20, 30, 40, 50, 60 → 4, 5, 6, 7, 8, 9 |

⚠️ Les deux boosts ATH régénèrent `treasure_hunt_attempt`, **pas** des points de recherche. Les clés
de bonus `regeneration_cap` / `regeneration_speed` sont donc génériques, la ressource vivant dans
`BuildingBonus.resource` — à ne pas confondre avec `research_point_cap` / `research_regen_boost`
(Wonders), qui nomment les points de recherche.

Le 9ᵉ boost du domaine est `Boost_HeritageVault_KeeperAmplifier` — cf. §7.

---

## 5. Progression

### 5.1 Xp — axe unique, pas de second axe

Trois formules seulement, pour 13 vaults. Cassure de régime au niveau 20.

```lua
-- Lua_BuildingUpgrade_HeritageVault_LevelUpCost_1            (11 vaults)
if entityLevel < 20 then return math.floor((3   * 1.10^entityLevel) + 1)
else return math.floor((3   * 1.10^20 * 1.02^(entityLevel-20)) + 1) end

-- Lua_BuildingUpgrade_HeritageVault_ATH_LevelUpCost_1        (ATH)
if entityLevel < 20 then return math.floor((9   * 1.11^entityLevel) + 1)
else return math.floor((9   * 1.11^20 * 1.03^(entityLevel-20)) + 1) end

-- Lua_BuildingUpgrade_HeritageVault_Polynesia_LevelUpCost_1  (Polynésie)
if entityLevel < 20 then return math.floor((1.5 * 1.10^entityLevel) + 1)
else return math.floor((1.5 * 1.10^20 * 1.02^(entityLevel-20)) + 1) end
```

| niveau | standard | ATH | Polynésie |
|---:|---:|---:|---:|
| 1 | 4 | 10 | 2 |
| 10 | 8 | 26 | 4 |
| 20 | 21 | 73 | 11 |
| 30 | 25 | 98 | 13 |
| 59 | 44 | 230 | 22 |
| **cumul 1 → 60** | **1 417** | **6 070** | **722** |

⚠️ **Le champ s'appelle `xpPerLevel` mais la formule renvoie un compte d'unités.** L'unité est
réconciliée par `HeritageContributionTraitDTO` : les 41 jetons éligibles portent
`heritageXpPerUnit: 1` (41/41, toujours 1). **1 jeton = 1 xp** — les nombres ci-dessus sont donc
directement des comptes de jetons.

⚠️ **CONVENTION D'INDEX** — `entityLevel` est le niveau **déclaré**, donc `f(L)` est ce qu'il faut
payer pour **quitter** le niveau `L`. Convention reprise de l'extraction Bâtiments
(`BuildingLevelUpExtract.upgradeCost`), pas rejouée pour ce domaine. Rien dans le game design ne la
déclare.

### 5.2 Réputation du gardien

```lua
-- Lua_HeritageVault_KeeperReputation_LevelUpCost   (identique sur les 13 vaults)
return 5 * entityLevel
```

Linéaire pur : 5 points pour le rang 1, 295 pour le rang 59, **8 850 cumulés** sur 1 → 60.
Confirmé par `Base.HeritageVault.Keeper.InfoTooltip` : « Every {0} points raises your reputation
level by 1 ».

⚠️ **Aucun plafond de rang n'est déclaré.** `maxLevel = 60` s'applique au niveau du vault. Le code
prolonge la formule au-delà du dernier rang extrait plutôt que de borner en silence.

### 5.3 ⚠️ L'ère est celle du JOUEUR, jamais une ère d'instance

C'est la divergence structurelle majeure avec les bâtiments évolutifs.

| | bâtiment évolutif | Heritage Vault |
|---|---|---|
| axe âge | `BuildingAgeDynamicChangeDTO` | **`PlayerAgeDynamicChangeDTO`** |
| variable Lua | `entityAgeOrder` | **`playerAgeOrder`** |
| sens | ère **figée à l'obtention** de l'instance | ère **courante** du joueur |
| état à stocker | oui (`era`) | **non** — lue au runtime |

Deux mécanismes portent l'ère :

**(a) variable Lua `playerAgeOrder`** — 3 des 6 scripts d'effet :

```lua
Lua_BuildingEffect_HeritageVault_Coins_1
  return math.floor(3200 * playerAgeOrder * entityLevel + 12000 * playerAgeOrder)
Lua_BuildingEffect_HeritageVault_Food_1
  return math.floor(1800 * playerAgeOrder * entityLevel + 8000 * playerAgeOrder)
Lua_BuildingEffect_HeritageVault_CulturePoints_1
  return math.floor(200 + 30*entityLevel + 4*entityLevel*math.max(0, playerAgeOrder-4))
```

Les 3 autres (`RP_1`, `CultureLevel_1`, `RessourceBoost_1`) ne dépendent que du niveau.

⚠️ **`playerAgeOrder` est `AgeDefinition.order`, pas un index de tableau.** Le game design compte
`DawnAge = 1`, donc **`StoneAge` vaut 2** et `LateGothicEra` vaut 15. Le dériver de l'index des ères
du projet (qui commence à `StoneAge`) donnerait un décalage de 1 sur toutes les productions de
pièces, de vivres et de culture.

**(b) `PlayerAgeDynamicChangeDTO`** — les 8 DAC racines de biens, cf. §6.

---

## 6. Productions de biens — 56 `DynamicActionChangeDefinitionDTO`

8 DAC racines (`Good1`, `Good2`, `Good3`, `CEGoods`, `PEGood1`, `PEGood2`, `PEGood3`, `PEGoods`),
chacune éclatée en 6 variantes d'âge — 8 × 7 = 56.

```
DAC racine  ──PlayerAgeDynamicChangeDTO──▶  DAC par âge  ──BuildingLevelDynamicChangeDTO──▶  montant
            (StoneAge…RomanEmpire)                        (+ dynamicFormulaChangeCase, valueLimit 60)
```

```json
{
  "id": "Dac_Building_HeritageVault_CEGoods_1_BronzeAge",
  "mapping": [{
    "@type": "…/BuildingLevelDynamicChangeDTO",
    "values": [{ "when": "1", "then": { "resourceChanges": [
        { "definitionId": "DYN|BronzeAge_Good1", "amount": "60" },
        { "definitionId": "DYN|BronzeAge_Good2", "amount": "60" },
        { "definitionId": "DYN|BronzeAge_Good3", "amount": "60" } ] } }],
    "dynamicFormulaChangeCase": {
      "resourceChanges": [ { "definitionId": "DYN|BronzeAge_Good1" }, … ],
      "formula": "(#level * 6.5) + 55", "variableName": "level", "valueLimit": 60.0 }
  }]
}
```

**CE = Current Era, PE = Previous Era.** Vérifié : `CEGoods_1_MinoanEra` → biens `MinoanEra`,
`PEGoods_1_MinoanEra` → biens `BronzeAge`. `CEGoods_1_StoneAge` → biens `BronzeAge` (l'âge de pierre
n'a pas de biens).

| âge | 3 biens groupés (CEGoods / PEGoods) | 1 bien (Good* / PEGood*) |
|---|---|---|
| StoneAge | `(#level * 6.5) + 50` | `(#level * 12) + 240` |
| BronzeAge | `(#level * 6.5) + 55` | `(#level * 16) + 255` |
| MinoanEra | `(#level * 7.5) + 75` | `(#level * 19) + 265` |
| ClassicGreece | `(#level * 8.0) + 90` | `(#level * 23) + 275` |
| EarlyRome | `(#level * 9.0) + 105` | `(#level * 26) + 290` |
| RomanEmpireAndLater | `(#level * 10.0) + 120` | `(#level * 30) + 300` |

### 6.1 ⚠️ Deux encodages de bien, tous deux en RANG

Jusqu'à `EarlyRome` inclus, le bien est écrit `DYN|<Age>_Good<n>` — un rang **daté**. À partir de
`RomanEmpireAndLater`, l'encodage bascule sur `GoodRewardDTO.dynamicGood { number, offset }` — un
rang **nu**, l'ère venant du contexte :

```json
"rewards": [{ "@type": "…/GoodRewardDTO", "number": 1,
              "dynamicGood": { "number": 1, "offset": -1 } }]
```

**`offset` est le SEUL champ qui sépare `Dac_…_CEGoods_1_RomanEmpireAndLater` de
`Dac_…_PEGoods_1_RomanEmpireAndLater`** : `0` (absent) = ère courante, `-1` = ère précédente. Diff
intégral des deux définitions : `offset` et rien d'autre.

⚠️ Ni l'un ni l'autre encodage ne nomme un bien concret. C'est la convention du projet
(`docs/data-contracts.md` §2.1) : `primary`/`secondary`/`tertiary` est l'assignation d'ateliers
**propre à chaque compte**, absente du game design.

⚠️ Conséquence pour la lecture : une entrée d'âge groupée `RomanEmpire → LateGothicEra` ne peut pas
porter une liste de ressources unique quand `offset ≠ 0`, puisque « rang 1 de l'ère précédente » ne
désigne pas le même bien à `RomanEmpire` et à `LateGothicEra`. L'extraction éclate ces entrées âge
par âge.

---

## 7. Le gardien (Keeper)

### 7.1 ⚠️ Le catalogue d'offres N'EXISTE PAS dans le game design

C'est le constat central du domaine. Le game design contient **29 formules de prix**
`Lua_HeritageVault_KeeperOffer_*`, et **chacune a exactement 0 référence entrante** dans les 66 Mo.
Aucun `ShopOfferGroupDefinitionDTO`, aucun `SelectionKitDefinitionDTO`, aucun DTO quelconque ne
mentionne « Keeper » hors de ces 29 scripts et de l'amplificateur.

**Il n'existe ni liste d'offres, ni table de rotation, ni graine de tirage, ni nombre d'offres
simultanées.** Seuls les prix sont livrés. La seule source sur la rotation est la loca :
`Base.HeritageVault.Keeper.OfferRotationHint` — « Offers refresh every week ».

Toutes de la forme `math.floor(a · r^keeperPurchaseCount)`. Signe négatif = ce que le joueur donne
(`Keeper.SpendHeadline` : « You give »), positif = ce qu'il reçoit (`Keeper.ReceiveHeadline`).

**11 « on donne » :**

| offre | `a` | `r` | note |
|---|---:|---:|---|
| `Coins_S` / `Coins_M` | −15 000 / −25 000 | 1.08 | × `playerAgeOrder²` |
| `Food_S` / `Food_M` | −14 000 / −20 000 | 1.08 | × `playerAgeOrder²` |
| `ExoticGood_1` / `_2` / `_3` | −200 / −250 / −300 | 1.07 | |
| `RP` | −20 | 1.05 | |
| `WonderBP_Rare` | −1 | 1.08 | |
| `WonderBP_Legendary` | −1 | 1.06 | |
| `Negotiation_Wildcard` | −3 | 1.08 | |

**18 « on reçoit » :** `CEGood1` (2400), `CEGood2` / `CEGood3` (1800), `PEGood1` (2600),
`PEGood2` / `PEGood3` (2000) — tous `r = 1.07` ; `AgeUpKit`, `HealAllUnits`, `RefillBarracks_All`,
`ConstructionUpgrade_Skip` (a = 1, r = 1.08) ; `Negotiation_Turn` (2, 1.08) ; `HealSquad`,
`Production_Skip`, `RefillBarracks_{Infantry,Ranged,Cavalry,HeavyInfantry,Siege}` (2, 1.10).

⚠️ `05-wonders-reliques-heritage.md` §4 annonce **24** scripts `KeeperOffer_*`. Le compte réel
est **29**.

### 7.2 ⚠️ Portée de `keeperPurchaseCount` — inconnue de modèle

`keeperPurchaseCount` **n'apparaît nulle part ailleurs** que dans ces 29 scripts. Aucun DTO ne
déclare si le compteur est global au joueur, par vault, par offre, ni s'il est remis à zéro à la
rotation hebdomadaire.

⚠️ **CONVENTION** : un compteur par **(vault, offre)**, jamais remis à zéro. Portée par
`KEEPER_PURCHASE_COUNT_SCOPE` dans [`resolvers/heritage.ts`](../../resolvers/heritage.ts) et encodée
par `UserHeritageVaultEntity.keeperPurchases`.

### 7.3 L'amplificateur

```json
{ "id": "Boost_HeritageVault_KeeperAmplifier",
  "boostType": { "@type": "…/BoostAmplifierComponentDTO",
                 "luaModifierDefinitionId": "…Lua_HeritageVault_KeeperAmplifier_Modifier" },
  "modifier": { "@type": "…/BuildingLevelDynamicChangeDTO",
                "values": [ { "when": "0", "then": { … } } ] } }
```
```lua
return 0.01 * (entityLevel - 1)     -- 0 % au rang 1, +59 % au rang 60
```

Référencé par `BuildingBoostComponentDTO.boostDefinitionId` sur les **13** `Building_Heritage_*_1`.

⚠️ **Sa table `modifier` est un stub vide** : une seule entrée `when: "0"` au `then` sans valeur. Le
chemin de lecture normal des 49 autres boosts **donne zéro**. Toute la valeur est dans le Lua.
(Point W3 du README, confirmé.)

⚠️ **CONVENTION (b) — résout le point W2 du README.** Le DTO ne déclare **aucune cible**, et rien ne
dit ce qu'`entityLevel` désigne ici. Les deux réponses viennent de la loca :

- `Base.HeritageVault.Keeper.InfoTooltip` : « Every {0} points raises your reputation level by 1,
  **and each level adds +1% to this heritage building's production and boosts** » ;
- `Base.HeritageVault.Keeper.BuildingOutputBoost` : « +{0}% Building output ».

Donc `entityLevel` = **rang de réputation du gardien** (pas le niveau du vault), et la cible =
**toutes les productions et tous les boosts du bâtiment heritage du même thème**, en composition
**multiplicative**. Déduction documentée, portée par `keeperAmplifierMultiplier()`.

**Reste inconnu** : l'ordre de composition avec d'éventuels boosts globaux du joueur.

---

## 8. Coffres

13 effets versent un coffre, par deux chemins distincts.

### 8.1 `finish.rewards` — 6 effets, contenu constant

| vault | niveau | racine |
|---|---:|---|
| ATH | 14 | `Reward_HeritageVault_RandomPEGoods_1` |
| ATH | 28 | `Reward_HeritageVault_RandomCEGoods_1` |
| Halloween | 21 | `Reward_HeritageVault_Goods_RandomRefill_SelectionRefill_Chest_1` |
| Aztec | 21 | idem |
| Japan | 21 | `Reward_AllAge_CollectorBuildings_1` |
| Aztec | 1 | `UnitRewardDTO` — 4 crocodiles (cf. §8.3) |

```
Reward_HeritageVault_RandomCEGoods_1
└─ MysteryChestReward   chances [33, 33, 33, 3, 3]
   ├─ Dac_Building_HeritageVault_Good1_1
   ├─ Dac_Building_HeritageVault_Good2_1
   ├─ Dac_Building_HeritageVault_Good3_1
   ├─ relic.StringsOfTheAncients   (si Technology_BronzeAge_SocialChange ET relique non débloquée)
   └─ relic.PriamsDiadem           (idem)
```

⚠️ **`chances` ne somme pas à 100** (105 ici). Les entrées conditionnées par `requirements` sont
retirées du tirage quand elles ne s'appliquent pas : la renormalisation est faite par le jeu à
l'exécution, elle n'est pas dans la donnée.

### 8.2 DAC empruntés aux évolutifs — 7 effets, contenu VARIABLE selon le niveau

7 effets pointent, via `producedDynamicActionChangeDefinitionId`, un DAC hors du namespace
`HeritageVault` — emprunté au bâtiment évolutif du même thème. Ces DAC ne nomment **aucune
ressource** : leurs `values[].then` tabulent un **arbre de récompense**, et le contenu du coffre
**change avec le niveau du vault** (lecture par palier, C9).

| vault | niveau | DAC | paliers (`when`) |
|---|---:|---|---|
| Celtic | 7 | `Dac_ProductionReward_Building_EventCeltic_Evolving_GrandSmithy_1_RandomRefill` | 3 — 1, 22, 42 |
| MaliEmpire | 14 | `Dac_Building_EventMaliEmpire2022_Evolving_Madrasa_1_RP_and_Customization_Chest` | 15 — 1, 6, 9, 10, 14, 16, 19, 22, 24, 26, 29, 30, 33, 38, 39 |
| Mongol | 21 | `Dac_ProductionReward_EventMongols2023_Evolving_MongolianFeast_1_CoinsFood` | 9 — 1, 4, 8, 12, 16, 21, 26, 31, 36 |
| WorldFair | 21 | `Dac_Building_Event_WorldFair_Evolving_Exhibition_1_Negotiation_PEGoods_Coins_Chest` | 12 — **2**, 5, 9, 12, 15, 19, 22, 25, 29, 32, 35, 39 |
| Polynesian | 28 | `Dac_Building_EventPolynesia_Evolving_DrumTower_1_Heal_SecGoods_Food_Chest` | 8 — **3**, 8, 14, 18, 24, 28, 34, 38 |
| Thai | 28 | `Dac_Building_EventThai2022_Evolving_ShrineOfReflection_1_Food_and_PuzzlePiece_Chest` | 8 — **5**, 9, 12, 15, 18, 23, 33, 40 |
| MaliEmpire | 28 | `Dac_Building_EventMaliEmpire2022_Evolving_Madrasa_1_Food_and_BarracksRefill_Chest` | 4 — **2**, 13, 21, 32 |

⚠️ **Quatre de ces tables ne commencent pas à `when: 1`** (WorldFair 2, Polynésie 3, Thai 5,
MaliEmpire-28 2). En dessous du premier palier, aucune entrée n'est applicable : c'est `null`, pas
un coffre vide, et surtout pas le palier suivant extrapolé (D13). Ces effets se débloquent
respectivement aux niveaux 21, 28, 28 et 28, donc la plage sans palier n'est jamais atteignable en
jeu — mais la donnée, elle, ne le dit pas.

### 8.3 Types de nœud rencontrés

Sur l'ensemble des deux chemins, **10 types de récompense** et **3 types de prérequis**, sans autre :

`RewardDefinitionDTO`, `MysteryChestRewardDTO`, `LootContainerRewardDTO`,
`DynamicActionChangeRewardDTO`, `RelicRewardDTO`, `InventoryItemRewardDTO`,
`SelectionKitRewardDTO`, `UnitRewardDTO`, `ResourceRewardDTO`,
`BuildingCustomizationRewardDTO` — et `ResearchRequirementDTO`, `AgeRequirementDTO`,
`RelicNotUnlockedRequirementDTO`.

Comptes sur l'arbre complet des 13 effets à coffre (65 paliers, 478 nœuds) :

| type | n |
|---|---:|
| `ResourceRewardDTO` | 136 |
| `RewardDefinitionDTO` | 80 |
| `DynamicActionChangeRewardDTO` | 74 |
| `MysteryChestRewardDTO` | 69 |
| `InventoryItemRewardDTO` | 59 |
| `RelicRewardDTO` | 31 |
| `BuildingCustomizationRewardDTO` | 15 |
| `LootContainerRewardDTO` | 11 |
| `SelectionKitRewardDTO` | 2 |
| `UnitRewardDTO` | 1 |

⚠️ `BuildingCustomizationRewardDTO` n'apparaît QUE dans les DAC empruntés du §8.2 (15 occurrences),
jamais dans les `finish.rewards` du §8.1. Il porte `definition` + `amount` + `id` **au niveau
racine**, sans `baseData` — seul type du domaine à le faire.

`baseData.replacementReward` existe (`Reward_AllAge_CollectorBuildings_1`) : la récompense de repli
quand les `requirements` ne passent pas.

### 8.4 Les reliques sont nommées

5 reliques distinctes : `relic.StringsOfTheAncients`, `relic.PriamsDiadem`, `relic.WarriorsCrown`,
`relic.HeadOfTheTrojanHorse`, `relic.TragedyAndComedy`. Chacune a ses clés
`Base.Relics.<Id>_{Name,Desc,Discovered}`. **Le game design nomme intégralement le contenu des
coffres** ; un affichage générique « relique » serait une limite d'UI, pas une lacune de donnée.

Clés de loca par famille de récompense :

| famille | clé |
|---|---|
| relique | `Base.Relics.<short>_Name` |
| item / selection kit | `Base.InventoryItems.<id>_Name` |
| unité | `Base.Units.<id>_Name` |
| ressource | `Base.Resources.<id avec \| → _>_Name` |
| personnalisation | `Base.BuildingCustomizations.<id>_Name` |

---

## 9. Alimentation du vault

### 9.1 Ce qu'on sacrifie

`eligibleResourceIds` ne contient que des `EvolutionToken|Building_*_Evolving_*`. Les **41** jetons
ainsi listés sont **exactement** les 41 qui portent un `HeritageContributionTraitDTO`
(`heritageXpPerUnit: 1`) — correspondance parfaite, aucun débordement dans un sens ni dans l'autre.

**3 évolutifs sur 44 n'ont aucun vault** : `Building_SeasonPass_Evolving_Conservatory_1`,
`Building_SeasonPass_Evolving_GreatGarden_1`, `Building_PlayerEncounters_Evolving_FountainOfYouth_1`
— les évolutifs non liés à un événement culturel. Cohérent avec
`Base.HeritageVault.Tutorial.TheHeritageVault` : « Every supported event culture and tradition has
its own Heritage ».

### 9.2 ⚠️ Le sacrifice d'un bâtiment entier n'a pas de taux déclaré

La loca l'atteste — `Base.HeritageVault.DonateBuildingConfirmDescription` : « Donating {0} will grant
{1} XP to this theme » ; `ConvertLevelsAmount` : « {0} level | {0} levels » — et
`ConstantsDefinition` porte les 3 seules constantes heritage du game design :

```
heritageConversionDuration:          "600s"
heritageConversionSkipCostPerMinute:  2.0
heritageSkipCostPerMinute:            0.5
```

**Mais aucun champ ne donne le taux niveau-de-bâtiment → xp.**

⚠️ **CONVENTION (c)** : hypothèse **1:1**, par symétrie avec le seul taux déclaré
(`heritageXpPerUnit: 1`). Portée par `HERITAGE_XP_PER_EVOLVING_LEVEL` dans
[`resolvers/heritage.ts`](../../resolvers/heritage.ts). Non confirmée par la donnée.

---

## 10. Formules Lua — 44 définitions, 81 références

**Le Heritage Vault est le premier consommateur de Lua du game design.**

| | Heritage | total | part |
|---|---:|---:|---:|
| `DynamicLuaLongDefinitionDTO` | **44** | 164 | **26,8 %** |
| Références Lua entrantes | **81** | 241 | **33,6 %** |
| `BoostDefinitionDTO` | 9 | 50 | 18,0 % |
| `DynamicActionChangeDefinitionDTO` | 56 | 1 403 | 4,0 % |
| `DynamicUnitStatChangeDefinitionDTO` | 2 | 55 | 3,6 % |
| `DynamicFloatValueDefinitionDTO` | 2 | 372 | 0,5 % |

Ventilation des 81 références :

| famille | définitions | références |
|---|---:|---:|
| Effets (`Lua_BuildingEffect_HeritageVault_*`) | 6 | **54** |
| Progression (`…LevelUpCost_*`, `KeeperReputation_LevelUpCost`) | 4 | **26** |
| Amplificateur (`Lua_HeritageVault_KeeperAmplifier_Modifier`) | 1 | 1 |
| Offres du gardien (`Lua_HeritageVault_KeeperOffer_*`) | 29 | **0** |
| Orphelines | 4 | 0 |

Détail des 54 : `RessourceBoost_1` 12, `CulturePoints_1` 12, `CultureLevel_1` 12, `RP_1` 9,
`Food_1` 5, `Coins_1` 4.
Détail des 26 : `KeeperReputation_LevelUpCost` 13, `LevelUpCost_1` 11, `ATH_LevelUpCost_1` 1,
`Polynesia_LevelUpCost_1` 1.

### 10.1 Les 4 définitions orphelines

⚠️ **`Lua_HeritageVault_XpPerLevel` — 0 référence, et contradictoire avec la formule branchée :**

```lua
return 25 * entityLevel * (entityLevel + 1) * (entityLevel + 2) / 3
```

Cubique : 50 au niveau 1, **1 891 000** au niveau 60, là où la formule réellement branchée donne 45.
Vestige d'un modèle abandonné, à ne surtout pas confondre avec la courbe active.

Trois autres, mêmes symptômes : `Lua_HeritageVault_Celtic_Coins`, `_ResearchPoints`, `_Supplies`.

### 10.2 Sous-langage employé

Vocabulaire lexical exhaustif des 44 scripts :

```
mots-clés     return (47), if (3), then (3), else (3), end (3)
fonctions     math.floor (40), math.max (1), math.ceil (1)
variables     keeperPurchaseCount (29), entityLevel (24), playerAgeOrder (13)
opérateurs    + - * / ^ < ( ) , .
longueur max  144 caractères
```

3 variables sur les 4 du game design (`entityAgeOrder` n'est pas employé par ce domaine), 3
fonctions sur 3, un seul bloc de branchement au maximum. **Intégralement couvert par
`resolvers/lua-formula.ts`, sans extension** — c'est d'ailleurs un script de ce domaine qui fixe la
borne des 144 caractères citée dans l'en-tête du module.

---

## 11. Ce que le domaine ne déclare pas

| # | Point | Statut |
|---|---|---|
| **H1** | **Catalogue des offres du gardien** | **Absent.** 29 prix, 0 offre, 0 rotation, 0 tirage. Non extractible — saisie manuelle en jeu. |
| **H2** | Portée de `keeperPurchaseCount` (global / par vault / par offre) | Inconnue. ⚠️ Convention explicite : par (vault, offre). |
| **H3** | Taux niveau-d'évolutif → xp au sacrifice | Non déclaré. ⚠️ Convention explicite : 1:1. |
| **H4** | Opérateur du schéma A (`modifier` × courbe) | Non déclaré. ⚠️ Convention (a), inférée par ordre de grandeur. |
| **H5** | Cible de l'amplificateur du gardien | Non déclarée par le DTO. ⚠️ Convention (b), déduite de la loca — **résout W2**. |
| **H6** | Ordre de composition de l'amplificateur avec les boosts globaux | Inconnu, non tranché. |
| **H7** | Plafond du rang de réputation | Non déclaré. La formule est prolongée. |
| **H8** | Table des apparences du bâtiment-marqueur | Absente (0 `BuildingSkinDefinitionDTO` rattaché) alors que la loca la décrit. |
| **H9** | Rien au-delà du niveau 30 (effets) / 24 (slots) pour `maxLevel = 60` | Constaté, sens indéterminé. |
| **H10** | `order` saute 13 et 14 | Constaté, sens indéterminé. |

---

## 12. Correspondance avec l'extraction

| ce document | code |
|---|---|
| §1, §3, §4 | `HeritageVaultExtract`, `HeritageSlotExtract`, `HeritageEffectExtract` |
| §2 | **pas d'extraction propre** — `BUILDING_EXTRACT`, `scope: "decoration"` |
| §4.4 (a) | commentaire d'en-tête de `resolvers/bonus.ts` |
| §5.1, §5.2 | `HeritageLevelScheme`, `getHeritageUpgradeCost()`, `getKeeperReputationCost()` |
| §5.3 | `BuildingAgeCurve.indexedBy: "playerAge"`, `HeritageExtractBundle.playerAgeOrderByAge` |
| §6 | `BuildingAgeCurve` via `resolvers/building-curves.ts` |
| §7.1 | `HeritageKeeperOfferFormula` — prix seuls |
| §7.2 | `KEEPER_PURCHASE_COUNT_SCOPE` |
| §7.3 (b) | `keeperAmplifierMultiplier()` |
| §8 | `HeritageRewardTier`, `HeritageRewardNode` |
| §9.2 (c) | `HERITAGE_XP_PER_EVOLVING_LEVEL` |
| §10 | `resolvers/lua-formula.ts`, inchangé |
| §11 | tests dédiés dans `resolvers/heritage.test.ts` |
