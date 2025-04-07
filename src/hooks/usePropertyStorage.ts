
import { useState, useEffect, useCallback } from 'react';
import { PropertyType } from '@/types';
import { useLogger } from './useLogger';
import db from '@/services/dbService';

/**
 * Hook personnalisé pour gérer le stockage des informations sur la propriété
 */
export function usePropertyStorage() {
  const logger = useLogger('usePropertyStorage');
  const LOCAL_STORAGE_KEY = 'property';
  
  const [isDbAvailable, setIsDbAvailable] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [isInitialized, setIsInitialized] = useState<boolean>(false);
  
  // Vérifier la disponibilité d'IndexedDB
  useEffect(() => {
    const checkDbAvailability = async () => {
      try {
        const available = await db.isAvailable();
        setIsDbAvailable(available);
      } catch (err) {
        setIsDbAvailable(false);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkDbAvailability();
  }, []);
  
  // Fonction pour récupérer les propriétés du bien
  const getProperty = useCallback(async (): Promise<PropertyType | null> => {
    if (!isDbAvailable) {
      try {
        const propertyJson = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (propertyJson) {
          return JSON.parse(propertyJson) as PropertyType;
        }
        return null;
      } catch (err) {
        logger.error('Erreur lors de la récupération des propriétés du bien depuis localStorage', err as Error, 'storage');
        throw err;
      }
    }
    
    try {
      const property = await db.getPropertyInfo();
      return property;
    } catch (err) {
      logger.error('Erreur lors de la récupération des propriétés du bien depuis IndexedDB', err as Error, 'storage');
      throw err;
    }
  }, [isDbAvailable, logger]);
  
  // Fonction pour sauvegarder les propriétés du bien
  const saveProperty = useCallback(async (property: PropertyType): Promise<void> => {
    if (!isDbAvailable) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(property));
        logger.info('Propriétés du bien sauvegardées dans localStorage', 'storage');
      } catch (err) {
        logger.error('Erreur lors de la sauvegarde des propriétés du bien dans localStorage', err as Error, 'storage');
        throw err;
      }
      return;
    }
    
    try {
      await db.savePropertyInfo(property);
      
      // Sauvegarder aussi dans localStorage comme backup
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(property));
      
      logger.info('Propriétés du bien sauvegardées dans IndexedDB et localStorage', 'storage');
    } catch (err) {
      logger.error('Erreur lors de la sauvegarde des propriétés du bien dans IndexedDB', err as Error, 'storage');
      
      // Fallback vers localStorage en cas d'erreur
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(property));
        logger.warn('Fallback: Propriétés du bien sauvegardées uniquement dans localStorage', 'storage');
      } catch (localErr) {
        logger.error('Erreur critique: Échec de sauvegarde dans IndexedDB et localStorage', localErr as Error, 'storage');
        throw localErr;
      }
    }
  }, [isDbAvailable, logger]);
  
  // Fonction pour initialiser la synchronisation
  const initializeSync = useCallback(async () => {
    if (!isDbAvailable || isLoading) return;
    
    try {
      const propertyJson = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (propertyJson) {
        const property = JSON.parse(propertyJson) as PropertyType;
        
        // Synchroniser avec IndexedDB
        await db.syncPropertyFromLocalStorage(property);
        logger.info('Propriétés du bien synchronisées depuis localStorage vers IndexedDB', 'storage');
      }
      
      setIsInitialized(true);
    } catch (err) {
      logger.error('Erreur lors de l\'initialisation de la synchronisation des propriétés du bien', err as Error, 'storage');
    }
  }, [isDbAvailable, isLoading, logger]);
  
  // Initialiser la synchronisation lors du premier chargement
  useEffect(() => {
    if (!isInitialized && isDbAvailable && !isLoading) {
      initializeSync();
    }
  }, [isInitialized, isDbAvailable, isLoading, initializeSync]);
  
  return {
    isDbAvailable,
    isLoading,
    isInitialized,
    error,
    getProperty,
    saveProperty
  };
}
