
import { supabase } from '@/integrations/supabase/client';
import { TypeAutreSurface, AutreSurface } from '@/types';
import { SurfaceImpactee, AdjustmentType } from '@/types/supabase';
import { v4 as uuidv4 } from 'uuid';

// Récupérer tous les types d'autres surfaces
export const getAutresSurfacesTypes = async (): Promise<TypeAutreSurface[]> => {
  const { data, error } = await supabase
    .from('autres_surfaces_types')
    .select('*');

  if (error) {
    console.error('Erreur lors de la récupération des types d\'autres surfaces:', error);
    throw error;
  }

  // Mapper les données Supabase vers notre type d'application
  const typesAutresSurfaces: TypeAutreSurface[] = data.map(item => ({
    id: item.id,
    nom: item.name,
    description: item.description || '',
    largeur: item.largeur || 0,
    hauteur: item.hauteur || 0,
    surfaceImpacteeParDefaut: item.surface_impactee.toLowerCase() as "mur" | "plafond" | "sol",
    estDeduction: item.adjustment_type === 'Déduire',
    impactePlinthe: item.impacte_plinthe || false
  }));

  return typesAutresSurfaces;
};

// Récupérer les autres surfaces pour une pièce spécifique
export const getAutresSurfacesForRoom = async (roomId: string): Promise<AutreSurface[]> => {
  const { data, error } = await supabase
    .from('room_custom_items')
    .select('*')
    .eq('room_id', roomId);

  if (error) {
    console.error(`Erreur lors de la récupération des autres surfaces pour la pièce ${roomId}:`, error);
    throw error;
  }

  // Mapper les données Supabase vers notre type d'application
  const autresSurfaces: AutreSurface[] = data.map(item => ({
    id: item.id,
    type: 'autre', // Champ type n'existe pas dans room_custom_items
    name: item.name,
    designation: item.name, // Champ designation n'existe pas dans room_custom_items
    largeur: item.largeur,
    hauteur: item.hauteur,
    surface: item.largeur * item.hauteur, // Calcul de la surface
    quantity: item.quantity || 1,
    surfaceImpactee: item.surface_impactee.toLowerCase() as "mur" | "plafond" | "sol",
    estDeduction: item.adjustment_type === 'Déduire',
    impactePlinthe: item.impacte_plinthe || false,
    description: item.description || ''
  }));

  return autresSurfaces;
};

// Ajouter une autre surface pour une pièce
export const addAutreSurfaceToRoom = async (
  roomId: string, 
  surface: Omit<AutreSurface, 'id' | 'surface'>
): Promise<AutreSurface> => {
  const surfaceValue = surface.largeur * surface.hauteur;
  
  // Conversion pour Supabase
  const newItem = {
    room_id: roomId,
    name: surface.name,
    hauteur: surface.hauteur,
    largeur: surface.largeur,
    quantity: surface.quantity || 1,
    surface_impactee: (surface.surfaceImpactee === 'mur' ? 'Mur' : 
                     surface.surfaceImpactee === 'plafond' ? 'Plafond' : 
                     surface.surfaceImpactee === 'sol' ? 'Sol' : 'Aucune') as SurfaceImpactee,
    adjustment_type: (surface.estDeduction ? 'Déduire' : 'Ajouter') as AdjustmentType,
    impacte_plinthe: surface.impactePlinthe || false,
    description: surface.description || null
  };

  const { data, error } = await supabase
    .from('room_custom_items')
    .insert(newItem)
    .select()
    .single();

  if (error) {
    console.error('Erreur lors de l\'ajout d\'une autre surface:', error);
    throw error;
  }

  // Mapper le résultat vers notre type d'application
  return {
    id: data.id,
    type: 'autre', // Champ type n'existe pas dans room_custom_items
    name: data.name,
    designation: data.name, // Champ designation n'existe pas dans room_custom_items
    largeur: data.largeur,
    hauteur: data.hauteur,
    surface: data.largeur * data.hauteur, // Calcul de la surface
    quantity: data.quantity || 1,
    surfaceImpactee: data.surface_impactee.toLowerCase() as "mur" | "plafond" | "sol",
    estDeduction: data.adjustment_type === 'Déduire',
    impactePlinthe: data.impacte_plinthe || false,
    description: data.description || ''
  };
};

// Mettre à jour une autre surface
export const updateAutreSurface = async (
  id: string, 
  changes: Partial<Omit<AutreSurface, 'id' | 'surface'>>
): Promise<AutreSurface> => {
  // Récupérer d'abord les données existantes pour calculer la surface si nécessaire
  const { data: existingItem, error: fetchError } = await supabase
    .from('room_custom_items')
    .select('*')
    .eq('id', id)
    .single();

  if (fetchError) {
    console.error(`Erreur lors de la récupération de l'item ${id}:`, fetchError);
    throw fetchError;
  }

  // Calculer la nouvelle surface si les dimensions changent
  const largeur = changes.largeur !== undefined ? changes.largeur : existingItem.largeur;
  const hauteur = changes.hauteur !== undefined ? changes.hauteur : existingItem.hauteur;

  // Préparer les mises à jour
  const updates: any = {};
  
  // Copier les champs qui ont le même nom
  if (changes.name !== undefined) updates.name = changes.name;
  if (changes.largeur !== undefined) updates.largeur = changes.largeur;
  if (changes.hauteur !== undefined) updates.hauteur = changes.hauteur;
  if (changes.quantity !== undefined) updates.quantity = changes.quantity;
  if (changes.description !== undefined) updates.description = changes.description;

  // Convertir les champs qui nécessitent une transformation
  if (changes.surfaceImpactee !== undefined) {
    updates.surface_impactee = (changes.surfaceImpactee === 'mur' ? 'Mur' : 
                              changes.surfaceImpactee === 'plafond' ? 'Plafond' : 
                              changes.surfaceImpactee === 'sol' ? 'Sol' : 'Aucune') as SurfaceImpactee;
  }
  
  if (changes.estDeduction !== undefined) {
    updates.adjustment_type = (changes.estDeduction ? 'Déduire' : 'Ajouter') as AdjustmentType;
  }
  
  if (changes.impactePlinthe !== undefined) {
    updates.impacte_plinthe = changes.impactePlinthe;
  }

  const { data, error } = await supabase
    .from('room_custom_items')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(`Erreur lors de la mise à jour de l'item ${id}:`, error);
    throw error;
  }

  // Mapper le résultat vers notre type d'application
  return {
    id: data.id,
    type: 'autre', // Champ type n'existe pas dans room_custom_items
    name: data.name,
    designation: data.name, // Champ designation n'existe pas dans room_custom_items
    largeur: data.largeur,
    hauteur: data.hauteur,
    surface: data.largeur * data.hauteur, // Calcul de la surface
    quantity: data.quantity || 1,
    surfaceImpactee: data.surface_impactee.toLowerCase() as "mur" | "plafond" | "sol",
    estDeduction: data.adjustment_type === 'Déduire',
    impactePlinthe: data.impacte_plinthe || false,
    description: data.description || ''
  };
};

// Supprimer une autre surface
export const deleteAutreSurface = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('room_custom_items')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Erreur lors de la suppression de l'item ${id}:`, error);
    throw error;
  }
};
