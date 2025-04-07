
import { useState, useEffect, useCallback } from 'react';
import { Room } from '@/types';
import { useIndexedDB } from './useIndexedDB';
import { useLogger } from './useLogger';
import { toast } from 'sonner';
import { useSilentOperation } from './useSilentOperation';

/**
 * Hook personnalisé pour gérer le stockage des pièces avec IndexedDB et fallback localStorage
 */
export function useRoomsStorage() {
  const logger = useLogger('useRoomsStorage');
  const LOCAL_STORAGE_KEY = 'rooms';
  const { isSilent, runSilently } = useSilentOperation();
  
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
  const [lastOperation, setLastOperation] = useState<{type: string, id?: string, timestamp: number} | null>(null);
  
  // Fonction pour initialiser la synchronisation entre localStorage et IndexedDB
  const initializeSync = useCallback(async () => {
    if (!isDbAvailable || isLoading) return;
    
    try {
      // Récupérer les pièces depuis localStorage
      const roomsJson = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (roomsJson) {
        try {
          const rooms = JSON.parse(roomsJson) as Room[];
          if (Array.isArray(rooms) && rooms.length > 0) {
            // Synchroniser avec IndexedDB
            await runSilently(() => syncFromLocalStorage(rooms));
            logger.info(`${rooms.length} pièces synchronisées depuis localStorage vers IndexedDB`, 'storage');
          } else {
            logger.info('Aucune pièce trouvée dans localStorage pour synchronisation', 'storage');
          }
        } catch (parseError) {
          logger.error('Erreur de parsing JSON depuis localStorage', parseError as Error, 'storage');
        }
      }
      
      setIsInitialized(true);
    } catch (error) {
      logger.error('Erreur lors de l\'initialisation de la synchronisation des pièces', error as Error, 'storage');
    }
  }, [isDbAvailable, isLoading, syncFromLocalStorage, logger, runSilently]);
  
  // Initialiser la synchronisation lors du premier chargement
  useEffect(() => {
    if (!isInitialized && isDbAvailable && !isLoading) {
      initializeSync();
    }
  }, [isInitialized, isDbAvailable, isLoading, initializeSync]);
  
  // Éviter les opérations en double avec un délai minimum
  const canPerformOperation = useCallback((type: string, id?: string, minDelay: number = 500): boolean => {
    if (!lastOperation) return true;
    
    const now = Date.now();
    return (
      lastOperation.type !== type || 
      lastOperation.id !== id || 
      (now - lastOperation.timestamp) > minDelay
    );
  }, [lastOperation]);
  
  // Méthode simplifiée pour ajouter ou mettre à jour une pièce
  const saveRoom = useCallback(async (room: Room, silent = false): Promise<void> => {
    if (!room.id) {
      throw new Error('Impossible de sauvegarder une pièce sans ID');
    }
    
    // Éviter les opérations en double
    if (!canPerformOperation('save', room.id)) {
      logger.debug(`Opération ignorée (délai trop court): saveRoom ${room.id}`, 'storage');
      return;
    }
    
    try {
      const existingRoom = await getRoom(room.id);
      
      if (existingRoom) {
        await updateRoom(room.id, room);
        logger.debug(`Pièce mise à jour: ${room.id}`, 'storage');
        if (!silent && !isSilent) {
          toast.success(`Pièce mise à jour: ${room.name}`);
        }
      } else {
        await addRoom(room);
        logger.debug(`Nouvelle pièce ajoutée: ${room.id}`, 'storage');
        if (!silent && !isSilent) {
          toast.success(`Nouvelle pièce ajoutée: ${room.name}`);
        }
      }
      
      setLastOperation({
        type: 'save',
        id: room.id,
        timestamp: Date.now()
      });
    } catch (err) {
      logger.error('Erreur lors de la sauvegarde d\'une pièce', err as Error, 'storage');
      if (!silent && !isSilent) {
        toast.error(`Erreur lors de la sauvegarde de la pièce: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
      }
      throw err;
    }
  }, [addRoom, updateRoom, getRoom, logger, isSilent, canPerformOperation]);
  
  // Méthode pour supprimer une pièce
  const deleteRoom = useCallback(async (id: string, silent = false): Promise<void> => {
    // Éviter les opérations en double
    if (!canPerformOperation('delete', id)) {
      logger.debug(`Opération ignorée (délai trop court): deleteRoom ${id}`, 'storage');
      return;
    }
    
    try {
      const roomToDelete = await getRoom(id);
      if (roomToDelete) {
        await deleteRoomInternal(id);
        logger.info(`Pièce supprimée: ${id}`, 'storage');
        
        // Assurer que localStorage est également mis à jour
        try {
          const storedRooms = localStorage.getItem(LOCAL_STORAGE_KEY);
          if (storedRooms) {
            const rooms = JSON.parse(storedRooms) as Room[];
            const updatedRooms = rooms.filter(r => r.id !== id);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedRooms));
          }
        } catch (localError) {
          logger.error(`Erreur lors de la mise à jour de localStorage après suppression: ${id}`, localError as Error, 'storage');
        }
        
        if (!silent && !isSilent) {
          toast.success(`Pièce supprimée: ${roomToDelete.name}`);
        }
      } else {
        logger.warn(`Tentative de suppression d'une pièce inexistante: ${id}`, 'storage');
      }
      
      setLastOperation({
        type: 'delete',
        id,
        timestamp: Date.now()
      });
    } catch (err) {
      logger.error(`Erreur lors de la suppression de la pièce ${id}`, err as Error, 'storage');
      if (!silent && !isSilent) {
        toast.error(`Erreur lors de la suppression de la pièce: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
      }
      throw err;
    }
  }, [deleteRoomInternal, getRoom, logger, isSilent, canPerformOperation]);
  
  // Méthode pour supprimer toutes les pièces 
  const resetRooms = useCallback(async (silent = false): Promise<void> => {
    // Éviter les opérations en double
    if (!canPerformOperation('reset')) {
      logger.debug(`Opération ignorée (délai trop court): resetRooms`, 'storage');
      return;
    }
    
    try {
      await clearRooms();
      
      // Assurer que localStorage est également mis à jour
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      
      logger.info('Toutes les pièces ont été supprimées', 'storage');
      if (!silent && !isSilent) {
        toast.success('Toutes les pièces ont été supprimées');
      }
      
      setLastOperation({
        type: 'reset',
        timestamp: Date.now()
      });
    } catch (err) {
      logger.error('Erreur lors de la suppression de toutes les pièces', err as Error, 'storage');
      if (!silent && !isSilent) {
        toast.error(`Erreur lors de la suppression des pièces: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
      }
      throw err;
    }
  }, [clearRooms, logger, isSilent, canPerformOperation]);
  
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
    runSilently
  };
}
