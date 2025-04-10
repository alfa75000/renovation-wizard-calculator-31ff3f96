
import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { ProjectState, Property } from '@/types';

/**
 * Récupère tous les projets depuis Supabase
 */
export const fetchProjects = async () => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
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
 * Crée un nouveau projet dans Supabase (sans les pièces et travaux)
 */
export const createProjectBase = async (property: Property, projectInfo: any = {}) => {
  try {
    // Générer un nom par défaut si non fourni
    const projectName = projectInfo.name || generateDefaultProjectName();
    
    // Créer le projet
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .insert({
        name: projectName,
        client_id: projectInfo.clientId || null,
        description: projectInfo.description || '',
        address: projectInfo.address || '',
        postal_code: projectInfo.postalCode || '',
        city: projectInfo.city || '',
        occupant: projectInfo.occupant || '',
        property_type: property.type,
        floors: property.floors,
        total_area: property.totalArea,
        rooms_count: property.rooms,
        ceiling_height: property.ceilingHeight
      })
      .select()
      .single();
    
    if (projectError) {
      console.error('Erreur lors de la création du projet:', projectError);
      throw projectError;
    }
    
    if (!projectData) {
      throw new Error('Erreur: Aucune donnée retournée après la création du projet');
    }
    
    return projectData;
  } catch (error) {
    console.error('Exception lors de la création du projet:', error);
    throw error;
  }
};

/**
 * Met à jour les informations de base d'un projet
 */
export const updateProjectBase = async (projectId: string, property: Property, projectInfo: any = {}) => {
  try {
    // Mettre à jour le projet
    const { error: projectError } = await supabase
      .from('projects')
      .update({
        name: projectInfo.name,
        client_id: projectInfo.clientId || null,
        description: projectInfo.description || '',
        address: projectInfo.address || '',
        postal_code: projectInfo.postalCode || '',
        city: projectInfo.city || '',
        occupant: projectInfo.occupant || '',
        property_type: property.type,
        floors: property.floors,
        total_area: property.totalArea,
        rooms_count: property.rooms,
        ceiling_height: property.ceilingHeight,
        updated_at: new Date().toISOString()
      })
      .eq('id', projectId);
    
    if (projectError) {
      console.error('Erreur lors de la mise à jour du projet:', projectError);
      throw projectError;
    }
    
    return { id: projectId };
  } catch (error) {
    console.error('Exception lors de la mise à jour du projet:', error);
    throw error;
  }
};

/**
 * Supprime un projet et toutes ses données associées
 */
export const deleteProject = async (projectId: string) => {
  try {
    // Supprimer le projet (les contraintes de clé étrangère devraient supprimer les données associées)
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);
    
    if (error) {
      console.error('Erreur lors de la suppression du projet:', error);
      throw error;
    }
    
    return { success: true };
  } catch (error) {
    console.error('Exception lors de la suppression du projet:', error);
    throw error;
  }
};

/**
 * Génère un nom par défaut pour un nouveau projet
 */
export const generateDefaultProjectName = () => {
  const now = new Date();
  return `Projet sans nom - ${format(now, 'yyyy-MM-dd HH:mm')}`;
};

/**
 * Type pour l'objet Projet récupéré depuis Supabase
 */
export type Project = {
  id: string;
  name: string;
  client_id: string | null;
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
  created_at: string;
  updated_at: string;
};
