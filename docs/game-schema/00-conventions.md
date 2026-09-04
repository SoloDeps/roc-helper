# Conventions d'encodage — transversales à tous les domaines

Source : `gamedesign.json` (63 Mo, 12 122 entités racine) et `loca.json` (10 820 clés, locale `en_DK`).
Établi le 2026-08-29. Ces règles s'appliquent à **tous** les domaines et ne sont pas répétées dans
les fiches de domaine.

## C1 — Enveloppe

```
gamedesign.json
└── content[0]                       @type = GameDesignResponse, + checksum
    └── content[]                    tableau PLAT de 12 122 entités racine
loca.json
└── content[0]                       @type = LocaResponse, + locale, checksum, version
    └── translations[]               { key: string, values: string[] }
```

Il n'existe **aucun regroupement par domaine dans les données**. Le seul discriminant est `@type`.
Le découpage en domaines documenté ici est une construction de notre part.

## C2 — Discriminant `@type`

Toute valeur de `@type` est de la forme `type.googleapis.com/<Nom>`. Dans cette documentation on note
uniquement `<Nom>`. Le champ est présent :

- sur toutes les entités racine ;
- sur les objets imbriqués **polymorphes** (variantes d'une union) ;
- **pas** sur les objets imbriqués monomorphes (ex. les éléments de `resourceChanges[]`,
  `ageFactors[]`, `initialGridAreas[]`, `values[]` d'un mapping dynamique).

L'absence de `@type` sur un objet imbriqué n'est donc pas une anomalie : elle signale un type fixe.

## C3 — Entiers 64 bits sérialisés en chaîne

Encodage protobuf-JSON standard : les champs `int64`/`uint64` sont émis **en string**, les `int32`
et `float`/`double` en nombre JSON. Conséquence directe, observée partout dans les données :

| Émis en `string` | Émis en nombre |
|---|---|
| `ResourceDTO.amount`, `UnitCostDTO.amount` | `factor`, `modifier`, `value`, `valueLimit` (float) |
| `CappingTraitDTO.max`, `DynamicLimitDefinitionDTO.max` | `x`, `y`, `width`, `height`, `order` de `AgeDefinitionDTO`/`CityDefinitionDTO` (int32) |
| `ResourceDefinitionDTO.order` | `points`, `expansionSize` |
| `when` des mappings dynamiques (même quand numérique) | |

⚠️ `order` est un `string` sur `ResourceDefinitionDTO` mais un `int` sur `AgeDefinitionDTO` et
`CityDefinitionDTO`. Ce n'est pas une erreur de lecture : ce sont deux champs de types protobuf
différents portant le même nom. Tout modèle doit les typer séparément.

## C4 — Durées

Sérialisation `google.protobuf.Duration` : chaîne suffixée `s` (`"600s"`, `"172800s"`, `"86400s"`).
Certaines durées sont en revanche des `int` de secondes nues (`ConstantsDefinitionDTO.incident.*`).
Les deux formes coexistent ; ne pas supposer l'une ou l'autre sans vérifier le champ.

## C5 — Dénormalisation par copie intégrale

Plusieurs entités **embarquent une copie complète** d'une autre entité racine plutôt qu'une
référence par id. Règle vérifiée exhaustivement sur les cas rencontrés :

> La copie embarquée est **identique octet pour octet à l'entité racine de même `id`, à l'unique
> exception du champ `@type` de premier niveau, qui est omis dans la copie.**

Cas confirmés (100 % des occurrences) :

| Porteur | Champ | Cible | Vérif. |
|---|---|---|---|
| `CityDefinitionDTO` | `cityInitDefinition` | `CityInitDefinitionDTO` | 6/6 |
| `CityDefinitionDTO` | `softCurrencyResourceDefinitions[]` | `ResourceDefinitionDTO` | 16/16 |
| `BuildingDefinitionDTO` | `components[].finish.rewards[]` | `RewardDefinitionDTO` | 42/42 |

Conséquence pour le modèle : ces champs se modélisent comme **des références résolues**, pas comme
des structures autonomes. Aucune divergence de contenu n'a été trouvée à ce jour ; si une divergence
apparaissait sur un autre domaine, elle devrait être signalée comme incohérence de données et non
absorbée silencieusement.

## C6 — Identifiants

- 11 970 entités racine sur 12 122 portent un champ `id`. **Ces 11 970 ids sont globalement uniques**,
  tous types confondus — zéro collision. Un espace de noms unique est donc une hypothèse sûre.
- 16 types racine n'ont **pas** de champ `id`. Deux sous-cas :
  - identifiant sous un autre nom : `definitionId` (`TradingHubDefinitionDTO`,
    `TradingCultureExpansionDefinitionDTO`, `TradingCultureHubEnhancementDefinitionDTO`,
    `TradingCultureDefinitionDTO`, `DynamicLimitDefinitionDTO`, `InventoryItemDefinitionDTO`),
    `eventDefinitionId` (`EventShopDefinitionDTO`) ;
  - aucun identifiant : `HeritageVaultDefinitionDTO`, `RoleDefinitionDTO`,
    `TextValidationConfigurationDTO`, `OfferWallSegmentDefinitionDTO`, `VideoRewardDefinitionDTO`,
    `GameDesignVersionInfo`, `FriendReferralDefinitionDTO`, `OfferwallRewardDefinitionDTO`,
    `AllianceConfigurationDefinitionDTO`.
- ⚠️ Les ids `definitionId` vivent dans un espace **disjoint** des ids `id` : ils sont préfixés par
  un namespace en minuscules (`trading_hub.`, `trading_expansion.`, `trading_culture.`,
  `dynamic_lua_long.`, `building_skin.`, `achievement.`). Un champ nommé `xxxDefinitionId` peut
  donc pointer vers l'un ou l'autre espace selon le domaine — à vérifier au cas par cas.
- Certains ids contiennent un `|` comme séparateur de namespace interne :
  `EvolutionToken|<buildingId>`, `BuildingPiece|<buildingId>`, `DYN|<Age>_GoodN`.

## C7 — Localisation

Convention dominante : `Base.<Namespace>.<id>_Name` et `Base.<Namespace>.<id>_Desc`.
Taux de rattachement mesuré sur `_Name` :

| Type | Namespace | Rattachés |
|---|---|---|
| `BuildingDefinitionDTO` | `Base.Buildings` | 644 / 693 |
| `TechnologyDefinitionDTO` | `Base.Technologies` | 463 / 502 |
| `ResourceDefinitionDTO` | `Base.Resources` | 220 / 326 |
| `UnitDefinitionDTO` | `Base.Units` | 120 / 249 |

Les non-rattachés utilisent la même convention de clé — ils n'ont simplement **pas d'entrée de
traduction**. À traiter comme « libellé absent », pas comme « clé introuvable ».

⚠️ **Correction (`06-unites-stats.md` §6.4)** : l'hypothèse « les unités non traduites sont les
unités adverses/PNJ » est **infirmée comme règle**. Les 61 unités `Player` sont bien toutes
traduites, mais plusieurs factions adverses le sont aussi (`Mayas` 6, `ByzantineEmpire` 6,
`Spartans` 4, `Minoan` 4). C'est une tendance, pas un critère.

## C8 — Ce qui n'est pas modélisable en schéma

- `DynamicLuaLongDefinitionDTO.luaScript` : expression Lua en chaîne (164 entrées). Logique
  impérative, hors schéma. Voir `02-dynamic.md`.
- `DynamicFormula*CaseDefinitionDTO.formula` : expression arithmétique en chaîne (1 136 occurrences,
  dont 1 124 portées par une définition racine et 12 inline dans `BoostDefinitionDTO.modifier`). Idem.

⚠️ « Hors schéma » ne veut pas dire « non modélisable ». Les deux sous-langages ont été recensés
exhaustivement et sont évalués par `resolvers/lua-formula.ts` — cf. `02-dynamic.md` §5.3 et §6.1. Ce
qui reste vrai : **rien dans les données ne déclare cette grammaire**, elle est mesurée.
- `ConstantsDefinitionDTO.playerName.pattern` : expression régulière.

## C9 — Les tables indexées se lisent par palier

Toute table `values[]` d'un mapping dynamique (`{ when, then }[]`, y compris celles employées en
ligne dans `BoostDefinitionDTO.modifier`) est une table de **paliers**, pas un dictionnaire dense.

> Valeur applicable à un niveau `L` = l'entrée dont le `when` est **le plus grand parmi ceux ≤ L**.

42 % de ces tables ont des clés manquantes dans leur intervalle, 44 % n'ont qu'une seule clé. Une
clé absente signifie « inchangé depuis le palier précédent », **jamais** « donnée manquante ».

`values[]` est une **liste**, pas une map : une table du jeu de données contient des `when` dupliqués
avec des valeurs différentes. La typer en dictionnaire perdrait silencieusement une valeur.

Détail, mesures et cas limites : [`02-dynamic.md`](02-dynamic.md) §4.
