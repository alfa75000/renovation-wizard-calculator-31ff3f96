
import { useState, useEffect, useCallback } from 'react';
import { Room } from '@/types';
import { useIndexedDB } from './useIndexedDB';
import { useLogger } from './useLogger';
import db from '@/services/dbService';

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
    deleteItem: deleteRoom,
    syncFromLocalStorage
  } = useIndexedDB<Room>('rooms', LOCAL_STORAGE_KEY);
  
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  
  // Fonction pour initialiser la synchronisation entre localStorage et IndexedDB
  const initializeSync = useCallback(async () => {
    if (!isDbAvailable || isLoading) return;
    
    try {
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
    }
  }, [isDbAvailable, isLoading, syncFromLocalStorage, logger]);
  
  // Initialiser la synchronisation lors du premier chargement
  useEffect(() => {
    if (!isInitialized && isDbAvailable && !isLoading) {
      initializeSync();
    }
  }, [isInitialized, isDbAvailable, isLoading, initializeSync]);
  
  // Méthode simplifiée pour ajouter ou mettre à jour une pièce
  const saveRoom = useCallback(async (room: Room): Promise<void> => {
    if (!room.id) {
      throw new Error('Impossible de sauvegarder une pièce sans ID');
    }
    
    try {
      const existingRoom = await getRoom(room.id);
      if (existingRoom) {
        await updateRoom(room.id, room);
        logger.debug(`Pièce mise à jour: ${room.id}`, 'storage');
      } else {
        await addRoom(room);
        logger.debug(`Nouvelle pièce ajoutée: ${room.id}`, 'storage');
      }
    } catch (err) {
      logger.error('Erreur lors de la sauvegarde d\'une pièce', err as Error, 'storage');
      throw err;
    }
  }, [addRoom, updateRoom, getRoom, logger]);
  
  return {
    isDbAvailable,
    isLoading,
    isInitialized,
    error,
    getAllRooms,
    getRoom,
    saveRoom,
    deleteRoom,
    syncFromLocalStorage
  };
}
