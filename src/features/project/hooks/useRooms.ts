
import { useCallback } from 'react';
import { Room, ProjectState, ProjectAction } from '@/types';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { generateRoomName } from '../utils/projectUtils';

/**
 * Hook pour la gestion des pièces dans le projet
 */
export const useRooms = (
  state: ProjectState,
  dispatch: React.Dispatch<ProjectAction>
) => {
  const { rooms } = state;

  /**
   * Ajoute une nouvelle pièce au projet
   */
  const addRoom = useCallback((room: Omit<Room, 'id'>) => {
    // Utiliser la fonction utilitaire pour générer le nom si non spécifié
    let roomData = { ...room };
    if (!roomData.name || roomData.name === '') {
      roomData.name = generateRoomName(rooms, roomData.type);
    }
    
    const newRoom = { ...roomData, id: uuidv4() };
    dispatch({ type: 'ADD_ROOM', payload: newRoom });
    toast.success(`Pièce "${newRoom.name}" ajoutée avec succès`);
    return newRoom;
  }, [dispatch, rooms]);

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
