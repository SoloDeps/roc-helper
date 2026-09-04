# TODO — Dette : IDs d'ateliers permutés déjà écrits en base

**Statut** : ouvert · **Ouvert le** : 2026-08-30 · **Origine** : consolidation §6.6 de
[`data-contracts.md`](./data-contracts.md) · **Décision** : reporté hors de la passe de
consolidation (option « c »), volontairement, pour ne pas le laisser implicite.

## Le défaut

`generateBuildingId` (`lib/stores/add-element-store.ts:127`) redérivait la position d'un
atelier à partir de son **nom concret**, en cherchant ce nom dans
`buildingsAbbr[…].buildings` — c'est-à-dire dans l'ordre **du jeu**, alors que la position
vient du classement **du joueur**.

Chaîne complète, telle qu'elle existait :

```
primary_workshop  ──IIFE de useSubmitElement──▶  "artisan"  ──generateBuildingId──▶  capital_TERTIARY_workshop_…
```

Sous le classement `["Artisan", "Tailor", "Stone Mason"]`, les trois positions sont
permutées :

| Demandé par le joueur | Atelier résolu | ID écrit en base |
|---|---|---|
| `primary_workshop` | `artisan` | `capital_tertiary_workshop_…` |
| `secondary_workshop` | `tailor` | `capital_primary_workshop_…` |
| `tertiary_workshop` | `stone_mason` | `capital_secondary_workshop_…` |

L'erreur ne s'annule pas à la lecture : `resolveWorkshopElementId`
(`lib/db/data-hydration.ts`) re-résout l'ID avec le **même** classement joueur. Le joueur
ajoute son atelier primaire et voit apparaître une carte pour son tertiaire, avec les coûts
du tertiaire.

Le défaut est **invisible sous le classement par défaut** — le seul cas où l'ordre du jeu et
celui du joueur coïncident —, donc invisible pour quiconque n'a jamais ouvert la popup de
classement des ateliers. Il touche **toutes** les ères de `WORKSHOP_ERAS`, pas seulement le
premier groupe.

## Ce qui est corrigé, et ce qui ne l'est pas

**Corrigé** (étape 8 de la consolidation) : `resolvers/workshops.ts` →
`buildWorkshopBuildingId` prend la **position** en entrée. Aucune fonction du module ne
dérive une position d'un nom concret, la permutation n'est plus représentable. Figé par le
test `RÉGRESSION — sous un classement personnalisé, generateBuildingId permutait les
positions` (`resolvers/workshops.test.ts`), qui conserve l'ancien comportement comme
référence du bug.

**PAS corrigé — la dette** : les entrées déjà écrites dans Dexie (`roc_wiki_db`, table
`buildings`) sous un ID permuté **restent permutées**. Un joueur qui avait un classement
personnalisé avant ce correctif garde des cartes fausses ; seuls ses ajouts postérieurs
seront justes.

## Pourquoi ce n'est pas un appendice de la consolidation

Une migration doit savoir **quel classement était actif au moment de l'écriture** pour
inverser la permutation. Cette information n'est stockée nulle part :

- l'ID en base ne porte que la position (permutée), pas le nom concret ;
- `local:buildingSelections` ne contient que le classement **courant**, sans historique ;
- rien ne distingue un ID écrit avant le correctif d'un ID écrit après.

Corollaire : appliquer la permutation inverse au classement courant réparerait les joueurs
qui n'ont pas changé de classement depuis, et **casserait** ceux qui l'ont changé — ou qui
n'ont jamais été affectés. Une migration naïve fait donc plus de dégâts que l'absence de
migration.

## Pistes, à instruire quand le sujet sera pris

1. **Ne rien faire, documenter.** Le parc concerné est probablement petit (il faut avoir
   personnalisé son classement) et le joueur peut supprimer/rajouter la carte fautive.
2. **Marqueur de version sur les entrées.** Ajouter un champ de schéma à partir de
   maintenant, pour qu'une future migration puisse au moins *distinguer* les entrées
   suspectes des saines. Ne répare pas l'existant, mais borne la dette.
3. **Réparation assistée.** Un écran qui liste les ateliers de position en base et laisse le
   joueur confirmer la position de chacun. Coûteux, mais c'est la seule voie qui ne devine
   pas.

## Ne pas faire

- Appliquer la permutation inverse en masse au chargement (voir corollaire ci-dessus).
- Récupérer `getBuildingPositionInGroup` de `lib/stores/use-submit-preset.ts` : c'est
  exactement la dérivation `nom concret → position` qui produit le défaut. Ce fichier est
  supprimé à l'étape 9 de la consolidation, sans récupération.
