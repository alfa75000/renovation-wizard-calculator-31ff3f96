import { useCallback } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { toast } from 'sonner';
import { ProjectMetadata } from '@/types';
import { supabase } from '@/lib/supabase';
import { useAppState } from '@/hooks/useAppState';

export const useProjectOperations = () => {
  const { 
    loadProject,
    deleteCurrentProject,
    saveProject: contextSaveProject,
    currentProjectId,
    projects,
    hasUnsavedChanges,
    isLoading,
    state,
    refreshProjects,
    setCurrentProjectId,
    updateSavedState,
    createNewProject
  } = useProject();

  const { updateCurrentProject, currentUser } = useAppState();

  // Vérifie si un numéro de devis existe déjà
  const checkDevisNumberExists = useCallback(async (devisNumber: string): Promise<boolean> => {
    if (!devisNumber) return false;
    try {
      const { data, error } = await supabase
        .from('projects_save')
        .select('id')
        .eq('devis_number', devisNumber)
        .limit(1)
        .maybeSingle();
      
      if (error) {
        console.error('Erreur lors de la vérification du numéro de devis:', error);
        toast.error('Erreur lors de la vérification du numéro de devis');
        return false;
      }
      
      return !!data;
    } catch (error) {
      console.error('Exception lors de la vérification du numéro de devis:', error);
      toast.error('Erreur lors de la vérification du numéro de devis');
      return false;
    }
  }, []);

  // Enregistre le projet sous un nouveau nom (toujours INSERT)
  const handleSaveAsProject = useCallback(async (newDevisNumber: string) => {
    const toastId = 'saving-project-as';
    toast.loading('Vérification du numéro de devis...', { id: toastId });
    
    try {
      if (!state) {
        toast.error('État du projet non disponible', { id: toastId });
        return false;
      }

      const defaultMetadata: ProjectMetadata = {
        clientId: '',
        nomProjet: '',
        descriptionProjet: '',
        adresseChantier: '',
        occupant: '',
        infoComplementaire: '',
        dateDevis: '',
        devisNumber: ''
      };

      const metadata = state.metadata || defaultMetadata;
      
      if (!newDevisNumber) {
        toast.error('Numéro de devis manquant', { id: toastId });
        return false;
      }

      const exists = await checkDevisNumberExists(newDevisNumber);
      if (exists) {
        toast.error('Ce numéro de devis existe déjà. Veuillez le modifier.', { id: toastId });
        return false;
      }

      const clientId = metadata.clientId;
      if (!clientId) {
        toast.error('Veuillez sélectionner un client avant de sauvegarder le projet', { id: toastId });
        return false;
      }

      const combinedProjectInfo = {
        client_id: clientId,
        name: `${metadata.nomProjet} (Copie)`,
        description: metadata.descriptionProjet || '',
        address: metadata.adresseChantier || '',
        occupant: metadata.occupant || '',
        general_data: {
          infoComplementaire: metadata.infoComplementaire || '',
          dateDevis: new Date().toISOString().split('T')[0]
        },
        devis_number: newDevisNumber,
        project_data: {
          property: state.property || {
            type: 'Appartement',
            floors: 1,
            totalArea: 0,
            rooms: 0,
            ceilingHeight: 2.5,
          },
          rooms: state.rooms || [],
          travaux: state.travaux || [],
          metadata: metadata
        }
      };

      const { data, error } = await supabase
        .from('projects_save')
        .insert(combinedProjectInfo)
        .select();

      if (error) {
        console.error('Erreur lors de la création du projet:', error);
        toast.error('Erreur lors de la sauvegarde du projet', { id: toastId });
        return false;
      }

      toast.success('Projet enregistré avec succès', { id: toastId });

      if (data && data[0] && data[0].id) {
        const projectId = data[0].id;
        setCurrentProjectId(projectId);
        
        if (currentUser) {
          const success = await updateCurrentProject(projectId);
          if (!success) {
            console.error("Échec de la mise à jour de l'état global");
          }
        }
      }

      updateSavedState();
      await refreshProjects();
      return true;
      
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du projet :', error);
      toast.error('Erreur lors de l\'enregistrement du projet', { id: toastId });
      return false;
    }
  }, [
    state,
    checkDevisNumberExists,
    currentUser,
    updateCurrentProject,
    setCurrentProjectId,
    updateSavedState,
    refreshProjects
  ]);

  // Fonctions existantes non modifiées
  const handleNewProject = useCallback(async () => {
    try {
      createNewProject();
      if (currentUser) {
        const success = await updateCurrentProject(null);
        if (!success) {
          console.error('Échec de la mise à jour de current_project_id à NULL dans app_state');
          try {
            const { error } = await supabase
              .from('app_state')
              .update({ current_project_id: null })
              .eq('user_id', currentUser.id);
            if (error) {
              console.error('Échec de la mise à jour directe:', error);
            }
          } catch (e) {
            console.error('Exception lors de la mise à jour directe:', e);
          }
        }
      }
      return true;
    } catch (error) {
      console.error('Erreur lors de la réinitialisation du projet:', error);
      toast.error('Une erreur est survenue lors de la réinitialisation du projet');
      return false;
    }
  }, [createNewProject, updateCurrentProject, currentUser]);

  const handleChargerProjet = useCallback(async (projetId: string) => {
    try {
      await loadProject(projetId);
      if (currentUser) {
        const success = await updateCurrentProject(projetId);
        if (!success) {
          try {
            const { error } = await supabase
              .from('app_state')
              .update({ current_project_id: projetId })
              .eq('user_id', currentUser.id);
            if (error) {
              console.error('Échec de la mise à jour directe:', error);
            }
          } catch (e) {
            console.error('Exception lors de la mise à jour directe:', e);
          }
        }
      }
    } catch (error) {
      console.error('Erreur lors du chargement du projet:', error);
      toast.error('Une erreur est survenue lors du chargement du projet');
    }
  }, [loadProject, updateCurrentProject, currentUser]);

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

  const handleSaveProject = useCallback(async (projectInfo?: any) => {
    const toastId = 'saving-project';
    const isAutoSave = projectInfo?.isAutoSave;

    try {
      if (!isAutoSave) {
        toast.loading('Sauvegarde en cours...', { id: toastId });
      }

      if (!state) {
        console.error('Erreur: state est undefined dans handleSaveProject');
        if (!isAutoSave) {
          toast.error('Erreur lors de la sauvegarde du projet: état non disponible', { id: toastId });
        }
        return false;
      }

      const defaultMetadata: ProjectMetadata = {
        clientId: '',
        nomProjet: '',
        descriptionProjet: '',
        adresseChantier: '',
        occupant: '',
        infoComplementaire: '',
        dateDevis: '',
        devisNumber: ''
      };

      const metadata = state.metadata || defaultMetadata;
      const clientId = metadata.clientId || projectInfo?.client_id;

      if (!clientId) {
        toast.error('Veuillez sélectionner un client avant de sauvegarder le projet', { id: toastId });
        return false;
      }

      const combinedProjectInfo = {
        client_id: clientId,
        name: metadata.nomProjet || projectInfo?.name || 'Projet sans nom',
        description: metadata.descriptionProjet || projectInfo?.description || '',
        address: metadata.adresseChantier || projectInfo?.address || '',
        occupant: metadata.occupant || projectInfo?.occupant || '',
        general_data: {
          infoComplementaire: metadata.infoComplementaire || projectInfo?.general_data?.infoComplementaire || '',
          dateDevis: metadata.dateDevis || projectInfo?.general_data?.dateDevis || new Date().toISOString().split('T')[0]
        },
        devis_number: metadata.devisNumber || projectInfo?.devis_number || '',
        project_data: {
          property: state.property || {
            type: 'Appartement',
            floors: 1,
            totalArea: 0,
            rooms: 0,
            ceilingHeight: 2.5,
          },
          rooms: state.rooms || [],
          travaux: state.travaux || [],
          metadata: metadata
        }
      };

      let result;
      if (currentProjectId) {
        const { data, error } = await supabase
          .from('projects_save')
          .update(combinedProjectInfo)
          .eq('id', currentProjectId)
          .select();
        if (error) {
          console.error('Erreur lors de la mise à jour du projet:', error);
          if (!isAutoSave) {
            toast.error('Erreur lors de la mise à jour du projet', { id: toastId });
          }
          return false;
        }
        result = data;
      } else {
        try {
          const { data, error } = await supabase
            .from('projects_save')
            .insert(combinedProjectInfo)
            .select();
          if (error) {
            console.error('Erreur lors de la création du projet:', error);
            if (!isAutoSave) {
              toast.error('Erreur lors de la création du projet', { id: toastId });
            }
            return false;
          }
          result = data;
          if (data && data[0] && data[0].id) {
            setCurrentProjectId(data[0].id);
          }
        } catch (innerError) {
          console.error('Exception lors de la création du projet:', innerError);
          if (!isAutoSave) {
            toast.error(`Erreur lors de la création du projet: ${innerError instanceof Error ? innerError.message : 'Erreur inconnue'}`, { id: toastId });
          }
          return false;
        }
      }

      if (result && result[0] && result[0].id) {
        const projectId = result[0].id;
        if (currentUser) {
          const success = await updateCurrentProject(projectId);
          if (!success) {
            try {
              const { error } = await supabase
                .from('app_state')
                .update({ current_project_id: projectId })
                .eq('user_id', currentUser.id);
              if (error) {
                console.error('Échec de la mise à jour directe:', error);
              }
            } catch (e) {
              console.error('Exception lors de la mise à jour directe:', e);
            }
          }
        }
      }

      updateSavedState();
      await refreshProjects();
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du projet:', error);
      if (!isAutoSave) {
        toast.error('Erreur lors de l\'enregistrement du projet', { id: toastId });
      }
      return false;
    }
  }, [state, currentProjectId, refreshProjects, setCurrentProjectId, updateSavedState, updateCurrentProject, currentUser]);

  return {
    handleChargerProjet,
    handleDeleteProject,
    handleSaveProject,
    handleSaveAsProject,  // ✅ Nouvelle fonction exposée
    handleNewProject,
    currentProjectId,
    projects,
    hasUnsavedChanges,
    isLoading,
    projectState: state 
  };
};