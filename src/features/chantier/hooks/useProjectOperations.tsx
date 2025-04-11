
import { useCallback } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { toast } from 'sonner';
import { ProjectMetadata } from '@/types';
import { supabase } from '@/lib/supabase';

/**
 * Hook centralisant toutes les opérations liées aux projets
 */
export const useProjectOperations = () => {
  const { 
    loadProject,
    deleteCurrentProject,
    // Renommer mais ne pas utiliser cette fonction de sauvegarde du contexte
    saveProject: contextSaveProject,
    currentProjectId,
    projects,
    hasUnsavedChanges,
    isLoading,
    state,
    refreshProjects,
    // Fonction pour mettre à jour l'ID du projet courant
    setCurrentProjectId,
    // Importation de la fonction updateSavedState pour mettre à jour l'état de sauvegarde
    updateSavedState
  } = useProject();

  /**
   * Charger un projet existant
   */
  const handleChargerProjet = useCallback(async (projetId: string) => {
    try {
      await loadProject(projetId);
    } catch (error) {
      console.error('Erreur lors du chargement du projet:', error);
      toast.error('Une erreur est survenue lors du chargement du projet');
    }
  }, [loadProject]);
  
  /**
   * Supprimer le projet actuel
   */
  const handleDeleteProject = useCallback(async () => {
    try {
      await deleteCurrentProject();
      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression du projet:', error);
      toast.error('Une erreur est survenue lors de la suppression du projet');
      return false;
    }
  }, [deleteCurrentProject]);
  
  /**
   * Fonction centralisée de sauvegarde de projet
   * Cette fonction est le SEUL point de sauvegarde de toute l'application
   * Elle est également utilisée par l'auto-sauvegarde
   */
  const handleSaveProject = useCallback(async (projectInfo?: any) => {
    // Identifiant unique pour le toast de sauvegarde
    const toastId = 'saving-project';
    
    // Ne pas afficher de toast pour l'auto-sauvegarde
    const isAutoSave = projectInfo?.isAutoSave;
    
    try {
      if (!isAutoSave) {
        // Afficher un toast de chargement uniquement pour les sauvegardes manuelles
        toast.loading('Sauvegarde en cours...', { id: toastId });
      }
      
      // Valider que le client ID est présent
      const metadata = state.metadata;
      const clientId = metadata.clientId || projectInfo?.client_id;
      
      if (!clientId) {
        toast.error('Veuillez sélectionner un client avant de sauvegarder le projet', { id: toastId });
        return false;
      }
      
      // Préparer les données du projet
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
      
      if (!isAutoSave) {
        console.log('Données du projet avant sauvegarde:', combinedProjectInfo);
      }
      
      let result;
      
      // Sauvegarde selon qu'on modifie un projet existant ou qu'on en crée un nouveau
      if (currentProjectId) {
        if (!isAutoSave) {
          console.log('Mise à jour du projet existant:', currentProjectId);
        }
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
        
        if (!isAutoSave) {
          console.log('Projet mis à jour avec succès:', data);
          toast.success('Projet mis à jour avec succès', { id: toastId });
        }
        result = data;
      } else {
        // Création d'un nouveau projet
        if (!isAutoSave) {
          console.log('Création d\'un nouveau projet avec client_id:', clientId);
        }
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
          
          if (!isAutoSave) {
            console.log('Projet créé avec succès:', data);
            toast.success('Projet créé avec succès', { id: toastId });
          }
          result = data;
          
          // Mettre à jour l'ID du projet courant pour éviter les doubles créations
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
      
      // Mettre à jour l'état de sauvegarde pour indiquer que le projet est sauvegardé
      updateSavedState();
      
      // Rafraîchir la liste des projets après la sauvegarde
      await refreshProjects();
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du projet:', error);
      if (!isAutoSave) {
        toast.error('Erreur lors de l\'enregistrement du projet', { id: toastId });
      }
      return false;
    }
  }, [state.metadata, state.property, state.rooms, state.travaux, currentProjectId, refreshProjects, setCurrentProjectId, updateSavedState]);

  return {
    handleChargerProjet,
    handleDeleteProject,
    handleSaveProject,
    currentProjectId,
    projects,
    hasUnsavedChanges,
    isLoading,
    projectState: state 
  };
};
