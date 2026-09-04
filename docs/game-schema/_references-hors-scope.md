# Références sortant du périmètre retenu

Audit exhaustif demandé avant exclusion des domaines hors scope. Méthode : pour chacune des
**6 231 entités racine des 7 domaines retenus**, parcours de toutes les valeurs `string` de tout
l'arbre, et résolution contre l'index des 11 970 ids racine du fichier.

Répartition du périmètre : Bâtiments 2 466 · Dynamic 2 032 · Technologies 894 · Socle 399 ·
Unités 262 · Wonders 105 · Commerce 73.

⚠️ **Correction (2026-08-29).** Deux types se sont révélés mal rattachés au fil du travail de
modélisation, et sortent du périmètre :
`ObstacleDefinitionDTO` (10, → Combat / Carte du monde, cf. `03-batiments.md` §9) et
`CrateCostDefinitionDTO` (392, → Alliance, cf. `04-technologies.md` §7).
**Le périmètre réel est de 5 829 entités**, et le domaine Technologies se réduit au seul
`TechnologyDefinitionDTO` (502).

Périmètre retenu : Socle, Dynamic, Bâtiments, Technologies, Wonders/Reliques/HeritageVault,
Unités (stats), Commerce.
Hors scope : Alliance, Monétisation/CRM, Carte du monde, Mini-jeux événementiels, Quêtes/Récompenses,
Combat.

## Verdict

**Oui — les domaines retenus référencent bien des entités hors scope.** 8 types cibles, ~2 900 arêtes.
Le gros du volume vient d'un seul mécanisme : les **arbres de récompense embarqués**.

## 1. `RewardDefinitionDTO` — ~2 100 arêtes (le point de contact majeur)

| Source | occ. |
|---|---|
| `DynamicActionChangeDefinitionDTO.mapping[].values[].then.rewards[]…` | 604 + 397 (× 2 chemins `id` / `baseData.id`) |
| `BuildingDefinitionDTO.components[].finish.rewards[]…` | 42 + 41 (× 2) |
| `CustomizationCollectionDefinitionDTO.complete.rewards[]…` | 19 + 3 (× 2) |
| `HeritageVaultDefinitionDTO.effects[].components[].finish.rewards[]…` | 5 + 4 (× 2) |
| `ReworkedWonderDefinitionDTO.components[].finish.rewards[]` / `.behaviours[].rewards[]` | 3 + 3 (× 2) |
| `WonderCollectionDefinitionDTO.buyChest.rewards[]` | 3 (× 2) |
| `TechnologyDefinitionDTO.components[].finish.rewards[]` | 1 |

**Ce ne sont pas des références mais des copies intégrales** (règle C5, vérifiée 42/42 côté
Bâtiments) : l'objet embarqué est identique à la `RewardDefinitionDTO` racine de même id, au `@type`
de premier niveau près. Le champ `baseData.id` porte le même id que `id`, d'où le double comptage.

**Conséquence pratique : le domaine Récompenses reste excluable.** Là où un arbre de récompense
apparaît dans un domaine retenu, on le modélise comme un type opaque `Reward` — la structure
complète est déjà entièrement décrite par les `RewardDefinitionDTO` racine, qu'on traitera si et
quand ce domaine entre en scope. Rien n'est perdu.

## 2. `CommanderDefinitionDTO` — 279 arêtes

Toujours **au fond d'arbres de récompense**, jamais en référence directe depuis une entité retenue :

| Source | occ. |
|---|---|
| `DynamicActionChangeDefinitionDTO…rewards[]….definition` | 126 + 79 |
| `BuildingDefinitionDTO.components[].finish.rewards[]….definition` | 50 + 8 |
| `CustomizationCollectionDefinitionDTO.complete.rewards[]….definition` | 10 + 6 |
| `TechnologyDefinitionDTO.components[].finish.rewards[].commander` | 1 |

Couvert par le traitement opaque du §1. **L'exclusion de Combat/Commanders reste valide.**

## 3. `AchievementDefinitionDTO` — 223 arêtes ⚠️

```
BuildingSkinDefinitionDTO.requirements[].achievementId  →  achievement.*     223 occ.
```

**C'est la seule référence structurelle directe et systématique vers un domaine hors scope.**
Elle concerne 223 des 620 `BuildingSkinDefinitionDTO` (soit **toutes celles portant un
`SkinCustomizationComponentDTO`**) et n'est pas noyée dans un arbre de récompense : c'est un champ de
premier niveau d'une condition de déblocage.

Exemples : `building_skin.skin_season_pass__culture_site__compact1` → `achievement.SeasonPass_CultureSite_Compact1`.

➡️ **Recommandation au moment du domaine Bâtiments :** modéliser `achievementId` comme une référence
externe typée et non résolue, et décider alors s'il faut absorber `AchievementDefinitionDTO` (223
entités, 72 Ko seulement — peu coûteux) pour que les conditions de déblocage des skins soient
lisibles. Sans cela, le domaine Bâtiments aura un trou fonctionnel explicite.

## 4. Autres — 78 arêtes

| Cible | Source | occ. | Nature |
|---|---|---|---|
| `SelectionKitDefinitionDTO` | `CustomizationCollection…rewards[].selectionKit` | 32 | dans un arbre de récompense |
| | `DynamicActionChange…rewards[].selectionKit` | 14 | idem |
| | `HeritageVault…rewards[].selectionKit` | 2 | idem |
| | `BuildingDefinition…finish.rewards[].selectionKit` | 1 | idem |
| `BoardGameEventDefinitionDTO` | `DynamicActionChange…requirements[].eventId` | 31 | condition |
| | `BuildingCustomizationDefinitionDTO.components[].name` | 12 | ⚠️ voir ci-dessous |
| | `DynamicActionChangeDefinitionDTO.mapping[].values[].when` | 7 | clé de mapping (`EventIdDynamicChangeDTO`) |
| | `BuildingDefinition…requirements[].eventId` | 3 | condition |
| | `ResourceDefinitionDTO.traits[]:OriginTraitDTO.name` | 2 | ⚠️ voir ci-dessous |
| | `CustomizationCollectionDefinitionDTO.components[].name` | 1 | ⚠️ voir ci-dessous |
| | `HeritageVaultDefinitionDTO.event` | 1 | condition |
| `IncidentDefinitionDTO` | `TechnologyDefinitionDTO.components[].finish.rewards[].incident` | 13 | récompense de techno |
| `PityDefinitionDTO` | `WonderCollection.buyChest.rewards[]….pityDefinitionId` | 6 | dans un arbre de récompense |
| `RegionDefinitionDTO` | `TechnologyDefinitionDTO.components[].finish.requirements[].regions[]` | 5 | ⚠️ voir ci-dessous |

⚠️ **`…components[].name` et `OriginTraitDTO.name` résolvent vers un id d'événement.** Un champ nommé
`name` qui contient en réalité une clé étrangère (`Event_Polynesia`) : c'est peut-être une vraie
référence, peut-être une simple homonymie de chaîne. Non tranché — à revoir aux domaines concernés.

⚠️ **`TechnologyDefinitionDTO…requirements[].regions[]` (5 occ.)** : les technologies « Rise of X »
(`Technology_MinoanEra_RiseOfEgypt`, `Technology_ByzantineEra_RiseOfTheMayas`,
`Technology_KingdomOfSicily_RiseOfArabia`…) exigent la conquête d'une région précise de la carte du
monde. **Ces 5 technologies auront une condition de déblocage non résolvable** sans le domaine Carte
du monde. Peu nombreuses, mais ce sont les technologies qui débloquent les cités secondaires — donc
sémantiquement importantes. À signaler explicitement dans `03-technologies.md`.

⚠️ **`TechnologyDefinitionDTO…rewards[].incident` (13 occ.)** : idem, 13 technologies accordent un
incident (`Incident_BronzeAge_Capital_Mammoth_3`) — récompense non résolvable en scope actuel.

## 5. Faux positifs écartés

L'heuristique « champ suffixé `Id` dont la valeur n'est pas un id racine connu » a levé des alertes
qui ne sont **pas** des références cassées :

- **`assetId`** (~1 100 occ.) : identifiant d'asset graphique client, pas une clé étrangère.
- **`themeId`** (26 occ.) : idem, pas de type cible dans les données.
- **`TradingHubDefinitionDTO.expansionDefinitionId`** (32) : pointe vers
  `TradingCultureExpansionDefinitionDTO.definitionId` (`trading_expansion.*`), **pas** vers
  `ExpansionDefinitionDTO.id` malgré le nom. 0/32 résolvent contre les 832 `Expansion_*`.
  → **Le domaine Commerce est refermé sur lui-même sur cet axe.** Piège de nommage à documenter.
- **`definitionId` des types Commerce** (32+19+16+1) : ce sont leurs **propres** identifiants
  (types sans champ `id`, cf. C6), pas des références.
- **`HeritageVaultDefinitionDTO.slots[].unlockAction.costs[].itemDefinitionId`** (39) : pointe vers
  `InventoryItemDefinitionDTO.definitionId` (valeur unique : `InventoryItem_AgeUpgradeKit_Evolving`).
  `InventoryItemDefinitionDTO` (14 entités) a été retiré du Socle par décision de scope.
  → **1 référence sortante réelle pour le domaine HeritageVault.** Coût d'absorption négligeable si
  on veut la fermer.
- **`ResourceDefinitionDTO.traits[]:DynamicLimitTraitDTO.definitionId`** (1) : pointe vers
  `DynamicLimitDefinitionDTO.definitionId` — **en scope**, résolu.

## 6. Synthèse décisionnelle

| Domaine hors scope | Impact sur les domaines retenus | Exclusion tenable ? |
|---|---|---|
| Quêtes / Récompenses | ~2 100 arêtes, mais **copies intégrales** traitables en type opaque | ✅ oui |
| Combat / Commanders | 279 arêtes, toutes dans des arbres de récompense | ✅ oui |
| Mini-jeux événementiels | 57 arêtes, conditions et clés de mapping | ✅ oui, avec ids d'événement non résolus |
| Achievements | **223 arêtes directes** sur les skins de bâtiment | ⚠️ trou fonctionnel assumé, ou absorber (72 Ko) |
| Carte du monde | 18 arêtes, dont **5 prérequis de technologies « Rise of X »** | ⚠️ trou assumé, à signaler dans le doc Technologies |
| Monétisation / CRM | **0 arête** | ✅ oui, exclusion nette |
| Alliance | **0 arête** | ✅ oui, exclusion nette |
