
import { useEffect } from 'react';

// Hook personnalisé pour synchroniser les données avec localStorage
export const useLocalStorageSync = <T,>(key: string, data: T) => {
  // Synchroniser les données avec localStorage quand elles changent
  useEffect(() => {
    try {
      // Vérifier si les données sont définies avant de les stocker
      if (data !== undefined && data !== null) {
        const dataString = JSON.stringify(data);
        localStorage.setItem(key, dataString);
        console.log(`Données ${key} synchronisées avec localStorage:`, data);
      }
    } catch (error) {
      console.error(`Erreur lors de la synchronisation des données ${key}:`, error);
    }
  }, [key, data]);

  // Helper pour charger les données depuis localStorage
  const loadFromLocalStorage = (): T | null => {
    try {
      const savedData = localStorage.getItem(key);
      if (savedData) {
        const parsedData = JSON.parse(savedData) as T;
        console.log(`Données ${key} chargées depuis localStorage:`, parsedData);
        return parsedData;
      }
    } catch (error) {
      console.error(`Erreur lors du chargement des données ${key}:`, error);
    }
    return null;
  };

  // Forcer une sauvegarde manuelle
  const saveToLocalStorage = (valueToSave: T = data): void => {
    try {
      if (valueToSave !== undefined && valueToSave !== null) {
        localStorage.setItem(key, JSON.stringify(valueToSave));
        console.log(`Données ${key} sauvegardées manuellement:`, valueToSave);
      }
    } catch (error) {
      console.error(`Erreur lors de la sauvegarde manuelle des données ${key}:`, error);
    }
  };

  return { loadFromLocalStorage, saveToLocalStorage };
};
