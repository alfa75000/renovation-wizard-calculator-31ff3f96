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
