
import { useCallback } from 'react';
import { useProject } from '@/contexts/ProjectContext';
import { toast } from 'sonner';
import { ProjectMetadata } from '@/types';
import { supabase } from '@/lib/supabase';

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
    refreshProjects
  } = useProject();

  // Handler for loading a project
  const handleChargerProjet = useCallback(async (projetId: string) => {
    try {
      await loadProject(projetId);
    } catch (error) {
      console.error('Erreur lors du chargement du projet:', error);
      toast.error('Une erreur est survenue lors du chargement du projet');
    }
  }, [loadProject]);
  
  // Handler for deleting the current project
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
  
  // Handler for saving the current project
  const handleSaveProject = useCallback(async (projectInfo?: any) => {
    try {
      console.log('handleSaveProject appelé avec:', projectInfo);
      
      // Prepare project metadata from the state
      const metadata = state.metadata;
      
      // Combine with any additional project info passed in
      const combinedProjectInfo = {
        client_id: metadata.clientId || projectInfo?.client_id,
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
        },
        ...projectInfo // This allows overriding defaults if needed
      };
      
      console.log('CombinedProjectInfo avant sauvegarde:', combinedProjectInfo);
      
      // Si nous sommes en mode édition (currentProjectId existe)
      if (currentProjectId) {
        console.log('Mise à jour du projet existant:', currentProjectId);
        const { data, error } = await supabase
          .from('projects_save')
          .update(combinedProjectInfo)
          .eq('id', currentProjectId)
          .select();
          
        if (error) {
          console.error('Erreur lors de la mise à jour du projet:', error);
          toast.error('Erreur lors de la mise à jour du projet');
          return false;
        }
        
        console.log('Projet mis à jour avec succès:', data);
        
        // Rafraîchir la liste des projets après la mise à jour
        await refreshProjects();
        
        toast.success('Projet mis à jour avec succès');
        return true;
      } else {
        // Sinon, on crée un nouveau projet
        console.log('Création d\'un nouveau projet');
        const { data, error } = await supabase
          .from('projects_save')
          .insert(combinedProjectInfo)
          .select();
          
        if (error) {
          console.error('Erreur lors de la création du projet:', error);
          toast.error('Erreur lors de la création du projet');
          return false;
        }
        
        console.log('Projet créé avec succès:', data);
        
        // Rafraîchir la liste des projets après la création
        await refreshProjects();
        
        toast.success('Projet créé avec succès');
        return true;
      }
      
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement du projet:', error);
      toast.error('Erreur lors de l\'enregistrement du projet');
      return false;
    }
  }, [state.metadata, state.property, state.rooms, state.travaux, currentProjectId, refreshProjects]);

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
