
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

  // Convertir les données Supabase en RoomCustomItem
  const mapToRoomCustomItem = (item: any): RoomCustomItem => {
    return {
      id: item.id,
      created_at: item.created_at,
      room_id: item.room_id,
      name: item.name,
      hauteur: item.hauteur,
      largeur: item.largeur,
      quantity: item.quantity,
      surface_impactee: item.surface_impactee,
      adjustment_type: item.adjustment_type,
      impacte_plinthe: item.impacte_plinthe,
      description: item.description,
      updated_at: item.updated_at,
      source_type_id: item.source_type_id,
      // Champs calculés ou ajoutés pour compatibilité
      type: item.type || 'autre',
      designation: item.designation || item.name,
      surface: item.largeur * item.hauteur,
      // Champs de compatibilité avec l'ancien modèle
      estDeduction: item.adjustment_type === 'Déduire',
      surfaceImpactee: item.surface_impactee.toLowerCase()
    };
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
        
        const mappedItems = data ? data.map(mapToRoomCustomItem) : [];
        setCustomItems(mappedItems);
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
    item: Omit<RoomCustomItem, 'id' | 'created_at' | 'updated_at' | 'surface' | 'designation' | 'type' | 'estDeduction' | 'surfaceImpactee'>
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
        room_id: supabaseRoomId,
        updated_at: new Date().toISOString() // Ajout du champ updated_at manquant
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
      
      // Convertir le résultat et mettre à jour l'état local
      const mappedItem = mapToRoomCustomItem(data);
      setCustomItems(prev => [...prev, mappedItem]);
      
      toast.success('Surface ajoutée avec succès');
      return mappedItem;
      
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
    changes: Partial<Omit<RoomCustomItem, 'id' | 'created_at' | 'updated_at' | 'surface' | 'designation' | 'type' | 'estDeduction' | 'surfaceImpactee'>>
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
      
      // Convertir le résultat et mettre à jour l'état local
      const mappedItem = mapToRoomCustomItem(data);
      setCustomItems(prev => 
        prev.map(item => item.id === id ? mappedItem : item)
      );
      
      toast.success('Surface mise à jour avec succès');
      return mappedItem;
      
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
      
      // Préparer les objets à insérer avec le bon typage
      const supabaseSurfaces = localSurfaces.map(item => ({
        room_id: supabaseRoomId,
        name: item.name,
        largeur: item.largeur,
        hauteur: item.hauteur,
        quantity: item.quantity || 1,
        surface_impactee: (item.surfaceImpactee === 'mur' ? 'Mur' : 
                      item.surfaceImpactee === 'plafond' ? 'Plafond' : 
                      item.surfaceImpactee === 'sol' ? 'Sol' : 'Aucune') as SurfaceImpactee,
        adjustment_type: (item.estDeduction ? 'Déduire' : 'Ajouter') as AdjustmentType,
        impacte_plinthe: item.impactePlinthe,
        description: item.description || null,
        updated_at: new Date().toISOString() // Ajout du champ updated_at manquant
      }));
      
      // Insérer les items un par un pour éviter les problèmes de typage
      for (const surface of supabaseSurfaces) {
        const { error: insertError } = await supabase
          .from('room_custom_items')
          .insert(surface);
          
        if (insertError) {
          console.error('Erreur lors de l\'insertion de la surface:', insertError);
          toast.error('Erreur lors de la synchronisation d\'une surface');
        }
      }
      
      // Rafraîchir les données
      const { data, error } = await supabase
        .from('room_custom_items')
        .select('*')
        .eq('room_id', supabaseRoomId);
      
      if (!error && data) {
        const mappedItems = data.map(mapToRoomCustomItem);
        setCustomItems(mappedItems);
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
