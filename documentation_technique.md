# Documentation technique

## Fonctionnalités principales

### Gestion des projets

#### Enregistrer un projet

La fonctionnalité d'enregistrement de projet permet de sauvegarder l'état actuel du projet dans la base de données. Elle est implémentée dans le hook `useProjectOperations` et est accessible via les boutons "Enregistrer" dans la barre de projet.

L'enregistrement d'un projet peut avoir deux comportements :
- Si le projet existe déjà (a un ID), une mise à jour (UPDATE) est effectuée
- Si le projet n'existe pas encore, une création (INSERT) est effectuée

#### Enregistrer sous un projet (Mise à jour: 01/05/2025)

La fonctionnalité "Enregistrer sous" permet de créer une nouvelle copie d'un projet existant avec un nouveau nom. Cette fonctionnalité a été améliorée pour:

1. Vérifier d'abord que le numéro de devis n'existe pas déjà dans la base de données
2. Effectuer TOUJOURS une création (INSERT) d'un nouvel enregistrement, jamais une mise à jour
3. Mettre à jour les dates de création/modification
4. Assurer l'unicité du numéro de devis

Le processus suit ces étapes:
- L'utilisateur clique sur "Enregistrer sous"
- Le système vérifie si le numéro de devis est déjà utilisé
   - Si oui, affiche une erreur et demande à l'utilisateur de modifier le numéro
   - Si non, ouvre la boîte de dialogue "Enregistrer sous"
- L'utilisateur entre un nouveau nom pour le projet
- Un nouveau projet est créé avec toutes les données actuelles
- Le système bascule automatiquement vers ce nouveau projet

Cette fonctionnalité est implémentée dans:
- `useProjectOperations.tsx`: contient la fonction `handleSaveAsProject` qui gère la logique
- `Layout.tsx`: contient la fonction `handleSmartSaveAsProject` qui vérifie le numéro de devis
- `SaveAsDialog.tsx`: gère l'interface utilisateur

#### Ouvrir un projet

Permet de charger un projet existant depuis la base de données. La boîte de dialogue affiche la liste des projets disponibles et permet de les filtrer.

### Gestion des pièces
