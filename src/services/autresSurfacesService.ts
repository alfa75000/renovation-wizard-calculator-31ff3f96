
import { supabase } from '@/lib/supabase';
import { TypeAutreSurface, AutreSurface } from '@/types';
import { SurfaceImpactee, AdjustmentType, AutreSurfaceType, RoomCustomItem } from '@/types/supabase';
import { v4 as uuidv4 } from 'uuid';

// Convertir le type SurfaceImpactee de Supabase en format frontend
const convertSurfaceImpacteeToFrontend = (value: SurfaceImpactee): "mur" | "plafond" | "sol" => {
  switch (value) {
    case 'Mur':
      return 'mur';
    case 'Plafond':
      return 'plafond';
    case 'Sol':
      return 'sol';
    default:
      return 'mur'; // Valeur par défaut
  }
};

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
    surfaceImpacteeParDefaut: convertSurfaceImpacteeToFrontend(item.surface_impactee),
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
    type: item.type,
    name: item.name,
    designation: item.designation || item.name,
    largeur: item.largeur,
    hauteur: item.hauteur,
    surface: item.surface,
    quantity: item.quantity || 1,
    surfaceImpactee: convertSurfaceImpacteeToFrontend(item.surface_impactee),
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
  
  const newItem: Omit<RoomCustomItem, 'id' | 'created_at' | 'updated_at'> = {
    room_id: roomId,
    type: surface.type,
    name: surface.name,
    designation: surface.designation || surface.name,
    largeur: surface.largeur,
    hauteur: surface.hauteur,
    surface: surfaceValue,
    quantity: surface.quantity || 1,
    surface_impactee: surface.surfaceImpactee === 'mur' ? 'Mur' :
                     surface.surfaceImpactee === 'plafond' ? 'Plafond' :
                     surface.surfaceImpactee === 'sol' ? 'Sol' : 'Aucune' as SurfaceImpactee,
    adjustment_type: surface.estDeduction ? 'Déduire' : 'Ajouter' as AdjustmentType,
    impacte_plinthe: surface.impactePlinthe || false,
    description: surface.description || '',
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
    surfaceImpactee: convertSurfaceImpacteeToFrontend(data.surface_impactee),
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
  const surface = largeur * hauteur;

  // Préparer les mises à jour
  const updates: Partial<RoomCustomItem> = {
    surface: surface
  };

  // Copier les champs qui ont le même nom
  if (changes.name !== undefined) updates.name = changes.name;
  if (changes.designation !== undefined) updates.designation = changes.designation;
  if (changes.largeur !== undefined) updates.largeur = changes.largeur;
  if (changes.hauteur !== undefined) updates.hauteur = changes.hauteur;
  if (changes.quantity !== undefined) updates.quantity = changes.quantity;
  if (changes.description !== undefined) updates.description = changes.description;
  if (changes.type !== undefined) updates.type = changes.type;

  // Convertir les champs qui ont un nom différent
  if (changes.surfaceImpactee !== undefined) {
    updates.surface_impactee = changes.surfaceImpactee === 'mur' ? 'Mur' :
                              changes.surfaceImpactee === 'plafond' ? 'Plafond' :
                              changes.surfaceImpactee === 'sol' ? 'Sol' : 'Aucune' as SurfaceImpactee;
  }

  if (changes.estDeduction !== undefined) {
    updates.adjustment_type = changes.estDeduction ? 'Déduire' : 'Ajouter' as AdjustmentType;
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
    type: data.type,
    name: data.name,
    designation: data.designation || data.name,
    largeur: data.largeur,
    hauteur: data.hauteur,
    surface: data.surface,
    quantity: data.quantity || 1,
    surfaceImpactee: convertSurfaceImpacteeToFrontend(data.surface_impactee),
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

