
import { supabase } from '@/lib/supabase';
import { Menuiserie } from '@/types';

// Créer une menuiserie pour une pièce dans Supabase
export const createRoomMenuiserie = async (
  roomId: string,
  menuiserie: Menuiserie
): Promise<{ success: boolean; error?: any; data?: any }> => {
  try {
    const { data, error } = await supabase
      .from('room_menuiseries')
      .insert({
        room_id: roomId,
        menuiserie_id: menuiserie.id,
        type: menuiserie.type,
        name: menuiserie.name,
        largeur: menuiserie.largeur,
        hauteur: menuiserie.hauteur,
        quantity: menuiserie.quantity,
        surface: menuiserie.surface,
        surface_impactee: menuiserie.surfaceImpactee,
        impacte_plinthe: menuiserie.impactePlinthe || false
      })
      .select();

    return {
      success: !error,
      error,
      data
    };
  } catch (error) {
    console.error('Erreur lors de la création de la menuiserie:', error);
    return {
      success: false,
      error
    };
  }
};

// Mettre à jour une menuiserie de pièce dans Supabase
export const updateRoomMenuiserie = async (
  roomId: string,
  menuiserieId: string, 
  menuiserie: Partial<Menuiserie>
): Promise<{ success: boolean; error?: any; data?: any }> => {
  try {
    const { data, error } = await supabase
      .from('room_menuiseries')
      .update({
        type: menuiserie.type,
        name: menuiserie.name,
        largeur: menuiserie.largeur,
        hauteur: menuiserie.hauteur,
        quantity: menuiserie.quantity,
        surface: menuiserie.surface,
        surface_impactee: menuiserie.surfaceImpactee,
        impacte_plinthe: menuiserie.impactePlinthe || false
      })
      .eq('room_id', roomId)
      .eq('menuiserie_id', menuiserieId)
      .select();

    return {
      success: !error,
      error,
      data
    };
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la menuiserie:', error);
    return {
      success: false,
      error
    };
  }
};

// Supprimer une menuiserie de pièce dans Supabase
export const deleteRoomMenuiserie = async (
  roomId: string,
  menuiserieId: string
): Promise<{ success: boolean; error?: any }> => {
  try {
    const { error } = await supabase
      .from('room_menuiseries')
      .delete()
      .eq('room_id', roomId)
      .eq('menuiserie_id', menuiserieId);

    return {
      success: !error,
      error
    };
  } catch (error) {
    console.error('Erreur lors de la suppression de la menuiserie:', error);
    return {
      success: false,
      error
    };
  }
};
