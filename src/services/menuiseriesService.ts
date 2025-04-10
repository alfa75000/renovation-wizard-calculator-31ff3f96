
import { supabase } from '@/integrations/supabase/client';
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

// Créer un type de menuiserie
export const createMenuiserieType = async (data: {
  name: string;
  hauteur: number;
  largeur: number;
  surface_impactee: string; // Doit être une des valeurs de l'enum: 'Mur', 'Plafond', 'Sol', 'Aucune'
  impacte_plinthe: boolean;
  description?: string;
}) => {
  try {
    console.log("Création d'un type de menuiserie:", data);
    
    // Vérification des valeurs requises
    if (!data.name || !data.hauteur || !data.largeur || !data.surface_impactee) {
      console.error("Données incomplètes pour la création du type de menuiserie:", data);
      toast.error("Données incomplètes pour la création du type de menuiserie");
      return null;
    }
    
    // Validation de surface_impactee
    if (!['Mur', 'Plafond', 'Sol', 'Aucune'].includes(data.surface_impactee)) {
      console.error("Valeur invalide pour surface_impactee:", data.surface_impactee);
      toast.error("Type de surface impactée invalide");
      return null;
    }
    
    const { data: newType, error } = await supabase
      .from('menuiseries_types')
      .insert(data)
      .select()
      .single();
    
    if (error) {
      console.error("Erreur lors de la création du type de menuiserie:", error);
      toast.error("Erreur lors de la création du type de menuiserie");
      return null;
    }
    
    toast.success("Type de menuiserie créé avec succès");
    return newType;
  } catch (error) {
    console.error("Exception lors de la création du type de menuiserie:", error);
    toast.error("Erreur lors de la création du type de menuiserie");
    return null;
  }
};

// Mettre à jour un type de menuiserie
export const updateMenuiserieType = async (id: string, data: {
  name?: string;
  hauteur?: number;
  largeur?: number;
  surface_impactee?: string; // Doit être une des valeurs de l'enum: 'Mur', 'Plafond', 'Sol', 'Aucune'
  impacte_plinthe?: boolean;
  description?: string;
}) => {
  try {
    console.log("Mise à jour du type de menuiserie:", { id, data });
    
    // Validation de surface_impactee si présente
    if (data.surface_impactee && !['Mur', 'Plafond', 'Sol', 'Aucune'].includes(data.surface_impactee)) {
      console.error("Valeur invalide pour surface_impactee:", data.surface_impactee);
      toast.error("Type de surface impactée invalide");
      return null;
    }
    
    const { data: updatedType, error } = await supabase
      .from('menuiseries_types')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error("Erreur lors de la mise à jour du type de menuiserie:", error);
      toast.error("Erreur lors de la mise à jour du type de menuiserie");
      return null;
    }
    
    toast.success("Type de menuiserie mis à jour avec succès");
    return updatedType;
  } catch (error) {
    console.error("Exception lors de la mise à jour du type de menuiserie:", error);
    toast.error("Erreur lors de la mise à jour du type de menuiserie");
    return null;
  }
};

// Supprimer un type de menuiserie
export const deleteMenuiserieType = async (id: string) => {
  try {
    console.log("Suppression du type de menuiserie:", id);
    
    const { error } = await supabase
      .from('menuiseries_types')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error("Erreur lors de la suppression du type de menuiserie:", error);
      toast.error("Erreur lors de la suppression du type de menuiserie");
      return false;
    }
    
    toast.success("Type de menuiserie supprimé avec succès");
    return true;
  } catch (error) {
    console.error("Exception lors de la suppression du type de menuiserie:", error);
    toast.error("Erreur lors de la suppression du type de menuiserie");
    return false;
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
    
    // Vérification que l'ID du type est bien présent
    if (!roomMenuiserie.menuiserie_type_id) {
      console.error("Erreur: menuiserie_type_id manquant");
      toast.error("Erreur: Aucun type de menuiserie sélectionné");
      return null;
    }
    
    // Validation de surface_impactee si présente
    if (roomMenuiserie.surface_impactee && 
        !['Mur', 'Plafond', 'Sol', 'Aucune', 'mur', 'plafond', 'sol'].includes(roomMenuiserie.surface_impactee)) {
      console.error("Valeur invalide pour surface_impactee:", roomMenuiserie.surface_impactee);
      
      // Conversion des valeurs frontend vers les valeurs Supabase si nécessaire
      if (roomMenuiserie.surface_impactee === 'mur') {
        roomMenuiserie.surface_impactee = 'Mur';
      } else if (roomMenuiserie.surface_impactee === 'plafond') {
        roomMenuiserie.surface_impactee = 'Plafond';
      } else if (roomMenuiserie.surface_impactee === 'sol') {
        roomMenuiserie.surface_impactee = 'Sol';
      } else {
        toast.error("Type de surface impactée invalide");
        return null;
      }
    }
    
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
