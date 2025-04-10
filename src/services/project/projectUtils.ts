
import { supabase } from '@/lib/supabase';
import { Room, Travail, ProjectState } from '@/types';
import { fetchRoomsByProjectId } from './roomsService';
import { fetchMenuiseriesByRoomId, fetchCustomSurfacesByRoomId } from './roomItemsService';
import { fetchWorksByRoomIds } from './roomWorksService';

/**
 * Convertit les données de pièce de Supabase en objet Room du front-end
 */
export const convertSupabaseRoomToRoom = (room: any): Room => {
  return {
    id: room.id,
    name: room.name || '',
    customName: room.custom_name || '',
    type: room.type || '',
    width: room.width || 0,
    length: room.length || 0,
    height: room.height || 0,
    surface: room.surface || 0,
    plinthHeight: room.plinth_height || 0,
    typeSol: room.type_sol || '',
    typeMur: room.type_mur || '',
    menuiseries: room.menuiseries || [],
    autresSurfaces: room.autresSurfaces || [],
    wallSurfaceRaw: room.wall_surface_raw || 0,
    totalPlinthLength: room.total_plinth_length || 0,
    totalPlinthSurface: room.total_plinth_surface || 0,
    menuiseriesMursSurface: room.menuiseries_murs_surface || 0,
    menuiseriesPlafondSurface: room.menuiseries_plafond_surface || 0,
    menuiseriesSolSurface: room.menuiseries_sol_surface || 0,
    autresSurfacesMurs: room.autres_surfaces_murs || 0,
    autresSurfacesPlafond: room.autres_surfaces_plafond || 0,
    autresSurfacesSol: room.autres_surfaces_sol || 0,
    netWallSurface: room.net_wall_surface || 0,
    surfaceNetteMurs: room.surface_nette_murs || 0,
    surfaceNetteSol: room.surface_nette_sol || 0,
    surfaceNettePlafond: room.surface_nette_plafond || 0,
    surfaceBruteSol: room.surface_brute_sol || 0,
    surfaceBrutePlafond: room.surface_brute_plafond || 0,
    surfaceBruteMurs: room.surface_brute_murs || 0,
    surfaceMenuiseries: room.surface_menuiseries || 0,
    totalMenuiserieSurface: room.total_menuiserie_surface || 0,
    lineaireBrut: room.lineaire_brut || 0,
    lineaireNet: room.lineaire_net || 0
  };
};

/**
 * Convertit les données de menuiserie de Supabase en objet Menuiserie du front-end
 */
export const convertSupabaseMenuiserieToMenuiserie = (item: any) => {
  return {
    id: item.id,
    type: item.menuiserie_type?.name || item.type || '',
    name: item.menuiserie_type?.name || item.name || '',
    largeur: item.largeur || (item.menuiserie_type?.largeur || 0),
    hauteur: item.hauteur || (item.menuiserie_type?.hauteur || 0),
    quantity: item.quantity || 1,
    surface: ((item.largeur || (item.menuiserie_type?.largeur || 0)) * (item.hauteur || (item.menuiserie_type?.hauteur || 0))) / 10000,
    surfaceImpactee: item.surface_impactee || 'mur'
  };
};

/**
 * Convertit les données de surface personnalisée de Supabase en objet AutreSurface du front-end
 */
export const convertSupabaseSurfaceToAutreSurface = (item: any) => {
  return {
    id: item.id,
    type: item.type || '',
    name: item.name || '',
    designation: item.designation || '',
    largeur: item.largeur || 0,
    hauteur: item.hauteur || 0,
    surface: item.surface || 0,
    quantity: item.quantity || 1,
    surfaceImpactee: item.surface_impactee || 'mur',
    estDeduction: item.est_deduction || false
  };
};

/**
 * Convertit les données de travail de Supabase en objet Travail du front-end
 */
export const convertSupabaseWorkToTravail = (travail: any): Travail => {
  return {
    id: travail.id,
    pieceId: travail.room_id,
    typeTravauxId: travail.type_travaux_id || '',
    typeTravauxLabel: travail.type_travaux_label || '',
    sousTypeId: travail.sous_type_id || '',
    sousTypeLabel: travail.sous_type_label || '',
    menuiserieId: travail.menuiserie_id || '',
    description: travail.description || '',
    quantite: travail.quantite || 0,
    unite: travail.unite || '',
    prixFournitures: travail.prix_fournitures || 0,
    prixMainOeuvre: travail.prix_main_oeuvre || 0,
    tauxTVA: travail.taux_tva || 20,
    commentaire: travail.commentaire || '',
    personnalisation: travail.personnalisation || '',
    typeTravaux: travail.type_travaux || '',
    sousType: travail.sous_type || '',
    surfaceImpactee: travail.surface_impactee || ''
  };
};

/**
 * Charge toutes les données d'un projet en une seule fonction
 */
export const loadFullProjectData = async (projectId: string, projectData: any) => {
  try {
    // Récupérer les pièces associées au projet
    const roomsData = await fetchRoomsByProjectId(projectId);
    const rooms: Room[] = [];
    
    // Pour chaque pièce, récupérer les menuiseries et surfaces personnalisées
    for (const roomData of roomsData) {
      const menuiseriesData = await fetchMenuiseriesByRoomId(roomData.id);
      const surfacesData = await fetchCustomSurfacesByRoomId(roomData.id);
      
      // Convertir les données Supabase en objets du front-end
      const menuiseries = menuiseriesData.map(convertSupabaseMenuiserieToMenuiserie);
      const autresSurfaces = surfacesData.map(convertSupabaseSurfaceToAutreSurface);
      
      // Construire l'objet Room complet
      const room = convertSupabaseRoomToRoom(roomData);
      room.menuiseries = menuiseries;
      room.autresSurfaces = autresSurfaces;
      
      rooms.push(room);
    }
    
    // Récupérer tous les travaux du projet
    const roomIds = rooms.map(room => room.id);
    const travauxData = await fetchWorksByRoomIds(roomIds);
    const travaux = travauxData.map(convertSupabaseWorkToTravail);
    
    // Construire l'état du projet complet
    const projectState: ProjectState = {
      property: {
        type: projectData.property_type || 'Appartement',
        floors: projectData.floors || 1,
        totalArea: projectData.total_area || 0,
        rooms: projectData.rooms_count || 0,
        ceilingHeight: projectData.ceiling_height || 2.5
      },
      rooms,
      travaux
    };
    
    return {
      projectData,
      projectState
    };
  } catch (error) {
    console.error('Exception lors de la récupération du projet complet:', error);
    throw error;
  }
};
