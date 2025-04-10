
import { useCallback } from 'react';
import { Room } from '@/types';
import { toast } from 'sonner';
import { useProject } from '@/contexts/ProjectContext';
import { v4 as uuidv4 } from 'uuid';

/**
 * Hook pour la gestion des pièces dans le projet
 */
export const useRooms = () => {
  const { state, dispatch } = useProject();
  const { rooms } = state;

  /**
   * Ajoute une nouvelle pièce au projet
   */
  const addRoom = useCallback((room: Omit<Room, 'id'>) => {
    const newRoom = { ...room, id: uuidv4() };
    dispatch({ type: 'ADD_ROOM', payload: newRoom });
    toast.success(`Pièce "${newRoom.name}" ajoutée avec succès`);
    return newRoom;
  }, [dispatch]);

  /**
   * Met à jour une pièce existante
   */
  const updateRoom = useCallback((id: string, room: Room) => {
    dispatch({ type: 'UPDATE_ROOM', payload: { id, room } });
    toast.success(`Pièce "${room.name}" mise à jour avec succès`);
  }, [dispatch]);

  /**
   * Supprime une pièce et tous les travaux associés
   */
  const deleteRoom = useCallback((id: string) => {
    const roomToDelete = rooms.find(room => room.id === id);
    if (!roomToDelete) return;
    
    dispatch({ type: 'DELETE_ROOM', payload: id });
    toast.success(`Pièce "${roomToDelete.name}" supprimée avec succès`);
  }, [dispatch, rooms]);

  return {
    rooms,
    addRoom,
    updateRoom,
    deleteRoom,
  };
};
