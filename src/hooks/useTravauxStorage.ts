
import { useState, useEffect, useCallback } from 'react';
import { Travail } from '@/types';
import { useLogger } from './useLogger';
import { useIndexedDB } from './useIndexedDB';
import { toast } from 'sonner';
import { useSilentOperation } from './useSilentOperation';

export const useTravauxStorage = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const { db, isDbAvailable, isLoading, error } = useIndexedDB();
  const logger = useLogger('TravauxStorage');
  const { isSilent, setSilentOperation, runSilently } = useSilentOperation();

  // Initialiser la base de données
  useEffect(() => {
    if (db && !isInitialized) {
      const initializeDB = async () => {
        try {
          if (!db.objectStoreNames.contains('travaux')) {
            // Cette méthode ne sera pas appelée car la table est créée à l'initialisation de IndexedDB
            // Mais c'est une bonne pratique de le vérifier
            logger.info('Table "travaux" créée dans IndexedDB');
          }
          setIsInitialized(true);
        } catch (error) {
          logger.error('Erreur lors de l\'initialisation de la table "travaux"', error as Error);
        }
      };

      initializeDB();
    }
  }, [db, isInitialized, logger]);

  const getAllTravaux = useCallback(async (): Promise<Travail[]> => {
    if (!db || !isDbAvailable) {
      logger.warn('IndexedDB non disponible pour getAllTravaux');
      return [];
    }

    try {
      const transaction = db.transaction('travaux', 'readonly');
      const store = transaction.objectStore('travaux');
      const request = store.getAll();

      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          logger.info(`${request.result.length} travaux récupérés depuis IndexedDB`);
          resolve(request.result as Travail[]);
        };
        request.onerror = () => {
          logger.error('Erreur lors de la récupération des travaux', request.error);
          reject(request.error);
        };
      });
    } catch (error) {
      logger.error('Erreur lors de l\'accès à IndexedDB pour getAllTravaux', error as Error);
      return [];
    }
  }, [db, isDbAvailable, logger]);

  const getTravail = useCallback(async (id: string): Promise<Travail | null> => {
    if (!db || !isDbAvailable) {
      logger.warn('IndexedDB non disponible pour getTravail');
      return null;
    }

    try {
      const transaction = db.transaction('travaux', 'readonly');
      const store = transaction.objectStore('travaux');
      const request = store.get(id);

      return new Promise((resolve, reject) => {
        request.onsuccess = () => {
          if (request.result) {
            logger.info(`Travail ${id} récupéré depuis IndexedDB`);
            resolve(request.result as Travail);
          } else {
            logger.warn(`Travail ${id} non trouvé dans IndexedDB`);
            resolve(null);
          }
        };
        request.onerror = () => {
          logger.error(`Erreur lors de la récupération du travail ${id}`, request.error);
          reject(request.error);
        };
      });
    } catch (error) {
      logger.error(`Erreur lors de l'accès à IndexedDB pour getTravail ${id}`, error as Error);
      return null;
    }
  }, [db, isDbAvailable, logger]);

  const saveTravail = useCallback(async (travail: Travail, silent: boolean = false): Promise<Travail> => {
    if (!db || !isDbAvailable) {
      logger.warn('IndexedDB non disponible pour saveTravail');
      if (!silent) toast.error('Erreur de stockage : la base de données n\'est pas disponible');
      return travail;
    }

    if (!travail.id) {
      logger.error('Tentative de sauvegarde d\'un travail sans ID');
      if (!silent) toast.error('Erreur de stockage : travail sans identifiant');
      return travail;
    }

    try {
      const transaction = db.transaction('travaux', 'readwrite');
      const store = transaction.objectStore('travaux');
      
      // Vérifier si le travail existe déjà
      const getRequest = store.get(travail.id);
      
      return new Promise((resolve, reject) => {
        getRequest.onsuccess = () => {
          const existingTravail = getRequest.result as Travail | undefined;
          
          // Mettre à jour ou ajouter
          const addRequest = store.put(travail);
          
          addRequest.onsuccess = () => {
            const operation = existingTravail ? 'mis à jour' : 'ajouté';
            logger.info(`Travail ${travail.id} ${operation} dans IndexedDB`);
            
            if (!silent && !isSilent) {
              const message = `Travail ${operation} : ${travail.typeTravauxLabel} - ${travail.sousTypeLabel || 'N/A'}`;
              toast.success(message);
            }
            
            resolve(travail);
          };
          
          addRequest.onerror = () => {
            logger.error(`Erreur lors de la sauvegarde du travail ${travail.id}`, addRequest.error);
            if (!silent) toast.error(`Erreur lors de la sauvegarde du travail`);
            reject(addRequest.error);
          };
        };
        
        getRequest.onerror = () => {
          logger.error(`Erreur lors de la vérification de l'existence du travail ${travail.id}`, getRequest.error);
          if (!silent) toast.error(`Erreur lors de la vérification de l'existence du travail`);
          reject(getRequest.error);
        };
      });
      
    } catch (error) {
      logger.error(`Erreur lors de l'accès à IndexedDB pour saveTravail ${travail.id}`, error as Error);
      if (!silent) toast.error(`Erreur de stockage pour le travail`);
      return travail;
    }
  }, [db, isDbAvailable, logger, isSilent]);

  const deleteTravail = useCallback(async (id: string, silent: boolean = false): Promise<void> => {
    if (!db || !isDbAvailable) {
      logger.warn('IndexedDB non disponible pour deleteTravail');
      if (!silent) toast.error('Erreur de suppression : la base de données n\'est pas disponible');
      return;
    }

    try {
      const transaction = db.transaction('travaux', 'readwrite');
      const store = transaction.objectStore('travaux');
      
      // Récupérer d'abord le travail pour afficher son type dans la notification
      const getRequest = store.get(id);
      
      getRequest.onsuccess = () => {
        const travail = getRequest.result as Travail | undefined;
        const travailType = travail ? (travail.typeTravauxLabel || 'Unknown') : id;
        
        const deleteRequest = store.delete(id);
        
        deleteRequest.onsuccess = () => {
          logger.info(`Travail ${id} supprimé de IndexedDB`);
          if (!silent && !isSilent) {
            toast.success(`Travail supprimé : ${travailType}`);
          }
        };
        
        deleteRequest.onerror = () => {
          logger.error(`Erreur lors de la suppression du travail ${id}`, deleteRequest.error);
          if (!silent) toast.error(`Erreur lors de la suppression du travail ${travailType}`);
        };
      };
      
      getRequest.onerror = () => {
        logger.error(`Erreur lors de la récupération du travail ${id} pour suppression`, getRequest.error);
        if (!silent) toast.error(`Erreur lors de la suppression du travail ${id}`);
      };
      
    } catch (error) {
      logger.error(`Erreur lors de l'accès à IndexedDB pour deleteTravail ${id}`, error as Error);
      if (!silent) toast.error(`Erreur lors de la suppression du travail ${id}`);
    }
  }, [db, isDbAvailable, logger, isSilent]);

  const resetTravaux = useCallback(async (silent: boolean = false): Promise<void> => {
    if (!db || !isDbAvailable) {
      logger.warn('IndexedDB non disponible pour resetTravaux');
      if (!silent) toast.error('Erreur de réinitialisation : la base de données n\'est pas disponible');
      return;
    }

    try {
      const transaction = db.transaction('travaux', 'readwrite');
      const store = transaction.objectStore('travaux');
      const request = store.clear();

      request.onsuccess = () => {
        logger.info('Tous les travaux ont été supprimés de IndexedDB');
        if (!silent && !isSilent) {
          toast.success('Tous les travaux ont été supprimés');
        }
      };

      request.onerror = () => {
        logger.error('Erreur lors de la suppression de tous les travaux', request.error);
        if (!silent) toast.error('Erreur lors de la suppression de tous les travaux');
      };
    } catch (error) {
      logger.error('Erreur lors de l\'accès à IndexedDB pour resetTravaux', error as Error);
      if (!silent) toast.error('Erreur lors de la réinitialisation des travaux');
    }
  }, [db, isDbAvailable, logger, isSilent]);

  return {
    isDbAvailable,
    isLoading,
    isInitialized,
    error,
    getAllTravaux,
    getTravail,
    saveTravail,
    deleteTravail,
    resetTravaux,
    setSilentOperation,
    runSilently
  };
};
