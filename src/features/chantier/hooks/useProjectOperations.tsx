// src/features/chantier/hooks/useProjectOperations.tsx
import { useCallback } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { toast } from 'sonner';
import { ProjectMetadata, ProjectState, Client } from '@/types'; // Client et ProjectState importés
import { supabase } from '@/lib/supabase';
import { useAppState } from '@/hooks/useAppState';
import { generateDevisNumber } from '@/services/projectService'; // Importer la fonction de génération
import { useClients } from '@/contexts/ClientsContext'; // Importer pour trouver le client

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
  const { state: clientsState } = useClients(); // Pour obtenir les détails client

  // --- handleNewProject ---
  const handleNewProject = useCallback(async () => {
    try {
      createNewProject();
      if (currentUser) {
        await updateCurrentProject(null);
         // Logique de fallback directe retirée pour la clarté
      }
      return true;
    } catch (error) {
      console.error('Erreur lors de la réinitialisation du projet:', error);
      toast.error('Une erreur est survenue lors de la réinitialisation du projet');
      return false;
    }
  }, [createNewProject, updateCurrentProject, currentUser]);


  // --- handleChargerProjet ---
  const handleChargerProjet = useCallback(async (projetId: string) => {
    try {
      await loadProject(projetId);
      console.log('Projet chargé, mise à jour de current_project_id dans app_state:', projetId);
      if (currentUser) {
        await updateCurrentProject(projetId);
         // Logique de fallback directe retirée pour la clarté
      } else {
        console.error('Pas d\'utilisateur courant pour la mise à jour de app_state');
      }
    } catch (error) {
      console.error('Erreur lors du chargement du projet:', error);
      toast.error('Une erreur est survenue lors du chargement du projet');
    }
  }, [loadProject, updateCurrentProject, currentUser]);

  // --- handleDeleteProject ---
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
  // Crée TOUJOURS un nouveau projet avec vérification du nom et du numéro de devis.
  const handleSaveProjectAs = useCallback(async (desiredBaseName: string) => {
    const toastId = 'saving-project-as';
    toast.loading('Enregistrement sous...', { id: toastId });

    if (!state || !currentUser || !clientsState.clients) {
      toast.error('Impossible d\'enregistrer : état, utilisateur ou données client non disponible.', { id: toastId });
      return false;
    }

    const trimmedBaseName = desiredBaseName.trim();
    if (!trimmedBaseName) {
      toast.error('Veuillez entrer un nom pour le projet.', { id: toastId });
      return false;
    }

    try {
      // --- Préparation de la copie de l'état ---
      const projectStateToSave: ProjectState = JSON.parse(JSON.stringify(state));
      projectStateToSave.id = null; // Important pour INSERT
      projectStateToSave.isDirty = false;
      if (!projectStateToSave.metadata) projectStateToSave.metadata = {} as ProjectMetadata;
      // --- Fin préparation copie ---

      // --- Vérification et génération Numéro Devis Unique ---
      let finalDevisNumber = projectStateToSave.metadata.devisNumber;
      let devisNumberToCheck = finalDevisNumber;
      let devisNumberExists = false;

      // Fonction interne pour vérifier si un devisNumber existe déjà pour cet utilisateur (CORRIGÉE)
      const checkDevisNumberExists = async (numberToCheck: string | null | undefined): Promise<boolean> => {
          if (!numberToCheck || !currentUser) return false;
          const { data, error } = await supabase
              .from('projects_save')
              .select('id') // Sélectionner juste l'ID
              .eq('user_id', currentUser.id)
              .eq('devis_number', numberToCheck) // Filtre sur devis_number
              .limit(1) // Limiter à 1 résultat
              .maybeSingle(); // Utiliser maybeSingle()

          if (error) {
              console.error("Erreur lors de la vérification du numéro de devis:", error);
              toast.error(`Erreur technique lors de la vérification du numéro de devis: ${error.message}`);
              return true; // Considérer comme existant par sécurité
          }
          return data !== null; // Existe si data n'est pas null
      };

      devisNumberExists = await checkDevisNumberExists(devisNumberToCheck);

      if (devisNumberExists || !finalDevisNumber) {
          console.log(`Numéro de devis "${finalDevisNumber}" existe ou est vide, génération d'un nouveau...`);
          finalDevisNumber = await generateDevisNumber();
          projectStateToSave.metadata.devisNumber = finalDevisNumber;
          toast.info(`Nouveau numéro de devis généré : ${finalDevisNumber}`);
      }
      // --- Fin Vérification Numéro Devis ---

      // --- Re-génération du nom de projet basé sur le numéro de devis FINAL ---
      let baseNameToMakeUnique = trimmedBaseName;
      const client = clientsState.clients.find(c => c.id === projectStateToSave.metadata.clientId);
      if (client && finalDevisNumber) {
           const clientName = `${client.nom} ${client.prenom || ''}`.trim();
           let generatedName = `Devis n° ${finalDevisNumber} - ${clientName}`;
           const desc = projectStateToSave.metadata.descriptionProjet;
           if (desc) {
               generatedName += desc.length > 40 ? ` - ${desc.substring(0, 40)}...` : ` - ${desc}`;
           }
           baseNameToMakeUnique = generatedName;
           console.log("Nom de base recalculé:", baseNameToMakeUnique);
       } else {
         console.log("Utilisation du nom demandé comme base:", baseNameToMakeUnique);
       }
       // --- Fin Re-génération Nom ---


      // --- Vérification de l'unicité du nom FINAL ---
      let uniqueName = baseNameToMakeUnique;
      let counter = 1;
      let nameExists = true;

      // Fonction interne pour vérifier si un nom existe déjà (CORRIGÉE)
      const checkNameExists = async (nameToCheck: string): Promise<boolean> => {
          if (!currentUser) return false;
          const { data, error } = await supabase
              .from('projects_save')
              .select('id')
              .eq('user_id', currentUser.id)
              .eq('name', nameToCheck)
              .limit(1)
              .maybeSingle();

          if (error) {
              console.error("Erreur lors de la vérification du nom:", error);
              toast.error(`Erreur technique lors de la vérification du nom: ${error.message}`);
              return true; // Prévention
          }
          return data !== null;
      };

      nameExists = await checkNameExists(uniqueName);

      while (nameExists) {
          uniqueName = `${baseNameToMakeUnique} (${counter})`;
          nameExists = await checkNameExists(uniqueName);
          counter++;
          if(counter > 100) {
             throw new Error("Impossible de trouver un nom de projet unique après 100 tentatives.");
          }
      }
      // --- Fin Vérification Nom ---

      // Mettre à jour le nom final dans les métadonnées de la copie
      projectStateToSave.metadata.nomProjet = uniqueName;

      // --- Préparation finale des données pour INSERT ---
      const insertPayload = {
          user_id: currentUser.id,
          client_id: projectStateToSave.metadata.clientId,
          name: uniqueName, // Le nom final unique
          description: projectStateToSave.metadata.descriptionProjet || '',
          address: projectStateToSave.metadata.adresseChantier || '',
          occupant: projectStateToSave.metadata.occupant || '',
          general_data: {
            infoComplementaire: projectStateToSave.metadata.infoComplementaire || '',
            dateDevis: projectStateToSave.metadata.dateDevis || new Date().toISOString().split('T')[0]
          },
          devis_number: finalDevisNumber, // Le numéro de devis final (unique ou original)
          project_data: projectStateToSave
      };

      if (!insertPayload.client_id) {
         toast.error('Veuillez sélectionner un client avant de sauvegarder le projet.', { id: toastId });
         return false;
      }
      // ------------------------------------------

      console.log('Création d\'un nouveau projet (Enregistrer Sous) avec le nom final:', uniqueName);
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

      let finalStateToLoad: ProjectState | null = null;
      if (newlySavedProject.project_data && typeof newlySavedProject.project_data === 'object') {
          finalStateToLoad = newlySavedProject.project_data as ProjectState;
          finalStateToLoad.id = newProjectId;
          finalStateToLoad.isDirty = false;
      } else {
           console.warn("project_data n'a pas été retourné ou est invalide.");
           finalStateToLoad = createNewProject();
           if(finalStateToLoad) { // Vérifier si createNewProject a retourné quelque chose
             finalStateToLoad.id = newProjectId;
             finalStateToLoad.metadata = {
               ...finalStateToLoad.metadata,
               nomProjet: uniqueName,
               clientId: insertPayload.client_id,
               devisNumber: finalDevisNumber,
               dateDevis: insertPayload.general_data.dateDevis,
               descriptionProjet: insertPayload.description,
               adresseChantier: insertPayload.address,
               occupant: insertPayload.occupant,
               infoComplementaire: insertPayload.general_data.infoComplementaire,
             };
             finalStateToLoad.isDirty = false;
           }
      }

       if(finalStateToLoad){
         dispatch({ type: 'LOAD_PROJECT', payload: finalStateToLoad });
       } else {
         toast.error("Erreur critique lors du chargement du projet nouvellement sauvegardé.");
         return false;
       }

      await updateCurrentProject(newProjectId);
      updateSavedState();
      await refreshProjects();

      return true; // Indiquer le succès

    } catch (error) {
      console.error('Erreur lors de l\'enregistrement sous:', error);
      toast.error(`Erreur lors de l'enregistrement : ${error instanceof Error ? error.message : 'Erreur inconnue'}`, { id: toastId });
      return false; // Indiquer l'échec
    }
  }, [state, projects, currentUser, clientsState.clients, supabase, updateCurrentProject, setCurrentProjectId, dispatch, refreshProjects, updateSavedState, createNewProject]);


  return {
    handleChargerProjet,
    handleDeleteProject,
    handleSaveProject,    // Fonction "Enregistrer" (UPDATE seulement)
    handleSaveProjectAs,  // Fonction "Enregistrer Sous" (INSERT seulement + unicité nom/devis)
    handleNewProject,
    currentProjectId,
    projects,
    hasUnsavedChanges,
    isLoading,
    projectState: state
  };
};