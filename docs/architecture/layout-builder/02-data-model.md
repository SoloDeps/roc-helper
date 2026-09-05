# Layout Builder — modèle de données

Ce que le Layout Builder consomme, d'où ça vient, et les pièges rencontrés.
Complète `docs/game-schema/` (le modèle canonique du game design), ne le
remplace pas : ici c'est la *projection produit*, là-bas la *description
fidèle*.

Source : `source/gamedesign.json` + `source/loca.json`.
Régénérer : `pnpm extract:city-grid`.

## 1. Les trois axes — vocabulaire

| Terme | Type | Sens |
|---|---|---|
| **Carte** | `CityMap` | Ce que le joueur ouvre, ce qu'un layout référence. L'unité de travail |
| **Surface** | `SurfaceCode` | Le terrain d'une case, à l'intérieur d'une carte : `LAND` · `HARBOR` · `WATER` |
| **Ère** | `EraCode` | L'axe temporel. Une carte a une **ère plancher** |

⚠️ On dit **carte**, jamais « aire » — homophone d'« ère ».

## 2. La carte n'est pas la ville

Le jeu range les 832 cases d'une ville dans **une grille de coordonnées
unique**. Ce n'est pas ce que le joueur manipule : la Capitale et son Port sont
deux lieux distincts, qu'on doit pouvoir ouvrir séparément.

Le découpage se **dérive**, il ne se saisit pas. Deux étapes :

1. `expansionSubType` partitionne les cases en surfaces.
2. Test de **disjonction spatiale** entre boîtes englobantes.

```
City_Capital  LAND   x[3..51]  y[11..51]    ┐ boîtes DISJOINTES
              HARBOR x[23..51] y[-25..-1]   ┘ → 2 cartes

City_Vikings  LAND   x[9..51]  y[12..51]    ┐ boîtes QUI SE RECOUPENT
              WATER  x[21..39] y[12..39]    ┘ → 1 carte, 2 terrains
```

Une surface n'est donc **pas** une carte. L'eau viking est du terrain entrelacé
dans la carte viking (0 cellule commune avec la terre, mais imbriquée dedans) ;
le port de la Capitale est un lieu à part.

Sans ce test, le cadrage de la Capitale ferait 12×19 dont la moitié vide, et
l'éditeur proposerait « eau viking » comme carte autonome.

## 3. Les 7 cartes jouables

| Carte | Libellé | Grille | Cases | Terrains | Ère plancher |
|---|---|---|---|---|---|
| `City_Capital\|LAND` | Capital City | 12×10 **plein** | 120 | LAND | `SA` |
| `City_Capital\|HARBOR` | Harbor | 7×6 | 42 | HARBOR | **`EG`** |
| `City_Arabia\|LAND` | Arabia | 15×15 | 147 | LAND | `KS` |
| `City_Vikings\|LAND` | Viking Kingdom | 14×13 | 152 | LAND + WATER | `FA` |
| `City_China\|LAND` | China | 10×8 | 54 | LAND | `ER` |
| `City_Egypt\|LAND` | Egypt | 7×7 | 42 | LAND | `ME` |
| `City_Mayas\|LAND` | Maya Empire | 8×8 **plein** | 64 | LAND | `BE` |

Seules Capital/LAND et Mayas pavent complètement leur boîte englobante ; les
autres sont **creuses** (`sparse: true`) — la grille n'est pas rectangulaire,
le rendu et le placement doivent suivre les cases, jamais la boîte.

Pas de grille : le **pas** (`expansionSize`) vaut 3 pour Arabia et Vikings, 4
pour les quatre autres. Le supposer global décalerait deux villes sur six.

## 4. L'ère plancher — déduite, jamais déclarée

`BuildingDefinitionDTO.expansionSubType` emploie **exactement le même
vocabulaire** que celui des cases : 22 bâtiments `HARBOR`, 12 `WATER`, 659 sans
sous-type. Le couple (ville, surface) détermine donc à la fois la grille **et**
la palette, sans table de correspondance à maintenir.

L'âge du plus ancien bâtiment de la palette donne l'ère à partir de laquelle la
surface est jouable :

| Surface | Âges de sa palette | Plancher |
|---|---|---|
| Capital HARBOR | 11 × EarlyGothicEra + 11 × LateGothicEra | **EG** |
| Vikings WATER | 6 × FeudalAge + 6 × IberianEra | FA |
| Capital LAND | DawnAge et suivants | SA |

⚠️ **Déduction, pas déclaration.** Aucun champ ne dit « le Port s'ouvre à
EarlyGothicEra » ; ce qui est mesuré, c'est qu'**aucun** bâtiment portuaire
n'existe avant cet âge. C'est corroboré par le jeu (Port accessible en EG/LG),
et c'est cette corroboration qui autorise à s'en servir comme d'un plancher. Si
le game design amont ajoutait un bâtiment portuaire à une ère antérieure, le
plancher bougerait tout seul — c'est voulu.

Conséquence produit : `listCityMaps({ era })` ne retourne que les cartes
ouvertes à cette ère. Un joueur en `HM` ne se voit pas proposer le Port.

Une carte dont le plancher est indéterminable (`minEra === null`) est
**toujours** proposée : mieux vaut une carte de trop qu'une carte manquante par
déduction ratée.

## 5. Pièges rencontrés

Chacun a été attrapé par un test, et chacun a sa régression dédiée dans
`data/city-grid/generated/city-grid.generated.test.ts`.

| # | Piège | Conséquence si ignoré |
|---|---|---|
| **P1** | `rotation` est un **enum string** (`BuildingRotationType_ROTATION_90`), pas un nombre — contre-exemple à la convention C3 | 5 des 9 bâtiments fixes ramenés à 0°, emprise inversée |
| **P2** | Les bâtiments fixes (Noria / Oasis) sont portés par des cases **CONNECTOR**, donc non constructibles | Un rattachement par appartenance aux cases constructibles en perd 9/9 |
| **P3** | `DawnAge` (order 1) précède la première ère de l'app (`StoneAge`) | La Capitale retombe sur « ère indéterminable » au lieu de « ouverte dès le départ » |
| **P4** | 598 des 832 cases n'ont **aucun** `expansionType` | L'absence n'a pas de défaut lisible ; c'est `isBuildableType()` qui tranche, à un seul endroit |
| **P5** | `AgeDefinition.order` n'est pas dense (il saute 16) | Inutilisable comme index ; sert uniquement à comparer |

Règle de constructibilité, définie à **un seul endroit** et testée :
`type === null || type === "LINKED"`. BLOCKER (188), CONNECTOR (22) et
DETACHED_CONNECTOR (1) ne reçoivent jamais de bâtiment.

## 6. Ce qui est délibérément hors périmètre

- **Coûts de déblocage** (`ExpansionCostsDTO`) — point B3 de
  `docs/game-schema/README.md` : le Layout Builder n'en a pas besoin, et le
  mécanisme d'appariement barème → expansion n'est pas dans les données
  (810/832 non appariées).
- **Libellés de sous-zone** — la loca nomme les 6 villes
  (`Base.Cities.<id>_Name`) mais aucune sous-zone. « Harbor » et « Water » sont
  **notre** convention, reprise du préfixe des 22 bâtiments `Building_Harbor_*`.

## 7. API du resolver

`resolvers/city-grid.ts` — zéro canvas, zéro React, zéro caméra. La conversion
vers l'écran (et l'inversion de l'axe Y) appartient à la couche de rendu.

| Fonction | Rôle |
|---|---|
| `listCityMaps({ era? })` | Le catalogue du sélecteur, filtrable par ère |
| `getCityMap(key)` | Résout une carte par sa clé persistée |
| `getCityMaps(cityId)` | Les cartes d'une ville, terrestre en tête |
| `isCityMapUnlocked(map, era)` | Prédicat d'ère |
| `buildableCells(map, surface?)` | Cellules 1×1, filtrables par terrain — mémoïsé |
| `unlockedCells(map, unlockedIds)` | Cellules des cases débloquées (état joueur) |
| `fitsInCells(rect, cells)` | Test de terrain — la collision entre bâtiments est Phase 5 |
| `slotAt(map, x, y)` | Case constructible sous une cellule |
| `rotatedFootprint(w, h, rotation)` | Emprise réelle, rotation appliquée |
| `fixedCulturePoints(map)` | Culture offerte par le décor |
| `cellKey(x, y)` | Encodage entier d'une cellule — injectif sur [-32, 64] |

**Deux systèmes de coordonnées, jamais mélangés :** le **monde** (unité des
bâtiments et des zones, celle de tout le module) et la **case d'expansion**
(bloc de `expansionSize`² unités monde — unité de déblocage, jamais de
placement).
