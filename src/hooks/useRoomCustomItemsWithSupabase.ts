
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { RoomCustomItem, SurfaceImpactee } from '@/types/supabase';
import { toast } from 'sonner';
import { isValidUUID } from '@/lib/utils';

/**
 * Hook pour gérer les éléments personnalisés d'une pièce (autres surfaces)
 * via Supabase
 */
export const useRoomCustomItemsWithSupabase = (roomId?: string) => {
  const [customItems, setCustomItems] = useState<RoomCustomItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Charger les éléments personnalisés pour une pièce spécifique
  useEffect(() => {
    const loadCustomItems = async () => {
      if (!roomId) return;
      
      // Vérifier si l'ID de pièce est un UUID valide pour Supabase
      // On désactive cette vérification stricte car nos IDs locaux peuvent ne pas être des UUIDs
      // if (!isValidUUID(roomId)) {
      //   console.warn(`ID de pièce non conforme au format UUID: ${roomId}. Les données ne seront pas chargées.`);
      //   setCustomItems([]);
      //   return;
      // }
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('room_custom_items')
          .select('*')
          .eq('room_id', roomId);

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

    // On désactive cette vérification stricte car nos IDs locaux peuvent ne pas être des UUIDs
    // if (!isValidUUID(roomId)) {
    //   toast.error('ID de pièce invalide. Impossible d\'ajouter un élément.');
    //   return null;
    // }

    try {
      setLoading(true);
      
      const newItem = {
        ...item,
        room_id: roomId
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
    // On désactive la vérification stricte pour les UUID
    // if (!isValidUUID(id)) {
    //   toast.error('ID d\'élément invalide. Impossible de mettre à jour.');
    //   return null;
    // }

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
    // On désactive la vérification stricte pour les UUID
    // if (!isValidUUID(id)) {
    //   toast.error('ID d\'élément invalide. Impossible de supprimer.');
    //   return false;
    // }

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

  return {
    customItems,
    loading,
    error,
    addCustomItem,
    updateCustomItem,
    deleteCustomItem,
    fetchCustomItemTypes
  };
};
