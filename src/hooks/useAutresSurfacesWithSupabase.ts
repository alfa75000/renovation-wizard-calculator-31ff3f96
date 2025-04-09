
import { useState, useEffect } from 'react';
import { AutreSurface, TypeAutreSurface } from '@/types';
import { 
  getAutresSurfacesTypes, 
  getAutresSurfacesForRoom, 
  addAutreSurfaceToRoom, 
  updateAutreSurface, 
  deleteAutreSurface 
} from '@/services/autresSurfacesService';
import { toast } from 'sonner';
import { isValidUUID } from '@/lib/utils';

export const useAutresSurfacesWithSupabase = (roomId?: string) => {
  const [autresSurfaces, setAutresSurfaces] = useState<AutreSurface[]>([]);
  const [typesAutresSurfaces, setTypesAutresSurfaces] = useState<TypeAutreSurface[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Charger les types d'autres surfaces
  useEffect(() => {
    const loadTypes = async () => {
      try {
        setLoading(true);
        const types = await getAutresSurfacesTypes();
        setTypesAutresSurfaces(types);
      } catch (err) {
        console.error('Erreur lors du chargement des types d\'autres surfaces:', err);
        setError('Impossible de charger les types d\'autres surfaces');
        toast.error('Impossible de charger les types de surfaces');
      } finally {
        setLoading(false);
      }
    };

    loadTypes();
  }, []);

  // Charger les autres surfaces pour une pièce spécifique
  useEffect(() => {
    const loadAutresSurfaces = async () => {
      if (!roomId) return;
      
      // Vérifier si l'ID de pièce est un UUID valide
      if (!isValidUUID(roomId)) {
        console.warn(`ID de pièce invalide (pas un UUID): ${roomId}. Les données ne seront pas chargées.`);
        setAutresSurfaces([]);
        return;
      }
      
      try {
        setLoading(true);
        const surfaces = await getAutresSurfacesForRoom(roomId);
        setAutresSurfaces(surfaces);
      } catch (err) {
        console.error(`Erreur lors du chargement des autres surfaces pour la pièce ${roomId}:`, err);
        setError(`Impossible de charger les autres surfaces pour cette pièce`);
        toast.error('Impossible de charger les surfaces personnalisées');
      } finally {
        setLoading(false);
      }
    };

    loadAutresSurfaces();
  }, [roomId]);

  // Ajouter une autre surface
  const addAutreSurface = async (
    surface: Omit<AutreSurface, 'id' | 'surface'>, 
    quantity: number = 1
  ): Promise<AutreSurface[]> => {
    if (!roomId) {
      toast.error('Aucune pièce sélectionnée');
      return [];
    }

    // Vérifier si l'ID de pièce est un UUID valide
    if (!isValidUUID(roomId)) {
      toast.error('ID de pièce invalide. Impossible d\'ajouter une surface.');
      return [];
    }

    try {
      setLoading(true);
      
      const newSurfaces: AutreSurface[] = [];
      
      // Ajouter la quantité spécifiée
      for (let i = 0; i < quantity; i++) {
        const newSurface = await addAutreSurfaceToRoom(roomId, surface);
        newSurfaces.push(newSurface);
      }
      
      // Mettre à jour l'état local
      setAutresSurfaces((prev) => [...prev, ...newSurfaces]);
      
      toast.success(`${quantity} surface(s) ajoutée(s) avec succès`);
      return newSurfaces;
      
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
    if (!isValidUUID(id)) {
      toast.error('ID de surface invalide. Impossible de mettre à jour.');
      return null;
    }

    try {
      setLoading(true);
      
      const updatedSurface = await updateAutreSurface(id, changes);
      
      // Mettre à jour l'état local
      setAutresSurfaces((prev) => 
        prev.map((item) => item.id === id ? updatedSurface : item)
      );
      
      toast.success('Surface mise à jour avec succès');
      return updatedSurface;
      
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
    if (!isValidUUID(id)) {
      toast.error('ID de surface invalide. Impossible de supprimer.');
      return;
    }

    try {
      setLoading(true);
      
      await deleteAutreSurface(id);
      
      // Mettre à jour l'état local
      setAutresSurfaces((prev) => prev.filter((item) => item.id !== id));
      
      toast.success('Surface supprimée avec succès');
      
    } catch (err) {
      console.error(`Erreur lors de la suppression de la surface ${id}:`, err);
      toast.error('Impossible de supprimer la surface');
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
    deleteAutreSurfaceItem
  };
};

