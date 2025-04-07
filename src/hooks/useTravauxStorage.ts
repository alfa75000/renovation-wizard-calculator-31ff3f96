
import { useState, useEffect, useCallback } from 'react';
import { Travail } from '@/types';
import { useIndexedDB } from './useIndexedDB';
import { useLogger } from './useLogger';

/**
 * Hook personnalisé pour gérer le stockage des travaux avec IndexedDB et fallback localStorage
 */
export function useTravauxStorage() {
  const logger = useLogger('useTravauxStorage');
  const LOCAL_STORAGE_KEY = 'travaux';
  
  const {
    isDbAvailable,
    isLoading,
    error,
    getAllItems: getAllTravaux,
    getItem: getTravail,
    addItem: addTravail,
    updateItem: updateTravail,
    deleteItem: deleteTravail,
    syncFromLocalStorage
  } = useIndexedDB<Travail>('travaux', LOCAL_STORAGE_KEY);
  
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  
  // Fonction pour initialiser la synchronisation entre localStorage et IndexedDB
  const initializeSync = useCallback(async () => {
    if (!isDbAvailable || isLoading) return;
    
    try {
      // Récupérer les travaux depuis localStorage
      const travauxJson = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (travauxJson) {
        const travaux = JSON.parse(travauxJson) as Travail[];
        if (Array.isArray(travaux) && travaux.length > 0) {
          // Synchroniser avec IndexedDB
          await syncFromLocalStorage(travaux);
          logger.info(`${travaux.length} travaux synchronisés depuis localStorage vers IndexedDB`, 'storage');
        } else {
          logger.info('Aucun travail trouvé dans localStorage pour synchronisation', 'storage');
        }
      }
      
      setIsInitialized(true);
    } catch (error) {
      logger.error('Erreur lors de l\'initialisation de la synchronisation des travaux', error as Error, 'storage');
    }
  }, [isDbAvailable, isLoading, syncFromLocalStorage, logger]);
  
  // Initialiser la synchronisation lors du premier chargement
  useEffect(() => {
    if (!isInitialized && isDbAvailable && !isLoading) {
      initializeSync();
    }
  }, [isInitialized, isDbAvailable, isLoading, initializeSync]);
  
  // Méthode simplifiée pour ajouter ou mettre à jour un travail
  const saveTravail = useCallback(async (travail: Travail): Promise<void> => {
    if (!travail.id) {
      throw new Error('Impossible de sauvegarder un travail sans ID');
    }
    
    try {
      const existingTravail = await getTravail(travail.id);
      if (existingTravail) {
        await updateTravail(travail.id, travail);
        logger.debug(`Travail mis à jour: ${travail.id}`, 'storage');
      } else {
        await addTravail(travail);
        logger.debug(`Nouveau travail ajouté: ${travail.id}`, 'storage');
      }
    } catch (err) {
      logger.error('Erreur lors de la sauvegarde d\'un travail', err as Error, 'storage');
      throw err;
    }
  }, [addTravail, updateTravail, getTravail, logger]);
  
  // Récupérer les travaux pour une pièce spécifique
  const getTravauxForPiece = useCallback(async (pieceId: string): Promise<Travail[]> => {
    try {
      const allTravaux = await getAllTravaux();
      return allTravaux.filter(travail => travail.pieceId === pieceId);
    } catch (err) {
      logger.error(`Erreur lors de la récupération des travaux pour la pièce ${pieceId}`, err as Error, 'storage');
      throw err;
    }
  }, [getAllTravaux, logger]);
  
  return {
    isDbAvailable,
    isLoading,
    isInitialized,
    error,
    getAllTravaux,
    getTravail,
    saveTravail,
    deleteTravail,
    getTravauxForPiece,
    syncFromLocalStorage
  };
}
