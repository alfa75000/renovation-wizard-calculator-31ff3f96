
import { supabase } from '@/lib/supabase';
import { Travail } from '@/types';

/**
 * Récupère tous les travaux liés à une pièce
 */
export const fetchWorksByRoomId = async (roomId: string) => {
  try {
    const { data, error } = await supabase
      .from('room_works')
      .select('*')
      .eq('room_id', roomId);
    
    if (error) {
      console.error('Erreur lors de la récupération des travaux:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Exception lors de la récupération des travaux:', error);
    throw error;
  }
};

/**
 * Crée un nouveau travail pour une pièce
 */
export const createWork = async (travail: Travail) => {
  try {
    const { data, error } = await supabase
      .from('room_works')
      .insert({
        room_id: travail.pieceId,
        type_travaux_id: travail.typeTravauxId,
        type_travaux_label: travail.typeTravauxLabel,
        sous_type_id: travail.sousTypeId,
        sous_type_label: travail.sousTypeLabel,
        menuiserie_id: travail.menuiserieId || null,
        description: travail.description,
        quantite: travail.quantite,
        unite: travail.unite,
        prix_fournitures: travail.prixFournitures,
        prix_main_oeuvre: travail.prixMainOeuvre,
        taux_tva: travail.tauxTVA,
        commentaire: travail.commentaire || '',
        personnalisation: travail.personnalisation || '',
        type_travaux: travail.typeTravaux || '',
        sous_type: travail.sousType || '',
        surface_impactee: travail.surfaceImpactee || ''
      })
      .select()
      .single();
    
    if (error) {
      console.error('Erreur lors de la création du travail:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Exception lors de la création du travail:', error);
    throw error;
  }
};

/**
 * Met à jour un travail existant
 */
export const updateWork = async (travailId: string, travail: Travail) => {
  try {
    const { error } = await supabase
      .from('room_works')
      .update({
        type_travaux_id: travail.typeTravauxId,
        type_travaux_label: travail.typeTravauxLabel,
        sous_type_id: travail.sousTypeId,
        sous_type_label: travail.sousTypeLabel,
        menuiserie_id: travail.menuiserieId || null,
        description: travail.description,
        quantite: travail.quantite,
        unite: travail.unite,
        prix_fournitures: travail.prixFournitures,
        prix_main_oeuvre: travail.prixMainOeuvre,
        taux_tva: travail.tauxTVA,
        commentaire: travail.commentaire || '',
        personnalisation: travail.personnalisation || '',
        type_travaux: travail.typeTravaux || '',
        sous_type: travail.sousType || '',
        surface_impactee: travail.surfaceImpactee || ''
      })
      .eq('id', travailId);
    
    if (error) {
      console.error('Erreur lors de la mise à jour du travail:', error);
      throw error;
    }
    
    return { id: travailId };
  } catch (error) {
    console.error('Exception lors de la mise à jour du travail:', error);
    throw error;
  }
};

/**
 * Supprime un travail
 */
export const deleteWork = async (travailId: string) => {
  try {
    const { error } = await supabase
      .from('room_works')
      .delete()
      .eq('id', travailId);
    
    if (error) {
      console.error('Erreur lors de la suppression du travail:', error);
      throw error;
    }
    
    return { success: true };
  } catch (error) {
    console.error('Exception lors de la suppression du travail:', error);
    throw error;
  }
};

/**
 * Récupère tous les travaux d'un projet en fonction des IDs de pièces
 */
export const fetchWorksByRoomIds = async (roomIds: string[]) => {
  if (roomIds.length === 0) {
    return [];
  }
  
  try {
    const { data, error } = await supabase
      .from('room_works')
      .select('*')
      .in('room_id', roomIds);
    
    if (error) {
      console.error('Erreur lors de la récupération des travaux:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Exception lors de la récupération des travaux:', error);
    throw error;
  }
};

/**
 * Synchronise tous les travaux d'un projet
 */
export const syncWorksForProject = async (projectRoomIds: string[], travaux: Travail[]) => {
  try {
    if (projectRoomIds.length === 0) {
      return { success: true };
    }
    
    // Récupérer tous les travaux existants du projet
    const { data: existingWorks, error: worksError } = await supabase
      .from('room_works')
      .select('id')
      .in('room_id', projectRoomIds);
    
    if (worksError) {
      console.error('Erreur lors de la récupération des travaux existants:', worksError);
      throw worksError;
    }
    
    const existingWorkIds = (existingWorks || []).map(work => work.id);
    const newWorkIds = travaux.map(travail => travail.id);
    
    // Supprimer les travaux qui n'existent plus
    const worksToDelete = existingWorkIds.filter(id => !newWorkIds.includes(id));
    if (worksToDelete.length > 0) {
      const { error: deleteWorksError } = await supabase
        .from('room_works')
        .delete()
        .in('id', worksToDelete);
      
      if (deleteWorksError) {
        console.error('Erreur lors de la suppression des travaux:', deleteWorksError);
        throw deleteWorksError;
      }
    }
    
    // Mettre à jour ou créer les travaux
    for (const travail of travaux) {
      if (existingWorkIds.includes(travail.id)) {
        await updateWork(travail.id, travail);
      } else {
        await createWork(travail);
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error('Exception lors de la synchronisation des travaux:', error);
    throw error;
  }
};
