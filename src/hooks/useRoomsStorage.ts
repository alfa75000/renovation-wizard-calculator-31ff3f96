
import { useState, useEffect, useCallback } from 'react';
import { Room } from '@/types';
import { useIndexedDB } from './useIndexedDB';
import { useLogger } from './useLogger';
import { toast } from 'sonner';

/**
 * Hook personnalisé pour gérer le stockage des pièces avec IndexedDB et fallback localStorage
 */
export function useRoomsStorage() {
  const logger = useLogger('useRoomsStorage');
  const LOCAL_STORAGE_KEY = 'rooms';
  
  const {
    isDbAvailable,
    isLoading,
    error,
    getAllItems: getAllRooms,
    getItem: getRoom,
    addItem: addRoom,
    updateItem: updateRoom,
    deleteItem: deleteRoomInternal,
    clearItems: clearRooms,
    syncFromLocalStorage
  } = useIndexedDB<Room>('rooms', LOCAL_STORAGE_KEY);
  
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [isSilentOperation, setIsSilentOperation] = useState<boolean>(false);
  
  // Fonction pour initialiser la synchronisation entre localStorage et IndexedDB
  const initializeSync = useCallback(async () => {
    if (!isDbAvailable || isLoading) return;
    
    try {
      setIsSilentOperation(true);
      // Récupérer les pièces depuis localStorage
      const roomsJson = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (roomsJson) {
        const rooms = JSON.parse(roomsJson) as Room[];
        if (Array.isArray(rooms) && rooms.length > 0) {
          // Synchroniser avec IndexedDB
          await syncFromLocalStorage(rooms);
          logger.info(`${rooms.length} pièces synchronisées depuis localStorage vers IndexedDB`, 'storage');
        } else {
          logger.info('Aucune pièce trouvée dans localStorage pour synchronisation', 'storage');
        }
      }
      
      setIsInitialized(true);
    } catch (error) {
      logger.error('Erreur lors de l\'initialisation de la synchronisation des pièces', error as Error, 'storage');
    } finally {
      setIsSilentOperation(false);
    }
  }, [isDbAvailable, isLoading, syncFromLocalStorage, logger]);
  
  // Initialiser la synchronisation lors du premier chargement
  useEffect(() => {
    if (!isInitialized && isDbAvailable && !isLoading) {
      initializeSync();
    }
  }, [isInitialized, isDbAvailable, isLoading, initializeSync]);
  
  // Méthode simplifiée pour ajouter ou mettre à jour une pièce
  const saveRoom = useCallback(async (room: Room, silent = false): Promise<void> => {
    if (!room.id) {
      throw new Error('Impossible de sauvegarder une pièce sans ID');
    }
    
    const prevSilentState = isSilentOperation;
    if (silent) setIsSilentOperation(true);
    
    try {
      const existingRoom = await getRoom(room.id);
      if (existingRoom) {
        await updateRoom(room.id, room);
        logger.debug(`Pièce mise à jour: ${room.id}`, 'storage');
        if (!isSilentOperation) {
          toast.success(`Pièce mise à jour: ${room.name}`);
        }
      } else {
        await addRoom(room);
        logger.debug(`Nouvelle pièce ajoutée: ${room.id}`, 'storage');
        if (!isSilentOperation) {
          toast.success(`Nouvelle pièce ajoutée: ${room.name}`);
        }
      }
    } catch (err) {
      logger.error('Erreur lors de la sauvegarde d\'une pièce', err as Error, 'storage');
      if (!isSilentOperation) {
        toast.error(`Erreur lors de la sauvegarde de la pièce: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
      }
      throw err;
    } finally {
      if (silent) setIsSilentOperation(prevSilentState);
    }
  }, [addRoom, updateRoom, getRoom, logger, isSilentOperation]);
  
  // Méthode pour supprimer une pièce
  const deleteRoom = useCallback(async (id: string, silent = false): Promise<void> => {
    const prevSilentState = isSilentOperation;
    if (silent) setIsSilentOperation(true);
    
    try {
      const roomToDelete = await getRoom(id);
      if (roomToDelete) {
        await deleteRoomInternal(id);
        logger.info(`Pièce supprimée: ${id}`, 'storage');
        if (!isSilentOperation) {
          toast.success(`Pièce supprimée: ${roomToDelete.name}`);
        }
      } else {
        logger.warn(`Tentative de suppression d'une pièce inexistante: ${id}`, 'storage');
      }
    } catch (err) {
      logger.error(`Erreur lors de la suppression de la pièce ${id}`, err as Error, 'storage');
      if (!isSilentOperation) {
        toast.error(`Erreur lors de la suppression de la pièce: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
      }
      throw err;
    } finally {
      if (silent) setIsSilentOperation(prevSilentState);
    }
  }, [deleteRoomInternal, getRoom, logger, isSilentOperation]);
  
  // Méthode pour supprimer toutes les pièces 
  const resetRooms = useCallback(async (silent = false): Promise<void> => {
    const prevSilentState = isSilentOperation;
    if (silent) setIsSilentOperation(true);
    
    try {
      await clearRooms();
      logger.info('Toutes les pièces ont été supprimées', 'storage');
      if (!isSilentOperation) {
        toast.success('Toutes les pièces ont été supprimées');
      }
    } catch (err) {
      logger.error('Erreur lors de la suppression de toutes les pièces', err as Error, 'storage');
      if (!isSilentOperation) {
        toast.error(`Erreur lors de la suppression des pièces: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
      }
      throw err;
    } finally {
      if (silent) setIsSilentOperation(prevSilentState);
    }
  }, [clearRooms, logger, isSilentOperation]);
  
  return {
    isDbAvailable,
    isLoading,
    isInitialized,
    error,
    getAllRooms,
    getRoom,
    saveRoom,
    deleteRoom,
    clearRooms,
    resetRooms,
    syncFromLocalStorage,
    setSilentOperation: setIsSilentOperation
  };
}
