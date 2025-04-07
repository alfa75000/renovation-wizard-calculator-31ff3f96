
import { useState, useEffect, useCallback } from 'react';
import { Travail } from '@/types';
import { useIndexedDB } from './useIndexedDB';
import { useLogger } from './useLogger';
import { toast } from 'sonner';

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
    deleteItem: deleteTravailInternal,
    clearItems: clearTravaux,
    syncFromLocalStorage
  } = useIndexedDB<Travail>('travaux', LOCAL_STORAGE_KEY);
  
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  const [isSilentOperation, setIsSilentOperation] = useState<boolean>(false);
  
  // Fonction pour initialiser la synchronisation entre localStorage et IndexedDB
  const initializeSync = useCallback(async () => {
    if (!isDbAvailable || isLoading) return;
    
    try {
      setIsSilentOperation(true);
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
  
  // Méthode simplifiée pour ajouter ou mettre à jour un travail
  const saveTravail = useCallback(async (travail: Travail, silent = false): Promise<void> => {
    if (!travail.id) {
      throw new Error('Impossible de sauvegarder un travail sans ID');
    }
    
    const prevSilentState = isSilentOperation;
    if (silent) setIsSilentOperation(true);
    
    try {
      const existingTravail = await getTravail(travail.id);
      if (existingTravail) {
        await updateTravail(travail.id, travail);
        logger.debug(`Travail mis à jour: ${travail.id}`, 'storage');
        if (!isSilentOperation) {
          toast.success(`Travail mis à jour: ${travail.designation}`);
        }
      } else {
        await addTravail(travail);
        logger.debug(`Nouveau travail ajouté: ${travail.id}`, 'storage');
        if (!isSilentOperation) {
          toast.success(`Nouveau travail ajouté: ${travail.designation}`);
        }
      }
    } catch (err) {
      logger.error('Erreur lors de la sauvegarde d\'un travail', err as Error, 'storage');
      if (!isSilentOperation) {
        toast.error(`Erreur lors de la sauvegarde du travail: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
      }
      throw err;
    } finally {
      if (silent) setIsSilentOperation(prevSilentState);
    }
  }, [addTravail, updateTravail, getTravail, logger, isSilentOperation]);
  
  // Méthode pour supprimer un travail
  const deleteTravail = useCallback(async (id: string, silent = false): Promise<void> => {
    const prevSilentState = isSilentOperation;
    if (silent) setIsSilentOperation(true);
    
    try {
      const travailToDelete = await getTravail(id);
      if (travailToDelete) {
        await deleteTravailInternal(id);
        logger.info(`Travail supprimé: ${id}`, 'storage');
        if (!isSilentOperation) {
          toast.success(`Travail supprimé: ${travailToDelete.designation}`);
        }
      } else {
        logger.warn(`Tentative de suppression d'un travail inexistant: ${id}`, 'storage');
      }
    } catch (err) {
      logger.error(`Erreur lors de la suppression du travail ${id}`, err as Error, 'storage');
      if (!isSilentOperation) {
        toast.error(`Erreur lors de la suppression du travail: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
      }
      throw err;
    } finally {
      if (silent) setIsSilentOperation(prevSilentState);
    }
  }, [deleteTravailInternal, getTravail, logger, isSilentOperation]);
  
  // Récupérer les travaux pour une pièce spécifique
  const getTravauxForPiece = useCallback(async (pieceId: string): Promise<Travail[]> => {
    try {
      const allTravaux = await getAllTravaux();
      return allTravaux.filter(travail => travail.pieceId === pieceId);
    } catch (err) {
      logger.error(`Erreur lors de la récupération des travaux pour la pièce ${pieceId}`, err as Error, 'storage');
      if (!isSilentOperation) {
        toast.error(`Erreur lors de la récupération des travaux: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
      }
      throw err;
    }
  }, [getAllTravaux, logger, isSilentOperation]);
  
  // Méthode pour supprimer tous les travaux
  const resetTravaux = useCallback(async (silent = false): Promise<void> => {
    const prevSilentState = isSilentOperation;
    if (silent) setIsSilentOperation(true);
    
    try {
      await clearTravaux();
      logger.info('Tous les travaux ont été supprimés', 'storage');
      if (!isSilentOperation) {
        toast.success('Tous les travaux ont été supprimés');
      }
    } catch (err) {
      logger.error('Erreur lors de la suppression de tous les travaux', err as Error, 'storage');
      if (!isSilentOperation) {
        toast.error(`Erreur lors de la suppression des travaux: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
      }
      throw err;
    } finally {
      if (silent) setIsSilentOperation(prevSilentState);
    }
  }, [clearTravaux, logger, isSilentOperation]);
  
  return {
    isDbAvailable,
    isLoading,
    isInitialized,
    error,
    getAllTravaux,
    getTravail,
    saveTravail,
    deleteTravail,
    clearTravaux,
    resetTravaux,
    getTravauxForPiece,
    syncFromLocalStorage,
    setSilentOperation: setIsSilentOperation
  };
}
