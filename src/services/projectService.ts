import { supabase } from '@/lib/supabase';
import { format } from 'date-fns';
import { Room, Travail, ProjectState } from '@/types';

/**
 * Récupère tous les projets depuis Supabase
 */
export const fetchProjects = async () => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Erreur lors de la récupération des projets:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Exception lors de la récupération des projets:', error);
    throw error;
  }
};

/**
 * Récupère un projet spécifique et toutes ses données associées
 */
export const fetchProjectById = async (projectId: string) => {
  try {
    // Récupérer les informations du projet
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();
    
    if (projectError) {
      console.error('Erreur lors de la récupération du projet:', projectError);
      throw projectError;
    }
    
    if (!projectData) {
      throw new Error('Projet non trouvé');
    }
    
    // Récupérer les pièces associées au projet
    const { data: roomsData, error: roomsError } = await supabase
      .from('rooms')
      .select('*')
      .eq('project_id', projectId);
    
    if (roomsError) {
      console.error('Erreur lors de la récupération des pièces:', roomsError);
      throw roomsError;
    }
    
    const rooms = roomsData || [];
    const allTravaux = [];
    
    // Pour chaque pièce, récupérer les travaux, menuiseries et surfaces personnalisées
    for (const room of rooms) {
      // Récupérer les travaux
      const { data: travauxData, error: travauxError } = await supabase
        .from('room_works')
        .select('*')
        .eq('room_id', room.id);
      
      if (travauxError) {
        console.error('Erreur lors de la récupération des travaux:', travauxError);
        throw travauxError;
      }
      
      // Ajouter les travaux à la liste complète
      if (travauxData && travauxData.length > 0) {
        allTravaux.push(...travauxData);
      }
      
      // Récupérer les menuiseries
      const { data: menuiseriesData, error: menuiseriesError } = await supabase
        .from('room_menuiseries')
        .select('*, menuiserie_type:menuiserie_type_id(*)')
        .eq('room_id', room.id);
      
      if (menuiseriesError) {
        console.error('Erreur lors de la récupération des menuiseries:', menuiseriesError);
        throw menuiseriesError;
      }
      
      // Assigner les menuiseries à la pièce
      room.menuiseries = (menuiseriesData || []).map(item => ({
        id: item.id,
        type: item.type || item.menuiserie_type?.name || '',
        name: item.name || item.menuiserie_type?.name || '',
        largeur: item.largeur || item.width_override || item.menuiserie_type?.largeur || 0,
        hauteur: item.hauteur || item.height_override || item.menuiserie_type?.hauteur || 0,
        quantity: item.quantity || 1,
        surface: ((item.largeur || item.width_override || item.menuiserie_type?.largeur || 0) * 
                 (item.hauteur || item.height_override || item.menuiserie_type?.hauteur || 0)) / 10000,
        surfaceImpactee: item.surface_impactee || 'mur'
      }));
      
      // Récupérer les surfaces personnalisées
      const { data: surfacesData, error: surfacesError } = await supabase
        .from('room_custom_items')
        .select('*')
        .eq('room_id', room.id);
      
      if (surfacesError) {
        console.error('Erreur lors de la récupération des surfaces personnalisées:', surfacesError);
        throw surfacesError;
      }
      
      // Assigner les surfaces personnalisées à la pièce
      room.autresSurfaces = (surfacesData || []).map(item => ({
        id: item.id,
        type: item.name || '',
        name: item.name || '',
        designation: item.name || '',
        largeur: item.largeur || 0,
        hauteur: item.hauteur || 0,
        surface: (item.largeur * item.hauteur) || 0,
        quantity: item.quantity || 1,
        surfaceImpactee: item.surface_impactee?.toLowerCase() || 'mur',
        estDeduction: item.adjustment_type === 'Déduire'
      }));
    }
    
    // Construire l'objet ProjectState complet
    const projectState: ProjectState = {
      property: {
        type: projectData.property_type || 'Appartement',
        floors: projectData.floors || 1,
        totalArea: projectData.total_area || 0,
        rooms: projectData.rooms_count || 0,
        ceilingHeight: projectData.ceiling_height || 2.5
      },
      rooms: rooms.map(room => ({
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
      })),
      travaux: allTravaux.map(travail => ({
        id: travail.id,
        pieceId: travail.room_id,
        typeTravauxId: travail.type_travaux_id || '',
        typeTravauxLabel: travail.type_travaux_label || '',
        sousTypeId: travail.sous_type_id || '',
        sousTypeLabel: travail.sous_type_label || '',
        menuiserieId: travail.menuiserie_id || '',
        description: travail.description || '',
        quantite: travail.quantite || travail.quantity || 0,
        unite: travail.unite || travail.unit || '',
        prixFournitures: travail.prixFournitures || travail.supply_price_override || 0,
        prixMainOeuvre: travail.prix_main_oeuvre || travail.labor_price_override || 0,
        tauxTVA: travail.taux_tva || travail.vat_rate || 20,
        commentaire: travail.commentaire || '',
        personnalisation: travail.personnalisation || '',
        typeTravaux: travail.type_travaux || '',
        sousType: travail.sous_type || '',
        surfaceImpactee: travail.surface_impactee || ''
      }))
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

/**
 * Crée un nouveau projet dans Supabase
 */
export const createProject = async (projectState: ProjectState, projectInfo: any = {}) => {
  try {
    // Générer un nom par défaut si non fourni
    const projectName = projectInfo.name || generateDefaultProjectName();
    
    // Créer le projet
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .insert({
        name: projectName,
        client_id: projectInfo.clientId || null,
        property_type: projectState.property.type,
        floors: projectState.property.floors,
        total_area: projectState.property.totalArea,
        rooms_count: projectState.property.rooms,
        ceiling_height: projectState.property.ceilingHeight
      })
      .select()
      .single();
    
    if (projectError) {
      console.error('Erreur lors de la création du projet:', projectError);
      throw projectError;
    }
    
    if (!projectData) {
      throw new Error('Erreur: Aucune donnée retournée après la création du projet');
    }
    
    const projectId = projectData.id;
    
    // Créer les pièces
    for (const room of projectState.rooms) {
      const { data: roomData, error: roomError } = await supabase
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
      
      if (roomError) {
        console.error('Erreur lors de la création de la pièce:', roomError);
        throw roomError;
      }
      
      if (!roomData) {
        throw new Error('Erreur: Aucune donnée retournée après la création de la pièce');
      }
      
      const roomId = roomData.id;
      
      // Créer les menuiseries pour cette pièce
      if (room.menuiseries && room.menuiseries.length > 0) {
        for (const menuiserie of room.menuiseries) {
          const { error: menuiserieError } = await supabase
            .from('room_menuiseries')
            .insert({
              room_id: roomId,
              menuiserie_type_id: null, // À adapter selon la structure réelle
              type: menuiserie.type,
              name: menuiserie.name,
              largeur: menuiserie.largeur,
              hauteur: menuiserie.hauteur,
              quantity: menuiserie.quantity,
              surface: menuiserie.surface,
              surface_impactee: menuiserie.surfaceImpactee
            });
          
          if (menuiserieError) {
            console.error('Erreur lors de la création de la menuiserie:', menuiserieError);
            throw menuiserieError;
          }
        }
      }
      
      // Créer les autres surfaces pour cette pièce
      if (room.autresSurfaces && room.autresSurfaces.length > 0) {
        for (const surface of room.autresSurfaces) {
          const { error: surfaceError } = await supabase
            .from('room_custom_items')
            .insert({
              room_id: roomId,
              name: surface.name,
              largeur: surface.largeur,
              hauteur: surface.hauteur,
              quantity: surface.quantity || 1,
              surface_impactee: (surface.surfaceImpactee === 'mur' ? 'Mur' : 
                              surface.surfaceImpactee === 'plafond' ? 'Plafond' : 
                              surface.surfaceImpactee === 'sol' ? 'Sol' : 'Aucune'),
              adjustment_type: surface.estDeduction ? 'Déduire' : 'Ajouter',
              impacte_plinthe: surface.impactePlinthe || false,
              description: surface.description || null
            });
          
          if (surfaceError) {
            console.error('Erreur lors de la création de la surface personnalisée:', surfaceError);
            throw surfaceError;
          }
        }
      }
    }
    
    // Créer les travaux
    for (const travail of projectState.travaux) {
      const { error: travailError } = await supabase
        .from('room_works')
        .insert({
          room_id: travail.pieceId,
          service_id: travail.typeTravauxId || '', // À adapter pour correspondre à un service réel
          type_travaux_id: travail.typeTravauxId,
          type_travaux_label: travail.typeTravauxLabel,
          sous_type_id: travail.sousTypeId,
          sous_type_label: travail.sousTypeLabel,
          menuiserie_id: travail.menuiserieId || null,
          description: travail.description,
          quantite: travail.quantite,
          unite: travail.unite,
          prix_fournitures: travail.prixFournitures,
          prix_main_oeuvre: travail.prixMainOeuvre,
          taux_tva: travail.tauxTVA,
          commentaire: travail.commentaire || '',
          personnalisation: travail.personnalisation || '',
          type_travaux: travail.typeTravaux || '',
          sous_type: travail.sousType || '',
          surface_impactee: travail.surfaceImpactee || '',
          quantity: travail.quantite,
          unit: travail.unite,
          supply_price_override: travail.prixFournitures,
          labor_price_override: travail.prixMainOeuvre,
          vat_rate: travail.tauxTVA
        });
      
      if (travailError) {
        console.error('Erreur lors de la création du travail:', travailError);
        throw travailError;
      }
    }
    
    return {
      id: projectId,
      name: projectName
    };
  } catch (error) {
    console.error('Exception lors de la création du projet complet:', error);
    throw error;
  }
};

/**
 * Met à jour un projet existant dans Supabase
 */
export const updateProject = async (projectId: string, projectState: ProjectState, projectInfo: any = {}) => {
  try {
    // Mettre à jour le projet
    const { error: projectError } = await supabase
      .from('projects')
      .update({
        name: projectInfo.name,
        client_id: projectInfo.clientId || null,
        property_type: projectState.property.type,
        floors: projectState.property.floors,
        total_area: projectState.property.totalArea,
        rooms_count: projectState.property.rooms,
        ceiling_height: projectState.property.ceilingHeight,
        updated_at: new Date().toISOString()
      })
      .eq('id', projectId);
    
    if (projectError) {
      console.error('Erreur lors de la mise à jour du projet:', projectError);
      throw projectError;
    }
    
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
    const newRoomIds = projectState.rooms.map(room => room.id);
    
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
    for (const room of projectState.rooms) {
      if (existingRoomIds.includes(room.id)) {
        // Mettre à jour la pièce existante
        const { error: updateRoomError } = await supabase
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
          .eq('id', room.id);
        
        if (updateRoomError) {
          console.error('Erreur lors de la mise à jour de la pièce:', updateRoomError);
          throw updateRoomError;
        }
      } else {
        // Créer une nouvelle pièce
        const { data: roomData, error: createRoomError } = await supabase
          .from('rooms')
          .insert({
            project_id: projectId,
            id: room.id, // Conserver l'ID existant
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
        
        if (createRoomError) {
          console.error('Erreur lors de la création de la pièce:', createRoomError);
          throw createRoomError;
        }
      }
      
      // Gérer les menuiseries pour cette pièce
      if (room.menuiseries && room.menuiseries.length > 0) {
        // Récupérer les menuiseries existantes
        const { data: existingMenuiseries, error: menuiseriesError } = await supabase
          .from('room_menuiseries')
          .select('id')
          .eq('room_id', room.id);
        
        if (menuiseriesError) {
          console.error('Erreur lors de la récupération des menuiseries existantes:', menuiseriesError);
          throw menuiseriesError;
        }
        
        const existingMenuiserieIds = (existingMenuiseries || []).map(m => m.id);
        const newMenuiserieIds = room.menuiseries.map(m => m.id);
        
        // Supprimer les menuiseries qui n'existent plus
        const menuiseriesToDelete = existingMenuiserieIds.filter(id => !newMenuiserieIds.includes(id));
        if (menuiseriesToDelete.length > 0) {
          const { error: deleteMenuiseriesError } = await supabase
            .from('room_menuiseries')
            .delete()
            .in('id', menuiseriesToDelete);
          
          if (deleteMenuiseriesError) {
            console.error('Erreur lors de la suppression des menuiseries:', deleteMenuiseriesError);
            throw deleteMenuiseriesError;
          }
        }
        
        // Mettre à jour ou créer les menuiseries
        for (const menuiserie of room.menuiseries) {
          if (existingMenuiserieIds.includes(menuiserie.id)) {
            // Mettre à jour la menuiserie existante
            const { error: updateMenuiserieError } = await supabase
              .from('room_menuiseries')
              .update({
                type: menuiserie.type,
                name: menuiserie.name,
                largeur: menuiserie.largeur,
                hauteur: menuiserie.hauteur,
                quantity: menuiserie.quantity,
                surface: menuiserie.surface,
                surface_impactee: menuiserie.surfaceImpactee
              })
              .eq('id', menuiserie.id);
            
            if (updateMenuiserieError) {
              console.error('Erreur lors de la mise à jour de la menuiserie:', updateMenuiserieError);
              throw updateMenuiserieError;
            }
          } else {
            // Créer une nouvelle menuiserie
            const { error: createMenuiserieError } = await supabase
              .from('room_menuiseries')
              .insert({
                room_id: room.id,
                id: menuiserie.id, // Conserver l'ID existant
                menuiserie_type_id: null, // À adapter selon la structure réelle
                type: menuiserie.type,
                name: menuiserie.name,
                largeur: menuiserie.largeur,
                hauteur: menuiserie.hauteur,
                quantity: menuiserie.quantity,
                surface: menuiserie.surface,
                surface_impactee: menuiserie.surfaceImpactee
              });
            
            if (createMenuiserieError) {
              console.error('Erreur lors de la création de la menuiserie:', createMenuiserieError);
              throw createMenuiserieError;
            }
          }
        }
      }
      
      // Gérer les autres surfaces pour cette pièce
      if (room.autresSurfaces && room.autresSurfaces.length > 0) {
        // Récupérer les surfaces existantes
        const { data: existingSurfaces, error: surfacesError } = await supabase
          .from('room_custom_items')
          .select('id')
          .eq('room_id', room.id);
        
        if (surfacesError) {
          console.error('Erreur lors de la récupération des surfaces existantes:', surfacesError);
          throw surfacesError;
        }
        
        const existingSurfaceIds = (existingSurfaces || []).map(s => s.id);
        const newSurfaceIds = room.autresSurfaces.map(s => s.id);
        
        // Supprimer les surfaces qui n'existent plus
        const surfacesToDelete = existingSurfaceIds.filter(id => !newSurfaceIds.includes(id));
        if (surfacesToDelete.length > 0) {
          const { error: deleteSurfacesError } = await supabase
            .from('room_custom_items')
            .delete()
            .in('id', surfacesToDelete);
          
          if (deleteSurfacesError) {
            console.error('Erreur lors de la suppression des surfaces:', deleteSurfacesError);
            throw deleteSurfacesError;
          }
        }
        
        // Mettre à jour ou créer les surfaces
        for (const surface of room.autresSurfaces) {
          if (existingSurfaceIds.includes(surface.id)) {
            // Mettre à jour la surface existante
            const { error: updateSurfaceError } = await supabase
              .from('room_custom_items')
              .update({
                name: surface.name,
                largeur: surface.largeur,
                hauteur: surface.hauteur,
                quantity: surface.quantity,
                surface_impactee: surface.surfaceImpactee,
                adjustment_type: surface.estDeduction ? 'Déduire' : 'Ajouter',
                impacte_plinthe: surface.impactePlinthe,
                description: surface.description
              })
              .eq('id', surface.id);
            
            if (updateSurfaceError) {
              console.error('Erreur lors de la mise à jour de la surface:', updateSurfaceError);
              throw updateSurfaceError;
            }
          } else {
            // Créer une nouvelle surface
            const { error: createSurfaceError } = await supabase
              .from('room_custom_items')
              .insert({
                room_id: room.id,
                id: surface.id, // Conserver l'ID existant
                name: surface.name,
                largeur: surface.largeur,
                hauteur: surface.hauteur,
                quantity: surface.quantity,
                surface_impactee: surface.surfaceImpactee,
                adjustment_type: surface.estDeduction ? 'Déduire' : 'Ajouter',
                impacte_plinthe: surface.impactePlinthe,
                description: surface.description
              });
            
            if (createSurfaceError) {
              console.error('Erreur lors de la création de la surface:', createSurfaceError);
              throw createSurfaceError;
            }
          }
        }
      }
    }
    
    // Gérer les travaux
    // Récupérer tous les travaux existants du projet
    const { data: projectRooms, error: projectRoomsError } = await supabase
      .from('rooms')
      .select('id')
      .eq('project_id', projectId);
    
    if (projectRoomsError) {
      console.error('Erreur lors de la récupération des IDs de pièces:', projectRoomsError);
      throw projectRoomsError;
    }
    
    const roomIds = (projectRooms || []).map(room => room.id);
    
    if (roomIds.length > 0) {
      const { data: existingWorks, error: worksError } = await supabase
        .from('room_works')
        .select('id')
        .in('room_id', roomIds);
      
      if (worksError) {
        console.error('Erreur lors de la récupération des travaux existants:', worksError);
        throw worksError;
      }
      
      const existingWorkIds = (existingWorks || []).map(work => work.id);
      const newWorkIds = projectState.travaux.map(travail => travail.id);
      
      // Supprimer les travaux qui n'existent plus
      const worksToDelete = existingWorkIds.filter(id => !newWorkIds.includes(id));
      if (worksToDelete.length > 0) {
        const { error: deleteWorksError } = await supabase
          .from('room_works')
          .delete()
          .in('id', worksToDelete);
        
        if (deleteWorksError) {
          console.error('Erreur lors de la suppression des travaux:', deleteWorksError);
          throw deleteWorksError;
        }
      }
      
      // Mettre à jour ou créer les travaux
      for (const travail of projectState.travaux) {
        if (existingWorkIds.includes(travail.id)) {
          // Mettre à jour le travail existant
          const { error: updateWorkError } = await supabase
            .from('room_works')
            .update({
              type_travaux_id: travail.typeTravauxId,
              type_travaux_label: travail.typeTravauxLabel,
              sous_type_id: travail.sousTypeId,
              sous_type_label: travail.sousTypeLabel,
              menuiserie_id: travail.menuiserieId || null,
              description: travail.description,
              quantite: travail.quantite,
              unite: travail.unite,
              prix_fournitures: travail.prixFournitures,
              prix_main_oeuvre: travail.prixMainOeuvre,
              taux_tva: travail.tauxTVA,
              commentaire: travail.commentaire || '',
              personnalisation: travail.personnalisation || '',
              type_travaux: travail.typeTravaux || '',
              sous_type: travail.sousType || '',
              surface_impactee: travail.surfaceImpactee || ''
            })
            .eq('id', travail.id);
          
          if (updateWorkError) {
            console.error('Erreur lors de la mise à jour du travail:', updateWorkError);
            throw updateWorkError;
          }
        } else {
          // Créer un nouveau travail
          const { error: createWorkError } = await supabase
            .from('room_works')
            .insert({
              id: travail.id, // Conserver l'ID existant
              room_id: travail.pieceId,
              type_travaux_id: travail.typeTravauxId,
              type_travaux_label: travail.typeTravauxLabel,
              sous_type_id: travail.sousTypeId,
              sous_type_label: travail.sousTypeLabel,
              menuiserie_id: travail.menuiserieId || null,
              description: travail.description,
              quantite: travail.quantite,
              unite: travail.unite,
              prix_fournitures: travail.prixFournitures,
              prix_main_oeuvre: travail.prixMainOeuvre,
              taux_tva: travail.tauxTVA,
              commentaire: travail.commentaire || '',
              personnalisation: travail.personnalisation || '',
              type_travaux: travail.typeTravaux || '',
              sous_type: travail.sousType || '',
              surface_impactee: travail.surfaceImpactee || '',
              quantity: travail.quantite,
              unit: travail.unite,
              supply_price_override: travail.prixFournitures,
              labor_price_override: travail.prixMainOeuvre,
              vat_rate: travail.tauxTVA
            });
          
          if (createWorkError) {
            console.error('Erreur lors de la création du travail:', createWorkError);
            throw createWorkError;
          }
        }
      }
    }
    
    return {
      id: projectId,
      ...projectInfo
    };
  } catch (error) {
    console.error('Exception lors de la mise à jour du projet complet:', error);
    throw error;
  }
};

/**
 * Supprime un projet de Supabase
 */
export const deleteProject = async (projectId: string) => {
  try {
    // Récupérer les pièces du projet
    const { data: rooms, error: roomsError } = await supabase
      .from('rooms')
      .select('id')
      .eq('project_id', projectId);
    
    if (roomsError) {
      console.error('Erreur lors de la récupération des pièces:', roomsError);
      throw roomsError;
    }
    
    const roomIds = (rooms || []).map(room => room.id);
    
    // Supprimer les travaux associés aux pièces
    if (roomIds.length > 0) {
      const { error: deleteWorksError } = await supabase
        .from('room_works')
        .delete()
        .in('room_id', roomIds);
      
      if (deleteWorksError) {
        console.error('Erreur lors de la suppression des travaux:', deleteWorksError);
        throw deleteWorksError;
      }
      
      // Supprimer les menuiseries associées aux pièces
      const { error: deleteMenuiseriesError } = await supabase
        .from('room_menuiseries')
        .delete()
        .in('room_id', roomIds);
      
      if (deleteMenuiseriesError) {
        console.error('Erreur lors de la suppression des menuiseries:', deleteMenuiseriesError);
        throw deleteMenuiseriesError;
      }
      
      // Supprimer les surfaces personnalisées associées aux pièces
      const { error: deleteCustomItemsError } = await supabase
        .from('room_custom_items')
        .delete()
        .in('room_id', roomIds);
      
      if (deleteCustomItemsError) {
        console.error('Erreur lors de la suppression des surfaces personnalisées:', deleteCustomItemsError);
        throw deleteCustomItemsError;
      }
    }
    
    // Supprimer les pièces du projet
    const { error: deleteRoomsError } = await supabase
      .from('rooms')
      .delete()
      .eq('project_id', projectId);
    
    if (deleteRoomsError) {
      console.error('Erreur lors de la suppression des pièces:', deleteRoomsError);
      throw deleteRoomsError;
    }
    
    // Enfin, supprimer le projet lui-même
    const { error: deleteProjectError } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);
    
    if (deleteProjectError) {
      console.error('Erreur lors de la suppression du projet:', deleteProjectError);
      throw deleteProjectError;
    }
    
    return true;
  } catch (error) {
    console.error('Exception lors de la suppression du projet:', error);
    throw error;
  }
};

/**
 * Génère un nom par défaut pour un nouveau projet
 */
export const generateDefaultProjectName = () => {
  const now = new Date();
  const dateFormat = format(now, 'dd/MM/yyyy à HH:mm');
  return `Projet du ${dateFormat}`;
};
