
# Documentation Exhaustive - Application Devis

## Table des matières

1. [Vue d'ensemble du projet](#1-vue-densemble-du-projet)
2. [Arborescence du projet](#2-arborescence-du-projet)
3. [Interface Utilisateur (UI)](#3-interface-utilisateur-ui)
   - [Pages et routes](#31-pages-et-routes)
   - [Composants UI](#32-composants-ui)
4. [Logique métier et Gestion d'État](#4-logique-métier-et-gestion-détat)
   - [Contextes React](#41-contextes-react)
   - [Reducers](#42-reducers)
   - [Hooks personnalisés](#43-hooks-personnalisés)
5. [Services et Accès aux Données](#5-services-et-accès-aux-données)
   - [Structure des tables Supabase](#51-structure-des-tables-supabase)
   - [Services d'accès aux données](#52-services-daccès-aux-données)
6. [Flux de données spécifiques](#6-flux-de-données-spécifiques)
   - [Sauvegarde ("Enregistrer")](#61-sauvegarde-enregistrer)
   - [Sauvegarde sous ("Enregistrer Sous")](#62-sauvegarde-sous-enregistrer-sous)
   - [Chargement (loadProject)](#63-chargement-loadproject)
   - [Création nouveau (createNewProject)](#64-création-nouveau-createnewproject)
7. [Système de génération PDF](#7-système-de-génération-pdf)
   - [Migration vers @react-pdf/renderer](#71-migration-vers-react-pdfrenderer)
   - [Composants PDF](#72-composants-pdf)
   - [Utilitaires et styles](#73-utilitaires-et-styles)
8. [Système de paramètres PDF](#8-système-de-paramètres-pdf)
   - [Chargement et sauvegarde des paramètres](#81-chargement-et-sauvegarde-des-paramètres)
   - [Composants d'édition des paramètres](#82-composants-dédition-des-paramètres)

## 1. Vue d'ensemble du projet

L'application "Devis" est une application web développée en React/TypeScript/Vite avec Supabase comme backend. Elle permet la création et la gestion de devis pour des travaux de bâtiment. L'application offre des fonctionnalités complètes pour gérer les projets, les pièces d'un logement, les travaux à effectuer, et génère des documents PDF professionnels pour les devis.

Le projet est actuellement en phase de migration de la génération PDF depuis une ancienne méthode (probablement pdfMake) vers `@react-pdf/renderer`.

### Technologies principales utilisées :
- **Frontend** : React, TypeScript, Vite
- **État** : Contextes React, useReducer
- **UI** : Tailwind CSS, Shadcn/ui
- **Backend/Base de données** : Supabase
- **Génération de PDF** : @react-pdf/renderer
- **Requêtes API** : TanStack Query (anciennement React Query)
- **Navigation** : React Router

## 2. Arborescence du projet

Voici l'arborescence principale du projet (excluant node_modules, .git, et fichiers de configuration standard) :

```
src/
├── App.tsx                    # Point d'entrée principal de l'application
├── components/                # Composants UI réutilisables
│   ├── Layout.tsx             # Structure globale des pages
│   ├── ui/                    # Composants UI de base (shadcn)
├── contexts/                  # Contextes React pour la gestion d'état globale
│   ├── ProjectContext.tsx     # Contexte principal du projet
│   ├── TravauxTypesContext.tsx # Types de travaux disponibles
│   └── ...
├── features/                  # Organisation par fonctionnalité
│   ├── chantier/              # Gestion des projets/chantiers
│   ├── devis/                 # Génération et configuration des devis
│   │   └── components/
│   │       └── pdf-settings/  # Composants de configuration PDF
│   ├── property/              # Gestion des propriétés/biens
│   ├── recap/                 # Récapitulatif des travaux
│   └── travaux/               # Gestion des travaux
├── hooks/                     # Hooks personnalisés
├── integrations/              # Intégrations externes
│   └── supabase/              # Client et types Supabase
├── pages/                     # Pages de l'application
│   ├── EditionDevis.tsx       # Page d'édition du devis
│   ├── Recapitulatif.tsx      # Page de récapitulatif
│   └── ...
└── services/                  # Services et logique métier
    ├── pdf/                   # Services liés à la génération de PDF
    │   ├── config/            # Configuration du PDF
    │   ├── constants/         # Constantes pour le PDF
    │   ├── generators/        # Générateurs de contenu PDF
    │   ├── hooks/             # Hooks liés au PDF
    │   ├── react-pdf/         # Composants spécifiques React-PDF
    │   ├── services/          # Services de génération PDF
    │   └── utils/             # Utilitaires pour le PDF
    └── ...
```

## 3. Interface Utilisateur (UI)

### 3.1 Pages et routes

L'application comporte plusieurs pages principales correspondant aux différentes étapes de création d'un devis :

1. **InfosChantier** (`/infos-chantier`) : Saisie des informations générales du projet et du client.
2. **Travaux** (`/travaux`) : Ajout et configuration des travaux à réaliser pour chaque pièce.
3. **Recapitulatif** (`/recapitulatif`) : Vue d'ensemble des travaux avec totaux.
4. **EditionDevis** (`/edition-devis`) : Configuration de l'apparence du devis PDF.
5. **Parametres** (`/parametres`) : Paramètres généraux de l'application.
6. **AdminTravaux** (`/admin/travaux`) : Administration des types de travaux (section admin).

#### Détail de la page EditionDevis (`src/pages/EditionDevis.tsx`) :

Ce fichier définit la page d'édition du devis avec:
- Un état local `activeTab` pour gérer la navigation entre les onglets
- Un bouton de génération de PDF qui utilise le hook `useReactPdfGeneration`
- Deux onglets principaux : 
  - "Éléments à imprimer" (`PrintableFieldsForm`)
  - "Paramètres d'édition PDF" (`PdfSettingsForm`)

Le composant utilise `QueryClientProvider` pour gérer les requêtes API. Il affiche le titre du projet en cours d'édition, récupéré depuis l'état global via `useProject`.

#### Détail de la page Recapitulatif (`src/pages/Recapitulatif.tsx`) :

Ce fichier définit la page de récapitulatif du devis avec:
- Un bouton de retour aux travaux
- Des boutons pour éditer et imprimer le devis
- Le composant `PropertyInfoCard` pour afficher les informations du bien
- Le composant `TravauxRecapContent` pour afficher le récapitulatif des travaux

La fonction `handlePrintDevis` utilise `generateDetailsPDF` pour créer un PDF détaillé du devis, en utilisant les paramètres PDF récupérés via `usePdfSettings`.

### 3.2 Composants UI

#### Composants principaux :

1. **PdfSettingsForm** : Formulaire de configuration des paramètres du PDF.
2. **FontSettings** : Configuration des polices et styles de texte pour le PDF.
3. **ColorSettings** : Configuration des couleurs utilisées dans le PDF.
4. **ElementSelector** : Sélection des éléments à styliser dans le PDF.
5. **ElementSettingsForm** : Formulaire d'édition des styles pour un élément sélectionné.

#### Analyse détaillée du composant `FontSettings` (`src/features/devis/components/pdf-settings/FontSettings.tsx`) :

Le composant `FontSettings` permet de personnaliser les styles de texte pour différents éléments du PDF :

- **Props** :
  - `pdfSettings: PdfSettings` : Les paramètres PDF actuels
  - `updatePdfSettings: (newSettings: Partial<PdfSettings>) => Promise<boolean>` : Fonction pour mettre à jour les paramètres

- **États locaux** :
  - `selectedElement: string` : L'élément actuellement sélectionné pour édition
  - `elementSettings: ElementSettings` : Les paramètres de style de l'élément sélectionné

- **Fonctions** :
  - `getPaletteColors()` : Récupère les couleurs principales depuis les paramètres PDF
  - `getElementSettings(elementId)` : Récupère les paramètres de style pour un élément donné
  - `handleElementSettingsChange(newSettings)` : Met à jour les paramètres d'un élément
  - `handleColorChange(color)` : Met à jour la couleur de l'élément sélectionné

Le composant utilise `useEffect` pour charger les paramètres de l'élément sélectionné lorsque celui-ci change. Il permet de personnaliser chaque élément typographique du PDF en conservant les styles dans l'objet `elements` des paramètres PDF.

#### Analyse du composant `ColorSettings` (`src/features/devis/components/pdf-settings/ColorSettings.tsx`) :

Le composant `ColorSettings` permet de personnaliser les couleurs globales du PDF :

- **Props** :
  - `pdfSettings: PdfSettings` : Les paramètres PDF actuels
  - `updatePdfSettings: (newSettings: Partial<PdfSettings>) => Promise<boolean>` : Fonction pour mettre à jour les paramètres

- **Fonctions** :
  - `handleColorChange(key, value)` : Met à jour une couleur spécifique dans les paramètres

Le composant affiche une grille de composants `ColorPicker` pour chaque couleur configurable du PDF :
- Couleur des textes généraux (`mainText`)
- Couleur des textes MO/TVA/Détails (`detailsText`)
- Couleur des traits page de garde (`coverLines`)
- Couleur des traits pages détails/récap (`detailsLines`)
- Couleur des cadres Total TTC (`totalBoxLines`)
- Couleur de fond claire (`background`)
- Couleur de fond claire 2 (`background2`)
- Couleur de fond claire 3 (`background3`)

## 4. Logique métier et Gestion d'État

### 4.1 Contextes React

#### ProjectContext (`src/contexts/ProjectContext.tsx`)

Contexte principal de l'application qui gère l'état global du projet en cours. Il utilise un reducer pour manipuler l'état et fournit des actions pour modifier cet état.

- **État** :
  - `property` : Informations sur le bien (adresse, type, etc.)
  - `rooms` : Liste des pièces du projet
  - `metadata` : Métadonnées du projet (nom, numéro de devis, etc.)
  - `currentProjectId` : ID du projet en cours d'édition
  - `savedState` : État de sauvegarde du projet

- **Actions** :
  - `SET_PROPERTY` : Définit les propriétés du bien
  - `ADD_ROOM` : Ajoute une nouvelle pièce
  - `UPDATE_ROOM` : Met à jour une pièce existante
  - `DELETE_ROOM` : Supprime une pièce
  - `LOAD_PROJECT` : Charge un projet complet
  - `SET_METADATA` : Définit les métadonnées du projet
  - `SET_CURRENT_PROJECT_ID` : Définit l'ID du projet en cours
  - `RESET_PROJECT` : Réinitialise le projet
  - `UPDATE_SAVED_STATE` : Met à jour l'état de sauvegarde

#### TravauxTypesContext (`src/contexts/TravauxTypesContext.tsx`)

Gère les types de travaux disponibles dans l'application.

- **État** :
  - `workTypes` : Types de travaux
  - `serviceGroups` : Groupes de services
  - `services` : Services disponibles
  - `loading` : État de chargement

- **Actions** :
  - `SET_WORK_TYPES` : Définit les types de travaux
  - `SET_SERVICE_GROUPS` : Définit les groupes de services
  - `SET_SERVICES` : Définit les services disponibles
  - `SET_LOADING` : Définit l'état de chargement

### 4.2 Reducers

#### projectReducer (`src/features/project/reducers/projectReducer.ts`)

Reducer principal qui gère les modifications de l'état du projet. Il traite les actions envoyées par le contexte ProjectContext.

Il contient la logique pour :
- Ajouter, modifier et supprimer des pièces
- Mettre à jour les propriétés du bien
- Charger un projet complet
- Réinitialiser le projet

### 4.3 Hooks personnalisés

#### usePdfSettings (`src/services/pdf/hooks/usePdfSettings.ts`)

Hook qui gère le chargement et la sauvegarde des paramètres PDF.

- **État retourné** :
  - `pdfSettings` : Paramètres PDF actuels
  - `updatePdfSettings` : Fonction pour mettre à jour les paramètres
  - `resetPdfSettings` : Fonction pour réinitialiser les paramètres

Le hook utilise `useAppState` pour récupérer et mettre à jour les paramètres PDF stockés dans l'état de l'application. Il valide les paramètres avec le schéma Zod `PdfSettingsSchema`.

Quand `updatePdfSettings` est appelé, il :
1. Vérifie que l'utilisateur est connecté
2. Valide les nouveaux paramètres avec Zod
3. Met à jour l'état local et persiste les changements via `updateAppStatePdfSettings`

#### useProjectInfo (`src/features/chantier/hooks/useProjectInfo.tsx`)

Hook qui combine les fonctionnalités de `useProjectMetadata` et `useProjectOperations` pour fournir un accès complet aux informations et opérations du projet.

- **Valeurs retournées** :
  - Données de l'état du projet global (`projectState`, `isLoading`, etc.)
  - Métadonnées du projet et leurs setters (de `useProjectMetadata`)
  - Opérations sur le projet (`handleChargerProjet`, `handleSaveProject`, etc.)

Ce hook sert de façade unifiée pour accéder à toutes les fonctionnalités liées au projet.

## 5. Services et Accès aux Données

### 5.1 Structure des tables Supabase

L'application utilise plusieurs tables Supabase pour stocker ses données :

#### app_state
- Stocke l'état global de l'application par utilisateur
- Contient les paramètres PDF (`pdf_settings`)
- Colonnes principales : `id`, `user_id`, `current_project_id`, `pdf_settings`, `auto_save_options`

#### projects_save
- Stocke les projets sauvegardés
- Colonnes principales : `id`, `name`, `client_id`, `project_data`, `general_data`, `status`, `devis_number`

#### clients
- Stocke les informations des clients
- Colonnes principales : `id`, `nom`, `prenom`, `adresse`, `code_postal`, `ville`, `tel1`, `email`

#### rooms
- Stocke les informations des pièces d'un projet
- Colonnes principales : `id`, `project_id`, `name`, `surface`, `wall_height`, `perimeter`

#### room_works
- Stocke les travaux associés à chaque pièce
- Colonnes principales : `id`, `room_id`, `service_id`, `quantity`, `prix_fournitures`, `prix_main_oeuvre`, `taux_tva`

#### services et service_groups
- Stocke les services et groupes de services disponibles
- Colonnes principales pour services : `id`, `name`, `description`, `labor_price`, `supply_price`, `unit`, `group_id`
- Colonnes principales pour service_groups : `id`, `name`, `work_type_id`

### 5.2 Services d'accès aux données

#### pdfDocumentService (`src/services/pdf/services/pdfDocumentService.ts`)

Service qui génère des documents PDF à l'aide de pdfMake. Cette partie du code semble être en cours de migration vers @react-pdf/renderer.

- **Fonction principale** : `generatePdfDocument(options)`
  - Prend en entrée des options comme le contenu, les métadonnées, etc.
  - Configure les polices avec `configurePdfFonts()`
  - Définit l'en-tête et le pied de page si demandé
  - Génère et ouvre le PDF via pdfMake

Le service contient également beaucoup de logs de débogage liés au logo et aux images, suggérant qu'il y a eu des problèmes avec ces éléments.

#### pdfGenerationService (`src/services/pdfGenerationService.ts`)

Simple fichier de réexportation qui expose les services de génération PDF :
- `generateDetailsPDF` : Génère un PDF détaillé du devis
- `generateRecapPDF` : Génère un PDF de récapitulatif
- `generateCompletePDF` : Génère un PDF complet

## 6. Flux de données spécifiques

### 6.1 Sauvegarde ("Enregistrer")

Le flux de sauvegarde d'un projet implique plusieurs composants et services :

1. L'utilisateur clique sur "Enregistrer" dans l'interface.
2. La fonction `handleSaveProject` du hook `useProjectOperations` est appelée.
3. Cette fonction vérifie si `currentProjectId` existe :
   - Si oui, elle appelle `projectService.updateProject` pour mettre à jour le projet existant.
   - Si non, elle appelle `projectService.createProject` pour créer un nouveau projet.
4. Une fois le projet sauvegardé, l'ID retourné est défini comme `currentProjectId`.
5. L'état `savedState` est mis à jour via `dispatch({ type: 'UPDATE_SAVED_STATE', payload: true })`.

### 6.2 Sauvegarde sous ("Enregistrer Sous")

Le flux "Enregistrer Sous" est similaire à "Enregistrer", mais force la création d'un nouveau projet :

1. L'utilisateur clique sur "Enregistrer Sous" et entre un nouveau nom de projet.
2. La fonction de sauvegarde est appelée avec un flag pour forcer la création d'un nouveau projet.
3. Le service de projet appelle `projectService.createProject` pour créer une nouvelle entrée.
4. Le nouvel ID est défini comme `currentProjectId`.
5. L'état `savedState` est mis à jour.

### 6.3 Chargement (loadProject)

Le processus de chargement d'un projet existant :

1. L'utilisateur sélectionne un projet à ouvrir dans la liste.
2. La fonction `handleChargerProjet` du hook `useProjectOperations` est appelée avec l'ID du projet.
3. Cette fonction appelle `projectService.fetchProjectById` pour récupérer les données.
4. Une fois les données récupérées, elles sont chargées dans le contexte via `dispatch({ type: 'LOAD_PROJECT', payload: data })`.
5. L'ID du projet est défini comme `currentProjectId`.
6. L'état `savedState` est réinitialisé à `true` via `dispatch({ type: 'UPDATE_SAVED_STATE', payload: true })`.

### 6.4 Création nouveau (createNewProject)

Le processus de création d'un nouveau projet :

1. L'utilisateur clique sur "Nouveau Projet".
2. La fonction `handleCreateNew` est appelée.
3. Si des modifications non sauvegardées existent, une confirmation est demandée.
4. Le contexte est réinitialisé via `dispatch({ type: 'RESET_PROJECT' })`.
5. `currentProjectId` est mis à `null`.
6. L'utilisateur est redirigé vers la page de création de projet.

## 7. Système de génération PDF

### 7.1 Migration vers @react-pdf/renderer

Le projet est en cours de migration de pdfMake vers @react-pdf/renderer pour la génération de PDF. Cette migration n'est pas encore complète, et certaines parties du code peuvent encore utiliser l'ancienne méthode.

#### Architecture de la génération PDF avec @react-pdf/renderer :

- **Hooks** :
  - `useReactPdfGeneration` : Gère la génération du PDF avec React-PDF

- **Composants PDF** :
  - Organisation par type de page (couverture, détails, récapitulatif, CGV)
  - Composants communs réutilisables (en-tête, pied de page, etc.)

- **Utilitaires** :
  - `pdfStyleUtils.ts` : Génère et applique les styles en fonction des paramètres
  - `reactPdfFonts.ts` : Enregistre les polices disponibles
  - `formatUtils.ts` : Formatte les données pour l'affichage PDF

### 7.2 Composants PDF

Les composants PDF sont organisés en plusieurs fichiers dans le dossier `src/services/pdf/react-pdf/components/` :

#### Pages principales :

1. **CoverPage** : Page de garde du devis
   - En-tête avec logo de l'entreprise
   - Informations de contact et d'entreprise
   - Informations du client
   - Informations du projet
   - Pied de page

2. **DetailsPage** : Pages de détail des travaux
   - Tableau des travaux par pièce
   - Prix unitaires, quantités, totaux
   - Descriptions des travaux

3. **RecapPage** : Page de récapitulatif
   - Totaux par pièce
   - Total global HT et TTC
   - Zone de signature
   - Texte de salutation

4. **CGVPage** : Page des conditions générales de vente
   - Sections et sous-sections des CGV
   - Mise en forme structurée

#### Composants communs :

- **PageHeader** : En-tête commun à toutes les pages
- **PageFooter** : Pied de page commun à toutes les pages
- **VerticalSpacer** : Composant pour ajouter des espacements verticaux personnalisables

### 7.3 Utilitaires et styles

#### pdfStyleUtils.ts (`src/services/pdf/react-pdf/utils/pdfStyleUtils.ts`)

Utilitaire central qui gère l'application des styles aux composants PDF en fonction des paramètres configurés par l'utilisateur.

- **Fonction principale** : `getPdfStyles(pdfSettings)`
  - Génère un objet de styles pour tous les éléments du PDF
  - Applique les couleurs, polices et espacement définis dans les paramètres
  - Fusionne les styles par défaut avec les styles personnalisés

- **Fonctions auxiliaires** :
  - `mergeStyles` : Fusionne plusieurs objets de style
  - `filterContainerStyles` : Extrait les styles spécifiques aux conteneurs
  - `filterTextStyles` : Extrait les styles spécifiques au texte

#### reactPdfFonts.ts (`src/services/pdf/utils/reactPdfFonts.ts`)

Gère l'enregistrement des polices disponibles pour le PDF.

- Utilise `Font.register` de '@react-pdf/renderer' pour enregistrer les polices
- Définit les variantes de chaque police (normal, bold, italic, etc.)
- Charge les polices standard (Roboto, Arial, Times New Roman)

#### formatUtils.ts (`src/services/pdf/utils/formatUtils.ts`)

Utilitaires de formatage pour les valeurs affichées dans le PDF.

- **Fonctions principales** :
  - `formatPrice` : Formate un nombre en prix (X,XX €)
  - `formatQuantity` : Formate une quantité avec unité
  - `formatDate` : Formate une date selon le format souhaité

## 8. Système de paramètres PDF

### 8.1 Chargement et sauvegarde des paramètres

#### usePdfSettings (`src/services/pdf/hooks/usePdfSettings.ts`)

Ce hook gère le cycle de vie des paramètres PDF :

- **Chargement** : Récupère les paramètres depuis `appState.pdf_settings`
- **Validation** : Utilise Zod (`PdfSettingsSchema`) pour valider les données
- **Mise à jour** : Permet de mettre à jour et persister les paramètres
- **Réinitialisation** : Permet de réinitialiser les paramètres aux valeurs par défaut

Les paramètres PDF sont stockés dans la table `app_state` de Supabase, dans la colonne `pdf_settings` de type JSONB.

#### Structure des paramètres PDF (`src/services/pdf/config/pdfSettingsTypes.ts`)

Le fichier définit le schéma Zod et le type TypeScript pour les paramètres PDF :

- `fontFamily` : Police principale du document
- `colors` : Couleurs utilisées dans le document
  - `mainText` : Couleur du texte principal
  - `detailsText` : Couleur du texte des détails
  - `coverLines` : Couleur des lignes de la page de garde
  - `detailsLines` : Couleur des lignes des pages de détail
  - `totalBoxLines` : Couleur des lignes du tableau des totaux
  - `background` : Couleur de fond principale
  - `background2` : Couleur de fond secondaire
  - `background3` : Couleur de fond tertiaire
- `lineSpacing` : Espacements entre les lignes
- `margins` : Marges des différentes pages
- `logoSettings` : Configuration du logo
- `elements` : Styles personnalisés pour chaque élément du PDF

Chaque paramètre a une valeur par défaut définie dans le schéma Zod.

### 8.2 Composants d'édition des paramètres

#### PdfSettingsForm (`src/features/devis/components/PdfSettingsForm.tsx`)

Formulaire principal qui regroupe tous les composants d'édition des paramètres PDF :

- **Onglets** :
  - "Polices et Couleurs" : Paramètres de typographie et de couleurs
  - "Espacements" : Paramètres d'espacement et de marges
  - "Logo" : Configuration du logo

- **Composants enfants** :
  - `FontSettings` : Configuration des polices et styles de texte
  - `ColorSettings` : Configuration des couleurs
  - `SpacingSettings` : Configuration des espacements
  - `MarginSettings` : Configuration des marges
  - `LogoSettings` : Configuration du logo

#### ElementSettingsForm (`src/features/devis/components/pdf-settings/components/ElementSettingsForm.tsx`)

Formulaire d'édition des styles pour un élément spécifique du PDF :

- **Contrôles** :
  - Sélection de police
  - Taille de police
  - Style (gras, italique)
  - Couleur
  - Alignement
  - Couleur de fond
  - Hauteur de ligne
  - Espacements
  - Marges intérieures
  - Bordures

Ce composant utilise plusieurs sous-composants pour chaque type de paramètre :

- `StyleControls` : Contrôles pour le style du texte (gras, italique)
- `ColorPicker` : Sélecteur de couleur
- `AlignmentControl` : Contrôle d'alignement du texte
- `SpacingControl` : Contrôle des espacements
- `PaddingControl` : Contrôle des marges intérieures
- `BorderControl` : Contrôle des bordures

#### ElementSelector (`src/features/devis/components/pdf-settings/components/ElementSelector.tsx`)

Permet de sélectionner un élément du PDF à éditer parmi une liste organisée par sections :

- Page de garde
- Détails des travaux
- Récapitulatif
- CGV
- Espacements (pour chaque section)

Les éléments disponibles sont définis dans `PDF_ELEMENTS` dans le fichier `typography.ts`.

#### Types d'éléments (`src/features/devis/components/pdf-settings/types/typography.ts`)

Ce fichier définit tous les éléments personnalisables du PDF :

- **Éléments généraux** : Styles par défaut
- **Page de garde** : En-tête, logo, informations client, informations projet
- **Détails des travaux** : Titre de section, titres de pièce, descriptions, prix
- **Récapitulatif** : Tableau des totaux, zone de signature, texte de salutation
- **CGV** : Titres de section, contenu textuel, puces

Chaque élément a un identifiant unique (`id`), un nom affichable (`name`) et appartient à une section (`section`).

#### Types de paramètres d'éléments (`src/features/devis/components/pdf-settings/types/elementSettings.ts`)

Ce fichier définit la structure des paramètres de style pour un élément :

- `fontFamily` : Police de caractères
- `fontSize` : Taille de police
- `isBold`, `isItalic` : Style de texte
- `color` : Couleur du texte
- `alignment` : Alignement du texte (gauche, centre, droite, justifié)
- `fillColor` : Couleur de fond
- `lineHeight` : Hauteur de ligne
- `spacing` : Espacements externes
- `padding` : Espacements internes
- `border` : Paramètres de bordure

Ce fichier définit également le schéma Zod pour la validation des paramètres et les valeurs par défaut.

---

Cette documentation couvre de manière exhaustive l'état actuel du projet "Application Devis", avec un focus particulier sur la partie génération PDF qui est en cours de migration vers `@react-pdf/renderer`. Chaque composant, fichier et flux de données a été analysé en détail pour fournir une vision claire et complète du projet.
