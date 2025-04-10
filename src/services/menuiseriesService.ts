
import { supabase } from '@/integrations/supabase/client';
import { TypeMenuiserie, Menuiserie } from '@/types';
import { MenuiserieType, SurfaceImpactee } from '@/types/supabase';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

// Fonction de conversion entre "mur" et "Mur" pour le type surface_impactee
const convertToSupabaseSurfaceImpactee = (value: string): SurfaceImpactee => {
  if (value.toLowerCase() === 'mur') return 'Mur';
  if (value.toLowerCase() === 'plafond') return 'Plafond';
  if (value.toLowerCase() === 'sol') return 'Sol';
  return 'Aucune';
};

// Récupérer tous les types de menuiseries
export const getTypesMenuiseries = async (): Promise<TypeMenuiserie[]> => {
  try {
    console.log('Récupération des types de menuiseries');
    
    const { data, error } = await supabase
      .from('menuiseries_types')
      .select('*');
    
    if (error) {
      console.error('Erreur lors de la récupération des types de menuiseries:', error);
      throw error;
    }
    
    console.log('Résultat de la requête menuiseries_types:', { data, error });
    
    // Convertir les données Supabase vers notre modèle local
    const typesMenuiseries: TypeMenuiserie[] = (data || []).map(item => ({
      id: item.id,
      nom: item.name,
      description: item.description || '',
      hauteur: item.hauteur,
      largeur: item.largeur,
      surfaceReference: item.surface_impactee.toLowerCase(),
      impactePlinthe: item.impacte_plinthe || false
    }));
    
    return typesMenuiseries;
  } catch (error) {
    console.error('Exception lors de la récupération des types de menuiseries:', error);
    throw error;
  }
};

// Récupérer un type de menuiserie par son ID
export const getTypeMenuiserieById = async (id: string): Promise<TypeMenuiserie | null> => {
  try {
    const { data, error } = await supabase
      .from('menuiseries_types')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`Erreur lors de la récupération du type de menuiserie ${id}:`, error);
      return null;
    }
    
    if (!data) return null;
    
    return {
      id: data.id,
      nom: data.name,
      description: data.description || '',
      hauteur: data.hauteur,
      largeur: data.largeur,
      surfaceReference: data.surface_impactee.toLowerCase(),
      impactePlinthe: data.impacte_plinthe || false
    };
  } catch (error) {
    console.error(`Exception lors de la récupération du type de menuiserie ${id}:`, error);
    return null;
  }
};

// Ajouter un type de menuiserie
export const addTypeMenuiserie = async (type: Omit<TypeMenuiserie, 'id'>): Promise<TypeMenuiserie | null> => {
  try {
    // Convertir notre modèle local vers le format Supabase
    const supabaseData = {
      name: type.nom,
      hauteur: type.hauteur,
      largeur: type.largeur,
      surface_impactee: convertToSupabaseSurfaceImpactee(type.surfaceReference),
      impacte_plinthe: type.impactePlinthe,
      description: type.description || null
    };
    
    const { data, error } = await supabase
      .from('menuiseries_types')
      .insert(supabaseData)
      .select()
      .single();
    
    if (error) {
      console.error('Erreur lors de l\'ajout du type de menuiserie:', error);
      toast.error('Erreur lors de l\'ajout du type de menuiserie');
      return null;
    }
    
    // Convertir le résultat Supabase vers notre modèle local
    return {
      id: data.id,
      nom: data.name,
      description: data.description || '',
      hauteur: data.hauteur,
      largeur: data.largeur,
      surfaceReference: data.surface_impactee.toLowerCase(),
      impactePlinthe: data.impacte_plinthe || false
    };
  } catch (error) {
    console.error('Exception lors de l\'ajout du type de menuiserie:', error);
    toast.error('Erreur lors de l\'ajout du type de menuiserie');
    return null;
  }
};

// Mettre à jour un type de menuiserie
export const updateTypeMenuiserie = async (id: string, changes: Partial<Omit<TypeMenuiserie, 'id'>>): Promise<TypeMenuiserie | null> => {
  try {
    // Convertir notre modèle local vers le format Supabase
    const supabaseData: any = {};
    
    if (changes.nom !== undefined) supabaseData.name = changes.nom;
    if (changes.hauteur !== undefined) supabaseData.hauteur = changes.hauteur;
    if (changes.largeur !== undefined) supabaseData.largeur = changes.largeur;
    if (changes.surfaceReference !== undefined) supabaseData.surface_impactee = convertToSupabaseSurfaceImpactee(changes.surfaceReference);
    if (changes.impactePlinthe !== undefined) supabaseData.impacte_plinthe = changes.impactePlinthe;
    if (changes.description !== undefined) supabaseData.description = changes.description || null;
    
    const { data, error } = await supabase
      .from('menuiseries_types')
      .update(supabaseData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`Erreur lors de la mise à jour du type de menuiserie ${id}:`, error);
      toast.error('Erreur lors de la mise à jour du type de menuiserie');
      return null;
    }
    
    // Convertir le résultat Supabase vers notre modèle local
    return {
      id: data.id,
      nom: data.name,
      description: data.description || '',
      hauteur: data.hauteur,
      largeur: data.largeur,
      surfaceReference: data.surface_impactee.toLowerCase(),
      impactePlinthe: data.impacte_plinthe || false
    };
  } catch (error) {
    console.error(`Exception lors de la mise à jour du type de menuiserie ${id}:`, error);
    toast.error('Erreur lors de la mise à jour du type de menuiserie');
    return null;
  }
};

// Supprimer un type de menuiserie
export const deleteTypeMenuiserie = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('menuiseries_types')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Erreur lors de la suppression du type de menuiserie ${id}:`, error);
      toast.error('Erreur lors de la suppression du type de menuiserie');
      return false;
    }
    
    toast.success('Type de menuiserie supprimé avec succès');
    return true;
  } catch (error) {
    console.error(`Exception lors de la suppression du type de menuiserie ${id}:`, error);
    toast.error('Erreur lors de la suppression du type de menuiserie');
    return false;
  }
};

// Récupérer les menuiseries pour une pièce
export const getMenuiseriesForRoom = async (roomId: string): Promise<Menuiserie[]> => {
  try {
    const { data, error } = await supabase
      .from('room_menuiseries')
      .select('*, menuiserie_type:menuiserie_type_id(*)')
      .eq('room_id', roomId);
    
    if (error) {
      console.error(`Erreur lors de la récupération des menuiseries pour la pièce ${roomId}:`, error);
      return [];
    }
    
    // Convertir les données Supabase vers notre modèle local
    const menuiseries: Menuiserie[] = (data || []).map(item => {
      const menuiserie_type = item.menuiserie_type as MenuiserieType;
      return {
        id: item.id,
        type: menuiserie_type ? menuiserie_type.name : 'Inconnu',
        name: menuiserie_type ? menuiserie_type.name : 'Inconnu',
        largeur: item.width_override || (menuiserie_type ? menuiserie_type.largeur : 0),
        hauteur: item.height_override || (menuiserie_type ? menuiserie_type.hauteur : 0),
        quantity: item.quantity || 1,
        surface: ((item.width_override || (menuiserie_type ? menuiserie_type.largeur : 0)) * 
                 (item.height_override || (menuiserie_type ? menuiserie_type.hauteur : 0))) / 10000,
        surfaceImpactee: (menuiserie_type ? menuiserie_type.surface_impactee : 'Mur').toLowerCase() as "mur" | "plafond" | "sol",
        impactePlinthe: menuiserie_type ? menuiserie_type.impacte_plinthe : false
      };
    });
    
    return menuiseries;
  } catch (error) {
    console.error(`Exception lors de la récupération des menuiseries pour la pièce ${roomId}:`, error);
    return [];
  }
};

// Ajouter une menuiserie à une pièce
export const addMenuiserieToRoom = async (roomId: string, typeId: string, quantity: number = 1, overrides?: { largeur?: number, hauteur?: number }): Promise<Menuiserie | null> => {
  try {
    // D'abord, récupérer les informations sur le type de menuiserie
    const { data: typeData, error: typeError } = await supabase
      .from('menuiseries_types')
      .select('*')
      .eq('id', typeId)
      .single();
    
    if (typeError || !typeData) {
      console.error(`Erreur lors de la récupération du type de menuiserie ${typeId}:`, typeError);
      return null;
    }
    
    // Créer l'entrée dans room_menuiseries
    const { data, error } = await supabase
      .from('room_menuiseries')
      .insert({
        room_id: roomId,
        menuiserie_type_id: typeId,
        quantity: quantity,
        width_override: overrides?.largeur || null,
        height_override: overrides?.hauteur || null,
        updated_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (error) {
      console.error('Erreur lors de l\'ajout de la menuiserie:', error);
      return null;
    }
    
    // Convertir le résultat en notre modèle local
    return {
      id: data.id,
      type: typeData.name,
      name: typeData.name,
      largeur: overrides?.largeur || typeData.largeur,
      hauteur: overrides?.hauteur || typeData.hauteur,
      quantity: data.quantity,
      surface: ((overrides?.largeur || typeData.largeur) * (overrides?.hauteur || typeData.hauteur)) / 10000,
      surfaceImpactee: typeData.surface_impactee.toLowerCase() as "mur" | "plafond" | "sol",
      impactePlinthe: typeData.impacte_plinthe
    };
  } catch (error) {
    console.error('Exception lors de l\'ajout de la menuiserie:', error);
    return null;
  }
};

// Mettre à jour une menuiserie
export const updateMenuiserie = async (id: string, changes: Partial<Omit<Menuiserie, 'id'>>): Promise<Menuiserie | null> => {
  try {
    // Récupérer d'abord les données actuelles
    const { data: currentData, error: getError } = await supabase
      .from('room_menuiseries')
      .select('*, menuiserie_type:menuiserie_type_id(*)')
      .eq('id', id)
      .single();
    
    if (getError || !currentData) {
      console.error(`Erreur lors de la récupération de la menuiserie ${id}:`, getError);
      return null;
    }
    
    const menuiserie_type = currentData.menuiserie_type as MenuiserieType;
    
    // Préparer les données à mettre à jour
    const updates: any = {};
    
    if (changes.quantity !== undefined) updates.quantity = changes.quantity;
    if (changes.largeur !== undefined) updates.width_override = changes.largeur;
    if (changes.hauteur !== undefined) updates.height_override = changes.hauteur;
    updates.updated_at = new Date().toISOString();
    
    // Effectuer la mise à jour
    const { data, error } = await supabase
      .from('room_menuiseries')
      .update(updates)
      .eq('id', id)
      .select('*, menuiserie_type:menuiserie_type_id(*)')
      .single();
    
    if (error) {
      console.error(`Erreur lors de la mise à jour de la menuiserie ${id}:`, error);
      return null;
    }
    
    const updated_menuiserie_type = data.menuiserie_type as MenuiserieType;
    
    // Convertir le résultat en notre modèle local
    return {
      id: data.id,
      type: updated_menuiserie_type ? updated_menuiserie_type.name : 'Inconnu',
      name: updated_menuiserie_type ? updated_menuiserie_type.name : 'Inconnu',
      largeur: data.width_override || (updated_menuiserie_type ? updated_menuiserie_type.largeur : 0),
      hauteur: data.height_override || (updated_menuiserie_type ? updated_menuiserie_type.hauteur : 0),
      quantity: data.quantity || 1,
      surface: ((data.width_override || (updated_menuiserie_type ? updated_menuiserie_type.largeur : 0)) * 
               (data.height_override || (updated_menuiserie_type ? updated_menuiserie_type.hauteur : 0))) / 10000,
      surfaceImpactee: (updated_menuiserie_type ? updated_menuiserie_type.surface_impactee : 'Mur').toLowerCase() as "mur" | "plafond" | "sol",
      impactePlinthe: updated_menuiserie_type ? updated_menuiserie_type.impacte_plinthe : false
    };
  } catch (error) {
    console.error(`Exception lors de la mise à jour de la menuiserie ${id}:`, error);
    return null;
  }
};

// Supprimer une menuiserie
export const deleteMenuiserie = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('room_menuiseries')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`Erreur lors de la suppression de la menuiserie ${id}:`, error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error(`Exception lors de la suppression de la menuiserie ${id}:`, error);
    return false;
  }
};
