
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RoomCustomItem, SurfaceImpactee, AdjustmentType, AutreSurfaceType } from '@/types/supabase';
import { AutreSurface } from '@/types';
import { toast } from 'sonner';
import { isValidUUID } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';

/**
 * Hook pour gérer les éléments personnalisés d'une pièce (autres surfaces)
 * via Supabase
 */
export const useRoomCustomItemsWithSupabase = (roomId?: string) => {
  const [customItems, setCustomItems] = useState<RoomCustomItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  // Mapper pour stocker la correspondance entre les IDs locaux et les UUIDs
  const [localIdToUUIDMap, setLocalIdToUUIDMap] = useState<Record<string, string>>({});

  // Fonction pour obtenir ou générer un UUID basé sur un ID local
  const getOrCreateUUID = (localId: string): string => {
    if (isValidUUID(localId)) return localId;
    
    if (localIdToUUIDMap[localId]) {
      return localIdToUUIDMap[localId];
    }
    
    const newUUID = uuidv4();
    setLocalIdToUUIDMap(prev => ({
      ...prev,
      [localId]: newUUID
    }));
    
    return newUUID;
  };

  // Charger les éléments personnalisés pour une pièce spécifique
  useEffect(() => {
    const loadCustomItems = async () => {
      if (!roomId) {
        // Si pas de roomId, on ne charge rien
        setCustomItems([]);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        // Obtenir l'UUID correspondant pour Supabase
        const supabaseRoomId = getOrCreateUUID(roomId);
        
        const { data, error } = await supabase
          .from('room_custom_items')
          .select('*')
          .eq('room_id', supabaseRoomId);

        if (error) {
          console.error(`Erreur lors du chargement des éléments personnalisés pour la pièce ${roomId}:`, error);
          setError(`Impossible de charger les éléments personnalisés pour cette pièce`);
          toast.error('Impossible de charger les surfaces personnalisées');
          return;
        }
        
        if (data) {
          // S'assurer que les données sont conformes au type RoomCustomItem
          const typedData = data.map(item => ({
            ...item,
            type: item.type || '', // Ajouter type s'il n'existe pas
            designation: item.designation || null, // Ajouter designation s'il n'existe pas
            surface: item.surface || (item.largeur * item.hauteur) // Calculer surface si elle n'existe pas
          })) as RoomCustomItem[];
          
          setCustomItems(typedData);
        } else {
          setCustomItems([]);
        }
      } catch (err) {
        console.error(`Exception lors du chargement des éléments personnalisés:`, err);
        setError(`Une erreur inattendue s'est produite`);
        toast.error('Erreur lors du chargement des données');
      } finally {
        setLoading(false);
      }
    };

    loadCustomItems();
  }, [roomId]);

  // Ajouter un élément personnalisé
  const addCustomItem = async (
    item: Omit<RoomCustomItem, 'id' | 'created_at' | 'updated_at' | 'surface'>
  ): Promise<RoomCustomItem | null> => {
    if (!roomId) {
      toast.error('Aucune pièce sélectionnée');
      return null;
    }

    try {
      setLoading(true);
      
      // Obtenir l'UUID correspondant pour Supabase
      const supabaseRoomId = getOrCreateUUID(roomId);
      
      // Calculer la surface à partir des dimensions
      const surface = item.largeur * item.hauteur;
      
      const newItem = {
        ...item,
        room_id: supabaseRoomId,
        surface // Ajouter la surface calculée
      };
      
      const { data, error } = await supabase
        .from('room_custom_items')
        .insert(newItem)
        .select()
        .single();

      if (error) {
        console.error('Erreur lors de l\'ajout d\'un élément personnalisé:', error);
        toast.error('Impossible d\'ajouter la surface personnalisée');
        return null;
      }
      
      if (data) {
        // S'assurer que les données ont les propriétés requises
        const typedData: RoomCustomItem = {
          ...data,
          type: data.type || '',
          designation: data.designation || null,
          surface: data.surface || surface
        };
        
        // Mettre à jour l'état local
        setCustomItems(prev => [...prev, typedData]);
        
        toast.success('Surface ajoutée avec succès');
        return typedData;
      }
      
      return null;
    } catch (err) {
      console.error('Exception lors de l\'ajout d\'un élément personnalisé:', err);
      toast.error('Une erreur inattendue s\'est produite');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour un élément personnalisé
  const updateCustomItem = async (
    id: string, 
    changes: Partial<Omit<RoomCustomItem, 'id' | 'created_at' | 'updated_at' | 'surface'>>
  ): Promise<RoomCustomItem | null> => {
    try {
      setLoading(true);
      
      // Si les dimensions changent, recalculer la surface
      let updatedChanges = { ...changes };
      
      if (changes.largeur !== undefined || changes.hauteur !== undefined) {
        // Obtenir l'élément courant pour les dimensions manquantes
        const currentItem = customItems.find(item => item.id === id);
        if (currentItem) {
          const largeur = changes.largeur !== undefined ? changes.largeur : currentItem.largeur;
          const hauteur = changes.hauteur !== undefined ? changes.hauteur : currentItem.hauteur;
          updatedChanges.surface = largeur * hauteur;
        }
      }
      
      const { data, error } = await supabase
        .from('room_custom_items')
        .update(updatedChanges)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error(`Erreur lors de la mise à jour de l'élément ${id}:`, error);
        toast.error('Impossible de mettre à jour la surface');
        return null;
      }
      
      if (data) {
        // S'assurer que les données ont les propriétés requises
        const typedData: RoomCustomItem = {
          ...data,
          type: data.type || '',
          designation: data.designation || null,
          surface: data.surface || 0
        };
        
        // Mettre à jour l'état local
        setCustomItems(prev => 
          prev.map(item => item.id === id ? typedData : item)
        );
        
        toast.success('Surface mise à jour avec succès');
        return typedData;
      }
      
      return null;
    } catch (err) {
      console.error(`Exception lors de la mise à jour de l'élément ${id}:`, err);
      toast.error('Une erreur inattendue s\'est produite');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Supprimer un élément personnalisé
  const deleteCustomItem = async (id: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('room_custom_items')
        .delete()
        .eq('id', id);

      if (error) {
        console.error(`Erreur lors de la suppression de l'élément ${id}:`, error);
        toast.error('Impossible de supprimer la surface');
        return false;
      }
      
      // Mettre à jour l'état local
      setCustomItems(prev => prev.filter(item => item.id !== id));
      
      toast.success('Surface supprimée avec succès');
      return true;
      
    } catch (err) {
      console.error(`Exception lors de la suppression de l'élément ${id}:`, err);
      toast.error('Une erreur inattendue s\'est produite');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Récupérer les types d'éléments personnalisés
  const fetchCustomItemTypes = async (): Promise<AutreSurfaceType[]> => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('autres_surfaces_types')
        .select('*');

      if (error) {
        console.error('Erreur lors de la récupération des types d\'éléments personnalisés:', error);
        toast.error('Impossible de charger les types de surfaces');
        return [];
      }
      
      return data || [];
      
    } catch (err) {
      console.error('Exception lors de la récupération des types d\'éléments personnalisés:', err);
      toast.error('Une erreur inattendue s\'est produite');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Synchroniser les surfaces d'un objet AutreSurface[] avec Supabase
  const syncLocalSurfacesToSupabase = async (
    roomId: string,
    localSurfaces: AutreSurface[]
  ): Promise<boolean> => {
    if (!roomId) {
      toast.error('Aucune pièce sélectionnée pour la synchronisation');
      return false;
    }

    try {
      setLoading(true);
      
      // Obtenir l'UUID correspondant pour Supabase
      const supabaseRoomId = getOrCreateUUID(roomId);
      
      // Supprimer d'abord toutes les surfaces existantes pour cette pièce
      const { error: deleteError } = await supabase
        .from('room_custom_items')
        .delete()
        .eq('room_id', supabaseRoomId);
      
      if (deleteError) {
        console.error('Erreur lors de la suppression des surfaces existantes:', deleteError);
        toast.error('Impossible de synchroniser les surfaces');
        return false;
      }
      
      // Si aucune surface locale, on a terminé
      if (!localSurfaces || localSurfaces.length === 0) {
        return true;
      }
      
      // Convertir les surfaces locales au format Supabase
      const supabaseSurfaces = localSurfaces.map(item => {
        const surface_impactee = convertSurfaceImpacteeToEnum(item.surfaceImpactee);
        const adjustment_type = item.estDeduction ? 'Déduire' as AdjustmentType : 'Ajouter' as AdjustmentType;
        
        return {
          room_id: supabaseRoomId,
          type: item.type,
          name: item.name,
          designation: item.designation || null,
          largeur: item.largeur,
          hauteur: item.hauteur,
          surface: item.surface,
          quantity: item.quantity || 1,
          surface_impactee,
          adjustment_type,
          impacte_plinthe: item.impactePlinthe,
          description: item.description || null
        };
      });
      
      // Insérer par lot
      for (let i = 0; i < supabaseSurfaces.length; i += 20) {
        const batch = supabaseSurfaces.slice(i, i + 20);
        
        const { error: insertError } = await supabase
          .from('room_custom_items')
          .insert(batch);
        
        if (insertError) {
          console.error(`Erreur lors de l'insertion des surfaces ${i} à ${i + batch.length}:`, insertError);
          toast.error(`Erreur lors de l'insertion des surfaces ${i} à ${i + batch.length}`);
          return false;
        }
      }
      
      // Rafraîchir les données
      const { data, error } = await supabase
        .from('room_custom_items')
        .select('*')
        .eq('room_id', supabaseRoomId);
      
      if (!error && data) {
        // S'assurer que les données sont conformes au type RoomCustomItem
        const typedData = data.map(item => ({
          ...item,
          type: item.type || '',
          designation: item.designation || null,
          surface: item.surface || (item.largeur * item.hauteur)
        })) as RoomCustomItem[];
        
        setCustomItems(typedData);
      }
      
      return true;
      
    } catch (err) {
      console.error('Exception lors de la synchronisation des surfaces:', err);
      toast.error('Une erreur inattendue s\'est produite');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Fonction utilitaire pour convertir les valeurs de surfaceImpactee en format enum
  const convertSurfaceImpacteeToEnum = (value: string): SurfaceImpactee => {
    switch (value.toLowerCase()) {
      case 'mur':
        return 'Mur';
      case 'plafond':
        return 'Plafond';
      case 'sol':
        return 'Sol';
      default:
        return 'Aucune';
    }
  };

  return {
    customItems,
    loading,
    error,
    addCustomItem,
    updateCustomItem,
    deleteCustomItem,
    fetchCustomItemTypes,
    syncLocalSurfacesToSupabase
  };
};
