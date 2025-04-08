
import { supabase } from '@/lib/supabase';
import { MenuiserieType } from '@/types/supabase';
import { v4 as uuidv4 } from 'uuid';

// Récupérer tous les types de menuiseries
export const fetchMenuiserieTypes = async (): Promise<MenuiserieType[]> => {
  try {
    const { data, error } = await supabase
      .from('menuiseries_types')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.error('Erreur lors de la récupération des types de menuiseries:', error);
      throw new Error(`Erreur de chargement: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Exception lors de la récupération des types de menuiseries:', error);
    throw error;
  }
};

// Récupérer un type de menuiserie par son ID
export const fetchMenuiserieTypeById = async (id: string): Promise<MenuiserieType | null> => {
  try {
    const { data, error } = await supabase
      .from('menuiseries_types')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error(`Erreur lors de la récupération du type de menuiserie ${id}:`, error);
      throw new Error(`Erreur de chargement: ${error.message}`);
    }

    return data || null;
  } catch (error) {
    console.error(`Exception lors de la récupération du type de menuiserie ${id}:`, error);
    throw error;
  }
};

// Créer un nouveau type de menuiserie
export const createMenuiserieType = async (menuiserie: Omit<MenuiserieType, 'id'>): Promise<MenuiserieType> => {
  try {
    // Générer un nouvel ID si non fourni
    const newMenuiserie = {
      ...menuiserie,
      id: uuidv4(),
    };

    const { data, error } = await supabase
      .from('menuiseries_types')
      .insert([newMenuiserie])
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de la création du type de menuiserie:', error);
      throw new Error(`Erreur de création: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Exception lors de la création du type de menuiserie:', error);
    throw error;
  }
};

// Mettre à jour un type de menuiserie existant
export const updateMenuiserieType = async (id: string, menuiserie: Partial<MenuiserieType>): Promise<MenuiserieType> => {
  try {
    const { data, error } = await supabase
      .from('menuiseries_types')
      .update(menuiserie)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Erreur lors de la mise à jour du type de menuiserie ${id}:`, error);
      throw new Error(`Erreur de mise à jour: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error(`Exception lors de la mise à jour du type de menuiserie ${id}:`, error);
    throw error;
  }
};

// Supprimer un type de menuiserie
export const deleteMenuiserieType = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('menuiseries_types')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Erreur lors de la suppression du type de menuiserie ${id}:`, error);
      throw new Error(`Erreur de suppression: ${error.message}`);
    }
  } catch (error) {
    console.error(`Exception lors de la suppression du type de menuiserie ${id}:`, error);
    throw error;
  }
};

// Associer une menuiserie à une pièce
export const createRoomMenuiserie = async (
  roomId: string, 
  menuiserieTypeId: string, 
  quantity: number
): Promise<any> => {
  try {
    const newRoomMenuiserie = {
      id: uuidv4(),
      room_id: roomId,
      menuiserie_type_id: menuiserieTypeId,
      quantity
    };

    const { data, error } = await supabase
      .from('room_menuiseries')
      .insert([newRoomMenuiserie])
      .select()
      .single();

    if (error) {
      console.error('Erreur lors de l\'association menuiserie-pièce:', error);
      throw new Error(`Erreur d'association: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Exception lors de l\'association menuiserie-pièce:', error);
    throw error;
  }
};

// Récupérer les menuiseries d'une pièce
export const fetchRoomMenuiseries = async (roomId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('room_menuiseries')
      .select(`
        *,
        menuiserie_type:menuiserie_type_id(*)
      `)
      .eq('room_id', roomId);

    if (error) {
      console.error(`Erreur lors de la récupération des menuiseries de la pièce ${roomId}:`, error);
      throw new Error(`Erreur de chargement: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error(`Exception lors de la récupération des menuiseries de la pièce ${roomId}:`, error);
    throw error;
  }
};

// Mettre à jour une menuiserie de pièce
export const updateRoomMenuiserie = async (id: string, updates: { quantity?: number }): Promise<any> => {
  try {
    const { data, error } = await supabase
      .from('room_menuiseries')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error(`Erreur lors de la mise à jour de l'association menuiserie-pièce ${id}:`, error);
      throw new Error(`Erreur de mise à jour: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error(`Exception lors de la mise à jour de l'association menuiserie-pièce ${id}:`, error);
    throw error;
  }
};

// Supprimer une menuiserie de pièce
export const deleteRoomMenuiserie = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('room_menuiseries')
      .delete()
      .eq('id', id);

    if (error) {
      console.error(`Erreur lors de la suppression de l'association menuiserie-pièce ${id}:`, error);
      throw new Error(`Erreur de suppression: ${error.message}`);
    }
  } catch (error) {
    console.error(`Exception lors de la suppression de l'association menuiserie-pièce ${id}:`, error);
    throw error;
  }
};
