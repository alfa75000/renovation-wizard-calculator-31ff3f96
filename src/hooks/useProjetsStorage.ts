
import { useState, useEffect, useCallback } from 'react';
import { ProjetChantier } from '@/types';
import { useIndexedDB } from './useIndexedDB';
import { useLogger } from './useLogger';
import { toast } from 'sonner';

/**
 * Hook personnalisé pour gérer le stockage des projets chantier avec IndexedDB et fallback localStorage
 */
export function useProjetsStorage() {
  const logger = useLogger('useProjetsStorage');
  const LOCAL_STORAGE_KEY = 'projetsChantier';
  
  const {
    isDbAvailable,
    isLoading,
    error,
    getAllItems: getAllProjets,
    getItem: getProjet,
    addItem: addProjet,
    updateItem: updateProjet,
    deleteItem: deleteProjet,
    clearItems: clearProjets,
    syncFromLocalStorage
  } = useIndexedDB<ProjetChantier>('projets', LOCAL_STORAGE_KEY);
  
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  
  // Fonction pour initialiser la synchronisation entre localStorage et IndexedDB
  const initializeSync = useCallback(async () => {
    if (!isDbAvailable || isLoading) return;
    
    try {
      // Récupérer les projets depuis localStorage
      const projetsJson = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (projetsJson) {
        const data = JSON.parse(projetsJson);
        if (data && data.projets && Array.isArray(data.projets) && data.projets.length > 0) {
          // Synchroniser avec IndexedDB
          await syncFromLocalStorage(data.projets);
          logger.info(`${data.projets.length} projets synchronisés depuis localStorage vers IndexedDB`, 'storage');
        } else {
          logger.info('Aucun projet trouvé dans localStorage pour synchronisation', 'storage');
        }
      }
      
      setIsInitialized(true);
    } catch (error) {
      logger.error('Erreur lors de l\'initialisation de la synchronisation des projets', error as Error, 'storage');
    }
  }, [isDbAvailable, isLoading, syncFromLocalStorage, logger]);
  
  // Initialiser la synchronisation lors du premier chargement
  useEffect(() => {
    if (!isInitialized && isDbAvailable && !isLoading) {
      initializeSync();
    }
  }, [isInitialized, isDbAvailable, isLoading, initializeSync]);
  
  // Méthode simplifiée pour ajouter ou mettre à jour un projet
  const saveProjet = useCallback(async (projet: ProjetChantier): Promise<void> => {
    if (!projet.id) {
      throw new Error('Impossible de sauvegarder un projet sans ID');
    }
    
    try {
      const existingProjet = await getProjet(projet.id);
      if (existingProjet) {
        await updateProjet(projet.id, projet);
        logger.debug(`Projet mis à jour: ${projet.id}`, 'storage');
        toast.success(`Projet mis à jour: ${projet.nomProjet}`);
      } else {
        await addProjet(projet);
        logger.debug(`Nouveau projet ajouté: ${projet.id}`, 'storage');
        toast.success(`Nouveau projet ajouté: ${projet.nomProjet}`);
      }
    } catch (err) {
      logger.error('Erreur lors de la sauvegarde d\'un projet', err as Error, 'storage');
      toast.error(`Erreur lors de la sauvegarde du projet: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
      throw err;
    }
  }, [addProjet, updateProjet, getProjet, logger]);
  
  // Récupérer les projets pour un client spécifique
  const getProjetsForClient = useCallback(async (clientId: string): Promise<ProjetChantier[]> => {
    try {
      const allProjets = await getAllProjets();
      return allProjets.filter(projet => projet.clientId === clientId);
    } catch (err) {
      logger.error(`Erreur lors de la récupération des projets pour le client ${clientId}`, err as Error, 'storage');
      toast.error(`Erreur lors de la récupération des projets: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
      throw err;
    }
  }, [getAllProjets, logger]);
  
  // Méthode pour supprimer tous les projets
  const resetProjets = useCallback(async (): Promise<void> => {
    try {
      await clearProjets();
      logger.info('Tous les projets ont été supprimés', 'storage');
      toast.success('Tous les projets ont été supprimés');
    } catch (err) {
      logger.error('Erreur lors de la suppression de tous les projets', err as Error, 'storage');
      toast.error(`Erreur lors de la suppression des projets: ${err instanceof Error ? err.message : 'Erreur inconnue'}`);
      throw err;
    }
  }, [clearProjets, logger]);
  
  return {
    isDbAvailable,
    isLoading,
    isInitialized,
    error,
    getAllProjets,
    getProjet,
    saveProjet,
    deleteProjet,
    clearProjets,
    resetProjets,
    getProjetsForClient,
    syncFromLocalStorage
  };
}
