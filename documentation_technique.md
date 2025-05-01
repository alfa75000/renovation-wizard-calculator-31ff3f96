# Documentation Exhaustive - BâtiPilot IAssit : Module A - Devis

## I. Vue d'Ensemble Générale (Module Devis & Application)

1.  **Objectifs du Projet (Global & Module Devis) :**

    *   **BâtiPilot IAssit :** L'application vise une gestion globale pour les petites entreprises du BTP et les artisans. Elle centralise plusieurs aspects de la gestion d'entreprise : devis, facturation, suivi de chantier, aide à la rédaction de compte-rendus, comptabilité simplifiée, et intégration d'IA pour l'assistance aux tâches quotidiennes (récupération factures fournisseurs, aide réponse emails, suggestions devis...).
    *   **Module A - Devis :** La fonctionnalité actuellement développée et analysée est le module "A - Devis". Ce module permet la création, la gestion et la génération PDF personnalisable de devis techniques détaillés. Il permet aux utilisateurs de créer des devis précis et professionnels pour leurs clients.
    *   **Utilisateurs Cibles :** Petites entreprises du BTP, artisans, entrepreneurs individuels du secteur de la construction.

2.  **Architecture Globale :**

    *   L'application est une Single Page Application (SPA) construite avec React et TypeScript.
    *   L'état de l'application est géré avec Context API et `useReducer`.
    *   La persistance des données et l'authentification sont gérées via Supabase, qui fournit une API REST et une base de données PostgreSQL.
    *   La génération de PDF est assurée par la librairie `@react-pdf/renderer`, permettant une approche déclarative basée sur des composants React.
    *   L'interface utilisateur est construite avec Tailwind CSS et la librairie Shadcn/ui.

3.  **Technologies Principales :**

    *   **Frontend :**
        *   React (framework UI)
        *   TypeScript (langage de programmation typé)
        *   Vite (bundler et outil de développement)
        *   Tailwind CSS (framework CSS utility-first)
        *   shadcn/ui (bibliothèque de composants UI basés sur Radix UI et stylisés avec Tailwind CSS)
        *   React Router (gestion du routing côté client)
        *   TanStack Query (gestion des données serveur, fetching et caching)
        *   Zod (validation des schémas et des données)
        *   lucide-react (bibliothèque d'icônes)
        *   sonner (bibliothèque de toasts/notifications)
    *   **Backend & Données :**
        *   Supabase (plateforme backend-as-a-service fournissant : base de données PostgreSQL, authentification, stockage de fichiers)
        *   JSONB (type de données PostgreSQL utilisé pour stocker les états de projet)
    *   **Génération PDF :**
        *   @react-pdf/renderer (librairie pour la génération de documents PDF à partir de composants React)

4.  **Conventions de Codage (si observées) :**

    *   L'application semble adhérer à une structure de code organisée par *features* (dossier `src/features/`).
    *   L'utilisation de TypeScript est omniprésente, favorisant un typage strict et réduisant l'utilisation de `any`.
    *   Les composants utilisent des Hooks fonctionnels.
    *   Le styling est majoritairement géré via Tailwind CSS avec une approche "utility-first".
    *   Le nommage des variables et fonctions suit généralement les conventions camelCase (ex: `handleInputChange`) et PascalCase pour les composants React et les types (ex: `ProjectForm`, `ProjectState`).
    *   Les commentaires sont présents dans le code, en français, et semblent clairs et concis.



    ## II. Arborescence Complète du Projet

Voici l'arborescence complète des dossiers et fichiers du projet, excluant les dépendances, les fichiers de versioning, les builds et les fichiers de configuration standard (sauf mention contraire pour une configuration spécifique).

```text
.
+-- README.md
+-- bun.lockb
+-- components.json
+-- eslint.config.js
+-- index.html
+-- package.json
+-- supabase
|   +-- config.toml
+-- .idx
|   +-- airules.md
|   +-- dev.nix
+-- public
|   +-- favicon.ico
|   +-- lrs_logo.jpg
|   +-- placeholder.svg
|   +-- robots.txt
|   +-- fonts
|   |   +-- ModernSans-Light.otf
|   |   +-- ModernSans-Light.ttf
|   |   +-- Roboto-Black.ttf
|   |   +-- Roboto-BlackItalic.ttf
|   |   +-- Roboto-Bold.ttf
|   |   +-- Roboto-BoldCondensed.ttf
|   |   +-- Roboto-BoldCondensedItalic.ttf
|   |   +-- Roboto-BoldItalic.ttf
|   |   +-- Roboto-Condensed.ttf
|   |   +-- Roboto-CondensedItalic.ttf
|   |   +-- Roboto-Italic.ttf
|   |   +-- Roboto-Light.ttf
|   |   +-- Roboto-LightItalic.ttf
|   |   +-- Roboto-Medium.ttf
|   |   +-- Roboto-MediumItalic.ttf
|   |   +-- Roboto-Regular.ttf
|   |   +-- Roboto-Thin.ttf
|   |   +-- Roboto-ThinItalic.ttf
|   |   +-- arial.ttf
|   |   +-- times.ttf
|   +-- images
|   |   +-- lrs-logo.jpg
|   |   +-- lrs_logo.jpg
+-- src
|   +-- App.css
|   +-- App.tsx
|   +-- index.css
|   +-- main.tsx
|   +-- vite-env.d.ts
|   +-- components
|   |   +-- Layout.d.ts
|   |   +-- Layout.tsx
|   |   +-- RenovationEstimator.tsx
|   |   +-- SupabaseStatus.tsx
|   |   +-- layout
|   |   |   +-- NavLink.tsx
|   |   |   +-- Navigation.tsx
|   |   |   +-- NewProjectDialog.tsx
|   |   |   +-- OpenProjectDialog.tsx
|   |   |   +-- ProjectBar.tsx
|   |   |   +-- SaveAsDialog.tsx
|   |   |   +-- TitleHeader.tsx
|   |   +-- room
|   |   |   +-- AutresSurfacesList.tsx
|   |   |   +-- AutresSurfacesListWithSupabase.tsx
|   |   |   +-- MenuiserieForm.tsx
|   |   |   +-- MenuiseriesList.tsx
|   |   |   +-- RoomCustomItems.tsx
|   |   |   +-- RoomForm.tsx
|   |   |   +-- RoomsList.tsx
|   |   +-- ui
|   |   |   +-- accordion.tsx
|   |   |   +-- alert-dialog.tsx
|   |   |   +-- alert.tsx
|   |   |   +-- aspect-ratio.tsx
|   |   |   +-- avatar.tsx
|   |   |   +-- badge.tsx
|   |   |   +-- breadcrumb.tsx
|   |   |   +-- button.tsx
|   |   |   +-- calendar.tsx
|   |   |   +-- card.tsx
|   |   |   +-- carousel.tsx
|   |   |   +-- chart.tsx
|   |   |   +-- checkbox.tsx
|   |   |   +-- collapsible.tsx
|   |   |   +-- command.tsx
|   |   |   +-- context-menu.tsx
|   |   |   +-- dialog.tsx
|   |   |   +-- drawer.tsx
|   |   |   +-- dropdown-menu.tsx
|   |   |   +-- form.tsx
|   |   |   +-- hover-card.tsx
|   |   |   +-- input-otp.tsx
|   |   |   +-- input.tsx
|   |   |   +-- label.tsx
|   |   |   +-- loader.tsx
|   |   |   +-- menubar.tsx
|   |   |   +-- navigation-menu.tsx
|   |   |   +-- pagination.tsx
|   |   |   +-- popover.tsx
|   |   |   +-- progress.tsx
|   |   |   +-- radio-group.tsx
|   |   |   +-- resizable.tsx
|   |   |   +-- scroll-area.tsx
|   |   |   +-- select.tsx
|   |   |   +-- separator.tsx
|   |   |   +-- sheet.tsx
|   |   |   +-- sidebar.tsx
|   |   |   +-- skeleton.tsx
|   |   |   +-- slider.tsx
|   |   |   +-- sonner.tsx
|   |   |   +-- switch.tsx
|   |   |   +-- table.tsx
|   |   |   +-- tabs.tsx
|   |   |   +-- textarea.tsx
|   |   |   +-- toast.tsx
|   |   |   +-- toaster.tsx
|   |   |   +-- toggle-group.tsx
|   |   |   +-- toggle.tsx
|   |   |   +-- tooltip.tsx
|   |   |   +-- use-toast.ts
|   |   +-- user
|   |   |   +-- UserSelector.tsx
|   +-- contexts
|   |   +-- AutresSurfacesContext.tsx
|   |   +-- ClientsContext.tsx
|   |   +-- MenuiseriesTypesContext.tsx
|   |   +-- ProjectContext.tsx
|   |   +-- TravauxTypesContext.tsx
|   +-- features
|   |   +-- admin
|   |   |   +-- components
|   |   |   |   +-- ClientForm.tsx
|   |   |   |   +-- CompanyForm.tsx
|   |   |   |   +-- SousTypeTravauxForm.tsx
|   |   |   |   +-- TypeMenuiserieForm.tsx
|   |   |   |   +-- TypeTravauxForm.tsx
|   |   |   +-- pages
|   |   |   |   +-- ClientsList.tsx
|   |   +-- chantier
|   |   |   +-- components
|   |   |   |   +-- ClientDetails.tsx
|   |   |   |   +-- CompanyDetails.tsx
|   |   |   |   +-- InfosChantierLayout.tsx
|   |   |   |   +-- ProjectForm.tsx
|   |   |   |   +-- ProjectList.tsx
|   |   |   |   +-- ProjectSummary.tsx
|   |   |   |   +-- project-form
|   |   |   |   |   +-- ClientSelection.tsx
|   |   |   |   |   +-- ClientsDataField.tsx
|   |   |   |   |   +-- CompanySelection.tsx
|   |   |   |   |   +-- DevisInfoForm.tsx
|   |   |   |   |   +-- ProjectActionButtons.tsx
|   |   |   |   |   +-- ProjectAddressFields.tsx
|   |   |   |   |   +-- ProjectDescriptionField.tsx
|   |   |   |   |   +-- ProjectNameField.tsx
|   |   |   +-- hooks
|   |   |   |   +-- useProjectInfo.tsx
|   |   |   |   +-- useProjectMetadata.tsx
|   |   |   |   +-- useProjectOperations.tsx
|   |   +-- devis
|   |   |   +-- components
|   |   |   |   +-- DevisCoverPreview.tsx
|   |   |   |   +-- DevisDetailsPreview.tsx
|   |   |   |   +-- DevisRecapPreview.tsx
|   |   |   |   +-- PdfSettingsForm.tsx
|   |   |   |   +-- PrintableFieldsForm.tsx
|   |   |   |   +-- pdf-settings
|   |   |   |   |   +-- ColorSettings.tsx
|   |   |   |   |   +-- FontSettings.tsx
|   |   |   |   |   +-- LogoSettings.tsx
|   |   |   |   |   +-- MarginSettings.tsx
|   |   |   |   |   +-- README.md
|   |   |   |   |   +-- SpacingSettings.tsx
|   |   |   |   |   +-- components
|   |   |   |   |   |   +-- AlignmentControl.tsx
|   |   |   |   |   |   +-- BorderControl.tsx
|   |   |   |   |   |   +-- ColorPalette.tsx
|   |   |   |   |   |   +-- ColorPicker.tsx
|   |   |   |   |   |   +-- ElementSelector.tsx
|   |   |   |   |   |   +-- ElementSettingsForm.tsx
|   |   |   |   |   |   +-- FontSelector.tsx
|   |   |   |   |   |   +-- MarginsControl.tsx
|   |   |   |   |   |   +-- NumberControl.tsx
|   |   |   |   |   |   +-- PaddingControl.tsx
|   |   |   |   |   |   +-- SpacingControl.tsx
|   |   |   |   |   |   +-- StyleControls.tsx
|   |   |   |   |   +-- types
|   |   |   |   |   |   +-- elementSettings.ts
|   |   |   |   |   |   +-- typography.ts
|   |   +-- project
|   |   |   +-- hooks
|   |   |   |   +-- useProjectStorage.ts
|   |   |   |   +-- useRooms.ts
|   |   |   |   +-- useSaveLoadWarning.ts
|   |   |   +-- reducers
|   |   |   |   +-- projectReducer.ts
|   |   |   +-- utils
|   |   |   |   +-- projectUtils.ts
|   |   +-- property
|   |   |   +-- components
|   |   |   |   +-- PropertyCard.tsx
|   |   |   |   +-- PropertyForm.tsx
|   |   |   |   +-- RoomsCard.tsx
|   |   +-- renovation
|   |   |   +-- components
|   |   |   |   +-- AutreSurfaceForm.tsx
|   |   +-- recap
|   |   |   +-- components
|   |   |   |   +-- DetailsTravaux.tsx
|   |   |   |   +-- GlobalTotals.tsx
|   |   |   |   +-- NoTravauxMessage.tsx
|   |   |   |   +-- PropertyInfoCard.tsx
|   |   |   |   +-- RecapitulatifTravaux.tsx
|   |   |   |   +-- RoomRecapTable.tsx
|   |   |   |   +-- TotauxRecap.tsx
|   |   |   |   +-- TravailRecapRow.tsx
|   |   |   |   +-- TravauxRecapContent.tsx
|   |   +-- travaux
|   |   |   +-- components
|   |   |   |   +-- DescriptionSection.tsx
|   |   |   |   +-- MenuiserieTypeSelect.tsx
|   |   |   |   +-- PieceSelect.tsx
|   |   |   |   +-- PriceSection.tsx
|   |   |   |   +-- QuantitySection.tsx
|   |   |   |   +-- ServiceGroupSelect.tsx
|   |   |   |   +-- SousTypeSelect.tsx
|   |   |   |   +-- SurfaceImpacteeSelect.tsx
|   |   |   |   +-- TravailCard.tsx
|   |   |   |   +-- TravailForm.tsx
|   |   |   |   +-- TravauxList.tsx
|   |   |   |   +-- TvaSelect.tsx
|   |   |   |   +-- TypeTravauxSelect.tsx
|   |   |   |   +-- UniteSelect.tsx
|   |   |   |   +-- UpdateServiceModal.tsx
|   |   |   +-- data
|   |   |   |   +-- sousTravaux.ts
|   |   |   +-- hooks
|   |   |   |   +-- useCatalogueTravauxMock.ts
|   |   |   |   +-- useTravaux.ts
|   |   |   +-- utils
|   |   |   |   +-- travauxUtils.ts
|   +-- hooks
|   |   +-- use-mobile.tsx
|   |   +-- use-toast.ts
|   |   +-- useAppState.ts
|   |   +-- useAutoSave.ts
|   |   +-- useAutresSurfaces.ts
|   |   +-- useAutresSurfacesWithSupabase.ts
|   |   +-- useCalculSurfaces.ts
|   |   +-- useDevisGeneration.ts
|   |   +-- useLocalStorage.ts
|   |   +-- useMenuiseries.ts
|   |   +-- useProjectOperations.ts
|   |   +-- useRoomCustomItemsWithSupabase.ts
|   +-- integrations
|   |   +-- supabase
|   |   |   +-- client.ts
|   |   |   +-- types.ts
|   +-- lib
|   |   +-- dimensions.ts
|   |   +-- supabase.ts
|   |   +-- utils.ts
|   +-- pages
|   |   +-- AdminTravaux.tsx
|   |   +-- EditionDevis.tsx
|   |   +-- Index.tsx
|   |   +-- InfosChantier.tsx
|   |   +-- NotFound.tsx
|   |   +-- Parametres.tsx
|   |   +-- Recapitulatif.tsx
|   |   +-- Travaux.tsx
|   +-- services
|   |   +-- autresSurfacesService.ts
|   |   +-- clientsService.ts
|   |   +-- companiesService.ts
|   |   +-- devisService.ts
|   |   +-- menuiseriesService.ts
|   |   +-- pdfGenerationService.ts
|   |   +-- projectSaveService.ts
|   |   +-- projectService.ts
|   |   +-- travauxService.ts
|   |   +-- pdf
|   |   |   +-- pdfConstants.ts
|   |   |   +-- pdfGenerators.ts
|   |   |   +-- pdfResources.ts
|   |   |   +-- react-pdf
|   |   |   |   +-- components
|   |   |   |   |   +-- CGVPage.tsx
|   |   |   |   |   +-- CGVPageContent.tsx
|   |   |   |   |   +-- ClientSection.tsx
|   |   |   |   |   +-- CompanyAddressSection.tsx
|   |   |   |   |   +-- ContactSection.tsx
|   |   |   |   |   +-- CoverDocumentContent.tsx
|   |   |   |   |   +-- DetailsPage.tsx
|   |   |   |   |   +-- DetailsPageContent.tsx
|   |   |   |   |   +-- HeaderSection.tsx
|   |   |   |   |   +-- ProjectSection.tsx
|   |   |   |   |   +-- QuoteInfoSection.tsx
|   |   |   |   |   +-- RecapPage.tsx
|   |   |   |   |   +-- RecapPageContent.tsx
|   |   |   |   |   +-- SloganSection.tsx
|   |   |   |   |   +-- common
|   |   |   |   |   |   +-- PageFooter.tsx
|   |   |   |   |   |   +-- PageHeader.tsx
|   |   |   |   |   |   +-- VerticalSpacer.tsx
|   |   |   |   +-- hooks
|   |   |   |   |   +-- useReactPdfGeneration.tsx
|   |   |   |   +-- types
|   |   |   |   |   +-- pdfTypes.ts
|   |   |   |   +-- utils
|   |   |   |   |   +-- dateUtils.ts
|   |   |   |   |   +-- formatUtils.ts
|   |   |   |   |   +-- pdfStyleUtils.ts
|   |   |   |   |   +-- pdfUtils.ts
|   |   |   |   |   +-- reactPdfFonts.ts
|   |   |   +-- resources
|   |   |   |   +-- images.ts
|   |   |   +-- services
|   |   |   |   +-- completePdfService.ts
|   |   |   |   +-- detailedPdfService.ts
|   |   |   |   +-- pdfDocumentService.ts
|   |   |   |   +-- recapPdfService.ts
|   |   |   +-- types
|   |   |   |   +-- pdfTypes.ts
|   |   |   +-- utils
|   |   |   |   +-- dateUtils.ts
|   |   |   |   +-- fontUtils.ts
|   |   |   |   +-- pdfUtils.ts
|   |   |   +-- v2
|   |   |   |   +-- utils
|   |   |   |   |   +-- styleUtils.ts
|   |   +-- project
|   |   |   +-- index.ts
|   |   |   +-- projectBaseService.ts
|   |   |   +-- projectUtils.ts
|   |   |   +-- roomItemsService.ts
|   |   |   +-- roomWorksService.ts
|   |   |   +-- roomsService.ts
|   +-- types
|   |   +-- client.ts
|   |   +-- index.ts
|   |   +-- menuiserie.ts
|   |   +-- project.ts
|   |   +-- room.ts
|   |   +-- supabase.ts
|   |   +-- surface.ts
|   |   +-- travaux.ts


## III. Description Détaillée des Fichiers Sources (src/)

Cette section fournit une description détaillée du rôle et du contenu de chaque fichier et dossier situés directement sous le dossier `src/`.

### 1. Fichier `src/main.tsx`

*   **Chemin :** `src/main.tsx`
*   **Rôle :** Point d'entrée principal de l'application React. Ce fichier initialise le rendu de l'application dans le DOM.
*   **Imports Clés :**
    *   `React` (pour le mode strict et le JSX)
    *   `ReactDOM.createRoot` (pour le rendu de l'application)
    *   `App` (composant racine de l'application)
    *   `./index.css` (styles CSS globaux)
*   **Exports Clés :** Aucun.
*   **Logique Principale :**
    *   Sélectionne l'élément racine du DOM (`#root`).
    *   Crée une racine React (`ReactDOM.createRoot`).
    *   Rend le composant `<App />` enveloppé dans `<React.StrictMode>` pour aider à identifier les problèmes potentiels dans l'application.
    *   Applique les styles globaux via l'import de `./index.css`.

### 2. Fichier `src/App.tsx`

*   **Chemin :** `src/App.tsx`
*   **Rôle :** Composant racine de l'application React. Il configure le routage, inclut les différents fournisseurs de contexte (Providers) et englobe la structure principale de l'application (Layout).
*   **Imports Clés :**
    *   `BrowserRouter`, `Route`, `Routes` (depuis `react-router-dom` pour le routage côté client)
    *   `Layout` (composant de layout global)
    *   `Toaster` (composant de notification globale, probablement shadcn/ui)
    *   Providers de Contextes (ex: `ProjectProvider`, `ClientsProvider`, `TravauxTypesProvider`, etc.)
    *   Pages de l'application (ex: `Index`, `InfosChantier`, `Travaux`, `Recapitulatif`, `EditionDevis`, `NotFound`, `Parametres`, `AdminTravaux`)
    *   Hooks globaux ou utilitaires (ex: `useAppState`, `useAutoSave`, `useAutresSurfacesWithSupabase`, `useMenuiseries`)
*   **Exports Clés :** `App` (composant fonctionnel).
*   **Logique Principale :**
    *   Structure la composition de l'application en enveloppant le routage et le layout avec les différents Providers nécessaires à l'état global et au fetching de données.
    *   **Configuration du Router :** Utilise `BrowserRouter` pour gérer l'historique de navigation. Définit les différentes routes de l'application (`<Route>`) associant des chemins d'URL (`path`) à des éléments de page (`element`). Inclut une route pour la page 404 (`*`).
    *   **Inclusion des Providers de Contexte Globaux :** Enveloppe l'ensemble de l'application (ou une partie significative) avec plusieurs Context Providers :
        *   `ProjectProvider` : Gère l'état global du projet de devis (metadata, pièces, travaux, etc.) via `useReducer`.
        *   `ClientsProvider` : Fournit l'accès et la gestion des données clients (probablement via TanStack Query).
        *   `TravauxTypesProvider` : Fournit l'accès aux types et sous-types de travaux (probablement via TanStack Query).
        *   `MenuiseriesTypesProvider` : Fournit l'accès aux types de menuiseries (probablement via TanStack Query).
        *   `AutresSurfacesContext` : Fournit l'accès et la gestion d'autres types de surfaces (probablement via TanStack Query ou un hook spécifique).
        *   D'autres providers ou hooks initiaux peuvent être présents (ex: `useAppState` pour l'état de l'application, hooks Supabase pour la synchronisation).
    *   Rend le composant `Layout` qui fournit la structure visuelle globale (en-tête, navigation, zone de contenu).
    *   Inclut le `Toaster` pour l'affichage des notifications.

### 3. Fichier `src/index.css`

*   **Chemin :** `src/index.css`
*   **Rôle :** Fichier CSS global importanté dans `main.tsx`. Il contient probablement les styles de base de l'application, les styles générés par Tailwind CSS, et potentiellement des styles personnalisés appliqués globalement.
*   **Imports Clés :** Peut importer d'autres fichiers CSS ou des règles de style (ex: `@import`, `@tailwind`).
*   **Exports Clés :** Aucun.
*   **Logique Principale :** Définit les styles CSS appliqués à l'ensemble de l'application. Contient les directives `@tailwind base;`, `@tailwind components;`, `@tailwind utilities;` si Tailwind CSS est utilisé.

### 4. Fichier `src/vite-env.d.ts`

*   **Chemin :** `src/vite-env.d.ts`
*   **Rôle :** Fichier de déclaration de types TypeScript pour l'environnement de build Vite. Il définit des types globaux spécifiques à Vite, comme `ImportMetaEnv` pour les variables d'environnement.
*   **Imports Clés :** Aucun.
*   **Exports Clés :** Aucun.
*   **Logique Principale :** Fournit des définitions de types pour améliorer l'expérience de développement avec TypeScript dans un projet Vite, permettant par exemple d'accéder aux variables d'environnement via `import.meta.env` avec un typage correct.

### 5. Dossier `src/components/ui/`

Ce dossier contient les composants d'interface utilisateur de base générés ou configurés à partir d'une librairie UI externe, très probablement [shadcn/ui](https://ui.shadcn.com/), qui est construite sur [Radix UI](https://www.radix-ui.com/) et stylisée avec [Tailwind CSS](https://tailwindcss.com/).

Ces composants sont les blocs de construction atomiques utilisés dans toute l'application pour créer l'interface utilisateur. Ils sont généralement copiés et adaptés dans le projet pour permettre une personnalisation facile via Tailwind CSS et encapsulent la logique d'accessibilité et d'état fournie par Radix UI.

Voici la liste des composants de base de cette librairie présents dans ce dossier :

*   `accordion.tsx`
*   `alert-dialog.tsx`
*   `alert.tsx`
*   `aspect-ratio.tsx`
*   `avatar.tsx`
*   `badge.tsx`
*   `breadcrumb.tsx`
*   `button.tsx`
*   `calendar.tsx`
*   `card.tsx`
*   `carousel.tsx`
*   `chart.tsx`
*   `checkbox.tsx`
*   `collapsible.tsx`
*   `command.tsx`
*   `context-menu.tsx`
*   `dialog.tsx`
*   `drawer.tsx`
*   `dropdown-menu.tsx`
*   `form.tsx`
*   `hover-card.tsx`
*   `input-otp.tsx`
*   `input.tsx`
*   `label.tsx`
*   `loader.tsx`
*   `menubar.tsx`
*   `navigation-menu.tsx`
*   `pagination.tsx`
*   `popover.tsx`
*   `progress.tsx`
*   `radio-group.tsx`
*   `resizable.tsx`
*   `scroll-area.tsx`
*   `select.tsx`
*   `separator.tsx`
*   `sheet.tsx`
*   `sidebar.tsx`
*   `skeleton.tsx`
*   `slider.tsx`
*   `sonner.tsx`
*   `switch.tsx`
*   `table.tsx`
*   `tabs.tsx`
*   `textarea.tsx`
*   `toast.tsx`
*   `toaster.tsx`
*   `toggle-group.tsx`
*   `toggle.tsx`
*   `tooltip.tsx`
*   `use-toast.ts`

Cette liste couvre les composants UI de base présents dans le projet.

### 6. Dossier `src/components/` (Perso)

Ce dossier contient des composants React réutilisables spécifiques à l'application "Application Devis Bâtiment", par opposition aux composants UI de base situés dans `src/components/ui/`. Il contient également des sous-dossiers pour des composants plus spécifiques (`layout/`, `room/`).

#### Composants à la Racine de `src/components/`

##### `src/components/Layout.tsx`

*   **Chemin :** `src/components/Layout.tsx`
*   **Rôle :** Fournit la structure de layout globale de l'application, incluant l'en-tête (ProjectBar), la navigation latérale (Navigation) et la zone principale où le contenu des pages est rendu via `react-router-dom`.
*   **Imports Clés :**
    *   `Outlet` (depuis `react-router-dom` pour le rendu du contenu de la route active)
    *   `Navigation` (composant de navigation latérale depuis `./layout/Navigation.tsx`)
    *   `ProjectBar` (composant de barre de projet en haut depuis `./layout/ProjectBar.tsx`)
*   **Exports Clés :** `Layout` (composant fonctionnel, export par défaut).
*   **Props :** Aucune prop définie explicitement. Il utilise l'`Outlet` de `react-router-dom` pour rendre son contenu.
*   **États Locaux :** Aucun état local défini.
*   **Effets (`useEffect`) :** Aucun effet défini.
*   **Fonctions Internes / Gestionnaires d'Événements :** Aucune fonction interne ou gestionnaire d'événements principal défini. Sa logique est principalement structurelle.
*   **Structure JSX :** Rend une structure simple composée de :
    *   Un conteneur principal (div).
    *   Le composant `ProjectBar` en haut.
    *   Un conteneur flexible pour la navigation et le contenu principal.
    *   Le composant `Navigation` sur le côté.
    *   Un conteneur pour le contenu principal où l'`Outlet` rend le composant de la route active.
*   **Export :** `export default Layout;`

##### `src/components/RenovationEstimator.tsx`

*   **Chemin :** `src/components/RenovationEstimator.tsx`
*   **Rôle Précis :** Basé sur l'analyse de son code source *actuel*, ce composant semble être un conteneur structurel ou une relique d'une architecture précédente où il aurait pu gérer le routage principal ou l'ordonnancement des étapes de l'estimation de rénovation. Dans la configuration actuelle de l'application où le routage est défini dans `App.tsx`, ce composant ne fait qu'inclure le `Layout` et rendre l'`Outlet` de React Router. **Il ne gère PAS directement la saisie du "Type de bien à rénover" ni des "Pièces à rénover".** Ces logiques sont implémentées dans les pages spécifiques (`InfosChantier.tsx` pour le type de bien/métadonnées du projet, `Travaux.tsx` pour la gestion des travaux par pièce) et les hooks/contextes associés (`useProject`, `useRooms`, etc.). Le code contient des sections commentées suggérant qu'il était potentiellement destiné à définir les routes de l'application.
*   **Imports Clés :**
    *   `Layout` (composant personnalisé pour la structure globale de la page)
    *   `Outlet` (depuis `react-router-dom`, utilisé *implicitement* via le `Layout`)
    *   Les imports de pages (`InfosChantier`, `Travaux`, `Recapitulatif`, `EditionDevis`, `Parametres`, `NotFound`) et de composants de routage (`BrowserRouter`, `Route`, `Routes`) sont présents, mais ils ne sont **pas utilisés** dans le JSX actuellement actif.
*   **Exports Clés :** `RenovationEstimator` (composant fonctionnel).
*   **Props :** Aucune prop définie explicitement.
*   **États Locaux (`useState`) :** Aucun état local défini.
*   **Effets (`useEffect`) :** Aucun effet défini.
*   **Fonctions Internes / Gestionnaires d'Événements :** Aucune fonction interne ou gestionnaire d'événements principal défini.
*   **Structure JSX :** Rend le composant `Layout`. Contient du code de routage (`BrowserRouter`, `Routes`, `Route`) importé et présent en tant que code commenté, indiquant un usage potentiel différent par le passé ou dans une autre branche.
*   **Export :** `export default RenovationEstimator;`

##### `src/components/SupabaseStatus.tsx`

*   **Chemin :** `src/components/SupabaseStatus.tsx`
*   **Rôle :** Affiche l'état de la connexion à Supabase. Il peut indiquer si l'application est connectée, en cours de connexion, ou déconnectée, potentiellement en affichant l'utilisateur connecté.
*   **Imports Clés :**
    *   `useSupabaseClient` (hook pour obtenir l'instance du client Supabase)
    *   `useState`, `useEffect` (pour gérer l'état local de la connexion et les effets secondaires)
    *   `User` (type Supabase pour l'utilisateur)
*   **Exports Clés :** `SupabaseStatus` (composant fonctionnel).
*   **Props :** Aucune prop définie.
*   **États Locaux :**
    *   `user: User | null`: Stocke les informations de l'utilisateur Supabase actuellement connecté, ou `null` si déconnecté.
    *   `loading: boolean`: Indique si l'état de l'authentification est en cours de chargement.
*   **Effets (`useEffect`) :**
    *   Un effet principal est utilisé pour écouter les changements d'état d'authentification Supabase (`supabase.auth.onAuthStateChange`).
    *   Lorsqu'un changement d'état se produit (connexion, déconnexion, etc.), la fonction de rappel met à jour l'état local `user` avec le nouvel utilisateur et `loading` à `false`.
    *   La fonction de nettoyage retournée par `useEffect` est importante pour se désabonner de l'écouteur d'événements lors du démontage du composant (`data.subscription.unsubscribe()`).
*   **Fonctions Internes / Gestionnaires d'Événements :**
    *   La fonction de rappel pour `onAuthStateChange` met à jour l'état local.
*   **Structure JSX :** Rend un indicateur visuel simple de l'état de la connexion. Affiche "Loading..." pendant le chargement. Si un utilisateur est connecté, affiche son email ou un identifiant. Sinon, indique que l'utilisateur est déconnecté. Utilise l'état local `user` et `loading` pour déterminer ce qui doit être affiché.
*   **Export :** `export const SupabaseStatus = () => { ... };` (export nommé).

#### Composants dans `src/components/layout/`

*(Documentation en cours de génération...)*

#### Composants dans `src/components/room/`

*(Documentation en cours de génération...)*

#### Composants dans `src/components/layout/`

##### `src/components/layout/NavLink.tsx`

*   **Chemin :** `src/components/layout/NavLink.tsx`
*   **Rôle Précis :** Ce composant représente un lien de navigation personnalisé, probablement utilisé dans la barre de navigation latérale (`Navigation.tsx`). Il encapsule un `Link` de `react-router-dom` et gère l'affichage de l'état actif du lien (par exemple, en changeant les styles si l'URL actuelle correspond à la cible du lien).
*   **Imports Clés :**
    *   `Link`, `useLocation` (depuis `react-router-dom`)
    *   `ReactNode` (pour le type des enfants)
    *   `cn` (depuis `@/lib/utils` pour combiner les classes CSS)
    *   Composants UI (ex: `Tooltip`, `TooltipTrigger`, `TooltipContent` de `shadcn/ui`)
    *   Icônes (`lucide-react`)
*   **Exports Clés :** `NavLink` (composant fonctionnel).
*   **Props :**
    *   `to`: `string` (non optionnel) - Le chemin de destination du lien.
    *   `children`: `ReactNode` (non optionnel) - Le contenu à afficher à l'intérieur du lien (souvent une icône ou du texte).
    *   `label`: `string` (non optionnel) - Le texte à afficher dans le tooltip.
    *   `className`: `string` (optionnel) - Classes CSS supplémentaires à appliquer.
*   **États Locaux (`useState`) :** Aucun état local géré directement.
*   **Effets (`useEffect`) :** Aucun effet défini.
*   **Fonctions Internes / Gestionnaires d'Événements :**
    *   Utilise `useLocation()` pour obtenir l'URL actuelle.
    *   Détermine si le lien est actif (`isActive`) en comparant `location.pathname` avec la prop `to`.
*   **Structure JSX :**
    *   Rend un composant `Tooltip` pour afficher le `label` au survol.
    *   Le `TooltipTrigger` contient le composant `Link` de `react-router-dom`.
    *   Le `Link` a des classes CSS appliquées dynamiquement via `cn` en fonction de l'état `isActive` pour le style visuel (ex: couleur de fond, couleur du texte).
    *   Le contenu du lien (`children`, typiquement une icône) est rendu à l'intérieur du `Link`.
*   **Interactions :** Permet la navigation vers la route `to` au clic. Affiche un tooltip au survol. Change d'apparence visuelle si la route est active.
*   **Export :** `export const NavLink = (...) => { ... };`

##### `src/components/layout/Navigation.tsx`

*   **Chemin :** `src/components/layout/Navigation.tsx`
*   **Rôle Précis :** Affiche la barre de navigation latérale principale de l'application. Contient des liens (utilisant `NavLink`) vers les différentes sections/pages principales (Infos Chantier, Travaux, Récapitulatif, Édition Devis, Paramètres).
*   **Imports Clés :**
    *   `NavLink` (composant personnalisé de navigation)
    *   Icônes (`Home`, `Hammer`, `ClipboardList`, `Printer`, `Settings`, `Wrench` depuis `lucide-react`)
*   **Exports Clés :** `Navigation` (composant fonctionnel).
*   **Props :** Aucune prop explicite.
*   **États Locaux (`useState`) :** Aucun état local.
*   **Effets (`useEffect`) :** Aucun effet défini.
*   **Fonctions Internes / Gestionnaires d'Événements :** Aucune fonction interne complexe.
*   **Structure JSX :**
    *   Rend un conteneur `aside` ou `nav` pour la barre latérale.
    *   Contient une série de composants `NavLink`, chacun pointant vers une route spécifique (`/chantier`, `/travaux`, `/recapitulatif`, `/edition-devis`, `/parametres`, `/admin/travaux`).
    *   Chaque `NavLink` reçoit une icône correspondante comme `children` et un `label` pour le tooltip.
*   **Interactions :** Permet à l'utilisateur de naviguer entre les différentes pages principales de l'application.
*   **Export :** `export const Navigation = () => { ... };`

##### `src/components/layout/NewProjectDialog.tsx`

*   **Chemin :** `src/components/layout/NewProjectDialog.tsx`
*   **Rôle Précis :** Affiche une modale (Dialog) pour confirmer la création d'un nouveau projet. Elle avertit l'utilisateur si le projet actuel a des modifications non sauvegardées et demande confirmation avant de procéder.
*   **Imports Clés :**
    *   Composants UI (`Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter`, `AlertDialog`, `AlertDialogTrigger`, `AlertDialogContent`, `AlertDialogHeader`, `AlertDialogTitle`, `AlertDialogDescription`, `AlertDialogFooter`, `AlertDialogCancel`, `AlertDialogAction`, `Button`)
    *   Hooks (`useProjectOperations`, `useProject` pour vérifier `isDirty` ou `hasUnsavedChanges`)
*   **Exports Clés :** `NewProjectDialog` (composant fonctionnel).
*   **Props :**
    *   `isOpen`: `boolean` (non optionnel) - Contrôle si la modale est visible.
    *   `onClose`: `() => void` (non optionnel) - Fonction appelée pour fermer la modale.
*   **États Locaux (`useState`) :** Aucun état local majeur (l'état d'ouverture est géré par la prop `isOpen`).
*   **Effets (`useEffect`) :** Aucun effet défini.
*   **Fonctions Internes / Gestionnaires d'Événements :**
    *   Utilise `useProject().state.isDirty` (ou `hasUnsavedChanges` de `useProjectInfo`) pour déterminer s'il faut afficher un `AlertDialog` d'avertissement à l'intérieur du `Dialog` principal.
    *   `handleCreateNewProject`: Appelle la fonction `createProject` (ou similaire) de `useProjectOperations`. Appelle ensuite `onClose` pour fermer la modale.
    *   Gestionnaires pour `AlertDialogAction` (appelle `handleCreateNewProject`) et `AlertDialogCancel`.
*   **Structure JSX :**
    *   Rend un composant `Dialog` contrôlé par `isOpen`.
    *   À l'intérieur, affiche un titre et une description.
    *   Conditionnellement (si `isDirty` est vrai), rend un `AlertDialog` imbriqué qui demande confirmation avant de continuer. Le bouton "Continuer" de l'`AlertDialog` est le déclencheur (`AlertDialogAction`) qui appelle `handleCreateNewProject`.
    *   Si `isDirty` est faux, affiche directement un bouton "Créer un nouveau projet" dans le `DialogFooter` qui appelle `handleCreateNewProject`.
    *   Inclut un bouton "Annuler" pour fermer la modale (`onClose`).
*   **Interactions :** Demande confirmation avant de créer un nouveau projet si des modifications sont en cours. Déclenche la création du nouveau projet via `useProjectOperations`.
*   **Export :** `export const NewProjectDialog = (...) => { ... };`

##### `src/components/layout/OpenProjectDialog.tsx`

*   **Chemin :** `src/components/layout/OpenProjectDialog.tsx`
*   **Rôle Précis :** Affiche une modale (Dialog) permettant à l'utilisateur de sélectionner et de charger un projet existant. Affiche la liste des projets disponibles (via `ProjectList`).
*   **Imports Clés :**
    *   Composants UI (`Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter`, `Button`)
    *   Composant `ProjectList` (depuis `src/features/chantier/components/ProjectList.tsx`)
    *   Hooks (`useProjectOperations`, `useProject` pour obtenir la liste des projets si pas passé en prop, `useState` pour l'état de chargement local)
    *   Types (`ProjectState`)
*   **Exports Clés :** `OpenProjectDialog` (composant fonctionnel).
*   **Props :**
    *   `isOpen`: `boolean` (non optionnel) - Contrôle si la modale est visible.
    *   `onClose`: `() => void` (non optionnel) - Fonction appelée pour fermer la modale.
*   **États Locaux (`useState`) :**
    *   `projects`: `ProjectState[]` (ou type simplifié) - Stocke la liste des projets à afficher (peut être chargée ici ou reçue via un hook).
    *   `isLoading`: `boolean` - Indique si la liste des projets est en cours de chargement.
*   **Effets (`useEffect`) :** Potentiellement un `useEffect` pour charger la liste des projets (`projects`) au montage de la modale ou lorsque `isOpen` devient vrai, en appelant une fonction du service `projectSaveService` ou un hook dédié.
*   **Fonctions Internes / Gestionnaires d'Événements :**
    *   `handleSelectProject`: Fonction passée en prop `onSelectProject` à `ProjectList`. Appelle la fonction `loadProject` de `useProjectOperations` avec l'ID sélectionné. Appelle ensuite `onClose`.
    *   `handleDeleteProject`: Fonction passée en prop `onDeleteProject` à `ProjectList`. Appelle la fonction `deleteProject` de `useProjectOperations` avec l'ID sélectionné. Rafraîchit potentiellement la liste des projets après suppression.
*   **Structure JSX :**
    *   Rend un composant `Dialog` contrôlé par `isOpen`.
    *   Affiche un titre et une description.
    *   Rend le composant `ProjectList`, en lui passant la liste `projects` (depuis l'état local ou un hook), `isLoading`, et les fonctions `handleSelectProject` et `handleDeleteProject` comme props de rappel.
    *   Inclut un bouton "Annuler" pour fermer la modale (`onClose`).
*   **Interactions :** Affiche la liste des projets sauvegardés. Permet à l'utilisateur de sélectionner un projet pour le charger ou de le supprimer. Déclenche les opérations via `useProjectOperations`.
*   **Export :** `export const OpenProjectDialog = (...) => { ... };`

##### `src/components/layout/ProjectBar.tsx`

*   **Chemin :** `src/components/layout/ProjectBar.tsx`
*   **Rôle Précis :** Affiche la barre d'en-tête horizontale principale de l'application. Contient le nom du projet actuel, des indicateurs (état de sauvegarde) et des boutons d'action globaux (Nouveau, Ouvrir, Enregistrer, Enregistrer Sous, etc.). Gère l'ouverture des modales correspondantes.
*   **Imports Clés :**
    *   Composants UI (`Button`, `Tooltip`, `TooltipTrigger`, `TooltipContent`, `Separator`)
    *   Composants Modales (`NewProjectDialog`, `OpenProjectDialog`, `SaveAsDialog`)
    *   Hooks (`useAppState` pour gérer l'ouverture/fermeture des modales et potentiellement l'état de sauvegarde, `useProject` pour le nom du projet et `isDirty`, `useProjectOperations` pour les actions d'enregistrement/suppression)
    *   Icônes (`FilePlus`, `FolderOpen`, `Save`, `SaveAll`, `Trash`)
*   **Exports Clés :** `ProjectBar` (composant fonctionnel).
*   **Props :** Aucune prop explicite. Utilise les hooks.
*   **États Locaux (`useState`) :** Gère l'état d'ouverture de chaque modale :
    *   `isNewProjectModalOpen: boolean`
    *   `isOpenProjectModalOpen: boolean`
    *   `isSaveAsModalOpen: boolean`
*   **Effets (`useEffect`) :** Aucun effet majeur défini directement.
*   **Fonctions Internes / Gestionnaires d'Événements :**
    *   Fonctions pour ouvrir chaque modale (ex: `handleOpenNewProjectModal`, met l'état correspondant à `true`).
    *   Fonctions pour fermer chaque modale (ex: `handleCloseNewProjectModal`, met l'état correspondant à `false`).
    *   `handleSaveProject`: Appelle la fonction `saveProject` de `useProjectOperations`.
    *   `handleDeleteProject`: Appelle la fonction `deleteProject` de `useProjectOperations` (après confirmation éventuelle).
*   **Structure JSX :**
    *   Rend une barre horizontale (`header` ou `div`).
    *   Affiche le nom du projet actuel (ex: `projectState.metadata.nomProjet`).
    *   Affiche potentiellement un indicateur d'état de sauvegarde (ex: un texte "Modifications non enregistrées" si `isDirty`).
    *   Rend une série de boutons d'action (`Button` avec icônes et `Tooltip`). Chaque bouton a un `onClick` qui ouvre la modale correspondante (ex: `handleOpenNewProjectModal`) ou déclenche directement une action (`handleSaveProject`).
    *   Rend les composants modales (`NewProjectDialog`, `OpenProjectDialog`, `SaveAsDialog`), en leur passant l'état d'ouverture (`isOpen`) et la fonction de fermeture (`onClose`).
*   **Interactions :** Affiche le nom du projet et l'état de sauvegarde. Permet à l'utilisateur d'initier les actions de création, chargement, sauvegarde, et sauvegarde sous via les boutons, qui ouvrent des modales ou appellent directement les hooks d'opérations.
*   **Export :** `export const ProjectBar = () => { ... };`

##### `src/components/layout/SaveAsDialog.tsx`

*   **Chemin :** `src/components/layout/SaveAsDialog.tsx`
*   **Rôle Précis :** Affiche une modale (Dialog) demandant à l'utilisateur de saisir un nouveau nom pour sauvegarder le projet actuel. Utilisé pour la fonctionnalité "Enregistrer Sous".
*   **Imports Clés :**
    *   Composants UI (`Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter`, `Input`, `Label`, `Button`)
    *   Hooks (`useState` pour gérer le champ de saisie, `useProjectOperations`)
*   **Exports Clés :** `SaveAsDialog` (composant fonctionnel).
*   **Props :**
    *   `isOpen`: `boolean` (non optionnel) - Contrôle si la modale est visible.
    *   `onClose`: `() => void` (non optionnel) - Fonction appelée pour fermer la modale.
*   **États Locaux (`useState`) :**
    *   `newProjectName: string`: Stocke la valeur saisie par l'utilisateur dans le champ de nom.
*   **Effets (`useEffect`) :** Aucun effet majeur. Peut réinitialiser `newProjectName` lorsque la modale s'ouvre.
*   **Fonctions Internes / Gestionnaires d'Événements :**
    *   `handleNameChange`: Met à jour l'état `newProjectName` lorsque l'utilisateur tape dans l'input.
    *   `handleSave`: Appelle la fonction `saveProjectAs` (ou une fonction similaire gérant la sauvegarde avec un nouveau nom) de `useProjectOperations`, en lui passant `newProjectName`. Appelle ensuite `onClose`.
*   **Structure JSX :**
    *   Rend un composant `Dialog` contrôlé par `isOpen`.
    *   Affiche un titre et une description.
    *   Contient un champ `Input` (avec `Label`) pour saisir le nouveau nom, lié à l'état `newProjectName`.
    *   Affiche un bouton "Enregistrer" (`onClick={handleSave}`) et un bouton "Annuler" (`onClick={onClose}`).
*   **Interactions :** Permet à l'utilisateur de saisir un nouveau nom pour le projet. Déclenche l'opération "Enregistrer Sous" via `useProjectOperations`.
*   **Export :** `export const SaveAsDialog = (...) => { ... };`

##### `src/components/layout/TitleHeader.tsx`

*   **Chemin :** `src/components/layout/TitleHeader.tsx`
*   **Rôle Précis :** Affiche un titre et un sous-titre standardisés en haut de la zone de contenu principal d'une page. Utilisé par les différentes pages pour afficher leur titre.
*   **Imports Clés :** Composants UI (`h1`, `p`, classes Tailwind CSS).
*   **Exports Clés :** `TitleHeader` (composant fonctionnel).
*   **Props :**
    *   `title`: `string` (non optionnel) - Le titre principal à afficher.
    *   `subtitle`: `string` (optionnel) - Le sous-titre ou la description à afficher sous le titre.
*   **États Locaux (`useState`) :** Aucun état local.
*   **Effets (`useEffect`) :** Aucun effet défini.
*   **Fonctions Internes / Gestionnaires d'Événements :** Aucune fonction interne.
*   **Structure JSX :**
    *   Rend un conteneur `div`.
    *   À l'intérieur, un `h1` pour afficher la prop `title` et un `p` pour afficher la prop `subtitle` (rendu conditionnel si `subtitle` existe). Des classes Tailwind sont appliquées pour le style (taille, poids, couleur, espacement).
*   **Interactions :** Affiche du texte statique fourni via les props.
*   **Export :** `export const TitleHeader = (...) => { ... };`

#### Composants dans `src/components/room/`

##### `src/components/room/AutresSurfacesList.tsx`

*   **Chemin :** `src/components/room/AutresSurfacesList.tsx`
*   **Rôle Précis :** Affiche la liste des "Autres Surfaces" (ex: dalles, chapes, cloisons) ajoutées à une pièce spécifique. Permet potentiellement d'ajouter, modifier ou supprimer ces éléments pour la pièce.
*   **Imports Clés :**
    *   Composants UI (`Card`, `CardHeader`, `CardTitle`, `CardContent`, `Table`, `TableBody`, `TableCell`, `TableRow`, `Button`, `Dialog`)
    *   Icônes (ex: `Plus`, `Edit`, `Trash`)
    *   Hooks (`useState`)
    *   Types (`AutreSurfaceItem`, `Room`)
    *   Composant `AutreSurfaceForm` (depuis `src/features/renovation/components/AutreSurfaceForm.tsx` pour la modale d'ajout/édition)
*   **Exports Clés :** `AutresSurfacesList` (composant fonctionnel).
*   **Props :**
    *   `room`: `Room` (non optionnel) - La pièce dont on affiche/gère les autres surfaces. Contient le tableau `room.autresSurfaces`.
    *   `onUpdateRoom`: `(roomId: string, updates: Partial<Room>) => void` (non optionnel) - Fonction de rappel pour mettre à jour l'objet `Room` dans l'état global du projet lorsque des modifications sont apportées aux autres surfaces.
*   **États Locaux (`useState`) :**
    *   `isFormOpen: boolean`: Contrôle l'ouverture de la modale contenant `AutreSurfaceForm`.
    *   `surfaceToEdit: AutreSurfaceItem | null`: Stocke l'autre surface en cours d'édition.
*   **Effets (`useEffect`) :** Aucun effet majeur défini.
*   **Fonctions Internes / Gestionnaires d'Événements :**
    *   `handleAddClick`: Ouvre la modale `AutreSurfaceForm` en mode création (`surfaceToEdit = null`).
    *   `handleEditClick`: Prend une `AutreSurfaceItem`, la stocke dans `surfaceToEdit` et ouvre la modale.
    *   `handleDeleteClick`: Supprime l'élément `AutreSurfaceItem` du tableau `room.autresSurfaces` et appelle `onUpdateRoom` avec la pièce mise à jour. Demande potentiellement confirmation.
    *   `handleFormSubmit`: Reçoit les données du formulaire `AutreSurfaceForm`. Si `surfaceToEdit` existe, met à jour l'élément correspondant dans `room.autresSurfaces`. Sinon, ajoute le nouvel élément au tableau. Appelle `onUpdateRoom` avec la pièce mise à jour. Ferme la modale.
*   **Structure JSX :**
    *   Rend un conteneur (potentiellement une `Card` ou une section).
    *   Affiche un titre "Autres Surfaces".
    *   Affiche un bouton "Ajouter".
    *   Itère sur le tableau `room.autresSurfaces` et affiche chaque élément (description, quantité, unité) dans une liste ou un tableau (`Table`).
    *   Chaque ligne a des boutons "Modifier" et "Supprimer".
    *   Rend le `Dialog` contenant `AutreSurfaceForm` (contrôlé par `isFormOpen`).
*   **Interactions :** Permet de lister, ajouter, modifier et supprimer les "Autres Surfaces" spécifiques à une pièce. Communique les changements à la pièce parente via `onUpdateRoom`.
*   **Export :** `export const AutresSurfacesList = (...) => { ... };`

##### `src/components/room/AutresSurfacesListWithSupabase.tsx`

*   **Chemin :** `src/components/room/AutresSurfacesListWithSupabase.tsx`
*   **Rôle Précis :** **OBSOLÈTE/RELIQUE PROBABLE.** Ce composant semble être une version alternative de `AutresSurfacesList` qui interagissait potentiellement directement avec Supabase (via un hook comme `useAutresSurfacesWithSupabase` ou des appels directs au service) au lieu de manipuler l'état local de la `Room` passé en prop. Étant donné que l'état du projet est maintenant géré de manière centralisée dans `ProjectContext` et sauvegardé en JSONB, la logique d'interaction directe avec Supabase pour des éléments *internes* à une pièce est probablement obsolète.
*   **Imports Clés :** Similaires à `AutresSurfacesList`, mais inclurait probablement des hooks ou services d'accès direct à Supabase (ex: `useAutresSurfacesWithSupabase`).
*   **Exports Clés :** `AutresSurfacesListWithSupabase` (composant fonctionnel).
*   **Props :** Probablement `roomId: string` (pour fetcher les données) au lieu de l'objet `Room` complet.
*   **Logique Interne :** Utiliserait un hook ou un service pour fetcher/créer/modifier/supprimer les enregistrements d'autres surfaces directement dans une table Supabase dédiée (table `room_autres_surfaces` ?), potentiellement en utilisant TanStack Query.
*   **Export :** `export const AutresSurfacesListWithSupabase = (...) => { ... };`

##### `src/components/room/MenuiserieForm.tsx`

*   **Chemin :** `src/components/room/MenuiserieForm.tsx`
*   **Rôle Précis :** Affiche un formulaire pour ajouter ou modifier une menuiserie spécifique à une pièce. Utilisé dans une modale (`Dialog`) ouverte depuis `MenuiseriesList.tsx`. Permet de sélectionner un type de menuiserie de référence et de personnaliser ses dimensions ou sa description.
*   **Imports Clés :**
    *   Composants UI (`DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter`, `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormMessage`, `Input`, `Button`, `Select`, `SelectTrigger`, `SelectContent`, `SelectItem`, `Textarea`)
    *   Hooks (`useForm` de `react-hook-form`, `useMenuiseriesTypes` pour obtenir la liste des types)
    *   Types (`MenuiserieItem`, `TypeMenuiserie`)
    *   Validation (Zod)
*   **Exports Clés :** `MenuiserieForm` (composant fonctionnel).
*   **Props :**
    *   `isOpen`: `boolean` (non optionnel) - Contrôle l'ouverture de la modale.
    *   `onClose`: `() => void` (non optionnel) - Fonction pour fermer la modale.
    *   `menuiserieToEdit`: `MenuiserieItem | null` (optionnel) - L'objet `MenuiserieItem` à modifier, ou `null` pour une nouvelle menuiserie.
    *   `onSubmit`: `(menuiserieData: MenuiserieItem) => void` (non optionnel) - Fonction appelée lors de la soumission du formulaire.
*   **États Locaux (`useState`) :** Géré par `react-hook-form`.
*   **Effets (`useEffect`) :**
    *   Charge la liste des `typesMenuiseries` depuis `useMenuiseriesTypes`.
    *   Met à jour les valeurs du formulaire avec `menuiserieToEdit` si en mode édition.
    *   Peut pré-remplir les champs de dimensions (`hauteur`, `largeur`) avec les valeurs par défaut du `TypeMenuiserie` sélectionné.
*   **Fonctions Internes / Gestionnaires d'Événements :**
    *   `handleTypeChange`: Met à jour les dimensions dans le formulaire lorsque le type de menuiserie change.
    *   `handleSubmit`: Gère la soumission via `react-hook-form`. Appelle la prop `onSubmit` avec les données validées.
*   **Structure JSX :**
    *   Rend un formulaire à l'intérieur d'un `DialogContent`.
    *   Contient un `Select` pour choisir le `TypeMenuiserie` (options venant de `useMenuiseriesTypes`).
    *   Contient des `Input` type number pour la `hauteur` et la `largeur`.
    *   Contient un `Textarea` pour la `description`.
    *   Affiche des boutons "Enregistrer" et "Annuler".
*   **Interactions :** Permet la sélection d'un type de menuiserie, la personnalisation des dimensions/description, et la soumission des données.
*   **Export :** `export const MenuiserieForm = (...) => { ... };`

##### `src/components/room/MenuiseriesList.tsx`

*   **Chemin :** `src/components/room/MenuiseriesList.tsx`
*   **Rôle Précis :** Affiche la liste des menuiseries ajoutées à une pièce spécifique. Permet d'ajouter, modifier ou supprimer ces menuiseries pour la pièce.
*   **Imports Clés :**
    *   Composants UI (`Card`, `CardHeader`, `CardTitle`, `CardContent`, `Table`, `TableBody`, `TableCell`, `TableRow`, `Button`, `Dialog`)
    *   Icônes (ex: `Plus`, `Edit`, `Trash`)
    *   Hooks (`useState`)
    *   Types (`MenuiserieItem`, `Room`, `TypeMenuiserie`)
    *   Composant `MenuiserieForm`
*   **Exports Clés :** `MenuiseriesList` (composant fonctionnel).
*   **Props :**
    *   `room`: `Room` (non optionnel) - La pièce dont on affiche/gère les menuiseries. Contient le tableau `room.menuiseries`.
    *   `onUpdateRoom`: `(roomId: string, updates: Partial<Room>) => void` (non optionnel) - Fonction de rappel pour mettre à jour l'objet `Room` dans l'état global du projet lorsque des modifications sont apportées aux menuiseries.
*   **États Locaux (`useState`) :**
    *   `isFormOpen: boolean`: Contrôle l'ouverture de la modale `MenuiserieForm`.
    *   `menuiserieToEdit: MenuiserieItem | null`: Stocke la menuiserie en cours d'édition.
*   **Effets (`useEffect`) :** Aucun effet majeur défini.
*   **Fonctions Internes / Gestionnaires d'Événements :**
    *   `handleAddClick`: Ouvre la modale `MenuiserieForm` en mode création.
    *   `handleEditClick`: Stocke la menuiserie à modifier et ouvre la modale.
    *   `handleDeleteClick`: Supprime l'élément `MenuiserieItem` du tableau `room.menuiseries` et appelle `onUpdateRoom` avec la pièce mise à jour.
    *   `handleFormSubmit`: Reçoit les données du formulaire `MenuiserieForm`. Met à jour ou ajoute l'élément dans `room.menuiseries`. Appelle `onUpdateRoom`. Ferme la modale.
*   **Structure JSX :**
    *   Rend un conteneur (ex: `Card`).
    *   Affiche un titre "Menuiseries".
    *   Affiche un bouton "Ajouter".
    *   Itère sur le tableau `room.menuiseries` et affiche chaque menuiserie (type, dimensions) dans une liste ou un tableau.
    *   Chaque ligne a des boutons "Modifier" et "Supprimer".
    *   Rend le `Dialog` contenant `MenuiserieForm`.
*   **Interactions :** Permet de lister, ajouter, modifier et supprimer les menuiseries spécifiques à une pièce. Communique les changements à la pièce parente via `onUpdateRoom`.
*   **Export :** `export const MenuiseriesList = (...) => { ... };`

##### `src/components/room/RoomCustomItems.tsx`

*   **Chemin :** `src/components/room/RoomCustomItems.tsx`
*   **Rôle Précis :** Ce composant semble agir comme un conteneur ou un orchestrateur pour les éléments personnalisés *à l'intérieur* d'une pièce, c'est-à-dire les menuiseries et les autres surfaces. Il regroupe probablement les composants `MenuiseriesList` et `AutresSurfacesList` pour une pièce donnée.
*   **Imports Clés :**
    *   Composants UI (ex: `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` ou simple `div` conteneur)
    *   Composants `MenuiseriesList`, `AutresSurfacesList`
    *   Types (`Room`)
*   **Exports Clés :** `RoomCustomItems` (composant fonctionnel).
*   **Props :**
    *   `room`: `Room` (non optionnel) - La pièce pour laquelle afficher les éléments personnalisés.
    *   `onUpdateRoom`: `(roomId: string, updates: Partial<Room>) => void` (non optionnel) - Fonction de rappel pour la mise à jour de la pièce.
*   **États Locaux (`useState`) :** Potentiellement pour gérer l'onglet actif si utilise des `Tabs`.
*   **Effets (`useEffect`) :** Aucun effet majeur.
*   **Fonctions Internes / Gestionnaires d'Événements :** Passe les props `room` et `onUpdateRoom` aux composants enfants `MenuiseriesList` et `AutresSurfacesList`.
*   **Structure JSX :**
    *   Rend un conteneur.
    *   Peut utiliser des `Tabs` pour séparer "Menuiseries" et "Autres Surfaces".
    *   Rend `<MenuiseriesList room={room} onUpdateRoom={onUpdateRoom} />`.
    *   Rend `<AutresSurfacesList room={room} onUpdateRoom={onUpdateRoom} />`.
*   **Interactions :** Organise l'affichage et la gestion des menuiseries et autres surfaces pour une pièce.
*   **Export :** `export const RoomCustomItems = (...) => { ... };`

##### `src/components/room/RoomForm.tsx`

*   **Chemin :** `src/components/room/RoomForm.tsx`
*   **Rôle Précis :** Affiche le formulaire complet pour créer ou modifier une pièce (`Room`) dans le projet. Il inclut les champs pour les informations de base de la pièce (nom, dimensions) ainsi que les sections pour gérer les éléments personnalisés (menuiseries, autres surfaces) via le composant `RoomCustomItems`. Utilisé dans une modale (`Dialog`) sur la page "Infos Chantier" (`RoomsCard.tsx`).
*   **Imports Clés :**
    *   Composants UI (`DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter`, `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormMessage`, `Input`, `Button`)
    *   Composant `RoomCustomItems`
    *   Hooks (`useForm` de `react-hook-form`, `useState`)
    *   Types (`Room`)
    *   Validation (Zod)
*   **Exports Clés :** `RoomForm` (composant fonctionnel).
*   **Props :**
    *   `isOpen`: `boolean` (non optionnel) - Contrôle l'ouverture de la modale.
    *   `onClose`: `() => void` (non optionnel) - Fonction pour fermer la modale.
    *   `roomToEdit`: `Room | null` (optionnel) - L'objet `Room` à modifier, ou `null` pour une nouvelle pièce.
    *   `onSubmit`: `(roomData: Room) => void` (non optionnel) - Fonction appelée lors de la soumission du formulaire avec les données complètes de la pièce (incluant menuiseries/autres surfaces mises à jour).
*   **États Locaux (`useState`) :** L'état du formulaire est géré par `react-hook-form`.
*   **Effets (`useEffect`) :**
    *   Initialise/réinitialise le formulaire avec les données de `roomToEdit` lorsque la modale s'ouvre ou que `roomToEdit` change.
*   **Fonctions Internes / Gestionnaires d'Événements :**
    *   `handleUpdateRoomInternals`: Fonction appelée par `RoomCustomItems` (ou ses enfants) lorsque les menuiseries ou autres surfaces sont modifiées. Met à jour l'état interne du formulaire (`react-hook-form`) pour refléter ces changements avant la soumission finale.
    *   `handleSubmit`: Gère la soumission via `react-hook-form`. Récupère toutes les données de la pièce (nom, dimensions, et les tableaux `menuiseries`/`autresSurfaces` mis à jour) et appelle la prop `onSubmit` avec l'objet `Room` complet.
*   **Structure JSX :**
    *   Rend un formulaire (`Form`) dans un `DialogContent`.
    *   Affiche des champs (`Input` type text/number via `FormField`) pour le nom, la longueur, la largeur, la hauteur de la pièce.
    *   Inclut le composant `<RoomCustomItems room={formValues.room} onUpdateRoom={handleUpdateRoomInternals} />` pour gérer les menuiseries et autres surfaces. Les `formValues` sont ceux gérés par `react-hook-form`.
    *   Affiche des boutons "Enregistrer" et "Annuler".
*   **Interactions :** Permet la saisie/modification des informations de base d'une pièce et de ses éléments personnalisés. Soumet l'objet `Room` complet mis à jour.
*   **Export :** `export const RoomForm = (...) => { ... };`

##### `src/components/room/RoomsList.tsx`

*   **Chemin :** `src/components/room/RoomsList.tsx`
*   **Rôle Précis :** Affiche une liste simple des pièces du projet, souvent avec des boutons pour modifier ou supprimer chaque pièce. Utilisé dans `RoomsCard.tsx`.
*   **Imports Clés :**
    *   Composants UI (`Table`, `TableBody`, `TableCell`, `TableRow`, `Button`)
    *   Icônes (ex: `Edit`, `Trash`)
    *   Types (`Room`)
*   **Exports Clés :** `RoomsList` (composant fonctionnel).
*   **Props :**
    *   `rooms`: `Room[]` (non optionnel) - Le tableau des pièces à afficher.
    *   `onEditRoom`: `(room: Room) => void` (non optionnel) - Fonction appelée au clic sur le bouton "Modifier" d'une pièce.
    *   `onDeleteRoom`: `(roomId: string) => void` (non optionnel) - Fonction appelée au clic sur le bouton "Supprimer" d'une pièce.
*   **États Locaux (`useState`) :** Aucun état local.
*   **Effets (`useEffect`) :** Aucun effet défini.
*   **Fonctions Internes / Gestionnaires d'Événements :**
    *   Gestionnaires `onClick` pour les boutons "Modifier" et "Supprimer" qui appellent les props correspondantes (`onEditRoom`, `onDeleteRoom`) en passant la `room` ou son `roomId`.
*   **Structure JSX :**
    *   Rend une structure de liste ou un tableau (`Table`).
    *   Itère sur le tableau `rooms`. Pour chaque `room`, affiche une ligne (`TableRow`) avec son nom, sa surface et les boutons d'action "Modifier" et "Supprimer".
*   **Interactions :** Affiche la liste des pièces et permet de déclencher les actions de modification et suppression via les props.
*   **Export :** `export const RoomsList = (...) => { ... };`

### 7. Dossier `src/pages/`

Ce dossier contient les composants principaux de l'application qui correspondent aux différentes routes (pages). Chaque fichier `.tsx` dans ce dossier représente généralement une page accessible via la navigation.

#### `src/pages/AdminTravaux.tsx`

*   **Chemin :** `src/pages/AdminTravaux.tsx`
*   **Route Associée :** `/admin/travaux` (basé sur l'analyse typique du routage dans `App.tsx`)
*   **Rôle Précis :** Cette page permet aux administrateurs de gérer les types de travaux (ex: "Peinture", "Maçonnerie") et les prestations associées (sous-types de travaux, ex: "Peinture murale", "Pose de carrelage"). Elle offre des fonctionnalités d'ajout, de modification et de suppression pour ces éléments.
*   **Composants UI Utilisés :**
    *   `Layout` (pour la structure de la page avec titre et sous-titre)
    *   `Button` (actions d'ajout, modification, suppression, annulation, confirmation)
    *   Icônes (`Plus`, `PlusCircle`, `Edit`, `Trash`, `Undo`, `Clipboard`, `Archive` - depuis `lucide-react`)
    *   `Card`, `CardContent`, `CardHeader`, `CardTitle`, `CardDescription`, `CardFooter` (pour structurer l'affichage des types de travaux et des messages d'absence)
    *   `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter` (pour les modales de confirmation de suppression)
    *   `Table`, `TableBody`, `TableCell`, `TableHead`, `TableHeader`, `TableRow` (pour afficher la liste des sous-types de travaux)
    *   `Label` (pour les formulaires dans les modales - utilisés dans les composants enfants `TypeTravauxForm` et `SousTypeTravauxForm`)
    *   `Input` (pour les champs de formulaire dans les modales - utilisés dans les composants enfants)
    *   `toast` (hook/fonction pour afficher les notifications)
    *   `TypeTravauxForm` (composant personnalisé pour le formulaire d'ajout/modification d'un type de travail)
    *   `SousTypeTravauxForm` (composant personnalisé pour le formulaire d'ajout/modification d'une prestation)
    *   `DropdownMenu`, `DropdownMenuTrigger`, `DropdownMenuContent`, `DropdownMenuItem` (potentiellement pour des actions contextuelles, bien que l'extrait montre des boutons directs)
*   **Hooks Utilisés :**
    *   `useState` : Pour gérer l'état d'ouverture des modales et les données des éléments en cours d'édition ou de suppression.
    *   `useTravauxTypes` : Hook personnalisé (probablement basé sur un Contexte React et potentiellement TanStack Query pour interagir avec Supabase). Fournit :
        *   `state`: L'état actuel des types de travaux et de leurs sous-types. Contient un tableau `types`.
        *   `dispatch`: La fonction pour dispatcher des actions au reducer du contexte `useTravauxTypes` afin de modifier l'état (ADD_TYPE, UPDATE_TYPE, DELETE_TYPE, ADD_SOUS_TYPE, UPDATE_SOUS_TYPE, DELETE_SOUS_TYPE).
    *   `use-toast` : Hook/fonction pour déclencher l'affichage de toasts (notifications).
*   **Flux de Données Principal :**
    *   Au chargement de la page, le hook `useTravauxTypes` est appelé pour accéder à l'état global des types de travaux. Ces données sont probablement chargées depuis une source externe (Supabase) lors de l'initialisation du contexte ou du hook.
    *   La page affiche la liste des types de travaux (`types` depuis le state du contexte). Pour chaque type, elle liste ses sous-types.
    *   **Ajout Type :** Clic sur "Ajouter un type" -> ouvre la modale `TypeTravauxForm` en mode ajout (editingType = null). Soumission du formulaire dans `TypeTravauxForm` déclenche `handleTypeSubmit` qui dispatche l'action `ADD_TYPE` au contexte.
    *   **Modification Type :** Clic sur "Modifier" pour un type spécifique -> ouvre la modale `TypeTravauxForm` en mode édition (editingType = type cliqué). Soumission déclenche `handleTypeSubmit` qui dispatche l'action `UPDATE_TYPE`.
    *   **Suppression Type :** Clic sur "Supprimer" pour un type spécifique -> ouvre une modale de confirmation (`deleteConfirmOpen`). Clic sur "Supprimer" dans la modale déclenche `confirmDeleteType` qui dispatche l'action `DELETE_TYPE`.
    *   **Ajout Prestation :** Clic sur "Ajouter une prestation" pour un type spécifique -> ouvre la modale `SousTypeTravauxForm` en mode ajout (editingSousType = null) et enregistre l'id du type parent (`parentTypeId`). Soumission déclenche `handleSousTypeSubmit` qui dispatche l'action `ADD_SOUS_TYPE` avec l'id du parent.
    *   **Modification Prestation :** Clic sur "Modifier" pour une prestation spécifique -> ouvre la modale `SousTypeTravauxForm` en mode édition (editingSousType = sousType cliqué) et enregistre l'id du type parent. Soumission déclenche `handleSousTypeSubmit` qui dispatche l'action `UPDATE_SOUS_TYPE`.
    *   **Suppression Prestation :** Clic sur "Supprimer" pour une prestation spécifique -> ouvre une modale de confirmation (`deletingSousTypeConfirmOpen`) et enregistre les ids parent et de la prestation. Clic sur "Supprimer" déclenche `confirmDeleteSousType` qui dispatche l'action `DELETE_SOUS_TYPE`.
    *   Les actions dispatchées dans le contexte `useTravauxTypes` mettent à jour l'état global, ce qui entraîne un re-rendu de la page avec les données actualisées. Des toasts sont affichés pour confirmer les actions réussies.
*   **États Locaux (`useState`) :**
    *   `typeFormOpen: boolean`: Contrôle l'ouverture de la modale pour le formulaire TypeTravaux.
    *   `sousTypeFormOpen: boolean`: Contrôle l'ouverture de la modale pour le formulaire SousTypeTravaux.
    *   `editingType: TravauxType | null`: Stocke les données du type de travail en cours d'édition, ou null si en mode ajout.
    *   `editingSousType: SousTypeTravauxItem | null`: Stocke les données de la prestation en cours d'édition, ou null si en mode ajout.
    *   `parentTypeId: string | null`: Stocke l'ID du type de travail parent lors de l'ajout ou de la modification d'une prestation.
    *   `deleteConfirmOpen: boolean`: Contrôle l'ouverture de la modale de confirmation pour la suppression d'un type de travail.
    *   `deletingSousTypeConfirmOpen: boolean`: Contrôle l'ouverture de la modale de confirmation pour la suppression d'une prestation.
    *   `itemToDelete: string | null`: Stocke l'ID de l'élément (type ou sous-type) en attente de suppression après confirmation.
*   **Effets (`useEffect`) :** Aucun effet `useEffect` n'est défini directement dans ce composant de page. La logique de chargement initial et de synchronisation est gérée par le hook `useTravauxTypes`.
*   **Export :** `export default AdminTravaux;`

---

#### `src/pages/EditionDevis.tsx`

*   **Chemin :** `src/pages/EditionDevis.tsx`
*   **Route Associée :** `/edition-devis` (basé sur l'analyse typique du routage dans `App.tsx`)
*   **Rôle Précis :** Cette page permet à l'utilisateur de configurer l'apparence et le contenu du devis final avant sa génération en PDF. Elle propose des options pour sélectionner les éléments à inclure dans le devis et ajuster les paramètres visuels du PDF.
*   **Composants UI Utilisés :**
    *   `Layout` (pour la structure de la page avec titre et sous-titre)
    *   `PrintableFieldsForm` (composant personnalisé pour configurer les champs à imprimer)
    *   `PdfSettingsForm` (composant personnalisé pour ajuster les paramètres PDF comme les couleurs, marges, polices, etc.)
    *   `Button` (bouton pour déclencher la génération du PDF)
    *   Icône (`FileText` - depuis `lucide-react`)
    *   `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` (pour organiser les options de configuration en onglets)
*   **Hooks Utilisés :**
    *   `useState` : Pour gérer l'onglet actif (`activeTab`) dans l'interface.
    *   `useProject` : Hook personnalisé (basé sur un Contexte React) pour accéder à l'état global du projet. Fournit :
        *   `state`: L'état actuel du projet, contenant notamment `metadata`.
    *   `useDevisGeneration` : Hook personnalisé (ancienne implémentation de génération PDF, potentiellement obsolète). Fournit :
        *   `isGenerating`: Booléen indiquant si l'ancienne génération est en cours. (Note : basé sur les imports et l'utilisation dans le JSX, ce hook pourrait être partiellement ou totalement remplacé par `useReactPdfGeneration`).
    *   `useReactPdfGeneration` : Hook personnalisé (implémentation actuelle pour @react-pdf/renderer). Fournit :
        *   `isGenerating`: Booléen indiquant si la génération React-PDF est en cours.
        *   `generateReactPdf`: Fonction à appeler pour lancer le processus de génération du PDF via @react-pdf/renderer.
*   **Flux de Données Principal :**
    *   Au chargement de la page, elle accède aux `metadata` du projet via `useProject` pour afficher le titre de la page.
    *   Elle initialise un état local `activeTab` pour contrôler l'onglet affiché par les composants `Tabs`.
    *   Elle utilise les hooks `useDevisGeneration` et `useReactPdfGeneration` pour obtenir l'état de génération PDF et la fonction pour déclencher la génération React-PDF.
    *   L'utilisateur interagit avec les formulaires `PrintableFieldsForm` et `PdfSettingsForm` (dont la logique interne est gérée par ces composants et potentiellement des contextes/hooks associés) pour modifier les paramètres du devis et du PDF.
    *   Le bouton "Générer Devis React-PDF" appelle la fonction `generateReactPdf` du hook `useReactPdfGeneration` lorsque l'utilisateur clique dessus. Le bouton est désactivé pendant la génération (`isGeneratingReactPdf`).
    *   La page est enveloppée dans `QueryClientProvider`, suggérant que des hooks TanStack Query peuvent être utilisés par les composants enfants (`PrintableFieldsForm`, `PdfSettingsForm`, ou les hooks de génération PDF) pour fetcher ou muter des données (probablement les paramètres PDF stockés).
*   **États Locaux (`useState`) :**
    *   `activeTab: string`: Gère quel onglet ("printable" ou "settings") est actuellement visible dans l'interface à onglets. Initialisé à "printable".
*   **Effets (`useEffect`) :** Aucun effet `useEffect` n'est défini directement dans ce composant de page. La logique des effets liés à la génération PDF ou au chargement/sauvegarde des paramètres est gérée par les hooks personnalisés et les composants enfants.
*   **Export :** `export default EditionDevis;`

---

#### `src/pages/Index.tsx`

*   **Chemin :** `src/pages/Index.tsx`
*   **Route Associée :** `/` (la route principale, basée sur l'analyse typique du routage dans `App.tsx`)
*   **Rôle Précis :** Cette page sert de point d'entrée principal à l'application. Elle affiche un titre et un sous-titre génériques et inclut le composant `RenovationEstimator`, qui est probablement le conteneur principal de l'application ou une structure de layout pour les différentes étapes de l'estimation de rénovation.
*   **Composants UI Utilisés :**
    *   `Layout` (pour la structure de base de la page : en-tête, navigation, zone de contenu)
    *   `RenovationEstimator` (composant personnalisé, potentiellement un conteneur pour les différentes étapes ou pages de l'estimation, bien que le routage principal soit dans `App.tsx`. Comme noté précédemment, ce composant pourrait être une ébauche ou non utilisé dans le flux actuel de `App.tsx`).
*   **Hooks Utilisés :** Aucun hook (standard ou personnalisé) n'est utilisé directement dans ce composant de page.
*   **Flux de Données Principal :**
    *   Cette page est très simple. Elle rend le composant `Layout` avec des titres fixes ("Wizard Rénovation", "Estimez facilement vos projets de rénovation"), et inclut ensuite le composant `RenovationEstimator`.
    *   Il n'y a pas de logique de chargement de données, de gestion d'événements ou de manipulation d'état locale dans ce composant. Le flux de données et la logique sont délégués au composant enfant `RenovationEstimator` et aux contextes/hooks utilisés plus haut dans l'arbre de composants (dans `App.tsx` ou `Layout`).
*   **États Locaux (`useState`) :** Aucun état local défini.
*   **Effets (`useEffect`) :** Aucun effet défini.
*   **Export :** `export default Index;`

---

#### `src/pages/InfosChantier.tsx`

*   **Chemin :** `src/pages/InfosChantier.tsx`
*   **Route Associée :** Probablement `/chantier` ou une route dynamique comme `/projet/:projectId`. Cette page est la première étape du processus de création/édition d'un devis après avoir géré les informations générales du projet (nom, client, société, etc.), et **elle fournit également les données et les contrôles pour la section "Type de bien" et la liste des "Pièces"** aux composants qui afficheront les formulaires et listes correspondants.
*   **Rôle Précis :** Cette page sert de contrôleur et de fournisseur de données pour l'ensemble de la section "Informations Chantier". Elle est responsable d'obtenir l'état complet du projet (incluant les métadonnées, les informations sur le bien (`property`), et la liste des pièces (`rooms`)) via le hook `useProjectInfo` et de passer ces données, ainsi que les fonctions de mise à jour et les handlers d'opération, à son composant de layout et de formulaire principal (`InfosChantierLayout`). Elle gère également un état local pour l'ID de la société.
*   **Composants UI Utilisés :**
    *   `QueryClientProvider` (Fournit le contexte pour TanStack Query si utilisé par les hooks ou services sous-jacents).
    *   `InfosChantierLayout` (Composant personnalisé principal de la page. **Note :** C'est ce composant qui contient probablement l'interface utilisateur pour la saisie du "Type de bien" et la gestion de la liste des "Pièces" en utilisant les props qu'il reçoit. L'analyse de son code source (`src/features/chantier/components/InfosChantierLayout.tsx`) est nécessaire pour connaître les composants spécifiques qu'il utilise en interne, tels que `ProjectForm`, `PropertyForm`, `RoomsCard`, `ClientDetails`, `CompanyDetails`, etc.)
    *   Texte simple "Chargement..." (Affiché conditionnellement pendant le chargement des données du projet).
*   **Hooks Utilisés :**
    *   `useState` : Standard hook de React pour gérer l'état local.
        *   Utilisé pour `companyId` (`[companyId, setCompanyId]`). Initialisé avec une valeur par défaut. Stocke l'ID de la société sélectionnée ou associée au projet.
    *   `useProjectInfo` : Hook personnalisé (décrit dans la Section V.2). C'est le hook principal utilisé par cette page pour obtenir toutes les données et fonctions nécessaires à la gestion des informations du chantier. La page déstructure les éléments suivants de ce hook :
        *   `projectState`: L'état complet du projet (incluant `metadata`, `property`, `rooms`, `travaux`). **C'est via cet objet que la page accède (indirectement) aux informations sur le type de bien et la liste des pièces pour les passer à ses enfants.**
        *   `isLoading`: Booléen indiquant si les données nécessaires pour la page (chargement du projet, etc.) sont en cours.
        *   `projects`: Liste des projets disponibles.
        *   `currentProjectId`: ID du projet actuellement chargé.
        *   `hasUnsavedChanges`: Indicateur de modifications non sauvegardées.
        *   `clientId`, `setClientId`: État et setter pour l'ID du client.
        *   `nomProjet`, `setNomProjet`: État et setter pour le nom du projet.
        *   `descriptionProjet`, `setDescriptionProjet`: État et setter pour la description du projet.
        *   `adresseChantier`, `setAdresseChantier`: État et setter pour l'adresse du chantier.
        *   `occupant`, `setOccupant`: État et setter pour l'occupant.
        *   `infoComplementaire`, `setInfoComplementaire`: État et setter pour les infos complémentaires.
        *   `dateDevis`, `setDateDevis`: État et setter pour la date du devis.
        *   `devisNumber`, `setDevisNumber`: État et setter pour le numéro de devis.
        *   `clientsData`, `setClientsData`: Données clients et leur setter.
        *   `generateProjectName`, `generateProjectNameIfNeeded`, `shouldGenerateProjectName`: Fonctions et indicateur pour la génération du nom du projet.
        *   `handleChargerProjet`: Fonction pour charger un autre projet.
        *   `handleDeleteProject`: Fonction pour supprimer le projet.
        *   `handleSaveProject`: Fonction pour sauvegarder le projet.
*   **Flux de Données Principal :**
    *   Au montage du composant, il initialise l'état local `companyId`.
    *   Il appelle le hook `useProjectInfo`. Ce hook est responsable du chargement initial des données du projet (probablement en lisant l'état global du `ProjectContext` ou en chargeant un projet spécifique si un ID est pertinent). Le hook `useProjectInfo` consolide les données et les fonctions de gestion provenant potentiellement de plusieurs sources (ProjectContext, AppStateContext, services, autres hooks).
    *   Pendant que `useProjectInfo` indique un chargement (`isLoading` est `true`), la page affiche un message de chargement simple.
    *   Une fois `isLoading` est `false`, la page rend le composant `InfosChantierLayout`. Elle passe à ce composant *toutes* les données et fonctions obtenues de `useProjectInfo` (y compris le `projectState` complet qui contient `property` et `rooms`, ainsi que les setters individuels pour les champs de métadonnées) et l'état local `companyId` et son setter.
    *   Les composants enfants au sein de `InfosChantierLayout` (probablement des formulaires et listes spécifiques pour le type de bien, les pièces, les clients, la société, etc.) reçoivent les portions de données pertinentes (`projectState.property`, `projectState.rooms`, `nomProjet`, `clientId`, etc.) et les fonctions de mise à jour/handlers passées en props.
    *   Lorsque l'utilisateur interagit avec ces formulaires/listes enfants (saisie dans un champ, clic sur "Ajouter pièce", "Supprimer pièce"), les composants enfants appellent les fonctions (setters individuels comme `setNomProjet`, ou handlers comme `handleSaveProject`, ou des fonctions pour gérer les pièces qui proviennent indirectement de `useProjectInfo` via `useProject` et `useRooms`) qui ont été passées en props.
    *   Ces appels déclenchent les logiques de mise à jour de l'état gérées par `useProjectInfo` (ou les hooks/contextes sous-jacents comme `useProject`, `useRooms`), ce qui met à jour l'état global du projet ou déclenche des opérations de sauvegarde/chargement.
    *   Les modifications de l'état global se propagent via les contextes/hooks et entraînent le re-rendu de la page et de ses composants enfants, reflétant les données actualisées.
*   **États Locaux (`useState`) directement dans `InfosChantier.tsx` :**
    *   `companyId: string`: Initialisé à `"c949dd6d-52e8-41c4-99f8-6e84bf4695b9"`. Gère l'identifiant de la société sélectionnée ou associée au projet.
*   **Effets (`useEffect`) directement dans `InfosChantier.tsx` :** Aucun effet `useEffect` n'est défini directement dans ce composant de page. La logique des effets (chargement initial, synchronisation, etc.) est gérée par le hook `useProjectInfo`.
*   **Export :** `export default InfosChantier;`

---

#### `src/pages/NotFound.tsx`

*   **Chemin :** `src/pages/NotFound.tsx`
*   **Route Associée :** `*` (la route fourre-tout dans `App.tsx`, qui correspond à toute URL qui ne correspond à aucune autre route définie).
*   **Rôle Précis :** Cette page s'affiche lorsque l'utilisateur tente d'accéder à une URL qui ne correspond à aucune route valide définie dans l'application. Elle informe l'utilisateur que la page demandée n'a pas été trouvée et lui propose un lien pour retourner à la page d'accueil.
*   **Composants UI Utilisés :**
    *   `Layout` (pour fournir la structure de base de la page avec un titre et un sous-titre)
    *   `Button` (utilisé comme conteneur stylisé pour le lien de retour à l'accueil, via la prop `asChild`)
    *   `Link` (depuis `react-router-dom`, utilisé comme composant enfant de `Button` grâce à `asChild` pour gérer la navigation côté client vers la page d'accueil)
    *   Icône (`Home` - depuis `lucide-react`)
*   **Hooks Utilisés :** Aucun hook (standard ou personnalisé) n'est utilisé dans ce composant de page.
*   **Flux de Données Principal :**
    *   Cette page est statique dans sa logique. Elle ne charge aucune donnée, ne gère aucun état complexe, et ne déclenche aucune action significative au-delà de la navigation initiée par l'utilisateur via le lien de retour à l'accueil.
    *   Elle affiche un message "404 Page non trouvée" et un texte explicatif.
    *   Un bouton stylisé avec un lien (`<Link to="/">`) permet à l'utilisateur de naviguer vers la racine de l'application (`/`).
*   **États Locaux (`useState`) :** Aucun état local défini.
*   **Effets (`useEffect`) :** Aucun effet défini.
*   **Export :** `export default NotFound;`

---

#### `src/pages/Parametres.tsx`

*   **Chemin :** `src/pages/Parametres.tsx`
*   **Route Associée :** `/parametres` (basé sur l'analyse typique du routage dans `App.tsx`).
*   **Rôle Précis :** Cette page centralise la gestion des données de référence et des paramètres globaux utilisés dans l'application. Elle permet aux utilisateurs (probablement des administrateurs ou configurateurs) de gérer les types de travaux, les types de menuiseries, les fiches clients et les fiches sociétés via une interface organisée par onglets. Pour chaque catégorie, elle permet les opérations de création, lecture, mise à jour et suppression (CRUD).
*   **Composants UI Utilisés :**
    *   `Layout` (structure globale de la page avec titre et sous-titre)
    *   `Card`, `CardContent`, `CardHeader`, `CardTitle`, `CardDescription` (pour encadrer les différentes listes d'éléments dans chaque onglet)
    *   `Button` (boutons d'action : Ajouter, Modifier, Supprimer, Annuler, Sauvegarder, Réinitialiser, Masquer)
    *   Icônes (nombreuses icônes importées de `lucide-react` : `Settings`, `Edit`, `Trash`, `Plus`, `Paintbrush`, `Hammer`, `Wrench`, `SquarePen`, `Home`, `Droplet`, `Power`, `Pipette`, `Cpu`, `CircuitBoard`, `Flame`, `Cable`, `Building`, `LinkIcon`, `DoorOpen`, `Users`, `User`, `Loader2`, `Database`, `Building2`, `Briefcase`. Utilisées pour la décoration, les indicateurs de chargement ou les actions.)
    *   `Dialog`, `DialogContent`, `DialogHeader`, `DialogTitle`, `DialogDescription`, `DialogFooter` (pour les modales de confirmation de suppression et pour encapsuler les formulaires locaux `ServiceGroupForm`, `WorkTypeForm`, `ServiceForm`)
    *   `Badge` (potentiellement utilisé pour afficher de petites étiquettes, bien que non visible dans le code JSX fourni, il est importé)
    *   `Alert`, `AlertDescription` (pour afficher des messages d'information ou d'absence de données)
    *   `Tabs`, `TabsContent`, `TabsList`, `TabsTrigger` (pour organiser l'interface en onglets : Travaux, Menuiseries, Clients, Sociétés)
    *   `Input`, `Label`, `Textarea` (composants de formulaire de base, utilisés dans les formulaires locaux et importés)
    *   `Table`, `TableHeader`, `TableBody`, `TableFooter`, `TableHead`, `TableRow`, `TableCell`, `TableCaption` (pour afficher les listes de données, notamment les services ou les types de menuiseries)
    *   `SupabaseStatus` (composant personnalisé affichant l'état de la connexion Supabase)
    *   `TypeMenuiserieForm` (Composant personnalisé importé, utilisé dans une modale pour gérer un type de menuiserie)
    *   `ClientForm` (Composant personnalisé importé, utilisé dans une modale pour gérer un client)
    *   `CompanyForm` (Composant personnalisé importé, utilisé dans une modale pour gérer une société)
    *   `ServiceGroupForm` (Composant fonctionnel défini *localement* dans ce fichier, utilisé dans une modale pour gérer un groupe de services)
    *   `WorkTypeForm` (Composant fonctionnel défini *localement* dans ce fichier, utilisé dans une modale pour gérer un type de travail)
    *   `ServiceForm` (Composant fonctionnel défini *localement* dans ce fichier, utilisé dans une modale pour gérer un service/prestation)
*   **Hooks Utilisés :**
    *   `useState` : Utilisé massivement pour gérer de nombreux états locaux (voir section États Locaux ci-dessous).
    *   `useEffect` : Utilisé pour déclencher le chargement des données (voir section Effets ci-dessous).
    *   `useMenuiseriesTypes` : Hook personnalisé (basé sur un Contexte). Utilisé pour accéder à l'état (`state: stateMenuiseriesTypes`) contenant `typesMenuiseries` (la liste des types de menuiseries gérée par le contexte) et à la fonction `dispatch: dispatchMenuiseriesTypes` pour envoyer des actions (spécifiquement utilisé pour l'action `RESET_TYPES`). Note : malgré l'utilisation du hook de contexte, la page maintient une copie locale de `menuiserieTypes` dans son état et gère le CRUD via des appels directs aux services (`menuiseriesService`). Le contexte semble principalement utilisé ici pour la réinitialisation.
    *   `useClients` : Hook personnalisé (basé sur un Contexte). Utilisé pour accéder à l'état (`state: stateClients`) contenant `clients` (la liste des clients gérée par le contexte) et à la fonction `dispatch: dispatchClients` pour envoyer des actions (`ADD_CLIENT`, `UPDATE_CLIENT`, `DELETE_CLIENT`, `RESET_CLIENTS`). La page utilise l'état du contexte directement pour afficher la liste des clients et dispatche les actions pour les modifications.
    *   `toast` : Fonction/hook pour afficher des notifications (succès, erreur) à l'utilisateur (depuis `sonner`).
*   **Flux de Données Principal :**
    *   Au premier rendu (`useEffect` sans dépendances), la liste initiale des types de travaux (`workTypes`) est chargée via `fetchWorkTypes` et stockée dans l'état local.
    *   L'interface est structurée par `Tabs`. L'état local `activeTab` contrôle quel contenu est visible.
    *   Lorsque l'onglet "Travaux" est actif :
        *   La liste des `workTypes` est affichée.
        *   Cliquer sur un type de travail met à jour l'état local `selectedWorkTypeId`, ce qui déclenche un `useEffect` pour charger les `serviceGroups` associés via `fetchServiceGroups`.
        *   La liste des `serviceGroups` du type sélectionné est affichée.
        *   Cliquer sur un groupe de services met à jour l'état local `selectedGroupId`, ce qui déclenche un `useEffect` pour charger les `services` associés via `fetchServices`.
        *   La liste des `services` du groupe sélectionné est affichée (souvent dans un tableau).
        *   Des boutons "Ajouter", "Modifier", "Supprimer" sont présents pour chaque niveau (type, groupe, service). Ils ouvrent des modales (`Dialog`) contenant les formulaires locaux (`WorkTypeForm`, `ServiceGroupForm`, `ServiceForm`) ou affichent des dialogues de confirmation.
        *   Les soumissions de formulaires ou les confirmations de suppression appellent des fonctions `handleSubmit...` ou `confirmDelete...`. Ces fonctions effectuent les appels asynchrones aux services (`travauxService`) pour les opérations CRUD sur la base de données (Supabase). En cas de succès, l'état local correspondant (`workTypes`, `serviceGroups`, `services`) est mis à jour (filtrage pour suppression, mappage pour mise à jour, ajout d'un nouvel élément) et un toast est affiché. L'état de chargement (`loading`, `isLoadingGroups`, `isLoadingServices`) est géré pendant ces opérations.
    *   Lorsque l'onglet "Menuiseries" est actif (`activeTab === "menuiseries"`), un `useEffect` dédié charge les `menuiserieTypes` via `fetchMenuiserieTypes` et les stocke dans l'état local.
        *   La liste des `menuiserieTypes` est affichée dans un tableau.
        *   Des boutons "Ajouter", "Modifier", "Supprimer" sont présents. Ils ouvrent la modale contenant le composant `TypeMenuiserieForm` ou un dialogue de confirmation.
        *   Les actions sur les types de menuiseries appellent des fonctions `handleSubmitTypeMenuiserie` ou `confirmTypeMenuiserieDelete` qui interagissent avec les services (`menuiseriesService`). L'état local `menuiserieTypes` est mis à jour après l'opération (avec potentiellement un re-fetch complet de la liste) et un toast est affiché. L'état de chargement (`isLoadingMenuiseries`) est géré.
        *   Un bouton "Réinitialiser aux valeurs par défaut" dispatche l'action `RESET_TYPES` au contexte `useMenuiseriesTypes`.
    *   Lorsque l'onglet "Clients" est actif (`activeTab === "clients"`), la page utilise directement l'état `clients` du contexte `useClients` (probablement chargé lors de l'initialisation du contexte dans `App.tsx`).
        *   La liste des `clients` est affichée.
        *   Des boutons "Ajouter", "Modifier", "Supprimer" sont présents. Ils ouvrent la modale contenant le composant `ClientForm` ou un dialogue de confirmation.
        *   Les actions sur les clients (`handleSubmitClient`, `confirmClientDelete`) dispatchent des actions (`ADD_CLIENT`, `UPDATE_CLIENT`, `DELETE_CLIENT`) directement au contexte `useClients`, qui gère la mise à jour de l'état et potentiellement l'interaction avec une source de données persistante. Un toast est affiché.
        *   Un bouton "Réinitialiser aux valeurs par défaut" dispatche l'action `RESET_CLIENTS` au contexte `useClients`.
    *   Lorsque l'onglet "Sociétés" est actif (`activeTab === "companies"`), un `useEffect` dédié charge les `companies` via `fetchCompanies` et les stocke dans l'état local.
        *   La liste des `companies` est affichée.
        *   Des boutons "Ajouter", "Modifier", "Supprimer" sont présents. Ils ouvrent la modale contenant le composant `CompanyForm` ou un dialogue de confirmation.
        *   Les actions sur les sociétés (`handleSubmitCompany`, `confirmCompanyDelete`) appellent des fonctions qui interagissent avec les services (`companiesService`) pour les opérations CRUD asynchrones. L'état local `companies` est mis à jour et un toast est affiché. L'état de chargement (`isLoadingCompanies`) est géré.
    *   La page affiche conditionnellement le composant `SupabaseStatus` pour un diagnostic de connexion.
*   **États Locaux (`useState`) :** (Nombreux états pour les onglets, chargements, sélections, modales)
    *   `activeTab`, `workTypes`, `serviceGroups`, `services`, `menuiserieTypes`, `companies`, `selectedWorkTypeId`, `selectedGroupId`, `selectedClientId`, `selectedCompanyId`, `loading`, `isLoadingGroups`, `isLoadingServices`, `isLoadingMenuiseries`, `isLoadingCompanies`, `workTypeFormOpen`, `editingWorkType`, `serviceGroupFormOpen`, `editingServiceGroup`, `serviceFormOpen`, `editingService`, `confirmDeleteWorkTypeOpen`, `workTypeToDelete`, `confirmDeleteGroupOpen`, `groupToDelete`, `confirmDeleteServiceOpen`, `serviceToDelete`, `typeMenuiserieFormOpen`, `editingTypeMenuiserie`, `confirmDeleteMenuiserieOpen`, `typeMenuiserieToDelete`, `clientFormOpen`, `editingClient`, `confirmDeleteClientOpen`, `clientToDelete`, `companyFormOpen`, `editingCompany`, `confirmDeleteCompanyOpen`, `companyToDelete`, `showDiagnostic`.
*   **Effets (`useEffect`) :**
    *   **Effet initial chargement types travaux :** Dépendances : `[]`. Charge `workTypes`.
    *   **Effet chargement groupes services :** Dépendances : `[selectedWorkTypeId]`. Charge `serviceGroups`.
    *   **Effet chargement services :** Dépendances : `[selectedGroupId]`. Charge `services`.
    *   **Effet chargement types menuiseries :** Dépendances : `[activeTab]`. Charge `menuiserieTypes` si onglet actif.
    *   **Effet chargement sociétés :** Dépendances : `[activeTab]`. Charge `companies` si onglet actif.
*   **Export :** `export default Parametres;`

---

#### `src/pages/Recapitulatif.tsx`

*   **Chemin :** `src/pages/Recapitulatif.tsx`
*   **Route Associée :** `/recapitulatif` (basé sur l'analyse typique du routage dans `App.tsx`)
*   **Rôle Précis :** Affiche un récapitulatif complet du devis, incluant les informations du bien immobilier, les totaux globaux, et un tableau détaillé des travaux par pièce. Cette page sert de vue d'ensemble avant la génération du PDF.
*   **Composants UI Utilisés :**
    *   `Layout` (pour la structure de la page avec titre et sous-titre)
    *   `Button` (pour la navigation vers les étapes précédente/suivante)
    *   Icônes (`ArrowLeft`, `ArrowRight` - depuis `lucide-react`)
    *   `Link` (depuis `react-router-dom` pour les liens de navigation dans les boutons)
    *   `TravauxRecapContent` (composant principal contenant l'affichage du récapitulatif, importé depuis `src/features/recap/components/TravauxRecapContent.tsx`)
*   **Hooks Utilisés :**
    *   `useProject` : Hook personnalisé pour accéder à l'état global du projet (`state`).
*   **Flux de Données Principal :**
    *   Au montage, la page récupère l'intégralité de l'état du projet (`projectState`) via le hook `useProject`.
    *   Elle passe cet état `projectState` au composant `TravauxRecapContent`.
    *   Le composant `TravauxRecapContent` est responsable d'extraire les données nécessaires (infos propriété, travaux) et d'afficher les composants de résumé (`PropertyInfoCard`, `GlobalTotals`, `RecapitulatifTravaux`).
    *   La page affiche des boutons de navigation ("Précédent", "Suivant") qui utilisent `Link` pour rediriger vers d'autres pages (ex: `/travaux`, `/edition-devis`).
*   **États Locaux (`useState`) :** Aucun état local défini.
*   **Effets (`useEffect`) :** Aucun effet défini.
*   **Export :** `export default Recapitulatif;`

---

#### `src/pages/Travaux.tsx`

*   **Chemin :** `src/pages/Travaux.tsx`
*   **Route Associée :** `/travaux` (basé sur l'analyse typique du routage dans `App.tsx` et le flux de navigation entre les pages).
*   **Rôle Précis :** Cette page permet de visualiser et de gérer les travaux spécifiques à chaque pièce (ou "room") du projet. L'utilisateur sélectionne une pièce et peut ensuite ajouter de nouveaux travaux pour cette pièce ou visualiser/supprimer/modifier les travaux existants.
*   **Composants UI Utilisés :**
    *   `Layout` (pour la structure de la page avec titre et sous-titre)
    *   `Button` (boutons d'action comme "Ajouter un travail", boutons de sélection de pièce, boutons de navigation, boutons d'édition/suppression)
    *   Icônes (`ChevronRight`, `PlusCircle`, `ArrowLeft`, `ArrowRight`, `Paintbrush`, `Square` - depuis `lucide-react`)
    *   `Link` (depuis `react-router-dom` pour les liens de navigation enveloppés dans des boutons `asChild`)
    *   `Sheet`, `SheetContent`, `SheetHeader`, `SheetTitle` (pour créer un panneau latéral coulissant utilisé pour le formulaire d'ajout/modification de travail)
    *   `Card`, `CardContent`, `CardDescription`, `CardHeader`, `CardTitle` (pour structurer les sections "Pièces" et "Travaux")
    *   `PieceSelect` (Composant personnalisé défini localement dans ce fichier, responsable d'afficher la liste des pièces sous forme de boutons sélectionnables)
    *   `TravailForm` (Composant personnalisé, affiché dans le `Sheet`, pour la saisie des détails d'un travail - type, quantité, prix, description, etc.)
    *   `TravailCard` (Composant personnalisé, affiché dans la liste des travaux, pour présenter les informations d'un travail individuel avec des boutons d'action)
*   **Hooks Utilisés :**
    *   `useState` : Hook standard de React pour gérer l'état local.
        *   Utilisé pour `selectedRoom` (ID de la pièce sélectionnée).
        *   Utilisé pour `isDrawerOpen` (visibilité du panneau `Sheet`).
        *   Utilisé pour `travailAModifier` (données du travail en cours de modification dans le formulaire).
    *   `useEffect` : Hook standard de React pour gérer les effets de bord.
        *   Utilisé pour synchroniser la sélection de pièce avec la liste des pièces disponibles.
    *   `useProject` : Hook personnalisé pour accéder à l'état global du projet (documenté dans la Section V.2). La page utilise `state.rooms` pour obtenir la liste des pièces disponibles.
    *   `useTravaux` : Hook personnalisé spécifique à la gestion des travaux (probablement défini dans `src/features/travaux/hooks/useTravaux.ts`). La page utilise les fonctions suivantes fournies par ce hook :
        *   `getTravauxForPiece(pieceId: string)` : Récupère la liste des travaux associés à une pièce spécifique.
        *   `addTravail(travail: Travail)` : Ajoute un nouveau travail au projet.
        *   `deleteTravail(travailId: string)` : Supprime un travail du projet.
        *   `updateTravail(travailId: string, updates: Partial<Travail>)` : Met à jour un travail existant.
    *   `toast` : Fonction/hook pour afficher des notifications (messages d'erreur, succès, info) à l'utilisateur (depuis la librairie `sonner`).
*   **Flux de Données Principal :**
    *   Au montage, la page accède à la liste des pièces (`rooms`) depuis l'état global du projet via `useProject`.
    *   Un effet `useEffect` initialise `selectedRoom` à l'ID de la première pièce si aucune pièce n'est sélectionnée au départ et s'il y a des pièces disponibles. Il assure également que si la pièce sélectionnée est supprimée, la sélection revient à la première pièce disponible ou à null.
    *   La liste des pièces (`rooms`) et l'ID de la pièce sélectionnée (`selectedRoom`) sont passés au composant `PieceSelect` pour l'affichage. Lorsque l'utilisateur clique sur un bouton de pièce, `PieceSelect` appelle la prop `onSelect` avec l'ID de la pièce, ce qui met à jour l'état local `selectedRoom`.
    *   Les travaux à afficher sont obtenus en appelant `getTravauxForPiece` avec l'ID de la pièce sélectionnée. Le résultat (`travauxForSelectedRoom`) est une liste de travaux filtrée pour la pièce courante.
    *   Cette liste (`travauxForSelectedRoom`) est mappée pour rendre un composant `TravailCard` pour chaque travail, affichant ses détails et fournissant des boutons pour éditer (`onEdit`) ou supprimer (`onDelete`).
    *   Le bouton "Ajouter un travail" appelle `handleAddTravail`, qui ouvre le panneau latéral (`Sheet`) en réglant `isDrawerOpen` à `true` et `travailAModifier` à `null`.
    *   Le clic sur "Modifier" dans une `TravailCard` appelle `handleEditTravail` avec le travail concerné, ouvrant le `Sheet` avec `travailAModifier` défini.
    *   Le `TravailForm` dans le `Sheet` reçoit les informations de la pièce sélectionnée (`selectedRoomInfo`) et le travail à modifier (`travailAModifier`). Il gère la logique du formulaire.
    *   Lorsque le formulaire est soumis, `TravailForm` appelle la prop `onAddTravail` (qui correspond à `handleSubmitTravail` dans la page).
    *   `handleSubmitTravail` ajoute le travail (en appelant `addTravail` de `useTravaux` et en attachant l'ID de la pièce sélectionnée) si c'est un nouvel ajout (`!travailAModifier`). Si `travailAModifier` existe, il appelle `updateTravail` de `useTravaux` avec l'ID et les données modifiées.
    *   `handleSubmitTravail` ferme le panneau latéral et affiche un toast de succès.
    *   Le clic sur "Supprimer" dans une `TravailCard` appelle `handleDeleteTravail`, qui appelle `deleteTravail` du hook `useTravaux` avec l'ID du travail et affiche un toast de succès.
    *   Les mises à jour d'état dans le hook `useTravaux` (via des actions dispatchées au contexte Project ou autre mécanisme) entraînent le re-rendu des `TravailCard` pour la pièce sélectionnée.
*   **États Locaux (`useState`) :**
    *   `selectedRoom: string | null`: Initialisé à `null`. Contient l'ID de la pièce actuellement sélectionnée par l'utilisateur dans la liste des pièces. Utilisé pour filtrer et afficher les travaux pertinents et associer les nouveaux travaux à la bonne pièce.
    *   `isDrawerOpen: boolean`: Initialisé à `false`. Contrôle si le panneau latéral (`Sheet`) contenant le formulaire de travail est ouvert ou fermé.
    *   `travailAModifier: Travail | null`: Initialisé à `null`. Contient l'objet `Travail` si l'utilisateur est en train de modifier un travail existant, ou `null` si l'utilisateur est en train d'ajouter un nouveau travail. Passé comme prop au `TravailForm`.
*   **Effets (`useEffect`) :**
    *   **Effet de synchronisation de pièce sélectionnée :** Dépend de `rooms` (la liste des pièces du projet) et `selectedRoom` (l'ID actuellement sélectionné).
        *   Objectif 1 : Sélectionner la première pièce par défaut si aucune n'est sélectionnée et que la liste des pièces n'est pas vide.
        *   Objectif 2 : Si une pièce est sélectionnée mais n'existe plus dans la liste `rooms` (car elle a été supprimée), réinitialiser la sélection à la première pièce disponible ou à `null` si la liste est vide.
        *   Logique : Vérifie les conditions mentionnées et appelle `setSelectedRoom` si nécessaire.
*   **Export :** `export default Travaux;`

### 8. Dossier `src/contexts/`

Ce dossier contient les définitions des Contextes React, de leurs Reducers et de leurs Providers, ainsi que les hooks personnalisés pour consommer ces contextes. Ils sont utilisés pour la gestion de l'état global partagé entre différents composants de l'application.

#### `src/contexts/AutresSurfacesContext.tsx`

*   **Chemin :** `src/contexts/AutresSurfacesContext.tsx`
*   **Rôle Précis :** Gère l'état global des "Autres Surfaces" de référence (comme les dalles, chapes, murs non porteurs, etc.) qui peuvent être ajoutées à un projet. Ce contexte fournit la liste de référence de ces types de surfaces.
*   **Imports Clés :**
    *   `createContext`, `useContext`, `useReducer`, `ReactNode`, `useEffect` (depuis `react`)
    *   Types (ex: `AutreSurface`, `AutresSurfacesState`, `AutresSurfacesActions` - définis localement ou importés)
    *   Services (ex: `fetchAutresSurfaces` - depuis `src/services/autresSurfacesService.ts`)
*   **Structure de l'état initial (`initialState`) :**
    ```typescript
    interface AutresSurfacesState {
      autresSurfaces: AutreSurface[]; // Liste des types d'autres surfaces de référence
      loading: boolean;             // Indique si le chargement initial est en cours
      error: string | null;         // Message d'erreur en cas d'échec du chargement
    }

    const initialState: AutresSurfacesState = {
      autresSurfaces: [],
      loading: true,
      error: null,
    };
    ```
    *   `autresSurfaces`: Un tableau vide de `AutreSurface`. Représente la liste des types d'autres surfaces disponibles pour l'ajout dans un projet.
    *   `loading`: Booléen initialisé à `true`. Indique que les données sont en cours de chargement.
    *   `error`: Initialisé à `null`. Stockera un message d'erreur si le chargement échoue.
*   **Reducer Associé (`autresSurfacesReducer`) :**
    *   **Action `SET_AUTRES_SURFACES` :**
        *   `type`: `'SET_AUTRES_SURFACES'`
        *   `payload`: `AutreSurface[]` - Le tableau des autres surfaces chargées.
        *   Modification de l'état : Met à jour `autresSurfaces` avec le payload, met `loading` à `false` et `error` à `null`.
    *   **Action `SET_LOADING` :**
        *   `type`: `'SET_LOADING'`
        *   `payload`: `boolean` - La nouvelle valeur de l'état de chargement.
        *   Modification de l'état : Met à jour `loading` avec la valeur du payload.
    *   **Action `SET_ERROR` :**
        *   `type`: `'SET_ERROR'`
        *   `payload`: `string | null` - Le message d'erreur.
        *   Modification de l'état : Met à jour `error` avec le message du payload et met `loading` à `false`.
*   **Composant Provider (`AutresSurfacesProvider`) :**
    *   **Utilisation :** Enveloppe une partie de l'arbre de composants (probablement l'ensemble de l'application dans `App.tsx`).
    *   **Valeur passée dans `value` :** Un objet contenant l'état actuel (`state`) et la fonction `dispatch` retournés par `useReducer(autresSurfacesReducer, initialState)`.
    *   **`useEffect` :** Contient un `useEffect` au montage (`[]`) pour charger les données initiales via `fetchAutresSurfaces` et dispatcher les actions `SET_LOADING`, `SET_AUTRES_SURFACES` ou `SET_ERROR`.
*   **Hook Consommateur (`useAutresSurfaces`) :**
    *   **Implémentation :** Utilise `useContext(AutresSurfacesContext)`.
    *   **Retour :** Retourne l'objet `{ state, dispatch }`. Vérifie l'utilisation dans le Provider.
*   **Exports :**
    *   `AutresSurfacesContext`
    *   `AutresSurfacesProvider`
    *   `useAutresSurfaces`

---

#### `src/contexts/ClientsContext.tsx`

*   **Chemin :** `src/contexts/ClientsContext.tsx`
*   **Rôle Précis :** Gère l'état global de la liste des clients enregistrés dans l'application. Il permet de stocker, ajouter, modifier et supprimer des clients.
*   **Imports Clés :**
    *   `createContext`, `useContext`, `useReducer`, `ReactNode`, `useEffect` (depuis `react`)
    *   Types (ex: `Client`, `ClientState`, `ClientActions`)
    *   Services ou utilitaires pour la persistance ou les données par défaut (ex: `clientsService`, données par défaut)
    *   `toast` (pour les notifications)
*   **Structure de l'état initial (`initialState`) :**
    ```typescript
    interface ClientState {
      clients: Client[]; // Liste des clients
      loading: boolean; // État de chargement
      error: string | null; // Message d'erreur
    }

    const initialState: ClientState = {
      clients: [],
      loading: true,
      error: null,
    };
    ```
    *   `clients`: Un tableau vide de `Client`. Représente la liste de tous les clients gérés par le contexte.
    *   `loading`: Booléen. Indique si le chargement initial des clients est en cours.
    *   `error`: Stocke un message d'erreur.
*   **Reducer Associé (`clientsReducer`) :**
    *   **Action `SET_CLIENTS` :**
        *   `type`: `'SET_CLIENTS'`
        *   `payload`: `Client[]` - Le tableau complet des clients.
        *   Modification de l'état : Remplace `clients` par le payload. Met `loading` à `false`.
    *   **Action `ADD_CLIENT` :**
        *   `type`: `'ADD_CLIENT'`
        *   `payload`: `Client` - Le nouvel objet client à ajouter.
        *   Modification de l'état : Ajoute le client du payload au tableau `clients`.
    *   **Action `UPDATE_CLIENT` :**
        *   `type`: `'UPDATE_CLIENT'`
        *   `payload`: `{ id: string; client: Partial<Client> }` - L'ID du client à modifier et un objet contenant les propriétés mises à jour.
        *   Modification de l'état : Mappe sur `clients`, trouve par ID et fusionne les modifications.
    *   **Action `DELETE_CLIENT` :**
        *   `type`: `'DELETE_CLIENT'`
        *   `payload`: `string` - L'ID du client à supprimer.
        *   Modification de l'état : Filtre `clients` pour exclure le client correspondant à l'ID.
    *   **Action `RESET_CLIENTS` :**
        *   `type`: `'RESET_CLIENTS'`
        *   `payload`: Aucune ou les clients par défaut.
        *   Modification de l'état : Réinitialise `clients` à un état par défaut.
    *   **Action `SET_LOADING` :**
        *   `type`: `'SET_LOADING'`
        *   `payload`: `boolean`
        *   Modification de l'état : Met à jour `loading`.
    *   **Action `SET_ERROR` :**
        *   `type`: `'SET_ERROR'`
        *   `payload`: `string | null`
        *   Modification de l'état : Met à jour `error`.
*   **Composant Provider (`ClientsProvider`) :**
    *   **Utilisation :** Enveloppe une partie de l'application (dans `App.tsx`).
    *   **Valeur passée dans `value` :** L'objet `{ state, dispatch }` retourné par `useReducer`.
    *   **`useEffect` :** Contient un `useEffect` au montage (`[]`) pour charger les clients depuis une source persistante (ex: `clientsService.fetchClients`) et dispatcher `SET_CLIENTS` ou `SET_ERROR`. Peut contenir un autre `useEffect` pour la persistance lors des modifications.
*   **Hook Consommateur (`useClients`) :**
    *   **Implémentation :** Utilise `useContext(ClientsContext)`.
    *   **Retour :** Retourne `{ state, dispatch }`. Vérifie l'utilisation dans le Provider.
*   **Exports :**
    *   `ClientsContext`
    *   `ClientsProvider`
    *   `useClients`

---

#### `src/contexts/MenuiseriesTypesContext.tsx`

*   **Chemin :** `src/contexts/MenuiseriesTypesContext.tsx`
*   **Rôle Précis :** Gère l'état global des types de menuiseries de référence (ex: "Fenêtre", "Porte"). Fournit la liste de référence et les données par défaut.
*   **Imports Clés :**
    *   `createContext`, `useContext`, `useReducer`, `ReactNode`, `useEffect` (depuis `react`)
    *   Types (ex: `MenuiserieType`, `MenuiserieTypesState`, `MenuiserieTypesActions`)
    *   Services ou données par défaut (ex: `fetchMenuiserieTypes` ou données statiques par défaut)
*   **Structure de l'état initial (`initialState`) :**
    ```typescript
    interface MenuiserieTypesState {
      typesMenuiseries: MenuiserieType[]; // Liste des types de menuiseries
      loading: boolean;               // État de chargement
      error: string | null;           // Message d'erreur
    }

    const initialState: MenuiserieTypesState = {
      typesMenuiseries: [],
      loading: true,
      error: null,
    };
    ```
    *   `typesMenuiseries`: Tableau vide de `MenuiserieType`.
    *   `loading`: Booléen.
    *   `error`: Stocke un message d'erreur.
*   **Reducer Associé (`menuiseriesTypesReducer`) :**
    *   **Action `SET_TYPES` :**
        *   `type`: `'SET_TYPES'`
        *   `payload`: `MenuiserieType[]` - Tableau des types.
        *   Modification de l'état : Remplace `typesMenuiseries` par le payload. Met `loading` à `false`.
    *   **Action `ADD_TYPE` :**
        *   `type`: `'ADD_TYPE'`
        *   `payload`: `MenuiserieType` - Nouveau type.
        *   Modification de l'état : Ajoute le type à `typesMenuiseries`.
    *   **Action `UPDATE_TYPE` :**
        *   `type`: `'UPDATE_TYPE'`
        *   `payload`: `{ id: string; type: Partial<MenuiserieType> }` - ID et modifications.
        *   Modification de l'état : Met à jour le type correspondant dans `typesMenuiseries`.
    *   **Action `DELETE_TYPE` :**
        *   `type`: `'DELETE_TYPE'`
        *   `payload`: `string` - ID du type à supprimer.
        *   Modification de l'état : Filtre `typesMenuiseries` pour exclure le type.
    *   **Action `RESET_TYPES` :**
        *   `type`: `'RESET_TYPES'`
        *   `payload`: Aucune ou les types par défaut.
        *   Modification de l'état : Réinitialise `typesMenuiseries` à un état par défaut.
    *   **Action `SET_LOADING` :**
        *   `type`: `'SET_LOADING'`
        *   `payload`: `boolean`
        *   Modification de l'état : Met à jour `loading`.
    *   **Action `SET_ERROR` :**
        *   `type`: `'SET_ERROR'`
        *   `payload`: `string | null`
        *   Modification de l'état : Met à jour `error`.
*   **Composant Provider (`MenuiseriesTypesProvider`) :**
    *   **Utilisation :** Enveloppe l'application (dans `App.tsx`).
    *   **Valeur passée dans `value` :** L'objet `{ state, dispatch }` retourné par `useReducer`.
    *   **`useEffect` :** Contient un `useEffect` au montage (`[]`) pour charger les types depuis une source (ex: `menuiseriesService.fetchMenuiserieTypes`) et dispatcher `SET_TYPES` ou `SET_ERROR`.
*   **Hook Consommateur (`useMenuiseriesTypes`) :**
    *   **Implémentation :** Utilise `useContext(MenuiseriesTypesContext)`.
    *   **Retour :** Retourne `{ state, dispatch }`. Vérifie l'utilisation dans le Provider.
*   **Exports :**
    *   `MenuiseriesTypesContext`
    *   `MenuiseriesTypesProvider`
    *   `useMenuiseriesTypes`

---

#### `src/contexts/ProjectContext.tsx`

*   **Chemin :** `src/contexts/ProjectContext.tsx`
*   **Rôle Précis :** **Contexte central** de l'application. Gère l'intégralité de l'état du projet de devis en cours d'édition (métadonnées, bien, pièces, travaux, état `isDirty`).
*   **Imports Clés :**
    *   `createContext`, `useContext`, `useReducer`, `ReactNode`, `useEffect` (depuis `react`)
    *   Types (ex: `ProjectState`, `ProjectActions`, `ProjectMetadata`, `Property`, `Room`, `Travail`)
    *   Fonctions utilitaires (ex: `generateId`)
    *   Hooks ou services pour la persistance (ex: `useProjectStorage`) ou les données par défaut (`initialProjectState`)
*   **Structure de l'état initial (`initialState`) :**
    ```typescript
    // Rappel de la structure (définie dans src/types/project.ts)
    interface ProjectState {
      id: string | null;
      metadata: ProjectMetadata;
      property: Property;
      rooms: Room[];
      travaux: Travail[];
      isDirty: boolean;
    }

    const initialProjectState: ProjectState = {
      id: null,
      metadata: { /* valeurs par défaut */ },
      property: { /* valeurs par défaut */ },
      rooms: [],
      travaux: [],
      isDirty: false,
    };
    ```
*   **Reducer Associé (`projectReducer`) :** (Importé depuis `src/features/project/reducers/projectReducer.ts`)
    *   **Action `LOAD_PROJECT` :**
        *   `type`: `'LOAD_PROJECT'`
        *   `payload`: `ProjectState` - L'état complet du projet à charger.
        *   Modification de l'état : Remplace l'état actuel par le payload. Met `isDirty` à `false`.
    *   **Action `UPDATE_METADATA` :**
        *   `type`: `'UPDATE_METADATA'` // (Note: typo possible dans le code source, pourrait être UPDATE_METADATA)
        *   `payload`: `Partial<ProjectMetadata>` - Modifications des métadonnées.
        *   Modification de l'état : Fusionne le payload avec `state.metadata`. Met `isDirty` à `true`.
    *   **Action `UPDATE_PROPERTY` :**
        *   `type`: `'UPDATE_PROPERTY'`
        *   `payload`: `Partial<Property>` - Modifications du bien.
        *   Modification de l'état : Fusionne le payload avec `state.property`. Met `isDirty` à `true`.
    *   **Action `ADD_ROOM` :**
        *   `type`: `'ADD_ROOM'`
        *   `payload`: `Room` - Nouvelle pièce.
        *   Modification de l'état : Ajoute la pièce à `state.rooms`. Met `isDirty` à `true`.
    *   **Action `UPDATE_ROOM` :**
        *   `type`: `'UPDATE_ROOM'`
        *   `payload`: `{ roomId: string; updates: Partial<Room> }` - ID et modifications de la pièce.
        *   Modification de l'état : Met à jour la pièce correspondante dans `state.rooms`. Met `isDirty` à `true`.
    *   **Action `DELETE_ROOM` :**
        *   `type`: `'DELETE_ROOM'`
        *   `payload`: `string` - ID de la pièce à supprimer.
        *   Modification de l'état : Filtre `state.rooms` pour exclure la pièce. Met `isDirty` à `true`.
    *   **Action `ADD_TRAVAIL` :**
        *   `type`: `'ADD_TRAVAIL'`
        *   `payload`: `Travail` - Nouveau travail.
        *   Modification de l'état : Ajoute le travail à `state.travaux`. Met `isDirty` à `true`.
    *   **Action `UPDATE_TRAVAIL` :**
        *   `type`: `'UPDATE_TRAVAIL'`
        *   `payload`: `{ travailId: string; updates: Partial<Travail> }` - ID et modifications du travail.
        *   Modification de l'état : Met à jour le travail correspondant dans `state.travaux`. Met `isDirty` à `true`.
    *   **Action `DELETE_TRAVAIL` :**
        *   `type`: `'DELETE_TRAVAIL'`
        *   `payload`: `string` - ID du travail à supprimer.
        *   Modification de l'état : Filtre `state.travaux` pour exclure le travail. Met `isDirty` à `true`.
    *   **Action `SET_DIRTY` :**
        *   `type`: `'SET_DIRTY'`
        *   `payload`: `boolean` - Nouvelle valeur de `isDirty`.
        *   Modification de l'état : Met à jour `state.isDirty`.
    *   **(Autres actions)** : Potentiellement des actions plus spécifiques pour les menuiseries, autres surfaces, etc.
*   **Composant Provider (`ProjectProvider`) :**
    *   **Utilisation :** Enveloppe la partie haute de l'application (dans `App.tsx`).
    *   **Valeur passée dans `value` :** L'objet `{ state, dispatch }` retourné par `useReducer(projectReducer, initialProjectState)`.
    *   **`useEffect` :** Contient probablement des `useEffect` pour le chargement initial du projet (ex: depuis `localStorage` ou Supabase via `useProjectStorage`), la gestion de la sauvegarde automatique (potentiellement via le hook `useAutoSave`), et la synchronisation avec le stockage persistant lors des modifications (`isDirty`).
*   **Hook Consommateur (`useProject`) :**
    *   **Implémentation :** Utilise `useContext(ProjectContext)`.
    *   **Retour :** Retourne `{ state, dispatch }`. Vérifie l'utilisation dans le Provider.
*   **Exports :**
    *   `ProjectContext`
    *   `ProjectProvider`
    *   `useProject`

---

#### `src/contexts/TravauxTypesContext.tsx`

*   **Chemin :** `src/contexts/TravauxTypesContext.tsx`
*   **Rôle Précis :** Gère l'état global des types de travaux et de leurs sous-types (prestations) de référence. Utilisé pour peupler les listes de sélection et fournir les informations de base lors de l'ajout de travaux. Gère les opérations CRUD sur ces données de référence.
*   **Imports Clés :**
    *   `createContext`, `useContext`, `useReducer`, `ReactNode`, `useEffect` (depuis `react`)
    *   Types (ex: `TravauxType`, `SousTypeTravauxItem`, `TravauxTypesState`, `TravauxTypesActions`)
    *   Services ou données par défaut (ex: `fetchTravauxTypes`, `travauxService`)
    *   `toast` (pour les notifications)
*   **Structure de l'état initial (`initialState`) :**
    ```typescript
    interface TravauxTypesState {
      types: TravauxType[]; // Liste des types de travaux avec leurs sous-types
      loading: boolean;     // État de chargement
      error: string | null; // Message d'erreur
    }

    const initialState: TravauxTypesState = {
      types: [],
      loading: true,
      error: null,
    };
    ```
    *   `types`: Tableau vide de `TravauxType`.
    *   `loading`: Booléen.
    *   `error`: Stocke un message d'erreur.
*   **Reducer Associé (`travauxTypesReducer`) :**
    *   **Action `SET_TYPES` :**
        *   `type`: `'SET_TYPES'`
        *   `payload`: `TravauxType[]` - Tableau complet des types.
        *   Modification de l'état : Remplace `types` par le payload. Met `loading` à `false`.
    *   **Action `ADD_TYPE` :**
        *   `type`: `'ADD_TYPE'`
        *   `payload`: `TravauxType` - Nouveau type.
        *   Modification de l'état : Ajoute le type à `types`.
    *   **Action `UPDATE_TYPE` :**
        *   `type`: `'UPDATE_TYPE'`
        *   `payload`: `{ id: string; type: Partial<TravauxType> }` - ID et modifications.
        *   Modification de l'état : Met à jour le type correspondant dans `types`.
    *   **Action `DELETE_TYPE` :**
        *   `type`: `'DELETE_TYPE'`
        *   `payload`: `string` - ID du type à supprimer.
        *   Modification de l'état : Filtre `types` pour exclure le type.
    *   **Action `ADD_SOUS_TYPE` :**
        *   `type`: `'ADD_SOUS_TYPE'`
        *   `payload`: `{ typeId: string; sousType: SousTypeTravauxItem }` - ID parent et nouvelle prestation.
        *   Modification de l'état : Ajoute la prestation au tableau `sousTypes` du type parent.
    *   **Action `UPDATE_SOUS_TYPE` :**
        *   `type`: `'UPDATE_SOUS_TYPE'`
        *   `payload`: `{ typeId: string; id: string; sousType: Partial<SousTypeTravauxItem> }` - IDs et modifications.
        *   Modification de l'état : Met à jour la prestation correspondante dans le type parent.
    *   **Action `DELETE_SOUS_TYPE` :**
        *   `type`: `'DELETE_SOUS_TYPE'`
        *   `payload`: `{ typeId: string; id: string }` - IDs parent/prestation.
        *   Modification de l'état : Filtre le tableau `sousTypes` du type parent pour exclure la prestation.
    *   **Action `SET_LOADING` :**
        *   `type`: `'SET_LOADING'`
        *   `payload`: `boolean`
        *   Modification de l'état : Met à jour `loading`.
    *   **Action `SET_ERROR` :**
        *   `type`: `'SET_ERROR'`
        *   `payload`: `string | null`
        *   Modification de l'état : Met à jour `error`.
*   **Composant Provider (`TravauxTypesProvider`) :**
    *   **Utilisation :** Enveloppe une partie de l'application (dans `App.tsx`).
    *   **Valeur passée dans `value` :** L'objet `{ state, dispatch }` retourné par `useReducer`.
    *   **`useEffect` :** Contient un `useEffect` au montage (`[]`) pour charger les données de référence (ex: via `travauxService.fetchWorkTypes`) et dispatcher `SET_TYPES` ou `SET_ERROR`.
*   **Hook Consommateur (`useTravauxTypes`) :**
    *   **Implémentation :** Utilise `useContext(TravauxTypesContext)`.
    *   **Retour :** Retourne `{ state, dispatch }`. Vérifie l'utilisation dans le Provider.
*   **Exports :**
    *   `TravauxTypesContext`
    *   `TravauxTypesProvider`
    *   `useTravauxTypes`

    ### 9. Dossier `src/hooks/` & `src/features/.../hooks/`

Cette section documente les hooks React personnalisés développés spécifiquement pour l'application, encapsulant la logique métier, l'accès aux contextes, les appels aux services, ou des comportements UI réutilisables.

#### `src/hooks/useAppState.ts`

*   **Chemin :** `src/hooks/useAppState.ts`
*   **Rôle Précis :** Ce hook fournit l'accès et la gestion de l'état global de l'application qui n'est pas directement lié aux données spécifiques d'un projet ouvert. Cela inclut l'état d'ouverture/fermeture de modales globales (comme "Nouveau Projet", "Ouvrir Projet", "Sauvegarder Sous") et des indicateurs globaux (comme l'état de sauvegarde automatique, les paramètres PDF si gérés globalement). Il est basé sur un `AppStateContext` et un reducer sous-jacents.
*   **Imports Clés :**
    *   `useContext` (depuis `react`)
    *   `AppStateContext` (Contexte React défini ailleurs, probablement dans `src/contexts/` - bien que non explicitement listé, ce contexte doit exister)
    *   `AppState` (type TypeScript pour la structure de l'état global)
    *   `AppActions` (type TypeScript pour les actions possibles sur l'état global)
*   **États Internes (`useState`) :** Aucun état interne géré directement *dans le hook* lui-même. Il accède à l'état géré par le `AppStateContext`.
*   **Effets (`useEffect`) :** Aucun effet défini directement *dans le hook*. La logique des effets (persistance de l'état, actions asynchrones globales) serait dans le Provider du contexte associé.
*   **Fonctions Internes :** Aucune fonction interne définie directement *dans le hook*. Il retourne les fonctions de l'objet contexte.
*   **Objet Retourné :** Le hook retourne l'objet fourni par le `AppStateContext`, qui contient généralement :
    *   `state`: L'objet d'état actuel de l'application (`AppState`). Contient des indicateurs comme `isNewProjectModalOpen`, `isOpenProjectModalOpen`, `isSaveAsModalOpen`, `pdfSettings` (si géré ici), etc.
    *   `dispatch`: La fonction pour dispatcher des actions (`AppActions`) afin de modifier l'état via le reducer associé (ex: `OPEN_NEW_PROJECT_MODAL`, `CLOSE_NEW_PROJECT_MODAL`, `UPDATE_PDF_SETTINGS`).
*   **Export :** `export const useAppState = () => { ... };` (export nommé).

---

#### `src/hooks/useAutoSave.ts`

*   **Chemin :** `src/hooks/useAutoSave.ts`
*   **Rôle Précis :** Ce hook implémente la logique de sauvegarde automatique du projet en cours. Il observe les changements dans l'état du projet et déclenche périodiquement une opération de sauvegarde après une période d'inactivité, mais uniquement si des modifications non sauvegardées existent (`isDirty`).
*   **Imports Clés :**
    *   `useEffect`, `useRef`, `useCallback` (depuis `react`)
    *   `useProject` (hook pour accéder à l'état du projet, notamment `state.isDirty` et `state.id`)
    *   `useProjectOperations` (hook fournissant la fonction de sauvegarde `saveProject`)
    *   `debounce` (fonction utilitaire pour limiter la fréquence d'exécution, depuis `lodash` ou implémentation locale)
*   **États Internes (`useState`) :** Aucun état interne géré directement dans le hook.
*   **Effets (`useEffect`) :**
    *   Un effet principal surveille les changements dans l'état du projet (`projectState` de `useProject`).
    *   À chaque modification du projet, il vérifie si `projectState.isDirty` est `true` et si `projectState.id` n'est pas `null` (le projet doit exister pour être auto-sauvegardé).
    *   Si les conditions sont remplies, il appelle la fonction dérebondie (`debouncedSave`).
    *   La fonction de nettoyage de l'effet (`return ...`) pourrait annuler le minuteur de debounce en attente, bien que `debounce` gère souvent cela en interne.
*   **Fonctions Internes :**
    *   `debouncedSave`: Créée avec `useRef` et `debounce` autour de la fonction `saveProject` de `useProjectOperations`. Assure que `saveProject` n'est pas appelée trop fréquemment pendant la saisie.
*   **Objet Retourné :** Ce hook ne retourne généralement rien (`void`), car son rôle est d'exécuter un effet secondaire (la sauvegarde) en arrière-plan.
*   **Export :** `export const useAutoSave = () => { ... };` (export nommé).

---

#### `src/hooks/useAutresSurfaces.ts` (Potentiellement lié à `useAutresSurfacesWithSupabase.ts`)

*   **Chemin :** `src/hooks/useAutresSurfaces.ts`
*   **Rôle Précis :** Fournit l'accès à la liste des types d'autres surfaces de référence, probablement en consommant le `AutresSurfacesContext`.
*   **Imports Clés :**
    *   `useContext` (depuis `react`)
    *   `AutresSurfacesContext` (depuis `src/contexts/AutresSurfacesContext.tsx`)
*   **États Internes (`useState`) :** Aucun.
*   **Effets (`useEffect`) :** Aucun.
*   **Fonctions Internes :** Aucune.
*   **Objet Retourné :** Retourne l'objet `{ state, dispatch }` du `AutresSurfacesContext`.
    *   `state`: Contient `autresSurfaces: AutreSurface[]`, `loading: boolean`, `error: string | null`.
    *   `dispatch`: Fonction pour dispatcher des actions au reducer du contexte.
*   **Export :** `export const useAutresSurfaces = () => { ... };`

---

#### `src/hooks/useAutresSurfacesWithSupabase.ts`

*   **Chemin :** `src/hooks/useAutresSurfacesWithSupabase.ts`
*   **Rôle Précis :** **OBSOLÈTE/RELIQUE PROBABLE.** Semble être un hook qui gérait le chargement et potentiellement les opérations CRUD pour les *instances* d'autres surfaces directement depuis Supabase, possiblement lié à `AutresSurfacesListWithSupabase.tsx`. Cette approche est probablement remplacée par la gestion dans `ProjectContext`.
*   **Imports Clés :** Probablement `useState`, `useEffect`, `supabase` client, service `autresSurfacesService` (pour les instances, pas les types), types (`AutreSurfaceItem`).
*   **Logique Probable (si actif) :** Fetcherait les `AutreSurfaceItem` liées à un `roomId` depuis une table Supabase (ex: `room_autres_surfaces`), fournirait des fonctions pour ajouter/modifier/supprimer ces items en appelant les fonctions correspondantes du service.
*   **Objet Retourné (si actif) :** Retournerait la liste des `AutreSurfaceItem` pour une pièce, l'état de chargement, et les fonctions CRUD.
*   **Export :** `export const useAutresSurfacesWithSupabase = (roomId: string) => { ... };`

---

#### `src/hooks/useCalculSurfaces.ts`

*   **Chemin :** `src/hooks/useCalculSurfaces.ts`
*   **Rôle Précis :** Fournit des fonctions utilitaires pour calculer différentes surfaces basées sur les dimensions d'une pièce et ses éléments (menuiseries, autres surfaces).
*   **Imports Clés :** Types (`Room`, `MenuiserieItem`), potentiellement des utilitaires mathématiques.
*   **États Internes (`useState`) :** Aucun. C'est un hook utilitaire.
*   **Effets (`useEffect`) :** Aucun.
*   **Fonctions Internes / Exportées :**
    *   `calculateSurfaceMurs(room: Room)`: Calcule la surface totale des murs (périmètre * hauteur).
    *   `calculateSurfacePlafond(room: Room)`: Calcule la surface du plafond (identique à `room.surface`).
    *   `calculateSurfaceSol(room: Room)`: Calcule la surface du sol (`room.surface`).
    *   `calculateSurfaceMenuiseries(room: Room)`: Calcule la surface totale occupée par les menuiseries.
    *   `calculateSurfaceNetteMurs(room: Room)`: Calcule la surface des murs en déduisant la surface des menuiseries qui impactent les murs.
    *   **(Autres fonctions)** : Calculs de périmètre, linéaires de plinthes (en tenant compte de `impactePlinthe`), etc.
*   **Objet Retourné :** Retourne un objet contenant les fonctions de calcul : `{ calculateSurfaceMurs, calculateSurfacePlafond, ... }`.
*   **Export :** `export const useCalculSurfaces = () => { ... };`

---

#### `src/hooks/useDevisGeneration.ts`

*   **Chemin :** `src/hooks/useDevisGeneration.ts`
*   **Rôle Précis :** **OBSOLÈTE.** Ce hook encapsulait la logique de déclenchement de l'ancienne méthode de génération de PDF (probablement basée sur `pdfMake`). Il est remplacé par `useReactPdfGeneration`.
*   **Imports Clés :** Probablement `useState`, `useProject`, services PDF obsolètes (`devisService`, `pdfGenerationService`, `pdfDocumentService`).
*   **Logique Probable (si actif) :** Fournirait une fonction `generateDevis` qui récupère les données du projet, appelle les services de l'ancienne méthode pour formater et générer le PDF, et gère un état `isGenerating`.
*   **Objet Retourné (si actif) :** `{ isGenerating, generateDevis }`.
*   **Export :** `export const useDevisGeneration = () => { ... };`

---

#### `src/hooks/useLocalStorage.ts`

*   **Chemin :** `src/hooks/useLocalStorage.ts`
*   **Rôle Précis :** Hook générique pour lire et écrire des données dans le `localStorage` du navigateur, tout en synchronisant avec un état React.
*   **Imports Clés :** `useState`, `useEffect`.
*   **États Internes (`useState`) :**
    *   `storedValue`: L'état React qui reflète la valeur stockée.
*   **Effets (`useEffect`) :**
    *   Un `useEffect` au montage lit la valeur initiale depuis `localStorage` (avec gestion d'erreur si la valeur n'existe pas ou n'est pas parsable) et initialise `storedValue`.
    *   Un autre `useEffect` écoute les changements de `storedValue` et écrit la nouvelle valeur sérialisée dans `localStorage`.
*   **Fonctions Internes / Exportées :**
    *   Retourne la valeur (`storedValue`) et une fonction `setValue` pour la mettre à jour (qui met à jour l'état React et déclenche l'effet d'écriture dans `localStorage`).
*   **Objet Retourné :** `[storedValue, setValue]` (structure similaire à `useState`).
*   **Export :** `export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void];` (signature typique)

---

#### `src/hooks/useMenuiseries.ts`

*   **Chemin :** `src/hooks/useMenuiseries.ts`
*   **Rôle Précis :** Fournit l'accès à la liste des types de menuiseries de référence, probablement en consommant le `MenuiseriesTypesContext`.
*   **Imports Clés :**
    *   `useContext` (depuis `react`)
    *   `MenuiseriesTypesContext` (depuis `src/contexts/MenuiseriesTypesContext.tsx`)
*   **États Internes (`useState`) :** Aucun.
*   **Effets (`useEffect`) :** Aucun.
*   **Fonctions Internes :** Aucune.
*   **Objet Retourné :** Retourne l'objet `{ state, dispatch }` du `MenuiseriesTypesContext`.
    *   `state`: Contient `typesMenuiseries: MenuiserieType[]`, `loading: boolean`, `error: string | null`.
    *   `dispatch`: Fonction pour dispatcher des actions au reducer du contexte.
*   **Export :** `export const useMenuiseries = () => { ... };`

---

#### `src/hooks/useProjectOperations.ts`

*   **Chemin :** `src/hooks/useProjectOperations.ts`
*   **Rôle Précis :** Regroupe les fonctions de haut niveau pour les opérations majeures sur le projet (création, chargement, sauvegarde, sauvegarde sous, suppression). Orchestre l'utilisation des services sous-jacents (`projectSaveService`, `projectBaseService`) et interagit avec les contextes (`ProjectContext`, `AppStateContext`).
*   **Imports Clés :**
    *   `useCallback` (depuis `react`)
    *   `useProject` (pour accéder à l'état du projet et `dispatch`)
    *   `useAppState` (pour gérer les modales et potentiellement l'état de chargement/sauvegarde global)
    *   Services (`projectSaveService`, `projectBaseService`)
    *   `toast` (pour les notifications)
    *   Fonctions utilitaires (`generateId`)
*   **États Internes (`useState`) :** Potentiellement des états pour gérer le chargement/sauvegarde si non géré par `useAppState`.
    *   `currentProjectId`: `string | null` - Maintient l'ID du projet actuellement chargé.
*   **Effets (`useEffect`) :** Potentiellement pour initialiser `currentProjectId` au montage.
*   **Fonctions Internes / Exportées :** (Toutes mémorisées avec `useCallback`)
    *   `createProject`: Appelle `projectBaseService.createEmptyProjectState`, dispatche `LOAD_PROJECT` au `ProjectContext` avec l'état vide, met `currentProjectId` à `null`.
    *   `loadProject(projectId: string)`: Appelle `projectSaveService.loadProject(projectId)`. Si succès, valide les données, dispatche `LOAD_PROJECT` au `ProjectContext`, met à jour `currentProjectId`. Gère les erreurs avec `toast`.
    *   `saveProject`: Vérifie si `currentProjectId` existe. Si oui, appelle `projectSaveService.saveProject(projectState)`. Si succès, dispatche `SET_DIRTY(false)`. Gère les erreurs. Si `currentProjectId` est `null`, ouvre la modale "Enregistrer Sous" via `useAppState`.
    *   `saveProjectAs(newProjectName: string)`: Crée une copie de `projectState`, met à jour le nom, met `id` à `null` (ou génère un nouvel ID). Appelle `projectSaveService.saveProject` (ou une fonction dédiée `saveProjectAs`) pour *insérer* le nouveau projet. Si succès, reçoit le nouvel ID, dispatche `LOAD_PROJECT` (ou `UPDATE_PROJECT_ID` + `SET_DIRTY(false)`), met à jour `currentProjectId`. Gère les erreurs.
    *   `deleteProject`: Appelle `projectSaveService.deleteProject(currentProjectId)`. Si succès, appelle `createProject` pour réinitialiser à un projet vide. Gère les erreurs.
*   **Objet Retourné :** Retourne un objet contenant les fonctions d'opération : `{ createProject, loadProject, saveProject, saveProjectAs, deleteProject, currentProjectId, setCurrentProjectId }`.
*   **Export :** `export const useProjectOperations = () => { ... };`

---

#### `src/hooks/useRoomCustomItemsWithSupabase.ts`

*   **Chemin :** `src/hooks/useRoomCustomItemsWithSupabase.ts`
*   **Rôle Précis :** **OBSOLÈTE/RELIQUE PROBABLE.** Semble être un hook qui gérait le chargement/CRUD des menuiseries et autres surfaces pour une pièce spécifique directement via Supabase. Remplacé par la gestion via `ProjectContext` et les hooks/composants comme `useRooms`, `MenuiseriesList`, `AutresSurfacesList`.
*   **Imports Clés :** Probablement `useState`, `useEffect`, `supabase` client, services spécifiques (si existants), types (`MenuiserieItem`, `AutreSurfaceItem`).
*   **Logique Probable (si actif) :** Fetcherait les `MenuiserieItem` et `AutreSurfaceItem` liées à un `roomId` depuis des tables Supabase (ex: `room_menuiseries`, `room_autres_surfaces`), fournirait des fonctions CRUD appelant les services correspondants.
*   **Objet Retourné (si actif) :** Retournerait les listes de menuiseries/autres surfaces, état de chargement, fonctions CRUD.
*   **Export :** `export const useRoomCustomItemsWithSupabase = (roomId: string) => { ... };`

---

#### `src/features/chantier/hooks/useProjectInfo.tsx`

*   **Chemin :** `src/features/chantier/hooks/useProjectInfo.tsx`
*   **Rôle Précis :** Hook spécifique à la page "Infos Chantier". Il agrège l'état complet du projet (`projectState` de `useProject`), l'état des opérations (`isLoading`, `hasUnsavedChanges`, handlers de `useProjectOperations`), et potentiellement des données externes (liste des projets, clients, sociétés) pour fournir toutes les données et fonctions nécessaires à `InfosChantierLayout`. Il peut aussi gérer la logique de génération automatique du nom de projet.
*   **Imports Clés :**
    *   `useProject`
    *   `useProjectOperations`
    *   `useClients` (pour la liste des clients)
    *   `useCompanies` (si un hook similaire existe pour les sociétés)
    *   `useState`, `useEffect`, `useCallback`
*   **États Internes (`useState`) :** Potentiellement pour des états dérivés ou temporaires (ex: état de chargement spécifique à ce hook, données clients/sociétés fetchées si non gérées par contexte).
*   **Effets (`useEffect`) :** Pour synchroniser les données, charger des listes (clients, sociétés) si nécessaire.
*   **Fonctions Internes / Exportées :**
    *   Fonctions `set...` pour chaque champ de métadonnées (ex: `setNomProjet`, `setDateDevis`) qui appellent le `dispatch({ type: 'UPDATE_METADATA', ... })` de `useProject`.
    *   Fonctions pour la génération du nom (`generateProjectName`, `generateProjectNameIfNeeded`).
    *   Expose les fonctions `handleSaveProject`, `handleChargerProjet`, `handleDeleteProject` de `useProjectOperations`.
*   **Objet Retourné :** Retourne un gros objet contenant toutes les données et fonctions nécessaires à `InfosChantierLayout` (voir description de ce composant pour la liste détaillée).
*   **Export :** `export const useProjectInfo = () => { ... };`

---

#### `src/features/chantier/hooks/useProjectMetadata.tsx`

*   **Chemin :** `src/features/chantier/hooks/useProjectMetadata.tsx`
*   **Rôle Précis :** Fournit un accès simplifié aux métadonnées du projet (`projectState.metadata`) et une fonction pour les mettre à jour via `dispatch`. Utilisé par des composants qui n'ont besoin que de cette partie de l'état.
*   **Imports Clés :**
    *   `useProject`
    *   `useCallback`
    *   `ProjectMetadata` (type)
*   **États Internes (`useState`) :** Aucun.
*   **Effets (`useEffect`) :** Aucun.
*   **Fonctions Internes / Exportées :**
    *   `updateMetadata(updates: Partial<ProjectMetadata>)`: Fonction mémorisée avec `useCallback` qui appelle `dispatch({ type: 'UPDATE_METADATA', payload: updates })`.
*   **Objet Retourné :** `{ metadata: projectState.metadata, updateMetadata }`.
*   **Export :** `export const useProjectMetadata = () => { ... };`

---

#### `src/features/chantier/hooks/useProjectOperations.tsx`

*   **Chemin :** `src/features/chantier/hooks/useProjectOperations.tsx`
*   **Rôle Précis :** **RELIQUE/REDUNDANCE PROBABLE.** Ce hook semble être une version spécifique à la feature "chantier" du hook global `src/hooks/useProjectOperations.ts`. Il est très probable qu'il soit redondant ou qu'il ait été remplacé par le hook global. S'il est utilisé, il fournit probablement un sous-ensemble ou une version légèrement adaptée des fonctions d'opération sur le projet.
*   **Analyse Requise :** Nécessite une analyse du code pour confirmer son utilisation et ses différences avec le hook global.

---

#### `src/features/project/hooks/useProjectStorage.ts`

*   **Chemin :** `src/features/project/hooks/useProjectStorage.ts`
*   **Rôle Précis :** Encapsule la logique de bas niveau pour interagir avec le stockage persistant (localStorage et/ou Supabase `projects_save`) pour l'état du projet. Utilisé par `useProjectOperations` ou `ProjectProvider`.
*   **Imports Clés :**
    *   `useCallback`
    *   `ProjectState` (type)
    *   `supabase` client
    *   Zod (pour la validation)
*   **États Internes (`useState`) :** Aucun.
*   **Effets (`useEffect`) :** Aucun.
*   **Fonctions Internes / Exportées :** (Mémorisées avec `useCallback`)
    *   `saveProjectState(state: ProjectState)`: Sérialise `state` en JSON et l'écrit dans `localStorage` et/ou appelle `supabase.from('projects_save').upsert(...)` pour sauvegarder dans Supabase. Gère les erreurs. Retourne `Promise<void>` ou `Promise<boolean>`.
    *   `loadProjectState(projectId: string)`: Tente de charger depuis Supabase (`select('project_data').eq('id', projectId).single()`) ou `localStorage`. Désérialise, valide le JSON obtenu avec un schéma Zod `ProjectStateSchema`. Retourne `Promise<ProjectState | null>`.
    *   `deleteProjectState(projectId: string)`: Appelle `supabase.from('projects_save').delete().eq('id', projectId)` et supprime du `localStorage`. Retourne `Promise<boolean>`.
*   **Objet Retourné :** `{ saveProjectState, loadProjectState, deleteProjectState }`.
*   **Export :** `export const useProjectStorage = () => { ... };`

---

#### `src/features/project/hooks/useRooms.ts`

*   **Chemin :** `src/features/project/hooks/useRooms.ts`
*   **Rôle Précis :** Fournit l'accès à la liste des pièces (`rooms`) de l'état du projet et les fonctions pour les manipuler (ajouter, modifier, supprimer) en dispatchant les actions appropriées au `ProjectContext`.
*   **Imports Clés :**
    *   `useProject`
    *   `useCallback`
    *   `Room` (type)
    *   `generateId` (utilitaire)
*   **États Internes (`useState`) :** Aucun.
*   **Effets (`useEffect`) :** Aucun.
*   **Fonctions Internes / Exportées :** (Mémorisées avec `useCallback`)
    *   `addRoom(newRoomData: Omit<Room, 'id'>)`: Génère un ID, crée l'objet `Room` complet, appelle `dispatch({ type: 'ADD_ROOM', payload: newRoomObject })`.
    *   `updateRoom(roomId: string, updates: Partial<Room>)`: Appelle `dispatch({ type: 'UPDATE_ROOM', payload: { roomId, updates } })`.
    *   `deleteRoom(roomId: string)`: Appelle `dispatch({ type: 'DELETE_ROOM', payload: roomId })`.
*   **Objet Retourné :** `{ rooms: projectState.rooms, addRoom, updateRoom, deleteRoom }`.
*   **Export :** `export const useRooms = () => { ... };`

---

#### `src/features/project/hooks/useSaveLoadWarning.ts`

*   **Chemin :** `src/features/project/hooks/useSaveLoadWarning.ts`
*   **Rôle Précis :** Gère l'affichage d'un avertissement natif du navigateur si l'utilisateur tente de quitter la page alors que le projet a des modifications non sauvegardées (`isDirty`).
*   **Imports Clés :**
    *   `useEffect`
    *   `useProject`
*   **États Internes (`useState`) :** Aucun.
*   **Effets (`useEffect`) :**
    *   Un effet enregistre un écouteur sur l'événement `window.onbeforeunload`.
    *   La fonction de rappel (`handleBeforeUnload`) vérifie `projectState.isDirty`. Si `true`, elle `event.preventDefault()` et assigne une chaîne à `event.returnValue` (ce qui déclenche l'avertissement du navigateur).
    *   La fonction de nettoyage de l'effet supprime l'écouteur d'événement. Dépendance : `[projectState.isDirty]`.
*   **Fonctions Internes :**
    *   `handleBeforeUnload(event)`: La fonction de rappel pour `beforeunload`.
*   **Objet Retourné :** Ne retourne rien (`void`).
*   **Export :** `export const useSaveLoadWarning = () => { ... };`

---

#### `src/features/travaux/hooks/useTravaux.ts`

*   **Chemin :** `src/features/travaux/hooks/useTravaux.ts`
*   **Rôle Précis :** Fournit l'accès à la liste complète des travaux du projet (`travaux`) et les fonctions pour les manipuler (filtrer par pièce, ajouter, modifier, supprimer) en dispatchant les actions appropriées au `ProjectContext`.
*   **Imports Clés :**
    *   `useProject`
    *   `useCallback`
    *   `Travail` (type)
    *   `generateId` (utilitaire)
*   **États Internes (`useState`) :** Aucun.
*   **Effets (`useEffect`) :** Aucun.
*   **Fonctions Internes / Exportées :** (Mémorisées avec `useCallback`)
    *   `getTravauxForPiece(pieceId: string)`: Filtre le tableau `projectState.travaux` pour retourner uniquement ceux dont `travail.pieceId === pieceId`.
    *   `addTravail(newTravailData: Omit<Travail, 'id'>)`: Génère un ID, crée l'objet `Travail` complet, appelle `dispatch({ type: 'ADD_TRAVAIL', payload: newTravailObject })`.
    *   `updateTravail(travailId: string, updates: Partial<Travail>)`: Appelle `dispatch({ type: 'UPDATE_TRAVAIL', payload: { travailId, updates } })`.
    *   `deleteTravail(travailId: string)`: Appelle `dispatch({ type: 'DELETE_TRAVAIL', payload: travailId })`.
*   **Objet Retourné :** `{ travaux: projectState.travaux, getTravauxForPiece, addTravail, updateTravail, deleteTravail }`.
*   **Export :** `export const useTravaux = () => { ... };`

---

#### `src/services/pdf/react-pdf/hooks/useReactPdfGeneration.tsx`

*   **Chemin :** `src/services/pdf/react-pdf/hooks/useReactPdfGeneration.tsx`
*   **Rôle Précis :** Hook personnalisé qui orchestre le processus de génération d'un document PDF complet en utilisant les composants React-PDF. Il assemble le document, utilise l'API de `@react-pdf/renderer` pour générer le Blob PDF et l'ouvrir.
*   **Imports Clés :**
    *   React hooks (`useState`, `useCallback`)
    *   API de `@react-pdf/renderer` (`pdf`, `Document`)
    *   Hooks ou contextes pour obtenir les données du projet (`useProject`) et les paramètres PDF (`usePdfSettings`)
    *   Composants de page React-PDF (ex: `CoverDocumentContent`, `DetailsPage`, `RecapPage`, `CGVPage`)
    *   Utilitaires (`getPdfStyles`)
    *   Types (ex: `ProjectState`, `PdfSettings`)
    *   `file-saver` (ou similaire)
    *   `toast` (pour les notifications).
*   **États Locaux (`useState`) :**
    *   `isGenerating: boolean`: Indique si la génération est en cours.
*   **Effets (`useEffect`) :** Aucun effet direct.
*   **Fonctions Internes / Exportées :**
    *   `generateReactPdf()`: Fonction asynchrone (mémorisée avec `useCallback`) qui : met `isGenerating` à true, récupère `projectState` et `pdfSettings`, assemble le `<Document>` avec les composants de page, appelle `pdf(...).toBlob()`, ouvre/sauvegarde le Blob résultant, gère les erreurs, et met `isGenerating` à false.
*   **Objet Retourné :** `{ isGenerating, generateReactPdf }`.
*   **Export :** `export const useReactPdfGeneration = () => { ... };`

---

#### `src/services/pdf/hooks/usePdfSettings.ts`

*   **Chemin :** `src/services/pdf/hooks/usePdfSettings.ts`
*   **Rôle Précis :** Hook personnalisé pour gérer le chargement, la mise à jour et la persistance des paramètres de configuration du PDF (`PdfSettings`). Interagit avec `useAppState` (ou un autre mécanisme de persistance) et valide les données avec Zod.
*   **Imports Clés :** `useState`, `useCallback`, `useEffect`, `useAppState`, types et schémas (`PdfSettings`, `PdfSettingsSchema`), service de persistance (potentiellement).
*   **États Locaux (`useState`) :**
    *   `pdfSettings: PdfSettings | null`: Stocke les paramètres actuels.
    *   `isLoading: boolean`: État de chargement initial.
*   **Effets (`useEffect`) :**
    *   Un `useEffect` au montage (`[]`) charge les paramètres initiaux (via `useAppState` ou service), valide avec `PdfSettingsSchema`, met à jour `pdfSettings` et `isLoading`.
*   **Fonctions Internes / Exportées :** (Mémorisées avec `useCallback`)
    *   `updatePdfSettings(updates: Partial<PdfSettings>)`: Fusionne `updates` avec `pdfSettings`, valide le résultat avec `PdfSettingsSchema`, met à jour l'état local `pdfSettings`, et appelle la logique de persistance (via `useAppState` ou service).
    *   `resetPdfSettings`: Réinitialise `pdfSettings` aux valeurs par défaut et persiste.
*   **Objet Retourné :** `{ pdfSettings, isLoading, updatePdfSettings, resetPdfSettings }`.
*   **Export :** `export const usePdfSettings = () => { ... };`

### 10. Dossier `src/services/` (Hors PDF)

Ce dossier contient les services de l'application qui encapsulent la logique métier et les interactions avec les sources de données externes, principalement Supabase, à l'exception des services liés à la génération PDF.

#### `src/services/autresSurfacesService.ts`

*   **Chemin :** `src/services/autresSurfacesService.ts`
*   **Rôle Précis :** Ce service est responsable de la gestion des données de référence pour les types d'autres surfaces (comme les dalles, chapes, murs non porteurs, etc.). Il interagit avec Supabase pour récupérer cette liste de référence.
*   **Imports Clés :**
    *   Type(s) lié(s) aux Autres Surfaces (ex: `AutreSurface` - potentiellement depuis `src/types/supabase.ts`)
    *   Client Supabase (`supabase` depuis `@/lib/supabase`)
*   **Fonctions Exportées :**

    *   **`fetchAutresSurfaces`**
        *   **Rôle Précis :** Récupère la liste de tous les types d'autres surfaces disponibles depuis Supabase.
        *   **Arguments :** Aucun.
        *   **Logique Principale :** Exécute une requête `select` sur la table des autres surfaces. Gère les erreurs potentielles.
        *   **Appels Supabase :**
            *   Table : `autres_surfaces` (probable).
            *   Opération : `select('*')`.
            *   Filtres : Aucun filtre standard (pourrait filtrer par `user_id` si spécifique).
            *   Modificateurs : Potentiellement `.order()`.
        *   **Valeur de Retour :** `Promise<AutreSurface[]>` - Un tableau contenant les types d'autres surfaces. Lance une erreur en cas d'échec.
        *   **Gestion des Erreurs Supabase :** Vérifie `error` retourné par Supabase. Log l'erreur. Lance (`throw error`) l'erreur pour être gérée par l'appelant (ex: dans le Contexte).

*   **Exports :**
    *   `fetchAutresSurfaces`

---

#### `src/services/clientsService.ts`

*   **Chemin :** `src/services/clientsService.ts`
*   **Rôle Précis :** Gère les opérations CRUD (Créer, Lire, Mettre à jour, Supprimer) pour les fiches clients dans la base de données Supabase.
*   **Imports Clés :**
    *   Type(s) lié(s) aux Clients (ex: `Client`, `ClientInsert`, `ClientUpdate` - potentiellement depuis `src/types/supabase.ts`)
    *   Client Supabase (`supabase` depuis `@/lib/supabase`)
*   **Fonctions Exportées :**

    *   **`fetchClients`**
        *   **Rôle Précis :** Récupère la liste de tous les clients appartenant à l'utilisateur authentifié.
        *   **Arguments :** Aucun.
        *   **Logique Principale :** Exécute une requête `select` sur la table `clients`. Gère les erreurs.
        *   **Appels Supabase :**
            *   Table : `clients`.
            *   Opération : `select('*')`.
            *   Filtres : `user_id = auth.uid()` (implicite via RLS).
            *   Modificateurs : Potentiellement `.order()`.
        *   **Valeur de Retour :** `Promise<Client[]>` - Un tableau des clients. Lance une erreur en cas d'échec.
        *   **Gestion des Erreurs Supabase :** Vérifie `error`, log, lance l'erreur.

    *   **`createClient`**
        *   **Rôle Précis :** Ajoute un nouveau client dans la table `clients`.
        *   **Arguments :** `clientData: ClientInsert` (Données du client à insérer, `user_id` est géré par RLS/défaut).
        *   **Logique Principale :** Exécute une requête `insert`. Gère les erreurs.
        *   **Appels Supabase :**
            *   Table : `clients`.
            *   Opération : `insert(clientData)`.
            *   Modificateurs : `.select().single()` (pour retourner le client créé).
        *   **Valeur de Retour :** `Promise<Client | null>` - L'objet client créé ou `null` en cas d'échec sans lancer. Lance une erreur en cas d'erreur Supabase.
        *   **Gestion des Erreurs Supabase :** Vérifie `error`, log, lance l'erreur.

    *   **`updateClient`**
        *   **Rôle Précis :** Met à jour les informations d'un client existant.
        *   **Arguments :** `clientId: string`, `updates: ClientUpdate` (ID et données à mettre à jour).
        *   **Logique Principale :** Exécute une requête `update` filtrée par `id`. Gère les erreurs.
        *   **Appels Supabase :**
            *   Table : `clients`.
            *   Opération : `update(updates)`.
            *   Filtres : `.eq('id', clientId)`. `user_id = auth.uid()` (implicite via RLS).
            *   Modificateurs : `.select().single()` (pour retourner le client mis à jour).
        *   **Valeur de Retour :** `Promise<Client | null>` - L'objet client mis à jour ou `null`. Lance une erreur en cas d'échec.
        *   **Gestion des Erreurs Supabase :** Vérifie `error`, log, lance l'erreur.

    *   **`deleteClient`**
        *   **Rôle Précis :** Supprime un client de la table `clients`.
        *   **Arguments :** `clientId: string`.
        *   **Logique Principale :** Exécute une requête `delete` filtrée par `id`. Gère les erreurs.
        *   **Appels Supabase :**
            *   Table : `clients`.
            *   Opération : `delete()`.
            *   Filtres : `.eq('id', clientId)`. `user_id = auth.uid()` (implicite via RLS).
        *   **Valeur de Retour :** `Promise<boolean>` - Indique le succès. Lance une erreur en cas d'échec.
        *   **Gestion des Erreurs Supabase :** Vérifie `error`, log, lance l'erreur.

*   **Exports :**
    *   `fetchClients`
    *   `createClient`
    *   `updateClient`
    *   `deleteClient`

---

#### `src/services/companiesService.ts`

*   **Chemin :** `src/services/companiesService.ts`
*   **Rôle Précis :** Gère les opérations CRUD pour les fiches sociétés (entreprises utilisatrices) dans Supabase.
*   **Imports Clés :**
    *   Type(s) lié(s) aux Sociétés (ex: `Company`, `CompanyInsert`, `CompanyUpdate`)
    *   Client Supabase (`supabase`)
*   **Fonctions Exportées :**

    *   **`fetchCompanies`**
        *   **Rôle Précis :** Récupère la liste des sociétés appartenant à l'utilisateur authentifié.
        *   **Arguments :** Aucun.
        *   **Logique Principale :** Exécute `select` sur `companies`.
        *   **Appels Supabase :**
            *   Table : `companies`.
            *   Opération : `select('*')`.
            *   Filtres : `user_id = auth.uid()` (implicite via RLS).
            *   Modificateurs : Potentiellement `.order()`.
        *   **Valeur de Retour :** `Promise<Company[]>` - Tableau des sociétés. Lance erreur si échec.
        *   **Gestion des Erreurs Supabase :** Vérifie `error`, log, lance l'erreur.

    *   **`createCompany`**
        *   **Rôle Précis :** Ajoute une nouvelle société.
        *   **Arguments :** `companyData: CompanyInsert`.
        *   **Logique Principale :** Exécute `insert` sur `companies`.
        *   **Appels Supabase :**
            *   Table : `companies`.
            *   Opération : `insert(companyData)`.
            *   Modificateurs : `.select().single()`.
        *   **Valeur de Retour :** `Promise<Company | null>` - Société créée ou `null`. Lance erreur si échec.
        *   **Gestion des Erreurs Supabase :** Vérifie `error`, log, lance l'erreur.

    *   **`updateCompany`**
        *   **Rôle Précis :** Met à jour une société existante.
        *   **Arguments :** `companyId: string`, `updates: CompanyUpdate`.
        *   **Logique Principale :** Exécute `update` sur `companies` filtré par `id`.
        *   **Appels Supabase :**
            *   Table : `companies`.
            *   Opération : `update(updates)`.
            *   Filtres : `.eq('id', companyId)`. `user_id = auth.uid()` (RLS).
            *   Modificateurs : `.select().single()`.
        *   **Valeur de Retour :** `Promise<Company | null>` - Société mise à jour ou `null`. Lance erreur si échec.
        *   **Gestion des Erreurs Supabase :** Vérifie `error`, log, lance l'erreur.

    *   **`deleteCompany`**
        *   **Rôle Précis :** Supprime une société.
        *   **Arguments :** `companyId: string`.
        *   **Logique Principale :** Exécute `delete` sur `companies` filtré par `id`.
        *   **Appels Supabase :**
            *   Table : `companies`.
            *   Opération : `delete()`.
            *   Filtres : `.eq('id', companyId)`. `user_id = auth.uid()` (RLS).
        *   **Valeur de Retour :** `Promise<boolean>` - Succès/échec. Lance erreur si échec.
        *   **Gestion des Erreurs Supabase :** Vérifie `error`, log, lance l'erreur.

*   **Exports :**
    *   `fetchCompanies`
    *   `createCompany`
    *   `updateCompany`
    *   `deleteCompany`

---

#### `src/services/devisService.ts`

*   **Chemin :** `src/services/devisService.ts`
*   **Rôle Précis :** **OBSOLÈTE PROBABLE.** Relique de l'ancienne méthode de génération PDF (pdfMake). Contenait potentiellement des fonctions pour formater les données projet pour l'ancien générateur ou déclencher l'ancienne génération.
*   **Imports Clés :** Inconnus (probablement liés à pdfMake ou anciens types).
*   **Fonctions Exportées :** Inconnues (potentiellement `generateDevisPdf`).
*   **Exports :** Inconnus.

---

#### `src/services/menuiseriesService.ts`

*   **Chemin :** `src/services/menuiseriesService.ts`
*   **Rôle Précis :** Gère les opérations CRUD pour les types de menuiseries de référence dans Supabase.
*   **Imports Clés :**
    *   Type(s) lié(s) aux Types de Menuiseries (ex: `MenuiserieType`, `MenuiserieTypeInsert`, `MenuiserieTypeUpdate`)
    *   Client Supabase (`supabase`)
*   **Fonctions Exportées :**

    *   **`fetchMenuiserieTypes`**
        *   **Rôle Précis :** Récupère la liste des types de menuiseries (globaux ou spécifiques à l'utilisateur).
        *   **Arguments :** Aucun.
        *   **Logique Principale :** Exécute `select` sur `menuiserie_types`.
        *   **Appels Supabase :**
            *   Table : `menuiserie_types`.
            *   Opération : `select('*')`.
            *   Filtres : `user_id IS NULL OR user_id = auth.uid()` (implicite via RLS probable).
            *   Modificateurs : Potentiellement `.order()`.
        *   **Valeur de Retour :** `Promise<MenuiserieType[]>` - Tableau des types. Lance erreur si échec.
        *   **Gestion des Erreurs Supabase :** Vérifie `error`, log, lance l'erreur.

    *   **`createMenuiserieType`**
        *   **Rôle Précis :** Ajoute un nouveau type de menuiserie.
        *   **Arguments :** `typeData: MenuiserieTypeInsert`.
        *   **Logique Principale :** Exécute `insert` sur `menuiserie_types`.
        *   **Appels Supabase :**
            *   Table : `menuiserie_types`.
            *   Opération : `insert(typeData)`.
            *   Modificateurs : `.select().single()`.
        *   **Valeur de Retour :** `Promise<MenuiserieType | null>` - Type créé ou `null`. Lance erreur si échec.
        *   **Gestion des Erreurs Supabase :** Vérifie `error`, log, lance l'erreur.

    *   **`updateMenuiserieType`**
        *   **Rôle Précis :** Met à jour un type de menuiserie existant.
        *   **Arguments :** `typeId: string`, `updates: MenuiserieTypeUpdate`.
        *   **Logique Principale :** Exécute `update` sur `menuiserie_types` filtré par `id`.
        *   **Appels Supabase :**
            *   Table : `menuiserie_types`.
            *   Opération : `update(updates)`.
            *   Filtres : `.eq('id', typeId)`. `user_id = auth.uid()` (RLS probable).
            *   Modificateurs : `.select().single()`.
        *   **Valeur de Retour :** `Promise<MenuiserieType | null>` - Type mis à jour ou `null`. Lance erreur si échec.
        *   **Gestion des Erreurs Supabase :** Vérifie `error`, log, lance l'erreur.

    *   **`deleteMenuiserieType`**
        *   **Rôle Précis :** Supprime un type de menuiserie.
        *   **Arguments :** `typeId: string`.
        *   **Logique Principale :** Exécute `delete` sur `menuiserie_types` filtré par `id`.
        *   **Appels Supabase :**
            *   Table : `menuiserie_types`.
            *   Opération : `delete()`.
            *   Filtres : `.eq('id', typeId)`. `user_id = auth.uid()` (RLS probable).
        *   **Valeur de Retour :** `Promise<boolean>` - Succès/échec. Lance erreur si échec.
        *   **Gestion des Erreurs Supabase :** Vérifie `error`, log, lance l'erreur.

*   **Exports :**
    *   `fetchMenuiserieTypes`
    *   `createMenuiserieType`
    *   `updateMenuiserieType`
    *   `deleteMenuiserieType`

---

#### `src/services/pdfGenerationService.ts`

*   **Chemin :** `src/services/pdfGenerationService.ts`
*   **Rôle Précis :** **OBSOLÈTE PROBABLE.** Relique de l'ancienne méthode PDF (pdfMake). Contenait probablement la logique de bas niveau ou l'intégration avec l'ancienne bibliothèque.
*   **Imports Clés :** Inconnus (probablement liés à pdfMake).
*   **Fonctions Exportées :** Inconnues (potentiellement `generatePdf`).
*   **Exports :** Inconnus.

---

#### `src/services/projectSaveService.ts`

*   **Chemin :** `src/services/projectSaveService.ts`
*   **Rôle Précis :** Gère la logique de sauvegarde (création/mise à jour via upsert), chargement et suppression de l'état complet du projet (`ProjectState`) dans la table `projects_save` de Supabase.
*   **Imports Clés :**
    *   Type `ProjectState`
    *   Client Supabase (`supabase`)
    *   Zod (pour la validation au chargement)
*   **Fonctions Exportées :**

    *   **`saveProject`**
        *   **Rôle Précis :** Sauvegarde (insère ou met à jour) l'état actuel du projet dans Supabase.
        *   **Arguments :** `projectState: ProjectState`.
        *   **Logique Principale :** Prépare les données (extrait `id`, `name`, `user_id`, et `project_data` JSONB). Utilise `upsert` pour insérer ou mettre à jour l'enregistrement dans `projects_save`. Gère les erreurs.
        *   **Appels Supabase :**
            *   Table : `projects_save`.
            *   Opération : `upsert({ id: projectState.id, user_id: auth.uid() /* obtenu avant */, name: projectState.metadata.nomProjet, project_data: projectState /* L'objet complet */ }, { onConflict: 'id' })`. (La gestion de `user_id` peut varier). Utilise `.select().single()` pour retourner l'enregistrement sauvegardé.
        *   **Valeur de Retour :** `Promise<ProjectSave | null>` (type Supabase pour la ligne `projects_save`). Lance erreur si échec.
        *   **Gestion des Erreurs Supabase :** Vérifie `error`, log, lance l'erreur.

    *   **`loadProject`**
        *   **Rôle Précis :** Charge un projet sauvegardé depuis Supabase par son ID.
        *   **Arguments :** `projectId: string`.
        *   **Logique Principale :** Sélectionne l'enregistrement dans `projects_save` par `id`. Valide les données `project_data` (JSONB) avec un schéma Zod `ProjectStateSchema`.
        *   **Appels Supabase :**
            *   Table : `projects_save`.
            *   Opération : `select('project_data, id, name, user_id')`.
            *   Filtres : `.eq('id', projectId)`. `user_id = auth.uid()` (RLS).
            *   Modificateurs : `.single()`.
        *   **Valeur de Retour :** `Promise<ProjectState | null>` - L'état du projet désérialisé et validé, ou `null` si non trouvé ou invalide. Lance erreur si échec Supabase.
        *   **Gestion des Erreurs Supabase :** Vérifie `error`, log, lance l'erreur. Gère aussi l'erreur de validation Zod.

    *   **`deleteProject`**
        *   **Rôle Précis :** Supprime un projet sauvegardé de Supabase.
        *   **Arguments :** `projectId: string`.
        *   **Logique Principale :** Exécute `delete` sur `projects_save` filtré par `id`.
        *   **Appels Supabase :**
            *   Table : `projects_save`.
            *   Opération : `delete()`.
            *   Filtres : `.eq('id', projectId)`. `user_id = auth.uid()` (RLS).
        *   **Valeur de Retour :** `Promise<boolean>` - Succès/échec. Lance erreur si échec.
        *   **Gestion des Erreurs Supabase :** Vérifie `error`, log, lance l'erreur.

*   **Exports :**
    *   `saveProject`
    *   `loadProject`
    *   `deleteProject`

---

#### `src/services/projectService.ts`

*   **Chemin :** `src/services/projectService.ts`
*   **Rôle Précis :** **RELIQUE/INCOMPLET PROBABLE.** Ce service semble peu utilisé ou incomplet dans l'état actuel. Il pourrait avoir contenu des fonctions utilitaires générales pour le projet qui sont maintenant dans `projectBaseService` ou `projectUtils`.
*   **Imports Clés :** Inconnus.
*   **Fonctions Exportées :** Inconnues ou non significatives dans le flux actuel.
*   **Exports :** Inconnus.

---

#### `src/services/travauxService.ts`

*   **Chemin :** `src/services/travauxService.ts`
*   **Rôle Précis :** Gère les opérations CRUD pour les données de référence du catalogue de travaux (types, groupes, services) dans Supabase.
*   **Imports Clés :**
    *   Types (ex: `WorkType`, `ServiceGroup`, `Service`)
    *   Client Supabase (`supabase`)
*   **Fonctions Exportées :**

    *   **`fetchWorkTypes`**
        *   **Rôle Précis :** Récupère les types de travaux.
        *   **Arguments :** Aucun.
        *   **Logique Principale :** `select` sur `work_types`.
        *   **Appels Supabase :** `select('*').order(...)` sur `work_types`. Filtre RLS probable.
        *   **Valeur de Retour :** `Promise<WorkType[]>`. Lance erreur.
        *   **Gestion Erreurs :** Vérifie, log, lance.
    *   **`createWorkType`**
        *   **Rôle Précis :** Ajoute un type de travaux.
        *   **Arguments :** `typeData: WorkTypeInsert`.
        *   **Logique Principale :** `insert` sur `work_types`.
        *   **Appels Supabase :** `insert(typeData).select().single()` sur `work_types`.
        *   **Valeur de Retour :** `Promise<WorkType | null>`. Lance erreur.
        *   **Gestion Erreurs :** Vérifie, log, lance.
    *   **`updateWorkType`**
        *   **Rôle Précis :** Met à jour un type de travaux.
        *   **Arguments :** `id: string`, `updates: WorkTypeUpdate`.
        *   **Logique Principale :** `update` sur `work_types`.
        *   **Appels Supabase :** `update(updates).eq('id', id).select().single()` sur `work_types`. Filtre RLS probable.
        *   **Valeur de Retour :** `Promise<WorkType | null>`. Lance erreur.
        *   **Gestion Erreurs :** Vérifie, log, lance.
    *   **`deleteWorkType`**
        *   **Rôle Précis :** Supprime un type de travaux.
        *   **Arguments :** `id: string`.
        *   **Logique Principale :** `delete` sur `work_types`.
        *   **Appels Supabase :** `delete().eq('id', id)` sur `work_types`. Filtre RLS probable.
        *   **Valeur de Retour :** `Promise<boolean>`. Lance erreur.
        *   **Gestion Erreurs :** Vérifie, log, lance.
    *   **`fetchServiceGroups`**
        *   **Rôle Précis :** Récupère les groupes pour un type de travaux.
        *   **Arguments :** `workTypeId: string`.
        *   **Logique Principale :** `select` sur `service_groups`.
        *   **Appels Supabase :** `select('*').eq('work_type_id', workTypeId).order(...)` sur `service_groups`. Filtre RLS probable.
        *   **Valeur de Retour :** `Promise<ServiceGroup[]>`. Lance erreur.
        *   **Gestion Erreurs :** Vérifie, log, lance.
    *   **`createServiceGroup`**
        *   **Rôle Précis :** Ajoute un groupe de services.
        *   **Arguments :** `groupData: ServiceGroupInsert`.
        *   **Logique Principale :** `insert` sur `service_groups`.
        *   **Appels Supabase :** `insert(groupData).select().single()` sur `service_groups`.
        *   **Valeur de Retour :** `Promise<ServiceGroup | null>`. Lance erreur.
        *   **Gestion Erreurs :** Vérifie, log, lance.
    *   **`updateServiceGroup`**
        *   **Rôle Précis :** Met à jour un groupe de services.
        *   **Arguments :** `id: string`, `updates: ServiceGroupUpdate`.
        *   **Logique Principale :** `update` sur `service_groups`.
        *   **Appels Supabase :** `update(updates).eq('id', id).select().single()` sur `service_groups`. Filtre RLS probable.
        *   **Valeur de Retour :** `Promise<ServiceGroup | null>`. Lance erreur.
        *   **Gestion Erreurs :** Vérifie, log, lance.
    *   **`deleteServiceGroup`**
        *   **Rôle Précis :** Supprime un groupe de services.
        *   **Arguments :** `id: string`.
        *   **Logique Principale :** `delete` sur `service_groups`.
        *   **Appels Supabase :** `delete().eq('id', id)` sur `service_groups`. Filtre RLS probable.
        *   **Valeur de Retour :** `Promise<boolean>`. Lance erreur.
        *   **Gestion Erreurs :** Vérifie, log, lance.
    *   **`fetchServices`**
        *   **Rôle Précis :** Récupère les services pour un groupe.
        *   **Arguments :** `groupId: string`.
        *   **Logique Principale :** `select` sur `services`.
        *   **Appels Supabase :** `select('*').eq('group_id', groupId).order(...)` sur `services`. Filtre RLS probable.
        *   **Valeur de Retour :** `Promise<Service[]>`. Lance erreur.
        *   **Gestion Erreurs :** Vérifie, log, lance.
    *   **`createService`**
        *   **Rôle Précis :** Ajoute un service.
        *   **Arguments :** `serviceData: ServiceInsert`.
        *   **Logique Principale :** `insert` sur `services`.
        *   **Appels Supabase :** `insert(serviceData).select().single()` sur `services`.
        *   **Valeur de Retour :** `Promise<Service | null>`. Lance erreur.
        *   **Gestion Erreurs :** Vérifie, log, lance.
    *   **`updateService`**
        *   **Rôle Précis :** Met à jour un service.
        *   **Arguments :** `id: string`, `updates: ServiceUpdate`.
        *   **Logique Principale :** `update` sur `services`.
        *   **Appels Supabase :** `update(updates).eq('id', id).select().single()` sur `services`. Filtre RLS probable.
        *   **Valeur de Retour :** `Promise<Service | null>`. Lance erreur.
        *   **Gestion Erreurs :** Vérifie, log, lance.
    *   **`deleteService`**
        *   **Rôle Précis :** Supprime un service.
        *   **Arguments :** `id: string`.
        *   **Logique Principale :** `delete` sur `services`.
        *   **Appels Supabase :** `delete().eq('id', id)` sur `services`. Filtre RLS probable.
        *   **Valeur de Retour :** `Promise<boolean>`. Lance erreur.
        *   **Gestion Erreurs :** Vérifie, log, lance.

*   **Exports :** Toutes les fonctions CRUD pour `work_types`, `service_groups`, `services`.

---

#### `src/services/project/index.ts`

*   **Chemin :** `src/services/project/index.ts`
*   **Rôle Précis :** Point d'exportation central (barrel file) pour les services et utilitaires du dossier `src/services/project/`.
*   **Imports Clés :** Importe les exports des autres fichiers `.ts` du dossier.
*   **Fonctions Exportées :** Aucune (fichier de réexportation).
*   **Exports :** Réexporte les éléments importés (ex: `projectBaseService`, `projectUtils`, `roomItemsService`, etc.).

---

#### `src/services/project/projectBaseService.ts`

*   **Chemin :** `src/services/project/projectBaseService.ts`
*   **Rôle Précis :** Contient des fonctions utilitaires de base pour manipuler l'objet `ProjectState` en mémoire.
*   **Imports Clés :** Types (`ProjectState`, etc.), `generateId`.
*   **Fonctions Exportées :**

    *   **`createEmptyProjectState`**
        *   **Rôle Précis :** Crée un objet `ProjectState` vide avec des valeurs par défaut.
        *   **Arguments :** Aucun.
        *   **Logique Principale :** Construit et retourne la structure `ProjectState` initiale.
        *   **Appels Supabase :** Aucun.
        *   **Valeur de Retour :** `ProjectState`.

*   **Exports :** `createEmptyProjectState`, potentiellement d'autres utilitaires.

---

#### `src/services/project/projectUtils.ts`

*   **Chemin :** `src/services/project/projectUtils.ts`
*   **Rôle Précis :** Contient des fonctions utilitaires pour effectuer des calculs ou des recherches sur l'état du projet.
*   **Imports Clés :** Types (`ProjectState`, `Room`, `Travail`).
*   **Fonctions Exportées :** (Exemples)

    *   **`calculateProjectTotals`**
        *   **Rôle Précis :** Calcule les totaux (HT, TVA, TTC) du projet.
        *   **Arguments :** `projectState: ProjectState`.
        *   **Logique Principale :** Itère sur `projectState.travaux` et agrège les coûts.
        *   **Appels Supabase :** Aucun.
        *   **Valeur de Retour :** `{ totalHT: number, totalTVA: number, totalTTC: number }`.
    *   **`findRoomById`**
        *   **Rôle Précis :** Trouve une pièce par ID dans `projectState`.
        *   **Arguments :** `projectState: ProjectState`, `roomId: string`.
        *   **Logique Principale :** Recherche dans `projectState.rooms`.
        *   **Appels Supabase :** Aucun.
        *   **Valeur de Retour :** `Room | undefined`.

*   **Exports :** Fonctions utilitaires de calcul et de recherche.

---

#### `src/services/project/roomItemsService.ts`

*   **Chemin :** `src/services/project/roomItemsService.ts`
*   **Rôle Précis :** Contient des fonctions utilitaires pour manipuler les listes de `MenuiserieItem` et `AutreSurfaceItem` *à l'intérieur* d'un objet `Room` en mémoire. Ne modifie pas directement l'état global.
*   **Imports Clés :** Types (`Room`, `MenuiserieItem`, `AutreSurfaceItem`), `generateId`.
*   **Fonctions Exportées :** (Exemples)

    *   **`addMenuiserieToRoom(room: Room, menuiserie: Omit<MenuiserieItem, 'id'>)`**
        *   **Rôle Précis :** Retourne une *nouvelle* copie de la pièce avec la menuiserie ajoutée.
        *   **Arguments :** Pièce existante, données de la nouvelle menuiserie.
        *   **Logique Principale :** Crée un nouvel ID, copie la pièce, ajoute la nouvelle menuiserie au tableau `menuiseries`.
        *   **Appels Supabase :** Aucun.
        *   **Valeur de Retour :** `Room` (nouvelle instance mise à jour).
    *   **`deleteMenuiserieFromRoom(room: Room, menuiserieId: string)`**
        *   **Rôle Précis :** Retourne une *nouvelle* copie de la pièce sans la menuiserie spécifiée.
        *   **Arguments :** Pièce existante, ID de la menuiserie à supprimer.
        *   **Logique Principale :** Copie la pièce, filtre le tableau `menuiseries`.
        *   **Appels Supabase :** Aucun.
        *   **Valeur de Retour :** `Room` (nouvelle instance mise à jour).
    *   **(Fonctions similaires pour `AutreSurfaceItem`)**

*   **Exports :** Fonctions utilitaires pour manipuler les items d'une pièce.

---

#### `src/services/project/roomWorksService.ts`

*   **Chemin :** `src/services/project/roomWorksService.ts`
*   **Rôle Précis :** Contient des fonctions utilitaires pour manipuler la liste globale des travaux (`travaux`) de l'état du projet, en se concentrant sur les opérations liées aux pièces (ex: filtrage). Ne modifie pas directement l'état global.
*   **Imports Clés :** Types (`ProjectState`, `Room`, `Travail`).
*   **Fonctions Exportées :**

    *   **`getTravauxForRoom(projectState: ProjectState, roomId: string)`**
        *   **Rôle Précis :** Filtre le tableau `projectState.travaux` pour une pièce donnée.
        *   **Arguments :** État du projet, ID de la pièce.
        *   **Logique Principale :** `projectState.travaux.filter(t => t.pieceId === roomId)`.
        *   **Appels Supabase :** Aucun.
        *   **Valeur de Retour :** `Travail[]`.

*   **Exports :** `getTravauxForRoom`, potentiellement d'autres utilitaires de filtrage/regroupement de travaux.

---

#### `src/services/project/roomsService.ts`

*   **Chemin :** `src/services/project/roomsService.ts`
*   **Rôle Précis :** Contient des fonctions utilitaires pour manipuler des objets `Room` en mémoire (ex: créer une nouvelle pièce vide). Ne modifie pas directement l'état global.
*   **Imports Clés :** Type `Room`, `generateId`.
*   **Fonctions Exportées :**

    *   **`createRoom(initialData: Partial<Omit<Room, 'id'>>)`**
        *   **Rôle Précis :** Crée un nouvel objet `Room` avec un ID et des valeurs par défaut/initiales.
        *   **Arguments :** Données initiales optionnelles (nom, dimensions).
        *   **Logique Principale :** Génère un ID, construit l'objet `Room` avec les valeurs fournies et des valeurs par défaut (tableaux vides pour menuiseries/autres surfaces).
        *   **Appels Supabase :** Aucun.
        *   **Valeur de Retour :** `Room`.

*   **Exports :** `createRoom`, potentiellement d'autres utilitaires liés à `Room`.


### 11. Dossier `src/lib/`

Ce dossier contient des fichiers utilitaires ou d'initialisation de bas niveau, notamment pour la connexion à Supabase et des fonctions utilitaires générales.

#### `src/lib/dimensions.ts`

*   **Chemin :** `src/lib/dimensions.ts`
*   **Rôle Précis :** Ce fichier définit probablement des constantes ou des types liés aux dimensions ou aux unités de mesure utilisées de manière globale dans l'application (ex: conversion cm/m, unités standard). *(Note: Le contenu exact n'a pas été détaillé dans nos échanges précédents, une analyse directe serait nécessaire pour plus de détails).*
*   **Imports Clés :** Inconnus.
*   **Exports Clés :** Constantes ou types liés aux dimensions/unités.
*   **Logique Principale :** Définition de constantes/types.
*   **Appels Supabase :** Aucun.
*   **Export :** Constantes ou types exportés.

---

#### `src/lib/supabase.ts`

*   **Chemin :** `src/lib/supabase.ts`
*   **Rôle Précis :** Initialise et exporte l'instance unique et configurée du client JavaScript Supabase (`supabase-js`). C'est le point d'accès centralisé pour toutes les interactions avec l'API Supabase (base de données, authentification, stockage).
*   **Imports Clés :**
    *   `createClient` (depuis `@supabase/supabase-js`)
    *   `Database` (type généré depuis `src/integrations/supabase/types.ts` pour typer le client)
*   **Exports Clés :** `supabase` (l'instance du client Supabase, typée avec `Database`).
*   **Logique Principale :**
    *   Récupère l'URL du projet Supabase (`SUPABASE_URL`) et la clé d'API anonyme (`SUPABASE_ANON_KEY`) depuis les variables d'environnement (via `import.meta.env.VITE_SUPABASE_URL` et `import.meta.env.VITE_SUPABASE_ANON_KEY` si Vite est utilisé).
    *   Appelle `createClient<Database>(supabaseUrl, supabaseAnonKey)` pour créer l'instance du client typée.
    *   Exporte cette instance unique (`supabase`).
*   **Appels Supabase :** Aucun appel direct n'est effectué ici. Seule l'initialisation a lieu.
*   **Export :** `supabase`.

---

#### `src/lib/utils.ts`

*   **Chemin :** `src/lib/utils.ts`
*   **Rôle Précis :** Fournit une fonction utilitaire (`cn`) pour fusionner et dédupliquer conditionnellement des classes CSS, en combinant les capacités de `clsx` et `tailwind-merge`. Très utilisé dans les composants UI pour gérer les classes dynamiques et les variantes.
*   **Imports Clés :**
    *   `type { ClassValue }`, `clsx` (depuis `clsx`)
    *   `twMerge` (depuis `tailwind-merge`)
*   **Exports Clés :** `cn` (la fonction utilitaire).
*   **Logique Principale :**
    *   La fonction `cn` prend un nombre variable d'arguments (`inputs`) qui peuvent être des chaînes de classes, des objets de classes conditionnelles, ou des tableaux.
    *   Elle passe ces `inputs` à `clsx` pour générer une chaîne de classes unique basée sur les conditions.
    *   Elle passe ensuite le résultat de `clsx` à `twMerge` pour résoudre les conflits de classes Tailwind CSS (ex: `p-2` et `p-4` -> `p-4`).
    *   Retourne la chaîne de classes finale, nettoyée et optimisée.
*   **Appels Supabase :** Aucun.
*   **Valeur de Retour :** `string` (la chaîne de classes CSS à appliquer).
*   **Export :** `cn`.


### 12. Dossier `src/types/` (et autres fichiers de types)

Cette section documente les définitions de types TypeScript utilisées à travers l'application pour garantir la cohérence et la robustesse du code. Les types générés par Supabase se trouvent généralement dans `src/integrations/supabase/types.ts`, tandis que les types spécifiques à l'application résident ici ou dans les dossiers `features`.

#### `src/types/index.ts`

*   **Chemin :** `src/types/index.ts`
*   **Rôle principal :** Point d'exportation central (barrel file) pour les principaux types métier de l'application, simplifiant les imports depuis d'autres modules.
*   **Interfaces/Types exportés :** Réexporte les types définis dans les autres fichiers de ce dossier.
*   **Exports :** Réexporte `Client`, `MenuiserieItem`, `TypeMenuiserie`, `ProjectState`, `ProjectMetadata`, `Property`, `Company`, `ProjectActions`, `Room`, `AutreSurfaceItem`, `SurfaceReference`, `Unite`, `Travail`.

---

#### `src/types/client.ts`

*   **Chemin :** `src/types/client.ts`
*   **Rôle principal :** Définit la structure de données pour un objet client et les types associés pour l'UI.
*   **Interfaces/Types exportés :**

    *   **`Client`**
        *   Représente les informations complètes d'un client.
        *   Propriétés :
            *   `id`: `string` - Identifiant unique du client.
            *   `nom`: `string` - Nom de famille ou nom de l'entreprise.
            *   `prenom`: `string` - Prénom du client.
            *   `type?`: `'particulier' | 'professionnel'` - Type de client.
            *   `adresse?`: `string` - Adresse postale.
            *   `codePostal?`: `string` - Code postal.
            *   `ville?`: `string` - Ville.
            *   `email?`: `string` - Adresse email.
            *   `telephone?`: `string` - Numéro de téléphone.
            *   `notes?`: `string` - Notes complémentaires.
            *   `numero_siret?`: `string` - Numéro SIRET pour les professionnels.
            *   `created_at?`: `string` - Date de création (format string probable).
            *   `user_id?`: `string` - ID de l'utilisateur Supabase associé.

    *   **`typesClients`**
        *   Représente un tableau de références pour les types de clients (utilisé dans les `Select`).
        *   Type : `{ id: string; label: string; }[]`
        *   Propriétés de l'objet dans le tableau :
            *   `id`: `string` - Identifiant interne ('particulier', 'professionnel').
            *   `label`: `string` - Libellé affiché ("Particulier", "Professionnel").

*   **Exports :** `Client`, `typesClients`.

---

#### `src/types/menuiserie.ts`

*   **Chemin :** `src/types/menuiserie.ts`
*   **Rôle principal :** Définit les types pour les menuiseries ajoutées aux pièces et les types de menuiseries de référence.
*   **Interfaces/Types exportés :**

    *   **`MenuiserieItem`**
        *   Représente une instance spécifique de menuiserie ajoutée à une pièce.
        *   Propriétés :
            *   `id`: `string` - Identifiant unique de cette instance.
            *   `typeId`: `string` - ID du `TypeMenuiserie` de référence.
            *   `hauteur`: `number` - Hauteur réelle de cette menuiserie (cm).
            *   `largeur`: `number` - Largeur réelle de cette menuiserie (cm).
            *   `description?`: `string` - Description personnalisée.
            *   `surfaceImpactee?`: `string` - ID de la surface impactée (ex: "Mur").

    *   **`TypeMenuiserie`**
        *   Représente un type de menuiserie de référence (catalogue).
        *   Propriétés :
            *   `id`: `string` - Identifiant unique du type de référence.
            *   `nom`: `string` - Nom du type (ex: "Fenêtre PVC 2 vantaux").
            *   `hauteur`: `number` - Hauteur par défaut (cm).
            *   `largeur`: `number` - Largeur par défaut (cm).
            *   `surfaceReference?`: `string` - ID de la surface impactée par défaut.
            *   `impactePlinthe`: `boolean` - Indique si impacte les plinthes par défaut.
            *   `description?`: `string` - Description du type.

    *   **`surfacesMenuiseries`**
        *   Représente un tableau de références pour les surfaces impactées par les menuiseries.
        *   Type : `{ id: string; label: string; }[]`
        *   Propriétés de l'objet dans le tableau :
            *   `id`: `string` - Identifiant interne (ex: "Mur", "Plafond", "Sol", "Aucune").
            *   `label`: `string` - Libellé affiché.

*   **Exports :** `MenuiserieItem`, `TypeMenuiserie`, `surfacesMenuiseries`.

---

#### `src/types/project.ts`

*   **Chemin :** `src/types/project.ts`
*   **Rôle principal :** Définit la structure de données complète de l'état d'un projet de devis et les types associés.
*   **Interfaces/Types exportés :**

    *   **`ProjectState`**
        *   Représente l'état complet d'un projet de devis.
        *   Propriétés :
            *   `id`: `string | null` - Identifiant unique du projet.
            *   `metadata`: `ProjectMetadata` - Métadonnées générales.
            *   `property`: `Property` - Informations sur le bien.
            *   `rooms`: `Room[]` - Tableau des pièces.
            *   `travaux`: `Travail[]` - Tableau de tous les travaux.
            *   `isDirty`: `boolean` - Indicateur de modifications non sauvegardées.

    *   **`ProjectMetadata`**
        *   Représente les informations générales et administratives du devis.
        *   Propriétés :
            *   `nomProjet`: `string` - Nom du projet/devis.
            *   `company`: `Company | null` - Société émettrice.
            *   `clientsData`: `Client[]` - Clients associés.
            *   `devisNumber`: `string | null` - Numéro du devis.
            *   `dateDevis`: `string | null` - Date du devis (format string).
            *   `adresseChantier`: `string | null` - Adresse du lieu des travaux.
            *   `occupant`: `string | null` - Informations sur l'occupant.
            *   `descriptionProjet`: `string | null` - Description générale du projet.
            *   `infoComplementaire`: `string | null` - Informations complémentaires.
            *   `logoUrl?`: `string | null` - URL du logo (redondant avec `company.logo_url` ?).
            *   `slogan?`: `string | null` - Slogan (redondant avec `company.slogan` ?).

    *   **`Property`**
        *   Représente les informations sur le bien immobilier.
        *   Propriétés :
            *   `typeBien`: `string | null` - Type de bien (Maison, Appartement...).
            *   `anneeConstruction`: `number | null` - Année de construction.
            *   `surfaceHabitable`: `number | null` - Surface habitable (m²).

    *   **`Company`**
        *   Représente les informations détaillées d'une société (identique à `src/types/client.ts` pour la partie Client, mais devrait être un type `Company` distinct basé sur la table Supabase).
        *   Propriétés : `id`, `name`, `type?`, `adresse?`, `codePostal?`, `ville?`, `email?`, `telephone?`, `numero_siret?`, `logo_url?`, `slogan?`, `created_at?`.

    *   **`ProjectActions`**
        *   Type union définissant toutes les actions possibles pour le `projectReducer`.
        *   Exemples d'actions (structure) :
            *   `{ type: 'LOAD_PROJECT'; payload: ProjectState; }`
            *   `{ type: 'UPDATE_METADATA'; payload: Partial<ProjectMetadata>; }`
            *   `{ type: 'UPDATE_PROPERTY'; payload: Partial<Property>; }`
            *   `{ type: 'ADD_ROOM'; payload: Room; }`
            *   `{ type: 'UPDATE_ROOM'; payload: { roomId: string; updates: Partial<Room> }; }`
            *   `{ type: 'DELETE_ROOM'; payload: string; }`
            *   `{ type: 'ADD_TRAVAIL'; payload: Travail; }`
            *   `{ type: 'UPDATE_TRAVAIL'; payload: { travailId: string; updates: Partial<Travail> }; }`
            *   `{ type: 'DELETE_TRAVAIL'; payload: string; }`
            *   `{ type: 'SET_DIRTY'; payload: boolean; }`
            *   `(Autres actions spécifiques...)`

*   **Exports :** `ProjectState`, `ProjectMetadata`, `Property`, `Company`, `ProjectActions`.

---

#### `src/types/room.ts`

*   **Chemin :** `src/types/room.ts`
*   **Rôle principal :** Définit la structure d'une pièce (`Room`) et des éléments qu'elle contient (`AutreSurfaceItem`).
*   **Interfaces/Types exportés :**

    *   **`Room`**
        *   Représente une pièce individuelle dans le projet.
        *   Propriétés :
            *   `id`: `string` - Identifiant unique de la pièce.
            *   `name`: `string` - Nom de la pièce.
            *   `surface`: `number` - Surface au sol (m²).
            *   `hauteur`: `number` - Hauteur sous plafond (m).
            *   `dimensions?`: `{ longueur: number; largeur: number; }` - Dimensions (m).
            *   `typeSol?`: `string` - Type de revêtement de sol.
            *   `typeMur?`: `string` - Type de revêtement mural.
            *   `typePlafond?`: `string` - Type de revêtement de plafond.
            *   `menuiseries`: `MenuiserieItem[]` - Tableau des menuiseries de cette pièce.
            *   `autresSurfaces`: `AutreSurfaceItem[]` - Tableau des autres surfaces de cette pièce.

    *   **`AutreSurfaceItem`**
        *   Représente une instance d'une "Autre Surface" ajoutée à une pièce.
        *   Propriétés :
            *   `id`: `string` - Identifiant unique de cette instance.
            *   `typeId`: `string` - ID du type d'autre surface de référence.
            *   `quantite`: `number` - Quantité (surface, longueur, unité...).
            *   `unite`: `string` - Unité de mesure (m², ml, u).
            *   `description?`: `string` - Description personnalisée.

*   **Exports :** `Room`, `AutreSurfaceItem`.

---

#### `src/types/supabase.ts`

*   **Chemin :** `src/types/supabase.ts`
*   **Rôle principal :** Point d'exportation (barrel file) pour les types générés par Supabase. Vise à simplifier les imports des types de base de données. **Note :** Le fichier contenant la définition réelle générée est `src/integrations/supabase/types.ts`. Ce fichier `src/types/supabase.ts` ne fait probablement que réexporter les types de l'autre fichier.
*   **Interfaces/Types exportés :** Réexporte les types depuis `src/integrations/supabase/types.ts`.
*   **Exports :** Réexporte `Database`, `Json`, `Tables`, `Enums`, et potentiellement les alias pour chaque table (Row/Insert).

---

#### `src/types/surface.ts`

*   **Chemin :** `src/types/surface.ts`
*   **Rôle principal :** Définit des types et constantes pour les concepts de surface et d'unités de mesure.
*   **Interfaces/Types exportés :**

    *   **`SurfaceReference`**
        *   Représente un type de surface de référence (utilisé pour les calculs, impacts).
        *   Type : `{ id: string; label: string; unit: string; }`
        *   Propriétés :
            *   `id`: `string` - Clé unique (ex: "murs", "plafonds").
            *   `label`: `string` - Libellé (ex: "Murs").
            *   `unit`: `string` - Unité (ex: "m²").

    *   **`surfacesReference`**
        *   Tableau de `SurfaceReference[]` contenant les définitions des surfaces communes.

    *   **`Unite`**
        *   Représente une unité de mesure possible.
        *   Type : `{ id: string; label: string; }`
        *   Propriétés :
            *   `id`: `string` - Clé unique (ex: "m2", "ml", "u").
            *   `label`: `string` - Libellé affiché (ex: "m²", "ml").

    *   **`unitesReference`**
        *   Tableau de `Unite[]` contenant les définitions des unités communes.

*   **Exports :** `SurfaceReference`, `surfacesReference`, `Unite`, `unitesReference`.

---

#### `src/types/travaux.ts`

*   **Chemin :** `src/types/travaux.ts`
*   **Rôle principal :** Définit la structure d'un travail individuel dans le projet et les types de référence associés.
*   **Interfaces/Types exportés :**

    *   **`Travail`**
        *   Représente une ligne de travail spécifique ajoutée à une pièce.
        *   Propriétés :
            *   `id`: `string` - Identifiant unique de ce travail.
            *   `pieceId`: `string` - ID de la pièce associée.
            *   `typeTravauxId`: `string` - ID du type de travaux de référence.
            *   `typeTravauxLabel`: `string` - Libellé du type de travaux.
            *   `sousTypeId`: `string` - ID de la prestation de référence.
            *   `sousTypeLabel`: `string` - Libellé de la prestation.
            *   `description`: `string` - Description détaillée du travail effectué.
            *   `quantite`: `number` - Quantité mesurée/estimée.
            *   `unite`: `string` - Unité de mesure (m², ml, u).
            *   `prixUnitaireHT`: `number` - Prix unitaire HT.
            *   `tauxTVA`: `number` - Taux de TVA (%).
            *   `surfaceImpactee?`: `string` - ID de la surface impactée.
            *   `laborPrice?`: `number` - Prix MO unitaire HT (si stocké).
            *   `supplyPrice?`: `number` - Prix Fournitures unitaire HT (si stocké).

    *   **`TravauxTypeReference`**
        *   Représente un type de travaux de référence (catalogue).
        *   Propriétés : `id`, `label`, `description?`, `icon?`, `sousTypes: SousTypeTravauxItemReference[]`.

    *   **`SousTypeTravauxItemReference`**
        *   Représente une prestation de référence (catalogue).
        *   Propriétés : `id`, `typeTravauxId`, `label`, `description?`, `unite`, `prixUnitaire` (ou `laborPrice`/`supplyPrice`), `tauxTVA`.

*   **Exports :** `Travail`, `TravauxTypeReference`, `SousTypeTravauxItemReference`.

---

#### `src/integrations/supabase/types.ts`

*   **Chemin :** `src/integrations/supabase/types.ts`
*   **Rôle principal :** **Fichier source principal des types Supabase.** Contient les définitions de types générées automatiquement par `supabase gen types typescript` à partir du schéma de la base de données. C'est la référence pour la structure des données échangées avec Supabase.
*   **Interfaces/Types exportés :**

    *   **`Json`** : Type utilitaire pour `json` et `jsonb`.
    *   **`Database`** : Type principal décrivant toute la base de données.
        *   `public`: Objet décrivant le schéma `public`.
            *   `Tables`: Objet contenant une entrée pour chaque table (`clients`, `companies`, `work_types`, `service_groups`, `services`, `menuiserie_types`, `autres_surfaces`, `projects_save`, `app_state`).
                *   Chaque entrée de table contient :
                    *   `Row`: Type représentant une ligne lue.
                    *   `Insert`: Type représentant les données pour une insertion.
                    *   `Update`: Type représentant les données pour une mise à jour.
            *   `Views`: Objet décrivant les vues (si existantes).
            *   `Functions`: Objet décrivant les fonctions RPC (si existantes).
            *   `Enums`: Objet décrivant les types Enum (si existants).
            *   `CompositeTypes`: Objet décrivant les types composites (si existants).

*   **Exports :** `Json`, `Database`. (Les alias comme `Clients`, `Companies` sont souvent faits dans `src/types/supabase.ts` ou directement lors de l'utilisation).

---

#### `src/services/pdf/config/pdfSettingsTypes.ts`

*   **Chemin :** `src/services/pdf/config/pdfSettingsTypes.ts`
*   **Rôle principal :** Définit les types TypeScript et les schémas Zod pour la structure des paramètres de configuration du PDF.
*   **Interfaces/Types exportés :**
    *   **`PdfElementId`**: Type union des identifiants d'éléments stylisables (ex: `'PageHeader'`, `'SectionTitle'`).
    *   **`ElementSettings`**: Interface des propriétés de style configurables (fontSize, textColor, margin, padding, etc.).
    *   **`MarginSettings`**: Interface pour les marges de page (top, right, bottom, left).
    *   **`ColorSettings`**: Interface pour la palette de couleurs (primary, secondary, etc.).
    *   **`LogoSettings`**: Interface pour les paramètres du logo (height, width, etc.).
    *   **`PdfSettings`**: Interface globale regroupant tous les paramètres.
    *   **`PdfSettingsSchema`**: Schéma Zod pour la validation de `PdfSettings`.
*   **Exports :** `PdfElementId`, `ElementSettings`, `MarginSettings`, `ColorSettings`, `LogoSettings`, `PdfSettings`, `PdfSettingsSchema`.

---

#### `src/features/devis/components/pdf-settings/types/elementSettings.ts`

*   **Chemin :** `src/features/devis/components/pdf-settings/types/elementSettings.ts`
*   **Rôle principal :** **REDUNDANCE PROBABLE.** Définit le type `ElementSettings`. Il est probable que ce fichier soit redondant avec `src/services/pdf/config/pdfSettingsTypes.ts`. La définition unique devrait idéalement se trouver dans le fichier de configuration et être importée ici.
*   **Interfaces/Types exportés :** `ElementSettings`.
*   **Exports :** `ElementSettings`.

---

#### `src/features/devis/components/pdf-settings/types/typography.ts`

*   **Chemin :** `src/features/devis/components/pdf-settings/types/typography.ts`
*   **Rôle principal :** Définit les identifiants des éléments PDF stylisables (`PdfElementId`) et les constantes (`PDF_ELEMENTS`, `PDF_ELEMENT_SECTIONS`) utilisées pour construire l'interface de configuration des styles dans `pdf-settings`.
*   **Interfaces/Types exportés :**
    *   **`PdfElementId`**: Type union des identifiants (ex: `'PageHeader'`, `'QuoteInfoLabel'`, etc.).
    *   **`PdfElementMetadata`**: Interface décrivant les métadonnées d'un élément pour l'UI (label, section, description, type de style applicable).
*   **Constantes Exportées :**
    *   **`PDF_ELEMENTS`**: Un objet ou tableau mappant chaque `PdfElementId` à ses `PdfElementMetadata`.
    *   **`PDF_ELEMENT_SECTIONS`**: Un objet ou tableau définissant les sections pour regrouper les éléments dans l'UI.
*   **Exports :** `PdfElementId`, `PDF_ELEMENTS`, `PDF_ELEMENT_SECTIONS`.


### 13. Dossier `src/features/`

Ce dossier contient le code spécifique à chaque fonctionnalité majeure de l'application, organisée par sous-dossiers. Chaque sous-dossier peut contenir ses propres composants, hooks, types, etc.

#### `src/features/admin/components/`

Ce sous-dossier contient les composants UI spécifiques à la section d'administration (gestion des données de référence comme les clients, sociétés, types de travaux, etc.).

##### `src/features/admin/components/ClientForm.tsx`

*   **Chemin :** `src/features/admin/components/ClientForm.tsx`
*   **Rôle Précis :** Affiche un formulaire pour créer ou modifier une fiche client. Utilisé dans une modale sur la page d'administration des clients (`src/pages/Parametres.tsx`, onglet Clients).
*   **Imports Clés :** Composants UI (`DialogHeader`, `DialogTitle`, ... `Button`, `Select`, ...), Hooks (`useForm`), Types (`Client`), Validation (Zod).
*   **Props :** `clientToEdit: Client | null`, `onClose: () => void`, `onSubmit: (clientData: Client) => void`.
*   **États Locaux (`useState`) :** Géré par `react-hook-form`.
*   **Effets (`useEffect`) :** Remplit le formulaire avec `clientToEdit` en mode édition.
*   **Fonctions Internes / Gestionnaires d'Événements :** `handleSubmit` (appelle `onSubmit`).
*   **Structure JSX :** Formulaire dans une modale avec champs pour nom, prénom, type, adresse, etc. Utilise `Input`, `Select`.
*   **Interactions :** Saisie/validation des infos client.
*   **Export :** `export default ClientForm;`

##### `src/features/admin/components/CompanyForm.tsx`

*   **Chemin :** `src/features/admin/components/CompanyForm.tsx`
*   **Rôle Précis :** Affiche un formulaire pour créer ou modifier une fiche société. Utilisé dans une modale sur la page d'administration des sociétés (`src/pages/Parametres.tsx`, onglet Sociétés).
*   **Imports Clés :** Composants UI (`DialogHeader`, ... `Button`, `Textarea`, `Select`, ...), Hooks (`useForm`), Types (`Company`), Validation (Zod).
*   **Props :** `companyToEdit: Company | null`, `onClose: () => void`, `onSubmit: (companyData: Company) => void`.
*   **États Locaux (`useState`) :** Géré par `react-hook-form`.
*   **Effets (`useEffect`) :** Remplit le formulaire avec `companyToEdit` en mode édition.
*   **Fonctions Internes / Gestionnaires d'Événements :** `handleSubmit` (appelle `onSubmit`).
*   **Structure JSX :** Formulaire dans une modale avec champs pour nom, siret, adresse, logo, etc. Utilise `Input`, `Textarea`, `Select`.
*   **Interactions :** Saisie/validation des infos société.
*   **Export :** `export default CompanyForm;`

##### `src/features/admin/components/SousTypeTravauxForm.tsx`

*   **Chemin :** `src/features/admin/components/SousTypeTravauxForm.tsx`
*   **Rôle Précis :** Affiche un formulaire pour créer ou modifier une prestation (sous-type de travaux). Utilisé dans une modale sur la page `AdminTravaux.tsx`.
*   **Imports Clés :** Composants UI (`DialogContent`, ... `Input`, `Button`, `Select`, ...), Hooks (`useForm`), Types (`SousTypeTravauxItem`), Validation (Zod).
*   **Props :** `isOpen: boolean`, `onClose: () => void`, `sousTypeToEdit: SousTypeTravauxItem | null`, `onSubmit: (sousTypeData: Omit<SousTypeTravauxItem, 'id' | 'typeTravauxId'>) => void`.
*   **États Locaux (`useState`) :** Géré par `react-hook-form`.
*   **Effets (`useEffect`) :** Remplit le formulaire avec `sousTypeToEdit` en mode édition.
*   **Fonctions Internes / Gestionnaires d'Événements :** `handleSubmit` (appelle `onSubmit`).
*   **Structure JSX :** Formulaire dans une modale avec champs pour label, prix MO, prix fournitures, unité, TVA. Utilise `Input`, `Select`.
*   **Interactions :** Saisie/validation des infos prestation.
*   **Export :** `export default SousTypeTravauxForm;`

##### `src/features/admin/components/TypeMenuiserieForm.tsx`

*   **Chemin :** `src/features/admin/components/TypeMenuiserieForm.tsx`
*   **Rôle Précis :** Affiche un formulaire pour créer ou modifier un type de menuiserie de référence. Utilisé dans une modale sur la page `Parametres.tsx`, onglet Menuiseries.
*   **Imports Clés :** Composants UI (`DialogContent`, ... `Input`, `Button`, `Select`, `Textarea`, ...), Hooks (`useForm`), Types (`TypeMenuiserie`), Validation (Zod).
*   **Props :** `isOpen: boolean`, `onClose: () => void`, `typeToEdit: TypeMenuiserie | null`, `onSubmit: (typeData: Omit<TypeMenuiserie, 'id'>) => void`.
*   **États Locaux (`useState`) :** Géré par `react-hook-form`.
*   **Effets (`useEffect`) :** Remplit le formulaire avec `typeToEdit` en mode édition.
*   **Fonctions Internes / Gestionnaires d'Événements :** `handleSubmit` (appelle `onSubmit`).
*   **Structure JSX :** Formulaire dans une modale avec champs pour nom, hauteur, largeur, surface impactée, impacte plinthe, description. Utilise `Input`, `Select`, `Textarea`.
*   **Interactions :** Saisie/validation des infos type menuiserie.
*   **Export :** `export default TypeMenuiserieForm;`

##### `src/features/admin/components/TypeTravauxForm.tsx`

*   **Chemin :** `src/features/admin/components/TypeTravauxForm.tsx`
*   **Rôle Précis :** Affiche un formulaire pour créer ou modifier un type de travaux (catégorie principale). Utilisé dans une modale sur la page `AdminTravaux.tsx`.
*   **Imports Clés :** Composants UI (`DialogContent`, ... `Input`, `Button`), Hooks (`useForm`), Types (`TravauxType`), Validation (Zod).
*   **Props :** `isOpen: boolean`, `onClose: () => void`, `typeToEdit: TravauxType | null`, `onSubmit: (typeData: Omit<TravauxType, 'id' | 'sousTypes'>) => void`.
*   **États Locaux (`useState`) :** Géré par `react-hook-form`.
*   **Effets (`useEffect`) :** Remplit le formulaire avec `typeToEdit` en mode édition.
*   **Fonctions Internes / Gestionnaires d'Événements :** `handleSubmit` (appelle `onSubmit`).
*   **Structure JSX :** Formulaire dans une modale avec champs pour nom, description, icône. Utilise `Input`.
*   **Interactions :** Saisie/validation des infos type travaux.
*   **Export :** `export default TypeTravauxForm;`

---

#### `src/features/chantier/components/`

Ce sous-dossier contient les composants UI spécifiques à la gestion des informations du chantier et du projet (page `InfosChantier.tsx`).

##### `src/features/chantier/components/ClientDetails.tsx`

*   **Chemin :** `src/features/chantier/components/ClientDetails.tsx`
*   **Rôle Précis :** Affiche les informations détaillées d'un client spécifique.
*   **Imports Clés :** Composants UI (`Card`, ...), Types (`Client`), Icônes.
*   **Props :** `client: Client | null`, `isLoading?: boolean`.
*   **États Locaux (`useState`) :** Aucun.
*   **Effets (`useEffect`) :** Aucun.
*   **Fonctions Internes / Gestionnaires d'Événements :** Aucun (affichage seul).
*   **Structure JSX :** `Card` affichant nom, prénom, adresse, etc. du client. Gère `isLoading` et `client === null`.
*   **Export :** `export const ClientDetails = (...) => { ... };`

##### `src/features/chantier/components/CompanyDetails.tsx`

*   **Chemin :** `src/features/chantier/components/CompanyDetails.tsx`
*   **Rôle Précis :** Affiche les informations détaillées de l'entreprise émettrice.
*   **Imports Clés :** Composants UI (`Card`, ...), Types (`Company`), Icônes.
*   **Props :** `company: Company | null`, `isLoading?: boolean`.
*   **États Locaux (`useState`) :** Aucun.
*   **Effets (`useEffect`) :** Aucun.
*   **Fonctions Internes / Gestionnaires d'Événements :** Aucun (affichage seul).
*   **Structure JSX :** `Card` affichant nom, adresse, email, etc. de la société. Gère `isLoading` et `company === null`.
*   **Export :** `export const CompanyDetails = (...) => { ... };`

##### `src/features/chantier/components/InfosChantierLayout.tsx`

*   **Chemin :** `src/features/chantier/components/InfosChantierLayout.tsx`
*   **Rôle Précis :** Layout principal de la page `InfosChantier.tsx`. Organise les sections (Projet, Bien, Pièces, Client, Société) et distribue les données et fonctions reçues de la page parente aux composants enfants.
*   **Imports Clés :** Composants UI (`Card`, `Tabs`, ...), Composants enfants (`ProjectForm`, `PropertyForm`, `RoomsCard`, `ClientDetails`, `CompanyDetails`, ...), Hooks (`useState`), Types.
*   **Props :** Reçoit une grande partie des retours de `useProjectInfo` (state, setters, handlers) et `companyId`/`setCompanyId`.
*   **États Locaux (`useState`) :** Potentiellement pour gérer l'onglet actif ou l'état de modales locales.
*   **Effets (`useEffect`) :** Potentiels effets de synchronisation mineurs.
*   **Fonctions Internes / Gestionnaires d'Événements :** Gère la structure et passe les props.
*   **Structure JSX :** Organise les composants enfants (`ProjectForm`, `PropertyForm`, `RoomsCard`, etc.) dans une structure de page (potentiellement avec `Tabs`).
*   **Interactions :** Intermédiaire entre la page `InfosChantier` et les composants de formulaire/affichage spécifiques.
*   **Export :** `export const InfosChantierLayout = (...) => { ... };`

##### `src/features/chantier/components/ProjectForm.tsx`

*   **Chemin :** `src/features/chantier/components/ProjectForm.tsx`
*   **Rôle Précis :** Formulaire principal ou conteneur de formulaires pour les métadonnées du projet (nom, numéro/date devis, client, société, adresse, description).
*   **Imports Clés :** Composants UI (`Card`, `Form`, ...), Sous-composants (`DevisInfoForm`, `ClientSelection`, `CompanySelection`, ...), Hooks (`useForm`, `useProjectMetadata`), Validation (Zod), Types (`ProjectMetadata`).
*   **Props :** `projectMetadata: ProjectMetadata`, `onUpdateMetadata: (updates: Partial<ProjectMetadata>) => void`, `clients: Client[]`, `companies: Company[]`.
*   **États Locaux (`useState`) :** Géré par `react-hook-form`.
*   **Effets (`useEffect`) :** Initialise/réinitialise le formulaire avec `projectMetadata`.
*   **Fonctions Internes / Gestionnaires d'Événements :** `handleSubmit`, gestionnaires de changement délégués aux sous-composants ou gérés par `react-hook-form`. Appelle `onUpdateMetadata`.
*   **Structure JSX :** Organise les sous-composants de formulaire (`ClientSelection`, `DevisInfoForm`, etc.).
*   **Interactions :** Collecte les saisies utilisateur pour les métadonnées et déclenche la mise à jour via `onUpdateMetadata`.
*   **Export :** `export const ProjectForm = (...) => { ... };`

##### `src/features/chantier/components/ProjectList.tsx`

*   **Chemin :** `src/features/chantier/components/ProjectList.tsx`
*   **Rôle Précis :** Affiche une liste des projets sauvegardés, typiquement dans la modale "Ouvrir Projet".
*   **Imports Clés :** Composants UI (`Card`, `Table`, `Button`, `Input`), Types, Icônes.
*   **Props :** `projects: ProjectState[]`, `onSelectProject: (projectId: string) => void`, `onDeleteProject?: (projectId: string) => void`, `isLoading?: boolean`, `currentProjectId?: string | null`.
*   **États Locaux (`useState`) :** Potentiellement pour la recherche/filtrage.
*   **Effets (`useEffect`) :** Potentiellement pour le filtrage.
*   **Fonctions Internes / Gestionnaires d'Événements :** Gestion de la recherche, `onClick` pour sélection (appelle `onSelectProject`), `onClick` pour suppression (appelle `onDeleteProject`).
*   **Structure JSX :** Champ de recherche (optionnel), `Table` listant les projets avec nom, date, boutons d'action.
*   **Interactions :** Permet de visualiser, rechercher, sélectionner et supprimer des projets.
*   **Export :** `export const ProjectList = (...) => { ... };`

##### `src/features/chantier/components/ProjectSummary.tsx`

*   **Chemin :** `src/features/chantier/components/ProjectSummary.tsx`
*   **Rôle Précis :** Affiche un résumé non modifiable des informations clés du projet.
*   **Imports Clés :** Composants UI (`Card`, ...), Types (`ProjectMetadata`), Utilitaires.
*   **Props :** `projectMetadata: ProjectMetadata | null`, `isLoading?: boolean`.
*   **États Locaux (`useState`) :** Aucun.
*   **Effets (`useEffect`) :** Aucun.
*   **Fonctions Internes / Gestionnaires d'Événements :** Aucun.
*   **Structure JSX :** `Card` affichant nom projet, client, société, date, etc. sous forme de paires clé-valeur.
*   **Export :** `export const ProjectSummary = (...) => { ... };`

##### `src/features/chantier/components/project-form/ClientSelection.tsx`

*   **Chemin :** `src/features/chantier/components/project-form/ClientSelection.tsx`
*   **Rôle Précis :** Champ de formulaire pour sélectionner un client existant.
*   **Imports Clés :** Composants UI (`FormField`, `Select`, ...), Hooks (`useClients`, `useFormContext`), Types (`Client`), `ClientForm`.
*   **Props :** `clients: Client[]`, `value: string | undefined`, `onChange: (clientId: string | undefined) => void`, (Props `react-hook-form`).
*   **États Locaux (`useState`) :** Potentiellement pour la modale d'ajout.
*   **Fonctions Internes / Gestionnaires d'Événements :** `onValueChange` du `Select` appelle `onChange`. Ouvre modale `ClientForm`.
*   **Structure JSX :** `FormField` avec `Select` listant les `clients`. Bouton "Ajouter".
*   **Interactions :** Sélection d'un client, potentiellement ajout via modale.
*   **Export :** `export const ClientSelection = (...) => { ... };`

##### `src/features/chantier/components/project-form/ClientsDataField.tsx`

*   **Chemin :** `src/features/chantier/components/project-form/ClientsDataField.tsx`
*   **Rôle Précis :** Champ de formulaire pour lier la sélection d'un client aux données complètes (`clientsData`) dans les métadonnées du projet.
*   **Imports Clés :** Similaire à `ClientSelection`, `useProjectMetadata` ou `useProject`.
*   **Props :** `clients: Client[]`, `value: Client[] | null | undefined`, `onChange: (newClientsData: Client[] | null) => void`, (Props `react-hook-form`).
*   **États Locaux (`useState`) :** Potentiellement pour l'ID sélectionné en interne.
*   **Effets (`useEffect`) :** Synchronisation entre l'ID sélectionné et `value`.
*   **Fonctions Internes / Gestionnaires d'Événements :** Trouve l'objet `Client` complet basé sur la sélection et appelle `onChange` avec le tableau contenant cet objet.
*   **Structure JSX :** `FormField` avec contrôle de sélection de client.
*   **Interactions :** Sélection client, met à jour `projectState.metadata.clientsData`.
*   **Export :** `export const ClientsDataField = (...) => { ... };`

##### `src/features/chantier/components/project-form/CompanySelection.tsx`

*   **Chemin :** `src/features/chantier/components/project-form/CompanySelection.tsx`
*   **Rôle Précis :** Champ de formulaire pour sélectionner l'entreprise émettrice.
*   **Imports Clés :** Composants UI (`FormField`, `Select`, ...), Hooks, Types (`Company`), `CompanyForm`.
*   **Props :** `companies: Company[]`, `value: string | undefined`, `onChange: (companyId: string | undefined) => void`, (Props `react-hook-form`).
*   **États Locaux (`useState`) :** Potentiellement pour la modale d'ajout.
*   **Fonctions Internes / Gestionnaires d'Événements :** `onValueChange` du `Select` appelle `onChange`. Ouvre modale `CompanyForm`.
*   **Structure JSX :** `FormField` avec `Select` listant les `companies`. Bouton "Ajouter".
*   **Interactions :** Sélection d'une société, potentiellement ajout via modale.
*   **Export :** `export const CompanySelection = (...) => { ... };`

##### `src/features/chantier/components/project-form/DevisInfoForm.tsx`

*   **Chemin :** `src/features/chantier/components/project-form/DevisInfoForm.tsx`
*   **Rôle Précis :** Champ de formulaire pour le numéro et la date du devis.
*   **Imports Clés :** Composants UI (`FormField`, `Input`, `Calendar`, `Popover`, ...), Hooks (`useFormContext`), Utilitaires date.
*   **Props :** `value: { devisNumber: string | null, dateDevis: string | null }`, `onChange: (updates: { ... }) => void`, (Props `react-hook-form`).
*   **États Locaux (`useState`) :** Potentiellement pour le `Popover` du calendrier.
*   **Fonctions Internes / Gestionnaires d'Événements :** `onChange` pour l'`Input` et le `Calendar` appelle la prop `onChange`.
*   **Structure JSX :** `FormField` pour numéro (`Input`) et date (`Input` + `Calendar` dans `Popover`).
*   **Interactions :** Saisie numéro, sélection date.
*   **Export :** `export const DevisInfoForm = (...) => { ... };`

##### `src/features/chantier/components/project-form/ProjectActionButtons.tsx`

*   **Chemin :** `src/features/chantier/components/project-form/ProjectActionButtons.tsx`
*   **Rôle Précis :** Affiche les boutons d'action globaux (Enregistrer, Enregistrer Sous, Supprimer).
*   **Imports Clés :** Composants UI (`Button`, `Tooltip`), Hooks (`useAppState`, `useProject`), Icônes.
*   **Props :** `onSave`, `onSaveAs`, `onDelete` (fonctions), `isSaving?`, `isDeleting?`, `hasUnsavedChanges?`, `currentProjectId?` (booléens/string).
*   **États Locaux (`useState`) :** Aucun.
*   **Effets (`useEffect`) :** Aucun.
*   **Fonctions Internes / Gestionnaires d'Événements :** `onClick` pour chaque bouton appelle la prop correspondante.
*   **Structure JSX :** Groupe de `Button` avec icônes et `Tooltip`. Désactivation conditionnelle.
*   **Interactions :** Déclenche les actions de sauvegarde/suppression.
*   **Export :** `export const ProjectActionButtons = (...) => { ... };`

##### `src/features/chantier/components/project-form/ProjectAddressFields.tsx`

*   **Chemin :** `src/features/chantier/components/project-form/ProjectAddressFields.tsx`
*   **Rôle Précis :** Champ de formulaire pour l'adresse du chantier et l'occupant.
*   **Imports Clés :** Composants UI (`FormField`, `Textarea`, `Input`, ...), Hooks (`useFormContext`).
*   **Props :** `value: { adresseChantier: string | null, occupant: string | null }`, `onChange: (updates: { ... }) => void`, (Props `react-hook-form`).
*   **États Locaux (`useState`) :** Aucun.
*   **Effets (`useEffect`) :** Aucun.
*   **Fonctions Internes / Gestionnaires d'Événements :** `onChange` pour `Textarea`/`Input` appelle la prop `onChange`.
*   **Structure JSX :** `FormField` pour adresse (`Textarea`) et occupant (`Input`/`Textarea`).
*   **Interactions :** Saisie adresse/occupant.
*   **Export :** `export const ProjectAddressFields = (...) => { ... };`

##### `src/features/chantier/components/project-form/ProjectDescriptionField.tsx`

*   **Chemin :** `src/features/chantier/components/project-form/ProjectDescriptionField.tsx`
*   **Rôle Précis :** Champ de formulaire pour la description du projet et les infos complémentaires.
*   **Imports Clés :** Composants UI (`FormField`, `Textarea`, ...), Hooks (`useFormContext`).
*   **Props :** `value: { descriptionProjet: string | null, infoComplementaire: string | null }`, `onChange: (updates: { ... }) => void`, (Props `react-hook-form`).
*   **États Locaux (`useState`) :** Aucun.
*   **Effets (`useEffect`) :** Aucun.
*   **Fonctions Internes / Gestionnaires d'Événements :** `onChange` pour `Textarea` appelle la prop `onChange`.
*   **Structure JSX :** `FormField` pour description et infos complémentaires (`Textarea`).
*   **Interactions :** Saisie descriptions.
*   **Export :** `export const ProjectDescriptionField = (...) => { ... };`

##### `src/features/chantier/components/project-form/ProjectNameField.tsx`

*   **Chemin :** `src/features/chantier/components/project-form/ProjectNameField.tsx`
*   **Rôle Précis :** Champ de formulaire pour le nom du projet, avec option de génération automatique.
*   **Imports Clés :** Composants UI (`FormField`, `Input`, `Button`, ...), Hooks (`useFormContext`), Icônes (`RefreshCw`).
*   **Props :** `value: string`, `onChange: (newName: string) => void`, `onGenerateName?: () => void`, `shouldShowGenerateButton?: boolean`, (Props `react-hook-form`).
*   **États Locaux (`useState`) :** Aucun.
*   **Effets (`useEffect`) :** Aucun.
*   **Fonctions Internes / Gestionnaires d'Événements :** `onChange` pour `Input` appelle `onChange`. `onClick` pour bouton génération appelle `onGenerateName`.
*   **Structure JSX :** `FormField` avec `Input` pour le nom. Bouton de génération conditionnel.
*   **Interactions :** Saisie/génération nom projet.
*   **Export :** `export const ProjectNameField = (...) => { ... };`

---

#### `src/features/devis/components/` (Hors `pdf-settings/`)

Ce sous-dossier contient les composants UI spécifiques à la page d'édition et de prévisualisation du devis (`EditionDevis.tsx`), hors composants de configuration des paramètres PDF.

##### `src/features/devis/components/DevisCoverPreview.tsx`

*   **Chemin :** `src/features/devis/components/DevisCoverPreview.tsx`
*   **Rôle Précis :** Affiche un aperçu visuel de la page de couverture du devis en utilisant les composants React-PDF.
*   **Imports Clés :** `@react-pdf/renderer` (`Document`, `Page`, ...), Composants PDF (`CoverDocumentContent`, ...), Hooks (`useProject`, `usePdfSettings`), Types, Utilitaires PDF (`getPdfStyles`).
*   **Props :** `pdfSettings: PdfSettings`, `projectState: ProjectState`.
*   **États Locaux (`useState`) :** Aucun.
*   **Effets (`useEffect`) :** Potentiellement pour `Font.register`.
*   **Fonctions Internes / Gestionnaires d'Événements :** Aucun (rendu JSX).
*   **Structure JSX :** Rend `<Document>` -> `<Page>` -> `<CoverDocumentContent />` (avec props).
*   **Interactions :** Affichage de l'aperçu.
*   **Export :** `export const DevisCoverPreview = (...) => { ... };`

##### `src/features/devis/components/DevisDetailsPreview.tsx`

*   **Chemin :** `src/features/devis/components/DevisDetailsPreview.tsx`
*   **Rôle Précis :** Affiche un aperçu visuel des pages de détails des travaux.
*   **Imports Clés :** `@react-pdf/renderer`, Composants PDF (`DetailsPage`, ...), Hooks, Types, Utilitaires PDF.
*   **Props :** `pdfSettings: PdfSettings`, `projectState: ProjectState`.
*   **États Locaux (`useState`) :** Aucun.
*   **Effets (`useEffect`) :** Aucun.
*   **Fonctions Internes / Gestionnaires d'Événements :** Aucun (rendu JSX).
*   **Structure JSX :** Rend `<Document>` -> `<DetailsPage />` (avec props).
*   **Interactions :** Affichage de l'aperçu.
*   **Export :** `export const DevisDetailsPreview = (...) => { ... };`

##### `src/features/devis/components/DevisRecapPreview.tsx`

*   **Chemin :** `src/features/devis/components/DevisRecapPreview.tsx`
*   **Rôle Précis :** Affiche un aperçu visuel de la page récapitulative des totaux.
*   **Imports Clés :** `@react-pdf/renderer`, Composants PDF (`RecapPage`, ...), Hooks, Types, Utilitaires PDF, Utilitaires Projet (pour calcul totaux).
*   **Props :** `pdfSettings: PdfSettings`, `projectState: ProjectState`.
*   **États Locaux (`useState`) :** Aucun.
*   **Effets (`useEffect`) :** Aucun.
*   **Fonctions Internes / Gestionnaires d'Événements :** Peut calculer les totaux avant le rendu.
*   **Structure JSX :** Rend `<Document>` -> `<RecapPage />` (avec props).
*   **Interactions :** Affichage de l'aperçu.
*   **Export :** `export const DevisRecapPreview = (...) => { ... };`

##### `src/features/devis/components/PrintableFieldsForm.tsx`

*   **Chemin :** `src/features/devis/components/PrintableFieldsForm.tsx`
*   **Rôle Précis :** Formulaire permettant de sélectionner les éléments/détails à inclure dans le PDF généré.
*   **Imports Clés :** Composants UI (`Card`, `Form`, `Checkbox`, `Select`, ...), Hooks (`useForm`), Types (spécifiques aux "PrintableSettings").
*   **Props :** `initialSettings?`, `onSaveSettings?: (newSettings) => void`.
*   **États Locaux (`useState`) :** Géré par `react-hook-form` ou localement.
*   **Effets (`useEffect`) :** Initialise le formulaire.
*   **Fonctions Internes / Gestionnaires d'Événements :** Gestionnaires de changement, `handleSubmit`. Appelle `onSaveSettings`.
*   **Structure JSX :** Formulaire avec `Checkbox`, `Select`, etc., pour les options d'impression.
*   **Interactions :** Sélection des options d'impression, sauvegarde des préférences.
*   **Export :** `export const PrintableFieldsForm = (...) => { ... };`

---

#### `src/features/property/components/`

Ce sous-dossier contient les composants UI spécifiques à la gestion des informations du bien immobilier et des pièces (utilisés dans `InfosChantier.tsx`).

##### `src/features/property/components/PropertyCard.tsx`

*   **Chemin :** `src/features/property/components/PropertyCard.tsx`
*   **Rôle Précis :** Conteneur (`Card`) pour la section "Type de bien à rénover", incluant le titre et le composant `PropertyForm`.
*   **Imports Clés :** Composants UI (`Card`, `CardContent`), Composant `PropertyForm`, Icône (`Home`).
*   **Props :** `property: Property`, `onPropertyChange: (e: React.ChangeEvent<...>) => void`.
*   **États Locaux (`useState`) :** Aucun.
*   **Effets (`useEffect`) :** Aucun.
*   **Fonctions Internes / Gestionnaires d'Événements :** Aucun.
*   **Structure JSX :** `Card` -> Titre + Icône -> `<PropertyForm />`.
*   **Interactions :** Délègue à `PropertyForm`.
*   **Export :** `export default PropertyCard;`

##### `src/features/property/components/PropertyForm.tsx`

*   **Chemin :** `src/features/property/components/PropertyForm.tsx`
*   **Rôle Précis :** Formulaire pour saisir/modifier les détails du bien immobilier (type, année, surface).
*   **Imports Clés :** Composants UI (`FormField`, `Input`, `Select`, ...), Hooks (`useState`, `useEffect`, `useCallback`), Types (`Property`).
*   **Props :** `property: Property`, `onPropertyChange: (e: React.ChangeEvent<...>) => void`.
*   **États Locaux (`useState`) :** Aucun (contrôlé par parent).
*   **Effets (`useEffect`) :** Aucun.
*   **Fonctions Internes / Gestionnaires d'Événements :** `handleInputChange` (appelle `onPropertyChange`).
*   **Structure JSX :** Champs de formulaire pour type (`Select`), année (`Input number`), surface (`Input number`).
*   **Interactions :** Saisie des infos bien, communique changements via `onPropertyChange`.
*   **Export :** `export default PropertyForm;`

##### `src/features/property/components/RoomsCard.tsx`

*   **Chemin :** `src/features/property/components/RoomsCard.tsx`
*   **Rôle Précis :** Conteneur (`Card`) pour la section "Pièces", affichant la liste des pièces et permettant l'ajout/modification/suppression via une modale (`RoomForm`).
*   **Imports Clés :** Composants UI (`Card`, `Button`, `Dialog`, `Alert`, ...), Icônes (`PlusCircle`, `Edit`, `Trash`), Hooks (`useState`, `useRooms`), Composant `RoomForm`, Types (`Room`).
*   **Props :** `rooms: Room[]`. Utilise `useRooms` pour les opérations.
*   **États Locaux (`useState`) :** `isRoomFormOpen: boolean`, `roomToEdit: Room | null`.
*   **Effets (`useEffect`) :** Aucun.
*   **Fonctions Internes / Gestionnaires d'Événements :** `handleAddRoomClick`, `handleEditRoomClick`, `handleDeleteRoomClick`, `handleRoomFormSubmit`, `handleDeleteConfirm`. Appellent les fonctions de `useRooms`.
*   **Structure JSX :** `Card` -> Titre -> Bouton "Ajouter" -> Liste des pièces (nom, surface, boutons Edit/Delete) -> `Dialog` contenant `RoomForm` -> `Dialog` de confirmation suppression.
*   **Interactions :** Gestion CRUD des pièces via modales et hook `useRooms`.
*   **Export :** `export default RoomsCard;`

---

#### `src/features/recap/components/`

Ce sous-dossier contient les composants UI spécifiques à l'affichage du récapitulatif du devis (page `Recapitulatif.tsx`).

##### `src/features/recap/components/DetailsTravaux.tsx`

*   **Chemin :** `src/features/recap/components/DetailsTravaux.tsx`
*   **Rôle Précis :** Affiche le détail des travaux pour une pièce spécifique dans le récapitulatif.
*   **Imports Clés :** Composants UI (`Card`, `Table`, ...), Types (`Travail`), Utilitaires (`formatPrice`).
*   **Props :** `travaux: Travail[]`.
*   **États Locaux (`useState`) :** Aucun.
*   **Effets (`useEffect`) :** Aucun.
*   **Fonctions Internes / Gestionnaires d'Événements :** Aucun.
*   **Structure JSX :** `Table` listant description, quantité, unité, prix HT, TVA, prix TTC pour chaque travail.
*   **Export :** `export const DetailsTravaux = (...) => { ... };`

##### `src/features/recap/components/GlobalTotals.tsx`

*   **Chemin :** `src/features/recap/components/GlobalTotals.tsx`
*   **Rôle Précis :** Affiche les totaux globaux du devis (HT, TVA, TTC).
*   **Imports Clés :** Composants UI (`Card`, ...), Utilitaires (`formatPrice`).
*   **Props :** `totalHT: number`, `totalTVA: number`, `totalTTC: number`.
*   **États Locaux (`useState`) :** Aucun.
*   **Effets (`useEffect`) :** Aucun.
*   **Fonctions Internes / Gestionnaires d'Événements :** Aucun.
*   **Structure JSX :** `Card` ou liste affichant les totaux formatés.
*   **Export :** `export const GlobalTotals = (...) => { ... };`

##### `src/features/recap/components/NoTravauxMessage.tsx`

*   **Chemin :** `src/features/recap/components/NoTravauxMessage.tsx`
*   **Rôle Précis :** Affiche un message si aucun travail n'est défini dans le projet.
*   **Imports Clés :** Composants UI (`Card`, ...).
*   **Props :** Aucune.
*   **États Locaux (`useState`) :** Aucun.
*   **Effets (`useEffect`) :** Aucun.
*   **Fonctions Internes / Gestionnaires d'Événements :** Aucun.
*   **Structure JSX :** Affiche un texte simple dans une `Card`.
*   **Export :** `export const NoTravauxMessage = (...) => { ... };`

##### `src/features/recap/components/PropertyInfoCard.tsx`

*   **Chemin :** `src/features/recap/components/PropertyInfoCard.tsx`
*   **Rôle Précis :** Affiche un résumé des informations du bien immobilier sur la page récapitulative.
*   **Imports Clés :** Composants UI (`Card`, ...), Types (`ProjectState`).
*   **Props :** `projectState: ProjectState`.
*   **États Locaux (`useState`) :** Aucun.
*   **Effets (`useEffect`) :** Aucun.
*   **Fonctions Internes / Gestionnaires d'Événements :** Aucun.
*   **Structure JSX :** `Card` affichant type bien, année, surface habitable.
*   **Export :** `export const PropertyInfoCard = (...) => { ... };`

##### `src/features/recap/components/RecapitulatifTravaux.tsx`

*   **Chemin :** `src/features/recap/components/RecapitulatifTravaux.tsx`
*   **Rôle Précis :** Affiche le tableau récapitulatif principal des travaux, regroupés par pièce.
*   **Imports Clés :** Composants UI (`Card`, `Table`, ...), Types (`ProjectState`, `Room`, `Travail`), Composant `RoomRecapTable`.
*   **Props :** `projectState: ProjectState`.
*   **États Locaux (`useState`) :** Aucun.
*   **Effets (`useEffect`) :** Aucun.
*   **Fonctions Internes / Gestionnaires d'Événements :** Logique pour regrouper `projectState.travaux` par `pieceId`.
*   **Structure JSX :** `Card` contenant une `Table`. Itère sur les pièces et rend `RoomRecapTable` pour chaque pièce avec ses travaux.
*   **Export :** `export const RecapitulatifTravaux = (...) => { ... };`

##### `src/features/recap/components/RoomRecapTable.tsx`

*   **Chemin :** `src/features/recap/components/RoomRecapTable.tsx`
*   **Rôle Précis :** Affiche les travaux pour une pièce spécifique dans le tableau récapitulatif.
*   **Imports Clés :** Composants UI (`Table`, ...), Types (`Room`, `Travail`), Utilitaires (`formatPrice`), Composant `TravailRecapRow`.
*   **Props :** `room: Room`, `travaux: Travail[]`.
*   **États Locaux (`useState`) :** Aucun.
*   **Effets (`useEffect`) :** Aucun.
*   **Fonctions Internes / Gestionnaires d'Événements :** Aucun.
*   **Structure JSX :** Section de `Table` (potentiellement `tbody`) avec un titre pour la pièce. Itère sur `travaux` et rend `TravailRecapRow`. Rend `TotauxRecap`.
*   **Export :** `export const RoomRecapTable = (...) => { ... };`

##### `src/features/recap/components/TotauxRecap.tsx`

*   **Chemin :** `src/features/recap/components/TotauxRecap.tsx`
*   **Rôle Précis :** Affiche une ligne de totaux (HT, TVA, TTC) pour une pièce dans le tableau récapitulatif.
*   **Imports Clés :** Composants UI (`TableRow`, `TableCell`), Types (`Travail`), Utilitaires (`formatPrice`).
*   **Props :** `travaux: Travail[]`.
*   **États Locaux (`useState`) :** Aucun.
*   **Effets (`useEffect`) :** Aucun.
*   **Fonctions Internes / Gestionnaires d'Événements :** Calcule les totaux HT, TVA, TTC pour le tableau `travaux` fourni.
*   **Structure JSX :** `TableRow` avec des `TableCell` affichant les totaux calculés et formatés.
*   **Export :** `export const TotauxRecap = (...) => { ... };`

##### `src/features/recap/components/TravailRecapRow.tsx`

*   **Chemin :** `src/features/recap/components/TravailRecapRow.tsx`
*   **Rôle Précis :** Affiche une ligne pour un travail individuel dans le tableau récapitulatif.
*   **Imports Clés :** Composants UI (`TableRow`, `TableCell`), Types (`Travail`), Utilitaires (`formatPrice`).
*   **Props :** `travail: Travail`.
*   **États Locaux (`useState`) :** Aucun.
*   **Effets (`useEffect`) :** Aucun.
*   **Fonctions Internes / Gestionnaires d'Événements :** Aucun.
*   **Structure JSX :** `TableRow` avec `TableCell` pour description, quantité, unité, prix unitaire HT, total HT.
*   **Export :** `export const TravailRecapRow = (...) => { ... };`

##### `src/features/recap/components/TravauxRecapContent.tsx`

*   **Chemin :** `src/features/recap/components/TravauxRecapContent.tsx`
*   **Rôle Précis :** Composant principal du contenu de la page `Recapitulatif.tsx`. Organise l'affichage des infos bien, des totaux globaux et du récapitulatif détaillé des travaux.
*   **Imports Clés :** Composants (`PropertyInfoCard`, `GlobalTotals`, `RecapitulatifTravaux`, `NoTravauxMessage`), Types (`ProjectState`), Utilitaires de calcul.
*   **Props :** `projectState: ProjectState`.
*   **États Locaux (`useState`) :** Aucun.
*   **Effets (`useEffect`) :** Aucun.
*   **Fonctions Internes / Gestionnaires d'Événements :** Calcule les totaux globaux à partir de `projectState.travaux`.
*   **Structure JSX :** Rend `PropertyInfoCard`, `GlobalTotals` (en passant les totaux calculés), et `RecapitulatifTravaux` (ou `NoTravauxMessage` si pas de travaux).
*   **Export :** `export const TravauxRecapContent = (...) => { ... };`

---

#### `src/features/renovation/components/`

Ce sous-dossier semble contenir des composants liés à la gestion des "autres surfaces" ou d'autres aspects spécifiques de la rénovation.

##### `src/features/renovation/components/AutreSurfaceForm.tsx`

*   **Chemin :** `src/features/renovation/components/AutreSurfaceForm.tsx`
*   **Rôle Précis :** Formulaire pour ajouter/modifier une "autre surface" (dalle, chape...) associée à une pièce. Utilisé dans une modale depuis `AutresSurfacesList.tsx`.
*   **Imports Clés :** Composants UI (`DialogContent`, ... `Input`, `Button`, `Select`), Hooks (`useForm`), Types (`AutreSurfaceItem`), Validation (Zod).
*   **Props :** `isOpen: boolean`, `onClose: () => void`, `autreSurfaceToEdit: AutreSurfaceItem | null`, `onSubmit: (surfaceData: AutreSurfaceItem) => void`.
*   **États Locaux (`useState`) :** Géré par `react-hook-form`.
*   **Effets (`useEffect`) :** Remplit le formulaire avec `autreSurfaceToEdit` en mode édition. Charge potentiellement les types d'autres surfaces de référence via `useAutresSurfaces`.
*   **Fonctions Internes / Gestionnaires d'Événements :** `handleSubmit` (appelle `onSubmit`). Gère la sélection du type.
*   **Structure JSX :** Formulaire dans `DialogContent` avec `Select` pour le type, `Input` pour quantité, `Select` pour unité, `Textarea` pour description.
*   **Interactions :** Saisie/validation infos autre surface.
*   **Export :** `export const AutreSurfaceForm = (...) => { ... };`

---

#### `src/features/travaux/components/`

Ce sous-dossier contient les composants UI spécifiques à la gestion des travaux (page `Travaux.tsx`).

##### `src/features/travaux/components/DescriptionSection.tsx`

*   **Chemin :** `src/features/travaux/components/DescriptionSection.tsx`
*   **Rôle Précis :** Champ de formulaire (`Textarea`) pour la description d'un travail. Utilisé dans `TravailForm`.
*   **Imports Clés :** Composants UI (`FormField`, `Textarea`, ...), Hooks (`useFormContext`).
*   **Props :** Props `react-hook-form` (`control`, `name`, `label`).
*   **États Locaux (`useState`) :** Aucun.
*   **Effets (`useEffect`) :** Aucun.
*   **Fonctions Internes / Gestionnaires d'Événements :** Géré par `react-hook-form`.
*   **Structure JSX :** `FormField` contenant `Textarea`.
*   **Export :** `export const DescriptionSection = (...) => { ... };`

##### `src/features/travaux/components/MenuiserieTypeSelect.tsx`

*   **Chemin :** `src/features/travaux/components/MenuiserieTypeSelect.tsx`
*   **Rôle Précis :** Champ de formulaire (`Select`) pour choisir un type de menuiserie (lié à certains travaux). Utilisé dans `TravailForm`.
*   **Imports Clés :** Composants UI (`FormField`, `Select`, ...), Hooks (`useFormContext`, `useMenuiseriesTypes`), Types (`MenuiserieType`).
*   **Props :** Props `react-hook-form`, `label`.
*   **États Locaux (`useState`) :** Aucun.
*   **Effets (`useEffect`) :** Aucun.
*   **Fonctions Internes / Gestionnaires d'Événements :** Géré par `react-hook-form`. Charge les options depuis `useMenuiseriesTypes`.
*   **Structure JSX :** `FormField` contenant `Select`.
*   **Export :** `export const MenuiserieTypeSelect = (...) => { ... };`

##### `src/features/travaux/components/PieceSelect.tsx`

*   **Chemin :** `src/features/travaux/components/PieceSelect.tsx`
*   **Rôle Précis :** Affiche une liste de boutons ou un select pour choisir la pièce active sur la page `Travaux.tsx`. **Correction :** Ce composant n'est *pas* un champ de formulaire dans `TravailForm`, mais un sélecteur de pièce pour la page `Travaux.tsx`.
*   **Imports Clés :** Composants UI (`Button`, `Card`, `CardHeader`, `CardTitle`, `CardContent`, `ScrollArea`), Hooks (`useProject`), Types (`Room`).
*   **Props :**
    *   `rooms`: `Room[]` - Liste des pièces du projet.
    *   `selectedRoom`: `string | null` - ID de la pièce actuellement sélectionnée.
    *   `onSelect`: `(roomId: string) => void` - Fonction appelée lorsqu'une pièce est sélectionnée.
*   **États Locaux (`useState`) :** Aucun.
*   **Effets (`useEffect`) :** Aucun.
*   **Fonctions Internes / Gestionnaires d'Événements :** `handleSelect`: Appelle `onSelect` avec l'ID de la pièce cliquée.
*   **Structure JSX :** `Card` avec titre "Pièces". `ScrollArea` contenant une liste de `Button` (un pour chaque pièce). Le bouton de la pièce `selectedRoom` a un style distinctif (variante "default" ou "secondary").
*   **Interactions :** Sélectionne la pièce active pour afficher ses travaux.
*   **Export :** `export const PieceSelect = (...) => { ... };`

##### `src/features/travaux/components/PriceSection.tsx`

*   **Chemin :** `src/features/travaux/components/PriceSection.tsx`
*   **Rôle Précis :** Groupe de champs de formulaire pour saisir le prix MO et le prix fournitures d'un travail. Utilisé dans `TravailForm`.
*   **Imports Clés :** Composants UI (`FormField`, `Input`, ...), Hooks (`useFormContext`).
*   **Props :** Props `react-hook-form` (`control`, `nameLabor`, `nameSupply`, `label`).
*   **États Locaux (`useState`) :** Aucun.
*   **Effets (`useEffect`) :** Aucun.
*   **Fonctions Internes / Gestionnaires d'Événements :** Géré par `react-hook-form`.
*   **Structure JSX :** Deux `FormField` contenant des `Input` type number pour `labor_price` et `supply_price`.
*   **Export :** `export const PriceSection = (...) => { ... };`

##### `src/features/travaux/components/QuantitySection.tsx`

*   **Chemin :** `src/features/travaux/components/QuantitySection.tsx`
*   **Rôle Précis :** Groupe de champs de formulaire pour saisir la quantité et sélectionner l'unité d'un travail. Utilisé dans `TravailForm`.
*   **Imports Clés :** Composants UI (`FormField`, `Input`, `Select`, ...), Hooks (`useFormContext`), Types (pour les unités).
*   **Props :** Props `react-hook-form` (`control`, `nameQuantite`, `nameUnite`, `label`).
*   **États Locaux (`useState`) :** Aucun.
*   **Effets (`useEffect`) :** Aucun.
*   **Fonctions Internes / Gestionnaires d'Événements :** Géré par `react-hook-form`. Charge les options d'unités (depuis `src/types/surface.ts` ?).
*   **Structure JSX :** `FormField` contenant `Input` type number pour quantité, `FormField` contenant `Select` pour unité.
*   **Export :** `export const QuantitySection = (...) => { ... };`

##### `src/features/travaux/components/ServiceGroupSelect.tsx`

*   **Chemin :** `src/features/travaux/components/ServiceGroupSelect.tsx`
*   **Rôle Précis :** Champ de formulaire (`Select`) pour choisir un groupe de services. Utilisé dans `TravailForm`.
*   **Imports Clés :** Composants UI (`FormField`, `Select`, ...), Hooks (`useFormContext`, `useTravauxTypes`), Types (`ServiceGroup`).
*   **Props :** Props `react-hook-form`, `label`, `typeTravauxId` (pour filtrer les groupes).
*   **États Locaux (`useState`) :** Aucun.
*   **Effets (`useEffect`) :** Filtre la liste des groupes basée sur `typeTravauxId`.
*   **Fonctions Internes / Gestionnaires d'Événements :** Géré par `react-hook-form`. Charge les options depuis `useTravauxTypes`.
*   **Structure JSX :** `FormField` contenant `Select`. Désactivé si `typeTravauxId` n'est pas défini.
*   **Export :** `export const ServiceGroupSelect = (...) => { ... };`

##### `src/features/travaux/components/SousTypeSelect.tsx`

*   **Chemin :** `src/features/travaux/components/SousTypeSelect.tsx`
*   **Rôle Précis :** Champ de formulaire (`Select`) pour choisir une prestation (sous-type). Utilisé dans `TravailForm`.
*   **Imports Clés :** Composants UI (`FormField`, `Select`, ...), Hooks (`useFormContext`, `useTravauxTypes`), Types (`SousTypeTravauxItem`).
*   **Props :** Props `react-hook-form`, `label`, `typeTravauxId`, `groupId` (pour filtrer les sous-types).
*   **États Locaux (`useState`) :** Aucun.
*   **Effets (`useEffect`) :** Filtre la liste des sous-types basée sur `typeTravauxId` et `groupId`.
*   **Fonctions Internes / Gestionnaires d'Événements :** Géré par `react-hook-form`. Charge les options depuis `useTravauxTypes`. Met à jour d'autres champs (prix, unité) lorsque le sous-type change.
*   **Structure JSX :** `FormField` contenant `Select`. Désactivé si `groupId` n'est pas défini.
*   **Export :** `export const SousTypeSelect = (...) => { ... };`

##### `src/features/travaux/components/SurfaceImpacteeSelect.tsx`

*   **Chemin :** `src/features/travaux/components/SurfaceImpacteeSelect.tsx`
*   **Rôle Précis :** Champ de formulaire (`Select`) pour choisir la surface impactée par le travail. Utilisé dans `TravailForm`.
*   **Imports Clés :** Composants UI (`FormField`, `Select`, ...), Hooks (`useFormContext`), Types (pour les surfaces).
*   **Props :** Props `react-hook-form`, `label`.
*   **États Locaux (`useState`) :** Aucun.
*   **Effets (`useEffect`) :** Aucun.
*   **Fonctions Internes / Gestionnaires d'Événements :** Géré par `react-hook-form`. Charge les options (depuis `src/types/surface.ts` ?).
*   **Structure JSX :** `FormField` contenant `Select`.
*   **Export :** `export const SurfaceImpacteeSelect = (...) => { ... };`

##### `src/features/travaux/components/TravailCard.tsx`

*   **Chemin :** `src/features/travaux/components/TravailCard.tsx`
*   **Rôle Précis :** Affiche les informations résumées d'un travail dans une `Card`. Utilisé dans la liste des travaux de la page `Travaux.tsx`.
*   **Imports Clés :** Composants UI (`Card`, `Button`, ...), Icônes (`Edit`, `Trash`), Types (`Travail`), Utilitaires (`formatPrice`).
*   **Props :** `travail: Travail`, `onEdit: (travail: Travail) => void`, `onDelete: (travailId: string) => void`.
*   **États Locaux (`useState`) :** Aucun.
*   **Effets (`useEffect`) :** Aucun.
*   **Fonctions Internes / Gestionnaires d'Événements :** `handleEditClick` (appelle `onEdit`), `handleDeleteClick` (appelle `onDelete`).
*   **Structure JSX :** `Card` affichant type/sous-type, description, quantité/unité, prix total. Boutons Edit/Delete.
*   **Export :** `export const TravailCard = (...) => { ... };`

##### `src/features/travaux/components/TravailForm.tsx`

*   **Chemin :** `src/features/travaux/components/TravailForm.tsx`
*   **Rôle Précis :** Formulaire principal pour créer ou modifier un travail, affiché dans un panneau latéral (`Sheet`) sur la page `Travaux.tsx`.
*   **Imports Clés :** Composants UI (`Form`, `Button`, ...), Hooks (`useForm`, `useTravauxTypes`), Composants enfants (`TypeTravauxSelect`, `ServiceGroupSelect`, `SousTypeSelect`, `QuantitySection`, `PriceSection`, `DescriptionSection`, `TvaSelect`, `SurfaceImpacteeSelect`, `MenuiserieTypeSelect`), Types (`Travail`, `Room`), Validation (Zod).
*   **Props :** `piece: Room | undefined`, `onAddTravail: (travailData: Omit<Travail, 'id'> | Travail) => void`, `travailAModifier?: Travail | null`.
*   **États Locaux (`useState`) :** Géré par `react-hook-form`.
*   **Effets (`useEffect`) :** Initialise le formulaire avec `travailAModifier` ou des valeurs par défaut. Réinitialise en fonction des sélections (type->groupe->sous-type).
*   **Fonctions Internes / Gestionnaires d'Événements :** `handleSubmit` (appelle `onAddTravail` avec les données validées). Logique pour pré-remplir champs en fonction du sous-type sélectionné.
*   **Structure JSX :** `Form` contenant les différents composants de sélection et de saisie (`TypeTravauxSelect`, `SousTypeSelect`, `QuantitySection`, etc.). Boutons "Ajouter"/"Modifier" et "Annuler".
*   **Interactions :** Saisie/sélection de tous les détails d'un travail. Validation et soumission.
*   **Export :** `export default TravailForm;`

##### `src/features/travaux/components/TravauxList.tsx`

*   **Chemin :** `src/features/travaux/components/TravauxList.tsx`
*   **Rôle Précis :** Affiche la liste des travaux pour la pièce sélectionnée sur la page `Travaux.tsx`. Utilise `TravailCard`.
*   **Imports Clés :** Composant `TravailCard`, Types (`Travail`), Composant UI (`Alert` pour message vide).
*   **Props :** `travaux: Travail[]`, `onEdit: (travail: Travail) => void`, `onDelete: (travailId: string) => void`.
*   **États Locaux (`useState`) :** Aucun.
*   **Effets (`useEffect`) :** Aucun.
*   **Fonctions Internes / Gestionnaires d'Événements :** Aucun.
*   **Structure JSX :** Affiche une `Alert` si `travaux` est vide. Sinon, `map` sur `travaux` et rend `<TravailCard />` pour chaque travail, en passant les props `travail`, `onEdit`, `onDelete`.
*   **Export :** `export const TravauxList = (...) => { ... };`

##### `src/features/travaux/components/TvaSelect.tsx`

*   **Chemin :** `src/features/travaux/components/TvaSelect.tsx`
*   **Rôle Précis :** Champ de formulaire (`Select`) pour choisir le taux de TVA. Utilisé dans `TravailForm`.
*   **Imports Clés :** Composants UI (`FormField`, `Select`, ...), Hooks (`useFormContext`).
*   **Props :** Props `react-hook-form`, `label`.
*   **États Locaux (`useState`) :** Aucun.
*   **Effets (`useEffect`) :** Aucun.
*   **Fonctions Internes / Gestionnaires d'Événements :** Géré par `react-hook-form`. Options de TVA probablement codées en dur ou dans une constante.
*   **Structure JSX :** `FormField` contenant `Select`.
*   **Export :** `export const TvaSelect = (...) => { ... };`

##### `src/features/travaux/components/TypeTravauxSelect.tsx`

*   **Chemin :** `src/features/travaux/components/TypeTravauxSelect.tsx`
*   **Rôle Précis :** Champ de formulaire (`Select`) pour choisir le type de travaux principal. Utilisé dans `TravailForm`.
*   **Imports Clés :** Composants UI (`FormField`, `Select`, ...), Hooks (`useFormContext`, `useTravauxTypes`), Types (`TravauxType`).
*   **Props :** Props `react-hook-form`, `label`.
*   **États Locaux (`useState`) :** Aucun.
*   **Effets (`useEffect`) :** Aucun.
*   **Fonctions Internes / Gestionnaires d'Événements :** Géré par `react-hook-form`. Charge les options depuis `useTravauxTypes`.
*   **Structure JSX :** `FormField` contenant `Select`.
*   **Export :** `export const TypeTravauxSelect = (...) => { ... };`

##### `src/features/travaux/components/UniteSelect.tsx`

*   **Chemin :** `src/features/travaux/components/UniteSelect.tsx`
*   **Rôle Précis :** Champ de formulaire (`Select`) pour choisir l'unité de mesure. Utilisé dans `TravailForm` (souvent lié à `QuantitySection`).
*   **Imports Clés :** Composants UI (`FormField`, `Select`, ...), Hooks (`useFormContext`), Types (pour les unités).
*   **Props :** Props `react-hook-form`, `label`.
*   **États Locaux (`useState`) :** Aucun.
*   **Effets (`useEffect`) :** Aucun.
*   **Fonctions Internes / Gestionnaires d'Événements :** Géré par `react-hook-form`. Charge les options (depuis `src/types/surface.ts` ?).
*   **Structure JSX :** `FormField` contenant `Select`.
*   **Export :** `export const UniteSelect = (...) => { ... };`

##### `src/features/travaux/components/UpdateServiceModal.tsx`

*   **Chemin :** `src/features/travaux/components/UpdateServiceModal.tsx`
*   **Rôle Précis :** Modale pour modifier rapidement les détails d'un service de référence (prestation). Potentiellement appelée depuis `TravailForm` si un service sélectionné nécessite une mise à jour.
*   **Imports Clés :** Composants UI (`Dialog`, `Form`, `Input`, `Button`, ...), Hooks (`useState`), Types (`Service`).
*   **Props :** `isOpen: boolean`, `onClose: () => void`, `service: Service`, `onSave: (updatedService: Service) => void`.
*   **États Locaux (`useState`) :** Pour les champs du formulaire si non géré par `react-hook-form`.
*   **Effets (`useEffect`) :** Remplit le formulaire avec les données de `service`.
*   **Fonctions Internes / Gestionnaires d'Événements :** Gestion des changements, `handleSave` (appelle `onSave` après mise à jour potentielle via un service).
*   **Structure JSX :** `Dialog` contenant un formulaire pour éditer nom, description, prix MO/fournitures du service.
*   **Interactions :** Modification rapide d'un service de référence.
*   **Export :** `export const UpdateServiceModal = (...) => { ... };`


### 14. Dossier `src/services/pdf/` (Partie NON React PDF / Obsolète)

Ce dossier contient des fichiers et sous-dossiers liés à une **ancienne méthode de génération de PDF** (probablement basée sur `pdfMake`). Ces éléments sont considérés comme **obsolètes** suite à la migration vers `@react-pdf/renderer` et ne devraient plus être utilisés par le flux de génération actuel. Ils sont documentés ici à des fins d'audit et pour identifier le code à potentiellement nettoyer ou supprimer.

**Note Importante :** Le sous-dossier `react-pdf/`, qui contient l'implémentation actuelle, est traité séparément dans la Section VIII.

#### `src/services/pdf/pdfConstants.ts`

*   **Chemin :** `src/services/pdf/pdfConstants.ts`
*   **Rôle Précis :** Contenait des constantes (marges, styles, couleurs) spécifiques à l'ancienne bibliothèque PDF.
*   **Imports Clés :** Potentiellement des types spécifiques à l'ancienne implémentation.
*   **Exports Clés :** Constantes exportées.
*   **Logique Principale :** Définition de constantes.
*   **Statut :** **OBSOLÈTE - Logique pdfMake/Ancienne.** Les constantes pour `@react-pdf/renderer` sont gérées différemment (via `pdfSettings` et potentiellement `src/services/pdf/constants/pdfConstants.ts`).

---

#### `src/services/pdf/pdfGenerators.ts`

*   **Chemin :** `src/services/pdf/pdfGenerators.ts`
*   **Rôle Précis :** Contenait probablement des fonctions de haut niveau pour générer différentes sections du PDF avec l'ancienne méthode.
*   **Imports Clés :** Fonctions utilitaires obsolètes, données projet.
*   **Exports Clés :** Fonctions comme `generateCover`, `generateDetails`, `generateFullDevis` (noms supposés).
*   **Logique Principale :** Appelait des fonctions de plus bas niveau pour construire la structure de contenu de l'ancien format PDF.
*   **Statut :** **OBSOLÈTE - Logique pdfMake/Ancienne.** Remplacé par les composants React PDF et `useReactPdfGeneration`.

---

#### `src/services/pdf/pdfResources.ts`

*   **Chemin :** `src/services/pdf/pdfResources.ts`
*   **Rôle Précis :** Gérait les ressources (images, polices encodées ?) pour l'ancienne méthode PDF.
*   **Imports Clés :** Données d'images (base64 ?).
*   **Exports Clés :** Fonctions/variables pour accéder aux ressources (ex: `getLogoBase64`).
*   **Logique Principale :** Chargeait ou fournissait les ressources.
*   **Statut :** **OBSOLÈTE - Logique pdfMake/Ancienne.** `@react-pdf/renderer` gère les ressources différemment (via `<Image>` et `Font.register` dans `reactPdfFonts.ts`).

---

#### `src/services/pdf/v2/utils/styleUtils.ts`

*   **Chemin :** `src/services/pdf/v2/utils/styleUtils.ts`
*   **Rôle Précis :** Contenait des utilitaires de style pour une "version 2" de l'ancienne implémentation PDF.
*   **Imports Clés :** Types de style obsolètes.
*   **Exports Clés :** Fonctions de manipulation de style.
*   **Logique Principale :** Manipulation d'objets de style pour l'ancien format.
*   **Statut :** **OBSOLÈTE - Logique pdfMake/Ancienne (v2).** Remplacé par `pdfStyleUtils.ts` dans le dossier `react-pdf/`.

---

#### `src/services/pdf/generators/coverGenerator.ts`

*   **Chemin :** `src/services/pdf/generators/coverGenerator.ts`
*   **Rôle Précis :** Contenait la logique pour générer le contenu de la page de couverture avec l'ancienne méthode.
*   **Imports Clés :** Données projet, utilitaires obsolètes.
*   **Exports Clés :** Fonction comme `generateCoverPage`.
*   **Logique Principale :** Formatage des données pour l'ancienne bibliothèque.
*   **Statut :** **OBSOLÈTE - Logique pdfMake/Ancienne.** Remplacé par `<CoverDocumentContent />`.

---

#### `src/services/pdf/generators/detailsGenerator.ts`

*   **Chemin :** `src/services/pdf/generators/detailsGenerator.ts`
*   **Rôle Précis :** Contenait la logique pour générer le contenu des détails des travaux avec l'ancienne méthode.
*   **Imports Clés :** Données projet, utilitaires obsolètes.
*   **Exports Clés :** Fonction comme `generateDetailsPage`.
*   **Logique Principale :** Formatage des données pour l'ancienne bibliothèque.
*   **Statut :** **OBSOLÈTE - Logique pdfMake/Ancienne.** Remplacé par `<DetailsPage />` et `<DetailsPageContent />`.

---

#### `src/services/pdf/generators/recapGenerator.ts`

*   **Chemin :** `src/services/pdf/generators/recapGenerator.ts`
*   **Rôle Précis :** Contenait la logique pour générer le contenu de la page récapitulative avec l'ancienne méthode.
*   **Imports Clés :** Données projet, utilitaires obsolètes.
*   **Exports Clés :** Fonction comme `generateRecapPage`.
*   **Logique Principale :** Formatage des données pour l'ancienne bibliothèque.
*   **Statut :** **OBSOLÈTE - Logique pdfMake/Ancienne.** Remplacé par `<RecapPage />` et `<RecapPageContent />`.

---

#### `src/services/pdf/services/completePdfService.ts`

*   **Chemin :** `src/services/pdf/services/completePdfService.ts`
*   **Rôle Précis :** Service de haut niveau orchestrant la génération d'un devis complet avec l'ancienne méthode.
*   **Imports Clés :** Générateurs obsolètes (`coverGenerator`, etc.), `pdfDocumentService` obsolète.
*   **Exports Clés :** Fonction comme `generateCompleteDevis`.
*   **Logique Principale :** Assemblait les différentes parties et appelait l'ancienne bibliothèque.
*   **Statut :** **OBSOLÈTE - Logique pdfMake/Ancienne.** Remplacé par `useReactPdfGeneration`.

---

#### `src/services/pdf/services/detailedPdfService.ts`

*   **Chemin :** `src/services/pdf/services/detailedPdfService.ts`
*   **Rôle Précis :** Service de haut niveau orchestrant la génération d'une version "détaillée" du devis avec l'ancienne méthode.
*   **Imports Clés :** `detailsGenerator` obsolète, `pdfDocumentService` obsolète.
*   **Exports Clés :** Fonction comme `generateDetailedDevis`.
*   **Logique Principale :** Se concentrait sur la section détails.
*   **Statut :** **OBSOLÈTE - Logique pdfMake/Ancienne.**

---

#### `src/services/pdf/services/pdfDocumentService.ts`

*   **Chemin :** `src/services/pdf/services/pdfDocumentService.ts`
*   **Rôle Précis :** Service central interagissant directement avec l'ancienne bibliothèque (ex: `pdfMake`). Initialisait le document, ajoutait du contenu, générait le blob/fichier.
*   **Imports Clés :** Bibliothèque `pdfMake` ou similaire.
*   **Exports Clés :** Fonctions comme `createPdfDocument`, `generatePdfBlob`.
*   **Logique Principale :** Encapsulait les appels à l'API de l'ancienne bibliothèque.
*   **Statut :** **OBSOLÈTE - Logique pdfMake/Ancienne.** Remplacé par les fonctions de `@react-pdf/renderer` (ex: `pdf().toBlob()`).

---

#### `src/services/pdf/services/recapPdfService.ts`

*   **Chemin :** `src/services/pdf/services/recapPdfService.ts`
*   **Rôle Précis :** Service de haut niveau orchestrant la génération d'une version "récapitulative" du devis avec l'ancienne méthode.
*   **Imports Clés :** `recapGenerator` obsolète, `pdfDocumentService` obsolète.
*   **Exports Clés :** Fonction comme `generateRecapDevis`.
*   **Logique Principale :** Se concentrait sur la section récapitulative.
*   **Statut :** **OBSOLÈTE - Logique pdfMake/Ancienne.**

---

#### `src/services/pdf/types/pdfTypes.ts`

*   **Chemin :** `src/services/pdf/types/pdfTypes.ts`
*   **Rôle Précis :** Définissait les types spécifiques aux structures de données attendues par l'ancienne bibliothèque PDF.
*   **Imports Clés :** Types projet.
*   **Exports Clés :** Types TypeScript spécifiques à l'ancien format.
*   **Logique Principale :** Définition de types.
*   **Statut :** **OBSOLÈTE - Logique pdfMake/Ancienne.** Les types pour `@react-pdf/renderer` sont gérés ailleurs (ex: `src/services/pdf/react-pdf/types/`).

---

#### `src/services/pdf/utils/dateUtils.ts`

*   **Chemin :** `src/services/pdf/utils/dateUtils.ts`
*   **Rôle Précis :** Contenait des fonctions de formatage de dates pour l'ancienne méthode PDF.
*   **Imports Clés :** Librairie de dates (ex: `date-fns`).
*   **Exports Clés :** Fonctions comme `formatDateForPdf`.
*   **Logique Principale :** Formatage de dates.
*   **Statut :** **OBSOLÈTE ou ADAPTÉ.** Si le formatage était très spécifique, il est obsolète. Si générique, il a pu être déplacé ou adapté dans `src/services/pdf/react-pdf/utils/dateUtils.ts`. Une vérification des imports dans la nouvelle implémentation est nécessaire.

---

#### `src/services/pdf/utils/fontUtils.ts`

*   **Chemin :** `src/services/pdf/utils/fontUtils.ts`
*   **Rôle Précis :** Contenait des utilitaires de gestion des polices pour l'ancienne méthode (chargement, styles par défaut).
*   **Imports Clés :** Données de police, API ancienne bibliothèque.
*   **Exports Clés :** Fonctions/constantes liées aux polices.
*   **Logique Principale :** Configuration des polices.
*   **Statut :** **OBSOLÈTE - Logique pdfMake/Ancienne.** Remplacé par `reactPdfFonts.ts` dans `react-pdf/utils/`.

---

#### `src/services/pdf/utils/pdfUtils.ts`

*   **Chemin :** `src/services/pdf/utils/pdfUtils.ts`
*   **Rôle Précis :** Contenait des fonctions utilitaires génériques pour l'ancienne méthode PDF (mise en page, calculs spécifiques, manipulation de structure).
*   **Imports Clés :** Types, constantes, autres utilitaires obsolètes.
*   **Exports Clés :** Fonctions utilitaires diverses.
*   **Logique Principale :** Helpers réutilisables pour l'ancienne génération.
*   **Statut :** **OBSOLÈTE - Logique pdfMake/Ancienne.** Remplacé par les utilitaires dans `src/services/pdf/react-pdf/utils/` si une fonctionnalité similaire était nécessaire.




## IV. Interface Utilisateur (UI) Détaillée

Cette section décrit les aspects clés de l'interface utilisateur de l'application, y compris la navigation, la structure des pages et les composants spécifiques aux fonctionnalités.

### 1. Routing

La gestion de la navigation et l'association des URL aux différentes vues de l'application sont gérées côté client à l'aide de la librairie `react-router-dom`. La configuration principale du routage se trouve dans le composant racine `src/App.tsx`.

*   **Composant Racine du Routage :** `BrowserRouter` enveloppe l'ensemble de l'application dans `App.tsx` pour activer la gestion de l'historique de navigation du navigateur.
*   **Structure des Routes :** Le composant `Routes` est utilisé à l'intérieur de `App.tsx` (probablement au sein du `Layout`) pour définir les correspondances entre les chemins d'URL et les composants de page à afficher.
*   **Routes Principales Définies (basées sur l'analyse de `App.tsx` et des pages) :**
    *   **`/` (Route d'Index) :**
        *   `path`: `/`
        *   `element`: `<Index />` (Page `src/pages/Index.tsx`) - Sert de point d'entrée, affiche potentiellement un tableau de bord ou redirige.
    *   **`/chantier` (ou `/projet/:projectId`) (Infos Chantier) :**
        *   `path`: `/chantier` ou `/projet/:projectId` (le chemin exact dépend de si l'ID est passé en paramètre)
        *   `element`: `<InfosChantier />` (Page `src/pages/InfosChantier.tsx`) - Page principale pour la saisie/modification des informations générales du projet, du bien et des pièces.
    *   **`/travaux` (Gestion des Travaux) :**
        *   `path`: `/travaux`
        *   `element`: `<Travaux />` (Page `src/pages/Travaux.tsx`) - Page pour ajouter, modifier, visualiser les travaux par pièce.
    *   **`/recapitulatif` (Récapitulatif Devis) :**
        *   `path`: `/recapitulatif`
        *   `element`: `<Recapitulatif />` (Page `src/pages/Recapitulatif.tsx`) - Page affichant le résumé complet du devis avant génération.
    *   **`/edition-devis` (Édition et Génération PDF) :**
        *   `path`: `/edition-devis`
        *   `element`: `<EditionDevis />` (Page `src/pages/EditionDevis.tsx`) - Page pour configurer les paramètres du PDF et déclencher la génération.
    *   **`/parametres` (Paramètres Globaux) :**
        *   `path`: `/parametres`
        *   `element`: `<Parametres />` (Page `src/pages/Parametres.tsx`) - Page pour gérer les données de référence (clients, sociétés, menuiseries, mais PAS les travaux via cette route).
    *   **`/admin/travaux` (Administration Catalogue Travaux) :**
        *   `path`: `/admin/travaux`
        *   `element`: `<AdminTravaux />` (Page `src/pages/AdminTravaux.tsx`) - Page dédiée à la gestion du catalogue des types de travaux et prestations.
    *   **`*` (Page Non Trouvée - 404) :**
        *   `path`: `*`
        *   `element`: `<NotFound />` (Page `src/pages/NotFound.tsx`) - Route fourre-tout affichée pour toute URL non reconnue.
*   **Layout Global :** Toutes ces routes sont rendues à l'intérieur du composant `Layout` (via l'`<Outlet />`), ce qui garantit que la barre de projet (`ProjectBar`) et la navigation latérale (`Navigation`) sont présentes sur toutes les pages principales.
*   **Navigation :** La navigation entre ces routes se fait principalement via :
    *   Les liens dans la barre de navigation latérale (`src/components/layout/Navigation.tsx` utilisant `NavLink`).
    *   Les boutons "Précédent"/"Suivant" sur certaines pages (ex: `Recapitulatif.tsx`) utilisant `Link`.
    *   Des redirections programmatiques potentielles (via `useNavigate`) après certaines actions (ex: chargement ou création d'un projet).


    ### 2. Pages (Synthèse)

Les pages suivantes constituent les vues principales de l'application, accessibles via le système de routage :

*   **`Index` (`/`) :**
    *   Point d'entrée principal. Affiche un titre générique et inclut le composant `RenovationEstimator` (dont le rôle actuel est principalement structurel). Ne contient pas de logique métier significative directement.

*   **`InfosChantier` (`/chantier` ou `/projet/:projectId`) :**
    *   **Page centrale pour la saisie initiale.** Permet de gérer les métadonnées du projet (nom, client, société, numéro/date devis, adresse, descriptions).
    *   **Orchestre l'affichage et la modification des informations du bien immobilier** (via `PropertyForm`) et la **gestion des pièces** (ajout/modif/suppression via `RoomsCard` et `RoomForm`).
    *   Fournit les données et les fonctions de manipulation aux composants UI spécifiques via le hook `useProjectInfo`.
    *   Gère potentiellement les opérations de sauvegarde/chargement via des boutons délégués à `ProjectActionButtons`.

*   **`Travaux` (`/travaux`) :**
    *   Interface dédiée à l'**ajout, la modification et la suppression des travaux** pour chaque pièce du projet.
    *   Permet de sélectionner une pièce active (`PieceSelect`).
    *   Affiche la liste des travaux de la pièce sélectionnée (`TravauxList` avec `TravailCard`).
    *   Utilise un panneau latéral (`Sheet`) contenant `TravailForm` pour la saisie détaillée d'un travail (type, prestation, quantité, prix, description).
    *   Interagit fortement avec les hooks `useProject` (pour les pièces) et `useTravaux` (pour les opérations CRUD sur les travaux).

*   **`Recapitulatif` (`/recapitulatif`) :**
    *   Affiche une **vue d'ensemble complète du devis** avant la génération PDF.
    *   Présente les informations du bien (`PropertyInfoCard`).
    *   Affiche les totaux globaux HT, TVA, TTC (`GlobalTotals`).
    *   Liste tous les travaux regroupés par pièce avec leurs détails et totaux (`RecapitulatifTravaux`).
    *   Sert d'étape de validation visuelle.

*   **`EditionDevis` (`/edition-devis`) :**
    *   Page dédiée à la **configuration du PDF et à sa génération**.
    *   Propose des onglets pour :
        *   Sélectionner les champs/éléments à inclure dans le PDF (`PrintableFieldsForm`).
        *   Ajuster les paramètres visuels (marges, couleurs, polices, styles des éléments) via `PdfSettingsForm`.
    *   Contient le bouton pour déclencher la génération du PDF via le hook `useReactPdfGeneration`.
    *   Affiche potentiellement des aperçus (non fonctionnels) des différentes sections du PDF.

*   **`Parametres` (`/parametres`) :**
    *   Interface d'administration pour gérer les **données de référence globales** (hors catalogue travaux).
    *   Utilise des onglets pour séparer la gestion des :
        *   Clients (CRUD via `ClientForm` et `useClients`).
        *   Sociétés (CRUD via `CompanyForm` et services).
        *   Types de Menuiseries (CRUD via `TypeMenuiserieForm` et services).
        *   **(Catalogue Travaux non géré ici, voir `AdminTravaux`)**

*   **`AdminTravaux` (`/admin/travaux`) :**
    *   Interface d'administration dédiée à la gestion du **catalogue des travaux**.
    *   Permet le CRUD (Ajout/Modif/Suppression) des :
        *   Types de travaux (ex: Peinture, Électricité) via `TypeTravauxForm`.
        *   Groupes de services (sous-catégories).
        *   Services/Prestations (ex: Peinture murale 2 couches) via `SousTypeTravauxForm`.
    *   Interagit avec le contexte `TravauxTypesContext` et/ou le service `travauxService`.

*   **`NotFound` (`*`) :**
    *   Page simple affichée lorsqu'une URL demandée ne correspond à aucune route définie. Informe l'utilisateur et propose un lien de retour à l'accueil.


    ### 3. Composants UI Spécifiques (Synthèse)

En plus des composants de base de `shadcn/ui` et des composants de layout généraux, l'application utilise de nombreux composants personnalisés spécifiques à chaque fonctionnalité (`feature`), organisés dans les sous-dossiers de `src/features/`. Voici un résumé de leur rôle :

*   **Fonctionnalité "Chantier" (`src/features/chantier/components/`) :**
    *   `InfosChantierLayout`: Layout principal orchestrant l'affichage et les interactions de la page "Infos Chantier".
    *   `ProjectForm`: Formulaire principal (ou conteneur) pour les métadonnées du projet (nom, dates, client, société, etc.).
    *   `ClientDetails`, `CompanyDetails`: Cartes affichant les informations d'un client ou d'une société sélectionné(e).
    *   `ProjectList`: Liste affichant les projets sauvegardés pour la sélection/chargement/suppression (utilisée dans la modale "Ouvrir").
    *   `ProjectSummary`: Carte affichant un résumé non modifiable des infos clés du projet.
    *   `project-form/` (sous-dossier) : Contient des composants de formulaire granulaires utilisés par `ProjectForm` :
        *   `ClientSelection`, `CompanySelection`: Champs `Select` pour choisir un client/société existant.
        *   `ClientsDataField`: Champ liant la sélection client aux données complètes dans l'état projet.
        *   `DevisInfoForm`: Champs pour le numéro et la date du devis.
        *   `ProjectActionButtons`: Groupe les boutons Enregistrer, Enregistrer Sous, Supprimer.
        *   `ProjectAddressFields`: Champs pour l'adresse chantier et l'occupant.
        *   `ProjectDescriptionField`: Champs (`Textarea`) pour la description projet et infos complémentaires.
        *   `ProjectNameField`: Champ `Input` pour le nom du projet, avec option de génération.

*   **Fonctionnalité "Devis" (`src/features/devis/components/`) :**
    *   `DevisCoverPreview`, `DevisDetailsPreview`, `DevisRecapPreview`: Composants affichant des aperçus visuels (basés sur `@react-pdf/renderer`) des différentes sections du PDF généré.
    *   `PrintableFieldsForm`: Formulaire pour sélectionner les éléments/détails à inclure lors de la génération du PDF.
    *   `pdf-settings/` (sous-dossier, détaillé en Section IX) : Contient l'ensemble des composants UI pour configurer les paramètres visuels du PDF (couleurs, marges, polices, styles des éléments).

*   **Fonctionnalité "Property" (`src/features/property/components/`) :**
    *   `PropertyCard`: Conteneur (`Card`) pour la section des informations du bien sur la page "Infos Chantier".
    *   `PropertyForm`: Formulaire pour saisir/modifier les détails du bien (type, année, surface).
    *   `RoomsCard`: Conteneur (`Card`) pour la section des pièces sur la page "Infos Chantier", gérant la liste et l'accès aux modales d'ajout/modification/suppression.

*   **Fonctionnalité "Travaux" (`src/features/travaux/components/`) :**
    *   `TravailForm`: Formulaire principal (dans un `Sheet`) pour créer/modifier un travail, utilisant de nombreux sous-composants de sélection/saisie.
    *   `TravailCard`: Carte affichant un résumé d'un travail existant dans la liste de la page `Travaux.tsx`.
    *   `TravauxList`: Affiche la liste des `TravailCard` pour la pièce sélectionnée.
    *   `PieceSelect`: Composant (liste de boutons) pour sélectionner la pièce active sur la page `Travaux.tsx`.
    *   `TypeTravauxSelect`, `ServiceGroupSelect`, `SousTypeSelect`: Champs `Select` pour choisir la hiérarchie du travail dans le catalogue.
    *   `QuantitySection`, `PriceSection`, `DescriptionSection`: Groupes de champs pour saisir quantité/unité, prix MO/fournitures, et description.
    *   `TvaSelect`, `UniteSelect`, `SurfaceImpacteeSelect`, `MenuiserieTypeSelect`: Champs `Select` pour les options spécifiques d'un travail.
    *   `UpdateServiceModal`: Modale pour modifier rapidement un service de référence.

*   **Fonctionnalité "Admin" (`src/features/admin/components/`) :**
    *   `ClientForm`, `CompanyForm`, `TypeMenuiserieForm`, `TypeTravauxForm`, `SousTypeTravauxForm`: Formulaires (utilisés dans des modales) pour les opérations CRUD sur les données de référence (clients, sociétés, types menuiseries, catalogue travaux).

*   **Fonctionnalité "Recap" (`src/features/recap/components/`) :**
    *   `TravauxRecapContent`: Composant principal organisant le contenu de la page `Recapitulatif.tsx`.
    *   `PropertyInfoCard`: Affiche les infos du bien.
    *   `GlobalTotals`: Affiche les totaux HT/TVA/TTC globaux.
    *   `RecapitulatifTravaux`: Affiche le tableau détaillé des travaux par pièce.
    *   `RoomRecapTable`, `TravailRecapRow`, `TotauxRecap`, `DetailsTravaux`: Composants spécifiques pour structurer le tableau récapitulatif des travaux.
    *   `NoTravauxMessage`: Message affiché si aucun travail n'est défini.

*   **Fonctionnalité "Renovation" (`src/features/renovation/components/`) :**
    *   `AutreSurfaceForm`: Formulaire (dans une modale) pour ajouter/modifier une "autre surface" à une pièce.



### 2. Hooks Personnalisés (Synthèse)

L'application utilise de nombreux hooks personnalisés pour encapsuler et réutiliser la logique métier, l'accès aux contextes, les interactions avec les services, et les comportements complexes. Ils contribuent à une meilleure séparation des préoccupations et à la lisibilité du code des composants.

*   **Gestion de l'État Global Applicatif :**
    *   `useAppState`: Fournit l'accès à l'état global non lié au projet (états des modales, indicateurs, potentiellement `pdfSettings`) et à la fonction `dispatch` du `AppStateContext`.

*   **Gestion du Projet (État Central) :**
    *   `useProject`: Fournit l'accès à l'état complet du projet en cours (`projectState`) et à la fonction `dispatch` du `ProjectContext`. C'est le hook fondamental pour lire et modifier les données du devis.
    *   `useProjectMetadata`: Accès simplifié aux métadonnées (`projectState.metadata`) et à la fonction `updateMetadata` (qui dispatche `UPDATE_METADATA`).
    *   `useRooms`: Fournit la liste des pièces (`projectState.rooms`) et les fonctions (`addRoom`, `updateRoom`, `deleteRoom`) pour manipuler les pièces via le `ProjectContext`.
    *   `useTravaux`: Fournit la liste complète des travaux (`projectState.travaux`) et les fonctions (`getTravauxForPiece`, `addTravail`, `updateTravail`, `deleteTravail`) pour manipuler les travaux via le `ProjectContext`.

*   **Opérations sur le Projet (CRUD, Sauvegarde/Chargement) :**
    *   `useProjectOperations`: **Hook central pour les actions majeures.** Encapsule la logique de création (`createProject`), chargement (`loadProject`), sauvegarde (`saveProject`), sauvegarde sous (`saveProjectAs`), et suppression (`deleteProject`). Interagit avec `useProject`, `useAppState`, et les services `projectSaveService`/`projectBaseService`. Maintient l'ID du projet courant.
    *   `useProjectStorage`: Encapsule les interactions de **bas niveau avec le stockage persistant** (localStorage et/ou Supabase `projects_save`) pour sauvegarder, charger et supprimer l'état du projet (`ProjectState`). Utilisé par `useProjectOperations`.
    *   `useAutoSave`: Implémente la **sauvegarde automatique** en arrière-plan. Observe `projectState.isDirty` et appelle `useProjectOperations.saveProject` après un délai (debounce) si des modifications existent sur un projet déjà sauvegardé.
    *   `useSaveLoadWarning`: Gère l'**avertissement du navigateur** (`onbeforeunload`) si l'utilisateur tente de quitter la page avec des modifications non sauvegardées (`projectState.isDirty`).

*   **Gestion des Données de Référence (Catalogues) :**
    *   `useTravauxTypes`: Fournit l'accès à l'état (`types` contenant la hiérarchie types/groupes/services) et au `dispatch` du `TravauxTypesContext`. Utilisé pour afficher le catalogue et pour l'administration (`AdminTravaux.tsx`).
    *   `useClients`: Fournit l'accès à l'état (`clients`) et au `dispatch` du `ClientsContext`. Utilisé pour les listes de sélection et l'administration (`Parametres.tsx`).
    *   `useMenuiseriesTypes` (alias `useMenuiseries`): Fournit l'accès à l'état (`typesMenuiseries`) et au `dispatch` du `MenuiseriesTypesContext`. Utilisé pour les listes de sélection et l'administration.
    *   `useAutresSurfaces`: Fournit l'accès à l'état (`autresSurfaces`, liste des types de référence) et au `dispatch` du `AutresSurfacesContext`.

*   **Génération PDF et Paramètres :**
    *   `useReactPdfGeneration`: **Orchestre la génération PDF actuelle** avec `@react-pdf/renderer`. Récupère les données (`useProject`) et les paramètres (`usePdfSettings`), assemble le `<Document>` React, génère le `Blob` via `pdf().toBlob()`, et gère l'ouverture/sauvegarde. Fournit l'état `isGenerating`.
    *   `usePdfSettings`: Gère l'état des **paramètres de configuration PDF (`PdfSettings`)**. Charge les paramètres (via `useAppState` ou stockage), les valide (Zod), permet leur mise à jour (`updatePdfSettings`), et déclenche leur persistance.

*   **Utilitaires et Logique Spécifique :**
    *   `useCalculSurfaces`: Fournit des **fonctions de calcul de surfaces** (murs, plafond, sol, nette) basées sur un objet `Room`.
    *   `useLocalStorage`: Hook générique pour la persistance dans le `localStorage`.
    *   `useProjectInfo`: Hook spécifique à la page `InfosChantier`, **agrégeant** les données de `useProject`, `useProjectOperations`, et potentiellement d'autres sources pour simplifier les props passées au layout.

*   **Hooks Obsolètes/Redondants Probables :**
    *   `useDevisGeneration`: Lié à l'ancienne génération PDF.
    *   `useAutresSurfacesWithSupabase`, `useRoomCustomItemsWithSupabase`: Semblent liés à une approche où les détails des pièces étaient gérés directement dans Supabase, et non dans le JSONB du projet.
    *   `useProjectOperations` (dans `features/chantier/hooks`): Probablement redondant avec le hook global `useProjectOperations`.




    ## VI. Services et Accès Données (Supabase)

Cette section décrit comment l'application interagit avec les services externes, principalement la plateforme Supabase pour la persistance des données, l'authentification et potentiellement le stockage de fichiers.

### 1. Client Supabase (Synthèse)

*   L'interaction avec Supabase est centralisée via une **instance unique du client JavaScript Supabase** (`@supabase/supabase-js`).
*   Cette instance est initialisée dans le fichier `src/lib/supabase.ts` en utilisant les clés d'API et l'URL du projet Supabase récupérées depuis les variables d'environnement (Vite).
*   Le client est typé à l'aide des types générés (`Database` depuis `src/integrations/supabase/types.ts`), offrant une meilleure sécurité et autocomplétion lors des appels à l'API Supabase.
*   Cette instance (`supabase`) est ensuite importée et utilisée par les différents **services** (`src/services/`) pour effectuer des opérations sur la base de données (SELECT, INSERT, UPDATE, DELETE, RPC).

### 2. Services (Synthèse)

Les services encapsulent la logique d'accès aux données et les interactions avec Supabase pour des entités métier spécifiques. Ils fournissent des fonctions asynchrones (typiquement des `Promise`) que les hooks ou les composants peuvent appeler.

*   **Services CRUD pour Données de Référence :**
    *   `clientsService.ts`: Gère le CRUD pour la table `clients`. Utilisé par `ClientsContext` et `Parametres.tsx`.
    *   `companiesService.ts`: Gère le CRUD pour la table `companies`. Utilisé par `ProjectContext` (via `ProjectMetadata`) et `Parametres.tsx`.
    *   `travauxService.ts`: Gère le CRUD pour les tables du catalogue travaux (`work_types`, `service_groups`, `services`). Utilisé par `TravauxTypesContext` et `AdminTravaux.tsx`.
    *   `menuiseriesService.ts`: Gère le CRUD pour la table `menuiserie_types`. Utilisé par `MenuiseriesTypesContext` et `Parametres.tsx`.
    *   `autresSurfacesService.ts`: Gère la lecture (fetch) des types depuis la table `autres_surfaces`. Utilisé par `AutresSurfacesContext`.

*   **Services de Gestion du Projet :**
    *   `projectSaveService.ts`: **Service clé** pour la persistance de l'état complet du projet (`ProjectState`). Gère la sauvegarde (`saveProject` via `upsert` sur `projects_save`), le chargement (`loadProject` via `select` sur `projects_save`, incluant la validation Zod des données JSONB), et la suppression (`deleteProject` via `delete` sur `projects_save`). Utilisé par `useProjectOperations`.
    *   `projectBaseService.ts` (dans `src/services/project/`): Fournit des fonctions utilitaires de base en mémoire pour l'objet projet (ex: `createEmptyProjectState`). Utilisé par `useProjectOperations`.

*   **Services Utilitaires (en mémoire) :**
    *   `projectUtils.ts` (dans `src/services/project/`): Fonctions de calcul et de recherche sur l'état du projet (ex: `calculateProjectTotals`, `findRoomById`).
    *   `roomItemsService.ts` (dans `src/services/project/`): Fonctions pour manipuler les listes de menuiseries/autres surfaces *dans* un objet `Room`.
    *   `roomWorksService.ts` (dans `src/services/project/`): Fonctions pour filtrer les travaux par pièce (`getTravauxForRoom`).
    *   `roomsService.ts` (dans `src/services/project/`): Fonctions pour créer/manipuler des objets `Room`.

*   **Services Obsolètes (PDF) :**
    *   `devisService.ts`, `pdfGenerationService.ts`, `completePdfService.ts`, `detailedPdfService.ts`, `pdfDocumentService.ts`, `recapPdfService.ts` : Tous liés à l'ancienne méthode de génération PDF (pdfMake) et ne sont plus utilisés par le flux principal.

*   **Services Obsolètes (Autres) :**
    *   `projectService.ts`: Rôle incertain, probablement une relique ou remplacé par les services plus spécifiques dans `src/services/project/`.


    ### 3. Structure Tables Supabase

Voici la description détaillée des tables Supabase identifiées comme étant utilisées ou potentiellement utilisées par l'application, basée sur l'analyse du code source et des types.

#### Table : `auth.users`

*   **Nom exact de la Table :** `auth.users` (Table système de Supabase Auth)
*   **Rôle précis :** Stocke les informations des utilisateurs authentifiés. Utilisé via les Foreign Keys (`user_id`) dans les tables de données pour lier les enregistrements aux utilisateurs qui les possèdent.
*   **Colonnes (Pertinentes) :**
    *   `id`:
        *   Type SQL : `uuid`
        *   Contraintes : `PRIMARY KEY`, `NOT NULL`
        *   Description : Identifiant unique de l'utilisateur.
    *   `created_at`:
        *   Type SQL : `timestamptz`
        *   Contraintes : `NOT NULL`
        *   Description : Horodatage de la création de l'utilisateur.
    *   `email`:
        *   Type SQL : `text`
        *   Contraintes : `UNIQUE`
        *   Description : Adresse email de l'utilisateur (si authentification par email).
*   **Relations Clés (Foreign Keys) :** Cible de FK (`user_id`) depuis les tables `public`.
*   **RLS :** Gérées par Supabase Auth. Les politiques sur `public` utilisent `auth.uid()`.

---

#### Table : `public.clients`

*   **Nom exact de la Table :** `clients`
*   **Rôle précis :** Stocke les informations des clients (particuliers ou professionnels).
*   **Colonnes :**
    *   `id`:
        *   Type SQL : `uuid`
        *   Contraintes : `PRIMARY KEY`, `NOT NULL`, `DEFAULT gen_random_uuid()`
        *   Description : Identifiant unique du client.
    *   `created_at`:
        *   Type SQL : `timestamptz`
        *   Contraintes : `NOT NULL`, `DEFAULT now()`
        *   Description : Horodatage de la création.
    *   `nom`:
        *   Type SQL : `text`
        *   Contraintes : `NOT NULL` (probable)
        *   Description : Nom de famille ou nom de l'entreprise.
    *   `prenom`:
        *   Type SQL : `text`
        *   Contraintes : Peut être `NULL`.
        *   Description : Prénom du client.
    *   `type`:
        *   Type SQL : `text`
        *   Contraintes : Peut être `NULL`. Check possible : `(type = 'particulier' OR type = 'professionnel')`.
        *   Description : Type de client.
    *   `adresse`:
        *   Type SQL : `text`
        *   Contraintes : Peut être `NULL`.
        *   Description : Adresse postale.
    *   `codePostal`:
        *   Type SQL : `text`
        *   Contraintes : Peut être `NULL`.
        *   Description : Code postal.
    *   `ville`:
        *   Type SQL : `text`
        *   Contraintes : Peut être `NULL`.
        *   Description : Ville.
    *   `email`:
        *   Type SQL : `text`
        *   Contraintes : Peut être `NULL`, potentiellement `UNIQUE`. Contrainte `CHECK` de format email probable.
        *   Description : Adresse email.
    *   `telephone`:
        *   Type SQL : `text`
        *   Contraintes : Peut être `NULL`.
        *   Description : Numéro de téléphone.
    *   `notes`:
        *   Type SQL : `text`
        *   Contraintes : Peut être `NULL`.
        *   Description : Notes complémentaires.
    *   `numero_siret`:
        *   Type SQL : `text`
        *   Contraintes : Peut être `NULL`.
        *   Description : Numéro SIRET (pour professionnels).
    *   `user_id`:
        *   Type SQL : `uuid`
        *   Contraintes : `NOT NULL`, `FOREIGN KEY REFERENCES auth.users(id)`
        *   Description : Utilisateur propriétaire de cette fiche client.
*   **Relations Clés (Foreign Keys) :** `user_id` REFERENCES `auth.users(id)`.
*   **RLS Probables :** Activées. `SELECT`, `INSERT`, `UPDATE`, `DELETE` restreintes via `user_id = auth.uid()`.

---

#### Table : `public.companies`

*   **Nom exact de la Table :** `companies`
*   **Rôle précis :** Stocke les informations des entreprises utilisatrices de l'application.
*   **Colonnes :**
    *   `id`:
        *   Type SQL : `uuid`
        *   Contraintes : `PRIMARY KEY`, `NOT NULL`, `DEFAULT gen_random_uuid()`
        *   Description : Identifiant unique de la société.
    *   `created_at`:
        *   Type SQL : `timestamptz`
        *   Contraintes : `NOT NULL`, `DEFAULT now()`
        *   Description : Horodatage de la création.
    *   `name`:
        *   Type SQL : `text`
        *   Contraintes : `NOT NULL`
        *   Description : Nom de la société.
    *   `type`:
        *   Type SQL : `text`
        *   Contraintes : Peut être `NULL`.
        *   Description : Type juridique.
    *   `adresse`:
        *   Type SQL : `text`
        *   Contraintes : Peut être `NULL`.
        *   Description : Adresse du siège social.
    *   `codePostal`:
        *   Type SQL : `text`
        *   Contraintes : Peut être `NULL`.
        *   Description : Code postal.
    *   `ville`:
        *   Type SQL : `text`
        *   Contraintes : Peut être `NULL`.
        *   Description : Ville.
    *   `email`:
        *   Type SQL : `text`
        *   Contraintes : Peut être `NULL`. Contrainte `CHECK` de format email probable.
        *   Description : Email de contact.
    *   `telephone`:
        *   Type SQL : `text`
        *   Contraintes : Peut être `NULL`.
        *   Description : Téléphone de contact.
    *   `numero_siret`:
        *   Type SQL : `text`
        *   Contraintes : Peut être `NULL`, potentiellement `UNIQUE`.
        *   Description : Numéro SIRET.
    *   `logo_url`:
        *   Type SQL : `text`
        *   Contraintes : Peut être `NULL`.
        *   Description : URL du logo (ex: Supabase Storage URL).
    *   `slogan`:
        *   Type SQL : `text`
        *   Contraintes : Peut être `NULL`.
        *   Description : Slogan de l'entreprise.
    *   `user_id`:
        *   Type SQL : `uuid`
        *   Contraintes : `NOT NULL`, `FOREIGN KEY REFERENCES auth.users(id)`
        *   Description : Utilisateur propriétaire de cette fiche société.
*   **Relations Clés (Foreign Keys) :** `user_id` REFERENCES `auth.users(id)`.
*   **RLS Probables :** Activées. `SELECT`, `INSERT`, `UPDATE`, `DELETE` restreintes via `user_id = auth.uid()`.

---

#### Table : `public.work_types`

*   **Nom exact de la Table :** `work_types`
*   **Rôle précis :** Stocke les catégories principales de travaux (catalogue de référence).
*   **Colonnes :**
    *   `id`:
        *   Type SQL : `uuid`
        *   Contraintes : `PRIMARY KEY`, `NOT NULL`, `DEFAULT gen_random_uuid()`
        *   Description : Identifiant unique du type de travaux.
    *   `created_at`:
        *   Type SQL : `timestamptz`
        *   Contraintes : `NOT NULL`, `DEFAULT now()`
        *   Description : Horodatage de la création.
    *   `name`:
        *   Type SQL : `text`
        *   Contraintes : `NOT NULL`, `UNIQUE` (probable)
        *   Description : Nom du type de travaux.
    *   `description`:
        *   Type SQL : `text`
        *   Contraintes : Peut être `NULL`.
        *   Description : Description.
    *   `icon`:
        *   Type SQL : `text`
        *   Contraintes : Peut être `NULL`.
        *   Description : Nom de l'icône associée.
    *   `user_id`:
        *   Type SQL : `uuid`
        *   Contraintes : `FOREIGN KEY REFERENCES auth.users(id)`. Peut être `NULL` (si catalogue global partagé) ou `NOT NULL` (si catalogue spécifique à l'utilisateur). Le code actuel suggère une gestion par utilisateur.
        *   Description : Utilisateur propriétaire (si applicable).
*   **Relations Clés (Foreign Keys) :** `user_id` REFERENCES `auth.users(id)` (si applicable).
*   **RLS Probables :** Activées. `SELECT`: `user_id IS NULL OR user_id = auth.uid()`. `INSERT`/`UPDATE`/`DELETE`: `user_id = auth.uid()`.

---

#### Table : `public.service_groups`

*   **Nom exact de la Table :** `service_groups`
*   **Rôle précis :** Stocke les groupes de services/sous-catégories au sein d'un type de travaux.
*   **Colonnes :**
    *   `id`:
        *   Type SQL : `uuid`
        *   Contraintes : `PRIMARY KEY`, `NOT NULL`, `DEFAULT gen_random_uuid()`
        *   Description : Identifiant unique du groupe de services.
    *   `created_at`:
        *   Type SQL : `timestamptz`
        *   Contraintes : `NOT NULL`, `DEFAULT now()`
        *   Description : Horodatage de la création.
    *   `name`:
        *   Type SQL : `text`
        *   Contraintes : `NOT NULL`
        *   Description : Nom du groupe.
    *   `work_type_id`:
        *   Type SQL : `uuid`
        *   Contraintes : `NOT NULL`, `FOREIGN KEY REFERENCES public.work_types(id) ON DELETE CASCADE` (probable)
        *   Description : Type de travaux parent.
*   **Relations Clés (Foreign Keys) :** `work_type_id` REFERENCES `public.work_types(id)`.
*   **RLS Probables :** Activées. Les opérations dépendent des droits sur le `work_type` parent (via une jointure dans la policy ou en assumant que `work_types.user_id` est propagé/vérifié). Ex: `SELECT` permis si `(SELECT user_id FROM work_types WHERE id = work_type_id)` est `NULL` ou égal à `auth.uid()`.

---

#### Table : `public.services`

*   **Nom exact de la Table :** `services`
*   **Rôle précis :** Stocke les prestations unitaires détaillées (catalogue de référence).
*   **Colonnes :**
    *   `id`:
        *   Type SQL : `uuid`
        *   Contraintes : `PRIMARY KEY`, `NOT NULL`, `DEFAULT gen_random_uuid()`
        *   Description : Identifiant unique du service/prestation.
    *   `created_at`:
        *   Type SQL : `timestamptz`
        *   Contraintes : `NOT NULL`, `DEFAULT now()`
        *   Description : Horodatage de la création.
    *   `name`:
        *   Type SQL : `text`
        *   Contraintes : `NOT NULL`
        *   Description : Nom de la prestation.
    *   `description`:
        *   Type SQL : `text`
        *   Contraintes : Peut être `NULL`.
        *   Description : Description détaillée.
    *   `unite`:
        *   Type SQL : `text`
        *   Contraintes : `NOT NULL`
        *   Description : Unité de mesure (m², ml, u, forfait).
    *   `labor_price`:
        *   Type SQL : `numeric` (ou `float8`)
        *   Contraintes : `NOT NULL`, `DEFAULT 0`. `CHECK (labor_price >= 0)`.
        *   Description : Prix unitaire main d'œuvre HT.
    *   `supply_price`:
        *   Type SQL : `numeric` (ou `float8`)
        *   Contraintes : `NOT NULL`, `DEFAULT 0`. `CHECK (supply_price >= 0)`.
        *   Description : Prix unitaire fournitures HT.
    *   `taux_tva`:
        *   Type SQL : `numeric` (ou `float8`)
        *   Contraintes : `NOT NULL`. `CHECK (taux_tva >= 0)`.
        *   Description : Taux de TVA applicable (%).
    *   `group_id`:
        *   Type SQL : `uuid`
        *   Contraintes : `NOT NULL`, `FOREIGN KEY REFERENCES public.service_groups(id) ON DELETE CASCADE` (probable)
        *   Description : Groupe parent.
*   **Relations Clés (Foreign Keys) :** `group_id` REFERENCES `public.service_groups(id)`.
*   **RLS Probables :** Activées. Opérations permises si l'utilisateur a les droits sur le `service_group` parent (qui dépendent eux-mêmes des droits sur le `work_type`).

---

#### Table : `public.menuiserie_types`

*   **Nom exact de la Table :** `menuiserie_types`
*   **Rôle précis :** Stocke les définitions des types de menuiseries de référence.
*   **Colonnes :**
    *   `id`:
        *   Type SQL : `uuid`
        *   Contraintes : `PRIMARY KEY`, `NOT NULL`, `DEFAULT gen_random_uuid()`
        *   Description : Identifiant unique du type de menuiserie.
    *   `created_at`:
        *   Type SQL : `timestamptz`
        *   Contraintes : `NOT NULL`, `DEFAULT now()`
        *   Description : Horodatage de la création.
    *   `name`:
        *   Type SQL : `text`
        *   Contraintes : `NOT NULL`, `UNIQUE` (probable)
        *   Description : Nom du type de menuiserie.
    *   `hauteur`:
        *   Type SQL : `numeric` (ou `float8`)
        *   Contraintes : `NOT NULL`, `CHECK (hauteur > 0)`.
        *   Description : Hauteur par défaut en cm.
    *   `largeur`:
        *   Type SQL : `numeric` (ou `float8`)
        *   Contraintes : `NOT NULL`, `CHECK (largeur > 0)`.
        *   Description : Largeur par défaut en cm.
    *   `surface_impactee`:
        *   Type SQL : `text`
        *   Contraintes : Peut être `NULL`. Potentiellement `CHECK (surface_impactee IN ('Mur', 'Plafond', 'Sol', 'Aucune'))`.
        *   Description : Surface impactée par défaut.
    *   `impacte_plinthe`:
        *   Type SQL : `boolean`
        *   Contraintes : `NOT NULL`, `DEFAULT FALSE`
        *   Description : Indique si impacte les plinthes par défaut.
    *   `description`:
        *   Type SQL : `text`
        *   Contraintes : Peut être `NULL`.
        *   Description : Description du type.
    *   `user_id`:
        *   Type SQL : `uuid`
        *   Contraintes : `FOREIGN KEY REFERENCES auth.users(id)`. Peut être `NULL` ou `NOT NULL`.
        *   Description : Utilisateur propriétaire (si applicable).
*   **Relations Clés (Foreign Keys) :** `user_id` REFERENCES `auth.users(id)` (si applicable).
*   **RLS Probables :** Activées. `SELECT`: `user_id IS NULL OR user_id = auth.uid()`. `INSERT`/`UPDATE`/`DELETE`: `user_id = auth.uid()`.

---

#### Table : `public.autres_surfaces`

*   **Nom exact de la Table :** `autres_surfaces`
*   **Rôle précis :** Stocke les définitions des types d'autres surfaces de référence.
*   **Colonnes :**
    *   `id`:
        *   Type SQL : `uuid`
        *   Contraintes : `PRIMARY KEY`, `NOT NULL`, `DEFAULT gen_random_uuid()`
        *   Description : Identifiant unique du type d'autre surface.
    *   `created_at`:
        *   Type SQL : `timestamptz`
        *   Contraintes : `NOT NULL`, `DEFAULT now()`
        *   Description : Horodatage de la création.
    *   `name`:
        *   Type SQL : `text`
        *   Contraintes : `NOT NULL`, `UNIQUE` (probable)
        *   Description : Nom du type d'autre surface.
    *   `unite`:
        *   Type SQL : `text`
        *   Contraintes : `NOT NULL`. Potentiellement `CHECK (unite IN ('m2', 'ml', 'u'))`.
        *   Description : Unité de mesure par défaut.
    *   `description`:
        *   Type SQL : `text`
        *   Contraintes : Peut être `NULL`.
        *   Description : Description optionnelle.
    *   `user_id`:
        *   Type SQL : `uuid`
        *   Contraintes : `FOREIGN KEY REFERENCES auth.users(id)`. Peut être `NULL` ou `NOT NULL`.
        *   Description : Utilisateur propriétaire (si applicable).
*   **Relations Clés (Foreign Keys) :** `user_id` REFERENCES `auth.users(id)` (si applicable).
*   **RLS Probables :** Activées. `SELECT`: `user_id IS NULL OR user_id = auth.uid()`. `INSERT`/`UPDATE`/`DELETE`: `user_id = auth.uid()`.

---

#### Table : `public.projects_save`

*   **Nom exact de la Table :** `projects_save`
*   **Rôle précis :** Stocke l'état complet des projets de devis sauvegardés par les utilisateurs.
*   **Colonnes :**
    *   `id`:
        *   Type SQL : `uuid`
        *   Contraintes : `PRIMARY KEY`, `NOT NULL`, `DEFAULT gen_random_uuid()`
        *   Description : Identifiant unique du projet sauvegardé.
    *   `created_at`:
        *   Type SQL : `timestamptz`
        *   Contraintes : `NOT NULL`, `DEFAULT now()`
        *   Description : Horodatage de la création de la sauvegarde.
    *   `updated_at`:
        *   Type SQL : `timestamptz`
        *   Contraintes : Peut être `NULL`. Trigger probable pour mettre à jour `ON UPDATE`.
        *   Description : Horodatage de la dernière modification.
    *   `user_id`:
        *   Type SQL : `uuid`
        *   Contraintes : `NOT NULL`, `FOREIGN KEY REFERENCES auth.users(id)`
        *   Description : Utilisateur propriétaire du projet.
    *   `name`:
        *   Type SQL : `text`
        *   Contraintes : `NOT NULL`. Potentiellement `UNIQUE` contrainte sur (`user_id`, `name`).
        *   Description : Nom du projet.
    *   `project_data`:
        *   Type SQL : `jsonb`
        *   Contraintes : `NOT NULL`
        *   Description : Stocke l'état complet du projet (`ProjectState`) en JSONB.
*   **Relations Clés (Foreign Keys) :** `user_id` REFERENCES `auth.users(id)`.
*   **RLS Probables :** **Activées et Critiques.** `SELECT`, `INSERT`, `UPDATE`, `DELETE` **doivent** être restreintes par `user_id = auth.uid()`.

---

#### Table : `public.app_state`

*   **Nom exact de la Table :** `app_state`
*   **Rôle précis :** Stocke les paramètres globaux de l'application ou les préférences spécifiques à l'utilisateur (ex: paramètres PDF par défaut).
*   **Colonnes :**
    *   `user_id`:
        *   Type SQL : `uuid`
        *   Contraintes : `PRIMARY KEY`, `NOT NULL`, `FOREIGN KEY REFERENCES auth.users(id)`
        *   Description : Utilisateur à qui appartiennent ces paramètres.
    *   `created_at`:
        *   Type SQL : `timestamptz`
        *   Contraintes : `NOT NULL`, `DEFAULT now()`
        *   Description : Horodatage de la création.
    *   `updated_at`:
        *   Type SQL : `timestamptz`
        *   Contraintes : Peut être `NULL`. Trigger probable pour `ON UPDATE`.
        *   Description : Horodatage de la dernière modification.
    *   `settings_data`:
        *   Type SQL : `jsonb`
        *   Contraintes : Peut être `NULL` ou `NOT NULL` avec `DEFAULT '{}'::jsonb`.
        *   Description : Stocke l'objet JSON des paramètres (ex: `PdfSettings`).
*   **Relations Clés (Foreign Keys) :** `user_id` REFERENCES `auth.users(id)`.
*   **RLS Probables :** Activées. `SELECT`, `INSERT` (avec `ON CONFLICT DO UPDATE` pour l'unicité par `user_id`), `UPDATE`, `DELETE` restreintes par `user_id = auth.uid()`.

---

#### Tables `public.rooms` et `public.room_works`

*   **Statut :** **Utilisation Incertaine/Improbable dans le flux principal.**
*   **Analyse :** L'état du projet, y compris les pièces et les travaux, semble entièrement géré au sein de la colonne `project_data` (JSONB) de la table `projects_save`. Il n'y a pas d'indication dans les services principaux (`projectSaveService`, `useProjectOperations`, `useRooms`, `useTravaux`) que ces tables soient utilisées pour stocker les données d'un projet *spécifique*. Elles pourraient être des artefacts ou servir à d'autres fonctionnalités non auditées. Leur documentation détaillée n'est pas pertinente pour décrire le fonctionnement actuel du module devis.





## VII. Flux de Données Spécifiques Détaillés

Cette section décrit les séquences précises des opérations clés de l'application, depuis l'action de l'utilisateur dans l'interface utilisateur jusqu'aux interactions avec l'état global et la base de données Supabase.

### 1. Flux de Sauvegarde ("Enregistrer")

Ce flux décrit comment l'état actuel du projet de devis est enregistré dans la base de données Supabase.

1.  **Déclencheur UI :** Clic sur le bouton "Enregistrer" (ex: icône `Save` dans `src/components/layout/ProjectBar.tsx`).
2.  **Fonction Appelée :** Le `onClick` appelle `handleSaveProject` fourni par le hook `useProjectOperations`.
3.  **Hook Appelé :** `useProjectOperations.handleSaveProject()`.
4.  **Logique dans le Hook :**
    *   Récupère `projectState` via `useProject()`.
    *   Vérifie `projectState.id`.
    *   Si `projectState.id` existe : Appel `projectSaveService.saveProject(projectState)`.
    *   Si `projectState.id` est `null` : Ouvre la modale "Enregistrer Sous" via `useAppState` (déclenche le flux 2).
5.  **Appel au Service (si projet existant) :** `projectSaveService.saveProject(projectState)`.
6.  **Appel Supabase par le Service (si projet existant) :**
    *   **Table :** `public.projects_save`.
    *   **Opération :** `UPDATE` ou `UPSERT` (si `saveProject` utilise upsert). Probablement `update({ project_data: projectState, name: projectState.metadata.nomProjet, /*...autres champs meta*/ })`.
    *   **Filtres :** `.eq('id', projectState.id)`. `user_id = auth.uid()` (via RLS).
    *   **Modificateurs :** `.select().single()` pour confirmer/retourner la mise à jour.
7.  **Mise à jour de l'état :**
    *   Si succès Supabase, `useProjectOperations` appelle `dispatch({ type: 'SET_DIRTY', payload: false })` via `useProject()`.
    *   Mise à jour de l'état interne de sauvegarde (ex: `updateSavedState()`).
8.  **Feedback Utilisateur :** `toast.success("Projet enregistré !")`.

### 2. Flux de Sauvegarde Sous ("Enregistrer Sous")

Ce flux crée un nouvel enregistrement de projet avec un nouveau nom.

1.  **Déclencheur UI :** Clic sur le bouton "Enregistrer Sous" (ex: icône `SaveAll` dans `src/components/layout/ProjectBar.tsx`).
2.  **Fonction Appelée :** Le `onClick` appelle `handleOpenSaveAsModal` (ou similaire) qui met à jour un état dans `useAppState` ou localement pour ouvrir la modale.
3.  **Modale Affichée :** `src/components/layout/SaveAsDialog.tsx` s'affiche.
4.  **Saisie Utilisateur :** L'utilisateur saisit un `newProjectName` dans l'`Input` de la modale.
5.  **Déclencheur UI (Modale) :** Clic sur le bouton "Enregistrer" de la modale `SaveAsDialog`.
6.  **Fonction Appelée (Modale) :** Le `onClick` appelle `handleSave` (fonction interne de `SaveAsDialog`).
7.  **Hook Appelé :** `SaveAsDialog.handleSave` appelle `useProjectOperations().saveProjectAs(newProjectName)`.
8.  **Logique dans le Hook (`saveProjectAs`) :**
    *   Récupère `projectState` via `useProject()`.
    *   Crée une copie de `projectState`.
    *   Met à jour `copiedState.metadata.nomProjet = newProjectName`.
    *   **Important : Met `copiedState.id = null` (ou génère un nouvel ID local) pour forcer une insertion.**
    *   Appelle `projectSaveService.saveProject(copiedState)` (ou une fonction `saveNewProject` dédiée).
9.  **Appel au Service :** `projectSaveService.saveProject(copiedState)`.
10. **Appel Supabase par le Service :**
    *   **Table :** `public.projects_save`.
    *   **Opération :** `INSERT`.
    *   **Données Envoyées :** `{ name: newProjectName, user_id: auth.uid(), project_data: copiedState }`.
    *   **Modificateurs :** `.select().single()` pour récupérer le nouvel enregistrement avec l'ID généré par la DB.
11. **Mise à jour de l'état :**
    *   Si succès Supabase, `useProjectOperations` reçoit le `savedProject` (avec le nouvel ID).
    *   Appelle `dispatch({ type: 'LOAD_PROJECT', payload: savedProject.project_data })` via `useProject()` pour charger ce nouveau projet comme projet courant. (Alternative: `UPDATE_PROJECT_ID`, `UPDATE_METADATA`, `SET_DIRTY(false)`).
    *   Met à jour `currentProjectId` dans `useProjectOperations` avec `savedProject.id`.
    *   Mise à jour de l'état interne de sauvegarde.
    *   Appelle `onClose` de la modale `SaveAsDialog`.
12. **Feedback Utilisateur :** `toast.success("Projet enregistré sous...")`.

### 3. Flux de Chargement (`loadProject`)

Ce flux charge un projet existant depuis la base de données.

1.  **Déclencheur UI :** Clic sur le bouton "Ouvrir" (ex: icône `FolderOpen` dans `ProjectBar.tsx`).
2.  **Fonction Appelée :** `onClick` appelle `handleOpenOpenProjectModal` qui ouvre la modale.
3.  **Modale Affichée :** `src/components/layout/OpenProjectDialog.tsx` s'affiche. Le composant `ProjectList` est rendu à l'intérieur.
4.  **Chargement Liste Projets :** `OpenProjectDialog` (ou `ProjectList`) charge la liste des projets (potentiellement via `useEffect` et un appel service `projectSaveService.listProjects()`).
5.  **Déclencheur UI (Modale) :** L'utilisateur clique sur une ligne/bouton de projet dans `ProjectList`.
6.  **Fonction Appelée (Modale) :** Le `onClick` appelle `handleSelectProject(projectId)` (prop `onSelectProject` de `ProjectList`).
7.  **Hook Appelé :** `OpenProjectDialog.handleSelectProject` appelle `useProjectOperations().loadProject(projectId)`.
8.  **Logique dans le Hook (`loadProject`) :** Appelle `projectSaveService.loadProject(projectId)`.
9.  **Appel au Service :** `projectSaveService.loadProject(projectId)`.
10. **Appel Supabase par le Service :**
    *   **Table :** `public.projects_save`.
    *   **Opération :** `SELECT`.
    *   **Données Sélectionnées :** `project_data, id, name, ...`
    *   **Filtres :** `.eq('id', projectId)`. `user_id = auth.uid()` (RLS).
    *   **Modificateurs :** `.single()`.
11. **Validation des Données Chargées :** Le service ou le hook valide le `project_data` (JSONB) reçu avec un schéma Zod (`ProjectStateSchema`).
12. **Mise à jour de l'état :**
    *   Si chargement/validation OK, `useProjectOperations` appelle `dispatch({ type: 'LOAD_PROJECT', payload: loadedProjectState })` via `useProject()`.
    *   Met à jour `currentProjectId` dans `useProjectOperations` avec `projectId`.
    *   Mise à jour de l'état interne de sauvegarde (marqué comme non-sale).
    *   Appelle `onClose` de la modale `OpenProjectDialog`.
13. **Feedback Utilisateur :** `toast.success("Projet chargé !")`.

### 4. Flux de Création Nouveau Projet (`createNewProject`)

Ce flux réinitialise l'application pour un nouveau devis vierge.

1.  **Déclencheur UI :** Clic sur le bouton "Nouveau" (ex: icône `FilePlus` dans `ProjectBar.tsx`).
2.  **Fonction Appelée :** `onClick` appelle `handleOpenNewProjectModal` qui ouvre la modale.
3.  **Modale Affichée :** `src/components/layout/NewProjectDialog.tsx` s'affiche.
4.  **Logique Modale :** Vérifie `projectState.isDirty`. Si oui, affiche `AlertDialog` de confirmation.
5.  **Déclencheur UI (Modale) :** Clic sur "Créer un nouveau projet" (si non sale) ou "Continuer" (`AlertDialogAction`).
6.  **Fonction Appelée (Modale) :** Le `onClick` appelle `handleCreateNewProject`.
7.  **Hook Appelé :** `NewProjectDialog.handleCreateNewProject` appelle `useProjectOperations().createProject()`.
8.  **Logique dans le Hook (`createProject`) :** Appelle `projectBaseService.createEmptyProjectState()`.
9.  **Appel au Service :** `projectBaseService.createEmptyProjectState()` retourne un `emptyProjectState`.
10. **Appel Supabase :** Aucun.
11. **Mise à jour de l'état :**
    *   `useProjectOperations` appelle `dispatch({ type: 'LOAD_PROJECT', payload: emptyProjectState })` via `useProject()`.
    *   Met à jour `currentProjectId` dans `useProjectOperations` à `null` (ou le nouvel ID généré localement).
    *   Mise à jour de l'état interne de sauvegarde.
    *   Appelle `onClose` de la modale `NewProjectDialog`.
12. **Navigation/Redirection :** Redirection probable vers `/chantier` (gérée par le hook ou le composant).

### 5. Flux de Génération PDF React

Ce flux génère le PDF final avec `@react-pdf/renderer`.

1.  **Déclencheur UI :** Clic sur "Générer Devis React-PDF" dans `src/pages/EditionDevis.tsx`.
2.  **Appel de Hook :** `onClick` appelle `generateReactPdf()` de `useReactPdfGeneration()`.
3.  **Logique interne `generateReactPdf` :**
    *   `isGenerating` -> `true`.
    *   Récupère `projectState` (via `useProject`) et `pdfSettings` (via `usePdfSettings`).
    *   Assemble le JSX : `<Document><CoverDocumentContent .../><DetailsPage .../><RecapPage .../><CGVPage .../></Document>`. Passe `projectState` et `pdfSettings` en props aux composants enfants.
    *   Appelle `pdf(<MonComposantDocument />).toBlob()`. C'est l'appel asynchrone à React PDF.
    *   **(await)** Attend que le `Blob` soit généré.
    *   Utilise `file-saver` ou `URL.createObjectURL` et `window.open` pour afficher/télécharger le `Blob`.
    *   Gère les erreurs avec `toast.error`.
    *   `isGenerating` -> `false` (dans `finally`).
4.  **Feedback Utilisateur :** Bouton désactivé, texte changeant. Toast succès/erreur. Le PDF s'ouvre ou se télécharge.

### 6. Flux de Chargement/Sauvegarde des Paramètres PDF

Ce flux gère les préférences de l'utilisateur pour l'apparence du PDF.

1.  **Chargement Initial (dans `usePdfSettings`) :**
    *   **Trigger :** Montage du composant utilisant `usePdfSettings` (ex: `EditionDevis.tsx`).
    *   **Effet :** `useEffect([])` dans `usePdfSettings`.
    *   **Logique :**
        *   Appelle une fonction pour charger les settings (ex: `appState.state.pdfSettings` via `useAppState`, ou `settingsService.loadPdfSettings()`).
        *   Valide les données chargées avec `PdfSettingsSchema` (Zod).
        *   Met à jour l'état local `pdfSettings` du hook avec les données valides ou des valeurs par défaut. Met `isLoading` à `false`.

2.  **Mise à jour (depuis `PdfSettingsForm`) :**
    *   **Trigger UI :** L'utilisateur modifie un contrôle dans `src/features/devis/components/pdf-settings/` (ex: `ColorPicker`, `NumberControl`).
    *   **Logique Composant UI :** Le composant enfant (ex: `ColorPicker`) appelle sa prop `onChange`.
    *   **Logique `PdfSettingsForm` (ou parent) :** Reçoit le changement via la prop `onChange` du composant enfant. Appelle `updatePdfSettings` du hook `usePdfSettings`.
    *   **Appel Hook :** `usePdfSettings().updatePdfSettings(updates: Partial<PdfSettings>)`.
    *   **Logique `updatePdfSettings` :**
        *   Fusionne `updates` avec l'état `pdfSettings` local.
        *   Valide le nouvel objet `PdfSettings` complet avec `PdfSettingsSchema`.
        *   Si valide : Met à jour l'état local `pdfSettings`. Déclenche la persistance.
        *   Si invalide : Affiche `toast.error`.
    *   **Persistance (déclenchée par `updatePdfSettings`) :**
        *   Option A (via AppState) : Appelle `useAppState().dispatch({ type: 'UPDATE_PDF_SETTINGS', payload: newSettings })`. Le `AppStateProvider` gère la sauvegarde (ex: vers `localStorage` ou Supabase `app_state`).
        *   Option B (via Service) : Appelle `settingsService.savePdfSettings(newSettings)`.
    *   **Appel Supabase (si persistance via DB) :**
        *   **Table :** `public.app_state`.
        *   **Opération :** `UPDATE` ou `UPSERT`.
        *   **Données :** `{ settings_data: newSettings }`.
        *   **Filtres :** `.eq('user_id', auth.uid())`.
    *   **Feedback Utilisateur :** Potentiellement un toast discret de sauvegarde auto, ou un toast d'erreur si validation échoue.





    ## VIII. Système de Génération PDF (@react-pdf/renderer)

L'application utilise la librairie `@react-pdf/renderer` pour générer les documents PDF des devis. Cette approche permet de définir la structure et le style du PDF en utilisant des composants React.

### 1. Flux Global de Génération

Le processus de génération est orchestré par le hook `useReactPdfGeneration` et suit les étapes suivantes (détaillées dans la Section VII.5) :

1.  **Déclenchement :** L'utilisateur clique sur le bouton "Générer Devis React-PDF" sur la page `EditionDevis.tsx`.
2.  **Appel du Hook :** La fonction `generateReactPdf()` du hook `useReactPdfGeneration` est appelée.
3.  **Récupération des Données :** Le hook récupère l'état actuel du projet (`projectState` via `useProject`) et les paramètres de configuration PDF (`pdfSettings` via `usePdfSettings`).
4.  **Assemblage du Document :** Le hook définit la structure du document en utilisant le composant `<Document>` de `@react-pdf/renderer`. Il y inclut les composants React représentant chaque page ou section majeure du devis (`CoverDocumentContent`, `DetailsPage`, `RecapPage`, `CGVPage`), en leur passant les données et paramètres nécessaires.
5.  **Rendu Asynchrone :** L'appel à `pdf(<MonComposantDocument />).toBlob()` est effectué. `@react-pdf/renderer` prend en charge le rendu de l'arbre de composants React en un `Blob` contenant les données binaires du fichier PDF.
6.  **Ouverture/Sauvegarde :** Une fois le `Blob` généré, il est utilisé pour ouvrir le PDF dans un nouvel onglet ou proposer son téléchargement à l'utilisateur (via `URL.createObjectURL` ou `file-saver`).
7.  **Gestion d'État :** Le hook maintient un état `isGenerating` pour fournir un retour visuel pendant le processus.

### 2. Composants PDF (`src/services/pdf/react-pdf/components/`)

Ces composants React sont spécifiquement conçus pour être utilisés avec `@react-pdf/renderer`. Ils utilisent les primitives fournies par la librairie (`<View>`, `<Text>`, `<Image>`, `<Page>`, `<Document>`) pour construire la structure visuelle du PDF.

*   **Composants de Page Principale (`<Page>`) :**
    *   `DetailsPage.tsx`, `RecapPage.tsx`, `CGVPage.tsx`:
        *   **Rôle :** Représentent une page A4 complète dans le document.
        *   **Props Principales :** `projectState: ProjectState`, `pdfSettings: PdfSettings`.
        *   **Structure JSX :** Utilisent le composant `<Page>` de `@react-pdf/renderer`, en configurant la taille (`A4`) et les marges (`style={{ paddingTop: margins.top, ... }}`) via `pdfSettings.margins`. Ils incluent les composants `PageHeader`, `PageFooter` et le composant de contenu spécifique (`DetailsPageContent`, `RecapPageContent`, `CGVPageContent`).

*   **Composants de Contenu (Corps de page) :**
    *   `CoverDocumentContent.tsx`:
        *   **Rôle :** Rend la structure et le contenu de la page de couverture (logo, infos société/client/projet, slogan). N'inclut PAS `<Page>`.
        *   **Props Principales :** `projectState`, `pdfSettings`.
        *   **Structure JSX :** Organise les différents composants de section (`HeaderSection`, `ClientSection`, `ProjectSection`, etc.) dans des `<View>` avec des `VerticalSpacer`.
    *   `DetailsPageContent.tsx`:
        *   **Rôle :** Rend le contenu détaillé des travaux, pièce par pièce, avec des tableaux ou des listes. N'inclut PAS `<Page>`.
        *   **Props Principales :** `projectState`, `pdfSettings`.
        *   **Structure JSX :** Itère sur `projectState.rooms`, affiche un titre pour chaque pièce, puis itère sur les `travaux` filtrés pour cette pièce, affichant chaque travail dans une ligne structurée (`<View>`) avec plusieurs `<Text>` pour les détails (description, quantité, prix...).
    *   `RecapPageContent.tsx`:
        *   **Rôle :** Rend le contenu de la page récapitulative, affichant les totaux globaux. N'inclut PAS `<Page>`.
        *   **Props Principales :** `projectState`, `pdfSettings`.
        *   **Structure JSX :** Affiche un titre puis une structure (`<View>`) présentant les totaux HT, TVA, TTC via des `<Text>`.
    *   `CGVPageContent.tsx`:
        *   **Rôle :** Rend le texte statique des Conditions Générales de Vente. N'inclut PAS `<Page>`.
        *   **Props Principales :** `pdfSettings`.
        *   **Structure JSX :** Affiche le texte des CGV structuré en titres et paragraphes (`<Text>`) dans une `<View>`.

*   **Composants Communs (`src/services/pdf/react-pdf/components/common/`) :**
    *   `PageHeader.tsx`:
        *   **Rôle :** En-tête réutilisable affiché en haut de chaque page (sauf potentiellement la couverture). Affiche logo et infos devis. Fixe par rapport au contenu de la page.
        *   **Props Principales :** `projectMetadata`, `pdfSettings`.
        *   **Structure JSX :** `<View>` contenant `<Image>` pour le logo et des `<Text>` pour les infos, positionnés de manière fixe.
    *   `PageFooter.tsx`:
        *   **Rôle :** Pied de page réutilisable affiché en bas de chaque page. Affiche pagination et mentions légales. Fixe par rapport au contenu de la page.
        *   **Props Principales :** `projectMetadata`, `pdfSettings`, `pageNumber`, `totalPages`.
        *   **Structure JSX :** `<View>` contenant des `<Text>` pour la pagination et les infos, positionnés de manière fixe.
    *   `VerticalSpacer.tsx`:
        *   **Rôle :** Composant simple pour ajouter un espace vertical.
        *   **Props Principales :** `height: number`.
        *   **Structure JSX :** `<View style={{ height }} />`.

*   **Composants de Section (Utilisés principalement dans `CoverDocumentContent`) :**
    *   `ClientSection.tsx`, `CompanyAddressSection.tsx`, `ContactSection.tsx`, `HeaderSection.tsx`, `ProjectSection.tsx`, `QuoteInfoSection.tsx`, `SloganSection.tsx`:
        *   **Rôle :** Affichent des blocs d'informations spécifiques (Client, Société, Projet, Devis, Slogan) en utilisant des `<View>` et `<Text>`.
        *   **Props Principales :** Reçoivent `projectMetadata` (ou une partie) et `pdfSettings`.
        *   **Structure JSX :** Typiquement une `<View>` contenant des `<Text>` stylisés pour afficher les informations pertinentes.

### 3. Utilitaires PDF (`src/services/pdf/react-pdf/utils/`)

Ces fichiers fournissent des fonctions d'aide spécifiques à la génération PDF avec `@react-pdf/renderer`.

*   **`pdfStyleUtils.ts` :**
    *   **Rôle :** **Crucial pour le styling.** Gère la création et l'application des styles dynamiques basés sur les `pdfSettings`.
    *   **`applyElementSettingsToStyle(baseStyle, elementSettings, isContainer)` :**
        *   **Logique :** Prend un style de base, les `ElementSettings` spécifiques à un élément, et un booléen `isContainer`. Mappe chaque propriété définie dans `elementSettings` (ex: `fontSize`, `textColor`, `margin`, `padding`, `borderColor`, `textAlign`, `fontWeight`, `fontFamily`) sur la propriété correspondante de l'objet style React PDF.
        *   **Filtrage `isContainer` :** Si `isContainer` est `false`, **ignore** les propriétés non textuelles (`margin...`, `padding...`, `border...`, `backgroundColor`). Applique uniquement les styles de texte (`fontSize`, `textColor`, `fontWeight`, `textAlign`, `fontFamily`...). Si `isContainer` est `true`, applique toutes les propriétés.
        *   **Retourne :** Le nouvel objet de style fusionné.
    *   **`getPdfStyles(pdfSettings, elementId, { isContainer })` :**
        *   **Logique :** Fonction principale utilisée par les composants pour obtenir leurs styles.
        1.  Récupère les styles par défaut (`pdfSettings.elements['default']`).
        2.  Récupère les styles spécifiques à `elementId` (`pdfSettings.elements[elementId]`).
        3.  Applique les styles par défaut au style de base en utilisant `applyElementSettingsToStyle` (respectant `isContainer`).
        4.  Applique ensuite les styles spécifiques sur le résultat précédent en utilisant `applyElementSettingsToStyle` (respectant `isContainer`). La spécificité l'emporte sur le défaut.
        *   **Retourne :** L'objet de style final et optimisé (potentiellement via `StyleSheet.create`) pour l'élément demandé.

*   **`reactPdfFonts.ts` :**
    *   **Rôle :** Enregistre les polices personnalisées (ex: Roboto, Modern Sans) auprès de `@react-pdf/renderer` via `Font.register()`. Ce fichier est importé (probablement dans `App.tsx` ou `main.tsx`) pour que les polices soient disponibles lors de la génération.
    *   **Polices Enregistrées (Probables) :** "Roboto" (avec ses variantes Regular, Bold, Italic, etc.), "Modern Sans". Les noms exacts des familles dépendent des appels `Font.register` dans ce fichier.

*   **`formatUtils.ts` & `dateUtils.ts` :**
    *   **Rôle :** Fournissent des fonctions utilitaires pour formater les données (nombres, prix, pourcentages, dates) avant de les afficher dans les composants `<Text>` du PDF.
    *   **Fonctions Principales :** `formatPrice`, `formatQuantity`, `formatPercentage`, `formatDateForPdf`.

*   **`pdfUtils.ts` :**
    *   **Rôle :** Contient des utilitaires génériques spécifiques à React PDF (ex: calculs simples, helpers de rendu conditionnel).

### 4. Styling PDF (Mécanisme)

Le style des éléments dans le PDF généré est entièrement contrôlé par le système de paramètres et les utilitaires de style :

1.  **Configuration :** L'utilisateur définit les styles (couleurs, marges, polices, styles spécifiques par élément) via l'interface des paramètres PDF (`PdfSettingsForm` et ses sous-composants).
2.  **Stockage :** Ces paramètres sont stockés dans l'objet `PdfSettings` (géré par `usePdfSettings` et persisté, potentiellement via `useAppState` et la table `app_state`).
3.  **Application :**
    *   Lors de la génération du PDF, les composants React PDF (ex: `ClientSection`, `DetailsPageContent`) ont besoin d'appliquer des styles à leurs éléments (`<View>`, `<Text>`).
    *   Chaque élément stylisable est associé à un identifiant unique (`PdfElementId` défini dans `typography.ts`).
    *   Le composant appelle la fonction `getPdfStyles(pdfSettings, elementId, { isContainer })` de `pdfStyleUtils.ts`.
    *   `getPdfStyles` récupère les styles par défaut et les styles spécifiques à `elementId` depuis l'objet `pdfSettings.elements`.
    *   Il fusionne ces styles (spécifique > défaut > base) en utilisant `applyElementSettingsToStyle`, qui respecte le filtre `isContainer`.
    *   L'objet de style résultant est retourné et appliqué à la prop `style` de l'élément React PDF (`<View style={styles.myElement}>`).

### 5. Dépendances PDF

Les dépendances NPM clés pour ce système sont :

*   `@react-pdf/renderer`: La librairie principale pour le rendu PDF.
*   `@react-pdf/types`: Fournit les types TypeScript pour `@react-pdf/renderer` (si non inclus directement).
*   `file-saver`: (Probablement) Utilisé pour déclencher le téléchargement/l'ouverture du Blob PDF généré.

### 6. Code PDF Obsolète (À Ignorer/Supprimer)

Les fichiers et dossiers suivants, situés principalement dans `src/services/pdf/` (hors `react-pdf/`), sont liés à l'ancienne méthode de génération (pdfMake) et sont considérés comme obsolètes :

*   `src/services/pdf/pdfConstants.ts`
*   `src/services/pdf/pdfGenerators.ts`
*   `src/services/pdf/pdfResources.ts`
*   `src/services/pdf/v2/` (et son contenu)
*   `src/services/pdf/generators/` (et son contenu : `coverGenerator.ts`, `detailsGenerator.ts`, `recapGenerator.ts`)
*   `src/services/pdf/services/` (et son contenu : `completePdfService.ts`, `detailedPdfService.ts`, `pdfDocumentService.ts`, `recapPdfService.ts`)
*   `src/services/pdf/types/pdfTypes.ts`
*   `src/services/pdf/utils/fontUtils.ts`
*   `src/services/pdf/utils/pdfUtils.ts`
*   `src/services/devisService.ts` (lié à l'ancienne génération)
*   `src/services/pdfGenerationService.ts` (lié à l'ancienne génération)
*   `src/hooks/useDevisGeneration.ts` (lié à l'ancienne génération)




## IX. Système de Paramètres PDF

Cette section décrit le système permettant aux utilisateurs de configurer l'apparence visuelle du document PDF généré.

### 1. Stockage & Flux des Paramètres PDF (Synthèse)

*   **Gestion :** Le hook `usePdfSettings` (`src/services/pdf/hooks/usePdfSettings.ts`) est responsable de la gestion de l'état des paramètres (`PdfSettings`).
*   **Chargement :** Au montage, le hook charge les paramètres, probablement via l'état global géré par `useAppState`, qui lui-même peut charger depuis `localStorage` ou la table Supabase `app_state`.
*   **Validation :** Les paramètres chargés et les modifications ultérieures sont validés à l'aide du schéma Zod `PdfSettingsSchema` (`src/services/pdf/config/pdfSettingsTypes.ts`).
*   **Mise à Jour :** Les modifications effectuées via l'UI appellent la fonction `updatePdfSettings` du hook.
*   **Persistance :** `updatePdfSettings` déclenche la sauvegarde des paramètres validés, soit en mettant à jour l'état global (`useAppState`), soit en appelant un service qui interagit avec la table Supabase `app_state` (colonne `settings_data` de type `jsonb`, filtré par `user_id`).

### 2. Types (Synthèse)

La structure et la configuration des paramètres PDF reposent sur plusieurs fichiers de types :

*   **`src/services/pdf/config/pdfSettingsTypes.ts` :**
    *   **Rôle :** Fichier central définissant la structure de données complète des paramètres PDF.
    *   **Types Clés :**
        *   `PdfSettings`: Structure principale (contient `margins`, `colors`, `logoSettings`, `elements`).
        *   `ElementSettings`: Propriétés de style configurables pour un élément (taille police, couleurs, marges, padding, bordures, alignement, etc.).

*   **`src/features/devis/components/pdf-settings/types/typography.ts` :**
    *   **Rôle :** Définit les identifiants uniques et l'organisation des éléments PDF stylisables pour l'UI.
    *   **Types/Constantes Clés :**
        *   `PdfElementId`: Union de chaînes littérales identifiant chaque élément (ex: `'PageHeader'`, `'SectionTitle'`). Utilisée comme clé dans `PdfSettings.elements`.
        *   `PDF_ELEMENTS`: Mappe `PdfElementId` à des métadonnées pour l'UI (label, section, etc.).
        *   `PDF_ELEMENT_SECTIONS`: Organise les `PdfElementId` en sections pour l'UI.

*   **`src/features/devis/components/pdf-settings/types/elementSettings.ts` :**
    *   **Rôle :** Définit (potentiellement de manière redondante) le type `ElementSettings` pour l'usage spécifique de l'UI des paramètres.
    *   **Types Clés :** `ElementSettings`.

### 3. UI des Paramètres (`src/features/devis/components/pdf-settings/`)

Cette section détaille les composants React qui constituent l'interface utilisateur pour la configuration des paramètres PDF, située dans la page `EditionDevis.tsx`.

#### `src/features/devis/components/pdf-settings/PdfSettingsForm.tsx`

*   **Chemin :** `src/features/devis/components/pdf-settings/PdfSettingsForm.tsx`
*   **Rôle Précis :** Composant principal du formulaire des paramètres PDF. Organise les différentes sections de réglages (généraux et par élément). Utilise `usePdfSettings` pour lire et écrire les paramètres.
*   **Props Principales :** Aucune (utilise `usePdfSettings`).
*   **Logique Interne :** Utilise `usePdfSettings` pour `pdfSettings` et `updatePdfSettings`. Rend les composants enfants (`ColorSettings`, `MarginSettings`, `LogoSettings`, `ElementSelector`, `ElementSettingsForm`), leur passant les `pdfSettings` et la fonction `updatePdfSettings` (ou des fonctions dérivées). Gère potentiellement la sélection de l'élément courant à éditer.
*   **Interactions :** Sert de conteneur et de point de communication avec `usePdfSettings` pour les composants de configuration plus spécifiques.

#### `src/features/devis/components/pdf-settings/ColorSettings.tsx`

*   **Chemin :** `src/features/devis/components/pdf-settings/ColorSettings.tsx`
*   **Rôle Précis :** Section du formulaire pour configurer la palette de couleurs globale du PDF (`ColorSettings`).
*   **Props Principales :** `colors: ColorSettings`, `onChange: (newColors: Partial<ColorSettings>) => void`.
*   **Logique Interne :** Affiche des `ColorPicker` pour chaque couleur du thème (`primary`, `secondary`, `text`, `background`...). Appelle `onChange` avec la couleur modifiée.
*   **Interactions :** Permet à l'utilisateur de choisir les couleurs du thème.

#### `src/features/devis/components/pdf-settings/FontSettings.tsx`

*   **Chemin :** `src/features/devis/components/pdf-settings/FontSettings.tsx`
*   **Rôle Précis :** Section du formulaire pour configurer les paramètres de police globaux (famille par défaut, taille de base éventuelle).
*   **Props Principales :** `pdfSettings: PdfSettings` (ou partie pertinente), `onChange: (updates: Partial<PdfSettings>) => void`.
*   **Logique Interne :** Affiche des contrôles (ex: `FontSelector`, `NumberControl`) pour la police par défaut. Appelle `onChange` avec les modifications.
*   **Interactions :** Permet de définir la police de base.

#### `src/features/devis/components/pdf-settings/LogoSettings.tsx`

*   **Chemin :** `src/features/devis/components/pdf-settings/LogoSettings.tsx`
*   **Rôle Précis :** Section du formulaire pour configurer l'affichage du logo (dimensions, ajustement, position).
*   **Props Principales :** `logoSettings: LogoSettings`, `onChange: (newLogoSettings: Partial<LogoSettings>) => void`.
*   **Logique Interne :** Affiche des contrôles (`NumberControl`, `Select`) pour hauteur, largeur, fit, position. Appelle `onChange` avec les modifications.
*   **Interactions :** Permet de régler l'apparence du logo.

#### `src/features/devis/components/pdf-settings/MarginSettings.tsx`

*   **Chemin :** `src/features/devis/components/pdf-settings/MarginSettings.tsx`
*   **Rôle Précis :** Section du formulaire pour configurer les marges globales par défaut des pages.
*   **Props Principales :** `margins: MarginSettings`, `onChange: (newMargins: Partial<MarginSettings>) => void`.
*   **Logique Interne :** Affiche des `NumberControl` (ou `MarginsControl`) pour les marges top, right, bottom, left. Appelle `onChange` avec les modifications.
*   **Interactions :** Permet de régler les marges de page.

#### `src/features/devis/components/pdf-settings/SpacingSettings.tsx`

*   **Chemin :** `src/features/devis/components/pdf-settings/SpacingSettings.tsx`
*   **Rôle Précis :** Section du formulaire pour configurer les espacements (marges et paddings) d'un élément *spécifique* sélectionné. Utilisé dans `ElementSettingsForm`.
*   **Props Principales :** `elementSettings: ElementSettings`, `onChange: (updates: Partial<ElementSettings>) => void`.
*   **Logique Interne :** Affiche des contrôles (`MarginsControl`, `PaddingControl`, ou `SpacingControl`) pour les marges et paddings. Appelle `onChange` avec les modifications.
*   **Interactions :** Permet de régler les espacements d'un élément.

#### `src/features/devis/components/pdf-settings/components/AlignmentControl.tsx`

*   **Chemin :** `src/features/devis/components/pdf-settings/components/AlignmentControl.tsx`
*   **Rôle Précis :** Contrôle UI (groupe de boutons toggle) pour sélectionner l'alignement horizontal (left, center, right).
*   **Props Principales :** `value: 'left' | 'center' | 'right' | undefined`, `onChange: (newValue: ...) => void`.
*   **Logique Interne :** Gère la sélection et appelle `onChange`.
*   **Interactions :** Sélection de l'alignement.

#### `src/features/devis/components/pdf-settings/components/BorderControl.tsx`

*   **Chemin :** `src/features/devis/components/pdf-settings/components/BorderControl.tsx`
*   **Rôle Précis :** Contrôle UI pour configurer les propriétés de bordure (couleur, style, largeur).
*   **Props Principales :** `value: { borderColor?, borderStyle?, borderWidth? }`, `onChange: (updates: Partial<ElementSettings>) => void`.
*   **Logique Interne :** Affiche `ColorPicker`, `Select` (pour style), `NumberControl` (pour largeur). Appelle `onChange`.
*   **Interactions :** Configuration des bordures.

#### `src/features/devis/components/pdf-settings/components/ColorPalette.tsx`

*   **Chemin :** `src/features/devis/components/pdf-settings/components/ColorPalette.tsx`
*   **Rôle Précis :** Affiche un aperçu visuel des couleurs du thème définies dans `ColorSettings`.
*   **Props Principales :** `colors: ColorSettings`.
*   **Logique Interne :** Rend des échantillons colorés pour chaque couleur.
*   **Interactions :** Affichage seul.

#### `src/features/devis/components/pdf-settings/components/ColorPicker.tsx`

*   **Chemin :** `src/features/devis/components/pdf-settings/components/ColorPicker.tsx`
*   **Rôle Précis :** Contrôle UI pour sélectionner une couleur (affiche un swatch, ouvre un sélecteur détaillé au clic).
*   **Props Principales :** `value: string`, `onChange: (newValue: string) => void`, `label?`.
*   **Logique Interne :** Gère l'ouverture/fermeture du sélecteur (potentiellement via `Popover` ou `Dialog`), intègre une librairie de color picker. Appelle `onChange`.
*   **Interactions :** Sélection d'une couleur.

#### `src/features/devis/components/pdf-settings/components/ElementSelector.tsx`

*   **Chemin :** `src/features/devis/components/pdf-settings/components/ElementSelector.tsx`
*   **Rôle Précis :** Permet à l'utilisateur de choisir l'élément PDF (`PdfElementId`) dont il souhaite configurer les styles.
*   **Props Principales :** `onSelectElement: (elementId: PdfElementId | null) => void`.
*   **Logique Interne :** Affiche une liste (`Select`, `Accordion`, ou boutons) des éléments organisés par section (basé sur `PDF_ELEMENTS` et `PDF_ELEMENT_SECTIONS`). Appelle `onSelectElement` lors de la sélection.
*   **Interactions :** Sélection de l'élément à configurer.

#### `src/features/devis/components/pdf-settings/components/ElementSettingsForm.tsx`

*   **Chemin :** `src/features/devis/components/pdf-settings/components/ElementSettingsForm.tsx`
*   **Rôle Précis :** Formulaire principal pour éditer les `ElementSettings` d'un `selectedElementId`. Affiche les contrôles de style pertinents.
*   **Props Principales :** `selectedElementId: PdfElementId`, `elementSettings: ElementSettings`, `pdfSettings: PdfSettings`, `onSettingsChange: (updates: Partial<ElementSettings>) => void`.
*   **Logique Interne :** Rend les contrôles (`ColorPicker`, `NumberControl`, `FontSelector`, `AlignmentControl`, `SpacingSettings`, `BorderControl`, etc.) appropriés pour l'élément sélectionné. Passe les valeurs actuelles et la fonction `onSettingsChange` (ou un wrapper) à ces contrôles.
*   **Interactions :** Permet la modification des styles d'un élément spécifique et communique les changements au parent.

#### `src/features/devis/components/pdf-settings/components/FontSelector.tsx`

*   **Chemin :** `src/features/devis/components/pdf-settings/components/FontSelector.tsx`
*   **Rôle Précis :** Contrôle UI (`Select`) pour choisir une famille de police parmi celles enregistrées.
*   **Props Principales :** `value: string | undefined`, `onChange: (newValue: string | undefined) => void`, `label?`.
*   **Logique Interne :** Remplit les options du `Select` avec les noms des polices disponibles. Appelle `onChange`.
*   **Interactions :** Sélection de la famille de police.

#### `src/features/devis/components/pdf-settings/components/MarginsControl.tsx`

*   **Chemin :** `src/features/devis/components/pdf-settings/components/MarginsControl.tsx`
*   **Rôle Précis :** Contrôle UI pour saisir les 4 valeurs de marge (top, right, bottom, left).
*   **Props Principales :** `value: [number, number, number, number] | number`, `onChange: (newValue: ...) => void`, `label?`.
*   **Logique Interne :** Affiche 4 `NumberControl`. Appelle `onChange` avec le tableau des valeurs.
*   **Interactions :** Saisie des marges.

#### `src/features/devis/components/pdf-settings/components/NumberControl.tsx`

*   **Chemin :** `src/features/devis/components/pdf-settings/components/NumberControl.tsx`
*   **Rôle Précis :** Contrôle UI (`Input` type number) générique pour saisir une valeur numérique.
*   **Props Principales :** `value: number | undefined | null`, `onChange: (newValue: number | undefined) => void`, `label?`, `step?`, `min?`, `max?`, `placeholder?`.
*   **Logique Interne :** Rend un `Input` number. Appelle `onChange` avec la valeur numérique.
*   **Interactions :** Saisie d'un nombre.

#### `src/features/devis/components/pdf-settings/components/PaddingControl.tsx`

*   **Chemin :** `src/features/devis/components/pdf-settings/components/PaddingControl.tsx`
*   **Rôle Précis :** Contrôle UI pour saisir les 4 valeurs de padding (top, right, bottom, left). Similaire à `MarginsControl`.
*   **Props Principales :** `value: [number, number, number, number] | number`, `onChange: (newValue: ...) => void`, `label?`.
*   **Logique Interne :** Affiche 4 `NumberControl`. Appelle `onChange`.
*   **Interactions :** Saisie des paddings.

#### `src/features/devis/components/pdf-settings/components/SpacingControl.tsx`

*   **Chemin :** `src/features/devis/components/pdf-settings/components/SpacingControl.tsx`
*   **Rôle Précis :** Contrôle UI potentiellement plus avancé pour gérer les espacements (marges/paddings), avec option de lier/délier les 4 côtés.
*   **Props Principales :** `value: any`, `onChange: (newValue: any) => void`, `label?`.
*   **Logique Interne :** Gère le mode lié/délié. Affiche 1 ou 4 `NumberControl` selon le mode. Appelle `onChange`.
*   **Interactions :** Saisie des espacements (uniforme ou individuel).

#### `src/features/devis/components/pdf-settings/components/StyleControls.tsx`

*   **Chemin :** `src/features/devis/components/pdf-settings/components/StyleControls.tsx`
*   **Rôle Précis :** Regroupe plusieurs contrôles de style de base (couleur, police, alignement, etc.) pour un élément donné. Utilisé dans `ElementSettingsForm`.
*   **Props Principales :** `elementSettings: ElementSettings`, `pdfSettings: PdfSettings`, `onSettingsChange: (updates: Partial<ElementSettings>) => void`.
*   **Logique Interne :** Rend les composants de contrôle spécifiques (`ColorPicker`, `FontSelector`, `AlignmentControl`, etc.), leur passant les valeurs extraites de `elementSettings` et la fonction `onSettingsChange`.
*   **Interactions :** Délègue les interactions aux contrôles enfants et propage les changements via `onSettingsChange`.



















***********************
***********************
## Annexe : Points d'Attention Issus de l'Audit

1.  **Code PDF Obsolète Massif (Critique - Dette Technique & Confusion) :**
    *   **Constat :** Une grande partie du dossier `src/services/pdf/` (hors `react-pdf/`), ainsi que les hooks/services associés (`useDevisGeneration`, `devisService.ts`, `pdfGenerationService.ts`, etc.), sont liés à une ancienne méthode PDF (probablement `pdfMake`) et sont **obsolètes**.
    *   **Impact :** Confusion, maintenance inutile, gonflement du code. Nécessite un nettoyage urgent.

2.  **Logique de Modification Manquante ou Incomplète (Critique - Fonctionnalité Buggée) :**
    *   **Constat :** La fonction `handleSubmitTravail` dans `src/pages/Travaux.tsx` ne semble pas implémenter la logique de **mise à jour** d'un travail existant (`updateTravail`).
    *   **Impact :** La modification des travaux depuis l'interface est probablement **non fonctionnelle**.

3.  **Gestion Potentiellement Incohérente de la Sélection Client/Société (Moyen - Risque de Bugs Subtils) :**
    *   **Constat :** Coexistence de `ClientSelection` (gérant `clientId`) et `ClientsDataField` (gérant `Client[]`) dans `src/features/chantier/components/project-form/`. Incertitude sur la synchronisation entre l'ID sélectionné et l'objet complet dans `projectState.metadata.clientsData` / `projectState.metadata.company`.
    *   **Impact :** Risque d'erreurs si la sélection de l'ID et la mise à jour de l'objet complet ne sont pas correctement gérées.

4.  **Usage Mixte Contexte/Service pour Données de Référence (Moyen - Confusion & Maintenance) :**
    *   **Constat :** Approche différente pour gérer le CRUD des données de référence :
        *   *Types Menuiseries* : Contexte (`useMenuiseriesTypes`) pour `RESET`, mais appels directs au service (`menuiseriesService`) pour CRUD dans `Parametres.tsx`.
        *   *Clients* : CRUD géré via `dispatch` du `ClientsContext`.
    *   **Impact :** Manque de cohérence, maintenance et compréhension complexifiées.

5.  **Redondance Potentielle de Hooks (`useProjectOperations`) (Moyen - Confusion & Maintenance) :**
    *   **Constat :** Existence d'un hook `useProjectOperations` global (`src/hooks/`) et d'une version spécifiques (`src/features/chantier/hooks/`). Leur utilisation respective et différences ne sont pas claires.
    *   **Impact :** Risque de confusion, duplication de code potentielle, maintenance plus lourde.

6.  **Redondance Potentielle de Types (`ElementSettings`) (Mineur - Maintenance) :**
    *   **Constat :** Le type `ElementSettings` est défini dans `src/services/pdf/config/pdfSettingsTypes.ts` et potentiellement de manière redondante dans `src/features/devis/components/pdf-settings/types/elementSettings.ts`.
    *   **Impact :** Violation du principe DRY, risque d'incohérences futures.

7.  **Composant `RenovationEstimator.tsx` Structurel mais Inutilisé ? (Mineur - Code Mort/Confusion) :**
    *   **Constat :** Le composant `src/components/RenovationEstimator.tsx` semble être une relique structurelle dont le rôle actuel est minime (rend `Layout`), alors que le routage est dans `App.tsx`.
    *   **Impact :** Code potentiellement mort, confusion sur l'architecture réelle.

8.  **Hooks "WithSupabase" Obsolètes Probables (Mineur - Dette Technique) :**
    *   **Constat :** Des hooks comme `useAutresSurfacesWithSupabase` et `useRoomCustomItemsWithSupabase` suggèrent une interaction directe avec Supabase pour des sous-éléments du projet, en contradiction avec la gestion centralisée via `ProjectContext` (JSONB).
    *   **Impact :** Code probablement inutilisé et obsolète à nettoyer.

9.  **Rôle Incertain de `src/services/projectService.ts` (Mineur - Clarté) :**
    *   **Constat :** Le rôle de ce service par rapport aux services plus spécifiques dans `src/services/project/` n'est pas clair.
    *   **Impact :** Manque de clarté dans l'organisation des services projet.

10. **Confirmation de l'Usage de la Table `app_state` (Mineur - Confirmation) :**
    *   **Constat :** L'utilisation de la table `app_state` pour persister les `PdfSettings` est suggérée par le flux, mais aucun service analysé n'y fait explicitement référence (interaction via `useAppState` ?).
    *   **Impact :** Nécessite confirmation du mécanisme exact de persistance des paramètres PDF.

11. **Contenu de `src/lib/dimensions.ts` (Mineur - Documentation Incomplète) :**
    *   **Constat :** Le contenu et l'utilisation de ce fichier n'ont pas été détaillés.
    *   **Impact :** Point mineur manquant dans la documentation.