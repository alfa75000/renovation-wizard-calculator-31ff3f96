
import { useCallback } from 'react';
import { Room, ProjectState, ProjectAction } from '@/types';
import { v4 as uuidv4 } from 'uuid';

/**
 * Hook pour gérer les pièces dans le projet
 * @param state État actuel du projet
 * @param dispatch Fonction dispatch pour mettre à jour l'état
 */
export const useRooms = (
  state: ProjectState,
  dispatch: React.Dispatch<ProjectAction>
) => {
  const rooms = state.rooms;

  // Ajouter une nouvelle pièce
  const addRoom = useCallback((room: Omit<Room, 'id'>) => {
    const newRoom = {
      ...room,
      id: uuidv4()
    };
    
    dispatch({
      type: 'ADD_ROOM',
      payload: newRoom
    });
    
    console.log('Room added:', newRoom);
    return newRoom;
  }, [dispatch]);

  // Mettre à jour une pièce existante
  const updateRoom = useCallback((id: string, room: Partial<Room>) => {
    dispatch({
      type: 'UPDATE_ROOM',
      payload: { id, room: { ...room, id } as Room }
    });
    
    console.log('Room updated:', id);
  }, [dispatch]);

  // Supprimer une pièce
  const deleteRoom = useCallback((id: string) => {
    dispatch({
      type: 'DELETE_ROOM',
      payload: id
    });
    
    console.log('Room deleted:', id);
  }, [dispatch]);

  return {
    rooms,
    addRoom,
    updateRoom,
    deleteRoom
  };
};
