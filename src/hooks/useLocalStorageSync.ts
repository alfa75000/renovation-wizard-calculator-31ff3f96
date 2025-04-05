
import { useEffect } from 'react';

// Hook personnalisé pour synchroniser les données avec localStorage
export const useLocalStorageSync = <T,>(key: string, data: T) => {
  // Synchroniser les données avec localStorage quand elles changent
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
      console.log(`Données ${key} synchronisées avec localStorage`, data);
    } catch (error) {
      console.error(`Erreur lors de la synchronisation des données ${key}:`, error);
    }
  }, [key, data]);

  // Helper pour charger les données depuis localStorage
  const loadFromLocalStorage = (): T | null => {
    try {
      const savedData = localStorage.getItem(key);
      if (savedData) {
        return JSON.parse(savedData) as T;
      }
    } catch (error) {
      console.error(`Erreur lors du chargement des données ${key}:`, error);
    }
    return null;
  };

  return { loadFromLocalStorage };
};
