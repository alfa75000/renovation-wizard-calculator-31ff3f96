
import { supabase } from '@/lib/supabase';
import { MenuiserieType, SurfaceImpactee } from '@/types/supabase';

export const fetchMenuiserieTypes = async (): Promise<MenuiserieType[]> => {
  try {
    const { data, error } = await supabase
      .from('menuiseries_types')
      .select('*');
    
    if (error) {
      console.error("Erreur lors de la récupération des types de menuiseries:", error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error("Erreur lors de la récupération des types de menuiseries:", error);
    throw error;
  }
};

export const createMenuiserieType = async (menuiserieType: {
  name: string;
  largeur: number;
  hauteur: number;
  surface_impactee: SurfaceImpactee;
  impacte_plinthe: boolean;
}): Promise<MenuiserieType | null> => {
  try {
    const { data, error } = await supabase
      .from('menuiseries_types')
      .insert([menuiserieType])
      .select()
      .single();
    
    if (error) {
      console.error("Erreur lors de la création du type de menuiserie:", error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Erreur lors de la création du type de menuiserie:", error);
    throw error;
  }
};

export const updateMenuiserieType = async (
  id: string,
  updates: {
    name?: string;
    largeur?: number;
    hauteur?: number;
    surface_impactee?: SurfaceImpactee;
    impacte_plinthe?: boolean;
  }
): Promise<MenuiserieType | null> => {
  try {
    const { data, error } = await supabase
      .from('menuiseries_types')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error("Erreur lors de la mise à jour du type de menuiserie:", error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Erreur lors de la mise à jour du type de menuiserie:", error);
    throw error;
  }
};

export const deleteMenuiserieType = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('menuiseries_types')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Erreur lors de la suppression du type de menuiserie:", error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error("Erreur lors de la suppression du type de menuiserie:", error);
    return false;
  }
};

export const createRoomMenuiserie = async (roomMenuiserie: {
  room_id: string;
  menuiserie_type_id: string;
  quantity: number;
  width: number;
  height: number;
  surface_impactee: SurfaceImpactee;
  impacte_plinthe: boolean;
}) => {
  try {
    const { data, error } = await supabase
      .from('room_menuiseries')
      .insert([roomMenuiserie])
      .select()
      .single();
    
    if (error) {
      console.error("Erreur lors de la création de la menuiserie pour la pièce:", error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Erreur lors de la création de la menuiserie pour la pièce:", error);
    throw error;
  }
};

export const fetchRoomMenuiseries = async (roomId: string) => {
  try {
    const { data, error } = await supabase
      .from('room_menuiseries')
      .select(`
        *,
        menuiserie_type:menuiserie_type_id (*)
      `)
      .eq('room_id', roomId);
    
    if (error) {
      console.error("Erreur lors de la récupération des menuiseries de la pièce:", error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error("Erreur lors de la récupération des menuiseries de la pièce:", error);
    throw error;
  }
};
