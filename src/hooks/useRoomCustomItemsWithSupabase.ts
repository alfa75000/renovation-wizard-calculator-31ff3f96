
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RoomCustomItem, SurfaceImpactee, AdjustmentType } from '@/types/supabase';
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
        
        setCustomItems(data || []);
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
    item: Omit<RoomCustomItem, 'id' | 'created_at'>
  ): Promise<RoomCustomItem | null> => {
    if (!roomId) {
      toast.error('Aucune pièce sélectionnée');
      return null;
    }

    try {
      setLoading(true);
      
      // Obtenir l'UUID correspondant pour Supabase
      const supabaseRoomId = getOrCreateUUID(roomId);
      
      const newItem = {
        ...item,
        room_id: supabaseRoomId
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
      
      // Mettre à jour l'état local
      setCustomItems(prev => [...prev, data]);
      
      toast.success('Surface ajoutée avec succès');
      return data;
      
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
    changes: Partial<Omit<RoomCustomItem, 'id' | 'created_at'>>
  ): Promise<RoomCustomItem | null> => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('room_custom_items')
        .update(changes)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error(`Erreur lors de la mise à jour de l'élément ${id}:`, error);
        toast.error('Impossible de mettre à jour la surface');
        return null;
      }
      
      // Mettre à jour l'état local
      setCustomItems(prev => 
        prev.map(item => item.id === id ? data : item)
      );
      
      toast.success('Surface mise à jour avec succès');
      return data;
      
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
  const fetchCustomItemTypes = async (): Promise<any[]> => {
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
      const supabaseSurfaces = localSurfaces.map(item => ({
        room_id: supabaseRoomId,
        type: item.type,
        name: item.name,
        designation: item.designation,
        largeur: item.largeur,
        hauteur: item.hauteur,
        surface: item.surface,
        quantity: item.quantity || 1,
        surface_impactee: convertSurfaceImpacteeToEnum(item.surfaceImpactee),
        adjustment_type: item.estDeduction ? 'Déduire' : 'Ajouter',
        impacte_plinthe: item.impactePlinthe,
        description: item.description || null
      }));
      
      // Insérer les nouvelles surfaces
      const { error: insertError } = await supabase
        .from('room_custom_items')
        .insert(supabaseSurfaces);
      
      if (insertError) {
        console.error('Erreur lors de l\'insertion des nouvelles surfaces:', insertError);
        toast.error('Impossible de synchroniser toutes les surfaces');
        return false;
      }
      
      // Rafraîchir les données
      const { data, error } = await supabase
        .from('room_custom_items')
        .select('*')
        .eq('room_id', supabaseRoomId);
      
      if (!error && data) {
        setCustomItems(data);
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
