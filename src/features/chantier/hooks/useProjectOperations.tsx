// src/features/chantier/hooks/useProjectOperations.tsx
import { useCallback, useState } from 'react'; // Import de useState retiré car non utilisé ici directement
import { useProject } from '@/contexts/ProjectContext';
import { toast } from 'sonner';
import { ProjectMetadata, ProjectState } from '@/types'; // ProjectState importé
import { supabase } from '@/lib/supabase';
import { useAppState } from '@/hooks/useAppState';
// Supposons qu'un utilitaire generateId existe si besoin, sinon Supabase gère l'ID
// import { generateId } from '@/lib/utils';

/**
 * Hook centralisant toutes les opérations liées aux projets
 */
export const useProjectOperations = () => {
  const {
    loadProject,
    deleteCurrentProject,
    // contextSaveProject est ignoré
    currentProjectId,
    projects, // Récupéré pour la vérification du nom dans Save As
    hasUnsavedChanges,
    isLoading,
    state,
    dispatch, // Important pour mettre à jour l'état
    refreshProjects,
    setCurrentProjectId,
    updateSavedState,
    createNewProject
  } = useProject();

  const { updateCurrentProject, currentUser } = useAppState();

  // --- handleNewProject --- (Inchangé par rapport à votre version)
  const handleNewProject = useCallback(async () => {
    try {
      createNewProject();
      if (currentUser) {
        await updateCurrentProject(null);
      }
      return true;
    } catch (error) {
      console.error('Erreur lors de la réinitialisation du projet:', error);
      toast.error('Une erreur est survenue lors de la réinitialisation du projet');
      return false;
    }
  }, [createNewProject, updateCurrentProject, currentUser]);

  // --- handleChargerProjet --- (Inchangé par rapport à votre version)
  const handleChargerProjet = useCallback(async (projetId: string) => {
    try {
      await loadProject(projetId);
      console.log('Projet chargé, mise à jour de current_project_id dans app_state:', projetId);
      if (currentUser) {
        await updateCurrentProject(projetId);
      } else {
        console.error('Pas d\'utilisateur courant pour la mise à jour de app_state');
      }
    } catch (error) {
      console.error('Erreur lors du chargement du projet:', error);
      toast.error('Une erreur est survenue lors du chargement du projet');
    }
  }, [loadProject, updateCurrentProject, currentUser]);

  // --- handleDeleteProject --- (Inchangé par rapport à votre version)
  const handleDeleteProject = useCallback(async () => {
    try {
      await deleteCurrentProject();
      if (currentUser) {
        await updateCurrentProject(null);
      }
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression du projet:', error);
      toast.error('Une erreur est survenue lors de la suppression du projet');
      return false;
    }
  }, [deleteCurrentProject, updateCurrentProject, currentUser]);


  // --- Fonction handleSaveProject (Enregistrer) ---
  // Met à jour UNIQUEMENT un projet existant.
  const handleSaveProject = useCallback(async (projectInfo?: { isAutoSave?: boolean }) => {
    const toastId = 'saving-project';
    const isAutoSave = projectInfo?.isAutoSave;

    // 1. Vérifier si un projet est chargé
    if (!currentProjectId) {
      if (!isAutoSave) {
        toast.info('Utilisez "Enregistrer Sous" pour la première sauvegarde.', { id: toastId });
      }
      return false; // Ne peut pas enregistrer un projet inexistant
    }

    // 2. Procéder à la MISE À JOUR
    try {
      if (!isAutoSave) {
        toast.loading('Mise à jour en cours...', { id: toastId });
      }

      if (!state || !currentUser) { // Vérifier aussi currentUser pour user_id
        console.error('Erreur: état ou utilisateur non disponible dans handleSaveProject (UPDATE)');
        if (!isAutoSave) {
          toast.error('Erreur lors de la mise à jour : état ou utilisateur non disponible', { id: toastId });
        }
        return false;
      }

      // --- Préparation des données pour UPDATE ---
      const metadata = state.metadata || ({} as ProjectMetadata); // Assurer que metadata existe
      const clientId = metadata.clientId; // Client ID depuis l'état

       if (!clientId && !isAutoSave) {
           toast.error('Veuillez sélectionner un client avant de sauvegarder le projet', { id: toastId });
           return false;
       }

      // On ne met à jour que les champs nécessaires et project_data
      const updatePayload = {
        client_id: clientId,
        name: metadata.nomProjet || 'Projet sans nom',
        description: metadata.descriptionProjet || '',
        address: metadata.adresseChantier || '',
        occupant: metadata.occupant || '',
        general_data: {
          infoComplementaire: metadata.infoComplementaire || '',
          dateDevis: metadata.dateDevis || new Date().toISOString().split('T')[0]
        },
        devis_number: metadata.devisNumber || '',
        // S'assurer que l'état complet et à jour est sauvegardé dans project_data
        project_data: {
            ...state, // Copie l'état courant
            id: currentProjectId, // Assure que l'ID est bien dans les données sauvegardées
            isDirty: false, // Marqué comme non-sale dans les données sauvegardées
        } as ProjectState // Assertion de type pour typescript
      };
      // -----------------------------------------

      console.log('Mise à jour du projet existant:', currentProjectId);
      const { data, error } = await supabase
        .from('projects_save')
        .update(updatePayload) // Utilise l'objet préparé
        .eq('id', currentProjectId)
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de la mise à jour du projet:', error);
        if (!isAutoSave) {
          toast.error(`Erreur lors de la mise à jour: ${error.message}`, { id: toastId });
        }
        return false;
      }

      if (!isAutoSave) {
        console.log('Projet mis à jour avec succès:', data);
        toast.success('Projet mis à jour avec succès', { id: toastId });
      }

      // Mettre à jour l'état local : marquer comme non-sale
      dispatch({ type: 'SET_DIRTY', payload: false });
      updateSavedState(); // Peut-être pour une logique UI supplémentaire

      // Pas besoin de rafraîchir la liste pour une simple mise à jour ici
      // await refreshProjects();

      return true;

    } catch (error) {
      console.error('Erreur lors de la mise à jour du projet:', error);
      if (!isAutoSave) {
        toast.error(`Erreur lors de la mise à jour : ${error instanceof Error ? error.message : 'Erreur inconnue'}`, { id: toastId });
      }
      return false;
    }
  }, [state, currentProjectId, currentUser, supabase, dispatch, updateSavedState]);


  // --- Fonction handleSaveProjectAs (Enregistrer Sous) ---
  // Crée TOUJOURS un nouveau projet avec vérification du nom.
  const handleSaveProjectAs = useCallback(async (newProjectName: string) => {
    const toastId = 'saving-project-as';
    toast.loading('Enregistrement sous...', { id: toastId });

    if (!state || !currentUser) {
      toast.error('Impossible d\'enregistrer : état ou utilisateur non disponible.', { id: toastId });
      return false;
    }

    const trimmedNewName = newProjectName.trim();
    if (!trimmedNewName) {
      toast.error('Veuillez entrer un nom pour le projet.', { id: toastId });
      return false;
    }

    try {
      // --- Vérification de l'unicité du nom ---
      let uniqueName = trimmedNewName;
      let counter = 1;
      let nameExists = true;

      // Fonction interne pour vérifier si un nom existe déjà pour cet utilisateur
      const checkNameExists = async (nameToCheck: string): Promise<boolean> => {
          const { data, error } = await supabase
              .from('projects_save')
              .select('id', { count: 'exact', head: true }) // Plus efficace : juste compter
              .eq('user_id', currentUser.id)
              .eq('name', nameToCheck);

          if (error) {
              console.error("Erreur lors de la vérification du nom:", error);
              throw new Error("Erreur lors de la vérification du nom du projet.");
          }
          return (data?.count ?? 0) > 0; // Retourne true si le compte est > 0
      };

      nameExists = await checkNameExists(uniqueName);

      while (nameExists) {
          uniqueName = `${trimmedNewName} (${counter})`;
          nameExists = await checkNameExists(uniqueName);
          counter++;
          if(counter > 100) { // Sécurité pour éviter boucle infinie
             throw new Error("Impossible de trouver un nom de projet unique.");
          }
      }
      // -----------------------------------------

      // --- Préparation des données pour INSERT ---
      // Créer une copie profonde
      const projectStateToSave: ProjectState = JSON.parse(JSON.stringify(state));

      // Assigner le nom unique et mettre ID à null
      if (!projectStateToSave.metadata) projectStateToSave.metadata = {} as ProjectMetadata;
      projectStateToSave.metadata.nomProjet = uniqueName;
      projectStateToSave.id = null; // Force la génération d'un nouvel ID par la DB
      projectStateToSave.isDirty = false; // Le nouvel enregistrement est propre

      const clientId = projectStateToSave.metadata.clientId;
      if (!clientId) {
         toast.error('Veuillez sélectionner un client avant de sauvegarder le projet.', { id: toastId });
         return false;
      }

      const insertPayload = {
          user_id: currentUser.id,
          client_id: clientId,
          name: uniqueName, // Nom unique vérifié
          description: projectStateToSave.metadata.descriptionProjet || '',
          address: projectStateToSave.metadata.adresseChantier || '',
          occupant: projectStateToSave.metadata.occupant || '',
          general_data: {
            infoComplementaire: projectStateToSave.metadata.infoComplementaire || '',
            dateDevis: projectStateToSave.metadata.dateDevis || new Date().toISOString().split('T')[0]
          },
          devis_number: projectStateToSave.metadata.devisNumber || '',
          project_data: projectStateToSave // Sauvegarder l'état complet
      };
      // ------------------------------------------

      console.log('Création d\'un nouveau projet (Enregistrer Sous) avec le nom:', uniqueName);
      const { data: newlySavedProject, error } = await supabase
          .from('projects_save')
          .insert(insertPayload)
          .select() // Sélectionner l'enregistrement complet inséré
          .single(); // S'attendre à une seule ligne

      if (error || !newlySavedProject) {
          console.error('Erreur lors de la création du projet (Enregistrer Sous):', error);
          toast.error(`Erreur lors de la création: ${error?.message ?? 'Inconnue'}`, { id: toastId });
          return false;
      }

      console.log('Projet créé avec succès (Enregistrer Sous):', newlySavedProject);
      toast.success(`Projet enregistré sous "${uniqueName}"`, { id: toastId });

      // --- Mise à jour de l'état de l'application ---
      const newProjectId = newlySavedProject.id;
      setCurrentProjectId(newProjectId);

      // Assurer que les données chargées dans l'état sont valides et complètes
      let finalStateToLoad: ProjectState | null = null;
      if (newlySavedProject.project_data && typeof newlySavedProject.project_data === 'object') {
          finalStateToLoad = newlySavedProject.project_data as ProjectState;
          finalStateToLoad.id = newProjectId; // Mettre le bon ID
          finalStateToLoad.isDirty = false; // Marquer comme propre
      } else {
           console.warn("project_data n'a pas été retourné ou est invalide, rechargement...");
           // Optionnel: recharger depuis la DB si project_data n'est pas retourné par l'insert/select
           // const reloadedState = await projectSaveService.loadProject(newProjectId);
           // if (reloadedState) finalStateToLoad = reloadedState;
           // Pour l'instant, on crée un nouvel état vide si le retour est mauvais
           finalStateToLoad = createNewProject(); // Ou une version adaptée
           finalStateToLoad.id = newProjectId;
           finalStateToLoad.metadata.nomProjet = uniqueName; // S'assurer que le nom est bon
           finalStateToLoad.isDirty = false;

      }

       if(finalStateToLoad){
         dispatch({ type: 'LOAD_PROJECT', payload: finalStateToLoad });
       } else {
         // Gérer le cas où même le rechargement échoue
         toast.error("Erreur critique lors du chargement du projet nouvellement sauvegardé.");
         return false;
       }


      // Mettre à jour l'ID du projet courant dans app_state
      await updateCurrentProject(newProjectId);

      updateSavedState();
      await refreshProjects();

      return true; // Indiquer le succès

    } catch (error) {
      console.error('Erreur lors de l\'enregistrement sous:', error);
      toast.error(`Erreur lors de l'enregistrement : ${error instanceof Error ? error.message : 'Erreur inconnue'}`, { id: toastId });
      return false; // Indiquer l'échec
    }
  }, [state, projects, currentUser, supabase, updateCurrentProject, setCurrentProjectId, dispatch, refreshProjects, updateSavedState, createNewProject]); // Ajout de createNewProject si utilisé en fallback


  return {
    handleChargerProjet,
    handleDeleteProject,
    handleSaveProject,    // Fonction "Enregistrer" (UPDATE seulement)
    handleSaveProjectAs,  // Fonction "Enregistrer Sous" (INSERT seulement)
    handleNewProject,
    currentProjectId,
    projects,
    hasUnsavedChanges,
    isLoading,
    projectState: state
  };
};