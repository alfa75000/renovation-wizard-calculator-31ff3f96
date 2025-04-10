
// Service principal qui réexporte toutes les fonctions des modules spécialisés
import { supabase } from '@/lib/supabase';
import { ProjectState } from '@/types';
import { 
  fetchProjects, 
  createProjectBase, 
  updateProjectBase, 
  deleteProject, 
  generateDefaultProjectName,
  type Project
} from './projectBaseService';
import { syncRoomsForProject } from './roomsService';
import { syncMenuiseriesForRoom, syncCustomSurfacesForRoom } from './roomItemsService';
import { syncWorksForProject } from './roomWorksService';
import { loadFullProjectData } from './projectUtils';

/**
 * Récupère un projet spécifique et toutes ses données associées
 */
export const fetchProjectById = async (projectId: string) => {
  try {
    // Récupérer les informations de base du projet
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();
    
    if (projectError) {
      console.error('Erreur lors de la récupération du projet:', projectError);
      throw projectError;
    }
    
    if (!projectData) {
      throw new Error('Projet non trouvé');
    }
    
    // Charger toutes les données du projet
    return await loadFullProjectData(projectId, projectData);
  } catch (error) {
    console.error('Exception lors de la récupération du projet:', error);
    throw error;
  }
};

/**
 * Crée un nouveau projet complet dans Supabase
 */
export const createProject = async (projectState: ProjectState, projectInfo: any = {}) => {
  try {
    // 1. Créer le projet de base
    const projectData = await createProjectBase(projectState.property, projectInfo);
    const projectId = projectData.id;
    
    // 2. Créer les pièces
    for (const room of projectState.rooms) {
      // 2.1 Créer la pièce
      await syncRoomsForProject(projectId, projectState.rooms);
      
      // 2.2 Créer les menuiseries pour cette pièce
      if (room.menuiseries && room.menuiseries.length > 0) {
        await syncMenuiseriesForRoom(room.id, room.menuiseries);
      }
      
      // 2.3 Créer les autres surfaces pour cette pièce
      if (room.autresSurfaces && room.autresSurfaces.length > 0) {
        await syncCustomSurfacesForRoom(room.id, room.autresSurfaces);
      }
    }
    
    // 3. Créer les travaux
    const roomIds = projectState.rooms.map(room => room.id);
    await syncWorksForProject(roomIds, projectState.travaux);
    
    return {
      id: projectId,
      name: projectInfo.name || projectData.name
    };
  } catch (error) {
    console.error('Exception lors de la création du projet complet:', error);
    throw error;
  }
};

/**
 * Met à jour un projet existant dans Supabase
 */
export const updateProject = async (projectId: string, projectState: ProjectState, projectInfo: any = {}) => {
  try {
    // 1. Mettre à jour les informations de base du projet
    await updateProjectBase(projectId, projectState.property, projectInfo);
    
    // 2. Synchroniser les pièces
    await syncRoomsForProject(projectId, projectState.rooms);
    
    // 3. Pour chaque pièce, synchroniser les menuiseries et surfaces personnalisées
    for (const room of projectState.rooms) {
      if (room.menuiseries && room.menuiseries.length > 0) {
        await syncMenuiseriesForRoom(room.id, room.menuiseries);
      }
      
      if (room.autresSurfaces && room.autresSurfaces.length > 0) {
        await syncCustomSurfacesForRoom(room.id, room.autresSurfaces);
      }
    }
    
    // 4. Synchroniser les travaux
    const roomIds = projectState.rooms.map(room => room.id);
    await syncWorksForProject(roomIds, projectState.travaux);
    
    return {
      id: projectId,
      name: projectInfo.name
    };
  } catch (error) {
    console.error('Exception lors de la mise à jour du projet:', error);
    throw error;
  }
};

// Réexporter toutes les fonctions publiques
export {
  fetchProjects,
  deleteProject,
  generateDefaultProjectName,
  type Project
};
