# Modèle canonique — game design Rise of Cultures

Modèle de données décrivant **ce qui est effectivement dans** `gamedesign.json` et `loca.json`.
Ni moteur, ni simulation : structure, types, relations, optionalité réelle.
Toute donnée ambiguë, incomplète ou incohérente est signalée comme telle, jamais comblée.

Consommateur : un **Layout Builder** (nombre / position / type d'expansions par ville). Ce cadrage
sert à arbitrer la profondeur d'investigation, pas à masquer des constats — ce qui est écarté est
marqué « hors besoin produit, non poursuivi ».

Dernière mise à jour : 2026-08-31.

⚠️ Le **Heritage Vault** a depuis été extrait et branché sur une couche de résolution. Sa
description complète est sortie de `05-wonders-reliques-heritage.md` §4 vers un document dédié,
[`heritage-vault-data-reference.md`](heritage-vault-data-reference.md) — le §4 de `05` reste valide
et sert d'entrée en matière. Le point W2 du §5 ci-dessous est résolu en conséquence.

---

## 1. Index

| Doc | Domaine | Types | Entités | Poids |
|---|---|---|---|---|
| [`00-conventions.md`](00-conventions.md) | **Conventions d'encodage** (C1–C9) — transversales, à lire en premier | — | — | — |
| [`01-socle.md`](01-socle.md) | Socle : Ages, Cities, Resources, Constants, Boosts | 5 | 399 | 0,34 Mo |
| [`02-dynamic.md`](02-dynamic.md) | Couche Dynamic : tables et formules de paramétrage | 6 | 2 032 | 3,93 Mo |
| [`03-batiments.md`](03-batiments.md) | Bâtiments, skins, personnalisations, expansions | 8 | 2 456 | 2,65 Mo |
| [`04-technologies.md`](04-technologies.md) | Technologies | 1 | 502 | 0,61 Mo |
| [`05-wonders-reliques-heritage.md`](05-wonders-reliques-heritage.md) | Wonders, Reliques, HeritageVault | 6 | 105 | 2,15 Mo |
| [`06-unites-stats.md`](06-unites-stats.md) | Unités : statistiques et types (hors combat) | 2 | 262 | 0,54 Mo |
| [`07-commerce.md`](07-commerce.md) | Commerce (Trading Culture) | 6 | 73 | 0,10 Mo |
| [`heritage-vault-data-reference.md`](heritage-vault-data-reference.md) | **Heritage Vault** — référence de données du domaine extrait | 1 (+6 rattachés) | 13 (+126) | — |
| [`_references-hors-scope.md`](_references-hors-scope.md) | Audit des références sortant du périmètre | — | — | — |
| **Total périmètre** | | **34** | **5 829** | **10,33 Mo** |

Fichier source complet : 12 122 entités, 93 types. Le périmètre couvre **48 % des entités**.
**151 sous-types DTO imbriqués distincts** y sont rencontrés, au-delà des 34 types racine — c'est là
qu'est le vrai volume de modélisation.

**Hors scope :** Alliance, Monétisation/CRM, Carte du monde, Mini-jeux événementiels,
Quêtes/Récompenses, Combat (Battlefield, Waves, Commanders), Achievements.

### Corrections de périmètre

Deux types initialement rattachés à tort, retirés en cours de route :

| Type | n | Rattaché à tort à | Appartient à | Preuve |
|---|---|---|---|---|
| `ObstacleDefinitionDTO` | 10 | Bâtiments | Combat / Carte du monde | 653 réf., toutes depuis `Battlefield*`/`Region` |
| `CrateCostDefinitionDTO` | 392 | Technologies | Alliance | 588 réf., toutes depuis `Alliance*` ; ids `crate_cost.quarterUpgrade_*` |

---

## 2. Intégrité référentielle — vue consolidée

Sur l'ensemble du périmètre, tous les champs au nom manifestement référentiel
(`*DefinitionId`, `statDefinitionId`, `target`, `achievementId`…) ont été résolus contre l'union des
deux espaces d'identifiants (`id` **et** `definitionId`/`themeId`, cf. C6) :

> **41 032 références résolues, 0 cassée.**

Seule exception structurelle : les `assetId`, identifiants d'asset client sans type cible — **sauf
dans le domaine Unités**, où `assetId` est au contraire une vraie clé étrangère (249/249, cf.
`06-unites-stats.md` §6.3).

⚠️ Ce résultat n'a été obtenu qu'après **deux corrections d'erreurs de ma part**, toutes deux dues à
un contrôle mené contre le seul espace `id` :

- `HeritageVaultMarkerComponentDTO.themeId` → `HeritageVaultDefinition.themeId` (13/13) ;
- `InstantExpansionConstructionUnlockedRewardDTO.constructionComponentId` →
  `ConstructionComponentDTO.id` imbriqué dans un `ExpansionCostsDTO` (1/1, lien réciproque).

**Leçon méthodologique :** un index d'ids racine ne suffit pas. Certaines références visent
`definitionId`, `themeId`, ou un **id de composant imbriqué**.

---

## 3. Pièges de typage — ce qui casse un parseur naïf

Rassemblés ici parce qu'ils sont dispersés dans les 7 documents. Chacun a été vérifié.

### 3.1 Formes de sérialisation

| # | Piège | Où | Détail |
|---|---|---|---|
| P1 | **`int64` sérialisé en `string`** | partout | `amount`, `max`, `when`, `maxIncrease` sont des chaînes ; `factor`, `value`, `modifier`, `x`, `y`, `order` sont des nombres |
| P2 | **`order` : `string` sur Resource, `int` sur Age/City** | Socle | deux champs protobuf différents, même nom |
| P3 | **`duration` : `Duration` string *et* `int` de secondes** | Commerce | `"21600s"` sur `ProductionComponentDTO` **et** `18000` sur `UnlockTradingHubComponentDTO`, **dans le même type racine** |
| P4 | **`@type` absent sur les objets monomorphes** | partout | son absence signale un type fixe, pas une anomalie |
| P5 | **Trois conventions d'échelle** | transverse | fraction (`modifier: 0.05`) · points de % via produit (`0.01 × 10.0`) · entier de % (`discountPercent: 15`) |

### 3.2 Structures qui ne sont pas ce que leur nom suggère

| # | Piège | Où | Détail |
|---|---|---|---|
| P6 | **`producedUnits` est une `map`**, pas une liste | Bâtiments, Wonders | `{ "<Unit.id>": int }` |
| P7 | **`thresholds` est une `map`**, pas une liste | Unités | `{ "Fast": 1.0, … }` |
| P8 | **`values[]` est une liste, pas une map** | Dynamic | une table contient des `when` **dupliqués** avec valeurs différentes ; la typer en dict perd une valeur |
| P9 | **`mapping` : liste ou objet selon le type racine** | Dynamic | liste pour DAC/DUSC, objet pour DFV/DUC, absent pour Lua/Limit |
| P10 | **`limitsByGroup[]` contient 18 entrées clées par `resource`** | Technologies | nom trompeur ; formes mutuellement exclusives |
| P11 | **`happinessEffects[0]` est un objet vide** | Bâtiments | tableau positionnel, indice implicite non porté par un champ |

### 3.3 Champs homonymes ou polysémiques

| # | Piège | Où | Détail |
|---|---|---|---|
| P12 | **`baseData.id` : référence *ou* identifiant propre** | Technologies | 581 réf. vers la cible débloquée, 23 ids synthétiques — la résolution dépend du `@type` porteur |
| P13 | **`hidden` : dans `baseData` *ou* à la racine** | Technologies | 33 récompenses n'ont pas de `baseData` |
| P14 | **`id` qui est une clé étrangère** | Bâtiments, Technologies | `ResearchRequirementDTO.id` → `Technology.id` (1 052 occ.) |
| P15 | **`assetId` : FK dans Unités, opaque ailleurs** | transverse | 249/249 résolus côté unités uniquement |
| P16 | **deux `modifier` sans rapport** | Socle | `BoostDefinition.modifier` (la courbe) vs `boostType.modifier` (un enum) |
| P17 | **`group` : espaces de valeurs disjoints** | Commerce vs Bâtiments | `TradingHub.group` (`village`/`city`) n'est pas un `Building.group` |
| P18 | **`cities[]` mélange deux espaces de noms** | Socle | `City.id` **ou** `TradingCulture.definitionId` (41 occ.) |
| P19 | **`level` : deux mécaniques incompatibles** | Bâtiments | rang dans la chaîne d'upgrade (par `id`) vs niveau runtime borné par `maxLevel` — voir §4 |

### 3.4 Absence ≠ zéro

| # | Piège | Où | Volume |
|---|---|---|---|
| P20 | **`then` vide au lieu de 0.0** | Dynamic, Wonders | 46 dans `Dv`/`Dusc`, 26 dans `Boost.modifier` |
| P21 | **stat déclarée sans `value`** | Unités | 33 composants sur 6 unités `bastion` |
| P22 | **`complete` est un objet vide** | Bâtiments | 934/934, sans exception |
| P23 | **lecture par palier obligatoire** | transverse (C9) | 42 % des tables ont des clés manquantes ; clé absente = « inchangé », jamais « manquant » |

### 3.5 Dénormalisation

| # | Piège | Détail |
|---|---|---|
| P24 | **copies intégrales, pas des références** | `CityDefinition.cityInitDefinition`, `.softCurrencyResourceDefinitions[]`, `Building…finish.rewards[]`, `WonderLevelUp.dynamicCosts` — identiques à l'entité racine **au `@type` de premier niveau près** (vérifié 64/64) |

---

## 4. Le piège `level` — récapitulatif

Le point le plus structurant du modèle, croisé dans quatre domaines.

| Mécanique | Où | `level` signifie | Plafond |
|---|---|---|---|
| **A — chaîne de définitions** | la plupart des bâtiments | rang figé ; chaque niveau est une `BuildingDefinitionDTO` distincte, chaînée par `UpgradeComponentDTO.target` | fin de chaîne (jusqu'à 42) |
| **B — niveau runtime** | 44 `evolving`, 17 `collectable`, 13 HeritageVault, 32 comptoirs, 28 wonders | état d'instance **absent du game design** ; visible seulement comme clé `when` | `LevelUpComponentDTO.maxLevel` (60 / 40 / 60 / 6) ou `ConstantsDefinition.wonders.maximumWonderLevel` (30) |

⚠️ `BuildingDefinitionDTO.level` vaut **toujours 1** pour les `evolving`. Les deux notions ne doivent
jamais partager un champ.

✅ `valueLimit` des formules dynamiques est la borne du domaine de la variable : **60 ↔ `evolving`,
40 ↔ `collectable`, 100 000 ↔ saturation de puissance de relique** — 986 définitions rattachées,
**zéro mélange**. La contradiction apparente avec `maximumWonderLevel = 30` est levée : aucune
définition à `valueLimit = 60` n'est rattachée à un wonder, et les tables de wonder ont exactement
30 clés.

---

## 5. Points à valider empiriquement

Ce que les données **ne déclarent pas** et qui affecte le calcul. Classé par impact.

| # | Point | Domaine | Ce qu'on sait / ce qui manque |
|---|---|---|---|
| **W2** | **Amplificateur Keeper** | Wonders/Heritage | ⚠️ **Résolu par la loca, pas par le DTO — tranché en convention.** Magnitude : `0.01 × (entityLevel − 1)`, soit +59 % au niveau 60. Deux points manquaient : (1) le sens d'`entityLevel`, (2) la portée. `Base.HeritageVault.Keeper.InfoTooltip` (« Every {0} points raises your reputation level by 1, and each level adds +1% to this heritage building's production and boosts ») et `Keeper.BuildingOutputBoost` (« +{0}% Building output ») donnent les deux : `entityLevel` est le **rang de réputation du gardien**, pas le niveau du vault ; la cible est **toutes les productions et tous les boosts du bâtiment heritage du même thème**, en composition **multiplicative**. Le DTO ne déclare toujours rien : c'est une déduction documentée, portée par `keeperAmplifierMultiplier()` dans [`resolvers/heritage.ts`](../../resolvers/heritage.ts), testée, et corrigeable à un seul endroit. **Reste inconnu : l'ordre de composition avec les boosts globaux du joueur, et l'absence de tout plafond de rang déclaré.** |
| **W3** | **`BoostAmplifierComponentDTO.modifier` est un stub vide** | Wonders/Heritage | Une seule entrée `when: "0"` au `then` vide. Lire la table — le chemin normal des 49 autres boosts — **donne zéro**. Toute la valeur est dans le Lua. |
| **U1** | **`UnitStat_Damage` n'est portée par aucune unité** | Unités | Cible de 79 boosts, mais les unités portent `MinDamage`/`MaxDamage`. **Le report d'un boost « +X % dégâts » sur ces deux stats n'est déclaré nulle part.** |
| **W4** | **Comptage par tag** | Wonders | Les 12 tables `WonderTagDynamicChangeDTO` vont **toutes** de 0 à 7, alors que les tags sont portés par 3 à 10 wonders. Le préfixe `WonderMaterial_` suggère un comptage de **matériaux**, non déclaré. |
| **W1** | **Opérateur `modifier` × table** | Wonders, Unités | ✅ **Corroboré** : sans table, `modifier` est la fraction (`0.05` = +5 %) ; avec table, il vaut 0.01 et la table porte les points de %. Les deux branches donnent 1–15 %. **Mais aucun champ ne distingue les deux régimes.** |
| **D1** | **Table puis formule** | Dynamic | ✅ **Établi par 3 mesures** : max tabulé ≤ `valueLimit` (1 135/1 135), courbes distinctes (7 435 divergences), convergence à la jonction (116/170 à < 0,1 %). **Inféré, jamais déclaré.** |
| **U2** | **`value` × `factor`** | Unités | 140 composants portent les deux. `DynamicStateChangeDTO { factor }` rend « base × facteur » cohérent ; opérateur non déclaré. |
| **W8** | **`ConditionalBonusComponentDTO.cap = 5`** | Wonders | Ni période ni unité ; les 3 `condition` sont des objets vides. |
| **B5** | **`freeProductionSlots` ↔ `UnlockableProductionSlotDTO`** | Bâtiments | Aucune règle déductible : les combinaisons observées sont mutuellement incohérentes. |
| **S2** | **Décalage d'âge des `CityInit`** | Bâtiments | Les biens octroyés sont ceux de l'âge **précédent** le suffixe (−1 sur 9 entités), avec 2 exceptions (`_END` : 0, `_TestBattle` : −2). Régularité trop nette pour être fortuite, sens indéterminé. |

### Écarté par cadrage produit

| # | Point | Raison |
|---|---|---|
| B3 | Appariement barème `ExpansionCostsDTO` → expansion (810/832 non appariées) | Le Layout Builder n'utilise pas les coûts de déblocage ; nombre / position / type d'expansion sont complets et intègres |
| — | `producedUnits` (map unité → nombre) | Production d'unités non gérée ; seule la forme `map` est à retenir (P6) |

---

## 6. Incohérences de données constatées

Distinctes du §5 : ici la donnée est présente mais se contredit ou est inexploitable.

| Point | Domaine | Détail |
|---|---|---|
| `AgeDefinitionDTO.order` saute **16** | Socle | 1…15 puis 17 ; `order` n'est pas un index dense |
| `buildingGroupSorting` désynchronisé | Bâtiments | 71 entrées / 70 distinctes (`premiumHome` en double), 1 entrée morte, **107 des 176 `group` réels absents**. Pas un référentiel |
| `palaceOfAachen` : valeur morte | Socle/Bâtiments | Seule des 6 valeurs de `BoostProductionTimeComponentDTO.buildingGroup` à ne correspondre à aucun `group` ; l'info utile est dans `wonderDefinitionId` |
| 44 technologies sans `cities`… | Technologies/Commerce | …mais **57 de leurs récompenses portent `cities: ["City_Capital"]`**. L'absence est une incohérence, pas un discriminant de branche |
| 10 des 11 `IncreaseLimitRewardDTO` sans `type` | Technologies | Montant connu, limite cible inconnue — **inexploitables** |
| 1 table à `when` dupliqués | Dynamic | `Dv_…GreatGarden_1_CultureValues_AgeOfTheFranks` : 17 clés en double, valeurs différentes |
| `TimberFraming` porté par 2 technologies | Technologies | `name` n'est pas une clé |
| Aucun effet ni slot de vault au-delà du niveau 30 | Heritage | alors que `maxLevel = 60` — la moitié de la progression n'ouvre rien |
| Palier `Slow` inatteignable | Unités | seuil 0.4, valeur minimale réelle 0.5 |
| `Unit_AgeOfTheFranks_Carolingians_Palisades` | Unités | `age = "EarlyRome"` — deux âges réels qui se contredisent |
| `Building_DawnAge_Farm_Rural_1` | Bâtiments | porte un `UpgradeComponentDTO` mais **aucun `level`**, alors qu'il est racine de la plus longue chaîne (41 maillons) |
| 11 `LevelUpComponentDTO` sans `maxLevel` | Bâtiments | progression sans plafond déclaré |
| 2 `CityInitDefinitionDTO` `_TestBattle` | Bâtiments | données de test apparemment laissées en production |
| 30 `wonderIds` pour 28 wonders | Wonders | doublons entre collections ou références absentes |
| `LimitTradingGoods` jamais référencé | Dynamic | seul orphelin des 2 032 définitions dynamiques |
| `expeditionPort` jamais utilisé | Bâtiments | seule entrée morte de `buildingGroupSorting` |

---

## 7. Hypothèses infirmées en cours de route

Consignées parce qu'elles étaient plausibles et qu'un modèle pourrait les reprendre à tort.

| Hypothèse | Statut | Preuve |
|---|---|---|
| « Les unités non traduites sont les unités ennemies » (posée en C7) | **Infirmée comme règle** | Les 61 unités `Player` sont bien toutes traduites, mais `Mayas` (6), `ByzantineEmpire` (6), `Spartans` (4), `Minoan` (4) le sont aussi. Tendance, pas critère |
| « `valueLimit = 60` contredit `maximumWonderLevel = 30` » | **Levée** | Deux « level » distincts ; 60 ↔ `evolving`, jamais un wonder |
| « `TradingHub.expansionDefinitionId` → expansion de ville » | **Infirmée** | 32/32 vers `TradingCultureExpansion`, **0/32** vers les 832 `ExpansionDefinitionDTO` |
| « Le rattachement des `CityInit` orphelins n'est lisible que dans l'id » | **Partiellement infirmée** | La **cité** est récupérable depuis `initialGridAreas[].city` (24/24) ; seul l'**âge** dépend du nom |
| « `themeId` / `constructionComponentId` ne résolvent vers rien » | **Infirmée (erreur de ma part)** | Les deux résolvent ; contrôle initial mené contre le seul espace `id` — voir §2 |
| « La branche Commerce = les 44 technologies sans `cities` » | **Trop simple** | 12/44 seulement ont une récompense commerciale ; et 3 technologies *avec* `cities` portent les récompenses structurantes, dont celle qui ouvre la culture ottomane |

---

## 8. Ce que les données ne contiennent pas

À ne pas chercher : ces informations sont absentes, pas cachées.

- **Les événements ne sont pas des entités.** Aucun `EventDefinitionDTO`. Les ~30 événements
  n'existent que par convention de nommage d'id, DTO satellites et requirements.
- **La *déclaration* de la grammaire des formules.** `formula` (1 136) et `luaScript` (164) restent des
  chaînes : aucun champ ne décrit leur syntaxe ni les variables de contexte. Les deux sous-langages
  ont en revanche été **recensés exhaustivement** et sont évalués par `resolvers/lua-formula.ts`
  (`02-dynamic.md` §5.3, §6.1) — 4 variables Lua, 3 fonctions, 9 jetons côté `formula`. Mesuré, pas
  déclaré : une version ultérieure du game design peut sortir du périmètre.
- **Les opérateurs de composition.** Aucun champ n'exprime comment deux boosts se combinent.
- **L'effet de `HeavySkillComponentDTO`** (78 occurrences, marqueur sans paramètre).
- **Le niveau runtime** des entités à mécanique B — par nature un état de partie.
- **Le compteur `minTrades`** référencé par `TradeRelationshipLevelDefinitionDTO`.
- **L'appariement barème → expansion** (B3, écarté par cadrage produit).
