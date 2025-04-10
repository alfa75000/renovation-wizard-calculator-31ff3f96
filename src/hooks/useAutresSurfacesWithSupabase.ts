
import { useState, useEffect } from 'react';
import { AutreSurface, TypeAutreSurface } from '@/types';
import { RoomCustomItem, SurfaceImpactee, AdjustmentType } from '@/types/supabase';
import { useRoomCustomItemsWithSupabase } from '@/hooks/useRoomCustomItemsWithSupabase';
import { toast } from 'sonner';
import { isValidUUID } from '@/lib/utils';

/**
 * Hook pour fournir une transition entre l'ancien système et le nouveau
 * basé sur Supabase
 */
export const useAutresSurfacesWithSupabase = (roomId?: string) => {
  const [autresSurfaces, setAutresSurfaces] = useState<AutreSurface[]>([]);
  const [typesAutresSurfaces, setTypesAutresSurfaces] = useState<TypeAutreSurface[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Utiliser le hook Supabase pour les opérations
  const {
    customItems,
    loading: itemsLoading,
    error: itemsError,
    addCustomItem,
    updateCustomItem,
    deleteCustomItem,
    fetchCustomItemTypes,
    syncLocalSurfacesToSupabase
  } = useRoomCustomItemsWithSupabase(roomId);

  // Convertir un RoomCustomItem (Supabase) en AutreSurface (local)
  const convertToAutreSurface = (item: RoomCustomItem): AutreSurface => {
    return {
      id: item.id,
      type: item.type,
      name: item.name,
      designation: item.designation || item.name,
      largeur: item.largeur,
      hauteur: item.hauteur,
      surface: item.surface,
      quantity: item.quantity,
      surfaceImpactee: item.surface_impactee.toLowerCase() as any,
      estDeduction: item.adjustment_type === 'Déduire',
      impactePlinthe: item.impacte_plinthe,
      description: item.description || ''
    };
  };

  // Convertir les customItems en autresSurfaces pour compatibilité
  useEffect(() => {
    if (customItems) {
      const convertedItems: AutreSurface[] = customItems.map(convertToAutreSurface);
      setAutresSurfaces(convertedItems);
    }
    
    setLoading(itemsLoading);
    setError(itemsError);
  }, [customItems, itemsLoading, itemsError]);

  // Charger les types d'autres surfaces
  useEffect(() => {
    const loadTypes = async () => {
      try {
        setLoading(true);
        const typesData = await fetchCustomItemTypes();
        
        // Convertir au format attendu
        const convertedTypes: TypeAutreSurface[] = typesData.map(item => ({
          id: item.id,
          nom: item.name,
          description: item.description || '',
          largeur: item.largeur || 0,
          hauteur: item.hauteur || 0,
          surfaceImpacteeParDefaut: item.surface_impactee.toLowerCase() as any,
          estDeduction: item.adjustment_type === 'Déduire',
          impactePlinthe: item.impacte_plinthe
        }));
        
        setTypesAutresSurfaces(convertedTypes);
      } catch (err) {
        console.error('Erreur lors du chargement des types d\'autres surfaces:', err);
        setError('Impossible de charger les types d\'autres surfaces');
      } finally {
        setLoading(false);
      }
    };

    loadTypes();
  }, []);

  // Ajouter une autre surface
  const addAutreSurface = async (
    surface: Omit<AutreSurface, 'id' | 'surface'>, 
    quantity: number = 1
  ): Promise<AutreSurface[]> => {
    if (!roomId) {
      toast.error('Aucune pièce sélectionnée');
      return [];
    }

    try {
      setLoading(true);
      
      const newItems: AutreSurface[] = [];
      
      // Ajouter la quantité spécifiée
      for (let i = 0; i < quantity; i++) {
        // Convertir au format RoomCustomItem
        const newItemData = {
          room_id: roomId,
          name: surface.name,
          hauteur: surface.hauteur,
          largeur: surface.largeur,
          quantity: surface.quantity || 1,
          surface_impactee: (surface.surfaceImpactee === 'mur' ? 'Mur' : 
                          surface.surfaceImpactee === 'plafond' ? 'Plafond' : 
                          surface.surfaceImpactee === 'sol' ? 'Sol' : 'Aucune') as SurfaceImpactee,
          adjustment_type: (surface.estDeduction ? 'Déduire' : 'Ajouter') as AdjustmentType,
          impacte_plinthe: surface.impactePlinthe,
          description: surface.description || null
        };
        
        const newItem = await addCustomItem(newItemData);
        
        if (newItem) {
          // Convertir de nouveau au format AutreSurface
          newItems.push(convertToAutreSurface(newItem));
        }
      }
      
      return newItems;
    } catch (err) {
      console.error('Erreur lors de l\'ajout de surface(s):', err);
      toast.error('Impossible d\'ajouter la surface');
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Mettre à jour une autre surface
  const updateAutreSurfaceItem = async (
    id: string, 
    changes: Partial<Omit<AutreSurface, 'id' | 'surface'>>
  ): Promise<AutreSurface | null> => {
    try {
      setLoading(true);
      
      // Convertir au format RoomCustomItem
      const updateData: any = {};
      
      // Copier les champs standards qui ont le même nom
      if (changes.name !== undefined) updateData.name = changes.name;
      if (changes.largeur !== undefined) updateData.largeur = changes.largeur;
      if (changes.hauteur !== undefined) updateData.hauteur = changes.hauteur;
      if (changes.quantity !== undefined) updateData.quantity = changes.quantity;
      if (changes.description !== undefined) updateData.description = changes.description;
      
      // Convertir spécifiquement les champs qui ont un nom différent
      if (changes.surfaceImpactee !== undefined) {
        updateData.surface_impactee = (changes.surfaceImpactee === 'mur' ? 'Mur' : 
                                     changes.surfaceImpactee === 'plafond' ? 'Plafond' : 
                                     changes.surfaceImpactee === 'sol' ? 'Sol' : 'Aucune') as SurfaceImpactee;
      }
      
      if (changes.estDeduction !== undefined) {
        updateData.adjustment_type = (changes.estDeduction ? 'Déduire' : 'Ajouter') as AdjustmentType;
      }
      
      if (changes.impactePlinthe !== undefined) {
        updateData.impacte_plinthe = changes.impactePlinthe;
      }
      
      const updatedItem = await updateCustomItem(id, updateData);
      
      if (!updatedItem) return null;
      
      // Convertir de nouveau au format AutreSurface
      return convertToAutreSurface(updatedItem);
    } catch (err) {
      console.error(`Erreur lors de la mise à jour de la surface ${id}:`, err);
      toast.error('Impossible de mettre à jour la surface');
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Supprimer une autre surface
  const deleteAutreSurfaceItem = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      await deleteCustomItem(id);
    } catch (err) {
      console.error(`Erreur lors de la suppression de la surface ${id}:`, err);
      toast.error('Impossible de supprimer la surface');
    } finally {
      setLoading(false);
    }
  };

  // Synchroniser des surfaces locales avec Supabase
  const synchronizeLocalSurfaces = async (roomId: string, localSurfaces: AutreSurface[]): Promise<boolean> => {
    if (!roomId) {
      console.error("Impossible de synchroniser sans ID de pièce");
      return false;
    }
    
    try {
      setLoading(true);
      return await syncLocalSurfacesToSupabase(roomId, localSurfaces);
    } catch (err) {
      console.error("Erreur lors de la synchronisation des surfaces:", err);
      toast.error("Erreur lors de la synchronisation des surfaces");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    autresSurfaces,
    typesAutresSurfaces,
    loading,
    error,
    addAutreSurface,
    updateAutreSurfaceItem,
    deleteAutreSurfaceItem,
    synchronizeLocalSurfaces
  };
};
