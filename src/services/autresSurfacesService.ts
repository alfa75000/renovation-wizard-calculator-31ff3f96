
import { supabase } from '@/lib/supabase';
import { TypeAutreSurface, AutreSurface } from '@/types';
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
    nom: item.nom,
    description: item.description,
    surfaceImpacteeParDefaut: item.surface_impactee_par_defaut,
    estDeduction: item.est_deduction,
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
    type: item.type,
    name: item.name,
    designation: item.designation || item.name,
    largeur: item.largeur,
    hauteur: item.hauteur,
    surface: item.surface,
    quantity: item.quantity || 1,
    surfaceImpactee: item.surface_impactee,
    estDeduction: item.adjustment_type === 'deduire'
  }));

  return autresSurfaces;
};

// Ajouter une autre surface pour une pièce
export const addAutreSurfaceToRoom = async (
  roomId: string, 
  surface: Omit<AutreSurface, 'id' | 'surface'>
): Promise<AutreSurface> => {
  const surfaceValue = surface.largeur * surface.hauteur;
  
  const newItem = {
    id: uuidv4(),
    room_id: roomId,
    type: surface.type,
    name: surface.name,
    designation: surface.designation || surface.name,
    largeur: surface.largeur,
    hauteur: surface.hauteur,
    surface: surfaceValue,
    quantity: surface.quantity || 1,
    surface_impactee: surface.surfaceImpactee,
    adjustment_type: surface.estDeduction ? 'deduire' : 'ajouter',
    impacte_plinthe: surface.estDeduction ? false : true,
    description: surface.designation || '',
    created_at: new Date().toISOString()
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
    type: data.type,
    name: data.name,
    designation: data.designation || data.name,
    largeur: data.largeur,
    hauteur: data.hauteur,
    surface: data.surface,
    quantity: data.quantity || 1,
    surfaceImpactee: data.surface_impactee,
    estDeduction: data.adjustment_type === 'deduire'
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
  const surface = largeur * hauteur;

  // Préparer les mises à jour
  const updates: any = {
    ...changes,
    surface: surface
  };

  // Convertir estDeduction en adjustment_type si présent
  if (changes.estDeduction !== undefined) {
    updates.adjustment_type = changes.estDeduction ? 'deduire' : 'ajouter';
    delete updates.estDeduction;
  }

  // Convertir surfaceImpactee en surface_impactee si présent
  if (changes.surfaceImpactee !== undefined) {
    updates.surface_impactee = changes.surfaceImpactee;
    delete updates.surfaceImpactee;
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
    type: data.type,
    name: data.name,
    designation: data.designation || data.name,
    largeur: data.largeur,
    hauteur: data.hauteur,
    surface: data.surface,
    quantity: data.quantity || 1,
    surfaceImpactee: data.surface_impactee,
    estDeduction: data.adjustment_type === 'deduire'
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
