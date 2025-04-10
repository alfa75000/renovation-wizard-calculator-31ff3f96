
import { supabase } from '@/lib/supabase';
import { Menuiserie, AutreSurface } from '@/types';

/**
 * Récupère toutes les menuiseries d'une pièce
 */
export const fetchMenuiseriesByRoomId = async (roomId: string) => {
  try {
    const { data, error } = await supabase
      .from('room_menuiseries')
      .select('*, menuiserie_type:menuiserie_type_id(*)')
      .eq('room_id', roomId);
    
    if (error) {
      console.error('Erreur lors de la récupération des menuiseries:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Exception lors de la récupération des menuiseries:', error);
    throw error;
  }
};

/**
 * Récupère toutes les surfaces personnalisées d'une pièce
 */
export const fetchCustomSurfacesByRoomId = async (roomId: string) => {
  try {
    const { data, error } = await supabase
      .from('room_custom_surfaces')
      .select('*')
      .eq('room_id', roomId);
    
    if (error) {
      console.error('Erreur lors de la récupération des surfaces personnalisées:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Exception lors de la récupération des surfaces personnalisées:', error);
    throw error;
  }
};

/**
 * Crée une nouvelle menuiserie pour une pièce
 */
export const createMenuiserie = async (roomId: string, menuiserie: Menuiserie) => {
  try {
    const { data, error } = await supabase
      .from('room_menuiseries')
      .insert({
        room_id: roomId,
        menuiserie_type_id: null, // À adapter selon la structure réelle
        type: menuiserie.type,
        name: menuiserie.name,
        largeur: menuiserie.largeur,
        hauteur: menuiserie.hauteur,
        quantity: menuiserie.quantity,
        surface: menuiserie.surface,
        surface_impactee: menuiserie.surfaceImpactee
      })
      .select()
      .single();
    
    if (error) {
      console.error('Erreur lors de la création de la menuiserie:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Exception lors de la création de la menuiserie:', error);
    throw error;
  }
};

/**
 * Met à jour une menuiserie existante
 */
export const updateMenuiserie = async (menuiserieId: string, menuiserie: Menuiserie) => {
  try {
    const { error } = await supabase
      .from('room_menuiseries')
      .update({
        type: menuiserie.type,
        name: menuiserie.name,
        largeur: menuiserie.largeur,
        hauteur: menuiserie.hauteur,
        quantity: menuiserie.quantity,
        surface: menuiserie.surface,
        surface_impactee: menuiserie.surfaceImpactee
      })
      .eq('id', menuiserieId);
    
    if (error) {
      console.error('Erreur lors de la mise à jour de la menuiserie:', error);
      throw error;
    }
    
    return { id: menuiserieId };
  } catch (error) {
    console.error('Exception lors de la mise à jour de la menuiserie:', error);
    throw error;
  }
};

/**
 * Crée une nouvelle surface personnalisée pour une pièce
 */
export const createCustomSurface = async (roomId: string, surface: AutreSurface) => {
  try {
    const { data, error } = await supabase
      .from('room_custom_surfaces')
      .insert({
        room_id: roomId,
        type: surface.type,
        name: surface.name,
        designation: surface.designation,
        largeur: surface.largeur,
        hauteur: surface.hauteur,
        surface: surface.surface,
        quantity: surface.quantity,
        surface_impactee: surface.surfaceImpactee,
        est_deduction: surface.estDeduction
      })
      .select()
      .single();
    
    if (error) {
      console.error('Erreur lors de la création de la surface personnalisée:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Exception lors de la création de la surface personnalisée:', error);
    throw error;
  }
};

/**
 * Met à jour une surface personnalisée existante
 */
export const updateCustomSurface = async (surfaceId: string, surface: AutreSurface) => {
  try {
    const { error } = await supabase
      .from('room_custom_surfaces')
      .update({
        type: surface.type,
        name: surface.name,
        designation: surface.designation,
        largeur: surface.largeur,
        hauteur: surface.hauteur,
        surface: surface.surface,
        quantity: surface.quantity,
        surface_impactee: surface.surfaceImpactee,
        est_deduction: surface.estDeduction
      })
      .eq('id', surfaceId);
    
    if (error) {
      console.error('Erreur lors de la mise à jour de la surface personnalisée:', error);
      throw error;
    }
    
    return { id: surfaceId };
  } catch (error) {
    console.error('Exception lors de la mise à jour de la surface personnalisée:', error);
    throw error;
  }
};

/**
 * Synchronise les menuiseries d'une pièce
 */
export const syncMenuiseriesForRoom = async (roomId: string, menuiseries: Menuiserie[]) => {
  try {
    // Récupérer les menuiseries existantes
    const { data: existingMenuiseries, error: menuiseriesError } = await supabase
      .from('room_menuiseries')
      .select('id')
      .eq('room_id', roomId);
    
    if (menuiseriesError) {
      console.error('Erreur lors de la récupération des menuiseries existantes:', menuiseriesError);
      throw menuiseriesError;
    }
    
    const existingMenuiserieIds = (existingMenuiseries || []).map(m => m.id);
    const newMenuiserieIds = menuiseries.map(m => m.id);
    
    // Supprimer les menuiseries qui n'existent plus
    const menuiseriesToDelete = existingMenuiserieIds.filter(id => !newMenuiserieIds.includes(id));
    if (menuiseriesToDelete.length > 0) {
      const { error: deleteMenuiseriesError } = await supabase
        .from('room_menuiseries')
        .delete()
        .in('id', menuiseriesToDelete);
      
      if (deleteMenuiseriesError) {
        console.error('Erreur lors de la suppression des menuiseries:', deleteMenuiseriesError);
        throw deleteMenuiseriesError;
      }
    }
    
    // Mettre à jour ou créer les menuiseries
    for (const menuiserie of menuiseries) {
      if (existingMenuiserieIds.includes(menuiserie.id)) {
        await updateMenuiserie(menuiserie.id, menuiserie);
      } else {
        await createMenuiserie(roomId, menuiserie);
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error('Exception lors de la synchronisation des menuiseries:', error);
    throw error;
  }
};

/**
 * Synchronise les surfaces personnalisées d'une pièce
 */
export const syncCustomSurfacesForRoom = async (roomId: string, surfaces: AutreSurface[]) => {
  try {
    // Récupérer les surfaces existantes
    const { data: existingSurfaces, error: surfacesError } = await supabase
      .from('room_custom_surfaces')
      .select('id')
      .eq('room_id', roomId);
    
    if (surfacesError) {
      console.error('Erreur lors de la récupération des surfaces existantes:', surfacesError);
      throw surfacesError;
    }
    
    const existingSurfaceIds = (existingSurfaces || []).map(s => s.id);
    const newSurfaceIds = surfaces.map(s => s.id);
    
    // Supprimer les surfaces qui n'existent plus
    const surfacesToDelete = existingSurfaceIds.filter(id => !newSurfaceIds.includes(id));
    if (surfacesToDelete.length > 0) {
      const { error: deleteSurfacesError } = await supabase
        .from('room_custom_surfaces')
        .delete()
        .in('id', surfacesToDelete);
      
      if (deleteSurfacesError) {
        console.error('Erreur lors de la suppression des surfaces:', deleteSurfacesError);
        throw deleteSurfacesError;
      }
    }
    
    // Mettre à jour ou créer les surfaces
    for (const surface of surfaces) {
      if (existingSurfaceIds.includes(surface.id)) {
        await updateCustomSurface(surface.id, surface);
      } else {
        await createCustomSurface(roomId, surface);
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error('Exception lors de la synchronisation des surfaces personnalisées:', error);
    throw error;
  }
};
