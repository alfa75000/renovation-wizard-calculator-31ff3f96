
import { supabase } from '@/lib/supabase';
import { ProjectState } from '@/types';

// Type pour la table projects_save
export interface ProjectSave {
  id: string;
  name: string;
  client_id: string | null;
  project_data: any; // Stockage JSON des données du projet
  general_data: any; // Informations générales
  service_groups_used?: any[]; // Types de travaux utilisés
  description: string;
  address: string;
  postal_code: string;
  city: string;
  occupant: string;
  property_type: string;
  floors: number;
  total_area: number;
  rooms_count: number;
  ceiling_height: number;
  status: string;
  created_at: string;
  updated_at: string;
  devis_number: string | null; // Nouveau champ pour le numéro de devis
}

/**
 * Récupération de tous les projets
 */
export const fetchProjectSaves = async (): Promise<ProjectSave[]> => {
  try {
    const { data, error } = await supabase
      .from('projects_save')
      .select('*')
      .order('updated_at', { ascending: false });
    
    if (error) {
      console.error('Erreur lors de la récupération des projets:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Exception lors de la récupération des projets:', error);
    throw error;
  }
};

/**
 * Génère un nom par défaut pour un nouveau projet
 */
export const generateDefaultProjectName = (): string => {
  const date = new Date();
  return `Projet du ${date.toLocaleDateString('fr-FR')}`;
};

/**
 * Génère un numéro de devis unique au format AAMM-X
 */
export const generateDevisNumber = async (): Promise<string> => {
  try {
    const date = new Date();
    const year = date.getFullYear().toString().substring(2); // Prendre les 2 derniers chiffres de l'année
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Mois sur 2 chiffres
    const prefix = `${year}${month}-`;
    
    // Récupérer le dernier numéro de devis avec ce préfixe
    const { data, error } = await supabase
      .from('projects_save')
      .select('devis_number')
      .like('devis_number', `${prefix}%`)
      .order('devis_number', { ascending: false })
      .limit(1);
    
    if (error) {
      console.error('Erreur lors de la récupération du dernier numéro de devis:', error);
      throw error;
    }
    
    let sequenceNumber = 1;
    
    if (data && data.length > 0 && data[0].devis_number) {
      // Extraire le numéro de séquence du dernier devis
      const lastNumber = data[0].devis_number.split('-')[1];
      if (lastNumber && !isNaN(parseInt(lastNumber))) {
        sequenceNumber = parseInt(lastNumber) + 1;
      }
    }
    
    return `${prefix}${sequenceNumber}`;
  } catch (error) {
    console.error('Exception lors de la génération du numéro de devis:', error);
    throw error;
  }
};

/**
 * Vérifie si un numéro de devis est unique
 */
export const isDevisNumberUnique = async (devisNumber: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('projects_save')
      .select('id')
      .eq('devis_number', devisNumber)
      .limit(1);
    
    if (error) {
      console.error('Erreur lors de la vérification du numéro de devis:', error);
      throw error;
    }
    
    return data.length === 0;
  } catch (error) {
    console.error('Exception lors de la vérification du numéro de devis:', error);
    throw error;
  }
};

/**
 * Récupère un projet spécifique et toutes ses données associées
 */
export const fetchProjectSaveById = async (projectId: string) => {
  try {
    // Récupérer les informations de base du projet
    const { data: projectData, error: projectError } = await supabase
      .from('projects_save')
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
    
    // Reconstruire l'état du projet à partir des données JSON stockées
    const projectState: ProjectState = projectData.project_data || {
      property: {
        type: projectData.property_type || 'Appartement',
        floors: projectData.floors || 1,
        totalArea: projectData.total_area || 0,
        rooms: projectData.rooms_count || 0,
        ceilingHeight: projectData.ceiling_height || 2.5
      },
      rooms: [],
      travaux: []
    };
    
    return {
      projectData,
      projectState,
      generalData: projectData.general_data || {}
    };
  } catch (error) {
    console.error('Exception lors de la récupération du projet:', error);
    throw error;
  }
};

/**
 * Crée un nouveau projet complet dans Supabase
 * Validation stricte: un client_id est obligatoire
 */
export const createProjectSave = async (projectState: ProjectState, projectInfo: any = {}) => {
  try {
    // Vérification stricte du client_id
    if (!projectInfo.client_id || projectInfo.client_id === null) {
      throw new Error('Un client doit être spécifié pour créer un projet');
    }
    
    // Créer un objet qui sera stocké dans la base de données
    const projectData = {
      name: projectInfo.name || generateDefaultProjectName(),
      client_id: projectInfo.client_id,
      project_data: projectState,
      general_data: projectInfo.general_data || {},
      description: projectInfo.description || '',
      address: projectInfo.address || '',
      postal_code: projectInfo.postal_code || '',
      city: projectInfo.city || '',
      occupant: projectInfo.occupant || '',
      property_type: projectState.property.type || 'Appartement',
      floors: projectState.property.floors || 1,
      total_area: projectState.property.totalArea || 52,
      rooms_count: projectState.rooms.length || 3,
      ceiling_height: projectState.property.ceilingHeight || 2.5,
      status: projectInfo.status || 'Brouillon',
      devis_number: projectInfo.devis_number || null
    };
    
    // Insérer le projet dans la base de données
    const { data, error } = await supabase
      .from('projects_save')
      .insert(projectData)
      .select()
      .single();
    
    if (error) {
      console.error('Erreur lors de la création du projet:', error);
      throw error;
    }
    
    return {
      id: data.id,
      name: data.name,
      devis_number: data.devis_number
    };
  } catch (error) {
    console.error('Exception lors de la création du projet:', error);
    throw error;
  }
};

/**
 * Met à jour un projet existant dans Supabase
 */
export const updateProjectSave = async (projectId: string, projectState: ProjectState, projectInfo: any = {}) => {
  try {
    // Vérification préalable du projet existant
    const { data: existingProject, error: fetchError } = await supabase
      .from('projects_save')
      .select('*')
      .eq('id', projectId)
      .single();
      
    if (fetchError) {
      console.error('Erreur lors de la récupération du projet existant:', fetchError);
      throw fetchError;
    }
    
    // Protection contre la mise à jour avec un client_id non valide
    if (projectInfo.client_id === null) {
      throw new Error('Le client ne peut pas être supprimé d\'un projet existant');
    }
    
    // Mettre à jour les champs du projet avec les nouvelles valeurs
    const updatedProjectData = {
      project_data: projectState,
      general_data: {...(existingProject?.general_data || {}), ...(projectInfo.general_data || {})},
      property_type: projectState.property.type || existingProject?.property_type,
      floors: projectState.property.floors || existingProject?.floors,
      total_area: projectState.property.totalArea || existingProject?.total_area,
      rooms_count: projectState.rooms.length || existingProject?.rooms_count,
      ceiling_height: projectState.property.ceilingHeight || existingProject?.ceiling_height,
    };
    
    // Ajouter les champs de projectInfo seulement s'ils sont définis
    if (projectInfo.name !== undefined) updatedProjectData['name'] = projectInfo.name;
    if (projectInfo.client_id !== undefined) updatedProjectData['client_id'] = projectInfo.client_id;
    if (projectInfo.description !== undefined) updatedProjectData['description'] = projectInfo.description;
    if (projectInfo.address !== undefined) updatedProjectData['address'] = projectInfo.address;
    if (projectInfo.postal_code !== undefined) updatedProjectData['postal_code'] = projectInfo.postal_code;
    if (projectInfo.city !== undefined) updatedProjectData['city'] = projectInfo.city;
    if (projectInfo.occupant !== undefined) updatedProjectData['occupant'] = projectInfo.occupant;
    if (projectInfo.status !== undefined) updatedProjectData['status'] = projectInfo.status;
    if (projectInfo.devis_number !== undefined) updatedProjectData['devis_number'] = projectInfo.devis_number;
    
    // Mettre à jour le projet dans la base de données
    const { data, error } = await supabase
      .from('projects_save')
      .update(updatedProjectData)
      .eq('id', projectId)
      .select()
      .single();
    
    if (error) {
      console.error('Erreur lors de la mise à jour du projet:', error);
      throw error;
    }
    
    return {
      id: data.id,
      name: data.name,
      devis_number: data.devis_number
    };
  } catch (error) {
    console.error('Exception lors de la mise à jour du projet:', error);
    throw error;
  }
};

/**
 * Supprime un projet existant
 */
export const deleteProjectSave = async (projectId: string) => {
  try {
    const { error } = await supabase
      .from('projects_save')
      .delete()
      .eq('id', projectId);
    
    if (error) {
      console.error('Erreur lors de la suppression du projet:', error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Exception lors de la suppression du projet:', error);
    throw error;
  }
};

// Réexporter le type pour utilisation externe
export type Project = ProjectSave;
