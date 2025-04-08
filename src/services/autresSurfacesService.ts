
import { supabase } from '@/lib/supabase';
import { AutreSurfaceType, RoomCustomItem, SurfaceImpactee, AdjustmentType } from '@/types/supabase';
import { TypeAutreSurface, RoomCustomItem as AppRoomCustomItem } from '@/types';

// Conversion des types Supabase vers les types de l'application
const mapSupabaseAutreSurfaceTypeToApp = (item: AutreSurfaceType): TypeAutreSurface => {
  return {
    id: item.id,
    nom: item.name,
    description: item.description || '',
    surfaceImpacteeParDefaut: mapSurfaceImpactee(item.surface_impactee),
    estDeduction: item.adjustment_type === 'Déduire'
  };
};

// Conversion des types de l'application vers les types Supabase
const mapAppAutreSurfaceTypeToSupabase = (item: TypeAutreSurface): Partial<AutreSurfaceType> => {
  return {
    name: item.nom,
    description: item.description,
    surface_impactee: mapSurfaceImpacteeToSupabase(item.surfaceImpacteeParDefaut),
    adjustment_type: item.estDeduction ? 'Déduire' : 'Ajouter',
    impacte_plinthe: false, // Valeur par défaut
    largeur: 0, // Valeur par défaut
    hauteur: 0 // Valeur par défaut
  };
};

// Conversion des types Supabase vers les types de l'application (RoomCustomItem)
const mapSupabaseRoomCustomItemToApp = (item: RoomCustomItem): AppRoomCustomItem => {
  return {
    id: item.id,
    roomId: item.room_id,
    name: item.name,
    largeur: item.largeur,
    hauteur: item.hauteur,
    surfaceImpactee: mapSurfaceImpactee(item.surface_impactee),
    estDeduction: item.adjustment_type === 'Déduire',
    impactePlinthe: item.impacte_plinthe,
    quantity: item.quantity,
    description: item.description || '',
    sourceTypeId: item.source_type_id || undefined,
    surface: item.largeur * item.hauteur * item.quantity / 10000 // Conversion en m²
  };
};

// Conversion des types de l'application vers les types Supabase (RoomCustomItem)
const mapAppRoomCustomItemToSupabase = (item: AppRoomCustomItem): Partial<RoomCustomItem> => {
  return {
    room_id: item.roomId,
    name: item.name,
    largeur: item.largeur,
    hauteur: item.hauteur,
    surface_impactee: mapSurfaceImpacteeToSupabase(item.surfaceImpactee),
    adjustment_type: item.estDeduction ? 'Déduire' : 'Ajouter',
    impacte_plinthe: item.impactePlinthe,
    quantity: item.quantity,
    description: item.description,
    source_type_id: item.sourceTypeId || null
  };
};

// Helper pour mapper les valeurs d'énumération
const mapSurfaceImpactee = (value: SurfaceImpactee): "mur" | "plafond" | "sol" | "aucune" => {
  switch (value) {
    case 'Mur': return 'mur';
    case 'Plafond': return 'plafond';
    case 'Sol': return 'sol';
    case 'Aucune': return 'aucune';
    default: return 'mur';
  }
};

// Helper pour mapper les valeurs d'énumération (inverse)
const mapSurfaceImpacteeToSupabase = (value: string): SurfaceImpactee => {
  switch (value) {
    case 'mur': return 'Mur';
    case 'plafond': return 'Plafond';
    case 'sol': return 'Sol';
    case 'aucune': return 'Aucune';
    default: return 'Mur';
  }
};

// CRUD pour autres_surfaces_types
export const fetchAutresSurfacesTypes = async (): Promise<TypeAutreSurface[]> => {
  try {
    const { data, error } = await supabase
      .from('autres_surfaces_types')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('[autresSurfacesService] Erreur lors de la récupération des types d\'autres surfaces:', error);
      throw error;
    }
    
    if (!data) {
      return [];
    }
    
    return data.map(mapSupabaseAutreSurfaceTypeToApp);
  } catch (error) {
    console.error('[autresSurfacesService] Exception lors de la récupération des types d\'autres surfaces:', error);
    return [];
  }
};

export const createAutreSurfaceType = async (typeData: Omit<TypeAutreSurface, 'id'>): Promise<TypeAutreSurface | null> => {
  try {
    const supabaseData = mapAppAutreSurfaceTypeToSupabase(typeData as TypeAutreSurface);
    
    const { data, error } = await supabase
      .from('autres_surfaces_types')
      .insert(supabaseData)
      .select()
      .single();
    
    if (error) {
      console.error('[autresSurfacesService] Erreur lors de la création du type d\'autre surface:', error);
      throw error;
    }
    
    if (!data) {
      return null;
    }
    
    return mapSupabaseAutreSurfaceTypeToApp(data as AutreSurfaceType);
  } catch (error) {
    console.error('[autresSurfacesService] Exception lors de la création du type d\'autre surface:', error);
    return null;
  }
};

export const updateAutreSurfaceType = async (id: string, typeData: Partial<TypeAutreSurface>): Promise<TypeAutreSurface | null> => {
  try {
    const supabaseData = mapAppAutreSurfaceTypeToSupabase(typeData as TypeAutreSurface);
    
    const { data, error } = await supabase
      .from('autres_surfaces_types')
      .update(supabaseData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`[autresSurfacesService] Erreur lors de la mise à jour du type d'autre surface ${id}:`, error);
      throw error;
    }
    
    if (!data) {
      return null;
    }
    
    return mapSupabaseAutreSurfaceTypeToApp(data as AutreSurfaceType);
  } catch (error) {
    console.error(`[autresSurfacesService] Exception lors de la mise à jour du type d'autre surface ${id}:`, error);
    return null;
  }
};

export const deleteAutreSurfaceType = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('autres_surfaces_types')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`[autresSurfacesService] Erreur lors de la suppression du type d'autre surface ${id}:`, error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error(`[autresSurfacesService] Exception lors de la suppression du type d'autre surface ${id}:`, error);
    return false;
  }
};

// CRUD pour room_custom_items
export const fetchRoomCustomItems = async (roomId?: string): Promise<AppRoomCustomItem[]> => {
  try {
    let query = supabase
      .from('room_custom_items')
      .select('*');
    
    if (roomId) {
      query = query.eq('room_id', roomId);
    }
    
    const { data, error } = await query.order('name');
    
    if (error) {
      console.error('[autresSurfacesService] Erreur lors de la récupération des items personnalisés:', error);
      throw error;
    }
    
    if (!data) {
      return [];
    }
    
    return data.map(mapSupabaseRoomCustomItemToApp);
  } catch (error) {
    console.error('[autresSurfacesService] Exception lors de la récupération des items personnalisés:', error);
    return [];
  }
};

export const createRoomCustomItem = async (itemData: Omit<AppRoomCustomItem, 'id'>): Promise<AppRoomCustomItem | null> => {
  try {
    const supabaseData = mapAppRoomCustomItemToSupabase(itemData as AppRoomCustomItem);
    
    const { data, error } = await supabase
      .from('room_custom_items')
      .insert(supabaseData)
      .select()
      .single();
    
    if (error) {
      console.error('[autresSurfacesService] Erreur lors de la création de l\'item personnalisé:', error);
      throw error;
    }
    
    if (!data) {
      return null;
    }
    
    return mapSupabaseRoomCustomItemToApp(data as RoomCustomItem);
  } catch (error) {
    console.error('[autresSurfacesService] Exception lors de la création de l\'item personnalisé:', error);
    return null;
  }
};

export const updateRoomCustomItem = async (id: string, itemData: Partial<AppRoomCustomItem>): Promise<AppRoomCustomItem | null> => {
  try {
    // Ne garder que les champs à mettre à jour
    const supabaseData: Partial<RoomCustomItem> = {};
    
    if (itemData.name !== undefined) supabaseData.name = itemData.name;
    if (itemData.largeur !== undefined) supabaseData.largeur = itemData.largeur;
    if (itemData.hauteur !== undefined) supabaseData.hauteur = itemData.hauteur;
    if (itemData.surfaceImpactee !== undefined) supabaseData.surface_impactee = mapSurfaceImpacteeToSupabase(itemData.surfaceImpactee);
    if (itemData.estDeduction !== undefined) supabaseData.adjustment_type = itemData.estDeduction ? 'Déduire' : 'Ajouter';
    if (itemData.impactePlinthe !== undefined) supabaseData.impacte_plinthe = itemData.impactePlinthe;
    if (itemData.quantity !== undefined) supabaseData.quantity = itemData.quantity;
    if (itemData.description !== undefined) supabaseData.description = itemData.description;
    
    const { data, error } = await supabase
      .from('room_custom_items')
      .update(supabaseData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`[autresSurfacesService] Erreur lors de la mise à jour de l'item personnalisé ${id}:`, error);
      throw error;
    }
    
    if (!data) {
      return null;
    }
    
    return mapSupabaseRoomCustomItemToApp(data as RoomCustomItem);
  } catch (error) {
    console.error(`[autresSurfacesService] Exception lors de la mise à jour de l'item personnalisé ${id}:`, error);
    return null;
  }
};

export const deleteRoomCustomItem = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('room_custom_items')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`[autresSurfacesService] Erreur lors de la suppression de l'item personnalisé ${id}:`, error);
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error(`[autresSurfacesService] Exception lors de la suppression de l'item personnalisé ${id}:`, error);
    return false;
  }
};
