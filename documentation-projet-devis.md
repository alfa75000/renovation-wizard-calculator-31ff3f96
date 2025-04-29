
# Documentation Exhaustive - Application Devis Bâtiment

## III. Description Détaillée des Fichiers Sources (`src/`)

### `src/App.tsx`
- **Rôle Principal :** Point d'entrée principal de l'application, définit le routeur et les fournisseurs de contexte globaux.
- **Imports Clés :**
  - React, React Router (BrowserRouter, Routes, Route)
  - Composants de pages (InfosChantier, Travaux, Recapitulatif, EditionDevis, etc.)
  - Contextes (ProjectProvider, ClientsProvider, TravauxTypesProvider)
  - Composants UI globaux (Layout, Toaster)
- **Exports Principaux :** `export default App`
- **Logique :**
  - Configuration du routeur React Router avec définition de toutes les routes de l'application
  - Encapsulation de l'application dans les fournisseurs de contexte pour la gestion d'état globale
  - Configuration des notifications toast via le composant Toaster
  - Gestion des redirections vers la page NotFound pour les routes inexistantes

### `src/components/Layout.tsx`
- **Rôle Principal :** Définit la structure commune à toutes les pages de l'application.
- **Imports Clés :**
  - React
  - TitleHeader, Navigation (composants de mise en page)
- **Exports Principaux :** `export const Layout`
- **Composant React :**
  - **Props :** 
    - `title`: string (titre de la page)
    - `subtitle`: string (sous-titre de la page)
    - `children`: React.ReactNode (contenu de la page)
  - **Logique :** Aucun état local, compose simplement la structure de la page
  - **Rendu JSX :** Structure la page avec un header de titre, une navigation et le contenu passé via les enfants

### `src/components/RenovationEstimator.tsx`
- **Rôle Principal :** Composant principal pour l'estimation de travaux de rénovation.
- **Imports Clés :**
  - React, hooks React (useState, useEffect)
  - useProject (contexte de projet)
  - Composants UI (Button, Card, etc.)
- **Exports Principaux :** `export default RenovationEstimator`
- **Composant React :**
  - **État Local :** 
    - `activeTab`: string (onglet actif)
    - `propertyInfo`: object (informations sur le bien)
    - `rooms`: array (liste des pièces)
  - **Effets :**
    - Synchronisation des données du contexte avec l'état local
    - Sauvegarde automatique lors des modifications importantes
  - **Fonctions Internes :**
    - `handleAddRoom`: Ajoute une nouvelle pièce
    - `handleUpdateRoom`: Met à jour une pièce existante
    - `handleDeleteRoom`: Supprime une pièce
    - `handleSaveProject`: Sauvegarde le projet actuel
  - **Rendu JSX :** Interface à onglets avec formulaire de propriété et gestion des pièces

### `src/contexts/ProjectContext.tsx`
- **Rôle Principal :** Fournit le contexte global pour gérer l'état du projet.
- **Imports Clés :**
  - React, createContext, useReducer, useContext
  - projectReducer (reducer pour la manipulation de l'état du projet)
  - Types (ProjectState, ProjectAction, etc.)
- **Exports Principaux :**
  - `export const ProjectProvider`
  - `export const useProject`
- **Contexte React :**
  - **Structure de l'État :** 
    - `property`: Informations sur le bien (type, étages, surface)
    - `rooms`: Liste des pièces avec leurs caractéristiques
    - `travaux`: Liste des travaux associés aux pièces
    - `metadata`: Métadonnées du projet (nom, numéro de devis, etc.)
    - `currentProjectId`: ID du projet en cours d'édition
    - `savedState`: État de sauvegarde du projet
  - **Reducer Associé :**
    - Action `SET_PROPERTY`: Met à jour les propriétés du bien
    - Action `ADD_ROOM`: Ajoute une nouvelle pièce
    - Action `UPDATE_ROOM`: Met à jour une pièce existante
    - Action `DELETE_ROOM`: Supprime une pièce
    - Action `ADD_TRAVAIL`: Ajoute un travail à une pièce
    - Action `UPDATE_TRAVAIL`: Met à jour un travail
    - Action `DELETE_TRAVAIL`: Supprime un travail
    - Action `LOAD_PROJECT`: Charge un projet complet
    - Action `SET_METADATA`: Met à jour les métadonnées du projet
    - Action `SET_CURRENT_PROJECT_ID`: Définit l'ID du projet en cours
    - Action `UPDATE_SAVED_STATE`: Met à jour l'état de sauvegarde
    - Action `RESET_PROJECT`: Réinitialise le projet
  - **Provider :**
    - Initialise l'état avec des valeurs par défaut
    - Fournit l'état et la fonction dispatch aux composants enfants
  - **Hook Consommateur :**
    - `useProject`: Retourne l'état et la fonction dispatch du contexte

### `src/contexts/TravauxTypesContext.tsx`
- **Rôle Principal :** Gère les types de travaux disponibles dans l'application.
- **Imports Clés :**
  - React, createContext, useReducer, useContext, useEffect
  - supabase (client Supabase)
  - Types (WorkType, ServiceGroup, Service)
- **Exports Principaux :**
  - `export const TravauxTypesProvider`
  - `export const useTravauxTypes`
- **Contexte React :**
  - **Structure de l'État :** 
    - `workTypes`: Types de travaux disponibles
    - `serviceGroups`: Groupes de services par type de travaux
    - `services`: Services disponibles par groupe
    - `loading`: État de chargement des données
  - **Reducer Associé :**
    - Action `SET_WORK_TYPES`: Définit les types de travaux
    - Action `SET_SERVICE_GROUPS`: Définit les groupes de services
    - Action `SET_SERVICES`: Définit les services disponibles
    - Action `SET_LOADING`: Définit l'état de chargement
  - **Provider :**
    - Initialise l'état avec des valeurs vides et chargement initial
    - Charge les données depuis Supabase au montage du composant
    - Organise les données en hiérarchie (types > groupes > services)
    - Fournit l'état et des fonctions utilitaires aux composants enfants
  - **Hook Consommateur :**
    - `useTravauxTypes`: Expose l'état et des fonctions pour accéder aux types de travaux, groupes et services

### `src/contexts/ClientsContext.tsx`
- **Rôle Principal :** Gère les clients et leurs informations.
- **Imports Clés :**
  - React, createContext, useReducer, useContext, useEffect
  - supabase (client Supabase)
  - Types (Client, ClientsState, ClientsAction)
- **Exports Principaux :**
  - `export const ClientsProvider`
  - `export const useClients`
- **Contexte React :**
  - **Structure de l'État :** 
    - `clients`: Liste des clients
  - **Reducer Associé :**
    - Action `ADD_CLIENT`: Ajoute un nouveau client
    - Action `UPDATE_CLIENT`: Met à jour un client existant
    - Action `DELETE_CLIENT`: Supprime un client
    - Action `LOAD_CLIENTS`: Charge une liste de clients
    - Action `RESET_CLIENTS`: Réinitialise la liste des clients
  - **Provider :**
    - Initialise l'état avec une liste de clients vide
    - Charge les clients depuis Supabase au montage du composant
    - Fournit l'état et des fonctions utilitaires aux composants enfants
  - **Hook Consommateur :**
    - `useClients`: Expose l'état des clients et les fonctions pour les manipuler

### `src/features/project/reducers/projectReducer.ts`
- **Rôle Principal :** Reducer principal pour gérer les modifications de l'état du projet.
- **Imports Clés :**
  - Types (ProjectState, ProjectAction, etc.)
- **Exports Principaux :**
  - `export const initialState`
  - `export const projectReducer`
- **Logique :**
  - Définit l'état initial du projet avec des propriétés vides, des listes vides pour les pièces et les travaux
  - Implémente la logique pour chaque action du contexte ProjectContext :
    - Gestion des propriétés du bien (SET_PROPERTY)
    - Gestion des pièces (ADD_ROOM, UPDATE_ROOM, DELETE_ROOM)
    - Gestion des travaux (ADD_TRAVAIL, UPDATE_TRAVAIL, DELETE_TRAVAIL)
    - Chargement complet d'un projet (LOAD_PROJECT)
    - Gestion des métadonnées (SET_METADATA)
    - Gestion de l'ID du projet courant (SET_CURRENT_PROJECT_ID)
    - Gestion de l'état de sauvegarde (UPDATE_SAVED_STATE)
    - Réinitialisation du projet (RESET_PROJECT)

### `src/features/chantier/hooks/useProjectOperations.tsx`
- **Rôle Principal :** Hook pour gérer les opérations sur les projets (chargement, sauvegarde, suppression).
- **Imports Clés :**
  - React hooks (useState, useCallback, useEffect)
  - useProject (contexte de projet)
  - projectService (service d'accès aux données des projets)
- **Exports Principaux :** `export const useProjectOperations`
- **État Interne :**
  - `isLoading`: Indicateur de chargement
  - `projects`: Liste des projets sauvegardés
  - `error`: Message d'erreur éventuel
  - `hasUnsavedChanges`: Indicateur de changements non sauvegardés
- **Effets :**
  - Chargement de la liste des projets au montage du composant
  - Suivi des changements non sauvegardés
- **Fonctions Retournées :**
  - `handleChargerProjet`: Charge un projet existant par son ID
  - `handleDeleteProject`: Supprime un projet existant
  - `handleSaveProject`: Sauvegarde le projet actuel (avec option de création ou mise à jour)
  - `checkForUnsavedChanges`: Vérifie s'il y a des changements non sauvegardés
  - `handleCreateNew`: Crée un nouveau projet vide

### `src/features/chantier/hooks/useProjectMetadata.tsx`
- **Rôle Principal :** Hook pour gérer les métadonnées du projet.
- **Imports Clés :**
  - React hooks (useState, useCallback, useEffect)
  - useProject (contexte de projet)
  - devisService (service lié aux devis)
- **Exports Principaux :** `export const useProjectMetadata`
- **État Interne :**
  - `nomProjet`: Nom du projet
  - `numeroDevis`: Numéro du devis
  - `dateDevis`: Date du devis
  - `dateValidite`: Date de validité du devis
  - `adresseChantier`: Adresse du chantier
  - `occupant`: Occupant du bien
  - `infoComplementaire`: Informations complémentaires
  - `companyId`: ID de la société
  - `clientId`: ID du client
  - `clientsData`: Données des clients associés
- **Effets :**
  - Synchronisation des états locaux avec les métadonnées du projet
- **Fonctions Retournées :**
  - Setters pour chaque métadonnée
  - `handleGenerateProjectName`: Génère un nom de projet automatique
  - `handleGenerateDevisNumber`: Génère un numéro de devis automatique

### `src/services/pdf/hooks/usePdfSettings.ts`
- **Rôle Principal :** Hook pour gérer le chargement et la sauvegarde des paramètres PDF.
- **Imports Clés :**
  - React hooks (useState, useCallback, useEffect)
  - useAppState (hook d'accès à l'état global de l'application)
  - Zod (pour la validation des données)
  - Types (PdfSettings, PdfSettingsSchema)
- **Exports Principaux :** `export const usePdfSettings`
- **État Interne :**
  - `pdfSettings`: Paramètres PDF actuels
- **Effets :**
  - Chargement des paramètres PDF depuis l'état de l'application au montage
- **Fonctions Retournées :**
  - `updatePdfSettings`: Met à jour les paramètres PDF et les persiste
  - `resetPdfSettings`: Réinitialise les paramètres PDF aux valeurs par défaut

### `src/features/devis/components/pdf-settings/FontSettings.tsx`
- **Rôle Principal :** Composant pour configurer les polices et styles de texte des éléments du PDF.
- **Imports Clés :**
  - React, hooks React (useState, useEffect)
  - Composants UI (Select, Label, etc.)
  - Types (PdfSettings, ElementSettings)
- **Exports Principaux :** Composant FontSettings
- **Composant React :**
  - **Props :**
    - `pdfSettings`: Paramètres PDF actuels
    - `updatePdfSettings`: Fonction pour mettre à jour les paramètres
  - **État Local :**
    - `selectedElement`: Élément actuellement sélectionné
    - `elementSettings`: Paramètres de style de l'élément sélectionné
  - **Fonctions Internes :**
    - `getPaletteColors`: Récupère les couleurs du thème PDF
    - `getElementSettings`: Récupère les paramètres de style d'un élément
    - `handleElementSettingsChange`: Met à jour les paramètres d'un élément
  - **Rendu JSX :**
    - Sélecteur d'élément à éditer
    - Formulaire pour configurer la police, taille, style et couleurs
    - Prévisualisation du texte avec les styles appliqués

### `src/features/devis/components/pdf-settings/ColorSettings.tsx`
- **Rôle Principal :** Composant pour configurer les couleurs globales du PDF.
- **Imports Clés :**
  - React
  - ColorPicker (composant de sélection de couleur)
  - Types (PdfSettings)
- **Exports Principaux :** Composant ColorSettings
- **Composant React :**
  - **Props :**
    - `pdfSettings`: Paramètres PDF actuels
    - `updatePdfSettings`: Fonction pour mettre à jour les paramètres
  - **Fonctions Internes :**
    - `handleColorChange`: Met à jour une couleur spécifique dans les paramètres
  - **Rendu JSX :**
    - Grille de sélecteurs de couleurs pour chaque élément du thème PDF
    - Libellés explicatifs pour chaque couleur

### `src/services/pdf/react-pdf/utils/pdfStyleUtils.ts`
- **Rôle Principal :** Utilitaires pour générer et appliquer des styles aux composants PDF.
- **Imports Clés :**
  - @react-pdf/renderer (StyleSheet)
  - Types (PdfSettings, ElementSettings)
- **Exports Principaux :**
  - `export const getPdfStyles`
  - `export const applyElementSettingsToStyle`
- **Logique :**
  - `getPdfStyles`: Génère un objet de styles pour un élément du PDF en fonction des paramètres et options
    - Combine les styles de base avec les styles personnalisés pour chaque élément
    - Sépare les styles pour les conteneurs et pour le texte
  - `applyElementSettingsToStyle`: Applique les paramètres d'un élément à un style
    - Convertit les valeurs de couleur, taille, alignement, etc. en propriétés de style React-PDF
    - Gère les marges, espacements, bordures et autres propriétés de mise en page

### `src/services/pdf/react-pdf/components/CoverPage.tsx`
- **Rôle Principal :** Composant React-PDF pour la page de garde du devis.
- **Imports Clés :**
  - @react-pdf/renderer (Page, View, Text, Image, StyleSheet)
  - Composants communs (HeaderSection, FooterSection)
  - Utilitaires (getPdfStyles)
- **Exports Principaux :** `export const CoverPage`
- **Composant React-PDF :**
  - **Props :**
    - `pdfSettings`: Paramètres PDF
    - `projectState`: État du projet
  - **Logique :**
    - Génère les styles de la page en fonction des paramètres PDF
    - Extrait les informations du projet et du client à afficher
  - **Rendu :**
    - En-tête avec logo de l'entreprise
    - Section de titre "DEVIS"
    - Informations du client et du projet
    - Détails du devis (numéro, date, validité)
    - Description du projet
    - Pied de page

### `src/services/pdf/react-pdf/components/DetailsPage.tsx`
- **Rôle Principal :** Composant React-PDF pour les pages de détail du devis.
- **Imports Clés :**
  - @react-pdf/renderer (Page, View, Text, StyleSheet)
  - Composants communs (HeaderSection, FooterSection)
  - Utilitaires (getPdfStyles, formatPrice)
- **Exports Principaux :** `export const DetailsPage`
- **Composant React-PDF :**
  - **Props :**
    - `pdfSettings`: Paramètres PDF
    - `projectState`: État du projet
  - **Logique :**
    - Génère les styles de la page en fonction des paramètres PDF
    - Groupe les travaux par pièce
    - Calcule les sous-totaux et totaux
  - **Rendu :**
    - En-tête de page
    - Pour chaque pièce :
      - Titre de la pièce avec surface
      - Tableau des travaux avec colonnes (description, quantité, prix unitaire, total)
      - Sous-total de la pièce
    - Pied de page avec numéro de page

### `src/services/pdf/react-pdf/components/RecapPage.tsx`
- **Rôle Principal :** Composant React-PDF pour la page de récapitulatif du devis.
- **Imports Clés :**
  - @react-pdf/renderer (Page, View, Text, StyleSheet)
  - Composants communs (HeaderSection, FooterSection)
  - Utilitaires (getPdfStyles, formatPrice, calculerTotaux)
- **Exports Principaux :** `export const RecapPage`
- **Composant React-PDF :**
  - **Props :**
    - `pdfSettings`: Paramètres PDF
    - `projectState`: État du projet
  - **Logique :**
    - Génère les styles de la page en fonction des paramètres PDF
    - Calcule les totaux par taux de TVA et le total global
  - **Rendu :**
    - En-tête de page
    - Titre "RÉCAPITULATIF"
    - Tableau des totaux par taux de TVA
    - Total général HT, TVA et TTC
    - Zone de signature et conditions de paiement
    - Mentions légales et conditions générales résumées
    - Pied de page

### `src/services/pdf/react-pdf/components/CGVPage.tsx`
- **Rôle Principal :** Composant React-PDF pour la page des conditions générales de vente.
- **Imports Clés :**
  - @react-pdf/renderer (Page, View, Text, StyleSheet)
  - Composants communs (HeaderSection, FooterSection)
  - Utilitaires (getPdfStyles)
- **Exports Principaux :** `export const CGVPage`
- **Composant React-PDF :**
  - **Props :**
    - `pdfSettings`: Paramètres PDF
    - `projectState`: État du projet
  - **Logique :**
    - Génère les styles de la page en fonction des paramètres PDF
  - **Rendu :**
    - En-tête de page
    - Titre "CONDITIONS GÉNÉRALES DE VENTE"
    - Sections des CGV (Objet, Durée, Prix, Paiement, etc.)
    - Texte légal détaillé avec formatage structuré
    - Pied de page

### `src/services/pdf/hooks/useReactPdfGeneration.tsx`
- **Rôle Principal :** Hook pour gérer la génération de PDF avec @react-pdf/renderer.
- **Imports Clés :**
  - React hooks (useState, useCallback)
  - @react-pdf/renderer (pdf, Document)
  - Components PDF (CoverPage, DetailsPage, RecapPage, CGVPage)
  - usePdfSettings (hook pour les paramètres PDF)
  - useProject (contexte de projet)
- **Exports Principaux :** `export const useReactPdfGeneration`
- **État Interne :**
  - `isGenerating`: Indicateur de génération en cours
- **Fonctions Retournées :**
  - `generatePdf`: Génère un PDF complet avec toutes les pages (couverture, détails, récapitulatif, CGV)
    - Crée un Document React-PDF avec les composants de page
    - Configure les polices et styles
    - Génère un blob PDF et l'ouvre dans une nouvelle fenêtre
  - `generatePdfBlob`: Version utilitaire qui retourne le blob PDF au lieu de l'ouvrir
  - `isGenerating`: État de génération actuel

### `src/services/projectSaveService.ts`
- **Rôle Principal :** Service pour gérer la sauvegarde et le chargement des projets.
- **Imports Clés :**
  - supabase (client Supabase)
  - Types (Project, ProjectState)
  - Utilitaires (devisService)
- **Exports Principaux :**
  - `export const fetchProjectSaves`
  - `export const fetchProjectSaveById`
  - `export const createProjectSave`
  - `export const updateProjectSave`
  - `export const deleteProjectSave`
  - `export const generateDefaultProjectName`
  - `export const generateDevisNumber`
  - `export const isDevisNumberUnique`
- **Logique / Fonctions :**
  - `fetchProjectSaves`: Récupère la liste des projets sauvegardés
  - `fetchProjectSaveById`: Récupère un projet par son ID
  - `createProjectSave`: Crée un nouveau projet sauvegardé
    - Valide et prépare les données du projet
    - Insère les données dans la table projects_save
    - Gère les erreurs et retourne l'ID du projet créé
  - `updateProjectSave`: Met à jour un projet existant
    - Valide et prépare les données de mise à jour
    - Met à jour l'entrée dans la table projects_save
    - Gère les erreurs et retourne un booléen indiquant le succès
  - `deleteProjectSave`: Supprime un projet existant
  - `generateDefaultProjectName`: Génère un nom par défaut pour un nouveau projet
  - `generateDevisNumber`: Génère un numéro de devis unique
  - `isDevisNumberUnique`: Vérifie si un numéro de devis est unique

### `src/services/pdf/config/pdfSettingsTypes.ts`
- **Rôle Principal :** Définit les types et schémas de validation pour les paramètres PDF.
- **Imports Clés :**
  - zod (bibliothèque de validation)
- **Exports Principaux :**
  - `export const PdfSettingsSchema`
  - `export type PdfSettings`
  - `export const DEFAULT_PDF_SETTINGS`
- **Logique :**
  - Définit le schéma Zod pour valider la structure des paramètres PDF :
    - `fontFamily`: Police principale
    - `colors`: Couleurs du thème (texte principal, fond, lignes, etc.)
    - `margins`: Marges pour différents types de pages
    - `lineSpacing`: Espacements entre lignes et sections
    - `logoSettings`: Configuration du logo
    - `elements`: Styles personnalisés par élément
  - Exporte le type TypeScript généré à partir du schéma
  - Définit les valeurs par défaut pour les nouveaux projets

### `src/features/devis/components/pdf-settings/types/elementSettings.ts`
- **Rôle Principal :** Définit les types pour les paramètres de style des éléments PDF.
- **Imports Clés :**
  - zod (bibliothèque de validation)
- **Exports Principaux :**
  - `export const ElementSettingsSchema`
  - `export type ElementSettings`
  - `export const DEFAULT_ELEMENT_SETTINGS`
- **Logique :**
  - Définit le schéma Zod pour les paramètres d'un élément :
    - `fontFamily`: Police de l'élément
    - `fontSize`: Taille de police
    - `isBold`, `isItalic`: Style de texte
    - `color`: Couleur du texte
    - `alignment`: Alignement du texte
    - `fillColor`: Couleur de fond
    - `lineHeight`: Hauteur de ligne
    - `spacing`: Espacements externes
    - `padding`: Espacements internes
    - `border`: Configuration des bordures
  - Exporte le type TypeScript généré à partir du schéma
  - Définit les valeurs par défaut pour un nouvel élément

### `src/features/devis/components/pdf-settings/types/typography.ts`
- **Rôle Principal :** Définit les éléments typographiques du PDF et leurs groupes.
- **Imports Clés :**
  - Types (PdfElementId)
- **Exports Principaux :**
  - `export const PDF_ELEMENTS`
  - `export const PDF_ELEMENT_SECTIONS`
  - `export type PdfElementId`
- **Logique :**
  - Définit les identifiants pour tous les éléments typographiques du PDF
  - Groupe les éléments par sections (page de garde, détails, récapitulatif, CGV)
  - Fournit des informations de libellé pour l'interface utilisateur
  - Définit les relations parent-enfant entre les éléments pour l'héritage de style

### `src/features/devis/components/pdf-settings/components/ElementSelector.tsx`
- **Rôle Principal :** Composant pour sélectionner un élément du PDF à éditer.
- **Imports Clés :**
  - React
  - Composants UI (Accordion, Button)
  - Types (PDF_ELEMENTS, PDF_ELEMENT_SECTIONS)
- **Exports Principaux :** Composant ElementSelector
- **Composant React :**
  - **Props :**
    - `selectedElement`: ID de l'élément sélectionné
    - `onElementSelect`: Fonction appelée lors de la sélection d'un élément
  - **Logique :**
    - Organise les éléments du PDF par sections
    - Filtre les éléments par section
  - **Rendu JSX :**
    - Accordéon avec les sections d'éléments (Page de garde, Détails, Récapitulatif, CGV)
    - Boutons pour chaque élément avec indication de sélection

### `src/features/devis/components/pdf-settings/components/ElementSettingsForm.tsx`
- **Rôle Principal :** Formulaire pour éditer les styles d'un élément spécifique du PDF.
- **Imports Clés :**
  - React
  - Composants UI (Input, Select, Tabs, etc.)
  - Sous-composants (StyleControls, ColorPicker, etc.)
  - Types (ElementSettings)
- **Exports Principaux :** Composant ElementSettingsForm
- **Composant React :**
  - **Props :**
    - `elementSettings`: Paramètres actuels de l'élément
    - `onSettingsChange`: Fonction appelée lors de la modification des paramètres
    - `paletteColors`: Couleurs du thème disponibles
  - **État Local :**
    - `activeTab`: Onglet actif du formulaire
  - **Fonctions Internes :**
    - `handleChange`: Gère les changements génériques sur les paramètres
    - Fonctions spécifiques pour chaque type de paramètre (police, couleur, alignement, etc.)
  - **Rendu JSX :**
    - Interface à onglets avec les groupes de paramètres :
      - Style de texte (police, taille, gras, italique)
      - Couleurs (texte, fond)
      - Alignement et espacement
      - Marges et bordures
    - Prévisualisation du texte avec les styles appliqués

### `src/hooks/useAppState.ts`
- **Rôle Principal :** Hook pour accéder et manipuler l'état global de l'application stocké dans Supabase.
- **Imports Clés :**
  - React hooks (useState, useEffect, useCallback)
  - supabase (client Supabase)
  - Types (AppState, PdfSettings)
- **Exports Principaux :** `export const useAppState`
- **État Interne :**
  - `appState`: État global de l'application
  - `isLoading`: Indicateur de chargement
  - `error`: Message d'erreur éventuel
  - `userProfile`: Profil de l'utilisateur
  - `isAdmin`: Indicateur si l'utilisateur est administrateur
- **Effets :**
  - Chargement de l'état de l'application et du profil utilisateur au montage
- **Fonctions Retournées :**
  - `updateAppStatePdfSettings`: Met à jour les paramètres PDF dans l'état global
  - `updateAppStateCurrentProjectId`: Met à jour l'ID du projet courant
  - `updateAutoSaveOptions`: Met à jour les options de sauvegarde automatique
  - `isLoading`, `error`, `appState`: État actuel de chargement et données

### `src/pages/EditionDevis.tsx`
- **Rôle Principal :** Page pour configurer et générer le PDF du devis.
- **Imports Clés :**
  - React, hooks React (useState)
  - Composants UI (Tabs, Button)
  - useReactPdfGeneration (hook pour la génération PDF)
  - PdfSettingsForm, PrintableFieldsForm (formulaires de configuration)
- **Exports Principaux :** `export default EditionDevis`
- **Composant React :**
  - **État Local :**
    - `activeTab`: Onglet actif ("elements" ou "settings")
  - **Fonctions Internes :**
    - `handleGeneratePdf`: Génère le PDF avec les paramètres actuels
  - **Rendu JSX :**
    - Titre de la page avec nom du projet
    - Bouton pour générer le PDF
    - Interface à onglets avec :
      - "Éléments à imprimer" : Configuration des sections à inclure
      - "Paramètres d'édition PDF" : Configuration des styles et mise en page

### `src/pages/Recapitulatif.tsx`
- **Rôle Principal :** Page de récapitulatif des travaux et du devis.
- **Imports Clés :**
  - React
  - Composants UI (Button, Card)
  - useProject (contexte de projet)
  - PropertyInfoCard, TravauxRecapContent (composants de récapitulatif)
  - generateDetailsPDF (fonction de génération PDF)
- **Exports Principaux :** `export default Recapitulatif`
- **Composant React :**
  - **Fonctions Internes :**
    - `handlePrintDevis`: Génère le PDF du devis
  - **Rendu JSX :**
    - Titre de la page
    - Informations sur le bien (PropertyInfoCard)
    - Récapitulatif des travaux par pièce (TravauxRecapContent)
    - Totaux globaux par taux de TVA
    - Boutons d'action (retour aux travaux, édition du devis, impression)

### `src/integrations/supabase/client.ts`
- **Rôle Principal :** Configure et exporte le client Supabase pour l'application.
- **Imports Clés :**
  - @supabase/supabase-js
- **Exports Principaux :**
  - `export const supabase`
- **Logique :**
  - Récupère l'URL et la clé d'API Supabase depuis les variables d'environnement
  - Crée et exporte une instance du client Supabase
  - Configure les options du client (stockage local, etc.)

### `src/lib/utils.ts`
- **Rôle Principal :** Fonctions utilitaires réutilisables dans l'application.
- **Imports Clés :**
  - clsx, tailwind-merge (utilitaires CSS)
  - date-fns (manipulation de dates)
- **Exports Principaux :**
  - `export function cn`
  - `export function formaterPrix`
  - `export function formaterDate`
  - `export function formaterMontantLettre`
- **Logique / Fonctions :**
  - `cn`: Utilitaire pour combiner les classes CSS Tailwind
  - `formaterPrix`: Formate un nombre en prix (X,XX €)
  - `formaterDate`: Formate une date selon le format français
  - `formaterMontantLettre`: Convertit un montant en toutes lettres
  - Autres fonctions mathématiques et de formatage

### `src/features/travaux/utils/travauxUtils.ts`
- **Rôle Principal :** Utilitaires pour les calculs et la manipulation des travaux.
- **Imports Clés :**
  - Types (Travail)
- **Exports Principaux :**
  - `export const calculerPrixUnitaireHT`
  - `export const calculerTotalHT`
  - `export const calculerTotalTTC`
  - `export const calculerTotauxParTVA`
  - `export const filtrerTravauxParPiece`
- **Logique / Fonctions :**
  - `calculerPrixUnitaireHT`: Calcule le prix unitaire HT (fournitures + main d'œuvre)
  - `calculerTotalHT`: Calcule le total HT d'un travail (prix unitaire × quantité)
  - `calculerTotalTTC`: Calcule le total TTC d'un travail (total HT + TVA)
  - `calculerTotauxParTVA`: Groupe les travaux par taux de TVA et calcule les totaux
  - `filtrerTravauxParPiece`: Filtre les travaux par ID de pièce

### `src/components/room/RoomForm.tsx`
- **Rôle Principal :** Formulaire pour créer ou modifier une pièce.
- **Imports Clés :**
  - React, hooks React (useState, useEffect)
  - Composants UI (Input, Select, Button)
  - Types (Room)
- **Exports Principaux :** `export default RoomForm`
- **Composant React :**
  - **Props :**
    - `initialRoom`: Données initiales de la pièce (pour l'édition)
    - `onSubmit`: Fonction appelée lors de la soumission du formulaire
    - `onCancel`: Fonction appelée lors de l'annulation
  - **État Local :**
    - `room`: Données de la pièce en cours d'édition
    - `errors`: Erreurs de validation
  - **Fonctions Internes :**
    - `handleChange`: Met à jour les champs du formulaire
    - `handleSubmit`: Valide et soumet le formulaire
    - `validateForm`: Valide les données du formulaire
    - `calculateSurface`: Calcule la surface en fonction des dimensions
  - **Rendu JSX :**
    - Champs pour le nom, type, dimensions
    - Champs calculés (surface, périmètre)
    - Boutons de soumission et d'annulation
