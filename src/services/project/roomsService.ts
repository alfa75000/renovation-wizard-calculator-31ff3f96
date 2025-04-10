
import { supabase } from '@/lib/supabase';
import { Room } from '@/types';

/**
 * Récupère toutes les pièces d'un projet
 */
export const fetchRoomsByProjectId = async (projectId: string) => {
  try {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('project_id', projectId);
    
    if (error) {
      console.error('Erreur lors de la récupération des pièces:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Exception lors de la récupération des pièces:', error);
    throw error;
  }
};

/**
 * Crée une nouvelle pièce pour un projet
 */
export const createRoom = async (projectId: string, room: Room) => {
  try {
    const { data, error } = await supabase
      .from('rooms')
      .insert({
        project_id: projectId,
        name: room.name,
        custom_name: room.customName || null,
        type: room.type,
        width: room.width,
        length: room.length,
        height: room.height,
        surface: room.surface,
        plinth_height: room.plinthHeight,
        type_sol: room.typeSol || null,
        type_mur: room.typeMur || null,
        wall_surface_raw: room.wallSurfaceRaw,
        total_plinth_length: room.totalPlinthLength,
        total_plinth_surface: room.totalPlinthSurface,
        menuiseries_murs_surface: room.menuiseriesMursSurface,
        menuiseries_plafond_surface: room.menuiseriesPlafondSurface,
        menuiseries_sol_surface: room.menuiseriesSolSurface,
        autres_surfaces_murs: room.autresSurfacesMurs,
        autres_surfaces_plafond: room.autresSurfacesPlafond,
        autres_surfaces_sol: room.autresSurfacesSol,
        net_wall_surface: room.netWallSurface,
        surface_nette_murs: room.surfaceNetteMurs,
        surface_nette_sol: room.surfaceNetteSol,
        surface_nette_plafond: room.surfaceNettePlafond,
        surface_brute_sol: room.surfaceBruteSol,
        surface_brute_plafond: room.surfaceBrutePlafond,
        surface_brute_murs: room.surfaceBruteMurs,
        surface_menuiseries: room.surfaceMenuiseries,
        total_menuiserie_surface: room.totalMenuiserieSurface,
        lineaire_brut: room.lineaireBrut || null,
        lineaire_net: room.lineaireNet || null
      })
      .select()
      .single();
    
    if (error) {
      console.error('Erreur lors de la création de la pièce:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Exception lors de la création de la pièce:', error);
    throw error;
  }
};

/**
 * Met à jour une pièce existante
 */
export const updateRoom = async (roomId: string, room: Room) => {
  try {
    const { error } = await supabase
      .from('rooms')
      .update({
        name: room.name,
        custom_name: room.customName || null,
        type: room.type,
        width: room.width,
        length: room.length,
        height: room.height,
        surface: room.surface,
        plinth_height: room.plinthHeight,
        type_sol: room.typeSol || null,
        type_mur: room.typeMur || null,
        wall_surface_raw: room.wallSurfaceRaw,
        total_plinth_length: room.totalPlinthLength,
        total_plinth_surface: room.totalPlinthSurface,
        menuiseries_murs_surface: room.menuiseriesMursSurface,
        menuiseries_plafond_surface: room.menuiseriesPlafondSurface,
        menuiseries_sol_surface: room.menuiseriesSolSurface,
        autres_surfaces_murs: room.autresSurfacesMurs,
        autres_surfaces_plafond: room.autresSurfacesPlafond,
        autres_surfaces_sol: room.autresSurfacesSol,
        net_wall_surface: room.netWallSurface,
        surface_nette_murs: room.surfaceNetteMurs,
        surface_nette_sol: room.surfaceNetteSol,
        surface_nette_plafond: room.surfaceNettePlafond,
        surface_brute_sol: room.surfaceBruteSol,
        surface_brute_plafond: room.surfaceBrutePlafond,
        surface_brute_murs: room.surfaceBruteMurs,
        surface_menuiseries: room.surfaceMenuiseries,
        total_menuiserie_surface: room.totalMenuiserieSurface,
        lineaire_brut: room.lineaireBrut || null,
        lineaire_net: room.lineaireNet || null
      })
      .eq('id', roomId);
    
    if (error) {
      console.error('Erreur lors de la mise à jour de la pièce:', error);
      throw error;
    }
    
    return { id: roomId };
  } catch (error) {
    console.error('Exception lors de la mise à jour de la pièce:', error);
    throw error;
  }
};

/**
 * Supprime une pièce et ses données associées
 */
export const deleteRoom = async (roomId: string) => {
  try {
    const { error } = await supabase
      .from('rooms')
      .delete()
      .eq('id', roomId);
    
    if (error) {
      console.error('Erreur lors de la suppression de la pièce:', error);
      throw error;
    }
    
    return { success: true };
  } catch (error) {
    console.error('Exception lors de la suppression de la pièce:', error);
    throw error;
  }
};

/**
 * Crée ou met à jour plusieurs pièces pour un projet
 */
export const syncRoomsForProject = async (projectId: string, rooms: Room[]) => {
  try {
    // Récupérer les pièces existantes
    const { data: existingRooms, error: roomsError } = await supabase
      .from('rooms')
      .select('id')
      .eq('project_id', projectId);
    
    if (roomsError) {
      console.error('Erreur lors de la récupération des pièces existantes:', roomsError);
      throw roomsError;
    }
    
    const existingRoomIds = (existingRooms || []).map(room => room.id);
    const newRoomIds = rooms.map(room => room.id);
    
    // Supprimer les pièces qui n'existent plus
    const roomsToDelete = existingRoomIds.filter(id => !newRoomIds.includes(id));
    if (roomsToDelete.length > 0) {
      const { error: deleteRoomsError } = await supabase
        .from('rooms')
        .delete()
        .in('id', roomsToDelete);
      
      if (deleteRoomsError) {
        console.error('Erreur lors de la suppression des pièces:', deleteRoomsError);
        throw deleteRoomsError;
      }
    }
    
    // Mettre à jour ou créer les pièces
    for (const room of rooms) {
      if (existingRoomIds.includes(room.id)) {
        await updateRoom(room.id, room);
      } else {
        await createRoom(projectId, room);
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error('Exception lors de la synchronisation des pièces:', error);
    throw error;
  }
};
