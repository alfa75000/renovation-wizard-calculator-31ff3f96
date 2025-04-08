
import { supabase } from '@/lib/supabase';
import { ProjectState, Room, Travail, ProjetChantier } from '@/types';
import { toast } from '@/components/ui/use-toast';
import { format } from 'date-fns';

// Type pour l'objet projet dans Supabase
interface SupabaseProject {
  id: string;
  name: string;
  client_id?: string;
  address?: string;
  postal_code?: string;
  city?: string;
  occupant?: string;
  description?: string;
  additional_info?: string;
}

// Fonction pour générer un nom de projet par défaut
export const generateDefaultProjectName = (): string => {
  return `Projet sans nom - ${format(new Date(), 'yyyy-MM-dd HH:mm')}`;
};

// Fonction pour sauvegarder un projet complet dans Supabase
export const saveProject = async (
  projectState: ProjectState,
  projetInfo: Partial<ProjetChantier> = {}
): Promise<string | null> => {
  try {
    // 1. Sauvegarder ou mettre à jour les informations du projet
    let projectId = projetInfo.id;
    const projectName = projetInfo.nom || projetInfo.nomProjet || generateDefaultProjectName();
    
    if (!projectId) {
      // Création d'un nouveau projet
      const { data: newProject, error: projectError } = await supabase
        .from('projects')
        .insert({
          name: projectName,
          client_id: projetInfo.clientId || null,
          address: projetInfo.adresse || null,
          postal_code: projetInfo.codePostal || null,
          city: projetInfo.ville || null,
          description: projetInfo.description || null,
          occupant: projetInfo.occupant || null,
          additional_info: projetInfo.infoComplementaire || null
        })
        .select('id')
        .single();

      if (projectError) {
        console.error('Erreur lors de la création du projet:', projectError);
        throw new Error(`Erreur lors de la création du projet: ${projectError.message}`);
      }
      
      projectId = newProject.id;
    } else {
      // Mise à jour d'un projet existant
      const { error: updateError } = await supabase
        .from('projects')
        .update({
          name: projectName,
          client_id: projetInfo.clientId || null,
          address: projetInfo.adresse || null,
          postal_code: projetInfo.codePostal || null,
          city: projetInfo.ville || null,
          description: projetInfo.description || null,
          occupant: projetInfo.occupant || null,
          additional_info: projetInfo.infoComplementaire || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId);

      if (updateError) {
        console.error('Erreur lors de la mise à jour du projet:', updateError);
        throw new Error(`Erreur lors de la mise à jour du projet: ${updateError.message}`);
      }
    }

    // 2. Supprimer les pièces existantes et leurs dépendances (pour une mise à jour complète)
    if (projectId) {
      // Récupérer d'abord toutes les pièces pour pouvoir supprimer leurs dépendances
      const { data: existingRooms } = await supabase
        .from('rooms')
        .select('id')
        .eq('project_id', projectId);
      
      if (existingRooms && existingRooms.length > 0) {
        const roomIds = existingRooms.map(room => room.id);
        
        // Supprimer les menuiseries des pièces
        await supabase
          .from('room_menuiseries')
          .delete()
          .in('room_id', roomIds);
        
        // Supprimer les travaux des pièces
        await supabase
          .from('room_works')
          .delete()
          .in('room_id', roomIds);
          
        // Supprimer les surfaces personnalisées
        await supabase
          .from('room_custom_surfaces')
          .delete()
          .in('room_id', roomIds);
      }
      
      // Supprimer toutes les pièces du projet
      await supabase
        .from('rooms')
        .delete()
        .eq('project_id', projectId);
    }

    // 3. Sauvegarder les nouvelles pièces
    for (const room of projectState.rooms) {
      // Sauvegarder la pièce
      const { data: newRoom, error: roomError } = await supabase
        .from('rooms')
        .insert({
          project_id: projectId,
          id: room.id,
          name: room.name,
          custom_name: room.customName || null,
          type: room.type,
          width: room.width,
          length: room.length,
          height: room.height,
          surface: room.surface,
          plinth_height: room.plinthHeight,
          sol_type: room.typeSol || null,
          mur_type: room.typeMur || null,
          wall_surface_raw: room.wallSurfaceRaw,
          total_plinth_length: room.totalPlinthLength,
          total_plinth_surface: room.totalPlinthSurface
        })
        .select('id')
        .single();

      if (roomError) {
        console.error('Erreur lors de la sauvegarde de la pièce:', roomError);
        throw new Error(`Erreur lors de la sauvegarde de la pièce: ${roomError.message}`);
      }

      // Sauvegarder les menuiseries de la pièce
      if (room.menuiseries && room.menuiseries.length > 0) {
        for (const menuiserie of room.menuiseries) {
          const { error: menuiserieError } = await supabase
            .from('room_menuiseries')
            .insert({
              room_id: newRoom.id,
              menuiserie_id: menuiserie.id,
              type: menuiserie.type,
              name: menuiserie.name,
              largeur: menuiserie.largeur,
              hauteur: menuiserie.hauteur,
              quantity: menuiserie.quantity,
              surface: menuiserie.surface,
              surface_impactee: menuiserie.surfaceImpactee,
              impacte_plinthe: menuiserie.impactePlinthe || false
            });

          if (menuiserieError) {
            console.error('Erreur lors de la sauvegarde de la menuiserie:', menuiserieError);
          }
        }
      }

      // Sauvegarder les autres surfaces
      if (room.autresSurfaces && room.autresSurfaces.length > 0) {
        for (const surface of room.autresSurfaces) {
          const { error: surfaceError } = await supabase
            .from('room_custom_surfaces')
            .insert({
              room_id: newRoom.id,
              id: surface.id,
              type: surface.type,
              name: surface.name,
              designation: surface.designation,
              largeur: surface.largeur,
              hauteur: surface.hauteur,
              surface: surface.surface,
              quantity: surface.quantity,
              surface_impactee: surface.surfaceImpactee,
              est_deduction: surface.estDeduction
            });

          if (surfaceError) {
            console.error('Erreur lors de la sauvegarde de la surface personnalisée:', surfaceError);
          }
        }
      }
    }

    // 4. Sauvegarder les travaux
    for (const travail of projectState.travaux) {
      const { error: travailError } = await supabase
        .from('room_works')
        .insert({
          id: travail.id,
          room_id: travail.pieceId,
          service_id: travail.sousTypeId,
          type_travaux_id: travail.typeTravauxId,
          type_travaux_label: travail.typeTravauxLabel,
          sous_type_label: travail.sousTypeLabel,
          menuiserie_id: travail.menuiserieId || null,
          description: travail.description,
          quantite: travail.quantite,
          unite: travail.unite,
          prix_fournitures: travail.prixFournitures,
          prix_main_oeuvre: travail.prixMainOeuvre,
          taux_tva: travail.tauxTVA,
          commentaire: travail.commentaire || null,
          personnalisation: travail.personnalisation || null,
          surface_impactee: travail.surfaceImpactee || null
        });

      if (travailError) {
        console.error('Erreur lors de la sauvegarde du travail:', travailError);
      }
    }

    return projectId;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde du projet:', error);
    toast({
      title: "Erreur",
      description: "Impossible de sauvegarder le projet. Veuillez réessayer.",
      variant: "destructive",
    });
    return null;
  }
};

// Fonction pour charger un projet complet depuis Supabase
export const loadProject = async (projectId: string): Promise<{
  projectState: ProjectState;
  projetInfo: ProjetChantier;
} | null> => {
  try {
    // 1. Charger les informations du projet
    const { data: projectData, error: projectError } = await supabase
      .from('projects')
      .select('*')
      .eq('id', projectId)
      .single();

    if (projectError || !projectData) {
      console.error('Erreur lors du chargement du projet:', projectError);
      throw new Error(`Erreur lors du chargement du projet: ${projectError?.message || 'Projet non trouvé'}`);
    }

    // 2. Charger les pièces du projet
    const { data: roomsData, error: roomsError } = await supabase
      .from('rooms')
      .select('*')
      .eq('project_id', projectId);

    if (roomsError) {
      console.error('Erreur lors du chargement des pièces:', roomsError);
      throw new Error(`Erreur lors du chargement des pièces: ${roomsError.message}`);
    }

    const rooms: Room[] = [];
    const travaux: Travail[] = [];

    // 3. Pour chaque pièce, charger les menuiseries, surfaces personnalisées et travaux
    for (const roomData of roomsData || []) {
      // Charger les menuiseries de la pièce
      const { data: menuiseriesData } = await supabase
        .from('room_menuiseries')
        .select('*')
        .eq('room_id', roomData.id);

      // Charger les surfaces personnalisées
      const { data: surfacesData } = await supabase
        .from('room_custom_surfaces')
        .select('*')
        .eq('room_id', roomData.id);

      // Charger les travaux de la pièce
      const { data: travauxData } = await supabase
        .from('room_works')
        .select('*')
        .eq('room_id', roomData.id);

      // Convertir les données de la pièce en objet Room
      const room: Room = {
        id: roomData.id,
        name: roomData.name,
        customName: roomData.custom_name || undefined,
        type: roomData.type,
        width: roomData.width,
        length: roomData.length,
        height: roomData.height,
        surface: roomData.surface,
        plinthHeight: roomData.plinth_height,
        typeSol: roomData.sol_type || undefined,
        typeMur: roomData.mur_type || undefined,
        wallSurfaceRaw: roomData.wall_surface_raw,
        totalPlinthLength: roomData.total_plinth_length,
        totalPlinthSurface: roomData.total_plinth_surface,
        menuiseries: (menuiseriesData || []).map(m => ({
          id: m.menuiserie_id,
          type: m.type,
          name: m.name,
          largeur: m.largeur,
          hauteur: m.hauteur,
          quantity: m.quantity,
          surface: m.surface,
          surfaceImpactee: m.surface_impactee,
          impactePlinthe: m.impacte_plinthe
        })),
        autresSurfaces: (surfacesData || []).map(s => ({
          id: s.id,
          type: s.type,
          name: s.name,
          designation: s.designation,
          largeur: s.largeur,
          hauteur: s.hauteur,
          surface: s.surface,
          quantity: s.quantity,
          surfaceImpactee: s.surface_impactee,
          estDeduction: s.est_deduction
        })),
        // Champs calculés (seront recalculés à l'initialisation)
        menuiseriesMursSurface: 0,
        menuiseriesPlafondSurface: 0,
        menuiseriesSolSurface: 0,
        autresSurfacesMurs: 0,
        autresSurfacesPlafond: 0,
        autresSurfacesSol: 0,
        netWallSurface: 0,
        surfaceNetteMurs: 0,
        surfaceNetteSol: 0,
        surfaceNettePlafond: 0,
        surfaceBruteSol: 0,
        surfaceBrutePlafond: 0,
        surfaceBruteMurs: 0,
        surfaceMenuiseries: 0,
        totalMenuiserieSurface: 0
      };

      rooms.push(room);

      // Convertir les travaux
      if (travauxData && travauxData.length > 0) {
        for (const travailData of travauxData) {
          const travail: Travail = {
            id: travailData.id,
            pieceId: travailData.room_id,
            typeTravauxId: travailData.type_travaux_id,
            typeTravauxLabel: travailData.type_travaux_label,
            sousTypeId: travailData.service_id,
            sousTypeLabel: travailData.sous_type_label,
            menuiserieId: travailData.menuiserie_id || undefined,
            description: travailData.description,
            quantite: travailData.quantite,
            unite: travailData.unite,
            prixFournitures: travailData.prix_fournitures,
            prixMainOeuvre: travailData.prix_main_oeuvre,
            tauxTVA: travailData.taux_tva,
            commentaire: travailData.commentaire || '',
            personnalisation: travailData.personnalisation || undefined,
            typeTravaux: travailData.type_travaux_label,
            sousType: travailData.sous_type_label,
            surfaceImpactee: travailData.surface_impactee || undefined
          };
          
          travaux.push(travail);
        }
      }
    }

    // 4. Créer l'objet ProjetChantier
    const projetInfo: ProjetChantier = {
      id: projectData.id,
      nom: projectData.name,
      adresse: projectData.address || '',
      codePostal: projectData.postal_code || '',
      ville: projectData.city || '',
      clientId: projectData.client_id || '',
      dateDebut: projectData.created_at ? new Date(projectData.created_at).toISOString().split('T')[0] : '',
      dateFin: '',
      description: projectData.description || '',
      statut: 'en_cours',
      montantTotal: 0,
      nomProjet: projectData.name,
      dateModification: projectData.updated_at ? new Date(projectData.updated_at).toISOString() : '',
      occupant: projectData.occupant || '',
      infoComplementaire: projectData.additional_info || ''
    };

    // 5. Créer l'objet ProjectState
    const projectState: ProjectState = {
      property: {
        type: 'Appartement', // Valeur par défaut, à ajuster selon les données disponibles
        floors: 1,
        totalArea: rooms.reduce((sum, room) => sum + room.surface, 0),
        rooms: rooms.length,
        ceilingHeight: 2.5 // Valeur par défaut
      },
      rooms,
      travaux
    };

    return {
      projectState,
      projetInfo
    };
  } catch (error) {
    console.error('Erreur lors du chargement du projet:', error);
    toast({
      title: "Erreur",
      description: "Impossible de charger le projet. Veuillez réessayer.",
      variant: "destructive",
    });
    return null;
  }
};

// Fonction pour récupérer la liste des projets
export const getProjects = async (): Promise<SupabaseProject[]> => {
  try {
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Erreur lors de la récupération des projets:', error);
      throw new Error(`Erreur lors de la récupération des projets: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Erreur lors de la récupération des projets:', error);
    toast({
      title: "Erreur",
      description: "Impossible de récupérer la liste des projets.",
      variant: "destructive",
    });
    return [];
  }
};

// Fonction pour supprimer un projet
export const deleteProject = async (projectId: string): Promise<boolean> => {
  try {
    // 1. Récupérer les pièces du projet pour supprimer ensuite leurs dépendances
    const { data: roomsData } = await supabase
      .from('rooms')
      .select('id')
      .eq('project_id', projectId);

    if (roomsData && roomsData.length > 0) {
      const roomIds = roomsData.map(room => room.id);
      
      // Supprimer les menuiseries des pièces
      await supabase
        .from('room_menuiseries')
        .delete()
        .in('room_id', roomIds);
      
      // Supprimer les travaux des pièces
      await supabase
        .from('room_works')
        .delete()
        .in('room_id', roomIds);
        
      // Supprimer les surfaces personnalisées
      await supabase
        .from('room_custom_surfaces')
        .delete()
        .in('room_id', roomIds);
    }
    
    // 2. Supprimer les pièces
    await supabase
      .from('rooms')
      .delete()
      .eq('project_id', projectId);
    
    // 3. Supprimer le projet
    const { error: deleteError } = await supabase
      .from('projects')
      .delete()
      .eq('id', projectId);

    if (deleteError) {
      console.error('Erreur lors de la suppression du projet:', deleteError);
      throw new Error(`Erreur lors de la suppression du projet: ${deleteError.message}`);
    }

    return true;
  } catch (error) {
    console.error('Erreur lors de la suppression du projet:', error);
    toast({
      title: "Erreur",
      description: "Impossible de supprimer le projet.",
      variant: "destructive",
    });
    return false;
  }
};
