
import { supabase } from '@/lib/supabase';
import { MenuiserieType } from '@/types/supabase';
import { toast } from 'sonner';

// Récupérer tous les types de menuiseries
export const fetchMenuiserieTypes = async (): Promise<MenuiserieType[]> => {
  try {
    console.log("Récupération des types de menuiseries");
    
    const { data, error } = await supabase
      .from('menuiseries_types')
      .select('*')
      .order('name', { ascending: true });
    
    console.log("Résultat de la requête menuiseries_types:", { 
      data, 
      error, 
      dataLength: data?.length || 0
    });
    
    if (error) {
      console.error('Erreur lors de la récupération des types de menuiseries:', error);
      toast.error('Erreur lors de la récupération des types de menuiseries');
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Exception lors de la récupération des types de menuiseries:', error);
    toast.error('Erreur lors de la récupération des types de menuiseries');
    return [];
  }
};

// Créer une menuiserie pour une pièce
export const createRoomMenuiserie = async (roomMenuiserie: {
  room_id: string;
  menuiserie_type_id: string;
  quantity: number;
  largeur?: number;
  hauteur?: number;
  surface_impactee?: string;
}) => {
  try {
    console.log("Création d'une menuiserie pour une pièce:", roomMenuiserie);
    
    const { data, error } = await supabase
      .from('room_menuiseries')
      .insert(roomMenuiserie)
      .select()
      .single();
    
    if (error) {
      console.error('Erreur lors de la création de la menuiserie pour la pièce:', error);
      toast.error('Erreur lors de l\'ajout de la menuiserie');
      return null;
    }
    
    toast.success('Menuiserie ajoutée avec succès');
    return data;
  } catch (error) {
    console.error('Exception lors de la création de la menuiserie pour la pièce:', error);
    toast.error('Erreur lors de l\'ajout de la menuiserie');
    return null;
  }
};

// Récupérer les menuiseries d'une pièce
export const fetchRoomMenuiseries = async (roomId: string) => {
  try {
    console.log("Récupération des menuiseries de la pièce:", roomId);
    
    const { data, error } = await supabase
      .from('room_menuiseries')
      .select(`
        *,
        menuiserie_type:menuiserie_type_id(*)
      `)
      .eq('room_id', roomId);
    
    if (error) {
      console.error('Erreur lors de la récupération des menuiseries de la pièce:', error);
      toast.error('Erreur lors de la récupération des menuiseries');
      return [];
    }
    
    return data || [];
  } catch (error) {
    console.error('Exception lors de la récupération des menuiseries de la pièce:', error);
    toast.error('Erreur lors de la récupération des menuiseries');
    return [];
  }
};

// Supprimer une menuiserie d'une pièce
export const deleteRoomMenuiserie = async (menuiserieId: string) => {
  try {
    console.log("Suppression de la menuiserie:", menuiserieId);
    
    const { error } = await supabase
      .from('room_menuiseries')
      .delete()
      .eq('id', menuiserieId);
    
    if (error) {
      console.error('Erreur lors de la suppression de la menuiserie:', error);
      toast.error('Erreur lors de la suppression de la menuiserie');
      return false;
    }
    
    toast.success('Menuiserie supprimée avec succès');
    return true;
  } catch (error) {
    console.error('Exception lors de la suppression de la menuiserie:', error);
    toast.error('Erreur lors de la suppression de la menuiserie');
    return false;
  }
};

// Mise à jour d'une menuiserie d'une pièce
export const updateRoomMenuiserie = async (
  menuiserieId: string, 
  updates: {
    quantity?: number;
    largeur?: number;
    hauteur?: number;
    surface_impactee?: string;
  }
) => {
  try {
    console.log("Mise à jour de la menuiserie:", { menuiserieId, updates });
    
    const { data, error } = await supabase
      .from('room_menuiseries')
      .update(updates)
      .eq('id', menuiserieId)
      .select()
      .single();
    
    if (error) {
      console.error('Erreur lors de la mise à jour de la menuiserie:', error);
      toast.error('Erreur lors de la mise à jour de la menuiserie');
      return null;
    }
    
    toast.success('Menuiserie mise à jour avec succès');
    return data;
  } catch (error) {
    console.error('Exception lors de la mise à jour de la menuiserie:', error);
    toast.error('Erreur lors de la mise à jour de la menuiserie');
    return null;
  }
};
