
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

// Récupérer un type de menuiserie par son ID
export const fetchMenuiserieTypeById = async (id: string): Promise<MenuiserieType | null> => {
  try {
    const { data, error } = await supabase
      .from('menuiseries_types')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Erreur lors de la récupération du type de menuiserie:', error);
      toast.error('Erreur lors de la récupération du type de menuiserie');
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Exception lors de la récupération du type de menuiserie:', error);
    toast.error('Erreur lors de la récupération du type de menuiserie');
    return null;
  }
};

// Créer un nouveau type de menuiserie
export const createMenuiserieType = async (menuiserieType: Omit<MenuiserieType, 'id' | 'created_at'>): Promise<MenuiserieType | null> => {
  try {
    const { data, error } = await supabase
      .from('menuiseries_types')
      .insert([menuiserieType])
      .select()
      .single();
    
    if (error) {
      console.error('Erreur lors de la création du type de menuiserie:', error);
      toast.error('Erreur lors de la création du type de menuiserie');
      return null;
    }
    
    toast.success('Type de menuiserie créé avec succès');
    return data;
  } catch (error) {
    console.error('Exception lors de la création du type de menuiserie:', error);
    toast.error('Erreur lors de la création du type de menuiserie');
    return null;
  }
};

// Mettre à jour un type de menuiserie
export const updateMenuiserieType = async (id: string, menuiserieType: Partial<Omit<MenuiserieType, 'id' | 'created_at'>>): Promise<MenuiserieType | null> => {
  try {
    const { data, error } = await supabase
      .from('menuiseries_types')
      .update(menuiserieType)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error('Erreur lors de la mise à jour du type de menuiserie:', error);
      toast.error('Erreur lors de la mise à jour du type de menuiserie');
      return null;
    }
    
    toast.success('Type de menuiserie mis à jour avec succès');
    return data;
  } catch (error) {
    console.error('Exception lors de la mise à jour du type de menuiserie:', error);
    toast.error('Erreur lors de la mise à jour du type de menuiserie');
    return null;
  }
};

// Supprimer un type de menuiserie
export const deleteMenuiserieType = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('menuiseries_types')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Erreur lors de la suppression du type de menuiserie:', error);
      toast.error('Erreur lors de la suppression du type de menuiserie');
      return false;
    }
    
    toast.success('Type de menuiserie supprimé avec succès');
    return true;
  } catch (error) {
    console.error('Exception lors de la suppression du type de menuiserie:', error);
    toast.error('Erreur lors de la suppression du type de menuiserie');
    return false;
  }
};
