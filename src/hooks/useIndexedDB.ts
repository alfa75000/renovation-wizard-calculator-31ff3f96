import { useState, useEffect, useCallback } from 'react';
import db from '@/services/dbService';
import { useLogger } from './useLogger';

/**
 * Hook personnalisé pour gérer l'accès à IndexedDB avec fallback vers localStorage
 */
export function useIndexedDB<T>(
  storeName: string, 
  localStorageKey: string
): {
  isDbAvailable: boolean;
  isLoading: boolean;
  error: Error | null;
  getAllItems: () => Promise<T[]>;
  getItem: (id: string) => Promise<T | undefined>;
  addItem: (item: T) => Promise<string>;
  updateItem: (id: string, item: T) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  clearItems: () => Promise<void>;
  syncFromLocalStorage: (items: T[]) => Promise<void>;
} {
  const logger = useLogger('useIndexedDB');
  const [isDbAvailable, setIsDbAvailable] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Vérifier si IndexedDB est disponible
  useEffect(() => {
    const checkDbAvailability = async () => {
      try {
        const available = await db.isAvailable();
        setIsDbAvailable(available);
        logger.info(`IndexedDB est ${available ? 'disponible' : 'indisponible'}`, 'system');
      } catch (err) {
        setIsDbAvailable(false);
        setError(err as Error);
        logger.error('Erreur lors de la vérification de la disponibilité d\'IndexedDB', err as Error, 'system');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkDbAvailability();
  }, []);
  
  // Fonction pour récupérer tous les éléments
  const getAllItems = useCallback(async (): Promise<T[]> => {
    if (!isDbAvailable) {
      // Fallback vers localStorage
      try {
        const items = localStorage.getItem(localStorageKey);
        if (items) {
          return JSON.parse(items);
        }
        return [];
      } catch (err) {
        logger.error(`Erreur lors de la récupération des éléments depuis localStorage (${localStorageKey})`, err as Error, 'storage');
        throw err;
      }
    }
    
    try {
      // @ts-ignore - Accès dynamique à la propriété de db
      return await db[storeName].toArray();
    } catch (err) {
      logger.error(`Erreur lors de la récupération des éléments depuis IndexedDB (${storeName})`, err as Error, 'storage');
      throw err;
    }
  }, [isDbAvailable, localStorageKey, storeName]);
  
  // Fonction pour récupérer un élément par ID
  const getItem = useCallback(async (id: string): Promise<T | undefined> => {
    if (!isDbAvailable) {
      // Fallback vers localStorage
      try {
        const items = localStorage.getItem(localStorageKey);
        if (items) {
          const parsedItems = JSON.parse(items) as T[];
          // @ts-ignore - Accès à la propriété id
          return parsedItems.find(item => item.id === id);
        }
        return undefined;
      } catch (err) {
        logger.error(`Erreur lors de la récupération d'un élément depuis localStorage (${localStorageKey})`, err as Error, 'storage');
        throw err;
      }
    }
    
    try {
      // @ts-ignore - Accès dynamique à la propriété de db
      return await db[storeName].get(id);
    } catch (err) {
      logger.error(`Erreur lors de la récupération d'un élément depuis IndexedDB (${storeName})`, err as Error, 'storage');
      throw err;
    }
  }, [isDbAvailable, localStorageKey, storeName]);
  
  // Fonction pour ajouter un élément
  const addItem = useCallback(async (item: T): Promise<string> => {
    if (!isDbAvailable) {
      // Fallback vers localStorage
      try {
        const items = localStorage.getItem(localStorageKey);
        const parsedItems = items ? JSON.parse(items) as T[] : [];
        parsedItems.push(item);
        localStorage.setItem(localStorageKey, JSON.stringify(parsedItems));
        // @ts-ignore - Accès à la propriété id
        return item.id;
      } catch (err) {
        logger.error(`Erreur lors de l'ajout d'un élément dans localStorage (${localStorageKey})`, err as Error, 'storage');
        throw err;
      }
    }
    
    try {
      // @ts-ignore - Accès dynamique à la propriété de db
      const id = await db[storeName].add(item);
      return id as string;
    } catch (err) {
      logger.error(`Erreur lors de l'ajout d'un élément dans IndexedDB (${storeName})`, err as Error, 'storage');
      throw err;
    }
  }, [isDbAvailable, localStorageKey, storeName]);
  
  // Fonction pour mettre à jour un élément
  const updateItem = useCallback(async (id: string, item: T): Promise<void> => {
    if (!isDbAvailable) {
      // Fallback vers localStorage
      try {
        const items = localStorage.getItem(localStorageKey);
        if (items) {
          const parsedItems = JSON.parse(items) as T[];
          // @ts-ignore - Accès à la propriété id
          const itemIndex = parsedItems.findIndex(i => i.id === id);
          
          if (itemIndex !== -1) {
            parsedItems[itemIndex] = item;
            localStorage.setItem(localStorageKey, JSON.stringify(parsedItems));
          } else {
            throw new Error(`Élément avec l'ID ${id} non trouvé`);
          }
        } else {
          throw new Error(`Clé localStorage ${localStorageKey} non trouvée`);
        }
      } catch (err) {
        logger.error(`Erreur lors de la mise à jour d'un élément dans localStorage (${localStorageKey})`, err as Error, 'storage');
        throw err;
      }
    }
    
    try {
      // @ts-ignore - Accès dynamique à la propriété de db
      await db[storeName].update(id, item);
    } catch (err) {
      logger.error(`Erreur lors de la mise à jour d'un élément dans IndexedDB (${storeName})`, err as Error, 'storage');
      throw err;
    }
  }, [isDbAvailable, localStorageKey, storeName]);
  
  // Fonction pour supprimer un élément
  const deleteItem = useCallback(async (id: string): Promise<void> => {
    if (!isDbAvailable) {
      // Fallback vers localStorage
      try {
        const items = localStorage.getItem(localStorageKey);
        if (items) {
          const parsedItems = JSON.parse(items) as T[];
          // @ts-ignore - Accès à la propriété id
          const filteredItems = parsedItems.filter(item => item.id !== id);
          localStorage.setItem(localStorageKey, JSON.stringify(filteredItems));
        }
      } catch (err) {
        logger.error(`Erreur lors de la suppression d'un élément dans localStorage (${localStorageKey})`, err as Error, 'storage');
        throw err;
      }
    }
    
    try {
      // @ts-ignore - Accès dynamique à la propriété de db
      await db[storeName].delete(id);
    } catch (err) {
      logger.error(`Erreur lors de la suppression d'un élément dans IndexedDB (${storeName})`, err as Error, 'storage');
      throw err;
    }
  }, [isDbAvailable, localStorageKey, storeName]);
  
  // Fonction pour vider complètement une table
  const clearItems = useCallback(async (): Promise<void> => {
    if (!isDbAvailable) {
      // Fallback vers localStorage
      try {
        localStorage.removeItem(localStorageKey);
        logger.info(`Suppression des données de ${localStorageKey} dans localStorage`, 'storage');
      } catch (err) {
        logger.error(`Erreur lors de la suppression des données de ${localStorageKey} dans localStorage`, err as Error, 'storage');
        throw err;
      }
      return;
    }
    
    try {
      // @ts-ignore - Accès dynamique à la propriété de db
      await db[storeName].clear();
      logger.info(`Table ${storeName} vidée dans IndexedDB`, 'storage');
    } catch (err) {
      logger.error(`Erreur lors du vidage de la table ${storeName} dans IndexedDB`, err as Error, 'storage');
      throw err;
    }
  }, [isDbAvailable, storeName, localStorageKey]);
  
  // Fonction pour synchroniser depuis localStorage
  const syncFromLocalStorage = useCallback(async (items: T[]): Promise<void> => {
    if (!isDbAvailable) {
      return; // Pas besoin de synchroniser si IndexedDB n'est pas disponible
    }
    
    try {
      // @ts-ignore - Méthode similaire à celle du db.ts
      await db.transaction('rw', db[storeName], async () => {
        // @ts-ignore - Obtenir les IDs existants
        const existingItems = await db[storeName].toArray();
        // @ts-ignore - Accès à la propriété id
        const existingIds = new Set(existingItems.map(item => item.id));
        
        // Ajouter ou mettre à jour les éléments
        for (const item of items) {
          // @ts-ignore - Accès à la propriété id
          if (existingIds.has(item.id)) {
            // @ts-ignore - Accès à la propriété id et mise à jour
            await db[storeName].update(item.id, item);
          } else {
            // @ts-ignore - Ajout de l'élément
            await db[storeName].add(item);
          }
        }
        
        // Supprimer les éléments qui ne sont plus dans localStorage
        // @ts-ignore - Accès à la propriété id
        const localStorageIds = new Set(items.map(item => item.id));
        for (const existingItem of existingItems) {
          // @ts-ignore - Accès à la propriété id
          if (!localStorageIds.has(existingItem.id)) {
            // @ts-ignore - Suppression par id
            await db[storeName].delete(existingItem.id);
          }
        }
      });
      
      logger.info(`Synchronisation de ${items.length} éléments depuis localStorage vers IndexedDB (${storeName})`, 'storage');
    } catch (err) {
      logger.error(`Erreur lors de la synchronisation depuis localStorage vers IndexedDB (${storeName})`, err as Error, 'storage');
      throw err;
    }
  }, [isDbAvailable, storeName]);
  
  return {
    isDbAvailable,
    isLoading,
    error,
    getAllItems,
    getItem,
    addItem,
    updateItem,
    deleteItem,
    clearItems,
    syncFromLocalStorage
  };
}
