
import { useState, useEffect, useCallback } from 'react';
import { Room } from '@/types';
import { useLogger } from './useLogger';
import { useIndexedDB } from './useIndexedDB';
import { toast } from 'sonner';
import { useSilentOperation } from './useSilentOperation';

export const useRoomsStorage = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const { db, isDbAvailable, isLoading, error } = useIndexedDB();
  const logger = useLogger('RoomsStorage');
  const { isSilent, setSilentOperation, runSilently } = useSilentOperation();

  // Initialiser la base de données
  useEffect(() => {
    if (db && !isInitialized) {
      const initializeDB = async () => {
        try {
          if (!db.objectStoreNames.contains('rooms')) {
            // Cette méthode ne sera pas appelée car la table est créée à l'initialisation de IndexedDB
            // Mais c'est une bonne pratique de le vérifier
            logger.info('Table "rooms" créée dans IndexedDB');
          }
          setIsInitialized(true);
        } catch (error) {
          logger.error('Erreur lors de l\'initialisation de la table "rooms"', error as Error);
        }
      };

      initializeDB();
    }
  }, [db, isInitialized, logger]);

  const getAllRooms = useCallback(async (): Promise<Room[]> => {
    if (!db || !isDbAvailable) {
      logger.warn('IndexedDB non disponible pour getAllRooms');
      return [];
    }

    try {
      const transaction = db.transaction('rooms', 'readonly');
      const store = transaction.objectStore('rooms');
      const request = store.getAll();

      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          logger.info(`${request.result.length} pièces récupérées depuis IndexedDB`);
          resolve(request.result as Room[]);
        };
        request.onerror = () => {
          logger.error('Erreur lors de la récupération des pièces', request.error);
          reject(request.error);
        };
      });
    } catch (error) {
      logger.error('Erreur lors de l\'accès à IndexedDB pour getAllRooms', error as Error);
      return [];
    }
  }, [db, isDbAvailable, logger]);

  const getRoom = useCallback(async (id: string): Promise<Room | null> => {
    if (!db || !isDbAvailable) {
      logger.warn('IndexedDB non disponible pour getRoom');
      return null;
    }

    try {
      const transaction = db.transaction('rooms', 'readonly');
      const store = transaction.objectStore('rooms');
      const request = store.get(id);

      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          if (request.result) {
            logger.info(`Pièce ${id} récupérée depuis IndexedDB`);
            resolve(request.result as Room);
          } else {
            logger.warn(`Pièce ${id} non trouvée dans IndexedDB`);
            resolve(null);
          }
        };
        request.onerror = () => {
          logger.error(`Erreur lors de la récupération de la pièce ${id}`, request.error);
          reject(request.error);
        };
      });
    } catch (error) {
      logger.error(`Erreur lors de l'accès à IndexedDB pour getRoom ${id}`, error as Error);
      return null;
    }
  }, [db, isDbAvailable, logger]);

  const saveRoom = useCallback(async (room: Room, silent: boolean = false): Promise<Room> => {
    if (!db || !isDbAvailable) {
      logger.warn('IndexedDB non disponible pour saveRoom');
      if (!silent) toast.error('Erreur de stockage : la base de données n\'est pas disponible');
      return room;
    }

    if (!room.id) {
      logger.error('Tentative de sauvegarde d\'une pièce sans ID');
      if (!silent) toast.error('Erreur de stockage : pièce sans identifiant');
      return room;
    }

    try {
      const transaction = db.transaction('rooms', 'readwrite');
      const store = transaction.objectStore('rooms');
      
      // Vérifier si la pièce existe déjà
      const getRequest = store.get(room.id);
      
      return new Promise((resolve, reject) => {
        getRequest.onsuccess = () => {
          const existingRoom = getRequest.result as Room | undefined;
          
          // Mettre à jour ou ajouter
          const addRequest = store.put(room);
          
          addRequest.onsuccess = () => {
            const operation = existingRoom ? 'mise à jour' : 'ajoutée';
            logger.info(`Pièce ${room.id} ${operation} dans IndexedDB`);
            
            if (!silent && !isSilent) {
              const message = `Pièce ${operation} : ${room.name}`;
              toast.success(message);
            }
            
            resolve(room);
          };
          
          addRequest.onerror = () => {
            logger.error(`Erreur lors de la sauvegarde de la pièce ${room.id}`, addRequest.error);
            if (!silent) toast.error(`Erreur lors de la sauvegarde de la pièce ${room.name}`);
            reject(addRequest.error);
          };
        };
        
        getRequest.onerror = () => {
          logger.error(`Erreur lors de la vérification de l'existence de la pièce ${room.id}`, getRequest.error);
          if (!silent) toast.error(`Erreur lors de la vérification de l'existence de la pièce ${room.name}`);
          reject(getRequest.error);
        };
      });
      
    } catch (error) {
      logger.error(`Erreur lors de l'accès à IndexedDB pour saveRoom ${room.id}`, error as Error);
      if (!silent) toast.error(`Erreur de stockage pour la pièce ${room.name}`);
      return room;
    }
  }, [db, isDbAvailable, logger, isSilent]);

  const deleteRoom = useCallback(async (id: string, silent: boolean = false): Promise<void> => {
    if (!db || !isDbAvailable) {
      logger.warn('IndexedDB non disponible pour deleteRoom');
      if (!silent) toast.error('Erreur de suppression : la base de données n\'est pas disponible');
      return;
    }

    try {
      const transaction = db.transaction('rooms', 'readwrite');
      const store = transaction.objectStore('rooms');
      
      // Récupérer d'abord la pièce pour afficher son nom dans la notification
      const getRequest = store.get(id);
      
      getRequest.onsuccess = () => {
        const room = getRequest.result as Room | undefined;
        const roomName = room ? room.name : id;
        
        const deleteRequest = store.delete(id);
        
        deleteRequest.onsuccess = () => {
          logger.info(`Pièce ${id} supprimée de IndexedDB`);
          if (!silent && !isSilent) {
            toast.success(`Pièce supprimée : ${roomName}`);
          }
        };
        
        deleteRequest.onerror = () => {
          logger.error(`Erreur lors de la suppression de la pièce ${id}`, deleteRequest.error);
          if (!silent) toast.error(`Erreur lors de la suppression de la pièce ${roomName}`);
        };
      };
      
      getRequest.onerror = () => {
        logger.error(`Erreur lors de la récupération de la pièce ${id} pour suppression`, getRequest.error);
        if (!silent) toast.error(`Erreur lors de la suppression de la pièce ${id}`);
      };
      
    } catch (error) {
      logger.error(`Erreur lors de l'accès à IndexedDB pour deleteRoom ${id}`, error as Error);
      if (!silent) toast.error(`Erreur lors de la suppression de la pièce ${id}`);
    }
  }, [db, isDbAvailable, logger, isSilent]);

  const resetRooms = useCallback(async (silent: boolean = false): Promise<void> => {
    if (!db || !isDbAvailable) {
      logger.warn('IndexedDB non disponible pour resetRooms');
      if (!silent) toast.error('Erreur de réinitialisation : la base de données n\'est pas disponible');
      return;
    }

    try {
      const transaction = db.transaction('rooms', 'readwrite');
      const store = transaction.objectStore('rooms');
      const request = store.clear();

      request.onsuccess = () => {
        logger.info('Toutes les pièces ont été supprimées de IndexedDB');
        if (!silent && !isSilent) {
          toast.success('Toutes les pièces ont été supprimées');
        }
      };

      request.onerror = () => {
        logger.error('Erreur lors de la suppression de toutes les pièces', request.error);
        if (!silent) toast.error('Erreur lors de la suppression de toutes les pièces');
      };
    } catch (error) {
      logger.error('Erreur lors de l\'accès à IndexedDB pour resetRooms', error as Error);
      if (!silent) toast.error('Erreur lors de la réinitialisation des pièces');
    }
  }, [db, isDbAvailable, logger, isSilent]);

  return {
    isDbAvailable,
    isLoading,
    isInitialized,
    error,
    getAllRooms,
    getRoom,
    saveRoom,
    deleteRoom,
    resetRooms,
    setSilentOperation,
    runSilently
  };
};
